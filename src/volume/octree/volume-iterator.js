import { Box3, Frustum } from "three";
import { IteratorResult } from "../../core/iterator-result.js";

/**
 * A computation helper.
 *
 * @property BOX3
 * @type Box3
 * @private
 * @static
 * @final
 */

const BOX3 = new Box3();

/**
 * An iterator result.
 *
 * @property result
 * @type IteratorResult
 * @private
 * @static
 * @final
 */

const RESULT = new IteratorResult();

/**
 * An edge iterator.
 *
 * @class VolumeIterator
 * @submodule volume
 * @implements Iterator
 * @constructor
 * @param {Volume} volume - A volume octree.
 * @param {Boolean} [cull=false] - Whether the iterator should respect the cull region.
 */

export class VolumeIterator {

	constructor(volume, cull = false) {

		/**
		 * The volume octree.
		 *
		 * @property volume
		 * @type Volume
		 * @private
		 */

		this.volume = volume;

		/**
		 * An iteration trace that is used for pausing the octree traversal.
		 *
		 * @property trace
		 * @type Array
		 * @private
		 */

		this.cull = cull;

		/**
		 * A frustum used for octree culling.
		 *
		 * @property region
		 * @type Frustum
		 */

		this.region = new Frustum();

		/**
		 * An octant trace.
		 *
		 * @property trace
		 * @type Array
		 * @private
		 */

		this.trace = null;

		/**
		 * A trace of iteration indices.
		 *
		 * @property indices
		 * @type Array
		 * @private
		 */

		this.indices = null;

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @method reset
	 */

	reset() {

		const root = this.volume.root;

		this.trace = [];
		this.indices = [];

		BOX3.min = root.min;
		BOX3.max = root.max;

		if(!this.cull || this.region.intersectsBox(BOX3)) {

			this.trace.push(root);
			this.indices.push(0);

		}

		RESULT.reset();

	}

	/**
	 * Iterates over the volume chunks.
	 *
	 * @method next
	 * @return {IteratorResult} The next voxel.
	 */

	next() {

		const cull = this.cull;
		const region = this.region;
		const indices = this.indices;
		const trace = this.trace;

		let octant = null;
		let i = trace.length - 1;

		let index, children, child;

		while(octant === null && i >= 0) {

			index = indices[i];
			children = trace[i].children;

			++indices[i];

			if(index < 8) {

				if(children !== null) {

					child = children[index];

					BOX3.min = child.min;
					BOX3.max = child.max;

					if(!cull || region.intersectsBox(BOX3)) {

						trace.push(child);
						indices.push(0);

						++i;

					}

				} else {

					octant = trace.pop();
					indices.pop();

				}

			} else {

				trace.pop();
				indices.pop();

				--i;

			}

		}

		RESULT.value = octant;
		RESULT.done = (octant === null);

		return RESULT;

	}

	/**
	 * Called when this iterator will no longer be run to completion.
	 *
	 * @method return
	 * @param {Object} value - An interator result value.
	 * @return {IteratorResult} - A premature completion result.
	 */

	return(value) {

		RESULT.value = value;
		RESULT.done = true;

		return RESULT;

	}

	/**
	 * Returns this iterator.
	 *
	 * @method Symbol.iterator
	 * @return {VoxelIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}
