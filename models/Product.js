import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    }
  },
  {
    _id: false
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    variants: {
      type: [variantSchema],
      required: true
    },

    isVeg: {
      type: Boolean,
      default: false
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    preparationTime: {
      type: Number,
      default: 15
    },

    rating: {
      type: Number,
      default: 0
    },

    totalRatings: {
      type: Number,
      default: 0
    },

    totalOrders: {
      type: Number,
      default: 0
    },

    isFeatured: {
      type: Boolean,
      default: false
    },
    reviews: [
      {
        customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer"
        },

        customerName: {
          type: String
        },

        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },

        comment: {
          type: String,
          default: ""
        },

        createdAt: {
          type: Date,
          default: Date.now
        },
        updatedAt: {
          type: Date,
          default: null
        }
      }
    ]

  },
  {
    timestamps: true
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;