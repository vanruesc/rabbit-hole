"use strict";

const lib = require("../build/rabbit-hole");
const THREE = require("three");

module.exports = {

	"Key Design": {

		"can be instantiated": function(test) {

			const keyDesign = new lib.KeyDesign();

			test.ok(keyDesign);
			test.done();

		},

		"can pack and unpack keys": function(test) {

			const keyDesign = new lib.KeyDesign(21, 11, 21);

			const position = new THREE.Vector3(11, 22, 33);
			const key = keyDesign.packKey(position);

			test.ok(key >= 0, "should be able to generate a key");
			test.ok(position.equals(keyDesign.unpackKey(key)), "should be able to correctly unpack a key");
			test.done();

		}

	}

};
