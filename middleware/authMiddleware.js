const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    try {
        // Получаем токен из заголовка
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }

        if (!decoded.id) {
            return res.status(401).json({ error: "Token missing user ID" });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (error) {
        console.log('Auth middleware error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        return res.status(401).json({ error: "Authentication failed" });
    }
};