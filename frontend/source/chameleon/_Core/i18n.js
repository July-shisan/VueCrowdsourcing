let i18n = {
    global: {
        'Cannot establish connection to Api Server, request timeout': {
            cn: '无法与Api Server建立连接，请求超时'
        },
        'Server operating system does not support this operation': {
            cn: '服务器操作系统不支持此操作'
        },
        'Lack of perimissions': {
            cn: '软件系统缺少该操作的执行权限'
        },
        'Cannot establish connection to the server !!!': {
            cn: '无法建立与服务器的连接！'
        },
        'The interface address is invalid, please check again.': {
            cn: '接口地址无效，请重新核对。'
        },
        'The parameter format is incorrect. Please use the Object format instead.': {
            cn: '参数格式不正确。 请使用Object格式。'
        },
        'The returned data format is incorrect and cannot be parsed!': {
            cn: '返回的数据格式不正确，无法解析'
        },
        'Permission Check Failed !!': {
            cn: '权限检查失败'
        },
        'Audit event expired!': {
            cn: '事件已过期！'
        },
        'Lack of necessary parameters!': {
            cn: '缺少必要的参数！'
        },
        'CheckPasswordTip': {
            en: 'Enter current password to continue',
            cn: '敏感操作，需要当前密码'
        },
        'Input file contains unsupported image format': {
            cn: '不支持的图片格式'
        },
        // tables
        'Please enter search criteria': {
            cn: '请输入搜索条件'
        },
        'No data': {
            cn: '暂无数据'
        },
        'Action': {
            cn: '操作'
        },
    },
    button: {
        'Refresh': {
            cn: '刷新'
        },
        'Save': {
            cn: '保存'
        },
        'Create': {
            cn: '创建'
        },
        'Modify': {
            cn: '修改'
        },
        'Update': {
            cn: '更新'
        },
        'Clear': {
            cn: '清除'
        },
        'Confirm': {
            cn: '确认'
        },
        'Upload': {
            cn: '上传'
        },
        'Cancel': {
            cn: '取消'
        },
        'Close': {
            cn: '关闭'
        },
        'Next Step': {
            cn: '下一步'
        }
    },
    heartbeat: {
        'Sign Out': {
            cn: '您已经退出登录'
        },
        'Password changed, force offline': {
            cn: '密码已经修改，请重新登录'
        },
        'Kicked by same IP login': {
            cn: '另一个用户使用相同的IP地址登录'
        },
        'Kicked by same Account login': {
            cn: '另一个用户使用相同的帐户登录'
        },
        'Force Offline': {
            cn: '正在使用的账号被管理员强制离线'
        },
    },
    siterules: {
        'name': {
            en: 'Setting item',
            cn: '设置项'
        },
        'value': {
            en: 'Setting value',
            cn: '设定值'
        },
        'preset': {
            en: 'Current setting',
            cn: '当前设定'
        },
        'changed': {
            en: 'Changed setting',
            cn: '变更设置'
        },
        'The changed settings will not take effect immediately for the logged in user.': {
            cn: '更改的设置不会对已登录的用户立刻生效'
        },
        'Char(s)': {
            cn: '字符'
        },
        'Day(s)': {
            cn: '天'
        },
        'Minute(s)': {
            cn: '分钟'
        },
        'Record(s)': {
            cn: '条'
        },
        'Second(s)': {
            cn: '秒'
        },
        'Time(s)': {
            cn: '次'
        },
        'Type(s)': {
            cn: '类型'
        },
        'User(s)': {
            cn: '用户'
        },

        'Not Config': {
            cn: '未设置'
        },
        'Enabled': {
            cn: '启用'
        },
        'Disabled': {
            cn: '停用'
        },
        'Optional': {
            cn: '选填'
        },
        'Required': {
            cn: '必填'
        },
        'Permit': {
            cn: '开放模式'
        },
        'Reject': {
            cn: '关闭模式'
        },
        'BlackFirst': {
            en: 'Blacklist First',
            cn: '黑名单优先'
        },
        'WhiteFirst': {
            en: 'Whitelist First',
            cn: '白名单优先'
        },
        'Save Changes': {
            cn: '保存更改'
        },
        'Depends On': {
            cn: '依赖于'
        },

        '_email_server': {
            en: 'System mail server configuration',
            cn: '系统邮件服务器配置'
        },
        'Describe: _email_server': {
            en: 'After the configuration is complete, it can be enabled:\nEmail alerts for abnormal events\nEmail login verification code\nPassword reset via email\nOpen system user registration',
            cn: '配置完成后可启用：\n异常事件电子邮件告警\n邮件登录验证码\n通过邮件重置密码\n开放系统用户注册'
        },
        'black_words': {
            en: 'System forbidden words',
            cn: '系统禁用的单词'
        },
        'Describe: black_words': {
            en: 'One stop word per line\nThe content entered by the user will be blocked if it contains stop words',
            cn: '每行一个禁用词\n用户输入的内容中如果含有禁用词将被阻止提交'
        },
        '_site_open_mode': {
            en: 'System open/close mode',
            cn: '系统开放/关闭模式'
        },
        'Describe: _site_open_mode': {
            en: 'Enabling this mode will restrict user access',
            cn: '启用该模式，将限制用户访问'
        },
        '_site_open_time': {
            en: 'System open/close time',
            cn: '系统开放/关闭时间'
        },
        'Describe: _site_open_time': {
            en: 'Open mode, users are allowed to log in within the time range of this mode\nClose mode, users are not allowed to log in within the time range of this mode',
            cn: '开放模式，该模式时间范围内允许用户登录\n关闭模式，该模式时间范围内禁止用户登录'
        },
        '_site_ip_policy': {
            en: 'Enable system login IP filtering policy',
            cn: '启用系统登录IP过滤策略'
        },
        'Describe: _site_ip_policy': {
            en: 'After enabling, users who do not meet the IP address filtering conditions will be blocked from logging in\nWhitelist priority: User login address is included in the whitelist to log in\nBlacklist priority: User login address is included in the blacklist to be blocked from logging in',
            cn: '开启后，不符合 IP 地址过滤条件的用户将被阻止登录\n白名单优先：用户登录地址包含于白名单中即可登录\n黑名单优先：用户登录地址包含于黑名单中即被阻止登录'
        },
        '_site_white_ip': {
            en: 'Login IP whitelist',
            cn: '登录IP白名单'
        },
        'Describe: _site_white_ip': {
            en: 'The user is required to log in with the IP address in the list, otherwise it will be blocked. \nOne IP address per line or a set of IP ranges separated by "-"\nNo restriction, please leave this setting blank',
            cn: '要求用户使用该名单中的IP地址登录，否则将被阻止。\n每行一个IP地址或一组由 “-” 分隔的IP范围\n不做限制请将此设置留空'
        },
        '_site_black_ip': {
            en: 'Login IP blacklist',
            cn: '登录IP黑名单'
        },
        'Describe: _site_black_ip': {
            en: 'Users using the IP addresses in the list to log in will be blocked. \nOne IP address per line or a set of IP ranges separated by "-"\nThe content overlapping with the whitelist will be ignored\nNo restriction, please leave this setting blank',
            cn: '用户使用该名单中的IP地址登录将被阻止。\n每行一个IP地址或一组由 “-” 分隔的IP范围\n与白名单重叠的内容将被忽略\n不做限制请将此设置留空'
        },
        '_site_proxy_timeout': {
            en: 'Interface timeout',
            cn: '接口超时时间'
        },
        'Describe: _site_proxy_timeout': {
            en: 'Waiting for the duration of data response, timeout error',
            cn: '等待数据响应持续时间，超时报错'
        },
        '_site_max_onlines': {
            en: 'Maximum number of online users',
            cn: '最大在线用户数'
        },
        'Describe: _site_max_onlines': {
            en: 'The number of users that the system allows to operate at the same time\nThere is no limit, please leave this setting blank',
            cn: '系统允许同时间操作的用户数量\n不做限制请将此设置留空'
        },
        '_site_max_logs': {
            en: 'Maximum number of log entries saved',
            cn: '最大日志条目保存数量'
        },
        'Describe: _site_max_logs': {
            en: 'After the number of records reaches this limit, the earlier records will be cleared',
            cn: '记录数量到达此限制后，早期的记录将被清除'
        },

        'account_realname': {
            en: 'Account real name',
            cn: '账户真实姓名'
        },
        'Describe: account_realname': {
            en: 'Whether to require users to register their real names when registering',
            cn: '是否要求用户注册时登记真实姓名'
        },
        'account_email': {
            en: 'Account email address',
            cn: '账户邮件地址'
        },
        'Describe: account_email': {
            en: 'Whether to require users to register their email addresses when registering',
            cn: '是否要求用户注册时登记邮件地址'
        },
        'account_mobile': {
            en: 'Account mobile phone number',
            cn: '账户移动电话号码'
        },
        'Describe: account_mobile': {
            en: 'Whether to require users to register their mobile phone number when registering',
            cn: '是否要求用户注册时登记移动电话号码'
        },
        'account_idcard': {
            en: 'Account ID number',
            cn: '账户身份证号码'
        },
        'Describe: account_idcard': {
            en: 'Whether to require users to register their ID number when registering',
            cn: '是否要求用户注册时登记身份证号码'
        },
        'account_register': {
            en: 'System registration function',
            cn: '系统注册功能'
        },
        'Describe: account_register': {
            en: 'After deactivation, users can only be added manually by the system administrator.',
            cn: '停用后，用户只能由系统管理员手动添加。'
        },

        '_login_sameid': {
            en: 'Allow the same account to log in to the system in multiple places',
            cn: '允许同一账户在多处登录系统'
        },
        'Describe: _login_sameid': {
            en: 'When disabled, previously logged in users will be forced offline',
            cn: '禁用时，先前登录的用户将强制离线'
        },
        '_login_sameip': {
            en: 'Allow the same IP address to log in to multiple accounts',
            cn: '允许同一个IP地址登录多个账户'
        },
        'Describe: _login_sameip': {
            en: 'When disabled, previously logged in users will be forced offline',
            cn: '禁用时，先前登录的用户将强制离线'
        },
        '_login_token': {
            en: 'Login two-step verification',
            cn: '登录双重验证'
        },
        'Describe: _login_token': {
            en: 'Send login verification code via email',
            cn: '通过邮件发送登录验证码'
        },
        '_login_maxtry': {
            en: 'Maximum number of failed logins',
            cn: '最大登录失败次数'
        },
        'Describe: _login_maxtry': {
            en: 'If the number of failed login attempts reaches this setting, the account will enter the blocking mode.',
            cn: '登录失败次数达到此设置，账户将进入阻止模式。'
        },
        '_login_block': {
            en: 'Block mode duration',
            cn: '阻止模式持续时间'
        },
        'Describe: _login_block': {
            en: 'When the account enters blocking mode, the length of time to refuse to log in',
            cn: '账号进入阻止模式时，拒绝登录的时长'
        },
        '_login_idle': {
            en: 'Login idle time',
            cn: '登录空闲时间'
        },
        'Describe: _login_idle': {
            en: 'During this time frame, the system cannot detect user activity and will automatically take the account offline',
            cn: '在此时间范围内，系统无法检测到用户活动将自动使帐户离线'
        },
        'login_keep_state': {
            en: 'Keep user logged in state',
            cn: '保持用户登录状态'
        },
        'Describe: login_keep_state': {
            en: 'The maximum time to keep the user logged in through Token. \nSet to 0 to disable this feature',
            cn: '通过Token保持用户登录状态的最长时间。\n设置为 0 停用该功能'
        },

        'pass_email_reset': {
            en: 'Reset password via email',
            cn: '通过邮件重置密码'
        },
        'Describe: pass_email_reset': {
            en: 'The user fills in the email address when registering;\nSend an email containing the reset verification code;\nThe user checks the email within the limited time;\nFill in and reset the password correctly',
            cn: '用户填写注册时的邮件地址;\n发送一封含有重置验证码的邮件；\n在限制的时间内用户查收邮件；\n正确填写并重置密码'
        },
        '_pass_force_change': {
            en: 'Password valid time',
            cn: '密码有效时长'
        },
        'Describe: _pass_force_change': {
            en: 'It is considered insecure to use the same password for a long time. \nPasswords that have not been modified after this time will be forced to change. \nSet to 0 to disable this strategy',
            cn: '长时间使用相同的密码被认为是不安全的。\n超过该时间未修改的密码将被强制要求更换。\n设置为 0 停用该策略'
        },
        '_pass_filter_history': {
            en: 'Historical password detection',
            cn: '历史密码检测'
        },
        'Describe: _pass_filter_history': {
            en: 'Prohibit the use of recently used passwords\nSet to 0 to disable the detection',
            cn: '禁止使用最近用过的密码\n设置为 0 停用该检测'
        },
        'pass_filter_weak': {
            en: 'Enable weak password detection',
            cn: '启用弱密码检测'
        },
        'Describe: pass_filter_weak': {
            en: 'If the user set password is included or partly included in the weak password list, it will be required to be replaced.',
            cn: '用户设置密码如果包含或部分包含在弱密码列表中，将被要求更换。'
        },
        'pass_weak_define': {
            en: 'Password policy: weak password definition',
            cn: '密码策略：弱密码定义'
        },
        'Describe: pass_weak_define': {
            en: 'The user password cannot be included in the definition\nOne password per line',
            cn: '用户密码不能包含于该定义中的内容\n每行一个密码'
        },
        'pass_min_length': {
            en: 'Minimum password length',
            cn: '密码最短长度'
        },
        'Describe: pass_min_length': {
            en: 'Mandatory require users to set the minimum length of the password.',
            cn: '强制要求用户设置密码的最短长度。'
        },
        'pass_min_types': {
            en: 'Password character type detection',
            cn: '密码字符类型检测'
        },
        'Describe: pass_min_types': {
            en: 'It is mandatory for users to set at least several character types in the password [number, lowercase, uppercase, special]. \nSet to 0 to disable the detection',
            cn: '强制要求用户设置密码中至少含有几种字符类型【数字，小写，大写，特殊】。\n设置为 0 停用该检测'
        },
        'pass_max_repeat': {
            en: 'Password repeated character detection',
            cn: '密码重复字符检测'
        },
        'Describe: pass_max_repeat': {
            en: 'It is mandatory for users to set the maximum number of consecutive repeated characters that can be included in the password.\nRepeated character definition, example: 111 aaa AAA ***\nSet to 0 to disable the detection',
            cn: '强制要求用户设置密码中可以含有的连续重复字符的最大数量。\n重复字符定义，示例：111 aaa AAA ***\n设置为 0 停用该检测'
        },
        'pass_max_sequence': {
            en: 'Enable password sequence key character detection',
            cn: '启用密码顺序键位字符检测'
        },
        'Describe: pass_max_sequence': {
            en: 'The maximum number of sequential key characters contained in the user password. Otherwise, it will be required to be replaced. \nSet to 0 to disable the detection',
            cn: '用户密码中含有的顺序键位字符最大数量。否则将被要求更换。\n设置为 0 停用该检测'
        },
        'pass_key_sequence': {
            en: 'Password policy: sequence key character definition',
            cn: '密码策略：顺序键位字符定义'
        },
        'Describe: pass_key_sequence': {
            en: 'Default sequence key character definition:\n`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>? \nThe system also automatically filters flashback characters',
            cn: '默认顺序键位字符定义：\n`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?\n系统同时自动过滤倒叙字符'
        },
    },
    menu: {},
    navi: {},
    errors: {}
}
/**
 * 临时方案
 */
