const gulp = require('gulp')

gulp.task('default',async () => {
	gulp.src('src/**/*')
		.pipe(gulp.dest('build/'))
})
