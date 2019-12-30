/**
 * rabbit-hole v0.0.0 build Mon Dec 30 2019
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
import { Event, EventTarget } from 'synthetic-event';
import { Box3, Vector3, Matrix4, Quaternion, Vector4, Vector2, Line3, Ray, Frustum, SymmetricMatrix3, Matrix3 } from 'math-ds';
import IteratorResult from 'iterator-result';
import { layout, edges, CubicOctant, Octree } from 'sparse-octree';

/**
 * The Serializable contract.
 *
 * Implemented by objects that can provide a flat representation of the data
 * they contain.
 *
 * @interface
 */

class Serializable {

	/**
	 * Serialises this data.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {}

}

/**
 * The Deserializable contract.
 *
 * Implemented by objects that can adopt serialised data.
 *
 * @interface
 */

class Deserializable {

	/**
	 * Adopts the given serialised data.
	 *
	 * @param {Object} object - Serialised data.
	 * @return {Deserializable} This object.
	 */

	deserialize(object) {}

}

/**
 * The Disposable contract.
 *
 * Implemented by objects that can free internal resources.
 *
 * @interface
 */

class Disposable {

	/**
	 * Frees internal resources.
	 */

	dispose() {}

}

/**
 * The TransferableContainer contract.
 *
 * Implemented by objects that can list their internal transferable objects.
 *
 * @interface
 */

class TransferableContainer {

	/**
	 * Creates a list of transferable items.
	 *
	 * The `Transferable` interface represents an object that can be transferred
	 * between different execution contexts, like the main thread and Web Workers.
	 *
	 * For example, `Worker.postMessage()` takes an optional array of
	 * `Transferable` objects to transfer ownership of. If the ownership of an
	 * object is transferred, it becomes unusable (neutered) in the context it was
	 * sent from and becomes available only to the worker it was sent to.
	 * `Transferable` objects are instances of classes like `ArrayBuffer`,
	 * `MessagePort` or `ImageBitmap`.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list. Null is not an acceptable value for the transferList.
	 */

	createTransferList(transferList = []) {}

}

/**
 * A FIFO queue.
 *
 * Elements are added to the end of the queue and removed from the front.
 *
 * Based on:
 *  http://code.stephenmorley.org/javascript/queues/
 */

class Queue {

	/**
	 * Constructs a new queue.
	 */

	constructor() {

		/**
		 * A list of elements.
		 *
		 * @type {Array}
		 */

		this.elements = [];

		/**
		 * The head of the queue.
		 *
		 * @type {Number}
		 */

		this.head = 0;

	}

	/**
	 * The current size of the queue.
	 *
	 * @type {Number}
	 */

	get size() {

		return (this.elements.length - this.head);

	}

	/**
	 * Returns true if the queue is empty, and false otherwise.
	 *
	 * @type {Boolean}
	 */

	get empty() {

		return (this.elements.length === 0);

	}

	/**
	 * Copies the given queue.
	 *
	 * @param {Queue} queue - A queue.
	 * @return {Queue} This queue.
	 */

	copy(queue) {

		this.elements = Array.from(queue.elements);
		this.head = queue.head;

		return this;

	}

	/**
	 * Clones this queue.
	 *
	 * @return {Queue} Th cloned queue.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

	/**
	 * Adds an element to the queue.
	 *
	 * @param {Object} element - An arbitrary object.
	 */

	add(element) {

		this.elements.push(element);

	}

	/**
	 * Retrieves, but does not remove, the head of the queue.
	 *
	 * @return {Object} The head of the queue, or undefined if the queue is empty.
	 */

	peek() {

		return (this.elements.length > 0) ? this.elements[this.head] : undefined;

	}

	/**
	 * Retrieves and removes the head of the queue.
	 *
	 * @return {Object} The head of the queue, or undefined if the queue is empty.
	 */

	poll() {

		const elements = this.elements;
		const length = elements.length;

		let element;

		if(length > 0) {

			element = elements[this.head++];

			// Remove free space if necessary.
			if(this.head * 2 >= length) {

				this.elements = elements.slice(this.head);
				this.head = 0;

			}

		}

		return element;

	}

	/**
	 * Resets this queue.
	 */

	clear() {

		this.elements = [];
		this.head = 0;

	}

}

/**
 * An enumeration of CSG operation types.
 *
 * @type {Object}
 * @property {String} UNION - Indicates a union of volume data.
 * @property {String} DIFFERENCE - Indicates a subtraction of volume data.
 * @property {String} INTERSECTION - Indicates an intersection of volume data.
 * @property {String} DENSITY_FUNCTION - Indicates volume data generation.
 */

const OperationType = {

	UNION: "csg.union",
	DIFFERENCE: "csg.difference",
	INTERSECTION: "csg.intersection",
	DENSITY_FUNCTION: "csg.densityfunction"

};

/**
 * An enumeration of material constants.
 *
 * @type {Object}
 * @property {Number} AIR - Indicates empty space.
 * @property {Number} SOLID - Indicates solid material.
 */

const Material = {

	AIR: 0,
	SOLID: 1

};

/**
 * A CSG operation.
 */

class Operation {

	/**
	 * Constructs a new operation.
	 *
	 * @param {OperationType} type - The type of this operation.
	 * @param {Operation} ...children - Child operations.
	 */

	constructor(type, ...children) {

		/**
		 * The type of this operation.
		 *
		 * @type {OperationType}
		 */

		this.type = type;

		/**
		 * A list of operations.
		 *
		 * Right-hand side operands have precedence, meaning that the result of the
		 * first item in the list will be dominated by the result of the second one,
		 * etc.
		 *
		 * @type {Operation[]}
		 * @private
		 */

		this.children = children;

		/**
		 * The bounding box of this operation.
		 *
		 * @type {Box3}
		 * @private
		 */

		this.boundingBox = null;

	}

	/**
	 * Calculates the complete bounding box of this CSG operation if it doesn't
	 * exist yet and returns it.
	 *
	 * @return {Box3} The bounding box.
	 */

	getBoundingBox() {

		if(this.boundingBox === null) {

			this.boundingBox = this.computeBoundingBox();

		}

		return this.boundingBox;

	}

	/**
	 * Calculates the bounding box of this CSG operation while taking all child
	 * operations into account.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		const children = this.children;
		const boundingBox = new Box3();

		let i, l;

		for(i = 0, l = children.length; i < l; ++i) {

			boundingBox.union(children[i].getBoundingBox());

		}

		return boundingBox;

	}

}

/**
 * A union operation.
 */

class Union extends Operation {

	/**
	 * Constructs a new union operation.
	 *
	 * @param {...Operation} children - Child operations.
	 */

	constructor(...children) {

		super(OperationType.UNION, ...children);

	}

	/**
	 * Updates the specified material index.
	 *
	 * @param {Number} index - The index of the material index that needs to be updated.
	 * @param {HermiteData} data0 - The target volume data.
	 * @param {HermiteData} data1 - Predominant volume data.
	 */

	updateMaterialIndex(index, data0, data1) {

		const materialIndex = data1.materialIndices[index];

		if(materialIndex !== Material.AIR) {

			data0.setMaterialIndex(index, materialIndex);

		}

	}

	/**
	 * Selects the edge that is closer to the non-solid grid point.
	 *
	 * @param {Edge} edge0 - An existing edge.
	 * @param {Edge} edge1 - A predominant edge.
	 * @param {Boolean} s - Whether the starting point of the edge is solid.
	 * @return {Edge} The selected edge.
	 */

	selectEdge(edge0, edge1, s) {

		return s ?
			((edge0.t > edge1.t) ? edge0 : edge1) :
			((edge0.t < edge1.t) ? edge0 : edge1);

	}

}

/**
 * A difference operation.
 */

class Difference extends Operation {

	/**
	 * Constructs a new difference operation.
	 *
	 * @param {Operation} ...children - Child operations.
	 */

	constructor(...children) {

		super(OperationType.DIFFERENCE, ...children);

	}

	/**
	 * Updates the specified material index.
	 *
	 * @param {Number} index - The index of the material index that needs to be updated.
	 * @param {HermiteData} data0 - The target volume data.
	 * @param {HermiteData} data1 - Predominant volume data.
	 */

	updateMaterialIndex(index, data0, data1) {

		if(data1.materialIndices[index] !== Material.AIR) {

			data0.setMaterialIndex(index, Material.AIR);

		}

	}

	/**
	 * Selects the edge that is closer to the solid grid point.
	 *
	 * @param {Edge} edge0 - An existing edge.
	 * @param {Edge} edge1 - A predominant edge.
	 * @param {Boolean} s - Whether the starting point of the edge is solid.
	 * @return {Edge} The selected edge.
	 */

	selectEdge(edge0, edge1, s) {

		return s ?
			((edge0.t < edge1.t) ? edge0 : edge1) :
			((edge0.t > edge1.t) ? edge0 : edge1);

	}

}

/**
 * An intersection operation.
 */

class Intersection extends Operation {

	/**
	 * Constructs a new intersection operation.
	 *
	 * @param {...Operation} children - Child operations.
	 */

	constructor(...children) {

		super(OperationType.INTERSECTION, ...children);

	}

	/**
	 * Updates the specified material index.
	 *
	 * @param {Number} index - The index of the material index that needs to be updated.
	 * @param {HermiteData} data0 - The target volume data.
	 * @param {HermiteData} data1 - Predominant volume data.
	 */

	updateMaterialIndex(index, data0, data1) {

		const materialIndex = data1.materialIndices[index];

		data0.setMaterialIndex(index, (data0.materialIndices[index] !== Material.AIR && materialIndex !== Material.AIR) ? materialIndex : Material.AIR);

	}

	/**
	 * Selects the edge that is closer to the solid grid point.
	 *
	 * @param {Edge} edge0 - An existing edge.
	 * @param {Edge} edge1 - A predominant edge.
	 * @param {Boolean} s - Whether the starting point of the edge is solid.
	 * @return {Edge} The selected edge.
	 */

	selectEdge(edge0, edge1, s) {

		return s ?
			((edge0.t < edge1.t) ? edge0 : edge1) :
			((edge0.t > edge1.t) ? edge0 : edge1);

	}

}

/**
 * Run-Length Encoding for numerical data.
 */

class RunLengthEncoding {

	/**
	 * Constructs a new container for Run-Length encoded data.
	 *
	 * @param {Number[]} [runLengths=null] - The run lengths.
	 * @param {Number[]} [data=null] - The encoded data.
	 */

	constructor(runLengths = null, data = null) {

		/**
		 * The run lengths.
		 *
		 * @type {Number[]}
		 */

		this.runLengths = runLengths;

		/**
		 * The encoded data.
		 *
		 * @type {Number[]}
		 */

		this.data = data;

	}

	/**
	 * Encodes the given data.
	 *
	 * @param {Number[]} array - The data to encode.
	 * @return {RunLengthEncoding} The run-lengths and the encoded data.
	 */

	static encode(array) {

		const runLengths = [];
		const data = [];

		let previous = array[0];
		let count = 1;

		let i, l;

		for(i = 1, l = array.length; i < l; ++i) {

			if(previous !== array[i]) {

				runLengths.push(count);
				data.push(previous);

				previous = array[i];
				count = 1;

			} else {

				++count;

			}

		}

		runLengths.push(count);
		data.push(previous);

		return new RunLengthEncoding(runLengths, data);

	}

	/**
	 * Decodes the given data.
	 *
	 * @param {Number[]} runLengths - The run-lengths.
	 * @param {Number[]} data - The data to decode.
	 * @param {Array} [array] - An optional target.
	 * @return {Array} The decoded data.
	 */

	static decode(runLengths, data, array = []) {

		let element;

		let i, j, il, jl;
		let k = 0;

		for(i = 0, il = data.length; i < il; ++i) {

			element = data[i];

			for(j = 0, jl = runLengths[i]; j < jl; ++j) {

				array[k++] = element;

			}

		}

		return array;

	}

}

/**
 * An isovalue bias for the Zero Crossing approximation.
 *
 * @type {Number}
 * @private
 */

const ISOVALUE_BIAS = 1e-4;

/**
 * An error threshold for the Zero Crossing approximation.
 *
 * @type {Number}
 * @private
 */

const INTERVAL_THRESHOLD = 1e-6;

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const ab = new Vector3();

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v = new Vector3();

/**
 * An edge between two material grid points.
 */

class Edge {

	/**
	 * Constructs a new edge.
	 *
	 * @param {Vector3} [a] - A starting point. If none is provided, a new vector will be created.
	 * @param {Vector3} [b] - An ending point. If none is provided, a new vector will be created.
	 */

	constructor(a = new Vector3(), b = new Vector3()) {

		/**
		 * The starting point of the edge.
		 *
		 * @type {Vector3}
		 */

		this.a = a;

		/**
		 * The ending point of the edge.
		 *
		 * @type {Vector3}
		 */

		this.b = b;

		/**
		 * The index of the starting material grid point.
		 *
		 * @type {Number}
		 */

		this.index = -1;

		/**
		 * The local grid coordinates of the starting point.
		 *
		 * @type {Vector3}
		 */

		this.coordinates = new Vector3();

		/**
		 * The Zero Crossing interpolation value.
		 *
		 * @type {Number}
		 */

		this.t = 0.0;

		/**
		 * The surface normal at the Zero Crossing position.
		 *
		 * @type {Vector3}
		 */

		this.n = new Vector3();

	}

	/**
	 * Approximates the smallest density along the edge.
	 *
	 * @param {SignedDistanceFunction} sdf - A density field.
	 * @param {Number} [steps=8] - The maximum number of interpolation steps. Cannot be smaller than 2.
	 */

	approximateZeroCrossing(sdf, steps = 8) {

		const s = Math.max(1, steps - 1);

		let a = 0.0;
		let b = 1.0;
		let c = 0.0;
		let i = 0;

		let densityA, densityC;

		// Compute the vector from a to b.
		ab.subVectors(this.b, this.a);

		// Use bisection to find the root of the SDF.
		while(i <= s) {

			c = (a + b) / 2;

			p.addVectors(this.a, v.copy(ab).multiplyScalar(c));
			densityC = sdf.sample(p);

			if(Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {

				// Solution found.
				break;

			} else {

				p.addVectors(this.a, v.copy(ab).multiplyScalar(a));
				densityA = sdf.sample(p);

				if(Math.sign(densityC) === Math.sign(densityA)) {

					a = c;

				} else {

					b = c;

				}

			}

			++i;

		}

		this.t = c;

	}

	/**
	 * Calculates the Zero Crossing position.
	 *
	 * @param {Vector3} target - A target for the Zero Crossing position. If none is provided, a new vector will be created.
	 * @return {Vector3} The Zero Crossing position.
	 */

	computeZeroCrossingPosition(target = new Vector3()) {

		return target.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);

	}

	/**
	 * Computes the normal of the surface at the edge intersection.
	 *
	 * @param {SignedDistanceFunction} sdf - A density field.
	 * @return {Vector3} The normal.
	 * @todo Use analytical derivation instead of finite differences.
	 */

	computeSurfaceNormal(sdf) {

		const position = this.computeZeroCrossingPosition(ab);
		const E = 1e-3;

		const dx = sdf.sample(p.addVectors(position, v.set(E, 0, 0))) - sdf.sample(p.subVectors(position, v.set(E, 0, 0)));
		const dy = sdf.sample(p.addVectors(position, v.set(0, E, 0))) - sdf.sample(p.subVectors(position, v.set(0, E, 0)));
		const dz = sdf.sample(p.addVectors(position, v.set(0, 0, E))) - sdf.sample(p.subVectors(position, v.set(0, 0, E)));

		this.n.set(dx, dy, dz).normalize();

	}

}

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

class EdgeIterator {

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
		 * @private
		 */

		this.axes = null;

		/**
		 * The amount of edges for each internal set of edges (X -> Y -> Z).
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
				axes.push(layout[a]);
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
		const n = this.edgeData.resolution;
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

/**
 * Stores edge data separately for each dimension.
 *
 * With a grid resolution N, there are `3 * (N + 1)² * N` edges in total, but
 * the number of edges that actually contain the volume's surface is usually
 * much lower.
 *
 * @implements {Serializable}
 * @implements {Deserializable}
 * @implements {TransferableContainer}
 */

class EdgeData {

	/**
	 * Constructs new edge data.
	 *
	 * @param {Number} n - The material grid resolution.
	 * @param {Number} [x=0] - The amount of edges along the X-axis. If <= 0, no memory will be allocated.
	 * @param {Number} [y=x] - The amount of edges along the Y-axis. If omitted, this will be the same as x.
	 * @param {Number} [z=x] - The amount of edges along the Z-axis. If omitted, this will be the same as x.
	 */

	constructor(n, x = 0, y = x, z = x) {

		/**
		 * The material grid resolution.
		 *
		 * @type {Number}
		 */

		this.resolution = n;

		/**
		 * The edges.
		 *
		 * Edges are stored as starting grid point indices in ascending order. The
		 * ending point indices are implicitly defined through the dimension split:
		 *
		 * Given a starting point index A, the ending point index B for the X-, Y-
		 * and Z-axis is defined as `A + 1`, `A + N` and `A + N²` respectively where
		 * N is the grid resolution + 1.
		 *
		 * @type {Uint32Array[]}
		 */

		this.indices = (x <= 0) ? null : [
			new Uint32Array(x),
			new Uint32Array(y),
			new Uint32Array(z)
		];

		/**
		 * The Zero Crossing interpolation values.
		 *
		 * Each value describes the relative surface intersection position on the
		 * respective edge. The values correspond to the order of the edges.
		 *
		 * @type {Float32Array[]}
		 */

		this.zeroCrossings = (x <= 0) ? null : [
			new Float32Array(x),
			new Float32Array(y),
			new Float32Array(z)
		];

		/**
		 * The surface intersection normals.
		 *
		 * The vectors are stored as [x, y, z] float triples and correspond to the
		 * order of the edges.
		 *
		 * @type {Float32Array[]}
		 */

		this.normals = (x <= 0) ? null : [
			new Float32Array(x * 3),
			new Float32Array(y * 3),
			new Float32Array(z * 3)
		];

	}

	/**
	 * Serialises this data.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		return {
			resolution: this.resolution,
			edges: this.edges,
			zeroCrossings: this.zeroCrossings,
			normals: this.normals
		};

	}

	/**
	 * Adopts the given serialised data.
	 *
	 * @param {Object} object - Serialised edge data. Can be null.
	 * @return {Deserializable} This object or null if the given serialised data was null.
	 */

	deserialize(object) {

		let result = this;

		if(object !== null) {

			this.resolution = object.resolution;
			this.edges = object.edges;
			this.zeroCrossings = object.zeroCrossings;
			this.normals = object.normals;

		} else {

			result = null;

		}

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		const arrays = [

			this.edges[0],
			this.edges[1],
			this.edges[2],

			this.zeroCrossings[0],
			this.zeroCrossings[1],
			this.zeroCrossings[2],

			this.normals[0],
			this.normals[1],
			this.normals[2]

		];

		let array;
		let i, l;

		for(i = 0, l = arrays.length; i < l; ++i) {

			array = arrays[i];

			if(array !== null) {

				transferList.push(array.buffer);

			}

		}

		return transferList;

	}

	/**
	 * Returns a new edge iterator.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @return {EdgeIterator} An iterator.
	 */

	edges(cellPosition, cellSize) {

		return new EdgeIterator(this, cellPosition, cellSize);

	}

	/**
	 * Creates a new edge iterator that only returns edges along the X-axis.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @return {EdgeIterator} An iterator.
	 */

	edgesX(cellPosition, cellSize) {

		return new EdgeIterator(this, cellPosition, cellSize, 0, 1);

	}

	/**
	 * Creates a new edge iterator that only returns edges along the Y-axis.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @return {EdgeIterator} An iterator.
	 */

	edgesY(cellPosition, cellSize) {

		return new EdgeIterator(this, cellPosition, cellSize, 1, 2);

	}

	/**
	 * Creates a new edge iterator that only returns edges along the Z-axis.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @return {EdgeIterator} An iterator.
	 */

	edgesZ(cellPosition, cellSize) {

		return new EdgeIterator(this, cellPosition, cellSize, 2, 3);

	}

	/**
	 * Calculates the amount of edges for one axis based on a given resolution.
	 *
	 * @param {Number} n - The grid resolution.
	 * @return {Number} The amount of edges for a single dimension.
	 */

	static calculate1DEdgeCount(n) {

		return Math.pow((n + 1), 2) * n;

	}

}

/**
 * The isovalue.
 *
 * @type {Number}
 * @private
 */

let isovalue = 0.0;

/**
 * The material grid resolution.
 *
 * @type {Number}
 * @private
 */

let resolution = 0;

/**
 * The total amount of grid point indices.
 *
 * @type {Number}
 * @private
 */

let indexCount = 0;

/**
 * Hermite data.
 *
 * @implements {Serializable}
 * @implements {Deserializable}
 * @implements {TransferableContainer}
 */

class HermiteData {

	/**
	 * Constructs a new set of Hermite data.
	 *
	 * @param {Boolean} [initialize=true] - Whether the data should be initialised immediately.
	 */

	constructor(initialize = true) {

		/**
		 * Describes how many material indices are currently solid:
		 *
		 * - The chunk lies outside the volume if there are no solid grid points.
		 * - The chunk lies completely inside the volume if all points are solid.
		 *
		 * @type {Number}
		 */

		this.materials = 0;

		/**
		 * The grid points.
		 *
		 * @type {Uint8Array}
		 */

		this.materialIndices = initialize ? new Uint8Array(indexCount) : null;

		/**
		 * Run-length compression data.
		 *
		 * @type {Uint32Array}
		 */

		this.runLengths = null;

		/**
		 * The edge data.
		 *
		 * @type {EdgeData}
		 */

		this.edgeData = null;

	}

	/**
	 * Indicates whether this data container is empty.
	 *
	 * @type {Boolean}
	 */

	get empty() {

		return (this.materials === 0);

	}

	/**
	 * Indicates whether this data container is full.
	 *
	 * @type {Boolean}
	 */

	get full() {

		return (this.materials === indexCount);

	}

	/**
	 * Indicates whether this data is currently compressed.
	 *
	 * @type {Boolean}
	 */

	get compressed() {

		return (this.runLengths !== null);

	}

	/**
	 * Indicates whether this data is currently gone.
	 *
	 * @type {Boolean}
	 */

	get neutered() {

		return (!this.empty && this.materialIndices === null);

	}

	/**
	 * Adopts the given data.
	 *
	 * @param {HermiteData} data - The data to adopt.
	 * @return {HermiteData} This data.
	 */

	set(data) {

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
	 * @param {HermiteData} [target=this] - A target data set. The compressed data will be assigned to this set.
	 * @return {HermiteData} The target data set.
	 */

	compress(target = this) {

		let encoding;

		if(!this.compressed) {

			// Note: empty sets won't be compressed. They can be discarded.
			if(this.full) {

				// This deliberately destroys material variations to save space!
				encoding = new RunLengthEncoding(
					[this.materialIndices.length],
					[Material.SOLID]
				);

			} else {

				encoding = RunLengthEncoding.encode(this.materialIndices);

			}

			target.materialIndices = new Uint8Array(encoding.data);
			target.runLengths = new Uint32Array(encoding.runLengths);

		} else {

			target.materialIndices = this.materialIndices;
			target.runLengths = this.runLengths;

		}

		target.materials = this.materials;

		return target;

	}

	/**
	 * Decompresses this data.
	 *
	 * @param {HermiteData} [target=this] - A target data set. If none is provided, the compressed data will be replaced with the decompressed data.
	 * @return {HermiteData} The target data set.
	 */

	decompress(target = this) {

		target.materialIndices = !this.compressed ?
			this.materialIndices : RunLengthEncoding.decode(
				this.runLengths, this.materialIndices, new Uint8Array(indexCount)
			);

		target.runLengths = null;
		target.materials = this.materials;

		return target;

	}

	/**
	 * Serialises this data.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		return {
			materials: this.materials,
			materialIndices: this.materialIndices,
			runLengths: this.runLengths,
			edgeData: (this.edgeData !== null) ? this.edgeData.serialize() : null
		};

	}

	/**
	 * Adopts the given serialised data.
	 *
	 * @param {Object} object - Serialised Hermite data. Can be null.
	 * @return {Deserializable} This object or null if the given serialised data was null.
	 */

	deserialize(object) {

		let result = this;

		if(object !== null) {

			this.materials = object.materials;
			this.materialIndices = object.materialIndices;
			this.runLengths = object.runLengths;

			if(object.edgeData !== null) {

				if(this.edgeData === null) {

					// Create an empty edge data container.
					this.edgeData = new EdgeData(resolution);

				}

				this.edgeData.deserialize(object.edgeData);

			} else {

				this.edgeData = null;

			}

		} else {

			result = null;

		}

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		if(this.edgeData !== null) {

			this.edgeData.createTransferList(transferList);

		}

		if(this.materialIndices !== null) {

			transferList.push(this.materialIndices.buffer);

		}

		if(this.runLengths !== null) {

			transferList.push(this.runLengths.buffer);

		}

		return transferList;

	}

	/**
	 * The global isovalue.
	 *
	 * A constant distance value that denotes the boundaries of SDFs.
	 *
	 * @type {Number}
	 */

	static get isovalue() {

		return isovalue;

	}

	/**
	 * Warning: changing the isovalue is not recommended.
	 *
	 * @type {Number}
	 */

	static set isovalue(value) {

		isovalue = value;

	}

	/**
	 * The material grid resolution.
	 *
	 * The effective resolution of a chunk of Hermite data is the distance between
	 * two adjacent grid points with respect to the size of the containing world
	 * octant.
	 *
	 * @type {Number}
	 */

	static get resolution() {

		return resolution;

	}

	/**
	 * Warning: this value should only be set once.
	 *
	 * The upper limit is 256.
	 *
	 * @type {Number}
	 */

	static set resolution(value) {

		// Round up to the next power of two.
		value = Math.pow(2, Math.max(0, Math.ceil(Math.log2(value))));

		resolution = Math.max(1, Math.min(256, value));
		indexCount = Math.pow((resolution + 1), 3);

	}

}

/**
 * An operation that describes a density field.
 */

class DensityFunction extends Operation {

	/**
	 * Constructs a new density function operation.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	constructor(sdf) {

		super(OperationType.DENSITY_FUNCTION);

		/**
		 * An SDF.
		 *
		 * @type {SignedDistanceFunction}
		 * @private
		 */

		this.sdf = sdf;

	}

	/**
	 * Calculates the bounding box of this density function.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		return this.sdf.getBoundingBox(true);

	}

	/**
	 * Calculates the material index for the given world position.
	 *
	 * @param {Vector3} position - The world position of the material index.
	 * @return {Number} The material index.
	 */

	generateMaterialIndex(position) {

		return (this.sdf.sample(position) <= HermiteData.isovalue) ? this.sdf.material : Material.AIR;

	}

	/**
	 * Generates surface intersection data for the specified edge.
	 *
	 * @param {Edge} edge - The edge that should be processed.
	 */

	generateEdge(edge) {

		edge.approximateZeroCrossing(this.sdf);
		edge.computeSurfaceNormal(this.sdf);

	}

}

/**
 * A matrix.
 *
 * @type {Matrix4}
 * @private
 */

const m = new Matrix4();

/**
 * An abstract Signed Distance Function.
 *
 * An SDF describes the signed Euclidean distance to the surface of an object,
 * effectively describing its density at every point in 3D space. It yields
 * negative values for points that lie inside the volume and positive values
 * for points outside. The value is zero at the exact boundary of the object.
 *
 * @implements {Serializable}
 * @implements {TransferableContainer}
 */

class SignedDistanceFunction {

	/**
	 * Constructs a new base SDF.
	 *
	 * @param {SDFType} type - The type of the SDF.
	 * @param {Number} [material=Material.SOLID] - A material index. Must be an integer in the range of 1 to 255.
	 */

	constructor(type, material = Material.SOLID) {

		/**
		 * The type of this SDF.
		 *
		 * @type {SDFType}
		 */

		this.type = type;

		/**
		 * The operation type.
		 *
		 * @type {OperationType}
		 */

		this.operation = null;

		/**
		 * A material index.
		 *
		 * @type {Number}
		 */

		this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

		/**
		 * The axis-aligned bounding box of this SDF.
		 *
		 * @type {Box3}
		 * @protected
		 */

		this.boundingBox = null;

		/**
		 * The positional translation.
		 *
		 * Call {@link updateInverseTransformation} after changing this field.
		 *
		 * @type {Vector3}
		 */

		this.position = new Vector3();

		/**
		 * The rotation.
		 *
		 * Call {@link updateInverseTransformation} after changing this field.
		 *
		 * @type {Quaternion}
		 */

		this.quaternion = new Quaternion();

		/**
		 * The scale.
		 *
		 * Call {@link updateInverseTransformation} after changing this field.
		 *
		 * @type {Vector3}
		 */

		this.scale = new Vector3(1, 1, 1);

		/**
		 * The inverted transformation matrix.
		 *
		 * @type {Matrix4}
		 */

		this.inverseTransformation = new Matrix4();

		this.updateInverseTransformation();

		/**
		 * A list of SDFs.
		 *
		 * SDFs can be chained to build CSG expressions.
		 *
		 * @type {SignedDistanceFunction[]}
		 * @private
		 */

		this.children = [];

	}

	/**
	 * Composes a transformation matrix using the translation, rotation and scale
	 * of this SDF.
	 *
	 * The transformation matrix is not needed for most SDF calculations and is
	 * therefore not stored explicitly to save space.
	 *
	 * @param {Matrix4} [target] - A target matrix. If none is provided, a new one will be created.
	 * @return {Matrix4} The transformation matrix.
	 */

	getTransformation(target = new Matrix4()) {

		return target.compose(this.position, this.quaternion, this.scale);

	}

	/**
	 * Calculates the AABB of this SDF if it doesn't exist yet and returns it.
	 *
	 * @param {Boolean} [recursive=false] - Whether the child SDFs should be taken into account.
	 * @return {Box3} The bounding box.
	 */

	getBoundingBox(recursive = false) {

		const children = this.children;

		let boundingBox = this.boundingBox;
		let i, l;

		if(boundingBox === null) {

			boundingBox = this.computeBoundingBox();
			this.boundingBox = boundingBox;

		}

		if(recursive) {

			boundingBox = boundingBox.clone();

			for(i = 0, l = children.length; i < l; ++i) {

				boundingBox.union(children[i].getBoundingBox(recursive));

			}

		}

		return boundingBox;

	}

	/**
	 * Sets the material.
	 *
	 * @param {Material} material - The material. Must be an integer in the range of 1 to 255.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	setMaterial(material) {

		this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

		return this;

	}

	/**
	 * Sets the CSG operation type of this SDF.
	 *
	 * @param {OperationType} operation - The CSG operation type.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	setOperationType(operation) {

		this.operation = operation;

		return this;

	}

	/**
	 * Updates the inverse transformation matrix.
	 *
	 * This method should be called after the position, quaternion or scale has
	 * changed. The bounding box will be updated automatically.
	 *
	 * @return {SignedDistanceFunction} This SDF.
	 */

	updateInverseTransformation() {

		this.inverseTransformation.getInverse(this.getTransformation(m));
		this.boundingBox = null;

		return this;

	}

	/**
	 * Adds the given SDF to this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	union(sdf) {

		this.children.push(sdf.setOperationType(OperationType.UNION));

		return this;

	}

	/**
	 * Subtracts the given SDF from this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	subtract(sdf) {

		this.children.push(sdf.setOperationType(OperationType.DIFFERENCE));

		return this;

	}

	/**
	 * Intersects the given SDF with this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	intersect(sdf) {

		this.children.push(sdf.setOperationType(OperationType.INTERSECTION));

		return this;

	}

	/**
	 * Translates this SDF into a CSG expression.
	 *
	 * @return {Operation} A CSG operation.
	 * @example a.union(b.intersect(c)).union(d).subtract(e) => Difference(Union(a, Intersection(b, c), d), e)
	 */

	toCSG() {

		const children = this.children;

		let operation = new DensityFunction(this);
		let operationType;
		let child;
		let i, l;

		for(i = 0, l = children.length; i < l; ++i) {

			child = children[i];

			if(operationType !== child.operation) {

				operationType = child.operation;

				switch(operationType) {

					case OperationType.UNION:
						operation = new Union(operation);
						break;

					case OperationType.DIFFERENCE:
						operation = new Difference(operation);
						break;

					case OperationType.INTERSECTION:
						operation = new Intersection(operation);
						break;

				}

			}

			operation.children.push(child.toCSG());

		}

		return operation;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		const result = {
			type: this.type,
			operation: this.operation,
			material: this.material,
			position: this.position.toArray(),
			quaternion: this.quaternion.toArray(),
			scale: this.scale.toArray(),
			parameters: null,
			children: []
		};

		let i, l;

		for(i = 0, l = this.children.length; i < l; ++i) {

			result.children.push(this.children[i].serialize(deflate));

		}

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		return transferList;

	}

	/**
	 * Returns a plain object that describes this SDF.
	 *
	 * @return {Object} A simple description of this SDF.
	 */

	toJSON() {

		return this.serialize(true);

	}

	/**
	 * Calculates the bounding box of this SDF.
	 *
	 * @protected
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		throw new Error("SignedDistanceFunction#computeBoundingBox method not implemented!");

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @param {Vector3} position - A position.
	 * @return {Number} The Euclidean distance to the surface.
	 */

	sample(position) {

		throw new Error("SignedDistanceFunction#sample method not implemented!");

	}

}

/**
 * An enumeration of SDF types.
 *
 * @type {Object}
 * @property {String} HEIGHTFIELD - A heightfield description.
 * @property {String} FRACTAL_NOISE - A fractal noise description.
 * @property {String} SUPER_PRIMITIVE - A super primitive description.
 */

const SDFType = {

	HEIGHTFIELD: "sdf.heightfield",
	FRACTAL_NOISE: "sdf.fractalnoise",
	SUPER_PRIMITIVE: "sdf.superprimitive"

};

/**
 * Fractal noise based on Perlin's technique.
 *
 * Reference:
 *  https://gpfault.net/posts/perlin-noise.txt.html
 */

class FractalNoise extends SignedDistanceFunction {

	/**
	 * Constructs a new perlin noise density field.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Number} [material] - A material index.
	 */

	constructor(parameters = {}, material) {

		super(SDFType.PERLIN_NOISE, material);

		/**
		 * The upper bounds of this density field.
		 *
		 * @type {Vector3}
		 */

		this.min = new Vector3(...parameters.min);

		/**
		 * The upper bounds of this density field.
		 *
		 * @type {Vector3}
		 */

		this.max = new Vector3(...parameters.max);

	}

	/**
	 * Calculates the bounding box of this density field.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		this.bbox = new Box3(this.min, this.max);

		return this.bbox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

	}

	/**
	 * Serialises this SDF.
	 *
	 * @param {Boolean} [toJSON=false] - Whether the serialised data will be stringified.
	 * @return {Object} A serialised description of this SDF.
	 */

	serialize(toJSON = false) {

		const result = super.serialize();

		result.parameters = {
			min: this.min.toArray(),
			max: this.max.toArray()
		};

		return result;

	}

}

/**
 * Reads the image data of the given image.
 *
 * @private
 * @param {Image} image - The image.
 * @return {ImageData} The image data.
 */

function readImageData(image) {

	const canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
	const context = canvas.getContext("2d");

	canvas.width = image.width;
	canvas.height = image.height;
	context.drawImage(image, 0, 0);

	return context.getImageData(0, 0, image.width, image.height);

}

/**
 * A Signed Distance Function that describes a heightfield.
 */

class Heightfield extends SignedDistanceFunction {

	/**
	 * Constructs a new heightfield SDF.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} [parameters.width=1] - The width of the heightfield.
	 * @param {Array} [parameters.height=1] - The height of the heightfield.
	 * @param {Boolean} [parameters.smooth=true] - Whether the height data should be smoothed.
	 * @param {Uint8ClampedArray} [parameters.data=null] - The heightmap image data.
	 * @param {Image} [parameters.image] - The heightmap image.
	 * @param {Number} [material] - A material index.
	 */

	constructor(parameters = {}, material) {

		super(SDFType.HEIGHTFIELD, material);

		/**
		 * The width.
		 *
		 * @type {Number}
		 * @private
		 */

		this.width = (parameters.width !== undefined) ? parameters.width : 1;

		/**
		 * The height.
		 *
		 * @type {Number}
		 * @private
		 */

		this.height = (parameters.height !== undefined) ? parameters.height : 1;

		/**
		 * Indicates whether the height data should be smoothed.
		 *
		 * @type {Boolean}
		 * @private
		 */

		this.smooth = (parameters.smooth !== undefined) ? parameters.smooth : true;

		/**
		 * The height data.
		 *
		 * @type {Uint8ClampedArray}
		 * @private
		 */

		this.data = (parameters.data !== undefined) ? parameters.data : null;

		/**
		 * The heightmap.
		 *
		 * @type {Image}
		 * @private
		 */

		this.heightmap = null;

		if(parameters.image !== undefined) {

			this.fromImage(parameters.image);

		}

	}

	/**
	 * Reads the image data of a given heightmap and converts it into a greyscale
	 * data array.
	 *
	 * @param {Image} image - The heightmap image.
	 * @return {Heightfield} This heightfield.
	 */

	fromImage(image) {

		const imageData = (typeof document === "undefined") ? null : readImageData(image);

		let result = null;
		let data;

		let i, j, l;

		if(imageData !== null) {

			data = imageData.data;

			// Reduce image data to greyscale format.
			result = new Uint8ClampedArray(data.length / 4);

			for(i = 0, j = 0, l = result.length; i < l; ++i, j += 4) {

				result[i] = data[j];

			}

			this.heightmap = image;
			this.width = imageData.width;
			this.height = imageData.height;
			this.data = result;

		}

		return this;

	}

	/**
	 * Retrives the height value for the given coordinates.
	 *
	 * @param {Number} x - The x coordinate.
	 * @param {Number} z - The z coordinate.
	 * @return {Number} The height.
	 */

