var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify');

// commander 
var program = require('commander');
program.option('-v, --versionNumber [parm]')
  .option('-e, --env [parm]')
  .parse(process.argv);

console.log('version: ' + program.versionNumber);
console.log('env: ' + program.env);

var buildPath = './dist/' + program.env + '/' + program.versionNumber + '/';
var rimCoreJs = './develop/eyesmedia.rim.js';
var envJs = './develop/'+ program.env + '.env.js';

function taskcss() {
  return gulp.src('./develop/*.css')
    .pipe(minifyCSS({
      keepBreaks: true,
    }))
    .pipe(concat('eyesmedia.rim.css'))
    .pipe(gulp.dest(buildPath));
}
function taskjs() {
  return gulp.src([rimCoreJs, envJs])
    .pipe(uglify())
    .pipe(concat('eyesmedia.rim.js'))
    .pipe(gulp.dest(buildPath));
}

exports.default = gulp.series(taskcss, taskjs);