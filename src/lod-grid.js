import { HeightfieldMaterial } from "./materials";
import THREE from "three";

/**
 * A LOD grid.
 *
 * @class LODGrid
 * @constructor
 * @extends Object3D
 * @param {Number} [heightMap] - The height map for the terrain.
 * @param {Number} [tileScale=1] - The tileScale of the grid.
 * @param {Number} [levels=8] - The detail levels.
 * @param {Number} [morphingLevels=2] - The morph levels. Must be an integer in the range [0, 2].
 * @param {Number} [resolution=64] - The resolution of each level of detail. Must be a power of two.
 */

export class LODGrid extends THREE.Object3D {

	constructor(heightMap, tileScale, levels, resolution, morphingLevels) {

		super();

		/**
		 * The LOD phong material.
		 *
		 * @property material
		 * @type LODPhongMaterial
		 * @private
		 */

		this.material = new HeightfieldMaterial(false);

		/**
		 * The tile scale.
		 *
		 * @property _tileScale
		 * @type Number
		 * @private
		 */

		this._tileScale = 1;

		this.tileScale = tileScale;

		/**
		 * The levels of detail.
		 *
		 * @property _levels
		 * @type Number
		 * @private
		 */

		this._levels = 8;

		this.levels = levels;

		/**
		 * The morph levels of the LOD material.
		 *
		 * @property _morphingLevels
		 * @type Number
		 * @private
		 */

		this._morphingLevels = 2;

		this.morphingLevels = morphingLevels;

		/**
		 * The resolution of each level of detail.
		 *
		 * @property _resolution
		 * @type Number
		 * @private
		 */

		this._resolution = 64;

		this.resolution = resolution;

		/**
		 * The height map.
		 *
		 * @property heightMap
		 * @type Texture
		 * @private
		 */

		this.heightMap = heightMap;

		/**
		 * The previous resolution.
		 *
		 * @property previousResolution
		 * @type Number
		 * @private
		 */

		this.previousResolution = 0;

		/**
		 * The center geometry (LOD 0).
		 *
		 * @property centerGeometry
		 * @type BufferGeometry
		 * @private
		 */

		this.centerGeometry = null;

		/**
		 * The surrounding geometry (LOD > 0).
		 *
		 * @property surroundingGeometry
		 * @type BufferGeometry
		 * @private
		 */

		this.surroundingGeometry = null;

		this.generate();

	}

	/**
	 * The tile scale.
	 *
	 * @property tileScale
	 * @type Number
	 * @default 1
	 */

	get tileScale() { return this._tileScale; }

	set tileScale(x) {

		let i, l;

		if(x !== undefined) {

			x = Math.max(1, x);
			this._tileScale = x;

			for(i = 0, l = this.children.length; i < l; ++i) {

				this.children[i].material.uniforms.scale.value = x;
				x *= 2;

			}

		}

	}

	/**
	 * The levels of detail.
	 *
	 * @property levels
	 * @type Number
	 * @default 8
	 */

	get levels() { return this._levels; }

	set levels(x) {

		if(x !== undefined) {

			this._levels = Math.max(1, Math.round(x));

		}

	}

	/**
		 * The morph levels of the LOD material.
	 *
	 * @property morphingLevels
	 * @type Number
	 * @default 2
	 */

	get morphingLevels() { return this._morphingLevels; }

	set morphingLevels(x) {

		if(x !== undefined) {

			x = Math.max(0, Math.min(2, Math.round(Math.round(x))));
			this._morphingLevels = x;

			this.traverse(function(child) {

				child.material.uniforms.morphingLevels.value = x;

			});

		}

	}

	/**
	 * The resolution of each level of detail. Must be a power of two.
	 *
	 * @property resolution
	 * @type Number
	 * @default 64
	 */

	get resolution() { return this._resolution; }

	set resolution(x) {

		if(x !== undefined) {

			this._resolution = Math.pow(2, Math.round(Math.log2(Math.max(1, x))));
			this.material.defines.RESOLUTION = this.resolution.toFixed(1);
			this.material.needsUpdate = true;

		}

	}

	/**
	 * Generates two new LOD geometries and creates meshes
	 * for all levels of detail.
	 *
	 * @method generate
	 */