let errors = {
    '账户相关': {
        'Account or password incorrect.': {
            cn: '账户或密码不正确。'
        },
        'Maximum number of login attempts exceeded! The account has been locked. Please try again later.': {
            cn: '身份验证失败次数超限！该帐户已被锁定。请稍后再试。'
        },
        'The account has been disabled, please contact the administrator.': {
            cn: '账号异常，请联系管理员'
        },
        'The IP address you are using is forbidden to login. Please contact the administrator.': {
            cn: '您正在使用的IP地址被禁止登录。 请联系管理员。'
        },
        'Authentication failed': {
            cn: '身份验证失败'
        },
        'Account does not exist': {
            cn: '帐户不存在'
        },
        'Role does not exist or is protected': {
            cn: '角色不存在或受到保护'
        },
        'Session Expired !!': {
            cn: '会话过期 !!'
        },
    },
    '文件相关': {
        'Invalid License': {
            cn: '许可证文件无效或已损坏'
        },
        'License version does not match': {
            cn: '许可证版本不匹配'
        },
        'License not enabled': {
            cn: '许可证未启用'
        },
        'License has expired': {
            cn: '许可证已过期'
        },
        'Abnormal system time detected': {
            cn: '检测到异常的系统时间'
        },
        'Unauthorized device identification number': {
            cn: '未经授权的设备标识号'
        },
        'File parsing error': {
            cn: '文件解析错误'
        },
        'The source file does not exist!': {
            cn: '源文件不存在！'
        },
        'Wrong attachment statement': {
            cn: '错误的附件声明'
        },
        'File Not Found': {
            cn: '文件未找到'
        },
    },
}
Object.values(errors).map(item => Object.assign(i18n.errors, item))

