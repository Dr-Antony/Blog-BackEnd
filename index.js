import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";

import bcrypt from "bcrypt"

mongoose.connect('mongodb+srv://admin:12345@cluster0.aebkplr.mongodb.net/blog?retryWrites=true&w=majority').then(() => { console.log('DB has been connected!') }).catch((err) => { console.log(err) })

const app = express();
app.use(express.json());//Это необходимо чтобы приложение express могло читать json.

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return req.status(404).json({
                message: 'User with this login was not found!'
            })
        };
        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPassword) {
            return res.status(404).json({
                message: 'User with this password was not found!'
            })
        };
        if (user&&isValidPassword) {
            console.log(`Авторизация прошла успешно, ваше имя: ${user._doc.fullName}`)
        }
        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {
            expiresIn: '30d'
        });
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to Login'
        });
    }
})








app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        };
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });
        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {
            expiresIn: '30d'
        });
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to register'
        });
    }
});

app.listen(3000, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server has been started!');
});