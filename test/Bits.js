import test from "ava";
import { BinaryUtils } from "../dist/rabbit-hole.js";

const createBinaryString = BinaryUtils.createBinaryString;

// Bit Allotment.
const bits = 53;
const hiBits = 21;
const loBits = 32;

test("concatenating 32bit integers", t => {

	const hi = 0b00000000000111111111111111111111;
	const lo = 0b11111111111111111111111111111111;

	const i = (hi * Math.pow(2, 32)) + lo;

	console.log(createBinaryString(i), i, "(i53, left-padded to 64)");

	t.is(hi, Math.pow(2, hiBits) - 1);
	t.is(lo, Math.pow(2, loBits) - 1);
	t.is(i, Math.pow(2, bits) - 1);

});

test("extracting specific bits from a 53bit integer", t => {

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

	t.true(xBits + yBits + zBits <= bits, "Invalid bit allotment");

	t.is(i, Math.pow(2, hiBits + loBits) - 1);
	t.is(hi, Math.pow(2, hiBits) - 1);
	t.is(lo, Math.pow(2, loBits) - 1);

	t.is(x, Math.pow(2, xBits) - 1, "X");
	t.is(y, (Math.pow(2, yBits + xBits) - 1) - (Math.pow(2, xBits) - 1), "Y");
	t.is(z, (Math.pow(2, zBits + yBits + xBits) - 1) - (Math.pow(2, yBits + xBits) - 1), "Z");

});

test("storing values in specific bit slots of a 53bit integer", t => {

	const xBits = 21;
	const yBits = 11;
	const zBits = 21;

	const rangeX = Math.pow(2, xBits);
	const rangeXY = Math.pow(2, xBits + yBits);

	const x = 42;
	const y = 23;
	const z = 11;

	const i = z * rangeXY + y * rangeX + x;

	const hi = Math.trunc(i / Math.pow(2, 32));
	const lo = i % Math.pow(2, 32);

	console.log(createBinaryString(x), x, "(input x)");
	console.log(createBinaryString(y), y, "(input y)");
	console.log(createBinaryString(z), z, "(input z)");

	console.log(createBinaryString(hi, 32), hi, "(final hi)");
	console.log(createBinaryString(lo, 32), lo, "(final lo)");
	console.log(createBinaryString(i, bits), i, "(final i53)");

	t.true(xBits + yBits + zBits <= bits, "Invalid bit allotment");
	t.true(x < Math.pow(2, xBits), "X value out of bounds");
	t.true(y < Math.pow(2, yBits), "Y value out of bounds");
	t.true(z < Math.pow(2, zBits), "Z value out of bounds");

});
