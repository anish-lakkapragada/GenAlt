const dotenv = require('dotenv-webpack');
module.exports = {
  entry: ['./content.js', './describe.js'],
  plugins: [new dotenv()]
};
