module.exports = {

	worker: {
		files: [
			{ expand: true, src: "src/worker/worker.tmp", dest: "" },
			{ expand: true, src: "performance/src/worker.tmp", dest: "" }
		]
	},

	lib: {
		options: {
			banner: "<%= banner %>"
		},
		files: [{
			src: "build/<%= package.name %>.js",
			dest: "build/<%= package.name %>.min.js"
		}]
	},

	demo: {
		files: [{
			src: "public/demo/index.js",
			dest: "public/demo/index.min.js"
		}]
	},

	editor: {
		files: [{
			src: "public/editor/index.js",
			dest: "public/editor/index.min.js"
		}]
	},

	performance: {
		files: [{
			src: "public/performance/index.js",
			dest: "public/performance/index.min.js"
		}]
	}

};
