"use strict";

const lib = require("../../build/rabbit-hole");
const QEFData = lib.QEFData;
const QEFSolver = lib.QEFSolver;

const Vector3 = require("math-ds").Vector3;

module.exports = {

	"Quadratic Error Function": {

		"correctly solves least squares systems": function(test) {

			const qefData = new QEFData();
			const qefSolver = new QEFSolver();

			const expected = new Vector3(0, 0, 0);

			const p0 = new Vector3(0, 0.5, -0.5);
			const n0 = new Vector3(1, 0, 0);

			const p1 = new Vector3(-0.5, 0, -0.5);
			const n1 = new Vector3(0, 1, 0);

			const p2 = new Vector3(-0.5, 0.5, 0);
			const n2 = new Vector3(0, 0, 1);

			qefData.add(p0, n0);
			qefData.add(p1, n1);
			qefData.add(p2, n2);

			const solution = new Vector3();
			const error = qefSolver.setData(qefData).solve(solution);

			test.equal(error.toFixed(4), "0.3333", "incorrect error");
			test.ok(solution.equals(expected), "least squares result mismatch");
			test.done();

		}

	}

};
