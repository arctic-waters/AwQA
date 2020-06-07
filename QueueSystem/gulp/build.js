const gulp = require('gulp')
const sass = require('gulp-sass')
const typescript = require('gulp-typescript')

gulp.task('build:typescript', () => {
  const project = typescript.createProject('tsconfig.json')

  return project.src().pipe(project()).js.pipe(gulp.dest('dist/'))
})

gulp.task('build:sass', () =>
  gulp
    .src('assets/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/public/css'))
)

gulp.task('build:scripts', () =>
  gulp.src('assets/scripts/**/*').pipe(gulp.dest('dist/public/js'))
)

gulp.task('build:files', () =>
  gulp.src('assets/files/**/*').pipe(gulp.dest('dist/public/'))
)

gulp.task(
  'build',
  gulp.parallel(
    'build:typescript',
    'build:scripts',
    'build:files',
    'build:sass'
  )
)