	getHeight(x, z) {

		const w = this.width, h = this.height;
		const data = this.data;

		let height;

		x = Math.round(x * w);
		z = Math.round(z * h);

		if(this.smooth) {

			x = Math.max(Math.min(x, w - 1), 1);
			z = Math.max(Math.min(z, h - 1), 1);

			const p = x + 1, q = x - 1;
			const a = z * w, b = a + w, c = a - w;

			height = (

				data[c + q] + data[c + x] + data[c + p] +
				data[a + q] + data[a + x] + data[a + p] +
				data[b + q] + data[b + x] + data[b + p]

			) / 9;

		} else {

			height = data[z * w + x];

		}

		return height;

	}

	/**
	 * Calculates the bounding box of this SDF.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		const boundingBox = new Box3();

		const w = Math.min(this.width / this.height, 1.0);
		const h = Math.min(this.height / this.width, 1.0);

		boundingBox.min.set(0, 0, 0);
		boundingBox.max.set(w, 1, h);
		boundingBox.applyMatrix4(this.getTransformation());

		return boundingBox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

		const boundingBox = this.boundingBox;

		let d;

		if(boundingBox.containsPoint(position)) {

			position.applyMatrix4(this.inverseTransformation);

			d = position.y - this.getHeight(position.x, position.z) / 255;

		} else {

			d = boundingBox.distanceToPoint(position);

		}

		return d;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		const result = super.serialize();

		result.parameters = {
			width: this.width,
			height: this.height,
			smooth: this.smooth,
			data: deflate ? null : this.data,
			dataURL: (deflate && this.heightmap !== null) ? this.heightmap.toDataURL() : null,
			image: null
		};

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		transferList.push(this.data.buffer);

		return transferList;

	}

}

/**
 * The super primitive.
 *
 * A function that is able to represent a wide range of conic/rectangular-radial
 * primitives of genus 0 and 1: (round) box, sphere, cylinder, capped cone,
 * torus, capsule, pellet, pipe, etc.
 *
 * Reference:
 *  https://www.shadertoy.com/view/MsVGWG
 */

class SuperPrimitive extends SignedDistanceFunction {

	/**
	 * Constructs a new super primitive.
	 *
	 * See {@link SuperPrimitivePreset} for a list of default configurations.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.s - The size and genus weight [x, y, z, w].
	 * @param {Array} parameters.r - The corner radii [x, y, z].
	 * @param {Number} [material] - A material index.
	 * @example const cube = SuperPrimitive.create(SuperPrimitivePreset.CUBE);
	 */

	constructor(parameters = {}, material) {

		super(SDFType.SUPER_PRIMITIVE, material);

		/**
		 * The base size. The W-component affects the genus of the primitive.
		 *
		 * @type {Vector4}
		 * @private
		 */

		this.s0 = new Vector4(...parameters.s);

		/**
		 * The base corner radii.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.r0 = new Vector3(...parameters.r);

		/**
		 * The size, adjusted for further calculations.
		 *
		 * @type {Vector4}
		 * @private
		 */

		this.s = new Vector4();

		/**
		 * The corner radii, adjusted for further calculations.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.r = new Vector3();

		/**
		 * Precomputed corner rounding constants.
		 *
		 * @type {Vector2}
		 * @private
		 */

		this.ba = new Vector2();

		/**
		 * The bottom radius offset.
		 *
		 * @type {Number}
		 * @private
		 */

		this.offset = 0;

		// Calculate constants ahead of time.
		this.precompute();

	}

	/**
	 * Sets the size and genus weight.
	 *
	 * @param {Number} x - X.
	 * @param {Number} y - Y.
	 * @param {Number} z - Z.
	 * @param {Number} w - W.
	 * @return {SuperPrimitive} This instance.
	 */

	setSize(x, y, z, w) {

		this.s0.set(x, y, z, w);

		return this.precompute();

	}

	/**
	 * Sets the corner radii.
	 *
	 * @param {Number} x - X.
	 * @param {Number} y - Y.
	 * @param {Number} z - Z.
	 * @return {SuperPrimitive} This instance.
	 */

	setRadii(x, y, z) {

		this.r0.set(x, y, z);

		return this.precompute();

	}

	/**
	 * Precomputes corner rounding factors.
	 *
	 * @private
	 * @return {SuperPrimitive} This instance.
	 */

	precompute() {

		const s = this.s.copy(this.s0);
		const r = this.r.copy(this.r0);
		const ba = this.ba;

		s.x -= r.x;
		s.y -= r.x;

		r.x -= s.w;
		s.w -= r.y;

		s.z -= r.y;

		this.offset = -2.0 * s.z;

		ba.set(r.z, this.offset);
		const divisor = ba.dot(ba);

		if(divisor === 0.0) {

			// Y must not be 0 to prevent bad values for Z = 0 in the last term (*).
			ba.set(0.0, -1.0);

		} else {

			ba.divideScalar(divisor);

		}

		return this;

	}

	/**
	 * Calculates the bounding box of this SDF.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		const s = this.s0;
		const boundingBox = new Box3();

		boundingBox.min.x = Math.min(-s.x, -1.0);
		boundingBox.min.y = Math.min(-s.y, -1.0);
		boundingBox.min.z = Math.min(-s.z, -1.0);

		boundingBox.max.x = Math.max(s.x, 1.0);
		boundingBox.max.y = Math.max(s.y, 1.0);
		boundingBox.max.z = Math.max(s.z, 1.0);

		boundingBox.applyMatrix4(this.getTransformation());

		return boundingBox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

		position.applyMatrix4(this.inverseTransformation);

		const s = this.s;
		const r = this.r;
		const ba = this.ba;

		const dx = Math.abs(position.x) - s.x;
		const dy = Math.abs(position.y) - s.y;
		const dz = Math.abs(position.z) - s.z;

		const mx0 = Math.max(dx, 0.0);
		const my0 = Math.max(dy, 0.0);
		const l0 = Math.sqrt(mx0 * mx0 + my0 * my0);

		const p = position.z - s.z;
		const q = Math.abs(l0 + Math.min(0.0, Math.max(dx, dy)) - r.x) - s.w;

		const c = Math.min(Math.max(q * ba.x + p * ba.y, 0.0), 1.0);
		const diagX = q - r.z * c;
		const diagY = p - this.offset * c;

		const hx0 = Math.max(q - r.z, 0.0);
		const hy0 = position.z + s.z;
		const hx1 = Math.max(q, 0.0);
		// hy1 = p;

		const diagSq = diagX * diagX + diagY * diagY;
		const h0Sq = hx0 * hx0 + hy0 * hy0;
		const h1Sq = hx1 * hx1 + p * p;
		const paBa = q * -ba.y + p * ba.x;

		const l1 = Math.sqrt(Math.min(diagSq, Math.min(h0Sq, h1Sq)));

		// (*) paBa must not be 0: if dz is also 0, the result will be wrong.
		return l1 * Math.sign(Math.max(paBa, dz)) - r.y;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		const result = super.serialize();

		result.parameters = {
			s: this.s0.toArray(),
			r: this.r0.toArray()
		};

		return result;

	}

	/**
	 * Creates a new primitive using the specified preset.
	 *
	 * @param {SuperPrimitivePreset} preset - The super primitive preset.
	 */

	static create(preset) {

		const parameters = superPrimitivePresets[preset];

		return new SuperPrimitive({
			s: parameters[0],
			r: parameters[1]
		});

	}

}

/**
 * A list of parameter presets.
 *
 * @type {Array<Float32Array[]>}
 * @private
 */

const superPrimitivePresets = [

	// Cube.
	[
		new Float32Array([1.0, 1.0, 1.0, 1.0]),
		new Float32Array([0.0, 0.0, 0.0])
	],

	// Cylinder.
	[
		new Float32Array([1.0, 1.0, 1.0, 1.0]),
		new Float32Array([1.0, 0.0, 0.0])
	],

	// Cone.
	[
		new Float32Array([0.0, 0.0, 1.0, 1.0]),
		new Float32Array([0.0, 0.0, 1.0])
	],

	// Pill.
	[
		new Float32Array([1.0, 1.0, 2.0, 1.0]),
		new Float32Array([1.0, 1.0, 0.0])
	],

	// Sphere.
	[
		new Float32Array([1.0, 1.0, 1.0, 1.0]),
		new Float32Array([1.0, 1.0, 0.0])
	],

	// Pellet.
	[
		new Float32Array([1.0, 1.0, 0.25, 1.0]),
		new Float32Array([1.0, 0.25, 0.0])
	],

	// Torus.
	[
		new Float32Array([1.0, 1.0, 0.25, 0.25]),
		new Float32Array([1.0, 0.25, 0.0])
	],

	// Pipe.
	[
		new Float32Array([1.0, 1.0, 1.0, 0.25]),
		new Float32Array([1.0, 0.1, 0.0])
	],

	// Corridor.
	[
		new Float32Array([1.0, 1.0, 1.0, 0.25]),
		new Float32Array([0.1, 0.1, 0.0])
	]

];

/**
 * An enumeration of super primitive presets.
 *
 * @type {Object}
 * @property {Number} CUBE - A cube.
 * @property {Number} CYLINDER - A cylinder.
 * @property {Number} CONE - A cone.
 * @property {Number} PILL - A pill.
 * @property {Number} SPHERE - A sphere.
 * @property {Number} PELLET - A pellet.
 * @property {Number} TORUS - A torus.
 * @property {Number} PIPE - A pipe.
 * @property {Number} CORRIDOR - A corridor.
 */

const SuperPrimitivePreset = {

	CUBE: 0,
	CYLINDER: 1,
	CONE: 2,
	PILL: 3,
	SPHERE: 4,
	PELLET: 5,
	TORUS: 6,
	PIPE: 7,
	CORRIDOR: 8

};

/**
 * An SDF reviver.
 */

class SDFReviver {

	/**
	 * Creates an SDF from the given serialised description.
	 *
	 * @param {Object} description - A serialised SDF.
	 * @return {SignedDistanceFunction} A deserialized SDF.
	 */

	revive(description) {

		let sdf, i, l;

		switch(description.type) {

			case SDFType.FRACTAL_NOISE:
				sdf = new FractalNoise(description.parameters, description.material);
				break;

			case SDFType.HEIGHTFIELD:
				sdf = new Heightfield(description.parameters, description.material);
				break;

			case SDFType.SUPER_PRIMITIVE:
				sdf = new SuperPrimitive(description.parameters, description.material);
				break;

		}

		sdf.operation = description.operation;
		sdf.position.fromArray(description.position);
		sdf.quaternion.fromArray(description.quaternion);
		sdf.scale.fromArray(description.scale);
		sdf.updateInverseTransformation();

		for(i = 0, l = description.children.length; i < l; ++i) {

			sdf.children.push(this.revive(description.children[i]));

		}

		return sdf;

	}

}

/**
 * An SDF loader event.
 */

class SDFLoaderEvent extends Event {

	/**
	 * Constructs a new SDF loader event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * A list of serialised SDFs.
		 *
		 * @type {Array}
		 */

		this.descriptions = null;

	}

}

/**
 * A load event.
 *
 * This event is dispatched by {@link SDFLoader}.
 *
 * @type {SDFLoaderEvent}
 * @example sdfLoader.addEventListener("load", myListener);
 */

const load = new SDFLoaderEvent("load");

/**
 * An SDF loader.
 *
 * @implements {EventListener}
 */

class SDFLoader extends EventTarget {

	constructor() {

		super();

		/**
		 * Indicates how many items still need to be loaded.
		 *
		 * @type {Number}
		 * @private
		 */

		this.items = 0;

		/**
		 * A list of serialised SDFs.
		 *
		 * @type {Array}
		 * @private
		 */

		this.descriptions = null;

		/**
		 * A collection that maps images to their respective serialised SDFs.
		 *
		 * @type {WeakMap}
		 * @private
		 */

		this.imageMap = new WeakMap();

	}

	/**
	 * Clears this loader.
	 */

	clear() {

		this.imageMap = new WeakMap();

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "load":
				this.progress(event);
				break;

		}

	}

	/**
	 * Finishes a loading task.
	 *
	 * @param {Event} [event=null] - An event.
	 */

	progress(event = null) {

		const item = (event !== null) ? event.target : null;
		const imageMap = this.imageMap;

		let description;

		if(item !== null) {

			if(imageMap.has(item)) {

				description = imageMap.get(item);
				description.image = item;

			}

			--this.items;

		}

		if(this.items === 0) {

			this.clear();
			load.descriptions = this.descriptions;
			this.dispatchEvent(load);

		}

	}

	/**
	 * Loads an image data url for a given serialised SDF.
	 *
	 * @param {Object} description - A serialised SDF that contains an image data url.
	 */

	loadImage(description) {

		const image = new Image();

		this.imageMap.set(image, description);
		++this.items;

		image.addEventListener("load", this);
		image.src = description.dataURL;

	}

	/**
	 * Inflates the given serialised SDF.
	 *
	 * @private
	 * @param {Object} description - A serialised SDF.
	 */

	inflate(description) {

		let child;

		if(description.dataURL !== null) {

			// The description contains compressed image data.
			this.loadImage(description);

		}

		for(child of description.children) {

			this.inflate(child);

		}

		this.progress();

	}

	/**
	 * Loads the given serialised SDFs but doesn't fully revive them.
	 *
	 * This loader will emit a `load` event when all SDFs have been inflated. The
	 * descriptions can then safely be revived using the {@link SDFReviver}.
	 *
	 * @param {Array} descriptions - A list of serialised SDF. The individual descriptions will be inflated.
	 */

	load(descriptions) {

		let description;

		this.items = 0;
		this.descriptions = descriptions;

		for(description of descriptions) {

			this.inflate(description);

		}

	}

}

/**
 * A collection of binary number utilities.
 */

class BinaryUtils {

	/**
	 * Interpretes the given string as a binary number.
	 *
	 * @param {String} s - A string that represents a binary number.
	 * @return {Number} The parsed number.
	 */

	static parseBin(s) {

		return parseInt(s, 2);

	}

	/**
	 * Creates a binary string representation of the given number.
	 *
	 * @param {Number} n - A number.
	 * @param {Number} [minBits=64] - The minimum length of the string.
	 * @return {String} The binary representation.
	 */

	static createBinaryString(n, minBits = 64) {

		const sign = (n < 0) ? "-" : "";

		let result = Math.abs(n).toString(2);

		while(result.length < minBits) {

			result = "0" + result;

		}

		return sign + result;

	}

}

/**
 * A key range iterator.
 *
 * @implements {Iterator}
 * @implements {Iterable}
 */

class KeyIterator {

	/**
	 * Constructs a new key iterator.
	 *
	 * This iterator returns all keys in the specified coordinate range, including
	 * those at min and max.
	 *
	 * @param {KeyDesign} keyDesign - A key design.
	 * @param {Vector3} min - The lower index bounds (zero-based unsigned integer coordinates).
	 * @param {Vector3} max - The upper index bounds (zero-based unsigned integer coordinates).
	 */

	constructor(keyDesign, min, max) {

		/**
		 * The key design.
		 *
		 * @type {KeyDesign}
		 * @private
		 */

		this.keyDesign = keyDesign;

		/**
		 * The lower index bounds.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.min = min;

		/**
		 * The upper index bounds.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.max = max;

		/**
		 * The base key coordinates.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.keyBase = new Vector3();

		/**
		 * The current key iteration coordinates.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.key = new Vector3();

		/**
		 * The iteration limits.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.limit = new Vector3();

		/**
		 * An iterator result.
		 *
		 * @type {IteratorResult}
		 * @private
		 */

		this.result = new IteratorResult();

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return {KeyIterator} This iterator.
	 */

	reset() {

		const keyDesign = this.keyDesign;
		const min = this.min;
		const max = this.max;

		if(min.x <= max.x && min.y <= max.y && min.z <= max.z) {

			this.keyBase.set(min.x, min.y * keyDesign.rangeX, min.z * keyDesign.rangeXY);
			this.limit.set(max.x, max.y * keyDesign.rangeX, max.z * keyDesign.rangeXY);
			this.key.copy(this.keyBase);

		} else {

			// The range is invalid. Return no keys.
			this.keyBase.set(1, 1, 1);
			this.limit.set(0, 0, 0);
			this.key.copy(this.keyBase);

			console.error("Invalid key range", min, max);

		}

		this.result.reset();

		return this;

	}

	/**
	 * Iterates over the key range.
	 *
	 * @return {IteratorResult} The next key.
	 */

	next() {

		const result = this.result;
		const keyDesign = this.keyDesign;
		const keyBase = this.keyBase;
		const limit = this.limit;
		const key = this.key;

		if(key.z <= limit.z) {

			// Put the key pieces together.
			result.value = key.z + key.y + key.x;

			// Advance the key coordinates.
			++key.x;

			if(key.x > limit.x) {

				key.x = keyBase.x;
				key.y += keyDesign.rangeX;

				if(key.y > limit.y) {

					key.y = keyBase.y;
					key.z += keyDesign.rangeXY;

				}

			}

		} else {

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
	 * @return {KeyIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}

/**
 * The amount of bits of a DWord.
 *
 * @type {Number}
 * @private
 */

const DWORD_BITS = 32;

/**
 * The amount of different values that can be represented with a DWord.
 *
 * @type {Number}
 * @private
 */

const RANGE_DWORD = Math.pow(2, DWORD_BITS);

/**
 * The total amount of available bits for safe integers.
 *
 * @type {Number}
 * @private
 */

const BITS = 53;

/**
 * The amount of available high bits.
 *
 * In JavaScript, bit operations can only be applied to DWords (32-bit).
 * All 53-bit keys must be split into a high and a low part for processing.
 *
 * @type {Number}
 * @private
 */

const HI_BITS = 21;

/**
 * The amount of available low bits.
 *
 * In JavaScript, bit operations can only be applied to DWords (32-bit).
 * All 53-bit keys must be split into a high and a low part for processing.
 *
 * @type {Number}
 * @private
 */

const LO_BITS = 32;

/**
 * A design for octant keys.
 *
 * 3D coordinates are packed into a single integer to obtain a unique key. This
 * class describes the bit allotment for each coordinate and provides methods
 * for key packing and unpacking.
 *
 * See {@link KeyDesign.BITS} for the total amount of available bits.
 */

class KeyDesign {

	/**
	 * Constructs a new key design.
	 *
	 * @param {Number} [x=Math.round(BITS * 0.4)] - The amount of bits used for the X-coordinate.
	 * @param {Number} [y=Math.round(BITS * 0.2)] - The amount of bits used for the Y-coordinate.
	 * @param {Number} [z=x] - The amount of bits used for the Z-coordinate.
	 */

	constructor(x = Math.round(BITS * 0.4), y = Math.round(BITS * 0.2), z = x) {

		/**
		 * The amount of bits reserved for the X-coordinate.
		 *
		 * @type {Number}
		 */

		this.x = 0;

		/**
		 * The amount of bits reserved for the Y-coordinate.
		 *
		 * @type {Number}
		 */

		this.y = 0;

		/**
		 * The amount of bits reserved for the Z-coordinate.
		 *
		 * @type {Number}
		 */

		this.z = 0;

		/**
		 * The amount of distinct integers that can be represented with X bits.
		 *
		 * @type {Number}
		 */

		this.rangeX = 0;

		/**
		 * The amount of distinct integers that can be represented with Y bits.
		 *
		 * @type {Number}
		 */

		this.rangeY = 0;

		/**
		 * The amount of distinct integers that can be represented with Z bits.
		 *
		 * @type {Number}
		 */

		this.rangeZ = 0;

		/**
		 * The amount of distinct integers that can be represented with X + Y bits.
		 *
		 * @type {Number}
		 */

		this.rangeXY = 0;

		/**
		 * The key range divided by two.
		 *
		 * @type {Vector3}
		 */

		this.halfRange = null;

		/**
		 * A bit mask for the X-coordinate. The first item holds the low bits while
		 * the second item holds the high bits.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maskX = [0, 0];

		/**
		 * A bit mask for the Y-coordinate. The first item holds the low bits while
		 * the second item holds the high bits.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maskY = [0, 0];

		/**
		 * A bit mask for the Z-coordinate. The first item holds the low bits while
		 * the second item holds the high bits.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maskZ = [0, 0];

		this.set(x, y, z);

	}

	/**
	 * Sets the bit distribution.
	 *
	 * Make sure to clear your octree after changing the key design!
	 *
	 * @param {Number} [x] - The amount of bits used for the X-coordinate.
	 * @param {Number} [y] - The amount of bits used for the Y-coordinate.
	 * @param {Number} [z] - The amount of bits used for the Z-coordinate.
	 */

	set(x, y, z) {

		// Bit operations currently only work on DWords.
		if(x + y + z > BITS || x > DWORD_BITS || y > DWORD_BITS || z > DWORD_BITS) {

			console.warn("Invalid bit allotment");

			x = Math.round(BITS * 0.4);
			y = Math.round(BITS * 0.2);
			z = x;

		}

		this.x = x;
		this.y = y;
		this.z = z;

		this.rangeX = Math.pow(2, x);
		this.rangeY = Math.pow(2, y);
		this.rangeZ = Math.pow(2, z);

		this.rangeXY = Math.pow(2, x + y);

		this.halfRange = new Vector3(
			this.rangeX / 2,
			this.rangeY / 2,
			this.rangeZ / 2
		);

		this.updateBitMasks();

	}

	/**
	 * Creates bit masks for the extraction of coordinates from keys.
	 *
	 * @private
	 */

	updateBitMasks() {

		const xBits = this.x;
		const yBits = this.y;
		const zBits = this.z;

		const maskX = this.maskX;
		const maskY = this.maskY;
		const maskZ = this.maskZ;

		const hiShiftX = DWORD_BITS - Math.max(0, xBits - LO_BITS);
		const hiShiftY = DWORD_BITS - Math.max(0, yBits + xBits - LO_BITS);
		const hiShiftZ = DWORD_BITS - Math.max(0, zBits + yBits + xBits - LO_BITS);

		maskX[1] = (hiShiftX < DWORD_BITS) ? ~0 >>> hiShiftX : 0;
		maskX[0] = ~0 >>> Math.max(0, LO_BITS - xBits);

		maskY[1] = (((hiShiftY < DWORD_BITS) ? ~0 >>> hiShiftY : 0) & ~maskX[1]) >>> 0;
		maskY[0] = ((~0 >>> Math.max(0, LO_BITS - (xBits + yBits))) & ~maskX[0]) >>> 0;

		maskZ[1] = (((hiShiftZ < DWORD_BITS) ? ~0 >>> hiShiftZ : 0) & ~maskY[1] & ~maskX[1]) >>> 0;
		maskZ[0] = ((~0 >>> Math.max(0, LO_BITS - (xBits + yBits + zBits))) & ~maskY[0] & ~maskX[0]) >>> 0;

	}

	/**
	 * Extracts the 3D coordinates from a given key.
	 *
	 * @param {Number} key - The key.
	 * @param {Vector3} [target] - A target for the extracted coordinates. If none is provided, a new vector will be created.
	 * @return {Vector3} The extracted coordinates.
	 */

	unpackKey(key, target = new Vector3()) {

		const maskX = this.maskX;
		const maskY = this.maskY;
		const maskZ = this.maskZ;

		// Split the QWord key in a high and a low DWord.
		const hi = Math.trunc(key / RANGE_DWORD);
		const lo = key % RANGE_DWORD;

		return target.set(

			((hi & maskX[1]) * RANGE_DWORD) + ((lo & maskX[0]) >>> 0),
			(((hi & maskY[1]) * RANGE_DWORD) + ((lo & maskY[0]) >>> 0)) / this.rangeX,
			(((hi & maskZ[1]) * RANGE_DWORD) + ((lo & maskZ[0]) >>> 0)) / this.rangeXY

		);

	}

	/**
	 * Packs a 3D position into a unique key.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The octant key.
	 */

	packKey(position) {

		return position.z * this.rangeXY + position.y * this.rangeX + position.x;

	}

	/**
	 * Returns a new key range iterator.
	 *
	 * The key iterator will return all keys in the specified coordinate range,
	 * including those at min and max.
	 *
	 * @param {Vector3} min - The lower key index bounds (zero-based unsigned integer coordinates).
	 * @param {Vector3} max - The upper key index bounds (zero-based unsigned integer coordinates).
	 * @return {KeyIterator} An iterator.
	 */

	keyRange(min, max) {

		return new KeyIterator(this, min, max);

	}

	/**
	 * Converts the information of this key design into a string.
	 *
	 * @return {String} The key design as a string.
	 */

	toString() {

		const maskX = this.maskX;
		const maskY = this.maskY;
		const maskZ = this.maskZ;

		return (

			"Key Design\n\n" +

			"X-Bits: " + this.x + "\n" +
			"Y-Bits: " + this.y + "\n" +
			"Z-Bits: " + this.z + "\n\n" +

			BinaryUtils.createBinaryString(maskX[1], DWORD_BITS) + " " + maskX[1] + " (HI-Mask X)\n" +
			BinaryUtils.createBinaryString(maskX[0], DWORD_BITS) + " " + maskX[0] + " (LO-Mask X)\n\n" +

			BinaryUtils.createBinaryString(maskY[1], DWORD_BITS) + " " + maskY[1] + " (HI-Mask Y)\n" +
			BinaryUtils.createBinaryString(maskY[0], DWORD_BITS) + " " + maskY[0] + " (LO-Mask Y)\n\n" +

			BinaryUtils.createBinaryString(maskZ[1], DWORD_BITS) + " " + maskZ[1] + " (HI-Mask Z)\n" +
			BinaryUtils.createBinaryString(maskZ[0], DWORD_BITS) + " " + maskZ[0] + " (LO-Mask Z)\n"

		);

	}

	/**
	 * The total amount of available bits for safe integers.
	 *
	 * JavaScript uses IEEE 754 binary64 Doubles for Numbers and, as a result,
	 * only supports 53-bit integers as of ES2015.
	 *
	 * For more information see: http://2ality.com/2012/04/number-encoding.html
	 *
	 * @type {Number}
	 */

	static get BITS() {

		return BITS;

	}

	/**
	 * The amount of available bits in the high DWord.
	 *
	 * In JavaScript, bit operations can only be applied to DWords (32-bit).
	 * All 53-bit keys must be split into a high and a low part for processing.
	 *
	 * @type {Number}
	 */

	static get HI_BITS() {

		return HI_BITS;

	}

	/**
	 * The amount of available bits in the low DWord.
	 *
	 * In JavaScript, bit operations can only be applied to DWords (32-bit).
	 * All 53-bit keys must be split into a high and a low part for processing.
	 *
	 * @type {Number}
	 */

	static get LO_BITS() {

		return LO_BITS;

	}

}

/**
 * A world octant identifier.
 *
 * Each octant can be identified by a LOD index and a positional key.
 */

class WorldOctantId {

	/**
	 * Constructs a new world octant identifier.
	 *
	 * @param {Number} [lod=0] - The LOD index.
	 * @param {Number} [key=0] - The key.
	 */

	constructor(lod = 0, key = 0) {

		/**
		 * The LOD grid in which the world octant resides.
		 *
		 * @type {Number}
		 */

		this.lod = lod;

		/**
		 * The unique key of the world octant.
		 *
		 * @type {Number}
		 */

		this.key = key;

	}

	/**
	 * Sets the LOD index and key.
	 *
	 * @param {Number} lod - The LOD index.
	 * @param {Number} key - The key.
	 * @return {WorldOctantId} This octant identifier.
	 */

	set(lod, key) {

		this.lod = lod;
		this.key = key;

	}

	/**
	 * Copies the given octant identifier.
	 *
	 * @param {WorldOctantId} id - An octant identifier.
	 * @return {WorldOctantId} This octant identifier.
	 */

	copy(id) {

		this.lod = id.lod;
		this.key = id.key;

		return this;

	}

	/**
	 * Clones this octant identifier.
	 *
	 * @return {WorldOctantId} The cloned octant identifier.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}

/**
 * A world octant wrapper that stores positional information.
 */

class WorldOctantWrapper {

	/**
	 * Constructs a new octant wrapper.
	 *
	 * @param {WorldOctant} [octant=null] - An octant.
	 * @param {WorldOctantId} [id] - The identifier of the octant.
	 */

	constructor(octant = null, id = new WorldOctantId()) {

		/**
		 * A world octant.
		 *
		 * @type {WorldOctant}
		 */

		this.octant = octant;

		/**
		 * A world octant identifier.
		 *
		 * @type {WorldOctantId}
		 */

		this.id = id;

		/**
		 * The lower bounds.
		 *
		 * @type {Vector3}
		 */

		this.min = new Vector3();

		/**
		 * The upper bounds.
		 *
		 * @type {Vector3}
		 */

		this.max = new Vector3();

	}

	/**
	 * Copies the given octant wrapper.
	 *
	 * @param {WorldOctantWrapper} octantWrapper - An octant wrapper.
	 * @return {WorldOctantWrapper} This octant wrapper.
	 */

	copy(octantWrapper) {

		this.octant = octantWrapper.octant;
		this.id.copy(octantWrapper.id);
		this.min.copy(octantWrapper.min);
		this.max.copy(octantWrapper.max);

		return this;

	}

	/**
	 * Clones this octant wrapper.
	 *
	 * @return {WorldOctantWrapper} The cloned octant wrapper.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

	/**
	 * Computes the center of the wrapped octant.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the center of the octant.
	 */

	getCenter(target = new Vector3()) {

		return target.addVectors(this.min, this.max).multiplyScalar(0.5);

	}

	/**
	 * Computes the size of the wrapped octant.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the size of the octant.
	 */

	getDimensions(target = new Vector3()) {

		return target.subVectors(this.max, this.min);

	}

	/**
	 * Checks if the given point lies inside the boundaries of this wrapper.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Boolean} Whether the given point lies inside the boundaries.
	 */

	containsPoint(point) {

		const min = this.min;
		const max = this.max;

		return (
			point.x >= min.x &&
			point.y >= min.y &&
			point.z >= min.z &&
			point.x <= max.x &&
			point.y <= max.y &&
			point.z <= max.z
		);

	}

}

/**
 * A world octant iterator.
 *
 * @implements {Iterator}
 * @implements {Iterable}
 */

class WorldOctantIterator {

	/**
	 * Constructs a new octant iterator.
	 *
	 * @param {WorldOctree} world - An octree.
	 * @param {Number} [lod=0] - The LOD grid to consider.
	 */

	constructor(world, lod = 0) {

		/**
		 * The octree.
		 *
		 * @type {WorldOctree}
		 * @private
		 */

		this.world = world;

		/**
		 * The size of the cells in the specified LOD grid.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = 0;

		/**
		 * The internal octant iterator.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.iterator = null;

		/**
		 * A world octant wrapper.
		 *
		 * @type {WorldOctantWrapper}
		 * @private
		 */

		this.octantWrapper = new WorldOctantWrapper();
		this.octantWrapper.id.lod = lod;

		/**
		 * An iterator result.
		 *
		 * @type {IteratorResult}
		 * @private
		 */

		this.result = new IteratorResult();

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return {KeyIterator} This iterator.
	 */

	reset() {

		const lod = this.octantWrapper.id.lod;
		const world = this.world;
		const grid = world.getGrid(lod);

		if(grid !== undefined) {

			this.cellSize = world.getCellSize(lod);
			this.iterator = grid.entries();
			this.result.reset();

		} else {

			console.error("Invalid LOD", lod);

		}

		return this;

	}

	/**
	 * Iterates over the octants.
	 *
	 * @return {IteratorResult} The next key.
	 */

	next() {

		const result = this.result;
		const octantWrapper = this.octantWrapper;
		const internalResult = this.iterator.next();
		const value = internalResult.value;

		if(!internalResult.done) {

			this.keyDesign.unpackKey(value[0], octantWrapper.min);
			octantWrapper.min.multiplyScalar(this.cellSize).add(this.world.min);
			octantWrapper.max.copy(octantWrapper.min).addScalar(this.cellSize);
			octantWrapper.id.key = value[0];
			octantWrapper.octant = value[1];

			result.value = octantWrapper;

		} else {

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
	 * @return {WorldOctantIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}

/**
 * A world octant.
 *
 * This octant serves as a volume data container. Its position is implicitly
 * defined by its key while its size is defined by the LOD grid in which it
 * resides. Additionally, it can store a queue of pending CSG operations.
 */

class WorldOctant {

	/**
	 * Constructs a new world octant.
	 */

	constructor() {

		/**
		 * Hermite data.
		 *
		 * @type {HermiteData}
		 */

		this.data = null;

		/**
		 * A CSG operation queue.
		 *
		 * If this queue is not empty, the volume data has to be modified before it
		 * can be contoured.
		 *
		 * @type {Queue}
		 */

		this.csg = new Queue();

		/**
		 * A generated isosurface mesh.
		 *
		 * @type {Isosurface}
		 */

		this.isosurface = null;

	}

}

/**
 * A world octant that doesn't reside in LOD zero.
 *
 * This octant is a container for resampled volume data. Additionally, it stores
 * information about the existence of its potential children.
 */

class IntermediateWorldOctant extends WorldOctant {

	/**
	 * Constructs a new intermediate world octant.
	 */

	constructor() {

		super();

		/**
		 * An 8-bit mask that indicates the existence of the eight potential
		 * children.
		 *
		 * The order of the children follows the common octant layout from the
		 * external `sparse-octree` module:
		 *
		 * ```text
		 *    3____7
		 *  2/___6/|
		 *  | 1__|_5
		 *  0/___4/
		 * ```
		 *
		 * @type {Number}
		 */

		this.children = 0;

	}

}

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p$1 = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v$1 = new Vector3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b0 = new Box3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b1 = new Box3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b2 = new Box3();

/**
 * A list of key coordinate ranges used for octant culling during the recursive
 * octree traversal.
 *
 * @type {Box3[]}
 * @private
 */

const ranges = [];

/**
 * Recursively applies the given SDF to existing octants in the affected region.
 *
 * This is a depth-first approach.
 *
 * @private
 * @param {WorldOctree} world - The world octree.
 * @param {SignedDistanceFunction} sdf - An SDF with a primary Difference CSG type.
 * @param {WorldOctant} octant - The current octant.
 * @param {Number} keyX - The X-coordinate of the current octant's key.
 * @param {Number} keyY - The Y-coordinate of the current octant's key.
 * @param {Number} keyZ - The Z-coordinate of the current octant's key.
 * @param {Number} lod - The current LOD.
 */

function applyDifference(world, sdf, octant, keyX, keyY, keyZ, lod) {

	let grid, keyDesign, children;
	let range, offset, i;

	octant.csg.add(sdf);

	if(lod > 0) {

		// Look at the next lower LOD.
		--lod;

		grid = world.getGrid(lod);
		keyDesign = world.getKeyDesign();
		children = octant.children;
		range = ranges[lod];

		// Translate the key coordinates to the next lower LOD.
		keyX <<= 1; keyY <<= 1; keyZ <<= 1;

		for(i = 0; i < 8; ++i) {

			// Check if the child exists.
			if((children & (1 << i)) !== 0) {

				offset = layout[i];

				p$1.set(
					keyX + offset[0],
					keyY + offset[1],
					keyZ + offset[2]
				);

				// Check if the child is affected.
				if(range.containsPoint(p$1)) {

					// Apply the difference operation to the child.
					applyDifference(world, sdf, grid.get(keyDesign.packKey(p$1)), p$1.x, p$1.y, p$1.z, lod);

				}

			}

		}

	}

}

/**
 * A world octree CSG operation manager.
 */

class WorldOctreeCSG {

	/**
	 * Modifies all octants in the specified region with the given SDF.
	 *
	 * Octants that don't exist will be created across all LOD grids.
	 *
	 * @private
	 * @param {WorldOctree} world - A world octree.
	 * @param {Box3} region - The affected region.
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Union CSG type.
	 */

	static applyUnion(world, region, sdf) {

		const keyDesign = world.getKeyDesign();
		const lodZero = world.lodZero;

		const a = b1.min;
		const b = b1.max;
		const c = b2.min;
		const d = b2.max;
		const range = b2;

		let key, offset;
		let grid, octant;
		let lod, i;

		// Process LOD N to 1.
		for(lod = world.getDepth(); lod > 0; --lod) {

			grid = world.getGrid(lod);

			// Calculate a key coordinate range for this LOD and the next lower LOD.
			world.calculateKeyCoordinates(region.min, lod, a);
			world.calculateKeyCoordinates(region.max, lod, b);
			world.calculateKeyCoordinates(region.min, lod - 1, c);
			world.calculateKeyCoordinates(region.max, lod - 1, d);

			for(key of keyDesign.keyRange(a, b)) {

				if(!grid.has(key)) {

					octant = new IntermediateWorldOctant();
					octant.csg.add(sdf);
					grid.set(key, octant);

					// Translate the key coordinates to the next lower LOD.
					keyDesign.unpackKey(key, v$1);
					v$1.x <<= 1; v$1.y <<= 1; v$1.z <<= 1;

					// Determine the existence of the child octants.
					for(i = 0; i < 8; ++i) {

						offset = layout[i];

						p$1.set(
							v$1.x + offset[0],
							v$1.y + offset[1],
							v$1.z + offset[2]
						);

						if(range.containsPoint(p$1)) {

							// The child exists! store the information in bit i.
							octant.children |= (1 << i);

						}

					}

				}

			}

		}

		// Finally, process LOD zero and add the SDF to the leaf octants.
		world.calculateKeyCoordinates(region.min, 0, a);
		world.calculateKeyCoordinates(region.max, 0, b);

		for(key of keyDesign.keyRange(a, b)) {

			if(!lodZero.has(key)) {

				octant = new WorldOctant();
				lodZero.set(key, octant);

			} else {

				octant = lodZero.get(key);

			}

			octant.csg.add(sdf);

		}

	}

	/**
	 * Modifies existing octants in the specified region with the given SDF.
	 *
	 * Calculating an entry LOD depending on the longest side of the affected
	 * region could improve performance, but by skipping higher LOD grid some
	 * intermediate octants won't be affected by the SDF.
	 *
	 * ```js
	 * const min = region.min;
	 * const max = region.max;
	 *
	 * const s = Math.max(
	 * 	Math.max(Math.max(Math.abs(min.x), Math.abs(min.y)), Math.abs(min.z)),
	 * 	Math.max(Math.max(Math.abs(max.x), Math.abs(max.y)), Math.abs(max.z))
	 * );
	 *
	 * const quotientCeiled = Math.ceil(s / world.getCellSize());
	 * const doublingsCeiled = Math.ceil(Math.log2(quotientCeiled));
	 * const lod = Math.min(doublingsCeiled, world.getDepth());
	 * ```
	 *
	 * @private
	 * @param {WorldOctree} world - A world octree.
	 * @param {Box3} region - The affected region.
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Difference CSG type.
	 */

	static applyDifference(world, region, sdf) {

		const lod = world.getDepth();
		const keyDesign = world.getKeyDesign();
		const grid = world.getGrid(lod);

		// Consider all octants of the entry LOD grid that lie in the given region.
		const a = world.calculateKeyCoordinates(region.min, lod, b1.min);
		const b = world.calculateKeyCoordinates(region.max, lod, b1.max);

		let i, l;
		let range;
		let key;

		// Precompute key coordinate ranges for the lower LOD grids.
		for(i = 0, l = lod - 1; i < l; ++i) {

			if(i < ranges.length) {

				// Reuse a cached box.
				range = ranges[i];

				world.calculateKeyCoordinates(region.min, i, range.min);
				world.calculateKeyCoordinates(region.max, i, range.max);

			} else {

				// Create a new box for this LOD and cache it.
				ranges.push(new Box3(
					world.calculateKeyCoordinates(region.min, i),
					world.calculateKeyCoordinates(region.max, i)
				));

			}

		}

		// Delve into the octant structures.
		for(key of keyDesign.keyRange(a, b)) {

			if(grid.has(key)) {

				keyDesign.unpackKey(key, v$1);

				// Recursively modify affected LOD zero cells.
				applyDifference(world, sdf, grid.get(key), v$1.x, v$1.y, v$1.z, lod);

			}

		}

	}

	/**
	 * Modifies all existing octants.
	 *
	 * Warning: This CSG operation is highly destructive and expensive when used
	 * as a primary operation. It should rather be used in CSG composites where it
	 * can only affect local data.
	 *
	 * @private
	 * @param {WorldOctree} world - A world octree.
	 * @param {SignedDistanceFunction} sdf - An SDF with a primary Intersection CSG type.
	 */

	static applyIntersection(world, sdf) {

		let lod, octant;

		for(lod = world.getDepth(); lod >= 0; --lod) {

			for(octant of world.getGrid(lod).values()) {

				octant.csg.add(sdf);

			}

		}

	}

	/**
	 * Applies the given SDF to the affected octants.
	 *
	 * @param {WorldOctree} world - A world octree.
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	static applyCSG(world, sdf) {

		// Calculate the area of effect.
		const region = b0.copy(sdf.getBoundingBox(true));

		// Limit the affected region to the world boundaries.
		region.min.max(world.min);
		region.max.min(world.max);

		switch(sdf.operation) {

			case OperationType.UNION:
				this.applyUnion(world, region, sdf);
				break;

			case OperationType.DIFFERENCE:
				this.applyDifference(world, region, sdf);
				break;

			case OperationType.INTERSECTION:
				this.applyIntersection(world, sdf);
				break;

			default:
				console.error("No CSG operation type specified", sdf);
				break;

		}

	}

}

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v$2 = new Vector3();

/**
 * A line.
 *
 * @type {Line3}
 * @private
 */

const l = new Line3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b = new Box3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const d = new Box3();

/**
 * A ray.
 *
 * @type {Ray}
 * @private
 */

const r = new Ray();

/**
 * A lookup-table containing octant ids. Used to determine the exit plane from
 * an octant.
 *
 * @type {Uint8Array[]}
 * @private
 */

const octantTable = [

	new Uint8Array([4, 2, 1]),
	new Uint8Array([5, 3, 8]),
	new Uint8Array([6, 8, 3]),
	new Uint8Array([7, 8, 8]),
	new Uint8Array([8, 6, 5]),
	new Uint8Array([8, 7, 8]),
	new Uint8Array([8, 8, 7]),
	new Uint8Array([8, 8, 8])

];

/**
 * A byte that stores raycasting flags.
 *
 * @type {Number}
 * @private
 */

let flags = 0;

/**
 * Finds the entry plane of the first octant that a ray travels through.
 *
 * Determining the first octant requires knowing which of the t0s is the
 * largest. The tms of the other axes must also be compared against that
 * largest t0.
 *
 * @private
 * @param {Number} tx0 - Ray projection parameter.
 * @param {Number} ty0 - Ray projection parameter.
 * @param {Number} tz0 - Ray projection parameter.
 * @param {Number} txm - Ray projection parameter mean.
 * @param {Number} tym - Ray projection parameter mean.
 * @param {Number} tzm - Ray projection parameter mean.
 * @return {Number} The index of the first octant that the ray travels through.
 */

function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

	let entry = 0;

	// Find the entry plane.
	if(tx0 > ty0 && tx0 > tz0) {

		// YZ-plane.
		if(tym < tx0) {

			entry |= 2;

		}

		if(tzm < tx0) {

			entry |= 1;

		}

	} else if(ty0 > tz0) {

		// XZ-plane.
		if(txm < ty0) {

			entry |= 4;

		}

		if(tzm < ty0) {

			entry |= 1;

		}

	} else {

		// XY-plane.
		if(txm < tz0) {

			entry |= 4;

		}

		if(tym < tz0) {

			entry |= 2;

		}

	}

	return entry;

}

/**
 * Finds the next octant that intersects with the ray based on the exit plane of
 * the current one.
 *
 * @private
 * @param {Number} currentOctant - The index of the current octant.
 * @param {Number} tx1 - Ray projection parameter.
 * @param {Number} ty1 - Ray projection parameter.
 * @param {Number} tz1 - Ray projection parameter.
 * @return {Number} The index of the next octant that the ray travels through.
 */

function findNextOctant(currentOctant, tx1, ty1, tz1) {

	let min;
	let exit = 0;

	// Find the exit plane.
	if(tx1 < ty1) {

		min = tx1;
		exit = 0; // YZ-plane.

	} else {

		min = ty1;
		exit = 1; // XZ-plane.

	}

	if(tz1 < min) {

		exit = 2; // XY-plane.

	}

	return octantTable[currentOctant][exit];

}

/**
 * Recursively traverses the given octant to find (pseudo) leaf octants that
 * intersect with the given ray.
 *
 * @private
 * @param {WorldOctree} world - The world octree.
 * @param {WorldOctant} octant - The current octant.
 * @param {Number} keyX - The X-coordinate of the current octant key.
 * @param {Number} keyY - The Y-coordinate of the current octant key.
 * @param {Number} keyZ - The Z-coordinate of the current octant key.
 * @param {Number} lod - The current LOD.
 * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.
 * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.
 * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.
 * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.
 * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.
 * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.
 * @param {WorldOctant[]} intersects - An array to be filled with the intersecting octants.
 */

function raycastOctant(world, octant, keyX, keyY, keyZ, lod, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {

	let keyDesign, cellSize;
	let octantWrapper, grid;
	let children, offset;

	let currentOctant;
	let txm, tym, tzm;

	let i;

	if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

		keyDesign = world.getKeyDesign();

		if(lod === 0 || octant.isosurface !== null) {

			cellSize = world.getCellSize(lod);
			octantWrapper = new WorldOctantWrapper(octant);
			octantWrapper.id.set(lod, keyDesign.packKey(v$2.set(keyX, keyY, keyZ)));
			octantWrapper.min.copy(v$2).multiplyScalar(cellSize).add(world.min);
			octantWrapper.max.copy(octantWrapper.min).addScalar(cellSize);

			intersects.push(octantWrapper);

		} else if(octant.children > 0) {

			// Look at the next lower LOD.
			grid = world.getGrid(--lod);
			children = octant.children;

			// Translate the key coordinates to the next lower LOD.
			keyX <<= 1; keyY <<= 1; keyZ <<= 1;

			// Compute means.
			txm = 0.5 * (tx0 + tx1);
			tym = 0.5 * (ty0 + ty1);
			tzm = 0.5 * (tz0 + tz1);

			currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

			do {

				i = flags ^ currentOctant;

				switch(currentOctant) {

					case 0: {

						if((children & (1 << i)) !== 0) {

							offset = layout[i];
							v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, tx0, ty0, tz0, txm, tym, tzm, intersects);

						}

						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
						break;

					}

					case 1: {

						if((children & (1 << i)) !== 0) {

							offset = layout[i];
							v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, tx0, ty0, tzm, txm, tym, tz1, intersects);

						}

						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
						break;

					}

					case 2: {

						if((children & (1 << i)) !== 0) {

							offset = layout[i];
							v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, tx0, tym, tz0, txm, ty1, tzm, intersects);

						}

						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
						break;

					}

					case 3: {

						if((children & (1 << i)) !== 0) {

							offset = layout[i];
							v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, tx0, tym, tzm, txm, ty1, tz1, intersects);

						}

						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
						break;

					}

					case 4: {

						if((children & (1 << i)) !== 0) {

							offset = layout[i];
							v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, txm, ty0, tz0, tx1, tym, tzm, intersects);

						}

						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
						break;

					}

					case 5: {

						if((children & (1 << i)) !== 0) {

							offset = layout[i];
							v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, txm, ty0, tzm, tx1, tym, tz1, intersects);

						}

						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
						break;

					}

					case 6: {

						if((children & (1 << i)) !== 0) {

							offset = layout[i];
							v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, txm, tym, tz0, tx1, ty1, tzm, intersects);

						}

						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
						break;

					}

					case 7: {

						if((children & (1 << i)) !== 0) {

							offset = layout[i];
							v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
							raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, txm, tym, tzm, tx1, ty1, tz1, intersects);

						}

						// Far top right octant. No other octants can be reached from here.
						currentOctant = 8;
						break;

					}

				}

			} while(currentOctant < 8);

		}

	}

}

/**
 * Finds (pseudo) leaf octants in the given subtree that intersect with the
 * given ray.
 *
 * @private
 * @param {WorldOctree} world - The world octree.
 * @param {WorldOctantWrapper} subtree - A world octant, enriched with positional information.
 * @param {Vector3} keyCoordinates - The key coordinates of the octant.
 * @param {Ray} ray - A ray.
 * @param {WorldOctant[]} intersects - The intersecting octants. Sorted by distance, closest first
 */

function intersectSubtree(world, subtree, keyCoordinates, ray, intersects) {

	// Translate the octant extents to the scene origin.
	const min = b.min.set(0, 0, 0);
	const max = b.max.subVectors(subtree.max, subtree.min);

	const dimensions = subtree.getDimensions(d.min);
	const halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);

	const origin = r.origin.copy(ray.origin);
	const direction = r.direction.copy(ray.direction);

	let invDirX, invDirY, invDirZ;
	let tx0, tx1, ty0, ty1, tz0, tz1;

	// Translate the ray to the center of the octant.
	origin.sub(subtree.getCenter(v$2)).add(halfDimensions);

	// Reset all flags.
	flags = 0;

	// Handle rays with negative directions.
	if(direction.x < 0.0) {

		origin.x = dimensions.x - origin.x;
		direction.x = -direction.x;
		flags |= 4;

	}

	if(direction.y < 0.0) {

		origin.y = dimensions.y - origin.y;
		direction.y = -direction.y;
		flags |= 2;

	}

	if(direction.z < 0.0) {

		origin.z = dimensions.z - origin.z;
		direction.z = -direction.z;
		flags |= 1;

	}

	// Improve IEEE double stability.
	invDirX = 1.0 / direction.x;
	invDirY = 1.0 / direction.y;
	invDirZ = 1.0 / direction.z;

	// Project the ray to the octant's boundaries.
	tx0 = (min.x - origin.x) * invDirX;
	tx1 = (max.x - origin.x) * invDirX;
	ty0 = (min.y - origin.y) * invDirY;
	ty1 = (max.y - origin.y) * invDirY;
	tz0 = (min.z - origin.z) * invDirZ;
	tz1 = (max.z - origin.z) * invDirZ;

	// Find the intersecting children.
	raycastOctant(
		world, subtree.octant,
		keyCoordinates.x, keyCoordinates.y, keyCoordinates.z, world.getDepth(),
		tx0, ty0, tz0, tx1, ty1, tz1,
		intersects
	);

}

/**
 * A world octree raycaster.
 *
 * This raycaster is a specialised hybrid that uses a voxel traversal algorithm
 * to iterate over the octants of the highest LOD grid and an octree traversal
 * algorithm to raycast the identified subtrees.
 *
 * The voxel traversal implementation is a 3D supercover variant of the Digital
 * Differential Analyzer (DDA) line algorithm and is similar to the Bresenham
 * algorithm. The octree traversal algorithm relies on octant child existence
 * information to skip empty space and to avoid hashmap lookup misses.
 *
 * References:
 *
 *  "Voxel Traversal along a 3D Line"
 *  by D. Cohen (1994)
 *
 *  "An Efficient Parametric Algorithm for Octree Traversal"
 *  by J. Revelles et al. (2000)
 */

class WorldOctreeRaycaster {

