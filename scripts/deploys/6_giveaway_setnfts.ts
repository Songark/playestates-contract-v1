// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import { deployGiftContractV2 } from "../helpers/contracts-deployments";
import { getEthersSigners } from "../helpers/contracts-helpers";
import { initAddresses } from "./common";
import { getGiftContractV2, getLootlotNFT } from "../helpers/contracts-getters";


async function main() {
  const [deployer] = await getEthersSigners();
  const deployerAddress = await deployer.getAddress();
  const currentNetwork = hre.network.name;

  const addresses = initAddresses(currentNetwork, deployerAddress);
  console.log("Setting nft contracts with the account: ", deployerAddress);

  const contract = await getGiftContractV2();
  console.log("GiftContractV2 deployed to: ", contract.address);
  const minionverseContract = await getLootlotNFT();
  console.log("ArcadeStation deployed to: ", minionverseContract.address);

  await (await contract.setupNFT(minionverseContract.address, minionverseContract.address)).wait(1);
  console.log("GiftContractV2 sets nfts to: ", minionverseContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
