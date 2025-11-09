const ZetaCoin = artifacts.require("ZetaCoin");
const PriceOracle = artifacts.require("PriceOracle");
const Vault = artifacts.require("Vault");

module.exports = async function(deployer, network, accounts) {
  // Chainlink ETH/USD Price Feed addresses for different networks
  const PRICE_FEED_ADDRESSES = {
    // Ethereum Mainnet
    mainnet: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    // Sepolia Testnet
    sepolia: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    // Goerli Testnet (deprecated but included for reference)
    goerli: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    // Local development
    development: "0x0000000000000000000000000000000000000000" // Will need to be mocked for local testing
  };

  const priceFeedAddress = PRICE_FEED_ADDRESSES[network] || PRICE_FEED_ADDRESSES.development;

  try {
    // 1. Deploy ZetaCoin
    await deployer.deploy(ZetaCoin);
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

    console.log("Contract relationships established");
    console.log("Deployment completed successfully");

  } catch (error) {
    console.error("Error during deployment:", error);
    throw error;
  }
}; 