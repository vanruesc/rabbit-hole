/**
 * rabbit-hole v0.0.0 build May 03 2017
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2017 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
     typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
     typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
     (factory((global.RABBITHOLE = global.RABBITHOLE || {}),global.THREE));
}(this, (function (exports,three) { 'use strict';

     /**
      * An enumeration of CSG operation types.
      *
      * @class OperationType
      * @submodule csg
      * @static
      */

     var OperationType = {

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

     var classCallCheck = function (instance, Constructor) {
       if (!(instance instanceof Constructor)) {
         throw new TypeError("Cannot call a class as a function");
       }
     };

     var createClass = function () {
       function defineProperties(target, props) {
         for (var i = 0; i < props.length; i++) {
           var descriptor = props[i];
           descriptor.enumerable = descriptor.enumerable || false;
           descriptor.configurable = true;
           if ("value" in descriptor) descriptor.writable = true;
           Object.defineProperty(target, descriptor.key, descriptor);
         }
       }

       return function (Constructor, protoProps, staticProps) {
         if (protoProps) defineProperties(Constructor.prototype, protoProps);
         if (staticProps) defineProperties(Constructor, staticProps);
         return Constructor;
       };
     }();







     var get = function get(object, property, receiver) {
       if (object === null) object = Function.prototype;
       var desc = Object.getOwnPropertyDescriptor(object, property);

       if (desc === undefined) {
         var parent = Object.getPrototypeOf(object);

         if (parent === null) {
           return undefined;
         } else {
           return get(parent, property, receiver);
         }
       } else if ("value" in desc) {
         return desc.value;
       } else {
         var getter = desc.get;

         if (getter === undefined) {
           return undefined;
         }

         return getter.call(receiver);
       }
     };

     var inherits = function (subClass, superClass) {
       if (typeof superClass !== "function" && superClass !== null) {
         throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
       }

       subClass.prototype = Object.create(superClass && superClass.prototype, {
         constructor: {
           value: subClass,
           enumerable: false,
           writable: true,
           configurable: true
         }
       });
       if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
     };











     var possibleConstructorReturn = function (self, call) {
       if (!self) {
         throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
       }

       return call && (typeof call === "object" || typeof call === "function") ? call : self;
     };



















     var toConsumableArray = function (arr) {
       if (Array.isArray(arr)) {
         for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

         return arr2;
       } else {
         return Array.from(arr);
       }
     };

     /**
      * An operation history.
      *
      * @class History
      * @submodule core
      * @constructor
      */

     var History = function () {
     	function History() {
     		classCallCheck(this, History);


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

     	createClass(History, [{
     		key: "push",
     		value: function push(sdf) {

     			return this.elements.push(sdf);
     		}

     		/**
        * Removes the SDF that was last added to the history and returns it.
        *
        * @method pop
        * @return {SignedDistanceFunction} An SDF.
        */

     	}, {
     		key: "pop",
     		value: function pop() {

     			return this.elements.pop();
     		}

     		/**
        * Combines all operations into one.
        *
        * @method combine
        * @return {SignedDistanceFunction} An SDF consisting of all past operations, or null if there are none.
        */

     	}, {
     		key: "combine",
     		value: function combine() {

     			var elements = this.elements;

     			var a = null;
     			var b = null;

     			var i = void 0,
     			    l = void 0;

     			for (i = 0, l = elements.length; i < l; ++i) {

     				b = elements[i];

     				if (a !== null) {

     					switch (b.operation) {

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

     			return a;
     		}

     		/**
        * Clears this history.
        *
        * @method clear
        */

     	}, {
     		key: "clear",
     		value: function clear() {

     			this.elements = [];
     		}
     	}]);
     	return History;
     }();

     /**
      * A basic object queue.
      *
      * @class Queue
      * @submodule core
      * @constructor
      */

     var Queue = function () {
     		function Queue() {
     				classCallCheck(this, Queue);


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

     		createClass(Queue, [{
     				key: "add",
     				value: function add(element) {

     						var index = this.elements.length;

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

     		}, {
     				key: "remove",
     				value: function remove(index) {

     						var elements = this.elements;
     						var length = elements.length;

     						var element = null;

     						if (this.size > 0 && index >= 0 && index < length) {

     								element = elements[index];

     								if (element !== null) {

     										elements[index] = null;

     										--this.size;

     										if (this.size > 0) {

     												while (this.head < length && elements[this.head] === null) {

     														++this.head;
     												}

     												if (this.head === length) {

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

     		}, {
     				key: "peek",
     				value: function peek() {

     						return this.size > 0 ? this.elements[this.head] : null;
     				}

     				/**
          * Retrieves and removes the head of the queue, or returns null if the queue
          * is empty.
          *
          * @method poll
          * @return {Object} The head of the queue.
          */

     		}, {
     				key: "poll",
     				value: function poll() {

     						var elements = this.elements;
     						var length = elements.length;

     						var element = null;

     						if (this.size > 0) {

     								element = elements[this.head++];

     								while (this.head < length && elements[this.head] === null) {

     										++this.head;
     								}

     								if (this.head === length) {

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

     		}, {
     				key: "clear",
     				value: function clear() {

     						this.elements = [];
     						this.head = 0;
     						this.size = 0;
     				}
     		}]);
     		return Queue;
     }();

     /**
      * A queue that maintains elements in a hierarchy. Elements with a high priority
      * will be served before elements with a lower priority.
      *
      * @class PriorityQueue
      * @submodule core
      * @constructor
      * @param {Number} [tiers=1] - The number of priority tiers. The lowest tier represents the lowest priority.
      */

     var PriorityQueue = function (_Queue) {
     		inherits(PriorityQueue, _Queue);

     		function PriorityQueue() {
     				var tiers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
     				classCallCheck(this, PriorityQueue);

     				var _this = possibleConstructorReturn(this, (PriorityQueue.__proto__ || Object.getPrototypeOf(PriorityQueue)).call(this));

     				tiers = Math.max(1, tiers);

     				while (tiers-- > 0) {

     						_this.elements.push(new Queue());
     				}

     				return _this;
     		}

     		/**
        * The amount of priority tiers.
        *
        * @property tiers
        * @type Number
        */

     		createClass(PriorityQueue, [{
     				key: "add",


     				/**
          * Adds an element.
          *
          * @method add
          * @param {Object} element - The element.
          * @param {Number} [priority] - The priority of the element.
          * @return {Number} The index of the added element.
          */

     				value: function add(element, priority) {

     						var index = -1;

     						if (priority >= 0 && priority < this.elements.length) {

     								index = this.elements[priority].add(element);

     								if (priority > this.head) {

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

     		}, {
     				key: "remove",
     				value: function remove(index, priority) {

     						var element = null;

     						if (priority >= 0 && priority < this.elements.length) {

     								element = this.elements[priority].remove(index);

     								if (element !== null) {

     										--this.size;

     										while (this.head > 0 && this.elements[this.head].size === 0) {

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

     		}, {
     				key: "peek",
     				value: function peek() {

     						return this.size > 0 ? this.elements[this.head].peek() : null;
     				}

     				/**
          * Retrieves the head of the queue, or returns null if the queue is empty.
          *
          * @method poll
          * @return {Object} The head of the queue.
          */

     		}, {
     				key: "poll",
     				value: function poll() {

     						var element = null;

     						if (this.size > 0) {

     								element = this.elements[this.head].poll();

     								--this.size;

     								while (this.head > 0 && this.elements[this.head].size === 0) {

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

     		}, {
     				key: "clear",
     				value: function clear() {

     						var i = void 0;

     						for (i = this.elements.length - 1; i >= 0; --i) {

     								this.elements[i].clear();
     						}

     						this.head = 0;
     						this.size = 0;
     				}
     		}, {
     				key: "tiers",
     				get: function get$$1() {
     						return this.elements.length;
     				}
     		}]);
     		return PriorityQueue;
     }(Queue);

     /**
      * Run-Length Encoding for numeric data.
      *
      * @class RunLengthEncoder
      * @submodule core
      * @static
      */

     var RunLengthEncoder = function () {
     		function RunLengthEncoder() {
     				classCallCheck(this, RunLengthEncoder);
     		}

     		createClass(RunLengthEncoder, null, [{
     				key: "encode",


     				/**
          * Encodes the given data.
          *
          * @method encode
          * @static
          * @param {Array} array - The data to encode.
          * @return {Object} The run-lengths and the encoded data.
          */

     				value: function encode(array) {

     						var runLengths = [];
     						var data = [];

     						var previous = array[0];
     						var count = 1;

     						var i = void 0,
     						    l = void 0;

     						for (i = 1, l = array.length; i < l; ++i) {

     								if (previous !== array[i]) {

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
     								runLengths: runLengths,
     								data: data
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

     		}, {
     				key: "decode",
     				value: function decode(runLengths, data) {
     						var array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];


     						var element = void 0;

     						var i = void 0,
     						    j = void 0,
     						    il = void 0,
     						    jl = void 0;
     						var k = 0;

     						for (i = 0, il = data.length; i < il; ++i) {

     								element = data[i];

     								for (j = 0, jl = runLengths[i]; j < jl; ++j) {

     										array[k++] = element;
     								}
     						}

     						return array;
     				}
     		}]);
     		return RunLengthEncoder;
     }();

     /**
      * A task scheduler.
      *
      * @class Scheduler
      * @submodule core
      * @extends PriorityQueue
      * @constructor
      * @param {Number} tiers - The number of priority tiers.
      */

     var Scheduler = function (_PriorityQueue) {
     		inherits(Scheduler, _PriorityQueue);

     		function Scheduler(tiers) {
     				classCallCheck(this, Scheduler);

     				/**
          * Keeps track of associations between elements and tasks.
          *
          * @property registry
          * @type WeakMap
          * @private
          */

     				var _this = possibleConstructorReturn(this, (Scheduler.__proto__ || Object.getPrototypeOf(Scheduler)).call(this, tiers));

     				_this.registry = new WeakMap();

     				/**
          * The highest priority.
          *
          * @property maxPriority
          * @type Number
          */

     				_this.maxPriority = _this.tiers - 1;

     				return _this;
     		}

     		/**
        * Cancels the task that is currently scheduled for the given element.
        *
        * @method cancel
        * @param {Object} element - The element.
        * @return {Boolean} Whether the cancellation succeeded.
        */

     		createClass(Scheduler, [{
     				key: "cancel",
     				value: function cancel(element) {

     						var result = this.registry.has(element);

     						var task = void 0;

     						if (result) {

     								task = this.registry.get(element);

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

     		}, {
     				key: "schedule",
     				value: function schedule(element, task) {

     						var result = !this.registry.has(element);

     						if (result) {

     								if (task !== null) {

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

     		}, {
     				key: "hasTask",
     				value: function hasTask(element) {

     						return this.registry.has(element);
     				}

     				/**
          * Retrieves the task for the given element.
          *
          * @method getTask
          * @param {Object} element - The element.
          * @return {Task} The task or undefined if there is none.
          */

     		}, {
     				key: "getTask",
     				value: function getTask(element) {

     						return this.registry.get(element);
     				}

     				/**
          * Retrieves the head of the queue, or returns null if the queue is empty.
          *
          * @method poll
          * @return {Task} The task with the highest priority or null if there is none.
          */

     		}, {
     				key: "poll",
     				value: function poll() {

     						var element = get(Scheduler.prototype.__proto__ || Object.getPrototypeOf(Scheduler.prototype), "poll", this).call(this);

     						if (element !== null) {

     								this.registry.delete(element.chunk);
     						}

     						return element;
     				}

     				/**
          * Removes all tasks.
          *
          * @method clear
          */

     		}, {
     				key: "clear",
     				value: function clear() {

     						get(Scheduler.prototype.__proto__ || Object.getPrototypeOf(Scheduler.prototype), "clear", this).call(this);

     						this.registry = new WeakMap();
     				}
     		}]);
     		return Scheduler;
     }(PriorityQueue);

     /**
      * A task.
      *
      * @class Task
      * @submodule core
      * @constructor
      * @param {Number} [priority=0] - The priority.
      */

     var Task = function Task() {
     		var priority = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
     		classCallCheck(this, Task);


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
     };

     /**
      * A basic event.
      *
      * @class Event
      * @submodule events
      * @constructor
      * @param {String} type - The name of the event.
      */

     var Event = function Event(type) {
     	classCallCheck(this, Event);


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
     };

     /**
      * A base class for objects that can receive events and may have listeners for
      * them.
      *
      * @class EventTarget
      * @submodule events
      * @constructor
      */

     var EventTarget = function () {
     	function EventTarget() {
     		classCallCheck(this, EventTarget);


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

     	createClass(EventTarget, [{
     		key: "addEventListener",
     		value: function addEventListener(type, listener) {

     			var map = typeof listener === "function" ? this.m0 : this.m1;

     			if (map.has(type)) {

     				map.get(type).add(listener);
     			} else {

     				map.set(type, new Set([listener]));
     			}
     		}

     		/**
        * Removes an event handler of a specific event type from the event target.
        *
        * @method removeEventListener
        * @param {String} type - The event type to remove.
        * @param {Object} listener - The event listener to remove from the event target.
        */

     	}, {
     		key: "removeEventListener",
     		value: function removeEventListener(type, listener) {

     			var map = typeof listener === "function" ? this.m0 : this.m1;

     			var listeners = void 0;

     			if (map.has(type)) {

     				listeners = map.get(type);
     				listeners.delete(listener);

     				if (listeners.size === 0) {

     					map.delete(type);
     				}
     			}
     		}

     		/**
        * Dispatches an event at the specified event target, invoking the affected
        * event listeners in the appropriate order.
        *
        * @method dispatchEvent
        * @private
        * @param {Event} event - The event to dispatch.
        * @param {EventTarget} [target] - An event target.
        */

     	}, {
     		key: "dispatchEvent",
     		value: function dispatchEvent(event) {
     			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;


     			var m0 = target.m0;
     			var m1 = target.m1;

     			var listeners = void 0;
     			var listener = void 0;

     			event.target = target;

     			if (m0.has(event.type)) {

     				listeners = m0.get(event.type);

     				var _iteratorNormalCompletion = true;
     				var _didIteratorError = false;
     				var _iteratorError = undefined;

     				try {
     					for (var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
     						listener = _step.value;


     						listener.call(target, event);
     					}
     				} catch (err) {
     					_didIteratorError = true;
     					_iteratorError = err;
     				} finally {
     					try {
     						if (!_iteratorNormalCompletion && _iterator.return) {
     							_iterator.return();
     						}
     					} finally {
     						if (_didIteratorError) {
     							throw _iteratorError;
     						}
     					}
     				}
     			}

     			if (m1.has(event.type)) {

     				listeners = m1.get(event.type);

     				var _iteratorNormalCompletion2 = true;
     				var _didIteratorError2 = false;
     				var _iteratorError2 = undefined;

     				try {
     					for (var _iterator2 = listeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
     						listener = _step2.value;


     						listener.handleEvent(event);
     					}
     				} catch (err) {
     					_didIteratorError2 = true;
     					_iteratorError2 = err;
     				} finally {
     					try {
     						if (!_iteratorNormalCompletion2 && _iterator2.return) {
     							_iterator2.return();
     						}
     					} finally {
     						if (_didIteratorError2) {
     							throw _iteratorError2;
     						}
     					}
     				}
     			}
     		}
     	}]);
     	return EventTarget;
     }();

     /**
      * A collection of event classes.
      *
      * @module synthetic-event
      */

     var fragment = "#define PHYSICAL\r\n\r\nuniform vec3 diffuse;\r\nuniform vec3 emissive;\r\nuniform float roughness;\r\nuniform float metalness;\r\nuniform float opacity;\r\n\r\n#ifndef STANDARD\r\n\tuniform float clearCoat;\r\n\tuniform float clearCoatRoughness;\r\n#endif\r\n\r\nvarying vec3 vViewPosition;\r\n\r\n#ifndef FLAT_SHADED\r\n\r\n\tvarying vec3 vNormal;\r\n\r\n#endif\r\n\r\n#include <common>\r\n#include <packing>\r\n#include <color_pars_fragment>\r\n#include <map_triplanar_pars_fragment>\r\n#include <alphamap_pars_fragment>\r\n#include <specularmap_pars_fragment>\r\n#include <lightmap_pars_fragment>\r\n#include <emissivemap_pars_fragment>\r\n#include <envmap_pars_fragment>\r\n#include <fog_pars_fragment>\r\n#include <bsdfs>\r\n#include <cube_uv_reflection_fragment>\r\n#include <lights_pars>\r\n#include <lights_physical_pars_fragment>\r\n#include <shadowmap_pars_fragment>\r\n#include <triplanar_pars_fragment>\r\n#include <normalmap_triplanar_pars_fragment>\r\n#include <roughnessmap_pars_fragment>\r\n#include <metalnessmap_pars_fragment>\r\n#include <logdepthbuf_pars_fragment>\r\n#include <clipping_planes_pars_fragment>\r\n\r\nvoid main() {\r\n\r\n\t#include <clipping_planes_fragment>\r\n\r\n\tvec4 diffuseColor = vec4( diffuse, opacity );\r\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\r\n\tvec3 totalEmissiveRadiance = emissive;\r\n\r\n\t#include <logdepthbuf_fragment>\r\n\t#include <normal_flip>\r\n\t#include <normal_triplanar_fragment>\r\n\t#include <map_triplanar_fragment>\r\n\t#include <color_fragment>\r\n\t#include <alphamap_triplanar_fragment>\r\n\t#include <alphatest_fragment>\r\n\t#include <specularmap_triplanar_fragment>\r\n\t#include <roughnessmap_triplanar_fragment>\r\n\t#include <metalnessmap_triplanar_fragment>\r\n\t#include <emissivemap_triplanar_fragment>\r\n\r\n\t// accumulation\r\n\t#include <lights_physical_fragment>\r\n\t#include <lights_template>\r\n\r\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\r\n\r\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\r\n\r\n\t#include <premultiplied_alpha_fragment>\r\n\t#include <tonemapping_fragment>\r\n\t#include <encodings_fragment>\r\n\t#include <fog_fragment>\r\n\r\n}\r\n";

     var vertex = "#define PHYSICAL\r\n\r\nvarying vec3 vViewPosition;\r\n\r\n#ifndef FLAT_SHADED\r\n\r\n\tvarying vec3 vNormal;\r\n\r\n#endif\r\n\r\n#include <common>\r\n#include <uv_pars_vertex> // offsetRepeat\r\n#include <color_pars_vertex>\r\n#include <fog_pars_vertex>\r\n#include <morphtarget_pars_vertex>\r\n#include <skinning_pars_vertex>\r\n#include <shadowmap_pars_vertex>\r\n#include <logdepthbuf_pars_vertex>\r\n#include <clipping_planes_pars_vertex>\r\n#include <triplanar_pars_vertex>\r\n\r\nvoid main() {\r\n\r\n\t#include <color_vertex>\r\n\r\n\t#include <beginnormal_vertex>\r\n\t#include <morphnormal_vertex>\r\n\t#include <skinbase_vertex>\r\n\t#include <skinnormal_vertex>\r\n\t#include <defaultnormal_vertex>\r\n\r\n#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\r\n\r\n\tvNormal = normalize( transformedNormal );\r\n\r\n#endif\r\n\r\n\t#include <begin_vertex>\r\n\t#include <morphtarget_vertex>\r\n\t#include <skinning_vertex>\r\n\t#include <project_vertex>\r\n\t#include <logdepthbuf_vertex>\r\n\t#include <clipping_planes_vertex>\r\n\r\n\tvViewPosition = - mvPosition.xyz;\r\n\r\n\t#include <worldpos_vertex>\r\n\t#include <shadowmap_vertex>\r\n\t#include <fog_vertex>\r\n\t#include <triplanar_vertex>\r\n\r\n}\r\n";

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

     var MeshTriplanarPhysicalMaterial = function (_ShaderMaterial) {
     		inherits(MeshTriplanarPhysicalMaterial, _ShaderMaterial);

     		function MeshTriplanarPhysicalMaterial() {
     				classCallCheck(this, MeshTriplanarPhysicalMaterial);

     				// Clone uniforms to avoid conflicts with built-in materials.
     				var _this = possibleConstructorReturn(this, (MeshTriplanarPhysicalMaterial.__proto__ || Object.getPrototypeOf(MeshTriplanarPhysicalMaterial)).call(this, {

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

     				}));

     				var source = three.ShaderLib.physical.uniforms;
     				var target = _this.uniforms;

     				Object.keys(source).forEach(function (key) {

     						var value = source[key].value;
     						var uniform = new three.Uniform(value);

     						Object.defineProperty(target, key, {

     								value: value === null ? uniform : uniform.clone()

     						});
     				});

     				/**
          * An environment map.
          *
          * @property envMap
          * @type Texture
          */

     				_this.envMap = null;

     				return _this;
     		}

     		/**
        * Defines up to three diffuse maps.
        *
        * @method setMaps
        * @param {Texture} [mapX] - The map to use for the X plane.
        * @param {Texture} [mapY] - The map to use for the Y plane.
        * @param {Texture} [mapZ] - The map to use for the Z plane.
        */

     		createClass(MeshTriplanarPhysicalMaterial, [{
     				key: "setMaps",
     				value: function setMaps(mapX, mapY, mapZ) {

     						var defines = this.defines;
     						var uniforms = this.uniforms;

     						if (mapX !== undefined) {

     								defines.USE_MAP = "";
     								uniforms.map.value = mapX;
     						}

     						if (mapY !== undefined) {

     								defines.USE_MAP_Y = "";
     								uniforms.mapY.value = mapY;
     						}

     						if (mapZ !== undefined) {

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

     		}, {
     				key: "setNormalMaps",
     				value: function setNormalMaps(mapX, mapY, mapZ) {

     						var defines = this.defines;
     						var uniforms = this.uniforms;

     						if (mapX !== undefined) {

     								defines.USE_NORMALMAP = "";
     								uniforms.normalMap.value = mapX;
     						}

     						if (mapY !== undefined) {

     								defines.USE_NORMALMAP_Y = "";
     								uniforms.normalMapY.value = mapY;
     						}

     						if (mapZ !== undefined) {

     								defines.USE_NORMALMAP_Z = "";
     								uniforms.normalMapZ.value = mapZ;
     						}

     						this.needsUpdate = true;
     				}
     		}]);
     		return MeshTriplanarPhysicalMaterial;
     }(three.ShaderMaterial);

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

     var Vector3$1 = function () {
     	function Vector3$$1() {
     		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
     		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
     		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
     		classCallCheck(this, Vector3$$1);


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

     	createClass(Vector3$$1, [{
     		key: "set",
     		value: function set$$1(x, y, z) {

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

     	}, {
     		key: "copy",
     		value: function copy(v) {

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

     	}, {
     		key: "fromArray",
     		value: function fromArray(array) {
     			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


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

     	}, {
     		key: "toArray",
     		value: function toArray$$1() {
     			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
     			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


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

     	}, {
     		key: "equals",
     		value: function equals(v) {

     			return v.x === this.x && v.y === this.y && v.z === this.z;
     		}

     		/**
        * Clones this vector.
        *
        * @method clone
        * @return {Vector3} A clone of this vector.
        */

     	}, {
     		key: "clone",
     		value: function clone() {

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

     	}, {
     		key: "add",
     		value: function add(v) {

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

     	}, {
     		key: "addScaledVector",
     		value: function addScaledVector(v, s) {

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

     	}, {
     		key: "addScalar",
     		value: function addScalar(s) {

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

     	}, {
     		key: "addVectors",
     		value: function addVectors(a, b) {

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

     	}, {
     		key: "sub",
     		value: function sub(v) {

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

     	}, {
     		key: "subScalar",
     		value: function subScalar(s) {

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

     	}, {
     		key: "subVectors",
     		value: function subVectors(a, b) {

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

     	}, {
     		key: "multiply",
     		value: function multiply(v) {

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

     	}, {
     		key: "multiplyScalar",
     		value: function multiplyScalar(s) {

     			if (isFinite(s)) {

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

     	}, {
     		key: "multiplyVectors",
     		value: function multiplyVectors(a, b) {

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

     	}, {
     		key: "divide",
     		value: function divide(v) {

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

     	}, {
     		key: "divideScalar",
     		value: function divideScalar(s) {

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

     	}, {
     		key: "divideVectors",
     		value: function divideVectors(a, b) {

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

     	}, {
     		key: "negate",
     		value: function negate() {

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

     	}, {
     		key: "dot",
     		value: function dot(v) {

     			return this.x * v.x + this.y * v.y + this.z * v.z;
     		}

     		/**
        * Calculates the squared length of this vector.
        *
        * @method lengthSq
        * @return {Number} The squared length.
        */

     	}, {
     		key: "lengthSq",
     		value: function lengthSq() {

     			return this.x * this.x + this.y * this.y + this.z * this.z;
     		}

     		/**
        * Calculates the length of this vector.
        *
        * @method length
        * @return {Number} The length.
        */

     	}, {
     		key: "length",
     		value: function length() {

     			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
     		}

     		/**
        * Calculates the distance to a given vector.
        *
        * @method distanceTo
        * @param {Vector3} v - A vector.
        * @return {Number} The distance.
        */

     	}, {
     		key: "distanceTo",
     		value: function distanceTo(v) {

     			return Math.sqrt(this.distanceToSquared(v));
     		}

     		/**
        * Calculates the squared distance to a given vector.
        *
        * @method distanceToSquared
        * @param {Vector3} v - A vector.
        * @return {Number} The squared distance.
        */

     	}, {
     		key: "distanceToSquared",
     		value: function distanceToSquared(v) {

     			var dx = this.x - v.x;
     			var dy = this.y - v.y;
     			var dz = this.z - v.z;

     			return dx * dx + dy * dy + dz * dz;
     		}

     		/**
        * Normalizes this vector.
        *
        * @method normalize
        * @chainable
        * @return {Vector3} This vector.
        */

     	}, {
     		key: "normalize",
     		value: function normalize() {

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

     	}, {
     		key: "min",
     		value: function min(v) {

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

     	}, {
     		key: "max",
     		value: function max(v) {

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

     	}, {
     		key: "clamp",
     		value: function clamp(min, max) {

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

     	}, {
     		key: "applyMatrix3",
     		value: function applyMatrix3(m) {

     			var x = this.x,
     			    y = this.y,
     			    z = this.z;
     			var e = m.elements;

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

     	}, {
     		key: "applyMatrix4",
     		value: function applyMatrix4(m) {

     			var x = this.x,
     			    y = this.y,
     			    z = this.z;
     			var e = m.elements;

     			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
     			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
     			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

     			return this;
     		}
     	}]);
     	return Vector3$$1;
     }();

     /**
      * An octant.
      *
      * @class Octant
      * @submodule core
      * @constructor
      * @param {Vector3} min - The lower bounds.
      * @param {Vector3} max - The upper bounds.
      */

     var Octant = function () {
     	function Octant() {
     		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
     		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
     		classCallCheck(this, Octant);


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

     	createClass(Octant, [{
     		key: "getCenter",
     		value: function getCenter() {
     			return this.min.clone().add(this.max).multiplyScalar(0.5);
     		}

     		/**
        * Computes the size of this octant.
        *
        * @method getDimensions
        * @return {Vector3} A new vector that describes the size of this octant.
        */

     	}, {
     		key: "getDimensions",
     		value: function getDimensions() {
     			return this.max.clone().sub(this.min);
     		}

     		/**
        * Splits this octant into eight smaller ones.
        *
        * @method split
        * @param {Array} [octants] - A list of octants to recycle.
        */

     	}, {
     		key: "split",
     		value: function split(octants) {

     			var min = this.min;
     			var max = this.max;
     			var mid = this.getCenter();

     			var i = void 0,
     			    j = void 0;
     			var l = 0;
     			var combination = void 0;

     			var halfDimensions = void 0;
     			var v = void 0,
     			    child = void 0,
     			    octant = void 0;

     			if (Array.isArray(octants)) {

     				halfDimensions = this.getDimensions().multiplyScalar(0.5);
     				v = [new Vector3$1(), new Vector3$1(), new Vector3$1()];
     				l = octants.length;
     			}

     			this.children = [];

     			for (i = 0; i < 8; ++i) {

     				combination = PATTERN[i];
     				octant = null;

     				if (l > 0) {

     					v[1].addVectors(min, v[0].fromArray(combination).multiply(halfDimensions));
     					v[2].addVectors(mid, v[0].fromArray(combination).multiply(halfDimensions));

     					// Find an octant that matches the current combination.
     					for (j = 0; j < l; ++j) {

     						child = octants[j];

     						if (child !== null && v[1].equals(child.min) && v[2].equals(child.max)) {

     							octant = child;
     							octants[j] = null;

     							break;
     						}
     					}
     				}

     				this.children.push(octant !== null ? octant : new this.constructor(new Vector3$1(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3$1(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z)));
     			}
     		}
     	}]);
     	return Octant;
     }();

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

     var PATTERN = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

     /**
      * Describes all possible octant corner connections.
      *
      * @property EDGES
      * @type Array
      * @static
      * @final
      */

     var EDGES = [

     // X-Axis.
     new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]),

     // Y-Axis.
     new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]),

     // Z-Axis.
     new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

     /**
      * A cubic octant.
      *
      * @class CubicOctant
      * @submodule core
      * @constructor
      * @param {Vector3} min - The lower bounds.
      * @param {Number} [size=0] - The size of the octant.
      */

     var CubicOctant = function () {
     		function CubicOctant() {
     				var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
     				var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
     				classCallCheck(this, CubicOctant);


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

     		createClass(CubicOctant, [{
     				key: "getCenter",


     				/**
          * Computes the center of this octant.
          *
          * @method getCenter
          * @return {Vector3} A new vector that describes the center of this octant.
          */

     				value: function getCenter() {
     						return this.min.clone().addScalar(this.size * 0.5);
     				}

     				/**
          * Returns the size of this octant as a vector.
          *
          * @method getDimensions
          * @return {Vector3} A new vector that describes the size of this octant.
          */

     		}, {
     				key: "getDimensions",
     				value: function getDimensions() {
     						return new Vector3$1(this.size, this.size, this.size);
     				}

     				/**
          * Splits this octant into eight smaller ones.
          *
          * @method split
          * @param {Array} [octants] - A list of octants to recycle.
          */

     		}, {
     				key: "split",
     				value: function split(octants) {

     						var min = this.min;
     						var mid = this.getCenter();
     						var halfSize = this.size * 0.5;

     						var i = void 0,
     						    j = void 0;
     						var l = 0;
     						var combination = void 0;

     						var v = void 0,
     						    child = void 0,
     						    octant = void 0;

     						if (Array.isArray(octants)) {

     								v = new Vector3$1();
     								l = octants.length;
     						}

     						this.children = [];

     						for (i = 0; i < 8; ++i) {

     								combination = PATTERN[i];
     								octant = null;

     								if (l > 0) {

     										v.fromArray(combination).multiplyScalar(halfSize).add(min);

     										// Find an octant that matches the current combination.
     										for (j = 0; j < l; ++j) {

     												child = octants[j];

     												if (child !== null && child.size === halfSize && v.equals(child.min)) {

     														octant = child;
     														octants[j] = null;

     														break;
     												}
     										}
     								}

     								this.children.push(octant !== null ? octant : new this.constructor(new Vector3$1(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize));
     						}
     				}
     		}, {
     				key: "max",
     				get: function get$$1() {
     						return this.min.clone().addScalar(this.size);
     				}
     		}]);
     		return CubicOctant;
     }();

     /**
      * A bounding box.
      *
      * @class Box3
      * @submodule math
      * @constructor
      * @param {Vector3} [min] - The lower bounds.
      * @param {Vector3} [max] - The upper bounds.
      */

     var Box3$1 = function () {
     	function Box3$$1() {
     		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1(Infinity, Infinity, Infinity);
     		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1(-Infinity, -Infinity, -Infinity);
     		classCallCheck(this, Box3$$1);


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

     	createClass(Box3$$1, [{
     		key: "set",
     		value: function set$$1(min, max) {

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

     	}, {
     		key: "copy",
     		value: function copy(b) {

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

     	}, {
     		key: "clone",
     		value: function clone() {

     			return new this.constructor().copy(this);
     		}

     		/**
        * Expands this box by the given point.
        *
        * @method expandByPoint
        * @param {Matrix3} p - A point.
        * @return {Box3} This box.
        */

     	}, {
     		key: "expandByPoint",
     		value: function expandByPoint(p) {

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

     	}, {
     		key: "union",
     		value: function union(b) {

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

     	}, {
     		key: "setFromPoints",
     		value: function setFromPoints(points) {

     			var i = void 0,
     			    l = void 0;

     			for (i = 0, l = points.length; i < l; ++i) {

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

     	}, {
     		key: "setFromCenterAndSize",
     		value: function setFromCenterAndSize(center, size) {

     			var halfSize = size.clone().multiplyScalar(0.5);

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

     	}, {
     		key: "intersectsBox",
     		value: function intersectsBox(box) {

     			return !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);
     		}
     	}]);
     	return Box3$$1;
     }();

     /**
      * A basic iterator result.
      *
      * The next method of an iterator always has to return an object with
      * appropriate properties including done and value.
      *
      * @class IteratorResult
      * @constructor
      * @param {Vector3} [value=null] - A value.
      * @param {Vector3} [done=false] - Whether this result is past the end of the iterated sequence.
      */

     var IteratorResult = function () {
     	function IteratorResult() {
     		var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
     		var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
     		classCallCheck(this, IteratorResult);


     		/**
        * An arbitrary value returned by the iterator.
        *
        * @property value
        * @type Object
        * @default null
        */

     		this.value = value;

     		/**
        * Whether this result is past the end of the iterated sequence.
        *
        * @property done
        * @type Boolean
        * @default false
        */

     		this.done = done;
     	}

     	/**
       * Resets this iterator result.
       *
       * @method reset
       */

     	createClass(IteratorResult, [{
     		key: "reset",
     		value: function reset() {

     			this.value = null;
     			this.done = false;
     		}
     	}]);
     	return IteratorResult;
     }();

     /**
      * A computation helper.
      *
      * @property BOX3
      * @type Box3
      * @private
      * @static
      * @final
      */

     var BOX3$3 = new Box3$1();

     /**
      * An octree iterator.
      *
      * @class OctreeIterator
      * @submodule core
      * @implements Iterator
      * @constructor
      * @param {Octree} octree - An octree.
      * @param {Frustum|Box3} [region] - A cull region.
      */

     var OctreeIterator = function () {
     		function OctreeIterator(octree) {
     				var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
     				classCallCheck(this, OctreeIterator);


     				/**
          * The octree.
          *
          * @property octree
          * @type Octree
          * @private
          */

     				this.octree = octree;

     				/**
          * A region used for octree culling.
          *
          * @property region
          * @type Frustum|Box3
          */

     				this.region = region;

     				/**
          * Whether this iterator should respect the cull region.
          *
          * @property cull
          * @type Boolean
          * @default false
          */

     				this.cull = region !== null;

     				/**
          * An iterator result.
          *
          * @property result
          * @type IteratorResult
          * @private
          */

     				this.result = new IteratorResult();

     				/**
          * An octant trace.
          *
          * @property trace
          * @type Array
          * @private
          */

     				this.trace = null;

     				/**
          * Iteration indices.
          *
          * @property indices
          * @type Array
          * @private
          */

     				this.indices = null;

     				this.reset();
     		}

     		/**
        * Resets this iterator.
        *
        * @method reset
        * @chainable
        * @return {OctreeIterator} This iterator.
        */

     		createClass(OctreeIterator, [{
     				key: "reset",
     				value: function reset() {

     						var root = this.octree.root;

     						this.trace = [];
     						this.indices = [];

     						if (root !== null) {

     								BOX3$3.min = root.min;
     								BOX3$3.max = root.max;

     								if (!this.cull || this.region.intersectsBox(BOX3$3)) {

     										this.trace.push(root);
     										this.indices.push(0);
     								}
     						}

     						this.result.reset();

     						return this;
     				}

     				/**
          * Iterates over the leaf octants.
          *
          * @method next
          * @return {IteratorResult} The next leaf octant.
          */

     		}, {
     				key: "next",
     				value: function next() {

     						var cull = this.cull;
     						var region = this.region;
     						var indices = this.indices;
     						var trace = this.trace;

     						var octant = null;
     						var depth = trace.length - 1;

     						var index = void 0,
     						    children = void 0,
     						    child = void 0;

     						while (octant === null && depth >= 0) {

     								index = indices[depth];
     								children = trace[depth].children;

     								++indices[depth];

     								if (index < 8) {

     										if (children !== null) {

     												child = children[index];

     												if (cull) {

     														BOX3$3.min = child.min;
     														BOX3$3.max = child.max;

     														if (!region.intersectsBox(BOX3$3)) {

     																// Cull this octant.
     																continue;
     														}
     												}

     												trace.push(child);
     												indices.push(0);

     												++depth;
     										} else {

     												octant = trace.pop();
     												indices.pop();
     										}
     								} else {

     										trace.pop();
     										indices.pop();

     										--depth;
     								}
     						}

     						this.result.value = octant;
     						this.result.done = octant === null;

     						return this.result;
     				}

     				/**
          * Called when this iterator will no longer be run to completion.
          *
          * @method return
          * @param {Object} value - An interator result value.
          * @return {IteratorResult} - A premature completion result.
          */

     		}, {
     				key: "return",
     				value: function _return(value) {

     						this.result.value = value;
     						this.result.done = true;

     						return this.result;
     				}

     				/**
          * Returns this iterator.
          *
          * @method Symbol.iterator
          * @return {VoxelIterator} An iterator.
          */

     		}, {
     				key: Symbol.iterator,
     				value: function value() {

     						return this;
     				}
     		}]);
     		return OctreeIterator;
     }();

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

     var flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

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

     var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

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

     	var entry = 0;

     	// Find the entry plane.
     	if (tx0 > ty0 && tx0 > tz0) {

     		// YZ-plane.
     		if (tym < tx0) {
     			entry = entry | 2;
     		}
     		if (tzm < tx0) {
     			entry = entry | 1;
     		}
     	} else if (ty0 > tz0) {

     		// XZ-plane.
     		if (txm < ty0) {
     			entry = entry | 4;
     		}
     		if (tzm < ty0) {
     			entry = entry | 1;
     		}
     	} else {

     		// XY-plane.
     		if (txm < tz0) {
     			entry = entry | 4;
     		}
     		if (tym < tz0) {
     			entry = entry | 2;
     		}
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

     	var min = void 0;
     	var exit = 0;

     	// Find the exit plane.
     	if (tx1 < ty1) {

     		min = tx1;
     		exit = 0; // YZ-plane.
     	} else {

     		min = ty1;
     		exit = 1; // XZ-plane.
     	}

     	if (tz1 < min) {

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

     	var children = octant.children;

     	var currentOctant = void 0;
     	var txm = void 0,
     	    tym = void 0,
     	    tzm = void 0;

     	if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

     		if (children === null) {

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

     				switch (currentOctant) {

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
     			} while (currentOctant < 8);
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

     var OctreeRaycaster = function () {
     	function OctreeRaycaster() {
     		classCallCheck(this, OctreeRaycaster);
     	}

     	createClass(OctreeRaycaster, null, [{
     		key: "intersectOctree",


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

     		value: function intersectOctree(octree, raycaster, intersects) {

     			var dimensions = octree.getDimensions();
     			var halfDimensions = dimensions.clone().multiplyScalar(0.5);

     			// Translate the octree extents to the center of the octree.
     			var min = octree.min.clone().sub(octree.min);
     			var max = octree.max.clone().sub(octree.min);

     			var direction = raycaster.ray.direction.clone();
     			var origin = raycaster.ray.origin.clone();

     			// Translate the ray to the center of the octree.
     			origin.sub(octree.getCenter()).add(halfDimensions);

     			var invDirX = void 0,
     			    invDirY = void 0,
     			    invDirZ = void 0;
     			var tx0 = void 0,
     			    tx1 = void 0,
     			    ty0 = void 0,
     			    ty1 = void 0,
     			    tz0 = void 0,
     			    tz1 = void 0;

     			// Reset the last byte.
     			flags[8] = flags[0];

     			// Handle rays with negative directions.
     			if (direction.x < 0.0) {

     				origin.x = dimensions.x - origin.x;
     				direction.x = -direction.x;
     				flags[8] |= flags[4];
     			}

     			if (direction.y < 0.0) {

     				origin.y = dimensions.y - origin.y;
     				direction.y = -direction.y;
     				flags[8] |= flags[2];
     			}

     			if (direction.z < 0.0) {

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
     			if (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {

     				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);
     			}
     		}
     	}]);
     	return OctreeRaycaster;
     }();

     /**
      * A computation helper.
      *
      * @property BOX3
      * @type Box3
      * @private
      * @static
      * @final
      */

     var BOX3$2 = new Box3$1();

     /**
      * Recursively calculates the depth of the given octree.
      *
      * @method getDepth
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @return {Number} The depth.
      */

     function _getDepth(octant) {

     	var children = octant.children;

     	var result = 0;
     	var i = void 0,
     	    l = void 0,
     	    d = void 0;

     	if (children !== null) {

     		for (i = 0, l = children.length; i < l; ++i) {

     			d = 1 + _getDepth(children[i]);

     			if (d > result) {

     				result = d;
     			}
     		}
     	}

     	return result;
     }

     /**
      * Recursively collects octants that lie inside the specified region.
      *
      * @method cull
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @param {Frustum|Box3} region - A region.
      * @param {Array} result - A list to be filled with octants that intersect with the region.
      */

     function _cull(octant, region, result) {

     	var children = octant.children;

     	var i = void 0,
     	    l = void 0;

     	BOX3$2.min = octant.min;
     	BOX3$2.max = octant.max;

     	if (region.intersectsBox(BOX3$2)) {

     		if (children !== null) {

     			for (i = 0, l = children.length; i < l; ++i) {

     				_cull(children[i], region, result);
     			}
     		} else {

     			result.push(octant);
     		}
     	}
     }

     /**
      * Recursively fetches all octants with the specified depth level.
      *
      * @method findOctantsByLevel
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @param {Number} level - The target depth level.
      * @param {Number} depth - The current depth level.
      * @param {Array} result - A list to be filled with the identified octants.
      */

     function _findOctantsByLevel(octant, level, depth, result) {

     	var children = octant.children;

     	var i = void 0,
     	    l = void 0;

     	if (depth === level) {

     		result.push(octant);
     	} else if (children !== null) {

     		++depth;

     		for (i = 0, l = children.length; i < l; ++i) {

     			_findOctantsByLevel(children[i], level, depth, result);
     		}
     	}
     }

     /**
      * An octree that subdivides space for fast spatial searches.
      *
      * @class Octree
      * @submodule core
      * @implements Iterable
      * @constructor
      * @param {Vector3} [min] - The lower bounds of the tree.
      * @param {Vector3} [max] - The upper bounds of the tree.
      */

     var Octree = function () {
     	function Octree(min, max) {
     		classCallCheck(this, Octree);


     		/**
        * The root octant.
        *
        * @property root
        * @type Octant
        * @default null
        */

     		this.root = min !== undefined && max !== undefined ? new Octant(min, max) : null;
     	}

     	/**
       * The lower bounds of the root octant.
       *
       * @property min
       * @type Vector3
       */

     	createClass(Octree, [{
     		key: "getCenter",


     		/**
        * Calculates the center of this octree.
        *
        * @method getCenter
        * @return {Vector3} A new vector that describes the center of this octree.
        */

     		value: function getCenter() {
     			return this.root.getCenter();
     		}

     		/**
        * Calculates the size of this octree.
        *
        * @method getDimensions
        * @return {Vector3} A new vector that describes the size of this octree.
        */

     	}, {
     		key: "getDimensions",
     		value: function getDimensions() {
     			return this.root.getDimensions();
     		}

     		/**
        * Calculates the current depth of this octree.
        *
        * @method getDepth
        * @return {Number} The depth.
        */

     	}, {
     		key: "getDepth",
     		value: function getDepth() {

     			return _getDepth(this.root);
     		}

     		/**
        * Recursively collects octants that intersect with the specified region.
        *
        * @method cull
        * @param {Frustum|Box3} region - A region.
        * @return {Array} The octants.
        */

     	}, {
     		key: "cull",
     		value: function cull(region) {

     			var result = [];

     			_cull(this.root, region, result);

     			return result;
     		}

     		/**
        * Fetches all octants with the specified depth level.
        *
        * @method findOctantsByLevel
        * @param {Number} level - The depth level.
        * @return {Array} The octants.
        */

     	}, {
     		key: "findOctantsByLevel",
     		value: function findOctantsByLevel(level) {

     			var result = [];

     			_findOctantsByLevel(this.root, level, 0, result);

     			return result;
     		}

     		/**
        * Finds the octants that intersect with the given ray. The intersecting
        * octants are sorted by distance, closest first.
        *
        * @method raycast
        * @param {Raycaster} raycaster - A raycaster.
        * @param {Array} [intersects] - A list to be filled with intersecting octants.
        * @return {Array} The intersecting octants.
        */

     	}, {
     		key: "raycast",
     		value: function raycast(raycaster) {
     			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


     			OctreeRaycaster.intersectOctree(this, raycaster, intersects);

     			return intersects;
     		}

     		/**
        * Returns an iterator that traverses the octree and returns leaf nodes.
        *
        * When a cull region is provided, the iterator will only return leaves that
        * intersect with that region.
        *
        * @method leaves
        * @param {Frustum|Box3} [region] - A cull region.
        * @return {OctreeIterator} An iterator.
        */

     	}, {
     		key: "leaves",
     		value: function leaves(region) {

     			return new OctreeIterator(this, region);
     		}

     		/**
        * Returns an iterator that traverses the octree and returns all leaf nodes.
        *
        * @method Symbol.iterator
        * @return {OctreeIterator} An iterator.
        */

     	}, {
     		key: Symbol.iterator,
     		value: function value() {

     			return new OctreeIterator(this);
     		}
     	}, {
     		key: "min",
     		get: function get$$1() {
     			return this.root.min;
     		}

     		/**
        * The upper bounds of the root octant.
        *
        * @property max
        * @type Vector3
        */

     	}, {
     		key: "max",
     		get: function get$$1() {
     			return this.root.max;
     		}

     		/**
        * The children of the root octant.
        *
        * @property children
        * @type Array
        */

     	}, {
     		key: "children",
     		get: function get$$1() {
     			return this.root.children;
     		}
     	}]);
     	return Octree;
     }();

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

     var PointOctant = function (_Octant) {
     		inherits(PointOctant, _Octant);

     		function PointOctant(min, max) {
     				classCallCheck(this, PointOctant);

     				/**
          * The points that are inside this octant.
          *
          * @property points
          * @type Array
          */

     				var _this = possibleConstructorReturn(this, (PointOctant.__proto__ || Object.getPrototypeOf(PointOctant)).call(this, min, max));

     				_this.points = null;

     				/**
          * Point data.
          *
          * @property data
          * @type Array
          */

     				_this.data = null;

     				return _this;
     		}

     		/**
        * Computes the distance squared from this octant to the given point.
        *
        * @method distanceToSquared
        * @param {Vector3} p - A point.
        * @return {Number} The distance squared.
        */

     		createClass(PointOctant, [{
     				key: "distanceToSquared",
     				value: function distanceToSquared(p) {

     						var clampedPoint = p.clone().clamp(this.min, this.max);

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

     		}, {
     				key: "distanceToCenterSquared",
     				value: function distanceToCenterSquared(p) {

     						var center = this.getCenter();

     						var dx = p.x - center.x;
     						var dy = p.y - center.x;
     						var dz = p.z - center.z;

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

     		}, {
     				key: "contains",
     				value: function contains(p, bias) {

     						var min = this.min;
     						var max = this.max;

     						return p.x >= min.x - bias && p.y >= min.y - bias && p.z >= min.z - bias && p.x <= max.x + bias && p.y <= max.y + bias && p.z <= max.z + bias;
     				}

     				/**
          * Redistributes existing points to child octants.
          *
          * @method redistribute
          * @param {Number} bias - A proximity threshold.
          */

     		}, {
     				key: "redistribute",
     				value: function redistribute(bias) {

     						var children = this.children;
     						var points = this.points;
     						var data = this.data;

     						var i = void 0,
     						    l = void 0;
     						var child = void 0,
     						    point = void 0,
     						    entry = void 0;

     						if (children !== null) {

     								while (points.length > 0) {

     										point = points.pop();
     										entry = data.pop();

     										for (i = 0, l = children.length; i < l; ++i) {

     												child = children[i];

     												if (child.contains(point, bias)) {

     														if (child.points === null) {

     																child.points = [];
     																child.data = [];
     														}

     														child.points.push(point);
     														child.data.push(entry);

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

     		}, {
     				key: "merge",
     				value: function merge() {

     						var children = this.children;

     						var i = void 0,
     						    l = void 0;
     						var child = void 0;

     						if (children !== null) {

     								this.points = [];
     								this.data = [];

     								for (i = 0, l = children.length; i < l; ++i) {

     										child = children[i];

     										if (child.points !== null) {
     												var _points, _data;

     												(_points = this.points).push.apply(_points, toConsumableArray(child.points));
     												(_data = this.data).push.apply(_data, toConsumableArray(child.data));
     										}
     								}

     								this.children = null;
     						}
     				}
     		}]);
     		return PointOctant;
     }(Octant);

     /**
      * Recursively counts how many points are in the given octree.
      *
      * @method countPoints
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @return {Number} The amount of points.
      */

     function _countPoints(octant) {

     	var children = octant.children;

     	var result = 0;
     	var i = void 0,
     	    l = void 0;

     	if (children !== null) {

     		for (i = 0, l = children.length; i < l; ++i) {

     			result += _countPoints(children[i]);
     		}
     	} else if (octant.points !== null) {

     		result = octant.points.length;
     	}

     	return result;
     }

     /**
      * Recursively adds a point to the octree.
      *
      * @method add
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @param {Vector3} p - A point.
      * @param {Object} data - An object that the point represents.
      * @param {Number} depth - The current depth.
      * @param {Number} bias - A threshold for proximity checks.
      * @param {Number} maxPoints - Number of distinct points per octant before it splits up.
      * @param {Number} maxDepth - The maximum tree depth level, starting at 0.
      */

     function _add(octant, p, data, depth, bias, maxPoints, maxDepth) {

     	var children = octant.children;
     	var exists = false;
     	var done = false;
     	var i = void 0,
     	    l = void 0;

     	if (octant.contains(p, bias)) {

     		if (children === null) {

     			if (octant.points === null) {

     				octant.points = [];
     				octant.data = [];
     			} else {

     				for (i = 0, l = octant.points.length; !exists && i < l; ++i) {

     					exists = octant.points[i].equals(p);
     				}
     			}

     			if (exists) {

     				octant.data[i - 1] = data;

     				done = true;
     			} else if (octant.points.length < maxPoints || depth === maxDepth) {

     				octant.points.push(p.clone());
     				octant.data.push(data);

     				done = true;
     			} else {

     				octant.split();
     				octant.redistribute(bias);
     				children = octant.children;
     			}
     		}

     		if (children !== null) {

     			++depth;

     			for (i = 0, l = children.length; !done && i < l; ++i) {

     				done = _add(children[i], p, data, depth, bias, maxPoints, maxDepth);
     			}
     		}
     	}

     	return done;
     }

     /**
      * Recursively finds a point in the octree and removes it.
      *
      * @method remove
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @param {Octant} parent - The parent of the octant.
      * @param {Vector3} p - A point.
      * @param {Number} bias - A threshold for proximity checks.
      * @param {Number} maxPoints - Number of distinct points per octant before it splits up.
      */

     function _remove(octant, parent, p, bias, maxPoints) {

     	var children = octant.children;

     	var done = false;

     	var i = void 0,
     	    l = void 0;
     	var points = void 0,
     	    data = void 0,
     	    last = void 0;

     	if (octant.contains(p, bias)) {

     		if (children !== null) {

     			for (i = 0, l = children.length; !done && i < l; ++i) {

     				done = _remove(children[i], octant, p, bias, maxPoints);
     			}
     		} else if (octant.points !== null) {

     			points = octant.points;
     			data = octant.data;

     			for (i = 0, l = points.length; !done && i < l; ++i) {

     				if (points[i].equals(p)) {

     					last = l - 1;

     					// If the point is NOT the last one in the array:
     					if (i < last) {

     						// Overwrite with the last point and data entry.
     						points[i] = points[last];
     						data[i] = data[last];
     					}

     					// Drop the last entry.
     					points.pop();
     					data.pop();

     					if (parent !== null && _countPoints(parent) <= maxPoints) {

     						parent.merge();
     					}

     					done = true;
     				}
     			}
     		}
     	}

     	return done;
     }

     /**
      * Recursively finds a point in the octree and fetches the associated data.
      *
      * @method fetch
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @param {Vector3} p - A point.
      * @param {Number} bias - A threshold for proximity checks.
      * @param {Number} biasSquared - The threshold squared.
      * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
      */

     function _fetch(octant, p, bias, biasSquared) {

     	var children = octant.children;

     	var result = null;

     	var i = void 0,
     	    l = void 0;
     	var points = void 0;

     	if (octant.contains(p, bias)) {

     		if (children !== null) {

     			for (i = 0, l = children.length; result === null && i < l; ++i) {

     				result = _fetch(children[i], p, bias, biasSquared);
     			}
     		} else {

     			points = octant.points;

     			for (i = 0, l = points.length; result === null && i < l; ++i) {

     				if (p.distanceToSquared(points[i]) <= biasSquared) {

     					result = octant.data[i];
     				}
     			}
     		}
     	}

     	return result;
     }

     /**
      * Recursively finds the closest point to the given one.
      *
      * @method findNearestPoint
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @param {Vector3} p - The point.
      * @param {Number} maxDistance - The maximum distance.
      * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
      * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
      */

     function _findNearestPoint(octant, p, maxDistance, skipSelf) {

     	var points = octant.points;
     	var children = octant.children;

     	var result = null;
     	var bestDist = maxDistance;

     	var i = void 0,
     	    l = void 0;
     	var point = void 0,
     	    distSq = void 0;

     	var sortedChildren = void 0;
     	var child = void 0,
     	    childResult = void 0;

     	if (children !== null) {

     		// Sort the children.
     		sortedChildren = children.map(function (child) {

     			// Precompute distances.
     			return {
     				octant: child,
     				distance: child.distanceToCenterSquared(p)
     			};
     		}).sort(function (a, b) {

     			// Smallest distance to p first, ASC.
     			return a.distance - b.distance;
     		});

     		// Traverse from closest to furthest.
     		for (i = 0, l = sortedChildren.length; i < l; ++i) {

     			// Unpack octant.
     			child = sortedChildren[i].octant;

     			if (child.contains(p, bestDist)) {

     				childResult = _findNearestPoint(child, p, bestDist, skipSelf);

     				if (childResult !== null) {

     					distSq = childResult.point.distanceToSquared(p);

     					if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

     						bestDist = distSq;
     						result = childResult;
     					}
     				}
     			}
     		}
     	} else if (points !== null) {

     		for (i = 0, l = points.length; i < l; ++i) {

     			point = points[i];
     			distSq = p.distanceToSquared(point);

     			if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

     				bestDist = distSq;

     				result = {
     					point: point.clone(),
     					data: octant.data[i]
     				};
     			}
     		}
     	}

     	return result;
     }

     /**
      * Recursively finds points that are inside the specified radius around a given
      * position.
      *
      * @method findPoints
      * @private
      * @static
      * @param {Octant} octant - An octant.
      * @param {Vector3} p - A position.
      * @param {Number} r - A radius.
      * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
      * @param {Array} result - An array to be filled with objects, each containing a point and a data property.
      */

     function _findPoints(octant, p, r, skipSelf, result) {

     	var points = octant.points;
     	var children = octant.children;
     	var rSq = r * r;

     	var i = void 0,
     	    l = void 0;

     	var point = void 0,
     	    distSq = void 0;
     	var child = void 0;

     	if (children !== null) {

     		for (i = 0, l = children.length; i < l; ++i) {

     			child = children[i];

     			if (child.contains(p, r)) {

     				_findPoints(child, p, r, skipSelf, result);
     			}
     		}
     	} else if (points !== null) {

     		for (i = 0, l = points.length; i < l; ++i) {

     			point = points[i];
     			distSq = p.distanceToSquared(point);

     			if ((!skipSelf || distSq > 0.0) && distSq <= rSq) {

     				result.push({
     					point: point.clone(),
     					data: octant.data[i]
     				});
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

     var PointOctree = function (_Octree) {
     	inherits(PointOctree, _Octree);

     	function PointOctree(min, max) {
     		var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
     		var maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;
     		var maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;
     		classCallCheck(this, PointOctree);

     		var _this = possibleConstructorReturn(this, (PointOctree.__proto__ || Object.getPrototypeOf(PointOctree)).call(this));

     		_this.root = new PointOctant(min, max);

     		/**
        * A threshold for proximity checks.
        *
        * @property bias
        * @type Number
        * @private
        * @default 0.0
        */

     		_this.bias = Math.max(0.0, bias);

     		/**
        * The proximity threshold squared.
        *
        * @property biasSquared
        * @type Number
        * @private
        * @default 0.0
        */

     		_this.biasSquared = _this.bias * _this.bias;

     		/**
        * Number of points per octant before a split occurs.
        *
        * This value works together with the maximum depth as a secondary limiting
        * factor. Smaller values cause splits to occur earlier which results in a
        * faster and deeper tree growth.
        *
        * @property maxPoints
        * @type Number
        * @private
        * @default 8
        */

     		_this.maxPoints = Math.max(1, Math.round(maxPoints));

     		/**
        * The maximum tree depth level.
        *
        * It's possible to use Infinity, but be aware that allowing infinitely
        * small octants can have a negative impact on performance.
        * Finding a value that works best for a specific scene is advisable.
        *
        * @property maxDepth
        * @type Number
        * @private
        * @default 8
        */

     		_this.maxDepth = Math.max(0, Math.round(maxDepth));

     		return _this;
     	}

     	/**
       * Counts how many points are in this octree.
       *
       * @method countPoints
       * @return {Number} The amount of points.
       */

     	createClass(PointOctree, [{
     		key: "countPoints",
     		value: function countPoints() {

     			return _countPoints(this.root);
     		}

     		/**
        * Adds a point to the octree.
        *
        * @method add
        * @param {Vector3} p - A point.
        * @param {Object} data - An object that the point represents.
        */

     	}, {
     		key: "add",
     		value: function add(p, data) {

     			_add(this.root, p, data, 0, this.bias, this.maxPoints, this.maxDepth);
     		}

     		/**
        * Removes a point from the tree.
        *
        * @method remove
        * @param {Vector3} p - A point.
        */

     	}, {
     		key: "remove",
     		value: function remove(p) {

     			_remove(this.root, null, p, this.bias, this.maxPoints);
     		}

     		/**
        * Retrieves the data of the specified point.
        *
        * @method fetch
        * @param {Vector3} p - A position.
        * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
        */

     	}, {
     		key: "fetch",
     		value: function fetch(p) {

     			return _fetch(this.root, p, this.bias, this.biasSquared);
     		}

     		/**
        * Finds the closest point to the given one.
        *
        * @method findNearestPoint
        * @param {Vector3} p - A point.
        * @param {Number} [maxDistance=Infinity] - An upper limit for the distance between the points.
        * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
        * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
        */

     	}, {
     		key: "findNearestPoint",
     		value: function findNearestPoint(p) {
     			var maxDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
     			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


     			return _findNearestPoint(this.root, p, maxDistance, skipSelf);
     		}

     		/**
        * Finds points that are in the specified radius around the given position.
        *
        * @method findPoints
        * @param {Vector3} p - A position.
        * @param {Number} r - A radius.
        * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
        * @return {Array} An array of objects, each containing a point and a data property.
        */

     	}, {
     		key: "findPoints",
     		value: function findPoints(p, r) {
     			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


     			var result = [];

     			_findPoints(this.root, p, r, skipSelf, result);

     			return result;
     		}

     		/**
        * Finds the points that intersect with the given ray.
        *
        * @method raycast
        * @param {Raycaster} raycaster - The raycaster.
        * @param {Array} [intersects] - An array to be filled with the intersecting points.
        * @return {Array} The intersecting points.
        */

     	}, {
     		key: "raycast",
     		value: function raycast(raycaster) {
     			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


     			var octants = get(PointOctree.prototype.__proto__ || Object.getPrototypeOf(PointOctree.prototype), "raycast", this).call(this, raycaster);

     			if (octants.length > 0) {

     				// Collect intersecting points.
     				this.testPoints(octants, raycaster, intersects);
     			}

     			return intersects;
     		}

     		/**
        * Collects points that intersect with the given ray.
        *
        * @method testPoints
        * @param {Array} octants - An array containing octants that intersect with the ray.
        * @param {Raycaster} raycaster - The raycaster.
        * @param {Array} intersects - An array to be filled with the intersecting points.
        */

     	}, {
     		key: "testPoints",
     		value: function testPoints(octants, raycaster, intersects) {

     			var threshold = raycaster.params.Points.threshold;
     			var thresholdSq = threshold * threshold;

     			var intersectPoint = void 0;
     			var distance = void 0,
     			    distanceToRay = void 0;
     			var rayPointDistanceSq = void 0;

     			var i = void 0,
     			    j = void 0,
     			    il = void 0,
     			    jl = void 0;
     			var octant = void 0,
     			    points = void 0,
     			    point = void 0;

     			for (i = 0, il = octants.length; i < il; ++i) {

     				octant = octants[i];
     				points = octant.points;

     				if (points !== null) {

     					for (j = 0, jl = points.length; j < jl; ++j) {

     						point = points[j];
     						rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

     						if (rayPointDistanceSq < thresholdSq) {

     							intersectPoint = raycaster.ray.closestPointToPoint(point);
     							distance = raycaster.ray.origin.distanceTo(intersectPoint);

     							if (distance >= raycaster.near && distance <= raycaster.far) {

     								distanceToRay = Math.sqrt(rayPointDistanceSq);

     								intersects.push({
     									distance: distance,
     									distanceToRay: distanceToRay,
     									point: intersectPoint.clone(),
     									object: octant.data[j]
     								});
     							}
     						}
     					}
     				}
     			}
     		}
     	}]);
     	return PointOctree;
     }(Octree);

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
      * A vector with three components.
      *
      * @class Vector3
      * @submodule math
      * @constructor
      * @param {Number} [x=0] - The x value.
      * @param {Number} [y=0] - The y value.
      * @param {Number} [z=0] - The z value.
      */

     var Vector3$2 = function () {
     	function Vector3$$1() {
     		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
     		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
     		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
     		classCallCheck(this, Vector3$$1);


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

     	createClass(Vector3$$1, [{
     		key: "set",
     		value: function set$$1(x, y, z) {

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

     	}, {
     		key: "copy",
     		value: function copy(v) {

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

     	}, {
     		key: "fromArray",
     		value: function fromArray(array) {
     			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


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

     	}, {
     		key: "toArray",
     		value: function toArray$$1() {
     			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
     			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


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

     	}, {
     		key: "equals",
     		value: function equals(v) {

     			return v.x === this.x && v.y === this.y && v.z === this.z;
     		}

     		/**
        * Clones this vector.
        *
        * @method clone
        * @return {Vector3} A clone of this vector.
        */

     	}, {
     		key: "clone",
     		value: function clone() {

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

     	}, {
     		key: "add",
     		value: function add(v) {

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

     	}, {
     		key: "addScaledVector",
     		value: function addScaledVector(v, s) {

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

     	}, {
     		key: "addScalar",
     		value: function addScalar(s) {

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

     	}, {
     		key: "addVectors",
     		value: function addVectors(a, b) {

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

     	}, {
     		key: "sub",
     		value: function sub(v) {

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

     	}, {
     		key: "subScalar",
     		value: function subScalar(s) {

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

     	}, {
     		key: "subVectors",
     		value: function subVectors(a, b) {

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

     	}, {
     		key: "multiply",
     		value: function multiply(v) {

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

     	}, {
     		key: "multiplyScalar",
     		value: function multiplyScalar(s) {

     			if (isFinite(s)) {

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

     	}, {
     		key: "multiplyVectors",
     		value: function multiplyVectors(a, b) {

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

     	}, {
     		key: "divide",
     		value: function divide(v) {

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

     	}, {
     		key: "divideScalar",
     		value: function divideScalar(s) {

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

     	}, {
     		key: "divideVectors",
     		value: function divideVectors(a, b) {

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

     	}, {
     		key: "negate",
     		value: function negate() {

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

     	}, {
     		key: "dot",
     		value: function dot(v) {

     			return this.x * v.x + this.y * v.y + this.z * v.z;
     		}

     		/**
        * Calculates the squared length of this vector.
        *
        * @method lengthSq
        * @return {Number} The squared length.
        */

     	}, {
     		key: "lengthSq",
     		value: function lengthSq() {

     			return this.x * this.x + this.y * this.y + this.z * this.z;
     		}

     		/**
        * Calculates the length of this vector.
        *
        * @method length
        * @return {Number} The length.
        */

     	}, {
     		key: "length",
     		value: function length() {

     			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
     		}

     		/**
        * Calculates the distance to a given vector.
        *
        * @method distanceTo
        * @param {Vector3} v - A vector.
        * @return {Number} The distance.
        */

     	}, {
     		key: "distanceTo",
     		value: function distanceTo(v) {

     			return Math.sqrt(this.distanceToSquared(v));
     		}

     		/**
        * Calculates the squared distance to a given vector.
        *
        * @method distanceToSquared
        * @param {Vector3} v - A vector.
        * @return {Number} The squared distance.
        */

     	}, {
     		key: "distanceToSquared",
     		value: function distanceToSquared(v) {

     			var dx = this.x - v.x;
     			var dy = this.y - v.y;
     			var dz = this.z - v.z;

     			return dx * dx + dy * dy + dz * dz;
     		}

     		/**
        * Normalizes this vector.
        *
        * @method normalize
        * @chainable
        * @return {Vector3} This vector.
        */

     	}, {
     		key: "normalize",
     		value: function normalize() {

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

     	}, {
     		key: "min",
     		value: function min(v) {

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

     	}, {
     		key: "max",
     		value: function max(v) {

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

     	}, {
     		key: "clamp",
     		value: function clamp(min, max) {

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

     	}, {
     		key: "applyMatrix3",
     		value: function applyMatrix3(m) {

     			var x = this.x,
     			    y = this.y,
     			    z = this.z;
     			var e = m.elements;

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

     	}, {
     		key: "applyMatrix4",
     		value: function applyMatrix4(m) {

     			var x = this.x,
     			    y = this.y,
     			    z = this.z;
     			var e = m.elements;

     			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
     			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
     			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

     			return this;
     		}
     	}]);
     	return Vector3$$1;
     }();

     /**
      * A bounding box.
      *
      * @class Box3
      * @submodule math
      * @constructor
      * @param {Vector3} [min] - The lower bounds.
      * @param {Vector3} [max] - The upper bounds.
      */

     var Box3$2 = function () {
     	function Box3$$1() {
     		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$2(Infinity, Infinity, Infinity);
     		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$2(-Infinity, -Infinity, -Infinity);
     		classCallCheck(this, Box3$$1);


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

     	createClass(Box3$$1, [{
     		key: "set",
     		value: function set$$1(min, max) {

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

     	}, {
     		key: "copy",
     		value: function copy(b) {

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

     	}, {
     		key: "clone",
     		value: function clone() {

     			return new this.constructor().copy(this);
     		}

     		/**
        * Expands this box by the given point.
        *
        * @method expandByPoint
        * @param {Matrix3} p - A point.
        * @return {Box3} This box.
        */

     	}, {
     		key: "expandByPoint",
     		value: function expandByPoint(p) {

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

     	}, {
     		key: "union",
     		value: function union(b) {

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

     	}, {
     		key: "setFromPoints",
     		value: function setFromPoints(points) {

     			var i = void 0,
     			    l = void 0;

     			for (i = 0, l = points.length; i < l; ++i) {

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

     	}, {
     		key: "setFromCenterAndSize",
     		value: function setFromCenterAndSize(center, size) {

     			var halfSize = size.clone().multiplyScalar(0.5);

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

     	}, {
     		key: "intersectsBox",
     		value: function intersectsBox(box) {

     			return !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);
     		}
     	}]);
     	return Box3$$1;
     }();

     /**
      * An enumeration of material constants.
      *
      * @class Material
      * @submodule volume
      * @static
      */

     var Material = {

     	/**
       * The index for empty space.
       *
       * @property AIR
       * @type Number
       * @static
       * @final
       */

     	AIR: 0,

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

     var EdgeData = function () {
     	function EdgeData(n) {
     		classCallCheck(this, EdgeData);


     		var c = Math.pow(n + 1, 2) * n;

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

     		this.edges = [new Uint32Array(c), new Uint32Array(c), new Uint32Array(c)];

     		/**
        * The Zero Crossing interpolation values.
        *
        * Each value describes the relative surface intersection position on the
        * respective edge. The values correspond to the order of the edges.
        *
        * @property zeroCrossings
        * @type Array
        */

     		this.zeroCrossings = [new Float32Array(c), new Float32Array(c), new Float32Array(c)];

     		/**
        * The surface intersection normals.
        *
        * The vectors are stored as [x, y, z] float triples and correspond to the
        * order of the edges.
        *
        * @property normals
        * @type Array
        */

     		this.normals = [new Float32Array(c * 3), new Float32Array(c * 3), new Float32Array(c * 3)];
     	}

     	/**
       * Creates a list of transferable items.
       *
       * @method createTransferList
       * @param {Array} [transferList] - An existing list to be filled with transferable items.
       * @return {Array} A transfer list.
       */

     	createClass(EdgeData, [{
     		key: "createTransferList",
     		value: function createTransferList() {
     			var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


     			var arrays = [this.edges[0], this.edges[1], this.edges[2], this.zeroCrossings[0], this.zeroCrossings[1], this.zeroCrossings[2], this.normals[0], this.normals[1], this.normals[2]];

     			var array = void 0;

     			while (arrays.length > 0) {

     				array = arrays.pop();

     				if (array !== null) {

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

     	}, {
     		key: "serialise",
     		value: function serialise() {

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
        * @param {Object} object - Serialised edge data.
        */

     	}, {
     		key: "deserialise",
     		value: function deserialise(object) {

     			this.edges = object.edges;
     			this.zeroCrossings = object.zeroCrossings;
     			this.normals = object.normals;
     		}
     	}]);
     	return EdgeData;
     }();

     /**
      * The material grid resolution.
      *
      * @property resolution
      * @type Number
      * @private
      * @static
      * @default 0
      */

     var resolution = 0;

     /**
      * The total amount of grid point indices.
      *
      * @property indexCount
      * @type Number
      * @private
      * @static
      * @default 0
      */

     var indexCount = 0;

     /**
      * Hermite data.
      *
      * @class HermiteData
      * @submodule volume
      * @constructor
      * @param {Boolean} [initialise=true] - Whether the data should be initialised immediately.
      */

     var HermiteData = function () {
     		function HermiteData() {
     				var initialise = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
     				classCallCheck(this, HermiteData);


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

     		createClass(HermiteData, [{
     				key: "set",


     				/**
          * Adopts the given data.
          *
          * @method set
          * @chainable
          * @param {HermiteData} data - The data to adopt.
          * @return {HermiteData} This data.
          */

     				value: function set$$1(data) {

     						this.lod = data.lod;
     						this.neutered = data.neutered;
     						this.materials = data.materials;
     						this.materialIndices = data.materialIndices;
     						this.runLengths = data.runLengths;
     						this.edgeData = data.edgeData;

     						return this;
     				}

     				/**
          * Sets the specified material index.
          *
          * @method setMaterialIndex
          * @param {Number} index - The index of the material index that should be updated.
          * @param {Number} value - The new material index.
          */

     		}, {
     				key: "setMaterialIndex",
     				value: function setMaterialIndex(index, value) {

     						// Keep track of how many material indices are solid.
     						if (this.materialIndices[index] === Material.AIR) {

     								if (value !== Material.AIR) {

     										++this.materials;
     								}
     						} else if (value === Material.AIR) {

     								--this.materials;
     						}

     						this.materialIndices[index] = value;
     				}

     				/**
          * Compresses this data.
          *
          * @method compress
          * @chainable
          * @return {HermiteData} This data.
          */

     		}, {
     				key: "compress",
     				value: function compress() {

     						var encoding = void 0;

     						if (this.runLengths === null) {

     								if (this.full) {

     										encoding = {
     												runLengths: [this.materialIndices.length],
     												data: [Material.SOLID]
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

     		}, {
     				key: "decompress",
     				value: function decompress() {

     						if (this.runLengths !== null) {

     								this.materialIndices = RunLengthEncoder.decode(this.runLengths, this.materialIndices, new Uint8Array(indexCount));

     								this.runLengths = null;
     						}

     						return this;
     				}

     				/**
          * Creates a list of transferable items.
          *
          * @method createTransferList
          * @param {Array} [transferList] - An existing list to be filled with transferable items.
          * @return {Array} A transfer list.
          */

     		}, {
     				key: "createTransferList",
     				value: function createTransferList() {
     						var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


     						if (this.edgeData !== null) {
     								this.edgeData.createTransferList(transferList);
     						}

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

     		}, {
     				key: "serialise",
     				value: function serialise() {

     						this.neutered = true;

     						return {
     								lod: this.lod,
     								materials: this.materials,
     								materialIndices: this.materialIndices,
     								runLengths: this.runLengths,
     								edgeData: this.edgeData !== null ? this.edgeData.serialise() : null
     						};
     				}

     				/**
          * Adopts the given serialised data.
          *
          * @method deserialise
          * @param {Object} object - Serialised hermite data.
          */

     		}, {
     				key: "deserialise",
     				value: function deserialise(object) {

     						this.lod = object.lod;
     						this.materials = object.materials;

     						this.materialIndices = object.materialIndices;
     						this.runLengths = object.runLengths;

     						if (object.edgeData !== null) {

     								if (this.edgeData === null) {

     										this.edgeData = new EdgeData(0);
     								}

     								this.edgeData.deserialise(object.edgeData);
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

     		}, {
     				key: "empty",
     				get: function get$$1() {
     						return this.materials === 0;
     				}

     				/**
          * Indicates whether this data container is full.
          *
          * @property full
          * @type Boolean
          */

     		}, {
     				key: "full",
     				get: function get$$1() {
     						return this.materials === indexCount;
     				}
     		}], [{
     				key: "resolution",
     				get: function get$$1() {
     						return resolution;
     				},
     				set: function set$$1(x) {

     						if (resolution === 0) {

     								resolution = Math.max(1, Math.min(256, x));
     								indexCount = Math.pow(resolution + 1, 3);
     						}
     				}
     		}]);
     		return HermiteData;
     }();

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

     var Chunk = function (_CubicOctant) {
     	inherits(Chunk, _CubicOctant);

     	function Chunk(min, size) {
     		classCallCheck(this, Chunk);

     		/**
        * Hermite data.
        *
        * @property data
        * @type HermiteData
        * @default null
        */

     		var _this = possibleConstructorReturn(this, (Chunk.__proto__ || Object.getPrototypeOf(Chunk)).call(this, min, size));

     		_this.data = null;

     		/**
        * A CSG operation queue.
        *
        * @property csg
        * @type Queue
        * @default null
        */

     		_this.csg = null;

     		return _this;
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

     	createClass(Chunk, [{
     		key: "createTransferList",


     		/**
        * Creates a list of transferable items.
        *
        * @method createTransferList
        * @param {Array} [transferList] - An existing list to be filled with transferable items.
        * @return {Array} A transfer list.
        */

     		value: function createTransferList() {
     			var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


     			return this.data !== null ? this.data.createTransferList(transferList) : transferList;
     		}

     		/**
        * Serialises this chunk.
        *
        * @method serialise
        * @return {Object} A serialised description of this chunk.
        */

     	}, {
     		key: "serialise",
     		value: function serialise() {

     			return {
     				resolution: this.resolution,
     				min: this.min.toArray(),
     				size: this.size,
     				data: this.data !== null ? this.data.serialise() : null
     			};
     		}

     		/**
        * Adopts the given serialised data.
        *
        * @method deserialise
        * @param {Object} object - A serialised chunk description.
        */

     	}, {
     		key: "deserialise",
     		value: function deserialise(object) {

     			this.resolution = object.resolution;
     			this.min.fromArray(object.min);
     			this.size = object.size;

     			if (object.data !== null) {

     				if (this.data === null) {

     					this.data = new HermiteData(false);
     				}

     				this.data.deserialise(object.data);
     			} else {

     				this.data = null;
     			}
     		}
     	}, {
     		key: "resolution",
     		get: function get$$1() {
     			return HermiteData.resolution;
     		},
     		set: function set$$1(x) {
     			HermiteData.resolution = x;
     		}
     	}]);
     	return Chunk;
     }(CubicOctant);

     /**
      * A computation helper.
      *
      * @property BOX3
      * @type Box3
      * @private
      * @static
      * @final
      */

     var BOX3$1 = new Box3$2();

     /**
      * Rounds the given number up to the next power of two.
      *
      * @method ceil2
      * @private
      * @static
      * @param {Number} n - A number.
      * @return {Number} The next power of two.
      */

     function ceil2(n) {
     	return Math.pow(2, Math.max(0, Math.ceil(Math.log2(n))));
     }

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

     var Volume = function (_Octree) {
     	inherits(Volume, _Octree);

     	function Volume() {
     		var chunkSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
     		var resolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 32;
     		classCallCheck(this, Volume);

     		var _this = possibleConstructorReturn(this, (Volume.__proto__ || Object.getPrototypeOf(Volume)).call(this));

     		_this.root = new Chunk();

     		/**
        * The size of a volume chunk.
        *
        * @property chunkSize
        * @type Number
        * @private
        * @default 32
        */

     		_this.chunkSize = Math.max(1, ceil2(chunkSize));

     		_this.min.subScalar(_this.chunkSize * 2);
     		_this.size = _this.chunkSize * 4;

     		_this.root.resolution = ceil2(resolution);

     		return _this;
     	}

     	/**
       * The size of the root octant.
       *
       * @property size
       * @type Number
       */

     	createClass(Volume, [{
     		key: "grow",


     		/**
        * Creates leaf octants in the specified region and returns them together with
        * existing ones.
        *
        * @method grow
        * @private
        * @param {Chunk} octant - An octant.
        * @param {Frustum|Box3} region - A region.
        * @param {Number} size - A leaf octant target size.
        * @param {Array} result - A list to be filled with octants that intersect with the region.
        */

     		value: function grow(octant, region, size, result) {

     			var children = octant.children;
     			var i = void 0,
     			    l = void 0;

     			BOX3$1.min = octant.min;
     			BOX3$1.max = octant.max;

     			if (region.intersectsBox(BOX3$1)) {

     				if (children === null && octant.size > size) {

     					octant.split();
     					children = octant.children;
     				}

     				if (children !== null) {

     					for (i = 0, l = children.length; i < l; ++i) {

     						this.grow(children[i], region, size, result);
     					}
     				} else {

     					result.push(octant);
     				}
     			}
     		}

     		/**
        * Edits this volume.
        *
        * @method edit
        * @param {SignedDistanceFunction} sdf - An SDF.
        * @return {Array} The chunks that lie inside the operation's region, including newly created ones.
        */

     	}, {
     		key: "edit",
     		value: function edit(sdf) {

     			var region = sdf.completeBoundingBox;

     			var result = [];

     			if (sdf.operation === OperationType.UNION) {

     				// Find and create leaf octants.
     				this.expand(region);
     				this.grow(this.root, region, this.chunkSize, result);
     			} else if (sdf.operation === OperationType.DIFFERENCE) {

     				// Chunks that don't exist can't become more empty.
     				result = this.leaves(region);
     			} else {

     				// Intersections affect all chunks.
     				result = this.leaves();
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

     	}, {
     		key: "expand",
     		value: function expand(region) {

     			var min = region.min;
     			var max = region.max;

     			var m = Math.max(Math.max(Math.max(Math.abs(min.x), Math.abs(min.y)), Math.abs(min.z)), Math.max(Math.max(Math.abs(max.x), Math.abs(max.y)), Math.abs(max.z)));

     			var s = this.size / 2;
     			var originalChildren = this.children;

     			var n = void 0,
     			    i = void 0;

     			if (m > s) {

     				// Find an appropriate target size.
     				n = ceil2(Math.ceil(m / this.chunkSize) * this.chunkSize);

     				if (originalChildren === null) {

     					// Expand the root's boundaries.
     					this.min.set(-n, -n, -n);
     					this.size = 2 * n;
     				} else {

     					// Repeatedly double the octree size and create intermediate octants.
     					while (s < n) {

     						s = this.size;

     						this.min.multiplyScalar(2);
     						this.size *= 2;

     						// Create new children.
     						this.root.split();

     						// Connect them with the old children.
     						for (i = 0; i < 8; ++i) {

     							// But only if they actually contain deeper structures.
     							if (originalChildren[i].children !== null) {

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

     	}, {
     		key: "prune",
     		value: function prune(chunk) {}

     		/**
        * Loads a volume.
        *
        * @method load
        * @param {String} data - The volume data to import.
        */

     	}, {
     		key: "load",
     		value: function load(data) {

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

     	}, {
     		key: "toJSON",
     		value: function toJSON() {

     			return {
     				resolution: Chunk.resolution,
     				chunkSize: this.chunkSize,
     				root: this.root
     			};
     		}
     	}, {
     		key: "size",
     		get: function get$$1() {
     			return this.root.size;
     		},
     		set: function set$$1(x) {
     			this.root.size = x;
     		}

     		/**
        * The resolution of the volume data.
        *
        * @property resolution
        * @type Number
        */

     	}, {
     		key: "resolution",
     		get: function get$$1() {
     			return this.root.resolution;
     		}
     	}]);
     	return Volume;
     }(Octree);

     /**
      * An enumeration of SDF types.
      *
      * @class SDFType
      * @submodule sdf
      * @static
      */

     var SDFType = {

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
      * A CSG operation.
      *
      * @class Operation
      * @submodule csg
      * @constructor
      * @param {OperationType} type - The type of this operation.
      * @param {Operation} ...children - Child operations.
      */

     var Operation = function () {
     		function Operation(type) {
     				classCallCheck(this, Operation);


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

     				for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
     						children[_key - 1] = arguments[_key];
     				}

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

     		createClass(Operation, [{
     				key: "computeBoundingBox",


     				/**
          * Calculates the bounding box of this operation.
          *
          * @method computeBoundingBox
          * @return {Box3} The bounding box.
          */

     				value: function computeBoundingBox() {

     						var children = this.children;

     						var i = void 0,
     						    l = void 0;

     						this.bbox = new Box3$2();

     						for (i = 0, l = children.length; i < l; ++i) {

     								this.bbox.union(children[i].boundingBox);
     						}

     						return this.bbox;
     				}
     		}, {
     				key: "boundingBox",
     				get: function get$$1() {

     						return this.bbox !== null ? this.bbox : this.computeBoundingBox();
     				}
     		}]);
     		return Operation;
     }();

     /**
      * A union operation.
      *
      * @class Union
      * @submodule csg
      * @extends Operation
      * @constructor
      * @param {Operation} ...children - Child operations.
      */

     var Union = function (_Operation) {
     	inherits(Union, _Operation);

     	function Union() {
     		var _ref;

     		classCallCheck(this, Union);

     		for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
     			children[_key] = arguments[_key];
     		}

     		return possibleConstructorReturn(this, (_ref = Union.__proto__ || Object.getPrototypeOf(Union)).call.apply(_ref, [this, OperationType.UNION].concat(children)));
     	}

     	/**
       * Updates the specified material index.
       *
       * @method updateMaterialIndex
       * @param {Number} index - The index of the material index that needs to be updated.
       * @param {HermiteData} data0 - The target volume data.
       * @param {HermiteData} data1 - Predominant volume data.
       */

     	createClass(Union, [{
     		key: "updateMaterialIndex",
     		value: function updateMaterialIndex(index, data0, data1) {

     			var materialIndex = data1.materialIndices[index];

     			if (materialIndex !== Material.AIR) {

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

     	}, {
     		key: "selectEdge",
     		value: function selectEdge(edge0, edge1, s) {

     			return s ? edge0.t > edge1.t ? edge0 : edge1 : edge0.t < edge1.t ? edge0 : edge1;
     		}
     	}]);
     	return Union;
     }(Operation);

     /**
      * A difference operation.
      *
      * @class Difference
      * @submodule csg
      * @extends Operation
      * @constructor
      * @param {Operation} ...children - Child operations.
      */

     var Difference = function (_Operation) {
     	inherits(Difference, _Operation);

     	function Difference() {
     		var _ref;

     		classCallCheck(this, Difference);

     		for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
     			children[_key] = arguments[_key];
     		}

     		return possibleConstructorReturn(this, (_ref = Difference.__proto__ || Object.getPrototypeOf(Difference)).call.apply(_ref, [this, OperationType.DIFFERENCE].concat(children)));
     	}

     	/**
       * Updates the specified material index.
       *
       * @method updateMaterialIndex
       * @param {Number} index - The index of the material index that needs to be updated.
       * @param {HermiteData} data0 - The target volume data.
       * @param {HermiteData} data1 - Predominant volume data.
       */

     	createClass(Difference, [{
     		key: "updateMaterialIndex",
     		value: function updateMaterialIndex(index, data0, data1) {

     			if (data1.materialIndices[index] !== Material.AIR) {

     				data0.setMaterialIndex(index, Material.AIR);
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

     	}, {
     		key: "selectEdge",
     		value: function selectEdge(edge0, edge1, s) {

     			return s ? edge0.t < edge1.t ? edge0 : edge1 : edge0.t > edge1.t ? edge0 : edge1;
     		}
     	}]);
     	return Difference;
     }(Operation);

     /**
      * An intersection operation.
      *
      * @class Intersection
      * @submodule csg
      * @extends Operation
      * @constructor
      * @param {Operation} ...children - Child operations.
      */

     var Intersection = function (_Operation) {
     	inherits(Intersection, _Operation);

     	function Intersection() {
     		var _ref;

     		classCallCheck(this, Intersection);

     		for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
     			children[_key] = arguments[_key];
     		}

     		return possibleConstructorReturn(this, (_ref = Intersection.__proto__ || Object.getPrototypeOf(Intersection)).call.apply(_ref, [this, OperationType.INTERSECTION].concat(children)));
     	}

     	/**
       * Updates the specified material index.
       *
       * @method updateMaterialIndex
       * @param {Number} index - The index of the material index that needs to be updated.
       * @param {HermiteData} data0 - The target volume data.
       * @param {HermiteData} data1 - Predominant volume data.
       */

     	createClass(Intersection, [{
     		key: "updateMaterialIndex",
     		value: function updateMaterialIndex(index, data0, data1) {

     			var materialIndex = data1.materialIndices[index];

     			data0.setMaterialIndex(index, data0.materialIndices[index] !== Material.AIR && materialIndex !== Material.AIR ? materialIndex : Material.AIR);
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

     	}, {
     		key: "selectEdge",
     		value: function selectEdge(edge0, edge1, s) {

     			return s ? edge0.t < edge1.t ? edge0 : edge1 : edge0.t > edge1.t ? edge0 : edge1;
     		}
     	}]);
     	return Intersection;
     }(Operation);

     /**
      * The isovalue.
      *
      * @property ISOVALUE
      * @type Number
      * @private
      * @static
      * @final
      */

     var ISOVALUE = 0.0;

     /**
      * An operation that describes a density field.
      *
      * @class DensityFunction
      * @submodule csg
      * @extends Operation
      * @constructor
      * @param {SignedDistanceFunction} sdf - An SDF.
      */

     var DensityFunction = function (_Operation) {
     	inherits(DensityFunction, _Operation);

     	function DensityFunction(sdf) {
     		classCallCheck(this, DensityFunction);

     		/**
        * An SDF.
        *
        * @property sdf
        * @type SignedDistanceFunction
        * @private
        */

     		var _this = possibleConstructorReturn(this, (DensityFunction.__proto__ || Object.getPrototypeOf(DensityFunction)).call(this, OperationType.DENSITY_FUNCTION));

     		_this.sdf = sdf;

     		return _this;
     	}

     	/**
       * Calculates a bounding box for this operation.
       *
       * @method computeBoundingBox
       * @return {Box3} The bounding box.
       */

     	createClass(DensityFunction, [{
     		key: "computeBoundingBox",
     		value: function computeBoundingBox() {

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

     	}, {
     		key: "generateMaterialIndex",
     		value: function generateMaterialIndex(position) {

     			return this.sdf.sample(position) <= ISOVALUE ? this.sdf.material : Material.AIR;
     		}

     		/**
        * Generates surface intersection data for the specified edge.
        *
        * @method generateEdge
        * @param {Edge} edge - The edge that should be processed.
        */

     	}, {
     		key: "generateEdge",
     		value: function generateEdge(edge) {

     			edge.approximateZeroCrossing(this.sdf);
     			edge.computeSurfaceNormal(this.sdf);
     		}
     	}]);
     	return DensityFunction;
     }(Operation);

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
      * @param {Number} [material=Material.SOLID] - A material index. Must be an integer in the range of 1 to 255.
      */

     var SignedDistanceFunction = function () {
     		function SignedDistanceFunction(type) {
     				var material = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Material.SOLID;
     				classCallCheck(this, SignedDistanceFunction);


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
          * @default Material.SOLID
          */

     				this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

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

     		createClass(SignedDistanceFunction, [{
     				key: "union",


     				/**
          * Adds the given SDF to this one.
          *
          * @method union
          * @chainable
          * @param {SignedDistanceFunction} sdf - An SDF.
          * @return {SignedDistanceFunction} This SDF.
          */

     				value: function union(sdf) {

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

     		}, {
     				key: "subtract",
     				value: function subtract(sdf) {

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

     		}, {
     				key: "intersect",
     				value: function intersect(sdf) {

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

     		}, {
     				key: "serialise",
     				value: function serialise() {

     						var result = {
     								type: this.type,
     								operation: this.operation,
     								material: this.material,
     								parameters: null,
     								children: []
     						};

     						var children = this.children;

     						var i = void 0,
     						    l = void 0;

     						for (i = 0, l = children.length; i < l; ++i) {

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

     		}, {
     				key: "toCSG",
     				value: function toCSG() {

     						var children = this.children;

     						var operation = new DensityFunction(this);
     						var operationType = void 0;
     						var child = void 0;
     						var i = void 0,
     						    l = void 0;

     						for (i = 0, l = children.length; i < l; ++i) {

     								child = children[i];

     								if (operationType !== child.operation) {

     										operationType = child.operation;

     										switch (operationType) {

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

     		}, {
     				key: "computeBoundingBox",
     				value: function computeBoundingBox() {

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

     		}, {
     				key: "sample",
     				value: function sample(position) {

     						throw new Error("SDF: sample method not implemented!");
     				}
     		}, {
     				key: "boundingBox",
     				get: function get$$1() {

     						return this.bbox !== null ? this.bbox : this.computeBoundingBox();
     				}

     				/**
          * The complete bounding box of this SDF.
          *
          * @property completeBoundingBox
          * @type Box3
          */

     		}, {
     				key: "completeBoundingBox",
     				get: function get$$1() {

     						var children = this.children;
     						var bbox = this.boundingBox.clone();

     						var i = void 0,
     						    l = void 0;

     						for (i = 0, l = children.length; i < l; ++i) {

     								bbox.union(children[i].completeBoundingBox);
     						}

     						return bbox;
     				}
     		}]);
     		return SignedDistanceFunction;
     }();

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

     var Sphere = function (_SignedDistanceFuncti) {
     		inherits(Sphere, _SignedDistanceFuncti);

     		function Sphere() {
     				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
     				var material = arguments[1];
     				classCallCheck(this, Sphere);

     				/**
          * The origin.
          *
          * @property origin
          * @type Vector3
          * @private
          */

     				var _this = possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this, SDFType.SPHERE, material));

     				_this.origin = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.origin))))();

     				/**
          * The radius.
          *
          * @property radius
          * @type Number
          * @private
          */

     				_this.radius = parameters.radius;

     				return _this;
     		}

     		/**
        * Calculates the bounding box of this density field.
        *
        * @method computeBoundingBox
        * @return {Box3} The bounding box.
        */

     		createClass(Sphere, [{
     				key: "computeBoundingBox",
     				value: function computeBoundingBox() {

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

     		}, {
     				key: "sample",
     				value: function sample(position) {

     						var origin = this.origin;

     						var dx = position.x - origin.x;
     						var dy = position.y - origin.y;
     						var dz = position.z - origin.z;

     						var length = Math.sqrt(dx * dx + dy * dy + dz * dz);

     						return length - this.radius;
     				}

     				/**
          * Serialises this SDF.
          *
          * @method serialise
          * @return {Object} A concise representation of this SDF.
          */

     		}, {
     				key: "serialise",
     				value: function serialise() {

     						var result = get(Sphere.prototype.__proto__ || Object.getPrototypeOf(Sphere.prototype), "serialise", this).call(this);

     						result.parameters = {
     								origin: this.origin.toArray(),
     								radius: this.radius
     						};

     						return result;
     				}
     		}]);
     		return Sphere;
     }(SignedDistanceFunction);

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

     var Box = function (_SignedDistanceFuncti) {
     		inherits(Box, _SignedDistanceFuncti);

     		function Box() {
     				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
     				var material = arguments[1];
     				classCallCheck(this, Box);

     				/**
          * The origin.
          *
          * @property origin
          * @type Vector3
          * @private
          */

     				var _this = possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this, SDFType.BOX, material));

     				_this.origin = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.origin))))();

     				/**
          * The halfDimensions.
          *
          * @property halfDimensions
          * @type Vector3
          * @private
          */

     				_this.halfDimensions = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.halfDimensions))))();

     				return _this;
     		}

     		/**
        * Calculates the bounding box of this density field.
        *
        * @method computeBoundingBox
        * @return {Box3} The bounding box.
        */

     		createClass(Box, [{
     				key: "computeBoundingBox",
     				value: function computeBoundingBox() {

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

     		}, {
     				key: "sample",
     				value: function sample(position) {

     						var origin = this.origin;
     						var halfDimensions = this.halfDimensions;

     						// Compute the distance to the hull.
     						var dx = Math.abs(position.x - origin.x) - halfDimensions.x;
     						var dy = Math.abs(position.y - origin.y) - halfDimensions.y;
     						var dz = Math.abs(position.z - origin.z) - halfDimensions.z;

     						var m = Math.max(dx, Math.max(dy, dz));

     						var mx0 = Math.max(dx, 0);
     						var my0 = Math.max(dy, 0);
     						var mz0 = Math.max(dz, 0);

     						var length = Math.sqrt(mx0 * mx0 + my0 * my0 + mz0 * mz0);

     						return Math.min(m, 0) + length;
     				}

     				/**
          * Serialises this SDF.
          *
          * @method serialise
          * @return {Object} A serialised description of this SDF.
          */

     		}, {
     				key: "serialise",
     				value: function serialise() {

     						var result = get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), "serialise", this).call(this);

     						result.parameters = {
     								origin: this.origin.toArray(),
     								halfDimensions: this.halfDimensions.toArray()
     						};

     						return result;
     				}
     		}]);
     		return Box;
     }(SignedDistanceFunction);

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

     var Plane = function (_SignedDistanceFuncti) {
     	inherits(Plane, _SignedDistanceFuncti);

     	function Plane() {
     		var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
     		var material = arguments[1];
     		classCallCheck(this, Plane);

     		/**
        * The normal.
        *
        * @property normal
        * @type Vector3
        * @private
        */

     		var _this = possibleConstructorReturn(this, (Plane.__proto__ || Object.getPrototypeOf(Plane)).call(this, SDFType.PLANE, material));

     		_this.normal = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.normal))))();

     		/**
        * The constant.
        *
        * @property constant
        * @type Number
        * @private
        */

     		_this.constant = parameters.constant;

     		return _this;
     	}

     	/**
       * Calculates the bounding box of this density field.
       *
       * @method computeBoundingBox
       * @return {Box3} The bounding box.
       * @todo
       */

     	createClass(Plane, [{
     		key: "computeBoundingBox",
     		value: function computeBoundingBox() {

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

     	}, {
     		key: "sample",
     		value: function sample(position) {

     			return this.normal.dot(position) + this.constant;
     		}

     		/**
        * Serialises this SDF.
        *
        * @method serialise
        * @return {Object} A serialised description of this SDF.
        */

     	}, {
     		key: "serialise",
     		value: function serialise() {

     			var result = get(Plane.prototype.__proto__ || Object.getPrototypeOf(Plane.prototype), "serialise", this).call(this);

     			result.parameters = {
     				normal: this.normal.toArray(),
     				constant: this.constant
     			};

     			return result;
     		}
     	}]);
     	return Plane;
     }(SignedDistanceFunction);

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

     var Torus = function (_SignedDistanceFuncti) {
     		inherits(Torus, _SignedDistanceFuncti);

     		function Torus() {
     				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
     				var material = arguments[1];
     				classCallCheck(this, Torus);

     				/**
          * The origin.
          *
          * @property origin
          * @type Vector3
          * @private
          */

     				var _this = possibleConstructorReturn(this, (Torus.__proto__ || Object.getPrototypeOf(Torus)).call(this, SDFType.TORUS, material));

     				_this.origin = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.origin))))();

     				/**
          * The distance from the center to the tube.
          *
          * @property R
          * @type Number
          * @private
          */

     				_this.R = parameters.R;

     				/**
          * The radius of the tube.
          *
          * @property r
          * @type Number
          * @private
          */

     				_this.r = parameters.r;

     				return _this;
     		}

     		/**
        * Calculates the bounding box of this density field.
        *
        * @method computeBoundingBox
        * @return {Box3} The bounding box.
        */

     		createClass(Torus, [{
     				key: "computeBoundingBox",
     				value: function computeBoundingBox() {

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

     		}, {
     				key: "sample",
     				value: function sample(position) {

     						var origin = this.origin;

     						var dx = position.x - origin.x;
     						var dy = position.y - origin.y;
     						var dz = position.z - origin.z;

     						var q = Math.sqrt(dx * dx + dz * dz) - this.R;
     						var length = Math.sqrt(q * q + dy * dy);

     						return length - this.r;
     				}

     				/**
          * Serialises this SDF.
          *
          * @method serialise
          * @return {Object} A serialised description of this SDF.
          */

     		}, {
     				key: "serialise",
     				value: function serialise() {

     						var result = get(Torus.prototype.__proto__ || Object.getPrototypeOf(Torus.prototype), "serialise", this).call(this);

     						result.parameters = {
     								origin: this.origin.toArray(),
     								R: this.R,
     								r: this.r
     						};

     						return result;
     				}
     		}]);
     		return Torus;
     }(SignedDistanceFunction);

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

     var Heightfield = function (_SignedDistanceFuncti) {
     		inherits(Heightfield, _SignedDistanceFuncti);

     		function Heightfield() {
     				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
     				var material = arguments[1];
     				classCallCheck(this, Heightfield);

     				/**
          * The position.
          *
          * @property min
          * @type Vector3
          * @private
          */

     				var _this = possibleConstructorReturn(this, (Heightfield.__proto__ || Object.getPrototypeOf(Heightfield)).call(this, SDFType.HEIGHTFIELD, material));

     				_this.min = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.min))))();

     				/**
          * The dimensions.
          *
          * @property dimensions
          * @type Vector3
          * @private
          */

     				_this.dimensions = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.size))))();

     				/**
          * The height data.
          *
          * @property data
          * @type Uint8ClampedArray
          * @private
          */

     				_this.data = parameters.data;

     				return _this;
     		}

     		/**
        * Calculates the bounding box of this density field.
        *
        * @method computeBoundingBox
        * @return {Box3} The bounding box.
        */

     		createClass(Heightfield, [{
     				key: "computeBoundingBox",
     				value: function computeBoundingBox() {

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

     		}, {
     				key: "sample",
     				value: function sample(position) {

     						var min = this.min;
     						var dimensions = this.dimensions;

     						var x = Math.max(min.x, Math.min(min.x + dimensions.x, position.x - min.x));
     						var z = Math.max(min.z, Math.min(min.z + dimensions.z, position.z - min.z));

     						var y = position.y - min.y;

     						return y - this.data[z * dimensions.x + x] / 255 * dimensions.y;
     				}

     				/**
          * Serialises this SDF.
          *
          * @method serialise
          * @return {Object} A serialised description of this SDF.
          */

     		}, {
     				key: "serialise",
     				value: function serialise() {

     						var result = get(Heightfield.prototype.__proto__ || Object.getPrototypeOf(Heightfield.prototype), "serialise", this).call(this);

     						result.parameters = {
     								min: this.min.toArray(),
     								dimensions: this.dimensions.toArray(),
     								data: this.data
     						};

     						return result;
     				}
     		}]);
     		return Heightfield;
     }(SignedDistanceFunction);

     /**
      * An SDF reviver.
      *
      * @class Reviver
      * @static
      */

     var Reviver = function () {
     		function Reviver() {
     				classCallCheck(this, Reviver);
     		}

     		createClass(Reviver, null, [{
     				key: "reviveSDF",


     				/**
          * Creates an SDF from the given serialised description.
          *
          * @method reviveSDF
          * @static
          * @param {Object} description - A serialised SDF.
          * @return {SignedDistanceFunction} An SDF.
          */

     				value: function reviveSDF(description) {

     						var sdf = void 0,
     						    i = void 0,
     						    l = void 0;

     						switch (description.type) {

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

     						for (i = 0, l = description.children.length; i < l; ++i) {

     								sdf.children.push(this.reviveSDF(description.children[i]));
     						}

     						return sdf;
     				}
     		}]);
     		return Reviver;
     }();

     /**
      * An enumeration of worker actions.
      *
      * @class Action
      * @submodule worker
      * @static
      */

     var Action = {

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
      * A worker event.
      *
      * @class WorkerEvent
      * @submodule events
      * @constructor
      * @param {String} type - The name of the event.
      */

     var WorkerEvent = function (_Event) {
     		inherits(WorkerEvent, _Event);

     		function WorkerEvent(type) {
     				classCallCheck(this, WorkerEvent);

     				/**
          * A worker.
          *
          * @property worker
          * @type Worker
          * @default null
          */

     				var _this = possibleConstructorReturn(this, (WorkerEvent.__proto__ || Object.getPrototypeOf(WorkerEvent)).call(this, type));

     				_this.worker = null;

     				/**
          * A message.
          *
          * @property data
          * @type Object
          * @default null
          */

     				_this.data = null;

     				return _this;
     		}

     		return WorkerEvent;
     }(Event);

     /**
      * @submodule worker
      */

     /**
      * A worker message event.
      *
      * @event message
      * @for ThreadPool
      * @type WorkerEvent
      */

     var MESSAGE = new WorkerEvent("message");

     var worker = "(function () {\n   'use strict';\n\n   var classCallCheck = function (instance, Constructor) {\n     if (!(instance instanceof Constructor)) {\n       throw new TypeError(\"Cannot call a class as a function\");\n     }\n   };\n\n   var createClass = function () {\n     function defineProperties(target, props) {\n       for (var i = 0; i < props.length; i++) {\n         var descriptor = props[i];\n         descriptor.enumerable = descriptor.enumerable || false;\n         descriptor.configurable = true;\n         if (\"value\" in descriptor) descriptor.writable = true;\n         Object.defineProperty(target, descriptor.key, descriptor);\n       }\n     }\n\n     return function (Constructor, protoProps, staticProps) {\n       if (protoProps) defineProperties(Constructor.prototype, protoProps);\n       if (staticProps) defineProperties(Constructor, staticProps);\n       return Constructor;\n     };\n   }();\n\n\n\n\n\n\n\n   var get = function get(object, property, receiver) {\n     if (object === null) object = Function.prototype;\n     var desc = Object.getOwnPropertyDescriptor(object, property);\n\n     if (desc === undefined) {\n       var parent = Object.getPrototypeOf(object);\n\n       if (parent === null) {\n         return undefined;\n       } else {\n         return get(parent, property, receiver);\n       }\n     } else if (\"value\" in desc) {\n       return desc.value;\n     } else {\n       var getter = desc.get;\n\n       if (getter === undefined) {\n         return undefined;\n       }\n\n       return getter.call(receiver);\n     }\n   };\n\n   var inherits = function (subClass, superClass) {\n     if (typeof superClass !== \"function\" && superClass !== null) {\n       throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass);\n     }\n\n     subClass.prototype = Object.create(superClass && superClass.prototype, {\n       constructor: {\n         value: subClass,\n         enumerable: false,\n         writable: true,\n         configurable: true\n       }\n     });\n     if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;\n   };\n\n\n\n\n\n\n\n\n\n\n\n   var possibleConstructorReturn = function (self, call) {\n     if (!self) {\n       throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");\n     }\n\n     return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self;\n   };\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n   var toConsumableArray = function (arr) {\n     if (Array.isArray(arr)) {\n       for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];\n\n       return arr2;\n     } else {\n       return Array.from(arr);\n     }\n   };\n\n   /**\r\n    * A vector with three components.\r\n    *\r\n    * @class Vector3\r\n    * @submodule math\r\n    * @constructor\r\n    * @param {Number} [x=0] - The x value.\r\n    * @param {Number} [y=0] - The y value.\r\n    * @param {Number} [z=0] - The z value.\r\n    */\n\n   var Vector3 = function () {\n   \tfunction Vector3() {\n   \t\tvar x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n   \t\tvar y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n   \t\tvar z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n   \t\tclassCallCheck(this, Vector3);\n\n\n   \t\t/**\r\n      * The x component.\r\n      *\r\n      * @property x\r\n      * @type Number\r\n      */\n\n   \t\tthis.x = x;\n\n   \t\t/**\r\n      * The y component.\r\n      *\r\n      * @property y\r\n      * @type Number\r\n      */\n\n   \t\tthis.y = y;\n\n   \t\t/**\r\n      * The z component.\r\n      *\r\n      * @property z\r\n      * @type Number\r\n      */\n\n   \t\tthis.z = z;\n   \t}\n\n   \t/**\r\n     * Sets the values of this vector\r\n     *\r\n     * @method set\r\n     * @chainable\r\n     * @param {Number} x - The x value.\r\n     * @param {Number} y - The y value.\r\n     * @param {Number} z - The z value.\r\n     * @return {Vector3} This vector.\r\n     */\n\n   \tcreateClass(Vector3, [{\n   \t\tkey: \"set\",\n   \t\tvalue: function set$$1(x, y, z) {\n\n   \t\t\tthis.x = x;\n   \t\t\tthis.y = y;\n   \t\t\tthis.z = z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Copies the values of another vector.\r\n      *\r\n      * @method copy\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"copy\",\n   \t\tvalue: function copy(v) {\n\n   \t\t\tthis.x = v.x;\n   \t\t\tthis.y = v.y;\n   \t\t\tthis.z = v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Copies values from an array.\r\n      *\r\n      * @method fromArray\r\n      * @chainable\r\n      * @param {Array} array - An array.\r\n      * @param {Number} offset - An offset.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"fromArray\",\n   \t\tvalue: function fromArray(array) {\n   \t\t\tvar offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n\n   \t\t\tthis.x = array[offset];\n   \t\t\tthis.y = array[offset + 1];\n   \t\t\tthis.z = array[offset + 2];\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Stores this vector in an array.\r\n      *\r\n      * @method toArray\r\n      * @param {Array} [array] - A target array.\r\n      * @param {Number} offset - An offset.\r\n      * @return {Vector3} The array.\r\n      */\n\n   \t}, {\n   \t\tkey: \"toArray\",\n   \t\tvalue: function toArray$$1() {\n   \t\t\tvar array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n   \t\t\tvar offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n\n   \t\t\tarray[offset] = this.x;\n   \t\t\tarray[offset + 1] = this.y;\n   \t\t\tarray[offset + 2] = this.z;\n\n   \t\t\treturn array;\n   \t\t}\n\n   \t\t/**\r\n      * Checks if this vector equals the given one.\r\n      *\r\n      * @method equals\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Boolean} Whether this vector equals the given one.\r\n      */\n\n   \t}, {\n   \t\tkey: \"equals\",\n   \t\tvalue: function equals(v) {\n\n   \t\t\treturn v.x === this.x && v.y === this.y && v.z === this.z;\n   \t\t}\n\n   \t\t/**\r\n      * Clones this vector.\r\n      *\r\n      * @method clone\r\n      * @return {Vector3} A clone of this vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"clone\",\n   \t\tvalue: function clone() {\n\n   \t\t\treturn new this.constructor(this.x, this.y, this.z);\n   \t\t}\n\n   \t\t/**\r\n      * Adds a vector to this one.\r\n      *\r\n      * @method add\r\n      * @chainable\r\n      * @param {Vector3} v - The vector to add.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"add\",\n   \t\tvalue: function add(v) {\n\n   \t\t\tthis.x += v.x;\n   \t\t\tthis.y += v.y;\n   \t\t\tthis.z += v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Adds a scaled vector to this one.\r\n      *\r\n      * @method addScaledVector\r\n      * @chainable\r\n      * @param {Vector3} v - The vector to scale and add.\r\n      * @param {Number} s - A scalar.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"addScaledVector\",\n   \t\tvalue: function addScaledVector(v, s) {\n\n   \t\t\tthis.x += v.x * s;\n   \t\t\tthis.y += v.y * s;\n   \t\t\tthis.z += v.z * s;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Adds a scalar to this vector.\r\n      *\r\n      * @method addScalar\r\n      * @chainable\r\n      * @param {Number} s - The scalar to add.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"addScalar\",\n   \t\tvalue: function addScalar(s) {\n\n   \t\t\tthis.x += s;\n   \t\t\tthis.y += s;\n   \t\t\tthis.z += s;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Sets this vector to the sum of two given vectors.\r\n      *\r\n      * @method addVectors\r\n      * @chainable\r\n      * @param {Vector3} a - A vector.\r\n      * @param {Vector3} b - Another vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"addVectors\",\n   \t\tvalue: function addVectors(a, b) {\n\n   \t\t\tthis.x = a.x + b.x;\n   \t\t\tthis.y = a.y + b.y;\n   \t\t\tthis.z = a.z + b.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Subtracts a vector from this vector.\r\n      *\r\n      * @method sub\r\n      * @chainable\r\n      * @param {Vector3} v - The vector to subtract.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"sub\",\n   \t\tvalue: function sub(v) {\n\n   \t\t\tthis.x -= v.x;\n   \t\t\tthis.y -= v.y;\n   \t\t\tthis.z -= v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Subtracts a scalar to this vector.\r\n      *\r\n      * @method subScalar\r\n      * @chainable\r\n      * @param {Number} s - The scalar to subtract.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"subScalar\",\n   \t\tvalue: function subScalar(s) {\n\n   \t\t\tthis.x -= s;\n   \t\t\tthis.y -= s;\n   \t\t\tthis.z -= s;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Sets this vector to the difference between two given vectors.\r\n      *\r\n      * @method subVectors\r\n      * @chainable\r\n      * @param {Vector3} a - A vector.\r\n      * @param {Vector3} b - A second vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"subVectors\",\n   \t\tvalue: function subVectors(a, b) {\n\n   \t\t\tthis.x = a.x - b.x;\n   \t\t\tthis.y = a.y - b.y;\n   \t\t\tthis.z = a.z - b.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Multiplies this vector with another vector.\r\n      *\r\n      * @method multiply\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"multiply\",\n   \t\tvalue: function multiply(v) {\n\n   \t\t\tthis.x *= v.x;\n   \t\t\tthis.y *= v.y;\n   \t\t\tthis.z *= v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Multiplies this vector with a given scalar.\r\n      *\r\n      * @method multiplyScalar\r\n      * @chainable\r\n      * @param {Number} s - A scalar.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"multiplyScalar\",\n   \t\tvalue: function multiplyScalar(s) {\n\n   \t\t\tif (isFinite(s)) {\n\n   \t\t\t\tthis.x *= s;\n   \t\t\t\tthis.y *= s;\n   \t\t\t\tthis.z *= s;\n   \t\t\t} else {\n\n   \t\t\t\tthis.x = 0;\n   \t\t\t\tthis.y = 0;\n   \t\t\t\tthis.z = 0;\n   \t\t\t}\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Sets this vector to the product of two given vectors.\r\n      *\r\n      * @method multiplyVectors\r\n      * @chainable\r\n      * @param {Vector3} a - A vector.\r\n      * @param {Vector3} b - Another vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"multiplyVectors\",\n   \t\tvalue: function multiplyVectors(a, b) {\n\n   \t\t\tthis.x = a.x * b.x;\n   \t\t\tthis.y = a.y * b.y;\n   \t\t\tthis.z = a.z * b.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Divides this vector by another vector.\r\n      *\r\n      * @method divide\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"divide\",\n   \t\tvalue: function divide(v) {\n\n   \t\t\tthis.x /= v.x;\n   \t\t\tthis.y /= v.y;\n   \t\t\tthis.z /= v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Divides this vector by a given scalar.\r\n      *\r\n      * @method divideScalar\r\n      * @chainable\r\n      * @param {Number} s - A scalar.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"divideScalar\",\n   \t\tvalue: function divideScalar(s) {\n\n   \t\t\treturn this.multiplyScalar(1 / s);\n   \t\t}\n\n   \t\t/**\r\n      * Sets this vector to the quotient of two given vectors.\r\n      *\r\n      * @method divideVectors\r\n      * @chainable\r\n      * @param {Vector3} a - A vector.\r\n      * @param {Vector3} b - Another vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"divideVectors\",\n   \t\tvalue: function divideVectors(a, b) {\n\n   \t\t\tthis.x = a.x / b.x;\n   \t\t\tthis.y = a.y / b.y;\n   \t\t\tthis.z = a.z / b.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Negates this vector.\r\n      *\r\n      * @method negate\r\n      * @chainable\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"negate\",\n   \t\tvalue: function negate() {\n\n   \t\t\tthis.x = -this.x;\n   \t\t\tthis.y = -this.y;\n   \t\t\tthis.z = -this.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the dot product with another vector.\r\n      *\r\n      * @method dot\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Number} The dot product.\r\n      */\n\n   \t}, {\n   \t\tkey: \"dot\",\n   \t\tvalue: function dot(v) {\n\n   \t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the squared length of this vector.\r\n      *\r\n      * @method lengthSq\r\n      * @return {Number} The squared length.\r\n      */\n\n   \t}, {\n   \t\tkey: \"lengthSq\",\n   \t\tvalue: function lengthSq() {\n\n   \t\t\treturn this.x * this.x + this.y * this.y + this.z * this.z;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the length of this vector.\r\n      *\r\n      * @method length\r\n      * @return {Number} The length.\r\n      */\n\n   \t}, {\n   \t\tkey: \"length\",\n   \t\tvalue: function length() {\n\n   \t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the distance to a given vector.\r\n      *\r\n      * @method distanceTo\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Number} The distance.\r\n      */\n\n   \t}, {\n   \t\tkey: \"distanceTo\",\n   \t\tvalue: function distanceTo(v) {\n\n   \t\t\treturn Math.sqrt(this.distanceToSquared(v));\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the squared distance to a given vector.\r\n      *\r\n      * @method distanceToSquared\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Number} The squared distance.\r\n      */\n\n   \t}, {\n   \t\tkey: \"distanceToSquared\",\n   \t\tvalue: function distanceToSquared(v) {\n\n   \t\t\tvar dx = this.x - v.x;\n   \t\t\tvar dy = this.y - v.y;\n   \t\t\tvar dz = this.z - v.z;\n\n   \t\t\treturn dx * dx + dy * dy + dz * dz;\n   \t\t}\n\n   \t\t/**\r\n      * Normalizes this vector.\r\n      *\r\n      * @method normalize\r\n      * @chainable\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"normalize\",\n   \t\tvalue: function normalize() {\n\n   \t\t\treturn this.divideScalar(this.length());\n   \t\t}\n\n   \t\t/**\r\n      * Adopts the min value for each component of this vector and the given one.\r\n      *\r\n      * @method min\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"min\",\n   \t\tvalue: function min(v) {\n\n   \t\t\tthis.x = Math.min(this.x, v.x);\n   \t\t\tthis.y = Math.min(this.y, v.y);\n   \t\t\tthis.z = Math.min(this.z, v.z);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * adopts the max value for each component of this vector and the given one.\r\n      *\r\n      * @method max\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"max\",\n   \t\tvalue: function max(v) {\n\n   \t\t\tthis.x = Math.max(this.x, v.x);\n   \t\t\tthis.y = Math.max(this.y, v.y);\n   \t\t\tthis.z = Math.max(this.z, v.z);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Clamps this vector.\r\n      *\r\n      * @method clamp\r\n      * @chainable\r\n      * @param {Vector3} min - A vector, assumed to be smaller than max.\r\n      * @param {Vector3} max - A vector, assumed to be greater than min.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"clamp\",\n   \t\tvalue: function clamp(min, max) {\n\n   \t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\n   \t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\n   \t\t\tthis.z = Math.max(min.z, Math.min(max.z, this.z));\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Applies a matrix to this vector.\r\n      *\r\n      * @method applyMatrix3\r\n      * @chainable\r\n      * @param {Matrix3} m - A matrix.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"applyMatrix3\",\n   \t\tvalue: function applyMatrix3(m) {\n\n   \t\t\tvar x = this.x,\n   \t\t\t    y = this.y,\n   \t\t\t    z = this.z;\n   \t\t\tvar e = m.elements;\n\n   \t\t\tthis.x = e[0] * x + e[3] * y + e[6] * z;\n   \t\t\tthis.y = e[1] * x + e[4] * y + e[7] * z;\n   \t\t\tthis.z = e[2] * x + e[5] * y + e[8] * z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Applies a matrix to this vector.\r\n      *\r\n      * @method applyMatrix4\r\n      * @chainable\r\n      * @param {Matrix4} m - A matrix.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"applyMatrix4\",\n   \t\tvalue: function applyMatrix4(m) {\n\n   \t\t\tvar x = this.x,\n   \t\t\t    y = this.y,\n   \t\t\t    z = this.z;\n   \t\t\tvar e = m.elements;\n\n   \t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z + e[12];\n   \t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z + e[13];\n   \t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z + e[14];\n\n   \t\t\treturn this;\n   \t\t}\n   \t}]);\n   \treturn Vector3;\n   }();\n\n   /**\r\n    * An octant.\r\n    *\r\n    * @class Octant\r\n    * @submodule core\r\n    * @constructor\r\n    * @param {Vector3} min - The lower bounds.\r\n    * @param {Vector3} max - The upper bounds.\r\n    */\n\n   var Octant = function () {\n   \tfunction Octant() {\n   \t\tvar min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();\n   \t\tvar max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();\n   \t\tclassCallCheck(this, Octant);\n\n\n   \t\t/**\r\n      * The lower bounds of this octant.\r\n      *\r\n      * @property min\r\n      * @type Vector3\r\n      */\n\n   \t\tthis.min = min;\n\n   \t\t/**\r\n      * The upper bounds of the octant.\r\n      *\r\n      * @property max\r\n      * @type Vector3\r\n      */\n\n   \t\tthis.max = max;\n\n   \t\t/**\r\n      * The children of this octant.\r\n      *\r\n      * @property children\r\n      * @type Array\r\n      * @default null\r\n      */\n\n   \t\tthis.children = null;\n   \t}\n\n   \t/**\r\n     * Computes the center of this octant.\r\n     *\r\n     * @method getCenter\r\n     * @return {Vector3} A new vector that describes the center of this octant.\r\n     */\n\n   \tcreateClass(Octant, [{\n   \t\tkey: \"getCenter\",\n   \t\tvalue: function getCenter() {\n   \t\t\treturn this.min.clone().add(this.max).multiplyScalar(0.5);\n   \t\t}\n\n   \t\t/**\r\n      * Computes the size of this octant.\r\n      *\r\n      * @method getDimensions\r\n      * @return {Vector3} A new vector that describes the size of this octant.\r\n      */\n\n   \t}, {\n   \t\tkey: \"getDimensions\",\n   \t\tvalue: function getDimensions() {\n   \t\t\treturn this.max.clone().sub(this.min);\n   \t\t}\n\n   \t\t/**\r\n      * Splits this octant into eight smaller ones.\r\n      *\r\n      * @method split\r\n      * @param {Array} [octants] - A list of octants to recycle.\r\n      */\n\n   \t}, {\n   \t\tkey: \"split\",\n   \t\tvalue: function split(octants) {\n\n   \t\t\tvar min = this.min;\n   \t\t\tvar max = this.max;\n   \t\t\tvar mid = this.getCenter();\n\n   \t\t\tvar i = void 0,\n   \t\t\t    j = void 0;\n   \t\t\tvar l = 0;\n   \t\t\tvar combination = void 0;\n\n   \t\t\tvar halfDimensions = void 0;\n   \t\t\tvar v = void 0,\n   \t\t\t    child = void 0,\n   \t\t\t    octant = void 0;\n\n   \t\t\tif (Array.isArray(octants)) {\n\n   \t\t\t\thalfDimensions = this.getDimensions().multiplyScalar(0.5);\n   \t\t\t\tv = [new Vector3(), new Vector3(), new Vector3()];\n   \t\t\t\tl = octants.length;\n   \t\t\t}\n\n   \t\t\tthis.children = [];\n\n   \t\t\tfor (i = 0; i < 8; ++i) {\n\n   \t\t\t\tcombination = PATTERN[i];\n   \t\t\t\toctant = null;\n\n   \t\t\t\tif (l > 0) {\n\n   \t\t\t\t\tv[1].addVectors(min, v[0].fromArray(combination).multiply(halfDimensions));\n   \t\t\t\t\tv[2].addVectors(mid, v[0].fromArray(combination).multiply(halfDimensions));\n\n   \t\t\t\t\t// Find an octant that matches the current combination.\n   \t\t\t\t\tfor (j = 0; j < l; ++j) {\n\n   \t\t\t\t\t\tchild = octants[j];\n\n   \t\t\t\t\t\tif (child !== null && v[1].equals(child.min) && v[2].equals(child.max)) {\n\n   \t\t\t\t\t\t\toctant = child;\n   \t\t\t\t\t\t\toctants[j] = null;\n\n   \t\t\t\t\t\t\tbreak;\n   \t\t\t\t\t\t}\n   \t\t\t\t\t}\n   \t\t\t\t}\n\n   \t\t\t\tthis.children.push(octant !== null ? octant : new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z)));\n   \t\t\t}\n   \t\t}\n   \t}]);\n   \treturn Octant;\n   }();\n\n   /**\r\n    * A binary pattern that describes the standard octant layout:\r\n    *\r\n    * <pre>\r\n    *    3____7\r\n    *  2/___6/|\r\n    *  | 1__|_5\r\n    *  0/___4/\r\n    * </pre>\r\n    *\r\n    * This common layout is crucial for positional assumptions.\r\n    *\r\n    * @property PATTERN\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n   var PATTERN = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];\n\n   /**\r\n    * Describes all possible octant corner connections.\r\n    *\r\n    * @property EDGES\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n   var EDGES = [\n\n   // X-Axis.\n   new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]),\n\n   // Y-Axis.\n   new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]),\n\n   // Z-Axis.\n   new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];\n\n   /**\r\n    * A cubic octant.\r\n    *\r\n    * @class CubicOctant\r\n    * @submodule core\r\n    * @constructor\r\n    * @param {Vector3} min - The lower bounds.\r\n    * @param {Number} [size=0] - The size of the octant.\r\n    */\n\n   var CubicOctant = function () {\n   \t\tfunction CubicOctant() {\n   \t\t\t\tvar min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();\n   \t\t\t\tvar size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n   \t\t\t\tclassCallCheck(this, CubicOctant);\n\n\n   \t\t\t\t/**\r\n        * The lower bounds of this octant.\r\n        *\r\n        * @property min\r\n        * @type Vector3\r\n        */\n\n   \t\t\t\tthis.min = min;\n\n   \t\t\t\t/**\r\n        * The size of this octant.\r\n        *\r\n        * @property size\r\n        * @type Number\r\n        */\n\n   \t\t\t\tthis.size = size;\n\n   \t\t\t\t/**\r\n        * The children of this octant.\r\n        *\r\n        * @property children\r\n        * @type Array\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.children = null;\n   \t\t}\n\n   \t\t/**\r\n      * The upper bounds of this octant.\r\n      *\r\n      * @property max\r\n      * @type Vector3\r\n      */\n\n   \t\tcreateClass(CubicOctant, [{\n   \t\t\t\tkey: \"getCenter\",\n\n\n   \t\t\t\t/**\r\n        * Computes the center of this octant.\r\n        *\r\n        * @method getCenter\r\n        * @return {Vector3} A new vector that describes the center of this octant.\r\n        */\n\n   \t\t\t\tvalue: function getCenter() {\n   \t\t\t\t\t\treturn this.min.clone().addScalar(this.size * 0.5);\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Returns the size of this octant as a vector.\r\n        *\r\n        * @method getDimensions\r\n        * @return {Vector3} A new vector that describes the size of this octant.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"getDimensions\",\n   \t\t\t\tvalue: function getDimensions() {\n   \t\t\t\t\t\treturn new Vector3(this.size, this.size, this.size);\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Splits this octant into eight smaller ones.\r\n        *\r\n        * @method split\r\n        * @param {Array} [octants] - A list of octants to recycle.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"split\",\n   \t\t\t\tvalue: function split(octants) {\n\n   \t\t\t\t\t\tvar min = this.min;\n   \t\t\t\t\t\tvar mid = this.getCenter();\n   \t\t\t\t\t\tvar halfSize = this.size * 0.5;\n\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    j = void 0;\n   \t\t\t\t\t\tvar l = 0;\n   \t\t\t\t\t\tvar combination = void 0;\n\n   \t\t\t\t\t\tvar v = void 0,\n   \t\t\t\t\t\t    child = void 0,\n   \t\t\t\t\t\t    octant = void 0;\n\n   \t\t\t\t\t\tif (Array.isArray(octants)) {\n\n   \t\t\t\t\t\t\t\tv = new Vector3();\n   \t\t\t\t\t\t\t\tl = octants.length;\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tthis.children = [];\n\n   \t\t\t\t\t\tfor (i = 0; i < 8; ++i) {\n\n   \t\t\t\t\t\t\t\tcombination = PATTERN[i];\n   \t\t\t\t\t\t\t\toctant = null;\n\n   \t\t\t\t\t\t\t\tif (l > 0) {\n\n   \t\t\t\t\t\t\t\t\t\tv.fromArray(combination).multiplyScalar(halfSize).add(min);\n\n   \t\t\t\t\t\t\t\t\t\t// Find an octant that matches the current combination.\n   \t\t\t\t\t\t\t\t\t\tfor (j = 0; j < l; ++j) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\tchild = octants[j];\n\n   \t\t\t\t\t\t\t\t\t\t\t\tif (child !== null && child.size === halfSize && v.equals(child.min)) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\toctant = child;\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\toctants[j] = null;\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n   \t\t\t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\tthis.children.push(octant !== null ? octant : new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize));\n   \t\t\t\t\t\t}\n   \t\t\t\t}\n   \t\t}, {\n   \t\t\t\tkey: \"max\",\n   \t\t\t\tget: function get$$1() {\n   \t\t\t\t\t\treturn this.min.clone().addScalar(this.size);\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn CubicOctant;\n   }();\n\n   /**\r\n    * A bounding box.\r\n    *\r\n    * @class Box3\r\n    * @submodule math\r\n    * @constructor\r\n    * @param {Vector3} [min] - The lower bounds.\r\n    * @param {Vector3} [max] - The upper bounds.\r\n    */\n\n   var Box3 = function () {\n   \tfunction Box3() {\n   \t\tvar min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3(Infinity, Infinity, Infinity);\n   \t\tvar max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3(-Infinity, -Infinity, -Infinity);\n   \t\tclassCallCheck(this, Box3);\n\n\n   \t\t/**\r\n      * The min bounds.\r\n      *\r\n      * @property min\r\n      * @type Vector3\r\n      */\n\n   \t\tthis.min = min;\n\n   \t\t/**\r\n      * The max bounds.\r\n      *\r\n      * @property max\r\n      * @type Vector3\r\n      */\n\n   \t\tthis.max = max;\n   \t}\n\n   \t/**\r\n     * Sets the values of this box.\r\n     *\r\n     * @method set\r\n     * @param {Number} min - The min bounds.\r\n     * @param {Number} max - The max bounds.\r\n     * @return {Matrix3} This box.\r\n     */\n\n   \tcreateClass(Box3, [{\n   \t\tkey: \"set\",\n   \t\tvalue: function set$$1(min, max) {\n\n   \t\t\tthis.min.copy(min);\n   \t\t\tthis.max.copy(max);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Copies the values of a given box.\r\n      *\r\n      * @method copy\r\n      * @param {Matrix3} b - A box.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"copy\",\n   \t\tvalue: function copy(b) {\n\n   \t\t\tthis.min.copy(b.min);\n   \t\t\tthis.max.copy(b.max);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Clones this matrix.\r\n      *\r\n      * @method clone\r\n      * @return {Matrix3} A clone of this matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"clone\",\n   \t\tvalue: function clone() {\n\n   \t\t\treturn new this.constructor().copy(this);\n   \t\t}\n\n   \t\t/**\r\n      * Expands this box by the given point.\r\n      *\r\n      * @method expandByPoint\r\n      * @param {Matrix3} p - A point.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"expandByPoint\",\n   \t\tvalue: function expandByPoint(p) {\n\n   \t\t\tthis.min.min(p);\n   \t\t\tthis.max.max(p);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Expands this box by combining it with the given one.\r\n      *\r\n      * @method union\r\n      * @param {Box3} b - A box.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"union\",\n   \t\tvalue: function union(b) {\n\n   \t\t\tthis.min.min(b.min);\n   \t\t\tthis.max.max(b.max);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Defines this box by the given points.\r\n      *\r\n      * @method setFromPoints\r\n      * @param {Array} points - The points.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"setFromPoints\",\n   \t\tvalue: function setFromPoints(points) {\n\n   \t\t\tvar i = void 0,\n   \t\t\t    l = void 0;\n\n   \t\t\tfor (i = 0, l = points.length; i < l; ++i) {\n\n   \t\t\t\tthis.expandByPoint(points[i]);\n   \t\t\t}\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Defines this box by the given center and size.\r\n      *\r\n      * @method setFromCenterAndSize\r\n      * @param {Vector3} center - The center.\r\n      * @param {Number} size - The size.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"setFromCenterAndSize\",\n   \t\tvalue: function setFromCenterAndSize(center, size) {\n\n   \t\t\tvar halfSize = size.clone().multiplyScalar(0.5);\n\n   \t\t\tthis.min.copy(center).sub(halfSize);\n   \t\t\tthis.max.copy(center).add(halfSize);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Checks if this box intersects with the given one.\r\n      *\r\n      * @method intersectsBox\r\n      * @param {Matrix3} box - A box.\r\n      * @return {Boolean} Whether the boxes intersect.\r\n      */\n\n   \t}, {\n   \t\tkey: \"intersectsBox\",\n   \t\tvalue: function intersectsBox(box) {\n\n   \t\t\treturn !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);\n   \t\t}\n   \t}]);\n   \treturn Box3;\n   }();\n\n   /**\r\n    * A basic iterator result.\r\n    *\r\n    * The next method of an iterator always has to return an object with\r\n    * appropriate properties including done and value.\r\n    *\r\n    * @class IteratorResult\r\n    * @constructor\r\n    * @param {Vector3} [value=null] - A value.\r\n    * @param {Vector3} [done=false] - Whether this result is past the end of the iterated sequence.\r\n    */\n\n   var IteratorResult = function () {\n   \tfunction IteratorResult() {\n   \t\tvar value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n   \t\tvar done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n   \t\tclassCallCheck(this, IteratorResult);\n\n\n   \t\t/**\r\n      * An arbitrary value returned by the iterator.\r\n      *\r\n      * @property value\r\n      * @type Object\r\n      * @default null\r\n      */\n\n   \t\tthis.value = value;\n\n   \t\t/**\r\n      * Whether this result is past the end of the iterated sequence.\r\n      *\r\n      * @property done\r\n      * @type Boolean\r\n      * @default false\r\n      */\n\n   \t\tthis.done = done;\n   \t}\n\n   \t/**\r\n     * Resets this iterator result.\r\n     *\r\n     * @method reset\r\n     */\n\n   \tcreateClass(IteratorResult, [{\n   \t\tkey: \"reset\",\n   \t\tvalue: function reset() {\n\n   \t\t\tthis.value = null;\n   \t\t\tthis.done = false;\n   \t\t}\n   \t}]);\n   \treturn IteratorResult;\n   }();\n\n   /**\r\n    * A computation helper.\r\n    *\r\n    * @property BOX3\r\n    * @type Box3\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var BOX3$1 = new Box3();\n\n   /**\r\n    * An octree iterator.\r\n    *\r\n    * @class OctreeIterator\r\n    * @submodule core\r\n    * @implements Iterator\r\n    * @constructor\r\n    * @param {Octree} octree - An octree.\r\n    * @param {Frustum|Box3} [region] - A cull region.\r\n    */\n\n   var OctreeIterator = function () {\n   \t\tfunction OctreeIterator(octree) {\n   \t\t\t\tvar region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n   \t\t\t\tclassCallCheck(this, OctreeIterator);\n\n\n   \t\t\t\t/**\r\n        * The octree.\r\n        *\r\n        * @property octree\r\n        * @type Octree\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.octree = octree;\n\n   \t\t\t\t/**\r\n        * A region used for octree culling.\r\n        *\r\n        * @property region\r\n        * @type Frustum|Box3\r\n        */\n\n   \t\t\t\tthis.region = region;\n\n   \t\t\t\t/**\r\n        * Whether this iterator should respect the cull region.\r\n        *\r\n        * @property cull\r\n        * @type Boolean\r\n        * @default false\r\n        */\n\n   \t\t\t\tthis.cull = region !== null;\n\n   \t\t\t\t/**\r\n        * An iterator result.\r\n        *\r\n        * @property result\r\n        * @type IteratorResult\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.result = new IteratorResult();\n\n   \t\t\t\t/**\r\n        * An octant trace.\r\n        *\r\n        * @property trace\r\n        * @type Array\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.trace = null;\n\n   \t\t\t\t/**\r\n        * Iteration indices.\r\n        *\r\n        * @property indices\r\n        * @type Array\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.indices = null;\n\n   \t\t\t\tthis.reset();\n   \t\t}\n\n   \t\t/**\r\n      * Resets this iterator.\r\n      *\r\n      * @method reset\r\n      * @chainable\r\n      * @return {OctreeIterator} This iterator.\r\n      */\n\n   \t\tcreateClass(OctreeIterator, [{\n   \t\t\t\tkey: \"reset\",\n   \t\t\t\tvalue: function reset() {\n\n   \t\t\t\t\t\tvar root = this.octree.root;\n\n   \t\t\t\t\t\tthis.trace = [];\n   \t\t\t\t\t\tthis.indices = [];\n\n   \t\t\t\t\t\tif (root !== null) {\n\n   \t\t\t\t\t\t\t\tBOX3$1.min = root.min;\n   \t\t\t\t\t\t\t\tBOX3$1.max = root.max;\n\n   \t\t\t\t\t\t\t\tif (!this.cull || this.region.intersectsBox(BOX3$1)) {\n\n   \t\t\t\t\t\t\t\t\t\tthis.trace.push(root);\n   \t\t\t\t\t\t\t\t\t\tthis.indices.push(0);\n   \t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tthis.result.reset();\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Iterates over the leaf octants.\r\n        *\r\n        * @method next\r\n        * @return {IteratorResult} The next leaf octant.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"next\",\n   \t\t\t\tvalue: function next() {\n\n   \t\t\t\t\t\tvar cull = this.cull;\n   \t\t\t\t\t\tvar region = this.region;\n   \t\t\t\t\t\tvar indices = this.indices;\n   \t\t\t\t\t\tvar trace = this.trace;\n\n   \t\t\t\t\t\tvar octant = null;\n   \t\t\t\t\t\tvar depth = trace.length - 1;\n\n   \t\t\t\t\t\tvar index = void 0,\n   \t\t\t\t\t\t    children = void 0,\n   \t\t\t\t\t\t    child = void 0;\n\n   \t\t\t\t\t\twhile (octant === null && depth >= 0) {\n\n   \t\t\t\t\t\t\t\tindex = indices[depth];\n   \t\t\t\t\t\t\t\tchildren = trace[depth].children;\n\n   \t\t\t\t\t\t\t\t++indices[depth];\n\n   \t\t\t\t\t\t\t\tif (index < 8) {\n\n   \t\t\t\t\t\t\t\t\t\tif (children !== null) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\tchild = children[index];\n\n   \t\t\t\t\t\t\t\t\t\t\t\tif (cull) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tBOX3$1.min = child.min;\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tBOX3$1.max = child.max;\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tif (!region.intersectsBox(BOX3$1)) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t// Cull this octant.\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcontinue;\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\t\t\t\t\ttrace.push(child);\n   \t\t\t\t\t\t\t\t\t\t\t\tindices.push(0);\n\n   \t\t\t\t\t\t\t\t\t\t\t\t++depth;\n   \t\t\t\t\t\t\t\t\t\t} else {\n\n   \t\t\t\t\t\t\t\t\t\t\t\toctant = trace.pop();\n   \t\t\t\t\t\t\t\t\t\t\t\tindices.pop();\n   \t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t} else {\n\n   \t\t\t\t\t\t\t\t\t\ttrace.pop();\n   \t\t\t\t\t\t\t\t\t\tindices.pop();\n\n   \t\t\t\t\t\t\t\t\t\t--depth;\n   \t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tthis.result.value = octant;\n   \t\t\t\t\t\tthis.result.done = octant === null;\n\n   \t\t\t\t\t\treturn this.result;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Called when this iterator will no longer be run to completion.\r\n        *\r\n        * @method return\r\n        * @param {Object} value - An interator result value.\r\n        * @return {IteratorResult} - A premature completion result.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"return\",\n   \t\t\t\tvalue: function _return(value) {\n\n   \t\t\t\t\t\tthis.result.value = value;\n   \t\t\t\t\t\tthis.result.done = true;\n\n   \t\t\t\t\t\treturn this.result;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Returns this iterator.\r\n        *\r\n        * @method Symbol.iterator\r\n        * @return {VoxelIterator} An iterator.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: Symbol.iterator,\n   \t\t\t\tvalue: function value() {\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn OctreeIterator;\n   }();\n\n   /**\r\n    * Contains bytes used for bitwise operations. The last byte is used to store\r\n    * raycasting flags.\r\n    *\r\n    * @property flags\r\n    * @type Uint8Array\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);\n\n   /**\r\n    * A lookup-table containing octant ids. Used to determine the exit plane from\r\n    * an octant.\r\n    *\r\n    * @property octantTable\r\n    * @type Array\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];\n\n   /**\r\n    * Finds the entry plane of the first octant that a ray travels through.\r\n    *\r\n    * Determining the first octant requires knowing which of the t0's is the\r\n    * largest. The tm's of the other axes must also be compared against that\r\n    * largest t0.\r\n    *\r\n    * @method findEntryOctant\r\n    * @private\r\n    * @static\r\n    * @param {Number} tx0 - Ray projection parameter.\r\n    * @param {Number} ty0 - Ray projection parameter.\r\n    * @param {Number} tz0 - Ray projection parameter.\r\n    * @param {Number} txm - Ray projection parameter mean.\r\n    * @param {Number} tym - Ray projection parameter mean.\r\n    * @param {Number} tzm - Ray projection parameter mean.\r\n    * @return {Number} The index of the first octant that the ray travels through.\r\n    */\n\n   function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {\n\n   \tvar entry = 0;\n\n   \t// Find the entry plane.\n   \tif (tx0 > ty0 && tx0 > tz0) {\n\n   \t\t// YZ-plane.\n   \t\tif (tym < tx0) {\n   \t\t\tentry = entry | 2;\n   \t\t}\n   \t\tif (tzm < tx0) {\n   \t\t\tentry = entry | 1;\n   \t\t}\n   \t} else if (ty0 > tz0) {\n\n   \t\t// XZ-plane.\n   \t\tif (txm < ty0) {\n   \t\t\tentry = entry | 4;\n   \t\t}\n   \t\tif (tzm < ty0) {\n   \t\t\tentry = entry | 1;\n   \t\t}\n   \t} else {\n\n   \t\t// XY-plane.\n   \t\tif (txm < tz0) {\n   \t\t\tentry = entry | 4;\n   \t\t}\n   \t\tif (tym < tz0) {\n   \t\t\tentry = entry | 2;\n   \t\t}\n   \t}\n\n   \treturn entry;\n   }\n\n   /**\r\n    * Finds the next octant that intersects with the ray based on the exit plane of\r\n    * the current one.\r\n    *\r\n    * @method findNextOctant\r\n    * @private\r\n    * @static\r\n    * @param {Number} currentOctant - The index of the current octant.\r\n    * @param {Number} tx1 - Ray projection parameter.\r\n    * @param {Number} ty1 - Ray projection parameter.\r\n    * @param {Number} tz1 - Ray projection parameter.\r\n    * @return {Number} The index of the next octant that the ray travels through.\r\n    */\n\n   function findNextOctant(currentOctant, tx1, ty1, tz1) {\n\n   \tvar min = void 0;\n   \tvar exit = 0;\n\n   \t// Find the exit plane.\n   \tif (tx1 < ty1) {\n\n   \t\tmin = tx1;\n   \t\texit = 0; // YZ-plane.\n   \t} else {\n\n   \t\tmin = ty1;\n   \t\texit = 1; // XZ-plane.\n   \t}\n\n   \tif (tz1 < min) {\n\n   \t\texit = 2; // XY-plane.\n   \t}\n\n   \treturn octantTable[currentOctant][exit];\n   }\n\n   /**\r\n    * Finds all octants that intersect with the given ray.\r\n    *\r\n    * @method raycastOctant\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - The current octant.\r\n    * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.\r\n    * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.\r\n    * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.\r\n    * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.\r\n    * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.\r\n    * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.\r\n    * @param {Raycaster} raycaster - The raycaster.\r\n    * @param {Array} intersects - An array to be filled with the intersecting octants.\r\n    */\n\n   function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {\n\n   \tvar children = octant.children;\n\n   \tvar currentOctant = void 0;\n   \tvar txm = void 0,\n   \t    tym = void 0,\n   \t    tzm = void 0;\n\n   \tif (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {\n\n   \t\tif (children === null) {\n\n   \t\t\t// Leaf.\n   \t\t\tintersects.push(octant);\n   \t\t} else {\n\n   \t\t\t// Compute means.\n   \t\t\ttxm = 0.5 * (tx0 + tx1);\n   \t\t\ttym = 0.5 * (ty0 + ty1);\n   \t\t\ttzm = 0.5 * (tz0 + tz1);\n\n   \t\t\tcurrentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);\n\n   \t\t\tdo {\n\n   \t\t\t\t/* The possibilities for the next node are passed in the same respective\r\n        * order as the t-values. Hence, if the first value is found to be the\r\n        * greatest, the fourth one will be returned. If the second value is the\r\n        * greatest, the fifth one will be returned, etc.\r\n        */\n\n   \t\t\t\tswitch (currentOctant) {\n\n   \t\t\t\t\tcase 0:\n   \t\t\t\t\t\traycastOctant(children[flags[8]], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);\n   \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, tym, tzm);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase 1:\n   \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[1]], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);\n   \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, tym, tz1);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase 2:\n   \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[2]], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);\n   \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, ty1, tzm);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase 3:\n   \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[3]], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);\n   \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, ty1, tz1);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase 4:\n   \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[4]], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);\n   \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, tym, tzm);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase 5:\n   \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[5]], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);\n   \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, tym, tz1);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase 6:\n   \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[6]], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);\n   \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase 7:\n   \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[7]], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);\n   \t\t\t\t\t\t// Far top right octant. No other octants can be reached from here.\n   \t\t\t\t\t\tcurrentOctant = 8;\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t}\n   \t\t\t} while (currentOctant < 8);\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * An octree raycaster.\r\n    *\r\n    * Based on:\r\n    *  \"An Efficient Parametric Algorithm for Octree Traversal\"\r\n    *  by J. Revelles et al. (2000).\r\n    *\r\n    * @class OctreeRaycaster\r\n    * @submodule core\r\n    * @static\r\n    */\n\n   var OctreeRaycaster = function () {\n   \tfunction OctreeRaycaster() {\n   \t\tclassCallCheck(this, OctreeRaycaster);\n   \t}\n\n   \tcreateClass(OctreeRaycaster, null, [{\n   \t\tkey: \"intersectOctree\",\n\n\n   \t\t/**\r\n      * Finds the octants that intersect with the given ray. The intersecting\r\n      * octants are sorted by distance, closest first.\r\n      *\r\n      * @method intersectOctree\r\n      * @static\r\n      * @param {Octree} octree - An octree.\r\n      * @param {Raycaster} raycaster - A raycaster.\r\n      * @param {Array} intersects - A list to be filled with intersecting octants.\r\n      */\n\n   \t\tvalue: function intersectOctree(octree, raycaster, intersects) {\n\n   \t\t\tvar dimensions = octree.getDimensions();\n   \t\t\tvar halfDimensions = dimensions.clone().multiplyScalar(0.5);\n\n   \t\t\t// Translate the octree extents to the center of the octree.\n   \t\t\tvar min = octree.min.clone().sub(octree.min);\n   \t\t\tvar max = octree.max.clone().sub(octree.min);\n\n   \t\t\tvar direction = raycaster.ray.direction.clone();\n   \t\t\tvar origin = raycaster.ray.origin.clone();\n\n   \t\t\t// Translate the ray to the center of the octree.\n   \t\t\torigin.sub(octree.getCenter()).add(halfDimensions);\n\n   \t\t\tvar invDirX = void 0,\n   \t\t\t    invDirY = void 0,\n   \t\t\t    invDirZ = void 0;\n   \t\t\tvar tx0 = void 0,\n   \t\t\t    tx1 = void 0,\n   \t\t\t    ty0 = void 0,\n   \t\t\t    ty1 = void 0,\n   \t\t\t    tz0 = void 0,\n   \t\t\t    tz1 = void 0;\n\n   \t\t\t// Reset the last byte.\n   \t\t\tflags[8] = flags[0];\n\n   \t\t\t// Handle rays with negative directions.\n   \t\t\tif (direction.x < 0.0) {\n\n   \t\t\t\torigin.x = dimensions.x - origin.x;\n   \t\t\t\tdirection.x = -direction.x;\n   \t\t\t\tflags[8] |= flags[4];\n   \t\t\t}\n\n   \t\t\tif (direction.y < 0.0) {\n\n   \t\t\t\torigin.y = dimensions.y - origin.y;\n   \t\t\t\tdirection.y = -direction.y;\n   \t\t\t\tflags[8] |= flags[2];\n   \t\t\t}\n\n   \t\t\tif (direction.z < 0.0) {\n\n   \t\t\t\torigin.z = dimensions.z - origin.z;\n   \t\t\t\tdirection.z = -direction.z;\n   \t\t\t\tflags[8] |= flags[1];\n   \t\t\t}\n\n   \t\t\t// Improve IEEE double stability.\n   \t\t\tinvDirX = 1.0 / direction.x;\n   \t\t\tinvDirY = 1.0 / direction.y;\n   \t\t\tinvDirZ = 1.0 / direction.z;\n\n   \t\t\t// Project the ray to the root's boundaries.\n   \t\t\ttx0 = (min.x - origin.x) * invDirX;\n   \t\t\ttx1 = (max.x - origin.x) * invDirX;\n   \t\t\tty0 = (min.y - origin.y) * invDirY;\n   \t\t\tty1 = (max.y - origin.y) * invDirY;\n   \t\t\ttz0 = (min.z - origin.z) * invDirZ;\n   \t\t\ttz1 = (max.z - origin.z) * invDirZ;\n\n   \t\t\t// Check if the ray hits the octree.\n   \t\t\tif (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {\n\n   \t\t\t\traycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);\n   \t\t\t}\n   \t\t}\n   \t}]);\n   \treturn OctreeRaycaster;\n   }();\n\n   /**\r\n    * A computation helper.\r\n    *\r\n    * @property BOX3\r\n    * @type Box3\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var BOX3 = new Box3();\n\n   /**\r\n    * Recursively calculates the depth of the given octree.\r\n    *\r\n    * @method getDepth\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @return {Number} The depth.\r\n    */\n\n   function _getDepth(octant) {\n\n   \tvar children = octant.children;\n\n   \tvar result = 0;\n   \tvar i = void 0,\n   \t    l = void 0,\n   \t    d = void 0;\n\n   \tif (children !== null) {\n\n   \t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\td = 1 + _getDepth(children[i]);\n\n   \t\t\tif (d > result) {\n\n   \t\t\t\tresult = d;\n   \t\t\t}\n   \t\t}\n   \t}\n\n   \treturn result;\n   }\n\n   /**\r\n    * Recursively collects octants that lie inside the specified region.\r\n    *\r\n    * @method cull\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Frustum|Box3} region - A region.\r\n    * @param {Array} result - A list to be filled with octants that intersect with the region.\r\n    */\n\n   function _cull(octant, region, result) {\n\n   \tvar children = octant.children;\n\n   \tvar i = void 0,\n   \t    l = void 0;\n\n   \tBOX3.min = octant.min;\n   \tBOX3.max = octant.max;\n\n   \tif (region.intersectsBox(BOX3)) {\n\n   \t\tif (children !== null) {\n\n   \t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\t\t_cull(children[i], region, result);\n   \t\t\t}\n   \t\t} else {\n\n   \t\t\tresult.push(octant);\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * Recursively fetches all octants with the specified depth level.\r\n    *\r\n    * @method findOctantsByLevel\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Number} level - The target depth level.\r\n    * @param {Number} depth - The current depth level.\r\n    * @param {Array} result - A list to be filled with the identified octants.\r\n    */\n\n   function _findOctantsByLevel(octant, level, depth, result) {\n\n   \tvar children = octant.children;\n\n   \tvar i = void 0,\n   \t    l = void 0;\n\n   \tif (depth === level) {\n\n   \t\tresult.push(octant);\n   \t} else if (children !== null) {\n\n   \t\t++depth;\n\n   \t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\t_findOctantsByLevel(children[i], level, depth, result);\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * An octree that subdivides space for fast spatial searches.\r\n    *\r\n    * @class Octree\r\n    * @submodule core\r\n    * @implements Iterable\r\n    * @constructor\r\n    * @param {Vector3} [min] - The lower bounds of the tree.\r\n    * @param {Vector3} [max] - The upper bounds of the tree.\r\n    */\n\n   var Octree = function () {\n   \tfunction Octree(min, max) {\n   \t\tclassCallCheck(this, Octree);\n\n\n   \t\t/**\r\n      * The root octant.\r\n      *\r\n      * @property root\r\n      * @type Octant\r\n      * @default null\r\n      */\n\n   \t\tthis.root = min !== undefined && max !== undefined ? new Octant(min, max) : null;\n   \t}\n\n   \t/**\r\n     * The lower bounds of the root octant.\r\n     *\r\n     * @property min\r\n     * @type Vector3\r\n     */\n\n   \tcreateClass(Octree, [{\n   \t\tkey: \"getCenter\",\n\n\n   \t\t/**\r\n      * Calculates the center of this octree.\r\n      *\r\n      * @method getCenter\r\n      * @return {Vector3} A new vector that describes the center of this octree.\r\n      */\n\n   \t\tvalue: function getCenter() {\n   \t\t\treturn this.root.getCenter();\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the size of this octree.\r\n      *\r\n      * @method getDimensions\r\n      * @return {Vector3} A new vector that describes the size of this octree.\r\n      */\n\n   \t}, {\n   \t\tkey: \"getDimensions\",\n   \t\tvalue: function getDimensions() {\n   \t\t\treturn this.root.getDimensions();\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the current depth of this octree.\r\n      *\r\n      * @method getDepth\r\n      * @return {Number} The depth.\r\n      */\n\n   \t}, {\n   \t\tkey: \"getDepth\",\n   \t\tvalue: function getDepth() {\n\n   \t\t\treturn _getDepth(this.root);\n   \t\t}\n\n   \t\t/**\r\n      * Recursively collects octants that intersect with the specified region.\r\n      *\r\n      * @method cull\r\n      * @param {Frustum|Box3} region - A region.\r\n      * @return {Array} The octants.\r\n      */\n\n   \t}, {\n   \t\tkey: \"cull\",\n   \t\tvalue: function cull(region) {\n\n   \t\t\tvar result = [];\n\n   \t\t\t_cull(this.root, region, result);\n\n   \t\t\treturn result;\n   \t\t}\n\n   \t\t/**\r\n      * Fetches all octants with the specified depth level.\r\n      *\r\n      * @method findOctantsByLevel\r\n      * @param {Number} level - The depth level.\r\n      * @return {Array} The octants.\r\n      */\n\n   \t}, {\n   \t\tkey: \"findOctantsByLevel\",\n   \t\tvalue: function findOctantsByLevel(level) {\n\n   \t\t\tvar result = [];\n\n   \t\t\t_findOctantsByLevel(this.root, level, 0, result);\n\n   \t\t\treturn result;\n   \t\t}\n\n   \t\t/**\r\n      * Finds the octants that intersect with the given ray. The intersecting\r\n      * octants are sorted by distance, closest first.\r\n      *\r\n      * @method raycast\r\n      * @param {Raycaster} raycaster - A raycaster.\r\n      * @param {Array} [intersects] - A list to be filled with intersecting octants.\r\n      * @return {Array} The intersecting octants.\r\n      */\n\n   \t}, {\n   \t\tkey: \"raycast\",\n   \t\tvalue: function raycast(raycaster) {\n   \t\t\tvar intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n\n\n   \t\t\tOctreeRaycaster.intersectOctree(this, raycaster, intersects);\n\n   \t\t\treturn intersects;\n   \t\t}\n\n   \t\t/**\r\n      * Returns an iterator that traverses the octree and returns leaf nodes.\r\n      *\r\n      * When a cull region is provided, the iterator will only return leaves that\r\n      * intersect with that region.\r\n      *\r\n      * @method leaves\r\n      * @param {Frustum|Box3} [region] - A cull region.\r\n      * @return {OctreeIterator} An iterator.\r\n      */\n\n   \t}, {\n   \t\tkey: \"leaves\",\n   \t\tvalue: function leaves(region) {\n\n   \t\t\treturn new OctreeIterator(this, region);\n   \t\t}\n\n   \t\t/**\r\n      * Returns an iterator that traverses the octree and returns all leaf nodes.\r\n      *\r\n      * @method Symbol.iterator\r\n      * @return {OctreeIterator} An iterator.\r\n      */\n\n   \t}, {\n   \t\tkey: Symbol.iterator,\n   \t\tvalue: function value() {\n\n   \t\t\treturn new OctreeIterator(this);\n   \t\t}\n   \t}, {\n   \t\tkey: \"min\",\n   \t\tget: function get$$1() {\n   \t\t\treturn this.root.min;\n   \t\t}\n\n   \t\t/**\r\n      * The upper bounds of the root octant.\r\n      *\r\n      * @property max\r\n      * @type Vector3\r\n      */\n\n   \t}, {\n   \t\tkey: \"max\",\n   \t\tget: function get$$1() {\n   \t\t\treturn this.root.max;\n   \t\t}\n\n   \t\t/**\r\n      * The children of the root octant.\r\n      *\r\n      * @property children\r\n      * @type Array\r\n      */\n\n   \t}, {\n   \t\tkey: \"children\",\n   \t\tget: function get$$1() {\n   \t\t\treturn this.root.children;\n   \t\t}\n   \t}]);\n   \treturn Octree;\n   }();\n\n   /**\r\n    * Core components.\r\n    *\r\n    * @module sparse-octree\r\n    * @submodule core\r\n    */\n\n   /**\r\n    * Math components.\r\n    *\r\n    * @module sparse-octree\r\n    * @submodule math\r\n    */\n\n   /**\r\n    * An octant that maintains points.\r\n    *\r\n    * @class PointOctant\r\n    * @submodule points\r\n    * @extends Octant\r\n    * @constructor\r\n    * @param {Vector3} min - The lower bounds.\r\n    * @param {Vector3} max - The upper bounds.\r\n    */\n\n   var PointOctant = function (_Octant) {\n   \t\tinherits(PointOctant, _Octant);\n\n   \t\tfunction PointOctant(min, max) {\n   \t\t\t\tclassCallCheck(this, PointOctant);\n\n   \t\t\t\t/**\r\n        * The points that are inside this octant.\r\n        *\r\n        * @property points\r\n        * @type Array\r\n        */\n\n   \t\t\t\tvar _this = possibleConstructorReturn(this, (PointOctant.__proto__ || Object.getPrototypeOf(PointOctant)).call(this, min, max));\n\n   \t\t\t\t_this.points = null;\n\n   \t\t\t\t/**\r\n        * Point data.\r\n        *\r\n        * @property data\r\n        * @type Array\r\n        */\n\n   \t\t\t\t_this.data = null;\n\n   \t\t\t\treturn _this;\n   \t\t}\n\n   \t\t/**\r\n      * Computes the distance squared from this octant to the given point.\r\n      *\r\n      * @method distanceToSquared\r\n      * @param {Vector3} p - A point.\r\n      * @return {Number} The distance squared.\r\n      */\n\n   \t\tcreateClass(PointOctant, [{\n   \t\t\t\tkey: \"distanceToSquared\",\n   \t\t\t\tvalue: function distanceToSquared(p) {\n\n   \t\t\t\t\t\tvar clampedPoint = p.clone().clamp(this.min, this.max);\n\n   \t\t\t\t\t\treturn clampedPoint.sub(p).lengthSq();\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Computes the distance squared from the center of this octant to the given\r\n        * point.\r\n        *\r\n        * @method distanceToCenterSquared\r\n        * @param {Vector3} p - A point.\r\n        * @return {Number} The distance squared.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"distanceToCenterSquared\",\n   \t\t\t\tvalue: function distanceToCenterSquared(p) {\n\n   \t\t\t\t\t\tvar center = this.getCenter();\n\n   \t\t\t\t\t\tvar dx = p.x - center.x;\n   \t\t\t\t\t\tvar dy = p.y - center.x;\n   \t\t\t\t\t\tvar dz = p.z - center.z;\n\n   \t\t\t\t\t\treturn dx * dx + dy * dy + dz * dz;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Checks if the given point lies inside this octant's boundaries.\r\n        *\r\n        * This method can also be used to check if this octant intersects a sphere by\r\n        * providing a radius as bias.\r\n        *\r\n        * @method contains\r\n        * @param {Vector3} p - A point.\r\n        * @param {Number} bias - A padding that extends the boundaries temporarily.\r\n        * @return {Boolean} Whether the given point lies inside this octant.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"contains\",\n   \t\t\t\tvalue: function contains(p, bias) {\n\n   \t\t\t\t\t\tvar min = this.min;\n   \t\t\t\t\t\tvar max = this.max;\n\n   \t\t\t\t\t\treturn p.x >= min.x - bias && p.y >= min.y - bias && p.z >= min.z - bias && p.x <= max.x + bias && p.y <= max.y + bias && p.z <= max.z + bias;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Redistributes existing points to child octants.\r\n        *\r\n        * @method redistribute\r\n        * @param {Number} bias - A proximity threshold.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"redistribute\",\n   \t\t\t\tvalue: function redistribute(bias) {\n\n   \t\t\t\t\t\tvar children = this.children;\n   \t\t\t\t\t\tvar points = this.points;\n   \t\t\t\t\t\tvar data = this.data;\n\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    l = void 0;\n   \t\t\t\t\t\tvar child = void 0,\n   \t\t\t\t\t\t    point = void 0,\n   \t\t\t\t\t\t    entry = void 0;\n\n   \t\t\t\t\t\tif (children !== null) {\n\n   \t\t\t\t\t\t\t\twhile (points.length > 0) {\n\n   \t\t\t\t\t\t\t\t\t\tpoint = points.pop();\n   \t\t\t\t\t\t\t\t\t\tentry = data.pop();\n\n   \t\t\t\t\t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\tchild = children[i];\n\n   \t\t\t\t\t\t\t\t\t\t\t\tif (child.contains(point, bias)) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tif (child.points === null) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchild.points = [];\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchild.data = [];\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tchild.points.push(point);\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tchild.data.push(entry);\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n   \t\t\t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tthis.points = null;\n   \t\t\t\t\t\tthis.data = null;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Gathers all points from the children. The children are expected to be leaf\r\n        * octants and will be dropped afterwards.\r\n        *\r\n        * @method merge\r\n        * @private\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"merge\",\n   \t\t\t\tvalue: function merge() {\n\n   \t\t\t\t\t\tvar children = this.children;\n\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    l = void 0;\n   \t\t\t\t\t\tvar child = void 0;\n\n   \t\t\t\t\t\tif (children !== null) {\n\n   \t\t\t\t\t\t\t\tthis.points = [];\n   \t\t\t\t\t\t\t\tthis.data = [];\n\n   \t\t\t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\t\t\tchild = children[i];\n\n   \t\t\t\t\t\t\t\t\t\tif (child.points !== null) {\n   \t\t\t\t\t\t\t\t\t\t\t\tvar _points, _data;\n\n   \t\t\t\t\t\t\t\t\t\t\t\t(_points = this.points).push.apply(_points, toConsumableArray(child.points));\n   \t\t\t\t\t\t\t\t\t\t\t\t(_data = this.data).push.apply(_data, toConsumableArray(child.data));\n   \t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\tthis.children = null;\n   \t\t\t\t\t\t}\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn PointOctant;\n   }(Octant);\n\n   /**\r\n    * Recursively counts how many points are in the given octree.\r\n    *\r\n    * @method countPoints\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @return {Number} The amount of points.\r\n    */\n\n   function _countPoints(octant) {\n\n   \tvar children = octant.children;\n\n   \tvar result = 0;\n   \tvar i = void 0,\n   \t    l = void 0;\n\n   \tif (children !== null) {\n\n   \t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\tresult += _countPoints(children[i]);\n   \t\t}\n   \t} else if (octant.points !== null) {\n\n   \t\tresult = octant.points.length;\n   \t}\n\n   \treturn result;\n   }\n\n   /**\r\n    * Recursively adds a point to the octree.\r\n    *\r\n    * @method add\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Vector3} p - A point.\r\n    * @param {Object} data - An object that the point represents.\r\n    * @param {Number} depth - The current depth.\r\n    * @param {Number} bias - A threshold for proximity checks.\r\n    * @param {Number} maxPoints - Number of distinct points per octant before it splits up.\r\n    * @param {Number} maxDepth - The maximum tree depth level, starting at 0.\r\n    */\n\n   function _add(octant, p, data, depth, bias, maxPoints, maxDepth) {\n\n   \tvar children = octant.children;\n   \tvar exists = false;\n   \tvar done = false;\n   \tvar i = void 0,\n   \t    l = void 0;\n\n   \tif (octant.contains(p, bias)) {\n\n   \t\tif (children === null) {\n\n   \t\t\tif (octant.points === null) {\n\n   \t\t\t\toctant.points = [];\n   \t\t\t\toctant.data = [];\n   \t\t\t} else {\n\n   \t\t\t\tfor (i = 0, l = octant.points.length; !exists && i < l; ++i) {\n\n   \t\t\t\t\texists = octant.points[i].equals(p);\n   \t\t\t\t}\n   \t\t\t}\n\n   \t\t\tif (exists) {\n\n   \t\t\t\toctant.data[i - 1] = data;\n\n   \t\t\t\tdone = true;\n   \t\t\t} else if (octant.points.length < maxPoints || depth === maxDepth) {\n\n   \t\t\t\toctant.points.push(p.clone());\n   \t\t\t\toctant.data.push(data);\n\n   \t\t\t\tdone = true;\n   \t\t\t} else {\n\n   \t\t\t\toctant.split();\n   \t\t\t\toctant.redistribute(bias);\n   \t\t\t\tchildren = octant.children;\n   \t\t\t}\n   \t\t}\n\n   \t\tif (children !== null) {\n\n   \t\t\t++depth;\n\n   \t\t\tfor (i = 0, l = children.length; !done && i < l; ++i) {\n\n   \t\t\t\tdone = _add(children[i], p, data, depth, bias, maxPoints, maxDepth);\n   \t\t\t}\n   \t\t}\n   \t}\n\n   \treturn done;\n   }\n\n   /**\r\n    * Recursively finds a point in the octree and removes it.\r\n    *\r\n    * @method remove\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Octant} parent - The parent of the octant.\r\n    * @param {Vector3} p - A point.\r\n    * @param {Number} bias - A threshold for proximity checks.\r\n    * @param {Number} maxPoints - Number of distinct points per octant before it splits up.\r\n    */\n\n   function _remove(octant, parent, p, bias, maxPoints) {\n\n   \tvar children = octant.children;\n\n   \tvar done = false;\n\n   \tvar i = void 0,\n   \t    l = void 0;\n   \tvar points = void 0,\n   \t    data = void 0,\n   \t    last = void 0;\n\n   \tif (octant.contains(p, bias)) {\n\n   \t\tif (children !== null) {\n\n   \t\t\tfor (i = 0, l = children.length; !done && i < l; ++i) {\n\n   \t\t\t\tdone = _remove(children[i], octant, p, bias, maxPoints);\n   \t\t\t}\n   \t\t} else if (octant.points !== null) {\n\n   \t\t\tpoints = octant.points;\n   \t\t\tdata = octant.data;\n\n   \t\t\tfor (i = 0, l = points.length; !done && i < l; ++i) {\n\n   \t\t\t\tif (points[i].equals(p)) {\n\n   \t\t\t\t\tlast = l - 1;\n\n   \t\t\t\t\t// If the point is NOT the last one in the array:\n   \t\t\t\t\tif (i < last) {\n\n   \t\t\t\t\t\t// Overwrite with the last point and data entry.\n   \t\t\t\t\t\tpoints[i] = points[last];\n   \t\t\t\t\t\tdata[i] = data[last];\n   \t\t\t\t\t}\n\n   \t\t\t\t\t// Drop the last entry.\n   \t\t\t\t\tpoints.pop();\n   \t\t\t\t\tdata.pop();\n\n   \t\t\t\t\tif (parent !== null && _countPoints(parent) <= maxPoints) {\n\n   \t\t\t\t\t\tparent.merge();\n   \t\t\t\t\t}\n\n   \t\t\t\t\tdone = true;\n   \t\t\t\t}\n   \t\t\t}\n   \t\t}\n   \t}\n\n   \treturn done;\n   }\n\n   /**\r\n    * Recursively finds a point in the octree and fetches the associated data.\r\n    *\r\n    * @method fetch\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Vector3} p - A point.\r\n    * @param {Number} bias - A threshold for proximity checks.\r\n    * @param {Number} biasSquared - The threshold squared.\r\n    * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.\r\n    */\n\n   function _fetch(octant, p, bias, biasSquared) {\n\n   \tvar children = octant.children;\n\n   \tvar result = null;\n\n   \tvar i = void 0,\n   \t    l = void 0;\n   \tvar points = void 0;\n\n   \tif (octant.contains(p, bias)) {\n\n   \t\tif (children !== null) {\n\n   \t\t\tfor (i = 0, l = children.length; result === null && i < l; ++i) {\n\n   \t\t\t\tresult = _fetch(children[i], p, bias, biasSquared);\n   \t\t\t}\n   \t\t} else {\n\n   \t\t\tpoints = octant.points;\n\n   \t\t\tfor (i = 0, l = points.length; result === null && i < l; ++i) {\n\n   \t\t\t\tif (p.distanceToSquared(points[i]) <= biasSquared) {\n\n   \t\t\t\t\tresult = octant.data[i];\n   \t\t\t\t}\n   \t\t\t}\n   \t\t}\n   \t}\n\n   \treturn result;\n   }\n\n   /**\r\n    * Recursively finds the closest point to the given one.\r\n    *\r\n    * @method findNearestPoint\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Vector3} p - The point.\r\n    * @param {Number} maxDistance - The maximum distance.\r\n    * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.\r\n    * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.\r\n    */\n\n   function _findNearestPoint(octant, p, maxDistance, skipSelf) {\n\n   \tvar points = octant.points;\n   \tvar children = octant.children;\n\n   \tvar result = null;\n   \tvar bestDist = maxDistance;\n\n   \tvar i = void 0,\n   \t    l = void 0;\n   \tvar point = void 0,\n   \t    distSq = void 0;\n\n   \tvar sortedChildren = void 0;\n   \tvar child = void 0,\n   \t    childResult = void 0;\n\n   \tif (children !== null) {\n\n   \t\t// Sort the children.\n   \t\tsortedChildren = children.map(function (child) {\n\n   \t\t\t// Precompute distances.\n   \t\t\treturn {\n   \t\t\t\toctant: child,\n   \t\t\t\tdistance: child.distanceToCenterSquared(p)\n   \t\t\t};\n   \t\t}).sort(function (a, b) {\n\n   \t\t\t// Smallest distance to p first, ASC.\n   \t\t\treturn a.distance - b.distance;\n   \t\t});\n\n   \t\t// Traverse from closest to furthest.\n   \t\tfor (i = 0, l = sortedChildren.length; i < l; ++i) {\n\n   \t\t\t// Unpack octant.\n   \t\t\tchild = sortedChildren[i].octant;\n\n   \t\t\tif (child.contains(p, bestDist)) {\n\n   \t\t\t\tchildResult = _findNearestPoint(child, p, bestDist, skipSelf);\n\n   \t\t\t\tif (childResult !== null) {\n\n   \t\t\t\t\tdistSq = childResult.point.distanceToSquared(p);\n\n   \t\t\t\t\tif ((!skipSelf || distSq > 0.0) && distSq < bestDist) {\n\n   \t\t\t\t\t\tbestDist = distSq;\n   \t\t\t\t\t\tresult = childResult;\n   \t\t\t\t\t}\n   \t\t\t\t}\n   \t\t\t}\n   \t\t}\n   \t} else if (points !== null) {\n\n   \t\tfor (i = 0, l = points.length; i < l; ++i) {\n\n   \t\t\tpoint = points[i];\n   \t\t\tdistSq = p.distanceToSquared(point);\n\n   \t\t\tif ((!skipSelf || distSq > 0.0) && distSq < bestDist) {\n\n   \t\t\t\tbestDist = distSq;\n\n   \t\t\t\tresult = {\n   \t\t\t\t\tpoint: point.clone(),\n   \t\t\t\t\tdata: octant.data[i]\n   \t\t\t\t};\n   \t\t\t}\n   \t\t}\n   \t}\n\n   \treturn result;\n   }\n\n   /**\r\n    * Recursively finds points that are inside the specified radius around a given\r\n    * position.\r\n    *\r\n    * @method findPoints\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Vector3} p - A position.\r\n    * @param {Number} r - A radius.\r\n    * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.\r\n    * @param {Array} result - An array to be filled with objects, each containing a point and a data property.\r\n    */\n\n   function _findPoints(octant, p, r, skipSelf, result) {\n\n   \tvar points = octant.points;\n   \tvar children = octant.children;\n   \tvar rSq = r * r;\n\n   \tvar i = void 0,\n   \t    l = void 0;\n\n   \tvar point = void 0,\n   \t    distSq = void 0;\n   \tvar child = void 0;\n\n   \tif (children !== null) {\n\n   \t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\tchild = children[i];\n\n   \t\t\tif (child.contains(p, r)) {\n\n   \t\t\t\t_findPoints(child, p, r, skipSelf, result);\n   \t\t\t}\n   \t\t}\n   \t} else if (points !== null) {\n\n   \t\tfor (i = 0, l = points.length; i < l; ++i) {\n\n   \t\t\tpoint = points[i];\n   \t\t\tdistSq = p.distanceToSquared(point);\n\n   \t\t\tif ((!skipSelf || distSq > 0.0) && distSq <= rSq) {\n\n   \t\t\t\tresult.push({\n   \t\t\t\t\tpoint: point.clone(),\n   \t\t\t\t\tdata: octant.data[i]\n   \t\t\t\t});\n   \t\t\t}\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * An octree that manages points.\r\n    *\r\n    * @class PointOctree\r\n    * @submodule points\r\n    * @extends Octree\r\n    * @constructor\r\n    * @param {Vector3} min - The lower bounds of the tree.\r\n    * @param {Vector3} max - The upper bounds of the tree.\r\n    * @param {Number} [bias=0.0] - A threshold for proximity checks.\r\n    * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.\r\n    * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.\r\n    */\n\n   var PointOctree = function (_Octree) {\n   \tinherits(PointOctree, _Octree);\n\n   \tfunction PointOctree(min, max) {\n   \t\tvar bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;\n   \t\tvar maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;\n   \t\tvar maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;\n   \t\tclassCallCheck(this, PointOctree);\n\n   \t\tvar _this = possibleConstructorReturn(this, (PointOctree.__proto__ || Object.getPrototypeOf(PointOctree)).call(this));\n\n   \t\t_this.root = new PointOctant(min, max);\n\n   \t\t/**\r\n      * A threshold for proximity checks.\r\n      *\r\n      * @property bias\r\n      * @type Number\r\n      * @private\r\n      * @default 0.0\r\n      */\n\n   \t\t_this.bias = Math.max(0.0, bias);\n\n   \t\t/**\r\n      * The proximity threshold squared.\r\n      *\r\n      * @property biasSquared\r\n      * @type Number\r\n      * @private\r\n      * @default 0.0\r\n      */\n\n   \t\t_this.biasSquared = _this.bias * _this.bias;\n\n   \t\t/**\r\n      * Number of points per octant before a split occurs.\r\n      *\r\n      * This value works together with the maximum depth as a secondary limiting\r\n      * factor. Smaller values cause splits to occur earlier which results in a\r\n      * faster and deeper tree growth.\r\n      *\r\n      * @property maxPoints\r\n      * @type Number\r\n      * @private\r\n      * @default 8\r\n      */\n\n   \t\t_this.maxPoints = Math.max(1, Math.round(maxPoints));\n\n   \t\t/**\r\n      * The maximum tree depth level.\r\n      *\r\n      * It's possible to use Infinity, but be aware that allowing infinitely\r\n      * small octants can have a negative impact on performance.\r\n      * Finding a value that works best for a specific scene is advisable.\r\n      *\r\n      * @property maxDepth\r\n      * @type Number\r\n      * @private\r\n      * @default 8\r\n      */\n\n   \t\t_this.maxDepth = Math.max(0, Math.round(maxDepth));\n\n   \t\treturn _this;\n   \t}\n\n   \t/**\r\n     * Counts how many points are in this octree.\r\n     *\r\n     * @method countPoints\r\n     * @return {Number} The amount of points.\r\n     */\n\n   \tcreateClass(PointOctree, [{\n   \t\tkey: \"countPoints\",\n   \t\tvalue: function countPoints() {\n\n   \t\t\treturn _countPoints(this.root);\n   \t\t}\n\n   \t\t/**\r\n      * Adds a point to the octree.\r\n      *\r\n      * @method add\r\n      * @param {Vector3} p - A point.\r\n      * @param {Object} data - An object that the point represents.\r\n      */\n\n   \t}, {\n   \t\tkey: \"add\",\n   \t\tvalue: function add(p, data) {\n\n   \t\t\t_add(this.root, p, data, 0, this.bias, this.maxPoints, this.maxDepth);\n   \t\t}\n\n   \t\t/**\r\n      * Removes a point from the tree.\r\n      *\r\n      * @method remove\r\n      * @param {Vector3} p - A point.\r\n      */\n\n   \t}, {\n   \t\tkey: \"remove\",\n   \t\tvalue: function remove(p) {\n\n   \t\t\t_remove(this.root, null, p, this.bias, this.maxPoints);\n   \t\t}\n\n   \t\t/**\r\n      * Retrieves the data of the specified point.\r\n      *\r\n      * @method fetch\r\n      * @param {Vector3} p - A position.\r\n      * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.\r\n      */\n\n   \t}, {\n   \t\tkey: \"fetch\",\n   \t\tvalue: function fetch(p) {\n\n   \t\t\treturn _fetch(this.root, p, this.bias, this.biasSquared);\n   \t\t}\n\n   \t\t/**\r\n      * Finds the closest point to the given one.\r\n      *\r\n      * @method findNearestPoint\r\n      * @param {Vector3} p - A point.\r\n      * @param {Number} [maxDistance=Infinity] - An upper limit for the distance between the points.\r\n      * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.\r\n      * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.\r\n      */\n\n   \t}, {\n   \t\tkey: \"findNearestPoint\",\n   \t\tvalue: function findNearestPoint(p) {\n   \t\t\tvar maxDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;\n   \t\t\tvar skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n\n\n   \t\t\treturn _findNearestPoint(this.root, p, maxDistance, skipSelf);\n   \t\t}\n\n   \t\t/**\r\n      * Finds points that are in the specified radius around the given position.\r\n      *\r\n      * @method findPoints\r\n      * @param {Vector3} p - A position.\r\n      * @param {Number} r - A radius.\r\n      * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.\r\n      * @return {Array} An array of objects, each containing a point and a data property.\r\n      */\n\n   \t}, {\n   \t\tkey: \"findPoints\",\n   \t\tvalue: function findPoints(p, r) {\n   \t\t\tvar skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n\n\n   \t\t\tvar result = [];\n\n   \t\t\t_findPoints(this.root, p, r, skipSelf, result);\n\n   \t\t\treturn result;\n   \t\t}\n\n   \t\t/**\r\n      * Finds the points that intersect with the given ray.\r\n      *\r\n      * @method raycast\r\n      * @param {Raycaster} raycaster - The raycaster.\r\n      * @param {Array} [intersects] - An array to be filled with the intersecting points.\r\n      * @return {Array} The intersecting points.\r\n      */\n\n   \t}, {\n   \t\tkey: \"raycast\",\n   \t\tvalue: function raycast(raycaster) {\n   \t\t\tvar intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n\n\n   \t\t\tvar octants = get(PointOctree.prototype.__proto__ || Object.getPrototypeOf(PointOctree.prototype), \"raycast\", this).call(this, raycaster);\n\n   \t\t\tif (octants.length > 0) {\n\n   \t\t\t\t// Collect intersecting points.\n   \t\t\t\tthis.testPoints(octants, raycaster, intersects);\n   \t\t\t}\n\n   \t\t\treturn intersects;\n   \t\t}\n\n   \t\t/**\r\n      * Collects points that intersect with the given ray.\r\n      *\r\n      * @method testPoints\r\n      * @param {Array} octants - An array containing octants that intersect with the ray.\r\n      * @param {Raycaster} raycaster - The raycaster.\r\n      * @param {Array} intersects - An array to be filled with the intersecting points.\r\n      */\n\n   \t}, {\n   \t\tkey: \"testPoints\",\n   \t\tvalue: function testPoints(octants, raycaster, intersects) {\n\n   \t\t\tvar threshold = raycaster.params.Points.threshold;\n   \t\t\tvar thresholdSq = threshold * threshold;\n\n   \t\t\tvar intersectPoint = void 0;\n   \t\t\tvar distance = void 0,\n   \t\t\t    distanceToRay = void 0;\n   \t\t\tvar rayPointDistanceSq = void 0;\n\n   \t\t\tvar i = void 0,\n   \t\t\t    j = void 0,\n   \t\t\t    il = void 0,\n   \t\t\t    jl = void 0;\n   \t\t\tvar octant = void 0,\n   \t\t\t    points = void 0,\n   \t\t\t    point = void 0;\n\n   \t\t\tfor (i = 0, il = octants.length; i < il; ++i) {\n\n   \t\t\t\toctant = octants[i];\n   \t\t\t\tpoints = octant.points;\n\n   \t\t\t\tif (points !== null) {\n\n   \t\t\t\t\tfor (j = 0, jl = points.length; j < jl; ++j) {\n\n   \t\t\t\t\t\tpoint = points[j];\n   \t\t\t\t\t\trayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);\n\n   \t\t\t\t\t\tif (rayPointDistanceSq < thresholdSq) {\n\n   \t\t\t\t\t\t\tintersectPoint = raycaster.ray.closestPointToPoint(point);\n   \t\t\t\t\t\t\tdistance = raycaster.ray.origin.distanceTo(intersectPoint);\n\n   \t\t\t\t\t\t\tif (distance >= raycaster.near && distance <= raycaster.far) {\n\n   \t\t\t\t\t\t\t\tdistanceToRay = Math.sqrt(rayPointDistanceSq);\n\n   \t\t\t\t\t\t\t\tintersects.push({\n   \t\t\t\t\t\t\t\t\tdistance: distance,\n   \t\t\t\t\t\t\t\t\tdistanceToRay: distanceToRay,\n   \t\t\t\t\t\t\t\t\tpoint: intersectPoint.clone(),\n   \t\t\t\t\t\t\t\t\tobject: octant.data[j]\n   \t\t\t\t\t\t\t\t});\n   \t\t\t\t\t\t\t}\n   \t\t\t\t\t\t}\n   \t\t\t\t\t}\n   \t\t\t\t}\n   \t\t\t}\n   \t\t}\n   \t}]);\n   \treturn PointOctree;\n   }(Octree);\n\n   /**\r\n    * Point-oriented octree components.\r\n    *\r\n    * @module sparse-octree\r\n    * @submodule points\r\n    */\n\n   /**\r\n    * Exposure of the library components.\r\n    *\r\n    * @module sparse-octree\r\n    * @main sparse-octree\r\n    */\n\n   /**\r\n    * An enumeration of material constants.\r\n    *\r\n    * @class Material\r\n    * @submodule volume\r\n    * @static\r\n    */\n\n   var Material = {\n\n   \t/**\r\n     * The index for empty space.\r\n     *\r\n     * @property AIR\r\n     * @type Number\r\n     * @static\r\n     * @final\r\n     */\n\n   \tAIR: 0,\n\n   \t/**\r\n     * The default index for solid material.\r\n     *\r\n     * @property SOLID\r\n     * @type Number\r\n     * @static\r\n     * @final\r\n     */\n\n   \tSOLID: 1\n\n   };\n\n   /**\r\n    * A vector with three components.\r\n    *\r\n    * @class Vector3\r\n    * @submodule math\r\n    * @constructor\r\n    * @param {Number} [x=0] - The x value.\r\n    * @param {Number} [y=0] - The y value.\r\n    * @param {Number} [z=0] - The z value.\r\n    */\n\n   var Vector3$1 = function () {\n   \tfunction Vector3() {\n   \t\tvar x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n   \t\tvar y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n   \t\tvar z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n   \t\tclassCallCheck(this, Vector3);\n\n\n   \t\t/**\r\n      * The x component.\r\n      *\r\n      * @property x\r\n      * @type Number\r\n      */\n\n   \t\tthis.x = x;\n\n   \t\t/**\r\n      * The y component.\r\n      *\r\n      * @property y\r\n      * @type Number\r\n      */\n\n   \t\tthis.y = y;\n\n   \t\t/**\r\n      * The z component.\r\n      *\r\n      * @property z\r\n      * @type Number\r\n      */\n\n   \t\tthis.z = z;\n   \t}\n\n   \t/**\r\n     * Sets the values of this vector\r\n     *\r\n     * @method set\r\n     * @chainable\r\n     * @param {Number} x - The x value.\r\n     * @param {Number} y - The y value.\r\n     * @param {Number} z - The z value.\r\n     * @return {Vector3} This vector.\r\n     */\n\n   \tcreateClass(Vector3, [{\n   \t\tkey: \"set\",\n   \t\tvalue: function set$$1(x, y, z) {\n\n   \t\t\tthis.x = x;\n   \t\t\tthis.y = y;\n   \t\t\tthis.z = z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Copies the values of another vector.\r\n      *\r\n      * @method copy\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"copy\",\n   \t\tvalue: function copy(v) {\n\n   \t\t\tthis.x = v.x;\n   \t\t\tthis.y = v.y;\n   \t\t\tthis.z = v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Copies values from an array.\r\n      *\r\n      * @method fromArray\r\n      * @chainable\r\n      * @param {Array} array - An array.\r\n      * @param {Number} offset - An offset.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"fromArray\",\n   \t\tvalue: function fromArray(array) {\n   \t\t\tvar offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n\n   \t\t\tthis.x = array[offset];\n   \t\t\tthis.y = array[offset + 1];\n   \t\t\tthis.z = array[offset + 2];\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Stores this vector in an array.\r\n      *\r\n      * @method toArray\r\n      * @param {Array} [array] - A target array.\r\n      * @param {Number} offset - An offset.\r\n      * @return {Vector3} The array.\r\n      */\n\n   \t}, {\n   \t\tkey: \"toArray\",\n   \t\tvalue: function toArray$$1() {\n   \t\t\tvar array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n   \t\t\tvar offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n\n   \t\t\tarray[offset] = this.x;\n   \t\t\tarray[offset + 1] = this.y;\n   \t\t\tarray[offset + 2] = this.z;\n\n   \t\t\treturn array;\n   \t\t}\n\n   \t\t/**\r\n      * Checks if this vector equals the given one.\r\n      *\r\n      * @method equals\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Boolean} Whether this vector equals the given one.\r\n      */\n\n   \t}, {\n   \t\tkey: \"equals\",\n   \t\tvalue: function equals(v) {\n\n   \t\t\treturn v.x === this.x && v.y === this.y && v.z === this.z;\n   \t\t}\n\n   \t\t/**\r\n      * Clones this vector.\r\n      *\r\n      * @method clone\r\n      * @return {Vector3} A clone of this vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"clone\",\n   \t\tvalue: function clone() {\n\n   \t\t\treturn new this.constructor(this.x, this.y, this.z);\n   \t\t}\n\n   \t\t/**\r\n      * Adds a vector to this one.\r\n      *\r\n      * @method add\r\n      * @chainable\r\n      * @param {Vector3} v - The vector to add.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"add\",\n   \t\tvalue: function add(v) {\n\n   \t\t\tthis.x += v.x;\n   \t\t\tthis.y += v.y;\n   \t\t\tthis.z += v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Adds a scaled vector to this one.\r\n      *\r\n      * @method addScaledVector\r\n      * @chainable\r\n      * @param {Vector3} v - The vector to scale and add.\r\n      * @param {Number} s - A scalar.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"addScaledVector\",\n   \t\tvalue: function addScaledVector(v, s) {\n\n   \t\t\tthis.x += v.x * s;\n   \t\t\tthis.y += v.y * s;\n   \t\t\tthis.z += v.z * s;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Adds a scalar to this vector.\r\n      *\r\n      * @method addScalar\r\n      * @chainable\r\n      * @param {Number} s - The scalar to add.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"addScalar\",\n   \t\tvalue: function addScalar(s) {\n\n   \t\t\tthis.x += s;\n   \t\t\tthis.y += s;\n   \t\t\tthis.z += s;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Sets this vector to the sum of two given vectors.\r\n      *\r\n      * @method addVectors\r\n      * @chainable\r\n      * @param {Vector3} a - A vector.\r\n      * @param {Vector3} b - Another vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"addVectors\",\n   \t\tvalue: function addVectors(a, b) {\n\n   \t\t\tthis.x = a.x + b.x;\n   \t\t\tthis.y = a.y + b.y;\n   \t\t\tthis.z = a.z + b.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Subtracts a vector from this vector.\r\n      *\r\n      * @method sub\r\n      * @chainable\r\n      * @param {Vector3} v - The vector to subtract.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"sub\",\n   \t\tvalue: function sub(v) {\n\n   \t\t\tthis.x -= v.x;\n   \t\t\tthis.y -= v.y;\n   \t\t\tthis.z -= v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Subtracts a scalar to this vector.\r\n      *\r\n      * @method subScalar\r\n      * @chainable\r\n      * @param {Number} s - The scalar to subtract.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"subScalar\",\n   \t\tvalue: function subScalar(s) {\n\n   \t\t\tthis.x -= s;\n   \t\t\tthis.y -= s;\n   \t\t\tthis.z -= s;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Sets this vector to the difference between two given vectors.\r\n      *\r\n      * @method subVectors\r\n      * @chainable\r\n      * @param {Vector3} a - A vector.\r\n      * @param {Vector3} b - A second vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"subVectors\",\n   \t\tvalue: function subVectors(a, b) {\n\n   \t\t\tthis.x = a.x - b.x;\n   \t\t\tthis.y = a.y - b.y;\n   \t\t\tthis.z = a.z - b.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Multiplies this vector with another vector.\r\n      *\r\n      * @method multiply\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"multiply\",\n   \t\tvalue: function multiply(v) {\n\n   \t\t\tthis.x *= v.x;\n   \t\t\tthis.y *= v.y;\n   \t\t\tthis.z *= v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Multiplies this vector with a given scalar.\r\n      *\r\n      * @method multiplyScalar\r\n      * @chainable\r\n      * @param {Number} s - A scalar.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"multiplyScalar\",\n   \t\tvalue: function multiplyScalar(s) {\n\n   \t\t\tif (isFinite(s)) {\n\n   \t\t\t\tthis.x *= s;\n   \t\t\t\tthis.y *= s;\n   \t\t\t\tthis.z *= s;\n   \t\t\t} else {\n\n   \t\t\t\tthis.x = 0;\n   \t\t\t\tthis.y = 0;\n   \t\t\t\tthis.z = 0;\n   \t\t\t}\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Sets this vector to the product of two given vectors.\r\n      *\r\n      * @method multiplyVectors\r\n      * @chainable\r\n      * @param {Vector3} a - A vector.\r\n      * @param {Vector3} b - Another vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"multiplyVectors\",\n   \t\tvalue: function multiplyVectors(a, b) {\n\n   \t\t\tthis.x = a.x * b.x;\n   \t\t\tthis.y = a.y * b.y;\n   \t\t\tthis.z = a.z * b.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Divides this vector by another vector.\r\n      *\r\n      * @method divide\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"divide\",\n   \t\tvalue: function divide(v) {\n\n   \t\t\tthis.x /= v.x;\n   \t\t\tthis.y /= v.y;\n   \t\t\tthis.z /= v.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Divides this vector by a given scalar.\r\n      *\r\n      * @method divideScalar\r\n      * @chainable\r\n      * @param {Number} s - A scalar.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"divideScalar\",\n   \t\tvalue: function divideScalar(s) {\n\n   \t\t\treturn this.multiplyScalar(1 / s);\n   \t\t}\n\n   \t\t/**\r\n      * Sets this vector to the quotient of two given vectors.\r\n      *\r\n      * @method divideVectors\r\n      * @chainable\r\n      * @param {Vector3} a - A vector.\r\n      * @param {Vector3} b - Another vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"divideVectors\",\n   \t\tvalue: function divideVectors(a, b) {\n\n   \t\t\tthis.x = a.x / b.x;\n   \t\t\tthis.y = a.y / b.y;\n   \t\t\tthis.z = a.z / b.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Negates this vector.\r\n      *\r\n      * @method negate\r\n      * @chainable\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"negate\",\n   \t\tvalue: function negate() {\n\n   \t\t\tthis.x = -this.x;\n   \t\t\tthis.y = -this.y;\n   \t\t\tthis.z = -this.z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the dot product with another vector.\r\n      *\r\n      * @method dot\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Number} The dot product.\r\n      */\n\n   \t}, {\n   \t\tkey: \"dot\",\n   \t\tvalue: function dot(v) {\n\n   \t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the squared length of this vector.\r\n      *\r\n      * @method lengthSq\r\n      * @return {Number} The squared length.\r\n      */\n\n   \t}, {\n   \t\tkey: \"lengthSq\",\n   \t\tvalue: function lengthSq() {\n\n   \t\t\treturn this.x * this.x + this.y * this.y + this.z * this.z;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the length of this vector.\r\n      *\r\n      * @method length\r\n      * @return {Number} The length.\r\n      */\n\n   \t}, {\n   \t\tkey: \"length\",\n   \t\tvalue: function length() {\n\n   \t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the distance to a given vector.\r\n      *\r\n      * @method distanceTo\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Number} The distance.\r\n      */\n\n   \t}, {\n   \t\tkey: \"distanceTo\",\n   \t\tvalue: function distanceTo(v) {\n\n   \t\t\treturn Math.sqrt(this.distanceToSquared(v));\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the squared distance to a given vector.\r\n      *\r\n      * @method distanceToSquared\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Number} The squared distance.\r\n      */\n\n   \t}, {\n   \t\tkey: \"distanceToSquared\",\n   \t\tvalue: function distanceToSquared(v) {\n\n   \t\t\tvar dx = this.x - v.x;\n   \t\t\tvar dy = this.y - v.y;\n   \t\t\tvar dz = this.z - v.z;\n\n   \t\t\treturn dx * dx + dy * dy + dz * dz;\n   \t\t}\n\n   \t\t/**\r\n      * Normalizes this vector.\r\n      *\r\n      * @method normalize\r\n      * @chainable\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"normalize\",\n   \t\tvalue: function normalize() {\n\n   \t\t\treturn this.divideScalar(this.length());\n   \t\t}\n\n   \t\t/**\r\n      * Adopts the min value for each component of this vector and the given one.\r\n      *\r\n      * @method min\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"min\",\n   \t\tvalue: function min(v) {\n\n   \t\t\tthis.x = Math.min(this.x, v.x);\n   \t\t\tthis.y = Math.min(this.y, v.y);\n   \t\t\tthis.z = Math.min(this.z, v.z);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * adopts the max value for each component of this vector and the given one.\r\n      *\r\n      * @method max\r\n      * @chainable\r\n      * @param {Vector3} v - A vector.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"max\",\n   \t\tvalue: function max(v) {\n\n   \t\t\tthis.x = Math.max(this.x, v.x);\n   \t\t\tthis.y = Math.max(this.y, v.y);\n   \t\t\tthis.z = Math.max(this.z, v.z);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Clamps this vector.\r\n      *\r\n      * @method clamp\r\n      * @chainable\r\n      * @param {Vector3} min - A vector, assumed to be smaller than max.\r\n      * @param {Vector3} max - A vector, assumed to be greater than min.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"clamp\",\n   \t\tvalue: function clamp(min, max) {\n\n   \t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\n   \t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\n   \t\t\tthis.z = Math.max(min.z, Math.min(max.z, this.z));\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Applies a matrix to this vector.\r\n      *\r\n      * @method applyMatrix3\r\n      * @chainable\r\n      * @param {Matrix3} m - A matrix.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"applyMatrix3\",\n   \t\tvalue: function applyMatrix3(m) {\n\n   \t\t\tvar x = this.x,\n   \t\t\t    y = this.y,\n   \t\t\t    z = this.z;\n   \t\t\tvar e = m.elements;\n\n   \t\t\tthis.x = e[0] * x + e[3] * y + e[6] * z;\n   \t\t\tthis.y = e[1] * x + e[4] * y + e[7] * z;\n   \t\t\tthis.z = e[2] * x + e[5] * y + e[8] * z;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Applies a matrix to this vector.\r\n      *\r\n      * @method applyMatrix4\r\n      * @chainable\r\n      * @param {Matrix4} m - A matrix.\r\n      * @return {Vector3} This vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"applyMatrix4\",\n   \t\tvalue: function applyMatrix4(m) {\n\n   \t\t\tvar x = this.x,\n   \t\t\t    y = this.y,\n   \t\t\t    z = this.z;\n   \t\t\tvar e = m.elements;\n\n   \t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z + e[12];\n   \t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z + e[13];\n   \t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z + e[14];\n\n   \t\t\treturn this;\n   \t\t}\n   \t}]);\n   \treturn Vector3;\n   }();\n\n   /**\r\n    * A symmetric 3x3 matrix.\r\n    *\r\n    * @class SymmetricMatrix3\r\n    * @submodule math\r\n    * @constructor\r\n    */\n\n   var SymmetricMatrix3 = function () {\n   \tfunction SymmetricMatrix3() {\n   \t\tclassCallCheck(this, SymmetricMatrix3);\n\n\n   \t\t/**\r\n      * The matrix elements.\r\n      *\r\n      * @property elements\r\n      * @type Float32Array\r\n      */\n\n   \t\tthis.elements = new Float32Array([1, 0, 0, 1, 0, 1]);\n   \t}\n\n   \t/**\r\n     * Sets the values of this matrix.\r\n     *\r\n     * @method set\r\n     * @chainable\r\n     * @param {Number} m00 - The value of the first row, first column.\r\n     * @param {Number} m01 - The value of the first row, second column.\r\n     * @param {Number} m02 - The value of the first row, third column.\r\n     * @param {Number} m11 - The value of the second row, second column.\r\n     * @param {Number} m12 - The value of the second row, third column.\r\n     * @param {Number} m22 - The value of the third row, third column.\r\n     * @return {SymmetricMatrix3} This matrix.\r\n     */\n\n   \tcreateClass(SymmetricMatrix3, [{\n   \t\tkey: \"set\",\n   \t\tvalue: function set$$1(m00, m01, m02, m11, m12, m22) {\n\n   \t\t\tvar e = this.elements;\n\n   \t\t\te[0] = m00;e[1] = m01;e[2] = m02;\n   \t\t\te[3] = m11;e[4] = m12;\n   \t\t\te[5] = m22;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Sets this matrix to the identity matrix.\r\n      *\r\n      * @method identity\r\n      * @chainable\r\n      * @return {SymmetricMatrix3} This matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"identity\",\n   \t\tvalue: function identity() {\n\n   \t\t\tthis.set(1, 0, 0, 1, 0, 1);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Copies values from a given matrix.\r\n      *\r\n      * @method copy\r\n      * @chainable\r\n      * @param {Matrix3} m - A matrix.\r\n      * @return {SymmetricMatrix3} This matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"copy\",\n   \t\tvalue: function copy(m) {\n\n   \t\t\tvar me = m.elements;\n\n   \t\t\tthis.set(me[0], me[1], me[2], me[3], me[4], me[5]);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Clones this matrix.\r\n      *\r\n      * @method clone\r\n      * @return {SymmetricMatrix3} A clone of this matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"clone\",\n   \t\tvalue: function clone() {\n\n   \t\t\treturn new this.constructor().copy(this);\n   \t\t}\n\n   \t\t/**\r\n      * Adds the values of a given matrix to this one.\r\n      *\r\n      * @method add\r\n      * @chainable\r\n      * @param {Matrix3} m - A matrix.\r\n      * @return {SymmetricMatrix3} This matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"add\",\n   \t\tvalue: function add(m) {\n\n   \t\t\tvar te = this.elements;\n   \t\t\tvar me = m.elements;\n\n   \t\t\tte[0] += me[0];te[1] += me[1];te[2] += me[2];\n   \t\t\tte[3] += me[3];te[4] += me[4];\n   \t\t\tte[5] += me[5];\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the Frobenius norm of this matrix.\r\n      *\r\n      * @method norm\r\n      * @return {Number} The norm of this matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"norm\",\n   \t\tvalue: function norm() {\n\n   \t\t\tvar e = this.elements;\n\n   \t\t\tvar m01m01 = e[1] * e[1];\n   \t\t\tvar m02m02 = e[2] * e[2];\n   \t\t\tvar m12m12 = e[4] * e[4];\n\n   \t\t\treturn Math.sqrt(e[0] * e[0] + m01m01 + m02m02 + m01m01 + e[3] * e[3] + m12m12 + m02m02 + m12m12 + e[5] * e[5]);\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the absolute sum of all matrix components except for the main\r\n      * diagonal.\r\n      *\r\n      * @method off\r\n      * @return {Number} The offset of this matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"off\",\n   \t\tvalue: function off() {\n\n   \t\t\tvar e = this.elements;\n\n   \t\t\treturn Math.sqrt(2 * (\n\n   \t\t\t// Diagonal = [0, 3, 5].\n   \t\t\te[1] * e[1] + e[2] * e[2] + e[4] * e[4]));\n   \t\t}\n\n   \t\t/**\r\n      * Applies this symmetric matrix to a vector.\r\n      *\r\n      * @method applyToVector3\r\n      * @param {Vector3} v - The vector to modify.\r\n      * @return {Vector3} The modified vector.\r\n      */\n\n   \t}, {\n   \t\tkey: \"applyToVector3\",\n   \t\tvalue: function applyToVector3(v) {\n\n   \t\t\tvar x = v.x,\n   \t\t\t    y = v.y,\n   \t\t\t    z = v.z;\n   \t\t\tvar e = this.elements;\n\n   \t\t\tv.x = e[0] * x + e[1] * y + e[2] * z;\n   \t\t\tv.y = e[1] * x + e[3] * y + e[4] * z;\n   \t\t\tv.z = e[2] * x + e[4] * y + e[5] * z;\n\n   \t\t\treturn v;\n   \t\t}\n   \t}]);\n   \treturn SymmetricMatrix3;\n   }();\n\n   /**\r\n    * A data container for the QEF solver.\r\n    *\r\n    * @class QEFData\r\n    * @submodule math\r\n    * @constructor\r\n    */\n\n   var QEFData = function () {\n   \t\tfunction QEFData() {\n   \t\t\t\tclassCallCheck(this, QEFData);\n\n\n   \t\t\t\t/**\r\n        * A symmetric matrix.\r\n        *\r\n        * @property ata\r\n        * @type SymmetricMatrix3\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.ata = new SymmetricMatrix3();\n\n   \t\t\t\tthis.ata.set(0, 0, 0, 0, 0, 0);\n\n   \t\t\t\t/**\r\n        * A vector.\r\n        *\r\n        * @property atb\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.atb = new Vector3$1();\n\n   \t\t\t\t/**\r\n        * Used to calculate the error of the computed position.\r\n        *\r\n        * @property btb\r\n        * @type Number\r\n        */\n\n   \t\t\t\tthis.btb = 0;\n\n   \t\t\t\t/**\r\n        * An accumulation of the surface intersection points.\r\n        *\r\n        * @property massPoint\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.massPoint = new Vector3$1();\n\n   \t\t\t\t/**\r\n        * The amount of accumulated surface intersection points.\r\n        *\r\n        * @property numPoints\r\n        * @type Number\r\n        */\n\n   \t\t\t\tthis.numPoints = 0;\n\n   \t\t\t\t/**\r\n        * The dimension of the mass point. This value is used when mass points are\r\n        * accumulated during voxel cell clustering.\r\n        *\r\n        * @property massPointDimension\r\n        * @type Number\r\n        */\n\n   \t\t\t\tthis.massPointDimension = 0;\n   \t\t}\n\n   \t\t/**\r\n      * Sets the values of this data instance.\r\n      *\r\n      * @method set\r\n      * @chainable\r\n      * @return {QEFData} This data.\r\n      */\n\n   \t\tcreateClass(QEFData, [{\n   \t\t\t\tkey: \"set\",\n   \t\t\t\tvalue: function set$$1(ata, atb, btb, massPoint, numPoints) {\n\n   \t\t\t\t\t\tthis.ata.copy(ata);\n   \t\t\t\t\t\tthis.atb.copy(atb);\n   \t\t\t\t\t\tthis.btb = btb;\n\n   \t\t\t\t\t\tthis.massPoint.copy(massPoint);\n   \t\t\t\t\t\tthis.numPoints = numPoints;\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Copies values from a given data instance.\r\n        *\r\n        * @method copy\r\n        * @chainable\r\n        * @return {QEFData} This data.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"copy\",\n   \t\t\t\tvalue: function copy(d) {\n\n   \t\t\t\t\t\treturn this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Adds the given surface intersection point and normal.\r\n        *\r\n        * @method add\r\n        * @param {Vector3} p - An intersection point.\r\n        * @param {Vector3} n - A surface normal.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"add\",\n   \t\t\t\tvalue: function add(p, n) {\n\n   \t\t\t\t\t\tvar nx = n.x;\n   \t\t\t\t\t\tvar ny = n.y;\n   \t\t\t\t\t\tvar nz = n.z;\n\n   \t\t\t\t\t\tvar dot = n.dot(p);\n\n   \t\t\t\t\t\tvar ata = this.ata.elements;\n   \t\t\t\t\t\tvar atb = this.atb;\n\n   \t\t\t\t\t\tata[0] += nx * nx;ata[1] += nx * ny;ata[2] += nx * nz;\n   \t\t\t\t\t\tata[3] += ny * ny;ata[4] += ny * nz;\n   \t\t\t\t\t\tata[5] += nz * nz;\n\n   \t\t\t\t\t\tatb.x += dot * nx;\n   \t\t\t\t\t\tatb.y += dot * ny;\n   \t\t\t\t\t\tatb.z += dot * nz;\n\n   \t\t\t\t\t\tthis.btb += dot * dot;\n\n   \t\t\t\t\t\tthis.massPoint.add(p);\n\n   \t\t\t\t\t\t++this.numPoints;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Adds an entire data set.\r\n        *\r\n        * @method addData\r\n        * @param {QEFData} d - QEF data.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"addData\",\n   \t\t\t\tvalue: function addData(d) {\n\n   \t\t\t\t\t\tthis.ata.add(d.ata);\n   \t\t\t\t\t\tthis.atb.add(d.atb);\n   \t\t\t\t\t\tthis.btb += d.btb;\n\n   \t\t\t\t\t\tthis.massPoint.add(d.massPoint);\n   \t\t\t\t\t\tthis.numPoints += d.numPoints;\n\n   \t\t\t\t\t\t/* if(this.massPointDimension === d.massPointDimension) {\r\n         \t\t\tthis.massPoint.add(d.massPoint);\r\n         \tthis.numPoints += d.numPoints;\r\n         \t\t} else if(d.massPointDimension > this.massPointDimension) {\r\n         \t\t\t// Adopt the mass point of the higher dimension.\r\n         \tthis.massPoint.copy(d.massPoint);\r\n         \tthis.massPointDimension = d.massPointDimension;\r\n         \tthis.numPoints = d.numPoints;\r\n         \t\t} */\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Clears this data.\r\n        *\r\n        * @method clear\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"clear\",\n   \t\t\t\tvalue: function clear() {\n\n   \t\t\t\t\t\tthis.ata.set(0, 0, 0, 0, 0, 0);\n\n   \t\t\t\t\t\tthis.atb.set(0, 0, 0);\n   \t\t\t\t\t\tthis.btb = 0;\n\n   \t\t\t\t\t\tthis.massPoint.set(0, 0, 0);\n   \t\t\t\t\t\tthis.numPoints = 0;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Clones this data.\r\n        *\r\n        * @method clone\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"clone\",\n   \t\t\t\tvalue: function clone() {\n\n   \t\t\t\t\t\treturn new this.constructor().copy(this);\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn QEFData;\n   }();\n\n   /**\r\n    * A 3x3 matrix.\r\n    *\r\n    * This class is a copy of THREE.Matrix3. It can be removed as soon as three.js\r\n    * starts supporting ES6 modules.\r\n    *\r\n    * @class Matrix3\r\n    * @submodule math\r\n    * @constructor\r\n    */\n\n   var Matrix3 = function () {\n   \tfunction Matrix3() {\n   \t\tclassCallCheck(this, Matrix3);\n\n\n   \t\t/**\r\n      * The matrix elements.\r\n      *\r\n      * @property elements\r\n      * @type Float32Array\r\n      */\n\n   \t\tthis.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);\n   \t}\n\n   \t/**\r\n     * Sets the values of this matrix.\r\n     *\r\n     * @method set\r\n     * @chainable\r\n     * @param {Number} m00 - The value of the first row, first column.\r\n     * @param {Number} m01 - The value of the first row, second column.\r\n     * @param {Number} m02 - The value of the first row, third column.\r\n     * @param {Number} m10 - The value of the second row, first column.\r\n     * @param {Number} m11 - The value of the second row, second column.\r\n     * @param {Number} m12 - The value of the second row, third column.\r\n     * @param {Number} m20 - The value of the third row, first column.\r\n     * @param {Number} m21 - The value of the third row, second column.\r\n     * @param {Number} m22 - The value of the third row, third column.\r\n     * @return {Matrix3} This matrix.\r\n     */\n\n   \tcreateClass(Matrix3, [{\n   \t\tkey: \"set\",\n   \t\tvalue: function set$$1(m00, m01, m02, m10, m11, m12, m20, m21, m22) {\n\n   \t\t\tvar te = this.elements;\n\n   \t\t\tte[0] = m00;te[3] = m01;te[6] = m02;\n   \t\t\tte[1] = m10;te[4] = m11;te[7] = m12;\n   \t\t\tte[2] = m20;te[5] = m21;te[8] = m22;\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Sets this matrix to the identity matrix.\r\n      *\r\n      * @method identity\r\n      * @chainable\r\n      * @return {Matrix3} This matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"identity\",\n   \t\tvalue: function identity() {\n\n   \t\t\tthis.set(1, 0, 0, 0, 1, 0, 0, 0, 1);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Copies the values of a given matrix.\r\n      *\r\n      * @method copy\r\n      * @chainable\r\n      * @param {Matrix3} m - A matrix.\r\n      * @return {Matrix3} This matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"copy\",\n   \t\tvalue: function copy(m) {\n\n   \t\t\tvar me = m.elements;\n\n   \t\t\treturn this.set(me[0], me[3], me[6], me[1], me[4], me[7], me[2], me[5], me[8]);\n   \t\t}\n\n   \t\t/**\r\n      * Clones this matrix.\r\n      *\r\n      * @method clone\r\n      * @return {Matrix3} A clone of this matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"clone\",\n   \t\tvalue: function clone() {\n\n   \t\t\treturn new this.constructor().copy(this);\n   \t\t}\n   \t}]);\n   \treturn Matrix3;\n   }();\n\n   /**\r\n    * A collection of matrix rotation utilities.\r\n    *\r\n    * @class Givens\r\n    * @submodule math\r\n    * @static\r\n    */\n\n   var Givens = function () {\n   \t\tfunction Givens() {\n   \t\t\t\tclassCallCheck(this, Givens);\n   \t\t}\n\n   \t\tcreateClass(Givens, null, [{\n   \t\t\t\tkey: \"rot01Post\",\n\n\n   \t\t\t\t/**\r\n        * Rotates the given matrix.\r\n        *\r\n        * @method rot01Post\r\n        * @static\r\n        * @param {Matrix3} m - The target vector.\r\n        * @param {Object} coefficients - Two coefficients.\r\n        */\n\n   \t\t\t\tvalue: function rot01Post(m, coefficients) {\n\n   \t\t\t\t\t\tvar e = m.elements;\n\n   \t\t\t\t\t\tvar m00 = e[0],\n   \t\t\t\t\t\t    m01 = e[3];\n   \t\t\t\t\t\tvar m10 = e[1],\n   \t\t\t\t\t\t    m11 = e[4];\n   \t\t\t\t\t\tvar m20 = e[2],\n   \t\t\t\t\t\t    m21 = e[5];\n\n   \t\t\t\t\t\tvar c = coefficients.c;\n   \t\t\t\t\t\tvar s = coefficients.s;\n\n   \t\t\t\t\t\te[0] = c * m00 - s * m01;\n   \t\t\t\t\t\te[3] = s * m00 + c * m01;\n   \t\t\t\t\t\t// e[6] = m02;\n\n   \t\t\t\t\t\te[1] = c * m10 - s * m11;\n   \t\t\t\t\t\te[4] = s * m10 + c * m11;\n   \t\t\t\t\t\t// e[7] = m12;\n\n   \t\t\t\t\t\te[2] = c * m20 - s * m21;\n   \t\t\t\t\t\te[5] = s * m20 + c * m21;\n   \t\t\t\t\t\t// e[8] = m22;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Rotates the given matrix.\r\n        *\r\n        * @method rot02Post\r\n        * @static\r\n        * @param {Matrix3} m - The target vector.\r\n        * @param {Object} coefficients - Two coefficients.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"rot02Post\",\n   \t\t\t\tvalue: function rot02Post(m, coefficients) {\n\n   \t\t\t\t\t\tvar e = m.elements;\n\n   \t\t\t\t\t\tvar m00 = e[0],\n   \t\t\t\t\t\t    m02 = e[6];\n   \t\t\t\t\t\tvar m10 = e[1],\n   \t\t\t\t\t\t    m12 = e[7];\n   \t\t\t\t\t\tvar m20 = e[2],\n   \t\t\t\t\t\t    m22 = e[8];\n\n   \t\t\t\t\t\tvar c = coefficients.c;\n   \t\t\t\t\t\tvar s = coefficients.s;\n\n   \t\t\t\t\t\te[0] = c * m00 - s * m02;\n   \t\t\t\t\t\t// e[3] = m01;\n   \t\t\t\t\t\te[6] = s * m00 + c * m02;\n\n   \t\t\t\t\t\te[1] = c * m10 - s * m12;\n   \t\t\t\t\t\t// e[4] = m11;\n   \t\t\t\t\t\te[7] = s * m10 + c * m12;\n\n   \t\t\t\t\t\te[2] = c * m20 - s * m22;\n   \t\t\t\t\t\t// e[5] = m21;\n   \t\t\t\t\t\te[8] = s * m20 + c * m22;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Rotates the given matrix.\r\n        *\r\n        * @method rot12Post\r\n        * @static\r\n        * @param {Matrix3} m - The target vector.\r\n        * @param {Object} coefficients - Two coefficients.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"rot12Post\",\n   \t\t\t\tvalue: function rot12Post(m, coefficients) {\n\n   \t\t\t\t\t\tvar e = m.elements;\n\n   \t\t\t\t\t\tvar m01 = e[3],\n   \t\t\t\t\t\t    m02 = e[6];\n   \t\t\t\t\t\tvar m11 = e[4],\n   \t\t\t\t\t\t    m12 = e[7];\n   \t\t\t\t\t\tvar m21 = e[5],\n   \t\t\t\t\t\t    m22 = e[8];\n\n   \t\t\t\t\t\tvar c = coefficients.c;\n   \t\t\t\t\t\tvar s = coefficients.s;\n\n   \t\t\t\t\t\t// e[0] = m00;\n   \t\t\t\t\t\te[3] = c * m01 - s * m02;\n   \t\t\t\t\t\te[6] = s * m01 + c * m02;\n\n   \t\t\t\t\t\t// e[1] = m10;\n   \t\t\t\t\t\te[4] = c * m11 - s * m12;\n   \t\t\t\t\t\te[7] = s * m11 + c * m12;\n\n   \t\t\t\t\t\t// e[2] = m20;\n   \t\t\t\t\t\te[5] = c * m21 - s * m22;\n   \t\t\t\t\t\te[8] = s * m21 + c * m22;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Givens;\n   }();\n\n   /**\r\n    * Symmetric Givens coefficients.\r\n    *\r\n    * @property coefficients\r\n    * @type Object\r\n    * @private\r\n    * @static\r\n    */\n\n   var coefficients = {\n   \t\tc: 0.0,\n   \t\ts: 0.0\n   };\n\n   /**\r\n    * Caluclates symmetric coefficients for the Givens post rotation step.\r\n    *\r\n    * @method calculateSymmetricCoefficients\r\n    * @private\r\n    * @static\r\n    * @param {Number} aPP - PP.\r\n    * @param {Number} aPQ - PQ.\r\n    * @param {Number} aQQ - QQ.\r\n    */\n\n   function calculateSymmetricCoefficients(aPP, aPQ, aQQ) {\n\n   \t\tvar tau = void 0,\n   \t\t    stt = void 0,\n   \t\t    tan = void 0;\n\n   \t\tif (aPQ === 0) {\n\n   \t\t\t\tcoefficients.c = 1;\n   \t\t\t\tcoefficients.s = 0;\n   \t\t} else {\n\n   \t\t\t\ttau = (aQQ - aPP) / (2.0 * aPQ);\n   \t\t\t\tstt = Math.sqrt(1.0 + tau * tau);\n   \t\t\t\ttan = 1.0 / (tau >= 0.0 ? tau + stt : tau - stt);\n\n   \t\t\t\tcoefficients.c = 1.0 / Math.sqrt(1.0 + tan * tan);\n   \t\t\t\tcoefficients.s = tan * coefficients.c;\n   \t\t}\n   }\n\n   /**\r\n    * A collection of matrix rotation utilities.\r\n    *\r\n    * @class Schur\r\n    * @submodule math\r\n    * @static\r\n    */\n\n   var Schur = function () {\n   \t\tfunction Schur() {\n   \t\t\t\tclassCallCheck(this, Schur);\n   \t\t}\n\n   \t\tcreateClass(Schur, null, [{\n   \t\t\t\tkey: \"rot01\",\n\n\n   \t\t\t\t/**\r\n        * Rotates the given matrix.\r\n        *\r\n        * @method rot01\r\n        * @static\r\n        * @param {SymmetricMatrix3} m - A symmetric matrix.\r\n        * @return {Object} The coefficients.\r\n        */\n\n   \t\t\t\tvalue: function rot01(m) {\n\n   \t\t\t\t\t\tvar e = m.elements;\n\n   \t\t\t\t\t\tvar m00 = e[0],\n   \t\t\t\t\t\t    m01 = e[1],\n   \t\t\t\t\t\t    m02 = e[2];\n   \t\t\t\t\t\tvar m11 = e[3],\n   \t\t\t\t\t\t    m12 = e[4];\n\n   \t\t\t\t\t\tcalculateSymmetricCoefficients(m00, m01, m11);\n\n   \t\t\t\t\t\tvar c = coefficients.c,\n   \t\t\t\t\t\t    s = coefficients.s;\n   \t\t\t\t\t\tvar cc = c * c,\n   \t\t\t\t\t\t    ss = s * s;\n\n   \t\t\t\t\t\tvar mix = 2.0 * c * s * m01;\n\n   \t\t\t\t\t\te[0] = cc * m00 - mix + ss * m11;\n   \t\t\t\t\t\te[1] = 0;\n   \t\t\t\t\t\te[2] = c * m02 - s * m12;\n\n   \t\t\t\t\t\te[3] = ss * m00 + mix + cc * m11;\n   \t\t\t\t\t\te[4] = s * m02 + c * m12;\n\n   \t\t\t\t\t\t// e[5] = m22;\n\n   \t\t\t\t\t\treturn coefficients;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Rotates the given matrix.\r\n        *\r\n        * @method rot02\r\n        * @static\r\n        * @param {SymmetricMatrix3} m - A matrix.\r\n        * @return {Object} The coefficients.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"rot02\",\n   \t\t\t\tvalue: function rot02(m) {\n\n   \t\t\t\t\t\tvar e = m.elements;\n\n   \t\t\t\t\t\tvar m00 = e[0],\n   \t\t\t\t\t\t    m01 = e[1],\n   \t\t\t\t\t\t    m02 = e[2];\n   \t\t\t\t\t\tvar m12 = e[4];\n   \t\t\t\t\t\tvar m22 = e[5];\n\n   \t\t\t\t\t\tcalculateSymmetricCoefficients(m00, m02, m22);\n\n   \t\t\t\t\t\tvar c = coefficients.c,\n   \t\t\t\t\t\t    s = coefficients.s;\n   \t\t\t\t\t\tvar cc = c * c,\n   \t\t\t\t\t\t    ss = s * s;\n\n   \t\t\t\t\t\tvar mix = 2.0 * c * s * m02;\n\n   \t\t\t\t\t\te[0] = cc * m00 - mix + ss * m22;\n   \t\t\t\t\t\te[1] = c * m01 - s * m12;\n   \t\t\t\t\t\te[2] = 0;\n\n   \t\t\t\t\t\t// e[3] = m11;\n   \t\t\t\t\t\te[4] = s * m01 + c * m12;\n\n   \t\t\t\t\t\te[5] = ss * m00 + mix + cc * m22;\n\n   \t\t\t\t\t\treturn coefficients;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Rotates the given matrix.\r\n        *\r\n        * @method rot12\r\n        * @static\r\n        * @param {SymmetricMatrix3} m - A matrix.\r\n        * @return {Object} The coefficients.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"rot12\",\n   \t\t\t\tvalue: function rot12(m) {\n\n   \t\t\t\t\t\tvar e = m.elements;\n\n   \t\t\t\t\t\tvar m01 = e[1],\n   \t\t\t\t\t\t    m02 = e[2];\n   \t\t\t\t\t\tvar m11 = e[3],\n   \t\t\t\t\t\t    m12 = e[4];\n   \t\t\t\t\t\tvar m22 = e[5];\n\n   \t\t\t\t\t\tcalculateSymmetricCoefficients(m11, m12, m22);\n\n   \t\t\t\t\t\tvar c = coefficients.c,\n   \t\t\t\t\t\t    s = coefficients.s;\n   \t\t\t\t\t\tvar cc = c * c,\n   \t\t\t\t\t\t    ss = s * s;\n\n   \t\t\t\t\t\tvar mix = 2.0 * c * s * m12;\n\n   \t\t\t\t\t\t// e[0] = m00;\n   \t\t\t\t\t\te[1] = c * m01 - s * m02;\n   \t\t\t\t\t\te[2] = s * m01 + c * m02;\n\n   \t\t\t\t\t\te[3] = cc * m11 - mix + ss * m22;\n   \t\t\t\t\t\te[4] = 0;\n\n   \t\t\t\t\t\te[5] = ss * m11 + mix + cc * m22;\n\n   \t\t\t\t\t\treturn coefficients;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Schur;\n   }();\n\n   /**\r\n    * Rotates the given matrix.\r\n    *\r\n    * @method rotate01\r\n    * @private\r\n    * @static\r\n    * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n    * @param {Matrix3} v - A matrix.\r\n    */\n\n   function rotate01(vtav, v) {\n\n   \tvar m01 = vtav.elements[1];\n\n   \tif (m01 !== 0) {\n\n   \t\tGivens.rot01Post(v, Schur.rot01(vtav));\n   \t}\n   }\n\n   /**\r\n    * Rotates the given matrix.\r\n    *\r\n    * @method rotate02\r\n    * @private\r\n    * @static\r\n    * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n    * @param {Matrix3} v - A matrix.\r\n    */\n\n   function rotate02(vtav, v) {\n\n   \tvar m02 = vtav.elements[2];\n\n   \tif (m02 !== 0) {\n\n   \t\tGivens.rot02Post(v, Schur.rot02(vtav));\n   \t}\n   }\n\n   /**\r\n    * Rotates the given matrix.\r\n    *\r\n    * @method rotate12\r\n    * @private\r\n    * @static\r\n    * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n    * @param {Matrix3} v - A matrix.\r\n    */\n\n   function rotate12(vtav, v) {\n\n   \tvar m12 = vtav.elements[4];\n\n   \tif (m12 !== 0) {\n\n   \t\tGivens.rot12Post(v, Schur.rot12(vtav));\n   \t}\n   }\n\n   /**\r\n    * Computes the symmetric Singular Value Decomposition.\r\n    *\r\n    * @method getSymmetricSVD\r\n    * @private\r\n    * @static\r\n    * @param {SymmetricMatrix3} a - A symmetric matrix.\r\n    * @param {SymmetricMatrix3} vtav - A symmetric matrix.\r\n    * @param {Matrix3} v - A matrix.\r\n    * @param {Number} threshold - A threshold.\r\n    * @param {Number} maxSweeps - The maximum number of sweeps.\r\n    */\n\n   function getSymmetricSVD(a, vtav, v, threshold, maxSweeps) {\n\n   \tvar delta = threshold * vtav.copy(a).norm();\n\n   \tvar i = void 0;\n\n   \tfor (i = 0; i < maxSweeps && vtav.off() > delta; ++i) {\n\n   \t\trotate01(vtav, v);\n   \t\trotate02(vtav, v);\n   \t\trotate12(vtav, v);\n   \t}\n   }\n\n   /**\r\n    * Computes the pseudo inverse of a given value.\r\n    *\r\n    * @method pinv\r\n    * @private\r\n    * @static\r\n    * @param {Number} x - The value to invert.\r\n    * @param {Number} threshold - A threshold.\r\n    * @return {Number} The inverted value.\r\n    */\n\n   function pinv(x, threshold) {\n\n   \tvar invX = 1.0 / x;\n\n   \treturn Math.abs(x) < threshold || Math.abs(invX) < threshold ? 0.0 : invX;\n   }\n\n   /**\r\n    * Calculates the pseudo inverse of the given matrix.\r\n    *\r\n    * @method pseudoInverse\r\n    * @private\r\n    * @static\r\n    * @param {Matrix3} t - The target matrix.\r\n    * @param {SymmetricMatrix3} a - A symmetric matrix.\r\n    * @param {Matrix3} b - A matrix.\r\n    * @param {Number} threshold - A threshold.\r\n    * @return {Number} A dimension indicating the amount of truncated singular values.\r\n    */\n\n   function pseudoInverse(t, a, b, threshold) {\n\n   \tvar te = t.elements;\n   \tvar ae = a.elements;\n   \tvar be = b.elements;\n\n   \tvar a00 = ae[0];\n   \tvar a11 = ae[3];\n   \tvar a22 = ae[5];\n\n   \tvar a0 = pinv(a00, threshold);\n   \tvar a1 = pinv(a11, threshold);\n   \tvar a2 = pinv(a22, threshold);\n\n   \t// Count how many singular values have been truncated.\n   \tvar truncatedValues = (a0 === 0.0) + (a1 === 0.0) + (a2 === 0.0);\n\n   \t// Compute the feature dimension.\n   \tvar dimension = 3 - truncatedValues;\n\n   \tvar b00 = be[0],\n   \t    b01 = be[3],\n   \t    b02 = be[6];\n   \tvar b10 = be[1],\n   \t    b11 = be[4],\n   \t    b12 = be[7];\n   \tvar b20 = be[2],\n   \t    b21 = be[5],\n   \t    b22 = be[8];\n\n   \tte[0] = b00 * a0 * b00 + b01 * a1 * b01 + b02 * a2 * b02;\n   \tte[3] = b00 * a0 * b10 + b01 * a1 * b11 + b02 * a2 * b12;\n   \tte[6] = b00 * a0 * b20 + b01 * a1 * b21 + b02 * a2 * b22;\n\n   \tte[1] = te[3];\n   \tte[4] = b10 * a0 * b10 + b11 * a1 * b11 + b12 * a2 * b12;\n   \tte[7] = b10 * a0 * b20 + b11 * a1 * b21 + b12 * a2 * b22;\n\n   \tte[2] = te[6];\n   \tte[5] = te[7];\n   \tte[8] = b20 * a0 * b20 + b21 * a1 * b21 + b22 * a2 * b22;\n\n   \treturn dimension;\n   }\n\n   /**\r\n    * A Singular Value Decomposition solver.\r\n    *\r\n    * @class SingularValueDecomposition\r\n    * @submodule math\r\n    * @static\r\n    */\n\n   var SingularValueDecomposition = function () {\n   \tfunction SingularValueDecomposition() {\n   \t\tclassCallCheck(this, SingularValueDecomposition);\n   \t}\n\n   \tcreateClass(SingularValueDecomposition, null, [{\n   \t\tkey: \"solveSymmetric\",\n\n\n   \t\t/**\r\n      * Performs the Singular Value Decomposition.\r\n      *\r\n      * @method solveSymmetric\r\n      * @static\r\n      * @param {SymmetricMatrix3} a - A symmetric matrix.\r\n      * @param {Vector3} b - A vector.\r\n      * @param {Vector3} x - A target vector.\r\n      * @param {Number} svdThreshold - A threshold.\r\n      * @param {Number} svdSweeps - The maximum number of SVD sweeps.\r\n      * @param {Number} pseudoInverseThreshold - A threshold.\r\n      * @return {Number} A dimension indicating the amount of truncated singular values.\r\n      */\n\n   \t\tvalue: function solveSymmetric(a, b, x, svdThreshold, svdSweeps, pseudoInverseThreshold) {\n\n   \t\t\tvar v = new Matrix3();\n\n   \t\t\tvar pinv = new Matrix3();\n   \t\t\tvar vtav = new SymmetricMatrix3();\n\n   \t\t\tvar dimension = void 0;\n\n   \t\t\tpinv.set(0, 0, 0, 0, 0, 0, 0, 0, 0);\n\n   \t\t\tvtav.set(0, 0, 0, 0, 0, 0);\n\n   \t\t\tgetSymmetricSVD(a, vtav, v, svdThreshold, svdSweeps);\n\n   \t\t\t// Least squares.\n   \t\t\tdimension = pseudoInverse(pinv, vtav, v, pseudoInverseThreshold);\n\n   \t\t\tx.copy(b).applyMatrix3(pinv);\n\n   \t\t\treturn dimension;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the error of the Singular Value Decomposition.\r\n      *\r\n      * @method calculateError\r\n      * @static\r\n      * @param {SymmetricMatrix3} t - A symmetric matrix.\r\n      * @param {Vector3} b - A vector.\r\n      * @param {Vector3} x - The calculated position.\r\n      * @return {Number} The error.\r\n      */\n\n   \t}, {\n   \t\tkey: \"calculateError\",\n   \t\tvalue: function calculateError(t, b, x) {\n\n   \t\t\tvar e = t.elements;\n   \t\t\tvar v = x.clone();\n   \t\t\tvar a = new Matrix3();\n\n   \t\t\t// Set symmetrically.\n   \t\t\ta.set(e[0], e[1], e[2], e[1], e[3], e[4], e[2], e[4], e[5]);\n\n   \t\t\tv.applyMatrix3(a);\n   \t\t\tv.subVectors(b, v);\n\n   \t\t\treturn v.lengthSq();\n   \t\t}\n   \t}]);\n   \treturn SingularValueDecomposition;\n   }();\n\n   /**\r\n    * A Quaratic Error Function solver.\r\n    *\r\n    * Finds a point inside a voxel that minimises the sum of the squares of the\r\n    * distances to the surface intersection planes associated with the voxel.\r\n    *\r\n    * @class QEFSolver\r\n    * @submodule math\r\n    * @constructor\r\n    * @param {Number} [svdThreshold=1e-6] - A threshold for the Singular Value Decomposition error.\r\n    * @param {Number} [svdSweeps=4] - Number of Singular Value Decomposition sweeps.\r\n    * @param {Number} [pseudoInverseThreshold=1e-6] - A threshold for the pseudo inverse error.\r\n    */\n\n   var QEFSolver = function () {\n   \t\tfunction QEFSolver() {\n   \t\t\t\tvar svdThreshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-6;\n   \t\t\t\tvar svdSweeps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;\n   \t\t\t\tvar pseudoInverseThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;\n   \t\t\t\tclassCallCheck(this, QEFSolver);\n\n\n   \t\t\t\t/**\r\n        * A Singular Value Decomposition error threshold.\r\n        *\r\n        * @property svdThreshold\r\n        * @type Number\r\n        * @private\r\n        * @default 1e-6\r\n        */\n\n   \t\t\t\tthis.svdThreshold = svdThreshold;\n\n   \t\t\t\t/**\r\n        * The number of Singular Value Decomposition sweeps.\r\n        *\r\n        * @property svdSweeps\r\n        * @type Number\r\n        * @private\r\n        * @default 4\r\n        */\n\n   \t\t\t\tthis.svdSweeps = svdSweeps;\n\n   \t\t\t\t/**\r\n        * A pseudo inverse error threshold.\r\n        *\r\n        * @property pseudoInverseThreshold\r\n        * @type Number\r\n        * @private\r\n        * @default 1e-6\r\n        */\n\n   \t\t\t\tthis.pseudoInverseThreshold = pseudoInverseThreshold;\n\n   \t\t\t\t/**\r\n        * QEF data.\r\n        *\r\n        * @property data\r\n        * @type QEFData\r\n        * @private\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.data = null;\n\n   \t\t\t\t/**\r\n        * The average of the surface intersection points of a voxel.\r\n        *\r\n        * @property massPoint\r\n        * @type Vector3\r\n        */\n\n   \t\t\t\tthis.massPoint = new Vector3$1();\n\n   \t\t\t\t/**\r\n        * A symmetric matrix.\r\n        *\r\n        * @property ata\r\n        * @type SymmetricMatrix3\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.ata = new SymmetricMatrix3();\n\n   \t\t\t\t/**\r\n        * A vector.\r\n        *\r\n        * @property atb\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.atb = new Vector3$1();\n\n   \t\t\t\t/**\r\n        * A calculated vertex position.\r\n        *\r\n        * @property x\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.x = new Vector3$1();\n\n   \t\t\t\t/**\r\n        * Indicates whether this solver has a solution.\r\n        *\r\n        * @property hasSolution\r\n        * @type Boolean\r\n        */\n\n   \t\t\t\tthis.hasSolution = false;\n   \t\t}\n\n   \t\t/**\r\n      * Computes the error of the approximated position.\r\n      *\r\n      * @method computeError\r\n      * @return {Number} The QEF error.\r\n      */\n\n   \t\tcreateClass(QEFSolver, [{\n   \t\t\t\tkey: \"computeError\",\n   \t\t\t\tvalue: function computeError() {\n\n   \t\t\t\t\t\tvar x = this.x;\n\n   \t\t\t\t\t\tvar error = Infinity;\n   \t\t\t\t\t\tvar atax = void 0;\n\n   \t\t\t\t\t\tif (this.hasSolution) {\n\n   \t\t\t\t\t\t\t\tatax = this.ata.applyToVector3(x.clone());\n   \t\t\t\t\t\t\t\terror = x.dot(atax) - 2.0 * x.dot(this.atb) + this.data.btb;\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn error;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Sets the QEF data.\r\n        *\r\n        * @method setData\r\n        * @chainable\r\n        * @param {QEFData} d - QEF Data.\r\n        * @return {QEFSolver} This solver.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"setData\",\n   \t\t\t\tvalue: function setData(d) {\n\n   \t\t\t\t\t\tthis.data = d;\n   \t\t\t\t\t\tthis.hasSolution = false;\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Solves the Quadratic Error Function.\r\n        *\r\n        * @method solve\r\n        * @return {Vector3} The calculated vertex position.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"solve\",\n   \t\t\t\tvalue: function solve() {\n\n   \t\t\t\t\t\tvar data = this.data;\n   \t\t\t\t\t\tvar massPoint = this.massPoint;\n   \t\t\t\t\t\tvar ata = this.ata;\n   \t\t\t\t\t\tvar atb = this.atb;\n   \t\t\t\t\t\tvar x = this.x;\n\n   \t\t\t\t\t\tvar mp = void 0;\n\n   \t\t\t\t\t\tif (!this.hasSolution && data !== null && data.numPoints > 0) {\n\n   \t\t\t\t\t\t\t\t// The mass point is a sum, so divide it to make it the average.\n   \t\t\t\t\t\t\t\tmassPoint.copy(data.massPoint);\n   \t\t\t\t\t\t\t\tmassPoint.divideScalar(data.numPoints);\n\n   \t\t\t\t\t\t\t\tata.copy(data.ata);\n   \t\t\t\t\t\t\t\tatb.copy(data.atb);\n\n   \t\t\t\t\t\t\t\tmp = ata.applyToVector3(massPoint.clone());\n   \t\t\t\t\t\t\t\tatb.sub(mp);\n\n   \t\t\t\t\t\t\t\tx.set(0, 0, 0);\n\n   \t\t\t\t\t\t\t\tdata.massPointDimension = SingularValueDecomposition.solveSymmetric(ata, atb, x, this.svdThreshold, this.svdSweeps, this.pseudoInverseThreshold);\n\n   \t\t\t\t\t\t\t\t// svdError = SingularValueDecomposition.calculateError(ata, atb, x);\n\n   \t\t\t\t\t\t\t\tx.add(massPoint);\n\n   \t\t\t\t\t\t\t\tatb.copy(data.atb);\n\n   \t\t\t\t\t\t\t\tthis.hasSolution = true;\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn x;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Clears this QEF instance.\r\n        *\r\n        * @method clear\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"clear\",\n   \t\t\t\tvalue: function clear() {\n\n   \t\t\t\t\t\tthis.data = null;\n   \t\t\t\t\t\tthis.hasSolution = false;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn QEFSolver;\n   }();\n\n   /**\r\n    * An isovalue bias for the Zero Crossing approximation.\r\n    *\r\n    * @property BIAS\r\n    * @type Number\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var BIAS = 1e-2;\n\n   /**\r\n    * An error threshold for the Zero Crossing approximation.\r\n    *\r\n    * @property THRESHOLD\r\n    * @type Number\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var THRESHOLD = 1e-6;\n\n   /**\r\n    * A vector.\r\n    *\r\n    * @property AB\r\n    * @type Vector3\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var AB = new Vector3$1();\n\n   /**\r\n    * A point.\r\n    *\r\n    * @property P\r\n    * @type Vector3\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var P = new Vector3$1();\n\n   /**\r\n    * A vector.\r\n    *\r\n    * @property V\r\n    * @type Vector3\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var V = new Vector3$1();\n\n   /**\r\n    * An edge.\r\n    *\r\n    * @class Edge\r\n    * @submodule volume\r\n    * @constructor\r\n    * @param {Vector3} a - A starting point.\r\n    * @param {Vector3} b - An ending point.\r\n    */\n\n   var Edge = function () {\n   \t\tfunction Edge() {\n   \t\t\t\tvar a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();\n   \t\t\t\tvar b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();\n   \t\t\t\tclassCallCheck(this, Edge);\n\n\n   \t\t\t\t/**\r\n        * The starting point of the edge.\r\n        *\r\n        * @property a\r\n        * @type Vector3\r\n        */\n\n   \t\t\t\tthis.a = a;\n\n   \t\t\t\t/**\r\n        * The ending point of the edge.\r\n        *\r\n        * @property b\r\n        * @type Vector3\r\n        */\n\n   \t\t\t\tthis.b = b;\n\n   \t\t\t\t/**\r\n        * The Zero Crossing interpolation value.\r\n        *\r\n        * @property t\r\n        * @type Number\r\n        */\n\n   \t\t\t\tthis.t = 0.0;\n\n   \t\t\t\t/**\r\n        * The surface normal at the Zero Crossing position.\r\n        *\r\n        * @property n\r\n        * @type Vector3\r\n        */\n\n   \t\t\t\tthis.n = new Vector3$1();\n   \t\t}\n\n   \t\t/**\r\n      * Approximates the smallest density along the edge.\r\n      *\r\n      * @method approximateZeroCrossing\r\n      * @param {SignedDistanceFunction} sdf - A density field.\r\n      * @param {Number} [steps=8] - The maximum number of interpolation steps. Cannot be smaller than 2.\r\n      */\n\n   \t\tcreateClass(Edge, [{\n   \t\t\t\tkey: \"approximateZeroCrossing\",\n   \t\t\t\tvalue: function approximateZeroCrossing(sdf) {\n   \t\t\t\t\t\tvar steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;\n\n\n   \t\t\t\t\t\tvar s = Math.max(1, steps - 1);\n\n   \t\t\t\t\t\tvar a = 0.0;\n   \t\t\t\t\t\tvar b = 1.0;\n   \t\t\t\t\t\tvar c = 0.0;\n   \t\t\t\t\t\tvar i = 0;\n\n   \t\t\t\t\t\tvar densityA = void 0,\n   \t\t\t\t\t\t    densityC = void 0;\n\n   \t\t\t\t\t\t// Compute the vector from a to b.\n   \t\t\t\t\t\tAB.subVectors(this.b, this.a);\n\n   \t\t\t\t\t\t// Use bisection to find the root of the SDF.\n   \t\t\t\t\t\twhile (i <= s) {\n\n   \t\t\t\t\t\t\t\tc = (a + b) / 2;\n\n   \t\t\t\t\t\t\t\tP.addVectors(this.a, V.copy(AB).multiplyScalar(c));\n   \t\t\t\t\t\t\t\tdensityC = sdf.sample(P);\n\n   \t\t\t\t\t\t\t\tif (Math.abs(densityC) <= BIAS || (b - a) / 2 <= THRESHOLD) {\n\n   \t\t\t\t\t\t\t\t\t\t// Solution found.\n   \t\t\t\t\t\t\t\t\t\tbreak;\n   \t\t\t\t\t\t\t\t} else {\n\n   \t\t\t\t\t\t\t\t\t\tP.addVectors(this.a, V.copy(AB).multiplyScalar(a));\n   \t\t\t\t\t\t\t\t\t\tdensityA = sdf.sample(P);\n\n   \t\t\t\t\t\t\t\t\t\tif (Math.sign(densityC) === Math.sign(densityA)) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\ta = c;\n   \t\t\t\t\t\t\t\t\t\t} else {\n\n   \t\t\t\t\t\t\t\t\t\t\t\tb = c;\n   \t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\t++i;\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tthis.t = c;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Calculates the Zero Crossing position.\r\n        *\r\n        * @method computeZeroCrossingPosition\r\n        * @return {Vector3} The Zero Crossing position. The returned vector is volatile.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"computeZeroCrossingPosition\",\n   \t\t\t\tvalue: function computeZeroCrossingPosition() {\n\n   \t\t\t\t\t\treturn AB.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Computes the normal of the surface at the edge intersection.\r\n        *\r\n        * @method computeSurfaceNormal\r\n        * @param {SignedDistanceFunction} sdf - A density field.\r\n        * @return {Vector3} The normal.\r\n        * @todo Use analytical derivation instead of finite differences.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"computeSurfaceNormal\",\n   \t\t\t\tvalue: function computeSurfaceNormal(sdf) {\n\n   \t\t\t\t\t\tvar position = this.computeZeroCrossingPosition();\n   \t\t\t\t\t\tvar E = 1e-3;\n\n   \t\t\t\t\t\tvar dx = sdf.sample(P.addVectors(position, V.set(E, 0, 0))) - sdf.sample(P.subVectors(position, V.set(E, 0, 0)));\n   \t\t\t\t\t\tvar dy = sdf.sample(P.addVectors(position, V.set(0, E, 0))) - sdf.sample(P.subVectors(position, V.set(0, E, 0)));\n   \t\t\t\t\t\tvar dz = sdf.sample(P.addVectors(position, V.set(0, 0, E))) - sdf.sample(P.subVectors(position, V.set(0, 0, E)));\n\n   \t\t\t\t\t\tthis.n.set(dx, dy, dz).normalize();\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Edge;\n   }();\n\n   /**\r\n    * A cubic voxel that holds information about the surface of a volume.\r\n    *\r\n    * @class Voxel\r\n    * @submodule volume\r\n    * @constructor\r\n    */\n\n   var Voxel = function Voxel() {\n   \t\tclassCallCheck(this, Voxel);\n\n\n   \t\t/**\r\n      * Holds binary material information about all eight corners of this voxel.\r\n      *\r\n      * A value of 0 means that this voxel is completely outside of the volume,\r\n      * whereas a value of 255 means that it's fully inside of it. Any other\r\n      * value indicates a material change which implies that the voxel contains\r\n      * the surface.\r\n      *\r\n      * @property materials\r\n      * @type Number\r\n      * @default 0\r\n      */\n\n   \t\tthis.materials = 0;\n\n   \t\t/**\r\n      * The amount of edges that exhibit a material change in this voxel.\r\n      *\r\n      * @property edgeCount\r\n      * @type Number\r\n      * @default 0\r\n      */\n\n   \t\tthis.edgeCount = 0;\n\n   \t\t/**\r\n      * A generated index for this voxel's vertex. Used during the construction\r\n      * of the final polygons.\r\n      *\r\n      * @property index\r\n      * @type Number\r\n      * @default -1\r\n      */\n\n   \t\tthis.index = -1;\n\n   \t\t/**\r\n      * The vertex that lies inside this voxel.\r\n      *\r\n      * @property position\r\n      * @type Vector3\r\n      */\n\n   \t\tthis.position = new Vector3$1();\n\n   \t\t/**\r\n      * The normal of the vertex that lies inside this voxel.\r\n      *\r\n      * @property normal\r\n      * @type Vector3\r\n      */\n\n   \t\tthis.normal = new Vector3$1();\n\n   \t\t/**\r\n      * A QEF data construct. Used to calculate the vertex position.\r\n      *\r\n      * @property qefData\r\n      * @type QEFData\r\n      * @default null\r\n      */\n\n   \t\tthis.qefData = null;\n   };\n\n   /**\r\n    * A bias for boundary checks.\r\n    *\r\n    * @property BIAS\r\n    * @type Number\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var BIAS$1 = 1e-6;\n\n   /**\r\n    * The base QEF error threshold.\r\n    *\r\n    * @property THRESHOLD\r\n    * @type Number\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var THRESHOLD$1 = 1e-2;\n\n   /**\r\n    * A QEF error threshold for voxel clustering.\r\n    *\r\n    * @property threshold\r\n    * @type Number\r\n    * @private\r\n    * @static\r\n    */\n\n   var threshold = 0.0;\n\n   /**\r\n    * A voxel octant.\r\n    *\r\n    * @class VoxelCell\r\n    * @submodule octree\r\n    * @extends CubicOctant\r\n    * @constructor\r\n    * @param {Vector3} [min] - The lower bounds.\r\n    * @param {Number} [size] - The size of the octant.\r\n    */\n\n   var VoxelCell = function (_CubicOctant) {\n   \tinherits(VoxelCell, _CubicOctant);\n\n   \tfunction VoxelCell(min, size) {\n   \t\tclassCallCheck(this, VoxelCell);\n\n   \t\t/**\r\n      * A voxel that contains draw information.\r\n      *\r\n      * @property voxel\r\n      * @type Voxel\r\n      * @default null\r\n      */\n\n   \t\tvar _this = possibleConstructorReturn(this, (VoxelCell.__proto__ || Object.getPrototypeOf(VoxelCell)).call(this, min, size));\n\n   \t\t_this.voxel = null;\n\n   \t\treturn _this;\n   \t}\n\n   \t/**\r\n     * The level of detail.\r\n     *\r\n     * @property lod\r\n     * @type Number\r\n     */\n\n   \tcreateClass(VoxelCell, [{\n   \t\tkey: \"contains\",\n\n\n   \t\t/**\r\n      * Checks if the given point lies inside this cell's boundaries.\r\n      *\r\n      * @method contains\r\n      * @param {Vector3} p - A point.\r\n      * @return {Boolean} Whether the given point lies inside this cell.\r\n      */\n\n   \t\tvalue: function contains(p) {\n\n   \t\t\tvar min = this.min;\n   \t\t\tvar size = this.size;\n\n   \t\t\treturn p.x >= min.x - BIAS$1 && p.y >= min.y - BIAS$1 && p.z >= min.z - BIAS$1 && p.x <= min.x + size + BIAS$1 && p.y <= min.y + size + BIAS$1 && p.z <= min.z + size + BIAS$1;\n   \t\t}\n\n   \t\t/**\r\n      * Attempts to simplify this cell.\r\n      *\r\n      * @method collapse\r\n      * @return {Number} The amount of removed voxels.\r\n      */\n\n   \t}, {\n   \t\tkey: \"collapse\",\n   \t\tvalue: function collapse() {\n\n   \t\t\tvar children = this.children;\n\n   \t\t\tvar signs = new Int16Array([-1, -1, -1, -1, -1, -1, -1, -1]);\n\n   \t\t\tvar midSign = -1;\n   \t\t\tvar collapsible = children !== null;\n\n   \t\t\tvar removedVoxels = 0;\n\n   \t\t\tvar qefData = void 0,\n   \t\t\t    qefSolver = void 0;\n   \t\t\tvar child = void 0,\n   \t\t\t    sign = void 0,\n   \t\t\t    voxel = void 0;\n   \t\t\tvar position = void 0;\n\n   \t\t\tvar v = void 0,\n   \t\t\t    i = void 0;\n\n   \t\t\tif (collapsible) {\n\n   \t\t\t\tqefData = new QEFData();\n\n   \t\t\t\tfor (v = 0, i = 0; i < 8; ++i) {\n\n   \t\t\t\t\tchild = children[i];\n\n   \t\t\t\t\tremovedVoxels += child.collapse();\n\n   \t\t\t\t\tvoxel = child.voxel;\n\n   \t\t\t\t\tif (child.children !== null) {\n\n   \t\t\t\t\t\t// Couldn't simplify the child.\n   \t\t\t\t\t\tcollapsible = false;\n   \t\t\t\t\t} else if (voxel !== null) {\n\n   \t\t\t\t\t\tqefData.addData(voxel.qefData);\n\n   \t\t\t\t\t\tmidSign = voxel.materials >> 7 - i & 1;\n   \t\t\t\t\t\tsigns[i] = voxel.materials >> i & 1;\n\n   \t\t\t\t\t\t++v;\n   \t\t\t\t\t}\n   \t\t\t\t}\n\n   \t\t\t\tif (collapsible) {\n\n   \t\t\t\t\tqefSolver = new QEFSolver();\n   \t\t\t\t\tposition = qefSolver.setData(qefData).solve();\n\n   \t\t\t\t\tif (qefSolver.computeError() <= threshold) {\n\n   \t\t\t\t\t\tvoxel = new Voxel();\n   \t\t\t\t\t\tvoxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);\n\n   \t\t\t\t\t\tfor (i = 0; i < 8; ++i) {\n\n   \t\t\t\t\t\t\tsign = signs[i];\n   \t\t\t\t\t\t\tchild = children[i];\n\n   \t\t\t\t\t\t\tif (sign === -1) {\n\n   \t\t\t\t\t\t\t\t// Undetermined, use mid sign instead.\n   \t\t\t\t\t\t\t\tvoxel.materials |= midSign << i;\n   \t\t\t\t\t\t\t} else {\n\n   \t\t\t\t\t\t\t\tvoxel.materials |= sign << i;\n\n   \t\t\t\t\t\t\t\t// Accumulate normals.\n   \t\t\t\t\t\t\t\tvoxel.normal.add(child.voxel.normal);\n   \t\t\t\t\t\t\t}\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tvoxel.normal.normalize();\n   \t\t\t\t\t\tvoxel.qefData = qefData;\n\n   \t\t\t\t\t\tthis.voxel = voxel;\n   \t\t\t\t\t\tthis.children = null;\n\n   \t\t\t\t\t\t// Removed existing voxels and created a new one.\n   \t\t\t\t\t\tremovedVoxels += v - 1;\n   \t\t\t\t\t}\n   \t\t\t\t}\n   \t\t\t}\n\n   \t\t\treturn removedVoxels;\n   \t\t}\n   \t}, {\n   \t\tkey: \"lod\",\n   \t\tget: function get$$1() {\n   \t\t\treturn threshold;\n   \t\t},\n   \t\tset: function set$$1(lod) {\n\n   \t\t\tthreshold = THRESHOLD$1 + lod * lod * lod;\n   \t\t}\n   \t}]);\n   \treturn VoxelCell;\n   }(CubicOctant);\n\n   /**\r\n    * Creates a voxel and builds a material configuration code from the materials\r\n    * in the voxel corners.\r\n    *\r\n    * @method createVoxel\r\n    * @private\r\n    * @static\r\n    * @param {Number} n - The grid resolution.\r\n    * @param {Number} x - A local grid point X-coordinate.\r\n    * @param {Number} y - A local grid point Y-coordinate.\r\n    * @param {Number} z - A local grid point Z-coordinate.\r\n    * @param {Uint8Array} materialIndices - The material indices.\r\n    * @return {Voxel} A voxel.\r\n    */\n\n   function createVoxel(n, x, y, z, materialIndices) {\n\n   \t\tvar m = n + 1;\n   \t\tvar mm = m * m;\n\n   \t\tvar voxel = new Voxel();\n\n   \t\tvar materials = void 0,\n   \t\t    edgeCount = void 0;\n   \t\tvar material = void 0,\n   \t\t    offset = void 0,\n   \t\t    index = void 0;\n   \t\tvar c1 = void 0,\n   \t\t    c2 = void 0,\n   \t\t    m1 = void 0,\n   \t\t    m2 = void 0;\n\n   \t\tvar i = void 0;\n\n   \t\t// Pack the material information of the eight corners into a single byte.\n   \t\tfor (materials = 0, i = 0; i < 8; ++i) {\n\n   \t\t\t\t// Translate the coordinates into a one-dimensional grid point index.\n   \t\t\t\toffset = PATTERN[i];\n   \t\t\t\tindex = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);\n\n   \t\t\t\t// Convert the identified material index into a binary value.\n   \t\t\t\tmaterial = Math.min(materialIndices[index], Material.SOLID);\n\n   \t\t\t\t// Store the value in bit i.\n   \t\t\t\tmaterials |= material << i;\n   \t\t}\n\n   \t\t// Find out how many edges intersect with the implicit surface.\n   \t\tfor (edgeCount = 0, i = 0; i < 12; ++i) {\n\n   \t\t\t\tc1 = EDGES[i][0];\n   \t\t\t\tc2 = EDGES[i][1];\n\n   \t\t\t\tm1 = materials >> c1 & 1;\n   \t\t\t\tm2 = materials >> c2 & 1;\n\n   \t\t\t\t// Check if there is a material change on the edge.\n   \t\t\t\tif (m1 !== m2) {\n\n   \t\t\t\t\t\t++edgeCount;\n   \t\t\t\t}\n   \t\t}\n\n   \t\tvoxel.materials = materials;\n   \t\tvoxel.edgeCount = edgeCount;\n   \t\tvoxel.qefData = new QEFData();\n\n   \t\treturn voxel;\n   }\n\n   /**\r\n    * A cubic voxel octree.\r\n    *\r\n    * @class VoxelBlock\r\n    * @submodule octree\r\n    * @extends Octree\r\n    * @constructor\r\n    * @param {Chunk} chunk - A volume chunk.\r\n    */\n\n   var VoxelBlock = function (_Octree) {\n   \t\tinherits(VoxelBlock, _Octree);\n\n   \t\tfunction VoxelBlock(chunk) {\n   \t\t\t\tclassCallCheck(this, VoxelBlock);\n\n   \t\t\t\tvar _this = possibleConstructorReturn(this, (VoxelBlock.__proto__ || Object.getPrototypeOf(VoxelBlock)).call(this));\n\n   \t\t\t\t_this.root = new VoxelCell(chunk.min, chunk.size);\n   \t\t\t\t_this.root.lod = chunk.data.lod;\n\n   \t\t\t\t/**\r\n        * The amount of voxels in this block.\r\n        *\r\n        * @property voxelCount\r\n        * @type Number\r\n        */\n\n   \t\t\t\t_this.voxelCount = 0;\n\n   \t\t\t\t// Create voxel cells from Hermite data and apply level of detail.\n   \t\t\t\t_this.construct(chunk);\n   \t\t\t\t_this.simplify();\n\n   \t\t\t\treturn _this;\n   \t\t}\n\n   \t\t/**\r\n      * Attempts to simplify the octree by clustering voxels.\r\n      *\r\n      * @method simplify\r\n      * @private\r\n      */\n\n   \t\tcreateClass(VoxelBlock, [{\n   \t\t\t\tkey: \"simplify\",\n   \t\t\t\tvalue: function simplify() {\n\n   \t\t\t\t\t\tthis.voxelCount -= this.root.collapse();\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Creates intermediate voxel cells down to the leaf octant that is described\r\n        * by the given local grid coordinates and returns it.\r\n        *\r\n        * @method getCell\r\n        * @private\r\n        * @param {Number} n - The grid resolution.\r\n        * @param {Number} x - A local grid point X-coordinate.\r\n        * @param {Number} y - A local grid point Y-coordinate.\r\n        * @param {Number} z - A local grid point Z-coordinate.\r\n        * @return {VoxelCell} A leaf voxel cell.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"getCell\",\n   \t\t\t\tvalue: function getCell(n, x, y, z) {\n\n   \t\t\t\t\t\tvar cell = this.root;\n   \t\t\t\t\t\tvar i = 0;\n\n   \t\t\t\t\t\tfor (n = n >> 1; n > 0; n >>= 1, i = 0) {\n\n   \t\t\t\t\t\t\t\t// Identify the next octant by the grid coordinates.\n   \t\t\t\t\t\t\t\tif (x >= n) {\n   \t\t\t\t\t\t\t\t\t\ti += 4;x -= n;\n   \t\t\t\t\t\t\t\t} // YZ.\n   \t\t\t\t\t\t\t\tif (y >= n) {\n   \t\t\t\t\t\t\t\t\t\ti += 2;y -= n;\n   \t\t\t\t\t\t\t\t} // XZ.\n   \t\t\t\t\t\t\t\tif (z >= n) {\n   \t\t\t\t\t\t\t\t\t\ti += 1;z -= n;\n   \t\t\t\t\t\t\t\t} // XY.\n\n   \t\t\t\t\t\t\t\tif (cell.children === null) {\n\n   \t\t\t\t\t\t\t\t\t\tcell.split();\n   \t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\tcell = cell.children[i];\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn cell;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Constructs voxel cells from volume data.\r\n        *\r\n        * @method construct\r\n        * @private\r\n        * @param {Chunk} chunk - A volume chunk.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"construct\",\n   \t\t\t\tvalue: function construct(chunk) {\n\n   \t\t\t\t\t\tvar s = chunk.size;\n   \t\t\t\t\t\tvar n = chunk.resolution;\n   \t\t\t\t\t\tvar m = n + 1;\n   \t\t\t\t\t\tvar mm = m * m;\n\n   \t\t\t\t\t\tvar data = chunk.data;\n   \t\t\t\t\t\tvar edgeData = data.edgeData;\n   \t\t\t\t\t\tvar materialIndices = data.materialIndices;\n\n   \t\t\t\t\t\tvar qefSolver = new QEFSolver();\n\n   \t\t\t\t\t\tvar base = chunk.min;\n   \t\t\t\t\t\tvar offsetA = new Vector3$1();\n   \t\t\t\t\t\tvar offsetB = new Vector3$1();\n   \t\t\t\t\t\tvar intersection = new Vector3$1();\n   \t\t\t\t\t\tvar edge = new Edge();\n\n   \t\t\t\t\t\tvar sequences = [new Uint8Array([0, 1, 2, 3]), new Uint8Array([0, 1, 4, 5]), new Uint8Array([0, 2, 4, 6])];\n\n   \t\t\t\t\t\tvar voxelCount = 0;\n\n   \t\t\t\t\t\tvar edges = void 0,\n   \t\t\t\t\t\t    zeroCrossings = void 0,\n   \t\t\t\t\t\t    normals = void 0;\n   \t\t\t\t\t\tvar sequence = void 0,\n   \t\t\t\t\t\t    offset = void 0;\n   \t\t\t\t\t\tvar voxel = void 0,\n   \t\t\t\t\t\t    position = void 0;\n   \t\t\t\t\t\tvar axis = void 0,\n   \t\t\t\t\t\t    cell = void 0;\n\n   \t\t\t\t\t\tvar a = void 0,\n   \t\t\t\t\t\t    d = void 0,\n   \t\t\t\t\t\t    i = void 0,\n   \t\t\t\t\t\t    j = void 0,\n   \t\t\t\t\t\t    l = void 0;\n   \t\t\t\t\t\tvar x2 = void 0,\n   \t\t\t\t\t\t    y2 = void 0,\n   \t\t\t\t\t\t    z2 = void 0;\n   \t\t\t\t\t\tvar x = void 0,\n   \t\t\t\t\t\t    y = void 0,\n   \t\t\t\t\t\t    z = void 0;\n\n   \t\t\t\t\t\tvar index = void 0;\n\n   \t\t\t\t\t\tfor (a = 4, d = 0; d < 3; ++d, a >>= 1) {\n\n   \t\t\t\t\t\t\t\taxis = PATTERN[a];\n\n   \t\t\t\t\t\t\t\tedges = edgeData.edges[d];\n   \t\t\t\t\t\t\t\tzeroCrossings = edgeData.zeroCrossings[d];\n   \t\t\t\t\t\t\t\tnormals = edgeData.normals[d];\n\n   \t\t\t\t\t\t\t\tsequence = sequences[d];\n\n   \t\t\t\t\t\t\t\tfor (i = 0, l = edges.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\t\t\t// Each edge is uniquely described by its starting grid point index.\n   \t\t\t\t\t\t\t\t\t\tindex = edges[i];\n\n   \t\t\t\t\t\t\t\t\t\t// Calculate the local grid coordinates from the one-dimensional index.\n   \t\t\t\t\t\t\t\t\t\tx = index % m;\n   \t\t\t\t\t\t\t\t\t\ty = Math.trunc(index % mm / m);\n   \t\t\t\t\t\t\t\t\t\tz = Math.trunc(index / mm);\n\n   \t\t\t\t\t\t\t\t\t\toffsetA.set(x * s / n, y * s / n, z * s / n);\n\n   \t\t\t\t\t\t\t\t\t\toffsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);\n\n   \t\t\t\t\t\t\t\t\t\tedge.a.addVectors(base, offsetA);\n   \t\t\t\t\t\t\t\t\t\tedge.b.addVectors(base, offsetB);\n\n   \t\t\t\t\t\t\t\t\t\tedge.t = zeroCrossings[i];\n   \t\t\t\t\t\t\t\t\t\tedge.n.fromArray(normals, i * 3);\n\n   \t\t\t\t\t\t\t\t\t\tintersection.copy(edge.computeZeroCrossingPosition());\n\n   \t\t\t\t\t\t\t\t\t\t// Each edge can belong to up to four voxel cells.\n   \t\t\t\t\t\t\t\t\t\tfor (j = 0; j < 4; ++j) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t// Rotate around the edge.\n   \t\t\t\t\t\t\t\t\t\t\t\toffset = PATTERN[sequence[j]];\n\n   \t\t\t\t\t\t\t\t\t\t\t\tx2 = x - offset[0];\n   \t\t\t\t\t\t\t\t\t\t\t\ty2 = y - offset[1];\n   \t\t\t\t\t\t\t\t\t\t\t\tz2 = z - offset[2];\n\n   \t\t\t\t\t\t\t\t\t\t\t\t// Check if the adjusted coordinates still lie inside the grid bounds.\n   \t\t\t\t\t\t\t\t\t\t\t\tif (x2 >= 0 && y2 >= 0 && z2 >= 0 && x2 < n && y2 < n && z2 < n) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tcell = this.getCell(n, x2, y2, z2);\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tif (cell.voxel === null) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t// The existence of the edge guarantees that the voxel contains the surface.\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcell.voxel = createVoxel(n, x2, y2, z2, materialIndices);\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t++voxelCount;\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t// Add the edge data to the voxel.\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel = cell.voxel;\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel.normal.add(edge.n);\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel.qefData.add(intersection, edge.n);\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tif (voxel.qefData.numPoints === voxel.edgeCount) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t// Finalise the voxel by solving the accumulated data.\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tposition = qefSolver.setData(voxel.qefData).solve();\n\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel.position.copy(cell.contains(position) ? position : qefSolver.massPoint);\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel.normal.normalize();\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tthis.voxelCount = voxelCount;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn VoxelBlock;\n   }(Octree);\n\n   /**\r\n    * @submodule isosurface\r\n    */\n\n   /**\r\n    * An edge mask.\r\n    *\r\n    * @property EDGE_MASK\r\n    * @for DualContouring\r\n    * @type Uint8Array\r\n    * @static\r\n    * @final\r\n    */\n\n\n\n   /**\r\n    * A face map.\r\n    *\r\n    * @property FACE_MAP\r\n    * @for DualContouring\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n\n\n   /**\r\n    * A face mask for cell processing.\r\n    *\r\n    * @property CELL_PROC_FACE_MASK\r\n    * @for DualContouring\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n   var CELL_PROC_FACE_MASK = [new Uint8Array([0, 4, 0]), new Uint8Array([1, 5, 0]), new Uint8Array([2, 6, 0]), new Uint8Array([3, 7, 0]), new Uint8Array([0, 2, 1]), new Uint8Array([4, 6, 1]), new Uint8Array([1, 3, 1]), new Uint8Array([5, 7, 1]), new Uint8Array([0, 1, 2]), new Uint8Array([2, 3, 2]), new Uint8Array([4, 5, 2]), new Uint8Array([6, 7, 2])];\n\n   /**\r\n    * An edge mask for cell processing.\r\n    *\r\n    * @property CELL_PROC_EDGE_MASK\r\n    * @for DualContouring\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n   var CELL_PROC_EDGE_MASK = [new Uint8Array([0, 1, 2, 3, 0]), new Uint8Array([4, 5, 6, 7, 0]), new Uint8Array([0, 4, 1, 5, 1]), new Uint8Array([2, 6, 3, 7, 1]), new Uint8Array([0, 2, 4, 6, 2]), new Uint8Array([1, 3, 5, 7, 2])];\n\n   /**\r\n    * A face mask for face processing.\r\n    *\r\n    * @property FACE_PROC_FACE_MASK\r\n    * @for DualContouring\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n   var FACE_PROC_FACE_MASK = [[new Uint8Array([4, 0, 0]), new Uint8Array([5, 1, 0]), new Uint8Array([6, 2, 0]), new Uint8Array([7, 3, 0])], [new Uint8Array([2, 0, 1]), new Uint8Array([6, 4, 1]), new Uint8Array([3, 1, 1]), new Uint8Array([7, 5, 1])], [new Uint8Array([1, 0, 2]), new Uint8Array([3, 2, 2]), new Uint8Array([5, 4, 2]), new Uint8Array([7, 6, 2])]];\n\n   /**\r\n    * An edge mask for face processing.\r\n    *\r\n    * @property FACE_PROC_EDGE_MASK\r\n    * @for DualContouring\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n   var FACE_PROC_EDGE_MASK = [[new Uint8Array([1, 4, 0, 5, 1, 1]), new Uint8Array([1, 6, 2, 7, 3, 1]), new Uint8Array([0, 4, 6, 0, 2, 2]), new Uint8Array([0, 5, 7, 1, 3, 2])], [new Uint8Array([0, 2, 3, 0, 1, 0]), new Uint8Array([0, 6, 7, 4, 5, 0]), new Uint8Array([1, 2, 0, 6, 4, 2]), new Uint8Array([1, 3, 1, 7, 5, 2])], [new Uint8Array([1, 1, 0, 3, 2, 0]), new Uint8Array([1, 5, 4, 7, 6, 0]), new Uint8Array([0, 1, 5, 0, 4, 1]), new Uint8Array([0, 3, 7, 2, 6, 1])]];\n\n   /**\r\n    * An edge mask for edge processing.\r\n    *\r\n    * @property EDGE_PROC_EDGE_MASK\r\n    * @for DualContouring\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n   var EDGE_PROC_EDGE_MASK = [[new Uint8Array([3, 2, 1, 0, 0]), new Uint8Array([7, 6, 5, 4, 0])], [new Uint8Array([5, 1, 4, 0, 1]), new Uint8Array([7, 3, 6, 2, 1])], [new Uint8Array([6, 4, 2, 0, 2]), new Uint8Array([7, 5, 3, 1, 2])]];\n\n   /**\r\n    * An edge mask.\r\n    *\r\n    * @property PROC_EDGE_MASK\r\n    * @for DualContouring\r\n    * @type Array\r\n    * @static\r\n    * @final\r\n    */\n\n   var PROC_EDGE_MASK = [new Uint8Array([3, 2, 1, 0]), new Uint8Array([7, 5, 6, 4]), new Uint8Array([11, 10, 9, 8])];\n\n   /**\r\n    * An edge contouring sub-procedure.\r\n    *\r\n    * @method contourProcessEdge\r\n    * @private\r\n    * @static\r\n    * @param {Array} octants - Four leaf octants.\r\n    * @param {Number} dir - A direction index.\r\n    * @param {Array} indexBuffer - An output list for vertex indices.\r\n    */\n\n   function contourProcessEdge(octants, dir, indexBuffer) {\n\n   \tvar indices = [-1, -1, -1, -1];\n   \tvar signChange = [false, false, false, false];\n\n   \tvar minSize = Infinity;\n   \tvar minIndex = 0;\n   \tvar flip = false;\n\n   \tvar c1 = void 0,\n   \t    c2 = void 0,\n   \t    m1 = void 0,\n   \t    m2 = void 0;\n   \tvar octant = void 0,\n   \t    edge = void 0;\n   \tvar i = void 0;\n\n   \tfor (i = 0; i < 4; ++i) {\n\n   \t\toctant = octants[i];\n   \t\tedge = PROC_EDGE_MASK[dir][i];\n\n   \t\tc1 = EDGES[edge][0];\n   \t\tc2 = EDGES[edge][1];\n\n   \t\tm1 = octant.voxel.materials >> c1 & 1;\n   \t\tm2 = octant.voxel.materials >> c2 & 1;\n\n   \t\tif (octant.size < minSize) {\n\n   \t\t\tminSize = octant.size;\n   \t\t\tminIndex = i;\n   \t\t\tflip = m1 !== Material.AIR;\n   \t\t}\n\n   \t\tindices[i] = octant.voxel.index;\n   \t\tsignChange[i] = m1 !== m2;\n   \t}\n\n   \tif (signChange[minIndex]) {\n\n   \t\tif (!flip) {\n\n   \t\t\tindexBuffer.push(indices[0]);\n   \t\t\tindexBuffer.push(indices[1]);\n   \t\t\tindexBuffer.push(indices[3]);\n\n   \t\t\tindexBuffer.push(indices[0]);\n   \t\t\tindexBuffer.push(indices[3]);\n   \t\t\tindexBuffer.push(indices[2]);\n   \t\t} else {\n\n   \t\t\tindexBuffer.push(indices[0]);\n   \t\t\tindexBuffer.push(indices[3]);\n   \t\t\tindexBuffer.push(indices[1]);\n\n   \t\t\tindexBuffer.push(indices[0]);\n   \t\t\tindexBuffer.push(indices[2]);\n   \t\t\tindexBuffer.push(indices[3]);\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * An edge contouring procedure.\r\n    *\r\n    * @method contourEdgeProc\r\n    * @private\r\n    * @static\r\n    * @param {Array} octants - Four edge octants.\r\n    * @param {Number} dir - A direction index.\r\n    * @param {Array} indexBuffer - An output list for vertex indices.\r\n    */\n\n   function contourEdgeProc(octants, dir, indexBuffer) {\n\n   \tvar c = [0, 0, 0, 0];\n\n   \tvar edgeOctants = void 0;\n   \tvar octant = void 0;\n   \tvar i = void 0,\n   \t    j = void 0;\n\n   \tif (octants[0].voxel !== null && octants[1].voxel !== null && octants[2].voxel !== null && octants[3].voxel !== null) {\n\n   \t\tcontourProcessEdge(octants, dir, indexBuffer);\n   \t} else {\n\n   \t\tfor (i = 0; i < 2; ++i) {\n\n   \t\t\tc[0] = EDGE_PROC_EDGE_MASK[dir][i][0];\n   \t\t\tc[1] = EDGE_PROC_EDGE_MASK[dir][i][1];\n   \t\t\tc[2] = EDGE_PROC_EDGE_MASK[dir][i][2];\n   \t\t\tc[3] = EDGE_PROC_EDGE_MASK[dir][i][3];\n\n   \t\t\tedgeOctants = [];\n\n   \t\t\tfor (j = 0; j < 4; ++j) {\n\n   \t\t\t\toctant = octants[j];\n\n   \t\t\t\tif (octant.voxel !== null) {\n\n   \t\t\t\t\tedgeOctants[j] = octant;\n   \t\t\t\t} else if (octant.children !== null) {\n\n   \t\t\t\t\tedgeOctants[j] = octant.children[c[j]];\n   \t\t\t\t} else {\n\n   \t\t\t\t\tbreak;\n   \t\t\t\t}\n   \t\t\t}\n\n   \t\t\tif (j === 4) {\n\n   \t\t\t\tcontourEdgeProc(edgeOctants, EDGE_PROC_EDGE_MASK[dir][i][4], indexBuffer);\n   \t\t\t}\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * A face contouring procedure.\r\n    *\r\n    * @method contourFaceProc\r\n    * @private\r\n    * @static\r\n    * @param {Array} octants - Two face octants.\r\n    * @param {Number} dir - A direction index.\r\n    * @param {Array} indexBuffer - An output list for vertex indices.\r\n    */\n\n   function contourFaceProc(octants, dir, indexBuffer) {\n\n   \tvar c = [0, 0, 0, 0];\n\n   \tvar orders = [[0, 0, 1, 1], [0, 1, 0, 1]];\n\n   \tvar faceOctants = void 0,\n   \t    edgeOctants = void 0;\n   \tvar order = void 0,\n   \t    octant = void 0;\n   \tvar i = void 0,\n   \t    j = void 0;\n\n   \tif (octants[0].children !== null || octants[1].children !== null) {\n\n   \t\tfor (i = 0; i < 4; ++i) {\n\n   \t\t\tc[0] = FACE_PROC_FACE_MASK[dir][i][0];\n   \t\t\tc[1] = FACE_PROC_FACE_MASK[dir][i][1];\n\n   \t\t\tfaceOctants = [octants[0].children === null ? octants[0] : octants[0].children[c[0]], octants[1].children === null ? octants[1] : octants[1].children[c[1]]];\n\n   \t\t\tcontourFaceProc(faceOctants, FACE_PROC_FACE_MASK[dir][i][2], indexBuffer);\n   \t\t}\n\n   \t\tfor (i = 0; i < 4; ++i) {\n\n   \t\t\tc[0] = FACE_PROC_EDGE_MASK[dir][i][1];\n   \t\t\tc[1] = FACE_PROC_EDGE_MASK[dir][i][2];\n   \t\t\tc[2] = FACE_PROC_EDGE_MASK[dir][i][3];\n   \t\t\tc[3] = FACE_PROC_EDGE_MASK[dir][i][4];\n\n   \t\t\torder = orders[FACE_PROC_EDGE_MASK[dir][i][0]];\n\n   \t\t\tedgeOctants = [];\n\n   \t\t\tfor (j = 0; j < 4; ++j) {\n\n   \t\t\t\toctant = octants[order[j]];\n\n   \t\t\t\tif (octant.voxel !== null) {\n\n   \t\t\t\t\tedgeOctants[j] = octant;\n   \t\t\t\t} else if (octant.children !== null) {\n\n   \t\t\t\t\tedgeOctants[j] = octant.children[c[j]];\n   \t\t\t\t} else {\n\n   \t\t\t\t\tbreak;\n   \t\t\t\t}\n   \t\t\t}\n\n   \t\t\tif (j === 4) {\n\n   \t\t\t\tcontourEdgeProc(edgeOctants, FACE_PROC_EDGE_MASK[dir][i][5], indexBuffer);\n   \t\t\t}\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * The main contouring procedure.\r\n    *\r\n    * @method contourCellProc\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Array} indexBuffer - An output list for vertex indices.\r\n    */\n\n   function contourCellProc(octant, indexBuffer) {\n\n   \tvar children = octant.children;\n   \tvar c = [0, 0, 0, 0];\n\n   \tvar faceOctants = void 0,\n   \t    edgeOctants = void 0;\n   \tvar i = void 0;\n\n   \tif (children !== null) {\n\n   \t\tfor (i = 0; i < 8; ++i) {\n\n   \t\t\tcontourCellProc(children[i], indexBuffer);\n   \t\t}\n\n   \t\tfor (i = 0; i < 12; ++i) {\n\n   \t\t\tc[0] = CELL_PROC_FACE_MASK[i][0];\n   \t\t\tc[1] = CELL_PROC_FACE_MASK[i][1];\n\n   \t\t\tfaceOctants = [children[c[0]], children[c[1]]];\n\n   \t\t\tcontourFaceProc(faceOctants, CELL_PROC_FACE_MASK[i][2], indexBuffer);\n   \t\t}\n\n   \t\tfor (i = 0; i < 6; ++i) {\n\n   \t\t\tc[0] = CELL_PROC_EDGE_MASK[i][0];\n   \t\t\tc[1] = CELL_PROC_EDGE_MASK[i][1];\n   \t\t\tc[2] = CELL_PROC_EDGE_MASK[i][2];\n   \t\t\tc[3] = CELL_PROC_EDGE_MASK[i][3];\n\n   \t\t\tedgeOctants = [children[c[0]], children[c[1]], children[c[2]], children[c[3]]];\n\n   \t\t\tcontourEdgeProc(edgeOctants, CELL_PROC_EDGE_MASK[i][4], indexBuffer);\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * Collects positions and normals from the voxel information of the given octant\r\n    * and its children. The generated vertex indices are stored in the respective\r\n    * voxels during the octree traversal.\r\n    *\r\n    * @method generateVertexIndices\r\n    * @private\r\n    * @static\r\n    * @param {Octant} octant - An octant.\r\n    * @param {Array} vertexBuffer - An array to be filled with vertices.\r\n    * @param {Array} normalBuffer - An array to be filled with normals.\r\n    * @param {Number} index - The next vertex index.\r\n    */\n\n   function generateVertexIndices(octant, positions, normals, index) {\n\n   \tvar i = void 0,\n   \t    voxel = void 0;\n\n   \tif (octant.children !== null) {\n\n   \t\tfor (i = 0; i < 8; ++i) {\n\n   \t\t\tindex = generateVertexIndices(octant.children[i], positions, normals, index);\n   \t\t}\n   \t} else if (octant.voxel !== null) {\n\n   \t\tvoxel = octant.voxel;\n   \t\tvoxel.index = index;\n\n   \t\tpositions[index * 3] = voxel.position.x;\n   \t\tpositions[index * 3 + 1] = voxel.position.y;\n   \t\tpositions[index * 3 + 2] = voxel.position.z;\n\n   \t\tnormals[index * 3] = voxel.normal.x;\n   \t\tnormals[index * 3 + 1] = voxel.normal.y;\n   \t\tnormals[index * 3 + 2] = voxel.normal.z;\n\n   \t\t++index;\n   \t}\n\n   \treturn index;\n   }\n\n   /**\r\n    * Dual Contouring is an isosurface extraction technique that was originally\r\n    * presented by Tao Ju in 2002:\r\n    *\r\n    *  http://www.cs.wustl.edu/~taoju/research/dualContour.pdf\r\n    *\r\n    * @class DualContouring\r\n    * @submodule isosurface\r\n    * @static\r\n    */\n\n   var DualContouring = function () {\n   \tfunction DualContouring() {\n   \t\tclassCallCheck(this, DualContouring);\n   \t}\n\n   \tcreateClass(DualContouring, null, [{\n   \t\tkey: \"run\",\n\n\n   \t\t/**\r\n      * Contours the given chunk of volume data and generates vertices, normals\r\n      * and vertex indices.\r\n      *\r\n      * @method run\r\n      * @static\r\n      * @param {Chunk} chunk - A chunk of volume data.\r\n      * @return {Object} The generated indices, positions and normals, or null if no data was generated.\r\n      */\n\n   \t\tvalue: function run(chunk) {\n\n   \t\t\tvar indexBuffer = [];\n\n   \t\t\tvar voxelBlock = new VoxelBlock(chunk);\n\n   \t\t\t// Each voxel contains one vertex.\n   \t\t\tvar vertexCount = voxelBlock.voxelCount;\n\n   \t\t\tvar result = null;\n   \t\t\tvar indices = null;\n   \t\t\tvar positions = null;\n   \t\t\tvar normals = null;\n\n   \t\t\tif (vertexCount > 65536) {\n\n   \t\t\t\tconsole.warn(\"Could not create geometry for chunk at position\", this.chunk.min, \"with lod\", this.chunk.data.lod, \"(vertex count of\", vertexCount, \"exceeds limit of 65536)\");\n   \t\t\t} else if (vertexCount > 0) {\n\n   \t\t\t\tpositions = new Float32Array(vertexCount * 3);\n   \t\t\t\tnormals = new Float32Array(vertexCount * 3);\n\n   \t\t\t\tgenerateVertexIndices(voxelBlock.root, positions, normals, 0);\n   \t\t\t\tcontourCellProc(voxelBlock.root, indexBuffer);\n\n   \t\t\t\tindices = new Uint16Array(indexBuffer);\n\n   \t\t\t\tresult = { indices: indices, positions: positions, normals: normals };\n   \t\t\t}\n\n   \t\t\treturn result;\n   \t\t}\n   \t}]);\n   \treturn DualContouring;\n   }();\n\n   /**\r\n    * Isosurface extraction algorithms.\r\n    *\r\n    * @module rabbit-hole\r\n    * @submodule isosurface\r\n    */\n\n   /**\r\n    * Run-Length Encoding for numeric data.\r\n    *\r\n    * @class RunLengthEncoder\r\n    * @submodule core\r\n    * @static\r\n    */\n\n   var RunLengthEncoder = function () {\n   \t\tfunction RunLengthEncoder() {\n   \t\t\t\tclassCallCheck(this, RunLengthEncoder);\n   \t\t}\n\n   \t\tcreateClass(RunLengthEncoder, null, [{\n   \t\t\t\tkey: \"encode\",\n\n\n   \t\t\t\t/**\r\n        * Encodes the given data.\r\n        *\r\n        * @method encode\r\n        * @static\r\n        * @param {Array} array - The data to encode.\r\n        * @return {Object} The run-lengths and the encoded data.\r\n        */\n\n   \t\t\t\tvalue: function encode(array) {\n\n   \t\t\t\t\t\tvar runLengths = [];\n   \t\t\t\t\t\tvar data = [];\n\n   \t\t\t\t\t\tvar previous = array[0];\n   \t\t\t\t\t\tvar count = 1;\n\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    l = void 0;\n\n   \t\t\t\t\t\tfor (i = 1, l = array.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\tif (previous !== array[i]) {\n\n   \t\t\t\t\t\t\t\t\t\trunLengths.push(count);\n   \t\t\t\t\t\t\t\t\t\tdata.push(previous);\n\n   \t\t\t\t\t\t\t\t\t\tprevious = array[i];\n   \t\t\t\t\t\t\t\t\t\tcount = 1;\n   \t\t\t\t\t\t\t\t} else {\n\n   \t\t\t\t\t\t\t\t\t\t++count;\n   \t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\trunLengths.push(count);\n   \t\t\t\t\t\tdata.push(previous);\n\n   \t\t\t\t\t\treturn {\n   \t\t\t\t\t\t\t\trunLengths: runLengths,\n   \t\t\t\t\t\t\t\tdata: data\n   \t\t\t\t\t\t};\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Decodes the given data.\r\n        *\r\n        * @method decode\r\n        * @static\r\n        * @param {Array} runLengths - The run-lengths.\r\n        * @param {Array} data - The data to decode.\r\n        * @param {Array} [array] - An optional target.\r\n        * @return {Array} The decoded data.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"decode\",\n   \t\t\t\tvalue: function decode(runLengths, data) {\n   \t\t\t\t\t\tvar array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];\n\n\n   \t\t\t\t\t\tvar element = void 0;\n\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    j = void 0,\n   \t\t\t\t\t\t    il = void 0,\n   \t\t\t\t\t\t    jl = void 0;\n   \t\t\t\t\t\tvar k = 0;\n\n   \t\t\t\t\t\tfor (i = 0, il = data.length; i < il; ++i) {\n\n   \t\t\t\t\t\t\t\telement = data[i];\n\n   \t\t\t\t\t\t\t\tfor (j = 0, jl = runLengths[i]; j < jl; ++j) {\n\n   \t\t\t\t\t\t\t\t\t\tarray[k++] = element;\n   \t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn array;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn RunLengthEncoder;\n   }();\n\n   /**\r\n    * Stores edge data separately for each dimension.\r\n    *\r\n    * With a grid resolution N, there are 3 * (N + 1)² * N edges in total, but\r\n    * the number of edges that actually contain the volume's surface is usually\r\n    * much lower.\r\n    *\r\n    * @class EdgeData\r\n    * @submodule volume\r\n    * @constructor\r\n    * @param {Number} n - The grid resolution.\r\n    */\n\n   var EdgeData = function () {\n   \tfunction EdgeData(n) {\n   \t\tclassCallCheck(this, EdgeData);\n\n\n   \t\tvar c = Math.pow(n + 1, 2) * n;\n\n   \t\t/**\r\n      * The edges.\r\n      *\r\n      * Edges are stored as starting grid point indices in ascending order. The\r\n      * ending point indices are implicitly defined through the dimension split:\r\n      *\r\n      * Given a starting point index A, the ending point index B for the X-, Y-\r\n      * and Z-plane is defined as A + 1, A + N and A + N² respectively where N is\r\n      * the grid resolution + 1.\r\n      *\r\n      * @property edges\r\n      * @type Array\r\n      */\n\n   \t\tthis.edges = [new Uint32Array(c), new Uint32Array(c), new Uint32Array(c)];\n\n   \t\t/**\r\n      * The Zero Crossing interpolation values.\r\n      *\r\n      * Each value describes the relative surface intersection position on the\r\n      * respective edge. The values correspond to the order of the edges.\r\n      *\r\n      * @property zeroCrossings\r\n      * @type Array\r\n      */\n\n   \t\tthis.zeroCrossings = [new Float32Array(c), new Float32Array(c), new Float32Array(c)];\n\n   \t\t/**\r\n      * The surface intersection normals.\r\n      *\r\n      * The vectors are stored as [x, y, z] float triples and correspond to the\r\n      * order of the edges.\r\n      *\r\n      * @property normals\r\n      * @type Array\r\n      */\n\n   \t\tthis.normals = [new Float32Array(c * 3), new Float32Array(c * 3), new Float32Array(c * 3)];\n   \t}\n\n   \t/**\r\n     * Creates a list of transferable items.\r\n     *\r\n     * @method createTransferList\r\n     * @param {Array} [transferList] - An existing list to be filled with transferable items.\r\n     * @return {Array} A transfer list.\r\n     */\n\n   \tcreateClass(EdgeData, [{\n   \t\tkey: \"createTransferList\",\n   \t\tvalue: function createTransferList() {\n   \t\t\tvar transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n\n   \t\t\tvar arrays = [this.edges[0], this.edges[1], this.edges[2], this.zeroCrossings[0], this.zeroCrossings[1], this.zeroCrossings[2], this.normals[0], this.normals[1], this.normals[2]];\n\n   \t\t\tvar array = void 0;\n\n   \t\t\twhile (arrays.length > 0) {\n\n   \t\t\t\tarray = arrays.pop();\n\n   \t\t\t\tif (array !== null) {\n\n   \t\t\t\t\ttransferList.push(array.buffer);\n   \t\t\t\t}\n   \t\t\t}\n\n   \t\t\treturn transferList;\n   \t\t}\n\n   \t\t/**\r\n      * Serialises this data.\r\n      *\r\n      * @method serialise\r\n      * @return {Object} The serialised version of the data.\r\n      */\n\n   \t}, {\n   \t\tkey: \"serialise\",\n   \t\tvalue: function serialise() {\n\n   \t\t\treturn {\n   \t\t\t\tedges: this.edges,\n   \t\t\t\tzeroCrossings: this.zeroCrossings,\n   \t\t\t\tnormals: this.normals\n   \t\t\t};\n   \t\t}\n\n   \t\t/**\r\n      * Adopts the given serialised data.\r\n      *\r\n      * @method deserialise\r\n      * @param {Object} object - Serialised edge data.\r\n      */\n\n   \t}, {\n   \t\tkey: \"deserialise\",\n   \t\tvalue: function deserialise(object) {\n\n   \t\t\tthis.edges = object.edges;\n   \t\t\tthis.zeroCrossings = object.zeroCrossings;\n   \t\t\tthis.normals = object.normals;\n   \t\t}\n   \t}]);\n   \treturn EdgeData;\n   }();\n\n   /**\r\n    * The material grid resolution.\r\n    *\r\n    * @property resolution\r\n    * @type Number\r\n    * @private\r\n    * @static\r\n    * @default 0\r\n    */\n\n   var resolution = 0;\n\n   /**\r\n    * The total amount of grid point indices.\r\n    *\r\n    * @property indexCount\r\n    * @type Number\r\n    * @private\r\n    * @static\r\n    * @default 0\r\n    */\n\n   var indexCount = 0;\n\n   /**\r\n    * Hermite data.\r\n    *\r\n    * @class HermiteData\r\n    * @submodule volume\r\n    * @constructor\r\n    * @param {Boolean} [initialise=true] - Whether the data should be initialised immediately.\r\n    */\n\n   var HermiteData = function () {\n   \t\tfunction HermiteData() {\n   \t\t\t\tvar initialise = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n   \t\t\t\tclassCallCheck(this, HermiteData);\n\n\n   \t\t\t\t/**\r\n        * The current level of detail.\r\n        *\r\n        * @property lod\r\n        * @type Number\r\n        * @default -1\r\n        */\n\n   \t\t\t\tthis.lod = -1;\n\n   \t\t\t\t/**\r\n        * Indicates whether this data is currently gone.\r\n        *\r\n        * @property neutered\r\n        * @type Boolean\r\n        * @default false\r\n        */\n\n   \t\t\t\tthis.neutered = false;\n\n   \t\t\t\t/**\r\n        * Describes how many material indices are currently solid:\r\n        *\r\n        * - The chunk lies outside the volume if there are no solid grid points.\r\n        * - The chunk lies completely inside the volume if all points are solid.\r\n        *\r\n        * @property materials\r\n        * @type Number\r\n        * @default 0\r\n        */\n\n   \t\t\t\tthis.materials = 0;\n\n   \t\t\t\t/**\r\n        * The grid points.\r\n        *\r\n        * @property materialIndices\r\n        * @type Uint8Array\r\n        */\n\n   \t\t\t\tthis.materialIndices = initialise ? new Uint8Array(indexCount) : null;\n\n   \t\t\t\t/**\r\n        * Run-length compression data.\r\n        *\r\n        * @property runLengths\r\n        * @type Uint32Array\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.runLengths = null;\n\n   \t\t\t\t/**\r\n        * The edge data.\r\n        *\r\n        * @property edgeData\r\n        * @type EdgeData\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.edgeData = null;\n   \t\t}\n\n   \t\t/**\r\n      * Indicates whether this data container is empty.\r\n      *\r\n      * @property empty\r\n      * @type Boolean\r\n      */\n\n   \t\tcreateClass(HermiteData, [{\n   \t\t\t\tkey: \"set\",\n\n\n   \t\t\t\t/**\r\n        * Adopts the given data.\r\n        *\r\n        * @method set\r\n        * @chainable\r\n        * @param {HermiteData} data - The data to adopt.\r\n        * @return {HermiteData} This data.\r\n        */\n\n   \t\t\t\tvalue: function set$$1(data) {\n\n   \t\t\t\t\t\tthis.lod = data.lod;\n   \t\t\t\t\t\tthis.neutered = data.neutered;\n   \t\t\t\t\t\tthis.materials = data.materials;\n   \t\t\t\t\t\tthis.materialIndices = data.materialIndices;\n   \t\t\t\t\t\tthis.runLengths = data.runLengths;\n   \t\t\t\t\t\tthis.edgeData = data.edgeData;\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Sets the specified material index.\r\n        *\r\n        * @method setMaterialIndex\r\n        * @param {Number} index - The index of the material index that should be updated.\r\n        * @param {Number} value - The new material index.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"setMaterialIndex\",\n   \t\t\t\tvalue: function setMaterialIndex(index, value) {\n\n   \t\t\t\t\t\t// Keep track of how many material indices are solid.\n   \t\t\t\t\t\tif (this.materialIndices[index] === Material.AIR) {\n\n   \t\t\t\t\t\t\t\tif (value !== Material.AIR) {\n\n   \t\t\t\t\t\t\t\t\t\t++this.materials;\n   \t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t} else if (value === Material.AIR) {\n\n   \t\t\t\t\t\t\t\t--this.materials;\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tthis.materialIndices[index] = value;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Compresses this data.\r\n        *\r\n        * @method compress\r\n        * @chainable\r\n        * @return {HermiteData} This data.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"compress\",\n   \t\t\t\tvalue: function compress() {\n\n   \t\t\t\t\t\tvar encoding = void 0;\n\n   \t\t\t\t\t\tif (this.runLengths === null) {\n\n   \t\t\t\t\t\t\t\tif (this.full) {\n\n   \t\t\t\t\t\t\t\t\t\tencoding = {\n   \t\t\t\t\t\t\t\t\t\t\t\trunLengths: [this.materialIndices.length],\n   \t\t\t\t\t\t\t\t\t\t\t\tdata: [Material.SOLID]\n   \t\t\t\t\t\t\t\t\t\t};\n   \t\t\t\t\t\t\t\t} else {\n\n   \t\t\t\t\t\t\t\t\t\tencoding = RunLengthEncoder.encode(this.materialIndices);\n   \t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\tthis.runLengths = new Uint32Array(encoding.runLengths);\n   \t\t\t\t\t\t\t\tthis.materialIndices = new Uint8Array(encoding.data);\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Decompresses this data.\r\n        *\r\n        * @method decompress\r\n        * @chainable\r\n        * @return {HermiteData} This data.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"decompress\",\n   \t\t\t\tvalue: function decompress() {\n\n   \t\t\t\t\t\tif (this.runLengths !== null) {\n\n   \t\t\t\t\t\t\t\tthis.materialIndices = RunLengthEncoder.decode(this.runLengths, this.materialIndices, new Uint8Array(indexCount));\n\n   \t\t\t\t\t\t\t\tthis.runLengths = null;\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Creates a list of transferable items.\r\n        *\r\n        * @method createTransferList\r\n        * @param {Array} [transferList] - An existing list to be filled with transferable items.\r\n        * @return {Array} A transfer list.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"createTransferList\",\n   \t\t\t\tvalue: function createTransferList() {\n   \t\t\t\t\t\tvar transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n\n   \t\t\t\t\t\tif (this.edgeData !== null) {\n   \t\t\t\t\t\t\t\tthis.edgeData.createTransferList(transferList);\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\ttransferList.push(this.materialIndices.buffer);\n   \t\t\t\t\t\ttransferList.push(this.runLengths.buffer);\n\n   \t\t\t\t\t\treturn transferList;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Serialises this data.\r\n        *\r\n        * @method serialise\r\n        * @return {Object} The serialised version of the data.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"serialise\",\n   \t\t\t\tvalue: function serialise() {\n\n   \t\t\t\t\t\tthis.neutered = true;\n\n   \t\t\t\t\t\treturn {\n   \t\t\t\t\t\t\t\tlod: this.lod,\n   \t\t\t\t\t\t\t\tmaterials: this.materials,\n   \t\t\t\t\t\t\t\tmaterialIndices: this.materialIndices,\n   \t\t\t\t\t\t\t\trunLengths: this.runLengths,\n   \t\t\t\t\t\t\t\tedgeData: this.edgeData !== null ? this.edgeData.serialise() : null\n   \t\t\t\t\t\t};\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Adopts the given serialised data.\r\n        *\r\n        * @method deserialise\r\n        * @param {Object} object - Serialised hermite data.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"deserialise\",\n   \t\t\t\tvalue: function deserialise(object) {\n\n   \t\t\t\t\t\tthis.lod = object.lod;\n   \t\t\t\t\t\tthis.materials = object.materials;\n\n   \t\t\t\t\t\tthis.materialIndices = object.materialIndices;\n   \t\t\t\t\t\tthis.runLengths = object.runLengths;\n\n   \t\t\t\t\t\tif (object.edgeData !== null) {\n\n   \t\t\t\t\t\t\t\tif (this.edgeData === null) {\n\n   \t\t\t\t\t\t\t\t\t\tthis.edgeData = new EdgeData(0);\n   \t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\tthis.edgeData.deserialise(object.edgeData);\n   \t\t\t\t\t\t} else {\n\n   \t\t\t\t\t\t\t\tthis.edgeData = null;\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tthis.neutered = false;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * The material grid resolution.\r\n        *\r\n        * @property resolution\r\n        * @type Number\r\n        * @static\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"empty\",\n   \t\t\t\tget: function get$$1() {\n   \t\t\t\t\t\treturn this.materials === 0;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Indicates whether this data container is full.\r\n        *\r\n        * @property full\r\n        * @type Boolean\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"full\",\n   \t\t\t\tget: function get$$1() {\n   \t\t\t\t\t\treturn this.materials === indexCount;\n   \t\t\t\t}\n   \t\t}], [{\n   \t\t\t\tkey: \"resolution\",\n   \t\t\t\tget: function get$$1() {\n   \t\t\t\t\t\treturn resolution;\n   \t\t\t\t},\n   \t\t\t\tset: function set$$1(x) {\n\n   \t\t\t\t\t\tif (resolution === 0) {\n\n   \t\t\t\t\t\t\t\tresolution = Math.max(1, Math.min(256, x));\n   \t\t\t\t\t\t\t\tindexCount = Math.pow(resolution + 1, 3);\n   \t\t\t\t\t\t}\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn HermiteData;\n   }();\n\n   /**\r\n    * A cubic volume chunk.\r\n    *\r\n    * @class Chunk\r\n    * @submodule octree\r\n    * @extends CubicOctant\r\n    * @constructor\r\n    * @param {Vector3} min - The lower bounds.\r\n    * @param {Vector3} max - The size.\r\n    */\n\n   var Chunk = function (_CubicOctant) {\n   \tinherits(Chunk, _CubicOctant);\n\n   \tfunction Chunk(min, size) {\n   \t\tclassCallCheck(this, Chunk);\n\n   \t\t/**\r\n      * Hermite data.\r\n      *\r\n      * @property data\r\n      * @type HermiteData\r\n      * @default null\r\n      */\n\n   \t\tvar _this = possibleConstructorReturn(this, (Chunk.__proto__ || Object.getPrototypeOf(Chunk)).call(this, min, size));\n\n   \t\t_this.data = null;\n\n   \t\t/**\r\n      * A CSG operation queue.\r\n      *\r\n      * @property csg\r\n      * @type Queue\r\n      * @default null\r\n      */\n\n   \t\t_this.csg = null;\n\n   \t\treturn _this;\n   \t}\n\n   \t/**\r\n     * The material grid resolution of all volume chunks. The upper limit is 256.\r\n     *\r\n     * The effective resolution of a chunk is the distance between two adjacent\r\n     * grid points in global coordinates.\r\n     *\r\n     * This value can only be set once.\r\n     *\r\n     * @property resolution\r\n     * @type Number\r\n     */\n\n   \tcreateClass(Chunk, [{\n   \t\tkey: \"createTransferList\",\n\n\n   \t\t/**\r\n      * Creates a list of transferable items.\r\n      *\r\n      * @method createTransferList\r\n      * @param {Array} [transferList] - An existing list to be filled with transferable items.\r\n      * @return {Array} A transfer list.\r\n      */\n\n   \t\tvalue: function createTransferList() {\n   \t\t\tvar transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n\n   \t\t\treturn this.data !== null ? this.data.createTransferList(transferList) : transferList;\n   \t\t}\n\n   \t\t/**\r\n      * Serialises this chunk.\r\n      *\r\n      * @method serialise\r\n      * @return {Object} A serialised description of this chunk.\r\n      */\n\n   \t}, {\n   \t\tkey: \"serialise\",\n   \t\tvalue: function serialise() {\n\n   \t\t\treturn {\n   \t\t\t\tresolution: this.resolution,\n   \t\t\t\tmin: this.min.toArray(),\n   \t\t\t\tsize: this.size,\n   \t\t\t\tdata: this.data !== null ? this.data.serialise() : null\n   \t\t\t};\n   \t\t}\n\n   \t\t/**\r\n      * Adopts the given serialised data.\r\n      *\r\n      * @method deserialise\r\n      * @param {Object} object - A serialised chunk description.\r\n      */\n\n   \t}, {\n   \t\tkey: \"deserialise\",\n   \t\tvalue: function deserialise(object) {\n\n   \t\t\tthis.resolution = object.resolution;\n   \t\t\tthis.min.fromArray(object.min);\n   \t\t\tthis.size = object.size;\n\n   \t\t\tif (object.data !== null) {\n\n   \t\t\t\tif (this.data === null) {\n\n   \t\t\t\t\tthis.data = new HermiteData(false);\n   \t\t\t\t}\n\n   \t\t\t\tthis.data.deserialise(object.data);\n   \t\t\t} else {\n\n   \t\t\t\tthis.data = null;\n   \t\t\t}\n   \t\t}\n   \t}, {\n   \t\tkey: \"resolution\",\n   \t\tget: function get$$1() {\n   \t\t\treturn HermiteData.resolution;\n   \t\t},\n   \t\tset: function set$$1(x) {\n   \t\t\tHermiteData.resolution = x;\n   \t\t}\n   \t}]);\n   \treturn Chunk;\n   }(CubicOctant);\n\n   /**\r\n    * An enumeration of worker actions.\r\n    *\r\n    * @class Action\r\n    * @submodule worker\r\n    * @static\r\n    */\n\n   var Action = {\n\n   \t/**\r\n     * Isosurface extraction signal.\r\n     *\r\n     * @property EXTRACT\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tEXTRACT: \"worker.extract\",\n\n   \t/**\r\n     * Hermite data modification signal.\r\n     *\r\n     * @property MODIFY\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tMODIFY: \"worker.modify\",\n\n   \t/**\r\n     * Thread termination signal.\r\n     *\r\n     * @property CLOSE\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tCLOSE: \"worker.close\"\n\n   };\n\n   /**\r\n    * A surface extractor that generates triangles from hermite data.\r\n    *\r\n    * @class SurfaceExtractor\r\n    * @submodule worker\r\n    * @static\r\n    */\n\n   var SurfaceExtractor = {\n\n   \t/**\r\n     * An empty chunk of hermite data.\r\n     *\r\n     * @property chunk\r\n     * @type Chunk\r\n     * @static\r\n     */\n\n   \tchunk: new Chunk(),\n\n   \t/**\r\n     * A container for the data that will be returned to the main thread.\r\n     *\r\n     * @property message\r\n     * @type Object\r\n     * @static\r\n     */\n\n   \tmessage: {\n   \t\taction: Action.EXTRACT,\n   \t\tchunk: null,\n   \t\tpositions: null,\n   \t\tnormals: null,\n   \t\tindices: null\n   \t},\n\n   \t/**\r\n     * A list of transferable objects.\r\n     *\r\n     * @property transferList\r\n     * @type Array\r\n     * @static\r\n     */\n\n   \ttransferList: null,\n\n   \t/**\r\n     * Extracts a surface from the given hermite data.\r\n     *\r\n     * @method extract\r\n     * @static\r\n     * @param {Object} chunk - A serialised volume chunk.\r\n     */\n\n   \textract: function extract(chunk) {\n\n   \t\tvar message = this.message;\n   \t\tvar transferList = [];\n\n   \t\t// Adopt the provided chunk data.\n   \t\tthis.chunk.deserialise(chunk);\n   \t\tthis.chunk.data.decompress();\n\n   \t\tvar result = DualContouring.run(this.chunk);\n\n   \t\tif (result !== null) {\n\n   \t\t\tmessage.indices = result.indices;\n   \t\t\tmessage.positions = result.positions;\n   \t\t\tmessage.normals = result.normals;\n\n   \t\t\ttransferList.push(message.indices.buffer);\n   \t\t\ttransferList.push(message.positions.buffer);\n   \t\t\ttransferList.push(message.normals.buffer);\n   \t\t} else {\n\n   \t\t\tmessage.indices = null;\n   \t\t\tmessage.positions = null;\n   \t\t\tmessage.normals = null;\n   \t\t}\n\n   \t\t// Simply send the already compressed and serialised chunk back.\n   \t\tthis.chunk.deserialise(chunk);\n   \t\tmessage.chunk = this.chunk.serialise();\n   \t\tthis.transferList = this.chunk.createTransferList(transferList);\n   \t}\n   };\n\n   /**\r\n    * A bounding box.\r\n    *\r\n    * @class Box3\r\n    * @submodule math\r\n    * @constructor\r\n    * @param {Vector3} [min] - The lower bounds.\r\n    * @param {Vector3} [max] - The upper bounds.\r\n    */\n\n   var Box3$1 = function () {\n   \tfunction Box3() {\n   \t\tvar min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1(Infinity, Infinity, Infinity);\n   \t\tvar max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1(-Infinity, -Infinity, -Infinity);\n   \t\tclassCallCheck(this, Box3);\n\n\n   \t\t/**\r\n      * The min bounds.\r\n      *\r\n      * @property min\r\n      * @type Vector3\r\n      */\n\n   \t\tthis.min = min;\n\n   \t\t/**\r\n      * The max bounds.\r\n      *\r\n      * @property max\r\n      * @type Vector3\r\n      */\n\n   \t\tthis.max = max;\n   \t}\n\n   \t/**\r\n     * Sets the values of this box.\r\n     *\r\n     * @method set\r\n     * @param {Number} min - The min bounds.\r\n     * @param {Number} max - The max bounds.\r\n     * @return {Matrix3} This box.\r\n     */\n\n   \tcreateClass(Box3, [{\n   \t\tkey: \"set\",\n   \t\tvalue: function set$$1(min, max) {\n\n   \t\t\tthis.min.copy(min);\n   \t\t\tthis.max.copy(max);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Copies the values of a given box.\r\n      *\r\n      * @method copy\r\n      * @param {Matrix3} b - A box.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"copy\",\n   \t\tvalue: function copy(b) {\n\n   \t\t\tthis.min.copy(b.min);\n   \t\t\tthis.max.copy(b.max);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Clones this matrix.\r\n      *\r\n      * @method clone\r\n      * @return {Matrix3} A clone of this matrix.\r\n      */\n\n   \t}, {\n   \t\tkey: \"clone\",\n   \t\tvalue: function clone() {\n\n   \t\t\treturn new this.constructor().copy(this);\n   \t\t}\n\n   \t\t/**\r\n      * Expands this box by the given point.\r\n      *\r\n      * @method expandByPoint\r\n      * @param {Matrix3} p - A point.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"expandByPoint\",\n   \t\tvalue: function expandByPoint(p) {\n\n   \t\t\tthis.min.min(p);\n   \t\t\tthis.max.max(p);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Expands this box by combining it with the given one.\r\n      *\r\n      * @method union\r\n      * @param {Box3} b - A box.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"union\",\n   \t\tvalue: function union(b) {\n\n   \t\t\tthis.min.min(b.min);\n   \t\t\tthis.max.max(b.max);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Defines this box by the given points.\r\n      *\r\n      * @method setFromPoints\r\n      * @param {Array} points - The points.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"setFromPoints\",\n   \t\tvalue: function setFromPoints(points) {\n\n   \t\t\tvar i = void 0,\n   \t\t\t    l = void 0;\n\n   \t\t\tfor (i = 0, l = points.length; i < l; ++i) {\n\n   \t\t\t\tthis.expandByPoint(points[i]);\n   \t\t\t}\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Defines this box by the given center and size.\r\n      *\r\n      * @method setFromCenterAndSize\r\n      * @param {Vector3} center - The center.\r\n      * @param {Number} size - The size.\r\n      * @return {Box3} This box.\r\n      */\n\n   \t}, {\n   \t\tkey: \"setFromCenterAndSize\",\n   \t\tvalue: function setFromCenterAndSize(center, size) {\n\n   \t\t\tvar halfSize = size.clone().multiplyScalar(0.5);\n\n   \t\t\tthis.min.copy(center).sub(halfSize);\n   \t\t\tthis.max.copy(center).add(halfSize);\n\n   \t\t\treturn this;\n   \t\t}\n\n   \t\t/**\r\n      * Checks if this box intersects with the given one.\r\n      *\r\n      * @method intersectsBox\r\n      * @param {Matrix3} box - A box.\r\n      * @return {Boolean} Whether the boxes intersect.\r\n      */\n\n   \t}, {\n   \t\tkey: \"intersectsBox\",\n   \t\tvalue: function intersectsBox(box) {\n\n   \t\t\treturn !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);\n   \t\t}\n   \t}]);\n   \treturn Box3;\n   }();\n\n   /**\r\n    * An enumeration of CSG operation types.\r\n    *\r\n    * @class OperationType\r\n    * @submodule csg\r\n    * @static\r\n    */\n\n   var OperationType = {\n\n   \t/**\r\n     * Indicates a union of volume data.\r\n     *\r\n     * @property UNION\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tUNION: \"csg.union\",\n\n   \t/**\r\n     * Indicates a subtraction of volume data.\r\n     *\r\n     * @property DIFFERENCE\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tDIFFERENCE: \"csg.difference\",\n\n   \t/**\r\n     * Indicates an intersection of volume data.\r\n     *\r\n     * @property INTERSECTION\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tINTERSECTION: \"csg.intersection\",\n\n   \t/**\r\n     * Indicates volume data generation.\r\n     *\r\n     * @property DENSITY_FUNCTION\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tDENSITY_FUNCTION: \"csg.densityfunction\"\n\n   };\n\n   /**\r\n    * A CSG operation.\r\n    *\r\n    * @class Operation\r\n    * @submodule csg\r\n    * @constructor\r\n    * @param {OperationType} type - The type of this operation.\r\n    * @param {Operation} ...children - Child operations.\r\n    */\n\n   var Operation = function () {\n   \t\tfunction Operation(type) {\n   \t\t\t\tclassCallCheck(this, Operation);\n\n\n   \t\t\t\t/**\r\n        * The type of this operation.\r\n        *\r\n        * @property type\r\n        * @type OperationType\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.type = type;\n\n   \t\t\t\t/**\r\n        * A list of operations.\r\n        *\r\n        * Right-hand side operands have precedence, meaning that the result of the\r\n        * first item in the list will be dominated by the result of the second one,\r\n        * etc.\r\n        *\r\n        * @property children\r\n        * @type Array\r\n        * @private\r\n        */\n\n   \t\t\t\tfor (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n   \t\t\t\t\t\tchildren[_key - 1] = arguments[_key];\n   \t\t\t\t}\n\n   \t\t\t\tthis.children = children;\n\n   \t\t\t\t/**\r\n        * The bounding box of this operation.\r\n        *\r\n        * @property bbox\r\n        * @type Box3\r\n        * @private\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.bbox = null;\n   \t\t}\n\n   \t\t/**\r\n      * The bounding box of this operation.\r\n      *\r\n      * @property boundingBox\r\n      * @type Box3\r\n      */\n\n   \t\tcreateClass(Operation, [{\n   \t\t\t\tkey: \"computeBoundingBox\",\n\n\n   \t\t\t\t/**\r\n        * Calculates the bounding box of this operation.\r\n        *\r\n        * @method computeBoundingBox\r\n        * @return {Box3} The bounding box.\r\n        */\n\n   \t\t\t\tvalue: function computeBoundingBox() {\n\n   \t\t\t\t\t\tvar children = this.children;\n\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    l = void 0;\n\n   \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n   \t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\tthis.bbox.union(children[i].boundingBox);\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn this.bbox;\n   \t\t\t\t}\n   \t\t}, {\n   \t\t\t\tkey: \"boundingBox\",\n   \t\t\t\tget: function get$$1() {\n\n   \t\t\t\t\t\treturn this.bbox !== null ? this.bbox : this.computeBoundingBox();\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Operation;\n   }();\n\n   /**\r\n    * A union operation.\r\n    *\r\n    * @class Union\r\n    * @submodule csg\r\n    * @extends Operation\r\n    * @constructor\r\n    * @param {Operation} ...children - Child operations.\r\n    */\n\n   var Union = function (_Operation) {\n   \tinherits(Union, _Operation);\n\n   \tfunction Union() {\n   \t\tvar _ref;\n\n   \t\tclassCallCheck(this, Union);\n\n   \t\tfor (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {\n   \t\t\tchildren[_key] = arguments[_key];\n   \t\t}\n\n   \t\treturn possibleConstructorReturn(this, (_ref = Union.__proto__ || Object.getPrototypeOf(Union)).call.apply(_ref, [this, OperationType.UNION].concat(children)));\n   \t}\n\n   \t/**\r\n     * Updates the specified material index.\r\n     *\r\n     * @method updateMaterialIndex\r\n     * @param {Number} index - The index of the material index that needs to be updated.\r\n     * @param {HermiteData} data0 - The target volume data.\r\n     * @param {HermiteData} data1 - Predominant volume data.\r\n     */\n\n   \tcreateClass(Union, [{\n   \t\tkey: \"updateMaterialIndex\",\n   \t\tvalue: function updateMaterialIndex(index, data0, data1) {\n\n   \t\t\tvar materialIndex = data1.materialIndices[index];\n\n   \t\t\tif (materialIndex !== Material.AIR) {\n\n   \t\t\t\tdata0.setMaterialIndex(index, materialIndex);\n   \t\t\t}\n   \t\t}\n\n   \t\t/**\r\n      * Selects the edge that is closer to the non-solid grid point.\r\n      *\r\n      * @method selectEdge\r\n      * @param {Edge} edge0 - An existing edge.\r\n      * @param {Edge} edge1 - A predominant edge.\r\n      * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n      * @return {Edge} The selected edge.\r\n      */\n\n   \t}, {\n   \t\tkey: \"selectEdge\",\n   \t\tvalue: function selectEdge(edge0, edge1, s) {\n\n   \t\t\treturn s ? edge0.t > edge1.t ? edge0 : edge1 : edge0.t < edge1.t ? edge0 : edge1;\n   \t\t}\n   \t}]);\n   \treturn Union;\n   }(Operation);\n\n   /**\r\n    * A difference operation.\r\n    *\r\n    * @class Difference\r\n    * @submodule csg\r\n    * @extends Operation\r\n    * @constructor\r\n    * @param {Operation} ...children - Child operations.\r\n    */\n\n   var Difference = function (_Operation) {\n   \tinherits(Difference, _Operation);\n\n   \tfunction Difference() {\n   \t\tvar _ref;\n\n   \t\tclassCallCheck(this, Difference);\n\n   \t\tfor (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {\n   \t\t\tchildren[_key] = arguments[_key];\n   \t\t}\n\n   \t\treturn possibleConstructorReturn(this, (_ref = Difference.__proto__ || Object.getPrototypeOf(Difference)).call.apply(_ref, [this, OperationType.DIFFERENCE].concat(children)));\n   \t}\n\n   \t/**\r\n     * Updates the specified material index.\r\n     *\r\n     * @method updateMaterialIndex\r\n     * @param {Number} index - The index of the material index that needs to be updated.\r\n     * @param {HermiteData} data0 - The target volume data.\r\n     * @param {HermiteData} data1 - Predominant volume data.\r\n     */\n\n   \tcreateClass(Difference, [{\n   \t\tkey: \"updateMaterialIndex\",\n   \t\tvalue: function updateMaterialIndex(index, data0, data1) {\n\n   \t\t\tif (data1.materialIndices[index] !== Material.AIR) {\n\n   \t\t\t\tdata0.setMaterialIndex(index, Material.AIR);\n   \t\t\t}\n   \t\t}\n\n   \t\t/**\r\n      * Selects the edge that is closer to the solid grid point.\r\n      *\r\n      * @method selectEdge\r\n      * @param {Edge} edge0 - An existing edge.\r\n      * @param {Edge} edge1 - A predominant edge.\r\n      * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n      * @return {Edge} The selected edge.\r\n      */\n\n   \t}, {\n   \t\tkey: \"selectEdge\",\n   \t\tvalue: function selectEdge(edge0, edge1, s) {\n\n   \t\t\treturn s ? edge0.t < edge1.t ? edge0 : edge1 : edge0.t > edge1.t ? edge0 : edge1;\n   \t\t}\n   \t}]);\n   \treturn Difference;\n   }(Operation);\n\n   /**\r\n    * An intersection operation.\r\n    *\r\n    * @class Intersection\r\n    * @submodule csg\r\n    * @extends Operation\r\n    * @constructor\r\n    * @param {Operation} ...children - Child operations.\r\n    */\n\n   var Intersection = function (_Operation) {\n   \tinherits(Intersection, _Operation);\n\n   \tfunction Intersection() {\n   \t\tvar _ref;\n\n   \t\tclassCallCheck(this, Intersection);\n\n   \t\tfor (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {\n   \t\t\tchildren[_key] = arguments[_key];\n   \t\t}\n\n   \t\treturn possibleConstructorReturn(this, (_ref = Intersection.__proto__ || Object.getPrototypeOf(Intersection)).call.apply(_ref, [this, OperationType.INTERSECTION].concat(children)));\n   \t}\n\n   \t/**\r\n     * Updates the specified material index.\r\n     *\r\n     * @method updateMaterialIndex\r\n     * @param {Number} index - The index of the material index that needs to be updated.\r\n     * @param {HermiteData} data0 - The target volume data.\r\n     * @param {HermiteData} data1 - Predominant volume data.\r\n     */\n\n   \tcreateClass(Intersection, [{\n   \t\tkey: \"updateMaterialIndex\",\n   \t\tvalue: function updateMaterialIndex(index, data0, data1) {\n\n   \t\t\tvar materialIndex = data1.materialIndices[index];\n\n   \t\t\tdata0.setMaterialIndex(index, data0.materialIndices[index] !== Material.AIR && materialIndex !== Material.AIR ? materialIndex : Material.AIR);\n   \t\t}\n\n   \t\t/**\r\n      * Selects the edge that is closer to the solid grid point.\r\n      *\r\n      * @method selectEdge\r\n      * @param {Edge} edge0 - An existing edge.\r\n      * @param {Edge} edge1 - A predominant edge.\r\n      * @param {Boolean} s - Whether the starting point of the edge is solid.\r\n      * @return {Edge} The selected edge.\r\n      */\n\n   \t}, {\n   \t\tkey: \"selectEdge\",\n   \t\tvalue: function selectEdge(edge0, edge1, s) {\n\n   \t\t\treturn s ? edge0.t < edge1.t ? edge0 : edge1 : edge0.t > edge1.t ? edge0 : edge1;\n   \t\t}\n   \t}]);\n   \treturn Intersection;\n   }(Operation);\n\n   /**\r\n    * Finds out which grid points lie inside the area of the given operation.\r\n    *\r\n    * @method computeIndexBounds\r\n    * @private\r\n    * @static\r\n    * @param {Chunk} chunk - A volume chunk.\r\n    * @param {Operation} operation - A CSG operation.\r\n    * @return {Box3} The index bounds.\r\n    */\n\n   function computeIndexBounds(chunk, operation) {\n\n   \tvar s = chunk.size;\n   \tvar n = chunk.resolution;\n\n   \tvar min = new Vector3$1(0, 0, 0);\n   \tvar max = new Vector3$1(n, n, n);\n\n   \tvar region = new Box3$1(chunk.min, chunk.max);\n\n   \tif (operation.type !== OperationType.INTERSECTION) {\n\n   \t\tif (operation.boundingBox.intersectsBox(region)) {\n\n   \t\t\tmin.copy(operation.boundingBox.min).max(region.min).sub(region.min);\n\n   \t\t\tmin.x = Math.ceil(min.x * n / s);\n   \t\t\tmin.y = Math.ceil(min.y * n / s);\n   \t\t\tmin.z = Math.ceil(min.z * n / s);\n\n   \t\t\tmax.copy(operation.boundingBox.max).min(region.max).sub(region.min);\n\n   \t\t\tmax.x = Math.floor(max.x * n / s);\n   \t\t\tmax.y = Math.floor(max.y * n / s);\n   \t\t\tmax.z = Math.floor(max.z * n / s);\n   \t\t} else {\n\n   \t\t\t// The chunk is unaffected by this operation.\n   \t\t\tmin.set(n, n, n);\n   \t\t\tmax.set(0, 0, 0);\n   \t\t}\n   \t}\n\n   \treturn new Box3$1(min, max);\n   }\n\n   /**\r\n    * Combines material indices.\r\n    *\r\n    * @method combineMaterialIndices\r\n    * @private\r\n    * @static\r\n    * @param {Chunk} chunk - A volume chunk\r\n    * @param {Operation} operation - A CSG operation.\r\n    * @param {HermiteData} data0 - A target data set.\r\n    * @param {HermiteData} data1 - A predominant data set.\r\n    * @param {Box3} bounds - Grid iteration limits.\r\n    */\n\n   function combineMaterialIndices(chunk, operation, data0, data1, bounds) {\n\n   \tvar m = chunk.resolution + 1;\n   \tvar mm = m * m;\n\n   \tvar X = bounds.max.x;\n   \tvar Y = bounds.max.y;\n   \tvar Z = bounds.max.z;\n\n   \tvar x = void 0,\n   \t    y = void 0,\n   \t    z = void 0;\n\n   \tfor (z = bounds.min.z; z <= Z; ++z) {\n\n   \t\tfor (y = bounds.min.y; y <= Y; ++y) {\n\n   \t\t\tfor (x = bounds.min.x; x <= X; ++x) {\n\n   \t\t\t\toperation.updateMaterialIndex(z * mm + y * m + x, data0, data1);\n   \t\t\t}\n   \t\t}\n   \t}\n   }\n\n   /**\r\n    * Generates material indices.\r\n    *\r\n    * @method generateMaterialIndices\r\n    * @private\r\n    * @static\r\n    * @param {Chunk} chunk - A volume chunk\r\n    * @param {DensityFunction} operation - A CSG operation.\r\n    * @param {HermiteData} data - A target data set.\r\n    * @param {Box3} bounds - Grid iteration limits.\r\n    */\n\n   function generateMaterialIndices(chunk, operation, data, bounds) {\n\n   \tvar s = chunk.size;\n   \tvar n = chunk.resolution;\n   \tvar m = n + 1;\n   \tvar mm = m * m;\n\n   \tvar materialIndices = data.materialIndices;\n\n   \tvar base = chunk.min;\n   \tvar offset = new Vector3$1();\n   \tvar position = new Vector3$1();\n\n   \tvar X = bounds.max.x;\n   \tvar Y = bounds.max.y;\n   \tvar Z = bounds.max.z;\n\n   \tvar materialIndex = void 0;\n   \tvar materials = 0;\n\n   \tvar x = void 0,\n   \t    y = void 0,\n   \t    z = void 0;\n\n   \tfor (z = bounds.min.z; z <= Z; ++z) {\n\n   \t\toffset.z = z * s / n;\n\n   \t\tfor (y = bounds.min.y; y <= Y; ++y) {\n\n   \t\t\toffset.y = y * s / n;\n\n   \t\t\tfor (x = bounds.min.x; x <= X; ++x) {\n\n   \t\t\t\toffset.x = x * s / n;\n\n   \t\t\t\tmaterialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));\n\n   \t\t\t\tif (materialIndex !== Material.AIR) {\n\n   \t\t\t\t\tmaterialIndices[z * mm + y * m + x] = materialIndex;\n\n   \t\t\t\t\t++materials;\n   \t\t\t\t}\n   \t\t\t}\n   \t\t}\n   \t}\n\n   \tdata.materials = materials;\n   }\n\n   /**\r\n    * Combines edges.\r\n    *\r\n    * @method combineEdges\r\n    * @private\r\n    * @static\r\n    * @param {Chunk} chunk - A volume chunk\r\n    * @param {Operation} operation - A CSG operation.\r\n    * @param {HermiteData} data0 - A target data set.\r\n    * @param {HermiteData} data1 - A predominant data set.\r\n    * @return {Object} The generated edge data.\r\n    */\n\n   function combineEdges(chunk, operation, data0, data1) {\n\n   \tvar m = chunk.resolution + 1;\n   \tvar indexOffsets = new Uint32Array([1, m, m * m]);\n\n   \tvar materialIndices = data0.materialIndices;\n\n   \tvar edge1 = new Edge();\n   \tvar edge0 = new Edge();\n\n   \tvar edgeData1 = data1.edgeData;\n   \tvar edgeData0 = data0.edgeData;\n   \tvar edgeData = new EdgeData(chunk.resolution); // edgeData0.edges.length + edgeData1.edges.length\n   \tvar lengths = new Uint32Array(3);\n\n   \tvar edges1 = void 0,\n   \t    zeroCrossings1 = void 0,\n   \t    normals1 = void 0;\n   \tvar edges0 = void 0,\n   \t    zeroCrossings0 = void 0,\n   \t    normals0 = void 0;\n   \tvar edges = void 0,\n   \t    zeroCrossings = void 0,\n   \t    normals = void 0;\n\n   \tvar indexA1 = void 0,\n   \t    indexB1 = void 0;\n   \tvar indexA0 = void 0,\n   \t    indexB0 = void 0;\n\n   \tvar m1 = void 0,\n   \t    m2 = void 0;\n   \tvar edge = void 0;\n\n   \tvar c = void 0,\n   \t    d = void 0,\n   \t    i = void 0,\n   \t    j = void 0,\n   \t    il = void 0,\n   \t    jl = void 0;\n\n   \t// Process the edges along the X-axis, then Y and finally Z.\n   \tfor (c = 0, d = 0; d < 3; c = 0, ++d) {\n\n   \t\tedges1 = edgeData1.edges[d];\n   \t\tedges0 = edgeData0.edges[d];\n   \t\tedges = edgeData.edges[d];\n\n   \t\tzeroCrossings1 = edgeData1.zeroCrossings[d];\n   \t\tzeroCrossings0 = edgeData0.zeroCrossings[d];\n   \t\tzeroCrossings = edgeData.zeroCrossings[d];\n\n   \t\tnormals1 = edgeData1.normals[d];\n   \t\tnormals0 = edgeData0.normals[d];\n   \t\tnormals = edgeData.normals[d];\n\n   \t\til = edges1.length;\n   \t\tjl = edges0.length;\n\n   \t\t// Process all generated edges.\n   \t\tfor (i = 0, j = 0; i < il; ++i) {\n\n   \t\t\tindexA1 = edges1[i];\n   \t\t\tindexB1 = indexA1 + indexOffsets[d];\n\n   \t\t\tm1 = materialIndices[indexA1];\n   \t\t\tm2 = materialIndices[indexB1];\n\n   \t\t\tif (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\n\n   \t\t\t\tedge1.t = zeroCrossings1[i];\n   \t\t\t\tedge1.n.x = normals1[i * 3];\n   \t\t\t\tedge1.n.y = normals1[i * 3 + 1];\n   \t\t\t\tedge1.n.z = normals1[i * 3 + 2];\n\n   \t\t\t\tif (operation.type === OperationType.DIFFERENCE) {\n\n   \t\t\t\t\tedge1.n.negate();\n   \t\t\t\t}\n\n   \t\t\t\tedge = edge1;\n\n   \t\t\t\t// Process existing edges up to the generated edge.\n   \t\t\t\twhile (j < jl && edges0[j] <= indexA1) {\n\n   \t\t\t\t\tindexA0 = edges0[j];\n   \t\t\t\t\tindexB0 = indexA0 + indexOffsets[d];\n\n   \t\t\t\t\tedge0.t = zeroCrossings0[j];\n   \t\t\t\t\tedge0.n.x = normals0[j * 3];\n   \t\t\t\t\tedge0.n.y = normals0[j * 3 + 1];\n   \t\t\t\t\tedge0.n.z = normals0[j * 3 + 2];\n\n   \t\t\t\t\tm1 = materialIndices[indexA0];\n\n   \t\t\t\t\tif (indexA0 < indexA1) {\n\n   \t\t\t\t\t\tm2 = materialIndices[indexB0];\n\n   \t\t\t\t\t\tif (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\n\n   \t\t\t\t\t\t\t// The edge exhibits a material change and there is no conflict.\n   \t\t\t\t\t\t\tedges[c] = indexA0;\n   \t\t\t\t\t\t\tzeroCrossings[c] = edge0.t;\n   \t\t\t\t\t\t\tnormals[c * 3] = edge0.n.x;\n   \t\t\t\t\t\t\tnormals[c * 3 + 1] = edge0.n.y;\n   \t\t\t\t\t\t\tnormals[c * 3 + 2] = edge0.n.z;\n\n   \t\t\t\t\t\t\t++c;\n   \t\t\t\t\t\t}\n   \t\t\t\t\t} else {\n\n   \t\t\t\t\t\t// Resolve the conflict.\n   \t\t\t\t\t\tedge = operation.selectEdge(edge0, edge1, m1 === Material.SOLID);\n   \t\t\t\t\t}\n\n   \t\t\t\t\t++j;\n   \t\t\t\t}\n\n   \t\t\t\tedges[c] = indexA1;\n   \t\t\t\tzeroCrossings[c] = edge.t;\n   \t\t\t\tnormals[c * 3] = edge.n.x;\n   \t\t\t\tnormals[c * 3 + 1] = edge.n.y;\n   \t\t\t\tnormals[c * 3 + 2] = edge.n.z;\n\n   \t\t\t\t++c;\n   \t\t\t}\n   \t\t}\n\n   \t\t// Collect remaining edges.\n   \t\twhile (j < jl) {\n\n   \t\t\tindexA0 = edges0[j];\n   \t\t\tindexB0 = indexA0 + indexOffsets[d];\n\n   \t\t\tm1 = materialIndices[indexA0];\n   \t\t\tm2 = materialIndices[indexB0];\n\n   \t\t\tif (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\n\n   \t\t\t\tedges[c] = indexA0;\n   \t\t\t\tzeroCrossings[c] = zeroCrossings0[j];\n   \t\t\t\tnormals[c * 3] = normals0[j * 3];\n   \t\t\t\tnormals[c * 3 + 1] = normals0[j * 3 + 1];\n   \t\t\t\tnormals[c * 3 + 2] = normals0[j * 3 + 2];\n\n   \t\t\t\t++c;\n   \t\t\t}\n\n   \t\t\t++j;\n   \t\t}\n\n   \t\tlengths[d] = c;\n   \t}\n\n   \treturn { edgeData: edgeData, lengths: lengths };\n   }\n\n   /**\r\n    * Generates edge data.\r\n    *\r\n    * @method generateEdges\r\n    * @private\r\n    * @static\r\n    * @param {Chunk} chunk - A volume chunk\r\n    * @param {DensityFunction} operation - A CSG operation.\r\n    * @param {HermiteData} data - A target data set.\r\n    * @param {Box3} bounds - Grid iteration limits.\r\n    * @return {Object} The generated edge data.\r\n    */\n\n   function generateEdges(chunk, operation, data, bounds) {\n\n   \tvar s = chunk.size;\n   \tvar n = chunk.resolution;\n   \tvar m = n + 1;\n   \tvar mm = m * m;\n\n   \tvar indexOffsets = new Uint32Array([1, m, mm]);\n   \tvar materialIndices = data.materialIndices;\n\n   \tvar base = chunk.min;\n   \tvar offsetA = new Vector3$1();\n   \tvar offsetB = new Vector3$1();\n   \tvar edge = new Edge();\n\n   \tvar edgeData = new EdgeData(n);\n   \tvar lengths = new Uint32Array(3);\n\n   \tvar edges = void 0,\n   \t    zeroCrossings = void 0,\n   \t    normals = void 0;\n   \tvar indexA = void 0,\n   \t    indexB = void 0;\n\n   \tvar minX = void 0,\n   \t    minY = void 0,\n   \t    minZ = void 0;\n   \tvar maxX = void 0,\n   \t    maxY = void 0,\n   \t    maxZ = void 0;\n\n   \tvar c = void 0,\n   \t    d = void 0,\n   \t    a = void 0,\n   \t    axis = void 0;\n   \tvar x = void 0,\n   \t    y = void 0,\n   \t    z = void 0;\n\n   \t// Process the edges along the X-axis, then Y and finally Z.\n   \tfor (a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {\n\n   \t\t// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].\n   \t\taxis = PATTERN[a];\n\n   \t\tedges = edgeData.edges[d];\n   \t\tzeroCrossings = edgeData.zeroCrossings[d];\n   \t\tnormals = edgeData.normals[d];\n\n   \t\tminX = bounds.min.x;maxX = bounds.max.x;\n   \t\tminY = bounds.min.y;maxY = bounds.max.y;\n   \t\tminZ = bounds.min.z;maxZ = bounds.max.z;\n\n   \t\t/* Include edges that straddle the bounding box and avoid processing grid\r\n     points at chunk borders. */\n   \t\tswitch (d) {\n\n   \t\t\tcase 0:\n   \t\t\t\tminX = Math.max(minX - 1, 0);\n   \t\t\t\tmaxX = Math.min(maxX, n - 1);\n   \t\t\t\tbreak;\n\n   \t\t\tcase 1:\n   \t\t\t\tminY = Math.max(minY - 1, 0);\n   \t\t\t\tmaxY = Math.min(maxY, n - 1);\n   \t\t\t\tbreak;\n\n   \t\t\tcase 2:\n   \t\t\t\tminZ = Math.max(minZ - 1, 0);\n   \t\t\t\tmaxZ = Math.min(maxZ, n - 1);\n   \t\t\t\tbreak;\n\n   \t\t}\n\n   \t\tfor (z = minZ; z <= maxZ; ++z) {\n\n   \t\t\tfor (y = minY; y <= maxY; ++y) {\n\n   \t\t\t\tfor (x = minX; x <= maxX; ++x) {\n\n   \t\t\t\t\tindexA = z * mm + y * m + x;\n   \t\t\t\t\tindexB = indexA + indexOffsets[d];\n\n   \t\t\t\t\t// Check if the edge exhibits a material change.\n   \t\t\t\t\tif (materialIndices[indexA] !== materialIndices[indexB]) {\n\n   \t\t\t\t\t\toffsetA.set(x * s / n, y * s / n, z * s / n);\n\n   \t\t\t\t\t\toffsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);\n\n   \t\t\t\t\t\tedge.a.addVectors(base, offsetA);\n   \t\t\t\t\t\tedge.b.addVectors(base, offsetB);\n\n   \t\t\t\t\t\t// Create and store the edge data.\n   \t\t\t\t\t\toperation.generateEdge(edge);\n\n   \t\t\t\t\t\tedges[c] = indexA;\n   \t\t\t\t\t\tzeroCrossings[c] = edge.t;\n   \t\t\t\t\t\tnormals[c * 3] = edge.n.x;\n   \t\t\t\t\t\tnormals[c * 3 + 1] = edge.n.y;\n   \t\t\t\t\t\tnormals[c * 3 + 2] = edge.n.z;\n\n   \t\t\t\t\t\t++c;\n   \t\t\t\t\t}\n   \t\t\t\t}\n   \t\t\t}\n   \t\t}\n\n   \t\tlengths[d] = c;\n   \t}\n\n   \treturn { edgeData: edgeData, lengths: lengths };\n   }\n\n   /**\r\n    * Either generates or combines volume data based on the operation type.\r\n    *\r\n    * @method update\r\n    * @private\r\n    * @static\r\n    * @param {Chunk} chunk - A volume chunk.\r\n    * @param {Operation} operation - A CSG operation.\r\n    * @param {HermiteData} data0 - A target data set. May be empty or full.\r\n    * @param {HermiteData} [data1] - A predominant data set. Cannot be null.\r\n    */\n\n   function update(chunk, operation, data0, data1) {\n\n   \tvar bounds = computeIndexBounds(chunk, operation);\n\n   \tvar result = void 0,\n   \t    edgeData = void 0,\n   \t    lengths = void 0,\n   \t    d = void 0;\n   \tvar done = false;\n\n   \tif (operation.type === OperationType.DENSITY_FUNCTION) {\n\n   \t\tgenerateMaterialIndices(chunk, operation, data0, bounds);\n   \t} else if (data0.empty) {\n\n   \t\tif (operation.type === OperationType.UNION) {\n\n   \t\t\tdata0.set(data1);\n   \t\t\tdone = true;\n   \t\t}\n   \t} else {\n\n   \t\tcombineMaterialIndices(chunk, operation, data0, data1, bounds);\n   \t}\n\n   \tif (!done && !data0.empty && !data0.full) {\n\n   \t\tresult = operation.type === OperationType.DENSITY_FUNCTION ? generateEdges(chunk, operation, data0, bounds) : combineEdges(chunk, operation, data0, data1);\n\n   \t\tedgeData = result.edgeData;\n   \t\tlengths = result.lengths;\n\n   \t\t// Cut off empty data.\n   \t\tfor (d = 0; d < 3; ++d) {\n\n   \t\t\tedgeData.edges[d] = edgeData.edges[d].slice(0, lengths[d]);\n   \t\t\tedgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);\n   \t\t\tedgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);\n   \t\t}\n\n   \t\tdata0.edgeData = edgeData;\n   \t}\n   }\n\n   /**\r\n    * Executes the given operation.\r\n    *\r\n    * @method execute\r\n    * @private\r\n    * @static\r\n    * @param {Chunk} chunk - A volume chunk.\r\n    * @param {Operation} operation - An operation.\r\n    * @return {HermiteData} The generated data or null if the data is empty.\r\n    */\n\n   function execute(chunk, operation) {\n\n   \tvar children = operation.children;\n\n   \tvar result = void 0,\n   \t    data = void 0;\n   \tvar i = void 0,\n   \t    l = void 0;\n\n   \tif (operation.type === OperationType.DENSITY_FUNCTION) {\n\n   \t\t// Create a data target.\n   \t\tresult = new HermiteData();\n\n   \t\t// Use the density function to generate data.\n   \t\tupdate(chunk, operation, result);\n   \t}\n\n   \t// Union, Difference or Intersection.\n   \tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t// Generate the full result of the child operation recursively.\n   \t\tdata = execute(chunk, children[i]);\n\n   \t\tif (result === undefined) {\n\n   \t\t\tresult = data;\n   \t\t} else if (data !== null) {\n\n   \t\t\tif (result === null) {\n\n   \t\t\t\tif (operation.type === OperationType.UNION) {\n\n   \t\t\t\t\t// Build upon the first non-empty data.\n   \t\t\t\t\tresult = data;\n   \t\t\t\t}\n   \t\t\t} else {\n\n   \t\t\t\t// Combine the two data sets.\n   \t\t\t\tupdate(chunk, operation, result, data);\n   \t\t\t}\n   \t\t} else if (operation.type === OperationType.INTERSECTION) {\n\n   \t\t\t// An intersection with nothing results in nothing.\n   \t\t\tresult = null;\n   \t\t}\n\n   \t\tif (result === null && operation.type !== OperationType.UNION) {\n\n   \t\t\t// Further subtractions and intersections would have no effect.\n   \t\t\tbreak;\n   \t\t}\n   \t}\n\n   \treturn result !== null && result.empty ? null : result;\n   }\n\n   /**\r\n    * Constructive Solid Geometry combines Signed Distance Functions by using\r\n    * Boolean operators to generate and transform volume data.\r\n    *\r\n    * @class ConstructiveSolidGeometry\r\n    * @submodule csg\r\n    * @static\r\n    */\n\n   var ConstructiveSolidGeometry = function () {\n   \tfunction ConstructiveSolidGeometry() {\n   \t\tclassCallCheck(this, ConstructiveSolidGeometry);\n   \t}\n\n   \tcreateClass(ConstructiveSolidGeometry, null, [{\n   \t\tkey: \"run\",\n\n\n   \t\t/**\r\n      * Transforms the given chunk of hermite data in two steps:\r\n      *\r\n      *  1. Generate data by executing the given SDF\r\n      *  2. Combine the generated data with the chunk data\r\n      *\r\n      * @method run\r\n      * @static\r\n      * @param {Chunk} chunk - The volume chunk that should be modified.\r\n      * @param {SignedDistanceFunction} sdf - An SDF.\r\n      */\n\n   \t\tvalue: function run(chunk, sdf) {\n\n   \t\t\tif (chunk.data === null) {\n\n   \t\t\t\tif (sdf.operation === OperationType.UNION) {\n\n   \t\t\t\t\tchunk.data = new HermiteData();\n   \t\t\t\t\tchunk.data.edgeData = new EdgeData(0);\n   \t\t\t\t}\n   \t\t\t} else {\n\n   \t\t\t\tchunk.data.decompress();\n   \t\t\t}\n\n   \t\t\t// Step 1.\n   \t\t\tvar operation = sdf.toCSG();\n\n   \t\t\tvar data = chunk.data !== null ? execute(chunk, operation) : null;\n\n   \t\t\tif (data !== null) {\n\n   \t\t\t\t// Wrap the operation in a super operation.\n   \t\t\t\tswitch (sdf.operation) {\n\n   \t\t\t\t\tcase OperationType.UNION:\n   \t\t\t\t\t\toperation = new Union(operation);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase OperationType.DIFFERENCE:\n   \t\t\t\t\t\toperation = new Difference(operation);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t\tcase OperationType.INTERSECTION:\n   \t\t\t\t\t\toperation = new Intersection(operation);\n   \t\t\t\t\t\tbreak;\n\n   \t\t\t\t}\n\n   \t\t\t\t// Step 2.\n   \t\t\t\tupdate(chunk, operation, chunk.data, data);\n\n   \t\t\t\t// Provoke a geometry extraction.\n   \t\t\t\tchunk.data.lod = -1;\n   \t\t\t}\n\n   \t\t\tif (chunk.data !== null) {\n\n   \t\t\t\tif (chunk.data.empty) {\n\n   \t\t\t\t\tchunk.data = null;\n   \t\t\t\t} else {\n\n   \t\t\t\t\tchunk.data.compress();\n   \t\t\t\t}\n   \t\t\t}\n   \t\t}\n   \t}]);\n   \treturn ConstructiveSolidGeometry;\n   }();\n\n   /**\r\n    * An enumeration of SDF types.\r\n    *\r\n    * @class SDFType\r\n    * @submodule sdf\r\n    * @static\r\n    */\n\n   var SDFType = {\n\n   \t/**\r\n     * A sphere description.\r\n     *\r\n     * @property SPHERE\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tSPHERE: \"sdf.sphere\",\n\n   \t/**\r\n     * A box description.\r\n     *\r\n     * @property BOX\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tBOX: \"sdf.box\",\n\n   \t/**\r\n     * A torus description.\r\n     *\r\n     * @property TORUS\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tTORUS: \"sdf.torus\",\n\n   \t/**\r\n     * A plane description.\r\n     *\r\n     * @property PLANE\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tPLANE: \"sdf.plane\",\n\n   \t/**\r\n     * A heightfield description.\r\n     *\r\n     * @property HEIGHTFIELD\r\n     * @type String\r\n     * @static\r\n     * @final\r\n     */\n\n   \tHEIGHTFIELD: \"sdf.heightfield\"\n\n   };\n\n   /**\r\n    * The isovalue.\r\n    *\r\n    * @property ISOVALUE\r\n    * @type Number\r\n    * @private\r\n    * @static\r\n    * @final\r\n    */\n\n   var ISOVALUE = 0.0;\n\n   /**\r\n    * An operation that describes a density field.\r\n    *\r\n    * @class DensityFunction\r\n    * @submodule csg\r\n    * @extends Operation\r\n    * @constructor\r\n    * @param {SignedDistanceFunction} sdf - An SDF.\r\n    */\n\n   var DensityFunction = function (_Operation) {\n   \tinherits(DensityFunction, _Operation);\n\n   \tfunction DensityFunction(sdf) {\n   \t\tclassCallCheck(this, DensityFunction);\n\n   \t\t/**\r\n      * An SDF.\r\n      *\r\n      * @property sdf\r\n      * @type SignedDistanceFunction\r\n      * @private\r\n      */\n\n   \t\tvar _this = possibleConstructorReturn(this, (DensityFunction.__proto__ || Object.getPrototypeOf(DensityFunction)).call(this, OperationType.DENSITY_FUNCTION));\n\n   \t\t_this.sdf = sdf;\n\n   \t\treturn _this;\n   \t}\n\n   \t/**\r\n     * Calculates a bounding box for this operation.\r\n     *\r\n     * @method computeBoundingBox\r\n     * @return {Box3} The bounding box.\r\n     */\n\n   \tcreateClass(DensityFunction, [{\n   \t\tkey: \"computeBoundingBox\",\n   \t\tvalue: function computeBoundingBox() {\n\n   \t\t\tthis.bbox = this.sdf.computeBoundingBox();\n\n   \t\t\treturn this.bbox;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the material index for the given world position.\r\n      *\r\n      * @method generateMaterialIndex\r\n      * @param {Vector3} position - The world position of the material index.\r\n      * @return {Number} The material index.\r\n      */\n\n   \t}, {\n   \t\tkey: \"generateMaterialIndex\",\n   \t\tvalue: function generateMaterialIndex(position) {\n\n   \t\t\treturn this.sdf.sample(position) <= ISOVALUE ? this.sdf.material : Material.AIR;\n   \t\t}\n\n   \t\t/**\r\n      * Generates surface intersection data for the specified edge.\r\n      *\r\n      * @method generateEdge\r\n      * @param {Edge} edge - The edge that should be processed.\r\n      */\n\n   \t}, {\n   \t\tkey: \"generateEdge\",\n   \t\tvalue: function generateEdge(edge) {\n\n   \t\t\tedge.approximateZeroCrossing(this.sdf);\n   \t\t\tedge.computeSurfaceNormal(this.sdf);\n   \t\t}\n   \t}]);\n   \treturn DensityFunction;\n   }(Operation);\n\n   /**\r\n    * An abstract Signed Distance Function.\r\n    *\r\n    * An SDF describes the signed Euclidean distance to the surface of an object,\r\n    * effectively describing its density at every point in 3D space. It yields\r\n    * negative values for points that lie inside the volume and positive values\r\n    * for points outside. The value is zero at the exact boundary of the object.\r\n    *\r\n    * @class SignedDistanceFunction\r\n    * @submodule sdf\r\n    * @constructor\r\n    * @param {SDFType} type - The type of the SDF.\r\n    * @param {Number} [material=Material.SOLID] - A material index. Must be an integer in the range of 1 to 255.\r\n    */\n\n   var SignedDistanceFunction = function () {\n   \t\tfunction SignedDistanceFunction(type) {\n   \t\t\t\tvar material = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Material.SOLID;\n   \t\t\t\tclassCallCheck(this, SignedDistanceFunction);\n\n\n   \t\t\t\t/**\r\n        * The type of this SDF.\r\n        *\r\n        * @property type\r\n        * @type SDFType\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.type = type;\n\n   \t\t\t\t/**\r\n        * The operation type.\r\n        *\r\n        * @property operation\r\n        * @type OperationType\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.operation = null;\n\n   \t\t\t\t/**\r\n        * A material index.\r\n        *\r\n        * @property material\r\n        * @type Number\r\n        * @private\r\n        * @default Material.SOLID\r\n        */\n\n   \t\t\t\tthis.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));\n\n   \t\t\t\t/**\r\n        * A list of SDFs.\r\n        *\r\n        * SDFs can be chained to build CSG expressions.\r\n        *\r\n        * @property children\r\n        * @type Array\r\n        * @private\r\n        */\n\n   \t\t\t\tthis.children = [];\n\n   \t\t\t\t/**\r\n        * The bounding box of this SDF.\r\n        *\r\n        * @property bbox\r\n        * @type Box3\r\n        * @private\r\n        * @default null\r\n        */\n\n   \t\t\t\tthis.bbox = null;\n   \t\t}\n\n   \t\t/**\r\n      * The bounding box of this SDF.\r\n      *\r\n      * @property boundingBox\r\n      * @type Box3\r\n      */\n\n   \t\tcreateClass(SignedDistanceFunction, [{\n   \t\t\t\tkey: \"union\",\n\n\n   \t\t\t\t/**\r\n        * Adds the given SDF to this one.\r\n        *\r\n        * @method union\r\n        * @chainable\r\n        * @param {SignedDistanceFunction} sdf - An SDF.\r\n        * @return {SignedDistanceFunction} This SDF.\r\n        */\n\n   \t\t\t\tvalue: function union(sdf) {\n\n   \t\t\t\t\t\tsdf.operation = OperationType.UNION;\n   \t\t\t\t\t\tthis.children.push(sdf);\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Subtracts the given SDF from this one.\r\n        *\r\n        * @method subtract\r\n        * @chainable\r\n        * @param {SignedDistanceFunction} sdf - An SDF.\r\n        * @return {SignedDistanceFunction} This SDF.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"subtract\",\n   \t\t\t\tvalue: function subtract(sdf) {\n\n   \t\t\t\t\t\tsdf.operation = OperationType.DIFFERENCE;\n   \t\t\t\t\t\tthis.children.push(sdf);\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Intersects the given SDF with this one.\r\n        *\r\n        * @method intersect\r\n        * @chainable\r\n        * @param {SignedDistanceFunction} sdf - An SDF.\r\n        * @return {SignedDistanceFunction} This SDF.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"intersect\",\n   \t\t\t\tvalue: function intersect(sdf) {\n\n   \t\t\t\t\t\tsdf.operation = OperationType.INTERSECTION;\n   \t\t\t\t\t\tthis.children.push(sdf);\n\n   \t\t\t\t\t\treturn this;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Serialises this SDF.\r\n        *\r\n        * @method serialise\r\n        * @return {Object} A serialised description of this SDF.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"serialise\",\n   \t\t\t\tvalue: function serialise() {\n\n   \t\t\t\t\t\tvar result = {\n   \t\t\t\t\t\t\t\ttype: this.type,\n   \t\t\t\t\t\t\t\toperation: this.operation,\n   \t\t\t\t\t\t\t\tmaterial: this.material,\n   \t\t\t\t\t\t\t\tparameters: null,\n   \t\t\t\t\t\t\t\tchildren: []\n   \t\t\t\t\t\t};\n\n   \t\t\t\t\t\tvar children = this.children;\n\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    l = void 0;\n\n   \t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\tresult.children.push(children[i].serialise());\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn result;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Translates this SDF into a CSG expression.\r\n        *\r\n        * @method toCSG\r\n        * @return {Operation} A CSG operation.\r\n        * @example\r\n        *     a.union(b.intersect(c)).union(d).subtract(e) => Difference(Union(a, Intersection(b, c), d), e)\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"toCSG\",\n   \t\t\t\tvalue: function toCSG() {\n\n   \t\t\t\t\t\tvar children = this.children;\n\n   \t\t\t\t\t\tvar operation = new DensityFunction(this);\n   \t\t\t\t\t\tvar operationType = void 0;\n   \t\t\t\t\t\tvar child = void 0;\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    l = void 0;\n\n   \t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\tchild = children[i];\n\n   \t\t\t\t\t\t\t\tif (operationType !== child.operation) {\n\n   \t\t\t\t\t\t\t\t\t\toperationType = child.operation;\n\n   \t\t\t\t\t\t\t\t\t\tswitch (operationType) {\n\n   \t\t\t\t\t\t\t\t\t\t\t\tcase OperationType.UNION:\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\toperation = new Union(operation);\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n\n   \t\t\t\t\t\t\t\t\t\t\t\tcase OperationType.DIFFERENCE:\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\toperation = new Difference(operation);\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n\n   \t\t\t\t\t\t\t\t\t\t\t\tcase OperationType.INTERSECTION:\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\toperation = new Intersection(operation);\n   \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n\n   \t\t\t\t\t\t\t\t\t\t}\n   \t\t\t\t\t\t\t\t}\n\n   \t\t\t\t\t\t\t\toperation.children.push(child.toCSG());\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn operation;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Calculates the bounding box of this SDF.\r\n        *\r\n        * @method computeBoundingBox\r\n        * @throws {Error} An error is thrown if the method is not overridden.\r\n        * @return {Box3} The bounding box.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"computeBoundingBox\",\n   \t\t\t\tvalue: function computeBoundingBox() {\n\n   \t\t\t\t\t\tthrow new Error(\"SDF: bounding box method not implemented!\");\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Samples the volume's density at the given point in space.\r\n        *\r\n        * @method sample\r\n        * @throws {Error} An error is thrown if the method is not overridden.\r\n        * @param {Vector3} position - A position.\r\n        * @return {Number} The Euclidean distance to the surface.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"sample\",\n   \t\t\t\tvalue: function sample(position) {\n\n   \t\t\t\t\t\tthrow new Error(\"SDF: sample method not implemented!\");\n   \t\t\t\t}\n   \t\t}, {\n   \t\t\t\tkey: \"boundingBox\",\n   \t\t\t\tget: function get$$1() {\n\n   \t\t\t\t\t\treturn this.bbox !== null ? this.bbox : this.computeBoundingBox();\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * The complete bounding box of this SDF.\r\n        *\r\n        * @property completeBoundingBox\r\n        * @type Box3\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"completeBoundingBox\",\n   \t\t\t\tget: function get$$1() {\n\n   \t\t\t\t\t\tvar children = this.children;\n   \t\t\t\t\t\tvar bbox = this.boundingBox.clone();\n\n   \t\t\t\t\t\tvar i = void 0,\n   \t\t\t\t\t\t    l = void 0;\n\n   \t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\tbbox.union(children[i].completeBoundingBox);\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn bbox;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn SignedDistanceFunction;\n   }();\n\n   /**\r\n    * A Signed Distance Function that describes a sphere.\r\n    *\r\n    * @class Sphere\r\n    * @submodule sdf\r\n    * @extends SignedDistanceFunction\r\n    * @constructor\r\n    * @param {Object} parameters - The parameters.\r\n    * @param {Array} parameters.origin - The origin [x, y, z].\r\n    * @param {Number} parameters.radius - The radius.\r\n    * @param {Number} [material] - A material index.\r\n    */\n\n   var Sphere = function (_SignedDistanceFuncti) {\n   \t\tinherits(Sphere, _SignedDistanceFuncti);\n\n   \t\tfunction Sphere() {\n   \t\t\t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n   \t\t\t\tvar material = arguments[1];\n   \t\t\t\tclassCallCheck(this, Sphere);\n\n   \t\t\t\t/**\r\n        * The origin.\r\n        *\r\n        * @property origin\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\tvar _this = possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this, SDFType.SPHERE, material));\n\n   \t\t\t\t_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();\n\n   \t\t\t\t/**\r\n        * The radius.\r\n        *\r\n        * @property radius\r\n        * @type Number\r\n        * @private\r\n        */\n\n   \t\t\t\t_this.radius = parameters.radius;\n\n   \t\t\t\treturn _this;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the bounding box of this density field.\r\n      *\r\n      * @method computeBoundingBox\r\n      * @return {Box3} The bounding box.\r\n      */\n\n   \t\tcreateClass(Sphere, [{\n   \t\t\t\tkey: \"computeBoundingBox\",\n   \t\t\t\tvalue: function computeBoundingBox() {\n\n   \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n   \t\t\t\t\t\tthis.bbox.min.copy(this.origin).subScalar(this.radius);\n   \t\t\t\t\t\tthis.bbox.max.copy(this.origin).addScalar(this.radius);\n\n   \t\t\t\t\t\treturn this.bbox;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Samples the volume's density at the given point in space.\r\n        *\r\n        * @method sample\r\n        * @param {Vector3} position - A position.\r\n        * @return {Number} The euclidean distance to the surface.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"sample\",\n   \t\t\t\tvalue: function sample(position) {\n\n   \t\t\t\t\t\tvar origin = this.origin;\n\n   \t\t\t\t\t\tvar dx = position.x - origin.x;\n   \t\t\t\t\t\tvar dy = position.y - origin.y;\n   \t\t\t\t\t\tvar dz = position.z - origin.z;\n\n   \t\t\t\t\t\tvar length = Math.sqrt(dx * dx + dy * dy + dz * dz);\n\n   \t\t\t\t\t\treturn length - this.radius;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Serialises this SDF.\r\n        *\r\n        * @method serialise\r\n        * @return {Object} A concise representation of this SDF.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"serialise\",\n   \t\t\t\tvalue: function serialise() {\n\n   \t\t\t\t\t\tvar result = get(Sphere.prototype.__proto__ || Object.getPrototypeOf(Sphere.prototype), \"serialise\", this).call(this);\n\n   \t\t\t\t\t\tresult.parameters = {\n   \t\t\t\t\t\t\t\torigin: this.origin.toArray(),\n   \t\t\t\t\t\t\t\tradius: this.radius\n   \t\t\t\t\t\t};\n\n   \t\t\t\t\t\treturn result;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Sphere;\n   }(SignedDistanceFunction);\n\n   /**\r\n    * A Signed Distance Function that describes a box.\r\n    *\r\n    * @class Box\r\n    * @submodule sdf\r\n    * @extends SignedDistanceFunction\r\n    * @constructor\r\n    * @param {Object} parameters - The parameters.\r\n    * @param {Array} parameters.origin - The origin [x, y, z].\r\n    * @param {Array} parameters.halfDimensions - The half size [x, y, z].\r\n    * @param {Number} [material] - A material index.\r\n    */\n\n   var Box = function (_SignedDistanceFuncti) {\n   \t\tinherits(Box, _SignedDistanceFuncti);\n\n   \t\tfunction Box() {\n   \t\t\t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n   \t\t\t\tvar material = arguments[1];\n   \t\t\t\tclassCallCheck(this, Box);\n\n   \t\t\t\t/**\r\n        * The origin.\r\n        *\r\n        * @property origin\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\tvar _this = possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this, SDFType.BOX, material));\n\n   \t\t\t\t_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();\n\n   \t\t\t\t/**\r\n        * The halfDimensions.\r\n        *\r\n        * @property halfDimensions\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\t_this.halfDimensions = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.halfDimensions))))();\n\n   \t\t\t\treturn _this;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the bounding box of this density field.\r\n      *\r\n      * @method computeBoundingBox\r\n      * @return {Box3} The bounding box.\r\n      */\n\n   \t\tcreateClass(Box, [{\n   \t\t\t\tkey: \"computeBoundingBox\",\n   \t\t\t\tvalue: function computeBoundingBox() {\n\n   \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n   \t\t\t\t\t\tthis.bbox.min.subVectors(this.origin, this.halfDimensions);\n   \t\t\t\t\t\tthis.bbox.max.addVectors(this.origin, this.halfDimensions);\n\n   \t\t\t\t\t\treturn this.bbox;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Samples the volume's density at the given point in space.\r\n        *\r\n        * @method sample\r\n        * @param {Vector3} position - A position.\r\n        * @return {Number} The euclidean distance to the surface.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"sample\",\n   \t\t\t\tvalue: function sample(position) {\n\n   \t\t\t\t\t\tvar origin = this.origin;\n   \t\t\t\t\t\tvar halfDimensions = this.halfDimensions;\n\n   \t\t\t\t\t\t// Compute the distance to the hull.\n   \t\t\t\t\t\tvar dx = Math.abs(position.x - origin.x) - halfDimensions.x;\n   \t\t\t\t\t\tvar dy = Math.abs(position.y - origin.y) - halfDimensions.y;\n   \t\t\t\t\t\tvar dz = Math.abs(position.z - origin.z) - halfDimensions.z;\n\n   \t\t\t\t\t\tvar m = Math.max(dx, Math.max(dy, dz));\n\n   \t\t\t\t\t\tvar mx0 = Math.max(dx, 0);\n   \t\t\t\t\t\tvar my0 = Math.max(dy, 0);\n   \t\t\t\t\t\tvar mz0 = Math.max(dz, 0);\n\n   \t\t\t\t\t\tvar length = Math.sqrt(mx0 * mx0 + my0 * my0 + mz0 * mz0);\n\n   \t\t\t\t\t\treturn Math.min(m, 0) + length;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Serialises this SDF.\r\n        *\r\n        * @method serialise\r\n        * @return {Object} A serialised description of this SDF.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"serialise\",\n   \t\t\t\tvalue: function serialise() {\n\n   \t\t\t\t\t\tvar result = get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), \"serialise\", this).call(this);\n\n   \t\t\t\t\t\tresult.parameters = {\n   \t\t\t\t\t\t\t\torigin: this.origin.toArray(),\n   \t\t\t\t\t\t\t\thalfDimensions: this.halfDimensions.toArray()\n   \t\t\t\t\t\t};\n\n   \t\t\t\t\t\treturn result;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Box;\n   }(SignedDistanceFunction);\n\n   /**\r\n    * A Signed Distance Function that describes a plane.\r\n    *\r\n    * @class Plane\r\n    * @submodule sdf\r\n    * @extends SignedDistanceFunction\r\n    * @constructor\r\n    * @param {Object} parameters - The parameters.\r\n    * @param {Array} parameters.normal - The normal [x, y, z].\r\n    * @param {Number} parameters.constant - The constant.\r\n    * @param {Number} [material] - A material index.\r\n    */\n\n   var Plane = function (_SignedDistanceFuncti) {\n   \tinherits(Plane, _SignedDistanceFuncti);\n\n   \tfunction Plane() {\n   \t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n   \t\tvar material = arguments[1];\n   \t\tclassCallCheck(this, Plane);\n\n   \t\t/**\r\n      * The normal.\r\n      *\r\n      * @property normal\r\n      * @type Vector3\r\n      * @private\r\n      */\n\n   \t\tvar _this = possibleConstructorReturn(this, (Plane.__proto__ || Object.getPrototypeOf(Plane)).call(this, SDFType.PLANE, material));\n\n   \t\t_this.normal = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.normal))))();\n\n   \t\t/**\r\n      * The constant.\r\n      *\r\n      * @property constant\r\n      * @type Number\r\n      * @private\r\n      */\n\n   \t\t_this.constant = parameters.constant;\n\n   \t\treturn _this;\n   \t}\n\n   \t/**\r\n     * Calculates the bounding box of this density field.\r\n     *\r\n     * @method computeBoundingBox\r\n     * @return {Box3} The bounding box.\r\n     * @todo\r\n     */\n\n   \tcreateClass(Plane, [{\n   \t\tkey: \"computeBoundingBox\",\n   \t\tvalue: function computeBoundingBox() {\n\n   \t\t\tthis.bbox = new Box3$1();\n\n   \t\t\treturn this.bbox;\n   \t\t}\n\n   \t\t/**\r\n      * Samples the volume's density at the given point in space.\r\n      *\r\n      * @method sample\r\n      * @param {Vector3} position - A position.\r\n      * @return {Number} The euclidean distance to the surface.\r\n      */\n\n   \t}, {\n   \t\tkey: \"sample\",\n   \t\tvalue: function sample(position) {\n\n   \t\t\treturn this.normal.dot(position) + this.constant;\n   \t\t}\n\n   \t\t/**\r\n      * Serialises this SDF.\r\n      *\r\n      * @method serialise\r\n      * @return {Object} A serialised description of this SDF.\r\n      */\n\n   \t}, {\n   \t\tkey: \"serialise\",\n   \t\tvalue: function serialise() {\n\n   \t\t\tvar result = get(Plane.prototype.__proto__ || Object.getPrototypeOf(Plane.prototype), \"serialise\", this).call(this);\n\n   \t\t\tresult.parameters = {\n   \t\t\t\tnormal: this.normal.toArray(),\n   \t\t\t\tconstant: this.constant\n   \t\t\t};\n\n   \t\t\treturn result;\n   \t\t}\n   \t}]);\n   \treturn Plane;\n   }(SignedDistanceFunction);\n\n   /**\r\n    * A Signed Distance Function that describes a torus.\r\n    *\r\n    * @class Torus\r\n    * @submodule sdf\r\n    * @extends SignedDistanceFunction\r\n    * @constructor\r\n    * @param {Object} parameters - The parameters.\r\n    * @param {Array} parameters.origin - The origin [x, y, z].\r\n    * @param {Number} parameters.R - The distance from the center to the tube.\r\n    * @param {Number} parameters.r - The radius of the tube.\r\n    * @param {Number} [material] - A material index.\r\n    */\n\n   var Torus = function (_SignedDistanceFuncti) {\n   \t\tinherits(Torus, _SignedDistanceFuncti);\n\n   \t\tfunction Torus() {\n   \t\t\t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n   \t\t\t\tvar material = arguments[1];\n   \t\t\t\tclassCallCheck(this, Torus);\n\n   \t\t\t\t/**\r\n        * The origin.\r\n        *\r\n        * @property origin\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\tvar _this = possibleConstructorReturn(this, (Torus.__proto__ || Object.getPrototypeOf(Torus)).call(this, SDFType.TORUS, material));\n\n   \t\t\t\t_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();\n\n   \t\t\t\t/**\r\n        * The distance from the center to the tube.\r\n        *\r\n        * @property R\r\n        * @type Number\r\n        * @private\r\n        */\n\n   \t\t\t\t_this.R = parameters.R;\n\n   \t\t\t\t/**\r\n        * The radius of the tube.\r\n        *\r\n        * @property r\r\n        * @type Number\r\n        * @private\r\n        */\n\n   \t\t\t\t_this.r = parameters.r;\n\n   \t\t\t\treturn _this;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the bounding box of this density field.\r\n      *\r\n      * @method computeBoundingBox\r\n      * @return {Box3} The bounding box.\r\n      */\n\n   \t\tcreateClass(Torus, [{\n   \t\t\t\tkey: \"computeBoundingBox\",\n   \t\t\t\tvalue: function computeBoundingBox() {\n\n   \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n   \t\t\t\t\t\tthis.bbox.min.copy(this.origin).subScalar(this.R).subScalar(this.r);\n   \t\t\t\t\t\tthis.bbox.max.copy(this.origin).addScalar(this.R).addScalar(this.r);\n\n   \t\t\t\t\t\treturn this.bbox;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Samples the volume's density at the given point in space.\r\n        *\r\n        * @method sample\r\n        * @param {Vector3} position - A position.\r\n        * @return {Number} The euclidean distance to the surface.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"sample\",\n   \t\t\t\tvalue: function sample(position) {\n\n   \t\t\t\t\t\tvar origin = this.origin;\n\n   \t\t\t\t\t\tvar dx = position.x - origin.x;\n   \t\t\t\t\t\tvar dy = position.y - origin.y;\n   \t\t\t\t\t\tvar dz = position.z - origin.z;\n\n   \t\t\t\t\t\tvar q = Math.sqrt(dx * dx + dz * dz) - this.R;\n   \t\t\t\t\t\tvar length = Math.sqrt(q * q + dy * dy);\n\n   \t\t\t\t\t\treturn length - this.r;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Serialises this SDF.\r\n        *\r\n        * @method serialise\r\n        * @return {Object} A serialised description of this SDF.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"serialise\",\n   \t\t\t\tvalue: function serialise() {\n\n   \t\t\t\t\t\tvar result = get(Torus.prototype.__proto__ || Object.getPrototypeOf(Torus.prototype), \"serialise\", this).call(this);\n\n   \t\t\t\t\t\tresult.parameters = {\n   \t\t\t\t\t\t\t\torigin: this.origin.toArray(),\n   \t\t\t\t\t\t\t\tR: this.R,\n   \t\t\t\t\t\t\t\tr: this.r\n   \t\t\t\t\t\t};\n\n   \t\t\t\t\t\treturn result;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Torus;\n   }(SignedDistanceFunction);\n\n   /**\r\n    * A Signed Distance Function that describes a heightfield.\r\n    *\r\n    * @class Sphere\r\n    * @submodule sdf\r\n    * @extends SignedDistanceFunction\r\n    * @constructor\r\n    * @param {Object} parameters - The parameters.\r\n    * @param {Array} parameters.min - The min position [x, y, z].\r\n    * @param {Array} parameters.dimensions - The dimensions [x, y, z].\r\n    * @param {Uint8ClampedArray} parameters.data - The heightmap data.\r\n    * @param {Number} [material] - A material index.\r\n    */\n\n   var Heightfield = function (_SignedDistanceFuncti) {\n   \t\tinherits(Heightfield, _SignedDistanceFuncti);\n\n   \t\tfunction Heightfield() {\n   \t\t\t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n   \t\t\t\tvar material = arguments[1];\n   \t\t\t\tclassCallCheck(this, Heightfield);\n\n   \t\t\t\t/**\r\n        * The position.\r\n        *\r\n        * @property min\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\tvar _this = possibleConstructorReturn(this, (Heightfield.__proto__ || Object.getPrototypeOf(Heightfield)).call(this, SDFType.HEIGHTFIELD, material));\n\n   \t\t\t\t_this.min = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.min))))();\n\n   \t\t\t\t/**\r\n        * The dimensions.\r\n        *\r\n        * @property dimensions\r\n        * @type Vector3\r\n        * @private\r\n        */\n\n   \t\t\t\t_this.dimensions = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.size))))();\n\n   \t\t\t\t/**\r\n        * The height data.\r\n        *\r\n        * @property data\r\n        * @type Uint8ClampedArray\r\n        * @private\r\n        */\n\n   \t\t\t\t_this.data = parameters.data;\n\n   \t\t\t\treturn _this;\n   \t\t}\n\n   \t\t/**\r\n      * Calculates the bounding box of this density field.\r\n      *\r\n      * @method computeBoundingBox\r\n      * @return {Box3} The bounding box.\r\n      */\n\n   \t\tcreateClass(Heightfield, [{\n   \t\t\t\tkey: \"computeBoundingBox\",\n   \t\t\t\tvalue: function computeBoundingBox() {\n\n   \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n   \t\t\t\t\t\tthis.bbox.min.copy(this.min);\n   \t\t\t\t\t\tthis.bbox.max.addVectors(this.min, this.dimensions);\n\n   \t\t\t\t\t\treturn this.bbox;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Samples the volume's density at the given point in space.\r\n        *\r\n        * @method sample\r\n        * @param {Vector3} position - A position.\r\n        * @return {Number} The euclidean distance to the surface.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"sample\",\n   \t\t\t\tvalue: function sample(position) {\n\n   \t\t\t\t\t\tvar min = this.min;\n   \t\t\t\t\t\tvar dimensions = this.dimensions;\n\n   \t\t\t\t\t\tvar x = Math.max(min.x, Math.min(min.x + dimensions.x, position.x - min.x));\n   \t\t\t\t\t\tvar z = Math.max(min.z, Math.min(min.z + dimensions.z, position.z - min.z));\n\n   \t\t\t\t\t\tvar y = position.y - min.y;\n\n   \t\t\t\t\t\treturn y - this.data[z * dimensions.x + x] / 255 * dimensions.y;\n   \t\t\t\t}\n\n   \t\t\t\t/**\r\n        * Serialises this SDF.\r\n        *\r\n        * @method serialise\r\n        * @return {Object} A serialised description of this SDF.\r\n        */\n\n   \t\t}, {\n   \t\t\t\tkey: \"serialise\",\n   \t\t\t\tvalue: function serialise() {\n\n   \t\t\t\t\t\tvar result = get(Heightfield.prototype.__proto__ || Object.getPrototypeOf(Heightfield.prototype), \"serialise\", this).call(this);\n\n   \t\t\t\t\t\tresult.parameters = {\n   \t\t\t\t\t\t\t\tmin: this.min.toArray(),\n   \t\t\t\t\t\t\t\tdimensions: this.dimensions.toArray(),\n   \t\t\t\t\t\t\t\tdata: this.data\n   \t\t\t\t\t\t};\n\n   \t\t\t\t\t\treturn result;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Heightfield;\n   }(SignedDistanceFunction);\n\n   /**\r\n    * An SDF reviver.\r\n    *\r\n    * @class Reviver\r\n    * @static\r\n    */\n\n   var Reviver = function () {\n   \t\tfunction Reviver() {\n   \t\t\t\tclassCallCheck(this, Reviver);\n   \t\t}\n\n   \t\tcreateClass(Reviver, null, [{\n   \t\t\t\tkey: \"reviveSDF\",\n\n\n   \t\t\t\t/**\r\n        * Creates an SDF from the given serialised description.\r\n        *\r\n        * @method reviveSDF\r\n        * @static\r\n        * @param {Object} description - A serialised SDF.\r\n        * @return {SignedDistanceFunction} An SDF.\r\n        */\n\n   \t\t\t\tvalue: function reviveSDF(description) {\n\n   \t\t\t\t\t\tvar sdf = void 0,\n   \t\t\t\t\t\t    i = void 0,\n   \t\t\t\t\t\t    l = void 0;\n\n   \t\t\t\t\t\tswitch (description.type) {\n\n   \t\t\t\t\t\t\t\tcase SDFType.SPHERE:\n   \t\t\t\t\t\t\t\t\t\tsdf = new Sphere(description.parameters, description.material);\n   \t\t\t\t\t\t\t\t\t\tbreak;\n\n   \t\t\t\t\t\t\t\tcase SDFType.BOX:\n   \t\t\t\t\t\t\t\t\t\tsdf = new Box(description.parameters, description.material);\n   \t\t\t\t\t\t\t\t\t\tbreak;\n\n   \t\t\t\t\t\t\t\tcase SDFType.TORUS:\n   \t\t\t\t\t\t\t\t\t\tsdf = new Torus(description.parameters, description.material);\n   \t\t\t\t\t\t\t\t\t\tbreak;\n\n   \t\t\t\t\t\t\t\tcase SDFType.PLANE:\n   \t\t\t\t\t\t\t\t\t\tsdf = new Plane(description.parameters, description.material);\n   \t\t\t\t\t\t\t\t\t\tbreak;\n\n   \t\t\t\t\t\t\t\tcase SDFType.HEIGHTFIELD:\n   \t\t\t\t\t\t\t\t\t\tsdf = new Heightfield(description.parameters, description.material);\n   \t\t\t\t\t\t\t\t\t\tbreak;\n\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\tsdf.operation = description.operation;\n\n   \t\t\t\t\t\tfor (i = 0, l = description.children.length; i < l; ++i) {\n\n   \t\t\t\t\t\t\t\tsdf.children.push(this.reviveSDF(description.children[i]));\n   \t\t\t\t\t\t}\n\n   \t\t\t\t\t\treturn sdf;\n   \t\t\t\t}\n   \t\t}]);\n   \t\treturn Reviver;\n   }();\n\n   /**\r\n    * A hermite data modifier that applies CSG operations to volume chunks.\r\n    *\r\n    * @class VolumeModifier\r\n    * @submodule worker\r\n    * @static\r\n    */\n\n   var VolumeModifier = {\n\n   \t/**\r\n     * An empty chunk of hermite data.\r\n     *\r\n     * @property chunk\r\n     * @type Chunk\r\n     * @static\r\n     */\n\n   \tchunk: new Chunk(),\n\n   \t/**\r\n     * A container for the data that will be returned to the main thread.\r\n     *\r\n     * @property message\r\n     * @type Object\r\n     * @static\r\n     */\n\n   \tmessage: {\n   \t\taction: Action.MODIFY,\n   \t\tchunk: null\n   \t},\n\n   \t/**\r\n     * A list of transferable objects.\r\n     *\r\n     * @property transferList\r\n     * @type Array\r\n     * @static\r\n     */\n\n   \ttransferList: null,\n\n   \t/**\r\n     * Modifies the given hermite data.\r\n     *\r\n     * @method modify\r\n     * @static\r\n     * @param {Chunk} chunk - A volume chunk.\r\n     * @param {Object} sdf - A serialised SDF.\r\n     */\n\n   \tmodify: function modify(chunk, sdf) {\n\n   \t\t// Adopt the provided chunk data.\n   \t\tthis.chunk.deserialise(chunk);\n\n   \t\t// Revive the SDF and execute it.\n   \t\tConstructiveSolidGeometry.run(this.chunk, Reviver.reviveSDF(sdf));\n\n   \t\tthis.message.chunk = this.chunk.serialise();\n   \t\tthis.transferList = this.chunk.createTransferList();\n   \t}\n   };\n\n   /**\r\n    * A worker thread that processes volume data.\r\n    *\r\n    * @class Worker\r\n    * @submodule worker\r\n    * @static\r\n    */\n\n   /**\r\n    * Receives and handles messages from the main thread.\r\n    *\r\n    * @method onMessage\r\n    * @private\r\n    * @static\r\n    * @param {Event} event - A message event containing data from the main thread.\r\n    */\n\n   self.addEventListener(\"message\", function onMessage(event) {\n\n   \tvar data = event.data;\n\n   \tswitch (data.action) {\n\n   \t\tcase Action.EXTRACT:\n   \t\t\tSurfaceExtractor.extract(data.chunk);\n   \t\t\tpostMessage(SurfaceExtractor.message, SurfaceExtractor.transferList);\n   \t\t\tbreak;\n\n   \t\tcase Action.MODIFY:\n   \t\t\tVolumeModifier.modify(data.chunk, data.sdf);\n   \t\t\tpostMessage(VolumeModifier.message, VolumeModifier.transferList);\n   \t\t\tbreak;\n\n   \t\tcase Action.CLOSE:\n   \t\tdefault:\n   \t\t\tclose();\n\n   \t}\n   });\n\n   /**\r\n    * Returns all data to the main thread and closes the worker.\r\n    *\r\n    * @method onError\r\n    * @private\r\n    * @static\r\n    * @param {Event} event - An error event.\r\n    */\n\n   self.addEventListener(\"error\", function onError(event) {\n\n   \tvar message = {\n   \t\taction: Action.CLOSE,\n   \t\terror: event.message,\n   \t\tdata: null\n   \t};\n\n   \tvar transferList = [];\n\n   \tvar chunks = [SurfaceExtractor.chunk, VolumeModifier.chunk];\n\n   \t// Find out which operator has the data.\n   \tif (chunks[0].data !== null && !chunks[0].data.neutered) {\n\n   \t\tmessage.chunk = chunks[0].serialise();\n   \t\tchunks[0].createTransferList(transferList);\n   \t} else if (chunks[1].data !== null && !chunks[1].data.neutered) {\n\n   \t\tmessage.chunk = chunks[1].serialise();\n   \t\tchunks[1].createTransferList(transferList);\n   \t}\n\n   \tpostMessage(message, transferList);\n   \tclose();\n   });\n\n}());\n";

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

     var ThreadPool = function (_EventTarget) {
     		inherits(ThreadPool, _EventTarget);

     		function ThreadPool() {
     				var maxWorkers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.hardwareConcurrency;
     				classCallCheck(this, ThreadPool);

     				/**
          * An object URL to the worker program.
          *
          * @property workerURL
          * @type String
          * @private
          */

     				var _this = possibleConstructorReturn(this, (ThreadPool.__proto__ || Object.getPrototypeOf(ThreadPool)).call(this));

     				_this.workerURL = URL.createObjectURL(new Blob([worker], { type: "text/javascript" }));

     				/**
          * The maximum number of active worker threads.
          *
          * @property maxWorkers
          * @type Number
          * @default navigator.hardwareConcurrency
          */

     				_this.maxWorkers = Math.min(navigator.hardwareConcurrency, Math.max(maxWorkers, 1));

     				/**
          * A list of existing workers.
          *
          * @property workers
          * @type Array
          * @private
          */

     				_this.workers = [];

     				/**
          * Keeps track of workers that are currently busy.
          *
          * @property busyWorkers
          * @type WeakSet
          * @private
          */

     				_this.busyWorkers = new WeakSet();

     				return _this;
     		}

     		/**
        * Handles events.
        *
        * @method handleEvent
        * @param {Event} event - An event.
        */

     		createClass(ThreadPool, [{
     				key: "handleEvent",
     				value: function handleEvent(event) {

     						switch (event.type) {

     								case "message":
     										this.busyWorkers.delete(event.target);
     										MESSAGE.worker = event.target;
     										MESSAGE.data = event.data;
     										this.dispatchEvent(MESSAGE);
     										break;

     								case "error":
     										// Errors are being handled in the worker.
     										window.alert("Encountered an unexpected error.", event.message);
     										break;

     						}
     				}

     				/**
          * Closes a worker.
          *
          * @method closeWorker
          * @param {Worker} worker - The worker to close.
          */

     		}, {
     				key: "closeWorker",
     				value: function closeWorker(worker$$1) {

     						var index = this.workers.indexOf(worker$$1);

     						if (this.busyWorkers.has(worker$$1)) {

     								this.busyWorkers.delete(worker$$1);
     								worker$$1.terminate();
     						} else {

     								worker$$1.postMessage({
     										action: Action.CLOSE
     								});
     						}

     						worker$$1.removeEventListener("message", this);
     						worker$$1.removeEventListener("error", this);

     						if (index >= 0) {

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

     		}, {
     				key: "createWorker",
     				value: function createWorker() {

     						var worker$$1 = new Worker(this.workerURL);

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

     		}, {
     				key: "getWorker",
     				value: function getWorker() {

     						var worker$$1 = null;

     						var i = void 0;

     						for (i = this.workers.length - 1; i >= 0; --i) {

     								if (!this.busyWorkers.has(this.workers[i])) {

     										worker$$1 = this.workers[i];
     										this.busyWorkers.add(worker$$1);

     										break;
     								}
     						}

     						// Check if all existing workers are busy.
     						if (worker$$1 === null && this.workers.length < this.maxWorkers) {

     								if (this.workerURL !== null) {

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

     		}, {
     				key: "clear",
     				value: function clear() {

     						while (this.workers.length > 0) {

     								this.closeWorker(this.workers.pop());
     						}
     				}

     				/**
          * Removes all active workers and releases the worker program blob.
          *
          * @method dispose
          */

     		}, {
     				key: "dispose",
     				value: function dispose() {

     						this.clear();

     						URL.revokeObjectURL(this.workerURL);
     						this.workerURL = null;
     				}
     		}]);
     		return ThreadPool;
     }(EventTarget);

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

     var WorkerTask = function (_Task) {
     		inherits(WorkerTask, _Task);

     		function WorkerTask(action, chunk, priority) {
     				classCallCheck(this, WorkerTask);

     				/**
          * A worker action.
          *
          * @property action
          * @type Action
          * @default null
          */

     				var _this = possibleConstructorReturn(this, (WorkerTask.__proto__ || Object.getPrototypeOf(WorkerTask)).call(this, priority));

     				_this.action = action;

     				/**
          * A volume chunk.
          *
          * @property chunk
          * @type Chunk
          */

     				_this.chunk = chunk;

     				return _this;
     		}

     		return WorkerTask;
     }(Task);

     /**
      * A terrain event.
      *
      * @class TerrainEvent
      * @submodule events
      * @constructor
      * @param {String} type - The name of the event.
      */

     var TerrainEvent = function (_Event) {
     	inherits(TerrainEvent, _Event);

     	function TerrainEvent(type) {
     		classCallCheck(this, TerrainEvent);

     		/**
        * A volume chunk.
        *
        * @property chunk
        * @type Chunk
        * @default null
        */

     		var _this = possibleConstructorReturn(this, (TerrainEvent.__proto__ || Object.getPrototypeOf(TerrainEvent)).call(this, type));

     		_this.chunk = null;

     		return _this;
     	}

     	return TerrainEvent;
     }(Event);

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

     var MODIFICATION_START = new TerrainEvent("modificationstart");

     /**
      * Signals the end of a modification task.
      *
      * @event modificationend
      * @for Terrain
      * @type TerrainEvent
      */

     var MODIFICATION_END = new TerrainEvent("modificationend");

     /**
      * Signals the start of an extraction task.
      *
      * @event extractionstart
      * @for Terrain
      * @type TerrainEvent
      */

     var EXTRACTION_START = new TerrainEvent("extractionstart");

     /**
      * Signals the end of an extraction task.
      *
      * @event extractionend
      * @for Terrain
      * @type TerrainEvent
      */

     var EXTRACTION_END = new TerrainEvent("extractionend");

     /**
      * A 3D box.
      *
      * @property BOX3
      * @type Box3
      * @private
      * @static
      * @final
      */

     var BOX3 = new three.Box3();

     /**
      * A 4x4 matrix.
      *
      * @property MATRIX4
      * @type Matrix4
      * @private
      * @static
      * @final
      */

     var MATRIX4 = new three.Matrix4();

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
      * @param {Number} [options.workers] - Limits the amount of active workers. The default limit is the amount of logical processors which is also the maximum.
      * @param {Number} [options.levels] - The amount of detail levels. The default number of levels is derived from the resolution.
      * @param {Number} [options.iterations] - Limits the amount of volume chunks that are being processed during each update.
      */

     var Terrain = function (_EventTarget) {
     		inherits(Terrain, _EventTarget);

     		function Terrain() {
     				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
     				classCallCheck(this, Terrain);

     				/**
          * The terrain object. Add this to your scene.
          *
          * @property object
          * @type Object3D
          */

     				var _this = possibleConstructorReturn(this, (Terrain.__proto__ || Object.getPrototypeOf(Terrain)).call(this));

     				_this.object = new three.Object3D();
     				_this.object.name = "Terrain";

     				/**
          * The volume of this terrain.
          *
          * @property volume
          * @type Volume
          */

     				_this.volume = new Volume(options.chunkSize, options.resolution);

     				/**
          * A volume chunk iterator.
          *
          * @property iterator
          * @type Iterator
          * @private
          */

     				_this.iterator = _this.volume.leaves(new three.Frustum());

     				/**
          * The number of detail levels.
          *
          * Terrain chunks that are further away from the camera will be rendered
          * with less vertices.
          *
          * @property levels
          * @type Number
          * @private
          * @default log2(resolution)
          */

     				_this.levels = options.levels !== undefined ? Math.max(1, options.levels) : Math.log2(_this.volume.resolution);

     				/**
          * The maximum amount of chunk iterations per update.
          *
          * Volume chunks that lie in the field of view will be processed over the
          * course of several update calls.
          *
          * @property iterations
          * @type Number
          * @private
          * @default 1000
          */

     				_this.iterations = options.iterations !== undefined ? Math.max(1, options.iterations) : 1000;

     				/**
          * A thread pool.
          *
          * @property threadPool
          * @type ThreadPool
          * @private
          */

     				_this.threadPool = new ThreadPool(options.workers);
     				_this.threadPool.addEventListener("message", _this);

     				/**
          * Manages pending tasks.
          *
          * @property scheduler
          * @type Scheduler
          * @private
          */

     				_this.scheduler = new Scheduler(_this.levels + 1);

     				/**
          * A chronological sequence of CSG operations that have been executed during
          * this session.
          *
          * @property history
          * @type History
          */

     				_this.history = new History();

     				/**
          * Keeps track of chunks that are currently being used by a worker. The
          * amount of neutered chunks cannot exceed the amount of worker threads.
          *
          * @property neutered
          * @type WeakSet
          * @private
          */

     				_this.neutered = new WeakSet();

     				/**
          * Keeps track of associations between workers and chunks.
          *
          * @property chunks
          * @type WeakMap
          * @private
          */

     				_this.chunks = new WeakMap();

     				/**
          * Keeps track of associations between chunks and meshes.
          *
          * @property meshes
          * @type WeakMap
          * @private
          */

     				_this.meshes = new WeakMap();

     				/**
          * The terrain material.
          *
          * @property material
          * @type MeshTriplanarPhysicalMaterial
          */

     				_this.material = new MeshTriplanarPhysicalMaterial();

     				return _this;
     		}

     		/**
        * Lifts the connection of a given chunk to its mesh and removes the geometry.
        *
        * @method unlinkMesh
        * @private
        * @param {Chunk} chunk - A volume chunk.
        */

     		createClass(Terrain, [{
     				key: "unlinkMesh",
     				value: function unlinkMesh(chunk) {

     						var mesh = void 0;

     						if (this.meshes.has(chunk)) {

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

     		}, {
     				key: "handleEvent",
     				value: function handleEvent(event) {

     						var worker = event.worker;
     						var data = event.data;

     						// Find the chunk that has been processed by this worker.
     						var chunk = this.chunks.get(worker);

     						this.neutered.delete(chunk);
     						this.chunks.delete(worker);

     						// Reclaim ownership of the chunk data.
     						chunk.deserialise(data.chunk);

     						if (chunk.data === null && chunk.csg === null) {

     								// The chunk has become empty. Remove it.
     								this.scheduler.cancel(chunk);
     								this.volume.prune(chunk);
     								this.unlinkMesh(chunk);
     						} else if (chunk.csg !== null) {

     								// Drain the CSG queue as fast as possible.
     								this.scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, this.scheduler.maxPriority));
     						}

     						if (data.action !== Action.CLOSE) {

     								if (data.action === Action.EXTRACT) {

     										event = EXTRACTION_END;

     										this.consolidate(chunk, data);
     								} else {

     										event = MODIFICATION_END;
     								}

     								event.chunk = chunk;

     								this.dispatchEvent(event);
     						} else {

     								window.alert(data.error);
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

     		}, {
     				key: "consolidate",
     				value: function consolidate(chunk, data) {

     						var positions = data.positions;
     						var normals = data.normals;
     						var indices = data.indices;

     						var geometry = void 0,
     						    mesh = void 0;

     						// Only create a new mesh if the worker generated data.
     						if (positions !== null && normals !== null && indices !== null) {

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

     		}, {
     				key: "runNextTask",
     				value: function runNextTask() {

     						var task = void 0,
     						    worker = void 0,
     						    chunk = void 0,
     						    event = void 0;

     						if (this.scheduler.peek() !== null) {

     								worker = this.threadPool.getWorker();

     								if (worker !== null) {

     										task = this.scheduler.poll();
     										chunk = task.chunk;

     										if (task.action === Action.MODIFY) {

     												event = MODIFICATION_START;

     												worker.postMessage({

     														action: task.action,
     														chunk: chunk.serialise(),
     														sdf: chunk.csg.poll().serialise()

     												}, chunk.createTransferList());

     												if (chunk.csg.size === 0) {

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

     		}, {
     				key: "edit",
     				value: function edit(sdf) {

     						var chunks = this.volume.edit(sdf);

     						var chunk = void 0;

     						var _iteratorNormalCompletion = true;
     						var _didIteratorError = false;
     						var _iteratorError = undefined;

     						try {
     								for (var _iterator = chunks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
     										chunk = _step.value;


     										if (chunk.csg === null) {

     												chunk.csg = new Queue();
     										}

     										chunk.csg.add(sdf);
     								}
     						} catch (err) {
     								_didIteratorError = true;
     								_iteratorError = err;
     						} finally {
     								try {
     										if (!_iteratorNormalCompletion && _iterator.return) {
     												_iterator.return();
     										}
     								} finally {
     										if (_didIteratorError) {
     												throw _iteratorError;
     										}
     								}
     						}

     						this.iterator.reset();
     						this.history.push(sdf);
     				}

     				/**
          * Executes the given SDF and adds the generated data to the volume.
          *
          * @method union
          * @param {SignedDistanceFunction} sdf - An SDF.
          */

     		}, {
     				key: "union",
     				value: function union(sdf) {

     						sdf.operation = OperationType.UNION;

     						this.edit(sdf);
     				}

     				/**
          * Executes the given SDF and subtracts the generated data from the volume.
          *
          * @method subtract
          * @param {SignedDistanceFunction} sdf - An SDF.
          */

     		}, {
     				key: "subtract",
     				value: function subtract(sdf) {

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

     		}, {
     				key: "intersect",
     				value: function intersect(sdf) {

     						sdf.operation = OperationType.INTERSECTION;

     						this.edit(sdf);
     				}

     				/**
          * Updates the terrain geometry. This method should be called each frame.
          *
          * @method update
          * @param {PerspectiveCamera} camera - A camera.
          */

     		}, {
     				key: "update",
     				value: function update(camera) {

     						var iterator = this.iterator;
     						var scheduler = this.scheduler;
     						var maxPriority = scheduler.maxPriority;
     						var levels = this.levels;
     						var maxLevel = levels - 1;

     						var i = this.iterations;

     						var chunk = void 0,
     						    data = void 0,
     						    csg = void 0,
     						    task = void 0;
     						var distance = void 0,
     						    lod = void 0;
     						var result = void 0;

     						iterator.region.setFromMatrix(MATRIX4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

     						result = iterator.next();

     						while (!result.done) {

     								chunk = result.value;
     								data = chunk.data;
     								csg = chunk.csg;

     								if (!this.neutered.has(chunk)) {

     										task = scheduler.getTask(chunk);

     										if (task === undefined || task.priority < maxPriority) {

     												// Modifications take precedence.
     												if (csg !== null) {

     														scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, maxPriority));

     														this.runNextTask();
     												} else if (data !== null && !data.full) {

     														distance = BOX3.copy(chunk).distanceToPoint(camera.position);
     														lod = Math.min(maxLevel, Math.trunc(distance / camera.far * levels));

     														if (data.lod !== lod) {

     																data.lod = lod;

     																scheduler.schedule(chunk, new WorkerTask(Action.EXTRACT, chunk, maxLevel - data.lod));

     																this.runNextTask();
     														}
     												}
     										}
     								}

     								if (--i > 0) {

     										result = iterator.next();
     								} else {

     										break;
     								}
     						}

     						if (result.done) {

     								this.iterator.reset();
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

     		}, {
     				key: "raycast",
     				value: function raycast(raycaster) {

     						var meshes = this.meshes;
     						var chunks = [];

     						var intersects = [];
     						var chunk = void 0;

     						var i = void 0,
     						    l = void 0;

     						this.volume.raycast(raycaster, chunks);

     						for (i = 0, l = chunks.length; i < l; ++i) {

     								chunk = chunks[i];

     								if (meshes.has(chunk)) {

     										intersects = intersects.concat(raycaster.intersectObject(meshes.get(chunk)));
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

     		}, {
     				key: "clearMeshes",
     				value: function clearMeshes() {

     						var object = this.object;

     						var child = void 0;

     						while (object.children.length > 0) {

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

     		}, {
     				key: "clear",
     				value: function clear() {

     						this.clearMeshes();

     						this.volume = new Volume(this.volume.chunkSize, this.volume.resolution);
     						this.iterator = this.volume.leaves(new three.Frustum());

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

     		}, {
     				key: "dispose",
     				value: function dispose() {

     						this.clearMeshes();
     						this.threadPool.dispose();
     				}

     				/**
          * Saves a description of the current volume data.
          *
          * @method save
          * @return {String} A URL to the exported save data, or null if there is no data.
          */

     		}, {
     				key: "save",
     				value: function save() {

     						var sdf = this.history.combine();

     						return sdf === null ? null : URL.createObjectURL(new Blob([JSON.stringify(sdf.serialise())], {
     								type: "text/json"
     						}));
     				}

     				/**
          * Loads a volume.
          *
          * @method load
          * @param {String} data - The volume description to load.
          */

     		}, {
     				key: "load",
     				value: function load(data) {

     						this.clear();

     						this.edit(Reviver.reviveSDF(JSON.parse(data)));
     				}
     		}]);
     		return Terrain;
     }(EventTarget);

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
      * An isovalue bias for the Zero Crossing approximation.
      *
      * @property BIAS
      * @type Number
      * @private
      * @static
      * @final
      */

     var BIAS = 1e-2;

     /**
      * An error threshold for the Zero Crossing approximation.
      *
      * @property THRESHOLD
      * @type Number
      * @private
      * @static
      * @final
      */

     var THRESHOLD = 1e-6;

     /**
      * A vector.
      *
      * @property AB
      * @type Vector3
      * @private
      * @static
      * @final
      */

     var AB = new Vector3$2();

     /**
      * A point.
      *
      * @property P
      * @type Vector3
      * @private
      * @static
      * @final
      */

     var P = new Vector3$2();

     /**
      * A vector.
      *
      * @property V
      * @type Vector3
      * @private
      * @static
      * @final
      */

     var V = new Vector3$2();

     /**
      * An edge.
      *
      * @class Edge
      * @submodule volume
      * @constructor
      * @param {Vector3} a - A starting point.
      * @param {Vector3} b - An ending point.
      */

     var Edge = function () {
     		function Edge() {
     				var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$2();
     				var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$2();
     				classCallCheck(this, Edge);


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

     		createClass(Edge, [{
     				key: "approximateZeroCrossing",
     				value: function approximateZeroCrossing(sdf) {
     						var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;


     						var s = Math.max(1, steps - 1);

     						var a = 0.0;
     						var b = 1.0;
     						var c = 0.0;
     						var i = 0;

     						var densityA = void 0,
     						    densityC = void 0;

     						// Compute the vector from a to b.
     						AB.subVectors(this.b, this.a);

     						// Use bisection to find the root of the SDF.
     						while (i <= s) {

     								c = (a + b) / 2;

     								P.addVectors(this.a, V.copy(AB).multiplyScalar(c));
     								densityC = sdf.sample(P);

     								if (Math.abs(densityC) <= BIAS || (b - a) / 2 <= THRESHOLD) {

     										// Solution found.
     										break;
     								} else {

     										P.addVectors(this.a, V.copy(AB).multiplyScalar(a));
     										densityA = sdf.sample(P);

     										if (Math.sign(densityC) === Math.sign(densityA)) {

     												a = c;
     										} else {

     												b = c;
     										}
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

     		}, {
     				key: "computeZeroCrossingPosition",
     				value: function computeZeroCrossingPosition() {

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

     		}, {
     				key: "computeSurfaceNormal",
     				value: function computeSurfaceNormal(sdf) {

     						var position = this.computeZeroCrossingPosition();
     						var E = 1e-3;

     						var dx = sdf.sample(P.addVectors(position, V.set(E, 0, 0))) - sdf.sample(P.subVectors(position, V.set(E, 0, 0)));
     						var dy = sdf.sample(P.addVectors(position, V.set(0, E, 0))) - sdf.sample(P.subVectors(position, V.set(0, E, 0)));
     						var dz = sdf.sample(P.addVectors(position, V.set(0, 0, E))) - sdf.sample(P.subVectors(position, V.set(0, 0, E)));

     						this.n.set(dx, dy, dz).normalize();
     				}
     		}]);
     		return Edge;
     }();

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

     var ChunkHelper = function (_Object3D) {
     		inherits(ChunkHelper, _Object3D);

     		function ChunkHelper() {
     				var chunk = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
     				var useMaterialIndices = arguments[1];
     				var useEdgeData = arguments[2];
     				classCallCheck(this, ChunkHelper);

     				var _this = possibleConstructorReturn(this, (ChunkHelper.__proto__ || Object.getPrototypeOf(ChunkHelper)).call(this));

     				_this.name = "ChunkHelper";

     				/**
          * The volume data chunk.
          *
          * @property chunk
          * @type Chunk
          */

     				_this.chunk = chunk;

     				// Create groups for grid points, edges and normals.
     				_this.add(new three.Object3D());
     				_this.add(new three.Object3D());
     				_this.add(new three.Object3D());

     				_this.gridPoints.name = "GridPoints";
     				_this.edges.name = "Edges";
     				_this.normals.name = "Normals";

     				_this.update(useMaterialIndices, useEdgeData);

     				return _this;
     		}

     		/**
        * The grid points.
        *
        * @property gridPoints
        * @type Object3D
        */

     		createClass(ChunkHelper, [{
     				key: "update",


     				/**
          * Creates the helper geometry.
          *
          * @method update
          * @param {Boolean} [useMaterialIndices=false] - Whether points should be created for solid material indices.
          * @param {Boolean} [useEdgeData=true] - Whether edges with intersection points and normals should be created.
          */

     				value: function update() {
     						var useMaterialIndices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
     						var useEdgeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


     						var chunk = this.chunk;

     						// Remove existing geometry.
     						this.dispose();

     						if (chunk !== null && chunk.data !== null) {

     								chunk.data.decompress();

     								if (useMaterialIndices) {
     										this.createPoints(chunk);
     								}
     								if (useEdgeData) {
     										this.createEdges(chunk);
     								}

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

     		}, {
     				key: "createPoints",
     				value: function createPoints(chunk) {

     						var s = chunk.size;
     						var n = chunk.resolution;

     						var materialIndices = chunk.data.materialIndices;

     						var base = chunk.min;
     						var offset = new three.Vector3();
     						var position = new three.Vector3();

     						var color = new Float32Array([0.0, 0.0, 0.0]);

     						var pointsMaterial = new three.PointsMaterial({
     								vertexColors: three.VertexColors,
     								sizeAttenuation: false,
     								size: 3
     						});

     						var geometry = new three.BufferGeometry();

     						var vertexCount = chunk.data.materials;
     						var positions = new Float32Array(vertexCount * 3);
     						var colors = new Float32Array(vertexCount * 3);

     						var x = void 0,
     						    y = void 0,
     						    z = void 0;
     						var i = void 0,
     						    j = void 0;

     						for (i = 0, j = 0, z = 0; z <= n; ++z) {

     								offset.z = z * s / n;

     								for (y = 0; y <= n; ++y) {

     										offset.y = y * s / n;

     										for (x = 0; x <= n; ++x) {

     												offset.x = x * s / n;

     												if (materialIndices[i++] !== Material.AIR) {

     														position.addVectors(base, offset);

     														positions[j] = position.x;colors[j++] = color[0];
     														positions[j] = position.y;colors[j++] = color[1];
     														positions[j] = position.z;colors[j++] = color[2];
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
          * @method createEdges
          * @private
          * @param {Chunk} chunk - A volume data chunk.
          */

     		}, {
     				key: "createEdges",
     				value: function createEdges(chunk) {

     						var s = chunk.size;
     						var n = chunk.resolution;
     						var m = n + 1;
     						var mm = m * m;

     						var edgeData = chunk.data.edgeData;

     						var base = chunk.min;
     						var offsetA = new three.Vector3();
     						var offsetB = new three.Vector3();
     						var normalA = new three.Vector3();
     						var normalB = new three.Vector3();
     						var edge = new Edge();

     						var axisColors = [new Float32Array([0.6, 0.0, 0.0]), new Float32Array([0.0, 0.6, 0.0]), new Float32Array([0.0, 0.0, 0.6])];

     						var normalColor = new Float32Array([0.0, 1.0, 1.0]);

     						var lineSegmentsMaterial = new three.LineBasicMaterial({
     								vertexColors: three.VertexColors
     						});

     						var edges = void 0,
     						    zeroCrossings = void 0,
     						    normals = void 0;

     						var edgePositions = void 0,
     						    edgeColors = void 0;
     						var normalPositions = void 0,
     						    normalColors = void 0;
     						var vertexCount = void 0,
     						    edgeColor = void 0,
     						    geometry = void 0;
     						var axis = void 0,
     						    index = void 0;

     						var d = void 0,
     						    a = void 0,
     						    i = void 0,
     						    j = void 0,
     						    k = void 0,
     						    l = void 0;
     						var x = void 0,
     						    y = void 0,
     						    z = void 0;

     						for (a = 4, d = 0; d < 3; ++d, a >>= 1) {

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

     								for (i = 0, j = 0, k = 0, l = edges.length; i < l; ++i) {

     										index = edges[i];

     										x = index % m;
     										y = Math.trunc(index % mm / m);
     										z = Math.trunc(index / mm);

     										offsetA.set(x * s / n, y * s / n, z * s / n);

     										offsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);

     										// Edge.
     										edge.a.addVectors(base, offsetA);
     										edge.b.addVectors(base, offsetB);

     										edgePositions[j] = edge.a.x;edgeColors[j++] = edgeColor[0];
     										edgePositions[j] = edge.a.y;edgeColors[j++] = edgeColor[1];
     										edgePositions[j] = edge.a.z;edgeColors[j++] = edgeColor[2];

     										edgePositions[j] = edge.b.x;edgeColors[j++] = edgeColor[0];
     										edgePositions[j] = edge.b.y;edgeColors[j++] = edgeColor[1];
     										edgePositions[j] = edge.b.z;edgeColors[j++] = edgeColor[2];

     										// Normal at Zero Crossing.
     										edge.t = zeroCrossings[i];
     										edge.n.fromArray(normals, i * 3);

     										normalA.copy(edge.computeZeroCrossingPosition());
     										normalB.copy(normalA).addScaledVector(edge.n, 0.25 * s / n);

     										normalPositions[k] = normalA.x;normalColors[k++] = normalColor[0];
     										normalPositions[k] = normalA.y;normalColors[k++] = normalColor[1];
     										normalPositions[k] = normalA.z;normalColors[k++] = normalColor[2];

     										normalPositions[k] = normalB.x;normalColors[k++] = normalColor[0];
     										normalPositions[k] = normalB.y;normalColors[k++] = normalColor[1];
     										normalPositions[k] = normalB.z;normalColors[k++] = normalColor[2];
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
          * Destroys the current helper geometry.
          *
          * @method dispose
          */

     		}, {
     				key: "dispose",
     				value: function dispose() {

     						var child = void 0,
     						    children = void 0;
     						var i = void 0,
     						    j = void 0,
     						    il = void 0,
     						    jl = void 0;

     						for (i = 0, il = this.children.length; i < il; ++i) {

     								child = this.children[i];
     								children = child.children;

     								for (j = 0, jl = children.length; j < jl; ++j) {

     										children[j].geometry.dispose();
     										children[j].material.dispose();
     								}

     								while (children.length > 0) {

     										child.remove(children[0]);
     								}
     						}
     				}
     		}, {
     				key: "gridPoints",
     				get: function get$$1() {
     						return this.children[0];
     				}

     				/**
          * The edges.
          *
          * @property edges
          * @type Object3D
          */

     		}, {
     				key: "edges",
     				get: function get$$1() {
     						return this.children[1];
     				}

     				/**
          * The normals.
          *
          * @property normals
          * @type Object3D
          */

     		}, {
     				key: "normals",
     				get: function get$$1() {
     						return this.children[2];
     				}
     		}]);
     		return ChunkHelper;
     }(three.Object3D);

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

     var SymmetricMatrix3 = function () {
     	function SymmetricMatrix3() {
     		classCallCheck(this, SymmetricMatrix3);


     		/**
        * The matrix elements.
        *
        * @property elements
        * @type Float32Array
        */

     		this.elements = new Float32Array([1, 0, 0, 1, 0, 1]);
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

     	createClass(SymmetricMatrix3, [{
     		key: "set",
     		value: function set$$1(m00, m01, m02, m11, m12, m22) {

     			var e = this.elements;

     			e[0] = m00;e[1] = m01;e[2] = m02;
     			e[3] = m11;e[4] = m12;
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

     	}, {
     		key: "identity",
     		value: function identity() {

     			this.set(1, 0, 0, 1, 0, 1);

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

     	}, {
     		key: "copy",
     		value: function copy(m) {

     			var me = m.elements;

     			this.set(me[0], me[1], me[2], me[3], me[4], me[5]);

     			return this;
     		}

     		/**
        * Clones this matrix.
        *
        * @method clone
        * @return {SymmetricMatrix3} A clone of this matrix.
        */

     	}, {
     		key: "clone",
     		value: function clone() {

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

     	}, {
     		key: "add",
     		value: function add(m) {

     			var te = this.elements;
     			var me = m.elements;

     			te[0] += me[0];te[1] += me[1];te[2] += me[2];
     			te[3] += me[3];te[4] += me[4];
     			te[5] += me[5];

     			return this;
     		}

     		/**
        * Calculates the Frobenius norm of this matrix.
        *
        * @method norm
        * @return {Number} The norm of this matrix.
        */

     	}, {
     		key: "norm",
     		value: function norm() {

     			var e = this.elements;

     			var m01m01 = e[1] * e[1];
     			var m02m02 = e[2] * e[2];
     			var m12m12 = e[4] * e[4];

     			return Math.sqrt(e[0] * e[0] + m01m01 + m02m02 + m01m01 + e[3] * e[3] + m12m12 + m02m02 + m12m12 + e[5] * e[5]);
     		}

     		/**
        * Calculates the absolute sum of all matrix components except for the main
        * diagonal.
        *
        * @method off
        * @return {Number} The offset of this matrix.
        */

     	}, {
     		key: "off",
     		value: function off() {

     			var e = this.elements;

     			return Math.sqrt(2 * (

     			// Diagonal = [0, 3, 5].
     			e[1] * e[1] + e[2] * e[2] + e[4] * e[4]));
     		}

     		/**
        * Applies this symmetric matrix to a vector.
        *
        * @method applyToVector3
        * @param {Vector3} v - The vector to modify.
        * @return {Vector3} The modified vector.
        */

     	}, {
     		key: "applyToVector3",
     		value: function applyToVector3(v) {

     			var x = v.x,
     			    y = v.y,
     			    z = v.z;
     			var e = this.elements;

     			v.x = e[0] * x + e[1] * y + e[2] * z;
     			v.y = e[1] * x + e[3] * y + e[4] * z;
     			v.z = e[2] * x + e[4] * y + e[5] * z;

     			return v;
     		}
     	}]);
     	return SymmetricMatrix3;
     }();

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

     var Matrix3 = function () {
     	function Matrix3() {
     		classCallCheck(this, Matrix3);


     		/**
        * The matrix elements.
        *
        * @property elements
        * @type Float32Array
        */

     		this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
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

     	createClass(Matrix3, [{
     		key: "set",
     		value: function set$$1(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

     			var te = this.elements;

     			te[0] = m00;te[3] = m01;te[6] = m02;
     			te[1] = m10;te[4] = m11;te[7] = m12;
     			te[2] = m20;te[5] = m21;te[8] = m22;

     			return this;
     		}

     		/**
        * Sets this matrix to the identity matrix.
        *
        * @method identity
        * @chainable
        * @return {Matrix3} This matrix.
        */

     	}, {
     		key: "identity",
     		value: function identity() {

     			this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);

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

     	}, {
     		key: "copy",
     		value: function copy(m) {

     			var me = m.elements;

     			return this.set(me[0], me[3], me[6], me[1], me[4], me[7], me[2], me[5], me[8]);
     		}

     		/**
        * Clones this matrix.
        *
        * @method clone
        * @return {Matrix3} A clone of this matrix.
        */

     	}, {
     		key: "clone",
     		value: function clone() {

     			return new this.constructor().copy(this);
     		}
     	}]);
     	return Matrix3;
     }();

     /**
      * A collection of matrix rotation utilities.
      *
      * @class Givens
      * @submodule math
      * @static
      */

     var Givens = function () {
     		function Givens() {
     				classCallCheck(this, Givens);
     		}

     		createClass(Givens, null, [{
     				key: "rot01Post",


     				/**
          * Rotates the given matrix.
          *
          * @method rot01Post
          * @static
          * @param {Matrix3} m - The target vector.
          * @param {Object} coefficients - Two coefficients.
          */

     				value: function rot01Post(m, coefficients) {

     						var e = m.elements;

     						var m00 = e[0],
     						    m01 = e[3];
     						var m10 = e[1],
     						    m11 = e[4];
     						var m20 = e[2],
     						    m21 = e[5];

     						var c = coefficients.c;
     						var s = coefficients.s;

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

     		}, {
     				key: "rot02Post",
     				value: function rot02Post(m, coefficients) {

     						var e = m.elements;

     						var m00 = e[0],
     						    m02 = e[6];
     						var m10 = e[1],
     						    m12 = e[7];
     						var m20 = e[2],
     						    m22 = e[8];

     						var c = coefficients.c;
     						var s = coefficients.s;

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

     		}, {
     				key: "rot12Post",
     				value: function rot12Post(m, coefficients) {

     						var e = m.elements;

     						var m01 = e[3],
     						    m02 = e[6];
     						var m11 = e[4],
     						    m12 = e[7];
     						var m21 = e[5],
     						    m22 = e[8];

     						var c = coefficients.c;
     						var s = coefficients.s;

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
     		}]);
     		return Givens;
     }();

     /**
      * Symmetric Givens coefficients.
      *
      * @property coefficients
      * @type Object
      * @private
      * @static
      */

     var coefficients = {
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

     		var tau = void 0,
     		    stt = void 0,
     		    tan = void 0;

     		if (aPQ === 0) {

     				coefficients.c = 1;
     				coefficients.s = 0;
     		} else {

     				tau = (aQQ - aPP) / (2.0 * aPQ);
     				stt = Math.sqrt(1.0 + tau * tau);
     				tan = 1.0 / (tau >= 0.0 ? tau + stt : tau - stt);

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

     var Schur = function () {
     		function Schur() {
     				classCallCheck(this, Schur);
     		}

     		createClass(Schur, null, [{
     				key: "rot01",


     				/**
          * Rotates the given matrix.
          *
          * @method rot01
          * @static
          * @param {SymmetricMatrix3} m - A symmetric matrix.
          * @return {Object} The coefficients.
          */

     				value: function rot01(m) {

     						var e = m.elements;

     						var m00 = e[0],
     						    m01 = e[1],
     						    m02 = e[2];
     						var m11 = e[3],
     						    m12 = e[4];

     						calculateSymmetricCoefficients(m00, m01, m11);

     						var c = coefficients.c,
     						    s = coefficients.s;
     						var cc = c * c,
     						    ss = s * s;

     						var mix = 2.0 * c * s * m01;

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

     		}, {
     				key: "rot02",
     				value: function rot02(m) {

     						var e = m.elements;

     						var m00 = e[0],
     						    m01 = e[1],
     						    m02 = e[2];
     						var m12 = e[4];
     						var m22 = e[5];

     						calculateSymmetricCoefficients(m00, m02, m22);

     						var c = coefficients.c,
     						    s = coefficients.s;
     						var cc = c * c,
     						    ss = s * s;

     						var mix = 2.0 * c * s * m02;

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

     		}, {
     				key: "rot12",
     				value: function rot12(m) {

     						var e = m.elements;

     						var m01 = e[1],
     						    m02 = e[2];
     						var m11 = e[3],
     						    m12 = e[4];
     						var m22 = e[5];

     						calculateSymmetricCoefficients(m11, m12, m22);

     						var c = coefficients.c,
     						    s = coefficients.s;
     						var cc = c * c,
     						    ss = s * s;

     						var mix = 2.0 * c * s * m12;

     						// e[0] = m00;
     						e[1] = c * m01 - s * m02;
     						e[2] = s * m01 + c * m02;

     						e[3] = cc * m11 - mix + ss * m22;
     						e[4] = 0;

     						e[5] = ss * m11 + mix + cc * m22;

     						return coefficients;
     				}
     		}]);
     		return Schur;
     }();

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

     	var m01 = vtav.elements[1];

     	if (m01 !== 0) {

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

     	var m02 = vtav.elements[2];

     	if (m02 !== 0) {

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

     	var m12 = vtav.elements[4];

     	if (m12 !== 0) {

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

     	var delta = threshold * vtav.copy(a).norm();

     	var i = void 0;

     	for (i = 0; i < maxSweeps && vtav.off() > delta; ++i) {

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

     	var invX = 1.0 / x;

     	return Math.abs(x) < threshold || Math.abs(invX) < threshold ? 0.0 : invX;
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

     	var te = t.elements;
     	var ae = a.elements;
     	var be = b.elements;

     	var a00 = ae[0];
     	var a11 = ae[3];
     	var a22 = ae[5];

     	var a0 = pinv(a00, threshold);
     	var a1 = pinv(a11, threshold);
     	var a2 = pinv(a22, threshold);

     	// Count how many singular values have been truncated.
     	var truncatedValues = (a0 === 0.0) + (a1 === 0.0) + (a2 === 0.0);

     	// Compute the feature dimension.
     	var dimension = 3 - truncatedValues;

     	var b00 = be[0],
     	    b01 = be[3],
     	    b02 = be[6];
     	var b10 = be[1],
     	    b11 = be[4],
     	    b12 = be[7];
     	var b20 = be[2],
     	    b21 = be[5],
     	    b22 = be[8];

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

     var SingularValueDecomposition = function () {
     	function SingularValueDecomposition() {
     		classCallCheck(this, SingularValueDecomposition);
     	}

     	createClass(SingularValueDecomposition, null, [{
     		key: "solveSymmetric",


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

     		value: function solveSymmetric(a, b, x, svdThreshold, svdSweeps, pseudoInverseThreshold) {

     			var v = new Matrix3();

     			var pinv = new Matrix3();
     			var vtav = new SymmetricMatrix3();

     			var dimension = void 0;

     			pinv.set(0, 0, 0, 0, 0, 0, 0, 0, 0);

     			vtav.set(0, 0, 0, 0, 0, 0);

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

     	}, {
     		key: "calculateError",
     		value: function calculateError(t, b, x) {

     			var e = t.elements;
     			var v = x.clone();
     			var a = new Matrix3();

     			// Set symmetrically.
     			a.set(e[0], e[1], e[2], e[1], e[3], e[4], e[2], e[4], e[5]);

     			v.applyMatrix3(a);
     			v.subVectors(b, v);

     			return v.lengthSq();
     		}
     	}]);
     	return SingularValueDecomposition;
     }();

     /**
      * A vector with two components.
      *
      * @class Vector2
      * @submodule math
      * @constructor
      * @param {Number} [x=0] - The x value.
      * @param {Number} [y=0] - The y value.
      */

     var Vector2 = function () {
     	function Vector2() {
     		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
     		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
     		classCallCheck(this, Vector2);


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
     	}

     	/**
       * Sets the values of this vector
       *
       * @method set
       * @chainable
       * @param {Number} x - The x value.
       * @param {Number} y - The y value.
       * @return {Vector2} This vector.
       */

     	createClass(Vector2, [{
     		key: "set",
     		value: function set$$1(x, y) {

     			this.x = x;
     			this.y = y;

     			return this;
     		}

     		/**
        * Copies the values of another vector.
        *
        * @method copy
        * @chainable
        * @param {Vector2} v - A vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "copy",
     		value: function copy(v) {

     			this.x = v.x;
     			this.y = v.y;

     			return this;
     		}

     		/**
        * Copies values from an array.
        *
        * @method fromArray
        * @chainable
        * @param {Array} array - An array.
        * @param {Number} offset - An offset.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "fromArray",
     		value: function fromArray(array) {
     			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


     			this.x = array[offset];
     			this.y = array[offset + 1];

     			return this;
     		}

     		/**
        * Stores this vector in an array.
        *
        * @method toArray
        * @param {Array} [array] - A target array.
        * @param {Number} offset - An offset.
        * @return {Vector2} The array.
        */

     	}, {
     		key: "toArray",
     		value: function toArray$$1() {
     			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
     			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


     			array[offset] = this.x;
     			array[offset + 1] = this.y;

     			return array;
     		}

     		/**
        * Checks if this vector equals the given one.
        *
        * @method equals
        * @param {Vector2} v - A vector.
        * @return {Boolean} Whether this vector equals the given one.
        */

     	}, {
     		key: "equals",
     		value: function equals(v) {

     			return v.x === this.x && v.y === this.y;
     		}

     		/**
        * Clones this vector.
        *
        * @method clone
        * @return {Vector2} A clone of this vector.
        */

     	}, {
     		key: "clone",
     		value: function clone() {

     			return new this.constructor(this.x, this.y);
     		}

     		/**
        * Adds a vector to this one.
        *
        * @method add
        * @chainable
        * @param {Vector2} v - The vector to add.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "add",
     		value: function add(v) {

     			this.x += v.x;
     			this.y += v.y;

     			return this;
     		}

     		/**
        * Adds a scaled vector to this one.
        *
        * @method addScaledVector
        * @chainable
        * @param {Vector2} v - The vector to scale and add.
        * @param {Number} s - A scalar.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "addScaledVector",
     		value: function addScaledVector(v, s) {

     			this.x += v.x * s;
     			this.y += v.y * s;

     			return this;
     		}

     		/**
        * Adds a scalar to this vector.
        *
        * @method addScalar
        * @chainable
        * @param {Number} s - The scalar to add.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "addScalar",
     		value: function addScalar(s) {

     			this.x += s;
     			this.y += s;

     			return this;
     		}

     		/**
        * Sets this vector to the sum of two given vectors.
        *
        * @method addVectors
        * @chainable
        * @param {Vector2} a - A vector.
        * @param {Vector2} b - Another vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "addVectors",
     		value: function addVectors(a, b) {

     			this.x = a.x + b.x;
     			this.y = a.y + b.y;

     			return this;
     		}

     		/**
        * Subtracts a vector from this vector.
        *
        * @method sub
        * @chainable
        * @param {Vector2} v - The vector to subtract.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "sub",
     		value: function sub(v) {

     			this.x -= v.x;
     			this.y -= v.y;

     			return this;
     		}

     		/**
        * Subtracts a scalar to this vector.
        *
        * @method subScalar
        * @chainable
        * @param {Number} s - The scalar to subtract.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "subScalar",
     		value: function subScalar(s) {

     			this.x -= s;
     			this.y -= s;

     			return this;
     		}

     		/**
        * Sets this vector to the difference between two given vectors.
        *
        * @method subVectors
        * @chainable
        * @param {Vector2} a - A vector.
        * @param {Vector2} b - A second vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "subVectors",
     		value: function subVectors(a, b) {

     			this.x = a.x - b.x;
     			this.y = a.y - b.y;

     			return this;
     		}

     		/**
        * Multiplies this vector with another vector.
        *
        * @method multiply
        * @chainable
        * @param {Vector2} v - A vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "multiply",
     		value: function multiply(v) {

     			this.x *= v.x;
     			this.y *= v.y;

     			return this;
     		}

     		/**
        * Multiplies this vector with a given scalar.
        *
        * @method multiplyScalar
        * @chainable
        * @param {Number} s - A scalar.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "multiplyScalar",
     		value: function multiplyScalar(s) {

     			if (isFinite(s)) {

     				this.x *= s;
     				this.y *= s;
     			} else {

     				this.x = 0;
     				this.y = 0;
     			}

     			return this;
     		}

     		/**
        * Sets this vector to the product of two given vectors.
        *
        * @method multiplyVectors
        * @chainable
        * @param {Vector2} a - A vector.
        * @param {Vector2} b - Another vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "multiplyVectors",
     		value: function multiplyVectors(a, b) {

     			this.x = a.x * b.x;
     			this.y = a.y * b.y;

     			return this;
     		}

     		/**
        * Divides this vector by another vector.
        *
        * @method divide
        * @chainable
        * @param {Vector2} v - A vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "divide",
     		value: function divide(v) {

     			this.x /= v.x;
     			this.y /= v.y;

     			return this;
     		}

     		/**
        * Divides this vector by a given scalar.
        *
        * @method divideScalar
        * @chainable
        * @param {Number} s - A scalar.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "divideScalar",
     		value: function divideScalar(s) {

     			return this.multiplyScalar(1 / s);
     		}

     		/**
        * Sets this vector to the quotient of two given vectors.
        *
        * @method divideVectors
        * @chainable
        * @param {Vector2} a - A vector.
        * @param {Vector2} b - Another vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "divideVectors",
     		value: function divideVectors(a, b) {

     			this.x = a.x / b.x;
     			this.y = a.y / b.y;

     			return this;
     		}

     		/**
        * Negates this vector.
        *
        * @method negate
        * @chainable
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "negate",
     		value: function negate() {

     			this.x = -this.x;
     			this.y = -this.y;

     			return this;
     		}

     		/**
        * Calculates the dot product with another vector.
        *
        * @method dot
        * @param {Vector2} v - A vector.
        * @return {Number} The dot product.
        */

     	}, {
     		key: "dot",
     		value: function dot(v) {

     			return this.x * v.x + this.y * v.y;
     		}

     		/**
        * Calculates the squared length of this vector.
        *
        * @method lengthSq
        * @return {Number} The squared length.
        */

     	}, {
     		key: "lengthSq",
     		value: function lengthSq() {

     			return this.x * this.x + this.y * this.y;
     		}

     		/**
        * Calculates the length of this vector.
        *
        * @method length
        * @return {Number} The length.
        */

     	}, {
     		key: "length",
     		value: function length() {

     			return Math.sqrt(this.x * this.x + this.y * this.y);
     		}

     		/**
        * Calculates the distance to a given vector.
        *
        * @method distanceTo
        * @param {Vector2} v - A vector.
        * @return {Number} The distance.
        */

     	}, {
     		key: "distanceTo",
     		value: function distanceTo(v) {

     			return Math.sqrt(this.distanceToSquared(v));
     		}

     		/**
        * Calculates the squared distance to a given vector.
        *
        * @method distanceToSquared
        * @param {Vector2} v - A vector.
        * @return {Number} The squared distance.
        */

     	}, {
     		key: "distanceToSquared",
     		value: function distanceToSquared(v) {

     			var dx = this.x - v.x;
     			var dy = this.y - v.y;

     			return dx * dx + dy * dy;
     		}

     		/**
        * Normalizes this vector.
        *
        * @method normalize
        * @chainable
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "normalize",
     		value: function normalize() {

     			return this.divideScalar(this.length());
     		}

     		/**
        * Adopts the min value for each component of this vector and the given one.
        *
        * @method min
        * @chainable
        * @param {Vector2} v - A vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "min",
     		value: function min(v) {

     			this.x = Math.min(this.x, v.x);
     			this.y = Math.min(this.y, v.y);

     			return this;
     		}

     		/**
        * adopts the max value for each component of this vector and the given one.
        *
        * @method max
        * @chainable
        * @param {Vector2} v - A vector.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "max",
     		value: function max(v) {

     			this.x = Math.max(this.x, v.x);
     			this.y = Math.max(this.y, v.y);

     			return this;
     		}

     		/**
        * Clamps this vector.
        *
        * @method clamp
        * @chainable
        * @param {Vector2} min - A vector, assumed to be smaller than max.
        * @param {Vector2} max - A vector, assumed to be greater than min.
        * @return {Vector2} This vector.
        */

     	}, {
     		key: "clamp",
     		value: function clamp(min, max) {

     			this.x = Math.max(min.x, Math.min(max.x, this.x));
     			this.y = Math.max(min.y, Math.min(max.y, this.y));

     			return this;
     		}
     	}]);
     	return Vector2;
     }();

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

     var QEFSolver = function () {
     		function QEFSolver() {
     				var svdThreshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-6;
     				var svdSweeps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
     				var pseudoInverseThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;
     				classCallCheck(this, QEFSolver);


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

     		createClass(QEFSolver, [{
     				key: "computeError",
     				value: function computeError() {

     						var x = this.x;

     						var error = Infinity;
     						var atax = void 0;

     						if (this.hasSolution) {

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

     		}, {
     				key: "setData",
     				value: function setData(d) {

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

     		}, {
     				key: "solve",
     				value: function solve() {

     						var data = this.data;
     						var massPoint = this.massPoint;
     						var ata = this.ata;
     						var atb = this.atb;
     						var x = this.x;

     						var mp = void 0;

     						if (!this.hasSolution && data !== null && data.numPoints > 0) {

     								// The mass point is a sum, so divide it to make it the average.
     								massPoint.copy(data.massPoint);
     								massPoint.divideScalar(data.numPoints);

     								ata.copy(data.ata);
     								atb.copy(data.atb);

     								mp = ata.applyToVector3(massPoint.clone());
     								atb.sub(mp);

     								x.set(0, 0, 0);

     								data.massPointDimension = SingularValueDecomposition.solveSymmetric(ata, atb, x, this.svdThreshold, this.svdSweeps, this.pseudoInverseThreshold);

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

     		}, {
     				key: "clear",
     				value: function clear() {

     						this.data = null;
     						this.hasSolution = false;
     				}
     		}]);
     		return QEFSolver;
     }();

     /**
      * A data container for the QEF solver.
      *
      * @class QEFData
      * @submodule math
      * @constructor
      */

     var QEFData = function () {
     		function QEFData() {
     				classCallCheck(this, QEFData);


     				/**
          * A symmetric matrix.
          *
          * @property ata
          * @type SymmetricMatrix3
          * @private
          */

     				this.ata = new SymmetricMatrix3();

     				this.ata.set(0, 0, 0, 0, 0, 0);

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

     		createClass(QEFData, [{
     				key: "set",
     				value: function set$$1(ata, atb, btb, massPoint, numPoints) {

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

     		}, {
     				key: "copy",
     				value: function copy(d) {

     						return this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);
     				}

     				/**
          * Adds the given surface intersection point and normal.
          *
          * @method add
          * @param {Vector3} p - An intersection point.
          * @param {Vector3} n - A surface normal.
          */

     		}, {
     				key: "add",
     				value: function add(p, n) {

     						var nx = n.x;
     						var ny = n.y;
     						var nz = n.z;

     						var dot = n.dot(p);

     						var ata = this.ata.elements;
     						var atb = this.atb;

     						ata[0] += nx * nx;ata[1] += nx * ny;ata[2] += nx * nz;
     						ata[3] += ny * ny;ata[4] += ny * nz;
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

     		}, {
     				key: "addData",
     				value: function addData(d) {

     						this.ata.add(d.ata);
     						this.atb.add(d.atb);
     						this.btb += d.btb;

     						this.massPoint.add(d.massPoint);
     						this.numPoints += d.numPoints;

     						/* if(this.massPointDimension === d.massPointDimension) {
           			this.massPoint.add(d.massPoint);
           	this.numPoints += d.numPoints;
           		} else if(d.massPointDimension > this.massPointDimension) {
           			// Adopt the mass point of the higher dimension.
           	this.massPoint.copy(d.massPoint);
           	this.massPointDimension = d.massPointDimension;
           	this.numPoints = d.numPoints;
           		} */
     				}

     				/**
          * Clears this data.
          *
          * @method clear
          */

     		}, {
     				key: "clear",
     				value: function clear() {

     						this.ata.set(0, 0, 0, 0, 0, 0);

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

     		}, {
     				key: "clone",
     				value: function clone() {

     						return new this.constructor().copy(this);
     				}
     		}]);
     		return QEFData;
     }();

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

     var Voxel = function Voxel() {
     		classCallCheck(this, Voxel);


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
     };

     /**
      * A bias for boundary checks.
      *
      * @property BIAS
      * @type Number
      * @private
      * @static
      * @final
      */

     var BIAS$1 = 1e-6;

     /**
      * The base QEF error threshold.
      *
      * @property THRESHOLD
      * @type Number
      * @private
      * @static
      * @final
      */

     var THRESHOLD$1 = 1e-2;

     /**
      * A QEF error threshold for voxel clustering.
      *
      * @property threshold
      * @type Number
      * @private
      * @static
      */

     var threshold = 0.0;

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

     var VoxelCell = function (_CubicOctant) {
     	inherits(VoxelCell, _CubicOctant);

     	function VoxelCell(min, size) {
     		classCallCheck(this, VoxelCell);

     		/**
        * A voxel that contains draw information.
        *
        * @property voxel
        * @type Voxel
        * @default null
        */

     		var _this = possibleConstructorReturn(this, (VoxelCell.__proto__ || Object.getPrototypeOf(VoxelCell)).call(this, min, size));

     		_this.voxel = null;

     		return _this;
     	}

     	/**
       * The level of detail.
       *
       * @property lod
       * @type Number
       */

     	createClass(VoxelCell, [{
     		key: "contains",


     		/**
        * Checks if the given point lies inside this cell's boundaries.
        *
        * @method contains
        * @param {Vector3} p - A point.
        * @return {Boolean} Whether the given point lies inside this cell.
        */

     		value: function contains(p) {

     			var min = this.min;
     			var size = this.size;

     			return p.x >= min.x - BIAS$1 && p.y >= min.y - BIAS$1 && p.z >= min.z - BIAS$1 && p.x <= min.x + size + BIAS$1 && p.y <= min.y + size + BIAS$1 && p.z <= min.z + size + BIAS$1;
     		}

     		/**
        * Attempts to simplify this cell.
        *
        * @method collapse
        * @return {Number} The amount of removed voxels.
        */

     	}, {
     		key: "collapse",
     		value: function collapse() {

     			var children = this.children;

     			var signs = new Int16Array([-1, -1, -1, -1, -1, -1, -1, -1]);

     			var midSign = -1;
     			var collapsible = children !== null;

     			var removedVoxels = 0;

     			var qefData = void 0,
     			    qefSolver = void 0;
     			var child = void 0,
     			    sign = void 0,
     			    voxel = void 0;
     			var position = void 0;

     			var v = void 0,
     			    i = void 0;

     			if (collapsible) {

     				qefData = new QEFData();

     				for (v = 0, i = 0; i < 8; ++i) {

     					child = children[i];

     					removedVoxels += child.collapse();

     					voxel = child.voxel;

     					if (child.children !== null) {

     						// Couldn't simplify the child.
     						collapsible = false;
     					} else if (voxel !== null) {

     						qefData.addData(voxel.qefData);

     						midSign = voxel.materials >> 7 - i & 1;
     						signs[i] = voxel.materials >> i & 1;

     						++v;
     					}
     				}

     				if (collapsible) {

     					qefSolver = new QEFSolver();
     					position = qefSolver.setData(qefData).solve();

     					if (qefSolver.computeError() <= threshold) {

     						voxel = new Voxel();
     						voxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);

     						for (i = 0; i < 8; ++i) {

     							sign = signs[i];
     							child = children[i];

     							if (sign === -1) {

     								// Undetermined, use mid sign instead.
     								voxel.materials |= midSign << i;
     							} else {

     								voxel.materials |= sign << i;

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
     	}, {
     		key: "lod",
     		get: function get$$1() {
     			return threshold;
     		},
     		set: function set$$1(lod) {

     			threshold = THRESHOLD$1 + lod * lod * lod;
     		}
     	}]);
     	return VoxelCell;
     }(CubicOctant);

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

     		var m = n + 1;
     		var mm = m * m;

     		var voxel = new Voxel();

     		var materials = void 0,
     		    edgeCount = void 0;
     		var material = void 0,
     		    offset = void 0,
     		    index = void 0;
     		var c1 = void 0,
     		    c2 = void 0,
     		    m1 = void 0,
     		    m2 = void 0;

     		var i = void 0;

     		// Pack the material information of the eight corners into a single byte.
     		for (materials = 0, i = 0; i < 8; ++i) {

     				// Translate the coordinates into a one-dimensional grid point index.
     				offset = PATTERN[i];
     				index = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);

     				// Convert the identified material index into a binary value.
     				material = Math.min(materialIndices[index], Material.SOLID);

     				// Store the value in bit i.
     				materials |= material << i;
     		}

     		// Find out how many edges intersect with the implicit surface.
     		for (edgeCount = 0, i = 0; i < 12; ++i) {

     				c1 = EDGES[i][0];
     				c2 = EDGES[i][1];

     				m1 = materials >> c1 & 1;
     				m2 = materials >> c2 & 1;

     				// Check if there is a material change on the edge.
     				if (m1 !== m2) {

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

     var VoxelBlock = function (_Octree) {
     		inherits(VoxelBlock, _Octree);

     		function VoxelBlock(chunk) {
     				classCallCheck(this, VoxelBlock);

     				var _this = possibleConstructorReturn(this, (VoxelBlock.__proto__ || Object.getPrototypeOf(VoxelBlock)).call(this));

     				_this.root = new VoxelCell(chunk.min, chunk.size);
     				_this.root.lod = chunk.data.lod;

     				/**
          * The amount of voxels in this block.
          *
          * @property voxelCount
          * @type Number
          */

     				_this.voxelCount = 0;

     				// Create voxel cells from Hermite data and apply level of detail.
     				_this.construct(chunk);
     				_this.simplify();

     				return _this;
     		}

     		/**
        * Attempts to simplify the octree by clustering voxels.
        *
        * @method simplify
        * @private
        */

     		createClass(VoxelBlock, [{
     				key: "simplify",
     				value: function simplify() {

     						this.voxelCount -= this.root.collapse();
     				}

     				/**
          * Creates intermediate voxel cells down to the leaf octant that is described
          * by the given local grid coordinates and returns it.
          *
          * @method getCell
          * @private
          * @param {Number} n - The grid resolution.
          * @param {Number} x - A local grid point X-coordinate.
          * @param {Number} y - A local grid point Y-coordinate.
          * @param {Number} z - A local grid point Z-coordinate.
          * @return {VoxelCell} A leaf voxel cell.
          */

     		}, {
     				key: "getCell",
     				value: function getCell(n, x, y, z) {

     						var cell = this.root;
     						var i = 0;

     						for (n = n >> 1; n > 0; n >>= 1, i = 0) {

     								// Identify the next octant by the grid coordinates.
     								if (x >= n) {
     										i += 4;x -= n;
     								} // YZ.
     								if (y >= n) {
     										i += 2;y -= n;
     								} // XZ.
     								if (z >= n) {
     										i += 1;z -= n;
     								} // XY.

     								if (cell.children === null) {

     										cell.split();
     								}

     								cell = cell.children[i];
     						}

     						return cell;
     				}

     				/**
          * Constructs voxel cells from volume data.
          *
          * @method construct
          * @private
          * @param {Chunk} chunk - A volume chunk.
          */

     		}, {
     				key: "construct",
     				value: function construct(chunk) {

     						var s = chunk.size;
     						var n = chunk.resolution;
     						var m = n + 1;
     						var mm = m * m;

     						var data = chunk.data;
     						var edgeData = data.edgeData;
     						var materialIndices = data.materialIndices;

     						var qefSolver = new QEFSolver();

     						var base = chunk.min;
     						var offsetA = new Vector3$2();
     						var offsetB = new Vector3$2();
     						var intersection = new Vector3$2();
     						var edge = new Edge();

     						var sequences = [new Uint8Array([0, 1, 2, 3]), new Uint8Array([0, 1, 4, 5]), new Uint8Array([0, 2, 4, 6])];

     						var voxelCount = 0;

     						var edges = void 0,
     						    zeroCrossings = void 0,
     						    normals = void 0;
     						var sequence = void 0,
     						    offset = void 0;
     						var voxel = void 0,
     						    position = void 0;
     						var axis = void 0,
     						    cell = void 0;

     						var a = void 0,
     						    d = void 0,
     						    i = void 0,
     						    j = void 0,
     						    l = void 0;
     						var x2 = void 0,
     						    y2 = void 0,
     						    z2 = void 0;
     						var x = void 0,
     						    y = void 0,
     						    z = void 0;

     						var index = void 0;

     						for (a = 4, d = 0; d < 3; ++d, a >>= 1) {

     								axis = PATTERN[a];

     								edges = edgeData.edges[d];
     								zeroCrossings = edgeData.zeroCrossings[d];
     								normals = edgeData.normals[d];

     								sequence = sequences[d];

     								for (i = 0, l = edges.length; i < l; ++i) {

     										// Each edge is uniquely described by its starting grid point index.
     										index = edges[i];

     										// Calculate the local grid coordinates from the one-dimensional index.
     										x = index % m;
     										y = Math.trunc(index % mm / m);
     										z = Math.trunc(index / mm);

     										offsetA.set(x * s / n, y * s / n, z * s / n);

     										offsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);

     										edge.a.addVectors(base, offsetA);
     										edge.b.addVectors(base, offsetB);

     										edge.t = zeroCrossings[i];
     										edge.n.fromArray(normals, i * 3);

     										intersection.copy(edge.computeZeroCrossingPosition());

     										// Each edge can belong to up to four voxel cells.
     										for (j = 0; j < 4; ++j) {

     												// Rotate around the edge.
     												offset = PATTERN[sequence[j]];

     												x2 = x - offset[0];
     												y2 = y - offset[1];
     												z2 = z - offset[2];

     												// Check if the adjusted coordinates still lie inside the grid bounds.
     												if (x2 >= 0 && y2 >= 0 && z2 >= 0 && x2 < n && y2 < n && z2 < n) {

     														cell = this.getCell(n, x2, y2, z2);

     														if (cell.voxel === null) {

     																// The existence of the edge guarantees that the voxel contains the surface.
     																cell.voxel = createVoxel(n, x2, y2, z2, materialIndices);

     																++voxelCount;
     														}

     														// Add the edge data to the voxel.
     														voxel = cell.voxel;
     														voxel.normal.add(edge.n);
     														voxel.qefData.add(intersection, edge.n);

     														if (voxel.qefData.numPoints === voxel.edgeCount) {

     																// Finalise the voxel by solving the accumulated data.
     																position = qefSolver.setData(voxel.qefData).solve();

     																voxel.position.copy(cell.contains(position) ? position : qefSolver.massPoint);
     																voxel.normal.normalize();
     														}
     												}
     										}
     								}
     						}

     						this.voxelCount = voxelCount;
     				}
     		}]);
     		return VoxelBlock;
     }(Octree);

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

     	var s = chunk.size;
     	var n = chunk.resolution;

     	var min = new Vector3$2(0, 0, 0);
     	var max = new Vector3$2(n, n, n);

     	var region = new Box3$2(chunk.min, chunk.max);

     	if (operation.type !== OperationType.INTERSECTION) {

     		if (operation.boundingBox.intersectsBox(region)) {

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

     	var m = chunk.resolution + 1;
     	var mm = m * m;

     	var X = bounds.max.x;
     	var Y = bounds.max.y;
     	var Z = bounds.max.z;

     	var x = void 0,
     	    y = void 0,
     	    z = void 0;

     	for (z = bounds.min.z; z <= Z; ++z) {

     		for (y = bounds.min.y; y <= Y; ++y) {

     			for (x = bounds.min.x; x <= X; ++x) {

     				operation.updateMaterialIndex(z * mm + y * m + x, data0, data1);
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

     	var s = chunk.size;
     	var n = chunk.resolution;
     	var m = n + 1;
     	var mm = m * m;

     	var materialIndices = data.materialIndices;

     	var base = chunk.min;
     	var offset = new Vector3$2();
     	var position = new Vector3$2();

     	var X = bounds.max.x;
     	var Y = bounds.max.y;
     	var Z = bounds.max.z;

     	var materialIndex = void 0;
     	var materials = 0;

     	var x = void 0,
     	    y = void 0,
     	    z = void 0;

     	for (z = bounds.min.z; z <= Z; ++z) {

     		offset.z = z * s / n;

     		for (y = bounds.min.y; y <= Y; ++y) {

     			offset.y = y * s / n;

     			for (x = bounds.min.x; x <= X; ++x) {

     				offset.x = x * s / n;

     				materialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));

     				if (materialIndex !== Material.AIR) {

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

     	var m = chunk.resolution + 1;
     	var indexOffsets = new Uint32Array([1, m, m * m]);

     	var materialIndices = data0.materialIndices;

     	var edge1 = new Edge();
     	var edge0 = new Edge();

     	var edgeData1 = data1.edgeData;
     	var edgeData0 = data0.edgeData;
     	var edgeData = new EdgeData(chunk.resolution); // edgeData0.edges.length + edgeData1.edges.length
     	var lengths = new Uint32Array(3);

     	var edges1 = void 0,
     	    zeroCrossings1 = void 0,
     	    normals1 = void 0;
     	var edges0 = void 0,
     	    zeroCrossings0 = void 0,
     	    normals0 = void 0;
     	var edges = void 0,
     	    zeroCrossings = void 0,
     	    normals = void 0;

     	var indexA1 = void 0,
     	    indexB1 = void 0;
     	var indexA0 = void 0,
     	    indexB0 = void 0;

     	var m1 = void 0,
     	    m2 = void 0;
     	var edge = void 0;

     	var c = void 0,
     	    d = void 0,
     	    i = void 0,
     	    j = void 0,
     	    il = void 0,
     	    jl = void 0;

     	// Process the edges along the X-axis, then Y and finally Z.
     	for (c = 0, d = 0; d < 3; c = 0, ++d) {

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
     		for (i = 0, j = 0; i < il; ++i) {

     			indexA1 = edges1[i];
     			indexB1 = indexA1 + indexOffsets[d];

     			m1 = materialIndices[indexA1];
     			m2 = materialIndices[indexB1];

     			if (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

     				edge1.t = zeroCrossings1[i];
     				edge1.n.x = normals1[i * 3];
     				edge1.n.y = normals1[i * 3 + 1];
     				edge1.n.z = normals1[i * 3 + 2];

     				if (operation.type === OperationType.DIFFERENCE) {

     					edge1.n.negate();
     				}

     				edge = edge1;

     				// Process existing edges up to the generated edge.
     				while (j < jl && edges0[j] <= indexA1) {

     					indexA0 = edges0[j];
     					indexB0 = indexA0 + indexOffsets[d];

     					edge0.t = zeroCrossings0[j];
     					edge0.n.x = normals0[j * 3];
     					edge0.n.y = normals0[j * 3 + 1];
     					edge0.n.z = normals0[j * 3 + 2];

     					m1 = materialIndices[indexA0];

     					if (indexA0 < indexA1) {

     						m2 = materialIndices[indexB0];

     						if (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

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
     						edge = operation.selectEdge(edge0, edge1, m1 === Material.SOLID);
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
     		while (j < jl) {

     			indexA0 = edges0[j];
     			indexB0 = indexA0 + indexOffsets[d];

     			m1 = materialIndices[indexA0];
     			m2 = materialIndices[indexB0];

     			if (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

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

     	return { edgeData: edgeData, lengths: lengths };
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

     	var s = chunk.size;
     	var n = chunk.resolution;
     	var m = n + 1;
     	var mm = m * m;

     	var indexOffsets = new Uint32Array([1, m, mm]);
     	var materialIndices = data.materialIndices;

     	var base = chunk.min;
     	var offsetA = new Vector3$2();
     	var offsetB = new Vector3$2();
     	var edge = new Edge();

     	var edgeData = new EdgeData(n);
     	var lengths = new Uint32Array(3);

     	var edges = void 0,
     	    zeroCrossings = void 0,
     	    normals = void 0;
     	var indexA = void 0,
     	    indexB = void 0;

     	var minX = void 0,
     	    minY = void 0,
     	    minZ = void 0;
     	var maxX = void 0,
     	    maxY = void 0,
     	    maxZ = void 0;

     	var c = void 0,
     	    d = void 0,
     	    a = void 0,
     	    axis = void 0;
     	var x = void 0,
     	    y = void 0,
     	    z = void 0;

     	// Process the edges along the X-axis, then Y and finally Z.
     	for (a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {

     		// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
     		axis = PATTERN[a];

     		edges = edgeData.edges[d];
     		zeroCrossings = edgeData.zeroCrossings[d];
     		normals = edgeData.normals[d];

     		minX = bounds.min.x;maxX = bounds.max.x;
     		minY = bounds.min.y;maxY = bounds.max.y;
     		minZ = bounds.min.z;maxZ = bounds.max.z;

     		/* Include edges that straddle the bounding box and avoid processing grid
       points at chunk borders. */
     		switch (d) {

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

     		for (z = minZ; z <= maxZ; ++z) {

     			for (y = minY; y <= maxY; ++y) {

     				for (x = minX; x <= maxX; ++x) {

     					indexA = z * mm + y * m + x;
     					indexB = indexA + indexOffsets[d];

     					// Check if the edge exhibits a material change.
     					if (materialIndices[indexA] !== materialIndices[indexB]) {

     						offsetA.set(x * s / n, y * s / n, z * s / n);

     						offsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);

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

     	return { edgeData: edgeData, lengths: lengths };
     }

     /**
      * Either generates or combines volume data based on the operation type.
      *
      * @method update
      * @private
      * @static
      * @param {Chunk} chunk - A volume chunk.
      * @param {Operation} operation - A CSG operation.
      * @param {HermiteData} data0 - A target data set. May be empty or full.
      * @param {HermiteData} [data1] - A predominant data set. Cannot be null.
      */

     function update(chunk, operation, data0, data1) {

     	var bounds = computeIndexBounds(chunk, operation);

     	var result = void 0,
     	    edgeData = void 0,
     	    lengths = void 0,
     	    d = void 0;
     	var done = false;

     	if (operation.type === OperationType.DENSITY_FUNCTION) {

     		generateMaterialIndices(chunk, operation, data0, bounds);
     	} else if (data0.empty) {

     		if (operation.type === OperationType.UNION) {

     			data0.set(data1);
     			done = true;
     		}
     	} else {

     		combineMaterialIndices(chunk, operation, data0, data1, bounds);
     	}

     	if (!done && !data0.empty && !data0.full) {

     		result = operation.type === OperationType.DENSITY_FUNCTION ? generateEdges(chunk, operation, data0, bounds) : combineEdges(chunk, operation, data0, data1);

     		edgeData = result.edgeData;
     		lengths = result.lengths;

     		// Cut off empty data.
     		for (d = 0; d < 3; ++d) {

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

     	var children = operation.children;

     	var result = void 0,
     	    data = void 0;
     	var i = void 0,
     	    l = void 0;

     	if (operation.type === OperationType.DENSITY_FUNCTION) {

     		// Create a data target.
     		result = new HermiteData();

     		// Use the density function to generate data.
     		update(chunk, operation, result);
     	}

     	// Union, Difference or Intersection.
     	for (i = 0, l = children.length; i < l; ++i) {

     		// Generate the full result of the child operation recursively.
     		data = execute(chunk, children[i]);

     		if (result === undefined) {

     			result = data;
     		} else if (data !== null) {

     			if (result === null) {

     				if (operation.type === OperationType.UNION) {

     					// Build upon the first non-empty data.
     					result = data;
     				}
     			} else {

     				// Combine the two data sets.
     				update(chunk, operation, result, data);
     			}
     		} else if (operation.type === OperationType.INTERSECTION) {

     			// An intersection with nothing results in nothing.
     			result = null;
     		}

     		if (result === null && operation.type !== OperationType.UNION) {

     			// Further subtractions and intersections would have no effect.
     			break;
     		}
     	}

     	return result !== null && result.empty ? null : result;
     }

     /**
      * Constructive Solid Geometry combines Signed Distance Functions by using
      * Boolean operators to generate and transform volume data.
      *
      * @class ConstructiveSolidGeometry
      * @submodule csg
      * @static
      */

     var ConstructiveSolidGeometry = function () {
     	function ConstructiveSolidGeometry() {
     		classCallCheck(this, ConstructiveSolidGeometry);
     	}

     	createClass(ConstructiveSolidGeometry, null, [{
     		key: "run",


     		/**
        * Transforms the given chunk of hermite data in two steps:
        *
        *  1. Generate data by executing the given SDF
        *  2. Combine the generated data with the chunk data
        *
        * @method run
        * @static
        * @param {Chunk} chunk - The volume chunk that should be modified.
        * @param {SignedDistanceFunction} sdf - An SDF.
        */

     		value: function run(chunk, sdf) {

     			if (chunk.data === null) {

     				if (sdf.operation === OperationType.UNION) {

     					chunk.data = new HermiteData();
     					chunk.data.edgeData = new EdgeData(0);
     				}
     			} else {

     				chunk.data.decompress();
     			}

     			// Step 1.
     			var operation = sdf.toCSG();

     			var data = chunk.data !== null ? execute(chunk, operation) : null;

     			if (data !== null) {

     				// Wrap the operation in a super operation.
     				switch (sdf.operation) {

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

     				// Step 2.
     				update(chunk, operation, chunk.data, data);

     				// Provoke a geometry extraction.
     				chunk.data.lod = -1;
     			}

     			if (chunk.data !== null) {

     				if (chunk.data.empty) {

     					chunk.data = null;
     				} else {

     					chunk.data.compress();
     				}
     			}
     		}
     	}]);
     	return ConstructiveSolidGeometry;
     }();

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

     exports.History = History;
     exports.PriorityQueue = PriorityQueue;
     exports.Queue = Queue;
     exports.RunLengthEncoder = RunLengthEncoder;
     exports.Scheduler = Scheduler;
     exports.Task = Task;
     exports.Terrain = Terrain;
     exports.TerrainEvent = TerrainEvent;
     exports.WorkerEvent = WorkerEvent;
     exports.ChunkHelper = ChunkHelper;
     exports.MeshTriplanarPhysicalMaterial = MeshTriplanarPhysicalMaterial;
     exports.Givens = Givens;
     exports.Matrix3 = Matrix3;
     exports.QEFSolver = QEFSolver;
     exports.QEFData = QEFData;
     exports.Schur = Schur;
     exports.SingularValueDecomposition = SingularValueDecomposition;
     exports.SymmetricMatrix3 = SymmetricMatrix3;
     exports.Vector2 = Vector2;
     exports.Vector3 = Vector3$2;
     exports.Edge = Edge;
     exports.EdgeData = EdgeData;
     exports.HermiteData = HermiteData;
     exports.Material = Material;
     exports.Voxel = Voxel;
     exports.Chunk = Chunk;
     exports.Volume = Volume;
     exports.VoxelBlock = VoxelBlock;
     exports.VoxelCell = VoxelCell;
     exports.SignedDistanceFunction = SignedDistanceFunction;
     exports.Heightfield = Heightfield;
     exports.Sphere = Sphere;
     exports.Torus = Torus;
     exports.Plane = Plane;
     exports.Box = Box;
     exports.ConstructiveSolidGeometry = ConstructiveSolidGeometry;
     exports.Intersection = Intersection;
     exports.Difference = Difference;
     exports.Union = Union;

     Object.defineProperty(exports, '__esModule', { value: true });

})));
