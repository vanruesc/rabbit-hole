import {
	ConstructiveSolidGeometry,
	OperationType,
	SuperPrimitive,
	SuperPrimitivePreset
} from "../../../src";

import { Report } from "../Report.js";
import { Test } from "./Test.js";

/**
 * A CSG test.
 */

export class CSGTest extends Test {

	/**
	 * Constructs a new CSG test.
	 */

	constructor() {

		super("CSG Test");

		/**
		 * A set of Hermite data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.data = null;

		/**
		 * A cell size.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = 1;

		/**
		 * A cell position.
		 *
		 * @type {Number[]}
		 * @private
		 */

		this.cellPosition = [-0.5, -0.5, -0.5];

		/**
		 * An SDF.
		 *
		 * @type {SignedDistanceFunction}
		 * @private
		 */

		this.sdf = null;

	}

	/**
	 * Initialises this test.
	 *
	 * @return {String} A result message.
	 * @return {CSGTest} This test.
	 */

	initialize() {

		const scale = (this.cellSize / 2) - 0.075;
		const pellet = SuperPrimitive.create(SuperPrimitivePreset.PELLET).setOperationType(OperationType.UNION);
		const pipe = SuperPrimitive.create(SuperPrimitivePreset.PIPE).setOperationType(OperationType.UNION);

		pellet.scale.set(0.475, 0.475, 0.475);
		pellet.updateInverseTransformation();
		pipe.scale.set(0.475, 0.475, 0.475);
		pipe.updateInverseTransformation();

		this.data = ConstructiveSolidGeometry.run(this.cellPosition, this.cellSize, null, pellet);
		this.sdf = pipe;

		return this;

	}

	/**
	 * Clears this test.
	 *
	 * @return {String} A result message.
	 * @return {CSGTest} This test.
	 */

	clear() {

		this.data = null;
		this.sdf = null;

		return this;

	}

	/**
	 * Runs this test.
	 *
	 * @return {String} A result message.
	 */

	run() {

		const c = 200;

		const report = new Report("CSG Report");
		const cellPosition = this.cellPosition;
		const cellSize = this.cellSize;
		const data = this.data;
		const sdf = this.sdf;

		let result, t0, i;

		report.addLine("Executing " + c + " CSG Union operations on existing data");
		report.addLine("Initial material count: " + data.materials);
		report.addLine("Initial edge count: " + (
			data.edgeData.indices[0].length +
			data.edgeData.indices[1].length +
			data.edgeData.indices[2].length
		));

		for(i = 0; i < c; ++i) {

			t0 = performance.now();
			result = ConstructiveSolidGeometry.run(cellPosition, cellSize, data, sdf);
			report.addValue(performance.now() - t0);

		}

		report.addLine("Final material count: " + result.materials);
		report.addLine("Final edge count: " + (
			result.edgeData.indices[0].length +
			result.edgeData.indices[1].length +
			result.edgeData.indices[2].length
		));

		console.log("Generated data", result);

		return report;

	}

}
