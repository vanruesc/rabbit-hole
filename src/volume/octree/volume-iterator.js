import IteratorResult from "iterator-result";
import { Box3, Frustum } from "three";

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
 * A volume iterator.
 *
 * @class VolumeIterator
 * @submodule volume
 * @implements Iterator
 * @constructor
 * @param {Volume} volume - A volume octree.
 */

export class VolumeIterator {

	constructor(volume) {

		/**
		 * The volume octree.
		 *
		 * @property volume
		 * @type Volume
		 * @private
		 */

		this.volume = volume;

		/**
		 * An iterator result.
		 *
		 * @property result
		 * @type IteratorResult
		 * @private
		 */

		this.result = new IteratorResult();

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
		 * Iteration indices.
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

		if(this.region.intersectsBox(BOX3)) {

			this.trace.push(root);
			this.indices.push(0);

		}

		this.result.reset();

	}

	/**
	 * Iterates over the volume chunks.
	 *
	 * @method next
	 * @return {IteratorResult} The next voxel.
	 */

	next() {

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

					if(region.intersectsBox(BOX3)) {

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

		this.result.value = octant;
		this.result.done = (octant === null);

		return this.result;

	}

	/**
	 * Called when this iterator will no longer be run to completion.
	 *
	 * @method return
	 * @param {Object} value - An interator result value.
	 * @return {IteratorResult} - A premature completion result.
	 */

	return(value) {

		this.result.value = value;
		this.result.done = true;

		return this.result;

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
