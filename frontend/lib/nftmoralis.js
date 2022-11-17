import Moralis  from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';
import { pnftContracts, chain } from './constants';
import dotenv from 'dotenv';

dotenv.config();

Moralis.start({
    apiKey: process.env.MORALIS_APIKEY,
});

async function getPNFTs(type, address) {
    if (address !== undefined) {
        await Moralis.start({
            apiKey: process.env.MORALIS_APIKEY,
            // ...and any other configuration
        });

        const tokenAddress = pnftContracts[type];
        
        const response = await Moralis.EvmApi.nft.getWalletNFTs
        ({
            address,
            chain,
            tokenAddresses: [tokenAddress]
        });
        return response;
    }
    return [];
}

async function getTokenInfo(type, tokenId) {
    if (tokenId !== undefined) {
        await Moralis.start({
            apiKey: process.env.MORALIS_APIKEY,
            // ...and any other configuration
        });

        const address = pnftContracts[type];
        
        const response = await Moralis.EvmApi.nft.getNFTMetadata({
            address,
            chain,
            tokenId,
        });
        return response;
    }
    return null;
}

module.exports = {
    getPNFTs,
    getTokenInfo
}
        