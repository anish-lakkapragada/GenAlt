const dotenv = require('dotenv-webpack');

module.exports = {
	entry   : [
		'./src/altify.js',
<<<<<<< HEAD
		'./src/utils.js'
=======
		'./src/describe.js',
		'./src/utils.js',
		'./src/OCR.js', 
		'./src/loadAzure.js'
>>>>>>> 652e9349404b8541006e626f9cc82987067f99aa
	],
	plugins : [
		new dotenv()
	]
};