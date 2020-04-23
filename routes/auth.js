const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

const {registerValidator, loginValidator} = require('../utils/validator');

const User = require('../models/user');

// login
router.get('/login', (req, res) => {
  res.render('login', {
  	title: 'Login',
    errors: [],
    email: ''
  });
});

router.post('/login', loginValidator, async (req, res) => {

  try {
    const {email, password} = req.body;
    const tmp = await User.findOne({email});
    const errors = validationResult(req).array();

    if (errors.length) {
      res.render('login', {
        title: 'Login',
        errors,
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

router.post('/register', registerValidator, async (req, res) => {
	console.log(req.body);
  try {
    const {email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const errors = validationResult(req).array();

    if (errors.length) {
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