const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require ('method-override');

const app = express();

//Map global promise
// mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost/noteted-dev',{ useNewUrlParser: true } )
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));

//Load ideas
require('./models/note');
const Notes = mongoose.model('notes');

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method-parser middleware
app.use(methodOverride('_method'));

// index route
app.get('/', (req, res) => {
	const title = "Welcome";

	res.render('index', {
		title
	});
});

//About router
app.get('/about', (req, res) => {
	res.render('about');
});

//Add notes form
app.get('/notes/add', (req, res) => {
	res.render('notes/add');
});

//edit notes form
app.get('/notes/edit/:id', (req, res) => {
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
app.get('/notes', (req, res) => {
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
app.post('/notes', (req, res) => {

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
				res.redirect('/notes');
			})
			.catch(err => console.log(err));
	}
});

// Edit form process
app.put('/notes/:id', (req, res) => {
	Notes.findOne({
		_id: req.params.id
	})
		.then(note => {
			note.tittle = req.body.title;
			note.details = req.body.details;

			note.save()
				.then(note => {
					res.redirect('/notes');
				})
		})
		.catch(err => console.log(err));
});

// Delete Note
app.delete('/notes/:id', (req, res) => {
	Notes.remove({_id: req.params.id})
		.then(() => {
			res.redirect('/ideas');
		});
});
//server start
const port = 3000;

app.listen(port, () => {
	console.log(`Server started on ${port}`);
});