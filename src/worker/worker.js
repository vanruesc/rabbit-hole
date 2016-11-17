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
 * @method onMessage
 * @private
 * @static
 * @param {Event} event - A message event containing data from the main thread.
 */

self.addEventListener("message", function onMessage(event) {

	const data = event.data;

	switch(data.action) {

		case Action.EXTRACT:
			SurfaceExtractor.extract(data.chunk);
			postMessage(SurfaceExtractor.message, SurfaceExtractor.transferList);
			break;

		case Action.MODIFY:
			VolumeModifier.modify(data.chunk, data.sdf);
			postMessage(VolumeModifier.message, VolumeModifier.transferList);
			break;

		case Action.CLOSE:
		default:
			close();

	}

});

/**
 * Returns all data to the main thread and closes the worker.
 *
 * @method onError
 * @private
 * @static
 * @param {Event} event - An error event.
 */

self.addEventListener("error", function onError(event) {

	const message = {
		action: Action.CLOSE,
		error: event.message,
		data: null
	};

	const transferList = [];

	const chunks = [
		SurfaceExtractor.chunk,
		VolumeModifier.chunk
	];

	// Find out which operator has the data.
	if(chunks[0].data !== null && !chunks[0].data.neutered) {

		message.chunk = chunks[0].serialise();
		chunks[0].createTransferList(transferList);

	} else if(chunks[1].data !== null && !chunks[1].data.neutered) {

		message.chunk = chunks[1].serialise();
		chunks[1].createTransferList(transferList);

	}

	postMessage(message, transferList);
	close();

});
