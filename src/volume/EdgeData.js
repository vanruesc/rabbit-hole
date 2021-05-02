import { EdgeIterator } from "./EdgeIterator";

/**
 * Stores edge data separately for each dimension.
 *
 * With a grid resolution N, there are `3 * (N + 1)² * N` edges in total, but
 * the number of edges that actually contain the volume's surface is usually
 * much lower.
 *
 * @implements {Serializable}
 * @implements {Deserializable}
 * @implements {TransferableContainer}
 */

export class EdgeData {

	/**
	 * Constructs new edge data.
	 *
	 * @param {Number} n - The material grid resolution.
	 * @param {Number} [x=0] - The amount of edges along the X-axis. If <= 0, no memory will be allocated.
	 * @param {Number} [y=x] - The amount of edges along the Y-axis. If omitted, this will be the same as x.
	 * @param {Number} [z=x] - The amount of edges along the Z-axis. If omitted, this will be the same as x.
	 */

	constructor(n, x = 0, y = x, z = x) {

		/**
		 * The material grid resolution.
		 *
		 * @type {Number}
		 */

		this.resolution = n;

		/**
		 * The edges.
		 *
		 * Edges are stored as starting grid point indices in ascending order. The
		 * ending point indices are implicitly defined through the dimension split:
		 *
		 * Given a starting point index A, the ending point index B for the X-, Y-
		 * and Z-axis is defined as `A + 1`, `A + N` and `A + N²` respectively where
		 * N is the grid resolution + 1.
		 *
		 * @type {Uint32Array[]}
		 */

		this.indices = (x <= 0) ? null : [
			new Uint32Array(x),
			new Uint32Array(y),
			new Uint32Array(z)
		];

		/**
		 * The Zero Crossing interpolation values.
		 *
		 * Each value describes the relative surface intersection position on the
		 * respective edge. The values correspond to the order of the edges.
		 *
		 * @type {Float32Array[]}
		 */

		this.zeroCrossings = (x <= 0) ? null : [
			new Float32Array(x),
			new Float32Array(y),
			new Float32Array(z)
		];

		/**
		 * The surface intersection normals.
		 *
		 * The vectors are stored as [x, y, z] float triples and correspond to the
		 * order of the edges.
		 *
		 * @type {Float32Array[]}
		 */

		this.normals = (x <= 0) ? null : [
			new Float32Array(x * 3),
			new Float32Array(y * 3),
			new Float32Array(z * 3)
		];

	}

	/**
	 * Serialises this data.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		return {
			resolution: this.resolution,
			edges: this.edges,
			zeroCrossings: this.zeroCrossings,
			normals: this.normals
		};

	}

	/**
	 * Adopts the given serialised data.
	 *
	 * @param {Object} object - Serialised edge data. Can be null.
	 * @return {Deserializable} This object or null if the given serialised data was null.
	 */

	deserialize(object) {

		let result = this;

		if(object !== null) {

			this.resolution = object.resolution;
			this.edges = object.edges;
			this.zeroCrossings = object.zeroCrossings;
			this.normals = object.normals;

		} else {

			result = null;

		}

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		const arrays = [

			this.edges[0],
			this.edges[1],
			this.edges[2],

			this.zeroCrossings[0],
			this.zeroCrossings[1],
			this.zeroCrossings[2],

			this.normals[0],
			this.normals[1],
			this.normals[2]

		];

		let array;
		let i, l;

		for(i = 0, l = arrays.length; i < l; ++i) {

			array = arrays[i];

			if(array !== null) {

				transferList.push(array.buffer);

			}

		}

		return transferList;

	}

	/**
	 * Returns a new edge iterator.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @return {EdgeIterator} An iterator.
	 */

	edges(cellPosition, cellSize) {

		return new EdgeIterator(this, cellPosition, cellSize);

	}

	/**
	 * Creates a new edge iterator that only returns edges along the X-axis.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @return {EdgeIterator} An iterator.
	 */

	edgesX(cellPosition, cellSize) {

		return new EdgeIterator(this, cellPosition, cellSize, 0, 1);

	}

	/**
	 * Creates a new edge iterator that only returns edges along the Y-axis.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @return {EdgeIterator} An iterator.
	 */

	edgesY(cellPosition, cellSize) {

		return new EdgeIterator(this, cellPosition, cellSize, 1, 2);

	}

	/**
	 * Creates a new edge iterator that only returns edges along the Z-axis.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @return {EdgeIterator} An iterator.
	 */

	edgesZ(cellPosition, cellSize) {

		return new EdgeIterator(this, cellPosition, cellSize, 2, 3);

	}

	/**
	 * Calculates the amount of edges for one axis based on a given resolution.
	 *
	 * @param {Number} n - The grid resolution.
	 * @return {Number} The amount of edges for a single dimension.
	 */

	static calculate1DEdgeCount(n) {

		return Math.pow((n + 1), 2) * n;

	}

}
