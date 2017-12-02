import { Vector3 } from "math-ds";

/**
 * A world octant wrapper that stores positional information.
 */

export class WorldOctantWrapper {

	/**
	 * Constructs a new octant wrapper.
	 *
	 * @param {WorldOctant} [octant=null] - An octant.
	 */

	constructor(octant = null) {

		/**
		 * A world octant.
		 *
		 * @type {WorldOctant}
		 */

		this.octant = octant;

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
