import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import resolve from "rollup-plugin-node-resolve";
import string from "rollup-plugin-string";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}, ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const globals = { three: "THREE" };
const external = ["three"];

const workers = [{

		input: "src/worker/worker.js",
		output: {
			file: "src/worker/worker.tmp",
			format: "iife"
		},

		plugins: [resolve()].concat(production ? [babel(), minify({
			comments: false
		})] : [])

	}, {

		input: "performance/src/worker.js",
		output: {
			file: "performance/src/worker.tmp",
			format: "iife"
		},

		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel(), minify({
			comments: false
		})] : [])

}];

const lib = {

	esm: {

		input: "src/index.js",
		output: {
			file: pkg.module,
			format: "esm",
			banner: banner
		},

		external: external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})]

	},

	umd: {

		input: "src/index.js",
		output: {
			file: pkg.main,
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			banner: banner
		},

		external: external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : [])

	}

};

const demo = {

	iife: {

		input: "demo/src/index.js",
		output: {
			file: "public/demo/index.js",
			format: "iife",
			globals: globals
		},

		external: external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : [])

	}

};

const editor = {

	iife: {

		input: "editor/src/index.js",
		output: {
			file: "public/editor/index.js",
			format: "iife",
			globals: globals
		},

		external: external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : [])

	}

};

const performance = {

	iife: {

		input: "performance/src/index.js",
		output: {
			file: "public/performance/index.js",
			format: "iife",
			globals: globals
		},

		external: external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : [])

	}

};

export default [...workers, lib.esm, lib.umd, demo.iife, editor.iife, performance.iife].concat(production ? [{

		input: lib.umd.input,
		output: {
			file: lib.umd.output.file.replace(".js", ".min.js"),
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			banner: banner
		},

		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			bannerNewLine: true,
			comments: false
		})]

	}, {

		input: demo.iife.input,
		output: {
			file: demo.iife.output.file.replace(".js", ".min.js"),
			format: "iife",
			globals: globals
		},

		external: external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})]

	}, {

		input: editor.iife.input,
		output: {
			file: editor.iife.output.file.replace(".js", ".min.js"),
			format: "iife",
			globals: globals
		},

		external: external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})]

	}, {

		input: performance.iife.input,
		output: {
			file: performance.iife.output.file.replace(".js", ".min.js"),
			format: "iife",
			globals: globals
		},

		external: external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})]

}] : []);
