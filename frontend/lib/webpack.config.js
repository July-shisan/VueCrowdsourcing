const Banner = `
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.`,
    { BannerPlugin, ContextReplacementPlugin, DefinePlugin, ProgressPlugin } = require("webpack"),
    dev_mode = !global.packing,
    outputStyle = dev_mode ? "expanded" : "compressed",
    ESLintPlugin = require("eslint-webpack-plugin"),
    StyleLintPlugin = require("stylelint-webpack-plugin"),
    VueLoaderPlugin = require("vue-loader/lib/plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    { CleanWebpackPlugin } = require("clean-webpack-plugin"),
    { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer") // eslint-disable-line no-unused-vars

module.exports = {
    mode: dev_mode ? "development" : "production",
    devtool: dev_mode ? "cheap-module-source-map" : false,
    stats: "errors-warnings",
    entry: [
        "./source/entry.js",
        // "./source/chameleon/index.js",
        // "./source/products/index.js"
    ],
    output: {
        filename: "[chunkhash:8].[name].js",
        path: require("path").resolve(process.cwd(), "public"),
    },
    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            moment: dev_mode ? "moment" : "moment/src/moment",
            vue: dev_mode ? "vue/dist/vue.js" : "vue/dist/vue.min.js",
            "bootstrap.js": "bootstrap/dist/js/bootstrap.bundle.js",
        },
        fallback: {
            "debug": require.resolve("debug"),
            "buffer": require.resolve("buffer"),
            "stream": require.resolve("stream-browserify"),
        }
    },
    module: {
        rules: [ //
            {
                test: /\.(png|jpg|gif)$/,
                loader: "file-loader",
                options: {
                    publicPath: "/images",
                    outputPath: "images"
                }
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                loader: "file-loader",
                options: {
                    publicPath: "/fonts",
                    outputPath: "fonts"
                }
            },
            {
                test: /\.(s[ac]|c)ss$/,
                use: [dev_mode ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", {
                    loader: "sass-loader",
                    options: {
                        sourceMap: false,
                        sassOptions: { outputStyle }
                    }
                }]
            },
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                echarts: {
                    test: /node_modules\/(echarts|zrender)/,
                    chunks: "all",
                    priority: 10,
                    enforce: true,
                    name: "echarts"
                },
                depends: {
                    test: /node_modules/,
                    chunks: "all",
                    priority: 6,
                    enforce: true,
                    name: "depends"
                },
                chameleon: {
                    test: /(source\/chameleon)/,
                    chunks: "all",
                    enforce: true,
                    name: "chameleon"
                },
                products: {
                    test: /source\/products/,
                    chunks: "all",
                    enforce: true,
                    name: "products"
                }
            }
        }
    },
    plugins: [
        new ProgressPlugin(),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./source/favicon.ico" },
                {
                    from: "./source/assets",
                    to: "assets",
                    globOptions: {
                        ignore: [
                            "**/readme.md",
                            "**/models",
                        ],
                    },
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: "./source/index.tpl.html",
            filename: "index.html",
            minify: true
        }),
        new StyleLintPlugin({
            files: "source/**/*.{scss,vue}",
            lintDirtyModulesOnly: true,
            fix: true,
        }),
        new ESLintPlugin({
            files: "source/**/*.{js,vue}",
            lintDirtyModulesOnly: true,
            fix: true,
        }),
        new ContextReplacementPlugin(
            /moment[/\\]locale$/, /cn/
        ),
        new MiniCssExtractPlugin({
            filename: "css/[chunkhash:8].[name].css"
        }),
        new DefinePlugin({
            DevMode: JSON.stringify(dev_mode)
        }),
        new VueLoaderPlugin(),
        new BannerPlugin(Banner),
        // new BundleAnalyzerPlugin()
    ]
}
