/**
 * A base class for performance test reports.
 */

export class Report {

	/**
	 * Constructs a new report.
	 *
	 * @param {String} [name] - The name of this report.
	 */

	constructor(name = "Report") {

		/**
		 * The name of this report.
		 *
		 * @type {String}
		 */

		this.name = name;

		/**
		 * A list of strings.
		 *
		 * @type {String[]}
		 */

		this.lines = [];

		/**
		 * A list of measurment values.
		 *
		 * @type {Number[]}
		 */

		this.data = [];

	}

	/**
	 * Clears this report.
	 */

	clear() {

		this.data = [];

	}

	/**
	 * Adds an arbitrary line to the report.
	 *
	 * @param {Number} line - An arbitrary line.
	 */

	addLine(line) {

		this.lines.push(line);

	}

	/**
	 * Adds a measurement reading.
	 *
	 * @param {Number} result - A measurement reading.
	 */

	addValue(value) {

		this.data.push(value);

	}

	/**
	 * Returns a string that describes this instance.
	 *
	 * @return {String} The string representation.
	 */

	toString() {

		const lines = this.lines;
		const data = this.data;

		let result = this.name + "\n\n";

		for(let i = 0, l = lines.length; i < l; ++i) {

			result += lines[i] + "\n";

		}

		result += "\nValues:\n";
		result += "#, ms\n";

		for(let i = 0, l = data.length; i < l; ++i) {

			result += (i + 1) + ", " + data[i] + "\n";

		}

		return result;

	}

}
