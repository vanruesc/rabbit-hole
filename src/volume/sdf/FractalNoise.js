import { Box3, Vector2, Vector3, Vector4 } from "math-ds";
import { SignedDistanceFunction } from "./SignedDistanceFunction.js";
import { SDFType } from "./SDFType.js";

/**
 * Fades a given value.
 *
 * @param {Number} A value.
 * @return {Number} The faded value.
 */

function fade(t) {

	return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);

}

/**
 * Computes a gradient for a given integer.
 *
 * @param {Number} An arbitrary integer.
 * @return {Number} The gradient, 1 or -1.
 */

function gradient(p) {

	/* const v = gradients[p % 256];

	return (v > 0.5) ? 1.0 : -1.0; */

}

/**
 * Computes a noise value for a given number.
 *
 * @param {Number} An arbitrary number.
 * @return {Number} The noise value.
 */

function noise(p) {

	const p0 = Math.trunc(p);
	const p1 = p0 + 1;

	const t = p - p0;
	const fadeT = fade(t);

	const g0 = gradient(p0);
	const g1 = fade(p1);

	return (1.0 - fadeT) * g0 * (p - p0) + fadeT * g1 * (p - p1);

}

/**
 * Fractal noise based on Perlin's technique.
 *
 * Reference:
 *  https://gpfault.net/posts/perlin-noise.txt.html
 */

export class FractalNoise extends SignedDistanceFunction {

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
