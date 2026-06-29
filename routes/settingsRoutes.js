import express from "express";

import adminMiddleware
from "../middleware/adminMiddleware.js";

import {
  getSettings,
  updateSettings
}
from "../controllers/admin/settingsController.js";

const router =
  express.Router();

router.get(
  "/",
  adminMiddleware,
  getSettings
);

router.put(
  "/",
  adminMiddleware,
  updateSettings
);

export default router;