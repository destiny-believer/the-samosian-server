import { getIO }
from "./socketInstance.js";

export const
emitAgentLocationUpdate =
(
  orderId,
  latitude,
  longitude
) => {

  const io = getIO();

  io.to(
    `order_${orderId}`
  ).emit(
    "agent-location-updated",
    {
      orderId,
      latitude,
      longitude
    }
  );

};