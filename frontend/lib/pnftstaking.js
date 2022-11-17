import {ethers} from 'ethers';
import {
    pnftContracts,
    pnftStaking, 
} from "./constants";
import PNFTSTAKING from './abis/contracts/stake/PnftStaking.sol/PnftStaking.json';
import PNFTToken from './abis/contracts/token/PlayEstatesTokenization.sol/PlayEstatesTokenization.json';

async function stake(provider, type, tokenId) 
{
    if (provider !== undefined) {
        const stakingContract = new ethers.Contract(pnftStaking, PNFTSTAKING.abi, provider);
        const pnftToken = new ethers.Contract(pnftContracts[type], PNFTToken.abi, provider);
        const signer = provider.getSigner();        

        await pnftToken.connect(signer).approve(
            stakingContract.address,
            tokenId
        );

        await stakingContract.connect(signer).stake(
            pnftContracts[type],
            tokenId, {
                gasLimit: '1000000'
            }
        );
    }
}

async function withdraw(provider, type, tokenId) 
{
    if (provider !== undefined) {
        const stakingContract = new ethers.Contract(pnftStaking, PnftStaking.abi, provider);
        const signer = provider.getSigner();        
        await stakingContract.connect(signer).withdraw(
            pnftContracts[type],
            tokenId, {
                gasLimit: '1000000'
            }
        );
    }
}

async function calcRewards(provider) 
{
    let rewards = 0;
    if (provider !== undefined) {
        const stakingContract = new ethers.Contract(pnftStaking, PnftStaking.abi, provider);
        const signer = provider.getSigner();        
        rewards = await stakingContract.connect(signer).calcRewards();
    }
    return rewards.toString();
}


async function claimRewards(provider) 
{
    if (provider !== undefined) {
        const stakingContract = new ethers.Contract(pnftStaking, PnftStaking.abi, provider);
        const signer = provider.getSigner();        
        await stakingContract.connect(signer).claimRewards();
    }
}

module.exports = {
    stake,
    withdraw,
    calcRewards,
    claimRewards
}
      
