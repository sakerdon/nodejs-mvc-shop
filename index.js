require('dotenv').config();
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const helmet = require('helmet');


// custom middlewares
const variablesMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const page404Middleware = require('./middleware/error404')
const fileMiddleware = require('./middleware/file')

// models
const User = require('./models/user');

// routes
const homeRoute = require('./routes/home');
const goodsRoute = require('./routes/goods');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(helmet());



/** Устанавливаем сессию*/
const sessionStore = new SessionStore({
  collection: 'sessions',
  uri: MONGODB_URL
})
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use(fileMiddleware.single('avatar')); // Важно подключить до csrf

/** Защита от CSRF*/
app.use(csrf());


/** Кастомные middleware*/
app.use(variablesMiddleware);
app.use(userMiddleware);


/** Регистрация Handlebars*/
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
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


/** middlewares контроллеров*/
app.use('/', homeRoute);
app.use('/goods', goodsRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use(page404Middleware);


/** Попытка подключиться к базе до того как будет запущен сервер*/
(async function() {
  try {
    await mongoose.connect(MONGODB_URL, {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: true});
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



