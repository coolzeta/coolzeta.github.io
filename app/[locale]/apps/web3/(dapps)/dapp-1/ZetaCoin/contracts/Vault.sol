// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ZetaCoin.sol";
import "./Oracle.sol";

contract Vault is Ownable, ReentrancyGuard {
    ZetaCoin public zetaCoin;
    PriceOracle public oracle;
    uint constant DECIMAL_COUNT = 18;
    uint constant DECIMAL_PRECISION = 10 ** DECIMAL_COUNT; // 10^18

    uint256 public constant COLLATERAL_RATIO = 150; // 150% collateralization ratio
    uint256 public constant LIQUIDATION_THRESHOLD = 120; // 120% liquidation threshold
    uint256 public constant LIQUIDATION_PENALTY = 10; // 10% penalty
    uint256 public constant PRECISION = 100;

    struct VaultPosition {
        uint256 collateralAmount; // ETH amount in Wei
        uint256 debtAmount; // ZETA amount
        bool isBadDebt; // bad debt flag
    }

    mapping(address => VaultPosition) public vaults;
    uint256 public totalCollateral;
    uint256 public totalDebt;
    uint256 public totalBadDebt;

    event CollateralAdded(address indexed owner, uint256 amount);
    event CollateralRemoved(address indexed owner, uint256 amount);
    event DebtRepaid(address indexed owner, uint256 amount);
    event VaultLiquidated(
        address indexed owner,
        address indexed liquidator,
        uint256 collateralAmount,
        uint256 debtAmount
    );

    constructor(address _zetaCoin, address _oracle) Ownable(msg.sender) {
        zetaCoin = ZetaCoin(_zetaCoin);
        oracle = PriceOracle(_oracle);
    }

    function setZetaCoin(address _zetaCoin) external onlyOwner {
        zetaCoin = ZetaCoin(_zetaCoin);
    }

    function setOracle(address _oracle) external onlyOwner {
        oracle = PriceOracle(_oracle);
    }

    // deposit ETH into the vault
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Must deposit ETH");

        vaults[msg.sender].collateralAmount += msg.value;
        totalCollateral += msg.value;

        emit CollateralAdded(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        VaultPosition storage vault = vaults[msg.sender];
        require(amount > 0, "Amount must be greater than 0");
        require(vault.collateralAmount >= amount, "Insufficient collateral");

        uint256 newCollateralAmount = vault.collateralAmount - amount;
        require(
            isValidCollateralization(newCollateralAmount, vault.debtAmount),
            "Withdrawal would break collateral ratio"
        );

        vault.collateralAmount = newCollateralAmount;
        totalCollateral -= amount;

        (bool success, ) = msg.sender.call{ value: amount }("");
        require(success, "ETH transfer failed");

        emit CollateralRemoved(msg.sender, amount);
    }

    function borrowZeta(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        VaultPosition storage vault = vaults[msg.sender];
        require(vault.collateralAmount > 0, "No vault exists");

        uint256 newDebtAmount = vault.debtAmount + amount;
        require(
            isValidCollateralization(vault.collateralAmount, newDebtAmount),
            "Would exceed maximum borrowing capacity"
        );
        // Mint Zeta Coin to user, and increase the total debt
        vault.debtAmount = newDebtAmount;
        totalDebt += amount;

        zetaCoin.mint(msg.sender, amount);
    }

    function maxBrrowableZeta(address owner) public view returns (uint256) {
        VaultPosition memory vault = vaults[owner];
        uint256 ethPrice = oracle.getEthUsdPrice();
        uint256 collateralValue = (vault.collateralAmount * ethPrice) / DECIMAL_PRECISION;
        uint256 maxBorrow = (collateralValue * PRECISION) / COLLATERAL_RATIO;
        return maxBorrow > vault.debtAmount ? maxBorrow - vault.debtAmount : 0;
    }

    function repayZeta(uint256 amount) external nonReentrant {
        VaultPosition storage vault = vaults[msg.sender];
        require(amount > 0, "Amount must be greater than 0");
        require(vault.debtAmount >= amount, "Amount exceeds debt");

        vault.debtAmount -= amount;
        totalDebt -= amount;

        // Transfer Zeta Coin from user to this contract,
        // and burn the debt
        require(zetaCoin.transferFrom(msg.sender, address(this), amount), "Zeta Coin transfer failed");
        zetaCoin.burn(amount);

        emit DebtRepaid(msg.sender, amount);
    }

    function liquidate(address vaultOwner) external nonReentrant {
        VaultPosition storage vault = vaults[vaultOwner];
        require(vault.collateralAmount > 0, "Vault does not exist");
        require(isLiquidatable(vaultOwner), "Vault is not liquidatable");

        uint256 ethPrice = oracle.getEthUsdPrice();
        uint256 collateralValue = (vault.collateralAmount * ethPrice) / DECIMAL_PRECISION;
        uint256 debtValue = vault.debtAmount;

        // Calculate the maximum amount of debt that can be repaid,
        // If collateral value is too low, this maybe lower than current debt value
        // So it will become a bad debt after liquidation (still have debt but no collateral assects in this account)
        uint256 maxRepayableDebt = (collateralValue * PRECISION) / (LIQUIDATION_PENALTY + PRECISION);
        uint256 actualRepayDebt = debtValue > maxRepayableDebt ? maxRepayableDebt : debtValue;
        if (actualRepayDebt < debtValue) {
            vault.isBadDebt = true;
        }

        // Add penalty to the debt, so that the liquidator can get a reward
        // This will encourage more liquidator to liquidate the possible debts
        uint256 penalty = (maxRepayableDebt * LIQUIDATION_PENALTY) / PRECISION;
        uint256 collateralToLiquidator = ((maxRepayableDebt + penalty) * DECIMAL_PRECISION) / ethPrice;

        // Transfer Zeta Coin from liquidator to this contract,
        // And burn the debt
        require(zetaCoin.transferFrom(msg.sender, address(this), actualRepayDebt), "Zeta Coin transfer failed");
        zetaCoin.burn(debtValue);

        // Transfer collateral to liquidator
        (bool success, ) = msg.sender.call{ value: collateralToLiquidator }("");
        require(success, "ETH transfer failed");
        vault.collateralAmount -= collateralToLiquidator;

        totalDebt -= debtValue;
        vault.debtAmount = 0;

        emit VaultLiquidated(vaultOwner, msg.sender, collateralToLiquidator, debtValue);
    }

    function isValidCollateralization(uint256 collateralAmount, uint256 debtAmount) public view returns (bool) {
        if (debtAmount == 0) return true;
        uint256 ethPrice = oracle.getEthUsdPrice();
        uint256 collateralValue = (collateralAmount * ethPrice) / DECIMAL_PRECISION;
        uint256 requiredCollateral = (debtAmount * COLLATERAL_RATIO) / PRECISION;
        return collateralValue >= requiredCollateral;
    }

    function isLiquidatable(address vaultOwner) public view returns (bool) {
        VaultPosition memory vault = vaults[vaultOwner];
        if (vault.debtAmount == 0) return false;

        uint256 ethPrice = oracle.getEthUsdPrice();
        uint256 collateralValue = (vault.collateralAmount * ethPrice) / DECIMAL_PRECISION;
        uint256 minimumCollateral = (vault.debtAmount * LIQUIDATION_THRESHOLD) / PRECISION;
        return collateralValue < minimumCollateral;
    }

    function getVaultInfo(
        address owner
    )
        external
        view
        returns (uint256 collateralAmountOfVault, uint256 debtAmountOfVault, bool isLiquidatableOrNot, uint256 availableToBorrow)
    {
        VaultPosition memory vault = vaults[owner];
        uint256 ethPrice = oracle.getEthUsdPrice();
        uint256 collateralValue = (vault.collateralAmount * ethPrice) / DECIMAL_PRECISION;
        uint256 maxBorrow = (collateralValue * PRECISION) / COLLATERAL_RATIO;
        uint256 availableBorrow = maxBorrow > vault.debtAmount ? maxBorrow - vault.debtAmount : 0;

        return (vault.collateralAmount, vault.debtAmount, isLiquidatable(owner), availableBorrow);
    }

    function getVaultsInfo() external view returns (uint256 totalCollateralAmount, uint256 totalDebtAmount, uint256 totalBadDebtAmount) {
        return (totalCollateral, totalDebt, totalBadDebt);
    }

    receive() external payable {}
}
