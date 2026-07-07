import express from "express";

import customerMiddleware from "../middleware/customerMiddleware.js";
import { getNotifications, getUnreadCount, markAllAsRead, markAsRead } from "../controllers/customer/notificationController.js";



const router = express.Router();

router.get(

    "/",

    customerMiddleware,

    getNotifications

);

router.patch(

    "/:id/read",

    customerMiddleware,

    markAsRead

);

router.patch(

    "/read-all",

    customerMiddleware,

    markAllAsRead

);

router.get(
    "/unread-count",
    customerMiddleware,
    getUnreadCount
)

export default router;