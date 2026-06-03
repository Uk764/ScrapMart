import mongoose from "mongoose"
export const ConnectDB=async ()=>{
    mongoose.connection.on('connected',()=>{
        console.log('connected succesfully ')
    })
    await mongoose.connect(`${process.env.MONGO_URL}`)
}

