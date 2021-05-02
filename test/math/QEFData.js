import test from "ava";
import { Vector3 } from "three";
import { QEFData } from "../../dist/rabbit-hole.js";

test("can be instantiated", t => {

	const object = new QEFData();

	t.pass();

});

test("can add data", t => {

	const qefData = new QEFData();

	const p = new Vector3(0, 0.5, -0.5);
	const n = new Vector3(1, 0, 0);

	qefData.add(p, n);

	t.pass();

});
