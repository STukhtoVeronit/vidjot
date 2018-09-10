const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load Notes
require('../models/User');
const Users = mongoose.model('users');

//User login route
router.get('/login', (req, res) => {
	res.render('users/login');
});

//User login route
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logout.')
	res.redirect('/users/login');
});

//User login route
router.post('/login', (req, res, next) => {

	passport.authenticate('local', {
		successRedirect: '/notes',
		failureRedirect: '/users/register',
		failureFlash: true
	})(req, res, next);
});

//User login route
router.get('/register', (req, res) => {
	res.render('users/register');
});

//User login route
router.post('/register', (req, res) => {
	let errors = [];
	
	if (req.body.password !== req.body.password2){
		errors.push({text:'Password do not match'});
	}

	if(req.body.password.length < 4){
		errors.push({text: 'Password should be at least 4 characters.'});
	}

	if (errors.length > 0){
		res.render('users/register',{
			errors: errors,
			name: req.body.name,
			email: req.body.email
		});
	} else {
		const newUser = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
		};

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {

				if (err) {

					res.render('users/register',{
						errors: {text: err},
						name: req.body.name,
						email: req.body.email
					});

				} else {

					Users.findOne({email: newUser.email})
						.then( user => {
							if (user) {
								req.flash('error_msg', `Email already registered`);
								res.redirect('/users/register');
							} else {
								newUser.password = hash;
								const user = new Users(newUser);
								user.save()
									.then(user => {
										req.flash('success_msg', "You are registered now");
										res.redirect('/users/login');
									});
							}
						})
						.catch(err => {
							req.flash('error_msg', `There is some issue: ${err}`);
							res.redirect('/users/register');
						});
				}
			});
		});
	}
});

module.exports = router;