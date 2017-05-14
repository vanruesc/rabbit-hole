module.exports = {

	options: {
		extensions: {
			".frag": "utf8",
			".vert": "utf8",
			".tmp": "utf8"
		}
	},

	materials: {
		src: "src/materials/*/index.js"
	},

	worker: {
		src: "src/worker/thread-pool.js"
	}

};
