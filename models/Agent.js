import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    vehicleNumber:{
        type:String,
        required:true
    },

    isVerified:{
        type:Boolean,
        default:false
    },

    isApproved:{
        type:Boolean,
        default:false
    },

    isAvailable:{
        type:Boolean,
        default:true
    },

    currentLatitude:{
        type:Number,
        default:0
    },

    currentLongitude:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
}
);

const Agent = mongoose.model(
    "Agent",
    agentSchema
);

export default Agent;