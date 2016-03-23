import { HeightFieldMaterial } from "./materials";
import THREE from "three";

/**
 * Tiles that sit next to a tile of a greater scale need to have their edges morphed to avoid
 * edges. Mark which edges need morphing using flags. These flags are then read by the vertex
 * shader which performs the actual morph
 *
 * @property EDGE
 * @type Object
 * @private
 * @static
 * @final
 */

const EDGE = {
	NONE: 0,
	TOP: 1,
	LEFT: 2,
	BOTTOM: 4,
	RIGHT: 8
};

/**
 * A heightmap-based terrain.
 *
 * @class HeightField
 * @constructor
 * @extends Object3D
 */

export class HeightField extends THREE.Object3D {

	constructor(heightmap, worldSize, levels, resolution) {

		super();

		this.worldSize = (worldSize !== undefined) ? worldSize : 1024.0;
		this.levels = (levels !== undefined) ? levels : 6;
		this.resolution = (resolution !== undefined) ? resolution : 128;

		// Offset is used to re-center the terrain, this way we get the greates detail
		// nearest to the camera. In the future, should calculate required detail level per tile.
		this.offset = new THREE.Vector3();

		this.heightmap = heightmap;

		// Create geometry that we'll use for each tile, just a standard plane.
		this.geometry = new THREE.PlaneBufferGeometry(1, 1, this.resolution, this.resolution);

		// Place origin at bottom left corner, rather than center.
		let m = new THREE.Matrix4();
		m.makeTranslation(0.5, 0.5, 0);
		this.geometry.applyMatrix(m);

		this.createLayers();

	}

	/**
	 * Creates the LOD layers, a collection of tiles.
	 *
	 * @method createLayers
	 * @private
	 */

	createLayers() {

		let initialScale = this.worldSize / Math.pow(2, this.levels);

		/*
		 * The center layer.
		 *
		 *      +---+---+
		 *      | O | O |
		 *      +---+---+
		 *      | O | O |
		 *      +---+---+
		 *
		 */

		this.createTile(-initialScale, -initialScale, initialScale, EDGE.NONE);
		this.createTile(-initialScale, 0, initialScale, EDGE.NONE);
		this.createTile(0, 0, initialScale, EDGE.NONE);
		this.createTile(0, -initialScale, initialScale, EDGE.NONE);

		/*
		 * Quad tree of tiles, with smallest quads in the center.
		 *
		 * Each added layer consists of the following tiles (A), with
		 * the tiles in the middle being created in previous layers.
		 *
		 *  +---+---+---+---+
		 *  | A | A | A | A |
		 *  +---+---+---+---+
		 *  | A |   |   | A |
		 *  +---+---+---+---+
		 *  | A |   |   | A |
		 *  +---+---+---+---+
		 *  | A | A | A | A |
		 *  +---+---+---+---+
		 *
		 */

		let scale;

		for(scale = initialScale; scale < this.worldSize; scale *= 2) {

			this.createTile(-2 * scale, -2 * scale, scale, EDGE.BOTTOM | EDGE.LEFT);
			this.createTile(-2 * scale, -scale, scale, EDGE.LEFT);
			this.createTile(-2 * scale, 0, scale, EDGE.LEFT);
			this.createTile(-2 * scale, scale, scale, EDGE.TOP | EDGE.LEFT);

			this.createTile(-scale, -2 * scale, scale, EDGE.BOTTOM);
			// The tile missing here is in the previous layer.
			this.createTile(-scale, scale, scale, EDGE.TOP);

			this.createTile(0, -2 * scale, scale, EDGE.BOTTOM);
			// The tile missing here is in the previous layer.
			this.createTile(0, scale, scale, EDGE.TOP);

			this.createTile(scale, -2 * scale, scale, EDGE.BOTTOM | EDGE.RIGHT);
			this.createTile(scale, -scale, scale, EDGE.RIGHT);
			this.createTile(scale, 0, scale, EDGE.RIGHT);
			this.createTile(scale, scale, scale, EDGE.TOP | EDGE.RIGHT);

		}

	}

	/**
	 * Creates a tile with a specific offset and resolution.
	 *
	 * @method createTile
	 * @private
	 * @param
	 * @param
	 * @param
	 * @param
	 */

	createTile(x, y, scale, edgeMorph) {

		let material = new HeightFieldMaterial(this.resolution);
		material.uniforms.tHeight.value = this.heightmap;
		material.uniforms.globalOffset.value = this.offset;
		material.uniforms.tileOffset.value.set(x, y);
		material.uniforms.worldSize.value = this.worldSize;
		material.uniforms.scale.value = scale;
		material.uniforms.edgeMorph.value = edgeMorph;

		this.add(new THREE.Mesh(this.geometry, material));

	}

}
