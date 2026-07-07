import Customer from "../../models/Customer.js";
import Product from "../../models/Product.js";

export const toggleWishlist = async (req, res) => {

    try {

        const customerId = req.customer.id;
        const { productId } = req.body;

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        const exists = customer.favorites.includes(productId);

        if (exists) {

            customer.favorites =
                customer.favorites.filter(
                    id => id.toString() !== productId
                );

            await customer.save();

            return res.json({
                success: true,
                message: "Removed from wishlist",
                isFavorite: false
            });

        }

        customer.favorites.push(productId);

        await customer.save();

        res.json({
            success: true,
            message: "Added to wishlist",
            isFavorite: true
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

export const getWishlist = async (req, res) => {

    try {

        const customer = await Customer.findById(
            req.customer.id
        ).populate("favorites");

        res.json({

            success: true,

            wishlist: customer.favorites

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};