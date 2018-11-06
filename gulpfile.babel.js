import fs from "fs";
import gulp from 'gulp';
import { merge } from 'event-stream'
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import preprocessify from 'preprocessify';
import gulpif from "gulp-if";
import bro from "gulp-bro";
import yaml from "gulp-yaml";

const $ = require('gulp-load-plugins')();

var production = process.env.NODE_ENV === "production";
var target = process.env.TARGET || "chrome";
var environment = process.env.NODE_ENV || "development";

var generic = JSON.parse(fs.readFileSync(`./config/${environment}.json`));
var specific = JSON.parse(fs.readFileSync(`./config/${target}.json`));
var context = Object.assign({}, generic, specific);

var manifest = {
	dev: {
		"version": process.env.npm_package_version,
		"background": {
			"scripts": [
				"scripts/livereload.js",
				"scripts/lib/jquery-3.3.1.min.js",
				"scripts/background.js"
			]
		}
	},

	production: {
		"version": process.env.npm_package_version
	},

	firefox: {
		"applications": {
			"gecko": {
				"id": "my-app-id@mozilla.org"
			}
		}
	}
}
// Tasks
gulp.task('clean', () => {
	return pipe(`./build/${target}`, $.clean())
})

gulp.task('build', (cb) => {
	$.runSequence('clean', 'styles', 'views_styles', 'ext', cb)
});

gulp.task('watch', ['build'], () => {
	$.livereload.listen();

	gulp.watch(['./src/**/*']).on("change", () => {
		$.runSequence('build', $.livereload.reload);
	});
});

gulp.task('default', ['build']);

gulp.task('ext', ['manifest', 'js', 'js-min', "js-config", "locales"], () => {
	return mergeAll(target)
});

// -----------------
// COMMON
// -----------------
gulp.task('js', () => {
	return gulp.src([
			'src/scripts/*.js',
			'src/scripts/**/**/*.js',
			'!src/scripts/utils/*.js',
			"!src/scripts/locales/**/*.js",
			"!src/scripts/lib/*.min.js"
		])
		.pipe(bro({
			transform: [
				babelify.configure({ presets: ['latest'] }),
				['uglifyify', { global: true }]
			]
		}))
		.pipe(gulp.dest(`build/${target}/scripts`));
});
gulp.task('js-min', () => {
	return gulp.src([
			"src/scripts/**/*.min.js"
		])
		.pipe(gulp.dest(`build/${target}/scripts`));
});
gulp.task("locales", () => {
	return gulp.src([
			'src/config/*.json'
		])
		.pipe(gulp.dest(`build/${target}/config`));
});
gulp.task("js-config", () => {
	return gulp.src('src/config/locales/*.yml')
		.pipe(yaml())
		.pipe(gulp.dest(`build/${target}/config/locales`));
});

gulp.task('styles', () => {
	return gulp.src([
			'src/styles/**/*.scss',
		])
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'compressed',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.sourcemaps.write(`./`))
		.pipe(gulp.dest(`build/${target}/styles`));
});
gulp.task('views_styles', () => {
	return gulp.src('src/scripts/views/**/*.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'compressed',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.sourcemaps.write(`./`))
		.pipe(gulp.dest(`build/${target}/scripts/views`));
});

gulp.task("manifest", () => {
	return gulp.src('./manifest.json')
		.pipe(gulpif(!production, $.mergeJson({
			fileName: "manifest.json",
			jsonSpace: " ".repeat(4),
			endObj: manifest.dev
		})))
		.pipe(gulpif(production, $.mergeJson({
			fileName: "manifest.json",
			jsonSpace: " ".repeat(4),
			endObj: manifest.production
		})))
		.pipe(gulpif(target === "firefox", $.mergeJson({
			fileName: "manifest.json",
			jsonSpace: " ".repeat(4),
			endObj: manifest.firefox
		})))
		.pipe(gulp.dest(`./build/${target}`))
});

// -----------------
// DIST
// -----------------
gulp.task('dist', (cb) => {
	$.runSequence('build', 'zip', cb)
});

gulp.task('zip', () => {
	return pipe(`./build/${target}/**/*`, $.zip(`${target}-${process.env.npm_package_version}.zip`), './dist')
})

// Helpers
function pipe(src, ...transforms) {
	return transforms.reduce((stream, transform) => {
		const isDest = typeof transform === 'string'
		return stream.pipe(isDest ? gulp.dest(transform) : transform)
	}, gulp.src(src))
}

function mergeAll(dest) {
	return merge(
		pipe('./src/icons/**/*', `./build/${dest}/icons`),
		pipe(['./src/_locales/**/*'], `./build/${dest}/_locales`),
		pipe([`./src/images/${target}/**/*`], `./build/${dest}/images`),
		pipe(['./src/images/shared/**/*'], `./build/${dest}/images`),
		pipe(['./src/**/*.html'], `./build/${dest}`)
	)
}

function buildJS(target) {
	const files = [
		'background.js',
		'contentscript.js',
		'options.js',
		'popup.js',
		'livereload.js'
	]

	let tasks = files.map(file => {
		return browserify({
				entries: 'src/scripts/' + file,
				debug: true
			})
			.transform('babelify', { presets: ['es2015'] })
			.transform(preprocessify, {
				includeExtensions: ['.js'],
				context: context
			})
			.bundle()
			.pipe(source(file))
			.pipe(buffer())
			.pipe(gulpif(!production, $.sourcemaps.init({ loadMaps: true })))
			.pipe(gulpif(!production, $.sourcemaps.write('./')))
			.pipe(gulpif(production, $.uglify({
				"mangle": false,
				"output": {
					"ascii_only": true
				}
			})))
			.pipe(gulp.dest(`build/${target}/scripts`));
	});

	return merge.apply(null, tasks);
}
