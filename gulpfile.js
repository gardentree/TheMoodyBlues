var gulp = require("gulp");
var exec = require("child_process").exec;

gulp.task("test",function() {
  exec("yarn test",function(error,stdout,stderr) {
    console.log(stdout);

    console.error(stderr);
  });
});

gulp.task("default",function() {
  gulp
    .watch(["src/**","test/**"],["test"]);
});
