const { Router } = require('express');
const router = new Router();

const Goods = require('../models/goods.js');

router.get('/', (req, res) => {
  res.render('add', {
  	title: 'Add new'
  });
});

router.post('/', (req, res) => {
	const goods = new Goods(req.body);
	goods.save()
		.then(() => res.redirect('/goods'))
		.catch((err) => res.end(err));

});


module.exports = router;