const { Router } = require('express');
const router = new Router();
url = require('url');

const Cart = require('../models/cart.js');
const Goods = require('../models/goods.js');


router.get('/', async (req, res) => {
  const cart = await Cart.fetch(); 

  res.render('cart', {
  	title: 'Cart',
  	cartList: cart.goods,
  	price: cart.price
  });
});

router.post('/add', async (req, res) => {
	const currentPage = req.headers.referer;
	const goods = new Goods({});
	const goodsItem = await goods.getById(req.body.id);
	Cart.add(goodsItem);
	res.redirect(currentPage);
});

router.post('/remove', async (req, res) => {
	const currentPage = req.headers.referer;
	// const goodsItem = await goods.getById(req.body.id);
	Cart.remove(req.body.id);
	res.redirect(currentPage);
});

module.exports = router;