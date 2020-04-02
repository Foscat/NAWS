const router = require("express").Router();
const userRoutes = require("./users");
const boardRoutes = require("./boards");
const emailRoutes = require("./email");

// Index serves as directory for routes

// User routes
router.use("/users", userRoutes);

// Board routes 
router.use("/boards", boardRoutes);

// Email routes
router.use("/email", emailRoutes);

module.exports = router;