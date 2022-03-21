var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify');

var sass = require('gulp-sass')(require('sass'));

// commander 
var program = require('commander');
program.option('-v, --versionNumber [parm]')
  .option('-e, --env [parm]')
  .parse(process.argv);

console.log('version: ' + program.versionNumber);
console.log('env: ' + program.env);

var envJs = './'+ program.env + '.env.js'; // 環境設定檔
var buildPath = './dist/' + program.env + '/' + program.versionNumber + '/'; //打包後路徑
var sourceCoreJs = './develop/js/bubble.js'; //js 來源檔

// 本地開發期間使用任務: scss > 另存成css
gulp.task('scss', function () {
  return gulp
    .src('./develop/scss/*.scss')
    .pipe(sass().on('error', sass.logError)) // 使用 gulp-sass 進行編譯
    .pipe(gulp.dest('./develop/css')); // 即時編譯後的路徑
});
// 本地開發期間使用任務: 監控
gulp.task('watch', function () {
  gulp.watch('./develop/scss/*.scss', gulp.series('scss'));
});

// css任務: 壓縮 > rename > 另存
function taskcss() {
  return gulp.src('./develop/css/*.css')
    .pipe(minifyCSS({
      keepBreaks: true,
    }))
    .pipe(concat('bubble.min.css'))
    .pipe(gulp.dest(buildPath));
}

// js任務: 壓縮 > rename > 另存
function taskjs() {
  return gulp.src([envJs, sourceCoreJs])
    .pipe(uglify())
    .pipe(concat('justka.bubble.min.js'))
    .pipe(gulp.dest(buildPath));
}

exports.default = gulp.series(taskcss, taskjs);