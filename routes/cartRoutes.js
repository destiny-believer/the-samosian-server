import express from "express";

import {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart
}
from "../controllers/cart/cartController.js";

import customerMiddleware
from "../middleware/customerMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  customerMiddleware,
  addToCart
);

router.get(
  "/",
  customerMiddleware,
  getCart
);

router.patch(
  "/quantity",
  customerMiddleware,
  updateQuantity
);

router.delete(
  "/remove",
  customerMiddleware,
  removeItem
);

router.delete(
  "/clear",
  customerMiddleware,
  clearCart
);

export default router;