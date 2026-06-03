import { error } from "console"
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import scrapModel from '../models/scrapModel.js'
import userModel from '../models/userModel.js'
import bitModel from "../models/bitModel.js"
import { getSocketInstance } from "../config/socketServer.js"
import axios from "axios"
import { response } from "express"
import { trans } from "../config/mailConfig.js"


export const addScrap=async(req,res)=>{
    try{

    
    const {Type,des,weight,lng,lat}=req.body
    const image=req.file.path
    let imageUrl=(await (cloudinary.uploader.upload(image))).secure_url
    console.log(imageUrl)
   
    
    const user=await userModel.findOne({email:req.userId.email})
    
    const scrap=await scrapModel.create({
        image:imageUrl,
        Type,
        weight,
        des,
        location: {
            type: "Point",
            coordinates: [lng, lat]
          },
        user:user._id

    })
    console.log(scrap)
    user.scrap.push(scrap._id)
    await user.save()
    return res.json({success:true,data:scrap})
}
catch(e){
    return res.json({success:false,msg:e.message})
}

}


export const allSCrap=async(req,res)=>{
    try{
        const {lat,lng}=req.query
        const distance=10*1000
        // console.log(lat)
        // console.log(lng)
        const scrap=await scrapModel.find().populate('bit')
        // const scrap=await scrapModel.find({location:{
        //     $near:{
        //      $geometry:{
        //         type:"Point",
        //         coordinates:[parseFloat(lng),parseFloat(lat)]
        //      }   ,
        //      $maxDistance:1000
        // }}})
        // console.log(scrap)
        return res.json({success:true,scrap})
    }
    catch(e){
        return res.json({success:false,msg:error.message})
    }
}

export const userSCrap=async(req,res)=>{
try{
    const user=await userModel.findOne({email:req.userId.email})
    if(user.role === 'coustomer'){
        const scrap=await scrapModel.find({
            user:user._id
        }).populate('user')

        res.json({success:true, scrap})
    }


}
catch(e){
    res.json({success:true ,msg: e.message})
}
}



export const sendBit=async(req,res)=>{
    try{
        const{shopName,bit}=req.body
        const{scrapId}=req.query
        console.log(scrapId)
       const user=await userModel.findOne({email:req.userId.email})
       const scrap=await scrapModel.findOne({_id:scrapId})
    //    console.log(user)
       console.log(scrap.bit )
        const setBit=await bitModel.create({
            shopName,
            bitAmount:bit,
            scrap:scrapId,
            user:user._id
        })
        user.bit.push(setBit._id)
        scrap.bit.push(setBit._id)
        await user.save()
        await scrap.save()
      
        
        
        res.json({success:true , setBit})


    }
    catch(e){
        res.json({success:true ,msg:e.message })
    }
}






export const allBit=async(req,res)=>{
try{
const{scrapId}=req.params 
console.log(scrapId)
const bit = await bitModel.find({scrap:scrapId})

const io=getSocketInstance()
io.emit('send-bit',bit)
res.json({success:true, bit})
}
catch(e){
    return res.json({success:true , msg:e.message })
}
}


export const ioInstance=((io)=>{

    io.on('connection',(socket)=>{
        console.log("connected", socket.id)


        socket.on('sub-bit',async({token,scrapId,shopName,bit})=>{
            try{
                if(!token){
                    socket.emit('bit-error', { msg: 'Token missing' });
                    return;
          
                }

                else{
                const token_decode=jwt.verify(token,process.env.JWT_SECRATE)
                const user=await userModel.findOne({email:token_decode.email})
                const scrap= await scrapModel.findOne({_id:scrapId})

                const setBit=await bitModel.create({
                    shopName,
                    bitAmount:bit,
                    scrap:scrapId,
                    user:user._id
                })
                console.log(setBit)
                user.bit.push(setBit._id)
                scrap.bit.push(setBit._id)
                await user.save()
                await scrap.save()
                console.log('baap')
                socket.emit('bit-success',setBit)
                

                }

            }
            catch(e){
                socket.emit('error-bit',{msg:e.message})
            }
                })


            socket.on('sendId',async({scrapId})=>{
                // console.log(scrapId)

                const setBit=await bitModel.find({scrap:scrapId})
                // console.log(setBit)
                socket.emit('send-bit',setBit)
            })  



            //bit accept in realtime 

            socket.on('send-reject-request',async({lat,lng,bitId})=>{
                console.log(lat)
                console.log(lng),
                console.log(bitId)

                const setStatus=await bitModel.findOne({_id:bitId})
                setStatus.bitStatus='Reject'
                await setStatus.save()
                // console.log(setStatus)
                // setStatus.bitStatus('Reject')
                const notRejectBit=await bitModel.findOne({bitStatus:'Pending'})
                console.log(notRejectBit)
                socket.emit('bit-reject',notRejectBit)
            })

            socket.on('get-status',async({token})=>{
                if(!token){
                    socket.emit('bit-error', { msg: 'Token missing' });
                    return;
          
                }
                else{
                const token_decode=jwt.verify(token,process.env.JWT_SECRATE)
             

                let user=await userModel.findOne({email:token_decode.email}).populate('bit')

                const status=user.bit.map(b=>b.bitStatus)
                socket.emit('set-status',{status:status})
                }

            })

            socket.on('send-accept-request', async ({ lat, lng, bitId }) => {
                try {
                  console.log('Latitude:', lat);
                  console.log('Longitude:', lng);
                  console.log('Bit ID:', bitId);

                  const bit=await bitModel.findOne({_id:bitId})
                  .populate('user')   // populates the user field
                  .populate('scrap'); 
                  const scrapId=bit.scrap._id
                const email=bit.user.email
                
                const phone=bit.user.phone
                console.log(email)
                  const url = `https://nominatim.openstreetmap.org/reverse`;
              
                  const response = await axios.get(url, {
                    params: {
                      lat: lng,
                      lon: lat,
                      format: 'json',
                    },
                    headers: {
                      'User-Agent': 'ScrapDealerApp/1.0 (ak6935846@gmail.com)',
                    },
                  });

                  const address=response.data.display_name

                  const mailOption={
                    from: process.env.EMAIL,
                    to: email, // dealer's email
                    subject: "Bid Accepted - Pickup Details",
                    html: `
                      <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #4CAF50;">🎉 Congratulations!</h2>
                        <p>Your bid has been accepted. Please contact the customer and arrange the pickup.</p>
                  
                        <p><strong>📍 Address:</strong> ${address}</p>
                        <p><strong>📞 Phone:</strong> ${phone}</p>
                  
                        <p>Thank you for using our service!</p>
                      </div>
                    `
                  }
                  
                 await trans.sendMail(mailOption)

                 await scrapModel.findOneAndDelete({_id:bit.scrap._id})
                 await userModel.updateOne(
                    { email: email },          // 1️⃣ Yeh user dhoond raha hai jiska ID == scrap.user
                    { $pull: { scrap: scrapId } } // 2️⃣ Uske 'scrap' array me se scrapId hata raha hai
                  );
                  
                 socket.emit('bit-deleted', {id: scrapId});
              
                //   console.log('Address from reverse geocoding:', response.data);
                } catch (error) {
                  console.error('Reverse geocoding failed:', error.response?.data || error.message);
                }
              });

            //   const address=response.data.display_name
              
              


            
            
    })

    io.on('disconect',(socket)=>{
        console.log('siconnected', socket._id)
    })
})

// const showStatus=async(req,res)=>{
//     try{

//     }
//     catch(e){
//         res.json({success:false,msg:e.message})
//     }
// }
