"use strict";

const lib = require("../../build/rabbit-hole");
const Edge = lib.Edge;
const SuperPrimitive = lib.SuperPrimitive;
const SuperPrimitivePreset = lib.SuperPrimitivePreset;

function almostEqual(a, b) {

	return (Math.abs(a - b) < 1e-2);

}

module.exports = {

	"Edge": {

		"can approximate the Zero Crossing": function(test) {

			const edge = new Edge();

			const sphere = SuperPrimitive.create(SuperPrimitivePreset.SPHERE);

			edge.a.set(0, 0, 0);
			edge.b.set(1, 0, 0);

			edge.approximateZeroCrossing(sphere);

			test.ok(almostEqual(edge.t, 1.0), "should compute a correct interpolation value");
			test.done();

		}

	}

};
