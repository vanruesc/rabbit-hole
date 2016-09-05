/**
 * Symmetric Givens coefficients.
 *
 * @property coefficients
 * @type Object
 * @private
 * @static
 */

const coefficients = {
	c: 0.0,
	s: 0.0
};

/**
 * Caluclates symmetric coefficients for the Givens post rotation step.
 *
 * @method calculateSymmetricCoefficients
 * @private
 * @static
 * @param {Number} aPP - PP.
 * @param {Number} aPQ - PQ.
 * @param {Number} aQQ - QQ.
 */

function calculateSymmetricCoefficients(aPP, aPQ, aQQ) {

	let tau, stt, tan;

	if(aPQ === 0) {

		coefficients.c = 1;
		coefficients.s = 0;

	} else {

		tau = (aQQ - aPP) / (2.0 * aPQ);
		stt = Math.sqrt(1.0 + tau * tau);
		tan = 1.0 / ((tau >= 0.0) ? (tau + stt) : (tau - stt));

		coefficients.c = 1.0 / Math.sqrt(1.0 + tan * tan);
		coefficients.s = tan * coefficients.c;

	}

}

/**
 * A collection of matrix rotation utilities.
 *
 * @class Schur
 * @submodule math
 * @static
 */

export class Schur {

	/**
	 * Rotates the given matrix.
	 *
	 * @method rot01
	 * @static
	 * @param {SymmetricMatrix3} m - A symmetric matrix.
	 * @return {Object} The coefficients.
	 */

	static rot01(m) {

		const e = m.elements;

		const m00 = e[0], m01 = e[1], m02 = e[2];
		const m11 = e[3], m12 = e[4];

		calculateSymmetricCoefficients(m00, m01, m11);

		const c = coefficients.c, s = coefficients.s;
		const cc = c * c, ss = s * s;

		const mix = 2.0 * c * s * m01;

		e[0] = cc * m00 - mix + ss * m11;
		e[1] = 0;
		e[2] = c * m02 - s * m12;

		e[3] = ss * m00 + mix + cc * m11;
		e[4] = s * m02 + c * m12;

		// e[5] = m22;

		return coefficients;

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @method rot02
	 * @static
	 * @param {SymmetricMatrix3} m - A matrix.
	 * @return {Object} The coefficients.
	 */

	static rot02(m) {

		const e = m.elements;

		const m00 = e[0], m01 = e[1], m02 = e[2];
		const m12 = e[4];
		const m22 = e[5];

		calculateSymmetricCoefficients(m00, m02, m22);

		const c = coefficients.c, s = coefficients.s;
		const cc = c * c, ss = s * s;

		const mix = 2.0 * c * s * m02;

		e[0] = cc * m00 - mix + ss * m22;
		e[1] = c * m01 - s * m12;
		e[2] = 0;

		// e[3] = m11;
		e[4] = s * m01 + c * m12;

		e[5] = ss * m00 + mix + cc * m22;

		return coefficients;

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @method rot12
	 * @static
	 * @param {SymmetricMatrix3} m - A matrix.
	 * @return {Object} The coefficients.
	 */

	static rot12(m) {

		const e = m.elements;

		const m01 = e[1], m02 = e[2];
		const m11 = e[3], m12 = e[4];
		const m22 = e[5];

		calculateSymmetricCoefficients(m11, m12, m22);

		const c = coefficients.c, s = coefficients.s;
		const cc = c * c, ss = s * s;

		const mix = 2.0 * c * s * m12;

		// e[0] = m00;
		e[1] = c * m01 - s * m02;
		e[2] = s * m01 + c * m02;

		e[3] = cc * m11 - mix + ss * m22;
		e[4] = 0;

		e[5] = ss * m11 + mix + cc * m22;

		return coefficients;

	}

}
