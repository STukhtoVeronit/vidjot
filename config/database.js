if (process.env.NODE_ENV === 'prodoction') {
	module.exports = { mongoURI: 'mongodb://stas:vironit1@ds249992.mlab.com:49992/noteted-prod'}
} else {
	// module.exports = { mongoURI: 'mongodb://stas:vironit1@ds249992.mlab.com:49992/noteted-prod'}
	module.exports = { mongoURI: 'mongodb://localhost/noteted-dev'}
}