import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signUp=async (req,res)=>{
try {
    const {name,email,password}=req.body

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }

    if (!email.includes('@')) {
        return res.status(400).json({message: "Please provide a valid email address"})
    }

    const existEmail=await User.findOne({email})
    if(existEmail){
        return res.status(400).json({message:"Email already exists! Please use a different email."})
    }
    
    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters long"})
    }

    const hashedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
        name: name.trim(),
        password: hashedPassword,
        email: email.toLowerCase().trim()
    })

    const token=await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure: process.env.NODE_ENV === 'production'
    })

    // Remove password from response
    const userResponse = { ...user.toObject() }
    delete userResponse.password

    console.log(`New user registered: ${email}`)
    return res.status(201).json(userResponse)

} catch (error) {
    console.error('Sign up error:', error)
    return res.status(500).json({message: "Registration failed. Please try again."})
}
}

export const Login=async (req,res)=>{
try {
    const {email,password}=req.body

    // Validate input
    if (!email || !password) {
        return res.status(400).json({message: "Email and password are required"})
    }

    const user=await User.findOne({email: email.toLowerCase().trim()})
    if(!user){
        return res.status(400).json({message:"Invalid email or password"})
    }
    
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"Invalid email or password"})
    }

    const token=await genToken(user._id)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure: process.env.NODE_ENV === 'production'
    })

    // Remove password from response
    const userResponse = { ...user.toObject() }
    delete userResponse.password

    console.log(`User logged in: ${email}`)
    return res.status(200).json(userResponse)

} catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({message: "Login failed. Please try again."})
}
}

export const logOut=async (req,res)=>{
    try {
        res.clearCookie("token")
         return res.status(200).json({message:"log out successfully"})
    } catch (error) {
         return res.status(500).json({message:`logout error ${error}`})
    }
}
        