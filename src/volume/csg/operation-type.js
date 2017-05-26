/**
 * An enumeration of CSG operation types.
 *
 * @type {Object}
 * @property {String} UNION - Indicates a union of volume data.
 * @property {String} DIFFERENCE - Indicates a subtraction of volume data.
 * @property {String} INTERSECTION - Indicates an intersection of volume data.
 * @property {String} DENSITY_FUNCTION - Indicates volume data generation.
 */

export const OperationType = {

	UNION: "csg.union",
	DIFFERENCE: "csg.difference",
	INTERSECTION: "csg.intersection",
	DENSITY_FUNCTION: "csg.densityfunction"

};
