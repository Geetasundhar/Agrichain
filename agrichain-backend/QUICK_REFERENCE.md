# Quick Reference Guide - LandRegistry Implementation

## 📁 Files at a Glance

### ✨ New Smart Contract
```
blockchain/contracts/LandRegistry.sol
├─ Structs: Land, LandLocation
├─ Mappings: crops, landLocations, farmerLands
├─ Functions: registerLand, updateLandHash, getLand, getFarmerLands
└─ Events: LandRegistered, LandUpdated
```

### 🔗 New Blockchain Integration
```
blockchain/
├─ landContract.js → Contract instance & Ganache connection
├─ landBlockchainService.js → Core blockchain operations
└─ scripts/deployLandRegistry.js → Deployment automation
```

### 🛠️ Updated/New Backend
```
controllers/landController.js → Extended with blockchain functions
├─ addLand() ✏️ Now registers on blockchain
├─ getFarmerLands() ⭐ New
├─ getLandById() ⭐ New
├─ getLandBlockchainData() ⭐ New
├─ updateLand() ✏️ Updates blockchain hash
├─ verifyLandHash() ⭐ New
├─ getFarmerBlockchainLands() ⭐ New
└─ deleteLand() ⭐ New

models/Land.js → Added blockchain fields
├─ blockchainLandId
├─ dataHash
├─ transactionHash
├─ blockNumber
├─ isRegisteredOnBlockchain
└─ soilType

routes/landRoutes.js ⭐ New
└─ 8 protected endpoints for land management
```

### 📖 Documentation
```
LAND_REGISTRY_SETUP.md → Quick start guide
IMPLEMENTATION_SUMMARY.md → Complete overview
blockchain/LAND_REGISTRY_README.md → Technical deep dive
TEST_EXAMPLES.md → API examples & testing workflow
```

## 🚀 3-Minute Setup

### Step 1: Deploy Contract
```bash
cd blockchain
npx hardhat run scripts/deployLandRegistry.js --network ganache
# Copy the contract address from output
```

### Step 2: Update Contract Address
```javascript
// File: blockchain/landContract.js
const contractAddress = "0x<PASTE_ADDRESS_HERE>";
```

### Step 3: Add Routes to Server
```javascript
// File: server.js
const landRoutes = require("./routes/landRoutes");
app.use("/api/lands", landRoutes);
```

### Step 4: Test It
```bash
# Add a land (requires JWT token)
curl -X POST http://localhost:5000/api/lands/add \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "farmName": "Test Farm",
    "farmAddress": "123 Test St",
    "areaInAcres": 50,
    "soilType": "Loamy",
    "coordinates": [[101,0],[101,1],[102,1],[102,0],[101,0]]
  }'
```

## 📋 API Endpoints (Quick Reference)

```
POST   /api/lands/add                        → Add & register land
GET    /api/lands/my-lands                   → Get all farmer's lands
GET    /api/lands/:landId                    → Get single land
GET    /api/lands/:landId/blockchain-data    → Get blockchain data
GET    /api/lands/:landId/verify-hash        → Verify hash integrity
PUT    /api/lands/:landId                    → Update land & hash
DELETE /api/lands/:landId                    → Delete land
GET    /api/lands/blockchain/my-lands        → Get blockchain lands
```

*All endpoints require JWT authentication in Authorization header*

## 🔄 What Happens When You Add Land

```
User submits form
    ↓
addLand() saves to MongoDB
    ↓
registerLandOnBlockchain() is called
    ├─ generateLandDataHash() creates hash
    ├─ formatCoordinatesToString() converts coordinates
    └─ Calls LandRegistry.registerLand()
    ↓
Smart contract registers land
    ├─ Creates Land struct
    ├─ Stores in mappings
    └─ Emits LandRegistered event
    ↓
Update MongoDB with blockchain details
    ├─ blockchainLandId
    ├─ dataHash
    ├─ transactionHash
    └─ blockNumber
    ↓
Return success response to user
```

## 🧪 Test Data Template

