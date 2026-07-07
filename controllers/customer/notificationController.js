import Notification from "../../models/Notification.js";



// ==========================================
// Get Customer Notifications
// ==========================================

export const getNotifications = async (req, res) => {

    try {

        const customerId = req.customer.id;

        const notifications = await Notification

            .find({

                customer: customerId

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



// ==========================================
// Mark Single Notification As Read
// ==========================================

export const markAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        const notification = await Notification.findOne({

            _id: id,

            customer: req.customer.id

        });

        if (!notification) {

            return res.status(404).json({

                success: false,

                message: "Notification not found"

            });

        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({

            success: true,

            notification

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ==========================================
// Mark All Notifications As Read
// ==========================================

export const markAllAsRead = async (req, res) => {

    try {

        const customerId = req.customer.id;

        await Notification.updateMany(

            {

                customer: customerId,

                isRead: false

            },

            {

                $set: {

                    isRead: true

                }

            }

        );

        res.status(200).json({

            success: true,

            message: "All notifications marked as read"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ==========================================
// Get Unread Count
// ==========================================

export const getUnreadCount = async (req, res) => {

    try {

        const customerId = req.customer.id;

        const unreadCount = await Notification.countDocuments({

            customer: customerId,

            isRead: false

        });

        res.status(200).json({

            success: true,

            unreadCount

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};