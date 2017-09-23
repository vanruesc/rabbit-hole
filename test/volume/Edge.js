"use strict";

const lib = require("../../build/rabbit-hole");
const Edge = lib.Edge;
const Sphere = lib.Sphere;

function almostEqual(a, b) {

	return (Math.abs(a - b) < 1e-2);

}

module.exports = {

	"Edge": {

		"can approximate the Zero Crossing": function(test) {

			const edge = new Edge();

			const sdf = new Sphere({
				origin: [0, 0, 0],
				radius: 2
			});

			edge.a.set(1, 0, 0);
			edge.b.set(2, 0, 0);

			edge.approximateZeroCrossing(sdf);

			test.ok(almostEqual(edge.t, 1.0), "should compute a correct interpolation value");
			test.done();

		}

	}

};
