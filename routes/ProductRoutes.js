import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  addReview,
  getMyReview,
  getTrendingProducts,
  getBestSellerProducts,
  getTopRatedProducts,
  getFeaturedProducts,
  getHomeReviews
}
  from "../controllers/product/productController.js";

import adminMiddleware
  from "../middleware/adminMiddleware.js";
import customerMiddleware from "../middleware/customerMiddleware.js";

const router = express.Router();

router.post(
  "/",
  adminMiddleware,
  createProduct
);

router.get(
  "/",
  getProducts
);

router.get(
  "/product/:id",
  getProductById
);

router.put(
  "/product/:id",
  adminMiddleware,
  updateProduct
);

router.delete(
  "/product/:id",
  adminMiddleware,
  deleteProduct
);

router.patch(
  "/toggle/:id",
  adminMiddleware,
  toggleAvailability
);

router.post(
  "/review/:productId",
  customerMiddleware,
  addReview
);

router.get(

  "/review/:productId",

  customerMiddleware,

  getMyReview

);

router.get(
    "/featured",
    getFeaturedProducts
);

router.get(
    "/trending",
    getTrendingProducts
);

router.get(
    "/top-rated",
    getTopRatedProducts
);

router.get(
    "/best-sellers",
    getBestSellerProducts
);

router.get(
    "/home-reviews",
    getHomeReviews  
);

export default router;