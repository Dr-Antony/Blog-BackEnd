import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";


import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";

import checkAuth from "./utils/checkAuth.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

import { register, login, authMe } from "./controllers/userController.js";
import { createPost, getAll, getOne, removePost, updatePost,getLastTags } from "./controllers/PostController.js";





mongoose.connect('mongodb+srv://admin:12345@cluster0.aebkplr.mongodb.net/blog?').then(() => { console.log('DB has been connected!') }).catch((err) => { console.log(err) })

const app = express();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage });

app.use(express.json());//Это необходимо чтобы приложение express могло читать json.
app.use(cors());

app.use('/uploads', express.static('uploads'));



app.get('/auth/me', checkAuth, authMe);
app.post('/auth/login', loginValidation, handleValidationErrors, login);
app.post('/auth/register', registerValidation, handleValidationErrors, register);



app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.delete('/posts/:id', checkAuth, postCreateValidation, removePost);
app.patch('/posts/:id', checkAuth, postCreateValidation, updatePost);
app.post('/posts', checkAuth, postCreateValidation, createPost);

app.get('/tags', getLastTags);
app.get('/posts/tags', getLastTags);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.listen(3000, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server has been started!');
});