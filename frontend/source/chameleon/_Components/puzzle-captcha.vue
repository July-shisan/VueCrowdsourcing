<template>
    <div class="canvas-wrapper">
        <canvas class="border rounded" />
    </div>
</template>
<script>
    class Puzzle {
        constructor(canvas, config, successCallback, failureCallback) {
            this.config = config
            this.canvas = canvas
            this.ctx = canvas.getContext('2d')
            if (Object.prototype.toString.call(successCallback) !== '[object Function]') {
                Object.assign(canvas, { width: 480, height: 80 })
                this.ctx.save()
                this.ctx.rect(0, 0, canvas.width, canvas.height)
                this.ctx.fillStyle = 'rgba(0,0,0,.7)'
                this.ctx.fill()
                this.ctx.font = '30px Verdana'
                this.ctx.fillStyle = 'white'
                this.ctx.textAlign = 'center'
                this.ctx.textBaseline = 'middle'
                this.ctx.fillText('请提供回调函数', 240, 40)
                this.ctx.restore()
                return
            }
            this.successCallback = successCallback
            this.failureCallback = failureCallback
            Object.assign(canvas, { width: 480, height: 360 })
            this.border = 60
            this.r = this.border / 8
            this.shadowBlur = 10
            this.rr = (v = 1) => Math.random() * v
            this.cut = noop => this.border + this.r * 2 + this.shadowBlur * 2
            this.isDragging = false
            this.failures = 0
            this.img = new Image()
            this.img.onload = this.imgload.bind(this)
            this.canvas.addEventListener('mousedown', e => {
                let { clientX: x, clientY: y } = e, { left: x0, top: y0 } = canvas.getBoundingClientRect(), [px, py] = this.position
                this.startPoint = [x, y]
                this.isDragging = this.piece(this.ctx, x - x0 - px, y - y0 - py)
                if (this.isDragging) {
                    this.canvas.style.cursor = 'move'
                }
            })
            this.canvas.addEventListener('mouseup', this.mouseup)
            this.canvas.addEventListener('mouseout', this.mouseup)
            this.canvas.addEventListener('touchend', this.touchend)
            this.canvas.addEventListener('mousemove', e => {
                if (!this.isDragging) {
                    return
                }
                let { clientX: x, clientY: y } = e
                this.movePoint = [x, y]
                this.repaint()
            })
            this.canvas.addEventListener('touchstart', e => {
                let { pageX: x, pageY: y } = e.changedTouches[0], { left: x0, top: y0 } = canvas.getBoundingClientRect(), [px, py] = this.position
                this.startPoint = [x, y]
                this.isDragging = this.piece(this.ctx, x - x0 - px, y - y0 - py)
            })
            this.canvas.addEventListener('touchmove', e => {
                if (!this.isDragging) {
                    return
                }
                let { pageX: x, pageY: y } = e.changedTouches[0]
                this.movePoint = [x, y]
                this.repaint()
            })
            this.loadimg()
        }
        get offset() {
            let { startPoint: [x0 = 0, y0 = 0] = [], movePoint: [x1 = 0, y1 = 0] = [], position: [x, y] } = this
            return [x + x1 - x0, y + y1 - y0]
        }
        get mouseup() {
            return noop => {
                if (!this.isDragging) {
                    return
                }
                this.canvas.style.cursor = 'default'
                this.isDragging = false
                let { shuffle: [x0, y0], offset: [x1, y1], movePoint } = this
                let result = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
                if (result <= 5) {
                    this.successCallback()
                } else if (movePoint) {
                    this.loadimg()
                }
            }
        }
        get touchend() {
            return noop => {
                if (!this.isDragging) {
                    return
                }
                this.isDragging = false
                let { shuffle: [x0, y0], offset: [x1, y1], movePoint } = this
                let result = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
                if (result <= 5) {
                    this.successCallback()
                } else if (movePoint) {
                    this.loadimg()
                }
            }
        }
        loadimg() {
            let id = this.rr(4).toFixed(0)
            this.img.src = `/assets/puzzle/cat${id}.jpg`
            this.inset = [this.rr() < .5, this.rr() < .5, this.rr() < .5, this.rr() < .5]
            this.position = [0, 265]
            this.startPoint = [0, 0]
            delete this.movePoint
            if (this.failures++ > 2) {
                this.failureCallback()
            }
        }
        imgload() {
            let { width, height } = this.img,
                x = this.rr(width - this.cut()),
                y = this.rr(height - this.cut())
            this.snap = document.createElement('canvas')
            this.snap.width = width
            this.snap.height = height
            this.shuffle = [x, y]
            let ptx = this.snap.getContext('2d')
            ptx.save()
            this.piece(ptx)
            ptx.translate(-x, -y)
            ptx.fillStyle = ptx.createPattern(this.img, 'repeat')
            ptx.fill()
            ptx.restore()
            this.repaint()
        }
        piece(ctx, x, y) {
            let PI = Math.PI,
                { border, r, inset, shadowBlur } = this
            ctx.save()
            ctx.translate(r + shadowBlur, r + shadowBlur)
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(border / 2 - r, 0)
            ctx.arc(border / 2, 0, r, PI, 2 * PI, inset[0])
            ctx.lineTo(border, 0)
            ctx.lineTo(border, border / 2 - r)
            ctx.arc(border, border / 2, r, -PI / 2, PI / 2, inset[1])
            ctx.lineTo(border, border)
            ctx.lineTo(border / 2 + r, border)
            ctx.arc(border / 2, border, r, 0, -PI, inset[2])
            ctx.lineTo(0, border)
            ctx.lineTo(0, border / 2 + r)
            ctx.arc(0, border / 2, r, PI / 2, PI * 1.5, inset[3])
            ctx.closePath()
            ctx.restore()
            if (x != undefined && y != undefined) {
                return ctx.isPointInPath(x, y)
            }
            ctx.shadowBlur = this.shadowBlur
            ctx.shadowColor = 'rgba(0,0,0,.5)'
        }
        clear() {
            let { width, height } = this.canvas
            this.ctx.clearRect(0, 0, width, height)
            this.ctx.save()
            this.ctx.rect(0, 0, width, height)
            this.ctx.fillStyle = 'rgba(0,0,0,.8)' // 背景色
            this.ctx.fill()
            this.ctx.restore()
            this.ctx.drawImage(this.img, 0, 0)
        }
        repaint() {
            this.clear()
            let [x, y] = this.shuffle,
                [ox, oy] = this.offset
            this.ctx.save()
            this.ctx.translate(x, y)
            this.piece(this.ctx)
            this.ctx.fillStyle = 'rgba(255,255,255,.8)'
            this.ctx.fill()
            this.ctx.restore()

            this.ctx.save()
            this.ctx.font = this.config.font
            this.ctx.fillStyle = 'white'
            this.ctx.textBaseline = 'middle'
            this.ctx.fillText(this.config.text, 100, 315)
            this.ctx.restore()

            this.ctx.save()
            this.ctx.translate(ox, oy)
            this.ctx.fillStyle = this.ctx.createPattern(this.snap, 'no-repeat')
            this.ctx.rect(0, 0, this.snap.width, this.snap.height)
            this.ctx.fill()
            this.ctx.restore()
        }
    }

    export default {
        name: 'Puzzle',
        props: {
            dismiss: {
                type: Function,
                required: true
            },
            Done: {
                type: Function,
                required: true
            }
        },
        mounted() {
            let config = i18n[this.lang]
            new Puzzle(this.$el.querySelector('canvas'), config, this.Done, this.dismiss)
        }
    }
    let i18n = {
        cn: {
            text: '将拼图移动到正确位置',
            font: '30px Verdana'
        },
        en: {
            text: 'Move the puzzle to the correct position',
            font: '18px Verdana'
        },
        jp: {
            text: 'パズルを正しい位置に移動します',
            font: '24px Verdana'
        }
    }
</script>
<style lang="scss">
    .canvas-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #0000;
        display: flex;
        align-items: center;
        justify-content: center;
        touch-action: none;
    }
</style>
