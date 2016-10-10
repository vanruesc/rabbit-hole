"use strict";

const lib = require("../build/rabbit-hole");

module.exports = {

	"Queue": {

		"can be instantiated": function(test) {

			const q = new lib.Queue();

			test.ok(q);
			test.done();

		},

		"can enqueue an item": function(test) {

			const q = new lib.Queue();
			const item = {};

			q.add(item);

			test.equal(q.size, 1, "should contain one item");
			test.done();

		},

		"dequeues according to FIFO": function(test) {

			const q = new lib.Queue();
			const item0 = {};
			const item1 = {};

			q.add(item0);
			q.add(item1);

			test.equal(q.size, 2, "should have two remaining items");
			test.equal(q.poll(), item0, "should retrieve the first item");
			test.equal(q.size, 1, "should have one remaining item");
			test.equal(q.poll(), item1, "should retrieve the second item");
			test.equal(q.size, 0, "should be empty");
			test.equal(q.poll(), null, "should return null");
			test.done();

		},

		"can peek": function(test) {

			const q = new lib.Queue();
			const item0 = {};
			const item1 = {};

			test.equal(q.peek(), null, "should return null");

			q.add(item0);
			q.add(item1);

			test.equal(q.peek(), item0, "should retrieve the first item");
			test.equal(q.size, 2, "should not remove the item");
			test.done();

		},

		"can be cleared": function(test) {

			const q = new lib.Queue();
			const item0 = {};
			const item1 = {};

			q.add(item0);
			q.add(item1);
			q.clear();

			test.equal(q.size, 0, "should be empty");
			test.equal(q.poll(), null, "should return null");
			test.done();

		}

	},

	"Priority Queue": {

		"can be instantiated": function(test) {

			const q = new lib.PriorityQueue();

			test.ok(q);
			test.done();

		},

		"can enqueue an item": function(test) {

			const q = new lib.PriorityQueue(2);
			const item = {};

			q.add(item, 1);

			test.equal(q.size, 1, "should contain one item");
			test.done();

		},

		"dequeues according to FIFO and respects priorities": function(test) {

			const q = new lib.PriorityQueue(2);
			const item0 = {};
			const item1 = {};
			const item2 = {};

			q.add(item0, 0);
			q.add(item1, 1);
			q.add(item2, 1);

			test.equal(q.size, 3, "should have three remaining items");
			test.equal(q.poll(), item1, "should retrieve the first item from the higher tier");
			test.equal(q.size, 2, "should have two remaining items");
			test.equal(q.poll(), item2, "should retrieve the second item from the higher tier");
			test.equal(q.size, 1, "should have one remaining item");
			test.equal(q.poll(), item0, "should retrieve the item from the lower tier");
			test.equal(q.size, 0, "should be empty");
			test.equal(q.poll(), null, "should return null");
			test.done();

		},

		"can peek": function(test) {

			const q = new lib.PriorityQueue(2);
			const item0 = {};
			const item1 = {};
			const item2 = {};

			test.equal(q.peek(), null, "should return null");

			q.add(item0, 0);
			q.add(item1, 1);
			q.add(item2, 1);

			test.equal(q.peek(), item1, "should retrieve the first item");
			test.equal(q.size, 3, "should not remove the item");
			test.done();

		},

		"can be cleared": function(test) {

			const q = new lib.PriorityQueue(2);
			const item0 = {};
			const item1 = {};

			q.add(item0, 0);
			q.add(item1, 1);
			q.clear();

			test.equal(q.size, 0, "should be empty");
			test.equal(q.poll(), null, "should return null");
			test.done();

		}

	}

};
