import express from "express";

import {
    registerAgent,
    sendAgentOtp,
    verifyAgentOtp,
    getAllAgents,
    approveAgent,
    rejectAgent,
    getAssignedOrders,
    getPendingAgents,
    pickupOrder,
    startDelivery,
    deliverOrder,
    updateLocation,
    getAssignedOrderById
}
    from "../controllers/agent/agentController.js";

import adminMiddleware from "../middleware/adminMiddleware.js";
import agentMiddleware from "../middleware/agentMiddleware.js";

const router = express.Router();

router.post(
    "/register",
    registerAgent
);

router.post(
    "/send-otp",
    sendAgentOtp
);

router.post(
    "/verify-otp",
    verifyAgentOtp
);

router.get(
    "/admin/all",
    adminMiddleware,
    getAllAgents
);

router.patch(
    "/admin/approve/:id",
    adminMiddleware,
    approveAgent
);

router.delete(
    "/admin/reject/:id",
    adminMiddleware,
    rejectAgent
);

router.get(
    "/admin/pending",
    adminMiddleware,
    getPendingAgents
);

router.get(
    "/orders",
    agentMiddleware,
    getAssignedOrders
);

router.get(
    "/orders/:id",
    agentMiddleware,
    getAssignedOrderById
);

router.patch(
  "/pickup/:orderId",
  agentMiddleware,
  pickupOrder
);

router.patch(
  "/on-the-way/:orderId",
  agentMiddleware,
  startDelivery
);

router.patch(
  "/deliver/:orderId",
  agentMiddleware,
  deliverOrder
);

router.patch(
  "/location",
  agentMiddleware,
  updateLocation
);

export default router;