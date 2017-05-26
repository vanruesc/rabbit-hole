import { Chunk } from "../volume/octree/chunk.js";
import { ConstructiveSolidGeometry } from "../volume/csg/constructive-solid-geometry.js";
import { Reviver } from "../volume/sdf/reviver.js";
import { Action } from "./action.js";

/**
 * A hermite data modifier that applies CSG operations to volume chunks.
 */

export class VolumeModifier {

	/**
	 * Constructs a new hermite data modifier.
	 */

	constructor() {

		/**
		 * An empty chunk of hermite data.
		 *
		 * @type {Chunk}
		 */

		this.chunk = new Chunk();

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {Object}
		 * @property {Action} action - The worker action.
		 * @property {Chunk} chunk - A serialised volume chunk.
		 */

		this.message = {
			action: Action.MODIFY,
			chunk: null
		};

		/**
		 * A list of transferable objects.
		 *
		 * @type {ArrayBuffer[]}
		 */

		this.transferList = null;

	}

	/**
	 * Modifies the given hermite data.
	 *
	 * @param {Chunk} chunk - A volume chunk.
	 * @param {Object} sdf - A serialised SDF.
	 */

	modify(chunk, sdf) {

		// Adopt the provided chunk data.
		this.chunk.deserialise(chunk);

		// Revive the SDF and execute it.
		ConstructiveSolidGeometry.run(this.chunk, Reviver.reviveSDF(sdf));

		this.message.chunk = this.chunk.serialise();
		this.transferList = this.chunk.createTransferList();

	}

}
