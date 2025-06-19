// // import bcrypt from "bcrypt";
// // import usersModel from "../modules/user.js";
// // import { generateToken } from "../middleware/outh.js"; // Assuming you have a middleware for token generation
// // const user = {
// //     register: (req, res) => {
// //         const user = req.body;
// //         const { name, email,phone, password } = user;

// //         if (!name || !email || !password||!phone) {
// //             return res.status(400).json({ error: "All fields are required" });
// //         }

// //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //         if (!emailRegex.test(email)) {
// //             return res.status(400).json({ error: "Invalid email address" });
// //         }

// //         if (password.length < 5) {
// //             return res.status(400).json({ error: "Password must be at least 6 characters long" });
// //         }

// //         bcrypt.hash(password, 10, (err, hashedPassword) => {
// //             if (err) {
// //                 console.error("Error hashing the password:", err);
// //                 return res.status(500).json({ error: "Error hashing the password" });
// //             }

// //             const userToSave = {
// //                 name,
// //                 email,
// //                 phone,
// //                 password: hashedPassword
// //             };

// //             usersModel.register(userToSave, (err, result) => {
// //                 if (err) {
// //                     console.error("Error adding the user to the database:", err);
// //                     return res.status(500).json({ error: "Error adding the user" });
// //                 }
// //                 console.log("User added successfully:", result);
// //                 res.status(201).json({ message: "User added successfully", userId: result });
// //             });
// //         });
// //     },
// //     login: (req, res) => {
// //         console.log("Login request received");
// //         const { email, password } = req.body;

// //         if (!email || !password) {
// //             return res.status(400).json({ error: "All fields are required" });
// //         }

// //         if (password.length < 6) {
// //             return res.status(400).json({ error: "Password must be at least 6 characters long" });
// //         }

// //         usersModel.getUserByUsername(email, (err, user) => {
// //             if (err) return res.status(500).json({ error: "Database error" });
// //             if (!user) return res.status(401).json({ error: "Invalid username or password" });

// //             bcrypt.compare(password, user.password, (err, isMatch) => {
// //                 if (err) return res.status(500).json({ error: "Error checking password" });
// //                 if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

// //                 const userWithoutPassword = { ...user };
// //                 delete userWithoutPassword.password;
// //                 let token = generateToken(userWithoutPassword);
// //                 userWithoutPassword.token = token;
// //                 res.json({ message: "Login successful", user: userWithoutPassword });
// //             });
// //         });
// //     }
// // };

// // export default user;
// import usersModel from "../modules/user.js";
// import { generateToken } from "../middleware/outh.js";

// const user = {
//     register: async (req, res) => {
//         const { name, email, phone, password } = req.body;

//         if (!name || !email || !password || !phone) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({ error: "Invalid email address" });
//         }

//         if (password.length < 6) {
//             return res.status(400).json({ error: "Password must be at least 6 characters long" });
//         }

//         try {
//             const result = await usersModel.register({ name, email, phone, password });
//             console.log("User added successfully:", result);
//             res.status(201).json({ message: "User added successfully", userId: result.userId });
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
//             const user = await usersModel.getUserByUsername(email);
//             if (!user) {
//                 return res.status(401).json({ error: "Invalid username or password" });
//             }

//             // השוואת סיסמה
//             const bcrypt = await import("bcrypt");

//             const isMatch = await bcrypt.compare(password, user.password);
//             console.log("passord",password, user.password);
//             if (!isMatch) {
//                 return res.status(401).json({ error: "Invalid username or password" });
//             }

//             const userWithoutPassword = { ...user };
//             delete userWithoutPassword.password;
//             let token = generateToken(userWithoutPassword);
//             userWithoutPassword.token = token;
//             res.json({ message: "Login successful", user: userWithoutPassword });
//         } catch (err) {
//             console.error("Login error:", err);
//             res.status(500).json({ error: "Database error" });
//         }
//     }
// };

// export default user;
import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import { generateToken } from "../middleware/outh.js";

const user = {
    getById: async (req, res) => {
            try {
                const user = await usersModel.getById(req.params.id);
                if (!user) return res.status(404).json({ message: 'User not found' });
                res.json(user);
            } catch (err) {
                console.error('Error getting user by ID:', err);
                res.status(500).json({ error: 'Failed to fetch user' });
            }
        },
     register: async (req, res) => {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email address" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        try {
            const result = await usersModel.register({ name, email, phone, password });
            console.log("User added successfully:", result);
            res.status(201).json({ message: "User added successfully", userId: result.userId });
        } catch (err) {
            console.error("Error adding the user to the database:", err);
            res.status(500).json({ error: "Error adding the user" });
        }
    },

    login: async (req, res) => {
        console.log("Login request received");
        const { email, password } = req.params;

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
            let token = generateToken(userWithoutPassword);
            userWithoutPassword.token = token;
            res.json({ message: "Login successful", user: userWithoutPassword });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ error: "Database error" });
        }
    }
};

export default user;