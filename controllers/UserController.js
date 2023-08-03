import jwt from "jsonwebtoken";
import UserModel from "./../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { registerValidation } from "../validations/auth.js";





export const register = async (req, res) => {
    try {
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
};

export const login = async (req, res) => {
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
        if (user && isValidPassword) {
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
};

export const authMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (error) {
        return res.status(404).json({
            message: 'Пользователь не найден'
        })
    }
}