import {
	ConstructiveSolidGeometry,
	DualContouring,
	OperationType,
	SparseVoxelOctree,
	SuperPrimitive,
	SuperPrimitivePreset,
	VoxelCell
} from "../../../src";

import { Vector3 } from "math-ds";
import { Report } from "../Report.js";
import { Test } from "./Test.js";

/**
 * A contouring test.
 */

export class ContouringTest extends Test {

	/**
	 * Constructs a new contouring test.
	 */

	constructor() {

		super("Contouring Test");

		/**
		 * A sparse voxel octree.
		 *
		 * @type {SparseVoxelOctree}
		 * @private
		 */

		this.svo = null;

	}

	/**
	 * Initialises test.
	 *
	 * @return {String} A result message.
	 * @return {ContouringTest} This test.
	 */

	initialize() {

		const cellSize = 1;
		const cellPosition = new Vector3(-0.5, -0.5, -0.5);
		const scale = (cellSize / 2) - 0.075;
		const sdf = SuperPrimitive.create(SuperPrimitivePreset.PIPE);
		sdf.origin.set(0, 0, 0);
		sdf.setScale(scale);

		VoxelCell.errorThreshold = 1.0;

		this.svo = new SparseVoxelOctree(
			ConstructiveSolidGeometry.run(cellPosition.toArray(), cellSize, null, sdf.setOperationType(OperationType.UNION)),
			cellPosition, cellSize
		);

		return this;

	}

	/**
	 * Clears this test.
	 *
	 * @return {String} A result message.
	 * @return {ContouringTest} This test.
	 */

	clear() {

		this.svo = null;

		return this;

	}

	/**
	 * Runs this test.
	 *
	 * @return {String} A result message.
	 */

	run() {

		const c = 200;

		const report = new Report("Contouring Report");
		const svo = this.svo;

		let isosurface, t0, i;

		report.addLine("Performing " + c + " contouring tasks");
		report.addLine("Voxel count: " + svo.voxelCount);

		for(i = 0; i < c; ++i) {

			t0 = performance.now();
			isosurface = DualContouring.run(svo);
			report.addValue(performance.now() - t0);

		}

		report.addLine("Generated vertices: " + (isosurface.positions.length / 3));
		report.addLine("Generated triangle indices: " + isosurface.indices.length);

		console.log("Extracted isosurface", isosurface);

		return report;

	}

}
