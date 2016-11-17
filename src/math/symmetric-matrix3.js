/**
 * A symmetric 3x3 matrix.
 *
 * @class SymmetricMatrix3
 * @submodule math
 * @constructor
 */

export class SymmetricMatrix3 {

	constructor() {

		/**
		 * The matrix elements.
		 *
		 * @property elements
		 * @type Float32Array
		 */

		this.elements = new Float32Array([

			1, 0, 0,
			1, 0,
			1

		]);

	}

	/**
	 * Sets the values of this matrix.
	 *
	 * @method set
	 * @chainable
	 * @param {Number} m00 - The value of the first row, first column.
	 * @param {Number} m01 - The value of the first row, second column.
	 * @param {Number} m02 - The value of the first row, third column.
	 * @param {Number} m11 - The value of the second row, second column.
	 * @param {Number} m12 - The value of the second row, third column.
	 * @param {Number} m22 - The value of the third row, third column.
	 * @return {SymmetricMatrix3} This matrix.
	 */

	set(m00, m01, m02, m11, m12, m22) {

		const e = this.elements;

		e[0] = m00; e[1] = m01; e[2] = m02;
		e[3] = m11; e[4] = m12;
		e[5] = m22;

		return this;

	}

	/**
	 * Sets this matrix to the identity matrix.
	 *
	 * @method identity
	 * @chainable
	 * @return {SymmetricMatrix3} This matrix.
	 */

	identity() {

		this.set(

			1, 0, 0,
			1, 0,
			1

		);

		return this;

	}

	/**
	 * Copies values from a given matrix.
	 *
	 * @method copy
	 * @chainable
	 * @param {Matrix3} m - A matrix.
	 * @return {SymmetricMatrix3} This matrix.
	 */

	copy(m) {

		const me = m.elements;

		this.set(

			me[0], me[1], me[2],
			me[3], me[4],
			me[5]

		);

		return this;

	}

	/**
	 * Clones this matrix.
	 *
	 * @method clone
	 * @return {SymmetricMatrix3} A clone of this matrix.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

	/**
	 * Adds the values of a given matrix to this one.
	 *
	 * @method add
	 * @chainable
	 * @param {Matrix3} m - A matrix.
	 * @return {SymmetricMatrix3} This matrix.
	 */

	add(m) {

		const te = this.elements;
		const me = m.elements;

		te[0] += me[0]; te[1] += me[1]; te[2] += me[2];
		te[3] += me[3]; te[4] += me[4];
		te[5] += me[5];

		return this;

	}

	/**
	 * Calculates the Frobenius norm of this matrix.
	 *
	 * @method norm
	 * @return {Number} The norm of this matrix.
	 */

	norm() {

		const e = this.elements;

		const m01m01 = e[1] * e[1];
		const m02m02 = e[2] * e[2];
		const m12m12 = e[4] * e[4];

		return Math.sqrt(

			e[0] * e[0] + m01m01 + m02m02 +
			m01m01 + e[3] * e[3] + m12m12 +
			m02m02 + m12m12 + e[5] * e[5]

		);

	}

	/**
	 * Calculates the absolute sum of all matrix components except for the main
	 * diagonal.
	 *
	 * @method off
	 * @return {Number} The offset of this matrix.
	 */

	off() {

		const e = this.elements;

		return Math.sqrt(2 * (

			// Diagonal = [0, 3, 5].
			e[1] * e[1] + e[2] * e[2] + e[4] * e[4]

		));

	}

	/**
	 * Applies this symmetric matrix to a vector.
	 *
	 * @method applyToVector3
	 * @param {Vector3} v - The vector to modify.
	 * @return {Vector3} The modified vector.
	 */

	applyToVector3(v) {

		const x = v.x, y = v.y, z = v.z;
		const e = this.elements;

		v.x = e[0] * x + e[1] * y + e[2] * z;
		v.y = e[1] * x + e[3] * y + e[4] * z;
		v.z = e[2] * x + e[4] * y + e[5] * z;

		return v;

	}

}
