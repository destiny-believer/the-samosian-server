import express from "express";

import {
    adminLogin
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

export default router;