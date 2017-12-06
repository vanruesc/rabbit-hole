const resolve = require("rollup-plugin-node-resolve");
const string = require("rollup-plugin-string");
const babel = require("rollup-plugin-babel");

module.exports = function(grunt) {

	return {

		options: {
			plugins() {

				return [
					resolve({
						jsnext: true
					}),
					string({
						include: [
							"**/*.frag",
							"**/*.vert",
							"**/*.tmp"
						]
					})
				].concat(grunt.option("production") ? [babel()] : []);

			}
		},

		worker: {
			options: {
				format: "iife"
			},
			files: [
				{ src: "src/worker/worker.js", dest: "src/worker/worker.tmp" },
				{ src: "performance/src/worker.js", dest: "performance/src/worker.tmp" }
			]
		},

		lib: {
			options: {
				format: "umd",
				moduleName: "<%= package.name.replace(/-/g, \"\").toUpperCase() %>",
				banner: "<%= banner %>"
			},
			src: "<%= package.module %>",
			dest: "build/<%= package.name %>.js"
		},

		demo: {
			options: {
				globals: {
					"dat.gui": "dat",
					"stats.js": "Stats",
					"three": "THREE"
				},
				external: [
					"dat.gui",
					"stats.js",
					"three"
				],
				format: "iife"
			},
			src: "demo/src/index.js",
			dest: "public/demo/index.js"
		},

		editor: {
			options: {
				globals: {
					"dat.gui": "dat",
					"stats.js": "Stats",
					"three": "THREE"
				},
				external: [
					"dat.gui",
					"stats.js",
					"three"
				],
				format: "iife"
			},
			src: "editor/src/index.js",
			dest: "public/editor/index.js"
		},

		performance: {
			options: {
				format: "iife"
			},
			src: "performance/src/index.js",
			dest: "public/performance/index.js"
		}

	};

};
