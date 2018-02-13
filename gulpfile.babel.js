'use strict';

import gulp             from 'gulp';
import browserSync      from 'browser-sync';
import gulpLoadPlugins  from 'gulp-load-plugins';
import chalk            from 'chalk';
import del              from 'del';
import gutil            from 'gulp-util';
import imagemin         from 'gulp-imagemin';

// PSI
import psiNgrok     from 'psi-ngrok'; // Tunneling for PSI support
import connect      from 'gulp-connect';
const port          = 8000;

// Testing Harness
import http         from 'http';
import kinect       from 'connect';
import serveStatic  from 'serve-static';
import selenium     from 'selenium-standalone';
import webdriver    from 'gulp-webdriver';
let httpServer;


let runSequence = require('run-sequence').use(gulp);
let $ = gulpLoadPlugins();

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
let IS_DEV = require('yargs').argv.dev || false;    // check if dev env

// ----------------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------------
const HOST_URL = 'http://m1.test';
const root = './skin/frontend/ally/default';
const PATHS = {
    dist: `${root}/dist`,
    tmp: '.tmp/',
    scripts: [`${root}/src/js/**/*.js`, `!${root}/src/js/**/*.spec.js`],
    tests: `${root}/src/js/**/*.spec.js`,
    styles: `${root}/src/scss/**/*.scss`,
    templates: `${root}/app/**/*.html`,
    modules: [],
    static: [
        // `${root}/index.html`,
        // `${root}/fonts/**/*`,
        `${root}/.htaccess`,
        `${root}/src/images/**/*`
    ],
    fonts: [
        `node_modules/bootstrap-sass/assets/fonts/bootstrap/**/*.*`,
        `node_modules/font-awesome/fonts/**/*.*`
    ]
};

// ----------------------------------------------------------------------------
// Tasks
// ----------------------------------------------------------------------------
gulp.task('default', ['build']);

gulp.task('build', () => runSequence('copy', 'styles', 'scripts', 'fonts', 'images'));

gulp.task('copy', ['clean'], () => {
    return gulp.src(PATHS.static)
        .pipe(gulp.dest(PATHS.dist));
});

gulp.task('clean', cb => del([`${PATHS.dist}/**/*`], cb));

gulp.task('fonts', () => {
    return gulp
        .src(PATHS.fonts)
        .pipe(gulp.dest(`${PATHS.dist}/fonts/`));
});


/* ==== CSS ==== */
gulp.task('styles', () => {
    let sassOptions = {
        style: 'expanded',
        outputStyle: 'compressed',
        precision: 10,
        includePaths: [
            './skin/frontend/rwd/default/scss'
            ]
    };

    isDevMode();

    return gulp
        .src(PATHS.styles)
        .pipe($.if(IS_DEV, $.sourcemaps.init()))
        .pipe($.plumber())
        .pipe($.sass(sassOptions)).on('error', errorHandler('Sass'))
        .pipe($.autoprefixer({browsers: ['last 5 version']})).on('error', errorHandler('Autoprefixer'))
        .pipe($.if(!IS_DEV, $.csso()))
        .pipe($.if(IS_DEV, $.sourcemaps.write('.')))
        .pipe(gulp.dest(`${PATHS.dist}/css`))
        .pipe($.size({showFiles: true}))
        .pipe(browserSync.stream());
});

/* ==== JS ==== */
gulp.task('scripts', ['script:app', 'script:vendor']);

gulp.task('script:app', () => {
    isDevMode();

    let _task = gulp
        .src(PATHS.scripts)
        .pipe($.if(IS_DEV, $.sourcemaps.init()))
        .pipe($.plumber())
        .pipe($.babel())

        // original -- app.js
        .pipe($.concat('app.js'))
        .pipe($.if(IS_DEV, $.sourcemaps.write('.')))
        .pipe(gulp.dest(`${PATHS.dist}/js/`))
        .pipe($.size({showFiles: true}));

    if (!IS_DEV) {
        _task
            .pipe($.uglify())
            .pipe(gulp.dest(`${PATHS.dist}/js/`))
            .pipe($.size({showFiles: true}));
    }

    _task.pipe(browserSync.stream());

    return _task;
});

gulp.task('script:vendor', () => {

    let scripts = [
        './node_modules/bootstrap/dist/js/bootstrap.min.js',
        //'src/js/script.js'
    ];

    return gulp
        .src(scripts)
        .pipe($.plumber())
        .pipe($.concat('vendors.js'))
        .pipe(gulp.dest(`${PATHS.dist}/js/`))
        .pipe($.size({showFiles: true}));
});

/* ==== IMAGES ==== */
gulp.task('images', () => {
    gulp.src(`${root}/src/images/**/*`)
        .pipe(imagemin())
        .pipe(gulp.dest(`${root}/src/images/**/*`))
});

/* ==== WATCH ==== */
gulp.task('watch', () => {

    gulp.watch(PATHS.styles, ['styles']);

    gulp.watch(PATHS.scripts, ['scripts']);
});

gulp.task('serve', ['watch'], () => browserSyncInit());


// Private
// ----------------------------------------------------------------------------

function browserSyncInit(browser) {
    browser = browser || 'default';

    let options = {
        port: 3000,
        proxy: {
            target: HOST_URL
        },
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-kp',
        notify: true,
        reloadDelay: 0, //1000,
        online: true,
        browser: browser
    };

    browserSync.instance = browserSync.init(options);
}

function isDevMode() {
    if (IS_DEV) {
        console.log(chalk.bgCyan.bold('                DEV Mode                 '));
        console.log(chalk.bgCyan.bold('                                         '));
    }
}

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
function errorHandler(title) {
    'use strict';

    return (err) => {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    };
};

// ----------------------------------------------------------------------------
// TEST HARNESSES
// ----------------------------------------------------------------------------

// PSI Score Retrieval
gulp.task('psi', () => {
  psiNgrok({
    pages: ['index.html'],
    port: port,
    onBeforeConnect: () => {
        return connect.server({ root: 'public', port: port })
    },
    onError: function (err) {
      console.log(err.toString());
      process.exit(-1);
    },
    onSuccess: () => {
        setTimeout(() => { process.exit(-1) },100)
    },
    options: { threshold: 80 }
  });
});

// Mocha Testrunner
gulp.task('http', done => {
  const app = kinect().use(serveStatic('build'));
  httpServer = http.createServer(app).listen(9000, done);
});

gulp.task('selenium', done => {
    selenium.install({
        logger (message) {
            process.stdout.write(`${message} \n`)
        },
        progressCb: (totalLength, progressLength) => {
            process.stdout.write(`Downloading drivers ${Math.round(progressLength / totalLength * 100)}% \r`)
        }
    }, err => {
        if (err) return done(err)

        selenium.start({
            spawnOptions: {
                stdio: 'ignore'
            }
        }, (err, child) => {
            selenium.child = child
            console.log('Selenium error: ', err)
            done()
        })
    })
})

gulp.task('test', ['http', 'selenium'], () => {
    return gulp.src('wdio.conf.js')
        .pipe(webdriver({
            logLevel: 'verbose',
            waitforTimeout: 12345,
            framework: 'mocha'
        })).once('end', () => {
            selenium.child.kill()
            httpServer.close()
        })
})
