<template>
    <div class="pop-mask" @dragover.prevent @drop.prevent="FileChange($event.dataTransfer)" @dragenter="DropMask=1">
        <div id="FileUploader" v-moveable v-escape="abortUpload" class="card" :class="{uploading:ActionState==1}">
            <div class="card-header handler">
                <slot name="title">{{'Upload Files'|i18n(i18n)}}</slot>
                <slot name="subtitle" />
                <button type="button" class="btn-close float-end" @click="dismiss" />
            </div>
            <div class="card-body">
                <slot />
            </div>
            <div v-if="Contents.length" class="card-body">
                <SortableTable class="font-monospace" :class="{'table-sm small':Contents.length>16}" :Columns="Columns" :Contents="Contents" :i18n="i18n">
                    <th slot="prepend" class="text-right w-1">#</th>
                    <tr v-for="(file, id) in Contents" :key="id" :class="{'text-danger':!file.valid}">
                        <td class="text-right">{{id+1}}</td>
                        <td>{{file.pathname}}</td>
                        <td class="text-right">{{file.filesize|KMG}}</td>
                        <td>{{file.lastModified|datetime}}</td>
                        <td class="align-middle">
                            <div v-if="file.valid && !file.error" class="progress progress-bar-striped bg-dark flex-column" :class="{'progress-bar-animated':ActionState==1}">
                                <div class="progress-bar progress-bar-striped h-75" :class="file.error?'bg-danger':file.verified<100?'bg-secondary':'bg-success'" :style="{width: file.progress+'%'}">{{file.progress}}%</div>
                                <div class="progress-bar bg-success flex-fill" :style="{width:file.verified+'%'}" />
                            </div>
                            <template v-else>{{file.error||"Unsupported format"|i18n(i18n)}}</template>
                        </td>
                    </tr>
                    <tr slot="tfoot" class="text-end" :class="{'text-danger':ExceedLimit}">
                        <td colspan="30">
                            <span>{{"%n file(s) total: %n"|i18n(i18n, ["%n", ValidFiles.length], ["%n", KMG(TotalSize)])}}</span>
                            <span v-if="ExceedLimit">{{", exceeding the maximum size limit, up to %n"|i18n(i18n, ["%n", KMG(limitSize)])}}</span>
                            <template v-else />
                        </td>
                    </tr>
                </SortableTable>
            </div><template v-else />
            <div class="card-body">
                <div v-if="ActionState==1" class="progress progress-bar-striped progress-bar-animated bg-secondary">
                    <div class="progress-bar progress-bar-striped bg-success" :style="{width:UploadProgress+'%'}">{{UploadProgress}}%</div>
                </div>
                <label v-else class="d-block mb-0">
                    <input type="file" class="d-none" :multiple="!!multiple" :disabled="ActionState==1" @change="FileChange($event.target)">
                    <span class="btn d-block" :class="ActionState==1?'btn-secondary':'btn-success'">
                        {{Contents.length?"reselect-file":"select-file"|i18n(i18n)}}
                        <small>{{'support-drop'|i18n(i18n)}}{{multiple?'support-multi':''|i18n(i18n)}}</small>
                    </span>
                </label>
            </div>
            <form v-if="!ActionState" class="card-footer input-group" autocomplete="off" @submit.prevent="doUpload">
                <span class="btn btn-secondary rounded" @click="dismiss">{{"Cancel"|i18n("button")}}</span>
                <input v-if="VerifyPassword" v-model="password" type="password" size="30" class="form-control rounded-start ms-2" :class="{'is-invalid':checker.tips.password}" :placeholder="'CheckPasswordTip'|i18n" @blur="checker.check('password')"><template v-else />
                <button v-if="VerifyPassword||Done" class="btn" :class="LimitUpload?'disabled btn-secondary':'btn-success'">
                    <slot name="title">{{'Upload Files'|i18n(i18n)}}</slot>
                </button><template v-else />
            </form><template v-else />
        </div>
        <div v-if="DropMask" class="text-light" @drop="DropMask=0" @dragleave="DropMask=0">
            <div class="display-2">{{'Drag and drop files here'|i18n(i18n)}}</div>
            <div class="display-4">{{'travel-files'|i18n(i18n)}}</div>
        </div><template v-else />
    </div>
