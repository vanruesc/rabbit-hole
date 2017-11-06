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

		/**
		 * An isosurface.
		 *
		 * @type {Isosurface}
		 * @private
		 */

		this.isosurface = null;

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link SurfaceExtractor#createTransferList}.
	 *
	 * @return {ExtractionResponse} A response.
	 */

	respond() {

		const response = super.respond();
		const isosurface = this.isosurface;

		if(isosurface !== null) {

			// Send the isosurface back.
			response.isosurface = isosurface.serialise();

		} else {

			response.isosurface = null;

		}

		return response;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		super.createTransferList(transferList);

		if(this.isosurface !== null) {

			this.isosurface.createTransferList(transferList);

		}

		return transferList;

	}

	/**
	 * Extracts a surface from the given Hermite data.
	 *
	 * @param {ExtractionRequest} request - An extraction request.
	 */

	process(request) {

		// Reset the container group and adopt the provided data.
		const containerGroup = super.process(request).containerGroup;

		// Generate the isosurface.
		this.isosurface = DualContouring.run(containerGroup);

		return this;

	}

}
