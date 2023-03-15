// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers, waffle } = require("hardhat");
require("@nomicfoundation/hardhat-toolbox");

// return the Ether balance of the given address.
async function getBlanace(address) {
  const waffleProvider = await hre.waffle;
  const provider = hre.ethers.provider;
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//log the Ether blance of the list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBlanace(address));
    idx++;
  }
}

function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: ${message}`
    );
  }
}

async function main() {
  // Get Example accounts
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract to deploy and deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffe deployed to ", buyMeACoffee.address);

  // Check balance before the coffe purchase
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few coffees
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffee.connect(tipper1).buyCoffee("Martins", "I love coffe", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee("Tochi", "You're the best", tip);
  await buyMeACoffee
    .connect(tipper3)
    .buyCoffee("Twist", "What an amazing teacher :)", tip);

  // Check the balance after coffee purchace.
  console.log("== Bought Coffee ==");
  await printBalances(addresses);

  // Withdraw funds.
  await buyMeACoffee.connect(tipper1).withdrawTips();

  // Check balance after withdrawal
  console.log("== Withdraw Tips ==");
  await printBalances(addresses);

  // Read all memos left for the owner
  let memos = await buyMeACoffee.getMemos();
  await printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
