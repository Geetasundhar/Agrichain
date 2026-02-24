const Product = require("../models/Product");
const Purchase = require("../models/Purchase");
const Retailer = require("../models/Retailer");
const User = require("../models/User");

// add a new product (seed or fertilizer) - retailer only
exports.addProduct = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const {
      productType,
      productName,
      image,
      quantity,
      price,
    } = req.body;

    // basic validation
    if (!productType || !productName) {
      return res.status(400).json({ message: "productType and productName are required" });
    }

    // ensure user is a retailer
    const retailer = await Retailer.findById(retailerId);
    if (!retailer) {
      return res.status(403).json({ message: "Only retailers can add products" });
    }

    const newProduct = new Product({
      productType,
      productName,
      image,
      quantity: quantity || 0,
      price: price || 0,
      retailer: retailerId,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ message: "Server error adding product" });
  }
};

// list products belonging to the logged-in retailer
exports.getMyProducts = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const products = await Product.find({ retailer: retailerId });
    res.status(200).json({ products });
  } catch (err) {
    console.error("Get My Products Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// public endpoint to list all available products (for farmers to browse)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "retailer",
      select: "name email shop_image organization",
      populate: { path: "organization", select: "organizationName" },
    });
    res.status(200).json({ products });
  } catch (err) {
    console.error("Get All Products Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// lookup a product by its generated productId string
exports.getProductByProductId = async (req, res) => {
  try {
    const { id } = req.params; // this id is the productId field, not _id
    const product = await Product.findOne({ productId: id }).populate({
      path: "retailer",
      select: "name email shop_image organization",
      populate: { path: "organization", select: "organizationName" },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (err) {
    console.error("Get Product By Id Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// farmer buys a product
exports.buyProduct = async (req, res) => {
  try {
    console.log("buyProduct called", { headers: req.headers, body: req.body, user: req.user });
    const farmerId = req.user && req.user.id;
    const { productId, quantity } = req.body;

    // basic farmer check
    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(403).json({ message: "Only farmers can purchase products" });
    }

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "productId and positive quantity are required" });
    }

    const product = await Product.findOne({ productId });
    console.log("Found product for purchase:", product ? { id: product._id, productId: product.productId, qty: product.quantity } : null);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({ message: `Only ${product.quantity} items available` });
    }

    // decrement product stock
    product.quantity -= quantity;
    await product.save();

    // if stock has run out, remove product automatically
    if (product.quantity <= 0) {
      try {
        await Product.deleteOne({ _id: product._id });
      } catch (err) {
        console.warn("Failed to delete empty product", err);
      }
    }

    const purchase = await Purchase.create({
      product: product._id,
      productId: product.productId,
      retailer: product.retailer,
      farmer: farmerId,
      quantity,
      totalPrice: quantity * (product.price || 0),
    });

    // populate the purchase for response (include product and retailer details)
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate("product", "productId productName productType price")
      .populate({
        path: "retailer",
        select: "name email shop_image organization",
        populate: { path: "organization", select: "organizationName" },
      });

    console.log("Created purchase:", populatedPurchase);

    res.status(200).json({ message: "Purchase successful", purchase: populatedPurchase });
  } catch (err) {
    console.error("Buy Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get purchases made by logged in farmer
exports.getMyPurchases = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(403).json({ message: "Only farmers can view their purchases" });
    }
    const purchases = await Purchase.find({ farmer: farmerId })
      .populate("product", "productId productName productType price")
      .populate({
        path: "retailer",
        select: "name email shop_image organization",
        populate: { path: "organization", select: "organizationName" },
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ purchases });
  } catch (err) {
    console.error("Get My Purchases Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get farmer's available purchased products for crop creation (grouped by type)
exports.getPurchasedProductsByType = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const purchases = await Purchase.find({ farmer: farmerId })
      .populate("product", "productId productName productType quantity price");
    
    // group by product type and include remaining quantity
    const byType = { seed: [], fertilizer: [] };
    purchases.forEach(p => {
      if (p.product && p.product.productType) {
        byType[p.product.productType] && byType[p.product.productType].push({
          productId: p.productId,
          productName: p.product.productName,
          quantity: p.quantity, // purchased quantity
          price: p.product.price,
        });
      }
    });
    
    res.status(200).json(byType);
  } catch (err) {
    console.error("Get Purchased Products By Type Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get purchases of this retailer's products
exports.getRetailerPurchases = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const purchases = await Purchase.find({ retailer: retailerId })
      .populate("product", "productId productName productType price")
      .populate("farmer", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ purchases });
  } catch (err) {
    console.error("Get Retailer Purchases Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
