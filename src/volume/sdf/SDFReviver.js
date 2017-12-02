import { FractalNoise } from "./FractalNoise.js";
import { Heightfield } from "./Heightfield.js";
import { SDFType } from "./SDFType.js";
import { SuperPrimitive } from "./SuperPrimitive.js";

/**
 * An SDF reviver.
 */

export class SDFReviver {

	/**
	 * Creates an SDF from the given serialised description.
	 *
	 * @param {Object} description - A serialised SDF.
	 * @return {SignedDistanceFunction} A deserialized SDF.
	 */

	revive(description) {

		let sdf, i, l;

		switch(description.type) {

			case SDFType.FRACTAL_NOISE:
				sdf = new FractalNoise(description.parameters, description.material);
				break;

			case SDFType.HEIGHTFIELD:
				sdf = new Heightfield(description.parameters, description.material);
				break;

			case SDFType.SUPER_PRIMITIVE:
				sdf = new SuperPrimitive(description.parameters, description.material);
				break;

		}

		sdf.operation = description.operation;

		for(i = 0, l = description.children.length; i < l; ++i) {

			sdf.children.push(this.revive(description.children[i]));

		}

		return sdf;

	}

}
