import { createRequire } from "module";
import esbuild from "esbuild";

const require = createRequire(import.meta.url);
const pkg = require("./package");
const date = (new Date()).toDateString();
const external = Object.keys(pkg.peerDependencies || {});
const minify = process.argv.includes("-m");
const watch = process.argv.includes("-w");
const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

await esbuild.build({
	entryPoints: [
		"src/worker/worker.js"
	],
	outExtension: { ".js": ".txt" },
	outdir: "tmp",
	format: "iife",
	bundle: true,
	minify,
	watch
}).catch(() => process.exit(1));

await esbuild.build({
	entryPoints: ["demo/src/index.js"],
	outdir: "public/demo",
	format: "iife",
	bundle: true,
	minify,
	watch
}).catch(() => process.exit(1));

await esbuild.build({
	entryPoints: ["src/index.js"],
	outfile: `dist/${pkg.name}.js`,
	banner: { js: banner },
	format: "esm",
	bundle: true,
	external
}).catch(() => process.exit(1));
