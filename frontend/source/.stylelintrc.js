module.exports = {
    'extends': ['stylelint-config-standard'],
    'rules': {
        'indentation': [4, { baseIndentLevel: 1 }],
        'color-hex-case': null,
        'color-no-invalid-hex': true,
        'number-leading-zero': null,
        'rule-empty-line-before': null,
        'selector-combinator-space-before': null,
        'selector-combinator-space-after': null,
        'no-descending-specificity': null,
        'font-family-no-missing-generic-family-keyword': null,
        'at-rule-empty-line-before': null,
        "at-rule-no-unknown": [true, {
            "ignoreAtRules": ['extend', 'at-root', 'debug', 'warn', 'error', 'if', 'else', 'for', 'each', 'while', 'mixin', 'include', 'content', 'return', 'function']
        }]
    }
}
