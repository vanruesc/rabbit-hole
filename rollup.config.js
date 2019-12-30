import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import { string } from "rollup-plugin-string";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}, ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.peerDependencies).concat(["three"]);
const globals = Object.assign({}, ...external.map((value) => ({
	[value]: value.replace(/-/g, "").toUpperCase()
})));

const lib = {

	worker: {

		input: "src/worker/worker.js",
		plugins: [resolve()].concat(production ? [babel(), minify({
			comments: false
		})] : []),
		output: {
			file: "src/worker/worker.tmp",
			format: "iife"
		}

	},

	module: {

		input: "src/index.js",
		external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})],
		output: {
			file: pkg.module,
			format: "esm",
			banner
		}

	},

	main: {

		input: "src/index.js",
		external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : []),
		output: {
			file: pkg.main,
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals,
			banner
		}

	},

	min: {

		input: "src/index.js",
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			bannerNewLine: true,
			comments: false
		})],
		output: {
			file: pkg.main.replace(".js", ".min.js"),
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			banner
		}

	}

};

const demo = {

	main: {

		input: "demo/src/index.js",
		external: ["three"],
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : []),
		output: {
			file: "public/demo/index.js",
			format: "iife",
			globals: { "three": "THREE" }
		}

	},

	min: {

		input: "demo/src/index.js",
		external: ["three"],
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})],
		output: {
			file: "public/demo/index.min.js",
			format: "iife",
			globals: { "three": "THREE" }
		}

	}

};

const editor = {

	main: {

		input: "editor/src/index.js",
		external: ["three"],
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : []),
		output: {
			file: "public/editor/index.js",
			format: "iife",
			globals: { "three": "THREE" }
		}

	},

	min: {

		input: "editor/src/index.js",
		external: ["three"],
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})],
		output: {
			file: "public/editor/index.min.js",
			format: "iife",
			globals: { "three": "THREE" }
		}

	}

};

const performance = {

	worker: {

		input: "performance/src/worker.js",
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel(), minify({
			comments: false
		})] : []),
		output: {
			file: "performance/src/worker.tmp",
			format: "iife"
		}

	},

	main: {

		input: "performance/src/index.js",
		external: ["three"],
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : []),
		output: {
			file: "public/performance/index.js",
			format: "iife",
			globals: { "three": "THREE" }
		}

	},

	min: {

		input: "performance/src/index.js",
		external: ["three"],
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})],
		output: {
			file: "public/performance/index.min.js",
			format: "iife",
			globals: { "three": "THREE" }
		}

	}

};

export default [
	lib.worker, lib.module, lib.main,
	demo.main, editor.main,
	performance.worker, performance.main
].concat(!production ? [] : [
	lib.min,
	demo.min,
	editor.min,
	performance.min
]);
