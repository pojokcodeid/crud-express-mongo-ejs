import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import { flash, setFlash } from "./middleware/flash.js";
import indexRouter from "./routes/index.js";
import logger from "./utils/logger.js";
import connectDB from "./utils/db.js";
import { set } from "mongoose";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Flash messages middleware
app.use(flash);

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = setFlash(req, "success_msg");
  res.locals.error_msg = setFlash(req, "error_msg");
  next();
});

// Routes
app.use("/", indexRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
