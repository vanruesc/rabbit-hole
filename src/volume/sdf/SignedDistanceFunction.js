import { OperationType } from "../csg/OperationType.js";
import { Union } from "../csg/Union.js";
import { Difference } from "../csg/Difference.js";
import { Intersection } from "../csg/Intersection.js";
import { DensityFunction } from "../csg/DensityFunction.js";
import { Material } from "../Material.js";

/**
 * An abstract Signed Distance Function.
 *
 * An SDF describes the signed Euclidean distance to the surface of an object,
 * effectively describing its density at every point in 3D space. It yields
 * negative values for points that lie inside the volume and positive values
 * for points outside. The value is zero at the exact boundary of the object.
 *
 * @implements {Serializable}
 */

export class SignedDistanceFunction {

	/**
	 * Constructs a new base SDF.
	 *
	 * @param {SDFType} type - The type of the SDF.
	 * @param {Number} [material=Material.SOLID] - A material index. Must be an integer in the range of 1 to 255.
	 */

	constructor(type, material = Material.SOLID) {

		/**
		 * The type of this SDF.
		 *
		 * @type {SDFType}
		 * @default null
		 */

		this.type = type;

		/**
		 * The operation type.
		 *
		 * @type {OperationType}
		 * @default null
		 */

		this.operation = null;

		/**
		 * A material index.
		 *
		 * @type {Number}
		 * @private
		 * @default Material.SOLID
		 */

		this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

		/**
		 * A list of SDFs.
		 *
		 * SDFs can be chained to build CSG expressions.
		 *
		 * @type {SignedDistanceFunction[]}
		 * @private
		 */

		this.children = [];

		/**
		 * The bounding box of this SDF.
		 *
		 * @type {Box3}
		 * @private
		 * @default null
		 */

		this.bbox = null;

	}

	/**
	 * The bounding box of this SDF.
	 *
	 * @type {Box3}
	 */

	get boundingBox() {

		return (this.bbox !== null) ? this.bbox : this.computeBoundingBox();

	}

	/**
	 * The complete bounding box of this SDF.
	 *
	 * @type {Box3}
	 */

	get completeBoundingBox() {

		const children = this.children;
		const bbox = this.boundingBox.clone();

		let i, l;

		for(i = 0, l = children.length; i < l; ++i) {

			bbox.union(children[i].completeBoundingBox);

		}

		return bbox;

	}

	/**
	 * Adds the given SDF to this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	union(sdf) {

		sdf.operation = OperationType.UNION;
		this.children.push(sdf);

		return this;

	}

	/**
	 * Subtracts the given SDF from this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	subtract(sdf) {

		sdf.operation = OperationType.DIFFERENCE;
		this.children.push(sdf);

		return this;

	}

	/**
	 * Intersects the given SDF with this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	intersect(sdf) {

		sdf.operation = OperationType.INTERSECTION;
		this.children.push(sdf);

		return this;

	}

	/**
	 * Serialises this SDF.
	 *
	 * @return {Object} A serialised description of this SDF.
	 */

	serialize() {

		const result = {
			type: this.type,
			operation: this.operation,
			material: this.material,
			parameters: null,
			children: []
		};

		const children = this.children;

		let i, l;

		for(i = 0, l = children.length; i < l; ++i) {

			result.children.push(children[i].serialize());

		}

		return result;

	}

	/**
	 * Translates this SDF into a CSG expression.
	 *
	 * @return {Operation} A CSG operation.
	 * @example a.union(b.intersect(c)).union(d).subtract(e) => Difference(Union(a, Intersection(b, c), d), e)
	 */

	toCSG() {

		const children = this.children;

		let operation = new DensityFunction(this);
		let operationType;
		let child;
		let i, l;

		for(i = 0, l = children.length; i < l; ++i) {

			child = children[i];

			if(operationType !== child.operation) {

				operationType = child.operation;

				switch(operationType) {

					case OperationType.UNION:
						operation = new Union(operation);
						break;

					case OperationType.DIFFERENCE:
						operation = new Difference(operation);
						break;

					case OperationType.INTERSECTION:
						operation = new Intersection(operation);
						break;

				}

			}

			operation.children.push(child.toCSG());

		}

		return operation;

	}

	/**
	 * Calculates the bounding box of this SDF.
	 *
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		throw new Error("SignedDistanceFunction#computeBoundingBox method not implemented!");

	}

	/**
	 * Samples the volume's density at the given point in space.
	 *
	 * @throws {Error} An error is thrown if the method is not overridden.
	 * @param {Vector3} position - A position.
	 * @return {Number} The Euclidean distance to the surface.
	 */

	sample(position) {

		throw new Error("SignedDistanceFunction#sample method not implemented!");

	}

}
