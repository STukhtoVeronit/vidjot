const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const expSession = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const methodOverride = require ('method-override');

const {ensureAuthenticated} = require('./helpers/auth');


const app = express();

//Load routes
const notes = require('./routes/notes');
const users = require('./routes/users');

// Passports Config
require('./config/passport')(passport);

//Map global promise
// mongoose.Promise = global.Promise;

//Connect to mongoose
mongoose.connect('mongodb://localhost/noteted-dev',{ useNewUrlParser: true } )
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));



//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Method-parser middleware
app.use(methodOverride('_method'));

//Express Session middleware
app.use(expSession({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

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

// Use routes
app.use('/notes', ensureAuthenticated);
app.use('/notes', notes);
app.use('/users', users);

//server start
const port = 3000;

app.listen(port, () => {
	console.log(`Server started on ${port}`);
});