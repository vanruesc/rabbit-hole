/**
 * A collection of matrix rotation utilities.
 *
 * @class Givens
 * @submodule math
 * @static
 */

export class Givens {

	/**
	 * Rotates the given matrix.
	 *
	 * @method rot01Post
	 * @static
	 * @param {Matrix3} m - The target vector.
	 * @param {Object} coefficients - Two coefficients.
	 */

	static rot01Post(m, coefficients) {

		const e = m.elements;

		const m00 = e[0], m01 = e[3];
		const m10 = e[1], m11 = e[4];
		const m20 = e[2], m21 = e[5];

		const c = coefficients.c;
		const s = coefficients.s;

		e[0] = c * m00 - s * m01;
		e[3] = s * m00 + c * m01;
		// e[6] = m02;

		e[1] = c * m10 - s * m11;
		e[4] = s * m10 + c * m11;
		// e[7] = m12;

		e[2] = c * m20 - s * m21;
		e[5] = s * m20 + c * m21;
		// e[8] = m22;

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @method rot02Post
	 * @static
	 * @param {Matrix3} m - The target vector.
	 * @param {Object} coefficients - Two coefficients.
	 */

	static rot02Post(m, coefficients) {

		const e = m.elements;

		const m00 = e[0], m02 = e[6];
		const m10 = e[1], m12 = e[7];
		const m20 = e[2], m22 = e[8];

		const c = coefficients.c;
		const s = coefficients.s;

		e[0] = c * m00 - s * m02;
		// e[3] = m01;
		e[6] = s * m00 + c * m02;

		e[1] = c * m10 - s * m12;
		// e[4] = m11;
		e[7] = s * m10 + c * m12;

		e[2] = c * m20 - s * m22;
		// e[5] = m21;
		e[8] = s * m20 + c * m22;

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @method rot12Post
	 * @static
	 * @param {Matrix3} m - The target vector.
	 * @param {Object} coefficients - Two coefficients.
	 */

	static rot12Post(m, coefficients) {

		const e = m.elements;

		const m01 = e[3], m02 = e[6];
		const m11 = e[4], m12 = e[7];
		const m21 = e[5], m22 = e[8];

		const c = coefficients.c;
		const s = coefficients.s;

		// e[0] = m00;
		e[3] = c * m01 - s * m02;
		e[6] = s * m01 + c * m02;

		// e[1] = m10;
		e[4] = c * m11 - s * m12;
		e[7] = s * m11 + c * m12;

		// e[2] = m20;
		e[5] = c * m21 - s * m22;
		e[8] = s * m21 + c * m22;

	}

}
