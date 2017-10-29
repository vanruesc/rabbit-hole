import { Vector3 } from "math-ds";
import { BinaryUtils } from "../../utils/BinaryUtils.js";
import { KeyIterator } from "./KeyIterator.js";

/**
 * The amount of bits of a DWord.
 *
 * @type {Number}
 * @private
 * @final
 */

const DWORD_BITS = 32;

/**
 * The amount of different values that can be represented with a DWord.
 *
 * @type {Number}
 * @private
 * @final
 */

const RANGE_DWORD = Math.pow(2, DWORD_BITS);

/**
 * The total amount of available bits for safe integers.
 *
 * @type {Number}
 * @private
 * @final
 */

const BITS = 53;

/**
 * The amount of available high bits.
 *
 * In JavaScript, bit operations can only be applied to DWords (32bit).
 * All 53bit keys must be split into a high and a low part for processing.
 *
 * @type {Number}
 * @private
 * @final
 */

const HI_BITS = 21;

/**
 * The amount of available low bits.
 *
 * In JavaScript, bit operations can only be applied to DWords (32bit).
 * All 53bit keys must be split into a high and a low part for processing.
 *
 * @type {Number}
 * @private
 * @final
 */

const LO_BITS = 32;

/**
 * A design for octant keys.
 *
 * 3D coordinates are packed into a single integer to obtain a unique key. This
 * class describes the bit allotment for each coordinate and provides methods
 * for key packing and unpacking.
 *
 * See {@link KeyDesign.BITS} for the total amount of available bits.
 */

export class KeyDesign {

	/**
	 * Constructs a new key design.
	 *
	 * @param {Number} [x=Math.round(BITS * 0.4)] - The amount of bits used for the X-coordinate.
	 * @param {Number} [y=Math.round(BITS * 0.2)] - The amount of bits used for the Y-coordinate.
	 * @param {Number} [z=x] - The amount of bits used for the Z-coordinate.
	 */

