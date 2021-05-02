import { Vector3 } from "three";

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

const p = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v = new Vector3();

/**
 * An edge between two material grid points.
 */

export class Edge {

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

			p.addVectors(this.a, v.copy(ab).multiplyScalar(c));
			densityC = sdf.sample(p);

			if(Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {

				// Solution found.
				break;

			} else {

				p.addVectors(this.a, v.copy(ab).multiplyScalar(a));
				densityA = sdf.sample(p);

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

		const dx = sdf.sample(p.addVectors(position, v.set(E, 0, 0))) - sdf.sample(p.subVectors(position, v.set(E, 0, 0)));
		const dy = sdf.sample(p.addVectors(position, v.set(0, E, 0))) - sdf.sample(p.subVectors(position, v.set(0, E, 0)));
		const dz = sdf.sample(p.addVectors(position, v.set(0, 0, E))) - sdf.sample(p.subVectors(position, v.set(0, 0, E)));

		this.n.set(dx, dy, dz).normalize();

	}

}
