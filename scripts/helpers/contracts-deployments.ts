
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
import { getFirstSigner } from "./contracts-getters";
import { withSaveAndVerify } from "./contracts-helpers";
import { eContractid, tEthereumAddress } from "./types";
import { Signer } from 'ethers';

export const deployPeasNFT = async (
  deployer: Signer,
  name: string,
  symbol: string,
  verify?: boolean,
  confirms: number = 1
) => {
  const instance = await withSaveAndVerify(
    await new PeasNFT__factory(deployer).deploy(name, symbol),
    eContractid.PeasNFT,
    [name, symbol],
    verify,
    confirms
  );
  return instance;
};

export const deployPefpNFT = async (
  deployer: Signer,
  name: string,
  symbol: string,
  verify?: boolean,
  confirms: number = 1
) => {
  const instance = await withSaveAndVerify(
    await new PefpNFT__factory(deployer).deploy(name, symbol),
    eContractid.PefpNFT,
    [name, symbol],
    verify,
    confirms
  );
  return instance;
};

export const deployPbrt = async (
  deployer: Signer,
  name: string,
  symbol: string,
  verify?: boolean,
  confirms: number = 1
) => {
  const instance = await withSaveAndVerify(
    await new PlayEstatesBrickToken__factory(deployer).deploy(name, symbol),
    eContractid.PlayEstatesBrickToken,
    [name, symbol],
    verify,
    confirms
  );
  return instance;
};

export const deployPnft = async (
  deployer: Signer,
  name: string,
  symbol: string,
  pool: string,
  supply: number,
  verify?: boolean,
  confirms: number = 1
) => {
  const instance = await withSaveAndVerify(
    await new PlayEstatesTokenization__factory(deployer).deploy(name, symbol, pool, supply),
    eContractid.PnftNFT,
    [name, symbol, pool],
    verify,
    confirms
  );
  return instance;
};

export const deployPnftStaking = async (
  deployer: Signer,
  rewardToken: string,
  verify?: boolean,
  confirms: number = 1
) => {
  const instance = await withSaveAndVerify(
    await new PnftStaking__factory(deployer).deploy(rewardToken),
    eContractid.PnftStaking,
    [rewardToken],
    verify,
    confirms
  );
  return instance;
};

export const deployGiftContractV2 = async (verify?: boolean, confirms: number = 1) => {
  const instance = await withSaveAndVerify(
    await new GiftContractV2__factory(await getFirstSigner()).deploy(),
    eContractid.GiftContractV2,
    [],
    verify,
    confirms
  );
  return instance;
}

export const deployMembershipNFT = async (
  deployer: Signer,
  name: string,
  symbol: string,
  pool: string,
  verify?: boolean,
  confirms: number = 1
) => {
  const instance = await withSaveAndVerify(
    await new MembershipNFT__factory(deployer).deploy(name, symbol),
    eContractid.PnftNFT,
    [name, symbol],
    verify,
    confirms
  );
  return instance;
};
