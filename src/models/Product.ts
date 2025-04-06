import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    productImages: {
      type: [String],
      // required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Fashion",
        "Home & Kitchen",
        "Beauty",
        "Sports",
        "Automotive",
        "Books",
        "Toys",
        "Health",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    recommendedPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["In stock", "Out of Stock"],
      default: "In stock",
    },
    specifications: {
      type: Object,
    },
    inventory: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },
    allowReselling: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String], // ['newArrival', 'bestSeller', 'limitedEdition']
      default: [],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
