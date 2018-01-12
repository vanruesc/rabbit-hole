import {
	ConstructiveSolidGeometry,
	HermiteData,
	OperationType,
	SuperPrimitive,
	SuperPrimitivePreset
} from "../../../src";

import { Report } from "../Report.js";
import { Test } from "./Test.js";

/**
 * A decompression test.
 */

export class DecompressionTest extends Test {

	/**
	 * Constructs a new decompression test.
	 */

	constructor() {

		super("Decompression Test");

		/**
		 * A set of Hermite data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.data = null;

		/**
		 * A target container for compressed Hermite data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.targetContainer = new HermiteData(false);

	}

	/**
	 * Initialises this test.
	 *
	 * @return {String} A result message.
	 * @return {DecompressionTest} This test.
	 */

	initialize() {

		const cellSize = 1;
		const halfSize = cellSize / 2;
		const scale = halfSize - 0.075;
		const cellPosition = [-halfSize, -halfSize, -halfSize];

		const sdf = SuperPrimitive.create(SuperPrimitivePreset.PIPE);
		sdf.scale.set(0.475, 0.475, 0.475);
		sdf.updateInverseTransformation();

		this.data = ConstructiveSolidGeometry.run(cellPosition, cellSize, null, sdf.setOperationType(OperationType.UNION));
		this.data.compress();

		return this;

	}

	/**
	 * Clears this test.
	 *
	 * @return {String} A result message.
	 * @return {DecompressionTest} This test.
	 */

	clear() {

		this.data = null;
		this.targetContainer.clear();

		return this;

	}

	/**
	 * Runs this test.
	 *
	 * @return {String} A result message.
	 */

	run() {

		const c = 200;

		const report = new Report("Decompression Report");
		const targetContainer = this.targetContainer;
		const data = this.data;

		let t0, i;

		report.addLine("Performing " + c + " decompression tasks");

		for(i = 0; i < c; ++i) {

			t0 = performance.now();
			data.decompress(targetContainer);
			report.addValue(performance.now() - t0);

		}

		console.log("Decompressed data", targetContainer);

		return report;

	}

}
