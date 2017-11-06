import { ContainerGroup } from "../volume/ContainerGroup.js";
import { HermiteData } from "../volume/HermiteData.js";

/**
 * A Hermite data group.
 *
 * @type {ContainerGroup}
 * @private
 * @final
 */

const containerGroup = new ContainerGroup();

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
		 * A Hermite data group that acts as a fixed-size backup pool.
		 *
		 * @type {ContainerGroup}
		 * @private
		 */

		this.containerGroupBase = new ContainerGroup(

			new HermiteData(false), new HermiteData(false),
			new HermiteData(false), new HermiteData(false),

			new HermiteData(false), new HermiteData(false),
			new HermiteData(false), new HermiteData(false)

		);

		/**
		 * The active Hermite data group that will be used during processing.
		 *
		 * @type {ContainerGroup}
		 * @protected
		 */

		this.containerGroup = null;

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {DataMessage}
		 * @protected
		 */

		this.response = null;

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link DataProcessor#createTransferList}.
	 *
	 * @return {DataMessage} A response.
	 */

	respond() {

		this.response.containerGroup = this.containerGroup.serialize();

		return this.response;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		if(this.containerGroup !== null) {

			this.containerGroup.createTransferList(transferList);

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

		this.containerGroup = containerGroup.copy(this.containerGroupBase).deserialize(request.containerGroup);

		return this;

	}

}
