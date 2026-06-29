import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        vehicleNumber: {
            type: String,
            required: true
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        approvalStatus: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected"
            ],
            default: "Pending"
        },

        agentPhoto: {
            type: String,
            default: ""
        },

        vehicleType: {
            type: String,
            enum: [
                "Bike",
                "Scooter",
                "Cycle"
            ],
            default: "Bike"
        },

        licenseNumber: {
            type: String,
            required: true
        },

        rejectionReason: {
            type: String,
            default: ""
        },

        approvedAt: {
            type: Date,
            default: null
        },

        isAvailable: {
            type: Boolean,
            default: true
        },

        currentLatitude: {
            type: Number,
            default: 0
        },

        currentLongitude: {
            type: Number,
            default: 0
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        lastLocationUpdated: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Agent = mongoose.model(
    "Agent",
    agentSchema
);

export default Agent;