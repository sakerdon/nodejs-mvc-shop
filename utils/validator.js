const { body, validationResult } = require('express-validator/check');
const User = require('../models/user');
const bcrypt = require('bcryptjs');



/** Валидация полей добавления\редактирования товаров*/
exports.goodsValidator = [
    body('title')
    .isLength({ min: 1, max: 256 })
    .withMessage('Title length must be from 1 to 256 symbols')
    .trim(),

    body('price')
    .isNumeric()
    .withMessage('Pridce must be number')
    .trim(),

    body('image')
    .isURL()
    .withMessage('Image must be correct URL')
    .trim(),


];



/** Валидация полей login'a*/
exports.loginValidator = [
    body('email')
    // .isEmail()
    // .withMessage('Invalid email')
    .custom(async (value, { req }) => {
        try {
            const user = await User.findOne({ email: value });
            if (!user) return Promise.reject('Email or password is wrong');

        } catch (e) {
            console.log(e);
        }
    })
    .normalizeEmail(),

    body('password')
    .isLength({ min: 3, max: 33 })
    .custom(async (value, { req }) => {
        try {
            const tmp = await User.findOne({ email: req.body.email });
            const isEqual = tmp ? await bcrypt.compare(value, tmp.password) : false;
            if (tmp && !isEqual) return Promise.reject('Email or password is wrong');
            return true;

        } catch (e) {
            console.log(e);
        }
    })
    .trim(),
];

/** Валидация полей регистрации*/
exports.registerValidator = [
    body('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (value, { req }) => {
        try {
            const user = await User.findOne({ email: value });
            if (user) return Promise.reject('Email already registered');

        } catch (e) {
            console.log(e);
        }
    })
    .normalizeEmail(),

    body('password')
    .isLength({ min: 3, max: 33 })
    .withMessage('Password length must be from 3 to 33 symbols')
    .trim(),

    body('confirm')
    .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Confirmed password is wrong');
        return true;
    })
    .trim()
];