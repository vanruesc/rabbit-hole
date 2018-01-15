import { Matrix4, Quaternion, Vector3 } from "math-ds";
import { OperationType } from "../csg/OperationType.js";
import { Union } from "../csg/Union.js";
import { Difference } from "../csg/Difference.js";
import { Intersection } from "../csg/Intersection.js";
import { DensityFunction } from "../csg/DensityFunction.js";
import { Material } from "../Material.js";

/**
 * A matrix.
 *
 * @type {Matrix4}
 * @private
 */

const m = new Matrix4();

/**
 * An abstract Signed Distance Function.
 *
 * An SDF describes the signed Euclidean distance to the surface of an object,
 * effectively describing its density at every point in 3D space. It yields
 * negative values for points that lie inside the volume and positive values
 * for points outside. The value is zero at the exact boundary of the object.
 *
 * @implements {Serializable}
 * @implements {TransferableContainer}
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
		 */

		this.type = type;

		/**
		 * The operation type.
		 *
		 * @type {OperationType}
		 */

		this.operation = null;

		/**
		 * A material index.
		 *
		 * @type {Number}
		 */

		this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

		/**
		 * The axis-aligned bounding box of this SDF.
		 *
		 * @type {Box3}
		 * @protected
		 */

		this.boundingBox = null;

		/**
		 * The positional translation.
		 *
		 * Call {@link updateInverseTransformation} after changing this field.
		 *
		 * @type {Vector3}
		 */

		this.position = new Vector3();

		/**
		 * The rotation.
		 *
		 * Call {@link updateInverseTransformation} after changing this field.
		 *
		 * @type {Quaternion}
		 */

		this.quaternion = new Quaternion();

		/**
		 * The scale.
		 *
		 * Call {@link updateInverseTransformation} after changing this field.
		 *
		 * @type {Vector3}
		 */

		this.scale = new Vector3(1, 1, 1);

		/**
		 * The inverted transformation matrix.
		 *
		 * @type {Matrix4}
		 */

		this.inverseTransformation = new Matrix4();

		this.updateInverseTransformation();

		/**
		 * A list of SDFs.
		 *
		 * SDFs can be chained to build CSG expressions.
		 *
		 * @type {SignedDistanceFunction[]}
		 * @private
		 */

		this.children = [];

	}

	/**
	 * Composes a transformation matrix using the translation, rotation and scale
	 * of this SDF.
	 *
	 * The transformation matrix is not needed for most SDF calculations and is
	 * therefore not stored explicitly to save space.
	 *
	 * @param {Matrix4} [target] - A target matrix. If none is provided, a new one will be created.
	 * @return {Matrix4} The transformation matrix.
	 */

	getTransformation(target = new Matrix4()) {

		return target.compose(this.position, this.quaternion, this.scale);

	}

	/**
	 * Calculates the AABB of this SDF if it doesn't exist yet and returns it.
	 *
	 * @param {Boolean} [recursive=false] - Whether the child SDFs should be taken into account.
	 * @return {Box3} The bounding box.
	 */

	getBoundingBox(recursive = false) {

		const children = this.children;

		let boundingBox = this.boundingBox;
		let i, l;

		if(boundingBox === null) {

			boundingBox = this.computeBoundingBox();
			this.boundingBox = boundingBox;

		}

		if(recursive) {

			boundingBox = boundingBox.clone();

			for(i = 0, l = children.length; i < l; ++i) {

				boundingBox.union(children[i].getBoundingBox(recursive));

			}

		}

		return boundingBox;

	}

	/**
	 * Sets the material.
	 *
	 * @param {Material} material - The material. Must be an integer in the range of 1 to 255.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	setMaterial(material) {

		this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

		return this;

	}

	/**
	 * Sets the CSG operation type of this SDF.
	 *
	 * @param {OperationType} operation - The CSG operation type.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	setOperationType(operation) {

		this.operation = operation;

		return this;

	}

	/**
	 * Updates the inverse transformation matrix.
	 *
	 * This method should be called after the position, quaternion or scale has
	 * changed. The bounding box will be updated automatically.
	 *
	 * @return {SignedDistanceFunction} This SDF.
	 */

	updateInverseTransformation() {

		this.inverseTransformation.getInverse(this.getTransformation(m));
		this.boundingBox = null;

		return this;

	}

	/**
	 * Adds the given SDF to this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	union(sdf) {

		this.children.push(sdf.setOperationType(OperationType.UNION));

		return this;

	}

	/**
	 * Subtracts the given SDF from this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	subtract(sdf) {

		this.children.push(sdf.setOperationType(OperationType.DIFFERENCE));

		return this;

	}

	/**
	 * Intersects the given SDF with this one.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 * @return {SignedDistanceFunction} This SDF.
	 */

	intersect(sdf) {

		this.children.push(sdf.setOperationType(OperationType.INTERSECTION));

		return this;

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
	 * Serialises this SDF.
	 *
	 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
	 * @return {Object} The serialised data.
	 */

	serialize(deflate = false) {

		const result = {
			type: this.type,
			operation: this.operation,
			material: this.material,
			position: this.position.toArray(),
			quaternion: this.quaternion.toArray(),
			scale: this.scale.toArray(),
			parameters: null,
			children: []
		};

		let i, l;

		for(i = 0, l = this.children.length; i < l; ++i) {

			result.children.push(this.children[i].serialize(deflate));

		}

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		return transferList;

	}

	/**
	 * Returns a plain object that describes this SDF.
	 *
	 * @return {Object} A simple description of this SDF.
	 */

	toJSON() {

		return this.serialize(true);

	}

	/**
	 * Calculates the bounding box of this SDF.
	 *
	 * @protected
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
