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
			require("rollup-plugin-node-resolve")({
				jsnext: true
			}),
			require("rollup-plugin-string")({
				include: [
					"**/*.frag",
					"**/*.vert",
					"**/*.tmp"
				]
			})
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
