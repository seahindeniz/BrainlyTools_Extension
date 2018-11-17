import fs from "fs";
import { task, src, dest, series, watch } from 'gulp';
import babelify from 'babelify';
import log from "fancy-log";
import colors from "colors";

import extensionOptions from "./src/config/_/extension";

const $ = require('gulp-load-plugins')();

var production = process.env.NODE_ENV === "production";
var target = process.env.TARGET || "chrome";
var environment = process.env.NODE_ENV || "development";

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
	return src(`./build/${target}`, { allowEmpty: true })
		.pipe($.clean());
})

// -----------------
// COMMON
// -----------------
task("assets", () => {
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

task("extensionConfig", () => {
	let mergeJsonData = {
		fileName: "extension.json",
		jsonSpace: " ".repeat(4),
	};

	if (production) {
		mergeJsonData.endObj = extensionOptions.production;
	} else {
		mergeJsonData.endObj = extensionOptions.dev;
	}

	return src('./src/config/_/extension.json')
		.pipe($.mergeJson(mergeJsonData))
		.pipe(dest(`./src/config/_`))
});

task('styles', () => {
	return compileStyleFiles([
		'src/styles/**/*.scss',
		'src/styles/**/**/*.scss',
		'!src/styles/_/**/*.scss'
	], `build/${target}/styles`);
});

task("locales", () => {
	return src('src/locales/*.yml')
		.pipe($.yaml())
		.pipe(dest(`build/${target}/locales`));
});

task('popup', () => {
	return compileJSFiles(
		[
			'src/popup/*.js'
		],
		`build/${target}/popup`
	);
});

task('js', () => {
	return compileJSFiles(
		[
			'src/scripts/*.js',
			'src/scripts/**/**/*.js',

			'!src/scripts/**/**/_/*',
			'!src/scripts/**/**/_/**/*',
			'!src/scripts/components/**/*.js',
			'!src/scripts/controllers/**/*.js',
			'!src/scripts/helpers/**/*.js',
			'!src/scripts/utils/*.js',
			"!src/scripts/lib/*.min.js"
		],
		`build/${target}/scripts`
	);
});

task("manifest", () => {
	let mergeJsonData = {
		fileName: "manifest.json",
		jsonSpace: " ".repeat(4),
	};

	if (target === "firefox") {
		mergeJsonData.endObj = manifest.firefox
	} else if (production) {
		mergeJsonData.endObj = manifest.production
	} else {
		mergeJsonData.endObj = manifest.dev
	}

	return src('./manifest.json')
		.pipe($.mergeJson(mergeJsonData))
		.pipe(dest(`./build/${target}`))
});

task(
	'build',
	series('clean', "assets", "extensionConfig", 'styles', "locales", "popup", 'js', 'manifest')
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

		let watcherJSFiles = watch('./src/**/*.js', series("reloadExtension"));
		let watcherStyleFiles = watch(
			[
				'src/styles/**/*.scss',
				'src/scripts/views/**/*.scss'
			], series("reloadExtension"));
		let watcherAll = watch(
			[
				'./src/**/*',
				'!./src/**/*.js',
				'!./src/config/_/extension.json',
				'!src/styles/**/*.scss',
				'!src/scripts/views/**/*.scss'
			],
			series('build', "reloadExtension"));

		watcherJSFiles.on("change", function(path) {
			let filePath = path.split("/");
			let destPath = filePath.slice(1, -1).join("/");
			let fileName = filePath.pop();
			let destFullPath = `build/${target}/${destPath}/${fileName}`;

			compileJSFiles(path, `build/${target}/${destPath}`);

			log.info(colors.green(path), "has replaced with", colors.magenta(destFullPath));
		});

		watcherStyleFiles.on("change", function(path) {
			let filePath = path.split("/");
			let destPath = filePath.slice(1, -1).join("/");
			let fileName = filePath.pop().split(".");
			fileName.pop();
			fileName = fileName.join(".");
			let destFullPath = `build/${target}/${destPath}/${fileName}.css`;

			compileStyleFiles(path, `build/${target}/${destPath}`);

			log.info(colors.green(path), "has replaced with", colors.magenta(destFullPath));
		});

		watcherAll.on("change", function(path) {
			log.info(colors.green(path), "has changed, rebuilding");
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
