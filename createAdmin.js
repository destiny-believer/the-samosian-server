import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin =
      await Admin.findOne({
        email: "admin@samosian.com"
      });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash("admin123", 10);

    await Admin.create({
      name: "Super Admin",
      email: "admin@samosian.com",
      password: hashedPassword
    });

    console.log("Admin Created Successfully");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

createAdmin();