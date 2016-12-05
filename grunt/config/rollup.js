const resolve = require("rollup-plugin-node-resolve");
const string = require("rollup-plugin-string");
const babel = require("rollup-plugin-babel");

module.exports = {

	options: {
		globals: {
			"three": "THREE",
			"stats.js": "Stats",
			"dat.gui": "dat"
		},
		external: [
			"three",
			"stats.js",
			"dat.gui"
		],
		plugins: () => [
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
		]
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
		src: "src/index.js",
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
