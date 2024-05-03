import express from 'express'
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";
import {login, profile, register} from "./controllers/userController.js";
import {createPost, getAll, getOne, remove, update} from "./controllers/postController.js";
import multer from 'multer'

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

//login & reg
app.post('/login',loginValidation, login)
app.post('/registration', registerValidation, register)
app.get('/profile', checkAuth, profile)

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
app.post('/posts',checkAuth, postCreateValidation, createPost)
app.delete('/posts/:id',checkAuth, remove)
//not authorization route
app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.patch('/posts/:id', update)

app.listen(PORT, (err) =>{
    if (err){
        console.log(err)
    }else {
        console.log(`Ok, server has been started on PORT: ${PORT}`)
    }
})