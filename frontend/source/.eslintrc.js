/*global process*/
const level = process.env.packing ? 'error' : 'warn'
module.exports = {
    'root': true,
    'extends': [
        'eslint:recommended',
        'plugin:vue/recommended'
    ],
    'parserOptions': {
        'ecmaVersion': 2021,
        'sourceType': 'module',
    },
    'globals': {
        'module': 'readonly',
        'moment': 'readonly',
        'Sortable': 'readonly',
        'SparkMD5': 'readonly',
        'isProto': 'readonly',
        'datetime': 'readonly',
        'CloneFrom': 'readonly',
        'animationTo': 'readonly',
    },
    'rules': {
        'no-console': level,
        'no-debugger': level,
        'no-control-regex': 'off',
        'no-multi-spaces': ['error', { 'exceptions': { 'Property': false } }],
        'no-trailing-spaces': 'error',
        'no-duplicate-imports': 'error',
        'brace-style': ['error', '1tbs'],
        'space-infix-ops': ['error', { 'int32Hint': false }],
        'space-unary-ops': ['error', { 'words': true, 'nonwords': false }],
        'semi': ['error', 'never'],
        'quotes': ['warn', 'single', { 'avoidEscape': true }],
        'no-unused-vars': ['error', {
            'argsIgnorePattern': '(noop|success|error)',
            'varsIgnorePattern': '(noop)',
            'ignoreRestSiblings': false
        }],
        'space-in-parens': ['error', 'never'],
        'space-before-function-paren': ['error', 'never'],
        'space-before-blocks': ['error', 'always'],
        'semi-spacing': 'error',
        'comma-spacing': 'error',
        'keyword-spacing': ['error', { 'before': true, 'after': true }],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'template-curly-spacing': ['error', 'never'],
        'linebreak-style': ['error', 'unix'],
    },
    'overrides': [ //
        {
            'files': ['**/*.js'],
            'rules': {
                'indent': ['error', 4, { 'SwitchCase': 1 }]
            }
        },
        {
            'files': ['**/*.vue'],
            'rules': {
                'vue/attributes-order': 'error',
                'vue/attribute-hyphenation': 'off',
                'vue/html-indent': ['error', 4],
                'vue/html-quotes': ['error', 'double'],
                'vue/html-self-closing': 'error',
                'vue/html-closing-bracket-spacing': 'error',
                'vue/max-attributes-per-line': 'off',
                'vue/mustache-interpolation-spacing': 'off',
                'vue/multiline-html-element-content-newline': 'error',
                'vue/no-v-html': 'off',
                'vue/no-multi-spaces': 'error',
                'vue/no-mutating-props': 'off',
                'vue/no-template-shadow': 'error',
                'vue/order-in-components': 'error',
                'vue/prop-name-casing': 'off',
                'vue/require-prop-types': 'error',
                'vue/require-default-prop': 'error',
                'vue/singleline-html-element-content-newline': 'off',
                'vue/script-indent': ['error', 4, { 'baseIndent': 1, 'switchCase': 1 }],
                'vue/this-in-template': ['error', 'never'],
            }
        },
    ]
}
