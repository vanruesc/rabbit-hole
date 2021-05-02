import test from "ava";
import { Queue } from "../../dist/rabbit-hole.js";

test("can be instantiated", t => {

	const q = new Queue();

	t.pass();

});

test("can be cloned", t => {

	const q = new Queue();
	q.clone();

	t.pass();

});

test("can enqueue an item", t => {

	const q = new Queue();
	const item = {};

	q.add(item);

	t.is(q.size, 1, "should contain one item");

});

test("dequeues according to FIFO", t => {

	const q = new Queue();
	const item0 = {};
	const item1 = {};

	q.add(item0);
	q.add(item1);

	t.is(q.size, 2, "should have two remaining items");
	t.is(q.poll(), item0, "should retrieve the first item");
	t.is(q.size, 1, "should have one remaining item");
	t.is(q.poll(), item1, "should retrieve the second item");
	t.true(q.empty, "should be empty");
	t.is(q.poll(), undefined, "should return undefined");

});

test("can peek", t => {

	const q = new Queue();
	const item0 = {};
	const item1 = {};

	t.is(q.peek(), undefined, "should return undefined");

	q.add(item0);
	q.add(item1);

	t.is(q.peek(), item0, "should retrieve the first item");
	t.is(q.size, 2, "should not remove the item");

});

test("can be cleared", t => {

	const q = new Queue();
	const item0 = {};
	const item1 = {};

	q.add(item0);
	q.add(item1);
	q.clear();

	t.true(q.empty, "should be empty");
	t.is(q.poll(), undefined, "should return undefined");

});
