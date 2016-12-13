import { RunLengthEncoder } from "../core/run-length-encoder.js";
import { Material } from "./material.js";
import { EdgeData } from "./edge-data.js";

/**
 * The material grid resolution.
 *
 * @property resolution
 * @type Number
 * @private
 * @static
 * @default 0
 */

let resolution = 0;

/**
 * The total amount of grid point indices.
 *
 * @property indexCount
 * @type Number
 * @private
 * @static
 * @default 0
 */

let indexCount = 0;

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
		 * Indicates whether this data is currently gone.
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

		this.materialIndices = initialise ? new Uint8Array(indexCount) : null;

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

	get full() { return (this.materials === indexCount); }

	/**
	 * Adopts the given data.
	 *
	 * @method set
	 * @chainable
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
	 * Sets the specified material index.
	 *
	 * @method setMaterialIndex
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
					data: [Material.SOLID]
				};

			} else {

				encoding = RunLengthEncoder.encode(this.materialIndices);

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

			this.materialIndices = RunLengthEncoder.decode(
				this.runLengths, this.materialIndices, new Uint8Array(indexCount)
			);

			this.runLengths = null;

		}

		return this;

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
			materials: this.materials,
			materialIndices: this.materialIndices,
			runLengths: this.runLengths,
			edgeData: (this.edgeData !== null) ? this.edgeData.serialise() : null
		};

	}

	/**
	 * Adopts the given serialised data.
	 *
	 * @method deserialise
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
			indexCount = Math.pow((resolution + 1), 3);

		}

	}

}
