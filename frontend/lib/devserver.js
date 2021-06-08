process.on("uncaughtException", error => {
    screen("\n\x1b[41;38m %s \x1b[0m", error)
    process.exit()
})
const identifier = "Webpack Dev Server",
    { log: screen, clear } = console,
    app = require("express")(),
    WebPack = require("webpack"),
    { chameleonServer, host, port } = require("./devserver.json"),
    { entry, plugins, ...config } = require("./webpack.config.js")
clear()
screen("%s Started. running at http://%s:%s", identifier, host, port)
screen("Press Ctrl-C to terminate the process\n")
const compiler = WebPack({
        entry: ["webpack-hot-middleware/client", ...entry],
        plugins: [
            ...plugins,
            new WebPack.DefinePlugin({ Revision: "'DevVersion'" }),
            new WebPack.DefinePlugin({ AppServer: JSON.stringify(chameleonServer) }),
            new WebPack.HotModuleReplacementPlugin()
        ],
        ...config,
    }),
    history = require("connect-history-api-fallback")(),
    devMiddleware = require("webpack-dev-middleware")(compiler),
    hotMiddleware = require("webpack-hot-middleware")(compiler)
app.use(history).use(devMiddleware).use(hotMiddleware).listen(port, host)
