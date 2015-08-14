/**
 *
 *  Gulp Metalsmith Bootstrap 3 Boilerplate
 *
 *  Joost van der Laan
 *  joostvanderlaan.nl
 *
 *
 */

'use strict';

/**
 * Load tasks from './gulp/tasks'
 */
// Needed later to split tasks in separate files
//var requireDir = require('require-dir');
//var dir = requireDir('./gulp/tasks/');


// http://christoph-rumpel.com/2014/02/how-to-laravel-series-lets-talk-gulp/
// Get modules
//var path = require('path');
var critical = require('critical');

// From google starter kit
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;

var exec = require('child_process').exec;

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];


// Lint JavaScript

gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe(reload({
            stream: true,
            once: true
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))

    .pipe($.notify({
        message: 'JsHint task complete'
    }));
});


// Task imagemin
gulp.task('images', function() {
    // minify new images only
    var imgSrc = './app/images/**/*.{png,gif,jpg,ico,svg}',
        imgDst = './dist/images';

    gulp.src(imgSrc)
        .pipe($.changed(imgDst))
        .pipe($.imagemin())
        .pipe(gulp.dest(imgDst))

    .pipe($.size({
        title: 'images'
    }));
});

// Generate responsive images in sizes large, medium small + original file
gulp.task('images-responsive', function(cb) {
    runSequence('images', 'image-large', 'image-medium', 'image-small', cb);
});

gulp.task('image-large', function() {
    // minify new images only
    var imgSrc = './app/images/**/*.{jpeg,jpg,png,tiff,webp}',
        imgDst = './dist/images';
    gulp.src(imgSrc)
        .pipe($.sharp({
            resize: [1024],
            // max : true,
            quality: 60,
            progressive: true
        }))
        .pipe($.rename(function(path) {
            path.basename += '-large';
        }))
        .pipe(gulp.dest(imgDst));
});

gulp.task('image-medium', function() {
    // minify new images only
    var imgSrc = './app/images/**/*.{jpeg,jpg,png,tiff,webp}',
        imgDst = './dist/images';
    gulp.src(imgSrc)
        .pipe($.sharp({
            resize: [640],
            // max : true,
            quality: 60,
            progressive: true
        }))
        .pipe($.rename(function(path) {
            path.basename += '-medium';
        }))
        .pipe(gulp.dest(imgDst));
});

gulp.task('image-small', function() {
    // minify new images only
    var imgSrc = './app/images/**/*.{jpeg,jpg,png,tiff,webp}',
        imgDst = './dist/images';
    gulp.src(imgSrc)
        .pipe($.sharp({
            resize: [320],
            // max : true,
            quality: 60,
            progressive: true
        }))
        .pipe($.rename(function(path) {
            path.basename += '-small';
        }))
        .pipe(gulp.dest(imgDst));
});

/*
.pipe(responsive([{
      name: 'logo.png',
      width: 200
    },{
      name: 'logo.png',
      width: 200 * 2,
      rename: 'logo@2x.png'
    },{
      name: 'background-*.png',
      width: 700
    },{
      name: 'cover.png',
      width: '50%'
    }]))
*/








// Copy All Files At The Root Level (src)
gulp.task('copy', function() {
    return gulp.src([
            'app/*',
            '!app/*.html',
            '!app/bower_components',
            '!app/templates',
            '!app/sripts-extra',
            'node_modules/apache-server-configs/dist/.htaccess'
        ], {
            dot: true
        })
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'copy'
        }));
});

// Copy All Files At The Root Level (src)
gulp.task('copymetalsmithtoroot', function() {
    return gulp.src([
            'dist/metalsmith-dist/**/*'
        ], {
            dot: true
        })
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'copy metalsmith-dist to dist root'
        }));
});

// Fonts
gulp.task('fonts', function() {
    var fontSrc = ([
            'bower_components/font-awesome/fonts/fontawesome-webfont.*',
            'app/fonts/oswald-*-webfont.*',
            'app/fonts/pt_sans-*-webfont.*',
            'app/fonts/icomoon.*',
        ]),
        fontDst = './dist/fonts/';

    gulp.src(fontSrc)
        .pipe($.changed(fontDst))
        .pipe(gulp.dest('dist/fonts/'))
        .pipe($.size({
            title: 'fonts'
        }))
        // .pipe($.gzip())
        // Better compression algorithm, at least for fonts
        .pipe($.zopfli())
        .pipe(gulp.dest('dist/fonts/'))
        .pipe($.size({
            title: 'fonts gz'
        }));
});



// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function() {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
            'app/styles/*.scss',
            'app/styles/**/*.css'
            //  'app/styles/components/components.scss'
        ])
        .pipe($.changed('styles', {
            extension: '.scss'
        }))
        .pipe($.sass({
            precision: 10
        }))
        .on('error', console.error.bind(console))
        .pipe($.autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest('dist/styles'))
        // Concatenate And Minify Styles
        .pipe($.if('*.css', $.csso()))
        .pipe($.rename(function(path) {
            if (path.extname === '.css') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.gzip())
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size({
            title: 'styles'
        }));
});

