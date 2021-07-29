const express = require('express');
const passport = require('passport');
const router = express.Router();
const { auth: ctrl } = require('../../controllers');
const { createAccountLimiter } = require('../../helpers/rate-limit');
const useAuth = require('../../helpers/useAuth');
const { validateRegister, validateLogin } = require('../../validation/auth');

router.post('/register', createAccountLimiter, validateRegister, ctrl.register);

router.post('/login', validateLogin, ctrl.login);

router.post('/logout', useAuth, ctrl.logout);

router.get('/current', useAuth, ctrl.getCurrent);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['openid', 'profile', 'email'],
  })
);

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect(
    `https://books-reading-app.netlify.app/api/training?token=${req.user.token}&name=${req.user.name}&avatar=${req.user.avatar}&email=${req.user.email}`
  );
});

module.exports = router;
