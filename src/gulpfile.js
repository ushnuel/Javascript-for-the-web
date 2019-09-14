const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();

gulp.task('processHTML', () => {
  gulp
    .src('../*.html')
    .pipe(gulp.dest('../dist'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});

gulp.task('processJS', () => {
  gulp
    .src('*.js')
    .pipe(
      jshint({
        esversion: 8,
      }),
    )
    .pipe(jshint.reporter('default'))
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
        plugins: ['transform-runtime'],
      }),
    )
    .pipe(uglify())
    .pipe(gulp.dest('../dist/src'))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: '../dist',
    port: 8080,
    ui: {
      port: 8081,
    },
  });
});

gulp.task('watch', ['browserSync'], () => {
  gulp.watch('*.js', ['processJS']);
  gulp.watch('../*.html', ['processHTML']);

  gulp.watch('../dist/src/*.js', browserSync.reload);
  gulp.watch('../dist/*.html', browserSync.reload);
});

gulp.task('babelPolyfill', () => {
  gulp
    .src('../node_modules/@babel/polyfill/dist/polyfill.min.js')
    .pipe(gulp.dest('../dist/node_modules/@babel/polyfill/dist'));
});

gulp.task('processImage', () => {
  gulp.src('../images/*.svg').pipe(gulp.dest('../dist/images'));
});

gulp.task('default', (callback) => {
  runSequence(
    ['processHTML', 'processImage', 'processJS', 'babelPolyfill'],
    'watch',
    callback,
  );
});
