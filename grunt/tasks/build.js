module.exports = function(grunt) {

	grunt.registerTask("build", ["eslint", "rollup", "clean:worker"]);
	grunt.registerTask("build:min", [
		"eslint",
		"build:worker:min",
		"build:lib:min",
		"build:demo:min",
		"build:editor:min",
		"build:performance:min",
		"clean:worker"
	]);

	grunt.registerTask("build:worker", ["eslint:lib", "rollup:worker"]);
	grunt.registerTask("build:lib", ["eslint:lib", "rollup:lib"]);
	grunt.registerTask("build:demo", ["eslint:demo", "rollup:demo"]);
	grunt.registerTask("build:editor", ["eslint:editor", "rollup:editor"]);
	grunt.registerTask("build:performance", ["eslint:performance", "rollup:performance"]);

	grunt.registerTask("build:worker:min", ["rollup:worker", "uglify:worker"]);
	grunt.registerTask("build:lib:min", ["rollup:lib", "uglify:lib"]);
	grunt.registerTask("build:demo:min", ["rollup:demo", "uglify:demo"]);
	grunt.registerTask("build:editor:min", ["rollup:editor", "uglify:editor"]);
	grunt.registerTask("build:performance:min", ["rollup:performance", "uglify:performance"]);

};
