import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Customer from "../../models/Customer.js";
import Agent from "../../models/Agent.js";
import { validTransitions } from "../../utils/orderStatusFlow.js";

import { emitOrderStatusUpdate } from "../../socket/orderEvents.js";

export const placeOrder = async (
  req,
  res
) => {

  try {

    const customerId =
      req.customer.customerId;

    const {
      addressIndex
    } = req.body;

    const customer =
      await Customer.findById(
        customerId
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    const address =
      customer.addresses[
      addressIndex
      ];

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address not found"
      });
    }

    const cart =
      await Cart.findOne({
        customer: customerId
      }).populate(
        "items.product"
      );

    if (
      !cart ||
      cart.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    if (
      cart.totalAmount < 350
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum order value is ₹350"
      });
    }

    const orderItems =
      cart.items.map(item => ({
        product:
          item.product._id,

        productName:
          item.product.name,

        variantName:
          item.variantName,

        variantPrice:
          item.variantPrice,

        quantity:
          item.quantity,

        subtotal:
          item.variantPrice *
          item.quantity
      }));

    const maxPrepTime =
      Math.max(
        ...cart.items.map(
          item =>
            item.product
              .preparationTime
        )
      );

    const estimatedTime =
      maxPrepTime + 10;

    const order =
      await Order.create({

        customer: customerId,

        address,

        items: orderItems,

        totalAmount: cart.totalAmount,

        estimatedDeliveryTime: estimatedTime,

        statusHistory: [
          {
            status: "Pending"
          }
        ]

      });

    cart.items = [];

    cart.totalAmount = 0;

    await cart.save();

    res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getMyOrders = async (
  req,
  res
) => {

  try {

    const customerId =
      req.customer.customerId;

    const orders =
      await Order.find({
        customer: customerId
      })
        .sort({
          createdAt: -1
        });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getOrderById = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      )

        .populate(
          "customer",
          "name phone"
        )
        .populate(
          "agent",
          "name phone vehicleNumber"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (
      order.customer._id.toString() !==
      req.customer.customerId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const cancelOrder = async (
  req,
  res
) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (
      order.customer.toString() !==
      req.customer.customerId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const allowedStatuses = [
      "Pending",
      "Accepted"
    ];

    if (
      !allowedStatuses.includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled now"
      });
    }

    order.orderStatus =
      "Cancelled";

    await order.save();

    order.statusHistory.push({
      status: "Cancelled"
    });


    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getAllOrders = async (
  req,
  res
) => {

  try {

    const orders =
      await Order.find()
        .populate(
          "customer",
          "name phone"
        )
        .populate(
          "agent",
          "name phone"
        )
        .sort({
          createdAt: -1
        });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const adminGetOrderById =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        )
          .populate(
            "customer",
            "name phone"
          )
          .populate(
            "agent",
            "name phone vehicleNumber"
          );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      res.status(200).json({
        success: true,
        order
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };

export const updateOrderStatus =
  async (req, res) => {

    try {

      const {
        orderStatus
      } = req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      const allowedStatuses =
        validTransitions[
        order.orderStatus
        ];

      if (
        !allowedStatuses.includes(
          orderStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid transition from ${order.orderStatus} to ${orderStatus}`
        });
      }

      order.orderStatus =
        orderStatus;

      order.statusHistory.push({
        status: orderStatus
      });

      await order.save();
      emitOrderStatusUpdate(order);

      res.status(200).json({
        success: true,
        message:
          "Order status updated",
        order
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };

export const assignAgent = async (
  req,
  res
) => {

  try {

    const {
      agentId
    } = req.body;

    const order =
      await Order.findById(
        req.params.id
      )
        .populate(
          "agent",
          "name phone vehicleNumber"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const agent =
      await Agent.findById(
        agentId
      );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    if (!agent.isAvailable) {
      return res.status(400).json({
        success: false,
        message:
          "Agent not available"
      });
    }

    order.agent = agentId;

    order.orderStatus =
      "Agent Assigned";

    order.statusHistory.push({
      status: "Agent Assigned"
    });

    agent.isAvailable =
      false;

    await order.save();

    await agent.save();

    res.status(200).json({
      success: true,
      message:
        "Agent assigned successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getLiveLocation =
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        ).populate(
          "agent",
          "name phone vehicleNumber"
        );

      if (!order) {

        return res.status(404).json({
          success: false
        });

      }

      if (!order.agent) {

        return res.status(200).json({
          success: true,
          location: null
        });

      }

      res.status(200).json({

        success: true,

        latitude:
          order.agent.currentLatitude,

        longitude:
          order.agent.currentLongitude,

        agent: {
          id: order.agent._id,
          name: order.agent.name,
          phone: order.agent.phone
        },

        status:
          order.orderStatus

      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };

  export const reorderOrder =
async (req,res) => {

  try {

    const customerId =
      req.customer.customerId;

    const order =
      await Order.findById(
        req.params.orderId
      );

    if(!order){

      return res.status(404).json({
        success:false,
        message:"Order not found"
      });

    }

    let cart =
      await Cart.findOne({
        customer: customerId
      });

    if(!cart){

      cart =
        await Cart.create({
          customer: customerId,
          items: [],
          totalAmount: 0
        });

    }

    for(
      const item of order.items
    ){

      const existingItem =
        cart.items.find(
          cartItem =>

            cartItem.product.toString()
            ===
            item.product.toString()

            &&

            cartItem.variantName
            ===
            item.variantName
        );

      if(existingItem){

        existingItem.quantity +=
          item.quantity;

      } else {

        cart.items.push({

          product:
            item.product,

          variantName:
            item.variantName,

          variantPrice:
            item.variantPrice,

          quantity:
            item.quantity

        });

      }

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
      "Items added to cart"

    });

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};