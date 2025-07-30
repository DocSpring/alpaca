const { series, parallel } = require('gulp');

// Import tasks
const clean = require('./gulp/tasks/clean');
const { buildTemplates } = require('./gulp/tasks/templates');
const { buildScripts } = require('./gulp/tasks/scripts');
const { buildStyles } = require('./gulp/tasks/styles');
const { 
    packageTask, 
    bumpVersion, 
    bumpMinorVersion, 
    bumpMajorVersion,
    updateReleaseTxt 
} = require('./gulp/tasks/version');

// TODO: Import these once created
// const { buildSite, updateSiteFull, updateSiteAlpaca } = require('./gulp/tasks/site');
// const { server, watch } = require('./gulp/tasks/server');
// const { lint, cucumber } = require('./gulp/tasks/test');
// const { cdn } = require('./gulp/tasks/deploy');

// Register individual tasks
exports.clean = clean;
exports.buildTemplates = buildTemplates;
exports.buildScripts = buildScripts;
exports.buildStyles = buildStyles;
exports.package = packageTask;
exports.bump = bumpVersion;
exports.bumpMinor = bumpMinorVersion;
exports.bumpMajor = bumpMajorVersion;

// Main build task
const build = series(
    updateReleaseTxt,
    buildTemplates,
    parallel(buildScripts, buildStyles, packageTask)
);
build.description = 'Build Alpaca';

// Default task
exports.default = build;

// TODO: Add these composite tasks once all modules are created
// exports.site = series(buildSite, updateSiteFull);
// exports.server = series(build, exports.site, parallel(watch, server));
// exports.web = exports.server;
// exports.watch = watch;
// exports.lint = lint;
// exports.cucumber = cucumber;
// exports.cdn = cdn;

// Dist task
const dist = async function() {
    const { src, dest } = require('gulp');
    return src("build/alpaca/**/*")
        .pipe(dest("dist/alpaca"));
};
dist.displayName = 'dist';
dist.description = 'Copy build to dist directory';
exports.dist = dist;

// NPM package task
const npmpackage = async function(cb) {
    const fs = require('fs');
    const pkg = require('./package.json');
    
    const npmPkg = JSON.parse(JSON.stringify(pkg));
    delete npmPkg.scripts.postinstall;
    delete npmPkg.scripts.postupdate;
    
    fs.writeFileSync("./package.json.npm", JSON.stringify(npmPkg, null, "  "));
    cb();
};
npmpackage.displayName = 'npmpackage';
npmpackage.description = 'Create package.json for npm distribution';
exports.npmpackage = npmpackage;

// Deploy task
exports._deploy = series(build, /* site, */ dist, npmpackage);