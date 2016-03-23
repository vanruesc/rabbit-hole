"use strict";

const LIBRARY = require("../build/rabbit-hole");

module.exports = {

	"Height Field": {

		"can be instantiated": function(test) {

			let heightfield = new LIBRARY.HeightField();
			test.ok(heightfield, "height field");
			test.done();

		}

	},

	"Isosurfaces": {

		"can be instantiated": function(test) {

			let isosurface = new LIBRARY.SurfaceNet();
			test.ok(isosurface, "surface net");
			test.done();

		}

	}

};
