const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const paths = {
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	dist: './dist',
	sassDest: './dist/css',
	jsDest: './dist/js',
};

function sassCompiler(done) {
	src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest));
	done();
}

function javaScript(done) {
	src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/preset-env'],
			})
		)
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest));
	done();
}

function cleanStuff(done) {
	src(paths.dist, { read: false }).pipe(clean());
	done();
}

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: './',
		},
		browser: ['chrome', 'firefox'],
	});
	done();
}

function watchForChanges(done) {
	watch('./*.html').on('change', reload);
	watch([paths.sass, paths.js], parallel(sassCompiler, javaScript)).on('change', reload);
	done();
}

exports.cleanStuff = cleanStuff;
const mainFunctions = parallel(sassCompiler, javaScript);
exports.default = series(mainFunctions, startBrowserSync, watchForChanges);
