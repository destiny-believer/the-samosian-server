import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
{
    houseNo: {
        type: String,
        required: true
    },

    street: {
        type: String,
        default: ""
    },

    landmark: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    pincode: {
        type: String,
        default: ""
    },

    latitude: {
        type: Number,
        required: true
    },

    longitude: {
        type: Number,
        required: true
    },

    isDefault: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);

const customerSchema = new mongoose.Schema(
{
    name: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    addresses: [addressSchema]
},
{
    timestamps: true
}
);

const Customer = mongoose.model(
    "Customer",
    customerSchema
);

export default Customer;