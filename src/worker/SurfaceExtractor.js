import { DualContouring } from "../isosurface/dual-contouring/DualContouring.js";
import { ExtractionResponse } from "./messages/ExtractionResponse.js";
import { DataProcessor } from "./DataProcessor.js";

/**
 * A surface extractor that generates a polygonal mesh from Hermite data.
 */

export class SurfaceExtractor extends DataProcessor {

	/**
	 * Constructs a new surface extractor.
	 */

	constructor() {

		super();

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {ExtractionResponse}
		 */

		this.response = new ExtractionResponse();

	}

	/**
	 * Extracts a surface from the given Hermite data.
	 *
	 * @param {ExtractionRequest} request - An extraction request.
	 */

	process(request) {

		// Unpack the provided volume data and generate the isosurface.
		const data = this.data.deserialize(request.data).decompress();
		const isosurface = DualContouring.run(request.cellPosition, request.cellSize, data);

		const response = this.response;
		const transferList = [];

		if(isosurface !== null) {

			response.isosurface = isosurface;

			transferList.push(isosurface.indices.buffer);
			transferList.push(isosurface.positions.buffer);
			transferList.push(isosurface.normals.buffer);

		} else {

			response.isosurface = null;

		}

		// Drop the decompressed data and send the original data back.
		response.data = data.deserialize(request.data).serialize();
		this.transferList = data.createTransferList(transferList);

	}

}
