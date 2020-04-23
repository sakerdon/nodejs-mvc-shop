const { Router } = require('express');
const router = new Router();

const authMiddleware = require('../middleware/auth');

const { validationResult } = require('express-validator');
const { goodsValidator } = require('../utils/validator');


const Goods = require('../models/goods.js');

router.get('/', authMiddleware, (req, res) => {
    res.render('add', {
        title: 'Add new',
        errors: [],
        itemTitle: '',
        price: '',
        image: '',
    });
});

router.post('/', authMiddleware, goodsValidator, (req, res) => {

    const errors = validationResult(req).array();
    const {title, price, image} = req.body;

    if (errors.length) {
        return res.status(422).render('add', {
            title: 'Add new',
            errors, 
            itemTitle: title,
            price,
            image 
        });
    }
    const goods = new Goods({ ...req.body, userId: req.user });
    goods.save()
        .then(() => res.redirect('/goods'))
        .catch((err) => { throw err });


});


module.exports = router;