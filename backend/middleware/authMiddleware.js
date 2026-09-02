import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;

        // Check token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store student information in request
        req.student = decoded;

        // Go to next function
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};