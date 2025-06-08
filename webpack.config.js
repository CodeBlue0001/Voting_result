// webpack.config.js
const path = require('path');

module.exports = {
  entry: './Election_Result_server.js', // your server entry point
  target: 'node', // important for backend apps
  mode: 'production', // or 'development'
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js'
  }
};
