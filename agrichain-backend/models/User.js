const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    phone: { type: String },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🖼️ Profile photo
    photo: { type: String },

    // 🚜 To track geofencing completion (for farmers)
    isFarmLocationAdded: {
      type: Boolean,
      default: false
    },

    // Gamification points (farmers earn by updating crops, lose by missing deadlines)
    points: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Remove old username index if it exists and ensure email index
userSchema.pre('save', async function(next) {
  try {
    // Drop the old username index if it exists (one-time cleanup)
    const collection = this.constructor.collection;
    const indexes = await collection.getIndexes();
    
    if (indexes.username_1) {
      await collection.dropIndex('username_1');
      console.log('✅ Dropped old username index');
    }
  } catch (err) {
    // Index might not exist, that's okay
    if (err.message.includes('index not found')) {
      console.log('⚠️ No old username index found');
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
