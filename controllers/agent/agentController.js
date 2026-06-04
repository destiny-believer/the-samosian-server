import Agent from "../../models/Agent.js";
import agentOtpStore from "../../utils/agentOtpStore.js";
import jwt from "jsonwebtoken";
import Order from "../../models/Order.js";

export const registerAgent = async (
    req,
    res
) => {

    try {

        const {
            name,
            phone,
            email,
            vehicleNumber
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
                vehicleNumber
            });

        res.status(201).json({
            success: true,
            message:
                "Agent registered successfully",
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

            if (!agent.isApproved) {

                return res.status(403).json({
                    success: false,
                    message:
                        "Waiting for admin approval"
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
            await Agent.find()
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

            agent.isApproved = true;

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
                await Agent.findByIdAndDelete(
                    req.params.id
                );

            if (!agent) {
                return res.status(404).json({
                    success: false,
                    message: "Agent not found"
                });
            }

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

export const getAssignedOrders =
    async (req, res) => {

        try {

            const orders =
                await Order.find({
                    agent:
                        req.agent.agentId
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

export const updateLocation =
    async (req, res) => {

        console.log(req.body);

        try {

            const {
                latitude,
                longitude
            } = req.body || {};

            if (
                latitude === undefined ||
                longitude === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Latitude and Longitude are required"
                });
            }

            const agent =
                await Agent.findById(
                    req.agent.agentId
                );

            if (!agent) {
                return res.status(404).json({
                    success: false,
                    message: "Agent not found"
                });
            }

            agent.currentLatitude =
                latitude;

            agent.currentLongitude =
                longitude;

            await agent.save();

            res.status(200).json({
                success: true,
                message:
                    "Location updated"
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };