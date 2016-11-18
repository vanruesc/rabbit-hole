module.exports = {

	worker: {
		files: {
			"src/worker/worker.min.tmp": ["src/worker/worker.tmp"]
		}
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
			"public/index.min.js": ["public/index.js"]
		}
	}

};
