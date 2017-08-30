import { RunLengthEncoding } from "../compression/RunLengthEncoding.js";
import { Material } from "./Material.js";
import { EdgeData } from "./EdgeData.js";

/**
 * The material grid resolution.
 *
 * @type {Number}
 * @private
 * @default 0
 */

let resolution = 0;

/**
 * The total amount of grid point indices.
 *
 * @type {Number}
 * @private
 * @default 0
 */

let indexCount = 0;

/**
 * Hermite data.
 */

export class HermiteData {

	/**
	 * Constructs a new set of hermite data.
	 *
	 * @param {Boolean} [initialise=true] - Whether the data should be initialised immediately.
	 */

	constructor(initialise = true) {

		/**
		 * The current level of detail.
		 *
		 * @type {Number}
		 * @default -1
		 */

		this.lod = -1;

		/**
		 * Indicates whether this data is currently gone.
		 *
		 * @type {Boolean}
		 * @default false
		 */

		this.neutered = false;

		/**
		 * Describes how many material indices are currently solid:
		 *
		 * - The chunk lies outside the volume if there are no solid grid points.
		 * - The chunk lies completely inside the volume if all points are solid.
		 *
		 * @type {Number}
		 * @default 0
		 */

		this.materials = 0;

		/**
		 * The grid points.
		 *
		 * @type {Uint8Array}
		 */

		this.materialIndices = initialise ? new Uint8Array(indexCount) : null;

		/**
		 * Run-length compression data.
		 *
		 * @type {Uint32Array}
		 * @default null
		 */

		this.runLengths = null;

		/**
		 * The edge data.
		 *
		 * @type {EdgeData}
		 * @default null
		 */

		this.edgeData = null;

	}

	/**
	 * Indicates whether this data container is empty.
	 *
	 * @type {Boolean}
	 */

	get empty() { return (this.materials === 0); }

	/**
	 * Indicates whether this data container is full.
	 *
	 * @type {Boolean}
	 */

	get full() { return (this.materials === indexCount); }

	/**
	 * Indicates whether this data is currently compressed.
	 *
	 * @type {Boolean}
	 */

	get compressed() { return (this.runLengths !== null); }

	/**
	 * Adopts the given data.
	 *
	 * @param {HermiteData} data - The data to adopt.
	 * @return {HermiteData} This data.
	 */

	set(data) {

		this.lod = data.lod;
		this.neutered = data.neutered;
		this.materials = data.materials;
		this.materialIndices = data.materialIndices;
		this.runLengths = data.runLengths;
		this.edgeData = data.edgeData;

		return this;

	}

	/**
	 * Removes all data.
	 *
	 * @return {HermiteData} This data.
	 */

	clear() {

		this.lod = -1;
		this.neutered = false;
		this.materials = 0;
		this.materialIndices = null;
		this.runLengths = null;
		this.edgeData = null;

		return this;

	}

	/**
	 * Sets the specified material index.
	 *
	 * @param {Number} index - The index of the material index that should be updated.
	 * @param {Number} value - The new material index.
	 */

	setMaterialIndex(index, value) {

		// Keep track of how many material indices are solid.
		if(this.materialIndices[index] === Material.AIR) {

			if(value !== Material.AIR) {

				++this.materials;

			}

		} else if(value === Material.AIR) {

			--this.materials;

		}

		this.materialIndices[index] = value;

	}

	/**
	 * Compresses this data.
	 *
	 * @param {HermiteData} [target=this] - An optional target data set. If none is provided, the original data will be replaced with the compressed data.
	 * @return {HermiteData} The target data set.
	 */

	compress(target = this) {

		let encoding;

		if(!this.compressed) {

			// Note: empty sets won't be compressed. They can be discarded.
			if(this.full) {

				// This deliberately destroys material variations!
				encoding = new RunLengthEncoding(
					[this.materialIndices.length],
					[Material.SOLID]
				);

			} else {

				encoding = RunLengthEncoding.encode(this.materialIndices);

			}

			target.runLengths = new Uint32Array(encoding.runLengths);
			target.materialIndices = new Uint8Array(encoding.data);

		}

		return target;

	}

	/**
	 * Decompresses this data.
	 *
	 * @param {HermiteData} [target=this] - An optional target data set. If none is provided, the compressed data will be replaced with the decompressed data.
	 * @return {HermiteData} The target data set.
	 */

	decompress(target = this) {

		if(this.compressed) {

			target.materialIndices = RunLengthEncoding.decode(
				this.runLengths, this.materialIndices, new Uint8Array(indexCount)
			);

			target.runLengths = null;

		}

		return target;

	}

	/**
	 * Serialises this data.
	 *
	 * @return {Object} The serialised version of the data.
	 */

	serialise() {

		this.neutered = true;

		return {
			lod: this.lod,
			materials: this.materials,
			materialIndices: this.materialIndices,
			runLengths: this.runLengths,
			edgeData: (this.edgeData !== null) ? this.edgeData.serialise() : null
		};

	}

	/**
	 * Adopts the given serialised data.
	 *
	 * @param {Object} object - Serialised hermite data.
	 */

	deserialise(object) {

		this.lod = object.lod;
		this.materials = object.materials;

		this.materialIndices = object.materialIndices;
		this.runLengths = object.runLengths;

		if(object.edgeData !== null) {

			if(this.edgeData === null) {

				this.edgeData = new EdgeData(0);

			}

			this.edgeData.deserialise(object.edgeData);

		} else {

			this.edgeData = null;

		}

		this.neutered = false;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An existing list that the transferable items should be added to.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		if(this.edgeData !== null) { this.edgeData.createTransferList(transferList); }

		transferList.push(this.materialIndices.buffer);
		transferList.push(this.runLengths.buffer);

		return transferList;

	}

	/**
	 * The material grid resolution.
	 *
	 * @type {Number}
	 */

	static get resolution() { return resolution; }

	/**
	 * This value can only be set once.
	 *
	 * @type {Number}
	 */

	static set resolution(x) {

		if(resolution === 0) {

			resolution = Math.max(1, Math.min(256, x));
			indexCount = Math.pow((resolution + 1), 3);

		}

	}

}
