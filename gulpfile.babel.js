import fs from "fs";
import { task, src, dest, series, watch } from 'gulp';
import babelify from 'babelify';
import log from "fancy-log";

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
	return compileJSFiles(
		[
			'src/scripts/*.js',
			'src/scripts/**/**/*.js',
			'!src/scripts/**/**/_/*',
			'!src/scripts/**/**/_/**/*',
			'!src/scripts/utils/*.js',
			"!src/scripts/locales/**/*.js",
			"!src/scripts/lib/*.min.js"
		],
		`build/${target}/scripts`
	);
});
task("locales", () => {
	return src('src/config/locales/*.yml')
		.pipe($.yaml())
		.pipe(dest(`build/${target}/config/locales`));
});

task('styles', () => {
	return compileStyleFiles('src/styles/**/*.scss', `build/${target}/styles`);
});
task('styles_views', () => {
	return compileStyleFiles('src/scripts/views/**/*.scss', `build/${target}/scripts/views`);
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
});

task(
	'build',
	series('clean', 'styles', 'styles_views', 'manifest', 'js', "locales", "assets")
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

		// değişikliklerde buildi tekrar başlatmak yerine, watch onchange yaparak değişikliği takip edip, src>pipe>dest yap
		let watcherJSFiles = watch('./src/**/*.js');
		let watcherStyleFiles = watch('src/styles/**/*.scss');
		let watcherViewsStyleFiles = watch('src/scripts/views/**/*.scss');
		let watcherAll = watch([
			'./src/**/*',
			'!./src/**/*.js'
		], series('build', "reloadExtension"));

		watcherJSFiles.on("change", function(e) {
			let filePath = e.split("/");
			let destPath = filePath.slice(1, -1).join("/");

			compileJSFiles(e, `build/${target}/${destPath}`);
			log(e, "file has replaced");
		});
		
		watcherStyleFiles.on("change", function(e) {
			let filePath = e.split("/");
			let destPath = filePath.slice(1, -1).join("/");

			compileJSFiles(e, `build/${target}/${destPath}`);
			log(e, "file has replaced");
		});

		watcherAll.on("change", function(e) {
			console.log("all watcher changed", e);
		});

		return watcherAll;
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

/**
 * HELPERS
 */
function compileJSFiles(files, path) {
	return src(files)
		.pipe($.bro({
			transform: [
				babelify.configure({ presets: ['latest'] }),
				['uglifyify', { global: true }]
			]
		}))
		.pipe(dest(path, { overwrite: true }));;
}

function compileStyleFiles(files, path) {
	return src(files)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'compressed',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.sourcemaps.write(`./`))
		.pipe(dest(path, { overwrite: true }));;
}