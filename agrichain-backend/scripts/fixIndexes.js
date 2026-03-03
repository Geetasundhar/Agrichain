const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

async function fixIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/agrichain");
    console.log("✅ Connected to MongoDB");

    // Get the users collection
    const collection = User.collection;

    // Get all indexes
    const indexes = await collection.getIndexes();
    console.log("📋 Current indexes:", Object.keys(indexes));

    // Drop the old username index if it exists
    if (indexes.username_1) {
      await collection.dropIndex("username_1");
      console.log("✅ Dropped old username_1 index");
    } else {
      console.log("⚠️ No username_1 index found (already clean)");
    }

    // Rebuild indexes from schema
    await collection.createIndex({ email: 1 }, { unique: true });
    console.log("✅ Ensured email unique index exists");

    console.log("✨ Index cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing indexes:", error);
    process.exit(1);
  }
}

fixIndexes();
