const { Router } = require('express');
const router = new Router();

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
router.get('/:id/edit', async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}
    const goodsItem = await Goods.findById(req.params.id).lean();

	res.render('edit', {
        title: goodsItem.title,
        goodsItem
    });
});

/** Получить и вывести карточку товара*/
router.get('/:id', async (req, res) => {
    const goodsItem = await Goods.findById(req.params.id).lean();
    res.render('goodsCard', {
        title: goodsItem.title,
        goodsItem
    });
});

/** Изменить товар*/
router.post('/edit', async (req, res) => {
    const id = req.body.id;
    delete req.body.id;
    await Goods.findByIdAndUpdate(id, req.body).lean();
    res.redirect(`/goods/${id}`);
});

/** Удалить товар*/
router.post('/remove', async (req, res) => {
    await Goods.deleteOne({_id: req.body.id})/*.lean()*/;
    res.redirect(`/goods/`);
});


module.exports = router;