import { SDFType } from "../sdf/sdf-type.js";
import { Sphere } from "../sdf/sphere.js";
import { Box } from "../sdf/box.js";
import { Plane } from "../sdf/plane.js";
import { Torus } from "../sdf/torus.js";
import { Heightfield } from "../sdf/heightfield.js";

/**
 * An SDF reviver.
 */

export class Reviver {

	/**
	 * Creates an SDF from the given serialised description.
	 *
	 * @param {Object} description - A serialised SDF.
	 * @return {SignedDistanceFunction} An SDF.
	 */

	static reviveSDF(description) {

		let sdf, i, l;

		switch(description.type) {

			case SDFType.SPHERE:
				sdf = new Sphere(description.parameters, description.material);
				break;

			case SDFType.BOX:
				sdf = new Box(description.parameters, description.material);
				break;

			case SDFType.TORUS:
				sdf = new Torus(description.parameters, description.material);
				break;

			case SDFType.PLANE:
				sdf = new Plane(description.parameters, description.material);
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
