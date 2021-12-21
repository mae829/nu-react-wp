const path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: {
		'program-finder': ['url-polyfill', 'whatwg-fetch', '@babel/polyfill', './src/js/program-finder.js'],
		'locations': ['url-polyfill', 'whatwg-fetch', '@babel/polyfill', './src/js/locations.js'],
		'search': './src/js/search.js',
		'wp-customizer': './src/js/wp-customizer.js',
		'wp-customizer-checkbox-control': './src/js/wp-customizer-checkbox-control.js',
	},
	externals: {
		jquery: 'jQuery'
	},
	output: {
		filename: '[name].min.js',
		path: path.resolve( './build' )
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			}
		]
	}
};
