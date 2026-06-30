import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(

    {

        customer: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Customer",

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

        type: {

            type: String,

            enum: [

                "order",

                "delivery",

                "general"

            ],

            default: "order"

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

export default mongoose.model(
    "Notification",
    notificationSchema
);