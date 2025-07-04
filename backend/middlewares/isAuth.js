import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No authentication token provided.",
                error: "MISSING_TOKEN"
            })
        }

        // Verify JWT token
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)
        
        if (!verifyToken.userId) {
            return res.status(401).json({
                message: "Invalid token format",
                error: "INVALID_TOKEN_FORMAT"
            })
        }

        req.userId = verifyToken.userId
        next()

    } catch (error) {
        console.error('Authentication error:', error.message)
        
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token has expired. Please sign in again.",
                error: "TOKEN_EXPIRED"
            })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token. Please sign in again.",
                error: "INVALID_TOKEN"
            })
        } else {
            return res.status(500).json({
                message: "Authentication failed. Please try again.",
                error: "AUTH_ERROR"
            })
        }
    }
}

export default isAuth