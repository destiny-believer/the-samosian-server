import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

export const addToCart = async (
  req,
  res
) => {

  try {

    const customerId =
      req.customer.customerId;

    const {
      productId,
      variantName,
      quantity
    } = req.body;

    const product =
      await Product.findById(
        productId
      );

    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      });
    }

    const variant =
      product.variants.find(
        v => v.name === variantName
      );

    if(!variant){
      return res.status(404).json({
        success:false,
        message:"Variant not found"
      });
    }

    let cart =
      await Cart.findOne({
        customer:customerId
      });

    if(!cart){

      cart =
        await Cart.create({
          customer:customerId,
          items:[]
        });

    }

    const existingItem =
      cart.items.find(
        item =>
          item.product.toString() ===
          productId &&
          item.variantName ===
          variantName
      );

    if(existingItem){

      existingItem.quantity +=
        quantity;

    } else {

      cart.items.push({
        product:productId,
        variantName,
        variantPrice:
        variant.price,
        quantity
      });

    }

    cart.totalAmount =
      cart.items.reduce(
        (total,item)=>
          total +
          (
            item.variantPrice *
            item.quantity
          ),
        0
      );

    await cart.save();

    res.status(200).json({
      success:true,
      message:
      "Item added to cart",
      cart
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

export const getCart = async (
  req,
  res
) => {

  try {

    const customerId =
      req.customer.customerId;

    const cart =
      await Cart.findOne({
        customer: customerId
      }).populate(
        "items.product",
        "name image variants"
      );

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: [],
        totalAmount: 0
      });
    }

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const updateQuantity =
async (req,res) => {

  try {

    const customerId =
      req.customer.customerId;

    const {
      productId,
      variantName,
      quantity
    } = req.body;

    const cart =
      await Cart.findOne({
        customer: customerId
      });

    if(!cart){
      return res.status(404).json({
        success:false,
        message:"Cart not found"
      });
    }

    const item =
      cart.items.find(
        item =>
          item.product.toString() ===
          productId &&
          item.variantName ===
          variantName
      );

    if(!item){
      return res.status(404).json({
        success:false,
        message:"Item not found"
      });
    }

    item.quantity = quantity;

    cart.totalAmount =
      cart.items.reduce(
        (total,item)=>
          total +
          (
            item.variantPrice *
            item.quantity
          ),
        0
      );

    await cart.save();

    res.status(200).json({
      success:true,
      cart
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

export const removeItem =
async (req,res) => {

  try {

    const customerId =
      req.customer.customerId;

    const {
      productId,
      variantName
    } = req.body;

    const cart =
      await Cart.findOne({
        customer:customerId
      });

    if(!cart){
      return res.status(404).json({
        success:false,
        message:"Cart not found"
      });
    }

    cart.items =
      cart.items.filter(
        item =>
          !(
            item.product.toString()
            === productId
            &&
            item.variantName
            === variantName
          )
      );

    cart.totalAmount =
      cart.items.reduce(
        (total,item)=>
          total +
          (
            item.variantPrice *
            item.quantity
          ),
        0
      );

    await cart.save();

    res.status(200).json({
      success:true,
      cart
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};

export const clearCart =
async (req,res) => {

  try {

    const customerId =
      req.customer.customerId;

    const cart =
      await Cart.findOne({
        customer:customerId
      });

    if(!cart){
      return res.status(404).json({
        success:false,
        message:"Cart not found"
      });
    }

    cart.items = [];

    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({
      success:true,
      message:
      "Cart cleared successfully"
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};