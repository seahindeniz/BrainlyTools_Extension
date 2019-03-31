import { task, src, dest, series, watch } from 'gulp';
import babelify from 'babelify';
import log from "fancy-log";
import colors from "colors";
import syncReq from "sync-request";

import extensionOptions from "./src/config/_/extension";

const $ = require('gulp-load-plugins')();

const styleGuideManifest = JSON.parse(
	syncReq("GET", "https://raw.githubusercontent.com/brainly/style-guide/master/package.json").getBody('utf8')
);

var isProduction = process.env.NODE_ENV === "production";
var target = process.env.TARGET || "chrome";

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
				"id": ""
			}
		}
	}
}

// Clean previous build
task('clean', () => {
	return src(`./build/${target}`, { allowEmpty: true })
		.on('end', () => log('Waiting for 1 second before clean..'))
		.pipe($.wait(1000))
		.pipe($.clean());
})

/**
 * COMMON
 */
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
		fileName: "extension.json"
	};

	if (isProduction) {
		mergeJsonData.endObj = extensionOptions.production;
	} else {
		mergeJsonData.endObj = extensionOptions.dev;
	}

	mergeJsonData.endObj.STYLE_GUIDE_VERSION = styleGuideManifest.version;

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
		fileName: "manifest.json"
	};

	if (target === "firefox") {
		mergeJsonData.endObj = manifest.firefox
	} else if (isProduction) {
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
	next => {
		$.livereload.reload();
		next();
	}
);

task(
	"watchFiles",
	() => {
		$.livereload.listen();

		let watchJSFilesNeedsOnlyReload = watch([
			'./src/scripts/views/*/*.js',
			'./src/scripts/*.js',

			'!./src/scripts/views/**/_/*.js',
			'!./src/scripts/views/**/_/**/*.js',
		], series("reloadExtension"));
		let watchJSFilesNeedsToReBuild = watch([
			'./src/**/*.js',
			'./src/scripts/views/**/_/*.js',
			'./src/scripts/views/**/_/**/*.js',

			'!./src/scripts/views/*/*.js',
			'!./src/scripts/*.js'
		], series('build', "reloadExtension"));
		let watchSCSSFilesNeedsOnlyReload = watch(
			[
				'src/styles/**/*.scss',
				'src/scripts/views/**/*.scss'
			], series("reloadExtension"));
		let watchAllFilesNeedsToReBuild = watch(
			[
				'./src/**/*',

				'!./src/**/*.js',
				'!./src/config/_/extension.json',
				'!src/styles/**/*.scss',
				'!src/scripts/views/**/*.scss'
			],
			series('build', "reloadExtension"));

		watchJSFilesNeedsToReBuild.on("change", function(path) {
			log.info(colors.green(path), "has changed, rebuilding");
		});
		watchJSFilesNeedsOnlyReload.on("change", function(path) {
			let filePath = path.split("/");
			let destPath = filePath.slice(1, -1).join("/");
			let fileName = filePath.pop();
			let destFullPath = `build/${target}/${destPath}/${fileName}`;

			compileJSFiles(path, `build/${target}/${destPath}`);

			log.info(colors.green(path), "has replaced with", colors.magenta(destFullPath));
		});

		watchSCSSFilesNeedsOnlyReload.on("change", function(path) {
			let filePath = path.split("/");
			let destPath = filePath.slice(1, -1).join("/");
			let fileName = filePath.pop().split(".");
			fileName.pop();
			fileName = fileName.join(".");
			let destFullPath = `build/${target}/${destPath}/${fileName}.css`;

			compileStyleFiles(path, `build/${target}/${destPath}`);

			log.info(colors.green(path), "has replaced with", colors.magenta(destFullPath));
		});

		watchAllFilesNeedsToReBuild.on("change", function(path) {
			log.info(colors.green(path), "has changed, rebuilding");
		});

		return watchAllFilesNeedsToReBuild;
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

/**
 * DIST
 */
task(
	'zip',
	() => {
		return src(`./build/${target}/**/*`)
			.pipe($.zip(`${target}-${process.env.npm_package_version}.zip`))
			.pipe(dest('./dists'))
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
				babelify.configure({
					presets: [
						'@babel/preset-env',
						{
							plugins: [
								'@babel/plugin-transform-runtime',
								[
									"babel-plugin-inline-import", {
										"extensions": [
											".html"
										]
									}
								]
							]
						}
					]
				}),
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
