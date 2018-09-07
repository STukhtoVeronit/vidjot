const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Load Notes
require('../models/Note');
const Notes = mongoose.model('notes');

//Add notes form
router.get('/add', (req, res) => {
	res.render('notes/add');
});

//edit notes form
router.get('/edit/:id', (req, res) => {
	Notes.findOne({
			_id: req.params.id
		})
		.then(note => {

			res.render('notes/edit', {
				note
			});

		})
		.catch(err => console.log(err));
});

//notes route
router.get('/', (req, res) => {
	Notes.find({})
		.sort({date: 'desc'})
		.then(notes => {
			res.render('notes/index', {
				notes
			});
		})
		.catch(error => console.log(error));
});

//notes process form
router.post('/', (req, res) => {

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
			details: req.body.details
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
	Notes.deleteOne({_id: req.params.id})
		.then(() => {
			req.flash('success_msg', 'Ted note removed');
			res.redirect('/notes');
		});
});


module.exports = router;