	/**
	 * Finds (pseudo) leaf octants that intersect with the given ray.
	 *
	 * @param {WorldOctree} world - A world octree.
	 * @param {Ray} ray - A ray.
	 * @param {Array} [intersects] - An optional target list to be filled with the intersecting octants.
	 * @return {WorldOctant[]} The intersecting octants. Sorted by distance, closest first.
	 */

	static intersectWorldOctree(world, ray, intersects = []) {

		const lod = world.getDepth();
		const grid = world.getGrid(lod);
		const cellSize = world.getCellSize(lod);
		const keyDesign = world.getKeyDesign();
		const octantWrapper = new WorldOctantWrapper();

		const keyCoordinates0 = l.start;
		const keyCoordinates1 = l.end;

		// Find the point at which the ray enters the world grid.
		const a = !world.containsPoint(r.copy(ray).origin) ?
			r.intersectBox(world, r.origin) :
			r.origin;

		let key, octant;
		let t, b, n;

		let dx, dy, dz;
		let ax, ay, az, bx, by, bz;
		let sx, sy, sz, exy, exz, ezy;

		octantWrapper.id.lod = lod;

		// Check if the ray hits the world octree.
		if(a !== null) {

			// Phase 1: Initialisation.

			// Find the ending point.
			t = cellSize << 1;
			b = r.at(t, v$2);

			// Calculate the starting and ending cell coordinates.
			world.calculateKeyCoordinates(a, lod, keyCoordinates0);
			world.calculateKeyCoordinates(b, lod, keyCoordinates1);

			// Calculate the key coordinate vector from start to end.
			dx = keyCoordinates1.x - keyCoordinates0.x;
			dy = keyCoordinates1.y - keyCoordinates0.y;
			dz = keyCoordinates1.z - keyCoordinates0.z;

			// Prepare step sizes and project the line onto the XY-, XZ- and ZY-plane.
			sx = Math.sign(dx); sy = Math.sign(dy); sz = Math.sign(dz);
			ax = Math.abs(dx); ay = Math.abs(dy); az = Math.abs(dz);
			bx = 2 * ax; by = 2 * ay; bz = 2 * az;
			exy = ay - ax; exz = az - ax; ezy = ay - az;

			// Phase 2: Incremental Traversal.
			for(n = ax + ay + az; n > 0; --n) {

				key = keyDesign.packKey(keyCoordinates0);

				// Check if this cell is populated.
				if(grid.has(key)) {

					octant = grid.get(key);

					// Setup a pseudo octree.
					octantWrapper.id.key = key;
					octantWrapper.octant = octant;
					octantWrapper.min.copy(keyCoordinates0);
					octantWrapper.min.multiplyScalar(cellSize);
					octantWrapper.min.add(world.min);
					octantWrapper.max.copy(octantWrapper.min).addScalar(cellSize);

					if(octant.isosurface === null) {

						// Raycast the subtree and collect intersecting children.
						intersectSubtree(world, octantWrapper, keyCoordinates0, ray, intersects);

					} else {

						// The octant contains a mesh. No need to look deeper.
						intersects.push(octantWrapper.clone());

					}

				}

				if(exy < 0) {

					if(exz < 0) {

						keyCoordinates0.x += sx;
						exy += by; exz += bz;

					} else {

						keyCoordinates0.z += sz;
						exz -= bx; ezy += by;

					}

				} else if(ezy < 0) {

					keyCoordinates0.z += sz;
					exz -= bx; ezy += by;

				} else {

					keyCoordinates0.y += sy;
					exy -= bx; ezy -= bz;

				}

			}

		}

		return intersects;

	}

}

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v$3 = new Vector3();

/**
 * Recursively deletes octant children.
 *
 * @param {WorldOctree} world - A world octree.
 * @param {WorldOctant} octant - The current octant.
 * @param {Number} keyX - The X-coordinate of the current octant key.
 * @param {Number} keyY - The Y-coordinate of the current octant key.
 * @param {Number} keyZ - The Z-coordinate of the current octant key.
 * @param {Number} lod - The current LOD value.
 */

function removeChildren(world, octant, keyX, keyY, keyZ, lod) {

	let grid, keyDesign;
	let children, child;
	let offset, key, i;

	// The octants from LOD zero have no children.
	if(lod > 0) {

		// Look at the next lower LOD.
		--lod;

		grid = world.getGrid(lod);
		keyDesign = world.getKeyDesign();
		children = octant.children;

		// Translate the key coordinates to the next lower LOD.
		keyX <<= 1; keyY <<= 1; keyZ <<= 1;

		for(i = 0; i < 8; ++i) {

			// Check if the child exists.
			if((children & (1 << i)) !== 0) {

				offset = layout[i];

				v$3.set(
					keyX + offset[0],
					keyY + offset[1],
					keyZ + offset[2]
				);

				key = keyDesign.packKey(v$3);

				// Fetch the child and remove it from the grid.
				child = grid.get(key);
				grid.delete(key);

				removeChildren(world, child, v$3.x, v$3.y, v$3.z, lod);

			}

		}

		octant.children = 0;

	}

}

/**
 * Recursively removes empty parent nodes.
 *
 * @param {WorldOctree} world - A world octree.
 * @param {Number} keyX - The X-coordinate of the deleted octant's key.
 * @param {Number} keyY - The Y-coordinate of the deleted octant's key.
 * @param {Number} keyZ - The Z-coordinate of the deleted octant's key.
 * @param {Number} lod - The current LOD value.
 */

function prune(world, keyX, keyY, keyZ, lod) {

	let grid, i, key, parent;

	if(++lod < world.levels) {

		// Look at the next higher LOD grid.
		grid = world.getGrid(lod);

		// Determine the position of the deleted octant relative to its parent.
		i = WorldOctree.calculateOffsetIndex(keyX, keyY, keyZ);

		// Translate the key coordinates to the next higher LOD.
		v$3.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);

		// The resulting coordinates identify the parent octant.
		key = world.getKeyDesign().packKey(v$3);
		parent = grid.get(key);

		// Unset the existence flag of the deleted child.
		parent.children &= ~(1 << i);

		// Check if there are any children left.
		if(parent.children === 0) {

			// Remove the empty parent and recur.
			grid.delete(key);
			prune(world, v$3.x, v$3.y, v$3.z, lod);

		}

	}

}

/**
 * An octree that subdivides space for fast spatial searches.
 *
 * The purpose of this linear octree is to efficiently organise volume data. It
 * allows direct access to different LOD layers, octant neighbours and parents.
 *
 * The world octree is axis-aligned and cannot be rotated.
 */

class WorldOctree {

	/**
	 * Constructs a new world octree.
	 *
	 * Each octant can be uniquely identified by a 3D coordinate and a LOD value.
	 * The individual values for X, Y and Z are combined into a 53-bit key.
	 *
	 * @param {Number} [cellSize=20] - The size of the smallest octants in LOD zero. Must be an integer i such that 0 < i < 2 ** (33 - levels).
	 * @param {Number} [levels=8] - The amount of detail levels. Must be an integer i such that 0 < i < 33.
	 * @param {KeyDesign} [keyDesign] - The bit allotments for the octant coordinates.
	 */

	constructor(cellSize = 20, levels = 8, keyDesign = new KeyDesign()) {

		levels = Math.max(Math.min(Math.trunc(levels), 32), 1);

		/**
		 * The LOD zero cell size.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = Math.max(Math.min(Math.trunc(cellSize), Math.pow(2, 33 - levels) - 1), 1);

		/**
		 * The octant key design.
		 *
		 * @type {KeyDesign}
		 * @private
		 */

		this.keyDesign = keyDesign;

		/**
		 * The octant LOD grids.
		 *
		 * @type {Map[]}
		 * @private
		 */

		this.grids = [];

		while(this.grids.length < levels) {

			this.grids.push(new Map());

		}

		/**
		 * An empty octant wrapper that merely holds the bounds of this world.
		 *
		 * @type {WorldOctantWrapper}
		 * @private
		 */

		this.bounds = new WorldOctantWrapper();

		this.bounds.min.copy(this.keyDesign.halfRange).multiplyScalar(-this.cellSize);
		this.bounds.max.copy(this.keyDesign.halfRange).multiplyScalar(this.cellSize);

	}

	/**
	 * The lower bounds of this world.
	 *
	 * @type {Vector3}
	 */

	get min() {

		return this.bounds.min;

	}

	/**
	 * The upper bounds of this world.
	 *
	 * @type {Vector3}
	 */

	get max() {

		return this.bounds.max;

	}

	/**
	 * The amount of detail levels. This value can not be changed.
	 *
	 * @type {Number}
	 */

	get levels() {

		return this.grids.length;

	}

	/**
	 * The LOD zero octant grid.
	 *
	 * @type {Number}
	 */

	get lodZero() {

		return this.grids[0];

	}

	/**
	 * Returns the key design.
	 *
	 * @return {KeyDesign} The key design.
	 */

	getKeyDesign() {

		return this.keyDesign;

	}

	/**
	 * Returns the size of the cells in the specified LOD grid.
	 *
	 * @param {Number} [lod=0] - The LOD. Must be an integer; fractions will be truncated.
	 * @return {Number} The cell size.
	 */

	getCellSize(lod = 0) {

		return (this.cellSize << lod) >>> 0;

	}

	/**
	 * Computes the center of this world.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the center of this world.
	 */

	getCenter(target) {

		return this.bounds.getCenter(target);

	}

	/**
	 * Sets the center of this world.
	 *
	 * Keeping the center at (0, 0, 0) is recommended because a large offset can
	 * lead to floating point coordinate imprecisions.
	 *
	 * @param {Vector3} center - The new center.
	 */

	setCenter(center) {

		this.min.copy(this.keyDesign.halfRange).multiplyScalar(-this.cellSize).add(center);
		this.max.copy(this.keyDesign.halfRange).multiplyScalar(this.cellSize).add(center);

	}

	/**
	 * Computes the size of this world.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the size of this world.
	 */

	getDimensions(target) {

		return this.bounds.getDimensions(target);

	}

	/**
	 * The world octree depth is constant and corresponds to the amount of detail
	 * levels.
	 *
	 * @return {Number} The octree depth.
	 */

	getDepth() {

		return this.grids.length - 1;

	}

	/**
	 * Returns a specific LOD grid.
	 *
	 * @param {Number} lod - The LOD of the grid.
	 * @return {Map} The requested LOD grid or undefined if the given LOD is out of bounds.
	 */

	getGrid(lod) {

		return (lod >= 0 && lod < this.grids.length) ? this.grids[lod] : undefined;

	}

	/**
	 * Removes all octants.
	 */

	clear() {

		let i, l;

		for(i = 0, l = this.grids.length; i < l; ++i) {

			this.grids[i].clear();

		}

	}

	/**
	 * Checks if the given point lies inside this octree's boundaries.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Boolean} Whether the given point lies inside this octree.
	 */

	containsPoint(point) {

		return this.bounds.containsPoint(point);

	}

	/**
	 * Fetches all octants of the specified LOD.
	 *
	 * @param {Number} level - The LOD.
	 * @return {Iterable} A collection that contains the octants of the specified LOD.
	 */

	findOctantsByLevel(level) {

		return this.octants(level);

	}

	/**
	 * Calculates key coordinates based on a given position and LOD.
	 *
	 * @param {Vector3} position - A position.
	 * @param {Number} lod - The target LOD.
	 * @param {Vector3} [target] - A vector to store the result in. If none is provided, a new one will be created.
	 * @return {Vector3} The key coordinates.
	 */

	calculateKeyCoordinates(position, lod, target = new Vector3()) {

		const cellSize = this.cellSize << lod;

		// Translate to the origin (zero-based unsigned coordinates).
		v$3.subVectors(position, this.min);

		target.set(
			Math.trunc(v$3.x / cellSize),
			Math.trunc(v$3.y / cellSize),
			Math.trunc(v$3.z / cellSize)
		);

		return target;

	}

	/**
	 * Retrieves the octant of a specific LOD that contains the given point.
	 *
	 * @param {Vector3} point - A point.
	 * @param {Number} [lod=0] - A LOD value.
	 * @return {WorldOctant} The octant that contains the point or undefined if it doesn't exist.
	 */

	getOctantByPoint(point, lod = 0) {

		const keyDesign = this.keyDesign;
		const grid = this.getGrid(lod);

		let result;

		if(grid !== undefined) {

			if(this.containsPoint(point)) {

				this.calculateKeyCoordinates(point, lod, v$3);
				result = grid.get(keyDesign.packKey(v$3));

			} else {

				console.error("Position out of range", point);

			}

		} else {

			console.error("Invalid LOD", lod);

		}

		return result;

	}

	/**
	 * Removes a specific octant by a given key.
	 *
	 * Children and empty parent nodes will be removed as well.
	 *
	 * @param {Number} key - The key of the octant that should be removed.
	 * @param {Number} [lod=0] - The LOD of the octant.
	 */

	removeOctant(key, lod = 0) {

		const keyDesign = this.keyDesign;
		const grid = this.getGrid(lod);

		let keyX, keyY, keyZ;

		if(grid !== undefined) {

			if(grid.has(key)) {

				// Note: v will be modified by removeChildren and prune.
				keyDesign.unpackKey(key, v$3);
				keyX = v$3.x; keyY = v$3.y; keyZ = v$3.z;

				// Recursively delete all children in the lower LOD grids.
				removeChildren(this, grid.get(key), keyX, keyY, keyZ, lod);

				// Remove the octant.
				grid.delete(key);

				// Recursively delete empty parent nodes.
				prune(this, keyX, keyY, keyZ, lod);

			} else {

				console.error("No octant found", key);

			}

		} else {

			console.error("Invalid LOD", lod);

		}

	}

	/**
	 * Applies the given SDF to the affected octants.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	applyCSG(sdf) {

		WorldOctreeCSG.applyCSG(this, sdf);

	}

	/**
	 * Finds the octants that intersect with the given ray. The intersecting
	 * octants are sorted by distance, closest first. Empty octants will not be
	 * included in the result.
	 *
	 * @param {Ray} ray - A ray.
	 * @param {Array} [intersects] - An optional target list to be filled with the intersecting octants.
	 * @return {WorldOctant[]} The intersecting octants.
	 */

	raycast(ray, intersects = []) {

		return WorldOctreeRaycaster.intersectWorldOctree(this, ray, intersects);

	}

	/**
	 * Returns a new world octant iterator.
	 *
	 * The octants returned by this iterator are augmented with explicit
	 * positional information. See {@link WorldOctantWrapper} for more details.
	 *
	 * @param {Number} [lod=0] - The LOD grid to consider.
	 * @return {WorldOctantIterator} An iterator.
	 */

	octants(lod = 0) {

		return new WorldOctantIterator(this, lod);

	}

	/**
	 * Calculates an offset index from octant key coordinates.
	 *
	 * The index identifies the octant's positional offset relative to its parent:
	 *
	 * ```text
	 *  0: [0, 0, 0]
	 *  1: [0, 0, 1]
	 *  2: [0, 1, 0]
	 *  3: [0, 1, 1]
	 *  4: [1, 0, 0]
	 *  5: [1, 0, 1]
	 *  6: [1, 1, 0]
	 *  7: [1, 1, 1]
	 * ```
	 *
	 * Note: This binary pattern is defined by the external sparse-octree module.
	 *
	 * For more information on fast bitwise modulo with power of two divisors see:
	 *  https://graphics.stanford.edu/~seander/bithacks.html#ModulusDivisionEasy
	 *
	 * @param {Number} x - The X-coordinate of the octant key.
	 * @param {Number} y - The Y-coordinate of the octant key.
	 * @param {Number} z - The Z-coordinate of the octant key.
	 * @return {Number} The index of the relative position offset. Range: [0, 7].
	 */

	static calculateOffsetIndex(x, y, z) {

		// Bitwise modulo: n % (1 << s) = n & ((1 << s) - 1) for positive integers.
		const offsetX = x & 1;
		const offsetY = y & 1;
		const offsetZ = z & 1;

		// Use a reversed packing order for correct indexing (X * 4 + Y * 2 + Z).
		return (offsetX << 2) + (offsetY << 1) + offsetZ;

	}

}

/**
 * A scene that consists of several concentric geometry rings.
 */

class Scene {

	/**
	 * Constructs a new scene.
	 *
	 * @param {Number} levels - The amount of LOD rings.
	 */

	constructor(levels) {


	}

	/**
	 * The number of detail levels.
	 *
	 * @type {Number}
	 */

	get levels() {

		return this.something.length;

	}

	/**
	 * Clones this scene.
	 */

	clone() {

		return new this.constructor(this.levels);

	}

}

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b$1 = new Box3();

/**
 * A frustum.
 *
 * @type {Frustum}
 * @private
 */

const f = new Frustum();

/**
 * A 4x4 matrix.
 *
 * @type {Matrix4}
 * @private
 */

const m$1 = new Matrix4();

/**
 * A 3D geometry clipmap.
 *
 * Finds world octants that are close to the viewer and arranges them in
 * concentric LOD shells. Octants that leave or enter a shell are reported for
 * further processing.
 */

class Clipmap extends EventTarget {

	/**
	 * Constructs a new clipmap.
	 *
	 * @param {WorldOctree} world - A world octree.
	 */

