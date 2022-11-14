// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IPnftStaking {
    event RewardTokenUpdated(address oldToken, address newToken);
    event Staked(address indexed account, uint256 tokenId);
    event Withdrawn(address indexed account, uint256 tokenId);
    event Harvested(address indexed account, uint256 amount);
    event InsufficientRewardToken(
        address indexed account,
        uint256 amountNeeded,
        uint256 balance
    );
}