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

        label: {
            type: String,
            enum: [
                "Home",
                "Work",
                "Other"
            ],
            default: "Home"
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
            default: "",
            trim: true
        },

        phone: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            default: "",
            lowercase: true,
            trim: true
        },

        gender: {
            type: String,
            enum: [
                "Male",
                "Female",
                "Other"
            ],
            default: "Other"
        },

        dateOfBirth: {
            type: Date,
            default: null
        },

        profileImage: {
            type: String,
            default: ""
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        addresses: [addressSchema],
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]
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