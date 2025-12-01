import Buyer from "../models/buyeruser.js";

//  Get Buyer Profile
export const getBuyerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await Buyer.findById(id).select("-password");
    if (!buyer) {
      return res.status(404).json({ status: "error", message: "Buyer not found" });
    }
    res.json({ status: "success", buyer });
  } catch (err) {
    console.error("Error fetching buyer profile:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Update Buyer Profile
export const updateBuyerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyer_name, business_name, district, phone, email } = req.body;

    let updateData = { buyer_name, business_name, district, phone, email };
    if (req.file) updateData.profile_image = `/uploads/${req.file.filename}`;

    const updatedBuyer = await Buyer.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!updatedBuyer) {
      return res.status(404).json({ status: "error", message: "Buyer not found" });
    }

    res.json({ status: "success", message: "Profile updated successfully", buyer: updatedBuyer });
  } catch (err) {
    console.error("Error updating buyer profile:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
