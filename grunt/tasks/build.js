module.exports = function(grunt) {

	grunt.registerTask("build", ["eslint", "rollup", "clean:worker"]);

	grunt.registerTask("build:worker", ["eslint:lib", "rollup:worker"]);
	grunt.registerTask("build:lib", ["eslint:lib", "rollup:lib"]);
	grunt.registerTask("build:editor", ["eslint:editor", "rollup:editor"]);

};
