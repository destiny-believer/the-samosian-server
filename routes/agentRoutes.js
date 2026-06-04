import express from "express";

import {
    registerAgent,
    sendAgentOtp,
    verifyAgentOtp,
    getAllAgents,
    approveAgent,
    rejectAgent,
    getAssignedOrders,
    pickupOrder,
    startDelivery,
    deliverOrder,
    updateLocation
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
    "/orders",
    agentMiddleware,
    getAssignedOrders
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