import { Matrix3, SymmetricMatrix3 } from "math-ds";
import { Givens } from "./Givens.js";
import { Schur } from "./Schur.js";

/**
 * Rotates the given matrix.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

function rotate01(vtav, v) {

	const m01 = vtav.elements[1];

	if(m01 !== 0) {

		Givens.rot01Post(v, Schur.rot01(vtav));

	}

}

/**
 * Rotates the given matrix.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

function rotate02(vtav, v) {

	const m02 = vtav.elements[2];

	if(m02 !== 0) {

		Givens.rot02Post(v, Schur.rot02(vtav));

	}

}

/**
 * Rotates the given matrix.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

export function rotate12(vtav, v) {

	const m12 = vtav.elements[4];

	if(m12 !== 0) {

		Givens.rot12Post(v, Schur.rot12(vtav));

	}

}

/**
 * Computes the symmetric Singular Value Decomposition.
 *
 * @private
 * @param {SymmetricMatrix3} a - A symmetric matrix.
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 * @param {Number} threshold - A threshold.
 * @param {Number} maxSweeps - The maximum number of sweeps.
 */

function getSymmetricSVD(a, vtav, v, threshold, maxSweeps) {

	const delta = threshold * vtav.copy(a).norm();

	let i;

	for(i = 0; i < maxSweeps && vtav.off() > delta; ++i) {

		rotate01(vtav, v);
		rotate02(vtav, v);
		rotate12(vtav, v);

	}

}

/**
 * Computes the pseudo inverse of a given value.
 *
 * @private
 * @param {Number} x - The value to invert.
 * @param {Number} threshold - A threshold.
 * @return {Number} The inverted value.
 */

function pinv(x, threshold) {

	const invX = 1.0 / x;

	return (Math.abs(x) < threshold || Math.abs(invX) < threshold) ? 0.0 : invX;

}

/**
 * Calculates the pseudo inverse of the given matrix.
 *
 * @private
 * @param {Matrix3} t - The target matrix.
 * @param {SymmetricMatrix3} a - A symmetric matrix.
 * @param {Matrix3} b - A matrix.
 * @param {Number} threshold - A threshold.
 * @return {Number} A dimension indicating the amount of truncated singular values.
 */

function pseudoInverse(t, a, b, threshold) {

	const te = t.elements;
	const ae = a.elements;
	const be = b.elements;

	const a00 = ae[0];
	const a11 = ae[3];
	const a22 = ae[5];

	const a0 = pinv(a00, threshold);
	const a1 = pinv(a11, threshold);
	const a2 = pinv(a22, threshold);

	// Count how many singular values have been truncated.
	const truncatedValues = (a0 === 0.0) + (a1 === 0.0) + (a2 === 0.0);

	// Compute the feature dimension.
	const dimension = 3 - truncatedValues;

	const b00 = be[0], b01 = be[3], b02 = be[6];
	const b10 = be[1], b11 = be[4], b12 = be[7];
	const b20 = be[2], b21 = be[5], b22 = be[8];

	te[0] = b00 * a0 * b00 + b01 * a1 * b01 + b02 * a2 * b02;
	te[3] = b00 * a0 * b10 + b01 * a1 * b11 + b02 * a2 * b12;
	te[6] = b00 * a0 * b20 + b01 * a1 * b21 + b02 * a2 * b22;

	te[1] = te[3];
	te[4] = b10 * a0 * b10 + b11 * a1 * b11 + b12 * a2 * b12;
	te[7] = b10 * a0 * b20 + b11 * a1 * b21 + b12 * a2 * b22;

	te[2] = te[6];
	te[5] = te[7];
	te[8] = b20 * a0 * b20 + b21 * a1 * b21 + b22 * a2 * b22;

	return dimension;

}

/**
 * A Singular Value Decomposition solver.
 */

export class SingularValueDecomposition {

	/**
	 * Performs the Singular Value Decomposition.
	 *
	 * @param {SymmetricMatrix3} a - A symmetric matrix.
	 * @param {Vector3} b - A vector.
	 * @param {Vector3} x - A target vector.
	 * @param {Number} svdThreshold - A threshold.
	 * @param {Number} svdSweeps - The maximum number of SVD sweeps.
	 * @param {Number} pseudoInverseThreshold - A threshold.
	 * @return {Number} A dimension indicating the amount of truncated singular values.
	 */

	static solveSymmetric(a, b, x, svdThreshold, svdSweeps, pseudoInverseThreshold) {

		const v = new Matrix3();

		const pinv = new Matrix3();
		const vtav = new SymmetricMatrix3();

		let dimension;

		pinv.set(

			0, 0, 0,
			0, 0, 0,
			0, 0, 0

		);

		vtav.set(

			0, 0, 0,
			0, 0,
			0

		);

		getSymmetricSVD(a, vtav, v, svdThreshold, svdSweeps);

		// Least squares.
		dimension = pseudoInverse(pinv, vtav, v, pseudoInverseThreshold);

		x.copy(b).applyMatrix3(pinv);

		return dimension;

	}

	/**
	 * Calculates the error of the Singular Value Decomposition.
	 *
	 * @param {SymmetricMatrix3} t - A symmetric matrix.
	 * @param {Vector3} b - A vector.
	 * @param {Vector3} x - The calculated position.
	 * @return {Number} The error.
	 */

	static calculateError(t, b, x) {

		const e = t.elements;
		const v = x.clone();
		const a = new Matrix3();

		// Set symmetrically.
		a.set(

			e[0], e[1], e[2],
			e[1], e[3], e[4],
			e[2], e[4], e[5]

		);

		v.applyMatrix3(a);
		v.subVectors(b, v);

		return v.lengthSq();

	}

}
