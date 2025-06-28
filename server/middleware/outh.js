
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRETKEY ?? "SECRETKEY";

const generateToken = (user) => {
    const payload = {
        id: user.Id,
        isManager: user.Is_Manager,
        Email: user.Email,
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
            isManager: decoded.isManager,
            Email: decoded.Email
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

function isAdmin(req, res, next) {
    console.log("req.user:", req.user);
    if (!req.user?.isManager) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}

//https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49

export { verifyToken, generateToken, isAdmin }