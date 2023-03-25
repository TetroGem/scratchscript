module.exports = {
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
        'project': './src/tsconfig.json',
    },
    'plugins': [
        '@typescript-eslint',
    ],
    'ignorePatterns': ['.eslintrc.js', '**/old_*/**'],
    'rules': {
        'semi': 'error',
        'no-param-reassign': 'error',
        'comma-dangle': ['error', 'always-multiline'],
        'max-len': ['error', {
            'code': 120,
            'tabWidth': 4,
        }],
        'space-before-blocks': ['error', {
            'functions': 'always',
            'keywords': 'always',
            'classes': 'always'
        }],
        'keyword-spacing': ['error', {
            'before': true,
            'after': false,
            'overrides': {
                'import': {
                    'after': true,
                },
                'from': {
                    'after': true,
                },
                'return': {
                    'after': true,
                },
                'const': {
                    'after': true,
                },
                'case': {
                    'after': true,
                },
                'else': {
                    'after': true,
                },
                'of': {
                    'after': true,
                },
                'try': {
                    'after': true,
                },
                'throw': {
                    'after': true,
                },
            },
        }],
        'nonblock-statement-body-position': ['error', 'beside'],
        'brace-style': ['error', '1tbs'],
        'space-infix-ops': ['error', { 'int32Hint': false }],
        'switch-colon-spacing': ['error', {
            'before': false,
            'after': true,
        }],
        'key-spacing': ['error', {
            'beforeColon': false,
            'afterColon': true,
            'mode': 'strict',
        }],

        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/strict-boolean-expressions': ['error', {
            allowString: true,
            allowNumber: true,
            allowNullableObject: true,
            allowNullableBoolean: false,
            allowNullableString: false,
            allowNullableNumber: false,
            allowNullableEnum: true,
            allowAny: false,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
        }],
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', {
            'argsIgnorePattern': '^_',
            'varsIgnorePattern': '^_',
            'destructuredArrayIgnorePattern': '^_',
        }],
    },
};