</template>
<script>
    let i18n = {
        'pathname': {
            en: 'File Name',
            cn: '文件名'
        },
        'filesize': {
            en: 'File Size',
            cn: '文件大小'
        },
        'lastModified': {
            en: 'Last Modified',
            cn: '最后修改时间'
        },
        'valid': {
            en: 'Progress',
            cn: '进度'
        },
        'Upload Files': {
            cn: '上传文件'
        },
        'Unsupported format': {
            cn: '不支持的格式'
        },
        'reselect-file': {
            en: 'Reselect File(s)',
            cn: '重新选择文件'
        },
        'select-file': {
            en: 'Select File(s)',
            cn: '选择文件'
        },
        'Drag and drop files here': {
            cn: '将文件拖放在此处'
        },
        'travel-files': {
            en: 'Automatically traverse all files in the folder',
            cn: '自动遍历文件夹内所有文件'
        },
        'support-drop': {
            en: 'Support drag and drop',
            cn: '支持文件拖放'
        },
        'support-multi': {
            en: ' / Support multiple files',
            cn: ' / 支持多个文件'
        },

        '%n file(s) total: %n': {
            cn: '%n 个文件共：%n'
        },
        ', exceeding the maximum size limit, up to %n': {
            cn: '，超过最大尺寸限制，最大 %n'
        }
    }
    export default {
        name: 'FileUploader',
        props: {
            limitSize: {
                type: Number,
                default: 0, // 100 * 1e6, // 100M
                validator: val => val >= 0
            },
            multiple: {
                type: Number,
                default: 0, // disabled
                // 1           unlimited
                // 2 ... n     limit n files
                validator: val => val >= 0
            },
            FileExtension: {
                type: String,
                default: ''
            },
            keepFiles: {
                type: Boolean,
                default: false
            },
            VerifyPassword: {
                type: Boolean,
                default: false
            },
            dismiss: {
                type: Function,
                default: () => alert('please privode a cancel callback')
            },
            Done: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                password: undefined,
                checker: false,
                typeCheck: {},
                DropMask: false,

                ActionState: [0, 1, 2, 3][0], // [0:未开始，1:上传中，2:上传成功，3:上传失败]
                ChunkSize: 4 * 1024 * 1024,
                MaxRetry: 3,

                Contents: [],
                Columns: [
                    { sort: 'string', field: 'pathname', class: 'min-w20' },
                    { sort: 'number', field: 'filesize', class: 'w-1' },
                    { sort: 'number', field: 'lastModified' },
                    { sort: 'amount', field: 'valid', class: 'min-w10' }
                ]
            }
        },
        computed: {
            i18n: () => i18n,
            KMG: () => KMG,
            TotalSize() {
                return this.Contents.reduce((rtn, { valid, filesize }) => valid ? rtn + filesize : rtn, 0)
            },
            ExceedLimit() {
                return this.limitSize ? this.TotalSize > this.limitSize : false
            },
            ValidFiles() {
                return this.Contents.filter(file => file.valid)
            },
            LimitUpload() {
                let { ExceedLimit, ValidFiles, ActionState, VerifyPassword, checker } = this
                return ExceedLimit || !ValidFiles.length || ActionState > 1 || VerifyPassword && checker.errors || false
            },
            UploadProgress() {
                let { TotalSize, Contents } = this
                return TotalSize ? Math.round(Contents.reduce((rtn, { filesize, progress }) => {
                    return rtn + Math.round(filesize * progress / 100)
                }, 0) / TotalSize * 1e4) / 100 : 0
            },
            UploadedFiles() {
                return this.Contents.reduce((rtn, { filename, filesize, tmp_name }) => {
                    return tmp_name ? [...rtn, { filename, filesize, tmp_name }] : rtn
                }, [])
            }
        },
        created() {
            this.checker = this.validator.clone().register(this, this.$data, () => ({
                password: ['noempty']
            }))
            let [forbid, permit] = this.FileExtension.split('|').reduce(([forbid = [], permit = []], type) => {
                type.startsWith('!') && forbid.push(type.slice(1)) || type && permit.push(type)
                return [forbid, permit]
            }, []).map(rule => rule[0] ? new RegExp(`\\.(${rule.join('|')})$`, 'i') : false)
            this.typeCheck = { forbid, permit }
            this.spark = new SparkMD5.ArrayBuffer()
            window.addEventListener('beforeunload', this.DiscardUpload, { once: true })
        },
        beforeDestroy() {
            window.removeEventListener('beforeunload', this.DiscardUpload)
            this.spark.destroy()
            this.DiscardUpload()
        },
        methods: {
            checkFile(name, size) {
                let { forbid, permit } = this.typeCheck
                if (!size) {
                    return false
                } else if (permit && !permit.test(name)) {
                    return false
                } else if (forbid && forbid.test(name)) {
                    return false
                }
                return true
            },
            abortUpload() {
                this.xhr ? Object.assign(this.xhr, { break: true }) : this.dismiss()
            },
            DiscardUpload() {
                let { FileParts = [], FileQueue = [] } = this
                this.FileParts = []
                this.FileQueue = []
                if (!this.keepFiles || FileParts.length) {
                    FileParts.push(...FileQueue)
                    FileParts.length && this.request('System/CancelUpload', { chunks: FileParts })
                }
                this.ActionState = 0
            },
            async FileChange(target) {
                let FileEntries = [],
                    multiple = this.multiple,
                    { files, items } = target
                this.DiscardUpload()
                if (items) {
                    let entry, queue = Array.from(items).map(item => item.webkitGetAsEntry())
                    while ((entry = queue.shift()) && (multiple == 1 || FileEntries.length < (multiple || 1))) {
                        if (entry.name.startsWith('.')) {
                            continue
                        } else if (entry.isFile) {
                            let file = await new Promise(entry.file.bind(entry))
                            FileEntries.push(Object.assign(file, { pathname: entry.fullPath.substr(1) }))
                        } else if (entry.isDirectory) {
                            let entries, reader = entry.createReader()
                            do {
                                queue.push(...entries = await new Promise(reader.readEntries.bind(reader)))
                            } while (entries.length)
                        }
                    }
                } else {
                    FileEntries = Array.from(files).map(file => Object.assign(file, { pathname: file.name }))
                    multiple == 1 || FileEntries.splice(multiple || 1)
                }
                this.Contents = FileEntries.sort((a, b) => a.pathname.localeCompare(b.pathname, undefined, { numeric: true })).map(binary => {
                    let { name, size, pathname, lastModified } = binary
                    return {
                        binary, // 原始对象
                        pathname,
                        lastModified,
                        filesize: size,
                        filename: name,
                        valid: this.checkFile(name, size),
                        error: false,
                        loaded: 0,
                        verified: 0,
                        get progress() {
                            return Math.round(this.loaded / this.filesize * 1e4) / 100
                        },
                    }
                }).sort((a, b) => b.valid - a.valid)
            },
            async doUpload() {
                if (this.LimitUpload || this.VerifyPassword && this.checker.check()) {
                    return
                }
                let xhr = this.xhr = new XMLHttpRequest(),
                    Formdata = new FormData(),
                    { spark, MaxRetry, ChunkSize, Helper } = this,
                    option = { spark, MaxRetry, ChunkSize, FileServer: Helper.Product.AttachUrl }
                Object.assign(xhr, { responseType: 'json', withCredentials: true })
                this.FileQueue = []
                this.ActionState = 1
                for (let file of this.ValidFiles) {
                    await this.ShredUpload(file, xhr, Formdata, option)
                }
                this.ActionState = 2
                this.FileQueue.length && !xhr.break && this.Done(this.UploadedFiles, this.password)
                this.xhr = false
            },
            async ShredUpload(file, xhr, Formdata, option) {
                let start = 0,
                    chunks = this.FileParts = [],
                    { filename, filesize, binary } = file,
                    { spark, MaxRetry, ChunkSize, FileServer } = option

                while (start < filesize && MaxRetry && !xhr.break) {
                    let blob = binary.slice(start, start + ChunkSize),
                        checksum = spark.append(await blob.arrayBuffer()).end(),
                        { loaded: FileLoaded } = file
                    Formdata.delete('chunk')
                    Formdata.append('chunk', blob, checksum)
                    xhr.upload.onprogress = ({ loaded, total }) => {
                        file.loaded = FileLoaded + Math.round(blob.size * loaded / total)
                    }
                    await new Promise(resolve => {
                        xhr.onloadend = noop => {
                            let { status, response } = xhr, { tmp_name, md5 } = response || {}
                            if (status === 200 && md5 == checksum) {
                                chunks.push(tmp_name)
                                start += ChunkSize
                            } else if (MaxRetry--) {
                                file.loaded = FileLoaded
                            }
                            resolve()
                        }
                        xhr.open('post', FileServer)
                        xhr.send(Formdata)
                    })
                }
                return new Promise(resolve => {
                    if (xhr.break || !MaxRetry) {
                        file.error = xhr.break ? '传输终止' : '传输错误'
                        this.request('System/CancelUpload', { chunks }).finally(resolve)
                    } else {
                        let params = {
                            filename,
                            filesize,
                            chunks,
                            listener: val => {
                                file.verified = val
                            }
                        }
                        this.request('System/FinishUpload', params).resolve(success => {
                            file.tmp_name = success.tmp_name
                            this.FileQueue.push(file.tmp_name)
                        }).reject(error => {
                            file.error = '校验失败'
                        }).finally(noop => {
                            this.FileParts = []
                            resolve()
                        })
                    }
                })
            },
        }
    }
</script>
<style lang="scss">
    #FileUploader {
        &.uploading::before {
            content: "";
            position: absolute;
            background-color: rgba(0, 0, 0, 0);
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
        }
        &+div {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2;
            background: #055a19e0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            &::after {
                content: "";
                position: absolute;
                top: 1rem;
                left: 1rem;
                right: 1rem;
                bottom: 1rem;
                border: 1px dashed #fff;
                border-radius: 1rem;
            }
        }
    }
</style>
