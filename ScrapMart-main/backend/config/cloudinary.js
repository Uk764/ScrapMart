import {v2 as cloudinary} from 'cloudinary'
import { config } from 'dotenv'
export const ConnectCloudinary=async()=>{
    cloudinary.config({
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRATE,
        cloud_name:process.env.CLOUDINARY_NAME
    })
}