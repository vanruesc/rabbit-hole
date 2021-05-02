import { HermiteData } from "../HermiteData";
import { Material } from "../Material";
import { Operation } from "./Operation";
import { OperationType } from "./OperationType";

/**
 * An operation that describes a density field.
 */

export class DensityFunction extends Operation {

	/**
	 * Constructs a new density function operation.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	constructor(sdf) {

		super(OperationType.DENSITY_FUNCTION);

		/**
		 * An SDF.
		 *
		 * @type {SignedDistanceFunction}
		 * @private
		 */

		this.sdf = sdf;

	}

	/**
	 * Calculates the bounding box of this density function.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		return this.sdf.getBoundingBox(true);

	}

	/**
	 * Calculates the material index for the given world position.
	 *
	 * @param {Vector3} position - The world position of the material index.
	 * @return {Number} The material index.
	 */

	generateMaterialIndex(position) {

		return (this.sdf.sample(position) <= HermiteData.isovalue) ? this.sdf.material : Material.AIR;

	}

	/**
	 * Generates surface intersection data for the specified edge.
	 *
	 * @param {Edge} edge - The edge that should be processed.
	 */

	generateEdge(edge) {

		edge.approximateZeroCrossing(this.sdf);
		edge.computeSurfaceNormal(this.sdf);

	}

}
