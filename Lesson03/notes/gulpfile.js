const gulp = require("gulp");
const typescript = require("gulp-typescript");
const browserify = require("browserify");
const tsify = require("tsify");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const tsServer = typescript.createProject("tsconfig.json");

gulp.task("compile-client", function () {
    return browserify({
        basedir: ".",
        debug: true,
        entries: ["lib/client/index.ts"],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("static/scripts"));
});

gulp.task("compile-server", () => {
    return gulp.src(["lib/server/**/*.ts", "lib/shared/**/*.ts"], {
        base:
            "lib"
    })
        .pipe(sourcemaps.init())
        .pipe(tsServer())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("release", ["compile-client", "compile-server"],
    function () {
        return gulp.src("static/scripts/bundle.js")
            .pipe(uglify())
            .pipe(gulp.dest("static/scripts"));
    });

gulp.task("default", ["compile-client", "compile-server"]);
