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

const workers = [{

	input: "src/worker/worker.js",
	output: {
		file: "src/worker/worker.tmp",
		format: "iife"
	},

	plugins: [resolve()].concat(process.env.NODE_ENV === "production" ? [babel(), minify({
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
	})].concat(process.env.NODE_ENV === "production" ? [babel(), minify({
		comments: false
	})] : [])

}];

const lib = {

	input: pkg.module,
	output: {
		file: "build/" + pkg.name + ".js",
		format: "umd",
		name: pkg.name.replace(/-/g, "").toUpperCase(),
		banner: banner
	},

	plugins: [resolve(), string({
		include: ["**/*.tmp"]
	})].concat(process.env.NODE_ENV === "production" ? [babel()] : [])

};

const demo = {

	input: "demo/src/index.js",
	output: {
		file: "public/demo/index.js",
		format: "iife",
		globals: { three: "THREE" }
	},

	external: ["three"],
	plugins: [resolve(), string({
		include: ["**/*.tmp"]
	})].concat(process.env.NODE_ENV === "production" ? [babel()] : [])

};

const editor = {

	input: "editor/src/index.js",
	output: {
		file: "public/editor/index.js",
		format: "iife",
		globals: { three: "THREE" }
	},

	external: ["three"],
	plugins: [resolve(), string({
		include: ["**/*.tmp"]
	})].concat(process.env.NODE_ENV === "production" ? [babel()] : [])

};

const performance = {

	input: "performance/src/index.js",
	output: {
		file: "public/performance/index.js",
		format: "iife"
	},

	plugins: [resolve(), string({
		include: ["**/*.tmp"]
	})].concat(process.env.NODE_ENV === "production" ? [babel()] : [])

};

export default [...workers, lib, demo, editor, performance].concat((process.env.NODE_ENV === "production") ? [

	Object.assign({}, lib, {

		output: Object.assign({}, lib.output, {
			file: "build/" + pkg.name + ".min.js"
		}),

		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat([babel(), minify({
			bannerNewLine: true,
			comments: false
		})])

	}),

	Object.assign({}, demo, {

		output: Object.assign({}, demo.output, {
			file: "public/demo/index.min.js"
		}),

		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat([babel(), minify({
			comments: false
		})])

	}),

	Object.assign({}, editor, {

		output: Object.assign({}, editor.output, {
			file: "public/editor/index.min.js"
		}),

		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat([babel(), minify({
			comments: false
		})])

	}),

	Object.assign({}, performance, {

		output: Object.assign({}, performance.output, {
			file: "public/performance/index.min.js"
		}),

		plugins: [resolve(), string({
			include: ["**/*.tmp"]
		})].concat([babel(), minify({
			comments: false
		})])

	})

] : []);
