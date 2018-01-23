/**
 * rabbit-hole v0.0.0 build Jan 23 2018
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2018 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RABBITHOLE = {})));
}(this, (function (exports) { 'use strict';

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
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
		 * @return {Object} The serialised data.
		 */

		serialize(deflate = false) {

			throw new Error("Serializable#serialise method not implemented!");

		}

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
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @param {Object} object - Serialised data.
		 * @return {Deserializable} This object.
		 */

		deserialize(object) {

			throw new Error("Deserializable#deserialise method not implemented!");

		}

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
		 *
		 * @throws {Error} An error is thrown if the method is not overridden.
		 */

		dispose() {

			throw new Error("Disposable#dispose method not implemented!");

		}

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
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
		 * @return {Transferable[]} The transfer list. Null is not an acceptable value for the transferList.
		 */

		createTransferList(transferList = []) {

			throw new Error("TransferableContainer#createTransferList method not implemented!");

		}

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
	 * A basic event.
	 *
	 * @param {String} type - The name of the event.
	 */

	class Event {

		constructor(type) {

			/**
			 * The name of the event.
			 *
			 * @type {String}
			 */

			this.type = type;

			/**
			 * A reference to the target to which the event was originally dispatched.
			 *
			 * @type {Object}
			 * @default null
			 */

			this.target = null;

		}

	}

	/**
	 * A base class for objects that can receive events and may have listeners for
	 * them.
	 */

	class EventTarget {

		/**
		 * Constructs a new EventTarget.
		 */

		constructor() {

			/**
			 * A map of event listener functions.
			 *
			 * @type {Map}
			 */

			this.listenerFunctions = new Map();

			/**
			 * A map of event listener objects.
			 *
			 * @type {Map}
			 */

			this.listenerObjects = new Map();

		}

		/**
		 * Registers an event handler of a specific event type on the event target.
		 *
		 * @param {String} type - The event type to listen for.
		 * @param {Object} listener - The object that receives a notification when an event of the specified type occurs.
		 */

		addEventListener(type, listener) {

			const m = (typeof listener === "function") ? this.listenerFunctions : this.listenerObjects;

			if(m.has(type)) {

				m.get(type).add(listener);

			} else {

				m.set(type, new Set([listener]));

			}

		}

		/**
		 * Removes an event handler of a specific event type from the event target.
		 *
		 * @param {String} type - The event type to remove.
		 * @param {Object} listener - The event listener to remove from the event target.
		 */

		removeEventListener(type, listener) {

			const m = (typeof listener === "function") ? this.listenerFunctions : this.listenerObjects;

			let listeners;

			if(m.has(type)) {

				listeners = m.get(type);
				listeners.delete(listener);

				if(listeners.size === 0) {

					m.delete(type);

				}

			}

		}

		/**
		 * Dispatches an event at the specified event target, invoking the affected
		 * event listeners in the appropriate order.
		 *
		 * @param {Event} event - The event to dispatch.
		 * @param {EventTarget} [target] - An event target.
		 */

		dispatchEvent(event, target = this) {

			const listenerFunctions = target.listenerFunctions;
			const listenerObjects = target.listenerObjects;

			let listeners;
			let listener;

			event.target = target;

			if(listenerFunctions.has(event.type)) {

				listeners = listenerFunctions.get(event.type);

				for(listener of listeners) {

					listener.call(target, event);

				}

			}

			if(listenerObjects.has(event.type)) {

				listeners = listenerObjects.get(event.type);

				for(listener of listeners) {

					listener.handleEvent(event);

				}

			}

		}

	}

	/**
	 * A collection of event classes.
	 *
	 * @module synthetic-event
	 */

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
	 * A vector with three components.
	 */

	class Vector3 {

		/**
		 * Constructs a new vector.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 * @param {Number} [z=0] - The Z component.
		 */

		constructor(x = 0, y = 0, z = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

			/**
			 * The Z component.
			 *
			 * @type {Number}
			 */

			this.z = z;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @param {Number} z - The Z component.
		 * @return {Vector3} This vector.
		 */

		set(x, y, z) {

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		}

		/**
		 * Clones this vector.
		 *
		 * @return {Vector3} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector3} This vector.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;

			return array;

		}

		/**
		 * Sets the values of this vector based on a spherical description.
		 *
		 * @param {Spherical} s - A spherical description.
		 * @return {Vector3} This vector.
		 */

		setFromSpherical(s) {

			const sinPhiRadius = Math.sin(s.phi) * s.radius;

			this.x = sinPhiRadius * Math.sin(s.theta);
			this.y = Math.cos(s.phi) * s.radius;
			this.z = sinPhiRadius * Math.cos(s.theta);

			return this;

		}

		/**
		 * Sets the values of this vector based on a cylindrical description.
		 *
		 * @param {Cylindrical} c - A cylindrical description.
		 * @return {Vector3} This vector.
		 */

		setFromCylindrical(c) {

			this.x = c.radius * Math.sin(c.theta);
			this.y = c.y;
			this.z = c.radius * Math.cos(c.theta);

			return this;

		}

		/**
		 * Copies the values of a matrix column.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @param {Number} index - A column index of the range [0, 2].
		 * @return {Vector3} This vector.
		 */

		setFromMatrixColumn(m, index) {

			return this.fromArray(m.elements, index * 4);

		}

		/**
		 * Extracts the position from a matrix.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @return {Vector3} This vector.
		 */

		setFromMatrixPosition(m) {

			const me = m.elements;

			this.x = me[12];
			this.y = me[13];
			this.z = me[14];

			return this;

		}

		/**
		 * Extracts the scale from a matrix.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @return {Vector3} This vector.
		 */

		setFromMatrixScale(m) {

			const sx = this.setFromMatrixColumn(m, 0).length();
			const sy = this.setFromMatrixColumn(m, 1).length();
			const sz = this.setFromMatrixColumn(m, 2).length();

			this.x = sx;
			this.y = sy;
			this.z = sz;

			return this;

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @param {Vector3} v - The vector to add.
		 * @return {Vector3} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @param {Number} s - The scalar to add.
		 * @return {Vector3} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @param {Vector3} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @param {Vector3} v - The vector to subtract.
		 * @return {Vector3} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		}

		/**
		 * Subtracts a scalar from this vector.
		 *
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector3} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - A second vector.
		 * @return {Vector3} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		multiplyScalar(s) {

			this.x *= s;
			this.y *= s;
			this.z *= s;

			return this;

		}

		/**
		 * Sets this vector to the product of two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		multiplyVectors(a, b) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		divideScalar(s) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

			return this;

		}

		/**
		 * Sets this vector to the cross product of the given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		crossVectors(a, b) {

			const ax = a.x, ay = a.y, az = a.z;
			const bx = b.x, by = b.y, bz = b.z;

			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;

			return this;

		}

		/**
		 * Calculates the cross product of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		cross(v) {

			return this.crossVectors(this, v);

		}

		/**
		 * Applies a matrix to this direction vector.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		transformDirection(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z;
			this.y = e[1] * x + e[5] * y + e[9] * z;
			this.z = e[2] * x + e[6] * y + e[10] * z;

			return this.normalize();

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix3(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[3] * y + e[6] * z;
			this.y = e[1] * x + e[4] * y + e[7] * z;
			this.z = e[2] * x + e[5] * y + e[8] * z;

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix4(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

			return this;

		}

		/**
		 * Applies a quaternion to this vector.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Vector3} This vector.
		 */

		applyQuaternion(q) {

			const x = this.x, y = this.y, z = this.z;
			const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

			// Calculate: quaternion * vector.
			const ix = qw * x + qy * z - qz * y;
			const iy = qw * y + qz * x - qx * z;
			const iz = qw * z + qx * y - qy * x;
			const iw = -qx * x - qy * y - qz * z;

			// Calculate: result * inverse quaternion.
			this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		}

		/**
		 * Reflects this vector. The given plane normal is assumed to be normalized.
		 *
		 * @param {Vector3} n - A normal.
		 * @return {Vector3} This vector.
		 */

		reflect(n, target = new Vector3()) {

			const nx = n.x;
			const ny = n.y;
			const nz = n.z;

			this.sub(n.multiplyScalar(2 * this.dot(n)));

			// Restore the normal.
			n.set(nx, ny, nz);

			return this;

		}

		/**
		 * Computes the angle to the given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The angle in radians.
		 */

		angleTo(v) {

			const theta = this.dot(v) / (Math.sqrt(this.lengthSquared() * v.lengthSquared()));

			// Clamp to avoid numerical problems.
			return Math.acos(Math.min(Math.max(theta, -1), 1));

		}

		/**
		 * Calculates the Manhattan length of this vector.
		 *
		 * @return {Number} The length.
		 */

		manhattanLength() {

			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

		}

		/**
		 * Calculates the Manhattan distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The distance.
		 */

		manhattanDistanceTo(v) {

			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;
			const dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Normalizes this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Sets the length of this vector.
		 *
		 * @param {Number} length - The new length.
		 * @return {Vector3} This vector.
		 */

		setLength(length) {

			return this.normalize().multiplyScalar(length);

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);

			return this;

		}

		/**
		 * Adopts the max value for each component of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @param {Vector3} min - The lower bounds. Assumed to be smaller than max.
		 * @param {Vector3} max - The upper bounds. Assumed to be greater than min.
		 * @return {Vector3} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));
			this.z = Math.max(min.z, Math.min(max.z, this.z));

			return this;

		}

		/**
		 * Floors this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.z = Math.floor(this.z);

			return this;

		}

		/**
		 * Ceils this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			this.z = Math.ceil(this.z);

			return this;

		}

		/**
		 * Rounds this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			this.z = Math.round(this.z);

			return this;

		}

		/**
		 * Lerps towards the given vector.
		 *
		 * @param {Vector3} v - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector3} This vector.
		 */

		lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;
			this.z += (v.z - this.z) * alpha;

			return this;

		}

		/**
		 * Sets this vector to the lerp result of the given vectors.
		 *
		 * @param {Vector3} v1 - A base vector.
		 * @param {Vector3} v2 - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector3} This vector.
		 */

		lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y && v.z === this.z);

		}

	}

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v = new Vector3();

	/**
	 * A list of points.
	 *
	 * @type {Vector3[]}
	 * @private
	 */

	const points = [
		new Vector3(),
		new Vector3(),
		new Vector3(),
		new Vector3(),
		new Vector3(),
		new Vector3(),
		new Vector3(),
		new Vector3()
	];

	/**
	 * A 3D box.
	 */

	class Box3 {

		/**
		 * Constructs a new box.
		 *
		 * @param {Vector3} [min] - The lower bounds.
		 * @param {Vector3} [max] - The upper bounds.
		 */

		constructor(
			min = new Vector3(Infinity, Infinity, Infinity),
			max = new Vector3(-Infinity, -Infinity, -Infinity)
		) {

			/**
			 * The lower bounds.
			 *
			 * @type {Vector3}
			 */

			this.min = min;

			/**
			 * The upper bounds.
			 *
			 * @type {Vector3}
			 */

			this.max = max;

		}

		/**
		 * Sets the values of this box.
		 *
		 * @param {Vector3} min - The lower bounds.
		 * @param {Vector3} max - The upper bounds.
		 * @return {Box3} This box.
		 */

		set(min, max) {

			this.min.copy(min);
			this.max.copy(max);

			return this;

		}

		/**
		 * Copies the values of a given box.
		 *
		 * @param {Box3} b - A box.
		 * @return {Box3} This box.
		 */

		copy(b) {

			this.min.copy(b.min);
			this.max.copy(b.max);

			return this;

		}

		/**
		 * Clones this box.
		 *
		 * @return {Box3} A clone of this box.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Makes this box empty.
		 *
		 * The lower bounds are set to infinity and the upper bounds to negative
		 * infinity to create an infinitely small box.
		 *
		 * @return {Box3} This box.
		 */

		makeEmpty() {

			this.min.x = this.min.y = this.min.z = Infinity;
			this.max.x = this.max.y = this.max.z = -Infinity;

			return this;

		}

		/**
		 * Indicates whether this box is truly empty.
		 *
		 * This is a more robust check for emptiness since the volume can get positive
		 * with two negative axes.
		 *
		 * @return {Box3} This box.
		 */

		isEmpty() {

			return (
				this.max.x < this.min.x ||
				this.max.y < this.min.y ||
				this.max.z < this.min.z
			);

		}

		/**
		 * Computes the center of this box.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the center of this box.
		 */

		getCenter(target = new Vector3()) {

			return !this.isEmpty() ?
				target.addVectors(this.min, this.max).multiplyScalar(0.5) :
				target.set(0, 0, 0);

		}

		/**
		 * Computes the size of this box.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the size of this box.
		 */

		getSize(target = new Vector3()) {

			return !this.isEmpty() ?
				target.subVectors(this.max, this.min) :
				target.set(0, 0, 0);

		}

		/**
		 * Computes the bounding sphere of this box.
		 *
		 * @param {Sphere} [target] - A target sphere. If none is provided, a new one will be created.
		 * @return {Sphere} The bounding sphere of this box.
		 */

		getBoundingSphere(target = new Sphere()) {

			this.getCenter(target.center);

			target.radius = this.getSize(v).length() * 0.5;

			return target;

		}

		/**
		 * Expands this box by the given point.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Box3} This box.
		 */

		expandByPoint(p) {

			this.min.min(p);
			this.max.max(p);

			return this;

		}

		/**
		 * Expands this box by the given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Box3} This box.
		 */

		expandByVector(v) {

			this.min.sub(v);
			this.max.add(v);

			return this;

		}

		/**
		 * Expands this box by the given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Box3} This box.
		 */

		expandByScalar(s) {

			this.min.addScalar(-s);
			this.max.addScalar(s);

			return this;

		}

		/**
		 * Defines this box by the given points.
		 *
		 * @param {Vector3[]} points - The points.
		 * @return {Box3} This box.
		 */

		setFromPoints(points) {

			let i, l;

			this.min.set(0, 0, 0);
			this.max.set(0, 0, 0);

			for(i = 0, l = points.length; i < l; ++i) {

				this.expandByPoint(points[i]);

			}

			return this;

		}

		/**
		 * Defines this box by the given center and size.
		 *
		 * @param {Vector3} center - The center.
		 * @param {Number} size - The size.
		 * @return {Box3} This box.
		 */

		setFromCenterAndSize(center, size) {

			const halfSize = v.copy(size).multiplyScalar(0.5);

			this.min.copy(center).sub(halfSize);
			this.max.copy(center).add(halfSize);

			return this;

		}

		/**
		 * Clamps the given point to the boundaries of this box.
		 *
		 * @param {Vector3} p - A point.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The clamped point.
		 */

		clampPoint(point, target = new Vector3()) {

			return target.copy(point).clamp(this.min, this.max);

		}

		/**
		 * Calculates the distance from this box to the given point.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Number} The distance.
		 */

		distanceToPoint(p) {

			const clampedPoint = v.copy(p).clamp(this.min, this.max);

			return clampedPoint.sub(p).length();

		}

		/**
		 * Applies the given matrix to this box.
		 *
		 * @param {Matrix4} m - The matrix.
		 * @return {Box3} This box.
		 */

		applyMatrix4(m) {

			const min = this.min;
			const max = this.max;

			if(!this.isEmpty()) {

				points[0].set(min.x, min.y, min.z).applyMatrix4(m);
				points[1].set(min.x, min.y, max.z).applyMatrix4(m);
				points[2].set(min.x, max.y, min.z).applyMatrix4(m);
				points[3].set(min.x, max.y, max.z).applyMatrix4(m);
				points[4].set(max.x, min.y, min.z).applyMatrix4(m);
				points[5].set(max.x, min.y, max.z).applyMatrix4(m);
				points[6].set(max.x, max.y, min.z).applyMatrix4(m);
				points[7].set(max.x, max.y, max.z).applyMatrix4(m);

				this.setFromPoints(points);

			}

			return this;

		}

		/**
		 * Translates this box.
		 *
		 * @param {Vector3} offset - The offset.
		 * @return {Box3} This box.
		 */

		translate(offset) {

			this.min.add(offset);
			this.max.add(offset);

			return this;

		}

		/**
		 * Intersects this box with the given one.
		 *
		 * @param {Box3} b - A box.
		 * @return {Box3} This box.
		 */

		intersect(b) {

			this.min.max(b.min);
			this.max.min(b.max);

			/* Ensure that if there is no overlap, the result is fully empty to prevent
			subsequent intersections to erroneously return valid values. */
			if(this.isEmpty()) {

				this.makeEmpty();

			}

			return this;

		}

		/**
		 * Expands this box by combining it with the given one.
		 *
		 * @param {Box3} b - A box.
		 * @return {Box3} This box.
		 */

		union(b) {

			this.min.min(b.min);
			this.max.max(b.max);

			return this;

		}

		/**
		 * Checks if the given point lies inside this box.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Boolean} Whether this box contains the point.
		 */

		containsPoint(p) {

			const min = this.min;
			const max = this.max;

			return (
				p.x >= min.x &&
				p.y >= min.y &&
				p.z >= min.z &&
				p.x <= max.x &&
				p.y <= max.y &&
				p.z <= max.z
			);

		}

		/**
		 * Checks if the given box lies inside this box.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether this box contains the given one.
		 */

		containsBox(b) {

			const tMin = this.min;
			const tMax = this.max;
			const bMin = b.min;
			const bMax = b.max;

			return (
				tMin.x <= bMin.x && bMax.x <= tMax.x &&
				tMin.y <= bMin.y && bMax.y <= tMax.y &&
				tMin.z <= bMin.z && bMax.z <= tMax.z
			);

		}

		/**
		 * Checks if this box intersects the given one.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether the boxes intersect.
		 */

		intersectsBox(b) {

			const tMin = this.min;
			const tMax = this.max;
			const bMin = b.min;
			const bMax = b.max;

			return (
				bMax.x >= tMin.x &&
				bMax.y >= tMin.y &&
				bMax.z >= tMin.z &&
				bMin.x <= tMax.x &&
				bMin.y <= tMax.y &&
				bMin.z <= tMax.z
			);

		}

		/**
		 * Checks if this box intersects the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Boolean} Whether the box intersects the sphere.
		 */

		intersectsSphere(s) {

			// Find the point in this box that is closest to the sphere's center.
			const closestPoint = this.clampPoint(s.center, v);

			// If that point is inside the sphere, it intersects this box.
			return (closestPoint.distanceToSquared(s.center) <= (s.radius * s.radius));

		}

		/**
		 * Checks if this box intersects the given plane.
		 *
		 * Computes the minimum and maximum dot product values. If those values are on
		 * the same side (back or front) of the plane, then there is no intersection.
		 *
		 * @param {Plane} p - A plane.
		 * @return {Boolean} Whether the box intersects the plane.
		 */

		intersectsPlane(p) {

			let min, max;

			if(p.normal.x > 0) {

				min = p.normal.x * this.min.x;
				max = p.normal.x * this.max.x;

			} else {

				min = p.normal.x * this.max.x;
				max = p.normal.x * this.min.x;

			}

			if(p.normal.y > 0) {

				min += p.normal.y * this.min.y;
				max += p.normal.y * this.max.y;

			} else {

				min += p.normal.y * this.max.y;
				max += p.normal.y * this.min.y;

			}

			if(p.normal.z > 0) {

				min += p.normal.z * this.min.z;
				max += p.normal.z * this.max.z;

			} else {

				min += p.normal.z * this.max.z;
				max += p.normal.z * this.min.z;

			}

			return (min <= p.constant && max >= p.constant);

		}

		/**
		 * Checks if this box equals the given one.
		 *
		 * @param {Box3} v - A box.
		 * @return {Boolean} Whether this box equals the given one.
		 */

		equals(b) {

			return (b.min.equals(this.min) && b.max.equals(this.max));

		}

	}

	/**
	 * A box.
	 *
	 * @type {Box3}
	 * @private
	 */

	const box = new Box3();

	/**
	 * A sphere.
	 */

	class Sphere {

		/**
		 * Constructs a new sphere.
		 *
		 * @param {Vector3} [center] - The center.
		 * @param {Number} [radius] - The radius.
		 */

		constructor(center = new Vector3(), radius = 0) {

			/**
			 * The center.
			 *
			 * @type {Vector3}
			 */

			this.center = center;

			/**
			 * The radius.
			 *
			 * @type {Number}
			 */

			this.radius = radius;

		}

		/**
		 * Sets the center and the radius.
		 *
		 * @param {Vector3} center - The center.
		 * @param {Number} radius - The radius.
		 * @return {Sphere} This sphere.
		 */

		set(center, radius) {

			this.center.copy(center);
			this.radius = radius;

			return this;

		}

		/**
		 * Copies the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Sphere} This sphere.
		 */

		copy(s) {

			this.center.copy(s.center);
			this.radius = s.radius;

			return this;

		}

		/**
		 * Clones this sphere.
		 *
		 * @return {Sphere} The cloned sphere.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Sets this sphere from points.
		 *
		 * @param {Vector3[]} points - The points.
		 * @param {Vector3} [center] - An optional center.
		 * @return {Sphere} This sphere.
		 */

		setFromPoints(points, center = box.setFromPoints(points).getCenter(this.center)) {

			let maxRadiusSq = 0;
			let i, l;

			for(i = 0, l = points.length; i < l; ++i) {

				maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));

			}

			this.radius = Math.sqrt(maxRadiusSq);

			return this;

		}

		/**
		 * Calculates the bounding box of this sphere.
		 *
		 * @param {Box3} [target] - A target sphere. If none is provided, a new one will be created.
		 * @return {Box3} The bounding box.
		 */

		getBoundingBox(target = new Box3()) {

			target.set(this.center, this.center);
			target.expandByScalar(this.radius);

			return target;

		}

		/**
		 * Checks if this sphere is empty.
		 *
		 * @return {Boolean} Whether this sphere is empty.
		 */

		isEmpty() {

			return (this.radius <= 0);

		}

		/**
		 * Translates this sphere.
		 *
		 * @param {Number} offset - An offset.
		 * @return {Sphere} This sphere.
		 */

		translate(offset) {

			this.center.add(offset);

			return this;

		}

		/**
		 * Clamps the given point to this sphere.
		 *
		 * @param {Vector3} p - A point.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The clamped point.
		 */

		clampPoint(p, target = new Vector3()) {

			const deltaLengthSq = this.center.distanceToSquared(p);

			target.copy(p);

			if(deltaLengthSq > (this.radius * this.radius)) {

				target.sub(this.center).normalize();
				target.multiplyScalar(this.radius).add(this.center);

			}

			return target;

		}

		/**
		 * Calculates the distance from this sphere to the given point.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Number} The distance.
		 */

		distanceToPoint(p) {

			return (p.distanceTo(this.center) - this.radius);

		}

		/**
		 * Checks if the given point lies inside this sphere.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Boolean} Whether this sphere contains the point.
		 */

		containsPoint(p) {

			return (p.distanceToSquared(this.center) <= (this.radius * this.radius));

		}

		/**
		 * Checks if the this sphere intersects with the given one.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Boolean} Whether this sphere intersects with the given one.
		 */

		intersectsSphere(s) {

			const radiusSum = this.radius + s.radius;

			return s.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);

		}

		/**
		 * Checks if the this sphere intersects with the given box.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether this sphere intersects with the given box.
		 */

		intersectsBox(b) {

			return b.intersectsSphere(this);

		}

		/**
		 * Checks if the this sphere intersects with the given plane.
		 *
		 * @param {Plane} p - A plane.
		 * @return {Boolean} Whether this sphere intersects with the given plane.
		 */

		intersectsPlane(p) {

			return (Math.abs(p.distanceToPoint(this.center)) <= this.radius);

		}

		/**
		 * Checks if this sphere equals the given one.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Boolean} Whether the spheres are equal.
		 */

		equals(s) {

			return (s.center.equals(this.center) && (s.radius === this.radius));

		}

	}

	/**
	 * A vector with two components.
	 */

	class Vector2 {

		/**
		 * Constructs a new vector.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 */

		constructor(x = 0, y = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

		}

		/**
		 * The width. This is an alias for X.
		 *
		 * @type {Number}
		 */

		get width() {

			return this.x;

		}

		/**
		 * Sets the width.
		 *
		 * @type {Number}
		 */

		set width(value) {

			return this.x = value;

		}

		/**
		 * The height. This is an alias for Y.
		 *
		 * @type {Number}
		 */

		get height() {

			return this.y;

		}

		/**
		 * Sets the height.
		 *
		 * @type {Number}
		 */

		set height(value) {

			return this.y = value;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @return {Vector2} This vector.
		 */

		set(x, y) {

			this.x = x;
			this.y = y;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;

			return this;

		}

		/**
		 * Clones this vector.
		 *
		 * @return {Vector2} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector2} This vector.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;

			return array;

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @param {Vector2} v - The vector to add.
		 * @return {Vector2} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @param {Number} s - The scalar to add.
		 * @return {Vector2} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @param {Vector2} a - A vector.
		 * @param {Vector2} b - Another vector.
		 * @return {Vector2} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @param {Vector2} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @param {Vector2} v - The vector to subtract.
		 * @return {Vector2} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;

			return this;

		}

		/**
		 * Subtracts a scalar from this vector.
		 *
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector2} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @param {Vector2} a - A vector.
		 * @param {Vector2} b - A second vector.
		 * @return {Vector2} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		multiplyScalar(s) {

			this.x *= s;
			this.y *= s;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		divideScalar(s) {

			this.x /= s;
			this.y /= s;

			return this;

		}

		/**
		 * Applies the given matrix to this vector.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Vector2} This vector.
		 */

		applyMatrix3(m) {

			const x = this.x, y = this.y;
			const e = m.elements;

			this.x = e[0] * x + e[3] * y + e[6];
			this.y = e[1] * x + e[4] * y + e[7];

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y;

		}

		/**
		 * Calculates the Manhattan length of this vector.
		 *
		 * @return {Number} The length.
		 */

		manhattanLength() {

			return Math.abs(this.x) + Math.abs(this.y);

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return this.x * this.x + this.y * this.y;

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y);

		}

		/**
		 * Calculates the Manhattan distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The squared distance.
		 */

		manhattanDistanceTo(v) {

			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;

			return dx * dx + dy * dy;

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Normalizes this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Sets the length of this vector.
		 *
		 * @param {Number} length - The new length.
		 * @return {Vector2} This vector.
		 */

		setLength(length) {

			return this.normalize().multiplyScalar(length);

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);

			return this;

		}

		/**
		 * adopts the max value for each component of this vector and the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @param {Vector2} min - A vector, assumed to be smaller than max.
		 * @param {Vector2} max - A vector, assumed to be greater than min.
		 * @return {Vector2} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));

			return this;

		}

		/**
		 * Floors this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

			return this;

		}

		/**
		 * Ceils this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);

			return this;

		}

		/**
		 * Rounds this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;

			return this;

		}

		/**
		 * Computes the angle in radians with respect to the positive X-axis.
		 *
		 * @return {Number} The angle.
		 */

		angle() {

			let angle = Math.atan2(this.y, this.x);

			if(angle < 0) {

				angle += 2 * Math.PI;

			}

			return angle;

		}

		/**
		 * Lerps towards the given vector.
		 *
		 * @param {Vector2} v - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector2} This vector.
		 */

		lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;

			return this;

		}

		/**
		 * Sets this vector to the lerp result of the given vectors.
		 *
		 * @param {Vector2} v1 - A base vector.
		 * @param {Vector2} v2 - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector2} This vector.
		 */

		lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		}

		/**
		 * Rotates this vector around a given center.
		 *
		 * @param {Vector2} center - The center.
		 * @param {Number} angle - The rotation in radians.
		 * @return {Vector2} This vector.
		 */

		rotateAround(center, angle) {

			const c = Math.cos(angle), s = Math.sin(angle);

			const x = this.x - center.x;
			const y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y);

		}

	}

	/**
	 * A 2D box.
	 */

	/**
	 * A cylindrical coordinate system.
	 *
	 * For details see: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
	 */

	/**
	 * A 3x3 matrix.
	 */

	class Matrix3 {

		/**
		 * Constructs a new matrix.
		 */

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @type {Float32Array}
			 */

			this.elements = new Float32Array([

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
		 * @param {Number} m00 - The value of the first row, first column.
		 * @param {Number} m01 - The value of the first row, second column.
		 * @param {Number} m02 - The value of the first row, third column.
		 * @param {Number} m10 - The value of the second row, first column.
		 * @param {Number} m11 - The value of the second row, second column.
		 * @param {Number} m12 - The value of the second row, third column.
		 * @param {Number} m20 - The value of the third row, first column.
		 * @param {Number} m21 - The value of the third row, second column.
		 * @param {Number} m22 - The value of the third row, third column.
		 * @return {Matrix3} This matrix.
		 */

		set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

			const te = this.elements;

			te[0] = m00; te[3] = m01; te[6] = m02;
			te[1] = m10; te[4] = m11; te[7] = m12;
			te[2] = m20; te[5] = m21; te[8] = m22;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @return {Matrix3} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		}

		/**
		 * Copies the values of a given matrix.
		 *
		 * @param {Matrix3} matrix - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		copy(matrix) {

			const me = matrix.elements;
			const te = this.elements;

			te[0] = me[0]; te[1] = me[1]; te[2] = me[2];
			te[3] = me[3]; te[4] = me[4]; te[5] = me[5];
			te[6] = me[6]; te[7] = me[7]; te[8] = me[8];

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @return {Matrix3} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().fromArray(this.elements);

		}

		/**
		 * Copies the values of a given array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Matrix3} This matrix.
		 */

		fromArray(array, offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 9; ++i) {

				te[i] = array[i + offset];

			}

			return this;

		}

		/**
		 * Stores this matrix in an array.
		 *
		 * @param {Number[]} [array] - A target array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 9; ++i) {

				array[i + offset] = te[i];

			}

			return array;

		}

		/**
		 * Sets this matrix to the product of the given matrices.
		 *
		 * @param {Matrix3} a - A matrix.
		 * @param {Matrix3} b - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		multiplyMatrices(a, b) {

			const ae = a.elements;
			const be = b.elements;
			const te = this.elements;

			const a11 = ae[0], a12 = ae[3], a13 = ae[6];
			const a21 = ae[1], a22 = ae[4], a23 = ae[7];
			const a31 = ae[2], a32 = ae[5], a33 = ae[8];

			const b11 = be[0], b12 = be[3], b13 = be[6];
			const b21 = be[1], b22 = be[4], b23 = be[7];
			const b31 = be[2], b32 = be[5], b33 = be[8];

			te[0] = a11 * b11 + a12 * b21 + a13 * b31;
			te[3] = a11 * b12 + a12 * b22 + a13 * b32;
			te[6] = a11 * b13 + a12 * b23 + a13 * b33;

			te[1] = a21 * b11 + a22 * b21 + a23 * b31;
			te[4] = a21 * b12 + a22 * b22 + a23 * b32;
			te[7] = a21 * b13 + a22 * b23 + a23 * b33;

			te[2] = a31 * b11 + a32 * b21 + a33 * b31;
			te[5] = a31 * b12 + a32 * b22 + a33 * b32;
			te[8] = a31 * b13 + a32 * b23 + a33 * b33;

			return this;

		}

		/**
		 * Multiplies this matrix with a given one.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		multiply(m) {

			return this.multiplyMatrices(this, m);

		}

		/**
		 * Multiplies a given matrix with this one.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		premultiply(m) {

			return this.multiplyMatrices(m, this);

		}

		/**
		 * Multiplies this matrix with a given scalar.
		 *
		 * @param {Number} m - A scalar.
		 * @return {Matrix3} This matrix.
		 */

		multiplyScalar(s) {

			const te = this.elements;

			te[0] *= s; te[3] *= s; te[6] *= s;
			te[1] *= s; te[4] *= s; te[7] *= s;
			te[2] *= s; te[5] *= s; te[8] *= s;

			return this;

		}

		/**
		 * Calculates the determinant of this matrix.
		 *
		 * @return {Number} The determinant.
		 */

		determinant() {

			const te = this.elements;

			const a = te[0], b = te[1], c = te[2];
			const d = te[3], e = te[4], f = te[5];
			const g = te[6], h = te[7], i = te[8];

			return (

				a * e * i -
				a * f * h -
				b * d * i +
				b * f * g +
				c * d * h -
				c * e * g

			);

		}

		/**
		 * Inverts the given matrix and stores the result in this matrix.
		 *
		 * @param {Matrix3} matrix - The matrix that should be inverted.
		 * @return {Matrix3} This matrix.
		 */

		getInverse(matrix) {

			const me = matrix.elements;
			const te = this.elements;

			const n11 = me[0], n21 = me[1], n31 = me[2];
			const n12 = me[3], n22 = me[4], n32 = me[5];
			const n13 = me[6], n23 = me[7], n33 = me[8];

			const t11 = n33 * n22 - n32 * n23;
			const t12 = n32 * n13 - n33 * n12;
			const t13 = n23 * n12 - n22 * n13;

			const det = n11 * t11 + n21 * t12 + n31 * t13;

			let invDet;

			if(det !== 0) {

				invDet = 1.0 / det;

				te[0] = t11 * invDet;
				te[1] = (n31 * n23 - n33 * n21) * invDet;
				te[2] = (n32 * n21 - n31 * n22) * invDet;

				te[3] = t12 * invDet;
				te[4] = (n33 * n11 - n31 * n13) * invDet;
				te[5] = (n31 * n12 - n32 * n11) * invDet;

				te[6] = t13 * invDet;
				te[7] = (n21 * n13 - n23 * n11) * invDet;
				te[8] = (n22 * n11 - n21 * n12) * invDet;

			} else {

				console.error("Can't invert matrix, determinant is zero", matrix);

				this.identity();

			}

			return this;

		}

		/**
		 * Transposes this matrix.
		 *
		 * @return {Matrix3} This matrix.
		 */

		transpose() {

			const me = this.elements;

			let t;

			t = me[1]; me[1] = me[3]; me[3] = t;
			t = me[2]; me[2] = me[6]; me[6] = t;
			t = me[5]; me[5] = me[7]; me[7] = t;

			return this;

		}

		/**
		 * Scales this matrix.
		 *
		 * @param {Number} sx - The X scale.
		 * @param {Number} sy - The Y scale.
		 * @return {Matrix3} This matrix.
		 */

		scale(sx, sy) {

			const te = this.elements;

			te[0] *= sx; te[3] *= sx; te[6] *= sx;
			te[1] *= sy; te[4] *= sy; te[7] *= sy;

			return this;

		}

		/**
		 * Rotates this matrix.
		 *
		 * @param {Number} theta - The rotation.
		 * @return {Matrix3} This matrix.
		 */

		rotate(theta) {

			const c = Math.cos(theta);
			const s = Math.sin(theta);

			const te = this.elements;

			const a11 = te[0], a12 = te[3], a13 = te[6];
			const a21 = te[1], a22 = te[4], a23 = te[7];

			te[0] = c * a11 + s * a21;
			te[3] = c * a12 + s * a22;
			te[6] = c * a13 + s * a23;

			te[1] = -s * a11 + c * a21;
			te[4] = -s * a12 + c * a22;
			te[7] = -s * a13 + c * a23;

			return this;

		}

		/**
		 * Translates this matrix.
		 *
		 * @param {Number} tx - The X offset.
		 * @param {Number} ty - The Y offset.
		 * @return {Matrix3} This matrix.
		 */

		translate(tx, ty) {

			const te = this.elements;

			te[0] += tx * te[2]; te[3] += tx * te[5]; te[6] += tx * te[8];
			te[1] += ty * te[2]; te[4] += ty * te[5]; te[7] += ty * te[8];

			return this;

		}

		/**
		 * Checks if this matrix equals the given one.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Boolean} Whether the matrix are equal.
		 */

		equals(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			let result = true;
			let i;

			for(i = 0; result && i < 9; ++i) {

				if(te[i] !== me[i]) {

					result = false;

				}

			}

			return result;

		}

	}

	/**
	 * An enumeration of Euler rotation orders.
	 *
	 * @type {Object}
	 * @property {Number} XYZ - X -> Y -> Z.
	 * @property {Number} YZX - Y -> Z -> X.
	 * @property {Number} ZXY - Z -> X -> Y.
	 * @property {Number} XZY - X -> Z -> Y.
	 * @property {Number} YXZ - Y -> X -> Z.
	 * @property {Number} ZYX - Z -> Y -> X.
	 */

	const RotationOrder = {

		XYZ: 0,
		YZX: 1,
		ZXY: 2,
		XZY: 3,
		YXZ: 4,
		ZYX: 5

	};

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$2 = new Vector3();

	/**
	 * A quaternion.
	 */

	class Quaternion {

		/**
		 * Constructs a new quaternion.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 * @param {Number} [z=0] - The Z component.
		 * @param {Number} [w=0] - The W component.
		 */

		constructor(x = 0, y = 0, z = 0, w = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

			/**
			 * The Z component.
			 *
			 * @type {Number}
			 */

			this.z = z;

			/**
			 * The W component.
			 *
			 * @type {Number}
			 */

			this.w = w;

		}

		/**
		 * Sets the components of this quaternion.
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @param {Number} z - The Z component.
		 * @param {Number} w - The W component.
		 * @return {Quaternion} This quaternion.
		 */

		set(x, y, z, w) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

			return this;

		}

		/**
		 * Copies the components of the given quaternion.
		 *
		 * @param {Quaternion} q - The quaternion.
		 * @return {Quaternion} This quaternion.
		 */

		copy(q) {

			this.x = q.x;
			this.y = q.y;
			this.z = q.z;
			this.w = q.w;

			return this;

		}

		/**
		 * Clones this quaternion.
		 *
		 * @return {Quaternion} The cloned quaternion.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z, this.w);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Quaternion} This quaternion.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];
			this.w = array[offset + 3];

			return this;

		}

		/**
		 * Stores this quaternion in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;
			array[offset + 3] = this.w;

			return array;

		}

		/**
		 * Sets the components of this quaternion based on the given Euler angles.
		 *
		 * For more details see: https://goo.gl/XRD1kr
		 *
		 * @param {Euler} euler - The euler angles.
		 * @return {Quaternion} This quaternion.
		 */

		setFromEuler(euler) {

			const x = euler.x;
			const y = euler.y;
			const z = euler.z;

			const cos = Math.cos;
			const sin = Math.sin;

			const c1 = cos(x / 2);
			const c2 = cos(y / 2);
			const c3 = cos(z / 2);

			const s1 = sin(x / 2);
			const s2 = sin(y / 2);
			const s3 = sin(z / 2);

			switch(euler.order) {

				case RotationOrder.XYZ:
					this.x = s1 * c2 * c3 + c1 * s2 * s3;
					this.y = c1 * s2 * c3 - s1 * c2 * s3;
					this.z = c1 * c2 * s3 + s1 * s2 * c3;
					this.w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case RotationOrder.YXZ:
					this.x = s1 * c2 * c3 + c1 * s2 * s3;
					this.y = c1 * s2 * c3 - s1 * c2 * s3;
					this.z = c1 * c2 * s3 - s1 * s2 * c3;
					this.w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				case RotationOrder.ZXY:
					this.x = s1 * c2 * c3 - c1 * s2 * s3;
					this.y = c1 * s2 * c3 + s1 * c2 * s3;
					this.z = c1 * c2 * s3 + s1 * s2 * c3;
					this.w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case RotationOrder.ZYX:
					this.x = s1 * c2 * c3 - c1 * s2 * s3;
					this.y = c1 * s2 * c3 + s1 * c2 * s3;
					this.z = c1 * c2 * s3 - s1 * s2 * c3;
					this.w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

				case RotationOrder.YZX:
					this.x = s1 * c2 * c3 + c1 * s2 * s3;
					this.y = c1 * s2 * c3 + s1 * c2 * s3;
					this.z = c1 * c2 * s3 - s1 * s2 * c3;
					this.w = c1 * c2 * c3 - s1 * s2 * s3;
					break;

				case RotationOrder.XZY:
					this.x = s1 * c2 * c3 - c1 * s2 * s3;
					this.y = c1 * s2 * c3 - s1 * c2 * s3;
					this.z = c1 * c2 * s3 + s1 * s2 * c3;
					this.w = c1 * c2 * c3 + s1 * s2 * s3;
					break;

			}

			return this;

		}

		/**
		 * Sets the components of this quaternion based on a given axis angle.
		 *
		 * For more information see:
		 *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
		 *
		 * @param {Vector3} axis - The axis. Assumed to be normalized.
		 * @param {Number} angle - The angle in radians.
		 * @return {Quaternion} This quaternion.
		 */

		setFromAxisAngle(axis, angle) {

			const halfAngle = angle / 2.0;
			const s = Math.sin(halfAngle);

			this.x = axis.x * s;
			this.y = axis.y * s;
			this.z = axis.z * s;
			this.w = Math.cos(halfAngle);

			return this;

		}

		/**
		 * Sets the components of this quaternion based on a given rotation matrix.
		 *
		 * For more information see:
		 *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
		 *
		 * @param {Matrix4} m - The rotation matrix. The upper 3x3 is assumed to be a pure rotation matrix (i.e. unscaled).
		 * @return {Quaternion} This quaternion.
		 */

		setFromRotationMatrix(m) {

			const te = m.elements;

			const m00 = te[0], m01 = te[4], m02 = te[8];
			const m10 = te[1], m11 = te[5], m12 = te[9];
			const m20 = te[2], m21 = te[6], m22 = te[10];

			const trace = m00 + m11 + m22;

			let s;

			if(trace > 0) {

				s = 0.5 / Math.sqrt(trace + 1.0);

				this.w = 0.25 / s;
				this.x = (m21 - m12) * s;
				this.y = (m02 - m20) * s;
				this.z = (m10 - m01) * s;

			} else if(m00 > m11 && m00 > m22) {

				s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

				this.w = (m21 - m12) / s;
				this.x = 0.25 * s;
				this.y = (m01 + m10) / s;
				this.z = (m02 + m20) / s;

			} else if(m11 > m22) {

				s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

				this.w = (m02 - m20) / s;
				this.x = (m01 + m10) / s;
				this.y = 0.25 * s;
				this.z = (m12 + m21) / s;

			} else {

				s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

				this.w = (m10 - m01) / s;
				this.x = (m02 + m20) / s;
				this.y = (m12 + m21) / s;
				this.z = 0.25 * s;

			}

			return this;

		}

		/**
		 * Sets the components of this quaternion based on unit vectors.
		 *
		 * @param {Vector3} vFrom - A unit vector. Assumed to be normalized.
		 * @param {Vector3} vTo - A unit vector. Assumed to be normalized.
		 * @return {Quaternion} This quaternion.
		 */

		setFromUnitVectors(vFrom, vTo) {

			let r = vFrom.dot(vTo) + 1;

			if(r < 1e-6) {

				r = 0;

				if(Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

					v$2.set(-vFrom.y, vFrom.x, 0);

				} else {

					v$2.set(0, -vFrom.z, vFrom.y);

				}

			} else {

				v$2.crossVectors(vFrom, vTo);

			}

			this.x = v$2.x;
			this.y = v$2.y;
			this.z = v$2.z;
			this.w = r;

			return this.normalize();

		}

		/**
		 * Inverts this quaternion.
		 *
		 * @return {Quaternion} This quaternion.
		 */

		invert() {

			return this.conjugate().normalize();

		}

		/**
		 * Conjugates this quaternion.
		 *
		 * @return {Quaternion} This quaternion.
		 */

		conjugate() {

			this.x *= -1;
			this.y *= -1;
			this.z *= -1;

			return this;

		}

		/**
		 * Calculates the squared length of this quaternion.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

		}

		/**
		 * Calculates the length of this quaternion.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

		}

		/**
		 * Normalizes this quaternion.
		 *
		 * @return {Quaternion} This quaternion.
		 */

		normalize() {

			const l = this.length();

			let invLength;

			if(l === 0) {

				this.x = 0;
				this.y = 0;
				this.z = 0;
				this.w = 1;

			} else {

				invLength = 1.0 / l;

				this.x = this.x * invLength;
				this.y = this.y * invLength;
				this.z = this.z * invLength;
				this.w = this.w * invLength;

			}

			return this;

		}

		/**
		 * Calculates the dot product with a given vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

		}

		/**
		 * Multiplies the given quaternions and stores the result in this quaternion.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
		 *
		 * @param {Quaternion} a - A quaternion.
		 * @param {Quaternion} b - Another quaternion.
		 * @return {Quaternion} This quaternion.
		 */

		multiplyQuaternions(a, b) {

			const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
			const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

			this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

			return this;

		}

		/**
		 * Multiplies this quaternion with the given one and stores the result in
		 * this quaternion.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Quaternion} This quaternion.
		 */

		multiply(q) {

			return this.multiplyQuaternions(this, q);

		}

		/**
		 * Multiplies the given quaternion with this one and stores the result in
		 * this quaternion.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Quaternion} This quaternion.
		 */

		premultiply(q) {

			return this.multiplyQuaternions(q, this);

		}

		/**
		 * Performs a spherical linear interpolation towards the given quaternion.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @param {Number} t - The slerp factor.
		 * @return {Quaternion} This quaternion.
		 */

		slerp(q, t) {

			const x = this.x, y = this.y, z = this.z, w = this.w;

			let cosHalfTheta, sinHalfTheta;
			let halfTheta, ratioA, ratioB;

			if(t === 1) {

				this.copy(q);

			} else if(t > 0) {

				cosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;

				if(cosHalfTheta < 0) {

					this.w = -q.w;
					this.x = -q.x;
					this.y = -q.y;
					this.z = -q.z;

					cosHalfTheta = -cosHalfTheta;

				} else {

					this.copy(q);

				}

				if(cosHalfTheta >= 1.0) {

					this.w = w;
					this.x = x;
					this.y = y;
					this.z = z;

					return this;

				}

				sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

				if(Math.abs(sinHalfTheta) < 1e-3) {

					this.w = 0.5 * (w + this.w);
					this.x = 0.5 * (x + this.x);
					this.y = 0.5 * (y + this.y);
					this.z = 0.5 * (z + this.z);

					return this;

				}

				halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
				ratioA = Math.sin((1.0 - t) * halfTheta) / sinHalfTheta;
				ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

				this.w = (w * ratioA + this.w * ratioB);
				this.x = (x * ratioA + this.x * ratioB);
				this.y = (y * ratioA + this.y * ratioB);
				this.z = (z * ratioA + this.z * ratioB);

			}

			return this;

		}

		/**
		 * Checks if this quaternions equals the given one.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Boolean} Whether the quaternions are equal.
		 */

		equals(q) {

			return (q.x === this.x) && (q.y === this.y) && (q.z === this.z) && (q.w === this.w);

		}

		/**
		 * Performs a spherical linear interpolation.
		 *
		 * @param {Quaternion} qa - The base quaternion.
		 * @param {Quaternion} qb - The target quaternion.
		 * @param {Quaternion} qr - A quaternion to store the result in.
		 * @param {Number} t - The slerp factor.
		 * @return {Quaternion} The resulting quaternion.
		 */

		static slerp(qa, qb, qr, t) {

			return qr.copy(qa).slerp(qb, t);

		}

		/**
		 * Performs an array-based spherical linear interpolation.
		 *
		 * @param {Number[]} dst - An array to store the result in.
		 * @param {Number} dstOffset - An offset into the destination array.
		 * @param {Number[]} src0 - An array that contains the base quaternion values.
		 * @param {Number} src0Offset - An offset into the base array.
		 * @param {Number[]} src1 - An array that contains the target quaternion values.
		 * @param {Number} src1Offset - An offset into the target array.
		 * @param {Number} t - The slerp factor.
		 */

		static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {

			const x1 = src1[srcOffset1];
			const y1 = src1[srcOffset1 + 1];
			const z1 = src1[srcOffset1 + 2];
			const w1 = src1[srcOffset1 + 3];

			let x0 = src0[srcOffset0];
			let y0 = src0[srcOffset0 + 1];
			let z0 = src0[srcOffset0 + 2];
			let w0 = src0[srcOffset0 + 3];

			let s, f;
			let sin, cos, sqrSin;
			let dir, len, tDir;

			if(w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {

				s = 1.0 - t;
				cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1;

				dir = (cos >= 0) ? 1 : -1;
				sqrSin = 1.0 - cos * cos;

				// Skip the Slerp for tiny steps to avoid numeric problems.
				if(sqrSin > Number.EPSILON) {

					sin = Math.sqrt(sqrSin);
					len = Math.atan2(sin, cos * dir);

					s = Math.sin(s * len) / sin;
					t = Math.sin(t * len) / sin;

				}

				tDir = t * dir;

				x0 = x0 * s + x1 * tDir;
				y0 = y0 * s + y1 * tDir;
				z0 = z0 * s + z1 * tDir;
				w0 = w0 * s + w1 * tDir;

				// Normalize in case a lerp has just been performed.
				if(s === 1.0 - t) {

					f = 1.0 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

					x0 *= f;
					y0 *= f;
					z0 *= f;
					w0 *= f;

				}

			}

			dst[dstOffset] = x0;
			dst[dstOffset + 1] = y0;
			dst[dstOffset + 2] = z0;
			dst[dstOffset + 3] = w0;

		}

	}

	/**
	 * Euler angles.
	 */

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const a = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const b = new Vector3();

	/**
	 * A plane.
	 */

	class Plane {

		/**
		 * Constructs a new plane.
		 *
		 * @param {Vector3} [normal] - The normal.
		 * @param {Number} [constant] - The constant.
		 */

		constructor(normal = new Vector3(1, 0, 0), constant = 0) {

			/**
			 * The normal.
			 *
			 * @type {Vector3}
			 */

			this.normal = normal;

			/**
			 * The constant.
			 *
			 * @type {Number}
			 */

			this.constant = constant;

		}

		/**
		 * Sets the normal and the constant.
		 *
		 * @param {Vector3} normal - The normal.
		 * @param {Number} constant - The constant.
		 * @return {Plane} This plane.
		 */

		set(normal, constant) {

			this.normal.copy(normal);
			this.constant = constant;

			return this;

		}

		/**
		 * Sets the components of this plane.
		 *
		 * @param {Number} x - The X component of the normal.
		 * @param {Number} y - The Y component of the normal.
		 * @param {Number} z - The Z component of the normal.
		 * @param {Number} w - The constant.
		 * @return {Plane} This plane.
		 */

		setComponents(x, y, z, w) {

			this.normal.set(x, y, z);
			this.constant = w;

			return this;

		}

		/**
		 * Copies the given plane.
		 *
		 * @param {Plane} p - A plane.
		 * @return {Plane} This plane.
		 */

		copy(p) {

			this.normal.copy(p.normal);
			this.constant = p.constant;

			return this;

		}

		/**
		 * Clones this plane.
		 *
		 * @return {Plane} The cloned plane.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Sets this plane from a normal and a coplanar point.
		 *
		 * @param {Vector3} n - The normal.
		 * @param {Vector3} p - The coplanar point.
		 * @return {Sphere} This sphere.
		 */

		setFromNormalAndCoplanarPoint(n, p) {

			this.normal.copy(n);
			this.constant = -p.dot(this.normal);

			return this;

		}

		/**
		 * Sets this plane from three distinct coplanar points.
		 *
		 * @param {Vector3} p0 - A coplanar point.
		 * @param {Vector3} p1 - A coplanar point.
		 * @param {Vector3} p2 - A coplanar point.
		 * @return {Plane} This plane.
		 */

		setFromCoplanarPoints(p0, p1, p2) {

			const normal = a.subVectors(p2, p1).cross(b.subVectors(p0, p1)).normalize();

			this.setFromNormalAndCoplanarPoint(normal, a);

			return this;

		}

		/**
		 * Normalizes this plane.
		 *
		 * @return {Plane} This plane.
		 */

		normalize() {

			const inverseNormalLength = 1.0 / this.normal.length();

			this.normal.multiplyScalar(inverseNormalLength);
			this.constant *= inverseNormalLength;

			return this;

		}

		/**
		 * Negates this plane.
		 *
		 * @return {Plane} This plane.
		 */

		negate() {

			this.normal.negate();
			this.constant = -this.constant;

			return this;

		}

		/**
		 * Calculates the distance from this plane to the given point.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Number} The length.
		 */

		distanceToPoint(p) {

			return this.normal.dot(p) + this.constant;

		}

		/**
		 * Calculates the distance from this plane to the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Number} The length.
		 */

		distanceToSphere(s) {

			return this.distanceToPoint(s.center) - s.radius;

		}

		/**
		 * Projects the given point on this plane.
		 *
		 * @param {Vector3} p - A point.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The projected point.
		 */

		projectPoint(p, target) {

			return target.copy(this.normal).multiplyScalar(-this.distanceToPoint(p)).add(p);

		}

		/**
		 * Calculates a coplanar point and returns it.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A coplanar plane.
		 */

		coplanarPoint(target) {

			return target.copy(this.normal).multiplyScalar(-this.constant);

		}

		/**
		 * Translates this plane.
		 *
		 * @param {Vector3} offset - An offset.
		 * @return {Plane} This plane.
		 */

		translate(offset) {

			this.constant -= offset.dot(this.normal);

			return this;

		}

		/**
		 * Finds the point of intersection between this plane and a given line.
		 *
		 * @param {Line3} l - A line.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The intersection point.
		 */

		intersectLine(l, target) {

			const direction = l.delta(a);
			const denominator = this.normal.dot(direction);

			if(denominator === 0) {

				// The line is coplanar, return origin.
				if(this.distanceToPoint(l.start) === 0) {

					target.copy(l.start);

				}

			} else {

				const t = -(l.start.dot(this.normal) + this.constant) / denominator;

				if(t >= 0 && t <= 1) {

					target.copy(direction).multiplyScalar(t).add(l.start);

				}

			}

			return target;

		}

		/**
		 * Checks if this plane intersects with the given line.
		 *
		 * @param {Line3} l - A line.
		 * @return {Boolean} Whether this plane intersects with the given line.
		 */

		intersectsLine(l) {

			const startSign = this.distanceToPoint(l.start);
			const endSign = this.distanceToPoint(l.end);

			return ((startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0));

		}

		/**
		 * Checks if this plane intersects with the given box.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether this plane intersects with the given box.
		 */

		intersectsBox(b) {

			return b.intersectsPlane(this);

		}

		/**
		 * Checks if this plane intersects with the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Boolean} Whether this plane intersects with the given sphere.
		 */

		intersectsSphere(s) {

			return s.intersectsPlane(this);

		}

		/**
		 * Checks if this plane equals the given one.
		 *
		 * @param {Plane} p - A plane.
		 * @return {Boolean} Whether this plane equals the given one.
		 */

		equals(p) {

			return (p.normal.equals(this.normal) && (p.constant === this.constant));

		}

	}

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v0 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v1 = new Vector3();

	/**
	 * A frustum.
	 */

	class Frustum {

		/**
		 * Constructs a new frustum.
		 *
		 * @param {Plane} [p0] - A plane.
		 * @param {Plane} [p1] - A plane.
		 * @param {Plane} [p2] - A plane.
		 * @param {Plane} [p3] - A plane.
		 * @param {Plane} [p4] - A plane.
		 * @param {Plane} [p5] - A plane.
		 */

		constructor(
			p0 = new Plane(),
			p1 = new Plane(),
			p2 = new Plane(),
			p3 = new Plane(),
			p4 = new Plane(),
			p5 = new Plane()
		) {

			/**
			 * The six planes that form the frustum.
			 *
			 * @type {Plane[]}
			 */

			this.planes = [p0, p1, p2, p3, p4, p5];

		}

		/**
		 * Sets the planes of this frustum.
		 *
		 * @param {Plane} [p0] - A plane.
		 * @param {Plane} [p1] - A plane.
		 * @param {Plane} [p2] - A plane.
		 * @param {Plane} [p3] - A plane.
		 * @param {Plane} [p4] - A plane.
		 * @param {Plane} [p5] - A plane.
		 * @return {Frustum} This frustum.
		 */

		set(p0, p1, p2, p3, p4, p5) {

			const planes = this.planes;

			planes[0].copy(p0);
			planes[1].copy(p1);
			planes[2].copy(p2);
			planes[3].copy(p3);
			planes[4].copy(p4);
			planes[5].copy(p5);

			return this;

		}

		/**
		 * Clones this frustum.
		 *
		 * @return {Frustum} The cloned frustum.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Copies a given frustum.
		 *
		 * @param {Frustum} frustum - A frustum.
		 * @return {Frustum} This frustum.
		 */

		copy(frustum) {

			const planes = this.planes;

			let i;

			for(i = 0; i < 6; ++i) {

				planes[i].copy(frustum.planes[i]);

			}

			return this;

		}

		/**
		 * Sets this frustm based on a given 4x4 matrix.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Frustum} This frustum.
		 */

		setFromMatrix(m) {

			const planes = this.planes;

			const me = m.elements;
			const me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
			const me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
			const me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
			const me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

			planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
			planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
			planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
			planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
			planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
			planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();

			return this;

		}

		/**
		 * Checks if this frustum intersects with the given sphere.
		 *
		 * @param {Sphere} sphere - A sphere.
		 * @return {Boolean} Whether this frustum intersects with the sphere.
		 */

		intersectsSphere(sphere) {

			const planes = this.planes;
			const center = sphere.center;
			const negativeRadius = -sphere.radius;

			let result = true;
			let i, d;

			for(i = 0; i < 6; ++i) {

				d = planes[i].distanceToPoint(center);

				if(d < negativeRadius) {

					result = false;
					break;

				}

			}

			return result;

		}

		/**
		 * Checks if this frustum intersects with the given sphere.
		 *
		 * @param {Box3} box - A box.
		 * @return {Boolean} Whether this frustum intersects with the box.
		 */

		intersectsBox(box) {

			const planes = this.planes;
			const min = box.min;
			const max = box.max;

			let result = true;
			let i, d0, d1;
			let plane;

			for(i = 0; i < 6; ++i) {

				plane = planes[i];

				v0.x = (plane.normal.x > 0) ? min.x : max.x;
				v1.x = (plane.normal.x > 0) ? max.x : min.x;
				v0.y = (plane.normal.y > 0) ? min.y : max.y;
				v1.y = (plane.normal.y > 0) ? max.y : min.y;
				v0.z = (plane.normal.z > 0) ? min.z : max.z;
				v1.z = (plane.normal.z > 0) ? max.z : min.z;

				d0 = plane.distanceToPoint(v0);
				d1 = plane.distanceToPoint(v1);

				// If both are outside the plane there's no intersection.
				if(d0 < 0 && d1 < 0) {

					result = false;
					break;

				}

			}

			return result;

		}

		/**
		 * Checks if this frustum contains the given point.
		 *
		 * @param {Vector3} point - A point.
		 * @return {Boolean} Whether this frustum contains the point.
		 */

		containsPoint(point) {

			const planes = this.planes;

			let result = true;
			let i;

			for(i = 0; i < 6; ++i) {

				if(planes[i].distanceToPoint(point) < 0) {

					result = false;
					break;

				}

			}

			return result;

		}

	}

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const a$1 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const b$1 = new Vector3();

	/**
	 * A line.
	 */

	class Line3 {

		/**
		 * Constructs a new line.
		 *
		 * @param {Vector3} [start] - The starting point. If none is provided, a new vector will be created.
		 * @param {Vector3} [end] - The ending point. If none is provided, a new vector will be created.
		 */

		constructor(start = new Vector3(), end = new Vector3()) {

			/**
			 * The starting point.
			 *
			 * @type {Vector3}
			 */

			this.start = start;

			/**
			 * The ending point.
			 *
			 * @type {Vector3}
			 */

			this.end = end;

		}

		/**
		 * Sets the starting and ending point of this line.
		 *
		 * @param {Vector3} start - The starting point.
		 * @param {Vector3} end - The ending point.
		 * @return {Line3} This line.
		 */

		set(start, end) {

			this.start.copy(start);
			this.end.copy(end);

			return this;

		}

		/**
		 * Copies the values of the given line.
		 *
		 * @param {Line3} l - A line.
		 * @return {Line3} This line.
		 */

		copy(l) {

			this.start.copy(l.start);
			this.end.copy(l.end);

			return this;

		}

		/**
		 * Clones this line.
		 *
		 * @return {Line3} The cloned line.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Calculates the center of this line.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The center of this line.
		 */

		getCenter(target = new Vector3()) {

			return target.addVectors(this.start, this.end).multiplyScalar(0.5);

		}

		/**
		 * Calculates the delta vector of this line.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The delta vector of this line.
		 */

		delta(target = new Vector3()) {

			return target.subVectors(this.end, this.start);

		}

		/**
		 * Calculates the squared length of this line.
		 *
		 * @return {Vector3} The squared length.
		 */

		lengthSquared() {

			return this.start.distanceToSquared(this.end);

		}

		/**
		 * Calculates the length of this line.
		 *
		 * @return {Vector3} The length.
		 */

		length() {

			return this.start.distanceTo(this.end);

		}

		/**
		 * Adjusts this line to point in the given direction.
		 *
		 * @param {Vector3} d - The direction.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The length.
		 */

		at(d, target) {

			return this.delta(target).multiplyScalar(d).add(this.start);

		}

		/**
		 * Returns a point parameter based on the closest point as projected on the line segement.
		 *
		 * @private
		 * @param {Vector3} p - A point.
		 * @param {Boolean} clampToLine - Whether the point should be clamped to the line.
		 * @return {Vector3} The parameter.
		 */

		closestPointToPointParameter(p, clampToLine) {

			a$1.subVectors(p, this.start);
			b$1.subVectors(this.end, this.start);

			const bb = b$1.dot(b$1);
			const ba = b$1.dot(a$1);

			const t = clampToLine ? Math.min(Math.max(ba / bb, 0), 1) : ba / bb;

			return t;

		}

		/**
		 * Returns the closest point on the line.
		 *
		 * @param {Vector3} p - A point.
		 * @param {Boolean} [clampToLine=false] - Whether the point should be clamped to the line.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The parameter.
		 */

		closestPointToPoint(p, clampToLine = false, target = new Vector3()) {

			const t = this.closestPointToPointParameter(p, clampToLine);

			return this.delta(target).multiplyScalar(t).add(this.start);

		}

		/**
		 * Checks if this line equals the given one.
		 *
		 * @param {Line3} l - A line.
		 * @return {Boolean} Whether the lines are equal.
		 */

		equals(l) {

			return l.start.equals(this.start) && l.end.equals(this.end);

		}

	}

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const a$2 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const b$2 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const c = new Vector3();

	/**
	 * A 4x4 matrix.
	 */

	class Matrix4 {

		/**
		 * Constructs a new matrix.
		 */

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @type {Float32Array}
			 */

			this.elements = new Float32Array([

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
		 * @param {Number} n00 - The value of the first row, first column.
		 * @param {Number} n01 - The value of the first row, second column.
		 * @param {Number} n02 - The value of the first row, third column.
		 * @param {Number} n03 - The value of the first row, fourth column.
		 * @param {Number} n10 - The value of the second row, first column.
		 * @param {Number} n11 - The value of the second row, second column.
		 * @param {Number} n12 - The value of the second row, third column.
		 * @param {Number} n13 - The value of the second row, fourth column.
		 * @param {Number} n20 - The value of the third row, first column.
		 * @param {Number} n21 - The value of the third row, second column.
		 * @param {Number} n22 - The value of the third row, third column.
		 * @param {Number} n23 - The value of the third row, fourth column.
		 * @param {Number} n30 - The value of the fourth row, first column.
		 * @param {Number} n31 - The value of the fourth row, second column.
		 * @param {Number} n32 - The value of the fourth row, third column.
		 * @param {Number} n33 - The value of the fourth row, fourth column.
		 * @return {Matrix4} This matrix.
		 */

		set(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {

			const te = this.elements;

			te[0] = n00; te[4] = n01; te[8] = n02; te[12] = n03;
			te[1] = n10; te[5] = n11; te[9] = n12; te[13] = n13;
			te[2] = n20; te[6] = n21; te[10] = n22; te[14] = n23;
			te[3] = n30; te[7] = n31; te[11] = n32; te[15] = n33;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @return {Matrix4} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Copies the values of a given matrix.
		 *
		 * @param {Matrix4} matrix - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		copy(matrix) {

			const me = matrix.elements;
			const te = this.elements;

			te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
			te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
			te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
			te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @return {Matrix4} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().fromArray(this.elements);

		}

		/**
		 * Copies the values of a given array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Matrix4} This matrix.
		 */

		fromArray(array, offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 16; ++i) {

				te[i] = array[i + offset];

			}

			return this;

		}

		/**
		 * Stores this matrix in an array.
		 *
		 * @param {Number[]} [array] - A target array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 16; ++i) {

				array[i + offset] = te[i];

			}

			return array;

		}

		/**
		 * Returns the largest scale.
		 *
		 * @param {Matrix4} matrix - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		getMaxScaleOnAxis() {

			const te = this.elements;

			const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
			const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
			const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

			return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));

		}

		/**
		 * Copies the position values of a given matrix.
		 *
		 * @param {Matrix4} matrix - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		copyPosition(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			te[12] = me[12];
			te[13] = me[13];
			te[14] = me[14];

			return this;

		}

		/**
		 * Sets the position values of this matrix.
		 *
		 * @param {Vector3} p - A position.
		 * @return {Matrix4} This matrix.
		 */

		setPosition(p) {

			const te = this.elements;

			te[12] = p.x;
			te[13] = p.y;
			te[14] = p.z;

			return this;

		}

		/**
		 * Extracts the basis from this matrix.
		 *
		 * @param {Vector3} xAxis - A vector to store the X-axis column in.
		 * @param {Vector3} yAxis - A vector to store the Y-axis column in.
		 * @param {Vector3} zAxis - A vector to store the Z-axis column in.
		 * @return {Matrix4} This matrix.
		 */

		extractBasis(xAxis, yAxis, zAxis) {

			xAxis.setFromMatrixColumn(this, 0);
			yAxis.setFromMatrixColumn(this, 1);
			zAxis.setFromMatrixColumn(this, 2);

			return this;

		}

		/**
		 * Sets the basis of this matrix.
		 *
		 * @param {Vector3} xAxis - The X-axis.
		 * @param {Vector3} yAxis - The Y-axis.
		 * @param {Vector3} zAxis - The Z-axis.
		 * @return {Matrix4} This matrix.
		 */

		makeBasis(xAxis, yAxis, zAxis) {

			this.set(

				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Extracts the rotation from a given matrix.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		extractRotation(m) {

			const te = this.elements;
			const me = m.elements;

			const scaleX = 1.0 / a$2.setFromMatrixColumn(m, 0).length();
			const scaleY = 1.0 / a$2.setFromMatrixColumn(m, 1).length();
			const scaleZ = 1.0 / a$2.setFromMatrixColumn(m, 2).length();

			te[0] = me[0] * scaleX;
			te[1] = me[1] * scaleX;
			te[2] = me[2] * scaleX;

			te[4] = me[4] * scaleY;
			te[5] = me[5] * scaleY;
			te[6] = me[6] * scaleY;

			te[8] = me[8] * scaleZ;
			te[9] = me[9] * scaleZ;
			te[10] = me[10] * scaleZ;

			return this;

		}

		/**
		 * Sets the matrix rotation based on the given Euler angles.
		 *
		 * @param {Euler} euler - The euler angles.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationFromEuler(euler) {

			const te = this.elements;

			const x = euler.x;
			const y = euler.y;
			const z = euler.z;

			const a = Math.cos(x), b = Math.sin(x);
			const c = Math.cos(y), d = Math.sin(y);
			const e = Math.cos(z), f = Math.sin(z);

			let ae, af, be, bf;
			let ce, cf, de, df;
			let ac, ad, bc, bd;

			switch(euler.order) {

				case RotationOrder.XYZ: {

					ae = a * e, af = a * f, be = b * e, bf = b * f;

					te[0] = c * e;
					te[4] = -c * f;
					te[8] = d;

					te[1] = af + be * d;
					te[5] = ae - bf * d;
					te[9] = -b * c;

					te[2] = bf - ae * d;
					te[6] = be + af * d;
					te[10] = a * c;

					break;

				}

				case RotationOrder.YXZ: {

					ce = c * e, cf = c * f, de = d * e, df = d * f;

					te[0] = ce + df * b;
					te[4] = de * b - cf;
					te[8] = a * d;

					te[1] = a * f;
					te[5] = a * e;
					te[9] = -b;

					te[2] = cf * b - de;
					te[6] = df + ce * b;
					te[10] = a * c;

					break;

				}

				case RotationOrder.ZXY: {

					ce = c * e, cf = c * f, de = d * e, df = d * f;

					te[0] = ce - df * b;
					te[4] = -a * f;
					te[8] = de + cf * b;

					te[1] = cf + de * b;
					te[5] = a * e;
					te[9] = df - ce * b;

					te[2] = -a * d;
					te[6] = b;
					te[10] = a * c;

					break;

				}

				case RotationOrder.ZYX: {

					ae = a * e, af = a * f, be = b * e, bf = b * f;

					te[0] = c * e;
					te[4] = be * d - af;
					te[8] = ae * d + bf;

					te[1] = c * f;
					te[5] = bf * d + ae;
					te[9] = af * d - be;

					te[2] = -d;
					te[6] = b * c;
					te[10] = a * c;

					break;

				}

				case RotationOrder.YZX: {

					ac = a * c, ad = a * d, bc = b * c, bd = b * d;

					te[0] = c * e;
					te[4] = bd - ac * f;
					te[8] = bc * f + ad;

					te[1] = f;
					te[5] = a * e;
					te[9] = -b * e;

					te[2] = -d * e;
					te[6] = ad * f + bc;
					te[10] = ac - bd * f;

					break;

				}

				case RotationOrder.XZY: {

					ac = a * c, ad = a * d, bc = b * c, bd = b * d;

					te[0] = c * e;
					te[4] = -f;
					te[8] = d * e;

					te[1] = ac * f + bd;
					te[5] = a * e;
					te[9] = ad * f - bc;

					te[2] = bc * f - ad;
					te[6] = b * e;
					te[10] = bd * f + ac;

					break;

				}

			}

			// Last column.
			te[3] = 0;
			te[7] = 0;
			te[11] = 0;

			// Bottom row.
			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;

			return this;

		}

		/**
		 * Sets the matrix rotation based on the given quaternion.
		 *
		 * @param {Quaternion} q - The quaternion.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationFromQuaternion(q) {

			const te = this.elements;

			const x = q.x, y = q.y, z = q.z, w = q.w;
			const x2 = x + x, y2 = y + y, z2 = z + z;
			const xx = x * x2, xy = x * y2, xz = x * z2;
			const yy = y * y2, yz = y * z2, zz = z * z2;
			const wx = w * x2, wy = w * y2, wz = w * z2;

			te[0] = 1 - (yy + zz);
			te[4] = xy - wz;
			te[8] = xz + wy;

			te[1] = xy + wz;
			te[5] = 1 - (xx + zz);
			te[9] = yz - wx;

			te[2] = xz - wy;
			te[6] = yz + wx;
			te[10] = 1 - (xx + yy);

			// Last column.
			te[3] = 0;
			te[7] = 0;
			te[11] = 0;

			// Bottom row.
			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;

			return this;

		}

		/**
		 * Creates a rotation that looks at the given target.
		 *
		 * @param {Vector3} eye - The position of the eye.
		 * @param {Vector3} target - The target to look at.
		 * @param {Vector3} up - The up vector.
		 * @return {Matrix4} This matrix.
		 */

		lookAt(eye, target, up) {

			const te = this.elements;
			const x = a$2, y = b$2, z = c;

			z.subVectors(eye, target);

			if(z.lengthSquared() === 0) {

				// Eye and target are at the same position.
				z.z = 1;

			}

			z.normalize();
			x.crossVectors(up, z);

			if(x.lengthSquared() === 0) {

				// Up and z are parallel.
				if(Math.abs(up.z) === 1) {

					z.x += 1e-4;

				} else {

					z.z += 1e-4;

				}

				z.normalize();
				x.crossVectors(up, z);

			}

			x.normalize();
			y.crossVectors(z, x);

			te[0] = x.x; te[4] = y.x; te[8] = z.x;
			te[1] = x.y; te[5] = y.y; te[9] = z.y;
			te[2] = x.z; te[6] = y.z; te[10] = z.z;

			return this;

		}

		/**
		 * Sets this matrix to the product of the given matrices.
		 *
		 * @param {Matrix4} a - A matrix.
		 * @param {Matrix4} b - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		multiplyMatrices(a, b) {

			const te = this.elements;
			const ae = a.elements;
			const be = b.elements;

			const a00 = ae[0], a01 = ae[4], a02 = ae[8], a03 = ae[12];
			const a10 = ae[1], a11 = ae[5], a12 = ae[9], a13 = ae[13];
			const a20 = ae[2], a21 = ae[6], a22 = ae[10], a23 = ae[14];
			const a30 = ae[3], a31 = ae[7], a32 = ae[11], a33 = ae[15];

			const b00 = be[0], b01 = be[4], b02 = be[8], b03 = be[12];
			const b10 = be[1], b11 = be[5], b12 = be[9], b13 = be[13];
			const b20 = be[2], b21 = be[6], b22 = be[10], b23 = be[14];
			const b30 = be[3], b31 = be[7], b32 = be[11], b33 = be[15];

			te[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
			te[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
			te[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
			te[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

			te[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
			te[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
			te[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
			te[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

			te[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
			te[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
			te[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
			te[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

			te[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
			te[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
			te[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
			te[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

			return this;

		}

		/**
		 * Multiplies this matrix with the given one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		multiply(m) {

			return this.multiplyMatrices(this, m);

		}

		/**
		 * Multiplies a given matrix with this one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		premultiply(m) {

			return this.multiplyMatrices(m, this);

		}

		/**
		 * Multiplies this matrix with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Matrix4} This matrix.
		 */

		multiplyScalar(s) {

			const te = this.elements;

			te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
			te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
			te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
			te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;

			return this;

		}

		/**
		 * Calculates the determinant of this matrix.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		 *
		 * @return {Number} The determinant.
		 */

		determinant() {

			const te = this.elements;

			const n00 = te[0], n01 = te[4], n02 = te[8], n03 = te[12];
			const n10 = te[1], n11 = te[5], n12 = te[9], n13 = te[13];
			const n20 = te[2], n21 = te[6], n22 = te[10], n23 = te[14];
			const n30 = te[3], n31 = te[7], n32 = te[11], n33 = te[15];

			const n00n11 = n00 * n11, n00n12 = n00 * n12, n00n13 = n00 * n13;
			const n01n10 = n01 * n10, n01n12 = n01 * n12, n01n13 = n01 * n13;
			const n02n10 = n02 * n10, n02n11 = n02 * n11, n02n13 = n02 * n13;
			const n03n10 = n03 * n10, n03n11 = n03 * n11, n03n12 = n03 * n12;

			return (

				n30 * (
					n03n12 * n21 -
					n02n13 * n21 -
					n03n11 * n22 +
					n01n13 * n22 +
					n02n11 * n23 -
					n01n12 * n23
				) +

				n31 * (
					n00n12 * n23 -
					n00n13 * n22 +
					n03n10 * n22 -
					n02n10 * n23 +
					n02n13 * n20 -
					n03n12 * n20
				) +

				n32 * (
					n00n13 * n21 -
					n00n11 * n23 -
					n03n10 * n21 +
					n01n10 * n23 +
					n03n11 * n20 -
					n01n13 * n20
				) +

				n33 * (
					-n02n11 * n20 -
					n00n12 * n21 +
					n00n11 * n22 +
					n02n10 * n21 -
					n01n10 * n22 +
					n01n12 * n20
				)

			);

		}

		/**
		 * Inverts the given matrix and stores the result in this matrix.
		 *
		 * For details see:
		 *  http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		 *
		 * @param {Matrix4} matrix - The matrix that should be inverted.
		 * @return {Matrix4} This matrix.
		 */

		getInverse(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			const n00 = me[0], n10 = me[1], n20 = me[2], n30 = me[3];
			const n01 = me[4], n11 = me[5], n21 = me[6], n31 = me[7];
			const n02 = me[8], n12 = me[9], n22 = me[10], n32 = me[11];
			const n03 = me[12], n13 = me[13], n23 = me[14], n33 = me[15];

			const t00 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
			const t01 = n03 * n22 * n31 - n02 * n23 * n31 - n03 * n21 * n32 + n01 * n23 * n32 + n02 * n21 * n33 - n01 * n22 * n33;
			const t02 = n02 * n13 * n31 - n03 * n12 * n31 + n03 * n11 * n32 - n01 * n13 * n32 - n02 * n11 * n33 + n01 * n12 * n33;
			const t03 = n03 * n12 * n21 - n02 * n13 * n21 - n03 * n11 * n22 + n01 * n13 * n22 + n02 * n11 * n23 - n01 * n12 * n23;

			const det = n00 * t00 + n10 * t01 + n20 * t02 + n30 * t03;

			let invDet;

			if(det !== 0) {

				invDet = 1.0 / det;

				te[0] = t00 * invDet;
				te[1] = (n13 * n22 * n30 - n12 * n23 * n30 - n13 * n20 * n32 + n10 * n23 * n32 + n12 * n20 * n33 - n10 * n22 * n33) * invDet;
				te[2] = (n11 * n23 * n30 - n13 * n21 * n30 + n13 * n20 * n31 - n10 * n23 * n31 - n11 * n20 * n33 + n10 * n21 * n33) * invDet;
				te[3] = (n12 * n21 * n30 - n11 * n22 * n30 - n12 * n20 * n31 + n10 * n22 * n31 + n11 * n20 * n32 - n10 * n21 * n32) * invDet;

				te[4] = t01 * invDet;
				te[5] = (n02 * n23 * n30 - n03 * n22 * n30 + n03 * n20 * n32 - n00 * n23 * n32 - n02 * n20 * n33 + n00 * n22 * n33) * invDet;
				te[6] = (n03 * n21 * n30 - n01 * n23 * n30 - n03 * n20 * n31 + n00 * n23 * n31 + n01 * n20 * n33 - n00 * n21 * n33) * invDet;
				te[7] = (n01 * n22 * n30 - n02 * n21 * n30 + n02 * n20 * n31 - n00 * n22 * n31 - n01 * n20 * n32 + n00 * n21 * n32) * invDet;

				te[8] = t02 * invDet;
				te[9] = (n03 * n12 * n30 - n02 * n13 * n30 - n03 * n10 * n32 + n00 * n13 * n32 + n02 * n10 * n33 - n00 * n12 * n33) * invDet;
				te[10] = (n01 * n13 * n30 - n03 * n11 * n30 + n03 * n10 * n31 - n00 * n13 * n31 - n01 * n10 * n33 + n00 * n11 * n33) * invDet;
				te[11] = (n02 * n11 * n30 - n01 * n12 * n30 - n02 * n10 * n31 + n00 * n12 * n31 + n01 * n10 * n32 - n00 * n11 * n32) * invDet;

				te[12] = t03 * invDet;
				te[13] = (n02 * n13 * n20 - n03 * n12 * n20 + n03 * n10 * n22 - n00 * n13 * n22 - n02 * n10 * n23 + n00 * n12 * n23) * invDet;
				te[14] = (n03 * n11 * n20 - n01 * n13 * n20 - n03 * n10 * n21 + n00 * n13 * n21 + n01 * n10 * n23 - n00 * n11 * n23) * invDet;
				te[15] = (n01 * n12 * n20 - n02 * n11 * n20 + n02 * n10 * n21 - n00 * n12 * n21 - n01 * n10 * n22 + n00 * n11 * n22) * invDet;

			} else {

				console.error("Can't invert matrix, determinant is zero", matrix);

				this.identity();

			}

			return this;

		}

		/**
		 * Transposes this matrix.
		 *
		 * @return {Matrix4} This matrix.
		 */

		transpose() {

			const te = this.elements;

			let t;

			t = te[1]; te[1] = te[4]; te[4] = t;
			t = te[2]; te[2] = te[8]; te[8] = t;
			t = te[6]; te[6] = te[9]; te[9] = t;

			t = te[3]; te[3] = te[12]; te[12] = t;
			t = te[7]; te[7] = te[13]; te[13] = t;
			t = te[11]; te[11] = te[14]; te[14] = t;

			return this;

		}

		/**
		 * Scales this matrix.
		 *
		 * @param {Number} sx - The X scale.
		 * @param {Number} sy - The Y scale.
		 * @param {Number} sy - The Z scale.
		 * @return {Matrix4} This matrix.
		 */

		scale(sx, sy, sz) {

			const te = this.elements;

			te[0] *= sx; te[4] *= sy; te[8] *= sz;
			te[1] *= sx; te[5] *= sy; te[9] *= sz;
			te[2] *= sx; te[6] *= sy; te[10] *= sz;
			te[3] *= sx; te[7] *= sy; te[11] *= sz;

			return this;

		}

		/**
		 * Makes this matrix a scale matrix.
		 *
		 * @param {Number} x - The X scale.
		 * @param {Number} y - The Y scale.
		 * @param {Number} z - The Z scale.
		 * @return {Matrix4} This matrix.
		 */

		makeScale(x, y, z) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a translation matrix.
		 *
		 * @param {Number} x - The X offset.
		 * @param {Number} y - The Y offset.
		 * @param {Number} z - The Z offset.
		 * @return {Matrix4} This matrix.
		 */

		makeTranslation(x, y, z) {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationX(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				1, 0, 0, 0,
				0, c, -s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix with respect to the Y-axis.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationY(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				c, 0, s, 0,
				0, 1, 0, 0,
				-s, 0, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix with respect to the Z-axis.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationZ(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				c, -s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a translation matrix with respect to a specific axis.
		 *
		 * For mor einformation see:
		 *  http://www.gamedev.net/reference/articles/article1199.asp
		 *
		 * @param {Vector3} axis - The axis. Assumed to be normalized.
		 * @param {Number} angle - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationAxis(axis, angle) {

			const c = Math.cos(angle);
			const s = Math.sin(angle);

			const t = 1.0 - c;

			const x = axis.x, y = axis.y, z = axis.z;
			const tx = t * x, ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a shear matrix.
		 *
		 * @param {Number} x - The X shear value.
		 * @param {Number} y - The Y shear value.
		 * @param {Number} z - The Z shear value.
		 * @return {Matrix4} This matrix.
		 */

		makeShear(x, y, z) {

			this.set(

				1, y, z, 0,
				x, 1, z, 0,
				x, y, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Sets this matrix based on the given position, rotation and scale.
		 *
		 * @param {Vector3} position - The position.
		 * @param {Quaternion} quaternion - The rotation.
		 * @param {Vector3} scale - The scale.
		 * @return {Matrix4} This matrix.
		 */

		compose(position, quaternion, scale) {

			this.makeRotationFromQuaternion(quaternion);
			this.scale(scale.x, scale.y, scale.z);
			this.setPosition(position);

			return this;

		}

		/**
		 * Decomposes this matrix into a position, rotation and scale vector.
		 *
		 * @param {Vector3} position - The target position.
		 * @param {Quaternion} quaternion - The target rotation.
		 * @param {Vector3} scale - The target scale.
		 * @return {Matrix4} This matrix.
		 */

		decompose(position, quaternion, scale) {

			const te = this.elements;

			const n00 = te[0], n10 = te[1], n20 = te[2];
			const n01 = te[4], n11 = te[5], n21 = te[6];
			const n02 = te[8], n12 = te[9], n22 = te[10];

			const det = this.determinant();

			// If the determinant is negative, one scale must be inverted.
			const sx = a$2.set(n00, n10, n20).length() * ((det < 0) ? -1 : 1);
			const sy = a$2.set(n01, n11, n21).length();
			const sz = a$2.set(n02, n12, n22).length();

			const invSX = 1.0 / sx;
			const invSY = 1.0 / sy;
			const invSZ = 1.0 / sz;

			// Export the position.
			position.x = te[12];
			position.y = te[13];
			position.z = te[14];

			// Scale the rotation part.
			te[0] *= invSX; te[1] *= invSX; te[2] *= invSX;
			te[4] *= invSY; te[5] *= invSY; te[6] *= invSY;
			te[8] *= invSZ; te[9] *= invSZ; te[10] *= invSZ;

			// Export the rotation.
			quaternion.setFromRotationMatrix(this);

			// Restore the original values.
			te[0] = n00; te[1] = n10; te[2] = n20;
			te[4] = n01; te[5] = n11; te[6] = n21;
			te[8] = n02; te[9] = n12; te[10] = n22;

			// Export the scale.
			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		}

		/**
		 * Creates a perspective matrix.
		 *
		 * @param {Number} left - The distance to the left plane.
		 * @param {Number} right - The distance to the right plane.
		 * @param {Number} top - The distance to the top plane.
		 * @param {Number} bottom - The distance to the bottom plane.
		 * @param {Number} near - The distance to the near plane.
		 * @param {Number} far - The distance to the far plane.
		 * @return {Matrix4} This matrix.
		 */

		makePerspective(left, right, top, bottom, near, far) {

			const te = this.elements;
			const x = 2 * near / (right - left);
			const y = 2 * near / (top - bottom);

			const a = (right + left) / (right - left);
			const b = (top + bottom) / (top - bottom);
			const c = -(far + near) / (far - near);
			const d = -2 * far * near / (far - near);

			te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
			te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
			te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
			te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;

			return this;

		}

		/**
		 * Creates an orthographic matrix.
		 *
		 * @param {Number} left - The distance to the left plane.
		 * @param {Number} right - The distance to the right plane.
		 * @param {Number} top - The distance to the top plane.
		 * @param {Number} bottom - The distance to the bottom plane.
		 * @param {Number} near - The distance to the near plane.
		 * @param {Number} far - The distance to the far plane.
		 * @return {Matrix4} This matrix.
		 */

		makeOrthographic(left, right, top, bottom, near, far) {

			const te = this.elements;
			const w = 1.0 / (right - left);
			const h = 1.0 / (top - bottom);
			const p = 1.0 / (far - near);

			const x = (right + left) * w;
			const y = (top + bottom) * h;
			const z = (far + near) * p;

			te[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = -x;
			te[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = -y;
			te[2] = 0; te[6] = 0; te[10] = -2 * p; te[14] = -z;
			te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;

			return this;

		}

		/**
		 * Checks if this matrix equals the given one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Boolean} Whether the matrix are equal.
		 */

		equals(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			let result = true;
			let i;

			for(i = 0; result && i < 16; ++i) {

				if(te[i] !== me[i]) {

					result = false;

				}

			}

			return result;

		}

	}

	/**
	 * A list of vectors.
	 *
	 * @type {Vector3[]}
	 * @private
	 */

	const v$3 = [
		new Vector3(),
		new Vector3(),
		new Vector3(),
		new Vector3()
	];

	/**
	 * A ray.
	 */

	class Ray {

		/**
		 * Constructs a new ray.
		 *
		 * @param {Vector3} [origin] - The origin.
		 * @param {Vector3} [direction] - The direction.
		 */

		constructor(origin = new Vector3(), direction = new Vector3()) {

			/**
			 * The origin.
			 *
			 * @type {Vector3}
			 */

			this.origin = origin;

			/**
			 * The direction.
			 *
			 * @type {Vector3}
			 */

			this.direction = direction;

		}

		/**
		 * Sets the origin and the direction.
		 *
		 * @param {Vector3} origin - The origin.
		 * @param {Vector3} direction - The direction. Should be normalized.
		 * @return {Ray} This ray.
		 */

		set(origin, direction) {

			this.origin.copy(origin);
			this.direction.copy(direction);

			return this;

		}

		/**
		 * Copies the given ray.
		 *
		 * @param {Ray} r - A ray.
		 * @return {Ray} This ray.
		 */

		copy(r) {

			this.origin.copy(r.origin);
			this.direction.copy(r.direction);

			return this;

		}

		/**
		 * Clones this ray.
		 *
		 * @return {Ray} The cloned ray.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Computes a point along the ray based on a given scalar t.
		 *
		 * @param {Number} t - The scalar.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point.
		 */

		at(t, target = new Vector3()) {

			return target.copy(this.direction).multiplyScalar(t).add(this.origin);

		}

		/**
		 * Rotates this ray to look at the given target.
		 *
		 * @param {Vector3} target - A point to look at.
		 * @return {Ray} This ray.
		 */

		lookAt(target) {

			this.direction.copy(target).sub(this.origin).normalize();

			return this;

		}

		/**
		 * Moves the origin along the ray by a given scalar t.
		 *
		 * @param {Number} t - The scalar.
		 * @return {Ray} This ray.
		 */

		recast(t) {

			this.origin.copy(this.at(t, v$3[0]));

			return this;

		}

		/**
		 * Finds the closest point along this ray to a given point.
		 *
		 * @param {Vector3} p - A point.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point.
		 */

		closestPointToPoint(p, target = new Vector3()) {

			const directionDistance = target.subVectors(p, this.origin).dot(this.direction);

			return (directionDistance >= 0.0) ?
				target.copy(this.direction).multiplyScalar(directionDistance).add(this.origin) :
				target.copy(this.origin);

		}

		/**
		 * Calculates the squared distance from this ray to the given point.
		 *
		 * @param {Vector3} p - The point.
		 * @return {Number} The squared distance.
		 */

		distanceSquaredToPoint(p) {

			const directionDistance = v$3[0].subVectors(p, this.origin).dot(this.direction);

			// Check if the point is behind the ray.
			return (directionDistance < 0.0) ?
				this.origin.distanceToSquared(p) :
				v$3[0].copy(this.direction).multiplyScalar(directionDistance).add(this.origin).distanceToSquared(p);

		}

		/**
		 * Calculates the distance from this ray to the given point.
		 *
		 * @param {Vector3} p - The point.
		 * @return {Number} The distance.
		 */

		distanceToPoint(p) {

			return Math.sqrt(this.distanceSquaredToPoint(p));

		}

		/**
		 * Calculates the distance from this ray to the given plane.
		 *
		 * @param {Plane} p - The plane.
		 * @return {Number} The distance, or null if the denominator is zero.
		 */

		distanceToPlane(p) {

			const denominator = p.normal.dot(this.direction);

			const t = (denominator !== 0.0) ?
				-(this.origin.dot(p.normal) + p.constant) / denominator :
				((p.distanceToPoint(this.origin) === 0.0) ? 0.0 : -1.0);

			return (t >= 0.0) ? t : null;

		}

		/**
		 * Calculates the distance from this ray to a given line segment.
		 *
		 * Based on:
		 *  http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
		 *
		 * @param {Vector3} v0 - The start of the segment.
		 * @param {Vector3} v1 - The end of the segment.
		 * @param {Vector3} [pointOnRay] - If provided, the point on this Ray that is closest to the segment will be stored in this vector.
		 * @param {Vector3} [pointOnSegment] - If provided, the point on the line segment that is closest to this ray will be stored in this vector.
		 * @return {Number} The smallest distance between the ray and the segment defined by v0 and v1.
		 */

		distanceSquaredToSegment(v0, v1, pointOnRay, pointOnSegment) {

			const segCenter = v$3[0].copy(v0).add(v1).multiplyScalar(0.5);
			const segDir = v$3[1].copy(v1).sub(v0).normalize();
			const diff = v$3[2].copy(this.origin).sub(segCenter);

			const segExtent = v0.distanceTo(v1) * 0.5;
			const a01 = -this.direction.dot(segDir);
			const b0 = diff.dot(this.direction);
			const b1 = -diff.dot(segDir);
			const c = diff.lengthSq();
			const det = Math.abs(1.0 - a01 * a01);

			let s0, s1, extDet, invDet, sqrDist;

			if(det > 0.0) {

				// The ray and segment are not parallel.
				s0 = a01 * b1 - b0;
				s1 = a01 * b0 - b1;
				extDet = segExtent * det;

				if(s0 >= 0.0) {

					if(s1 >= -extDet) {

						if(s1 <= extDet) {

							// Region 0.
							// Minimum at interior points of ray and segment.
							invDet = 1.0 / det;
							s0 *= invDet;
							s1 *= invDet;
							sqrDist = s0 * (s0 + a01 * s1 + 2.0 * b0) + s1 * (a01 * s0 + s1 + 2.0 * b1) + c;

						} else {

							// Region 1.
							s1 = segExtent;
							s0 = Math.max(0.0, -(a01 * s1 + b0));
							sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

						}

					} else {

						// Region 5.
						s1 = -segExtent;
						s0 = Math.max(0.0, -(a01 * s1 + b0));
						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

					}

				} else {

					if(s1 <= -extDet) {

						// Region 4.
						s0 = Math.max(0.0, -(-a01 * segExtent + b0));
						s1 = (s0 > 0.0) ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

					} else if(s1 <= extDet) {

						// Region 3.
						s0 = 0.0;
						s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
						sqrDist = s1 * (s1 + 2.0 * b1) + c;

					} else {

						// Region 2.
						s0 = Math.max(0.0, -(a01 * segExtent + b0));
						s1 = (s0 > 0.0) ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

					}

				}

			} else {

				// Ray and segment are parallel.
				s1 = (a01 > 0.0) ? -segExtent : segExtent;
				s0 = Math.max(0.0, -(a01 * s1 + b0));
				sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

			}

			if(pointOnRay !== undefined) {

				pointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);

			}

			if(pointOnSegment !== undefined) {

				pointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);

			}

			return sqrDist;

		}

		/**
		 * Finds the point where this ray intersects the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point of intersection, or null if there is none.
		 */

		intersectSphere(s, target = new Vector3()) {

			const ab = v$3[0].subVectors(s.center, this.origin);
			const tca = ab.dot(this.direction);
			const d2 = ab.dot(ab) - tca * tca;
			const radius2 = s.radius * s.radius;

			let result = null;
			let thc, t0, t1;

			if(d2 <= radius2) {

				thc = Math.sqrt(radius2 - d2);

				// t0 = first intersection point - entrance on front of sphere.
				t0 = tca - thc;

				// t1 = second intersection point - exit point on back of sphere.
				t1 = tca + thc;

				// Check if both t0 and t1 are behind the ray - if so, return null.
				if(t0 >= 0.0 || t1 >= 0.0) {

					/* Check if t0 is behind the ray. If it is, the ray is inside the
					sphere, so return the second exit point scaled by t1 in order to always
					return an intersection point that is in front of the ray. If t0 is in
					front of the ray, return the first collision point scaled by t0. */
					result = (t0 < 0.0) ? this.at(t1, target) : this.at(t0, target);

				}

			}

			return result;

		}

		/**
		 * Determines whether this ray intersects the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Boolean} Whether this ray intersects the given sphere.
		 */

		intersectsSphere(s) {

			return (this.distanceToPoint(s.center) <= s.radius);

		}

		/**
		 * Finds the point where this ray intersects the given plane.
		 *
		 * @param {Plane} p - A plane.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point of intersection, or null if there is none.
		 */

		intersectPlane(p, target = new Vector3()) {

			const t = this.distanceToPlane(p);

			return (t === null) ? null : this.at(t, target);

		}

		/**
		 * Determines whether this ray intersects the given plane.
		 *
		 * @param {Plane} p - A plane.
		 * @return {Boolean} Whether this ray intersects the given plane.
		 */

		intersectsPlane(p) {

			const distanceToPoint = p.distanceToPoint(this.origin);

			return (distanceToPoint === 0.0 || p.normal.dot(this.direction) * distanceToPoint < 0.0);

		}

		/**
		 * Finds the point where this ray intersects the given box.
		 *
		 * @param {Plane} b - A box.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point of intersection, or null if there is none.
		 */

		intersectBox(b, target = new Vector3()) {

			const origin = this.origin;
			const direction = this.direction;
			const min = b.min;
			const max = b.max;

			const invDirX = 1.0 / direction.x;
			const invDirY = 1.0 / direction.y;
			const invDirZ = 1.0 / direction.z;

			let result = null;
			let tmin, tmax, tymin, tymax, tzmin, tzmax;

			if(invDirX >= 0.0) {

				tmin = (min.x - origin.x) * invDirX;
				tmax = (max.x - origin.x) * invDirX;

			} else {

				tmin = (max.x - origin.x) * invDirX;
				tmax = (min.x - origin.x) * invDirX;

			}

			if(invDirY >= 0.0) {

				tymin = (min.y - origin.y) * invDirY;
				tymax = (max.y - origin.y) * invDirY;

			} else {

				tymin = (max.y - origin.y) * invDirY;
				tymax = (min.y - origin.y) * invDirY;

			}

			if(tmin <= tymax && tymin <= tmax) {

				/* Handle the case where tmin or tmax is NaN (result of 0 * Infinity).
				Note: x !== x returns true if x is NaN. */
				if(tymin > tmin || tmin !== tmin) {

					tmin = tymin;

				}

				if(tymax < tmax || tmax !== tmax) {

					tmax = tymax;

				}

				if(invDirZ >= 0.0) {

					tzmin = (min.z - origin.z) * invDirZ;
					tzmax = (max.z - origin.z) * invDirZ;

				} else {

					tzmin = (max.z - origin.z) * invDirZ;
					tzmax = (min.z - origin.z) * invDirZ;

				}

				if(tmin <= tzmax && tzmin <= tmax) {

					if(tzmin > tmin || tmin !== tmin) {

						tmin = tzmin;

					}

					if(tzmax < tmax || tmax !== tmax) {

						tmax = tzmax;

					}

					// Return the closest point (positive side).
					if(tmax >= 0.0) {

						result = this.at((tmin >= 0.0) ? tmin : tmax, target);

					}

				}

			}

			return result;

		}

		/**
		 * Determines whether this ray intersects the given box.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether this ray intersects the given box.
		 */

		intersectsBox(b) {

			return (this.intersectBox(b, v$3[0]) !== null);

		}

		/**
		 * Finds the point where this ray intersects the given triangle.
		 *
		 * Based on:
		 *  http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
		 *
		 * @param {Vector3} a - A triangle vertex.
		 * @param {Vector3} b - A triangle vertex.
		 * @param {Vector3} c - A triangle vertex.
		 * @param {Boolean} [backfaceCulling=false] - Whether backface culling should be considered.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point of intersection, or null if there is none.
		 */

		intersectTriangle(a, b, c, backfaceCulling, target) {

			const direction = this.direction;

			// Compute the offset origin, edges, and normal.
			const diff = v$3[0];
			const edge1 = v$3[1];
			const edge2 = v$3[2];
			const normal = v$3[3];

			let result = null;
			let DdN, sign, DdQxE2, DdE1xQ, QdN;

			edge1.subVectors(b, a);
			edge2.subVectors(c, a);
			normal.crossVectors(edge1, edge2);

			/* Solve Q + t * D = b1 * E1 + b2 * E2
			 * (Q = kDiff, D = ray direction, E1 = kEdge1, E2 = kEdge2,
			 * N = Cross(E1, E2)):
			 *
			 *   | Dot(D, N) | * b1 = sign(Dot(D, N)) * Dot(D, Cross(Q, E2))
			 *   | Dot(D, N) | * b2 = sign(Dot(D, N)) * Dot(D, Cross(E1, Q))
			 *   | Dot(D, N) | * t = -sign(Dot(D, N)) * Dot(Q, N)
			 */

			DdN = direction.dot(normal);

			// Discard coplanar constellations and cull backfaces.
			if(DdN !== 0.0 && !(backfaceCulling && DdN > 0.0)) {

				if(DdN > 0.0) {

					sign = 1.0;

				} else {

					sign = -1.0;
					DdN = -DdN;

				}

				diff.subVectors(this.origin, a);
				DdQxE2 = sign * direction.dot(edge2.crossVectors(diff, edge2));

				// b1 < 0, no intersection.
				if(DdQxE2 >= 0.0) {

					DdE1xQ = sign * direction.dot(edge1.cross(diff));

					// b2 < 0, or b1 + b2 > 1, no intersection.
					if(DdE1xQ >= 0.0 && DdQxE2 + DdE1xQ <= DdN) {

						// The line intersects the triangle, check if the ray does.
						QdN = -sign * diff.dot(normal);

						// t < 0, no intersection.
						if(QdN >= 0.0) {

							// Ray intersects triangle.
							result = this.at(QdN / DdN, target);

						}

					}

				}

			}

			return result;

		}

		/**
		 * Applies the given matrix to this ray.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Ray} This ray.
		 */

		applyMatrix4(m) {

			this.origin.applyMatrix4(m);
			this.direction.transformDirection(m);

			return this;

		}

		/**
		 * Checks if this ray equals the given one.
		 *
		 * @param {Ray} r - A ray.
		 * @return {Boolean} Whether the rays are equal.
		 */

		equals(r) {

			return (r.origin.equals(this.origin) && r.direction.equals(this.direction));

		}

	}

	/**
	 * A spherical coordinate system.
	 *
	 * For details see: https://en.wikipedia.org/wiki/Spherical_coordinate_system
	 *
	 * The poles (phi) are at the positive and negative Y-axis. The equator starts
	 * at positive Z.
	 */

	/**
	 * A symmetric 3x3 matrix.
	 */

	class SymmetricMatrix3 {

		/**
		 * Constructs a new symmetric matrix.
		 */

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @type {Float32Array}
			 */

			this.elements = new Float32Array([

				1, 0, 0,
				1, 0,
				1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
		 * @param {Number} m00 - The value of the first row, first column.
		 * @param {Number} m01 - The value of the first row, second column and the second row, first column.
		 * @param {Number} m02 - The value of the first row, third column and the third row, first column.
		 * @param {Number} m11 - The value of the second row, second column.
		 * @param {Number} m12 - The value of the second row, third column and third row, second column.
		 * @param {Number} m22 - The value of the third row, third column.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		set(m00, m01, m02, m11, m12, m22) {

			const e = this.elements;

			e[0] = m00;
			e[1] = m01; e[3] = m11;
			e[2] = m02; e[4] = m12; e[5] = m22;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @return {SymmetricMatrix3} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0,
				1, 0,
				1

			);

			return this;

		}

		/**
		 * Copies the values of a given symmetric matrix.
		 *
		 * @param {SymmetricMatrix3} m - A matrix.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		copy(m) {

			const me = m.elements;

			this.set(

				me[0], me[1], me[2],
				me[3], me[4],
				me[5]

			);

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @return {SymmetricMatrix3} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Copies this symmetric matrix into a given 3x3 matrix.
		 *
		 * @param {Matrix3} m - The target matrix.
		 */

		toMatrix3(m) {

			const me = m.elements;

			m.set(

				me[0], me[1], me[2],
				me[1], me[3], me[4],
				me[2], me[4], me[5]

			);

		}

		/**
		 * Adds the values of a given symmetric matrix to this one.
		 *
		 * @param {SymmetricMatrix3} m - A matrix.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		add(m) {

			const te = this.elements;
			const me = m.elements;

			te[0] += me[0];
			te[1] += me[1]; te[3] += me[3];
			te[2] += me[2]; te[4] += me[4]; te[5] += me[5];

			return this;

		}

		/**
		 * Calculates the Frobenius norm of this matrix.
		 *
		 * @return {Number} The norm of this matrix.
		 */

		norm() {

			const e = this.elements;

			const m01m01 = e[1] * e[1];
			const m02m02 = e[2] * e[2];
			const m12m12 = e[4] * e[4];

			return Math.sqrt(

				e[0] * e[0] + m01m01 + m02m02 +
				m01m01 + e[3] * e[3] + m12m12 +
				m02m02 + m12m12 + e[5] * e[5]

			);

		}

		/**
		 * Calculates the absolute sum of all matrix components except for the main
		 * diagonal.
		 *
		 * @return {Number} The offset of this matrix.
		 */

		off() {

			const e = this.elements;

			return Math.sqrt(2 * (

				// Diagonal = [0, 3, 5].
				e[1] * e[1] + e[2] * e[2] + e[4] * e[4]

			));

		}

		/**
		 * Applies this symmetric matrix to a vector.
		 *
		 * @param {Vector3} v - The vector to modify.
		 * @return {Vector3} The modified vector.
		 */

		applyToVector3(v) {

			const x = v.x, y = v.y, z = v.z;
			const e = this.elements;

			v.x = e[0] * x + e[1] * y + e[2] * z;
			v.y = e[1] * x + e[3] * y + e[4] * z;
			v.z = e[2] * x + e[4] * y + e[5] * z;

			return v;

		}

		/**
		 * Checks if this matrix equals the given one.
		 *
		 * @param {SymmetricMatrix3} m - A matrix.
		 * @return {Boolean} Whether the matrices are equal.
		 */

		equals(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			let result = true;
			let i;

			for(i = 0; result && i < 6; ++i) {

				if(te[i] !== me[i]) {

					result = false;

				}

			}

			return result;

		}

		/**
		 * Calculates the linear index of an element from this matrix.
		 *
		 * Let N be the dimension of the symmetric matrix:
		 *
		 *     index = N * (N - 1) / 2 - (N - i) * (N - i - 1) / 2 + j
		 *
		 * @param {Number} i - The row.
		 * @param {Number} j - The column.
		 * @return {Number} The index into the elements of this matrix.
		 */

		static calculateIndex(i, j) {

			return (3 - (3 - i) * (2 - i) / 2 + j);

		}

	}

	/**
	 * A vector with four components.
	 */

	class Vector4 {

		/**
		 * Constructs a new vector.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 * @param {Number} [z=0] - The Z component.
		 * @param {Number} [w=0] - The W component.
		 */

		constructor(x = 0, y = 0, z = 0, w = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

			/**
			 * The Z component.
			 *
			 * @type {Number}
			 */

			this.z = z;

			/**
			 * The W component.
			 *
			 * @type {Number}
			 */

			this.w = w;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @param {Number} z - The Z component.
		 * @param {Number} w - The W component.
		 * @return {Vector4} This vector.
		 */

		set(x, y, z, w) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			this.w = v.w;

			return this;

		}

		/**
		 * Clones this vector.
		 *
		 * @return {Vector4} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z, this.w);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector4} This vector.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];
			this.w = array[offset + 3];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;
			array[offset + 3] = this.w;

			return array;

		}

		/**
		 * Stores the axis angle from the given quaternion in this vector.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
		 *
		 * @param {Quaternion} q - A quaternion. Assumed to be normalized
		 * @return {Vector4} This vector.
		 */

		setAxisAngleFromQuaternion(q) {

			this.w = 2 * Math.acos(q.w);

			const s = Math.sqrt(1 - q.w * q.w);

			if(s < 1e-4) {

				this.x = 1;
				this.y = 0;
				this.z = 0;

			} else {

				this.x = q.x / s;
				this.y = q.y / s;
				this.z = q.z / s;

			}

			return this;

		}

		/**
		 * Stores the axis angle from the given rotation matrix in this vector.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
		 *
		 * @param {Matrix4} m - A matrix. The upper 3x3 must be a pure rotation matrix (i.e. unscaled).
		 * @return {Vector4} This vector.
		 */

		setAxisAngleFromRotationMatrix(m) {

			// Margin to allow for rounding errors.
			const E = 0.01;
			// Margin to distinguish between 0 and 180 degrees.
			const H = 0.1;

			const me = m.elements;
			const m00 = me[0], m01 = me[4], m02 = me[8];
			const m10 = me[1], m11 = me[5], m12 = me[9];
			const m20 = me[2], m21 = me[6], m22 = me[10];

			let angle;
			let x, y, z;
			let xx, yy, zz;
			let xy, xz, yz;
			let s;

			if((Math.abs(m01 - m10) < E) && (Math.abs(m02 - m20) < E) && (Math.abs(m12 - m21) < E)) {

				/* Singularity found. First, check for identity matrix which must have +1
				for all terms in the leading diagonal and zero in other terms. */
				if((Math.abs(m01 + m10) < H) && (Math.abs(m02 + m20) < H) && (Math.abs(m12 + m21) < H) && (Math.abs(m00 + m11 + m22 - 3) < H)) {

					// This singularity is the identity matrix. The angle is zero.
					this.set(1, 0, 0, 0);

				} else {

					// The angle is 180.
					angle = Math.PI;

					xx = (m00 + 1) / 2;
					yy = (m11 + 1) / 2;
					zz = (m22 + 1) / 2;
					xy = (m01 + m10) / 4;
					xz = (m02 + m20) / 4;
					yz = (m12 + m21) / 4;

					if((xx > yy) && (xx > zz)) {

						// m00 is the largest diagonal term.
						if(xx < E) {

							x = 0;
							y = 0.707106781;
							z = 0.707106781;

						} else {

							x = Math.sqrt(xx);
							y = xy / x;
							z = xz / x;

						}

					} else if(yy > zz) {

						// m11 is the largest diagonal term.
						if(yy < E) {

							x = 0.707106781;
							y = 0;
							z = 0.707106781;

						} else {

							y = Math.sqrt(yy);
							x = xy / y;
							z = yz / y;

						}

					} else {

						// m22 is the largest diagonal term.
						if(zz < E) {

							x = 0.707106781;
							y = 0.707106781;
							z = 0;

						} else {

							z = Math.sqrt(zz);
							x = xz / z;
							y = yz / z;

						}

					}

					this.set(x, y, z, angle);

				}

			} else {

				// There are no singularities.
				s = Math.sqrt(
					(m21 - m12) * (m21 - m12) +
					(m02 - m20) * (m02 - m20) +
					(m10 - m01) * (m10 - m01)
				);

				// Prevent division by zero.
				if(Math.abs(s) < 0.001) {

					s = 1;

				}

				this.x = (m21 - m12) / s;
				this.y = (m02 - m20) / s;
				this.z = (m10 - m01) / s;
				this.w = Math.acos((m00 + m11 + m22 - 1) / 2);

			}

			return this;

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @param {Vector4} v - The vector to add.
		 * @return {Vector4} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			this.w += v.w;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @param {Number} s - The scalar to add.
		 * @return {Vector4} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;
			this.z += s;
			this.w += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @param {Vector4} a - A vector.
		 * @param {Vector4} b - Another vector.
		 * @return {Vector4} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;
			this.w = a.w + b.w;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @param {Vector4} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector4} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;
			this.w += v.w * s;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @param {Vector4} v - The vector to subtract.
		 * @return {Vector4} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
			this.w -= v.w;

			return this;

		}

		/**
		 * Subtracts a scalar from this vector.
		 *
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector4} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;
			this.z -= s;
			this.w -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @param {Vector4} a - A vector.
		 * @param {Vector4} b - A second vector.
		 * @return {Vector4} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			this.w = a.w - b.w;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;
			this.w *= v.w;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector4} This vector.
		 */

		multiplyScalar(s) {

			this.x *= s;
			this.y *= s;
			this.z *= s;
			this.w *= s;

			return this;

		}

		/**
		 * Sets this vector to the product of two given vectors.
		 *
		 * @param {Vector4} a - A vector.
		 * @param {Vector4} b - Another vector.
		 * @return {Vector4} This vector.
		 */

		multiplyVectors(a, b) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;
			this.w = a.w * b.w;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;
			this.w /= v.w;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector4} This vector.
		 */

		divideScalar(s) {

			this.x /= s;
			this.y /= s;
			this.z /= s;
			this.w /= s;

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector4} This vector.
		 */

		applyMatrix4(m) {

			const x = this.x, y = this.y, z = this.z, w = this.w;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
			this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
			this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
			this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;
			this.w = -this.w;

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

		}

		/**
		 * Calculates the Manhattan length of this vector.
		 *
		 * @return {Number} The length.
		 */

		manhattanLength() {

			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return (
				this.x * this.x +
				this.y * this.y +
				this.z * this.z +
				this.w * this.w
			);

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(
				this.x * this.x +
				this.y * this.y +
				this.z * this.z +
				this.w * this.w
			);

		}

		/**
		 * Calculates the Manhattan distance to a given vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The distance.
		 */

		manhattanDistanceTo(v) {

			return (
				Math.abs(this.x - v.x) +
				Math.abs(this.y - v.y) +
				Math.abs(this.z - v.z) +
				Math.abs(this.w - v.w)
			);

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;
			const dz = this.z - v.z;
			const dw = this.w - v.w;

			return dx * dx + dy * dy + dz * dz + dw * dw;

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Normalizes this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Sets the length of this vector.
		 *
		 * @param {Number} length - The new length.
		 * @return {Vector4} This vector.
		 */

		setLength(length) {

			return this.normalize().multiplyScalar(length);

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);
			this.w = Math.min(this.w, v.w);

			return this;

		}

		/**
		 * Adopts the max value for each component of this vector and the given one.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);
			this.w = Math.max(this.w, v.w);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @param {Vector4} min - The lower bounds. Assumed to be smaller than max.
		 * @param {Vector4} max - The upper bounds. Assumed to be greater than min.
		 * @return {Vector4} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));
			this.z = Math.max(min.z, Math.min(max.z, this.z));
			this.w = Math.max(min.w, Math.min(max.w, this.w));

			return this;

		}

		/**
		 * Floors this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.z = Math.floor(this.z);
			this.w = Math.floor(this.w);

			return this;

		}

		/**
		 * Ceils this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			this.z = Math.ceil(this.z);
			this.w = Math.ceil(this.w);

			return this;

		}

		/**
		 * Rounds this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			this.z = Math.round(this.z);
			this.w = Math.round(this.w);

			return this;

		}

		/**
		 * Lerps towards the given vector.
		 *
		 * @param {Vector4} v - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector4} This vector.
		 */

		lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;
			this.z += (v.z - this.z) * alpha;
			this.w += (v.w - this.w) * alpha;

			return this;

		}

		/**
		 * Sets this vector to the lerp result of the given vectors.
		 *
		 * @param {Vector4} v1 - A base vector.
		 * @param {Vector4} v2 - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector4} This vector.
		 */

		lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w);

		}

	}

	/**
	 * Mathematical data structures.
	 *
	 * @module math-ds
	 */

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
	 * A basic iterator result.
	 *
	 * The next method of an iterator always has to return an object with
	 * appropriate properties including done and value.
	 */

	class IteratorResult {

		/**
		 * Constructs a new iterator result.
		 *
		 * @param {Vector3} [value=null] - A value.
		 * @param {Vector3} [done=false] - Whether this result is past the end of the iterated sequence.
		 */

		constructor(value = null, done = false) {

			/**
			 * An arbitrary value returned by the iterator.
			 *
			 * @type Object
			 * @default null
			 */

			this.value = value;

			/**
			 * Whether this result is past the end of the iterated sequence.
			 *
			 * @type Boolean
			 * @default false
			 */

			this.done = done;

		}

		/**
		 * Resets this iterator result.
		 */

		reset() {

			this.value = null;
			this.done = false;

		}

	}

	/**
	 * A compilation of the library components.
	 *
	 * @module iterator-result
	 */

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const c$1 = new Vector3();

	/**
	 * An octant.
	 */

	class Octant {

		/**
		 * Constructs a new octant.
		 *
		 * @param {Vector3} [min] - The lower bounds.
		 * @param {Vector3} [max] - The upper bounds.
		 */

		constructor(min = new Vector3(), max = new Vector3()) {

			/**
			 * The lower bounds of this octant.
			 *
			 * @type {Vector3}
			 */

			this.min = min;

			/**
			 * The upper bounds of the octant.
			 *
			 * @type {Vector3}
			 */

			this.max = max;

			/**
			 * The children of this octant.
			 *
			 * @type {Octant[]}
			 * @default null
			 */

			this.children = null;

		}

		/**
		 * Computes the center of this octant.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the center of this octant.
		 */

		getCenter(target = new Vector3()) {

			return target.addVectors(this.min, this.max).multiplyScalar(0.5);

		}

		/**
		 * Computes the size of this octant.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the size of this octant.
		 */

		getDimensions(target = new Vector3()) {

			return target.subVectors(this.max, this.min);

		}

		/**
		 * Splits this octant into eight smaller ones.
		 */

		split() {

			const min = this.min;
			const max = this.max;
			const mid = this.getCenter(c$1);

			const children = this.children = [

				null, null,
				null, null,
				null, null,
				null, null

			];

			let i, combination;

			for(i = 0; i < 8; ++i) {

				combination = pattern[i];

				children[i] = new this.constructor(

					new Vector3(
						(combination[0] === 0) ? min.x : mid.x,
						(combination[1] === 0) ? min.y : mid.y,
						(combination[2] === 0) ? min.z : mid.z
					),

					new Vector3(
						(combination[0] === 0) ? mid.x : max.x,
						(combination[1] === 0) ? mid.y : max.y,
						(combination[2] === 0) ? mid.z : max.z
					)

				);

			}

		}

	}

	/**
	 * A binary pattern that describes the standard octant layout:
	 *
	 * ```text
	 *    3____7
	 *  2/___6/|
	 *  | 1__|_5
	 *  0/___4/
	 * ```
	 *
	 * This common layout is crucial for positional assumptions.
	 *
	 * @type {Uint8Array[]}
	 */

	const pattern = [

		new Uint8Array([0, 0, 0]),
		new Uint8Array([0, 0, 1]),
		new Uint8Array([0, 1, 0]),
		new Uint8Array([0, 1, 1]),

		new Uint8Array([1, 0, 0]),
		new Uint8Array([1, 0, 1]),
		new Uint8Array([1, 1, 0]),
		new Uint8Array([1, 1, 1])

	];

	/**
	 * Describes all possible octant corner connections.
	 *
	 * @type {Uint8Array[]}
	 */

	const edges = [

		// X-Axis.
		new Uint8Array([0, 4]),
		new Uint8Array([1, 5]),
		new Uint8Array([2, 6]),
		new Uint8Array([3, 7]),

		// Y-Axis.
		new Uint8Array([0, 2]),
		new Uint8Array([1, 3]),
		new Uint8Array([4, 6]),
		new Uint8Array([5, 7]),

		// Z-Axis.
		new Uint8Array([0, 1]),
		new Uint8Array([2, 3]),
		new Uint8Array([4, 5]),
		new Uint8Array([6, 7])

	];

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const c$2 = new Vector3();

	/**
	 * A cubic octant.
	 */

	class CubicOctant {

		/**
		 * Constructs a new cubic octant.
		 *
		 * @param {Vector3} [min] - The lower bounds.
		 * @param {Number} [size=0] - The size of the octant.
		 */

		constructor(min = new Vector3(), size = 0) {

			/**
			 * The lower bounds of this octant.
			 *
			 * @type {Vector3}
			 */

			this.min = min;

			/**
			 * The size of this octant.
			 *
			 * @type {Number}
			 */

			this.size = size;

			/**
			 * The children of this octant.
			 *
			 * @type {CubicOctant[]}
			 * @default null
			 */

			this.children = null;

		}

		/**
		 * The upper bounds of this octant.
		 *
		 * Accessing this property always creates a new vector.
		 *
		 * @type {Vector3}
		 */

		get max() { return this.min.clone().addScalar(this.size); }

		/**
		 * Computes the center of this octant.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the center of this octant.
		 */

		getCenter(target = new Vector3()) {

			return target.copy(this.min).addScalar(this.size * 0.5);

		}

		/**
		 * Returns the size of this octant as a vector.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the size of this octant.
		 */

		getDimensions(target = new Vector3()) {

			return target.set(this.size, this.size, this.size);

		}

		/**
		 * Splits this octant into eight smaller ones.
		 */

		split() {

			const min = this.min;
			const mid = this.getCenter(c$2);
			const halfSize = this.size * 0.5;

			const children = this.children = [

				null, null,
				null, null,
				null, null,
				null, null

			];

			let i, combination;

			for(i = 0; i < 8; ++i) {

				combination = pattern[i];

				children[i] = new this.constructor(

					new Vector3(
						(combination[0] === 0) ? min.x : mid.x,
						(combination[1] === 0) ? min.y : mid.y,
						(combination[2] === 0) ? min.z : mid.z
					),

					halfSize

				);

			}

		}

	}

	/**
	 * A 3D box.
	 *
	 * @type {Box3}
	 * @private
	 */

	const b$3 = new Box3();

	/**
	 * An octant iterator.
	 *
	 * @implements {Iterator}
	 * @implements {Iterable}
	 */

	class OctantIterator {

		/**
		 * Constructs a new octant iterator.
		 *
		 * @param {Octree} octree - An octree.
		 * @param {Frustum|Box3} [region=null] - A cull region.
		 */

		constructor(octree, region = null) {

			/**
			 * The octree.
			 *
			 * @type {Octree}
			 * @private
			 */

			this.octree = octree;

			/**
			 * A region used for octree culling.
			 *
			 * @type {Frustum|Box3}
			 * @default null
			 */

			this.region = region;

			/**
			 * Whether this iterator should respect the cull region.
			 *
			 * @type {Boolean}
			 * @default false
			 */

			this.cull = (region !== null);

			/**
			 * An iterator result.
			 *
			 * @type {IteratorResult}
			 * @private
			 */

			this.result = new IteratorResult();

			/**
			 * An octant trace.
			 *
			 * @type {Octant[]}
			 * @private
			 */

			this.trace = null;

			/**
			 * Iteration indices.
			 *
			 * @type {Number[]}
			 * @private
			 */

			this.indices = null;

			this.reset();

		}

		/**
		 * Resets this iterator.
		 *
		 * @return {OctantIterator} This iterator.
		 */

		reset() {

			const root = this.octree.root;

			this.trace = [];
			this.indices = [];

			if(root !== null) {

				b$3.min = root.min;
				b$3.max = root.max;

				if(!this.cull || this.region.intersectsBox(b$3)) {

					this.trace.push(root);
					this.indices.push(0);

				}

			}

			this.result.reset();

			return this;

		}

		/**
		 * Iterates over the leaf octants.
		 *
		 * @return {IteratorResult} The next leaf octant.
		 */

		next() {

			const cull = this.cull;
			const region = this.region;
			const indices = this.indices;
			const trace = this.trace;

			let octant = null;
			let depth = trace.length - 1;

			let index, children, child;

			while(octant === null && depth >= 0) {

				index = indices[depth];
				children = trace[depth].children;

				++indices[depth];

				if(index < 8) {

					if(children !== null) {

						child = children[index];

						if(cull) {

							b$3.min = child.min;
							b$3.max = child.max;

							if(!region.intersectsBox(b$3)) {

								// Cull this octant.
								continue;

							}

						}

						trace.push(child);
						indices.push(0);

						++depth;

					} else {

						octant = trace.pop();
						indices.pop();

					}

				} else {

					trace.pop();
					indices.pop();

					--depth;

				}

			}

			this.result.value = octant;
			this.result.done = (octant === null);

			return this.result;

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
		 * @return {OctantIterator} An iterator.
		 */

		[Symbol.iterator]() {

			return this;

		}

	}

	/**
	 * A list of vectors.
	 *
	 * @type {Vector3[]}
	 * @private
	 * @final
	 */

	const v$4 = [
		new Vector3(),
		new Vector3(),
		new Vector3()
	];

	/**
	 * A box.
	 *
	 * @type {Box3}
	 * @private
	 * @final
	 */

	const b$4 = new Box3();

	/**
	 * A ray.
	 *
	 * @type {Ray}
	 * @private
	 * @final
	 */

	const r = new Ray();

	/**
	 * A lookup-table containing octant ids. Used to determine the exit plane from
	 * an octant.
	 *
	 * @type {Uint8Array[]}
	 * @private
	 * @final
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
			if(tym < tx0) { entry |= 2; }
			if(tzm < tx0) { entry |= 1; }

		} else if(ty0 > tz0) {

			// XZ-plane.
			if(txm < ty0) { entry |= 4; }
			if(tzm < ty0) { entry |= 1; }

		} else {

			// XY-plane.
			if(txm < tz0) { entry |= 4; }
			if(tym < tz0) { entry |= 2; }

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
	 * Finds all octants that intersect with the given ray.
	 *
	 * @private
	 * @param {Octant} octant - The current octant.
	 * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.
	 * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.
	 * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.
	 * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.
	 * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.
	 * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with the intersecting octants.
	 */

	function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

		const children = octant.children;

		let currentOctant;
		let txm, tym, tzm;

		if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

			if(children === null) {

				// Leaf.
				intersects.push(octant);

			} else {

				// Compute means.
				txm = 0.5 * (tx0 + tx1);
				tym = 0.5 * (ty0 + ty1);
				tzm = 0.5 * (tz0 + tz1);

				currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

				do {

					/* The possibilities for the next node are passed in the same respective
					 * order as the t-values. Hence, if the first value is found to be the
					 * greatest, the fourth one will be returned. If the second value is the
					 * greatest, the fifth one will be returned, etc.
					 */

					switch(currentOctant) {

						case 0:
							raycastOctant(children[flags], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
							break;

						case 1:
							raycastOctant(children[flags ^ 1], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
							break;

						case 2:
							raycastOctant(children[flags ^ 2], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
							break;

						case 3:
							raycastOctant(children[flags ^ 3], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
							break;

						case 4:
							raycastOctant(children[flags ^ 4], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
							break;

						case 5:
							raycastOctant(children[flags ^ 5], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
							break;

						case 6:
							raycastOctant(children[flags ^ 6], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
							break;

						case 7:
							raycastOctant(children[flags ^ 7], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);
							// Far top right octant. No other octants can be reached from here.
							currentOctant = 8;
							break;

					}

				} while(currentOctant < 8);

			}

		}

	}

	/**
	 * An octree raycaster.
	 *
	 * Based on:
	 *  "An Efficient Parametric Algorithm for Octree Traversal"
	 *  by J. Revelles et al. (2000).
	 */

	class OctreeRaycaster {

		/**
		 * Finds the octants that intersect with the given ray. The intersecting
		 * octants are sorted by distance, closest first.
		 *
		 * @param {Octree} octree - An octree.
		 * @param {Raycaster} raycaster - A raycaster.
		 * @param {Array} intersects - A list to be filled with intersecting octants.
		 */

		static intersectOctree(octree, raycaster, intersects) {

			// Translate the octree extents to the scene origin.
			const min = b$4.min.set(0, 0, 0);
			const max = b$4.max.subVectors(octree.max, octree.min);

			const dimensions = octree.getDimensions(v$4[0]);
			const halfDimensions = v$4[1].copy(dimensions).multiplyScalar(0.5);

			const origin = r.origin.copy(raycaster.ray.origin);
			const direction = r.direction.copy(raycaster.ray.direction);

			let invDirX, invDirY, invDirZ;
			let tx0, tx1, ty0, ty1, tz0, tz1;

			// Translate the ray to the center of the octree.
			origin.sub(octree.getCenter(v$4[2])).add(halfDimensions);

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

			// Project the ray to the root's boundaries.
			tx0 = (min.x - origin.x) * invDirX;
			tx1 = (max.x - origin.x) * invDirX;
			ty0 = (min.y - origin.y) * invDirY;
			ty1 = (max.y - origin.y) * invDirY;
			tz0 = (min.z - origin.z) * invDirZ;
			tz1 = (max.z - origin.z) * invDirZ;

			// Check if the ray hits the octree.
			if(Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {

				// Find the intersecting octants.
				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);

			}

		}

	}

	/**
	 * A 3D box.
	 *
	 * @type {Box3}
	 * @private
	 */

	const b$5 = new Box3();

	/**
	 * Recursively calculates the depth of the given octree.
	 *
	 * @private
	 * @param {Octant} octant - An octant.
	 * @return {Number} The depth.
	 */

	function getDepth(octant) {

		const children = octant.children;

		let result = 0;
		let i, l, d;

		if(children !== null) {

			for(i = 0, l = children.length; i < l; ++i) {

				d = 1 + getDepth(children[i]);

				if(d > result) {

					result = d;

				}

			}

		}

		return result;

	}

	/**
	 * Recursively collects octants that lie inside the specified region.
	 *
	 * @private
	 * @param {Octant} octant - An octant.
	 * @param {Frustum|Box3} region - A region.
	 * @param {Octant[]} result - A list to be filled with octants that intersect with the region.
	 */

	function cull(octant, region, result) {

		const children = octant.children;

		let i, l;

		b$5.min = octant.min;
		b$5.max = octant.max;

		if(region.intersectsBox(b$5)) {

			if(children !== null) {

				for(i = 0, l = children.length; i < l; ++i) {

					cull(children[i], region, result);

				}

			} else {

				result.push(octant);

			}

		}

	}

	/**
	 * Recursively fetches all octants with the specified depth level.
	 *
	 * @private
	 * @param {Octant} octant - An octant.
	 * @param {Number} level - The target depth level.
	 * @param {Number} depth - The current depth level.
	 * @param {Octant[]} result - A list to be filled with the identified octants.
	 */

	function findOctantsByLevel(octant, level, depth, result) {

		const children = octant.children;

		let i, l;

		if(depth === level) {

			result.push(octant);

		} else if(children !== null) {

			++depth;

			for(i = 0, l = children.length; i < l; ++i) {

				findOctantsByLevel(children[i], level, depth, result);

			}

		}

	}

	/**
	 * An octree that subdivides space for fast spatial searches.
	 *
	 * @implements {Iterable}
	 */

	class Octree {

		/**
		 * Constructs a new octree.
		 *
		 * @param {Vector3} [min] - The lower bounds of the tree. If not provided, the octree will not create a root node.
		 * @param {Vector3} [max] - The upper bounds of the tree. If not provided, the octree will not create a root node.
		 */

		constructor(min, max) {

			/**
			 * The root octant.
			 *
			 * @type {Octant}
			 * @default null
			 */

			this.root = (min !== undefined && max !== undefined) ? new Octant(min, max) : null;

		}

		/**
		 * The lower bounds of the root octant.
		 *
		 * @type {Vector3}
		 */

		get min() { return this.root.min; }

		/**
		 * The upper bounds of the root octant.
		 *
		 * @type {Vector3}
		 */

		get max() { return this.root.max; }

		/**
		 * The children of the root octant.
		 *
		 * @type {Octant[]}
		 */

		get children() { return this.root.children; }

		/**
		 * Calculates the center of this octree.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the center of this octree.
		 */

		getCenter(target) { return this.root.getCenter(target); }

		/**
		 * Calculates the size of this octree.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the size of this octree.
		 */

		getDimensions(target) { return this.root.getDimensions(target); }

		/**
		 * Calculates the current depth of this octree.
		 *
		 * @return {Number} The depth.
		 */

		getDepth() { return getDepth(this.root); }

		/**
		 * Recursively collects octants that intersect with the specified region.
		 *
		 * @param {Frustum|Box3} region - A region.
		 * @return {Octant[]} The octants.
		 */

		cull(region) {

			const result = [];

			cull(this.root, region, result);

			return result;

		}

		/**
		 * Fetches all octants with the specified depth level.
		 *
		 * @param {Number} level - The depth level.
		 * @return {Octant[]} The octants.
		 */

		findOctantsByLevel(level) {

			const result = [];

			findOctantsByLevel(this.root, level, 0, result);

			return result;

		}

		/**
		 * Finds the octants that intersect with the given ray. The intersecting
		 * octants are sorted by distance, closest first.
		 *
		 * @param {Raycaster} raycaster - A raycaster.
		 * @param {Octant[]} [intersects] - An optional target list to be filled with the intersecting octants.
		 * @return {Octant[]} The intersecting octants.
		 */

		raycast(raycaster, intersects = []) {

			OctreeRaycaster.intersectOctree(this, raycaster, intersects);

			return intersects;

		}

		/**
		 * Returns an iterator that traverses the octree and returns leaf nodes.
		 *
		 * When a cull region is provided, the iterator will only return leaves that
		 * intersect with that region.
		 *
		 * @param {Frustum|Box3} [region] - A cull region.
		 * @return {OctantIterator} An iterator.
		 */

		leaves(region) {

			return new OctantIterator(this, region);

		}

		/**
		 * Returns an iterator that traverses the octree and returns all leaf nodes.
		 *
		 * @return {OctantIterator} An iterator.
		 */

		[Symbol.iterator]() {

			return new OctantIterator(this);

		}

	}

	/**
	 * Core components.
	 *
	 * @module sparse-octree/core
	 */

	/**
	 * An octant that maintains points.
	 */

	/**
	 * A collection of ray-point intersection data.
	 */

	/**
	 * An octree that manages points.
	 */

	/**
	 * Point-oriented octree components.
	 *
	 * @module sparse-octree/points
	 */

	/**
	 * A collection of octree utility functions.
	 */

	/**
	 * Octree utilities.
	 *
	 * @module sparse-octree/utils
	 */

	/**
	 * Exposure of the library components.
	 *
	 * @module sparse-octree
	 */

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

	const p$1 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$6 = new Vector3();

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

				p$1.addVectors(this.a, v$6.copy(ab).multiplyScalar(c));
				densityC = sdf.sample(p$1);

				if(Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {

					// Solution found.
					break;

				} else {

					p$1.addVectors(this.a, v$6.copy(ab).multiplyScalar(a));
					densityA = sdf.sample(p$1);

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

			const dx = sdf.sample(p$1.addVectors(position, v$6.set(E, 0, 0))) - sdf.sample(p$1.subVectors(position, v$6.set(E, 0, 0)));
			const dy = sdf.sample(p$1.addVectors(position, v$6.set(0, E, 0))) - sdf.sample(p$1.subVectors(position, v$6.set(0, E, 0)));
			const dz = sdf.sample(p$1.addVectors(position, v$6.set(0, 0, E))) - sdf.sample(p$1.subVectors(position, v$6.set(0, 0, E)));

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
		 * @param {Number} [x=0] - The amount of edges along the X-axis. If <= 0, no memory will be allocated.
		 * @param {Number} [y=x] - The amount of edges along the Y-axis. If omitted, this will be the same as x.
		 * @param {Number} [z=x] - The amount of edges along the Z-axis. If omitted, this will be the same as x.
		 */

		constructor(x = 0, y = x, z = x) {

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
	 * Rounds the given number up to the next power of two.
	 *
	 * @private
	 * @param {Number} n - A number.
	 * @return {Number} The next power of two.
	 */

	function ceil2(n) {

		return Math.pow(2, Math.max(0, Math.ceil(Math.log2(n))));

	}

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
						this.edgeData = new EdgeData();

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

			resolution = Math.max(1, Math.min(256, ceil2(value)));
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

	const m$1 = new Matrix4();

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

			this.inverseTransformation.getInverse(this.getTransformation(m$1));
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

	const p$2 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$7 = new Vector3();

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

					offset = pattern[i];

					p$2.set(
						keyX + offset[0],
						keyY + offset[1],
						keyZ + offset[2]
					);

					// Check if the child is affected.
					if(range.containsPoint(p$2)) {

						// Apply the difference operation to the child.
						applyDifference(world, sdf, grid.get(keyDesign.packKey(p$2)), p$2.x, p$2.y, p$2.z, lod);

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
						keyDesign.unpackKey(key, v$7);
						v$7.x <<= 1; v$7.y <<= 1; v$7.z <<= 1;

						// Determine the existence of the child octants.
						for(i = 0; i < 8; ++i) {

							offset = pattern[i];

							p$2.set(
								v$7.x + offset[0],
								v$7.y + offset[1],
								v$7.z + offset[2]
							);

							if(range.containsPoint(p$2)) {

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

					keyDesign.unpackKey(key, v$7);

					// Recursively modify affected LOD zero cells.
					applyDifference(world, sdf, grid.get(key), v$7.x, v$7.y, v$7.z, lod);

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

			// Account for overlapping cells.
			// @todo

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

	const v$8 = new Vector3();

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

	const b$7 = new Box3();

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

	const r$1 = new Ray();

	/**
	 * A lookup-table containing octant ids. Used to determine the exit plane from
	 * an octant.
	 *
	 * @type {Uint8Array[]}
	 * @private
	 */

	const octantTable$1 = [

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

	let flags$1 = 0;

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

	function findEntryOctant$1(tx0, ty0, tz0, txm, tym, tzm) {

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

	function findNextOctant$1(currentOctant, tx1, ty1, tz1) {

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

		return octantTable$1[currentOctant][exit];

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

	function raycastOctant$1(world, octant, keyX, keyY, keyZ, lod, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {

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
				octantWrapper.id.set(lod, keyDesign.packKey(v$8.set(keyX, keyY, keyZ)));
				octantWrapper.min.copy(v$8).multiplyScalar(cellSize).add(world.min);
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

				currentOctant = findEntryOctant$1(tx0, ty0, tz0, txm, tym, tzm);

				do {

					i = flags$1 ^ currentOctant;

					switch(currentOctant) {

						case 0: {

							if((children & (1 << i)) !== 0) {

								offset = pattern[i];
								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, tx0, ty0, tz0, txm, tym, tzm, intersects);

							}

							currentOctant = findNextOctant$1(currentOctant, txm, tym, tzm);
							break;

						}

						case 1: {

							if((children & (1 << i)) !== 0) {

								offset = pattern[i];
								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, tx0, ty0, tzm, txm, tym, tz1, intersects);

							}

							currentOctant = findNextOctant$1(currentOctant, txm, tym, tz1);
							break;

						}

						case 2: {

							if((children & (1 << i)) !== 0) {

								offset = pattern[i];
								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, tx0, tym, tz0, txm, ty1, tzm, intersects);

							}

							currentOctant = findNextOctant$1(currentOctant, txm, ty1, tzm);
							break;

						}

						case 3: {

							if((children & (1 << i)) !== 0) {

								offset = pattern[i];
								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, tx0, tym, tzm, txm, ty1, tz1, intersects);

							}

							currentOctant = findNextOctant$1(currentOctant, txm, ty1, tz1);
							break;

						}

						case 4: {

							if((children & (1 << i)) !== 0) {

								offset = pattern[i];
								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, txm, ty0, tz0, tx1, tym, tzm, intersects);

							}

							currentOctant = findNextOctant$1(currentOctant, tx1, tym, tzm);
							break;

						}

						case 5: {

							if((children & (1 << i)) !== 0) {

								offset = pattern[i];
								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, txm, ty0, tzm, tx1, tym, tz1, intersects);

							}

							currentOctant = findNextOctant$1(currentOctant, tx1, tym, tz1);
							break;

						}

						case 6: {

							if((children & (1 << i)) !== 0) {

								offset = pattern[i];
								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, txm, tym, tz0, tx1, ty1, tzm, intersects);

							}

							currentOctant = findNextOctant$1(currentOctant, tx1, ty1, tzm);
							break;

						}

						case 7: {

							if((children & (1 << i)) !== 0) {

								offset = pattern[i];
								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, txm, tym, tzm, tx1, ty1, tz1, intersects);

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
		const min = b$7.min.set(0, 0, 0);
		const max = b$7.max.subVectors(subtree.max, subtree.min);

		const dimensions = subtree.getDimensions(d.min);
		const halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);

		const origin = r$1.origin.copy(ray.origin);
		const direction = r$1.direction.copy(ray.direction);

		let invDirX, invDirY, invDirZ;
		let tx0, tx1, ty0, ty1, tz0, tz1;

		// Translate the ray to the center of the octant.
		origin.sub(subtree.getCenter(v$8)).add(halfDimensions);

		// Reset all flags.
		flags$1 = 0;

		// Handle rays with negative directions.
		if(direction.x < 0.0) {

			origin.x = dimensions.x - origin.x;
			direction.x = -direction.x;
			flags$1 |= 4;

		}

		if(direction.y < 0.0) {

			origin.y = dimensions.y - origin.y;
			direction.y = -direction.y;
			flags$1 |= 2;

		}

		if(direction.z < 0.0) {

			origin.z = dimensions.z - origin.z;
			direction.z = -direction.z;
			flags$1 |= 1;

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
		raycastOctant$1(
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
			const a = !world.containsPoint(r$1.copy(ray).origin) ?
				r$1.intersectBox(world, r$1.origin) :
				r$1.origin;

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
				b = r$1.at(t, v$8);

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

	const v$9 = new Vector3();

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

					offset = pattern[i];

					v$9.set(
						keyX + offset[0],
						keyY + offset[1],
						keyZ + offset[2]
					);

					key = keyDesign.packKey(v$9);

					// Fetch the child and remove it from the grid.
					child = grid.get(key);
					grid.delete(key);

					removeChildren(world, child, v$9.x, v$9.y, v$9.z, lod);

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
			v$9.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);

			// The resulting coordinates identify the parent octant.
			key = world.getKeyDesign().packKey(v$9);
			parent = grid.get(key);

			// Unset the existence flag of the deleted child.
			parent.children &= ~(1 << i);

			// Check if there are any children left.
			if(parent.children === 0) {

				// Remove the empty parent and recur.
				grid.delete(key);
				prune(world, v$9.x, v$9.y, v$9.z, lod);

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
			v$9.subVectors(position, this.min);

			target.set(
				Math.trunc(v$9.x / cellSize),
				Math.trunc(v$9.y / cellSize),
				Math.trunc(v$9.z / cellSize)
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

					this.calculateKeyCoordinates(point, lod, v$9);
					result = grid.get(keyDesign.packKey(v$9));

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
					keyDesign.unpackKey(key, v$9);
					keyX = v$9.x; keyY = v$9.y; keyZ = v$9.z;

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
	 * A clipmap event.
	 */

	class ClipmapEvent extends Event {

		/**
		 * Constructs a new clipmap event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			super(type);

			/**
			 * The LOD shell.
			 *
			 * @type {Number}
			 */

			this.lod = -1;

			/**
			 * A list of world octant Identifiers that have left the LOD shell.
			 *
			 * @type {WorldOctantId[]}
			 */

			this.left = null;

			/**
			 * A list of world octant Identifiers that have entered the LOD shell.
			 *
			 * @type {WorldOctantId[]}
			 */

			this.entered = null;

			/**
			 * An error event.
			 *
			 * @type {ErrorEvent}
			 */

			this.error = null;

		}

	}

	/**
	 * Signals the end of a clipmap update for a single LOD shell.
	 *
	 * This event is dispatched by {@link Clipmap}.
	 *
	 * @type {ClipmapEvent}
	 * @example terrain.addEventListener("update", myListener);
	 */

	const update = new ClipmapEvent("update");

	/**
	 * Signals the occurrence of an unexpected error.
	 *
	 * This event is dispatched by {@link Clipmap}.
	 *
	 * @type {ClipmapEvent}
	 * @example terrain.addEventListener("error", myListener);
	 */

	const error = new ClipmapEvent("error");

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

	const m$2 = new Matrix4();

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
			f.setFromMatrix(m$2.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

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
	 * A collection of worker messages.
	 *
	 * @module rabbit-hole/worker/messages
	 */

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

	var worker = "(function () {\n\t'use strict';\n\n\t/**\r\n\t * Run-Length Encoding for numerical data.\r\n\t */\r\n\r\n\tclass RunLengthEncoding {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new container for Run-Length encoded data.\r\n\t\t *\r\n\t\t * @param {Number[]} [runLengths=null] - The run lengths.\r\n\t\t * @param {Number[]} [data=null] - The encoded data.\r\n\t\t */\r\n\r\n\t\tconstructor(runLengths = null, data = null) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The run lengths.\r\n\t\t\t *\r\n\t\t\t * @type {Number[]}\r\n\t\t\t */\r\n\r\n\t\t\tthis.runLengths = runLengths;\r\n\r\n\t\t\t/**\r\n\t\t\t * The encoded data.\r\n\t\t\t *\r\n\t\t\t * @type {Number[]}\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = data;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Encodes the given data.\r\n\t\t *\r\n\t\t * @param {Number[]} array - The data to encode.\r\n\t\t * @return {RunLengthEncoding} The run-lengths and the encoded data.\r\n\t\t */\r\n\r\n\t\tstatic encode(array) {\r\n\r\n\t\t\tconst runLengths = [];\r\n\t\t\tconst data = [];\r\n\r\n\t\t\tlet previous = array[0];\r\n\t\t\tlet count = 1;\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 1, l = array.length; i < l; ++i) {\r\n\r\n\t\t\t\tif(previous !== array[i]) {\r\n\r\n\t\t\t\t\trunLengths.push(count);\r\n\t\t\t\t\tdata.push(previous);\r\n\r\n\t\t\t\t\tprevious = array[i];\r\n\t\t\t\t\tcount = 1;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\t++count;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\trunLengths.push(count);\r\n\t\t\tdata.push(previous);\r\n\r\n\t\t\treturn new RunLengthEncoding(runLengths, data);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Decodes the given data.\r\n\t\t *\r\n\t\t * @param {Number[]} runLengths - The run-lengths.\r\n\t\t * @param {Number[]} data - The data to decode.\r\n\t\t * @param {Array} [array] - An optional target.\r\n\t\t * @return {Array} The decoded data.\r\n\t\t */\r\n\r\n\t\tstatic decode(runLengths, data, array = []) {\r\n\r\n\t\t\tlet element;\r\n\r\n\t\t\tlet i, j, il, jl;\r\n\t\t\tlet k = 0;\r\n\r\n\t\t\tfor(i = 0, il = data.length; i < il; ++i) {\r\n\r\n\t\t\t\telement = data[i];\r\n\r\n\t\t\t\tfor(j = 0, jl = runLengths[i]; j < jl; ++j) {\r\n\r\n\t\t\t\t\tarray[k++] = element;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A vector with three components.\r\n\t */\r\n\r\n\tclass Vector3 {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new vector.\r\n\t\t *\r\n\t\t * @param {Number} [x=0] - The X component.\r\n\t\t * @param {Number} [y=0] - The Y component.\r\n\t\t * @param {Number} [z=0] - The Z component.\r\n\t\t */\r\n\r\n\t\tconstructor(x = 0, y = 0, z = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The X component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.x = x;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Y component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.y = y;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Z component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.z = z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this vector\r\n\t\t *\r\n\t\t * @param {Number} x - The X component.\r\n\t\t * @param {Number} y - The Y component.\r\n\t\t * @param {Number} z - The Z component.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tset(x, y, z) {\r\n\r\n\t\t\tthis.x = x;\r\n\t\t\tthis.y = y;\r\n\t\t\tthis.z = z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of another vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tcopy(v) {\r\n\r\n\t\t\tthis.x = v.x;\r\n\t\t\tthis.y = v.y;\r\n\t\t\tthis.z = v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this vector.\r\n\t\t *\r\n\t\t * @return {Vector3} A clone of this vector.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor(this.x, this.y, this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from an array.\r\n\t\t *\r\n\t\t * @param {Number[]} array - An array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tfromArray(array, offset = 0) {\r\n\r\n\t\t\tthis.x = array[offset];\r\n\t\t\tthis.y = array[offset + 1];\r\n\t\t\tthis.z = array[offset + 2];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores this vector in an array.\r\n\t\t *\r\n\t\t * @param {Array} [array] - A target array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Number[]} The array.\r\n\t\t */\r\n\r\n\t\ttoArray(array = [], offset = 0) {\r\n\r\n\t\t\tarray[offset] = this.x;\r\n\t\t\tarray[offset + 1] = this.y;\r\n\t\t\tarray[offset + 2] = this.z;\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this vector based on a spherical description.\r\n\t\t *\r\n\t\t * @param {Spherical} s - A spherical description.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsetFromSpherical(s) {\r\n\r\n\t\t\tconst sinPhiRadius = Math.sin(s.phi) * s.radius;\r\n\r\n\t\t\tthis.x = sinPhiRadius * Math.sin(s.theta);\r\n\t\t\tthis.y = Math.cos(s.phi) * s.radius;\r\n\t\t\tthis.z = sinPhiRadius * Math.cos(s.theta);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this vector based on a cylindrical description.\r\n\t\t *\r\n\t\t * @param {Cylindrical} c - A cylindrical description.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsetFromCylindrical(c) {\r\n\r\n\t\t\tthis.x = c.radius * Math.sin(c.theta);\r\n\t\t\tthis.y = c.y;\r\n\t\t\tthis.z = c.radius * Math.cos(c.theta);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a matrix column.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A 4x4 matrix.\r\n\t\t * @param {Number} index - A column index of the range [0, 2].\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsetFromMatrixColumn(m, index) {\r\n\r\n\t\t\treturn this.fromArray(m.elements, index * 4);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Extracts the position from a matrix.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A 4x4 matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsetFromMatrixPosition(m) {\r\n\r\n\t\t\tconst me = m.elements;\r\n\r\n\t\t\tthis.x = me[12];\r\n\t\t\tthis.y = me[13];\r\n\t\t\tthis.z = me[14];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Extracts the scale from a matrix.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A 4x4 matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsetFromMatrixScale(m) {\r\n\r\n\t\t\tconst sx = this.setFromMatrixColumn(m, 0).length();\r\n\t\t\tconst sy = this.setFromMatrixColumn(m, 1).length();\r\n\t\t\tconst sz = this.setFromMatrixColumn(m, 2).length();\r\n\r\n\t\t\tthis.x = sx;\r\n\t\t\tthis.y = sy;\r\n\t\t\tthis.z = sz;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a vector to this one.\r\n\t\t *\r\n\t\t * @param {Vector3} v - The vector to add.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tadd(v) {\r\n\r\n\t\t\tthis.x += v.x;\r\n\t\t\tthis.y += v.y;\r\n\t\t\tthis.z += v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scalar to this vector.\r\n\t\t *\r\n\t\t * @param {Number} s - The scalar to add.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddScalar(s) {\r\n\r\n\t\t\tthis.x += s;\r\n\t\t\tthis.y += s;\r\n\t\t\tthis.z += s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the sum of two given vectors.\r\n\t\t *\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x + b.x;\r\n\t\t\tthis.y = a.y + b.y;\r\n\t\t\tthis.z = a.z + b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scaled vector to this one.\r\n\t\t *\r\n\t\t * @param {Vector3} v - The vector to scale and add.\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddScaledVector(v, s) {\r\n\r\n\t\t\tthis.x += v.x * s;\r\n\t\t\tthis.y += v.y * s;\r\n\t\t\tthis.z += v.z * s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a vector from this vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - The vector to subtract.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsub(v) {\r\n\r\n\t\t\tthis.x -= v.x;\r\n\t\t\tthis.y -= v.y;\r\n\t\t\tthis.z -= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a scalar from this vector.\r\n\t\t *\r\n\t\t * @param {Number} s - The scalar to subtract.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsubScalar(s) {\r\n\r\n\t\t\tthis.x -= s;\r\n\t\t\tthis.y -= s;\r\n\t\t\tthis.z -= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the difference between two given vectors.\r\n\t\t *\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - A second vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsubVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x - b.x;\r\n\t\t\tthis.y = a.y - b.y;\r\n\t\t\tthis.z = a.z - b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with another vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiply(v) {\r\n\r\n\t\t\tthis.x *= v.x;\r\n\t\t\tthis.y *= v.y;\r\n\t\t\tthis.z *= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with a given scalar.\r\n\t\t *\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyScalar(s) {\r\n\r\n\t\t\tthis.x *= s;\r\n\t\t\tthis.y *= s;\r\n\t\t\tthis.z *= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the product of two given vectors.\r\n\t\t *\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x * b.x;\r\n\t\t\tthis.y = a.y * b.y;\r\n\t\t\tthis.z = a.z * b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by another vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tdivide(v) {\r\n\r\n\t\t\tthis.x /= v.x;\r\n\t\t\tthis.y /= v.y;\r\n\t\t\tthis.z /= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by a given scalar.\r\n\t\t *\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tdivideScalar(s) {\r\n\r\n\t\t\tthis.x /= s;\r\n\t\t\tthis.y /= s;\r\n\t\t\tthis.z /= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the cross product of the given vectors.\r\n\t\t *\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tcrossVectors(a, b) {\r\n\r\n\t\t\tconst ax = a.x, ay = a.y, az = a.z;\r\n\t\t\tconst bx = b.x, by = b.y, bz = b.z;\r\n\r\n\t\t\tthis.x = ay * bz - az * by;\r\n\t\t\tthis.y = az * bx - ax * bz;\r\n\t\t\tthis.z = ax * by - ay * bx;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the cross product of this vector and the given one.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tcross(v) {\r\n\r\n\t\t\treturn this.crossVectors(this, v);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a matrix to this direction vector.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\ttransformDirection(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z;\r\n\t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z;\r\n\t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z;\r\n\r\n\t\t\treturn this.normalize();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a matrix to this vector.\r\n\t\t *\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tapplyMatrix3(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[3] * y + e[6] * z;\r\n\t\t\tthis.y = e[1] * x + e[4] * y + e[7] * z;\r\n\t\t\tthis.z = e[2] * x + e[5] * y + e[8] * z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a matrix to this vector.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tapplyMatrix4(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z + e[12];\r\n\t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z + e[13];\r\n\t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z + e[14];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a quaternion to this vector.\r\n\t\t *\r\n\t\t * @param {Quaternion} q - A quaternion.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tapplyQuaternion(q) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z;\r\n\t\t\tconst qx = q.x, qy = q.y, qz = q.z, qw = q.w;\r\n\r\n\t\t\t// Calculate: quaternion * vector.\r\n\t\t\tconst ix = qw * x + qy * z - qz * y;\r\n\t\t\tconst iy = qw * y + qz * x - qx * z;\r\n\t\t\tconst iz = qw * z + qx * y - qy * x;\r\n\t\t\tconst iw = -qx * x - qy * y - qz * z;\r\n\r\n\t\t\t// Calculate: result * inverse quaternion.\r\n\t\t\tthis.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;\r\n\t\t\tthis.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;\r\n\t\t\tthis.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Negates this vector.\r\n\t\t *\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tnegate() {\r\n\r\n\t\t\tthis.x = -this.x;\r\n\t\t\tthis.y = -this.y;\r\n\t\t\tthis.z = -this.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the dot product with another vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The dot product.\r\n\t\t */\r\n\r\n\t\tdot(v) {\r\n\r\n\t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Reflects this vector. The given plane normal is assumed to be normalized.\r\n\t\t *\r\n\t\t * @param {Vector3} n - A normal.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\treflect(n, target = new Vector3()) {\r\n\r\n\t\t\tconst nx = n.x;\r\n\t\t\tconst ny = n.y;\r\n\t\t\tconst nz = n.z;\r\n\r\n\t\t\tthis.sub(n.multiplyScalar(2 * this.dot(n)));\r\n\r\n\t\t\t// Restore the normal.\r\n\t\t\tn.set(nx, ny, nz);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the angle to the given vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The angle in radians.\r\n\t\t */\r\n\r\n\t\tangleTo(v) {\r\n\r\n\t\t\tconst theta = this.dot(v) / (Math.sqrt(this.lengthSquared() * v.lengthSquared()));\r\n\r\n\t\t\t// Clamp to avoid numerical problems.\r\n\t\t\treturn Math.acos(Math.min(Math.max(theta, -1), 1));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Manhattan length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tmanhattanLength() {\r\n\r\n\t\t\treturn Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The squared length.\r\n\t\t */\r\n\r\n\t\tlengthSquared() {\r\n\r\n\t\t\treturn this.x * this.x + this.y * this.y + this.z * this.z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tlength() {\r\n\r\n\t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Manhattan distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tmanhattanDistanceTo(v) {\r\n\r\n\t\t\treturn Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The squared distance.\r\n\t\t */\r\n\r\n\t\tdistanceToSquared(v) {\r\n\r\n\t\t\tconst dx = this.x - v.x;\r\n\t\t\tconst dy = this.y - v.y;\r\n\t\t\tconst dz = this.z - v.z;\r\n\r\n\t\t\treturn dx * dx + dy * dy + dz * dz;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tdistanceTo(v) {\r\n\r\n\t\t\treturn Math.sqrt(this.distanceToSquared(v));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Normalizes this vector.\r\n\t\t *\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tnormalize() {\r\n\r\n\t\t\treturn this.divideScalar(this.length());\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the length of this vector.\r\n\t\t *\r\n\t\t * @param {Number} length - The new length.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsetLength(length) {\r\n\r\n\t\t\treturn this.normalize().multiplyScalar(length);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the min value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmin(v) {\r\n\r\n\t\t\tthis.x = Math.min(this.x, v.x);\r\n\t\t\tthis.y = Math.min(this.y, v.y);\r\n\t\t\tthis.z = Math.min(this.z, v.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the max value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmax(v) {\r\n\r\n\t\t\tthis.x = Math.max(this.x, v.x);\r\n\t\t\tthis.y = Math.max(this.y, v.y);\r\n\t\t\tthis.z = Math.max(this.z, v.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clamps this vector.\r\n\t\t *\r\n\t\t * @param {Vector3} min - The lower bounds. Assumed to be smaller than max.\r\n\t\t * @param {Vector3} max - The upper bounds. Assumed to be greater than min.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tclamp(min, max) {\r\n\r\n\t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\r\n\t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\r\n\t\t\tthis.z = Math.max(min.z, Math.min(max.z, this.z));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Floors this vector.\r\n\t\t *\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tfloor() {\r\n\r\n\t\t\tthis.x = Math.floor(this.x);\r\n\t\t\tthis.y = Math.floor(this.y);\r\n\t\t\tthis.z = Math.floor(this.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Ceils this vector.\r\n\t\t *\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tceil() {\r\n\r\n\t\t\tthis.x = Math.ceil(this.x);\r\n\t\t\tthis.y = Math.ceil(this.y);\r\n\t\t\tthis.z = Math.ceil(this.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rounds this vector.\r\n\t\t *\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tround() {\r\n\r\n\t\t\tthis.x = Math.round(this.x);\r\n\t\t\tthis.y = Math.round(this.y);\r\n\t\t\tthis.z = Math.round(this.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Lerps towards the given vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - The target vector.\r\n\t\t * @param {Number} alpha - The lerp factor.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tlerp(v, alpha) {\r\n\r\n\t\t\tthis.x += (v.x - this.x) * alpha;\r\n\t\t\tthis.y += (v.y - this.y) * alpha;\r\n\t\t\tthis.z += (v.z - this.z) * alpha;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the lerp result of the given vectors.\r\n\t\t *\r\n\t\t * @param {Vector3} v1 - A base vector.\r\n\t\t * @param {Vector3} v2 - The target vector.\r\n\t\t * @param {Number} alpha - The lerp factor.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tlerpVectors(v1, v2, alpha) {\r\n\r\n\t\t\treturn this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this vector equals the given one.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Boolean} Whether this vector equals the given one.\r\n\t\t */\r\n\r\n\t\tequals(v) {\r\n\r\n\t\t\treturn (v.x === this.x && v.y === this.y && v.z === this.z);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst v = new Vector3();\r\n\r\n\t/**\r\n\t * A list of points.\r\n\t *\r\n\t * @type {Vector3[]}\r\n\t * @private\r\n\t */\r\n\r\n\tconst points = [\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3()\r\n\t];\r\n\r\n\t/**\r\n\t * A 3D box.\r\n\t */\r\n\r\n\tclass Box3 {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new box.\r\n\t\t *\r\n\t\t * @param {Vector3} [min] - The lower bounds.\r\n\t\t * @param {Vector3} [max] - The upper bounds.\r\n\t\t */\r\n\r\n\t\tconstructor(\r\n\t\t\tmin = new Vector3(Infinity, Infinity, Infinity),\r\n\t\t\tmax = new Vector3(-Infinity, -Infinity, -Infinity)\r\n\t\t) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The lower bounds.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = min;\r\n\r\n\t\t\t/**\r\n\t\t\t * The upper bounds.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.max = max;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this box.\r\n\t\t *\r\n\t\t * @param {Vector3} min - The lower bounds.\r\n\t\t * @param {Vector3} max - The upper bounds.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tset(min, max) {\r\n\r\n\t\t\tthis.min.copy(min);\r\n\t\t\tthis.max.copy(max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given box.\r\n\t\t *\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tcopy(b) {\r\n\r\n\t\t\tthis.min.copy(b.min);\r\n\t\t\tthis.max.copy(b.max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this box.\r\n\t\t *\r\n\t\t * @return {Box3} A clone of this box.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Makes this box empty.\r\n\t\t *\r\n\t\t * The lower bounds are set to infinity and the upper bounds to negative\r\n\t\t * infinity to create an infinitely small box.\r\n\t\t *\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tmakeEmpty() {\r\n\r\n\t\t\tthis.min.x = this.min.y = this.min.z = Infinity;\r\n\t\t\tthis.max.x = this.max.y = this.max.z = -Infinity;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Indicates whether this box is truly empty.\r\n\t\t *\r\n\t\t * This is a more robust check for emptiness since the volume can get positive\r\n\t\t * with two negative axes.\r\n\t\t *\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tisEmpty() {\r\n\r\n\t\t\treturn (\r\n\t\t\t\tthis.max.x < this.min.x ||\r\n\t\t\t\tthis.max.y < this.min.y ||\r\n\t\t\t\tthis.max.z < this.min.z\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the center of this box.\r\n\t\t *\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} A vector that describes the center of this box.\r\n\t\t */\r\n\r\n\t\tgetCenter(target = new Vector3()) {\r\n\r\n\t\t\treturn !this.isEmpty() ?\r\n\t\t\t\ttarget.addVectors(this.min, this.max).multiplyScalar(0.5) :\r\n\t\t\t\ttarget.set(0, 0, 0);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the size of this box.\r\n\t\t *\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} A vector that describes the size of this box.\r\n\t\t */\r\n\r\n\t\tgetSize(target = new Vector3()) {\r\n\r\n\t\t\treturn !this.isEmpty() ?\r\n\t\t\t\ttarget.subVectors(this.max, this.min) :\r\n\t\t\t\ttarget.set(0, 0, 0);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the bounding sphere of this box.\r\n\t\t *\r\n\t\t * @param {Sphere} [target] - A target sphere. If none is provided, a new one will be created.\r\n\t\t * @return {Sphere} The bounding sphere of this box.\r\n\t\t */\r\n\r\n\t\tgetBoundingSphere(target = new Sphere()) {\r\n\r\n\t\t\tthis.getCenter(target.center);\r\n\r\n\t\t\ttarget.radius = this.getSize(v).length() * 0.5;\r\n\r\n\t\t\treturn target;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Expands this box by the given point.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\texpandByPoint(p) {\r\n\r\n\t\t\tthis.min.min(p);\r\n\t\t\tthis.max.max(p);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Expands this box by the given vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\texpandByVector(v) {\r\n\r\n\t\t\tthis.min.sub(v);\r\n\t\t\tthis.max.add(v);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Expands this box by the given scalar.\r\n\t\t *\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\texpandByScalar(s) {\r\n\r\n\t\t\tthis.min.addScalar(-s);\r\n\t\t\tthis.max.addScalar(s);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Defines this box by the given points.\r\n\t\t *\r\n\t\t * @param {Vector3[]} points - The points.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tsetFromPoints(points) {\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tthis.min.set(0, 0, 0);\r\n\t\t\tthis.max.set(0, 0, 0);\r\n\r\n\t\t\tfor(i = 0, l = points.length; i < l; ++i) {\r\n\r\n\t\t\t\tthis.expandByPoint(points[i]);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Defines this box by the given center and size.\r\n\t\t *\r\n\t\t * @param {Vector3} center - The center.\r\n\t\t * @param {Number} size - The size.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tsetFromCenterAndSize(center, size) {\r\n\r\n\t\t\tconst halfSize = v.copy(size).multiplyScalar(0.5);\r\n\r\n\t\t\tthis.min.copy(center).sub(halfSize);\r\n\t\t\tthis.max.copy(center).add(halfSize);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clamps the given point to the boundaries of this box.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} The clamped point.\r\n\t\t */\r\n\r\n\t\tclampPoint(point, target = new Vector3()) {\r\n\r\n\t\t\treturn target.copy(point).clamp(this.min, this.max);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance from this box to the given point.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tdistanceToPoint(p) {\r\n\r\n\t\t\tconst clampedPoint = v.copy(p).clamp(this.min, this.max);\r\n\r\n\t\t\treturn clampedPoint.sub(p).length();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies the given matrix to this box.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - The matrix.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tapplyMatrix4(m) {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst max = this.max;\r\n\r\n\t\t\tif(!this.isEmpty()) {\r\n\r\n\t\t\t\tpoints[0].set(min.x, min.y, min.z).applyMatrix4(m);\r\n\t\t\t\tpoints[1].set(min.x, min.y, max.z).applyMatrix4(m);\r\n\t\t\t\tpoints[2].set(min.x, max.y, min.z).applyMatrix4(m);\r\n\t\t\t\tpoints[3].set(min.x, max.y, max.z).applyMatrix4(m);\r\n\t\t\t\tpoints[4].set(max.x, min.y, min.z).applyMatrix4(m);\r\n\t\t\t\tpoints[5].set(max.x, min.y, max.z).applyMatrix4(m);\r\n\t\t\t\tpoints[6].set(max.x, max.y, min.z).applyMatrix4(m);\r\n\t\t\t\tpoints[7].set(max.x, max.y, max.z).applyMatrix4(m);\r\n\r\n\t\t\t\tthis.setFromPoints(points);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Translates this box.\r\n\t\t *\r\n\t\t * @param {Vector3} offset - The offset.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\ttranslate(offset) {\r\n\r\n\t\t\tthis.min.add(offset);\r\n\t\t\tthis.max.add(offset);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Intersects this box with the given one.\r\n\t\t *\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tintersect(b) {\r\n\r\n\t\t\tthis.min.max(b.min);\r\n\t\t\tthis.max.min(b.max);\r\n\r\n\t\t\t/* Ensure that if there is no overlap, the result is fully empty to prevent\r\n\t\t\tsubsequent intersections to erroneously return valid values. */\r\n\t\t\tif(this.isEmpty()) {\r\n\r\n\t\t\t\tthis.makeEmpty();\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Expands this box by combining it with the given one.\r\n\t\t *\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tunion(b) {\r\n\r\n\t\t\tthis.min.min(b.min);\r\n\t\t\tthis.max.max(b.max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the given point lies inside this box.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Boolean} Whether this box contains the point.\r\n\t\t */\r\n\r\n\t\tcontainsPoint(p) {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst max = this.max;\r\n\r\n\t\t\treturn (\r\n\t\t\t\tp.x >= min.x &&\r\n\t\t\t\tp.y >= min.y &&\r\n\t\t\t\tp.z >= min.z &&\r\n\t\t\t\tp.x <= max.x &&\r\n\t\t\t\tp.y <= max.y &&\r\n\t\t\t\tp.z <= max.z\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the given box lies inside this box.\r\n\t\t *\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Boolean} Whether this box contains the given one.\r\n\t\t */\r\n\r\n\t\tcontainsBox(b) {\r\n\r\n\t\t\tconst tMin = this.min;\r\n\t\t\tconst tMax = this.max;\r\n\t\t\tconst bMin = b.min;\r\n\t\t\tconst bMax = b.max;\r\n\r\n\t\t\treturn (\r\n\t\t\t\ttMin.x <= bMin.x && bMax.x <= tMax.x &&\r\n\t\t\t\ttMin.y <= bMin.y && bMax.y <= tMax.y &&\r\n\t\t\t\ttMin.z <= bMin.z && bMax.z <= tMax.z\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this box intersects the given one.\r\n\t\t *\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Boolean} Whether the boxes intersect.\r\n\t\t */\r\n\r\n\t\tintersectsBox(b) {\r\n\r\n\t\t\tconst tMin = this.min;\r\n\t\t\tconst tMax = this.max;\r\n\t\t\tconst bMin = b.min;\r\n\t\t\tconst bMax = b.max;\r\n\r\n\t\t\treturn (\r\n\t\t\t\tbMax.x >= tMin.x &&\r\n\t\t\t\tbMax.y >= tMin.y &&\r\n\t\t\t\tbMax.z >= tMin.z &&\r\n\t\t\t\tbMin.x <= tMax.x &&\r\n\t\t\t\tbMin.y <= tMax.y &&\r\n\t\t\t\tbMin.z <= tMax.z\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this box intersects the given sphere.\r\n\t\t *\r\n\t\t * @param {Sphere} s - A sphere.\r\n\t\t * @return {Boolean} Whether the box intersects the sphere.\r\n\t\t */\r\n\r\n\t\tintersectsSphere(s) {\r\n\r\n\t\t\t// Find the point in this box that is closest to the sphere's center.\r\n\t\t\tconst closestPoint = this.clampPoint(s.center, v);\r\n\r\n\t\t\t// If that point is inside the sphere, it intersects this box.\r\n\t\t\treturn (closestPoint.distanceToSquared(s.center) <= (s.radius * s.radius));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this box intersects the given plane.\r\n\t\t *\r\n\t\t * Computes the minimum and maximum dot product values. If those values are on\r\n\t\t * the same side (back or front) of the plane, then there is no intersection.\r\n\t\t *\r\n\t\t * @param {Plane} p - A plane.\r\n\t\t * @return {Boolean} Whether the box intersects the plane.\r\n\t\t */\r\n\r\n\t\tintersectsPlane(p) {\r\n\r\n\t\t\tlet min, max;\r\n\r\n\t\t\tif(p.normal.x > 0) {\r\n\r\n\t\t\t\tmin = p.normal.x * this.min.x;\r\n\t\t\t\tmax = p.normal.x * this.max.x;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tmin = p.normal.x * this.max.x;\r\n\t\t\t\tmax = p.normal.x * this.min.x;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(p.normal.y > 0) {\r\n\r\n\t\t\t\tmin += p.normal.y * this.min.y;\r\n\t\t\t\tmax += p.normal.y * this.max.y;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tmin += p.normal.y * this.max.y;\r\n\t\t\t\tmax += p.normal.y * this.min.y;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(p.normal.z > 0) {\r\n\r\n\t\t\t\tmin += p.normal.z * this.min.z;\r\n\t\t\t\tmax += p.normal.z * this.max.z;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tmin += p.normal.z * this.max.z;\r\n\t\t\t\tmax += p.normal.z * this.min.z;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn (min <= p.constant && max >= p.constant);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this box equals the given one.\r\n\t\t *\r\n\t\t * @param {Box3} v - A box.\r\n\t\t * @return {Boolean} Whether this box equals the given one.\r\n\t\t */\r\n\r\n\t\tequals(b) {\r\n\r\n\t\t\treturn (b.min.equals(this.min) && b.max.equals(this.max));\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A box.\r\n\t *\r\n\t * @type {Box3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst box = new Box3();\r\n\r\n\t/**\r\n\t * A sphere.\r\n\t */\r\n\r\n\tclass Sphere {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new sphere.\r\n\t\t *\r\n\t\t * @param {Vector3} [center] - The center.\r\n\t\t * @param {Number} [radius] - The radius.\r\n\t\t */\r\n\r\n\t\tconstructor(center = new Vector3(), radius = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The center.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.center = center;\r\n\r\n\t\t\t/**\r\n\t\t\t * The radius.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.radius = radius;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the center and the radius.\r\n\t\t *\r\n\t\t * @param {Vector3} center - The center.\r\n\t\t * @param {Number} radius - The radius.\r\n\t\t * @return {Sphere} This sphere.\r\n\t\t */\r\n\r\n\t\tset(center, radius) {\r\n\r\n\t\t\tthis.center.copy(center);\r\n\t\t\tthis.radius = radius;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the given sphere.\r\n\t\t *\r\n\t\t * @param {Sphere} s - A sphere.\r\n\t\t * @return {Sphere} This sphere.\r\n\t\t */\r\n\r\n\t\tcopy(s) {\r\n\r\n\t\t\tthis.center.copy(s.center);\r\n\t\t\tthis.radius = s.radius;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this sphere.\r\n\t\t *\r\n\t\t * @return {Sphere} The cloned sphere.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this sphere from points.\r\n\t\t *\r\n\t\t * @param {Vector3[]} points - The points.\r\n\t\t * @param {Vector3} [center] - An optional center.\r\n\t\t * @return {Sphere} This sphere.\r\n\t\t */\r\n\r\n\t\tsetFromPoints(points, center = box.setFromPoints(points).getCenter(this.center)) {\r\n\r\n\t\t\tlet maxRadiusSq = 0;\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = points.length; i < l; ++i) {\r\n\r\n\t\t\t\tmaxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.radius = Math.sqrt(maxRadiusSq);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this sphere.\r\n\t\t *\r\n\t\t * @param {Box3} [target] - A target sphere. If none is provided, a new one will be created.\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tgetBoundingBox(target = new Box3()) {\r\n\r\n\t\t\ttarget.set(this.center, this.center);\r\n\t\t\ttarget.expandByScalar(this.radius);\r\n\r\n\t\t\treturn target;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this sphere is empty.\r\n\t\t *\r\n\t\t * @return {Boolean} Whether this sphere is empty.\r\n\t\t */\r\n\r\n\t\tisEmpty() {\r\n\r\n\t\t\treturn (this.radius <= 0);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Translates this sphere.\r\n\t\t *\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Sphere} This sphere.\r\n\t\t */\r\n\r\n\t\ttranslate(offset) {\r\n\r\n\t\t\tthis.center.add(offset);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clamps the given point to this sphere.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} The clamped point.\r\n\t\t */\r\n\r\n\t\tclampPoint(p, target = new Vector3()) {\r\n\r\n\t\t\tconst deltaLengthSq = this.center.distanceToSquared(p);\r\n\r\n\t\t\ttarget.copy(p);\r\n\r\n\t\t\tif(deltaLengthSq > (this.radius * this.radius)) {\r\n\r\n\t\t\t\ttarget.sub(this.center).normalize();\r\n\t\t\t\ttarget.multiplyScalar(this.radius).add(this.center);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn target;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance from this sphere to the given point.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tdistanceToPoint(p) {\r\n\r\n\t\t\treturn (p.distanceTo(this.center) - this.radius);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the given point lies inside this sphere.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Boolean} Whether this sphere contains the point.\r\n\t\t */\r\n\r\n\t\tcontainsPoint(p) {\r\n\r\n\t\t\treturn (p.distanceToSquared(this.center) <= (this.radius * this.radius));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the this sphere intersects with the given one.\r\n\t\t *\r\n\t\t * @param {Sphere} s - A sphere.\r\n\t\t * @return {Boolean} Whether this sphere intersects with the given one.\r\n\t\t */\r\n\r\n\t\tintersectsSphere(s) {\r\n\r\n\t\t\tconst radiusSum = this.radius + s.radius;\r\n\r\n\t\t\treturn s.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the this sphere intersects with the given box.\r\n\t\t *\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Boolean} Whether this sphere intersects with the given box.\r\n\t\t */\r\n\r\n\t\tintersectsBox(b) {\r\n\r\n\t\t\treturn b.intersectsSphere(this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the this sphere intersects with the given plane.\r\n\t\t *\r\n\t\t * @param {Plane} p - A plane.\r\n\t\t * @return {Boolean} Whether this sphere intersects with the given plane.\r\n\t\t */\r\n\r\n\t\tintersectsPlane(p) {\r\n\r\n\t\t\treturn (Math.abs(p.distanceToPoint(this.center)) <= this.radius);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this sphere equals the given one.\r\n\t\t *\r\n\t\t * @param {Sphere} s - A sphere.\r\n\t\t * @return {Boolean} Whether the spheres are equal.\r\n\t\t */\r\n\r\n\t\tequals(s) {\r\n\r\n\t\t\treturn (s.center.equals(this.center) && (s.radius === this.radius));\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A vector with two components.\r\n\t */\r\n\r\n\tclass Vector2 {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new vector.\r\n\t\t *\r\n\t\t * @param {Number} [x=0] - The X component.\r\n\t\t * @param {Number} [y=0] - The Y component.\r\n\t\t */\r\n\r\n\t\tconstructor(x = 0, y = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The X component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.x = x;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Y component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.y = y;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The width. This is an alias for X.\r\n\t\t *\r\n\t\t * @type {Number}\r\n\t\t */\r\n\r\n\t\tget width() {\r\n\r\n\t\t\treturn this.x;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the width.\r\n\t\t *\r\n\t\t * @type {Number}\r\n\t\t */\r\n\r\n\t\tset width(value) {\r\n\r\n\t\t\treturn this.x = value;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The height. This is an alias for Y.\r\n\t\t *\r\n\t\t * @type {Number}\r\n\t\t */\r\n\r\n\t\tget height() {\r\n\r\n\t\t\treturn this.y;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the height.\r\n\t\t *\r\n\t\t * @type {Number}\r\n\t\t */\r\n\r\n\t\tset height(value) {\r\n\r\n\t\t\treturn this.y = value;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this vector\r\n\t\t *\r\n\t\t * @param {Number} x - The X component.\r\n\t\t * @param {Number} y - The Y component.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tset(x, y) {\r\n\r\n\t\t\tthis.x = x;\r\n\t\t\tthis.y = y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of another vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tcopy(v) {\r\n\r\n\t\t\tthis.x = v.x;\r\n\t\t\tthis.y = v.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this vector.\r\n\t\t *\r\n\t\t * @return {Vector2} A clone of this vector.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor(this.x, this.y);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from an array.\r\n\t\t *\r\n\t\t * @param {Number[]} array - An array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tfromArray(array, offset = 0) {\r\n\r\n\t\t\tthis.x = array[offset];\r\n\t\t\tthis.y = array[offset + 1];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores this vector in an array.\r\n\t\t *\r\n\t\t * @param {Array} [array] - A target array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Number[]} The array.\r\n\t\t */\r\n\r\n\t\ttoArray(array = [], offset = 0) {\r\n\r\n\t\t\tarray[offset] = this.x;\r\n\t\t\tarray[offset + 1] = this.y;\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a vector to this one.\r\n\t\t *\r\n\t\t * @param {Vector2} v - The vector to add.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tadd(v) {\r\n\r\n\t\t\tthis.x += v.x;\r\n\t\t\tthis.y += v.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scalar to this vector.\r\n\t\t *\r\n\t\t * @param {Number} s - The scalar to add.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\taddScalar(s) {\r\n\r\n\t\t\tthis.x += s;\r\n\t\t\tthis.y += s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the sum of two given vectors.\r\n\t\t *\r\n\t\t * @param {Vector2} a - A vector.\r\n\t\t * @param {Vector2} b - Another vector.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\taddVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x + b.x;\r\n\t\t\tthis.y = a.y + b.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scaled vector to this one.\r\n\t\t *\r\n\t\t * @param {Vector2} v - The vector to scale and add.\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\taddScaledVector(v, s) {\r\n\r\n\t\t\tthis.x += v.x * s;\r\n\t\t\tthis.y += v.y * s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a vector from this vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - The vector to subtract.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tsub(v) {\r\n\r\n\t\t\tthis.x -= v.x;\r\n\t\t\tthis.y -= v.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a scalar from this vector.\r\n\t\t *\r\n\t\t * @param {Number} s - The scalar to subtract.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tsubScalar(s) {\r\n\r\n\t\t\tthis.x -= s;\r\n\t\t\tthis.y -= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the difference between two given vectors.\r\n\t\t *\r\n\t\t * @param {Vector2} a - A vector.\r\n\t\t * @param {Vector2} b - A second vector.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tsubVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x - b.x;\r\n\t\t\tthis.y = a.y - b.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with another vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tmultiply(v) {\r\n\r\n\t\t\tthis.x *= v.x;\r\n\t\t\tthis.y *= v.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with a given scalar.\r\n\t\t *\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyScalar(s) {\r\n\r\n\t\t\tthis.x *= s;\r\n\t\t\tthis.y *= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by another vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tdivide(v) {\r\n\r\n\t\t\tthis.x /= v.x;\r\n\t\t\tthis.y /= v.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by a given scalar.\r\n\t\t *\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tdivideScalar(s) {\r\n\r\n\t\t\tthis.x /= s;\r\n\t\t\tthis.y /= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies the given matrix to this vector.\r\n\t\t *\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tapplyMatrix3(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[3] * y + e[6];\r\n\t\t\tthis.y = e[1] * x + e[4] * y + e[7];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the dot product with another vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Number} The dot product.\r\n\t\t */\r\n\r\n\t\tdot(v) {\r\n\r\n\t\t\treturn this.x * v.x + this.y * v.y;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Manhattan length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tmanhattanLength() {\r\n\r\n\t\t\treturn Math.abs(this.x) + Math.abs(this.y);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The squared length.\r\n\t\t */\r\n\r\n\t\tlengthSquared() {\r\n\r\n\t\t\treturn this.x * this.x + this.y * this.y;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tlength() {\r\n\r\n\t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Manhattan distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Number} The squared distance.\r\n\t\t */\r\n\r\n\t\tmanhattanDistanceTo(v) {\r\n\r\n\t\t\treturn Math.abs(this.x - v.x) + Math.abs(this.y - v.y);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Number} The squared distance.\r\n\t\t */\r\n\r\n\t\tdistanceToSquared(v) {\r\n\r\n\t\t\tconst dx = this.x - v.x;\r\n\t\t\tconst dy = this.y - v.y;\r\n\r\n\t\t\treturn dx * dx + dy * dy;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tdistanceTo(v) {\r\n\r\n\t\t\treturn Math.sqrt(this.distanceToSquared(v));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Normalizes this vector.\r\n\t\t *\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tnormalize() {\r\n\r\n\t\t\treturn this.divideScalar(this.length());\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the length of this vector.\r\n\t\t *\r\n\t\t * @param {Number} length - The new length.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tsetLength(length) {\r\n\r\n\t\t\treturn this.normalize().multiplyScalar(length);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the min value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tmin(v) {\r\n\r\n\t\t\tthis.x = Math.min(this.x, v.x);\r\n\t\t\tthis.y = Math.min(this.y, v.y);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * adopts the max value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tmax(v) {\r\n\r\n\t\t\tthis.x = Math.max(this.x, v.x);\r\n\t\t\tthis.y = Math.max(this.y, v.y);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clamps this vector.\r\n\t\t *\r\n\t\t * @param {Vector2} min - A vector, assumed to be smaller than max.\r\n\t\t * @param {Vector2} max - A vector, assumed to be greater than min.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tclamp(min, max) {\r\n\r\n\t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\r\n\t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Floors this vector.\r\n\t\t *\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tfloor() {\r\n\r\n\t\t\tthis.x = Math.floor(this.x);\r\n\t\t\tthis.y = Math.floor(this.y);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Ceils this vector.\r\n\t\t *\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tceil() {\r\n\r\n\t\t\tthis.x = Math.ceil(this.x);\r\n\t\t\tthis.y = Math.ceil(this.y);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rounds this vector.\r\n\t\t *\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tround() {\r\n\r\n\t\t\tthis.x = Math.round(this.x);\r\n\t\t\tthis.y = Math.round(this.y);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Negates this vector.\r\n\t\t *\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tnegate() {\r\n\r\n\t\t\tthis.x = -this.x;\r\n\t\t\tthis.y = -this.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the angle in radians with respect to the positive X-axis.\r\n\t\t *\r\n\t\t * @return {Number} The angle.\r\n\t\t */\r\n\r\n\t\tangle() {\r\n\r\n\t\t\tlet angle = Math.atan2(this.y, this.x);\r\n\r\n\t\t\tif(angle < 0) {\r\n\r\n\t\t\t\tangle += 2 * Math.PI;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn angle;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Lerps towards the given vector.\r\n\t\t *\r\n\t\t * @param {Vector2} v - The target vector.\r\n\t\t * @param {Number} alpha - The lerp factor.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tlerp(v, alpha) {\r\n\r\n\t\t\tthis.x += (v.x - this.x) * alpha;\r\n\t\t\tthis.y += (v.y - this.y) * alpha;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the lerp result of the given vectors.\r\n\t\t *\r\n\t\t * @param {Vector2} v1 - A base vector.\r\n\t\t * @param {Vector2} v2 - The target vector.\r\n\t\t * @param {Number} alpha - The lerp factor.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\tlerpVectors(v1, v2, alpha) {\r\n\r\n\t\t\treturn this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rotates this vector around a given center.\r\n\t\t *\r\n\t\t * @param {Vector2} center - The center.\r\n\t\t * @param {Number} angle - The rotation in radians.\r\n\t\t * @return {Vector2} This vector.\r\n\t\t */\r\n\r\n\t\trotateAround(center, angle) {\r\n\r\n\t\t\tconst c = Math.cos(angle), s = Math.sin(angle);\r\n\r\n\t\t\tconst x = this.x - center.x;\r\n\t\t\tconst y = this.y - center.y;\r\n\r\n\t\t\tthis.x = x * c - y * s + center.x;\r\n\t\t\tthis.y = x * s + y * c + center.y;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this vector equals the given one.\r\n\t\t *\r\n\t\t * @param {Vector2} v - A vector.\r\n\t\t * @return {Boolean} Whether this vector equals the given one.\r\n\t\t */\r\n\r\n\t\tequals(v) {\r\n\r\n\t\t\treturn (v.x === this.x && v.y === this.y);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A 2D box.\r\n\t */\n\n\t/**\r\n\t * A cylindrical coordinate system.\r\n\t *\r\n\t * For details see: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system\r\n\t */\n\n\t/**\r\n\t * A 3x3 matrix.\r\n\t */\r\n\r\n\tclass Matrix3 {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new matrix.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * The matrix elements.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.elements = new Float32Array([\r\n\r\n\t\t\t\t1, 0, 0,\r\n\t\t\t\t0, 1, 0,\r\n\t\t\t\t0, 0, 1\r\n\r\n\t\t\t]);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this matrix.\r\n\t\t *\r\n\t\t * @param {Number} m00 - The value of the first row, first column.\r\n\t\t * @param {Number} m01 - The value of the first row, second column.\r\n\t\t * @param {Number} m02 - The value of the first row, third column.\r\n\t\t * @param {Number} m10 - The value of the second row, first column.\r\n\t\t * @param {Number} m11 - The value of the second row, second column.\r\n\t\t * @param {Number} m12 - The value of the second row, third column.\r\n\t\t * @param {Number} m20 - The value of the third row, first column.\r\n\t\t * @param {Number} m21 - The value of the third row, second column.\r\n\t\t * @param {Number} m22 - The value of the third row, third column.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tset(m00, m01, m02, m10, m11, m12, m20, m21, m22) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] = m00; te[3] = m01; te[6] = m02;\r\n\t\t\tte[1] = m10; te[4] = m11; te[7] = m12;\r\n\t\t\tte[2] = m20; te[5] = m21; te[8] = m22;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this matrix to the identity matrix.\r\n\t\t *\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tidentity() {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\t1, 0, 0,\r\n\t\t\t\t0, 1, 0,\r\n\t\t\t\t0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given matrix.\r\n\t\t *\r\n\t\t * @param {Matrix3} matrix - A matrix.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tcopy(matrix) {\r\n\r\n\t\t\tconst me = matrix.elements;\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] = me[0]; te[1] = me[1]; te[2] = me[2];\r\n\t\t\tte[3] = me[3]; te[4] = me[4]; te[5] = me[5];\r\n\t\t\tte[6] = me[6]; te[7] = me[7]; te[8] = me[8];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this matrix.\r\n\t\t *\r\n\t\t * @return {Matrix3} A clone of this matrix.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().fromArray(this.elements);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given array.\r\n\t\t *\r\n\t\t * @param {Number[]} array - An array.\r\n\t\t * @param {Number} [offset=0] - An offset into the array.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tfromArray(array, offset = 0) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tlet i;\r\n\r\n\t\t\tfor(i = 0; i < 9; ++i) {\r\n\r\n\t\t\t\tte[i] = array[i + offset];\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores this matrix in an array.\r\n\t\t *\r\n\t\t * @param {Number[]} [array] - A target array.\r\n\t\t * @param {Number} [offset=0] - An offset into the array.\r\n\t\t * @return {Number[]} The array.\r\n\t\t */\r\n\r\n\t\ttoArray(array = [], offset = 0) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tlet i;\r\n\r\n\t\t\tfor(i = 0; i < 9; ++i) {\r\n\r\n\t\t\t\tarray[i + offset] = te[i];\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this matrix to the product of the given matrices.\r\n\t\t *\r\n\t\t * @param {Matrix3} a - A matrix.\r\n\t\t * @param {Matrix3} b - A matrix.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tmultiplyMatrices(a, b) {\r\n\r\n\t\t\tconst ae = a.elements;\r\n\t\t\tconst be = b.elements;\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst a11 = ae[0], a12 = ae[3], a13 = ae[6];\r\n\t\t\tconst a21 = ae[1], a22 = ae[4], a23 = ae[7];\r\n\t\t\tconst a31 = ae[2], a32 = ae[5], a33 = ae[8];\r\n\r\n\t\t\tconst b11 = be[0], b12 = be[3], b13 = be[6];\r\n\t\t\tconst b21 = be[1], b22 = be[4], b23 = be[7];\r\n\t\t\tconst b31 = be[2], b32 = be[5], b33 = be[8];\r\n\r\n\t\t\tte[0] = a11 * b11 + a12 * b21 + a13 * b31;\r\n\t\t\tte[3] = a11 * b12 + a12 * b22 + a13 * b32;\r\n\t\t\tte[6] = a11 * b13 + a12 * b23 + a13 * b33;\r\n\r\n\t\t\tte[1] = a21 * b11 + a22 * b21 + a23 * b31;\r\n\t\t\tte[4] = a21 * b12 + a22 * b22 + a23 * b32;\r\n\t\t\tte[7] = a21 * b13 + a22 * b23 + a23 * b33;\r\n\r\n\t\t\tte[2] = a31 * b11 + a32 * b21 + a33 * b31;\r\n\t\t\tte[5] = a31 * b12 + a32 * b22 + a33 * b32;\r\n\t\t\tte[8] = a31 * b13 + a32 * b23 + a33 * b33;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this matrix with a given one.\r\n\t\t *\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tmultiply(m) {\r\n\r\n\t\t\treturn this.multiplyMatrices(this, m);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies a given matrix with this one.\r\n\t\t *\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tpremultiply(m) {\r\n\r\n\t\t\treturn this.multiplyMatrices(m, this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this matrix with a given scalar.\r\n\t\t *\r\n\t\t * @param {Number} m - A scalar.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tmultiplyScalar(s) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] *= s; te[3] *= s; te[6] *= s;\r\n\t\t\tte[1] *= s; te[4] *= s; te[7] *= s;\r\n\t\t\tte[2] *= s; te[5] *= s; te[8] *= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the determinant of this matrix.\r\n\t\t *\r\n\t\t * @return {Number} The determinant.\r\n\t\t */\r\n\r\n\t\tdeterminant() {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst a = te[0], b = te[1], c = te[2];\r\n\t\t\tconst d = te[3], e = te[4], f = te[5];\r\n\t\t\tconst g = te[6], h = te[7], i = te[8];\r\n\r\n\t\t\treturn (\r\n\r\n\t\t\t\ta * e * i -\r\n\t\t\t\ta * f * h -\r\n\t\t\t\tb * d * i +\r\n\t\t\t\tb * f * g +\r\n\t\t\t\tc * d * h -\r\n\t\t\t\tc * e * g\r\n\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Inverts the given matrix and stores the result in this matrix.\r\n\t\t *\r\n\t\t * @param {Matrix3} matrix - The matrix that should be inverted.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tgetInverse(matrix) {\r\n\r\n\t\t\tconst me = matrix.elements;\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst n11 = me[0], n21 = me[1], n31 = me[2];\r\n\t\t\tconst n12 = me[3], n22 = me[4], n32 = me[5];\r\n\t\t\tconst n13 = me[6], n23 = me[7], n33 = me[8];\r\n\r\n\t\t\tconst t11 = n33 * n22 - n32 * n23;\r\n\t\t\tconst t12 = n32 * n13 - n33 * n12;\r\n\t\t\tconst t13 = n23 * n12 - n22 * n13;\r\n\r\n\t\t\tconst det = n11 * t11 + n21 * t12 + n31 * t13;\r\n\r\n\t\t\tlet invDet;\r\n\r\n\t\t\tif(det !== 0) {\r\n\r\n\t\t\t\tinvDet = 1.0 / det;\r\n\r\n\t\t\t\tte[0] = t11 * invDet;\r\n\t\t\t\tte[1] = (n31 * n23 - n33 * n21) * invDet;\r\n\t\t\t\tte[2] = (n32 * n21 - n31 * n22) * invDet;\r\n\r\n\t\t\t\tte[3] = t12 * invDet;\r\n\t\t\t\tte[4] = (n33 * n11 - n31 * n13) * invDet;\r\n\t\t\t\tte[5] = (n31 * n12 - n32 * n11) * invDet;\r\n\r\n\t\t\t\tte[6] = t13 * invDet;\r\n\t\t\t\tte[7] = (n21 * n13 - n23 * n11) * invDet;\r\n\t\t\t\tte[8] = (n22 * n11 - n21 * n12) * invDet;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tconsole.error(\"Can't invert matrix, determinant is zero\", matrix);\r\n\r\n\t\t\t\tthis.identity();\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Transposes this matrix.\r\n\t\t *\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\ttranspose() {\r\n\r\n\t\t\tconst me = this.elements;\r\n\r\n\t\t\tlet t;\r\n\r\n\t\t\tt = me[1]; me[1] = me[3]; me[3] = t;\r\n\t\t\tt = me[2]; me[2] = me[6]; me[6] = t;\r\n\t\t\tt = me[5]; me[5] = me[7]; me[7] = t;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Scales this matrix.\r\n\t\t *\r\n\t\t * @param {Number} sx - The X scale.\r\n\t\t * @param {Number} sy - The Y scale.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tscale(sx, sy) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] *= sx; te[3] *= sx; te[6] *= sx;\r\n\t\t\tte[1] *= sy; te[4] *= sy; te[7] *= sy;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rotates this matrix.\r\n\t\t *\r\n\t\t * @param {Number} theta - The rotation.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\trotate(theta) {\r\n\r\n\t\t\tconst c = Math.cos(theta);\r\n\t\t\tconst s = Math.sin(theta);\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst a11 = te[0], a12 = te[3], a13 = te[6];\r\n\t\t\tconst a21 = te[1], a22 = te[4], a23 = te[7];\r\n\r\n\t\t\tte[0] = c * a11 + s * a21;\r\n\t\t\tte[3] = c * a12 + s * a22;\r\n\t\t\tte[6] = c * a13 + s * a23;\r\n\r\n\t\t\tte[1] = -s * a11 + c * a21;\r\n\t\t\tte[4] = -s * a12 + c * a22;\r\n\t\t\tte[7] = -s * a13 + c * a23;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Translates this matrix.\r\n\t\t *\r\n\t\t * @param {Number} tx - The X offset.\r\n\t\t * @param {Number} ty - The Y offset.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\ttranslate(tx, ty) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] += tx * te[2]; te[3] += tx * te[5]; te[6] += tx * te[8];\r\n\t\t\tte[1] += ty * te[2]; te[4] += ty * te[5]; te[7] += ty * te[8];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this matrix equals the given one.\r\n\t\t *\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {Boolean} Whether the matrix are equal.\r\n\t\t */\r\n\r\n\t\tequals(matrix) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst me = matrix.elements;\r\n\r\n\t\t\tlet result = true;\r\n\t\t\tlet i;\r\n\r\n\t\t\tfor(i = 0; result && i < 9; ++i) {\r\n\r\n\t\t\t\tif(te[i] !== me[i]) {\r\n\r\n\t\t\t\t\tresult = false;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An enumeration of Euler rotation orders.\r\n\t *\r\n\t * @type {Object}\r\n\t * @property {Number} XYZ - X -> Y -> Z.\r\n\t * @property {Number} YZX - Y -> Z -> X.\r\n\t * @property {Number} ZXY - Z -> X -> Y.\r\n\t * @property {Number} XZY - X -> Z -> Y.\r\n\t * @property {Number} YXZ - Y -> X -> Z.\r\n\t * @property {Number} ZYX - Z -> Y -> X.\r\n\t */\r\n\r\n\tconst RotationOrder = {\r\n\r\n\t\tXYZ: 0,\r\n\t\tYZX: 1,\r\n\t\tZXY: 2,\r\n\t\tXZY: 3,\r\n\t\tYXZ: 4,\r\n\t\tZYX: 5\r\n\r\n\t};\n\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst v$2 = new Vector3();\r\n\r\n\t/**\r\n\t * A quaternion.\r\n\t */\r\n\r\n\tclass Quaternion {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new quaternion.\r\n\t\t *\r\n\t\t * @param {Number} [x=0] - The X component.\r\n\t\t * @param {Number} [y=0] - The Y component.\r\n\t\t * @param {Number} [z=0] - The Z component.\r\n\t\t * @param {Number} [w=0] - The W component.\r\n\t\t */\r\n\r\n\t\tconstructor(x = 0, y = 0, z = 0, w = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The X component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.x = x;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Y component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.y = y;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Z component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.z = z;\r\n\r\n\t\t\t/**\r\n\t\t\t * The W component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.w = w;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the components of this quaternion.\r\n\t\t *\r\n\t\t * @param {Number} x - The X component.\r\n\t\t * @param {Number} y - The Y component.\r\n\t\t * @param {Number} z - The Z component.\r\n\t\t * @param {Number} w - The W component.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tset(x, y, z, w) {\r\n\r\n\t\t\tthis.x = x;\r\n\t\t\tthis.y = y;\r\n\t\t\tthis.z = z;\r\n\t\t\tthis.w = w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the components of the given quaternion.\r\n\t\t *\r\n\t\t * @param {Quaternion} q - The quaternion.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tcopy(q) {\r\n\r\n\t\t\tthis.x = q.x;\r\n\t\t\tthis.y = q.y;\r\n\t\t\tthis.z = q.z;\r\n\t\t\tthis.w = q.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this quaternion.\r\n\t\t *\r\n\t\t * @return {Quaternion} The cloned quaternion.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor(this.x, this.y, this.z, this.w);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from an array.\r\n\t\t *\r\n\t\t * @param {Number[]} array - An array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tfromArray(array, offset = 0) {\r\n\r\n\t\t\tthis.x = array[offset];\r\n\t\t\tthis.y = array[offset + 1];\r\n\t\t\tthis.z = array[offset + 2];\r\n\t\t\tthis.w = array[offset + 3];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores this quaternion in an array.\r\n\t\t *\r\n\t\t * @param {Array} [array] - A target array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Number[]} The array.\r\n\t\t */\r\n\r\n\t\ttoArray(array = [], offset = 0) {\r\n\r\n\t\t\tarray[offset] = this.x;\r\n\t\t\tarray[offset + 1] = this.y;\r\n\t\t\tarray[offset + 2] = this.z;\r\n\t\t\tarray[offset + 3] = this.w;\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the components of this quaternion based on the given Euler angles.\r\n\t\t *\r\n\t\t * For more details see: https://goo.gl/XRD1kr\r\n\t\t *\r\n\t\t * @param {Euler} euler - The euler angles.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tsetFromEuler(euler) {\r\n\r\n\t\t\tconst x = euler.x;\r\n\t\t\tconst y = euler.y;\r\n\t\t\tconst z = euler.z;\r\n\r\n\t\t\tconst cos = Math.cos;\r\n\t\t\tconst sin = Math.sin;\r\n\r\n\t\t\tconst c1 = cos(x / 2);\r\n\t\t\tconst c2 = cos(y / 2);\r\n\t\t\tconst c3 = cos(z / 2);\r\n\r\n\t\t\tconst s1 = sin(x / 2);\r\n\t\t\tconst s2 = sin(y / 2);\r\n\t\t\tconst s3 = sin(z / 2);\r\n\r\n\t\t\tswitch(euler.order) {\r\n\r\n\t\t\t\tcase RotationOrder.XYZ:\r\n\t\t\t\t\tthis.x = s1 * c2 * c3 + c1 * s2 * s3;\r\n\t\t\t\t\tthis.y = c1 * s2 * c3 - s1 * c2 * s3;\r\n\t\t\t\t\tthis.z = c1 * c2 * s3 + s1 * s2 * c3;\r\n\t\t\t\t\tthis.w = c1 * c2 * c3 - s1 * s2 * s3;\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase RotationOrder.YXZ:\r\n\t\t\t\t\tthis.x = s1 * c2 * c3 + c1 * s2 * s3;\r\n\t\t\t\t\tthis.y = c1 * s2 * c3 - s1 * c2 * s3;\r\n\t\t\t\t\tthis.z = c1 * c2 * s3 - s1 * s2 * c3;\r\n\t\t\t\t\tthis.w = c1 * c2 * c3 + s1 * s2 * s3;\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase RotationOrder.ZXY:\r\n\t\t\t\t\tthis.x = s1 * c2 * c3 - c1 * s2 * s3;\r\n\t\t\t\t\tthis.y = c1 * s2 * c3 + s1 * c2 * s3;\r\n\t\t\t\t\tthis.z = c1 * c2 * s3 + s1 * s2 * c3;\r\n\t\t\t\t\tthis.w = c1 * c2 * c3 - s1 * s2 * s3;\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase RotationOrder.ZYX:\r\n\t\t\t\t\tthis.x = s1 * c2 * c3 - c1 * s2 * s3;\r\n\t\t\t\t\tthis.y = c1 * s2 * c3 + s1 * c2 * s3;\r\n\t\t\t\t\tthis.z = c1 * c2 * s3 - s1 * s2 * c3;\r\n\t\t\t\t\tthis.w = c1 * c2 * c3 + s1 * s2 * s3;\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase RotationOrder.YZX:\r\n\t\t\t\t\tthis.x = s1 * c2 * c3 + c1 * s2 * s3;\r\n\t\t\t\t\tthis.y = c1 * s2 * c3 + s1 * c2 * s3;\r\n\t\t\t\t\tthis.z = c1 * c2 * s3 - s1 * s2 * c3;\r\n\t\t\t\t\tthis.w = c1 * c2 * c3 - s1 * s2 * s3;\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase RotationOrder.XZY:\r\n\t\t\t\t\tthis.x = s1 * c2 * c3 - c1 * s2 * s3;\r\n\t\t\t\t\tthis.y = c1 * s2 * c3 - s1 * c2 * s3;\r\n\t\t\t\t\tthis.z = c1 * c2 * s3 + s1 * s2 * c3;\r\n\t\t\t\t\tthis.w = c1 * c2 * c3 + s1 * s2 * s3;\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the components of this quaternion based on a given axis angle.\r\n\t\t *\r\n\t\t * For more information see:\r\n\t\t *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm\r\n\t\t *\r\n\t\t * @param {Vector3} axis - The axis. Assumed to be normalized.\r\n\t\t * @param {Number} angle - The angle in radians.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tsetFromAxisAngle(axis, angle) {\r\n\r\n\t\t\tconst halfAngle = angle / 2.0;\r\n\t\t\tconst s = Math.sin(halfAngle);\r\n\r\n\t\t\tthis.x = axis.x * s;\r\n\t\t\tthis.y = axis.y * s;\r\n\t\t\tthis.z = axis.z * s;\r\n\t\t\tthis.w = Math.cos(halfAngle);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the components of this quaternion based on a given rotation matrix.\r\n\t\t *\r\n\t\t * For more information see:\r\n\t\t *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm\r\n\t\t *\r\n\t\t * @param {Matrix4} m - The rotation matrix. The upper 3x3 is assumed to be a pure rotation matrix (i.e. unscaled).\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tsetFromRotationMatrix(m) {\r\n\r\n\t\t\tconst te = m.elements;\r\n\r\n\t\t\tconst m00 = te[0], m01 = te[4], m02 = te[8];\r\n\t\t\tconst m10 = te[1], m11 = te[5], m12 = te[9];\r\n\t\t\tconst m20 = te[2], m21 = te[6], m22 = te[10];\r\n\r\n\t\t\tconst trace = m00 + m11 + m22;\r\n\r\n\t\t\tlet s;\r\n\r\n\t\t\tif(trace > 0) {\r\n\r\n\t\t\t\ts = 0.5 / Math.sqrt(trace + 1.0);\r\n\r\n\t\t\t\tthis.w = 0.25 / s;\r\n\t\t\t\tthis.x = (m21 - m12) * s;\r\n\t\t\t\tthis.y = (m02 - m20) * s;\r\n\t\t\t\tthis.z = (m10 - m01) * s;\r\n\r\n\t\t\t} else if(m00 > m11 && m00 > m22) {\r\n\r\n\t\t\t\ts = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);\r\n\r\n\t\t\t\tthis.w = (m21 - m12) / s;\r\n\t\t\t\tthis.x = 0.25 * s;\r\n\t\t\t\tthis.y = (m01 + m10) / s;\r\n\t\t\t\tthis.z = (m02 + m20) / s;\r\n\r\n\t\t\t} else if(m11 > m22) {\r\n\r\n\t\t\t\ts = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);\r\n\r\n\t\t\t\tthis.w = (m02 - m20) / s;\r\n\t\t\t\tthis.x = (m01 + m10) / s;\r\n\t\t\t\tthis.y = 0.25 * s;\r\n\t\t\t\tthis.z = (m12 + m21) / s;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\ts = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);\r\n\r\n\t\t\t\tthis.w = (m10 - m01) / s;\r\n\t\t\t\tthis.x = (m02 + m20) / s;\r\n\t\t\t\tthis.y = (m12 + m21) / s;\r\n\t\t\t\tthis.z = 0.25 * s;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the components of this quaternion based on unit vectors.\r\n\t\t *\r\n\t\t * @param {Vector3} vFrom - A unit vector. Assumed to be normalized.\r\n\t\t * @param {Vector3} vTo - A unit vector. Assumed to be normalized.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tsetFromUnitVectors(vFrom, vTo) {\r\n\r\n\t\t\tlet r = vFrom.dot(vTo) + 1;\r\n\r\n\t\t\tif(r < 1e-6) {\r\n\r\n\t\t\t\tr = 0;\r\n\r\n\t\t\t\tif(Math.abs(vFrom.x) > Math.abs(vFrom.z)) {\r\n\r\n\t\t\t\t\tv$2.set(-vFrom.y, vFrom.x, 0);\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tv$2.set(0, -vFrom.z, vFrom.y);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tv$2.crossVectors(vFrom, vTo);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.x = v$2.x;\r\n\t\t\tthis.y = v$2.y;\r\n\t\t\tthis.z = v$2.z;\r\n\t\t\tthis.w = r;\r\n\r\n\t\t\treturn this.normalize();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Inverts this quaternion.\r\n\t\t *\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tinvert() {\r\n\r\n\t\t\treturn this.conjugate().normalize();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Conjugates this quaternion.\r\n\t\t *\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tconjugate() {\r\n\r\n\t\t\tthis.x *= -1;\r\n\t\t\tthis.y *= -1;\r\n\t\t\tthis.z *= -1;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared length of this quaternion.\r\n\t\t *\r\n\t\t * @return {Number} The squared length.\r\n\t\t */\r\n\r\n\t\tlengthSquared() {\r\n\r\n\t\t\treturn this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the length of this quaternion.\r\n\t\t *\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tlength() {\r\n\r\n\t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Normalizes this quaternion.\r\n\t\t *\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tnormalize() {\r\n\r\n\t\t\tconst l = this.length();\r\n\r\n\t\t\tlet invLength;\r\n\r\n\t\t\tif(l === 0) {\r\n\r\n\t\t\t\tthis.x = 0;\r\n\t\t\t\tthis.y = 0;\r\n\t\t\t\tthis.z = 0;\r\n\t\t\t\tthis.w = 1;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tinvLength = 1.0 / l;\r\n\r\n\t\t\t\tthis.x = this.x * invLength;\r\n\t\t\t\tthis.y = this.y * invLength;\r\n\t\t\t\tthis.z = this.z * invLength;\r\n\t\t\t\tthis.w = this.w * invLength;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the dot product with a given vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Number} The dot product.\r\n\t\t */\r\n\r\n\t\tdot(v) {\r\n\r\n\t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies the given quaternions and stores the result in this quaternion.\r\n\t\t *\r\n\t\t * For more details see:\r\n\t\t *  http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm\r\n\t\t *\r\n\t\t * @param {Quaternion} a - A quaternion.\r\n\t\t * @param {Quaternion} b - Another quaternion.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tmultiplyQuaternions(a, b) {\r\n\r\n\t\t\tconst qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;\r\n\t\t\tconst qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;\r\n\r\n\t\t\tthis.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;\r\n\t\t\tthis.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;\r\n\t\t\tthis.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;\r\n\t\t\tthis.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this quaternion with the given one and stores the result in\r\n\t\t * this quaternion.\r\n\t\t *\r\n\t\t * @param {Quaternion} q - A quaternion.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tmultiply(q) {\r\n\r\n\t\t\treturn this.multiplyQuaternions(this, q);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies the given quaternion with this one and stores the result in\r\n\t\t * this quaternion.\r\n\t\t *\r\n\t\t * @param {Quaternion} q - A quaternion.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tpremultiply(q) {\r\n\r\n\t\t\treturn this.multiplyQuaternions(q, this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Performs a spherical linear interpolation towards the given quaternion.\r\n\t\t *\r\n\t\t * For more details see:\r\n\t\t *  http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/\r\n\t\t *\r\n\t\t * @param {Quaternion} q - A quaternion.\r\n\t\t * @param {Number} t - The slerp factor.\r\n\t\t * @return {Quaternion} This quaternion.\r\n\t\t */\r\n\r\n\t\tslerp(q, t) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z, w = this.w;\r\n\r\n\t\t\tlet cosHalfTheta, sinHalfTheta;\r\n\t\t\tlet halfTheta, ratioA, ratioB;\r\n\r\n\t\t\tif(t === 1) {\r\n\r\n\t\t\t\tthis.copy(q);\r\n\r\n\t\t\t} else if(t > 0) {\r\n\r\n\t\t\t\tcosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;\r\n\r\n\t\t\t\tif(cosHalfTheta < 0) {\r\n\r\n\t\t\t\t\tthis.w = -q.w;\r\n\t\t\t\t\tthis.x = -q.x;\r\n\t\t\t\t\tthis.y = -q.y;\r\n\t\t\t\t\tthis.z = -q.z;\r\n\r\n\t\t\t\t\tcosHalfTheta = -cosHalfTheta;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tthis.copy(q);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(cosHalfTheta >= 1.0) {\r\n\r\n\t\t\t\t\tthis.w = w;\r\n\t\t\t\t\tthis.x = x;\r\n\t\t\t\t\tthis.y = y;\r\n\t\t\t\t\tthis.z = z;\r\n\r\n\t\t\t\t\treturn this;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tsinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);\r\n\r\n\t\t\t\tif(Math.abs(sinHalfTheta) < 1e-3) {\r\n\r\n\t\t\t\t\tthis.w = 0.5 * (w + this.w);\r\n\t\t\t\t\tthis.x = 0.5 * (x + this.x);\r\n\t\t\t\t\tthis.y = 0.5 * (y + this.y);\r\n\t\t\t\t\tthis.z = 0.5 * (z + this.z);\r\n\r\n\t\t\t\t\treturn this;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\thalfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);\r\n\t\t\t\tratioA = Math.sin((1.0 - t) * halfTheta) / sinHalfTheta;\r\n\t\t\t\tratioB = Math.sin(t * halfTheta) / sinHalfTheta;\r\n\r\n\t\t\t\tthis.w = (w * ratioA + this.w * ratioB);\r\n\t\t\t\tthis.x = (x * ratioA + this.x * ratioB);\r\n\t\t\t\tthis.y = (y * ratioA + this.y * ratioB);\r\n\t\t\t\tthis.z = (z * ratioA + this.z * ratioB);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this quaternions equals the given one.\r\n\t\t *\r\n\t\t * @param {Quaternion} q - A quaternion.\r\n\t\t * @return {Boolean} Whether the quaternions are equal.\r\n\t\t */\r\n\r\n\t\tequals(q) {\r\n\r\n\t\t\treturn (q.x === this.x) && (q.y === this.y) && (q.z === this.z) && (q.w === this.w);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Performs a spherical linear interpolation.\r\n\t\t *\r\n\t\t * @param {Quaternion} qa - The base quaternion.\r\n\t\t * @param {Quaternion} qb - The target quaternion.\r\n\t\t * @param {Quaternion} qr - A quaternion to store the result in.\r\n\t\t * @param {Number} t - The slerp factor.\r\n\t\t * @return {Quaternion} The resulting quaternion.\r\n\t\t */\r\n\r\n\t\tstatic slerp(qa, qb, qr, t) {\r\n\r\n\t\t\treturn qr.copy(qa).slerp(qb, t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Performs an array-based spherical linear interpolation.\r\n\t\t *\r\n\t\t * @param {Number[]} dst - An array to store the result in.\r\n\t\t * @param {Number} dstOffset - An offset into the destination array.\r\n\t\t * @param {Number[]} src0 - An array that contains the base quaternion values.\r\n\t\t * @param {Number} src0Offset - An offset into the base array.\r\n\t\t * @param {Number[]} src1 - An array that contains the target quaternion values.\r\n\t\t * @param {Number} src1Offset - An offset into the target array.\r\n\t\t * @param {Number} t - The slerp factor.\r\n\t\t */\r\n\r\n\t\tstatic slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {\r\n\r\n\t\t\tconst x1 = src1[srcOffset1];\r\n\t\t\tconst y1 = src1[srcOffset1 + 1];\r\n\t\t\tconst z1 = src1[srcOffset1 + 2];\r\n\t\t\tconst w1 = src1[srcOffset1 + 3];\r\n\r\n\t\t\tlet x0 = src0[srcOffset0];\r\n\t\t\tlet y0 = src0[srcOffset0 + 1];\r\n\t\t\tlet z0 = src0[srcOffset0 + 2];\r\n\t\t\tlet w0 = src0[srcOffset0 + 3];\r\n\r\n\t\t\tlet s, f;\r\n\t\t\tlet sin, cos, sqrSin;\r\n\t\t\tlet dir, len, tDir;\r\n\r\n\t\t\tif(w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {\r\n\r\n\t\t\t\ts = 1.0 - t;\r\n\t\t\t\tcos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1;\r\n\r\n\t\t\t\tdir = (cos >= 0) ? 1 : -1;\r\n\t\t\t\tsqrSin = 1.0 - cos * cos;\r\n\r\n\t\t\t\t// Skip the Slerp for tiny steps to avoid numeric problems.\r\n\t\t\t\tif(sqrSin > Number.EPSILON) {\r\n\r\n\t\t\t\t\tsin = Math.sqrt(sqrSin);\r\n\t\t\t\t\tlen = Math.atan2(sin, cos * dir);\r\n\r\n\t\t\t\t\ts = Math.sin(s * len) / sin;\r\n\t\t\t\t\tt = Math.sin(t * len) / sin;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\ttDir = t * dir;\r\n\r\n\t\t\t\tx0 = x0 * s + x1 * tDir;\r\n\t\t\t\ty0 = y0 * s + y1 * tDir;\r\n\t\t\t\tz0 = z0 * s + z1 * tDir;\r\n\t\t\t\tw0 = w0 * s + w1 * tDir;\r\n\r\n\t\t\t\t// Normalize in case a lerp has just been performed.\r\n\t\t\t\tif(s === 1.0 - t) {\r\n\r\n\t\t\t\t\tf = 1.0 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);\r\n\r\n\t\t\t\t\tx0 *= f;\r\n\t\t\t\t\ty0 *= f;\r\n\t\t\t\t\tz0 *= f;\r\n\t\t\t\t\tw0 *= f;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tdst[dstOffset] = x0;\r\n\t\t\tdst[dstOffset + 1] = y0;\r\n\t\t\tdst[dstOffset + 2] = z0;\r\n\t\t\tdst[dstOffset + 3] = w0;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Euler angles.\r\n\t */\n\n\t/**\r\n\t * A plane.\r\n\t */\n\n\t/**\n\t * A frustum.\n\t */\n\n\t/**\r\n\t * A line.\r\n\t */\n\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst a$2 = new Vector3();\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst b$2 = new Vector3();\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst c = new Vector3();\r\n\r\n\t/**\r\n\t * A 4x4 matrix.\r\n\t */\r\n\r\n\tclass Matrix4 {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new matrix.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * The matrix elements.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.elements = new Float32Array([\r\n\r\n\t\t\t\t1, 0, 0, 0,\r\n\t\t\t\t0, 1, 0, 0,\r\n\t\t\t\t0, 0, 1, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t]);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this matrix.\r\n\t\t *\r\n\t\t * @param {Number} n00 - The value of the first row, first column.\r\n\t\t * @param {Number} n01 - The value of the first row, second column.\r\n\t\t * @param {Number} n02 - The value of the first row, third column.\r\n\t\t * @param {Number} n03 - The value of the first row, fourth column.\r\n\t\t * @param {Number} n10 - The value of the second row, first column.\r\n\t\t * @param {Number} n11 - The value of the second row, second column.\r\n\t\t * @param {Number} n12 - The value of the second row, third column.\r\n\t\t * @param {Number} n13 - The value of the second row, fourth column.\r\n\t\t * @param {Number} n20 - The value of the third row, first column.\r\n\t\t * @param {Number} n21 - The value of the third row, second column.\r\n\t\t * @param {Number} n22 - The value of the third row, third column.\r\n\t\t * @param {Number} n23 - The value of the third row, fourth column.\r\n\t\t * @param {Number} n30 - The value of the fourth row, first column.\r\n\t\t * @param {Number} n31 - The value of the fourth row, second column.\r\n\t\t * @param {Number} n32 - The value of the fourth row, third column.\r\n\t\t * @param {Number} n33 - The value of the fourth row, fourth column.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tset(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] = n00; te[4] = n01; te[8] = n02; te[12] = n03;\r\n\t\t\tte[1] = n10; te[5] = n11; te[9] = n12; te[13] = n13;\r\n\t\t\tte[2] = n20; te[6] = n21; te[10] = n22; te[14] = n23;\r\n\t\t\tte[3] = n30; te[7] = n31; te[11] = n32; te[15] = n33;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this matrix to the identity matrix.\r\n\t\t *\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tidentity() {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\t1, 0, 0, 0,\r\n\t\t\t\t0, 1, 0, 0,\r\n\t\t\t\t0, 0, 1, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given matrix.\r\n\t\t *\r\n\t\t * @param {Matrix4} matrix - A matrix.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tcopy(matrix) {\r\n\r\n\t\t\tconst me = matrix.elements;\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];\r\n\t\t\tte[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];\r\n\t\t\tte[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];\r\n\t\t\tte[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this matrix.\r\n\t\t *\r\n\t\t * @return {Matrix4} A clone of this matrix.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().fromArray(this.elements);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given array.\r\n\t\t *\r\n\t\t * @param {Number[]} array - An array.\r\n\t\t * @param {Number} [offset=0] - An offset into the array.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tfromArray(array, offset = 0) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tlet i;\r\n\r\n\t\t\tfor(i = 0; i < 16; ++i) {\r\n\r\n\t\t\t\tte[i] = array[i + offset];\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores this matrix in an array.\r\n\t\t *\r\n\t\t * @param {Number[]} [array] - A target array.\r\n\t\t * @param {Number} [offset=0] - An offset into the array.\r\n\t\t * @return {Number[]} The array.\r\n\t\t */\r\n\r\n\t\ttoArray(array = [], offset = 0) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tlet i;\r\n\r\n\t\t\tfor(i = 0; i < 16; ++i) {\r\n\r\n\t\t\t\tarray[i + offset] = te[i];\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns the largest scale.\r\n\t\t *\r\n\t\t * @param {Matrix4} matrix - A matrix.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tgetMaxScaleOnAxis() {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];\r\n\t\t\tconst scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];\r\n\t\t\tconst scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];\r\n\r\n\t\t\treturn Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the position values of a given matrix.\r\n\t\t *\r\n\t\t * @param {Matrix4} matrix - A matrix.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tcopyPosition(matrix) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst me = matrix.elements;\r\n\r\n\t\t\tte[12] = me[12];\r\n\t\t\tte[13] = me[13];\r\n\t\t\tte[14] = me[14];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the position values of this matrix.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A position.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tsetPosition(p) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[12] = p.x;\r\n\t\t\tte[13] = p.y;\r\n\t\t\tte[14] = p.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Extracts the basis from this matrix.\r\n\t\t *\r\n\t\t * @param {Vector3} xAxis - A vector to store the X-axis column in.\r\n\t\t * @param {Vector3} yAxis - A vector to store the Y-axis column in.\r\n\t\t * @param {Vector3} zAxis - A vector to store the Z-axis column in.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\textractBasis(xAxis, yAxis, zAxis) {\r\n\r\n\t\t\txAxis.setFromMatrixColumn(this, 0);\r\n\t\t\tyAxis.setFromMatrixColumn(this, 1);\r\n\t\t\tzAxis.setFromMatrixColumn(this, 2);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the basis of this matrix.\r\n\t\t *\r\n\t\t * @param {Vector3} xAxis - The X-axis.\r\n\t\t * @param {Vector3} yAxis - The Y-axis.\r\n\t\t * @param {Vector3} zAxis - The Z-axis.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeBasis(xAxis, yAxis, zAxis) {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\txAxis.x, yAxis.x, zAxis.x, 0,\r\n\t\t\t\txAxis.y, yAxis.y, zAxis.y, 0,\r\n\t\t\t\txAxis.z, yAxis.z, zAxis.z, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Extracts the rotation from a given matrix.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\textractRotation(m) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst me = m.elements;\r\n\r\n\t\t\tconst scaleX = 1.0 / a$2.setFromMatrixColumn(m, 0).length();\r\n\t\t\tconst scaleY = 1.0 / a$2.setFromMatrixColumn(m, 1).length();\r\n\t\t\tconst scaleZ = 1.0 / a$2.setFromMatrixColumn(m, 2).length();\r\n\r\n\t\t\tte[0] = me[0] * scaleX;\r\n\t\t\tte[1] = me[1] * scaleX;\r\n\t\t\tte[2] = me[2] * scaleX;\r\n\r\n\t\t\tte[4] = me[4] * scaleY;\r\n\t\t\tte[5] = me[5] * scaleY;\r\n\t\t\tte[6] = me[6] * scaleY;\r\n\r\n\t\t\tte[8] = me[8] * scaleZ;\r\n\t\t\tte[9] = me[9] * scaleZ;\r\n\t\t\tte[10] = me[10] * scaleZ;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the matrix rotation based on the given Euler angles.\r\n\t\t *\r\n\t\t * @param {Euler} euler - The euler angles.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeRotationFromEuler(euler) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst x = euler.x;\r\n\t\t\tconst y = euler.y;\r\n\t\t\tconst z = euler.z;\r\n\r\n\t\t\tconst a = Math.cos(x), b = Math.sin(x);\r\n\t\t\tconst c = Math.cos(y), d = Math.sin(y);\r\n\t\t\tconst e = Math.cos(z), f = Math.sin(z);\r\n\r\n\t\t\tlet ae, af, be, bf;\r\n\t\t\tlet ce, cf, de, df;\r\n\t\t\tlet ac, ad, bc, bd;\r\n\r\n\t\t\tswitch(euler.order) {\r\n\r\n\t\t\t\tcase RotationOrder.XYZ: {\r\n\r\n\t\t\t\t\tae = a * e, af = a * f, be = b * e, bf = b * f;\r\n\r\n\t\t\t\t\tte[0] = c * e;\r\n\t\t\t\t\tte[4] = -c * f;\r\n\t\t\t\t\tte[8] = d;\r\n\r\n\t\t\t\t\tte[1] = af + be * d;\r\n\t\t\t\t\tte[5] = ae - bf * d;\r\n\t\t\t\t\tte[9] = -b * c;\r\n\r\n\t\t\t\t\tte[2] = bf - ae * d;\r\n\t\t\t\t\tte[6] = be + af * d;\r\n\t\t\t\t\tte[10] = a * c;\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tcase RotationOrder.YXZ: {\r\n\r\n\t\t\t\t\tce = c * e, cf = c * f, de = d * e, df = d * f;\r\n\r\n\t\t\t\t\tte[0] = ce + df * b;\r\n\t\t\t\t\tte[4] = de * b - cf;\r\n\t\t\t\t\tte[8] = a * d;\r\n\r\n\t\t\t\t\tte[1] = a * f;\r\n\t\t\t\t\tte[5] = a * e;\r\n\t\t\t\t\tte[9] = -b;\r\n\r\n\t\t\t\t\tte[2] = cf * b - de;\r\n\t\t\t\t\tte[6] = df + ce * b;\r\n\t\t\t\t\tte[10] = a * c;\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tcase RotationOrder.ZXY: {\r\n\r\n\t\t\t\t\tce = c * e, cf = c * f, de = d * e, df = d * f;\r\n\r\n\t\t\t\t\tte[0] = ce - df * b;\r\n\t\t\t\t\tte[4] = -a * f;\r\n\t\t\t\t\tte[8] = de + cf * b;\r\n\r\n\t\t\t\t\tte[1] = cf + de * b;\r\n\t\t\t\t\tte[5] = a * e;\r\n\t\t\t\t\tte[9] = df - ce * b;\r\n\r\n\t\t\t\t\tte[2] = -a * d;\r\n\t\t\t\t\tte[6] = b;\r\n\t\t\t\t\tte[10] = a * c;\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tcase RotationOrder.ZYX: {\r\n\r\n\t\t\t\t\tae = a * e, af = a * f, be = b * e, bf = b * f;\r\n\r\n\t\t\t\t\tte[0] = c * e;\r\n\t\t\t\t\tte[4] = be * d - af;\r\n\t\t\t\t\tte[8] = ae * d + bf;\r\n\r\n\t\t\t\t\tte[1] = c * f;\r\n\t\t\t\t\tte[5] = bf * d + ae;\r\n\t\t\t\t\tte[9] = af * d - be;\r\n\r\n\t\t\t\t\tte[2] = -d;\r\n\t\t\t\t\tte[6] = b * c;\r\n\t\t\t\t\tte[10] = a * c;\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tcase RotationOrder.YZX: {\r\n\r\n\t\t\t\t\tac = a * c, ad = a * d, bc = b * c, bd = b * d;\r\n\r\n\t\t\t\t\tte[0] = c * e;\r\n\t\t\t\t\tte[4] = bd - ac * f;\r\n\t\t\t\t\tte[8] = bc * f + ad;\r\n\r\n\t\t\t\t\tte[1] = f;\r\n\t\t\t\t\tte[5] = a * e;\r\n\t\t\t\t\tte[9] = -b * e;\r\n\r\n\t\t\t\t\tte[2] = -d * e;\r\n\t\t\t\t\tte[6] = ad * f + bc;\r\n\t\t\t\t\tte[10] = ac - bd * f;\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tcase RotationOrder.XZY: {\r\n\r\n\t\t\t\t\tac = a * c, ad = a * d, bc = b * c, bd = b * d;\r\n\r\n\t\t\t\t\tte[0] = c * e;\r\n\t\t\t\t\tte[4] = -f;\r\n\t\t\t\t\tte[8] = d * e;\r\n\r\n\t\t\t\t\tte[1] = ac * f + bd;\r\n\t\t\t\t\tte[5] = a * e;\r\n\t\t\t\t\tte[9] = ad * f - bc;\r\n\r\n\t\t\t\t\tte[2] = bc * f - ad;\r\n\t\t\t\t\tte[6] = b * e;\r\n\t\t\t\t\tte[10] = bd * f + ac;\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Last column.\r\n\t\t\tte[3] = 0;\r\n\t\t\tte[7] = 0;\r\n\t\t\tte[11] = 0;\r\n\r\n\t\t\t// Bottom row.\r\n\t\t\tte[12] = 0;\r\n\t\t\tte[13] = 0;\r\n\t\t\tte[14] = 0;\r\n\t\t\tte[15] = 1;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the matrix rotation based on the given quaternion.\r\n\t\t *\r\n\t\t * @param {Quaternion} q - The quaternion.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeRotationFromQuaternion(q) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst x = q.x, y = q.y, z = q.z, w = q.w;\r\n\t\t\tconst x2 = x + x, y2 = y + y, z2 = z + z;\r\n\t\t\tconst xx = x * x2, xy = x * y2, xz = x * z2;\r\n\t\t\tconst yy = y * y2, yz = y * z2, zz = z * z2;\r\n\t\t\tconst wx = w * x2, wy = w * y2, wz = w * z2;\r\n\r\n\t\t\tte[0] = 1 - (yy + zz);\r\n\t\t\tte[4] = xy - wz;\r\n\t\t\tte[8] = xz + wy;\r\n\r\n\t\t\tte[1] = xy + wz;\r\n\t\t\tte[5] = 1 - (xx + zz);\r\n\t\t\tte[9] = yz - wx;\r\n\r\n\t\t\tte[2] = xz - wy;\r\n\t\t\tte[6] = yz + wx;\r\n\t\t\tte[10] = 1 - (xx + yy);\r\n\r\n\t\t\t// Last column.\r\n\t\t\tte[3] = 0;\r\n\t\t\tte[7] = 0;\r\n\t\t\tte[11] = 0;\r\n\r\n\t\t\t// Bottom row.\r\n\t\t\tte[12] = 0;\r\n\t\t\tte[13] = 0;\r\n\t\t\tte[14] = 0;\r\n\t\t\tte[15] = 1;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a rotation that looks at the given target.\r\n\t\t *\r\n\t\t * @param {Vector3} eye - The position of the eye.\r\n\t\t * @param {Vector3} target - The target to look at.\r\n\t\t * @param {Vector3} up - The up vector.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tlookAt(eye, target, up) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst x = a$2, y = b$2, z = c;\r\n\r\n\t\t\tz.subVectors(eye, target);\r\n\r\n\t\t\tif(z.lengthSquared() === 0) {\r\n\r\n\t\t\t\t// Eye and target are at the same position.\r\n\t\t\t\tz.z = 1;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tz.normalize();\r\n\t\t\tx.crossVectors(up, z);\r\n\r\n\t\t\tif(x.lengthSquared() === 0) {\r\n\r\n\t\t\t\t// Up and z are parallel.\r\n\t\t\t\tif(Math.abs(up.z) === 1) {\r\n\r\n\t\t\t\t\tz.x += 1e-4;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tz.z += 1e-4;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tz.normalize();\r\n\t\t\t\tx.crossVectors(up, z);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tx.normalize();\r\n\t\t\ty.crossVectors(z, x);\r\n\r\n\t\t\tte[0] = x.x; te[4] = y.x; te[8] = z.x;\r\n\t\t\tte[1] = x.y; te[5] = y.y; te[9] = z.y;\r\n\t\t\tte[2] = x.z; te[6] = y.z; te[10] = z.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this matrix to the product of the given matrices.\r\n\t\t *\r\n\t\t * @param {Matrix4} a - A matrix.\r\n\t\t * @param {Matrix4} b - A matrix.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmultiplyMatrices(a, b) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst ae = a.elements;\r\n\t\t\tconst be = b.elements;\r\n\r\n\t\t\tconst a00 = ae[0], a01 = ae[4], a02 = ae[8], a03 = ae[12];\r\n\t\t\tconst a10 = ae[1], a11 = ae[5], a12 = ae[9], a13 = ae[13];\r\n\t\t\tconst a20 = ae[2], a21 = ae[6], a22 = ae[10], a23 = ae[14];\r\n\t\t\tconst a30 = ae[3], a31 = ae[7], a32 = ae[11], a33 = ae[15];\r\n\r\n\t\t\tconst b00 = be[0], b01 = be[4], b02 = be[8], b03 = be[12];\r\n\t\t\tconst b10 = be[1], b11 = be[5], b12 = be[9], b13 = be[13];\r\n\t\t\tconst b20 = be[2], b21 = be[6], b22 = be[10], b23 = be[14];\r\n\t\t\tconst b30 = be[3], b31 = be[7], b32 = be[11], b33 = be[15];\r\n\r\n\t\t\tte[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;\r\n\t\t\tte[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;\r\n\t\t\tte[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;\r\n\t\t\tte[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;\r\n\r\n\t\t\tte[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;\r\n\t\t\tte[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;\r\n\t\t\tte[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;\r\n\t\t\tte[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;\r\n\r\n\t\t\tte[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;\r\n\t\t\tte[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;\r\n\t\t\tte[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;\r\n\t\t\tte[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;\r\n\r\n\t\t\tte[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;\r\n\t\t\tte[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;\r\n\t\t\tte[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;\r\n\t\t\tte[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this matrix with the given one.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmultiply(m) {\r\n\r\n\t\t\treturn this.multiplyMatrices(this, m);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies a given matrix with this one.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tpremultiply(m) {\r\n\r\n\t\t\treturn this.multiplyMatrices(m, this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this matrix with a given scalar.\r\n\t\t *\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmultiplyScalar(s) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;\r\n\t\t\tte[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;\r\n\t\t\tte[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;\r\n\t\t\tte[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the determinant of this matrix.\r\n\t\t *\r\n\t\t * For more details see:\r\n\t\t *  http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm\r\n\t\t *\r\n\t\t * @return {Number} The determinant.\r\n\t\t */\r\n\r\n\t\tdeterminant() {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst n00 = te[0], n01 = te[4], n02 = te[8], n03 = te[12];\r\n\t\t\tconst n10 = te[1], n11 = te[5], n12 = te[9], n13 = te[13];\r\n\t\t\tconst n20 = te[2], n21 = te[6], n22 = te[10], n23 = te[14];\r\n\t\t\tconst n30 = te[3], n31 = te[7], n32 = te[11], n33 = te[15];\r\n\r\n\t\t\tconst n00n11 = n00 * n11, n00n12 = n00 * n12, n00n13 = n00 * n13;\r\n\t\t\tconst n01n10 = n01 * n10, n01n12 = n01 * n12, n01n13 = n01 * n13;\r\n\t\t\tconst n02n10 = n02 * n10, n02n11 = n02 * n11, n02n13 = n02 * n13;\r\n\t\t\tconst n03n10 = n03 * n10, n03n11 = n03 * n11, n03n12 = n03 * n12;\r\n\r\n\t\t\treturn (\r\n\r\n\t\t\t\tn30 * (\r\n\t\t\t\t\tn03n12 * n21 -\r\n\t\t\t\t\tn02n13 * n21 -\r\n\t\t\t\t\tn03n11 * n22 +\r\n\t\t\t\t\tn01n13 * n22 +\r\n\t\t\t\t\tn02n11 * n23 -\r\n\t\t\t\t\tn01n12 * n23\r\n\t\t\t\t) +\r\n\r\n\t\t\t\tn31 * (\r\n\t\t\t\t\tn00n12 * n23 -\r\n\t\t\t\t\tn00n13 * n22 +\r\n\t\t\t\t\tn03n10 * n22 -\r\n\t\t\t\t\tn02n10 * n23 +\r\n\t\t\t\t\tn02n13 * n20 -\r\n\t\t\t\t\tn03n12 * n20\r\n\t\t\t\t) +\r\n\r\n\t\t\t\tn32 * (\r\n\t\t\t\t\tn00n13 * n21 -\r\n\t\t\t\t\tn00n11 * n23 -\r\n\t\t\t\t\tn03n10 * n21 +\r\n\t\t\t\t\tn01n10 * n23 +\r\n\t\t\t\t\tn03n11 * n20 -\r\n\t\t\t\t\tn01n13 * n20\r\n\t\t\t\t) +\r\n\r\n\t\t\t\tn33 * (\r\n\t\t\t\t\t-n02n11 * n20 -\r\n\t\t\t\t\tn00n12 * n21 +\r\n\t\t\t\t\tn00n11 * n22 +\r\n\t\t\t\t\tn02n10 * n21 -\r\n\t\t\t\t\tn01n10 * n22 +\r\n\t\t\t\t\tn01n12 * n20\r\n\t\t\t\t)\r\n\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Inverts the given matrix and stores the result in this matrix.\r\n\t\t *\r\n\t\t * For details see:\r\n\t\t *  http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm\r\n\t\t *\r\n\t\t * @param {Matrix4} matrix - The matrix that should be inverted.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tgetInverse(matrix) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst me = matrix.elements;\r\n\r\n\t\t\tconst n00 = me[0], n10 = me[1], n20 = me[2], n30 = me[3];\r\n\t\t\tconst n01 = me[4], n11 = me[5], n21 = me[6], n31 = me[7];\r\n\t\t\tconst n02 = me[8], n12 = me[9], n22 = me[10], n32 = me[11];\r\n\t\t\tconst n03 = me[12], n13 = me[13], n23 = me[14], n33 = me[15];\r\n\r\n\t\t\tconst t00 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;\r\n\t\t\tconst t01 = n03 * n22 * n31 - n02 * n23 * n31 - n03 * n21 * n32 + n01 * n23 * n32 + n02 * n21 * n33 - n01 * n22 * n33;\r\n\t\t\tconst t02 = n02 * n13 * n31 - n03 * n12 * n31 + n03 * n11 * n32 - n01 * n13 * n32 - n02 * n11 * n33 + n01 * n12 * n33;\r\n\t\t\tconst t03 = n03 * n12 * n21 - n02 * n13 * n21 - n03 * n11 * n22 + n01 * n13 * n22 + n02 * n11 * n23 - n01 * n12 * n23;\r\n\r\n\t\t\tconst det = n00 * t00 + n10 * t01 + n20 * t02 + n30 * t03;\r\n\r\n\t\t\tlet invDet;\r\n\r\n\t\t\tif(det !== 0) {\r\n\r\n\t\t\t\tinvDet = 1.0 / det;\r\n\r\n\t\t\t\tte[0] = t00 * invDet;\r\n\t\t\t\tte[1] = (n13 * n22 * n30 - n12 * n23 * n30 - n13 * n20 * n32 + n10 * n23 * n32 + n12 * n20 * n33 - n10 * n22 * n33) * invDet;\r\n\t\t\t\tte[2] = (n11 * n23 * n30 - n13 * n21 * n30 + n13 * n20 * n31 - n10 * n23 * n31 - n11 * n20 * n33 + n10 * n21 * n33) * invDet;\r\n\t\t\t\tte[3] = (n12 * n21 * n30 - n11 * n22 * n30 - n12 * n20 * n31 + n10 * n22 * n31 + n11 * n20 * n32 - n10 * n21 * n32) * invDet;\r\n\r\n\t\t\t\tte[4] = t01 * invDet;\r\n\t\t\t\tte[5] = (n02 * n23 * n30 - n03 * n22 * n30 + n03 * n20 * n32 - n00 * n23 * n32 - n02 * n20 * n33 + n00 * n22 * n33) * invDet;\r\n\t\t\t\tte[6] = (n03 * n21 * n30 - n01 * n23 * n30 - n03 * n20 * n31 + n00 * n23 * n31 + n01 * n20 * n33 - n00 * n21 * n33) * invDet;\r\n\t\t\t\tte[7] = (n01 * n22 * n30 - n02 * n21 * n30 + n02 * n20 * n31 - n00 * n22 * n31 - n01 * n20 * n32 + n00 * n21 * n32) * invDet;\r\n\r\n\t\t\t\tte[8] = t02 * invDet;\r\n\t\t\t\tte[9] = (n03 * n12 * n30 - n02 * n13 * n30 - n03 * n10 * n32 + n00 * n13 * n32 + n02 * n10 * n33 - n00 * n12 * n33) * invDet;\r\n\t\t\t\tte[10] = (n01 * n13 * n30 - n03 * n11 * n30 + n03 * n10 * n31 - n00 * n13 * n31 - n01 * n10 * n33 + n00 * n11 * n33) * invDet;\r\n\t\t\t\tte[11] = (n02 * n11 * n30 - n01 * n12 * n30 - n02 * n10 * n31 + n00 * n12 * n31 + n01 * n10 * n32 - n00 * n11 * n32) * invDet;\r\n\r\n\t\t\t\tte[12] = t03 * invDet;\r\n\t\t\t\tte[13] = (n02 * n13 * n20 - n03 * n12 * n20 + n03 * n10 * n22 - n00 * n13 * n22 - n02 * n10 * n23 + n00 * n12 * n23) * invDet;\r\n\t\t\t\tte[14] = (n03 * n11 * n20 - n01 * n13 * n20 - n03 * n10 * n21 + n00 * n13 * n21 + n01 * n10 * n23 - n00 * n11 * n23) * invDet;\r\n\t\t\t\tte[15] = (n01 * n12 * n20 - n02 * n11 * n20 + n02 * n10 * n21 - n00 * n12 * n21 - n01 * n10 * n22 + n00 * n11 * n22) * invDet;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tconsole.error(\"Can't invert matrix, determinant is zero\", matrix);\r\n\r\n\t\t\t\tthis.identity();\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Transposes this matrix.\r\n\t\t *\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\ttranspose() {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tlet t;\r\n\r\n\t\t\tt = te[1]; te[1] = te[4]; te[4] = t;\r\n\t\t\tt = te[2]; te[2] = te[8]; te[8] = t;\r\n\t\t\tt = te[6]; te[6] = te[9]; te[9] = t;\r\n\r\n\t\t\tt = te[3]; te[3] = te[12]; te[12] = t;\r\n\t\t\tt = te[7]; te[7] = te[13]; te[13] = t;\r\n\t\t\tt = te[11]; te[11] = te[14]; te[14] = t;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Scales this matrix.\r\n\t\t *\r\n\t\t * @param {Number} sx - The X scale.\r\n\t\t * @param {Number} sy - The Y scale.\r\n\t\t * @param {Number} sy - The Z scale.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tscale(sx, sy, sz) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] *= sx; te[4] *= sy; te[8] *= sz;\r\n\t\t\tte[1] *= sx; te[5] *= sy; te[9] *= sz;\r\n\t\t\tte[2] *= sx; te[6] *= sy; te[10] *= sz;\r\n\t\t\tte[3] *= sx; te[7] *= sy; te[11] *= sz;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Makes this matrix a scale matrix.\r\n\t\t *\r\n\t\t * @param {Number} x - The X scale.\r\n\t\t * @param {Number} y - The Y scale.\r\n\t\t * @param {Number} z - The Z scale.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeScale(x, y, z) {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\tx, 0, 0, 0,\r\n\t\t\t\t0, y, 0, 0,\r\n\t\t\t\t0, 0, z, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Makes this matrix a translation matrix.\r\n\t\t *\r\n\t\t * @param {Number} x - The X offset.\r\n\t\t * @param {Number} y - The Y offset.\r\n\t\t * @param {Number} z - The Z offset.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeTranslation(x, y, z) {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\t1, 0, 0, x,\r\n\t\t\t\t0, 1, 0, y,\r\n\t\t\t\t0, 0, 1, z,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Makes this matrix a rotation matrix.\r\n\t\t *\r\n\t\t * @param {Number} theta - The angle in radians.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeRotationX(theta) {\r\n\r\n\t\t\tconst c = Math.cos(theta), s = Math.sin(theta);\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\t1, 0, 0, 0,\r\n\t\t\t\t0, c, -s, 0,\r\n\t\t\t\t0, s, c, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Makes this matrix a rotation matrix with respect to the Y-axis.\r\n\t\t *\r\n\t\t * @param {Number} theta - The angle in radians.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeRotationY(theta) {\r\n\r\n\t\t\tconst c = Math.cos(theta), s = Math.sin(theta);\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\tc, 0, s, 0,\r\n\t\t\t\t0, 1, 0, 0,\r\n\t\t\t\t-s, 0, c, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Makes this matrix a rotation matrix with respect to the Z-axis.\r\n\t\t *\r\n\t\t * @param {Number} theta - The angle in radians.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeRotationZ(theta) {\r\n\r\n\t\t\tconst c = Math.cos(theta), s = Math.sin(theta);\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\tc, -s, 0, 0,\r\n\t\t\t\ts, c, 0, 0,\r\n\t\t\t\t0, 0, 1, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Makes this matrix a translation matrix with respect to a specific axis.\r\n\t\t *\r\n\t\t * For mor einformation see:\r\n\t\t *  http://www.gamedev.net/reference/articles/article1199.asp\r\n\t\t *\r\n\t\t * @param {Vector3} axis - The axis. Assumed to be normalized.\r\n\t\t * @param {Number} angle - The angle in radians.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeRotationAxis(axis, angle) {\r\n\r\n\t\t\tconst c = Math.cos(angle);\r\n\t\t\tconst s = Math.sin(angle);\r\n\r\n\t\t\tconst t = 1.0 - c;\r\n\r\n\t\t\tconst x = axis.x, y = axis.y, z = axis.z;\r\n\t\t\tconst tx = t * x, ty = t * y;\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\ttx * x + c, tx * y - s * z, tx * z + s * y, 0,\r\n\t\t\t\ttx * y + s * z, ty * y + c, ty * z - s * x, 0,\r\n\t\t\t\ttx * z - s * y, ty * z + s * x, t * z * z + c, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Makes this matrix a shear matrix.\r\n\t\t *\r\n\t\t * @param {Number} x - The X shear value.\r\n\t\t * @param {Number} y - The Y shear value.\r\n\t\t * @param {Number} z - The Z shear value.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeShear(x, y, z) {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\t1, y, z, 0,\r\n\t\t\t\tx, 1, z, 0,\r\n\t\t\t\tx, y, 1, 0,\r\n\t\t\t\t0, 0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this matrix based on the given position, rotation and scale.\r\n\t\t *\r\n\t\t * @param {Vector3} position - The position.\r\n\t\t * @param {Quaternion} quaternion - The rotation.\r\n\t\t * @param {Vector3} scale - The scale.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tcompose(position, quaternion, scale) {\r\n\r\n\t\t\tthis.makeRotationFromQuaternion(quaternion);\r\n\t\t\tthis.scale(scale.x, scale.y, scale.z);\r\n\t\t\tthis.setPosition(position);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Decomposes this matrix into a position, rotation and scale vector.\r\n\t\t *\r\n\t\t * @param {Vector3} position - The target position.\r\n\t\t * @param {Quaternion} quaternion - The target rotation.\r\n\t\t * @param {Vector3} scale - The target scale.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tdecompose(position, quaternion, scale) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tconst n00 = te[0], n10 = te[1], n20 = te[2];\r\n\t\t\tconst n01 = te[4], n11 = te[5], n21 = te[6];\r\n\t\t\tconst n02 = te[8], n12 = te[9], n22 = te[10];\r\n\r\n\t\t\tconst det = this.determinant();\r\n\r\n\t\t\t// If the determinant is negative, one scale must be inverted.\r\n\t\t\tconst sx = a$2.set(n00, n10, n20).length() * ((det < 0) ? -1 : 1);\r\n\t\t\tconst sy = a$2.set(n01, n11, n21).length();\r\n\t\t\tconst sz = a$2.set(n02, n12, n22).length();\r\n\r\n\t\t\tconst invSX = 1.0 / sx;\r\n\t\t\tconst invSY = 1.0 / sy;\r\n\t\t\tconst invSZ = 1.0 / sz;\r\n\r\n\t\t\t// Export the position.\r\n\t\t\tposition.x = te[12];\r\n\t\t\tposition.y = te[13];\r\n\t\t\tposition.z = te[14];\r\n\r\n\t\t\t// Scale the rotation part.\r\n\t\t\tte[0] *= invSX; te[1] *= invSX; te[2] *= invSX;\r\n\t\t\tte[4] *= invSY; te[5] *= invSY; te[6] *= invSY;\r\n\t\t\tte[8] *= invSZ; te[9] *= invSZ; te[10] *= invSZ;\r\n\r\n\t\t\t// Export the rotation.\r\n\t\t\tquaternion.setFromRotationMatrix(this);\r\n\r\n\t\t\t// Restore the original values.\r\n\t\t\tte[0] = n00; te[1] = n10; te[2] = n20;\r\n\t\t\tte[4] = n01; te[5] = n11; te[6] = n21;\r\n\t\t\tte[8] = n02; te[9] = n12; te[10] = n22;\r\n\r\n\t\t\t// Export the scale.\r\n\t\t\tscale.x = sx;\r\n\t\t\tscale.y = sy;\r\n\t\t\tscale.z = sz;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a perspective matrix.\r\n\t\t *\r\n\t\t * @param {Number} left - The distance to the left plane.\r\n\t\t * @param {Number} right - The distance to the right plane.\r\n\t\t * @param {Number} top - The distance to the top plane.\r\n\t\t * @param {Number} bottom - The distance to the bottom plane.\r\n\t\t * @param {Number} near - The distance to the near plane.\r\n\t\t * @param {Number} far - The distance to the far plane.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakePerspective(left, right, top, bottom, near, far) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst x = 2 * near / (right - left);\r\n\t\t\tconst y = 2 * near / (top - bottom);\r\n\r\n\t\t\tconst a = (right + left) / (right - left);\r\n\t\t\tconst b = (top + bottom) / (top - bottom);\r\n\t\t\tconst c = -(far + near) / (far - near);\r\n\t\t\tconst d = -2 * far * near / (far - near);\r\n\r\n\t\t\tte[0] = x; te[4] = 0; te[8] = a; te[12] = 0;\r\n\t\t\tte[1] = 0; te[5] = y; te[9] = b; te[13] = 0;\r\n\t\t\tte[2] = 0; te[6] = 0; te[10] = c; te[14] = d;\r\n\t\t\tte[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates an orthographic matrix.\r\n\t\t *\r\n\t\t * @param {Number} left - The distance to the left plane.\r\n\t\t * @param {Number} right - The distance to the right plane.\r\n\t\t * @param {Number} top - The distance to the top plane.\r\n\t\t * @param {Number} bottom - The distance to the bottom plane.\r\n\t\t * @param {Number} near - The distance to the near plane.\r\n\t\t * @param {Number} far - The distance to the far plane.\r\n\t\t * @return {Matrix4} This matrix.\r\n\t\t */\r\n\r\n\t\tmakeOrthographic(left, right, top, bottom, near, far) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst w = 1.0 / (right - left);\r\n\t\t\tconst h = 1.0 / (top - bottom);\r\n\t\t\tconst p = 1.0 / (far - near);\r\n\r\n\t\t\tconst x = (right + left) * w;\r\n\t\t\tconst y = (top + bottom) * h;\r\n\t\t\tconst z = (far + near) * p;\r\n\r\n\t\t\tte[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = -x;\r\n\t\t\tte[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = -y;\r\n\t\t\tte[2] = 0; te[6] = 0; te[10] = -2 * p; te[14] = -z;\r\n\t\t\tte[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this matrix equals the given one.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Boolean} Whether the matrix are equal.\r\n\t\t */\r\n\r\n\t\tequals(matrix) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst me = matrix.elements;\r\n\r\n\t\t\tlet result = true;\r\n\t\t\tlet i;\r\n\r\n\t\t\tfor(i = 0; result && i < 16; ++i) {\r\n\r\n\t\t\t\tif(te[i] !== me[i]) {\r\n\r\n\t\t\t\t\tresult = false;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A list of vectors.\r\n\t *\r\n\t * @type {Vector3[]}\r\n\t * @private\r\n\t */\r\n\r\n\tconst v$3 = [\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3()\r\n\t];\r\n\r\n\t/**\r\n\t * A ray.\r\n\t */\r\n\r\n\tclass Ray {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new ray.\r\n\t\t *\r\n\t\t * @param {Vector3} [origin] - The origin.\r\n\t\t * @param {Vector3} [direction] - The direction.\r\n\t\t */\r\n\r\n\t\tconstructor(origin = new Vector3(), direction = new Vector3()) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The origin.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.origin = origin;\r\n\r\n\t\t\t/**\r\n\t\t\t * The direction.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.direction = direction;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the origin and the direction.\r\n\t\t *\r\n\t\t * @param {Vector3} origin - The origin.\r\n\t\t * @param {Vector3} direction - The direction. Should be normalized.\r\n\t\t * @return {Ray} This ray.\r\n\t\t */\r\n\r\n\t\tset(origin, direction) {\r\n\r\n\t\t\tthis.origin.copy(origin);\r\n\t\t\tthis.direction.copy(direction);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the given ray.\r\n\t\t *\r\n\t\t * @param {Ray} r - A ray.\r\n\t\t * @return {Ray} This ray.\r\n\t\t */\r\n\r\n\t\tcopy(r) {\r\n\r\n\t\t\tthis.origin.copy(r.origin);\r\n\t\t\tthis.direction.copy(r.direction);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this ray.\r\n\t\t *\r\n\t\t * @return {Ray} The cloned ray.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes a point along the ray based on a given scalar t.\r\n\t\t *\r\n\t\t * @param {Number} t - The scalar.\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} The point.\r\n\t\t */\r\n\r\n\t\tat(t, target = new Vector3()) {\r\n\r\n\t\t\treturn target.copy(this.direction).multiplyScalar(t).add(this.origin);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rotates this ray to look at the given target.\r\n\t\t *\r\n\t\t * @param {Vector3} target - A point to look at.\r\n\t\t * @return {Ray} This ray.\r\n\t\t */\r\n\r\n\t\tlookAt(target) {\r\n\r\n\t\t\tthis.direction.copy(target).sub(this.origin).normalize();\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Moves the origin along the ray by a given scalar t.\r\n\t\t *\r\n\t\t * @param {Number} t - The scalar.\r\n\t\t * @return {Ray} This ray.\r\n\t\t */\r\n\r\n\t\trecast(t) {\r\n\r\n\t\t\tthis.origin.copy(this.at(t, v$3[0]));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds the closest point along this ray to a given point.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} The point.\r\n\t\t */\r\n\r\n\t\tclosestPointToPoint(p, target = new Vector3()) {\r\n\r\n\t\t\tconst directionDistance = target.subVectors(p, this.origin).dot(this.direction);\r\n\r\n\t\t\treturn (directionDistance >= 0.0) ?\r\n\t\t\t\ttarget.copy(this.direction).multiplyScalar(directionDistance).add(this.origin) :\r\n\t\t\t\ttarget.copy(this.origin);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared distance from this ray to the given point.\r\n\t\t *\r\n\t\t * @param {Vector3} p - The point.\r\n\t\t * @return {Number} The squared distance.\r\n\t\t */\r\n\r\n\t\tdistanceSquaredToPoint(p) {\r\n\r\n\t\t\tconst directionDistance = v$3[0].subVectors(p, this.origin).dot(this.direction);\r\n\r\n\t\t\t// Check if the point is behind the ray.\r\n\t\t\treturn (directionDistance < 0.0) ?\r\n\t\t\t\tthis.origin.distanceToSquared(p) :\r\n\t\t\t\tv$3[0].copy(this.direction).multiplyScalar(directionDistance).add(this.origin).distanceToSquared(p);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance from this ray to the given point.\r\n\t\t *\r\n\t\t * @param {Vector3} p - The point.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tdistanceToPoint(p) {\r\n\r\n\t\t\treturn Math.sqrt(this.distanceSquaredToPoint(p));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance from this ray to the given plane.\r\n\t\t *\r\n\t\t * @param {Plane} p - The plane.\r\n\t\t * @return {Number} The distance, or null if the denominator is zero.\r\n\t\t */\r\n\r\n\t\tdistanceToPlane(p) {\r\n\r\n\t\t\tconst denominator = p.normal.dot(this.direction);\r\n\r\n\t\t\tconst t = (denominator !== 0.0) ?\r\n\t\t\t\t-(this.origin.dot(p.normal) + p.constant) / denominator :\r\n\t\t\t\t((p.distanceToPoint(this.origin) === 0.0) ? 0.0 : -1.0);\r\n\r\n\t\t\treturn (t >= 0.0) ? t : null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance from this ray to a given line segment.\r\n\t\t *\r\n\t\t * Based on:\r\n\t\t *  http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h\r\n\t\t *\r\n\t\t * @param {Vector3} v0 - The start of the segment.\r\n\t\t * @param {Vector3} v1 - The end of the segment.\r\n\t\t * @param {Vector3} [pointOnRay] - If provided, the point on this Ray that is closest to the segment will be stored in this vector.\r\n\t\t * @param {Vector3} [pointOnSegment] - If provided, the point on the line segment that is closest to this ray will be stored in this vector.\r\n\t\t * @return {Number} The smallest distance between the ray and the segment defined by v0 and v1.\r\n\t\t */\r\n\r\n\t\tdistanceSquaredToSegment(v0, v1, pointOnRay, pointOnSegment) {\r\n\r\n\t\t\tconst segCenter = v$3[0].copy(v0).add(v1).multiplyScalar(0.5);\r\n\t\t\tconst segDir = v$3[1].copy(v1).sub(v0).normalize();\r\n\t\t\tconst diff = v$3[2].copy(this.origin).sub(segCenter);\r\n\r\n\t\t\tconst segExtent = v0.distanceTo(v1) * 0.5;\r\n\t\t\tconst a01 = -this.direction.dot(segDir);\r\n\t\t\tconst b0 = diff.dot(this.direction);\r\n\t\t\tconst b1 = -diff.dot(segDir);\r\n\t\t\tconst c = diff.lengthSq();\r\n\t\t\tconst det = Math.abs(1.0 - a01 * a01);\r\n\r\n\t\t\tlet s0, s1, extDet, invDet, sqrDist;\r\n\r\n\t\t\tif(det > 0.0) {\r\n\r\n\t\t\t\t// The ray and segment are not parallel.\r\n\t\t\t\ts0 = a01 * b1 - b0;\r\n\t\t\t\ts1 = a01 * b0 - b1;\r\n\t\t\t\textDet = segExtent * det;\r\n\r\n\t\t\t\tif(s0 >= 0.0) {\r\n\r\n\t\t\t\t\tif(s1 >= -extDet) {\r\n\r\n\t\t\t\t\t\tif(s1 <= extDet) {\r\n\r\n\t\t\t\t\t\t\t// Region 0.\r\n\t\t\t\t\t\t\t// Minimum at interior points of ray and segment.\r\n\t\t\t\t\t\t\tinvDet = 1.0 / det;\r\n\t\t\t\t\t\t\ts0 *= invDet;\r\n\t\t\t\t\t\t\ts1 *= invDet;\r\n\t\t\t\t\t\t\tsqrDist = s0 * (s0 + a01 * s1 + 2.0 * b0) + s1 * (a01 * s0 + s1 + 2.0 * b1) + c;\r\n\r\n\t\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t\t// Region 1.\r\n\t\t\t\t\t\t\ts1 = segExtent;\r\n\t\t\t\t\t\t\ts0 = Math.max(0.0, -(a01 * s1 + b0));\r\n\t\t\t\t\t\t\tsqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t// Region 5.\r\n\t\t\t\t\t\ts1 = -segExtent;\r\n\t\t\t\t\t\ts0 = Math.max(0.0, -(a01 * s1 + b0));\r\n\t\t\t\t\t\tsqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tif(s1 <= -extDet) {\r\n\r\n\t\t\t\t\t\t// Region 4.\r\n\t\t\t\t\t\ts0 = Math.max(0.0, -(-a01 * segExtent + b0));\r\n\t\t\t\t\t\ts1 = (s0 > 0.0) ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);\r\n\t\t\t\t\t\tsqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;\r\n\r\n\t\t\t\t\t} else if(s1 <= extDet) {\r\n\r\n\t\t\t\t\t\t// Region 3.\r\n\t\t\t\t\t\ts0 = 0.0;\r\n\t\t\t\t\t\ts1 = Math.min(Math.max(-segExtent, -b1), segExtent);\r\n\t\t\t\t\t\tsqrDist = s1 * (s1 + 2.0 * b1) + c;\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t// Region 2.\r\n\t\t\t\t\t\ts0 = Math.max(0.0, -(a01 * segExtent + b0));\r\n\t\t\t\t\t\ts1 = (s0 > 0.0) ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);\r\n\t\t\t\t\t\tsqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\t// Ray and segment are parallel.\r\n\t\t\t\ts1 = (a01 > 0.0) ? -segExtent : segExtent;\r\n\t\t\t\ts0 = Math.max(0.0, -(a01 * s1 + b0));\r\n\t\t\t\tsqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(pointOnRay !== undefined) {\r\n\r\n\t\t\t\tpointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(pointOnSegment !== undefined) {\r\n\r\n\t\t\t\tpointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn sqrDist;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds the point where this ray intersects the given sphere.\r\n\t\t *\r\n\t\t * @param {Sphere} s - A sphere.\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} The point of intersection, or null if there is none.\r\n\t\t */\r\n\r\n\t\tintersectSphere(s, target = new Vector3()) {\r\n\r\n\t\t\tconst ab = v$3[0].subVectors(s.center, this.origin);\r\n\t\t\tconst tca = ab.dot(this.direction);\r\n\t\t\tconst d2 = ab.dot(ab) - tca * tca;\r\n\t\t\tconst radius2 = s.radius * s.radius;\r\n\r\n\t\t\tlet result = null;\r\n\t\t\tlet thc, t0, t1;\r\n\r\n\t\t\tif(d2 <= radius2) {\r\n\r\n\t\t\t\tthc = Math.sqrt(radius2 - d2);\r\n\r\n\t\t\t\t// t0 = first intersection point - entrance on front of sphere.\r\n\t\t\t\tt0 = tca - thc;\r\n\r\n\t\t\t\t// t1 = second intersection point - exit point on back of sphere.\r\n\t\t\t\tt1 = tca + thc;\r\n\r\n\t\t\t\t// Check if both t0 and t1 are behind the ray - if so, return null.\r\n\t\t\t\tif(t0 >= 0.0 || t1 >= 0.0) {\r\n\r\n\t\t\t\t\t/* Check if t0 is behind the ray. If it is, the ray is inside the\r\n\t\t\t\t\tsphere, so return the second exit point scaled by t1 in order to always\r\n\t\t\t\t\treturn an intersection point that is in front of the ray. If t0 is in\r\n\t\t\t\t\tfront of the ray, return the first collision point scaled by t0. */\r\n\t\t\t\t\tresult = (t0 < 0.0) ? this.at(t1, target) : this.at(t0, target);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Determines whether this ray intersects the given sphere.\r\n\t\t *\r\n\t\t * @param {Sphere} s - A sphere.\r\n\t\t * @return {Boolean} Whether this ray intersects the given sphere.\r\n\t\t */\r\n\r\n\t\tintersectsSphere(s) {\r\n\r\n\t\t\treturn (this.distanceToPoint(s.center) <= s.radius);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds the point where this ray intersects the given plane.\r\n\t\t *\r\n\t\t * @param {Plane} p - A plane.\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} The point of intersection, or null if there is none.\r\n\t\t */\r\n\r\n\t\tintersectPlane(p, target = new Vector3()) {\r\n\r\n\t\t\tconst t = this.distanceToPlane(p);\r\n\r\n\t\t\treturn (t === null) ? null : this.at(t, target);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Determines whether this ray intersects the given plane.\r\n\t\t *\r\n\t\t * @param {Plane} p - A plane.\r\n\t\t * @return {Boolean} Whether this ray intersects the given plane.\r\n\t\t */\r\n\r\n\t\tintersectsPlane(p) {\r\n\r\n\t\t\tconst distanceToPoint = p.distanceToPoint(this.origin);\r\n\r\n\t\t\treturn (distanceToPoint === 0.0 || p.normal.dot(this.direction) * distanceToPoint < 0.0);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds the point where this ray intersects the given box.\r\n\t\t *\r\n\t\t * @param {Plane} b - A box.\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} The point of intersection, or null if there is none.\r\n\t\t */\r\n\r\n\t\tintersectBox(b, target = new Vector3()) {\r\n\r\n\t\t\tconst origin = this.origin;\r\n\t\t\tconst direction = this.direction;\r\n\t\t\tconst min = b.min;\r\n\t\t\tconst max = b.max;\r\n\r\n\t\t\tconst invDirX = 1.0 / direction.x;\r\n\t\t\tconst invDirY = 1.0 / direction.y;\r\n\t\t\tconst invDirZ = 1.0 / direction.z;\r\n\r\n\t\t\tlet result = null;\r\n\t\t\tlet tmin, tmax, tymin, tymax, tzmin, tzmax;\r\n\r\n\t\t\tif(invDirX >= 0.0) {\r\n\r\n\t\t\t\ttmin = (min.x - origin.x) * invDirX;\r\n\t\t\t\ttmax = (max.x - origin.x) * invDirX;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\ttmin = (max.x - origin.x) * invDirX;\r\n\t\t\t\ttmax = (min.x - origin.x) * invDirX;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(invDirY >= 0.0) {\r\n\r\n\t\t\t\ttymin = (min.y - origin.y) * invDirY;\r\n\t\t\t\ttymax = (max.y - origin.y) * invDirY;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\ttymin = (max.y - origin.y) * invDirY;\r\n\t\t\t\ttymax = (min.y - origin.y) * invDirY;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(tmin <= tymax && tymin <= tmax) {\r\n\r\n\t\t\t\t/* Handle the case where tmin or tmax is NaN (result of 0 * Infinity).\r\n\t\t\t\tNote: x !== x returns true if x is NaN. */\r\n\t\t\t\tif(tymin > tmin || tmin !== tmin) {\r\n\r\n\t\t\t\t\ttmin = tymin;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(tymax < tmax || tmax !== tmax) {\r\n\r\n\t\t\t\t\ttmax = tymax;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(invDirZ >= 0.0) {\r\n\r\n\t\t\t\t\ttzmin = (min.z - origin.z) * invDirZ;\r\n\t\t\t\t\ttzmax = (max.z - origin.z) * invDirZ;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\ttzmin = (max.z - origin.z) * invDirZ;\r\n\t\t\t\t\ttzmax = (min.z - origin.z) * invDirZ;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(tmin <= tzmax && tzmin <= tmax) {\r\n\r\n\t\t\t\t\tif(tzmin > tmin || tmin !== tmin) {\r\n\r\n\t\t\t\t\t\ttmin = tzmin;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tif(tzmax < tmax || tmax !== tmax) {\r\n\r\n\t\t\t\t\t\ttmax = tzmax;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\t// Return the closest point (positive side).\r\n\t\t\t\t\tif(tmax >= 0.0) {\r\n\r\n\t\t\t\t\t\tresult = this.at((tmin >= 0.0) ? tmin : tmax, target);\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Determines whether this ray intersects the given box.\r\n\t\t *\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Boolean} Whether this ray intersects the given box.\r\n\t\t */\r\n\r\n\t\tintersectsBox(b) {\r\n\r\n\t\t\treturn (this.intersectBox(b, v$3[0]) !== null);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds the point where this ray intersects the given triangle.\r\n\t\t *\r\n\t\t * Based on:\r\n\t\t *  http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h\r\n\t\t *\r\n\t\t * @param {Vector3} a - A triangle vertex.\r\n\t\t * @param {Vector3} b - A triangle vertex.\r\n\t\t * @param {Vector3} c - A triangle vertex.\r\n\t\t * @param {Boolean} [backfaceCulling=false] - Whether backface culling should be considered.\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} The point of intersection, or null if there is none.\r\n\t\t */\r\n\r\n\t\tintersectTriangle(a, b, c, backfaceCulling, target) {\r\n\r\n\t\t\tconst direction = this.direction;\r\n\r\n\t\t\t// Compute the offset origin, edges, and normal.\r\n\t\t\tconst diff = v$3[0];\r\n\t\t\tconst edge1 = v$3[1];\r\n\t\t\tconst edge2 = v$3[2];\r\n\t\t\tconst normal = v$3[3];\r\n\r\n\t\t\tlet result = null;\r\n\t\t\tlet DdN, sign, DdQxE2, DdE1xQ, QdN;\r\n\r\n\t\t\tedge1.subVectors(b, a);\r\n\t\t\tedge2.subVectors(c, a);\r\n\t\t\tnormal.crossVectors(edge1, edge2);\r\n\r\n\t\t\t/* Solve Q + t * D = b1 * E1 + b2 * E2\r\n\t\t\t * (Q = kDiff, D = ray direction, E1 = kEdge1, E2 = kEdge2,\r\n\t\t\t * N = Cross(E1, E2)):\r\n\t\t\t *\r\n\t\t\t *   | Dot(D, N) | * b1 = sign(Dot(D, N)) * Dot(D, Cross(Q, E2))\r\n\t\t\t *   | Dot(D, N) | * b2 = sign(Dot(D, N)) * Dot(D, Cross(E1, Q))\r\n\t\t\t *   | Dot(D, N) | * t = -sign(Dot(D, N)) * Dot(Q, N)\r\n\t\t\t */\r\n\r\n\t\t\tDdN = direction.dot(normal);\r\n\r\n\t\t\t// Discard coplanar constellations and cull backfaces.\r\n\t\t\tif(DdN !== 0.0 && !(backfaceCulling && DdN > 0.0)) {\r\n\r\n\t\t\t\tif(DdN > 0.0) {\r\n\r\n\t\t\t\t\tsign = 1.0;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tsign = -1.0;\r\n\t\t\t\t\tDdN = -DdN;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tdiff.subVectors(this.origin, a);\r\n\t\t\t\tDdQxE2 = sign * direction.dot(edge2.crossVectors(diff, edge2));\r\n\r\n\t\t\t\t// b1 < 0, no intersection.\r\n\t\t\t\tif(DdQxE2 >= 0.0) {\r\n\r\n\t\t\t\t\tDdE1xQ = sign * direction.dot(edge1.cross(diff));\r\n\r\n\t\t\t\t\t// b2 < 0, or b1 + b2 > 1, no intersection.\r\n\t\t\t\t\tif(DdE1xQ >= 0.0 && DdQxE2 + DdE1xQ <= DdN) {\r\n\r\n\t\t\t\t\t\t// The line intersects the triangle, check if the ray does.\r\n\t\t\t\t\t\tQdN = -sign * diff.dot(normal);\r\n\r\n\t\t\t\t\t\t// t < 0, no intersection.\r\n\t\t\t\t\t\tif(QdN >= 0.0) {\r\n\r\n\t\t\t\t\t\t\t// Ray intersects triangle.\r\n\t\t\t\t\t\t\tresult = this.at(QdN / DdN, target);\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies the given matrix to this ray.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Ray} This ray.\r\n\t\t */\r\n\r\n\t\tapplyMatrix4(m) {\r\n\r\n\t\t\tthis.origin.applyMatrix4(m);\r\n\t\t\tthis.direction.transformDirection(m);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this ray equals the given one.\r\n\t\t *\r\n\t\t * @param {Ray} r - A ray.\r\n\t\t * @return {Boolean} Whether the rays are equal.\r\n\t\t */\r\n\r\n\t\tequals(r) {\r\n\r\n\t\t\treturn (r.origin.equals(this.origin) && r.direction.equals(this.direction));\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A spherical coordinate system.\r\n\t *\r\n\t * For details see: https://en.wikipedia.org/wiki/Spherical_coordinate_system\r\n\t *\r\n\t * The poles (phi) are at the positive and negative Y-axis. The equator starts\r\n\t * at positive Z.\r\n\t */\n\n\t/**\r\n\t * A symmetric 3x3 matrix.\r\n\t */\r\n\r\n\tclass SymmetricMatrix3 {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new symmetric matrix.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * The matrix elements.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.elements = new Float32Array([\r\n\r\n\t\t\t\t1, 0, 0,\r\n\t\t\t\t1, 0,\r\n\t\t\t\t1\r\n\r\n\t\t\t]);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this matrix.\r\n\t\t *\r\n\t\t * @param {Number} m00 - The value of the first row, first column.\r\n\t\t * @param {Number} m01 - The value of the first row, second column and the second row, first column.\r\n\t\t * @param {Number} m02 - The value of the first row, third column and the third row, first column.\r\n\t\t * @param {Number} m11 - The value of the second row, second column.\r\n\t\t * @param {Number} m12 - The value of the second row, third column and third row, second column.\r\n\t\t * @param {Number} m22 - The value of the third row, third column.\r\n\t\t * @return {SymmetricMatrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tset(m00, m01, m02, m11, m12, m22) {\r\n\r\n\t\t\tconst e = this.elements;\r\n\r\n\t\t\te[0] = m00;\r\n\t\t\te[1] = m01; e[3] = m11;\r\n\t\t\te[2] = m02; e[4] = m12; e[5] = m22;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this matrix to the identity matrix.\r\n\t\t *\r\n\t\t * @return {SymmetricMatrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tidentity() {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\t1, 0, 0,\r\n\t\t\t\t1, 0,\r\n\t\t\t\t1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given symmetric matrix.\r\n\t\t *\r\n\t\t * @param {SymmetricMatrix3} m - A matrix.\r\n\t\t * @return {SymmetricMatrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tcopy(m) {\r\n\r\n\t\t\tconst me = m.elements;\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\tme[0], me[1], me[2],\r\n\t\t\t\tme[3], me[4],\r\n\t\t\t\tme[5]\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this matrix.\r\n\t\t *\r\n\t\t * @return {SymmetricMatrix3} A clone of this matrix.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies this symmetric matrix into a given 3x3 matrix.\r\n\t\t *\r\n\t\t * @param {Matrix3} m - The target matrix.\r\n\t\t */\r\n\r\n\t\ttoMatrix3(m) {\r\n\r\n\t\t\tconst me = m.elements;\r\n\r\n\t\t\tm.set(\r\n\r\n\t\t\t\tme[0], me[1], me[2],\r\n\t\t\t\tme[1], me[3], me[4],\r\n\t\t\t\tme[2], me[4], me[5]\r\n\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds the values of a given symmetric matrix to this one.\r\n\t\t *\r\n\t\t * @param {SymmetricMatrix3} m - A matrix.\r\n\t\t * @return {SymmetricMatrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tadd(m) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst me = m.elements;\r\n\r\n\t\t\tte[0] += me[0];\r\n\t\t\tte[1] += me[1]; te[3] += me[3];\r\n\t\t\tte[2] += me[2]; te[4] += me[4]; te[5] += me[5];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Frobenius norm of this matrix.\r\n\t\t *\r\n\t\t * @return {Number} The norm of this matrix.\r\n\t\t */\r\n\r\n\t\tnorm() {\r\n\r\n\t\t\tconst e = this.elements;\r\n\r\n\t\t\tconst m01m01 = e[1] * e[1];\r\n\t\t\tconst m02m02 = e[2] * e[2];\r\n\t\t\tconst m12m12 = e[4] * e[4];\r\n\r\n\t\t\treturn Math.sqrt(\r\n\r\n\t\t\t\te[0] * e[0] + m01m01 + m02m02 +\r\n\t\t\t\tm01m01 + e[3] * e[3] + m12m12 +\r\n\t\t\t\tm02m02 + m12m12 + e[5] * e[5]\r\n\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the absolute sum of all matrix components except for the main\r\n\t\t * diagonal.\r\n\t\t *\r\n\t\t * @return {Number} The offset of this matrix.\r\n\t\t */\r\n\r\n\t\toff() {\r\n\r\n\t\t\tconst e = this.elements;\r\n\r\n\t\t\treturn Math.sqrt(2 * (\r\n\r\n\t\t\t\t// Diagonal = [0, 3, 5].\r\n\t\t\t\te[1] * e[1] + e[2] * e[2] + e[4] * e[4]\r\n\r\n\t\t\t));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies this symmetric matrix to a vector.\r\n\t\t *\r\n\t\t * @param {Vector3} v - The vector to modify.\r\n\t\t * @return {Vector3} The modified vector.\r\n\t\t */\r\n\r\n\t\tapplyToVector3(v) {\r\n\r\n\t\t\tconst x = v.x, y = v.y, z = v.z;\r\n\t\t\tconst e = this.elements;\r\n\r\n\t\t\tv.x = e[0] * x + e[1] * y + e[2] * z;\r\n\t\t\tv.y = e[1] * x + e[3] * y + e[4] * z;\r\n\t\t\tv.z = e[2] * x + e[4] * y + e[5] * z;\r\n\r\n\t\t\treturn v;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this matrix equals the given one.\r\n\t\t *\r\n\t\t * @param {SymmetricMatrix3} m - A matrix.\r\n\t\t * @return {Boolean} Whether the matrices are equal.\r\n\t\t */\r\n\r\n\t\tequals(matrix) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst me = matrix.elements;\r\n\r\n\t\t\tlet result = true;\r\n\t\t\tlet i;\r\n\r\n\t\t\tfor(i = 0; result && i < 6; ++i) {\r\n\r\n\t\t\t\tif(te[i] !== me[i]) {\r\n\r\n\t\t\t\t\tresult = false;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the linear index of an element from this matrix.\r\n\t\t *\r\n\t\t * Let N be the dimension of the symmetric matrix:\r\n\t\t *\r\n\t\t *     index = N * (N - 1) / 2 - (N - i) * (N - i - 1) / 2 + j\r\n\t\t *\r\n\t\t * @param {Number} i - The row.\r\n\t\t * @param {Number} j - The column.\r\n\t\t * @return {Number} The index into the elements of this matrix.\r\n\t\t */\r\n\r\n\t\tstatic calculateIndex(i, j) {\r\n\r\n\t\t\treturn (3 - (3 - i) * (2 - i) / 2 + j);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A vector with four components.\r\n\t */\r\n\r\n\tclass Vector4 {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new vector.\r\n\t\t *\r\n\t\t * @param {Number} [x=0] - The X component.\r\n\t\t * @param {Number} [y=0] - The Y component.\r\n\t\t * @param {Number} [z=0] - The Z component.\r\n\t\t * @param {Number} [w=0] - The W component.\r\n\t\t */\r\n\r\n\t\tconstructor(x = 0, y = 0, z = 0, w = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The X component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.x = x;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Y component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.y = y;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Z component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.z = z;\r\n\r\n\t\t\t/**\r\n\t\t\t * The W component.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.w = w;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this vector\r\n\t\t *\r\n\t\t * @param {Number} x - The X component.\r\n\t\t * @param {Number} y - The Y component.\r\n\t\t * @param {Number} z - The Z component.\r\n\t\t * @param {Number} w - The W component.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tset(x, y, z, w) {\r\n\r\n\t\t\tthis.x = x;\r\n\t\t\tthis.y = y;\r\n\t\t\tthis.z = z;\r\n\t\t\tthis.w = w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of another vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tcopy(v) {\r\n\r\n\t\t\tthis.x = v.x;\r\n\t\t\tthis.y = v.y;\r\n\t\t\tthis.z = v.z;\r\n\t\t\tthis.w = v.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this vector.\r\n\t\t *\r\n\t\t * @return {Vector4} A clone of this vector.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor(this.x, this.y, this.z, this.w);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from an array.\r\n\t\t *\r\n\t\t * @param {Number[]} array - An array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tfromArray(array, offset = 0) {\r\n\r\n\t\t\tthis.x = array[offset];\r\n\t\t\tthis.y = array[offset + 1];\r\n\t\t\tthis.z = array[offset + 2];\r\n\t\t\tthis.w = array[offset + 3];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores this vector in an array.\r\n\t\t *\r\n\t\t * @param {Array} [array] - A target array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Number[]} The array.\r\n\t\t */\r\n\r\n\t\ttoArray(array = [], offset = 0) {\r\n\r\n\t\t\tarray[offset] = this.x;\r\n\t\t\tarray[offset + 1] = this.y;\r\n\t\t\tarray[offset + 2] = this.z;\r\n\t\t\tarray[offset + 3] = this.w;\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores the axis angle from the given quaternion in this vector.\r\n\t\t *\r\n\t\t * For more details see:\r\n\t\t *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm\r\n\t\t *\r\n\t\t * @param {Quaternion} q - A quaternion. Assumed to be normalized\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tsetAxisAngleFromQuaternion(q) {\r\n\r\n\t\t\tthis.w = 2 * Math.acos(q.w);\r\n\r\n\t\t\tconst s = Math.sqrt(1 - q.w * q.w);\r\n\r\n\t\t\tif(s < 1e-4) {\r\n\r\n\t\t\t\tthis.x = 1;\r\n\t\t\t\tthis.y = 0;\r\n\t\t\t\tthis.z = 0;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tthis.x = q.x / s;\r\n\t\t\t\tthis.y = q.y / s;\r\n\t\t\t\tthis.z = q.z / s;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores the axis angle from the given rotation matrix in this vector.\r\n\t\t *\r\n\t\t * For more details see:\r\n\t\t *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix. The upper 3x3 must be a pure rotation matrix (i.e. unscaled).\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tsetAxisAngleFromRotationMatrix(m) {\r\n\r\n\t\t\t// Margin to allow for rounding errors.\r\n\t\t\tconst E = 0.01;\r\n\t\t\t// Margin to distinguish between 0 and 180 degrees.\r\n\t\t\tconst H = 0.1;\r\n\r\n\t\t\tconst me = m.elements;\r\n\t\t\tconst m00 = me[0], m01 = me[4], m02 = me[8];\r\n\t\t\tconst m10 = me[1], m11 = me[5], m12 = me[9];\r\n\t\t\tconst m20 = me[2], m21 = me[6], m22 = me[10];\r\n\r\n\t\t\tlet angle;\r\n\t\t\tlet x, y, z;\r\n\t\t\tlet xx, yy, zz;\r\n\t\t\tlet xy, xz, yz;\r\n\t\t\tlet s;\r\n\r\n\t\t\tif((Math.abs(m01 - m10) < E) && (Math.abs(m02 - m20) < E) && (Math.abs(m12 - m21) < E)) {\r\n\r\n\t\t\t\t/* Singularity found. First, check for identity matrix which must have +1\r\n\t\t\t\tfor all terms in the leading diagonal and zero in other terms. */\r\n\t\t\t\tif((Math.abs(m01 + m10) < H) && (Math.abs(m02 + m20) < H) && (Math.abs(m12 + m21) < H) && (Math.abs(m00 + m11 + m22 - 3) < H)) {\r\n\r\n\t\t\t\t\t// This singularity is the identity matrix. The angle is zero.\r\n\t\t\t\t\tthis.set(1, 0, 0, 0);\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\t// The angle is 180.\r\n\t\t\t\t\tangle = Math.PI;\r\n\r\n\t\t\t\t\txx = (m00 + 1) / 2;\r\n\t\t\t\t\tyy = (m11 + 1) / 2;\r\n\t\t\t\t\tzz = (m22 + 1) / 2;\r\n\t\t\t\t\txy = (m01 + m10) / 4;\r\n\t\t\t\t\txz = (m02 + m20) / 4;\r\n\t\t\t\t\tyz = (m12 + m21) / 4;\r\n\r\n\t\t\t\t\tif((xx > yy) && (xx > zz)) {\r\n\r\n\t\t\t\t\t\t// m00 is the largest diagonal term.\r\n\t\t\t\t\t\tif(xx < E) {\r\n\r\n\t\t\t\t\t\t\tx = 0;\r\n\t\t\t\t\t\t\ty = 0.707106781;\r\n\t\t\t\t\t\t\tz = 0.707106781;\r\n\r\n\t\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t\tx = Math.sqrt(xx);\r\n\t\t\t\t\t\t\ty = xy / x;\r\n\t\t\t\t\t\t\tz = xz / x;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t} else if(yy > zz) {\r\n\r\n\t\t\t\t\t\t// m11 is the largest diagonal term.\r\n\t\t\t\t\t\tif(yy < E) {\r\n\r\n\t\t\t\t\t\t\tx = 0.707106781;\r\n\t\t\t\t\t\t\ty = 0;\r\n\t\t\t\t\t\t\tz = 0.707106781;\r\n\r\n\t\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t\ty = Math.sqrt(yy);\r\n\t\t\t\t\t\t\tx = xy / y;\r\n\t\t\t\t\t\t\tz = yz / y;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t// m22 is the largest diagonal term.\r\n\t\t\t\t\t\tif(zz < E) {\r\n\r\n\t\t\t\t\t\t\tx = 0.707106781;\r\n\t\t\t\t\t\t\ty = 0.707106781;\r\n\t\t\t\t\t\t\tz = 0;\r\n\r\n\t\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t\tz = Math.sqrt(zz);\r\n\t\t\t\t\t\t\tx = xz / z;\r\n\t\t\t\t\t\t\ty = yz / z;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tthis.set(x, y, z, angle);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\t// There are no singularities.\r\n\t\t\t\ts = Math.sqrt(\r\n\t\t\t\t\t(m21 - m12) * (m21 - m12) +\r\n\t\t\t\t\t(m02 - m20) * (m02 - m20) +\r\n\t\t\t\t\t(m10 - m01) * (m10 - m01)\r\n\t\t\t\t);\r\n\r\n\t\t\t\t// Prevent division by zero.\r\n\t\t\t\tif(Math.abs(s) < 0.001) {\r\n\r\n\t\t\t\t\ts = 1;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tthis.x = (m21 - m12) / s;\r\n\t\t\t\tthis.y = (m02 - m20) / s;\r\n\t\t\t\tthis.z = (m10 - m01) / s;\r\n\t\t\t\tthis.w = Math.acos((m00 + m11 + m22 - 1) / 2);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a vector to this one.\r\n\t\t *\r\n\t\t * @param {Vector4} v - The vector to add.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tadd(v) {\r\n\r\n\t\t\tthis.x += v.x;\r\n\t\t\tthis.y += v.y;\r\n\t\t\tthis.z += v.z;\r\n\t\t\tthis.w += v.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scalar to this vector.\r\n\t\t *\r\n\t\t * @param {Number} s - The scalar to add.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\taddScalar(s) {\r\n\r\n\t\t\tthis.x += s;\r\n\t\t\tthis.y += s;\r\n\t\t\tthis.z += s;\r\n\t\t\tthis.w += s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the sum of two given vectors.\r\n\t\t *\r\n\t\t * @param {Vector4} a - A vector.\r\n\t\t * @param {Vector4} b - Another vector.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\taddVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x + b.x;\r\n\t\t\tthis.y = a.y + b.y;\r\n\t\t\tthis.z = a.z + b.z;\r\n\t\t\tthis.w = a.w + b.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scaled vector to this one.\r\n\t\t *\r\n\t\t * @param {Vector4} v - The vector to scale and add.\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\taddScaledVector(v, s) {\r\n\r\n\t\t\tthis.x += v.x * s;\r\n\t\t\tthis.y += v.y * s;\r\n\t\t\tthis.z += v.z * s;\r\n\t\t\tthis.w += v.w * s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a vector from this vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - The vector to subtract.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tsub(v) {\r\n\r\n\t\t\tthis.x -= v.x;\r\n\t\t\tthis.y -= v.y;\r\n\t\t\tthis.z -= v.z;\r\n\t\t\tthis.w -= v.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a scalar from this vector.\r\n\t\t *\r\n\t\t * @param {Number} s - The scalar to subtract.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tsubScalar(s) {\r\n\r\n\t\t\tthis.x -= s;\r\n\t\t\tthis.y -= s;\r\n\t\t\tthis.z -= s;\r\n\t\t\tthis.w -= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the difference between two given vectors.\r\n\t\t *\r\n\t\t * @param {Vector4} a - A vector.\r\n\t\t * @param {Vector4} b - A second vector.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tsubVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x - b.x;\r\n\t\t\tthis.y = a.y - b.y;\r\n\t\t\tthis.z = a.z - b.z;\r\n\t\t\tthis.w = a.w - b.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with another vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tmultiply(v) {\r\n\r\n\t\t\tthis.x *= v.x;\r\n\t\t\tthis.y *= v.y;\r\n\t\t\tthis.z *= v.z;\r\n\t\t\tthis.w *= v.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with a given scalar.\r\n\t\t *\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyScalar(s) {\r\n\r\n\t\t\tthis.x *= s;\r\n\t\t\tthis.y *= s;\r\n\t\t\tthis.z *= s;\r\n\t\t\tthis.w *= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the product of two given vectors.\r\n\t\t *\r\n\t\t * @param {Vector4} a - A vector.\r\n\t\t * @param {Vector4} b - Another vector.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x * b.x;\r\n\t\t\tthis.y = a.y * b.y;\r\n\t\t\tthis.z = a.z * b.z;\r\n\t\t\tthis.w = a.w * b.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by another vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tdivide(v) {\r\n\r\n\t\t\tthis.x /= v.x;\r\n\t\t\tthis.y /= v.y;\r\n\t\t\tthis.z /= v.z;\r\n\t\t\tthis.w /= v.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by a given scalar.\r\n\t\t *\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tdivideScalar(s) {\r\n\r\n\t\t\tthis.x /= s;\r\n\t\t\tthis.y /= s;\r\n\t\t\tthis.z /= s;\r\n\t\t\tthis.w /= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a matrix to this vector.\r\n\t\t *\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tapplyMatrix4(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z, w = this.w;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;\r\n\t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;\r\n\t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;\r\n\t\t\tthis.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Negates this vector.\r\n\t\t *\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tnegate() {\r\n\r\n\t\t\tthis.x = -this.x;\r\n\t\t\tthis.y = -this.y;\r\n\t\t\tthis.z = -this.z;\r\n\t\t\tthis.w = -this.w;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the dot product with another vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Number} The dot product.\r\n\t\t */\r\n\r\n\t\tdot(v) {\r\n\r\n\t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Manhattan length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tmanhattanLength() {\r\n\r\n\t\t\treturn Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The squared length.\r\n\t\t */\r\n\r\n\t\tlengthSquared() {\r\n\r\n\t\t\treturn (\r\n\t\t\t\tthis.x * this.x +\r\n\t\t\t\tthis.y * this.y +\r\n\t\t\t\tthis.z * this.z +\r\n\t\t\t\tthis.w * this.w\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the length of this vector.\r\n\t\t *\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tlength() {\r\n\r\n\t\t\treturn Math.sqrt(\r\n\t\t\t\tthis.x * this.x +\r\n\t\t\t\tthis.y * this.y +\r\n\t\t\t\tthis.z * this.z +\r\n\t\t\t\tthis.w * this.w\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Manhattan distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tmanhattanDistanceTo(v) {\r\n\r\n\t\t\treturn (\r\n\t\t\t\tMath.abs(this.x - v.x) +\r\n\t\t\t\tMath.abs(this.y - v.y) +\r\n\t\t\t\tMath.abs(this.z - v.z) +\r\n\t\t\t\tMath.abs(this.w - v.w)\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Number} The squared distance.\r\n\t\t */\r\n\r\n\t\tdistanceToSquared(v) {\r\n\r\n\t\t\tconst dx = this.x - v.x;\r\n\t\t\tconst dy = this.y - v.y;\r\n\t\t\tconst dz = this.z - v.z;\r\n\t\t\tconst dw = this.w - v.w;\r\n\r\n\t\t\treturn dx * dx + dy * dy + dz * dz + dw * dw;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance to a given vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tdistanceTo(v) {\r\n\r\n\t\t\treturn Math.sqrt(this.distanceToSquared(v));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Normalizes this vector.\r\n\t\t *\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tnormalize() {\r\n\r\n\t\t\treturn this.divideScalar(this.length());\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the length of this vector.\r\n\t\t *\r\n\t\t * @param {Number} length - The new length.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tsetLength(length) {\r\n\r\n\t\t\treturn this.normalize().multiplyScalar(length);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the min value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tmin(v) {\r\n\r\n\t\t\tthis.x = Math.min(this.x, v.x);\r\n\t\t\tthis.y = Math.min(this.y, v.y);\r\n\t\t\tthis.z = Math.min(this.z, v.z);\r\n\t\t\tthis.w = Math.min(this.w, v.w);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the max value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tmax(v) {\r\n\r\n\t\t\tthis.x = Math.max(this.x, v.x);\r\n\t\t\tthis.y = Math.max(this.y, v.y);\r\n\t\t\tthis.z = Math.max(this.z, v.z);\r\n\t\t\tthis.w = Math.max(this.w, v.w);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clamps this vector.\r\n\t\t *\r\n\t\t * @param {Vector4} min - The lower bounds. Assumed to be smaller than max.\r\n\t\t * @param {Vector4} max - The upper bounds. Assumed to be greater than min.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tclamp(min, max) {\r\n\r\n\t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\r\n\t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\r\n\t\t\tthis.z = Math.max(min.z, Math.min(max.z, this.z));\r\n\t\t\tthis.w = Math.max(min.w, Math.min(max.w, this.w));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Floors this vector.\r\n\t\t *\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tfloor() {\r\n\r\n\t\t\tthis.x = Math.floor(this.x);\r\n\t\t\tthis.y = Math.floor(this.y);\r\n\t\t\tthis.z = Math.floor(this.z);\r\n\t\t\tthis.w = Math.floor(this.w);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Ceils this vector.\r\n\t\t *\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tceil() {\r\n\r\n\t\t\tthis.x = Math.ceil(this.x);\r\n\t\t\tthis.y = Math.ceil(this.y);\r\n\t\t\tthis.z = Math.ceil(this.z);\r\n\t\t\tthis.w = Math.ceil(this.w);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rounds this vector.\r\n\t\t *\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tround() {\r\n\r\n\t\t\tthis.x = Math.round(this.x);\r\n\t\t\tthis.y = Math.round(this.y);\r\n\t\t\tthis.z = Math.round(this.z);\r\n\t\t\tthis.w = Math.round(this.w);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Lerps towards the given vector.\r\n\t\t *\r\n\t\t * @param {Vector4} v - The target vector.\r\n\t\t * @param {Number} alpha - The lerp factor.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tlerp(v, alpha) {\r\n\r\n\t\t\tthis.x += (v.x - this.x) * alpha;\r\n\t\t\tthis.y += (v.y - this.y) * alpha;\r\n\t\t\tthis.z += (v.z - this.z) * alpha;\r\n\t\t\tthis.w += (v.w - this.w) * alpha;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the lerp result of the given vectors.\r\n\t\t *\r\n\t\t * @param {Vector4} v1 - A base vector.\r\n\t\t * @param {Vector4} v2 - The target vector.\r\n\t\t * @param {Number} alpha - The lerp factor.\r\n\t\t * @return {Vector4} This vector.\r\n\t\t */\r\n\r\n\t\tlerpVectors(v1, v2, alpha) {\r\n\r\n\t\t\treturn this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this vector equals the given one.\r\n\t\t *\r\n\t\t * @param {Vector4} v - A vector.\r\n\t\t * @return {Boolean} Whether this vector equals the given one.\r\n\t\t */\r\n\r\n\t\tequals(v) {\r\n\r\n\t\t\treturn (v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Mathematical data structures.\r\n\t *\r\n\t * @module math-ds\r\n\t */\n\n\t/**\r\n\t * A basic iterator result.\r\n\t *\r\n\t * The next method of an iterator always has to return an object with\r\n\t * appropriate properties including done and value.\r\n\t */\r\n\r\n\tclass IteratorResult {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new iterator result.\r\n\t\t *\r\n\t\t * @param {Vector3} [value=null] - A value.\r\n\t\t * @param {Vector3} [done=false] - Whether this result is past the end of the iterated sequence.\r\n\t\t */\r\n\r\n\t\tconstructor(value = null, done = false) {\r\n\r\n\t\t\t/**\r\n\t\t\t * An arbitrary value returned by the iterator.\r\n\t\t\t *\r\n\t\t\t * @type Object\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.value = value;\r\n\r\n\t\t\t/**\r\n\t\t\t * Whether this result is past the end of the iterated sequence.\r\n\t\t\t *\r\n\t\t\t * @type Boolean\r\n\t\t\t * @default false\r\n\t\t\t */\r\n\r\n\t\t\tthis.done = done;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Resets this iterator result.\r\n\t\t */\r\n\r\n\t\treset() {\r\n\r\n\t\t\tthis.value = null;\r\n\t\t\tthis.done = false;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A compilation of the library components.\r\n\t *\r\n\t * @module iterator-result\r\n\t */\n\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst c$1 = new Vector3();\r\n\r\n\t/**\r\n\t * An octant.\r\n\t */\r\n\r\n\tclass Octant {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new octant.\r\n\t\t *\r\n\t\t * @param {Vector3} [min] - The lower bounds.\r\n\t\t * @param {Vector3} [max] - The upper bounds.\r\n\t\t */\r\n\r\n\t\tconstructor(min = new Vector3(), max = new Vector3()) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The lower bounds of this octant.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = min;\r\n\r\n\t\t\t/**\r\n\t\t\t * The upper bounds of the octant.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.max = max;\r\n\r\n\t\t\t/**\r\n\t\t\t * The children of this octant.\r\n\t\t\t *\r\n\t\t\t * @type {Octant[]}\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.children = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the center of this octant.\r\n\t\t *\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} A vector that describes the center of this octant.\r\n\t\t */\r\n\r\n\t\tgetCenter(target = new Vector3()) {\r\n\r\n\t\t\treturn target.addVectors(this.min, this.max).multiplyScalar(0.5);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the size of this octant.\r\n\t\t *\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} A vector that describes the size of this octant.\r\n\t\t */\r\n\r\n\t\tgetDimensions(target = new Vector3()) {\r\n\r\n\t\t\treturn target.subVectors(this.max, this.min);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Splits this octant into eight smaller ones.\r\n\t\t */\r\n\r\n\t\tsplit() {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst max = this.max;\r\n\t\t\tconst mid = this.getCenter(c$1);\r\n\r\n\t\t\tconst children = this.children = [\r\n\r\n\t\t\t\tnull, null,\r\n\t\t\t\tnull, null,\r\n\t\t\t\tnull, null,\r\n\t\t\t\tnull, null\r\n\r\n\t\t\t];\r\n\r\n\t\t\tlet i, combination;\r\n\r\n\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\tcombination = pattern[i];\r\n\r\n\t\t\t\tchildren[i] = new this.constructor(\r\n\r\n\t\t\t\t\tnew Vector3(\r\n\t\t\t\t\t\t(combination[0] === 0) ? min.x : mid.x,\r\n\t\t\t\t\t\t(combination[1] === 0) ? min.y : mid.y,\r\n\t\t\t\t\t\t(combination[2] === 0) ? min.z : mid.z\r\n\t\t\t\t\t),\r\n\r\n\t\t\t\t\tnew Vector3(\r\n\t\t\t\t\t\t(combination[0] === 0) ? mid.x : max.x,\r\n\t\t\t\t\t\t(combination[1] === 0) ? mid.y : max.y,\r\n\t\t\t\t\t\t(combination[2] === 0) ? mid.z : max.z\r\n\t\t\t\t\t)\r\n\r\n\t\t\t\t);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A binary pattern that describes the standard octant layout:\r\n\t *\r\n\t * ```text\r\n\t *    3____7\r\n\t *  2/___6/|\r\n\t *  | 1__|_5\r\n\t *  0/___4/\r\n\t * ```\r\n\t *\r\n\t * This common layout is crucial for positional assumptions.\r\n\t *\r\n\t * @type {Uint8Array[]}\r\n\t */\r\n\r\n\tconst pattern = [\r\n\r\n\t\tnew Uint8Array([0, 0, 0]),\r\n\t\tnew Uint8Array([0, 0, 1]),\r\n\t\tnew Uint8Array([0, 1, 0]),\r\n\t\tnew Uint8Array([0, 1, 1]),\r\n\r\n\t\tnew Uint8Array([1, 0, 0]),\r\n\t\tnew Uint8Array([1, 0, 1]),\r\n\t\tnew Uint8Array([1, 1, 0]),\r\n\t\tnew Uint8Array([1, 1, 1])\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * Describes all possible octant corner connections.\r\n\t *\r\n\t * @type {Uint8Array[]}\r\n\t */\r\n\r\n\tconst edges = [\r\n\r\n\t\t// X-Axis.\r\n\t\tnew Uint8Array([0, 4]),\r\n\t\tnew Uint8Array([1, 5]),\r\n\t\tnew Uint8Array([2, 6]),\r\n\t\tnew Uint8Array([3, 7]),\r\n\r\n\t\t// Y-Axis.\r\n\t\tnew Uint8Array([0, 2]),\r\n\t\tnew Uint8Array([1, 3]),\r\n\t\tnew Uint8Array([4, 6]),\r\n\t\tnew Uint8Array([5, 7]),\r\n\r\n\t\t// Z-Axis.\r\n\t\tnew Uint8Array([0, 1]),\r\n\t\tnew Uint8Array([2, 3]),\r\n\t\tnew Uint8Array([4, 5]),\r\n\t\tnew Uint8Array([6, 7])\r\n\r\n\t];\n\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst c$2 = new Vector3();\r\n\r\n\t/**\r\n\t * A cubic octant.\r\n\t */\r\n\r\n\tclass CubicOctant {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new cubic octant.\r\n\t\t *\r\n\t\t * @param {Vector3} [min] - The lower bounds.\r\n\t\t * @param {Number} [size=0] - The size of the octant.\r\n\t\t */\r\n\r\n\t\tconstructor(min = new Vector3(), size = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The lower bounds of this octant.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = min;\r\n\r\n\t\t\t/**\r\n\t\t\t * The size of this octant.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.size = size;\r\n\r\n\t\t\t/**\r\n\t\t\t * The children of this octant.\r\n\t\t\t *\r\n\t\t\t * @type {CubicOctant[]}\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.children = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The upper bounds of this octant.\r\n\t\t *\r\n\t\t * Accessing this property always creates a new vector.\r\n\t\t *\r\n\t\t * @type {Vector3}\r\n\t\t */\r\n\r\n\t\tget max() { return this.min.clone().addScalar(this.size); }\r\n\r\n\t\t/**\r\n\t\t * Computes the center of this octant.\r\n\t\t *\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} A vector that describes the center of this octant.\r\n\t\t */\r\n\r\n\t\tgetCenter(target = new Vector3()) {\r\n\r\n\t\t\treturn target.copy(this.min).addScalar(this.size * 0.5);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns the size of this octant as a vector.\r\n\t\t *\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} A vector that describes the size of this octant.\r\n\t\t */\r\n\r\n\t\tgetDimensions(target = new Vector3()) {\r\n\r\n\t\t\treturn target.set(this.size, this.size, this.size);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Splits this octant into eight smaller ones.\r\n\t\t */\r\n\r\n\t\tsplit() {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst mid = this.getCenter(c$2);\r\n\t\t\tconst halfSize = this.size * 0.5;\r\n\r\n\t\t\tconst children = this.children = [\r\n\r\n\t\t\t\tnull, null,\r\n\t\t\t\tnull, null,\r\n\t\t\t\tnull, null,\r\n\t\t\t\tnull, null\r\n\r\n\t\t\t];\r\n\r\n\t\t\tlet i, combination;\r\n\r\n\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\tcombination = pattern[i];\r\n\r\n\t\t\t\tchildren[i] = new this.constructor(\r\n\r\n\t\t\t\t\tnew Vector3(\r\n\t\t\t\t\t\t(combination[0] === 0) ? min.x : mid.x,\r\n\t\t\t\t\t\t(combination[1] === 0) ? min.y : mid.y,\r\n\t\t\t\t\t\t(combination[2] === 0) ? min.z : mid.z\r\n\t\t\t\t\t),\r\n\r\n\t\t\t\t\thalfSize\r\n\r\n\t\t\t\t);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A 3D box.\r\n\t *\r\n\t * @type {Box3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst b$3 = new Box3();\r\n\r\n\t/**\r\n\t * An octant iterator.\r\n\t *\r\n\t * @implements {Iterator}\r\n\t * @implements {Iterable}\r\n\t */\r\n\r\n\tclass OctantIterator {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new octant iterator.\r\n\t\t *\r\n\t\t * @param {Octree} octree - An octree.\r\n\t\t * @param {Frustum|Box3} [region=null] - A cull region.\r\n\t\t */\r\n\r\n\t\tconstructor(octree, region = null) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The octree.\r\n\t\t\t *\r\n\t\t\t * @type {Octree}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.octree = octree;\r\n\r\n\t\t\t/**\r\n\t\t\t * A region used for octree culling.\r\n\t\t\t *\r\n\t\t\t * @type {Frustum|Box3}\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.region = region;\r\n\r\n\t\t\t/**\r\n\t\t\t * Whether this iterator should respect the cull region.\r\n\t\t\t *\r\n\t\t\t * @type {Boolean}\r\n\t\t\t * @default false\r\n\t\t\t */\r\n\r\n\t\t\tthis.cull = (region !== null);\r\n\r\n\t\t\t/**\r\n\t\t\t * An iterator result.\r\n\t\t\t *\r\n\t\t\t * @type {IteratorResult}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.result = new IteratorResult();\r\n\r\n\t\t\t/**\r\n\t\t\t * An octant trace.\r\n\t\t\t *\r\n\t\t\t * @type {Octant[]}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.trace = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * Iteration indices.\r\n\t\t\t *\r\n\t\t\t * @type {Number[]}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.indices = null;\r\n\r\n\t\t\tthis.reset();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Resets this iterator.\r\n\t\t *\r\n\t\t * @return {OctantIterator} This iterator.\r\n\t\t */\r\n\r\n\t\treset() {\r\n\r\n\t\t\tconst root = this.octree.root;\r\n\r\n\t\t\tthis.trace = [];\r\n\t\t\tthis.indices = [];\r\n\r\n\t\t\tif(root !== null) {\r\n\r\n\t\t\t\tb$3.min = root.min;\r\n\t\t\t\tb$3.max = root.max;\r\n\r\n\t\t\t\tif(!this.cull || this.region.intersectsBox(b$3)) {\r\n\r\n\t\t\t\t\tthis.trace.push(root);\r\n\t\t\t\t\tthis.indices.push(0);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.result.reset();\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Iterates over the leaf octants.\r\n\t\t *\r\n\t\t * @return {IteratorResult} The next leaf octant.\r\n\t\t */\r\n\r\n\t\tnext() {\r\n\r\n\t\t\tconst cull = this.cull;\r\n\t\t\tconst region = this.region;\r\n\t\t\tconst indices = this.indices;\r\n\t\t\tconst trace = this.trace;\r\n\r\n\t\t\tlet octant = null;\r\n\t\t\tlet depth = trace.length - 1;\r\n\r\n\t\t\tlet index, children, child;\r\n\r\n\t\t\twhile(octant === null && depth >= 0) {\r\n\r\n\t\t\t\tindex = indices[depth];\r\n\t\t\t\tchildren = trace[depth].children;\r\n\r\n\t\t\t\t++indices[depth];\r\n\r\n\t\t\t\tif(index < 8) {\r\n\r\n\t\t\t\t\tif(children !== null) {\r\n\r\n\t\t\t\t\t\tchild = children[index];\r\n\r\n\t\t\t\t\t\tif(cull) {\r\n\r\n\t\t\t\t\t\t\tb$3.min = child.min;\r\n\t\t\t\t\t\t\tb$3.max = child.max;\r\n\r\n\t\t\t\t\t\t\tif(!region.intersectsBox(b$3)) {\r\n\r\n\t\t\t\t\t\t\t\t// Cull this octant.\r\n\t\t\t\t\t\t\t\tcontinue;\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\ttrace.push(child);\r\n\t\t\t\t\t\tindices.push(0);\r\n\r\n\t\t\t\t\t\t++depth;\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\toctant = trace.pop();\r\n\t\t\t\t\t\tindices.pop();\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\ttrace.pop();\r\n\t\t\t\t\tindices.pop();\r\n\r\n\t\t\t\t\t--depth;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.result.value = octant;\r\n\t\t\tthis.result.done = (octant === null);\r\n\r\n\t\t\treturn this.result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Called when this iterator will no longer be run to completion.\r\n\t\t *\r\n\t\t * @param {Object} value - An interator result value.\r\n\t\t * @return {IteratorResult} - A premature completion result.\r\n\t\t */\r\n\r\n\t\treturn(value) {\r\n\r\n\t\t\tthis.result.value = value;\r\n\t\t\tthis.result.done = true;\r\n\r\n\t\t\treturn this.result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns this iterator.\r\n\t\t *\r\n\t\t * @return {OctantIterator} An iterator.\r\n\t\t */\r\n\r\n\t\t[Symbol.iterator]() {\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A list of vectors.\r\n\t *\r\n\t * @type {Vector3[]}\r\n\t * @private\r\n\t * @final\r\n\t */\r\n\r\n\tconst v$4 = [\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3(),\r\n\t\tnew Vector3()\r\n\t];\r\n\r\n\t/**\r\n\t * A box.\r\n\t *\r\n\t * @type {Box3}\r\n\t * @private\r\n\t * @final\r\n\t */\r\n\r\n\tconst b$4 = new Box3();\r\n\r\n\t/**\r\n\t * A ray.\r\n\t *\r\n\t * @type {Ray}\r\n\t * @private\r\n\t * @final\r\n\t */\r\n\r\n\tconst r = new Ray();\r\n\r\n\t/**\r\n\t * A lookup-table containing octant ids. Used to determine the exit plane from\r\n\t * an octant.\r\n\t *\r\n\t * @type {Uint8Array[]}\r\n\t * @private\r\n\t * @final\r\n\t */\r\n\r\n\tconst octantTable = [\r\n\r\n\t\tnew Uint8Array([4, 2, 1]),\r\n\t\tnew Uint8Array([5, 3, 8]),\r\n\t\tnew Uint8Array([6, 8, 3]),\r\n\t\tnew Uint8Array([7, 8, 8]),\r\n\t\tnew Uint8Array([8, 6, 5]),\r\n\t\tnew Uint8Array([8, 7, 8]),\r\n\t\tnew Uint8Array([8, 8, 7]),\r\n\t\tnew Uint8Array([8, 8, 8])\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * A byte that stores raycasting flags.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tlet flags = 0;\r\n\r\n\t/**\r\n\t * Finds the entry plane of the first octant that a ray travels through.\r\n\t *\r\n\t * Determining the first octant requires knowing which of the t0s is the\r\n\t * largest. The tms of the other axes must also be compared against that\r\n\t * largest t0.\r\n\t *\r\n\t * @private\r\n\t * @param {Number} tx0 - Ray projection parameter.\r\n\t * @param {Number} ty0 - Ray projection parameter.\r\n\t * @param {Number} tz0 - Ray projection parameter.\r\n\t * @param {Number} txm - Ray projection parameter mean.\r\n\t * @param {Number} tym - Ray projection parameter mean.\r\n\t * @param {Number} tzm - Ray projection parameter mean.\r\n\t * @return {Number} The index of the first octant that the ray travels through.\r\n\t */\r\n\r\n\tfunction findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {\r\n\r\n\t\tlet entry = 0;\r\n\r\n\t\t// Find the entry plane.\r\n\t\tif(tx0 > ty0 && tx0 > tz0) {\r\n\r\n\t\t\t// YZ-plane.\r\n\t\t\tif(tym < tx0) { entry |= 2; }\r\n\t\t\tif(tzm < tx0) { entry |= 1; }\r\n\r\n\t\t} else if(ty0 > tz0) {\r\n\r\n\t\t\t// XZ-plane.\r\n\t\t\tif(txm < ty0) { entry |= 4; }\r\n\t\t\tif(tzm < ty0) { entry |= 1; }\r\n\r\n\t\t} else {\r\n\r\n\t\t\t// XY-plane.\r\n\t\t\tif(txm < tz0) { entry |= 4; }\r\n\t\t\tif(tym < tz0) { entry |= 2; }\r\n\r\n\t\t}\r\n\r\n\t\treturn entry;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Finds the next octant that intersects with the ray based on the exit plane of\r\n\t * the current one.\r\n\t *\r\n\t * @private\r\n\t * @param {Number} currentOctant - The index of the current octant.\r\n\t * @param {Number} tx1 - Ray projection parameter.\r\n\t * @param {Number} ty1 - Ray projection parameter.\r\n\t * @param {Number} tz1 - Ray projection parameter.\r\n\t * @return {Number} The index of the next octant that the ray travels through.\r\n\t */\r\n\r\n\tfunction findNextOctant(currentOctant, tx1, ty1, tz1) {\r\n\r\n\t\tlet min;\r\n\t\tlet exit = 0;\r\n\r\n\t\t// Find the exit plane.\r\n\t\tif(tx1 < ty1) {\r\n\r\n\t\t\tmin = tx1;\r\n\t\t\texit = 0; // YZ-plane.\r\n\r\n\t\t} else {\r\n\r\n\t\t\tmin = ty1;\r\n\t\t\texit = 1; // XZ-plane.\r\n\r\n\t\t}\r\n\r\n\t\tif(tz1 < min) {\r\n\r\n\t\t\texit = 2; // XY-plane.\r\n\r\n\t\t}\r\n\r\n\t\treturn octantTable[currentOctant][exit];\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Finds all octants that intersect with the given ray.\r\n\t *\r\n\t * @private\r\n\t * @param {Octant} octant - The current octant.\r\n\t * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.\r\n\t * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.\r\n\t * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.\r\n\t * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.\r\n\t * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.\r\n\t * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.\r\n\t * @param {Raycaster} raycaster - The raycaster.\r\n\t * @param {Array} intersects - An array to be filled with the intersecting octants.\r\n\t */\r\n\r\n\tfunction raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {\r\n\r\n\t\tconst children = octant.children;\r\n\r\n\t\tlet currentOctant;\r\n\t\tlet txm, tym, tzm;\r\n\r\n\t\tif(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {\r\n\r\n\t\t\tif(children === null) {\r\n\r\n\t\t\t\t// Leaf.\r\n\t\t\t\tintersects.push(octant);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\t// Compute means.\r\n\t\t\t\ttxm = 0.5 * (tx0 + tx1);\r\n\t\t\t\ttym = 0.5 * (ty0 + ty1);\r\n\t\t\t\ttzm = 0.5 * (tz0 + tz1);\r\n\r\n\t\t\t\tcurrentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);\r\n\r\n\t\t\t\tdo {\r\n\r\n\t\t\t\t\t/* The possibilities for the next node are passed in the same respective\r\n\t\t\t\t\t * order as the t-values. Hence, if the first value is found to be the\r\n\t\t\t\t\t * greatest, the fourth one will be returned. If the second value is the\r\n\t\t\t\t\t * greatest, the fifth one will be returned, etc.\r\n\t\t\t\t\t */\r\n\r\n\t\t\t\t\tswitch(currentOctant) {\r\n\r\n\t\t\t\t\t\tcase 0:\r\n\t\t\t\t\t\t\traycastOctant(children[flags], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, tym, tzm);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 1:\r\n\t\t\t\t\t\t\traycastOctant(children[flags ^ 1], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, tym, tz1);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 2:\r\n\t\t\t\t\t\t\traycastOctant(children[flags ^ 2], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, ty1, tzm);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 3:\r\n\t\t\t\t\t\t\traycastOctant(children[flags ^ 3], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, ty1, tz1);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 4:\r\n\t\t\t\t\t\t\traycastOctant(children[flags ^ 4], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, tym, tzm);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 5:\r\n\t\t\t\t\t\t\traycastOctant(children[flags ^ 5], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, tym, tz1);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 6:\r\n\t\t\t\t\t\t\traycastOctant(children[flags ^ 6], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 7:\r\n\t\t\t\t\t\t\traycastOctant(children[flags ^ 7], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);\r\n\t\t\t\t\t\t\t// Far top right octant. No other octants can be reached from here.\r\n\t\t\t\t\t\t\tcurrentOctant = 8;\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t} while(currentOctant < 8);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * An octree raycaster.\r\n\t *\r\n\t * Based on:\r\n\t *  \"An Efficient Parametric Algorithm for Octree Traversal\"\r\n\t *  by J. Revelles et al. (2000).\r\n\t */\r\n\r\n\tclass OctreeRaycaster {\r\n\r\n\t\t/**\r\n\t\t * Finds the octants that intersect with the given ray. The intersecting\r\n\t\t * octants are sorted by distance, closest first.\r\n\t\t *\r\n\t\t * @param {Octree} octree - An octree.\r\n\t\t * @param {Raycaster} raycaster - A raycaster.\r\n\t\t * @param {Array} intersects - A list to be filled with intersecting octants.\r\n\t\t */\r\n\r\n\t\tstatic intersectOctree(octree, raycaster, intersects) {\r\n\r\n\t\t\t// Translate the octree extents to the scene origin.\r\n\t\t\tconst min = b$4.min.set(0, 0, 0);\r\n\t\t\tconst max = b$4.max.subVectors(octree.max, octree.min);\r\n\r\n\t\t\tconst dimensions = octree.getDimensions(v$4[0]);\r\n\t\t\tconst halfDimensions = v$4[1].copy(dimensions).multiplyScalar(0.5);\r\n\r\n\t\t\tconst origin = r.origin.copy(raycaster.ray.origin);\r\n\t\t\tconst direction = r.direction.copy(raycaster.ray.direction);\r\n\r\n\t\t\tlet invDirX, invDirY, invDirZ;\r\n\t\t\tlet tx0, tx1, ty0, ty1, tz0, tz1;\r\n\r\n\t\t\t// Translate the ray to the center of the octree.\r\n\t\t\torigin.sub(octree.getCenter(v$4[2])).add(halfDimensions);\r\n\r\n\t\t\t// Reset all flags.\r\n\t\t\tflags = 0;\r\n\r\n\t\t\t// Handle rays with negative directions.\r\n\t\t\tif(direction.x < 0.0) {\r\n\r\n\t\t\t\torigin.x = dimensions.x - origin.x;\r\n\t\t\t\tdirection.x = -direction.x;\r\n\t\t\t\tflags |= 4;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(direction.y < 0.0) {\r\n\r\n\t\t\t\torigin.y = dimensions.y - origin.y;\r\n\t\t\t\tdirection.y = -direction.y;\r\n\t\t\t\tflags |= 2;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(direction.z < 0.0) {\r\n\r\n\t\t\t\torigin.z = dimensions.z - origin.z;\r\n\t\t\t\tdirection.z = -direction.z;\r\n\t\t\t\tflags |= 1;\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Improve IEEE double stability.\r\n\t\t\tinvDirX = 1.0 / direction.x;\r\n\t\t\tinvDirY = 1.0 / direction.y;\r\n\t\t\tinvDirZ = 1.0 / direction.z;\r\n\r\n\t\t\t// Project the ray to the root's boundaries.\r\n\t\t\ttx0 = (min.x - origin.x) * invDirX;\r\n\t\t\ttx1 = (max.x - origin.x) * invDirX;\r\n\t\t\tty0 = (min.y - origin.y) * invDirY;\r\n\t\t\tty1 = (max.y - origin.y) * invDirY;\r\n\t\t\ttz0 = (min.z - origin.z) * invDirZ;\r\n\t\t\ttz1 = (max.z - origin.z) * invDirZ;\r\n\r\n\t\t\t// Check if the ray hits the octree.\r\n\t\t\tif(Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {\r\n\r\n\t\t\t\t// Find the intersecting octants.\r\n\t\t\t\traycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A 3D box.\r\n\t *\r\n\t * @type {Box3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst b$5 = new Box3();\r\n\r\n\t/**\r\n\t * Recursively calculates the depth of the given octree.\r\n\t *\r\n\t * @private\r\n\t * @param {Octant} octant - An octant.\r\n\t * @return {Number} The depth.\r\n\t */\r\n\r\n\tfunction getDepth(octant) {\r\n\r\n\t\tconst children = octant.children;\r\n\r\n\t\tlet result = 0;\r\n\t\tlet i, l, d;\r\n\r\n\t\tif(children !== null) {\r\n\r\n\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\td = 1 + getDepth(children[i]);\r\n\r\n\t\t\t\tif(d > result) {\r\n\r\n\t\t\t\t\tresult = d;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\treturn result;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Recursively collects octants that lie inside the specified region.\r\n\t *\r\n\t * @private\r\n\t * @param {Octant} octant - An octant.\r\n\t * @param {Frustum|Box3} region - A region.\r\n\t * @param {Octant[]} result - A list to be filled with octants that intersect with the region.\r\n\t */\r\n\r\n\tfunction cull(octant, region, result) {\r\n\r\n\t\tconst children = octant.children;\r\n\r\n\t\tlet i, l;\r\n\r\n\t\tb$5.min = octant.min;\r\n\t\tb$5.max = octant.max;\r\n\r\n\t\tif(region.intersectsBox(b$5)) {\r\n\r\n\t\t\tif(children !== null) {\r\n\r\n\t\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\t\tcull(children[i], region, result);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tresult.push(octant);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Recursively fetches all octants with the specified depth level.\r\n\t *\r\n\t * @private\r\n\t * @param {Octant} octant - An octant.\r\n\t * @param {Number} level - The target depth level.\r\n\t * @param {Number} depth - The current depth level.\r\n\t * @param {Octant[]} result - A list to be filled with the identified octants.\r\n\t */\r\n\r\n\tfunction findOctantsByLevel(octant, level, depth, result) {\r\n\r\n\t\tconst children = octant.children;\r\n\r\n\t\tlet i, l;\r\n\r\n\t\tif(depth === level) {\r\n\r\n\t\t\tresult.push(octant);\r\n\r\n\t\t} else if(children !== null) {\r\n\r\n\t\t\t++depth;\r\n\r\n\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\tfindOctantsByLevel(children[i], level, depth, result);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * An octree that subdivides space for fast spatial searches.\r\n\t *\r\n\t * @implements {Iterable}\r\n\t */\r\n\r\n\tclass Octree {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new octree.\r\n\t\t *\r\n\t\t * @param {Vector3} [min] - The lower bounds of the tree. If not provided, the octree will not create a root node.\r\n\t\t * @param {Vector3} [max] - The upper bounds of the tree. If not provided, the octree will not create a root node.\r\n\t\t */\r\n\r\n\t\tconstructor(min, max) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The root octant.\r\n\t\t\t *\r\n\t\t\t * @type {Octant}\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.root = (min !== undefined && max !== undefined) ? new Octant(min, max) : null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The lower bounds of the root octant.\r\n\t\t *\r\n\t\t * @type {Vector3}\r\n\t\t */\r\n\r\n\t\tget min() { return this.root.min; }\r\n\r\n\t\t/**\r\n\t\t * The upper bounds of the root octant.\r\n\t\t *\r\n\t\t * @type {Vector3}\r\n\t\t */\r\n\r\n\t\tget max() { return this.root.max; }\r\n\r\n\t\t/**\r\n\t\t * The children of the root octant.\r\n\t\t *\r\n\t\t * @type {Octant[]}\r\n\t\t */\r\n\r\n\t\tget children() { return this.root.children; }\r\n\r\n\t\t/**\r\n\t\t * Calculates the center of this octree.\r\n\t\t *\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} A vector that describes the center of this octree.\r\n\t\t */\r\n\r\n\t\tgetCenter(target) { return this.root.getCenter(target); }\r\n\r\n\t\t/**\r\n\t\t * Calculates the size of this octree.\r\n\t\t *\r\n\t\t * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.\r\n\t\t * @return {Vector3} A vector that describes the size of this octree.\r\n\t\t */\r\n\r\n\t\tgetDimensions(target) { return this.root.getDimensions(target); }\r\n\r\n\t\t/**\r\n\t\t * Calculates the current depth of this octree.\r\n\t\t *\r\n\t\t * @return {Number} The depth.\r\n\t\t */\r\n\r\n\t\tgetDepth() { return getDepth(this.root); }\r\n\r\n\t\t/**\r\n\t\t * Recursively collects octants that intersect with the specified region.\r\n\t\t *\r\n\t\t * @param {Frustum|Box3} region - A region.\r\n\t\t * @return {Octant[]} The octants.\r\n\t\t */\r\n\r\n\t\tcull(region) {\r\n\r\n\t\t\tconst result = [];\r\n\r\n\t\t\tcull(this.root, region, result);\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Fetches all octants with the specified depth level.\r\n\t\t *\r\n\t\t * @param {Number} level - The depth level.\r\n\t\t * @return {Octant[]} The octants.\r\n\t\t */\r\n\r\n\t\tfindOctantsByLevel(level) {\r\n\r\n\t\t\tconst result = [];\r\n\r\n\t\t\tfindOctantsByLevel(this.root, level, 0, result);\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds the octants that intersect with the given ray. The intersecting\r\n\t\t * octants are sorted by distance, closest first.\r\n\t\t *\r\n\t\t * @param {Raycaster} raycaster - A raycaster.\r\n\t\t * @param {Octant[]} [intersects] - An optional target list to be filled with the intersecting octants.\r\n\t\t * @return {Octant[]} The intersecting octants.\r\n\t\t */\r\n\r\n\t\traycast(raycaster, intersects = []) {\r\n\r\n\t\t\tOctreeRaycaster.intersectOctree(this, raycaster, intersects);\r\n\r\n\t\t\treturn intersects;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns an iterator that traverses the octree and returns leaf nodes.\r\n\t\t *\r\n\t\t * When a cull region is provided, the iterator will only return leaves that\r\n\t\t * intersect with that region.\r\n\t\t *\r\n\t\t * @param {Frustum|Box3} [region] - A cull region.\r\n\t\t * @return {OctantIterator} An iterator.\r\n\t\t */\r\n\r\n\t\tleaves(region) {\r\n\r\n\t\t\treturn new OctantIterator(this, region);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns an iterator that traverses the octree and returns all leaf nodes.\r\n\t\t *\r\n\t\t * @return {OctantIterator} An iterator.\r\n\t\t */\r\n\r\n\t\t[Symbol.iterator]() {\r\n\r\n\t\t\treturn new OctantIterator(this);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Core components.\r\n\t *\r\n\t * @module sparse-octree/core\r\n\t */\n\n\t/**\r\n\t * An octant that maintains points.\r\n\t */\n\n\t/**\r\n\t * A collection of ray-point intersection data.\r\n\t */\n\n\t/**\r\n\t * An octree that manages points.\r\n\t */\n\n\t/**\r\n\t * Point-oriented octree components.\r\n\t *\r\n\t * @module sparse-octree/points\r\n\t */\n\n\t/**\r\n\t * A collection of octree utility functions.\r\n\t */\n\n\t/**\r\n\t * Octree utilities.\r\n\t *\r\n\t * @module sparse-octree/utils\r\n\t */\n\n\t/**\r\n\t * Exposure of the library components.\r\n\t *\r\n\t * @module sparse-octree\r\n\t */\n\n\t/**\r\n\t * An isovalue bias for the Zero Crossing approximation.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tconst ISOVALUE_BIAS = 1e-4;\r\n\r\n\t/**\r\n\t * An error threshold for the Zero Crossing approximation.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tconst INTERVAL_THRESHOLD = 1e-6;\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst ab = new Vector3();\r\n\r\n\t/**\r\n\t * A point.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst p$1 = new Vector3();\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst v$6 = new Vector3();\r\n\r\n\t/**\r\n\t * An edge between two material grid points.\r\n\t */\r\n\r\n\tclass Edge {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new edge.\r\n\t\t *\r\n\t\t * @param {Vector3} [a] - A starting point. If none is provided, a new vector will be created.\r\n\t\t * @param {Vector3} [b] - An ending point. If none is provided, a new vector will be created.\r\n\t\t */\r\n\r\n\t\tconstructor(a = new Vector3(), b = new Vector3()) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The starting point of the edge.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.a = a;\r\n\r\n\t\t\t/**\r\n\t\t\t * The ending point of the edge.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.b = b;\r\n\r\n\t\t\t/**\r\n\t\t\t * The index of the starting material grid point.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.index = -1;\r\n\r\n\t\t\t/**\r\n\t\t\t * The local grid coordinates of the starting point.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.coordinates = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * The Zero Crossing interpolation value.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.t = 0.0;\r\n\r\n\t\t\t/**\r\n\t\t\t * The surface normal at the Zero Crossing position.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.n = new Vector3();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Approximates the smallest density along the edge.\r\n\t\t *\r\n\t\t * @param {SignedDistanceFunction} sdf - A density field.\r\n\t\t * @param {Number} [steps=8] - The maximum number of interpolation steps. Cannot be smaller than 2.\r\n\t\t */\r\n\r\n\t\tapproximateZeroCrossing(sdf, steps = 8) {\r\n\r\n\t\t\tconst s = Math.max(1, steps - 1);\r\n\r\n\t\t\tlet a = 0.0;\r\n\t\t\tlet b = 1.0;\r\n\t\t\tlet c = 0.0;\r\n\t\t\tlet i = 0;\r\n\r\n\t\t\tlet densityA, densityC;\r\n\r\n\t\t\t// Compute the vector from a to b.\r\n\t\t\tab.subVectors(this.b, this.a);\r\n\r\n\t\t\t// Use bisection to find the root of the SDF.\r\n\t\t\twhile(i <= s) {\r\n\r\n\t\t\t\tc = (a + b) / 2;\r\n\r\n\t\t\t\tp$1.addVectors(this.a, v$6.copy(ab).multiplyScalar(c));\r\n\t\t\t\tdensityC = sdf.sample(p$1);\r\n\r\n\t\t\t\tif(Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {\r\n\r\n\t\t\t\t\t// Solution found.\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tp$1.addVectors(this.a, v$6.copy(ab).multiplyScalar(a));\r\n\t\t\t\t\tdensityA = sdf.sample(p$1);\r\n\r\n\t\t\t\t\tif(Math.sign(densityC) === Math.sign(densityA)) {\r\n\r\n\t\t\t\t\t\ta = c;\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\tb = c;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\t++i;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.t = c;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Zero Crossing position.\r\n\t\t *\r\n\t\t * @param {Vector3} target - A target for the Zero Crossing position. If none is provided, a new vector will be created.\r\n\t\t * @return {Vector3} The Zero Crossing position.\r\n\t\t */\r\n\r\n\t\tcomputeZeroCrossingPosition(target = new Vector3()) {\r\n\r\n\t\t\treturn target.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the normal of the surface at the edge intersection.\r\n\t\t *\r\n\t\t * @param {SignedDistanceFunction} sdf - A density field.\r\n\t\t * @return {Vector3} The normal.\r\n\t\t * @todo Use analytical derivation instead of finite differences.\r\n\t\t */\r\n\r\n\t\tcomputeSurfaceNormal(sdf) {\r\n\r\n\t\t\tconst position = this.computeZeroCrossingPosition(ab);\r\n\t\t\tconst E = 1e-3;\r\n\r\n\t\t\tconst dx = sdf.sample(p$1.addVectors(position, v$6.set(E, 0, 0))) - sdf.sample(p$1.subVectors(position, v$6.set(E, 0, 0)));\r\n\t\t\tconst dy = sdf.sample(p$1.addVectors(position, v$6.set(0, E, 0))) - sdf.sample(p$1.subVectors(position, v$6.set(0, E, 0)));\r\n\t\t\tconst dz = sdf.sample(p$1.addVectors(position, v$6.set(0, 0, E))) - sdf.sample(p$1.subVectors(position, v$6.set(0, 0, E)));\r\n\r\n\t\t\tthis.n.set(dx, dy, dz).normalize();\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An edge.\r\n\t *\r\n\t * @type {Edge}\r\n\t * @private\r\n\t */\r\n\r\n\tconst edge = new Edge();\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst offsetA = new Vector3();\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst offsetB = new Vector3();\r\n\r\n\t/**\r\n\t * An edge iterator.\r\n\t *\r\n\t * @implements {Iterator}\r\n\t * @implements {Iterable}\r\n\t */\r\n\r\n\tclass EdgeIterator {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new edge iterator.\r\n\t\t *\r\n\t\t * @param {EdgeData} edgeData - A set of edge data.\r\n\t\t * @param {Vector3} cellPosition - The position of the data cell.\r\n\t\t * @param {Number} cellSize - The size of the data cell.\r\n\t\t * @param {Number} [c=0] - The dimension index to start at.\r\n\t\t * @param {Number} [d=3] - The dimension limit.\r\n\t\t */\r\n\r\n\t\tconstructor(edgeData, cellPosition, cellSize, c = 0, d = 3) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The edge data.\r\n\t\t\t *\r\n\t\t\t * @type {EdgeData}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.edgeData = edgeData;\r\n\r\n\t\t\t/**\r\n\t\t\t * The data cell position.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.cellPosition = cellPosition;\r\n\r\n\t\t\t/**\r\n\t\t\t * The data cell size.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.cellSize = cellSize;\r\n\r\n\t\t\t/**\r\n\t\t\t * The edges.\r\n\t\t\t *\r\n\t\t\t * @type {Uint32Array[]}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.indices = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Zero Crossings.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array[]}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.zeroCrossings = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The intersection normals.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array[]}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.normals = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The axes of the existing edges.\r\n\t\t\t *\r\n\t\t\t * @type {Uint8Array[]}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.axes = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The amount of edges for each internal set of edges (X -> Y -> Z).\r\n\t\t\t *\r\n\t\t\t * @type {Number[]}\r\n\t\t\t */\r\n\r\n\t\t\tthis.lengths = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * An iterator result.\r\n\t\t\t *\r\n\t\t\t * @type {IteratorResult}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.result = new IteratorResult();\r\n\r\n\t\t\t/**\r\n\t\t\t * The initial dimension index.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.initialC = c;\r\n\r\n\t\t\t/**\r\n\t\t\t * The current dimension index.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.c = c;\r\n\r\n\t\t\t/**\r\n\t\t\t * The initial dimension limit.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.initialD = d;\r\n\r\n\t\t\t/**\r\n\t\t\t * The dimension limit.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.d = d;\r\n\r\n\t\t\t/**\r\n\t\t\t * The current iteration index.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.i = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * The current iteration limit.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.l = 0;\r\n\r\n\t\t\tthis.reset();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Resets this iterator.\r\n\t\t *\r\n\t\t * @return {EdgeIterator} This iterator.\r\n\t\t */\r\n\r\n\t\treset() {\r\n\r\n\t\t\tconst edgeData = this.edgeData;\r\n\t\t\tconst indices = [];\r\n\t\t\tconst zeroCrossings = [];\r\n\t\t\tconst normals = [];\r\n\t\t\tconst axes = [];\r\n\t\t\tconst lengths = [];\r\n\r\n\t\t\tlet a, c, d, l;\r\n\r\n\t\t\tthis.i = 0;\r\n\t\t\tthis.c = 0;\r\n\t\t\tthis.d = 0;\r\n\r\n\t\t\t// Create a collection of edges without empty arrays.\r\n\t\t\tfor(c = this.initialC, a = 4 >> c, d = this.initialD; c < d; ++c, a >>= 1) {\r\n\r\n\t\t\t\tl = edgeData.indices[c].length;\r\n\r\n\t\t\t\tif(l > 0) {\r\n\r\n\t\t\t\t\tindices.push(edgeData.indices[c]);\r\n\t\t\t\t\tzeroCrossings.push(edgeData.zeroCrossings[c]);\r\n\t\t\t\t\tnormals.push(edgeData.normals[c]);\r\n\t\t\t\t\taxes.push(pattern[a]);\r\n\t\t\t\t\tlengths.push(l);\r\n\r\n\t\t\t\t\t++this.d;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.l = (lengths.length > 0) ? lengths[0] : 0;\r\n\r\n\t\t\tthis.indices = indices;\r\n\t\t\tthis.zeroCrossings = zeroCrossings;\r\n\t\t\tthis.normals = normals;\r\n\t\t\tthis.axes = axes;\r\n\t\t\tthis.lengths = lengths;\r\n\r\n\t\t\tthis.result.reset();\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Iterates over the edges.\r\n\t\t *\r\n\t\t * @return {IteratorResult} The next edge.\r\n\t\t */\r\n\r\n\t\tnext() {\r\n\r\n\t\t\tconst s = this.cellSize;\r\n\t\t\tconst n = HermiteData.resolution;\r\n\t\t\tconst m = n + 1;\r\n\t\t\tconst mm = m * m;\r\n\r\n\t\t\tconst result = this.result;\r\n\t\t\tconst base = this.cellPosition;\r\n\r\n\t\t\tlet axis, index;\r\n\t\t\tlet x, y, z;\r\n\t\t\tlet c, i;\r\n\r\n\t\t\t// Has the end been reached?\r\n\t\t\tif(this.i === this.l) {\r\n\r\n\t\t\t\t// Move on to the next set of edges (X -> Y -> Z).\r\n\t\t\t\tthis.l = (++this.c < this.d) ? this.lengths[this.c] : 0;\r\n\t\t\t\tthis.i = 0;\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Are there any edges left?\r\n\t\t\tif(this.i < this.l) {\r\n\r\n\t\t\t\tc = this.c;\r\n\t\t\t\ti = this.i;\r\n\r\n\t\t\t\taxis = this.axes[c];\r\n\r\n\t\t\t\t// Each edge is uniquely described by its starting grid point index.\r\n\t\t\t\tindex = this.indices[c][i];\r\n\t\t\t\tedge.index = index;\r\n\r\n\t\t\t\t// Calculate the local grid coordinates from the one-dimensional index.\r\n\t\t\t\tx = index % m;\r\n\t\t\t\ty = Math.trunc((index % mm) / m);\r\n\t\t\t\tz = Math.trunc(index / mm);\r\n\r\n\t\t\t\tedge.coordinates.set(x, y, z);\r\n\r\n\t\t\t\toffsetA.set(\r\n\t\t\t\t\tx * s / n,\r\n\t\t\t\t\ty * s / n,\r\n\t\t\t\t\tz * s / n\r\n\t\t\t\t);\r\n\r\n\t\t\t\toffsetB.set(\r\n\t\t\t\t\t(x + axis[0]) * s / n,\r\n\t\t\t\t\t(y + axis[1]) * s / n,\r\n\t\t\t\t\t(z + axis[2]) * s / n\r\n\t\t\t\t);\r\n\r\n\t\t\t\tedge.a.addVectors(base, offsetA);\r\n\t\t\t\tedge.b.addVectors(base, offsetB);\r\n\r\n\t\t\t\tedge.t = this.zeroCrossings[c][i];\r\n\t\t\t\tedge.n.fromArray(this.normals[c], i * 3);\r\n\r\n\t\t\t\tresult.value = edge;\r\n\r\n\t\t\t\t++this.i;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\t// There are no more edges left.\r\n\t\t\t\tresult.value = null;\r\n\t\t\t\tresult.done = true;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Called when this iterator will no longer be run to completion.\r\n\t\t *\r\n\t\t * @param {Object} value - An interator result value.\r\n\t\t * @return {IteratorResult} - A premature completion result.\r\n\t\t */\r\n\r\n\t\treturn(value) {\r\n\r\n\t\t\tthis.result.value = value;\r\n\t\t\tthis.result.done = true;\r\n\r\n\t\t\treturn this.result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns this iterator.\r\n\t\t *\r\n\t\t * @return {EdteIterator} An iterator.\r\n\t\t */\r\n\r\n\t\t[Symbol.iterator]() {\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Stores edge data separately for each dimension.\r\n\t *\r\n\t * With a grid resolution N, there are `3 * (N + 1)² * N` edges in total, but\r\n\t * the number of edges that actually contain the volume's surface is usually\r\n\t * much lower.\r\n\t *\r\n\t * @implements {Serializable}\r\n\t * @implements {Deserializable}\r\n\t * @implements {TransferableContainer}\r\n\t */\r\n\r\n\tclass EdgeData {\r\n\r\n\t\t/**\r\n\t\t * Constructs new edge data.\r\n\t\t *\r\n\t\t * @param {Number} [x=0] - The amount of edges along the X-axis. If <= 0, no memory will be allocated.\r\n\t\t * @param {Number} [y=x] - The amount of edges along the Y-axis. If omitted, this will be the same as x.\r\n\t\t * @param {Number} [z=x] - The amount of edges along the Z-axis. If omitted, this will be the same as x.\r\n\t\t */\r\n\r\n\t\tconstructor(x = 0, y = x, z = x) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The edges.\r\n\t\t\t *\r\n\t\t\t * Edges are stored as starting grid point indices in ascending order. The\r\n\t\t\t * ending point indices are implicitly defined through the dimension split:\r\n\t\t\t *\r\n\t\t\t * Given a starting point index A, the ending point index B for the X-, Y-\r\n\t\t\t * and Z-axis is defined as `A + 1`, `A + N` and `A + N²` respectively where\r\n\t\t\t * N is the grid resolution + 1.\r\n\t\t\t *\r\n\t\t\t * @type {Uint32Array[]}\r\n\t\t\t */\r\n\r\n\t\t\tthis.indices = (x <= 0) ? null : [\r\n\t\t\t\tnew Uint32Array(x),\r\n\t\t\t\tnew Uint32Array(y),\r\n\t\t\t\tnew Uint32Array(z)\r\n\t\t\t];\r\n\r\n\t\t\t/**\r\n\t\t\t * The Zero Crossing interpolation values.\r\n\t\t\t *\r\n\t\t\t * Each value describes the relative surface intersection position on the\r\n\t\t\t * respective edge. The values correspond to the order of the edges.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array[]}\r\n\t\t\t */\r\n\r\n\t\t\tthis.zeroCrossings = (x <= 0) ? null : [\r\n\t\t\t\tnew Float32Array(x),\r\n\t\t\t\tnew Float32Array(y),\r\n\t\t\t\tnew Float32Array(z)\r\n\t\t\t];\r\n\r\n\t\t\t/**\r\n\t\t\t * The surface intersection normals.\r\n\t\t\t *\r\n\t\t\t * The vectors are stored as [x, y, z] float triples and correspond to the\r\n\t\t\t * order of the edges.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array[]}\r\n\t\t\t */\r\n\r\n\t\t\tthis.normals = (x <= 0) ? null : [\r\n\t\t\t\tnew Float32Array(x * 3),\r\n\t\t\t\tnew Float32Array(y * 3),\r\n\t\t\t\tnew Float32Array(z * 3)\r\n\t\t\t];\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this data.\r\n\t\t *\r\n\t\t * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.\r\n\t\t * @return {Object} The serialised data.\r\n\t\t */\r\n\r\n\t\tserialize(deflate = false) {\r\n\r\n\t\t\treturn {\r\n\t\t\t\tedges: this.edges,\r\n\t\t\t\tzeroCrossings: this.zeroCrossings,\r\n\t\t\t\tnormals: this.normals\r\n\t\t\t};\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the given serialised data.\r\n\t\t *\r\n\t\t * @param {Object} object - Serialised edge data. Can be null.\r\n\t\t * @return {Deserializable} This object or null if the given serialised data was null.\r\n\t\t */\r\n\r\n\t\tdeserialize(object) {\r\n\r\n\t\t\tlet result = this;\r\n\r\n\t\t\tif(object !== null) {\r\n\r\n\t\t\t\tthis.edges = object.edges;\r\n\t\t\t\tthis.zeroCrossings = object.zeroCrossings;\r\n\t\t\t\tthis.normals = object.normals;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tresult = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.\r\n\t\t * @return {Transferable[]} The transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\tconst arrays = [\r\n\r\n\t\t\t\tthis.edges[0],\r\n\t\t\t\tthis.edges[1],\r\n\t\t\t\tthis.edges[2],\r\n\r\n\t\t\t\tthis.zeroCrossings[0],\r\n\t\t\t\tthis.zeroCrossings[1],\r\n\t\t\t\tthis.zeroCrossings[2],\r\n\r\n\t\t\t\tthis.normals[0],\r\n\t\t\t\tthis.normals[1],\r\n\t\t\t\tthis.normals[2]\r\n\r\n\t\t\t];\r\n\r\n\t\t\tlet array;\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = arrays.length; i < l; ++i) {\r\n\r\n\t\t\t\tarray = arrays[i];\r\n\r\n\t\t\t\tif(array !== null) {\r\n\r\n\t\t\t\t\ttransferList.push(array.buffer);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns a new edge iterator.\r\n\t\t *\r\n\t\t * @param {Vector3} cellPosition - The position of the volume data cell.\r\n\t\t * @param {Number} cellSize - The size of the volume data cell.\r\n\t\t * @return {EdgeIterator} An iterator.\r\n\t\t */\r\n\r\n\t\tedges(cellPosition, cellSize) {\r\n\r\n\t\t\treturn new EdgeIterator(this, cellPosition, cellSize);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a new edge iterator that only returns edges along the X-axis.\r\n\t\t *\r\n\t\t * @param {Vector3} cellPosition - The position of the volume data cell.\r\n\t\t * @param {Number} cellSize - The size of the volume data cell.\r\n\t\t * @return {EdgeIterator} An iterator.\r\n\t\t */\r\n\r\n\t\tedgesX(cellPosition, cellSize) {\r\n\r\n\t\t\treturn new EdgeIterator(this, cellPosition, cellSize, 0, 1);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a new edge iterator that only returns edges along the Y-axis.\r\n\t\t *\r\n\t\t * @param {Vector3} cellPosition - The position of the volume data cell.\r\n\t\t * @param {Number} cellSize - The size of the volume data cell.\r\n\t\t * @return {EdgeIterator} An iterator.\r\n\t\t */\r\n\r\n\t\tedgesY(cellPosition, cellSize) {\r\n\r\n\t\t\treturn new EdgeIterator(this, cellPosition, cellSize, 1, 2);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a new edge iterator that only returns edges along the Z-axis.\r\n\t\t *\r\n\t\t * @param {Vector3} cellPosition - The position of the volume data cell.\r\n\t\t * @param {Number} cellSize - The size of the volume data cell.\r\n\t\t * @return {EdgeIterator} An iterator.\r\n\t\t */\r\n\r\n\t\tedgesZ(cellPosition, cellSize) {\r\n\r\n\t\t\treturn new EdgeIterator(this, cellPosition, cellSize, 2, 3);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the amount of edges for one axis based on a given resolution.\r\n\t\t *\r\n\t\t * @param {Number} n - The grid resolution.\r\n\t\t * @return {Number} The amount of edges for a single dimension.\r\n\t\t */\r\n\r\n\t\tstatic calculate1DEdgeCount(n) {\r\n\r\n\t\t\treturn Math.pow((n + 1), 2) * n;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An enumeration of material constants.\r\n\t *\r\n\t * @type {Object}\r\n\t * @property {Number} AIR - Indicates empty space.\r\n\t * @property {Number} SOLID - Indicates solid material.\r\n\t */\r\n\r\n\tconst Material = {\r\n\r\n\t\tAIR: 0,\r\n\t\tSOLID: 1\r\n\r\n\t};\n\n\t/**\r\n\t * The material grid resolution.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tlet resolution = 0;\r\n\r\n\t/**\r\n\t * The total amount of grid point indices.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tlet indexCount = 0;\r\n\r\n\t/**\r\n\t * Rounds the given number up to the next power of two.\r\n\t *\r\n\t * @private\r\n\t * @param {Number} n - A number.\r\n\t * @return {Number} The next power of two.\r\n\t */\r\n\r\n\tfunction ceil2(n) {\r\n\r\n\t\treturn Math.pow(2, Math.max(0, Math.ceil(Math.log2(n))));\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Hermite data.\r\n\t *\r\n\t * @implements {Serializable}\r\n\t * @implements {Deserializable}\r\n\t * @implements {TransferableContainer}\r\n\t */\r\n\r\n\tclass HermiteData {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new set of Hermite data.\r\n\t\t *\r\n\t\t * @param {Boolean} [initialize=true] - Whether the data should be initialised immediately.\r\n\t\t */\r\n\r\n\t\tconstructor(initialize = true) {\r\n\r\n\t\t\t/**\r\n\t\t\t * Describes how many material indices are currently solid:\r\n\t\t\t *\r\n\t\t\t * - The chunk lies outside the volume if there are no solid grid points.\r\n\t\t\t * - The chunk lies completely inside the volume if all points are solid.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.materials = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * The grid points.\r\n\t\t\t *\r\n\t\t\t * @type {Uint8Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.materialIndices = initialize ? new Uint8Array(indexCount) : null;\r\n\r\n\t\t\t/**\r\n\t\t\t * Run-length compression data.\r\n\t\t\t *\r\n\t\t\t * @type {Uint32Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.runLengths = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The edge data.\r\n\t\t\t *\r\n\t\t\t * @type {EdgeData}\r\n\t\t\t */\r\n\r\n\t\t\tthis.edgeData = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Indicates whether this data container is empty.\r\n\t\t *\r\n\t\t * @type {Boolean}\r\n\t\t */\r\n\r\n\t\tget empty() {\r\n\r\n\t\t\treturn (this.materials === 0);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Indicates whether this data container is full.\r\n\t\t *\r\n\t\t * @type {Boolean}\r\n\t\t */\r\n\r\n\t\tget full() {\r\n\r\n\t\t\treturn (this.materials === indexCount);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Indicates whether this data is currently compressed.\r\n\t\t *\r\n\t\t * @type {Boolean}\r\n\t\t */\r\n\r\n\t\tget compressed() {\r\n\r\n\t\t\treturn (this.runLengths !== null);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Indicates whether this data is currently gone.\r\n\t\t *\r\n\t\t * @type {Boolean}\r\n\t\t */\r\n\r\n\t\tget neutered() {\r\n\r\n\t\t\treturn (!this.empty && this.materialIndices === null);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the given data.\r\n\t\t *\r\n\t\t * @param {HermiteData} data - The data to adopt.\r\n\t\t * @return {HermiteData} This data.\r\n\t\t */\r\n\r\n\t\tset(data) {\r\n\r\n\t\t\tthis.materials = data.materials;\r\n\t\t\tthis.materialIndices = data.materialIndices;\r\n\t\t\tthis.runLengths = data.runLengths;\r\n\t\t\tthis.edgeData = data.edgeData;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Removes all data.\r\n\t\t *\r\n\t\t * @return {HermiteData} This data.\r\n\t\t */\r\n\r\n\t\tclear() {\r\n\r\n\t\t\tthis.materials = 0;\r\n\t\t\tthis.materialIndices = null;\r\n\t\t\tthis.runLengths = null;\r\n\t\t\tthis.edgeData = null;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the specified material index.\r\n\t\t *\r\n\t\t * @param {Number} index - The index of the material index that should be updated.\r\n\t\t * @param {Number} value - The new material index.\r\n\t\t */\r\n\r\n\t\tsetMaterialIndex(index, value) {\r\n\r\n\t\t\t// Keep track of how many material indices are solid.\r\n\t\t\tif(this.materialIndices[index] === Material.AIR) {\r\n\r\n\t\t\t\tif(value !== Material.AIR) {\r\n\r\n\t\t\t\t\t++this.materials;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else if(value === Material.AIR) {\r\n\r\n\t\t\t\t--this.materials;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.materialIndices[index] = value;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Compresses this data.\r\n\t\t *\r\n\t\t * @param {HermiteData} [target=this] - A target data set. The compressed data will be assigned to this set.\r\n\t\t * @return {HermiteData} The target data set.\r\n\t\t */\r\n\r\n\t\tcompress(target = this) {\r\n\r\n\t\t\tlet encoding;\r\n\r\n\t\t\tif(!this.compressed) {\r\n\r\n\t\t\t\t// Note: empty sets won't be compressed. They can be discarded.\r\n\t\t\t\tif(this.full) {\r\n\r\n\t\t\t\t\t// This deliberately destroys material variations to save space!\r\n\t\t\t\t\tencoding = new RunLengthEncoding(\r\n\t\t\t\t\t\t[this.materialIndices.length],\r\n\t\t\t\t\t\t[Material.SOLID]\r\n\t\t\t\t\t);\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tencoding = RunLengthEncoding.encode(this.materialIndices);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\ttarget.materialIndices = new Uint8Array(encoding.data);\r\n\t\t\t\ttarget.runLengths = new Uint32Array(encoding.runLengths);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\ttarget.materialIndices = this.materialIndices;\r\n\t\t\t\ttarget.runLengths = this.runLengths;\r\n\r\n\t\t\t}\r\n\r\n\t\t\ttarget.materials = this.materials;\r\n\r\n\t\t\treturn target;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Decompresses this data.\r\n\t\t *\r\n\t\t * @param {HermiteData} [target=this] - A target data set. If none is provided, the compressed data will be replaced with the decompressed data.\r\n\t\t * @return {HermiteData} The target data set.\r\n\t\t */\r\n\r\n\t\tdecompress(target = this) {\r\n\r\n\t\t\ttarget.materialIndices = !this.compressed ?\r\n\t\t\t\tthis.materialIndices : RunLengthEncoding.decode(\r\n\t\t\t\t\tthis.runLengths, this.materialIndices, new Uint8Array(indexCount)\r\n\t\t\t\t);\r\n\r\n\t\t\ttarget.runLengths = null;\r\n\t\t\ttarget.materials = this.materials;\r\n\r\n\t\t\treturn target;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this data.\r\n\t\t *\r\n\t\t * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.\r\n\t\t * @return {Object} The serialised data.\r\n\t\t */\r\n\r\n\t\tserialize(deflate = false) {\r\n\r\n\t\t\treturn {\r\n\t\t\t\tmaterials: this.materials,\r\n\t\t\t\tmaterialIndices: this.materialIndices,\r\n\t\t\t\trunLengths: this.runLengths,\r\n\t\t\t\tedgeData: (this.edgeData !== null) ? this.edgeData.serialize() : null\r\n\t\t\t};\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the given serialised data.\r\n\t\t *\r\n\t\t * @param {Object} object - Serialised Hermite data. Can be null.\r\n\t\t * @return {Deserializable} This object or null if the given serialised data was null.\r\n\t\t */\r\n\r\n\t\tdeserialize(object) {\r\n\r\n\t\t\tlet result = this;\r\n\r\n\t\t\tif(object !== null) {\r\n\r\n\t\t\t\tthis.materials = object.materials;\r\n\t\t\t\tthis.materialIndices = object.materialIndices;\r\n\t\t\t\tthis.runLengths = object.runLengths;\r\n\r\n\t\t\t\tif(object.edgeData !== null) {\r\n\r\n\t\t\t\t\tif(this.edgeData === null) {\r\n\r\n\t\t\t\t\t\t// Create an empty edge data container.\r\n\t\t\t\t\t\tthis.edgeData = new EdgeData();\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tthis.edgeData.deserialize(object.edgeData);\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tthis.edgeData = null;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tresult = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.\r\n\t\t * @return {Transferable[]} The transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\tif(this.edgeData !== null) {\r\n\r\n\t\t\t\tthis.edgeData.createTransferList(transferList);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(this.materialIndices !== null) {\r\n\r\n\t\t\t\ttransferList.push(this.materialIndices.buffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(this.runLengths !== null) {\r\n\r\n\t\t\t\ttransferList.push(this.runLengths.buffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The material grid resolution.\r\n\t\t *\r\n\t\t * The effective resolution of a chunk of Hermite data is the distance between\r\n\t\t * two adjacent grid points with respect to the size of the containing world\r\n\t\t * octant.\r\n\t\t *\r\n\t\t * @type {Number}\r\n\t\t */\r\n\r\n\t\tstatic get resolution() {\r\n\r\n\t\t\treturn resolution;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Warning: this value should only be set once.\r\n\t\t *\r\n\t\t * The upper limit is 256.\r\n\t\t *\r\n\t\t * @type {Number}\r\n\t\t */\r\n\r\n\t\tstatic set resolution(value) {\r\n\r\n\t\t\tresolution = Math.max(1, Math.min(256, ceil2(value)));\r\n\t\t\tindexCount = Math.pow((resolution + 1), 3);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A data container for the QEF solver.\r\n\t */\r\n\r\n\tclass QEFData {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new QEF data container.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * A symmetric matrix.\r\n\t\t\t *\r\n\t\t\t * @type {SymmetricMatrix3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.ata = new SymmetricMatrix3();\r\n\r\n\t\t\tthis.ata.set(\r\n\r\n\t\t\t\t0, 0, 0,\r\n\t\t\t\t0, 0,\r\n\t\t\t\t0\r\n\r\n\t\t\t);\r\n\r\n\t\t\t/**\r\n\t\t\t * A vector.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.atb = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * An accumulation of the surface intersection points.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.massPointSum = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * The amount of accumulated surface intersection points.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.numPoints = 0;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this data instance.\r\n\t\t *\r\n\t\t * @param {SymmetricMatrix3} ata - ATA.\r\n\t\t * @param {Vector3} atb - ATb.\r\n\t\t * @param {Vector3} massPointSum - The accumulated mass points.\r\n\t\t * @param {Vector3} numPoints - The number of mass points.\r\n\t\t * @return {QEFData} This data.\r\n\t\t */\r\n\r\n\t\tset(ata, atb, massPointSum, numPoints) {\r\n\r\n\t\t\tthis.ata.copy(ata);\r\n\t\t\tthis.atb.copy(atb);\r\n\r\n\t\t\tthis.massPointSum.copy(massPointSum);\r\n\t\t\tthis.numPoints = numPoints;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from a given data instance.\r\n\t\t *\r\n\t\t * @param {QEFData} d - The data to copy.\r\n\t\t * @return {QEFData} This data.\r\n\t\t */\r\n\r\n\t\tcopy(d) {\r\n\r\n\t\t\treturn this.set(d.ata, d.atb, d.massPointSum, d.numPoints);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds the given surface intersection point and normal.\r\n\t\t *\r\n\t\t * @param {Vector3} p - An intersection point.\r\n\t\t * @param {Vector3} n - A surface intersection normal.\r\n\t\t */\r\n\r\n\t\tadd(p, n) {\r\n\r\n\t\t\tconst nx = n.x;\r\n\t\t\tconst ny = n.y;\r\n\t\t\tconst nz = n.z;\r\n\r\n\t\t\tconst b = p.dot(n);\r\n\r\n\t\t\tconst ata = this.ata.elements;\r\n\t\t\tconst atb = this.atb;\r\n\r\n\t\t\tata[0] += nx * nx;\r\n\t\t\tata[1] += nx * ny; ata[3] += ny * ny;\r\n\t\t\tata[2] += nx * nz; ata[4] += ny * nz; ata[5] += nz * nz;\r\n\r\n\t\t\tatb.x += b * nx;\r\n\t\t\tatb.y += b * ny;\r\n\t\t\tatb.z += b * nz;\r\n\r\n\t\t\tthis.massPointSum.add(p);\r\n\r\n\t\t\t++this.numPoints;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds an entire data set.\r\n\t\t *\r\n\t\t * @param {QEFData} d - QEF data.\r\n\t\t */\r\n\r\n\t\taddData(d) {\r\n\r\n\t\t\tthis.ata.add(d.ata);\r\n\t\t\tthis.atb.add(d.atb);\r\n\r\n\t\t\tthis.massPointSum.add(d.massPointSum);\r\n\t\t\tthis.numPoints += d.numPoints;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clears this data.\r\n\t\t */\r\n\r\n\t\tclear() {\r\n\r\n\t\t\tthis.ata.set(\r\n\r\n\t\t\t\t0, 0, 0,\r\n\t\t\t\t0, 0,\r\n\t\t\t\t0\r\n\r\n\t\t\t);\r\n\r\n\t\t\tthis.atb.set(0, 0, 0);\r\n\t\t\tthis.massPointSum.set(0, 0, 0);\r\n\t\t\tthis.numPoints = 0;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this data.\r\n\t\t *\r\n\t\t * @return {QEFData} The cloned data.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Symmetric Givens coefficients.\r\n\t *\r\n\t * @type {Vector2}\r\n\t * @private\r\n\t */\r\n\r\n\tconst coefficients = new Vector2();\r\n\r\n\t/**\r\n\t * A collection of matrix rotation utilities.\r\n\t */\r\n\r\n\tclass Givens {\r\n\r\n\t\t/**\r\n\t\t * Calculates symmetric Givens coefficients.\r\n\t\t *\r\n\t\t * @param {Number} aPP - PP.\r\n\t\t * @param {Number} aPQ - PQ.\r\n\t\t * @param {Number} aQQ - QQ.\r\n\t\t * @return {Vector2} The coefficients C and S.\r\n\t\t */\r\n\r\n\t\tstatic calculateCoefficients(aPP, aPQ, aQQ) {\r\n\r\n\t\t\tlet tau, stt, tan;\r\n\r\n\t\t\tif(aPQ === 0.0) {\r\n\r\n\t\t\t\tcoefficients.x = 1.0;\r\n\t\t\t\tcoefficients.y = 0.0;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\ttau = (aQQ - aPP) / (2.0 * aPQ);\r\n\t\t\t\tstt = Math.sqrt(1.0 + tau * tau);\r\n\t\t\t\ttan = 1.0 / ((tau >= 0.0) ? (tau + stt) : (tau - stt));\r\n\r\n\t\t\t\tcoefficients.x = 1.0 / Math.sqrt(1.0 + tan * tan);\r\n\t\t\t\tcoefficients.y = tan * coefficients.x;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn coefficients;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A collection of matrix rotation utilities.\r\n\t */\r\n\r\n\tclass Schur {\r\n\r\n\t\t/**\r\n\t\t * Rotates the given matrix.\r\n\t\t *\r\n\t\t * @param {Vector2} a - The vector that should be rotated.\r\n\t\t * @param {Vector2} coefficients - Givens coefficients.\r\n\t\t */\r\n\r\n\t\tstatic rotateXY(a, coefficients) {\r\n\r\n\t\t\tconst c = coefficients.x;\r\n\t\t\tconst s = coefficients.y;\r\n\r\n\t\t\tconst u = a.x;\r\n\t\t\tconst v = a.y;\r\n\r\n\t\t\ta.set(\r\n\t\t\t\tc * u - s * v,\r\n\t\t\t\ts * u + c * v\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rotates the given matrix.\r\n\t\t *\r\n\t\t * @param {Vector2} a - The vector that should be rotated.\r\n\t\t * @param {Vector2} q - A coefficient factor.\r\n\t\t * @param {Vector2} coefficients - Givens coefficients.\r\n\t\t */\r\n\r\n\t\tstatic rotateQXY(a, q, coefficients) {\r\n\r\n\t\t\tconst c = coefficients.x;\r\n\t\t\tconst s = coefficients.y;\r\n\t\t\tconst cc = c * c;\r\n\t\t\tconst ss = s * s;\r\n\r\n\t\t\tconst mx = 2.0 * c * s * q;\r\n\r\n\t\t\tconst u = a.x;\r\n\t\t\tconst v = a.y;\r\n\r\n\t\t\ta.set(\r\n\t\t\t\tcc * u - mx + ss * v,\r\n\t\t\t\tss * u + mx + cc * v\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A threshold for pseudo inversions.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tconst PSEUDOINVERSE_THRESHOLD = 1e-1;\r\n\r\n\t/**\r\n\t * The number of SVD sweeps.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tconst SVD_SWEEPS = 5;\r\n\r\n\t/**\r\n\t * A symmetric matrix.\r\n\t *\r\n\t * @type {SymmetricMatrix3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst sm = new SymmetricMatrix3();\r\n\r\n\t/**\r\n\t * A matrix.\r\n\t *\r\n\t * @type {Matrix3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst m$1 = new Matrix3();\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @type {Vector2}\r\n\t * @private\r\n\t */\r\n\r\n\tconst a$3 = new Vector2();\r\n\r\n\t/**\r\n\t * A vector that holds the singular values.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst b$7 = new Vector3();\r\n\r\n\t/**\r\n\t * Rotates the matrix element from the first row, second column.\r\n\t *\r\n\t * @private\r\n\t * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n\t * @param {Matrix3} v - A matrix.\r\n\t */\r\n\r\n\tfunction rotate01(vtav, v) {\r\n\r\n\t\tconst se = vtav.elements;\r\n\t\tconst ve = v.elements;\r\n\r\n\t\tlet coefficients;\r\n\r\n\t\tif(se[1] !== 0.0) {\r\n\r\n\t\t\tcoefficients = Givens.calculateCoefficients(se[0], se[1], se[3]);\r\n\r\n\t\t\tSchur.rotateQXY(a$3.set(se[0], se[3]), se[1], coefficients);\r\n\t\t\tse[0] = a$3.x; se[3] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(se[2], se[4]), coefficients);\r\n\t\t\tse[2] = a$3.x; se[4] = a$3.y;\r\n\r\n\t\t\tse[1] = 0.0;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[0], ve[3]), coefficients);\r\n\t\t\tve[0] = a$3.x; ve[3] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[1], ve[4]), coefficients);\r\n\t\t\tve[1] = a$3.x; ve[4] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[2], ve[5]), coefficients);\r\n\t\t\tve[2] = a$3.x; ve[5] = a$3.y;\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Rotates the matrix element from the first row, third column.\r\n\t *\r\n\t * @private\r\n\t * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n\t * @param {Matrix3} v - A matrix.\r\n\t */\r\n\r\n\tfunction rotate02(vtav, v) {\r\n\r\n\t\tconst se = vtav.elements;\r\n\t\tconst ve = v.elements;\r\n\r\n\t\tlet coefficients;\r\n\r\n\t\tif(se[2] !== 0.0) {\r\n\r\n\t\t\tcoefficients = Givens.calculateCoefficients(se[0], se[2], se[5]);\r\n\r\n\t\t\tSchur.rotateQXY(a$3.set(se[0], se[5]), se[2], coefficients);\r\n\t\t\tse[0] = a$3.x; se[5] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(se[1], se[4]), coefficients);\r\n\t\t\tse[1] = a$3.x; se[4] = a$3.y;\r\n\r\n\t\t\tse[2] = 0.0;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[0], ve[6]), coefficients);\r\n\t\t\tve[0] = a$3.x; ve[6] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[1], ve[7]), coefficients);\r\n\t\t\tve[1] = a$3.x; ve[7] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[2], ve[8]), coefficients);\r\n\t\t\tve[2] = a$3.x; ve[8] = a$3.y;\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Rotates the matrix element from the second row, third column.\r\n\t *\r\n\t * @private\r\n\t * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n\t * @param {Matrix3} v - A matrix.\r\n\t */\r\n\r\n\tfunction rotate12(vtav, v) {\r\n\r\n\t\tconst se = vtav.elements;\r\n\t\tconst ve = v.elements;\r\n\r\n\t\tlet coefficients;\r\n\r\n\t\tif(se[4] !== 0.0) {\r\n\r\n\t\t\tcoefficients = Givens.calculateCoefficients(se[3], se[4], se[5]);\r\n\r\n\t\t\tSchur.rotateQXY(a$3.set(se[3], se[5]), se[4], coefficients);\r\n\t\t\tse[3] = a$3.x; se[5] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(se[1], se[2]), coefficients);\r\n\t\t\tse[1] = a$3.x; se[2] = a$3.y;\r\n\r\n\t\t\tse[4] = 0.0;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[3], ve[6]), coefficients);\r\n\t\t\tve[3] = a$3.x; ve[6] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[4], ve[7]), coefficients);\r\n\t\t\tve[4] = a$3.x; ve[7] = a$3.y;\r\n\r\n\t\t\tSchur.rotateXY(a$3.set(ve[5], ve[8]), coefficients);\r\n\t\t\tve[5] = a$3.x; ve[8] = a$3.y;\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Calculates the singular values.\r\n\t *\r\n\t * @private\r\n\t * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n\t * @param {Matrix3} v - An identity matrix.\r\n\t * @return {Vector3} The singular values.\r\n\t */\r\n\r\n\tfunction solveSymmetric(vtav, v) {\r\n\r\n\t\tconst e = vtav.elements;\r\n\r\n\t\tlet i;\r\n\r\n\t\tfor(i = 0; i < SVD_SWEEPS; ++i) {\r\n\r\n\t\t\t// Rotate the upper right (lower left) triagonal.\r\n\t\t\trotate01(vtav, v);\r\n\t\t\trotate02(vtav, v);\r\n\t\t\trotate12(vtav, v);\r\n\r\n\t\t}\r\n\r\n\t\treturn b$7.set(e[0], e[3], e[5]);\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Computes the pseudo inverse of a given value.\r\n\t *\r\n\t * @private\r\n\t * @param {Number} x - The value to invert.\r\n\t * @return {Number} The inverted value.\r\n\t */\r\n\r\n\tfunction invert(x) {\r\n\r\n\t\tconst invX = (Math.abs(x) < PSEUDOINVERSE_THRESHOLD) ? 0.0 : 1.0 / x;\r\n\r\n\t\treturn (Math.abs(invX) < PSEUDOINVERSE_THRESHOLD) ? 0.0 : invX;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Calculates the pseudo inverse of v using the singular values.\r\n\t *\r\n\t * @private\r\n\t * @param {Matrix3} v - A matrix.\r\n\t * @param {Vector3} sigma - The singular values.\r\n\t * @return {Matrix3} The inverted matrix.\r\n\t */\r\n\r\n\tfunction pseudoInverse(v, sigma) {\r\n\r\n\t\tconst ve = v.elements;\r\n\r\n\t\tconst v00 = ve[0], v01 = ve[3], v02 = ve[6];\r\n\t\tconst v10 = ve[1], v11 = ve[4], v12 = ve[7];\r\n\t\tconst v20 = ve[2], v21 = ve[5], v22 = ve[8];\r\n\r\n\t\tconst d0 = invert(sigma.x);\r\n\t\tconst d1 = invert(sigma.y);\r\n\t\tconst d2 = invert(sigma.z);\r\n\r\n\t\treturn v.set(\r\n\r\n\t\t\t// First row.\r\n\t\t\tv00 * d0 * v00 + v01 * d1 * v01 + v02 * d2 * v02,\r\n\t\t\tv00 * d0 * v10 + v01 * d1 * v11 + v02 * d2 * v12,\r\n\t\t\tv00 * d0 * v20 + v01 * d1 * v21 + v02 * d2 * v22,\r\n\r\n\t\t\t// Second row.\r\n\t\t\tv10 * d0 * v00 + v11 * d1 * v01 + v12 * d2 * v02,\r\n\t\t\tv10 * d0 * v10 + v11 * d1 * v11 + v12 * d2 * v12,\r\n\t\t\tv10 * d0 * v20 + v11 * d1 * v21 + v12 * d2 * v22,\r\n\r\n\t\t\t// Third row.\r\n\t\t\tv20 * d0 * v00 + v21 * d1 * v01 + v22 * d2 * v02,\r\n\t\t\tv20 * d0 * v10 + v21 * d1 * v11 + v22 * d2 * v12,\r\n\t\t\tv20 * d0 * v20 + v21 * d1 * v21 + v22 * d2 * v22\r\n\r\n\t\t);\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A Singular Value Decomposition solver.\r\n\t *\r\n\t * Decomposes the given linear system into the matrices U, D and V and solves\r\n\t * the equation: U D V^T x = b.\r\n\t *\r\n\t * See http://mathworld.wolfram.com/SingularValueDecomposition.html for more\r\n\t * information.\r\n\t */\r\n\r\n\tclass SingularValueDecomposition {\r\n\r\n\t\t/**\r\n\t\t * Performs the Singular Value Decomposition to solve the given linear system.\r\n\t\t *\r\n\t\t * @param {SymmetricMatrix3} ata - ATA. Will not be modified.\r\n\t\t * @param {Vector3} atb - ATb. Will not be modified.\r\n\t\t * @param {Vector3} x - A target vector to store the result in.\r\n\t\t */\r\n\r\n\t\tstatic solve(ata, atb, x) {\r\n\r\n\t\t\tconst sigma = solveSymmetric(sm.copy(ata), m$1.identity());\r\n\t\t\tconst invV = pseudoInverse(m$1, sigma);\r\n\r\n\t\t\tx.copy(atb).applyMatrix3(invV);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A point.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst p$2 = new Vector3();\r\n\r\n\t/**\r\n\t * Computes the error of the approximated position.\r\n\t *\r\n\t * @private\r\n\t * @param {SymmetricMatrix3} ata - ATA.\r\n\t * @param {Vector3} atb - ATb.\r\n\t * @param {Vector3} x - The calculated vertex position.\r\n\t * @return {Number} The QEF error.\r\n\t */\r\n\r\n\tfunction calculateError(ata, atb, x) {\r\n\r\n\t\tata.applyToVector3(p$2.copy(x));\r\n\t\tp$2.subVectors(atb, p$2);\r\n\r\n\t\treturn p$2.dot(p$2);\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A Quaratic Error Function solver.\r\n\t *\r\n\t * Finds a point inside a voxel that minimises the sum of the squares of the\r\n\t * distances to the surface intersection planes associated with the voxel.\r\n\t *\r\n\t * Based on an implementation by Leonard Ritter and Nick Gildea:\r\n\t *  https://github.com/nickgildea/qef\r\n\t */\r\n\r\n\tclass QEFSolver {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new QEF solver.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * QEF data. Will be used destructively.\r\n\t\t\t *\r\n\t\t\t * @type {QEFData}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * ATA.\r\n\t\t\t *\r\n\t\t\t * @type {SymmetricMatrix3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.ata = new SymmetricMatrix3();\r\n\r\n\t\t\t/**\r\n\t\t\t * ATb.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.atb = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * The mass point of the current QEF data set.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.massPoint = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * Indicates whether this solver has a solution.\r\n\t\t\t *\r\n\t\t\t * @type {Boolean}\r\n\t\t\t */\r\n\r\n\t\t\tthis.hasSolution = false;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the QEF data.\r\n\t\t *\r\n\t\t * @param {QEFData} d - QEF Data.\r\n\t\t * @return {QEFSolver} This solver.\r\n\t\t */\r\n\r\n\t\tsetData(d) {\r\n\r\n\t\t\tthis.data = d;\r\n\t\t\tthis.hasSolution = false;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Solves the Quadratic Error Function.\r\n\t\t *\r\n\t\t * @param {Vector3} x - A target vector to store the vertex position in.\r\n\t\t * @return {Number} The quadratic error of the solution.\r\n\t\t */\r\n\r\n\t\tsolve(x) {\r\n\r\n\t\t\tconst data = this.data;\r\n\t\t\tconst massPoint = this.massPoint;\r\n\t\t\tconst ata = this.ata.copy(data.ata);\r\n\t\t\tconst atb = this.atb.copy(data.atb);\r\n\r\n\t\t\tlet error = Infinity;\r\n\r\n\t\t\tif(!this.hasSolution && data !== null && data.numPoints > 0) {\r\n\r\n\t\t\t\t// Divide the mass point sum to get the average.\r\n\t\t\t\tp$2.copy(data.massPointSum).divideScalar(data.numPoints);\r\n\t\t\t\tmassPoint.copy(p$2);\r\n\r\n\t\t\t\tata.applyToVector3(p$2);\r\n\t\t\t\tatb.sub(p$2);\r\n\r\n\t\t\t\tSingularValueDecomposition.solve(ata, atb, x);\r\n\t\t\t\terror = calculateError(ata, atb, x);\r\n\t\t\t\tx.add(massPoint);\r\n\r\n\t\t\t\tthis.hasSolution = true;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn error;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A cubic voxel that holds information about the surface of a volume.\r\n\t */\r\n\r\n\tclass Voxel {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new voxel.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * Holds binary material information about all eight corners of this voxel.\r\n\t\t\t *\r\n\t\t\t * A value of 0 means that this voxel is completely outside of the volume,\r\n\t\t\t * whereas a value of 255 means that it's fully inside of it. Any other\r\n\t\t\t * value indicates a material change which implies that the voxel contains\r\n\t\t\t * the surface.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.materials = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * The amount of edges that exhibit a material change in this voxel.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.edgeCount = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * A generated index for this voxel's vertex. Used during the construction\r\n\t\t\t * of the final polygons.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.index = -1;\r\n\r\n\t\t\t/**\r\n\t\t\t * The vertex that lies inside this voxel.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.position = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * The normal of the vertex that lies inside this voxel.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.normal = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * A QEF data construct. Used to calculate the vertex position.\r\n\t\t\t *\r\n\t\t\t * @type {QEFData}\r\n\t\t\t */\r\n\r\n\t\t\tthis.qefData = null;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A QEF solver.\r\n\t *\r\n\t * @type {QEFSolver}\r\n\t * @private\r\n\t */\r\n\r\n\tconst qefSolver = new QEFSolver();\r\n\r\n\t/**\r\n\t * A bias for boundary checks.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tconst BIAS = 1e-1;\r\n\r\n\t/**\r\n\t * An error threshold for QEF-based voxel clustering.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tlet errorThreshold = -1;\r\n\r\n\t/**\r\n\t * A voxel octant.\r\n\t */\r\n\r\n\tclass VoxelCell extends CubicOctant {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new voxel octant.\r\n\t\t *\r\n\t\t * @param {Vector3} [min] - The lower bounds of the octant.\r\n\t\t * @param {Number} [size] - The size of the octant.\r\n\t\t */\r\n\r\n\t\tconstructor(min, size) {\r\n\r\n\t\t\tsuper(min, size);\r\n\r\n\t\t\t/**\r\n\t\t\t * A voxel that contains draw information.\r\n\t\t\t *\r\n\t\t\t * @type {Voxel}\r\n\t\t\t */\r\n\r\n\t\t\tthis.voxel = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the given point lies inside this cell.\r\n\t\t *\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Boolean} Whether the given point lies inside this cell.\r\n\t\t */\r\n\r\n\t\tcontains(p) {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst size = this.size;\r\n\r\n\t\t\treturn (\r\n\t\t\t\tp.x >= min.x - BIAS &&\r\n\t\t\t\tp.y >= min.y - BIAS &&\r\n\t\t\t\tp.z >= min.z - BIAS &&\r\n\t\t\t\tp.x <= min.x + size + BIAS &&\r\n\t\t\t\tp.y <= min.y + size + BIAS &&\r\n\t\t\t\tp.z <= min.z + size + BIAS\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Attempts to simplify this cell.\r\n\t\t *\r\n\t\t * @return {Number} The amount of removed voxels.\r\n\t\t */\r\n\r\n\t\tcollapse() {\r\n\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tconst signs = [\r\n\t\t\t\t-1, -1, -1, -1,\r\n\t\t\t\t-1, -1, -1, -1\r\n\t\t\t];\r\n\r\n\t\t\tconst position = new Vector3();\r\n\r\n\t\t\tlet midSign = -1;\r\n\t\t\tlet collapsible = (children !== null);\r\n\r\n\t\t\tlet removedVoxels = 0;\r\n\r\n\t\t\tlet child, sign, voxel;\r\n\t\t\tlet qefData, error;\r\n\r\n\t\t\tlet v, i;\r\n\r\n\t\t\tif(collapsible) {\r\n\r\n\t\t\t\tqefData = new QEFData();\r\n\r\n\t\t\t\tfor(v = 0, i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\t\tchild = children[i];\r\n\t\t\t\t\tremovedVoxels += child.collapse();\r\n\t\t\t\t\tvoxel = child.voxel;\r\n\r\n\t\t\t\t\tif(child.children !== null) {\r\n\r\n\t\t\t\t\t\t// Couldn't simplify the child.\r\n\t\t\t\t\t\tcollapsible = false;\r\n\r\n\t\t\t\t\t} else if(voxel !== null) {\r\n\r\n\t\t\t\t\t\tqefData.addData(voxel.qefData);\r\n\r\n\t\t\t\t\t\tmidSign = (voxel.materials >> (7 - i)) & 1;\r\n\t\t\t\t\t\tsigns[i] = (voxel.materials >> i) & 1;\r\n\r\n\t\t\t\t\t\t++v;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(collapsible) {\r\n\r\n\t\t\t\t\terror = qefSolver.setData(qefData).solve(position);\r\n\r\n\t\t\t\t\tif(error <= errorThreshold) {\r\n\r\n\t\t\t\t\t\tvoxel = new Voxel();\r\n\t\t\t\t\t\tvoxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);\r\n\r\n\t\t\t\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\t\t\t\tsign = signs[i];\r\n\t\t\t\t\t\t\tchild = children[i];\r\n\r\n\t\t\t\t\t\t\tif(sign === -1) {\r\n\r\n\t\t\t\t\t\t\t\t// Undetermined, use mid sign instead.\r\n\t\t\t\t\t\t\t\tvoxel.materials |= (midSign << i);\r\n\r\n\t\t\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t\t\tvoxel.materials |= (sign << i);\r\n\r\n\t\t\t\t\t\t\t\t// Accumulate normals.\r\n\t\t\t\t\t\t\t\tvoxel.normal.add(child.voxel.normal);\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\tvoxel.normal.normalize();\r\n\t\t\t\t\t\tvoxel.qefData = qefData;\r\n\r\n\t\t\t\t\t\tthis.voxel = voxel;\r\n\t\t\t\t\t\tthis.children = null;\r\n\r\n\t\t\t\t\t\t// Removed existing voxels and created a new one.\r\n\t\t\t\t\t\tremovedVoxels += v - 1;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn removedVoxels;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * An error threshold for QEF-based voxel clustering (mesh simplification).\r\n\t\t *\r\n\t\t * @type {Number}\r\n\t\t */\r\n\r\n\t\tstatic get errorThreshold() {\r\n\r\n\t\t\treturn errorThreshold;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The mesh simplification error threshold.\r\n\t\t *\r\n\t\t * A bigger threshold allows more voxel cells to collapse which results in\r\n\t\t * less vertices being created.\r\n\t\t *\r\n\t\t * An error threshold of -1 disables the mesh simplification.\r\n\t\t *\r\n\t\t * @type {Number}\r\n\t\t */\r\n\r\n\t\tstatic set errorThreshold(value) {\r\n\r\n\t\t\terrorThreshold = value;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A message.\r\n\t *\r\n\t * Messages are exchanged between different execution contexts such as a worker\r\n\t * and the main thread.\r\n\t */\r\n\r\n\tclass Message {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new message.\r\n\t\t *\r\n\t\t * @param {Action} [action=null] - A worker action.\r\n\t\t */\r\n\r\n\t\tconstructor(action = null) {\r\n\r\n\t\t\t/**\r\n\t\t\t * A worker action.\r\n\t\t\t *\r\n\t\t\t * When a message is sent to another execution context, it will be copied\r\n\t\t\t * using the Structured Clone algorithm. This automatic process turns the\r\n\t\t\t * message into a plain object. The explicit action flag serves as a\r\n\t\t\t * reliable identifier.\r\n\t\t\t *\r\n\t\t\t * @type {Action}\r\n\t\t\t */\r\n\r\n\t\t\tthis.action = action;\r\n\r\n\t\t\t/**\r\n\t\t\t * An error.\r\n\t\t\t *\r\n\t\t\t * If this is not null, something went wrong.\r\n\t\t\t *\r\n\t\t\t * @type {ErrorEvent}\r\n\t\t\t */\r\n\r\n\t\t\tthis.error = null;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An isosurface, the result of a contouring process.\r\n\t *\r\n\t * @implements {Serializable}\r\n\t * @implements {Deserializable}\r\n\t * @implements {TransferableContainer}\r\n\t */\r\n\r\n\tclass Isosurface {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new isosurface.\r\n\t\t *\r\n\t\t * @param {Uint16Array} indices - Triangle indices.\r\n\t\t * @param {Float32Array} positions - Generated vertices.\r\n\t\t * @param {Float32Array} normals - Generated normals.\r\n\t\t * @param {Float32Array} uvs - Generated uvs.\r\n\t\t * @param {Uint8Array} materials - Generated materials.\r\n\t\t */\r\n\r\n\t\tconstructor(indices, positions, normals, uvs, materials) {\r\n\r\n\t\t\t/**\r\n\t\t\t * A set of vertex indices that describe triangles.\r\n\t\t\t *\r\n\t\t\t * @type {Uint16Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.indices = indices;\r\n\r\n\t\t\t/**\r\n\t\t\t * A set of vertices.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.positions = positions;\r\n\r\n\t\t\t/**\r\n\t\t\t * A set of normals.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.normals = normals;\r\n\r\n\t\t\t/**\r\n\t\t\t * A set of UV coordinates.\r\n\t\t\t *\r\n\t\t\t * @type {Float32Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.uvs = uvs;\r\n\r\n\t\t\t/**\r\n\t\t\t * A set of material indices.\r\n\t\t\t *\r\n\t\t\t * @type {Uint8Array}\r\n\t\t\t */\r\n\r\n\t\t\tthis.materials = materials;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this isosurface.\r\n\t\t *\r\n\t\t * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.\r\n\t\t * @return {Object} The serialised data.\r\n\t\t */\r\n\r\n\t\tserialize(deflate = false) {\r\n\r\n\t\t\treturn {\r\n\t\t\t\tindices: this.indices,\r\n\t\t\t\tpositions: this.positions,\r\n\t\t\t\tnormals: this.normals,\r\n\t\t\t\tuvs: this.uvs,\r\n\t\t\t\tmaterials: this.materials\r\n\t\t\t};\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the given serialised isosurface.\r\n\t\t *\r\n\t\t * @param {Object} object - A serialised isosurface. Can be null.\r\n\t\t * @return {Deserializable} This object or null if the given serialised isosurface was null.\r\n\t\t */\r\n\r\n\t\tdeserialize(object) {\r\n\r\n\t\t\tlet result = this;\r\n\r\n\t\t\tif(object !== null) {\r\n\r\n\t\t\t\tthis.indices = object.indices;\r\n\t\t\t\tthis.positions = object.positions;\r\n\t\t\t\tthis.normals = object.normals;\r\n\t\t\t\tthis.uvs = object.uvs;\r\n\t\t\t\tthis.materials = object.materials;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tresult = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.\r\n\t\t * @return {Transferable[]} The transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\ttransferList.push(this.indices.buffer);\r\n\t\t\ttransferList.push(this.positions.buffer);\r\n\t\t\ttransferList.push(this.normals.buffer);\r\n\t\t\ttransferList.push(this.uvs.buffer);\r\n\t\t\ttransferList.push(this.materials.buffer);\r\n\r\n\t\t\treturn transferList;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An edge mask.\r\n\t *\r\n\t * @type {Uint8Array}\r\n\t */\r\n\r\n\r\n\r\n\t/**\r\n\t * A face map.\r\n\t *\r\n\t * @type {Uint8Array[]}\r\n\t */\r\n\r\n\r\n\r\n\t/**\r\n\t * A face mask for cell processing.\r\n\t *\r\n\t * @type {Uint8Array[]}\r\n\t */\r\n\r\n\tconst cellProcFaceMask = [\r\n\r\n\t\tnew Uint8Array([0, 4, 0]),\r\n\t\tnew Uint8Array([1, 5, 0]),\r\n\t\tnew Uint8Array([2, 6, 0]),\r\n\t\tnew Uint8Array([3, 7, 0]),\r\n\t\tnew Uint8Array([0, 2, 1]),\r\n\t\tnew Uint8Array([4, 6, 1]),\r\n\t\tnew Uint8Array([1, 3, 1]),\r\n\t\tnew Uint8Array([5, 7, 1]),\r\n\t\tnew Uint8Array([0, 1, 2]),\r\n\t\tnew Uint8Array([2, 3, 2]),\r\n\t\tnew Uint8Array([4, 5, 2]),\r\n\t\tnew Uint8Array([6, 7, 2])\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * An edge mask for cell processing.\r\n\t *\r\n\t * @type {Uint8Array[]}\r\n\t */\r\n\r\n\tconst cellProcEdgeMask = [\r\n\r\n\t\tnew Uint8Array([0, 1, 2, 3, 0]),\r\n\t\tnew Uint8Array([4, 5, 6, 7, 0]),\r\n\t\tnew Uint8Array([0, 4, 1, 5, 1]),\r\n\t\tnew Uint8Array([2, 6, 3, 7, 1]),\r\n\t\tnew Uint8Array([0, 2, 4, 6, 2]),\r\n\t\tnew Uint8Array([1, 3, 5, 7, 2])\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * A face mask for face processing.\r\n\t *\r\n\t * @type {Array<Uint8Array[]>}\r\n\t */\r\n\r\n\tconst faceProcFaceMask = [\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([4, 0, 0]),\r\n\t\t\tnew Uint8Array([5, 1, 0]),\r\n\t\t\tnew Uint8Array([6, 2, 0]),\r\n\t\t\tnew Uint8Array([7, 3, 0])\r\n\t\t],\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([2, 0, 1]),\r\n\t\t\tnew Uint8Array([6, 4, 1]),\r\n\t\t\tnew Uint8Array([3, 1, 1]),\r\n\t\t\tnew Uint8Array([7, 5, 1])\r\n\t\t],\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([1, 0, 2]),\r\n\t\t\tnew Uint8Array([3, 2, 2]),\r\n\t\t\tnew Uint8Array([5, 4, 2]),\r\n\t\t\tnew Uint8Array([7, 6, 2])\r\n\t\t]\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * An edge mask for face processing.\r\n\t *\r\n\t * @type {Array<Uint8Array[]>}\r\n\t */\r\n\r\n\tconst faceProcEdgeMask = [\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([1, 4, 0, 5, 1, 1]),\r\n\t\t\tnew Uint8Array([1, 6, 2, 7, 3, 1]),\r\n\t\t\tnew Uint8Array([0, 4, 6, 0, 2, 2]),\r\n\t\t\tnew Uint8Array([0, 5, 7, 1, 3, 2])\r\n\t\t],\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([0, 2, 3, 0, 1, 0]),\r\n\t\t\tnew Uint8Array([0, 6, 7, 4, 5, 0]),\r\n\t\t\tnew Uint8Array([1, 2, 0, 6, 4, 2]),\r\n\t\t\tnew Uint8Array([1, 3, 1, 7, 5, 2])\r\n\t\t],\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([1, 1, 0, 3, 2, 0]),\r\n\t\t\tnew Uint8Array([1, 5, 4, 7, 6, 0]),\r\n\t\t\tnew Uint8Array([0, 1, 5, 0, 4, 1]),\r\n\t\t\tnew Uint8Array([0, 3, 7, 2, 6, 1])\r\n\t\t]\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * An edge mask for edge processing.\r\n\t *\r\n\t * @type {Array<Uint8Array[]>}\r\n\t */\r\n\r\n\tconst edgeProcEdgeMask = [\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([3, 2, 1, 0, 0]),\r\n\t\t\tnew Uint8Array([7, 6, 5, 4, 0])\r\n\t\t],\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([5, 1, 4, 0, 1]),\r\n\t\t\tnew Uint8Array([7, 3, 6, 2, 1])\r\n\t\t],\r\n\r\n\t\t[\r\n\t\t\tnew Uint8Array([6, 4, 2, 0, 2]),\r\n\t\t\tnew Uint8Array([7, 5, 3, 1, 2])\r\n\t\t]\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * An edge mask.\r\n\t *\r\n\t * @type {Uint8Array[]}\r\n\t */\r\n\r\n\tconst procEdgeMask = [\r\n\r\n\t\tnew Uint8Array([3, 2, 1, 0]),\r\n\t\tnew Uint8Array([7, 5, 6, 4]),\r\n\t\tnew Uint8Array([11, 10, 9, 8])\r\n\r\n\t];\n\n\t/**\r\n\t * The maximum number of vertices. Vertex indices use 16 bits.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tconst MAX_VERTEX_COUNT = Math.pow(2, 16) - 1;\r\n\r\n\t/**\r\n\t * An edge contouring sub-procedure.\r\n\t *\r\n\t * @private\r\n\t * @param {Array} octants - Four leaf octants.\r\n\t * @param {Number} dir - A direction index.\r\n\t * @param {Array} indexBuffer - An output list for vertex indices.\r\n\t */\r\n\r\n\tfunction contourProcessEdge(octants, dir, indexBuffer) {\r\n\r\n\t\tconst indices = [-1, -1, -1, -1];\r\n\t\tconst signChange = [false, false, false, false];\r\n\r\n\t\tlet minSize = Infinity;\r\n\t\tlet minIndex = 0;\r\n\t\tlet flip = false;\r\n\r\n\t\tlet c1, c2, m1, m2;\r\n\t\tlet octant, edge;\r\n\t\tlet i;\r\n\r\n\t\tfor(i = 0; i < 4; ++i) {\r\n\r\n\t\t\toctant = octants[i];\r\n\t\t\tedge = procEdgeMask[dir][i];\r\n\r\n\t\t\tc1 = edges[edge][0];\r\n\t\t\tc2 = edges[edge][1];\r\n\r\n\t\t\tm1 = (octant.voxel.materials >> c1) & 1;\r\n\t\t\tm2 = (octant.voxel.materials >> c2) & 1;\r\n\r\n\t\t\tif(octant.size < minSize) {\r\n\r\n\t\t\t\tminSize = octant.size;\r\n\t\t\t\tminIndex = i;\r\n\t\t\t\tflip = (m1 !== Material.AIR);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tindices[i] = octant.voxel.index;\r\n\t\t\tsignChange[i] = (m1 !== m2);\r\n\r\n\t\t}\r\n\r\n\t\tif(signChange[minIndex]) {\r\n\r\n\t\t\tif(!flip) {\r\n\r\n\t\t\t\tindexBuffer.push(indices[0]);\r\n\t\t\t\tindexBuffer.push(indices[1]);\r\n\t\t\t\tindexBuffer.push(indices[3]);\r\n\r\n\t\t\t\tindexBuffer.push(indices[0]);\r\n\t\t\t\tindexBuffer.push(indices[3]);\r\n\t\t\t\tindexBuffer.push(indices[2]);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tindexBuffer.push(indices[0]);\r\n\t\t\t\tindexBuffer.push(indices[3]);\r\n\t\t\t\tindexBuffer.push(indices[1]);\r\n\r\n\t\t\t\tindexBuffer.push(indices[0]);\r\n\t\t\t\tindexBuffer.push(indices[2]);\r\n\t\t\t\tindexBuffer.push(indices[3]);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * An edge contouring procedure.\r\n\t *\r\n\t * @private\r\n\t * @param {Array} octants - Four edge octants.\r\n\t * @param {Number} dir - A direction index.\r\n\t * @param {Array} indexBuffer - An output list for vertex indices.\r\n\t */\r\n\r\n\tfunction contourEdgeProc(octants, dir, indexBuffer) {\r\n\r\n\t\tconst c = [0, 0, 0, 0];\r\n\r\n\t\tlet edgeOctants;\r\n\t\tlet octant;\r\n\t\tlet i, j;\r\n\r\n\t\tif(octants[0].voxel !== null && octants[1].voxel !== null &&\r\n\t\t\toctants[2].voxel !== null && octants[3].voxel !== null) {\r\n\r\n\t\t\tcontourProcessEdge(octants, dir, indexBuffer);\r\n\r\n\t\t} else {\r\n\r\n\t\t\tfor(i = 0; i < 2; ++i) {\r\n\r\n\t\t\t\tc[0] = edgeProcEdgeMask[dir][i][0];\r\n\t\t\t\tc[1] = edgeProcEdgeMask[dir][i][1];\r\n\t\t\t\tc[2] = edgeProcEdgeMask[dir][i][2];\r\n\t\t\t\tc[3] = edgeProcEdgeMask[dir][i][3];\r\n\r\n\t\t\t\tedgeOctants = [];\r\n\r\n\t\t\t\tfor(j = 0; j < 4; ++j) {\r\n\r\n\t\t\t\t\toctant = octants[j];\r\n\r\n\t\t\t\t\tif(octant.voxel !== null) {\r\n\r\n\t\t\t\t\t\tedgeOctants[j] = octant;\r\n\r\n\t\t\t\t\t} else if(octant.children !== null) {\r\n\r\n\t\t\t\t\t\tedgeOctants[j] = octant.children[c[j]];\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(j === 4) {\r\n\r\n\t\t\t\t\tcontourEdgeProc(edgeOctants, edgeProcEdgeMask[dir][i][4], indexBuffer);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A face contouring procedure.\r\n\t *\r\n\t * @private\r\n\t * @param {Array} octants - Two face octants.\r\n\t * @param {Number} dir - A direction index.\r\n\t * @param {Array} indexBuffer - An output list for vertex indices.\r\n\t */\r\n\r\n\tfunction contourFaceProc(octants, dir, indexBuffer) {\r\n\r\n\t\tconst c = [0, 0, 0, 0];\r\n\r\n\t\tconst orders = [\r\n\t\t\t[0, 0, 1, 1],\r\n\t\t\t[0, 1, 0, 1]\r\n\t\t];\r\n\r\n\t\tlet faceOctants, edgeOctants;\r\n\t\tlet order, octant;\r\n\t\tlet i, j;\r\n\r\n\t\tif(octants[0].children !== null || octants[1].children !== null) {\r\n\r\n\t\t\tfor(i = 0; i < 4; ++i) {\r\n\r\n\t\t\t\tc[0] = faceProcFaceMask[dir][i][0];\r\n\t\t\t\tc[1] = faceProcFaceMask[dir][i][1];\r\n\r\n\t\t\t\tfaceOctants = [\r\n\t\t\t\t\t(octants[0].children === null) ? octants[0] : octants[0].children[c[0]],\r\n\t\t\t\t\t(octants[1].children === null) ? octants[1] : octants[1].children[c[1]]\r\n\t\t\t\t];\r\n\r\n\t\t\t\tcontourFaceProc(faceOctants, faceProcFaceMask[dir][i][2], indexBuffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tfor(i = 0; i < 4; ++i) {\r\n\r\n\t\t\t\tc[0] = faceProcEdgeMask[dir][i][1];\r\n\t\t\t\tc[1] = faceProcEdgeMask[dir][i][2];\r\n\t\t\t\tc[2] = faceProcEdgeMask[dir][i][3];\r\n\t\t\t\tc[3] = faceProcEdgeMask[dir][i][4];\r\n\r\n\t\t\t\torder = orders[faceProcEdgeMask[dir][i][0]];\r\n\r\n\t\t\t\tedgeOctants = [];\r\n\r\n\t\t\t\tfor(j = 0; j < 4; ++j) {\r\n\r\n\t\t\t\t\toctant = octants[order[j]];\r\n\r\n\t\t\t\t\tif(octant.voxel !== null) {\r\n\r\n\t\t\t\t\t\tedgeOctants[j] = octant;\r\n\r\n\t\t\t\t\t} else if(octant.children !== null) {\r\n\r\n\t\t\t\t\t\tedgeOctants[j] = octant.children[c[j]];\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(j === 4) {\r\n\r\n\t\t\t\t\tcontourEdgeProc(edgeOctants, faceProcEdgeMask[dir][i][5], indexBuffer);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * The main contouring procedure.\r\n\t *\r\n\t * @private\r\n\t * @param {Octant} octant - An octant.\r\n\t * @param {Array} indexBuffer - An output list for vertex indices.\r\n\t */\r\n\r\n\tfunction contourCellProc(octant, indexBuffer) {\r\n\r\n\t\tconst children = octant.children;\r\n\t\tconst c = [0, 0, 0, 0];\r\n\r\n\t\tlet faceOctants, edgeOctants;\r\n\t\tlet i;\r\n\r\n\t\tif(children !== null) {\r\n\r\n\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\tcontourCellProc(children[i], indexBuffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tfor(i = 0; i < 12; ++i) {\r\n\r\n\t\t\t\tc[0] = cellProcFaceMask[i][0];\r\n\t\t\t\tc[1] = cellProcFaceMask[i][1];\r\n\r\n\t\t\t\tfaceOctants = [\r\n\t\t\t\t\tchildren[c[0]],\r\n\t\t\t\t\tchildren[c[1]]\r\n\t\t\t\t];\r\n\r\n\t\t\t\tcontourFaceProc(faceOctants, cellProcFaceMask[i][2], indexBuffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tfor(i = 0; i < 6; ++i) {\r\n\r\n\t\t\t\tc[0] = cellProcEdgeMask[i][0];\r\n\t\t\t\tc[1] = cellProcEdgeMask[i][1];\r\n\t\t\t\tc[2] = cellProcEdgeMask[i][2];\r\n\t\t\t\tc[3] = cellProcEdgeMask[i][3];\r\n\r\n\t\t\t\tedgeOctants = [\r\n\t\t\t\t\tchildren[c[0]],\r\n\t\t\t\t\tchildren[c[1]],\r\n\t\t\t\t\tchildren[c[2]],\r\n\t\t\t\t\tchildren[c[3]]\r\n\t\t\t\t];\r\n\r\n\t\t\t\tcontourEdgeProc(edgeOctants, cellProcEdgeMask[i][4], indexBuffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Collects positions and normals from the voxel information of the given octant\r\n\t * and its children. The generated vertex indices are stored in the respective\r\n\t * voxels during the octree traversal.\r\n\t *\r\n\t * @private\r\n\t * @param {Octant} octant - An octant.\r\n\t * @param {Array} vertexBuffer - An array to be filled with vertices.\r\n\t * @param {Array} normalBuffer - An array to be filled with normals.\r\n\t * @param {Number} index - The next vertex index.\r\n\t */\r\n\r\n\tfunction generateVertexIndices(octant, positions, normals, index) {\r\n\r\n\t\tlet i, voxel;\r\n\r\n\t\tif(octant.children !== null) {\r\n\r\n\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\tindex = generateVertexIndices(octant.children[i], positions, normals, index);\r\n\r\n\t\t\t}\r\n\r\n\t\t} else if(octant.voxel !== null) {\r\n\r\n\t\t\tvoxel = octant.voxel;\r\n\t\t\tvoxel.index = index;\r\n\r\n\t\t\tpositions[index * 3] = voxel.position.x;\r\n\t\t\tpositions[index * 3 + 1] = voxel.position.y;\r\n\t\t\tpositions[index * 3 + 2] = voxel.position.z;\r\n\r\n\t\t\tnormals[index * 3] = voxel.normal.x;\r\n\t\t\tnormals[index * 3 + 1] = voxel.normal.y;\r\n\t\t\tnormals[index * 3 + 2] = voxel.normal.z;\r\n\r\n\t\t\t++index;\r\n\r\n\t\t}\r\n\r\n\t\treturn index;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Dual Contouring is an isosurface extraction technique that was originally\r\n\t * presented by Tao Ju in 2002:\r\n\t *  http://www.cs.wustl.edu/~taoju/research/dualContour.pdf\r\n\t */\r\n\r\n\tclass DualContouring {\r\n\r\n\t\t/**\r\n\t\t * Contours the given volume data.\r\n\t\t *\r\n\t\t * @param {SparseVoxelOctree} svo - A voxel octree.\r\n\t\t * @return {Isosurface} The generated isosurface or null if no data was generated.\r\n\t\t */\r\n\r\n\t\tstatic run(svo) {\r\n\r\n\t\t\tconst indexBuffer = [];\r\n\r\n\t\t\t// Each voxel contains one vertex.\r\n\t\t\tconst vertexCount = svo.voxelCount;\r\n\r\n\t\t\tlet result = null;\r\n\t\t\tlet positions = null;\r\n\t\t\tlet normals = null;\r\n\t\t\tlet uvs = null;\r\n\t\t\tlet materials = null;\r\n\r\n\t\t\tif(vertexCount > MAX_VERTEX_COUNT) {\r\n\r\n\t\t\t\tconsole.warn(\r\n\t\t\t\t\t\"Could not create geometry for cell at position\", svo.min,\r\n\t\t\t\t\t\"(vertex count of\", vertexCount, \"exceeds limit of \", MAX_VERTEX_COUNT, \")\"\r\n\t\t\t\t);\r\n\r\n\t\t\t} else if(vertexCount > 0) {\r\n\r\n\t\t\t\tpositions = new Float32Array(vertexCount * 3);\r\n\t\t\t\tnormals = new Float32Array(vertexCount * 3);\r\n\t\t\t\tuvs = new Float32Array(vertexCount * 2);\r\n\t\t\t\tmaterials = new Uint8Array(vertexCount);\r\n\r\n\t\t\t\tgenerateVertexIndices(svo.root, positions, normals, 0);\r\n\t\t\t\tcontourCellProc(svo.root, indexBuffer);\r\n\r\n\t\t\t\tresult = new Isosurface(\r\n\t\t\t\t\tnew Uint16Array(indexBuffer),\r\n\t\t\t\t\tpositions,\r\n\t\t\t\t\tnormals,\r\n\t\t\t\t\tuvs,\r\n\t\t\t\t\tmaterials\r\n\t\t\t\t);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Creates intermediate voxel cells down to the leaf octant that is described\r\n\t * by the given local grid coordinates and returns it.\r\n\t *\r\n\t * @private\r\n\t * @param {VoxelCell} cell - The root octant.\r\n\t * @param {Number} n - The grid resolution.\r\n\t * @param {Number} x - A local grid point X-coordinate.\r\n\t * @param {Number} y - A local grid point Y-coordinate.\r\n\t * @param {Number} z - A local grid point Z-coordinate.\r\n\t * @return {VoxelCell} A leaf voxel cell.\r\n\t */\r\n\r\n\tfunction getCell(cell, n, x, y, z) {\r\n\r\n\t\tlet i = 0;\r\n\r\n\t\tfor(n = n >> 1; n > 0; n >>= 1, i = 0) {\r\n\r\n\t\t\t// YZ.\r\n\t\t\tif(x >= n) {\r\n\r\n\t\t\t\ti += 4; x -= n;\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// XZ.\r\n\t\t\tif(y >= n) {\r\n\r\n\t\t\t\ti += 2; y -= n;\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// XY.\r\n\t\t\tif(z >= n) {\r\n\r\n\t\t\t\ti += 1; z -= n;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(cell.children === null) {\r\n\r\n\t\t\t\tcell.split();\r\n\r\n\t\t\t}\r\n\r\n\t\t\tcell = cell.children[i];\r\n\r\n\t\t}\r\n\r\n\t\treturn cell;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Creates a voxel and builds a material configuration code from the materials\r\n\t * in the voxel corners.\r\n\t *\r\n\t * @private\r\n\t * @param {Number} n - The grid resolution.\r\n\t * @param {Number} x - A local grid point X-coordinate.\r\n\t * @param {Number} y - A local grid point Y-coordinate.\r\n\t * @param {Number} z - A local grid point Z-coordinate.\r\n\t * @param {Uint8Array} materialIndices - The material indices.\r\n\t * @return {Voxel} A voxel.\r\n\t */\r\n\r\n\tfunction createVoxel(n, x, y, z, materialIndices) {\r\n\r\n\t\tconst m = n + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst voxel = new Voxel();\r\n\r\n\t\tlet materials, edgeCount;\r\n\t\tlet material, offset, index;\r\n\t\tlet c1, c2, m1, m2;\r\n\r\n\t\tlet i;\r\n\r\n\t\t// Pack the material information of the eight corners into a single byte.\r\n\t\tfor(materials = 0, i = 0; i < 8; ++i) {\r\n\r\n\t\t\t// Translate the coordinates into a one-dimensional grid point index.\r\n\t\t\toffset = pattern[i];\r\n\t\t\tindex = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);\r\n\r\n\t\t\t// Convert the identified material index into a binary value.\r\n\t\t\tmaterial = Math.min(materialIndices[index], Material.SOLID);\r\n\r\n\t\t\t// Store the value in bit i.\r\n\t\t\tmaterials |= (material << i);\r\n\r\n\t\t}\r\n\r\n\t\t// Find out how many edges intersect with the implicit surface.\r\n\t\tfor(edgeCount = 0, i = 0; i < 12; ++i) {\r\n\r\n\t\t\tc1 = edges[i][0];\r\n\t\t\tc2 = edges[i][1];\r\n\r\n\t\t\tm1 = (materials >> c1) & 1;\r\n\t\t\tm2 = (materials >> c2) & 1;\r\n\r\n\t\t\t// Check if there is a material change on the edge.\r\n\t\t\tif(m1 !== m2) {\r\n\r\n\t\t\t\t++edgeCount;\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\tvoxel.materials = materials;\r\n\t\tvoxel.edgeCount = edgeCount;\r\n\t\tvoxel.qefData = new QEFData();\r\n\r\n\t\treturn voxel;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A sparse, cubic voxel octree.\r\n\t */\r\n\r\n\tclass SparseVoxelOctree extends Octree {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new voxel octree.\r\n\t\t *\r\n\t\t * @param {HermiteData} data - A set of volume data.\r\n\t\t * @param {Vector3} [min] - The lower bounds of this octree.\r\n\t\t * @param {Number} [size=1] - The size of this octree.\r\n\t\t */\r\n\r\n\t\tconstructor(data, min = new Vector3(), size = 1) {\r\n\r\n\t\t\tsuper();\r\n\r\n\t\t\t/**\r\n\t\t\t * The root octant.\r\n\t\t\t *\r\n\t\t\t * @type {VoxelCell}\r\n\t\t\t */\r\n\r\n\t\t\tthis.root = new VoxelCell(min, size);\r\n\r\n\t\t\t/**\r\n\t\t\t * The amount of voxels in this octree.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.voxelCount = 0;\r\n\r\n\t\t\tif(data !== null && data.edgeData !== null) {\r\n\r\n\t\t\t\tthis.construct(data);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(VoxelCell.errorThreshold >= 0) {\r\n\r\n\t\t\t\tthis.simplify();\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Attempts to simplify the octree by clustering voxels.\r\n\t\t *\r\n\t\t * @private\r\n\t\t */\r\n\r\n\t\tsimplify() {\r\n\r\n\t\t\tthis.voxelCount -= this.root.collapse();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Constructs voxel cells from volume data.\r\n\t\t *\r\n\t\t * @private\r\n\t\t * @param {HermiteData} data - The volume data.\r\n\t\t */\r\n\r\n\t\tconstruct(data) {\r\n\r\n\t\t\tconst n = HermiteData.resolution;\r\n\t\t\tconst edgeData = data.edgeData;\r\n\t\t\tconst materialIndices = data.materialIndices;\r\n\r\n\t\t\tconst qefSolver = new QEFSolver();\r\n\t\t\tconst intersection = new Vector3();\r\n\r\n\t\t\tconst edgeIterators = [\r\n\t\t\t\tedgeData.edgesX(this.min, this.root.size),\r\n\t\t\t\tedgeData.edgesY(this.min, this.root.size),\r\n\t\t\t\tedgeData.edgesZ(this.min, this.root.size)\r\n\t\t\t];\r\n\r\n\t\t\tconst sequences = [\r\n\t\t\t\tnew Uint8Array([0, 1, 2, 3]),\r\n\t\t\t\tnew Uint8Array([0, 1, 4, 5]),\r\n\t\t\t\tnew Uint8Array([0, 2, 4, 6])\r\n\t\t\t];\r\n\r\n\t\t\tlet voxelCount = 0;\r\n\r\n\t\t\tlet edges, edge;\r\n\t\t\tlet sequence, offset;\r\n\t\t\tlet cell, voxel;\r\n\r\n\t\t\tlet x, y, z;\r\n\t\t\tlet d, i;\r\n\r\n\t\t\t// Process edges X -> Y -> Z.\r\n\t\t\tfor(d = 0; d < 3; ++d) {\r\n\r\n\t\t\t\tsequence = sequences[d];\r\n\t\t\t\tedges = edgeIterators[d];\r\n\r\n\t\t\t\tfor(edge of edges) {\r\n\r\n\t\t\t\t\tedge.computeZeroCrossingPosition(intersection);\r\n\r\n\t\t\t\t\t// Each edge can belong to up to four voxel cells.\r\n\t\t\t\t\tfor(i = 0; i < 4; ++i) {\r\n\r\n\t\t\t\t\t\t// Rotate around the edge.\r\n\t\t\t\t\t\toffset = pattern[sequence[i]];\r\n\r\n\t\t\t\t\t\tx = edge.coordinates.x - offset[0];\r\n\t\t\t\t\t\ty = edge.coordinates.y - offset[1];\r\n\t\t\t\t\t\tz = edge.coordinates.z - offset[2];\r\n\r\n\t\t\t\t\t\t// Check if the adjusted coordinates still lie inside the grid bounds.\r\n\t\t\t\t\t\tif(x >= 0 && y >= 0 && z >= 0 && x < n && y < n && z < n) {\r\n\r\n\t\t\t\t\t\t\tcell = getCell(this.root, n, x, y, z);\r\n\r\n\t\t\t\t\t\t\tif(cell.voxel === null) {\r\n\r\n\t\t\t\t\t\t\t\t// The existence of the edge guarantees that the voxel contains the surface.\r\n\t\t\t\t\t\t\t\tcell.voxel = createVoxel(n, x, y, z, materialIndices);\r\n\r\n\t\t\t\t\t\t\t\t++voxelCount;\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t\t// Add the edge data to the voxel.\r\n\t\t\t\t\t\t\tvoxel = cell.voxel;\r\n\t\t\t\t\t\t\tvoxel.normal.add(edge.n);\r\n\t\t\t\t\t\t\tvoxel.qefData.add(intersection, edge.n);\r\n\r\n\t\t\t\t\t\t\tif(voxel.qefData.numPoints === voxel.edgeCount) {\r\n\r\n\t\t\t\t\t\t\t\t// Finalise the voxel by solving the accumulated data.\r\n\t\t\t\t\t\t\t\tqefSolver.setData(voxel.qefData).solve(voxel.position);\r\n\r\n\t\t\t\t\t\t\t\tif(!cell.contains(voxel.position)) {\r\n\r\n\t\t\t\t\t\t\t\t\tvoxel.position.copy(qefSolver.massPoint);\r\n\r\n\t\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t\t\tvoxel.normal.normalize();\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.voxelCount = voxelCount;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An enumeration of worker actions.\r\n\t *\r\n\t * @type {Object}\r\n\t * @property {String} EXTRACT - Isosurface extraction signal.\r\n\t * @property {String} MODIFY - Data modification signal.\r\n\t * @property {String} CONFIGURE - General configuration signal.\r\n\t * @property {String} CLOSE - Thread termination signal.\r\n\t */\r\n\r\n\tconst Action = {\r\n\r\n\t\tEXTRACT: \"worker.extract\",\r\n\t\tMODIFY: \"worker.modify\",\r\n\t\tCONFIGURE: \"worker.config\",\r\n\t\tCLOSE: \"worker.close\"\r\n\r\n\t};\n\n\t/**\r\n\t * A worker message that contains transferable data.\r\n\t */\r\n\r\n\tclass DataMessage extends Message {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new data message.\r\n\t\t *\r\n\t\t * @param {Action} [action=null] - A worker action.\r\n\t\t */\r\n\r\n\t\tconstructor(action = null) {\r\n\r\n\t\t\tsuper(action);\r\n\r\n\t\t\t/**\r\n\t\t\t * A serialised data container.\r\n\t\t\t *\r\n\t\t\t * @type {Object}\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = null;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An extraction response.\r\n\t */\r\n\r\n\tclass ExtractionResponse extends DataMessage {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new extraction response.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\tsuper(Action.EXTRACT);\r\n\r\n\t\t\t/**\r\n\t\t\t * A serialised isosurface.\r\n\t\t\t *\r\n\t\t\t * @type {Object}\r\n\t\t\t */\r\n\r\n\t\t\tthis.isosurface = null;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An empty set of Hermite data.\r\n\t *\r\n\t * @type {HermiteData}\r\n\t * @private\r\n\t * @final\r\n\t */\r\n\r\n\tconst data = new HermiteData(false);\r\n\r\n\t/**\r\n\t * A volume data processor.\r\n\t *\r\n\t * @implements {TransferableContainer}\r\n\t */\r\n\r\n\tclass DataProcessor {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new data processor.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * A set of Hermite data that will be used during processing.\r\n\t\t\t *\r\n\t\t\t * @type {HermiteData}\r\n\t\t\t * @protected\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * A container for the data that will be returned to the main thread.\r\n\t\t\t *\r\n\t\t\t * @type {DataMessage}\r\n\t\t\t * @protected\r\n\t\t\t */\r\n\r\n\t\t\tthis.response = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns the data of this processor.\r\n\t\t *\r\n\t\t * @return {HermiteData} The data.\r\n\t\t */\r\n\r\n\t\tgetData() {\r\n\r\n\t\t\treturn this.data;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Prepares a response that can be send back to the main thread.\r\n\t\t *\r\n\t\t * Should be used together with {@link DataProcessor#createTransferList}.\r\n\t\t *\r\n\t\t * @return {DataMessage} A response.\r\n\t\t */\r\n\r\n\t\trespond() {\r\n\r\n\t\t\tthis.response.data = this.data.serialize();\r\n\r\n\t\t\treturn this.response;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.\r\n\t\t * @return {Transferable[]} The transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\tif(this.data !== null) {\r\n\r\n\t\t\t\tthis.data.createTransferList(transferList);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Processes the given request.\r\n\t\t *\r\n\t\t * @param {DataMessage} request - A request.\r\n\t\t * @return {DataProcessor} This processor.\r\n\t\t */\r\n\r\n\t\tprocess(request) {\r\n\r\n\t\t\tthis.data = data.deserialize(request.data);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A surface extractor that generates a polygonal mesh from Hermite data.\r\n\t */\r\n\r\n\tclass SurfaceExtractor extends DataProcessor {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new surface extractor.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\tsuper();\r\n\r\n\t\t\t/**\r\n\t\t\t * A container for the data that will be returned to the main thread.\r\n\t\t\t *\r\n\t\t\t * @type {ExtractionResponse}\r\n\t\t\t */\r\n\r\n\t\t\tthis.response = new ExtractionResponse();\r\n\r\n\t\t\t/**\r\n\t\t\t * A target container for decompressed data.\r\n\t\t\t *\r\n\t\t\t * @type {HermiteData}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.decompressionTarget = new HermiteData(false);\r\n\r\n\t\t\t/**\r\n\t\t\t * The result of the isosurface extraction process.\r\n\t\t\t *\r\n\t\t\t * @type {Isosurface}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.isosurface = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Prepares a response that can be send back to the main thread.\r\n\t\t *\r\n\t\t * Should be used together with {@link SurfaceExtractor#createTransferList}.\r\n\t\t *\r\n\t\t * @return {ExtractionResponse} A response.\r\n\t\t */\r\n\r\n\t\trespond() {\r\n\r\n\t\t\tconst response = super.respond();\r\n\r\n\t\t\tresponse.isosurface = (this.isosurface !== null) ? this.isosurface.serialise() : null;\r\n\r\n\t\t\treturn response;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.\r\n\t\t * @return {Transferable[]} The transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\tsuper.createTransferList(transferList);\r\n\r\n\t\t\treturn (this.isosurface !== null) ? this.isosurface.createTransferList(transferList) : transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Extracts a surface from the given Hermite data.\r\n\t\t *\r\n\t\t * @param {ExtractionRequest} request - An extraction request.\r\n\t\t */\r\n\r\n\t\tprocess(request) {\r\n\r\n\t\t\t// Adopt the provided data.\r\n\t\t\tconst data = super.process(request).getData();\r\n\r\n\t\t\t// Decompress the data and build an SVO.\r\n\t\t\tconst svo = new SparseVoxelOctree(data.decompress(this.decompressionTarget));\r\n\r\n\t\t\t// Generate the isosurface.\r\n\t\t\tthis.isosurface = DualContouring.run(svo);\r\n\r\n\t\t\t// Release the decompressed data.\r\n\t\t\tthis.decompressionTarget.clear();\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An enumeration of CSG operation types.\r\n\t *\r\n\t * @type {Object}\r\n\t * @property {String} UNION - Indicates a union of volume data.\r\n\t * @property {String} DIFFERENCE - Indicates a subtraction of volume data.\r\n\t * @property {String} INTERSECTION - Indicates an intersection of volume data.\r\n\t * @property {String} DENSITY_FUNCTION - Indicates volume data generation.\r\n\t */\r\n\r\n\tconst OperationType = {\r\n\r\n\t\tUNION: \"csg.union\",\r\n\t\tDIFFERENCE: \"csg.difference\",\r\n\t\tINTERSECTION: \"csg.intersection\",\r\n\t\tDENSITY_FUNCTION: \"csg.densityfunction\"\r\n\r\n\t};\n\n\t/**\r\n\t * A CSG operation.\r\n\t */\r\n\r\n\tclass Operation {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new operation.\r\n\t\t *\r\n\t\t * @param {OperationType} type - The type of this operation.\r\n\t\t * @param {Operation} ...children - Child operations.\r\n\t\t */\r\n\r\n\t\tconstructor(type, ...children) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The type of this operation.\r\n\t\t\t *\r\n\t\t\t * @type {OperationType}\r\n\t\t\t */\r\n\r\n\t\t\tthis.type = type;\r\n\r\n\t\t\t/**\r\n\t\t\t * A list of operations.\r\n\t\t\t *\r\n\t\t\t * Right-hand side operands have precedence, meaning that the result of the\r\n\t\t\t * first item in the list will be dominated by the result of the second one,\r\n\t\t\t * etc.\r\n\t\t\t *\r\n\t\t\t * @type {Operation[]}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.children = children;\r\n\r\n\t\t\t/**\r\n\t\t\t * The bounding box of this operation.\r\n\t\t\t *\r\n\t\t\t * @type {Box3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.boundingBox = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the complete bounding box of this CSG operation if it doesn't\r\n\t\t * exist yet and returns it.\r\n\t\t *\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tgetBoundingBox() {\r\n\r\n\t\t\tif(this.boundingBox === null) {\r\n\r\n\t\t\t\tthis.boundingBox = this.computeBoundingBox();\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this.boundingBox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this CSG operation while taking all child\r\n\t\t * operations into account.\r\n\t\t *\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tconst children = this.children;\r\n\t\t\tconst boundingBox = new Box3();\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\tboundingBox.union(children[i].getBoundingBox());\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn boundingBox;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A union operation.\r\n\t */\r\n\r\n\tclass Union extends Operation {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new union operation.\r\n\t\t *\r\n\t\t * @param {...Operation} children - Child operations.\r\n\t\t */\r\n\r\n\t\tconstructor(...children) {\r\n\r\n\t\t\tsuper(OperationType.UNION, ...children);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Updates the specified material index.\r\n\t\t *\r\n\t\t * @param {Number} index - The index of the material index that needs to be updated.\r\n\t\t * @param {HermiteData} data0 - The target volume data.\r\n\t\t * @param {HermiteData} data1 - Predominant volume data.\r\n\t\t */\r\n\r\n\t\tupdateMaterialIndex(index, data0, data1) {\r\n\r\n\t\t\tconst materialIndex = data1.materialIndices[index];\r\n\r\n\t\t\tif(materialIndex !== Material.AIR) {\r\n\r\n\t\t\t\tdata0.setMaterialIndex(index, materialIndex);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Selects the edge that is closer to the non-solid grid point.\r\n\t\t *\r\n\t\t * @param {Edge} edge0 - An existing edge.\r\n\t\t * @param {Edge} edge1 - A predominant edge.\r\n\t\t * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n\t\t * @return {Edge} The selected edge.\r\n\t\t */\r\n\r\n\t\tselectEdge(edge0, edge1, s) {\r\n\r\n\t\t\treturn s ?\r\n\t\t\t\t((edge0.t > edge1.t) ? edge0 : edge1) :\r\n\t\t\t\t((edge0.t < edge1.t) ? edge0 : edge1);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A difference operation.\r\n\t */\r\n\r\n\tclass Difference extends Operation {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new difference operation.\r\n\t\t *\r\n\t\t * @param {Operation} ...children - Child operations.\r\n\t\t */\r\n\r\n\t\tconstructor(...children) {\r\n\r\n\t\t\tsuper(OperationType.DIFFERENCE, ...children);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Updates the specified material index.\r\n\t\t *\r\n\t\t * @param {Number} index - The index of the material index that needs to be updated.\r\n\t\t * @param {HermiteData} data0 - The target volume data.\r\n\t\t * @param {HermiteData} data1 - Predominant volume data.\r\n\t\t */\r\n\r\n\t\tupdateMaterialIndex(index, data0, data1) {\r\n\r\n\t\t\tif(data1.materialIndices[index] !== Material.AIR) {\r\n\r\n\t\t\t\tdata0.setMaterialIndex(index, Material.AIR);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Selects the edge that is closer to the solid grid point.\r\n\t\t *\r\n\t\t * @param {Edge} edge0 - An existing edge.\r\n\t\t * @param {Edge} edge1 - A predominant edge.\r\n\t\t * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n\t\t * @return {Edge} The selected edge.\r\n\t\t */\r\n\r\n\t\tselectEdge(edge0, edge1, s) {\r\n\r\n\t\t\treturn s ?\r\n\t\t\t\t((edge0.t < edge1.t) ? edge0 : edge1) :\r\n\t\t\t\t((edge0.t > edge1.t) ? edge0 : edge1);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An intersection operation.\r\n\t */\r\n\r\n\tclass Intersection extends Operation {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new intersection operation.\r\n\t\t *\r\n\t\t * @param {...Operation} children - Child operations.\r\n\t\t */\r\n\r\n\t\tconstructor(...children) {\r\n\r\n\t\t\tsuper(OperationType.INTERSECTION, ...children);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Updates the specified material index.\r\n\t\t *\r\n\t\t * @param {Number} index - The index of the material index that needs to be updated.\r\n\t\t * @param {HermiteData} data0 - The target volume data.\r\n\t\t * @param {HermiteData} data1 - Predominant volume data.\r\n\t\t */\r\n\r\n\t\tupdateMaterialIndex(index, data0, data1) {\r\n\r\n\t\t\tconst materialIndex = data1.materialIndices[index];\r\n\r\n\t\t\tdata0.setMaterialIndex(index, (data0.materialIndices[index] !== Material.AIR && materialIndex !== Material.AIR) ? materialIndex : Material.AIR);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Selects the edge that is closer to the solid grid point.\r\n\t\t *\r\n\t\t * @param {Edge} edge0 - An existing edge.\r\n\t\t * @param {Edge} edge1 - A predominant edge.\r\n\t\t * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n\t\t * @return {Edge} The selected edge.\r\n\t\t */\r\n\r\n\t\tselectEdge(edge0, edge1, s) {\r\n\r\n\t\t\treturn s ?\r\n\t\t\t\t((edge0.t < edge1.t) ? edge0 : edge1) :\r\n\t\t\t\t((edge0.t > edge1.t) ? edge0 : edge1);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * The world size of the current data cell.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tlet cellSize = 0;\r\n\r\n\t/**\r\n\t * The lower bounds of the current data cell.\r\n\t *\r\n\t * @type {Vector3}\r\n\t * @private\r\n\t */\r\n\r\n\tconst cellPosition = new Vector3();\r\n\r\n\t/**\r\n\t * Finds out which grid points lie inside the area of the given operation.\r\n\t *\r\n\t * @private\r\n\t * @param {Operation} operation - A CSG operation.\r\n\t * @return {Box3} The index bounds.\r\n\t */\r\n\r\n\tfunction computeIndexBounds(operation) {\r\n\r\n\t\tconst s = cellSize;\r\n\t\tconst n = HermiteData.resolution;\r\n\r\n\t\tconst min = new Vector3(0, 0, 0);\r\n\t\tconst max = new Vector3(n, n, n);\r\n\r\n\t\tconst cellBounds = new Box3(cellPosition, cellPosition.clone().addScalar(cellSize));\r\n\t\tconst operationBounds = operation.getBoundingBox();\r\n\r\n\t\tif(operation.type !== OperationType.INTERSECTION) {\r\n\r\n\t\t\tif(operationBounds.intersectsBox(cellBounds)) {\r\n\r\n\t\t\t\tmin.copy(operationBounds.min).max(cellBounds.min).sub(cellBounds.min);\r\n\r\n\t\t\t\tmin.x = Math.ceil(min.x * n / s);\r\n\t\t\t\tmin.y = Math.ceil(min.y * n / s);\r\n\t\t\t\tmin.z = Math.ceil(min.z * n / s);\r\n\r\n\t\t\t\tmax.copy(operationBounds.max).min(cellBounds.max).sub(cellBounds.min);\r\n\r\n\t\t\t\tmax.x = Math.floor(max.x * n / s);\r\n\t\t\t\tmax.y = Math.floor(max.y * n / s);\r\n\t\t\t\tmax.z = Math.floor(max.z * n / s);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\t// The chunk is unaffected by this operation.\r\n\t\t\t\tmin.set(n, n, n);\r\n\t\t\t\tmax.set(0, 0, 0);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\treturn new Box3(min, max);\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Combines material indices.\r\n\t *\r\n\t * @private\r\n\t * @param {Operation} operation - A CSG operation.\r\n\t * @param {HermiteData} data0 - A target data set.\r\n\t * @param {HermiteData} data1 - A predominant data set.\r\n\t * @param {Box3} bounds - Grid iteration limits.\r\n\t */\r\n\r\n\tfunction combineMaterialIndices(operation, data0, data1, bounds) {\r\n\r\n\t\tconst n = HermiteData.resolution;\r\n\t\tconst m = n + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst X = bounds.max.x;\r\n\t\tconst Y = bounds.max.y;\r\n\t\tconst Z = bounds.max.z;\r\n\r\n\t\tlet x, y, z;\r\n\r\n\t\tfor(z = bounds.min.z; z <= Z; ++z) {\r\n\r\n\t\t\tfor(y = bounds.min.y; y <= Y; ++y) {\r\n\r\n\t\t\t\tfor(x = bounds.min.x; x <= X; ++x) {\r\n\r\n\t\t\t\t\toperation.updateMaterialIndex((z * mm + y * m + x), data0, data1);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Generates material indices.\r\n\t *\r\n\t * @private\r\n\t * @param {DensityFunction} operation - A CSG operation.\r\n\t * @param {HermiteData} data - A target data set.\r\n\t * @param {Box3} bounds - Grid iteration limits.\r\n\t */\r\n\r\n\tfunction generateMaterialIndices(operation, data, bounds) {\r\n\r\n\t\tconst s = cellSize;\r\n\t\tconst n = HermiteData.resolution;\r\n\t\tconst m = n + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst materialIndices = data.materialIndices;\r\n\r\n\t\tconst base = cellPosition;\r\n\t\tconst offset = new Vector3();\r\n\t\tconst position = new Vector3();\r\n\r\n\t\tconst X = bounds.max.x;\r\n\t\tconst Y = bounds.max.y;\r\n\t\tconst Z = bounds.max.z;\r\n\r\n\t\tlet materialIndex;\r\n\t\tlet materials = 0;\r\n\r\n\t\tlet x, y, z;\r\n\r\n\t\tfor(z = bounds.min.z; z <= Z; ++z) {\r\n\r\n\t\t\toffset.z = z * s / n;\r\n\r\n\t\t\tfor(y = bounds.min.y; y <= Y; ++y) {\r\n\r\n\t\t\t\toffset.y = y * s / n;\r\n\r\n\t\t\t\tfor(x = bounds.min.x; x <= X; ++x) {\r\n\r\n\t\t\t\t\toffset.x = x * s / n;\r\n\r\n\t\t\t\t\tmaterialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));\r\n\r\n\t\t\t\t\tif(materialIndex !== Material.AIR) {\r\n\r\n\t\t\t\t\t\tmaterialIndices[z * mm + y * m + x] = materialIndex;\r\n\r\n\t\t\t\t\t\t++materials;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\tdata.materials = materials;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Combines edges.\r\n\t *\r\n\t * @private\r\n\t * @param {Operation} operation - A CSG operation.\r\n\t * @param {HermiteData} data0 - A target data set.\r\n\t * @param {HermiteData} data1 - A predominant data set.\r\n\t * @return {Object} The generated edge data.\r\n\t */\r\n\r\n\tfunction combineEdges(operation, data0, data1) {\r\n\r\n\t\tconst n = HermiteData.resolution;\r\n\t\tconst m = n + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst indexOffsets = new Uint32Array([1, m, mm]);\r\n\t\tconst materialIndices = data0.materialIndices;\r\n\r\n\t\tconst edge1 = new Edge();\r\n\t\tconst edge0 = new Edge();\r\n\r\n\t\tconst edgeData1 = data1.edgeData;\r\n\t\tconst edgeData0 = data0.edgeData;\r\n\r\n\t\tconst lengths = new Uint32Array(3);\r\n\t\tconst edgeCount = EdgeData.calculate1DEdgeCount(n);\r\n\r\n\t\tconst edgeData = new EdgeData(\r\n\t\t\tMath.min(edgeCount, edgeData0.indices[0].length + edgeData1.indices[0].length),\r\n\t\t\tMath.min(edgeCount, edgeData0.indices[1].length + edgeData1.indices[1].length),\r\n\t\t\tMath.min(edgeCount, edgeData0.indices[2].length + edgeData1.indices[2].length)\r\n\t\t);\r\n\r\n\t\tlet edges1, zeroCrossings1, normals1;\r\n\t\tlet edges0, zeroCrossings0, normals0;\r\n\t\tlet edges, zeroCrossings, normals;\r\n\t\tlet indexOffset;\r\n\r\n\t\tlet indexA1, indexB1;\r\n\t\tlet indexA0, indexB0;\r\n\r\n\t\tlet m1, m2;\r\n\t\tlet edge;\r\n\r\n\t\tlet c, d, i, j, il, jl;\r\n\r\n\t\t// Process the edges along the X-axis, then Y and finally Z.\r\n\t\tfor(c = 0, d = 0; d < 3; c = 0, ++d) {\r\n\r\n\t\t\tedges1 = edgeData1.indices[d];\r\n\t\t\tedges0 = edgeData0.indices[d];\r\n\t\t\tedges = edgeData.indices[d];\r\n\r\n\t\t\tzeroCrossings1 = edgeData1.zeroCrossings[d];\r\n\t\t\tzeroCrossings0 = edgeData0.zeroCrossings[d];\r\n\t\t\tzeroCrossings = edgeData.zeroCrossings[d];\r\n\r\n\t\t\tnormals1 = edgeData1.normals[d];\r\n\t\t\tnormals0 = edgeData0.normals[d];\r\n\t\t\tnormals = edgeData.normals[d];\r\n\r\n\t\t\tindexOffset = indexOffsets[d];\r\n\r\n\t\t\til = edges1.length;\r\n\t\t\tjl = edges0.length;\r\n\r\n\t\t\t// Process all generated edges.\r\n\t\t\tfor(i = 0, j = 0; i < il; ++i) {\r\n\r\n\t\t\t\tindexA1 = edges1[i];\r\n\t\t\t\tindexB1 = indexA1 + indexOffset;\r\n\r\n\t\t\t\tm1 = materialIndices[indexA1];\r\n\t\t\t\tm2 = materialIndices[indexB1];\r\n\r\n\t\t\t\tif(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\r\n\r\n\t\t\t\t\tedge1.t = zeroCrossings1[i];\r\n\t\t\t\t\tedge1.n.x = normals1[i * 3];\r\n\t\t\t\t\tedge1.n.y = normals1[i * 3 + 1];\r\n\t\t\t\t\tedge1.n.z = normals1[i * 3 + 2];\r\n\r\n\t\t\t\t\tif(operation.type === OperationType.DIFFERENCE) {\r\n\r\n\t\t\t\t\t\tedge1.n.negate();\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tedge = edge1;\r\n\r\n\t\t\t\t\t// Process existing edges up to the generated edge.\r\n\t\t\t\t\twhile(j < jl && edges0[j] <= indexA1) {\r\n\r\n\t\t\t\t\t\tindexA0 = edges0[j];\r\n\t\t\t\t\t\tindexB0 = indexA0 + indexOffset;\r\n\r\n\t\t\t\t\t\tedge0.t = zeroCrossings0[j];\r\n\t\t\t\t\t\tedge0.n.x = normals0[j * 3];\r\n\t\t\t\t\t\tedge0.n.y = normals0[j * 3 + 1];\r\n\t\t\t\t\t\tedge0.n.z = normals0[j * 3 + 2];\r\n\r\n\t\t\t\t\t\tm1 = materialIndices[indexA0];\r\n\r\n\t\t\t\t\t\tif(indexA0 < indexA1) {\r\n\r\n\t\t\t\t\t\t\tm2 = materialIndices[indexB0];\r\n\r\n\t\t\t\t\t\t\tif(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\r\n\r\n\t\t\t\t\t\t\t\t// The edge exhibits a material change and there is no conflict.\r\n\t\t\t\t\t\t\t\tedges[c] = indexA0;\r\n\t\t\t\t\t\t\t\tzeroCrossings[c] = edge0.t;\r\n\t\t\t\t\t\t\t\tnormals[c * 3] = edge0.n.x;\r\n\t\t\t\t\t\t\t\tnormals[c * 3 + 1] = edge0.n.y;\r\n\t\t\t\t\t\t\t\tnormals[c * 3 + 2] = edge0.n.z;\r\n\r\n\t\t\t\t\t\t\t\t++c;\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t\t// Resolve the conflict.\r\n\t\t\t\t\t\t\tedge = operation.selectEdge(edge0, edge1, (m1 === Material.SOLID));\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t++j;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tedges[c] = indexA1;\r\n\t\t\t\t\tzeroCrossings[c] = edge.t;\r\n\t\t\t\t\tnormals[c * 3] = edge.n.x;\r\n\t\t\t\t\tnormals[c * 3 + 1] = edge.n.y;\r\n\t\t\t\t\tnormals[c * 3 + 2] = edge.n.z;\r\n\r\n\t\t\t\t\t++c;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Collect remaining edges.\r\n\t\t\twhile(j < jl) {\r\n\r\n\t\t\t\tindexA0 = edges0[j];\r\n\t\t\t\tindexB0 = indexA0 + indexOffset;\r\n\r\n\t\t\t\tm1 = materialIndices[indexA0];\r\n\t\t\t\tm2 = materialIndices[indexB0];\r\n\r\n\t\t\t\tif(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\r\n\r\n\t\t\t\t\tedges[c] = indexA0;\r\n\t\t\t\t\tzeroCrossings[c] = zeroCrossings0[j];\r\n\t\t\t\t\tnormals[c * 3] = normals0[j * 3];\r\n\t\t\t\t\tnormals[c * 3 + 1] = normals0[j * 3 + 1];\r\n\t\t\t\t\tnormals[c * 3 + 2] = normals0[j * 3 + 2];\r\n\r\n\t\t\t\t\t++c;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\t++j;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tlengths[d] = c;\r\n\r\n\t\t}\r\n\r\n\t\treturn { edgeData, lengths };\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Generates edge data.\r\n\t *\r\n\t * @private\r\n\t * @param {DensityFunction} operation - A CSG operation.\r\n\t * @param {HermiteData} data - A target data set.\r\n\t * @param {Box3} bounds - Grid iteration limits.\r\n\t * @return {Object} The generated edge data.\r\n\t */\r\n\r\n\tfunction generateEdges(operation, data, bounds) {\r\n\r\n\t\tconst s = cellSize;\r\n\t\tconst n = HermiteData.resolution;\r\n\t\tconst m = n + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst indexOffsets = new Uint32Array([1, m, mm]);\r\n\t\tconst materialIndices = data.materialIndices;\r\n\r\n\t\tconst base = cellPosition;\r\n\t\tconst offsetA = new Vector3();\r\n\t\tconst offsetB = new Vector3();\r\n\t\tconst edge = new Edge();\r\n\r\n\t\tconst lengths = new Uint32Array(3);\r\n\t\tconst edgeData = new EdgeData(EdgeData.calculate1DEdgeCount(n));\r\n\r\n\t\tlet edges, zeroCrossings, normals, indexOffset;\r\n\t\tlet indexA, indexB;\r\n\r\n\t\tlet minX, minY, minZ;\r\n\t\tlet maxX, maxY, maxZ;\r\n\r\n\t\tlet c, d, a, axis;\r\n\t\tlet x, y, z;\r\n\r\n\t\t// Process the edges along the X-axis, then Y and finally Z.\r\n\t\tfor(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {\r\n\r\n\t\t\t// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].\r\n\t\t\taxis = pattern[a];\r\n\r\n\t\t\tedges = edgeData.indices[d];\r\n\t\t\tzeroCrossings = edgeData.zeroCrossings[d];\r\n\t\t\tnormals = edgeData.normals[d];\r\n\t\t\tindexOffset = indexOffsets[d];\r\n\r\n\t\t\tminX = bounds.min.x; maxX = bounds.max.x;\r\n\t\t\tminY = bounds.min.y; maxY = bounds.max.y;\r\n\t\t\tminZ = bounds.min.z; maxZ = bounds.max.z;\r\n\r\n\t\t\t/* Include edges that straddle the bounding box and avoid processing grid\r\n\t\t\tpoints at chunk borders. */\r\n\t\t\tswitch(d) {\r\n\r\n\t\t\t\tcase 0:\r\n\t\t\t\t\tminX = Math.max(minX - 1, 0);\r\n\t\t\t\t\tmaxX = Math.min(maxX, n - 1);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase 1:\r\n\t\t\t\t\tminY = Math.max(minY - 1, 0);\r\n\t\t\t\t\tmaxY = Math.min(maxY, n - 1);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase 2:\r\n\t\t\t\t\tminZ = Math.max(minZ - 1, 0);\r\n\t\t\t\t\tmaxZ = Math.min(maxZ, n - 1);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tfor(z = minZ; z <= maxZ; ++z) {\r\n\r\n\t\t\t\tfor(y = minY; y <= maxY; ++y) {\r\n\r\n\t\t\t\t\tfor(x = minX; x <= maxX; ++x) {\r\n\r\n\t\t\t\t\t\tindexA = z * mm + y * m + x;\r\n\t\t\t\t\t\tindexB = indexA + indexOffset;\r\n\r\n\t\t\t\t\t\t// Check if the edge exhibits a material change.\r\n\t\t\t\t\t\tif(materialIndices[indexA] !== materialIndices[indexB]) {\r\n\r\n\t\t\t\t\t\t\toffsetA.set(\r\n\t\t\t\t\t\t\t\tx * s / n,\r\n\t\t\t\t\t\t\t\ty * s / n,\r\n\t\t\t\t\t\t\t\tz * s / n\r\n\t\t\t\t\t\t\t);\r\n\r\n\t\t\t\t\t\t\toffsetB.set(\r\n\t\t\t\t\t\t\t\t(x + axis[0]) * s / n,\r\n\t\t\t\t\t\t\t\t(y + axis[1]) * s / n,\r\n\t\t\t\t\t\t\t\t(z + axis[2]) * s / n\r\n\t\t\t\t\t\t\t);\r\n\r\n\t\t\t\t\t\t\tedge.a.addVectors(base, offsetA);\r\n\t\t\t\t\t\t\tedge.b.addVectors(base, offsetB);\r\n\r\n\t\t\t\t\t\t\t// Create and store the edge data.\r\n\t\t\t\t\t\t\toperation.generateEdge(edge);\r\n\r\n\t\t\t\t\t\t\tedges[c] = indexA;\r\n\t\t\t\t\t\t\tzeroCrossings[c] = edge.t;\r\n\t\t\t\t\t\t\tnormals[c * 3] = edge.n.x;\r\n\t\t\t\t\t\t\tnormals[c * 3 + 1] = edge.n.y;\r\n\t\t\t\t\t\t\tnormals[c * 3 + 2] = edge.n.z;\r\n\r\n\t\t\t\t\t\t\t++c;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tlengths[d] = c;\r\n\r\n\t\t}\r\n\r\n\t\treturn { edgeData, lengths };\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Either generates or combines volume data based on the operation type.\r\n\t *\r\n\t * @private\r\n\t * @param {Operation} operation - A CSG operation.\r\n\t * @param {HermiteData} data0 - A target data set. May be empty or full.\r\n\t * @param {HermiteData} [data1] - A predominant data set. Cannot be null.\r\n\t */\r\n\r\n\tfunction update(operation, data0, data1) {\r\n\r\n\t\tconst bounds = computeIndexBounds(operation);\r\n\r\n\t\tlet result, edgeData, lengths, d;\r\n\t\tlet done = false;\r\n\r\n\t\t// Grid points.\r\n\t\tif(operation.type === OperationType.DENSITY_FUNCTION) {\r\n\r\n\t\t\tgenerateMaterialIndices(operation, data0, bounds);\r\n\r\n\t\t} else if(data0.empty) {\r\n\r\n\t\t\tif(operation.type === OperationType.UNION) {\r\n\r\n\t\t\t\tdata0.set(data1);\r\n\t\t\t\tdone = true;\r\n\r\n\t\t\t}\r\n\r\n\t\t} else {\r\n\r\n\t\t\tif(!(data0.full && operation.type === OperationType.UNION)) {\r\n\r\n\t\t\t\tcombineMaterialIndices(operation, data0, data1, bounds);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t// Edges.\r\n\t\tif(!done && !data0.empty && !data0.full) {\r\n\r\n\t\t\tresult = (operation.type === OperationType.DENSITY_FUNCTION) ?\r\n\t\t\t\tgenerateEdges(operation, data0, bounds) :\r\n\t\t\t\tcombineEdges(operation, data0, data1);\r\n\r\n\t\t\tedgeData = result.edgeData;\r\n\t\t\tlengths = result.lengths;\r\n\r\n\t\t\t// Cut off empty data.\r\n\t\t\tfor(d = 0; d < 3; ++d) {\r\n\r\n\t\t\t\tedgeData.indices[d] = edgeData.indices[d].slice(0, lengths[d]);\r\n\t\t\t\tedgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);\r\n\t\t\t\tedgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tdata0.edgeData = edgeData;\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Executes the given operation to generate data.\r\n\t *\r\n\t * @private\r\n\t * @param {Operation} operation - An operation.\r\n\t * @return {HermiteData} The generated data or null if the data is empty.\r\n\t */\r\n\r\n\tfunction execute(operation) {\r\n\r\n\t\tconst children = operation.children;\r\n\r\n\t\tlet result, data;\r\n\t\tlet i, l;\r\n\r\n\t\tif(operation.type === OperationType.DENSITY_FUNCTION) {\r\n\r\n\t\t\t// Create a data target.\r\n\t\t\tresult = new HermiteData();\r\n\r\n\t\t\t// Use the density function to generate data.\r\n\t\t\tupdate(operation, result);\r\n\r\n\t\t}\r\n\r\n\t\t// Union, Difference or Intersection.\r\n\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t// Generate the full result of the child operation recursively.\r\n\t\t\tdata = execute(children[i]);\r\n\r\n\t\t\tif(result === undefined) {\r\n\r\n\t\t\t\tresult = data;\r\n\r\n\t\t\t} else if(data !== null) {\r\n\r\n\t\t\t\tif(result === null) {\r\n\r\n\t\t\t\t\tif(operation.type === OperationType.UNION) {\r\n\r\n\t\t\t\t\t\t// Build upon the first non-empty data.\r\n\t\t\t\t\t\tresult = data;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\t// Combine the two data sets.\r\n\t\t\t\t\tupdate(operation, result, data);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else if(operation.type === OperationType.INTERSECTION) {\r\n\r\n\t\t\t\t// An intersection with nothing results in nothing.\r\n\t\t\t\tresult = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(result === null && operation.type !== OperationType.UNION) {\r\n\r\n\t\t\t\t// Further subtractions and intersections would have no effect.\r\n\t\t\t\tbreak;\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\treturn (result !== null && result.empty) ? null : result;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Constructive Solid Geometry combines Signed Distance Functions by using\r\n\t * Boolean operators to generate and transform volume data.\r\n\t */\r\n\r\n\tclass ConstructiveSolidGeometry {\r\n\r\n\t\t/**\r\n\t\t * Transforms the given Hermite data in two steps:\r\n\t\t *\r\n\t\t *  1. Generate data by executing the given SDF\r\n\t\t *  2. Combine the generated data with the given data\r\n\t\t *\r\n\t\t * @param {Number[]} min - The lower bounds of the volume data cell.\r\n\t\t * @param {Number} size - The size of the volume data cell.\r\n\t\t * @param {HermiteData} data - The volume data that should be modified.\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t * @return {HermiteData} The modified, uncompressed data or null if the result is empty.\r\n\t\t */\r\n\r\n\t\tstatic run(min, size, data, sdf) {\r\n\r\n\t\t\tcellPosition.fromArray(min);\r\n\t\t\tcellSize = size;\r\n\r\n\t\t\tif(data === null) {\r\n\r\n\t\t\t\tif(sdf.operation === OperationType.UNION) {\r\n\r\n\t\t\t\t\t// Prepare an empty target.\r\n\t\t\t\t\tdata = new HermiteData(false);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tdata.decompress();\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Step 1.\r\n\t\t\tlet operation = sdf.toCSG();\r\n\r\n\t\t\tconst generatedData = (data !== null) ? execute(operation) : null;\r\n\r\n\t\t\tif(generatedData !== null) {\r\n\r\n\t\t\t\t// Wrap the operation in a super operation.\r\n\t\t\t\tswitch(sdf.operation) {\r\n\r\n\t\t\t\t\tcase OperationType.UNION:\r\n\t\t\t\t\t\toperation = new Union(operation);\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\tcase OperationType.DIFFERENCE:\r\n\t\t\t\t\t\toperation = new Difference(operation);\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\tcase OperationType.INTERSECTION:\r\n\t\t\t\t\t\toperation = new Intersection(operation);\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\t// Step 2.\r\n\t\t\t\tupdate(operation, data, generatedData);\r\n\r\n\t\t\t\t// Provoke an isosurface extraction.\r\n\t\t\t\tdata.contoured = false;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn (data !== null && data.empty) ? null : data;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * The isovalue.\r\n\t *\r\n\t * @type {Number}\r\n\t * @private\r\n\t */\r\n\r\n\tconst ISOVALUE = 0.0;\r\n\r\n\t/**\r\n\t * An operation that describes a density field.\r\n\t */\r\n\r\n\tclass DensityFunction extends Operation {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new density function operation.\r\n\t\t *\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t */\r\n\r\n\t\tconstructor(sdf) {\r\n\r\n\t\t\tsuper(OperationType.DENSITY_FUNCTION);\r\n\r\n\t\t\t/**\r\n\t\t\t * An SDF.\r\n\t\t\t *\r\n\t\t\t * @type {SignedDistanceFunction}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.sdf = sdf;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this density function.\r\n\t\t *\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\treturn this.sdf.getBoundingBox(true);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the material index for the given world position.\r\n\t\t *\r\n\t\t * @param {Vector3} position - The world position of the material index.\r\n\t\t * @return {Number} The material index.\r\n\t\t */\r\n\r\n\t\tgenerateMaterialIndex(position) {\r\n\r\n\t\t\treturn (this.sdf.sample(position) <= ISOVALUE) ? this.sdf.material : Material.AIR;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Generates surface intersection data for the specified edge.\r\n\t\t *\r\n\t\t * @param {Edge} edge - The edge that should be processed.\r\n\t\t */\r\n\r\n\t\tgenerateEdge(edge) {\r\n\r\n\t\t\tedge.approximateZeroCrossing(this.sdf);\r\n\t\t\tedge.computeSurfaceNormal(this.sdf);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A matrix.\r\n\t *\r\n\t * @type {Matrix4}\r\n\t * @private\r\n\t */\r\n\r\n\tconst m$2 = new Matrix4();\r\n\r\n\t/**\r\n\t * An abstract Signed Distance Function.\r\n\t *\r\n\t * An SDF describes the signed Euclidean distance to the surface of an object,\r\n\t * effectively describing its density at every point in 3D space. It yields\r\n\t * negative values for points that lie inside the volume and positive values\r\n\t * for points outside. The value is zero at the exact boundary of the object.\r\n\t *\r\n\t * @implements {Serializable}\r\n\t * @implements {TransferableContainer}\r\n\t */\r\n\r\n\tclass SignedDistanceFunction {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new base SDF.\r\n\t\t *\r\n\t\t * @param {SDFType} type - The type of the SDF.\r\n\t\t * @param {Number} [material=Material.SOLID] - A material index. Must be an integer in the range of 1 to 255.\r\n\t\t */\r\n\r\n\t\tconstructor(type, material = Material.SOLID) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The type of this SDF.\r\n\t\t\t *\r\n\t\t\t * @type {SDFType}\r\n\t\t\t */\r\n\r\n\t\t\tthis.type = type;\r\n\r\n\t\t\t/**\r\n\t\t\t * The operation type.\r\n\t\t\t *\r\n\t\t\t * @type {OperationType}\r\n\t\t\t */\r\n\r\n\t\t\tthis.operation = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * A material index.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t */\r\n\r\n\t\t\tthis.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));\r\n\r\n\t\t\t/**\r\n\t\t\t * The axis-aligned bounding box of this SDF.\r\n\t\t\t *\r\n\t\t\t * @type {Box3}\r\n\t\t\t * @protected\r\n\t\t\t */\r\n\r\n\t\t\tthis.boundingBox = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The positional translation.\r\n\t\t\t *\r\n\t\t\t * Call {@link updateInverseTransformation} after changing this field.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.position = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * The rotation.\r\n\t\t\t *\r\n\t\t\t * Call {@link updateInverseTransformation} after changing this field.\r\n\t\t\t *\r\n\t\t\t * @type {Quaternion}\r\n\t\t\t */\r\n\r\n\t\t\tthis.quaternion = new Quaternion();\r\n\r\n\t\t\t/**\r\n\t\t\t * The scale.\r\n\t\t\t *\r\n\t\t\t * Call {@link updateInverseTransformation} after changing this field.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.scale = new Vector3(1, 1, 1);\r\n\r\n\t\t\t/**\r\n\t\t\t * The inverted transformation matrix.\r\n\t\t\t *\r\n\t\t\t * @type {Matrix4}\r\n\t\t\t */\r\n\r\n\t\t\tthis.inverseTransformation = new Matrix4();\r\n\r\n\t\t\tthis.updateInverseTransformation();\r\n\r\n\t\t\t/**\r\n\t\t\t * A list of SDFs.\r\n\t\t\t *\r\n\t\t\t * SDFs can be chained to build CSG expressions.\r\n\t\t\t *\r\n\t\t\t * @type {SignedDistanceFunction[]}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.children = [];\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Composes a transformation matrix using the translation, rotation and scale\r\n\t\t * of this SDF.\r\n\t\t *\r\n\t\t * The transformation matrix is not needed for most SDF calculations and is\r\n\t\t * therefore not stored explicitly to save space.\r\n\t\t *\r\n\t\t * @param {Matrix4} [target] - A target matrix. If none is provided, a new one will be created.\r\n\t\t * @return {Matrix4} The transformation matrix.\r\n\t\t */\r\n\r\n\t\tgetTransformation(target = new Matrix4()) {\r\n\r\n\t\t\treturn target.compose(this.position, this.quaternion, this.scale);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the AABB of this SDF if it doesn't exist yet and returns it.\r\n\t\t *\r\n\t\t * @param {Boolean} [recursive=false] - Whether the child SDFs should be taken into account.\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tgetBoundingBox(recursive = false) {\r\n\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tlet boundingBox = this.boundingBox;\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tif(boundingBox === null) {\r\n\r\n\t\t\t\tboundingBox = this.computeBoundingBox();\r\n\t\t\t\tthis.boundingBox = boundingBox;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(recursive) {\r\n\r\n\t\t\t\tboundingBox = boundingBox.clone();\r\n\r\n\t\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\t\tboundingBox.union(children[i].getBoundingBox(recursive));\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn boundingBox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the material.\r\n\t\t *\r\n\t\t * @param {Material} material - The material. Must be an integer in the range of 1 to 255.\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tsetMaterial(material) {\r\n\r\n\t\t\tthis.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the CSG operation type of this SDF.\r\n\t\t *\r\n\t\t * @param {OperationType} operation - The CSG operation type.\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tsetOperationType(operation) {\r\n\r\n\t\t\tthis.operation = operation;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Updates the inverse transformation matrix.\r\n\t\t *\r\n\t\t * This method should be called after the position, quaternion or scale has\r\n\t\t * changed. The bounding box will be updated automatically.\r\n\t\t *\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tupdateInverseTransformation() {\r\n\r\n\t\t\tthis.inverseTransformation.getInverse(this.getTransformation(m$2));\r\n\t\t\tthis.boundingBox = null;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds the given SDF to this one.\r\n\t\t *\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tunion(sdf) {\r\n\r\n\t\t\tthis.children.push(sdf.setOperationType(OperationType.UNION));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts the given SDF from this one.\r\n\t\t *\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tsubtract(sdf) {\r\n\r\n\t\t\tthis.children.push(sdf.setOperationType(OperationType.DIFFERENCE));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Intersects the given SDF with this one.\r\n\t\t *\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tintersect(sdf) {\r\n\r\n\t\t\tthis.children.push(sdf.setOperationType(OperationType.INTERSECTION));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Translates this SDF into a CSG expression.\r\n\t\t *\r\n\t\t * @return {Operation} A CSG operation.\r\n\t\t * @example a.union(b.intersect(c)).union(d).subtract(e) => Difference(Union(a, Intersection(b, c), d), e)\r\n\t\t */\r\n\r\n\t\ttoCSG() {\r\n\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tlet operation = new DensityFunction(this);\r\n\t\t\tlet operationType;\r\n\t\t\tlet child;\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\tchild = children[i];\r\n\r\n\t\t\t\tif(operationType !== child.operation) {\r\n\r\n\t\t\t\t\toperationType = child.operation;\r\n\r\n\t\t\t\t\tswitch(operationType) {\r\n\r\n\t\t\t\t\t\tcase OperationType.UNION:\r\n\t\t\t\t\t\t\toperation = new Union(operation);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase OperationType.DIFFERENCE:\r\n\t\t\t\t\t\t\toperation = new Difference(operation);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase OperationType.INTERSECTION:\r\n\t\t\t\t\t\t\toperation = new Intersection(operation);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\toperation.children.push(child.toCSG());\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn operation;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.\r\n\t\t * @return {Object} The serialised data.\r\n\t\t */\r\n\r\n\t\tserialize(deflate = false) {\r\n\r\n\t\t\tconst result = {\r\n\t\t\t\ttype: this.type,\r\n\t\t\t\toperation: this.operation,\r\n\t\t\t\tmaterial: this.material,\r\n\t\t\t\tposition: this.position.toArray(),\r\n\t\t\t\tquaternion: this.quaternion.toArray(),\r\n\t\t\t\tscale: this.scale.toArray(),\r\n\t\t\t\tparameters: null,\r\n\t\t\t\tchildren: []\r\n\t\t\t};\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = this.children.length; i < l; ++i) {\r\n\r\n\t\t\t\tresult.children.push(this.children[i].serialize(deflate));\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.\r\n\t\t * @return {Transferable[]} The transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\treturn transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Returns a plain object that describes this SDF.\r\n\t\t *\r\n\t\t * @return {Object} A simple description of this SDF.\r\n\t\t */\r\n\r\n\t\ttoJSON() {\r\n\r\n\t\t\treturn this.serialize(true);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this SDF.\r\n\t\t *\r\n\t\t * @protected\r\n\t\t * @throws {Error} An error is thrown if the method is not overridden.\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthrow new Error(\"SignedDistanceFunction#computeBoundingBox method not implemented!\");\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @throws {Error} An error is thrown if the method is not overridden.\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The Euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\tthrow new Error(\"SignedDistanceFunction#sample method not implemented!\");\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An enumeration of SDF types.\r\n\t *\r\n\t * @type {Object}\r\n\t * @property {String} HEIGHTFIELD - A heightfield description.\r\n\t * @property {String} FRACTAL_NOISE - A fractal noise description.\r\n\t * @property {String} SUPER_PRIMITIVE - A super primitive description.\r\n\t */\r\n\r\n\tconst SDFType = {\r\n\r\n\t\tHEIGHTFIELD: \"sdf.heightfield\",\r\n\t\tFRACTAL_NOISE: \"sdf.fractalnoise\",\r\n\t\tSUPER_PRIMITIVE: \"sdf.superprimitive\"\r\n\r\n\t};\n\n\t/**\r\n\t * Fractal noise based on Perlin's technique.\r\n\t *\r\n\t * Reference:\r\n\t *  https://gpfault.net/posts/perlin-noise.txt.html\r\n\t */\r\n\r\n\tclass FractalNoise extends SignedDistanceFunction {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new perlin noise density field.\r\n\t\t *\r\n\t\t * @param {Object} parameters - The parameters.\r\n\t\t * @param {Number} [material] - A material index.\r\n\t\t */\r\n\r\n\t\tconstructor(parameters = {}, material) {\r\n\r\n\t\t\tsuper(SDFType.PERLIN_NOISE, material);\r\n\r\n\t\t\t/**\r\n\t\t\t * The upper bounds of this density field.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = new Vector3(...parameters.min);\r\n\r\n\t\t\t/**\r\n\t\t\t * The upper bounds of this density field.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t */\r\n\r\n\t\t\tthis.max = new Vector3(...parameters.max);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this density field.\r\n\t\t *\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthis.bbox = new Box3(this.min, this.max);\r\n\r\n\t\t\treturn this.bbox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @param {Boolean} [toJSON=false] - Whether the serialised data will be stringified.\r\n\t\t * @return {Object} A serialised description of this SDF.\r\n\t\t */\r\n\r\n\t\tserialize(toJSON = false) {\r\n\r\n\t\t\tconst result = super.serialize();\r\n\r\n\t\t\tresult.parameters = {\r\n\t\t\t\tmin: this.min.toArray(),\r\n\t\t\t\tmax: this.max.toArray()\r\n\t\t\t};\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Reads the image data of the given image.\r\n\t *\r\n\t * @private\r\n\t * @param {Image} image - The image.\r\n\t * @return {ImageData} The image data.\r\n\t */\r\n\r\n\tfunction readImageData(image) {\r\n\r\n\t\tconst canvas = document.createElementNS(\"http://www.w3.org/1999/xhtml\", \"canvas\");\r\n\t\tconst context = canvas.getContext(\"2d\");\r\n\r\n\t\tcanvas.width = image.width;\r\n\t\tcanvas.height = image.height;\r\n\t\tcontext.drawImage(image, 0, 0);\r\n\r\n\t\treturn context.getImageData(0, 0, image.width, image.height);\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A Signed Distance Function that describes a heightfield.\r\n\t */\r\n\r\n\tclass Heightfield extends SignedDistanceFunction {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new heightfield SDF.\r\n\t\t *\r\n\t\t * @param {Object} parameters - The parameters.\r\n\t\t * @param {Array} [parameters.width] - The width of the heightfield.\r\n\t\t * @param {Array} [parameters.height] - The height of the heightfield.\r\n\t\t * @param {Uint8ClampedArray} [parameters.data] - The heightmap image data. Can be null.\r\n\t\t * @param {Image} [parameters.image] - The heightmap image.\r\n\t\t * @param {Number} [material] - A material index.\r\n\t\t */\r\n\r\n\t\tconstructor(parameters = {}, material) {\r\n\r\n\t\t\tsuper(SDFType.HEIGHTFIELD, material);\r\n\r\n\t\t\t/**\r\n\t\t\t * The width.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.width = (parameters.width !== undefined) ? parameters.width : 1;\r\n\r\n\t\t\t/**\r\n\t\t\t * The height.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.height = (parameters.height !== undefined) ? parameters.height : 1;\r\n\r\n\t\t\t/**\r\n\t\t\t * The height data.\r\n\t\t\t *\r\n\t\t\t * @type {Uint8ClampedArray}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = (parameters.data !== undefined) ? parameters.data : null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The heightmap.\r\n\t\t\t *\r\n\t\t\t * @type {Image}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.heightmap = null;\r\n\r\n\t\t\tif(parameters.image !== undefined) {\r\n\r\n\t\t\t\tthis.fromImage(parameters.image);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Reads the image data of a given heightmap and converts it into a greyscale\r\n\t\t * data array.\r\n\t\t *\r\n\t\t * @param {Image} image - The heightmap image.\r\n\t\t * @return {Heightfield} This heightfield.\r\n\t\t */\r\n\r\n\t\tfromImage(image) {\r\n\r\n\t\t\tconst imageData = (typeof document === \"undefined\") ? null : readImageData(image);\r\n\r\n\t\t\tlet result = null;\r\n\t\t\tlet data;\r\n\r\n\t\t\tlet i, j, l;\r\n\r\n\t\t\tif(imageData !== null) {\r\n\r\n\t\t\t\tdata = imageData.data;\r\n\r\n\t\t\t\t// Reduce image data to greyscale format.\r\n\t\t\t\tresult = new Uint8ClampedArray(data.length / 4);\r\n\r\n\t\t\t\tfor(i = 0, j = 0, l = result.length; i < l; ++i, j += 4) {\r\n\r\n\t\t\t\t\tresult[i] = data[j];\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tthis.heightmap = image;\r\n\t\t\t\tthis.width = imageData.width;\r\n\t\t\t\tthis.height = imageData.height;\r\n\t\t\t\tthis.data = result;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this SDF.\r\n\t\t *\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tconst boundingBox = new Box3();\r\n\r\n\t\t\tconst w = Math.min(this.width / this.height, 1.0);\r\n\t\t\tconst h = Math.min(this.height / this.width, 1.0);\r\n\r\n\t\t\tboundingBox.min.set(0, 0, 0);\r\n\t\t\tboundingBox.max.set(w, 1, h);\r\n\t\t\tboundingBox.applyMatrix4(this.getTransformation());\r\n\r\n\t\t\treturn boundingBox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\tconst boundingBox = this.boundingBox;\r\n\t\t\tconst inside = boundingBox.containsPoint(position);\r\n\r\n\t\t\tlet d;\r\n\r\n\t\t\tposition.applyMatrix4(this.inverseTransformation);\r\n\r\n\t\t\tif(inside) {\r\n\r\n\t\t\t\tconst w = this.width;\r\n\t\t\t\tconst h = this.height;\r\n\t\t\t\tconst x = Math.max(Math.min(Math.trunc(position.x * w), w), 0);\r\n\t\t\t\tconst z = Math.max(Math.min(Math.trunc(position.z * h), h), 0);\r\n\r\n\t\t\t\tconst height = this.data[z * w + x] / 255;\r\n\r\n\t\t\t\td = position.y - height;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\td = boundingBox.distanceToPoint(position);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn d;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.\r\n\t\t * @return {Object} The serialised data.\r\n\t\t */\r\n\r\n\t\tserialize(deflate = false) {\r\n\r\n\t\t\tconst result = super.serialize();\r\n\r\n\t\t\tresult.parameters = {\r\n\t\t\t\twidth: this.width,\r\n\t\t\t\theight: this.height,\r\n\t\t\t\tdata: deflate ? null : this.data,\r\n\t\t\t\tdataUrl: (deflate && this.heightmap !== null) ? this.heightmap.toDataUrl() : null,\r\n\t\t\t\timage: null\r\n\t\t\t};\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.\r\n\t\t * @return {Transferable[]} The transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\ttransferList.push(this.data.buffer);\r\n\r\n\t\t\treturn transferList;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * The super primitive.\r\n\t *\r\n\t * A function that is able to represent a wide range of conic/rectangular-radial\r\n\t * primitives of genus 0 and 1: (round) box, sphere, cylinder, capped cone,\r\n\t * torus, capsule, pellet, pipe, etc.\r\n\t *\r\n\t * Reference:\r\n\t *  https://www.shadertoy.com/view/MsVGWG\r\n\t */\r\n\r\n\tclass SuperPrimitive extends SignedDistanceFunction {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new super primitive.\r\n\t\t *\r\n\t\t * See {@link SuperPrimitivePreset} for a list of default configurations.\r\n\t\t *\r\n\t\t * @param {Object} parameters - The parameters.\r\n\t\t * @param {Array} parameters.s - The size and genus weight [x, y, z, w].\r\n\t\t * @param {Array} parameters.r - The corner radii [x, y, z].\r\n\t\t * @param {Number} [material] - A material index.\r\n\t\t * @example const cube = SuperPrimitive.create(SuperPrimitivePreset.CUBE);\r\n\t\t */\r\n\r\n\t\tconstructor(parameters = {}, material) {\r\n\r\n\t\t\tsuper(SDFType.SUPER_PRIMITIVE, material);\r\n\r\n\t\t\t/**\r\n\t\t\t * The base size. The W-component affects the genus of the primitive.\r\n\t\t\t *\r\n\t\t\t * @type {Vector4}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.s0 = new Vector4(...parameters.s);\r\n\r\n\t\t\t/**\r\n\t\t\t * The base corner radii.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.r0 = new Vector3(...parameters.r);\r\n\r\n\t\t\t/**\r\n\t\t\t * The size, adjusted for further calculations.\r\n\t\t\t *\r\n\t\t\t * @type {Vector4}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.s = new Vector4();\r\n\r\n\t\t\t/**\r\n\t\t\t * The corner radii, adjusted for further calculations.\r\n\t\t\t *\r\n\t\t\t * @type {Vector3}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.r = new Vector3();\r\n\r\n\t\t\t/**\r\n\t\t\t * Precomputed corner rounding constants.\r\n\t\t\t *\r\n\t\t\t * @type {Vector2}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.ba = new Vector2();\r\n\r\n\t\t\t/**\r\n\t\t\t * The bottom radius offset.\r\n\t\t\t *\r\n\t\t\t * @type {Number}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.offset = 0;\r\n\r\n\t\t\t// Calculate constants ahead of time.\r\n\t\t\tthis.precompute();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the size and genus weight.\r\n\t\t *\r\n\t\t * @param {Number} x - X.\r\n\t\t * @param {Number} y - Y.\r\n\t\t * @param {Number} z - Z.\r\n\t\t * @param {Number} w - W.\r\n\t\t * @return {SuperPrimitive} This instance.\r\n\t\t */\r\n\r\n\t\tsetSize(x, y, z, w) {\r\n\r\n\t\t\tthis.s0.set(x, y, z, w);\r\n\r\n\t\t\treturn this.precompute();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the corner radii.\r\n\t\t *\r\n\t\t * @param {Number} x - X.\r\n\t\t * @param {Number} y - Y.\r\n\t\t * @param {Number} z - Z.\r\n\t\t * @return {SuperPrimitive} This instance.\r\n\t\t */\r\n\r\n\t\tsetRadii(x, y, z) {\r\n\r\n\t\t\tthis.r0.set(x, y, z);\r\n\r\n\t\t\treturn this.precompute();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Precomputes corner rounding factors.\r\n\t\t *\r\n\t\t * @private\r\n\t\t * @return {SuperPrimitive} This instance.\r\n\t\t */\r\n\r\n\t\tprecompute() {\r\n\r\n\t\t\tconst s = this.s.copy(this.s0);\r\n\t\t\tconst r = this.r.copy(this.r0);\r\n\t\t\tconst ba = this.ba;\r\n\r\n\t\t\ts.x -= r.x;\r\n\t\t\ts.y -= r.x;\r\n\r\n\t\t\tr.x -= s.w;\r\n\t\t\ts.w -= r.y;\r\n\r\n\t\t\ts.z -= r.y;\r\n\r\n\t\t\tthis.offset = -2.0 * s.z;\r\n\r\n\t\t\tba.set(r.z, this.offset);\r\n\t\t\tconst divisor = ba.dot(ba);\r\n\r\n\t\t\tif(divisor === 0.0) {\r\n\r\n\t\t\t\t// Y must not be 0 to prevent bad values for Z = 0 in the last term (*).\r\n\t\t\t\tba.set(0.0, -1.0);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tba.divideScalar(divisor);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this SDF.\r\n\t\t *\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tconst s = this.s0;\r\n\t\t\tconst boundingBox = new Box3();\r\n\r\n\t\t\tboundingBox.min.x = Math.min(-s.x, -1.0);\r\n\t\t\tboundingBox.min.y = Math.min(-s.y, -1.0);\r\n\t\t\tboundingBox.min.z = Math.min(-s.z, -1.0);\r\n\r\n\t\t\tboundingBox.max.x = Math.max(s.x, 1.0);\r\n\t\t\tboundingBox.max.y = Math.max(s.y, 1.0);\r\n\t\t\tboundingBox.max.z = Math.max(s.z, 1.0);\r\n\r\n\t\t\tboundingBox.applyMatrix4(this.getTransformation());\r\n\r\n\t\t\treturn boundingBox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\tposition.applyMatrix4(this.inverseTransformation);\r\n\r\n\t\t\tconst s = this.s;\r\n\t\t\tconst r = this.r;\r\n\t\t\tconst ba = this.ba;\r\n\r\n\t\t\tconst dx = Math.abs(position.x) - s.x;\r\n\t\t\tconst dy = Math.abs(position.y) - s.y;\r\n\t\t\tconst dz = Math.abs(position.z) - s.z;\r\n\r\n\t\t\tconst mx0 = Math.max(dx, 0.0);\r\n\t\t\tconst my0 = Math.max(dy, 0.0);\r\n\t\t\tconst l0 = Math.sqrt(mx0 * mx0 + my0 * my0);\r\n\r\n\t\t\tconst p = position.z - s.z;\r\n\t\t\tconst q = Math.abs(l0 + Math.min(0.0, Math.max(dx, dy)) - r.x) - s.w;\r\n\r\n\t\t\tconst c = Math.min(Math.max(q * ba.x + p * ba.y, 0.0), 1.0);\r\n\t\t\tconst diagX = q - r.z * c;\r\n\t\t\tconst diagY = p - this.offset * c;\r\n\r\n\t\t\tconst hx0 = Math.max(q - r.z, 0.0);\r\n\t\t\tconst hy0 = position.z + s.z;\r\n\t\t\tconst hx1 = Math.max(q, 0.0);\r\n\t\t\t// hy1 = p;\r\n\r\n\t\t\tconst diagSq = diagX * diagX + diagY * diagY;\r\n\t\t\tconst h0Sq = hx0 * hx0 + hy0 * hy0;\r\n\t\t\tconst h1Sq = hx1 * hx1 + p * p;\r\n\t\t\tconst paBa = q * -ba.y + p * ba.x;\r\n\r\n\t\t\tconst l1 = Math.sqrt(Math.min(diagSq, Math.min(h0Sq, h1Sq)));\r\n\r\n\t\t\t// (*) paBa must not be 0: if dz is also 0, the result will be wrong.\r\n\t\t\treturn l1 * Math.sign(Math.max(paBa, dz)) - r.y;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.\r\n\t\t * @return {Object} The serialised data.\r\n\t\t */\r\n\r\n\t\tserialize(deflate = false) {\r\n\r\n\t\t\tconst result = super.serialize();\r\n\r\n\t\t\tresult.parameters = {\r\n\t\t\t\ts: this.s0.toArray(),\r\n\t\t\t\tr: this.r0.toArray()\r\n\t\t\t};\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a new primitive using the specified preset.\r\n\t\t *\r\n\t\t * @param {SuperPrimitivePreset} preset - The super primitive preset.\r\n\t\t */\r\n\r\n\t\tstatic create(preset) {\r\n\r\n\t\t\tconst parameters = superPrimitivePresets[preset];\r\n\r\n\t\t\treturn new SuperPrimitive({\r\n\t\t\t\ts: parameters[0],\r\n\t\t\t\tr: parameters[1]\r\n\t\t\t});\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A list of parameter presets.\r\n\t *\r\n\t * @type {Array<Float32Array[]>}\r\n\t * @private\r\n\t */\r\n\r\n\tconst superPrimitivePresets = [\r\n\r\n\t\t// Cube.\r\n\t\t[\r\n\t\t\tnew Float32Array([1.0, 1.0, 1.0, 1.0]),\r\n\t\t\tnew Float32Array([0.0, 0.0, 0.0])\r\n\t\t],\r\n\r\n\t\t// Cylinder.\r\n\t\t[\r\n\t\t\tnew Float32Array([1.0, 1.0, 1.0, 1.0]),\r\n\t\t\tnew Float32Array([1.0, 0.0, 0.0])\r\n\t\t],\r\n\r\n\t\t// Cone.\r\n\t\t[\r\n\t\t\tnew Float32Array([0.0, 0.0, 1.0, 1.0]),\r\n\t\t\tnew Float32Array([0.0, 0.0, 1.0])\r\n\t\t],\r\n\r\n\t\t// Pill.\r\n\t\t[\r\n\t\t\tnew Float32Array([1.0, 1.0, 2.0, 1.0]),\r\n\t\t\tnew Float32Array([1.0, 1.0, 0.0])\r\n\t\t],\r\n\r\n\t\t// Sphere.\r\n\t\t[\r\n\t\t\tnew Float32Array([1.0, 1.0, 1.0, 1.0]),\r\n\t\t\tnew Float32Array([1.0, 1.0, 0.0])\r\n\t\t],\r\n\r\n\t\t// Pellet.\r\n\t\t[\r\n\t\t\tnew Float32Array([1.0, 1.0, 0.25, 1.0]),\r\n\t\t\tnew Float32Array([1.0, 0.25, 0.0])\r\n\t\t],\r\n\r\n\t\t// Torus.\r\n\t\t[\r\n\t\t\tnew Float32Array([1.0, 1.0, 0.25, 0.25]),\r\n\t\t\tnew Float32Array([1.0, 0.25, 0.0])\r\n\t\t],\r\n\r\n\t\t// Pipe.\r\n\t\t[\r\n\t\t\tnew Float32Array([1.0, 1.0, 1.0, 0.25]),\r\n\t\t\tnew Float32Array([1.0, 0.1, 0.0])\r\n\t\t],\r\n\r\n\t\t// Corridor.\r\n\t\t[\r\n\t\t\tnew Float32Array([1.0, 1.0, 1.0, 0.25]),\r\n\t\t\tnew Float32Array([0.1, 0.1, 0.0])\r\n\t\t]\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * An enumeration of super primitive presets.\r\n\t *\r\n\t * @type {Object}\r\n\t * @property {Number} CUBE - A cube.\r\n\t * @property {Number} CYLINDER - A cylinder.\r\n\t * @property {Number} CONE - A cone.\r\n\t * @property {Number} PILL - A pill.\r\n\t * @property {Number} SPHERE - A sphere.\r\n\t * @property {Number} PELLET - A pellet.\r\n\t * @property {Number} TORUS - A torus.\r\n\t * @property {Number} PIPE - A pipe.\r\n\t * @property {Number} CORRIDOR - A corridor.\r\n\t */\n\n\t/**\r\n\t * An SDF reviver.\r\n\t */\r\n\r\n\tclass SDFReviver {\r\n\r\n\t\t/**\r\n\t\t * Creates an SDF from the given serialised description.\r\n\t\t *\r\n\t\t * @param {Object} description - A serialised SDF.\r\n\t\t * @return {SignedDistanceFunction} A deserialized SDF.\r\n\t\t */\r\n\r\n\t\trevive(description) {\r\n\r\n\t\t\tlet sdf, i, l;\r\n\r\n\t\t\tswitch(description.type) {\r\n\r\n\t\t\t\tcase SDFType.FRACTAL_NOISE:\r\n\t\t\t\t\tsdf = new FractalNoise(description.parameters, description.material);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase SDFType.HEIGHTFIELD:\r\n\t\t\t\t\tsdf = new Heightfield(description.parameters, description.material);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase SDFType.SUPER_PRIMITIVE:\r\n\t\t\t\t\tsdf = new SuperPrimitive(description.parameters, description.material);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tsdf.operation = description.operation;\r\n\t\t\tsdf.position.fromArray(description.position);\r\n\t\t\tsdf.quaternion.fromArray(description.quaternion);\r\n\t\t\tsdf.scale.fromArray(description.scale);\r\n\t\t\tsdf.updateInverseTransformation();\r\n\r\n\t\t\tfor(i = 0, l = description.children.length; i < l; ++i) {\r\n\r\n\t\t\t\tsdf.children.push(this.revive(description.children[i]));\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn sdf;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A modification response.\r\n\t */\r\n\r\n\tclass ModificationResponse extends DataMessage {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new modification response.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\tsuper(Action.MODIFY);\r\n\r\n\t\t\t/**\r\n\t\t\t * A serialised SDF.\r\n\t\t\t *\r\n\t\t\t * @type {Object}\r\n\t\t\t */\r\n\r\n\t\t\tthis.sdf = null;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A modifier that applies CSG operations to Hermite data.\r\n\t */\r\n\r\n\tclass VolumeModifier extends DataProcessor {\r\n\r\n\t\t/**\r\n\t\t * Constructs a new Hermite data modifier.\r\n\t\t */\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\tsuper();\r\n\r\n\t\t\t/**\r\n\t\t\t * A container for the data that will be returned to the main thread.\r\n\t\t\t *\r\n\t\t\t * @type {ModificationResponse}\r\n\t\t\t */\r\n\r\n\t\t\tthis.response = new ModificationResponse();\r\n\r\n\t\t\t/**\r\n\t\t\t * An SDF.\r\n\t\t\t *\r\n\t\t\t * @type {SignedDistanceFunction}\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.sdf = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Prepares a response that can be send back to the main thread.\r\n\t\t *\r\n\t\t * Should be used together with {@link VolumeModifier#createTransferList}.\r\n\t\t *\r\n\t\t * @return {ModificationResponse} A response.\r\n\t\t */\r\n\r\n\t\trespond() {\r\n\r\n\t\t\t// The container group contains the modified data.\r\n\t\t\tconst response = super.respond();\r\n\r\n\t\t\t// Send the SDF back as it may contain transferable data.\r\n\t\t\tresponse.sdf = (this.sdf !== null) ? this.sdf.serialize() : null;\r\n\r\n\t\t\treturn response;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.\r\n\t\t * @return {Transferable[]} The transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\tsuper.createTransferList(transferList);\r\n\r\n\t\t\treturn (this.sdf !== null) ? this.sdf.createTransferList(transferList) : transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Modifies the given Hermite data using the provided SDF.\r\n\t\t *\r\n\t\t * @param {ModificationRequest} request - A modification request.\r\n\t\t */\r\n\r\n\t\tprocess(request) {\r\n\r\n\t\t\t// Adopt the provided data.\r\n\t\t\tconst data = super.process(request).getData();\r\n\r\n\t\t\t// Revive the SDF.\r\n\t\t\tconst sdf = this.sdf = SDFReviver.revive(request.sdf);\r\n\r\n\t\t\t// The resulting data is uncompressed.\r\n\t\t\tconst result = ConstructiveSolidGeometry.run(request.cellPosition, request.cellSize, data, sdf);\r\n\r\n\t\t\t// Overwrite the data and compress it.\r\n\t\t\tsuper.data = (result !== null) ? result.compress() : null;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A volume modifier.\r\n\t *\r\n\t * @type {VolumeModifier}\r\n\t * @private\r\n\t */\r\n\r\n\tconst volumeModifier = new VolumeModifier();\r\n\r\n\t/**\r\n\t * A surface extractor.\r\n\t *\r\n\t * @type {SurfaceExtractor}\r\n\t * @private\r\n\t */\r\n\r\n\tconst surfaceExtractor = new SurfaceExtractor();\r\n\r\n\t/**\r\n\t * The current action.\r\n\t *\r\n\t * @type {Action}\r\n\t * @private\r\n\t */\r\n\r\n\tlet action = null;\r\n\r\n\t/**\r\n\t * Receives and handles messages from the main thread.\r\n\t *\r\n\t * @private\r\n\t * @param {Event} event - A message event containing data from the main thread.\r\n\t */\r\n\r\n\tself.addEventListener(\"message\", function onMessage(event) {\r\n\r\n\t\t// Unpack the request.\r\n\t\tconst request = event.data;\r\n\t\taction = request.action;\r\n\r\n\t\tswitch(action) {\r\n\r\n\t\t\tcase Action.MODIFY:\r\n\t\t\t\tpostMessage(\r\n\t\t\t\t\tvolumeModifier.process(request).respond(),\r\n\t\t\t\t\tvolumeModifier.createTransferList()\r\n\t\t\t\t);\r\n\t\t\t\tbreak;\r\n\r\n\t\t\tcase Action.EXTRACT:\r\n\t\t\t\tpostMessage(\r\n\t\t\t\t\tsurfaceExtractor.process(request).respond(),\r\n\t\t\t\t\tsurfaceExtractor.createTransferList()\r\n\t\t\t\t);\r\n\t\t\t\tbreak;\r\n\r\n\t\t\tcase Action.CONFIGURE:\r\n\t\t\t\tHermiteData.resolution = request.resolution;\r\n\t\t\t\tVoxelCell.errorThreshold = request.errorThreshold;\r\n\t\t\t\tbreak;\r\n\r\n\t\t\tcase Action.CLOSE:\r\n\t\t\tdefault:\r\n\t\t\t\tclose();\r\n\r\n\t\t}\r\n\r\n\t});\r\n\r\n\t/**\r\n\t * Returns all data to the main thread and closes the worker.\r\n\t *\r\n\t * @private\r\n\t * @param {ErrorEvent} event - An error event.\r\n\t */\r\n\r\n\tself.addEventListener(\"error\", function onError(event) {\r\n\r\n\t\tconst processor = (action === Action.MODIFY) ?\r\n\t\t\tvolumeModifier : (action === Action.EXTRACT) ?\r\n\t\t\t\tsurfaceExtractor : null;\r\n\r\n\t\tlet response;\r\n\r\n\t\tif(processor !== null) {\r\n\r\n\t\t\t// Evacuate the data.\r\n\t\t\tresponse = processor.respond();\r\n\r\n\t\t\t// Adjust the action and attach the error event.\r\n\t\t\tresponse.action = Action.CLOSE;\r\n\t\t\tresponse.error = event;\r\n\r\n\t\t\tpostMessage(response, processor.createTransferList());\r\n\r\n\t\t} else {\r\n\r\n\t\t\t// An unexpected error occured during configuration or closure.\r\n\t\t\tresponse = new Message(Action.CLOSE);\r\n\t\t\tresponse.error = event;\r\n\r\n\t\t\tpostMessage(response);\r\n\r\n\t\t}\r\n\r\n\t\tclose();\r\n\r\n\t});\n\n}());\n";

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

		closeWorker(worker$$1) {

			const index = this.workers.indexOf(worker$$1);

			if(this.busyWorkers.has(worker$$1)) {

				this.busyWorkers.delete(worker$$1);
				worker$$1.terminate();

			} else {

				worker$$1.postMessage(new Message(Action.CLOSE));

			}

			worker$$1.removeEventListener("message", this);
			worker$$1.removeEventListener("error", this);

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

			const worker$$1 = new Worker(this.workerURL);

			this.workers.push(worker$$1);

			worker$$1.addEventListener("message", this);
			worker$$1.addEventListener("error", this);

			worker$$1.postMessage(this.configurationMessage);

			return worker$$1;

		}

		/**
		 * Polls an available worker and returns it. The worker will be excluded from
		 * subsequent polls until it finishes its task and sends a message back.
		 *
		 * @return {Worker} A worker or null if all resources are currently exhausted.
		 */

		getWorker() {

			let worker$$1 = null;

			let i, l;

			// Check if an existing worker is available.
			for(i = 0, l = this.workers.length; i < l; ++i) {

				if(!this.busyWorkers.has(this.workers[i])) {

					worker$$1 = this.workers[i];
					this.busyWorkers.add(worker$$1);

					break;

				}

			}

			// Try to create a new worker if all existing ones are busy.
			if(worker$$1 === null && this.workers.length < this.maxWorkers) {

				if(this.workerURL !== null) {

					worker$$1 = this.createWorker();
					this.busyWorkers.add(worker$$1);

				}

			}

			return worker$$1;

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

	const error$1 = new TerrainEvent("error");

	// import { Task } from "./Task.js";
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
	 * Core components.
	 *
	 * @module rabbit-hole/core
	 */

	/**
	 * Geometry clipmap components.
	 *
	 * @module rabbit-hole/clipmap
	 */

	/**
	 * Data encoding and decoding components.
	 *
	 * @module rabbit-hole/codecs
	 */

	/**
	 * A collection of events.
	 *
	 * @module rabbit-hole/events
	 */

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
	 * A face map.
	 *
	 * @type {Uint8Array[]}
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
	 * @param {Array} vertexBuffer - An array to be filled with vertices.
	 * @param {Array} normalBuffer - An array to be filled with normals.
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
	 * Isosurface extraction algorithms.
	 *
	 * @module rabbit-hole/isosurface
	 */

	/**
	 * A collection of loaders.
	 *
	 * @module rabbit-hole/loaders
	 */

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

	const m$3 = new Matrix3();

	/**
	 * A vector.
	 *
	 * @type {Vector2}
	 * @private
	 */

	const a$3 = new Vector2();

	/**
	 * A vector that holds the singular values.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const b$9 = new Vector3();

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

			Schur.rotateQXY(a$3.set(se[0], se[3]), se[1], coefficients);
			se[0] = a$3.x; se[3] = a$3.y;

			Schur.rotateXY(a$3.set(se[2], se[4]), coefficients);
			se[2] = a$3.x; se[4] = a$3.y;

			se[1] = 0.0;

			Schur.rotateXY(a$3.set(ve[0], ve[3]), coefficients);
			ve[0] = a$3.x; ve[3] = a$3.y;

			Schur.rotateXY(a$3.set(ve[1], ve[4]), coefficients);
			ve[1] = a$3.x; ve[4] = a$3.y;

			Schur.rotateXY(a$3.set(ve[2], ve[5]), coefficients);
			ve[2] = a$3.x; ve[5] = a$3.y;

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

			Schur.rotateQXY(a$3.set(se[0], se[5]), se[2], coefficients);
			se[0] = a$3.x; se[5] = a$3.y;

			Schur.rotateXY(a$3.set(se[1], se[4]), coefficients);
			se[1] = a$3.x; se[4] = a$3.y;

			se[2] = 0.0;

			Schur.rotateXY(a$3.set(ve[0], ve[6]), coefficients);
			ve[0] = a$3.x; ve[6] = a$3.y;

			Schur.rotateXY(a$3.set(ve[1], ve[7]), coefficients);
			ve[1] = a$3.x; ve[7] = a$3.y;

			Schur.rotateXY(a$3.set(ve[2], ve[8]), coefficients);
			ve[2] = a$3.x; ve[8] = a$3.y;

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

			Schur.rotateQXY(a$3.set(se[3], se[5]), se[4], coefficients);
			se[3] = a$3.x; se[5] = a$3.y;

			Schur.rotateXY(a$3.set(se[1], se[2]), coefficients);
			se[1] = a$3.x; se[2] = a$3.y;

			se[4] = 0.0;

			Schur.rotateXY(a$3.set(ve[3], ve[6]), coefficients);
			ve[3] = a$3.x; ve[6] = a$3.y;

			Schur.rotateXY(a$3.set(ve[4], ve[7]), coefficients);
			ve[4] = a$3.x; ve[7] = a$3.y;

			Schur.rotateXY(a$3.set(ve[5], ve[8]), coefficients);
			ve[5] = a$3.x; ve[8] = a$3.y;

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

		return b$9.set(e[0], e[3], e[5]);

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

			const sigma = solveSymmetric(sm.copy(ata), m$3.identity());
			const invV = pseudoInverse(m$3, sigma);

			x.copy(atb).applyMatrix3(invV);

		}

	}

	/**
	 * A point.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const p$3 = new Vector3();

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

		ata.applyToVector3(p$3.copy(x));
		p$3.subVectors(atb, p$3);

		return p$3.dot(p$3);

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
				p$3.copy(data.massPointSum).divideScalar(data.numPoints);
				massPoint.copy(p$3);

				ata.applyToVector3(p$3);
				atb.sub(p$3);

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
	 * Mathematical system components.
	 *
	 * @module rabbit-hole/math
	 */

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
			offset = pattern[i];
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
						offset = pattern[sequence[i]];

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
	 * Space partitioning components used for contouring.
	 *
	 * @module rabbit-hole/octree/voxel
	 */

	/**
	 * World octree space partitioning components.
	 *
	 * @module rabbit-hole/octree/world
	 */

	/**
	 * Space partitioning components.
	 *
	 * @module rabbit-hole/octree
	 */

	/**
	 * Utility components.
	 *
	 * @module rabbit-hole/utils
	 */

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
		const edgeData = new EdgeData(EdgeData.calculate1DEdgeCount(n));

		let edges, zeroCrossings, normals, indexOffset;
		let indexA, indexB;

		let minX, minY, minZ;
		let maxX, maxY, maxZ;

		let c, d, a, axis;
		let x, y, z;

		// Process the edges along the X-axis, then Y and finally Z.
		for(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {

			// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
			axis = pattern[a];

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

	function update$1(operation, data0, data1) {

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
			update$1(operation, result);

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
					update$1(operation, result, data);

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
				update$1(operation, data, generatedData);

				// Provoke an isosurface extraction.
				data.contoured = false;

			}

			return (data !== null && data.empty) ? null : data;

		}

	}

	/**
	 * A collection of Constructive Solid Geometry components.
	 *
	 * @module rabbit-hole/volume/csg
	 */

	/**
	 * A collection of Signed Distance Function components.
	 *
	 * @module rabbit-hole/volume/sdf
	 */

	/**
	 * Volume management components.
	 *
	 * @module rabbit-hole/volume
	 */

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

	/**
	 * Multithreading components.
	 *
	 * @module rabbit-hole/worker
	 */

	/**
	 * Exposure of the library components.
	 *
	 * @module rabbit-hole
	 */

	exports.Deserializable = Deserializable;
	exports.Disposable = Disposable;
	exports.Queue = Queue;
	exports.Serializable = Serializable;
	exports.Terrain = Terrain;
	exports.TransferableContainer = TransferableContainer;
	exports.Clipmap = Clipmap;
	exports.Scene = Scene;
	exports.RunLengthEncoding = RunLengthEncoding;
	exports.SDFLoaderEvent = SDFLoaderEvent;
	exports.TerrainEvent = TerrainEvent;
	exports.WorkerEvent = WorkerEvent;
	exports.DualContouring = DualContouring;
	exports.Isosurface = Isosurface;
	exports.SDFLoader = SDFLoader;
	exports.Givens = Givens;
	exports.QEFSolver = QEFSolver;
	exports.QEFData = QEFData;
	exports.Schur = Schur;
	exports.SingularValueDecomposition = SingularValueDecomposition;
	exports.IntermediateWorldOctant = IntermediateWorldOctant;
	exports.KeyDesign = KeyDesign;
	exports.KeyIterator = KeyIterator;
	exports.SparseVoxelOctree = SparseVoxelOctree;
	exports.VoxelCell = VoxelCell;
	exports.WorldOctant = WorldOctant;
	exports.WorldOctantId = WorldOctantId;
	exports.WorldOctantIterator = WorldOctantIterator;
	exports.WorldOctantWrapper = WorldOctantWrapper;
	exports.WorldOctree = WorldOctree;
	exports.WorldOctreeCSG = WorldOctreeCSG;
	exports.WorldOctreeRaycaster = WorldOctreeRaycaster;
	exports.BinaryUtils = BinaryUtils;
	exports.Edge = Edge;
	exports.EdgeData = EdgeData;
	exports.EdgeIterator = EdgeIterator;
	exports.HermiteData = HermiteData;
	exports.Material = Material;
	exports.Voxel = Voxel;
	exports.ConstructiveSolidGeometry = ConstructiveSolidGeometry;
	exports.Difference = Difference;
	exports.Intersection = Intersection;
	exports.OperationType = OperationType;
	exports.Union = Union;
	exports.FractalNoise = FractalNoise;
	exports.Heightfield = Heightfield;
	exports.SDFType = SDFType;
	exports.SignedDistanceFunction = SignedDistanceFunction;
	exports.SuperPrimitive = SuperPrimitive;
	exports.SuperPrimitivePreset = SuperPrimitivePreset;
	exports.Action = Action;
	exports.DataProcessor = DataProcessor;
	exports.SurfaceExtractor = SurfaceExtractor;
	exports.ThreadPool = ThreadPool;
	exports.VolumeModifier = VolumeModifier;
	exports.ConfigurationMessage = ConfigurationMessage;
	exports.DataMessage = DataMessage;
	exports.Message = Message;
	exports.ExtractionRequest = ExtractionRequest;
	exports.ExtractionResponse = ExtractionResponse;
	exports.ModificationRequest = ModificationRequest;
	exports.ModificationResponse = ModificationResponse;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
