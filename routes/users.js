const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Notes
// require('../models/user');
// const Users = mongoose.model('users');

//User login route
router.get('/login', (req, res) => {
	res.render('users/login');
});

//User login route
router.get('/register', (req, res) => {
	res.render('users/register');
});

//User login route
router.get('/login', (req, res) => {
	res.render('users/login');
});

//User login route
router.get('/register', (req, res) => {
	res.render('users/register');
});

module.exports = router;