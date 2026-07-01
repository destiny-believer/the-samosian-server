import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({

  name: {

    type: String,

    required: true

  },

  price: {

    type: Number,

    required: true

  }

});

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
    ],
    bestSeller: {
      type: Boolean,
      default: false
    },

    featured: {
      type: Boolean,
      default: false
    },

    totalOrders: {
      type: Number,
      default: 0
    },

    views: {
      type: Number,
      default: 0
    },
    displayOrder: {
      type: Number,
      default: 0
    }

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