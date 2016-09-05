/**
 * An enumeration of worker actions.
 *
 * @class Action
 * @submodule worker
 * @static
 */

export const Action = {

	/**
	 * Isosurface extraction signal.
	 *
	 * @property EXTRACT
	 * @type Symbol
	 * @static
	 * @final
	 */

	EXTRACT: Symbol.for("rabbit.extract"),

	/**
	 * Hermite data modification signal.
	 *
	 * @property MODIFY
	 * @type Symbol
	 * @static
	 * @final
	 */

	MODIFY: Symbol.for("rabbit.modify"),

	/**
	 * Thread termination signal.
	 *
	 * @property CLOSE
	 * @type Symbol
	 * @static
	 * @final
	 */

	CLOSE: Symbol.for("rabbit.close")

};
