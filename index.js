import express from 'express'
import mongoose from "mongoose";
import {registerValidation} from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import {login, profile, register} from "./controllers/userController.js";

const PORT = 5000 || 5500
const app = express()
mongoose.connect("mongodb+srv://root:root@blogbase.kvwfw6h.mongodb.net/blog?retryWrites=true&w=majority&appName=BlogBase")
    .then ( () => console.log(`DB has been connected`))
        .catch((err) => {
            console.log(`DB error: ${err}`)
        })

app.use(express.json())

app.post('/login', login)
app.post('/registration', registerValidation, register)
app.get('/profile', checkAuth, profile)

app.listen(PORT, (err) =>{
    if (err){
        console.log(err)
    }else {
        console.log(`Ok, server has been started on PORT: ${PORT}`)
    }
})