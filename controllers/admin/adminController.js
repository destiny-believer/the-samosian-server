import Admin from "../../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Order from "../../models/Order.js";
import Customer from "../../models/Customer.js";
import Agent from "../../models/Agent.js";
import Product from "../../models/Product.js";


export const adminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required"
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: admin.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
}

export const getDashboardStats =
  async (req, res) => {

    try {

      const totalOrders =
        await Order.countDocuments();

      const totalCustomers =
        await Customer.countDocuments();

      const totalAgents =
        await Agent.countDocuments();

      const totalProducts =
        await Product.countDocuments();

      const pendingOrders =
        await Order.countDocuments({
          orderStatus: "Pending"
        });

      const preparingOrders =
        await Order.countDocuments({
          orderStatus: "Preparing"
        });

      const onTheWayOrders =
        await Order.countDocuments({
          orderStatus: "On The Way"
        });

      const deliveredOrders =
        await Order.countDocuments({
          orderStatus: "Delivered"
        });

      const revenue =
        await Order.aggregate([

          {

            $match: {

              orderStatus: "Delivered"

            }

          },

          {

            $group: {

              _id: null,

              totalRevenue: {

                $sum: "$totalAmount"

              }

            }

          }

        ]);

      const totalRevenue =
        revenue[0]?.totalRevenue || 0;

      const recentOrders =
        await Order.find()
          .populate(
            "customer",
            "name phone"
          )
          .sort({
            createdAt: -1
          })
          .limit(5);

      return res.status(200).json({

        success: true,

        stats: {

          totalOrders,

          totalCustomers,

          totalAgents,

          totalProducts,

          pendingOrders,

          preparingOrders,

          onTheWayOrders,

          deliveredOrders,

          totalRevenue,

          recentOrders

        }

      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
