// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceOracle is Ownable {
    AggregatorV3Interface internal ethUsdPriceFeed;
    
    uint256 public constant PRICE_PRECISION = 1e8;
    uint256 public safetyMargin = 1e8; // 1.0 in 8 decimals precision

    event PriceFeedUpdated(address newPriceFeed);
    event SafetyMarginUpdated(uint256 newMargin);

    constructor(address _priceFeed) Ownable(msg.sender) {
        ethUsdPriceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getEthUsdPrice() public view returns (uint256) {
        (, int256 price,,,) = ethUsdPriceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);
    }

    function getEthUsdPriceWithSafetyMargin() external view returns (uint256) {
        uint256 price = getEthUsdPrice();
        return (price * safetyMargin) / PRICE_PRECISION;
    }

    function updatePriceFeed(address _newPriceFeed) external onlyOwner {
        ethUsdPriceFeed = AggregatorV3Interface(_newPriceFeed);
        emit PriceFeedUpdated(_newPriceFeed);
    }

    function updateSafetyMargin(uint256 _newMargin) external onlyOwner {
        require(_newMargin > 0, "Invalid safety margin");
        safetyMargin = _newMargin;
        emit SafetyMarginUpdated(_newMargin);
    }
} 