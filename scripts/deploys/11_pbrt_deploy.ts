// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import { deployPbrt } from "../helpers/contracts-deployments";
import { getEthersSigners } from "../helpers/contracts-helpers";
import { initAddresses, pnftMap } from "./common";

async function main() {
  const [deployer] = await getEthersSigners();
  const deployerAddress = await deployer.getAddress();
  const currentNetwork = hre.network.name;

  const addresses = initAddresses(currentNetwork, deployerAddress);
  console.log("Deploying contracts with the account: ", deployerAddress);

  const pbrtContract = await deployPbrt(deployer, "PlayEstates Bricks Token", "PBRT", true, 5);
  await pbrtContract.deployed();

  for (let i = 0; i < addresses.testers.length; i++) {
    await pbrtContract.mint(addresses.testers[i], 1000);
  }
  console.log("PBRT Token deployed to: ", pbrtContract.address);
  console.log("Finishied deploying process");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
