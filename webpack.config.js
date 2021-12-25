const dotenv = require('dotenv-webpack');
module.exports = {
	entry   : [
		'./content.js',
		'./describe.js',
		'./utils.js'
	],
	plugins : [
		new dotenv()
	]
};
