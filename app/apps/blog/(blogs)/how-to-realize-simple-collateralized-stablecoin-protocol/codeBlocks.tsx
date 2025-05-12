// Mermaid diagrams
export const mermaidChart1 = `
graph TD
    A[Vault Contract] -->|deposit/withdraw| B[Stablecoin Token]
    A -->|price query| C[Price Oracle]
    A -->|trigger| D[Liquidation Engine]
    
    D -->|liquidate positions| A
    D -->|burn stablecoin| B
    C -->|feed prices| A
    C -->|price updates| D
    
    B(Stablecoin ERC20) -->|mint/burn| A
`;

export const mermaidChart2 = `
sequenceDiagram
    participant User
    participant Vault
    participant Stablecoin
    participant Oracle
    participant LiquidationEngine

    %% 1. Deposit & Borrow Flow
    Note over User,Vault: Scenario 1: Deposit Collateral & Borrow
    User->>Vault: deposit(collateralAsset, amount)
    Vault->>Oracle: getPrice(collateralAsset)
    Oracle-->>Vault: currentPrice
    Vault->>Stablecoin: mint(userAddress, stablecoinAmount)
    Stablecoin-->>User: Transfer stablecoins

    %% 2. Price Monitoring
    Note over Oracle,LiquidationEngine: Scenario 2: Continuous Price Updates
    loop Every Block
        Oracle->>Vault: pushPriceUpdate(asset, newPrice)
        Oracle->>LiquidationEngine: pushPriceUpdate(asset, newPrice)
    end

    %% 3. Liquidation Trigger
    Note over Vault,LiquidationEngine: Scenario 3: Liquidation Process
    Vault->>LiquidationEngine: checkCollateralRatio(userAddress)
    LiquidationEngine->>Oracle: verifyPrice(asset)
    alt Collateral Ratio < Threshold
        LiquidationEngine->>Vault: seizeCollateral(userAddress)
        LiquidationEngine->>Stablecoin: burn(userAddress, debtAmount)
        LiquidationEngine->>Liquidator: sendCollateralReward()
    end

    %% 4. Repay & Withdraw
    Note over User,Vault: Scenario 4: Repay Loan
    User->>Stablecoin: approve(Vault, repayAmount)
    User->>Vault: repay(repayAmount)
    Vault->>Stablecoin: burnFrom(userAddress, repayAmount)
    Vault->>User: withdrawCollateral(amount)
`;

// Code blocks for implementation details
export const zetaCoinCode = `contract ZetaCoin is ERC20, Ownable {
    address public vault;
    uint256 public constant MAX_SUPPLY = 1000000000 * 10 ** 18;

    function mint(address to, uint256 amount) public onlyVault {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply reached");
        _mint(to, amount);
    }

    function burn(uint256 amount) public onlyVault {
        require(balanceOf(vault) >= amount, "Insufficient balance");
        _burn(vault, amount);
    }
}`;

export const vaultParamsCode = `struct VaultPosition {
    uint256 collateralAmount;  // ETH amount in Wei
    uint256 debtAmount;       // ZETA amount
    bool isBadDebt;          // bad debt flag
}

uint256 public constant COLLATERAL_RATIO = 150;     // 150% minimum
uint256 public constant LIQUIDATION_THRESHOLD = 120; // 120% trigger
uint256 public constant LIQUIDATION_PENALTY = 10;    // 10% penalty`;

export const depositCode = `function deposit() external payable nonReentrant {
    require(msg.value > 0, "Must deposit ETH");
    vaults[msg.sender].collateralAmount += msg.value;
    totalCollateral += msg.value;
    emit CollateralAdded(msg.sender, msg.value);
}`;

export const borrowCode = `function borrowZeta(uint256 amount) external nonReentrant {
    require(amount > 0, "Amount must be greater than 0");
    require(isValidCollateralization(vault.collateralAmount, newDebtAmount),
        "Would exceed maximum borrowing capacity");
    vault.debtAmount = newDebtAmount;
    zetaCoin.mint(msg.sender, amount);
}`;

export const withdrawCode = `function withdrawCollateral(uint256 amount) external nonReentrant {
    require(amount > 0, "Amount must be greater than 0");
    require(vault.collateralAmount >= amount, "Insufficient collateral");
    vault.collateralAmount -= amount;
    (bool success, ) = msg.sender.call{ value: amount }("");
    require(success, "ETH transfer failed");
}`;

export const repayCode = `function repayZeta(uint256 amount) external nonReentrant {
    require(amount > 0, "Amount must be greater than 0");
    require(vault.debtAmount >= amount, "Insufficient debt");
    vault.debtAmount -= amount;
    zetaCoin.burn(amount);
}`;

