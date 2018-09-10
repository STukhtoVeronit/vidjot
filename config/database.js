if (process.env.NODE_ENV === 'prodoction') {
	module.exports = { mongoURI: 'mongodb://<ted1969>:<17072018tsa>@ds249992.mlab.com:49992/noteted-prod'}
} else {
	module.exports = { mongoURI: 'mongodb://localhost/noteted-dev'}
}