// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import { deployAddressProvider } from "../helpers/contracts-deployments";
import { getEthersSigners } from "../helpers/contracts-helpers";
import { initAddresses, pnftMap } from "./common";
import { getPbrtContract } from "../helpers/contracts-getters";

async function main() {
  const [deployer] = await getEthersSigners();
  const deployerAddress = await deployer.getAddress();
  const currentNetwork = hre.network.name;

  const addresses = initAddresses(currentNetwork, deployerAddress);
  console.log("Deploying Address Provider: account", deployerAddress);

  const addressProviderContract = await deployAddressProvider(deployer, true, 5);

  if (currentNetwork == "goerli") {
    let contractId = hre.ethers.utils.formatBytes32String("marketplace");
    await addressProviderContract.setAddress(contractId, "0xe09868b464f39daD43642E3e1F80a44842B01140");
    contractId = hre.ethers.utils.formatBytes32String("airdrop_peas");
    await addressProviderContract.setAddress(contractId, hre.ethers.constants.AddressZero);
    contractId = hre.ethers.utils.formatBytes32String("pnftstaking");
    await addressProviderContract.setAddress(contractId, "0x93F9a578b4E632F0A343486875a8104FCb34F029");
    contractId = hre.ethers.utils.formatBytes32String("gameengine");
    await addressProviderContract.setAddress(contractId, "0x6972bEdf2196502897c78E0295eC2862f684d2b4");
    contractId = hre.ethers.utils.formatBytes32String("pbrt");
    await addressProviderContract.setAddress(contractId, "0x5A7ba86C5CB0A61463bA90424792363C2aEa6652");
    contractId = hre.ethers.utils.formatBytes32String("peas");
    await addressProviderContract.setAddress(contractId, "0xe5FAEba50BCD4E1fCf059558adeC8124E470a639");
    contractId = hre.ethers.utils.formatBytes32String("pefp");
    await addressProviderContract.setAddress(contractId, hre.ethers.constants.AddressZero);
    contractId = hre.ethers.utils.formatBytes32String("ownk");
    await addressProviderContract.setAddress(contractId, "0x223FeAAFE9880A6359dC32Bd9b647C010C9953d2");
    contractId = hre.ethers.utils.formatBytes32String("pnft_ss");
    await addressProviderContract.setAddress(contractId, "0xe61407f2e48167008Abe8DEF35E7EAcb77b40023");
  }

  console.log("Address Provider deployed to: ", addressProviderContract.address);
  console.log("Finishied deploying process");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
