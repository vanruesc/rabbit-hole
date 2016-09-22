import { Chunk } from "../volume";
import { Operation } from "../volume/csg";
import { Action } from "./action.js";

/**
 * A hermite data modifier that applies CSG operations to volume chunks.
 *
 * @class VolumeModifier
 * @submodule worker
 * @static
 */

export const VolumeModifier = {

	/**
	 * An empty chunk of hermite data.
	 *
	 * @property chunk
	 * @type Chunk
	 * @private
	 * @static
	 */

	chunk: new Chunk(),

	/**
	 * An empty operation.
	 *
	 * @property operation
	 * @type Operation
	 * @private
	 * @static
	 */

	operation: new Operation(),

	/**
	 * A container for the data that will be returned to the main thread.
	 *
	 * @property message
	 * @type Object
	 * @static
	 */

	message: {
		action: Action.MODIFY,
		data: null
	},

	/**
	 * A list of transferable objects.
	 *
	 * @property transferList
	 * @type Array
	 * @static
	 */

	transferList: null,

	/**
	 * Modifies the given hermite data.
	 *
	 * @method modify
	 * @static
	 */

	modify(chunk, operation) {

		// Unwrap the operation and adopt the provided chunk data.
		this.operation.deserialise(operation);
		this.chunk.deserialise(chunk);

		this.operation.run(this.chunk);

		// Export the new data.
		this.message.data = this.chunk.data.serialise();
		this.transferList = this.chunk.createTransferList();

	}

};
