import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        label: {

            type: String,

            enum: [

                "Home",

                "Work",

                "Other"

            ],

            default: "Home"

        },

        receiverName: {

            type: String,

            default: "",

            trim: true

        },

        phoneNumber: {

            type: String,

            default: "",

            trim: true

        },

        houseNo: {

            type: String,

            required: true,

            trim: true

        },

        apartment: {

            type: String,

            default: "",

            trim: true

        },

        street: {

            type: String,

            required: true,

            trim: true

        },

        landmark: {

            type: String,

            default: "",

            trim: true

        },

        area: {

            type: String,

            default: "",

            trim: true

        },

        city: {

            type: String,

            required: true,

            trim: true

        },

        state: {

            type: String,

            default: "",

            trim: true

        },

        pincode: {

            type: String,

            required: true,

            trim: true

        },

        formattedAddress: {

            type: String,

            default: ""

        },

        location: {

            latitude: {

                type: Number,

                default: null

            },

            longitude: {

                type: Number,

                default: null

            }

        },

        deliveryInstructions: {

            type: String,

            default: ""

        },

        isDefault: {

            type: Boolean,

            default: false

        }

    },
    {
        timestamps: true
    });

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

        lastLogin: {
            type: Date,
            default: Date.now
        },

        addresses: [addressSchema],
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        firebaseUid: {
            type: String,
            unique: true,
            sparse: true
        }
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