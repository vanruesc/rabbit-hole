import { SymmetricMatrix3 } from "./symmetric-matrix3";
import { Vector3 } from "./vector3";
import { SingularValueDecomposition } from "./singular-value-decomposition";
import { QEFData } from "./qef-data";

/**
 * A Quaratic Error Function solver.
 *
 * Finds a point inside a voxel that minimises the sum of the squares of the
 * distances from the voxel's internal point to each of the planes associated
 * with the voxel.
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
		 * QEF data storage.
		 *
		 * @property data
		 * @type QEFData
		 * @private
		 */

		this.data = new QEFData();

		/**
		 * The average of the exact intersection points on the edges of a voxel.
		 *
		 * @property massPoint
		 * @type Vector3
		 * @private
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
		 * Indicates whether this solver has a valid solution.
		 *
		 * @property hasSolution
		 * @type Boolean
		 */

		this.hasSolution = false;

	}

	/**
	 * The error of the previously computed position.
	 *
	 * @property error
	 * @type Number
	 * @final
	 */

	get error() {

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
	 * Adds the given position and normal data.
	 *
	 * @method add
	 * @param {Vector3} p - A position.
	 * @param {Vector3} n - A normal.
	 */

	add(p, n) {

		const nx = n.x;
		const ny = n.y;
		const nz = n.z;

		const dot = n.dot(p);

		const data = this.data;
		const ata = data.ata.elements;
		const atb = data.atb;

		ata[0] += nx * nx; ata[1] += nx * ny; ata[2] += nx * nz;
		ata[3] += ny * ny; ata[4] += ny * nz;
		ata[5] += nz * nz;

		atb.x += dot * nx;
		atb.y += dot * ny;
		atb.z += dot * nz;

		data.btb += dot * dot;

		data.massPoint.add(p);

		++data.numPoints;

		this.hasSolution = false;

	}

	/**
	 * Accumulates the given data.
	 *
	 * @method addData
	 * @param {QEFData} d - The data to add.
	 */

	addData(d) {

		this.data.add(d);
		this.hasSolution = false;

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

		if(data.numPoints > 0 && !this.hasSolution) {

			// At this point the mass point will actually be a sum, so divide it to make it the average.
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

		this.data.clear();
		this.hasSolution = false;

	}

}
