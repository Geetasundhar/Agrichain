// Test Data and Examples for LandRegistry

## Example Request/Response for Each Endpoint

### 1. Add Land (POST /api/lands/add)

**Request:**
```json
{
  "farmName": "Sunrise Acres Farm",
  "farmAddress": "123 Farm Road, Springfield, IL 62701",
  "areaInAcres": 150,
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

**Success Response (201):**
```json
{
  "message": "Primary land added successfully",
  "land": {
    "_id": "63fdbc1a2b3e4c5d6e7f8g9h",
    "farmer": "60d5ec49c1234567890abcde",
    "farmName": "Sunrise Acres Farm",
    "farmAddress": "123 Farm Road, Springfield, IL 62701",
    "areaInAcres": 150,
    "soilType": "Silt loam with good drainage",
    "location": {
      "type": "Polygon",
      "coordinates": [[[-88.2434, 39.7817], [-88.2400, 39.7817], [-88.2400, 39.7850], [-88.2434, 39.7850], [-88.2434, 39.7817]]]
    },
    "isPrimary": true,
    "blockchainLandId": 1,
    "dataHash": "0x8f3cf7ad23ecc5c6fef46a8b3d1d4e2b9a7c5e1f3a9b5d7e2f4a1c3e8b9d0f1",
    "transactionHash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    "blockNumber": 12345,
    "isRegisteredOnBlockchain": true,
    "createdAt": "2025-03-02T10:30:00.000Z",
    "updatedAt": "2025-03-02T10:30:00.000Z"
  },
  "blockchainStatus": {
    "success": true,
    "transactionHash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    "blockNumber": 12345,
    "dataHash": "0x8f3cf7ad23ecc5c6fef46a8b3d1d4e2b9a7c5e1f3a9b5d7e2f4a1c3e8b9d0f1",
    "landId": 1,
    "gasUsed": "156789"
  }
}
```

**Error Response (400):**
```json
{
  "message": "All land details are required (farmName, farmAddress, areaInAcres, coordinates)"
}
```

---

### 2. Get All Farmer Lands (GET /api/lands/my-lands)

**Response (200):**
```json
{
  "message": "Lands retrieved successfully",
  "count": 2,
  "lands": [
    {
      "_id": "63fdbc1a2b3e4c5d6e7f8g9h",
      "farmer": {
        "_id": "60d5ec49c1234567890abcde",
        "name": "John Farmer",
        "email": "john@farm.com",
        "walletAddress": "0x123abc..."
      },
      "farmName": "Sunrise Acres Farm",
      "farmAddress": "123 Farm Road, Springfield, IL 62701",
      "areaInAcres": 150,
      "isPrimary": true,
      "blockchainLandId": 1,
      "isRegisteredOnBlockchain": true,
      "createdAt": "2025-03-02T10:30:00.000Z"
    },
    {
      "_id": "63fdbc2a2b3e4c5d6e7f8h0i",
      "farmer": {
        "_id": "60d5ec49c1234567890abcde",
        "name": "John Farmer",
        "email": "john@farm.com",
        "walletAddress": "0x123abc..."
      },
      "farmName": "Valley Green Farm",
      "farmAddress": "456 Valley Road, Springfield, IL 62702",
      "areaInAcres": 200,
      "isPrimary": false,
      "blockchainLandId": 2,
      "isRegisteredOnBlockchain": true,
      "createdAt": "2025-03-01T14:20:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Land (GET /api/lands/:landId)

**Response (200):**
```json
{
  "message": "Land retrieved successfully",
  "land": {
    "_id": "63fdbc1a2b3e4c5d6e7f8g9h",
    "farmer": {
      "_id": "60d5ec49c1234567890abcde",
      "name": "John Farmer",
      "email": "john@farm.com"
    },
    "farmName": "Sunrise Acres Farm",
    "farmAddress": "123 Farm Road, Springfield, IL 62701",
    "areaInAcres": 150,
    "soilType": "Silt loam with good drainage",
    "location": {
      "type": "Polygon",
      "coordinates": [[[-88.2434, 39.7817], ...]]
    },
    "isPrimary": true,
    "blockchainLandId": 1,
    "dataHash": "0x8f3cf7ad...",
    "transactionHash": "0x1a2b3c4d...",
    "blockNumber": 12345,
    "isRegisteredOnBlockchain": true,
    "createdAt": "2025-03-02T10:30:00.000Z"
  }
}
```

---

### 4. Get Land Blockchain Data (GET /api/lands/:landId/blockchain-data)

**Response (200):**
```json
{
  "message": "Blockchain data retrieved successfully",
  "local": {
    "_id": "63fdbc1a2b3e4c5d6e7f8g9h",
    "blockchainLandId": 1,
    "dataHash": "0x8f3cf7ad23ecc5c6fef46a8b3d1d4e2b9a7c5e1f3a9b5d7e2f4a1c3e8b9d0f1",
    "transactionHash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    "blockNumber": 12345
  },
  "blockchain": {
    "landId": 1,
    "farmName": "Sunrise Acres Farm",
    "farmAddress": "123 Farm Road, Springfield, IL 62701",
    "areaInAcres": 150,
    "soilType": "Silt loam with good drainage",
    "farmer": "0x123abc456def789ghi",
    "dataHash": "0x8f3cf7ad23ecc5c6fef46a8b3d1d4e2b9a7c5e1f3a9b5d7e2f4a1c3e8b9d0f1",
    "timestamp": "2025-03-02T10:30:00.000Z",
    "coordinates": "-88.2434,39.7817;-88.2400,39.7817;-88.2400,39.7850;-88.2434,39.7850;-88.2434,39.7817"
  }
}
```

---

### 5. Verify Land Hash (GET /api/lands/:landId/verify-hash)

**Response (200):**
```json
{
  "message": "Hash verification completed",
  "landId": "63fdbc1a2b3e4c5d6e7f8g9h",
  "farmName": "Sunrise Acres Farm",
  "storedHash": "0x8f3cf7ad23ecc5c6fef46a8b3d1d4e2b9a7c5e1f3a9b5d7e2f4a1c3e8b9d0f1",
  "recalculatedHash": "0x8f3cf7ad23ecc5c6fef46a8b3d1d4e2b9a7c5e1f3a9b5d7e2f4a1c3e8b9d0f1",
  "isValid": true,
  "blockchainRegistered": true,
  "blockchainLandId": 1,
  "transactionHash": "0x1a2b3c4d..."
}
```

**Hash Mismatch Response (200):**
```json
{
  "message": "Hash verification completed",
  "landId": "63fdbc1a2b3e4c5d6e7f8g9h",
  "farmName": "Sunrise Acres Farm",
  "storedHash": "0x8f3cf7ad23ecc5c6fef46a8b3d1d4e2b9a7c5e1f3a9b5d7e2f4a1c3e8b9d0f1",
  "recalculatedHash": "0xdifferenthash1234567890abcdef",
  "isValid": false,
  "blockchainRegistered": true,
  "blockchainLandId": 1
}
```

---

### 6. Update Land (PUT /api/lands/:landId)

**Request:**
```json
{
  "farmName": "Sunrise Acres Farm - Updated",
  "areaInAcres": 155,
  "soilType": "Silt loam with excellent drainage"
}
```

**Response (200):**
```json
{
  "message": "Land updated successfully",
  "land": {
    "_id": "63fdbc1a2b3e4c5d6e7f8g9h",
    "farmName": "Sunrise Acres Farm - Updated",
    "areaInAcres": 155,
    "soilType": "Silt loam with excellent drainage",
    "blockchainLandId": 1,
    "dataHash": "0xnewhash1234567890abcdef",
    "updatedAt": "2025-03-02T11:45:00.000Z"
  },
  "blockchainStatus": {
    "success": true,
    "transactionHash": "0xnewtxhash1234567890abcdef",
    "blockNumber": 12346,
    "dataHash": "0xnewhash1234567890abcdef"
  }
}
```

---

### 7. Delete Land (DELETE /api/lands/:landId)

**Response (200):**
```json
{
  "message": "Land deleted successfully",
  "deletedLandId": "63fdbc1a2b3e4c5d6e7f8g9h",
  "note": "Data on blockchain remains immutable"
}
```

---

### 8. Get Farmer Blockchain Lands (GET /api/lands/blockchain/my-lands)

**Response (200):**
```json
{
  "message": "Blockchain lands retrieved successfully",
  "blockchainLandCount": 2,
  "blockchainLandIds": [1, 2],
  "localLands": [
    {
      "_id": "63fdbc1a2b3e4c5d6e7f8g9h",
      "farmName": "Sunrise Acres Farm",
      "blockchainLandId": 1,
      "isRegisteredOnBlockchain": true
    },
    {
      "_id": "63fdbc2a2b3e4c5d6e7f8h0i",
      "farmName": "Valley Green Farm",
      "blockchainLandId": 2,
      "isRegisteredOnBlockchain": true
    }
  ]
}
```

---

## Common Error Responses

### 401 Unauthorized (Missing JWT Token)
```json
{
  "message": "No token provided or token invalid"
}
```

### 403 Forbidden (Not Land Owner)
```json
{
  "message": "You don't have access to this land"
}
```

### 404 Not Found (Land Doesn't Exist)
```json
{
  "message": "Land not found"
}
```

### 400 Bad Request (Blockchain Not Registered)
```json
{
  "message": "This land is not registered on blockchain",
  "land": {
    "_id": "63fdbc1a2b3e4c5d6e7f8g9h",
    "farmName": "My Farm",
    "blockchainStatus": "Not registered"
  }
}
```

### 500 Server Error
```json
{
  "message": "Server error while adding land",
  "error": "Connection refused to Ganache"
}
```

---

## Testing Workflow

### Step 1: Setup
1. Start Ganache on port 7545
2. Deploy LandRegistry contract
3. Update contract address in landContract.js
4. Start the backend server

### Step 2: Get JWT Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "farmer@test.com", "password": "password123"}'
```

### Step 3: Add Land
```bash
curl -X POST http://localhost:5000/api/lands/add \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "farmName": "Test Farm",
    "farmAddress": "123 Test St",
    "areaInAcres": 50,
    "soilType": "Loamy",
    "coordinates": [[101,0], [101,1], [102,1], [102,0], [101,0]]
  }'
```

### Step 4: Get Blockchain Data
```bash
# Get the land ID from previous response
curl -X GET http://localhost:5000/api/lands/<LAND_ID>/blockchain-data \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Step 5: Verify Hash
```bash
curl -X GET http://localhost:5000/api/lands/<LAND_ID>/verify-hash \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Step 6: Update Land
```bash
curl -X PUT http://localhost:5000/api/lands/<LAND_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "areaInAcres": 55,
    "soilType": "Rich loam"
  }'
```

### Step 7: Verify Hash Again
```bash
curl -X GET http://localhost:5000/api/lands/<LAND_ID>/verify-hash \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Coordinate Format Examples

### Valid Polygon Coordinates (GeoJSON format):
```json
{
  "coordinates": [
    [-88.2434, 39.7817],
    [-88.2400, 39.7817],
    [-88.2400, 39.7850],
    [-88.2434, 39.7850],
    [-88.2434, 39.7817]
  ]
}
```

### Notes:
- Minimum 3 points required
- First and last point must be same (closes polygon)
- Format: [longitude, latitude] (not latitude, longitude!)
- Must be valid GeoJSON Polygon format
