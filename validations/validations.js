import {body} from "express-validator";

export const registerValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'слишком короткий пароль, минимум 6 символов').isLength({min: 6}),
    body('name', 'Слишком короткое имя, минимум 2 символа').isLength({min: 2}),
    body('secondName', 'Минимум 2 символа').isLength({min: 2}),
    body('userName', 'Минимум 3 символа').isLength({min: 3}),
    body('avatarURL', 'Неверный url адресс').optional().isURL(),
]
export const loginValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'слишком короткий пароль, минимум 6 символов').isLength({min: 6}),
]
export const postCreateValidation = [
    body('title', 'Введённый заголовок либо отсутствует, либо слишком короткий.').isLength({min:3}).isString(),
    body('text', 'Введённый текст либо отсутствует, либо слишком короткий.').isLength({min:3}).isString(),
    body('tag', 'Неверный формат тэгов.').optional().isString(),
    body('imageURL', 'Неверный url изображения').optional().isString(),


]