import { Vector3 } from "math-ds";
import IteratorResult from "iterator-result";
import { pattern } from "sparse-octree";
import { Edge } from "./Edge.js";
import { HermiteData } from "./HermiteData.js";

/**
 * An edge.
 *
 * @type {Edge}
 * @private
 */

const edge = new Edge();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const offsetA = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const offsetB = new Vector3();

/**
 * An edge iterator.
 *
 * @implements {Iterator}
 * @implements {Iterable}
 */

export class EdgeIterator {

	/**
	 * Constructs a new edge iterator.
	 *
	 * @param {EdgeData} edgeData - A set of edge data.
	 * @param {Vector3} cellPosition - The position of the data cell.
	 * @param {Number} cellSize - The size of the data cell.
	 * @param {Number} [c=0] - The dimension index to start at.
	 * @param {Number} [d=3] - The dimension limit.
	 */

	constructor(edgeData, cellPosition, cellSize, c = 0, d = 3) {

		/**
		 * The edge data.
		 *
		 * @type {EdgeData}
		 * @private
		 */

		this.edgeData = edgeData;

		/**
		 * The data cell position.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.cellPosition = cellPosition;

		/**
		 * The data cell size.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = cellSize;

		/**
		 * The edges.
		 *
		 * @type {Uint32Array[]}
		 * @private
		 */

		this.indices = null;

		/**
		 * The Zero Crossings.
		 *
		 * @type {Float32Array[]}
		 * @private
		 */

		this.zeroCrossings = null;

		/**
		 * The intersection normals.
		 *
		 * @type {Float32Array[]}
		 * @private
		 */

		this.normals = null;

		/**
		 * The axes of the existing edges.
		 *
		 * @type {Uint8Array[]}
		 */

		this.axes = null;

		/**
		 * The amount of edges in each dimensions.
		 *
		 * @type {Number[]}
		 */

		this.lengths = null;

		/**
		 * An iterator result.
		 *
		 * @type {IteratorResult}
		 * @private
		 */

		this.result = new IteratorResult();

		/**
		 * The initial dimension index.
		 *
		 * @type {Number}
		 * @private
		 */

		this.initialC = c;

		/**
		 * The current dimension index.
		 *
		 * @type {Number}
		 * @private
		 */

		this.c = c;

		/**
		 * The initial dimension limit.
		 *
		 * @type {Number}
		 * @private
		 */

		this.initialD = d;

		/**
		 * The dimension limit.
		 *
		 * @type {Number}
		 * @private
		 */

		this.d = d;

		/**
		 * The current iteration index.
		 *
		 * @type {Number}
		 * @private
		 */

		this.i = 0;

		/**
		 * The current iteration limit.
		 *
		 * @type {Number}
		 * @private
		 */

		this.l = 0;

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return {EdgeIterator} This iterator.
	 */

	reset() {

		const edgeData = this.edgeData;
		const indices = [];
		const zeroCrossings = [];
		const normals = [];
		const axes = [];
		const lengths = [];

		let a, c, d, l;

		this.i = 0;
		this.c = 0;
		this.d = 0;

		// Create a collection of edges without empty arrays.
		for(c = this.initialC, a = 4 >> c, d = this.initialD; c < d; ++c, a >>= 1) {

			l = edgeData.indices[c].length;

			if(l > 0) {

				indices.push(edgeData.indices[c]);
				zeroCrossings.push(edgeData.zeroCrossings[c]);
				normals.push(edgeData.normals[c]);
				axes.push(pattern[a]);
				lengths.push(l);

				++this.d;

			}

		}

		this.l = (lengths.length > 0) ? lengths[0] : 0;

		this.indices = indices;
		this.zeroCrossings = zeroCrossings;
		this.normals = normals;
		this.axes = axes;
		this.lengths = lengths;

		this.result.reset();

		return this;

	}

	/**
	 * Iterates over the edges.
	 *
	 * @return {IteratorResult} The next edge.
	 */

	next() {

		const s = this.cellSize;
		const n = HermiteData.resolution;
		const m = n + 1;
		const mm = m * m;

		const result = this.result;
		const base = this.cellPosition;

		let axis, index;
		let x, y, z;
		let c, i;

		// Has the end been reached?
		if(this.i === this.l) {

			// Move on to the next set of edges (X -> Y -> Z).
			this.l = (++this.c < this.d) ? this.lengths[this.c] : 0;
			this.i = 0;

		}

		// Are there any edges left?
		if(this.i < this.l) {

			c = this.c;
			i = this.i;

			axis = this.axes[c];

			// Each edge is uniquely described by its starting grid point index.
			index = this.indices[c][i];
			edge.index = index;

			// Calculate the local grid coordinates from the one-dimensional index.
			x = index % m;
			y = Math.trunc((index % mm) / m);
			z = Math.trunc(index / mm);

			edge.coordinates.set(x, y, z);

			offsetA.set(
				x * s / n,
				y * s / n,
				z * s / n
			);

			offsetB.set(
				(x + axis[0]) * s / n,
				(y + axis[1]) * s / n,
				(z + axis[2]) * s / n
			);

			edge.a.addVectors(base, offsetA);
			edge.b.addVectors(base, offsetB);

			edge.t = this.zeroCrossings[c][i];
			edge.n.fromArray(this.normals[c], i * 3);

			result.value = edge;

			++this.i;

		} else {

			// There are no more edges left.
			result.value = null;
			result.done = true;

		}

		return result;

	}

	/**
	 * Called when this iterator will no longer be run to completion.
	 *
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
	 * @return {EdteIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}
