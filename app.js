const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cron = require("node-cron");
const { sendNotifications } = require("./utils/notifications");
require("dotenv").config();
const secret = process.env.JWT_SECRET || "aL9zQpW2xRvYt7uI0oMnB8jKf1gSeCdH";

const { getConnection } = require("./config/db"); // Updated import
const staffRoutes = require("./routes/staff.routes");
const assetRoutes = require("./routes/asset.routes");
const projectRoutes = require("./routes/project.routes");
const authRoutes = require("./routes/auth.routes"); // Import the router
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

cron.schedule("0 8 * * *", async () => {
  console.log("Running scheduled notification job...");
  await sendNotifications();
});

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/staff-insurance", staffRoutes);
app.use("/api/asset-insurance", assetRoutes);
app.use("/api/project-insurance", projectRoutes);
app.use("/api/auth", authRoutes); // Use the imported router
// Default route
app.get("/", (req, res) => {
  res.send("Staff Insurance API is running...");
});
//notification route
app.use("/api/notifications", notificationRoutes);

// Start server and connect to the database
const PORT = process.env.PORT || 5000;

getConnection() // Calling the getConnection function directly
  .then(connection => {
    console.log("✅ Oracle database connected successfully");
    // You might want to store the connection object if you need to reuse it
    app.locals.dbConnection = connection;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server due to DB error:", err);
  });