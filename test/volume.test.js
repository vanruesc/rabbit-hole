"use strict";

const lib = require("../build/rabbit-hole");

module.exports = {

	"Hermite Data": {

		"allows resolution to be set once": function(test) {

			lib.HermiteData.resolution = 1;
			lib.HermiteData.resolution = 2;

			test.equal(lib.HermiteData.resolution, 1, "data resolution should not change again");
			test.done();

		},

		"can be instantiated": function(test) {

			const data = new lib.HermiteData();

			test.ok(data);
			test.done();

		},

		"can be compressed and decompressed": function(test) {

			const data = new lib.HermiteData();

			const materialIndices = data.materialIndices;

			materialIndices[0] = 0; materialIndices[1] = 0;
			materialIndices[2] = 0; materialIndices[3] = 0;
			materialIndices[4] = 1; materialIndices[5] = 1;
			materialIndices[6] = 0; materialIndices[7] = 0;

			test.equal(data.materialIndices.length, 8, "should allocate space for 8 material indices");

			data.compress();

			test.equal(data.materialIndices.length, 3, "should compress material indices to 3 elements");

			data.decompress();

			test.equal(data.materialIndices.length, 8, "should decompress material indices back to 8 elements");

			test.ok((function() {

				let equal = true;

				data.materialIndices.forEach(function(element, index, array) {

					equal = equal && (array[index] === materialIndices[index]);

				});

				return equal;

			}()), "should restore the original data");

			test.done();

		}

	}

};
