/**
 * Developer: Stepan Burguchev
 * Date: 6/14/2016
 * Copyright: 2009-2016 Comindware®
 *       All Rights Reserved
 * Published under the MIT license
 */

'use strict';

const webpackConfigFactory = require("./webpack.config.js");

module.exports = function (config) {
    let TEST_COVERAGE = config.coverage === true;

    let result = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-sourcemap-loader',
            'karma-webpack'
        ],

        // list of files / patterns to load in the browser
        files: [
            'tests/tests.bundle.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'tests/tests.bundle.js': [ 'webpack', 'sourcemap' ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        webpack: webpackConfigFactory.build({
            env: 'test'
        }),

        webpackMiddleware: {
            noInfo: true
        }
    };

    if (TEST_COVERAGE) {
        result.plugins.push('karma-coverage');

        result.reporters.push('coverage');

        result.coverageReporter = {
            dir : 'reports/',
            reporters: [
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' },
                { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
            ]
        };

        result.webpack = webpackConfigFactory.build({
            env: 'test-coverage'
        });
    }

    config.set(result);
};