/*
        .pipe(rename(function(path) {
            if (path.extname === '.css') {
                path.basename += '.min';
            }
        }))
*/

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function() {
    var assets = $.useref.assets({
        searchPath: '{.tmp,app}'
    });

    return gulp.src('app/metalsmith-dist/**/*.html')
        .pipe(assets)
        // Concatenate And Minify JavaScript
        .pipe($.if('*.js', $.uglify({
            preserveComments: 'some'
        })))
        // .pipe(uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))

    // Remove Any Unused CSS
    // In projects using CSS frameworks like Bootstrap, Foundation and so forth you typically don’t use the entire kitchen-sink of styles available. Rather than shipping the full framework to production, use UnCSS to remove unused styles across your pages. Some developers have seen anything up to 85% savings in stylesheet filesize.
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.

    .pipe($.if('*.css', $.uncss({
        html: [
            'app/metalsmith-dist/index.html'
            /*
            'app/index.html',
            'app/styleguide.html',
            */
        ],

        // CSS Selectors for UnCSS to ignore - For example for Off canvas by Jasny Bootstrap or Scotch Panels
        ignore: [
            /.navdrawer-container.open/,
            /.app-bar.open/
        ]
    })))

    // Concatenate And Minify Styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        // Update Production Style Guide Paths
        //    .pipe($.replace('components/components.css', 'components/main.min.css'))
        // Minify Any HTML
        .pipe($.if('*.html', $.minifyHtml()))
        // Output Files
        .pipe(gulp.dest('dist'))
        .pipe($.size({
            title: 'html'
        }));
});



// Task clean the build folder - Removes all files from the dist folder
// Clean Output Directorys
gulp.task('clean', del.bind(null, ['.tmp', 'dist', '!CNAME'], {
    dot: true
}));

gulp.task('metalsmith-clean', del.bind(null, ['.tmp', 'app/metalsmith-dist'], {
    dot: true
}));

// Watch Files For Changes & Reload
gulp.task('serve', ['styles'], function() { //, 'metalsmith'
    browserSync({
        notify: false,
        // Customize the BrowserSync console logging prefix
        logPrefix: 'JOOST',
        // Show me additional info about the process
        // logLevel: "debug",
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        // server: ['.tmp', 'app'] // DEFAULT by Google Web Starter Kit
        server: {
            baseDir: ['.tmp', 'app/metalsmith-dist', 'app'],
            routes: {
                // Asset folders need to be added to work with Metalsmith subfolders
                /*
                "/bower_components": "./bower_components",
                "styles": "./styles",
                "scripts": "./scripts",
                "/images": "./images",
                */
                "/fonts": "./dist/fonts",
                // for srcset responsive images loading
                "/images": "./dist/images"

            }
        }
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], reload);
    //    gulp.watch(['metalsmith/src/**/*.md'], ['metalsmith'], reload);
    //    gulp.watch(['metalsmith/templates/**/*.hbt'], ['metalsmith'], reload);
});



// Build and serve the output from the dist build
gulp.task('serve:dist', ['critical'], function() {
    browserSync({
        notify: false,
        logPrefix: 'JOOST',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'dist'
    });
});



// Build Production Files, the Default Task
/* GOOGLE CODE:
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['jshint', 'html', 'images', 'fonts', 'copy'], cb);
});
*/
gulp.task('default', ['clean'], function(cb) {
    runSequence('styles', ['jshint', 'html', 'images-responsive', 'fonts', 'copy'], 'copymetalsmithtoroot', cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
    // By default, we use the PageSpeed Insights
    // free (no API key) tier. You can use a Google
    // Developer API key if you have one. See
    // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
    url: 'https://example.com',
    strategy: 'mobile'
}));

// If you just want to run a command, just run the command, don't use the gulp-exec plugin
gulp.task('metalsmith', function(cb) { // You can also run: 'node --harmony metalsmith/index.js' from root dir
    exec('node --harmony metalsmith/index.js', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})



// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }

// Critical Render path CSS tasks - https://github.com/addyosmani/critical-path-css-demo#tutorial
gulp.task('copystyles', function() { // Copy our site styles to a site.css file for async loading later
    return gulp.src(['dist/styles/main.css'])
        .pipe($.rename({
            basename: 'site'
        }))
        .pipe(gulp.dest('dist/styles'));
});

// Generate & Inline Critical-path CSS
gulp.task('critical', function(cb) {
    runSequence(['default'], ['criticalstyles'], cb);
});
gulp.task('criticalstyles', ['copystyles'], function(cb) {
    // At this point, we have our
    // production styles in main/styles.css
    // As we're going to overwrite this with
    // our critical-path CSS let's create a copy
    // of our site-wide styles so we can async
    // load them in later. We do this with
    // 'copystyles' above
    critical.generateInline({
        base: 'dist/',
        src: 'index.html',
        styleTarget: '/styles/main.css',
        htmlTarget: 'index.html',
        width: 320,
        height: 480,
        minify: true
    }, cb);
});

// Deploy to GitHub Pages
var deploy = require('gulp-gh-pages');

// deploy 'dist' folder to mwhelan.github.io github repo, master branch
var options = {
    //   remoteUrl: 'https://github.com/joostvanderlaan/gulpax.git',
    branch: 'gh-pages'
};

gulp.task('deploy', function() {
    gulp.src(['dist/**/*.*', 'dist/CNAME'])
        .pipe(deploy(options));
});
