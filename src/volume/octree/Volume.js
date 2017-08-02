import { Octree } from "sparse-octree";
import { Box3 } from "math-ds";
import { OperationType } from "../csg/OperationType.js";
import { Chunk } from "./Chunk.js";

/**
 * A computation helper.
 *
 * @type {Box3}
 * @private
 */

const box3 = new Box3();

/**
 * Rounds the given number up to the next power of two.
 *
 * @private
 * @param {Number} n - A number.
 * @return {Number} The next power of two.
 */

function ceil2(n) { return Math.pow(2, Math.max(0, Math.ceil(Math.log2(n)))); }

/**
 * A cubic octree that maintains volume chunks.
 */

export class Volume extends Octree {

	/**
	 * Constructs a new volume octree.
	 *
	 * @param {Number} [chunkSize=32] - The size of leaf chunks. Will be rounded up to the next power of two.
	 * @param {Number} [resolution=32] - The data resolution of leaf chunks. Will be rounded up to the next power of two. The upper limit is 256.
	 */

	constructor(chunkSize = 32, resolution = 32) {

		super();

		/**
		 * The root octant.
		 */

		this.root = new Chunk();

		/**
		 * The size of a volume chunk.
		 *
		 * @type {Number}
		 * @private
		 * @default 32
		 */

		this.chunkSize = Math.max(1, ceil2(chunkSize));

		this.min.subScalar(this.chunkSize * 2);
		this.size = this.chunkSize * 4;

		this.root.resolution = ceil2(resolution);

	}

	/**
	 * The size of the root octant.
	 *
	 * @type {Number}
	 */

	get size() { return this.root.size; }

	/**
	 * @type {Number}
	 */

	set size(x) { this.root.size = x; }

	/**
	 * The resolution of the volume data.
	 *
	 * @type {Number}
	 */

	get resolution() { return this.root.resolution; }

	/**
	 * Creates leaf octants in the specified region and returns them together with
	 * existing ones.
	 *
	 * @private
	 * @param {Chunk} octant - An octant.
	 * @param {Frustum|Box3} region - A region.
	 * @param {Number} size - A leaf octant target size.
	 * @param {Array} result - A list to be filled with octants that intersect with the region.
	 */

	grow(octant, region, size, result) {

		let children = octant.children;
		let i, l;

		box3.min = octant.min;
		box3.max = octant.max;

		if(region.intersectsBox(box3)) {

			if(children === null && octant.size > size) {

				octant.split();
				children = octant.children;

			}

			if(children !== null) {

				for(i = 0, l = children.length; i < l; ++i) {

					this.grow(children[i], region, size, result);

				}

			} else {

				result.push(octant);

			}

		}

	}

	/**
	 * Edits this volume.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {Array} The chunks that lie inside the operation's region, including newly created ones.
	 */

	edit(sdf) {

		const region = sdf.completeBoundingBox;

		let result = [];

		if(sdf.operation === OperationType.UNION) {

			// Find and create leaf octants.
			this.expand(region);
			this.grow(this.root, region, this.chunkSize, result);

		} else if(sdf.operation === OperationType.DIFFERENCE) {

			// Chunks that don't exist can't become more empty.
			result = this.leaves(region);

		} else {

			// Intersections affect all chunks.
			result = this.leaves();

		}

		return result;

	}

	/**
	 * Expands the volume to include the given region.
	 *
	 * @private
	 * @param {Box3} region - A region.
	 */

	expand(region) {

		const min = region.min;
		const max = region.max;

		const m = Math.max(
			Math.max(Math.max(Math.abs(min.x), Math.abs(min.y)), Math.abs(min.z)),
			Math.max(Math.max(Math.abs(max.x), Math.abs(max.y)), Math.abs(max.z))
		);

		let s = this.size / 2;
		let originalChildren = this.children;

		let n, i;

		if(m > s) {

			// Find an appropriate target size.
			n = ceil2(Math.ceil(m / this.chunkSize) * this.chunkSize);

			if(originalChildren === null) {

				// Expand the root's boundaries.
				this.min.set(-n, -n, -n);
				this.size = 2 * n;

			} else {

				// Repeatedly double the octree size and create intermediate octants.
				while(s < n) {

					s = this.size;

					this.min.multiplyScalar(2);
					this.size *= 2;

					// Create new children.
					this.root.split();

					// Connect them with the old children.
					for(i = 0; i < 8; ++i) {

						// But only if they actually contain deeper structures.
						if(originalChildren[i].children !== null) {

							this.children[i].split([originalChildren[i]]);

						}

					}

					originalChildren = this.children;

				}

			}

		}

	}

	/**
	 * Removes the given chunk and shrinks the volume if possible.
	 *
	 * @param {Chunk} chunk - A chunk to remove.
	 * @todo
	 */

	prune(chunk) {

	}

	/**
	 * Loads a volume.
	 *
	 * @param {String} data - The volume data to import.
	 */

	load(data) {

		Chunk.resolution = data.resolution;
		this.chunkSize = data.chunkSize;
		this.root = data.root;

	}

	/**
	 * Creates a compact representation of the current volume data.
	 *
	 * @return {Object} A concise representation of this volume.
	 */

	toJSON() {

		return {
			resolution: Chunk.resolution,
			chunkSize: this.chunkSize,
			root: this.root
		};

	}

}
