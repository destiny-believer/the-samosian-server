import Order from "../../models/Order.js";
import Customer from "../../models/Customer.js";
import Agent from "../../models/Agent.js";

export const getDashboardStats =
  async (req, res) => {

    try {

      const totalOrders =
        await Order.countDocuments();

      const totalCustomers =
        await Customer.countDocuments();

      const totalAgents =
        await Agent.countDocuments();

      const deliveredOrders =
        await Order.countDocuments({
          orderStatus: "Delivered"
        });

      const pendingOrders =
        await Order.countDocuments({
          orderStatus: "Pending"
        });

      const cancelledOrders =
        await Order.countDocuments({
          orderStatus: "Cancelled"
        });

      const preparingOrders =
        await Order.countDocuments({
          orderStatus: "Preparing"
        });

      const onTheWayOrders =
        await Order.countDocuments({
          orderStatus: "On The Way"
        });

      const revenueResult =
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
        revenueResult[0]?.totalRevenue || 0;

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const todayOrders =
        await Order.countDocuments({

          createdAt: {

            $gte: today

          }

        });

      const todayRevenueResult =
        await Order.aggregate([

          {

            $match: {

              orderStatus: "Delivered",

              createdAt: {

                $gte: today

              }

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

      const todayRevenue =
        todayRevenueResult[0]?.totalRevenue || 0;

      const topProducts =
        await Product.find()

          .sort({

            totalOrders: -1

          })

          .limit(5)

          .select(

            "name totalOrders"

          );


      res.status(200).json({

        success: true,

        stats: {

          totalRevenue,

          todayRevenue,

          totalOrders,

          todayOrders,

          totalCustomers,

          totalAgents,

          pendingOrders,

          preparingOrders,

          onTheWayOrders,

          deliveredOrders,

          cancelledOrders,

          topProducts

        }

      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  };