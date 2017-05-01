/**
 * A vector with two components.
 *
 * @class Vector2
 * @submodule math
 * @constructor
 * @param {Number} [x=0] - The x value.
 * @param {Number} [y=0] - The y value.
 */

export class Vector2 {

	constructor(x = 0, y = 0) {

		/**
		 * The x component.
		 *
		 * @property x
		 * @type Number
		 */

		this.x = x;

		/**
		 * The y component.
		 *
		 * @property y
		 * @type Number
		 */

		this.y = y;

	}

	/**
	 * Sets the values of this vector
	 *
	 * @method set
	 * @chainable
	 * @param {Number} x - The x value.
	 * @param {Number} y - The y value.
	 * @return {Vector2} This vector.
	 */

	set(x, y) {

		this.x = x;
		this.y = y;

		return this;

	}

	/**
	 * Copies the values of another vector.
	 *
	 * @method copy
	 * @chainable
	 * @param {Vector2} v - A vector.
	 * @return {Vector2} This vector.
	 */

	copy(v) {

		this.x = v.x;
		this.y = v.y;

		return this;

	}

	/**
	 * Copies values from an array.
	 *
	 * @method fromArray
	 * @chainable
	 * @param {Array} array - An array.
	 * @param {Number} offset - An offset.
	 * @return {Vector2} This vector.
	 */

	fromArray(array, offset = 0) {

		this.x = array[offset];
		this.y = array[offset + 1];

		return this;

	}

	/**
	 * Stores this vector in an array.
	 *
	 * @method toArray
	 * @param {Array} [array] - A target array.
	 * @param {Number} offset - An offset.
	 * @return {Vector2} The array.
	 */

	toArray(array = [], offset = 0) {

		array[offset] = this.x;
		array[offset + 1] = this.y;

		return array;

	}

	/**
	 * Checks if this vector equals the given one.
	 *
	 * @method equals
	 * @param {Vector2} v - A vector.
	 * @return {Boolean} Whether this vector equals the given one.
	 */

	equals(v) {

		return (v.x === this.x && v.y === this.y);

	}

	/**
	 * Clones this vector.
	 *
	 * @method clone
	 * @return {Vector2} A clone of this vector.
	 */

	clone() {

		return new this.constructor(this.x, this.y);

	}

	/**
	 * Adds a vector to this one.
	 *
	 * @method add
	 * @chainable
	 * @param {Vector2} v - The vector to add.
	 * @return {Vector2} This vector.
	 */

	add(v) {

		this.x += v.x;
		this.y += v.y;

		return this;

	}

	/**
	 * Adds a scaled vector to this one.
	 *
	 * @method addScaledVector
	 * @chainable
	 * @param {Vector2} v - The vector to scale and add.
	 * @param {Number} s - A scalar.
	 * @return {Vector2} This vector.
	 */

	addScaledVector(v, s) {

		this.x += v.x * s;
		this.y += v.y * s;

		return this;

	}

	/**
	 * Adds a scalar to this vector.
	 *
	 * @method addScalar
	 * @chainable
	 * @param {Number} s - The scalar to add.
	 * @return {Vector2} This vector.
	 */

	addScalar(s) {

		this.x += s;
		this.y += s;

		return this;

	}

	/**
	 * Sets this vector to the sum of two given vectors.
	 *
	 * @method addVectors
	 * @chainable
	 * @param {Vector2} a - A vector.
	 * @param {Vector2} b - Another vector.
	 * @return {Vector2} This vector.
	 */

