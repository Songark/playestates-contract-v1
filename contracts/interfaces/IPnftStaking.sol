// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IPnftStaking {
    event Staked(address indexed account, address indexed nftContract, uint256 tokenId);
    event Withdrawn(address indexed account, address indexed nftContract, uint256 tokenId);
    event DepositedLiquidity(uint256 totalAmount, uint256 poolAmount);
    event Harvested(address indexed account, uint256 amount);
    event InsufficientRewardToken(
        address indexed account,
        uint256 amountNeeded,
        uint256 balance
    );
}