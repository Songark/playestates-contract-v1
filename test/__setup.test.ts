import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import hre from "hardhat";
import { initializeMakeSuite } from './helpers/make-suite';
import { getEthersSigners } from "../scripts/helpers/contracts-helpers";
import { 
  deployPeasNFT, 
  deployPefpNFT, 
  deployPbrt,
  deployPnft,
  deployPnftStaking,
  deployAddressProvider,   
} from "../scripts/helpers/contracts-deployments";
import {names, symbols} from "./helpers/constants";

const buildTestEnv = async (deployer: Signer) => {
  await deployPeasNFT(deployer, names[0], symbols[0]);
  await deployPefpNFT(deployer, names[1], symbols[1]);
  const pnft = await deployPnft(deployer, names[3], symbols[3], await deployer.getAddress(), 3);
  // await deployPnft(deployer, names[4], symbols[4], await deployer.getAddress(), 10);
  // await deployPnft(deployer, names[5], symbols[5], await deployer.getAddress(), 30);
  // await deployPnft(deployer, names[6], symbols[6], await deployer.getAddress(), 700);
  // await deployPnft(deployer, names[7], symbols[7], await deployer.getAddress(), 5000);
  await pnft.updateTierInfo(
    "SS", 100000, 500000, "", "", ""
  );
  const pbrtIns = await deployPbrt(deployer, names[2], symbols[2]);
  await deployPnftStaking(deployer, pbrtIns.address);
  const addressProviderContract = await deployAddressProvider(deployer);
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


before(async () => {
  const [deployer] = await getEthersSigners();
  console.log('-> Deploying test environment...');
  await buildTestEnv(deployer);
  console.log('--> Deploying test environment...\n');
  await initializeMakeSuite();
  console.log('\n--> Setup finished...\n');
});
