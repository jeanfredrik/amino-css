import { EventEmitter } from 'events';
import cssmin from 'gulp-cssmin';
import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sass from 'gulp-sass';

function handleError(error) {
  // https://github.com/floatdrop/gulp-plumber/blob/master/index.js
  if (EventEmitter.listenerCount(this, 'error') < 3) {
    gutil.log(
      gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'),
      error.toString(),
    );
  }

  // https://github.com/floatdrop/gulp-plumber/issues/30#issuecomment-218222434
  // Must emit end event for any dependent streams to pick up on this. Destroying the stream
  // ensures nothing else in that stream gets done, for example, if we're dealing with five
  // files, after an error in one of them, any other won't carry on. Doing destroy without
  // ending it first will not notify depending streams, tasks like `watch` will hang up.
  this.emit('end');
  this.destroy();
}

gulp.task('default', () =>
  gulp.src('src/**/*.scss')
    .pipe(plumber(handleError))
    .pipe(sass({
      importer(url, prev, done) {
        if (/^harpy!/.test(url)) {
          const filepath = path.resolve(
            path.dirname(prev),
            url.replace(/^harpy!/, ''),
          );
          delete require.cache[require.resolve(filepath)];
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const css = require(filepath);
          done({
            contents: css.stringify(),
          });
        } else {
          done();
        }
      },
    }))
    .pipe(gulp.dest('dist'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist')),
);

gulp.task('watch', ['default'], () => {
  gulp.watch('src/**/*.{scss,js}', ['default']);
});
