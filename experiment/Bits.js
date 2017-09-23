"use strict";

const lib = require("../../build/rabbit-hole");
const createBinaryString = lib.BinaryUtils.createBinaryString;

// Bit Allotment.
const bits = 53;
const hiBits = 21;
const loBits = 32;

module.exports = {

	"Bit Experiments": {

		"concatenating 32bit integers": function(test) {

			const hi = 0b00000000000111111111111111111111;
			const lo = 0b11111111111111111111111111111111;

			const i = (hi * Math.pow(2, 32)) + lo;

			console.log(createBinaryString(i), i, "(i53, left-padded to 64)");

			test.equal(hi, Math.pow(2, hiBits) - 1);
			test.equal(lo, Math.pow(2, loBits) - 1);
			test.equal(i, Math.pow(2, bits) - 1);

			test.done();

		},

		"extracting specific bits from a 53bit integer": function(test) {

			const i = 0b0000000000011111111111111111111111111111111111111111111111111111;

			const hi = Math.trunc(i / Math.pow(2, 32));
			const lo = i % Math.pow(2, 32);

			const xBits = 21;
			const yBits = 11;
			const zBits = 21;

			const hiShiftX = 32 - Math.max(0, xBits - loBits);
			const hiMaskX = (hiShiftX < 32) ? ~0 >>> hiShiftX : 0;
			const loMaskX = ~0 >>> Math.max(0, loBits - xBits);

			const hiShiftY = 32 - Math.max(0, yBits + xBits - loBits);
			const hiMaskY = (((hiShiftY < 32) ? ~0 >>> hiShiftY : 0) & ~hiMaskX) >>> 0;
			const loMaskY = ((~0 >>> Math.max(0, loBits - (xBits + yBits))) & ~loMaskX) >>> 0;

			const hiShiftZ = 32 - Math.max(0, zBits + yBits + xBits - loBits);
			const hiMaskZ = (((hiShiftZ < 32) ? ~0 >>> hiShiftZ : 0) & ~hiMaskY & ~hiMaskX) >>> 0;
			const loMaskZ = ((~0 >>> Math.max(0, loBits - (xBits + yBits + zBits))) & ~loMaskY & ~loMaskX) >>> 0;

			const x = ((hi & hiMaskX) * Math.pow(2, 32)) + ((lo & loMaskX) >>> 0);
			const y = ((hi & hiMaskY) * Math.pow(2, 32)) + ((lo & loMaskY) >>> 0);
			const z = ((hi & hiMaskZ) * Math.pow(2, 32)) + ((lo & loMaskZ) >>> 0);

			console.log(createBinaryString(hi, 32), hi, "(hi)");
			console.log(createBinaryString(lo, 32), lo, "(lo)");

			console.log(createBinaryString(hiMaskX, 32), hiMaskX, "(hi mask x)");
			console.log(createBinaryString(loMaskX, 32), loMaskX, "(lo mask x)");
			console.log(createBinaryString(hiMaskY, 32), hiMaskY, "(hi mask y)");
			console.log(createBinaryString(loMaskY, 32), loMaskY, "(lo mask y)");
			console.log(createBinaryString(hiMaskZ, 32), hiMaskZ, "(hi mask z)");
			console.log(createBinaryString(loMaskZ, 32), loMaskZ, "(lo mask z)");

			console.log(createBinaryString(x, bits), x, "(extracted x)");
			console.log(createBinaryString(y, bits), y, "(extracted y)");
			console.log(createBinaryString(z, bits), z, "(extracted z)");

			test.ok(xBits + yBits + zBits <= bits, "Invalid bit allotment");

			test.equal(i, Math.pow(2, hiBits + loBits) - 1);
			test.equal(hi, Math.pow(2, hiBits) - 1);
			test.equal(lo, Math.pow(2, loBits) - 1);

			test.equal(x, Math.pow(2, xBits) - 1, "X");
			test.equal(y, (Math.pow(2, yBits + xBits) - 1) - (Math.pow(2, xBits) - 1), "Y");
			test.equal(z, (Math.pow(2, zBits + yBits + xBits) - 1) - (Math.pow(2, yBits + xBits) - 1), "Z");

			test.done();

		},

		"storing values in specific bit slots of a 53bit integer": function(test) {

			const xBits = 21;
			const yBits = 11;
			const zBits = 21;

			const yOffset = Math.pow(2, xBits);
			const zOffset = Math.pow(2, yBits + xBits);

			const x = 42;
			const y = 23;
			const z = 11;

			const i = z * zOffset + y * yOffset + x;

			const hi = Math.trunc(i / Math.pow(2, 32));
			const lo = i % Math.pow(2, 32);

			console.log(createBinaryString(x), x, "(input x)");
			console.log(createBinaryString(y), y, "(input y)");
			console.log(createBinaryString(z), z, "(input z)");

			console.log(createBinaryString(hi, 32), hi, "(final hi)");
			console.log(createBinaryString(lo, 32), lo, "(final lo)");
			console.log(createBinaryString(i, bits), i, "(final i53)");

			test.ok(xBits + yBits + zBits <= bits, "Invalid bit allotment");
			test.ok(x < Math.pow(2, xBits), "X value out of bounds");
			test.ok(y < Math.pow(2, yBits), "Y value out of bounds");
			test.ok(z < Math.pow(2, zBits), "Z value out of bounds");

			test.done();

		}

	}

};
