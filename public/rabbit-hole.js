/**
 * rabbit-hole v0.0.0 build Mar 23 2016
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2016 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(factory((global.RABBITHOLE = global.RABBITHOLE || {}),global.THREE));
}(this, function (exports,THREE) { 'use strict';

	THREE = 'default' in THREE ? THREE['default'] : THREE;

	let shader = {
		fragment: "#ifdef USE_FOG\r\n\r\n\t#define LOG2 1.442695\r\n\t#define whiteCompliment(a) (1.0 - saturate(a))\r\n\r\n\tuniform vec3 fogColor;\r\n\r\n\t#ifdef FOG_EXP2\r\n\r\n\t\tuniform float fogDensity;\r\n\r\n\t#else\r\n\r\n\t\tuniform float fogNear;\r\n\t\tuniform float fogFar;\r\n\r\n\t#endif\r\n\r\n#endif\r\n\r\n#ifdef USE_LOGDEPTHBUF\r\n\r\n\tuniform float logDepthBufFC;\r\n\r\n\t#ifdef USE_LOGDEPTHBUF_EXT\r\n\r\n\t\tvarying float vFragDepth;\r\n\r\n\t#endif\r\n\r\n#endif\r\n\r\nuniform sampler2D tHeight;\r\n\r\nuniform float worldSize;\r\n\r\nvarying vec3 vNormal;\r\nvarying vec3 vPosition;\r\nvarying float vMorphFactor;\r\nvarying vec2 vUvs[3];\r\n\r\nfloat getHeight() {\r\n\r\n\t// Sample multiple times to get more detail.\r\n\tfloat h = worldSize * texture2D(tHeight, vUvs[0]).r;\r\n\th += 64.0 * texture2D(tHeight, vUvs[1]).r;\r\n\th += 4.0 * texture2D(tHeight, vUvs[2]).r;\r\n\r\n\t// Square the height, leads to more rocky looking terrain.\r\n\treturn h * h / 2000.0;\r\n\r\n}\r\n\r\nvec3 getNormal() {\r\n\r\n\t/* Differentiate the position vector (this will give us two vectors perpendicular to the surface)\r\n\t * Before differentiating, add the displacement based on the height from the height map. By doing this\r\n\t * calculation here, rather than in the vertex shader, we get a per-fragment calculated normal, rather\r\n\t * than a per-vertex normal. This improves the look of distant low-vertex terrain.\r\n\t */\r\n\r\n\tfloat height = getHeight();\r\n\tvec3 p = vec3(vPosition.xy, height);\r\n\tvec3 dPositiondx = dFdx(p);\r\n\tvec3 dPositiondy = dFdy(p);\r\n\r\n\t// The normal is the cross product of the differentials.\r\n\treturn normalize(cross(dPositiondx, dPositiondy));\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\t// Base color\r\n\tvec3 light = vec3(80.0, 150.0, 50.0);\r\n\t//vec3 color = colorForScale();\r\n\tvec3 color = vec3(0.27, 0.27, 0.17);\r\n\t//color = vec3(vMorphFactor);\r\n\r\n\tvec3 normal = getNormal();\r\n\r\n\t// Incident light.\r\n\tfloat incidence = dot(normalize(light - vPosition), normal);\r\n\tincidence = clamp(incidence, 0.0, 1.0);\r\n\tincidence = pow(incidence, 0.02);\r\n\tcolor = mix(vec3(0, 0, 0), color, incidence);\r\n\r\n\t// Mix in specular light.\r\n\tvec3 halfVector = normalize(normalize(cameraPosition - vPosition) + normalize(light - vPosition));\r\n\tfloat specular = dot(normal, halfVector);\r\n\tspecular = max(0.0, specular);\r\n\tspecular = pow(specular, 25.0);\r\n\tcolor = mix(color, vec3(0, 1.0, 1.0), 0.5 * specular);\r\n\r\n\t// Add more specular light for fun.\r\n\tvec3 light2 = vec3(420.0, 510.0, 30.0);\r\n\thalfVector = normalize(normalize(cameraPosition - vPosition) + normalize(light2 - vPosition));\r\n\tspecular = dot(normal, halfVector);\r\n\tspecular = max(0.0, specular);\r\n\tspecular = pow(specular, 3.0);\r\n\tcolor = mix(color, vec3(1.0, 0.3, 0), 0.5 * specular);\r\n\r\n\tvec3 light3 = vec3(0.0, 0.0, 1000.0);\r\n\thalfVector = normalize(normalize(cameraPosition - vPosition) + normalize(light3 - vPosition));\r\n\tspecular = dot(normal, halfVector);\r\n\tspecular = max(0.0, specular);\r\n\tspecular = pow(specular, 130.0);\r\n\tcolor = mix(color, vec3(1.0, 0.5, 0), specular);\r\n\r\n\t// Add height fog.\r\n\tfloat heightFogFactor = clamp(1.0 - vPosition.z / 25.0, 0.0, 1.0);\r\n\theightFogFactor = pow(heightFogFactor, 5.4);\r\n\tcolor = mix(color, vec3(1.0, 0.9, 0.8), heightFogFactor);\r\n\r\n\t#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\r\n\r\n\t\tgl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\r\n\r\n\t#endif\r\n\r\n\t#ifdef USE_FOG\r\n\r\n\t\t#ifdef USE_LOGDEPTHBUF_EXT\r\n\r\n\t\t\tfloat depth = gl_FragDepthEXT / gl_FragCoord.w;\r\n\r\n\t\t#else\r\n\r\n\t\t\tfloat depth = gl_FragCoord.z / gl_FragCoord.w;\r\n\r\n\t\t#endif\r\n\r\n\t\t#ifdef FOG_EXP2\r\n\r\n\t\t\tfloat fogFactor = whiteCompliment(exp2(-fogDensity * fogDensity * depth * depth * LOG2));\r\n\r\n\t\t#else\r\n\r\n\t\t\tfloat fogFactor = smoothstep(fogNear, fogFar, depth);\r\n\r\n\t\t#endif\r\n\r\n\t\tcolor = mix(color, fogColor, fogFactor);\r\n\r\n\t#endif\r\n\r\n\tgl_FragColor = vec4(color, 1.0);\r\n\r\n}\r\n",
		vertex: "#define EPSILON 1e-6\r\n\r\n#ifdef USE_LOGDEPTHBUF\r\n\r\n\tuniform float logDepthBufFC;\r\n\r\n\t#ifdef USE_LOGDEPTHBUF_EXT\r\n\r\n\t\tvarying float vFragDepth;\r\n\r\n\t#endif\r\n\r\n#endif\r\n\r\nuniform sampler2D tHeight;\r\n\r\nuniform vec3 globalOffset;\r\nuniform vec2 tileOffset;\r\n\r\nuniform float worldSize;\r\nuniform float scale;\r\nuniform int edgeMorph;\r\n\r\nvarying vec3 vNormal;\r\nvarying vec3 vPosition;\r\nvarying float vMorphFactor;\r\nvarying vec2 vUvs[3];\r\n\r\nconst int EGDE_MORPH_TOP = 1;\r\nconst int EGDE_MORPH_LEFT = 2;\r\nconst int EGDE_MORPH_BOTTOM = 4;\r\nconst int EGDE_MORPH_RIGHT = 8;\r\n\r\nconst float MORPH_REGION = 0.3;\r\nconst float MORPH_REGION_INV = 0.7;\r\n\r\nfloat getHeight(vec3 p) {\r\n\r\n\tfloat lod = 0.0;//log2(scale) - 6.0;\r\n\tvec2 st = p.xy / worldSize;\r\n\r\n\t// Sample multiple times to get more detail.\r\n\tfloat h = worldSize * texture2DLod(tHeight, st, lod).r;\r\n\t// todo: Adjust to worldsize.\r\n\th += 64.0 * texture2DLod(tHeight, 16.0 * st, lod).r;\r\n\th += 4.0 * texture2DLod(tHeight, 256.0 * st, lod).r;\r\n\r\n\t// Square the height, leads to more rocky looking terrain.\r\n\treturn h * h / 2000.0;\r\n\t//return h / 10.0;\r\n\r\n}\r\n\r\nvec3 getNormal(float h) {\r\n\r\n\t// Build 2 vectors that are perpendicular to the surface normal.\r\n\t//float delta = 1024.0 / 4.0;\r\n\tfloat delta = (vMorphFactor + 1.0) * scale / RESOLUTION;\r\n\tvec3 dA = delta * normalize(cross(normal.yzx, normal));\r\n\tvec3 dB = delta * normalize(cross(dA, normal));\r\n\tvec3 p = vPosition;\r\n\tvec3 pA = vPosition + dA;\r\n\tvec3 pB = vPosition + dB;\r\n\r\n\t// Get the height at those points.\r\n\tfloat hA = getHeight(pA);\r\n\tfloat hB = getHeight(pB);\r\n\r\n\t// Update the points with the new height and calculate the normal.\r\n\tp += normal * h;\r\n\tpA += normal * hA;\r\n\tpB += normal * hB;\r\n\r\n\treturn normalize(cross(pB - p, pA - p));\r\n\r\n}\r\n\r\n/**\r\n * Poor man's bitwise &.\r\n */\r\n\r\nbool edgePresent(int edge) {\r\n\r\n\tint e = edgeMorph / edge;\r\n\r\n\treturn (2 * (e / 2) != e);\r\n\r\n}\r\n\r\n/**\r\n * At the edges of tiles morph the vertices if they are joining onto a higher layer.\r\n */\r\n\r\nfloat calculateMorph(vec3 p) {\r\n\r\n\tfloat morphFactor = 0.0;\r\n\r\n\tif(edgePresent(EGDE_MORPH_TOP) && p.y >= MORPH_REGION_INV) {\r\n\r\n\t\tfloat m = 1.0 - clamp((1.0 - p.y) / MORPH_REGION, 0.0, 1.0);\r\n\t\tmorphFactor = max(m, morphFactor);\r\n\r\n\t}\r\n\r\n\tif(edgePresent(EGDE_MORPH_LEFT) && p.x <= MORPH_REGION) {\r\n\r\n\t\tfloat m = 1.0 - clamp(p.x / MORPH_REGION, 0.0, 1.0);\r\n\t\tmorphFactor = max(m, morphFactor);\r\n\r\n\t}\r\n\r\n\tif(edgePresent(EGDE_MORPH_BOTTOM) && p.y <= MORPH_REGION) {\r\n\r\n\t\tfloat m = 1.0 - clamp(p.y / MORPH_REGION, 0.0, 1.0);\r\n\t\tmorphFactor = max(m, morphFactor);\r\n\r\n\t}\r\n\r\n\tif(edgePresent(EGDE_MORPH_RIGHT) && p.x >= MORPH_REGION_INV) {\r\n\r\n\t\tfloat m = 1.0 - clamp((1.0 - p.x) / MORPH_REGION, 0.0, 1.0);\r\n\t\tmorphFactor = max(m, morphFactor);\r\n\r\n\t}\r\n\r\n\treturn morphFactor;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\t/* Morph factor indicates the proximity to the next level.\r\n\t *\r\n\t *  0.0 = this level.\r\n\t *  1.0 = next level.\r\n\t */\r\n\r\n\tvMorphFactor = calculateMorph(position);\r\n\r\n\t// Move into correct place.\r\n\tvPosition = scale * position + vec3(tileOffset, 0.0) + globalOffset;\r\n\r\n\t// Snap to grid.\r\n\tfloat grid = scale / RESOLUTION;\r\n\tvPosition = floor(vPosition / grid) * grid;\r\n\r\n\t// Morph between zoom layers.\r\n\tif(vMorphFactor > 0.0) {\r\n\r\n\t\t// Get position that we would have if we were on higher level grid.\r\n\t\tgrid *= 2.0;\r\n\t\tvec3 position2 = floor(vPosition / grid) * grid;\r\n\r\n\t\t// Linearly interpolate the two, depending on morph factor.\r\n\t\tvPosition = mix(vPosition, position2, vMorphFactor);\r\n\r\n\t}\r\n\r\n\t// Get height and calculate normal.\r\n\tfloat height = getHeight(vPosition);\r\n\tvPosition += normal * height;\r\n\t//vNormal = getNormal(height);\r\n\r\n\t// Allow pre-fetching of texels.\r\n\tvUvs[0] = vPosition.xy / worldSize;\r\n\tvUvs[1] = 16.0 * vUvs[0];\r\n\tvUvs[2] = 256.0 * vUvs[0];\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);\r\n\r\n\t#ifdef USE_LOGDEPTHBUF\r\n\r\n\t\tgl_Position.z = log2(max(EPSILON, gl_Position.w + 1.0)) * logDepthBufFC;\r\n\r\n\t\t#ifdef USE_LOGDEPTHBUF_EXT\r\n\r\n\t\t\tvFragDepth = 1.0 + gl_Position.w;\r\n\r\n\t\t#else\r\n\r\n\t\t\tgl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\r\n\r\n\t\t#endif\r\n\r\n\t#endif\r\n\r\n}\r\n"
	};

	/**
	 * A heightmap shader material for LOD terrain rendering.
	 *
	 * @class HeightFieldMaterial
	 * @constructor
	 * @extends ShaderMaterial
	 */

	class HeightFieldMaterial extends THREE.ShaderMaterial {

		constructor(resolution) {

			super({

				defines: {

					RESOLUTION: (resolution !== undefined) ? resolution.toFixed(1) : "128.0"

				},

				uniforms: {

					tDiffuse: {type: "t", value: null},
					tHeight: {type: "t", value: null},

					globalOffset: {type: "v3", value: null},
					tileOffset: {type: "v2", value: new THREE.Vector2()},

					worldSize: {type: "f", value: 1024.0},
					scale: {type: "f", value: 1.0},
					edgeMorph: {type: "i", value: 1}

				},

				fragmentShader: shader.fragment,
				vertexShader: shader.vertex,

				extensions: {
					derivatives: true
				}

			});

		}

	}

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

	class HeightField extends THREE.Object3D {

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

	exports.HeightField = HeightField;
	exports.HeightFieldMaterial = HeightFieldMaterial;
	exports.SurfaceNet = SurfaceNet;

}));