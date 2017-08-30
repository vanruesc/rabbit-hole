import { Box3, Vector3 } from "math-ds";
import { SignedDistanceFunction } from "./SignedDistanceFunction.js";
import { SDFType } from "./SDFType.js";

/**
 * A Signed Distance Function that describes a sphere.
 *
 * @implements {Serializable}
 */

export class Sphere extends SignedDistanceFunction {

	/**
	 * Constructs a new sphere SDF.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.origin - The origin [x, y, z].
	 * @param {Number} parameters.radius - The radius.
	 * @param {Number} [material] - A material index.
	 */

	constructor(parameters = {}, material) {

		super(SDFType.SPHERE, material);

		/**
		 * The origin.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.origin = new Vector3(...parameters.origin);

		/**
		 * The radius.
		 *
		 * @type {Number}
		 * @private
		 */

		this.radius = parameters.radius;

	}

	/**
	 * Calculates the bounding box of this density field.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		this.bbox = new Box3();

		this.bbox.min.copy(this.origin).subScalar(this.radius);
		this.bbox.max.copy(this.origin).addScalar(this.radius);

		return this.bbox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

		const origin = this.origin;

		const dx = position.x - origin.x;
		const dy = position.y - origin.y;
		const dz = position.z - origin.z;

		const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

		return length - this.radius;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @return {Object} A concise representation of this SDF.
	 */

	serialize() {

		const result = super.serialise();

		result.parameters = {
			origin: this.origin.toArray(),
			radius: this.radius
		};

		return result;

	}

}