	constructor(world) {

		super();

		/**
		 * The world octree.
		 *
		 * @type {WorldOctree}
		 */

		this.world = world;

		/**
		 * The current view position.
		 *
		 * @type {Vector3}
		 */

		this.position = new Vector3(Infinity, Infinity, Infinity);

		/**
		 * The current scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.currentScene = new Scene(this.world.levels);

		/**
		 * The previous scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.previousScene = this.currentScene.clone();

		/**
		 * The next scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.nextScene = this.currentScene.clone();

	}

	/**
	 * Updates the clipmap.
	 *
	 * @param {PerspectiveCamera} camera - A camera.
	 */

	update(camera) {

		const viewPosition = this.position;

		viewPosition.copy(camera.position);

		// Build a frustum based on the given camera.
		f.setFromMatrix(m$1.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

		// Find octant keys.

	}

	/**
	 * Generates voxel data for the cells in the current scene and contours them
	 * to extract a polygonal mesh.
	 */

	process() {

	}

	/**
	 * Clears this clipmap.
	 */

	clear() {

		this.previousScene.clear();
		this.currentScene.clear();
		this.nextScene.clear();

	}

}

/**
 * An enumeration of worker actions.
 *
 * @type {Object}
 * @property {String} EXTRACT - Isosurface extraction signal.
 * @property {String} MODIFY - Data modification signal.
 * @property {String} CONFIGURE - General configuration signal.
 * @property {String} CLOSE - Thread termination signal.
 */

const Action = {

	EXTRACT: "worker.extract",
	MODIFY: "worker.modify",
	CONFIGURE: "worker.config",
	CLOSE: "worker.close"

};

/**
 * A message.
 *
 * Messages are exchanged between different execution contexts such as a worker
 * and the main thread.
 */

class Message {

	/**
	 * Constructs a new message.
	 *
	 * @param {Action} [action=null] - A worker action.
	 */

	constructor(action = null) {

		/**
		 * A worker action.
		 *
		 * When a message is sent to another execution context, it will be copied
		 * using the Structured Clone algorithm. This automatic process turns the
		 * message into a plain object. The explicit action flag serves as a
		 * reliable identifier.
		 *
		 * @type {Action}
		 */

		this.action = action;

		/**
		 * An error.
		 *
		 * If this is not null, something went wrong.
		 *
		 * @type {ErrorEvent}
		 */

		this.error = null;

	}

}

/**
 * A worker message that contains transferable data.
 */

class DataMessage extends Message {

	/**
	 * Constructs a new data message.
	 *
	 * @param {Action} [action=null] - A worker action.
	 */

	constructor(action = null) {

		super(action);

		/**
		 * A serialised data container.
		 *
		 * @type {Object}
		 */

		this.data = null;

	}

}

/**
 * An extraction request.
 */

class ExtractionRequest extends DataMessage {

	/**
	 * Constructs a new extraction request.
	 */

	constructor() {

		super(Action.EXTRACT);

	}

}

/**
 * A modification request.
 */

class ModificationRequest extends DataMessage {

	/**
	 * Constructs a new modification request.
	 */

	constructor() {

		super(Action.MODIFY);

		/**
		 * A serialised SDF.
		 *
		 * @type {Object}
		 */

		this.sdf = null;

		/**
		 * The world size of the volume data cell.
		 *
		 * @type {Number}
		 */

		this.cellSize = 0;

		/**
		 * The world positions of the volume data cell.
		 *
		 * Together with the world size, this base position describes the region of
		 * the volume data cell in world space.
		 *
		 * @type {Number[]}
		 */

		this.cellPosition = null;

	}

}

/**
 * A configuration message.
 */

class ConfigurationMessage extends Message {

	/**
	 * Constructs a new configuration message.
	 */

	constructor() {

		super(Action.CONFIGURE);

		/**
		 * The global grid resolution of the Hermite data chunks.
		 *
		 * @type {Number}
		 */

		this.resolution = HermiteData.resolution;

		/**
		 * An error threshold for QEF-based mesh simplification.
		 *
		 * @type {Number}
		 */

		this.errorThreshold = 1e-2;

	}

}

/**
 * An extraction response.
 */

class ExtractionResponse extends DataMessage {

	/**
	 * Constructs a new extraction response.
	 */

	constructor() {

		super(Action.EXTRACT);

		/**
		 * A serialised isosurface.
		 *
		 * @type {Object}
		 */

		this.isosurface = null;

	}

}

/**
 * A modification response.
 */

class ModificationResponse extends DataMessage {

	/**
	 * Constructs a new modification response.
	 */

	constructor() {

		super(Action.MODIFY);

		/**
		 * A serialised SDF.
		 *
		 * @type {Object}
		 */

		this.sdf = null;

	}

}

/**
 * A worker event.
 */

class WorkerEvent extends Event {

	/**
	 * Constructs a new worker event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * A worker.
		 *
		 * @type {Worker}
		 */

		this.worker = null;

		/**
		 * A worker response.
		 *
		 * @type {Response}
		 */

		this.response = null;

	}

}

/**
 * A worker message event.
 *
 * This event is dispatched by {@link ThreadPool}.
 *
 * @type {WorkerEvent}
 * @example threadPool.addEventListener("message", myListener);
 */

const message = new WorkerEvent("message");

var worker = "function _typeof(e){return _typeof=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&\"function\"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?\"symbol\":typeof e},_typeof(e)}(function(){'use strict';var me=Math.pow,xe=Math.trunc,pe=Math.sign,ve=Math.PI,ge=Math.atan2,ke=Math.round,he=Math.acos,ze=Math.cos,fe=Math.sin,Se=Math.floor,we=Math.ceil,Te=Math.abs,Ie=Math.sqrt,Ce=Math.max,Pe=Math.min;function e(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function t(e,t){for(var a,n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,\"value\"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}function n(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){if(\"function\"!=typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function\");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}function s(e){return s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},s(e)}function y(e,t){return y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},y(e,t)}function u(){if(\"undefined\"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if(\"function\"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function x(){return x=u()?Reflect.construct:function(e,t,n){var i=[null];i.push.apply(i,t);var a=Function.bind.apply(e,i),l=new a;return n&&y(l,n.prototype),l},x.apply(null,arguments)}function g(e){if(void 0===e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return e}function k(e,t){return t&&(\"object\"===_typeof(t)||\"function\"==typeof t)?t:g(e)}function h(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&(e=s(e),null!==e););return e}function z(e,t,a){return z=\"undefined\"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,a){var n=h(e,t);if(n){var i=Object.getOwnPropertyDescriptor(n,t);return i.get?i.get.call(a):i.value}},z(e,t,a||e)}function f(e,t,a,n){return f=\"undefined\"!=typeof Reflect&&Reflect.set?Reflect.set:function(e,t,a,n){var l,o=h(e,t);if(o){if(l=Object.getOwnPropertyDescriptor(o,t),l.set)return l.set.call(n,a),!0;if(!l.writable)return!1}if(l=Object.getOwnPropertyDescriptor(n,t),l){if(!l.writable)return!1;l.value=a,Object.defineProperty(n,t,l)}else i(n,t,a);return!0},f(e,t,a,n)}function S(e,t,a,n,i){var l=f(e,t,a,n||e);if(!l&&i)throw new Error(\"failed to set property\");return a}function w(e){return T(e)||I(e)||C()}function T(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}}function I(e){if(Symbol.iterator in Object(e)||\"[object Arguments]\"===Object.prototype.toString.call(e))return Array.from(e)}function C(){throw new TypeError(\"Invalid attempt to spread non-iterable instance\")}function P(e,t,a){return Ce(Pe(e,a),t)}function E(e,t,a){var n,l,o,s,r,y,d,u,c,m,x,p=t.params.Points.threshold;for(r=0,d=e.length;r<d;++r)if(c=e[r],m=c.points,null!==m)for(y=0,u=m.length;y<u;++y)x=m[y],s=t.ray.distanceSqToPoint(x),s<p*p&&(n=t.ray.closestPointToPoint(x,new Ee),l=t.ray.origin.distanceTo(n),l>=t.near&&l<=t.far&&(o=Ie(s),a.push(new yt(l,o,n,c.data[y]))))}function D(e,t,a,n,i,l){var o=0;return e>t&&e>a?(i<e&&(o|=2),l<e&&(o|=1)):t>a?(n<t&&(o|=4),l<t&&(o|=1)):(n<a&&(o|=4),i<a&&(o|=2)),o}function F(e,t,a,n){var i,l=0;return t<a?(i=t,l=0):(i=a,l=1),n<i&&(l=2),dt[e][l]}function A(e,t,a){var n,i,l,o,s,r,y,u,c,m=ct.min.set(0,0,0),x=ct.max.subVectors(e.max,e.min),p=e.getDimensions(mt.min),v=mt.max.copy(p).multiplyScalar(.5),g=d.origin.copy(t.origin),k=d.direction.copy(t.direction);return g.sub(e.getCenter(ut)).add(v),a.value=0,0>k.x&&(g.x=p.x-g.x,k.x=-k.x,a.value|=4),0>k.y&&(g.y=p.y-g.y,k.y=-k.y,a.value|=2),0>k.z&&(g.z=p.z-g.z,k.z=-k.z,a.value|=1),n=1/k.x,i=1/k.y,l=1/k.z,o=(m.x-g.x)*n,s=(x.x-g.x)*n,r=(m.y-g.y)*i,y=(x.y-g.y)*i,u=(m.z-g.z)*l,c=(x.z-g.z)*l,Ce(Ce(o,r),u)<Pe(Pe(s,y),c)?[o,r,u,s,y,c]:null}function V(e,t,a,n,i,l,o,s){if(0<=i&&0<=l&&0<=o){var y=e.children;if(null===y)s.push(e);else{var d=.5*(t+i),u=.5*(a+l),c=.5*(n+o),m=r.value,x=D(t,a,n,d,u,c);do 0===x?(V(y[m],t,a,n,d,u,c,s),x=F(x,d,u,c)):1===x?(V(y[1^m],t,a,c,d,u,o,s),x=F(x,d,u,o)):2===x?(V(y[2^m],t,u,n,d,l,c,s),x=F(x,d,l,c)):3===x?(V(y[3^m],t,u,c,d,l,o,s),x=F(x,d,l,o)):4===x?(V(y[4^m],d,a,n,i,u,c,s),x=F(x,i,u,c)):5===x?(V(y[5^m],d,a,c,i,u,o,s),x=F(x,i,u,o)):6===x?(V(y[6^m],d,u,n,i,l,c,s),x=F(x,i,l,c)):7===x?(V(y[7^m],d,u,c,i,l,o,s),x=8):void 0;while(8>x)}}}function B(e){var t,a,n,o=e.children,s=0;if(null!==o)for(t=0,a=o.length;t<a;++t)n=1+B(o[t]),n>s&&(s=n);return s}function N(e,t,a){var n,o,s=e.children;if(gt.min=e.min,gt.max=e.max,t.intersectsBox(gt))if(null!==s)for(n=0,o=s.length;n<o;++n)N(s[n],t,a);else a.push(e)}function L(e,t,a,n){var o,s,r=e.children;if(a===t)n.push(e);else if(null!==r)for(++a,o=0,s=r.length;o<s;++o)L(r[o],t,a,n)}function O(e){var t,a,n=e.children,o=0;if(null!==n)for(t=0,a=n.length;t<a;++t)o+=O(n[t]);else null!==e.points&&(o=e.points.length);return o}function M(e,t,a,n,o){var s,r,y=n.children,d=!1,u=!1;if(n.contains(e,a.bias)){if(null===y){if(null===n.points)n.points=[],n.data=[];else for(s=0,r=n.points.length;!d&&s<r;++s)d=n.points[s].equals(e);d?(n.data[s-1]=t,u=!0):n.points.length<a.maxPoints||o===a.maxDepth?(n.points.push(e.clone()),n.data.push(t),++a.pointCount,u=!0):(n.split(),n.redistribute(a.bias),y=n.children)}if(null!==y)for(++o,s=0,r=y.length;!u&&s<r;++s)u=M(e,t,a,y[s],o)}return u}function R(e,t,a,n){var o,s,r,y,d,u=a.children,c=null;if(a.contains(e,t.bias))if(null!==u)for(o=0,s=u.length;null===c&&o<s;++o)c=R(e,t,u[o],a);else if(null!==a.points)for(r=a.points,y=a.data,(o=0,s=r.length);o<s;++o)if(r[o].equals(e)){d=s-1,c=y[o],o<d&&(r[o]=r[d],y[o]=y[d]),r.pop(),y.pop(),--t.pointCount,null!==n&&O(n)<=t.maxPoints&&n.merge();break}return c}function Y(e,t,a){var n,o,s,r=a.children,y=null;if(a.contains(e,t.bias))if(null!==r)for(n=0,o=r.length;null===y&&n<o;++n)y=Y(e,t,r[n]);else if(null!==a.points)for(s=a.points,n=0,o=s.length;null===y&&n<o;++n)e.equals(s[n])&&(y=a.data[n]);return y}function X(e,t,a,n,o,s){var r,y,d,u=n.children,c=null;if(n.contains(e,a.bias))if(!n.contains(t,a.bias))c=R(e,a,n,o),M(t,c,a,o,s-1);else if(null!==u)for(++s,r=0,y=u.length;null===c&&r<y;++r)c=X(e,t,a,u[r],n,s);else if(null!==n.points)for(d=n.points,r=0,y=d.length;r<y;++r)if(e.equals(d[r])){d[r].copy(t),c=n.data[r];break}return c}function Z(e,t,a,n){var o,s,r=null,y=t;if(null!==n.children){var d,u,c=n.children.map(function(t){return{octant:t,distance:t.distanceToCenterSquared(e)}}).sort(function(e,t){return e.distance-t.distance});for(o=0,s=c.length;o<s&&(d=c[o].octant,!(d.contains(e,y)&&(u=Z(e,y,a,d),null!==u&&(y=u.distance,r=u,0===y))));++o);}else if(null!==n.points){var m,x=n.points,p=-1;for(o=0,s=x.length;o<s;++o)if(!x[o].equals(e))m=e.distanceTo(x[o]),m<y&&(y=m,p=o);else if(!a){y=0,p=o;break}0<=p&&(r={point:x[p],data:n.data[p],distance:y})}return r}function _(e,t,a,n,o){var s,r,y=n.children;if(null!==y){var d;for(s=0,r=y.length;s<r;++s)d=y[s],d.contains(e,t)&&_(e,t,a,d,o)}else if(null!==n.points){var u,c=n.points;for(s=0,r=c.length;s<r;++s)u=c[s],u.equals(e)?!a&&o.push({point:u.clone(),data:n.data[s]}):u.distanceToSquared(e)<=t*t&&o.push({point:u.clone(),data:n.data[s]})}}function j(e,t){var a,n=e.elements,i=t.elements;0!==n[1]&&(a=Lt.calculateCoefficients(n[0],n[1],n[3]),Ot.rotateQXY(Xt.set(n[0],n[3]),n[1],a),n[0]=Xt.x,n[3]=Xt.y,Ot.rotateXY(Xt.set(n[2],n[4]),a),n[2]=Xt.x,n[4]=Xt.y,n[1]=0,Ot.rotateXY(Xt.set(i[0],i[3]),a),i[0]=Xt.x,i[3]=Xt.y,Ot.rotateXY(Xt.set(i[1],i[4]),a),i[1]=Xt.x,i[4]=Xt.y,Ot.rotateXY(Xt.set(i[2],i[5]),a),i[2]=Xt.x,i[5]=Xt.y)}function U(e,t){var a,n=e.elements,i=t.elements;0!==n[2]&&(a=Lt.calculateCoefficients(n[0],n[2],n[5]),Ot.rotateQXY(Xt.set(n[0],n[5]),n[2],a),n[0]=Xt.x,n[5]=Xt.y,Ot.rotateXY(Xt.set(n[1],n[4]),a),n[1]=Xt.x,n[4]=Xt.y,n[2]=0,Ot.rotateXY(Xt.set(i[0],i[6]),a),i[0]=Xt.x,i[6]=Xt.y,Ot.rotateXY(Xt.set(i[1],i[7]),a),i[1]=Xt.x,i[7]=Xt.y,Ot.rotateXY(Xt.set(i[2],i[8]),a),i[2]=Xt.x,i[8]=Xt.y)}function Q(e,t){var a,n=e.elements,i=t.elements;0!==n[4]&&(a=Lt.calculateCoefficients(n[3],n[4],n[5]),Ot.rotateQXY(Xt.set(n[3],n[5]),n[4],a),n[3]=Xt.x,n[5]=Xt.y,Ot.rotateXY(Xt.set(n[1],n[2]),a),n[1]=Xt.x,n[2]=Xt.y,n[4]=0,Ot.rotateXY(Xt.set(i[3],i[6]),a),i[3]=Xt.x,i[6]=Xt.y,Ot.rotateXY(Xt.set(i[4],i[7]),a),i[4]=Xt.x,i[7]=Xt.y,Ot.rotateXY(Xt.set(i[5],i[8]),a),i[5]=Xt.x,i[8]=Xt.y)}function G(t,a){var n,l=t.elements;for(n=0;n<5;++n)j(t,a),U(t,a),Q(t,a);return Zt.set(l[0],l[3],l[5])}function H(e){var t=Te(e)<Mt?0:1/e;return Te(t)<Mt?0:t}function J(e,t){var a=e.elements,n=a[0],i=a[3],l=a[6],o=a[1],s=a[4],r=a[7],y=a[2],d=a[5],u=a[8],c=H(t.x),m=H(t.y),x=H(t.z);return e.set(n*c*n+i*m*i+l*x*l,n*c*o+i*m*s+l*x*r,n*c*y+i*m*d+l*x*u,o*c*n+s*m*i+r*x*l,o*c*o+s*m*s+r*x*r,o*c*y+s*m*d+r*x*u,y*c*n+d*m*i+u*x*l,y*c*o+d*m*s+u*x*r,y*c*y+d*m*d+u*x*u)}function K(e,t,a){return e.applyToVector3(jt.copy(a)),jt.subVectors(t,jt),jt.dot(jt)}function W(e,t,a){var n,l,o,s,r,y,d,u=[-1,-1,-1,-1],c=[!1,!1,!1,!1],m=1/0,x=0,p=!1;for(d=0;4>d;++d)r=e[d],y=la[t][d],n=nt[y][0],l=nt[y][1],o=1&r.voxel.materials>>n,s=1&r.voxel.materials>>l,r.size<m&&(m=r.size,x=d,p=o!==Dt.AIR),u[d]=r.voxel.index,c[d]=o!==s;c[x]&&(p?(a.push(u[0]),a.push(u[3]),a.push(u[1]),a.push(u[0]),a.push(u[2]),a.push(u[3])):(a.push(u[0]),a.push(u[1]),a.push(u[3]),a.push(u[0]),a.push(u[3]),a.push(u[2])))}function $(e,t,a){var n,l,o,s,r=[0,0,0,0];if(null!==e[0].voxel&&null!==e[1].voxel&&null!==e[2].voxel&&null!==e[3].voxel)W(e,t,a);else for(o=0;2>o;++o){for(r[0]=ia[t][o][0],r[1]=ia[t][o][1],r[2]=ia[t][o][2],r[3]=ia[t][o][3],n=[],s=0;4>s;++s)if(l=e[s],null!==l.voxel)n[s]=l;else if(null!==l.children)n[s]=l.children[r[s]];else break;4===s&&$(n,ia[t][o][4],a)}}function ee(e,t,a){var n,l,o,s,r,y,d=[0,0,0,0],u=[[0,0,1,1],[0,1,0,1]];if(null!==e[0].children||null!==e[1].children){for(r=0;4>r;++r)d[0]=aa[t][r][0],d[1]=aa[t][r][1],n=[null===e[0].children?e[0]:e[0].children[d[0]],null===e[1].children?e[1]:e[1].children[d[1]]],ee(n,aa[t][r][2],a);for(r=0;4>r;++r){for(d[0]=na[t][r][1],d[1]=na[t][r][2],d[2]=na[t][r][3],d[3]=na[t][r][4],o=u[na[t][r][0]],l=[],y=0;4>y;++y)if(s=e[o[y]],null!==s.voxel)l[y]=s;else if(null!==s.children)l[y]=s.children[d[y]];else break;4===y&&$(l,na[t][r][5],a)}}}function te(e,t){var a,n,l,o=e.children,s=[0,0,0,0];if(null!==o){for(l=0;8>l;++l)te(o[l],t);for(l=0;12>l;++l)s[0]=ea[l][0],s[1]=ea[l][1],a=[o[s[0]],o[s[1]]],ee(a,ea[l][2],t);for(l=0;6>l;++l)s[0]=ta[l][0],s[1]=ta[l][1],s[2]=ta[l][2],s[3]=ta[l][3],n=[o[s[0]],o[s[1]],o[s[2]],o[s[3]]],$(n,ta[l][4],t)}}function ae(e,t,a,n){var l,o;if(null!==e.children)for(l=0;8>l;++l)n=ae(e.children[l],t,a,n);else null!==e.voxel&&(o=e.voxel,o.index=n,t[3*n]=o.position.x,t[3*n+1]=o.position.y,t[3*n+2]=o.position.z,a[3*n]=o.normal.x,a[3*n+1]=o.normal.y,a[3*n+2]=o.normal.z,++n);return n}function ne(e,t,a,l,o){var s=0;for(t>>=1;0<t;t>>=1,s=0)a>=t&&(s+=4,a-=t),l>=t&&(s+=2,l-=t),o>=t&&(s+=1,o-=t),null===e.children&&e.split(),e=e.children[s];return e}function ie(e,t,a,n,l){var o,s,r,y,d,u,c,x,p,v,g=e+1,m=new Qt;for(o=0,v=0;8>v;++v)y=it[v],d=(n+y[2])*(g*g)+(a+y[1])*g+(t+y[0]),r=Pe(l[d],Dt.SOLID),o|=r<<v;for(s=0,v=0;12>v;++v)u=nt[v][0],c=nt[v][1],x=1&o>>u,p=1&o>>c,x!==p&&++s;return m.materials=o,m.edgeCount=s,m.qefData=new Bt,m}function le(e){var t=za,a=Vt.resolution,n=new Ee(0,0,0),i=new Ee(a,a,a),l=new v(fa,fa.clone().addScalar(za)),o=e.getBoundingBox();return e.type!==pa.INTERSECTION&&(o.intersectsBox(l)?(n.copy(o.min).max(l.min).sub(l.min),n.x=we(n.x*a/t),n.y=we(n.y*a/t),n.z=we(n.z*a/t),i.copy(o.max).min(l.max).sub(l.min),i.x=Se(i.x*a/t),i.y=Se(i.y*a/t),i.z=Se(i.z*a/t)):(n.set(a,a,a),i.set(0,0,0))),new v(n,i)}function oe(e,t,a,i){var l,o,s,r=Vt.resolution,n=r+1,d=i.max.x,u=i.max.y,c=i.max.z;for(s=i.min.z;s<=c;++s)for(o=i.min.y;o<=u;++o)for(l=i.min.x;l<=d;++l)e.updateMaterialIndex(s*(n*n)+o*n+l,t,a)}function se(e,t,a){var i,l,o,r,d=za,s=Vt.resolution,n=s+1,u=t.materialIndices,c=new Ee,m=new Ee,p=a.max.x,v=a.max.y,g=a.max.z,k=0;for(r=a.min.z;r<=g;++r)for(c.z=r*d/s,o=a.min.y;o<=v;++o)for(c.y=o*d/s,l=a.min.x;l<=p;++l)c.x=l*d/s,i=e.generateMaterialIndex(m.addVectors(fa,c)),i!==Dt.AIR&&(u[r*(n*n)+o*n+l]=i,++k);t.materials=k}function re(e,t,a){var l,o,s,r,y,u,x,p,v,g,k,h,z,f,S,w,T,I,C,P,b,E,D,F=Vt.resolution,n=F+1,m=new Uint32Array([1,n,n*n]),q=t.materialIndices,A=new Tt,V=new Tt,B=a.edgeData,N=t.edgeData,L=new Uint32Array(3),O=Et.calculate1DEdgeCount(F),M=new Et(F,Pe(O,N.indices[0].length+B.indices[0].length),Pe(O,N.indices[1].length+B.indices[1].length),Pe(O,N.indices[2].length+B.indices[2].length));for(I=0,C=0;3>C;I=0,++C){for(l=B.indices[C],r=N.indices[C],x=M.indices[C],o=B.zeroCrossings[C],y=N.zeroCrossings[C],p=M.zeroCrossings[C],s=B.normals[C],u=N.normals[C],v=M.normals[C],g=m[C],E=l.length,D=r.length,(P=0,b=0);P<E;++P)if(k=l[P],h=k+g,S=q[k],w=q[h],S!==w&&(S===Dt.AIR||w===Dt.AIR)){for(A.t=o[P],A.n.x=s[3*P],A.n.y=s[3*P+1],A.n.z=s[3*P+2],e.type===pa.DIFFERENCE&&A.n.negate(),T=A;b<D&&r[b]<=k;)z=r[b],f=z+g,V.t=y[b],V.n.x=u[3*b],V.n.y=u[3*b+1],V.n.z=u[3*b+2],S=q[z],z<k?(w=q[f],S!==w&&(S===Dt.AIR||w===Dt.AIR)&&(x[I]=z,p[I]=V.t,v[3*I]=V.n.x,v[3*I+1]=V.n.y,v[3*I+2]=V.n.z,++I)):T=e.selectEdge(V,A,S===Dt.SOLID),++b;x[I]=k,p[I]=T.t,v[3*I]=T.n.x,v[3*I+1]=T.n.y,v[3*I+2]=T.n.z,++I}for(;b<D;)z=r[b],f=z+g,S=q[z],w=q[f],S!==w&&(S===Dt.AIR||w===Dt.AIR)&&(x[I]=z,p[I]=y[b],v[3*I]=u[3*b],v[3*I+1]=u[3*b+1],v[3*I+2]=u[3*b+2],++I),++b;L[C]=I}return{edgeData:M,lengths:L}}function ye(e,t,i){var l,o,r,u,p,v,g,k,h,f,S,w,T,I,C,P,b,E,D,F=za,s=Vt.resolution,n=s+1,m=n*n,q=new Uint32Array([1,n,m]),A=t.materialIndices,V=fa,B=new Ee,N=new Ee,L=new Tt,O=new Uint32Array(3),M=new Et(s,Et.calculate1DEdgeCount(s));for(C=4,T=0,I=0;3>I;C>>=1,T=0,++I){P=it[C],l=M.indices[I],o=M.zeroCrossings[I],r=M.normals[I],u=q[I],g=i.min.x,f=i.max.x,k=i.min.y,S=i.max.y,h=i.min.z,w=i.max.z;for(0===I?(g=Ce(g-1,0),f=Pe(f,s-1)):1===I?(k=Ce(k-1,0),S=Pe(S,s-1)):2===I?(h=Ce(h-1,0),w=Pe(w,s-1)):void 0,D=h;D<=w;++D)for(E=k;E<=S;++E)for(b=g;b<=f;++b)p=D*m+E*n+b,v=p+u,A[p]!==A[v]&&(B.set(b*F/s,E*F/s,D*F/s),N.set((b+P[0])*F/s,(E+P[1])*F/s,(D+P[2])*F/s),L.a.addVectors(V,B),L.b.addVectors(V,N),e.generateEdge(L),l[T]=p,o[T]=L.t,r[3*T]=L.n.x,r[3*T+1]=L.n.y,r[3*T+2]=L.n.z,++T);O[I]=T}return{edgeData:M,lengths:O}}function de(e,t,a){var n,i,l,o,s=le(e),r=!1;if(e.type===pa.DENSITY_FUNCTION?se(e,t,s):t.empty?e.type===pa.UNION&&(t.set(a),r=!0):!(t.full&&e.type===pa.UNION)&&oe(e,t,a,s),!r&&!t.empty&&!t.full){for(n=e.type===pa.DENSITY_FUNCTION?ye(e,t,s):re(e,t,a),i=n.edgeData,l=n.lengths,o=0;3>o;++o)i.indices[o]=i.indices[o].slice(0,l[o]),i.zeroCrossings[o]=i.zeroCrossings[o].slice(0,l[o]),i.normals[o]=i.normals[o].slice(0,3*l[o]);t.edgeData=i}}function ue(e){var t,a,n,o,s=e.children;for(e.type===pa.DENSITY_FUNCTION&&(t=new Vt,de(e,t)),n=0,o=s.length;n<o&&(a=ue(s[n]),void 0===t?t=a:null===a?e.type===pa.INTERSECTION&&(t=null):null===t?e.type===pa.UNION&&(t=a):de(e,t,a),null!==t||e.type===pa.UNION);++n);return null!==t&&t.empty?null:t}function ce(e){var t=document.createElementNS(\"http://www.w3.org/1999/xhtml\",\"canvas\"),a=t.getContext(\"2d\");return t.width=e.width,t.height=e.height,a.drawImage(e,0,0),a.getImageData(0,0,e.width,e.height)}var be=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;e(this,t),this.runLengths=a,this.data=n}return n(t,null,[{key:\"encode\",value:function(e){var a,n,o=[],s=[],r=e[0],y=1;for(a=1,n=e.length;a<n;++a)r===e[a]?++y:(o.push(y),s.push(r),r=e[a],y=1);return o.push(y),s.push(r),new t(o,s)}},{key:\"decode\",value:function(e,t){var a,n,l,o,s,r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:[],y=0;for(n=0,o=t.length;n<o;++n)for(a=t[n],l=0,s=e[n];l<s;++l)r[y++]=a;return r}}]),t}(),Ee=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.x=a,this.y=n,this.z=i}return n(t,[{key:\"set\",value:function(e,t,a){return this.x=e,this.y=t,this.z=a,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}},{key:\"setFromSpherical\",value:function(e){this.setFromSphericalCoords(e.radius,e.phi,e.theta)}},{key:\"setFromSphericalCoords\",value:function(e,t,a){var n=fe(t)*e;return this.x=n*fe(a),this.y=ze(t)*e,this.z=n*ze(a),this}},{key:\"setFromCylindrical\",value:function(e){this.setFromCylindricalCoords(e.radius,e.theta,e.y)}},{key:\"setFromCylindricalCoords\",value:function(e,t,a){return this.x=e*fe(t),this.y=a,this.z=e*ze(t),this}},{key:\"setFromMatrixColumn\",value:function(e,t){return this.fromArray(e.elements,4*t)}},{key:\"setFromMatrixPosition\",value:function(e){var t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}},{key:\"setFromMatrixScale\",value:function(e){var t=this.setFromMatrixColumn(e,0).length(),a=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=a,this.z=n,this}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this.z+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this.z-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this.z*=e,this}},{key:\"multiplyVectors\",value:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this.z/=e,this}},{key:\"crossVectors\",value:function(e,t){var a=e.x,n=e.y,i=e.z,l=t.x,o=t.y,s=t.z;return this.x=n*s-i*o,this.y=i*l-a*s,this.z=a*o-n*l,this}},{key:\"cross\",value:function(e){return this.crossVectors(this,e)}},{key:\"transformDirection\",value:function(t){var a=this.x,n=this.y,i=this.z,l=t.elements;return this.x=l[0]*a+l[4]*n+l[8]*i,this.y=l[1]*a+l[5]*n+l[9]*i,this.z=l[2]*a+l[6]*n+l[10]*i,this.normalize()}},{key:\"applyMatrix3\",value:function(t){var a=this.x,n=this.y,i=this.z,l=t.elements;return this.x=l[0]*a+l[3]*n+l[6]*i,this.y=l[1]*a+l[4]*n+l[7]*i,this.z=l[2]*a+l[5]*n+l[8]*i,this}},{key:\"applyMatrix4\",value:function(t){var a=this.x,n=this.y,i=this.z,l=t.elements;return this.x=l[0]*a+l[4]*n+l[8]*i+l[12],this.y=l[1]*a+l[5]*n+l[9]*i+l[13],this.z=l[2]*a+l[6]*n+l[10]*i+l[14],this}},{key:\"applyQuaternion\",value:function(e){var t=this.x,a=this.y,n=this.z,i=e.x,l=e.y,o=e.z,s=e.w,r=s*t+l*n-o*a,y=s*a+o*t-i*n,d=s*n+i*a-l*t,u=-i*t-l*a-o*n;return this.x=r*s+u*-i+y*-o-d*-l,this.y=y*s+u*-l+d*-i-r*-o,this.z=d*s+u*-o+r*-l-y*-i,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z}},{key:\"reflect\",value:function(e){var t=e.x,a=e.y,n=e.z;return this.sub(e.multiplyScalar(2*this.dot(e))),e.set(t,a,n),this}},{key:\"angleTo\",value:function(e){var t=this.dot(e)/Ie(this.lengthSquared()*e.lengthSquared());return he(Pe(Ce(t,-1),1))}},{key:\"manhattanLength\",value:function(){return Te(this.x)+Te(this.y)+Te(this.z)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return Ie(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"manhattanDistanceTo\",value:function(e){return Te(this.x-e.x)+Te(this.y-e.y)+Te(this.z-e.z)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y,n=this.z-e.z;return t*t+a*a+n*n}},{key:\"distanceTo\",value:function(e){return Ie(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=Pe(this.x,e.x),this.y=Pe(this.y,e.y),this.z=Pe(this.z,e.z),this}},{key:\"max\",value:function(e){return this.x=Ce(this.x,e.x),this.y=Ce(this.y,e.y),this.z=Ce(this.z,e.z),this}},{key:\"clamp\",value:function(e,t){return this.x=Ce(e.x,Pe(t.x,this.x)),this.y=Ce(e.y,Pe(t.y,this.y)),this.z=Ce(e.z,Pe(t.z,this.z)),this}},{key:\"floor\",value:function(){return this.x=Se(this.x),this.y=Se(this.y),this.z=Se(this.z),this}},{key:\"ceil\",value:function(){return this.x=we(this.x),this.y=we(this.y),this.z=we(this.z),this}},{key:\"round\",value:function(){return this.x=ke(this.x),this.y=ke(this.y),this.z=ke(this.z),this}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}}]),t}(),De=new Ee,o=[new Ee,new Ee,new Ee,new Ee,new Ee,new Ee,new Ee,new Ee],v=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee(1/0,1/0,1/0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee(-Infinity,-Infinity,-Infinity);e(this,t),this.min=a,this.max=n}return n(t,[{key:\"set\",value:function(e,t){return this.min.copy(e),this.max.copy(t),this}},{key:\"copy\",value:function(e){return this.min.copy(e.min),this.max.copy(e.max),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-Infinity,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}},{key:\"setFromSphere\",value:function(e){return this.set(e.center,e.center),this.expandByScalar(e.radius),this}},{key:\"expandByPoint\",value:function(e){return this.min.min(e),this.max.max(e),this}},{key:\"expandByVector\",value:function(e){return this.min.sub(e),this.max.add(e),this}},{key:\"expandByScalar\",value:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this}},{key:\"setFromPoints\",value:function(e){var t,a;for(this.min.set(0,0,0),this.max.set(0,0,0),(t=0,a=e.length);t<a;++t)this.expandByPoint(e[t]);return this}},{key:\"setFromCenterAndSize\",value:function(e,t){var a=De.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(a),this.max.copy(e).add(a),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;return t.copy(e).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(e){var t=De.copy(e).clamp(this.min,this.max);return t.sub(e).length()}},{key:\"applyMatrix4\",value:function(e){var t=this.min,a=this.max;return this.isEmpty()||(o[0].set(t.x,t.y,t.z).applyMatrix4(e),o[1].set(t.x,t.y,a.z).applyMatrix4(e),o[2].set(t.x,a.y,t.z).applyMatrix4(e),o[3].set(t.x,a.y,a.z).applyMatrix4(e),o[4].set(a.x,t.y,t.z).applyMatrix4(e),o[5].set(a.x,t.y,a.z).applyMatrix4(e),o[6].set(a.x,a.y,t.z).applyMatrix4(e),o[7].set(a.x,a.y,a.z).applyMatrix4(e),this.setFromPoints(o)),this}},{key:\"translate\",value:function(e){return this.min.add(e),this.max.add(e),this}},{key:\"intersect\",value:function(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(e){return this.min.min(e.min),this.max.max(e.max),this}},{key:\"containsPoint\",value:function(e){var t=this.min,a=this.max;return e.x>=t.x&&e.y>=t.y&&e.z>=t.z&&e.x<=a.x&&e.y<=a.y&&e.z<=a.z}},{key:\"containsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,i=e.max;return t.x<=n.x&&i.x<=a.x&&t.y<=n.y&&i.y<=a.y&&t.z<=n.z&&i.z<=a.z}},{key:\"intersectsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,i=e.max;return i.x>=t.x&&i.y>=t.y&&i.z>=t.z&&n.x<=a.x&&n.y<=a.y&&n.z<=a.z}},{key:\"intersectsSphere\",value:function(e){var t=this.clampPoint(e.center,De);return t.distanceToSquared(e.center)<=e.radius*e.radius}},{key:\"intersectsPlane\",value:function(e){var t,a;return 0<e.normal.x?(t=e.normal.x*this.min.x,a=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,a=e.normal.x*this.min.x),0<e.normal.y?(t+=e.normal.y*this.min.y,a+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,a+=e.normal.y*this.min.y),0<e.normal.z?(t+=e.normal.z*this.min.z,a+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,a+=e.normal.z*this.min.z),t<=-e.constant&&a>=-e.constant}},{key:\"equals\",value:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}]),t}(),Fe=new v,qe=new Ee,Ae=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.center=a,this.radius=n}return n(t,[{key:\"set\",value:function(e,t){return this.center.copy(e),this.radius=t,this}},{key:\"copy\",value:function(e){return this.center.copy(e.center),this.radius=e.radius,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromPoints\",value:function(e){var t,a,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:Fe.setFromPoints(e).getCenter(this.center),o=0;for(t=0,a=e.length;t<a;++t)o=Ce(o,n.distanceToSquared(e[t]));return this.radius=Ie(o),this}},{key:\"setFromBox\",value:function(e){return e.getCenter(this.center),this.radius=.5*e.getSize(qe).length(),this}},{key:\"isEmpty\",value:function(){return 0>=this.radius}},{key:\"translate\",value:function(e){return this.center.add(e),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,a=this.center.distanceToSquared(e);return t.copy(e),a>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}},{key:\"distanceToPoint\",value:function(e){return e.distanceTo(this.center)-this.radius}},{key:\"containsPoint\",value:function(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}},{key:\"intersectsSphere\",value:function(e){var t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}},{key:\"intersectsBox\",value:function(e){return e.intersectsSphere(this)}},{key:\"intersectsPlane\",value:function(e){return Te(e.distanceToPoint(this.center))<=this.radius}},{key:\"equals\",value:function(e){return e.center.equals(this.center)&&e.radius===this.radius}}]),t}(),Ve=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.x=a,this.y=n}return n(t,[{key:\"set\",value:function(e,t){return this.x=e,this.y=t,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this}},{key:\"applyMatrix3\",value:function(t){var a=this.x,n=this.y,i=t.elements;return this.x=i[0]*a+i[3]*n+i[6],this.y=i[1]*a+i[4]*n+i[7],this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y}},{key:\"cross\",value:function(e){return this.x*e.y-this.y*e.x}},{key:\"manhattanLength\",value:function(){return Te(this.x)+Te(this.y)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y}},{key:\"length\",value:function(){return Ie(this.x*this.x+this.y*this.y)}},{key:\"manhattanDistanceTo\",value:function(e){return Te(this.x-e.x)+Te(this.y-e.y)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y;return t*t+a*a}},{key:\"distanceTo\",value:function(e){return Ie(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=Pe(this.x,e.x),this.y=Pe(this.y,e.y),this}},{key:\"max\",value:function(e){return this.x=Ce(this.x,e.x),this.y=Ce(this.y,e.y),this}},{key:\"clamp\",value:function(e,t){return this.x=Ce(e.x,Pe(t.x,this.x)),this.y=Ce(e.y,Pe(t.y,this.y)),this}},{key:\"floor\",value:function(){return this.x=Se(this.x),this.y=Se(this.y),this}},{key:\"ceil\",value:function(){return this.x=we(this.x),this.y=we(this.y),this}},{key:\"round\",value:function(){return this.x=ke(this.x),this.y=ke(this.y),this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this}},{key:\"angle\",value:function e(){var e=ge(this.y,this.x);return 0>e&&(e+=2*ve),e}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"rotateAround\",value:function(e,t){var a=ze(t),n=fe(t),i=this.x-e.x,l=this.y-e.y;return this.x=i*a-l*n+e.x,this.y=i*n+l*a+e.y,this}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y}},{key:\"width\",get:function(){return this.x},set:function(e){return this.x=e}},{key:\"height\",get:function(){return this.y},set:function(e){return this.y=e}}]),t}(),Be=new Ve,Ne=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ve(1/0,1/0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ve(-Infinity,-Infinity);e(this,t),this.min=a,this.max=n}return n(t,[{key:\"set\",value:function(e,t){return this.min.copy(e),this.max.copy(t),this}},{key:\"copy\",value:function(e){return this.min.copy(e.min),this.max.copy(e.max),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-Infinity,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ve;return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ve;return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}},{key:\"getBoundingSphere\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ae;return this.getCenter(e.center),e.radius=.5*this.getSize(Be).length(),e}},{key:\"expandByPoint\",value:function(e){return this.min.min(e),this.max.max(e),this}},{key:\"expandByVector\",value:function(e){return this.min.sub(e),this.max.add(e),this}},{key:\"expandByScalar\",value:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this}},{key:\"setFromPoints\",value:function(e){var t,a;for(this.min.set(0,0),this.max.set(0,0),(t=0,a=e.length);t<a;++t)this.expandByPoint(e[t]);return this}},{key:\"setFromCenterAndSize\",value:function(e,t){var a=Be.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(a),this.max.copy(e).add(a),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ve;return t.copy(e).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(e){var t=Be.copy(e).clamp(this.min,this.max);return t.sub(e).length()}},{key:\"translate\",value:function(e){return this.min.add(e),this.max.add(e),this}},{key:\"intersect\",value:function(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(e){return this.min.min(e.min),this.max.max(e.max),this}},{key:\"containsPoint\",value:function(e){var t=this.min,a=this.max;return e.x>=t.x&&e.y>=t.y&&e.x<=a.x&&e.y<=a.y}},{key:\"containsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,i=e.max;return t.x<=n.x&&i.x<=a.x&&t.y<=n.y&&i.y<=a.y}},{key:\"intersectsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,i=e.max;return i.x>=t.x&&i.y>=t.y&&n.x<=a.x&&n.y<=a.y}},{key:\"equals\",value:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}]),t}(),Le=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.radius=a,this.theta=n,this.y=i}return n(t,[{key:\"set\",value:function(e,t,a){return this.radius=e,this.theta=t,this.y=a,this}},{key:\"copy\",value:function(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromVector3\",value:function(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}},{key:\"setFromCartesianCoords\",value:function(e,t,a){return this.radius=Ie(e*e+a*a),this.theta=ge(e,a),this.y=t,this}}]),t}(),Oe=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,0,1,0,0,0,1])}return n(t,[{key:\"set\",value:function(e,t,a,n,i,l,o,s,r){var y=this.elements;return y[0]=e,y[3]=t,y[6]=a,y[1]=n,y[4]=i,y[7]=l,y[2]=o,y[5]=s,y[8]=r,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,1,0,0,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements,a=this.elements;return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],this}},{key:\"clone\",value:function(){return new this.constructor().fromArray(this.elements)}},{key:\"fromArray\",value:function(e){var t,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(t=0;9>t;++t)n[t]=e[t+a];return this}},{key:\"toArray\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(e=0;9>e;++e)t[e+a]=n[e];return t}},{key:\"multiplyMatrices\",value:function(e,t){var a=e.elements,n=t.elements,i=this.elements,l=a[0],o=a[3],s=a[6],r=a[1],y=a[4],d=a[7],u=a[2],c=a[5],m=a[8],x=n[0],p=n[3],v=n[6],g=n[1],k=n[4],h=n[7],z=n[2],f=n[5],S=n[8];return i[0]=l*x+o*g+s*z,i[3]=l*p+o*k+s*f,i[6]=l*v+o*h+s*S,i[1]=r*x+y*g+d*z,i[4]=r*p+y*k+d*f,i[7]=r*v+y*h+d*S,i[2]=u*x+c*g+m*z,i[5]=u*p+c*k+m*f,i[8]=u*v+c*h+m*S,this}},{key:\"multiply\",value:function(e){return this.multiplyMatrices(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyMatrices(e,this)}},{key:\"multiplyScalar\",value:function(e){var t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}},{key:\"determinant\",value:function(){var t=this.elements,n=t[0],a=t[1],l=t[2],o=t[3],s=t[4],e=t[5],r=t[6],y=t[7],d=t[8];return n*s*d-n*e*y-a*o*d+a*e*r+l*o*y-l*s*r}},{key:\"getInverse\",value:function(e){var t,a=e.elements,n=this.elements,i=a[0],l=a[1],o=a[2],s=a[3],r=a[4],y=a[5],d=a[6],u=a[7],c=a[8],m=c*r-y*u,x=y*d-c*s,p=u*s-r*d,v=i*m+l*x+o*p;return 0===v?(console.error(\"Can't invert matrix, determinant is zero\",e),this.identity()):(t=1/v,n[0]=m*t,n[1]=(o*u-c*l)*t,n[2]=(y*l-o*r)*t,n[3]=x*t,n[4]=(c*i-o*d)*t,n[5]=(o*s-y*i)*t,n[6]=p*t,n[7]=(l*d-u*i)*t,n[8]=(r*i-l*s)*t),this}},{key:\"transpose\",value:function(){var e,a=this.elements;return e=a[1],a[1]=a[3],a[3]=e,e=a[2],a[2]=a[6],a[6]=e,e=a[5],a[5]=a[7],a[7]=e,this}},{key:\"scale\",value:function(e,t){var a=this.elements;return a[0]*=e,a[3]*=e,a[6]*=e,a[1]*=t,a[4]*=t,a[7]*=t,this}},{key:\"rotate\",value:function(e){var t=ze(e),a=fe(e),n=this.elements,i=n[0],l=n[3],o=n[6],s=n[1],r=n[4],y=n[7];return n[0]=t*i+a*s,n[3]=t*l+a*r,n[6]=t*o+a*y,n[1]=-a*i+t*s,n[4]=-a*l+t*r,n[7]=-a*o+t*y,this}},{key:\"translate\",value:function(e,t){var a=this.elements;return a[0]+=e*a[2],a[3]+=e*a[5],a[6]+=e*a[8],a[1]+=t*a[2],a[4]+=t*a[5],a[7]+=t*a[8],this}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&9>t;++t)a[t]!==n[t]&&(l=!1);return l}}]),t}(),Me={XYZ:\"XYZ\",YZX:\"YZX\",ZXY:\"ZXY\",XZY:\"XZY\",YXZ:\"YXZ\",ZYX:\"ZYX\"},Re=function(){var a=Number.EPSILON;function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;e(this,t),this.x=a,this.y=n,this.z=i,this.w=l}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.w=n,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}},{key:\"setFromEuler\",value:function(e){var t=e.x,a=e.y,n=e.z,i=ze,l=fe,o=i(t/2),s=i(a/2),r=i(n/2),y=l(t/2),d=l(a/2),u=l(n/2);switch(e.order){case Me.XYZ:this.x=y*s*r+o*d*u,this.y=o*d*r-y*s*u,this.z=o*s*u+y*d*r,this.w=o*s*r-y*d*u;break;case Me.YXZ:this.x=y*s*r+o*d*u,this.y=o*d*r-y*s*u,this.z=o*s*u-y*d*r,this.w=o*s*r+y*d*u;break;case Me.ZXY:this.x=y*s*r-o*d*u,this.y=o*d*r+y*s*u,this.z=o*s*u+y*d*r,this.w=o*s*r-y*d*u;break;case Me.ZYX:this.x=y*s*r-o*d*u,this.y=o*d*r+y*s*u,this.z=o*s*u-y*d*r,this.w=o*s*r+y*d*u;break;case Me.YZX:this.x=y*s*r+o*d*u,this.y=o*d*r+y*s*u,this.z=o*s*u-y*d*r,this.w=o*s*r-y*d*u;break;case Me.XZY:this.x=y*s*r-o*d*u,this.y=o*d*r-y*s*u,this.z=o*s*u+y*d*r,this.w=o*s*r+y*d*u;}return this}},{key:\"setFromAxisAngle\",value:function(e,t){var a=t/2,n=fe(a);return this.x=e.x*n,this.y=e.y*n,this.z=e.z*n,this.w=ze(a),this}},{key:\"setFromRotationMatrix\",value:function(e){var t,a=e.elements,n=a[0],i=a[4],l=a[8],o=a[1],r=a[5],y=a[9],d=a[2],u=a[6],c=a[10],m=n+r+c;return 0<m?(t=.5/Ie(m+1),this.w=.25/t,this.x=(u-y)*t,this.y=(l-d)*t,this.z=(o-i)*t):n>r&&n>c?(t=2*Ie(1+n-r-c),this.w=(u-y)/t,this.x=.25*t,this.y=(i+o)/t,this.z=(l+d)/t):r>c?(t=2*Ie(1+r-n-c),this.w=(l-d)/t,this.x=(i+o)/t,this.y=.25*t,this.z=(y+u)/t):(t=2*Ie(1+c-n-r),this.w=(o-i)/t,this.x=(l+d)/t,this.y=(y+u)/t,this.z=.25*t),this}},{key:\"setFromUnitVectors\",value:function(e,t){var a=e.dot(t)+1;return 1e-6>a?(a=0,Te(e.x)>Te(e.z)?(this.x=-e.y,this.y=e.x,this.z=0,this.w=a):(this.x=0,this.y=-e.z,this.z=e.y,this.w=a)):(this.x=e.y*t.z-e.z*t.y,this.y=e.z*t.x-e.x*t.z,this.z=e.x*t.y-e.y*t.x,this.w=a),this.normalize()}},{key:\"angleTo\",value:function(e){return 2*he(Te(Pe(Ce(this.dot(e),-1),1)))}},{key:\"rotateTowards\",value:function(e,t){var a=this.angleTo(e);return 0!==a&&this.slerp(e,Pe(1,t/a)),this}},{key:\"invert\",value:function(){return this.conjugate()}},{key:\"conjugate\",value:function(){return this.x*=-1,this.y*=-1,this.z*=-1,this}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return Ie(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"normalize\",value:function(){var e,t=this.length();return 0===t?(this.x=0,this.y=0,this.z=0,this.w=1):(e=1/t,this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}},{key:\"multiplyQuaternions\",value:function(e,t){var a=e.x,n=e.y,i=e.z,l=e.w,o=t.x,s=t.y,r=t.z,y=t.w;return this.x=a*y+l*o+n*r-i*s,this.y=n*y+l*s+i*o-a*r,this.z=i*y+l*r+a*s-n*o,this.w=l*y-a*o-n*s-i*r,this}},{key:\"multiply\",value:function(e){return this.multiplyQuaternions(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyQuaternions(e,this)}},{key:\"slerp\",value:function(e,n){var t,i,l,o,r,d,u,c=this.x,m=this.y,y=this.z,x=this.w;return 1===n?this.copy(e):0<n&&(t=x*e.w+c*e.x+m*e.y+y*e.z,0>t?(this.w=-e.w,this.x=-e.x,this.y=-e.y,this.z=-e.z,t=-t):this.copy(e),1<=t?(this.w=x,this.x=c,this.y=m,this.z=y):(i=1-t*t,r=1-n,i<=a?(this.w=r*x+n*this.w,this.x=r*c+n*this.x,this.y=r*m+n*this.y,this.z=r*y+n*this.z,this.normalize()):(l=Ie(i),o=ge(l,t),d=fe(r*o)/l,u=fe(n*o)/l,this.w=x*d+this.w*u,this.x=c*d+this.x*u,this.y=m*d+this.y*u,this.z=y*d+this.z*u))),this}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}}],[{key:\"slerp\",value:function(e,a,n,i){return n.copy(e).slerp(a,i)}},{key:\"slerpFlat\",value:function(e,n,i,l,o,r,y){var d,u,c,m,x,p,v,g,k=o[r],h=o[r+1],z=o[r+2],S=o[r+3],w=i[l],T=i[l+1],I=i[l+2],C=i[l+3];(C!==S||w!==k||T!==h||I!==z)&&(d=1-y,m=w*k+T*h+I*z+C*S,p=0<=m?1:-1,x=1-m*m,x>a&&(c=Ie(x),v=ge(c,m*p),d=fe(d*v)/c,y=fe(y*v)/c),g=y*p,w=w*d+k*g,T=T*d+h*g,I=I*d+z*g,C=C*d+S*g,d===1-y&&(u=1/Ie(w*w+T*T+I*I+C*C),w*=u,T*=u,I*=u,C*=u)),e[n]=w,e[n+1]=T,e[n+2]=I,e[n+3]=C}}]),t}(),Ye=new Oe,m=new Re,q=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.x=a,this.y=n,this.z=i,this.order=t.defaultOrder}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.order=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.order=t.order,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.order)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.order=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.order,e}},{key:\"toVector3\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return e.set(this.x,this.y,this.z)}},{key:\"setFromRotationMatrix\",value:function(e){var t=Math.asin,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.order,n=e.elements,i=n[0],l=n[4],o=n[8],s=n[1],r=n[5],y=n[9],d=n[2],u=n[6],c=n[10],m=1-1e-5;switch(a){case Me.XYZ:{this.y=t(P(o,-1,1)),Te(o)<m?(this.x=ge(-y,c),this.z=ge(-l,i)):(this.x=ge(u,r),this.z=0);break}case Me.YXZ:{this.x=t(-P(y,-1,1)),Te(y)<m?(this.y=ge(o,c),this.z=ge(s,r)):(this.y=ge(-d,i),this.z=0);break}case Me.ZXY:{this.x=t(P(u,-1,1)),Te(u)<m?(this.y=ge(-d,c),this.z=ge(-l,r)):(this.y=0,this.z=ge(s,i));break}case Me.ZYX:{this.y=t(-P(d,-1,1)),Te(d)<m?(this.x=ge(u,c),this.z=ge(s,i)):(this.x=0,this.z=ge(-l,r));break}case Me.YZX:{this.z=t(P(s,-1,1)),Te(s)<m?(this.x=ge(-y,r),this.y=ge(-d,i)):(this.x=0,this.y=ge(o,c));break}case Me.XZY:{this.z=t(-P(l,-1,1)),Te(l)<m?(this.x=ge(u,r),this.y=ge(o,i)):(this.x=ge(-y,c),this.y=0);break}}return this.order=a,this}},{key:\"setFromQuaternion\",value:function(e,t){return Ye.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ye,t)}},{key:\"setFromVector3\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.order;return this.set(e.x,e.y,e.z,t)}},{key:\"reorder\",value:function(e){return m.setFromEuler(this),this.setFromQuaternion(m,e)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.order===this.order}}],[{key:\"defaultOrder\",get:function(){return Me.XYZ}}]),t}(),Xe=new Ee,a=new Ee,b=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee(1,0,0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.normal=a,this.constant=n}return n(t,[{key:\"set\",value:function(e,t){return this.normal.copy(e),this.constant=t,this}},{key:\"setComponents\",value:function(e,t,a,n){return this.normal.set(e,t,a),this.constant=n,this}},{key:\"copy\",value:function(e){return this.normal.copy(e.normal),this.constant=e.constant,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromNormalAndCoplanarPoint\",value:function(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}},{key:\"setFromCoplanarPoints\",value:function(e,t,n){var i=Xe.subVectors(n,t).cross(a.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,Xe),this}},{key:\"normalize\",value:function(){var e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}},{key:\"negate\",value:function(){return this.normal.negate(),this.constant=-this.constant,this}},{key:\"distanceToPoint\",value:function(e){return this.normal.dot(e)+this.constant}},{key:\"distanceToSphere\",value:function(e){return this.distanceToPoint(e.center)-e.radius}},{key:\"projectPoint\",value:function(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}},{key:\"coplanarPoint\",value:function(e){return e.copy(this.normal).multiplyScalar(-this.constant)}},{key:\"translate\",value:function(e){return this.constant-=e.dot(this.normal),this}},{key:\"intersectLine\",value:function(e,a){var n=e.delta(Xe),i=this.normal.dot(n);if(0===i)0===this.distanceToPoint(e.start)&&a.copy(e.start);else{var l=-(e.start.dot(this.normal)+this.constant)/i;0<=l&&1>=l&&a.copy(n).multiplyScalar(l).add(e.start)}return a}},{key:\"intersectsLine\",value:function(e){var t=this.distanceToPoint(e.start),a=this.distanceToPoint(e.end);return 0>t&&0<a||0>a&&0<t}},{key:\"intersectsBox\",value:function(e){return e.intersectsPlane(this)}},{key:\"intersectsSphere\",value:function(e){return e.intersectsPlane(this)}},{key:\"equals\",value:function(e){return e.normal.equals(this.normal)&&e.constant===this.constant}}]),t}(),Ze=new Ee,_e=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new b,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new b,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:new b,l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:new b,o=4<arguments.length&&void 0!==arguments[4]?arguments[4]:new b,s=5<arguments.length&&void 0!==arguments[5]?arguments[5]:new b;e(this,t),this.planes=[a,n,i,l,o,s]}return n(t,[{key:\"set\",value:function(e,t,a,n,i,l){var o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(a),o[3].copy(n),o[4].copy(i),o[5].copy(l),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"copy\",value:function(e){var t,a=this.planes;for(t=0;6>t;++t)a[t].copy(e.planes[t]);return this}},{key:\"setFromMatrix\",value:function(e){var t=this.planes,a=e.elements,n=a[0],i=a[1],l=a[2],o=a[3],s=a[4],r=a[5],y=a[6],d=a[7],u=a[8],c=a[9],m=a[10],x=a[11],p=a[12],v=a[13],g=a[14],k=a[15];return t[0].setComponents(o-n,d-s,x-u,k-p).normalize(),t[1].setComponents(o+n,d+s,x+u,k+p).normalize(),t[2].setComponents(o+i,d+r,x+c,k+v).normalize(),t[3].setComponents(o-i,d-r,x-c,k-v).normalize(),t[4].setComponents(o-l,d-y,x-m,k-g).normalize(),t[5].setComponents(o+l,d+y,x+m,k+g).normalize(),this}},{key:\"intersectsSphere\",value:function(e){var t,a,n=this.planes,l=e.center,o=-e.radius,s=!0;for(t=0;6>t;++t)if(a=n[t].distanceToPoint(l),a<o){s=!1;break}return s}},{key:\"intersectsBox\",value:function(e){var t,a,n=this.planes,l=e.min,o=e.max;for(t=0;6>t;++t)if(a=n[t],Ze.x=0<a.normal.x?o.x:l.x,Ze.y=0<a.normal.y?o.y:l.y,Ze.z=0<a.normal.z?o.z:l.z,0>a.distanceToPoint(Ze))return!1;return!0}},{key:\"containsPoint\",value:function(e){var t,a=this.planes,n=!0;for(t=0;6>t;++t)if(0>a[t].distanceToPoint(e)){n=!1;break}return n}}]),t}(),je=new Ee,Ue=new Ee,Qe=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;e(this,t),this.start=a,this.end=n}return n(t,[{key:\"set\",value:function(e,t){return this.start.copy(e),this.end.copy(t),this}},{key:\"copy\",value:function(e){return this.start.copy(e.start),this.end.copy(e.end),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return e.addVectors(this.start,this.end).multiplyScalar(.5)}},{key:\"delta\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return e.subVectors(this.end,this.start)}},{key:\"lengthSquared\",value:function(){return this.start.distanceToSquared(this.end)}},{key:\"length\",value:function(){return this.start.distanceTo(this.end)}},{key:\"at\",value:function(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}},{key:\"closestPointToPointParameter\",value:function(e,a){je.subVectors(e,this.start),Ue.subVectors(this.end,this.start);var n=Ue.dot(Ue),i=Ue.dot(je),l=a?Pe(Ce(i/n,0),1):i/n;return l}},{key:\"closestPointToPoint\",value:function(e){var a=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:new Ee,i=this.closestPointToPointParameter(e,a);return this.delta(n).multiplyScalar(i).add(this.start)}},{key:\"equals\",value:function(e){return e.start.equals(this.start)&&e.end.equals(this.end)}}]),t}(),Ge=new Ee,He=new Ee,Je=new Ee,c=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return n(t,[{key:\"set\",value:function(e,t,a,n,i,l,o,s,r,y,d,u,c,m,x,p){var v=this.elements;return v[0]=e,v[4]=t,v[8]=a,v[12]=n,v[1]=i,v[5]=l,v[9]=o,v[13]=s,v[2]=r,v[6]=y,v[10]=d,v[14]=u,v[3]=c,v[7]=m,v[11]=x,v[15]=p,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements,a=this.elements;return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],a[9]=t[9],a[10]=t[10],a[11]=t[11],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15],this}},{key:\"clone\",value:function(){return new this.constructor().fromArray(this.elements)}},{key:\"fromArray\",value:function(e){var t,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(t=0;16>t;++t)n[t]=e[t+a];return this}},{key:\"toArray\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(e=0;16>e;++e)t[e+a]=n[e];return t}},{key:\"getMaxScaleOnAxis\",value:function(){var e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],a=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Ie(Ce(t,a,n))}},{key:\"copyPosition\",value:function(e){var t=this.elements,a=e.elements;return t[12]=a[12],t[13]=a[13],t[14]=a[14],this}},{key:\"setPosition\",value:function(e){var t=this.elements;return t[12]=e.x,t[13]=e.y,t[14]=e.z,this}},{key:\"extractBasis\",value:function(e,t,a){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),a.setFromMatrixColumn(this,2),this}},{key:\"makeBasis\",value:function(e,t,a){return this.set(e.x,t.x,a.x,0,e.y,t.y,a.y,0,e.z,t.z,a.z,0,0,0,0,1),this}},{key:\"extractRotation\",value:function(e){var t=this.elements,a=e.elements,n=1/Ge.setFromMatrixColumn(e,0).length(),i=1/Ge.setFromMatrixColumn(e,1).length(),l=1/Ge.setFromMatrixColumn(e,2).length();return t[0]=a[0]*n,t[1]=a[1]*n,t[2]=a[2]*n,t[3]=0,t[4]=a[4]*i,t[5]=a[5]*i,t[6]=a[6]*i,t[7]=0,t[8]=a[8]*l,t[9]=a[9]*l,t[10]=a[10]*l,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}},{key:\"makeRotationFromEuler\",value:function(t){var n,i,l,o,s,r,u,m,p,v,g,k,h=this.elements,S=t.x,x=t.y,y=t.z,z=ze(S),a=fe(S),w=ze(x),c=fe(x),d=ze(y),e=fe(y);switch(t.order){case Me.XYZ:{n=z*d,i=z*e,l=a*d,o=a*e,h[0]=w*d,h[4]=-w*e,h[8]=c,h[1]=i+l*c,h[5]=n-o*c,h[9]=-a*w,h[2]=o-n*c,h[6]=l+i*c,h[10]=z*w;break}case Me.YXZ:{s=w*d,r=w*e,u=c*d,m=c*e,h[0]=s+m*a,h[4]=u*a-r,h[8]=z*c,h[1]=z*e,h[5]=z*d,h[9]=-a,h[2]=r*a-u,h[6]=m+s*a,h[10]=z*w;break}case Me.ZXY:{s=w*d,r=w*e,u=c*d,m=c*e,h[0]=s-m*a,h[4]=-z*e,h[8]=u+r*a,h[1]=r+u*a,h[5]=z*d,h[9]=m-s*a,h[2]=-z*c,h[6]=a,h[10]=z*w;break}case Me.ZYX:{n=z*d,i=z*e,l=a*d,o=a*e,h[0]=w*d,h[4]=l*c-i,h[8]=n*c+o,h[1]=w*e,h[5]=o*c+n,h[9]=i*c-l,h[2]=-c,h[6]=a*w,h[10]=z*w;break}case Me.YZX:{p=z*w,v=z*c,g=a*w,k=a*c,h[0]=w*d,h[4]=k-p*e,h[8]=g*e+v,h[1]=e,h[5]=z*d,h[9]=-a*d,h[2]=-c*d,h[6]=v*e+g,h[10]=p-k*e;break}case Me.XZY:{p=z*w,v=z*c,g=a*w,k=a*c,h[0]=w*d,h[4]=-e,h[8]=c*d,h[1]=p*e+k,h[5]=z*d,h[9]=v*e-g,h[2]=g*e-v,h[6]=a*d,h[10]=k*e+p;break}}return h[3]=0,h[7]=0,h[11]=0,h[12]=0,h[13]=0,h[14]=0,h[15]=1,this}},{key:\"makeRotationFromQuaternion\",value:function(e){return this.compose(Ge.set(0,0,0),e,He.set(1,1,1))}},{key:\"lookAt\",value:function(e,t,a){var n=this.elements,i=Ge,l=He,o=Je;return o.subVectors(e,t),0===o.lengthSquared()&&(o.z=1),o.normalize(),i.crossVectors(a,o),0===i.lengthSquared()&&(1===Te(a.z)?o.x+=1e-4:o.z+=1e-4,o.normalize(),i.crossVectors(a,o)),i.normalize(),l.crossVectors(o,i),n[0]=i.x,n[4]=l.x,n[8]=o.x,n[1]=i.y,n[5]=l.y,n[9]=o.y,n[2]=i.z,n[6]=l.z,n[10]=o.z,this}},{key:\"multiplyMatrices\",value:function(e,t){var a=this.elements,n=e.elements,i=t.elements,l=n[0],o=n[4],s=n[8],r=n[12],y=n[1],d=n[5],u=n[9],c=n[13],m=n[2],x=n[6],p=n[10],v=n[14],g=n[3],k=n[7],h=n[11],z=n[15],f=i[0],S=i[4],w=i[8],T=i[12],I=i[1],C=i[5],P=i[9],b=i[13],E=i[2],D=i[6],F=i[10],q=i[14],A=i[3],V=i[7],B=i[11],N=i[15];return a[0]=l*f+o*I+s*E+r*A,a[4]=l*S+o*C+s*D+r*V,a[8]=l*w+o*P+s*F+r*B,a[12]=l*T+o*b+s*q+r*N,a[1]=y*f+d*I+u*E+c*A,a[5]=y*S+d*C+u*D+c*V,a[9]=y*w+d*P+u*F+c*B,a[13]=y*T+d*b+u*q+c*N,a[2]=m*f+x*I+p*E+v*A,a[6]=m*S+x*C+p*D+v*V,a[10]=m*w+x*P+p*F+v*B,a[14]=m*T+x*b+p*q+v*N,a[3]=g*f+k*I+h*E+z*A,a[7]=g*S+k*C+h*D+z*V,a[11]=g*w+k*P+h*F+z*B,a[15]=g*T+k*b+h*q+z*N,this}},{key:\"multiply\",value:function(e){return this.multiplyMatrices(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyMatrices(e,this)}},{key:\"multiplyScalar\",value:function(e){var t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}},{key:\"determinant\",value:function(){var e=this.elements,t=e[0],a=e[4],n=e[8],i=e[12],l=e[1],o=e[5],s=e[9],r=e[13],y=e[2],d=e[6],u=e[10],c=e[14],m=e[3],x=e[7],p=e[11],v=e[15],g=t*o,k=t*s,h=t*r,z=a*l,f=a*s,S=a*r,w=n*l,T=n*o,I=n*r,C=i*l,P=i*o,b=i*s;return m*(b*d-I*d-P*u+S*u+T*c-f*c)+x*(k*c-h*u+C*u-w*c+I*y-b*y)+p*(h*d-g*c-C*d+z*c+P*y-S*y)+v*(-T*y-k*d+g*u+w*d-z*u+f*y)}},{key:\"getInverse\",value:function(e){var t,a=this.elements,n=e.elements,i=n[0],l=n[1],o=n[2],s=n[3],r=n[4],y=n[5],d=n[6],u=n[7],c=n[8],m=n[9],x=n[10],p=n[11],v=n[12],g=n[13],k=n[14],h=n[15],z=m*k*u-g*x*u+g*d*p-y*k*p-m*d*h+y*x*h,f=v*x*u-c*k*u-v*d*p+r*k*p+c*d*h-r*x*h,S=c*g*u-v*m*u+v*y*p-r*g*p-c*y*h+r*m*h,w=v*m*d-c*g*d-v*y*x+r*g*x+c*y*k-r*m*k,T=i*z+l*f+o*S+s*w;return 0===T?(console.error(\"Can't invert matrix, determinant is zero\",e),this.identity()):(t=1/T,a[0]=z*t,a[1]=(g*x*s-m*k*s-g*o*p+l*k*p+m*o*h-l*x*h)*t,a[2]=(y*k*s-g*d*s+g*o*u-l*k*u-y*o*h+l*d*h)*t,a[3]=(m*d*s-y*x*s-m*o*u+l*x*u+y*o*p-l*d*p)*t,a[4]=f*t,a[5]=(c*k*s-v*x*s+v*o*p-i*k*p-c*o*h+i*x*h)*t,a[6]=(v*d*s-r*k*s-v*o*u+i*k*u+r*o*h-i*d*h)*t,a[7]=(r*x*s-c*d*s+c*o*u-i*x*u-r*o*p+i*d*p)*t,a[8]=S*t,a[9]=(v*m*s-c*g*s-v*l*p+i*g*p+c*l*h-i*m*h)*t,a[10]=(r*g*s-v*y*s+v*l*u-i*g*u-r*l*h+i*y*h)*t,a[11]=(c*y*s-r*m*s-c*l*u+i*m*u+r*l*p-i*y*p)*t,a[12]=w*t,a[13]=(c*g*o-v*m*o+v*l*x-i*g*x-c*l*k+i*m*k)*t,a[14]=(v*y*o-r*g*o-v*l*d+i*g*d+r*l*k-i*y*k)*t,a[15]=(r*m*o-c*y*o+c*l*d-i*m*d-r*l*x+i*y*x)*t),this}},{key:\"transpose\",value:function(){var e,a=this.elements;return e=a[1],a[1]=a[4],a[4]=e,e=a[2],a[2]=a[8],a[8]=e,e=a[6],a[6]=a[9],a[9]=e,e=a[3],a[3]=a[12],a[12]=e,e=a[7],a[7]=a[13],a[13]=e,e=a[11],a[11]=a[14],a[14]=e,this}},{key:\"scale\",value:function(e,t,a){var n=this.elements;return n[0]*=e,n[4]*=t,n[8]*=a,n[1]*=e,n[5]*=t,n[9]*=a,n[2]*=e,n[6]*=t,n[10]*=a,n[3]*=e,n[7]*=t,n[11]*=a,this}},{key:\"makeScale\",value:function(e,t,a){return this.set(e,0,0,0,0,t,0,0,0,0,a,0,0,0,0,1),this}},{key:\"makeTranslation\",value:function(e,t,a){return this.set(1,0,0,e,0,1,0,t,0,0,1,a,0,0,0,1),this}},{key:\"makeRotationX\",value:function(e){var t=ze(e),a=fe(e);return this.set(1,0,0,0,0,t,-a,0,0,a,t,0,0,0,0,1),this}},{key:\"makeRotationY\",value:function(e){var t=ze(e),a=fe(e);return this.set(t,0,a,0,0,1,0,0,-a,0,t,0,0,0,0,1),this}},{key:\"makeRotationZ\",value:function(e){var t=ze(e),a=fe(e);return this.set(t,-a,0,0,a,t,0,0,0,0,1,0,0,0,0,1),this}},{key:\"makeRotationAxis\",value:function(e,a){var n=ze(a),i=fe(a),l=1-n,t=e.x,o=e.y,s=e.z,r=l*t,y=l*o;return this.set(r*t+n,r*o-i*s,r*s+i*o,0,r*o+i*s,y*o+n,y*s-i*t,0,r*s-i*o,y*s+i*t,l*s*s+n,0,0,0,0,1),this}},{key:\"makeShear\",value:function(e,t,a){return this.set(1,t,a,0,e,1,a,0,e,t,1,0,0,0,0,1),this}},{key:\"compose\",value:function(e,t,a){var n=this.elements,i=t.x,l=t.y,o=t.z,s=t.w,r=i+i,y=l+l,d=o+o,u=i*r,c=i*y,m=i*d,x=l*y,p=l*d,v=o*d,g=s*r,k=s*y,h=s*d,z=a.x,f=a.y,S=a.z;return n[0]=(1-(x+v))*z,n[1]=(c+h)*z,n[2]=(m-k)*z,n[3]=0,n[4]=(c-h)*f,n[5]=(1-(u+v))*f,n[6]=(p+g)*f,n[7]=0,n[8]=(m+k)*S,n[9]=(p-g)*S,n[10]=(1-(u+x))*S,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}},{key:\"decompose\",value:function(e,t,a){var n=this.elements,i=n[0],l=n[1],o=n[2],s=n[4],r=n[5],y=n[6],d=n[8],u=n[9],c=n[10],m=this.determinant(),x=Ge.set(i,l,o).length()*(0>m?-1:1),p=Ge.set(s,r,y).length(),v=Ge.set(d,u,c).length(),g=1/x,k=1/p,h=1/v;return e.x=n[12],e.y=n[13],e.z=n[14],n[0]*=g,n[1]*=g,n[2]*=g,n[4]*=k,n[5]*=k,n[6]*=k,n[8]*=h,n[9]*=h,n[10]*=h,t.setFromRotationMatrix(this),n[0]=i,n[1]=l,n[2]=o,n[4]=s,n[5]=r,n[6]=y,n[8]=d,n[9]=u,n[10]=c,a.x=x,a.y=p,a.z=v,this}},{key:\"makePerspective\",value:function(e,t,a,n,i,l){var o=this.elements;return o[0]=2*i/(t-e),o[4]=0,o[8]=(t+e)/(t-e),o[12]=0,o[1]=0,o[5]=2*i/(a-n),o[9]=(a+n)/(a-n),o[13]=0,o[2]=0,o[6]=0,o[10]=-(l+i)/(l-i),o[14]=-2*l*i/(l-i),o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}},{key:\"makeOrthographic\",value:function(e,t,a,n,i,l){var o=this.elements,s=1/(t-e),r=1/(a-n),y=1/(l-i);return o[0]=2*s,o[4]=0,o[8]=0,o[12]=-((t+e)*s),o[1]=0,o[5]=2*r,o[9]=0,o[13]=-((a+n)*r),o[2]=0,o[6]=0,o[10]=-2*y,o[14]=-((l+i)*y),o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&16>t;++t)a[t]!==n[t]&&(l=!1);return l}}]),t}(),Ke=[new Ee,new Ee,new Ee,new Ee],We=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;e(this,t),this.origin=a,this.direction=n}return n(t,[{key:\"set\",value:function(e,t){return this.origin.copy(e),this.direction.copy(t),this}},{key:\"copy\",value:function(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"at\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;return t.copy(this.direction).multiplyScalar(e).add(this.origin)}},{key:\"lookAt\",value:function(e){return this.direction.copy(e).sub(this.origin).normalize(),this}},{key:\"recast\",value:function(e){return this.origin.copy(this.at(e,Ke[0])),this}},{key:\"closestPointToPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,a=t.subVectors(e,this.origin).dot(this.direction);return 0<=a?t.copy(this.direction).multiplyScalar(a).add(this.origin):t.copy(this.origin)}},{key:\"distanceSquaredToPoint\",value:function(e){var t=Ke[0].subVectors(e,this.origin).dot(this.direction);return 0>t?this.origin.distanceToSquared(e):Ke[0].copy(this.direction).multiplyScalar(t).add(this.origin).distanceToSquared(e)}},{key:\"distanceToPoint\",value:function(e){return Ie(this.distanceSquaredToPoint(e))}},{key:\"distanceToPlane\",value:function(e){var a=e.normal.dot(this.direction),n=0===a?0===e.distanceToPoint(this.origin)?0:-1:-(this.origin.dot(e.normal)+e.constant)/a;return 0<=n?n:null}},{key:\"distanceSquaredToSegment\",value:function(e,t,a,n){var i,l,o,s,r,y=Ke[0].copy(e).add(t).multiplyScalar(.5),d=Ke[1].copy(t).sub(e).normalize(),u=Ke[2].copy(this.origin).sub(y),m=.5*e.distanceTo(t),x=-this.direction.dot(d),p=u.dot(this.direction),v=-u.dot(d),g=u.lengthSq(),c=Te(1-x*x);return 0<c?(i=x*v-p,l=x*p-v,o=m*c,0<=i?l>=-o?l<=o?(s=1/c,i*=s,l*=s,r=i*(i+x*l+2*p)+l*(x*i+l+2*v)+g):(l=m,i=Ce(0,-(x*l+p)),r=-i*i+l*(l+2*v)+g):(l=-m,i=Ce(0,-(x*l+p)),r=-i*i+l*(l+2*v)+g):l<=-o?(i=Ce(0,-(-x*m+p)),l=0<i?-m:Pe(Ce(-m,-v),m),r=-i*i+l*(l+2*v)+g):l<=o?(i=0,l=Pe(Ce(-m,-v),m),r=l*(l+2*v)+g):(i=Ce(0,-(x*m+p)),l=0<i?m:Pe(Ce(-m,-v),m),r=-i*i+l*(l+2*v)+g)):(l=0<x?-m:m,i=Ce(0,-(x*l+p)),r=-i*i+l*(l+2*v)+g),void 0!==a&&a.copy(this.direction).multiplyScalar(i).add(this.origin),void 0!==n&&n.copy(d).multiplyScalar(l).add(y),r}},{key:\"intersectSphere\",value:function(e){var t,a,n,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,l=Ke[0].subVectors(e.center,this.origin),o=l.dot(this.direction),s=l.dot(l)-o*o,r=e.radius*e.radius,y=null;return s<=r&&(t=Ie(r-s),a=o-t,n=o+t,(0<=a||0<=n)&&(y=0>a?this.at(n,i):this.at(a,i))),y}},{key:\"intersectsSphere\",value:function(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}},{key:\"intersectPlane\",value:function(e){var a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,n=this.distanceToPlane(e);return null===n?null:this.at(n,a)}},{key:\"intersectsPlane\",value:function(e){var t=e.distanceToPoint(this.origin);return 0===t||0>e.normal.dot(this.direction)*t}},{key:\"intersectBox\",value:function(e){var t,a,n,i,l,o,s=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,r=this.origin,y=this.direction,d=e.min,u=e.max,c=1/y.x,m=1/y.y,x=1/y.z,p=null;return 0<=c?(t=(d.x-r.x)*c,a=(u.x-r.x)*c):(t=(u.x-r.x)*c,a=(d.x-r.x)*c),0<=m?(n=(d.y-r.y)*m,i=(u.y-r.y)*m):(n=(u.y-r.y)*m,i=(d.y-r.y)*m),t<=i&&n<=a&&((n>t||t!==t)&&(t=n),(i<a||a!==a)&&(a=i),0<=x?(l=(d.z-r.z)*x,o=(u.z-r.z)*x):(l=(u.z-r.z)*x,o=(d.z-r.z)*x),t<=o&&l<=a&&((l>t||t!==t)&&(t=l),(o<a||a!==a)&&(a=o),0<=a&&(p=this.at(0<=t?t:a,s)))),p}},{key:\"intersectsBox\",value:function(e){return null!==this.intersectBox(e,Ke[0])}},{key:\"intersectTriangle\",value:function(e,t,a,n,i){var l,o,s,r,y,d=this.direction,u=Ke[0],c=Ke[1],m=Ke[2],x=Ke[3],p=null;return c.subVectors(t,e),m.subVectors(a,e),x.crossVectors(c,m),l=d.dot(x),0===l||n&&0<l||(0<l?o=1:(o=-1,l=-l),u.subVectors(this.origin,e),s=o*d.dot(m.crossVectors(u,m)),0<=s&&(r=o*d.dot(c.cross(u)),0<=r&&s+r<=l&&(y=-o*u.dot(x),0<=y&&(p=this.at(y/l,i))))),p}},{key:\"applyMatrix4\",value:function(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}},{key:\"equals\",value:function(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}}]),t}(),$e=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.radius=a,this.phi=n,this.theta=i}return n(t,[{key:\"set\",value:function(e,t,a){return this.radius=e,this.phi=t,this.theta=a,this}},{key:\"copy\",value:function(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeSafe\",value:function(){return this.phi=Ce(1e-6,Pe(ve-1e-6,this.phi)),this}},{key:\"setFromVector3\",value:function(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}},{key:\"setFromCartesianCoords\",value:function(e,t,a){return this.radius=Ie(e*e+t*t+a*a),0===this.radius?(this.theta=0,this.phi=0):(this.theta=ge(e,a),this.phi=he(Pe(Ce(t/this.radius,-1),1))),this}}]),t}(),et=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,1,0,1])}return n(t,[{key:\"set\",value:function(t,a,n,i,l,o){var s=this.elements;return s[0]=t,s[1]=a,s[3]=i,s[2]=n,s[4]=l,s[5]=o,this}},{key:\"identity\",value:function(){return this.set(1,0,0,1,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements;return this.set(t[0],t[1],t[2],t[3],t[4],t[5]),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"toMatrix3\",value:function(e){var t=e.elements;e.set(t[0],t[1],t[2],t[1],t[3],t[4],t[2],t[4],t[5])}},{key:\"add\",value:function(e){var t=this.elements,a=e.elements;return t[0]+=a[0],t[1]+=a[1],t[3]+=a[3],t[2]+=a[2],t[4]+=a[4],t[5]+=a[5],this}},{key:\"norm\",value:function(){var t=this.elements,e=t[1]*t[1],a=t[2]*t[2],n=t[4]*t[4];return Ie(t[0]*t[0]+e+a+e+t[3]*t[3]+n+a+n+t[5]*t[5])}},{key:\"off\",value:function(){var t=this.elements;return Ie(2*(t[1]*t[1]+t[2]*t[2]+t[4]*t[4]))}},{key:\"applyToVector3\",value:function(t){var a=t.x,n=t.y,i=t.z,l=this.elements;return t.x=l[0]*a+l[1]*n+l[2]*i,t.y=l[1]*a+l[3]*n+l[4]*i,t.z=l[2]*a+l[4]*n+l[5]*i,t}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&6>t;++t)a[t]!==n[t]&&(l=!1);return l}}],[{key:\"calculateIndex\",value:function(e,t){return 3-(3-e)*(2-e)/2+t}}]),t}(),tt=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;e(this,t),this.x=a,this.y=n,this.z=i,this.w=l}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.w=n,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}},{key:\"setAxisAngleFromQuaternion\",value:function(e){this.w=2*he(e.w);var t=Ie(1-e.w*e.w);return 1e-4>t?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}},{key:\"setAxisAngleFromRotationMatrix\",value:function(e){var t,a,n,i,l,o,r,d,u,c,m,p=.01,v=.1,g=e.elements,k=g[0],h=g[4],f=g[8],S=g[1],w=g[5],T=g[9],I=g[2],C=g[6],P=g[10];return Te(h-S)<p&&Te(f-I)<p&&Te(T-C)<p?Te(h+S)<v&&Te(f+I)<v&&Te(T+C)<v&&Te(k+w+P-3)<v?this.set(1,0,0,0):(t=ve,l=(k+1)/2,o=(w+1)/2,r=(P+1)/2,d=(h+S)/4,u=(f+I)/4,c=(T+C)/4,l>o&&l>r?l<p?(a=0,n=.707106781,i=.707106781):(a=Ie(l),n=d/a,i=u/a):o>r?o<p?(a=.707106781,n=0,i=.707106781):(n=Ie(o),a=d/n,i=c/n):r<p?(a=.707106781,n=.707106781,i=0):(i=Ie(r),a=u/i,n=c/i),this.set(a,n,i,t)):(m=Ie((C-T)*(C-T)+(f-I)*(f-I)+(S-h)*(S-h)),.001>Te(m)&&(m=1),this.x=(C-T)/m,this.y=(f-I)/m,this.z=(S-h)/m,this.w=he((k+w+P-1)/2)),this}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}},{key:\"multiplyVectors\",value:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this.w=e.w*t.w,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this.z/=e,this.w/=e,this}},{key:\"applyMatrix4\",value:function(t){var a=this.x,n=this.y,i=this.z,l=this.w,o=t.elements;return this.x=o[0]*a+o[4]*n+o[8]*i+o[12]*l,this.y=o[1]*a+o[5]*n+o[9]*i+o[13]*l,this.z=o[2]*a+o[6]*n+o[10]*i+o[14]*l,this.w=o[3]*a+o[7]*n+o[11]*i+o[15]*l,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}},{key:\"manhattanLength\",value:function(){return Te(this.x)+Te(this.y)+Te(this.z)+Te(this.w)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return Ie(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"manhattanDistanceTo\",value:function(e){return Te(this.x-e.x)+Te(this.y-e.y)+Te(this.z-e.z)+Te(this.w-e.w)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y,n=this.z-e.z,i=this.w-e.w;return t*t+a*a+n*n+i*i}},{key:\"distanceTo\",value:function(e){return Ie(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=Pe(this.x,e.x),this.y=Pe(this.y,e.y),this.z=Pe(this.z,e.z),this.w=Pe(this.w,e.w),this}},{key:\"max\",value:function(e){return this.x=Ce(this.x,e.x),this.y=Ce(this.y,e.y),this.z=Ce(this.z,e.z),this.w=Ce(this.w,e.w),this}},{key:\"clamp\",value:function(e,t){return this.x=Ce(e.x,Pe(t.x,this.x)),this.y=Ce(e.y,Pe(t.y,this.y)),this.z=Ce(e.z,Pe(t.z,this.z)),this.w=Ce(e.w,Pe(t.w,this.w)),this}},{key:\"floor\",value:function(){return this.x=Se(this.x),this.y=Se(this.y),this.z=Se(this.z),this.w=Se(this.w),this}},{key:\"ceil\",value:function(){return this.x=we(this.x),this.y=we(this.y),this.z=we(this.z),this.w=we(this.w),this}},{key:\"round\",value:function(){return this.x=ke(this.x),this.y=ke(this.y),this.z=ke(this.z),this.w=ke(this.w),this}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}}]),t}(),at=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1];e(this,t),this.value=a,this.done=n}return n(t,[{key:\"reset\",value:function(){this.value=null,this.done=!1}}]),t}(),nt=[new Uint8Array([0,4]),new Uint8Array([1,5]),new Uint8Array([2,6]),new Uint8Array([3,7]),new Uint8Array([0,2]),new Uint8Array([1,3]),new Uint8Array([4,6]),new Uint8Array([5,7]),new Uint8Array([0,1]),new Uint8Array([2,3]),new Uint8Array([4,5]),new Uint8Array([6,7])],it=[new Uint8Array([0,0,0]),new Uint8Array([0,0,1]),new Uint8Array([0,1,0]),new Uint8Array([0,1,1]),new Uint8Array([1,0,0]),new Uint8Array([1,0,1]),new Uint8Array([1,1,0]),new Uint8Array([1,1,1])],lt=new Ee,ot=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.min=a,this.size=n,this.children=null}return n(t,[{key:\"getCenter\",value:function(e){return e.copy(this.min).addScalar(.5*this.size)}},{key:\"getDimensions\",value:function(e){return e.set(this.size,this.size,this.size)}},{key:\"split\",value:function(){var e,t,a=this.min,n=this.getCenter(lt),l=.5*this.size,o=this.children=[null,null,null,null,null,null,null,null];for(e=0;8>e;++e)t=it[e],o[e]=new this.constructor(new Ee(0===t[0]?a.x:n.x,0===t[1]?a.y:n.y,0===t[2]?a.z:n.z),l)}},{key:\"max\",get:function(){return this.min.clone().addScalar(this.size)}}]),t}(),st=new Ee,rt=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;e(this,t),this.min=a,this.max=n,this.children=null}return n(t,[{key:\"getCenter\",value:function(e){return e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getDimensions\",value:function(e){return e.subVectors(this.max,this.min)}},{key:\"split\",value:function(){var e,t,a=this.min,n=this.max,l=this.getCenter(st),o=this.children=[null,null,null,null,null,null,null,null];for(e=0;8>e;++e)t=it[e],o[e]=new this.constructor(new Ee(0===t[0]?a.x:l.x,0===t[1]?a.y:l.y,0===t[2]?a.z:l.z),new Ee(0===t[0]?l.x:n.x,0===t[1]?l.y:n.y,0===t[2]?l.z:n.z))}}]),t}(),yt=function t(a,n,i){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;e(this,t),this.distance=a,this.distanceToRay=n,this.point=i,this.object=l},dt=[new Uint8Array([4,2,1]),new Uint8Array([5,3,8]),new Uint8Array([6,8,3]),new Uint8Array([7,8,8]),new Uint8Array([8,6,5]),new Uint8Array([8,7,8]),new Uint8Array([8,8,7]),new Uint8Array([8,8,8])],ut=new Ee,ct=new v,mt=new v,d=new We,r=new function t(){e(this,t),this.value=0},xt=function(){function t(){e(this,t)}return n(t,null,[{key:\"intersectOctree\",value:function(e,t){var a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:[],n=A(e,t,r);null!==n&&V.apply(void 0,[e.root].concat(w(n),[a]))}}]),t}(),pt=new v,vt=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;e(this,t),this.octree=a,this.region=n,this.cull=null!==n,this.result=new at,this.trace=null,this.indices=null,this.reset()}return n(t,[{key:\"reset\",value:function(){var e=this.octree.root;return this.trace=[],this.indices=[],null!==e&&(pt.min=e.min,pt.max=e.max,(!this.cull||this.region.intersectsBox(pt))&&(this.trace.push(e),this.indices.push(0))),this.result.reset(),this}},{key:\"next\",value:function(){for(var e,t,a,n=this.cull,i=this.region,l=this.indices,o=this.trace,s=null,r=o.length-1;null===s&&0<=r;)if(e=l[r]++,t=o[r].children,!(8>e))o.pop(),l.pop(),--r;else if(null!==t){if(a=t[e],n&&(pt.min=a.min,pt.max=a.max,!i.intersectsBox(pt)))continue;o.push(a),l.push(0),++r}else s=o.pop(),l.pop();return this.result.value=s,this.result.done=null===s,this.result}},{key:\"return\",value:function(e){return this.result.value=e,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),gt=new v,kt=function(){function t(a){e(this,t),this.root=a}return n(t,[{key:\"getCenter\",value:function(e){return this.root.getCenter(e)}},{key:\"getDimensions\",value:function(e){return this.root.getDimensions(e)}},{key:\"cull\",value:function(e){var t=[];return N(this.root,e,t),t}},{key:\"getDepth\",value:function(){return B(this.root)}},{key:\"findNodesByLevel\",value:function(e){var t=[];return L(this.root,e,0,t),t}},{key:\"raycast\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];return xt.intersectOctree(this,e.ray,t),t}},{key:\"leaves\",value:function(e){return new vt(this,e)}},{key:Symbol.iterator,value:function(){return new vt(this)}},{key:\"min\",get:function(){return this.root.min}},{key:\"max\",get:function(){return this.root.max}},{key:\"children\",get:function(){return this.root.children}}]),t}(),ht=new Ee,p=function(t){function a(t,n){var i;return e(this,a),i=k(this,s(a).call(this,t,n)),i.points=null,i.data=null,i}return l(a,t),n(a,[{key:\"distanceToSquared\",value:function(e){var t=ht.copy(e).clamp(this.min,this.max);return t.sub(e).lengthSquared()}},{key:\"distanceToCenterSquared\",value:function(e){var t=this.getCenter(ht),a=e.x-t.x,n=e.y-t.x,i=e.z-t.z;return a*a+n*n+i*i}},{key:\"contains\",value:function(e,t){var a=this.min,n=this.max;return e.x>=a.x-t&&e.y>=a.y-t&&e.z>=a.z-t&&e.x<=n.x+t&&e.y<=n.y+t&&e.z<=n.z+t}},{key:\"redistribute\",value:function(e){var t,a,n,l,o,s,r,y=this.children,d=this.points,u=this.data;if(null!==y&&null!==d){for(t=0,n=d.length;t<n;++t)for(s=d[t],r=u[t],(a=0,l=y.length);a<l;++a)if(o=y[a],o.contains(s,e)){null===o.points&&(o.points=[],o.data=[]),o.points.push(s),o.data.push(r);break}this.points=null,this.data=null}}},{key:\"merge\",value:function(){var e=this.children;if(null!==e){var t,a,n,o=[],s=[];for(t=0,a=e.length;t<a;++t)n=e[t],null!==n.points&&(o=o.concat(n.points),s=s.concat(n.data));this.children=null,this.points=o,this.data=s}}}]),a}(rt),zt=function(t){function a(t,n){var i,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,o=3<arguments.length&&void 0!==arguments[3]?arguments[3]:8,r=4<arguments.length&&void 0!==arguments[4]?arguments[4]:8;return e(this,a),i=k(this,s(a).call(this,new p(t,n))),i.bias=Ce(0,l),i.maxPoints=Ce(1,ke(o)),i.maxDepth=Ce(0,ke(r)),i.pointCount=0,i}return l(a,t),n(a,[{key:\"countPoints\",value:function(e){return O(e)}},{key:\"insert\",value:function(e,t){return M(e,t,this,this.root,0)}},{key:\"remove\",value:function(e){return R(e,this,this.root,null)}},{key:\"get\",value:function(e){return Y(e,this,this.root)}},{key:\"move\",value:function(e,t){return X(e,t,this,this.root,null,0)}},{key:\"findNearestPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:1/0,a=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2],n=Z(e,t,a,this.root);return null!==n&&(n.point=n.point.clone()),n}},{key:\"findPoints\",value:function(e,t){var a=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2],n=[];return _(e,t,a,this.root,n),n}},{key:\"raycast\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],n=z(s(a.prototype),\"raycast\",this).call(this,e);return 0<n.length&&E(n,e,t),t}}]),a}(kt),ft=new Ee,St=new Ee,wt=new Ee,Tt=function(){function t(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;e(this,t),this.a=n,this.b=a,this.index=-1,this.coordinates=new Ee,this.t=0,this.n=new Ee}return n(t,[{key:\"approximateZeroCrossing\",value:function(e){var t,n,l=1<arguments.length&&void 0!==arguments[1]?arguments[1]:8,o=Ce(1,l-1),s=0,r=1,y=0,d=0;for(ft.subVectors(this.b,this.a);d<=o&&(y=(s+r)/2,St.addVectors(this.a,wt.copy(ft).multiplyScalar(y)),n=e.sample(St),!(Te(n)<=1e-4||(r-s)/2<=1e-6));)St.addVectors(this.a,wt.copy(ft).multiplyScalar(s)),t=e.sample(St),pe(n)===pe(t)?s=y:r=y,++d;this.t=y}},{key:\"computeZeroCrossingPosition\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return e.subVectors(this.b,this.a).multiplyScalar(this.t).add(this.a)}},{key:\"computeSurfaceNormal\",value:function(e){var t=this.computeZeroCrossingPosition(ft),a=1e-3,n=e.sample(St.addVectors(t,wt.set(a,0,0)))-e.sample(St.subVectors(t,wt.set(a,0,0))),i=e.sample(St.addVectors(t,wt.set(0,a,0)))-e.sample(St.subVectors(t,wt.set(0,a,0))),l=e.sample(St.addVectors(t,wt.set(0,0,a)))-e.sample(St.subVectors(t,wt.set(0,0,a)));this.n.set(n,i,l).normalize()}}]),t}(),It=new Tt,Ct=new Ee,Pt=new Ee,bt=function(){function t(a,n,i){var l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0,o=4<arguments.length&&void 0!==arguments[4]?arguments[4]:3;e(this,t),this.edgeData=a,this.cellPosition=n,this.cellSize=i,this.indices=null,this.zeroCrossings=null,this.normals=null,this.axes=null,this.lengths=null,this.result=new at,this.initialC=l,this.c=l,this.initialD=o,this.d=o,this.i=0,this.l=0,this.reset()}return n(t,[{key:\"reset\",value:function(){var e,t,n,i,o=this.edgeData,s=[],r=[],y=[],u=[],m=[];for(this.i=0,this.c=0,this.d=0,(t=this.initialC,e=4>>t,n=this.initialD);t<n;++t,e>>=1)i=o.indices[t].length,0<i&&(s.push(o.indices[t]),r.push(o.zeroCrossings[t]),y.push(o.normals[t]),u.push(it[e]),m.push(i),++this.d);return this.l=0<m.length?m[0]:0,this.indices=s,this.zeroCrossings=r,this.normals=y,this.axes=u,this.lengths=m,this.result.reset(),this}},{key:\"next\",value:function(){var e,t,a,l,o,r,d,u=this.cellSize,s=this.edgeData.resolution,n=s+1,m=n*n,p=this.result,v=this.cellPosition;return this.i===this.l&&(this.l=++this.c<this.d?this.lengths[this.c]:0,this.i=0),this.i<this.l?(r=this.c,d=this.i,e=this.axes[r],t=this.indices[r][d],It.index=t,a=t%n,l=xe(t%m/n),o=xe(t/m),It.coordinates.set(a,l,o),Ct.set(a*u/s,l*u/s,o*u/s),Pt.set((a+e[0])*u/s,(l+e[1])*u/s,(o+e[2])*u/s),It.a.addVectors(v,Ct),It.b.addVectors(v,Pt),It.t=this.zeroCrossings[r][d],It.n.fromArray(this.normals[r],3*d),p.value=It,++this.i):(p.value=null,p.done=!0),p}},{key:\"return\",value:function(e){return this.result.value=e,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),Et=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:n,l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:n;e(this,t),this.resolution=a,this.indices=0>=n?null:[new Uint32Array(n),new Uint32Array(i),new Uint32Array(l)],this.zeroCrossings=0>=n?null:[new Float32Array(n),new Float32Array(i),new Float32Array(l)],this.normals=0>=n?null:[new Float32Array(3*n),new Float32Array(3*i),new Float32Array(3*l)]}return n(t,[{key:\"serialize\",value:function(){return{resolution:this.resolution,edges:this.edges,zeroCrossings:this.zeroCrossings,normals:this.normals}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.resolution=e.resolution,this.edges=e.edges,this.zeroCrossings=e.zeroCrossings,this.normals=e.normals),t}},{key:\"createTransferList\",value:function(){var e,t,a,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],o=[this.edges[0],this.edges[1],this.edges[2],this.zeroCrossings[0],this.zeroCrossings[1],this.zeroCrossings[2],this.normals[0],this.normals[1],this.normals[2]];for(t=0,a=o.length;t<a;++t)e=o[t],null!==e&&n.push(e.buffer);return n}},{key:\"edges\",value:function(e,t){return new bt(this,e,t)}},{key:\"edgesX\",value:function(e,t){return new bt(this,e,t,0,1)}},{key:\"edgesY\",value:function(e,t){return new bt(this,e,t,1,2)}},{key:\"edgesZ\",value:function(e,t){return new bt(this,e,t,2,3)}}],[{key:\"calculate1DEdgeCount\",value:function(e){return me(e+1,2)*e}}]),t}(),Dt={AIR:0,SOLID:1},Ft=0,qt=0,At=0,Vt=function(){function t(){var a=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];e(this,t),this.materials=0,this.materialIndices=a?new Uint8Array(At):null,this.runLengths=null,this.edgeData=null}return n(t,[{key:\"set\",value:function(e){return this.materials=e.materials,this.materialIndices=e.materialIndices,this.runLengths=e.runLengths,this.edgeData=e.edgeData,this}},{key:\"clear\",value:function(){return this.materials=0,this.materialIndices=null,this.runLengths=null,this.edgeData=null,this}},{key:\"setMaterialIndex\",value:function(e,t){this.materialIndices[e]===Dt.AIR?t!==Dt.AIR&&++this.materials:t===Dt.AIR&&--this.materials,this.materialIndices[e]=t}},{key:\"compress\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this;return this.compressed?(t.materialIndices=this.materialIndices,t.runLengths=this.runLengths):(e=this.full?new be([this.materialIndices.length],[Dt.SOLID]):be.encode(this.materialIndices),t.materialIndices=new Uint8Array(e.data),t.runLengths=new Uint32Array(e.runLengths)),t.materials=this.materials,t}},{key:\"decompress\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this;return e.materialIndices=this.compressed?be.decode(this.runLengths,this.materialIndices,new Uint8Array(At)):this.materialIndices,e.runLengths=null,e.materials=this.materials,e}},{key:\"serialize\",value:function(){return{materials:this.materials,materialIndices:this.materialIndices,runLengths:this.runLengths,edgeData:null===this.edgeData?null:this.edgeData.serialize()}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.materials=e.materials,this.materialIndices=e.materialIndices,this.runLengths=e.runLengths,null===e.edgeData?this.edgeData=null:(null===this.edgeData&&(this.edgeData=new Et(qt)),this.edgeData.deserialize(e.edgeData))),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return null!==this.edgeData&&this.edgeData.createTransferList(e),null!==this.materialIndices&&e.push(this.materialIndices.buffer),null!==this.runLengths&&e.push(this.runLengths.buffer),e}},{key:\"empty\",get:function(){return 0===this.materials}},{key:\"full\",get:function(){return this.materials===At}},{key:\"compressed\",get:function(){return null!==this.runLengths}},{key:\"neutered\",get:function(){return!this.empty&&null===this.materialIndices}}],[{key:\"isovalue\",get:function(){return Ft},set:function(e){Ft=e}},{key:\"resolution\",get:function(){return qt},set:function(e){var t=Math.log2;e=me(2,Ce(0,we(t(e)))),qt=Ce(1,Pe(256,e)),At=me(qt+1,3)}}]),t}(),Bt=function(){function t(){e(this,t),this.ata=new et,this.ata.set(0,0,0,0,0,0),this.atb=new Ee,this.massPointSum=new Ee,this.numPoints=0}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.ata.copy(e),this.atb.copy(t),this.massPointSum.copy(a),this.numPoints=n,this}},{key:\"copy\",value:function(e){return this.set(e.ata,e.atb,e.massPointSum,e.numPoints)}},{key:\"add\",value:function(e,t){var a=t.x,n=t.y,i=t.z,l=e.dot(t),o=this.ata.elements,s=this.atb;o[0]+=a*a,o[1]+=a*n,o[3]+=n*n,o[2]+=a*i,o[4]+=n*i,o[5]+=i*i,s.x+=l*a,s.y+=l*n,s.z+=l*i,this.massPointSum.add(e),++this.numPoints}},{key:\"addData\",value:function(e){this.ata.add(e.ata),this.atb.add(e.atb),this.massPointSum.add(e.massPointSum),this.numPoints+=e.numPoints}},{key:\"clear\",value:function(){this.ata.set(0,0,0,0,0,0),this.atb.set(0,0,0),this.massPointSum.set(0,0,0),this.numPoints=0}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}}]),t}(),Nt=new Ve,Lt=function(){function t(){e(this,t)}return n(t,null,[{key:\"calculateCoefficients\",value:function(e,t,a){var n,i,l;return 0===t?(Nt.x=1,Nt.y=0):(n=(a-e)/(2*t),i=Ie(1+n*n),l=1/(0<=n?n+i:n-i),Nt.x=1/Ie(1+l*l),Nt.y=l*Nt.x),Nt}}]),t}(),Ot=function(){function t(){e(this,t)}return n(t,null,[{key:\"rotateXY\",value:function(e,t){var a=t.x,n=t.y,i=e.x,l=e.y;e.set(a*i-n*l,n*i+a*l)}},{key:\"rotateQXY\",value:function(e,t,a){var n=a.x,i=a.y,l=n*n,o=i*i,s=2*n*i*t,r=e.x,y=e.y;e.set(l*r-s+o*y,o*r+s+l*y)}}]),t}(),Mt=.1,Rt=new et,Yt=new Oe,Xt=new Ve,Zt=new Ee,_t=function(){function t(){e(this,t)}return n(t,null,[{key:\"solve\",value:function(e,t,a){var n=G(Rt.copy(e),Yt.identity()),i=J(Yt,n);a.copy(t).applyMatrix3(i)}}]),t}(),jt=new Ee,Ut=function(){function t(){e(this,t),this.data=null,this.ata=new et,this.atb=new Ee,this.massPoint=new Ee,this.hasSolution=!1}return n(t,[{key:\"setData\",value:function(e){return this.data=e,this.hasSolution=!1,this}},{key:\"solve\",value:function(e){var t=this.data,a=this.massPoint,n=this.ata.copy(t.ata),i=this.atb.copy(t.atb),l=1/0;return!this.hasSolution&&null!==t&&0<t.numPoints&&(jt.copy(t.massPointSum).divideScalar(t.numPoints),a.copy(jt),n.applyToVector3(jt),i.sub(jt),_t.solve(n,i,e),l=K(n,i,e),e.add(a),this.hasSolution=!0),l}}]),t}(),Qt=function t(){e(this,t),this.materials=0,this.edgeCount=0,this.index=-1,this.position=new Ee,this.normal=new Ee,this.qefData=null},Gt=new Ut,Ht=.1,Jt=-1,Kt=function(t){function a(t,n){var i;return e(this,a),i=k(this,s(a).call(this,t,n)),i.voxel=null,i}return l(a,t),n(a,[{key:\"contains\",value:function(e){var t=this.min,a=this.size;return e.x>=t.x-Ht&&e.y>=t.y-Ht&&e.z>=t.z-Ht&&e.x<=t.x+a+Ht&&e.y<=t.y+a+Ht&&e.z<=t.z+a+Ht}},{key:\"collapse\",value:function(){var e,t,a,n,l,o,s,r=this.children,y=[-1,-1,-1,-1,-1,-1,-1,-1],d=new Ee,u=-1,c=null!==r,m=0;if(c){for(n=new Bt,o=0,s=0;8>s;++s)e=r[s],m+=e.collapse(),a=e.voxel,null===e.children?null!==a&&(n.addData(a.qefData),u=1&a.materials>>7-s,y[s]=1&a.materials>>s,++o):c=!1;if(c&&(l=Gt.setData(n).solve(d),l<=Jt)){for(a=new Qt,a.position.copy(this.contains(d)?d:Gt.massPoint),s=0;8>s;++s)t=y[s],e=r[s],-1===t?a.materials|=u<<s:(a.materials|=t<<s,a.normal.add(e.voxel.normal));a.normal.normalize(),a.qefData=n,this.voxel=a,this.children=null,m+=o-1}}return m}}],[{key:\"errorThreshold\",get:function(){return Jt},set:function(e){Jt=e}}]),a}(ot),Wt=function t(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null;e(this,t),this.action=a,this.error=null},$t=function(){function t(a,n,i,l,o){e(this,t),this.indices=a,this.positions=n,this.normals=i,this.uvs=l,this.materials=o}return n(t,[{key:\"serialize\",value:function(){return{indices:this.indices,positions:this.positions,normals:this.normals,uvs:this.uvs,materials:this.materials}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.indices=e.indices,this.positions=e.positions,this.normals=e.normals,this.uvs=e.uvs,this.materials=e.materials),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e.push(this.indices.buffer),e.push(this.positions.buffer),e.push(this.normals.buffer),e.push(this.uvs.buffer),e.push(this.materials.buffer),e}}]),t}(),ea=[new Uint8Array([0,4,0]),new Uint8Array([1,5,0]),new Uint8Array([2,6,0]),new Uint8Array([3,7,0]),new Uint8Array([0,2,1]),new Uint8Array([4,6,1]),new Uint8Array([1,3,1]),new Uint8Array([5,7,1]),new Uint8Array([0,1,2]),new Uint8Array([2,3,2]),new Uint8Array([4,5,2]),new Uint8Array([6,7,2])],ta=[new Uint8Array([0,1,2,3,0]),new Uint8Array([4,5,6,7,0]),new Uint8Array([0,4,1,5,1]),new Uint8Array([2,6,3,7,1]),new Uint8Array([0,2,4,6,2]),new Uint8Array([1,3,5,7,2])],aa=[[new Uint8Array([4,0,0]),new Uint8Array([5,1,0]),new Uint8Array([6,2,0]),new Uint8Array([7,3,0])],[new Uint8Array([2,0,1]),new Uint8Array([6,4,1]),new Uint8Array([3,1,1]),new Uint8Array([7,5,1])],[new Uint8Array([1,0,2]),new Uint8Array([3,2,2]),new Uint8Array([5,4,2]),new Uint8Array([7,6,2])]],na=[[new Uint8Array([1,4,0,5,1,1]),new Uint8Array([1,6,2,7,3,1]),new Uint8Array([0,4,6,0,2,2]),new Uint8Array([0,5,7,1,3,2])],[new Uint8Array([0,2,3,0,1,0]),new Uint8Array([0,6,7,4,5,0]),new Uint8Array([1,2,0,6,4,2]),new Uint8Array([1,3,1,7,5,2])],[new Uint8Array([1,1,0,3,2,0]),new Uint8Array([1,5,4,7,6,0]),new Uint8Array([0,1,5,0,4,1]),new Uint8Array([0,3,7,2,6,1])]],ia=[[new Uint8Array([3,2,1,0,0]),new Uint8Array([7,6,5,4,0])],[new Uint8Array([5,1,4,0,1]),new Uint8Array([7,3,6,2,1])],[new Uint8Array([6,4,2,0,2]),new Uint8Array([7,5,3,1,2])]],la=[new Uint8Array([3,2,1,0]),new Uint8Array([7,5,6,4]),new Uint8Array([11,10,9,8])],oa=me(2,16)-1,sa=function(){function t(){e(this,t)}return n(t,null,[{key:\"run\",value:function(e){var t=[],a=e.voxelCount,n=null,i=null,l=null,o=null,s=null;return a>oa?console.warn(\"Could not create geometry for cell at position\",e.min,\"(vertex count of\",a,\"exceeds limit of \",oa,\")\"):0<a&&(i=new Float32Array(3*a),l=new Float32Array(3*a),o=new Float32Array(2*a),s=new Uint8Array(a),ae(e.root,i,l,0),te(e.root,t),n=new $t(new Uint16Array(t),i,l,o,s)),n}}]),t}(),ra=function(t){function a(t){var n,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1;return e(this,a),n=k(this,s(a).call(this)),n.root=new Kt(i,l),n.voxelCount=0,null!==t&&null!==t.edgeData&&n.construct(t),0<=Kt.errorThreshold&&n.simplify(),n}return l(a,t),n(a,[{key:\"simplify\",value:function(){this.voxelCount-=this.root.collapse()}},{key:\"construct\",value:function(e){var t,a,l,o,s,r,u,c,m,p,v,g=Vt.resolution,n=e.edgeData,k=e.materialIndices,h=new Ut,f=new Ee,S=[n.edgesX(this.min,this.root.size),n.edgesY(this.min,this.root.size),n.edgesZ(this.min,this.root.size)],w=[new Uint8Array([0,1,2,3]),new Uint8Array([0,1,4,5]),new Uint8Array([0,2,4,6])],T=0;for(p=0;3>p;++p){l=w[p],t=S[p];var I=!0,C=!1,P=void 0;try{for(var b,E=t[Symbol.iterator]();!(I=(b=E.next()).done);I=!0)for(a=b.value,a.computeZeroCrossingPosition(f),v=0;4>v;++v)o=it[l[v]],u=a.coordinates.x-o[0],c=a.coordinates.y-o[1],m=a.coordinates.z-o[2],0<=u&&0<=c&&0<=m&&u<g&&c<g&&m<g&&(s=ne(this.root,g,u,c,m),null===s.voxel&&(s.voxel=ie(g,u,c,m,k),++T),r=s.voxel,r.normal.add(a.n),r.qefData.add(f,a.n),r.qefData.numPoints===r.edgeCount&&(h.setData(r.qefData).solve(r.position),!s.contains(r.position)&&r.position.copy(h.massPoint),r.normal.normalize()))}catch(e){C=!0,P=e}finally{try{I||null==E[\"return\"]||E[\"return\"]()}finally{if(C)throw P}}}this.voxelCount=T}}]),a}(kt),ya={EXTRACT:\"worker.extract\",MODIFY:\"worker.modify\",CONFIGURE:\"worker.config\",CLOSE:\"worker.close\"},da=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;return e(this,a),t=k(this,s(a).call(this,n)),t.data=null,t}return l(a,t),a}(Wt),ua=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this,ya.EXTRACT)),t.isosurface=null,t}return l(a,t),a}(da),ca=new Vt(!1),ma=function(){function t(){e(this,t),this.data=null,this.response=null}return n(t,[{key:\"getData\",value:function(){return this.data}},{key:\"respond\",value:function(){return this.response.data=this.data.serialize(),this.response}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return null!==this.data&&this.data.createTransferList(e),e}},{key:\"process\",value:function(e){return this.data=ca.deserialize(e.data),this}}]),t}(),xa=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this)),t.response=new ua,t.decompressionTarget=new Vt(!1),t.isosurface=null,t}return l(a,t),n(a,[{key:\"respond\",value:function(){var e=z(s(a.prototype),\"respond\",this).call(this);return e.isosurface=null===this.isosurface?null:this.isosurface.serialise(),e}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return z(s(a.prototype),\"createTransferList\",this).call(this,e),null===this.isosurface?e:this.isosurface.createTransferList(e)}},{key:\"process\",value:function(e){var t=z(s(a.prototype),\"process\",this).call(this,e).getData(),n=new ra(t.decompress(this.decompressionTarget));return this.isosurface=sa.run(n),this.decompressionTarget.clear(),this}}]),a}(ma),pa={UNION:\"csg.union\",DIFFERENCE:\"csg.difference\",INTERSECTION:\"csg.intersection\",DENSITY_FUNCTION:\"csg.densityfunction\"},va=function(){function t(a){e(this,t),this.type=a;for(var n=arguments.length,i=Array(1<n?n-1:0),l=1;l<n;l++)i[l-1]=arguments[l];this.children=i,this.boundingBox=null}return n(t,[{key:\"getBoundingBox\",value:function(){return null===this.boundingBox&&(this.boundingBox=this.computeBoundingBox()),this.boundingBox}},{key:\"computeBoundingBox\",value:function(){var e,t,a=this.children,n=new v;for(e=0,t=a.length;e<t;++e)n.union(a[e].getBoundingBox());return n}}]),t}(),ga=function(t){function a(){var t;e(this,a);for(var n=arguments.length,i=Array(n),l=0;l<n;l++)i[l]=arguments[l];return k(this,(t=s(a)).call.apply(t,[this,pa.UNION].concat(i)))}return l(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){var n=a.materialIndices[e];n!==Dt.AIR&&t.setMaterialIndex(e,n)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t>t.t?e:t:e.t<t.t?e:t}}]),a}(va),ka=function(t){function a(){var t;e(this,a);for(var n=arguments.length,i=Array(n),l=0;l<n;l++)i[l]=arguments[l];return k(this,(t=s(a)).call.apply(t,[this,pa.DIFFERENCE].concat(i)))}return l(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){a.materialIndices[e]!==Dt.AIR&&t.setMaterialIndex(e,Dt.AIR)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t<t.t?e:t:e.t>t.t?e:t}}]),a}(va),ha=function(t){function a(){var t;e(this,a);for(var n=arguments.length,i=Array(n),l=0;l<n;l++)i[l]=arguments[l];return k(this,(t=s(a)).call.apply(t,[this,pa.INTERSECTION].concat(i)))}return l(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){var n=a.materialIndices[e];t.setMaterialIndex(e,t.materialIndices[e]!==Dt.AIR&&n!==Dt.AIR?n:Dt.AIR)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t<t.t?e:t:e.t>t.t?e:t}}]),a}(va),za=0,fa=new Ee,Sa=function(){function t(){e(this,t)}return n(t,null,[{key:\"run\",value:function(e,t,a,n){fa.fromArray(e),za=t,null===a?n.operation===pa.UNION&&(a=new Vt(!1)):a.decompress();var i=n.toCSG(),l=null===a?null:ue(i);if(null!==l){switch(n.operation){case pa.UNION:i=new ga(i);break;case pa.DIFFERENCE:i=new ka(i);break;case pa.INTERSECTION:i=new ha(i);}de(i,a,l),a.contoured=!1}return null!==a&&a.empty?null:a}}]),t}(),wa=function(t){function a(t){var n;return e(this,a),n=k(this,s(a).call(this,pa.DENSITY_FUNCTION)),n.sdf=t,n}return l(a,t),n(a,[{key:\"computeBoundingBox\",value:function(){return this.sdf.getBoundingBox(!0)}},{key:\"generateMaterialIndex\",value:function(e){return this.sdf.sample(e)<=Vt.isovalue?this.sdf.material:Dt.AIR}},{key:\"generateEdge\",value:function(e){e.approximateZeroCrossing(this.sdf),e.computeSurfaceNormal(this.sdf)}}]),a}(va),Ta=new c,Ia=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:Dt.SOLID;e(this,t),this.type=a,this.operation=null,this.material=Pe(255,Ce(Dt.SOLID,xe(n))),this.boundingBox=null,this.position=new Ee,this.quaternion=new Re,this.scale=new Ee(1,1,1),this.inverseTransformation=new c,this.updateInverseTransformation(),this.children=[]}return n(t,[{key:\"getTransformation\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new c;return e.compose(this.position,this.quaternion,this.scale)}},{key:\"getBoundingBox\",value:function(){var e,t,a=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],n=this.children,o=this.boundingBox;if(null===o&&(o=this.computeBoundingBox(),this.boundingBox=o),a)for(o=o.clone(),e=0,t=n.length;e<t;++e)o.union(n[e].getBoundingBox(a));return o}},{key:\"setMaterial\",value:function(e){return this.material=Pe(255,Ce(Dt.SOLID,xe(e))),this}},{key:\"setOperationType\",value:function(e){return this.operation=e,this}},{key:\"updateInverseTransformation\",value:function(){return this.inverseTransformation.getInverse(this.getTransformation(Ta)),this.boundingBox=null,this}},{key:\"union\",value:function(e){return this.children.push(e.setOperationType(pa.UNION)),this}},{key:\"subtract\",value:function(e){return this.children.push(e.setOperationType(pa.DIFFERENCE)),this}},{key:\"intersect\",value:function(e){return this.children.push(e.setOperationType(pa.INTERSECTION)),this}},{key:\"toCSG\",value:function(){var e,t,a,n,o=this.children,s=new wa(this);for(a=0,n=o.length;a<n;++a)t=o[a],e!==t.operation&&(e=t.operation,e===pa.UNION?s=new ga(s):e===pa.DIFFERENCE?s=new ka(s):e===pa.INTERSECTION?s=new ha(s):void 0),s.children.push(t.toCSG());return s}},{key:\"serialize\",value:function(){var e,t,a=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],n={type:this.type,operation:this.operation,material:this.material,position:this.position.toArray(),quaternion:this.quaternion.toArray(),scale:this.scale.toArray(),parameters:null,children:[]};for(e=0,t=this.children.length;e<t;++e)n.children.push(this.children[e].serialize(a));return n}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e}},{key:\"toJSON\",value:function(){return this.serialize(!0)}},{key:\"computeBoundingBox\",value:function(){throw new Error(\"SignedDistanceFunction#computeBoundingBox method not implemented!\")}},{key:\"sample\",value:function(){throw new Error(\"SignedDistanceFunction#sample method not implemented!\")}}]),t}(),Ca={HEIGHTFIELD:\"sdf.heightfield\",FRACTAL_NOISE:\"sdf.fractalnoise\",SUPER_PRIMITIVE:\"sdf.superprimitive\"},Pa=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,Ca.PERLIN_NOISE,i)),t.min=x(Ee,w(n.min)),t.max=x(Ee,w(n.max)),t}return l(a,t),n(a,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new v(this.min,this.max),this.bbox}},{key:\"sample\",value:function(){}},{key:\"serialize\",value:function(){var e=z(s(a.prototype),\"serialize\",this).call(this);return e.parameters={min:this.min.toArray(),max:this.max.toArray()},e}}]),a}(Ia),ba=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,Ca.HEIGHTFIELD,i)),t.width=void 0===n.width?1:n.width,t.height=void 0===n.height?1:n.height,t.smooth=void 0===n.smooth||n.smooth,t.data=void 0===n.data?null:n.data,t.heightmap=null,void 0!==n.image&&t.fromImage(n.image),t}return l(a,t),n(a,[{key:\"fromImage\",value:function(e){var t,a,n,o,s=\"undefined\"==typeof document?null:ce(e),r=null;if(null!==s){for(t=s.data,r=new Uint8ClampedArray(t.length/4),(a=0,n=0,o=r.length);a<o;++a,n+=4)r[a]=t[n];this.heightmap=e,this.width=s.width,this.height=s.height,this.data=r}return this}},{key:\"getHeight\",value:function(e,t){var n,i=this.width,l=this.height,o=this.data;if(e=ke(e*i),t=ke(t*l),this.smooth){e=Ce(Pe(e,i-1),1),t=Ce(Pe(t,l-1),1);var s=e+1,r=e-1,y=t*i,a=y+i,d=y-i;n=(o[d+r]+o[d+e]+o[d+s]+o[y+r]+o[y+e]+o[y+s]+o[a+r]+o[a+e]+o[a+s])/9}else n=o[t*i+e];return n}},{key:\"computeBoundingBox\",value:function(){var e=new v,t=Pe(this.width/this.height,1),a=Pe(this.height/this.width,1);return e.min.set(0,0,0),e.max.set(t,1,a),e.applyMatrix4(this.getTransformation()),e}},{key:\"sample\",value:function(e){var t,a=this.boundingBox;return a.containsPoint(e)?(e.applyMatrix4(this.inverseTransformation),t=e.y-this.getHeight(e.x,e.z)/255):t=a.distanceToPoint(e),t}},{key:\"serialize\",value:function(){var e=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],t=z(s(a.prototype),\"serialize\",this).call(this);return t.parameters={width:this.width,height:this.height,smooth:this.smooth,data:e?null:this.data,dataURL:e&&null!==this.heightmap?this.heightmap.toDataURL():null,image:null},t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e.push(this.data.buffer),e}}]),a}(Ia),Ea=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,Ca.SUPER_PRIMITIVE,i)),t.s0=x(tt,w(n.s)),t.r0=x(Ee,w(n.r)),t.s=new tt,t.r=new Ee,t.ba=new Ve,t.offset=0,t.precompute(),t}return l(a,t),n(a,[{key:\"setSize\",value:function(e,t,a,n){return this.s0.set(e,t,a,n),this.precompute()}},{key:\"setRadii\",value:function(e,t,a){return this.r0.set(e,t,a),this.precompute()}},{key:\"precompute\",value:function(){var e=this.s.copy(this.s0),t=this.r.copy(this.r0),a=this.ba;e.x-=t.x,e.y-=t.x,t.x-=e.w,e.w-=t.y,e.z-=t.y,this.offset=-2*e.z,a.set(t.z,this.offset);var n=a.dot(a);return 0===n?a.set(0,-1):a.divideScalar(n),this}},{key:\"computeBoundingBox\",value:function(){var e=this.s0,t=new v;return t.min.x=Pe(-e.x,-1),t.min.y=Pe(-e.y,-1),t.min.z=Pe(-e.z,-1),t.max.x=Ce(e.x,1),t.max.y=Ce(e.y,1),t.max.z=Ce(e.z,1),t.applyMatrix4(this.getTransformation()),t}},{key:\"sample\",value:function(e){e.applyMatrix4(this.inverseTransformation);var t=this.s,a=this.r,n=this.ba,i=Te(e.x)-t.x,l=Te(e.y)-t.y,o=Te(e.z)-t.z,s=Ce(i,0),r=Ce(l,0),y=Ie(s*s+r*r),d=e.z-t.z,u=Te(y+Pe(0,Ce(i,l))-a.x)-t.w,m=Pe(Ce(u*n.x+d*n.y,0),1),c=u-a.z*m,x=d-this.offset*m,p=Ce(u-a.z,0),v=e.z+t.z,g=Ce(u,0),k=u*-n.y+d*n.x,h=Ie(Pe(c*c+x*x,Pe(p*p+v*v,g*g+d*d)));return h*pe(Ce(k,o))-a.y}},{key:\"serialize\",value:function(){var e=z(s(a.prototype),\"serialize\",this).call(this);return e.parameters={s:this.s0.toArray(),r:this.r0.toArray()},e}}],[{key:\"create\",value:function(e){var t=Da[e];return new a({s:t[0],r:t[1]})}}]),a}(Ia),Da=[[new Float32Array([1,1,1,1]),new Float32Array([0,0,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,0,0])],[new Float32Array([0,0,1,1]),new Float32Array([0,0,1])],[new Float32Array([1,1,2,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,.25,1]),new Float32Array([1,.25,0])],[new Float32Array([1,1,.25,.25]),new Float32Array([1,.25,0])],[new Float32Array([1,1,1,.25]),new Float32Array([1,.1,0])],[new Float32Array([1,1,1,.25]),new Float32Array([.1,.1,0])]],Fa=function(){function t(){e(this,t)}return n(t,[{key:\"revive\",value:function(e){var t,a,n;switch(e.type){case Ca.FRACTAL_NOISE:t=new Pa(e.parameters,e.material);break;case Ca.HEIGHTFIELD:t=new ba(e.parameters,e.material);break;case Ca.SUPER_PRIMITIVE:t=new Ea(e.parameters,e.material);}for(t.operation=e.operation,t.position.fromArray(e.position),t.quaternion.fromArray(e.quaternion),t.scale.fromArray(e.scale),t.updateInverseTransformation(),(a=0,n=e.children.length);a<n;++a)t.children.push(this.revive(e.children[a]));return t}}]),t}(),qa=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this,ya.MODIFY)),t.sdf=null,t}return l(a,t),a}(da),Aa=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this)),t.response=new qa,t.sdf=null,t}return l(a,t),n(a,[{key:\"respond\",value:function(){var e=z(s(a.prototype),\"respond\",this).call(this);return e.sdf=null===this.sdf?null:this.sdf.serialize(),e}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return z(s(a.prototype),\"createTransferList\",this).call(this,e),null===this.sdf?e:this.sdf.createTransferList(e)}},{key:\"process\",value:function(e){var t=z(s(a.prototype),\"process\",this).call(this,e).getData(),n=this.sdf=Fa.revive(e.sdf),i=Sa.run(e.cellPosition,e.cellSize,t,n);return S(s(a.prototype),\"data\",null===i?null:i.compress(),this,!0),this}}]),a}(ma),Va=new Aa,Ba=new xa,Na=null;self.addEventListener(\"message\",function(e){var t=e.data;switch(Na=t.action,Na){case ya.MODIFY:postMessage(Va.process(t).respond(),Va.createTransferList());break;case ya.EXTRACT:postMessage(Ba.process(t).respond(),Ba.createTransferList());break;case ya.CONFIGURE:Vt.resolution=t.resolution,Kt.errorThreshold=t.errorThreshold;break;case ya.CLOSE:default:close();}}),self.addEventListener(\"error\",function(e){var t,a=Na===ya.MODIFY?Va:Na===ya.EXTRACT?Ba:null;null===a?(t=new Wt(ya.CLOSE),t.error=e,postMessage(t)):(t=a.respond(),t.action=ya.CLOSE,t.error=e,postMessage(t,a.createTransferList())),close()})})();\n";

/**
 * Manages worker threads.
 *
 * @implements {Disposable}
 * @implements {EventListener}
 */

class ThreadPool extends EventTarget {

	/**
	 * Constructs a new thread pool.
	 *
	 * @param {Number} [maxWorkers=navigator.hardwareConcurrency] - Limits the amount of active workers. The default limit is the amount of logical processors.
	 */

	constructor(maxWorkers = navigator.hardwareConcurrency) {

		super();

		/**
		 * An object URL that points to the worker program.
		 *
		 * @type {String}
		 * @private
		 */

		this.workerURL = URL.createObjectURL(new Blob([worker], { type: "text/javascript" }));

		/**
		 * The maximum number of active worker threads.
		 *
		 * @type {Number}
		 */

		this.maxWorkers = Math.min(navigator.hardwareConcurrency, Math.max(maxWorkers, 1));

		/**
		 * A list of existing workers.
		 *
		 * @type {Worker[]}
		 * @private
		 */

		this.workers = [];

		/**
		 * Keeps track of workers that are currently busy.
		 *
		 * @type {WeakSet}
		 * @private
		 */

		this.busyWorkers = new WeakSet();

		/**
		 * A configuration message.
		 *
		 * This object will be sent to each newly created worker.
		 *
		 * @type {ConfigurationMessage}
		 */

		this.configurationMessage = new ConfigurationMessage();

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "message": {

				this.busyWorkers.delete(event.target);

				message.worker = event.target;
				message.response = event.data;

				this.dispatchEvent(message);

				if(this.workers.length > this.maxWorkers) {

					this.closeWorker(event.target);

				}

				break;

			}

			case "error": {

				// Errors are being handled in the worker.
				console.error("Encountered an unexpected error", event);
				break;

			}

		}

	}

	/**
	 * Closes a worker.
	 *
	 * @param {Worker} worker - The worker to close.
	 */

	closeWorker(worker) {

		const index = this.workers.indexOf(worker);

		if(this.busyWorkers.has(worker)) {

			this.busyWorkers.delete(worker);
			worker.terminate();

		} else {

			worker.postMessage(new Message(Action.CLOSE));

		}

		worker.removeEventListener("message", this);
		worker.removeEventListener("error", this);

		if(index >= 0) {

			this.workers.splice(index, 1);

		}

	}

	/**
	 * Creates a new worker.
	 *
	 * @private
	 * @return {Worker} The worker.
	 */

	createWorker() {

		const worker = new Worker(this.workerURL);

		this.workers.push(worker);

		worker.addEventListener("message", this);
		worker.addEventListener("error", this);

		worker.postMessage(this.configurationMessage);

		return worker;

	}

	/**
	 * Polls an available worker and returns it. The worker will be excluded from
	 * subsequent polls until it finishes its task and sends a message back.
	 *
	 * @return {Worker} A worker or null if all resources are currently exhausted.
	 */

	getWorker() {

		let worker = null;

		let i, l;

		// Check if an existing worker is available.
		for(i = 0, l = this.workers.length; i < l; ++i) {

			if(!this.busyWorkers.has(this.workers[i])) {

				worker = this.workers[i];
				this.busyWorkers.add(worker);

				break;

			}

		}

		// Try to create a new worker if all existing ones are busy.
		if(worker === null && this.workers.length < this.maxWorkers) {

			if(this.workerURL !== null) {

				worker = this.createWorker();
				this.busyWorkers.add(worker);

			}

		}

		return worker;

	}

	/**
	 * Resets this thread pool by closing all workers.
	 */

	clear() {

		while(this.workers.length > 0) {

			this.closeWorker(this.workers.pop());

		}

	}

	/**
	 * Removes all active workers and releases the worker program blob.
	 */

	dispose() {

		this.clear();

		URL.revokeObjectURL(this.workerURL);

		this.workerURL = null;

	}

}

/**
 * A terrain event.
 */

class TerrainEvent extends Event {

