import { Vector2 } from "math-ds";

/**
 * Symmetric Givens coefficients.
 *
 * @type {Vector2}
 * @private
 */

const coefficients = new Vector2();

/**
 * A collection of matrix rotation utilities.
 */

export class Givens {

	/**
	 * Caluclates symmetric Givens coefficients.
	 *
	 * @param {Number} aPP - PP.
	 * @param {Number} aPQ - PQ.
	 * @param {Number} aQQ - QQ.
	 * @return {Vector2} The coefficients C and S.
	 */

	static calculateCoefficients(aPP, aPQ, aQQ) {

		let tau, stt, tan;

		if(aPQ === 0.0) {

			coefficients.x = 1.0;
			coefficients.y = 0.0;

		} else {

			tau = (aQQ - aPP) / (2.0 * aPQ);
			stt = Math.sqrt(1.0 + tau * tau);
			tan = 1.0 / ((tau >= 0.0) ? (tau + stt) : (tau - stt));

			coefficients.x = 1.0 / Math.sqrt(1.0 + tan * tan);
			coefficients.y = tan * coefficients.x;

		}

		return coefficients;

	}

}
