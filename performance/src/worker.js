import { CompressionTest } from "./tests/CompressionTest.js";
import { DecompressionTest } from "./tests/DecompressionTest.js";
import { CSGTest } from "./tests/CSGTest.js";
import { SVOTest } from "./tests/SVOTest.js";
import { ContouringTest } from "./tests/ContouringTest.js";
import { Action } from "./Action";
import { HermiteData } from "../../src";

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

	const request = event.data;

	let test, report;

	switch(request.action) {

		case Action.CONFIGURE:
			HermiteData.resolution = request.resolution;
			console.log("Setting Hermite data resolution to", request.resolution);
			break;

		case Action.TEST:
			test = tests.get(request.id).initialise();
			report = test.run();
			test.clear();
			postMessage({
				reportName: report.name,
				reportURL: URL.createObjectURL(new Blob([report.toString()], { type: "text/plain" }))
			});
			break;

	}

});
