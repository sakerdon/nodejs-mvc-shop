const { Router } = require('express');
const router = new Router();
const User = require('../models/user');


const authMiddleware = require('../middleware/auth');

// const { validationResult } = require('express-validator');
// const { goodsValidator } = require('../utils/validator');

router.get('/', authMiddleware, (req, res) => {
    res.render('profile', {
        title: 'Profile',
        errors: [],
        user: req.user.toObject() 
    });
});


router.post('/', authMiddleware, async (req, res) => {

    try {
        const user = await User.findById(req.user._id);
        const avatarUrl = req.file ? req.file.path : '';
        user.avatarUrl = avatarUrl;
        await user.save();

        res.render('profile', {
            title: 'Profile',
            errors: [],
            user: user.toObject()
        });

    } catch(err) {
        console.log(err);
    }
});


module.exports = router;