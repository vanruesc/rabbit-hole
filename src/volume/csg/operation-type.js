/**
 * An enumeration of CSG operation types.
 *
 * @class OperationType
 * @submodule csg
 * @static
 */

export const OperationType = {

	/**
	 * Indicates a union of volume data.
	 *
	 * @property UNION
	 * @type String
	 * @static
	 * @final
	 */

	UNION: "csg.union",

	/**
	 * Indicates a subtraction of volume data.
	 *
	 * @property DIFFERENCE
	 * @type String
	 * @static
	 * @final
	 */

	DIFFERENCE: "csg.difference",

	/**
	 * Indicates an intersection of volume data.
	 *
	 * @property INTERSECTION
	 * @type String
	 * @static
	 * @final
	 */

	INTERSECTION: "csg.intersection",

	/**
	 * Indicates volume data generation.
	 *
	 * @property DENSITY_FUNCTION
	 * @type String
	 * @static
	 * @final
	 */

	DENSITY_FUNCTION: "csg.densityfunction"

};
