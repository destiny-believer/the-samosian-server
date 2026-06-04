import Category from "../../models/Category.js";

export const createCategory = async (
  req,
  res
) => {

  try {

    const { name, image } = req.body;

    const existingCategory =
      await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category =
      await Category.create({
        name,
        image
      });

    res.status(201).json({
      success: true,
      category
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getCategories =
  async (req, res) => {

    try {

      const categories =
        await Category.find();

      res.status(200).json({
        success: true,
        categories
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

};