	constructor(x = Math.round(BITS * 0.4), y = Math.round(BITS * 0.2), z = x) {

		/**
		 * The amount of bits reserved for the X-coordinate.
		 *
		 * @type {Number}
		 */

		this.x = 0;

		/**
		 * The amount of bits reserved for the Y-coordinate.
		 *
		 * @type {Number}
		 */

		this.y = 0;

		/**
		 * The amount of bits reserved for the Z-coordinate.
		 *
		 * @type {Number}
		 */

		this.z = 0;

		/**
		 * The amount of distinct integers that can be represented with X bits.
		 *
		 * @type {Number}
		 */

		this.rangeX = 0;

		/**
		 * The amount of distinct integers that can be represented with Y bits.
		 *
		 * @type {Number}
		 */

		this.rangeY = 0;

		/**
		 * The amount of distinct integers that can be represented with Z bits.
		 *
		 * @type {Number}
		 */

		this.rangeZ = 0;

		/**
		 * The amount of distinct integers that can be represented with X + Y bits.
		 *
		 * @type {Number}
		 */

		this.rangeXY = 0;

		/**
		 * The key range divided by two.
		 *
		 * @type {Vector3}
		 */

		this.halfRange = null;

		/**
		 * A bit mask for the X-coordinate. The first item holds the low bits while
		 * the second item holds the high bits.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maskX = [0, 0];

		/**
		 * A bit mask for the Y-coordinate. The first item holds the low bits while
		 * the second item holds the high bits.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maskY = [0, 0];

		/**
		 * A bit mask for the Z-coordinate. The first item holds the low bits while
		 * the second item holds the high bits.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maskZ = [0, 0];

		this.set(x, y, z);

	}

	/**
	 * Sets the bit distribution.
	 *
	 * Make sure to clear your octree after changing the key design!
	 *
	 * @param {Number} [x] - The amount of bits used for the X-coordinate.
	 * @param {Number} [y] - The amount of bits used for the Y-coordinate.
	 * @param {Number} [z] - The amount of bits used for the Z-coordinate.
	 */

	set(x, y, z) {

		if(x + y + z > BITS) {

			console.warn("Invalid bit allotment");

			x = Math.round(BITS * 0.4);
			y = Math.round(BITS * 0.2);
			z = x;

		}

		this.x = x;
		this.y = y;
		this.z = z;

		this.rangeX = Math.pow(2, x);
		this.rangeY = Math.pow(2, y);
		this.rangeZ = Math.pow(2, z);

		this.rangeXY = Math.pow(2, x + y);

		this.halfRange = new Vector3(
			this.rangeX / 2,
			this.rangeY / 2,
			this.rangeZ / 2
		);

		this.updateBitMasks();

	}

	/**
	 * Creates bit masks for the extraction of coordinates from keys.
	 *
	 * @private
	 */

	updateBitMasks() {

		const xBits = this.x;
		const yBits = this.y;
		const zBits = this.z;

		const maskX = this.maskX;
		const maskY = this.maskY;
		const maskZ = this.maskZ;

		const hiShiftX = DWORD_BITS - Math.max(0, xBits - LO_BITS);
		const hiShiftY = DWORD_BITS - Math.max(0, yBits + xBits - LO_BITS);
		const hiShiftZ = DWORD_BITS - Math.max(0, zBits + yBits + xBits - LO_BITS);

		maskX[1] = (hiShiftX < DWORD_BITS) ? ~0 >>> hiShiftX : 0;
		maskX[0] = ~0 >>> Math.max(0, LO_BITS - xBits);

		maskY[1] = (((hiShiftY < DWORD_BITS) ? ~0 >>> hiShiftY : 0) & ~maskX[1]) >>> 0;
		maskY[0] = ((~0 >>> Math.max(0, LO_BITS - (xBits + yBits))) & ~maskX[0]) >>> 0;

		maskZ[1] = (((hiShiftZ < DWORD_BITS) ? ~0 >>> hiShiftZ : 0) & ~maskY[1] & ~maskX[1]) >>> 0;
		maskZ[0] = ((~0 >>> Math.max(0, LO_BITS - (xBits + yBits + zBits))) & ~maskY[0] & ~maskX[0]) >>> 0;

	}

	/**
	 * Extracts the 3D coordinates from a given key.
	 *
	 * @param {Number} key - The key.
	 * @param {Vector3} [target] - A target for the extracted coordinates. If none is provided, a new vector will be created.
	 * @return {Vector3} The extracted coordinates.
	 */

	unpackKey(key, target = new Vector3()) {

		const maskX = this.maskX;
		const maskY = this.maskY;
		const maskZ = this.maskZ;

		// Split the QWord key in a high and a low DWord.
		const hi = Math.trunc(key / RANGE_DWORD);
		const lo = key % RANGE_DWORD;

		return target.set(

			((hi & maskX[1]) * RANGE_DWORD) + ((lo & maskX[0]) >>> 0),
			(((hi & maskY[1]) * RANGE_DWORD) + ((lo & maskY[0]) >>> 0)) / this.rangeX,
			(((hi & maskZ[1]) * RANGE_DWORD) + ((lo & maskZ[0]) >>> 0)) / this.rangeXY

		);

	}

	/**
	 * Packs a 3D position into a unique key.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The octant key.
	 */

	packKey(position) {

		return position.z * this.rangeXY + position.y * this.rangeX + position.x;

	}

	/**
	 * Returns a new key range iterator.
	 *
	 * The key iterator will return all keys in the specified coordinate range,
	 * including those at min and max.
	 *
	 * @param {Vector3} min - The lower key index bounds (zero-based unsigned integer coordinates).
	 * @param {Vector3} max - The upper key index bounds (zero-based unsigned integer coordinates).
	 * @return {KeyIterator} An iterator.
	 */

	keyRange(min, max) {

		return new KeyIterator(this, min, max);

	}

	/**
	 * Converts the information of this key design into a string.
	 *
	 * @return {String} The key design as a string.
	 */

	toString() {

		const maskX = this.maskX;
		const maskY = this.maskY;
		const maskZ = this.maskZ;

		return (

			"Key Design\n\n" +

			"X-Bits: " + this.x + "\n" +
			"Y-Bits: " + this.y + "\n" +
			"Z-Bits: " + this.z + "\n\n" +

			BinaryUtils.createBinaryString(maskX[1], DWORD_BITS) + " " + maskX[1] + " (HI-Mask X)\n" +
			BinaryUtils.createBinaryString(maskX[0], DWORD_BITS) + " " + maskX[0] + " (LO-Mask X)\n\n" +

			BinaryUtils.createBinaryString(maskY[1], DWORD_BITS) + " " + maskY[1] + " (HI-Mask Y)\n" +
			BinaryUtils.createBinaryString(maskY[0], DWORD_BITS) + " " + maskY[0] + " (LO-Mask Y)\n\n" +

			BinaryUtils.createBinaryString(maskZ[1], DWORD_BITS) + " " + maskZ[1] + " (HI-Mask Z)\n" +
			BinaryUtils.createBinaryString(maskZ[0], DWORD_BITS) + " " + maskZ[0] + " (LO-Mask Z)\n"

		);

	}

	/**
	 * The total amount of available bits for safe integers.
	 *
	 * JavaScript uses IEEE 754 binary64 Doubles for Numbers and, as a result,
	 * only supports 53bit integers as of ES2015.
	 *
	 * For more information see: http://2ality.com/2012/04/number-encoding.html
	 *
	 * @type {Number}
	 * @final
	 */

	static get BITS() { return BITS; }

	/**
	 * The amount of available bits in the high DWord.
	 *
	 * In JavaScript, bit operations can only be applied to DWords (32bit).
	 * All 53bit keys must be split into a high and a low part for processing.
	 *
	 * @type {Number}
	 * @final
	 */

	static get HI_BITS() { return HI_BITS; }

	/**
	 * The amount of available bits in the low DWord.
	 *
	 * In JavaScript, bit operations can only be applied to DWords (32bit).
	 * All 53bit keys must be split into a high and a low part for processing.
	 *
	 * @type {Number}
	 * @final
	 */

	static get LO_BITS() { return LO_BITS; }

}
