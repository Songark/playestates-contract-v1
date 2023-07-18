/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPlayEstatesAddressProvider.sol";
import "./libs/LDatetime.sol";
import "./libs/LTypes.sol";

/// @title Ink Economy Addresses Provider Contract
/// @dev Main registry of addresses part of or connected to the Ink Economy, including permissioned roles
/// - Acting also as factory of proxies and admin of those, so with right to change its implementations
/// - Owned by the Ink Economy Super Admin
/// @author Ink Finanace

contract PlayEstatesAddressProvider is Ownable, IPlayEstatesAddressProvider {

    /// @notice Emitted when basket address is zero or not contract
    error InkAddressProvider_InvalidAddress(address newAddress);

    using LDatetime for uint256;
    mapping(bytes32 => address) private _addresses;
    mapping(bytes32 => uint256) private _setdates;
    bytes32[] private _names;

    bytes32 private constant CONTRACT_MARKETPLACE = "marketplace";
    bytes32 private constant CONTRACT_PNFTSTAKING = "pnftstaking";
    bytes32 private constant CONTRACT_GAMEENGINE = "gameengine";
    bytes32 private constant TOKEN_PBRT = "pbrt";
    bytes32 private constant TOKEN_PEAS = "peas";
    bytes32 private constant TOKEN_PEFP = "pefp";
    bytes32 private constant TOKEN_OWNK = "ownk";
    bytes32 private constant TOKEN_PNFT_SS = "pnft_ss";
    bytes32 private constant TOKEN_PNFT_S = "pnft_s";    
    bytes32 private constant TOKEN_PNFT_A = "pnft_a";
    bytes32 private constant TOKEN_PNFT_B = "pnft_b";
    bytes32 private constant TOKEN_PNFT_C = "pnft_c";
    bytes32 private constant CONTRACT_AIRDROP_PEAS = "airdrop_peas";

    /// @dev throws if new address is not contract.
    modifier onlyContract(address newAddress) {
        if (!isContract(newAddress))
            revert InkAddressProvider_InvalidAddress(newAddress);
        _;
    }

    constructor() {

    }

    function isContract(address account) 
    internal 
    view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function setAddress(bytes32 id, address newAddress) 
    public
    onlyOwner {
        if (_addresses[id] == address(0)) {
            _names.push(id);
        }
        _addresses[id] = newAddress;
        _setdates[id] = block.timestamp.getDayID();
    }

    function getAddress(bytes32 id) 
    public 
    view returns (address, uint256) {
        return (_addresses[id], _setdates[id]);
    }

    function getNFTMarketplaceContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(CONTRACT_MARKETPLACE);
    }

    function setNFTMarketplaceContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(CONTRACT_MARKETPLACE, newAddress);
        emit ContractAddressUpdated("PlayEstates Marketplace", newAddress, _setdates[CONTRACT_MARKETPLACE]);
    }

    function getPNFTStakingContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(CONTRACT_PNFTSTAKING);
    }

    function setPNFTStakingContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(CONTRACT_PNFTSTAKING, newAddress);
        emit ContractAddressUpdated("PlayEstates PnftStaking", newAddress, _setdates[CONTRACT_PNFTSTAKING]);
    }

    function getGameEngineContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(CONTRACT_GAMEENGINE);
    }

    function setGameEngineContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(CONTRACT_GAMEENGINE, newAddress);
        emit ContractAddressUpdated("PlayEstates GameEngine", newAddress, _setdates[CONTRACT_GAMEENGINE]);
    }

    function getOWNKContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(TOKEN_OWNK);
    }

    function setOWNKContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(TOKEN_OWNK, newAddress);
        emit ContractAddressUpdated("PlayEstates OWNK", newAddress, _setdates[TOKEN_OWNK]);
    }

    function getPBRTContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(TOKEN_PBRT);
    }

    function setPBRTContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(TOKEN_PBRT, newAddress);
        emit ContractAddressUpdated("PlayEstates PBRT", newAddress, _setdates[TOKEN_PBRT]);
    }

    function getPEASContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(TOKEN_PEAS);
    }

    function setPEASContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(TOKEN_PEAS, newAddress);
        emit ContractAddressUpdated("PlayEstates PEAS", newAddress, _setdates[TOKEN_PEAS]);
    }

    function getPEFPContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(TOKEN_PEFP);
    }

    function setPEFPContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(TOKEN_PEFP, newAddress);
        emit ContractAddressUpdated("PlayEstates PEFP", newAddress, _setdates[TOKEN_PEFP]);
    }

    function getPNFTSSContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(TOKEN_PNFT_SS);
    }

    function setPNFTSSContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(TOKEN_PNFT_SS, newAddress);
        emit ContractAddressUpdated("PlayEstates PNFT SS", newAddress, _setdates[TOKEN_PNFT_SS]);
    }

    function getPNFTSContract() 
    external 
    override view returns (address, uint256) {
        return getAddress(TOKEN_PNFT_S);
    }

    function setPNFTSContract(address newAddress) 
    public
    onlyOwner onlyContract(newAddress) {
        setAddress(TOKEN_PNFT_S, newAddress);
        emit ContractAddressUpdated("PlayEstates PNFT S", newAddress, _setdates[TOKEN_PNFT_S]);
    }

    function getAllAddresses()
    external 
    override view returns (LTypes.AddressInfo[] memory addresses) {
        addresses = new LTypes.AddressInfo[](_names.length);
        for (uint256 i = 0; i < _names.length; i++) {
            addresses[i].name = _names[i];
            addresses[i].addr = _addresses[_names[i]];
        }
    }
}