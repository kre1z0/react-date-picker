process.env.NODE_ENV = 'styleguide';

module.exports = {
    components: '../src/components/**/*.js',
    webpackConfig: require('./webpack.config.styleguide'),
    styleguideDir: '../storybook-static',
    ignore: [
        '**/__tests__/**',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.spec.js',
        '**/*.spec.jsx', //default
        '**/icons/**.js',
        '**/isTextShort.js',
    ],
    require: [
        'reset.css/reset.css',
        './src/assets/fonts/fonts.scss',
        './src/assets/base/main.scss',
    ],
};
