import { Vector3 } from "../math/vector3.js";

/**
 * An isovalue bias for the Zero Crossing approximation.
 *
 * @property BIAS
 * @type Number
 * @private
 * @static
 * @final
 */

const BIAS = 1e-2;

/**
 * An error threshold for the Zero Crossing approximation.
 *
 * @property BIAS
 * @type Number
 * @private
 * @static
 * @final
 */

const THRESHOLD = 1e-6;

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
		AB.subVectors(this.b, this.a);

		// Use bisection to find the root of the SDF.
		while(i <= s) {

			c = (a + b) / 2;

			P.addVectors(this.a, V.copy(AB).multiplyScalar(c));
			densityC = sdf.sample(P);

			if(Math.abs(densityC) <= BIAS || (b - a) / 2 <= THRESHOLD) {

				// Solution found.
				break;

			} else {

				P.addVectors(this.a, V.copy(AB).multiplyScalar(a));
				densityA = sdf.sample(P);

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
		const E = 1e-3;

		const dx = sdf.sample(P.addVectors(position, V.set(E, 0, 0))) - sdf.sample(P.subVectors(position, V.set(E, 0, 0)));
		const dy = sdf.sample(P.addVectors(position, V.set(0, E, 0))) - sdf.sample(P.subVectors(position, V.set(0, E, 0)));
		const dz = sdf.sample(P.addVectors(position, V.set(0, 0, E))) - sdf.sample(P.subVectors(position, V.set(0, 0, E)));

		this.n.set(dx, dy, dz).normalize();

	}

}
