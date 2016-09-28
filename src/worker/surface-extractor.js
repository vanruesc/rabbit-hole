import { DualContouring } from "../isosurface";
import { Chunk } from "../volume";
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
		data: null,
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
	 * @todo Use flat arrays.
	 */

	extract(chunk) {

		const indexBuffer = [];
		const vertexBuffer = [];
		const normalBuffer = [];

		const transferList = [];

		let indices = null;
		let positions = null;
		let normals = null;

		let i, j, k;
		let vertex, normal;
		let vertexCount;

		// Adopt the provided chunk data.
		this.chunk.deserialise(chunk);
		this.chunk.data.decompress();

		vertexCount = DualContouring.run(this.chunk, 0.01, indexBuffer, vertexBuffer, normalBuffer);

		if(vertexCount > 65536) {

			console.warn(
				"Could not create geometry for chunk of size", this.chunk.size,
				"at position", this.chunk.min, "with lod", this.chunk.data.lod,
				"(vertex count of", vertexCount, "exceeds limit of 65536)"
			);

		} else if(vertexCount > 0) {

			// Indices can be copied directly.
			indices = new Uint16Array(indexBuffer);

			// Vertex positions and normals must be flattened.
			positions = new Float32Array(vertexCount * 3);
			normals = new Float32Array(vertexCount * 3);

			for(i = 0, j = 0, k = 0; i < vertexCount; ++i) {

				vertex = vertexBuffer[i];
				normal = normalBuffer[i];

				positions[j++] = vertex.x;
				positions[j++] = vertex.y;
				positions[j++] = vertex.z;

				normals[k++] = normal.x;
				normals[k++] = normal.y;
				normals[k++] = normal.z;

			}

			transferList.push(indices.buffer);
			transferList.push(positions.buffer);
			transferList.push(normals.buffer);

		}

		this.chunk.data.compress();

		this.message.data = chunk.data.serialise();
		this.message.indices = indices;
		this.message.positions = positions;
		this.message.normals = normals;

		this.transferList = this.chunk.createTransferList(transferList);

	}

};
