const socketHandler = (io) => {

    io.on("connection", (socket) => {

        console.log("✅ Socket Connected:", socket.id);

        // ==========================
        // JOIN ORDER ROOM
        // ==========================

        socket.on("join-order-room", (orderId) => {

            const room = `order_${orderId}`;

            socket.join(room);

            console.log(`${socket.id} joined ${room}`);

            socket.emit("room-joined", {

                success: true,

                room

            });

        });

        // ==========================
        // LEAVE ORDER ROOM
        // ==========================

        socket.on("leave-order-room", (orderId) => {

            socket.leave(`order_${orderId}`);

            console.log(`${socket.id} left order_${orderId}`);

        });

        // ==========================
        // LIVE AGENT LOCATION
        // ==========================

        socket.on("agent-location-update", (data) => {

            io.to(`order_${data.orderId}`).emit(

                "agent-location-updated",

                {

                    latitude: data.latitude,

                    longitude: data.longitude,

                    orderId: data.orderId,

                    updatedAt: Date.now()

                }

            );

        });

        // ==========================
        // ORDER STATUS UPDATE
        // ==========================

        socket.on("order-status-update", (data) => {

            io.to(`order_${data.orderId}`).emit(

                "order-status-updated",

                data

            );

        });

        // ==========================
        // DISCONNECT
        // ==========================

        socket.on("disconnect", () => {

            console.log("❌ Socket Disconnected:", socket.id);

        });

    });

};

export default socketHandler;