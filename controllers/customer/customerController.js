import Customer from "../../models/Customer.js";
import otpStore from "../../utils/otpStore.js";
import jwt from "jsonwebtoken";
import { calculateDistance } from "../../utils/distanceCalculator.js";
import app from "../../config/firebaseAdmin.js";
import { getAuth } from "firebase-admin/auth";

export const sendOtp = async (
  req,
  res
) => {

  try {

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number required"
      });
    }

    const otp = "123456";

    otpStore.set(
      phone,
      otp
    );

    res.status(200).json({
      success: true,
      message: "OTP Sent",
      otp
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const firebaseLogin = async (req, res) => {

  try {

    const { firebaseToken } = req.body;

    if (!firebaseToken) {

      return res.status(400).json({
        success: false,
        message: "Firebase token is required"
      });

    }

    const decodedToken =
      await getAuth(app).verifyIdToken(firebaseToken);

    const phone =
      decodedToken.phone_number.replace("+91", "");

    const firebaseUid =
      decodedToken.uid;

    let customer =
      await Customer.findOne({ phone });

    if (!customer) {

      customer =
        await Customer.create({

          phone,

          firebaseUid,

          isVerified: true,

          addresses: []

        });

    }

    customer.firebaseUid = firebaseUid;

    customer.isVerified = true;

    customer.lastLogin = Date.now();

    await customer.save();

    const token = jwt.sign(
      {
        id: customer._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );

res.status(200).json({

  success: true,

  token,

  customer

});

  }

  catch (error) {

  console.log(error);

  res.status(500).json({

    success: false,

    message: error.message

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

    if (storedOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    let customer =
      await Customer.findOne({
        phone
      });

    if (!customer) {

      customer =
        await Customer.create({
          phone,
          isVerified: true
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
          expiresIn: "30d"
        }
      );

    otpStore.delete(phone);

    res.status(200).json({
      success: true,
      message:
        "Login Successful",
      token,
      customer
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const addAddress =
  async (req, res) => {

    try {

      const customer =
        await Customer.findById(
          req.customer.id
        );

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found"
        });
      }

      const {

        label,

        receiverName,

        phoneNumber,

        houseNo,

        apartment,

        street,

        landmark,

        area,

        city,

        state,

        pincode,

        formattedAddress,

        latitude,

        longitude,

        deliveryInstructions,

        isDefault

      } = req.body;

      const shopLatitude =
        17.314251;

      const shopLongitude =
        78.444970;

      const distance =
        calculateDistance(
          shopLatitude,
          shopLongitude,
          latitude,
          longitude
        );

      if (distance > 3) {

        return res.status(400).json({
          success: false,
          message:
            "Delivery not available beyond 3 KM"
        });

      }

      if (isDefault) {

        customer.addresses.forEach(address => {

          address.isDefault = false;

        });

      }

      customer.addresses.push({

        label,

        receiverName,

        phoneNumber,

        houseNo,

        apartment,

        street,

        landmark,

        area,

        city,

        state,

        pincode,

        formattedAddress,

        location: {

          latitude,

          longitude

        },

        deliveryInstructions,

        isDefault

      });

      await customer.save();

      res.status(201).json({
        success: true,
        message:
          "Address added successfully",
        distance
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };

export const getAddresses = async (
  req,
  res
) => {

  try {

    const customer =
      await Customer.findById(
        req.customer.id
      );

    res.status(200).json({
      success: true,
      addresses:
        customer.addresses
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const updateAddress = async (
  req,
  res
) => {

  try {

    const customer =
      await Customer.findById(
        req.customer.id
      );

    const address =
      customer.addresses.id(
        req.params.id
      );

    if (!address) {

      return res.status(404).json({
        success: false,
        message:
          "Address not found"
      });

    }

    Object.assign(
      address,
      req.body
    );

    await customer.save();

    res.status(200).json({
      success: true,
      address
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const deleteAddress = async (
  req,
  res
) => {

  try {

    const customer =
      await Customer.findById(
        req.customer.id
      );

    customer.addresses =
      customer.addresses.filter(
        address =>
          address._id.toString() !==
          req.params.id
      );

    await customer.save();

    res.status(200).json({
      success: true,
      message:
        "Address deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getProfile = async (
  req,
  res
) => {

  try {

    const customer =
      await Customer.findById(
        req.customer.id
      ).select(
        "-__v"
      );

    if (!customer) {

      return res.status(404).json({

        success: false,

        message: "Customer not found"

      });

    }

    res.status(200).json({

      success: true,

      customer

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

export const updateProfile = async (
  req,
  res
) => {

  try {

    const customerId =
      req.customer.id;

    const {

      name,

      email,

      gender,

      dateOfBirth

    } = req.body;

    const customer =
      await Customer.findById(
        customerId
      );

    if (!customer) {

      return res.status(404).json({

        success: false,

        message: "Customer not found"

      });

    }

    customer.name =
      name?.trim() ||
      customer.name;

    customer.email =
      email?.trim().toLowerCase() ||
      customer.email;

    customer.gender =
      gender ||
      customer.gender;

    customer.dateOfBirth =
      dateOfBirth ||
      customer.dateOfBirth;

    await customer.save();

    res.status(200).json({

      success: true,

      message:
        "Profile updated successfully",

      customer

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

export const toggleFavorite =
  async (req, res) => {

    try {

      const customerId =
        req.customer.id;

      const {
        productId
      } = req.params;

      const customer =
        await Customer.findById(
          customerId
        );

      if (!customer) {

        return res.status(404).json({

          success: false,

          message: "Customer not found"

        });

      }

      const alreadyFavorite =
        customer.favorites.includes(
          productId
        );

      if (alreadyFavorite) {

        customer.favorites =
          customer.favorites.filter(
            id =>
              id.toString() !==
              productId
          );

      }

      else {

        customer.favorites.push(
          productId
        );

      }

      await customer.save();

      res.status(200).json({

        success: true,

        favorite:
          !alreadyFavorite,

        message:
          alreadyFavorite
            ? "Removed from favorites"
            : "Added to favorites"

      });

    }

    catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });

    }

  };

export const getFavorites =
  async (req, res) => {

    try {

      const customer =
        await Customer
          .findById(
            req.customer.id
          )
          .populate(
            "favorites"
          );

      if (!customer) {

        return res.status(404).json({

          success: false,

          message: "Customer not found"

        });

      }

      res.status(200).json({

        success: true,

        favorites:
          customer.favorites

      });

    }

    catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });

    }

  };