
const express = require('express');

const router = express.Router();

const passport = require('passport');
const UsersController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication,UsersController.profile);

router.post('/update/:id',passport.checkAuthentication,UsersController.update);

router.get('/sign-up',UsersController.signUp);

router.get('/sign-in',UsersController.signIn);

router.post('/create',UsersController.create);

//router.post('/create-session',UsersController.createSession);
//use passport as a middleware to authenticate

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
),UsersController.createSession);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect: '/users/sign-in'}),UsersController.createSession);
router.get('/sign-out',UsersController.deleteSession);

module.exports = router;