module.exports = function(grunt) {

	grunt.registerTask("min", ["build:worker", "uglify:worker", "build:lib", "uglify:lib", "build:editor", "uglify:editor", "clean:worker"]);

};
