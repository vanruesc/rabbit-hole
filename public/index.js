(function (three,dat,Stats) {
	'use strict';

	dat = 'default' in dat ? dat['default'] : dat;
	Stats = 'default' in Stats ? Stats['default'] : Stats;

	/**
	 * Detects whether certain key features are supported.
	 *
	 * @class Detector
	 * @constructor
	 */

	class Detector {

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

	/**
	 * A basic object queue.
	 *
	 * @class Queue
	 * @submodule core
	 * @constructor
	 */

	class Queue {

		constructor() {

			/**
			 * A list of elements.
			 *
			 * @property elements
			 * @type Array
			 * @private
			 */

			this.elements = [];

			/**
			 * The head of the queue.
			 *
			 * @property head
			 * @type Number
			 * @private
			 */

			this.head = 0;

			/**
			 * The current size of the queue.
			 *
			 * @property size
			 * @type Number
			 */

			this.size = 0;

		}

		/**
		 * Adds an element to the queue.
		 *
		 * @method add
		 * @param {Object} element - An arbitrary object.
		 * @return {Number} The index of the added element.
		 */

		add(element) {

			const index = this.elements.length;

			this.elements.push(element);

			++this.size;

			return index;

		}

		/**
		 * Removes an element from the queue.
		 *
		 * @method remove
		 * @param {Number} index - The index of the element.
		 * @return {Object} The removed element or null if there was none.
		 */

		remove(index) {

			const elements = this.elements;
			const length = elements.length;

			let element = null;

			if(this.size > 0 && index >= 0 && index < length) {

				element = elements[index];

				if(element !== null) {

					elements[index] = null;

					--this.size;

					if(this.size > 0) {

						while(this.head < length && elements[this.head] === null) {

							++this.head;

						}

						if(this.head === length) {

							this.clear();

						}

					} else {

						this.clear();

					}

				}

			}

			return element;

		}

		/**
		 * Retrieves, but does not remove, the head of the queue, or returns null if
		 * the queue is empty.
		 *
		 * @method peek
		 * @return {Object} The head of the queue.
		 */

		peek() {

			return (this.size > 0) ? this.elements[this.head] : null;

		}

		/**
		 * Retrieves and removes the head of the queue, or returns null if the queue
		 * is empty.
		 *
		 * @method poll
		 * @return {Object} The head of the queue.
		 */

		poll() {

			const elements = this.elements;
			const length = elements.length;

			let element = null;

			if(this.size > 0) {

				element = elements[this.head++];

				while(this.head < length && elements[this.head] === null) {

					++this.head;

				}

				if(this.head === length) {

					this.clear();

				} else {

					--this.size;

				}

			}

			return element;

		}

		/**
		 * Clears this queue.
		 *
		 * @method clear
		 */

		clear() {

			this.elements = [];
			this.head = 0;
			this.size = 0;

		}

	}

	/**
	 * A queue that maintains elements in a hierarchy. Elements with a high priority
	 * will be served before elements with a lower priority.
	 *
	 * @class PriorityQueue
	 * @submodule core
	 * @constructor
	 * @param {Number} [tiers=1] - The number of priority tiers. The lowest tier represents the lowest priority.
	 */

	class PriorityQueue extends Queue {

		constructor(tiers = 1) {

			super();

			tiers = Math.max(1, tiers);

			while(tiers-- > 0) {

				this.elements.push(new Queue());

			}

		}

		/**
		 * The amount of priority tiers.
		 *
		 * @property tiers
		 * @type Number
		 */

		get tiers() { return this.elements.length; }

		/**
		 * Adds an element.
		 *
		 * @method add
		 * @param {Object} element - The element.
		 * @param {Number} [priority] - The priority of the element.
		 * @return {Number} The index of the added element.
		 */

		add(element, priority) {

			let index = -1;

			if(priority >= 0 && priority < this.elements.length) {

				index = this.elements[priority].add(element);

				if(priority > this.head) {

					this.head = priority;

				}

				++this.size;

			}

			return index;

		}

		/**
		 * Deletes an element.
		 *
		 * @method remove
		 * @param {Object} index - The index of the element.
		 * @param {Number} [priority] - The priority of the element.
		 * @return {Object} The removed element or null if there was none.
		 */

		remove(index, priority) {

			let element = null;

			if(priority >= 0 && priority < this.elements.length) {

				element = this.elements[priority].remove(index);

				if(element !== null) {

					--this.size;

					while(this.head > 0 && this.elements[this.head].size === 0) {

						--this.head;

					}

				}

			}

			return element;

		}

		/**
		 * Retrieves, but does not remove, the head of the queue, or returns null if
		 * the queue is empty.
		 *
		 * @method peek
		 * @return {Object} The head of the queue.
		 */

		peek() {

			return (this.size > 0) ? this.elements[this.head].peek() : null;

		}

		/**
		 * Retrieves the head of the queue, or returns null if the queue is empty.
		 *
		 * @method poll
		 * @return {Object} The head of the queue.
		 */

		poll() {

			let element = null;

			if(this.size > 0) {

				element = this.elements[this.head].poll();

				--this.size;

				while(this.head > 0 && this.elements[this.head].size === 0) {

					--this.head;

				}

			}

			return element;

		}

		/**
		 * Clears this queue.
		 *
		 * @method clear
		 */

		clear() {

			let i;

			for(i = this.elements.length - 1; i >= 0; --i) {

				this.elements[i].clear();

			}

			this.head = 0;
			this.size = 0;

		}

	}

	/**
	 * An enumeration of CSG operation types.
	 *
	 * @class OperationType
	 * @submodule csg
	 * @static
	 */

	const OperationType = {

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

	/**
	 * An operation history.
	 *
	 * @class History
	 * @submodule core
	 * @constructor
	 */

	class History {

		constructor() {

			/**
			 * The elements that have been executed during the current session.
			 *
			 * @property elements
			 * @type Array
			 * @private
			 */

			this.elements = [];

		}

		/**
		 * Adds an SDF to the operation history.
		 *
		 * @method push
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {Number} The new length of the history list.
		 */

		push(sdf) {

			return this.elements.push(sdf);

		}

		/**
		 * Removes the SDF that was last added to the history and returns it.
		 *
		 * @method pop
		 * @return {SignedDistanceFunction} An SDF.
		 */

		pop() {

			return this.elements.pop();

		}

		/**
		 * Combines all operations into one.
		 *
		 * @method combine
		 * @return {SignedDistanceFunction} An SDF consisting of all past operations, or null if there are none.
		 */

		combine() {

			const elements = this.elements;

			let a = null;
			let b = null;

			let i, l;

			if(elements.length > 0) {

				for(i = 0, l = elements.length; i < l; ++i) {

					b = elements[i];

					if(a !== null) {

						switch(b.operation) {

							case OperationType.UNION:
								a.union(b);
								break;

							case OperationType.DIFFERENCE:
								a.subtract(b);
								break;

							case OperationType.INTERSECTION:
								a.intersect(b);
								break;

						}

					} else {

						a = b;

					}

				}

			}

			return a;

		}

		/**
		 * Clears this history.
		 *
		 * @method clear
		 */

		clear() {

			this.elements = [];

		}

	}

	/**
	 * Run-Length Encoding for numeric data.
	 *
	 * @class RunLengthEncoder
	 * @submodule core
	 * @static
	 */

	class RunLengthEncoder {

		/**
		 * Encodes the given data.
		 *
		 * @method encode
		 * @static
		 * @param {Array} array - The data to encode.
		 * @return {Object} The run-lengths and the encoded data.
		 */

		static encode(array) {

			const runLengths = [];
			const data = [];

			let previous = array[0];
			let count = 1;

			let i, l;

			for(i = 1, l = array.length; i < l; ++i) {

				if(previous !== array[i]) {

					runLengths.push(count);
					data.push(previous);

					previous = array[i];
					count = 1;

				} else {

					++count;

				}

			}

			runLengths.push(count);
			data.push(previous);

			return {
				runLengths,
				data
			};

		}

		/**
		 * Decodes the given data.
		 *
		 * @method decode
		 * @static
		 * @param {Array} runLengths - The run-lengths.
		 * @param {Array} data - The data to decode.
		 * @param {Array} [array] - An optional target.
		 * @return {Array} The decoded data.
		 */

		static decode(runLengths, data, array = []) {

			let element;

			let i, j, il, jl;
			let k = 0;

			for(i = 0, il = data.length; i < il; ++i) {

				element = data[i];

				for(j = 0, jl = runLengths[i]; j < jl; ++j) {

					array[k++] = element;

				}

			}

			return array;

		}

	}

	/**
	 * A task scheduler.
	 *
	 * @class Scheduler
	 * @submodule core
	 * @extends PriorityQueue
	 * @constructor
	 * @param {Number} tiers - The number of priority tiers.
	 */

	class Scheduler extends PriorityQueue {

		constructor(tiers) {

			super(tiers);

			/**
			 * Keeps track of associations between elements and tasks.
			 *
			 * @property registry
			 * @type WeakMap
			 * @private
			 */

			this.registry = new WeakMap();

			/**
			 * The highest priority.
			 *
			 * @property maxPriority
			 * @type Number
			 */

			this.maxPriority = this.tiers - 1;

		}

		/**
		 * Cancels the task that is currently scheduled for the given element.
		 *
		 * @method cancel
		 * @param {Object} element - The element.
		 * @return {Boolean} Whether the cancellation succeeded.
		 */

		cancel(element) {

			const task = this.registry.get(element);
			const result = (task !== undefined);

			if(result) {

				this.remove(task.index, task.priority);
				this.registry.delete(element);

			}

			return result;

		}

		/**
		 * Schedules a task for the given element. Other tasks that are scheduled for
		 * that element will be cancelled.
		 *
		 * @method schedule
		 * @param {Object} element - The element.
		 * @param {Task} task - The task.
		 * @return {Boolean} Whether the task was scheduled.
		 */

		schedule(element, task) {

			const result = !this.registry.has(element);

			if(result) {

				if(task !== null) {

					this.remove(task.index, task.priority);
					this.registry.delete(element);

				}

				task.index = this.add(task, task.priority);
				this.registry.set(element, task);

			}

			return result;

		}

		/**
		 * Checks if a task is scheduled for the given element.
		 *
		 * @method hasTask
		 * @param {Object} element - The element.
		 * @return {Boolean} Whether a task is currently scheduled.
		 */

		hasTask(element) {

			return this.registry.has(element);

		}

		/**
		 * Retrieves the task for the given element.
		 *
		 * @method getTask
		 * @param {Object} element - The element.
		 * @return {Task} The task or undefined if there is none.
		 */

		getTask(element) {

			return this.registry.get(element);

		}

		/**
		 * Retrieves the head of the queue, or returns null if the queue is empty.
		 *
		 * @method poll
		 * @return {Task} The task with the highest priority or null if there is none.
		 */

		poll() {

			const element = super.poll();

			if(element !== null) {

				this.registry.delete(element.chunk);

			}

			return element;

		}

		/**
		 * Removes all tasks.
		 *
		 * @method clear
		 */

		clear() {

			super.clear();

			this.registry = new WeakMap();

		}

	}

	/**
	 * A task.
	 *
	 * @class Task
	 * @submodule core
	 * @constructor
	 * @param {Number} [priority=0] - The priority.
	 */

	class Task {

		constructor(priority = 0) {

			/**
			 * The priority of this task.
			 *
			 * @property priority
			 * @type Number
			 * @default 0
			 */

			this.priority = priority;

			/**
			 * The index of this task.
			 *
			 * @property index
			 * @type Number
			 * @default -1
			 */

			this.index = -1;

		}

	}

	var fragment = "#define PHYSICAL\r\n\r\nuniform vec3 diffuse;\r\nuniform vec3 emissive;\r\nuniform float roughness;\r\nuniform float metalness;\r\nuniform float opacity;\r\n\r\n#ifndef STANDARD\r\n\tuniform float clearCoat;\r\n\tuniform float clearCoatRoughness;\r\n#endif\r\n\r\nuniform float envMapIntensity; // temporary\r\n\r\nvarying vec3 vViewPosition;\r\n\r\n#ifndef FLAT_SHADED\r\n\r\n\tvarying vec3 vNormal;\r\n\r\n#endif\r\n\r\n#include <common>\r\n#include <packing>\r\n#include <color_pars_fragment>\r\n#include <map_triplanar_pars_fragment>\r\n#include <alphamap_pars_fragment>\r\n#include <specularmap_pars_fragment>\r\n#include <lightmap_pars_fragment>\r\n#include <emissivemap_pars_fragment>\r\n#include <envmap_pars_fragment>\r\n#include <fog_pars_fragment>\r\n#include <bsdfs>\r\n#include <cube_uv_reflection_fragment>\r\n#include <lights_pars>\r\n#include <lights_physical_pars_fragment>\r\n#include <shadowmap_pars_fragment>\r\n#include <triplanar_pars_fragment>\r\n#include <normalmap_triplanar_pars_fragment>\r\n#include <roughnessmap_pars_fragment>\r\n#include <metalnessmap_pars_fragment>\r\n#include <logdepthbuf_pars_fragment>\r\n#include <clipping_planes_pars_fragment>\r\n\r\nvoid main() {\r\n\r\n\t#include <clipping_planes_fragment>\r\n\r\n\tvec4 diffuseColor = vec4( diffuse, opacity );\r\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\r\n\tvec3 totalEmissiveRadiance = emissive;\r\n\r\n\t#include <logdepthbuf_fragment>\r\n\t#include <normal_flip>\r\n\t#include <normal_triplanar_fragment>\r\n\t#include <map_triplanar_fragment>\r\n\t#include <color_fragment>\r\n\t#include <alphamap_triplanar_fragment>\r\n\t#include <alphatest_fragment>\r\n\t#include <specularmap_triplanar_fragment>\r\n\t#include <roughnessmap_triplanar_fragment>\r\n\t#include <metalnessmap_triplanar_fragment>\r\n\t#include <emissivemap_triplanar_fragment>\r\n\r\n\t// accumulation\r\n\t#include <lights_physical_fragment>\r\n\t#include <lights_template>\r\n\r\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\r\n\r\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\r\n\r\n\t#include <premultiplied_alpha_fragment>\r\n\t#include <tonemapping_fragment>\r\n\t#include <encodings_fragment>\r\n\t#include <fog_fragment>\r\n\r\n}\r\n";

	var vertex = "#define PHYSICAL\r\n\r\nvarying vec3 vViewPosition;\r\n\r\n#ifndef FLAT_SHADED\r\n\r\n\tvarying vec3 vNormal;\r\n\r\n#endif\r\n\r\n#include <common>\r\n#include <uv_pars_vertex> // offsetRepeat\r\n#include <color_pars_vertex>\r\n#include <morphtarget_pars_vertex>\r\n#include <skinning_pars_vertex>\r\n#include <shadowmap_pars_vertex>\r\n#include <logdepthbuf_pars_vertex>\r\n#include <clipping_planes_pars_vertex>\r\n#include <triplanar_pars_vertex>\r\n\r\nvoid main() {\r\n\r\n\t#include <color_vertex>\r\n\r\n\t#include <beginnormal_vertex>\r\n\t#include <morphnormal_vertex>\r\n\t#include <skinbase_vertex>\r\n\t#include <skinnormal_vertex>\r\n\t#include <defaultnormal_vertex>\r\n\r\n#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\r\n\r\n\tvNormal = normalize( transformedNormal );\r\n\r\n#endif\r\n\r\n\t#include <begin_vertex>\r\n\t#include <morphtarget_vertex>\r\n\t#include <skinning_vertex>\r\n\t#include <project_vertex>\r\n\t#include <logdepthbuf_vertex>\r\n\t#include <clipping_planes_vertex>\r\n\r\n\tvViewPosition = - mvPosition.xyz;\r\n\r\n\t#include <worldpos_vertex>\r\n\t#include <shadowmap_vertex>\r\n\t#include <triplanar_vertex>\r\n\r\n}\r\n";

	var alphamapTriplanarFragment = "#ifdef USE_ALPHAMAP\n\n\tdiffuseColor.a *= t3( alphaMap ).g;\n\n#endif\n";

	var emissivemapTriplanarFragment = "#ifdef USE_EMISSIVEMAP\n\n\tvec4 emissiveColor = t3( emissiveMap );\n\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\n\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n\n#endif\n";

	var mapTriplanarParsFragment = "#ifdef USE_MAP\n\n\tuniform sampler2D map;\n\n\t#ifdef USE_MAP_Y\n\n\t\tuniform sampler2D mapY;\n\n\t#endif\n\n\t#ifdef USE_MAP_Z\n\n\t\tuniform sampler2D mapZ;\n\n\t#endif\n\n#endif\n";

	var mapTriplanarFragment = "#ifdef USE_MAP\r\n\r\n\t#ifdef USE_MAP_Z\r\n\r\n\t\tvec4 texelColor = t3( map, mapY, mapZ );\r\n\r\n\t#elif USE_MAP_Y\r\n\r\n\t\tvec4 texelColor = t3( map, mapY );\r\n\r\n\t#else\r\n\r\n\t\tvec4 texelColor = t3( map );\r\n\r\n\t#endif\r\n\r\n\ttexelColor = mapTexelToLinear( texelColor );\r\n\tdiffuseColor *= texelColor;\r\n\r\n#endif\r\n";

	var metalnessmapTriplanarFragment = "float metalnessFactor = metalness;\n\n#ifdef USE_METALNESSMAP\n\n\tvec4 texelMetalness = t3( metalnessMap );\n\tmetalnessFactor *= texelMetalness.r;\n\n#endif\n";

	var normalTriplanarFragment = "#ifdef FLAT_SHADED\n\n\t// Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...\n\n\tvec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );\n\tvec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );\n\tvec3 normal = normalize( cross( fdx, fdy ) );\n\n#else\n\n\tvec3 normal = normalize( vNormal ) * flipNormal;\n\n#endif\n\n#ifdef USE_NORMALMAP\n\n\tnormal = perturbNormal2Arb( normal );\n\n#endif\n";

	var normalmapTriplanarParsFragment = "#ifdef USE_NORMALMAP\r\n\r\n\tuniform sampler2D normalMap;\r\n\tuniform vec2 normalScale;\r\n\r\n\t#ifdef USE_NORMALMAP_Y\r\n\r\n\t\tuniform sampler2D normalMapY;\r\n\r\n\t#endif\r\n\r\n\t#ifdef USE_NORMALMAP_Z\r\n\r\n\t\tuniform sampler2D normalMapZ;\r\n\r\n\t#endif\r\n\r\n\t// Triplanar Tangent Space Normal Mapping\r\n\t// Jaume Sánchez (https://www.clicktorelease.com/code/bumpy-metaballs/)\r\n\t// Mel (http://irrlicht.sourceforge.net/forum/viewtopic.php?t=48043)\r\n\r\n\tvec3 perturbNormal2Arb( vec3 normal ) {\r\n\r\n\t\t// Not sure why this doesn't work. Needs more testing!\r\n\t\t/*vec3 tangentX = vec3( normal.x, - normal.z, normal.y );\r\n\t\tvec3 tangentY = vec3( normal.z, normal.y, - normal.x );\r\n\t\tvec3 tangentZ = vec3( - normal.y, normal.x, normal.z );\r\n\r\n\t\tvec3 tangent = (\r\n\t\t\ttangentX * vBlend.x +\r\n\t\t\ttangentY * vBlend.y +\r\n\t\t\ttangentZ * vBlend.z\r\n\t\t); \r\n\r\n\t\tmat3 tsb = mat3(\r\n\t\t\tnormalize( tangent ),\r\n\t\t\tnormalize( cross( normal, tangent ) ),\r\n\t\t\tnormalize( normal )\r\n\t\t);*/\r\n\r\n\t\tmat3 tbn = mat3(\r\n\t\t\tnormalize( vec3( normal.y + normal.z, 0.0, normal.x ) ),\r\n\t\t\tnormalize( vec3( 0.0, normal.x + normal.z, normal.y ) ),\r\n\t\t\tnormal\r\n\t\t);\r\n\r\n\t\t#ifdef USE_NORMALMAP_Z\r\n\r\n\t\t\tvec3 mapN = t3( normalMap, normalMapY, normalMapZ ).xyz;\r\n\r\n\t\t#elif USE_NORMALMAP_Y\r\n\r\n\t\t\tvec3 mapN = t3( normalMap, normalMapY ).xyz;\r\n\r\n\t\t#else\r\n\r\n\t\t\tvec3 mapN = t3( normalMap ).xyz;\r\n\r\n\t\t#endif\r\n\r\n\t\t// Expand and scale the vector.\r\n\t\tmapN = mapN * 2.0 - 1.0;\r\n\t\tmapN.xy *= normalScale;\r\n\r\n\t\treturn normalize( tbn * mapN );\r\n\r\n\t}\r\n\r\n#endif\r\n";

	var roughnessmapTriplanarFragment = "float roughnessFactor = roughness;\n\n#ifdef USE_ROUGHNESSMAP\n\n\tvec4 texelRoughness = t3( roughnessMap );\n\troughnessFactor *= texelRoughness.r;\n\n#endif\n";

	var specularmapTriplanarFragment = "float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n\tvec4 texelSpecular = t3( specularMap );\n\tspecularStrength = texelSpecular.r;\n\n#else\n\n\tspecularStrength = 1.0;\n\n#endif";

	var triplanarParsFragment = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\r\n\r\n\tvarying vec3 vBlend;\r\n\tvarying vec2 vCoords[3];\r\n\r\n\tvec4 t3( sampler2D mapX, sampler2D mapY, sampler2D mapZ ) {\r\n\r\n\t\tvec4 xAxis = texture2D( mapX, vCoords[0] );\r\n\t\tvec4 yAxis = texture2D( mapY, vCoords[1] );\r\n\t\tvec4 zAxis = texture2D( mapZ, vCoords[2] );\r\n\r\n\t\treturn (\r\n\t\t\txAxis * vBlend.x +\r\n\t\t\tyAxis * vBlend.y +\r\n\t\t\tzAxis * vBlend.z\r\n\t\t);\r\n\r\n\t}\r\n\r\n\tvec4 t3( sampler2D mapX, sampler2D mapYZ ) {\r\n\r\n\t\treturn t3( mapX, mapYZ, mapYZ );\r\n\r\n\t}\r\n\r\n\tvec4 t3( sampler2D mapXYZ ) {\r\n\r\n\t\treturn t3( mapXYZ, mapXYZ, mapXYZ );\r\n\r\n\t}\r\n\r\n#endif\r\n";

	var triplanarParsVertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\r\n\r\n\tvarying vec3 vBlend;\r\n\tvarying vec2 vCoords[3];\r\n\r\n\tvec3 computeTriplanarBlend( vec3 normal ) {\r\n\r\n\t\t// Voxel-Based Terrain for Real-Time Virtual Simulations (Ch. 5).\r\n\t\tvec3 blend = saturate( abs( normal ) - 0.5 );\r\n\r\n\t\t// Raise each component of the normal vector to the 4th power.\r\n\t\tblend *= blend;\r\n\t\tblend *= blend;\r\n\r\n\t\t// Normalize the result by dividing by the sum of its components.\r\n\t\tblend /= dot( blend, vec3( 1.0 ) );\r\n\r\n\t\t// GPU Gems 3 (Ch. 1).\r\n\t\t//vec3 blend = abs( normal );\r\n\t\t//blend = ( blend - 0.2 ) * 7.0;  \r\n\t\t//blend = max( blend, 0.0 );\r\n\t\t//blend /= ( blend.x + blend.y + blend.z );\r\n\r\n\t\treturn blend;\r\n\r\n\t}\r\n\r\n#endif\r\n";

	var triplanarVertex = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\r\n\r\n\tvCoords[0] = worldPosition.yz * offsetRepeat.zw + offsetRepeat.xy;\r\n\tvCoords[1] = worldPosition.zx * offsetRepeat.zw + offsetRepeat.xy;\r\n\tvCoords[2] = worldPosition.xy * offsetRepeat.zw + offsetRepeat.xy;\r\n\r\n\tvBlend = computeTriplanarBlend( normal );\r\n\r\n#endif\r\n";

	Object.assign(three.ShaderChunk, {
		"alphamap_triplanar_fragment": alphamapTriplanarFragment,
		"emissivemap_triplanar_fragment": emissivemapTriplanarFragment,
		"map_triplanar_pars_fragment": mapTriplanarParsFragment,
		"map_triplanar_fragment": mapTriplanarFragment,
		"metalnessmap_triplanar_fragment": metalnessmapTriplanarFragment,
		"normal_triplanar_fragment": normalTriplanarFragment,
		"normalmap_triplanar_pars_fragment": normalmapTriplanarParsFragment,
		"roughnessmap_triplanar_fragment": roughnessmapTriplanarFragment,
		"specularmap_triplanar_fragment": specularmapTriplanarFragment,
		"triplanar_pars_fragment": triplanarParsFragment,
		"triplanar_pars_vertex": triplanarParsVertex,
		"triplanar_vertex": triplanarVertex
	});

	// Register custom shader chunks.
	/**
	 * A physically based shader material that uses triplanar texture mapping.
	 *
	 * @class MeshTriplanarPhysicalMaterial
	 * @submodule materials
	 * @extends ShaderMaterial
	 * @constructor
	 */

	class MeshTriplanarPhysicalMaterial extends three.ShaderMaterial {

		constructor() {

			super({

				type: "MeshTriplanarPhysicalMaterial",

				defines: { PHYSICAL: "" },

				uniforms: {

					mapY: new three.Uniform(null),
					mapZ: new three.Uniform(null),

					normalMapY: new three.Uniform(null),
					normalMapZ: new three.Uniform(null)

				},

				fragmentShader: fragment,
				vertexShader: vertex,

				lights: true,
				fog: true

			});

			// Clone uniforms to avoid conflicts with built-in materials.
			const source = three.ShaderLib.physical.uniforms;
			const target = this.uniforms;

			Object.keys(source).forEach(function(key) {

				const value = source[key].value;
				const uniform = new three.Uniform(source[key].value);

				Object.defineProperty(target, key, {

					value: (value === null) ? uniform : uniform.clone()

				});

			});

			/**
			 * An environment map.
			 *
			 * @property envMap
			 * @type Texture
			 */

			this.envMap = null;

		}

		/**
		 * Defines up to three diffuse maps.
		 *
		 * @method setMaps
		 * @param {Texture} [mapX] - The map to use for the X plane.
		 * @param {Texture} [mapY] - The map to use for the Y plane.
		 * @param {Texture} [mapZ] - The map to use for the Z plane.
		 */

		setMaps(mapX, mapY, mapZ) {

			const defines = this.defines;
			const uniforms = this.uniforms;

			if(mapX !== undefined) {

				defines.USE_MAP = "";
				uniforms.map.value = mapX;

			}

			if(mapY !== undefined) {

				defines.USE_MAP_Y = "";
				uniforms.mapY.value = mapY;

			}

			if(mapZ !== undefined) {

				defines.USE_MAP_Z = "";
				uniforms.mapZ.value = mapZ;

			}

			this.needsUpdate = true;

		}

		/**
		 * Defines up to three normal maps.
		 *
		 * @method setNormalMaps
		 * @param {Texture} [mapX] - The map to use for the X plane.
		 * @param {Texture} [mapY] - The map to use for the Y plane.
		 * @param {Texture} [mapZ] - The map to use for the Z plane.
		 */

		setNormalMaps(mapX, mapY, mapZ) {

			const defines = this.defines;
			const uniforms = this.uniforms;

			if(mapX !== undefined) {

				defines.USE_NORMALMAP = "";
				uniforms.normalMap.value = mapX;

			}

			if(mapY !== undefined) {

				defines.USE_NORMALMAP_Y = "";
				uniforms.normalMapY.value = mapY;

			}

			if(mapZ !== undefined) {

				defines.USE_NORMALMAP_Z = "";
				uniforms.normalMapZ.value = mapZ;

			}

			this.needsUpdate = true;

		}

	}

	/**
	 * An interface implemented by objects that can receive events and may have
	 * listeners for them.
	 *
	 * @class EventTarget
	 * @submodule events
	 * @constructor
	 */

	class EventTarget {

		constructor() {

			/**
			 * A map of event listener functions.
			 *
			 * @property m0
			 * @type Map
			 * @private
			 */

			this.m0 = new Map();

			/**
			 * A map of event listener objects.
			 *
			 * @property m1
			 * @type Map
			 * @private
			 */

			this.m1 = new Map();

		}

		/**
		 * Registers an event handler of a specific event type on the event target.
		 *
		 * @method addEventListener
		 * @param {String} type - The event type to listen for.
		 * @param {Object} listener - The object that receives a notification when an event of the specified type occurs.
		 */

		addEventListener(type, listener) {

			const map = (typeof listener === "function") ? this.m0 : this.m1;

			if(map.has(type)) {

				map.get(type).add(listener);

			} else {

				map.set(type, new Set([listener]));

			}

		}

		/**
		 * Removes an event handler of a specific event type from the event target.
		 *
		 * @method addEventListener
		 * @param {String} type - The event type to remove.
		 * @param {Object} listener - The event listener to remove from the event target.
		 */

		removeEventListener(type, listener) {

			const map = (typeof listener === "function") ? this.m0 : this.m1;

			let listeners;

			if(map.has(type)) {

				listeners = map.get(type);
				listeners.delete(listener);

				if(listeners.size === 0) {

					map.delete(type);

				}

			}

		}

		/**
		 * Dispatches an event at the specified event target, invoking the affected
		 * event listeners in the appropriate order.
		 *
		 * @method dispatchEvent
		 * @param {Event} event - The event to dispatch.
		 * @param {EventTarget} [target] - An event target.
		 */

		dispatchEvent(event, target = this) {

			const m0 = target.m0;
			const m1 = target.m1;

			let listeners;
			let listener;

			event.target = target;

			if(m0.has(event.type)) {

				listeners = m0.get(event.type);

				for(listener of listeners) {

					listener.call(target, event);

				}

			}

			if(m1.has(event.type)) {

				listeners = m1.get(event.type);

				for(listener of listeners) {

					listener.handleEvent(event);

				}

			}

		}

	}

	/**
	 * A vector with three components.
	 *
	 * @class Vector3
	 * @submodule math
	 * @constructor
	 * @param {Number} [x=0] - The x value.
	 * @param {Number} [y=0] - The y value.
	 * @param {Number} [z=0] - The z value.
	 */

	class Vector3$1 {

		constructor(x = 0, y = 0, z = 0) {

			/**
			 * The x component.
			 *
			 * @property x
			 * @type Number
			 */

			this.x = x;

			/**
			 * The y component.
			 *
			 * @property y
			 * @type Number
			 */

			this.y = y;

			/**
			 * The z component.
			 *
			 * @property z
			 * @type Number
			 */

			this.z = z;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @method set
		 * @param {Number} x - The x value.
		 * @param {Number} y - The y value.
		 * @param {Number} z - The z value.
		 * @return {Vector3} This vector.
		 */

		set(x, y, z) {

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @method copy
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		}

		/**
		 * Copies values from an array.
		 *
		 * @method fromArray
		 * @param {Array} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector3} This vector.
		 */

		fromArray(array, offset) {

			if(offset === undefined) { offset = 0; }

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @method toArray
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Vector3} The array.
		 */

		toArray(array, offset) {

			if(array === undefined) { array = []; }
			if(offset === undefined) { offset = 0; }

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;

			return array;

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @method equals
		 * @param {Vector3} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y && v.z === this.z);

		}

		/**
		 * Clones this vector.
		 *
		 * @method clone
		 * @return {Vector3} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z);

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @method add
		 * @param {Vector3} v - The vector to add.
		 * @return {Vector3} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @method addScaledVector
		 * @param {Vector3} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @method addScalar
		 * @param {Number} s - The scalar to add.
		 * @return {Vector3} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @method addVectors
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @method sub
		 * @param {Vector3} v - The vector to subtract.
		 * @return {Vector3} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		}

		/**
		 * Subtracts a scalar to this vector.
		 *
		 * @method subScalar
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector3} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @method subVectors
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - A second vector.
		 * @return {Vector3} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @method multiply
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @method multiplyScalar
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		multiplyScalar(s) {

			if(isFinite(s)) {

				this.x *= s;
				this.y *= s;
				this.z *= s;

			} else {

				this.x = 0;
				this.y = 0;
				this.z = 0;

			}

			return this;

		}

		/**
		 * Sets this vector to the product of two given vectors.
		 *
		 * @method multiplyVectors
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		multiplyVectors(a, b) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @method divide
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @method divideScalar
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		divideScalar(s) {

			return this.multiplyScalar(1 / s);

		}

		/**
		 * Sets this vector to the quotient of two given vectors.
		 *
		 * @method divideVectors
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		divideVectors(a, b) {

			this.x = a.x / b.x;
			this.y = a.y / b.y;
			this.z = a.z / b.z;

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @method dot
		 * @param {Vector3} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @method lengthSq
		 * @return {Number} The squared length.
		 */

		lengthSq() {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @method length
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @method distanceTo
		 * @param {Vector3} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @method distanceToSquared
		 * @param {Vector3} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;
			const dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		}

		/**
		 * Normalizes this vector.
		 *
		 * @method normalize
		 * @return {Vector3} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @method min
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);

			return this;

		}

		/**
		 * adopts the max value for each component of this vector and the given one.
		 *
		 * @method max
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @method clamp
		 * @param {Vector3} min - A vector, assumed to be smaller than max.
		 * @param {Vector3} max - A vector, assumed to be greater than min.
		 * @return {Vector3} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));
			this.z = Math.max(min.z, Math.min(max.z, this.z));

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @method applyMatrix3
		 * @param {Matrix3} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix3(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[3] * y + e[6] * z;
			this.y = e[1] * x + e[4] * y + e[7] * z;
			this.z = e[2] * x + e[5] * y + e[8] * z;

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @method applyMatrix4
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix4(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

			return this;

		}

	}

	/**
	 * An octant.
	 *
	 * @class Octant
	 * @submodule core
	 * @constructor
	 * @param {Vector3} min - The lower bounds.
	 * @param {Vector3} max - The upper bounds.
	 */

	class Octant {

		constructor(min = new Vector3$1(), max = new Vector3$1()) {

			/**
			 * The lower bounds of this octant.
			 *
			 * @property min
			 * @type Vector3
			 */

			this.min = min;

			/**
			 * The upper bounds of the octant.
			 *
			 * @property max
			 * @type Vector3
			 */

			this.max = max;

			/**
			 * The children of this octant.
			 *
			 * @property children
			 * @type Array
			 * @default null
			 */

			this.children = null;

		}

		/**
		 * Computes the center of this octant.
		 *
		 * @method getCenter
		 * @return {Vector3} A new vector that describes the center of this octant.
		 */

		getCenter() { return this.min.clone().add(this.max).multiplyScalar(0.5); }

		/**
		 * Computes the size of this octant.
		 *
		 * @method getDimensions
		 * @return {Vector3} A new vector that describes the size of this octant.
		 */

		getDimensions() { return this.max.clone().sub(this.min); }

		/**
		 * Splits this octant into eight smaller ones.
		 *
		 * @method split
		 * @param {Array} [octants] - A list of octants to recycle.
		 */

		split(octants) {

			const min = this.min;
			const max = this.max;
			const mid = this.getCenter();

			let i, j;
			let l = 0;
			let combination;

			let halfDimensions;
			let v, child, octant;

			if(Array.isArray(octants)) {

				halfDimensions = this.getDimensions().multiplyScalar(0.5);
				v = [new Vector3$1(), new Vector3$1(), new Vector3$1()];
				l = octants.length;

			}

			this.children = [];

			for(i = 0; i < 8; ++i) {

				combination = PATTERN[i];
				octant = null;

				if(l > 0) {

					v[1].addVectors(min, v[0].fromArray(combination).multiply(halfDimensions));
					v[2].addVectors(mid, v[0].fromArray(combination).multiply(halfDimensions));

					// Find an octant that matches the current combination.
					for(j = 0; j < l; ++j) {

						child = octants[j];

						if(child !== null && v[1].equals(child.min) && v[2].equals(child.max)) {

							octant = child;
							octants[j] = null;

							break;

						}

					}

				}

				this.children.push((octant !== null) ? octant : new this.constructor(

					new Vector3$1(
						((combination[0] === 0) ? min.x : mid.x),
						((combination[1] === 0) ? min.y : mid.y),
						((combination[2] === 0) ? min.z : mid.z)
					),

					new Vector3$1(
						((combination[0] === 0) ? mid.x : max.x),
						((combination[1] === 0) ? mid.y : max.y),
						((combination[2] === 0) ? mid.z : max.z)
					)

				));

			}

		}

	}

	/**
	 * A binary pattern that describes the standard octant layout:
	 *
	 * <pre>
	 *    3____7
	 *  2/___6/|
	 *  | 1__|_5
	 *  0/___4/
	 * </pre>
	 *
	 * This common layout is crucial for positional assumptions.
	 *
	 * @property PATTERN
	 * @type Array
	 * @static
	 * @final
	 */

	const PATTERN = [

		new Uint8Array([0, 0, 0]),
		new Uint8Array([0, 0, 1]),
		new Uint8Array([0, 1, 0]),
		new Uint8Array([0, 1, 1]),

		new Uint8Array([1, 0, 0]),
		new Uint8Array([1, 0, 1]),
		new Uint8Array([1, 1, 0]),
		new Uint8Array([1, 1, 1])

	];

	/**
	 * Describes all possible octant corner connections.
	 *
	 * @property EDGES
	 * @type Array
	 * @static
	 * @final
	 */

	const EDGES = [

		// X-Axis.
		new Uint8Array([0, 4]),
		new Uint8Array([1, 5]),
		new Uint8Array([2, 6]),
		new Uint8Array([3, 7]),

		// Y-Axis.
		new Uint8Array([0, 2]),
		new Uint8Array([1, 3]),
		new Uint8Array([4, 6]),
		new Uint8Array([5, 7]),

		// Z-Axis.
		new Uint8Array([0, 1]),
		new Uint8Array([2, 3]),
		new Uint8Array([4, 5]),
		new Uint8Array([6, 7])

	];

	/**
	 * A cubic octant.
	 *
	 * @class CubicOctant
	 * @submodule core
	 * @constructor
	 * @param {Vector3} min - The lower bounds.
	 * @param {Number} [size=0] - The size of the octant.
	 */

	class CubicOctant {

		constructor(min = new Vector3$1(), size = 0) {

			/**
			 * The lower bounds of this octant.
			 *
			 * @property min
			 * @type Vector3
			 */

			this.min = min;

			/**
			 * The size of this octant.
			 *
			 * @property size
			 * @type Number
			 */

			this.size = size;

			/**
			 * The children of this octant.
			 *
			 * @property children
			 * @type Array
			 * @default null
			 */

			this.children = null;

		}

		/**
		 * The upper bounds of this octant.
		 *
		 * @property max
		 * @type Vector3
		 */

		get max() { return this.min.clone().addScalar(this.size); }

		/**
		 * Computes the center of this octant.
		 *
		 * @method getCenter
		 * @return {Vector3} A new vector that describes the center of this octant.
		 */

		getCenter() { return this.min.clone().addScalar(this.size * 0.5); }

		/**
		 * Returns the size of this octant as a vector.
		 *
		 * @method getDimensions
		 * @return {Vector3} A new vector that describes the size of this octant.
		 */

		getDimensions() { return new Vector3$1(this.size, this.size, this.size); }

		/**
		 * Splits this octant into eight smaller ones.
		 *
		 * @method split
		 * @param {Array} [octants] - A list of octants to recycle.
		 */

		split(octants) {

			const min = this.min;
			const mid = this.getCenter();
			const halfSize = this.size * 0.5;

			let i, j;
			let l = 0;
			let combination;

			let v, child, octant;

			if(Array.isArray(octants)) {

				v = new Vector3$1();
				l = octants.length;

			}

			this.children = [];

			for(i = 0; i < 8; ++i) {

				combination = PATTERN[i];
				octant = null;

				if(l > 0) {

					v.fromArray(combination).multiplyScalar(halfSize).add(min);

					// Find an octant that matches the current combination.
					for(j = 0; j < l; ++j) {

						child = octants[j];

						if(child !== null && child.size === halfSize && v.equals(child.min)) {

							octant = child;
							octants[j] = null;

							break;

						}

					}

				}

				this.children.push((octant !== null) ? octant : new this.constructor(

					new Vector3$1(
						((combination[0] === 0) ? min.x : mid.x),
						((combination[1] === 0) ? min.y : mid.y),
						((combination[2] === 0) ? min.z : mid.z)
					),

					halfSize

				));

			}

		}

	}

	/**
	 * A bounding box.
	 *
	 * @class Box3
	 * @submodule math
	 * @constructor
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	class Box3$1 {

		constructor(
			min = new Vector3$1(Infinity, Infinity, Infinity),
			max = new Vector3$1(-Infinity, -Infinity, -Infinity)
		) {

			/**
			 * The min bounds.
			 *
			 * @property min
			 * @type Vector3
			 */

			this.min = min;

			/**
			 * The max bounds.
			 *
			 * @property max
			 * @type Vector3
			 */

			this.max = max;

		}

		/**
		 * Sets the values of this box.
		 *
		 * @method set
		 * @param {Number} min - The min bounds.
		 * @param {Number} max - The max bounds.
		 * @return {Matrix3} This box.
		 */

		set(min, max) {

			this.min.copy(min);
			this.max.copy(max);

			return this;

		}

		/**
		 * Copies the values of a given box.
		 *
		 * @method copy
		 * @param {Matrix3} b - A box.
		 * @return {Box3} This box.
		 */

		copy(b) {

			this.min.copy(b.min);
			this.max.copy(b.max);

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @method clone
		 * @return {Matrix3} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Expands this box by the given point.
		 *
		 * @method expandByPoint
		 * @param {Matrix3} p - A point.
		 * @return {Box3} This box.
		 */

		expandByPoint(p) {

			this.min.min(p);
			this.max.max(p);

			return this;

		}

		/**
		 * Expands this box by combining it with the given one.
		 *
		 * @method union
		 * @param {Box3} b - A box.
		 * @return {Box3} This box.
		 */

		union(b) {

			this.min.min(b.min);
			this.max.max(b.max);

			return this;

		}

		/**
		 * Defines this box by the given points.
		 *
		 * @method setFromPoints
		 * @param {Array} points - The points.
		 * @return {Box3} This box.
		 */

		setFromPoints(points) {

			let i, l;

			for(i = 0, l = points.length; i < l; ++i) {

				this.expandByPoint(points[i]);

			}

			return this;

		}

		/**
		 * Defines this box by the given center and size.
		 *
		 * @method setFromCenterAndSize
		 * @param {Vector3} center - The center.
		 * @param {Number} size - The size.
		 * @return {Box3} This box.
		 */

		setFromCenterAndSize(center, size) {

			const halfSize = size.clone().multiplyScalar(0.5);

			this.min.copy(center).sub(halfSize);
			this.max.copy(center).add(halfSize);

			return this;

		}

		/**
		 * Checks if this box intersects with the given one.
		 *
		 * @method intersectsBox
		 * @param {Matrix3} box - A box.
		 * @return {Boolean} Whether the boxes intersect.
		 */

		intersectsBox(box) {

			return !(
				box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y ||
				box.max.z < this.min.z || box.min.z > this.max.z
			);

		}

	}

	/**
	 * Contains bytes used for bitwise operations. The last byte is used to store
	 * raycasting flags.
	 *
	 * @property flags
	 * @type Uint8Array
	 * @private
	 * @static
	 * @final
	 */

	const flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

	/**
	 * A lookup-table containing octant ids. Used to determine the exit plane from
	 * an octant.
	 *
	 * @property octantTable
	 * @type Array
	 * @private
	 * @static
	 * @final
	 */

	const octantTable = [

		new Uint8Array([4, 2, 1]),
		new Uint8Array([5, 3, 8]),
		new Uint8Array([6, 8, 3]),
		new Uint8Array([7, 8, 8]),
		new Uint8Array([8, 6, 5]),
		new Uint8Array([8, 7, 8]),
		new Uint8Array([8, 8, 7]),
		new Uint8Array([8, 8, 8])

	];

	/**
	 * Finds the entry plane of the first octant that a ray travels through.
	 *
	 * Determining the first octant requires knowing which of the t0's is the
	 * largest. The tm's of the other axes must also be compared against that
	 * largest t0.
	 *
	 * @method findEntryOctant
	 * @private
	 * @static
	 * @param {Number} tx0 - Ray projection parameter.
	 * @param {Number} ty0 - Ray projection parameter.
	 * @param {Number} tz0 - Ray projection parameter.
	 * @param {Number} txm - Ray projection parameter mean.
	 * @param {Number} tym - Ray projection parameter mean.
	 * @param {Number} tzm - Ray projection parameter mean.
	 * @return {Number} The index of the first octant that the ray travels through.
	 */

	function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

		let entry = 0;

		// Find the entry plane.
		if(tx0 > ty0 && tx0 > tz0) {

			// YZ-plane.
			if(tym < tx0) { entry = entry | 2; }
			if(tzm < tx0) { entry = entry | 1; }

		} else if(ty0 > tz0) {

			// XZ-plane.
			if(txm < ty0) { entry = entry | 4; }
			if(tzm < ty0) { entry = entry | 1; }

		} else {

			// XY-plane.
			if(txm < tz0) { entry = entry | 4; }
			if(tym < tz0) { entry = entry | 2; }

		}

		return entry;

	}

	/**
	 * Finds the next octant that intersects with the ray based on the exit plane of
	 * the current one.
	 *
	 * @method findNextOctant
	 * @private
	 * @static
	 * @param {Number} currentOctant - The index of the current octant.
	 * @param {Number} tx1 - Ray projection parameter.
	 * @param {Number} ty1 - Ray projection parameter.
	 * @param {Number} tz1 - Ray projection parameter.
	 * @return {Number} The index of the next octant that the ray travels through.
	 */

	function findNextOctant(currentOctant, tx1, ty1, tz1) {

		let min;
		let exit = 0;

		// Find the exit plane.
		if(tx1 < ty1) {

			min = tx1;
			exit = 0; // YZ-plane.

		} else {

			min = ty1;
			exit = 1; // XZ-plane.

		}

		if(tz1 < min) {

			exit = 2; // XY-plane.

		}

		return octantTable[currentOctant][exit];

	}

	/**
	 * Finds all octants that intersect with the given ray.
	 *
	 * @method raycastOctant
	 * @private
	 * @static
	 * @param {Octant} octant - The current octant.
	 * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.
	 * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.
	 * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.
	 * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.
	 * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.
	 * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with the intersecting octants.
	 */

	function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

		const children = octant.children;

		let currentOctant;
		let txm, tym, tzm;

		if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

			if(children === null) {

				// Leaf.
				intersects.push(octant);

			} else {

				// Compute means.
				txm = 0.5 * (tx0 + tx1);
				tym = 0.5 * (ty0 + ty1);
				tzm = 0.5 * (tz0 + tz1);

				currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

				do {

					/* The possibilities for the next node are passed in the same respective
					 * order as the t-values. Hence, if the first value is found to be the
					 * greatest, the fourth one will be returned. If the second value is the
					 * greatest, the fifth one will be returned, etc.
					 */

					switch(currentOctant) {

						case 0:
							raycastOctant(children[flags[8]], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
							break;

						case 1:
							raycastOctant(children[flags[8] ^ flags[1]], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
							break;

						case 2:
							raycastOctant(children[flags[8] ^ flags[2]], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
							break;

						case 3:
							raycastOctant(children[flags[8] ^ flags[3]], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
							break;

						case 4:
							raycastOctant(children[flags[8] ^ flags[4]], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
							break;

						case 5:
							raycastOctant(children[flags[8] ^ flags[5]], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
							break;

						case 6:
							raycastOctant(children[flags[8] ^ flags[6]], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);
							currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
							break;

						case 7:
							raycastOctant(children[flags[8] ^ flags[7]], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);
							// Far top right octant. No other octants can be reached from here.
							currentOctant = 8;
							break;

					}

				} while(currentOctant < 8);

			}

		}

	}

	/**
	 * An octree raycaster.
	 *
	 * Based on:
	 *  "An Efficient Parametric Algorithm for Octree Traversal"
	 *  by J. Revelles et al. (2000).
	 *
	 * @class OctreeRaycaster
	 * @submodule core
	 * @static
	 */

	class OctreeRaycaster {

		/**
		 * Finds the octants that intersect with the given ray. The intersecting
		 * octants are sorted by distance, closest first.
		 *
		 * @method intersectOctree
		 * @static
		 * @param {Octree} octree - An octree.
		 * @param {Raycaster} raycaster - A raycaster.
		 * @param {Array} intersects - A list to be filled with intersecting octants.
		 */

		static intersectOctree(octree, raycaster, intersects) {

			const dimensions = octree.getDimensions();
			const halfDimensions = dimensions.clone().multiplyScalar(0.5);

			// Translate the octree extents to the center of the octree.
			const min = octree.min.clone().sub(octree.min);
			const max = octree.max.clone().sub(octree.min);

			const direction = raycaster.ray.direction.clone();
			const origin = raycaster.ray.origin.clone();

			// Translate the ray to the center of the octree.
			origin.sub(octree.getCenter()).add(halfDimensions);

			let invDirX, invDirY, invDirZ;
			let tx0, tx1, ty0, ty1, tz0, tz1;

			// Reset the last byte.
			flags[8] = flags[0];

			// Handle rays with negative directions.
			if(direction.x < 0.0) {

				origin.x = dimensions.x - origin.x;
				direction.x = -direction.x;
				flags[8] |= flags[4];

			}

			if(direction.y < 0.0) {

				origin.y = dimensions.y - origin.y;
				direction.y = -direction.y;
				flags[8] |= flags[2];

			}

			if(direction.z < 0.0) {

				origin.z = dimensions.z - origin.z;
				direction.z = -direction.z;
				flags[8] |= flags[1];

			}

			// Improve IEEE double stability.
			invDirX = 1.0 / direction.x;
			invDirY = 1.0 / direction.y;
			invDirZ = 1.0 / direction.z;

			// Project the ray to the root's boundaries.
			tx0 = (min.x - origin.x) * invDirX;
			tx1 = (max.x - origin.x) * invDirX;
			ty0 = (min.y - origin.y) * invDirY;
			ty1 = (max.y - origin.y) * invDirY;
			tz0 = (min.z - origin.z) * invDirZ;
			tz1 = (max.z - origin.z) * invDirZ;

			// Check if the ray hits the octree.
			if(Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {

				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);

			}

		}

	}

	/**
	 * An octree that subdivides space for fast spatial searches.
	 *
	 * @class Octree
	 * @submodule core
	 * @constructor
	 * @param {Vector3} [min] - The lower bounds of the tree.
	 * @param {Vector3} [max] - The upper bounds of the tree.
	 */

	class Octree {

		constructor(min, max) {

			/**
			 * The root octant.
			 *
			 * @property root
			 * @type Octant
			 * @default null
			 */

			this.root = (min !== undefined && max !== undefined) ? new Octant(min, max) : null;

		}

		/**
		 * The lower bounds of the root octant.
		 *
		 * @property min
		 * @type Vector3
		 */

		get min() { return this.root.min; }

		/**
		 * The upper bounds of the root octant.
		 *
		 * @property max
		 * @type Vector3
		 */

		get max() { return this.root.max; }

		/**
		 * The children of the root octant.
		 *
		 * @property children
		 * @type Array
		 */

		get children() { return this.root.children; }

		/**
		 * Calculates the center of this octree.
		 *
		 * @method getCenter
		 * @return {Vector3} A new vector that describes the center of this octree.
		 */

		getCenter() { return this.root.getCenter(); }

		/**
		 * Calculates the size of this octree.
		 *
		 * @method getDimensions
		 * @return {Vector3} A new vector that describes the size of this octree.
		 */

		getDimensions() { return this.root.getDimensions(); }

		/**
		 * Calculates the current depth of this octree.
		 *
		 * @method getDepth
		 * @return {Number} The depth.
		 */

		getDepth() {

			let h0 = [this.root];
			let h1 = [];

			let depth = 0;
			let octant, children;

			while(h0.length > 0) {

				octant = h0.pop();
				children = octant.children;

				if(children !== null) {

					h1.push(...children);

				}

				if(h0.length === 0) {

					h0 = h1;
					h1 = [];

					if(h0.length > 0) { ++depth; }

				}

			}

			return depth;

		}

		/**
		 * Collects octants that lie inside the specified region.
		 *
		 * @method cull
		 * @param {Frustum|Box3} region - A frustum or a bounding box.
		 * @return {Array} The octants.
		 */

		cull(region) {

			const result = [];
			const heap = [this.root];
			const box = new Box3$1();

			let octant, children;

			while(heap.length > 0) {

				octant = heap.pop();
				children = octant.children;

				// Cache the computed max vector of cubic octants.
				box.min = octant.min;
				box.max = octant.max;

				if(region.intersectsBox(box)) {

					if(children !== null) {

						heap.push(...children);

					} else {

						result.push(octant);

					}

				}

			}

			return result;

		}

		/**
		 * Fetches all octants with the specified depth level.
		 *
		 * @method findOctantsByLevel
		 * @param {Number} level - The depth level.
		 * @return {Array} The octants.
		 */

		findOctantsByLevel(level) {

			const result = [];

			let h0 = [this.root];
			let h1 = [];

			let octant, children;
			let currentLevel = 0;

			while(h0.length > 0) {

				octant = h0.pop();
				children = octant.children;

				if(currentLevel === level) {

					result.push(octant);

				} else if(children !== null) {

					h1.push(...children);

				}

				if(h0.length === 0) {

					h0 = h1;
					h1 = [];

					if(++currentLevel > level) { break; }

				}

			}

			return result;

		}

		/**
		 * Finds the octants that intersect with the given ray. The intersecting
		 * octants are sorted by distance, closest first.
		 *
		 * @method raycast
		 * @param {Raycaster} raycaster - A raycaster.
		 * @param {Array} [intersects] - A list to be filled with intersecting octants.
		 */

		raycast(raycaster, intersects = []) {

			OctreeRaycaster.intersectOctree(this, raycaster, intersects);

		}

	}

	/**
	 * Core components.
	 *
	 * @module sparse-octree
	 * @submodule core
	 */

	/**
	 * Math components.
	 *
	 * @module sparse-octree
	 * @submodule math
	 */

	/**
	 * An octant that maintains points.
	 *
	 * @class PointOctant
	 * @submodule points
	 * @extends Octant
	 * @constructor
	 * @param {Vector3} min - The lower bounds.
	 * @param {Vector3} max - The upper bounds.
	 */

	class PointOctant extends Octant {

		constructor(min, max) {

			super(min, max);

			/**
			 * The points that are inside this octant.
			 *
			 * @property points
			 * @type Array
			 */

			this.points = null;

			/**
			 * Point data.
			 *
			 * @property data
			 * @type Array
			 */

			this.data = null;

		}

		/**
		 * Counts how many points are in this octant.
		 *
		 * @method countPoints
		 * @return {Number} The amount of points.
		 */

		countPoints() {

			const heap = [this];

			let result = 0;
			let octant, children;

			while(heap.length > 0) {

				octant = heap.pop();
				children = octant.children;

				if(children !== null) {

					heap.push(...children);

				} else if(octant.points !== null) {

					result += octant.points.length;

				}

			}

			return result;

		}

		/**
		 * Computes the distance squared from this octant to the given point.
		 *
		 * @method distanceToSquared
		 * @param {Vector3} p - A point.
		 * @return {Number} The distance squared.
		 */

		distanceToSquared(p) {

			const clampedPoint = p.clone().clamp(this.min, this.max);

			return clampedPoint.sub(p).lengthSq();

		}

		/**
		 * Computes the distance squared from the center of this octant to the given
		 * point.
		 *
		 * @method distanceToCenterSquared
		 * @param {Vector3} p - A point.
		 * @return {Number} The distance squared.
		 */

		distanceToCenterSquared(p) {

			const center = this.getCenter();

			const dx = p.x - center.x;
			const dy = p.y - center.x;
			const dz = p.z - center.z;

			return dx * dx + dy * dy + dz * dz;

		}

		/**
		 * Checks if the given point lies inside this octant's boundaries.
		 *
		 * This method can also be used to check if this octant intersects a sphere by
		 * providing a radius as bias.
		 *
		 * @method contains
		 * @param {Vector3} p - A point.
		 * @param {Number} bias - A padding that extends the boundaries temporarily.
		 * @return {Boolean} Whether the given point lies inside this octant.
		 */

		contains(p, bias) {

			const min = this.min;
			const max = this.max;

			return (
				p.x >= min.x - bias &&
				p.y >= min.y - bias &&
				p.z >= min.z - bias &&
				p.x <= max.x + bias &&
				p.y <= max.y + bias &&
				p.z <= max.z + bias
			);

		}

		/**
		 * Redistributes existing points to child octants.
		 *
		 * @method redistribute
		 * @param {Number} bias - A proximity threshold.
		 */

		redistribute(bias) {

			const children = this.children;
			const points = this.points;

			let i, l;
			let child, point, data;

			if(children !== null) {

				while(points.length > 0) {

					point = points.pop();
					data = this.data.pop();

					for(i = 0, l = children.length; i < l; ++i) {

						child = children[i];

						if(child.contains(point, bias)) {

							if(child.points === null) {

								child.points = [];
								child.data = [];

							}

							child.points.push(point);
							child.data.push(data);

							break;

						}

					}

				}

			}

			this.points = null;
			this.data = null;

		}

		/**
		 * Gathers all points from the children. The children are expected to be leaf
		 * octants and will be dropped afterwards.
		 *
		 * @method merge
		 * @private
		 */

		merge() {

			const children = this.children;

			let i, l;
			let child;

			if(children !== null) {

				this.points = [];
				this.data = [];

				for(i = 0, l = children.length; i < l; ++i) {

					child = children[i];

					if(child.points !== null) {

						this.points.push(...child.points);
						this.data.push(...child.data);

					}

				}

				this.children = null;

			}

		}

		/**
		 * Finds the closest point to the given one.
		 *
		 * @method findNearestPoint
		 * @param {Vector3} p - The point.
		 * @param {Number} maxDistance - The maximum distance.
		 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
		 * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
		 */

		findNearestPoint(p, maxDistance, skipSelf) {

			const points = this.points;
			const children = this.children;

			let result = null;
			let bestDist = maxDistance;

			let i, l;
			let point, distSq;

			let sortedChildren;
			let child, childResult;

			if(children !== null) {

				// Sort the children.
				sortedChildren = children.map(function(child) {

					// Precompute distances.
					return {
						octant: child,
						distance: child.distanceToCenterSquared(p)
					};

				}).sort(function(a, b) {

					// Smallest distance to p first, ASC.
					return a.distance - b.distance;

				});

				// Traverse from closest to furthest.
				for(i = 0, l = sortedChildren.length; i < l; ++i) {

					// Unpack octant.
					child = sortedChildren[i].octant;

					if(child.contains(p, bestDist)) {

						childResult = child.findNearestPoint(p, bestDist, skipSelf);

						if(childResult !== null) {

							distSq = childResult.point.distanceToSquared(p);

							if((!skipSelf || distSq > 0.0) && distSq < bestDist) {

								bestDist = distSq;
								result = childResult;

							}

						}

					}

				}

			} else if(points !== null) {

				for(i = 0, l = points.length; i < l; ++i) {

					point = points[i];
					distSq = p.distanceToSquared(point);

					if((!skipSelf || distSq > 0.0) && distSq < bestDist) {

						bestDist = distSq;

						result = {
							point: point.clone(),
							data: this.data[i]
						};

					}

				}

			}

			return result;

		}

		/**
		 * Finds points that are inside the specified radius around a given position.
		 *
		 * @method findPoints
		 * @param {Vector3} p - A position.
		 * @param {Number} r - A radius.
		 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
		 * @param {Array} result - An array to be filled with objects, each containing a point and a data property.
		 */

		findPoints(p, r, skipSelf, result) {

			const points = this.points;
			const children = this.children;
			const rSq = r * r;

			let i, l;

			let point, distSq;
			let child;

			if(children !== null) {

				for(i = 0, l = children.length; i < l; ++i) {

					child = children[i];

					if(child.contains(p, r)) {

						child.findPoints(p, r, skipSelf, result);

					}

				}

			} else if(points !== null) {

				for(i = 0, l = points.length; i < l; ++i) {

					point = points[i];
					distSq = p.distanceToSquared(point);

					if((!skipSelf || distSq > 0.0) && distSq <= rSq) {

						result.push({
							point: point.clone(),
							data: this.data[i]
						});

					}

				}

			}

		}

	}

	/**
	 * An octree that manages points.
	 *
	 * @class PointOctree
	 * @submodule points
	 * @extends Octree
	 * @constructor
	 * @param {Vector3} min - The lower bounds of the tree.
	 * @param {Vector3} max - The upper bounds of the tree.
	 * @param {Number} [bias=0.0] - A threshold for proximity checks.
	 * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
	 * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
	 */

	/**
	 * Point-oriented octree components.
	 *
	 * @module sparse-octree
	 * @submodule points
	 */

	/**
	 * Exposure of the library components.
	 *
	 * @module sparse-octree
	 * @main sparse-octree
	 */

	/**
	 * An enumeration of density constants.
	 *
	 * @class Density
	 * @submodule volume
	 * @static
	 */

	const Density = {

		/**
		 * The index for empty space.
		 *
		 * @property HOLLOW
		 * @type Number
		 * @static
		 * @final
		 */

		HOLLOW: 0,

		/**
		 * The default index for solid material.
		 *
		 * @property SOLID
		 * @type Number
		 * @static
		 * @final
		 */

		SOLID: 1

	};

	/**
	 * Stores edge data separately for each dimension.
	 *
	 * With a grid resolution N, there are 3 * (N + 1)² * N edges in total, but
	 * the number of edges that actually contain the volume's surface is usually
	 * much lower.
	 *
	 * @class EdgeData
	 * @submodule volume
	 * @constructor
	 * @param {Number} n - The grid resolution.
	 */

	class EdgeData {

		constructor(n) {

			const c = Math.pow((n + 1), 2) * n;

			/**
			 * The edges.
			 *
			 * Edges are stored as starting grid point indices in ascending order. The
			 * ending point indices are implicitly defined through the dimension split:
			 *
			 * Given a starting point index A, the ending point index B for the X-, Y-
			 * and Z-plane is defined as A + 1, A + N and A + N² respectively where N is
			 * the grid resolution + 1.
			 *
			 * @property edges
			 * @type Array
			 */

			this.edges = [
				new Uint32Array(c),
				new Uint32Array(c),
				new Uint32Array(c)
			];

			/**
			 * The Zero Crossing interpolation values.
			 *
			 * Each value describes the relative surface intersection position on the
			 * respective edge. The values correspond to the order of the edges.
			 *
			 * @property zeroCrossings
			 * @type Array
			 */

			this.zeroCrossings = [
				new Float32Array(c),
				new Float32Array(c),
				new Float32Array(c)
			];

			/**
			 * The surface intersection normals.
			 *
			 * The vectors are stored as [x, y, z] float triples and correspond to the
			 * order of the edges.
			 *
			 * @property normals
			 * @type Array
			 */

			this.normals = [
				new Float32Array(c * 3),
				new Float32Array(c * 3),
				new Float32Array(c * 3)
			];

		}

		/**
		 * Creates a list of transferable items.
		 *
		 * @method createTransferList
		 * @param {Array} [transferList] - An existing list to be filled with transferable items.
		 * @return {Array} A transfer list.
		 */

		createTransferList(transferList = []) {

			const arrays = [

				this.edges[0],
				this.edges[1],
				this.edges[2],

				this.zeroCrossings[0],
				this.zeroCrossings[1],
				this.zeroCrossings[2],

				this.normals[0],
				this.normals[1],
				this.normals[2]

			];

			let array;

			while(arrays.length > 0) {

				array = arrays.pop();

				if(array !== null) {

					transferList.push(array.buffer);

				}

			}

			return transferList;

		}

		/**
		 * Serialises this data.
		 *
		 * @method serialise
		 * @return {Object} The serialised version of the data.
		 */

		serialise() {

			return {
				edges: this.edges,
				zeroCrossings: this.zeroCrossings,
				normals: this.normals
			};

		}

		/**
		 * Adopts the given serialised data.
		 *
		 * @method deserialise
		 * @param {Object} data - Serialised data.
		 */

		deserialise(data) {

			this.edges = data.edges;
			this.zeroCrossings = data.zeroCrossings;
			this.normals = data.normals;

		}

	}

	/**
	 * The material grid resolution.
	 *
	 * @property resolution
	 * @type Number
	 * @private
	 * @static
	 * @default 0
	 */

	let resolution = 0;

	/**
	 * The total amount of grid point indices.
	 *
	 * @property indexCount
	 * @type Number
	 * @private
	 * @static
	 * @default 0
	 */

	let indexCount = 0;

	/**
	 * Hermite data.
	 *
	 * @class HermiteData
	 * @submodule volume
	 * @constructor
	 * @param {Boolean} [initialise=true] - Whether the data should be initialised immediately.
	 */

	class HermiteData {

		constructor(initialise = true) {

			/**
			 * The current level of detail.
			 *
			 * @property lod
			 * @type Number
			 * @default -1
			 */

			this.lod = -1;

			/**
			 * Indicates whether this data is currently gone.
			 *
			 * @property neutered
			 * @type Boolean
			 * @default false
			 */

			this.neutered = false;

			/**
			 * Describes how many material indices are currently solid:
			 *
			 * - The chunk lies outside the volume if there are no solid grid points.
			 * - The chunk lies completely inside the volume if all points are solid.
			 *
			 * @property materials
			 * @type Number
			 * @default 0
			 */

			this.materials = 0;

			/**
			 * The grid points.
			 *
			 * @property materialIndices
			 * @type Uint8Array
			 */

			this.materialIndices = initialise ? new Uint8Array(indexCount) : null;

			/**
			 * Run-length compression data.
			 *
			 * @property runLengths
			 * @type Uint32Array
			 * @default null
			 */

			this.runLengths = null;

			/**
			 * The edge data.
			 *
			 * @property edgeData
			 * @type EdgeData
			 * @default null
			 */

			this.edgeData = null;

		}

		/**
		 * Indicates whether this data container is empty.
		 *
		 * @property empty
		 * @type Boolean
		 */

		get empty() { return (this.materials === 0); }

		/**
		 * Indicates whether this data container is full.
		 *
		 * @property full
		 * @type Boolean
		 */

		get full() { return (this.materials === indexCount); }

		/**
		 * Compresses this data.
		 *
		 * @method compress
		 * @chainable
		 * @return {HermiteData} This data.
		 */

		compress() {

			let encoding;

			if(this.runLengths === null) {

				if(this.full) {

					encoding = {
						runLengths: [this.materialIndices.length],
						data: [Density.SOLID]
					};

				} else {

					encoding = RunLengthEncoder.encode(this.materialIndices);

				}

				this.runLengths = new Uint32Array(encoding.runLengths);
				this.materialIndices = new Uint8Array(encoding.data);

			}

			return this;

		}

		/**
		 * Decompresses this data.
		 *
		 * @method decompress
		 * @chainable
		 * @return {HermiteData} This data.
		 */

		decompress() {

			if(this.runLengths !== null) {

				this.materialIndices = RunLengthEncoder.decode(
					this.runLengths, this.materialIndices, new Uint8Array(indexCount)
				);

				this.runLengths = null;

			}

			return this;

		}

		/**
		 * Sets the specified material index.
		 *
		 * @method setMaterialIndex
		 * @param {Number} index - The index of the material index that should be updated.
		 * @param {Number} value - The new material index.
		 */

		setMaterialIndex(index, value) {

			// Keep track of how many material indices are solid.
			if(this.materialIndices[index] === Density.HOLLOW && value !== Density.HOLLOW) {

				++this.materials;

			} else if(this.materialIndices[index] !== Density.HOLLOW && value === Density.HOLLOW) {

				--this.materials;

			}

			this.materialIndices[index] = value;

		}

		/**
		 * Creates a list of transferable items.
		 *
		 * @method createTransferList
		 * @param {Array} [transferList] - An existing list to be filled with transferable items.
		 * @return {Array} A transfer list.
		 */

		createTransferList(transferList = []) {

			if(this.edgeData !== null) { this.edgeData.createTransferList(transferList); }

			transferList.push(this.materialIndices.buffer);
			transferList.push(this.runLengths.buffer);

			return transferList;

		}

		/**
		 * Serialises this data.
		 *
		 * @method serialise
		 * @return {Object} The serialised version of the data.
		 */

		serialise() {

			this.neutered = true;

			return {
				lod: this.lod,
				materials: this.materials,
				materialIndices: this.materialIndices,
				runLengths: this.runLengths,
				edgeData: (this.edgeData !== null) ? this.edgeData.serialise() : null
			};

		}

		/**
		 * Adopts the given serialised data.
		 *
		 * @method deserialise
		 * @param {Object} data - Serialised data.
		 */

		deserialise(data) {

			this.lod = data.lod;
			this.materials = data.materials;

			this.materialIndices = data.materialIndices;
			this.runLengths = data.runLengths;

			if(data.edgeData !== null) {

				if(this.edgeData === null) {

					this.edgeData = new EdgeData(0);

				}

				this.edgeData.deserialise(data.edgeData);

			} else {

				this.edgeData = null;

			}

			this.neutered = false;

		}

		/**
		 * The material grid resolution.
		 *
		 * @property resolution
		 * @type Number
		 * @static
		 */

		static get resolution() { return resolution; }

		static set resolution(x) {

			if(resolution === 0) {

				resolution = Math.max(1, Math.min(256, x));
				indexCount = Math.pow((resolution + 1), 3);

			}

		}

	}

	/**
	 * A cubic volume chunk.
	 *
	 * @class Chunk
	 * @submodule octree
	 * @extends CubicOctant
	 * @constructor
	 * @param {Vector3} min - The lower bounds.
	 * @param {Vector3} max - The size.
	 */

	class Chunk extends CubicOctant {

		constructor(min, size) {

			super(min, size);

			/**
			 * Hermite data.
			 *
			 * @property data
			 * @type HermiteData
			 * @default null
			 */

			this.data = null;

			/**
			 * A CSG operation queue.
			 *
			 * @property csg
			 * @type Queue
			 * @default null
			 */

			this.csg = null;

		}

		/**
		 * The material grid resolution of all volume chunks. The upper limit is 256.
		 *
		 * The effective resolution of a chunk is the distance between two adjacent
		 * grid points in global coordinates.
		 *
		 * This value can only be set once.
		 *
		 * @property resolution
		 * @type Number
		 */

		get resolution() { return HermiteData.resolution; }

		set resolution(x) { HermiteData.resolution = x; }

		/**
		 * Creates a list of transferable items.
		 *
		 * @method createTransferList
		 * @param {Array} [transferList] - An existing list to be filled with transferable items.
		 * @return {Array} A transfer list.
		 */

		createTransferList(transferList = []) {

			return (this.data !== null) ? this.data.createTransferList(transferList) : transferList;

		}

		/**
		 * Serialises this chunk.
		 *
		 * @method serialise
		 * @return {Object} A serialised description of this chunk.
		 */

		serialise() {

			return {
				resolution: this.resolution,
				min: this.min.toArray(),
				size: this.size,
				data: (this.data !== null) ? this.data.serialise() : null
			};

		}

		/**
		 * Adopts the given serialised data.
		 *
		 * @method deserialise
		 * @param {Object} chunk - A serialised description.
		 */

		deserialise(chunk) {

			this.resolution = chunk.resolution;
			this.min.fromArray(chunk.min);
			this.size = chunk.size;

			if(chunk.data !== null) {

				if(this.data === null) {

					this.data = new HermiteData(false);

				}

				this.data.deserialise(chunk.data);

			} else {

				this.data = null;

			}

		}

	}

	/**
	 * Rounds the given number up to the next power of two.
	 *
	 * @method ceil2
	 * @private
	 * @static
	 * @param {Number} n - A number.
	 * @return {Number} The next power of two.
	 */

	function ceil2(n) { return Math.pow(2, Math.max(0, Math.ceil(Math.log2(n)))); }

	/**
	 * A cubic octree that maintains volume chunks.
	 *
	 * @class Volume
	 * @submodule octree
	 * @extends Octree
	 * @constructor
	 * @param {Number} [chunkSize=32] - The size of leaf chunks. Will be rounded up to the next power of two.
	 * @param {Number} [resolution=32] - The data resolution of leaf chunks. Will be rounded up to the next power of two. The upper limit is 256.
	 */

	class Volume extends Octree {

		constructor(chunkSize = 32, resolution = 32) {

			super();

			this.root = new Chunk();

			/**
			 * The size of a volume chunk.
			 *
			 * @property chunkSize
			 * @type Number
			 * @private
			 * @default 32
			 */

			this.chunkSize = Math.max(1, ceil2(chunkSize));

			this.min.subScalar(this.chunkSize * 2);
			this.size = this.chunkSize * 4;

			this.root.resolution = ceil2(resolution);

		}

		/**
		 * The size of the root octant.
		 *
		 * @property size
		 * @type Number
		 */

		get size() { return this.root.size; }

		set size(x) { this.root.size = x; }

		/**
		 * The resolution of the volume data.
		 *
		 * @property resolution
		 * @type Number
		 */

		get resolution() { return this.root.resolution; }

		/**
		 * Collects all chunks that contain volume data.
		 *
		 * @method getChunks
		 * @return {Array} A list of all chunks that contain volume data.
		 */

		getChunks() {

			const heap = [this.root];
			const result = [];

			let octant, children;

			while(heap.length > 0) {

				octant = heap.pop();
				children = octant.children;

				if(octant.data !== null || octant.csg !== null) {

					result.push(octant);

				} else if(children !== null) {

					heap.push(...children);

				}

			}

			return result;

		}

		/**
		 * Edits this volume.
		 *
		 * @method edit
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {Array} The chunks that lie inside the operation's region, including newly created ones.
		 */

		edit(sdf) {

			const heap = [this.root];
			const region = sdf.completeBoundingBox;

			let result = [];
			let octant, children;

			if(sdf.operation === OperationType.UNION) {

				this.expand(region);

				// Find and create leaf chunks.
				while(heap.length > 0) {

					octant = heap.pop();
					children = octant.children;

					if(region.intersectsBox(octant)) {

						if(children !== null) {

							heap.push(...children);

						} else if(octant.size > this.chunkSize) {

							octant.split();
							heap.push(...octant.children);

						} else {

							result.push(octant);

						}

					}

				}

			} else if(sdf.operation === OperationType.DIFFERENCE) {

				// Chunks that don't exist can't become more empty.
				result = this.cull(region);

			} else {

				// Intersections affect all chunks.
				result = this.getChunks();

			}

			return result;

		}

		/**
		 * Expands the volume to include the given region.
		 *
		 * @method expand
		 * @private
		 * @param {Box3} region - A region.
		 */

		expand(region) {

			const min = region.min;
			const max = region.max;

			const m = Math.max(
				Math.max(Math.max(Math.abs(min.x), Math.abs(min.y)), Math.abs(min.z)),
				Math.max(Math.max(Math.abs(max.x), Math.abs(max.y)), Math.abs(max.z))
			);

			let s = this.size / 2;
			let originalChildren = this.children;

			let n, i;

			if(m > s) {

				// Find an appropriate target size.
				n = ceil2(Math.ceil(m / this.chunkSize) * this.chunkSize);

				if(originalChildren === null) {

					// Expand the root's boundaries.
					this.min.set(-n, -n, -n);
					this.size = 2 * n;

				} else {

					// Repeatedly double the octree size and create intermediate octants.
					while(s < n) {

						s = this.size;

						this.min.multiplyScalar(2);
						this.size *= 2;

						// Create new children.
						this.root.split();

						// Connect them with the old children.
						for(i = 0; i < 8; ++i) {

							// But only if they actually contain deeper structures.
							if(originalChildren[i].children !== null) {

								this.children[i].split([originalChildren[i]]);

							}

						}

						originalChildren = this.children;

					}

				}

			}

		}

		/**
		 * Removes the given chunk and shrinks the volume if possible.
		 *
		 * @method prune
		 * @param {Chunk} chunk - A chunk to remove.
		 * @todo
		 */

		prune(chunk) {

		}

		/**
		 * Loads a volume.
		 *
		 * @method load
		 * @param {String} data - The volume data to import.
		 */

		load(data) {

			Chunk.resolution = data.resolution;
			this.chunkSize = data.chunkSize;
			this.root = data.root;

		}

		/**
		 * Creates a compact representation of the current volume data.
		 *
		 * @method toJSON
		 * @return {Object} A concise representation of this volume.
		 */

		toJSON() {

			return {
				resolution: Chunk.resolution,
				chunkSize: this.chunkSize,
				root: this.root
			};

		}

	}

	/**
	 * An enumeration of SDF types.
	 *
	 * @class SDFType
	 * @submodule sdf
	 * @static
	 */

	const SDFType = {

		/**
		 * A sphere description.
		 *
		 * @property SPHERE
		 * @type String
		 * @static
		 * @final
		 */

		SPHERE: "sdf.sphere",

		/**
		 * A box description.
		 *
		 * @property BOX
		 * @type String
		 * @static
		 * @final
		 */

		BOX: "sdf.box",

		/**
		 * A torus description.
		 *
		 * @property TORUS
		 * @type String
		 * @static
		 * @final
		 */

		TORUS: "sdf.torus",

		/**
		 * A plane description.
		 *
		 * @property PLANE
		 * @type String
		 * @static
		 * @final
		 */

		PLANE: "sdf.plane",

		/**
		 * A heightfield description.
		 *
		 * @property HEIGHTFIELD
		 * @type String
		 * @static
		 * @final
		 */

		HEIGHTFIELD: "sdf.heightfield"

	};

	/**
	 * A vector with three components.
	 *
	 * @class Vector3
	 * @submodule math
	 * @constructor
	 * @param {Number} [x=0] - The x value.
	 * @param {Number} [y=0] - The y value.
	 * @param {Number} [z=0] - The z value.
	 */

	class Vector3$2 {

		constructor(x = 0, y = 0, z = 0) {

			/**
			 * The x component.
			 *
			 * @property x
			 * @type Number
			 */

			this.x = x;

			/**
			 * The y component.
			 *
			 * @property y
			 * @type Number
			 */

			this.y = y;

			/**
			 * The z component.
			 *
			 * @property z
			 * @type Number
			 */

			this.z = z;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @method set
		 * @chainable
		 * @param {Number} x - The x value.
		 * @param {Number} y - The y value.
		 * @param {Number} z - The z value.
		 * @return {Vector3} This vector.
		 */

		set(x, y, z) {

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @method copy
		 * @chainable
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		}

		/**
		 * Copies values from an array.
		 *
		 * @method fromArray
		 * @chainable
		 * @param {Array} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector3} This vector.
		 */

		fromArray(array, offset) {

			if(offset === undefined) { offset = 0; }

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @method toArray
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Vector3} The array.
		 */

		toArray(array, offset) {

			if(array === undefined) { array = []; }
			if(offset === undefined) { offset = 0; }

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;

			return array;

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @method equals
		 * @param {Vector3} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y && v.z === this.z);

		}

		/**
		 * Clones this vector.
		 *
		 * @method clone
		 * @return {Vector3} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z);

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @method add
		 * @chainable
		 * @param {Vector3} v - The vector to add.
		 * @return {Vector3} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @method addScaledVector
		 * @chainable
		 * @param {Vector3} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @method addScalar
		 * @chainable
		 * @param {Number} s - The scalar to add.
		 * @return {Vector3} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @method addVectors
		 * @chainable
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @method sub
		 * @chainable
		 * @param {Vector3} v - The vector to subtract.
		 * @return {Vector3} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		}

		/**
		 * Subtracts a scalar to this vector.
		 *
		 * @method subScalar
		 * @chainable
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector3} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @method subVectors
		 * @chainable
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - A second vector.
		 * @return {Vector3} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @method multiply
		 * @chainable
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @method multiplyScalar
		 * @chainable
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		multiplyScalar(s) {

			if(isFinite(s)) {

				this.x *= s;
				this.y *= s;
				this.z *= s;

			} else {

				this.x = 0;
				this.y = 0;
				this.z = 0;

			}

			return this;

		}

		/**
		 * Sets this vector to the product of two given vectors.
		 *
		 * @method multiplyVectors
		 * @chainable
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		multiplyVectors(a, b) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @method divide
		 * @chainable
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @method divideScalar
		 * @chainable
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		divideScalar(s) {

			return this.multiplyScalar(1 / s);

		}

		/**
		 * Sets this vector to the quotient of two given vectors.
		 *
		 * @method divideVectors
		 * @chainable
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		divideVectors(a, b) {

			this.x = a.x / b.x;
			this.y = a.y / b.y;
			this.z = a.z / b.z;

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @method negate
		 * @chainable
		 * @return {Vector3} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @method dot
		 * @param {Vector3} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @method lengthSq
		 * @return {Number} The squared length.
		 */

		lengthSq() {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @method length
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @method distanceTo
		 * @param {Vector3} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @method distanceToSquared
		 * @param {Vector3} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;
			const dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		}

		/**
		 * Normalizes this vector.
		 *
		 * @method normalize
		 * @chainable
		 * @return {Vector3} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @method min
		 * @chainable
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);

			return this;

		}

		/**
		 * adopts the max value for each component of this vector and the given one.
		 *
		 * @method max
		 * @chainable
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @method clamp
		 * @chainable
		 * @param {Vector3} min - A vector, assumed to be smaller than max.
		 * @param {Vector3} max - A vector, assumed to be greater than min.
		 * @return {Vector3} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));
			this.z = Math.max(min.z, Math.min(max.z, this.z));

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @method applyMatrix3
		 * @chainable
		 * @param {Matrix3} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix3(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[3] * y + e[6] * z;
			this.y = e[1] * x + e[4] * y + e[7] * z;
			this.z = e[2] * x + e[5] * y + e[8] * z;

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @method applyMatrix4
		 * @chainable
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix4(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

			return this;

		}

	}

	/**
	 * A bounding box.
	 *
	 * @class Box3
	 * @submodule math
	 * @constructor
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	class Box3$2 {

		constructor(
			min = new Vector3$2(Infinity, Infinity, Infinity),
			max = new Vector3$2(-Infinity, -Infinity, -Infinity)
		) {

			/**
			 * The min bounds.
			 *
			 * @property min
			 * @type Vector3
			 */

			this.min = min;

			/**
			 * The max bounds.
			 *
			 * @property max
			 * @type Vector3
			 */

			this.max = max;

		}

		/**
		 * Sets the values of this box.
		 *
		 * @method set
		 * @param {Number} min - The min bounds.
		 * @param {Number} max - The max bounds.
		 * @return {Matrix3} This box.
		 */

		set(min, max) {

			this.min.copy(min);
			this.max.copy(max);

			return this;

		}

		/**
		 * Copies the values of a given box.
		 *
		 * @method copy
		 * @param {Matrix3} b - A box.
		 * @return {Box3} This box.
		 */

		copy(b) {

			this.min.copy(b.min);
			this.max.copy(b.max);

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @method clone
		 * @return {Matrix3} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Expands this box by the given point.
		 *
		 * @method expandByPoint
		 * @param {Matrix3} p - A point.
		 * @return {Box3} This box.
		 */

		expandByPoint(p) {

			this.min.min(p);
			this.max.max(p);

			return this;

		}

		/**
		 * Expands this box by combining it with the given one.
		 *
		 * @method union
		 * @param {Box3} b - A box.
		 * @return {Box3} This box.
		 */

		union(b) {

			this.min.min(b.min);
			this.max.max(b.max);

			return this;

		}

		/**
		 * Defines this box by the given points.
		 *
		 * @method setFromPoints
		 * @param {Array} points - The points.
		 * @return {Box3} This box.
		 */

		setFromPoints(points) {

			let i, l;

			for(i = 0, l = points.length; i < l; ++i) {

				this.expandByPoint(points[i]);

			}

			return this;

		}

		/**
		 * Defines this box by the given center and size.
		 *
		 * @method setFromCenterAndSize
		 * @param {Vector3} center - The center.
		 * @param {Number} size - The size.
		 * @return {Box3} This box.
		 */

		setFromCenterAndSize(center, size) {

			const halfSize = size.clone().multiplyScalar(0.5);

			this.min.copy(center).sub(halfSize);
			this.max.copy(center).add(halfSize);

			return this;

		}

		/**
		 * Checks if this box intersects with the given one.
		 *
		 * @method intersectsBox
		 * @param {Matrix3} box - A box.
		 * @return {Boolean} Whether the boxes intersect.
		 */

		intersectsBox(box) {

			return !(
				box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y ||
				box.max.z < this.min.z || box.min.z > this.max.z
			);

		}

	}

	/**
	 * A CSG operation.
	 *
	 * @class Operation
	 * @submodule csg
	 * @constructor
	 * @param {OperationType} type - The type of this operation.
	 * @param {Operation} ...children - Child operations.
	 */

	class Operation {

		constructor(type, ...children) {

			/**
			 * The type of this operation.
			 *
			 * @property type
			 * @type OperationType
			 * @default null
			 */

			this.type = type;

			/**
			 * A list of operations.
			 *
			 * Right-hand side operands have precedence, meaning that the result of the
			 * first item in the list will be dominated by the result of the second one,
			 * etc.
			 *
			 * @property children
			 * @type Array
			 * @private
			 */

			this.children = children;

			/**
			 * The bounding box of this operation.
			 *
			 * @property bbox
			 * @type Box3
			 * @private
			 * @default null
			 */

			this.bbox = null;

		}

		/**
		 * The bounding box of this operation.
		 *
		 * @property boundingBox
		 * @type Box3
		 */

		get boundingBox() {

			return (this.bbox !== null) ? this.bbox : this.computeBoundingBox();

		}

		/**
		 * Calculates the bounding box of this operation.
		 *
		 * @method computeBoundingBox
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			const children = this.children;

			let i, l;

			this.bbox = new Box3$2();

			for(i = 0, l = children.length; i < l; ++i) {

				this.bbox.union(children[i].boundingBox);

			}

			return this.bbox;

		}

	}

	/**
	 * A union operation.
	 *
	 * @class Union
	 * @submodule csg
	 * @extends Operation
	 * @constructor
	 * @param {Operation} ...children - Child operations.
	 */

	class Union extends Operation {

		constructor(...children) {

			super(OperationType.UNION, ...children);

		}

		/**
		 * Updates the specified material index.
		 *
		 * @method updateMaterialIndex
		 * @param {Number} index - The index of the material index that needs to be updated.
		 * @param {HermiteData} data0 - The target volume data.
		 * @param {HermiteData} data1 - Predominant volume data.
		 */

		updateMaterialIndex(index, data0, data1) {

			const materialIndex = data1.materialIndices[index];

			if(materialIndex !== Density.HOLLOW) {

				data0.setMaterialIndex(index, materialIndex);

			}

		}

		/**
		 * Selects the edge that is closer to the non-solid grid point.
		 *
		 * @method selectEdge
		 * @param {Edge} edge0 - An existing edge.
		 * @param {Edge} edge1 - A predominant edge.
		 * @param {Boolean} s - Whether the starting point of the edge is solid.
		 * @return {Edge} The selected edge.
		 */

		selectEdge(edge0, edge1, s) {

			return s ?
				((edge0.t > edge1.t) ? edge0 : edge1) :
				((edge0.t < edge1.t) ? edge0 : edge1);

		}

	}

	/**
	 * A difference operation.
	 *
	 * @class Difference
	 * @submodule csg
	 * @extends Operation
	 * @constructor
	 * @param {Operation} ...children - Child operations.
	 */

	class Difference extends Operation {

		constructor(...children) {

			super(OperationType.DIFFERENCE, ...children);

		}

		/**
		 * Updates the specified material index.
		 *
		 * @method updateMaterialIndex
		 * @param {Number} index - The index of the material index that needs to be updated.
		 * @param {HermiteData} data0 - The target volume data.
		 * @param {HermiteData} data1 - Predominant volume data.
		 */

		updateMaterialIndex(index, data0, data1) {

			if(data1.materialIndices[index] !== Density.HOLLOW) {

				data0.setMaterialIndex(index, Density.HOLLOW);

			}

		}

		/**
		 * Selects the edge that is closer to the solid grid point.
		 *
		 * @method selectEdge
		 * @param {Edge} edge0 - An existing edge.
		 * @param {Edge} edge1 - A predominant edge.
		 * @param {Boolean} s - Whether the starting point of the edge is solid.
		 * @return {Edge} The selected edge.
		 */

		selectEdge(edge0, edge1, s) {

			return s ?
				((edge0.t < edge1.t) ? edge0 : edge1) :
				((edge0.t > edge1.t) ? edge0 : edge1);

		}

	}

	/**
	 * An intersection operation.
	 *
	 * @class Intersection
	 * @submodule csg
	 * @extends Operation
	 * @constructor
	 * @param {Operation} ...children - Child operations.
	 */

	class Intersection extends Operation {

		constructor(...children) {

			super(OperationType.INTERSECTION, ...children);

		}

		/**
		 * Updates the specified material index.
		 *
		 * @method updateMaterialIndex
		 * @param {Number} index - The index of the material index that needs to be updated.
		 * @param {HermiteData} data0 - The target volume data.
		 * @param {HermiteData} data1 - Predominant volume data.
		 */

		updateMaterialIndex(index, data0, data1) {

			const materialIndex = data1.materialIndices[index];

			data0.setMaterialIndex(index, (data0.materialIndices[index] !== Density.HOLLOW && materialIndex !== Density.HOLLOW) ? materialIndex : Density.HOLLOW);

		}

		/**
		 * Selects the edge that is closer to the solid grid point.
		 *
		 * @method selectEdge
		 * @param {Edge} edge0 - An existing edge.
		 * @param {Edge} edge1 - A predominant edge.
		 * @param {Boolean} s - Whether the starting point of the edge is solid.
		 * @return {Edge} The selected edge.
		 */

		selectEdge(edge0, edge1, s) {

			return s ?
				((edge0.t < edge1.t) ? edge0 : edge1) :
				((edge0.t > edge1.t) ? edge0 : edge1);

		}

	}

	/**
	 * An operation that describes a density field.
	 *
	 * @class DensityFunction
	 * @submodule csg
	 * @extends Operation
	 * @constructor
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	class DensityFunction extends Operation {

		constructor(sdf) {

			super(OperationType.DENSITY_FUNCTION);

			/**
			 * An SDF.
			 *
			 * @property sdf
			 * @type SignedDistanceFunction
			 * @private
			 */

			this.sdf = sdf;

		}

		/**
		 * Calculates a bounding box for this operation.
		 *
		 * @method computeBoundingBox
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			this.bbox = this.sdf.computeBoundingBox();

			return this.bbox;

		}

		/**
		 * Calculates the material index for the given world position.
		 *
		 * @method generateMaterialIndex
		 * @param {Vector3} position - The world position of the material index.
		 * @return {Number} The material index.
		 */

		generateMaterialIndex(position) {

			return (this.sdf.sample(position) <= 0.0) ? this.sdf.material : Density.HOLLOW;

		}

		/**
		 * Generates surface intersection data for the specified edge.
		 *
		 * @method generateEdge
		 * @param {Edge} edge - The edge that should be processed.
		 */

		generateEdge(edge) {

			edge.approximateZeroCrossing(this.sdf);
			edge.computeSurfaceNormal(this.sdf);

		}

	}

	/**
	 * An abstract Signed Distance Function.
	 *
	 * An SDF describes the signed Euclidean distance to the surface of an object,
	 * effectively describing its density at every point in 3D space. It yields
	 * negative values for points that lie inside the volume and positive values
	 * for points outside. The value is zero at the exact boundary of the object.
	 *
	 * @class SignedDistanceFunction
	 * @submodule sdf
	 * @constructor
	 * @param {SDFType} type - The type of the SDF.
	 * @param {Number} [material=Density.SOLID] - A material index. Must be an integer in the range of 1 to 255.
	 */

	class SignedDistanceFunction {

		constructor(type, material = Density.SOLID) {

			/**
			 * The type of this SDF.
			 *
			 * @property type
			 * @type SDFType
			 * @default null
			 */

			this.type = type;

			/**
			 * The operation type.
			 *
			 * @property operation
			 * @type OperationType
			 * @default null
			 */

			this.operation = null;

			/**
			 * A material index.
			 *
			 * @property material
			 * @type Number
			 * @private
			 * @default Density.SOLID
			 */

			this.material = Math.min(255, Math.max(Density.SOLID, Math.trunc(material)));

			/**
			 * A list of SDFs.
			 *
			 * SDFs can be chained to build CSG expressions.
			 *
			 * @property children
			 * @type Array
			 * @private
			 */

			this.children = [];

			/**
			 * The bounding box of this SDF.
			 *
			 * @property bbox
			 * @type Box3
			 * @private
			 * @default null
			 */

			this.bbox = null;

		}

		/**
		 * The bounding box of this SDF.
		 *
		 * @property boundingBox
		 * @type Box3
		 */

		get boundingBox() {

			return (this.bbox !== null) ? this.bbox : this.computeBoundingBox();

		}

		/**
		 * The complete bounding box of this SDF.
		 *
		 * @property completeBoundingBox
		 * @type Box3
		 */

		get completeBoundingBox() {

			const children = this.children;
			const bbox = this.boundingBox.clone();

			let i, l;

			for(i = 0, l = children.length; i < l; ++i) {

				bbox.union(children[i].completeBoundingBox);

			}

			return bbox;

		}

		/**
		 * Adds the given SDF to this one.
		 *
		 * @method union
		 * @chainable
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {SignedDistanceFunction} This SDF.
		 */

		union(sdf) {

			sdf.operation = OperationType.UNION;
			this.children.push(sdf);

			return this;

		}

		/**
		 * Subtracts the given SDF from this one.
		 *
		 * @method subtract
		 * @chainable
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {SignedDistanceFunction} This SDF.
		 */

		subtract(sdf) {

			sdf.operation = OperationType.DIFFERENCE;
			this.children.push(sdf);

			return this;

		}

		/**
		 * Intersects the given SDF with this one.
		 *
		 * @method intersect
		 * @chainable
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {SignedDistanceFunction} This SDF.
		 */

		intersect(sdf) {

			sdf.operation = OperationType.INTERSECTION;
			this.children.push(sdf);

			return this;

		}

		/**
		 * Serialises this SDF.
		 *
		 * @method serialise
		 * @return {Object} A serialised description of this SDF.
		 */

		serialise() {

			const result = {
				type: this.type,
				operation: this.operation,
				material: this.material,
				parameters: null,
				children: []
			};

			const children = this.children;

			let i, l;

			for(i = 0, l = children.length; i < l; ++i) {

				result.children.push(children[i].serialise());

			}

			return result;

		}

		/**
		 * Translates this SDF into a CSG expression.
		 *
		 * @method toCSG
		 * @return {Operation} A CSG operation.
		 * @example
		 *     a.union(b.intersect(c)).union(d).subtract(e) => Difference(Union(a, Intersection(b, c), d), e)
		 */

		toCSG() {

			const children = this.children;

			let operation = new DensityFunction(this);
			let operationType;
			let child;
			let i, l;

			for(i = 0, l = children.length; i < l; ++i) {

				child = children[i];

				if(operationType !== child.operation) {

					operationType = child.operation;

					switch(operationType) {

						case OperationType.UNION:
							operation = new Union(operation);
							break;

						case OperationType.DIFFERENCE:
							operation = new Difference(operation);
							break;

						case OperationType.INTERSECTION:
							operation = new Intersection(operation);
							break;

					}

				}

				operation.children.push(child.toCSG());

			}

			return operation;

		}

		/**
		 * Calculates the bounding box of this SDF.
		 *
		 * @method computeBoundingBox
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			throw new Error("SDF: bounding box method not implemented!");

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @method sample
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @param {Vector3} position - A position.
		 * @return {Number} The Euclidean distance to the surface.
		 */

		sample(position) {

			throw new Error("SDF: sample method not implemented!");

		}

	}

	/**
	 * A Signed Distance Function that describes a sphere.
	 *
	 * @class Sphere
	 * @submodule sdf
	 * @extends SignedDistanceFunction
	 * @constructor
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.origin - The origin [x, y, z].
	 * @param {Number} parameters.radius - The radius.
	 * @param {Number} [material] - A material index.
	 */

	class Sphere extends SignedDistanceFunction {

		constructor(parameters = {}, material) {

			super(SDFType.SPHERE, material);

			/**
			 * The origin.
			 *
			 * @property origin
			 * @type Vector3
			 * @private
			 */

			this.origin = new Vector3$2(...parameters.origin);

			/**
			 * The radius.
			 *
			 * @property radius
			 * @type Number
			 * @private
			 */

			this.radius = parameters.radius;

		}

		/**
		 * Calculates the bounding box of this density field.
		 *
		 * @method computeBoundingBox
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			this.bbox = new Box3$2();

			this.bbox.min.copy(this.origin).subScalar(this.radius);
			this.bbox.max.copy(this.origin).addScalar(this.radius);

			return this.bbox;

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @method sample
		 * @param {Vector3} position - A position.
		 * @return {Number} The euclidean distance to the surface.
		 */

		sample(position) {

			const origin = this.origin;

			const dx = position.x - origin.x;
			const dy = position.y - origin.y;
			const dz = position.z - origin.z;

			const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

			return length - this.radius;

		}

		/**
		 * Serialises this SDF.
		 *
		 * @method serialise
		 * @return {Object} A concise representation of this SDF.
		 */

		serialise() {

			const result = super.serialise();

			result.parameters = {
				origin: this.origin.toArray(),
				radius: this.radius
			};

			return result;

		}

	}

	/**
	 * A Signed Distance Function that describes a box.
	 *
	 * @class Box
	 * @submodule sdf
	 * @extends SignedDistanceFunction
	 * @constructor
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.origin - The origin [x, y, z].
	 * @param {Array} parameters.halfDimensions - The half size [x, y, z].
	 * @param {Number} [material] - A material index.
	 */

	class Box extends SignedDistanceFunction {

		constructor(parameters = {}, material) {

			super(SDFType.BOX, material);

			/**
			 * The origin.
			 *
			 * @property origin
			 * @type Vector3
			 * @private
			 */

			this.origin = new Vector3$2(...parameters.origin);

			/**
			 * The halfDimensions.
			 *
			 * @property halfDimensions
			 * @type Vector3
			 * @private
			 */

			this.halfDimensions = new Vector3$2(...parameters.halfDimensions);

		}

		/**
		 * Calculates the bounding box of this density field.
		 *
		 * @method computeBoundingBox
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			this.bbox = new Box3$2();

			this.bbox.min.subVectors(this.origin, this.halfDimensions);
			this.bbox.max.addVectors(this.origin, this.halfDimensions);

			return this.bbox;

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @method sample
		 * @param {Vector3} position - A position.
		 * @return {Number} The euclidean distance to the surface.
		 */

		sample(position) {

			const origin = this.origin;
			const halfDimensions = this.halfDimensions;

			// Compute the distance to the hull.
			const dx = Math.abs(position.x - origin.x) - halfDimensions.x;
			const dy = Math.abs(position.y - origin.y) - halfDimensions.y;
			const dz = Math.abs(position.z - origin.z) - halfDimensions.z;

			const m = Math.max(dx, Math.max(dy, dz));

			const mx0 = Math.max(dx, 0);
			const my0 = Math.max(dy, 0);
			const mz0 = Math.max(dz, 0);

			const length = Math.sqrt(mx0 * mx0 + my0 * my0 + mz0 * mz0);

			return Math.min(m, 0) + length;

		}

		/**
		 * Serialises this SDF.
		 *
		 * @method serialise
		 * @return {Object} A serialised description of this SDF.
		 */

		serialise() {

			const result = super.serialise();

			result.parameters = {
				origin: this.origin.toArray(),
				halfDimensions: this.halfDimensions.toArray()
			};

			return result;

		}

	}

	/**
	 * A Signed Distance Function that describes a plane.
	 *
	 * @class Plane
	 * @submodule sdf
	 * @extends SignedDistanceFunction
	 * @constructor
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.normal - The normal [x, y, z].
	 * @param {Number} parameters.constant - The constant.
	 * @param {Number} [material] - A material index.
	 */

	class Plane extends SignedDistanceFunction {

		constructor(parameters = {}, material) {

			super(SDFType.PLANE, material);

			/**
			 * The normal.
			 *
			 * @property normal
			 * @type Vector3
			 * @private
			 */

			this.normal = new Vector3$2(...parameters.normal);

			/**
			 * The constant.
			 *
			 * @property constant
			 * @type Number
			 * @private
			 */

			this.constant = parameters.constant;

		}

		/**
		 * Calculates the bounding box of this density field.
		 *
		 * @method computeBoundingBox
		 * @return {Box3} The bounding box.
		 * @todo
		 */

		computeBoundingBox() {

			this.bbox = new Box3$2();

			return this.bbox;

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @method sample
		 * @param {Vector3} position - A position.
		 * @return {Number} The euclidean distance to the surface.
		 */

		sample(position) {

			return this.normal.dot(position) + this.constant;

		}

		/**
		 * Serialises this SDF.
		 *
		 * @method serialise
		 * @return {Object} A serialised description of this SDF.
		 */

		serialise() {

			const result = super.serialise();

			result.parameters = {
				normal: this.normal.toArray(),
				constant: this.constant
			};

			return result;

		}

	}

	/**
	 * A Signed Distance Function that describes a torus.
	 *
	 * @class Torus
	 * @submodule sdf
	 * @extends SignedDistanceFunction
	 * @constructor
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.origin - The origin [x, y, z].
	 * @param {Number} parameters.R - The distance from the center to the tube.
	 * @param {Number} parameters.r - The radius of the tube.
	 * @param {Number} [material] - A material index.
	 */

	class Torus extends SignedDistanceFunction {

		constructor(parameters = {}, material) {

			super(SDFType.TORUS, material);

			/**
			 * The origin.
			 *
			 * @property origin
			 * @type Vector3
			 * @private
			 */

			this.origin = new Vector3$2(...parameters.origin);

			/**
			 * The distance from the center to the tube.
			 *
			 * @property R
			 * @type Number
			 * @private
			 */

			this.R = parameters.R;

			/**
			 * The radius of the tube.
			 *
			 * @property r
			 * @type Number
			 * @private
			 */

			this.r = parameters.r;

		}

		/**
		 * Calculates the bounding box of this density field.
		 *
		 * @method computeBoundingBox
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			this.bbox = new Box3$2();

			this.bbox.min.copy(this.origin).subScalar(this.R).subScalar(this.r);
			this.bbox.max.copy(this.origin).addScalar(this.R).addScalar(this.r);

			return this.bbox;

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @method sample
		 * @param {Vector3} position - A position.
		 * @return {Number} The euclidean distance to the surface.
		 */

		sample(position) {

			const origin = this.origin;

			const dx = position.x - origin.x;
			const dy = position.y - origin.y;
			const dz = position.z - origin.z;

			const q = Math.sqrt(dx * dx + dz * dz) - this.R;
			const length = Math.sqrt(q * q + dy * dy);

			return length - this.r;

		}

		/**
		 * Serialises this SDF.
		 *
		 * @method serialise
		 * @return {Object} A serialised description of this SDF.
		 */

		serialise() {

			const result = super.serialise();

			result.parameters = {
				origin: this.origin.toArray(),
				R: this.R,
				r: this.r
			};

			return result;

		}

	}

	/**
	 * A Signed Distance Function that describes a heightfield.
	 *
	 * @class Sphere
	 * @submodule sdf
	 * @extends SignedDistanceFunction
	 * @constructor
	 * @param {Object} parameters - The parameters.
	 * @param {Array} parameters.min - The min position [x, y, z].
	 * @param {Array} parameters.dimensions - The dimensions [x, y, z].
	 * @param {Uint8ClampedArray} parameters.data - The heightmap data.
	 * @param {Number} [material] - A material index.
	 */

	class Heightfield extends SignedDistanceFunction {

		constructor(parameters = {}, material) {

			super(SDFType.HEIGHTFIELD, material);

			/**
			 * The position.
			 *
			 * @property min
			 * @type Vector3
			 * @private
			 */

			this.min = new Vector3$2(...parameters.min);

			/**
			 * The dimensions.
			 *
			 * @property dimensions
			 * @type Vector3
			 * @private
			 */

			this.dimensions = new Vector3$2(...parameters.size);

			/**
			 * The height data.
			 *
			 * @property data
			 * @type Uint8ClampedArray
			 * @private
			 */

			this.data = parameters.data;

		}

		/**
		 * Calculates the bounding box of this density field.
		 *
		 * @method computeBoundingBox
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			this.bbox = new Box3$2();

			this.bbox.min.copy(this.min);
			this.bbox.max.addVectors(this.min, this.dimensions);

			return this.bbox;

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @method sample
		 * @param {Vector3} position - A position.
		 * @return {Number} The euclidean distance to the surface.
		 */

		sample(position) {

			const min = this.min;
			const dimensions = this.dimensions;

			const x = Math.max(min.x, Math.min(min.x + dimensions.x, position.x - min.x));
			const z = Math.max(min.z, Math.min(min.z + dimensions.z, position.z - min.z));

			const y = position.y - min.y;

			return y - (this.data[z * dimensions.x + x] / 255) * dimensions.y;

		}

		/**
		 * Serialises this SDF.
		 *
		 * @method serialise
		 * @return {Object} A serialised description of this SDF.
		 */

		serialise() {

			const result = super.serialise();

			result.parameters = {
				min: this.min.toArray(),
				dimensions: this.dimensions.toArray(),
				data: this.data
			};

			return result;

		}

	}

	/**
	 * An SDF reviver.
	 *
	 * @class Reviver
	 * @static
	 */

	class Reviver {

		/**
		 * Creates an SDF from the given serialised description.
		 *
		 * @method reviveSDF
		 * @static
		 * @param {Object} description - A serialised SDF.
		 * @return {SignedDistanceFunction} An SDF.
		 */

		static reviveSDF(description) {

			let sdf, i, l;

			switch(description.type) {

				case SDFType.SPHERE:
					sdf = new Sphere(description.parameters, description.material);
					break;

				case SDFType.BOX:
					sdf = new Box(description.parameters, description.material);
					break;

				case SDFType.TORUS:
					sdf = new Torus(description.parameters, description.material);
					break;

				case SDFType.PLANE:
					sdf = new Plane(description.parameters, description.material);
					break;

				case SDFType.HEIGHTFIELD:
					sdf = new Heightfield(description.parameters, description.material);
					break;

			}

			sdf.operation = description.operation;

			for(i = 0, l = description.children.length; i < l; ++i) {

				sdf.children.push(this.reviveSDF(description.children[i]));

			}

			return sdf;

		}

	}

	/**
	 * An enumeration of worker actions.
	 *
	 * @class Action
	 * @submodule worker
	 * @static
	 */

	const Action = {

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

	/**
	 * A basic event.
	 *
	 * @class Event
	 * @submodule events
	 * @constructor
	 * @param {String} type - The name of the event.
	 */

	class Event {

		constructor(type) {

			/**
			 * The name of the event.
			 *
			 * @property type
			 * @type String
			 */

			this.type = type;

			/**
			 * A reference to the target to which the event was originally dispatched.
			 *
			 * @property target
			 * @type Object
			 * @default null
			 */

			this.target = null;

		}

	}

	/**
	 * A worker event.
	 *
	 * @class WorkerEvent
	 * @submodule events
	 * @constructor
	 * @param {String} type - The name of the event.
	 */

	class WorkerEvent extends Event {

		constructor(type) {

			super(type);

			/**
			 * A worker.
			 *
			 * @property worker
			 * @type Worker
			 * @default null
			 */

			this.worker = null;

			/**
			 * A message.
			 *
			 * @property data
			 * @type Object
			 * @default null
			 */

			this.data = null;

		}

	}

	var worker = "(function () {\n\t'use strict';\n\n\t/**\r\n\t * A vector with three components.\r\n\t *\r\n\t * @class Vector3\r\n\t * @submodule math\r\n\t * @constructor\r\n\t * @param {Number} [x=0] - The x value.\r\n\t * @param {Number} [y=0] - The y value.\r\n\t * @param {Number} [z=0] - The z value.\r\n\t */\r\n\r\n\tclass Vector3 {\r\n\r\n\t\tconstructor(x = 0, y = 0, z = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The x component.\r\n\t\t\t *\r\n\t\t\t * @property x\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.x = x;\r\n\r\n\t\t\t/**\r\n\t\t\t * The y component.\r\n\t\t\t *\r\n\t\t\t * @property y\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.y = y;\r\n\r\n\t\t\t/**\r\n\t\t\t * The z component.\r\n\t\t\t *\r\n\t\t\t * @property z\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.z = z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this vector\r\n\t\t *\r\n\t\t * @method set\r\n\t\t * @param {Number} x - The x value.\r\n\t\t * @param {Number} y - The y value.\r\n\t\t * @param {Number} z - The z value.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tset(x, y, z) {\r\n\r\n\t\t\tthis.x = x;\r\n\t\t\tthis.y = y;\r\n\t\t\tthis.z = z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of another vector.\r\n\t\t *\r\n\t\t * @method copy\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tcopy(v) {\r\n\r\n\t\t\tthis.x = v.x;\r\n\t\t\tthis.y = v.y;\r\n\t\t\tthis.z = v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from an array.\r\n\t\t *\r\n\t\t * @method fromArray\r\n\t\t * @param {Array} array - An array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tfromArray(array, offset) {\r\n\r\n\t\t\tif(offset === undefined) { offset = 0; }\r\n\r\n\t\t\tthis.x = array[offset];\r\n\t\t\tthis.y = array[offset + 1];\r\n\t\t\tthis.z = array[offset + 2];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores this vector in an array.\r\n\t\t *\r\n\t\t * @method toArray\r\n\t\t * @param {Array} [array] - A target array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Vector3} The array.\r\n\t\t */\r\n\r\n\t\ttoArray(array, offset) {\r\n\r\n\t\t\tif(array === undefined) { array = []; }\r\n\t\t\tif(offset === undefined) { offset = 0; }\r\n\r\n\t\t\tarray[offset] = this.x;\r\n\t\t\tarray[offset + 1] = this.y;\r\n\t\t\tarray[offset + 2] = this.z;\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this vector equals the given one.\r\n\t\t *\r\n\t\t * @method equals\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Boolean} Whether this vector equals the given one.\r\n\t\t */\r\n\r\n\t\tequals(v) {\r\n\r\n\t\t\treturn (v.x === this.x && v.y === this.y && v.z === this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this vector.\r\n\t\t *\r\n\t\t * @method clone\r\n\t\t * @return {Vector3} A clone of this vector.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor(this.x, this.y, this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a vector to this one.\r\n\t\t *\r\n\t\t * @method add\r\n\t\t * @param {Vector3} v - The vector to add.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tadd(v) {\r\n\r\n\t\t\tthis.x += v.x;\r\n\t\t\tthis.y += v.y;\r\n\t\t\tthis.z += v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scaled vector to this one.\r\n\t\t *\r\n\t\t * @method addScaledVector\r\n\t\t * @param {Vector3} v - The vector to scale and add.\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddScaledVector(v, s) {\r\n\r\n\t\t\tthis.x += v.x * s;\r\n\t\t\tthis.y += v.y * s;\r\n\t\t\tthis.z += v.z * s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scalar to this vector.\r\n\t\t *\r\n\t\t * @method addScalar\r\n\t\t * @param {Number} s - The scalar to add.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddScalar(s) {\r\n\r\n\t\t\tthis.x += s;\r\n\t\t\tthis.y += s;\r\n\t\t\tthis.z += s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the sum of two given vectors.\r\n\t\t *\r\n\t\t * @method addVectors\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x + b.x;\r\n\t\t\tthis.y = a.y + b.y;\r\n\t\t\tthis.z = a.z + b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a vector from this vector.\r\n\t\t *\r\n\t\t * @method sub\r\n\t\t * @param {Vector3} v - The vector to subtract.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsub(v) {\r\n\r\n\t\t\tthis.x -= v.x;\r\n\t\t\tthis.y -= v.y;\r\n\t\t\tthis.z -= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a scalar to this vector.\r\n\t\t *\r\n\t\t * @method subScalar\r\n\t\t * @param {Number} s - The scalar to subtract.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsubScalar(s) {\r\n\r\n\t\t\tthis.x -= s;\r\n\t\t\tthis.y -= s;\r\n\t\t\tthis.z -= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the difference between two given vectors.\r\n\t\t *\r\n\t\t * @method subVectors\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - A second vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsubVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x - b.x;\r\n\t\t\tthis.y = a.y - b.y;\r\n\t\t\tthis.z = a.z - b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with another vector.\r\n\t\t *\r\n\t\t * @method multiply\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiply(v) {\r\n\r\n\t\t\tthis.x *= v.x;\r\n\t\t\tthis.y *= v.y;\r\n\t\t\tthis.z *= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with a given scalar.\r\n\t\t *\r\n\t\t * @method multiplyScalar\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyScalar(s) {\r\n\r\n\t\t\tif(isFinite(s)) {\r\n\r\n\t\t\t\tthis.x *= s;\r\n\t\t\t\tthis.y *= s;\r\n\t\t\t\tthis.z *= s;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tthis.x = 0;\r\n\t\t\t\tthis.y = 0;\r\n\t\t\t\tthis.z = 0;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the product of two given vectors.\r\n\t\t *\r\n\t\t * @method multiplyVectors\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x * b.x;\r\n\t\t\tthis.y = a.y * b.y;\r\n\t\t\tthis.z = a.z * b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by another vector.\r\n\t\t *\r\n\t\t * @method divide\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tdivide(v) {\r\n\r\n\t\t\tthis.x /= v.x;\r\n\t\t\tthis.y /= v.y;\r\n\t\t\tthis.z /= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by a given scalar.\r\n\t\t *\r\n\t\t * @method divideScalar\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tdivideScalar(s) {\r\n\r\n\t\t\treturn this.multiplyScalar(1 / s);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the quotient of two given vectors.\r\n\t\t *\r\n\t\t * @method divideVectors\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tdivideVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x / b.x;\r\n\t\t\tthis.y = a.y / b.y;\r\n\t\t\tthis.z = a.z / b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the dot product with another vector.\r\n\t\t *\r\n\t\t * @method dot\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The dot product.\r\n\t\t */\r\n\r\n\t\tdot(v) {\r\n\r\n\t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared length of this vector.\r\n\t\t *\r\n\t\t * @method lengthSq\r\n\t\t * @return {Number} The squared length.\r\n\t\t */\r\n\r\n\t\tlengthSq() {\r\n\r\n\t\t\treturn this.x * this.x + this.y * this.y + this.z * this.z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the length of this vector.\r\n\t\t *\r\n\t\t * @method length\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tlength() {\r\n\r\n\t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance to a given vector.\r\n\t\t *\r\n\t\t * @method distanceTo\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tdistanceTo(v) {\r\n\r\n\t\t\treturn Math.sqrt(this.distanceToSquared(v));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared distance to a given vector.\r\n\t\t *\r\n\t\t * @method distanceToSquared\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The squared distance.\r\n\t\t */\r\n\r\n\t\tdistanceToSquared(v) {\r\n\r\n\t\t\tconst dx = this.x - v.x;\r\n\t\t\tconst dy = this.y - v.y;\r\n\t\t\tconst dz = this.z - v.z;\r\n\r\n\t\t\treturn dx * dx + dy * dy + dz * dz;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Normalizes this vector.\r\n\t\t *\r\n\t\t * @method normalize\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tnormalize() {\r\n\r\n\t\t\treturn this.divideScalar(this.length());\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the min value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @method min\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmin(v) {\r\n\r\n\t\t\tthis.x = Math.min(this.x, v.x);\r\n\t\t\tthis.y = Math.min(this.y, v.y);\r\n\t\t\tthis.z = Math.min(this.z, v.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * adopts the max value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @method max\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmax(v) {\r\n\r\n\t\t\tthis.x = Math.max(this.x, v.x);\r\n\t\t\tthis.y = Math.max(this.y, v.y);\r\n\t\t\tthis.z = Math.max(this.z, v.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clamps this vector.\r\n\t\t *\r\n\t\t * @method clamp\r\n\t\t * @param {Vector3} min - A vector, assumed to be smaller than max.\r\n\t\t * @param {Vector3} max - A vector, assumed to be greater than min.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tclamp(min, max) {\r\n\r\n\t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\r\n\t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\r\n\t\t\tthis.z = Math.max(min.z, Math.min(max.z, this.z));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a matrix to this vector.\r\n\t\t *\r\n\t\t * @method applyMatrix3\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tapplyMatrix3(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[3] * y + e[6] * z;\r\n\t\t\tthis.y = e[1] * x + e[4] * y + e[7] * z;\r\n\t\t\tthis.z = e[2] * x + e[5] * y + e[8] * z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a matrix to this vector.\r\n\t\t *\r\n\t\t * @method applyMatrix4\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tapplyMatrix4(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z + e[12];\r\n\t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z + e[13];\r\n\t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z + e[14];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An octant.\r\n\t *\r\n\t * @class Octant\r\n\t * @submodule core\r\n\t * @constructor\r\n\t * @param {Vector3} min - The lower bounds.\r\n\t * @param {Vector3} max - The upper bounds.\r\n\t */\r\n\r\n\tclass Octant {\r\n\r\n\t\tconstructor(min = new Vector3(), max = new Vector3()) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The lower bounds of this octant.\r\n\t\t\t *\r\n\t\t\t * @property min\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = min;\r\n\r\n\t\t\t/**\r\n\t\t\t * The upper bounds of the octant.\r\n\t\t\t *\r\n\t\t\t * @property max\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.max = max;\r\n\r\n\t\t\t/**\r\n\t\t\t * The children of this octant.\r\n\t\t\t *\r\n\t\t\t * @property children\r\n\t\t\t * @type Array\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.children = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the center of this octant.\r\n\t\t *\r\n\t\t * @method getCenter\r\n\t\t * @return {Vector3} A new vector that describes the center of this octant.\r\n\t\t */\r\n\r\n\t\tgetCenter() { return this.min.clone().add(this.max).multiplyScalar(0.5); }\r\n\r\n\t\t/**\r\n\t\t * Computes the size of this octant.\r\n\t\t *\r\n\t\t * @method getDimensions\r\n\t\t * @return {Vector3} A new vector that describes the size of this octant.\r\n\t\t */\r\n\r\n\t\tgetDimensions() { return this.max.clone().sub(this.min); }\r\n\r\n\t\t/**\r\n\t\t * Splits this octant into eight smaller ones.\r\n\t\t *\r\n\t\t * @method split\r\n\t\t * @param {Array} [octants] - A list of octants to recycle.\r\n\t\t */\r\n\r\n\t\tsplit(octants) {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst max = this.max;\r\n\t\t\tconst mid = this.getCenter();\r\n\r\n\t\t\tlet i, j;\r\n\t\t\tlet l = 0;\r\n\t\t\tlet combination;\r\n\r\n\t\t\tlet halfDimensions;\r\n\t\t\tlet v, child, octant;\r\n\r\n\t\t\tif(Array.isArray(octants)) {\r\n\r\n\t\t\t\thalfDimensions = this.getDimensions().multiplyScalar(0.5);\r\n\t\t\t\tv = [new Vector3(), new Vector3(), new Vector3()];\r\n\t\t\t\tl = octants.length;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.children = [];\r\n\r\n\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\tcombination = PATTERN[i];\r\n\t\t\t\toctant = null;\r\n\r\n\t\t\t\tif(l > 0) {\r\n\r\n\t\t\t\t\tv[1].addVectors(min, v[0].fromArray(combination).multiply(halfDimensions));\r\n\t\t\t\t\tv[2].addVectors(mid, v[0].fromArray(combination).multiply(halfDimensions));\r\n\r\n\t\t\t\t\t// Find an octant that matches the current combination.\r\n\t\t\t\t\tfor(j = 0; j < l; ++j) {\r\n\r\n\t\t\t\t\t\tchild = octants[j];\r\n\r\n\t\t\t\t\t\tif(child !== null && v[1].equals(child.min) && v[2].equals(child.max)) {\r\n\r\n\t\t\t\t\t\t\toctant = child;\r\n\t\t\t\t\t\t\toctants[j] = null;\r\n\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tthis.children.push((octant !== null) ? octant : new this.constructor(\r\n\r\n\t\t\t\t\tnew Vector3(\r\n\t\t\t\t\t\t((combination[0] === 0) ? min.x : mid.x),\r\n\t\t\t\t\t\t((combination[1] === 0) ? min.y : mid.y),\r\n\t\t\t\t\t\t((combination[2] === 0) ? min.z : mid.z)\r\n\t\t\t\t\t),\r\n\r\n\t\t\t\t\tnew Vector3(\r\n\t\t\t\t\t\t((combination[0] === 0) ? mid.x : max.x),\r\n\t\t\t\t\t\t((combination[1] === 0) ? mid.y : max.y),\r\n\t\t\t\t\t\t((combination[2] === 0) ? mid.z : max.z)\r\n\t\t\t\t\t)\r\n\r\n\t\t\t\t));\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A binary pattern that describes the standard octant layout:\r\n\t *\r\n\t * <pre>\r\n\t *    3____7\r\n\t *  2/___6/|\r\n\t *  | 1__|_5\r\n\t *  0/___4/\r\n\t * </pre>\r\n\t *\r\n\t * This common layout is crucial for positional assumptions.\r\n\t *\r\n\t * @property PATTERN\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst PATTERN = [\r\n\r\n\t\tnew Uint8Array([0, 0, 0]),\r\n\t\tnew Uint8Array([0, 0, 1]),\r\n\t\tnew Uint8Array([0, 1, 0]),\r\n\t\tnew Uint8Array([0, 1, 1]),\r\n\r\n\t\tnew Uint8Array([1, 0, 0]),\r\n\t\tnew Uint8Array([1, 0, 1]),\r\n\t\tnew Uint8Array([1, 1, 0]),\r\n\t\tnew Uint8Array([1, 1, 1])\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * Describes all possible octant corner connections.\r\n\t *\r\n\t * @property EDGES\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst EDGES = [\r\n\r\n\t\t// X-Axis.\r\n\t\tnew Uint8Array([0, 4]),\r\n\t\tnew Uint8Array([1, 5]),\r\n\t\tnew Uint8Array([2, 6]),\r\n\t\tnew Uint8Array([3, 7]),\r\n\r\n\t\t// Y-Axis.\r\n\t\tnew Uint8Array([0, 2]),\r\n\t\tnew Uint8Array([1, 3]),\r\n\t\tnew Uint8Array([4, 6]),\r\n\t\tnew Uint8Array([5, 7]),\r\n\r\n\t\t// Z-Axis.\r\n\t\tnew Uint8Array([0, 1]),\r\n\t\tnew Uint8Array([2, 3]),\r\n\t\tnew Uint8Array([4, 5]),\r\n\t\tnew Uint8Array([6, 7])\r\n\r\n\t];\n\n\t/**\r\n\t * A cubic octant.\r\n\t *\r\n\t * @class CubicOctant\r\n\t * @submodule core\r\n\t * @constructor\r\n\t * @param {Vector3} min - The lower bounds.\r\n\t * @param {Number} [size=0] - The size of the octant.\r\n\t */\r\n\r\n\tclass CubicOctant {\r\n\r\n\t\tconstructor(min = new Vector3(), size = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The lower bounds of this octant.\r\n\t\t\t *\r\n\t\t\t * @property min\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = min;\r\n\r\n\t\t\t/**\r\n\t\t\t * The size of this octant.\r\n\t\t\t *\r\n\t\t\t * @property size\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.size = size;\r\n\r\n\t\t\t/**\r\n\t\t\t * The children of this octant.\r\n\t\t\t *\r\n\t\t\t * @property children\r\n\t\t\t * @type Array\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.children = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The upper bounds of this octant.\r\n\t\t *\r\n\t\t * @property max\r\n\t\t * @type Vector3\r\n\t\t */\r\n\r\n\t\tget max() { return this.min.clone().addScalar(this.size); }\r\n\r\n\t\t/**\r\n\t\t * Computes the center of this octant.\r\n\t\t *\r\n\t\t * @method getCenter\r\n\t\t * @return {Vector3} A new vector that describes the center of this octant.\r\n\t\t */\r\n\r\n\t\tgetCenter() { return this.min.clone().addScalar(this.size * 0.5); }\r\n\r\n\t\t/**\r\n\t\t * Returns the size of this octant as a vector.\r\n\t\t *\r\n\t\t * @method getDimensions\r\n\t\t * @return {Vector3} A new vector that describes the size of this octant.\r\n\t\t */\r\n\r\n\t\tgetDimensions() { return new Vector3(this.size, this.size, this.size); }\r\n\r\n\t\t/**\r\n\t\t * Splits this octant into eight smaller ones.\r\n\t\t *\r\n\t\t * @method split\r\n\t\t * @param {Array} [octants] - A list of octants to recycle.\r\n\t\t */\r\n\r\n\t\tsplit(octants) {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst mid = this.getCenter();\r\n\t\t\tconst halfSize = this.size * 0.5;\r\n\r\n\t\t\tlet i, j;\r\n\t\t\tlet l = 0;\r\n\t\t\tlet combination;\r\n\r\n\t\t\tlet v, child, octant;\r\n\r\n\t\t\tif(Array.isArray(octants)) {\r\n\r\n\t\t\t\tv = new Vector3();\r\n\t\t\t\tl = octants.length;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.children = [];\r\n\r\n\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\tcombination = PATTERN[i];\r\n\t\t\t\toctant = null;\r\n\r\n\t\t\t\tif(l > 0) {\r\n\r\n\t\t\t\t\tv.fromArray(combination).multiplyScalar(halfSize).add(min);\r\n\r\n\t\t\t\t\t// Find an octant that matches the current combination.\r\n\t\t\t\t\tfor(j = 0; j < l; ++j) {\r\n\r\n\t\t\t\t\t\tchild = octants[j];\r\n\r\n\t\t\t\t\t\tif(child !== null && child.size === halfSize && v.equals(child.min)) {\r\n\r\n\t\t\t\t\t\t\toctant = child;\r\n\t\t\t\t\t\t\toctants[j] = null;\r\n\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tthis.children.push((octant !== null) ? octant : new this.constructor(\r\n\r\n\t\t\t\t\tnew Vector3(\r\n\t\t\t\t\t\t((combination[0] === 0) ? min.x : mid.x),\r\n\t\t\t\t\t\t((combination[1] === 0) ? min.y : mid.y),\r\n\t\t\t\t\t\t((combination[2] === 0) ? min.z : mid.z)\r\n\t\t\t\t\t),\r\n\r\n\t\t\t\t\thalfSize\r\n\r\n\t\t\t\t));\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A bounding box.\r\n\t *\r\n\t * @class Box3\r\n\t * @submodule math\r\n\t * @constructor\r\n\t * @param {Vector3} [min] - The lower bounds.\r\n\t * @param {Vector3} [max] - The upper bounds.\r\n\t */\r\n\r\n\tclass Box3 {\r\n\r\n\t\tconstructor(\r\n\t\t\tmin = new Vector3(Infinity, Infinity, Infinity),\r\n\t\t\tmax = new Vector3(-Infinity, -Infinity, -Infinity)\r\n\t\t) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The min bounds.\r\n\t\t\t *\r\n\t\t\t * @property min\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = min;\r\n\r\n\t\t\t/**\r\n\t\t\t * The max bounds.\r\n\t\t\t *\r\n\t\t\t * @property max\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.max = max;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this box.\r\n\t\t *\r\n\t\t * @method set\r\n\t\t * @param {Number} min - The min bounds.\r\n\t\t * @param {Number} max - The max bounds.\r\n\t\t * @return {Matrix3} This box.\r\n\t\t */\r\n\r\n\t\tset(min, max) {\r\n\r\n\t\t\tthis.min.copy(min);\r\n\t\t\tthis.max.copy(max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given box.\r\n\t\t *\r\n\t\t * @method copy\r\n\t\t * @param {Matrix3} b - A box.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tcopy(b) {\r\n\r\n\t\t\tthis.min.copy(b.min);\r\n\t\t\tthis.max.copy(b.max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this matrix.\r\n\t\t *\r\n\t\t * @method clone\r\n\t\t * @return {Matrix3} A clone of this matrix.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Expands this box by the given point.\r\n\t\t *\r\n\t\t * @method expandByPoint\r\n\t\t * @param {Matrix3} p - A point.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\texpandByPoint(p) {\r\n\r\n\t\t\tthis.min.min(p);\r\n\t\t\tthis.max.max(p);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Expands this box by combining it with the given one.\r\n\t\t *\r\n\t\t * @method union\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tunion(b) {\r\n\r\n\t\t\tthis.min.min(b.min);\r\n\t\t\tthis.max.max(b.max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Defines this box by the given points.\r\n\t\t *\r\n\t\t * @method setFromPoints\r\n\t\t * @param {Array} points - The points.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tsetFromPoints(points) {\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = points.length; i < l; ++i) {\r\n\r\n\t\t\t\tthis.expandByPoint(points[i]);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Defines this box by the given center and size.\r\n\t\t *\r\n\t\t * @method setFromCenterAndSize\r\n\t\t * @param {Vector3} center - The center.\r\n\t\t * @param {Number} size - The size.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tsetFromCenterAndSize(center, size) {\r\n\r\n\t\t\tconst halfSize = size.clone().multiplyScalar(0.5);\r\n\r\n\t\t\tthis.min.copy(center).sub(halfSize);\r\n\t\t\tthis.max.copy(center).add(halfSize);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this box intersects with the given one.\r\n\t\t *\r\n\t\t * @method intersectsBox\r\n\t\t * @param {Matrix3} box - A box.\r\n\t\t * @return {Boolean} Whether the boxes intersect.\r\n\t\t */\r\n\r\n\t\tintersectsBox(box) {\r\n\r\n\t\t\treturn !(\r\n\t\t\t\tbox.max.x < this.min.x || box.min.x > this.max.x ||\r\n\t\t\t\tbox.max.y < this.min.y || box.min.y > this.max.y ||\r\n\t\t\t\tbox.max.z < this.min.z || box.min.z > this.max.z\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Contains bytes used for bitwise operations. The last byte is used to store\r\n\t * raycasting flags.\r\n\t *\r\n\t * @property flags\r\n\t * @type Uint8Array\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);\r\n\r\n\t/**\r\n\t * A lookup-table containing octant ids. Used to determine the exit plane from\r\n\t * an octant.\r\n\t *\r\n\t * @property octantTable\r\n\t * @type Array\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst octantTable = [\r\n\r\n\t\tnew Uint8Array([4, 2, 1]),\r\n\t\tnew Uint8Array([5, 3, 8]),\r\n\t\tnew Uint8Array([6, 8, 3]),\r\n\t\tnew Uint8Array([7, 8, 8]),\r\n\t\tnew Uint8Array([8, 6, 5]),\r\n\t\tnew Uint8Array([8, 7, 8]),\r\n\t\tnew Uint8Array([8, 8, 7]),\r\n\t\tnew Uint8Array([8, 8, 8])\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * Finds the entry plane of the first octant that a ray travels through.\r\n\t *\r\n\t * Determining the first octant requires knowing which of the t0's is the\r\n\t * largest. The tm's of the other axes must also be compared against that\r\n\t * largest t0.\r\n\t *\r\n\t * @method findEntryOctant\r\n\t * @private\r\n\t * @static\r\n\t * @param {Number} tx0 - Ray projection parameter.\r\n\t * @param {Number} ty0 - Ray projection parameter.\r\n\t * @param {Number} tz0 - Ray projection parameter.\r\n\t * @param {Number} txm - Ray projection parameter mean.\r\n\t * @param {Number} tym - Ray projection parameter mean.\r\n\t * @param {Number} tzm - Ray projection parameter mean.\r\n\t * @return {Number} The index of the first octant that the ray travels through.\r\n\t */\r\n\r\n\tfunction findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {\r\n\r\n\t\tlet entry = 0;\r\n\r\n\t\t// Find the entry plane.\r\n\t\tif(tx0 > ty0 && tx0 > tz0) {\r\n\r\n\t\t\t// YZ-plane.\r\n\t\t\tif(tym < tx0) { entry = entry | 2; }\r\n\t\t\tif(tzm < tx0) { entry = entry | 1; }\r\n\r\n\t\t} else if(ty0 > tz0) {\r\n\r\n\t\t\t// XZ-plane.\r\n\t\t\tif(txm < ty0) { entry = entry | 4; }\r\n\t\t\tif(tzm < ty0) { entry = entry | 1; }\r\n\r\n\t\t} else {\r\n\r\n\t\t\t// XY-plane.\r\n\t\t\tif(txm < tz0) { entry = entry | 4; }\r\n\t\t\tif(tym < tz0) { entry = entry | 2; }\r\n\r\n\t\t}\r\n\r\n\t\treturn entry;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Finds the next octant that intersects with the ray based on the exit plane of\r\n\t * the current one.\r\n\t *\r\n\t * @method findNextOctant\r\n\t * @private\r\n\t * @static\r\n\t * @param {Number} currentOctant - The index of the current octant.\r\n\t * @param {Number} tx1 - Ray projection parameter.\r\n\t * @param {Number} ty1 - Ray projection parameter.\r\n\t * @param {Number} tz1 - Ray projection parameter.\r\n\t * @return {Number} The index of the next octant that the ray travels through.\r\n\t */\r\n\r\n\tfunction findNextOctant(currentOctant, tx1, ty1, tz1) {\r\n\r\n\t\tlet min;\r\n\t\tlet exit = 0;\r\n\r\n\t\t// Find the exit plane.\r\n\t\tif(tx1 < ty1) {\r\n\r\n\t\t\tmin = tx1;\r\n\t\t\texit = 0; // YZ-plane.\r\n\r\n\t\t} else {\r\n\r\n\t\t\tmin = ty1;\r\n\t\t\texit = 1; // XZ-plane.\r\n\r\n\t\t}\r\n\r\n\t\tif(tz1 < min) {\r\n\r\n\t\t\texit = 2; // XY-plane.\r\n\r\n\t\t}\r\n\r\n\t\treturn octantTable[currentOctant][exit];\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Finds all octants that intersect with the given ray.\r\n\t *\r\n\t * @method raycastOctant\r\n\t * @private\r\n\t * @static\r\n\t * @param {Octant} octant - The current octant.\r\n\t * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.\r\n\t * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.\r\n\t * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.\r\n\t * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.\r\n\t * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.\r\n\t * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.\r\n\t * @param {Raycaster} raycaster - The raycaster.\r\n\t * @param {Array} intersects - An array to be filled with the intersecting octants.\r\n\t */\r\n\r\n\tfunction raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {\r\n\r\n\t\tconst children = octant.children;\r\n\r\n\t\tlet currentOctant;\r\n\t\tlet txm, tym, tzm;\r\n\r\n\t\tif(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {\r\n\r\n\t\t\tif(children === null) {\r\n\r\n\t\t\t\t// Leaf.\r\n\t\t\t\tintersects.push(octant);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\t// Compute means.\r\n\t\t\t\ttxm = 0.5 * (tx0 + tx1);\r\n\t\t\t\ttym = 0.5 * (ty0 + ty1);\r\n\t\t\t\ttzm = 0.5 * (tz0 + tz1);\r\n\r\n\t\t\t\tcurrentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);\r\n\r\n\t\t\t\tdo {\r\n\r\n\t\t\t\t\t/* The possibilities for the next node are passed in the same respective\r\n\t\t\t\t\t * order as the t-values. Hence, if the first value is found to be the\r\n\t\t\t\t\t * greatest, the fourth one will be returned. If the second value is the\r\n\t\t\t\t\t * greatest, the fifth one will be returned, etc.\r\n\t\t\t\t\t */\r\n\r\n\t\t\t\t\tswitch(currentOctant) {\r\n\r\n\t\t\t\t\t\tcase 0:\r\n\t\t\t\t\t\t\traycastOctant(children[flags[8]], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, tym, tzm);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 1:\r\n\t\t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[1]], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, tym, tz1);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 2:\r\n\t\t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[2]], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, ty1, tzm);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 3:\r\n\t\t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[3]], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, ty1, tz1);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 4:\r\n\t\t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[4]], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, tym, tzm);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 5:\r\n\t\t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[5]], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, tym, tz1);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 6:\r\n\t\t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[6]], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);\r\n\t\t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase 7:\r\n\t\t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[7]], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);\r\n\t\t\t\t\t\t\t// Far top right octant. No other octants can be reached from here.\r\n\t\t\t\t\t\t\tcurrentOctant = 8;\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t} while(currentOctant < 8);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * An octree raycaster.\r\n\t *\r\n\t * Based on:\r\n\t *  \"An Efficient Parametric Algorithm for Octree Traversal\"\r\n\t *  by J. Revelles et al. (2000).\r\n\t *\r\n\t * @class OctreeRaycaster\r\n\t * @submodule core\r\n\t * @static\r\n\t */\r\n\r\n\tclass OctreeRaycaster {\r\n\r\n\t\t/**\r\n\t\t * Finds the octants that intersect with the given ray. The intersecting\r\n\t\t * octants are sorted by distance, closest first.\r\n\t\t *\r\n\t\t * @method intersectOctree\r\n\t\t * @static\r\n\t\t * @param {Octree} octree - An octree.\r\n\t\t * @param {Raycaster} raycaster - A raycaster.\r\n\t\t * @param {Array} intersects - A list to be filled with intersecting octants.\r\n\t\t */\r\n\r\n\t\tstatic intersectOctree(octree, raycaster, intersects) {\r\n\r\n\t\t\tconst dimensions = octree.getDimensions();\r\n\t\t\tconst halfDimensions = dimensions.clone().multiplyScalar(0.5);\r\n\r\n\t\t\t// Translate the octree extents to the center of the octree.\r\n\t\t\tconst min = octree.min.clone().sub(octree.min);\r\n\t\t\tconst max = octree.max.clone().sub(octree.min);\r\n\r\n\t\t\tconst direction = raycaster.ray.direction.clone();\r\n\t\t\tconst origin = raycaster.ray.origin.clone();\r\n\r\n\t\t\t// Translate the ray to the center of the octree.\r\n\t\t\torigin.sub(octree.getCenter()).add(halfDimensions);\r\n\r\n\t\t\tlet invDirX, invDirY, invDirZ;\r\n\t\t\tlet tx0, tx1, ty0, ty1, tz0, tz1;\r\n\r\n\t\t\t// Reset the last byte.\r\n\t\t\tflags[8] = flags[0];\r\n\r\n\t\t\t// Handle rays with negative directions.\r\n\t\t\tif(direction.x < 0.0) {\r\n\r\n\t\t\t\torigin.x = dimensions.x - origin.x;\r\n\t\t\t\tdirection.x = -direction.x;\r\n\t\t\t\tflags[8] |= flags[4];\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(direction.y < 0.0) {\r\n\r\n\t\t\t\torigin.y = dimensions.y - origin.y;\r\n\t\t\t\tdirection.y = -direction.y;\r\n\t\t\t\tflags[8] |= flags[2];\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(direction.z < 0.0) {\r\n\r\n\t\t\t\torigin.z = dimensions.z - origin.z;\r\n\t\t\t\tdirection.z = -direction.z;\r\n\t\t\t\tflags[8] |= flags[1];\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Improve IEEE double stability.\r\n\t\t\tinvDirX = 1.0 / direction.x;\r\n\t\t\tinvDirY = 1.0 / direction.y;\r\n\t\t\tinvDirZ = 1.0 / direction.z;\r\n\r\n\t\t\t// Project the ray to the root's boundaries.\r\n\t\t\ttx0 = (min.x - origin.x) * invDirX;\r\n\t\t\ttx1 = (max.x - origin.x) * invDirX;\r\n\t\t\tty0 = (min.y - origin.y) * invDirY;\r\n\t\t\tty1 = (max.y - origin.y) * invDirY;\r\n\t\t\ttz0 = (min.z - origin.z) * invDirZ;\r\n\t\t\ttz1 = (max.z - origin.z) * invDirZ;\r\n\r\n\t\t\t// Check if the ray hits the octree.\r\n\t\t\tif(Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {\r\n\r\n\t\t\t\traycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An octree that subdivides space for fast spatial searches.\r\n\t *\r\n\t * @class Octree\r\n\t * @submodule core\r\n\t * @constructor\r\n\t * @param {Vector3} [min] - The lower bounds of the tree.\r\n\t * @param {Vector3} [max] - The upper bounds of the tree.\r\n\t */\r\n\r\n\tclass Octree {\r\n\r\n\t\tconstructor(min, max) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The root octant.\r\n\t\t\t *\r\n\t\t\t * @property root\r\n\t\t\t * @type Octant\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.root = (min !== undefined && max !== undefined) ? new Octant(min, max) : null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The lower bounds of the root octant.\r\n\t\t *\r\n\t\t * @property min\r\n\t\t * @type Vector3\r\n\t\t */\r\n\r\n\t\tget min() { return this.root.min; }\r\n\r\n\t\t/**\r\n\t\t * The upper bounds of the root octant.\r\n\t\t *\r\n\t\t * @property max\r\n\t\t * @type Vector3\r\n\t\t */\r\n\r\n\t\tget max() { return this.root.max; }\r\n\r\n\t\t/**\r\n\t\t * The children of the root octant.\r\n\t\t *\r\n\t\t * @property children\r\n\t\t * @type Array\r\n\t\t */\r\n\r\n\t\tget children() { return this.root.children; }\r\n\r\n\t\t/**\r\n\t\t * Calculates the center of this octree.\r\n\t\t *\r\n\t\t * @method getCenter\r\n\t\t * @return {Vector3} A new vector that describes the center of this octree.\r\n\t\t */\r\n\r\n\t\tgetCenter() { return this.root.getCenter(); }\r\n\r\n\t\t/**\r\n\t\t * Calculates the size of this octree.\r\n\t\t *\r\n\t\t * @method getDimensions\r\n\t\t * @return {Vector3} A new vector that describes the size of this octree.\r\n\t\t */\r\n\r\n\t\tgetDimensions() { return this.root.getDimensions(); }\r\n\r\n\t\t/**\r\n\t\t * Calculates the current depth of this octree.\r\n\t\t *\r\n\t\t * @method getDepth\r\n\t\t * @return {Number} The depth.\r\n\t\t */\r\n\r\n\t\tgetDepth() {\r\n\r\n\t\t\tlet h0 = [this.root];\r\n\t\t\tlet h1 = [];\r\n\r\n\t\t\tlet depth = 0;\r\n\t\t\tlet octant, children;\r\n\r\n\t\t\twhile(h0.length > 0) {\r\n\r\n\t\t\t\toctant = h0.pop();\r\n\t\t\t\tchildren = octant.children;\r\n\r\n\t\t\t\tif(children !== null) {\r\n\r\n\t\t\t\t\th1.push(...children);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(h0.length === 0) {\r\n\r\n\t\t\t\t\th0 = h1;\r\n\t\t\t\t\th1 = [];\r\n\r\n\t\t\t\t\tif(h0.length > 0) { ++depth; }\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn depth;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Collects octants that lie inside the specified region.\r\n\t\t *\r\n\t\t * @method cull\r\n\t\t * @param {Frustum|Box3} region - A frustum or a bounding box.\r\n\t\t * @return {Array} The octants.\r\n\t\t */\r\n\r\n\t\tcull(region) {\r\n\r\n\t\t\tconst result = [];\r\n\t\t\tconst heap = [this.root];\r\n\t\t\tconst box = new Box3();\r\n\r\n\t\t\tlet octant, children;\r\n\r\n\t\t\twhile(heap.length > 0) {\r\n\r\n\t\t\t\toctant = heap.pop();\r\n\t\t\t\tchildren = octant.children;\r\n\r\n\t\t\t\t// Cache the computed max vector of cubic octants.\r\n\t\t\t\tbox.min = octant.min;\r\n\t\t\t\tbox.max = octant.max;\r\n\r\n\t\t\t\tif(region.intersectsBox(box)) {\r\n\r\n\t\t\t\t\tif(children !== null) {\r\n\r\n\t\t\t\t\t\theap.push(...children);\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\tresult.push(octant);\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Fetches all octants with the specified depth level.\r\n\t\t *\r\n\t\t * @method findOctantsByLevel\r\n\t\t * @param {Number} level - The depth level.\r\n\t\t * @return {Array} The octants.\r\n\t\t */\r\n\r\n\t\tfindOctantsByLevel(level) {\r\n\r\n\t\t\tconst result = [];\r\n\r\n\t\t\tlet h0 = [this.root];\r\n\t\t\tlet h1 = [];\r\n\r\n\t\t\tlet octant, children;\r\n\t\t\tlet currentLevel = 0;\r\n\r\n\t\t\twhile(h0.length > 0) {\r\n\r\n\t\t\t\toctant = h0.pop();\r\n\t\t\t\tchildren = octant.children;\r\n\r\n\t\t\t\tif(currentLevel === level) {\r\n\r\n\t\t\t\t\tresult.push(octant);\r\n\r\n\t\t\t\t} else if(children !== null) {\r\n\r\n\t\t\t\t\th1.push(...children);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(h0.length === 0) {\r\n\r\n\t\t\t\t\th0 = h1;\r\n\t\t\t\t\th1 = [];\r\n\r\n\t\t\t\t\tif(++currentLevel > level) { break; }\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds the octants that intersect with the given ray. The intersecting\r\n\t\t * octants are sorted by distance, closest first.\r\n\t\t *\r\n\t\t * @method raycast\r\n\t\t * @param {Raycaster} raycaster - A raycaster.\r\n\t\t * @param {Array} [intersects] - A list to be filled with intersecting octants.\r\n\t\t */\r\n\r\n\t\traycast(raycaster, intersects = []) {\r\n\r\n\t\t\tOctreeRaycaster.intersectOctree(this, raycaster, intersects);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Core components.\r\n\t *\r\n\t * @module sparse-octree\r\n\t * @submodule core\r\n\t */\n\n\t/**\r\n\t * Math components.\r\n\t *\r\n\t * @module sparse-octree\r\n\t * @submodule math\r\n\t */\n\n\t/**\r\n\t * An octant that maintains points.\r\n\t *\r\n\t * @class PointOctant\r\n\t * @submodule points\r\n\t * @extends Octant\r\n\t * @constructor\r\n\t * @param {Vector3} min - The lower bounds.\r\n\t * @param {Vector3} max - The upper bounds.\r\n\t */\r\n\r\n\tclass PointOctant extends Octant {\r\n\r\n\t\tconstructor(min, max) {\r\n\r\n\t\t\tsuper(min, max);\r\n\r\n\t\t\t/**\r\n\t\t\t * The points that are inside this octant.\r\n\t\t\t *\r\n\t\t\t * @property points\r\n\t\t\t * @type Array\r\n\t\t\t */\r\n\r\n\t\t\tthis.points = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * Point data.\r\n\t\t\t *\r\n\t\t\t * @property data\r\n\t\t\t * @type Array\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Counts how many points are in this octant.\r\n\t\t *\r\n\t\t * @method countPoints\r\n\t\t * @return {Number} The amount of points.\r\n\t\t */\r\n\r\n\t\tcountPoints() {\r\n\r\n\t\t\tconst heap = [this];\r\n\r\n\t\t\tlet result = 0;\r\n\t\t\tlet octant, children;\r\n\r\n\t\t\twhile(heap.length > 0) {\r\n\r\n\t\t\t\toctant = heap.pop();\r\n\t\t\t\tchildren = octant.children;\r\n\r\n\t\t\t\tif(children !== null) {\r\n\r\n\t\t\t\t\theap.push(...children);\r\n\r\n\t\t\t\t} else if(octant.points !== null) {\r\n\r\n\t\t\t\t\tresult += octant.points.length;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the distance squared from this octant to the given point.\r\n\t\t *\r\n\t\t * @method distanceToSquared\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Number} The distance squared.\r\n\t\t */\r\n\r\n\t\tdistanceToSquared(p) {\r\n\r\n\t\t\tconst clampedPoint = p.clone().clamp(this.min, this.max);\r\n\r\n\t\t\treturn clampedPoint.sub(p).lengthSq();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the distance squared from the center of this octant to the given\r\n\t\t * point.\r\n\t\t *\r\n\t\t * @method distanceToCenterSquared\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Number} The distance squared.\r\n\t\t */\r\n\r\n\t\tdistanceToCenterSquared(p) {\r\n\r\n\t\t\tconst center = this.getCenter();\r\n\r\n\t\t\tconst dx = p.x - center.x;\r\n\t\t\tconst dy = p.y - center.x;\r\n\t\t\tconst dz = p.z - center.z;\r\n\r\n\t\t\treturn dx * dx + dy * dy + dz * dz;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the given point lies inside this octant's boundaries.\r\n\t\t *\r\n\t\t * This method can also be used to check if this octant intersects a sphere by\r\n\t\t * providing a radius as bias.\r\n\t\t *\r\n\t\t * @method contains\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @param {Number} bias - A padding that extends the boundaries temporarily.\r\n\t\t * @return {Boolean} Whether the given point lies inside this octant.\r\n\t\t */\r\n\r\n\t\tcontains(p, bias) {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst max = this.max;\r\n\r\n\t\t\treturn (\r\n\t\t\t\tp.x >= min.x - bias &&\r\n\t\t\t\tp.y >= min.y - bias &&\r\n\t\t\t\tp.z >= min.z - bias &&\r\n\t\t\t\tp.x <= max.x + bias &&\r\n\t\t\t\tp.y <= max.y + bias &&\r\n\t\t\t\tp.z <= max.z + bias\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Redistributes existing points to child octants.\r\n\t\t *\r\n\t\t * @method redistribute\r\n\t\t * @param {Number} bias - A proximity threshold.\r\n\t\t */\r\n\r\n\t\tredistribute(bias) {\r\n\r\n\t\t\tconst children = this.children;\r\n\t\t\tconst points = this.points;\r\n\r\n\t\t\tlet i, l;\r\n\t\t\tlet child, point, data;\r\n\r\n\t\t\tif(children !== null) {\r\n\r\n\t\t\t\twhile(points.length > 0) {\r\n\r\n\t\t\t\t\tpoint = points.pop();\r\n\t\t\t\t\tdata = this.data.pop();\r\n\r\n\t\t\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\t\t\tchild = children[i];\r\n\r\n\t\t\t\t\t\tif(child.contains(point, bias)) {\r\n\r\n\t\t\t\t\t\t\tif(child.points === null) {\r\n\r\n\t\t\t\t\t\t\t\tchild.points = [];\r\n\t\t\t\t\t\t\t\tchild.data = [];\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t\tchild.points.push(point);\r\n\t\t\t\t\t\t\tchild.data.push(data);\r\n\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.points = null;\r\n\t\t\tthis.data = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Gathers all points from the children. The children are expected to be leaf\r\n\t\t * octants and will be dropped afterwards.\r\n\t\t *\r\n\t\t * @method merge\r\n\t\t * @private\r\n\t\t */\r\n\r\n\t\tmerge() {\r\n\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tlet i, l;\r\n\t\t\tlet child;\r\n\r\n\t\t\tif(children !== null) {\r\n\r\n\t\t\t\tthis.points = [];\r\n\t\t\t\tthis.data = [];\r\n\r\n\t\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\t\tchild = children[i];\r\n\r\n\t\t\t\t\tif(child.points !== null) {\r\n\r\n\t\t\t\t\t\tthis.points.push(...child.points);\r\n\t\t\t\t\t\tthis.data.push(...child.data);\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tthis.children = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds the closest point to the given one.\r\n\t\t *\r\n\t\t * @method findNearestPoint\r\n\t\t * @param {Vector3} p - The point.\r\n\t\t * @param {Number} maxDistance - The maximum distance.\r\n\t\t * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.\r\n\t\t * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.\r\n\t\t */\r\n\r\n\t\tfindNearestPoint(p, maxDistance, skipSelf) {\r\n\r\n\t\t\tconst points = this.points;\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tlet result = null;\r\n\t\t\tlet bestDist = maxDistance;\r\n\r\n\t\t\tlet i, l;\r\n\t\t\tlet point, distSq;\r\n\r\n\t\t\tlet sortedChildren;\r\n\t\t\tlet child, childResult;\r\n\r\n\t\t\tif(children !== null) {\r\n\r\n\t\t\t\t// Sort the children.\r\n\t\t\t\tsortedChildren = children.map(function(child) {\r\n\r\n\t\t\t\t\t// Precompute distances.\r\n\t\t\t\t\treturn {\r\n\t\t\t\t\t\toctant: child,\r\n\t\t\t\t\t\tdistance: child.distanceToCenterSquared(p)\r\n\t\t\t\t\t};\r\n\r\n\t\t\t\t}).sort(function(a, b) {\r\n\r\n\t\t\t\t\t// Smallest distance to p first, ASC.\r\n\t\t\t\t\treturn a.distance - b.distance;\r\n\r\n\t\t\t\t});\r\n\r\n\t\t\t\t// Traverse from closest to furthest.\r\n\t\t\t\tfor(i = 0, l = sortedChildren.length; i < l; ++i) {\r\n\r\n\t\t\t\t\t// Unpack octant.\r\n\t\t\t\t\tchild = sortedChildren[i].octant;\r\n\r\n\t\t\t\t\tif(child.contains(p, bestDist)) {\r\n\r\n\t\t\t\t\t\tchildResult = child.findNearestPoint(p, bestDist, skipSelf);\r\n\r\n\t\t\t\t\t\tif(childResult !== null) {\r\n\r\n\t\t\t\t\t\t\tdistSq = childResult.point.distanceToSquared(p);\r\n\r\n\t\t\t\t\t\t\tif((!skipSelf || distSq > 0.0) && distSq < bestDist) {\r\n\r\n\t\t\t\t\t\t\t\tbestDist = distSq;\r\n\t\t\t\t\t\t\t\tresult = childResult;\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else if(points !== null) {\r\n\r\n\t\t\t\tfor(i = 0, l = points.length; i < l; ++i) {\r\n\r\n\t\t\t\t\tpoint = points[i];\r\n\t\t\t\t\tdistSq = p.distanceToSquared(point);\r\n\r\n\t\t\t\t\tif((!skipSelf || distSq > 0.0) && distSq < bestDist) {\r\n\r\n\t\t\t\t\t\tbestDist = distSq;\r\n\r\n\t\t\t\t\t\tresult = {\r\n\t\t\t\t\t\t\tpoint: point.clone(),\r\n\t\t\t\t\t\t\tdata: this.data[i]\r\n\t\t\t\t\t\t};\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Finds points that are inside the specified radius around a given position.\r\n\t\t *\r\n\t\t * @method findPoints\r\n\t\t * @param {Vector3} p - A position.\r\n\t\t * @param {Number} r - A radius.\r\n\t\t * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.\r\n\t\t * @param {Array} result - An array to be filled with objects, each containing a point and a data property.\r\n\t\t */\r\n\r\n\t\tfindPoints(p, r, skipSelf, result) {\r\n\r\n\t\t\tconst points = this.points;\r\n\t\t\tconst children = this.children;\r\n\t\t\tconst rSq = r * r;\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tlet point, distSq;\r\n\t\t\tlet child;\r\n\r\n\t\t\tif(children !== null) {\r\n\r\n\t\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\t\tchild = children[i];\r\n\r\n\t\t\t\t\tif(child.contains(p, r)) {\r\n\r\n\t\t\t\t\t\tchild.findPoints(p, r, skipSelf, result);\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else if(points !== null) {\r\n\r\n\t\t\t\tfor(i = 0, l = points.length; i < l; ++i) {\r\n\r\n\t\t\t\t\tpoint = points[i];\r\n\t\t\t\t\tdistSq = p.distanceToSquared(point);\r\n\r\n\t\t\t\t\tif((!skipSelf || distSq > 0.0) && distSq <= rSq) {\r\n\r\n\t\t\t\t\t\tresult.push({\r\n\t\t\t\t\t\t\tpoint: point.clone(),\r\n\t\t\t\t\t\t\tdata: this.data[i]\r\n\t\t\t\t\t\t});\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An octree that manages points.\r\n\t *\r\n\t * @class PointOctree\r\n\t * @submodule points\r\n\t * @extends Octree\r\n\t * @constructor\r\n\t * @param {Vector3} min - The lower bounds of the tree.\r\n\t * @param {Vector3} max - The upper bounds of the tree.\r\n\t * @param {Number} [bias=0.0] - A threshold for proximity checks.\r\n\t * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.\r\n\t * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.\r\n\t */\n\n\t/**\r\n\t * Point-oriented octree components.\r\n\t *\r\n\t * @module sparse-octree\r\n\t * @submodule points\r\n\t */\n\n\t/**\r\n\t * Exposure of the library components.\r\n\t *\r\n\t * @module sparse-octree\r\n\t * @main sparse-octree\r\n\t */\n\n\t/**\r\n\t * An enumeration of density constants.\r\n\t *\r\n\t * @class Density\r\n\t * @submodule volume\r\n\t * @static\r\n\t */\r\n\r\n\tconst Density = {\r\n\r\n\t\t/**\r\n\t\t * The index for empty space.\r\n\t\t *\r\n\t\t * @property HOLLOW\r\n\t\t * @type Number\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tHOLLOW: 0,\r\n\r\n\t\t/**\r\n\t\t * The default index for solid material.\r\n\t\t *\r\n\t\t * @property SOLID\r\n\t\t * @type Number\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tSOLID: 1\r\n\r\n\t};\n\n\t/**\r\n\t * A vector with three components.\r\n\t *\r\n\t * @class Vector3\r\n\t * @submodule math\r\n\t * @constructor\r\n\t * @param {Number} [x=0] - The x value.\r\n\t * @param {Number} [y=0] - The y value.\r\n\t * @param {Number} [z=0] - The z value.\r\n\t */\r\n\r\n\tclass Vector3$1 {\r\n\r\n\t\tconstructor(x = 0, y = 0, z = 0) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The x component.\r\n\t\t\t *\r\n\t\t\t * @property x\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.x = x;\r\n\r\n\t\t\t/**\r\n\t\t\t * The y component.\r\n\t\t\t *\r\n\t\t\t * @property y\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.y = y;\r\n\r\n\t\t\t/**\r\n\t\t\t * The z component.\r\n\t\t\t *\r\n\t\t\t * @property z\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.z = z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this vector\r\n\t\t *\r\n\t\t * @method set\r\n\t\t * @chainable\r\n\t\t * @param {Number} x - The x value.\r\n\t\t * @param {Number} y - The y value.\r\n\t\t * @param {Number} z - The z value.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tset(x, y, z) {\r\n\r\n\t\t\tthis.x = x;\r\n\t\t\tthis.y = y;\r\n\t\t\tthis.z = z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of another vector.\r\n\t\t *\r\n\t\t * @method copy\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tcopy(v) {\r\n\r\n\t\t\tthis.x = v.x;\r\n\t\t\tthis.y = v.y;\r\n\t\t\tthis.z = v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from an array.\r\n\t\t *\r\n\t\t * @method fromArray\r\n\t\t * @chainable\r\n\t\t * @param {Array} array - An array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tfromArray(array, offset) {\r\n\r\n\t\t\tif(offset === undefined) { offset = 0; }\r\n\r\n\t\t\tthis.x = array[offset];\r\n\t\t\tthis.y = array[offset + 1];\r\n\t\t\tthis.z = array[offset + 2];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Stores this vector in an array.\r\n\t\t *\r\n\t\t * @method toArray\r\n\t\t * @param {Array} [array] - A target array.\r\n\t\t * @param {Number} offset - An offset.\r\n\t\t * @return {Vector3} The array.\r\n\t\t */\r\n\r\n\t\ttoArray(array, offset) {\r\n\r\n\t\t\tif(array === undefined) { array = []; }\r\n\t\t\tif(offset === undefined) { offset = 0; }\r\n\r\n\t\t\tarray[offset] = this.x;\r\n\t\t\tarray[offset + 1] = this.y;\r\n\t\t\tarray[offset + 2] = this.z;\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this vector equals the given one.\r\n\t\t *\r\n\t\t * @method equals\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Boolean} Whether this vector equals the given one.\r\n\t\t */\r\n\r\n\t\tequals(v) {\r\n\r\n\t\t\treturn (v.x === this.x && v.y === this.y && v.z === this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this vector.\r\n\t\t *\r\n\t\t * @method clone\r\n\t\t * @return {Vector3} A clone of this vector.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor(this.x, this.y, this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a vector to this one.\r\n\t\t *\r\n\t\t * @method add\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} v - The vector to add.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tadd(v) {\r\n\r\n\t\t\tthis.x += v.x;\r\n\t\t\tthis.y += v.y;\r\n\t\t\tthis.z += v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scaled vector to this one.\r\n\t\t *\r\n\t\t * @method addScaledVector\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} v - The vector to scale and add.\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddScaledVector(v, s) {\r\n\r\n\t\t\tthis.x += v.x * s;\r\n\t\t\tthis.y += v.y * s;\r\n\t\t\tthis.z += v.z * s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds a scalar to this vector.\r\n\t\t *\r\n\t\t * @method addScalar\r\n\t\t * @chainable\r\n\t\t * @param {Number} s - The scalar to add.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddScalar(s) {\r\n\r\n\t\t\tthis.x += s;\r\n\t\t\tthis.y += s;\r\n\t\t\tthis.z += s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the sum of two given vectors.\r\n\t\t *\r\n\t\t * @method addVectors\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\taddVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x + b.x;\r\n\t\t\tthis.y = a.y + b.y;\r\n\t\t\tthis.z = a.z + b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a vector from this vector.\r\n\t\t *\r\n\t\t * @method sub\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} v - The vector to subtract.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsub(v) {\r\n\r\n\t\t\tthis.x -= v.x;\r\n\t\t\tthis.y -= v.y;\r\n\t\t\tthis.z -= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts a scalar to this vector.\r\n\t\t *\r\n\t\t * @method subScalar\r\n\t\t * @chainable\r\n\t\t * @param {Number} s - The scalar to subtract.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsubScalar(s) {\r\n\r\n\t\t\tthis.x -= s;\r\n\t\t\tthis.y -= s;\r\n\t\t\tthis.z -= s;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the difference between two given vectors.\r\n\t\t *\r\n\t\t * @method subVectors\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - A second vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tsubVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x - b.x;\r\n\t\t\tthis.y = a.y - b.y;\r\n\t\t\tthis.z = a.z - b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with another vector.\r\n\t\t *\r\n\t\t * @method multiply\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiply(v) {\r\n\r\n\t\t\tthis.x *= v.x;\r\n\t\t\tthis.y *= v.y;\r\n\t\t\tthis.z *= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Multiplies this vector with a given scalar.\r\n\t\t *\r\n\t\t * @method multiplyScalar\r\n\t\t * @chainable\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyScalar(s) {\r\n\r\n\t\t\tif(isFinite(s)) {\r\n\r\n\t\t\t\tthis.x *= s;\r\n\t\t\t\tthis.y *= s;\r\n\t\t\t\tthis.z *= s;\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tthis.x = 0;\r\n\t\t\t\tthis.y = 0;\r\n\t\t\t\tthis.z = 0;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the product of two given vectors.\r\n\t\t *\r\n\t\t * @method multiplyVectors\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmultiplyVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x * b.x;\r\n\t\t\tthis.y = a.y * b.y;\r\n\t\t\tthis.z = a.z * b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by another vector.\r\n\t\t *\r\n\t\t * @method divide\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tdivide(v) {\r\n\r\n\t\t\tthis.x /= v.x;\r\n\t\t\tthis.y /= v.y;\r\n\t\t\tthis.z /= v.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Divides this vector by a given scalar.\r\n\t\t *\r\n\t\t * @method divideScalar\r\n\t\t * @chainable\r\n\t\t * @param {Number} s - A scalar.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tdivideScalar(s) {\r\n\r\n\t\t\treturn this.multiplyScalar(1 / s);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this vector to the quotient of two given vectors.\r\n\t\t *\r\n\t\t * @method divideVectors\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} a - A vector.\r\n\t\t * @param {Vector3} b - Another vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tdivideVectors(a, b) {\r\n\r\n\t\t\tthis.x = a.x / b.x;\r\n\t\t\tthis.y = a.y / b.y;\r\n\t\t\tthis.z = a.z / b.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Negates this vector.\r\n\t\t *\r\n\t\t * @method negate\r\n\t\t * @chainable\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tnegate() {\r\n\r\n\t\t\tthis.x = -this.x;\r\n\t\t\tthis.y = -this.y;\r\n\t\t\tthis.z = -this.z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the dot product with another vector.\r\n\t\t *\r\n\t\t * @method dot\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The dot product.\r\n\t\t */\r\n\r\n\t\tdot(v) {\r\n\r\n\t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared length of this vector.\r\n\t\t *\r\n\t\t * @method lengthSq\r\n\t\t * @return {Number} The squared length.\r\n\t\t */\r\n\r\n\t\tlengthSq() {\r\n\r\n\t\t\treturn this.x * this.x + this.y * this.y + this.z * this.z;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the length of this vector.\r\n\t\t *\r\n\t\t * @method length\r\n\t\t * @return {Number} The length.\r\n\t\t */\r\n\r\n\t\tlength() {\r\n\r\n\t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the distance to a given vector.\r\n\t\t *\r\n\t\t * @method distanceTo\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The distance.\r\n\t\t */\r\n\r\n\t\tdistanceTo(v) {\r\n\r\n\t\t\treturn Math.sqrt(this.distanceToSquared(v));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the squared distance to a given vector.\r\n\t\t *\r\n\t\t * @method distanceToSquared\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Number} The squared distance.\r\n\t\t */\r\n\r\n\t\tdistanceToSquared(v) {\r\n\r\n\t\t\tconst dx = this.x - v.x;\r\n\t\t\tconst dy = this.y - v.y;\r\n\t\t\tconst dz = this.z - v.z;\r\n\r\n\t\t\treturn dx * dx + dy * dy + dz * dz;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Normalizes this vector.\r\n\t\t *\r\n\t\t * @method normalize\r\n\t\t * @chainable\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tnormalize() {\r\n\r\n\t\t\treturn this.divideScalar(this.length());\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the min value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @method min\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmin(v) {\r\n\r\n\t\t\tthis.x = Math.min(this.x, v.x);\r\n\t\t\tthis.y = Math.min(this.y, v.y);\r\n\t\t\tthis.z = Math.min(this.z, v.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * adopts the max value for each component of this vector and the given one.\r\n\t\t *\r\n\t\t * @method max\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} v - A vector.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tmax(v) {\r\n\r\n\t\t\tthis.x = Math.max(this.x, v.x);\r\n\t\t\tthis.y = Math.max(this.y, v.y);\r\n\t\t\tthis.z = Math.max(this.z, v.z);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clamps this vector.\r\n\t\t *\r\n\t\t * @method clamp\r\n\t\t * @chainable\r\n\t\t * @param {Vector3} min - A vector, assumed to be smaller than max.\r\n\t\t * @param {Vector3} max - A vector, assumed to be greater than min.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tclamp(min, max) {\r\n\r\n\t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\r\n\t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\r\n\t\t\tthis.z = Math.max(min.z, Math.min(max.z, this.z));\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a matrix to this vector.\r\n\t\t *\r\n\t\t * @method applyMatrix3\r\n\t\t * @chainable\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tapplyMatrix3(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[3] * y + e[6] * z;\r\n\t\t\tthis.y = e[1] * x + e[4] * y + e[7] * z;\r\n\t\t\tthis.z = e[2] * x + e[5] * y + e[8] * z;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies a matrix to this vector.\r\n\t\t *\r\n\t\t * @method applyMatrix4\r\n\t\t * @chainable\r\n\t\t * @param {Matrix4} m - A matrix.\r\n\t\t * @return {Vector3} This vector.\r\n\t\t */\r\n\r\n\t\tapplyMatrix4(m) {\r\n\r\n\t\t\tconst x = this.x, y = this.y, z = this.z;\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z + e[12];\r\n\t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z + e[13];\r\n\t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z + e[14];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A symmetric 3x3 matrix.\r\n\t *\r\n\t * @class SymmetricMatrix3\r\n\t * @submodule math\r\n\t * @constructor\r\n\t */\r\n\r\n\tclass SymmetricMatrix3 {\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * The matrix elements.\r\n\t\t\t *\r\n\t\t\t * @property elements\r\n\t\t\t * @type Float32Array\r\n\t\t\t */\r\n\r\n\t\t\tthis.elements = new Float32Array([\r\n\r\n\t\t\t\t1, 0, 0,\r\n\t\t\t\t1, 0,\r\n\t\t\t\t1\r\n\r\n\t\t\t]);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this matrix.\r\n\t\t *\r\n\t\t * @method set\r\n\t\t * @chainable\r\n\t\t * @param {Number} m00 - The value of the first row, first column.\r\n\t\t * @param {Number} m01 - The value of the first row, second column.\r\n\t\t * @param {Number} m02 - The value of the first row, third column.\r\n\t\t * @param {Number} m11 - The value of the second row, second column.\r\n\t\t * @param {Number} m12 - The value of the second row, third column.\r\n\t\t * @param {Number} m22 - The value of the third row, third column.\r\n\t\t * @return {SymmetricMatrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tset(m00, m01, m02, m11, m12, m22) {\r\n\r\n\t\t\tconst e = this.elements;\r\n\r\n\t\t\te[0] = m00; e[1] = m01; e[2] = m02;\r\n\t\t\te[3] = m11; e[4] = m12;\r\n\t\t\te[5] = m22;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this matrix to the identity matrix.\r\n\t\t *\r\n\t\t * @method identity\r\n\t\t * @chainable\r\n\t\t * @return {SymmetricMatrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tidentity() {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\t1, 0, 0,\r\n\t\t\t\t1, 0,\r\n\t\t\t\t1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from a given matrix.\r\n\t\t *\r\n\t\t * @method copy\r\n\t\t * @chainable\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {SymmetricMatrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tcopy(m) {\r\n\r\n\t\t\tconst me = m.elements;\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\tme[0], me[1], me[2],\r\n\t\t\t\tme[3], me[4],\r\n\t\t\t\tme[5]\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this matrix.\r\n\t\t *\r\n\t\t * @method clone\r\n\t\t * @return {SymmetricMatrix3} A clone of this matrix.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds the values of a given matrix to this one.\r\n\t\t *\r\n\t\t * @method add\r\n\t\t * @chainable\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {SymmetricMatrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tadd(m) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\t\t\tconst me = m.elements;\r\n\r\n\t\t\tte[0] += me[0]; te[1] += me[1]; te[2] += me[2];\r\n\t\t\tte[3] += me[3]; te[4] += me[4];\r\n\t\t\tte[5] += me[5];\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Frobenius norm of this matrix.\r\n\t\t *\r\n\t\t * @method norm\r\n\t\t * @return {Number} The norm of this matrix.\r\n\t\t */\r\n\r\n\t\tnorm() {\r\n\r\n\t\t\tconst e = this.elements;\r\n\r\n\t\t\tconst m01m01 = e[1] * e[1];\r\n\t\t\tconst m02m02 = e[2] * e[2];\r\n\t\t\tconst m12m12 = e[4] * e[4];\r\n\r\n\t\t\treturn Math.sqrt(\r\n\r\n\t\t\t\te[0] * e[0] + m01m01 + m02m02 +\r\n\t\t\t\tm01m01 + e[3] * e[3] + m12m12 +\r\n\t\t\t\tm02m02 + m12m12 + e[5] * e[5]\r\n\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the absolute sum of all matrix components except for the main\r\n\t\t * diagonal.\r\n\t\t *\r\n\t\t * @method off\r\n\t\t * @return {Number} The offset of this matrix.\r\n\t\t */\r\n\r\n\t\toff() {\r\n\r\n\t\t\tconst e = this.elements;\r\n\r\n\t\t\treturn Math.sqrt(2 * (\r\n\r\n\t\t\t\t// Diagonal = [0, 3, 5].\r\n\t\t\t\te[1] * e[1] + e[2] * e[2] + e[4] * e[4]\r\n\r\n\t\t\t));\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Applies this symmetric matrix to a vector.\r\n\t\t *\r\n\t\t * @method applyToVector3\r\n\t\t * @param {Vector3} v - The vector to modify.\r\n\t\t * @return {Vector3} The modified vector.\r\n\t\t */\r\n\r\n\t\tapplyToVector3(v) {\r\n\r\n\t\t\tconst x = v.x, y = v.y, z = v.z;\r\n\t\t\tconst e = this.elements;\r\n\r\n\t\t\tv.x = e[0] * x + e[1] * y + e[2] * z;\r\n\t\t\tv.y = e[1] * x + e[3] * y + e[4] * z;\r\n\t\t\tv.z = e[2] * x + e[4] * y + e[5] * z;\r\n\r\n\t\t\treturn v;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A data container for the QEF solver.\r\n\t *\r\n\t * @class QEFData\r\n\t * @submodule math\r\n\t * @constructor\r\n\t */\r\n\r\n\tclass QEFData {\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * A symmetric matrix.\r\n\t\t\t *\r\n\t\t\t * @property ata\r\n\t\t\t * @type SymmetricMatrix3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.ata = new SymmetricMatrix3();\r\n\r\n\t\t\tthis.ata.set(\r\n\r\n\t\t\t\t0, 0, 0,\r\n\t\t\t\t0, 0,\r\n\t\t\t\t0\r\n\r\n\t\t\t);\r\n\r\n\t\t\t/**\r\n\t\t\t * A vector.\r\n\t\t\t *\r\n\t\t\t * @property atb\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.atb = new Vector3$1();\r\n\r\n\t\t\t/**\r\n\t\t\t * Used to calculate the error of the computed position.\r\n\t\t\t *\r\n\t\t\t * @property btb\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.btb = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * An accumulation of the surface intersection points.\r\n\t\t\t *\r\n\t\t\t * @property massPoint\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.massPoint = new Vector3$1();\r\n\r\n\t\t\t/**\r\n\t\t\t * The amount of accumulated surface intersection points.\r\n\t\t\t *\r\n\t\t\t * @property numPoints\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.numPoints = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * The dimension of the mass point. This value is used when mass points are\r\n\t\t\t * accumulated during voxel cell clustering.\r\n\t\t\t *\r\n\t\t\t * @property massPointDimension\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.massPointDimension = 0;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this data instance.\r\n\t\t *\r\n\t\t * @method set\r\n\t\t * @chainable\r\n\t\t * @return {QEFData} This data.\r\n\t\t */\r\n\r\n\t\tset(ata, atb, btb, massPoint, numPoints) {\r\n\r\n\t\t\tthis.ata.copy(ata);\r\n\t\t\tthis.atb.copy(atb);\r\n\t\t\tthis.btb = btb;\r\n\r\n\t\t\tthis.massPoint.copy(massPoint);\r\n\t\t\tthis.numPoints = numPoints;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies values from a given data instance.\r\n\t\t *\r\n\t\t * @method copy\r\n\t\t * @chainable\r\n\t\t * @return {QEFData} This data.\r\n\t\t */\r\n\r\n\t\tcopy(d) {\r\n\r\n\t\t\treturn this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds the given surface intersection point and normal.\r\n\t\t *\r\n\t\t * @method add\r\n\t\t * @param {Vector3} p - An intersection point.\r\n\t\t * @param {Vector3} n - A surface normal.\r\n\t\t */\r\n\r\n\t\tadd(p, n) {\r\n\r\n\t\t\tconst nx = n.x;\r\n\t\t\tconst ny = n.y;\r\n\t\t\tconst nz = n.z;\r\n\r\n\t\t\tconst dot = n.dot(p);\r\n\r\n\t\t\tconst ata = this.ata.elements;\r\n\t\t\tconst atb = this.atb;\r\n\r\n\t\t\tata[0] += nx * nx; ata[1] += nx * ny; ata[2] += nx * nz;\r\n\t\t\tata[3] += ny * ny; ata[4] += ny * nz;\r\n\t\t\tata[5] += nz * nz;\r\n\r\n\t\t\tatb.x += dot * nx;\r\n\t\t\tatb.y += dot * ny;\r\n\t\t\tatb.z += dot * nz;\r\n\r\n\t\t\tthis.btb += dot * dot;\r\n\r\n\t\t\tthis.massPoint.add(p);\r\n\r\n\t\t\t++this.numPoints;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds an entire data set.\r\n\t\t *\r\n\t\t * @method addData\r\n\t\t * @param {QEFData} d - QEF data.\r\n\t\t */\r\n\r\n\t\taddData(d) {\r\n\r\n\t\t\tthis.ata.add(d.ata);\r\n\t\t\tthis.atb.add(d.atb);\r\n\t\t\tthis.btb += d.btb;\r\n\r\n\t\t\tif(this.massPointDimension === d.massPointDimension) {\r\n\r\n\t\t\t\tthis.massPoint.add(d.massPoint);\r\n\t\t\t\tthis.numPoints += d.numPoints;\r\n\r\n\t\t\t} else if(d.massPointDimension > this.massPointDimension) {\r\n\r\n\t\t\t\t// Adopt the mass point of the higher dimension.\r\n\t\t\t\tthis.massPoint.copy(d.massPoint);\r\n\t\t\t\tthis.massPointDimension = d.massPointDimension;\r\n\t\t\t\tthis.numPoints = d.numPoints;\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clears this data.\r\n\t\t *\r\n\t\t * @method clear\r\n\t\t */\r\n\r\n\t\tclear() {\r\n\r\n\t\t\tthis.ata.set(\r\n\r\n\t\t\t\t0, 0, 0,\r\n\t\t\t\t0, 0,\r\n\t\t\t\t0\r\n\r\n\t\t\t);\r\n\r\n\t\t\tthis.atb.set(0, 0, 0);\r\n\t\t\tthis.btb = 0;\r\n\r\n\t\t\tthis.massPoint.set(0, 0, 0);\r\n\t\t\tthis.numPoints = 0;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this data.\r\n\t\t *\r\n\t\t * @method clone\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A 3x3 matrix.\r\n\t *\r\n\t * This class is a copy of THREE.Matrix3. It can be removed as soon as three.js\r\n\t * starts supporting ES6 modules.\r\n\t *\r\n\t * @class Matrix3\r\n\t * @submodule math\r\n\t * @constructor\r\n\t */\r\n\r\n\tclass Matrix3 {\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * The matrix elements.\r\n\t\t\t *\r\n\t\t\t * @property elements\r\n\t\t\t * @type Float32Array\r\n\t\t\t */\r\n\r\n\t\t\tthis.elements = new Float32Array([\r\n\r\n\t\t\t\t1, 0, 0,\r\n\t\t\t\t0, 1, 0,\r\n\t\t\t\t0, 0, 1\r\n\r\n\t\t\t]);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this matrix.\r\n\t\t *\r\n\t\t * @method set\r\n\t\t * @chainable\r\n\t\t * @param {Number} m00 - The value of the first row, first column.\r\n\t\t * @param {Number} m01 - The value of the first row, second column.\r\n\t\t * @param {Number} m02 - The value of the first row, third column.\r\n\t\t * @param {Number} m10 - The value of the second row, first column.\r\n\t\t * @param {Number} m11 - The value of the second row, second column.\r\n\t\t * @param {Number} m12 - The value of the second row, third column.\r\n\t\t * @param {Number} m20 - The value of the third row, first column.\r\n\t\t * @param {Number} m21 - The value of the third row, second column.\r\n\t\t * @param {Number} m22 - The value of the third row, third column.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tset(m00, m01, m02, m10, m11, m12, m20, m21, m22) {\r\n\r\n\t\t\tconst te = this.elements;\r\n\r\n\t\t\tte[0] = m00; te[1] = m10; te[2] = m20;\r\n\t\t\tte[3] = m01; te[4] = m11; te[5] = m21;\r\n\t\t\tte[6] = m02; te[7] = m12; te[8] = m22;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets this matrix to the identity matrix.\r\n\t\t *\r\n\t\t * @method identity\r\n\t\t * @chainable\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tidentity() {\r\n\r\n\t\t\tthis.set(\r\n\r\n\t\t\t\t1, 0, 0,\r\n\t\t\t\t0, 1, 0,\r\n\t\t\t\t0, 0, 1\r\n\r\n\t\t\t);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given matrix.\r\n\t\t *\r\n\t\t * @method copy\r\n\t\t * @chainable\r\n\t\t * @param {Matrix3} m - A matrix.\r\n\t\t * @return {Matrix3} This matrix.\r\n\t\t */\r\n\r\n\t\tcopy(m) {\r\n\r\n\t\t\tconst me = m.elements;\r\n\r\n\t\t\treturn this.set(\r\n\r\n\t\t\t\tme[0], me[3], me[6],\r\n\t\t\t\tme[1], me[4], me[7],\r\n\t\t\t\tme[2], me[5], me[8]\r\n\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this matrix.\r\n\t\t *\r\n\t\t * @method clone\r\n\t\t * @return {Matrix3} A clone of this matrix.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A collection of matrix rotation utilities.\r\n\t *\r\n\t * @class Givens\r\n\t * @submodule math\r\n\t * @static\r\n\t */\r\n\r\n\tclass Givens {\r\n\r\n\t\t/**\r\n\t\t * Rotates the given matrix.\r\n\t\t *\r\n\t\t * @method rot01Post\r\n\t\t * @static\r\n\t\t * @param {Matrix3} m - The target vector.\r\n\t\t * @param {Object} coefficients - Two coefficients.\r\n\t\t */\r\n\r\n\t\tstatic rot01Post(m, coefficients) {\r\n\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tconst m00 = e[0], m01 = e[3];\r\n\t\t\tconst m10 = e[1], m11 = e[4];\r\n\t\t\tconst m20 = e[2], m21 = e[5];\r\n\r\n\t\t\tconst c = coefficients.c;\r\n\t\t\tconst s = coefficients.s;\r\n\r\n\t\t\te[0] = c * m00 - s * m01;\r\n\t\t\te[3] = s * m00 + c * m01;\r\n\t\t\t// e[6] = m02;\r\n\r\n\t\t\te[1] = c * m10 - s * m11;\r\n\t\t\te[4] = s * m10 + c * m11;\r\n\t\t\t// e[7] = m12;\r\n\r\n\t\t\te[2] = c * m20 - s * m21;\r\n\t\t\te[5] = s * m20 + c * m21;\r\n\t\t\t// e[8] = m22;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rotates the given matrix.\r\n\t\t *\r\n\t\t * @method rot02Post\r\n\t\t * @static\r\n\t\t * @param {Matrix3} m - The target vector.\r\n\t\t * @param {Object} coefficients - Two coefficients.\r\n\t\t */\r\n\r\n\t\tstatic rot02Post(m, coefficients) {\r\n\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tconst m00 = e[0], m02 = e[6];\r\n\t\t\tconst m10 = e[1], m12 = e[7];\r\n\t\t\tconst m20 = e[2], m22 = e[8];\r\n\r\n\t\t\tconst c = coefficients.c;\r\n\t\t\tconst s = coefficients.s;\r\n\r\n\t\t\te[0] = c * m00 - s * m02;\r\n\t\t\t// e[3] = m01;\r\n\t\t\te[6] = s * m00 + c * m02;\r\n\r\n\t\t\te[1] = c * m10 - s * m12;\r\n\t\t\t// e[4] = m11;\r\n\t\t\te[7] = s * m10 + c * m12;\r\n\r\n\t\t\te[2] = c * m20 - s * m22;\r\n\t\t\t// e[5] = m21;\r\n\t\t\te[8] = s * m20 + c * m22;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rotates the given matrix.\r\n\t\t *\r\n\t\t * @method rot12Post\r\n\t\t * @static\r\n\t\t * @param {Matrix3} m - The target vector.\r\n\t\t * @param {Object} coefficients - Two coefficients.\r\n\t\t */\r\n\r\n\t\tstatic rot12Post(m, coefficients) {\r\n\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tconst m01 = e[3], m02 = e[6];\r\n\t\t\tconst m11 = e[4], m12 = e[7];\r\n\t\t\tconst m21 = e[5], m22 = e[8];\r\n\r\n\t\t\tconst c = coefficients.c;\r\n\t\t\tconst s = coefficients.s;\r\n\r\n\t\t\t// e[0] = m00;\r\n\t\t\te[3] = c * m01 - s * m02;\r\n\t\t\te[6] = s * m01 + c * m02;\r\n\r\n\t\t\t// e[1] = m10;\r\n\t\t\te[4] = c * m11 - s * m12;\r\n\t\t\te[7] = s * m11 + c * m12;\r\n\r\n\t\t\t// e[2] = m20;\r\n\t\t\te[5] = c * m21 - s * m22;\r\n\t\t\te[8] = s * m21 + c * m22;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Symmetric Givens coefficients.\r\n\t *\r\n\t * @property coefficients\r\n\t * @type Object\r\n\t * @private\r\n\t * @static\r\n\t */\r\n\r\n\tconst coefficients = {\r\n\t\tc: 0.0,\r\n\t\ts: 0.0\r\n\t};\r\n\r\n\t/**\r\n\t * Caluclates symmetric coefficients for the Givens post rotation step.\r\n\t *\r\n\t * @method calculateSymmetricCoefficients\r\n\t * @private\r\n\t * @static\r\n\t * @param {Number} aPP - PP.\r\n\t * @param {Number} aPQ - PQ.\r\n\t * @param {Number} aQQ - QQ.\r\n\t */\r\n\r\n\tfunction calculateSymmetricCoefficients(aPP, aPQ, aQQ) {\r\n\r\n\t\tlet tau, stt, tan;\r\n\r\n\t\tif(aPQ === 0) {\r\n\r\n\t\t\tcoefficients.c = 1;\r\n\t\t\tcoefficients.s = 0;\r\n\r\n\t\t} else {\r\n\r\n\t\t\ttau = (aQQ - aPP) / (2.0 * aPQ);\r\n\t\t\tstt = Math.sqrt(1.0 + tau * tau);\r\n\t\t\ttan = 1.0 / ((tau >= 0.0) ? (tau + stt) : (tau - stt));\r\n\r\n\t\t\tcoefficients.c = 1.0 / Math.sqrt(1.0 + tan * tan);\r\n\t\t\tcoefficients.s = tan * coefficients.c;\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A collection of matrix rotation utilities.\r\n\t *\r\n\t * @class Schur\r\n\t * @submodule math\r\n\t * @static\r\n\t */\r\n\r\n\tclass Schur {\r\n\r\n\t\t/**\r\n\t\t * Rotates the given matrix.\r\n\t\t *\r\n\t\t * @method rot01\r\n\t\t * @static\r\n\t\t * @param {SymmetricMatrix3} m - A symmetric matrix.\r\n\t\t * @return {Object} The coefficients.\r\n\t\t */\r\n\r\n\t\tstatic rot01(m) {\r\n\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tconst m00 = e[0], m01 = e[1], m02 = e[2];\r\n\t\t\tconst m11 = e[3], m12 = e[4];\r\n\r\n\t\t\tcalculateSymmetricCoefficients(m00, m01, m11);\r\n\r\n\t\t\tconst c = coefficients.c, s = coefficients.s;\r\n\t\t\tconst cc = c * c, ss = s * s;\r\n\r\n\t\t\tconst mix = 2.0 * c * s * m01;\r\n\r\n\t\t\te[0] = cc * m00 - mix + ss * m11;\r\n\t\t\te[1] = 0;\r\n\t\t\te[2] = c * m02 - s * m12;\r\n\r\n\t\t\te[3] = ss * m00 + mix + cc * m11;\r\n\t\t\te[4] = s * m02 + c * m12;\r\n\r\n\t\t\t// e[5] = m22;\r\n\r\n\t\t\treturn coefficients;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rotates the given matrix.\r\n\t\t *\r\n\t\t * @method rot02\r\n\t\t * @static\r\n\t\t * @param {SymmetricMatrix3} m - A matrix.\r\n\t\t * @return {Object} The coefficients.\r\n\t\t */\r\n\r\n\t\tstatic rot02(m) {\r\n\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tconst m00 = e[0], m01 = e[1], m02 = e[2];\r\n\t\t\tconst m12 = e[4];\r\n\t\t\tconst m22 = e[5];\r\n\r\n\t\t\tcalculateSymmetricCoefficients(m00, m02, m22);\r\n\r\n\t\t\tconst c = coefficients.c, s = coefficients.s;\r\n\t\t\tconst cc = c * c, ss = s * s;\r\n\r\n\t\t\tconst mix = 2.0 * c * s * m02;\r\n\r\n\t\t\te[0] = cc * m00 - mix + ss * m22;\r\n\t\t\te[1] = c * m01 - s * m12;\r\n\t\t\te[2] = 0;\r\n\r\n\t\t\t// e[3] = m11;\r\n\t\t\te[4] = s * m01 + c * m12;\r\n\r\n\t\t\te[5] = ss * m00 + mix + cc * m22;\r\n\r\n\t\t\treturn coefficients;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Rotates the given matrix.\r\n\t\t *\r\n\t\t * @method rot12\r\n\t\t * @static\r\n\t\t * @param {SymmetricMatrix3} m - A matrix.\r\n\t\t * @return {Object} The coefficients.\r\n\t\t */\r\n\r\n\t\tstatic rot12(m) {\r\n\r\n\t\t\tconst e = m.elements;\r\n\r\n\t\t\tconst m01 = e[1], m02 = e[2];\r\n\t\t\tconst m11 = e[3], m12 = e[4];\r\n\t\t\tconst m22 = e[5];\r\n\r\n\t\t\tcalculateSymmetricCoefficients(m11, m12, m22);\r\n\r\n\t\t\tconst c = coefficients.c, s = coefficients.s;\r\n\t\t\tconst cc = c * c, ss = s * s;\r\n\r\n\t\t\tconst mix = 2.0 * c * s * m12;\r\n\r\n\t\t\t// e[0] = m00;\r\n\t\t\te[1] = c * m01 - s * m02;\r\n\t\t\te[2] = s * m01 + c * m02;\r\n\r\n\t\t\te[3] = cc * m11 - mix + ss * m22;\r\n\t\t\te[4] = 0;\r\n\r\n\t\t\te[5] = ss * m11 + mix + cc * m22;\r\n\r\n\t\t\treturn coefficients;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Rotates the given matrix.\r\n\t *\r\n\t * @method rotate01\r\n\t * @private\r\n\t * @static\r\n\t * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n\t * @param {Matrix3} v - A matrix.\r\n\t */\r\n\r\n\tfunction rotate01(vtav, v) {\r\n\r\n\t\tconst m01 = vtav.elements[1];\r\n\r\n\t\tif(m01 !== 0) {\r\n\r\n\t\t\tGivens.rot01Post(v, Schur.rot01(vtav));\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Rotates the given matrix.\r\n\t *\r\n\t * @method rotate02\r\n\t * @private\r\n\t * @static\r\n\t * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n\t * @param {Matrix3} v - A matrix.\r\n\t */\r\n\r\n\tfunction rotate02(vtav, v) {\r\n\r\n\t\tconst m02 = vtav.elements[2];\r\n\r\n\t\tif(m02 !== 0) {\r\n\r\n\t\t\tGivens.rot02Post(v, Schur.rot02(vtav));\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Rotates the given matrix.\r\n\t *\r\n\t * @method rotate12\r\n\t * @private\r\n\t * @static\r\n\t * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n\t * @param {Matrix3} v - A matrix.\r\n\t */\r\n\r\n\tfunction rotate12(vtav, v) {\r\n\r\n\t\tconst m12 = vtav.elements[4];\r\n\r\n\t\tif(m12 !== 0) {\r\n\r\n\t\t\tGivens.rot12Post(v, Schur.rot12(vtav));\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Computes the symmetric Singular Value Decomposition.\r\n\t *\r\n\t * @method getSymmetricSVD\r\n\t * @private\r\n\t * @static\r\n\t * @param {SymmetricMatrix3} a - A symmetric matrix.\r\n\t * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n\t * @param {Matrix3} v - A matrix.\r\n\t * @param {Number} threshold - A threshold.\r\n\t * @param {Number} maxSweeps - The maximum number of sweeps.\r\n\t */\r\n\r\n\tfunction getSymmetricSVD(a, vtav, v, threshold, maxSweeps) {\r\n\r\n\t\tconst delta = threshold * vtav.copy(a).norm();\r\n\r\n\t\tlet i;\r\n\r\n\t\tfor(i = 0; i < maxSweeps && vtav.off() > delta; ++i) {\r\n\r\n\t\t\trotate01(vtav, v);\r\n\t\t\trotate02(vtav, v);\r\n\t\t\trotate12(vtav, v);\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Computes the pseudo inverse of a given value.\r\n\t *\r\n\t * @method pinv\r\n\t * @private\r\n\t * @static\r\n\t * @param {Number} x - The value to invert.\r\n\t * @param {Number} threshold - A threshold.\r\n\t * @return {Number} The inverted value.\r\n\t */\r\n\r\n\tfunction pinv(x, threshold) {\r\n\r\n\t\tconst invX = 1.0 / x;\r\n\r\n\t\treturn (Math.abs(x) < threshold || Math.abs(invX) < threshold) ? 0.0 : invX;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Calculates the pseudo inverse of the given matrix.\r\n\t *\r\n\t * @method pseudoInverse\r\n\t * @private\r\n\t * @static\r\n\t * @param {Matrix3} t - The target matrix.\r\n\t * @param {SymmetricMatrix3} a - A symmetric matrix.\r\n\t * @param {Matrix3} b - A matrix.\r\n\t * @param {Number} threshold - A threshold.\r\n\t * @return {Number} A dimension indicating the amount of truncated singular values.\r\n\t */\r\n\r\n\tfunction pseudoInverse(t, a, b, threshold) {\r\n\r\n\t\tconst te = t.elements;\r\n\t\tconst ae = a.elements;\r\n\t\tconst be = b.elements;\r\n\r\n\t\tconst a00 = ae[0];\r\n\t\tconst a11 = ae[3];\r\n\t\tconst a22 = ae[5];\r\n\r\n\t\tconst a0 = pinv(a00, threshold);\r\n\t\tconst a1 = pinv(a11, threshold);\r\n\t\tconst a2 = pinv(a22, threshold);\r\n\r\n\t\t// Count how many singular values have been truncated.\r\n\t\tconst truncatedValues = (a0 === 0.0) + (a1 === 0.0) + (a2 === 0.0);\r\n\r\n\t\t// Compute the feature dimension.\r\n\t\tconst dimension = 3 - truncatedValues;\r\n\r\n\t\tconst b00 = be[0], b01 = be[3], b02 = be[6];\r\n\t\tconst b10 = be[1], b11 = be[4], b12 = be[7];\r\n\t\tconst b20 = be[2], b21 = be[5], b22 = be[8];\r\n\r\n\t\tte[0] = b00 * a0 * b00 + b01 * a1 * b01 + b02 * a2 * b02;\r\n\t\tte[3] = b00 * a0 * b10 + b01 * a1 * b11 + b02 * a2 * b12;\r\n\t\tte[6] = b00 * a0 * b20 + b01 * a1 * b21 + b02 * a2 * b22;\r\n\r\n\t\tte[1] = te[3];\r\n\t\tte[4] = b10 * a0 * b10 + b11 * a1 * b11 + b12 * a2 * b12;\r\n\t\tte[7] = b10 * a0 * b20 + b11 * a1 * b21 + b12 * a2 * b22;\r\n\r\n\t\tte[2] = te[6];\r\n\t\tte[5] = te[7];\r\n\t\tte[8] = b20 * a0 * b20 + b21 * a1 * b21 + b22 * a2 * b22;\r\n\r\n\t\treturn dimension;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A Singular Value Decomposition solver.\r\n\t *\r\n\t * @class SingularValueDecomposition\r\n\t * @submodule math\r\n\t * @static\r\n\t */\r\n\r\n\tclass SingularValueDecomposition {\r\n\r\n\t\t/**\r\n\t\t * Performs the Singular Value Decomposition.\r\n\t\t *\r\n\t\t * @method solveSymmetric\r\n\t\t * @static\r\n\t\t * @param {SymmetricMatrix3} a - A symmetric matrix.\r\n\t\t * @param {Vector3} b - A vector.\r\n\t\t * @param {Vector3} x - A target vector.\r\n\t\t * @param {Number} svdThreshold - A threshold.\r\n\t\t * @param {Number} svdSweeps - The maximum number of SVD sweeps.\r\n\t\t * @param {Number} pseudoInverseThreshold - A threshold.\r\n\t\t * @return {Number} A dimension indicating the amount of truncated singular values.\r\n\t\t */\r\n\r\n\t\tstatic solveSymmetric(a, b, x, svdThreshold, svdSweeps, pseudoInverseThreshold) {\r\n\r\n\t\t\tconst v = new Matrix3();\r\n\r\n\t\t\tconst pinv = new Matrix3();\r\n\t\t\tconst vtav = new SymmetricMatrix3();\r\n\r\n\t\t\tlet dimension;\r\n\r\n\t\t\tpinv.set(\r\n\r\n\t\t\t\t0, 0, 0,\r\n\t\t\t\t0, 0, 0,\r\n\t\t\t\t0, 0, 0\r\n\r\n\t\t\t);\r\n\r\n\t\t\tvtav.set(\r\n\r\n\t\t\t\t0, 0, 0,\r\n\t\t\t\t0, 0,\r\n\t\t\t\t0\r\n\r\n\t\t\t);\r\n\r\n\t\t\tgetSymmetricSVD(a, vtav, v, svdThreshold, svdSweeps);\r\n\r\n\t\t\t// Least squares.\r\n\t\t\tdimension = pseudoInverse(pinv, vtav, v, pseudoInverseThreshold);\r\n\r\n\t\t\tx.copy(b).applyMatrix3(pinv);\r\n\r\n\t\t\treturn dimension;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the error of the Singular Value Decomposition.\r\n\t\t *\r\n\t\t * @method calculateError\r\n\t\t * @static\r\n\t\t * @param {SymmetricMatrix3} t - A symmetric matrix.\r\n\t\t * @param {Vector3} b - A vector.\r\n\t\t * @param {Vector3} x - The calculated position.\r\n\t\t * @return {Number} The error.\r\n\t\t */\r\n\r\n\t\tstatic calculateError(t, b, x) {\r\n\r\n\t\t\tconst e = t.elements;\r\n\t\t\tconst v = x.clone();\r\n\t\t\tconst a = new Matrix3();\r\n\r\n\t\t\t// Set symmetrically.\r\n\t\t\ta.set(\r\n\r\n\t\t\t\te[0], e[1], e[2],\r\n\t\t\t\te[1], e[3], e[4],\r\n\t\t\t\te[2], e[4], e[5]\r\n\r\n\t\t\t);\r\n\r\n\t\t\tv.applyMatrix3(a);\r\n\t\t\tv.subVectors(b, v);\r\n\r\n\t\t\treturn v.lengthSq();\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A Quaratic Error Function solver.\r\n\t *\r\n\t * Finds a point inside a voxel that minimises the sum of the squares of the\r\n\t * distances to the surface intersection planes associated with the voxel.\r\n\t *\r\n\t * @class QEFSolver\r\n\t * @submodule math\r\n\t * @constructor\r\n\t * @param {Number} [svdThreshold=1e-6] - A threshold for the Singular Value Decomposition error.\r\n\t * @param {Number} [svdSweeps=4] - Number of Singular Value Decomposition sweeps.\r\n\t * @param {Number} [pseudoInverseThreshold=1e-6] - A threshold for the pseudo inverse error.\r\n\t */\r\n\r\n\tclass QEFSolver {\r\n\r\n\t\tconstructor(svdThreshold = 1e-6, svdSweeps = 4, pseudoInverseThreshold = 1e-6) {\r\n\r\n\t\t\t/**\r\n\t\t\t * A Singular Value Decomposition error threshold.\r\n\t\t\t *\r\n\t\t\t * @property svdThreshold\r\n\t\t\t * @type Number\r\n\t\t\t * @private\r\n\t\t\t * @default 1e-6\r\n\t\t\t */\r\n\r\n\t\t\tthis.svdThreshold = svdThreshold;\r\n\r\n\t\t\t/**\r\n\t\t\t * The number of Singular Value Decomposition sweeps.\r\n\t\t\t *\r\n\t\t\t * @property svdSweeps\r\n\t\t\t * @type Number\r\n\t\t\t * @private\r\n\t\t\t * @default 4\r\n\t\t\t */\r\n\r\n\t\t\tthis.svdSweeps = svdSweeps;\r\n\r\n\t\t\t/**\r\n\t\t\t * A pseudo inverse error threshold.\r\n\t\t\t *\r\n\t\t\t * @property pseudoInverseThreshold\r\n\t\t\t * @type Number\r\n\t\t\t * @private\r\n\t\t\t * @default 1e-6\r\n\t\t\t */\r\n\r\n\t\t\tthis.pseudoInverseThreshold = pseudoInverseThreshold;\r\n\r\n\t\t\t/**\r\n\t\t\t * QEF data.\r\n\t\t\t *\r\n\t\t\t * @property data\r\n\t\t\t * @type QEFData\r\n\t\t\t * @private\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The average of the surface intersection points of a voxel.\r\n\t\t\t *\r\n\t\t\t * @property massPoint\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.massPoint = new Vector3$1();\r\n\r\n\t\t\t/**\r\n\t\t\t * A symmetric matrix.\r\n\t\t\t *\r\n\t\t\t * @property ata\r\n\t\t\t * @type SymmetricMatrix3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.ata = new SymmetricMatrix3();\r\n\r\n\t\t\t/**\r\n\t\t\t * A vector.\r\n\t\t\t *\r\n\t\t\t * @property atb\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.atb = new Vector3$1();\r\n\r\n\t\t\t/**\r\n\t\t\t * A calculated vertex position.\r\n\t\t\t *\r\n\t\t\t * @property x\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.x = new Vector3$1();\r\n\r\n\t\t\t/**\r\n\t\t\t * Indicates whether this solver has a solution.\r\n\t\t\t *\r\n\t\t\t * @property hasSolution\r\n\t\t\t * @type Boolean\r\n\t\t\t */\r\n\r\n\t\t\tthis.hasSolution = false;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the error of the approximated position.\r\n\t\t *\r\n\t\t * @method computeError\r\n\t\t * @return {Number} The QEF error.\r\n\t\t */\r\n\r\n\t\tcomputeError() {\r\n\r\n\t\t\tconst x = this.x;\r\n\r\n\t\t\tlet error = Infinity;\r\n\t\t\tlet atax;\r\n\r\n\t\t\tif(this.hasSolution) {\r\n\r\n\t\t\t\tatax = this.ata.applyToVector3(x.clone());\r\n\t\t\t\terror = x.dot(atax) - 2.0 * x.dot(this.atb) + this.data.btb;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn error;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the QEF data.\r\n\t\t *\r\n\t\t * @method setData\r\n\t\t * @chainable\r\n\t\t * @param {QEFData} d - QEF Data.\r\n\t\t * @return {QEFSolver} This solver.\r\n\t\t */\r\n\r\n\t\tsetData(d) {\r\n\r\n\t\t\tthis.data = d;\r\n\t\t\tthis.hasSolution = false;\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Solves the Quadratic Error Function.\r\n\t\t *\r\n\t\t * @method solve\r\n\t\t * @return {Vector3} The calculated vertex position.\r\n\t\t */\r\n\r\n\t\tsolve() {\r\n\r\n\t\t\tconst data = this.data;\r\n\t\t\tconst massPoint = this.massPoint;\r\n\t\t\tconst ata = this.ata;\r\n\t\t\tconst atb = this.atb;\r\n\t\t\tconst x = this.x;\r\n\r\n\t\t\tlet mp;\r\n\r\n\t\t\tif(!this.hasSolution && data !== null && data.numPoints > 0) {\r\n\r\n\t\t\t\t// The mass point is a sum, so divide it to make it the average.\r\n\t\t\t\tmassPoint.copy(data.massPoint);\r\n\t\t\t\tmassPoint.divideScalar(data.numPoints);\r\n\r\n\t\t\t\tata.copy(data.ata);\r\n\t\t\t\tatb.copy(data.atb);\r\n\r\n\t\t\t\tmp = ata.applyToVector3(massPoint.clone());\r\n\t\t\t\tatb.sub(mp);\r\n\r\n\t\t\t\tx.set(0, 0, 0);\r\n\r\n\t\t\t\tdata.massPointDimension = SingularValueDecomposition.solveSymmetric(\r\n\t\t\t\t\tata, atb, x, this.svdThreshold, this.svdSweeps, this.pseudoInverseThreshold\r\n\t\t\t\t);\r\n\r\n\t\t\t\t// svdError = SingularValueDecomposition.calculateError(ata, atb, x);\r\n\r\n\t\t\t\tx.add(massPoint);\r\n\r\n\t\t\t\tatb.copy(data.atb);\r\n\r\n\t\t\t\tthis.hasSolution = true;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn x;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clears this QEF instance.\r\n\t\t *\r\n\t\t * @method clear\r\n\t\t */\r\n\r\n\t\tclear() {\r\n\r\n\t\t\tthis.data = null;\r\n\t\t\tthis.hasSolution = false;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An density bias for the Zero Crossing approximation.\r\n\t *\r\n\t * @property BIAS\r\n\t * @type Number\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst BIAS = 1e-2;\r\n\r\n\t/**\r\n\t * An error threshold for the Zero Crossing approximation.\r\n\t *\r\n\t * @property BIAS\r\n\t * @type Number\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst THRESHOLD = 1e-6;\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @property AB\r\n\t * @type Vector3\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst AB = new Vector3$1();\r\n\r\n\t/**\r\n\t * A point.\r\n\t *\r\n\t * @property P\r\n\t * @type Vector3\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst P = new Vector3$1();\r\n\r\n\t/**\r\n\t * A vector.\r\n\t *\r\n\t * @property V\r\n\t * @type Vector3\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst V = new Vector3$1();\r\n\r\n\t/**\r\n\t * An edge.\r\n\t *\r\n\t * @class Edge\r\n\t * @submodule volume\r\n\t * @constructor\r\n\t * @param {Vector3} a - A starting point.\r\n\t * @param {Vector3} b - An ending point.\r\n\t */\r\n\r\n\tclass Edge {\r\n\r\n\t\tconstructor(a = new Vector3$1(), b = new Vector3$1()) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The starting point of the edge.\r\n\t\t\t *\r\n\t\t\t * @property a\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.a = a;\r\n\r\n\t\t\t/**\r\n\t\t\t * The ending point of the edge.\r\n\t\t\t *\r\n\t\t\t * @property b\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.b = b;\r\n\r\n\t\t\t/**\r\n\t\t\t * The Zero Crossing interpolation value.\r\n\t\t\t *\r\n\t\t\t * @property t\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.t = 0.0;\r\n\r\n\t\t\t/**\r\n\t\t\t * The surface normal at the Zero Crossing position.\r\n\t\t\t *\r\n\t\t\t * @property n\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.n = new Vector3$1();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Approximates the smallest density along the edge.\r\n\t\t *\r\n\t\t * @method approximateZeroCrossing\r\n\t\t * @param {SignedDistanceFunction} sdf - A density field.\r\n\t\t * @param {Number} [steps=8] - The maximum number of interpolation steps. Cannot be smaller than 2.\r\n\t\t */\r\n\r\n\t\tapproximateZeroCrossing(sdf, steps = 8) {\r\n\r\n\t\t\tconst s = Math.max(1, steps - 1);\r\n\r\n\t\t\tlet a = 0.0;\r\n\t\t\tlet b = 1.0;\r\n\t\t\tlet c = 0.0;\r\n\t\t\tlet i = 0;\r\n\r\n\t\t\tlet densityA, densityC;\r\n\r\n\t\t\t// Compute the vector from a to b.\r\n\t\t\tAB.subVectors(this.b, this.a);\r\n\r\n\t\t\t// Use bisection to find the root of the SDF.\r\n\t\t\twhile(i <= s) {\r\n\r\n\t\t\t\tc = (a + b) / 2;\r\n\r\n\t\t\t\tP.addVectors(this.a, V.copy(AB).multiplyScalar(c));\r\n\t\t\t\tdensityC = sdf.sample(P);\r\n\r\n\t\t\t\tif(Math.abs(densityC) <= BIAS || (b - a) / 2 <= THRESHOLD) {\r\n\r\n\t\t\t\t\t// Solution found.\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tP.addVectors(this.a, V.copy(AB).multiplyScalar(a));\r\n\t\t\t\t\tdensityA = sdf.sample(P);\r\n\r\n\t\t\t\t\t(Math.sign(densityC) === Math.sign(densityA)) ? (a = c) : (b = c);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\t++i;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.t = c;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the Zero Crossing position.\r\n\t\t *\r\n\t\t * @method computeZeroCrossingPosition\r\n\t\t * @return {Vector3} The Zero Crossing position. The returned vector is volatile.\r\n\t\t */\r\n\r\n\t\tcomputeZeroCrossingPosition() {\r\n\r\n\t\t\treturn AB.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Computes the normal of the surface at the edge intersection.\r\n\t\t *\r\n\t\t * @method computeSurfaceNormal\r\n\t\t * @param {SignedDistanceFunction} sdf - A density field.\r\n\t\t * @return {Vector3} The normal.\r\n\t\t * @todo Use analytical derivation instead of finite differences.\r\n\t\t */\r\n\r\n\t\tcomputeSurfaceNormal(sdf) {\r\n\r\n\t\t\tconst position = this.computeZeroCrossingPosition();\r\n\t\t\tconst H = 0.001;\r\n\r\n\t\t\tconst dx = sdf.sample(P.addVectors(position, V.set(H, 0, 0))) - sdf.sample(P.subVectors(position, V.set(H, 0, 0)));\r\n\t\t\tconst dy = sdf.sample(P.addVectors(position, V.set(0, H, 0))) - sdf.sample(P.subVectors(position, V.set(0, H, 0)));\r\n\t\t\tconst dz = sdf.sample(P.addVectors(position, V.set(0, 0, H))) - sdf.sample(P.subVectors(position, V.set(0, 0, H)));\r\n\r\n\t\t\tthis.n.set(dx, dy, dz).normalize();\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A cubic voxel that holds information about the surface of a volume.\r\n\t *\r\n\t * @class Voxel\r\n\t * @submodule volume\r\n\t * @constructor\r\n\t */\r\n\r\n\tclass Voxel {\r\n\r\n\t\tconstructor() {\r\n\r\n\t\t\t/**\r\n\t\t\t * Holds binary material information about all eight corners of this voxel.\r\n\t\t\t *\r\n\t\t\t * A value of 0 means that this voxel is completely outside of the volume,\r\n\t\t\t * whereas a value of 255 means that it's fully inside of it. Any other\r\n\t\t\t * value indicates a material change which implies that the voxel contains\r\n\t\t\t * the surface.\r\n\t\t\t *\r\n\t\t\t * @property materials\r\n\t\t\t * @type Number\r\n\t\t\t * @default 0\r\n\t\t\t */\r\n\r\n\t\t\tthis.materials = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * The amount of edges that exhibit a material change in this voxel.\r\n\t\t\t *\r\n\t\t\t * @property edgeCount\r\n\t\t\t * @type Number\r\n\t\t\t * @default 0\r\n\t\t\t */\r\n\r\n\t\t\tthis.edgeCount = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * A generated index for this voxel's vertex. Used during the construction\r\n\t\t\t * of the final polygons.\r\n\t\t\t *\r\n\t\t\t * @property index\r\n\t\t\t * @type Number\r\n\t\t\t * @default -1\r\n\t\t\t */\r\n\r\n\t\t\tthis.index = -1;\r\n\r\n\t\t\t/**\r\n\t\t\t * The vertex that lies inside this voxel.\r\n\t\t\t *\r\n\t\t\t * @property position\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.position = new Vector3$1();\r\n\r\n\t\t\t/**\r\n\t\t\t * The normal of the vertex that lies inside this voxel.\r\n\t\t\t *\r\n\t\t\t * @property normal\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.normal = new Vector3$1();\r\n\r\n\t\t\t/**\r\n\t\t\t * A QEF data construct. Used to calculate the vertex position.\r\n\t\t\t *\r\n\t\t\t * @property qefData\r\n\t\t\t * @type QEFData\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.qefData = null;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A bias for boundary checks.\r\n\t *\r\n\t * @property BIAS\r\n\t * @type Number\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst BIAS$1 = 1e-6;\r\n\r\n\t/**\r\n\t * The base QEF error threshold.\r\n\t *\r\n\t * @property THRESHOLD\r\n\t * @type Number\r\n\t * @private\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst THRESHOLD$1 = 1e-1;\r\n\r\n\t/**\r\n\t * A QEF error threshold for voxel clustering.\r\n\t *\r\n\t * @property threshold\r\n\t * @type Number\r\n\t * @private\r\n\t * @static\r\n\t */\r\n\r\n\tlet threshold = 0.0;\r\n\r\n\t/**\r\n\t * A voxel octant.\r\n\t *\r\n\t * @class VoxelCell\r\n\t * @submodule octree\r\n\t * @extends CubicOctant\r\n\t * @constructor\r\n\t * @param {Vector3} [min] - The lower bounds.\r\n\t * @param {Number} [size] - The size of the octant.\r\n\t */\r\n\r\n\tclass VoxelCell extends CubicOctant {\r\n\r\n\t\tconstructor(min, size) {\r\n\r\n\t\t\tsuper(min, size);\r\n\r\n\t\t\t/**\r\n\t\t\t * A voxel that contains draw information.\r\n\t\t\t *\r\n\t\t\t * @property voxel\r\n\t\t\t * @type Voxel\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.voxel = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The level of detail.\r\n\t\t *\r\n\t\t * @property lod\r\n\t\t * @type Number\r\n\t\t */\r\n\r\n\t\tget lod() { return threshold; }\r\n\r\n\t\tset lod(lod) {\r\n\r\n\t\t\tthreshold = THRESHOLD$1 + (lod * lod * lod);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if the given point lies inside this cell's boundaries.\r\n\t\t *\r\n\t\t * @method contains\r\n\t\t * @param {Vector3} p - A point.\r\n\t\t * @return {Boolean} Whether the given point lies inside this cell.\r\n\t\t */\r\n\r\n\t\tcontains(p) {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst size = this.size;\r\n\r\n\t\t\treturn (\r\n\t\t\t\tp.x >= min.x - BIAS$1 &&\r\n\t\t\t\tp.y >= min.y - BIAS$1 &&\r\n\t\t\t\tp.z >= min.z - BIAS$1 &&\r\n\t\t\t\tp.x <= min.x + size + BIAS$1 &&\r\n\t\t\t\tp.y <= min.y + size + BIAS$1 &&\r\n\t\t\t\tp.z <= min.z + size + BIAS$1\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Attempts to simplify this cell.\r\n\t\t *\r\n\t\t * @method collapse\r\n\t\t * @return {Number} The amount of removed voxels.\r\n\t\t */\r\n\r\n\t\tcollapse() {\r\n\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tconst signs = new Int16Array([\r\n\t\t\t\t-1, -1, -1, -1,\r\n\t\t\t\t-1, -1, -1, -1\r\n\t\t\t]);\r\n\r\n\t\t\tlet midSign = -1;\r\n\t\t\tlet collapsible = (children !== null);\r\n\r\n\t\t\tlet removedVoxels = 0;\r\n\r\n\t\t\tlet qefData, qefSolver;\r\n\t\t\tlet child, sign, voxel;\r\n\t\t\tlet position;\r\n\r\n\t\t\tlet v, i;\r\n\r\n\t\t\tif(collapsible) {\r\n\r\n\t\t\t\tqefData = new QEFData();\r\n\r\n\t\t\t\tfor(v = 0, i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\t\tchild = children[i];\r\n\r\n\t\t\t\t\tremovedVoxels += child.collapse();\r\n\r\n\t\t\t\t\tvoxel = child.voxel;\r\n\r\n\t\t\t\t\tif(child.children !== null) {\r\n\r\n\t\t\t\t\t\t// Couldn't simplify the child.\r\n\t\t\t\t\t\tcollapsible = false;\r\n\r\n\t\t\t\t\t} else if(voxel !== null) {\r\n\r\n\t\t\t\t\t\tqefData.addData(voxel.qefData);\r\n\r\n\t\t\t\t\t\tmidSign = (voxel.materials >> (7 - i)) & 1;\r\n\t\t\t\t\t\tsigns[i] = (voxel.materials >> i) & 1;\r\n\r\n\t\t\t\t\t\t++v;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(collapsible) {\r\n\r\n\t\t\t\t\tqefSolver = new QEFSolver();\r\n\t\t\t\t\tposition = qefSolver.setData(qefData).solve();\r\n\r\n\t\t\t\t\tif(qefSolver.computeError() <= threshold) {\r\n\r\n\t\t\t\t\t\tvoxel = new Voxel();\r\n\t\t\t\t\t\tvoxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);\r\n\r\n\t\t\t\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\t\t\t\tsign = signs[i];\r\n\t\t\t\t\t\t\tchild = children[i];\r\n\r\n\t\t\t\t\t\t\tif(sign === -1) {\r\n\r\n\t\t\t\t\t\t\t\t// Undetermined, use mid sign instead.\r\n\t\t\t\t\t\t\t\tvoxel.materials |= (midSign << i);\r\n\r\n\t\t\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t\t\tvoxel.materials |= (sign << i);\r\n\r\n\t\t\t\t\t\t\t\t// Accumulate normals.\r\n\t\t\t\t\t\t\t\tvoxel.normal.add(child.voxel.normal);\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\tvoxel.normal.normalize();\r\n\t\t\t\t\t\tvoxel.qefData = qefData;\r\n\r\n\t\t\t\t\t\tthis.voxel = voxel;\r\n\t\t\t\t\t\tthis.children = null;\r\n\r\n\t\t\t\t\t\t// Removed existing voxels and created a new one.\r\n\t\t\t\t\t\tremovedVoxels += v - 1;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn removedVoxels;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Creates a voxel and builds a material configuration code from the materials\r\n\t * in the voxel corners.\r\n\t *\r\n\t * @method createVoxel\r\n\t * @private\r\n\t * @static\r\n\t * @param {Number} n - The grid resolution.\r\n\t * @param {Number} x - A local grid point X-coordinate.\r\n\t * @param {Number} y - A local grid point Y-coordinate.\r\n\t * @param {Number} z - A local grid point Z-coordinate.\r\n\t * @param {Uint8Array} materialIndices - The material indices.\r\n\t * @return {Voxel} A voxel.\r\n\t */\r\n\r\n\tfunction createVoxel(n, x, y, z, materialIndices) {\r\n\r\n\t\tconst m = n + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst voxel = new Voxel();\r\n\r\n\t\tlet materials, edgeCount;\r\n\t\tlet material, offset, index;\r\n\t\tlet c1, c2, m1, m2;\r\n\r\n\t\tlet i;\r\n\r\n\t\t// Pack the material information of the eight corners into a single byte.\r\n\t\tfor(materials = 0, i = 0; i < 8; ++i) {\r\n\r\n\t\t\t// Translate the coordinates into a one-dimensional grid point index.\r\n\t\t\toffset = PATTERN[i];\r\n\t\t\tindex = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);\r\n\r\n\t\t\t// Convert the identified material index into a binary value.\r\n\t\t\tmaterial = Math.min(materialIndices[index], Density.SOLID);\r\n\r\n\t\t\t// Store the value in bit i.\r\n\t\t\tmaterials |= (material << i);\r\n\r\n\t\t}\r\n\r\n\t\t// Find out how many edges intersect with the implicit surface.\r\n\t\tfor(edgeCount = 0, i = 0; i < 12; ++i) {\r\n\r\n\t\t\tc1 = EDGES[i][0];\r\n\t\t\tc2 = EDGES[i][1];\r\n\r\n\t\t\tm1 = (materials >> c1) & 1;\r\n\t\t\tm2 = (materials >> c2) & 1;\r\n\r\n\t\t\t// Check if there is a material change on the edge.\r\n\t\t\tif(m1 !== m2) {\r\n\r\n\t\t\t\t++edgeCount;\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\tvoxel.materials = materials;\r\n\t\tvoxel.edgeCount = edgeCount;\r\n\t\tvoxel.qefData = new QEFData();\r\n\r\n\t\treturn voxel;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A cubic voxel octree.\r\n\t *\r\n\t * @class VoxelBlock\r\n\t * @submodule octree\r\n\t * @extends Octree\r\n\t * @constructor\r\n\t * @param {Chunk} chunk - A volume chunk.\r\n\t */\r\n\r\n\tclass VoxelBlock extends Octree {\r\n\r\n\t\tconstructor(chunk) {\r\n\r\n\t\t\tsuper();\r\n\r\n\t\t\tthis.root = new VoxelCell(chunk.min, chunk.size);\r\n\t\t\tthis.root.lod = chunk.data.lod;\r\n\r\n\t\t\t/**\r\n\t\t\t * The amount of voxels in this block.\r\n\t\t\t *\r\n\t\t\t * @property voxelCount\r\n\t\t\t * @type Number\r\n\t\t\t */\r\n\r\n\t\t\tthis.voxelCount = 0;\r\n\r\n\t\t\t// Create voxel cells from Hermite data and apply level of detail.\r\n\t\t\tthis.construct(chunk);\r\n\t\t\tthis.simplify();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Attempts to simplify the octree by clustering voxels.\r\n\t\t *\r\n\t\t * @method simplify\r\n\t\t * @private\r\n\t\t */\r\n\r\n\t\tsimplify() {\r\n\r\n\t\t\tthis.voxelCount -= this.root.collapse();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates intermediate voxel cells down to the leaf octant that is described\r\n\t\t * by the given local grid coordinates and returns it.\r\n\t\t *\r\n\t\t * @method getCell\r\n\t\t * @private\r\n\t\t * @param {Number} n - The grid resolution.\r\n\t\t * @param {Number} x - A local grid point X-coordinate.\r\n\t\t * @param {Number} y - A local grid point Y-coordinate.\r\n\t\t * @param {Number} z - A local grid point Z-coordinate.\r\n\t\t * @return {VoxelCell} A leaf voxel cell.\r\n\t\t */\r\n\r\n\t\tgetCell(n, x, y, z) {\r\n\r\n\t\t\tlet cell = this.root;\r\n\t\t\tlet yz, xz, xy;\r\n\t\t\tlet octant;\r\n\r\n\t\t\tfor(n = n >> 1; n > 0; n >>= 1) {\r\n\r\n\t\t\t\t// Identify the next octant by the grid coordinates.\r\n\r\n\t\t\t\tif(x < n) {\r\n\r\n\t\t\t\t\tyz = 0;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tyz = 1;\r\n\t\t\t\t\tx -= n;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(y < n) {\r\n\r\n\t\t\t\t\txz = 0;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\txz = 1;\r\n\t\t\t\t\ty -= n;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(z < n) {\r\n\r\n\t\t\t\t\txy = 0;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\txy = 1;\r\n\t\t\t\t\tz -= n;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\toctant = (yz << 2) + (xz << 1) + xy;\r\n\r\n\t\t\t\tif(cell.children === null) {\r\n\r\n\t\t\t\t\tcell.split();\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tcell = cell.children[octant];\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn cell;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Constructs voxel cells from volume data.\r\n\t\t *\r\n\t\t * @method construct\r\n\t\t * @private\r\n\t\t * @param {Chunk} chunk - A volume chunk.\r\n\t\t */\r\n\r\n\t\tconstruct(chunk) {\r\n\r\n\t\t\tconst s = chunk.size;\r\n\t\t\tconst n = chunk.resolution;\r\n\t\t\tconst m = n + 1;\r\n\t\t\tconst mm = m * m;\r\n\r\n\t\t\tconst data = chunk.data;\r\n\t\t\tconst edgeData = data.edgeData;\r\n\t\t\tconst materialIndices = data.materialIndices;\r\n\r\n\t\t\tconst qefSolver = new QEFSolver();\r\n\r\n\t\t\tconst base = chunk.min;\r\n\t\t\tconst offsetA = new Vector3$1();\r\n\t\t\tconst offsetB = new Vector3$1();\r\n\t\t\tconst intersection = new Vector3$1();\r\n\t\t\tconst edge = new Edge();\r\n\r\n\t\t\tconst sequences = [\r\n\t\t\t\tnew Uint8Array([0, 1, 2, 3]),\r\n\t\t\t\tnew Uint8Array([0, 1, 4, 5]),\r\n\t\t\t\tnew Uint8Array([0, 2, 4, 6])\r\n\t\t\t];\r\n\r\n\t\t\tlet voxelCount = 0;\r\n\r\n\t\t\tlet edges, zeroCrossings, normals;\r\n\t\t\tlet sequence, offset;\r\n\t\t\tlet voxel, position;\r\n\t\t\tlet axis, cell;\r\n\r\n\t\t\tlet a, d, i, j, l;\r\n\t\t\tlet x2, y2, z2;\r\n\t\t\tlet x, y, z;\r\n\r\n\t\t\tlet index;\r\n\r\n\t\t\tfor(a = 4, d = 0; d < 3; ++d, a >>= 1) {\r\n\r\n\t\t\t\taxis = PATTERN[a];\r\n\r\n\t\t\t\tedges = edgeData.edges[d];\r\n\t\t\t\tzeroCrossings = edgeData.zeroCrossings[d];\r\n\t\t\t\tnormals = edgeData.normals[d];\r\n\r\n\t\t\t\tsequence = sequences[d];\r\n\r\n\t\t\t\tfor(i = 0, l = edges.length; i < l; ++i) {\r\n\r\n\t\t\t\t\t// Each edge is uniquely described by its starting grid point index.\r\n\t\t\t\t\tindex = edges[i];\r\n\r\n\t\t\t\t\t// Calculate the local grid coordinates from the one-dimensional index.\r\n\t\t\t\t\tx = index % m;\r\n\t\t\t\t\ty = Math.trunc((index % mm) / m);\r\n\t\t\t\t\tz = Math.trunc(index / mm);\r\n\r\n\t\t\t\t\toffsetA.set(\r\n\t\t\t\t\t\tx * s / n,\r\n\t\t\t\t\t\ty * s / n,\r\n\t\t\t\t\t\tz * s / n\r\n\t\t\t\t\t);\r\n\r\n\t\t\t\t\toffsetB.set(\r\n\t\t\t\t\t\t(x + axis[0]) * s / n,\r\n\t\t\t\t\t\t(y + axis[1]) * s / n,\r\n\t\t\t\t\t\t(z + axis[2]) * s / n\r\n\t\t\t\t\t);\r\n\r\n\t\t\t\t\tedge.a.addVectors(base, offsetA);\r\n\t\t\t\t\tedge.b.addVectors(base, offsetB);\r\n\r\n\t\t\t\t\tedge.t = zeroCrossings[i];\r\n\t\t\t\t\tedge.n.fromArray(normals, i * 3);\r\n\r\n\t\t\t\t\tintersection.copy(edge.computeZeroCrossingPosition());\r\n\r\n\t\t\t\t\t// Each edge can belong to up to four voxel cells.\r\n\t\t\t\t\tfor(j = 0; j < 4; ++j) {\r\n\r\n\t\t\t\t\t\t// Rotate around the edge.\r\n\t\t\t\t\t\toffset = PATTERN[sequence[j]];\r\n\r\n\t\t\t\t\t\tx2 = x - offset[0];\r\n\t\t\t\t\t\ty2 = y - offset[1];\r\n\t\t\t\t\t\tz2 = z - offset[2];\r\n\r\n\t\t\t\t\t\t// Check if the adjusted coordinates still lie inside the grid bounds.\r\n\t\t\t\t\t\tif(x2 >= 0 && y2 >= 0 && z2 >= 0 && x2 < n && y2 < n && z2 < n) {\r\n\r\n\t\t\t\t\t\t\tcell = this.getCell(n, x2, y2, z2);\r\n\r\n\t\t\t\t\t\t\tif(cell.voxel === null) {\r\n\r\n\t\t\t\t\t\t\t\t// The existence of the edge guarantees that the voxel contains the surface.\r\n\t\t\t\t\t\t\t\tcell.voxel = createVoxel(n, x2, y2, z2, materialIndices);\r\n\r\n\t\t\t\t\t\t\t\t++voxelCount;\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t\t// Add the edge data to the voxel.\r\n\t\t\t\t\t\t\tvoxel = cell.voxel;\r\n\t\t\t\t\t\t\tvoxel.normal.add(edge.n);\r\n\t\t\t\t\t\t\tvoxel.qefData.add(intersection, edge.n);\r\n\r\n\t\t\t\t\t\t\tif(voxel.qefData.numPoints === voxel.edgeCount) {\r\n\r\n\t\t\t\t\t\t\t\t// Finalise the voxel by solving the accumulated data.\r\n\t\t\t\t\t\t\t\tposition = qefSolver.setData(voxel.qefData).solve();\r\n\r\n\t\t\t\t\t\t\t\tvoxel.position.copy(cell.contains(position) ? position : qefSolver.massPoint);\r\n\t\t\t\t\t\t\t\tvoxel.normal.normalize();\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.voxelCount = voxelCount;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * @submodule isosurface\r\n\t */\r\n\r\n\t/**\r\n\t * An edge mask.\r\n\t *\r\n\t * @property EDGE_MASK\r\n\t * @for DualContouring\r\n\t * @type Uint8Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\r\n\r\n\t/**\r\n\t * A face map.\r\n\t *\r\n\t * @property FACE_MAP\r\n\t * @for DualContouring\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\r\n\r\n\t/**\r\n\t * A face mask for cell processing.\r\n\t *\r\n\t * @property CELL_PROC_FACE_MASK\r\n\t * @for DualContouring\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst CELL_PROC_FACE_MASK = [\r\n\r\n\t\tnew Uint8Array([0, 4, 0]),\r\n\t\tnew Uint8Array([1, 5, 0]),\r\n\t\tnew Uint8Array([2, 6, 0]),\r\n\t\tnew Uint8Array([3, 7, 0]),\r\n\t\tnew Uint8Array([0, 2, 1]),\r\n\t\tnew Uint8Array([4, 6, 1]),\r\n\t\tnew Uint8Array([1, 3, 1]),\r\n\t\tnew Uint8Array([5, 7, 1]),\r\n\t\tnew Uint8Array([0, 1, 2]),\r\n\t\tnew Uint8Array([2, 3, 2]),\r\n\t\tnew Uint8Array([4, 5, 2]),\r\n\t\tnew Uint8Array([6, 7, 2])\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * An edge mask for cell processing.\r\n\t *\r\n\t * @property CELL_PROC_EDGE_MASK\r\n\t * @for DualContouring\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst CELL_PROC_EDGE_MASK = [\r\n\r\n\t\tnew Uint8Array([0, 1, 2, 3, 0]),\r\n\t\tnew Uint8Array([4, 5, 6, 7, 0]),\r\n\t\tnew Uint8Array([0, 4, 1, 5, 1]),\r\n\t\tnew Uint8Array([2, 6, 3, 7, 1]),\r\n\t\tnew Uint8Array([0, 2, 4, 6, 2]),\r\n\t\tnew Uint8Array([1, 3, 5, 7, 2])\r\n\r\n\t];\r\n\r\n\t/**\r\n\t * A face mask for face processing.\r\n\t *\r\n\t * @property FACE_PROC_FACE_MASK\r\n\t * @for DualContouring\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst FACE_PROC_FACE_MASK = [[\r\n\r\n\t\t\tnew Uint8Array([4, 0, 0]),\r\n\t\t\tnew Uint8Array([5, 1, 0]),\r\n\t\t\tnew Uint8Array([6, 2, 0]),\r\n\t\t\tnew Uint8Array([7, 3, 0])\r\n\r\n\t\t], [\r\n\r\n\t\t\tnew Uint8Array([2, 0, 1]),\r\n\t\t\tnew Uint8Array([6, 4, 1]),\r\n\t\t\tnew Uint8Array([3, 1, 1]),\r\n\t\t\tnew Uint8Array([7, 5, 1])\r\n\r\n\t\t], [\r\n\r\n\t\t\tnew Uint8Array([1, 0, 2]),\r\n\t\t\tnew Uint8Array([3, 2, 2]),\r\n\t\t\tnew Uint8Array([5, 4, 2]),\r\n\t\t\tnew Uint8Array([7, 6, 2])\r\n\r\n\t]];\r\n\r\n\t/**\r\n\t * An edge mask for face processing.\r\n\t *\r\n\t * @property FACE_PROC_EDGE_MASK\r\n\t * @for DualContouring\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst FACE_PROC_EDGE_MASK = [[\r\n\r\n\t\t\tnew Uint8Array([1, 4, 0, 5, 1, 1]),\r\n\t\t\tnew Uint8Array([1, 6, 2, 7, 3, 1]),\r\n\t\t\tnew Uint8Array([0, 4, 6, 0, 2, 2]),\r\n\t\t\tnew Uint8Array([0, 5, 7, 1, 3, 2])\r\n\r\n\t\t], [\r\n\r\n\t\t\tnew Uint8Array([0, 2, 3, 0, 1, 0]),\r\n\t\t\tnew Uint8Array([0, 6, 7, 4, 5, 0]),\r\n\t\t\tnew Uint8Array([1, 2, 0, 6, 4, 2]),\r\n\t\t\tnew Uint8Array([1, 3, 1, 7, 5, 2])\r\n\r\n\t\t], [\r\n\r\n\t\t\tnew Uint8Array([1, 1, 0, 3, 2, 0]),\r\n\t\t\tnew Uint8Array([1, 5, 4, 7, 6, 0]),\r\n\t\t\tnew Uint8Array([0, 1, 5, 0, 4, 1]),\r\n\t\t\tnew Uint8Array([0, 3, 7, 2, 6, 1])\r\n\r\n\t]];\r\n\r\n\t/**\r\n\t * An edge mask for edge processing.\r\n\t *\r\n\t * @property EDGE_PROC_EDGE_MASK\r\n\t * @for DualContouring\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst EDGE_PROC_EDGE_MASK = [[\r\n\r\n\t\t\tnew Uint8Array([3, 2, 1, 0, 0]),\r\n\t\t\tnew Uint8Array([7, 6, 5, 4, 0])\r\n\r\n\t\t], [\r\n\r\n\t\t\tnew Uint8Array([5, 1, 4, 0, 1]),\r\n\t\t\tnew Uint8Array([7, 3, 6, 2, 1])\r\n\r\n\t\t], [\r\n\r\n\t\t\tnew Uint8Array([6, 4, 2, 0, 2]),\r\n\t\t\tnew Uint8Array([7, 5, 3, 1, 2])\r\n\r\n\t]];\r\n\r\n\t/**\r\n\t * An edge mask.\r\n\t *\r\n\t * @property PROC_EDGE_MASK\r\n\t * @for DualContouring\r\n\t * @type Array\r\n\t * @static\r\n\t * @final\r\n\t */\r\n\r\n\tconst PROC_EDGE_MASK = [\r\n\r\n\t\tnew Uint8Array([3, 2, 1, 0]),\r\n\t\tnew Uint8Array([7, 5, 6, 4]),\r\n\t\tnew Uint8Array([11, 10, 9, 8])\r\n\r\n\t];\n\n\t/**\r\n\t * An edge contouring sub-procedure.\r\n\t *\r\n\t * @method contourProcessEdge\r\n\t * @private\r\n\t * @static\r\n\t * @param {Array} octants - Four leaf octants.\r\n\t * @param {Number} dir - A direction index.\r\n\t * @param {Array} indexBuffer - An output list for vertex indices.\r\n\t */\r\n\r\n\tfunction contourProcessEdge(octants, dir, indexBuffer) {\r\n\r\n\t\tconst indices = [-1, -1, -1, -1];\r\n\t\tconst signChange = [false, false, false, false];\r\n\r\n\t\tlet minSize = Infinity;\r\n\t\tlet minIndex = 0;\r\n\t\tlet flip = false;\r\n\r\n\t\tlet c1, c2, m1, m2;\r\n\t\tlet octant, edge;\r\n\t\tlet i;\r\n\r\n\t\tfor(i = 0; i < 4; ++i) {\r\n\r\n\t\t\toctant = octants[i];\r\n\t\t\tedge = PROC_EDGE_MASK[dir][i];\r\n\r\n\t\t\tc1 = EDGES[edge][0];\r\n\t\t\tc2 = EDGES[edge][1];\r\n\r\n\t\t\tm1 = (octant.voxel.materials >> c1) & 1;\r\n\t\t\tm2 = (octant.voxel.materials >> c2) & 1;\r\n\r\n\t\t\tif(octant.size < minSize) {\r\n\r\n\t\t\t\tminSize = octant.size;\r\n\t\t\t\tminIndex = i;\r\n\t\t\t\tflip = (m1 !== Density.HOLLOW);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tindices[i] = octant.voxel.index;\r\n\t\t\tsignChange[i] = (m1 !== m2);\r\n\r\n\t\t}\r\n\r\n\t\tif(signChange[minIndex]) {\r\n\r\n\t\t\tif(!flip) {\r\n\r\n\t\t\t\tindexBuffer.push(indices[0]);\r\n\t\t\t\tindexBuffer.push(indices[1]);\r\n\t\t\t\tindexBuffer.push(indices[3]);\r\n\r\n\t\t\t\tindexBuffer.push(indices[0]);\r\n\t\t\t\tindexBuffer.push(indices[3]);\r\n\t\t\t\tindexBuffer.push(indices[2]);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tindexBuffer.push(indices[0]);\r\n\t\t\t\tindexBuffer.push(indices[3]);\r\n\t\t\t\tindexBuffer.push(indices[1]);\r\n\r\n\t\t\t\tindexBuffer.push(indices[0]);\r\n\t\t\t\tindexBuffer.push(indices[2]);\r\n\t\t\t\tindexBuffer.push(indices[3]);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * An edge contouring procedure.\r\n\t *\r\n\t * @method contourEdgeProc\r\n\t * @private\r\n\t * @static\r\n\t * @param {Array} octants - Four edge octants.\r\n\t * @param {Number} dir - A direction index.\r\n\t * @param {Array} indexBuffer - An output list for vertex indices.\r\n\t */\r\n\r\n\tfunction contourEdgeProc(octants, dir, indexBuffer) {\r\n\r\n\t\tconst c = [0, 0, 0, 0];\r\n\r\n\t\tlet edgeOctants;\r\n\t\tlet octant;\r\n\t\tlet i, j;\r\n\r\n\t\tif(octants[0].voxel !== null && octants[1].voxel !== null &&\r\n\t\t\toctants[2].voxel !== null && octants[3].voxel !== null) {\r\n\r\n\t\t\tcontourProcessEdge(octants, dir, indexBuffer);\r\n\r\n\t\t} else {\r\n\r\n\t\t\tfor(i = 0; i < 2; ++i) {\r\n\r\n\t\t\t\tc[0] = EDGE_PROC_EDGE_MASK[dir][i][0];\r\n\t\t\t\tc[1] = EDGE_PROC_EDGE_MASK[dir][i][1];\r\n\t\t\t\tc[2] = EDGE_PROC_EDGE_MASK[dir][i][2];\r\n\t\t\t\tc[3] = EDGE_PROC_EDGE_MASK[dir][i][3];\r\n\r\n\t\t\t\tedgeOctants = [];\r\n\r\n\t\t\t\tfor(j = 0; j < 4; ++j) {\r\n\r\n\t\t\t\t\toctant = octants[j];\r\n\r\n\t\t\t\t\tif(octant.voxel !== null) {\r\n\r\n\t\t\t\t\t\tedgeOctants[j] = octant;\r\n\r\n\t\t\t\t\t} else if(octant.children !== null) {\r\n\r\n\t\t\t\t\t\tedgeOctants[j] = octant.children[c[j]];\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(j === 4) {\r\n\r\n\t\t\t\t\tcontourEdgeProc(edgeOctants, EDGE_PROC_EDGE_MASK[dir][i][4], indexBuffer);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * A face contouring procedure.\r\n\t *\r\n\t * @method contourFaceProc\r\n\t * @private\r\n\t * @static\r\n\t * @param {Array} octants - Two face octants.\r\n\t * @param {Number} dir - A direction index.\r\n\t * @param {Array} indexBuffer - An output list for vertex indices.\r\n\t */\r\n\r\n\tfunction contourFaceProc(octants, dir, indexBuffer) {\r\n\r\n\t\tconst c = [0, 0, 0, 0];\r\n\r\n\t\tconst orders = [\r\n\t\t\t[0, 0, 1, 1],\r\n\t\t\t[0, 1, 0, 1]\r\n\t\t];\r\n\r\n\t\tlet faceOctants, edgeOctants;\r\n\t\tlet order, octant;\r\n\t\tlet i, j;\r\n\r\n\t\tif(octants[0].children !== null || octants[1].children !== null) {\r\n\r\n\t\t\tfor(i = 0; i < 4; ++i) {\r\n\r\n\t\t\t\tc[0] = FACE_PROC_FACE_MASK[dir][i][0];\r\n\t\t\t\tc[1] = FACE_PROC_FACE_MASK[dir][i][1];\r\n\r\n\t\t\t\tfaceOctants = [\r\n\t\t\t\t\t(octants[0].children === null) ? octants[0] : octants[0].children[c[0]],\r\n\t\t\t\t\t(octants[1].children === null) ? octants[1] : octants[1].children[c[1]]\r\n\t\t\t\t];\r\n\r\n\t\t\t\tcontourFaceProc(faceOctants, FACE_PROC_FACE_MASK[dir][i][2], indexBuffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tfor(i = 0; i < 4; ++i) {\r\n\r\n\t\t\t\tc[0] = FACE_PROC_EDGE_MASK[dir][i][1];\r\n\t\t\t\tc[1] = FACE_PROC_EDGE_MASK[dir][i][2];\r\n\t\t\t\tc[2] = FACE_PROC_EDGE_MASK[dir][i][3];\r\n\t\t\t\tc[3] = FACE_PROC_EDGE_MASK[dir][i][4];\r\n\r\n\t\t\t\torder = orders[FACE_PROC_EDGE_MASK[dir][i][0]];\r\n\r\n\t\t\t\tedgeOctants = [];\r\n\r\n\t\t\t\tfor(j = 0; j < 4; ++j) {\r\n\r\n\t\t\t\t\toctant = octants[order[j]];\r\n\r\n\t\t\t\t\tif(octant.voxel !== null) {\r\n\r\n\t\t\t\t\t\tedgeOctants[j] = octant;\r\n\r\n\t\t\t\t\t} else if(octant.children !== null) {\r\n\r\n\t\t\t\t\t\tedgeOctants[j] = octant.children[c[j]];\r\n\r\n\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(j === 4) {\r\n\r\n\t\t\t\t\tcontourEdgeProc(edgeOctants, FACE_PROC_EDGE_MASK[dir][i][5], indexBuffer);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * The main contouring procedure.\r\n\t *\r\n\t * @method contourCellProc\r\n\t * @private\r\n\t * @static\r\n\t * @param {Octant} octant - An octant.\r\n\t * @param {Array} indexBuffer - An output list for vertex indices.\r\n\t */\r\n\r\n\tfunction contourCellProc(octant, indexBuffer) {\r\n\r\n\t\tconst children = octant.children;\r\n\t\tconst c = [0, 0, 0, 0];\r\n\r\n\t\tlet faceOctants, edgeOctants;\r\n\t\tlet i;\r\n\r\n\t\tif(children !== null) {\r\n\r\n\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\tcontourCellProc(children[i], indexBuffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tfor(i = 0; i < 12; ++i) {\r\n\r\n\t\t\t\tc[0] = CELL_PROC_FACE_MASK[i][0];\r\n\t\t\t\tc[1] = CELL_PROC_FACE_MASK[i][1];\r\n\r\n\t\t\t\tfaceOctants = [\r\n\t\t\t\t\tchildren[c[0]],\r\n\t\t\t\t\tchildren[c[1]]\r\n\t\t\t\t];\r\n\r\n\t\t\t\tcontourFaceProc(faceOctants, CELL_PROC_FACE_MASK[i][2], indexBuffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tfor(i = 0; i < 6; ++i) {\r\n\r\n\t\t\t\tc[0] = CELL_PROC_EDGE_MASK[i][0];\r\n\t\t\t\tc[1] = CELL_PROC_EDGE_MASK[i][1];\r\n\t\t\t\tc[2] = CELL_PROC_EDGE_MASK[i][2];\r\n\t\t\t\tc[3] = CELL_PROC_EDGE_MASK[i][3];\r\n\r\n\t\t\t\tedgeOctants = [\r\n\t\t\t\t\tchildren[c[0]],\r\n\t\t\t\t\tchildren[c[1]],\r\n\t\t\t\t\tchildren[c[2]],\r\n\t\t\t\t\tchildren[c[3]]\r\n\t\t\t\t];\r\n\r\n\t\t\t\tcontourEdgeProc(edgeOctants, CELL_PROC_EDGE_MASK[i][4], indexBuffer);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Collects positions and normals from the voxel information of the given octant\r\n\t * and its children. The generated vertex indices are stored in the respective\r\n\t * voxels during the octree traversal.\r\n\t *\r\n\t * @method generateVertexIndices\r\n\t * @private\r\n\t * @static\r\n\t * @param {Octant} octant - An octant.\r\n\t * @param {Array} vertexBuffer - An array to be filled with vertices.\r\n\t * @param {Array} normalBuffer - An array to be filled with normals.\r\n\t * @param {Number} index - The next vertex index.\r\n\t */\r\n\r\n\tfunction generateVertexIndices(octant, positions, normals, index) {\r\n\r\n\t\tlet i, voxel;\r\n\r\n\t\tif(octant.children !== null) {\r\n\r\n\t\t\tfor(i = 0; i < 8; ++i) {\r\n\r\n\t\t\t\tindex = generateVertexIndices(octant.children[i], positions, normals, index);\r\n\r\n\t\t\t}\r\n\r\n\t\t} else if(octant.voxel !== null) {\r\n\r\n\t\t\tvoxel = octant.voxel;\r\n\t\t\tvoxel.index = index;\r\n\r\n\t\t\tpositions[index * 3] = voxel.position.x;\r\n\t\t\tpositions[index * 3 + 1] = voxel.position.y;\r\n\t\t\tpositions[index * 3 + 2] = voxel.position.z;\r\n\r\n\t\t\tnormals[index * 3] = voxel.normal.x;\r\n\t\t\tnormals[index * 3 + 1] = voxel.normal.y;\r\n\t\t\tnormals[index * 3 + 2] = voxel.normal.z;\r\n\r\n\t\t\t++index;\r\n\r\n\t\t}\r\n\r\n\t\treturn index;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Dual Contouring is an isosurface extraction technique that was originally\r\n\t * presented by Tao Ju in 2002:\r\n\t *\r\n\t *  http://www.cs.wustl.edu/~taoju/research/dualContour.pdf\r\n\t *\r\n\t * @class DualContouring\r\n\t * @submodule isosurface\r\n\t * @static\r\n\t */\r\n\r\n\tclass DualContouring {\r\n\r\n\t\t/**\r\n\t\t * Contours the given chunk of volume data and generates vertices, normals\r\n\t\t * and vertex indices.\r\n\t\t *\r\n\t\t * @method run\r\n\t\t * @static\r\n\t\t * @param {Chunk} chunk - A chunk of volume data.\r\n\t\t * @return {Object} The generated indices, positions and normals, or null if no data was generated.\r\n\t\t */\r\n\r\n\t\tstatic run(chunk) {\r\n\r\n\t\t\tconst indexBuffer = [];\r\n\r\n\t\t\tconst voxelBlock = new VoxelBlock(chunk);\r\n\r\n\t\t\t// Each voxel contains one vertex.\r\n\t\t\tconst vertexCount = voxelBlock.voxelCount;\r\n\r\n\t\t\tlet result = null;\r\n\t\t\tlet indices = null;\r\n\t\t\tlet positions = null;\r\n\t\t\tlet normals = null;\r\n\r\n\t\t\tif(vertexCount > 65536) {\r\n\r\n\t\t\t\tconsole.warn(\r\n\t\t\t\t\t\"Could not create geometry for chunk at position\", this.chunk.min,\r\n\t\t\t\t\t\"with lod\", this.chunk.data.lod, \"(vertex count of\", vertexCount,\r\n\t\t\t\t\t\"exceeds limit of 65536)\"\r\n\t\t\t\t);\r\n\r\n\t\t\t} else if(vertexCount > 0) {\r\n\r\n\t\t\t\tpositions = new Float32Array(vertexCount * 3);\r\n\t\t\t\tnormals = new Float32Array(vertexCount * 3);\r\n\r\n\t\t\t\tgenerateVertexIndices(voxelBlock.root, positions, normals, 0);\r\n\t\t\t\tcontourCellProc(voxelBlock.root, indexBuffer);\r\n\r\n\t\t\t\tindices = new Uint16Array(indexBuffer);\r\n\r\n\t\t\t\tresult = { indices, positions, normals };\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Isosurface extraction algorithms.\r\n\t *\r\n\t * @module rabbit-hole\r\n\t * @submodule isosurface\r\n\t */\n\n\t/**\r\n\t * Run-Length Encoding for numeric data.\r\n\t *\r\n\t * @class RunLengthEncoder\r\n\t * @submodule core\r\n\t * @static\r\n\t */\r\n\r\n\tclass RunLengthEncoder {\r\n\r\n\t\t/**\r\n\t\t * Encodes the given data.\r\n\t\t *\r\n\t\t * @method encode\r\n\t\t * @static\r\n\t\t * @param {Array} array - The data to encode.\r\n\t\t * @return {Object} The run-lengths and the encoded data.\r\n\t\t */\r\n\r\n\t\tstatic encode(array) {\r\n\r\n\t\t\tconst runLengths = [];\r\n\t\t\tconst data = [];\r\n\r\n\t\t\tlet previous = array[0];\r\n\t\t\tlet count = 1;\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 1, l = array.length; i < l; ++i) {\r\n\r\n\t\t\t\tif(previous !== array[i]) {\r\n\r\n\t\t\t\t\trunLengths.push(count);\r\n\t\t\t\t\tdata.push(previous);\r\n\r\n\t\t\t\t\tprevious = array[i];\r\n\t\t\t\t\tcount = 1;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\t++count;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\trunLengths.push(count);\r\n\t\t\tdata.push(previous);\r\n\r\n\t\t\treturn {\r\n\t\t\t\trunLengths,\r\n\t\t\t\tdata\r\n\t\t\t};\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Decodes the given data.\r\n\t\t *\r\n\t\t * @method decode\r\n\t\t * @static\r\n\t\t * @param {Array} runLengths - The run-lengths.\r\n\t\t * @param {Array} data - The data to decode.\r\n\t\t * @param {Array} [array] - An optional target.\r\n\t\t * @return {Array} The decoded data.\r\n\t\t */\r\n\r\n\t\tstatic decode(runLengths, data, array = []) {\r\n\r\n\t\t\tlet element;\r\n\r\n\t\t\tlet i, j, il, jl;\r\n\t\t\tlet k = 0;\r\n\r\n\t\t\tfor(i = 0, il = data.length; i < il; ++i) {\r\n\r\n\t\t\t\telement = data[i];\r\n\r\n\t\t\t\tfor(j = 0, jl = runLengths[i]; j < jl; ++j) {\r\n\r\n\t\t\t\t\tarray[k++] = element;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn array;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Stores edge data separately for each dimension.\r\n\t *\r\n\t * With a grid resolution N, there are 3 * (N + 1)² * N edges in total, but\r\n\t * the number of edges that actually contain the volume's surface is usually\r\n\t * much lower.\r\n\t *\r\n\t * @class EdgeData\r\n\t * @submodule volume\r\n\t * @constructor\r\n\t * @param {Number} n - The grid resolution.\r\n\t */\r\n\r\n\tclass EdgeData {\r\n\r\n\t\tconstructor(n) {\r\n\r\n\t\t\tconst c = Math.pow((n + 1), 2) * n;\r\n\r\n\t\t\t/**\r\n\t\t\t * The edges.\r\n\t\t\t *\r\n\t\t\t * Edges are stored as starting grid point indices in ascending order. The\r\n\t\t\t * ending point indices are implicitly defined through the dimension split:\r\n\t\t\t *\r\n\t\t\t * Given a starting point index A, the ending point index B for the X-, Y-\r\n\t\t\t * and Z-plane is defined as A + 1, A + N and A + N² respectively where N is\r\n\t\t\t * the grid resolution + 1.\r\n\t\t\t *\r\n\t\t\t * @property edges\r\n\t\t\t * @type Array\r\n\t\t\t */\r\n\r\n\t\t\tthis.edges = [\r\n\t\t\t\tnew Uint32Array(c),\r\n\t\t\t\tnew Uint32Array(c),\r\n\t\t\t\tnew Uint32Array(c)\r\n\t\t\t];\r\n\r\n\t\t\t/**\r\n\t\t\t * The Zero Crossing interpolation values.\r\n\t\t\t *\r\n\t\t\t * Each value describes the relative surface intersection position on the\r\n\t\t\t * respective edge. The values correspond to the order of the edges.\r\n\t\t\t *\r\n\t\t\t * @property zeroCrossings\r\n\t\t\t * @type Array\r\n\t\t\t */\r\n\r\n\t\t\tthis.zeroCrossings = [\r\n\t\t\t\tnew Float32Array(c),\r\n\t\t\t\tnew Float32Array(c),\r\n\t\t\t\tnew Float32Array(c)\r\n\t\t\t];\r\n\r\n\t\t\t/**\r\n\t\t\t * The surface intersection normals.\r\n\t\t\t *\r\n\t\t\t * The vectors are stored as [x, y, z] float triples and correspond to the\r\n\t\t\t * order of the edges.\r\n\t\t\t *\r\n\t\t\t * @property normals\r\n\t\t\t * @type Array\r\n\t\t\t */\r\n\r\n\t\t\tthis.normals = [\r\n\t\t\t\tnew Float32Array(c * 3),\r\n\t\t\t\tnew Float32Array(c * 3),\r\n\t\t\t\tnew Float32Array(c * 3)\r\n\t\t\t];\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @method createTransferList\r\n\t\t * @param {Array} [transferList] - An existing list to be filled with transferable items.\r\n\t\t * @return {Array} A transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\tconst arrays = [\r\n\r\n\t\t\t\tthis.edges[0],\r\n\t\t\t\tthis.edges[1],\r\n\t\t\t\tthis.edges[2],\r\n\r\n\t\t\t\tthis.zeroCrossings[0],\r\n\t\t\t\tthis.zeroCrossings[1],\r\n\t\t\t\tthis.zeroCrossings[2],\r\n\r\n\t\t\t\tthis.normals[0],\r\n\t\t\t\tthis.normals[1],\r\n\t\t\t\tthis.normals[2]\r\n\r\n\t\t\t];\r\n\r\n\t\t\tlet array;\r\n\r\n\t\t\twhile(arrays.length > 0) {\r\n\r\n\t\t\t\tarray = arrays.pop();\r\n\r\n\t\t\t\tif(array !== null) {\r\n\r\n\t\t\t\t\ttransferList.push(array.buffer);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this data.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} The serialised version of the data.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\treturn {\r\n\t\t\t\tedges: this.edges,\r\n\t\t\t\tzeroCrossings: this.zeroCrossings,\r\n\t\t\t\tnormals: this.normals\r\n\t\t\t};\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the given serialised data.\r\n\t\t *\r\n\t\t * @method deserialise\r\n\t\t * @param {Object} data - Serialised data.\r\n\t\t */\r\n\r\n\t\tdeserialise(data) {\r\n\r\n\t\t\tthis.edges = data.edges;\r\n\t\t\tthis.zeroCrossings = data.zeroCrossings;\r\n\t\t\tthis.normals = data.normals;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * The material grid resolution.\r\n\t *\r\n\t * @property resolution\r\n\t * @type Number\r\n\t * @private\r\n\t * @static\r\n\t * @default 0\r\n\t */\r\n\r\n\tlet resolution = 0;\r\n\r\n\t/**\r\n\t * The total amount of grid point indices.\r\n\t *\r\n\t * @property indexCount\r\n\t * @type Number\r\n\t * @private\r\n\t * @static\r\n\t * @default 0\r\n\t */\r\n\r\n\tlet indexCount = 0;\r\n\r\n\t/**\r\n\t * Hermite data.\r\n\t *\r\n\t * @class HermiteData\r\n\t * @submodule volume\r\n\t * @constructor\r\n\t * @param {Boolean} [initialise=true] - Whether the data should be initialised immediately.\r\n\t */\r\n\r\n\tclass HermiteData {\r\n\r\n\t\tconstructor(initialise = true) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The current level of detail.\r\n\t\t\t *\r\n\t\t\t * @property lod\r\n\t\t\t * @type Number\r\n\t\t\t * @default -1\r\n\t\t\t */\r\n\r\n\t\t\tthis.lod = -1;\r\n\r\n\t\t\t/**\r\n\t\t\t * Indicates whether this data is currently gone.\r\n\t\t\t *\r\n\t\t\t * @property neutered\r\n\t\t\t * @type Boolean\r\n\t\t\t * @default false\r\n\t\t\t */\r\n\r\n\t\t\tthis.neutered = false;\r\n\r\n\t\t\t/**\r\n\t\t\t * Describes how many material indices are currently solid:\r\n\t\t\t *\r\n\t\t\t * - The chunk lies outside the volume if there are no solid grid points.\r\n\t\t\t * - The chunk lies completely inside the volume if all points are solid.\r\n\t\t\t *\r\n\t\t\t * @property materials\r\n\t\t\t * @type Number\r\n\t\t\t * @default 0\r\n\t\t\t */\r\n\r\n\t\t\tthis.materials = 0;\r\n\r\n\t\t\t/**\r\n\t\t\t * The grid points.\r\n\t\t\t *\r\n\t\t\t * @property materialIndices\r\n\t\t\t * @type Uint8Array\r\n\t\t\t */\r\n\r\n\t\t\tthis.materialIndices = initialise ? new Uint8Array(indexCount) : null;\r\n\r\n\t\t\t/**\r\n\t\t\t * Run-length compression data.\r\n\t\t\t *\r\n\t\t\t * @property runLengths\r\n\t\t\t * @type Uint32Array\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.runLengths = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * The edge data.\r\n\t\t\t *\r\n\t\t\t * @property edgeData\r\n\t\t\t * @type EdgeData\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.edgeData = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Indicates whether this data container is empty.\r\n\t\t *\r\n\t\t * @property empty\r\n\t\t * @type Boolean\r\n\t\t */\r\n\r\n\t\tget empty() { return (this.materials === 0); }\r\n\r\n\t\t/**\r\n\t\t * Indicates whether this data container is full.\r\n\t\t *\r\n\t\t * @property full\r\n\t\t * @type Boolean\r\n\t\t */\r\n\r\n\t\tget full() { return (this.materials === indexCount); }\r\n\r\n\t\t/**\r\n\t\t * Compresses this data.\r\n\t\t *\r\n\t\t * @method compress\r\n\t\t * @chainable\r\n\t\t * @return {HermiteData} This data.\r\n\t\t */\r\n\r\n\t\tcompress() {\r\n\r\n\t\t\tlet encoding;\r\n\r\n\t\t\tif(this.runLengths === null) {\r\n\r\n\t\t\t\tif(this.full) {\r\n\r\n\t\t\t\t\tencoding = {\r\n\t\t\t\t\t\trunLengths: [this.materialIndices.length],\r\n\t\t\t\t\t\tdata: [Density.SOLID]\r\n\t\t\t\t\t};\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tencoding = RunLengthEncoder.encode(this.materialIndices);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tthis.runLengths = new Uint32Array(encoding.runLengths);\r\n\t\t\t\tthis.materialIndices = new Uint8Array(encoding.data);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Decompresses this data.\r\n\t\t *\r\n\t\t * @method decompress\r\n\t\t * @chainable\r\n\t\t * @return {HermiteData} This data.\r\n\t\t */\r\n\r\n\t\tdecompress() {\r\n\r\n\t\t\tif(this.runLengths !== null) {\r\n\r\n\t\t\t\tthis.materialIndices = RunLengthEncoder.decode(\r\n\t\t\t\t\tthis.runLengths, this.materialIndices, new Uint8Array(indexCount)\r\n\t\t\t\t);\r\n\r\n\t\t\t\tthis.runLengths = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the specified material index.\r\n\t\t *\r\n\t\t * @method setMaterialIndex\r\n\t\t * @param {Number} index - The index of the material index that should be updated.\r\n\t\t * @param {Number} value - The new material index.\r\n\t\t */\r\n\r\n\t\tsetMaterialIndex(index, value) {\r\n\r\n\t\t\t// Keep track of how many material indices are solid.\r\n\t\t\tif(this.materialIndices[index] === Density.HOLLOW && value !== Density.HOLLOW) {\r\n\r\n\t\t\t\t++this.materials;\r\n\r\n\t\t\t} else if(this.materialIndices[index] !== Density.HOLLOW && value === Density.HOLLOW) {\r\n\r\n\t\t\t\t--this.materials;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.materialIndices[index] = value;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @method createTransferList\r\n\t\t * @param {Array} [transferList] - An existing list to be filled with transferable items.\r\n\t\t * @return {Array} A transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\tif(this.edgeData !== null) { this.edgeData.createTransferList(transferList); }\r\n\r\n\t\t\ttransferList.push(this.materialIndices.buffer);\r\n\t\t\ttransferList.push(this.runLengths.buffer);\r\n\r\n\t\t\treturn transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this data.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} The serialised version of the data.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\tthis.neutered = true;\r\n\r\n\t\t\treturn {\r\n\t\t\t\tlod: this.lod,\r\n\t\t\t\tmaterials: this.materials,\r\n\t\t\t\tmaterialIndices: this.materialIndices,\r\n\t\t\t\trunLengths: this.runLengths,\r\n\t\t\t\tedgeData: (this.edgeData !== null) ? this.edgeData.serialise() : null\r\n\t\t\t};\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the given serialised data.\r\n\t\t *\r\n\t\t * @method deserialise\r\n\t\t * @param {Object} data - Serialised data.\r\n\t\t */\r\n\r\n\t\tdeserialise(data) {\r\n\r\n\t\t\tthis.lod = data.lod;\r\n\t\t\tthis.materials = data.materials;\r\n\r\n\t\t\tthis.materialIndices = data.materialIndices;\r\n\t\t\tthis.runLengths = data.runLengths;\r\n\r\n\t\t\tif(data.edgeData !== null) {\r\n\r\n\t\t\t\tif(this.edgeData === null) {\r\n\r\n\t\t\t\t\tthis.edgeData = new EdgeData(0);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tthis.edgeData.deserialise(data.edgeData);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tthis.edgeData = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tthis.neutered = false;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The material grid resolution.\r\n\t\t *\r\n\t\t * @property resolution\r\n\t\t * @type Number\r\n\t\t * @static\r\n\t\t */\r\n\r\n\t\tstatic get resolution() { return resolution; }\r\n\r\n\t\tstatic set resolution(x) {\r\n\r\n\t\t\tif(resolution === 0) {\r\n\r\n\t\t\t\tresolution = Math.max(1, Math.min(256, x));\r\n\t\t\t\tindexCount = Math.pow((resolution + 1), 3);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A cubic volume chunk.\r\n\t *\r\n\t * @class Chunk\r\n\t * @submodule octree\r\n\t * @extends CubicOctant\r\n\t * @constructor\r\n\t * @param {Vector3} min - The lower bounds.\r\n\t * @param {Vector3} max - The size.\r\n\t */\r\n\r\n\tclass Chunk extends CubicOctant {\r\n\r\n\t\tconstructor(min, size) {\r\n\r\n\t\t\tsuper(min, size);\r\n\r\n\t\t\t/**\r\n\t\t\t * Hermite data.\r\n\t\t\t *\r\n\t\t\t * @property data\r\n\t\t\t * @type HermiteData\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * A CSG operation queue.\r\n\t\t\t *\r\n\t\t\t * @property csg\r\n\t\t\t * @type Queue\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.csg = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The material grid resolution of all volume chunks. The upper limit is 256.\r\n\t\t *\r\n\t\t * The effective resolution of a chunk is the distance between two adjacent\r\n\t\t * grid points in global coordinates.\r\n\t\t *\r\n\t\t * This value can only be set once.\r\n\t\t *\r\n\t\t * @property resolution\r\n\t\t * @type Number\r\n\t\t */\r\n\r\n\t\tget resolution() { return HermiteData.resolution; }\r\n\r\n\t\tset resolution(x) { HermiteData.resolution = x; }\r\n\r\n\t\t/**\r\n\t\t * Creates a list of transferable items.\r\n\t\t *\r\n\t\t * @method createTransferList\r\n\t\t * @param {Array} [transferList] - An existing list to be filled with transferable items.\r\n\t\t * @return {Array} A transfer list.\r\n\t\t */\r\n\r\n\t\tcreateTransferList(transferList = []) {\r\n\r\n\t\t\treturn (this.data !== null) ? this.data.createTransferList(transferList) : transferList;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this chunk.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} A serialised description of this chunk.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\treturn {\r\n\t\t\t\tresolution: this.resolution,\r\n\t\t\t\tmin: this.min.toArray(),\r\n\t\t\t\tsize: this.size,\r\n\t\t\t\tdata: (this.data !== null) ? this.data.serialise() : null\r\n\t\t\t};\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adopts the given serialised data.\r\n\t\t *\r\n\t\t * @method deserialise\r\n\t\t * @param {Object} chunk - A serialised description.\r\n\t\t */\r\n\r\n\t\tdeserialise(chunk) {\r\n\r\n\t\t\tthis.resolution = chunk.resolution;\r\n\t\t\tthis.min.fromArray(chunk.min);\r\n\t\t\tthis.size = chunk.size;\r\n\r\n\t\t\tif(chunk.data !== null) {\r\n\r\n\t\t\t\tif(this.data === null) {\r\n\r\n\t\t\t\t\tthis.data = new HermiteData(false);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\tthis.data.deserialise(chunk.data);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tthis.data = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An enumeration of worker actions.\r\n\t *\r\n\t * @class Action\r\n\t * @submodule worker\r\n\t * @static\r\n\t */\r\n\r\n\tconst Action = {\r\n\r\n\t\t/**\r\n\t\t * Isosurface extraction signal.\r\n\t\t *\r\n\t\t * @property EXTRACT\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tEXTRACT: \"worker.extract\",\r\n\r\n\t\t/**\r\n\t\t * Hermite data modification signal.\r\n\t\t *\r\n\t\t * @property MODIFY\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tMODIFY: \"worker.modify\",\r\n\r\n\t\t/**\r\n\t\t * Thread termination signal.\r\n\t\t *\r\n\t\t * @property CLOSE\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tCLOSE: \"worker.close\"\r\n\r\n\t};\n\n\t/**\r\n\t * A surface extractor that generates triangles from hermite data.\r\n\t *\r\n\t * @class SurfaceExtractor\r\n\t * @submodule worker\r\n\t * @static\r\n\t */\r\n\r\n\tconst SurfaceExtractor = {\r\n\r\n\t\t/**\r\n\t\t * An empty chunk of hermite data.\r\n\t\t *\r\n\t\t * @property chunk\r\n\t\t * @type Chunk\r\n\t\t * @static\r\n\t\t */\r\n\r\n\t\tchunk: new Chunk(),\r\n\r\n\t\t/**\r\n\t\t * A container for the data that will be returned to the main thread.\r\n\t\t *\r\n\t\t * @property message\r\n\t\t * @type Object\r\n\t\t * @static\r\n\t\t */\r\n\r\n\t\tmessage: {\r\n\t\t\taction: Action.EXTRACT,\r\n\t\t\tchunk: null,\r\n\t\t\tpositions: null,\r\n\t\t\tnormals: null,\r\n\t\t\tindices: null\r\n\t\t},\r\n\r\n\t\t/**\r\n\t\t * A list of transferable objects.\r\n\t\t *\r\n\t\t * @property transferList\r\n\t\t * @type Array\r\n\t\t * @static\r\n\t\t */\r\n\r\n\t\ttransferList: null,\r\n\r\n\t\t/**\r\n\t\t * Extracts a surface from the given hermite data.\r\n\t\t *\r\n\t\t * @method extract\r\n\t\t * @static\r\n\t\t * @param {Object} chunk - A serialised volume chunk.\r\n\t\t */\r\n\r\n\t\textract(chunk) {\r\n\r\n\t\t\tconst message = this.message;\r\n\t\t\tconst transferList = [];\r\n\r\n\t\t\t// Adopt the provided chunk data.\r\n\t\t\tthis.chunk.deserialise(chunk);\r\n\t\t\tthis.chunk.data.decompress();\r\n\r\n\t\t\tconst result = DualContouring.run(this.chunk);\r\n\r\n\t\t\tif(result !== null) {\r\n\r\n\t\t\t\tmessage.indices = result.indices;\r\n\t\t\t\tmessage.positions = result.positions;\r\n\t\t\t\tmessage.normals = result.normals;\r\n\r\n\t\t\t\ttransferList.push(message.indices.buffer);\r\n\t\t\t\ttransferList.push(message.positions.buffer);\r\n\t\t\t\ttransferList.push(message.normals.buffer);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tmessage.indices = null;\r\n\t\t\t\tmessage.positions = null;\r\n\t\t\t\tmessage.normals = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Simply send the already compressed and serialised chunk back.\r\n\t\t\tthis.chunk.deserialise(chunk);\r\n\t\t\tmessage.chunk = this.chunk.serialise();\r\n\t\t\tthis.transferList = this.chunk.createTransferList(transferList);\r\n\r\n\t\t}\r\n\r\n\t};\n\n\t/**\r\n\t * A bounding box.\r\n\t *\r\n\t * @class Box3\r\n\t * @submodule math\r\n\t * @constructor\r\n\t * @param {Vector3} [min] - The lower bounds.\r\n\t * @param {Vector3} [max] - The upper bounds.\r\n\t */\r\n\r\n\tclass Box3$1 {\r\n\r\n\t\tconstructor(\r\n\t\t\tmin = new Vector3$1(Infinity, Infinity, Infinity),\r\n\t\t\tmax = new Vector3$1(-Infinity, -Infinity, -Infinity)\r\n\t\t) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The min bounds.\r\n\t\t\t *\r\n\t\t\t * @property min\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = min;\r\n\r\n\t\t\t/**\r\n\t\t\t * The max bounds.\r\n\t\t\t *\r\n\t\t\t * @property max\r\n\t\t\t * @type Vector3\r\n\t\t\t */\r\n\r\n\t\t\tthis.max = max;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Sets the values of this box.\r\n\t\t *\r\n\t\t * @method set\r\n\t\t * @param {Number} min - The min bounds.\r\n\t\t * @param {Number} max - The max bounds.\r\n\t\t * @return {Matrix3} This box.\r\n\t\t */\r\n\r\n\t\tset(min, max) {\r\n\r\n\t\t\tthis.min.copy(min);\r\n\t\t\tthis.max.copy(max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Copies the values of a given box.\r\n\t\t *\r\n\t\t * @method copy\r\n\t\t * @param {Matrix3} b - A box.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tcopy(b) {\r\n\r\n\t\t\tthis.min.copy(b.min);\r\n\t\t\tthis.max.copy(b.max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Clones this matrix.\r\n\t\t *\r\n\t\t * @method clone\r\n\t\t * @return {Matrix3} A clone of this matrix.\r\n\t\t */\r\n\r\n\t\tclone() {\r\n\r\n\t\t\treturn new this.constructor().copy(this);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Expands this box by the given point.\r\n\t\t *\r\n\t\t * @method expandByPoint\r\n\t\t * @param {Matrix3} p - A point.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\texpandByPoint(p) {\r\n\r\n\t\t\tthis.min.min(p);\r\n\t\t\tthis.max.max(p);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Expands this box by combining it with the given one.\r\n\t\t *\r\n\t\t * @method union\r\n\t\t * @param {Box3} b - A box.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tunion(b) {\r\n\r\n\t\t\tthis.min.min(b.min);\r\n\t\t\tthis.max.max(b.max);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Defines this box by the given points.\r\n\t\t *\r\n\t\t * @method setFromPoints\r\n\t\t * @param {Array} points - The points.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tsetFromPoints(points) {\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = points.length; i < l; ++i) {\r\n\r\n\t\t\t\tthis.expandByPoint(points[i]);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Defines this box by the given center and size.\r\n\t\t *\r\n\t\t * @method setFromCenterAndSize\r\n\t\t * @param {Vector3} center - The center.\r\n\t\t * @param {Number} size - The size.\r\n\t\t * @return {Box3} This box.\r\n\t\t */\r\n\r\n\t\tsetFromCenterAndSize(center, size) {\r\n\r\n\t\t\tconst halfSize = size.clone().multiplyScalar(0.5);\r\n\r\n\t\t\tthis.min.copy(center).sub(halfSize);\r\n\t\t\tthis.max.copy(center).add(halfSize);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Checks if this box intersects with the given one.\r\n\t\t *\r\n\t\t * @method intersectsBox\r\n\t\t * @param {Matrix3} box - A box.\r\n\t\t * @return {Boolean} Whether the boxes intersect.\r\n\t\t */\r\n\r\n\t\tintersectsBox(box) {\r\n\r\n\t\t\treturn !(\r\n\t\t\t\tbox.max.x < this.min.x || box.min.x > this.max.x ||\r\n\t\t\t\tbox.max.y < this.min.y || box.min.y > this.max.y ||\r\n\t\t\t\tbox.max.z < this.min.z || box.min.z > this.max.z\r\n\t\t\t);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An enumeration of CSG operation types.\r\n\t *\r\n\t * @class OperationType\r\n\t * @submodule csg\r\n\t * @static\r\n\t */\r\n\r\n\tconst OperationType = {\r\n\r\n\t\t/**\r\n\t\t * Indicates a union of volume data.\r\n\t\t *\r\n\t\t * @property UNION\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tUNION: \"csg.union\",\r\n\r\n\t\t/**\r\n\t\t * Indicates a subtraction of volume data.\r\n\t\t *\r\n\t\t * @property DIFFERENCE\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tDIFFERENCE: \"csg.difference\",\r\n\r\n\t\t/**\r\n\t\t * Indicates an intersection of volume data.\r\n\t\t *\r\n\t\t * @property INTERSECTION\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tINTERSECTION: \"csg.intersection\",\r\n\r\n\t\t/**\r\n\t\t * Indicates volume data generation.\r\n\t\t *\r\n\t\t * @property DENSITY_FUNCTION\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tDENSITY_FUNCTION: \"csg.densityfunction\"\r\n\r\n\t};\n\n\t/**\r\n\t * A CSG operation.\r\n\t *\r\n\t * @class Operation\r\n\t * @submodule csg\r\n\t * @constructor\r\n\t * @param {OperationType} type - The type of this operation.\r\n\t * @param {Operation} ...children - Child operations.\r\n\t */\r\n\r\n\tclass Operation {\r\n\r\n\t\tconstructor(type, ...children) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The type of this operation.\r\n\t\t\t *\r\n\t\t\t * @property type\r\n\t\t\t * @type OperationType\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.type = type;\r\n\r\n\t\t\t/**\r\n\t\t\t * A list of operations.\r\n\t\t\t *\r\n\t\t\t * Right-hand side operands have precedence, meaning that the result of the\r\n\t\t\t * first item in the list will be dominated by the result of the second one,\r\n\t\t\t * etc.\r\n\t\t\t *\r\n\t\t\t * @property children\r\n\t\t\t * @type Array\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.children = children;\r\n\r\n\t\t\t/**\r\n\t\t\t * The bounding box of this operation.\r\n\t\t\t *\r\n\t\t\t * @property bbox\r\n\t\t\t * @type Box3\r\n\t\t\t * @private\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.bbox = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The bounding box of this operation.\r\n\t\t *\r\n\t\t * @property boundingBox\r\n\t\t * @type Box3\r\n\t\t */\r\n\r\n\t\tget boundingBox() {\r\n\r\n\t\t\treturn (this.bbox !== null) ? this.bbox : this.computeBoundingBox();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this operation.\r\n\t\t *\r\n\t\t * @method computeBoundingBox\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tthis.bbox = new Box3$1();\r\n\r\n\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\tthis.bbox.union(children[i].boundingBox);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn this.bbox;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A union operation.\r\n\t *\r\n\t * @class Union\r\n\t * @submodule csg\r\n\t * @extends Operation\r\n\t * @constructor\r\n\t * @param {Operation} ...children - Child operations.\r\n\t */\r\n\r\n\tclass Union extends Operation {\r\n\r\n\t\tconstructor(...children) {\r\n\r\n\t\t\tsuper(OperationType.UNION, ...children);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Updates the specified material index.\r\n\t\t *\r\n\t\t * @method updateMaterialIndex\r\n\t\t * @param {Number} index - The index of the material index that needs to be updated.\r\n\t\t * @param {HermiteData} data0 - The target volume data.\r\n\t\t * @param {HermiteData} data1 - Predominant volume data.\r\n\t\t */\r\n\r\n\t\tupdateMaterialIndex(index, data0, data1) {\r\n\r\n\t\t\tconst materialIndex = data1.materialIndices[index];\r\n\r\n\t\t\tif(materialIndex !== Density.HOLLOW) {\r\n\r\n\t\t\t\tdata0.setMaterialIndex(index, materialIndex);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Selects the edge that is closer to the non-solid grid point.\r\n\t\t *\r\n\t\t * @method selectEdge\r\n\t\t * @param {Edge} edge0 - An existing edge.\r\n\t\t * @param {Edge} edge1 - A predominant edge.\r\n\t\t * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n\t\t * @return {Edge} The selected edge.\r\n\t\t */\r\n\r\n\t\tselectEdge(edge0, edge1, s) {\r\n\r\n\t\t\treturn s ?\r\n\t\t\t\t((edge0.t > edge1.t) ? edge0 : edge1) :\r\n\t\t\t\t((edge0.t < edge1.t) ? edge0 : edge1);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A difference operation.\r\n\t *\r\n\t * @class Difference\r\n\t * @submodule csg\r\n\t * @extends Operation\r\n\t * @constructor\r\n\t * @param {Operation} ...children - Child operations.\r\n\t */\r\n\r\n\tclass Difference extends Operation {\r\n\r\n\t\tconstructor(...children) {\r\n\r\n\t\t\tsuper(OperationType.DIFFERENCE, ...children);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Updates the specified material index.\r\n\t\t *\r\n\t\t * @method updateMaterialIndex\r\n\t\t * @param {Number} index - The index of the material index that needs to be updated.\r\n\t\t * @param {HermiteData} data0 - The target volume data.\r\n\t\t * @param {HermiteData} data1 - Predominant volume data.\r\n\t\t */\r\n\r\n\t\tupdateMaterialIndex(index, data0, data1) {\r\n\r\n\t\t\tif(data1.materialIndices[index] !== Density.HOLLOW) {\r\n\r\n\t\t\t\tdata0.setMaterialIndex(index, Density.HOLLOW);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Selects the edge that is closer to the solid grid point.\r\n\t\t *\r\n\t\t * @method selectEdge\r\n\t\t * @param {Edge} edge0 - An existing edge.\r\n\t\t * @param {Edge} edge1 - A predominant edge.\r\n\t\t * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n\t\t * @return {Edge} The selected edge.\r\n\t\t */\r\n\r\n\t\tselectEdge(edge0, edge1, s) {\r\n\r\n\t\t\treturn s ?\r\n\t\t\t\t((edge0.t < edge1.t) ? edge0 : edge1) :\r\n\t\t\t\t((edge0.t > edge1.t) ? edge0 : edge1);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An intersection operation.\r\n\t *\r\n\t * @class Intersection\r\n\t * @submodule csg\r\n\t * @extends Operation\r\n\t * @constructor\r\n\t * @param {Operation} ...children - Child operations.\r\n\t */\r\n\r\n\tclass Intersection extends Operation {\r\n\r\n\t\tconstructor(...children) {\r\n\r\n\t\t\tsuper(OperationType.INTERSECTION, ...children);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Updates the specified material index.\r\n\t\t *\r\n\t\t * @method updateMaterialIndex\r\n\t\t * @param {Number} index - The index of the material index that needs to be updated.\r\n\t\t * @param {HermiteData} data0 - The target volume data.\r\n\t\t * @param {HermiteData} data1 - Predominant volume data.\r\n\t\t */\r\n\r\n\t\tupdateMaterialIndex(index, data0, data1) {\r\n\r\n\t\t\tconst materialIndex = data1.materialIndices[index];\r\n\r\n\t\t\tdata0.setMaterialIndex(index, (data0.materialIndices[index] !== Density.HOLLOW && materialIndex !== Density.HOLLOW) ? materialIndex : Density.HOLLOW);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Selects the edge that is closer to the solid grid point.\r\n\t\t *\r\n\t\t * @method selectEdge\r\n\t\t * @param {Edge} edge0 - An existing edge.\r\n\t\t * @param {Edge} edge1 - A predominant edge.\r\n\t\t * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n\t\t * @return {Edge} The selected edge.\r\n\t\t */\r\n\r\n\t\tselectEdge(edge0, edge1, s) {\r\n\r\n\t\t\treturn s ?\r\n\t\t\t\t((edge0.t < edge1.t) ? edge0 : edge1) :\r\n\t\t\t\t((edge0.t > edge1.t) ? edge0 : edge1);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * Finds out which grid points lie inside the area of the given operation.\r\n\t *\r\n\t * @method computeIndexBounds\r\n\t * @private\r\n\t * @static\r\n\t * @param {Chunk} chunk - A volume chunk.\r\n\t * @param {Operation} operation - A CSG operation.\r\n\t * @return {Box3} The index bounds.\r\n\t */\r\n\r\n\tfunction computeIndexBounds(chunk, operation) {\r\n\r\n\t\tconst s = chunk.size;\r\n\t\tconst n = chunk.resolution;\r\n\r\n\t\tconst min = new Vector3$1(0, 0, 0);\r\n\t\tconst max = new Vector3$1(n, n, n);\r\n\r\n\t\tconst region = new Box3$1(chunk.min, chunk.max);\r\n\r\n\t\tif(operation.type !== OperationType.INTERSECTION) {\r\n\r\n\t\t\tif(operation.boundingBox.intersectsBox(region)) {\r\n\r\n\t\t\t\tmin.copy(operation.boundingBox.min).max(region.min).sub(region.min);\r\n\r\n\t\t\t\tmin.x = Math.ceil(min.x * n / s);\r\n\t\t\t\tmin.y = Math.ceil(min.y * n / s);\r\n\t\t\t\tmin.z = Math.ceil(min.z * n / s);\r\n\r\n\t\t\t\tmax.copy(operation.boundingBox.max).min(region.max).sub(region.min);\r\n\r\n\t\t\t\tmax.x = Math.floor(max.x * n / s);\r\n\t\t\t\tmax.y = Math.floor(max.y * n / s);\r\n\t\t\t\tmax.z = Math.floor(max.z * n / s);\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\t// The chunk is unaffected by this operation.\r\n\t\t\t\tmin.set(n, n, n);\r\n\t\t\t\tmax.set(0, 0, 0);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\treturn new Box3$1(min, max);\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Combines material indices.\r\n\t *\r\n\t * @method combineMaterialIndices\r\n\t * @private\r\n\t * @static\r\n\t * @param {Chunk} chunk - A volume chunk\r\n\t * @param {Operation} operation - A CSG operation.\r\n\t * @param {HermiteData} data0 - A target data set.\r\n\t * @param {HermiteData} data1 - A predominant data set.\r\n\t * @param {Box3} bounds - Grid iteration limits.\r\n\t */\r\n\r\n\tfunction combineMaterialIndices(chunk, operation, data0, data1, bounds) {\r\n\r\n\t\tconst m = chunk.resolution + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst X = bounds.max.x;\r\n\t\tconst Y = bounds.max.y;\r\n\t\tconst Z = bounds.max.z;\r\n\r\n\t\tlet x, y, z;\r\n\r\n\t\tfor(z = bounds.min.z; z <= Z; ++z) {\r\n\r\n\t\t\tfor(y = bounds.min.y; y <= Y; ++y) {\r\n\r\n\t\t\t\tfor(x = bounds.min.x; x <= X; ++x) {\r\n\r\n\t\t\t\t\toperation.updateMaterialIndex((z * mm + y * m + x), data0, data1);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Generates material indices.\r\n\t *\r\n\t * @method generateMaterialIndices\r\n\t * @private\r\n\t * @static\r\n\t * @param {Chunk} chunk - A volume chunk\r\n\t * @param {DensityFunction} operation - A CSG operation.\r\n\t * @param {HermiteData} data - A target data set.\r\n\t * @param {Box3} bounds - Grid iteration limits.\r\n\t */\r\n\r\n\tfunction generateMaterialIndices(chunk, operation, data, bounds) {\r\n\r\n\t\tconst s = chunk.size;\r\n\t\tconst n = chunk.resolution;\r\n\t\tconst m = n + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst materialIndices = data.materialIndices;\r\n\r\n\t\tconst base = chunk.min;\r\n\t\tconst offset = new Vector3$1();\r\n\t\tconst position = new Vector3$1();\r\n\r\n\t\tconst X = bounds.max.x;\r\n\t\tconst Y = bounds.max.y;\r\n\t\tconst Z = bounds.max.z;\r\n\r\n\t\tlet materialIndex;\r\n\t\tlet materials = 0;\r\n\r\n\t\tlet x, y, z;\r\n\r\n\t\tfor(z = bounds.min.z; z <= Z; ++z) {\r\n\r\n\t\t\toffset.z = z * s / n;\r\n\r\n\t\t\tfor(y = bounds.min.y; y <= Y; ++y) {\r\n\r\n\t\t\t\toffset.y = y * s / n;\r\n\r\n\t\t\t\tfor(x = bounds.min.x; x <= X; ++x) {\r\n\r\n\t\t\t\t\toffset.x = x * s / n;\r\n\r\n\t\t\t\t\tmaterialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));\r\n\r\n\t\t\t\t\tif(materialIndex !== Density.HOLLOW) {\r\n\r\n\t\t\t\t\t\tmaterialIndices[z * mm + y * m + x] = materialIndex;\r\n\r\n\t\t\t\t\t\t++materials;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\tdata.materials = materials;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Combines edges.\r\n\t *\r\n\t * @method combineEdges\r\n\t * @private\r\n\t * @static\r\n\t * @param {Chunk} chunk - A volume chunk\r\n\t * @param {Operation} operation - A CSG operation.\r\n\t * @param {HermiteData} data0 - A target data set.\r\n\t * @param {HermiteData} data1 - A predominant data set.\r\n\t * @return {Object} The generated edge data.\r\n\t */\r\n\r\n\tfunction combineEdges(chunk, operation, data0, data1) {\r\n\r\n\t\tconst m = chunk.resolution + 1;\r\n\t\tconst indexOffsets = new Uint32Array([1, m, m * m]);\r\n\r\n\t\tconst materialIndices = data0.materialIndices;\r\n\r\n\t\tconst edge1 = new Edge();\r\n\t\tconst edge0 = new Edge();\r\n\r\n\t\tconst edgeData1 = data1.edgeData;\r\n\t\tconst edgeData0 = data0.edgeData;\r\n\t\tconst edgeData = new EdgeData(chunk.resolution);\r\n\t\tconst lengths = new Uint32Array(3);\r\n\r\n\t\tlet edges1, zeroCrossings1, normals1;\r\n\t\tlet edges0, zeroCrossings0, normals0;\r\n\t\tlet edges, zeroCrossings, normals;\r\n\r\n\t\tlet indexA1, indexB1;\r\n\t\tlet indexA0, indexB0;\r\n\r\n\t\tlet m1, m2;\r\n\t\tlet edge;\r\n\r\n\t\tlet c, d, i, j, il, jl;\r\n\r\n\t\t// Process the edges along the X-axis, then Y and finally Z.\r\n\t\tfor(c = 0, d = 0; d < 3; c = 0, ++d) {\r\n\r\n\t\t\tedges1 = edgeData1.edges[d];\r\n\t\t\tedges0 = edgeData0.edges[d];\r\n\t\t\tedges = edgeData.edges[d];\r\n\r\n\t\t\tzeroCrossings1 = edgeData1.zeroCrossings[d];\r\n\t\t\tzeroCrossings0 = edgeData0.zeroCrossings[d];\r\n\t\t\tzeroCrossings = edgeData.zeroCrossings[d];\r\n\r\n\t\t\tnormals1 = edgeData1.normals[d];\r\n\t\t\tnormals0 = edgeData0.normals[d];\r\n\t\t\tnormals = edgeData.normals[d];\r\n\r\n\t\t\til = edges1.length;\r\n\t\t\tjl = edges0.length;\r\n\r\n\t\t\t// Process all generated edges.\r\n\t\t\tfor(i = 0, j = 0; i < il; ++i) {\r\n\r\n\t\t\t\tindexA1 = edges1[i];\r\n\t\t\t\tindexB1 = indexA1 + indexOffsets[d];\r\n\r\n\t\t\t\tm1 = materialIndices[indexA1];\r\n\t\t\t\tm2 = materialIndices[indexB1];\r\n\r\n\t\t\t\tif(m1 !== m2 && (m1 === Density.HOLLOW || m2 === Density.HOLLOW)) {\r\n\r\n\t\t\t\t\tedge1.t = zeroCrossings1[i];\r\n\t\t\t\t\tedge1.n.x = normals1[i * 3];\r\n\t\t\t\t\tedge1.n.y = normals1[i * 3 + 1];\r\n\t\t\t\t\tedge1.n.z = normals1[i * 3 + 2];\r\n\r\n\t\t\t\t\tif(operation.type === OperationType.DIFFERENCE) {\r\n\r\n\t\t\t\t\t\tedge1.n.negate();\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tedge = edge1;\r\n\r\n\t\t\t\t\t// Process existing edges up to the generated edge.\r\n\t\t\t\t\twhile(j < jl && edges0[j] <= indexA1) {\r\n\r\n\t\t\t\t\t\tindexA0 = edges0[j];\r\n\t\t\t\t\t\tindexB0 = indexA0 + indexOffsets[d];\r\n\r\n\t\t\t\t\t\tedge0.t = zeroCrossings0[j];\r\n\t\t\t\t\t\tedge0.n.x = normals0[j * 3];\r\n\t\t\t\t\t\tedge0.n.y = normals0[j * 3 + 1];\r\n\t\t\t\t\t\tedge0.n.z = normals0[j * 3 + 2];\r\n\r\n\t\t\t\t\t\tif(indexA0 < indexA1) {\r\n\r\n\t\t\t\t\t\t\tm1 = materialIndices[indexA0];\r\n\t\t\t\t\t\t\tm2 = materialIndices[indexB0];\r\n\r\n\t\t\t\t\t\t\tif(m1 !== m2 && (m1 === Density.HOLLOW || m2 === Density.HOLLOW)) {\r\n\r\n\t\t\t\t\t\t\t\t// The edge exhibits a material change and there is no conflict.\r\n\t\t\t\t\t\t\t\tedges[c] = indexA0;\r\n\t\t\t\t\t\t\t\tzeroCrossings[c] = edge0.t;\r\n\t\t\t\t\t\t\t\tnormals[c * 3] = edge0.n.x;\r\n\t\t\t\t\t\t\t\tnormals[c * 3 + 1] = edge0.n.y;\r\n\t\t\t\t\t\t\t\tnormals[c * 3 + 2] = edge0.n.z;\r\n\r\n\t\t\t\t\t\t\t\t++c;\r\n\r\n\t\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t} else {\r\n\r\n\t\t\t\t\t\t\t// Resolve the conflict.\r\n\t\t\t\t\t\t\tedge = operation.selectEdge(edge0, edge1, (m1 === Density.SOLID));\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t\t++j;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tedges[c] = indexA1;\r\n\t\t\t\t\tzeroCrossings[c] = edge.t;\r\n\t\t\t\t\tnormals[c * 3] = edge.n.x;\r\n\t\t\t\t\tnormals[c * 3 + 1] = edge.n.y;\r\n\t\t\t\t\tnormals[c * 3 + 2] = edge.n.z;\r\n\r\n\t\t\t\t\t++c;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Collect remaining edges.\r\n\t\t\twhile(j < jl) {\r\n\r\n\t\t\t\tindexA0 = edges0[j];\r\n\t\t\t\tindexB0 = indexA0 + indexOffsets[d];\r\n\r\n\t\t\t\tm1 = materialIndices[indexA0];\r\n\t\t\t\tm2 = materialIndices[indexB0];\r\n\r\n\t\t\t\tif(m1 !== m2 && (m1 === Density.HOLLOW || m2 === Density.HOLLOW)) {\r\n\r\n\t\t\t\t\tedges[c] = indexA0;\r\n\t\t\t\t\tzeroCrossings[c] = zeroCrossings0[j];\r\n\t\t\t\t\tnormals[c * 3] = normals0[j * 3];\r\n\t\t\t\t\tnormals[c * 3 + 1] = normals0[j * 3 + 1];\r\n\t\t\t\t\tnormals[c * 3 + 2] = normals0[j * 3 + 2];\r\n\r\n\t\t\t\t\t++c;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\t++j;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tlengths[d] = c;\r\n\r\n\t\t}\r\n\r\n\t\treturn { edgeData, lengths };\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Generates edge data.\r\n\t *\r\n\t * @method generateEdges\r\n\t * @private\r\n\t * @static\r\n\t * @param {Chunk} chunk - A volume chunk\r\n\t * @param {DensityFunction} operation - A CSG operation.\r\n\t * @param {HermiteData} data - A target data set.\r\n\t * @param {Box3} bounds - Grid iteration limits.\r\n\t * @return {Object} The generated edge data.\r\n\t */\r\n\r\n\tfunction generateEdges(chunk, operation, data, bounds) {\r\n\r\n\t\tconst s = chunk.size;\r\n\t\tconst n = chunk.resolution;\r\n\t\tconst m = n + 1;\r\n\t\tconst mm = m * m;\r\n\r\n\t\tconst indexOffsets = new Uint32Array([1, m, mm]);\r\n\t\tconst materialIndices = data.materialIndices;\r\n\r\n\t\tconst base = chunk.min;\r\n\t\tconst offsetA = new Vector3$1();\r\n\t\tconst offsetB = new Vector3$1();\r\n\t\tconst edge = new Edge();\r\n\r\n\t\tconst edgeData = new EdgeData(n);\r\n\t\tconst lengths = new Uint32Array(3);\r\n\r\n\t\tlet edges, zeroCrossings, normals;\r\n\t\tlet indexA, indexB;\r\n\r\n\t\tlet minX, minY, minZ;\r\n\t\tlet maxX, maxY, maxZ;\r\n\r\n\t\tlet c, d, a, axis;\r\n\t\tlet x, y, z;\r\n\r\n\t\t// Process the edges along the X-axis, then Y and finally Z.\r\n\t\tfor(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {\r\n\r\n\t\t\t// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].\r\n\t\t\taxis = PATTERN[a];\r\n\r\n\t\t\tedges = edgeData.edges[d];\r\n\t\t\tzeroCrossings = edgeData.zeroCrossings[d];\r\n\t\t\tnormals = edgeData.normals[d];\r\n\r\n\t\t\tminX = bounds.min.x; maxX = bounds.max.x;\r\n\t\t\tminY = bounds.min.y; maxY = bounds.max.y;\r\n\t\t\tminZ = bounds.min.z; maxZ = bounds.max.z;\r\n\r\n\t\t\t/* Include edges that straddle the bounding box and avoid processing grid\r\n\t\t\tpoints at chunk borders. */\r\n\t\t\tswitch(d) {\r\n\r\n\t\t\t\tcase 0:\r\n\t\t\t\t\tminX = Math.max(minX - 1, 0);\r\n\t\t\t\t\tmaxX = Math.min(maxX, n - 1);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase 1:\r\n\t\t\t\t\tminY = Math.max(minY - 1, 0);\r\n\t\t\t\t\tmaxY = Math.min(maxY, n - 1);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase 2:\r\n\t\t\t\t\tminZ = Math.max(minZ - 1, 0);\r\n\t\t\t\t\tmaxZ = Math.min(maxZ, n - 1);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tfor(z = minZ; z <= maxZ; ++z) {\r\n\r\n\t\t\t\tfor(y = minY; y <= maxY; ++y) {\r\n\r\n\t\t\t\t\tfor(x = minX; x <= maxX; ++x) {\r\n\r\n\t\t\t\t\t\tindexA = z * mm + y * m + x;\r\n\t\t\t\t\t\tindexB = indexA + indexOffsets[d];\r\n\r\n\t\t\t\t\t\t// Check if the edge exhibits a material change.\r\n\t\t\t\t\t\tif(materialIndices[indexA] !== materialIndices[indexB]) {\r\n\r\n\t\t\t\t\t\t\toffsetA.set(\r\n\t\t\t\t\t\t\t\tx * s / n,\r\n\t\t\t\t\t\t\t\ty * s / n,\r\n\t\t\t\t\t\t\t\tz * s / n\r\n\t\t\t\t\t\t\t);\r\n\r\n\t\t\t\t\t\t\toffsetB.set(\r\n\t\t\t\t\t\t\t\t(x + axis[0]) * s / n,\r\n\t\t\t\t\t\t\t\t(y + axis[1]) * s / n,\r\n\t\t\t\t\t\t\t\t(z + axis[2]) * s / n\r\n\t\t\t\t\t\t\t);\r\n\r\n\t\t\t\t\t\t\tedge.a.addVectors(base, offsetA);\r\n\t\t\t\t\t\t\tedge.b.addVectors(base, offsetB);\r\n\r\n\t\t\t\t\t\t\t// Create and store the edge data.\r\n\t\t\t\t\t\t\toperation.generateEdge(edge);\r\n\r\n\t\t\t\t\t\t\tedges[c] = indexA;\r\n\t\t\t\t\t\t\tzeroCrossings[c] = edge.t;\r\n\t\t\t\t\t\t\tnormals[c * 3] = edge.n.x;\r\n\t\t\t\t\t\t\tnormals[c * 3 + 1] = edge.n.y;\r\n\t\t\t\t\t\t\tnormals[c * 3 + 2] = edge.n.z;\r\n\r\n\t\t\t\t\t\t\t++c;\r\n\r\n\t\t\t\t\t\t}\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t\tlengths[d] = c;\r\n\r\n\t\t}\r\n\r\n\t\treturn { edgeData, lengths };\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Either generates or combines volume data based on the operation type.\r\n\t *\r\n\t * @method update\r\n\t * @private\r\n\t * @static\r\n\t * @param {Chunk} chunk - A volume chunk.\r\n\t * @param {Operation} operation - A CSG operation.\r\n\t * @param {HermiteData} data0 - A target data set.\r\n\t * @param {HermiteData} [data1] - A predominant data set.\r\n\t */\r\n\r\n\tfunction update(chunk, operation, data0, data1) {\r\n\r\n\t\tconst bounds = computeIndexBounds(chunk, operation);\r\n\r\n\t\tlet result, edgeData, lengths, d;\r\n\r\n\t\tif(operation.type === OperationType.DENSITY_FUNCTION) {\r\n\r\n\t\t\tgenerateMaterialIndices(chunk, operation, data0, bounds);\r\n\r\n\t\t} else {\r\n\r\n\t\t\tcombineMaterialIndices(chunk, operation, data0, data1, bounds);\r\n\r\n\t\t}\r\n\r\n\t\tif(!data0.empty && !data0.full) {\r\n\r\n\t\t\tresult = (operation.type === OperationType.DENSITY_FUNCTION) ?\r\n\t\t\t\tgenerateEdges(chunk, operation, data0, bounds) :\r\n\t\t\t\tcombineEdges(chunk, operation, data0, data1);\r\n\r\n\t\t\tedgeData = result.edgeData;\r\n\t\t\tlengths = result.lengths;\r\n\r\n\t\t\t// Cut off empty data.\r\n\t\t\tfor(d = 0; d < 3; ++d) {\r\n\r\n\t\t\t\tedgeData.edges[d] = edgeData.edges[d].slice(0, lengths[d]);\r\n\t\t\t\tedgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);\r\n\t\t\t\tedgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);\r\n\r\n\t\t\t}\r\n\r\n\t\t\tdata0.edgeData = edgeData;\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Executes the given operation.\r\n\t *\r\n\t * @method execute\r\n\t * @private\r\n\t * @static\r\n\t * @param {Chunk} chunk - A volume chunk.\r\n\t * @param {Operation} operation - An operation.\r\n\t * @return {HermiteData} The generated data or null if the data is empty.\r\n\t */\r\n\r\n\tfunction execute(chunk, operation) {\r\n\r\n\t\tconst children = operation.children;\r\n\r\n\t\tlet result, data;\r\n\t\tlet i, l;\r\n\r\n\t\tif(operation.type === OperationType.DENSITY_FUNCTION) {\r\n\r\n\t\t\t// Create a data target.\r\n\t\t\tresult = new HermiteData();\r\n\r\n\t\t\t// Use the density function to generate data.\r\n\t\t\tupdate(chunk, operation, result);\r\n\r\n\t\t}\r\n\r\n\t\t// Union, Difference or Intersection.\r\n\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t// Generate the full result of the child operation recursively.\r\n\t\t\tdata = execute(chunk, children[i]);\r\n\r\n\t\t\tif(result === undefined) {\r\n\r\n\t\t\t\tresult = data;\r\n\r\n\t\t\t} else if(data !== null) {\r\n\r\n\t\t\t\tif(result === null) {\r\n\r\n\t\t\t\t\tif(operation.type === OperationType.UNION) {\r\n\r\n\t\t\t\t\t\t// Build upon the first non-empty data.\r\n\t\t\t\t\t\tresult = data;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\t// Combine the two data sets.\r\n\t\t\t\t\tupdate(chunk, operation, result, data);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else if(operation.type === OperationType.INTERSECTION) {\r\n\r\n\t\t\t\t// An intersection with nothing results in nothing.\r\n\t\t\t\tresult = null;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(result === null && operation.type !== OperationType.UNION) {\r\n\r\n\t\t\t\t// Further subtractions and intersections would have no effect.\r\n\t\t\t\tbreak;\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\treturn (result !== null && result.empty) ? null : result;\r\n\r\n\t}\r\n\r\n\t/**\r\n\t * Constructive Solid Geometry combines Signed Distance Functions by using\r\n\t * Boolean operators to generate and transform volume data.\r\n\t *\r\n\t * @class ConstructiveSolidGeometry\r\n\t * @submodule csg\r\n\t * @static\r\n\t */\r\n\r\n\tclass ConstructiveSolidGeometry {\r\n\r\n\t\t/**\r\n\t\t * Transforms the given chunk of hermite data in two steps:\r\n\t\t *\r\n\t\t *  1. Generate data by executing the given SDF\r\n\t\t *  2. Combine the generated data with the chunk data\r\n\t\t *\r\n\t\t * @method run\r\n\t\t * @static\r\n\t\t * @param {Chunk} chunk - The volume chunk that should be modified.\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t */\r\n\r\n\t\tstatic run(chunk, sdf) {\r\n\r\n\t\t\tif(chunk.data === null) {\r\n\r\n\t\t\t\tif(sdf.operation === OperationType.UNION) {\r\n\r\n\t\t\t\t\tchunk.data = new HermiteData();\r\n\t\t\t\t\tchunk.data.edgeData = new EdgeData(0);\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t} else {\r\n\r\n\t\t\t\tchunk.data.decompress();\r\n\r\n\t\t\t}\r\n\r\n\t\t\t// Step 1.\r\n\t\t\tlet operation = sdf.toCSG();\r\n\r\n\t\t\tconst data = (chunk.data !== null) ? execute(chunk, operation) : null;\r\n\r\n\t\t\tif(data !== null) {\r\n\r\n\t\t\t\t// Wrap the operation in a super operation.\r\n\t\t\t\tswitch(sdf.operation) {\r\n\r\n\t\t\t\t\tcase OperationType.UNION:\r\n\t\t\t\t\t\toperation = new Union(operation);\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\tcase OperationType.DIFFERENCE:\r\n\t\t\t\t\t\toperation = new Difference(operation);\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\tcase OperationType.INTERSECTION:\r\n\t\t\t\t\t\toperation = new Intersection(operation);\r\n\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\t// Step 2.\r\n\t\t\t\tupdate(chunk, operation, chunk.data, data);\r\n\r\n\t\t\t\t// Provoke a geometry extraction.\r\n\t\t\t\tchunk.data.lod = -1;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tif(chunk.data !== null) {\r\n\r\n\t\t\t\tif(chunk.data.empty) {\r\n\r\n\t\t\t\t\tchunk.data = null;\r\n\r\n\t\t\t\t} else {\r\n\r\n\t\t\t\t\tchunk.data.compress();\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An enumeration of SDF types.\r\n\t *\r\n\t * @class SDFType\r\n\t * @submodule sdf\r\n\t * @static\r\n\t */\r\n\r\n\tconst SDFType = {\r\n\r\n\t\t/**\r\n\t\t * A sphere description.\r\n\t\t *\r\n\t\t * @property SPHERE\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tSPHERE: \"sdf.sphere\",\r\n\r\n\t\t/**\r\n\t\t * A box description.\r\n\t\t *\r\n\t\t * @property BOX\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tBOX: \"sdf.box\",\r\n\r\n\t\t/**\r\n\t\t * A torus description.\r\n\t\t *\r\n\t\t * @property TORUS\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tTORUS: \"sdf.torus\",\r\n\r\n\t\t/**\r\n\t\t * A plane description.\r\n\t\t *\r\n\t\t * @property PLANE\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tPLANE: \"sdf.plane\",\r\n\r\n\t\t/**\r\n\t\t * A heightfield description.\r\n\t\t *\r\n\t\t * @property HEIGHTFIELD\r\n\t\t * @type String\r\n\t\t * @static\r\n\t\t * @final\r\n\t\t */\r\n\r\n\t\tHEIGHTFIELD: \"sdf.heightfield\"\r\n\r\n\t};\n\n\t/**\r\n\t * An operation that describes a density field.\r\n\t *\r\n\t * @class DensityFunction\r\n\t * @submodule csg\r\n\t * @extends Operation\r\n\t * @constructor\r\n\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t */\r\n\r\n\tclass DensityFunction extends Operation {\r\n\r\n\t\tconstructor(sdf) {\r\n\r\n\t\t\tsuper(OperationType.DENSITY_FUNCTION);\r\n\r\n\t\t\t/**\r\n\t\t\t * An SDF.\r\n\t\t\t *\r\n\t\t\t * @property sdf\r\n\t\t\t * @type SignedDistanceFunction\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.sdf = sdf;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates a bounding box for this operation.\r\n\t\t *\r\n\t\t * @method computeBoundingBox\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthis.bbox = this.sdf.computeBoundingBox();\r\n\r\n\t\t\treturn this.bbox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the material index for the given world position.\r\n\t\t *\r\n\t\t * @method generateMaterialIndex\r\n\t\t * @param {Vector3} position - The world position of the material index.\r\n\t\t * @return {Number} The material index.\r\n\t\t */\r\n\r\n\t\tgenerateMaterialIndex(position) {\r\n\r\n\t\t\treturn (this.sdf.sample(position) <= 0.0) ? this.sdf.material : Density.HOLLOW;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Generates surface intersection data for the specified edge.\r\n\t\t *\r\n\t\t * @method generateEdge\r\n\t\t * @param {Edge} edge - The edge that should be processed.\r\n\t\t */\r\n\r\n\t\tgenerateEdge(edge) {\r\n\r\n\t\t\tedge.approximateZeroCrossing(this.sdf);\r\n\t\t\tedge.computeSurfaceNormal(this.sdf);\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An abstract Signed Distance Function.\r\n\t *\r\n\t * An SDF describes the signed Euclidean distance to the surface of an object,\r\n\t * effectively describing its density at every point in 3D space. It yields\r\n\t * negative values for points that lie inside the volume and positive values\r\n\t * for points outside. The value is zero at the exact boundary of the object.\r\n\t *\r\n\t * @class SignedDistanceFunction\r\n\t * @submodule sdf\r\n\t * @constructor\r\n\t * @param {SDFType} type - The type of the SDF.\r\n\t * @param {Number} [material=Density.SOLID] - A material index. Must be an integer in the range of 1 to 255.\r\n\t */\r\n\r\n\tclass SignedDistanceFunction {\r\n\r\n\t\tconstructor(type, material = Density.SOLID) {\r\n\r\n\t\t\t/**\r\n\t\t\t * The type of this SDF.\r\n\t\t\t *\r\n\t\t\t * @property type\r\n\t\t\t * @type SDFType\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.type = type;\r\n\r\n\t\t\t/**\r\n\t\t\t * The operation type.\r\n\t\t\t *\r\n\t\t\t * @property operation\r\n\t\t\t * @type OperationType\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.operation = null;\r\n\r\n\t\t\t/**\r\n\t\t\t * A material index.\r\n\t\t\t *\r\n\t\t\t * @property material\r\n\t\t\t * @type Number\r\n\t\t\t * @private\r\n\t\t\t * @default Density.SOLID\r\n\t\t\t */\r\n\r\n\t\t\tthis.material = Math.min(255, Math.max(Density.SOLID, Math.trunc(material)));\r\n\r\n\t\t\t/**\r\n\t\t\t * A list of SDFs.\r\n\t\t\t *\r\n\t\t\t * SDFs can be chained to build CSG expressions.\r\n\t\t\t *\r\n\t\t\t * @property children\r\n\t\t\t * @type Array\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.children = [];\r\n\r\n\t\t\t/**\r\n\t\t\t * The bounding box of this SDF.\r\n\t\t\t *\r\n\t\t\t * @property bbox\r\n\t\t\t * @type Box3\r\n\t\t\t * @private\r\n\t\t\t * @default null\r\n\t\t\t */\r\n\r\n\t\t\tthis.bbox = null;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The bounding box of this SDF.\r\n\t\t *\r\n\t\t * @property boundingBox\r\n\t\t * @type Box3\r\n\t\t */\r\n\r\n\t\tget boundingBox() {\r\n\r\n\t\t\treturn (this.bbox !== null) ? this.bbox : this.computeBoundingBox();\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * The complete bounding box of this SDF.\r\n\t\t *\r\n\t\t * @property completeBoundingBox\r\n\t\t * @type Box3\r\n\t\t */\r\n\r\n\t\tget completeBoundingBox() {\r\n\r\n\t\t\tconst children = this.children;\r\n\t\t\tconst bbox = this.boundingBox.clone();\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\tbbox.union(children[i].completeBoundingBox);\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn bbox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Adds the given SDF to this one.\r\n\t\t *\r\n\t\t * @method union\r\n\t\t * @chainable\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tunion(sdf) {\r\n\r\n\t\t\tsdf.operation = OperationType.UNION;\r\n\t\t\tthis.children.push(sdf);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Subtracts the given SDF from this one.\r\n\t\t *\r\n\t\t * @method subtract\r\n\t\t * @chainable\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tsubtract(sdf) {\r\n\r\n\t\t\tsdf.operation = OperationType.DIFFERENCE;\r\n\t\t\tthis.children.push(sdf);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Intersects the given SDF with this one.\r\n\t\t *\r\n\t\t * @method intersect\r\n\t\t * @chainable\r\n\t\t * @param {SignedDistanceFunction} sdf - An SDF.\r\n\t\t * @return {SignedDistanceFunction} This SDF.\r\n\t\t */\r\n\r\n\t\tintersect(sdf) {\r\n\r\n\t\t\tsdf.operation = OperationType.INTERSECTION;\r\n\t\t\tthis.children.push(sdf);\r\n\r\n\t\t\treturn this;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} A serialised description of this SDF.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\tconst result = {\r\n\t\t\t\ttype: this.type,\r\n\t\t\t\toperation: this.operation,\r\n\t\t\t\tmaterial: this.material,\r\n\t\t\t\tparameters: null,\r\n\t\t\t\tchildren: []\r\n\t\t\t};\r\n\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\tresult.children.push(children[i].serialise());\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Translates this SDF into a CSG expression.\r\n\t\t *\r\n\t\t * @method toCSG\r\n\t\t * @return {Operation} A CSG operation.\r\n\t\t * @example\r\n\t\t *     a.union(b.intersect(c)).union(d).subtract(e) => Difference(Union(a, Intersection(b, c), d), e)\r\n\t\t */\r\n\r\n\t\ttoCSG() {\r\n\r\n\t\t\tconst children = this.children;\r\n\r\n\t\t\tlet operation = new DensityFunction(this);\r\n\t\t\tlet operationType;\r\n\t\t\tlet child;\r\n\t\t\tlet i, l;\r\n\r\n\t\t\tfor(i = 0, l = children.length; i < l; ++i) {\r\n\r\n\t\t\t\tchild = children[i];\r\n\r\n\t\t\t\tif(operationType !== child.operation) {\r\n\r\n\t\t\t\t\toperationType = child.operation;\r\n\r\n\t\t\t\t\tswitch(operationType) {\r\n\r\n\t\t\t\t\t\tcase OperationType.UNION:\r\n\t\t\t\t\t\t\toperation = new Union(operation);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase OperationType.DIFFERENCE:\r\n\t\t\t\t\t\t\toperation = new Difference(operation);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t\tcase OperationType.INTERSECTION:\r\n\t\t\t\t\t\t\toperation = new Intersection(operation);\r\n\t\t\t\t\t\t\tbreak;\r\n\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t}\r\n\r\n\t\t\t\toperation.children.push(child.toCSG());\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn operation;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this SDF.\r\n\t\t *\r\n\t\t * @method computeBoundingBox\r\n\t\t * @throws {Error} An error is thrown if the method is not overridden.\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthrow new Error(\"SDF: bounding box method not implemented!\");\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @method sample\r\n\t\t * @throws {Error} An error is thrown if the method is not overridden.\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The Euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\tthrow new Error(\"SDF: sample method not implemented!\");\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A Signed Distance Function that describes a sphere.\r\n\t *\r\n\t * @class Sphere\r\n\t * @submodule sdf\r\n\t * @extends SignedDistanceFunction\r\n\t * @constructor\r\n\t * @param {Object} parameters - The parameters.\r\n\t * @param {Array} parameters.origin - The origin [x, y, z].\r\n\t * @param {Number} parameters.radius - The radius.\r\n\t * @param {Number} [material] - A material index.\r\n\t */\r\n\r\n\tclass Sphere extends SignedDistanceFunction {\r\n\r\n\t\tconstructor(parameters = {}, material) {\r\n\r\n\t\t\tsuper(SDFType.SPHERE, material);\r\n\r\n\t\t\t/**\r\n\t\t\t * The origin.\r\n\t\t\t *\r\n\t\t\t * @property origin\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.origin = new Vector3$1(...parameters.origin);\r\n\r\n\t\t\t/**\r\n\t\t\t * The radius.\r\n\t\t\t *\r\n\t\t\t * @property radius\r\n\t\t\t * @type Number\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.radius = parameters.radius;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this density field.\r\n\t\t *\r\n\t\t * @method computeBoundingBox\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthis.bbox = new Box3$1();\r\n\r\n\t\t\tthis.bbox.min.copy(this.origin).subScalar(this.radius);\r\n\t\t\tthis.bbox.max.copy(this.origin).addScalar(this.radius);\r\n\r\n\t\t\treturn this.bbox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @method sample\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\tconst origin = this.origin;\r\n\r\n\t\t\tconst dx = position.x - origin.x;\r\n\t\t\tconst dy = position.y - origin.y;\r\n\t\t\tconst dz = position.z - origin.z;\r\n\r\n\t\t\tconst length = Math.sqrt(dx * dx + dy * dy + dz * dz);\r\n\r\n\t\t\treturn length - this.radius;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} A concise representation of this SDF.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\tconst result = super.serialise();\r\n\r\n\t\t\tresult.parameters = {\r\n\t\t\t\torigin: this.origin.toArray(),\r\n\t\t\t\tradius: this.radius\r\n\t\t\t};\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A Signed Distance Function that describes a box.\r\n\t *\r\n\t * @class Box\r\n\t * @submodule sdf\r\n\t * @extends SignedDistanceFunction\r\n\t * @constructor\r\n\t * @param {Object} parameters - The parameters.\r\n\t * @param {Array} parameters.origin - The origin [x, y, z].\r\n\t * @param {Array} parameters.halfDimensions - The half size [x, y, z].\r\n\t * @param {Number} [material] - A material index.\r\n\t */\r\n\r\n\tclass Box extends SignedDistanceFunction {\r\n\r\n\t\tconstructor(parameters = {}, material) {\r\n\r\n\t\t\tsuper(SDFType.BOX, material);\r\n\r\n\t\t\t/**\r\n\t\t\t * The origin.\r\n\t\t\t *\r\n\t\t\t * @property origin\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.origin = new Vector3$1(...parameters.origin);\r\n\r\n\t\t\t/**\r\n\t\t\t * The halfDimensions.\r\n\t\t\t *\r\n\t\t\t * @property halfDimensions\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.halfDimensions = new Vector3$1(...parameters.halfDimensions);\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this density field.\r\n\t\t *\r\n\t\t * @method computeBoundingBox\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthis.bbox = new Box3$1();\r\n\r\n\t\t\tthis.bbox.min.subVectors(this.origin, this.halfDimensions);\r\n\t\t\tthis.bbox.max.addVectors(this.origin, this.halfDimensions);\r\n\r\n\t\t\treturn this.bbox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @method sample\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\tconst origin = this.origin;\r\n\t\t\tconst halfDimensions = this.halfDimensions;\r\n\r\n\t\t\t// Compute the distance to the hull.\r\n\t\t\tconst dx = Math.abs(position.x - origin.x) - halfDimensions.x;\r\n\t\t\tconst dy = Math.abs(position.y - origin.y) - halfDimensions.y;\r\n\t\t\tconst dz = Math.abs(position.z - origin.z) - halfDimensions.z;\r\n\r\n\t\t\tconst m = Math.max(dx, Math.max(dy, dz));\r\n\r\n\t\t\tconst mx0 = Math.max(dx, 0);\r\n\t\t\tconst my0 = Math.max(dy, 0);\r\n\t\t\tconst mz0 = Math.max(dz, 0);\r\n\r\n\t\t\tconst length = Math.sqrt(mx0 * mx0 + my0 * my0 + mz0 * mz0);\r\n\r\n\t\t\treturn Math.min(m, 0) + length;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} A serialised description of this SDF.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\tconst result = super.serialise();\r\n\r\n\t\t\tresult.parameters = {\r\n\t\t\t\torigin: this.origin.toArray(),\r\n\t\t\t\thalfDimensions: this.halfDimensions.toArray()\r\n\t\t\t};\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A Signed Distance Function that describes a plane.\r\n\t *\r\n\t * @class Plane\r\n\t * @submodule sdf\r\n\t * @extends SignedDistanceFunction\r\n\t * @constructor\r\n\t * @param {Object} parameters - The parameters.\r\n\t * @param {Array} parameters.normal - The normal [x, y, z].\r\n\t * @param {Number} parameters.constant - The constant.\r\n\t * @param {Number} [material] - A material index.\r\n\t */\r\n\r\n\tclass Plane extends SignedDistanceFunction {\r\n\r\n\t\tconstructor(parameters = {}, material) {\r\n\r\n\t\t\tsuper(SDFType.PLANE, material);\r\n\r\n\t\t\t/**\r\n\t\t\t * The normal.\r\n\t\t\t *\r\n\t\t\t * @property normal\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.normal = new Vector3$1(...parameters.normal);\r\n\r\n\t\t\t/**\r\n\t\t\t * The constant.\r\n\t\t\t *\r\n\t\t\t * @property constant\r\n\t\t\t * @type Number\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.constant = parameters.constant;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this density field.\r\n\t\t *\r\n\t\t * @method computeBoundingBox\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t * @todo\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthis.bbox = new Box3$1();\r\n\r\n\t\t\treturn this.bbox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @method sample\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\treturn this.normal.dot(position) + this.constant;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} A serialised description of this SDF.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\tconst result = super.serialise();\r\n\r\n\t\t\tresult.parameters = {\r\n\t\t\t\tnormal: this.normal.toArray(),\r\n\t\t\t\tconstant: this.constant\r\n\t\t\t};\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A Signed Distance Function that describes a torus.\r\n\t *\r\n\t * @class Torus\r\n\t * @submodule sdf\r\n\t * @extends SignedDistanceFunction\r\n\t * @constructor\r\n\t * @param {Object} parameters - The parameters.\r\n\t * @param {Array} parameters.origin - The origin [x, y, z].\r\n\t * @param {Number} parameters.R - The distance from the center to the tube.\r\n\t * @param {Number} parameters.r - The radius of the tube.\r\n\t * @param {Number} [material] - A material index.\r\n\t */\r\n\r\n\tclass Torus extends SignedDistanceFunction {\r\n\r\n\t\tconstructor(parameters = {}, material) {\r\n\r\n\t\t\tsuper(SDFType.TORUS, material);\r\n\r\n\t\t\t/**\r\n\t\t\t * The origin.\r\n\t\t\t *\r\n\t\t\t * @property origin\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.origin = new Vector3$1(...parameters.origin);\r\n\r\n\t\t\t/**\r\n\t\t\t * The distance from the center to the tube.\r\n\t\t\t *\r\n\t\t\t * @property R\r\n\t\t\t * @type Number\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.R = parameters.R;\r\n\r\n\t\t\t/**\r\n\t\t\t * The radius of the tube.\r\n\t\t\t *\r\n\t\t\t * @property r\r\n\t\t\t * @type Number\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.r = parameters.r;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this density field.\r\n\t\t *\r\n\t\t * @method computeBoundingBox\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthis.bbox = new Box3$1();\r\n\r\n\t\t\tthis.bbox.min.copy(this.origin).subScalar(this.R).subScalar(this.r);\r\n\t\t\tthis.bbox.max.copy(this.origin).addScalar(this.R).addScalar(this.r);\r\n\r\n\t\t\treturn this.bbox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @method sample\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\tconst origin = this.origin;\r\n\r\n\t\t\tconst dx = position.x - origin.x;\r\n\t\t\tconst dy = position.y - origin.y;\r\n\t\t\tconst dz = position.z - origin.z;\r\n\r\n\t\t\tconst q = Math.sqrt(dx * dx + dz * dz) - this.R;\r\n\t\t\tconst length = Math.sqrt(q * q + dy * dy);\r\n\r\n\t\t\treturn length - this.r;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} A serialised description of this SDF.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\tconst result = super.serialise();\r\n\r\n\t\t\tresult.parameters = {\r\n\t\t\t\torigin: this.origin.toArray(),\r\n\t\t\t\tR: this.R,\r\n\t\t\t\tr: this.r\r\n\t\t\t};\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A Signed Distance Function that describes a heightfield.\r\n\t *\r\n\t * @class Sphere\r\n\t * @submodule sdf\r\n\t * @extends SignedDistanceFunction\r\n\t * @constructor\r\n\t * @param {Object} parameters - The parameters.\r\n\t * @param {Array} parameters.min - The min position [x, y, z].\r\n\t * @param {Array} parameters.dimensions - The dimensions [x, y, z].\r\n\t * @param {Uint8ClampedArray} parameters.data - The heightmap data.\r\n\t * @param {Number} [material] - A material index.\r\n\t */\r\n\r\n\tclass Heightfield extends SignedDistanceFunction {\r\n\r\n\t\tconstructor(parameters = {}, material) {\r\n\r\n\t\t\tsuper(SDFType.HEIGHTFIELD, material);\r\n\r\n\t\t\t/**\r\n\t\t\t * The position.\r\n\t\t\t *\r\n\t\t\t * @property min\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.min = new Vector3$1(...parameters.min);\r\n\r\n\t\t\t/**\r\n\t\t\t * The dimensions.\r\n\t\t\t *\r\n\t\t\t * @property dimensions\r\n\t\t\t * @type Vector3\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.dimensions = new Vector3$1(...parameters.size);\r\n\r\n\t\t\t/**\r\n\t\t\t * The height data.\r\n\t\t\t *\r\n\t\t\t * @property data\r\n\t\t\t * @type Uint8ClampedArray\r\n\t\t\t * @private\r\n\t\t\t */\r\n\r\n\t\t\tthis.data = parameters.data;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Calculates the bounding box of this density field.\r\n\t\t *\r\n\t\t * @method computeBoundingBox\r\n\t\t * @return {Box3} The bounding box.\r\n\t\t */\r\n\r\n\t\tcomputeBoundingBox() {\r\n\r\n\t\t\tthis.bbox = new Box3$1();\r\n\r\n\t\t\tthis.bbox.min.copy(this.min);\r\n\t\t\tthis.bbox.max.addVectors(this.min, this.dimensions);\r\n\r\n\t\t\treturn this.bbox;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Samples the volume's density at the given point in space.\r\n\t\t *\r\n\t\t * @method sample\r\n\t\t * @param {Vector3} position - A position.\r\n\t\t * @return {Number} The euclidean distance to the surface.\r\n\t\t */\r\n\r\n\t\tsample(position) {\r\n\r\n\t\t\tconst min = this.min;\r\n\t\t\tconst dimensions = this.dimensions;\r\n\r\n\t\t\tconst x = Math.max(min.x, Math.min(min.x + dimensions.x, position.x - min.x));\r\n\t\t\tconst z = Math.max(min.z, Math.min(min.z + dimensions.z, position.z - min.z));\r\n\r\n\t\t\tconst y = position.y - min.y;\r\n\r\n\t\t\treturn y - (this.data[z * dimensions.x + x] / 255) * dimensions.y;\r\n\r\n\t\t}\r\n\r\n\t\t/**\r\n\t\t * Serialises this SDF.\r\n\t\t *\r\n\t\t * @method serialise\r\n\t\t * @return {Object} A serialised description of this SDF.\r\n\t\t */\r\n\r\n\t\tserialise() {\r\n\r\n\t\t\tconst result = super.serialise();\r\n\r\n\t\t\tresult.parameters = {\r\n\t\t\t\tmin: this.min.toArray(),\r\n\t\t\t\tdimensions: this.dimensions.toArray(),\r\n\t\t\t\tdata: this.data\r\n\t\t\t};\r\n\r\n\t\t\treturn result;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * An SDF reviver.\r\n\t *\r\n\t * @class Reviver\r\n\t * @static\r\n\t */\r\n\r\n\tclass Reviver {\r\n\r\n\t\t/**\r\n\t\t * Creates an SDF from the given serialised description.\r\n\t\t *\r\n\t\t * @method reviveSDF\r\n\t\t * @static\r\n\t\t * @param {Object} description - A serialised SDF.\r\n\t\t * @return {SignedDistanceFunction} An SDF.\r\n\t\t */\r\n\r\n\t\tstatic reviveSDF(description) {\r\n\r\n\t\t\tlet sdf, i, l;\r\n\r\n\t\t\tswitch(description.type) {\r\n\r\n\t\t\t\tcase SDFType.SPHERE:\r\n\t\t\t\t\tsdf = new Sphere(description.parameters, description.material);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase SDFType.BOX:\r\n\t\t\t\t\tsdf = new Box(description.parameters, description.material);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase SDFType.TORUS:\r\n\t\t\t\t\tsdf = new Torus(description.parameters, description.material);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase SDFType.PLANE:\r\n\t\t\t\t\tsdf = new Plane(description.parameters, description.material);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase SDFType.HEIGHTFIELD:\r\n\t\t\t\t\tsdf = new Heightfield(description.parameters, description.material);\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t}\r\n\r\n\t\t\tsdf.operation = description.operation;\r\n\r\n\t\t\tfor(i = 0, l = description.children.length; i < l; ++i) {\r\n\r\n\t\t\t\tsdf.children.push(this.reviveSDF(description.children[i]));\r\n\r\n\t\t\t}\r\n\r\n\t\t\treturn sdf;\r\n\r\n\t\t}\r\n\r\n\t}\n\n\t/**\r\n\t * A hermite data modifier that applies CSG operations to volume chunks.\r\n\t *\r\n\t * @class VolumeModifier\r\n\t * @submodule worker\r\n\t * @static\r\n\t */\r\n\r\n\tconst VolumeModifier = {\r\n\r\n\t\t/**\r\n\t\t * An empty chunk of hermite data.\r\n\t\t *\r\n\t\t * @property chunk\r\n\t\t * @type Chunk\r\n\t\t * @static\r\n\t\t */\r\n\r\n\t\tchunk: new Chunk(),\r\n\r\n\t\t/**\r\n\t\t * A container for the data that will be returned to the main thread.\r\n\t\t *\r\n\t\t * @property message\r\n\t\t * @type Object\r\n\t\t * @static\r\n\t\t */\r\n\r\n\t\tmessage: {\r\n\t\t\taction: Action.MODIFY,\r\n\t\t\tchunk: null\r\n\t\t},\r\n\r\n\t\t/**\r\n\t\t * A list of transferable objects.\r\n\t\t *\r\n\t\t * @property transferList\r\n\t\t * @type Array\r\n\t\t * @static\r\n\t\t */\r\n\r\n\t\ttransferList: null,\r\n\r\n\t\t/**\r\n\t\t * Modifies the given hermite data.\r\n\t\t *\r\n\t\t * @method modify\r\n\t\t * @static\r\n\t\t * @param {Chunk} chunk - A volume chunk.\r\n\t\t * @param {Object} sdf - A serialised SDF.\r\n\t\t */\r\n\r\n\t\tmodify(chunk, sdf) {\r\n\r\n\t\t\t// Adopt the provided chunk data.\r\n\t\t\tthis.chunk.deserialise(chunk);\r\n\r\n\t\t\t// Revive the SDF and execute it.\r\n\t\t\tConstructiveSolidGeometry.run(this.chunk, Reviver.reviveSDF(sdf));\r\n\r\n\t\t\tthis.message.chunk = this.chunk.serialise();\r\n\t\t\tthis.transferList = this.chunk.createTransferList();\r\n\r\n\t\t}\r\n\r\n\t};\n\n\t/**\r\n\t * A worker thread that processes volume data.\r\n\t *\r\n\t * @class Worker\r\n\t * @submodule worker\r\n\t * @static\r\n\t */\r\n\r\n\t/**\r\n\t * Receives and handles messages from the main thread.\r\n\t *\r\n\t * @method onMessage\r\n\t * @private\r\n\t * @static\r\n\t * @param {Event} event - A message event containing data from the main thread.\r\n\t */\r\n\r\n\tself.addEventListener(\"message\", function onMessage(event) {\r\n\r\n\t\tconst data = event.data;\r\n\r\n\t\tswitch(data.action) {\r\n\r\n\t\t\tcase Action.EXTRACT:\r\n\t\t\t\tSurfaceExtractor.extract(data.chunk);\r\n\t\t\t\tpostMessage(SurfaceExtractor.message, SurfaceExtractor.transferList);\r\n\t\t\t\tbreak;\r\n\r\n\t\t\tcase Action.MODIFY:\r\n\t\t\t\tVolumeModifier.modify(data.chunk, data.sdf);\r\n\t\t\t\tpostMessage(VolumeModifier.message, VolumeModifier.transferList);\r\n\t\t\t\tbreak;\r\n\r\n\t\t\tcase Action.CLOSE:\r\n\t\t\tdefault:\r\n\t\t\t\tclose();\r\n\r\n\t\t}\r\n\r\n\t});\r\n\r\n\t/**\r\n\t * Returns all data to the main thread and closes the worker.\r\n\t *\r\n\t * @method onError\r\n\t * @private\r\n\t * @static\r\n\t * @param {Event} event - An error event.\r\n\t */\r\n\r\n\tself.addEventListener(\"error\", function onError(event) {\r\n\r\n\t\tconst message = {\r\n\t\t\taction: Action.CLOSE,\r\n\t\t\terror: event.message,\r\n\t\t\tdata: null\r\n\t\t};\r\n\r\n\t\tconst transferList = [];\r\n\r\n\t\tconst chunks = [\r\n\t\t\tSurfaceExtractor.chunk,\r\n\t\t\tVolumeModifier.chunk\r\n\t\t];\r\n\r\n\t\t// Find out which operator has the data.\r\n\t\tif(chunks[0].data !== null && !chunks[0].data.neutered) {\r\n\r\n\t\t\tmessage.chunk = chunks[0].serialise();\r\n\t\t\tchunks[0].createTransferList(transferList);\r\n\r\n\t\t} else if(chunks[1].data !== null && !chunks[1].data.neutered) {\r\n\r\n\t\t\tmessage.chunk = chunks[1].serialise();\r\n\t\t\tchunks[1].createTransferList(transferList);\r\n\r\n\t\t}\r\n\r\n\t\tpostMessage(message, transferList);\r\n\t\tclose();\r\n\r\n\t});\n\n}());\n";

	/**
	 * A worker message event.
	 *
	 * @event message
	 * @type WorkerEvent
	 */

	const MESSAGE = new WorkerEvent("message");

	/**
	 * Manages worker threads.
	 *
	 * @class ThreadPool
	 * @submodule worker
	 * @extends EventTarget
	 * @implements EventListener
	 * @constructor
	 * @param {Number} [maxWorkers] - Limits the amount of active workers. The default limit is the amount of logical processors.
	 */

	class ThreadPool extends EventTarget {

		constructor(maxWorkers = navigator.hardwareConcurrency) {

			super();

			/**
			 * An object URL to the worker program.
			 *
			 * @property workerURL
			 * @type String
			 * @private
			 */

			this.workerURL = URL.createObjectURL(new Blob([worker], { type: "text/javascript" }));

			/**
			 * The maximum number of active worker threads.
			 *
			 * @property maxWorkers
			 * @type Number
			 * @default navigator.hardwareConcurrency
			 */

			this.maxWorkers = Math.min(navigator.hardwareConcurrency, Math.max(maxWorkers, 1));

			/**
			 * A list of existing workers.
			 *
			 * @property workers
			 * @type Array
			 * @private
			 */

			this.workers = [];

			/**
			 * Keeps track of workers that are currently busy.
			 *
			 * @property busyWorkers
			 * @type WeakSet
			 * @private
			 */

			this.busyWorkers = new WeakSet();

		}

		/**
		 * Handles events.
		 *
		 * @method handleEvent
		 * @param {Event} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "message":
					this.busyWorkers.delete(event.target);
					MESSAGE.worker = event.target;
					MESSAGE.data = event.data;
					this.dispatchEvent(MESSAGE);
					break;

				case "error":
					// Errors are being handled in the worker.
					console.warn("Encountered an unexpected error.", event.message);
					break;

			}

		}

		/**
		 * Closes a worker.
		 *
		 * @method closeWorker
		 * @param {Worker} worker - The worker to close.
		 */

		closeWorker(worker$$1) {

			const index = this.workers.indexOf(worker$$1);

			if(this.busyWorkers.has(worker$$1)) {

				this.busyWorkers.delete(worker$$1);
				worker$$1.terminate();

			} else {

				worker$$1.postMessage({
					action: Action.CLOSE
				});

			}

			worker$$1.removeEventListener("message", this);
			worker$$1.removeEventListener("error", this);

			if(index >= 0) {

				this.workers.splice(index, 1);

			}

		}

		/**
		 * Creates a new worker.
		 *
		 * @method createWorker
		 * @private
		 * @return {Worker} The worker.
		 */

		createWorker() {

			const worker$$1 = new Worker(this.workerURL);

			this.workers.push(worker$$1);

			worker$$1.addEventListener("message", this);
			worker$$1.addEventListener("error", this);

			return worker$$1;

		}

		/**
		 * Polls an available worker and returns it. The worker will be excluded from
		 * subsequent polls until it finishes its task and sends a message back.
		 *
		 * @method getWorker
		 * @return {Worker} A worker or null if all resources are currently exhausted.
		 */

		getWorker() {

			let worker$$1 = null;

			let i;

			for(i = this.workers.length - 1; i >= 0; --i) {

				if(!this.busyWorkers.has(this.workers[i])) {

					worker$$1 = this.workers[i];
					this.busyWorkers.add(worker$$1);

					break;

				}

			}

			// Check if all existing workers are busy.
			if(worker$$1 === null && this.workers.length < this.maxWorkers) {

				if(this.workerURL !== null) {

					worker$$1 = this.createWorker();
					this.busyWorkers.add(worker$$1);

				}

			}

			return worker$$1;

		}

		/**
		 * Resets this thread pool by closing all workers.
		 *
		 * @method clear
		 */

		clear() {

			while(this.workers.length > 0) {

				this.closeWorker(this.workers.pop());

			}

		}

		/**
		 * Removes all active workers and releases the worker program blob.
		 *
		 * @method dispose
		 */

		dispose() {

			this.clear();

			URL.revokeObjectURL(this.workerURL);
			this.workerURL = null;

		}

	}

	/**
	 * A worker task.
	 *
	 * @class WorkerTask
	 * @submodule worker
	 * @extends Task
	 * @constructor
	 * @param {Action} action - A worker action.
	 * @param {Chunk} chunk - A volume chunk.
	 * @param {Number} [priority] - The priority.
	 */

	class WorkerTask extends Task {

		constructor(action, chunk, priority) {

			super(priority);

			/**
			 * A worker action.
			 *
			 * @property action
			 * @type Action
			 * @default null
			 */

			this.action = action;

			/**
			 * A volume chunk.
			 *
			 * @property chunk
			 * @type Chunk
			 */

			this.chunk = chunk;

		}

	}

	/**
	 * A terrain event.
	 *
	 * @class TerrainEvent
	 * @submodule events
	 * @constructor
	 * @param {String} type - The name of the event.
	 */

	class TerrainEvent extends Event {

		constructor(type) {

			super(type);

			/**
			 * A volume chunk.
			 *
			 * @property chunk
			 * @type Chunk
			 * @default null
			 */

			this.chunk = null;

		}

	}

	/**
	 * @submodule core
	 */

	/**
	 * Signals the start of a modification task.
	 *
	 * @event modificationstart
	 * @for Terrain
	 * @type TerrainEvent
	 */

	const MODIFICATION_START = new TerrainEvent("modificationstart");

	/**
	 * Signals the end of a modification task.
	 *
	 * @event modificationend
	 * @for Terrain
	 * @type TerrainEvent
	 */

	const MODIFICATION_END = new TerrainEvent("modificationend");

	/**
	 * Signals the start of an extraction task.
	 *
	 * @event extractionstart
	 * @for Terrain
	 * @type TerrainEvent
	 */

	const EXTRACTION_START = new TerrainEvent("extractionstart");

	/**
	 * Signals the end of an extraction task.
	 *
	 * @event extractionend
	 * @for Terrain
	 * @type TerrainEvent
	 */

	const EXTRACTION_END = new TerrainEvent("extractionend");

	/**
	 * A computation helper.
	 *
	 * @property BOX3
	 * @type Box3
	 * @private
	 * @static
	 * @final
	 */

	const BOX3 = new three.Box3();

	/**
	 * A computation helper.
	 *
	 * @property MATRIX4
	 * @type Matrix4
	 * @private
	 * @static
	 * @final
	 */

	const MATRIX4 = new three.Matrix4();

	/**
	 * A frustum used for octree culling.
	 *
	 * @property FRUSTUM
	 * @type Frustum
	 * @private
	 * @static
	 * @final
	 */

	const FRUSTUM = new three.Frustum();

	/**
	 * The terrain system.
	 *
	 * @class Terrain
	 * @submodule core
	 * @extends EventTarget
	 * @implements EventListener
	 * @constructor
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.chunkSize=32] - The world size of a volume chunk. Will be rounded up to the next power of two.
	 * @param {Number} [options.resolution=32] - The resolution of a volume chunk. Will be rounded up to the next power of two.
	 * @param {Number} [options.maxWorkers] - Limits the amount of active workers. The default limit is the amount of logical processors which is also the maximum.
	 */

	class Terrain extends EventTarget {

		constructor(options = {}) {

			super();

			/**
			 * The terrain object. Add this to your scene.
			 *
			 * @property object
			 * @type Object3D
			 */

			this.object = new three.Object3D();
			this.object.name = "Terrain";

			/**
			 * The volume of this terrain.
			 *
			 * @property volume
			 * @type Volume
			 * @private
			 */

			this.volume = new Volume(options.chunkSize, options.resolution);

			/**
			 * The number of detail levels.
			 *
			 * Terrain chunks that are further away from the camera will be rendered
			 * with less vertices.
			 *
			 * @property levels
			 * @type Number
			 * @private
			 */

			this.levels = Math.log2(this.volume.resolution);

			/**
			 * A thread pool.
			 *
			 * @property threadPool
			 * @type ThreadPool
			 * @private
			 */

			this.threadPool = new ThreadPool(options.maxWorkers);
			this.threadPool.addEventListener("message", this);

			/**
			 * Manages pending tasks.
			 *
			 * @property scheduler
			 * @type Scheduler
			 * @private
			 */

			this.scheduler = new Scheduler(this.levels + 1);

			/**
			 * A chronological sequence of CSG operations that have been executed during
			 * this session.
			 *
			 * @property history
			 * @type History
			 */

			this.history = new History();

			/**
			 * Keeps track of chunks that are currently being used by a worker. The
			 * amount of neutered chunks cannot exceed the amount of worker threads.
			 *
			 * @property neutered
			 * @type WeakSet
			 */

			this.neutered = new WeakSet();

			/**
			 * Keeps track of associations between workers and chunks.
			 *
			 * @property chunks
			 * @type WeakMap
			 * @private
			 */

			this.chunks = new WeakMap();

			/**
			 * Keeps track of associations between chunks and meshes.
			 *
			 * @property meshes
			 * @type WeakMap
			 * @private
			 */

			this.meshes = new WeakMap();

			/**
			 * The terrain material.
			 *
			 * @property material
			 * @type TerrainMaterial
			 * @private
			 */

			this.material = new MeshTriplanarPhysicalMaterial();

		}

		/**
		 * Lifts the connection of a given chunk to its mesh and removes the geometry.
		 *
		 * @method unlinkMesh
		 * @private
		 * @param {Chunk} chunk - A volume chunk.
		 */

		unlinkMesh(chunk) {

			let mesh;

			if(this.meshes.has(chunk)) {

				mesh = this.meshes.get(chunk);
				mesh.geometry.dispose();

				this.meshes.delete(chunk);
				this.object.remove(mesh);

			}

		}

		/**
		 * Handles worker events.
		 *
		 * @method handleEvent
		 * @private
		 * @param {WorkerEvent} event - A worker message event.
		 */

		handleEvent(event) {

			const worker = event.worker;
			const data = event.data;

			// Find the chunk that has been processed by this worker.
			const chunk = this.chunks.get(worker);

			this.neutered.delete(chunk);
			this.chunks.delete(worker);

			// Reclaim ownership of the chunk data.
			chunk.deserialise(data.chunk);

			if(chunk.data === null && chunk.csg === null) {

				// The chunk has become empty. Remove it.
				this.scheduler.cancel(chunk);
				this.volume.prune(chunk);
				this.unlinkMesh(chunk);

			} else if(chunk.csg !== null) {

				// Drain the CSG queue as fast as possible.
				this.scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, this.scheduler.maxPriority));

			}

			if(data.action !== Action.CLOSE) {

				if(data.action === Action.EXTRACT) {

					event = EXTRACTION_END;

					this.consolidate(chunk, data);

				} else {

					event = MODIFICATION_END;

				}

				event.chunk = chunk;

				this.dispatchEvent(event);

			} else {

				console.warn(data.error);

			}

			// Kick off a pending task.
			this.runNextTask();

		}

		/**
		 * Updates geometry chunks with extracted data.
		 *
		 * @method consolidate
		 * @private
		 * @param {Chunk} chunk - The associated volume chunk.
		 * @param {Object} data - An object containing the extracted geometry data.
		 */

		consolidate(chunk, data) {

			const positions = data.positions;
			const normals = data.normals;
			const indices = data.indices;

			let geometry, mesh;

			// Only create a new mesh if the worker generated data.
			if(positions !== null && normals !== null && indices !== null) {

				this.unlinkMesh(chunk);

				geometry = new three.BufferGeometry();
				geometry.setIndex(new three.BufferAttribute(indices, 1));
				geometry.addAttribute("position", new three.BufferAttribute(positions, 3));
				geometry.addAttribute("normal", new three.BufferAttribute(normals, 3));
				geometry.computeBoundingSphere();

				mesh = new three.Mesh(geometry, this.material);

				this.meshes.set(chunk, mesh);
				this.object.add(mesh);

			}

		}

		/**
		 * Runs a pending task if a worker is available.
		 *
		 * @method runNextTask
		 * @private
		 */

		runNextTask() {

			let task, worker, chunk, event;

			if(this.scheduler.peek() !== null) {

				worker = this.threadPool.getWorker();

				if(worker !== null) {

					task = this.scheduler.poll();
					chunk = task.chunk;

					if(task.action === Action.MODIFY) {

						event = MODIFICATION_START;

						worker.postMessage({

							action: task.action,
							chunk: chunk.serialise(),
							sdf: chunk.csg.poll().serialise()

						}, chunk.createTransferList());

						if(chunk.csg.size === 0) {

							chunk.csg = null;

						}

					} else {

						event = EXTRACTION_START;

						worker.postMessage({

							action: task.action,
							chunk: chunk.serialise()

						}, chunk.createTransferList());

					}

					event.chunk = chunk;

					this.neutered.add(chunk);
					this.chunks.set(worker, chunk);
					this.dispatchEvent(event);

				}

			}

		}

		/**
		 * Edits the terrain volume data.
		 *
		 * @method edit
		 * @private
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 */

		edit(sdf) {

			const chunks = this.volume.edit(sdf);

			let i, chunk;

			for(i = chunks.length - 1; i >= 0; --i) {

				chunk = chunks[i];

				if(chunk.csg === null) {

					chunk.csg = new Queue();

				}

				chunk.csg.add(sdf);

			}

			this.history.push(sdf);

		}

		/**
		 * Executes the given SDF and adds the generated data to the volume.
		 *
		 * @method union
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 */

		union(sdf) {

			sdf.operation = OperationType.UNION;

			this.edit(sdf);

		}

		/**
		 * Executes the given SDF and subtracts the generated data from the volume.
		 *
		 * @method subtract
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 */

		subtract(sdf) {

			sdf.operation = OperationType.DIFFERENCE;

			this.edit(sdf);

		}

		/**
		 * Executes the given SDF and discards the volume data that doesn't overlap
		 * with the generated data.
		 *
		 * @method intersect
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 */

		intersect(sdf) {

			sdf.operation = OperationType.INTERSECTION;

			this.edit(sdf);

		}

		/**
		 * Updates the terrain geometry. This method should be called each frame.
		 *
		 * @method update
		 * @param {PerspectiveCamera} camera - A camera.
		 */

		update(camera) {

			const chunks = this.volume.cull(
				FRUSTUM.setFromMatrix(
					MATRIX4.multiplyMatrices(
						camera.projectionMatrix,
						camera.matrixWorldInverse
					)
				)
			);

			const scheduler = this.scheduler;
			const maxPriority = scheduler.maxPriority;
			const levels = this.levels;
			const maxLevel = levels - 1;

			let i, l;
			let chunk, data, csg, task;
			let distance, lod;

			for(i = 0, l = chunks.length; i < l; ++i) {

				chunk = chunks[i];
				data = chunk.data;
				csg = chunk.csg;

				if(!this.neutered.has(chunk)) {

					task = scheduler.getTask(chunk);

					if(task === undefined || task.priority < maxPriority) {

						// Modifications take precedence.
						if(csg !== null) {

							scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, maxPriority));

							this.runNextTask();

						} else if(data !== null && !data.full) {

							distance = BOX3.copy(chunk).distanceToPoint(camera.position);
							lod = Math.min(maxLevel, Math.trunc(distance / camera.far * levels));

							if(data.lod !== lod) {

								data.lod = lod;

								scheduler.schedule(chunk, new WorkerTask(Action.EXTRACT, chunk, maxLevel - data.lod));

								this.runNextTask();

							}

						}

					}

				}

			}

		}

		/**
		 * Finds the terrain chunks that intersect with the given ray and raycasts the
		 * associated meshes.
		 *
		 * Intersections are sorted by distance, closest first.
		 *
		 * @method raycast
		 * @param {Raycaster} raycaster - A raycaster.
		 * @return {Array} A list of terrain intersections.
		 */

		raycast(raycaster) {

			const meshes = this.meshes;
			const chunks = [];

			let intersects = [];
			let chunk;

			let i, l;

			this.volume.raycast(raycaster, chunks);

			for(i = 0, l = chunks.length; i < l; ++i) {

				chunk = chunks[i];

				if(meshes.has(chunk)) {

					intersects = intersects.concat(
						raycaster.intersectObject(meshes.get(chunk))
					);

				}

			}

			return intersects;

		}

		/**
		 * Removes all child meshes.
		 *
		 * @method clearMeshes
		 * @private
		 */

		clearMeshes() {

			const object = this.object;

			let child;

			while(object.children.length > 0) {

				child = object.children[0];
				child.geometry.dispose();
				child.material.dispose();
				object.remove(child);

			}

			this.meshes = new WeakMap();

		}

		/**
		 * Resets this terrain by removing data and closing active worker threads.
		 *
		 * @method clear
		 */

		clear() {

			this.clearMeshes();

			this.volume = new Volume(this.volume.chunkSize, this.volume.resolution);

			this.neutered = new WeakSet();
			this.chunks = new WeakMap();

			this.threadPool.clear();
			this.scheduler.clear();
			this.history.clear();

		}

		/**
		 * Destroys this terrain and frees internal resources.
		 *
		 * @method dispose
		 */

		dispose() {

			this.clearMeshes();
			this.threadPool.dispose();

		}

		/**
		 * Saves a description of the current volume data.
		 *
		 * @method save
		 * @return {String} A URL to the exported save data, or null if there is no data.
		 */

		save() {

			const sdf = this.history.combine();

			return (sdf === null) ? null : URL.createObjectURL(

				new Blob([JSON.stringify(sdf.serialise())], {
					type: "text/json"
				})

			);

		}

		/**
		 * Loads a volume.
		 *
		 * @method load
		 * @param {String} data - The volume description to load.
		 */

		load(data) {

			this.clear();

			this.edit(
				Reviver.reviveSDF(
					JSON.parse(data)
				)
			);

		}

	}

	/**
	 * Core components.
	 *
	 * @module rabbit-hole
	 * @submodule core
	 */

	/**
	 * A collection of events.
	 *
	 * @module rabbit-hole
	 * @submodule events
	 */

	/**
	 * An density bias for the Zero Crossing approximation.
	 *
	 * @property BIAS
	 * @type Number
	 * @private
	 * @static
	 * @final
	 */

	const BIAS = 1e-2;

	/**
	 * An error threshold for the Zero Crossing approximation.
	 *
	 * @property BIAS
	 * @type Number
	 * @private
	 * @static
	 * @final
	 */

	const THRESHOLD = 1e-6;

	/**
	 * A vector.
	 *
	 * @property AB
	 * @type Vector3
	 * @private
	 * @static
	 * @final
	 */

	const AB = new Vector3$2();

	/**
	 * A point.
	 *
	 * @property P
	 * @type Vector3
	 * @private
	 * @static
	 * @final
	 */

	const P = new Vector3$2();

	/**
	 * A vector.
	 *
	 * @property V
	 * @type Vector3
	 * @private
	 * @static
	 * @final
	 */

	const V = new Vector3$2();

	/**
	 * An edge.
	 *
	 * @class Edge
	 * @submodule volume
	 * @constructor
	 * @param {Vector3} a - A starting point.
	 * @param {Vector3} b - An ending point.
	 */

	class Edge {

		constructor(a = new Vector3$2(), b = new Vector3$2()) {

			/**
			 * The starting point of the edge.
			 *
			 * @property a
			 * @type Vector3
			 */

			this.a = a;

			/**
			 * The ending point of the edge.
			 *
			 * @property b
			 * @type Vector3
			 */

			this.b = b;

			/**
			 * The Zero Crossing interpolation value.
			 *
			 * @property t
			 * @type Number
			 */

			this.t = 0.0;

			/**
			 * The surface normal at the Zero Crossing position.
			 *
			 * @property n
			 * @type Vector3
			 */

			this.n = new Vector3$2();

		}

		/**
		 * Approximates the smallest density along the edge.
		 *
		 * @method approximateZeroCrossing
		 * @param {SignedDistanceFunction} sdf - A density field.
		 * @param {Number} [steps=8] - The maximum number of interpolation steps. Cannot be smaller than 2.
		 */

		approximateZeroCrossing(sdf, steps = 8) {

			const s = Math.max(1, steps - 1);

			let a = 0.0;
			let b = 1.0;
			let c = 0.0;
			let i = 0;

			let densityA, densityC;

			// Compute the vector from a to b.
			AB.subVectors(this.b, this.a);

			// Use bisection to find the root of the SDF.
			while(i <= s) {

				c = (a + b) / 2;

				P.addVectors(this.a, V.copy(AB).multiplyScalar(c));
				densityC = sdf.sample(P);

				if(Math.abs(densityC) <= BIAS || (b - a) / 2 <= THRESHOLD) {

					// Solution found.
					break;

				} else {

					P.addVectors(this.a, V.copy(AB).multiplyScalar(a));
					densityA = sdf.sample(P);

					(Math.sign(densityC) === Math.sign(densityA)) ? (a = c) : (b = c);

				}

				++i;

			}

			this.t = c;

		}

		/**
		 * Calculates the Zero Crossing position.
		 *
		 * @method computeZeroCrossingPosition
		 * @return {Vector3} The Zero Crossing position. The returned vector is volatile.
		 */

		computeZeroCrossingPosition() {

			return AB.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);

		}

		/**
		 * Computes the normal of the surface at the edge intersection.
		 *
		 * @method computeSurfaceNormal
		 * @param {SignedDistanceFunction} sdf - A density field.
		 * @return {Vector3} The normal.
		 * @todo Use analytical derivation instead of finite differences.
		 */

		computeSurfaceNormal(sdf) {

			const position = this.computeZeroCrossingPosition();
			const H = 0.001;

			const dx = sdf.sample(P.addVectors(position, V.set(H, 0, 0))) - sdf.sample(P.subVectors(position, V.set(H, 0, 0)));
			const dy = sdf.sample(P.addVectors(position, V.set(0, H, 0))) - sdf.sample(P.subVectors(position, V.set(0, H, 0)));
			const dz = sdf.sample(P.addVectors(position, V.set(0, 0, H))) - sdf.sample(P.subVectors(position, V.set(0, 0, H)));

			this.n.set(dx, dy, dz).normalize();

		}

	}

	/**
	 * A chunk helper.
	 *
	 * @class ChunkHelper
	 * @submodule helpers
	 * @constructor
	 * @extends Object3D
	 * @param {Chunk} [chunk=null] - A volume data chunk.
	 * @param {Boolean} [useMaterialIndices] - Whether points should be created for solid material indices.
	 * @param {Boolean} [useEdgeData] - Whether edges with intersection points and normals should be created.
	 */

	class ChunkHelper extends three.Object3D {

		constructor(chunk = null, useMaterialIndices, useEdgeData) {

			super();

			this.name = "ChunkHelper";

			/**
			 * The volume data chunk.
			 *
			 * @property chunk
			 * @type Chunk
			 */

			this.chunk = chunk;

			// Create groups for grid points, edges and normals.
			this.add(new three.Object3D());
			this.add(new three.Object3D());
			this.add(new three.Object3D());

			this.gridPoints.name = "GridPoints";
			this.edges.name = "Edges";
			this.normals.name = "Normals";

			this.update(useMaterialIndices, useEdgeData);

		}

		/**
		 * The grid points.
		 *
		 * @property gridPoints
		 * @type Object3D
		 */

		get gridPoints() { return this.children[0]; }

		/**
		 * The edges.
		 *
		 * @property edges
		 * @type Object3D
		 */

		get edges() { return this.children[1]; }

		/**
		 * The normals.
		 *
		 * @property normals
		 * @type Object3D
		 */

		get normals() { return this.children[2]; }

		/**
		 * Creates the helper geometry.
		 *
		 * @method update
		 * @param {Boolean} [useMaterialIndices=false] - Whether points should be created for solid material indices.
		 * @param {Boolean} [useEdgeData=true] - Whether edges with intersection points and normals should be created.
		 */

		update(useMaterialIndices = false, useEdgeData = true) {

			const chunk = this.chunk;

			if(chunk !== null && chunk.data !== null) {

				chunk.data.decompress();

				// Remove existing geometry.
				this.dispose();

				if(useMaterialIndices) { this.createPoints(chunk); }
				if(useEdgeData) { this.createEdges(chunk); }

				chunk.data.compress();

			}

		}

		/**
		 * Creates points for solid material indices.
		 *
		 * @method createPoints
		 * @private
		 * @param {Chunk} chunk - A volume data chunk.
		 */

		createPoints(chunk) {

			const s = chunk.size;
			const n = chunk.resolution;

			const materialIndices = chunk.data.materialIndices;

			const base = chunk.min;
			const offset = new three.Vector3();
			const position = new three.Vector3();

			const color = new Float32Array([0.0, 0.0, 0.0]);

			const pointsMaterial = new three.PointsMaterial({
				vertexColors: three.VertexColors,
				sizeAttenuation: false,
				size: 3
			});

			const geometry = new three.BufferGeometry();

			const vertexCount = chunk.data.materials;
			const positions = new Float32Array(vertexCount * 3);
			const colors = new Float32Array(vertexCount * 3);

			let x, y, z;
			let i, j;

			for(i = 0, j = 0, z = 0; z <= n; ++z) {

				offset.z = z * s / n;

				for(y = 0; y <= n; ++y) {

					offset.y = y * s / n;

					for(x = 0; x <= n; ++x) {

						offset.x = x * s / n;

						if(materialIndices[i++] !== Density.HOLLOW) {

							position.addVectors(base, offset);

							positions[j] = position.x; colors[j++] = color[0];
							positions[j] = position.y; colors[j++] = color[1];
							positions[j] = position.z; colors[j++] = color[2];

						}

					}

				}

			}

			geometry.addAttribute("position", new three.BufferAttribute(positions, 3));
			geometry.addAttribute("color", new three.BufferAttribute(colors, 3));

			this.gridPoints.add(new three.Points(geometry, pointsMaterial));

		}

		/**
		 * Creates edges with intersection points and normals.
		 *
		 * @method update
		 * @private
		 * @param {Chunk} chunk - A volume data chunk.
		 */

		createEdges(chunk) {

			const s = chunk.size;
			const n = chunk.resolution;
			const m = n + 1;
			const mm = m * m;

			const edgeData = chunk.data.edgeData;

			const base = chunk.min;
			const offsetA = new three.Vector3();
			const offsetB = new three.Vector3();
			const normalA = new three.Vector3();
			const normalB = new three.Vector3();
			const edge = new Edge();

			const axisColors = [
				new Float32Array([0.6, 0.0, 0.0]),
				new Float32Array([0.0, 0.6, 0.0]),
				new Float32Array([0.0, 0.0, 0.6])
			];

			const normalColor = new Float32Array([0.0, 1.0, 1.0]);

			const lineSegmentsMaterial = new three.LineBasicMaterial({
				vertexColors: three.VertexColors
			});

			let edges, zeroCrossings, normals;

			let edgePositions, edgeColors;
			let normalPositions, normalColors;
			let vertexCount, edgeColor, geometry;
			let axis, index;

			let d, a, i, j, k, l;
			let x, y, z;

			for(a = 4, d = 0; d < 3; ++d, a >>= 1) {

				axis = PATTERN[a];

				edges = edgeData.edges[d];
				zeroCrossings = edgeData.zeroCrossings[d];
				normals = edgeData.normals[d];
				edgeColor = axisColors[d];

				vertexCount = edges.length * 2;
				edgePositions = new Float32Array(vertexCount * 3);
				edgeColors = new Float32Array(vertexCount * 3);
				normalPositions = new Float32Array(vertexCount * 3);
				normalColors = new Float32Array(vertexCount * 3);

				for(i = 0, j = 0, k = 0, l = edges.length; i < l; ++i) {

					index = edges[i];

					x = index % m;
					y = Math.trunc((index % mm) / m);
					z = Math.trunc(index / mm);

					offsetA.set(
						x * s / n,
						y * s / n,
						z * s / n
					);

					offsetB.set(
						(x + axis[0]) * s / n,
						(y + axis[1]) * s / n,
						(z + axis[2]) * s / n
					);

					// Edge.
					edge.a.addVectors(base, offsetA);
					edge.b.addVectors(base, offsetB);

					edgePositions[j] = edge.a.x; edgeColors[j++] = edgeColor[0];
					edgePositions[j] = edge.a.y; edgeColors[j++] = edgeColor[1];
					edgePositions[j] = edge.a.z; edgeColors[j++] = edgeColor[2];

					edgePositions[j] = edge.b.x; edgeColors[j++] = edgeColor[0];
					edgePositions[j] = edge.b.y; edgeColors[j++] = edgeColor[1];
					edgePositions[j] = edge.b.z; edgeColors[j++] = edgeColor[2];

					// Normal at Zero Crossing.
					edge.t = zeroCrossings[i];
					edge.n.fromArray(normals, i * 3);

					normalA.copy(edge.computeZeroCrossingPosition());
					normalB.copy(normalA).addScaledVector(edge.n, 0.25 * s / n);

					normalPositions[k] = normalA.x; normalColors[k++] = normalColor[0];
					normalPositions[k] = normalA.y; normalColors[k++] = normalColor[1];
					normalPositions[k] = normalA.z; normalColors[k++] = normalColor[2];

					normalPositions[k] = normalB.x; normalColors[k++] = normalColor[0];
					normalPositions[k] = normalB.y; normalColors[k++] = normalColor[1];
					normalPositions[k] = normalB.z; normalColors[k++] = normalColor[2];

				}

				geometry = new three.BufferGeometry();
				geometry.addAttribute("position", new three.BufferAttribute(edgePositions, 3));
				geometry.addAttribute("color", new three.BufferAttribute(edgeColors, 3));

				this.edges.add(new three.LineSegments(geometry, lineSegmentsMaterial));

				geometry = new three.BufferGeometry();
				geometry.addAttribute("position", new three.BufferAttribute(normalPositions, 3));
				geometry.addAttribute("color", new three.BufferAttribute(normalColors, 3));

				this.normals.add(new three.LineSegments(geometry, lineSegmentsMaterial));

			}

		}

		/**
		 * Destroys this helper.
		 *
		 * @method dispose
		 */

		dispose() {

			let child, children;
			let i, j, il, jl;

			for(i = 0, il = this.children.length; i < il; ++i) {

				child = this.children[i];
				children = child.children;

				for(j = 0, jl = children.length; j < jl; ++j) {

					children[j].geometry.dispose();
					children[j].material.dispose();

				}

				while(children.length > 0) {

					child.remove(children[0]);

				}

			}

		}

	}

	/**
	 * A collection of helpers.
	 *
	 * @module rabbit-hole
	 * @submodule helpers
	 */

	/**
	 * A collection of shader materials.
	 *
	 * @module rabbit-hole
	 * @submodule materials
	 */

	/**
	 * A symmetric 3x3 matrix.
	 *
	 * @class SymmetricMatrix3
	 * @submodule math
	 * @constructor
	 */

	class SymmetricMatrix3 {

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @property elements
			 * @type Float32Array
			 */

			this.elements = new Float32Array([

				1, 0, 0,
				1, 0,
				1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
		 * @method set
		 * @chainable
		 * @param {Number} m00 - The value of the first row, first column.
		 * @param {Number} m01 - The value of the first row, second column.
		 * @param {Number} m02 - The value of the first row, third column.
		 * @param {Number} m11 - The value of the second row, second column.
		 * @param {Number} m12 - The value of the second row, third column.
		 * @param {Number} m22 - The value of the third row, third column.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		set(m00, m01, m02, m11, m12, m22) {

			const e = this.elements;

			e[0] = m00; e[1] = m01; e[2] = m02;
			e[3] = m11; e[4] = m12;
			e[5] = m22;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @method identity
		 * @chainable
		 * @return {SymmetricMatrix3} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0,
				1, 0,
				1

			);

			return this;

		}

		/**
		 * Copies values from a given matrix.
		 *
		 * @method copy
		 * @chainable
		 * @param {Matrix3} m - A matrix.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		copy(m) {

			const me = m.elements;

			this.set(

				me[0], me[1], me[2],
				me[3], me[4],
				me[5]

			);

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @method clone
		 * @return {SymmetricMatrix3} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Adds the values of a given matrix to this one.
		 *
		 * @method add
		 * @chainable
		 * @param {Matrix3} m - A matrix.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		add(m) {

			const te = this.elements;
			const me = m.elements;

			te[0] += me[0]; te[1] += me[1]; te[2] += me[2];
			te[3] += me[3]; te[4] += me[4];
			te[5] += me[5];

			return this;

		}

		/**
		 * Calculates the Frobenius norm of this matrix.
		 *
		 * @method norm
		 * @return {Number} The norm of this matrix.
		 */

		norm() {

			const e = this.elements;

			const m01m01 = e[1] * e[1];
			const m02m02 = e[2] * e[2];
			const m12m12 = e[4] * e[4];

			return Math.sqrt(

				e[0] * e[0] + m01m01 + m02m02 +
				m01m01 + e[3] * e[3] + m12m12 +
				m02m02 + m12m12 + e[5] * e[5]

			);

		}

		/**
		 * Calculates the absolute sum of all matrix components except for the main
		 * diagonal.
		 *
		 * @method off
		 * @return {Number} The offset of this matrix.
		 */

		off() {

			const e = this.elements;

			return Math.sqrt(2 * (

				// Diagonal = [0, 3, 5].
				e[1] * e[1] + e[2] * e[2] + e[4] * e[4]

			));

		}

		/**
		 * Applies this symmetric matrix to a vector.
		 *
		 * @method applyToVector3
		 * @param {Vector3} v - The vector to modify.
		 * @return {Vector3} The modified vector.
		 */

		applyToVector3(v) {

			const x = v.x, y = v.y, z = v.z;
			const e = this.elements;

			v.x = e[0] * x + e[1] * y + e[2] * z;
			v.y = e[1] * x + e[3] * y + e[4] * z;
			v.z = e[2] * x + e[4] * y + e[5] * z;

			return v;

		}

	}

	/**
	 * A 3x3 matrix.
	 *
	 * This class is a copy of THREE.Matrix3. It can be removed as soon as three.js
	 * starts supporting ES6 modules.
	 *
	 * @class Matrix3
	 * @submodule math
	 * @constructor
	 */

	class Matrix3 {

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @property elements
			 * @type Float32Array
			 */

			this.elements = new Float32Array([

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
		 * @method set
		 * @chainable
		 * @param {Number} m00 - The value of the first row, first column.
		 * @param {Number} m01 - The value of the first row, second column.
		 * @param {Number} m02 - The value of the first row, third column.
		 * @param {Number} m10 - The value of the second row, first column.
		 * @param {Number} m11 - The value of the second row, second column.
		 * @param {Number} m12 - The value of the second row, third column.
		 * @param {Number} m20 - The value of the third row, first column.
		 * @param {Number} m21 - The value of the third row, second column.
		 * @param {Number} m22 - The value of the third row, third column.
		 * @return {Matrix3} This matrix.
		 */

		set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

			const te = this.elements;

			te[0] = m00; te[1] = m10; te[2] = m20;
			te[3] = m01; te[4] = m11; te[5] = m21;
			te[6] = m02; te[7] = m12; te[8] = m22;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @method identity
		 * @chainable
		 * @return {Matrix3} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		}

		/**
		 * Copies the values of a given matrix.
		 *
		 * @method copy
		 * @chainable
		 * @param {Matrix3} m - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		copy(m) {

			const me = m.elements;

			return this.set(

				me[0], me[3], me[6],
				me[1], me[4], me[7],
				me[2], me[5], me[8]

			);

		}

		/**
		 * Clones this matrix.
		 *
		 * @method clone
		 * @return {Matrix3} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * A collection of matrix rotation utilities.
	 *
	 * @class Givens
	 * @submodule math
	 * @static
	 */

	class Givens {

		/**
		 * Rotates the given matrix.
		 *
		 * @method rot01Post
		 * @static
		 * @param {Matrix3} m - The target vector.
		 * @param {Object} coefficients - Two coefficients.
		 */

		static rot01Post(m, coefficients) {

			const e = m.elements;

			const m00 = e[0], m01 = e[3];
			const m10 = e[1], m11 = e[4];
			const m20 = e[2], m21 = e[5];

			const c = coefficients.c;
			const s = coefficients.s;

			e[0] = c * m00 - s * m01;
			e[3] = s * m00 + c * m01;
			// e[6] = m02;

			e[1] = c * m10 - s * m11;
			e[4] = s * m10 + c * m11;
			// e[7] = m12;

			e[2] = c * m20 - s * m21;
			e[5] = s * m20 + c * m21;
			// e[8] = m22;

		}

		/**
		 * Rotates the given matrix.
		 *
		 * @method rot02Post
		 * @static
		 * @param {Matrix3} m - The target vector.
		 * @param {Object} coefficients - Two coefficients.
		 */

		static rot02Post(m, coefficients) {

			const e = m.elements;

			const m00 = e[0], m02 = e[6];
			const m10 = e[1], m12 = e[7];
			const m20 = e[2], m22 = e[8];

			const c = coefficients.c;
			const s = coefficients.s;

			e[0] = c * m00 - s * m02;
			// e[3] = m01;
			e[6] = s * m00 + c * m02;

			e[1] = c * m10 - s * m12;
			// e[4] = m11;
			e[7] = s * m10 + c * m12;

			e[2] = c * m20 - s * m22;
			// e[5] = m21;
			e[8] = s * m20 + c * m22;

		}

		/**
		 * Rotates the given matrix.
		 *
		 * @method rot12Post
		 * @static
		 * @param {Matrix3} m - The target vector.
		 * @param {Object} coefficients - Two coefficients.
		 */

		static rot12Post(m, coefficients) {

			const e = m.elements;

			const m01 = e[3], m02 = e[6];
			const m11 = e[4], m12 = e[7];
			const m21 = e[5], m22 = e[8];

			const c = coefficients.c;
			const s = coefficients.s;

			// e[0] = m00;
			e[3] = c * m01 - s * m02;
			e[6] = s * m01 + c * m02;

			// e[1] = m10;
			e[4] = c * m11 - s * m12;
			e[7] = s * m11 + c * m12;

			// e[2] = m20;
			e[5] = c * m21 - s * m22;
			e[8] = s * m21 + c * m22;

		}

	}

	/**
	 * Symmetric Givens coefficients.
	 *
	 * @property coefficients
	 * @type Object
	 * @private
	 * @static
	 */

	const coefficients = {
		c: 0.0,
		s: 0.0
	};

	/**
	 * Caluclates symmetric coefficients for the Givens post rotation step.
	 *
	 * @method calculateSymmetricCoefficients
	 * @private
	 * @static
	 * @param {Number} aPP - PP.
	 * @param {Number} aPQ - PQ.
	 * @param {Number} aQQ - QQ.
	 */

	function calculateSymmetricCoefficients(aPP, aPQ, aQQ) {

		let tau, stt, tan;

		if(aPQ === 0) {

			coefficients.c = 1;
			coefficients.s = 0;

		} else {

			tau = (aQQ - aPP) / (2.0 * aPQ);
			stt = Math.sqrt(1.0 + tau * tau);
			tan = 1.0 / ((tau >= 0.0) ? (tau + stt) : (tau - stt));

			coefficients.c = 1.0 / Math.sqrt(1.0 + tan * tan);
			coefficients.s = tan * coefficients.c;

		}

	}

	/**
	 * A collection of matrix rotation utilities.
	 *
	 * @class Schur
	 * @submodule math
	 * @static
	 */

	class Schur {

		/**
		 * Rotates the given matrix.
		 *
		 * @method rot01
		 * @static
		 * @param {SymmetricMatrix3} m - A symmetric matrix.
		 * @return {Object} The coefficients.
		 */

		static rot01(m) {

			const e = m.elements;

			const m00 = e[0], m01 = e[1], m02 = e[2];
			const m11 = e[3], m12 = e[4];

			calculateSymmetricCoefficients(m00, m01, m11);

			const c = coefficients.c, s = coefficients.s;
			const cc = c * c, ss = s * s;

			const mix = 2.0 * c * s * m01;

			e[0] = cc * m00 - mix + ss * m11;
			e[1] = 0;
			e[2] = c * m02 - s * m12;

			e[3] = ss * m00 + mix + cc * m11;
			e[4] = s * m02 + c * m12;

			// e[5] = m22;

			return coefficients;

		}

		/**
		 * Rotates the given matrix.
		 *
		 * @method rot02
		 * @static
		 * @param {SymmetricMatrix3} m - A matrix.
		 * @return {Object} The coefficients.
		 */

		static rot02(m) {

			const e = m.elements;

			const m00 = e[0], m01 = e[1], m02 = e[2];
			const m12 = e[4];
			const m22 = e[5];

			calculateSymmetricCoefficients(m00, m02, m22);

			const c = coefficients.c, s = coefficients.s;
			const cc = c * c, ss = s * s;

			const mix = 2.0 * c * s * m02;

			e[0] = cc * m00 - mix + ss * m22;
			e[1] = c * m01 - s * m12;
			e[2] = 0;

			// e[3] = m11;
			e[4] = s * m01 + c * m12;

			e[5] = ss * m00 + mix + cc * m22;

			return coefficients;

		}

		/**
		 * Rotates the given matrix.
		 *
		 * @method rot12
		 * @static
		 * @param {SymmetricMatrix3} m - A matrix.
		 * @return {Object} The coefficients.
		 */

		static rot12(m) {

			const e = m.elements;

			const m01 = e[1], m02 = e[2];
			const m11 = e[3], m12 = e[4];
			const m22 = e[5];

			calculateSymmetricCoefficients(m11, m12, m22);

			const c = coefficients.c, s = coefficients.s;
			const cc = c * c, ss = s * s;

			const mix = 2.0 * c * s * m12;

			// e[0] = m00;
			e[1] = c * m01 - s * m02;
			e[2] = s * m01 + c * m02;

			e[3] = cc * m11 - mix + ss * m22;
			e[4] = 0;

			e[5] = ss * m11 + mix + cc * m22;

			return coefficients;

		}

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @method rotate01
	 * @private
	 * @static
	 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
	 * @param {Matrix3} v - A matrix.
	 */

	function rotate01(vtav, v) {

		const m01 = vtav.elements[1];

		if(m01 !== 0) {

			Givens.rot01Post(v, Schur.rot01(vtav));

		}

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @method rotate02
	 * @private
	 * @static
	 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
	 * @param {Matrix3} v - A matrix.
	 */

	function rotate02(vtav, v) {

		const m02 = vtav.elements[2];

		if(m02 !== 0) {

			Givens.rot02Post(v, Schur.rot02(vtav));

		}

	}

	/**
	 * Rotates the given matrix.
	 *
	 * @method rotate12
	 * @private
	 * @static
	 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
	 * @param {Matrix3} v - A matrix.
	 */

	function rotate12(vtav, v) {

		const m12 = vtav.elements[4];

		if(m12 !== 0) {

			Givens.rot12Post(v, Schur.rot12(vtav));

		}

	}

	/**
	 * Computes the symmetric Singular Value Decomposition.
	 *
	 * @method getSymmetricSVD
	 * @private
	 * @static
	 * @param {SymmetricMatrix3} a - A symmetric matrix.
	 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
	 * @param {Matrix3} v - A matrix.
	 * @param {Number} threshold - A threshold.
	 * @param {Number} maxSweeps - The maximum number of sweeps.
	 */

	function getSymmetricSVD(a, vtav, v, threshold, maxSweeps) {

		const delta = threshold * vtav.copy(a).norm();

		let i;

		for(i = 0; i < maxSweeps && vtav.off() > delta; ++i) {

			rotate01(vtav, v);
			rotate02(vtav, v);
			rotate12(vtav, v);

		}

	}

	/**
	 * Computes the pseudo inverse of a given value.
	 *
	 * @method pinv
	 * @private
	 * @static
	 * @param {Number} x - The value to invert.
	 * @param {Number} threshold - A threshold.
	 * @return {Number} The inverted value.
	 */

	function pinv(x, threshold) {

		const invX = 1.0 / x;

		return (Math.abs(x) < threshold || Math.abs(invX) < threshold) ? 0.0 : invX;

	}

	/**
	 * Calculates the pseudo inverse of the given matrix.
	 *
	 * @method pseudoInverse
	 * @private
	 * @static
	 * @param {Matrix3} t - The target matrix.
	 * @param {SymmetricMatrix3} a - A symmetric matrix.
	 * @param {Matrix3} b - A matrix.
	 * @param {Number} threshold - A threshold.
	 * @return {Number} A dimension indicating the amount of truncated singular values.
	 */

	function pseudoInverse(t, a, b, threshold) {

		const te = t.elements;
		const ae = a.elements;
		const be = b.elements;

		const a00 = ae[0];
		const a11 = ae[3];
		const a22 = ae[5];

		const a0 = pinv(a00, threshold);
		const a1 = pinv(a11, threshold);
		const a2 = pinv(a22, threshold);

		// Count how many singular values have been truncated.
		const truncatedValues = (a0 === 0.0) + (a1 === 0.0) + (a2 === 0.0);

		// Compute the feature dimension.
		const dimension = 3 - truncatedValues;

		const b00 = be[0], b01 = be[3], b02 = be[6];
		const b10 = be[1], b11 = be[4], b12 = be[7];
		const b20 = be[2], b21 = be[5], b22 = be[8];

		te[0] = b00 * a0 * b00 + b01 * a1 * b01 + b02 * a2 * b02;
		te[3] = b00 * a0 * b10 + b01 * a1 * b11 + b02 * a2 * b12;
		te[6] = b00 * a0 * b20 + b01 * a1 * b21 + b02 * a2 * b22;

		te[1] = te[3];
		te[4] = b10 * a0 * b10 + b11 * a1 * b11 + b12 * a2 * b12;
		te[7] = b10 * a0 * b20 + b11 * a1 * b21 + b12 * a2 * b22;

		te[2] = te[6];
		te[5] = te[7];
		te[8] = b20 * a0 * b20 + b21 * a1 * b21 + b22 * a2 * b22;

		return dimension;

	}

	/**
	 * A Singular Value Decomposition solver.
	 *
	 * @class SingularValueDecomposition
	 * @submodule math
	 * @static
	 */

	class SingularValueDecomposition {

		/**
		 * Performs the Singular Value Decomposition.
		 *
		 * @method solveSymmetric
		 * @static
		 * @param {SymmetricMatrix3} a - A symmetric matrix.
		 * @param {Vector3} b - A vector.
		 * @param {Vector3} x - A target vector.
		 * @param {Number} svdThreshold - A threshold.
		 * @param {Number} svdSweeps - The maximum number of SVD sweeps.
		 * @param {Number} pseudoInverseThreshold - A threshold.
		 * @return {Number} A dimension indicating the amount of truncated singular values.
		 */

		static solveSymmetric(a, b, x, svdThreshold, svdSweeps, pseudoInverseThreshold) {

			const v = new Matrix3();

			const pinv = new Matrix3();
			const vtav = new SymmetricMatrix3();

			let dimension;

			pinv.set(

				0, 0, 0,
				0, 0, 0,
				0, 0, 0

			);

			vtav.set(

				0, 0, 0,
				0, 0,
				0

			);

			getSymmetricSVD(a, vtav, v, svdThreshold, svdSweeps);

			// Least squares.
			dimension = pseudoInverse(pinv, vtav, v, pseudoInverseThreshold);

			x.copy(b).applyMatrix3(pinv);

			return dimension;

		}

		/**
		 * Calculates the error of the Singular Value Decomposition.
		 *
		 * @method calculateError
		 * @static
		 * @param {SymmetricMatrix3} t - A symmetric matrix.
		 * @param {Vector3} b - A vector.
		 * @param {Vector3} x - The calculated position.
		 * @return {Number} The error.
		 */

		static calculateError(t, b, x) {

			const e = t.elements;
			const v = x.clone();
			const a = new Matrix3();

			// Set symmetrically.
			a.set(

				e[0], e[1], e[2],
				e[1], e[3], e[4],
				e[2], e[4], e[5]

			);

			v.applyMatrix3(a);
			v.subVectors(b, v);

			return v.lengthSq();

		}

	}

	/**
	 * A Quaratic Error Function solver.
	 *
	 * Finds a point inside a voxel that minimises the sum of the squares of the
	 * distances to the surface intersection planes associated with the voxel.
	 *
	 * @class QEFSolver
	 * @submodule math
	 * @constructor
	 * @param {Number} [svdThreshold=1e-6] - A threshold for the Singular Value Decomposition error.
	 * @param {Number} [svdSweeps=4] - Number of Singular Value Decomposition sweeps.
	 * @param {Number} [pseudoInverseThreshold=1e-6] - A threshold for the pseudo inverse error.
	 */

	class QEFSolver {

		constructor(svdThreshold = 1e-6, svdSweeps = 4, pseudoInverseThreshold = 1e-6) {

			/**
			 * A Singular Value Decomposition error threshold.
			 *
			 * @property svdThreshold
			 * @type Number
			 * @private
			 * @default 1e-6
			 */

			this.svdThreshold = svdThreshold;

			/**
			 * The number of Singular Value Decomposition sweeps.
			 *
			 * @property svdSweeps
			 * @type Number
			 * @private
			 * @default 4
			 */

			this.svdSweeps = svdSweeps;

			/**
			 * A pseudo inverse error threshold.
			 *
			 * @property pseudoInverseThreshold
			 * @type Number
			 * @private
			 * @default 1e-6
			 */

			this.pseudoInverseThreshold = pseudoInverseThreshold;

			/**
			 * QEF data.
			 *
			 * @property data
			 * @type QEFData
			 * @private
			 * @default null
			 */

			this.data = null;

			/**
			 * The average of the surface intersection points of a voxel.
			 *
			 * @property massPoint
			 * @type Vector3
			 */

			this.massPoint = new Vector3$2();

			/**
			 * A symmetric matrix.
			 *
			 * @property ata
			 * @type SymmetricMatrix3
			 * @private
			 */

			this.ata = new SymmetricMatrix3();

			/**
			 * A vector.
			 *
			 * @property atb
			 * @type Vector3
			 * @private
			 */

			this.atb = new Vector3$2();

			/**
			 * A calculated vertex position.
			 *
			 * @property x
			 * @type Vector3
			 * @private
			 */

			this.x = new Vector3$2();

			/**
			 * Indicates whether this solver has a solution.
			 *
			 * @property hasSolution
			 * @type Boolean
			 */

			this.hasSolution = false;

		}

		/**
		 * Computes the error of the approximated position.
		 *
		 * @method computeError
		 * @return {Number} The QEF error.
		 */

		computeError() {

			const x = this.x;

			let error = Infinity;
			let atax;

			if(this.hasSolution) {

				atax = this.ata.applyToVector3(x.clone());
				error = x.dot(atax) - 2.0 * x.dot(this.atb) + this.data.btb;

			}

			return error;

		}

		/**
		 * Sets the QEF data.
		 *
		 * @method setData
		 * @chainable
		 * @param {QEFData} d - QEF Data.
		 * @return {QEFSolver} This solver.
		 */

		setData(d) {

			this.data = d;
			this.hasSolution = false;

			return this;

		}

		/**
		 * Solves the Quadratic Error Function.
		 *
		 * @method solve
		 * @return {Vector3} The calculated vertex position.
		 */

		solve() {

			const data = this.data;
			const massPoint = this.massPoint;
			const ata = this.ata;
			const atb = this.atb;
			const x = this.x;

			let mp;

			if(!this.hasSolution && data !== null && data.numPoints > 0) {

				// The mass point is a sum, so divide it to make it the average.
				massPoint.copy(data.massPoint);
				massPoint.divideScalar(data.numPoints);

				ata.copy(data.ata);
				atb.copy(data.atb);

				mp = ata.applyToVector3(massPoint.clone());
				atb.sub(mp);

				x.set(0, 0, 0);

				data.massPointDimension = SingularValueDecomposition.solveSymmetric(
					ata, atb, x, this.svdThreshold, this.svdSweeps, this.pseudoInverseThreshold
				);

				// svdError = SingularValueDecomposition.calculateError(ata, atb, x);

				x.add(massPoint);

				atb.copy(data.atb);

				this.hasSolution = true;

			}

			return x;

		}

		/**
		 * Clears this QEF instance.
		 *
		 * @method clear
		 */

		clear() {

			this.data = null;
			this.hasSolution = false;

		}

	}

	/**
	 * A data container for the QEF solver.
	 *
	 * @class QEFData
	 * @submodule math
	 * @constructor
	 */

	class QEFData {

		constructor() {

			/**
			 * A symmetric matrix.
			 *
			 * @property ata
			 * @type SymmetricMatrix3
			 * @private
			 */

			this.ata = new SymmetricMatrix3();

			this.ata.set(

				0, 0, 0,
				0, 0,
				0

			);

			/**
			 * A vector.
			 *
			 * @property atb
			 * @type Vector3
			 * @private
			 */

			this.atb = new Vector3$2();

			/**
			 * Used to calculate the error of the computed position.
			 *
			 * @property btb
			 * @type Number
			 */

			this.btb = 0;

			/**
			 * An accumulation of the surface intersection points.
			 *
			 * @property massPoint
			 * @type Vector3
			 * @private
			 */

			this.massPoint = new Vector3$2();

			/**
			 * The amount of accumulated surface intersection points.
			 *
			 * @property numPoints
			 * @type Number
			 */

			this.numPoints = 0;

			/**
			 * The dimension of the mass point. This value is used when mass points are
			 * accumulated during voxel cell clustering.
			 *
			 * @property massPointDimension
			 * @type Number
			 */

			this.massPointDimension = 0;

		}

		/**
		 * Sets the values of this data instance.
		 *
		 * @method set
		 * @chainable
		 * @return {QEFData} This data.
		 */

		set(ata, atb, btb, massPoint, numPoints) {

			this.ata.copy(ata);
			this.atb.copy(atb);
			this.btb = btb;

			this.massPoint.copy(massPoint);
			this.numPoints = numPoints;

			return this;

		}

		/**
		 * Copies values from a given data instance.
		 *
		 * @method copy
		 * @chainable
		 * @return {QEFData} This data.
		 */

		copy(d) {

			return this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);

		}

		/**
		 * Adds the given surface intersection point and normal.
		 *
		 * @method add
		 * @param {Vector3} p - An intersection point.
		 * @param {Vector3} n - A surface normal.
		 */

		add(p, n) {

			const nx = n.x;
			const ny = n.y;
			const nz = n.z;

			const dot = n.dot(p);

			const ata = this.ata.elements;
			const atb = this.atb;

			ata[0] += nx * nx; ata[1] += nx * ny; ata[2] += nx * nz;
			ata[3] += ny * ny; ata[4] += ny * nz;
			ata[5] += nz * nz;

			atb.x += dot * nx;
			atb.y += dot * ny;
			atb.z += dot * nz;

			this.btb += dot * dot;

			this.massPoint.add(p);

			++this.numPoints;

		}

		/**
		 * Adds an entire data set.
		 *
		 * @method addData
		 * @param {QEFData} d - QEF data.
		 */

		addData(d) {

			this.ata.add(d.ata);
			this.atb.add(d.atb);
			this.btb += d.btb;

			if(this.massPointDimension === d.massPointDimension) {

				this.massPoint.add(d.massPoint);
				this.numPoints += d.numPoints;

			} else if(d.massPointDimension > this.massPointDimension) {

				// Adopt the mass point of the higher dimension.
				this.massPoint.copy(d.massPoint);
				this.massPointDimension = d.massPointDimension;
				this.numPoints = d.numPoints;

			}

		}

		/**
		 * Clears this data.
		 *
		 * @method clear
		 */

		clear() {

			this.ata.set(

				0, 0, 0,
				0, 0,
				0

			);

			this.atb.set(0, 0, 0);
			this.btb = 0;

			this.massPoint.set(0, 0, 0);
			this.numPoints = 0;

		}

		/**
		 * Clones this data.
		 *
		 * @method clone
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Mathematical system components.
	 *
	 * @module rabbit-hole
	 * @submodule math
	 */

	/**
	 * A cubic voxel that holds information about the surface of a volume.
	 *
	 * @class Voxel
	 * @submodule volume
	 * @constructor
	 */

	class Voxel {

		constructor() {

			/**
			 * Holds binary material information about all eight corners of this voxel.
			 *
			 * A value of 0 means that this voxel is completely outside of the volume,
			 * whereas a value of 255 means that it's fully inside of it. Any other
			 * value indicates a material change which implies that the voxel contains
			 * the surface.
			 *
			 * @property materials
			 * @type Number
			 * @default 0
			 */

			this.materials = 0;

			/**
			 * The amount of edges that exhibit a material change in this voxel.
			 *
			 * @property edgeCount
			 * @type Number
			 * @default 0
			 */

			this.edgeCount = 0;

			/**
			 * A generated index for this voxel's vertex. Used during the construction
			 * of the final polygons.
			 *
			 * @property index
			 * @type Number
			 * @default -1
			 */

			this.index = -1;

			/**
			 * The vertex that lies inside this voxel.
			 *
			 * @property position
			 * @type Vector3
			 */

			this.position = new Vector3$2();

			/**
			 * The normal of the vertex that lies inside this voxel.
			 *
			 * @property normal
			 * @type Vector3
			 */

			this.normal = new Vector3$2();

			/**
			 * A QEF data construct. Used to calculate the vertex position.
			 *
			 * @property qefData
			 * @type QEFData
			 * @default null
			 */

			this.qefData = null;

		}

	}

	/**
	 * A bias for boundary checks.
	 *
	 * @property BIAS
	 * @type Number
	 * @private
	 * @static
	 * @final
	 */

	const BIAS$1 = 1e-6;

	/**
	 * The base QEF error threshold.
	 *
	 * @property THRESHOLD
	 * @type Number
	 * @private
	 * @static
	 * @final
	 */

	const THRESHOLD$1 = 1e-1;

	/**
	 * A QEF error threshold for voxel clustering.
	 *
	 * @property threshold
	 * @type Number
	 * @private
	 * @static
	 */

	let threshold = 0.0;

	/**
	 * A voxel octant.
	 *
	 * @class VoxelCell
	 * @submodule octree
	 * @extends CubicOctant
	 * @constructor
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Number} [size] - The size of the octant.
	 */

	class VoxelCell extends CubicOctant {

		constructor(min, size) {

			super(min, size);

			/**
			 * A voxel that contains draw information.
			 *
			 * @property voxel
			 * @type Voxel
			 * @default null
			 */

			this.voxel = null;

		}

		/**
		 * The level of detail.
		 *
		 * @property lod
		 * @type Number
		 */

		get lod() { return threshold; }

		set lod(lod) {

			threshold = THRESHOLD$1 + (lod * lod * lod);

		}

		/**
		 * Checks if the given point lies inside this cell's boundaries.
		 *
		 * @method contains
		 * @param {Vector3} p - A point.
		 * @return {Boolean} Whether the given point lies inside this cell.
		 */

		contains(p) {

			const min = this.min;
			const size = this.size;

			return (
				p.x >= min.x - BIAS$1 &&
				p.y >= min.y - BIAS$1 &&
				p.z >= min.z - BIAS$1 &&
				p.x <= min.x + size + BIAS$1 &&
				p.y <= min.y + size + BIAS$1 &&
				p.z <= min.z + size + BIAS$1
			);

		}

		/**
		 * Attempts to simplify this cell.
		 *
		 * @method collapse
		 * @return {Number} The amount of removed voxels.
		 */

		collapse() {

			const children = this.children;

			const signs = new Int16Array([
				-1, -1, -1, -1,
				-1, -1, -1, -1
			]);

			let midSign = -1;
			let collapsible = (children !== null);

			let removedVoxels = 0;

			let qefData, qefSolver;
			let child, sign, voxel;
			let position;

			let v, i;

			if(collapsible) {

				qefData = new QEFData();

				for(v = 0, i = 0; i < 8; ++i) {

					child = children[i];

					removedVoxels += child.collapse();

					voxel = child.voxel;

					if(child.children !== null) {

						// Couldn't simplify the child.
						collapsible = false;

					} else if(voxel !== null) {

						qefData.addData(voxel.qefData);

						midSign = (voxel.materials >> (7 - i)) & 1;
						signs[i] = (voxel.materials >> i) & 1;

						++v;

					}

				}

				if(collapsible) {

					qefSolver = new QEFSolver();
					position = qefSolver.setData(qefData).solve();

					if(qefSolver.computeError() <= threshold) {

						voxel = new Voxel();
						voxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);

						for(i = 0; i < 8; ++i) {

							sign = signs[i];
							child = children[i];

							if(sign === -1) {

								// Undetermined, use mid sign instead.
								voxel.materials |= (midSign << i);

							} else {

								voxel.materials |= (sign << i);

								// Accumulate normals.
								voxel.normal.add(child.voxel.normal);

							}

						}

						voxel.normal.normalize();
						voxel.qefData = qefData;

						this.voxel = voxel;
						this.children = null;

						// Removed existing voxels and created a new one.
						removedVoxels += v - 1;

					}

				}

			}

			return removedVoxels;

		}

	}

	/**
	 * Creates a voxel and builds a material configuration code from the materials
	 * in the voxel corners.
	 *
	 * @method createVoxel
	 * @private
	 * @static
	 * @param {Number} n - The grid resolution.
	 * @param {Number} x - A local grid point X-coordinate.
	 * @param {Number} y - A local grid point Y-coordinate.
	 * @param {Number} z - A local grid point Z-coordinate.
	 * @param {Uint8Array} materialIndices - The material indices.
	 * @return {Voxel} A voxel.
	 */

	function createVoxel(n, x, y, z, materialIndices) {

		const m = n + 1;
		const mm = m * m;

		const voxel = new Voxel();

		let materials, edgeCount;
		let material, offset, index;
		let c1, c2, m1, m2;

		let i;

		// Pack the material information of the eight corners into a single byte.
		for(materials = 0, i = 0; i < 8; ++i) {

			// Translate the coordinates into a one-dimensional grid point index.
			offset = PATTERN[i];
			index = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);

			// Convert the identified material index into a binary value.
			material = Math.min(materialIndices[index], Density.SOLID);

			// Store the value in bit i.
			materials |= (material << i);

		}

		// Find out how many edges intersect with the implicit surface.
		for(edgeCount = 0, i = 0; i < 12; ++i) {

			c1 = EDGES[i][0];
			c2 = EDGES[i][1];

			m1 = (materials >> c1) & 1;
			m2 = (materials >> c2) & 1;

			// Check if there is a material change on the edge.
			if(m1 !== m2) {

				++edgeCount;

			}

		}

		voxel.materials = materials;
		voxel.edgeCount = edgeCount;
		voxel.qefData = new QEFData();

		return voxel;

	}

	/**
	 * A cubic voxel octree.
	 *
	 * @class VoxelBlock
	 * @submodule octree
	 * @extends Octree
	 * @constructor
	 * @param {Chunk} chunk - A volume chunk.
	 */

	/**
	 * Space partitioning components.
	 *
	 * @module rabbit-hole
	 * @submodule octree
	 */

	/**
	 * Finds out which grid points lie inside the area of the given operation.
	 *
	 * @method computeIndexBounds
	 * @private
	 * @static
	 * @param {Chunk} chunk - A volume chunk.
	 * @param {Operation} operation - A CSG operation.
	 * @return {Box3} The index bounds.
	 */

	function computeIndexBounds(chunk, operation) {

		const s = chunk.size;
		const n = chunk.resolution;

		const min = new Vector3$2(0, 0, 0);
		const max = new Vector3$2(n, n, n);

		const region = new Box3$2(chunk.min, chunk.max);

		if(operation.type !== OperationType.INTERSECTION) {

			if(operation.boundingBox.intersectsBox(region)) {

				min.copy(operation.boundingBox.min).max(region.min).sub(region.min);

				min.x = Math.ceil(min.x * n / s);
				min.y = Math.ceil(min.y * n / s);
				min.z = Math.ceil(min.z * n / s);

				max.copy(operation.boundingBox.max).min(region.max).sub(region.min);

				max.x = Math.floor(max.x * n / s);
				max.y = Math.floor(max.y * n / s);
				max.z = Math.floor(max.z * n / s);

			} else {

				// The chunk is unaffected by this operation.
				min.set(n, n, n);
				max.set(0, 0, 0);

			}

		}

		return new Box3$2(min, max);

	}

	/**
	 * Combines material indices.
	 *
	 * @method combineMaterialIndices
	 * @private
	 * @static
	 * @param {Chunk} chunk - A volume chunk
	 * @param {Operation} operation - A CSG operation.
	 * @param {HermiteData} data0 - A target data set.
	 * @param {HermiteData} data1 - A predominant data set.
	 * @param {Box3} bounds - Grid iteration limits.
	 */

	function combineMaterialIndices(chunk, operation, data0, data1, bounds) {

		const m = chunk.resolution + 1;
		const mm = m * m;

		const X = bounds.max.x;
		const Y = bounds.max.y;
		const Z = bounds.max.z;

		let x, y, z;

		for(z = bounds.min.z; z <= Z; ++z) {

			for(y = bounds.min.y; y <= Y; ++y) {

				for(x = bounds.min.x; x <= X; ++x) {

					operation.updateMaterialIndex((z * mm + y * m + x), data0, data1);

				}

			}

		}

	}

	/**
	 * Generates material indices.
	 *
	 * @method generateMaterialIndices
	 * @private
	 * @static
	 * @param {Chunk} chunk - A volume chunk
	 * @param {DensityFunction} operation - A CSG operation.
	 * @param {HermiteData} data - A target data set.
	 * @param {Box3} bounds - Grid iteration limits.
	 */

	function generateMaterialIndices(chunk, operation, data, bounds) {

		const s = chunk.size;
		const n = chunk.resolution;
		const m = n + 1;
		const mm = m * m;

		const materialIndices = data.materialIndices;

		const base = chunk.min;
		const offset = new Vector3$2();
		const position = new Vector3$2();

		const X = bounds.max.x;
		const Y = bounds.max.y;
		const Z = bounds.max.z;

		let materialIndex;
		let materials = 0;

		let x, y, z;

		for(z = bounds.min.z; z <= Z; ++z) {

			offset.z = z * s / n;

			for(y = bounds.min.y; y <= Y; ++y) {

				offset.y = y * s / n;

				for(x = bounds.min.x; x <= X; ++x) {

					offset.x = x * s / n;

					materialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));

					if(materialIndex !== Density.HOLLOW) {

						materialIndices[z * mm + y * m + x] = materialIndex;

						++materials;

					}

				}

			}

		}

		data.materials = materials;

	}

	/**
	 * Combines edges.
	 *
	 * @method combineEdges
	 * @private
	 * @static
	 * @param {Chunk} chunk - A volume chunk
	 * @param {Operation} operation - A CSG operation.
	 * @param {HermiteData} data0 - A target data set.
	 * @param {HermiteData} data1 - A predominant data set.
	 * @return {Object} The generated edge data.
	 */

	function combineEdges(chunk, operation, data0, data1) {

		const m = chunk.resolution + 1;
		const indexOffsets = new Uint32Array([1, m, m * m]);

		const materialIndices = data0.materialIndices;

		const edge1 = new Edge();
		const edge0 = new Edge();

		const edgeData1 = data1.edgeData;
		const edgeData0 = data0.edgeData;
		const edgeData = new EdgeData(chunk.resolution);
		const lengths = new Uint32Array(3);

		let edges1, zeroCrossings1, normals1;
		let edges0, zeroCrossings0, normals0;
		let edges, zeroCrossings, normals;

		let indexA1, indexB1;
		let indexA0, indexB0;

		let m1, m2;
		let edge;

		let c, d, i, j, il, jl;

		// Process the edges along the X-axis, then Y and finally Z.
		for(c = 0, d = 0; d < 3; c = 0, ++d) {

			edges1 = edgeData1.edges[d];
			edges0 = edgeData0.edges[d];
			edges = edgeData.edges[d];

			zeroCrossings1 = edgeData1.zeroCrossings[d];
			zeroCrossings0 = edgeData0.zeroCrossings[d];
			zeroCrossings = edgeData.zeroCrossings[d];

			normals1 = edgeData1.normals[d];
			normals0 = edgeData0.normals[d];
			normals = edgeData.normals[d];

			il = edges1.length;
			jl = edges0.length;

			// Process all generated edges.
			for(i = 0, j = 0; i < il; ++i) {

				indexA1 = edges1[i];
				indexB1 = indexA1 + indexOffsets[d];

				m1 = materialIndices[indexA1];
				m2 = materialIndices[indexB1];

				if(m1 !== m2 && (m1 === Density.HOLLOW || m2 === Density.HOLLOW)) {

					edge1.t = zeroCrossings1[i];
					edge1.n.x = normals1[i * 3];
					edge1.n.y = normals1[i * 3 + 1];
					edge1.n.z = normals1[i * 3 + 2];

					if(operation.type === OperationType.DIFFERENCE) {

						edge1.n.negate();

					}

					edge = edge1;

					// Process existing edges up to the generated edge.
					while(j < jl && edges0[j] <= indexA1) {

						indexA0 = edges0[j];
						indexB0 = indexA0 + indexOffsets[d];

						edge0.t = zeroCrossings0[j];
						edge0.n.x = normals0[j * 3];
						edge0.n.y = normals0[j * 3 + 1];
						edge0.n.z = normals0[j * 3 + 2];

						if(indexA0 < indexA1) {

							m1 = materialIndices[indexA0];
							m2 = materialIndices[indexB0];

							if(m1 !== m2 && (m1 === Density.HOLLOW || m2 === Density.HOLLOW)) {

								// The edge exhibits a material change and there is no conflict.
								edges[c] = indexA0;
								zeroCrossings[c] = edge0.t;
								normals[c * 3] = edge0.n.x;
								normals[c * 3 + 1] = edge0.n.y;
								normals[c * 3 + 2] = edge0.n.z;

								++c;

							}

						} else {

							// Resolve the conflict.
							edge = operation.selectEdge(edge0, edge1, (m1 === Density.SOLID));

						}

						++j;

					}

					edges[c] = indexA1;
					zeroCrossings[c] = edge.t;
					normals[c * 3] = edge.n.x;
					normals[c * 3 + 1] = edge.n.y;
					normals[c * 3 + 2] = edge.n.z;

					++c;

				}

			}

			// Collect remaining edges.
			while(j < jl) {

				indexA0 = edges0[j];
				indexB0 = indexA0 + indexOffsets[d];

				m1 = materialIndices[indexA0];
				m2 = materialIndices[indexB0];

				if(m1 !== m2 && (m1 === Density.HOLLOW || m2 === Density.HOLLOW)) {

					edges[c] = indexA0;
					zeroCrossings[c] = zeroCrossings0[j];
					normals[c * 3] = normals0[j * 3];
					normals[c * 3 + 1] = normals0[j * 3 + 1];
					normals[c * 3 + 2] = normals0[j * 3 + 2];

					++c;

				}

				++j;

			}

			lengths[d] = c;

		}

		return { edgeData, lengths };

	}

	/**
	 * Generates edge data.
	 *
	 * @method generateEdges
	 * @private
	 * @static
	 * @param {Chunk} chunk - A volume chunk
	 * @param {DensityFunction} operation - A CSG operation.
	 * @param {HermiteData} data - A target data set.
	 * @param {Box3} bounds - Grid iteration limits.
	 * @return {Object} The generated edge data.
	 */

	function generateEdges(chunk, operation, data, bounds) {

		const s = chunk.size;
		const n = chunk.resolution;
		const m = n + 1;
		const mm = m * m;

		const indexOffsets = new Uint32Array([1, m, mm]);
		const materialIndices = data.materialIndices;

		const base = chunk.min;
		const offsetA = new Vector3$2();
		const offsetB = new Vector3$2();
		const edge = new Edge();

		const edgeData = new EdgeData(n);
		const lengths = new Uint32Array(3);

		let edges, zeroCrossings, normals;
		let indexA, indexB;

		let minX, minY, minZ;
		let maxX, maxY, maxZ;

		let c, d, a, axis;
		let x, y, z;

		// Process the edges along the X-axis, then Y and finally Z.
		for(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {

			// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
			axis = PATTERN[a];

			edges = edgeData.edges[d];
			zeroCrossings = edgeData.zeroCrossings[d];
			normals = edgeData.normals[d];

			minX = bounds.min.x; maxX = bounds.max.x;
			minY = bounds.min.y; maxY = bounds.max.y;
			minZ = bounds.min.z; maxZ = bounds.max.z;

			/* Include edges that straddle the bounding box and avoid processing grid
			points at chunk borders. */
			switch(d) {

				case 0:
					minX = Math.max(minX - 1, 0);
					maxX = Math.min(maxX, n - 1);
					break;

				case 1:
					minY = Math.max(minY - 1, 0);
					maxY = Math.min(maxY, n - 1);
					break;

				case 2:
					minZ = Math.max(minZ - 1, 0);
					maxZ = Math.min(maxZ, n - 1);
					break;

			}

			for(z = minZ; z <= maxZ; ++z) {

				for(y = minY; y <= maxY; ++y) {

					for(x = minX; x <= maxX; ++x) {

						indexA = z * mm + y * m + x;
						indexB = indexA + indexOffsets[d];

						// Check if the edge exhibits a material change.
						if(materialIndices[indexA] !== materialIndices[indexB]) {

							offsetA.set(
								x * s / n,
								y * s / n,
								z * s / n
							);

							offsetB.set(
								(x + axis[0]) * s / n,
								(y + axis[1]) * s / n,
								(z + axis[2]) * s / n
							);

							edge.a.addVectors(base, offsetA);
							edge.b.addVectors(base, offsetB);

							// Create and store the edge data.
							operation.generateEdge(edge);

							edges[c] = indexA;
							zeroCrossings[c] = edge.t;
							normals[c * 3] = edge.n.x;
							normals[c * 3 + 1] = edge.n.y;
							normals[c * 3 + 2] = edge.n.z;

							++c;

						}

					}

				}

			}

			lengths[d] = c;

		}

		return { edgeData, lengths };

	}

	/**
	 * Either generates or combines volume data based on the operation type.
	 *
	 * @method update
	 * @private
	 * @static
	 * @param {Chunk} chunk - A volume chunk.
	 * @param {Operation} operation - A CSG operation.
	 * @param {HermiteData} data0 - A target data set.
	 * @param {HermiteData} [data1] - A predominant data set.
	 */

	function update(chunk, operation, data0, data1) {

		const bounds = computeIndexBounds(chunk, operation);

		let result, edgeData, lengths, d;

		if(operation.type === OperationType.DENSITY_FUNCTION) {

			generateMaterialIndices(chunk, operation, data0, bounds);

		} else {

			combineMaterialIndices(chunk, operation, data0, data1, bounds);

		}

		if(!data0.empty && !data0.full) {

			result = (operation.type === OperationType.DENSITY_FUNCTION) ?
				generateEdges(chunk, operation, data0, bounds) :
				combineEdges(chunk, operation, data0, data1);

			edgeData = result.edgeData;
			lengths = result.lengths;

			// Cut off empty data.
			for(d = 0; d < 3; ++d) {

				edgeData.edges[d] = edgeData.edges[d].slice(0, lengths[d]);
				edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);
				edgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);

			}

			data0.edgeData = edgeData;

		}

	}

	/**
	 * Executes the given operation.
	 *
	 * @method execute
	 * @private
	 * @static
	 * @param {Chunk} chunk - A volume chunk.
	 * @param {Operation} operation - An operation.
	 * @return {HermiteData} The generated data or null if the data is empty.
	 */

	function execute(chunk, operation) {

		const children = operation.children;

		let result, data;
		let i, l;

		if(operation.type === OperationType.DENSITY_FUNCTION) {

			// Create a data target.
			result = new HermiteData();

			// Use the density function to generate data.
			update(chunk, operation, result);

		}

		// Union, Difference or Intersection.
		for(i = 0, l = children.length; i < l; ++i) {

			// Generate the full result of the child operation recursively.
			data = execute(chunk, children[i]);

			if(result === undefined) {

				result = data;

			} else if(data !== null) {

				if(result === null) {

					if(operation.type === OperationType.UNION) {

						// Build upon the first non-empty data.
						result = data;

					}

				} else {

					// Combine the two data sets.
					update(chunk, operation, result, data);

				}

			} else if(operation.type === OperationType.INTERSECTION) {

				// An intersection with nothing results in nothing.
				result = null;

			}

			if(result === null && operation.type !== OperationType.UNION) {

				// Further subtractions and intersections would have no effect.
				break;

			}

		}

		return (result !== null && result.empty) ? null : result;

	}

	/**
	 * Constructive Solid Geometry combines Signed Distance Functions by using
	 * Boolean operators to generate and transform volume data.
	 *
	 * @class ConstructiveSolidGeometry
	 * @submodule csg
	 * @static
	 */

	/**
	 * A collection of Constructive Solid Geometry components.
	 *
	 * @module rabbit-hole
	 * @submodule csg
	 */

	/**
	 * A collection of Signed Distance Function components.
	 *
	 * @module rabbit-hole
	 * @submodule sdf
	 */

	/**
	 * Volume management components.
	 *
	 * @module rabbit-hole
	 * @submodule volume
	 */

	/**
	 * Exposure of the library components.
	 *
	 * @module rabbit-hole
	 * @main rabbit-hole
	 */

	/**
	 * An enumeration of mouse buttons.
	 *
	 * @class Button
	 * @static
	 */

	const Button = {

		/**
		 * The main mouse button, usually the left one.
		 *
		 * @property MAIN
		 * @type Number
		 * @static
		 * @final
		 */

		MAIN: 0,

		/**
		 * The auxiliary mouse button, usually the middle one.
		 *
		 * @property AUXILIARY
		 * @type Number
		 * @static
		 * @final
		 */

		AUXILIARY: 1,

		/**
		 * The secondary mouse button, usually the right one.
		 *
		 * @property SECONDARY
		 * @type Number
		 * @static
		 * @final
		 */

		SECONDARY: 2

	};

	/**
	 * An octree helper.
	 *
	 * @class OctreeHelper
	 * @submodule helpers
	 * @constructor
	 * @extends Object3D
	 * @param {Octree} [octree=null] - The octree to visualise.
	 */

	class OctreeHelper extends three.Object3D {

		constructor(octree = null) {

			super();

			this.name = "OctreeHelper";

			/**
			 * The octree.
			 *
			 * @property octree
			 * @type Octree
			 */

			this.octree = octree;

			this.update();

		}

		/**
		 * Creates octant geometry.
		 *
		 * @method createLineSegments
		 * @private
		 * @param {Array} octants - The octants.
		 */

		createLineSegments(octants) {

			const maxOctants = (Math.pow(2, 16) / 8) - 1;
			const group = new three.Object3D();

			const material = new three.LineBasicMaterial({
				color: 0xffffff * Math.random()
			});

			let octantCount = octants.length;
			let vertexCount;
			let length;

			let indices, positions;
			let octant, min, max;
			let geometry;

			let i, j, c, d, n;
			let corner, edge;

			// Create geometry in multiple runs to limit the amount of vertices.
			for(i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

				length += (octantCount < maxOctants) ? octantCount : maxOctants;
				octantCount -= maxOctants;

				vertexCount = length * 8;
				indices = new Uint16Array(vertexCount * 3);
				positions = new Float32Array(vertexCount * 3);

				// Don't reset i, continue where a previous run left off.
				for(c = 0, d = 0; i < length; ++i) {

					octant = octants[i];
					min = octant.min;
					max = octant.max;

					for(j = 0; j < 12; ++j) {

						edge = EDGES[j];

						indices[d++] = c + edge[0];
						indices[d++] = c + edge[1];

					}

					for(j = 0; j < 8; ++j, ++c) {

						corner = PATTERN[j];

						positions[c * 3] = (corner[0] === 0) ? min.x : max.x;
						positions[c * 3 + 1] = (corner[1] === 0) ? min.y : max.y;
						positions[c * 3 + 2] = (corner[2] === 0) ? min.z : max.z;

					}

				}

				geometry = new three.BufferGeometry();
				geometry.setIndex(new three.BufferAttribute(indices, 1));
				geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

				group.add(new three.LineSegments(geometry, material));

			}

			this.add(group);

		}

		/**
		 * Updates the helper geometry.
		 *
		 * @method update
		 */

		update() {

			const depth = (this.octree !== null) ? this.octree.getDepth() : -1;

			let level = 0;

			// Remove existing geometry.
			this.dispose();

			while(level <= depth) {

				this.createLineSegments(this.octree.findOctantsByLevel(level));

				++level;

			}

		}

		/**
		 * Destroys this helper.
		 *
		 * @method dispose
		 */

		dispose() {

			let child, children;
			let i, j, il, jl;

			for(i = 0, il = this.children.length; i < il; ++i) {

				child = this.children[i];
				children = child.children;

				for(j = 0, jl = children.length; j < jl; ++j) {

					children[j].geometry.dispose();
					children[j].material.dispose();

				}

				while(children.length > 0) {

					child.remove(children[0]);

				}

			}

			while(this.children.length > 0) {

				this.remove(children[0]);

			}

		}

	}

	/**
	 * A mouse position.
	 *
	 * @property MOUSE
	 * @type Vector2
	 * @private
	 * @static
	 * @final
	 */

	const MOUSE = new three.Vector2();

	/**
	 * A volume editor.
	 *
	 * @class Editor
	 * @implements EventListener
	 * @constructor
	 * @param {Terrain} terrain - A terrain instance.
	 * @param {Camera} camera - A camera.
	 * @param {Element} [dom=document.body] - A dom element.
	 */

	class Editor {

		constructor(terrain, camera, dom = document.body) {

			/**
			 * A terrain.
			 *
			 * @property terrain
			 * @type Terrain
			 * @private
			 */

			this.terrain = terrain;

			/**
			 * A camera.
			 *
			 * @property camera
			 * @type PerspectiveCamera
			 * @private
			 */

			this.camera = camera;

			/**
			 * A dom element.
			 *
			 * @property dom
			 * @type Element
			 * @private
			 */

			this.dom = dom;

			/**
			 * A raycaster.
			 *
			 * @property raycaster
			 * @type Raycaster
			 * @private
			 */

			this.raycaster = new three.Raycaster();

			/**
			 * The cursor size.
			 *
			 * @property cursorSize
			 * @type Number
			 * @private
			 */

			this.cursorSize = 1;

			/**
			 * The cursor.
			 *
			 * @property cursor
			 * @type Mesh
			 */

			this.cursor = new three.Mesh(
				new three.SphereBufferGeometry(this.cursorSize, 16, 16),
				new three.MeshBasicMaterial({
					transparent: true,
					opacity: 0.5,
					color: 0x0096ff,
					fog: false
				})
			);

			/**
			 * An octree helper.
			 *
			 * @property octreeHelper
			 * @type OctreeHelper
			 */

			this.octreeHelper = new OctreeHelper();
			this.octreeHelper.visible = false;

			/**
			 * An chunk helper.
			 *
			 * @property chunkHelper
			 * @type ChunkHelper
			 */

			this.chunkHelper = new ChunkHelper();
			this.chunkHelper.visible = false;

			/**
			 * A delta time.
			 *
			 * @property delta
			 * @type String
			 */

			this.delta = "";

			this.setEnabled(true);

		}

		/**
		 * Handles events.
		 *
		 * @method handleEvent
		 * @param {Event} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "mousemove":
					this.raycast(event);
					break;

				case "mousedown":
					this.handlePointerEvent(event, true);
					break;

				case "mouseup":
					this.handlePointerEvent(event, false);
					break;

				case "contextmenu":
					event.preventDefault();
					break;

				case "modificationend":
					this.handleModification(event);
					break;

			}

		}

		/**
		 * Handles pointer button events.
		 *
		 * @method handlePointerEvent
		 * @private
		 * @param {MouseEvent} event - A mouse event.
		 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
		 */

		handlePointerEvent(event, pressed) {

			event.preventDefault();

			switch(event.button) {

				case Button.MAIN:
					this.handleMain(pressed);
					break;

				case Button.AUXILIARY:
					this.handleAuxiliary(pressed);
					break;

				case Button.SECONDARY:
					this.handleSecondary(pressed);
					break;

			}

		}

		/**
		 * Handles main pointer button events.
		 *
		 * @method handleMain
		 * @private
		 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
		 */

		handleMain(pressed) {

			if(pressed) {

				this.terrain.union(new Sphere({
					origin: this.cursor.position.toArray(),
					radius: this.cursorSize
				}));

			}

		}

		/**
		 * Handles auxiliary pointer button events.
		 *
		 * @method handleAuxiliary
		 * @private
		 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
		 */

		handleAuxiliary(pressed) {

		}

		/**
		 * Handles secondary pointer button events.
		 *
		 * @method handleSecondary
		 * @private
		 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
		 */

		handleSecondary(pressed) {

			if(pressed) {

				this.terrain.subtract(new Sphere({
					origin: this.cursor.position.toArray(),
					radius: this.cursorSize
				}));

			}

		}

		/**
		 * Handles terrain modifications.
		 *
		 * @method handleModification
		 * @private
		 * @param {TerrainEvent} event - A terrain modification event.
		 */

		handleModification(event) {

			if(this.chunkHelper.visible) {

				this.chunkHelper.chunk = event.chunk;
				this.chunkHelper.update(false, true);

			}

		}

		/**
		 * Raycasts the terrain.
		 *
		 * @method raycast
		 * @param {MouseEvent} event - A mouse event.
		 */

		raycast(event) {

			const raycaster = this.raycaster;
			const t0 = performance.now();

			MOUSE.x = (event.clientX / window.innerWidth) * 2 - 1;
			MOUSE.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(MOUSE, this.camera);
			const intersects = this.terrain.raycast(raycaster);

			this.delta = (((performance.now() - t0) * 100.0) / 100.0).toFixed(2) + " ms";

			if(intersects.length > 0) {

				this.cursor.position.copy(intersects[0].point);

			} else {

				this.cursor.position.copy(raycaster.ray.direction).multiplyScalar(10).add(raycaster.ray.origin);

			}

		}

		/**
		 * Enables or disables this editor.
		 *
		 * @method setEnabled
		 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
		 */

		setEnabled(enabled) {

			const terrain = this.terrain;
			const dom = this.dom;

			if(enabled) {

				this.cursor.position.copy(this.camera.position);
				this.cursor.visible = true;

				terrain.addEventListener("modificationend", this);
				dom.addEventListener("contextmenu", this);
				dom.addEventListener("mousemove", this);
				dom.addEventListener("mousedown", this);
				dom.addEventListener("mouseup", this);

			} else {

				this.cursor.visible = false;

				terrain.removeEventListener("modificationend", this);
				dom.removeEventListener("contextmenu", this);
				dom.removeEventListener("mousemove", this);
				dom.removeEventListener("mousedown", this);
				dom.removeEventListener("mouseup", this);

			}

		}

		/**
		 * Removes all event listeners.
		 *
		 * @method dispose
		 */

		dispose() { this.setEnabled(false); }

		/**
		 * Saves a snapshot of the current terrain data.
		 *
		 * @method save
		 */

		save() {

			const a = document.createElement("a");
			a.href = this.terrain.save();
			a.download = "terrain.json";
			a.click();

		}

		/**
		 * Registers configuration options.
		 *
		 * @method configure
		 * @param {GUI} gui - A GUI.
		 */

		configure(gui) {

			const folder = gui.addFolder("Editor");

			folder.add(this, "delta").listen();

			folder.add(this, "cursorSize").min(1).max(6).step(0.01).onChange(() => {

				this.cursor.scale.set(this.cursorSize, this.cursorSize, this.cursorSize);

			});

			folder.add(this.chunkHelper, "visible");
			folder.add(this, "save");

			folder.open();

		}

	}

	/**
	 * A terrain stats monitor.
	 *
	 * @class TerrainStats
	 * @implements EventListener
	 * @constructor
	 * @param {Terrain} terrain - A terrain instance.
	 */

	class TerrainStats {

		constructor(terrain) {

			/**
			 * A stats monitor.
			 *
			 * @property stats
			 * @type Stats
			 */

			this.stats = new Stats();

			/**
			 * The terrain.
			 *
			 * @property terrain
			 * @type Terrain
			 * @private
			 */

			this.terrain = terrain;

			/**
			 * A panel for volume modifications.
			 *
			 * @property modificationPanel
			 * @type Panel
			 * @private
			 */

			this.modificationPanel = this.stats.addPanel(new Stats.Panel("CSG", "#ff8", "#221"));

			/**
			 * A panel for surface extractions.
			 *
			 * @property extractionPanel
			 * @type Panel
			 * @private
			 */

			this.extractionPanel = this.stats.addPanel(new Stats.Panel("DC", "#f8f", "#212"));

			/**
			 * Measured delta times.
			 *
			 * @property deltas
			 * @type Map
			 * @private
			 */

			this.deltas = new Map();

			/**
			 * Measured delta time maxima.
			 *
			 * @property maxDeltas
			 * @type Map
			 * @private
			 */

			this.maxDeltas = new Map();

			this.setEnabled(true);

		}

		/**
		 * Handles terrain events.
		 *
		 * @method handleEvent
		 * @param {TerrainEvent} event - A terrain event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "extractionstart":
				case "modificationstart":
					this.deltas.set(event.chunk, performance.now());
					break;

				case "modificationend":
					this.measureTime(event, this.modificationPanel);
					break;

				case "extractionend":
					this.measureTime(event, this.extractionPanel);
					break;

			}

		}

		/**
		 * Measures execution time.
		 *
		 * @method measureTime
		 * @private
		 * @param {TerrainEvent} event - A terrain event.
		 * @param {Panel} panel - The panel to update.
		 */

		measureTime(event, panel) {

			const maxDeltas = this.maxDeltas;
			const deltas = this.deltas;

			const delta = performance.now() - deltas.get(event.chunk);
			const maxDelta = maxDeltas.has(event.type) ? maxDeltas.get(event.type) : 0.0;

			if(delta > maxDelta) {

				maxDeltas.set(event.type, delta);

			}

			panel.update(delta, maxDelta);
			deltas.delete(event.chunk);

		}

		/**
		 * Enables or disables this stats monitor.
		 *
		 * @method setEnabled
		 * @param {Boolean} enabled - Whether this monitor should be enabled or disabled.
		 */

		setEnabled(enabled) {

			const terrain = this.terrain;

			if(enabled) {

				terrain.addEventListener("modificationstart", this);
				terrain.addEventListener("extractionstart", this);
				terrain.addEventListener("modificationend", this);
				terrain.addEventListener("extractionend", this);

			} else {

				terrain.removeEventListener("modificationstart", this);
				terrain.removeEventListener("extractionstart", this);
				terrain.removeEventListener("modificationend", this);
				terrain.removeEventListener("extractionend", this);

			}

		}

		/**
		 * Removes all event listeners.
		 *
		 * @method dispose
		 */

		dispose() { this.setEnabled(false); }

	}

	/**
	 * An collection of movement flags.
	 *
	 * @class MovementState
	 * @constructor
	 */

	class MovementState {

		constructor() {

			/**
			 * Movement to the left.
			 *
			 * @property left
			 * @type Boolean
			 */

			this.left = false;

			/**
			 * Movement to the right.
			 *
			 * @property right
			 * @type Boolean
			 */

			this.right = false;

			/**
			 * Forward motion.
			 *
			 * @property forward
			 * @type Boolean
			 */

			this.forward = false;

			/**
			 * Backward motion.
			 *
			 * @property backward
			 * @type Boolean
			 */

			this.backward = false;

			/**
			 * Ascension.
			 *
			 * @property up
			 * @type Boolean
			 */

			this.up = false;

			/**
			 * Descent.
			 *
			 * @property down
			 * @type Boolean
			 */

			this.down = false;

			/**
			 * Movement speed boost.
			 *
			 * @property boost
			 * @type Boolean
			 */

			this.boost = false;

		}

		/**
		 * Resets this state.
		 *
		 * @method reset
		 */

		reset() {

			this.left = false;
			this.right = false;
			this.forward = false;
			this.backward = false;

			this.up = false;
			this.down = false;
			this.boost = false;

		}

	}

	/**
	 * An enumeration of keys.
	 *
	 * @class Key
	 * @static
	 */

	const Key = {

		/**
		 * The main movement keys: W, A, S and D.
		 *
		 * @property WASD
		 * @type Array
		 * @static
		 * @final
		 */

		WASD: [87, 65, 83, 68],

		/**
		 * The X key.
		 *
		 * @property X
		 * @type Number
		 * @static
		 * @final
		 */

		X: 88,

		/**
		 * The arrow keys: Left, Up, Right and Down.
		 *
		 * @property ARROWS
		 * @type Array
		 * @static
		 * @final
		 */

		ARROWS: [37, 38, 39, 40],

		/**
		 * The space bar.
		 *
		 * @property SPACE
		 * @type Number
		 * @static
		 * @final
		 */

		SPACE: 32,

		/**
		 * The shift key.
		 *
		 * @property SHIFT
		 * @type Number
		 * @static
		 * @final
		 */

		SHIFT: 16,

		/**
		 * The control key.
		 *
		 * @property CTRL
		 * @type Number
		 * @static
		 * @final
		 */

		CTRL: 17,

		/**
		 * The alt key.
		 *
		 * @property ALT
		 * @type Number
		 * @static
		 * @final
		 */

		ALT: 18

	};

	/**
	 * Two PI.
	 *
	 * @property TWO_PI
	 * @type Number
	 * @private
	 * @static
	 * @final
	 */

	const TWO_PI = 2 * Math.PI;

	/**
	 * Movement controls driven by user input.
	 *
	 * @class Controls
	 * @implements EventListener
	 * @constructor
	 * @param {Object3D} object - An object, usually a camera.
	 * @param {Element} [dom=document.body] - A dom element.
	 */

	class Controls {

		constructor(object, dom = document.body) {

			/**
			 * An object.
			 *
			 * @property object
			 * @type Object3D
			 * @private
			 */

			this.object = object;

			/**
			 * A dom element.
			 *
			 * @property dom
			 * @type Element
			 */

			this.dom = dom;

			/**
			 * A target.
			 *
			 * @property target
			 * @type Vector3
			 * @private
			 */

			this.target = new three.Vector3();

			/**
			 * A spherical coordinate system.
			 *
			 * @property spherical
			 * @type Spherical
			 * @private
			 */

			this.spherical = new three.Spherical();

			/**
			 * The camera movement speed.
			 *
			 * @property movementSpeed
			 * @type Number
			 * @default 1.0
			 */

			this.movementSpeed = 1.0;

			/**
			 * A camera movement boost speed.
			 *
			 * @property boostSpeed
			 * @type Number
			 * @default 2.0
			 */

			this.boostSpeed = 2.0;

			/**
			 * The camera look speed.
			 *
			 * @property lookSpeed
			 * @type Number
			 * @default 0.002
			 */

			this.lookSpeed = 0.002;

			/**
			 * A movement state.
			 *
			 * @property state
			 * @type MovementState
			 * @private
			 */

			this.state = new MovementState();

			this.setEnabled(true);

		}

		/**
		 * Handles events.
		 *
		 * @method handleEvent
		 * @param {Event} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "mousemove":
					this.look(event);
					break;

				case "mousedown":
					this.handlePointerEvent(event, true);
					break;

				case "mouseup":
					this.handlePointerEvent(event, false);
					break;

				case "keydown":
					this.changeMovementState(event, true);
					break;

				case "keyup":
					this.changeMovementState(event, false);
					break;

				case "pointerlockchange":
					this.handlePointerLock();
					break;

			}

		}

		/**
		 * Enables or disables the look controls based on the pointer lock state.
		 *
		 * @method handlePointerLock
		 * @private
		 */

		handlePointerLock() {

			if(document.pointerLockElement === this.dom) {

				this.dom.addEventListener("mousemove", this);

			} else {

				this.dom.removeEventListener("mousemove", this);

			}

		}

		/**
		 * Handles pointer events.
		 *
		 * @method handlePointerEvent
		 * @private
		 * @param {MouseEvent} event - A mouse event.
		 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
		 */

		handlePointerEvent(event, pressed) {

			event.preventDefault();

			switch(event.button) {

				case Button.MAIN:
					this.handleMain(pressed);
					break;

				case Button.AUXILIARY:
					this.handleAuxiliary(pressed);
					break;

				case Button.SECONDARY:
					this.handleSecondary(pressed);
					break;

			}

		}

		/**
		 * Handles main pointer button events.
		 *
		 * @method handleMain
		 * @private
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleMain(pressed) {

			if(document.pointerLockElement !== this.dom && pressed) {

				this.dom.requestPointerLock();

			} else {

				document.exitPointerLock();

			}

		}

		/**
		 * Handles auxiliary pointer button events.
		 *
		 * @method handleAuxiliary
		 * @private
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleAuxiliary(pressed) {

		}

		/**
		 * Handles secondary pointer button events.
		 *
		 * @method handleSecondary
		 * @private
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleSecondary(pressed) {

			this.handleMain(pressed);

		}

		/**
		 * Changes the movement state.
		 *
		 * @method changeMovementState
		 * @private
		 * @param {KeyboardEvent} event - A keyboard event.
		 * @param {Boolean} s - The target state.
		 */

		changeMovementState(event, s) {

			const state = this.state;

			switch(event.keyCode) {

				case Key.WASD[0]:
				case Key.ARROWS[1]:
					state.forward = s;
					break;

				case Key.WASD[1]:
				case Key.ARROWS[0]:
					state.left = s;
					break;

				case Key.WASD[2]:
				case Key.ARROWS[3]:
					state.backward = s;
					break;

				case Key.WASD[3]:
				case Key.ARROWS[2]:
					state.right = s;
					break;

				case Key.SPACE:
					event.preventDefault();
					state.up = s;
					break;

				case Key.X:
					state.down = s;
					break;

				case Key.SHIFT:
					state.boost = s;
					break;

			}

		}

		/**
		 * Rotates the object.
		 *
		 * @method look
		 * @private
		 * @param {MouseEvent} event - A mouse event.
		 */

		look(event) {

			const s = this.spherical;

			s.theta -= event.movementX * this.lookSpeed;
			s.phi += event.movementY * this.lookSpeed;

			s.theta %= TWO_PI;
			s.makeSafe();

			this.object.lookAt(
				this.target.setFromSpherical(s).add(this.object.position)
			);

		}

		/**
		 * Moves the object.
		 *
		 * @method move
		 * @private
		 * @param {Number} delta - A delta time, in seconds.
		 */

		move(delta) {

			const object = this.object;
			const state = this.state;

			const step = delta * (state.boost ? this.boostSpeed : this.movementSpeed);

			if(state.backward) {

				object.translateZ(step);

			} else if(state.forward) {

				object.translateZ(-step);

			}

			if(state.right) {

				object.translateX(step);

			} else if(state.left) {

				object.translateX(-step);

			}

			if(state.up) {

				object.translateY(step);

			} else if(state.down) {

				object.translateY(-step);

			}

		}

		/**
		 * Updates the controls to advance movement calculations.
		 *
		 * @method update
		 * @private
		 * @param {Number} delta - A delta time, in seconds.
		 */

		update(delta) {

			this.move(delta);

		}

		/**
		 * Focuses the object on the given target.
		 *
		 * @method focus
		 * @param {Vector3} target - A target.
		 */

		focus(target) {

			this.object.lookAt(target);
			this.target.subVectors(target, this.object.position);
			this.spherical.setFromVector3(this.target);

		}

		/**
		 * Enables or disables the controls.
		 *
		 * @method setEnabled
		 * @param {Boolean} enabled - Whether the controls should be enabled or disabled.
		 */

		setEnabled(enabled) {

			const dom = this.dom;

			this.state.reset();

			if(enabled) {

				document.addEventListener("pointerlockchange", this);
				document.body.addEventListener("keyup", this);
				document.body.addEventListener("keydown", this);
				dom.addEventListener("mousedown", this);
				dom.addEventListener("mouseup", this);

			} else {

				document.removeEventListener("pointerlockchange", this);
				document.body.removeEventListener("keyup", this);
				document.body.removeEventListener("keydown", this);
				dom.removeEventListener("mousedown", this);
				dom.removeEventListener("mouseup", this);
				dom.removeEventListener("mousemove", this);

			}

			document.exitPointerLock();

		}

		/**
		 * Removes all event listeners.
		 *
		 * @method dispose
		 */

		dispose() { this.setEnabled(false); }

	}

	/**
	 * The main application.
	 *
	 * @class App
	 * @static
	 */

	class App {

		/**
		 * Initialises the editor app.
		 *
		 * @method initialise
		 * @static
		 * @param {HTMLElement} viewport - The viewport.
		 * @param {HTMLElement} aside - A secondary container.
		 * @param {Map} assets - Preloaded assets.
		 */

		static initialise(viewport, aside, assets) {

			const width = window.innerWidth;
			const height = window.innerHeight;
			const aspect = width / height;

			// Clock.

			const clock = new three.Clock();

			// Scene.

			const scene = new three.Scene();
			scene.fog = new three.FogExp2(0xeeeeee, 0.00025);
			scene.background = assets.has("sky") ? assets.get("sky") : null;

			// Renderer.

			const renderer = new three.WebGLRenderer({
				logarithmicDepthBuffer: true,
				antialias: true
			});

			renderer.setSize(width, height);
			renderer.setClearColor(scene.fog.color);
			renderer.setPixelRatio(window.devicePixelRatio);
			viewport.appendChild(renderer.domElement);

			// Camera and Controls.

			const camera = new three.PerspectiveCamera(50, aspect, 0.1, 100);
			const controls = new Controls(camera, renderer.domElement);
			camera.position.set(10, 10, 10);
			controls.focus(scene.position);
			controls.movementSpeed = 4;
			controls.boostSpeed = 16;

			scene.add(camera);

			// Axis helper.

			// scene.add(new AxisHelper());

			// GUI.

			const gui = new dat.GUI({ autoPlace: false });
			aside.appendChild(gui.domElement);

			// Lights.

			const hemisphereLight = new three.HemisphereLight(0x3284ff, 0xffc87f, 0.6);
			const directionalLight = new three.DirectionalLight(0xfff4e5);

			hemisphereLight.position.set(0, 1, 0).multiplyScalar(50);
			directionalLight.position.set(-1, 1.75, 1).multiplyScalar(50);

			scene.add(directionalLight);
			scene.add(hemisphereLight);

			// Terrain.

			const terrain = new Terrain({
				resolution: 32,
				chunkSize: 32
			});

			terrain.material.uniforms.diffuse.value.setHex(0xffffff);
			terrain.material.uniforms.offsetRepeat.value.set(0, 0, 0.5, 0.5);

			terrain.material.uniforms.roughness.value = 0.6;
			terrain.material.uniforms.metalness.value = 0.2;

			// terrain.material.envMap = assets.get("sky");

			terrain.material.setMaps(
				assets.get("diffuseXZ"),
				assets.get("diffuseY"),
				assets.get("diffuseXZ")
			);

			terrain.material.setNormalMaps(
				assets.get("normalmapXZ"),
				assets.get("normalmapY"),
				assets.get("normalmapXZ")
			);

			terrain.load(assets.get("terrain"));

			scene.add(terrain.object);

			// Stats monitor.

			const terrainStats = new TerrainStats(terrain);
			const stats = terrainStats.stats;

			stats.dom.id = "stats";
			stats.showPanel(3);

			aside.appendChild(stats.dom);

			// Editor.

			const editor = new Editor(terrain, camera, renderer.domElement);
			editor.setEnabled(false);
			editor.configure(gui);

			scene.add(editor.cursor);
			scene.add(editor.octreeHelper);
			scene.add(editor.chunkHelper);

			// Additional configuration.

			(function() {

				const params = {

					terrain: {
						diffuse: terrain.material.uniforms.diffuse.value.getHex(),
						roughness: terrain.material.uniforms.roughness.value,
						metalness: terrain.material.uniforms.metalness.value,
						flatshading: (terrain.material.shading === three.FlatShading),
						wireframe: terrain.material.wireframe
					},

					directionalLight: {
						color: directionalLight.color.getHex(),
						intensity: directionalLight.intensity
					},

					hemisphereLight: {
						color: hemisphereLight.color.getHex(),
						groundColor: hemisphereLight.groundColor.getHex(),
						intensity: hemisphereLight.intensity
					}

				};

				let folder = gui.addFolder("Terrain");

				let subfolder = folder.addFolder("Material");

				subfolder.addColor(params.terrain, "diffuse").onChange(function() {

					terrain.material.uniforms.diffuse.value.setHex(params.terrain.diffuse);

				});

				subfolder.add(params.terrain, "roughness").min(0.0).max(1.0).step(0.01).onChange(function() {

					terrain.material.uniforms.roughness.value = params.terrain.roughness;

				});

				subfolder.add(params.terrain, "metalness").min(0.0).max(1.0).step(0.01).onChange(function() {

					terrain.material.uniforms.metalness.value = params.terrain.metalness;

				});

				subfolder.add(params.terrain, "flatshading").onChange(function() {

					const shading = params.terrain.flatshading ? three.FlatShading : three.SmoothShading;

					terrain.material.shading = shading;
					terrain.material.needsUpdate = true;

				});

				subfolder.add(params.terrain, "wireframe").onChange(function() {

					terrain.material.wireframe = params.terrain.wireframe;
					terrain.material.needsUpdate = true;

				});

				folder.add(terrain.object, "visible");

				folder.open();

				folder = gui.addFolder("Light");

				subfolder = folder.addFolder("Directional");

				subfolder.addColor(params.directionalLight, "color").onChange(function() {

					directionalLight.color.setHex(params.directionalLight.color);

				});

				subfolder.add(params.directionalLight, "intensity").min(0.0).max(1.0).step(0.01).onChange(function() {

					directionalLight.intensity = params.directionalLight.intensity;

				});

				subfolder = folder.addFolder("Hemisphere");

				subfolder.addColor(params.hemisphereLight, "color").onChange(function() {

					hemisphereLight.color.setHex(params.hemisphereLight.color);

				});

				subfolder.addColor(params.hemisphereLight, "groundColor").onChange(function() {

					hemisphereLight.color.setHex(params.hemisphereLight.groundColor);

				});

				subfolder.add(params.hemisphereLight, "intensity").min(0.0).max(1.0).step(0.01).onChange(function() {

					hemisphereLight.intensity = params.hemisphereLight.intensity;

				});

				folder = gui.addFolder("Info");

				folder.add(renderer.info.memory, "geometries").listen();
				folder.add(renderer.info.memory, "textures").listen();
				folder.add(renderer.info.render, "calls").listen();
				folder.add(renderer.info.render, "vertices").listen();
				folder.add(renderer.info.render, "faces").listen();
				folder.add(renderer.info.render, "points").listen();

			}());

			/**
			 * Toggles between camera mode and edit mode.
			 *
			 * @method onKeyDown
			 * @private
			 * @static
			 * @param {Event} event - An event.
			 */

			document.addEventListener("keydown", (function() {

				let flag = false;

				return function onKeyDown(event) {

					if(event.altKey) {

						event.preventDefault();
						controls.setEnabled(flag);
						editor.setEnabled(!flag);

						flag = !flag;

					}

				};

			}()));

			/**
			 * Handles browser resizing.
			 *
			 * @method onResize
			 * @private
			 * @static
			 * @param {Event} event - An event.
			 */

			window.addEventListener("resize", (function() {

				let id = 0;

				function handleResize(event) {

					const width = event.target.innerWidth;
					const height = event.target.innerHeight;

					renderer.setSize(width, height);
					camera.aspect = width / height;
					camera.updateProjectionMatrix();

					id = 0;

				}

				return function onResize(event) {

					if(id === 0) {

						id = setTimeout(handleResize, 66, event);

					}

				};

			}()));

			/**
			 * The main render loop.
			 *
			 * @method render
			 * @private
			 * @static
			 * @param {DOMHighResTimeStamp} now - An execution timestamp.
			 */

			(function render(now) {

				requestAnimationFrame(render);

				stats.begin();

				controls.update(clock.getDelta());
				terrain.update(camera);
				renderer.render(scene, camera);

				stats.end();

			}());

		}

	}

	/**
	 * The entry point of the volume editor.
	 *
	 * @class Main
	 * @static
	 */

	/**
	 * Loads assets.
	 *
	 * @method loadAssets
	 * @private
	 * @static
	 * @param {Function} callback - A function to call on completion. Assets will be provided as a parameter.
	 */

	function loadAssets(callback) {

		const assets = new Map();

		const loadingManager = new three.LoadingManager();
		const fileLoader = new three.FileLoader(loadingManager);
		const textureLoader = new three.TextureLoader(loadingManager);
		/* const cubeTextureLoader = new CubeTextureLoader(loadingManager);

		const path = "textures/cube/01/";
		const format = ".png";
		const urls = [
			path + "px" + format, path + "nx" + format,
			path + "py" + format, path + "ny" + format,
			path + "pz" + format, path + "nz" + format
		]; */

		loadingManager.onProgress = function onProgress(item, loaded, total) {

			if(loaded === total) { callback(assets); }

		};

		/* cubeTextureLoader.load(urls, function(textureCube) {

			assets.set("sky", textureCube);

		}); */

		fileLoader.load("terrain/terrain.json", function(text) {

			assets.set("terrain", text);

		});

		textureLoader.load("textures/diffuse/05.jpg", function(texture) {

			texture.wrapS = texture.wrapT = three.RepeatWrapping;
			assets.set("diffuseXZ", texture);

		});

		textureLoader.load("textures/diffuse/03.jpg", function(texture) {

			texture.wrapS = texture.wrapT = three.RepeatWrapping;
			assets.set("diffuseY", texture);

		});

		textureLoader.load("textures/normal/05.png", function(texture) {

			texture.wrapS = texture.wrapT = three.RepeatWrapping;
			assets.set("normalmapXZ", texture);

		});

		textureLoader.load("textures/normal/03.png", function(texture) {

			texture.wrapS = texture.wrapT = three.RepeatWrapping;
			assets.set("normalmapY", texture);

		});

	}

	/**
	 * Generates an error message and lists missing key features.
	 *
	 * @method createErrorMessage
	 * @private
	 * @static
	 * @param {Detector} detector - A detector.
	 * @return {HTMLElement} An element that contains the error message.
	 */

	function createErrorMessage(detector) {

		const message = document.createElement("p");
		const features = document.createElement("ul");

		let feature;

		if(!detector.canvas) {

			feature = document.createElement("li");
			feature.appendChild(document.createTextNode("Canvas"));
			features.appendChild(feature);

		}

		if(!detector.webgl) {

			feature = document.createElement("li");
			feature.appendChild(document.createTextNode("WebGL"));
			features.appendChild(feature);

		}

		if(!detector.worker) {

			feature = document.createElement("li");
			feature.appendChild(document.createTextNode("Worker"));
			features.appendChild(feature);

		}

		if(!detector.file) {

			feature = document.createElement("li");
			feature.appendChild(document.createTextNode("Blob"));
			features.appendChild(feature);

		}

		message.appendChild(document.createTextNode("Missing the following core features:"));
		message.appendChild(features);

		return message;

	}

	/**
	 * Starts the volume editor.
	 *
	 * @method main
	 * @private
	 * @static
	 * @param {Event} event - An event.
	 */

	window.addEventListener("load", function main(event) {

		window.removeEventListener("load", main);

		const viewport = document.getElementById("viewport");
		const aside = document.getElementById("aside");

		const detector = new Detector();

		if(detector.canvas && detector.webgl && detector.worker && detector.file) {

			loadAssets(function(assets) {

				viewport.removeChild(viewport.children[0]);
				App.initialise(viewport, aside, assets);

			});

		} else {

			viewport.removeChild(viewport.children[0]);
			viewport.appendChild(createErrorMessage(detector));

		}

	});

}(THREE,dat,Stats));
