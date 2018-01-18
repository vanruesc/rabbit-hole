import { Box3 } from "math-ds";
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

	canvas.width = image.width;
	canvas.height = image.height;
	context.drawImage(image, 0, 0);

	return context.getImageData(0, 0, image.width, image.height);

}

/**
 * A Signed Distance Function that describes a heightfield.
 */

export class Heightfield extends SignedDistanceFunction {

	/**
	 * Constructs a new heightfield SDF.
	 *
	 * @param {Object} parameters - The parameters.
	 * @param {Array} [parameters.width] - The width of the heightfield.
	 * @param {Array} [parameters.height] - The height of the heightfield.
	 * @param {Uint8ClampedArray} [parameters.data] - The heightmap image data. Can be null.
	 * @param {Image} [parameters.image] - The heightmap image.
	 * @param {Number} [material] - A material index.
	 */

	constructor(parameters = {}, material) {

		super(SDFType.HEIGHTFIELD, material);

		/**
		 * The width.
		 *
		 * @type {Number}
		 * @private
		 */

		this.width = (parameters.width !== undefined) ? parameters.width : 1;

		/**
		 * The height.
		 *
		 * @type {Number}
		 * @private
		 */

		this.height = (parameters.height !== undefined) ? parameters.height : 1;

		/**
		 * The height data.
		 *
		 * @type {Uint8ClampedArray}
		 * @private
		 */

		this.data = (parameters.data !== undefined) ? parameters.data : null;

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

			for(i = 0, j = 0, l = result.length; i < l; ++i, j += 4) {

				result[i] = data[j];

			}

			this.heightmap = image;
			this.width = imageData.width;
			this.height = imageData.height;
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

		const w = Math.min(this.width / this.height, 1.0);
		const h = Math.min(this.height / this.width, 1.0);

		boundingBox.min.set(0, 0, 0);
		boundingBox.max.set(w, 1, h);
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

		const boundingBox = this.boundingBox;

		let d;

		if(boundingBox.containsPoint(position)) {

			position.applyMatrix4(this.inverseTransformation);

			const w = this.width;
			const h = this.height;
			const x = Math.max(Math.min(Math.trunc(position.x * w), w), 0);
			const z = Math.max(Math.min(Math.trunc(position.z * h), h), 0);

			const height = this.data[z * w + x] / 255;

			d = position.y - height;

		} else {

			d = boundingBox.distanceToPoint(position);

		}

		return d;

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
			width: this.width,
			height: this.height,
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
