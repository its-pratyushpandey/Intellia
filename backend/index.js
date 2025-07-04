import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import mongoose from "mongoose"

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URL', 'JWT_SECRET', 'GEMINI_API_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '))
    console.error('Please check your .env file and ensure all required variables are set.')
    process.exit(1)
}

// Optional environment variables with warnings
const optionalEnvVars = ['WEATHER_API_KEY']
const missingOptionalVars = optionalEnvVars.filter(envVar => !process.env[envVar])
if (missingOptionalVars.length > 0) {
    console.warn('⚠️ Missing optional environment variables:', missingOptionalVars.join(', '))
    console.warn('Some features may not work properly.')
}

const app = express()
const port = process.env.PORT || 8000
const isDevelopment = process.env.NODE_ENV !== 'production'

// Trust proxy for deployment platforms
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}))

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? 1000 : 100, // More requests in development
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 15
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000', 
            'http://127.0.0.1:5173',
            'http://localhost:5174'
        ]
        
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true)
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Apply rate limiting
app.use(limiter)

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Content-Security-Policy', "default-src 'self'")
    res.setHeader('X-Powered-By', 'MyAssistant API')
    next()
})

// Request logging with IP tracking and timing
app.use((req, res, next) => {
    const start = Date.now()
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress || req.ip
    const userAgent = req.headers['user-agent']
    
    res.on('finish', () => {
        const duration = Date.now() - start
        const logData = {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            ip: clientIP,
            userAgent: userAgent,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        }
        
        if (res.statusCode >= 400) {
            console.error('❌ Error Request:', JSON.stringify(logData, null, 2))
        } else {
            console.log(`✅ ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - IP: ${clientIP}`)
        }
    })
    
    next()
})

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'MyAssistant API Documentation',
        version: '1.0.0',
        description: 'AI-powered personal assistant backend API',
        endpoints: {
            auth: {
                'POST /api/auth/signup': 'Register a new user',
                'POST /api/auth/signin': 'User login',
                'GET /api/auth/logout': 'User logout'
            },
            user: {
                'GET /api/user/current': 'Get current user information',
                'POST /api/user/update': 'Update assistant settings',
                'POST /api/user/update-settings': 'Update user preferences',
                'POST /api/user/asktoassistant': 'Chat with AI assistant'
            },
            system: {
                'GET /api/health': 'Health check endpoint',
                'GET /api/docs': 'API documentation'
            }
        },
        authentication: 'Cookie-based JWT authentication',
        contentType: 'application/json'
    })
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

// Health check endpoint with comprehensive system status
app.get('/api/health', async (req, res) => {
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()
    
    let dbStatus = 'Unknown'
    let healthData
    
    try {
        // Test database connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.admin().ping()
            dbStatus = 'Connected'
        } else {
            dbStatus = 'Disconnected'
        }
    } catch (error) {
        dbStatus = 'Error'
    }
    
    healthData = {
        status: dbStatus === 'Connected' ? 'OK' : 'PARTIAL',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)} minutes ${Math.floor(uptime % 60)} seconds`,
        memory: {
            used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
            total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
            external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
            percentage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`
        },
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        node_version: process.version,
        platform: process.platform,
        architecture: process.arch,
        database: {
            status: dbStatus,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host || 'Unknown'
        },
        services: {
            gemini_api: process.env.GEMINI_API_URL ? 'Configured' : 'Not configured',
            cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured',
            weather_api: process.env.WEATHER_API_KEY ? 'Configured' : 'Not configured (optional)'
        }
    }
    
    // Return appropriate status code
    const statusCode = dbStatus === 'Connected' ? 200 : 206 // 206 = Partial Content
    res.status(statusCode).json(healthData)
})

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Unhandled Error:', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        path: req.path,
        ip: req.ip,
        timestamp: new Date().toISOString()
    })
    
    res.status(err.status || 500).json({
        message: isDevelopment ? err.message : 'Internal server error',
        error: isDevelopment ? err.stack : undefined,
        timestamp: new Date().toISOString()
    })
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        availableRoutes: ['/api/auth', '/api/user', '/api/health', '/api/docs'],
        timestamp: new Date().toISOString()
    })
})

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...')
    process.exit(0)
})

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...')
    process.exit(0)
})

// Start server
app.listen(port, async () => {
    console.log('🚀='.repeat(50))
    console.log(`🚀 MyAssistant Backend Server Started Successfully!`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Server running on: http://localhost:${port}`)
    console.log(`📊 Health check: http://localhost:${port}/api/health`)
    console.log(`📋 API docs: http://localhost:${port}/api/docs`)
    console.log(`⏰ Started at: ${new Date().toISOString()}`)
    console.log('🚀='.repeat(50))
    
    // Try to connect to database
    try {
        await connectDb()
        console.log('✅ Database connection successful!')
    } catch (error) {
        console.error('❌ Database connection failed:', error.message)
        console.warn('⚠️ Server will continue running without database connection')
        console.warn('⚠️ Database-dependent features will not work properly')
        console.warn('⚠️ Please check your MongoDB connection string and network settings')
    }
})

