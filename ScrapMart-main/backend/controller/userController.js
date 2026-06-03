import jwt from 'jsonwebtoken' 
import userModel from '../models/userModel.js'
import otpModel from '../models/otpModel.js'
import nodemailer from 'nodemailer'
import validator from 'validator'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { config } from 'dotenv'

config()

//send Email controller 
export const Registor = async(req,res)=>{
  try {
    const{email}=req.body
    console.log("Email requested for OTP:", email)
    
    if(!email || !validator.isEmail(email)){
      return res.json({success:false,msg:'Invalid email address'})
    }

    const user= await userModel.findOne({email:email})
    if(user && user.isVerified){
      return res.json({success:false,msg:'Email already exists'})
    }

    // Generate 6-digit OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString()

    // Save/Update OTP in database
    await otpModel.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    )
 
    // Nodemailer transporter without type: "login"
    const trans = nodemailer.createTransport({      
      host: "smtp.gmail.com",
      service: "gmail",
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD
      }
    });
    
    const mailoption = {
      from: process.env.EMAIL,
      to: email,
      subject: "ScrapMart - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #4f46e5; text-align: center;">ScrapMart Verification</h2>
          <p>Hello,</p>
          <p>Thank you for signing up on ScrapMart. Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes.</p>
          <div style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1f2937; border-radius: 6px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p>If you did not request this OTP, please ignore this email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">ScrapMart Team</p>
        </div>
      `
    }
    await trans.sendMail(mailoption)
    res.json({success:true,msg:'Verification OTP sent to your email.'})
  } catch (error) {
    console.error("Register error:", error)
    res.json({success:false,msg:error.message})
  }
}

//otp verification and store user email
export const otpVerification=async (req,res)=>{
  try{
    const { email, otp } = req.method === 'POST' ? req.body : req.query
    const token = req.query.token
    
    if (token) {
      // Fallback for verification link
      const decode = jwt.verify(token, process.env.JWT_SECRATE)
      let newUser = await userModel.findOne({ email: decode.email })
      if (!newUser) {
        newUser = await userModel.create({
          email: decode.email,
          isVerified: true
        })
      } else {
        newUser.isVerified = true
        await newUser.save()
      }
      return res.json({ success: true, data: newUser.email })
    }

    if (!email || !otp) {
      return res.json({ success: false, msg: 'Email and OTP are required' })
    }

    const otpRecord = await otpModel.findOne({ email })
    if (!otpRecord) {
      return res.json({ success: false, msg: 'OTP has expired or is invalid' })
    }

    if (otpRecord.otp !== otp.toString().trim()) {
      return res.json({ success: false, msg: 'Incorrect OTP. Please try again' })
    }

    // OTP matches! Delete it
    await otpModel.deleteOne({ email })

    // Create/verify user
    let user = await userModel.findOne({ email })
    if (!user) {
      user = await userModel.create({
        email,
        isVerified: true
      })
    } else {
      user.isVerified = true
      await user.save()
    }

    const loginToken = jwt.sign({ email: user.email }, process.env.JWT_SECRATE)
    res.json({ success: true, msg: 'Email verified successfully', loginToken, email: user.email })
  }
  catch(err){
    console.error("Verification error:", err)
    res.json({success:false,msg:err.message})
  }
}

//updating the profile 
export const setProfile=async(req,res)=>{
try{
const email=req.params.email
console.log(email)
const{username,password,role,phone}=req.body
const salt=await bcrypt.genSalt(10)
const hash=await bcrypt.hash(password,salt)
const user=await userModel.findOne({email:email})

if(user.isVerified){
  
  user.username=username,
  user.password=hash,
  user.role=role
  user.phone=phone
  await user.save()
  const loginToken=jwt.sign({email:user.email},process.env.JWT_SECRATE)
  return res.json({success:true,loginToken,role:user.role})
  // return res.json({succes:true ,data:user})
}
else{
  res.json({success:false,msg:'email is not verified'})
}
}
catch(error){
  return res.json({success:false,msg:error.message})
}
}


//login 

export const login =async (req,res)=>{
  try{
  const{email,password}=req.body
  console.log(password)
  
  const user=await userModel.findOne({email})
  if(!user){
    return res.json({success:false,msg:'user not find' })
  }
  
   const isMatch= await bcrypt.compare(password,user.password)
   console.log(isMatch)
   if(isMatch){
    const loginToken=jwt.sign({email:user.email},process.env.JWT_SECRATE)
    console.log(loginToken)
    return res.json({success:true,loginToken,role:user.role})

   }
   else{
    return res.json({
      success:false,
      msg:"you password is wrong "
    })
   }
  

}
catch(error){
  res.json({success:false,msg:error.message})
}
}


export const profileData=async(req,res)=>{
  try{
   
    const user=await userModel.findOne({email:req.userId.email})
   

     return res.json({success:true,user})
  }
  catch(e){
    return res.json({success:false,msg:e.message})
  }
}
