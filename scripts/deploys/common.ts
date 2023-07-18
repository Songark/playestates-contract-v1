import { hasValues } from "../helpers/cast-utils";
import { tEthereumAddress } from "../helpers/types";

export const pnftMap = new Map<string, number>([
  ["SS", 1],
  ["S", 2],
  ["A", 3],
  ["B", 4],
  ["C", 5]
]);

export interface Addresses {
    deployerAddress: tEthereumAddress;
    treasury: tEthereumAddress;
    signerAddress: tEthereumAddress;
    ethersAddress: tEthereumAddress;
    usdcAddress: tEthereumAddress;
    pnftContracts: tEthereumAddress[];
    nftengineAddress: tEthereumAddress;
    gamePlayV2: tEthereumAddress;
    gameWallet: tEthereumAddress;
    testers: tEthereumAddress[];
}

// Mainnet - ethermain
const main_addresses: Addresses = {
    deployerAddress: {} as tEthereumAddress,
    treasury: "0x21796bA19B1579F51d5177f56C656e8a2476E037",       // Will's Live account
    signerAddress: "0x3aC0e043AD218a854D7Fda76CEC09Cf932da56Ec",  // Kel's Live account
    ethersAddress: "0xDbA31A76eA8D99329Df0adA09B6668Ad17f0639D",
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",    // USDC address
    pnftContracts: [
      "0xe61407f2e48167008Abe8DEF35E7EAcb77b40023"
    ],
    nftengineAddress: "",
    gamePlayV2: "0x8004422baEb59146d548fb0C238848CCe4B1B31F",
    gameWallet: "0xd5439F21fd46f2eA74563443626f0246E268983f",
    testers: []
}

// Testnet - goerli
const test_addresses: Addresses = {
  deployerAddress: {} as tEthereumAddress,
  treasury: "0xF0d096D33559cDc5f527435b82073c108D6c3107",       // from Mohsen
  signerAddress: "0x05Be88DD6e26162184D897557a6e6d9652Efced4",  // 
  ethersAddress: "0xDbA31A76eA8D99329Df0adA09B6668Ad17f0639D",  //
  usdcAddress: "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",    // USDC address
  pnftContracts: [
    "0xe61407f2e48167008Abe8DEF35E7EAcb77b40023"                // from Dai
  ],
  nftengineAddress: "0xe09868b464f39daD43642E3e1F80a44842B01140", 
  gamePlayV2: "0x8004422baEb59146d548fb0C238848CCe4B1B31F",     // from Dai
  gameWallet: "0xd5439F21fd46f2eA74563443626f0246E268983f",     // from Dai
  testers: [
    "0xb61ac6a09E2882954C3B9C6B52d604c376Db9aF4",               // for Angry
    "0x0E16542669B76C9551eDa5c88056DaBC68014Bc7",               // for Angry
    "0xe6fDef5b2C067ebEB01DdEe75c270c61Bd21b7B8",               // for Vova
  ],
}

const addressesMap = new Map<string, Addresses>([
  ["hardhat", test_addresses],
  ["goerli", test_addresses],
  ["ethmainnet", main_addresses]
])

export const initAddresses = (network: string, defaultAddress: tEthereumAddress) : Addresses => {

  let addresses: any = addressesMap.get(network);

  if(!hasValues(addresses.deployerAddress))
    addresses.deployerAddress = defaultAddress;
  
  if(!hasValues(addresses.treasury))
    addresses.treasury = defaultAddress;
  
  if(!hasValues(addresses.signerAddress))
    addresses.signerAddress = defaultAddress;
    
  if(!hasValues(addresses.ethersAddress))
    addresses.ethersAddress = defaultAddress;

  return addresses;
}