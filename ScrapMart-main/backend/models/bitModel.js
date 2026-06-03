import mongoose from "mongoose";
const bitSchema=mongoose.Schema({
    shopName:{
        type:String
    },
    bitAmount:{
        type:String
    },
    bitStatus:{
        type:String,
        default:'Pending'
    },
    scrap:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'scrap'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user' 
    }

})
const bitModel=mongoose.model('bit',bitSchema)
export default bitModel