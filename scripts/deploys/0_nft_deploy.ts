// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import { 
  deployMembershipNFT,
  deployPeasNFT,
  deployPefpNFT
} from "../helpers/contracts-deployments";
import { names, symbols, totalsupply, treasury } from "../helpers/constants";
import { getEthersSigners } from "../helpers/contracts-helpers";
import { initAddresses, pnftMap } from "./common";

async function main() {
  const currentNetwork = hre.network.name;
  const [deployer] = await getEthersSigners();
  console.log("Deploying nft contracts with the account: ", await deployer.getAddress());
  const deployerAddress = await deployer.getAddress();
  const addresses = initAddresses(currentNetwork, deployerAddress);

  const ownkNFT = await deployMembershipNFT(deployer, names[0], symbols[0], true, 5);  
  console.log(names[0], "deployed to: ", ownkNFT.address);

  const peasNFT = await deployPeasNFT(deployer, names[1], symbols[1], true, 5);  
  console.log(names[1], "deployed to: ", peasNFT.address);
  await peasNFT.setTreasury(treasury);

  // In the Polygon mainnet, Minted tokens(+10) are not appeared on Opensea, so split with 5 items for each request
  if (currentNetwork == 'mumbai' || currentNetwork == "goerli") {      
    await peasNFT.unlock();  
    for (let i = 0; i < addresses.testers.length; i++) {
      await ownkNFT.mint(addresses.testers[i], totalsupply, 0, {gasLimit: '1000000'});
      await peasNFT.mint(addresses.testers[i], totalsupply, {gasLimit: '1000000'});
    }  
  }
 
  console.log("Finishied deploying process");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
