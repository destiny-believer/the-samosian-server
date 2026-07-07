import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {

        customer: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Customer",

            required: true

        },

        order: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Order",

            required: true

        },

        title: {

            type: String,

            required: true

        },

        message: {

            type: String,

            required: true

        },

        status: {

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

            required: true

        },

        isRead: {

            type: Boolean,

            default: false

        }

    },
    {

        timestamps: true

    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;