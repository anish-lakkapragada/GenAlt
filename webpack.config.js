const dotenv = require('dotenv-webpack');

module.exports = {
	entry   : [
		'./src/altify.js',
		'./src/describe.js',
		'./src/utils.js',
		'./src/OCR.js', 
		'./src/loadAzure.js'
	],
	plugins : [
		new dotenv()
	]
};