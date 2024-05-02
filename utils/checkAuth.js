import jwt from "jsonwebtoken";

export default (req, res, next) =>{
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'')

    if (token){
    try {
        const decodedToken = jwt.verify(token, 'secretKey123')

        req.userId = decodedToken._id

    }catch (err){

        return res.status(403).json({
            message:'У вас нет доступа'
        })
    }

    }else {
        return res.status(403).json({
            message:'У вас нет доступа'
        })
    }

    next()
}