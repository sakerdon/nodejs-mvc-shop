const { Router } = require('express');
const router = new Router();

/** Модель товаров*/
const Goods = require('../models/goods');

/** Модель корзины*/
const Cart = require('../models/cart');

/** Получить и вывести список товаров*/
router.get('/', async (req, res) => {
    const goodsList = await new Goods({}).getAll();
    res.render('goods', {
        title: 'Goods',
        goodsList
    });
});

/** Получить и вывести форму редактирования товара*/
router.get('/:id/edit', async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}
    const goodsItem = await new Goods({}).getById(req.params.id);

	res.render('edit', {
        title: goodsItem.title,
        goodsItem
    });
});

/** Получить и вывести карточку товара*/
router.get('/:id', async (req, res) => {
    const goodsItem = await new Goods({}).getById(req.params.id);
    res.render('goodsCard', {
        title: goodsItem.title,
        goodsItem
    });
});

/** Изменить товар*/
router.post('/edit', async (req, res) => {
    await new Goods(req.body).update();
    res.redirect(`/goods/${req.body.id}`);
});


module.exports = router;