import { Box3, Vector3 } from "math-ds";
import { SignedDistanceFunction } from "./signed-distance-function.js";
import { SDFType } from "./sdf-type.js";

/**
 * A Signed Distance Function that describes a plane.
 */

export class Plane extends SignedDistanceFunction {

	/**
	 * Constructs a new plane SDF.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.normal - The normal [x, y, z].
	 * @param {Number} parameters.constant - The constant.
	 * @param {Number} [material] - A material index.
	 */

	constructor(parameters = {}, material) {

		super(SDFType.PLANE, material);

		/**
		 * The normal.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.normal = new Vector3(...parameters.normal);

		/**
		 * The constant.
		 *
		 * @type {Number}
		 * @private
		 */

		this.constant = parameters.constant;

	}

	/**
	 * Calculates the bounding box of this density field.
	 *
	 * @return {Box3} The bounding box.
	 * @todo
	 */

	computeBoundingBox() {

		this.bbox = new Box3();

		return this.bbox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

		return this.normal.dot(position) + this.constant;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @return {Object} A serialised description of this SDF.
	 */

	serialise() {

		const result = super.serialise();

		result.parameters = {
			normal: this.normal.toArray(),
			constant: this.constant
		};

		return result;

	}

}
