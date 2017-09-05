
const gulp = require("gulp");
const browserSync = require("browser-sync");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const spritesmith = require("gulp.spritesmith");
const rimraf = require("rimraf");

/*настройка сервера */

gulp.task("server",function(){
    browserSync.init({
        server:{
            port:9000,
            baseDir:"build"
        }
    });
    gulp.watch("build/**/*").on("change",browserSync.reload)
});

/*компеляци pug */

gulp.task("templates:compile",function(){

    return gulp.src("source/template/index.pug")
        .pipe(pug({
            pretty:true /* табулироывние кода */
        }))

        .pipe(gulp.dest("build")) /* бросает файл в папку */
});

/* компеляция sass */

gulp.task("styles:compile", function(){
    return gulp.src("source/styles/main.scss")
        .pipe( sass({
            outputStyle:"compressed"
        })).on("error", sass.logError)
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest("build/css"))
   

});

/* кокотенация файлов js */

/* sprite */

gulp.task("sprite",function(arg){
    const spriteData = gulp.src("source/images/icons/*.png").pipe(
        spritesmith({
            imgName: "sprite.png",
            imgPath: "../images/sprite.png",
            cssName: "sprite.scss"
        }));
    spriteData.img.pipe(gulp.dest("build/images/"));
    spriteData.css.pipe(gulp.dest("source/styles/global/"))

    arg();

});

/*удаление  */
gulp.task("clean", function(arg){
    return rimraf("build",arg)
})

/*копироваине шрифтов*/

gulp.task("copy:fonts",function(){
    return gulp.src("source/fonts/**/*.*")
        .pipe(
            gulp.dest("build/fonts")
        )
});

/*копироваине картинок*/

gulp.task("copy:images",function(){
    return gulp.src("source/images/**/*.*")
        .pipe(
            gulp.dest("build/images")
        )
});

gulp.task("copy",gulp.parallel("copy:fonts","copy:images"))

/*смотрит за изменениями */

gulp.task("watch",function(){
    gulp.watch("source/template/**/*.pug",gulp.series("templates:compile"));
    gulp.watch("source/styles/**/*.scss",gulp.series("styles:compile"));

});

gulp.task("default",gulp.series("clean",gulp.parallel("templates:compile","styles:compile","sprite","copy"),gulp.parallel("watch","server")));