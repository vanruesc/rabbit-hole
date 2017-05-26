import { Material } from "../material.js";
import { Operation } from "./operation.js";
import { OperationType } from "./operation-type.js";

/**
 * A difference operation.
 */

export class Difference extends Operation {

	/**
	 * Constructs a new difference operation.
	 *
	 * @param {Operation} ...children - Child operations.
	 */

	constructor(...children) {

		super(OperationType.DIFFERENCE, ...children);

	}

	/**
	 * Updates the specified material index.
	 *
	 * @param {Number} index - The index of the material index that needs to be updated.
	 * @param {HermiteData} data0 - The target volume data.
	 * @param {HermiteData} data1 - Predominant volume data.
	 */

	updateMaterialIndex(index, data0, data1) {

		if(data1.materialIndices[index] !== Material.AIR) {

			data0.setMaterialIndex(index, Material.AIR);

		}

	}

	/**
	 * Selects the edge that is closer to the solid grid point.
	 *
	 * @param {Edge} edge0 - An existing edge.
	 * @param {Edge} edge1 - A predominant edge.
	 * @param {Boolean} s - Whether the starting point of the edge is solid.
	 * @return {Edge} The selected edge.
	 */

	selectEdge(edge0, edge1, s) {

		return s ?
			((edge0.t < edge1.t) ? edge0 : edge1) :
			((edge0.t > edge1.t) ? edge0 : edge1);

	}

}
