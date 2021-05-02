import { FractalNoise } from "./FractalNoise";
import { Heightfield } from "./Heightfield";
import { SDFType } from "./SDFType";
import { SuperPrimitive } from "./SuperPrimitive";

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
		sdf.position.fromArray(description.position);
		sdf.quaternion.fromArray(description.quaternion);
		sdf.scale.fromArray(description.scale);
		sdf.updateInverseTransformation();

		for(i = 0, l = description.children.length; i < l; ++i) {

			sdf.children.push(this.revive(description.children[i]));

		}

		return sdf;

	}

}
