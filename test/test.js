"use strict";

const LIBRARY = require("../build/rabbit-hole");

module.exports = {

	"Materials": {

		"can be instantiated": function(test) {

			let material = new LIBRARY.HeightfieldMaterial();
			test.ok(material, "LOD material");

			test.done();

		}

	},

	"LOD Grid": {

		"can be instantiated": function(test) {

			let grid = new LIBRARY.LODGrid({
				heightMap: {image: {}},
				map: null,
				normalMap: null,
				baseScale: 1,
				levels: 4,
				resolution: 4,
				morphingLevels: 2,
				heightScale: 30
			});

			test.ok(grid, "LOD grid");

			test.done();

		}

	}/*,

	"Isosurfaces": {

		"can be instantiated": function(test) {

			let isosurface = new LIBRARY.SurfaceNet();
			test.ok(isosurface, "surface net");

			test.done();

		}

	}*/

};
