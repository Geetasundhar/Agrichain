// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CropRegistry {

    struct Crop {
        uint256 cropId;
        string cropName;
        uint256 quantity;
        uint256 price;
        address farmer;
        uint256 timestamp;
    }

    mapping(uint256 => Crop) public crops;
    uint256 public cropCount;

    function registerCrop(
        string memory _cropName,
        uint256 _quantity,
        uint256 _price
    ) public {
        cropCount++;
        crops[cropCount] = Crop(
            cropCount,
            _cropName,
            _quantity,
            _price,
            msg.sender,
            block.timestamp
        );
    }

    function getCrop(uint256 _id) public view returns (Crop memory) {
        return crops[_id];
    }
}
