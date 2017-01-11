import { Octree } from "sparse-octree";
import { Box3 } from "../../math/box3.js";
import { OperationType } from "../csg/operation-type.js";
import { Chunk } from "./chunk.js";
import { VolumeIterator } from "./volume-iterator.js";

/**
 * Rounds the given number up to the next power of two.
 *
 * @method ceil2
 * @private
 * @static
 * @param {Number} n - A number.
 * @return {Number} The next power of two.
 */

function ceil2(n) { return Math.pow(2, Math.max(0, Math.ceil(Math.log2(n)))); }

/**
 * A cubic octree that maintains volume chunks.
 *
 * @class Volume
 * @submodule octree
 * @extends Octree
 * @implements Iterable
 * @constructor
 * @param {Number} [chunkSize=32] - The size of leaf chunks. Will be rounded up to the next power of two.
 * @param {Number} [resolution=32] - The data resolution of leaf chunks. Will be rounded up to the next power of two. The upper limit is 256.
 */

export class Volume extends Octree {

	constructor(chunkSize = 32, resolution = 32) {

		super();

		this.root = new Chunk();

		/**
		 * The size of a volume chunk.
		 *
		 * @property chunkSize
		 * @type Number
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
	 * @property size
	 * @type Number
	 */

	get size() { return this.root.size; }

	set size(x) { this.root.size = x; }

	/**
	 * The resolution of the volume data.
	 *
	 * @property resolution
	 * @type Number
	 */

	get resolution() { return this.root.resolution; }

	/**
	 * Edits this volume.
	 *
	 * @method edit
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {Array} The chunks that lie inside the operation's region, including newly created ones.
	 */

	edit(sdf) {

		const heap = [this.root];
		const box = new Box3();
		const region = sdf.completeBoundingBox;

		let result = [];
		let octant, children;

		if(sdf.operation === OperationType.UNION) {

			this.expand(region);

			// Find and create leaf chunks.
			while(heap.length > 0) {

				octant = heap.pop();
				children = octant.children;

				box.min = octant.min;
				box.max = octant.max;

				if(region.intersectsBox(box)) {

					if(children !== null) {

						heap.push(...children);

					} else if(octant.size > this.chunkSize) {

						octant.split();
						heap.push(...octant.children);

					} else {

						result.push(octant);

					}

				}

			}

		} else if(sdf.operation === OperationType.DIFFERENCE) {

			// Chunks that don't exist can't become more empty.
			result = this.chunks(region);

		} else {

			// Intersections affect all chunks.
			result = this;

		}

		return result;

	}

	/**
	 * Expands the volume to include the given region.
	 *
	 * @method expand
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
	 * @method prune
	 * @param {Chunk} chunk - A chunk to remove.
	 * @todo
	 */

	prune(chunk) {

	}

	/**
	 * Returns a volume iterator that finds chunks inside a specific region.
	 *
	 * @method chunks
	 * @param {Frustum} [region] - A region.
	 * @return {VolumeIterator} An iterator.
	 */

	chunks(region) {

		const iterator = new VolumeIterator(this);

		if(region !== undefined) {

			iterator.region.copy(region);

		}

		return iterator;

	}

	/**
	 * Loads a volume.
	 *
	 * @method load
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
	 * @method toJSON
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
