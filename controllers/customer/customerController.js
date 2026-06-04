import Customer from "../../models/Customer.js";
import otpStore from "../../utils/otpStore.js";
import jwt from "jsonwebtoken";
import { calculateDistance } from "../../utils/distanceCalculator.js";

export const sendOtp = async (
  req,
  res
) => {

  try {

    const { phone } = req.body;

    if(!phone){
      return res.status(400).json({
        success:false,
        message:"Phone number required"
      });
    }

    const otp = "123456";

    otpStore.set(
      phone,
      otp
    );

    res.status(200).json({
      success:true,
      message:"OTP Sent",
      otp
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

export const verifyOtp = async (
  req,
  res
) => {

  try {

    const {
      phone,
      otp
    } = req.body;

    const storedOtp =
      otpStore.get(phone);

    if(storedOtp !== otp){
      return res.status(400).json({
        success:false,
        message:"Invalid OTP"
      });
    }

    let customer =
      await Customer.findOne({
        phone
      });

    if(!customer){

      customer =
        await Customer.create({
          phone,
          isVerified:true
        });

    } else {

      customer.isVerified = true;

      await customer.save();

    }

    const token =
      jwt.sign(
        {
          customerId:
          customer._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn:"30d"
        }
      );

    otpStore.delete(phone);

    res.status(200).json({
      success:true,
      message:
      "Login Successful",
      token,
      customer
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

export const addAddress =
async (req,res) => {

  try {

    const customer =
      await Customer.findById(
        req.customer.customerId
      );

    if(!customer){
      return res.status(404).json({
        success:false,
        message:"Customer not found"
      });
    }

    const {
      houseNo,
      street,
      landmark,
      city,
      pincode,
      latitude,
      longitude
    } = req.body;

    const shopLatitude =
      17.314355;

    const shopLongitude =
      78.445004;

    const distance =
      calculateDistance(
        shopLatitude,
        shopLongitude,
        latitude,
        longitude
      );

    if(distance > 3){

      return res.status(400).json({
        success:false,
        message:
        "Delivery not available beyond 3 KM"
      });

    }

    customer.addresses.push({
      houseNo,
      street,
      landmark,
      city,
      pincode,
      latitude,
      longitude
    });

    await customer.save();

    res.status(201).json({
      success:true,
      message:
      "Address added successfully",
      distance
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};