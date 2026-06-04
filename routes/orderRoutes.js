import express from "express";

import {
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    adminGetOrderById,
    updateOrderStatus,
    assignAgent
}
    from "../controllers/order/orderController.js";

import customerMiddleware
    from "../middleware/customerMiddleware.js";

import adminMiddleware
    from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
    "/place-order",
    customerMiddleware,
    placeOrder
);

router.get(
  "/my-orders",
  customerMiddleware,
  getMyOrders
);

router.get(
  "/:id",
  customerMiddleware,
  getOrderById
);

router.patch(
  "/cancel/:id",
  customerMiddleware,
  cancelOrder
);

router.get(
  "/admin/all",
  adminMiddleware,
  getAllOrders
);

router.get(
  "/admin/:id",
  adminMiddleware,
  adminGetOrderById
);

router.patch(
  "/admin/status/:id",
  adminMiddleware,
  updateOrderStatus
);

router.patch(
  "/admin/assign/:id",
  adminMiddleware,
  assignAgent
);

export default router;