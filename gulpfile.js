/* jshint node:true */
'use strict';

// generated on 2015-02-12 using generator-gulp-webapp 0.2.0
var gulp       = require('gulp');
var connect    = require('gulp-connect-php');
var htmlmin    = require('gulp-htmlmin');
var sass       = require('gulp-sass');
var livereload = require('gulp-livereload');
var cache      = require('gulp-cache');
var $          = require('gulp-load-plugins')();

//https://github.com/sass/node-sass
gulp.task('stylesServe', function() {
  gulp.src('app/css/main.scss')
    .pipe(sass({
        noCache      : true,
        precision    : 4,
        unixNewlines : true,
    }))
    .pipe(gulp.dest('.tmp/css'));

  gulp.src('app/fonts/**/*')
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('.tmp/fonts'));

  gulp.src('app/css/animate.min.css')
    .pipe(gulp.dest('.tmp/css'));

  gulp.src('app/img/**/*')
    .pipe(gulp.dest('.tmp/img'));
});

gulp.task('stylesCompile', function() {
  gulp.src('app/css/main.scss')
    .pipe(sass({
        noCache      : true,
        precision    : 4,
        unixNewlines : true,
        outputStyle: 'compressed',
    }))
    .pipe(gulp.dest('dist/css'));

  gulp.src('app/css/animate.min.css')
    .pipe(gulp.dest('dist/css'));
});

gulp.task('jsCompile', function() {
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});
  return gulp.src(['app/includes/scripts.php'])
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function () {
  return gulp.src('app/js/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['stylesCompile'], function () {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap','fonts');
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src(['app/**/*.html','app/**/*.php'])
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    // .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('img', function () {
  return gulp.src('app/img/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('img-jquery-ui', function () {
  return gulp.src('bower_components/jquery-ui/themes/base/images/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/css/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    '!app/*.php',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, [
  '.tmp', 
  'dist/*', 
  '!dist/admin', 
  '!dist/uploads', 
  '!dist/php'
  ])
);

gulp.task('clearCache', function (done) {
  return cache.clearAll(done);
});

gulp.task('connect', ['stylesServe'], function () {
  connect.server({
    port: 9000,
    root: '/app/'
  });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000/app/');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/css/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/css'));

  gulp.src('app/*.html')
    .pipe(wiredep({exclude: ['bootstrap-sass-official']}))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
  livereload.listen({ auto: true });

  gulp.watch('app/css/**/*.scss', ['stylesServe']);
  gulp.watch('bower.json', ['wiredep']);

  // watch for changes
  gulp.watch([
    'app/**/*.html',
    'app/**/*.php',
    '.tmp/css/**/*.css',
    'app/js/**/*.js',
    'app/img/**/*'
  ]).on('change', livereload.changed);
});

gulp.task('build', ['jshint', 'html', 'img', 'img-jquery-ui', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});