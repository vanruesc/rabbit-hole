import { RunLengthEncoding } from "../core";
import { Density } from "./density.js";

/**
 * The material grid resolution.
 *
 * @property resolution
 * @type Number
 * @default 0
 * @private
 * @static
 */

let resolution = 0;

/**
 * Hermite data.
 *
 * @class HermiteData
 * @submodule volume
 * @constructor
 * @param {Boolean} [initialise=true] - Whether the data should be initialised immediately.
 */

export class HermiteData {

	constructor(initialise = true) {

		/**
		 * The current level of detail.
		 *
		 * @property lod
		 * @type Number
		 * @default -1
		 */

		this.lod = -1;

		/**
		 * Indicates whether this data is currently being used by a worker.
		 *
		 * @property neutered
		 * @type Boolean
		 * @default false
		 */

		this.neutered = false;

		/**
		 * Describes how many material indices are currently solid:
		 *
		 * - The chunk lies outside the volume if there are no solid grid points.
		 * - The chunk lies completely inside the volume if all points are solid.
		 *
		 * This counter is primarily used to determine if the chunk is full.
		 *
		 * @property materials
		 * @type Number
		 * @private
		 * @default 0
		 */

		this.materials = 0;

		/**
		 * The grid points.
		 *
		 * @property materialIndices
		 * @type Uint8Array
		 */

		this.materialIndices = initialise ? new Uint8Array((resolution + 1) ** 3) : null;

		/**
		 * Run-length compression data.
		 *
		 * @property runLengths
		 * @type Uint32Array
		 */

		this.runLengths = null;

		/**
		 * The edges.
		 *
		 * Edges are stored sequentially as pairs of grid point indices. There are
		 * up to three index pairs for a single grid point. Consequently, these edge
		 * groups have a common starting point index. The starting point index of
		 * each next pair can only be equal to or greater than the previous one.
		 *
		 * With a grid resolution N, there are 3 * (N + 1)² * N edges in total, but
		 * the number of edges that actually contain the volume's surface is usually
		 * much lower.
		 *
		 * @property edges
		 * @type Uint32Array
		 */

		this.edges = null;

		/**
		 * The Zero Crossing interpolation values.
		 *
		 * Each value describes the relative surface intersection position on the
		 * respective edge. The values correspond to the order of the edge index
		 * pairs.
		 *
		 * @property t
		 * @type Float32Array
		 */

		this.t = null;

		/**
		 * The surface intersection normals.
		 *
		 * The vectors are stored as [x, y, z] float triples which correspond to the
		 * order of the edge index pairs.
		 *
		 * @property normals
		 * @type Float32Array
		 */

		this.normals = null;

	}

	/**
	 * Indicates whether this data container is empty.
	 *
	 * @property empty
	 * @type Boolean
	 */

	get empty() { return (this.materials === 0); }

	/**
	 * Indicates whether this data container is full.
	 *
	 * @property full
	 * @type Boolean
	 */

	get full() { return (this.materials === ((resolution + 1) ** 3)); }

	/**
	 * Compresses this data using Run-Length Encoding.
	 *
	 * @method compress
	 */

	compress() {

		let encoding;

		if(this.runLengths === null) {

			if(this.full) {

				encoding = {
					runLengths: [this.materialIndices.length],
					data: [Density.SOLID]
				};

			} else {

				encoding = RunLengthEncoding.encode(this.materialIndices);

			}

			this.runLengths = new Uint32Array(encoding.runLengths);
			this.materialIndices = new Uint8Array(encoding.data);

		}

	}

	/**
	 * Decompresses this data.
	 *
	 * @method decompress
	 */

	decompress() {

		if(this.runLengths !== null) {

			this.materialIndices = RunLengthEncoding.decode(
				this.runLengths, this.materialIndices, new Uint8Array((resolution + 1) ** 3)
			);

			this.runLengths = null;

		}

	}

	/**
	 * Sets the specified material index.
	 *
	 * @method setMaterialIndex
	 * @param {Number} index - The index of the material index that needs to be updated.
	 * @param {Number} value - The new material index.
	 */

	setMaterialIndex(index, value) {

		const materialIndex = this.materialIndices[index];

		this.materialIndices[index] = value;

		// Check if the material index has changed.
		if(materialIndex === Density.HOLLOW && this.materialIndices[index] !== Density.HOLLOW) {

			++this.materials;

		} else if(materialIndex !== Density.HOLLOW && this.materialIndices[index] === Density.HOLLOW) {

			--this.materials;

		}

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @method createTransferList
	 * @param {Array} [transferList] - An existing list to be filled with transferable items.
	 * @return {Array} A transfer list.
	 */

	createTransferList(transferList = []) {

		const arrays = [
			this.materialIndices,
			this.runLengths,
			this.edges,
			this.t,
			this.normals
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
	 * Serialises this chunk of data.
	 *
	 * @method serialise
	 * @return {Object} The serialised version of the data.
	 */

	serialise() {

		this.neutered = true;

		return {
			lod: this.lod,
			materialIndices: this.materialIndices,
			runLengths: this.runLengths,
			edges: this.edges,
			t: this.t,
			normals: this.normals
		};

	}

	/**
	 * Adopts the given serialised data.
	 *
	 * @method deserialise
	 * @param {Object} data - Serialised data.
	 */

	deserialise(data) {

		this.lod = data.lod;

		this.materialIndices = data.materialIndices;
		this.runLengths = data.runLengths;
		this.edges = data.edges;
		this.t = data.t;
		this.normals = data.normals;

		this.neutered = false;

	}

	/**
	 * The material grid resolution.
	 *
	 * @property resolution
	 * @type Number
	 * @static
	 */

	static get resolution() { return resolution; }

	static set resolution(x) {

		if(resolution === 0) {

			resolution = Math.max(1, Math.min(256, x));

		}

	}

}