```json
{
  "farmName": "My Farm Name",
  "farmAddress": "123 Farm Road, City, State 12345",
  "areaInAcres": 100,
  "soilType": "Silt loam with good drainage",
  "coordinates": [
    [-88.2434, 39.7817],
    [-88.2400, 39.7817],
    [-88.2400, 39.7850],
    [-88.2434, 39.7850],
    [-88.2434, 39.7817]
  ]
}
```

## 🔐 Hash Verification

Original data → JSON string → keccak256 hash → stored on blockchain

To verify at any time:
```bash
GET /api/lands/:landId/verify-hash
```

Response:
```json
{
  "isValid": true,           // true = data unchanged, false = modified
  "storedHash": "0x...",
  "recalculatedHash": "0x...",
  "blockchainRegistered": true,
  "blockchainLandId": 1
}
```

## ⚠️ Important Notes

1. **Contract Address**: Must be updated in `blockchain/landContract.js` after deployment
2. **Ganache**: Must be running on `http://127.0.0.1:7545`
3. **JWT Required**: All endpoints need Authorization header with JWT token
4. **GeoJSON Format**: Coordinates must be `[longitude, latitude]` not latitude first!
5. **Blockchain Immutable**: Data on blockchain can't be deleted (only local DB deletion)
6. **Hash Calculation**: Includes timestamp, so recalculating shows current hash

## 📊 Database Fields Added

| Field | Type | Example |
|-------|------|---------|
| blockchainLandId | Number | 1 |
| dataHash | String | "0x8f3cf7ad..." |
| transactionHash | String | "0x1a2b3c4d..." |
| blockNumber | Number | 12345 |
| isRegisteredOnBlockchain | Boolean | true |
| soilType | String | "Silt loam" |

## 🆘 Quick Troubleshooting

**Issue**: "Blockchain registration skipped - contract not deployed"
- **Fix**: Deploy contract and update address in landContract.js

**Issue**: "Connection refused to Ganache"
- **Fix**: Start Ganache on port 7545: `ganache-cli -p 7545`

**Issue**: "You don't have access to this land"
- **Fix**: Ensure JWT token belongs to the farmer who created the land

**Issue**: Hash mismatch on verification
- **Fix**: Data was modified in database; recalculated hash will differ

**Issue**: "Coordinates must be an array with at least 3 points"
- **Fix**: Provide minimum 3 coordinate pairs; first and last should be same

## 📞 Key Functions Reference

### In landBlockchainService.js

```javascript
// Generates hash from land data
generateLandDataHash(landData) → string

// Registers land on blockchain
registerLandOnBlockchain(walletAddress, landData) → {success, tx}

// Updates hash when data changes
updateLandHashOnBlockchain(landId, updatedData) → {success, tx}

// Retrieves land from blockchain
getLandFromBlockchain(landId) → {success, land}

// Gets all lands for farmer
getFarmerLandsFromBlockchain(farmerAddress) → {success, landIds}

// Converts GeoJSON to string
formatCoordinatesToString(geoJsonLocation) → string
```

### In landController.js

```javascript
exports.addLand() → Register new land
exports.getFarmerLands() → Get all lands for farmer
exports.getLandById() → Get specific land with auth
exports.getLandBlockchainData() → Get blockchain details
exports.verifyLandHash() → Verify data integrity
exports.updateLand() → Update land and hash
exports.deleteLand() → Delete land locally
exports.getFarmerBlockchainLands() → Get blockchain lands
```

## 📈 Success Metrics

✅ Contract deployed successfully
✅ Contract address updated in landContract.js
✅ Routes added to server.js
✅ Can create land with blockchain registration
✅ Hash stored and retrievable
✅ Hash verification works correctly
✅ Updates reflect on blockchain
✅ Multiple lands per farmer supported

## 🔍 Where to Look

- **Smart Contract Logic**: `blockchain/contracts/LandRegistry.sol`
- **Blockchain Calls**: `blockchain/landBlockchainService.js`
- **API Endpoints**: `routes/landRoutes.js`
- **Request Handlers**: `controllers/landController.js`
- **Data Model**: `models/Land.js`
- **Full Docs**: `LAND_REGISTRY_README.md`
- **Examples**: `TEST_EXAMPLES.md`
- **Setup Help**: `LAND_REGISTRY_SETUP.md`

---

**Ready to deploy? Start with the 3-Minute Setup above!** 🚀