export const liquidateCode = `function liquidate(address vaultOwner) external nonReentrant {
        VaultPosition storage vault = vaults[vaultOwner];
        require(vault.collateralAmount > 0, "Vault does not exist");
        require(isLiquidatable(vaultOwner), "Vault is not liquidatable");

        uint256 ethPrice = oracle.getEthUsdPrice();
        uint256 collateralValue = vault.collateralAmount * ethPrice / PRICE_PRECISION;
        uint256 debtValue = vault.debtAmount;

        // Calculate the maximum amount of debt that can be repaid,
        // If collateral value is too low, this maybe lower than current debt value
        // So it will become a bad debt after liquidation (still have debt but no collateral assects in this account)
        uint256 maxRepayableDebt = (collateralValue * PRECISION) / (LIQUIDATION_PENALTY + PRECISION);
        uint256 actualRepayDebt = debtValue  > maxRepayableDebt ? maxRepayableDebt : debtValue;
        if (actualRepayDebt < debtValue) {
            vault.isBadDebt = true;
        }

        // Add penalty to the debt, so that the liquidator can get a reward
        // This will encourage more liquidator to liquidate the possible debts
        uint256 penalty = (maxRepayableDebt * LIQUIDATION_PENALTY) / PRECISION;
        uint256 collateralToLiquidator = (maxRepayableDebt + penalty) * PRICE_PRECISION / ethPrice;

        // Transfer Zeta Coin from liquidator to this contract,
        // And burn the debt
        require(zetaCoin.transferFrom(msg.sender, address(this), actualRepayDebt), "Zeta Coin transfer failed");
        zetaCoin.burn(actualRepayDebt);

        // Transfer collateral to liquidator
        (bool success, ) = msg.sender.call{ value: collateralToLiquidator }("");
        require(success, "ETH transfer failed");
        vault.collateralAmount -= collateralToLiquidator;
        totalDebt -= actualRepayDebt;
        vault.debtAmount = 0;
 
        emit Liquidate(vaultOwner, collateralToLiquidator);
    }`;

export const oracleCode = `contract PriceOracle is Ownable {
    AggregatorV3Interface internal ethUsdPriceFeed;
    
    function getEthUsdPrice() public view returns (uint256) {
        (, int256 price,,,) = ethUsdPriceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);
    }
}`;

export const deployCode = `await deployer.deploy(ZetaCoin);
    const zetaCoin = await ZetaCoin.deployed();
    console.log("ZetaCoin deployed at:", zetaCoin.address);

    // 2. Deploy PriceOracle with the appropriate price feed address
    await deployer.deploy(PriceOracle, priceFeedAddress);
    const oracle = await PriceOracle.deployed();
    console.log("PriceOracle deployed at:", oracle.address);

    // 3. Deploy Vault
    await deployer.deploy(Vault, zetaCoin.address, oracle.address);
    const vault = await Vault.deployed();
    console.log("Vault deployed at:", vault.address);

    // 4. Setup contract relationships
    await vault.setZetaCoin(zetaCoin.address);
    await vault.setOracle(oracle.address);
    await zetaCoin.setVault(vault.address);
`;
export const deloyCommand = `
truffle dashboard
//open the browser and connect wallect to the dashboard and switch network to Sepolia, then
truffle migrate --network dashboard
`
export const deployOutput = `=====================

   Replacing 'ZetaCoin'
   --------------------
   > transaction hash:    0xb1fa8b93b3fb18df1094b79cf89562c7ef0b41d4b13e43a298d98ccfba2b2ebfsage.
   > Blocks: 2            Seconds: 36
   > contract address:    0xd8C7bA6Ae4A6a49090bcABbC0c65E885bF0Dd358
   > block number:        8220351
   > block timestamp:     1745939940
   > account:             0x129299c747eb17c28530A8DaE4A77fB4fFec4806
   > balance:             7.569612760676319724
   > gas used:            759347 (0xb9633)
   > gas price:           86.565440918 gwei
   > value sent:          0 ETH
   > total cost:          0.065733207864760546 ETH

ZetaCoin deployed at: 0xd8C7bA6Ae4A6a49090bcABbC0c65E885bF0Dd358

   Replacing 'PriceOracle'
   -----------------------
   > transaction hash:    0x14cbbe78f4cf468182c43ad7ff43622b8eb13ad1626bdb052d3c82d957e2f5b8sage.
   > Blocks: 0            Seconds: 32
   > contract address:    0xb7fCeaC6Fd7B7C80BB92d42da6939C20f92d6678
   > block number:        8220353
   > block timestamp:     1745939976
   > account:             0x129299c747eb17c28530A8DaE4A77fB4fFec4806
   > balance:             7.54820663639792754
   > gas used:            398282 (0x613ca)
   > gas price:           93.103406304 gwei
   > value sent:          0 ETH
   > total cost:          0.037081410869569728 ETH

PriceOracle deployed at: 0xb7fCeaC6Fd7B7C80BB92d42da6939C20f92d6678

   Replacing 'Vault'
   -----------------
   > transaction hash:    0xb583ace1d8ebea4bf8e9cd1c41836a7ef2832b5fc780368bfed24b64b17e6b6csage.
   > Blocks: 1            Seconds: 32
   > contract address:    0x33c07F22B38c33362f3E1C6EF7275729ceF252FA
   > block number:        8220355
   > block timestamp:     1745940012
   > account:             0x129299c747eb17c28530A8DaE4A77fB4fFec4806
   > balance:             7.47046205669040201
   > gas used:            1417530 (0x15a13a)
   > gas price:           104.992300824 gwei
   > value sent:          0 ETH
   > total cost:          0.14882973618704472 ETH

Vault deployed at: 0x33c07F22B38c33362f3E1C6EF7275729ceF252FA
Contract relationships established
Deployment completed successfully
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.251644354921374994 ETH

Summary
=======
> Total deployments:   3
> Final cost:          0.251644354921374994 ETH`

export const testCode = `truffle develop
truffle migrate
`