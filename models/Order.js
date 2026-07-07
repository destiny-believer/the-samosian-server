import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        productName: {
            type: String,
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
            required: true
        },

        subtotal: {
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        address: {

            label: String,

            receiverName: String,

            phoneNumber: String,

            houseNo: String,

            apartment: String,

            street: String,

            landmark: String,

            area: String,

            city: String,

            state: String,

            pincode: String,

            formattedAddress: String,

            latitude: Number,

            longitude: Number,

            deliveryInstructions: String

        },

        items: [orderItemSchema],

        totalAmount: {
            type: Number,
            required: true
        },

        deliveryCharge: {
            type: Number,
            default: 0
        },

        paymentMethod: {
            type: String,
            enum: ["COD"],
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed"
            ],
            default: "Pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Preparing",
                "Agent Assigned",
                "Picked Up",
                "On The Way",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        },

        estimatedDeliveryTime: {
            type: Number,
            default: 0
        },

        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            default: null
        },
        statusHistory: [
            {
                status: {
                    type: String
                },

                updatedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        invoiceNumber: {

            type: String,

            unique: true,

            default: null

        },

    },
    {
        timestamps: true
    }
);

const Order = mongoose.model(
    "Order",
    orderSchema
);

export default Order;