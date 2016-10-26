/**
 * Exposure of the library components.
 *
 * @module rabbit-hole
 * @main rabbit-hole
 */

export {
	Terrain,
	Queue,
	PriorityQueue,
	IteratorResult
} from "./core";

export { TerrainMaterial } from "./materials";

export { ChunkHelper } from "./helpers";

export {
	SingularValueDecomposition,
	Givens,
	Schur,
	SymmetricMatrix3,
	Matrix3,
	Vector3,
	QEFSolver,
	QEFData
} from "./math";

export {
	SignedDistanceFunction,
	Heightfield,
	Sphere,
	Torus,
	Plane,
	Box,
	ConstructiveSolidGeometry,
	Intersection,
	Difference,
	Union
} from "./volume";
