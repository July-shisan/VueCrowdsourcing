<template>
    <label class="mb-0 d-block" @drop.prevent="FileChange($event.dataTransfer.files)" @dragover.prevent>
        <input class="d-none" type="file" @change="FileChange($event.target.files)">
        <div class="input-group">
            <span class="form-control" :class="errorClass">{{value.filename||placeholder}}</span>
            <div class="input-group-append">
                <span class="btn btn-secondary">
                    <slot>{{'Browse'|i18n(i18n)}}</slot>
                </span>
            </div>
        </div>
    </label>
</template>
<script>
    export default {
        name: 'SimpleUploader',
        props: {
            value: {
                type: Object,
                required: true
            },
            errorClass: {
                type: String,
                required: true
            },
            placeholder: {
                type: String,
                default: '-'
            },
        },
        data() {
            return {
                ChunkSize: 4 * 1024 * 1024,
                MaxRetry: 3,
            }
        },
        computed: {
            i18n: () => i18n,
        },
        created() {
            this.value.next = this.doUpload
            this.spark = new SparkMD5.ArrayBuffer()
        },
        beforeDestroy() {
            this.spark.destroy()
        },
        methods: {
            FileChange([binary = {}]) {
                let { name: filename, size: filesize } = binary
                Object.assign(this.value, { filename, filesize, tmp_name: '', error: '', binary })
                this.value.check()
            },
            doUpload(callback) {
                let xhr = new XMLHttpRequest(),
                    formdata = new FormData()
                Object.assign(xhr, { responseType: 'json', withCredentials: true })
                this.ShredUpload(this.value, xhr, formdata).then(callback).catch(noop => {})
            },
            async ShredUpload(file, xhr, formdata) {
                let start = 0,
                    chunks = [],
                    { spark, MaxRetry, ChunkSize, Helper } = this,
                    { filename, filesize, binary } = file

                while (start < filesize && MaxRetry) {
                    let blob = binary.slice(start, start + ChunkSize),
                        checksum = spark.append(await blob.arrayBuffer()).end()
                    formdata.delete('chunk')
                    formdata.append('chunk', blob, checksum)
                    await new Promise(resolve => {
                        xhr.onloadend = noop => {
                            let { status, response: { tmp_name, md5 } } = xhr
                            if (status === 200 && md5 == checksum) {
                                chunks.push(tmp_name)
                                start += ChunkSize
                            } else {
                                MaxRetry--
                            }
                            resolve()
                        }
                        xhr.open('POST', Helper.Product.AttachUrl)
                        xhr.send(formdata)
                    })
                }
                return new Promise((resolve, reject) => {
                    if (MaxRetry) {
                        let params = { filename, filesize, chunks }
                        this.request('System/FinishUpload', params).resolve(success => {
                            file.tmp_name = success.tmp_name
                            resolve()
                        }).reject(error => {
                            file.error = this.translate('crc-error', i18n)
                            reject()
                        })
                    } else {
                        file.error = this.translate('try-error', i18n)
                        this.request('System/CancelUpload', { chunks }).finally(reject)
                    }
                })
            },
        }
    }
    let i18n = {
        'Browse': {
            cn: '选择文件'
        },
        'crc-error': {
            en: 'CRC Failed',
            cn: '校验失败'
        },
        'try-error': {
            en: 'Transfer Error',
            cn: '传输失败'
        }
    }
</script>
<!--
Usage:
    <SimpleUploader v-model="fileinfo" placeholder="最佳显示比例 16:10" :errorClass="(fileinfo.error||tips.fileinfo)?'is-invalid':''" />

    fileinfo: {
        filename: '',
        filesize: 0,
        tmp_name: '',
        error: '',
        check: () => this.validator.check('fileinfo'),
        next() {}
    },

    this.validator.register(this, this.Detail, () => ({
        fileinfo: [noop => !this.fileinfo.filename && !this.Detail.image, '请选择文件'],
    }))

    submit() {
        this.fileinfo.next(noop => {
            console.log('done')
        })
    },
 -->
