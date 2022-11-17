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
}

// Mainnet
const main_addresses: Addresses = {
    deployerAddress: {} as tEthereumAddress,
    treasury: "0x21796bA19B1579F51d5177f56C656e8a2476E037", // Will's Live account
    signerAddress: "0x3aC0e043AD218a854D7Fda76CEC09Cf932da56Ec", // Kel's Live account
    ethersAddress: "0xDbA31A76eA8D99329Df0adA09B6668Ad17f0639D",
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC address
    pnftContracts: [
      "0xe61407f2e48167008Abe8DEF35E7EAcb77b40023"
    ],
}

// Testnet
const test_addresses: Addresses = {
  deployerAddress: {} as tEthereumAddress,
  treasury: "0xF0d096D33559cDc5f527435b82073c108D6c3107",       // gods
  signerAddress: "0x05Be88DD6e26162184D897557a6e6d9652Efced4",  // my account2
  ethersAddress: "0xDbA31A76eA8D99329Df0adA09B6668Ad17f0639D",
  usdcAddress: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",     // USDC address
  pnftContracts: [
    "0xe61407f2e48167008Abe8DEF35E7EAcb77b40023"
  ],
}

const addressesMap = new Map<string, Addresses>([
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