const express = require("express");
const connectToDb = require("./config/connect.js");
const xss = require("xss-clean");
const rateLimiting = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const { errorHandler, notFound } = require("./middlewares/error");
const cors = require("cors");
require("dotenv").config();

// for the error of nodemailer
NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Connection To Db
connectToDb();

// Init App
const app = express();

// Middlewares
app.use(express.json());

// Security Headers (helmet)
app.use(helmet());

// Prevent Http Param Pollution


app.use(hpp());


app.use(xss());

// Rate Limiting
app.use(rateLimiting({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max:200,
}));

// Cors Policy
app.use(cors({
  origin: "http://localhost:3000"
}));

// Routes
app.use("/api/auth", require("./route/authRoute"));
app.use("/api/users", require("./route/usersRoute"));
app.use("/api/posts", require("./route/PostRoute"));
app.use("/api/comments", require("./route/CommentsRoute"));
app.use("/api/categories", require("./route/categoryRoute"));
app.use("/api/password",require("./route/passwordRoute"));

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);