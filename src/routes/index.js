import express from "express";
import {
  index,
  addUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/homeController.js";

const router = express.Router();

// Home route
router.get("/", index);
// Add user route
router.post("/add-user", addUser);
// Get user for update
router.get("/user/:id", getUser);
// Update user route
router.post("/update-user", updateUser);
// Delete user route
router.post("/delete-user", deleteUser);
export default router;