	/**
	 * Constructs a new terrain event.
	 *
	 * @param {String} type - The name of the event.
	 */

	constructor(type) {

		super(type);

		/**
		 * A world octant.
		 *
		 * @type {WorldOctant}
		 */

		this.octant = null;

		/**
		 * The Identifier of the world octant.
		 *
		 * @type {WorldOctantId}
		 */

		this.octantId = null;

		/**
		 * An error event.
		 *
		 * @type {ErrorEvent}
		 */

		this.error = null;

	}

}

/**
 * Signals the start of a modification task.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("modificationstart", myListener);
 */

const modificationstart = new TerrainEvent("modificationstart");

/**
 * Signals the end of a modification task.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("modificationend", myListener);
 */

const modificationend = new TerrainEvent("modificationend");

/**
 * Signals the start of an extraction task.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("extractionstart", myListener);
 */

const extractionstart = new TerrainEvent("extractionstart");

/**
 * Signals the end of an extraction task.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("extractionend", myListener);
 */

const extractionend = new TerrainEvent("extractionend");

/**
 * Signals the end of a volume data loading process.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("load", myListener);
 */

const load$1 = new TerrainEvent("load");

/**
 * Signals the occurrence of an unexpected error.
 *
 * This event is dispatched by {@link Terrain}.
 *
 * @type {TerrainEvent}
 * @example terrain.addEventListener("error", myListener);
 */

const error = new TerrainEvent("error");

/**
 * The terrain system.
 *
 * Manages volume modifications and mesh generation.
 *
 * @implements {Disposable}
 * @implements {EventListener}
 */

class Terrain extends EventTarget {

