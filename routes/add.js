const { Router } = require('express');
const router = new Router();

const authMiddleware = require('../middleware/auth');

const Goods = require('../models/goods.js');

router.get('/', authMiddleware, (req, res) => {
  res.render('add', {
  	title: 'Add new',
  });
});

router.post('/', authMiddleware, (req, res) => {
	const goods = new Goods({...req.body, userId: req.user});

	goods.save()
		.then(() => res.redirect('/goods'))
		.catch((err) => {throw err});

});


module.exports = router;