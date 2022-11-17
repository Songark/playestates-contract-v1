// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../erc721psi/ERC721Psi.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Helper we wrote to encode in Base64
import "@openzeppelin/contracts/utils/Base64.sol";
import "solidity-bits/contracts/BitMaps.sol";

// Hardhat util for console output
//import "hardhat/console.sol";


contract PlayEstatesTokenization is ERC721Psi, Ownable {

    using BitMaps for BitMaps.BitMap;
    using Strings for uint256;

    event Burn(address indexed account, uint256 tokenId);
    event Locked(address indexed owner, bool locked);
    event TradingAllowed(address indexed owner, bool tradingAllowed);
    event UpdateTierInfo(string tierName, uint256 tierTokenValue, uint256 tierPercent);

    error URIQueryForNonexistentToken();
    
    /** @notice Real estate information 
    * 1. Capital Stack Information
    *  GP -> Management -> LP
    * 2. Street Address
    *  1144 S Kingsley Dr. Los Angeles, CA US 90006
    * 3. Geo Coordinates
    *  34.04947616578055, -118.30297674292754
    * 4. Real Estate Property's Valuation
    *  2,000,000 USD
    * 5. The Property Token Valuation
    *  2,500,000 USD
    * 6. Tier Valuation
    *  300,000 USD
    * 7. The property Type
    *  Residential
    * 8. Land Registry data
        TBD for now
    */
    struct RealEstateInfo {
        string capitalStackinfo;
        string streetAddress;
        string geoCoordinates;
        uint256 realEstatePropertyValue;
        uint256 propertyTokenValue;
        uint256 tierValue;
        string propertyType;
        string landRegistryData;
    }
    struct TierProp  {
        string name;
        uint256 percent;
        uint256 value;
        string image; // image
        string ext_url; // external_url
        string ani_url; // animation_url
    }

   // Mapping owner address to address data
    mapping(address => AddressData) _addressData;

    // Compiler will pack this into a single 256bit word.
    struct AddressData {
        // Realistically, 2**64-1 is more than enough.
        uint64 balance;
        // Keeps track of mint count with minimal overhead for tokenomics.
        uint64 numberMinted;
        // Keeps track of burn count with minimal overhead for tokenomics.
        uint64 numberBurned;
        // For miscellaneous variable(s) pertaining to the address
        // (e.g. number of whitelist mint slots used).
        // If there are multiple variables, please pack them into a uint64.
        uint64 aux;
    }

    BitMaps.BitMap private _burnedToken;
    // A modifier to lock/unlock token transfer
    bool public locked;
    bool public tradingAllowed;
    address public nftPoolAddress;
    uint256 public maxOwnLimit = 2;

    TierProp public tierInfo;
    RealEstateInfo public realEstateInfo;

    constructor(string memory name_, string memory symbol_, address poolAddress_, uint256 supply_)
        ERC721Psi(name_, symbol_)
    {
        require(poolAddress_ != address(0), "invalid address");
        require(supply_ != 0, "invalid supply");
        realEstateInfo = RealEstateInfo({
            capitalStackinfo : "GP -> Management -> LP",
            streetAddress : "1144 S Kingsley Dr. Los Angeles, CA US 90006",
            geoCoordinates: "34.04947616578055, -118.30297674292754",
            realEstatePropertyValue: 2_000_000,
            propertyTokenValue: 2_500_000,
            tierValue: 3_000_000,
            propertyType: "Residential",
            landRegistryData: "TBD for now"
        });
        nftPoolAddress = poolAddress_;
        _safeMint(nftPoolAddress, supply_);
    }

    modifier notLocked() {
        require(!locked, "GenesisOwnerKey: can't operate - currently locked");
        _;
    }

    function _startTokenId() internal pure virtual override returns (uint256) {
        return 1;
    }

    function updateTierInfo(
        string calldata tierName_,
        uint256 tierTokenValue_,
        uint256 tierPercent_,
        string calldata tierImageUri_,
        string calldata tierAnimationUri_,
        string calldata tierExternalUri_
    ) external onlyOwner {

        tierInfo = TierProp({
            name : tierName_,
            value : tierTokenValue_,
            percent : tierPercent_,
            image : tierImageUri_,
            ani_url : tierAnimationUri_,
            ext_url :  tierExternalUri_
        });
        emit UpdateTierInfo(tierName_, tierTokenValue_, tierPercent_);
    }

    // ---------------------------------------
    // -          External Functions         -
    // ---------------------------------------
    function toggleLock() external onlyOwner {
        locked = !locked;
        emit Locked(msg.sender, locked);
    }

    function toggleTradingAllowed() external onlyOwner {
        tradingAllowed = !tradingAllowed;
        emit TradingAllowed(msg.sender, tradingAllowed);
    }

    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
        emit Burn(_msgSender(), tokenId);
    }

    // ---------------------------------------
    // -          Public Functions           -
    // ---------------------------------------
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();
        TierProp memory tp = tierInfo;
        RealEstateInfo memory ri = realEstateInfo;
        
        string memory baseUri = string(
            abi.encodePacked(
                '"description": "', 'PlayEstates Real estate Tokenization', '",',
                '"external_url": "', tp.ext_url, '",',
                '"image": "', tp.image, '",',
                '"name": "', tp.name, '",'
            )
        );
        string memory attr1 =  string(
            abi.encodePacked(
                '"attributes": [',
                abi.encodePacked(
                    '{"trait_type": "','Token ID' ,'",',
                    '"value": ', Strings.toString(tokenId), ',',
                    '"display_type": "number"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','Capital Stack Information' ,'",',
                    '"value": "', ri.capitalStackinfo, '",',
                    '"display_type": "string"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','Street Address' ,'",',
                    '"value": "', ri.streetAddress, '",',
                    '"display_type": "string"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','Geo Coordinates' ,'",',
                    '"value": "', ri.geoCoordinates, '",',
                    '"display_type": "string"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','Real Estate Property`s Valuation(USD)' ,'",',
                    '"value": ',  Strings.toString(ri.realEstatePropertyValue), ',',
                    '"display_type": "boost_number"},'
                )
            )
        );
        
        string memory attr2 = string(
            abi.encodePacked(
                abi.encodePacked(
                    '{"trait_type": "','The Property Token Valuation' ,'",',
                    '"value": ',  Strings.toString(ri.propertyTokenValue), ',',
                    '"display_type": "boost_number"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','Tier Valuation' ,'",',
                    '"value": ',  Strings.toString(ri.tierValue), ',',
                    '"display_type": "boost_number"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','The Property Type' ,'",',
                    '"value": "', ri.propertyType, '",',
                    '"display_type": "string"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','Land Registry Data' ,'",',
                    '"value": "', ri.landRegistryData, '",',
                    '"display_type": "string"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','Token Percentage' ,'",',
                    '"value": ',  Strings.toString(tp.percent), ',',
                    '"display_type": "boost_percentage"},'
                ),
                abi.encodePacked(
                    '{"trait_type": "','Token Valuation' ,'",',
                    '"value": ',  Strings.toString(tp.value), ',',
                    '"display_type": "boost_number"}'
                ),
                ']'
            )
        );
        
        string memory strUri = Base64.encode(
            bytes (
                string(
                    abi.encodePacked(
                    '{',
                    baseUri,
                    attr1,
                    attr2,
                    '}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", strUri)
        );
        return output;
    }

    // ---------------------------------------
    // -          Internal Functions         -
    // ---------------------------------------

    function _baseURI() internal view virtual override returns (string memory) {
        return "";
    }

    function setMaxOwnLimit(uint256 _maxLimit) public onlyOwner {
        maxOwnLimit = _maxLimit;
    }

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256, /*startTokenId*/
        uint256 quantity
    ) internal virtual override {
        require(!locked, "locked");

        // Checking sender side
        if (from == address(0)) {
            // if minting, then return
            return;
        }
        // Checking receiver
        if (to == address(0)) {
            //if burning, then return
            return;
        }
        if (from == nftPoolAddress) {
            if (to != nftPoolAddress) {
                require(
                    balanceOf(to) + quantity <= maxOwnLimit,
                    "exceeded amount"
                );
            }
        } else {
            if (to != nftPoolAddress) {
                require(
                    tradingAllowed,
                    "trading coming soon"
                );
                require(
                    balanceOf(to) + quantity <= maxOwnLimit,
                    "exceeded amount"
                );
            }
        }
    }

    // ---------------------------------------
    // -          Burn Features          -
    // ---------------------------------------

    // for Burn
   /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual {
        address from = ownerOf(tokenId);
        _beforeTokenTransfers(from, address(0), tokenId, 1);
        _burnedToken.set(tokenId);
        
        emit Transfer(from, address(0), tokenId);

        _afterTokenTransfers(from, address(0), tokenId, 1);
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view override virtual returns (bool){
        if(_burnedToken.get(tokenId)) {
            return false;
        } 
        return super._exists(tokenId);
    }

    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _minted - _burned();
    }

    /**
     * @dev Returns number of token burned.
     */
    function _burned() internal view returns (uint256 burned){
        uint256 totalBucket = (_minted >> 8) + 1;

        for(uint256 i=0; i < totalBucket; i++) {
            uint256 bucket = _burnedToken.getBucket(i);
            burned += _popcount(bucket);
        }
    }

    /**
     * @dev Returns number of set bits.
     */
    function _popcount(uint256 x) private pure returns (uint256 count) {
        unchecked{
            for (count=0; x!=0; count++)
                x &= x - 1;
        }
    }

    // ---------------------------------------
    // -          BalanceOf Features          -
    // ---------------------------------------    
        /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner_) 
        public 
        view 
        virtual 
        override 
        returns (uint) 
    {
        require(owner_ != address(0), "ERC721Psi: balance query for the zero address");
        return uint256(_addressData[owner_].balance);
    }

    /**
     * @dev Hook that is called after a set of serially-ordered token ids have been transferred. This includes
     * minting.
     *
     * startTokenId - the first token id to be transferred
     * quantity - the amount to be transferred
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero.
     * - `from` and `to` are never both zero.
     */
    function _afterTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal override virtual {
        require(quantity < 2 ** 64);
        uint64 _quantity = uint64(quantity);

        if(from != address(0)){
            _addressData[from].balance -= _quantity;
        } else {
            // Mint
            _addressData[to].numberMinted += _quantity;
        }

        if(to != address(0)){
            _addressData[to].balance += _quantity;
        } else {
            // Burn
            _addressData[from].numberBurned += _quantity;
        }
        super._afterTokenTransfers(from, to, startTokenId, quantity);
    }
}