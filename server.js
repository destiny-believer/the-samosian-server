import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import socketHandler
  from "./socket/socketHandler.js";

import {
  setIO
}
  from "./socket/socketInstance.js";

dotenv.config();

connectDB();


const PORT =
  process.env.PORT || 5000;

const server =
  http.createServer(app);

const io =
  new Server(server, {

    cors: {
      origin: "*",
      methods: [
        "GET",
        "POST"
      ]
    }

  });

setIO(io);
socketHandler(io);

server.listen(
  PORT,
  () => {
    console.log(
      `Server running on ${PORT}`
    );
  }
);

export { io };


