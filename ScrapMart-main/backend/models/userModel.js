
import mongoose from "mongoose"
const UserSchema=mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:['dealer','coustomer']
    },
    email:{
        type:String,
        require:true 
    },
    phone:{
        type:Number,
        require:true 
    },
    scrap:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'scrap' 
    }]
    ,
    bit:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'bit' 
    }],
    isVerified:{
        type:Boolean,
        default:false
    }
})

const userModel=mongoose.model('user',UserSchema)
export default  userModel