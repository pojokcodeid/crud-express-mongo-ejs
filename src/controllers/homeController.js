import Joi from "joi";
import logger from "../utils/logger.js";
import User from "../models/user.js";
import { setFlash } from "../middleware/flash.js";
import { set } from "mongoose";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  id: Joi.string(),
});

export const index = async (req, res) => {
  try {
    const users = await User.find();
    logger.info("Rendering home page with users");
    res.render("home", { title: "Home Page", users });
  } catch (error) {
    logger.error("Failed to fetch users", error);
    res.status(500).send("Internal Server Error");
  }
};

export const addUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    logger.error("Failed to add user due to validation error", error);
    setFlash(req, "error_msg", error.details[0].message);
    return res.redirect("/");
  }

  try {
    const { name } = req.body;
    const newUser = new User({ name });
    await newUser.save();
    logger.info(`User added: ${name}`);
    setFlash(req, "success_msg", "User added successfully");
    res.redirect("/");
  } catch (error) {
    logger.error("Failed to add user", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("update", { title: "Update User", user });
  } catch (error) {
    logger.error("Failed to get user", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    logger.error("Failed to update user due to validation error", error);
    setFlash(req, "error_msg", error.details[0].message);
    return res.redirect(`/user/${req.body.id}`);
  }

  try {
    const { id, name } = req.body;
    const user = await User.findByIdAndUpdate(id, { name }, { new: true });
    if (!user) {
      return res.status(404).send("User not found");
    }
    logger.info(`User updated: ${name}`);
    setFlash(req, "success_msg", "User updated successfully");
    res.redirect("/");
  } catch (error) {
    logger.error("Failed to update user", error);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    await User.findByIdAndDelete(id);
    logger.info(`User deleted: ${id}`);
    setFlash(req, "success_msg", "User deleted successfully");
    res.redirect("/");
  } catch (error) {
    logger.error("Failed to delete user", error);
    res.status(500).send("Internal Server Error");
  }
};
