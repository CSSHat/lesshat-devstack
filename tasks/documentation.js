module.exports = function (grunt) {
  grunt.registerTask('documentation', function() {
    var mixins_path = path_global.join(__dirname, '/mixins/');
    // Check whether mixins folder exists
    if (!fs.existsSync(mixins_path)) {
      grunt.fail.fatal('Mixins folder does not exist.');
    }
    var dirs = fs.readdirSync(mixins_path).sort();
    var doc_array = [];
    dirs.forEach(function (dir) {
      var mixin_path_noext = path_global.join(mixins_path, dir, dir);
      if (fs.existsSync(mixin_path_noext + '.md')) {
        doc_array.push(fs.readFileSync(mixin_path_noext + '.md', 'utf8'));
      }
    });

    if (fs.existsSync(path_global.join(__dirname, 'README-template.md'))) {
      var doc_template = fs.readFileSync(path_global.join(__dirname, 'README-template.md'), 'utf8');
    }
    else {
      grunt.fail.fatal('README-template.md does not exist.');
    }
      
    doc_template = doc_template.replace(/{{\s*documentation\s*}}$/gm, doc_array.join('\n'));
    
    fs.writeFileSync(path_global.join(__dirname, 'README.md'), doc_template);

    grunt.log.ok('Documentation generated – DONE');
  });
};
