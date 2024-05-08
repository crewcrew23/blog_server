import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import PostModel from '../models/Post.js'
import jwt from "jsonwebtoken";


export const register = async (req, res)=>{
    try {
    //    handleValidationErrors()

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email:req.body.email,
            hashedPassword:hash,
            name:req.body.name,
            secondName:req.body.secondName,
            userName:req.body.userName,
            avatarURL:req.body.avatarURL
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

        const {hashedPassword, ...userData} = user._doc

        res.status(201).json({
            ...userData,
            token
        })
    }catch (err){
        console.log(err)
        res.status(500).json({
            message:`Такой ${Object.keys(err.keyValue)[0]} уже существует`
        })
    }

}

export const login = async (req, res)=>{
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if (!user){
            return res.status(401).json({
                message:'Неверный логин или пароль',
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.hashedPassword)

        if (!isValidPassword){
            return res.status(401).json({
                message:'Неверный логин или пароль',
            })
        }

        const token = jwt.sign(
            {
                _id:user._id
            },
            'secretKey123',
            {
                expiresIn:'30d'
            }
        )

        const {hashedPassword, ...userData} = user._doc

        res.status(200).json({
            ...userData,
            token
        })

    }catch (err){
        console.log(err)
        res.status(500).json({
            message:"Неудалось авторизоватся",
            error:err
        })
    }
}

export const profile = async (req, res) =>{
    try {
        const user = await UserModel.findById(req.userId)

        if (!user){
            return  res.status(404).json({
                message:'Пользователь не найден'
            })
        }

        const {hashedPassword, ...userData} = user._doc

        res.status(201).json(userData)

    }catch (err){
        console.log(err)
        res.json(err)
    }
}

export const getUser = async (req, res) =>{
    try{
        const {user} = await PostModel.findById(req.params.id)
        const returnedUser = await UserModel.findById(user)
        const {hashedPassword, ...userData} = returnedUser._doc
        res.status(200).json(userData)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}