const gulp = require("gulp");
const typescript = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const tsProject = typescript.createProject("tsconfig.json");
gulp.task("default", function () {
    return gulp
        .src(["lib/**/*.ts"])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});