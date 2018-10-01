var gulp = require("gulp");
var exec = require("child_process").exec;

gulp.task("test", function() {
  exec("yarn test", function(error, stdout, stderr) {
    console.log(stdout);

    console.error(stderr);
  });
});

gulp.task("default", function() {
  gulp.watch(["src/**/*.ts?", "test/**/*.ts?"], function(event) {
    exec(`NODE_ENV=test TS_NODE_PROJECT=tsconfig.test.json ./node_modules/.bin/electron-mocha --renderer --require ts-node/register '${event.path}' --require ignore-styles`, function(error, stdout, stderr) {
      console.log(stdout);

      console.error(stderr);
    });
  });
});
