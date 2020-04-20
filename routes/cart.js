const { Router } = require('express');
const router = new Router();

const Goods = require('../models/goods.js');

/** Отобразить список товаров корзины*/
router.get('/', async (req, res) => {
  const user = await req.user
  	.populate('cart.items.goodsId')
  	.execPopulate();

  	const cartList = user.cart.items.map(el => ({  ...el.goodsId._doc, count: el.count  }));
  	const price = cartList.reduce( (acc, el) => acc + el.count * el.price, 0);
  	const cartTotalCount = req.user.getTotalCount();

  	console.log('cartTotalCount', cartTotalCount);

  res.render('cart', {
  	title: 'Cart',
  	cartList,
  	price,
  	cartTotalCount
  });
});


/** Добавить товар в корзину*/
router.post('/add', async (req, res) => {
	const currentPage = req.headers.referer;
	const goodsItem = await Goods.findById(req.body.id);
	await req.user.addToCart(goodsItem)
	res.redirect(currentPage);
});


/** Удалить товар из корзину*/
router.post('/remove', async (req, res) => {
	const currentPage = req.headers.referer;
	await req.user.removeFromCart(req.body.id);
	res.redirect(currentPage);
});



module.exports = router;