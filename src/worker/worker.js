import { SurfaceExtractor } from "./surface-extractor.js";
import { VolumeModifier } from "./volume-modifier.js";
import { Action } from "./action.js";

/**
 * A worker thread that processes volume data.
 *
 * @class Worker
 * @submodule worker
 * @static
 */

/**
 * Receives and handles messages from the main thread.
 *
 * @method receive
 * @static
 * @param {Event} event - A message event containing the received data.
 */

self.addEventListener("message", function receive(event) {

	const data = event.data;

	switch(data.action) {

		case Action.EXTRACT:
			SurfaceExtractor.extract(data.chunk);
			postMessage(SurfaceExtractor.message, SurfaceExtractor.transferList);
			break;

		case Action.MODIFY:
			VolumeModifier.modify(data.chunk, data.operation);
			postMessage(VolumeModifier.message, VolumeModifier.transferList);
			break;

		case Action.CLOSE:
		default:
			close();

	}

});
