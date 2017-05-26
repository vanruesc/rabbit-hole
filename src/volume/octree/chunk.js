import { CubicOctant } from "sparse-octree";
import { HermiteData } from "../hermite-data.js";

/**
 * A cubic volume chunk.
 */

export class Chunk extends CubicOctant {

	/**
	 * Constructs a new volume chunk.
	 *
	 * @param {Vector3} min - The lower bounds.
	 * @param {Vector3} max - The size.
	 */

	constructor(min, size) {

		super(min, size);

		/**
		 * Hermite data.
		 *
		 * @type {HermiteData}
		 * @default null
		 */

		this.data = null;

		/**
		 * A CSG operation queue.
		 *
		 * @type {Queue}
		 * @default null
		 */

		this.csg = null;

	}

	/**
	 * The material grid resolution of all volume chunks. The upper limit is 256.
	 *
	 * The effective resolution of a chunk is the distance between two adjacent
	 * grid points in global coordinates.
	 *
	 * This value can only be set once.
	 *
	 * @type {Number}
	 */

	get resolution() { return HermiteData.resolution; }

	/**
	 * @type {Number}
	 */

	set resolution(x) { HermiteData.resolution = x; }

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An existing list to be filled with transferable items.
	 * @return {Array} A transfer list.
	 */

	createTransferList(transferList = []) {

		return (this.data !== null) ? this.data.createTransferList(transferList) : transferList;

	}

	/**
	 * Serialises this chunk.
	 *
	 * @return {Object} A serialised description of this chunk.
	 */

	serialise() {

		return {
			resolution: this.resolution,
			min: this.min.toArray(),
			size: this.size,
			data: (this.data !== null) ? this.data.serialise() : null
		};

	}

	/**
	 * Adopts the given serialised data.
	 *
	 * @param {Object} object - A serialised chunk description.
	 */

	deserialise(object) {

		this.resolution = object.resolution;
		this.min.fromArray(object.min);
		this.size = object.size;

		if(object.data !== null) {

			if(this.data === null) {

				this.data = new HermiteData(false);

			}

			this.data.deserialise(object.data);

		} else {

			this.data = null;

		}

	}

}
