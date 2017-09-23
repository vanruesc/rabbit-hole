"use strict";

const KeyDesign = require("../../build/rabbit-hole").KeyDesign;
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

			test.ok(key >= 0, "should be able to generate a key");
			test.ok(position.equals(keyDesign.unpackKey(key)), "should be able to correctly unpack a key");
			test.done();

		}

	}

};
