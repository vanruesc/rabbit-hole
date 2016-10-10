import { Density } from "../density.js";
import { Operation } from "./operation.js";
import { OperationType } from "./operation-type.js";

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
	 * Calculates the material for the grid point specified by the given index.
	 *
	 * @method generateMaterialIndex
	 * @param {Number} index - The index of the grid point.
	 * @param {Vector3} position - The world position of the material index.
	 * @param {HermiteData} target - The target volume data.
	 */

	generateMaterialIndex(index, position, target) {

		target.materialIndices[index] = (this.sdf.sample(position) < 0.0) ? this.sdf.material : Density.HOLLOW;

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
