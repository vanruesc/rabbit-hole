import { SymmetricMatrix3 } from "./symmetric-matrix3.js";
import { Vector3 } from "./vector3.js";

/**
 * A data container for the QEF solver.
 */

export class QEFData {

	/**
	 * Constructs a new QEF data container.
	 */

	constructor() {

		/**
		 * A symmetric matrix.
		 *
		 * @type {SymmetricMatrix3}
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
		 * @type {Vector3}
		 * @private
		 */

		this.atb = new Vector3();

		/**
		 * Used to calculate the error of the computed position.
		 *
		 * @type {Number}
		 */

		this.btb = 0;

		/**
		 * An accumulation of the surface intersection points.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.massPoint = new Vector3();

		/**
		 * The amount of accumulated surface intersection points.
		 *
		 * @type {Number}
		 */

		this.numPoints = 0;

		/**
		 * The dimension of the mass point. This value is used when mass points are
		 * accumulated during voxel cell clustering.
		 *
		 * @type {Number}
		 */

		this.massPointDimension = 0;

	}

	/**
	 * Sets the values of this data instance.
	 *
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
	 * @return {QEFData} This data.
	 */

	copy(d) {

		return this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);

	}

	/**
	 * Adds the given surface intersection point and normal.
	 *
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
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}
