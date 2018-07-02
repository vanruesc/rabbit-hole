import test from "ava";
import { Vector3 } from "math-ds";
import { Raycaster } from "three";
import {
	OperationType,
	SuperPrimitive,
	SuperPrimitivePreset,
	WorldOctree
} from "../../../build/rabbit-hole.js";

test("can be instantiated", t => {

	const object = new WorldOctree();

	t.truthy(object);

});

test("can compute its dimensions", t => {

	const world = new WorldOctree();
	const dimensions = world.getDimensions();

	t.is(dimensions.x, 41943040);
	t.is(dimensions.y, 40960);
	t.is(dimensions.z, 41943040);

});

test("can apply CSG Union operations", t => {

	const world = new WorldOctree(20, 3);

	const sphere = SuperPrimitive.create(SuperPrimitivePreset.SPHERE);
	sphere.position.set(10, 10, 10);
	sphere.updateInverseTransformation();

	world.applyCSG(sphere.setOperationType(OperationType.UNION));

	t.is(world.getGrid(0).size, 1);
	t.is(world.getGrid(1).size, 1);
	t.is(world.getGrid(2).size, 1);
	t.is(world.lodZero.values().next().value.csg.size, 1);

});

test("can apply CSG Difference operations", t => {

	const world = new WorldOctree(20, 1);

	const sphere = SuperPrimitive.create(SuperPrimitivePreset.SPHERE);
	sphere.position.set(10, 10, 10);
	sphere.updateInverseTransformation();

	world.applyCSG(sphere.setOperationType(OperationType.UNION));
	world.applyCSG(sphere.setOperationType(OperationType.DIFFERENCE));

	t.is(world.lodZero.values().next().value.csg.size, 2);

});

test("can apply CSG Intersection operations", t => {

	const world = new WorldOctree(20, 1);

	const sphere = SuperPrimitive.create(SuperPrimitivePreset.SPHERE);
	sphere.position.set(10, 10, 10);
	sphere.updateInverseTransformation();

	world.applyCSG(sphere.setOperationType(OperationType.UNION));
	world.applyCSG(sphere.setOperationType(OperationType.INTERSECTION));

	t.is(world.lodZero.values().next().value.csg.size, 2);

});

test("can remove octants", t => {

	const world = new WorldOctree(20, 3);

	const sphere = SuperPrimitive.create(SuperPrimitivePreset.SPHERE);
	sphere.position.set(10, 20, 10);
	sphere.updateInverseTransformation();

	const keyCoordinates = world.calculateKeyCoordinates(new Vector3(10, 20, 10), 1);

	world.applyCSG(sphere.setOperationType(OperationType.UNION));

	t.is(world.getGrid(0).size, 2);
	t.is(world.getGrid(1).size, 1);
	t.is(world.getGrid(2).size, 1);

	world.removeOctant(world.getKeyDesign().packKey(keyCoordinates), 1);

	t.is(world.getGrid(0).size, 0, "should discard orphans");
	t.is(world.getGrid(1).size, 0, "should remove the octant in question");
	t.is(world.getGrid(2).size, 0, "should prune empty parents");

});

test("can raycast", t => {

	const world = new WorldOctree(20, 2);

	const sphere = SuperPrimitive.create(SuperPrimitivePreset.SPHERE);

	const raycaster = new Raycaster();
	const intersects = [];

	world.applyCSG(sphere.setOperationType(OperationType.UNION));

	raycaster.ray.origin.set(1, 1, 1);
	raycaster.ray.direction.set(1, 1, 1).normalize();

	world.raycast(raycaster.ray, intersects);

	t.is(world.lodZero.size, 8, "should have eight octants in LOD zero");
	t.is(intersects.length, 1);

});
