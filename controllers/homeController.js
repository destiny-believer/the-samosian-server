import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getHomeData = async (req, res) => {

    try {

        // Categories
        const categories = await Category.find();

        // Trending Products
        const trending = await Product.find({
            isAvailable: true
        })
        .sort({ totalOrders: -1 })
        .limit(8);

        // Best Sellers
        const bestSellers = await Product.find({
            bestSeller: true,
            isAvailable: true
        }).limit(6);

        // Featured Products
        const featured = await Product.find({
            featured: true,
            isAvailable: true
        }).limit(6);

        // Reviews
        const reviewProducts = await Product.find({
            "reviews.0": { $exists: true }
        })
        .select("name image reviews");

        let reviews = [];

        reviewProducts.forEach(product => {

            product.reviews.forEach(review => {

                reviews.push({

                    productId: product._id,

                    productName: product.name,

                    productImage: product.image,

                    customerName: review.customerName,

                    rating: review.rating,

                    comment: review.comment,

                    createdAt: review.createdAt

                });

            });

        });

        reviews.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

        reviews = reviews.slice(0, 6);

        res.status(200).json({

            success: true,

            categories,

            trending,

            bestSellers,

            featured,

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