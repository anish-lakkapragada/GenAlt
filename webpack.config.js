const dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = (env, options) => {
	const config = {
		entry:{
			altify: './src/altify.js',
			background: './src/background.js',
		}, 
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].bundle.js',
			publicPath: '/dist/'
		},
		plugins: [
			new dotenv()
		]
	}

	return config; 
}