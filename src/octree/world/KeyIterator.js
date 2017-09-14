import { Vector3 } from "math-ds";
import IteratorResult from "iterator-result";

/**
 * A key range iterator.
 *
 * @implements {Iterator}
 * @implements {Iterable}
 */

export class KeyIterator {

	/**
	 * Constructs a new key iterator.
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
		 * The key coordinate step sizes.
		 *
		 * @type {Uint32Array}
		 * @private
		 */

		this.steps = new Uint32Array(3);

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
		const steps = this.steps;
		const min = this.min;
		const max = this.max;

		steps[0] = 1;
		steps[1] = keyDesign.rangeX;
		steps[2] = keyDesign.rangeXY;

		this.keyBase.set(min.x, min.y * keyDesign.rangeX, min.z * keyDesign.rangeXY);
		this.limit.set(max.x, max.y * keyDesign.rangeX, max.z * keyDesign.rangeXY);
		this.key.copy(this.keyBase);

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
		const keyBase = this.keyBase;
		const limit = this.limit;
		const steps = this.steps;
		const key = this.key;

		// if(key.x <= limit.x && key.y <= limit.y && key.z <= limit.z) {
		if(key.z <= limit.z) {

			// Put the key pieces together.
			result.value = key.z + key.y + key.x;

			// Advance the key coordinates.
			key.x += steps[0];

			if(key.x > limit.x) {

				key.x = keyBase.x;
				key.y += steps[1];

				if(key.y > limit.y) {

					key.y = keyBase.y;
					key.z += steps[2];

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
