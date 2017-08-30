/**
 * A collection of matrix rotation utilities.
 */

export class Schur {

	/**
	 * Rotates the given matrix.
	 *
	 * @param {Vector2} a - The vector that should be rotated.
	 * @param {Vector2} coefficients - Givens coefficients.
	 */

	static rotateXY(a, coefficients) {

		const c = coefficients.x;
		const s = coefficients.y;

		const u = a.x;
		const v = a.y;

		a.set(
			c * u - s * v,
			s * u + c * v
		);

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @param {Vector2} a - The vector that should be rotated.
	 * @param {Vector2} q - A coefficient factor.
	 * @param {Vector2} coefficients - Givens coefficients.
	 */

	static rotateQXY(a, q, coefficients) {

		const c = coefficients.x;
		const s = coefficients.y;
		const cc = c * c;
		const ss = s * s;

		const mx = 2.0 * c * s * q;

		const u = a.x;
		const v = a.y;

		a.set(
			cc * u - mx + ss * v,
			ss * u + mx + cc * v
		);

	}

}
