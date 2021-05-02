import { Vector3 } from "three";
import { SymmetricMatrix3 } from "./SymmetricMatrix3";

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
		 * An accumulation of the surface intersection points.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.massPointSum = new Vector3();

		/**
		 * The amount of accumulated surface intersection points.
		 *
		 * @type {Number}
		 */

		this.numPoints = 0;

	}

	/**
	 * Sets the values of this data instance.
	 *
	 * @param {SymmetricMatrix3} ata - ATA.
	 * @param {Vector3} atb - ATb.
	 * @param {Vector3} massPointSum - The accumulated mass points.
	 * @param {Vector3} numPoints - The number of mass points.
	 * @return {QEFData} This data.
	 */

	set(ata, atb, massPointSum, numPoints) {

		this.ata.copy(ata);
		this.atb.copy(atb);

		this.massPointSum.copy(massPointSum);
		this.numPoints = numPoints;

		return this;

	}

	/**
	 * Copies values from a given data instance.
	 *
	 * @param {QEFData} d - The data to copy.
	 * @return {QEFData} This data.
	 */

	copy(d) {

		return this.set(d.ata, d.atb, d.massPointSum, d.numPoints);

	}

	/**
	 * Adds the given surface intersection point and normal.
	 *
	 * @param {Vector3} p - An intersection point.
	 * @param {Vector3} n - A surface intersection normal.
	 */

	add(p, n) {

		const nx = n.x;
		const ny = n.y;
		const nz = n.z;

		const b = p.dot(n);

		const ata = this.ata.elements;
		const atb = this.atb;

		ata[0] += nx * nx;
		ata[1] += nx * ny; ata[3] += ny * ny;
		ata[2] += nx * nz; ata[4] += ny * nz; ata[5] += nz * nz;

		atb.x += b * nx;
		atb.y += b * ny;
		atb.z += b * nz;

		this.massPointSum.add(p);

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

		this.massPointSum.add(d.massPointSum);
		this.numPoints += d.numPoints;

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
		this.massPointSum.set(0, 0, 0);
		this.numPoints = 0;

	}

	/**
	 * Clones this data.
	 *
	 * @return {QEFData} The cloned data.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

}
