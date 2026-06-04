import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Customer from "../../models/Customer.js";
import Agent from "../../models/Agent.js";
import {
  validTransitions
}
  from "../../utils/orderStatusFlow.js";

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
      cart.totalAmount < 250
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum order value is ₹250"
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
          "phone"
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
            "phone"
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

    order.agent = agent._id;

    order.orderStatus =
      "Agent Assigned";

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

