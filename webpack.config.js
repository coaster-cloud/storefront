let Encore = require('@symfony/webpack-encore');
let HtmlTemplatePlugin = require('./webpack/HtmlTemplatePlugin')

Encore
    .setOutputPath('public/')
    .setPublicPath('/')
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableSassLoader()
    .cleanupOutputBeforeBuild()
    .enableVueLoader((options) => {}, {runtimeCompilerBuild: false})
    .enableVersioning()
    .disableSingleRuntimeChunk()
    .addRule({parser: {amd: false}})
    .addLoader({test: /\.(graphql|gql)$/, exclude: /node_modules/, loader: 'raw-loader'})
    .addLoader({test: /\.ya?ml$/, type: 'json', loader: 'yaml-loader'})
    .configureUrlLoader({images: {limit: false, esModule: false}})
    .addEntry('app', './src/app.js')
    .configureBabel(function (babelConfig) {
        babelConfig.plugins.push('@babel/plugin-proposal-class-properties');
        babelConfig.plugins.push('@babel/plugin-transform-runtime');
    }, {
        includeNodeModules: ['vue-echarts', 'resize-detector'],
    })
    .addPlugin(new HtmlTemplatePlugin())
;

module.exports = Encore.getWebpackConfig();
