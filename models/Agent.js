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
        },
        currentOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null
        },

        status: {
            type: String,
            enum: [
                "Offline",
                "Available",
                "Assigned",
                "Picking Up",
                "Delivering"
            ],
            default: "Offline"
        },

        rating: {
            type: Number,
            default: 5
        },

        totalRatings: {
            type: Number,
            default: 0
        },

        todayEarnings: {
            type: Number,
            default: 0
        },

        totalEarnings: {
            type: Number,
            default: 0
        },

        completedDeliveries: {
            type: Number,
            default: 0
        },

        cancelledDeliveries: {
            type: Number,
            default: 0
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