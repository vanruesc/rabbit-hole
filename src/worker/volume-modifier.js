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
	 * @static
	 */

	chunk: new Chunk(),

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

		// Adopt the provided chunk data.
		this.chunk.deserialise(chunk);

		// Unwrap the operation and execute it.
		Operation.create(operation).modify(this.chunk);

		// Chunk data might be null.
		this.message.data = this.chunk.serialise().data;
		this.transferList = this.chunk.createTransferList();

	}

};
