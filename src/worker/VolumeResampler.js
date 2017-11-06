import { HermiteData } from "../volume/HermiteData.js";
import { ResamplingResponse } from "./messages/ResamplingResponse.js";
import { DataProcessor } from "./DataProcessor.js";

/**
 * A Hermite data resampler.
 */

export class VolumeResampler extends DataProcessor {

	/**
	 * Constructs a new Hermite data resampler.
	 */

	constructor() {

		super();

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {ResamplingResponse}
		 * @protected
		 */

		this.response = new ResamplingResponse();

		/**
		 * An empty set of Hermite data. Serves as a resampling target.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.data = new HermiteData(false);

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link VolumeResampler#createTransferList}.
	 *
	 * @return {ResamplingResponse} A response.
	 */

	respond() {

		const response = super.respond();
		const data = this.data;

		if(data !== null) {

			// Compress the generated data in place and send it back.
			response.data = data.compress().serialize();

		} else {

			response.data = null;

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

		if(this.data !== null) {

			this.data.createTransferList(transferList);

		}

		return transferList;

	}

	/**
	 * Resamples the given Hermite data.
	 *
	 * @param {ResamplingRequest} request - A resampling request.
	 */

	process(request) {

		// Reset the container group and adopt the provided data.
		const containerGroup = super.process(request).containerGroup;

		// Resample the given data into a new set of uncompressed volume data.
		this.data = HermiteData.resample(containerGroup, this.data);

		return this;

	}

}
