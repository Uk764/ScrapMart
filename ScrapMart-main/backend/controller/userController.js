import jwt from'jsonwebtoken' 
import userModel from   '../models/userModel.js'
import nodemailer from 'nodemailer'
import validator from  'validator'
import  bcrypt from 'bcrypt'
import crypto from  'crypto'
import { Resend } from 'resend'
import { config } from 'dotenv'
import scrapModel from '../models/scrapModel.js'

config()
console.log(process.env.RESEND_API)
const resend=new Resend(process.env.RESEND_API)
const otp=crypto.randomInt(1000,100000)

//send Email controller 
export const  Registor =async(req,res)=>{
  const{email}=req.body
  console.log(email)
  const trans= nodemailer.createTransport({      
    host: "smtp.gmail.com",
    service:"gmail",
    auth: {
      type: "login", // default
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
    }
  });
  const user= await userModel.findOne({email:email})

  console.log(user)
  if(user){
   return  res.json({success:false,msg:'email already exist'})
  }
 
    const token =jwt.sign({email},process.env.JWT_SECRATE,{expiresIn:'10m'})
  
   const mailoption={
    from:process.env.EMAIL,
    to:email,
    subject:"Email verification ",
    html:`<h3>your verification link is  </h3> <a href="https://scrap-mart-fawn.vercel.app/verified?token=${token}">verify </a>`
   }
   await trans.sendMail(mailoption)
   res.json({success:true,msg:'Please check your Email for verification Link  '})
  
}


//otp verification and store user email
export const otpVerification=async (req,res)=>{
  try{

  const token=req.query.token
  
  if(!token){
    return res.json({success:false,msg:'token nhi hai bc '})
  }
  else{

  
  const decode=jwt.verify(token,process.env.JWT_SECRATE)
  console.log(decode)
   const newUser=await userModel.create({
    email:decode.email,
    isVerified:true
   })
  
  res.json({succes:true,data:newUser.email})
  }
}
catch(err){
  if(err.name=='TokenExpiredError'){
    return res.json({succes:false,msg:'your token is expire pls register again '})
  }
  else{
    res.json({succes:false,msg:err.message})
  }
 
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
  res.json({succes:false,msg:'email is not verified'})
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
    return res.json({succes:false,msg:'user not find' })
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
  res.json({succes:false,msg:error.message})
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
