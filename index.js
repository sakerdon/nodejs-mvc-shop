const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');


const Cart = require('./models/cart');

// routes
const homeRoute = require('./routes/home');
const goodsRoute = require('./routes/goods');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
        totalCount: () => {
        	const count = Cart.totalCount();
        	console.log('count', count);
        	return count;
        }
  }
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoute);
app.use('/goods', goodsRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});