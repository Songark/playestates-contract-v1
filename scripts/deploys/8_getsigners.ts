// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import hre from "hardhat";
import { getEthersSigners } from "../helpers/contracts-helpers";


async function main() {
  const signers = await getEthersSigners();
  for (let i = 0; i < signers.length; i++) {
    const deployerAddress = await signers[i].getAddress();
    const balance = await signers[i].getBalance();
    const eth = ethers.utils.formatEther(balance);
    console.log("Signer account: ", deployerAddress, eth.toString());  
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
