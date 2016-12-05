//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'),
    minifycss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    //当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
	notify = require('gulp-notify'),
    plumber = require('gulp-plumber');
    //es6转es5
    babel = require('gulp-babel');
    //提取html中的内容
    cheerio = require('gulp-cheerio');


//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
	//除了reset.less和test.less（**匹配src/less的0个或多个子文件夹）
    gulp.src(['src/**/*.less', '!src/**/{reset,test}.less'])
    	//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
    	.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    	//当less有各种引入关系时，编译后不容易找到对应less文件，所以需要生成sourcemap文件，方便修改
    	.pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())

    	//  这里加一节pipe，做一个autoprefixer操作
    	.pipe(autoprefixer({
            browsers: ['last 5 versions', 'Android >= 2.3', 'last 5 Explorer versions', '> 1%', 'Firefox >= 20'],
            cascade: true,  //是否美化属性值 默认：true 像这样：
                            //-webkit-transform: rotate(45deg);
                            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
    	//  这里加一节pipe，做一个minifycss操作
    	.pipe(minifycss()) //压缩css
    	.pipe(gulp.dest('src'));
});

//使用gulp-uglify压缩javascript文件，减小文件大小。
gulp.task('jsmin', function () {
    gulp.src(['src/**/*.js', '!src/**/{test1,test2}.js'])
        //es6转es5
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            //preserveComments: 'all' //保留所有注释
        }))
        .pipe(gulp.dest('dist'));
});

//使用gulp-htmlmin压缩html，可以压缩页面javascript、css，去除页面空格、注释，删除多余属性等操作。
gulp.task('Htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});

//压缩图片
gulp.task('testImg', function(){
    gulp.src('src/**/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist'));
});

//监听事件
gulp.task('testWatch', function () {
	//livereload.listen();//当监听文件发生变化时，浏览器自动刷新页面
    gulp.watch('src/**/*.less', ['testLess']); //当所有less文件发生改变时，调用testLess任务
//    gulp.watch(['src/**/*.*', 'dist/**/*.*'],function(file){
//        livereload.changed(file.path);
//    });
});

gulp.task('default',['testLess','testImg']); //定义默认任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径


//gulp.src() #原始文件路径
//gulp.dest() #文件导出的目标路径
//gulp.task() #gulp任务
//gulp.watch() #监控文件变动

//运行gulp
//9.1、说明：命令提示符执行gulp 任务名称；
//9.2、编译less：命令提示符执行gulp testLess；
//9.3、当执行gulp default或gulp将会调用default任务里的所有任务[‘testLess’,’elseTask’]。

//安装 : npm install gulp-minifycss
//autoprefixer可以自动为css中的某些代码添加如 -moz- 、 -webkit- 等前缀，保证其兼容性。autoprefixer会参考Can I Use 网站的数据来判定哪些属性需要添加，又该添加什么样的前缀。
//gulp-minifycss 这是压缩css文件的一个gulp插件
//gulp-imagemin 这是压缩图片的一个gulp插件

