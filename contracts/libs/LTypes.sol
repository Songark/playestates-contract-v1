//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library LTypes {

    /// @dev 4 types available nft contract
    enum NFTTypes {
        membershipNFT,  // OWNDK
        peasNFT,        // PEAS
        pnftssNFT,      // PNFT
        customNFT
    } 

    /// @dev 4 types available payment tokens
    enum PayTypes {
        payEther,       // Ether / Matic
        payUSDC,        // USDC
        payPBRT,        // PBRT
        payFiat         // Fiat USD
    } 

    /// @dev 4 actions in marketplace
    enum Action {
        MINT,
        BUY,
        SELL,
        AUCTION
    }

    /// @dev mint nft request structure
    struct MintNFT {
        uint256 price;
    }

    /// @dev sell nft request structure
    struct SellNFT {
        uint256 tokenId;
        address seller;
        uint256 price;        
        address[] feeRecipients;
        uint32[] feeRates;
    }

    /// @dev auction nft request structure
    struct AuctionNFT {
        uint256 tokenId;
        uint128 minPrice;
        uint128 buyNowPrice;
        uint128 bidPeriod; 
        uint128 endTime;
        uint256 highestPayType; 
        uint256 highestBid;
        address highestBidder;
        uint256 highestEther;
        address seller;
        address[] feeRecipients;
        uint32[] feeRates;
    }
    
}