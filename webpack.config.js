const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pug = require('./webpack_config/pug');
const devserver = require('./webpack_config/devserver');
const css = require('./webpack_config/css');
const extractCSS = require('./webpack_config/css.extract');
const babel = require('./webpack_config/babel');
const images = require('./webpack_config/images');
const fonts = require('./webpack_config/fonts');

const PATHS = {
	source: path.join(__dirname, 'App/src'),
    build: path.join(__dirname, 'App/dist')
};

const _common = merge([
    {
		mode: 'production',
        entry: {
			'index': `${PATHS.source}/index.js`,
		},
        output: {
			path: PATHS.build,
			filename: '[name].js',		
			libraryTarget: 'umd',
			library: '[name]',
			umdNamedDefine: true,
			libraryExport: 'default'
		},
		optimization: {
			minimizer: [new UglifyJsPlugin({
				exclude: /\/custom/,
				uglifyOptions: {
					output: {
						comments: false,
					},
				},
			})],
			splitChunks: {
				cacheGroups: {
					commons: {
						minChunks: 2,
						name: 'common',
						chunks: 'all',
            			enforce: true
					}
				}
			}
		},
		externals: {
			jquery: '$'
		},
        plugins: [
			new HtmlWebpackPlugin({
				favicon: `${PATHS.source}/favicon.ico`,
				filename: 'index.html',
				chunks: ['index', 'common'],
				template: `${PATHS.source}/index.pug`,
			}),	
			
			new webpack.ProvidePlugin({
				$: 'jquery',	 
				jQuery: 'jquery',
				React: 'react',
				ReactDOM: 'react-dom',
				styled: 'styled-components'
			}),
		],
	},	
    pug(),
	images(),
	fonts(),
	babel()
]);


module.exports = (env, argv) => {
	if (argv.mode === 'production') {		
		return merge([
			_common,
			extractCSS()
		]);
	} 
	if (argv.mode === 'development') {
        return merge([
            _common,
            devserver(),
			css()
        ]);
    }
};

