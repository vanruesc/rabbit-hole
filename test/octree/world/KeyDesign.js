import test from "ava";
import { Vector3 } from "math-ds";
import { KeyDesign } from "../../../build/rabbit-hole.js";

test("can be instantiated", t => {

	const object = new KeyDesign();

	t.truthy(object);

});

test("can pack and unpack keys", t => {

	const keyDesign = new KeyDesign(21, 11, 21);

	const position = new Vector3(11, 22, 33);
	const key = keyDesign.packKey(position);

	t.is(key, 141780058123, "should be able to generate a correct key");
	t.true(position.equals(keyDesign.unpackKey(key)), "should be able to correctly unpack a key");

});

test("can iterate over a 3D key range", t => {

	const keyDesign = new KeyDesign(21, 11, 21);

	const min = new Vector3(0, 0, 0);
	const max = new Vector3(1, 1, 1);
	const iterator = keyDesign.keyRange(min, max);

	let i = 0;

	while(!iterator.next().done) {

		++i;

	}

	t.is(i, 8, "should return eight keys");

});
