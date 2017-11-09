import { Box3, Vector2, Vector3, Vector4 } from "math-ds";
import { SignedDistanceFunction } from "./SignedDistanceFunction.js";
import { SDFType } from "./SDFType.js";

/**
 * The super primitive.
 *
 * A function that is able to represent a wide range of conic/rectangular-radial
 * primitives of genus 0 and 1: (round) box, sphere, cylinder, capped cone,
 * torus, capsule, pellet, pipe, etc.
 *
 * Reference:
 *  https://www.shadertoy.com/view/MsVGWG
 *
 * @implements {Serializable}
 */

export class SuperPrimitive extends SignedDistanceFunction {

	/**
	 * Constructs a new super primitive.
	 *
	 * See {@link SuperPrimitivePreset} for a list of default configurations.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.s - The size and thickness [x, y, z, w].
	 * @param {Array} parameters.r - The corner radii [x, y, z].
	 * @param {Array} [parameters.origin] - The origin [x, y, z].
	 * @param {Number} [material] - A material index.
	 * @example
	 *  const cube = SuperPrimitive.create(SuperPrimitivePreset.CUBE);
	 */

	constructor(parameters = {}, material) {

		super(SDFType.SUPER_PRIMITIVE, material);

		/**
		 * The origin.
		 *
		 * @type {Vector3}
		 */

		this.origin = new Vector3();

		if(parameters.origin !== undefined) {

			this.origin.fromArray(parameters.origin);

		}

		/**
		 * The size. The W-components affects the genus of the primitive.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.s = new Vector4(...parameters.s);

		/**
		 * The corner radii.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.r = new Vector3(...parameters.r);

		/**
		 * Precomputed corner rounding constants.
		 *
		 * @type {Vector2}
		 * @private
		 */

		this.ba = new Vector2();

		/**
		 * The bottom radius offset.
		 *
		 * @type {Number}
		 * @private
		 */

		this.offset = 0;

		// Perform constant calculations ahead of time.
		this.precompute();

	}

	/**
	 * Precomputes corner rounding factors.
	 *
	 * @private
	 */

	precompute() {

		const s = this.s;
		const r = this.r;
		const ba = this.ba;

		s.x -= r.x;
		s.y -= r.x;

		r.x -= s.w;
		s.w -= r.y;

		s.z -= r.y;

		this.offset = -2.0 * s.z;

		ba.set(r.z, this.offset);
		ba.divideScalar(ba.dot(ba));

	}

	/**
	 * Calculates the bounding box of this density field.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		this.bbox = new Box3();

		this.bbox.min.subVectors(this.origin, this.s);
		this.bbox.max.addVectors(this.origin, this.s);

		return this.bbox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

		const o = this.origin;
		const s = this.s;
		const r = this.r;
		const ba = this.ba;

		const dx = Math.abs(position.x - o.x) - s.x;
		const dy = Math.abs(position.y - o.y) - s.y;
		const dz = Math.abs(position.z - o.z) - s.z;

		const mx0 = Math.max(dx, 0.0);
		const my0 = Math.max(dy, 0.0);
		const l0 = Math.sqrt(mx0 * mx0 + my0 * my0);

		const p = position.z - s.z;
		const q = Math.abs(Math.min(0.0, Math.max(dx, dy)) + l0 - r.x) - s.w;

		const c = Math.min(Math.max(q * ba.x + p * ba.y, 0.0), 1.0);
		const diagX = q - r.z * c;
		const diagY = p - this.offset * c;

		const hx0 = Math.max(q - r.z, 0.0);
		const hy0 = position.z + s.z;
		const hx1 = Math.max(q, 0.0);
		// hy1 = p;

		const diagSq = diagX * diagX + diagY * diagY;
		const h0Sq = hx0 * hx0 + hy0 * hy0;
		const h1Sq = hx1 * hx1 + p * p;
		const paBa = p * ba.x + q * -ba.y;

		const l1 = Math.sqrt(Math.min(diagSq, Math.min(h0Sq, h1Sq)));

		return l1 * Math.sign(Math.max(paBa, dz)) - r.y;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @return {Object} A serialised description of this SDF.
	 */

	serialize() {

		const result = super.serialise();

		result.parameters = {
			origin: this.origin.toArray(),
			s: this.s.toArray(),
			r: this.r.toArray()
		};

		return result;

	}

	/**
	 * Creates a new primitive using the specified preset.
	 *
	 * @param {SuperPrimitivePreset} preset - The super primitive preset.
	 */

	static create(preset) {

		const parameters = superPrimitivePresets[preset];

		return new SuperPrimitive({
			s: parameters[0],
			r: parameters[1]
		});

	}

}

/**
 * A collection of parameter presets.
 *
 * @type {Array<Float32Array[]}
 * @private
 */

const superPrimitivePresets = [

	// Cube.
	[
		new Float32Array([1.0, 1.0, 1.0, 1.0]),
		new Float32Array([0.0, 0.0, 0.0])

	],

	// Cylinder.
	[
		new Float32Array([1.0, 1.0, 1.0, 1.0]),
		new Float32Array([1.0, 0.0, 0.0])

	],

	// Cone.
	[
		new Float32Array([0.0, 0.0, 1.0, 1.0]),
		new Float32Array([0.0, 0.0, 1.0])

	],

	// Pill.
	[
		new Float32Array([1.0, 1.0, 2.0, 1.0]),
		new Float32Array([1.0, 1.0, 0.0])

	],

	// Sphere.
	[
		new Float32Array([1.0, 1.0, 1.0, 1.0]),
		new Float32Array([1.0, 1.0, 0.0])

	],

	// Pellet.
	[
		new Float32Array([1.0, 1.0, 0.25, 1.0]),
		new Float32Array([1.0, 0.25, 0.0])

	],

	// Torus.
	[
		new Float32Array([1.0, 1.0, 0.25, 0.25]),
		new Float32Array([1.0, 0.25, 0.0])

	],

	// Pipe.
	[
		new Float32Array([1.0, 1.0, 1.0, 0.25]),
		new Float32Array([1.0, 0.1, 0.0])

	],

	// Corridor.
	[
		new Float32Array([1.0, 1.0, 1.0, 0.25]),
		new Float32Array([0.1, 0.1, 0.0])
	]

];

/**
 * An enumeration of super primitive presets.
 *
 * @type {Object}
 * @property {Number} CUBE - A cube.
 * @property {Number} CYLINDER - A cylinder.
 * @property {Number} CONE - A cone.
 * @property {Number} PILL - A pill.
 * @property {Number} SPHERE - A sphere.
 * @property {Number} PELLET - A pellet.
 * @property {Number} TORUS - A torus.
 * @property {Number} PIPE - A pipe.
 * @property {Number} CORRIDOR - A corridor.
 */

export const SuperPrimitivePreset = {

	CUBE: 0,
	CYLINDER: 1,
	CONE: 2,
	PILL: 3,
	SPHERE: 4,
	PELLET: 5,
	TORUS: 6,
	PIPE: 7,
	CORRIDOR: 8

};
