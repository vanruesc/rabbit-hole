import { DualContouring } from "../isosurface";
import { Chunk } from "../volume/octree/chunk.js";
import { Action } from "./action.js";

/**
 * A surface extractor that generates triangles from hermite data.
 *
 * @class SurfaceExtractor
 * @submodule worker
 * @static
 */

export const SurfaceExtractor = {

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
		action: Action.EXTRACT,
		chunk: null,
		positions: null,
		normals: null,
		indices: null
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
	 * Extracts a surface from the given hermite data.
	 *
	 * @method extract
	 * @static
	 * @param {Object} chunk - A serialised volume chunk.
	 */

	extract(chunk) {

		const message = this.message;
		const transferList = [];

		// Adopt the provided chunk data.
		this.chunk.deserialise(chunk);
		this.chunk.data.decompress();

		const result = DualContouring.run(this.chunk);

		if(result !== null) {

			message.indices = result.indices;
			message.positions = result.positions;
			message.normals = result.normals;

			transferList.push(message.indices.buffer);
			transferList.push(message.positions.buffer);
			transferList.push(message.normals.buffer);

		} else {

			message.indices = null;
			message.positions = null;
			message.normals = null;

		}

		// Simply send the already compressed and serialised chunk back.
		this.chunk.deserialise(chunk);
		message.chunk = this.chunk.serialise();
		this.transferList = this.chunk.createTransferList(transferList);

	}

};
