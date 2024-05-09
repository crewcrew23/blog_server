import express from 'express'
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";
import {login, profile, register, getUser} from "./controllers/userController.js";
import {
    createPost, 
    getAll,
    getLastTags,
    getOne, 
    remove,
    update,
    getPopularPosts, 
    getSelectedPostsByTag, 
    addComment,
    getlastComments
} from "./controllers/postController.js";
import multer from 'multer'
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from 'cors'

const PORT = 5000 || 5500
const app = express()
mongoose.connect("mongodb+srv://root:root@blogbase.kvwfw6h.mongodb.net/blog?retryWrites=true&w=majority&appName=BlogBase")
    .then ( () => console.log(`DB has been connected`))
        .catch((err) => {
            console.log(`DB error: ${err}`)
        })

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'upload')
    },
    filename:(req,file,cb) =>{
        cb(null,file.originalname)
    },

})

const upload = multer({ storage })


app.use(express.json())
app.use(cors())
app.use('/upload', express.static('upload'))

//login & reg
app.post('/login', loginValidation, handleValidationErrors, login)
app.post('/registration', registerValidation, handleValidationErrors, register)
app.get('/profile', checkAuth, profile)
app.get('/getUserByArticleId/:id', getUser)

app.post('/upload', checkAuth, upload.single('image'), (req, res) =>{
    try{
        res.json({
            url:`/upload/${req.file.originalname}`
        })
    }catch (err){
        console.log(err)
        res.status(500).json(err)
    }
})

//posts
//authorization route
app.post('/posts',checkAuth, postCreateValidation, handleValidationErrors, createPost)
app.delete('/posts/:id',checkAuth, remove)
app.post('/addComment/:id',checkAuth, addComment)

//not authorization route
app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.patch('/posts/:id', handleValidationErrors, update)
app.get('/tags', getLastTags)
app.get('/selectedPostsByTags/:tag', getSelectedPostsByTag)
app.get('/popular', getPopularPosts)
app.get('/lastComments', getlastComments)

app.listen(PORT,"0.0.0.0", (err) =>{
    if (err){
        console.log(err)
    }else {
        console.log(`Ok, server has been started on PORT: ${PORT}`)
    }
})