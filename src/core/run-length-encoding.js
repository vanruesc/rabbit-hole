/**
 * Run-Length Encoding for numeric data.
 *
 * @class RunLengthEncoding
 * @submodule core
 * @static
 */

export class RunLengthEncoding {

	/**
	 * Encodes the given data.
	 *
	 * @method encode
	 * @static
	 * @param {Array} array - The data to encode.
	 * @return {Object} The run-lengths and the encoded data.
	 */

	encode(array) {

		const runLengths = [];
		const data = [];

		let previous = array[0];
		let count = 1;

		let i, l;

		for(i = 1, l = array.length; i < l; ++i) {

			if(previous !== array[i]) {

				runLengths.push(count);
				data.push(previous);

				previous = array[i];
				count = 1;

			} else {

				++count;

			}

		}

		runLengths.push(count);
		data.push(previous);

		return {
			runLengths,
			data
		};

	}

	/**
	 * Decodes the given data.
	 *
	 * @method decode
	 * @static
	 * @param {Array} runLengths - The run-lengths.
	 * @param {Array} data - The data to decode.
	 * @param {Array} [array] - An optional target.
	 * @return {Array} The decoded data.
	 */

	decode(runLengths, data, array = []) {

		let element;

		let i, j, il, jl;
		let k = 0;

		for(i = 0, il = data.length; i < il; ++i) {

			element = data[i];

			for(j = 0, jl = runLengths[i]; j < jl; ++j) {

				array[k++] = element;

			}

		}

		return array;

	}

}
