// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IPnftStaking.sol";

import "hardhat/console.sol";

contract PnftStaking is Ownable, ReentrancyGuard, IPnftStaking, IERC721Receiver {
    /// @dev Reward token address that a user can claim reward
    address private _rewardTokenAddress;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    /// @dev Structure of each staker information
    struct StakerInfo {
        EnumerableSet.UintSet stakedNfts;
        uint256 rewards;
        uint256 lastClaimDate;
    }
    mapping(string => uint256) _nftTiers;
    /// @dev Mapping of stakable nft contracts
    mapping(address => uint256) _nftTierContracts;
    mapping(uint256 => uint256) _nftIterInfos;
    /// @dev Mapping of stakers information
    mapping(address => StakerInfo) private _stakersInfo;
    /// @dev Array of stakers
    EnumerableSet.AddressSet private _stakers;
    /// @dev Max NFTs that a user can stake
    uint256 public maxNftsPerUser = 1;
    /// @dev Percentage digits for Tierinfo
    uint256 public constant digits = 7;
    /// @dev Staking pool's reward balance
    uint256 public poolRewardsBalance;

    /// @dev PNFT contract' tier structure
    modifier checkContract(address nftContract) {
        require(_nftTierContracts[nftContract] > 0 && _nftTierContracts[nftContract] <= 5,
            "Invalid nft contract");
        _;
    }

    constructor(address rewardTokenAddress) {
        _rewardTokenAddress = rewardTokenAddress;
        _nftTiers["SS"] = 1;
        _nftTiers["S"] = 2;
        _nftTiers["A"] = 3;
        _nftTiers["B"] = 4;
        _nftTiers["C"] = 5;        
    }

    function getTokenTierId(uint256 tokenTier, uint256 tokenId)
    internal pure returns (uint256) {
        return tokenTier * 10 ** 18 + tokenId;
    }

    function parseTokenTierId(uint256 tokenTierId)
    internal pure returns (uint256, uint256) {
        uint256 tokenId = tokenTierId % (10 ** 18);
        uint256 tokenTier = (tokenTierId - tokenId) / (10 ** 18);
        return (tokenTier, tokenId);
    }

    function setTierContracts(uint256 tier, address nftContract, uint256 percent)
    external
    onlyOwner {
        require(nftContract != address(0), "Zero PNFT contract");
        require(tier > 0 && tier <= 5, "Invalid PNFT tier");

        _nftTierContracts[nftContract] = tier;
        _nftIterInfos[tier] = percent;
    }

    function stake(address nftContract, uint256 tokenId)
    external 
    nonReentrant checkContract(nftContract) {
        require(userStakedNFTCount(msg.sender) < maxNftsPerUser,
            "Exceeds max limit per staker"
        );

        require(address(this) == IERC721(nftContract).getApproved(tokenId),
            "Not approve nft to contract"
        );

        StakerInfo storage staker = _stakersInfo[msg.sender];        
        IERC721(nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId
        );
        staker.stakedNfts.add(getTokenTierId(_nftTierContracts[nftContract], tokenId));        
        if (staker.stakedNfts.length() == 1) {
            _stakers.add(msg.sender);
        }
        emit Staked(msg.sender, nftContract, tokenId);
    }

    function withdraw(address nftContract, uint256 tokenId)
    external
    nonReentrant checkContract(nftContract) {
        require(tokenId > 0, "Invaild token id");

        StakerInfo storage staker = _stakersInfo[msg.sender];
        uint256 tokenTierId = getTokenTierId(_nftTierContracts[nftContract], tokenId);

        require(
            isStaked(msg.sender, tokenTierId),
            "Not staked nft token"
        );

        _claimRewardsTo(msg.sender);

        IERC721(nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        staker.stakedNfts.remove(tokenTierId);
        if (staker.stakedNfts.length() == 0) {
            _stakers.remove(msg.sender);
            delete _stakersInfo[msg.sender];
        }

        emit Withdrawn(msg.sender, nftContract, tokenId);
    }

    function getStakersList()
    external 
    onlyOwner
    view returns (address[] memory stakers) {
        uint256 length = _stakers.length();
        if (length > 0) {
            stakers = new address[](length);
            for (uint256 i = 0; i < length; i++) {
                stakers[i] = _stakers.at(i);
            }
        }
    }

    function getStakerInfo(address account)
    external
    onlyOwner
    view returns (
        uint256[] memory stakedTiers, 
        uint256[] memory stakedTokenIds, 
        uint256 rewards, 
        uint256 lastClaimDate) 
    {
        StakerInfo storage staker = _stakersInfo[account];
        rewards = staker.rewards;
        lastClaimDate = staker.lastClaimDate;
        uint256 countNfts = staker.stakedNfts.length();
        if (countNfts > 0) {
            stakedTiers = new uint256[](countNfts);
            stakedTokenIds = new uint256[](countNfts);
            for (uint256 i = 0; i < countNfts; i++) {
                (stakedTiers[i], stakedTokenIds[i]) = parseTokenTierId(staker.stakedNfts.at(i));
            }
        }
    }

    function userStakedNFTCount(address account)
    public
    view returns (uint256)
    {
        StakerInfo storage staker = _stakersInfo[account];
        return staker.stakedNfts.length();
    }

    function isStaked(address account, address nftContract, uint256 tokenId)
    external
    checkContract(nftContract)
    view returns (bool)
    {
        uint256 tokenTierId = getTokenTierId(_nftTierContracts[nftContract], tokenId);
        return isStaked(account, tokenTierId);
    }

    function isStaked(address account, uint256 tokenTierId)
    internal
    view returns (bool)
    {
        StakerInfo storage staker = _stakersInfo[account];
        return staker.stakedNfts.contains(tokenTierId);
    }

    function calcRewards()
    external
    view returns (uint256, uint256) {
        return (_stakersInfo[msg.sender].rewards, _stakersInfo[msg.sender].lastClaimDate);
    }

    function claimRewards()
    external nonReentrant {
        _claimRewardsTo(msg.sender);
    }

    function _claimRewardsTo(address to)
    internal {
        StakerInfo storage staker = _stakersInfo[to];
        uint256 rewards = staker.rewards;
        if (staker.rewards > 0) {
            staker.rewards = 0;
            staker.lastClaimDate = block.timestamp;
            require (
                IERC20(_rewardTokenAddress).transfer(to, rewards),
                "Failed to claim rewards");   
        }                
        emit Harvested(to, rewards);
    }

    function depositLiquidity(uint256 amount)
    external {
        require (
            IERC20(_rewardTokenAddress).transferFrom(msg.sender, address(this), amount),
            "Failed to deposit LP");
        
        uint256 sumRewards = 0;
        for (uint256 i = 0; i < _stakers.length(); i++) {
            StakerInfo storage staker = _stakersInfo[_stakers.at(i)];
            for (uint256 j = 0; j < staker.stakedNfts.length(); j++) {
                (uint256 tokenTier, ) = parseTokenTierId(staker.stakedNfts.at(j));                
                staker.rewards += amount * _nftIterInfos[tokenTier] / (10 ** digits);
                sumRewards += amount * _nftIterInfos[tokenTier] / (10 ** digits);
            }
        }

        require(amount >= sumRewards, "Incorrect calculation of rewards");
        poolRewardsBalance += (amount - sumRewards);

        emit DepositedLiquidity(amount, (amount - sumRewards));
    }

    function withdrawPoolRewards(address treasury)
    external 
    onlyOwner {
        if (poolRewardsBalance > 0) {
            require (
                IERC20(_rewardTokenAddress).transfer(treasury, poolRewardsBalance),
                "Failed to claim rewards");   
            poolRewardsBalance = 0;
        }  
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}