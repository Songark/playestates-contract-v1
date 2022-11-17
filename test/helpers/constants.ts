import BigNumber from 'bignumber.js';
import { ethers } from "hardhat";

export const names: string[] = [
    "PlayEstates Arcade Station NFT", 
    "PlayEstates Founding Player",
    "PlayEstates Bricks Token",
    "PlayEstates RealSS",
    "PlayEstates RealS",
    "PlayEstates RealA",
    "PlayEstates RealB",
    "PlayEstates RealC",
];
export const symbols: string[] = ["PEAS", "PEFP", "PBRT", "PNFT-SS", "PNFT-S", "PNFT-A", "PNFT-B", "PNFT-C"];

export const pnftCount: number = 1;

export const pbrtCount: number = 1000;

export const pnftMap = new Map<string, number>([
    ["SS", 1],
    ["S", 2],
    ["A", 3],
    ["B", 4],
    ["C", 5]
]);
