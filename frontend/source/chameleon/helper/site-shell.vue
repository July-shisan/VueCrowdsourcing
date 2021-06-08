<template>
    <div id="term-wrapper" :class="{hibernate:!WebShell.Opening}">
        <nav>
            <a v-for="tty in ttys" :key="tty.id" :class="{active:tty.id==active.id}" @click="tty.active()">
                <i :class="tty.state|icon" /> {{tty.username}}@{{tty.host}}
                <small @click.stop="tty.destroy()">&times;</small>
            </a>
            <a class="px-3" @click="ShowConnectForm=true"><i class="fa fa-plus" /></a>
            <span class="ml-auto pointer text-light" @click="WebShell.Opening^=true"><i class="fa fa-window-restore" /> 收起</span>
        </nav>
        <div class="term-manager border rounded-top" />
        <template v-if="active.manager">
            <div class="file-manager-header border">
                <nav class="font-monospace">
                    <a v-for="(path, id) in pwd" :key="id" @click.prevent="ReadDir(pwd.slice(0, 1 + id).join('/') || '/')">{{id?path:"ROOT"}}</a>
                </nav>
                <span class="text-danger font-monospace ml-3">{{active.fsinfo}}</span>
                <span class="ml-auto text-info pointer" @click="UploadPrecheck"><i class="fa fa-upload" /> 上传文件</span>
            </div>
            <div class="file-manager border font-monospace">
                <div>.. <a @click="ToParentDir">上一级</a><a class="ml-3" @click="ReadDir()">刷新</a><a class="ml-3" @click="active.ShowHidden^=1"><i class="fa fa-fw" :class="active.ShowHidden?'fa-check-square':'fa-square'" />显示隐藏文件</a></div>
                <template v-for="({prefix, filename, size, isdir, isfile}, id) in files">
                    <div v-if="isdir" :key="id">{{prefix}}<a @click="ReadDir([...pwd, filename].join('/'))">{{filename}}</a></div>
                    <div v-else-if="isfile && size<=536870912" :key="id">{{prefix}}<a class="text-white" @click="download(filename)">{{filename}}</a></div>
                    <div v-else :key="id">{{prefix}}<span class="text-secondary">{{filename}}</span></div>
                </template>
            </div>
        </template><template v-else />
        <footer class="border bg-secondary text-light rounded-bottom">
            <template v-if="active">
                <span class="mr-2">{{footer.linkinfo}}</span>
                <span class="mr-2"><i :class="footer.state|icon" /> {{footer.state|status}}</span>
                <small v-if="footer.reason||footer.progress" class="mr-2 text-pre font-monospace">{{footer.reason||footer.progress}}</small>
                <span v-else-if="footer.state==2" class="mr-2 pointer" @click="ToggleFileManger"><i class="fa fa-folder text-info" /> 文件管理</span>
                <template v-else />
                <span class="ml-auto pointer" @click="active.destroy()">
                    <template v-if="footer.state==2"><kbd>Ctrl+D</kbd> 退出</template>
                    <template v-else>关闭</template>
                </span>
            </template>
            <span v-else>未创建连接</span>
        </footer>
        <PopWindow v-if="ShowConnectForm" :dismiss="dismiss" :Done="doConnect">
            <template #title>新建SSH连接</template>
            <table class="table table-sm table-borderless">
                <tbody class="text-nowrap">
                    <tr>
                        <th class="w-1 text-right">
                            <label class="col-form-label">Host：</label>
                        </th>
                        <td>
                            <input v-model="host" class="form-control" :class="{'is-invalid':tips.host}" @blur="validator.check('host')">
                            <span class="invalid-feedback">{{tips.host}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-right">
                            <label class="col-form-label">Port：</label>
                        </th>
                        <td>
                            <input v-model="port" class="form-control" :class="{'is-invalid':tips.port}" @blur="validator.check('port')">
                            <span class="invalid-feedback">{{tips.port}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-right">
                            <label class="col-form-label">Username：</label>
                        </th>
                        <td>
                            <input v-model="username" class="form-control" :class="{'is-invalid':tips.username}" @blur="validator.check('username')">
                            <span class="invalid-feedback">{{tips.username}}</span>
                        </td>
                    </tr>
                    <tr>
                        <th class="text-right">
                            <label class="col-form-label">Password：</label>
                        </th>
                        <td>
                            <input v-model="password" class="form-control" :class="{'is-invalid':tips.password}" @blur="validator.check('password')">
                            <span class="invalid-feedback">{{tips.password}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </PopWindow>
        <FileUploader v-else-if="ShowFileUploader" :dismiss="CloseUploader" :Done="TransferFiles" :keepFiles="true" :multiple="1">
            <template #title>上传文件 [实验室功能]</template>
            <template #button>上传</template>
        </FileUploader><template v-else />
    </div>
</template>
<script>
    export default {
        filters: {
            status(state) {
                return ['未连接', '连接中', '已连接', '连接失败'][state]
            },
            icon(state) {
                return [
                    'fa fa-unlink text-dark',
                    'spinner-border spinner-border-sm text-warning',
                    'fa fa-link text-success',
                    'fa fa-unlink text-danger',
                ][state]
            }
        },
        data() {
            return {
                ShowConnectForm: false,
                ShowFileUploader: false,
                host: '127.0.0.1',
                port: 22,
                username: '',
                password: '',
            }
        },
        computed: {
            tips() {
                return this.validator.tips
            },
            ttys() {
                return this.WebShell.ttys
            },
            active() {
                return this.WebShell.activeTTY
            },
            pwd() {
                if (!this.active) {
                    return false
                }
                let dir = this.active.dir
                return (dir == '/' ? '' : dir).split('/')
            },
            files() {
                let files = (this.active && this.active.files || [])
                if (!this.active.ShowHidden) {
                    files = files.filter(({ filename }) => filename[0] != '.')
                }
                return files.sort((a, b) => b.prefix[0].localeCompare(a.prefix[0]) || a.filename.localeCompare(b.filename))
            },
            footer() {
                let { username, host, state, reason = '', progress = '' } = this.active
                return { linkinfo: username + '@' + host, state, reason, progress }
            }
        },
        watch: {
            'WebShell.Opening'(isOpen) {
                isOpen && (this.active ? this.active.active() : (this.ShowConnectForm = true))
                this.validator.clear()
            },
        },
        created() {
            this.validator.register(this, this.$data, () => ({
                host: ['domain'],
                port: ['integer', [1, 65535]],
                username: ['noempty'],
                password: ['noempty'],
            }))
        },
        methods: {
            doConnect() {
                if (this.validator.check()) {
                    return
                }
                let { host, port, username, password } = this
                this.WebShell.newTTY({ host, port, username, password })
                this.dismiss()
            },
            dismiss() {
                this.WebShell.Opening = this.WebShell.connected
                this.ShowConnectForm = false
                this.username = ''
                this.password = ''
            },
            UploadPrecheck() {
                this.active.preUpload(noop => {
                    this.ShowFileUploader = true
                })
            },
            TransferFiles(fileinfo) {
                this.active.emit('upload', fileinfo)
                setTimeout(noop => this.CloseUploader(), 300)
            },
            ToggleFileManger() {
                (this.active.manager ^= 1) && this.ReadDir()
                this.$nextTick(noop => this.active.helper.fit())
            },
            ToParentDir() {
                let dir = '/'
                if (this.pwd.length > 2) {
                    dir = this.pwd.slice(0, this.pwd.length - 1).join('/')
                }
                this.ReadDir(dir)
            },
            ReadDir(path) {
                this.active.fsinfo = ''
                this.active.emit('readdir', path)
            },
            download(filename) {
                this.active.fsinfo = ''
                this.active.emit('download', this.active.dir, filename)
            },
            CloseUploader() {
                this.ShowFileUploader = false
                this.active.term.focus()
            }
        }
    }
</script>
<style lang="scss">
    /**
     * Copyright (c) 2014 The xterm.js authors. All rights reserved.
     * Copyright (c) 2012-2013, Christopher Jeffrey (MIT License)
     * https://github.com/chjj/term.js
     * @license MIT
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     *
     * Originally forked from (with the author's permission):
     *   Fabrice Bellard's javascript vt100 for jslinux:
     *   http://bellard.org/jslinux/
     *   Copyright (c) 2011 Fabrice Bellard
     *   The original design remains. The terminal itself
     *   has been extended to include xterm CSI codes, among
     *   other features.
     */

    /**
     *  Default styles for xterm.js
     */
    #term-wrapper {
        position: fixed;
        z-index: 3000;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 1rem;
        background: rgba(0, 0, 0, .9);
        display: flex;
        flex-direction: column;
        &.hibernate {
            opacity: 0;
            z-index: -1;
        }
        >.border+.border {
            border-top: none !important;
        }
        >nav {
            display: flex;
            padding: 0 1rem;
            overflow: hidden;
            a {
                display: inline-block;
                color: var(--light);
                background: var(--secondary);
                padding: 0 .5rem;
                margin-bottom: -1px;
                line-height: 2rem;
                cursor: pointer;
                border-top-left-radius: .25rem;
                border-top-right-radius: .25rem;
                +a {
                    margin-left: .25rem;
                }
                &:hover,
                &.active {
                    color: var(--secondary);
                    background: var(--light);
                }
                small {
                    height: 1rem;
                    width: 1rem;
                    border-radius: 50%;
                    display: inline-block;
                    vertical-align: 15%;
                    line-height: 1.1;
                    text-align: center;
                    background: rgba(0, 0, 0, .3);
                    &:hover {
                        color: var(--light);
                    }
                }
            }
        }
        >footer {
            display: flex;
            line-height: 2rem;
            padding: 0 1rem;
        }
        >.term-manager {
            flex-grow: 1;
            position: relative;
            overflow: hidden;
            >.active {
                opacity: 1;
            }
        }
        >.file-manager-header {
            padding: .5rem;
            background: var(--light);
            color: var(--dark);
            display: flex;
            nav {
                display: flex;
                cursor: pointer;
                color: #709ccb;
                &:hover a {
                    text-decoration: underline;
                }
                a:hover~a {
                    text-decoration: none;
                }
                a~a::before {
                    content: "/";
                }
            }
        }
        >.file-manager {
            height: 20rem;
            padding: .5rem;
            color: white;
            background: #fff2;
            overflow: auto;
            font-size: 90%;
            div {
                white-space: pre;
            }
            a {
                color: var(--info);
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
    .xterm {
        position: absolute;
        left: 0;
        right: 0;
        user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        cursor: text;
        padding: .5rem;
        opacity: 0;
        &.focus,
        &:focus {
            outline: none;
        }
        &.enable-mouse-events {
            /* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
            cursor: default;
        }
        &.xterm-cursor-pointer {
            cursor: pointer;
        }
        &.column-select.focus {
            /* Column selection mode */
            cursor: crosshair;
        }
        .xterm-helpers {
            position: absolute;
            top: 0;
            z-index: 5;
        }
        .xterm-helper-textarea {
            position: absolute;
            opacity: 0;
            left: -9999em;
            top: 0;
            width: 0;
            height: 0;
            z-index: -5;
            white-space: nowrap;
            overflow: hidden;
            resize: none;
        }
        .composition-view {
            /* TODO: Composition position got messed up somewhere */

            /* background: rgba(0, 0, 0, .6); */
            color: #FFF;
            display: none;
            position: absolute;
            white-space: nowrap;
            z-index: 1;
            &.active {
                display: block;
            }
        }
        .xterm-viewport {
            /* On OS X this is required in order for the scroll bar to appear fully opaque */

            /* background-color: rgba(0, 0, 0, .6); */
            overflow-y: auto;
            cursor: default;
            position: absolute;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
        }
        .xterm-screen {
            position: relative;
            canvas {
                position: absolute;
                left: 0;
                top: 0;
            }
        }
        .xterm-scroll-area {
            visibility: hidden;
        }
        .xterm-accessibility,
        .xterm-message {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 10;
            color: transparent;
        }
        .live-region {
            position: absolute;
            left: -9999px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        }
        .xterm-char-measure-element {
            display: inline-block;
            visibility: hidden;
            position: absolute;
            top: 0;
            left: -9999em;
            line-height: normal;
        }
    }
    .xterm-dim {
        opacity: 0.5;
    }
    .xterm-underline {
        text-decoration: underline;
    }
</style>
