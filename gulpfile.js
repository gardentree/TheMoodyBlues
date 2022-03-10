const gulp = require("gulp");
const mocha = require("gulp-mocha");
const typescript = require("ts-node/register");

gulp.task("test:all", () => {
  process.env.NODE_ENV = "test";
  process.env.TS_NODE_PROJECT = "tsconfig/test.json";

  return gulp.src("test/**/*_test.ts", {read: false}).pipe(
    mocha({
      require: ["ts-node/register/transpile-only", "tsconfig-paths/register", "test/helper.ts"],
      reporter: "nyan",
    })
  );
});

gulp.task("watch", () => {
  return gulp.watch(["src/**", "test/**"], gulp.series("test:all"));
});
