const dotenv = require('dotenv-webpack');

module.exports = {
	entry   : [
		'./src/content.js',
		'./src/describe.js',
		'./src/utils.js',
		'./src/OCR.js'
	],
	plugins : [
		new dotenv()
	]
};