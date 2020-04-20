const { Router } = require('express');
const router = new Router();

const Order = require('../models/order.js');

router.get('/', async (req, res) => {
    try {

        const orders = await Order.find({'user.userId': req.user._id})
        	.lean().populate('user.userId')

        res.render('order', {
            title: 'Order',
            // orders: JSON.stringify(orders)
            orders: /*JSON.stringify(*/orders.map(el => ({
            	...el,
            	price: el.goods.reduce((acc, g) => acc + g.goodsItem.price * g.count, 0)
            }))/*)*/
        });

    } catch (err) {
        console.log(err);
    }

});

router.post('/', async (req, res) => {
    try {

        const user = await req.user
            .populate('cart.items.goodsId')
            .execPopulate();

        const goods = user.cart.items.map(el => ({
            count: el.count,
            goodsItem: { ...el.goodsId._doc }
        }));

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            goods
        })

        await order.save();
        await req.user.clearCart();

        res.redirect('/order');

    } catch (err) {
        console.log(err);
    }
});


module.exports = router;