module.exports = function(grunt) {

	grunt.registerTask("prepublish", ["backup", "rollup:worker", "lemon"]);

};
