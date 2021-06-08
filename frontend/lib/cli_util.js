const VERSION = "0.1.11",
    { program } = require("commander"),
    { exec } = require("child_process"),
    { log: consoleLog } = console

program.version(VERSION)
    .option("-p, --pack <server>", "打包页面文件 npm run pack https://chameleon.backend:8310")
    .parse(process.argv)
const actions = program.opts()
const linter = async function() {
    return new Promise((resolve, reject) => {
        exec("npm run lint", (error, data) => {
            if (error) {
                consoleLog("\n\x1b[31m" + data.replace(/>.*\s+/g, "").trim() + "\x1b[0m")
                consoleLog()
                consoleLog("\x1b[33m尝试 npx eslint source --fix 自动修复\x1b[0m")
                consoleLog()
                return reject()
            }
            resolve()
        })
    })
}
if (actions.pack) {
    global.packing = true
    consoleLog("\x1b[33mStart packing web pages ...\x1b[0m")
    const WebPack = require("webpack"),
        WebpackGzContent = require("compression-webpack-plugin"),
        WebpackConfig = require("./webpack.config.js")
    exec("git log --oneline -n1", async (err, data) => {
        try {
            await linter()
        } catch (error) {
            consoleLog("\x1b[33m编译失败\x1b[0m")
            process.exit(1)
        }
        WebpackConfig.plugins.push(new WebPack.DefinePlugin({
            Revision: JSON.stringify(err ? "----" : data.substr(0, 7)),
            AppServer: JSON.stringify(actions.pack.replace(/\/$/, ""))
        }))
        WebpackConfig.plugins.push(new WebpackGzContent({ test: /.(js|css|svg|json)$/, threshold: 5120 }))
        WebPack(WebpackConfig, (error, stats) => {
            if (error || stats.hasErrors()) {
                error ? consoleLog(error.stack) : stats.toJson().errors.forEach(consoleLog)
                consoleLog("Packing web pages failed ...")
                process.exit(1)
            }
            consoleLog("Finished packing web pages ...")
        })
    })
} else {
    consoleLog("Unsupport action")
    process.exit(1)
}
