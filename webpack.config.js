const dotenv = require('dotenv-webpack');

module.exports = {
	entry   : [
		'./src/altify.js',
		'./src/utils.js'
	],
	plugins : [
		new dotenv()
	]
};