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

const workers = [{

		input: "src/worker/worker.js",
		plugins: [resolve()].concat(production ? [babel(), minify({
			comments: false
		})] : []),
		output: {
			file: "src/worker/worker.tmp",
			format: "iife"
		}

	}, {

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

}];

const lib = {

	esm: {

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

	umd: {

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

	}

};

const demo = {

	iife: {

		input: "demo/src/index.js",
		external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : []),
		output: {
			file: "public/demo/index.js",
			format: "iife",
			globals
		}

	}

};

const editor = {

	iife: {

		input: "editor/src/index.js",
		external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : []),
		output: {
			file: "public/editor/index.js",
			format: "iife",
			globals
		}

	}

};

const performance = {

	iife: {

		input: "performance/src/index.js",
		external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat(production ? [babel()] : []),
		output: {
			file: "public/performance/index.js",
			format: "iife",
			globals
		}

	}

};

export default [...workers, lib.esm, lib.umd, demo.iife, editor.iife, performance.iife].concat(production ? [

	{

		input: lib.umd.input,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			bannerNewLine: true,
			comments: false
		})],
		output: {
			file: lib.umd.output.file.replace(".js", ".min.js"),
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			banner
		}

	}, {

		input: demo.iife.input,
		external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})],
		output: {
			file: demo.iife.output.file.replace(".js", ".min.js"),
			format: "iife",
			globals
		}

	}, {

		input: editor.iife.input,
		external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})],
		output: {
			file: editor.iife.output.file.replace(".js", ".min.js"),
			format: "iife",
			globals
		}

	}, {

		input: performance.iife.input,
		external,
		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		}), babel(), minify({
			comments: false
		})],
		output: {
			file: performance.iife.output.file.replace(".js", ".min.js"),
			format: "iife",
			globals
		}

	}

] : []);
