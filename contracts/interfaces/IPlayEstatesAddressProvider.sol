/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @title PlayEstates Addresses Provider Contract Interface
/// @dev Main registry of addresses part of or connected to the PlayEstates, including permissioned roles
/// - Acting also as factory of proxies and admin of those, so with right to change its implementations
/// - Owned by the PlayEstates Super Admin
import "../libs/LTypes.sol";
interface IPlayEstatesAddressProvider {
    
    event ContractAddressUpdated(string contractName, address indexed newAddress, uint256 updateddate);
    
    function getNFTMarketplaceContract() external view returns (address, uint256);

    function getPNFTStakingContract() external view returns (address, uint256);

    function getGameEngineContract() external view returns (address, uint256);

    function getOWNKContract() external view returns (address, uint256);

    function getPBRTContract() external view returns (address, uint256);

    function getPEASContract() external view returns (address, uint256);

    function getPEFPContract() external view returns (address, uint256);

    function getPNFTSSContract() external view returns (address, uint256);

    function getPNFTSContract() external view returns (address, uint256);

    // function getPNFTAContract() external view returns (address, uint256);

    // function getPNFTBContract() external view returns (address, uint256);

    // function getPNFTCContract() external view returns (address, uint256);

    function getAllAddresses() external view returns (LTypes.AddressInfo[] memory names);
}