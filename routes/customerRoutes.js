import express from "express";
import customerMiddleware from "../middleware/customerMiddleware.js";
import { addAddress } from "../controllers/customer/customerController.js";

import {
  sendOtp,
  verifyOtp
}
from "../controllers/customer/customerController.js";

const router = express.Router();

router.post(
  "/send-otp",
  sendOtp
);

router.post(
  "/verify-otp",
  verifyOtp
);

router.post("/address",customerMiddleware, addAddress);

export default router;