import Moment from 'moment-timezone'
const preset = {
    timezone: 'Asia/Shanghai',
    datestring: 'YYYY-MM-DD',
    timestring: 'HH:mm:ss z'
}
class I18N {
    constructor() {
        this.default_lang = 'cn'
        this.lang = localStorage.getItem('lang') || this.default_lang
    }
    set lang(lang) {
        this.current_lang = ['en', 'cn'].includes(lang) ? lang : this.default_lang
        localStorage.setItem('lang', this.current_lang)
        Moment.locale({
            'en': 'en',
            'cn': 'zh-cn',
            'jp': 'ja'
        } [this.lang])
    }
    get lang() {
        return this.current_lang
    }
    mixin(category, dict, replace) {
        if (replace) {
            i18n[category] = dict
        } else {
            Object.assign(i18n[category], dict)
        }
    }
    translate(text, dict, ...replaces) {
        if (isProto(dict, 'Object')) {
            dict = dict[text]
        } else {
            dict = i18n[dict] && i18n[dict][text]
        }
        dict = dict || i18n.global[text] || {}
        return replaces.reduce((rtn, [s, r]) => rtn.replace(s, r), dict[this.current_lang] || text)
    }
    datetime(dateString, _format, _timezone) {
        try {
            let { locale } = localStorage
            Object.assign(preset, JSON.parse(locale))
        } catch (noop) { /*eslint-disable-line-no-empty*/ }
        const { datestring, timestring, timezone } = preset
        _format = isProto(_format, 'String') && _format ? _format : _format === false ? datestring : datestring + ' ' + timestring
        return dateString && Moment.tz(dateString, _timezone || timezone).format(_format) || '-'
    }
}
let instance = new I18N()
window.moment = Moment
window.datetime = instance.datetime.bind(instance)

export default instance
