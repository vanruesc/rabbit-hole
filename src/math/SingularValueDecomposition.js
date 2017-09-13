import { Matrix3, SymmetricMatrix3, Vector2, Vector3 } from "math-ds";
import { Givens } from "./Givens.js";
import { Schur } from "./Schur.js";

/**
 * A threshold for pseudo inversions.
 *
 * @type {Number}
 * @private
 */

const PSEUDOINVERSE_THRESHOLD = 1e-6;

/**
 * The number of SVD sweeps.
 *
 * @type {Number}
 * @private
 */

const SVD_SWEEPS = 5;

/**
 * A symmetric matrix.
 *
 * @type {SymmetricMatrix3}
 * @private
 */

const sm = new SymmetricMatrix3();

/**
 * A matrix.
 *
 * @type {Matrix3}
 * @private
 */

const m = new Matrix3();

/**
 * A vector.
 *
 * @type {Vector2}
 * @private
 */

const a = new Vector2();

/**
 * A vector that holds the singular values.
 *
 * @type {Vector3}
 * @private
 */

const b = new Vector3();

/**
 * Rotates the matrix element from the first row, second column.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

function rotate01(vtav, v) {

	const se = vtav.elements;
	const ve = v.elements;

	let coefficients;

	if(se[1] !== 0.0) {

		coefficients = Givens.calculateCoefficients(se[0], se[1], se[3]);

		Schur.rotateQXY(a.set(se[0], se[3]), se[1], coefficients);
		se[0] = a.x; se[3] = a.y;

		Schur.rotateXY(a.set(se[2], se[4]), coefficients);
		se[2] = a.x; se[4] = a.y;

		se[1] = 0.0;

		Schur.rotateXY(a.set(ve[0], ve[3]), coefficients);
		ve[0] = a.x; ve[3] = a.y;

		Schur.rotateXY(a.set(ve[1], ve[4]), coefficients);
		ve[1] = a.x; ve[4] = a.y;

		Schur.rotateXY(a.set(ve[2], ve[5]), coefficients);
		ve[2] = a.x; ve[5] = a.y;

	}

}

/**
 * Rotates the matrix element from the first row, third column.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

function rotate02(vtav, v) {

	const se = vtav.elements;
	const ve = v.elements;

	let coefficients;

	if(se[2] !== 0.0) {

		coefficients = Givens.calculateCoefficients(se[0], se[2], se[5]);

		Schur.rotateQXY(a.set(se[0], se[5]), se[2], coefficients);
		se[0] = a.x; se[5] = a.y;

		Schur.rotateXY(a.set(se[1], se[4]), coefficients);
		se[1] = a.x; se[4] = a.y;

		se[2] = 0.0;

		Schur.rotateXY(a.set(ve[0], ve[6]), coefficients);
		ve[0] = a.x; ve[6] = a.y;

		Schur.rotateXY(a.set(ve[1], ve[7]), coefficients);
		ve[1] = a.x; ve[7] = a.y;

		Schur.rotateXY(a.set(ve[2], ve[8]), coefficients);
		ve[2] = a.x; ve[8] = a.y;

	}

}

/**
 * Rotates the matrix element from the second row, third column.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - A matrix.
 */

function rotate12(vtav, v) {

	const se = vtav.elements;
	const ve = v.elements;

	let coefficients;

	if(se[4] !== 0.0) {

		coefficients = Givens.calculateCoefficients(se[3], se[4], se[5]);

		Schur.rotateQXY(a.set(se[3], se[5]), se[4], coefficients);
		se[3] = a.x; se[5] = a.y;

		Schur.rotateXY(a.set(se[1], se[2]), coefficients);
		se[1] = a.x; se[2] = a.y;

		se[4] = 0.0;

		Schur.rotateXY(a.set(ve[3], ve[6]), coefficients);
		ve[3] = a.x; ve[6] = a.y;

		Schur.rotateXY(a.set(ve[4], ve[7]), coefficients);
		ve[4] = a.x; ve[7] = a.y;

		Schur.rotateXY(a.set(ve[5], ve[8]), coefficients);
		ve[5] = a.x; ve[8] = a.y;

	}

}

/**
 * Calculates the singular values.
 *
 * @private
 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
 * @param {Matrix3} v - An identity matrix.
 * @return {Vector3} The singular values.
 */

function solveSymmetric(vtav, v) {

	const e = vtav.elements;

	let i;

	for(i = 0; i < SVD_SWEEPS; ++i) {

		// Rotate the upper right (lower left) triagonal.
		rotate01(vtav, v);
		rotate02(vtav, v);
		rotate12(vtav, v);

	}

	return b.set(e[0], e[3], e[5]);

}

/**
 * Computes the pseudo inverse of a given value.
 *
 * @private
 * @param {Number} x - The value to invert.
 * @return {Number} The inverted value.
 */

function invert(x) {

	const invX = 1.0 / x;

	return (Math.abs(x) < PSEUDOINVERSE_THRESHOLD || Math.abs(invX) < PSEUDOINVERSE_THRESHOLD) ? 0.0 : invX;

}

/**
 * Calculates the pseudo inverse of v using the singular values.
 *
 * @private
 * @param {Matrix3} v - A matrix.
 * @param {Vector3} sigma - The singular values.
 * @return {Matrix3} The inverted matrix.
 */

function pseudoInverse(v, sigma) {

	const ve = v.elements;

	const v00 = ve[0], v01 = ve[3], v02 = ve[6];
	const v10 = ve[1], v11 = ve[4], v12 = ve[7];
	const v20 = ve[2], v21 = ve[5], v22 = ve[8];

	const d0 = invert(sigma.x);
	const d1 = invert(sigma.y);
	const d2 = invert(sigma.z);

	return v.set(

		// First row.
		v00 * d0 * v00 + v01 * d1 * v01 + v02 * d2 * v02,
		v00 * d0 * v10 + v01 * d1 * v11 + v02 * d2 * v12,
		v00 * d0 * v20 + v01 * d1 * v21 + v02 * d2 * v22,

		// Second row.
		v10 * d0 * v00 + v11 * d1 * v01 + v12 * d2 * v02,
		v10 * d0 * v10 + v11 * d1 * v11 + v12 * d2 * v12,
		v10 * d0 * v20 + v11 * d1 * v21 + v12 * d2 * v22,

		// Third row.
		v20 * d0 * v00 + v21 * d1 * v01 + v22 * d2 * v02,
		v20 * d0 * v10 + v21 * d1 * v11 + v22 * d2 * v12,
		v20 * d0 * v20 + v21 * d1 * v21 + v22 * d2 * v22

	);

}

/**
 * A Singular Value Decomposition solver.
 *
 * Decomposes the given linear system into the matrices U, D and V and solves
 * the equation: U D V^T x = b.
 *
 * See http://mathworld.wolfram.com/SingularValueDecomposition.html for more
 * information.
 */

export class SingularValueDecomposition {

	/**
	 * Performs the Singular Value Decomposition to solve the given linear system.
	 *
	 * @param {SymmetricMatrix3} ata - ATA. Will not be modified.
	 * @param {Vector3} atb - ATb. Will not be modified.
	 * @param {Vector3} x - A target vector to store the result in.
	 */

	static solve(ata, atb, x) {

		const sigma = solveSymmetric(sm.copy(ata), m.identity());
		const invV = pseudoInverse(m, sigma);

		x.copy(atb).applyMatrix3(invV);

	}

}
