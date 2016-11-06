import { Box3 } from "../../math/box3.js";
import { Vector3 } from "../../math/vector3.js";
import { SignedDistanceFunction } from "./signed-distance-function.js";
import { SDFType } from "./sdf-type.js";

/**
 * A Signed Distance Function that describes a torus.
 *
 * @class Torus
 * @submodule sdf
 * @extends SignedDistanceFunction
 * @constructor
 * @param {Object} parameters - The parameters.
 * @param {Array} parameters.origin - The origin [x, y, z].
 * @param {Number} parameters.R - The distance from the center to the tube.
 * @param {Number} parameters.r - The radius of the tube.
 * @param {Number} [material] - A material index.
 */

export class Torus extends SignedDistanceFunction {

	constructor(parameters = {}, material) {

		super(SDFType.TORUS, material);

		/**
		 * The origin.
		 *
		 * @property origin
		 * @type Vector3
		 * @private
		 */

		this.origin = new Vector3(...parameters.origin);

		/**
		 * The distance from the center to the tube.
		 *
		 * @property R
		 * @type Number
		 * @private
		 */

		this.R = parameters.R;

		/**
		 * The radius of the tube.
		 *
		 * @property r
		 * @type Number
		 * @private
		 */

		this.r = parameters.r;

	}

	/**
	 * Calculates the bounding box of this density field.
	 *
	 * @method computeBoundingBox
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		this.bbox = new Box3();

		this.bbox.min.copy(this.origin).subScalar(this.R).subScalar(this.r);
		this.bbox.max.copy(this.origin).addScalar(this.R).addScalar(this.r);

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

		const dx = position.x - origin.x;
		const dy = position.y - origin.y;
		const dz = position.z - origin.z;

		const q = Math.sqrt(dx * dx + dz * dz) - this.R;
		const length = Math.sqrt(q * q + dy * dy);

		return length - this.r;

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
			R: this.R,
			r: this.r
		};

		return result;

	}

}
