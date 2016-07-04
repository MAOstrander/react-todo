var gulp = require('gulp');
var babel = require("gulp-babel");
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('bundle', function() {
    return browserify({
        extensions: ['.js', '.jsx'],
        entries: 'public/app/app.js',
    })
    .transform(babelify.configure({
        ignore: /(bower_components)|(node_modules)/
    }))
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/dist'));
});

gulp.task("justbabel", function () {
  return gulp.src("public/app/app.js")
    .pipe(babel())
    .pipe(gulp.dest("public/app"));
});

gulp.task('default', function() {
    gulp.start('justbabel', 'bundle');
});
