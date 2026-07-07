import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Customer from "../../models/Customer.js";
import Agent from "../../models/Agent.js";
import { validTransitions } from "../../utils/orderStatusFlow.js";
import { emitOrderStatusUpdate } from "../../socket/orderEvents.js";
import PDFDocument from "pdfkit";
import { getNotificationTitle, getNotificationMessage } from "../../utils/notificationHelper.js";

export const placeOrder = async (
  req,
  res
) => {

  try {

    const customerId =
      req.customer.id;

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

    const invoiceNumber = `SAM-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const order =
      await Order.create({

        customer: customerId,

        address: {

          label: address.label,

          receiverName: address.receiverName,

          phoneNumber: address.phoneNumber,

          houseNo: address.houseNo,

          apartment: address.apartment,

          street: address.street,

          landmark: address.landmark,

          area: address.area,

          city: address.city,

          state: address.state,

          pincode: address.pincode,

          formattedAddress: address.formattedAddress,

          latitude: address.location?.latitude,

          longitude: address.location?.longitude,

          deliveryInstructions: address.deliveryInstructions

        },

        items: orderItems,

        totalAmount: cart.totalAmount,

        estimatedDeliveryTime: estimatedTime,

        invoiceNumber,

        statusHistory: [
          {
            status: "Pending"
          }
        ]

      });

    cart.items = [];

    cart.totalAmount = 0;

    await cart.save();

    await order.save();

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
      req.customer.id;

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
          "name phone vehicleNumber currentLatitude currentLongitude"
        )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (
      order.customer._id.toString() !==
      req.customer.id
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

export const downloadInvoice = async (req, res) => {

  try {

    const customerId =
      req.customer.id;

    const { orderId } =
      req.params;

    const order =
      await Order.findOne({

        _id: orderId,

        customer: customerId

      }).populate(

        "customer",

        "name phone"

      );

    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found"

      });

    }

    // =========================================
    // PDF INITIALIZATION
    // =========================================

    const doc = new PDFDocument({

      size: "A4",

      margin: 40

    });

    res.setHeader(

      "Content-Type",

      "application/pdf"

    );

    const invoiceNo =

      order.invoiceNumber ||

      `SAM-${order._id.toString().slice(-8).toUpperCase()}`;

    res.setHeader(

      "Content-Disposition",

      `attachment; filename=${invoiceNo}.pdf`

    );

    doc.pipe(res);



    // =========================================
    // COLORS
    // =========================================

    const ORANGE = "#f97316";

    const DARK = "#111827";

    const LIGHT = "#f3f4f6";

    const BORDER = "#d1d5db";



    // =========================================
    // HEADER
    // =========================================

    doc

      .rect(0, 0, 595, 95)

      .fill(ORANGE);

    doc

      .fillColor("white")

      .font("Helvetica-Bold")

      .fontSize(28)

      .text(

        "THE SAMOSIAN",

        40,

        25,

        {

          align: "center"

        }

      );

    doc

      .fontSize(11)

      .font("Helvetica")

      .text(

        "Food & Beverages Restaurant",

        {

          align: "center"

        }

      );

    doc.text(

      "Fresh • Tasty • Delivered",

      {

        align: "center"

      }

    );



    // =========================================
    // RESTAURANT DETAILS
    // =========================================

    doc.fillColor(DARK);

    doc.fontSize(10);

    doc.text(

      "Durga Nagar, Mailardevpally, Hyderabad",

      40,

      115

    );

    doc.text(

      "Phone : +91 94903 43702"

    );

    doc.text(

      "Email : support@thesamosian.com"

    );



    // =========================================
    // INVOICE INFORMATION
    // =========================================

    const infoTop = 115;

    doc

      .roundedRect(

        320,

        infoTop,

        235,

        95,

        8

      )

      .fillAndStroke(

        LIGHT,

        BORDER

      );

    doc

      .fillColor(DARK)

      .font("Helvetica-Bold")

      .fontSize(11)

      .text(

        "INVOICE",

        335,

        infoTop + 10

      );

    doc

      .font("Helvetica")

      .fontSize(10);

    doc.text(

      `Invoice No : ${invoiceNo}`,

      335,

      infoTop + 30

    );

    doc.text(

      `Order ID : ${order._id}`,

      335,

      infoTop + 46

    );

    doc.text(

      `Date : ${new Date(order.createdAt).toLocaleString()}`,

      335,

      infoTop + 62

    );

    doc.text(

      `Payment : ${order.paymentMethod}`,

      335,

      infoTop + 78

    );



    // =========================================
    // CUSTOMER
    // =========================================

    const customerTop = 235;

    doc

      .roundedRect(

        40,

        customerTop,

        250,

        90,

        8

      )

      .fillAndStroke(

        LIGHT,

        BORDER

      );

    doc

      .fillColor(ORANGE)

      .font("Helvetica-Bold")

      .fontSize(12)

      .text(

        "CUSTOMER",

        55,

        customerTop + 10

      );

    doc

      .fillColor(DARK)

      .font("Helvetica")

      .fontSize(10);

    doc.text(

      `Name : ${order.customer.name || "-"}`,

      55,

      customerTop + 35

    );

    doc.text(

      `Phone : ${order.customer.phone || "-"}`,

      55,

      customerTop + 55

    );



    // =========================================
    // DELIVERY ADDRESS
    // =========================================

    const addressTop = 235;

    doc

      .roundedRect(

        305,

        addressTop,

        250,

        90,

        8

      )

      .fillAndStroke(

        LIGHT,

        BORDER

      );

    doc

      .fillColor(ORANGE)

      .font("Helvetica-Bold")

      .fontSize(12)

      .text(

        "DELIVERY ADDRESS",

        320,

        addressTop + 10

      );

    const fullAddress = [

      order.address.houseNo,

      order.address.street,

      order.address.landmark,

      order.address.city,

      order.address.state,

      order.address.pincode

    ]

      .filter(Boolean)

      .join(", ");

    doc

      .fillColor(DARK)

      .font("Helvetica")

      .fontSize(10)

      .text(

        fullAddress,

        320,

        addressTop + 35,

        {

          width: 210

        }

      );



    // =========================================
    // START POSITION OF BILL TABLE
    // =========================================

    let tableTop = 355;

    // =========================================
    // ORDER BILL TITLE
    // =========================================

    doc

      .fillColor(DARK)

      .font("Helvetica-Bold")

      .fontSize(16)

      .text(

        "ORDER BILL",

        40,

        tableTop

      );

    tableTop += 30;



    // =========================================
    // TABLE HEADER
    // =========================================

    doc

      .fillColor(ORANGE)

      .roundedRect(

        40,

        tableTop,

        515,

        28,

        5

      )

      .fill();

    doc

      .fillColor("white")

      .font("Helvetica-Bold")

      .fontSize(10);

    doc.text("Item", 50, tableTop + 9);

    doc.text("Variant", 255, tableTop + 9);

    doc.text("Qty", 350, tableTop + 9);

    doc.text("Rate", 410, tableTop + 9);

    doc.text("Amount", 485, tableTop + 9);



    tableTop += 35;



    // =========================================
    // ITEMS
    // =========================================

    doc.font("Helvetica").fontSize(10);

    let itemsTotal = 0;

    order.items.forEach((item, index) => {

      if (tableTop > 700) {

        doc.addPage();

        tableTop = 50;

      }

      if (index % 2 === 0) {

        doc

          .fillColor("#fafafa")

          .rect(

            40,

            tableTop - 3,

            515,

            24

          )

          .fill();

      }

      doc.fillColor(DARK);

      doc.text(

        item.productName,

        50,

        tableTop,

        {

          width: 190

        }

      );

      doc.text(

        item.variantName,

        255,

        tableTop,

        {

          width: 70

        }

      );

      doc.text(

        item.quantity.toString(),

        355,

        tableTop

      );

      doc.text(

        `Rs. ${item.variantPrice}`,

        405,

        tableTop

      );

      doc.text(

        `Rs. ${item.subtotal}`,

        480,

        tableTop

      );

      itemsTotal += item.subtotal;

      tableTop += 25;

    });



    // =========================================
    // TABLE FOOTER LINE
    // =========================================

    doc

      .moveTo(

        40,

        tableTop

      )

      .lineTo(

        555,

        tableTop

      )

      .strokeColor(BORDER)

      .stroke();

    tableTop += 20;



    // =========================================
    // PAYMENT SUMMARY
    // =========================================

    doc

      .font("Helvetica-Bold")

      .fontSize(12)

      .fillColor(DARK)

      .text(

        "PAYMENT SUMMARY",

        40,

        tableTop

      );

    tableTop += 25;

    doc

      .font("Helvetica")

      .fontSize(10);

    doc.text(

      "Items Total",

      320,

      tableTop

    );

    doc.text(

      `Rs. ${itemsTotal}`,

      470,

      tableTop

    );

    tableTop += 18;

    doc.text(

      "Delivery Charge",

      320,

      tableTop

    );

    doc

      .fillColor("green")

      .text(

        "FREE",

        470,

        tableTop

      );

    tableTop += 20;

    doc

      .moveTo(

        320,

        tableTop

      )

      .lineTo(

        555,

        tableTop

      )

      .strokeColor(BORDER)

      .stroke();

    tableTop += 15;

    doc

      .fillColor(DARK)

      .font("Helvetica-Bold")

      .fontSize(13);

    doc.text(

      "GRAND TOTAL",

      320,

      tableTop

    );

    doc.text(

      `Rs. ${order.totalAmount}`,

      470,

      tableTop

    );

    tableTop += 35;
    // =========================================
    // PAYMENT & ORDER STATUS
    // =========================================

    const paymentColor =
      order.paymentStatus === "Paid"
        ? "#16a34a"
        : "#dc2626";

    const orderColor =
      order.orderStatus === "Delivered"
        ? "#16a34a"
        : order.orderStatus === "Cancelled"
          ? "#dc2626"
          : "#f97316";

    doc
      .roundedRect(
        40,
        tableTop,
        515,
        65,
        8
      )
      .fillAndStroke(
        "#f9fafb",
        BORDER
      );

    doc
      .fillColor(DARK)
      .font("Helvetica-Bold")
      .fontSize(11);

    doc.text(
      "Payment Method",
      55,
      tableTop + 15
    );

    doc.text(
      order.paymentMethod,
      185,
      tableTop + 15
    );

    doc.text(
      "Payment Status",
      315,
      tableTop + 15
    );

    doc
      .fillColor(paymentColor)
      .text(
        order.paymentStatus,
        445,
        tableTop + 15
      );

    doc
      .fillColor(DARK)
      .text(
        "Order Status",
        55,
        tableTop + 40
      );

    doc
      .fillColor(orderColor)
      .text(
        order.orderStatus,
        185,
        tableTop + 40
      );

    tableTop += 90;



    // =========================================
    // THANK YOU
    // =========================================

    doc
      .moveTo(
        40,
        tableTop
      )
      .lineTo(
        555,
        tableTop
      )
      .strokeColor("#e5e7eb")
      .stroke();

    tableTop += 20;

    doc
      .fillColor(ORANGE)
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(
        "Thank You!",
        {
          align: "center"
        }
      );

    doc
      .moveDown(.3);

    doc
      .fillColor(DARK)
      .font("Helvetica")
      .fontSize(11)
      .text(
        "Fresh • Tasty • Delivered",
        {
          align: "center"
        }
      );

    doc
      .moveDown(.5);

    doc
      .fontSize(10)
      .text(
        "We appreciate your order and look forward to serving you again.",
        {
          align: "center"
        }
      );



    // =========================================
    // TERMS
    // =========================================

    tableTop = doc.y + 25;

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(DARK)
      .text(
        "Terms & Conditions",
        40,
        tableTop
      );

    tableTop += 18;

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#6b7280");

    doc.text(
      "• This is a computer generated invoice.",
      50,
      tableTop
    );

    tableTop += 14;

    doc.text(
      "• Please retain this invoice for future reference.",
      50,
      tableTop
    );

    tableTop += 14;

    doc.text(
      "• Food once delivered cannot be returned.",
      50,
      tableTop
    );

    tableTop += 14;

    doc.text(
      "• For support contact +91 94903 43702.",
      50,
      tableTop
    );



    // =========================================
    // FOOTER
    // =========================================

    const footerY = doc.y + 20;

    doc
      .moveTo(
        40,
        footerY
      )
      .lineTo(
        555,
        footerY
      )
      .strokeColor("#d1d5db")
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#6b7280");

    doc.text(
      "THE SAMOSIAN",
      40,
      footerY + 10
    );

    doc.text(
      "Food & Beverages Restaurant",
      40,
      footerY + 22
    );

    doc.text(
      "Phone : +91 94903 43702",
      220,
      footerY + 10
    );

    doc.text(
      "Email : shastripranaykumar@gmail.com",
      220,
      footerY + 22
    );

    doc.text(
      "www.thesamosian.com",
      430,
      footerY + 16
    );

    doc.end();
  }

  catch (error) {

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
      req.customer.id
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
      const notification = await Notification.create({

        customer: order.customer,

        order: order._id,

        title: getNotificationTitle(orderStatus),

        message: getNotificationMessage(orderStatus),

        status: orderStatus

      });
      emitOrderStatusUpdate(order, notification);

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
          "name phone vehicleNumber currentLatitude currentLongitude"
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
  async (req, res) => {

    try {

      const customerId =
        req.customer.id;

      const order =
        await Order.findById(
          req.params.orderId
        );

      if (!order) {

        return res.status(404).json({
          success: false,
          message: "Order not found"
        });

      }

      let cart =
        await Cart.findOne({
          customer: customerId
        });

      if (!cart) {

        cart =
          await Cart.create({
            customer: customerId,
            items: [],
            totalAmount: 0
          });

      }

      for (
        const item of order.items
      ) {

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

        if (existingItem) {

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

          (total, item) =>

            total +
            (
              item.variantPrice *
              item.quantity
            ),

          0

        );

      await cart.save();

      res.status(200).json({

        success: true,

        message:
          "Items added to cart"

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message

      });

    }

  };