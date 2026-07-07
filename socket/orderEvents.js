import { getIO } from "./socketInstance.js";
import { getNotificationTitle, getNotificationMessage } from "../utils/notificationHelper.js";

export const emitOrderStatusUpdate = (
  order, notification
) => {

  const io = getIO();

  const room =
    `order_${order._id}`;


  io.to(room).emit(
    "order-status-updated",
    {

      orderId: order._id,

      orderStatus: order.orderStatus,

      title: notification.title,

      message: notification.message,

      createdAt: notification.createdAt,

      statusHistory: order.statusHistory

    }
  );

};

// console.log(
//   "EMITTING STATUS UPDATE:",
//   room,
//   order.orderStatus
// );