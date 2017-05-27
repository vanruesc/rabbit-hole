module.exports = function(grunt) {

	grunt.registerTask("default", grunt.option("production") ?
		["build:min", "nodeunit"] :
		["build", "nodeunit"]
	);

};
