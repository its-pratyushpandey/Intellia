import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
const uploadOnCloudinary =async (filePath)=>{
     cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath)
        // Clean up local file after successful upload
        fs.unlinkSync(filePath)
        return uploadResult.secure_url
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        // Clean up local file even if upload fails
        try {
            fs.unlinkSync(filePath)
        } catch (unlinkError) {
            console.error('Error cleaning up file:', unlinkError)
        }
        throw new Error('Failed to upload image to cloudinary')
    }
}


export default uploadOnCloudinary