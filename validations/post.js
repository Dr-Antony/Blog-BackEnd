import { body } from "express-validator";

export const postCreateValidation = [
    body('title','Введите заголовок статьи').isLength({min:3}).isString(),
    body('text', 'Enter text of post').isLength({min:10}).isString(),
    body('tags', 'Format of tegs is not true').optional().isString(),
    body('imageUrl', 'Uncorrect link for image').optional().isString()
];

