import express from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    toggleAvailability
}
    from "../controllers/product/productController.js";

import adminMiddleware
    from "../middleware/adminMiddleware.js";

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

export default router;