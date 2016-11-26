/**
 * Detects whether certain key features are supported.
 *
 * @class Detector
 * @constructor
 */

export class Detector {

	constructor() {

		/**
		 * Indicates whether the canvas HTML element is supported.
		 *
		 * @property canvas
		 * @type Boolean
		 */

		this.canvas = (window.CanvasRenderingContext2D !== undefined);

		/**
		 * Indicates whether WebGL is supported.
		 *
		 * @property webgl
		 * @type Boolean
		 */

		this.webgl = this.canvas ? (function() {

			let supported = (window.WebGLRenderingContext !== undefined);
			let canvas, context;

			if(supported) {

				canvas = document.createElement("canvas");
				context = canvas.getContext("webgl");

				if(context === null) {

					if(canvas.getContext("experimental-webgl") === null) {

						supported = false;

					}

				}

			}

			return supported;

		}()) : false;

		/**
		 * Indicates whether Web Workers are supported.
		 *
		 * @property worker
		 * @type Boolean
		 */

		this.worker = (window.Worker !== undefined);

		/**
		 * Indicates whether the File API is supported.
		 *
		 * @property file
		 * @type Boolean
		 */

		this.file = (
			window.File !== undefined &&
			window.FileReader !== undefined &&
			window.FileList !== undefined &&
			window.Blob !== undefined
		);

	}

}
