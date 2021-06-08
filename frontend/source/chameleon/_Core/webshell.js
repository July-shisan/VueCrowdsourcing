import { FitAddon } from 'xterm-addon-fit'
import { Terminal } from 'xterm'

class ShellHelper {
    constructor() {
        this.ttys = []
        this.connected = 0
        this.Opening = false
        this.activeTTY = false
        this.lastTTY = false
        this.enabled = false
        return this
    }
    inject(options) {
        ['Server', 'Observe', 'mrand', 'enabled'].map(name => {
            name in options && (this[name] = options[name])
        })
        this.Observe(this)
    }
    onData(params) {
        const [id, ...args] = (Helper.Server.Meta.decode(params) || {}).webshell || []
        let [tty] = this.ttys.filter(tty => tty.id == id)
        tty && tty.onData(...args)
    }
    resize() {
        this.ttys.map(tty => tty.state == 2 && tty.helper.fit())
    }
    destroy() {
        this.ttys.map(tty => tty.destroy())
        this.connected = 0
    }
    wrapper() {
        return document.querySelector('#term-wrapper .term-manager')
    }
    newTTY(server) {
        if (!this.enabled) {
            this.wrapper().innerHTML = '<div class="text-danger text-center mt-5 display-1">Feature Disabled!</div>'
            return
        }
        let id = this.mrand(36, -10),
            tty = new WebShell(id, server)
        tty.next = false
        tty.prev = this.lastTTY
        this.lastTTY && (this.lastTTY.next = tty)
        this.lastTTY = tty
        this.ttys.push(tty)
        this.connected = this.ttys.length
        tty.active()
        tty.step = 0
        animationTo(noop => (tty.progress = tty.state > 1 ? '' : '[' + ' '.repeat((tty.step %= 60) >= 30 ? 60 - tty.step++ : tty.step++).concat('...').padEnd(33, ' ') + ']'))
    }
}

let Helper = new ShellHelper()
class WebShell {
    constructor(id, { host, port, username, password }) {
        this.id = id
        this.host = host
        this.username = username
        this.manager = false
        this.ShowHidden = 0
        this.state = 1 //["未连接", "连接中", "已连接", "连接失败"]
        this.dir = ''
        this.files = []
        this.fsinfo = ''
        this.reason = ''
        this.progress = ''
        Helper.Observe(this)
        this.helper = new FitAddon()
        let term = new Terminal(),
            { cols, rows } = term
        term.loadAddon(this.helper)
        term.setOption('cursorBlink', true)
        term.setOption('allowTransparency', true)
        term.setOption('theme', { background: '#0000' })
        term.open(Helper.wrapper())
        term.onResize(data => this.emit('resize', data))
        term.onData(data => this.emit('data', data))
        this.emit('newTTY', { cols, rows, host, port, username, password })
        this.term = term
        addEventListener('beforeunload', noop => this.destroy(), { once: true })
        return this
    }
    emit(action, ...args) {
        this.state == 3 || Helper.Server.fire('webshell', { webshell: [this.id, action, ...args] }, Helper.onData)
    }
    active() {
        this.term.focus()
        Helper.activeTTY = this
        Helper.ttys.map(({ id, term }) => term.element.classList[this.id == id ? 'add' : 'remove']('active'))
    }
    preUpload(cb) {
        this.fsinfo = ''
        this.PreCheckCb = cb
        this.emit('upcheck')
    }
    onData(action, data) {
        if (['banner', 'data'].includes(action)) {
            this.term.write(data)
        } else if (action == 'ready') {
            this.state = 2
            this.reason = data || ''
            this.helper.fit()
        } else if (action == 'error') {
            this.state = 3
            this.reason = data
            this.helper.fit()
            this.term.setOption('cursorBlink', false)
        } else if (action == 'list') {
            Object.assign(this, data)
        } else if (action == 'download') {
            Helper.Server.download(data)
        } else if (action == 'fsinfo') {
            this.fsinfo = data
        } else if (action == 'upcheck') {
            if (data !== false) {
                this.fsinfo = data
            } else {
                this.PreCheckCb()
            }
        } else if (action == 'close') {
            this.destroy()
            this.state = 0
        }
    }
    destroy() {
        Helper.ttys = Helper.ttys.filter(tty => tty.id != this.id)
        this.emit('close')
        this.term.element.remove()
        let { prev, next } = this
        Helper.activeTTY = next || prev
        Helper.activeTTY && Helper.activeTTY.active()
        prev && (prev.next = next)
        next && (next.prev = prev)
        if (Helper.lastTTY.id == this.id) {
            Helper.lastTTY = prev
        } else if (Helper.lastTTY.id == next && next.id) {
            Helper.lastTTY.prev = prev
        }
        Helper.connected = Helper.ttys.length
        Helper.Opening = Helper.connected
    }
}
export default Helper
