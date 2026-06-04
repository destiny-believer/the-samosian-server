import jwt from "jsonwebtoken";

const agentMiddleware =
    (req, res, next) => {

        try {

            const authHeader =
                req.headers.authorization;

            if (
                !authHeader ||
                !authHeader.startsWith(
                    "Bearer "
                )
            ) {
                return res.status(401).json({
                    success: false,
                    message: "Access Denied"
                });
            }

            const token =
                authHeader.split(" ")[1];

            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );
            
                console.log("Decoded Token:", decoded);

            req.agent = decoded;

            next();

        } catch (error) {

            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            });

        }

    };

export default agentMiddleware;