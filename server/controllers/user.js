// // import validation from "../middleware/validation.js";
// import bcrypt from "bcrypt";
// import usersModel from "../modules/user.js";
// import { generateToken } from "../middleware/outh.js";

// const user = {
//     getById: async (req, res) => {
//         try {
//             const user = await usersModel.getById(req.params.user_Id);
//             if (!user) return res.status(404).json({ message: 'User not found' });
//             res.json(user);
//         } catch (err) {
//             console.error('Error getting user by ID:', err);
//             res.status(500).json({ error: 'Failed to fetch user' });
//         }
//     },
//     register: async (req, res) => {
//         const { name, email, phone, password } = req.body;
//         const isManager = 0;
//         if (!name || !email || !password || !phone) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // if (!validation.isValidEmail(email)) {
//         //     return res.status(400).json({ error: "Invalid email address" });
//         // }

//         // if (!validation.isValidPassword(password)) {
//         //     return res.status(400).json({ error: "Password must be at least 6 characters long" });
//         // }

//         try {
//             const result = await usersModel.register({ name, email, phone, password, isManager });
//             const userId = result.userId;
//             const user = { name, email, isManager, userId };
//             let token = generateToken(user);
//             user.token = token;
//             console.log("user", user);
//             res.status(201).json({ message: "User added successfully", user });
//         } catch (err) {
//             console.error("Error adding the user to the database:", err);
//             res.status(500).json({ error: "Error adding the user" });
//         }
//     },


//     login: async (req, res) => {
//         console.log("Login request received");
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         if (password.length < 6) {
//             return res.status(400).json({ error: "Password must be at least 6 characters long" });
//         }

//         try {
//             const dbUser = await usersModel.getUserByUsername(email);
//             console.log("dbUser", dbUser);
//             if (!dbUser || !dbUser.password) {
//                 return res.status(401).json({ error: "Invalid username or password" });
//             }

//             const isMatch = await bcrypt.compare(password, dbUser.password);
//             console.log("password", password, dbUser.password, isMatch);
//             if (!isMatch) {
//                 return res.status(401).json({ error: "Invalid username or password" });
//             }

//             const userWithoutPassword = { ...dbUser };
//             delete userWithoutPassword.password;
//             delete userWithoutPassword.Phone;
//             let token = generateToken(userWithoutPassword);
//             userWithoutPassword.token = token;
//             //  delete userWithoutPassword.Id;
//             //  delete userWithoutPassword.Is_Manager;
//             // res.json({ message: "Login successful", user: userWithoutPassword });
//             res.json({ message: "Login successful", userWithoutPassword });
//         } catch (err) {
//             console.error("Login error:", err);
//             res.status(500).json({ error: "Database error" });
//         }
//     },
//     update: async (req, res) => {
//         const user_Id = req.params.user_Id;
//         const { Full_Name, Email, Is_Manager } = req.body;
//         const phone = "0548440911";
//         // if ( !Full_Name&&!Email&&Is_Manager===null) {
//         //   return res.status(400).json({ error: "At least one field must be provided for update" });
//         // }
//         // if (!validation.isValidEmail(Email)) {
//         //     return res.status(400).json({ error: "Invalid email address" });
//         // }
//         try {
//             const result = await usersModel.update(user_Id, { Full_Name, Email, phone, Is_Manager });
//             console.log("result controller", result)
//             if (result === true) { res.json({ message: "User updated successfully" }); }
//             else {
//                 return res.status(404).json({ message: 'User was not update' });
//             }
//         } catch (err) {
//             res.status(500).json({ error: "Database error" });
//         }
//     },
//     // update: async (User_Id, data) => {
//     //     const fields = [];
//     //     const values = [];
//     //     console.log("Updating user:", User_Id, data);
//     //     // עדכון לפי השדות הקיימים בטבלה שלך

//     //     if (data.Full_Name != null) {
//     //         fields.push("Full_Name = ?");
//     //         values.push(data.Full_Name);
//     //     }
//     //     if (data.Email != null) {
//     //         fields.push("Email = ?");
//     //         values.push(data.Email);
//     //     }
//     //      if (data.Is_Manager != null) {
//     //         fields.push("Is_Manager = ?");
//     //         values.push(data.Is_Manager);
//     //     }

//     //     // אם אין שדות לעדכן, החזר 0
//     //     if (fields.length === 0) return { affectedRows: 0 };

//     //     const query = `UPDATE users SET ${fields.join(", ")} WHERE Id = ?`;
//     //     values.push(User_Id);

//     //     const [result] = await promisePool.query(query, values);
//     //     return result;
//     // },
//     delete: async (req, res) => {
//         try {
//             const userId = req.body.userId;
//             if (!userId) {
//                 return res.status(400).json({ error: "User ID is required" });
//             }
//             const result = await usersModel.delete(userId);
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({ message: "User not found" });
//             }
//             res.json({ message: "User deleted successfully" });
//         } catch (err) {
//             console.error("Error deleting user:", err);
//             res.status(500).json({ error: "Failed to delete user" });
//         }
//     }
// };

// export default user;
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

  // update: async (req, res) => {
  //   const { error } = updateSchema.validate(req.body);
  //   if (error) {
  //     return res.status(400).json({ error: error.details[0].message });
  //   }

  //   const user_Id = req.params.user_Id;
  //   const { Full_Name, Email, Is_Manager } = req.body;
  //   const phone = "0548440911"; // אם זה קבוע, כדאי לעדכן שגם הסכמה תכיל אותו או להסיר בכלל

  //   try {
  //     const result = await usersModel.update(user_Id, { Full_Name, Email, phone, Is_Manager });
  //     if (result === true) {
  //       res.json({ message: "User updated successfully" });
  //     } else {
  //       res.status(404).json({ message: 'User was not updated' });
  //     }
  //   } catch (err) {
  //     console.error("Update error:", err);
  //     res.status(500).json({ error: "Database error" });
  //   }
  // },
  update: async (req, res) => {
    const user_Id = req.params.user_Id;
    const { Full_Name, Email, Is_Manager } = req.body;
    const phone = "0548440911";
    // if ( !Full_Name&&!Email&&Is_Manager===null) {
    //   return res.status(400).json({ error: "At least one field must be provided for update" });
    // }
    // if (!validation.isValidEmail(Email)) {
    //     return res.status(400).json({ error: "Invalid email address" });
    // }
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
