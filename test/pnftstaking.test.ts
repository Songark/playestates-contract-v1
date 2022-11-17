
import chai from "chai";
import { ethers } from "hardhat";
import { uritoJson } from "../scripts/helpers/cast-utils";
import { makeSuite, TestEnv, SignerWithAddress } from "./helpers/make-suite";
const { expect } = chai;
import { names, symbols, pbrtCount, pnftCount, pnftMap } from "./helpers/constants";
import { any } from "hardhat/internal/core/params/argumentTypes";
import { BigNumber } from "ethers";

makeSuite("Test PNFT Staking", (testEnv: TestEnv) => {
    let owner: any, staker1: any, staker2: any;
    let stakingContract: any;
    let pnftToken: any;
    let pbrtToken: any;

    before(async () => {
        [owner, staker1, staker2] = await ethers.getSigners();

        stakingContract = testEnv.pnftStaking;
        pnftToken = testEnv.pnft;
        pbrtToken = testEnv.pbrt;

        await pbrtToken.setGameEngine(stakingContract.address);
        await pnftToken.toggleTradingAllowed();

        const prop = await pnftToken.tierInfo(); 
        await stakingContract.setTierContracts(pnftMap.get(prop.name), pnftToken.address, prop.percent);
        
        console.log("owner:", owner.address);
        console.log("staker1:", staker1.address);
        console.log("staker2:", staker2.address);
    });

    it("Should transfer PNFTs for testing", async () => {
        let tokenId = 1;
        await pnftToken.connect(owner).transferFrom(
            owner.address,
            staker1.address,
            tokenId
        )
        tokenId++;
        await pnftToken.connect(owner).transferFrom(
            owner.address,
            staker2.address,
            tokenId
        )
        expect(await pnftToken.balanceOf(owner.address)).to.equal(pnftCount);
        expect(await pnftToken.balanceOf(staker1.address)).to.equal(pnftCount);
        expect(await pnftToken.balanceOf(staker2.address)).to.equal(pnftCount);
    });

    it("Should revert stake with reasons", async () => {
        const tokenId = 1;
        await expect(stakingContract.connect(staker1).stake(
            pnftToken.address,
            tokenId
        )).to.be.revertedWith('Not approve nft to contract');
    });

    it("Should stake successfully with staker1", async () => {
        const tokenId = 1;
        await pnftToken.connect(staker1).approve(
            stakingContract.address,
            tokenId
        );

        await expect(stakingContract.connect(staker1).stake(
            pnftToken.address,
            tokenId, {
                gasLimit: 1000000
            }
        )).to.be.emit(stakingContract, "Staked");
    });

    it("Should deposit liquidity with fake USD", async () => {
        await pbrtToken.mint(owner.address, pbrtCount);        
        const balance = await pbrtToken.balanceOf(owner.address);
        const tokenCount = parseFloat(ethers.utils.formatEther(balance));
        expect(tokenCount).to.be.equal(pbrtCount);

        await pbrtToken.approve(stakingContract.address, balance);
        await expect(stakingContract.depositLiquidity(balance, {gasLimit: 1000000})).to.be.emit(
            stakingContract,
            "DepositedLiquidity"        
        );
    });

    it("Should check the staking pool's status", async () => {
        const rewards = await stakingContract.connect(staker1).calcRewards();
        const rewardsBalance1 = parseFloat(ethers.utils.formatEther(rewards[0]));
        const prop = await pnftToken.tierInfo();  
        const rewardsBalance2 = pbrtCount * parseFloat(prop.percent.toString()) / Math.pow(10, 7);
        expect(rewardsBalance1).to.be.equal(rewardsBalance2);

        expect(await stakingContract.isStaked(staker1.address, pnftToken.address, 1)).to.be.equal(true);
    });

    it("Should claim rewards successfully", async () => {
        const rewards = await stakingContract.connect(staker1).calcRewards();
        await expect(stakingContract.connect(staker1).claimRewards()).to.be.emit(
            stakingContract,
            "Harvested"
        )
        const balance = await pbrtToken.balanceOf(staker1.address);
        expect(rewards[0]).to.be.equal(balance);
    });

    it("Should withdraw staked nft", async () => {
        let tokenId = 1;

        await expect(stakingContract.withdraw(pnftToken.address, tokenId)).to.be.revertedWith(
            "Not staked nft token"
        );

        await expect(stakingContract.connect(staker1).withdraw(pnftToken.address, tokenId)).to.be.emit(
            stakingContract, 
            "Withdrawn"
        );
    });

    it("Should withdraw staking pool rewards", async () => {
        const balance1 = await pbrtToken.balanceOf(staker2.address);
        const poolRewards1 = await stakingContract.poolRewardsBalance();
        console.log(poolRewards1.toString(), balance1.toString());

        await stakingContract.withdrawPoolRewards(staker2.address);
        const poolRewards2 = await stakingContract.poolRewardsBalance();
        const balance2 = await pbrtToken.balanceOf(staker2.address);
        console.log(poolRewards2.toString(), balance2.toString());
    });
});