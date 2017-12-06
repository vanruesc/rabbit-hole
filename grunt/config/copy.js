module.exports = {

	assets: {
		files: [{
			expand: true,
			cwd: "demo/assets",
			src: "**",
			dest: "public/demo",
			filter: "isFile"
		}, {
			expand: true,
			cwd: "editor/assets",
			src: "**",
			dest: "public/editor",
			filter: "isFile"
		}, {
			expand: true,
			cwd: "performance/assets",
			src: "**",
			dest: "public/performance",
			filter: "isFile"
		}]
	},

	backup: {
		expand: true,
		cwd: "src",
		src: [
			"materials/*.js",
			"worker/thread-pool.js"
		],
		dest: "backup",
		filter: "isFile"
	},

	restore: {
		expand: true,
		cwd: "backup",
		src: "**",
		dest: "src",
		filter: "isFile"
	}

};
