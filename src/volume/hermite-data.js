import { RunLengthEncoding } from "../core/run-length-encoding.js";
import { Density } from "./density.js";
import { EdgeData } from "./edge-data.js";

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
		 * @default null
		 */

		this.runLengths = null;

		/**
		 * The edge data.
		 *
		 * @property edgeData
		 * @type EdgeData
		 * @default null
		 */

		this.edgeData = null;

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
	 * Compresses this data.
	 *
	 * @method compress
	 * @chainable
	 * @return {HermiteData} This data.
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

		return this;

	}

	/**
	 * Decompresses this data.
	 *
	 * @method decompress
	 * @chainable
	 * @return {HermiteData} This data.
	 */

	decompress() {

		if(this.runLengths !== null) {

			this.materialIndices = RunLengthEncoding.decode(
				this.runLengths, this.materialIndices, new Uint8Array((resolution + 1) ** 3)
			);

			this.runLengths = null;

		}

		return this;

	}

	/**
	 * Sets the specified material index.
	 *
	 * @method setMaterialIndex
	 * @param {Number} index - The index of the material index that should be updated.
	 * @param {Number} value - The new material index.
	 */

	setMaterialIndex(index, value) {

		// Check if the material index changes.
		if(this.materialIndices[index] === Density.HOLLOW && value !== Density.HOLLOW) {

			++this.materials;

		} else if(this.materialIndices[index] !== Density.HOLLOW && value === Density.HOLLOW) {

			--this.materials;

		}

		this.materialIndices[index] = value;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @method createTransferList
	 * @param {Array} [transferList] - An existing list to be filled with transferable items.
	 * @return {Array} A transfer list.
	 */

	createTransferList(transferList = []) {

		if(this.edgeData !== null) { this.edgeData.createTransferList(transferList); }

		transferList.push(this.materialIndices.buffer);
		transferList.push(this.runLengths.buffer);

		return transferList;

	}

	/**
	 * Serialises this data.
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
			edgeData: (this.edgeData !== null) ? this.edgeData.serialise() : null
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

		if(data.edgeData !== null) {

			if(this.edgeData === null) {

				this.edgeData = new EdgeData(0);

			}

			this.edgeData.deserialise(data.edgeData);

		} else {

			this.edgeData = null;

		}

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
