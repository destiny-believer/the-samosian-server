import express from "express";

import {

    getNotifications

}

from "../controllers/customer/notificationController.js";

import customerMiddleware from "../middleware/customerMiddleware.js";

const router = express.Router();

router.get(

    "/",

    customerMiddleware,

    getNotifications

);

export default router;