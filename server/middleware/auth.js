import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secure_jwt_secret_key_12345";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Use userId consistently (handle both 'id' and 'userId' just in case)
        req.userId = decoded.userId || decoded.id;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
