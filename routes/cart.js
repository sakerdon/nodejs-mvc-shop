const { Router } = require('express');
const router = new Router();
const Goods = require('../models/goods.js');

const authMiddleware = require('../middleware/auth');


/** Отобразить список товаров корзины*/
router.get('/', authMiddleware, async (req, res) => {
  const user = await req.user
  	.populate('cart.items.goodsId')
  	.execPopulate();

  	const cartList = user.cart.items.map(el => ({  ...el.goodsId._doc, count: el.count  }));
  	const price = cartList.reduce( (acc, el) => acc + el.count * el.price, 0);
  	const cartTotalCount = req.user.getTotalCount();

  res.render('cart', {
  	title: 'Cart',
  	cartList,
  	price,
  	cartTotalCount
  });
});


/** Добавить товар в корзину*/
router.post('/add', authMiddleware, async (req, res) => {
	const currentPage = req.headers.referer;
	const goodsItem = await Goods.findById(req.body.id);
	await req.user.addToCart(goodsItem)
	res.redirect(currentPage);
});


/** Удалить товар из корзину*/
router.post('/remove', authMiddleware, async (req, res) => {
	const currentPage = req.headers.referer;
	await req.user.removeFromCart(req.body.id);
	res.redirect(currentPage);
});



module.exports = router;