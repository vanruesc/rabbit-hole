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
			"public/index.min.js": ["public/index.js"]
		}
	}

};
