# LandRegistry Smart Contract and Backend Integration Guide

## Overview

This guide explains the LandRegistry.sol smart contract and the corresponding backend implementation that enables secure, immutable land registration on the blockchain.

## Smart Contract: LandRegistry.sol

### Features

- **Land Registration**: Register land with farm details, coordinates, and data hash
- **Data Immutability**: Land data is hashed and stored on blockchain for authenticity verification
- **Hash Updates**: Update land data hashes when information changes
- **Farmer Land Tracking**: Track all lands registered by a specific farmer
- **Location Storage**: Store GeoJSON coordinates on blockchain

### Smart Contract Structure

#### Structs

```solidity
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
```

#### Key Functions

1. **registerLand()** - Register a new land with hash and coordinates
   ```solidity
   function registerLand(
       string memory _farmName,
       string memory _farmAddress,
       uint256 _areaInAcres,
       string memory _soilType,
       bytes32 _dataHash,
       string memory _coordinates
   ) public returns (uint256)
   ```

2. **updateLandHash()** - Update hash when land data changes
   ```solidity
   function updateLandHash(uint256 _landId, bytes32 _newDataHash) public
   ```

3. **getLand()** - Retrieve land details
   ```solidity
   function getLand(uint256 _id) public view returns (Land memory)
   ```

4. **getFarmerLands()** - Get all lands for a farmer
   ```solidity
   function getFarmerLands(address _farmer) public view returns (uint256[] memory)
   ```

### Events

- **LandRegistered**: Emitted when land is registered
- **LandUpdated**: Emitted when land hash is updated

## Backend Implementation

### File Structure

```
agrichain-backend/
├── blockchain/
│   ├── contracts/
│   │   └── LandRegistry.sol          # Smart contract
│   ├── landContract.js                # Contract instance initialization
│   └── landBlockchainService.js       # Blockchain service layer
├── controllers/
│   └── landController.js              # API endpoint handlers
├── models/
│   └── Land.js                        # MongoDB Land model (updated with blockchain fields)
└── routes/
    └── landRoutes.js                  # Land API routes
```

### Database Model (Land.js)

Added blockchain-related fields to the Land model:

```javascript
blockchainLandId: Number       // Land ID on blockchain
dataHash: String               // Keccak256 hash of land data
transactionHash: String        // Ethereum transaction hash
blockNumber: Number            // Ethereum block number
isRegisteredOnBlockchain: Boolean // Registration status
soilType: String              // Soil type information
```

### Blockchain Service (landBlockchainService.js)

Core functions for blockchain interaction:

#### 1. generateLandDataHash(landData)
**Purpose**: Generate keccak256 hash of land data
**Returns**: Hash string
**Used for**: Data integrity verification

```javascript
const hash = generateLandDataHash({
  farmName: "Smith Farm",
  farmAddress: "123 Farm Lane",
  areaInAcres: 50,
  location: geoJsonLocation,
  timestamp: "2025-03-02T10:00:00Z"
});
```

#### 2. registerLandOnBlockchain(walletAddress, landData)
**Purpose**: Register land on blockchain and return transaction details
**Returns**: Object with success status, transaction hash, block number, land ID
**Called when**: New land is added

```javascript
const result = await registerLandOnBlockchain(farmerAddress, landData);
// Returns: { success: true, transactionHash, blockNumber, dataHash, landId, gasUsed }
```

#### 3. updateLandHashOnBlockchain(landId, updatedLandData)
**Purpose**: Update hash when land data changes
**Returns**: Transaction receipt with new hash
**Called when**: Land is updated

#### 4. getLandFromBlockchain(landId)
**Purpose**: Retrieve land details from blockchain
**Returns**: Land object with all details including hash

#### 5. getFarmerLandsFromBlockchain(farmerAddress)
**Purpose**: Get all land IDs registered by a farmer
**Returns**: Array of land IDs and count

#### 6. formatCoordinatesToString(geoJsonLocation)
**Purpose**: Convert GeoJSON coordinates to string format
**Returns**: Semicolon-separated coordinate string

### API Endpoints

#### 1. Add Land
**Endpoint**: `POST /api/lands/add`
**Auth**: Required (JWT token)
**Request Body**:
```json
{
  "farmName": "Smith Farm",
  "farmAddress": "123 Farm Lane, City, State",
  "areaInAcres": 50,
  "soilType": "Loamy soil",
  "coordinates": [
    [101.0, 0.0],
    [101.0, 1.0],
    [102.0, 1.0],
    [102.0, 0.0],
    [101.0, 0.0]
  ]
}
```

**Response**:
```json
{
  "message": "Primary land added successfully",
  "land": {
    "_id": "507f1f77bcf86cd799439011",
    "farmName": "Smith Farm",
    "blockchainLandId": 1,
    "dataHash": "0x123abc...",
    "isRegisteredOnBlockchain": true,
    "transactionHash": "0x456def..."
  },
  "blockchainStatus": {
    "success": true,
    "transactionHash": "0x456def...",
    "blockNumber": 12345
  }
}
```

#### 2. Get All Farmer Lands
**Endpoint**: `GET /api/lands/my-lands`
**Auth**: Required
**Response**: Array of all lands for the farmer

#### 3. Get Single Land
**Endpoint**: `GET /api/lands/:landId`
**Auth**: Required
**Response**: Single land object with all details

