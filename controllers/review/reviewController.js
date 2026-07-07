import Product from "../../models/Product.js";
import Customer from "../../models/Customer.js";
import Order from "../../models/Order.js";



// ======================================
// Recalculate Product Rating
// ======================================

const recalculateProductRating = (product) => {

    const totalReviews = product.reviews.length;

    product.totalReviews = totalReviews;

    if (totalReviews === 0) {

        product.rating = 0;

        return;

    }

    const totalRating = product.reviews.reduce(

        (sum, review) =>

            sum + review.rating,

        0

    );

    product.rating = Number(

        (

            totalRating /

            totalReviews

        ).toFixed(1)

    );

};



// ======================================
// Check Delivered Order
// ======================================

const hasDeliveredOrder = async (

    customerId,

    productId

) => {

    const deliveredOrders = await Order.find({

        customer: customerId,

        orderStatus: "Delivered"

    });

    for (const order of deliveredOrders) {

        const orderedProduct = order.items.find(

            item =>

                item.product.toString() ===

                productId

        );

        if (orderedProduct) {

            return true;

        }

    }

    return false;

};

// ======================================
// Add Review
// ======================================

export const addReview = async (req, res) => {

    try {

        const customerId = req.customer.id;

        const { productId } = req.params;

        const {

            rating,

            comment,

            variantName

        } = req.body;

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }

        const customer = await Customer.findById(customerId);

        if (!customer) {

            return res.status(404).json({

                success: false,

                message: "Customer not found"

            });

        }

        const delivered = await hasDeliveredOrder(

            customerId,

            productId

        );

        if (!delivered) {

            return res.status(400).json({

                success: false,

                message: "Only delivered orders can be reviewed."

            });

        }

        const alreadyReviewed = product.reviews.find(

            review =>

                review.customer.toString() ===

                customerId

        );

        if (alreadyReviewed) {

            return res.status(400).json({

                success: false,

                message: "You have already reviewed this product."

            });

        }

        product.reviews.push({

            customer: customerId,

            customerName: customer.name,

            variantName,

            rating,

            comment

        });

        recalculateProductRating(product);

        await product.save();

        res.status(201).json({

            success: true,

            message: "Review submitted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Edit Review
// ======================================

export const editReview = async (req, res) => {

    try {

        const customerId = req.customer.id;

        const {

            productId,

            reviewId

        } = req.params;

        const {

            rating,

            comment

        } = req.body;

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }

        const review = product.reviews.id(reviewId);

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review not found"

            });

        }

        if (

            review.customer.toString() !== customerId

        ) {

            return res.status(403).json({

                success: false,

                message: "You are not allowed to edit this review."

            });

        }

        review.rating = rating;

        review.comment = comment;

        review.updatedAt = new Date();

        recalculateProductRating(product);

        await product.save();

        res.status(200).json({

            success: true,

            message: "Review updated successfully.",

            review

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================
// Delete Review
// ======================================

export const deleteReview = async (req, res) => {

    try {

        const customerId = req.customer.id;

        const {

            productId,

            reviewId

        } = req.params;

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }

        const review = product.reviews.id(reviewId);

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review not found"

            });

        }

        if (review.customer.toString() !== customerId) {

            return res.status(403).json({

                success: false,

                message: "You are not allowed to delete this review."

            });

        }

        product.reviews.pull(reviewId);

        recalculateProductRating(product);

        await product.save();

        res.status(200).json({

            success: true,

            message: "Review deleted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================================
// Get My Review
// ======================================

export const getMyReview = async (req, res) => {

    try {

        const customerId = req.customer.id;

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

        res.status(200).json({

            success: true,

            reviewed: !!review,

            review: review || null

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ======================================
// Get Product Reviews
// ======================================

export const getProductReviews = async (req, res) => {

    try {

        const { productId } = req.params;

        const product = await Product.findById(productId)

            .populate(

                "reviews.customer",

                "name profileImage"

            );

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"

            });

        }

        const reviews = [...product.reviews].sort(

            (a, b) =>

                new Date(b.createdAt) -

                new Date(a.createdAt)

        );

        res.status(200).json({

            success: true,

            rating: product.rating,

            totalReviews: product.totalReviews,

            reviews

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};