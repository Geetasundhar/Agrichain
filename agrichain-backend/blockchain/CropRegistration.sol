    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    contract CropRegistration {
        // Crop structure
        struct Crop {
            uint256 id;
            address farmer;
            string cropName;
            string cropType;
            uint256 quantityKg;
            uint256 pricePerKg;
            string location;
            string qrHash;   // hash or QR code reference
            uint256 timestamp;
        }

        uint256 public cropCount = 0;
        mapping(uint256 => Crop) public crops;

        // Event when a new crop is registered
        event CropRegistered(
            uint256 id,
            address farmer,
            string cropName,
            string cropType,
            uint256 quantityKg,
            uint256 pricePerKg,
            string location,
            string qrHash,
            uint256 timestamp
        );

        // Register crop function
        function registerCrop(
            string memory _cropName,
            string memory _cropType,
            uint256 _quantityKg,
            uint256 _pricePerKg,
            string memory _location,
            string memory _qrHash
        ) public {
            cropCount++;
            crops[cropCount] = Crop(
                cropCount,
                msg.sender,
                _cropName,
                _cropType,
                _quantityKg,
                _pricePerKg,
                _location,
                _qrHash,
                block.timestamp
            );

            emit CropRegistered(
                cropCount,
                msg.sender,
                _cropName,
                _cropType,
                _quantityKg,
                _pricePerKg,
                _location,
                _qrHash,
                block.timestamp
            );
        }

        // Get crop by ID
        function getCrop(uint256 _id) public view returns (
            uint256,
            address,
            string memory,
            string memory,
            uint256,
            uint256,
            string memory,
            string memory,
            uint256
        ) {
            Crop memory c = crops[_id];
            return (
                c.id,
                c.farmer,
                c.cropName,
                c.cropType,
                c.quantityKg,
                c.pricePerKg,
                c.location,
                c.qrHash,
                c.timestamp
            );
        }
    }
        