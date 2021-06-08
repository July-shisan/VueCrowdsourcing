let idarea = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
}
let translate = {
    'Check rule does not exist': {
        cn: '验证规则 "%s" 不存在',
        en: 'Checking rule "%s" not exist'
    },
    'Field is empty': {
        cn: '该字段不能为空',
        en: 'This field cannot be empty'
    },
    'Field value is not an integer': {
        cn: '该字段必须是整数',
        en: 'This field must be integer'
    },
    'Field value is too small': {
        cn: '数值不能小于 %n',
        en: 'Value cannot samller than %n'
    },
    'Field value is too large': {
        cn: '数值不能大于 %n',
        en: 'Value cannot bigger than %n'
    },
    'Field length is too short': {
        cn: '该字段不能少于 %n 个字符',
        en: 'This field at least %n letters'
    },
    'Field length is too long': {
        cn: '该字段不能多于 %n 个字符',
        en: 'This field cannot more than %n letters'
    },
    'Invalid port value': {
        cn: '%s 不是有效的端口地址',
        en: '%s is not a valid PORT address'
    },
    'Invalid port range': {
        cn: '%s 不是有效的端口范围',
        en: '%s is not a valid PORT range'
    },
    'Invalid time range': {
        cn: '%s 是无效的时间范围',
        en: '%s is invalid time range'
    },
    'Invalid email address': {
        cn: '请输入有效的电子邮件地址',
        en: 'Please input valid email address'
    },
    'Invalid email list': {
        cn: '邮件列表中含有不合法的邮件地址：\n%s',
        en: 'email list contain invalid email address: \n%s'
    },
    'Invalid mobile number': {
        cn: '请输入有效的手机号码',
        en: '请输入有效的手机号码',
    },
    'Invalid ID-card number': {
        cn: '请输入有效的身份证件号码',
        en: '请输入有效的身份证件号码',
    },
    'Invalid ip address': {
        cn: '%s 不是有效的IP地址',
        en: '%s is not valid IP address',
    },
    'Invalid ip range': {
        cn: '%s 不是有效的IP范围',
        en: '%s is not valid IP range',
    },
    'Invalid subnet mask': {
        cn: '%s 不是有效的子网掩码',
        en: '%s is not valid net mask',
    },
    'Invalid MAC address': {
        cn: '%s 不是有效的MAC地址',
        en: '%s is not valid MAC address',
    },
    'Invalid domain address': {
        cn: '%s 不是有效的域名地址',
        en: '%s is not valid domain name',
    },
    'Invalid account name': {
        cn: '请使用数字或字母作为开头和结尾，并且不要包含 @._- 以外的其他特殊字符。',
        en: 'Use Number or Letter, and do not use other than @._-',
    },
    'Not enough character types': {
        cn: '至少需要 ％n种字符类型：数字，大写字母，小写字母或特殊字符',
        en: 'At least %n char types are required: numbers, uppercase letters, lowercase letters or special characters',
    },
    'Continuous character detected': {
        cn: '不允许使用键盘上的相邻字符: "%s"',
        en: 'Adjacent characters on the keyboard are not allowed: "%s"',
    },
    'Duplicate character detected': {
        cn: '检测到重复字符 "%s"; 重复字符不能超过 ％n个。',
        en: 'Repeated character "%s" detected; repeated characters cannot exceed %n.',
    },
    'Contain disallowed word': {
        cn: '含有禁用单词 %s',
        en: 'Contain disallowed word %s',
    },
    'Weak password detected': {
        cn: '检测到弱密码，请修改',
        en: 'Weak password detected, not allowed',
    },
}
let Helper = {
    translate: null,
    Observe: null,
    FullRefused: [],
    i18n(text, dict = {}) {
        let lang = localStorage.lang || 'cn'
        let result = translate[text] && translate[text][lang] || this.translate(text, dict)
        return text && text.Replace && text.Replace(result) || result
    }
}
let Rules = {
    noempty(data, tip) {
        // 检测是否为空数据 同时过滤禁用词汇
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        if (!data || !String(data).trim()) {
            return tip || 'Field is empty'
        } else {
            return Rules.noillegal(data, tip)
        }
    },
    noillegal(data, tip) {
        // 检测是否含有禁用词汇
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        if (!String(data)) {
            return
        }
        for (let forbid of Helper.FullRefused) {
            if (forbid && String(data).includes(forbid)) {
                return Object.assign(new String(tip || 'Contain disallowed word'), { Replace: str => str.replace('%s', forbid) })
            }
        }
    },
    integer(data, tip, partten, min, max) {
        // 检测是否为整数
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param null    partten   占位
        // @param integer min       最小值
        // @param integer max       最大值
        if (isNaN(data) || parseInt(data) != String(data)) {
            return tip || 'Field value is not an integer'
        } else if (min != undefined && data < min) {
            return Object.assign(new String(tip || 'Field value is too small'), { Replace: str => str.replace('%n', min) })
        } else if (max != undefined && data > max) {
            return Object.assign(new String(tip || 'Field value is too large'), { Replace: str => str.replace('%n', max) })
        }
    },
    length(data, tip, partten, min, max) {
        // 检测字符串长度
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param null    partten   占位
        // @param integer min       最小长度
        // @param integer max       最大长度
        if (min != undefined && data.length < min) {
            return Object.assign(new String(tip || 'Field length is too short'), { Replace: str => str.replace('%n', min) })
        } else if (max != undefined && data.length > max) {
            return Object.assign(new String(tip || 'Field length is too long'), { Replace: str => str.replace('%n', max) })
        }
    },
    timerange(data, tip, partten = /^([0-1]\d|2[0-3]):[0-5]\d~([0-1]\d|2[0-3]):[0-5]\d$/, min = '00:00', max = '23:59') {
        // 检测是否为时间范围， 以 ～ 分隔
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        // @param integer min       最小时间
        // @param integer max       最大时间
        let [bh, bm, eh, em] = String(data).split(/~|:/).map(Number),
            begin = bh * 60 + bm,
            stop = eh * 60 + em
        min = min.split(':').map(Number).reduce((a, b) => a * 60 + b)
        max = max.split(':').map(Number).reduce((a, b) => a * 60 + b)
        if (!partten.test(data) || begin < min || begin > stop || stop > max) {
            return Object.assign(new String(tip || 'Invalid time range'), { Replace: str => str.replace('%s', data) })
        }
    },
    portrange(data, tip, partten = /^[1-9]\d*(-[1-9]\d*)?$/, min = 1, max = 65535) {
        // 检测是否为端口范围，以 - 分隔
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        // @param integer min       最小端口号码
        // @param integer max       最大端口号码
        let [begin, stop] = String(data).split('-').map(v => parseInt(v)),
            rangecheck = stop != undefined
        if (!partten.test(data) || begin < min || !rangecheck && begin > max || rangecheck && (begin >= stop || stop > max)) {
            return Object.assign(new String(tip || rangecheck ? 'Invalid port range' : 'Invalid port value'), { Replace: str => str.replace('%s', data) })
        }
    },
    ipaddress(data, tip, partten = /^(?!.*?\.0$)(?!.*?\.255$)(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))$/) {
        // 检测是否为 ip 地址
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        if (!partten.test(data)) {
            return Object.assign(new String(tip || 'Invalid ip address'), { Replace: str => str.replace('%s', data) })
        }
    },
    iprange(data, tip) {
        // 检测是否为 ip 地址范围，以 - 分隔
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        let [ip_a, ip_b] = String(data).split('-'),
            ip2hex = ip => {
                let parts = ip.split('.').map(part => parseInt(part, 10).toString(16).padStart(2, 0)),
                    bin = parts.join('')
                return parts.length == 4 && bin.length == 8 && parseInt(bin, 16)
            }
        if (!ip_b || Rules.ipaddress(ip_a) || Rules.ipaddress(ip_b) || ip2hex(ip_a) >= ip2hex(ip_b)) {
            return Object.assign(new String(tip || 'Invalid ip range'), { Replace: str => str.replace('%s', data) })
        }
    },
    iplists(data, tip) {
        // 检测是否为 ip 地址列表，可以为单个地址或地址范围， 以 \n 分隔
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        let err, list = data.replace(/\s+/g, '\n').trim().split('\n')
        for (let item of list) {
            if (item.includes('-')) {
                err = Rules.iprange(item, tip)
            } else {
                err = Rules.ipaddress(item, tip)
            }
            if (err) {
                return err
            }
        }
    },
    netmask(data, tip) {
        // 检测是否为 ip 地址掩码
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        let mask = String(data).split('.').map(part => (+part + 256).toString(2).substr(1))
        if (mask.length != 4 || !/^1{0,32}0{0,32}$/.test(mask.join(''))) {
            return Object.assign(new String(tip || 'Invalid subnet mask'), { Replace: str => str.replace('%s', data) })
        }
    },
    macaddress(data, tip, partten = /^[a-f0-9]{2}(-[a-f0-9]{2}){5}$|^[a-f0-9]{2}(:[a-f0-9]{2}){5}$/i) {
        // 检测是否为网卡 Mac 地址
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        if (!partten.test(data)) {
            return Object.assign(new String(tip || 'Invalid MAC address'), { Replace: str => str.replace('%s', data) })
        }
    },
    domain(data, tip, partten = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,6}$/i) {
        // 检测是否为域名或 ip 地址
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        if (!partten.test(data) ^ !Rules.ipaddress(data)) {
            return Object.assign(new String(tip || 'Invalid domain address'), { Replace: str => str.replace('%s', data) })
        }
    },
    username(data, tip, partten = /^(?![_@.-])(?!.*?[_@.-]$)[\w@.-]{6,16}$/i) {
        // skip report
        // 废弃，请勿使用
        if (!partten.test(data)) {
            return tip || 'Invalid account name'
        }
    },
    email(data, tip, partten = /^[a-z0-9_.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z0-9]{2,6}$/i) {
        // 检测是否为邮件地址
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        if (!partten.test(data)) {
            return tip || 'Invalid email address'
        }
    },
    email_list(data, tip, partten = /^[a-z0-9_.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z0-9]{2,6}$/i) {
        // 检测是否为邮件地址列表，以 \n 分隔
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        let failed = data.replace(/\s+/g, ' ').trim().split(' ').reduce((a, b) => (partten.test(b) || a.push(b)) && a, [])
        if (failed.length) {
            return Object.assign(new String(tip || 'Invalid email list'), { Replace: str => str.replace('%s', failed.slice(0, 3).join(', ')) })
        }
    },
    mobile(data, tip, partten = /^1\d{10}$/) {
        // 检测是否为手机号码
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        if (!partten.test(data)) {
            return Object.assign(new String(tip || 'Invalid mobile number'), { Replace: str => str.replace('%s', data) })
        }
    },
    realname(data, tip, partten = /^(?!.*?_$)[\u4e00-\u9fa5]{2,}[a-z0-9_-\u4e00-\u9fa5]*[a-z0-9\u4e00-\u9fa5]*$/i) {
        // 检测是否为中文姓名
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        if (!partten.test(data)) {
            return tip || '真实姓名应该以中文开头，至少2位; 最后一位不可有特殊字符'
        }
    },
    idcard(data, tip, partten = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|x)$/i) {
        // 检测是否为 18位身份证号码
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param RegExp  partten   正则验证规则
        let bit = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
            mod = '10x98765432'
        if (!partten.test(data) || !idarea[data.substr(0, 2)] || data.substr(-1).toLowerCase() != mod[String(data).split('').slice(0, 17).map((n, i) => n * bit[i]).reduce((a, b) => a + b) % 11]) {
            return Object.assign(new String(tip || 'Invalid ID-card number'), { Replace: str => str.replace('%s', data) })
        }
    },
    // for password checking
    pass_min_types(data, tip, partten, types = 3) {
        // skip report
        types = Math.max(2, Math.min(4, types))
        if ([/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-z]/i].reduce((a, b) => a + b.test(data), 0) < types) {
            return Object.assign(new String(tip || 'Not enough character types'), { Replace: str => str.replace('%n', types) })
        }
    },
    pass_max_repeat(data, tip, partten, len = 3) {
        // skip report
        len = Math.max(2, len)
        partten = new RegExp('(.)\\1{' + (len - 1) + '}', 'g')
        if (partten.test(data)) {
            let repeat = data.match(partten)[0]
            return Object.assign(new String(tip || 'Duplicate character detected'), { Replace: str => str.replace('%s', repeat).replace('%n', len) })
        }
    },
    pass_max_sequence(data, tip, partten, len = 3, sequence) {
        // skip report
        let start = 0
        len = isNaN(len) ? 3 : Math.max(3, len)
        sequence = sequence || '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?'
        while (start <= data.length - len) {
            let part = data.substr(start++, len),
                trap = part.split('').reverse().join('')
            if (sequence.includes(part)) {
                return Object.assign(new String(tip || 'Continuous character detected'), { Replace: str => str.replace('%s', part).replace('%n', len) })
            } else if (sequence.includes(trap)) {
                return Object.assign(new String(tip || 'Continuous character detected'), { Replace: str => str.replace('%s', trap).replace('%n', len) })
            }
        }
    },
    pass_filter_weak(data, tip, partten, weakwords) {
        // skip report
        // 检测密码包含于弱密码
        // @param mixed   data      待检测数据
        // @param string  tip       错误提示
        // @param null    partten   占位
        // @param string  weakwords 弱密码定义
        if (weakwords.includes(data)) {
            return tip || 'Weak password detected'
        }
    }
}

