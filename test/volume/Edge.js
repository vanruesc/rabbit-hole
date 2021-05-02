import test from "ava";
import { Edge, SuperPrimitive, SuperPrimitivePreset } from "../../dist/rabbit-hole.js";

function almostEqual(a, b) {

	return (Math.abs(a - b) < 1e-2);

}

test("can be instantiated", t => {

	const object = new Edge();

	t.pass();

});

test("can approximate the Zero Crossing", t => {

	const edge = new Edge();

	const sphere = SuperPrimitive.create(SuperPrimitivePreset.SPHERE);

	edge.a.set(0, 0, 0);
	edge.b.set(1, 0, 0);

	edge.approximateZeroCrossing(sphere);

	t.true(almostEqual(edge.t, 1.0), "should compute a correct interpolation value");

});
