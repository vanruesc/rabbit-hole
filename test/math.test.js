"use strict";

const lib = require("../build/rabbit-hole");
const THREE = require("three");

module.exports = {

	"Symmetric Matrix": {

		"can be instantiated": function(test) {

			const smatrix = new lib.SymmetricMatrix3();

			test.ok(smatrix, "symmetric matrix");
			test.done();

		},

		"correctly transforms vectors": function(test) {

			const m0 = new lib.SymmetricMatrix3();
			const m1 = new THREE.Matrix3();

			const v0 = new THREE.Vector3(0, 1, 2);
			const v1 = v0.clone();
			const v2 = v0.clone();
			const v3 = v0.clone();

			m0.identity();
			m1.identity();

			m0.applyToVector3(v0);
			v1.applyMatrix3(m1);

			m0.set(

				1, 2, 3,
				2, 3,
				3

			);

			m1.set(

				1, 2, 3,
				2, 2, 3,
				3, 3, 3

			);

			m0.applyToVector3(v2);
			v3.applyMatrix3(m1);

			test.ok(v0.equals(v1), "should compute the same result as its complete matrix equivalent");
			test.ok(v2.equals(v3), "should compute the same result as its complete matrix equivalent");
			test.done();

		}

	}

};
