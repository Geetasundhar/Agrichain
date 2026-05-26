// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract LandRegistry {

    struct Land {
        uint256 landId;
        string farmName;
        string farmAddress;
        uint256 areaInAcres;
        string soilType;
        address farmer;
        bytes32 dataHash;
        uint256 timestamp;
    }

    struct LandLocation {
        uint256 landId;
        string coordinates;
    }

    mapping(uint256 => Land) public lands;
    mapping(uint256 => LandLocation) public landLocations;
    mapping(address => uint256[]) public farmerLands;
    
    uint256 public landCount;

    event LandRegistered(
        uint256 landId,
        string farmName,
        address farmer,
        bytes32 dataHash,
        uint256 timestamp
    );

    event LandUpdated(
        uint256 landId,
        string farmName,
        bytes32 dataHash,
        uint256 timestamp
    );

    function registerLand(
        string memory _farmName,
        string memory _farmAddress,
        uint256 _areaInAcres,
        string memory _soilType,
        bytes32 _dataHash,
        string memory _coordinates
    ) public returns (uint256) {

        landCount++;

        lands[landCount] = Land(
            landCount,
            _farmName,
            _farmAddress,
            _areaInAcres,
            _soilType,
            msg.sender,
            _dataHash,
            block.timestamp
        );

        landLocations[landCount] = LandLocation(
            landCount,
            _coordinates
        );

        farmerLands[msg.sender].push(landCount);

        emit LandRegistered(
            landCount,
            _farmName,
            msg.sender,
            _dataHash,
            block.timestamp
        );

        return landCount;
    }

    function updateLandHash(uint256 _landId, bytes32 _newDataHash) public {
        require(lands[_landId].farmer == msg.sender, "Only land owner can update");
        require(_landId <= landCount && _landId > 0, "Invalid land ID");

        lands[_landId].dataHash = _newDataHash;
        lands[_landId].timestamp = block.timestamp;

        emit LandUpdated(
            _landId,
            lands[_landId].farmName,
            _newDataHash,
            block.timestamp
        );
    }

    function getLand(uint256 _id) public view returns (Land memory) {
        return lands[_id];
    }

    function getLandLocation(uint256 _id) public view returns (LandLocation memory) {
        return landLocations[_id];
    }

    function getFarmerLands(address _farmer) public view returns (uint256[] memory) {
        return farmerLands[_farmer];
    }

    function getFarmerLandCount(address _farmer) public view returns (uint256) {
        return farmerLands[_farmer].length;
    }
}
