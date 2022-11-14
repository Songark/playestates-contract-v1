// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IPnftStaking.sol";
import "../interfaces/IPefpNFT.sol";

interface IPnft {
     function tierInfo() external view returns(PnftStaking.TierProp memory prop);
}

contract PnftStaking is Ownable, ReentrancyGuard, IPnftStaking, IERC721Receiver {
    /// @dev NFT contract address that a user can stake
    address private _stakeNftAddress;
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
    /// @dev Mapping of stakers information
    mapping(address => StakerInfo) private _stakersInfo;
    /// @dev Array of stakers
    EnumerableSet.AddressSet private _stakers;
    /// @dev Max NFTs that a user can stake
    uint256 public maxNftsPerUser = 1;

    /// @dev PNFT contract' tier structure
    struct TierProp  {
        string name;
        uint256 percent;
        uint256 value;
        string image; // image
        string ext_url; // external_url
        string ani_url; // animation_url
    }    

    constructor(
        address stakeNftAddress,
        address rewardTokenAddress
    ) {
        _stakeNftAddress = stakeNftAddress;
        _rewardTokenAddress = rewardTokenAddress;
    }

    function stake(uint256[] memory tokenIdList)
    external 
    nonReentrant {
        require(
            IERC721(_stakeNftAddress).isApprovedForAll(
                _msgSender(),
                address(this)
            ),
            "Not approve nft to staker"
        );

        require(
            userStakedNFTCount(_msgSender()) + tokenIdList.length <= maxNftsPerUser,
            "Exceeds max limit per staker"
        );

        StakerInfo storage staker = _stakersInfo[_msgSender()];
        if (staker.stakedNfts.length() == 0) {
            _stakers.add(_msgSender());
        }
        for (uint256 i = 0; i < tokenIdList.length; i++) {
            IERC721(_stakeNftAddress).safeTransferFrom(
                _msgSender(),
                address(this),
                tokenIdList[i]
            );
            staker.stakedNfts.add(tokenIdList[i]);
            emit Staked(_msgSender(), tokenIdList[i]);
        }
    }

    function withdraw(uint256[] memory tokenIdList)
    external
    nonReentrant {
        StakerInfo storage staker = _stakersInfo[_msgSender()];

        for (uint256 i = 0; i < tokenIdList.length; i++) {
            require(tokenIdList[i] > 0, "Invaild token id");
            require(
                isStaked(_msgSender(), tokenIdList[i]),
                "Not staked nft token"
            );

            IERC721(_stakeNftAddress).safeTransferFrom(
                address(this),
                _msgSender(),
                tokenIdList[i]
            );
            staker.stakedNfts.remove(tokenIdList[i]);

            emit Withdrawn(_msgSender(), tokenIdList[i]);
        }

        if (staker.stakedNfts.length() == 0) {
            _stakers.remove(_msgSender());
            delete _stakersInfo[_msgSender()];
        }
    }

    function getStakersList()
    external
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
    view returns (uint256[] memory stakedNfts, uint256 rewards, uint256 lastClaimDate) {
        StakerInfo storage staker = _stakersInfo[account];
        rewards = staker.rewards;
        lastClaimDate = staker.lastClaimDate;
        uint256 countNfts = staker.stakedNfts.length();
        if (countNfts > 0) {
            stakedNfts = new uint256[](countNfts);
            for (uint256 i = 0; i < countNfts; i++) {
                stakedNfts[i] = staker.stakedNfts.at(i);
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

    function isStaked(address account, uint256 tokenId)
    public
    view returns (bool)
    {
        StakerInfo storage staker = _stakersInfo[account];
        return staker.stakedNfts.contains(tokenId);
    }

    function pendingRewards()
    external
    view returns (uint256) {

    }

    function claimRewards()
    external {

    }

    function depositLiquidity(uint256 amount)
    external {
        require (
            IERC20(_rewardTokenAddress).transferFrom(_msgSender(), address(this), amount),
            "Failed to deposit LP");
        
        for (uint256 i = 0; i < _stakers.length(); i++) {
            StakerInfo storage staker = _stakersInfo[_stakers.at(i)];
            for (uint256 j = 0; j < staker.stakedNfts.length(); j++) {
                // TierProp memory prop = IPnft(staker.stakedNfts.at(j)).tierInfo();
                // staker.rewards += amount;
            }
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