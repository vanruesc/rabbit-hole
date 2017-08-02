module.exports = {

	worker: {
		files: [{
			expand: true,
			src: ["src/worker/worker.tmp"],
			dest: ""
		}]
	},

	lib: {
		options: {
			banner: "<%= banner %>"
		},
		files: {
			"build/<%= package.name %>.min.js": ["build/<%= package.name %>.js"]
		}
	},

	editor: {
		files: {
			"public/editor/index.min.js": ["public/editor/index.js"]
		}
	},

	demo: {
		files: {
			"public/demo/index.min.js": ["public/demo/index.js"]
		}
	}

};
