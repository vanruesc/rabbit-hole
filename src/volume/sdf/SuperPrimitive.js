import { Box3, Vector2, Vector3, Vector4 } from "three";
import { SignedDistanceFunction } from "./SignedDistanceFunction";
import { SDFType } from "./SDFType";

/**
 * The super primitive.
 *
 * A function that is able to represent a wide range of conic/rectangular-radial
 * primitives of genus 0 and 1: (round) box, sphere, cylinder, capped cone,
 * torus, capsule, pellet, pipe, etc.
 *
 * Reference:
 *  https://www.shadertoy.com/view/MsVGWG
 */

export class SuperPrimitive extends SignedDistanceFunction {

	/**
	 * Constructs a new super primitive.
	 *
	 * See {@link SuperPrimitivePreset} for a list of default configurations.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.s - The size and genus weight [x, y, z, w].
	 * @param {Array} parameters.r - The corner radii [x, y, z].
	 * @param {Number} [material] - A material index.
	 * @example const cube = SuperPrimitive.create(SuperPrimitivePreset.CUBE);
	 */

	constructor(parameters = {}, material) {

		super(SDFType.SUPER_PRIMITIVE, material);

		/**
		 * The base size. The W-component affects the genus of the primitive.
		 *
		 * @type {Vector4}
		 * @private
		 */

		this.s0 = new Vector4(...parameters.s);

		/**
		 * The base corner radii.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.r0 = new Vector3(...parameters.r);

		/**
		 * The size, adjusted for further calculations.
		 *
		 * @type {Vector4}
		 * @private
		 */

		this.s = new Vector4();

		/**
		 * The corner radii, adjusted for further calculations.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.r = new Vector3();

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

		// Calculate constants ahead of time.
		this.precompute();

	}

	/**
	 * Sets the size and genus weight.
	 *
	 * @param {Number} x - X.
	 * @param {Number} y - Y.
	 * @param {Number} z - Z.
	 * @param {Number} w - W.
	 * @return {SuperPrimitive} This instance.
	 */

	setSize(x, y, z, w) {

		this.s0.set(x, y, z, w);

		return this.precompute();

	}

	/**
	 * Sets the corner radii.
	 *
	 * @param {Number} x - X.
	 * @param {Number} y - Y.
	 * @param {Number} z - Z.
	 * @return {SuperPrimitive} This instance.
	 */

	setRadii(x, y, z) {

		this.r0.set(x, y, z);

		return this.precompute();

	}

	/**
	 * Precomputes corner rounding factors.
	 *
	 * @private
	 * @return {SuperPrimitive} This instance.
	 */

	precompute() {

		const s = this.s.copy(this.s0);
		const r = this.r.copy(this.r0);
		const ba = this.ba;

		s.x -= r.x;
		s.y -= r.x;

		r.x -= s.w;
		s.w -= r.y;

		s.z -= r.y;

		this.offset = -2.0 * s.z;

		ba.set(r.z, this.offset);
		const divisor = ba.dot(ba);

		if(divisor === 0.0) {

			// Y must not be 0 to prevent bad values for Z = 0 in the last term (*).
			ba.set(0.0, -1.0);

		} else {

			ba.divideScalar(divisor);

		}

		return this;

	}

	/**
	 * Calculates the bounding box of this SDF.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		const s = this.s0;
		const boundingBox = new Box3();

		boundingBox.min.x = Math.min(-s.x, -1.0);
		boundingBox.min.y = Math.min(-s.y, -1.0);
		boundingBox.min.z = Math.min(-s.z, -1.0);

		boundingBox.max.x = Math.max(s.x, 1.0);
		boundingBox.max.y = Math.max(s.y, 1.0);
		boundingBox.max.z = Math.max(s.z, 1.0);

		boundingBox.applyMatrix4(this.getTransformation());

		return boundingBox;

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @param {Vector3} position - A position.
	 * @return {Number} The euclidean distance to the surface.
	 */

	sample(position) {

		position.applyMatrix4(this.inverseTransformation);

		const s = this.s;
		const r = this.r;
		const ba = this.ba;

		const dx = Math.abs(position.x) - s.x;
		const dy = Math.abs(position.y) - s.y;
		const dz = Math.abs(position.z) - s.z;

		const mx0 = Math.max(dx, 0.0);
		const my0 = Math.max(dy, 0.0);
		const l0 = Math.sqrt(mx0 * mx0 + my0 * my0);

		const p = position.z - s.z;
		const q = Math.abs(l0 + Math.min(0.0, Math.max(dx, dy)) - r.x) - s.w;

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
		const paBa = q * -ba.y + p * ba.x;

		const l1 = Math.sqrt(Math.min(diagSq, Math.min(h0Sq, h1Sq)));

		// (*) paBa must not be 0: if dz is also 0, the result will be wrong.
		return l1 * Math.sign(Math.max(paBa, dz)) - r.y;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		const result = super.serialize();

		result.parameters = {
			s: this.s0.toArray(),
			r: this.r0.toArray()
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
 * A list of parameter presets.
 *
 * @type {Array<Float32Array[]>}
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
