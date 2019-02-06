import test from "ava";
import { Vector3 } from "math-ds";
import { QEFData, QEFSolver } from "../../build/rabbit-hole.umd.js";

test("can be instantiated", t => {

	const object = new QEFSolver();

	t.truthy(object);

});

test("correctly solves least squares systems", t => {

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

	t.is(error.toFixed(2), "0.00", "incorrect error");
	t.true(solution.equals(expected), "least squares result mismatch");

});
