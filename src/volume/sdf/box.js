import { Box3, Vector3 } from "../../math";
import { SignedDistanceFunction } from "./signed-distance-function.js";
import { SDFType } from "./sdf-type.js";

/**
 * A Signed Distance Function that describes a box.
 *
 * @class Box
 * @submodule sdf
 * @extends SignedDistanceFunction
 * @constructor
 * @param {Object} parameters - The parameters.
 * @param {Array} parameters.origin - The origin [x, y, z].
 * @param {Array} parameters.halfDimensions - The half size [x, y, z].
 * @param {Number} [material] - A material index.
 */

export class Box extends SignedDistanceFunction {

	constructor(parameters = {}, material) {

		super(SDFType.BOX, material);

		/**
		 * The origin.
		 *
		 * @property origin
		 * @type Vector3
		 * @private
		 */

		this.origin = new Vector3(...parameters.origin);

		/**
		 * The halfDimensions.
		 *
		 * @property halfDimensions
		 * @type Vector3
		 * @private
		 */

		this.halfDimensions = new Vector3(...parameters.halfDimensions);

	}

	/**
	 * Calculates the bounding box of this density field.
	 *
	 * @method computeBoundingBox
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		this.bbox = new Box3();

		this.bbox.min.subVectors(this.origin, this.halfDimensions);
		this.bbox.max.addVectors(this.origin, this.halfDimensions);

		return this.bbox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @method sample
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

		const origin = this.origin;
		const halfDimensions = this.halfDimensions;

		// Compute the distance to the hull.
		const dx = Math.abs(position.x - origin.x) - halfDimensions.x;
		const dy = Math.abs(position.y - origin.y) - halfDimensions.y;
		const dz = Math.abs(position.z - origin.z) - halfDimensions.z;

		const m = Math.max(dx, Math.max(dy, dz));

		const mx0 = Math.max(dx, 0);
		const my0 = Math.max(dy, 0);
		const mz0 = Math.max(dz, 0);

		const length = Math.sqrt(mx0 * mx0 + my0 * my0 + mz0 * mz0);

		return Math.min(m, 0) + length;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @method serialise
	 * @return {Object} A serialised description of this SDF.
	 */

	serialise() {

		const result = super.serialise();

		result.parameters = {
			origin: this.origin.toArray(),
			halfDimensions: this.halfDimensions.toArray()
		};

		return result;

	}

}
