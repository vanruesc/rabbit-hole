import { HermiteData } from "../volume/HermiteData.js";

/**
 * An empty set of Hermite data.
 *
 * @type {HermiteData}
 * @private
 * @final
 */

const data = new HermiteData(false);

/**
 * A volume data processor.
 *
 * @implements {TransferableContainer}
 */

export class DataProcessor {

	/**
	 * Constructs a new data processor.
	 */

	constructor() {

		/**
		 * A set of Hermite data that will be used during processing.
		 *
		 * @type {HermiteData}
		 * @protected
		 * @default null
		 */

		this.data = null;

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {DataMessage}
		 * @protected
		 * @default null
		 */

		this.response = null;

	}

	/**
	 * Returns the data of this processor.
	 *
	 * @return {HermiteData} The data.
	 */

	getData() {

		return this.data;

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link DataProcessor#createTransferList}.
	 *
	 * @return {DataMessage} A response.
	 */

	respond() {

		this.response.data = this.data.serialize();

		return this.response;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		if(this.data !== null) {

			this.data.createTransferList(transferList);

		}

		return transferList;

	}

	/**
	 * Processes the given request.
	 *
	 * @param {DataMessage} request - A request.
	 * @return {DataProcessor} This processor.
	 */

	process(request) {

		this.data = data.deserialize(request.data);

		return this;

	}

}
