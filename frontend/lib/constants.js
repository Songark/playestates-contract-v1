import { EvmChain } from '@moralisweb3/evm-utils';

const chain = EvmChain.GOERLI;
const chainName = "goerli";
const pnftContracts = [
    "0xe61407f2e48167008Abe8DEF35E7EAcb77b40023"
];
const pnftStaking = "0x93f9a578b4e632f0a343486875a8104fcb34f029";

module.exports = {
    chain,
    chainName,
    pnftContracts,
    stakingContract
}