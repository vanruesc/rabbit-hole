module.exports = {

	options: {
		coverageThreshold: 98.0,
		plugins: [{
			name: "esdoc-standard-plugin"
		}]
	},

	compile: {
		src: "src",
		dest: "public/docs"
	}

};
