import { SDFType } from "../sdf/SDFType.js";
import { Sphere } from "../sdf/Sphere.js";
import { Box } from "../sdf/Box.js";
import { Plane } from "../sdf/Plane.js";
import { Torus } from "../sdf/Torus.js";
import { Heightfield } from "../sdf/Heightfield.js";

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
