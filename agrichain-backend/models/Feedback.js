import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Buyer",
            required: true,
        },
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        crop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Crop",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        photo: {
            type: String, // Base64 or URL
        },
    },
    { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
