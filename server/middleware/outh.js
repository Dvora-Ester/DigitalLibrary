
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRETKEY ?? "SECRETKEY";

const generateToken = (user) => {
    const payload = {
        id: user.Id,
        isManager: user.Is_Manager,
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: 'Access denied – no token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        // req.user = {
        //   id: decoded.Id,
        //   isManager: decoded.Is_Manager
        // };
        req.user = {
            id: decoded.id,
            isManager: decoded.isManager
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// import jwt from 'jsonwebtoken';
// const secretKey = process.env.SECRETKEY ?? "SECRETKEY"
// const generateToken = (user) => {
//       const payload = {
//         id: user.Id,
//         isManager: user.isManager,
//     };
//     return jwt.sign(payload, secretKey, { expiresIn: '1h' });
// };


// function verifyToken(req, res, next) {
//     console.log("req.header('Authorization'):", req.header('Authorization'));
//     const token = req.header('Authorization')!= undefined?req.header('Authorization').split(' ')[1]:null; // Assuming the token
//     console.log("token:", token);
//     if (!token) return res.status(401).json({ error: 'Access denied' });
//     try {
//         const decoded = jwt.verify(token, secretKey);
//         req.userId = decoded.id;
//         // req.username = decoded.username;
//         req.isManager = decoded.isManager;
//         // console.log("decoded.role:", decoded.role);
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// };


function isAdmin(req, res, next) {
    console.log("eq.role:", req.role);
    if (req.role != 1) { // Assuming '1' is the role for admin
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}
//https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49

export { verifyToken, generateToken, isAdmin }