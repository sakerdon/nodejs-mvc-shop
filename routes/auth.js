const { Router } = require('express');
const router = new Router();

const bcrypt = require('bcryptjs');

const User = require('../models/user');

// login
router.get('/login', (req, res) => {
  res.render('login', {
  	title: 'Login',
    errors: [],
    email: ''
  });
});

router.post('/login', async (req, res) => {

  try {
    const {email, password} = req.body;
    const tmp = await User.findOne({email});
    const errors = [];

    const isEqual = tmp ? await bcrypt.compare(password, tmp.password) : false;

    if (!tmp || !isEqual) {
      res.render('login', {
        title: 'Login',
        errors: ['Wrong email or password'],
        email
      });

    } else {
      req.session.user = tmp;
      req.session.isAuthenticated = true;
      req.session.save(err => {
        if (err) throw err;
        res.redirect('/');
      })
    } 
  } catch(err) {
    console.log(err);
  }
});

	


// register
router.get('/register', (req, res) => {
  res.render('register', {
  	title: 'Register',
    errors: [],
    email: ''
  });
});

router.post('/register', async (req, res) => {
	console.log(req.body);
  try {
    const {email, password, confirm} = req.body;
    const tmp = await User.findOne({email});

    const errors = [];

    const hashPassword = await bcrypt.hash(password, 10);

    if (password !== confirm) {
      errors.push('Confirm password is wrong');
    }

    if (tmp) {
      errors.push('Email already register');
    } 

    if (errors.length) {
      // res.locals.errors = ['123']
      // res.redirect('register');
      res.render('register', {
        title: 'Register',
        errors,
        email
      });
    } else {
      const user = new User({
        email, password: hashPassword, cart: {items: []}
      });

      await user.save();
      res.redirect('/auth/login');
    }

  } catch(err) {
    console.log(err);
  }

	// res.redirect('/');

});

// logout
router.get('/logout', (req, res) => {
  req.session.destroy( () => {
  	res.redirect('/auth/login');
  });
});


module.exports = router;