import fs from "fs";
import { task, src, dest, series, parallel, watch } from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';

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
task('clean', () => {
	return src(`./build/${target}`)
		.pipe($.clean());
})

// -----------------
// COMMON
// -----------------
task('js', () => {
	return src([
			'src/scripts/*.js',
			'src/scripts/**/**/*.js',
			'!src/scripts/utils/*.js',
			"!src/scripts/locales/**/*.js",
			"!src/scripts/lib/*.min.js"
		])
		.pipe($.bro({
			transform: [
				babelify.configure({ presets: ['latest'] }),
				['uglifyify', { global: true }]
			]
		}))
		.pipe(dest(`build/${target}/scripts`));
});
task("locales", () => {
	return src('src/config/locales/*.yml')
		.pipe($.yaml())
		.pipe(dest(`build/${target}/config/locales`));
});

task('styles', () => {
	return src([
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
		.pipe(dest(`build/${target}/styles`));
});
task('styles_views', () => {
	return src('src/scripts/views/**/*.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'compressed',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.sourcemaps.write(`./`))
		.pipe(dest(`build/${target}/scripts/views`));
});

task("manifest", () => {
	return src('./manifest.json')
		.pipe($.if(!production, $.mergeJson({
			fileName: "manifest.json",
			jsonSpace: " ".repeat(4),
			endObj: manifest.dev
		})))
		.pipe($.if(production, $.mergeJson({
			fileName: "manifest.json",
			jsonSpace: " ".repeat(4),
			endObj: manifest.production
		})))
		.pipe($.if(target === "firefox", $.mergeJson({
			fileName: "manifest.json",
			jsonSpace: " ".repeat(4),
			endObj: manifest.firefox
		})))
		.pipe(dest(`./build/${target}`))
});
/*task('js-min', () => {
	return src([
			"src/scripts/** /*.min.js"
		])
		.pipe(dest(`build/${target}/scripts`));
});
task("market-configs", () => {
	return src([
			'src/config/*.json'
		])
		.pipe(dest(`build/${target}/config`));
});*/
task("assets", (cb) => {
	let assets = [{
			src: './src/icons/**/*',
			dest: `./build/${target}/icons`
		},
		{
			src: './src/_locales/**/*',
			dest: `./build/${target}/_locales`
		},
		{
			src: `./src/images/${target}/**/*`,
			dest: `./build/${target}/images`
		},
		{
			src: './src/images/shared/**/*',
			dest: `./build/${target}/images`
		},
		{
			src: './src/**/*.html',
			dest: `./build/${target}`
		},
		{
			src: "src/scripts/**/*.min.js",
			dest: `build/${target}/scripts`
		},
		{
			src: "src/config/*.json",
			dest: `build/${target}/config`
		}
	];

	assets = assets.map(function(asset) {
		return src(asset.src)
			.pipe(dest(asset.dest));
	});

	return assets[assets.length - 1]
})
task(
	'ext',
	series('manifest', 'js', "locales", "assets"));

task(
	'build',
	series('clean', 'styles', 'styles_views', 'ext')
);
task(
	"reloadExtension",
	callback => {
		$.livereload.reload();
		callback();
	}
);
task(
	"watchFiles",
	() => {
		$.livereload.listen();

		return watch('./src/**/*', series('build', "reloadExtension"));
	}
);

task(
	'watch',
	series('build', "watchFiles")
);

task(
	'default',
	series('build')
);

// -----------------
// DIST
// -----------------
task(
	'zip',
	() => {
		return src(`./build/${target}/**/*`)
			.pipe($.zip(`${target}-${process.env.npm_package_version}.zip`))
			.pipe(dest('../dists'))
	}
);

task(
	'dist',
	series('build', 'zip')
);
