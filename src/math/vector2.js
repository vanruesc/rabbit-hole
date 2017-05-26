/**
 * A vector with two components.
 */

export class Vector2 {

	/**
	 * Constructs a new vector2.
	 *
	 * @param {Number} [x=0] - The x value.
	 * @param {Number} [y=0] - The y value.
	 */

	constructor(x = 0, y = 0) {

		/**
		 * The x component.
		 *
		 * @type {Number}
		 */

		this.x = x;

		/**
		 * The y component.
		 *
		 * @type {Number}
		 */

		this.y = y;

	}

	/**
	 * Sets the values of this vector
	 *
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
	 * @param {Vector2} v - A vector.
	 * @return {Boolean} Whether this vector equals the given one.
	 */

	equals(v) {

		return (v.x === this.x && v.y === this.y);

	}

	/**
	 * Clones this vector.
	 *
	 * @return {Vector2} A clone of this vector.
	 */

	clone() {

		return new this.constructor(this.x, this.y);

	}

	/**
	 * Adds a vector to this one.
	 *
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
	 * @param {Number} s - A scalar.
	 * @return {Vector2} This vector.
	 */

	divideScalar(s) {

		return this.multiplyScalar(1 / s);

	}

	/**
	 * Sets this vector to the quotient of two given vectors.
	 *
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
	 * @param {Vector2} v - A vector.
	 * @return {Number} The dot product.
	 */

	dot(v) {

		return this.x * v.x + this.y * v.y;

	}

	/**
	 * Calculates the squared length of this vector.
	 *
	 * @return {Number} The squared length.
	 */

	lengthSq() {

		return this.x * this.x + this.y * this.y;

	}

	/**
	 * Calculates the length of this vector.
	 *
	 * @return {Number} The length.
	 */

	length() {

		return Math.sqrt(this.x * this.x + this.y * this.y);

	}

	/**
	 * Calculates the distance to a given vector.
	 *
	 * @param {Vector2} v - A vector.
	 * @return {Number} The distance.
	 */

	distanceTo(v) {

		return Math.sqrt(this.distanceToSquared(v));

	}

	/**
	 * Calculates the squared distance to a given vector.
	 *
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
	 * @return {Vector2} This vector.
	 */

	normalize() {

		return this.divideScalar(this.length());

	}

	/**
	 * Adopts the min value for each component of this vector and the given one.
	 *
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
