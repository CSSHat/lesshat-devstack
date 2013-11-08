module.exports = function(grunt) {
  grunt.registerTask('iterate', function() {
    grunt.task.requires('prompt:version');
    var path_global = require('path');
    var child_process = require('child_process');
    var exec = child_process.exec;
    var version = grunt.config('version').settings.version;
    var parent_dirname = path_global.resolve(__dirname, '..', '..', '..');

    function detectIndentation(string) {
      var tabs = string.match(/^[\t]+/gm) || [];
      var spaces = string.match(/^[ ]+/gm) || [];

      // Pick the smallest indentation level of a prevalent type
      var prevalent = tabs.length >= spaces.length ? tabs : spaces;
      var indentation;
      for (var i = 0, il = prevalent.length; i < il; i++) {
        if (!indentation || prevalent[i].length < indentation.length) {
          indentation = prevalent[i];
        }
      }
      return indentation;
    }

    function jsonWrite(name) {
      var file = '';
      var indentation = null;
      if (grunt.file.exists(name)) {
        indentation = detectIndentation(grunt.file.read(name));
        file = grunt.file.readJSON(name);
        file.version = version;
        grunt.file.write(name, JSON.stringify(file, null, indentation));
        grunt.log.ok(name + ' version changed!');
        return;
      }
      grunt.fail.fatal(name + ' file not found');
    }

    jsonWrite(path_global.resolve(parent_dirname, 'package.json'));
    jsonWrite(path_global.resolve(parent_dirname, 'bower.json'));

    // git tag
    var command_gitcommit = 'git add .; git commit -m "Version %%%"'.replace('%%%', version);
    var command_gittag = 'git tag -a v' + version + ' -m "Version %%%"'.replace('%%%', version);
    exec(command_gitcommit, function(error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
        return false;
      }
      exec(command_gittag, function(error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
    });

  });
};
