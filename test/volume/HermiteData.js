import test from "ava";
import { HermiteData } from "../../dist/rabbit-hole.js";

// Set the global resolution.
HermiteData.resolution = 1;

test("can be instantiated", t => {

	const object = new HermiteData();

	t.pass();

});

test("can be compressed and decompressed", t => {

	const data = new HermiteData();

	const materialIndices = data.materialIndices;

	t.is(data.materialIndices.length, 8, "should allocate space for 8 material indices");

	materialIndices[0] = 0; materialIndices[1] = 0;
	materialIndices[2] = 0; materialIndices[3] = 0;
	materialIndices[4] = 1; materialIndices[5] = 1;
	materialIndices[6] = 0; materialIndices[7] = 0;

	data.compress();

	t.is(data.materialIndices.length, 3, "should compress material indices to 3 elements");

	data.decompress();

	t.is(data.materialIndices.length, 8, "should decompress material indices back to 8 elements");

	t.true((function() {

		let equal = true;

		data.materialIndices.forEach(function(element, index, array) {

			equal = equal && (array[index] === materialIndices[index]);

		});

		return equal;

	}()), "should restore the original data");

});
