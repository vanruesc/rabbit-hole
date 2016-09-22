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

	EXTRACT: Symbol.for("worker.extract"),

	/**
	 * Hermite data modification signal.
	 *
	 * @property MODIFY
	 * @type Symbol
	 * @static
	 * @final
	 */

	MODIFY: Symbol.for("worker.modify"),

	/**
	 * Thread termination signal.
	 *
	 * @property CLOSE
	 * @type Symbol
	 * @static
	 * @final
	 */

	CLOSE: Symbol.for("worker.close")

};
