'use strict';

// Plugins
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require('gulp');
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const sassdoc = require('sassdoc');
 
sass.compiler = require('node-sass');

// Build CSS
function css() {
  return gulp
    .src("./assets/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("./dist/assets/css/"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("./dist/assets/css/"));
}

// Clean assets
function clean() {
  return del(["./dist/assets/"]);
}

// Build scss document
function document() {
  var options = {
    dest: 'docs',
    verbose: true,
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true,
    },
    groups: {
      'undefined': 'Ungrouped',
      foo: 'Foo group',
      bar: 'Bar group',
    },
    basePath: 'https://github.com/SassDoc/sassdoc',
  };

  return gulp
    .src('./assets/scss/**/*.scss')
    .pipe(sassdoc(options));
}

//Optimize Images
function images() {
  return gulp
    .src("./assets/img/**/*")
    .pipe(newer("./dist/assets/img"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./dist/assets/img"));
}

// Watch files
function watchFiles() {
  gulp.watch("./assets/scss/**/*", css);
  gulp.watch("./assets/img/**/*", images);
}

// Complex tasks
const build = gulp.series(clean, gulp.parallel(css, images));
const watch = gulp.series(watchFiles);

// Export tasks
exports.clean = clean;
exports.css = css;
exports.images = images;
exports.build = build;
exports.document = document;
exports.watch = watch;
exports.default = build;