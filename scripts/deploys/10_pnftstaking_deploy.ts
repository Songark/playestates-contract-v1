// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import { deployPnftStaking } from "../helpers/contracts-deployments";
import { getEthersSigners } from "../helpers/contracts-helpers";
import { initAddresses, pnftMap } from "./common";
import { getPnftStakingContract, getPnftContract } from "../helpers/contracts-getters";

async function main() {
  const [deployer] = await getEthersSigners();
  const deployerAddress = await deployer.getAddress();
  const currentNetwork = hre.network.name;

  const addresses = initAddresses(currentNetwork, deployerAddress);
  console.log("Deploying contracts with the account: ", deployerAddress);

  const stakingContract = await deployPnftStaking(deployer, addresses.usdcAddress);
  await stakingContract.deployed();

  for (let i = 0; i < addresses.pnftContracts.length; i++) {
    const pnftContract = await getPnftContract(addresses.pnftContracts[i]);
    const prop = await pnftContract.tierInfo(); 
    const tier: any = pnftMap.get(prop.name);
    await stakingContract.setTierContracts(tier, pnftContract.address, prop.percent);  
  }
  console.log("PnftStaking deployed to: ", stakingContract.address);
  console.log("Finishied deploying process");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
