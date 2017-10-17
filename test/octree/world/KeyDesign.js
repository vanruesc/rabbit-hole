"use strict";

const KeyDesign = require("../../../build/rabbit-hole").KeyDesign;
const Vector3 = require("math-ds").Vector3;

module.exports = {

	"Key Design": {

		"can be instantiated": function(test) {

			const keyDesign = new KeyDesign();

			test.ok(keyDesign);
			test.done();

		},

		"can pack and unpack keys": function(test) {

			const keyDesign = new KeyDesign(21, 11, 21);

			const position = new Vector3(11, 22, 33);
			const key = keyDesign.packKey(position);

			test.equal(key, 141780058123, "should be able to generate a correct key");
			test.ok(position.equals(keyDesign.unpackKey(key)), "should be able to correctly unpack a key");
			test.done();

		},

		"can iterate over a 3D key range": function(test) {

			const keyDesign = new KeyDesign(21, 11, 21);

			const min = new Vector3(0, 0, 0);
			const max = new Vector3(1, 1, 1);
			const iterator = keyDesign.keyRange(min, max);

			let i = 0;

			while(!iterator.next().done) {

				++i;

			}

			test.equal(i, 8, "should return eight keys");
			test.done();

		}

	}

};
