import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import {registerValidation} from "./validations/auth.js";
import {validationResult} from "express-validator";
import UserModel from './models/User.js'

const PORT = 5000 || 5500
const app = express()
mongoose.connect("mongodb+srv://root:root@blogbase.kvwfw6h.mongodb.net/blog?retryWrites=true&w=majority&appName=BlogBase")
    .then ( () => console.log(`DB has been connected`))
        .catch((err) => {
            console.log(`DB error: ${err}`)
        })

app.use(express.json())

app.post('/auth/register', registerValidation, async (req, res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email:req.body.email,
            hashedPassword,
            name:req.body.name,
            secondName:req.body.secondName,
            userName:req.body.userName,
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id:user._id
            },
            'secretKey123',
            {
                expiresIn:'30d'
            }
        )
        res.json({
            ...user._doc,
            token
        })
    }catch (err){
        console.log(err)
        res.status(500).json({
            message:`Какие то проблемы с вашим ${Object.keys(err.keyValue)[0]}`
        })
    }

})

app.listen(PORT, (err) =>{
    if (err){
        console.log(err)
    }else {
        console.log(`Ok, server has been started on PORT: ${PORT}`)
    }
})