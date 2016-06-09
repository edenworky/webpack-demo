const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCssPlugin = require('purifycss-webpack-plugin');

module.exports = {
    devServer: devServer,
    setupCss: setupCss,
    minify: minify,
    setFreeVariable: setFreeVariable,
    extractBundle: extractBundle,
    extractCss: extractCss,
    purifyCss: purifyCss,
    clean: clean
}

function devServer(options) {
    return {
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            stats: 'errors-only',
 
            host: options.host,
            port: options.port
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin({
                multiStep: true
            })
        ]
    };
};

function setupCss(paths) {
    console.log(paths);
    return {
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css'],
                    include: paths
                }
            ]
        }
    }
};

function minify() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                },
                mangle: {
                    props: /matching_props/,
                    except: [
                        'Array', 'BigInteger', 'Boolean', 'Buffer'
                    ]
                }
            })
        ]
    }
};

function setFreeVariable(key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    }
}

function extractBundle(options) {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        entry: entry,
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest'],
                minChunks: Infinity
            })
        ]
    }
}

function extractCss(paths) {
    return {
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css'),
                    include: paths
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('[name].[chunkhash].css')
        ]
    }
}

function purifyCss(paths) {
    return {
        plugins: [
            new PurifyCssPlugin({
                basePath: process.cwd(),
                paths: paths
            })
        ]
    }
}

function clean(path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                root: process.cwd()
            })
        ]
    }
}
