module.exports = function(grunt) {

	grunt.initConfig({

		date: grunt.template.today("mmm dd yyyy"),
		pkg: grunt.file.readJSON("package.json"),

		banner: "/**\n" +
			" * <%= pkg.name %> v<%= pkg.version %> build <%= date %>\n" +
			" * <%= pkg.homepage %>\n" +
			" * Copyright <%= date.slice(-4) %> <%= pkg.author.name %>, <%= pkg.license %>\n" + 
			" */\n",

		jshint: {
			options: {
				jshintrc: true
			},
			files: ["Gruntfile.js", "src/**/*.js", "test/**/*.js"]
		},

		fsinline: {
			options: {
				append: "export default shader;"
			},
			shaders: {
				src: "src/materials/*/shader.js",
				dest: "./inlined"
			}
		},

		clean: {
			intermediates: ["src/materials/*/inlined"]
		},

		rollup: {
			options: {
				format: "umd",
				moduleName: "<%= pkg.name.replace(/-/g, \"\").toUpperCase() %>",
				banner: "<%= banner %>",
				globals: {
					three: "THREE"
				},
				plugins: [
					require("rollup-plugin-node-resolve")({
						jsnext: true,
						skip: ["three"]
					})
				]
			},
			dist: {
				src: "src/index.js",
				dest: "build/<%= pkg.name %>.js"
			}
		},

		copy: {
			main: {
				files: [
					{expand: false, src: ["build/<%= pkg.name %>.js"], dest: "public/<%= pkg.name %>.js", filter: "isFile"},
				],
			}
		},

		uglify: {
			options: {
				banner: "<%= banner %>"
			},
			dist: {
				files: {
					"build/<%= pkg.name %>.min.js": ["build/<%= pkg.name %>.js"]
				}
			}
		},

		nodeunit: {
			options: {
				reporter: "default"
			},
			src: ["test/**/*.js"]
		},

		yuidoc: {
			compile: {
				name: "<%= pkg.name %>",
				description: "<%= pkg.description %>",
				version: "<%= pkg.version %>",
				url: "<%= pkg.homepage %>",
				options: {
					paths: "src",
					outdir: "docs"
				}
			}
		},

		watch: {
			files: ["<%= jshint.files %>"],
			tasks: ["jshint"]
		}

	});

	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-yuidoc");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-fs-inline");
	grunt.loadNpmTasks("grunt-rollup");

	//grunt.registerTask("default", ["clean", "build", "uglify", "nodeunit"]);
	grunt.registerTask("default", ["clean", "build", "nodeunit"]);
	grunt.registerTask("build", ["jshint", "fsinline", "rollup", "copy", "clean"]);
	grunt.registerTask("test", ["jshint", "nodeunit"]);
	grunt.registerTask("prepublish", ["clean", "fsinline"]);

};
