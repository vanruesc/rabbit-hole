import { Density } from "../density.js";
import { Operation } from "./operation.js";
import { OperationType } from "./operation-type.js";

/**
 * A union operation.
 *
 * @class Union
 * @submodule csg
 * @extends Operation
 * @constructor
 * @param {Operation} ...children - Child operations.
 */

export class Union extends Operation {

	constructor(...children) {

		super(OperationType.UNION, ...children);

	}

	/**
	 * Updates the specified material index.
	 *
	 * @method updateMaterialIndex
	 * @param {Number} index - The index of the material index that needs to be updated.
	 * @param {HermiteData} data0 - The target volume data.
	 * @param {HermiteData} data1 - Predominant volume data.
	 */

	updateMaterialIndex(index, data0, data1) {

		const materialIndex = data1.materialIndices[index];

		if(materialIndex !== Density.HOLLOW) {

			data0.setMaterialIndex(index, materialIndex);

		}

	}

	/**
	 * Selects the edge that is closer to the non-solid grid point.
	 *
	 * @method selectEdge
	 * @param {Edge} edge0 - An existing edge.
	 * @param {Edge} edge1 - A predominant edge.
	 * @param {Boolean} s - Whether the starting point of the edge is solid.
	 * @return {Edge} The selected edge.
	 */

	selectEdge(edge0, edge1, s) {

		return s ?
			((edge0.t > edge1.t) ? edge0 : edge1) :
			((edge0.t < edge1.t) ? edge0 : edge1);

	}

}
