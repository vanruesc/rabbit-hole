import { SymmetricMatrix3 } from "./symmetric-matrix3.js";
import { Vector3 } from "./vector3.js";
import { SingularValueDecomposition } from "./singular-value-decomposition.js";

/**
 * A Quaratic Error Function solver.
 *
 * Finds a point inside a voxel that minimises the sum of the squares of the
 * distances to the surface intersection planes associated with the voxel.
 *
 * @class QEFSolver
 * @submodule math
 * @constructor
 * @param {Number} [svdThreshold=1e-6] - A threshold for the Singular Value Decomposition error.
 * @param {Number} [svdSweeps=4] - Number of Singular Value Decomposition sweeps.
 * @param {Number} [pseudoInverseThreshold=1e-6] - A threshold for the pseudo inverse error.
 */

export class QEFSolver {

	constructor(svdThreshold = 1e-6, svdSweeps = 4, pseudoInverseThreshold = 1e-6) {

		/**
		 * A Singular Value Decomposition error threshold.
		 *
		 * @property svdThreshold
		 * @type Number
		 * @private
		 * @default 1e-6
		 */

		this.svdThreshold = svdThreshold;

		/**
		 * The number of Singular Value Decomposition sweeps.
		 *
		 * @property svdSweeps
		 * @type Number
		 * @private
		 * @default 4
		 */

		this.svdSweeps = svdSweeps;

		/**
		 * A pseudo inverse error threshold.
		 *
		 * @property pseudoInverseThreshold
		 * @type Number
		 * @private
		 * @default 1e-6
		 */

		this.pseudoInverseThreshold = pseudoInverseThreshold;

		/**
		 * QEF data.
		 *
		 * @property data
		 * @type QEFData
		 * @private
		 * @default null
		 */

		this.data = null;

		/**
		 * The average of the surface intersection points of a voxel.
		 *
		 * @property massPoint
		 * @type Vector3
		 */

		this.massPoint = new Vector3();

		/**
		 * A symmetric matrix.
		 *
		 * @property ata
		 * @type SymmetricMatrix3
		 * @private
		 */

		this.ata = new SymmetricMatrix3();

		/**
		 * A vector.
		 *
		 * @property atb
		 * @type Vector3
		 * @private
		 */

		this.atb = new Vector3();

		/**
		 * A calculated vertex position.
		 *
		 * @property x
		 * @type Vector3
		 * @private
		 */

		this.x = new Vector3();

		/**
		 * Indicates whether this solver has a solution.
		 *
		 * @property hasSolution
		 * @type Boolean
		 */

		this.hasSolution = false;

	}

	/**
	 * Computes the error of the approximated position.
	 *
	 * @method computeError
	 * @return {Number} The QEF error.
	 */

	computeError() {

		const x = this.x;

		let error = Infinity;
		let atax;

		if(this.hasSolution) {

			atax = this.ata.applyToVector3(x.clone());
			error = x.dot(atax) - 2.0 * x.dot(this.atb) + this.data.btb;

		}

		return error;

	}

	/**
	 * Sets the QEF data.
	 *
	 * @method setData
	 * @chainable
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
	 * @method solve
	 * @return {Vector3} The calculated vertex position.
	 */

	solve() {

		const data = this.data;
		const massPoint = this.massPoint;
		const ata = this.ata;
		const atb = this.atb;
		const x = this.x;

		let mp;

		if(!this.hasSolution && data !== null && data.numPoints > 0) {

			// The mass point is a sum, so divide it to make it the average.
			massPoint.copy(data.massPoint);
			massPoint.divideScalar(data.numPoints);

			ata.copy(data.ata);
			atb.copy(data.atb);

			mp = ata.applyToVector3(massPoint.clone());
			atb.sub(mp);

			x.set(0, 0, 0);

			data.massPointDimension = SingularValueDecomposition.solveSymmetric(
				ata, atb, x, this.svdThreshold, this.svdSweeps, this.pseudoInverseThreshold
			);

			// svdError = SingularValueDecomposition.calculateError(ata, atb, x);

			x.add(massPoint);

			atb.copy(data.atb);

			this.hasSolution = true;

		}

		return x;

	}

	/**
	 * Clears this QEF instance.
	 *
	 * @method clear
	 */

	clear() {

		this.data = null;
		this.hasSolution = false;

	}

}