#### 4. Get Land Blockchain Data
**Endpoint**: `GET /api/lands/:landId/blockchain-data`
**Auth**: Required
**Response**:
```json
{
  "message": "Blockchain data retrieved successfully",
  "local": {
    "_id": "507f1f77bcf86cd799439011",
    "blockchainLandId": 1,
    "dataHash": "0x123abc...",
    "transactionHash": "0x456def...",
    "blockNumber": 12345
  },
  "blockchain": {
    "landId": 1,
    "farmName": "Smith Farm",
    "farmAddress": "123 Farm Lane",
    "areaInAcres": 50,
    "dataHash": "0x123abc...",
    "farmer": "0x123...",
    "timestamp": "2025-03-02T10:00:00Z"
  }
}
```

#### 5. Verify Land Hash
**Endpoint**: `GET /api/lands/:landId/verify-hash`
**Auth**: Required
**Response**:
```json
{
  "message": "Hash verification completed",
  "landId": "507f1f77bcf86cd799439011",
  "farmName": "Smith Farm",
  "storedHash": "0x123abc...",
  "recalculatedHash": "0x123abc...",
  "isValid": true,
  "blockchainRegistered": true,
  "blockchainLandId": 1
}
```

#### 6. Update Land
**Endpoint**: `PUT /api/lands/:landId`
**Auth**: Required
**Request Body**: Same as add land (update fields)
**Response**: Updated land object + blockchain status

#### 7. Delete Land
**Endpoint**: `DELETE /api/lands/:landId`
**Auth**: Required
**Response**:
```json
{
  "message": "Land deleted successfully",
  "deletedLandId": "507f1f77bcf86cd799439011",
  "note": "Data on blockchain remains immutable"
}
```

#### 8. Get Farmer Blockchain Lands
**Endpoint**: `GET /api/lands/blockchain/my-lands`
**Auth**: Required
**Response**:
```json
{
  "message": "Blockchain lands retrieved successfully",
  "blockchainLandCount": 2,
  "blockchainLandIds": [1, 2],
  "localLands": [...]
}
```

## Integration with Server

Add the land routes to your main server file:

```javascript
// server.js
const landRoutes = require("./routes/landRoutes");

// ... other routes ...

app.use("/api/lands", landRoutes);
```

## Deployment Steps

### 1. Deploy Smart Contract

```bash
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
```

Copy the deployed contract address from the output.

### 2. Update Contract Address

Update the contract address in `landContract.js`:

```javascript
const contractAddress = "0x<YOUR_DEPLOYED_ADDRESS>";
```

### 3. Generate Contract ABI

After deployment, copy the ABI from the artifact file:
- Location: `blockchain/artifacts/contracts/LandRegistry.sol/LandRegistry.json`
- The ABI is used in `landBlockchainService.js` for function calls

### 4. Install Dependencies

```bash
npm install
```

The following packages are required:
- `ethers`: For blockchain interaction
- `mongoose`: For database operations
- `express`: For API server

## Data Hash Generation

Land data hash is generated using:
- Farm Name
- Farm Address
- Area in Acres
- Location (GeoJSON)
- Timestamp

```javascript
const dataString = JSON.stringify({
  farmName: "Smith Farm",
  farmAddress: "123 Farm Lane",
  areaInAcres: 50,
  location: { type: "Polygon", coordinates: [...] },
  timestamp: "2025-03-02T10:00:00Z"
});

const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(dataString));
```

## Error Handling

Both smart contract and backend include error handling:

### Smart Contract Errors
- Land ownership verification
- Invalid land ID validation
- Caller authorization checks

### Backend Errors
- User authentication
- Land ownership verification
- Blockchain connection failures (gracefully handled)
- Input validation
- Database errors

## Security Considerations

1. **Data Integrity**: Hashes verify that land data hasn't been tampered with
2. **Immutability**: Blockchain ensures historical records cannot be changed
3. **Ownership**: Only the farmer who registered land can update it
4. **Authorization**: JWT token required for all land operations

## Testing

### Manual Testing with cURL

```bash
# Add land
curl -X POST http://localhost:5000/api/lands/add \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "farmName": "Test Farm",
    "farmAddress": "123 Test Lane",
    "areaInAcres": 100,
    "soilType": "Rich loam",
    "coordinates": [[101,0], [101,1], [102,1], [102,0], [101,0]]
  }'

# Get all lands
curl -X GET http://localhost:5000/api/lands/my-lands \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"

# Verify hash
curl -X GET http://localhost:5000/api/lands/<LAND_ID>/verify-hash \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

## Troubleshooting

### Blockchain Connection Failed
- Ensure Ganache is running on `http://127.0.0.1:7545`
- Check contract address is correctly set

### Hash Mismatch
- Verify data has not been modified directly in database
- Check timestamp matches exactly

### Transaction Failed
- Ensure sufficient gas (should be ~150k-200k per transaction)
- Check farmer account has sufficient balance
- Verify contract address is correct

## Future Enhancements

1. **Multi-signature Support**: For land ownership disputes
2. **Land Lease Tracking**: Track lease agreements on blockchain
3. **Crop History**: Link crops to specific lands
4. **Insurance Claims**: Automate insurance claims based on land registry
5. **Land Transfer**: Support transferring land ownership on-chain
