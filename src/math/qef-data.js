import { SymmetricMatrix3 } from "./symmetric-matrix3";
import { Vector3 } from "./vector3";

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
		 * An accumulation of the exact intersection points on the edges of a voxel.
		 *
		 * @property massPoint
		 * @type Vector3
		 * @private
		 */

		this.massPoint = new Vector3();

		/**
		 * The amount of accumulated points.
		 *
		 * @property numPoints
		 * @type Number
		 */

		this.numPoints = 0;

		/**
		 * The dimension of the mass point. This value is used when mass points are
		 * accumulated during the simplification post-process.
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
	 */

	copy(d) {

		return this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);

	}

	/**
	 * Adds data.
	 *
	 * @method add
	 */

	add(d) {

		this.ata.add(d.ata);
		this.atb.add(d.atb);
		this.btb += d.btb;

		if(this.massPointDimension === d.massPointDimension) {

			this.massPoint.add(d.massPoint);

		} else if(d.massPointDimension > this.massPointDimension) {

			// Adopt the mass point of the higher dimension.
			this.massPoint.copy(d.massPoint);
			this.massPointDimension = d.massPointDimension;

		}

		this.numPoints += d.numPoints;

	}

	/**
	 * Clears this data instance.
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
	 * Clones this data instance.
	 *
	 * @method clone
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}
