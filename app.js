import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js"
import testEmailRoutes from "./routes/testEmailRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js"

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/agents", agentRoutes)
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes );

app.get("/", (req, res) => {
  res.send("The Samosian API Running");
});

app.use(
  "/api/agents",
  agentRoutes
);

app.use(
    "/api",
    testEmailRoutes
);

export default app;