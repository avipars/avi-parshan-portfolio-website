"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const imagemin = require('gulp-imagemin'); // optimizes images

// const ftp = require('vinyl-ftp');

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
// const banner = ['/*!\n',
//   ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
//   ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
//   ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
//   ' */\n',
//   '\n'
// ].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// // Clean vendor doesn't hel with my narrowed down
// function clean() {
//   return del(["./vendor/"]);
// }

// // Bring third party dependencies from node_modules into vendor directory
// function modules() {
//   // Bootstrap
//   var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
//     .pipe(gulp.dest('./vendor/bootstrap'));
//   // Font Awesome not in use anymore
//   var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
//     .pipe(gulp.dest('./vendor'));
//   // jQuery Easing
//   var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
//     .pipe(gulp.dest('./vendor/jquery-easing'));
//   // jQuery
//   var jquery = gulp.src([
//       './node_modules/jquery/dist/*',
//       '!./node_modules/jquery/dist/core.js'
//     ])
//     .pipe(gulp.dest('./vendor/jquery'));
//   // Simple Line Icons
//   var simpleLineIconsFonts = gulp.src('./node_modules/simple-line-icons/fonts/**')
//     .pipe(gulp.dest('./vendor/simple-line-icons/fonts'));
//   var simpleLineIconsCSS = gulp.src('./node_modules/simple-line-icons/css/**')
//     .pipe(gulp.dest('./vendor/simple-line-icons/css'));
//   return merge(bootstrap, fontAwesome, jquery, jqueryEasing, simpleLineIconsFonts, simpleLineIconsCSS);
// }

// function renameHTML() {
//   // rename via string 
//   return gulp.src("./index.html")
//     .pipe(rename("./umeasure.html"))
//     .pipe(gulp.dest("./"));
// }

// Custom function to clean and minify device-mockups
// function minifyDeviceMockup()
// {
//   return gulp
//     .src([
//       './device-mockups/*.css',
//       '!./device-mockups/*.min.css'
//     ])
//     .pipe(cleanCSS())
//     .pipe(rename({
//       suffix: '.min'
//     }))
//     .pipe(gulp.dest('./device-mockups'))
//     .pipe(browsersync.stream());

// }

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"))
    .pipe(browsersync.stream());
}

function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch("./js/**/*", js);
  gulp.watch("./**/*.html", browserSyncReload);
}

//image optimizer
//Already used, only apply once new images come in
function optImages()
{
  return gulp.src("img/*")
        .pipe(imagemin([imagemin.jpegtran({progressive: true})]), imagemin.optipng({optimizationLevel: 5}))
        .pipe(gulp.dest("img/"))
}

// function getFtpConnection(){
//   return ftp.create({
//          host: ftp.aviparshan.x10host.com,
//          port: 21,
//          user: aviparsh,
//          password: avibar13,
//          log: gutil.log
//    });

// function uploadFTP()
// {
//   var localFiles = ['./vendor/**/*', './js/**/*', './img/**/*', './css/**/*', './device-mockups/**/*', '*.ico','umeasure.html'];
//   var user = process.env.FTP_USER;
// var password = process.env.FTP_PASSWORD;

// }


// Define complex tasks
// const clean = gulp.series(renameHTML);
const build = gulp.series(gulp.parallel(css, js));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
// const minImg = gulp.series(optImages);
// exports.optImages = optImages;

// const ftpUp = gulp.series(uploadFTP);
// Export tasks
exports.css = css;
exports.js = js;

// exports.renameHTML = renameHTML;
// exports.minifyDeviceMockup = minifyDeviceMockup;
// exports.uploadFTP = uploadFTP; 
// exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
