/**
 * An enumeration of worker actions.
 *
 * @type {Object}
 * @property {String} EXTRACT - Isosurface extraction signal.
 * @property {String} MODIFY - Data modification signal.
 * @property {String} CLOSE - Thread termination signal.
 */

export const Action = {

	EXTRACT: "worker.extract",
	MODIFY: "worker.modify",
	CLOSE: "worker.close"

};
