/**
 * An enumeration of worker actions.
 *
 * @type {Object}
 * @property {String} EXTRACT - Isosurface extraction signal.
 * @property {String} MODIFY - Data modification signal.
 * @property {String} RESAMPLE - Data resampling signal.
 * @property {String} CONFIGURE - General configuration signal.
 * @property {String} CLOSE - Thread termination signal.
 */

export const Action = {

	EXTRACT: "worker.extract",
	MODIFY: "worker.modify",
	RESAMPLE: "worker.resample",
	CONFIGURE: "worker.config",
	CLOSE: "worker.close"

};