	/**
	 * Constructs a new terrain.
	 *
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.workers=navigator.hardwareConcurrency] - Limits the amount of active workers. Cannot exceed the amount of logical processors.
	 * @param {Number} [options.resolution=32] - The resolution of the volume data.
	 * @param {Number} [options.world] - Additional world octree settings. See {@link WorldOctree} for details.
	 */

	constructor(options = {}) {

		const worldSettings = (options.world !== undefined) ? options.world : {};

		HermiteData.resolution = (options.resolution !== undefined) ? options.resolution : 32;

		super();

		/**
		 * The terrain mesh. Add this object to your scene.
		 *
		 * @type {Group}
		 */

		this.object = null;

		/**
		 * The world octree.
		 *
		 * @type {WorldOctree}
		 */

		this.world = new WorldOctree(worldSettings.cellSize, worldSettings.levels, worldSettings.keyDesign);

		/**
		 * A clipmap.
		 *
		 * @type {Clipmap}
		 */

		this.clipmap = new Clipmap(this.world);
		this.clipmap.addEventListener("shellupdate", this);

		/**
		 * A thread pool. Each worker from this pool is capable of performing
		 * isosurface extractions as well as CSG operations on discrete volume data.
		 *
		 * @type {ThreadPool}
		 */

		this.threadPool = new ThreadPool(options.workers);
		this.threadPool.addEventListener("message", this);

		/**
		 * Keeps track of tasks that are currently being processed by a worker.
		 *
		 * Note: The amount of tracked tasks cannot exceed the amount of workers.
		 *
		 * @type {WeakMap}
		 * @private
		 */

		this.tasks = new WeakMap();

		/**
		 * An SDF loader.
		 *
		 * @type {SDFLoader}
		 * @private
		 */

		this.sdfLoader = new SDFLoader();
		this.sdfLoader.addEventListener("load", this);

		/**
		 * A chronological sequence of CSG operations that have been executed during
		 * this session.
		 *
		 * @type {SignedDistanceFunction[]}
		 * @private
		 */

		this.history = [];

		/**
		 * A squared distance threshold.
		 *
		 * If the squared distance from the current view position to a given new
		 * position is greater than this threshold, the clipmap will be updated.
		 *
		 * @type {Number}
		 * @private
		 */

		this.dtSq = this.world.getCellSize();

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "shellupdate":
				break;

			case "message":
				break;

			case "load":
				this.revive(event.descriptions);
				this.dispatchEvent(load$1);
				break;

		}

	}

