import { SymmetricMatrix3, Vector3 } from "math-ds";
import { SingularValueDecomposition } from "./SingularValueDecomposition.js";

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p = new Vector3();

/**
 * Computes the error of the approximated position.
 *
 * @private
 * @param {SymmetricMatrix3} ata - ATA.
 * @param {Vector3} atb - ATb.
 * @param {Vector3} x - The calculated vertex position.
 * @return {Number} The QEF error.
 */

function calculateError(ata, atb, x) {

	ata.applyToVector3(p.copy(x));
	p.subVectors(atb, p);

	return p.dot(p);

}

/**
 * A Quaratic Error Function solver.
 *
 * Finds a point inside a voxel that minimises the sum of the squares of the
 * distances to the surface intersection planes associated with the voxel.
 *
 * Based on an implementation by Leonard Ritter and Nick Gildea:
 *  https://github.com/nickgildea/qef
 */

export class QEFSolver {

	/**
	 * Constructs a new QEF solver.
	 */

	constructor() {

		/**
		 * QEF data. Will be used destructively.
		 *
		 * @type {QEFData}
		 * @private
		 */

		this.data = null;

		/**
		 * ATA.
		 *
		 * @type {SymmetricMatrix3}
		 * @private
		 */

		this.ata = new SymmetricMatrix3();

		/**
		 * ATb.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.atb = new Vector3();

		/**
		 * The mass point of the current QEF data set.
		 *
		 * @type {Vector3}
		 */

		this.massPoint = new Vector3();

		/**
		 * Indicates whether this solver has a solution.
		 *
		 * @type {Boolean}
		 */

		this.hasSolution = false;

	}

	/**
	 * Sets the QEF data.
	 *
	 * @param {QEFData} d - QEF Data.
	 * @return {QEFSolver} This solver.
	 */

	setData(d) {

		this.data = d;
		this.hasSolution = false;

		return this;

	}

	/**
	 * Solves the Quadratic Error Function.
	 *
	 * @param {Vector3} x - A target vector to store the vertex position in.
	 * @return {Number} The quadratic error of the solution.
	 */

	solve(x) {

		const data = this.data;
		const massPoint = this.massPoint;
		const ata = this.ata.copy(data.ata);
		const atb = this.atb.copy(data.atb);

		let error = Infinity;

		if(!this.hasSolution && data !== null && data.numPoints > 0) {

			// Divide the mass point sum to get the average.
			p.copy(data.massPointSum).divideScalar(data.numPoints);
			massPoint.copy(p);

			ata.applyToVector3(p);
			atb.sub(p);

			SingularValueDecomposition.solve(ata, atb, x);
			error = calculateError(ata, data.atb, x);
			x.add(massPoint);

			this.hasSolution = true;

		}

		return error;

	}

}