	generate() {

		let level, tileScale, geometry, material;

		// Clean up.
		if(this.previousResolution !== this.resolution) {

			// Make new geoemtries and delete the old ones.
			if(this.centerGeometry !== null) { this.centerGeometry.dispose(); }
			if(this.surroundingGeometry !== null) { this.surroundingGeometry.dispose(); }
			this.centerGeometry = this.generateGeometry(this.resolution);
			this.surroundingGeometry = this.generateGeometry(this.resolution, true);

			this.previousResolution = this.resolution;

		}

		// Remove child meshes and delete their material instances.
		while(this.children.length > 0) {

			this.children[0].material.dispose();
			this.remove(this.children[0]);

		}

		// Create new child meshes. 
		for(level = 0, tileScale = this.tileScale; level < this.levels; ++level, tileScale *= 2) {

			geometry = (level === 0) ? this.centerGeometry : this.surroundingGeometry;

			material = this.material.clone();
			material.heightMap = this.heightMap;
			material.uniforms.scale.value = tileScale;
			material.uniforms.level.value = level;

			// Add the new shell.
			this.add(new THREE.Mesh(geometry, material));

		}

	}

	/**
	 * Creates the fundamental LOD geometry.
	 *
	 * The generated geometry can either be a center plane (C)
	 * or a surrounding plane with a hole in the middle (S).
	 *
	 *  +---+---+---+
	 *  | S | S | S |
	 *  |---|---|---|
	 *  | S | C | S |
	 *  |---|---|---|
	 *  | S | S | S |
	 *  +---+---+---+
	 *
	 * The LOD shells use two geometries, namely one center plane and 
	 * multiple surrounding planes to represent the levels of detail. 
	 * Each shell has the same amount of vertices. The scale of each shell 
	 * is defined in the material instances and handled in the vertex shader.
	 *
	 * @method generateGeometry
	 * @private
	 * @param {Number} resolution - The resolution of the geometry.
	 * @param {Boolean} surrounding - Whether this geometry is surrounding a center plane.
	 * @return {BufferGeometry} The geometry.
	 */

	generateGeometry(resolution, surrounding) {

		let geometry = new THREE.BufferGeometry();
		let halfSize = Math.round(resolution * 0.5);
		let halfSizePlusOne = halfSize + 1;

		// (Resolution + 2) ^ 2 square tiles.
		let points = (resolution + 3) * (resolution + 3);
		let triangles = (resolution + 2) * (resolution + 2) * 2;

		let positions = new Float32Array(points * 3);
		let indices = ((positions.length / 3) > 65535) ? new Uint32Array(triangles * 3) : new Uint16Array(triangles * 3);

		geometry.setIndex(new THREE.BufferAttribute(indices, 1));
		geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

		// Vertices.

		let index;

		let x, z;

		for(index = 0, x = -halfSize - 1; x <= halfSizePlusOne; ++x) {

			for(z = -halfSize - 1; z <= halfSizePlusOne; ++z) {

				positions[index] = x / resolution;
				positions[index + 1] = 0;
				positions[index + 2] = z / resolution;

				index += 3;

			}

		}

		// Triangle indices.

		let width = resolution + 3;
		let insideLow = resolution / 4;
		let insideHigh = insideLow * 3;

		let left, right, front, back;
		let insideXHole, insideZHole;
		let a, b, c, d;

		let resolutionPlusOne = resolution + 1;

		for(index = 0, x = 0; x <= resolutionPlusOne; ++x) {

			left = x;
			right = x + 1;
			insideXHole = x > insideLow && x <= insideHigh;

			for(z = 0; z <= resolutionPlusOne; ++z) {

				front = z;
				back = z + 1;
				insideZHole = z > insideLow && z <= insideHigh;

				if(!surrounding || !insideXHole || !insideZHole) {

					a = width * left + back;
					b = width * right + back;
					c = width * right + front;
					d = width * left + front;

					// First triangle.
					indices[index] = a;
					indices[index + 1] = b;
					indices[index + 2] = d;

					// Second triangle.
					indices[index + 3] = d;
					indices[index + 4] = b;
					indices[index + 5] = c;

					index += 6;

				}

			}

		}

		return geometry;

	}

}
