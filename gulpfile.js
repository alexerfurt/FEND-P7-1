var gulp = require('gulp'), 
	uglify = require('gulp-uglify'),
	htmlmin = require('gulp-htmlmin'),
	jshint = require('gulp-jshint'),
	cssnano = require('gulp-cssnano'),
	notify= require('gulp-notify');

	// Minifying CSS files in views folder
gulp.task('styles', function(){
	return gulp.src('./src/css/*.css')
    	.pipe(cssnano())
		.pipe(gulp.dest('./dist/css'))
		.pipe(notify({ message: 'Styles task complete' }));	
});

	//Hinting js files to make sure it conforms to appropriate coding guidelines
gulp.task('jshint', function() {
    return gulp.src('./src/js/app.js')
        .pipe(jshint())
    	.pipe(jshint.reporter('default'))
    	.pipe(notify({ message: 'JS Hinting task complete' }));
});

	//Minifies JS file after jshint task finished
gulp.task('scripts', ['jshint'], function(){
	return gulp.src('./src/js/app.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js/'))
		.pipe(notify({ message: 'Scripts task complete' }));	
});

	//Minifies the index.html file after inlining css finished
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/'))
		.pipe(notify({ message: 'HTML task complete' }));	
});

gulp.task('default', ['html','scripts','styles']);