/**
 * A collection of binary number utilities.
 */

export class BinaryUtils {

	/**
	 * Interpretes the given string as a binary number.
	 *
	 * @param {String} s - A string that represents a binary number.
	 * @return {Number} The parsed number.
	 */

	static parseBin(s) {

		return parseInt(s, 2);

	}

	/**
	 * Creates a binary string representation of the given number.
	 *
	 * @param {Number} n - A number.
	 * @param {Number} [minBits=64] - The minimum length of the string.
	 * @return {String} The binary representation.
	 */

	static createBinaryString(n, minBits = 64) {

		const sign = (n < 0) ? "-" : "";

		let result = Math.abs(n).toString(2);

		while(result.length < minBits) {

			result = "0" + result;

		}

		return sign + result;

	}

}
