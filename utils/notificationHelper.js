export const getNotificationTitle = (status) => {

    switch (status) {

        case "Pending":
            return "Order Confirmed";

        case "Accepted":
            return "Restaurant Accepted";

        case "Preparing":
            return "Preparing Your Food";

        case "Agent Assigned":
            return "Delivery Partner Assigned";

        case "Picked Up":
            return "Order Picked Up";

        case "On The Way":
            return "On The Way";

        case "Delivered":
            return "Order Delivered";

        case "Cancelled":
            return "Order Cancelled";

        default:
            return "Order Update";

    }

};

export const getNotificationMessage = (status) => {

    switch (status) {

        case "Pending":
            return "We've received your order.";

        case "Accepted":
            return "Restaurant accepted your order.";

        case "Preparing":
            return "Our chefs are preparing your food.";

        case "Agent Assigned":
            return "A delivery partner has been assigned.";

        case "Picked Up":
            return "Your order has been picked up.";

        case "On The Way":
            return "Your order is on the way.";

        case "Delivered":
            return "Enjoy your meal ❤️";

        case "Cancelled":
            return "Your order has been cancelled.";

        default:
            return status;

    }

};