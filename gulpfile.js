var gulp = require("gulp");
var exec = require("child_process").exec;
var fs = require("fs");

function execute(command) {
  exec(command, function(error, stdout, stderr) {
    console.log(stdout);

    console.error(stderr);
  });
}

gulp.task("test", function() {
  execute("yarn test:all");

  gulp.watch(["src/**/*.{ts,tsx}", "test/**/*_test.{ts,tsx}"], function(event) {
    console.log(`${event.type}: ${event.path}`);

    var relative = event.path.slice(process.cwd().length);

    var command;
    if (relative.match(/^\/test/)) {
      command = `yarn test '${event.path}'`;
    } else {
      var matcher = relative.match(/^\/src\/(.+)\.(ts|tsx)$/);
      if (matcher) {
        var test = `${process.cwd()}/test/${matcher[1]}_test.${matcher[2]}`;
        if (fs.existsSync(test)) {
          command = `yarn test '${test}'`;
        } else {
          command = "yarn test:all";
        }
      } else {
        command = "yarn test:all";
      }
    }

    execute(command);
  });
});
