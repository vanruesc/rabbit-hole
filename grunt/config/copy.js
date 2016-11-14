module.exports = {

	backup: {
		expand: true,
		cwd: "src",
		src: [
			"materials/*/index.js",
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
