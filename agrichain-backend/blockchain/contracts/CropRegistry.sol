// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CropRegistry {

    struct Crop {
        uint256 cropId;
        string cropName;
        string cropType;
        string category;
        uint256 pricePerKg;
        uint256 quantityKg;
        uint256 durationNumber;
        string durationPeriod;
        string soilType;
        address farmer;
        uint256 timestamp;
    }

    mapping(uint256 => Crop) public crops;
    uint256 public cropCount;

    event CropRegistered(
        uint256 cropId,
        string cropName,
        address farmer,
        uint256 timestamp
    );

    function registerCrop(
        string memory _cropName,
        string memory _cropType,
        string memory _category,
        uint256 _pricePerKg,
        uint256 _quantityKg,
        uint256 _durationNumber,
        string memory _durationPeriod,
        string memory _soilType
    ) public {

        cropCount++;

        crops[cropCount] = Crop(
            cropCount,
            _cropName,
            _cropType,
            _category,
            _pricePerKg,
            _quantityKg,
            _durationNumber,
            _durationPeriod,
            _soilType,
            msg.sender,
            block.timestamp
        );

        emit CropRegistered(
            cropCount,
            _cropName,
            msg.sender,
            block.timestamp
        );
    }

    function getCrop(uint256 _id) public view returns (Crop memory) {
        return crops[_id];
    }
}