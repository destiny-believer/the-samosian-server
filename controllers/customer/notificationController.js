import Notification from "../../models/Notification.js";

export const getNotifications = async (req, res) => {

    try {

        const notifications =
            await Notification.find({

                customer: req.customer.customerId

            })

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            notifications

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};