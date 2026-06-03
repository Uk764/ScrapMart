import mongoose from "mongoose";

const scrapSchema=mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    Type:{
        type:String,
        enum:["Plastic","Iron","Steel","Newspapers","Books"]
    },
    weight:{
        type:Number
    },
    des:{
        type:String
    }, 

    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user' 
    }],
 bit:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'bit' 
    }],
    location: {
        type: {
          type: String, // required for GeoJSON format
          enum: ['Point'], // only 'Point' allowed
          required: true
        },
        coordinates: {
          type: [Number], // array of numbers: [lng, lat]
          required: true
        }
      },
    

})

scrapSchema.index({ location: '2dsphere' });
const scrapModel=mongoose.model('scrap',scrapSchema)
export default scrapModel