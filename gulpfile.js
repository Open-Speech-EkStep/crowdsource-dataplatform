const gulp = require("gulp");
const minify = require("gulp-minify");
const cleanCss = require("gulp-clean-css");
const del = require("del");
const htmlmin = require("gulp-htmlmin");

gulp.task("clean-js", function () {
    return del(["public/build/js/*.js"]);
});

gulp.task("clean-html", function () {
    return del(["dist/*"]);
});

gulp.task("clean-css", function () {
    return del(["public/build/css/*.css"]);
});

gulp.task("html", function () {
    return gulp
        .src(["views/*"])
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                removeComments: true,
            })
        )
        .pipe(gulp.dest("views"));
});

gulp.task("js", function () {
    return gulp
        .src(["public/js/*.js"])
        .pipe(
            minify({
                ext: {
                    min: ".js",
                },
                noSource: true,
            })
        )
        .pipe(gulp.dest("public/build/js"));
});
gulp.task("css", function () {
    return gulp
        .src(["public/css/*.css"])
        .pipe(cleanCss({
            ext: {
                min: ".min.css",
            },
            noSource: true,
        }))
        .pipe(gulp.dest("public/build/css"));
});

gulp.task(
    "default",
    gulp.series(
        "clean-html",
        "clean-js",
        "clean-css",
        "html",
        "js",
        "css"
    )
);
