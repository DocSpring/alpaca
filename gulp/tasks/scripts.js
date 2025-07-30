const { src, dest, series, parallel } = require('gulp');
const fs = require('fs');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const wrapUmd = require('gulp-wrap-umd');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const paths = require('../utils/paths');
const config = require('../config');

// Read UMD wrapper template
const getUmdWrapper = () => fs.readFileSync(config.umdWrapperPath, 'utf-8');

// UMD configurations for different builds
const umdConfigs = {
    web: {
        deps: [{
            "name": "jquery",
            "globalName": "jQuery",
            "paramName": "$"
        }, {
            "name": "handlebars",
            "globalName": "Handlebars",
            "paramName": "Handlebars"
        }],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: getUmdWrapper()
    },
    bootstrap: {
        deps: [{
            "name": "jquery",
            "globalName": "jQuery",
            "paramName": "$"
        }, {
            "name": "handlebars",
            "globalName": "Handlebars",
            "paramName": "Handlebars"
        }, {
            "name": "bootstrap",
            "globalName": "Bootstrap",
            "paramName": "Bootstrap"
        }],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: getUmdWrapper(),
        defaultView: 'bootstrap'
    },
    jqueryui: {
        deps: [{
            "name": "jquery",
            "globalName": "jQuery",
            "paramName": "$"
        }, {
            "name": "handlebars",
            "globalName": "Handlebars",
            "paramName": "Handlebars"
        }, {
            "name": "jquery-ui",
            "globalName": "jQueryUI",
            "paramName": "jQueryUI"
        }],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: getUmdWrapper(),
        defaultView: 'jqueryui'
    },
    jquerymobile: {
        deps: [{
            "name": "jquery",
            "globalName": "jQuery",
            "paramName": "$"
        }, {
            "name": "handlebars",
            "globalName": "Handlebars",
            "paramName": "Handlebars"
        }, {
            "name": "jquery-mobile",
            "globalName": "jQM",
            "paramName": "jQM"
        }],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: getUmdWrapper(),
        defaultView: 'jquerymobile'
    }
};

// Transpile files that need babel
function transpileScripts() {
    return src(paths.scripts.filesToTranspile)
        .pipe(babel({
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        'ie': '9'
                    }
                }]
            ]
        }))
        .pipe(dest('build/tmp/transpiled'));
}

// Concatenate core scripts
function concatCoreScripts() {
    return src(paths.scripts.core)
        .pipe(concat('scripts-core.js'))
        .pipe(dest('build/tmp'));
}

// Build Bootstrap version
function buildBootstrapScripts() {
    return src(paths.scripts.bootstrap)
        .pipe(concat('alpaca.js'))
        .pipe(wrapUmd(umdConfigs.bootstrap))
        .pipe(dest('build/alpaca/bootstrap'))
        .pipe(concat('alpaca.min.js'))
        // .pipe(uglify()) // Commented out in original
        .pipe(dest('build/alpaca/bootstrap'));
}

// Build Web version (commented out in original)
function buildWebScripts() {
    return src(paths.scripts.web)
        .pipe(concat('alpaca.js'))
        .pipe(wrapUmd(umdConfigs.web))
        .pipe(dest('build/alpaca/web'))
        .pipe(concat('alpaca.min.js'))
        .pipe(uglify())
        .pipe(dest('build/alpaca/web'));
}

// Build jQuery UI version (commented out in original)
function buildJQueryUIScripts() {
    return src(paths.scripts.jqueryui)
        .pipe(concat('alpaca.js'))
        .pipe(wrapUmd(umdConfigs.jqueryui))
        .pipe(dest('build/alpaca/jqueryui'))
        .pipe(concat('alpaca.min.js'))
        .pipe(uglify())
        .pipe(dest('build/alpaca/jqueryui'));
}

// Build jQuery Mobile version (commented out in original)
function buildJQueryMobileScripts() {
    return src(paths.scripts.jquerymobile)
        .pipe(concat('alpaca.js'))
        .pipe(wrapUmd(umdConfigs.jquerymobile))
        .pipe(dest('build/alpaca/jquerymobile'))
        .pipe(concat('alpaca.min.js'))
        .pipe(uglify())
        .pipe(dest('build/alpaca/jquerymobile'));
}

// Build distribution scripts
function buildDistScripts() {
    // Note: In the original gulpfile, only bootstrap is built
    // Other builds are commented out
    return buildBootstrapScripts()
        .pipe(notify({ message: "Built Alpaca JS" }));
}

// Main scripts task
const buildScripts = series(
    transpileScripts,
    concatCoreScripts,
    buildDistScripts
);

buildScripts.displayName = 'build-scripts';
buildScripts.description = 'Build all JavaScript files';

module.exports = {
    buildScripts,
    transpileScripts,
    concatCoreScripts,
    buildBootstrapScripts,
    buildWebScripts,
    buildJQueryUIScripts,
    buildJQueryMobileScripts
};