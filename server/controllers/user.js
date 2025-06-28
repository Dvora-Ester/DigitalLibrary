// import validation from "../middleware/validation.js";
import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import { generateToken } from "../middleware/outh.js";

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
        const { name, email, phone, password,isManager } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        
        if (!validation.isValidEmail(email)) {
            return res.status(400).json({ error: "Invalid email address" });
        }

        if (!validation.isValidPassword(password)) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        try {
            const result = await usersModel.register({ name, email, phone, password,isManager });
            console.log("User added successfully:", result);
            res.status(201).json({ message: "User added successfully", userId: result.userId });
        } catch (err) {
            console.error("Error adding the user to the database:", err);
            res.status(500).json({ error: "Error adding the user" });
        }
    },

    login: async (req, res) => {
        console.log("Login request received");
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        try {
            const dbUser = await usersModel.getUserByUsername(email);
            console.log("dbUser",dbUser);
            if (!dbUser || !dbUser.password) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            const isMatch = await bcrypt.compare(password, dbUser.password);
            console.log("password", password, dbUser.password ,isMatch);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            const userWithoutPassword = { ...dbUser };
            delete userWithoutPassword.password;
            delete userWithoutPassword.Phone;
            let token = generateToken(userWithoutPassword);
            userWithoutPassword.token = token;
            //  delete userWithoutPassword.Id;
            //  delete userWithoutPassword.Is_Manager;
           // res.json({ message: "Login successful", user: userWithoutPassword });
            res.json({ message: "Login successful", userWithoutPassword });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ error: "Database error" });
        }
    },
    update: async (req, res) => {
    const { user_Id } = req.params.user_Id;
    const { token,Full_Name,Email,Is_Manager } = req.body;
    const phone="0548440911";
    if (!token || !Full_Name || !Email) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }
    if (!validation.isValidEmail(Email)) {
        return res.status(400).json({ error: "Invalid email address" });
    }
    try {
      const result = await usersModel.update(user_Id, { Full_Name, Email,phone, Is_Manager });
      if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },
    delete: async (req, res) => {
        try {
            const userId = req.body.userId;
            if (!userId) {
                return res.status(400).json({ error: "User ID is required" });
            }
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