
import chai from "chai";
import { ethers } from "hardhat";
import { uritoJson } from "../scripts/helpers/cast-utils";
import { makeSuite, TestEnv, SignerWithAddress } from "./helpers/make-suite";
const { expect } = chai;
import { names, symbols, pbrtCount, pnftCount, pnftMap } from "./helpers/constants";
import { any } from "hardhat/internal/core/params/argumentTypes";
import { BigNumber } from "ethers";

makeSuite("Test PNFT Staking", (testEnv: TestEnv) => {
    let owner: any;
    let addressProvider: any;
    
    before(async () => {
        [owner] = await ethers.getSigners();

        addressProvider = testEnv.addressProvider;
        
        console.log("owner:", owner.address);
    });

    it.only ("Should get all addresses pair", async () => {
        const addresses = await addressProvider.getAllAddresses();
        for (let i = 0; i < addresses.length; i++) {
            const name = ethers.utils.parseBytes32String(addresses[i].name);
            const addr = addresses[i].addr.toString();
            console.log(name, ":", addr);
        }
    });
});