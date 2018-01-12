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
 * A compression test.
 */

export class CompressionTest extends Test {

	/**
	 * Constructs a new compression test.
	 */

	constructor() {

		super("Compression Test");

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
	 * @return {CompressionTest} This test.
	 */

	initialize() {

		const cellSize = 1;
		const halfSize = cellSize / 2;
		const cellPosition = [-halfSize, -halfSize, -halfSize];

		const sdf = SuperPrimitive.create(SuperPrimitivePreset.PIPE);
		sdf.scale.set(0.475, 0.475, 0.475);
		sdf.updateInverseTransformation();

		this.data = ConstructiveSolidGeometry.run(cellPosition, cellSize, null, sdf.setOperationType(OperationType.UNION));

		return this;

	}

	/**
	 * Clears this test.
	 *
	 * @return {String} A result message.
	 * @return {CompressionTest} This test.
	 */

	clear() {

		this.data = null;
		this.targetContainer.clear();

		return this;

	}

	/**
	 * Runs this test.
	 *
	 * @return {Report} A report.
	 */

	run() {

		const c = 200;

		const report = new Report("Compression Report");
		const targetContainer = this.targetContainer;
		const data = this.data;

		const n = HermiteData.resolution;
		const maxMaterials = Math.pow((n + 1), 3);
		const maxEdges = 3 * Math.pow((n + 1), 2) * n;

		let edgeData;
		let materials;
		let materialCount;
		let runLengthCount;
		let edgeCount;
		let t0, i;

		report.addLine("Performing " + c + " compression tasks");

		for(i = 0; i < c; ++i) {

			t0 = performance.now();
			data.compress(targetContainer);
			report.addValue(performance.now() - t0);

		}

		materials = targetContainer.materials;
		materialCount = targetContainer.materialIndices.length;
		runLengthCount = targetContainer.runLengths.length;
		edgeData = data.edgeData;
		edgeCount = (
			edgeData.indices[0].length +
			edgeData.indices[1].length +
			edgeData.indices[2].length
		);

		report.addLine("Material Statistics");
		report.addLine("Total Materials: " + maxMaterials + " (" + materials + " solid)");
		report.addLine("Compressed Materials: " + materialCount + " (+ " + runLengthCount + " run-lengths)");
		report.addLine("Compression Ratio: " + (maxMaterials / (materialCount + runLengthCount * 4)).toFixed(2));
		report.addLine("Space Savings: " + ((1 - (materialCount + runLengthCount * 4) / maxMaterials) * 100).toFixed(2) + "%");
		report.addLine("Maximum Memory Usage: " + ((maxMaterials * 8) / 8 / 1024).toFixed(2) + " KB");
		report.addLine("Estimated Memory Usage: " + ((materialCount * 8 + runLengthCount * 32) / 8 / 1024).toFixed(2) + " KB\n");

		report.addLine("Edge Data Statistics");
		report.addLine("Total Edges: " + edgeCount + " (" + maxEdges + " max)");
		report.addLine("Compression Ratio: " + (maxEdges / edgeCount).toFixed(2));
		report.addLine("Space Savings: " + ((1 - edgeCount / maxEdges) * 100).toFixed(2) + "%");
		report.addLine("Maximum Memory Usage: " + ((maxEdges * 32 + maxEdges * 32 + 3 * maxEdges * 32) / 8 / 1024 / 1024).toFixed(2) + " MB");
		report.addLine("Estimated Memory Usage: " + ((edgeCount * 32 + edgeCount * 32 + 3 * edgeCount * 32) / 8 / 1024).toFixed(2) + " KB");

		console.log("Compressed data", targetContainer);

		return report;

	}

}
