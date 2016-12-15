import { SymmetricMatrix3 } from "./symmetric-matrix3.js";
import { Vector3 } from "./vector3.js";

/**
 * A data container for the QEF solver.
 *
 * @class QEFData
 * @submodule math
 * @constructor
 */

export class QEFData {

	constructor() {

		/**
		 * A symmetric matrix.
		 *
		 * @property ata
		 * @type SymmetricMatrix3
		 * @private
		 */

		this.ata = new SymmetricMatrix3();

		this.ata.set(

			0, 0, 0,
			0, 0,
			0

		);

		/**
		 * A vector.
		 *
		 * @property atb
		 * @type Vector3
		 * @private
		 */

		this.atb = new Vector3();

		/**
		 * Used to calculate the error of the computed position.
		 *
		 * @property btb
		 * @type Number
		 */

		this.btb = 0;

		/**
		 * An accumulation of the surface intersection points.
		 *
		 * @property massPoint
		 * @type Vector3
		 * @private
		 */

		this.massPoint = new Vector3();

		/**
		 * The amount of accumulated surface intersection points.
		 *
		 * @property numPoints
		 * @type Number
		 */

		this.numPoints = 0;

		/**
		 * The dimension of the mass point. This value is used when mass points are
		 * accumulated during voxel cell clustering.
		 *
		 * @property massPointDimension
		 * @type Number
		 */

		this.massPointDimension = 0;

	}

	/**
	 * Sets the values of this data instance.
	 *
	 * @method set
	 * @chainable
	 * @return {QEFData} This data.
	 */

	set(ata, atb, btb, massPoint, numPoints) {

		this.ata.copy(ata);
		this.atb.copy(atb);
		this.btb = btb;

		this.massPoint.copy(massPoint);
		this.numPoints = numPoints;

		return this;

	}

	/**
	 * Copies values from a given data instance.
	 *
	 * @method copy
	 * @chainable
	 * @return {QEFData} This data.
	 */

	copy(d) {

		return this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);

	}

	/**
	 * Adds the given surface intersection point and normal.
	 *
	 * @method add
	 * @param {Vector3} p - An intersection point.
	 * @param {Vector3} n - A surface normal.
	 */

	add(p, n) {

		const nx = n.x;
		const ny = n.y;
		const nz = n.z;

		const dot = n.dot(p);

		const ata = this.ata.elements;
		const atb = this.atb;

		ata[0] += nx * nx; ata[1] += nx * ny; ata[2] += nx * nz;
		ata[3] += ny * ny; ata[4] += ny * nz;
		ata[5] += nz * nz;

		atb.x += dot * nx;
		atb.y += dot * ny;
		atb.z += dot * nz;

		this.btb += dot * dot;

		this.massPoint.add(p);

		++this.numPoints;

	}

	/**
	 * Adds an entire data set.
	 *
	 * @method addData
	 * @param {QEFData} d - QEF data.
	 */

	addData(d) {

		this.ata.add(d.ata);
		this.atb.add(d.atb);
		this.btb += d.btb;

		this.massPoint.add(d.massPoint);
		this.numPoints += d.numPoints;

		/* if(this.massPointDimension === d.massPointDimension) {

			this.massPoint.add(d.massPoint);
			this.numPoints += d.numPoints;

		} else if(d.massPointDimension > this.massPointDimension) {

			// Adopt the mass point of the higher dimension.
			this.massPoint.copy(d.massPoint);
			this.massPointDimension = d.massPointDimension;
			this.numPoints = d.numPoints;

		} */

	}

	/**
	 * Clears this data.
	 *
	 * @method clear
	 */

	clear() {

		this.ata.set(

			0, 0, 0,
			0, 0,
			0

		);

		this.atb.set(0, 0, 0);
		this.btb = 0;

		this.massPoint.set(0, 0, 0);
		this.numPoints = 0;

	}

	/**
	 * Clones this data.
	 *
	 * @method clone
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}
