/**
 * A 3x3 matrix.
 *
 * This class is a copy of THREE.Matrix3. It can be removed as soon as three.js
 * starts supporting ES6 modules.
 *
 * @class Matrix3
 * @submodule math
 * @constructor
 */

export class Matrix3 {

	constructor() {

		/**
		 * The matrix elements.
		 *
		 * @property elements
		 * @type Float32Array
		 */

		this.elements = new Float32Array([

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		]);

	}

	/**
	 * Sets the values of this matrix.
	 *
	 * @method set
	 * @param {Number} m00 - The value of the first row, first column.
	 * @param {Number} m01 - The value of the first row, second column.
	 * @param {Number} m02 - The value of the first row, third column.
	 * @param {Number} m10 - The value of the second row, first column.
	 * @param {Number} m11 - The value of the second row, second column.
	 * @param {Number} m12 - The value of the second row, third column.
	 * @param {Number} m20 - The value of the third row, first column.
	 * @param {Number} m21 - The value of the third row, second column.
	 * @param {Number} m22 - The value of the third row, third column.
	 * @return {Matrix3} This matrix.
	 */

	set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

		const te = this.elements;

		te[0] = m00; te[1] = m10; te[2] = m20;
		te[3] = m01; te[4] = m11; te[5] = m21;
		te[6] = m02; te[7] = m12; te[8] = m22;

		return this;

	}

	/**
	 * Sets this matrix to the identity matrix.
	 *
	 * @method identity
	 * @return {Matrix3} This matrix.
	 */

	identity() {

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	}

	/**
	 * Copies the values of a given matrix.
	 *
	 * @method copy
	 * @param {Matrix3} m - A matrix.
	 * @return {Matrix3} This matrix.
	 */

	copy(m) {

		const me = m.elements;

		return this.set(

			me[0], me[3], me[6],
			me[1], me[4], me[7],
			me[2], me[5], me[8]

		);

	}

	/**
	 * Clones this matrix.
	 *
	 * @method clone
	 * @return {Matrix3} A clone of this matrix.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}
