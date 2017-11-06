import { ConstructiveSolidGeometry } from "../volume/csg/ConstructiveSolidGeometry.js";
import { SDFReviver } from "../volume/sdf/SDFReviver.js";
import { ModificationResponse } from "./messages/ModificationResponse.js";
import { DataProcessor } from "./DataProcessor.js";

/**
 * A modifier that applies CSG operations to Hermite data.
 */

export class VolumeModifier extends DataProcessor {

	/**
	 * Constructs a new Hermite data modifier.
	 */

	constructor() {

		super();

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {ModificationResponse}
		 */

		this.response = new ModificationResponse();

		/**
		 * An SDF.
		 *
		 * @type {SignedDistanceFunction}
		 * @private
		 */

		this.sdf = null;

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link VolumeModifier#createTransferList}.
	 *
	 * @return {ModificationResponse} A response.
	 */

	respond() {

		// The container group contains the modified data.
		const response = super.respond();

		// Send the SDF back as it may contain transferable data.
		response.sdf = (this.sdf !== null) ? this.sdf.serialize() : null;

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

		return (this.sdf !== null) ? this.sdf.createTransferList(transferList) : transferList;

	}

	/**
	 * Modifies the given Hermite data using the provided SDF.
	 *
	 * @param {ModificationRequest} request - A modification request.
	 */

	process(request) {

		// Reset the container group and adopt the provided data.
		const containerGroup = super.process(request).containerGroup;
		const children = containerGroup.children;
		const cellPositions = request.cellPositions;
		const cellSizes = request.cellSizes;

		// Revive the SDF.
		const sdf = this.sdf = SDFReviver.reviveSDF(request.sdf);

		let result;
		let i, l;

		// Apply the SDF to the provided data sets, one by one.
		for(i = 0, l = request.size; i < l; ++i) {

			// The resulting data is uncompressed.
			result = ConstructiveSolidGeometry.run(cellPositions[i], cellSizes[i], children[i], sdf);

			// Update the data entry with the compressed result.
			children[i] = (result !== null) ? result.compress() : null;

		}

		return this;

	}

}
