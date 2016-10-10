import { Density } from "../density.js";
import { Operation } from "./operation.js";
import { OperationType } from "./operation-type.js";

/**
 * A difference operation.
 *
 * @class Difference
 * @submodule csg
 * @extends Operation
 * @constructor
 * @param {Operation} ...children - Child operations.
 */

export class Difference extends Operation {

	constructor(...children) {

		super(OperationType.DIFFERENCE, ...children);

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

		if(data1.materialIndices[index] !== Density.HOLLOW) {

			data0.setMaterialIndex(index, Density.HOLLOW);

		}

	}

}
