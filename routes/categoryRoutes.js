import express from "express";

import {
  createCategory,
  getCategories
} from "../controllers/category/categoryController.js";

import adminMiddleware
from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/",
  adminMiddleware,
  createCategory
);

router.get(
  "/",
  getCategories
);

export default router;