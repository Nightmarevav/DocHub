
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

// const fs = require('fs');


// Дефолтная конфигурация dev-сервера
let config = {
	runtimeCompiler: true,
	devServer: {
		/*
        allowedHosts: [
            'dochub.rabota.space',
            'localhost'
        ],
        */
	},
	transpileDependencies: ['vueitfy'],
	configureWebpack: {
		optimization: {
			splitChunks: false 
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: 'plugin.html', 
				template: 'src/plugin.html', 
				inlineSource: '.(woff(2)?|ttf|eot|svg|js|css)$'
			}),
			new HtmlWebpackInlineSourcePlugin()
		]
	}    
};

// Подключает сертификаты, если они обнаружены
/*
if(fs.lstatSync(__dirname + '/certs').isDirectory()) {
    config.devServer = {
        http2: true,
        https: {
            key: fs.readFileSync(__dirname + '/certs/server.key'),
            cert: fs.readFileSync(__dirname + '/certs/server.cert')
        }
    }
}
*/
module.exports = config;
