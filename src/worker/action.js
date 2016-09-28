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
	 * @type String
	 * @static
	 * @final
	 */

	EXTRACT: "worker.extract",

	/**
	 * Hermite data modification signal.
	 *
	 * @property MODIFY
	 * @type String
	 * @static
	 * @final
	 */

	MODIFY: "worker.modify",

	/**
	 * Thread termination signal.
	 *
	 * @property CLOSE
	 * @type String
	 * @static
	 * @final
	 */

	CLOSE: "worker.close"

};
