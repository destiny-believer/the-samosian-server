import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Customer from "../../models/Customer.js";


// Create Product

export const createProduct = async (
    req,
    res
) => {

    try {

        const {
            name,
            category,
            description,
            image,
            variants,
            isVeg,
            preparationTime,
            isFeatured
        } = req.body;

        const categoryExists =
            await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const existingProduct =
            await Product.findOne({
                name
            });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product already exists"
            });
        }

        const product =
            await Product.create({
                name,
                category,
                description,
                image,
                variants,
                isVeg,
                preparationTime,
                isFeatured
            });

        res.status(201).json({
            success: true,
            message:
                "Product created successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get All Products

export const getProducts = async (
    req,
    res
) => {

    try {

        const products =
            await Product.find()
                .populate(
                    "category",
                    "name"
                );

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


export const getProductById =
    async (req, res) => {

        try {

            const product = await Product.findById(req.params.id)
                .populate("category", "name")

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                product
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const updateProduct =
    async (req, res) => {

        try {

            const product =
                await Product.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true,
                        runValidators: true
                    }
                );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Product updated successfully",
                product
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const deleteProduct =
    async (req, res) => {

        try {

            const product =
                await Product.findByIdAndDelete(
                    req.params.id
                );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                message:
                    "Product deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const toggleAvailability =
    async (req, res) => {

        try {

            const product =
                await Product.findById(
                    req.params.id
                );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            product.isAvailable =
                !product.isAvailable;

            await product.save();

            res.status(200).json({
                success: true,
                product
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const addReview =
    async (req, res) => {

        try {

            const customerId =
                req.customer.customerId;

            const {
                rating,
                comment
            } = req.body;

            const product =
                await Product.findById(
                    req.params.productId
                );

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });

            }

            const customer =
                await Customer.findById(
                    customerId
                );

            const alreadyReviewed =
                product.reviews.find(

                    review =>

                        review.customer.toString()
                        ===
                        customerId

                );

            if (alreadyReviewed) {

                alreadyReviewed.rating = rating;

                alreadyReviewed.comment = comment;

                alreadyReviewed.updatedAt = new Date();

            }

            else {

                product.reviews.push({

                    customer: customerId,

                    customerName: customer.name,

                    rating,

                    comment

                });

            }

            product.reviews.push({

                customer: customerId,

                customerName: customer.name,

                rating,

                comment

            });

            const totalRating = product.reviews.reduce(

                (sum, review) =>

                    sum + review.rating,

                0

            );
            product.totalRatings = product.reviews.length;

            product.rating = totalRating / product.totalRatings;

            await product.save();

            res.status(201).json({

                success: true,

                message:
                    "Review submitted"

            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    };

export const getMyReview = async (req, res) => {

    try {

        const customerId = req.customer.customerId;
        const { productId } = req.params;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const review = product.reviews.find(
            review =>
                review.customer &&
                review.customer.toString() === customerId
        );

        if (!review) {
            return res.status(200).json({
                success: true,
                reviewed: false,
                review: null
            });
        }

        return res.status(200).json({
            success: true,
            reviewed: true,
            review
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};