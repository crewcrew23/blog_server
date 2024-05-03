import PostModel from "../models/Post.js";

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