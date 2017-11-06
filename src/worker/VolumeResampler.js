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
		 * The result of the resampling process.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.data = null;

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

		response.data = (this.data !== null) ? this.data.serialize() : null;

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

		return (this.data !== null) ? this.data.createTransferList(transferList) : transferList;

	}

	/**
	 * Resamples the given Hermite data.
	 *
	 * @param {ResamplingRequest} request - A resampling request.
	 */

	process(request) {

		// Reset the container group and adopt the provided data.
		const containerGroup = super.process(request).containerGroup;

		// Resample the given data into a new set of volume data.
		const result = this.data = HermiteData.resample(containerGroup);

		if(result !== null) {

			result.compress();

		}

		return this;

	}

}
