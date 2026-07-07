import express from "express";
import customerMiddleware from "../middleware/customerMiddleware.js";

import {
  sendOtp,
  verifyOtp,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  getProfile,
  updateProfile,
  getFavorites,
  toggleFavorite,
  firebaseLogin
}
  from "../controllers/customer/customerController.js";
import { getWishlist, toggleWishlist } from "../controllers/customer/wishlistController.js";

const router = express.Router();

router.post(
  "/send-otp",
  sendOtp
);

router.post(
    "/firebase-login",
    firebaseLogin
);

router.post(
  "/verify-otp",
  verifyOtp
);

router.post("/address", customerMiddleware, addAddress);

router.get(
  "/profile",
  customerMiddleware,
  getProfile
);

router.put(
  "/profile",
  customerMiddleware,
  updateProfile
);

router.get(
  "/address",
  customerMiddleware,
  getAddresses
);

router.put(
  "/address/:id",
  customerMiddleware,
  updateAddress
);

router.delete(
  "/address/:id",
  customerMiddleware,
  deleteAddress
);

router.patch(
  "/favorite/:productId",
  customerMiddleware,
  toggleFavorite
);

router.get(
  "/favorites",
  customerMiddleware,
  getFavorites
);

router.post(
    "/wishlist",
    customerMiddleware,
    toggleWishlist
);

router.get(
    "/wishlist",
    customerMiddleware,
    getWishlist
);

export default router;