"use strict";

const Queue = require("../../build/rabbit-hole").Queue;

module.exports = {

	"Queue": {

		"can be instantiated": function(test) {

			const q = new Queue();

			test.ok(q);
			test.done();

		},

		"can enqueue an item": function(test) {

			const q = new Queue();
			const item = {};

			q.add(item);

			test.equal(q.size, 1, "should contain one item");
			test.done();

		},

		"dequeues according to FIFO": function(test) {

			const q = new Queue();
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

			const q = new Queue();
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

			const q = new Queue();
			const item0 = {};
			const item1 = {};

			q.add(item0);
			q.add(item1);
			q.clear();

			test.equal(q.size, 0, "should be empty");
			test.equal(q.poll(), null, "should return null");
			test.done();

		}

	}

};
