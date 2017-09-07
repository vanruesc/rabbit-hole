import { HermiteData } from "../volume/HermiteData.js";
import { VoxelCell } from "../octree/voxel/VoxelCell.js";
import { Response } from "./messages/Response.js";
import { SurfaceExtractor } from "./SurfaceExtractor.js";
import { VolumeModifier } from "./VolumeModifier.js";
import { Action } from "./Action.js";

/**
 * A surface extractor.
 *
 * @type {SurfaceExtractor}
 * @private
 */

const surfaceExtractor = new SurfaceExtractor();

/**
 * A volume modifier.
 *
 * @type {VolumeModifier}
 * @private
 */

const volumeModifier = new VolumeModifier();

/**
 * Receives and handles messages from the main thread.
 *
 * @private
 * @param {Event} event - A message event containing data from the main thread.
 */

self.addEventListener("message", function onMessage(event) {

	// Unpack the request.
	const request = event.data;

	switch(request.action) {

		case Action.EXTRACT:
			surfaceExtractor.process(request);
			postMessage(surfaceExtractor.response, surfaceExtractor.transferList);
			break;

		case Action.MODIFY:
			volumeModifier.process(request);
			postMessage(volumeModifier.response, volumeModifier.transferList);
			break;

		case Action.RESAMPLE:
			// @todo
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

	const transferList = [];
	const response = new Response(Action.CLOSE);

	// Attach the error event.
	response.error = event;

	// Find out which processor has the data.
	const data = (surfaceExtractor.data !== null && !surfaceExtractor.data.neutered) ?
		surfaceExtractor.data : (volumeModifier.data !== null && !volumeModifier.data.neutered) ?
			volumeModifier.data : null;

	if(data !== null) {

		response.data = data.compress().serialize();
		data.createTransferList(transferList);

	}

	// Send the data back and close this worker.
	postMessage(response, transferList);
	close();

});
