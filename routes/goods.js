const { Router } = require('express');
const router = new Router();

const authMiddleware = require('../middleware/auth');

const { validationResult } = require('express-validator');
const { goodsValidator } = require('../utils/validator');


/** Модель товаров*/
const Goods = require('../models/goods');

/** Модель корзины*/
// const Cart = require('../models/cart');

/** Получить и вывести список товаров*/
router.get('/', async (req, res) => {
    const goodsList = await Goods.find({}).lean();

    console.log('goodsList', goodsList);
    res.render('goods', {
        title: 'Goods',
        goodsList
    });
});

/** Получить и вывести форму редактирования товара*/
router.get('/:id/edit', authMiddleware, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}

    const goodsItem = await Goods.findById(req.params.id).lean();

	res.render('edit', {
        title: goodsItem.title,
        goodsItem
    });
});

/** Изменить товар*/
router.post('/edit', authMiddleware, goodsValidator, async (req, res) => {
    const id = req.body.id;
    const goodsItem = await Goods.findById(id).lean();

    const errors = validationResult(req).array();
    const {title, price, image} = req.body;

    if (errors.length) {
        goodsItem.title = title;
        return res.status(422).render('edit', {
            title: goodsItem.title,
            goodsItem,
            errors, 
            itemTitle: title,
            price,
            image
        });
    }

    delete req.body.id;
    await Goods.findByIdAndUpdate(id, req.body).lean();
    res.redirect(`/goods/${id}`);
});

/** Получить и вывести карточку товара*/
router.get('/:id', async (req, res) => {
    const goodsItem = await Goods.findById(req.params.id).lean();
    res.render('goodsCard', {
        title: goodsItem.title,
        goodsItem
    });
});


/** Удалить товар*/
router.post('/remove', authMiddleware, async (req, res) => {
    await Goods.deleteOne({_id: req.body.id})/*.lean()*/;
    res.redirect(`/goods/`);
});


module.exports = router;