import mongoose from "mongoose";


const PostSchema  = new mongoose.Schema({
        title:{
            required:true,
            type:String,
        },
        text:{
            required:true,
            type:String,
        },
        tags:{
            type:Array,
            default:[]
        },
        viewsCount:{
            type:Number,
            default: 0
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    },
    {
        timestamps:true,
        imageURL:String,
    }
)

export default mongoose.model('Post', PostSchema)