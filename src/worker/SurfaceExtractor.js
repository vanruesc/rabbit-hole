import { DualContouring } from "../isosurface/dual-contouring/DualContouring.js";
import { SparseVoxelOctree } from "../octree/voxel/SparseVoxelOctree.js";
import { HermiteData } from "../volume/HermiteData.js";
import { ExtractionResponse } from "./messages/ExtractionResponse.js";
import { DataProcessor } from "./DataProcessor.js";

/**
 * A surface extractor that generates a polygonal mesh from Hermite data.
 */

export class SurfaceExtractor extends DataProcessor {

	/**
	 * Constructs a new surface extractor.
	 */

	constructor() {

		super();

		/**
		 * A container for the data that will be returned to the main thread.
		 *
		 * @type {ExtractionResponse}
		 */

		this.response = new ExtractionResponse();

		/**
		 * A target container for decompressed data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.decompressionTarget = new HermiteData(false);

		/**
		 * The result of the isosurface extraction process.
		 *
		 * @type {Isosurface}
		 * @private
		 */

		this.isosurface = null;

	}

	/**
	 * Prepares a response that can be send back to the main thread.
	 *
	 * Should be used together with {@link SurfaceExtractor#createTransferList}.
	 *
	 * @return {ExtractionResponse} A response.
	 */

	respond() {

		const response = super.respond();

		response.isosurface = (this.isosurface !== null) ? this.isosurface.serialise() : null;

		return response;

	}

	/**
	 * Creates a list of transferable items.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list.
	 */

	createTransferList(transferList = []) {

		super.createTransferList(transferList);

		return (this.isosurface !== null) ? this.isosurface.createTransferList(transferList) : transferList;

	}

	/**
	 * Extracts a surface from the given Hermite data.
	 *
	 * @param {ExtractionRequest} request - An extraction request.
	 */

	process(request) {

		// Adopt the provided data.
		const data = super.process(request).getData();

		// Decompress the data and build an SVO.
		const octree = new SparseVoxelOctree(data.decompress(this.decompressionTarget));

		// Generate the isosurface.
		this.isosurface = DualContouring.run(octree);

		// Release the decompressed data.
		this.decompressionTarget.clear();

		return this;

	}

}
