'use strict';
/**
 * Created by Alex Levshin on 20/1/16.
 */
let parseArgs = require('minimist');
let argv = parseArgs(process.argv.slice(2));
let gulp = require('gulp');
let config = require('./gulp-config');
let zip = require('gulp-zip');
let destCompressedFileName = 'workty-worker-app-' + argv.branch_type + '-' + argv.arch + '-' + argv.build_version + '.zip';
let destLocalFolderPath = argv.outputlocaldir + '/' + argv.branch_type + '/' + argv.arch + '/' + argv.build_version;
let util = require('util');
let clean = require('gulp-clean');

// Create local folder and copy folder
gulp.task('create-src-local-folder', ['copy-dockerfile'], () => {
    let paths = config.srcLocalFoldersPaths;
    paths.push(destLocalFolderPath + '/Dockerfile');
    return gulp.src(paths).pipe(zip(destCompressedFileName)).pipe(gulp.dest(destLocalFolderPath));
});

gulp.task('copy-dockerfile', ['del-src-local-folder'], () => {
    return gulp.src('./dockerfiles/' + argv.arch + '/Dockerfile').pipe(gulp.dest(destLocalFolderPath));
});

// Delete local folder
gulp.task('del-src-local-folder',[], () => {
    return gulp.src(destLocalFolderPath + '/*', {read: false})
        .pipe(clean({force: true}));
});

// Default task
gulp.task('default', ['create-src-local-folder'], () => {
    process.exit(0);
});