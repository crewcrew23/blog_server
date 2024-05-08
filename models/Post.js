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
        },
        imageURL:{
            type:String,
            default:''
        },
        comments:{
            type:Array,
            default:[]
        }
    },
    {
        timestamps:true,
    }
)

export default mongoose.model('Post', PostSchema)