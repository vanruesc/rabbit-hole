/**
 * rabbit-hole v0.0.0 build Mar 30 2016
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2016 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(factory((global.RABBITHOLE = global.RABBITHOLE || {}),global.THREE));
}(this, function (exports,THREE) { 'use strict';

	THREE = 'default' in THREE ? THREE['default'] : THREE;

	const shader = {
		fragment: "#define LOD\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n\nvarying vec3 vWorldPosition;\n\n#include <common>\n#include <color_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n\nvoid main() {\n\n\tvec4 diffuseColor = vec4(diffuse, opacity);\n\tReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));\n\tvec3 totalEmissiveRadiance = emissive;\n\n\t#include <logdepthbuf_fragment>\n\t#include <color_fragment>\n\t#include <specularmap_fragment>\n\t#include <normal_fragment>\n\n\t// accumulation\n\t#include <lights_phong_fragment>\n\t#include <lights_template>\n\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\n\tgl_FragColor = vec4(outgoingLight, diffuseColor.a);\n\n\t#include <premultiplied_alpha_fragment>\n\t#include <tonemapping_fragment>\n\t#include <encodings_fragment>\n\t#include <fog_fragment>\n\n}\n",
		vertex: {
			main: "#define LOD\n\nvarying vec3 vViewPosition;\n\n#include <common>\n#include <color_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <lod_pars_vertex>\n\nvoid main() {\n\n\t#include <color_vertex>\n\n\t#include <begin_vertex>\n\t#include <lod_vertex>\n\t#include <logdepthbuf_vertex>\n\n\tvViewPosition = -mvPosition.xyz;\n\n\t#include <shadowmap_vertex>\n\n}\n",
			lod_pars: "uniform sampler2D heightmap;\r\n\r\nuniform float scale;\r\nuniform int level;\r\nuniform int morphingLevels;\r\n\r\nuniform vec3 planeUp;\r\nuniform vec3 planeAt;\r\nuniform vec3 planePoint;\r\n\r\nvarying vec3 vWorldPosition;\r\n\r\nconst int MAX_MORPHING_LEVELS = 2;\r\n\r\nvec2 computeAncestorMorphing(int morphLevel, vec2 gridPosition, float heightMorphFactor, vec3 cameraScaledPosition, vec2 previousMorphing) {\r\n\r\n\tfloat morphLevelFloat = float(morphLevel);\r\n\r\n\t// Check if it's necessary to apply the morphing (on 1 square on 2).\r\n\tvec2 fractional = gridPosition * RESOLUTION * 0.5;\r\n\r\n\tif(morphLevel > 1) {\r\n\r\n\t\tfractional = (fractional + 0.5) / pow(2.0, morphLevelFloat - 1.0);\r\n\r\n\t}\r\n\r\n\tfractional -= floor(fractional);\r\n\r\n\t// Compute morphing factors based on the height and the parent LOD.\r\n\tvec2 squareOffset = abs(cameraScaledPosition.xz -(gridPosition + previousMorphing)) / morphLevelFloat;\r\n\tvec2 comparePos = max(vec2(0.0), squareOffset * 4.0 - 1.0);\r\n\tfloat parentMorphFactor = min(1.0, max(comparePos.x, comparePos.y));\r\n\r\n\t// Compute the composition of morphing factors.\r\n\tvec2 morphFactor = vec2(0.0);\r\n\r\n\tif(fractional.x + fractional.y > 0.49) {\r\n\r\n\t\tfloat morphing = parentMorphFactor;\r\n\r\n\t\t// If first LOD, apply the height morphing factor everywhere.\r\n\r\n\t\tif(morphLevel + morphLevel == 1) {\r\n\r\n\t\t\tmorphing = max(heightMorphFactor, morphing);\r\n\r\n\t\t}\r\n\r\n\t\tmorphFactor += morphing * floor(fractional * 2.0);\r\n\r\n\t}\r\n\r\n\treturn morphLevelFloat * morphFactor / RESOLUTION;\r\n\r\n}\r\n\t\t\r\nvec4 computePosition(vec4 position) {\r\n\r\n\t#ifdef USE_PLANE_PARAMETERS\r\n\r\n\t\t// Compute the plane rotation if needed.\r\n\t\tmat3 planeRotation;\r\n\t\tvec3 planeY = normalize(planeUp);\r\n\t\tvec3 planeZ = normalize(planeAt);\r\n\t\tvec3 planeX = normalize(cross(planeY, planeZ));\r\n\t\tplaneZ = normalize(cross(planeY, planeX));\r\n\t\tplaneRotation = mat3(planeX, planeY, planeZ);\r\n\r\n\t#endif\r\n\r\n\t// Project the camera position and the scene origin on the grid using plane parameters.\r\n\tvec3 projectedCamera = vec3(cameraPosition.x, 0.0, cameraPosition.z);\r\n\r\n\t#ifdef USE_PLANE_PARAMETERS\r\n\r\n\t\tprojectedCamera = cameraPosition - dot(cameraPosition - planePoint, planeY) * planeY;\r\n\t\tvec3 projectedOrigin = -dot(-planePoint, planeY) * planeY;\r\n\r\n\t#endif\r\n\r\n\t// Discretise the space and make the grid following the camera.\r\n\tfloat cameraHeightLog = log2(length(cameraPosition - projectedCamera));\r\n\tfloat s = scale * pow(2.0, floor(cameraHeightLog)) * 0.005;\r\n\tvec3 cameraScaledPosition = projectedCamera / s;\r\n\r\n\t#ifdef USE_PLANE_PARAMETERS\r\n\r\n\t\tcameraScaledPosition = cameraScaledPosition * planeRotation;\r\n\r\n\t#endif\r\n\r\n\tvec2 gridPosition = position.xz + floor(cameraScaledPosition.xz * RESOLUTION + 0.5) / RESOLUTION;\r\n\r\n\t// Compute the height morphing factor.\r\n\tfloat heightMorphFactor = cameraHeightLog - floor(cameraHeightLog);\r\n\t\t\r\n\t// Compute morphing factors from LOD ancestors.\r\n\tvec2 morphing = vec2(0.0);\r\n\r\n\tfor(int i = 1; i <= MAX_MORPHING_LEVELS; ++i) {\r\n\r\n\t\tif(i <= morphingLevels) {\r\n\r\n\t\t\tmorphing += computeAncestorMorphing(i, gridPosition, heightMorphFactor, cameraScaledPosition, morphing);\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t// Apply final morphing.\r\n\tgridPosition = gridPosition + morphing;\r\n\r\n\t// Compute world coordinates.\r\n\tvec3 worldPosition = vec3(gridPosition.x * s, 0.0, gridPosition.y * s);\r\n\r\n\t#ifdef USE_PLANE_PARAMETERS\r\n\r\n\t\tworldPosition = planeRotation * worldPosition + projectedOrigin;\r\n\r\n\t#endif\r\n\r\n\treturn vec4(worldPosition, 1.0);\r\n\r\n}\r\n\r\nfloat getHeight(vec2 inDir, vec3 position) {\r\n\r\n\tfloat height = sin(position.x * inDir.x + 1.0) * 0.8 + cos(position.z * inDir.y + 1.0) * 0.2;\r\n\treturn height * height * height + 0.5;\r\n\r\n}\r\n\r\n/*float getHeight(vec2 coord) {\r\n\r\n\t// todo: supersample.\r\n\tfloat height = texture2D(heightmap, coord).r;\r\n\r\n\treturn height;\r\n\r\n}*/\r\n",
			lod: "vec4 worldPosition = computePosition(vec4(position, 1.0));\r\n\r\n//worldPosition.y += getHeight(worldPosition.xz / 512.0);\r\n\r\nvec3 heightPosition = worldPosition.xyz / 2.0;\r\n\r\nfloat height = getHeight(vec2(0.3565, 0.265), heightPosition) * 0.3 +\r\n\tgetHeight(vec2(0.07565, 0.0865), heightPosition) * 0.6 +\r\n\tgetHeight(vec2(0.8, 0.99), heightPosition) * 0.1;\r\n\r\nworldPosition.y += height * 10.0 - 10.0 * 0.5;\r\n\r\nvec4 mvPosition = viewMatrix * worldPosition;\r\n\r\nvWorldPosition = worldPosition.xyz;\r\n\r\ngl_Position = projectionMatrix * mvPosition;\r\n"
		}
	};

	/**
	 * A heightfield LOD shader material.
	 *
	 * @class HeightfieldMaterial
	 * @constructor
	 * @extends ShaderMaterial
	 * @params {Texture} heightmap - The heightmap of the terrain.
	 * @params {Boolean} usePlaneParameters - Whether plane parameters should be used.
	 */

	class HeightfieldMaterial extends THREE.ShaderMaterial {

		constructor(heightmap, usePlaneParameters) {

			super({

				defines: {

					RESOLUTION: "64.0"

				},

				uniforms: THREE.UniformsUtils.merge([

					THREE.UniformsLib.common,
					THREE.UniformsLib.normalmap,
					THREE.UniformsLib.fog,
					THREE.UniformsLib.lights,

					{

						heightmap: {type: "t", value: heightmap},

						scale: {type: "f", value: 1.0},
						level: {type: "i", value: 0},
						morphingLevels: {type: "i", value: 2},
						resolution: {type: "i", value: 64},

						planeUp: {type: "v3", value: new THREE.Vector3(0, 1, 0)},
						planeAt: {type: "v3", value: new THREE.Vector3(0, 0, 1)},
						planePoint: {type: "v3", value: new THREE.Vector3(0, 0, 0)},

						emissive: {type: "c", value: new THREE.Color()},
						specular: {type: "c", value: new THREE.Color()},
						shininess: {type: "f", value: 1.0}

					}

				]),

				fragmentShader: shader.fragment,
				vertexShader: shader.vertex.main,

				extensions: {
					derivatives: true
				},

				shading: THREE.FlatShading,
				side: THREE.DoubleSide,
				lights: true,
				fog: true

			});

			if(usePlaneParameters) { this.defines.USE_PLANE_PARAMETERS = "1"; }

			// Register custom shader code.
			THREE.ShaderChunk.lod_pars_vertex = shader.vertex.lod_pars;
			THREE.ShaderChunk.lod_vertex = shader.vertex.lod;

		}

	}

	/**
	 * A LOD grid.
	 *
	 * @class LODGrid
	 * @constructor
	 * @extends Object3D
	 * @param {Number} [heightmap] - The heightmap for the terrain.
	 * @param {Number} [tileScale=1] - The tileScale of the grid.
	 * @param {Number} [levels=8] - The detail levels.
	 * @param {Number} [morphingLevels=2] - The morph levels. Must be an integer in the range [0, 2].
	 * @param {Number} [resolution=64] - The resolution of each level of detail. Must be a power of two.
	 */

	class LODGrid extends THREE.Object3D {

		constructor(heightmap, tileScale, levels, resolution, morphingLevels) {

			super();

			/**
			 * The LOD phong material.
			 *
			 * @property material
			 * @type LODPhongMaterial
			 * @private
			 */

			this.material = new HeightfieldMaterial(heightmap, false);

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

	/**
	 * Precomputed cube edges.
	 *
	 * Used for computing the centroid of each boundary cell.
	 *
	 * @property CUBE_EDGES
	 * @type Int32Array
	 * @private
	 * @static
	 * @final
	 */

	const CUBE_EDGES = (function() {

		let i, j, k, l;
		let edges = new Int32Array(24);

		for(i = 0; i < 8; ++i) {

			for(j = 1; j <= 4; j <<= 1) {

				l = i ^ j;

				if(i <= l) {

					edges[k++] = i;
					edges[k++] = l;

				}

			}

		}

		return edges;

	}());

	/**
	 * Precomputed edge intersection table.
	 *
	 * This is a 2 ^ (cube configuration) -> 2 ^ (edge configuration) map.
	 * There is one entry for each possible cube configuration, and the 
	 * output is a 12-bit vector enumerating all edges crossing the 0-level.
	 *
	 * @property EDGE_TABLE
	 * @type Int32Array
	 * @private
	 * @static
	 * @final
	 */

	const EDGE_TABLE = (function() {

		let i, j, k, l, m;
		let table = new Int32Array(256);

		for(i = 0, k = 0; i < 256; ++i) {

			for(j = 0; j < 24; j += 2) {

				l = !!(i & (1 << CUBE_EDGES[j]));
				m = !!(i & (1 << CUBE_EDGES[j + 1]));

				k |= (l !== m) ? (1 << (j >> 1)) : 0;

			}

			table[i] = k;

		}

		return table;

	}());

	/**
	 * Surface net algorithm for isosurface extraction.
	 *
	 * Original code by Mikola Lysenko.
	 * Based on: S.F. Gibson, "Constrained Elastic Surface Nets". (1998) MERL Tech Report.
	 *
	 * @class SurfaceNet
	 * @constructor
	 * @extends BufferGeometry
	 * @param {Float32Array} dimensions - The dimensions of the isosurface geometry.
	 * @param {Function} potential - The potential function that describes each point inside the 3D bounds of the isosurface.
	 * @param {Array} [bounds] - The bounds of the isosurface geometry.
	 */

	class SurfaceNet extends THREE.BufferGeometry {

		constructor(dimensions, potential, bounds) {

			super();

			/**
			 * The dimensions of the isosurface geometry.
			 *
			 * @property bounds
			 * @type Float32Array
			 * @private
			 */

			this._dimensions = (dimensions !== undefined) ? dimensions : new Float32Array(3);

			/**
			 * The potential function that describes each point
			 * inside the 3D bounds of the isosurface.
			 *
			 * @property potential
			 * @type Function
			 * @private
			 */

			this._potential = (potential !== undefined) ? potential : function(x, y, z) { return 0; };

			/**
			 * The bounds of the isosurface geometry.
			 *
			 * @property bounds
			 * @type Array
			 * @private
			 */

			this._bounds = (bounds !== undefined) ? bounds : [[0, 0, 0], this.dimensions];

			this.update();

		}

		/**
		 * The dimensions of the isosurface geometry.
		 *
		 * @property bounds
		 * @type Float32Array
		 */

		get dimensions() { return this._dimensions; }
		set dimensions(x) { this._dimensions = x; this.update(); }

		/**
		 * The potential function that describes each point
		 * inside the 3D bounds of the isosurface.
		 *
		 * @property potential
		 * @type Function
		 */

		get potential() { return this._potential; }
		set potential(x) { this._potential = x; this.update(); }

		/**
		 * The bounds of the isosurface geometry.
		 *
		 * @property bounds
		 * @type Array
		 * @default [[0, 0, 0], dimensions]
		 */

		get bounds() { return this._bounds; }
		set bounds(x) { this._bounds = x; this.update(); }

		/**
		 * Constructs a surface net from the current data.
		 *
		 * @method update
		 * @private
		 */

		update() {

			let x = new Uint32Array(3);
			let R = new Float32Array([1, (this.dimensions[0] + 1), (this.dimensions[0] + 1) * (this.dimensions[1] + 1)]);

			let grid = new Float32Array(8);

			let maxVertexCount = R[2] * 2;

			if(maxVertexCount > 65536) {

				throw new Error("The specified dimensions exceed the maximum possible number of vertices (65536).");

			}

			let indices = new Uint16Array(maxVertexCount * 6);
			let vertexIndices = new Uint16Array(maxVertexCount);
			let vertices = new Float32Array(vertexIndices.length * 3);
			let vertexCounter = 0;
			let indexCounter = 0;
			let m;

			let scale = new Float32Array(3);
			let shift = new Float32Array(3);

			let i, j, k, bufferNo, n;
			let mask, g, p;

			let v = new Float32Array(3);
			let edgeMask, edgeCount;
			let e0, e1, g0, g1, t, a, b;
			let s, iu, iv, du, dv;

			for(i = 0; i < 3; ++i) {

				scale[i] = (this.bounds[1][i] - this.bounds[0][i]) / this.dimensions[i];
				shift[i] = this.bounds[0][i];

			}

			// March over the voxel grid.
			for(x[2] = 0, n = 0, bufferNo = 1; x[2] < (this.dimensions[2] - 1); ++x[2], n += this.dimensions[0], bufferNo ^= 1, R[2] =- R[2]) {

				m = 1 + (this.dimensions[0] + 1) * (1 + bufferNo * (this.dimensions[1] + 1));

				// The contents of the vertexIndices will be the indices of the vertices on the previous x/y slice of the volume.
				for(x[1] = 0; x[1] < this.dimensions[1] - 1; ++x[1], ++n, m += 2) {

					for(x[0] = 0, mask = 0, g = 0; x[0] < this.dimensions[0] - 1; ++x[0], ++n, ++m) {

						/* Read in 8 field values around this vertex and store them in an array.
						 * Also calculate 8-bit mask, like in marching cubes, so we can speed up sign checks later.
						 */

						for(k = 0; k < 2; ++k) {

							for(j = 0; j < 2; ++j) {

								for(i = 0; i < 2; ++i, ++g) {

									p = this.potential(
										scale[0] * (x[0] + i) + shift[0],
										scale[1] * (x[1] + j) + shift[1],
										scale[2] * (x[2] + k) + shift[2]
									);

									grid[g] = p;
									mask |= (p < 0) ? (1 << g) : 0;

								}

							}

						}

						// Continue if the cell doesn't intersect the boundary.
						if(mask !== 0 && mask !== 0xff) {

							// Sum up edge intersections.
							edgeMask = EDGE_TABLE[mask];
							v[0] = v[1] = v[2] = 0.0;
							edgeCount = 0;

							// For every edge of the cube.
							for(i = 0; i < 12; ++i) {

								// Use edge mask to check if it is crossed.
								if(edgeMask & (1 << i)) {

									// If it did, increment number of edge crossings.
									++edgeCount;

									// Now find the point of intersection.

									// Unpack vertices.
									e0 = CUBE_EDGES[i << 1];
									e1 = CUBE_EDGES[(i << 1) + 1];

									// Unpack grid values.
									g0 = grid[e0];
									g1 = grid[e1];

									// Compute point of intersection.
									t  = g0 - g1;

									// Threshold check.
									if(Math.abs(t) > 1e-6) {

										t = g0 / t;

										// Interpolate vertices and add up intersections (this can be done without multiplying).
										for(j = 0, k = 1; j < 3; ++j, k <<= 1) {

											a = e0 & k;
											b = e1 & k;

											if(a !== b) {

												v[j] += a ? 1.0 - t : t;

											} else {

												v[j] += a ? 1.0 : 0;

											}

										}

									}

								}

							}

							// Average the edge intersections and add them to coordinate.
							s = 1.0 / edgeCount;

							for(i = 0; i < 3; ++i) {

								v[i] = scale[i] * (x[i] + s * v[i]) + shift[i];

							}

							// Add vertex to vertices, store pointer to vertex in vertexIndices.
							vertexIndices[m] = vertexCounter / 3;
							vertices[vertexCounter++] = v[0];
							vertices[vertexCounter++] = v[1];
							vertices[vertexCounter++] = v[2];

							// Add faces together by looping over 3 basis components.
							for(i = 0; i < 3; ++i) {

								// The first three entries of the edgeMask count the crossings along the edge.
								if(edgeMask & (1 << i)) {

									// i = axes we are pointing along. iu, iv = orthogonal axes.
									iu = (i + 1) % 3;
									iv = (i + 2) % 3;

									// If we are on a boundary, skip.
									if(x[iu] !== 0 && x[iv] !== 0) {

										// Otherwise, look up adjacent edges in vertexIndices.
										du = R[iu];
										dv = R[iv];

										// Remember to flip orientation depending on the sign of the corner.
										if(mask & 1) {

											indices[indexCounter++] = vertexIndices[m];
											indices[indexCounter++] = vertexIndices[m - du];
											indices[indexCounter++] = vertexIndices[m - dv];

											indices[indexCounter++] = vertexIndices[m - dv];
											indices[indexCounter++] = vertexIndices[m - du];
											indices[indexCounter++] = vertexIndices[m - du - dv];

										} else {

											indices[indexCounter++] = vertexIndices[m];
											indices[indexCounter++] = vertexIndices[m - dv];
											indices[indexCounter++] = vertexIndices[m - du];

											indices[indexCounter++] = vertexIndices[m - du];
											indices[indexCounter++] = vertexIndices[m - dv];
											indices[indexCounter++] = vertexIndices[m - du - dv];

										}

									}

								}

							}

						}

					}

				}

			}

			if(indices.length !== indexCounter) { indices = indices.slice(0, indexCounter); }
			if(vertices.length !== vertexCounter) { vertices = vertices.slice(0, vertexCounter); }

			this.setIndex(new THREE.BufferAttribute(indices, 1));
			this.addAttribute("position", new THREE.BufferAttribute(vertices, 3));
			//this.addAttribute("uv", new THREE.BufferAttribute(uvs, 2));

		}

	}

	exports.LODGrid = LODGrid;
	exports.HeightfieldMaterial = HeightfieldMaterial;
	exports.SurfaceNet = SurfaceNet;

}));