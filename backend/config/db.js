import mongoose from "mongoose"

const connectDb = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain a minimum of 5 socket connections
        }

        const conn = await mongoose.connect(process.env.MONGODB_URL, options)
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
        console.log(`📊 Database: ${conn.connection.name}`)
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err)
        })
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected')
        })
        
        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected')
        })
        
        return conn
    } catch (error) {
        console.error('❌ Database connection failed:', error.message)
        throw error
    }
}

export default connectDb