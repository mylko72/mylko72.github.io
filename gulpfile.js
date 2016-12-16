'use strict';

// node modules
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const browserSync = require('browser-sync');
const vfb = require('vinyl-ftp-branch');
const ftp = require('vinyl-ftp');
const del = require('del');
const lazypipe = require('lazypipe');

// gulp modules
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const spritesmith = require('gulp.spritesmith');
const md5 = require('gulp-md5-plus');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');

// notification
const notify = require("gulp-notify");

// postcss
const autoprefixer = require('autoprefixer');
const urlRebase = require('postcss-url');

var paths = {
	sprite_src: 'src/',
	sprite_dest: 'dest/img/',
	css_src: 'src/',
	css_dest: 'dest/',
	img_dest: 'src/',
	html_src: './'
};

var config = {
	browserSync: true,
	notify: true,
	urlRebase: true,
	urlRebaseOption: {
		basePath: paths.img_dest,
		defaultUrl: 'https://ssl.pstatic.net/sstatic/search/mobile/2016/',
		urlList: {
			'sprite/': 'https://ssl.pstatic.net/sstatic/search/mobile/2016/',
		},
	},
	md5: true,
}

function getFolders(dir) {
	return fs.readdirSync(dir)
		.filter(function (file) {
			if(file === 'scss'){
				return;
			}
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
};
var globalOptions = {
	notify: !config.notify ? {} : {
		errorHandler: notify.onError({
			title: '<%= error.relativePath %>',
			message: '<%= error.line %> line - <%= error.messageOriginal %>',
			sound: "Pop",
		})
	}
};
var collectionOptions = process.argv.slice(2),	//명령어 실행시 입력한 option list
	collectionTask = [],
	isSetOption = false;
var optionsToCollection = function(options){
	if(options.length <= 0){
		return;
	}
	options.forEach(function(dirName){
		dirName = dirName.replace(/(^\w+)|(\-)|(\s)/g, '');
		if(dirName!==''){
			collectionTask.push(dirName);
			isSetOption = true;
		}
	});
};
optionsToCollection(collectionOptions);
var collection = isSetOption ? collectionTask : getFolders(paths.css_src);	//옵션으로 입력한 폴더명이 있는 경우엔 해당 폴더만, 아니면 전체 폴더 대상으로 gulp 실행
console.log('옵션 설정 컬렉션 : '+collection);

gulp.task('default', ['watch', 'browserSync']);
gulp.task('dev', ['sass','sprite']);
gulp.task('build', ['sass-build','sprite','md5-sprite']);

gulp.task('watch', ['sprite','sass'], function () {
	if(isSetOption){						//default 특정 컬렉션을 옵션으로 지정하지 않은 경우
		gulp.watch([path.join(paths.css_src, '/**/scss/*')], ['sass']);
		gulp.watch([path.join(paths.sprite_src, '/**/sprite/*')], ['sprite']);
		return;
	}
	collection.forEach(function(dirName){
		gulp.watch([path.join(paths.css_src, dirName+'/scss/*')], ['sass']);
		gulp.watch([path.join(paths.sprite_src, dirName+'/sprite/*')], ['sprite']);
	});
});

gulp.task('sprite',['makeSprite','makeSpriteMap']);
gulp.task('makeSprite', function () {
	var stream_arr = [];
	var options = {
		spritesmith: function(folder) {
			var folder = folder.replace(/\d{2}\_/g,'');
			return {
				imgPath: '../img/sp_' + folder + '.png',	//collection 내부 img 폴더로 sprite image 경로 설정
				imgName: 'sp_' + folder + '.png',
				cssName: '_sp_' + folder + '.scss',
				cssFormat: 'scss',
				padding: 4,
				cssTemplate: './gulpconf/sprite_template.hbs',
				cssSpritesheetName: 'sp_' + folder,
			}
		},
	};
	collection.map(function(folder) {
			var spriteData = gulp.src(path.join(paths.sprite_src, folder, 'sprite/*.png'))
				.pipe(plumber(globalOptions.notify))
				.pipe(spritesmith(options.spritesmith(folder)));
			stream_arr.push(new Promise(function(resolve) {
				spriteData.img
					.pipe(gulp.dest(paths.sprite_src+folder+'/img'))					//collection 내부 img 폴더로 sprite image 경로 설정
					.on('end',resolve);
			}));
			stream_arr.push(new Promise(function(resolve) {
				spriteData.css
					.pipe(gulp.dest(path.join(paths.css_src, folder+'/scss/sprite')))			//collection 내부 scss 폴더로 sprite scss 경로 설정
					.on('end', resolve);
			}));
		});

	return Promise.all(stream_arr);
});

gulp.task('makeSpriteMap', ['makeSprite'], function() {
	var getSpritePath = function(folder){
		var spritePath = [];
		folder.forEach(function(dir){
			var item = {
				'path' : '',
				'collection' : ''
			};
			item.path = path.posix.join(paths.css_src, dir+'/scss/sprite');
			item.collection = dir.replace(/\d{2}\_/g,'');
			spritePath.push(item);
		});
		return spritePath;
	};
	var options = {
		maps: {
			handlebars: {
				prefix: 'sp_',
				exe: 'scss',
				path: getSpritePath(collection),
			}
		},
	};

	return gulp.src('gulpconf/sprite_maps_template.hbs')
		.pipe(plumber(globalOptions.notify))
		.pipe(handlebars(options.maps.handlebars))
		.pipe(rename('_sprite_maps.scss'))
		.pipe(gulp.dest(path.join(paths.css_src, '/scss/import')));
});

gulp.task('sass', function() {
	collection.forEach(function(dir){
		return gulp.src(path.join(paths.css_src, dir+'/scss/*.scss'))
			.pipe(plumber(globalOptions.notify))
			.pipe(sourcemaps.init())
			.pipe(sassPipe())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(paths.css_src+dir+'/css/'))
			.pipe(gulpif(config.browserSync, browserSync.stream({match:'**/*.css'})));
	});

});

gulp.task('sass-build', ['sprite','md5-sprite'], function() {
	return Promise.all([
		del(path.join(paths.css_dest,'**/*.css.map')),
		collection.forEach(function(dir){
			new Promise(function(resolve) {
				gulp.src(path.join(paths.css_src, dir+'/**/*.css'))
					.pipe(plumber(globalOptions.notify))
					.pipe(sassPipe(true))
					.pipe(gulp.dest(paths.css_dest))
					.on('end',resolve);
			})
		})
	]);
});

gulp.task('minify', [], function() {
	var options = {
		cleanCSS: {
			'aggressiveMerging': false, // 속성 병합 false
			'restructuring': false,     // 선택자의 순서 변경 false
			'mediaMerging': false,      // media query 병합 false
		}
	};
	return gulp.src(path.join(paths.css_dest, '*.css'))
		.pipe(cleanCSS(options.cleanCSS))
		.pipe(gulp.dest(paths.css_dest));
});

gulp.task('browserSync', function() {
	var options = {
		browserSync: {
			server: {
				baseDir: paths.html_src,
				directory: true
			},
			open: 'external',
		},
	};

	if(config.browserSync) {
		browserSync(options.browserSync);
		gulp.watch(paths.css_src, browserSync.reload);
	}
});

gulp.task('ftp', function() {
	var options = {
		ftp: {
			host: 'view.ui.naver.com',
			port: '2001',
			userKeyFile: '.ftppass', //[TODO].ftppass 처리 방법
			userKey: 'key1',
			parallel: 10, //병렬 전송 갯수 (기본값 3, 10이상 효과 미비)
			remotePath: '/RND/taskrunner', //[TODO]각 서비스 업로드 경로 설정 필요
			log: true,
		},
	};
	// .ftppass 파일 체크

	var conn = ftp.create(vfb(options.ftp));

	return gulp.src(['src/**'], {buffer: false})
		.pipe(plumber(globalOptions.notify))
		.pipe(conn.newer(options.finalRemotePath))
		.pipe(conn.dest(options.finalRemotePath));
});

gulp.task('md5-sprite', ['makeSprite'], function() {
	var getHashSpritePath = function(){
		var spritePath = [];
		collection.forEach(function(dir){
			spritePath.push(path.join(paths.css_src,dir+'scss/sprite/*.scss'));
		});
		return spritePath;
	};
	var options = {
		md5: {
			cssSrc: getHashSpritePath(), //이름 변경 대상 css(scss) 파일
			srcDel: false, // sprite 이름 변경전 파일 삭제 여부
			logDel: true, // 이전 생성된 md5 sprite 삭제 여부
		}
	}
	if(config.md5) {
		var del_sprite = [];
		var sprite_list = [];
		collection.forEach(function(dir){
			var middleName = dir.replace(/\d{2}\_/g,'');
			del_sprite.push(path.posix.join(paths.sprite_dest,dir+'/img/sp_' + middleName + '_??.png'));
			sprite_list.push(path.posix.join(paths.sprite_src,dir+'/img/sp_' + middleName + '.png'));
		});
		options.md5.cssSrc.forEach(function(path){
			return del(del_sprite)
				.then(new Promise(function(resolve) {
					gulp.src(sprite_list)
						.pipe(plumber(globalOptions.notify))
						.pipe(md5(8,path))
						.pipe(gulp.dest(paths.sprite_dest))
						.on('end',resolve);
				}))
				.then(function() {
					if(options.md5.srcDel) {
						return del(sprite_list);
					}
				});
		});
	}
});

function sassPipe(build) {
	var options = {
		postcss: [
			autoprefixer({
				browsers: config.pc ?
							['last 2 versions', "Edge > 0", "ie >= 8"] : //PC옵션
							["Android > 0","iOS > 0","FirefoxAndroid > 0"] //모바일옵션
			}),
		]
	};
	var outputType = build ? 'compressed' : 'expanded';

	if(build && config.urlRebase) {
		options.postcss.push(urlRebase({
			basePath: path.relative(paths.css_dest,config.urlRebaseOption.basePath),
			url: function (URL) {
				if(URL.substring(0,4) === 'http'){
					return;
				}
				var basePath = path.relative(paths.css_dest,config.urlRebaseOption.basePath);
				var rebasedUrl = config.urlRebaseOption.defaultUrl + URL.replace('../img/','');
				for (var name in config.urlRebaseOption) {
					if (config.urlRebaseOption.urlList.hasOwnProperty(name)) {
						var basePath = path.join(basePath, name);
						if(URL.indexOf(basePath) == 0) {
							rebasedUrl = config.urlRebaseOption.urlList[name] + path.relative(basePath, URL);
						}
					}
				}
				return rebasedUrl;
			},
		}));
	}

	return lazypipe()
		.pipe(sass, {
				outputStyle: outputType,
				indentType: 'tab',
				indentWidth: 1
			})
		.pipe(postcss,options.postcss)();
}
