const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load Notes
require('../models/Note');
const Notes = mongoose.model('notes');

//Add notes form
router.get('/add',ensureAuthenticated, (req, res) => {
	res.render('notes/add');
});

//edit notes form
router.get('/edit/:id', (req, res) => {
	Notes.findOne({
			_id: req.params.id
		})
		.then(note => {
			if (note.user !== req.user.id){
				req.flash('error_msg', 'You don\'t have access to this note or that note does not exist');
				res.redirect('/notes');
			} else {
				res.render('notes/edit', {
					note
				});
			}

		})
		.catch(err => {
			req.flash('error_msg', 'You don\'t have access to this note or that note does not exist');
			res.redirect('/notes');
		});
});

//notes route
router.get('/',ensureAuthenticated, (req, res) => {
	Notes.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(notes => {
			res.render('notes/index', {
				notes
			});
		})
		.catch(error => console.log(error));
});

//notes process form
router.post('/',ensureAuthenticated, (req, res) => {

	let errors = [];

	if (!req.body.title){
		errors.push({text: 'Please add a title'});
	}
	if (!req.body.details){
		errors.push({text: 'Please add some details'});
	}
	if (errors.length){
		res.render('notes/add', {
			errors,
			tittle: req.body.title,
			details: req.body.details
		});
	} else {

		const newNote = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		};
		const note = new Notes(newNote);
		note.save()
			.then(note => {
				req.flash('success_msg', 'Ted note create');
				res.redirect('/notes');
			})
			.catch(err => console.log(err));
	}
});

// Edit form process
router.put('/:id',ensureAuthenticated, (req, res) => {
	Notes.findOne({
			_id: req.params.id
		})
		.then(note => {

			note.title = req.body.title;
			note.details = req.body.details;
			note.save()
				.then(note => {
					res.redirect('/notes');
				})
		})
		.catch(err => console.log(err));
});

// Delete Note
router.delete('/:id',ensureAuthenticated, (req, res) => {
	Notes.deleteOne({_id: req.params.id})
		.then(() => {
			req.flash('success_msg', 'Ted note removed');
			res.redirect('/notes');
		});
});


module.exports = router;
