import Agent from "../../models/Agent.js";
import agentOtpStore from "../../utils/agentOtpStore.js";
import jwt from "jsonwebtoken";
import Order from "../../models/Order.js";
import {
    getIO
}
    from "../../socket/socketInstance.js";

import { emitOrderStatusUpdate } from "../../socket/orderEvents.js";

export const registerAgent = async (
    req,
    res
) => {

    try {

        const {
            name,
            phone,
            email,
            vehicleNumber,
            vehicleType,
            licenseNumber,
            agentPhoto
        } = req.body;

        const existingAgent =
            await Agent.findOne({
                $or: [
                    { phone },
                    { email }
                ]
            });

        if (existingAgent) {
            return res.status(400).json({
                success: false,
                message:
                    "Agent already exists"
            });
        }

        const agent =
            await Agent.create({

                name,
                phone,
                email,

                vehicleNumber,

                vehicleType,

                licenseNumber,

                agentPhoto,

                approvalStatus:
                    "Pending"

            });

        res.status(201).json({
            success: true,
            message:
                "Registration submitted. Awaiting admin approval",
            agent
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const sendAgentOtp = async (
    req,
    res
) => {

    try {

        const {
            phone
        } = req.body;

        const agent =
            await Agent.findOne({
                phone
            });

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found"
            });
        }

        const otp = "123456";

        agentOtpStore.set(
            phone,
            otp
        );

        res.status(200).json({
            success: true,
            message: "OTP Sent",
            otp
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const verifyAgentOtp =
    async (req, res) => {

        try {

            const {
                phone,
                otp
            } = req.body;

            const storedOtp =
                agentOtpStore.get(phone);

            if (storedOtp !== otp) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP"
                });

            }

            const agent =
                await Agent.findOne({
                    phone
                });

            if (!agent) {
                return res.status(404).json({
                    success: false,
                    message: "Agent not found"
                });
            }

            if (
                agent.approvalStatus !==
                "Approved"
            ) {

                return res.status(403).json({
                    success: false,
                    message:
                        "Your account is awaiting admin approval"
                });

            }

            agent.isVerified = true;

            await agent.save();

            const token =
                jwt.sign(
                    {
                        agentId: agent._id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "30d"
                    }
                );

            agentOtpStore.delete(phone);

            res.status(200).json({
                success: true,
                message:
                    "Login Successful",
                token,
                agent
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const getAllAgents = async (
    req,
    res
) => {

    try {

        const agents =
            await Agent.find({
                approvalStatus: "Approved"
            })
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            success: true,
            count: agents.length,
            agents
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const approveAgent =
    async (req, res) => {

        try {

            const agent =
                await Agent.findById(
                    req.params.id
                );

            if (!agent) {

                return res.status(404).json({
                    success: false,
                    message: "Agent not found"
                });

            }

            agent.approvalStatus =
                "Approved";

            agent.approvedAt =
                new Date();

            agent.rejectionReason =
                "";

            await agent.save();

            res.status(200).json({
                success: true,
                message:
                    "Agent approved successfully",
                agent
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const rejectAgent =
    async (req, res) => {

        try {

            const agent =
                await Agent.findById(
                    req.params.id
                );

            if (!agent) {

                return res.status(404).json({
                    success: false,
                    message: "Agent not found"
                });

            }

            agent.approvalStatus =
                "Rejected";

            agent.rejectionReason =
                req.body.reason ||
                "Verification failed";

            await agent.save();

            res.status(200).json({
                success: true,
                message:
                    "Agent rejected successfully"
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const getPendingAgents =
    async (req, res) => {

        try {

            const agents =
                await Agent.find({
                    approvalStatus:
                        "Pending"
                });

            res.status(200).json({
                success: true,
                agents
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const getAssignedOrders =
    async (req, res) => {

        try {

            const orders =
                await Order.find({
                    agent: req.agent.agentId
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

export const getAssignedOrderById =
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

            if (!order) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });

            }

            if (
                order.agent?.toString() !==
                req.agent.agentId
            ) {

                return res.status(403).json({
                    success: false,
                    message:
                        "Unauthorized"
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


export const pickupOrder = async (
    req,
    res
) => {

    try {

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

        if (
            order.agent?.toString() !==
            req.agent.agentId
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "This order is not assigned to you"
            });
        }

        if (
            order.orderStatus !==
            "Agent Assigned"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Order cannot be picked up"
            });
        }

        order.orderStatus =
            "Picked Up";

        order.statusHistory.push({
            status: "Picked Up"
        });

        await order.save();
        emitOrderStatusUpdate(order);

        res.status(200).json({
            success: true,
            message:
                "Order picked up successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const startDelivery =
    async (req, res) => {

        try {

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

            if (
                order.agent?.toString() !==
                req.agent.agentId
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Unauthorized"
                });
            }

            if (
                order.orderStatus !==
                "Picked Up"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Order must be picked up first"
                });
            }

            order.orderStatus =
                "On The Way";

            order.statusHistory.push({
                status: "On The Way"
            });

            await order.save();
            emitOrderStatusUpdate(order);

            res.status(200).json({
                success: true,
                message:
                    "Delivery started",
                order
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const deliverOrder =
    async (req, res) => {

        try {

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

            if (
                order.agent?.toString() !==
                req.agent.agentId
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Unauthorized"
                });
            }

            if (
                order.orderStatus !==
                "On The Way"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Order is not out for delivery"
                });
            }

            order.orderStatus =
                "Delivered";

            order.statusHistory.push({
                status: "Delivered"
            });

            await order.save();
            emitOrderStatusUpdate(order);

            const agent =
                await Agent.findById(
                    req.agent.agentId
                );

            if (agent) {

                agent.isAvailable = true;

                await agent.save();

            }

            res.status(200).json({
                success: true,
                message:
                    "Order delivered successfully",
                order
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

export const updateLocation = async (req, res) => {

    try {

        const { latitude, longitude } = req.body;

        const agent = await Agent.findById(req.agent.id);

        if (!agent) {

            return res.status(404).json({

                message: "Agent not found"

            });

        }

        agent.currentLatitude = latitude;

        agent.currentLongitude = longitude;

        agent.lastLocationUpdated = new Date();

        agent.isOnline = true;

        await agent.save();

        return res.json({

            success: true,

            message: "Location Updated",

            location: {

                latitude,

                longitude

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

