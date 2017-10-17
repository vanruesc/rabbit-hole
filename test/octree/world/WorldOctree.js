"use strict";

const lib = require("../../../build/rabbit-hole");
const WorldOctree = lib.WorldOctree;
const OperationType = lib.OperationType;
const Sphere = lib.Sphere;

const Vector3 = require("math-ds").Vector3;
const Raycaster = require("three").Raycaster;

module.exports = {

	"World Octree": {

		"can be instantiated": function(test) {

			const world = new WorldOctree();

			test.ok(world);
			test.done();

		},

		"can compute its dimensions": function(test) {

			const world = new WorldOctree();
			const dimensions = world.getDimensions();

			test.equal(dimensions.x, 41943040);
			test.equal(dimensions.y, 40960);
			test.equal(dimensions.z, 41943040);
			test.done();

		},

		"can apply CSG Union operations": function(test) {

			const world = new WorldOctree(20, 3);

			const sphere = new Sphere({
				origin: [10, 10, 10],
				radius: 1
			});

			world.applyCSG(sphere.setOperationType(OperationType.UNION));

			test.equal(world.getGrid(0).size, 1);
			test.equal(world.getGrid(1).size, 1);
			test.equal(world.getGrid(2).size, 1);
			test.equal(world.lodZero.values().next().value.csg.size, 1);
			test.done();

		},

		"can apply CSG Difference operations": function(test) {

			const world = new WorldOctree(20, 1);

			const sphere = new Sphere({
				origin: [10, 10, 10],
				radius: 1
			});

			world.applyCSG(sphere.setOperationType(OperationType.UNION));
			world.applyCSG(sphere.setOperationType(OperationType.DIFFERENCE));

			test.equal(world.lodZero.values().next().value.csg.size, 2);
			test.done();

		},

		"can apply CSG Intersection operations": function(test) {

			const world = new WorldOctree(20, 1);

			const sphere = new Sphere({
				origin: [10, 10, 10],
				radius: 1
			});

			world.applyCSG(sphere.setOperationType(OperationType.UNION));
			world.applyCSG(sphere.setOperationType(OperationType.INTERSECTION));

			test.equal(world.lodZero.values().next().value.csg.size, 2);
			test.done();

		},

		"can remove octants": function(test) {

			const world = new WorldOctree(20, 3);

			const sphere = new Sphere({
				origin: [10, 20, 10],
				radius: 1
			});

			const keyCoordinates = world.calculateKeyCoordinates(new Vector3(10, 20, 10), 1);

			world.applyCSG(sphere.setOperationType(OperationType.UNION));

			test.equal(world.getGrid(0).size, 2);
			test.equal(world.getGrid(1).size, 1);
			test.equal(world.getGrid(2).size, 1);

			world.removeOctant(world.getKeyDesign().packKey(keyCoordinates), 1);

			test.equal(world.getGrid(0).size, 0, "should discard orphans");
			test.equal(world.getGrid(1).size, 0, "should remove the octant in question");
			test.equal(world.getGrid(2).size, 0, "should prune empty parents");

			test.done();

		},

		"can raycast": function(test) {

			const world = new WorldOctree(20, 2);

			const sphere = new Sphere({
				origin: [0, 0, 0],
				radius: 10
			});

			const raycaster = new Raycaster();
			const intersects = [];

			world.applyCSG(sphere.setOperationType(OperationType.UNION));

			raycaster.ray.origin.set(1, 1, 1);
			raycaster.ray.direction.set(1, 1, 1).normalize();

			world.raycast(raycaster, intersects);

			test.equal(intersects.length, 0);
			test.done();

		}

	}

};
