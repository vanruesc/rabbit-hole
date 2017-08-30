/**
 * Run-Length Encoding for numerical data.
 */

export class RunLengthEncoding {

	/**
	 * Constructs a new container for Run-Length encoded data.
	 *
	 * @param {Number[]} [runLengths=null] - The run lengths.
	 * @param {Number[]} [data=null] - The encoded data.
	 */

	constructor(runLengths = null, data = null) {

		/**
		 * The run lengths.
		 *
		 * @type {Number[]}
		 * @default null
		 */

		this.runLengths = runLengths;

		/**
		 * The encoded data.
		 *
		 * @type {Number[]}
		 * @default null
		 */

		this.data = data;

	}

	/**
	 * Encodes the given data.
	 *
	 * @param {Number[]} array - The data to encode.
	 * @return {RunLengthEncoding} The run-lengths and the encoded data.
	 */

	static encode(array) {

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

		return new RunLengthEncoding(runLengths, data);

	}

	/**
	 * Decodes the given data.
	 *
	 * @param {Number[]} runLengths - The run-lengths.
	 * @param {Number[]} data - The data to decode.
	 * @param {Array} [array] - An optional target.
	 * @return {Array} The decoded data.
	 */

	static decode(runLengths, data, array = []) {

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
