import Product from "../../models/Product.js";
import Category from "../../models/Category.js";


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
            await Product.findOne()
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

            const product =
                await Product.findById(
                    req.params.id
                ).populate(
                    "category",
                    "name"
                );

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