import mongoose from "mongoose"

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // deletes automatically after 10 minutes (600 seconds)
    }
})

const otpModel = mongoose.model('otp', OTPSchema)
export default otpModel
