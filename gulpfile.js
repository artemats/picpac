const { gulp, src, dest, watch, series, parallel } = require('gulp');
const { task } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync').create();
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-html-minifier2');
const rigger = require('gulp-rigger');
const del = require('del');
const cache = require('gulp-cache');
const gcmq = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

const files = {
    scssPath: [ 'src/sass/main.scss' ],
    jsPath: ['src/libs/jquery-3.3.1.min.js', 'src/libs/*.js', 'src/js/script.js'],
    htmlPath: [ 'src/html/*.html' ],
};

// WATCH TASKS //

function browserSync() {

    browsersync.init({
        server: {
            baseDir: 'dist'
        },
        notify: false,
        port: 3090,
    });

}

function scssTask() {
    return src(files.scssPath)
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            overrideBrowserslist: [ 'last 5 versions' ],
            cascade: false
        }))
        .pipe(postcss([ cssnano() ]))
        .pipe(gcmq('main.css'))
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest('dist/css'))
        .pipe(browsersync.stream());
}

function jsTask() {
    return src(files.jsPath)
        .pipe(babel())
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browsersync.stream());
}

function htmlTask() {
    return src(files.htmlPath)
        .pipe(rigger())
        .pipe(htmlmin({
            collapseWhitespace: false
        }))
        .pipe(dest('src/pages'))
        .pipe(browsersync.stream());
}

function clearCache() {
    return cache.clearAll();
}

function watchTask() {

    watch('src/sass/**/*', parallel(scssTask));
    watch(['src/js/script.js'], parallel(jsTask));
    watch('src/html/**/*', htmlTask);
    watch('src/pages/*', moveHtml);

}

exports.default = series(
    parallel(watchTask, clearCache, htmlTask, scssTask, jsTask, browserSync)
);

// BUILD TASKS //

function removeBuild() {
    return del('dist');
}
function moveImages() {
    return src('src/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            // imagemin.jpegtran({progressive: true}),
            // imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest('dist/img/'));
}
function moveFonts() {
    return src('src/fonts/**/*').pipe(dest('dist/fonts/'));
}
function moveHtml() {
    return src('src/pages/*').pipe(dest('dist'));
}

function svg() {

    return src('src/img/icons/*')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
                $('[class]').removeAttr('class');
                $('[width]').removeAttr('width');
                $('[height]').removeAttr('height');
                $('[style]').remove();
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(dest('src/img/'))

}

function moveScrollPlugin() {
    return src([
        'src/gsap.min.js',
        'src/ScrollMagic.min.js',
        'src/animation.gsap.min.js',
        'src/debug.addIndicators.min.js'
    ]).pipe(dest('dist/js'));
}

function moveVideos() {
    return src('src/video/*').pipe(dest('dist/video'));
}

exports.build = series(
    removeBuild,
    parallel(htmlTask, scssTask, jsTask),
    moveHtml,
    moveFonts,
    moveImages,
    svg,
    moveScrollPlugin,
    moveVideos
);