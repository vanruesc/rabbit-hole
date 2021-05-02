import { CompressionTest } from "./tests/CompressionTest";
import { DecompressionTest } from "./tests/DecompressionTest";
import { CSGTest } from "./tests/CSGTest";
import { SVOTest } from "./tests/SVOTest";
import { ContouringTest } from "./tests/ContouringTest";
import { Action } from "./Action";
import { HermiteData } from "../../../../src";

/**
 * A collection of available tests.
 *
 * @type {Map}
 * @private
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

self.addEventListener("message", (event) => {

	const request = event.data;

	switch(request.action) {

		case Action.CONFIGURE: {

			HermiteData.resolution = request.resolution;
			console.log("Setting Hermite data resolution to", request.resolution);
			break;

		}

		case Action.TEST: {

			const test = tests.get(request.id).initialize();
			const report = test.run();
			test.clear();

			postMessage({
				reportName: report.name,
				reportURL: URL.createObjectURL(new Blob([report.toString()], {
					type: "text/plain"
				}))
			});

			break;

		}

	}

});
