import { Material } from "../Material.js";
import { Operation } from "./Operation.js";
import { OperationType } from "./OperationType.js";

/**
 * An intersection operation.
 */

export class Intersection extends Operation {

	/**
	 * Constructs a new intersection operation.
	 *
	 * @param {...Operation} children - Child operations.
	 */

	constructor(...children) {

		super(OperationType.INTERSECTION, ...children);

	}

	/**
	 * Updates the specified material index.
	 *
	 * @param {Number} index - The index of the material index that needs to be updated.
	 * @param {HermiteData} data0 - The target volume data.
	 * @param {HermiteData} data1 - Predominant volume data.
	 */

	updateMaterialIndex(index, data0, data1) {

		const materialIndex = data1.materialIndices[index];

		data0.setMaterialIndex(index, (data0.materialIndices[index] !== Material.AIR && materialIndex !== Material.AIR) ? materialIndex : Material.AIR);

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
