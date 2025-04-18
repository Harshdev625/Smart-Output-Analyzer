const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const commandRoutes = require("./routes/command.routes");
const downloadRoutes = require("./routes/download.routes");
const exportRoutes = require("./routes/export.routes");
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Body parser for JSON payloads with a size limit of 5MB
app.use(bodyParser.json({ limit: "5mb" }));

// Register the routes
app.use("/api/command", commandRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/export", exportRoutes);

// Export the app instance for use in server.js
module.exports = app;