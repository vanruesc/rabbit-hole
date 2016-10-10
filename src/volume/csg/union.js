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
	 * Overrides existing edges with the predominant data and keeps all other
	 * non-conflicting edges.
	 *
	 * @method updateEdge
	 * @param {Number} indexA - The index of the starting grid point.
	 * @param {Number} indexB - The index of the ending grid point.
	 */

	updateEdge(indexA, indexB) {

	}

}
