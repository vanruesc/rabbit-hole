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

	}

	/**
	 * Modifies the given Hermite data using the provided SDF.
	 *
	 * @param {ModificationRequest} request - A modification request.
	 */

	process(request) {

		// Adopt the provided data.
		const data = (request.data !== null) ? this.data.deserialize(request.data) : null;

		// Revive the SDF and execute it.
		const result = ConstructiveSolidGeometry.run(
			request.cellSize, request.cellPosition,
			data, SDFReviver.reviveSDF(request.sdf)
		);

		// Send the generated data back.
		this.response.data = null;
		this.transferList = [];

		if(result !== null) {

			this.response.data = result.serialize();
			result.createTransferList(this.transferList);

		}

	}

}
