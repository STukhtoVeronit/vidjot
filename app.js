const express = require('express');

const app = express();

// index route
app.get('/', (req, res) => {
	res.send('INDEX');
});
app.get('/about', (req, res) => {
	res.send('ABOUT');
});


const port = 3000;

app.listen(port, () => {
	console.log(`Server started on ${port}`);
});