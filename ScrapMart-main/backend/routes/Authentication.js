import express from  'express' 
import {Registor,otpVerification,setProfile,login, profileData} from  '../controller/userController.js' 
import { AuthUser } from '../middlewere/Auth.js'
const userRouter=express.Router()

userRouter.post('/Registor',Registor)
userRouter.get('/verify',otpVerification)
userRouter.post('/setprofile/:email',setProfile)
userRouter.post('/login',login)
userRouter.get('/profile',AuthUser,profileData)
export{userRouter}

