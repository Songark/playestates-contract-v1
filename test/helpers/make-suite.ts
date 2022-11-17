import { Signer } from 'ethers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
// @ts-ignore
import bignumberChai from 'chai-bignumber';
import { almostEqual } from './almost-equal';
import { tEthereumAddress } from '../../scripts/helpers/types';
import { 
  PeasNFT, 
  PefpNFT,
  PlayEstatesBrickToken,
  PlayEstatesTokenization,
  PnftStaking,
  GiftContractV2 
} from '../../typechain-types';
import { getEthersSigners } from '../../scripts/helpers/contracts-helpers';
import { 
  getPeasNFT, 
  getPefpNFT, 
  getPnftContract,
  getPnftStakingContract,
  getPbrtContract,
  getGiftContractV2
} from '../../scripts/helpers/contracts-getters';
import { evmRevert, evmSnapshot } from '../../scripts/helpers/misc-utils';

chai.use(bignumberChai());
chai.use(almostEqual());
chai.use(solidity);

export interface SignerWithAddress {
    signer: Signer;
    address: tEthereumAddress;
  }

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  buidlerevmSnapshotId = id;
};

export interface TestEnv {
  deployer: SignerWithAddress;
  admin: SignerWithAddress;
  owner: SignerWithAddress;
  minter: SignerWithAddress;
  signer: SignerWithAddress;
  users: SignerWithAddress[];
  peasNFT: PeasNFT;
  pefpNFT: PefpNFT;
  pnft: PlayEstatesTokenization;
  pnftStaking: PnftStaking;
  pbrt: PlayEstatesBrickToken;
  giftContractV2: GiftContractV2;
}

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  admin: {} as SignerWithAddress,
  owner: {} as SignerWithAddress,
  minter: {} as SignerWithAddress,
  signer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  peasNFT: {} as PeasNFT,
  pefpNFT: {} as PefpNFT,
  pnft: {} as PlayEstatesTokenization,
  pnftStaking: {} as PnftStaking,
  pbrt: {} as PlayEstatesBrickToken,
  giftContractV2: {} as GiftContractV2
}

export async function initializeMakeSuite() {
  const [_deployer, ...restSigners] = await getEthersSigners();

  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  for (const sg of restSigners) {
    testEnv.users.push({
      address: await sg.getAddress(),
      signer:sg,
    });
  }
  testEnv.deployer = deployer;
  testEnv.peasNFT =  await getPeasNFT();
  testEnv.pefpNFT =  await getPefpNFT();
  testEnv.pbrt =  await getPbrtContract();
  testEnv.pnft =  await getPnftContract();
  testEnv.pnftStaking =  await getPnftStakingContract();
}

const setSnapshot = async () => {
  setBuidlerevmSnapshotId(await evmSnapshot());
};

const revertHead = async () => {
  await evmRevert(buidlerevmSnapshotId);
};

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      await setSnapshot();
    });
    tests(testEnv);
    after(async () => {
      await revertHead();
    });
  });
}