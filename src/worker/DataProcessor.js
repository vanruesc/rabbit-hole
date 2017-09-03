import { HermiteData } from "../volume/HermiteData.js";

/**
 * A volume data processor.
 */

export class DataProcessor {

	/**
	 * Constructs a new data processor.
	 */

	constructor() {

		/**
		 * An empty set of Hermite data. Serves as a deserialization target for
		 * volume data received from the main thread.
		 *
		 * @type {HermiteData}
		 */

		this.data = new HermiteData(false);

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {Response}
		 */

		this.response = null;

		/**
		 * A list of transferable objects.
		 *
		 * @type {ArrayBuffer[]}
		 */

		this.transferList = null;

	}

	/**
	 * Processes the given request.
	 *
	 * @param {Request} request - A request.
	 */

	process(request) {}

}
