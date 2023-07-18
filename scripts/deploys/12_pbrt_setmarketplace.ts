// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import { getEthersSigners } from "../helpers/contracts-helpers";
import { initAddresses, pnftMap } from "./common";
import { getPbrtContract } from "../helpers/contracts-getters";

async function main() {
  const [deployer] = await getEthersSigners();
  const deployerAddress = await deployer.getAddress();
  const currentNetwork = hre.network.name;

  const addresses = initAddresses(currentNetwork, deployerAddress);
  console.log("Updating Marketplace in the PBRT: ", addresses.nftengineAddress);

  const pbrtContract = await getPbrtContract();
  await pbrtContract.setMarketplaceEngine(addresses.nftengineAddress);
  await pbrtContract.setGameEngine(addresses.gamePlayV2);
  await pbrtContract.setMintRole(addresses.gameWallet);
  await pbrtContract.grantRole(hre.ethers.constants.HashZero, addresses.gameWallet);

  console.log("Finishied updating process");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
