import { Box3, Vector3 } from "math-ds";
import { SignedDistanceFunction } from "./SignedDistanceFunction.js";
import { SDFType } from "./SDFType.js";

/**
 * Reads the image data of the given image.
 *
 * @private
 * @param {Image} image - The image.
 * @return {ImageData} The image data.
 */

function readImageData(image) {

	const canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
	const context = canvas.getContext("2d");

	context.drawImage(image, 0, 0);

	return context.getImageData(0, 0, image.width, image.height);

}

/**
 * A Signed Distance Function that describes a heightfield.
 *
 * @implements {Serializable}
 */

export class Heightfield extends SignedDistanceFunction {

	/**
	 * Constructs a new heightfield SDF.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} [parameters.size] - The size of the heightmap [x, y, z]. Y defines the maximum height.
	 * @param {Uint8ClampedArray} [parameters.data] - The heightmap image data. Can be null.
	 * @param {Image} [parameters.image] - The heightmap image.
	 * @param {Number} [material] - A material index.
	 */

	constructor(parameters = {}, material) {

		super(SDFType.HEIGHTFIELD, material);

		/**
		 * The size.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.size = new Vector3(1, 1, 1);

		if(parameters.size !== undefined) {

			this.size.fromArray(parameters.size);

		}

		/**
		 * The height data.
		 *
		 * @type {Uint8ClampedArray}
		 * @private
		 */

		this.data = parameters.data;

		/**
		 * The heightmap.
		 *
		 * @type {Image}
		 * @private
		 */

		this.heightmap = null;

		if(parameters.image !== undefined) {

			this.fromImage(parameters.image);

		}

	}

	/**
	 * Reads the image data of a given heightmap and converts it into a greyscale
	 * data array.
	 *
	 * @param {Image} image - The heightmap image.
	 * @return {Heightfield} This heightfield.
	 */

	fromImage(image) {

		const imageData = (typeof document === "undefined") ? null : readImageData(image);

		let result = null;
		let data;

		let i, j, l;

		if(imageData !== null) {

			data = imageData.data;

			// Reduce image data to greyscale format.
			result = new Uint8ClampedArray(data.length / 4);

			for(i = 0, j = 0, l = data.length; i < l; ++i, j += 4) {

				result[i] = data[j];

			}

			this.heightmap = image;
			this.size.set(imageData.width, 1.0, imageData.height);
			this.data = result;

		}

		return this;

	}

	/**
	 * Calculates the bounding box of this SDF.
	 *
	 * @return {Box3} The bounding box.
	 */

	computeBoundingBox() {

		const boundingBox = new Box3();

		boundingBox.min.set(-1, -1, -1);
		boundingBox.max.set(1, 1, 1);
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

		const x = position.x;
		const z = position.z;
		const h = this.data[z * this.size.x + x] / 255;

		return position.y - h;

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
			size: this.size.toArray(),
			data: deflate ? null : this.data,
			dataUrl: (deflate && this.heightmap !== null) ? this.heightmap.toDataUrl() : null,
			image: null
		};

		return result;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		transferList.push(this.data.buffer);

		return transferList;

	}

}
