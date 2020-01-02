var gulp = require("gulp");
var exec = require("child_process").exec;
var fs = require("fs");

function execute(command) {
  exec(command, function(error, stdout, stderr) {
    console.log(stdout);

    if (error) {
      console.error(stderr);
    }
  });
}

gulp.task("test", function() {
  execute("yarn test:all");

  const watcher = gulp.watch(["src/**/*.{ts,tsx}", "test/**/*_test.{ts,tsx}"]);
  watcher.on("change", function(path) {
    var command;
    if (path.match(/^test/)) {
      command = `yarn test '${path}'`;
    } else {
      var matcher = path.match(/^src\/(.+)\.(ts|tsx)$/);
      if (matcher) {
        var test = `test/${matcher[1]}_test.${matcher[2]}`;
        if (fs.existsSync(test)) {
          command = `yarn test '${test}'`;
        } else {
          command = "yarn test:all";
        }
      } else {
        command = "yarn test:all";
      }
    }

    execute("clear");
    execute(command);
  });
});
