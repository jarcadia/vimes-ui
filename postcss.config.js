'use strict';

module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-normalize'),
        require('postcss-position'),
        require('autoprefixer'),
    ],
};