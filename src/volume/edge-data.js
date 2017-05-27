/**
 * Stores edge data separately for each dimension.
 *
 * With a grid resolution N, there are 3 * (N + 1)² * N edges in total, but
 * the number of edges that actually contain the volume's surface is usually
 * much lower.
 */

export class EdgeData {

	/**
	 * Constructs new edge data.
	 *
	 * @param {Number} x - The amount of edges along the X-axis.
	 * @param {Number} [y=x] - The amount of edges along the Y-axis. If omitted, this will be the same as x.
	 * @param {Number} [z=x] - The amount of edges along the Z-axis. If omitted, this will be the same as x.
	 */

	constructor(x, y = x, z = x) {

		/**
		 * The edges.
		 *
		 * Edges are stored as starting grid point indices in ascending order. The
		 * ending point indices are implicitly defined through the dimension split:
		 *
		 * Given a starting point index A, the ending point index B for the X-, Y-
		 * and Z-axis is defined as A + 1, A + N and A + N² respectively where N is
		 * the grid resolution + 1.
		 *
		 * @type {Uint32Array[]}
		 */

		this.edges = [
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

		this.zeroCrossings = [
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

		this.normals = [
			new Float32Array(x * 3),
			new Float32Array(y * 3),
			new Float32Array(z * 3)
		];

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An existing list to be filled with transferable items.
	 * @return {Array} A transfer list.
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

		while(arrays.length > 0) {

			array = arrays.pop();

			if(array !== null) {

				transferList.push(array.buffer);

			}

		}

		return transferList;

	}

	/**
	 * Serialises this data.
	 *
	 * @return {Object} The serialised version of the data.
	 */

	serialise() {

		return {
			edges: this.edges,
			zeroCrossings: this.zeroCrossings,
			normals: this.normals
		};

	}

	/**
	 * Adopts the given serialised data.
	 *
	 * @param {Object} object - Serialised edge data.
	 */

	deserialise(object) {

		this.edges = object.edges;
		this.zeroCrossings = object.zeroCrossings;
		this.normals = object.normals;

	}

	/**
	 * Calculates the amount of edges for one axis based on a given resolution.
	 *
	 * @param {Number} The grid resolution.
	 * @return {Number} The amount of edges for a single dimension.
	 */

	static calculate1DEdgeCount(n) {

		return Math.pow((n + 1), 2) * n;

	}

}
