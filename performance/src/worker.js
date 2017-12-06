import { CompressionTest } from "./tests/CompressionTest.js";
import { DecompressionTest } from "./tests/DecompressionTest.js";
import { CSGTest } from "./tests/CSGTest.js";
import { SVOTest } from "./tests/SVOTest.js";
import { ContouringTest } from "./tests/ContouringTest.js";

/**
 * A collection of available tests.
 *
 * @type {Map}
 * @private
 * @final
 */

const tests = new Map([
	["Compression", new CompressionTest()],
	["Decompression", new DecompressionTest()],
	["Contouring", new ContouringTest()],
	["CSG", new CSGTest()],
	["SVO", new SVOTest()]
]);

/**
 * Receives and handles messages from the main thread.
 *
 * @private
 * @param {Event} event - A message event containing data from the main thread.
 */

self.addEventListener("message", function onMessage(event) {

	const test = tests.get(event.data).initialise();
	const report = test.run();
	test.clear();

	postMessage({
		reportName: report.name,
		reportURL: URL.createObjectURL(new Blob([report.toString()], { type: "text/plain" }))
	});

});
