const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

// models
// const Cart = require('./models/cart');
const User = require('./models/user');

// routes
const homeRoute = require('./routes/home');
const goodsRoute = require('./routes/goods');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');

const PORT = process.env.PORT || 3000;

const app = express();


/** Midlleware, обрабатывающий все что связано с User*/
app.use( async (req, res, next) => {
  try {
    const user = await User.findById('5e970082836b900ee41105aa');
    req.user = user;

    const hbs = exphbs.create({
      defaultLayout: 'main',
      extname: 'hbs',
      helpers: {
            totalCount: () => {
              return user.getTotalCount();
            }, 
            formatDate: (date) => {
              return new Intl.DateTimeFormat('en', {
                  day: '2-digit',
                  weekday: 'short',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
              }).format(new Date(date))
            }
      }
    });

    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.set('views', 'views');

    next();
  } catch(err) {
    console.log(err);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoute);
app.use('/goods', goodsRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);




(async function() {
  const url = 'mongodb+srv://admin:123@cluster0-bwtei.mongodb.net/shop';
  try {
    await mongoose.connect(url, {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: true});
    console.log('Connected to db');

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'admin',
        name: 'admin',
        cart: {items: []}   
      })
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  } catch(err) {
    throw err
  }
})();



