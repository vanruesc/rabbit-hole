const resolve = require("rollup-plugin-node-resolve");
const string = require("rollup-plugin-string");
const babel = require("rollup-plugin-babel");

module.exports = function(grunt) {

	return {

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
			plugins() {
				return grunt.option("production") ? [
					resolve({
						jsnext: true
					}),
					string({
						include: [
							"**/*.frag",
							"**/*.vert",
							"**/*.tmp"
						]
					}),
					babel()
				] : [
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
				];
			}
		},

		worker: {
			options: {
				format: "iife"
			},
			src: "src/worker/worker.js",
			dest: "src/worker/worker.tmp"
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

		editor: {
			options: {
				format: "iife"
			},
			src: "editor/index.js",
			dest: "public/index.js"
		}

	};

};
