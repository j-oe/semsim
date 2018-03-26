/** semsim App Build file 
	(c) Jan Oevermann, 2017
	License: MIT
*/

/* Base dependencies */
var gulp = require('gulp'),
	bower = require('gulp-bower'),
	requirejs = require('requirejs'),
	mainBowerFiles = require('main-bower-files');

/* spectre.css/LESS dependencies */
var less = require('gulp-less'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix');

var r = {
	appDir: 'src',
	baseUrl: 'scripts',
	dir: 'dist',
	removeCombined: true,
	paths: { 
		/* worker */
		'smWorker': 	'worker/similarities-worker',
		'dfWorker': 	'worker/diffing-worker',
		/* core */
		'core': 		'../core',
		'modules': 		'../core/modules',
		'utilities': 	'../core/utilities',
		'conf': 		'../core/configs',
		'configs': 		'../core/configs',
		/* 3rd party*/
		'd3': 			'../vendor/d3',
		'mg': 			'../vendor/metricsgraphics',
		'zip': 			'../vendor/jszip',
		'selectize': 	'../vendor/selectize',
		'jquery': 		'../vendor/jquery',
		'localforage': 	'../vendor/localforage',
		'microplugin': 	'../vendor/microplugin',
		'sifter': 		'../vendor/sifter',
		'almond': 		'../vendor/almond',
		'diff': 		'../vendor/diff'
	},
	modules: [
		/* main modules */
		{ name: 'main' },
		{ name: 'view/plot' },
		{ name: 'selectize' },
		/* smWorker */
		{
			name: 'smWorker',
			include: ['almond'],
			insertRequire: ['smWorker'],
			wrap: true
		},
		/* dfWorker */
		{
			name: 'dfWorker',
			include: ['almond'],
			insertRequire: ['dfWorker'],
			wrap: true
		}
	],
	pragmasOnSave: {
        importScripts: true
    },
	optimizeCss: 'standard.keepComments',
	writeBuildTxt: true,
	uglify2: { 
		mangle: true 
	},
	wrap: true,
	fileExclusionRegExp: /^\.|node_modules/,
	preserveLicenseComments: false
};

gulp.task('vendor', ['spectre'], function(){
    gulp.src(mainBowerFiles()).pipe(gulp.dest('./src/vendor'));
});

gulp.task('update', function() {
	return bower({
		cmd: 'update'
	});
});

gulp.task('spectre', function(){
	var autoprefix= new LessPluginAutoPrefix({ browsers: ["last 4 versions"] });

    gulp.src('./bower_components/spectre.css/*.less')
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(gulp.dest('./bower_components/spectre.css/dist'));
});

gulp.task('build', ['vendor'], function(cb){
    requirejs.optimize(r, function (buildResponse) {
	    console.log(buildResponse);
	    cb();
	}, function(err) {
	    console.log(err);
	    cb(err);
	});
});

gulp.task('default', [ 'vendor' ]);