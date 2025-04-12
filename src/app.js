// src/app.js
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
require("./configs/passport"); // Passport configuration
const express = require("express");
const cors = require("cors");
const path = require("path");
const mainRouter = require("./routes/routes");
const logger = require("./middleware/logger");
const { connectToDB } = require("./configs/connection");

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));
app.use(express.json());
app.use(logger);

// Database Connection
connectToDB();

// Serve the index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Use API routes
app.use(mainRouter);

module.exports = app;
