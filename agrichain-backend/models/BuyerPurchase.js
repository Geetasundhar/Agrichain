const mongoose = require("mongoose");

const buyerPurchaseSchema = new mongoose.Schema(
    {
        crop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crop",
            required: true,
        },
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // farmers are stored in User model
            required: true,
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BuyerUser", // Ensure this matches the actual model name for buyers
            required: true,
        },
        quantityKg: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BuyerPurchase", buyerPurchaseSchema);