	addVectors(a, b) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	}

	/**
	 * Subtracts a vector from this vector.
	 *
	 * @method sub
	 * @chainable
	 * @param {Vector2} v - The vector to subtract.
	 * @return {Vector2} This vector.
	 */

	sub(v) {

		this.x -= v.x;
		this.y -= v.y;

		return this;

	}

	/**
	 * Subtracts a scalar to this vector.
	 *
	 * @method subScalar
	 * @chainable
	 * @param {Number} s - The scalar to subtract.
	 * @return {Vector2} This vector.
	 */

	subScalar(s) {

		this.x -= s;
		this.y -= s;

		return this;

	}

	/**
	 * Sets this vector to the difference between two given vectors.
	 *
	 * @method subVectors
	 * @chainable
	 * @param {Vector2} a - A vector.
	 * @param {Vector2} b - A second vector.
	 * @return {Vector2} This vector.
	 */

	subVectors(a, b) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	}

	/**
	 * Multiplies this vector with another vector.
	 *
	 * @method multiply
	 * @chainable
	 * @param {Vector2} v - A vector.
	 * @return {Vector2} This vector.
	 */

	multiply(v) {

		this.x *= v.x;
		this.y *= v.y;

		return this;

	}

	/**
	 * Multiplies this vector with a given scalar.
	 *
	 * @method multiplyScalar
	 * @chainable
	 * @param {Number} s - A scalar.
	 * @return {Vector2} This vector.
	 */

	multiplyScalar(s) {

		if(isFinite(s)) {

			this.x *= s;
			this.y *= s;

		} else {

			this.x = 0;
			this.y = 0;

		}

		return this;

	}

	/**
	 * Sets this vector to the product of two given vectors.
	 *
	 * @method multiplyVectors
	 * @chainable
	 * @param {Vector2} a - A vector.
	 * @param {Vector2} b - Another vector.
	 * @return {Vector2} This vector.
	 */

	multiplyVectors(a, b) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;

		return this;

	}

	/**
	 * Divides this vector by another vector.
	 *
	 * @method divide
	 * @chainable
	 * @param {Vector2} v - A vector.
	 * @return {Vector2} This vector.
	 */

	divide(v) {

		this.x /= v.x;
		this.y /= v.y;

		return this;

	}

	/**
	 * Divides this vector by a given scalar.
	 *
	 * @method divideScalar
	 * @chainable
	 * @param {Number} s - A scalar.
	 * @return {Vector2} This vector.
	 */

	divideScalar(s) {

		return this.multiplyScalar(1 / s);

	}

	/**
	 * Sets this vector to the quotient of two given vectors.
	 *
	 * @method divideVectors
	 * @chainable
	 * @param {Vector2} a - A vector.
	 * @param {Vector2} b - Another vector.
	 * @return {Vector2} This vector.
	 */

	divideVectors(a, b) {

		this.x = a.x / b.x;
		this.y = a.y / b.y;

		return this;

	}

	/**
	 * Negates this vector.
	 *
	 * @method negate
	 * @chainable
	 * @return {Vector2} This vector.
	 */

	negate() {

		this.x = -this.x;
		this.y = -this.y;

		return this;

	}

	/**
	 * Calculates the dot product with another vector.
	 *
	 * @method dot
	 * @param {Vector2} v - A vector.
	 * @return {Number} The dot product.
	 */

	dot(v) {

		return this.x * v.x + this.y * v.y;

	}

	/**
	 * Calculates the squared length of this vector.
	 *
	 * @method lengthSq
	 * @return {Number} The squared length.
	 */

	lengthSq() {

		return this.x * this.x + this.y * this.y;

	}

	/**
	 * Calculates the length of this vector.
	 *
	 * @method length
	 * @return {Number} The length.
	 */

	length() {

		return Math.sqrt(this.x * this.x + this.y * this.y);

	}

	/**
	 * Calculates the distance to a given vector.
	 *
	 * @method distanceTo
	 * @param {Vector2} v - A vector.
	 * @return {Number} The distance.
	 */

	distanceTo(v) {

		return Math.sqrt(this.distanceToSquared(v));

	}

	/**
	 * Calculates the squared distance to a given vector.
	 *
	 * @method distanceToSquared
	 * @param {Vector2} v - A vector.
	 * @return {Number} The squared distance.
	 */

	distanceToSquared(v) {

		const dx = this.x - v.x;
		const dy = this.y - v.y;

		return dx * dx + dy * dy;

	}

	/**
	 * Normalizes this vector.
	 *
	 * @method normalize
	 * @chainable
	 * @return {Vector2} This vector.
	 */

	normalize() {

		return this.divideScalar(this.length());

	}

	/**
	 * Adopts the min value for each component of this vector and the given one.
	 *
	 * @method min
	 * @chainable
	 * @param {Vector2} v - A vector.
	 * @return {Vector2} This vector.
	 */

	min(v) {

		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);

		return this;

	}

	/**
	 * adopts the max value for each component of this vector and the given one.
	 *
	 * @method max
	 * @chainable
	 * @param {Vector2} v - A vector.
	 * @return {Vector2} This vector.
	 */

	max(v) {

		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);

		return this;

	}

	/**
	 * Clamps this vector.
	 *
	 * @method clamp
	 * @chainable
	 * @param {Vector2} min - A vector, assumed to be smaller than max.
	 * @param {Vector2} max - A vector, assumed to be greater than min.
	 * @return {Vector2} This vector.
	 */

	clamp(min, max) {

		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));

		return this;

	}

}
