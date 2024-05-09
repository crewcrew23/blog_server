import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const createPost = async (req, res) =>{
        try {
            const doc = new PostModel({
                title:req.body.title,
                text:req.body.text,
                imageURL:req.body.imageURL,
                tags:req.body.tags,
                user:req.userId,
            })

            const post = await doc.save()
            res.json({
                post:post
            })


        }catch (err){
            console.log(err)
            res.status(500).json({
                message:"не удалось создать статью",
                error:err
            })
        }
}

export const getAll = async (req, res) =>{
    try {

        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)

    }catch (err){
        console.log(err)
        res.status(500).json({
            message:"не удалось получить статьи",
            error:err
        })
    }
}

export const getOne = async (req, res) =>{
    try {
        const postId = req.params.id
       PostModel.findOneAndUpdate(
           {
               _id:postId,
           },
           {
               $inc:{viewsCount: 1},
           },
           {
               returnDocument: 'after',
           },).then((doc, err) =>{
           if (err){
               return  res.status(500).json({
                   message:"Не удалось получить статью",
                   error:err
               })
           }
           if (!doc){
               return res.status(404).json({
                   message:"Статья не найдена.",
                   error:err
               })
           }

           res.json(doc)
       })

    }catch (err){
        console.log(err)
        res.status(500).json({
            message:"не удалось получить статью",
            error:err
        })
    }
}
export const remove = async (req, res) =>{
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete({
            _id:postId
        }).then((doc, err) =>{
            if (err){
                return res.status(500).json({
                    message:"не удалось удалить стать.",
                    error:err
                })
            }

            if (!doc){
                return res.status(500).json({
                    message:"Не удалось удалить стать.",
                    error:err
                })
            }

            res.json({
                success:true
            })
        })

    }catch (err){
        console.log(err)
        res.status(500).json({
            message:"Статья не найдена.",
            error:err
        })
    }
}

export const update = async (req, res) =>{
    try {
        const postId = req.params.id

        await PostModel.updateOne(
            {
                _id:postId,
            },
            {
                title:req.body.title,
                text:req.body.text,
                imageURL:req.body.imageURL,
                user:req.userId,
                tags:req.body.tags
            }
        )

        res.json({
            success:true
        })
    }catch (err){
        console.log(err)
        return res.status(500).json({
            message:"Не удалось обновить статьи",
            error:err
        })
    }
}

export const getLastTags = async (req, res) =>{
    try {
        const posts = await PostModel.find().limit(5).exec()

        const tags = posts.flatMap(post => post.tags).slice(-6).reverse()
        const uniqueTags =[... new Set(tags)]

        res.json(uniqueTags)

    }catch (err){
        console.log(err)
        res.status(500).json({
            message:"не удалось получить теги",
            error:err
        })
    }
}

export const getPopularPosts = async (req, res) =>{
    try{
        const posts = await PostModel.find().sort({viewsCount: -1}).populate('user').exec()
        res.status(200).json(posts)
    }catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
}

export const getSelectedPostsByTag = async(req, res) =>{
    try{
        const requestTag = req.params.tag
        const posts = await PostModel.find({ tags: requestTag }).populate('user').exec()
    

        res.status(200).json({
            posts:posts
        })
    }catch(err){
        res.status(500).json({
            error:err
        })
    }
}

export const addComment = async(req, res) =>{
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/,'')
        const decodedToken = jwt.verify(token, 'secretKey123')
        const userId = decodedToken._id
        const user = await UserModel.findById(userId)
        const {hashedPassword, ...userData} = user._doc



        const postId = req.params.id
        const post = await PostModel.findById(postId)
        
        post.comments.push({
            comment:req.body.comment,
            owner:userData
        })
        await post.save()
        res.status(200).json(post)

    } catch (err) {
        res.status(500).json({
            error:err
        })
    }
}

export const getlastComments = async(req, res)=>{
    try {
        const posts = await PostModel.find().limit(5).exec()
        const comments = posts.flatMap(post => post.comments).reverse().slice(-6)

        res.status(200).json(comments)
        
    } catch (err) {
        res.status(500).json({
            error:err
        })
    }
}