class Validator {
    constructor() {
        this.rules = () => ({})
    }
    clone() {
        return new Validator()
    }
    register(Vm, data, rules) {
        this.data = data
        this.rules = rules
        this.tips = Helper.Observe(Object.keys(rules()).reduce((a, b) => (a[b] = '') || a, {}))
        return this
    }
    update(data) {
        this.data = data
        this.clear()
    }
    validate(key, silent) {
        let ruleSet = this.rules()[key],
            data = this.data[key]
        if (!Array.isArray(ruleSet)) {
            this.tips[key] = `UNDETERMINED INSPECTION RULES DETECTED: [${key}]`
            return key
        }
        ruleSet = Array.isArray(ruleSet[0]) ? ruleSet : [ruleSet]
        for (let [rule, ...params] of ruleSet) {
            if (rule === undefined) {
                continue
            }
            let skip, tip, i18n, args = [],
                Runner = isProto(rule, 'Function') && rule || Rules[rule] || (() => Object.assign(new String('Check rule does not exist'), { Replace: str => str.replace('%s', rule) }))
            params.map(param => {
                isProto(param, 'Boolean') && (skip = !param)
                isProto(param, 'Object') && (i18n = param)
                isProto(param, 'String') && (tip = param)
                isProto(param, 'Array') && (args = param)
            })
            let feedback = !data && skip ? undefined : Runner(data, tip, undefined, ...args)
            silent || (this.tips[key] = feedback && Helper.i18n(feedback === true ? tip : feedback, i18n) || undefined)
            if (feedback) {
                return key
            }
        }
    }
    check(key) {
        if (key) {
            this.validate(key)
        } else {
            return Object.keys(this.rules()).filter(key => this.validate(key)).length
        }
    }
    clear() {
        for (let key in this.rules()) {
            this.tips[key] = ''
        }
    }
    get errors() {
        return Object.keys(this.rules()).filter(key => this.validate(key, true)).length
    }
    report() {
        let result = ''
        for (let name in Rules) {
            let plainText = String(Rules[name])
            if (!plainText.includes('// skip report')) {
                result += [...plainText.split('\n').filter(line => {
                    return /^\s*\w+\(/.test(line) || /\s*\/\//.test(line)
                }), '},', ''].join('\n').replace(/ +\/\//g, '  //')
            }
        }
        return result
    }
    inject(options) {
        ['translate', 'Observe', 'FullRefused'].map(name => {
            name in options && (Helper[name] = options[name])
        })
    }
}

export default new Validator()
