"use strict";

const HermiteData = require("../../build/rabbit-hole").HermiteData;

// Set the global resolution.
HermiteData.resolution = 1;

module.exports = {

	"Hermite Data": {

		"can be instantiated": function(test) {

			const data = new HermiteData();

			test.ok(data);
			test.done();

		},

		"can be compressed and decompressed": function(test) {

			const data = new HermiteData();

			const materialIndices = data.materialIndices;

			test.equal(data.materialIndices.length, 8, "should allocate space for 8 material indices");

			materialIndices[0] = 0; materialIndices[1] = 0;
			materialIndices[2] = 0; materialIndices[3] = 0;
			materialIndices[4] = 1; materialIndices[5] = 1;
			materialIndices[6] = 0; materialIndices[7] = 0;

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
