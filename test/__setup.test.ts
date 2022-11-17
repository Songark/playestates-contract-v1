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
  deployGiftContractV2,   
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
}


before(async () => {
  const [deployer] = await getEthersSigners();
  console.log('-> Deploying test environment...');
  await buildTestEnv(deployer);
  console.log('--> Deploying test environment...\n');
  await initializeMakeSuite();
  console.log('\n--> Setup finished...\n');
});
