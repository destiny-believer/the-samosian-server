import { getIO } from "./socketInstance.js";

export const emitOrderStatusUpdate = (
  order
) => {

  const io = getIO();

  const room =
    `order_${order._id}`;

    
    io.to(room).emit(
      "order-status-updated",
      {
        orderId:
        order._id,

      status:
        order.orderStatus,

      statusHistory:
        order.statusHistory
      }
    );
    
  };
  
  // console.log(
  //   "EMITTING STATUS UPDATE:",
  //   room,
  //   order.orderStatus
  // );