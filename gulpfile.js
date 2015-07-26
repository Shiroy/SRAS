var gulp = require("gulp");
var gulp_util = require("gulp-util");
var plumber = require("plumber");
var order = require('gulp-order');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var packager = require('electron-packager')

gulp.task('js', function(){
    var res = gulp.src("assets/js/*.js")
    .pipe(order([
        'globals.js',
        'app.js',
        'boot.js',
        'views.js',
        'dialogs.js',
        'getApiKey.js',
        'connect.js',
        'messageDispatcher.js',
        'dashboard.js',
        'maps.js',
        'filters.js',
        'player.js'
    ]))
    .pipe(concat('sras.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/sras/assets/js'));

    return res;
})

gulp.task('angular', function()
{
    var stream = gulp.src('assets/js/angular/*.js')
    .pipe(gulp.dest('dist/sras/assets/js/angular'));

    return stream;
});

gulp.task('maps', function(){
    var stream = gulp.src('assets/maps/**')
    .pipe(gulp.dest('dist/sras/assets/maps'));

    return stream;
});

gulp.task('views', function(){
    var stream = gulp.src('assets/views/**')
    .pipe(gulp.dest('dist/sras/assets/views'));

    return stream;
});

gulp.task('css', function(){
    var stream = gulp.src('assets/css/**')
    .pipe(gulp.dest('dist/sras/assets/css'));

    return stream;
})

gulp.task('index', function(){
    var stream = gulp.src('indexProd.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist/sras'));

    return stream;
});

gulp.task('node_modules', function(){
    var stream = gulp.src(['node_modules/async', 'node_modules/angular-ui-router', 'node_modules/jade'])
    .pipe(gulp.dest('dist/sras/node_modules'));

    return stream;
})

gulp.task('main', function(){
    var stream = gulp.src(['main.js', 'package.json'])
    .pipe(gulp.dest('dist/sras'));

    return stream;
})

gulp.task("default", ['js', 'angular', 'maps', 'views', 'css', 'index', 'node_modules', 'main'], function(cb){
    var opts = {
        dir: 'dist/sras',
        name: 'sras',
        platform: 'win32',
        arch: 'x64',
        version: '0.30.1',
        asar: true
    }

    packager(opts, function(err, appPath){
        if(err)
            cb(err);
        else {
            console.log(appPath);
            cb(null);
        }
    })
});
