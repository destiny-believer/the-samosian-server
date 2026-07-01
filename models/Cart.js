import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({

    product: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Product",

        required: true

    },

    variantId: {

        type: mongoose.Schema.Types.ObjectId,

        required: true

    },

    variantName: {

        type: String,

        required: true

    },

    variantPrice: {

        type: Number,

        required: true

    },

    quantity: {

        type: Number,

        default: 1

    }

},
    {
        _id: false
    });

const cartSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            unique: true
        },

        items: [cartItemSchema],

        totalAmount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model(
    "Cart",
    cartSchema
);

export default Cart;