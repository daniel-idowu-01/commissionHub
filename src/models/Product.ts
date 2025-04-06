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
      enum: ["in_stock", "out_of_stock"],
      default: "In stock",
    },
    specifications: {
      type: Object,
    },
    inventory: {
      type: Number,
      required: true,
    },
    revenue: {
      type: Number,
      default: 0,
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
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