	/**
	 * Executes the given SDF.
	 *
	 * SDFs without a valid CSG operation type will be ignored.
	 * See {@link OperationType} for a list of available CSG operation types.
	 *
	 * Instead of using this method directly, it's recommended to use the
	 * convenience methods {@link union}, {@link subtract} and {@link intersect}.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	applyCSG(sdf) {

		this.world.applyCSG(sdf);
		this.history.push(sdf);

	}

	/**
	 * Executes the given SDF and adds the generated data to the volume.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	union(sdf) {

		this.applyCSG(sdf.setOperationType(OperationType.UNION));

	}

	/**
	 * Executes the given SDF and subtracts the generated data from the volume.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	subtract(sdf) {

		this.applyCSG(sdf.setOperationType(OperationType.DIFFERENCE));

	}

	/**
	 * Executes the given SDF and discards the volume data that doesn't overlap
	 * with the generated data.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	intersect(sdf) {

		this.applyCSG(sdf.setOperationType(OperationType.INTERSECTION));

	}

	/**
	 * Updates the terrain geometry.
	 *
	 * This method should be called every time the position has changed.
	 *
	 * @param {Vector3} position - A position.
	 */

	update(position) {

		// Check if the position has changed enough.
		if(this.clipmap.position.distanceToSquared(position) >= this.dtSq) {

			this.clipmap.update(position);

		}

	}

	/**
	 * Finds the world cells that intersect with the given ray.
	 *
	 * @param {Ray} ray - A ray.
	 * @return {WorldOctant[]} A list of intersecting world octants. Sorted by distance, closest first.
	 */

	raycast(ray) {

		return this.world.raycast(ray);

	}

	/**
	 * Resets this terrain by removing all data and closing active worker threads.
	 */

	clear() {

		this.world.clear();
		this.clipmap.clear();
		this.threadPool.clear();
		this.sdfLoader.clear();

		this.tasks = new WeakMap();
		this.history = [];

	}

	/**
	 * Frees internal resources.
	 *
	 * By calling this method the terrain system will become unoperative.
	 */

	dispose() {

		this.threadPool.dispose();

	}

	/**
	 * Revives the given serialised SDFs and applies them to the current volume.
	 *
	 * @private
	 * @param {Array} descriptions - A list of serialised SDFs.
	 */

	revive(descriptions) {

		let i, l;

		for(i = 0, l = descriptions.length; i < l; ++i) {

			this.applyCSG(SDFReviver.revive(descriptions[i]));

		}

	}

	/**
	 * Saves a description of the current volume data.
	 *
	 * @return {DOMString} A URL to the exported save data, or null if there is no data.
	 */

	save() {

		return (this.history.length === 0) ? null : URL.createObjectURL(

			new Blob([JSON.stringify(this.history)], { type: "text/json" })

		);

	}

	/**
	 * Loads a volume data description.
	 *
	 * A load event will be dispatched when the loading process has finished.
	 *
	 * @param {String} data - A stringified list of SDF descriptions.
	 */

	load(data) {

		const descriptions = JSON.parse(data);

		this.clear();
		this.sdfLoader.load(descriptions);

	}

}

/**
 * An isosurface, the result of a contouring process.
 *
 * @implements {Serializable}
 * @implements {Deserializable}
 * @implements {TransferableContainer}
 */

class Isosurface {

	/**
	 * Constructs a new isosurface.
	 *
	 * @param {Uint16Array} indices - Triangle indices.
	 * @param {Float32Array} positions - Generated vertices.
	 * @param {Float32Array} normals - Generated normals.
	 * @param {Float32Array} uvs - Generated uvs.
	 * @param {Uint8Array} materials - Generated materials.
	 */

	constructor(indices, positions, normals, uvs, materials) {

		/**
		 * A set of vertex indices that describe triangles.
		 *
		 * @type {Uint16Array}
		 */

		this.indices = indices;

		/**
		 * A set of vertices.
		 *
		 * @type {Float32Array}
		 */

		this.positions = positions;

		/**
		 * A set of normals.
		 *
		 * @type {Float32Array}
		 */

		this.normals = normals;

		/**
		 * A set of UV coordinates.
		 *
		 * @type {Float32Array}
		 */

		this.uvs = uvs;

		/**
		 * A set of material indices.
		 *
		 * @type {Uint8Array}
		 */

		this.materials = materials;

	}

	/**
	 * Serialises this isosurface.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		return {
			indices: this.indices,
			positions: this.positions,
			normals: this.normals,
			uvs: this.uvs,
			materials: this.materials
		};

	}

	/**
	 * Adopts the given serialised isosurface.
	 *
	 * @param {Object} object - A serialised isosurface. Can be null.
	 * @return {Deserializable} This object or null if the given serialised isosurface was null.
	 */

	deserialize(object) {

		let result = this;

		if(object !== null) {

			this.indices = object.indices;
			this.positions = object.positions;
			this.normals = object.normals;
			this.uvs = object.uvs;
			this.materials = object.materials;

		} else {

			result = null;

		}

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		transferList.push(this.indices.buffer);
		transferList.push(this.positions.buffer);
		transferList.push(this.normals.buffer);
		transferList.push(this.uvs.buffer);
		transferList.push(this.materials.buffer);

		return transferList;

	}

}

/**
 * An edge mask.
 *
 * @type {Uint8Array}
 */

/**
 * A face mask for cell processing.
 *
 * @type {Uint8Array[]}
 */

const cellProcFaceMask = [

	new Uint8Array([0, 4, 0]),
	new Uint8Array([1, 5, 0]),
	new Uint8Array([2, 6, 0]),
	new Uint8Array([3, 7, 0]),
	new Uint8Array([0, 2, 1]),
	new Uint8Array([4, 6, 1]),
	new Uint8Array([1, 3, 1]),
	new Uint8Array([5, 7, 1]),
	new Uint8Array([0, 1, 2]),
	new Uint8Array([2, 3, 2]),
	new Uint8Array([4, 5, 2]),
	new Uint8Array([6, 7, 2])

];

/**
 * An edge mask for cell processing.
 *
 * @type {Uint8Array[]}
 */

const cellProcEdgeMask = [

	new Uint8Array([0, 1, 2, 3, 0]),
	new Uint8Array([4, 5, 6, 7, 0]),
	new Uint8Array([0, 4, 1, 5, 1]),
	new Uint8Array([2, 6, 3, 7, 1]),
	new Uint8Array([0, 2, 4, 6, 2]),
	new Uint8Array([1, 3, 5, 7, 2])

];

/**
 * A face mask for face processing.
 *
 * @type {Array<Uint8Array[]>}
 */

const faceProcFaceMask = [

	[
		new Uint8Array([4, 0, 0]),
		new Uint8Array([5, 1, 0]),
		new Uint8Array([6, 2, 0]),
		new Uint8Array([7, 3, 0])
	],

	[
		new Uint8Array([2, 0, 1]),
		new Uint8Array([6, 4, 1]),
		new Uint8Array([3, 1, 1]),
		new Uint8Array([7, 5, 1])
	],

	[
		new Uint8Array([1, 0, 2]),
		new Uint8Array([3, 2, 2]),
		new Uint8Array([5, 4, 2]),
		new Uint8Array([7, 6, 2])
	]

];

/**
 * An edge mask for face processing.
 *
 * @type {Array<Uint8Array[]>}
 */

const faceProcEdgeMask = [

	[
		new Uint8Array([1, 4, 0, 5, 1, 1]),
		new Uint8Array([1, 6, 2, 7, 3, 1]),
		new Uint8Array([0, 4, 6, 0, 2, 2]),
		new Uint8Array([0, 5, 7, 1, 3, 2])
	],

	[
		new Uint8Array([0, 2, 3, 0, 1, 0]),
		new Uint8Array([0, 6, 7, 4, 5, 0]),
		new Uint8Array([1, 2, 0, 6, 4, 2]),
		new Uint8Array([1, 3, 1, 7, 5, 2])
	],

	[
		new Uint8Array([1, 1, 0, 3, 2, 0]),
		new Uint8Array([1, 5, 4, 7, 6, 0]),
		new Uint8Array([0, 1, 5, 0, 4, 1]),
		new Uint8Array([0, 3, 7, 2, 6, 1])
	]

];

/**
 * An edge mask for edge processing.
 *
 * @type {Array<Uint8Array[]>}
 */

const edgeProcEdgeMask = [

	[
		new Uint8Array([3, 2, 1, 0, 0]),
		new Uint8Array([7, 6, 5, 4, 0])
	],

	[
		new Uint8Array([5, 1, 4, 0, 1]),
		new Uint8Array([7, 3, 6, 2, 1])
	],

	[
		new Uint8Array([6, 4, 2, 0, 2]),
		new Uint8Array([7, 5, 3, 1, 2])
	]

];

/**
 * An edge mask.
 *
 * @type {Uint8Array[]}
 */

const procEdgeMask = [

	new Uint8Array([3, 2, 1, 0]),
	new Uint8Array([7, 5, 6, 4]),
	new Uint8Array([11, 10, 9, 8])

];

/**
 * The maximum number of vertices. Vertex indices use 16 bits.
 *
 * @type {Number}
 * @private
 */

const MAX_VERTEX_COUNT = Math.pow(2, 16) - 1;

/**
 * An edge contouring sub-procedure.
 *
 * @private
 * @param {Array} octants - Four leaf octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourProcessEdge(octants, dir, indexBuffer) {

	const indices = [-1, -1, -1, -1];
	const signChange = [false, false, false, false];

	let minSize = Infinity;
	let minIndex = 0;
	let flip = false;

	let c1, c2, m1, m2;
	let octant, edge;
	let i;

	for(i = 0; i < 4; ++i) {

		octant = octants[i];
		edge = procEdgeMask[dir][i];

		c1 = edges[edge][0];
		c2 = edges[edge][1];

		m1 = (octant.voxel.materials >> c1) & 1;
		m2 = (octant.voxel.materials >> c2) & 1;

		if(octant.size < minSize) {

			minSize = octant.size;
			minIndex = i;
			flip = (m1 !== Material.AIR);

		}

		indices[i] = octant.voxel.index;
		signChange[i] = (m1 !== m2);

	}

	if(signChange[minIndex]) {

		if(!flip) {

			indexBuffer.push(indices[0]);
			indexBuffer.push(indices[1]);
			indexBuffer.push(indices[3]);

			indexBuffer.push(indices[0]);
			indexBuffer.push(indices[3]);
			indexBuffer.push(indices[2]);

		} else {

			indexBuffer.push(indices[0]);
			indexBuffer.push(indices[3]);
			indexBuffer.push(indices[1]);

			indexBuffer.push(indices[0]);
			indexBuffer.push(indices[2]);
			indexBuffer.push(indices[3]);

		}

	}

}

/**
 * An edge contouring procedure.
 *
 * @private
 * @param {Array} octants - Four edge octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourEdgeProc(octants, dir, indexBuffer) {

	const c = [0, 0, 0, 0];

	let edgeOctants;
	let octant;
	let i, j;

	if(octants[0].voxel !== null && octants[1].voxel !== null &&
		octants[2].voxel !== null && octants[3].voxel !== null) {

		contourProcessEdge(octants, dir, indexBuffer);

	} else {

		for(i = 0; i < 2; ++i) {

			c[0] = edgeProcEdgeMask[dir][i][0];
			c[1] = edgeProcEdgeMask[dir][i][1];
			c[2] = edgeProcEdgeMask[dir][i][2];
			c[3] = edgeProcEdgeMask[dir][i][3];

			edgeOctants = [];

			for(j = 0; j < 4; ++j) {

				octant = octants[j];

				if(octant.voxel !== null) {

					edgeOctants[j] = octant;

				} else if(octant.children !== null) {

					edgeOctants[j] = octant.children[c[j]];

				} else {

					break;

				}

			}

			if(j === 4) {

				contourEdgeProc(edgeOctants, edgeProcEdgeMask[dir][i][4], indexBuffer);

			}

		}

	}

}

/**
 * A face contouring procedure.
 *
 * @private
 * @param {Array} octants - Two face octants.
 * @param {Number} dir - A direction index.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourFaceProc(octants, dir, indexBuffer) {

	const c = [0, 0, 0, 0];

	const orders = [
		[0, 0, 1, 1],
		[0, 1, 0, 1]
	];

	let faceOctants, edgeOctants;
	let order, octant;
	let i, j;

	if(octants[0].children !== null || octants[1].children !== null) {

		for(i = 0; i < 4; ++i) {

			c[0] = faceProcFaceMask[dir][i][0];
			c[1] = faceProcFaceMask[dir][i][1];

			faceOctants = [
				(octants[0].children === null) ? octants[0] : octants[0].children[c[0]],
				(octants[1].children === null) ? octants[1] : octants[1].children[c[1]]
			];

			contourFaceProc(faceOctants, faceProcFaceMask[dir][i][2], indexBuffer);

		}

		for(i = 0; i < 4; ++i) {

			c[0] = faceProcEdgeMask[dir][i][1];
			c[1] = faceProcEdgeMask[dir][i][2];
			c[2] = faceProcEdgeMask[dir][i][3];
			c[3] = faceProcEdgeMask[dir][i][4];

			order = orders[faceProcEdgeMask[dir][i][0]];

			edgeOctants = [];

			for(j = 0; j < 4; ++j) {

				octant = octants[order[j]];

				if(octant.voxel !== null) {

					edgeOctants[j] = octant;

				} else if(octant.children !== null) {

					edgeOctants[j] = octant.children[c[j]];

				} else {

					break;

				}

			}

			if(j === 4) {

				contourEdgeProc(edgeOctants, faceProcEdgeMask[dir][i][5], indexBuffer);

			}

		}

	}

}

/**
 * The main contouring procedure.
 *
 * @private
 * @param {Octant} octant - An octant.
 * @param {Array} indexBuffer - An output list for vertex indices.
 */

function contourCellProc(octant, indexBuffer) {

	const children = octant.children;
	const c = [0, 0, 0, 0];

	let faceOctants, edgeOctants;
	let i;

	if(children !== null) {

		for(i = 0; i < 8; ++i) {

			contourCellProc(children[i], indexBuffer);

		}

		for(i = 0; i < 12; ++i) {

			c[0] = cellProcFaceMask[i][0];
			c[1] = cellProcFaceMask[i][1];

			faceOctants = [
				children[c[0]],
				children[c[1]]
			];

			contourFaceProc(faceOctants, cellProcFaceMask[i][2], indexBuffer);

		}

		for(i = 0; i < 6; ++i) {

			c[0] = cellProcEdgeMask[i][0];
			c[1] = cellProcEdgeMask[i][1];
			c[2] = cellProcEdgeMask[i][2];
			c[3] = cellProcEdgeMask[i][3];

			edgeOctants = [
				children[c[0]],
				children[c[1]],
				children[c[2]],
				children[c[3]]
			];

			contourEdgeProc(edgeOctants, cellProcEdgeMask[i][4], indexBuffer);

		}

	}

}

/**
 * Collects positions and normals from the voxel information of the given octant
 * and its children. The generated vertex indices are stored in the respective
 * voxels during the octree traversal.
 *
 * @private
 * @param {Octant} octant - An octant.
 * @param {Array} positions - An array to be filled with vertices.
 * @param {Array} normals - An array to be filled with normals.
 * @param {Number} index - The next vertex index.
 */

function generateVertexIndices(octant, positions, normals, index) {

	let i, voxel;

	if(octant.children !== null) {

		for(i = 0; i < 8; ++i) {

			index = generateVertexIndices(octant.children[i], positions, normals, index);

		}

	} else if(octant.voxel !== null) {

		voxel = octant.voxel;
		voxel.index = index;

		positions[index * 3] = voxel.position.x;
		positions[index * 3 + 1] = voxel.position.y;
		positions[index * 3 + 2] = voxel.position.z;

		normals[index * 3] = voxel.normal.x;
		normals[index * 3 + 1] = voxel.normal.y;
		normals[index * 3 + 2] = voxel.normal.z;

		++index;

	}

	return index;

}

/**
 * Dual Contouring is an isosurface extraction technique that was originally
 * presented by Tao Ju in 2002:
 *  http://www.cs.wustl.edu/~taoju/research/dualContour.pdf
 */

class DualContouring {

	/**
	 * Contours the given volume data.
	 *
	 * @param {SparseVoxelOctree} svo - A voxel octree.
	 * @return {Isosurface} The generated isosurface or null if no data was generated.
	 */

	static run(svo) {

		const indexBuffer = [];

		// Each voxel contains one vertex.
		const vertexCount = svo.voxelCount;

		let result = null;
		let positions = null;
		let normals = null;
		let uvs = null;
		let materials = null;

		if(vertexCount > MAX_VERTEX_COUNT) {

			console.warn(
				"Could not create geometry for cell at position", svo.min,
				"(vertex count of", vertexCount, "exceeds limit of ", MAX_VERTEX_COUNT, ")"
			);

		} else if(vertexCount > 0) {

			positions = new Float32Array(vertexCount * 3);
			normals = new Float32Array(vertexCount * 3);
			uvs = new Float32Array(vertexCount * 2);
			materials = new Uint8Array(vertexCount);

			generateVertexIndices(svo.root, positions, normals, 0);
			contourCellProc(svo.root, indexBuffer);

			result = new Isosurface(
				new Uint16Array(indexBuffer),
				positions,
				normals,
				uvs,
				materials
			);

		}

		return result;

	}

}

/**
 * Symmetric Givens coefficients.
 *
 * @type {Vector2}
 * @private
 */

const coefficients = new Vector2();

/**
 * A collection of matrix rotation utilities.
 */

class Givens {

	/**
	 * Calculates symmetric Givens coefficients.
	 *
	 * @param {Number} aPP - PP.
	 * @param {Number} aPQ - PQ.
	 * @param {Number} aQQ - QQ.
	 * @return {Vector2} The coefficients C and S.
	 */

	static calculateCoefficients(aPP, aPQ, aQQ) {

		let tau, stt, tan;

		if(aPQ === 0.0) {

			coefficients.x = 1.0;
			coefficients.y = 0.0;

		} else {

			tau = (aQQ - aPP) / (2.0 * aPQ);
			stt = Math.sqrt(1.0 + tau * tau);
			tan = 1.0 / ((tau >= 0.0) ? (tau + stt) : (tau - stt));

			coefficients.x = 1.0 / Math.sqrt(1.0 + tan * tan);
			coefficients.y = tan * coefficients.x;

		}

		return coefficients;

	}

}

/**
 * A collection of matrix rotation utilities.
 */

class Schur {

	/**
	 * Rotates the given matrix.
	 *
	 * @param {Vector2} a - The vector that should be rotated.
	 * @param {Vector2} coefficients - Givens coefficients.
	 */

	static rotateXY(a, coefficients) {

		const c = coefficients.x;
		const s = coefficients.y;

		const u = a.x;
		const v = a.y;

		a.set(
			c * u - s * v,
			s * u + c * v
		);

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @param {Vector2} a - The vector that should be rotated.
	 * @param {Vector2} q - A coefficient factor.
	 * @param {Vector2} coefficients - Givens coefficients.
	 */

	static rotateQXY(a, q, coefficients) {

		const c = coefficients.x;
		const s = coefficients.y;
		const cc = c * c;
		const ss = s * s;

		const mx = 2.0 * c * s * q;

		const u = a.x;
		const v = a.y;

		a.set(
			cc * u - mx + ss * v,
			ss * u + mx + cc * v
		);

	}

}

/**
 * A threshold for pseudo inversions.
 *
 * @type {Number}
 * @private
 */

const PSEUDOINVERSE_THRESHOLD = 1e-1;

/**
 * The number of SVD sweeps.
 *
 * @type {Number}
 * @private
 */

const SVD_SWEEPS = 5;

/**
 * A symmetric matrix.
 *
 * @type {SymmetricMatrix3}
 * @private
 */

const sm = new SymmetricMatrix3();

/**
 * A matrix.
 *
 * @type {Matrix3}
 * @private
 */

const m$2 = new Matrix3();

/**
 * A vector.
 *
 * @type {Vector2}
 * @private
 */

const a = new Vector2();

/**
 * A vector that holds the singular values.
 *
 * @type {Vector3}
 * @private
 */

const b$2 = new Vector3();

/**
 * Rotates the matrix element from the first row, second column.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

function rotate01(vtav, v) {

	const se = vtav.elements;
	const ve = v.elements;

	let coefficients;

	if(se[1] !== 0.0) {

		coefficients = Givens.calculateCoefficients(se[0], se[1], se[3]);

		Schur.rotateQXY(a.set(se[0], se[3]), se[1], coefficients);
		se[0] = a.x; se[3] = a.y;

		Schur.rotateXY(a.set(se[2], se[4]), coefficients);
		se[2] = a.x; se[4] = a.y;

		se[1] = 0.0;

		Schur.rotateXY(a.set(ve[0], ve[3]), coefficients);
		ve[0] = a.x; ve[3] = a.y;

		Schur.rotateXY(a.set(ve[1], ve[4]), coefficients);
		ve[1] = a.x; ve[4] = a.y;

		Schur.rotateXY(a.set(ve[2], ve[5]), coefficients);
		ve[2] = a.x; ve[5] = a.y;

	}

}

/**
 * Rotates the matrix element from the first row, third column.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

function rotate02(vtav, v) {

	const se = vtav.elements;
	const ve = v.elements;

	let coefficients;

	if(se[2] !== 0.0) {

		coefficients = Givens.calculateCoefficients(se[0], se[2], se[5]);

		Schur.rotateQXY(a.set(se[0], se[5]), se[2], coefficients);
		se[0] = a.x; se[5] = a.y;

		Schur.rotateXY(a.set(se[1], se[4]), coefficients);
		se[1] = a.x; se[4] = a.y;

		se[2] = 0.0;

		Schur.rotateXY(a.set(ve[0], ve[6]), coefficients);
		ve[0] = a.x; ve[6] = a.y;

		Schur.rotateXY(a.set(ve[1], ve[7]), coefficients);
		ve[1] = a.x; ve[7] = a.y;

		Schur.rotateXY(a.set(ve[2], ve[8]), coefficients);
		ve[2] = a.x; ve[8] = a.y;

	}

}

/**
 * Rotates the matrix element from the second row, third column.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

function rotate12(vtav, v) {

	const se = vtav.elements;
	const ve = v.elements;

	let coefficients;

	if(se[4] !== 0.0) {

		coefficients = Givens.calculateCoefficients(se[3], se[4], se[5]);

		Schur.rotateQXY(a.set(se[3], se[5]), se[4], coefficients);
		se[3] = a.x; se[5] = a.y;

		Schur.rotateXY(a.set(se[1], se[2]), coefficients);
		se[1] = a.x; se[2] = a.y;

		se[4] = 0.0;

		Schur.rotateXY(a.set(ve[3], ve[6]), coefficients);
		ve[3] = a.x; ve[6] = a.y;

		Schur.rotateXY(a.set(ve[4], ve[7]), coefficients);
		ve[4] = a.x; ve[7] = a.y;

		Schur.rotateXY(a.set(ve[5], ve[8]), coefficients);
		ve[5] = a.x; ve[8] = a.y;

	}

}

/**
 * Calculates the singular values.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - An identity matrix.
 * @return {Vector3} The singular values.
 */

function solveSymmetric(vtav, v) {

	const e = vtav.elements;

	let i;

	for(i = 0; i < SVD_SWEEPS; ++i) {

		// Rotate the upper right (lower left) triagonal.
		rotate01(vtav, v);
		rotate02(vtav, v);
		rotate12(vtav, v);

	}

	return b$2.set(e[0], e[3], e[5]);

}

/**
 * Computes the pseudo inverse of a given value.
 *
 * @private
 * @param {Number} x - The value to invert.
 * @return {Number} The inverted value.
 */

function invert(x) {

	const invX = (Math.abs(x) < PSEUDOINVERSE_THRESHOLD) ? 0.0 : 1.0 / x;

	return (Math.abs(invX) < PSEUDOINVERSE_THRESHOLD) ? 0.0 : invX;

}

/**
 * Calculates the pseudo inverse of v using the singular values.
 *
 * @private
 * @param {Matrix3} v - A matrix.
 * @param {Vector3} sigma - The singular values.
 * @return {Matrix3} The inverted matrix.
 */

function pseudoInverse(v, sigma) {

	const ve = v.elements;

	const v00 = ve[0], v01 = ve[3], v02 = ve[6];
	const v10 = ve[1], v11 = ve[4], v12 = ve[7];
	const v20 = ve[2], v21 = ve[5], v22 = ve[8];

	const d0 = invert(sigma.x);
	const d1 = invert(sigma.y);
	const d2 = invert(sigma.z);

	return v.set(

		// First row.
		v00 * d0 * v00 + v01 * d1 * v01 + v02 * d2 * v02,
		v00 * d0 * v10 + v01 * d1 * v11 + v02 * d2 * v12,
		v00 * d0 * v20 + v01 * d1 * v21 + v02 * d2 * v22,

		// Second row.
		v10 * d0 * v00 + v11 * d1 * v01 + v12 * d2 * v02,
		v10 * d0 * v10 + v11 * d1 * v11 + v12 * d2 * v12,
		v10 * d0 * v20 + v11 * d1 * v21 + v12 * d2 * v22,

		// Third row.
		v20 * d0 * v00 + v21 * d1 * v01 + v22 * d2 * v02,
		v20 * d0 * v10 + v21 * d1 * v11 + v22 * d2 * v12,
		v20 * d0 * v20 + v21 * d1 * v21 + v22 * d2 * v22

	);

}

/**
 * A Singular Value Decomposition solver.
 *
 * Decomposes the given linear system into the matrices U, D and V and solves
 * the equation: U D V^T x = b.
 *
 * See http://mathworld.wolfram.com/SingularValueDecomposition.html for more
 * information.
 */

class SingularValueDecomposition {

