let Helper = {
    'keyup': [],
    'keyup.escape': [],
    'window.resize': [],
    'reset.position': [],
    'mouse.move': false,
    'touch.move': false
}

export default {
    install(Vue, options) {
        let { VueHelper, WebShell } = options
        this.keyup(Vue, VueHelper)
        this.resize(Vue, WebShell)
        this.mousemove(Vue)
        Vue.directive('focus', {
            inserted: el => {
                el.focus()
            }
        })
    },
    keyup(Vue, VueHelper) {
        Vue.directive('keyup', {
            bind: (noop, binding) => setTimeout(noop => Helper['keyup'].push(binding.value)),
            unbind: noop => Helper['keyup'].pop()
        })
        Vue.directive('escape', {
            bind: (noop, binding) => setTimeout(noop => Helper['keyup.escape'].push(binding.value)),
            unbind: noop => Helper['keyup.escape'].pop()
        })
        addEventListener('keyup', e => {
            let store = Helper['keyup.escape'],
                [last] = store.slice(-1)
            e.keyCode != 27 || (VueHelper.FullScreen = false) || !last || last()
            Helper['keyup'].map(c => c(e))
        })
    },
    resize(Vue, WebShell) {
        let Timer
        Vue.directive('resize', {
            bind: (noop, binding) => setTimeout(noop => Helper['window.resize'].push(binding.value)),
            unbind: noop => Helper['window.resize'].pop()
        })
        addEventListener('resize', noop => {
            Timer = Timer || setTimeout(noop => {
                WebShell.resize()
                Helper['window.resize'].map(c => c())
                Helper['reset.position'].map(c => c())
                Timer = undefined
            }, 100)
        })
    },
    mousemove(Vue) {
        let Timer
        Vue.directive('moveable', {
            bind: el => {
                let handler = el.querySelector('.handler') || el.classList.contains('handler') && el || false
                if (handler) {
                    handler.addEventListener('contextmenu', e => e.preventDefault())
                    handler.addEventListener('mousedown', function(oe) {
                        let { x: ox = 0, y: oy = 0 } = el.offset || {}, ot = el.offsetTop
                        Helper['mouse.move'] = e => {
                            let x = e.x - oe.x + ox,
                                y = e.y - oe.y + oy
                            y = y < -ot ? -ot : y
                            el.style.transform = `translate(${x}px,${y}px)`
                            el.offset = { x, y }
                        }
                    })
                    handler.addEventListener('touchstart', function(oe) {
                        let { x: ox = 0, y: oy = 0 } = el.offset || {}, ot = el.offsetTop
                        let { pageX: px, pageY: py } = oe.changedTouches[0]
                        Helper['touch.move'] = e => {
                            let ee = e.changedTouches[0],
                                x = ee.pageX - px + ox,
                                y = ee.pageY - py + oy
                            y = y < -ot ? -ot : y
                            el.style.transform = `translate(${x}px,${y}px)`
                            el.offset = { x, y }
                        }
                    })
                    el.style.touchAction = 'none'
                    Helper['reset.position'].map(c => c())
                    Helper['reset.position'].push(noop => {
                        el.style.touchAction = 'auto'
                        el.style.transform = ''
                        el.offset = {}
                    })
                }
            },
            unbind: noop => Helper['reset.position'].pop()
        })
        addEventListener('mousemove', e => {
            Timer = Timer || setTimeout(noop => {
                Helper['mouse.move'] && Helper['mouse.move'](e)
                Timer = undefined
            }, 10)
        })
        addEventListener('touchmove', e => {
            Timer = Timer || setTimeout(noop => {
                Helper['touch.move'] && Helper['touch.move'](e)
                Timer = undefined
            }, 10)
        })
        addEventListener('mouseup', noop => (Helper['mouse.move'] = false))
        addEventListener('touchend', noop => (Helper['touch.move'] = false))
    }
}
