export const validTransitions = {

  Pending: [
    "Accepted",
    "Cancelled"
  ],

  Accepted: [
    "Preparing",
    "Cancelled"
  ],

  Preparing: [
    "Agent Assigned"
  ],

  "Agent Assigned": [
    "Picked Up"
  ],

  "Picked Up": [
    "On The Way"
  ],

  "On The Way": [
    "Delivered"
  ],

  Delivered: [],

  Cancelled: []
};