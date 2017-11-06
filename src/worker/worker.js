import { HermiteData } from "../volume/HermiteData.js";
import { VoxelCell } from "../octree/voxel/VoxelCell.js";
import { Message } from "./messages/Message.js";
import { SurfaceExtractor } from "./SurfaceExtractor.js";
import { VolumeModifier } from "./VolumeModifier.js";
import { VolumeResampler } from "./VolumeResampler.js";
import { Action } from "./Action.js";

/**
 * A volume modifier.
 *
 * @type {VolumeModifier}
 * @private
 * @final
 */

const volumeModifier = new VolumeModifier();

/**
 * A volume resampler.
 *
 * @type {VolumeResampler}
 * @private
 * @final
 */

const volumeResampler = new VolumeResampler();

/**
 * A surface extractor.
 *
 * @type {SurfaceExtractor}
 * @private
 * @final
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

self.addEventListener("message", function onMessage(event) {

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

		case Action.RESAMPLE:
			postMessage(
				volumeResampler.process(request).respond(),
				volumeResampler.createTransferList()
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

self.addEventListener("error", function onError(event) {

	const processor = (action === Action.MODIFY) ?
		volumeModifier : (action === Action.RESAMPLE) ?
			volumeResampler : (action === Action.EXTRACT) ?
				surfaceExtractor : null;

	let response;

	if(processor !== null) {

		// Evacuate the data.
		response = processor.respond();

		// Adjust the action and attach the error event.
		response.action = Action.CLOSE;
		response.error = event;

		postMessage(response, processor.createTransferList());

	} else {

		// An unexpected error occured during configuration or closure.
		response = new Message(Action.CLOSE);
		response.error = event;

		postMessage(response);

	}

	close();

});
