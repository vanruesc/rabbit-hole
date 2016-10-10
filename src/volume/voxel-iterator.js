import { PATTERN } from "sparse-octree";
import { IteratorResult } from "../core";
import { Density } from "./density.js";
import { Voxel } from "./voxel.js";

/**
 * An iterator result.
 *
 * @property result
 * @type IteratorResult
 * @private
 * @static
 */

const result = new IteratorResult();

/**
 * A voxel iterator.
 *
 * @class VoxelIterator
 * @submodule volume
 * @implements Iterator
 * @constructor
 * @param {Chunk} chunk - A volume chunk.
 */

export class VoxelIterator {

	constructor(chunk) {

		/**
		 * The volume chunk.
		 *
		 * @property chunk
		 * @type Chunk
		 * @private
		 */

		this.chunk = chunk;

		/**
		 * The current index into the volume.
		 *
		 * @property index
		 * @type Number
		 * @private
		 */

		this.index = 0;

	}

	/**
	 * Iterates over the voxels in this chunk.
	 *
	 * @method next
	 * @return {IteratorResult} The next voxel.
	 */

	next() {

		const data = this.chunk.data;

		const n = this.chunk.resolution;
		const voxels = n * n * n;

		let voxel = null;

		let i;
		let density, material;

		result.done = (this.index === voxels);

		if(!result.done) {

			voxel = new Voxel();

			for(i = 0; i < 8; ++i) {

				cornerPos.addVectors(leaf.min, v.fromArray(vertexMap[i]));

				density = sample(cornerPos);
				material = (density < 0) ? Density.SOLID : Density.HOLLOW;

				voxel.materials |= (material << i);

			}

			++this.index;

		}

		result.value = voxel;

		return result;

	}

	/**
	 * Called when this iterator will no longer be run to completion.
	 *
	 * @method return
	 * @param {Object} value - An interator result value.
	 * @return {IteratorResult} - A premature completion result.
	 */

	return(value) {

		result.value = value;
		result.done = true;

		return result;

	}

}
