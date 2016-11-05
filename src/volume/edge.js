import { Vector3 } from "../math/vector3.js";

/**
 * A vector.
 *
 * @property AB
 * @type Vector3
 * @private
 * @static
 * @final
 */

const AB = new Vector3();

/**
 * A point.
 *
 * @property P
 * @type Vector3
 * @private
 * @static
 * @final
 */

const P = new Vector3();

/**
 * A vector.
 *
 * @property V
 * @type Vector3
 * @private
 * @static
 * @final
 */

const V = new Vector3();

/**
 * An edge.
 *
 * @class Edge
 * @submodule volume
 * @constructor
 * @param {Vector3} a - A starting point.
 * @param {Vector3} b - An ending point.
 */

export class Edge {

	constructor(a = new Vector3(), b = new Vector3()) {

		/**
		 * The starting point of the edge.
		 *
		 * @property a
		 * @type Vector3
		 */

		this.a = a;

		/**
		 * The ending point of the edge.
		 *
		 * @property b
		 * @type Vector3
		 */

		this.b = b;

		/**
		 * The Zero Crossing interpolation value.
		 *
		 * @property t
		 * @type Number
		 */

		this.t = 0.0;

		/**
		 * The surface normal at the Zero Crossing position.
		 *
		 * @property n
		 * @type Vector3
		 */

		this.n = new Vector3();

	}

	/**
	 * Approximates the smallest density along the edge.
	 *
	 * @method approximateZeroCrossing
	 * @param {SignedDistanceFunction} sdf - A density field.
	 * @param {Number} [steps=5] - The number of interpolation steps. Cannot be smaller than 2.
	 */

	approximateZeroCrossing(sdf, steps = 5) {

		const s = Math.max(1, steps - 1);

		let min = Infinity;
		let t = 0.0;
		let i = 0;
		let density;

		// Compute the vector from a to b.
		AB.subVectors(this.b, this.a);

		this.t = 0.0;

		while(i <= s) {

			// Compute an accurate interpolation fraction.
			t = i / s;

			P.addVectors(this.a, V.copy(AB).multiplyScalar(t));
			density = Math.abs(sdf.sample(P));

			if(density < min) {

				min = density;
				this.t = t;

			}

			++i;

		}

	}

	/**
	 * Calculates the Zero Crossing position.
	 *
	 * @method computeZeroCrossingPosition
	 * @return {Vector3} The Zero Crossing position. The returned vector is volatile.
	 */

	computeZeroCrossingPosition() {

		return AB.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);

	}

	/**
	 * Computes the normal of the surface at the edge intersection.
	 *
	 * @method computeSurfaceNormal
	 * @param {SignedDistanceFunction} sdf - A density field.
	 * @return {Vector3} The normal.
	 * @todo Use analytical derivation instead of finite differences.
	 */

	computeSurfaceNormal(sdf) {

		const position = this.computeZeroCrossingPosition();
		const H = 0.001;

		const dx = sdf.sample(P.addVectors(position, V.set(H, 0, 0))) - sdf.sample(P.subVectors(position, V.set(H, 0, 0)));
		const dy = sdf.sample(P.addVectors(position, V.set(0, H, 0))) - sdf.sample(P.subVectors(position, V.set(0, H, 0)));
		const dz = sdf.sample(P.addVectors(position, V.set(0, 0, H))) - sdf.sample(P.subVectors(position, V.set(0, 0, H)));

		this.n.set(dx, dy, dz).normalize();

	}

}
