// Create gulp variables of the dependencies
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    php = require('gulp-connect-php'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync');

// Compile Sass files and minify it
gulp.task('css', function () {
    gulp.src('./dev/scss/*.scss')
        .pipe(sass({includePaths: ['/modules/']}))
        //.pipe(csso())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/assets/css'));
});

//  Concatinate all js files and minify it
gulp.task('js', function () {
    gulp.src('./dev/js/*.js')
        .pipe(uglify())
        .pipe(concat('default.js'))
        .pipe(gulp.dest('./public/assets/js'));
});

// Run PHP Server
gulp.task('php', function() {
    php.server({ base: './', port: 8010, keepalive: true});
});

gulp.task('browser-sync',['php'], function() {
    browserSync({
        proxy: '127.0.0.1:8010',
        port: 8080,
        open: true,
        notify: false
    });
});

// Watch and run css / js files with the command "gulp"
gulp.task('default',['browser-sync'], function () {
    // Run the css and js task on first run
    gulp.run('css', 'js');

    // Watch the CSS folder for changes
    gulp.watch('./dev/scss/*', function () {
        // Run the css task on changes
        gulp.run('css');
    });

    //Watch the JS folder for changes
    gulp.watch('./dev/js/*', function () {
        //Run the JS task on changes
        gulp.run('js');
    });

    gulp.watch('./*.php').on('change', function() {
        browserSync.reload();
    });

    // gulp.run('start-nodemon');
});
