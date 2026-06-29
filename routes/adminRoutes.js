import express from "express";

import {
    adminLogin,
    getDashboardStats
} from "../controllers/admin/adminController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
    "/login",
    adminLogin
);

router.get(
  "/dashboard",
  adminMiddleware,
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        "Welcome Admin Dashboard",
      admin: req.admin
    });

  }
);

router.get(
  "/dashboard",
  adminMiddleware,
  getDashboardStats
);

router.get(
  "/dashboard-stats",
  adminMiddleware,
  getDashboardStats
)



export default router;