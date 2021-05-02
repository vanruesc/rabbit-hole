import { HermiteData } from "../volume/HermiteData";
import { VoxelCell } from "../octree/voxel/VoxelCell";
import { Message } from "./messages/Message";
import { SurfaceExtractor } from "./SurfaceExtractor";
import { VolumeModifier } from "./VolumeModifier";
import { Action } from "./Action";

/**
 * A volume modifier.
 *
 * @type {VolumeModifier}
 * @private
 */

const volumeModifier = new VolumeModifier();

/**
 * A surface extractor.
 *
 * @type {SurfaceExtractor}
 * @private
 */

const surfaceExtractor = new SurfaceExtractor();

/**
 * The current action.
 *
 * @type {Action}
 * @private
 */

let action = null;

/**
 * Receives and handles messages from the main thread.
 *
 * @private
 * @param {Event} event - A message event containing data from the main thread.
 */

self.addEventListener("message", (event) => {

	// Unpack the request.
	const request = event.data;
	action = request.action;

	switch(action) {

		case Action.MODIFY:
			postMessage(
				volumeModifier.process(request).respond(),
				volumeModifier.createTransferList()
			);
			break;

		case Action.EXTRACT:
			postMessage(
				surfaceExtractor.process(request).respond(),
				surfaceExtractor.createTransferList()
			);
			break;

		case Action.CONFIGURE:
			HermiteData.resolution = request.resolution;
			VoxelCell.errorThreshold = request.errorThreshold;
			break;

		case Action.CLOSE:
		default:
			close();

	}

});

/**
 * Returns all data to the main thread and closes the worker.
 *
 * @private
 * @param {ErrorEvent} event - An error event.
 */

self.addEventListener("error", (event) => {

	const processor = (action === Action.MODIFY) ?
		volumeModifier : (action === Action.EXTRACT) ?
			surfaceExtractor : null;

	if(processor !== null) {

		// Evacuate the data.
		const response = processor.respond();

		// Adjust the action and attach the error event.
		response.action = Action.CLOSE;
		response.error = event;

		postMessage(response, processor.createTransferList());

	} else {

		// An unexpected error occured during configuration or closure.
		const response = new Message(Action.CLOSE);
		response.error = event;

		postMessage(response);

	}

	close();

});
