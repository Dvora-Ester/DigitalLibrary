import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import { generateToken } from "../middleware/outh.js";
import {
  registerSchema,
  loginSchema,
  updateSchema,
  deleteSchema,
} from "../middleware/validation.js";

const user = {
  getById: async (req, res) => {
    try {
      const user = await usersModel.getById(req.params.user_Id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error('Error getting user by ID:', err);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  register: async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, phone, password } = req.body;
    const isManager = 0;

    try {
      const result = await usersModel.register({ name, email, phone, password, isManager });
      const userId = result.userId;
      const user = { name, email, isManager, userId };
      let token = generateToken(user);
      user.token = token;
      res.status(201).json({ message: "User added successfully", user });
    } catch (err) {
      console.error("Error adding the user to the database:", err);
      res.status(500).json({ error: "Error adding the user" });
    }
  },

  login: async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log("error", error)
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
      const dbUser = await usersModel.getUserByUsername(email);
      if (!dbUser || !dbUser.password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const isMatch = await bcrypt.compare(password, dbUser.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const userWithoutPassword = { ...dbUser };
      delete userWithoutPassword.password;
      delete userWithoutPassword.Phone;
      let token = generateToken(userWithoutPassword);
      userWithoutPassword.token = token;
      console.log("sucsses")
      // res.json({ message: "Login successful", user: userWithoutPassword });
      res.json({ message: "Login successful", userWithoutPassword });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Database error" });
    }
  },

  
  update: async (req, res) => {
    const user_Id = req.params.user_Id;
    const { Full_Name, Email, Is_Manager } = req.body;
    const phone = "0548440911";
  
    try {
      const result = await usersModel.update(user_Id, { Full_Name, Email, phone, Is_Manager });
      console.log("result controller", result)
      if (result === true) {
        const newToken = generateToken({
          Id: user_Id,
          Email:Email,
          Is_Manager:Is_Manager
        });

        res.json({
          message: "User updated successfully",
          newToken,
        });
      }

      else {
        return res.status(404).json({ message: 'User was not update' });
      }
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  delete: async (req, res) => {
    const { error } = deleteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.body.userId;

    try {
      const result = await usersModel.delete(userId);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
};

export default user;
