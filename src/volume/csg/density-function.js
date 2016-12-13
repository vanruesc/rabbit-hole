import { Material } from "../material.js";
import { Operation } from "./operation.js";
import { OperationType } from "./operation-type.js";

/**
 * The isovalue.
 *
 * @property ISOVALUE
 * @type Number
 * @private
 * @static
 * @final
 */

const ISOVALUE = 0.0;

/**
 * An operation that describes a density field.
 *
 * @class DensityFunction
 * @submodule csg
 * @extends Operation
 * @constructor
 * @param {SignedDistanceFunction} sdf - An SDF.
 */

export class DensityFunction extends Operation {

	constructor(sdf) {

		super(OperationType.DENSITY_FUNCTION);

		/**
		 * An SDF.
		 *
		 * @property sdf
		 * @type SignedDistanceFunction
		 * @private
		 */

		this.sdf = sdf;

	}

	/**
	 * Calculates a bounding box for this operation.
	 *
	 * @method computeBoundingBox
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		this.bbox = this.sdf.computeBoundingBox();

		return this.bbox;

	}

	/**
	 * Calculates the material index for the given world position.
	 *
	 * @method generateMaterialIndex
	 * @param {Vector3} position - The world position of the material index.
	 * @return {Number} The material index.
	 */

	generateMaterialIndex(position) {

		return (this.sdf.sample(position) <= ISOVALUE) ? this.sdf.material : Material.AIR;

	}

	/**
	 * Generates surface intersection data for the specified edge.
	 *
	 * @method generateEdge
	 * @param {Edge} edge - The edge that should be processed.
	 */

	generateEdge(edge) {

		edge.approximateZeroCrossing(this.sdf);
		edge.computeSurfaceNormal(this.sdf);

	}

}
