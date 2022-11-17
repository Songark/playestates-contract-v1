import { hardhatArguments } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { 
    GiftContractV2__factory, 
    PeasNFT__factory, 
    PefpNFT__factory,
    PlayEstatesBrickToken__factory,
    PlayEstatesTokenization__factory,
    PnftStaking__factory,
    MembershipNFT__factory,
    NFTEngineV1__factory
} from "../../typechain-types";
import { getEthersSigners } from "./contracts-helpers";
import { getDb } from "./misc-utils";
import { eContractid, tEthereumAddress } from "./types";
import hre from "hardhat";

export const getFirstSigner = async () => (await getEthersSigners())[0];

export const getPeasNFT = async (address?: tEthereumAddress) =>
    await PeasNFT__factory.connect(
        address ||
        (
            await getDb().get(`${eContractid.PeasNFT}.${hre.network.name}`).value()
        ).address,
        await getFirstSigner()
    );
export const getPefpNFT = async (address?: tEthereumAddress) =>
    await PefpNFT__factory.connect(
        address ||
        (
            await getDb().get(`${eContractid.PefpNFT}.${hre.network.name}`).value()
        ).address,
        await getFirstSigner()
    );    
export const getPbrtContract = async (address?: tEthereumAddress) =>
    await PlayEstatesBrickToken__factory.connect(
        address ||
        (
            await getDb().get(`${eContractid.PlayEstatesBrickToken}.${hre.network.name}`).value()
        ).address,
        await getFirstSigner()
    );
export const getPnftContract = async (address?: tEthereumAddress) =>
    await PlayEstatesTokenization__factory.connect(
        address ||
        (
            await getDb().get(`${eContractid.PnftNFT}.${hre.network.name}`).value()
        ).address,
        await getFirstSigner()
    );
export const getPnftStakingContract = async (address?: tEthereumAddress) =>
    await PnftStaking__factory.connect(
        address ||
        (
            await getDb().get(`${eContractid.PnftStaking}.${hre.network.name}`).value()
        ).address,
        await getFirstSigner()
    );    
export const getGiftContractV2 = async (address?: tEthereumAddress) =>
    await GiftContractV2__factory.connect(
        address ||
        (
            await getDb().get(`${eContractid.GiftContractV2}.${hre.network.name}`).value()
        ).address,
        await getFirstSigner()
    );
export const getMembershipNFT = async (address?: tEthereumAddress) =>
    await MembershipNFT__factory.connect(
        address ||
        (
            await getDb().get(`${eContractid.MembershipNFT}.${hre.network.name}`).value()
        ).address,
        await getFirstSigner()
    );
