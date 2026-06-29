import mongoose from "mongoose";

const settingsSchema =
new mongoose.Schema({

  shopName:{
    type:String,
    default:"The Samosian"
  },

  shopPhone:{
    type:String,
    default:""
  },

  shopEmail:{
    type:String,
    default:""
  },

  shopAddress:{
    type:String,
    default:""
  },

  googleMapsLink:{
    type:String,
    default:""
  },

  deliveryRadius:{
    type:Number,
    default:3
  },

  minimumOrderValue:{
    type:Number,
    default:350
  },

  defaultDeliveryTime:{
    type:Number,
    default:25
  },

  codEnabled:{
    type:Boolean,
    default:true
  },

  shopOpen:{
    type:Boolean,
    default:true
  }

},{
  timestamps:true
});

const Settings =
mongoose.model(
  "Settings",
  settingsSchema
);

export default Settings;