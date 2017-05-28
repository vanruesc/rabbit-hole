"use strict";

const lib = require("../build/rabbit-hole");
const THREE = require("three");

module.exports = {

	"Quadratic Error Function": {

		"correctly solves least squares systems": function(test) {

			const qefData = new lib.QEFData();
			const qefSolver = new lib.QEFSolver();

			const expected = new THREE.Vector3(-6, 5, 4);

			const p0 = new THREE.Vector3(4, 5, 10);
			const n0 = new THREE.Vector3(0, 1, 0);

			const p1 = new THREE.Vector3(-6, -3, 1);
			const n1 = new THREE.Vector3(1, 0, 0);

			const p2 = new THREE.Vector3(2, -8, 4);
			const n2 = new THREE.Vector3(0, 0, 1);

			qefData.add(p0, n0);
			qefData.add(p1, n1);
			qefData.add(p2, n2);

			const solution = qefSolver.setData(qefData).solve();

			test.ok(solution.equals(expected), "least squares");
			test.done();

		}

	}

};
