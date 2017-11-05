import { SDFType } from "../sdf/SDFType.js";
import { Heightfield } from "../sdf/Heightfield.js";
import { SuperPrimitive } from "../sdf/SuperPrimitive.js";

/**
 * An SDF reviver.
 */

export class SDFReviver {

	/**
	 * Creates an SDF from the given serialised description.
	 *
	 * @param {Object} description - A serialised SDF.
	 * @return {SignedDistanceFunction} An SDF.
	 */

	static reviveSDF(description) {

		let sdf, i, l;

		switch(description.type) {

			case SDFType.SUPER_PRIMITIVE:
				sdf = new SuperPrimitive(description.parameters, description.material);
				break;

			case SDFType.HEIGHTFIELD:
				sdf = new Heightfield(description.parameters, description.material);
				break;

		}

		sdf.operation = description.operation;

		for(i = 0, l = description.children.length; i < l; ++i) {

			sdf.children.push(this.reviveSDF(description.children[i]));

		}

		return sdf;

	}

}