	/**
	 * Performs the Singular Value Decomposition to solve the given linear system.
	 *
	 * @param {SymmetricMatrix3} ata - ATA. Will not be modified.
	 * @param {Vector3} atb - ATb. Will not be modified.
	 * @param {Vector3} x - A target vector to store the result in.
	 */

	static solve(ata, atb, x) {

		const sigma = solveSymmetric(sm.copy(ata), m$2.identity());
		const invV = pseudoInverse(m$2, sigma);

		x.copy(atb).applyMatrix3(invV);

	}

}

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p$2 = new Vector3();

/**
 * Computes the error of the approximated position.
 *
 * @private
 * @param {SymmetricMatrix3} ata - ATA.
 * @param {Vector3} atb - ATb.
 * @param {Vector3} x - The calculated vertex position.
 * @return {Number} The QEF error.
 */

function calculateError(ata, atb, x) {

	ata.applyToVector3(p$2.copy(x));
	p$2.subVectors(atb, p$2);

	return p$2.dot(p$2);

}

/**
 * A Quaratic Error Function solver.
 *
 * Finds a point inside a voxel that minimises the sum of the squares of the
 * distances to the surface intersection planes associated with the voxel.
 *
 * Based on an implementation by Leonard Ritter and Nick Gildea:
 *  https://github.com/nickgildea/qef
 */

class QEFSolver {

	/**
	 * Constructs a new QEF solver.
	 */

	constructor() {

		/**
		 * QEF data. Will be used destructively.
		 *
		 * @type {QEFData}
		 * @private
		 */

		this.data = null;

		/**
		 * ATA.
		 *
		 * @type {SymmetricMatrix3}
		 * @private
		 */

		this.ata = new SymmetricMatrix3();

		/**
		 * ATb.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.atb = new Vector3();

		/**
		 * The mass point of the current QEF data set.
		 *
		 * @type {Vector3}
		 */

		this.massPoint = new Vector3();

		/**
		 * Indicates whether this solver has a solution.
		 *
		 * @type {Boolean}
		 */

		this.hasSolution = false;

	}

	/**
	 * Sets the QEF data.
	 *
	 * @param {QEFData} d - QEF Data.
	 * @return {QEFSolver} This solver.
	 */

	setData(d) {

		this.data = d;
		this.hasSolution = false;

		return this;

	}

	/**
	 * Solves the Quadratic Error Function.
	 *
	 * @param {Vector3} x - A target vector to store the vertex position in.
	 * @return {Number} The quadratic error of the solution.
	 */

	solve(x) {

		const data = this.data;
		const massPoint = this.massPoint;
		const ata = this.ata.copy(data.ata);
		const atb = this.atb.copy(data.atb);

		let error = Infinity;

		if(!this.hasSolution && data !== null && data.numPoints > 0) {

			// Divide the mass point sum to get the average.
			p$2.copy(data.massPointSum).divideScalar(data.numPoints);
			massPoint.copy(p$2);

			ata.applyToVector3(p$2);
			atb.sub(p$2);

			SingularValueDecomposition.solve(ata, atb, x);
			error = calculateError(ata, atb, x);
			x.add(massPoint);

			this.hasSolution = true;

		}

		return error;

	}

}

/**
 * A data container for the QEF solver.
 */

class QEFData {

	/**
	 * Constructs a new QEF data container.
	 */

	constructor() {

		/**
		 * A symmetric matrix.
		 *
		 * @type {SymmetricMatrix3}
		 * @private
		 */

		this.ata = new SymmetricMatrix3();

		this.ata.set(

			0, 0, 0,
			0, 0,
			0

		);

		/**
		 * A vector.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.atb = new Vector3();

		/**
		 * An accumulation of the surface intersection points.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.massPointSum = new Vector3();

		/**
		 * The amount of accumulated surface intersection points.
		 *
		 * @type {Number}
		 */

		this.numPoints = 0;

	}

	/**
	 * Sets the values of this data instance.
	 *
	 * @param {SymmetricMatrix3} ata - ATA.
	 * @param {Vector3} atb - ATb.
	 * @param {Vector3} massPointSum - The accumulated mass points.
	 * @param {Vector3} numPoints - The number of mass points.
	 * @return {QEFData} This data.
	 */

	set(ata, atb, massPointSum, numPoints) {

		this.ata.copy(ata);
		this.atb.copy(atb);

		this.massPointSum.copy(massPointSum);
		this.numPoints = numPoints;

		return this;

	}

	/**
	 * Copies values from a given data instance.
	 *
	 * @param {QEFData} d - The data to copy.
	 * @return {QEFData} This data.
	 */

	copy(d) {

		return this.set(d.ata, d.atb, d.massPointSum, d.numPoints);

	}

	/**
	 * Adds the given surface intersection point and normal.
	 *
	 * @param {Vector3} p - An intersection point.
	 * @param {Vector3} n - A surface intersection normal.
	 */

	add(p, n) {

		const nx = n.x;
		const ny = n.y;
		const nz = n.z;

		const b = p.dot(n);

		const ata = this.ata.elements;
		const atb = this.atb;

		ata[0] += nx * nx;
		ata[1] += nx * ny; ata[3] += ny * ny;
		ata[2] += nx * nz; ata[4] += ny * nz; ata[5] += nz * nz;

		atb.x += b * nx;
		atb.y += b * ny;
		atb.z += b * nz;

		this.massPointSum.add(p);

		++this.numPoints;

	}

	/**
	 * Adds an entire data set.
	 *
	 * @param {QEFData} d - QEF data.
	 */

	addData(d) {

		this.ata.add(d.ata);
		this.atb.add(d.atb);

		this.massPointSum.add(d.massPointSum);
		this.numPoints += d.numPoints;

	}

	/**
	 * Clears this data.
	 */

	clear() {

		this.ata.set(

			0, 0, 0,
			0, 0,
			0

		);

		this.atb.set(0, 0, 0);
		this.massPointSum.set(0, 0, 0);
		this.numPoints = 0;

	}

	/**
	 * Clones this data.
	 *
	 * @return {QEFData} The cloned data.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}

/**
 * A cubic voxel that holds information about the surface of a volume.
 */

class Voxel {

	/**
	 * Constructs a new voxel.
	 */

	constructor() {

		/**
		 * Holds binary material information about all eight corners of this voxel.
		 *
		 * A value of 0 means that this voxel is completely outside of the volume,
		 * whereas a value of 255 means that it's fully inside of it. Any other
		 * value indicates a material change which implies that the voxel contains
		 * the surface.
		 *
		 * @type {Number}
		 */

		this.materials = 0;

		/**
		 * The amount of edges that exhibit a material change in this voxel.
		 *
		 * @type {Number}
		 */

		this.edgeCount = 0;

		/**
		 * A generated index for this voxel's vertex. Used during the construction
		 * of the final polygons.
		 *
		 * @type {Number}
		 */

		this.index = -1;

		/**
		 * The vertex that lies inside this voxel.
		 *
		 * @type {Vector3}
		 */

		this.position = new Vector3();

		/**
		 * The normal of the vertex that lies inside this voxel.
		 *
		 * @type {Vector3}
		 */

		this.normal = new Vector3();

		/**
		 * A QEF data construct. Used to calculate the vertex position.
		 *
		 * @type {QEFData}
		 */

		this.qefData = null;

	}

}

/**
 * A QEF solver.
 *
 * @type {QEFSolver}
 * @private
 */

const qefSolver = new QEFSolver();

/**
 * A bias for boundary checks.
 *
 * @type {Number}
 * @private
 */

const BIAS = 1e-1;

/**
 * An error threshold for QEF-based voxel clustering.
 *
 * @type {Number}
 * @private
 */

let errorThreshold = -1;

/**
 * A voxel octant.
 */

class VoxelCell extends CubicOctant {

	/**
	 * Constructs a new voxel octant.
	 *
	 * @param {Vector3} [min] - The lower bounds of the octant.
	 * @param {Number} [size] - The size of the octant.
	 */

	constructor(min, size) {

		super(min, size);

		/**
		 * A voxel that contains draw information.
		 *
		 * @type {Voxel}
		 */

		this.voxel = null;

	}

	/**
	 * Checks if the given point lies inside this cell.
	 *
	 * @param {Vector3} p - A point.
	 * @return {Boolean} Whether the given point lies inside this cell.
	 */

	contains(p) {

		const min = this.min;
		const size = this.size;

		return (
			p.x >= min.x - BIAS &&
			p.y >= min.y - BIAS &&
			p.z >= min.z - BIAS &&
			p.x <= min.x + size + BIAS &&
			p.y <= min.y + size + BIAS &&
			p.z <= min.z + size + BIAS
		);

	}

	/**
	 * Attempts to simplify this cell.
	 *
	 * @return {Number} The amount of removed voxels.
	 */

	collapse() {

		const children = this.children;

		const signs = [
			-1, -1, -1, -1,
			-1, -1, -1, -1
		];

		const position = new Vector3();

		let midSign = -1;
		let collapsible = (children !== null);

		let removedVoxels = 0;

		let child, sign, voxel;
		let qefData, error;

		let v, i;

		if(collapsible) {

			qefData = new QEFData();

			for(v = 0, i = 0; i < 8; ++i) {

				child = children[i];
				removedVoxels += child.collapse();
				voxel = child.voxel;

				if(child.children !== null) {

					// Couldn't simplify the child.
					collapsible = false;

				} else if(voxel !== null) {

					qefData.addData(voxel.qefData);

					midSign = (voxel.materials >> (7 - i)) & 1;
					signs[i] = (voxel.materials >> i) & 1;

					++v;

				}

			}

			if(collapsible) {

				error = qefSolver.setData(qefData).solve(position);

				if(error <= errorThreshold) {

					voxel = new Voxel();
					voxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);

					for(i = 0; i < 8; ++i) {

						sign = signs[i];
						child = children[i];

						if(sign === -1) {

							// Undetermined, use mid sign instead.
							voxel.materials |= (midSign << i);

						} else {

							voxel.materials |= (sign << i);

							// Accumulate normals.
							voxel.normal.add(child.voxel.normal);

						}

					}

					voxel.normal.normalize();
					voxel.qefData = qefData;

					this.voxel = voxel;
					this.children = null;

					// Removed existing voxels and created a new one.
					removedVoxels += v - 1;

				}

			}

		}

		return removedVoxels;

	}

	/**
	 * An error threshold for QEF-based voxel clustering (mesh simplification).
	 *
	 * @type {Number}
	 */

	static get errorThreshold() {

		return errorThreshold;

	}

	/**
	 * The mesh simplification error threshold.
	 *
	 * A bigger threshold allows more voxel cells to collapse which results in
	 * less vertices being created.
	 *
	 * An error threshold of -1 disables the mesh simplification.
	 *
	 * @type {Number}
	 */

	static set errorThreshold(value) {

		errorThreshold = value;

	}

}

/**
 * Creates intermediate voxel cells down to the leaf octant that is described
 * by the given local grid coordinates and returns it.
 *
 * @private
 * @param {VoxelCell} cell - The root octant.
 * @param {Number} n - The grid resolution.
 * @param {Number} x - A local grid point X-coordinate.
 * @param {Number} y - A local grid point Y-coordinate.
 * @param {Number} z - A local grid point Z-coordinate.
 * @return {VoxelCell} A leaf voxel cell.
 */

function getCell(cell, n, x, y, z) {

	let i = 0;

	for(n = n >> 1; n > 0; n >>= 1, i = 0) {

		// YZ.
		if(x >= n) {

			i += 4; x -= n;

		}

		// XZ.
		if(y >= n) {

			i += 2; y -= n;

		}

		// XY.
		if(z >= n) {

			i += 1; z -= n;

		}

		if(cell.children === null) {

			cell.split();

		}

		cell = cell.children[i];

	}

	return cell;

}

/**
 * Creates a voxel and builds a material configuration code from the materials
 * in the voxel corners.
 *
 * @private
 * @param {Number} n - The grid resolution.
 * @param {Number} x - A local grid point X-coordinate.
 * @param {Number} y - A local grid point Y-coordinate.
 * @param {Number} z - A local grid point Z-coordinate.
 * @param {Uint8Array} materialIndices - The material indices.
 * @return {Voxel} A voxel.
 */

function createVoxel(n, x, y, z, materialIndices) {

	const m = n + 1;
	const mm = m * m;

	const voxel = new Voxel();

	let materials, edgeCount;
	let material, offset, index;
	let c1, c2, m1, m2;

	let i;

	// Pack the material information of the eight corners into a single byte.
	for(materials = 0, i = 0; i < 8; ++i) {

		// Translate the coordinates into a one-dimensional grid point index.
		offset = layout[i];
		index = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);

		// Convert the identified material index into a binary value.
		material = Math.min(materialIndices[index], Material.SOLID);

		// Store the value in bit i.
		materials |= (material << i);

	}

	// Find out how many edges intersect with the implicit surface.
	for(edgeCount = 0, i = 0; i < 12; ++i) {

		c1 = edges[i][0];
		c2 = edges[i][1];

		m1 = (materials >> c1) & 1;
		m2 = (materials >> c2) & 1;

		// Check if there is a material change on the edge.
		if(m1 !== m2) {

			++edgeCount;

		}

	}

	voxel.materials = materials;
	voxel.edgeCount = edgeCount;
	voxel.qefData = new QEFData();

	return voxel;

}

/**
 * A sparse, cubic voxel octree.
 */

class SparseVoxelOctree extends Octree {

	/**
	 * Constructs a new voxel octree.
	 *
	 * @param {HermiteData} data - A set of volume data.
	 * @param {Vector3} [min] - The lower bounds of this octree.
	 * @param {Number} [size=1] - The size of this octree.
	 */

	constructor(data, min = new Vector3(), size = 1) {

		super();

		/**
		 * The root octant.
		 *
		 * @type {VoxelCell}
		 */

		this.root = new VoxelCell(min, size);

		/**
		 * The amount of voxels in this octree.
		 *
		 * @type {Number}
		 */

		this.voxelCount = 0;

		if(data !== null && data.edgeData !== null) {

			this.construct(data);

		}

		if(VoxelCell.errorThreshold >= 0) {

			this.simplify();

		}

	}

	/**
	 * Attempts to simplify the octree by clustering voxels.
	 *
	 * @private
	 */

	simplify() {

		this.voxelCount -= this.root.collapse();

	}

	/**
	 * Constructs voxel cells from volume data.
	 *
	 * @private
	 * @param {HermiteData} data - The volume data.
	 */

	construct(data) {

		const n = HermiteData.resolution;
		const edgeData = data.edgeData;
		const materialIndices = data.materialIndices;

		const qefSolver = new QEFSolver();
		const intersection = new Vector3();

		const edgeIterators = [
			edgeData.edgesX(this.min, this.root.size),
			edgeData.edgesY(this.min, this.root.size),
			edgeData.edgesZ(this.min, this.root.size)
		];

		const sequences = [
			new Uint8Array([0, 1, 2, 3]),
			new Uint8Array([0, 1, 4, 5]),
			new Uint8Array([0, 2, 4, 6])
		];

		let voxelCount = 0;

		let edges, edge;
		let sequence, offset;
		let cell, voxel;

		let x, y, z;
		let d, i;

		// Process edges X -> Y -> Z.
		for(d = 0; d < 3; ++d) {

			sequence = sequences[d];
			edges = edgeIterators[d];

			for(edge of edges) {

				edge.computeZeroCrossingPosition(intersection);

				// Each edge can belong to up to four voxel cells.
				for(i = 0; i < 4; ++i) {

					// Rotate around the edge.
					offset = layout[sequence[i]];

					x = edge.coordinates.x - offset[0];
					y = edge.coordinates.y - offset[1];
					z = edge.coordinates.z - offset[2];

					// Check if the adjusted coordinates still lie inside the grid bounds.
					if(x >= 0 && y >= 0 && z >= 0 && x < n && y < n && z < n) {

						cell = getCell(this.root, n, x, y, z);

						if(cell.voxel === null) {

							// The existence of the edge guarantees that the voxel contains the surface.
							cell.voxel = createVoxel(n, x, y, z, materialIndices);

							++voxelCount;

						}

						// Add the edge data to the voxel.
						voxel = cell.voxel;
						voxel.normal.add(edge.n);
						voxel.qefData.add(intersection, edge.n);

						if(voxel.qefData.numPoints === voxel.edgeCount) {

							// Finalise the voxel by solving the accumulated data.
							qefSolver.setData(voxel.qefData).solve(voxel.position);

							if(!cell.contains(voxel.position)) {

								voxel.position.copy(qefSolver.massPoint);

							}

							voxel.normal.normalize();

						}

					}

				}

			}

		}

		this.voxelCount = voxelCount;

	}

}

/**
 * The world size of the current data cell.
 *
 * @type {Number}
 * @private
 */

let cellSize = 0;

/**
 * The lower bounds of the current data cell.
 *
 * @type {Vector3}
 * @private
 */

const cellPosition = new Vector3();

/**
 * Finds out which grid points lie inside the area of the given operation.
 *
 * @private
 * @param {Operation} operation - A CSG operation.
 * @return {Box3} The index bounds.
 */

function computeIndexBounds(operation) {

	const s = cellSize;
	const n = HermiteData.resolution;

	const min = new Vector3(0, 0, 0);
	const max = new Vector3(n, n, n);

	const cellBounds = new Box3(cellPosition, cellPosition.clone().addScalar(cellSize));
	const operationBounds = operation.getBoundingBox();

	if(operation.type !== OperationType.INTERSECTION) {

		if(operationBounds.intersectsBox(cellBounds)) {

			min.copy(operationBounds.min).max(cellBounds.min).sub(cellBounds.min);

			min.x = Math.ceil(min.x * n / s);
			min.y = Math.ceil(min.y * n / s);
			min.z = Math.ceil(min.z * n / s);

			max.copy(operationBounds.max).min(cellBounds.max).sub(cellBounds.min);

			max.x = Math.floor(max.x * n / s);
			max.y = Math.floor(max.y * n / s);
			max.z = Math.floor(max.z * n / s);

		} else {

			// The chunk is unaffected by this operation.
			min.set(n, n, n);
			max.set(0, 0, 0);

		}

	}

	return new Box3(min, max);

}

/**
 * Combines material indices.
 *
 * @private
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set.
 * @param {HermiteData} data1 - A predominant data set.
 * @param {Box3} bounds - Grid iteration limits.
 */

function combineMaterialIndices(operation, data0, data1, bounds) {

	const n = HermiteData.resolution;
	const m = n + 1;
	const mm = m * m;

	const X = bounds.max.x;
	const Y = bounds.max.y;
	const Z = bounds.max.z;

	let x, y, z;

	for(z = bounds.min.z; z <= Z; ++z) {

		for(y = bounds.min.y; y <= Y; ++y) {

			for(x = bounds.min.x; x <= X; ++x) {

				operation.updateMaterialIndex((z * mm + y * m + x), data0, data1);

			}

		}

	}

}

/**
 * Generates material indices.
 *
 * @private
 * @param {DensityFunction} operation - A CSG operation.
 * @param {HermiteData} data - A target data set.
 * @param {Box3} bounds - Grid iteration limits.
 */

function generateMaterialIndices(operation, data, bounds) {

	const s = cellSize;
	const n = HermiteData.resolution;
	const m = n + 1;
	const mm = m * m;

	const materialIndices = data.materialIndices;

	const base = cellPosition;
	const offset = new Vector3();
	const position = new Vector3();

	const X = bounds.max.x;
	const Y = bounds.max.y;
	const Z = bounds.max.z;

	let materialIndex;
	let materials = 0;

	let x, y, z;

	for(z = bounds.min.z; z <= Z; ++z) {

		offset.z = z * s / n;

		for(y = bounds.min.y; y <= Y; ++y) {

			offset.y = y * s / n;

			for(x = bounds.min.x; x <= X; ++x) {

				offset.x = x * s / n;

				materialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));

				if(materialIndex !== Material.AIR) {

					materialIndices[z * mm + y * m + x] = materialIndex;

					++materials;

				}

			}

		}

	}

	data.materials = materials;

}

/**
 * Combines edges.
 *
 * @private
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set.
 * @param {HermiteData} data1 - A predominant data set.
 * @return {Object} The generated edge data.
 */

function combineEdges(operation, data0, data1) {

	const n = HermiteData.resolution;
	const m = n + 1;
	const mm = m * m;

	const indexOffsets = new Uint32Array([1, m, mm]);
	const materialIndices = data0.materialIndices;

	const edge1 = new Edge();
	const edge0 = new Edge();

	const edgeData1 = data1.edgeData;
	const edgeData0 = data0.edgeData;

	const lengths = new Uint32Array(3);
	const edgeCount = EdgeData.calculate1DEdgeCount(n);

	const edgeData = new EdgeData(
		n,
		Math.min(edgeCount, edgeData0.indices[0].length + edgeData1.indices[0].length),
		Math.min(edgeCount, edgeData0.indices[1].length + edgeData1.indices[1].length),
		Math.min(edgeCount, edgeData0.indices[2].length + edgeData1.indices[2].length)
	);

	let edges1, zeroCrossings1, normals1;
	let edges0, zeroCrossings0, normals0;
	let edges, zeroCrossings, normals;
	let indexOffset;

	let indexA1, indexB1;
	let indexA0, indexB0;

	let m1, m2;
	let edge;

	let c, d, i, j, il, jl;

	// Process the edges along the X-axis, then Y and finally Z.
	for(c = 0, d = 0; d < 3; c = 0, ++d) {

		edges1 = edgeData1.indices[d];
		edges0 = edgeData0.indices[d];
		edges = edgeData.indices[d];

		zeroCrossings1 = edgeData1.zeroCrossings[d];
		zeroCrossings0 = edgeData0.zeroCrossings[d];
		zeroCrossings = edgeData.zeroCrossings[d];

		normals1 = edgeData1.normals[d];
		normals0 = edgeData0.normals[d];
		normals = edgeData.normals[d];

		indexOffset = indexOffsets[d];

		il = edges1.length;
		jl = edges0.length;

		// Process all generated edges.
		for(i = 0, j = 0; i < il; ++i) {

			indexA1 = edges1[i];
			indexB1 = indexA1 + indexOffset;

			m1 = materialIndices[indexA1];
			m2 = materialIndices[indexB1];

			if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

				edge1.t = zeroCrossings1[i];
				edge1.n.x = normals1[i * 3];
				edge1.n.y = normals1[i * 3 + 1];
				edge1.n.z = normals1[i * 3 + 2];

				if(operation.type === OperationType.DIFFERENCE) {

					edge1.n.negate();

				}

				edge = edge1;

				// Process existing edges up to the generated edge.
				while(j < jl && edges0[j] <= indexA1) {

					indexA0 = edges0[j];
					indexB0 = indexA0 + indexOffset;

					edge0.t = zeroCrossings0[j];
					edge0.n.x = normals0[j * 3];
					edge0.n.y = normals0[j * 3 + 1];
					edge0.n.z = normals0[j * 3 + 2];

					m1 = materialIndices[indexA0];

					if(indexA0 < indexA1) {

						m2 = materialIndices[indexB0];

						if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

							// The edge exhibits a material change and there is no conflict.
							edges[c] = indexA0;
							zeroCrossings[c] = edge0.t;
							normals[c * 3] = edge0.n.x;
							normals[c * 3 + 1] = edge0.n.y;
							normals[c * 3 + 2] = edge0.n.z;

							++c;

						}

					} else {

						// Resolve the conflict.
						edge = operation.selectEdge(edge0, edge1, (m1 === Material.SOLID));

					}

					++j;

				}

				edges[c] = indexA1;
				zeroCrossings[c] = edge.t;
				normals[c * 3] = edge.n.x;
				normals[c * 3 + 1] = edge.n.y;
				normals[c * 3 + 2] = edge.n.z;

				++c;

			}

		}

		// Collect remaining edges.
		while(j < jl) {

			indexA0 = edges0[j];
			indexB0 = indexA0 + indexOffset;

			m1 = materialIndices[indexA0];
			m2 = materialIndices[indexB0];

			if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

				edges[c] = indexA0;
				zeroCrossings[c] = zeroCrossings0[j];
				normals[c * 3] = normals0[j * 3];
				normals[c * 3 + 1] = normals0[j * 3 + 1];
				normals[c * 3 + 2] = normals0[j * 3 + 2];

				++c;

			}

			++j;

		}

		lengths[d] = c;

	}

	return { edgeData, lengths };

}

/**
 * Generates edge data.
 *
 * @private
 * @param {DensityFunction} operation - A CSG operation.
 * @param {HermiteData} data - A target data set.
 * @param {Box3} bounds - Grid iteration limits.
 * @return {Object} The generated edge data.
 */

function generateEdges(operation, data, bounds) {

	const s = cellSize;
	const n = HermiteData.resolution;
	const m = n + 1;
	const mm = m * m;

	const indexOffsets = new Uint32Array([1, m, mm]);
	const materialIndices = data.materialIndices;

	const base = cellPosition;
	const offsetA = new Vector3();
	const offsetB = new Vector3();
	const edge = new Edge();

	const lengths = new Uint32Array(3);
	const edgeData = new EdgeData(n, EdgeData.calculate1DEdgeCount(n));

	let edges, zeroCrossings, normals, indexOffset;
	let indexA, indexB;

	let minX, minY, minZ;
	let maxX, maxY, maxZ;

	let c, d, a, axis;
	let x, y, z;

	// Process the edges along the X-axis, then Y and finally Z.
	for(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {

		// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
		axis = layout[a];

		edges = edgeData.indices[d];
		zeroCrossings = edgeData.zeroCrossings[d];
		normals = edgeData.normals[d];
		indexOffset = indexOffsets[d];

		minX = bounds.min.x; maxX = bounds.max.x;
		minY = bounds.min.y; maxY = bounds.max.y;
		minZ = bounds.min.z; maxZ = bounds.max.z;

		/* Include edges that straddle the bounding box and avoid processing grid
		points at chunk borders. */
		switch(d) {

			case 0:
				minX = Math.max(minX - 1, 0);
				maxX = Math.min(maxX, n - 1);
				break;

			case 1:
				minY = Math.max(minY - 1, 0);
				maxY = Math.min(maxY, n - 1);
				break;

			case 2:
				minZ = Math.max(minZ - 1, 0);
				maxZ = Math.min(maxZ, n - 1);
				break;

		}

		for(z = minZ; z <= maxZ; ++z) {

			for(y = minY; y <= maxY; ++y) {

				for(x = minX; x <= maxX; ++x) {

					indexA = z * mm + y * m + x;
					indexB = indexA + indexOffset;

					// Check if the edge exhibits a material change.
					if(materialIndices[indexA] !== materialIndices[indexB]) {

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

						// Create and store the edge data.
						operation.generateEdge(edge);

						edges[c] = indexA;
						zeroCrossings[c] = edge.t;
						normals[c * 3] = edge.n.x;
						normals[c * 3 + 1] = edge.n.y;
						normals[c * 3 + 2] = edge.n.z;

						++c;

					}

				}

			}

		}

		lengths[d] = c;

	}

	return { edgeData, lengths };

}

/**
 * Either generates or combines volume data based on the operation type.
 *
 * @private
 * @param {Operation} operation - A CSG operation.
 * @param {HermiteData} data0 - A target data set. May be empty or full.
 * @param {HermiteData} [data1] - A predominant data set. Cannot be null.
 */

function update(operation, data0, data1) {

	const bounds = computeIndexBounds(operation);

	let result, edgeData, lengths, d;
	let done = false;

	// Grid points.
	if(operation.type === OperationType.DENSITY_FUNCTION) {

		generateMaterialIndices(operation, data0, bounds);

	} else if(data0.empty) {

		if(operation.type === OperationType.UNION) {

			data0.set(data1);
			done = true;

		}

	} else {

		if(!(data0.full && operation.type === OperationType.UNION)) {

			combineMaterialIndices(operation, data0, data1, bounds);

		}

	}

	// Edges.
	if(!done && !data0.empty && !data0.full) {

		result = (operation.type === OperationType.DENSITY_FUNCTION) ?
			generateEdges(operation, data0, bounds) :
			combineEdges(operation, data0, data1);

		edgeData = result.edgeData;
		lengths = result.lengths;

		// Cut off empty data.
		for(d = 0; d < 3; ++d) {

			edgeData.indices[d] = edgeData.indices[d].slice(0, lengths[d]);
			edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);
			edgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);

		}

		data0.edgeData = edgeData;

	}

}

/**
 * Executes the given operation to generate data.
 *
 * @private
 * @param {Operation} operation - An operation.
 * @return {HermiteData} The generated data or null if the data is empty.
 */

function execute(operation) {

	const children = operation.children;

	let result, data;
	let i, l;

	if(operation.type === OperationType.DENSITY_FUNCTION) {

		// Create a data target.
		result = new HermiteData();

		// Use the density function to generate data.
		update(operation, result);

	}

	// Union, Difference or Intersection.
	for(i = 0, l = children.length; i < l; ++i) {

		// Generate the full result of the child operation recursively.
		data = execute(children[i]);

		if(result === undefined) {

			result = data;

		} else if(data !== null) {

			if(result === null) {

				if(operation.type === OperationType.UNION) {

					// Build upon the first non-empty data.
					result = data;

				}

			} else {

				// Combine the two data sets.
				update(operation, result, data);

			}

		} else if(operation.type === OperationType.INTERSECTION) {

			// An intersection with nothing results in nothing.
			result = null;

		}

		if(result === null && operation.type !== OperationType.UNION) {

			// Further subtractions and intersections would have no effect.
			break;

		}

	}

	return (result !== null && result.empty) ? null : result;

}

/**
 * Constructive Solid Geometry combines Signed Distance Functions by using
 * Boolean operators to generate and transform volume data.
 */

class ConstructiveSolidGeometry {

	/**
	 * Transforms the given Hermite data in two steps:
	 *
	 *  1. Generate data by executing the given SDF
	 *  2. Combine the generated data with the given data
	 *
	 * @param {Number[]} min - The lower bounds of the volume data cell.
	 * @param {Number} size - The size of the volume data cell.
	 * @param {HermiteData} data - The volume data that should be modified.
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {HermiteData} The modified, uncompressed data or null if the result is empty.
	 */

	static run(min, size, data, sdf) {

		cellPosition.fromArray(min);
		cellSize = size;

		if(data === null) {

			if(sdf.operation === OperationType.UNION) {

				// Prepare an empty target.
				data = new HermiteData(false);

			}

		} else {

			data.decompress();

		}

		// Step 1.
		let operation = sdf.toCSG();

		const generatedData = (data !== null) ? execute(operation) : null;

		if(generatedData !== null) {

			// Wrap the operation in a super operation.
			switch(sdf.operation) {

				case OperationType.UNION:
					operation = new Union(operation);
					break;

				case OperationType.DIFFERENCE:
					operation = new Difference(operation);
					break;

				case OperationType.INTERSECTION:
					operation = new Intersection(operation);
					break;

			}

			// Step 2.
			update(operation, data, generatedData);

			// Provoke an isosurface extraction.
			data.contoured = false;

		}

		return (data !== null && data.empty) ? null : data;

	}

}

/**
 * An empty set of Hermite data.
 *
 * @type {HermiteData}
 * @private
 * @final
 */

const data = new HermiteData(false);

/**
 * A volume data processor.
 *
 * @implements {TransferableContainer}
 */

class DataProcessor {

	/**
	 * Constructs a new data processor.
	 */

	constructor() {

		/**
		 * A set of Hermite data that will be used during processing.
		 *
		 * @type {HermiteData}
		 * @protected
		 */

		this.data = null;

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {DataMessage}
		 * @protected
		 */

		this.response = null;

	}

	/**
	 * Returns the data of this processor.
	 *
	 * @return {HermiteData} The data.
	 */

	getData() {

		return this.data;

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link DataProcessor#createTransferList}.
	 *
	 * @return {DataMessage} A response.
	 */

	respond() {

		this.response.data = this.data.serialize();

		return this.response;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		if(this.data !== null) {

			this.data.createTransferList(transferList);

		}

		return transferList;

	}

	/**
	 * Processes the given request.
	 *
	 * @param {DataMessage} request - A request.
	 * @return {DataProcessor} This processor.
	 */

	process(request) {

		this.data = data.deserialize(request.data);

		return this;

	}

}

/**
 * A surface extractor that generates a polygonal mesh from Hermite data.
 */

class SurfaceExtractor extends DataProcessor {

	/**
	 * Constructs a new surface extractor.
	 */

	constructor() {

		super();

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {ExtractionResponse}
		 */

		this.response = new ExtractionResponse();

		/**
		 * A target container for decompressed data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.decompressionTarget = new HermiteData(false);

		/**
		 * The result of the isosurface extraction process.
		 *
		 * @type {Isosurface}
		 * @private
		 */

		this.isosurface = null;

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link SurfaceExtractor#createTransferList}.
	 *
	 * @return {ExtractionResponse} A response.
	 */

	respond() {

		const response = super.respond();

		response.isosurface = (this.isosurface !== null) ? this.isosurface.serialise() : null;

		return response;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		super.createTransferList(transferList);

		return (this.isosurface !== null) ? this.isosurface.createTransferList(transferList) : transferList;

	}

	/**
	 * Extracts a surface from the given Hermite data.
	 *
	 * @param {ExtractionRequest} request - An extraction request.
	 */

	process(request) {

		// Adopt the provided data.
		const data = super.process(request).getData();

		// Decompress the data and build an SVO.
		const svo = new SparseVoxelOctree(data.decompress(this.decompressionTarget));

		// Generate the isosurface.
		this.isosurface = DualContouring.run(svo);

		// Release the decompressed data.
		this.decompressionTarget.clear();

		return this;

	}

}

/**
 * A modifier that applies CSG operations to Hermite data.
 */

class VolumeModifier extends DataProcessor {

	/**
	 * Constructs a new Hermite data modifier.
	 */

	constructor() {

		super();

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {ModificationResponse}
		 */

		this.response = new ModificationResponse();

		/**
		 * An SDF.
		 *
		 * @type {SignedDistanceFunction}
		 * @private
		 */

		this.sdf = null;

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link VolumeModifier#createTransferList}.
	 *
	 * @return {ModificationResponse} A response.
	 */

	respond() {

		// The container group contains the modified data.
		const response = super.respond();

		// Send the SDF back as it may contain transferable data.
		response.sdf = (this.sdf !== null) ? this.sdf.serialize() : null;

		return response;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		super.createTransferList(transferList);

		return (this.sdf !== null) ? this.sdf.createTransferList(transferList) : transferList;

	}

	/**
	 * Modifies the given Hermite data using the provided SDF.
	 *
	 * @param {ModificationRequest} request - A modification request.
	 */

	process(request) {

		// Adopt the provided data.
		const data = super.process(request).getData();

		// Revive the SDF.
		const sdf = this.sdf = SDFReviver.revive(request.sdf);

		// The resulting data is uncompressed.
		const result = ConstructiveSolidGeometry.run(request.cellPosition, request.cellSize, data, sdf);

		// Overwrite the data and compress it.
		super.data = (result !== null) ? result.compress() : null;

		return this;

	}

}

export { Action, BinaryUtils, Clipmap, ConfigurationMessage, ConstructiveSolidGeometry, DataMessage, DataProcessor, Deserializable, Difference, Disposable, DualContouring, Edge, EdgeData, EdgeIterator, ExtractionRequest, ExtractionResponse, FractalNoise, Givens, Heightfield, HermiteData, IntermediateWorldOctant, Intersection, Isosurface, KeyDesign, KeyIterator, Material, Message, ModificationRequest, ModificationResponse, OperationType, QEFData, QEFSolver, Queue, RunLengthEncoding, SDFLoader, SDFLoaderEvent, SDFType, Scene, Schur, Serializable, SignedDistanceFunction, SingularValueDecomposition, SparseVoxelOctree, SuperPrimitive, SuperPrimitivePreset, SurfaceExtractor, Terrain, TerrainEvent, ThreadPool, TransferableContainer, Union, VolumeModifier, Voxel, VoxelCell, WorkerEvent, WorldOctant, WorldOctantId, WorldOctantIterator, WorldOctantWrapper, WorldOctree, WorldOctreeCSG, WorldOctreeRaycaster };
