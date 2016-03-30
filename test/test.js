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

			let grid = new LIBRARY.LODGrid(1, 6, 2, 4);
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
