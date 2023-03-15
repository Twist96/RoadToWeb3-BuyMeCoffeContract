const { ethers } = require("hardhat");
const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Goerli.
  const contractAddress = "0x29dB6C1BaA24644d7F71797E300EF416eEEb5829";
  const contractABI = abi.abi;

  // Get the node connection and the wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider(
    "goerli",
    process.env.GOERLI_API_KEY
  );

  // Ensure that signer is the same address as the original contract deployer,
  // or else the script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  //Check starting balaces
  console.log(
    "current balance of owner",
    await getBalance(provider, signer.address),
    "ETH"
  );
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log("current balance of contract: ", contractBalance, "ETH");

  // Withdraw funds if there are funds to withdraw
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds...");
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    console.log(
      "current balance of contract: ",
      await getBalance(provider, buyMeACoffee.address),
      "ETH"
    );
  } else {
    console.log("no funds to withdraw!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
