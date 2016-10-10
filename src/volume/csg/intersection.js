import { Density } from "../density.js";
import { Operation } from "./operation.js";
import { OperationType } from "./operation-type.js";

/**
 * An intersection operation.
 *
 * @class Intersection
 * @submodule csg
 * @extends Operation
 * @constructor
 * @param {Operation} ...children - Child operations.
 */

export class Intersection extends Operation {

	constructor(...children) {

		super(OperationType.INTERSECTION, ...children);

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

		data0.setMaterialIndex(index, (data0.materialIndices[index] !== Density.HOLLOW && materialIndex !== Density.HOLLOW) ? materialIndex : Density.HOLLOW);

	}

	/**
	 * Determines whether the edge specified by the given material indices should
	 * be kept or discarded.
	 *
	 * @method updateEdge
	 * @param {Number} indexA - The index of the starting grid point.
	 * @param {Number} indexB - The index of the ending grid point.
	 */

	updateEdge(indexA, indexB) {

	}

}
