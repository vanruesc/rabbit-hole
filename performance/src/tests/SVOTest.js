import {
	ConstructiveSolidGeometry,
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
 * A SVO test.
 */

export class SVOTest extends Test {

	/**
	 * Constructs a new SVO test.
	 */

	constructor() {

		super("SVO Test");

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
		 * @type {Vector3}
		 * @private
		 */

		this.cellPosition = new Vector3(-0.5, -0.5, -0.5);

	}

	/**
	 * Initialises this test.
	 *
	 * @return {String} A result message.
	 * @return {SVOTest} This test.
	 */

	initialize() {

		const sdf = SuperPrimitive.create(SuperPrimitivePreset.PIPE);
		sdf.scale.set(0.475, 0.475, 0.475);
		sdf.updateInverseTransformation();

		VoxelCell.errorThreshold = 1e-2;

		this.data = ConstructiveSolidGeometry.run(this.cellPosition.toArray(), this.cellSize, null, sdf.setOperationType(OperationType.UNION));

		return this;

	}

	/**
	 * Clears this test.
	 *
	 * @return {String} A result message.
	 * @return {SVOTest} This test.
	 */

	clear() {

		this.data = null;

		return this;

	}

	/**
	 * Runs this test.
	 *
	 * @return {String} A result message.
	 */

	run() {

		const c = 200;

		const report = new Report("SVO Report");
		const cellPosition = this.cellPosition;
		const cellSize = this.cellSize;
		const data = this.data;

		let svo, t0, i;

		report.addLine("Building " + c + " sparse voxel octrees");
		report.addLine("Material count: " + data.materials);
		report.addLine("Edge count: " + (
			data.edgeData.indices[0].length +
			data.edgeData.indices[1].length +
			data.edgeData.indices[2].length
		));

		for(i = 0; i < c; ++i) {

			t0 = performance.now();
			svo = new SparseVoxelOctree(data, cellPosition, cellSize);
			report.addValue(performance.now() - t0);

		}

		report.addLine("Final voxel count: " + svo.voxelCount);

		console.log("Sparse voxel octree", svo);

		return report;

	}

}
