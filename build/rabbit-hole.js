/**
 * rabbit-hole v0.0.0 build May 28 2017
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2017 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (factory((global.RABBITHOLE = global.RABBITHOLE || {}),global.THREE));
}(this, (function (exports,three) { 'use strict';

  var OperationType = {

    UNION: "csg.union",
    DIFFERENCE: "csg.difference",
    INTERSECTION: "csg.intersection",
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

  var History = function () {
  	function History() {
  		classCallCheck(this, History);


  		this.elements = [];
  	}

  	createClass(History, [{
  		key: "push",
  		value: function push(sdf) {

  			return this.elements.push(sdf);
  		}
  	}, {
  		key: "pop",
  		value: function pop() {

  			return this.elements.pop();
  		}
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
  	}, {
  		key: "clear",
  		value: function clear() {

  			this.elements = [];
  		}
  	}]);
  	return History;
  }();

  var Queue = function () {
  		function Queue() {
  				classCallCheck(this, Queue);


  				this.elements = [];

  				this.head = 0;

  				this.size = 0;
  		}

  		createClass(Queue, [{
  				key: "add",
  				value: function add(element) {

  						var index = this.elements.length;

  						this.elements.push(element);

  						++this.size;

  						return index;
  				}
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
  		}, {
  				key: "peek",
  				value: function peek() {

  						return this.size > 0 ? this.elements[this.head] : null;
  				}
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

  	createClass(PriorityQueue, [{
  		key: "add",
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
  	}, {
  		key: "peek",
  		value: function peek() {

  			return this.size > 0 ? this.elements[this.head].peek() : null;
  		}
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

  var RunLengthEncoder = function () {
  		function RunLengthEncoder() {
  				classCallCheck(this, RunLengthEncoder);
  		}

  		createClass(RunLengthEncoder, null, [{
  				key: "encode",
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

  var Scheduler = function (_PriorityQueue) {
  	inherits(Scheduler, _PriorityQueue);

  	function Scheduler(tiers) {
  		classCallCheck(this, Scheduler);

  		var _this = possibleConstructorReturn(this, (Scheduler.__proto__ || Object.getPrototypeOf(Scheduler)).call(this, tiers));

  		_this.registry = new WeakMap();

  		_this.maxPriority = _this.tiers - 1;

  		return _this;
  	}

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
  	}, {
  		key: "hasTask",
  		value: function hasTask(element) {

  			return this.registry.has(element);
  		}
  	}, {
  		key: "getTask",
  		value: function getTask(element) {

  			return this.registry.get(element);
  		}
  	}, {
  		key: "poll",
  		value: function poll() {

  			var element = get(Scheduler.prototype.__proto__ || Object.getPrototypeOf(Scheduler.prototype), "poll", this).call(this);

  			if (element !== null) {

  				this.registry.delete(element.chunk);
  			}

  			return element;
  		}
  	}, {
  		key: "clear",
  		value: function clear() {

  			get(Scheduler.prototype.__proto__ || Object.getPrototypeOf(Scheduler.prototype), "clear", this).call(this);

  			this.registry = new WeakMap();
  		}
  	}]);
  	return Scheduler;
  }(PriorityQueue);

  var Task = function Task() {
  		var priority = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		classCallCheck(this, Task);


  		this.priority = priority;

  		this.index = -1;
  };

  var Event = function Event(type) {
  	classCallCheck(this, Event);


  	this.type = type;

  	this.target = null;
  };

  var EventTarget = function () {
  	function EventTarget() {
  		classCallCheck(this, EventTarget);


  		this.m0 = new Map();

  		this.m1 = new Map();
  	}

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

  var MeshTriplanarPhysicalMaterial = function (_ShaderMaterial) {
  		inherits(MeshTriplanarPhysicalMaterial, _ShaderMaterial);

  		function MeshTriplanarPhysicalMaterial() {
  				classCallCheck(this, MeshTriplanarPhysicalMaterial);

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

  				_this.envMap = null;

  				return _this;
  		}

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

  var Vector3$1 = function () {
  	function Vector3$$1() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Vector3$$1);


  		this.x = x;

  		this.y = y;

  		this.z = z;
  	}

  	createClass(Vector3$$1, [{
  		key: "set",
  		value: function set$$1(x, y, z) {

  			this.x = x;
  			this.y = y;
  			this.z = z;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;
  			this.z = v.z;

  			return this;
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];

  			return this;
  		}
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
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y && v.z === this.z;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z);
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;
  			this.z += v.z;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;
  			this.z += v.z * s;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;
  			this.z += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;
  			this.z = a.z + b.z;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;
  			this.z -= v.z;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;
  			this.z -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;
  			this.z = a.z - b.z;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;
  			this.z *= v.z;

  			return this;
  		}
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
  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

  			this.x = a.x * b.x;
  			this.y = a.y * b.y;
  			this.z = a.z * b.z;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;
  			this.z /= v.z;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			return this.multiplyScalar(1 / s);
  		}
  	}, {
  		key: "divideVectors",
  		value: function divideVectors(a, b) {

  			this.x = a.x / b.x;
  			this.y = a.y / b.y;
  			this.z = a.z / b.z;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;
  			this.z = -this.z;

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z;
  		}
  	}, {
  		key: "lengthSq",
  		value: function lengthSq() {

  			return this.x * this.x + this.y * this.y + this.z * this.z;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;
  			var dz = this.z - v.z;

  			return dx * dx + dy * dy + dz * dz;
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);
  			this.z = Math.min(this.z, v.z);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);
  			this.z = Math.max(this.z, v.z);

  			return this;
  		}
  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

  			this.x = Math.max(min.x, Math.min(max.x, this.x));
  			this.y = Math.max(min.y, Math.min(max.y, this.y));
  			this.z = Math.max(min.z, Math.min(max.z, this.z));

  			return this;
  		}
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

  var Octant = function () {
  	function Octant() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
  		classCallCheck(this, Octant);


  		this.min = min;

  		this.max = max;

  		this.children = null;
  	}

  	createClass(Octant, [{
  		key: "getCenter",
  		value: function getCenter() {
  			return this.min.clone().add(this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			return this.max.clone().sub(this.min);
  		}
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

  var PATTERN = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var EDGES = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  var CubicOctant = function () {
  		function CubicOctant() {
  				var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  				var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  				classCallCheck(this, CubicOctant);


  				this.min = min;

  				this.size = size;

  				this.children = null;
  		}

  		createClass(CubicOctant, [{
  				key: "getCenter",
  				value: function getCenter() {
  						return this.min.clone().addScalar(this.size * 0.5);
  				}
  		}, {
  				key: "getDimensions",
  				value: function getDimensions() {
  						return new Vector3$1(this.size, this.size, this.size);
  				}
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

  var Box3$1 = function () {
  	function Box3$$1() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1(Infinity, Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1(-Infinity, -Infinity, -Infinity);
  		classCallCheck(this, Box3$$1);


  		this.min = min;

  		this.max = max;
  	}

  	createClass(Box3$$1, [{
  		key: "set",
  		value: function set$$1(min, max) {

  			this.min.copy(min);
  			this.max.copy(max);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(b) {

  			this.min.copy(b.min);
  			this.max.copy(b.max);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "expandByPoint",
  		value: function expandByPoint(p) {

  			this.min.min(p);
  			this.max.max(p);

  			return this;
  		}
  	}, {
  		key: "union",
  		value: function union(b) {

  			this.min.min(b.min);
  			this.max.max(b.max);

  			return this;
  		}
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
  	}, {
  		key: "setFromCenterAndSize",
  		value: function setFromCenterAndSize(center, size) {

  			var halfSize = size.clone().multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(box) {

  			return !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);
  		}
  	}]);
  	return Box3$$1;
  }();

  var IteratorResult = function () {
  	function IteratorResult() {
  		var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  		classCallCheck(this, IteratorResult);


  		this.value = value;

  		this.done = done;
  	}

  	createClass(IteratorResult, [{
  		key: "reset",
  		value: function reset() {

  			this.value = null;
  			this.done = false;
  		}
  	}]);
  	return IteratorResult;
  }();

  var BOX3$1 = new Box3$1();

  var OctreeIterator = function () {
  		function OctreeIterator(octree) {
  				var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  				classCallCheck(this, OctreeIterator);


  				this.octree = octree;

  				this.region = region;

  				this.cull = region !== null;

  				this.result = new IteratorResult();

  				this.trace = null;

  				this.indices = null;

  				this.reset();
  		}

  		createClass(OctreeIterator, [{
  				key: "reset",
  				value: function reset() {

  						var root = this.octree.root;

  						this.trace = [];
  						this.indices = [];

  						if (root !== null) {

  								BOX3$1.min = root.min;
  								BOX3$1.max = root.max;

  								if (!this.cull || this.region.intersectsBox(BOX3$1)) {

  										this.trace.push(root);
  										this.indices.push(0);
  								}
  						}

  						this.result.reset();

  						return this;
  				}
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

  														BOX3$1.min = child.min;
  														BOX3$1.max = child.max;

  														if (!region.intersectsBox(BOX3$1)) {
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
  		}, {
  				key: "return",
  				value: function _return(value) {

  						this.result.value = value;
  						this.result.done = true;

  						return this.result;
  				}
  		}, {
  				key: Symbol.iterator,
  				value: function value() {

  						return this;
  				}
  		}]);
  		return OctreeIterator;
  }();

  var flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

  var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

  function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

  	var entry = 0;

  	if (tx0 > ty0 && tx0 > tz0) {
  		if (tym < tx0) {
  			entry = entry | 2;
  		}
  		if (tzm < tx0) {
  			entry = entry | 1;
  		}
  	} else if (ty0 > tz0) {
  		if (txm < ty0) {
  			entry = entry | 4;
  		}
  		if (tzm < ty0) {
  			entry = entry | 1;
  		}
  	} else {
  		if (txm < tz0) {
  			entry = entry | 4;
  		}
  		if (tym < tz0) {
  			entry = entry | 2;
  		}
  	}

  	return entry;
  }

  function findNextOctant(currentOctant, tx1, ty1, tz1) {

  	var min = void 0;
  	var exit = 0;

  	if (tx1 < ty1) {

  		min = tx1;
  		exit = 0;
  	} else {

  		min = ty1;
  		exit = 1;
  	}

  	if (tz1 < min) {

  		exit = 2;
  	}

  	return octantTable[currentOctant][exit];
  }

  function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

  	var children = octant.children;

  	var currentOctant = void 0;
  	var txm = void 0,
  	    tym = void 0,
  	    tzm = void 0;

  	if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

  		if (children === null) {
  			intersects.push(octant);
  		} else {
  			txm = 0.5 * (tx0 + tx1);
  			tym = 0.5 * (ty0 + ty1);
  			tzm = 0.5 * (tz0 + tz1);

  			currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

  			do {

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

  						currentOctant = 8;
  						break;

  				}
  			} while (currentOctant < 8);
  		}
  	}
  }

  var OctreeRaycaster = function () {
  	function OctreeRaycaster() {
  		classCallCheck(this, OctreeRaycaster);
  	}

  	createClass(OctreeRaycaster, null, [{
  		key: "intersectOctree",
  		value: function intersectOctree(octree, raycaster, intersects) {

  			var dimensions = octree.getDimensions();
  			var halfDimensions = dimensions.clone().multiplyScalar(0.5);

  			var min = octree.min.clone().sub(octree.min);
  			var max = octree.max.clone().sub(octree.min);

  			var direction = raycaster.ray.direction.clone();
  			var origin = raycaster.ray.origin.clone();

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

  			flags[8] = flags[0];

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

  			invDirX = 1.0 / direction.x;
  			invDirY = 1.0 / direction.y;
  			invDirZ = 1.0 / direction.z;

  			tx0 = (min.x - origin.x) * invDirX;
  			tx1 = (max.x - origin.x) * invDirX;
  			ty0 = (min.y - origin.y) * invDirY;
  			ty1 = (max.y - origin.y) * invDirY;
  			tz0 = (min.z - origin.z) * invDirZ;
  			tz1 = (max.z - origin.z) * invDirZ;

  			if (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {

  				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);
  			}
  		}
  	}]);
  	return OctreeRaycaster;
  }();

  var BOX3 = new Box3$1();

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

  function _cull(octant, region, result) {

  	var children = octant.children;

  	var i = void 0,
  	    l = void 0;

  	BOX3.min = octant.min;
  	BOX3.max = octant.max;

  	if (region.intersectsBox(BOX3)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; i < l; ++i) {

  				_cull(children[i], region, result);
  			}
  		} else {

  			result.push(octant);
  		}
  	}
  }

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

  var Octree = function () {
  	function Octree(min, max) {
  		classCallCheck(this, Octree);


  		this.root = min !== undefined && max !== undefined ? new Octant(min, max) : null;
  	}

  	createClass(Octree, [{
  		key: "getCenter",
  		value: function getCenter() {
  			return this.root.getCenter();
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			return this.root.getDimensions();
  		}
  	}, {
  		key: "getDepth",
  		value: function getDepth() {

  			return _getDepth(this.root);
  		}
  	}, {
  		key: "cull",
  		value: function cull(region) {

  			var result = [];

  			_cull(this.root, region, result);

  			return result;
  		}
  	}, {
  		key: "findOctantsByLevel",
  		value: function findOctantsByLevel(level) {

  			var result = [];

  			_findOctantsByLevel(this.root, level, 0, result);

  			return result;
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			OctreeRaycaster.intersectOctree(this, raycaster, intersects);

  			return intersects;
  		}
  	}, {
  		key: "leaves",
  		value: function leaves(region) {

  			return new OctreeIterator(this, region);
  		}
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
  	}, {
  		key: "max",
  		get: function get$$1() {
  			return this.root.max;
  		}
  	}, {
  		key: "children",
  		get: function get$$1() {
  			return this.root.children;
  		}
  	}]);
  	return Octree;
  }();

  var PointOctant = function (_Octant) {
  		inherits(PointOctant, _Octant);

  		function PointOctant(min, max) {
  				classCallCheck(this, PointOctant);

  				var _this = possibleConstructorReturn(this, (PointOctant.__proto__ || Object.getPrototypeOf(PointOctant)).call(this, min, max));

  				_this.points = null;

  				_this.data = null;

  				return _this;
  		}

  		createClass(PointOctant, [{
  				key: "distanceToSquared",
  				value: function distanceToSquared(p) {

  						var clampedPoint = p.clone().clamp(this.min, this.max);

  						return clampedPoint.sub(p).lengthSq();
  				}
  		}, {
  				key: "distanceToCenterSquared",
  				value: function distanceToCenterSquared(p) {

  						var center = this.getCenter();

  						var dx = p.x - center.x;
  						var dy = p.y - center.x;
  						var dz = p.z - center.z;

  						return dx * dx + dy * dy + dz * dz;
  				}
  		}, {
  				key: "contains",
  				value: function contains(p, bias) {

  						var min = this.min;
  						var max = this.max;

  						return p.x >= min.x - bias && p.y >= min.y - bias && p.z >= min.z - bias && p.x <= max.x + bias && p.y <= max.y + bias && p.z <= max.z + bias;
  				}
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

  					if (i < last) {
  						points[i] = points[last];
  						data[i] = data[last];
  					}

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
  		sortedChildren = children.map(function (child) {
  			return {
  				octant: child,
  				distance: child.distanceToCenterSquared(p)
  			};
  		}).sort(function (a, b) {
  			return a.distance - b.distance;
  		});

  		for (i = 0, l = sortedChildren.length; i < l; ++i) {
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

  var PointOctree = function (_Octree) {
  	inherits(PointOctree, _Octree);

  	function PointOctree(min, max) {
  		var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
  		var maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;
  		var maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;
  		classCallCheck(this, PointOctree);

  		var _this = possibleConstructorReturn(this, (PointOctree.__proto__ || Object.getPrototypeOf(PointOctree)).call(this));

  		_this.root = new PointOctant(min, max);

  		_this.bias = Math.max(0.0, bias);

  		_this.biasSquared = _this.bias * _this.bias;

  		_this.maxPoints = Math.max(1, Math.round(maxPoints));

  		_this.maxDepth = Math.max(0, Math.round(maxDepth));

  		return _this;
  	}

  	createClass(PointOctree, [{
  		key: "countPoints",
  		value: function countPoints() {

  			return _countPoints(this.root);
  		}
  	}, {
  		key: "add",
  		value: function add(p, data) {

  			_add(this.root, p, data, 0, this.bias, this.maxPoints, this.maxDepth);
  		}
  	}, {
  		key: "remove",
  		value: function remove(p) {

  			_remove(this.root, null, p, this.bias, this.maxPoints);
  		}
  	}, {
  		key: "fetch",
  		value: function fetch(p) {

  			return _fetch(this.root, p, this.bias, this.biasSquared);
  		}
  	}, {
  		key: "findNearestPoint",
  		value: function findNearestPoint(p) {
  			var maxDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			return _findNearestPoint(this.root, p, maxDistance, skipSelf);
  		}
  	}, {
  		key: "findPoints",
  		value: function findPoints(p, r) {
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			var result = [];

  			_findPoints(this.root, p, r, skipSelf, result);

  			return result;
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			var octants = get(PointOctree.prototype.__proto__ || Object.getPrototypeOf(PointOctree.prototype), "raycast", this).call(this, raycaster);

  			if (octants.length > 0) {
  				this.testPoints(octants, raycaster, intersects);
  			}

  			return intersects;
  		}
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

  var Vector3$2 = function () {
  	function Vector3$$1() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Vector3$$1);


  		this.x = x;

  		this.y = y;

  		this.z = z;
  	}

  	createClass(Vector3$$1, [{
  		key: "set",
  		value: function set$$1(x, y, z) {

  			this.x = x;
  			this.y = y;
  			this.z = z;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;
  			this.z = v.z;

  			return this;
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];

  			return this;
  		}
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
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y && v.z === this.z;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z);
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;
  			this.z += v.z;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;
  			this.z += v.z * s;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;
  			this.z += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;
  			this.z = a.z + b.z;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;
  			this.z -= v.z;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;
  			this.z -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;
  			this.z = a.z - b.z;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;
  			this.z *= v.z;

  			return this;
  		}
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
  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

  			this.x = a.x * b.x;
  			this.y = a.y * b.y;
  			this.z = a.z * b.z;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;
  			this.z /= v.z;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			return this.multiplyScalar(1 / s);
  		}
  	}, {
  		key: "divideVectors",
  		value: function divideVectors(a, b) {

  			this.x = a.x / b.x;
  			this.y = a.y / b.y;
  			this.z = a.z / b.z;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;
  			this.z = -this.z;

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z;
  		}
  	}, {
  		key: "lengthSq",
  		value: function lengthSq() {

  			return this.x * this.x + this.y * this.y + this.z * this.z;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;
  			var dz = this.z - v.z;

  			return dx * dx + dy * dy + dz * dz;
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);
  			this.z = Math.min(this.z, v.z);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);
  			this.z = Math.max(this.z, v.z);

  			return this;
  		}
  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

  			this.x = Math.max(min.x, Math.min(max.x, this.x));
  			this.y = Math.max(min.y, Math.min(max.y, this.y));
  			this.z = Math.max(min.z, Math.min(max.z, this.z));

  			return this;
  		}
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

  var Box3$2 = function () {
  	function Box3$$1() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$2(Infinity, Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$2(-Infinity, -Infinity, -Infinity);
  		classCallCheck(this, Box3$$1);


  		this.min = min;

  		this.max = max;
  	}

  	createClass(Box3$$1, [{
  		key: "set",
  		value: function set$$1(min, max) {

  			this.min.copy(min);
  			this.max.copy(max);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(b) {

  			this.min.copy(b.min);
  			this.max.copy(b.max);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "expandByPoint",
  		value: function expandByPoint(p) {

  			this.min.min(p);
  			this.max.max(p);

  			return this;
  		}
  	}, {
  		key: "union",
  		value: function union(b) {

  			this.min.min(b.min);
  			this.max.max(b.max);

  			return this;
  		}
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
  	}, {
  		key: "setFromCenterAndSize",
  		value: function setFromCenterAndSize(center, size) {

  			var halfSize = size.clone().multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(box) {

  			return !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);
  		}
  	}]);
  	return Box3$$1;
  }();

  var Material = {

    AIR: 0,
    SOLID: 1

  };

  var EdgeData = function () {
  	function EdgeData(x) {
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
  		classCallCheck(this, EdgeData);


  		this.edges = [new Uint32Array(x), new Uint32Array(y), new Uint32Array(z)];

  		this.zeroCrossings = [new Float32Array(x), new Float32Array(y), new Float32Array(z)];

  		this.normals = [new Float32Array(x * 3), new Float32Array(y * 3), new Float32Array(z * 3)];
  	}

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
  	}, {
  		key: "serialise",
  		value: function serialise() {

  			return {
  				edges: this.edges,
  				zeroCrossings: this.zeroCrossings,
  				normals: this.normals
  			};
  		}
  	}, {
  		key: "deserialise",
  		value: function deserialise(object) {

  			this.edges = object.edges;
  			this.zeroCrossings = object.zeroCrossings;
  			this.normals = object.normals;
  		}
  	}], [{
  		key: "calculate1DEdgeCount",
  		value: function calculate1DEdgeCount(n) {

  			return Math.pow(n + 1, 2) * n;
  		}
  	}]);
  	return EdgeData;
  }();

  var resolution = 0;

  var indexCount = 0;

  var HermiteData = function () {
  	function HermiteData() {
  		var initialise = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  		classCallCheck(this, HermiteData);


  		this.lod = -1;

  		this.neutered = false;

  		this.materials = 0;

  		this.materialIndices = initialise ? new Uint8Array(indexCount) : null;

  		this.runLengths = null;

  		this.edgeData = null;
  	}

  	createClass(HermiteData, [{
  		key: "set",
  		value: function set$$1(data) {

  			this.lod = data.lod;
  			this.neutered = data.neutered;
  			this.materials = data.materials;
  			this.materialIndices = data.materialIndices;
  			this.runLengths = data.runLengths;
  			this.edgeData = data.edgeData;

  			return this;
  		}
  	}, {
  		key: "setMaterialIndex",
  		value: function setMaterialIndex(index, value) {
  			if (this.materialIndices[index] === Material.AIR) {

  				if (value !== Material.AIR) {

  					++this.materials;
  				}
  			} else if (value === Material.AIR) {

  				--this.materials;
  			}

  			this.materialIndices[index] = value;
  		}
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
  	}, {
  		key: "decompress",
  		value: function decompress() {

  			if (this.runLengths !== null) {

  				this.materialIndices = RunLengthEncoder.decode(this.runLengths, this.materialIndices, new Uint8Array(indexCount));

  				this.runLengths = null;
  			}

  			return this;
  		}
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
  	}, {
  		key: "empty",
  		get: function get$$1() {
  			return this.materials === 0;
  		}
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

  var Chunk = function (_CubicOctant) {
  	inherits(Chunk, _CubicOctant);

  	function Chunk(min, size) {
  		classCallCheck(this, Chunk);

  		var _this = possibleConstructorReturn(this, (Chunk.__proto__ || Object.getPrototypeOf(Chunk)).call(this, min, size));

  		_this.data = null;

  		_this.csg = null;

  		return _this;
  	}

  	createClass(Chunk, [{
  		key: "createTransferList",
  		value: function createTransferList() {
  			var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  			return this.data !== null ? this.data.createTransferList(transferList) : transferList;
  		}
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

  var box3$1 = new Box3$2();

  function ceil2(n) {
  	return Math.pow(2, Math.max(0, Math.ceil(Math.log2(n))));
  }

  var Volume = function (_Octree) {
  	inherits(Volume, _Octree);

  	function Volume() {
  		var chunkSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
  		var resolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 32;
  		classCallCheck(this, Volume);

  		var _this = possibleConstructorReturn(this, (Volume.__proto__ || Object.getPrototypeOf(Volume)).call(this));

  		_this.root = new Chunk();

  		_this.chunkSize = Math.max(1, ceil2(chunkSize));

  		_this.min.subScalar(_this.chunkSize * 2);
  		_this.size = _this.chunkSize * 4;

  		_this.root.resolution = ceil2(resolution);

  		return _this;
  	}

  	createClass(Volume, [{
  		key: "grow",
  		value: function grow(octant, region, size, result) {

  			var children = octant.children;
  			var i = void 0,
  			    l = void 0;

  			box3$1.min = octant.min;
  			box3$1.max = octant.max;

  			if (region.intersectsBox(box3$1)) {

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
  	}, {
  		key: "edit",
  		value: function edit(sdf) {

  			var region = sdf.completeBoundingBox;

  			var result = [];

  			if (sdf.operation === OperationType.UNION) {
  				this.expand(region);
  				this.grow(this.root, region, this.chunkSize, result);
  			} else if (sdf.operation === OperationType.DIFFERENCE) {
  				result = this.leaves(region);
  			} else {
  				result = this.leaves();
  			}

  			return result;
  		}
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
  				n = ceil2(Math.ceil(m / this.chunkSize) * this.chunkSize);

  				if (originalChildren === null) {
  					this.min.set(-n, -n, -n);
  					this.size = 2 * n;
  				} else {
  					while (s < n) {

  						s = this.size;

  						this.min.multiplyScalar(2);
  						this.size *= 2;

  						this.root.split();

  						for (i = 0; i < 8; ++i) {
  							if (originalChildren[i].children !== null) {

  								this.children[i].split([originalChildren[i]]);
  							}
  						}

  						originalChildren = this.children;
  					}
  				}
  			}
  		}
  	}, {
  		key: "prune",
  		value: function prune(chunk) {}
  	}, {
  		key: "load",
  		value: function load(data) {

  			Chunk.resolution = data.resolution;
  			this.chunkSize = data.chunkSize;
  			this.root = data.root;
  		}
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
  	}, {
  		key: "resolution",
  		get: function get$$1() {
  			return this.root.resolution;
  		}
  	}]);
  	return Volume;
  }(Octree);

  var SDFType = {

    SPHERE: "sdf.sphere",
    BOX: "sdf.box",
    TORUS: "sdf.torus",
    PLANE: "sdf.plane",
    HEIGHTFIELD: "sdf.heightfield"

  };

  var Operation = function () {
  		function Operation(type) {
  				classCallCheck(this, Operation);


  				this.type = type;

  				for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
  						children[_key - 1] = arguments[_key];
  				}

  				this.children = children;

  				this.bbox = null;
  		}

  		createClass(Operation, [{
  				key: "computeBoundingBox",
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

  	createClass(Union, [{
  		key: "updateMaterialIndex",
  		value: function updateMaterialIndex(index, data0, data1) {

  			var materialIndex = data1.materialIndices[index];

  			if (materialIndex !== Material.AIR) {

  				data0.setMaterialIndex(index, materialIndex);
  			}
  		}
  	}, {
  		key: "selectEdge",
  		value: function selectEdge(edge0, edge1, s) {

  			return s ? edge0.t > edge1.t ? edge0 : edge1 : edge0.t < edge1.t ? edge0 : edge1;
  		}
  	}]);
  	return Union;
  }(Operation);

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

  	createClass(Difference, [{
  		key: "updateMaterialIndex",
  		value: function updateMaterialIndex(index, data0, data1) {

  			if (data1.materialIndices[index] !== Material.AIR) {

  				data0.setMaterialIndex(index, Material.AIR);
  			}
  		}
  	}, {
  		key: "selectEdge",
  		value: function selectEdge(edge0, edge1, s) {

  			return s ? edge0.t < edge1.t ? edge0 : edge1 : edge0.t > edge1.t ? edge0 : edge1;
  		}
  	}]);
  	return Difference;
  }(Operation);

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

  	createClass(Intersection, [{
  		key: "updateMaterialIndex",
  		value: function updateMaterialIndex(index, data0, data1) {

  			var materialIndex = data1.materialIndices[index];

  			data0.setMaterialIndex(index, data0.materialIndices[index] !== Material.AIR && materialIndex !== Material.AIR ? materialIndex : Material.AIR);
  		}
  	}, {
  		key: "selectEdge",
  		value: function selectEdge(edge0, edge1, s) {

  			return s ? edge0.t < edge1.t ? edge0 : edge1 : edge0.t > edge1.t ? edge0 : edge1;
  		}
  	}]);
  	return Intersection;
  }(Operation);

  var ISOVALUE = 0.0;

  var DensityFunction = function (_Operation) {
  	inherits(DensityFunction, _Operation);

  	function DensityFunction(sdf) {
  		classCallCheck(this, DensityFunction);

  		var _this = possibleConstructorReturn(this, (DensityFunction.__proto__ || Object.getPrototypeOf(DensityFunction)).call(this, OperationType.DENSITY_FUNCTION));

  		_this.sdf = sdf;

  		return _this;
  	}

  	createClass(DensityFunction, [{
  		key: "computeBoundingBox",
  		value: function computeBoundingBox() {

  			this.bbox = this.sdf.computeBoundingBox();

  			return this.bbox;
  		}
  	}, {
  		key: "generateMaterialIndex",
  		value: function generateMaterialIndex(position) {

  			return this.sdf.sample(position) <= ISOVALUE ? this.sdf.material : Material.AIR;
  		}
  	}, {
  		key: "generateEdge",
  		value: function generateEdge(edge) {

  			edge.approximateZeroCrossing(this.sdf);
  			edge.computeSurfaceNormal(this.sdf);
  		}
  	}]);
  	return DensityFunction;
  }(Operation);

  var SignedDistanceFunction = function () {
  		function SignedDistanceFunction(type) {
  				var material = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Material.SOLID;
  				classCallCheck(this, SignedDistanceFunction);


  				this.type = type;

  				this.operation = null;

  				this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

  				this.children = [];

  				this.bbox = null;
  		}

  		createClass(SignedDistanceFunction, [{
  				key: "union",
  				value: function union(sdf) {

  						sdf.operation = OperationType.UNION;
  						this.children.push(sdf);

  						return this;
  				}
  		}, {
  				key: "subtract",
  				value: function subtract(sdf) {

  						sdf.operation = OperationType.DIFFERENCE;
  						this.children.push(sdf);

  						return this;
  				}
  		}, {
  				key: "intersect",
  				value: function intersect(sdf) {

  						sdf.operation = OperationType.INTERSECTION;
  						this.children.push(sdf);

  						return this;
  				}
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
  		}, {
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						throw new Error("SDF: bounding box method not implemented!");
  				}
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

  var Sphere = function (_SignedDistanceFuncti) {
  		inherits(Sphere, _SignedDistanceFuncti);

  		function Sphere() {
  				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				var material = arguments[1];
  				classCallCheck(this, Sphere);

  				var _this = possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this, SDFType.SPHERE, material));

  				_this.origin = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.origin))))();

  				_this.radius = parameters.radius;

  				return _this;
  		}

  		createClass(Sphere, [{
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						this.bbox = new Box3$2();

  						this.bbox.min.copy(this.origin).subScalar(this.radius);
  						this.bbox.max.copy(this.origin).addScalar(this.radius);

  						return this.bbox;
  				}
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

  var Box = function (_SignedDistanceFuncti) {
  		inherits(Box, _SignedDistanceFuncti);

  		function Box() {
  				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				var material = arguments[1];
  				classCallCheck(this, Box);

  				var _this = possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this, SDFType.BOX, material));

  				_this.origin = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.origin))))();

  				_this.halfDimensions = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.halfDimensions))))();

  				return _this;
  		}

  		createClass(Box, [{
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						this.bbox = new Box3$2();

  						this.bbox.min.subVectors(this.origin, this.halfDimensions);
  						this.bbox.max.addVectors(this.origin, this.halfDimensions);

  						return this.bbox;
  				}
  		}, {
  				key: "sample",
  				value: function sample(position) {

  						var origin = this.origin;
  						var halfDimensions = this.halfDimensions;

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

  var Plane = function (_SignedDistanceFuncti) {
  	inherits(Plane, _SignedDistanceFuncti);

  	function Plane() {
  		var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  		var material = arguments[1];
  		classCallCheck(this, Plane);

  		var _this = possibleConstructorReturn(this, (Plane.__proto__ || Object.getPrototypeOf(Plane)).call(this, SDFType.PLANE, material));

  		_this.normal = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.normal))))();

  		_this.constant = parameters.constant;

  		return _this;
  	}

  	createClass(Plane, [{
  		key: "computeBoundingBox",
  		value: function computeBoundingBox() {

  			this.bbox = new Box3$2();

  			return this.bbox;
  		}
  	}, {
  		key: "sample",
  		value: function sample(position) {

  			return this.normal.dot(position) + this.constant;
  		}
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

  var Torus = function (_SignedDistanceFuncti) {
  		inherits(Torus, _SignedDistanceFuncti);

  		function Torus() {
  				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				var material = arguments[1];
  				classCallCheck(this, Torus);

  				var _this = possibleConstructorReturn(this, (Torus.__proto__ || Object.getPrototypeOf(Torus)).call(this, SDFType.TORUS, material));

  				_this.origin = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.origin))))();

  				_this.R = parameters.R;

  				_this.r = parameters.r;

  				return _this;
  		}

  		createClass(Torus, [{
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						this.bbox = new Box3$2();

  						this.bbox.min.copy(this.origin).subScalar(this.R).subScalar(this.r);
  						this.bbox.max.copy(this.origin).addScalar(this.R).addScalar(this.r);

  						return this.bbox;
  				}
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

  var Heightfield = function (_SignedDistanceFuncti) {
  		inherits(Heightfield, _SignedDistanceFuncti);

  		function Heightfield() {
  				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				var material = arguments[1];
  				classCallCheck(this, Heightfield);

  				var _this = possibleConstructorReturn(this, (Heightfield.__proto__ || Object.getPrototypeOf(Heightfield)).call(this, SDFType.HEIGHTFIELD, material));

  				_this.min = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.min))))();

  				_this.dimensions = new (Function.prototype.bind.apply(Vector3$2, [null].concat(toConsumableArray(parameters.size))))();

  				_this.data = parameters.data;

  				return _this;
  		}

  		createClass(Heightfield, [{
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						this.bbox = new Box3$2();

  						this.bbox.min.copy(this.min);
  						this.bbox.max.addVectors(this.min, this.dimensions);

  						return this.bbox;
  				}
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

  var Reviver = function () {
  		function Reviver() {
  				classCallCheck(this, Reviver);
  		}

  		createClass(Reviver, null, [{
  				key: "reviveSDF",
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

  var Action = {

    EXTRACT: "worker.extract",
    MODIFY: "worker.modify",
    CLOSE: "worker.close"

  };

  var WorkerEvent = function (_Event) {
  		inherits(WorkerEvent, _Event);

  		function WorkerEvent(type) {
  				classCallCheck(this, WorkerEvent);

  				var _this = possibleConstructorReturn(this, (WorkerEvent.__proto__ || Object.getPrototypeOf(WorkerEvent)).call(this, type));

  				_this.worker = null;

  				_this.data = null;

  				return _this;
  		}

  		return WorkerEvent;
  }(Event);

  var message = new WorkerEvent("message");

  var worker = "!function(){\"use strict\";function t(t,i,n,e,r,s){var o=0;return t>i&&t>n?(r<t&&(o|=2),s<t&&(o|=1)):i>n?(e<i&&(o|=4),s<i&&(o|=1)):(e<n&&(o|=4),r<n&&(o|=2)),o}function i(t,i,n,e){var r=void 0,s=0;return i<n?(r=i,s=0):(r=n,s=1),e<r&&(s=2),Z[t][s]}function n(e,r,s,o,a,u,l,h,c){var d=e.children,y=void 0,v=void 0,f=void 0,m=void 0;if(a>=0&&u>=0&&l>=0)if(null===d)c.push(e);else{y=t(r,s,o,v=.5*(r+a),f=.5*(s+u),m=.5*(o+l));do{switch(y){case 0:n(d[X[8]],r,s,o,v,f,m,h,c),y=i(y,v,f,m);break;case 1:n(d[X[8]^X[1]],r,s,m,v,f,l,h,c),y=i(y,v,f,l);break;case 2:n(d[X[8]^X[2]],r,f,o,v,u,m,h,c),y=i(y,v,u,m);break;case 3:n(d[X[8]^X[3]],r,f,m,v,u,l,h,c),y=i(y,v,u,l);break;case 4:n(d[X[8]^X[4]],v,s,o,a,f,m,h,c),y=i(y,a,f,m);break;case 5:n(d[X[8]^X[5]],v,s,m,a,f,l,h,c),y=i(y,a,f,l);break;case 6:n(d[X[8]^X[6]],v,f,o,a,u,m,h,c),y=i(y,a,u,m);break;case 7:n(d[X[8]^X[7]],v,f,m,a,u,l,h,c),y=8}}while(y<8)}}function e(t){var i=t.children,n=0,r=void 0,s=void 0,o=void 0;if(null!==i)for(r=0,s=i.length;r<s;++r)(o=1+e(i[r]))>n&&(n=o);return n}function r(t,i,n){var e=t.children,s=void 0,o=void 0;if(K.min=t.min,K.max=t.max,i.intersectsBox(K))if(null!==e)for(s=0,o=e.length;s<o;++s)r(e[s],i,n);else n.push(t)}function s(t,i,n,e){var r=t.children,o=void 0,a=void 0;if(n===i)e.push(t);else if(null!==r)for(++n,o=0,a=r.length;o<a;++o)s(r[o],i,n,e)}function o(t){var i=t.children,n=0,e=void 0,r=void 0;if(null!==i)for(e=0,r=i.length;e<r;++e)n+=o(i[e]);else null!==t.points&&(n=t.points.length);return n}function a(t,i,n,e,r,s,o){var u=t.children,l=!1,h=!1,c=void 0,d=void 0;if(t.contains(i,r)){if(null===u){if(null===t.points)t.points=[],t.data=[];else for(c=0,d=t.points.length;!l&&c<d;++c)l=t.points[c].equals(i);l?(t.data[c-1]=n,h=!0):t.points.length<s||e===o?(t.points.push(i.clone()),t.data.push(n),h=!0):(t.split(),t.redistribute(r),u=t.children)}if(null!==u)for(++e,c=0,d=u.length;!h&&c<d;++c)h=a(u[c],i,n,e,r,s,o)}return h}function u(t,i,n,e,r){var s=t.children,a=!1,l=void 0,h=void 0,c=void 0,d=void 0,y=void 0;if(t.contains(n,e))if(null!==s)for(l=0,h=s.length;!a&&l<h;++l)a=u(s[l],t,n,e,r);else if(null!==t.points)for(c=t.points,d=t.data,l=0,h=c.length;!a&&l<h;++l)c[l].equals(n)&&(l<(y=h-1)&&(c[l]=c[y],d[l]=d[y]),c.pop(),d.pop(),null!==i&&o(i)<=r&&i.merge(),a=!0);return a}function l(t,i,n,e){var r=t.children,s=null,o=void 0,a=void 0,u=void 0;if(t.contains(i,n))if(null!==r)for(o=0,a=r.length;null===s&&o<a;++o)s=l(r[o],i,n,e);else for(o=0,a=(u=t.points).length;null===s&&o<a;++o)i.distanceToSquared(u[o])<=e&&(s=t.data[o]);return s}function h(t,i,n,e){var r=t.points,s=t.children,o=null,a=n,u=void 0,l=void 0,c=void 0,d=void 0,y=void 0,v=void 0,f=void 0;if(null!==s)for(u=0,l=(y=s.map(function(t){return{octant:t,distance:t.distanceToCenterSquared(i)}}).sort(function(t,i){return t.distance-i.distance})).length;u<l;++u)(v=y[u].octant).contains(i,a)&&null!==(f=h(v,i,a,e))&&(d=f.point.distanceToSquared(i),(!e||d>0)&&d<a&&(a=d,o=f));else if(null!==r)for(u=0,l=r.length;u<l;++u)c=r[u],d=i.distanceToSquared(c),(!e||d>0)&&d<a&&(a=d,o={point:c.clone(),data:t.data[u]});return o}function c(t,i,n,e,r){var s=t.points,o=t.children,a=n*n,u=void 0,l=void 0,h=void 0,d=void 0,y=void 0;if(null!==o)for(u=0,l=o.length;u<l;++u)(y=o[u]).contains(i,n)&&c(y,i,n,e,r);else if(null!==s)for(u=0,l=s.length;u<l;++u)h=s[u],d=i.distanceToSquared(h),(!e||d>0)&&d<=a&&r.push({point:h.clone(),data:t.data[u]})}function d(t,i,n){var e=void 0,r=void 0,s=void 0;0===i?(st.c=1,st.s=0):(e=(n-t)/(2*i),r=Math.sqrt(1+e*e),s=1/(e>=0?e+r:e-r),st.c=1/Math.sqrt(1+s*s),st.s=s*st.c)}function y(t,i){0!==t.elements[1]&&rt.rot01Post(i,ot.rot01(t))}function v(t,i){0!==t.elements[2]&&rt.rot02Post(i,ot.rot02(t))}function f(t,i){0!==t.elements[4]&&rt.rot12Post(i,ot.rot12(t))}function m(t,i,n,e,r){var s=e*i.copy(t).norm(),o=void 0;for(o=0;o<r&&i.off()>s;++o)y(i,n),v(i,n),f(i,n)}function p(t,i){var n=1/t;return Math.abs(t)<i||Math.abs(n)<i?0:n}function x(t,i,n,e){var r=t.elements,s=i.elements,o=n.elements,a=s[0],u=s[3],l=s[5],h=p(a,e),c=p(u,e),d=p(l,e),y=3-((0===h)+(0===c)+(0===d)),v=o[0],f=o[3],m=o[6],x=o[1],g=o[4],k=o[7],w=o[2],z=o[5],b=o[8];return r[0]=v*h*v+f*c*f+m*d*m,r[3]=v*h*x+f*c*g+m*d*k,r[6]=v*h*w+f*c*z+m*d*b,r[1]=r[3],r[4]=x*h*x+g*c*g+k*d*k,r[7]=x*h*w+g*c*z+k*d*b,r[2]=r[6],r[5]=r[7],r[8]=w*h*w+z*c*z+b*d*b,y}function g(t,i,n,e,r){var s=t+1,o=s*s,a=new yt,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0;for(u=0,d=0;d<8;++d)c=(e+(h=B[d])[2])*o+(n+h[1])*s+(i+h[0]),u|=Math.min(r[c],$.SOLID)<<d;for(l=0,d=0;d<12;++d)(u>>q[d][0]&1)!==(u>>q[d][1]&1)&&++l;return a.materials=u,a.edgeCount=l,a.qefData=new nt,a}function k(t,i,n){var e=[-1,-1,-1,-1],r=[!1,!1,!1,!1],s=1/0,o=0,a=!1,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0,y=void 0,v=void 0;for(v=0;v<4;++v)d=t[v],y=zt[i][v],u=q[y][0],l=q[y][1],h=d.voxel.materials>>u&1,c=d.voxel.materials>>l&1,d.size<s&&(s=d.size,o=v,a=h!==$.AIR),e[v]=d.voxel.index,r[v]=h!==c;r[o]&&(a?(n.push(e[0]),n.push(e[3]),n.push(e[1]),n.push(e[0]),n.push(e[2]),n.push(e[3])):(n.push(e[0]),n.push(e[1]),n.push(e[3]),n.push(e[0]),n.push(e[3]),n.push(e[2])))}function w(t,i,n){var e=[0,0,0,0],r=void 0,s=void 0,o=void 0,a=void 0;if(null!==t[0].voxel&&null!==t[1].voxel&&null!==t[2].voxel&&null!==t[3].voxel)k(t,i,n);else for(o=0;o<2;++o){for(e[0]=wt[i][o][0],e[1]=wt[i][o][1],e[2]=wt[i][o][2],e[3]=wt[i][o][3],r=[],a=0;a<4;++a)if(null!==(s=t[a]).voxel)r[a]=s;else{if(null===s.children)break;r[a]=s.children[e[a]]}4===a&&w(r,wt[i][o][4],n)}}function z(t,i,n){var e=[0,0,0,0],r=[[0,0,1,1],[0,1,0,1]],s=void 0,o=void 0,a=void 0,u=void 0,l=void 0;if(null!==t[0].children||null!==t[1].children){for(u=0;u<4;++u)e[0]=gt[i][u][0],e[1]=gt[i][u][1],z([null===t[0].children?t[0]:t[0].children[e[0]],null===t[1].children?t[1]:t[1].children[e[1]]],gt[i][u][2],n);for(u=0;u<4;++u){for(e[0]=kt[i][u][1],e[1]=kt[i][u][2],e[2]=kt[i][u][3],e[3]=kt[i][u][4],o=r[kt[i][u][0]],s=[],l=0;l<4;++l)if(null!==(a=t[o[l]]).voxel)s[l]=a;else{if(null===a.children)break;s[l]=a.children[e[l]]}4===l&&w(s,kt[i][u][5],n)}}}function b(t,i){var n=t.children,e=[0,0,0,0],r=void 0;if(null!==n){for(r=0;r<8;++r)b(n[r],i);for(r=0;r<12;++r)e[0]=pt[r][0],e[1]=pt[r][1],z([n[e[0]],n[e[1]]],pt[r][2],i);for(r=0;r<6;++r)e[0]=xt[r][0],e[1]=xt[r][1],e[2]=xt[r][2],e[3]=xt[r][3],w([n[e[0]],n[e[1]],n[e[2]],n[e[3]]],xt[r][4],i)}}function A(t,i,n,e){var r=void 0,s=void 0;if(null!==t.children)for(r=0;r<8;++r)e=A(t.children[r],i,n,e);else null!==t.voxel&&((s=t.voxel).index=e,i[3*e]=s.position.x,i[3*e+1]=s.position.y,i[3*e+2]=s.position.z,n[3*e]=s.normal.x,n[3*e+1]=s.normal.y,n[3*e+2]=s.normal.z,++e);return e}function U(t,i){var n=t.size,e=t.resolution,r=new tt(0,0,0),s=new tt(e,e,e),o=new Pt(t.min,t.max);return i.type!==Et.INTERSECTION&&(i.boundingBox.intersectsBox(o)?(r.copy(i.boundingBox.min).max(o.min).sub(o.min),r.x=Math.ceil(r.x*e/n),r.y=Math.ceil(r.y*e/n),r.z=Math.ceil(r.z*e/n),s.copy(i.boundingBox.max).min(o.max).sub(o.min),s.x=Math.floor(s.x*e/n),s.y=Math.floor(s.y*e/n),s.z=Math.floor(s.z*e/n)):(r.set(e,e,e),s.set(0,0,0))),new Pt(r,s)}function M(t,i,n,e,r){var s=t.resolution+1,o=s*s,a=r.max.x,u=r.max.y,l=r.max.z,h=void 0,c=void 0,d=void 0;for(d=r.min.z;d<=l;++d)for(c=r.min.y;c<=u;++c)for(h=r.min.x;h<=a;++h)i.updateMaterialIndex(d*o+c*s+h,n,e)}function I(t,i,n,e){var r=t.size,s=t.resolution,o=s+1,a=o*o,u=n.materialIndices,l=t.min,h=new tt,c=new tt,d=e.max.x,y=e.max.y,v=e.max.z,f=void 0,m=0,p=void 0,x=void 0,g=void 0;for(g=e.min.z;g<=v;++g)for(h.z=g*r/s,x=e.min.y;x<=y;++x)for(h.y=x*r/s,p=e.min.x;p<=d;++p)h.x=p*r/s,(f=i.generateMaterialIndex(c.addVectors(l,h)))!==$.AIR&&(u[g*a+x*o+p]=f,++m);n.materials=m}function S(t,i,n,e){var r=t.resolution+1,s=new Uint32Array([1,r,r*r]),o=n.materialIndices,a=new dt,u=new dt,l=e.edgeData,h=n.edgeData,c=Ut.calculate1DEdgeCount(t.resolution),d=new Ut(Math.min(c,h.edges[0].length+l.edges[0].length),Math.min(c,h.edges[1].length+l.edges[1].length),Math.min(c,h.edges[2].length+l.edges[2].length)),y=new Uint32Array(3),v=void 0,f=void 0,m=void 0,p=void 0,x=void 0,g=void 0,k=void 0,w=void 0,z=void 0,b=void 0,A=void 0,U=void 0,M=void 0,I=void 0,S=void 0,O=void 0,_=void 0,D=void 0,P=void 0,E=void 0,C=void 0,T=void 0;for(_=0,D=0;D<3;_=0,++D){for(v=l.edges[D],p=h.edges[D],k=d.edges[D],f=l.zeroCrossings[D],x=h.zeroCrossings[D],w=d.zeroCrossings[D],m=l.normals[D],g=h.normals[D],z=d.normals[D],C=v.length,T=p.length,P=0,E=0;P<C;++P)if(b=v[P],A=b+s[D],I=o[b],S=o[A],I!==S&&(I===$.AIR||S===$.AIR)){for(a.t=f[P],a.n.x=m[3*P],a.n.y=m[3*P+1],a.n.z=m[3*P+2],i.type===Et.DIFFERENCE&&a.n.negate(),O=a;E<T&&p[E]<=b;)M=(U=p[E])+s[D],u.t=x[E],u.n.x=g[3*E],u.n.y=g[3*E+1],u.n.z=g[3*E+2],I=o[U],U<b?I===(S=o[M])||I!==$.AIR&&S!==$.AIR||(k[_]=U,w[_]=u.t,z[3*_]=u.n.x,z[3*_+1]=u.n.y,z[3*_+2]=u.n.z,++_):O=i.selectEdge(u,a,I===$.SOLID),++E;k[_]=b,w[_]=O.t,z[3*_]=O.n.x,z[3*_+1]=O.n.y,z[3*_+2]=O.n.z,++_}for(;E<T;)M=(U=p[E])+s[D],(I=o[U])===(S=o[M])||I!==$.AIR&&S!==$.AIR||(k[_]=U,w[_]=x[E],z[3*_]=g[3*E],z[3*_+1]=g[3*E+1],z[3*_+2]=g[3*E+2],++_),++E;y[D]=_}return{edgeData:d,lengths:y}}function O(t,i,n,e){var r=t.size,s=t.resolution,o=s+1,a=o*o,u=new Uint32Array([1,o,a]),l=n.materialIndices,h=t.min,c=new tt,d=new tt,y=new dt,v=new Ut(Ut.calculate1DEdgeCount(s)),f=new Uint32Array(3),m=void 0,p=void 0,x=void 0,g=void 0,k=void 0,w=void 0,z=void 0,b=void 0,A=void 0,U=void 0,M=void 0,I=void 0,S=void 0,O=void 0,_=void 0,D=void 0,P=void 0,E=void 0;for(O=4,I=0,S=0;S<3;O>>=1,I=0,++S){switch(_=B[O],m=v.edges[S],p=v.zeroCrossings[S],x=v.normals[S],w=e.min.x,A=e.max.x,z=e.min.y,U=e.max.y,b=e.min.z,M=e.max.z,S){case 0:w=Math.max(w-1,0),A=Math.min(A,s-1);break;case 1:z=Math.max(z-1,0),U=Math.min(U,s-1);break;case 2:b=Math.max(b-1,0),M=Math.min(M,s-1)}for(E=b;E<=M;++E)for(P=z;P<=U;++P)for(D=w;D<=A;++D)k=(g=E*a+P*o+D)+u[S],l[g]!==l[k]&&(c.set(D*r/s,P*r/s,E*r/s),d.set((D+_[0])*r/s,(P+_[1])*r/s,(E+_[2])*r/s),y.a.addVectors(h,c),y.b.addVectors(h,d),i.generateEdge(y),m[I]=g,p[I]=y.t,x[3*I]=y.n.x,x[3*I+1]=y.n.y,x[3*I+2]=y.n.z,++I);f[S]=I}return{edgeData:v,lengths:f}}function _(t,i,n,e){var r=U(t,i),s=void 0,o=void 0,a=void 0,u=void 0,l=!1;if(i.type===Et.DENSITY_FUNCTION?I(t,i,n,r):n.empty?i.type===Et.UNION&&(n.set(e),l=!0):n.full&&i.type===Et.UNION||M(t,i,n,e,r),!l&&!n.empty&&!n.full){for(o=(s=i.type===Et.DENSITY_FUNCTION?O(t,i,n,r):S(t,i,n,e)).edgeData,a=s.lengths,u=0;u<3;++u)o.edges[u]=o.edges[u].slice(0,a[u]),o.zeroCrossings[u]=o.zeroCrossings[u].slice(0,a[u]),o.normals[u]=o.normals[u].slice(0,3*a[u]);n.edgeData=o}}function D(t,i){var n=i.children,e=void 0,r=void 0,s=void 0,o=void 0;for(i.type===Et.DENSITY_FUNCTION&&_(t,i,e=new St),s=0,o=n.length;s<o&&(r=D(t,n[s]),void 0===e?e=r:null!==r?null===e?i.type===Et.UNION&&(e=r):_(t,i,e,r):i.type===Et.INTERSECTION&&(e=null),null!==e||i.type===Et.UNION);++s);return null!==e&&e.empty?null:e}var P=function(t,i){if(!(t instanceof i))throw new TypeError(\"Cannot call a class as a function\")},E=function(){function t(t,i){for(var n=0;n<i.length;n++){var e=i[n];e.enumerable=e.enumerable||!1,e.configurable=!0,\"value\"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(i,n,e){return n&&t(i.prototype,n),e&&t(i,e),i}}(),C=function t(i,n,e){null===i&&(i=Function.prototype);var r=Object.getOwnPropertyDescriptor(i,n);if(void 0===r){var s=Object.getPrototypeOf(i);return null===s?void 0:t(s,n,e)}if(\"value\"in r)return r.value;var o=r.get;if(void 0!==o)return o.call(e)},T=function(t,i){if(\"function\"!=typeof i&&null!==i)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof i);t.prototype=Object.create(i&&i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),i&&(Object.setPrototypeOf?Object.setPrototypeOf(t,i):t.__proto__=i)},N=function(t,i){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!i||\"object\"!=typeof i&&\"function\"!=typeof i?t:i},F=function(t){if(Array.isArray(t)){for(var i=0,n=Array(t.length);i<t.length;i++)n[i]=t[i];return n}return Array.from(t)},R=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;P(this,t),this.x=i,this.y=n,this.z=e}return E(t,[{key:\"set\",value:function(t,i,n){return this.x=t,this.y=i,this.z=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}},{key:\"addScaledVector\",value:function(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this.z+=t,this}},{key:\"addVectors\",value:function(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this.z-=t,this}},{key:\"subVectors\",value:function(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}},{key:\"multiplyScalar\",value:function(t){return isFinite(t)?(this.x*=t,this.y*=t,this.z*=t):(this.x=0,this.y=0,this.z=0),this}},{key:\"multiplyVectors\",value:function(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}},{key:\"divideScalar\",value:function(t){return this.multiplyScalar(1/t)}},{key:\"divideVectors\",value:function(t,i){return this.x=t.x/i.x,this.y=t.y/i.y,this.z=t.z/i.z,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z}},{key:\"lengthSq\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"distanceToSquared\",value:function(t){var i=this.x-t.x,n=this.y-t.y,e=this.z-t.z;return i*i+n*n+e*e}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}},{key:\"clamp\",value:function(t,i){return this.x=Math.max(t.x,Math.min(i.x,this.x)),this.y=Math.max(t.y,Math.min(i.y,this.y)),this.z=Math.max(t.z,Math.min(i.z,this.z)),this}},{key:\"applyMatrix3\",value:function(t){var i=this.x,n=this.y,e=this.z,r=t.elements;return this.x=r[0]*i+r[3]*n+r[6]*e,this.y=r[1]*i+r[4]*n+r[7]*e,this.z=r[2]*i+r[5]*n+r[8]*e,this}},{key:\"applyMatrix4\",value:function(t){var i=this.x,n=this.y,e=this.z,r=t.elements;return this.x=r[0]*i+r[4]*n+r[8]*e+r[12],this.y=r[1]*i+r[5]*n+r[9]*e+r[13],this.z=r[2]*i+r[6]*n+r[10]*e+r[14],this}}]),t}(),L=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new R,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new R;P(this,t),this.min=i,this.max=n,this.children=null}return E(t,[{key:\"getCenter\",value:function(){return this.min.clone().add(this.max).multiplyScalar(.5)}},{key:\"getDimensions\",value:function(){return this.max.clone().sub(this.min)}},{key:\"split\",value:function(t){var i=this.min,n=this.max,e=this.getCenter(),r=void 0,s=void 0,o=0,a=void 0,u=void 0,l=void 0,h=void 0,c=void 0;for(Array.isArray(t)&&(u=this.getDimensions().multiplyScalar(.5),l=[new R,new R,new R],o=t.length),this.children=[],r=0;r<8;++r){if(a=B[r],c=null,o>0)for(l[1].addVectors(i,l[0].fromArray(a).multiply(u)),l[2].addVectors(e,l[0].fromArray(a).multiply(u)),s=0;s<o;++s)if(null!==(h=t[s])&&l[1].equals(h.min)&&l[2].equals(h.max)){c=h,t[s]=null;break}this.children.push(null!==c?c:new this.constructor(new R(0===a[0]?i.x:e.x,0===a[1]?i.y:e.y,0===a[2]?i.z:e.z),new R(0===a[0]?e.x:n.x,0===a[1]?e.y:n.y,0===a[2]?e.z:n.z)))}}}]),t}(),B=[new Uint8Array([0,0,0]),new Uint8Array([0,0,1]),new Uint8Array([0,1,0]),new Uint8Array([0,1,1]),new Uint8Array([1,0,0]),new Uint8Array([1,0,1]),new Uint8Array([1,1,0]),new Uint8Array([1,1,1])],q=[new Uint8Array([0,4]),new Uint8Array([1,5]),new Uint8Array([2,6]),new Uint8Array([3,7]),new Uint8Array([0,2]),new Uint8Array([1,3]),new Uint8Array([4,6]),new Uint8Array([5,7]),new Uint8Array([0,1]),new Uint8Array([2,3]),new Uint8Array([4,5]),new Uint8Array([6,7])],V=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new R,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;P(this,t),this.min=i,this.size=n,this.children=null}return E(t,[{key:\"getCenter\",value:function(){return this.min.clone().addScalar(.5*this.size)}},{key:\"getDimensions\",value:function(){return new R(this.size,this.size,this.size)}},{key:\"split\",value:function(t){var i=this.min,n=this.getCenter(),e=.5*this.size,r=void 0,s=void 0,o=0,a=void 0,u=void 0,l=void 0,h=void 0;for(Array.isArray(t)&&(u=new R,o=t.length),this.children=[],r=0;r<8;++r){if(a=B[r],h=null,o>0)for(u.fromArray(a).multiplyScalar(e).add(i),s=0;s<o;++s)if(null!==(l=t[s])&&l.size===e&&u.equals(l.min)){h=l,t[s]=null;break}this.children.push(null!==h?h:new this.constructor(new R(0===a[0]?i.x:n.x,0===a[1]?i.y:n.y,0===a[2]?i.z:n.z),e))}}},{key:\"max\",get:function(){return this.min.clone().addScalar(this.size)}}]),t}(),j=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new R(1/0,1/0,1/0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new R(-1/0,-1/0,-1/0);P(this,t),this.min=i,this.max=n}return E(t,[{key:\"set\",value:function(t,i){return this.min.copy(t),this.max.copy(i),this}},{key:\"copy\",value:function(t){return this.min.copy(t.min),this.max.copy(t.max),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"expandByPoint\",value:function(t){return this.min.min(t),this.max.max(t),this}},{key:\"union\",value:function(t){return this.min.min(t.min),this.max.max(t.max),this}},{key:\"setFromPoints\",value:function(t){var i=void 0,n=void 0;for(i=0,n=t.length;i<n;++i)this.expandByPoint(t[i]);return this}},{key:\"setFromCenterAndSize\",value:function(t,i){var n=i.clone().multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}},{key:\"intersectsBox\",value:function(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}}]),t}(),H=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];P(this,t),this.value=i,this.done=n}return E(t,[{key:\"reset\",value:function(){this.value=null,this.done=!1}}]),t}(),Y=new j,G=function(){function t(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;P(this,t),this.octree=i,this.region=n,this.cull=null!==n,this.result=new H,this.trace=null,this.indices=null,this.reset()}return E(t,[{key:\"reset\",value:function(){var t=this.octree.root;return this.trace=[],this.indices=[],null!==t&&(Y.min=t.min,Y.max=t.max,this.cull&&!this.region.intersectsBox(Y)||(this.trace.push(t),this.indices.push(0))),this.result.reset(),this}},{key:\"next\",value:function(){for(var t=this.cull,i=this.region,n=this.indices,e=this.trace,r=null,s=e.length-1,o=void 0,a=void 0,u=void 0;null===r&&s>=0;)if(o=n[s],a=e[s].children,++n[s],o<8)if(null!==a){if(u=a[o],t&&(Y.min=u.min,Y.max=u.max,!i.intersectsBox(Y)))continue;e.push(u),n.push(0),++s}else r=e.pop(),n.pop();else e.pop(),n.pop(),--s;return this.result.value=r,this.result.done=null===r,this.result}},{key:\"return\",value:function(t){return this.result.value=t,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),X=new Uint8Array([0,1,2,3,4,5,6,7,0]),Z=[new Uint8Array([4,2,1]),new Uint8Array([5,3,8]),new Uint8Array([6,8,3]),new Uint8Array([7,8,8]),new Uint8Array([8,6,5]),new Uint8Array([8,7,8]),new Uint8Array([8,8,7]),new Uint8Array([8,8,8])],J=function(){function t(){P(this,t)}return E(t,null,[{key:\"intersectOctree\",value:function(t,i,e){var r=t.getDimensions(),s=r.clone().multiplyScalar(.5),o=t.min.clone().sub(t.min),a=t.max.clone().sub(t.min),u=i.ray.direction.clone(),l=i.ray.origin.clone();l.sub(t.getCenter()).add(s);var h=void 0,c=void 0,d=void 0,y=void 0,v=void 0,f=void 0,m=void 0,p=void 0,x=void 0;X[8]=X[0],u.x<0&&(l.x=r.x-l.x,u.x=-u.x,X[8]|=X[4]),u.y<0&&(l.y=r.y-l.y,u.y=-u.y,X[8]|=X[2]),u.z<0&&(l.z=r.z-l.z,u.z=-u.z,X[8]|=X[1]),h=1/u.x,c=1/u.y,d=1/u.z,y=(o.x-l.x)*h,v=(a.x-l.x)*h,f=(o.y-l.y)*c,m=(a.y-l.y)*c,p=(o.z-l.z)*d,x=(a.z-l.z)*d,Math.max(Math.max(y,f),p)<Math.min(Math.min(v,m),x)&&n(t.root,y,f,p,v,m,x,i,e)}}]),t}(),K=new j,Q=function(){function t(i,n){P(this,t),this.root=void 0!==i&&void 0!==n?new L(i,n):null}return E(t,[{key:\"getCenter\",value:function(){return this.root.getCenter()}},{key:\"getDimensions\",value:function(){return this.root.getDimensions()}},{key:\"getDepth\",value:function(){return e(this.root)}},{key:\"cull\",value:function(t){var i=[];return r(this.root,t,i),i}},{key:\"findOctantsByLevel\",value:function(t){var i=[];return s(this.root,t,0,i),i}},{key:\"raycast\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return J.intersectOctree(this,t,i),i}},{key:\"leaves\",value:function(t){return new G(this,t)}},{key:Symbol.iterator,value:function(){return new G(this)}},{key:\"min\",get:function(){return this.root.min}},{key:\"max\",get:function(){return this.root.max}},{key:\"children\",get:function(){return this.root.children}}]),t}(),W=function(t){function i(t,n){P(this,i);var e=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,n));return e.points=null,e.data=null,e}return T(i,t),E(i,[{key:\"distanceToSquared\",value:function(t){return t.clone().clamp(this.min,this.max).sub(t).lengthSq()}},{key:\"distanceToCenterSquared\",value:function(t){var i=this.getCenter(),n=t.x-i.x,e=t.y-i.x,r=t.z-i.z;return n*n+e*e+r*r}},{key:\"contains\",value:function(t,i){var n=this.min,e=this.max;return t.x>=n.x-i&&t.y>=n.y-i&&t.z>=n.z-i&&t.x<=e.x+i&&t.y<=e.y+i&&t.z<=e.z+i}},{key:\"redistribute\",value:function(t){var i=this.children,n=this.points,e=this.data,r=void 0,s=void 0,o=void 0,a=void 0,u=void 0;if(null!==i)for(;n.length>0;)for(a=n.pop(),u=e.pop(),r=0,s=i.length;r<s;++r)if((o=i[r]).contains(a,t)){null===o.points&&(o.points=[],o.data=[]),o.points.push(a),o.data.push(u);break}this.points=null,this.data=null}},{key:\"merge\",value:function(){var t=this.children,i=void 0,n=void 0,e=void 0;if(null!==t){for(this.points=[],this.data=[],i=0,n=t.length;i<n;++i)if(null!==(e=t[i]).points){var r,s;(r=this.points).push.apply(r,F(e.points)),(s=this.data).push.apply(s,F(e.data))}this.children=null}}}]),i}(L),$=(function(t){function i(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:8,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:8;P(this,i);var o=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return o.root=new W(t,n),o.bias=Math.max(0,e),o.biasSquared=o.bias*o.bias,o.maxPoints=Math.max(1,Math.round(r)),o.maxDepth=Math.max(0,Math.round(s)),o}T(i,t),E(i,[{key:\"countPoints\",value:function(){return o(this.root)}},{key:\"add\",value:function(t,i){a(this.root,t,i,0,this.bias,this.maxPoints,this.maxDepth)}},{key:\"remove\",value:function(t){u(this.root,null,t,this.bias,this.maxPoints)}},{key:\"fetch\",value:function(t){return l(this.root,t,this.bias,this.biasSquared)}},{key:\"findNearestPoint\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1/0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return h(this.root,t,i,n)}},{key:\"findPoints\",value:function(t,i){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],e=[];return c(this.root,t,i,n,e),e}},{key:\"raycast\",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],e=C(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),\"raycast\",this).call(this,t);return e.length>0&&this.testPoints(e,t,n),n}},{key:\"testPoints\",value:function(t,i,n){var e=i.params.Points.threshold,r=e*e,s=void 0,o=void 0,a=void 0,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0,y=void 0,v=void 0,f=void 0;for(l=0,c=t.length;l<c;++l)if(y=t[l],null!==(v=y.points))for(h=0,d=v.length;h<d;++h)f=v[h],(u=i.ray.distanceSqToPoint(f))<r&&(s=i.ray.closestPointToPoint(f),(o=i.ray.origin.distanceTo(s))>=i.near&&o<=i.far&&(a=Math.sqrt(u),n.push({distance:o,distanceToRay:a,point:s.clone(),object:y.data[h]})))}}])}(Q),{AIR:0,SOLID:1}),tt=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;P(this,t),this.x=i,this.y=n,this.z=e}return E(t,[{key:\"set\",value:function(t,i,n){return this.x=t,this.y=i,this.z=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}},{key:\"addScaledVector\",value:function(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this.z+=t,this}},{key:\"addVectors\",value:function(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this.z-=t,this}},{key:\"subVectors\",value:function(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}},{key:\"multiplyScalar\",value:function(t){return isFinite(t)?(this.x*=t,this.y*=t,this.z*=t):(this.x=0,this.y=0,this.z=0),this}},{key:\"multiplyVectors\",value:function(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}},{key:\"divideScalar\",value:function(t){return this.multiplyScalar(1/t)}},{key:\"divideVectors\",value:function(t,i){return this.x=t.x/i.x,this.y=t.y/i.y,this.z=t.z/i.z,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z}},{key:\"lengthSq\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"distanceToSquared\",value:function(t){var i=this.x-t.x,n=this.y-t.y,e=this.z-t.z;return i*i+n*n+e*e}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}},{key:\"clamp\",value:function(t,i){return this.x=Math.max(t.x,Math.min(i.x,this.x)),this.y=Math.max(t.y,Math.min(i.y,this.y)),this.z=Math.max(t.z,Math.min(i.z,this.z)),this}},{key:\"applyMatrix3\",value:function(t){var i=this.x,n=this.y,e=this.z,r=t.elements;return this.x=r[0]*i+r[3]*n+r[6]*e,this.y=r[1]*i+r[4]*n+r[7]*e,this.z=r[2]*i+r[5]*n+r[8]*e,this}},{key:\"applyMatrix4\",value:function(t){var i=this.x,n=this.y,e=this.z,r=t.elements;return this.x=r[0]*i+r[4]*n+r[8]*e+r[12],this.y=r[1]*i+r[5]*n+r[9]*e+r[13],this.z=r[2]*i+r[6]*n+r[10]*e+r[14],this}}]),t}(),it=function(){function t(){P(this,t),this.elements=new Float32Array([1,0,0,1,0,1])}return E(t,[{key:\"set\",value:function(t,i,n,e,r,s){var o=this.elements;return o[0]=t,o[1]=i,o[2]=n,o[3]=e,o[4]=r,o[5]=s,this}},{key:\"identity\",value:function(){return this.set(1,0,0,1,0,1),this}},{key:\"copy\",value:function(t){var i=t.elements;return this.set(i[0],i[1],i[2],i[3],i[4],i[5]),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"add\",value:function(t){var i=this.elements,n=t.elements;return i[0]+=n[0],i[1]+=n[1],i[2]+=n[2],i[3]+=n[3],i[4]+=n[4],i[5]+=n[5],this}},{key:\"norm\",value:function(){var t=this.elements,i=t[1]*t[1],n=t[2]*t[2],e=t[4]*t[4];return Math.sqrt(t[0]*t[0]+i+n+i+t[3]*t[3]+e+n+e+t[5]*t[5])}},{key:\"off\",value:function(){var t=this.elements;return Math.sqrt(2*(t[1]*t[1]+t[2]*t[2]+t[4]*t[4]))}},{key:\"applyToVector3\",value:function(t){var i=t.x,n=t.y,e=t.z,r=this.elements;return t.x=r[0]*i+r[1]*n+r[2]*e,t.y=r[1]*i+r[3]*n+r[4]*e,t.z=r[2]*i+r[4]*n+r[5]*e,t}}]),t}(),nt=function(){function t(){P(this,t),this.ata=new it,this.ata.set(0,0,0,0,0,0),this.atb=new tt,this.btb=0,this.massPoint=new tt,this.numPoints=0,this.massPointDimension=0}return E(t,[{key:\"set\",value:function(t,i,n,e,r){return this.ata.copy(t),this.atb.copy(i),this.btb=n,this.massPoint.copy(e),this.numPoints=r,this}},{key:\"copy\",value:function(t){return this.set(t.ata,t.atb,t.btb,t.massPoint,t.numPoints)}},{key:\"add\",value:function(t,i){var n=i.x,e=i.y,r=i.z,s=i.dot(t),o=this.ata.elements,a=this.atb;o[0]+=n*n,o[1]+=n*e,o[2]+=n*r,o[3]+=e*e,o[4]+=e*r,o[5]+=r*r,a.x+=s*n,a.y+=s*e,a.z+=s*r,this.btb+=s*s,this.massPoint.add(t),++this.numPoints}},{key:\"addData\",value:function(t){this.ata.add(t.ata),this.atb.add(t.atb),this.btb+=t.btb,this.massPoint.add(t.massPoint),this.numPoints+=t.numPoints}},{key:\"clear\",value:function(){this.ata.set(0,0,0,0,0,0),this.atb.set(0,0,0),this.btb=0,this.massPoint.set(0,0,0),this.numPoints=0}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}}]),t}(),et=function(){function t(){P(this,t),this.elements=new Float32Array([1,0,0,0,1,0,0,0,1])}return E(t,[{key:\"set\",value:function(t,i,n,e,r,s,o,a,u){var l=this.elements;return l[0]=t,l[3]=i,l[6]=n,l[1]=e,l[4]=r,l[7]=s,l[2]=o,l[5]=a,l[8]=u,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,1,0,0,0,1),this}},{key:\"copy\",value:function(t){var i=t.elements;return this.set(i[0],i[3],i[6],i[1],i[4],i[7],i[2],i[5],i[8])}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}}]),t}(),rt=function(){function t(){P(this,t)}return E(t,null,[{key:\"rot01Post\",value:function(t,i){var n=t.elements,e=n[0],r=n[3],s=n[1],o=n[4],a=n[2],u=n[5],l=i.c,h=i.s;n[0]=l*e-h*r,n[3]=h*e+l*r,n[1]=l*s-h*o,n[4]=h*s+l*o,n[2]=l*a-h*u,n[5]=h*a+l*u}},{key:\"rot02Post\",value:function(t,i){var n=t.elements,e=n[0],r=n[6],s=n[1],o=n[7],a=n[2],u=n[8],l=i.c,h=i.s;n[0]=l*e-h*r,n[6]=h*e+l*r,n[1]=l*s-h*o,n[7]=h*s+l*o,n[2]=l*a-h*u,n[8]=h*a+l*u}},{key:\"rot12Post\",value:function(t,i){var n=t.elements,e=n[3],r=n[6],s=n[4],o=n[7],a=n[5],u=n[8],l=i.c,h=i.s;n[3]=l*e-h*r,n[6]=h*e+l*r,n[4]=l*s-h*o,n[7]=h*s+l*o,n[5]=l*a-h*u,n[8]=h*a+l*u}}]),t}(),st={c:0,s:0},ot=function(){function t(){P(this,t)}return E(t,null,[{key:\"rot01\",value:function(t){var i=t.elements,n=i[0],e=i[1],r=i[2],s=i[3],o=i[4];d(n,e,s);var a=st.c,u=st.s,l=a*a,h=u*u,c=2*a*u*e;return i[0]=l*n-c+h*s,i[1]=0,i[2]=a*r-u*o,i[3]=h*n+c+l*s,i[4]=u*r+a*o,st}},{key:\"rot02\",value:function(t){var i=t.elements,n=i[0],e=i[1],r=i[2],s=i[4],o=i[5];d(n,r,o);var a=st.c,u=st.s,l=a*a,h=u*u,c=2*a*u*r;return i[0]=l*n-c+h*o,i[1]=a*e-u*s,i[2]=0,i[4]=u*e+a*s,i[5]=h*n+c+l*o,st}},{key:\"rot12\",value:function(t){var i=t.elements,n=i[1],e=i[2],r=i[3],s=i[4],o=i[5];d(r,s,o);var a=st.c,u=st.s,l=a*a,h=u*u,c=2*a*u*s;return i[1]=a*n-u*e,i[2]=u*n+a*e,i[3]=l*r-c+h*o,i[4]=0,i[5]=h*r+c+l*o,st}}]),t}(),at=function(){function t(){P(this,t)}return E(t,null,[{key:\"solveSymmetric\",value:function(t,i,n,e,r,s){var o=new et,a=new et,u=new it,l=void 0;return a.set(0,0,0,0,0,0,0,0,0),u.set(0,0,0,0,0,0),m(t,u,o,e,r),l=x(a,u,o,s),n.copy(i).applyMatrix3(a),l}},{key:\"calculateError\",value:function(t,i,n){var e=t.elements,r=n.clone(),s=new et;return s.set(e[0],e[1],e[2],e[1],e[3],e[4],e[2],e[4],e[5]),r.applyMatrix3(s),r.subVectors(i,r),r.lengthSq()}}]),t}(),ut=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e-6,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:4,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1e-6;P(this,t),this.svdThreshold=i,this.svdSweeps=n,this.pseudoInverseThreshold=e,this.data=null,this.massPoint=new tt,this.ata=new it,this.atb=new tt,this.x=new tt,this.hasSolution=!1}return E(t,[{key:\"computeError\",value:function(){var t=this.x,i=1/0,n=void 0;return this.hasSolution&&(n=this.ata.applyToVector3(t.clone()),i=t.dot(n)-2*t.dot(this.atb)+this.data.btb),i}},{key:\"setData\",value:function(t){return this.data=t,this.hasSolution=!1,this}},{key:\"solve\",value:function(){var t=this.data,i=this.massPoint,n=this.ata,e=this.atb,r=this.x,s=void 0;return!this.hasSolution&&null!==t&&t.numPoints>0&&(i.copy(t.massPoint),i.divideScalar(t.numPoints),n.copy(t.ata),e.copy(t.atb),s=n.applyToVector3(i.clone()),e.sub(s),r.set(0,0,0),t.massPointDimension=at.solveSymmetric(n,e,r,this.svdThreshold,this.svdSweeps,this.pseudoInverseThreshold),r.add(i),e.copy(t.atb),this.hasSolution=!0),r}},{key:\"clear\",value:function(){this.data=null,this.hasSolution=!1}}]),t}(),lt=new tt,ht=new tt,ct=new tt,dt=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new tt,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new tt;P(this,t),this.a=i,this.b=n,this.t=0,this.n=new tt}return E(t,[{key:\"approximateZeroCrossing\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,n=Math.max(1,i-1),e=0,r=1,s=0,o=0,a=void 0,u=void 0;for(lt.subVectors(this.b,this.a);o<=n&&(s=(e+r)/2,ht.addVectors(this.a,ct.copy(lt).multiplyScalar(s)),u=t.sample(ht),!(Math.abs(u)<=.01||(r-e)/2<=1e-6));)ht.addVectors(this.a,ct.copy(lt).multiplyScalar(e)),a=t.sample(ht),Math.sign(u)===Math.sign(a)?e=s:r=s,++o;this.t=s}},{key:\"computeZeroCrossingPosition\",value:function(){return lt.subVectors(this.b,this.a).multiplyScalar(this.t).add(this.a)}},{key:\"computeSurfaceNormal\",value:function(t){var i=this.computeZeroCrossingPosition(),n=.001,e=t.sample(ht.addVectors(i,ct.set(n,0,0)))-t.sample(ht.subVectors(i,ct.set(n,0,0))),r=t.sample(ht.addVectors(i,ct.set(0,n,0)))-t.sample(ht.subVectors(i,ct.set(0,n,0))),s=t.sample(ht.addVectors(i,ct.set(0,0,n)))-t.sample(ht.subVectors(i,ct.set(0,0,n)));this.n.set(e,r,s).normalize()}}]),t}(),yt=function t(){P(this,t),this.materials=0,this.edgeCount=0,this.index=-1,this.position=new tt,this.normal=new tt,this.qefData=null},vt=0,ft=function(t){function i(t,n){P(this,i);var e=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,n));return e.voxel=null,e}return T(i,t),E(i,[{key:\"contains\",value:function(t){var i=this.min,n=this.size;return t.x>=i.x-1e-6&&t.y>=i.y-1e-6&&t.z>=i.z-1e-6&&t.x<=i.x+n+1e-6&&t.y<=i.y+n+1e-6&&t.z<=i.z+n+1e-6}},{key:\"collapse\",value:function(){var t=this.children,i=new Int16Array([-1,-1,-1,-1,-1,-1,-1,-1]),n=-1,e=null!==t,r=0,s=void 0,o=void 0,a=void 0,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0;if(e){for(s=new nt,c=0,d=0;d<8;++d)r+=(a=t[d]).collapse(),l=a.voxel,null!==a.children?e=!1:null!==l&&(s.addData(l.qefData),n=l.materials>>7-d&1,i[d]=l.materials>>d&1,++c);if(e&&(o=new ut,h=o.setData(s).solve(),o.computeError()<=vt)){for((l=new yt).position.copy(this.contains(h)?h:o.massPoint),d=0;d<8;++d)u=i[d],a=t[d],-1===u?l.materials|=n<<d:(l.materials|=u<<d,l.normal.add(a.voxel.normal));l.normal.normalize(),l.qefData=s,this.voxel=l,this.children=null,r+=c-1}}return r}},{key:\"lod\",get:function(){return vt},set:function(t){vt=.01+t*t*t}}]),i}(V),mt=function(t){function i(t){P(this,i);var n=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return n.root=new ft(t.min,t.size),n.root.lod=t.data.lod,n.voxelCount=0,n.construct(t),n.simplify(),n}return T(i,t),E(i,[{key:\"simplify\",value:function(){this.voxelCount-=this.root.collapse()}},{key:\"getCell\",value:function(t,i,n,e){var r=this.root,s=0;for(t>>=1;t>0;t>>=1,s=0)i>=t&&(s+=4,i-=t),n>=t&&(s+=2,n-=t),e>=t&&(s+=1,e-=t),null===r.children&&r.split(),r=r.children[s];return r}},{key:\"construct\",value:function(t){var i=t.size,n=t.resolution,e=n+1,r=e*e,s=t.data,o=s.edgeData,a=s.materialIndices,u=new ut,l=t.min,h=new tt,c=new tt,d=new tt,y=new dt,v=[new Uint8Array([0,1,2,3]),new Uint8Array([0,1,4,5]),new Uint8Array([0,2,4,6])],f=0,m=void 0,p=void 0,x=void 0,k=void 0,w=void 0,z=void 0,b=void 0,A=void 0,U=void 0,M=void 0,I=void 0,S=void 0,O=void 0,_=void 0,D=void 0,P=void 0,E=void 0,C=void 0,T=void 0,N=void 0,F=void 0;for(M=4,I=0;I<3;++I,M>>=1)for(A=B[M],m=o.edges[I],p=o.zeroCrossings[I],x=o.normals[I],k=v[I],S=0,_=m.length;S<_;++S)for(C=(F=m[S])%e,T=Math.trunc(F%r/e),N=Math.trunc(F/r),h.set(C*i/n,T*i/n,N*i/n),c.set((C+A[0])*i/n,(T+A[1])*i/n,(N+A[2])*i/n),y.a.addVectors(l,h),y.b.addVectors(l,c),y.t=p[S],y.n.fromArray(x,3*S),d.copy(y.computeZeroCrossingPosition()),O=0;O<4;++O)D=C-(w=B[k[O]])[0],P=T-w[1],E=N-w[2],D>=0&&P>=0&&E>=0&&D<n&&P<n&&E<n&&(null===(U=this.getCell(n,D,P,E)).voxel&&(U.voxel=g(n,D,P,E,a),++f),(z=U.voxel).normal.add(y.n),z.qefData.add(d,y.n),z.qefData.numPoints===z.edgeCount&&(b=u.setData(z.qefData).solve(),z.position.copy(U.contains(b)?b:u.massPoint),z.normal.normalize()));this.voxelCount=f}}]),i}(Q),pt=[new Uint8Array([0,4,0]),new Uint8Array([1,5,0]),new Uint8Array([2,6,0]),new Uint8Array([3,7,0]),new Uint8Array([0,2,1]),new Uint8Array([4,6,1]),new Uint8Array([1,3,1]),new Uint8Array([5,7,1]),new Uint8Array([0,1,2]),new Uint8Array([2,3,2]),new Uint8Array([4,5,2]),new Uint8Array([6,7,2])],xt=[new Uint8Array([0,1,2,3,0]),new Uint8Array([4,5,6,7,0]),new Uint8Array([0,4,1,5,1]),new Uint8Array([2,6,3,7,1]),new Uint8Array([0,2,4,6,2]),new Uint8Array([1,3,5,7,2])],gt=[[new Uint8Array([4,0,0]),new Uint8Array([5,1,0]),new Uint8Array([6,2,0]),new Uint8Array([7,3,0])],[new Uint8Array([2,0,1]),new Uint8Array([6,4,1]),new Uint8Array([3,1,1]),new Uint8Array([7,5,1])],[new Uint8Array([1,0,2]),new Uint8Array([3,2,2]),new Uint8Array([5,4,2]),new Uint8Array([7,6,2])]],kt=[[new Uint8Array([1,4,0,5,1,1]),new Uint8Array([1,6,2,7,3,1]),new Uint8Array([0,4,6,0,2,2]),new Uint8Array([0,5,7,1,3,2])],[new Uint8Array([0,2,3,0,1,0]),new Uint8Array([0,6,7,4,5,0]),new Uint8Array([1,2,0,6,4,2]),new Uint8Array([1,3,1,7,5,2])],[new Uint8Array([1,1,0,3,2,0]),new Uint8Array([1,5,4,7,6,0]),new Uint8Array([0,1,5,0,4,1]),new Uint8Array([0,3,7,2,6,1])]],wt=[[new Uint8Array([3,2,1,0,0]),new Uint8Array([7,6,5,4,0])],[new Uint8Array([5,1,4,0,1]),new Uint8Array([7,3,6,2,1])],[new Uint8Array([6,4,2,0,2]),new Uint8Array([7,5,3,1,2])]],zt=[new Uint8Array([3,2,1,0]),new Uint8Array([7,5,6,4]),new Uint8Array([11,10,9,8])],bt=function(){function t(){P(this,t)}return E(t,null,[{key:\"run\",value:function(t){var i=[],n=new mt(t),e=n.voxelCount,r=null,s=null,o=null;return e>65536?console.warn(\"Could not create geometry for chunk at position\",this.chunk.min,\"with lod\",this.chunk.data.lod,\"(vertex count of\",e,\"exceeds limit of 65536)\"):e>0&&(s=new Float32Array(3*e),o=new Float32Array(3*e),A(n.root,s,o,0),b(n.root,i),r={indices:new Uint16Array(i),positions:s,normals:o}),r}}]),t}(),At=function(){function t(){P(this,t)}return E(t,null,[{key:\"encode\",value:function(t){var i=[],n=[],e=t[0],r=1,s=void 0,o=void 0;for(s=1,o=t.length;s<o;++s)e!==t[s]?(i.push(r),n.push(e),e=t[s],r=1):++r;return i.push(r),n.push(e),{runLengths:i,data:n}}},{key:\"decode\",value:function(t,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],e=void 0,r=void 0,s=void 0,o=void 0,a=void 0,u=0;for(r=0,o=i.length;r<o;++r)for(e=i[r],s=0,a=t[r];s<a;++s)n[u++]=e;return n}}]),t}(),Ut=function(){function t(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i;P(this,t),this.edges=[new Uint32Array(i),new Uint32Array(n),new Uint32Array(e)],this.zeroCrossings=[new Float32Array(i),new Float32Array(n),new Float32Array(e)],this.normals=[new Float32Array(3*i),new Float32Array(3*n),new Float32Array(3*e)]}return E(t,[{key:\"createTransferList\",value:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=[this.edges[0],this.edges[1],this.edges[2],this.zeroCrossings[0],this.zeroCrossings[1],this.zeroCrossings[2],this.normals[0],this.normals[1],this.normals[2]],n=void 0;i.length>0;)null!==(n=i.pop())&&t.push(n.buffer);return t}},{key:\"serialise\",value:function(){return{edges:this.edges,zeroCrossings:this.zeroCrossings,normals:this.normals}}},{key:\"deserialise\",value:function(t){this.edges=t.edges,this.zeroCrossings=t.zeroCrossings,this.normals=t.normals}}],[{key:\"calculate1DEdgeCount\",value:function(t){return Math.pow(t+1,2)*t}}]),t}(),Mt=0,It=0,St=function(){function t(){var i=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];P(this,t),this.lod=-1,this.neutered=!1,this.materials=0,this.materialIndices=i?new Uint8Array(It):null,this.runLengths=null,this.edgeData=null}return E(t,[{key:\"set\",value:function(t){return this.lod=t.lod,this.neutered=t.neutered,this.materials=t.materials,this.materialIndices=t.materialIndices,this.runLengths=t.runLengths,this.edgeData=t.edgeData,this}},{key:\"setMaterialIndex\",value:function(t,i){this.materialIndices[t]===$.AIR?i!==$.AIR&&++this.materials:i===$.AIR&&--this.materials,this.materialIndices[t]=i}},{key:\"compress\",value:function(){var t=void 0;return null===this.runLengths&&(t=this.full?{runLengths:[this.materialIndices.length],data:[$.SOLID]}:At.encode(this.materialIndices),this.runLengths=new Uint32Array(t.runLengths),this.materialIndices=new Uint8Array(t.data)),this}},{key:\"decompress\",value:function(){return null!==this.runLengths&&(this.materialIndices=At.decode(this.runLengths,this.materialIndices,new Uint8Array(It)),this.runLengths=null),this}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return null!==this.edgeData&&this.edgeData.createTransferList(t),t.push(this.materialIndices.buffer),t.push(this.runLengths.buffer),t}},{key:\"serialise\",value:function(){return this.neutered=!0,{lod:this.lod,materials:this.materials,materialIndices:this.materialIndices,runLengths:this.runLengths,edgeData:null!==this.edgeData?this.edgeData.serialise():null}}},{key:\"deserialise\",value:function(t){this.lod=t.lod,this.materials=t.materials,this.materialIndices=t.materialIndices,this.runLengths=t.runLengths,null!==t.edgeData?(null===this.edgeData&&(this.edgeData=new Ut(0)),this.edgeData.deserialise(t.edgeData)):this.edgeData=null,this.neutered=!1}},{key:\"empty\",get:function(){return 0===this.materials}},{key:\"full\",get:function(){return this.materials===It}}],[{key:\"resolution\",get:function(){return Mt},set:function(t){0===Mt&&(Mt=Math.max(1,Math.min(256,t)),It=Math.pow(Mt+1,3))}}]),t}(),Ot=function(t){function i(t,n){P(this,i);var e=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,n));return e.data=null,e.csg=null,e}return T(i,t),E(i,[{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return null!==this.data?this.data.createTransferList(t):t}},{key:\"serialise\",value:function(){return{resolution:this.resolution,min:this.min.toArray(),size:this.size,data:null!==this.data?this.data.serialise():null}}},{key:\"deserialise\",value:function(t){this.resolution=t.resolution,this.min.fromArray(t.min),this.size=t.size,null!==t.data?(null===this.data&&(this.data=new St(!1)),this.data.deserialise(t.data)):this.data=null}},{key:\"resolution\",get:function(){return St.resolution},set:function(t){St.resolution=t}}]),i}(V),_t={EXTRACT:\"worker.extract\",MODIFY:\"worker.modify\",CLOSE:\"worker.close\"},Dt=function(){function t(){P(this,t),this.chunk=new Ot,this.message={action:_t.EXTRACT,chunk:null,positions:null,normals:null,indices:null},this.transferList=null}return E(t,[{key:\"extract\",value:function(t){var i=this.message,n=[];this.chunk.deserialise(t),this.chunk.data.decompress();var e=bt.run(this.chunk);null!==e?(i.indices=e.indices,i.positions=e.positions,i.normals=e.normals,n.push(i.indices.buffer),n.push(i.positions.buffer),n.push(i.normals.buffer)):(i.indices=null,i.positions=null,i.normals=null),this.chunk.deserialise(t),i.chunk=this.chunk.serialise(),this.transferList=this.chunk.createTransferList(n)}}]),t}(),Pt=function(){function t(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new tt(1/0,1/0,1/0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new tt(-1/0,-1/0,-1/0);P(this,t),this.min=i,this.max=n}return E(t,[{key:\"set\",value:function(t,i){return this.min.copy(t),this.max.copy(i),this}},{key:\"copy\",value:function(t){return this.min.copy(t.min),this.max.copy(t.max),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"expandByPoint\",value:function(t){return this.min.min(t),this.max.max(t),this}},{key:\"union\",value:function(t){return this.min.min(t.min),this.max.max(t.max),this}},{key:\"setFromPoints\",value:function(t){var i=void 0,n=void 0;for(i=0,n=t.length;i<n;++i)this.expandByPoint(t[i]);return this}},{key:\"setFromCenterAndSize\",value:function(t,i){var n=i.clone().multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}},{key:\"intersectsBox\",value:function(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}}]),t}(),Et={UNION:\"csg.union\",DIFFERENCE:\"csg.difference\",INTERSECTION:\"csg.intersection\",DENSITY_FUNCTION:\"csg.densityfunction\"},Ct=function(){function t(i){P(this,t),this.type=i;for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];this.children=e,this.bbox=null}return E(t,[{key:\"computeBoundingBox\",value:function(){var t=this.children,i=void 0,n=void 0;for(this.bbox=new Pt,i=0,n=t.length;i<n;++i)this.bbox.union(t[i].boundingBox);return this.bbox}},{key:\"boundingBox\",get:function(){return null!==this.bbox?this.bbox:this.computeBoundingBox()}}]),t}(),Tt=function(t){function i(){var t;P(this,i);for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];return N(this,(t=i.__proto__||Object.getPrototypeOf(i)).call.apply(t,[this,Et.UNION].concat(e)))}return T(i,t),E(i,[{key:\"updateMaterialIndex\",value:function(t,i,n){var e=n.materialIndices[t];e!==$.AIR&&i.setMaterialIndex(t,e)}},{key:\"selectEdge\",value:function(t,i,n){return n?t.t>i.t?t:i:t.t<i.t?t:i}}]),i}(Ct),Nt=function(t){function i(){var t;P(this,i);for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];return N(this,(t=i.__proto__||Object.getPrototypeOf(i)).call.apply(t,[this,Et.DIFFERENCE].concat(e)))}return T(i,t),E(i,[{key:\"updateMaterialIndex\",value:function(t,i,n){n.materialIndices[t]!==$.AIR&&i.setMaterialIndex(t,$.AIR)}},{key:\"selectEdge\",value:function(t,i,n){return n?t.t<i.t?t:i:t.t>i.t?t:i}}]),i}(Ct),Ft=function(t){function i(){var t;P(this,i);for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];return N(this,(t=i.__proto__||Object.getPrototypeOf(i)).call.apply(t,[this,Et.INTERSECTION].concat(e)))}return T(i,t),E(i,[{key:\"updateMaterialIndex\",value:function(t,i,n){var e=n.materialIndices[t];i.setMaterialIndex(t,i.materialIndices[t]!==$.AIR&&e!==$.AIR?e:$.AIR)}},{key:\"selectEdge\",value:function(t,i,n){return n?t.t<i.t?t:i:t.t>i.t?t:i}}]),i}(Ct),Rt=function(){function t(){P(this,t)}return E(t,null,[{key:\"run\",value:function(t,i){null===t.data?i.operation===Et.UNION&&(t.data=new St,t.data.edgeData=new Ut(0)):t.data.decompress();var n=i.toCSG(),e=null!==t.data?D(t,n):null;if(null!==e){switch(i.operation){case Et.UNION:n=new Tt(n);break;case Et.DIFFERENCE:n=new Nt(n);break;case Et.INTERSECTION:n=new Ft(n)}_(t,n,t.data,e),t.data.lod=-1}null!==t.data&&(t.data.empty?t.data=null:t.data.compress())}}]),t}(),Lt={SPHERE:\"sdf.sphere\",BOX:\"sdf.box\",TORUS:\"sdf.torus\",PLANE:\"sdf.plane\",HEIGHTFIELD:\"sdf.heightfield\"},Bt=function(t){function i(t){P(this,i);var n=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,Et.DENSITY_FUNCTION));return n.sdf=t,n}return T(i,t),E(i,[{key:\"computeBoundingBox\",value:function(){return this.bbox=this.sdf.computeBoundingBox(),this.bbox}},{key:\"generateMaterialIndex\",value:function(t){return this.sdf.sample(t)<=0?this.sdf.material:$.AIR}},{key:\"generateEdge\",value:function(t){t.approximateZeroCrossing(this.sdf),t.computeSurfaceNormal(this.sdf)}}]),i}(Ct),qt=function(){function t(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:$.SOLID;P(this,t),this.type=i,this.operation=null,this.material=Math.min(255,Math.max($.SOLID,Math.trunc(n))),this.children=[],this.bbox=null}return E(t,[{key:\"union\",value:function(t){return t.operation=Et.UNION,this.children.push(t),this}},{key:\"subtract\",value:function(t){return t.operation=Et.DIFFERENCE,this.children.push(t),this}},{key:\"intersect\",value:function(t){return t.operation=Et.INTERSECTION,this.children.push(t),this}},{key:\"serialise\",value:function(){var t={type:this.type,operation:this.operation,material:this.material,parameters:null,children:[]},i=this.children,n=void 0,e=void 0;for(n=0,e=i.length;n<e;++n)t.children.push(i[n].serialise());return t}},{key:\"toCSG\",value:function(){var t=this.children,i=new Bt(this),n=void 0,e=void 0,r=void 0,s=void 0;for(r=0,s=t.length;r<s;++r){if(e=t[r],n!==e.operation)switch(n=e.operation){case Et.UNION:i=new Tt(i);break;case Et.DIFFERENCE:i=new Nt(i);break;case Et.INTERSECTION:i=new Ft(i)}i.children.push(e.toCSG())}return i}},{key:\"computeBoundingBox\",value:function(){throw new Error(\"SDF: bounding box method not implemented!\")}},{key:\"sample\",value:function(t){throw new Error(\"SDF: sample method not implemented!\")}},{key:\"boundingBox\",get:function(){return null!==this.bbox?this.bbox:this.computeBoundingBox()}},{key:\"completeBoundingBox\",get:function(){var t=this.children,i=this.boundingBox.clone(),n=void 0,e=void 0;for(n=0,e=t.length;n<e;++n)i.union(t[n].completeBoundingBox);return i}}]),t}(),Vt=function(t){function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];P(this,i);var e=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,Lt.SPHERE,n));return e.origin=new(Function.prototype.bind.apply(tt,[null].concat(F(t.origin)))),e.radius=t.radius,e}return T(i,t),E(i,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new Pt,this.bbox.min.copy(this.origin).subScalar(this.radius),this.bbox.max.copy(this.origin).addScalar(this.radius),this.bbox}},{key:\"sample\",value:function(t){var i=this.origin,n=t.x-i.x,e=t.y-i.y,r=t.z-i.z;return Math.sqrt(n*n+e*e+r*r)-this.radius}},{key:\"serialise\",value:function(){var t=C(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),\"serialise\",this).call(this);return t.parameters={origin:this.origin.toArray(),radius:this.radius},t}}]),i}(qt),jt=function(t){function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];P(this,i);var e=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,Lt.BOX,n));return e.origin=new(Function.prototype.bind.apply(tt,[null].concat(F(t.origin)))),e.halfDimensions=new(Function.prototype.bind.apply(tt,[null].concat(F(t.halfDimensions)))),e}return T(i,t),E(i,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new Pt,this.bbox.min.subVectors(this.origin,this.halfDimensions),this.bbox.max.addVectors(this.origin,this.halfDimensions),this.bbox}},{key:\"sample\",value:function(t){var i=this.origin,n=this.halfDimensions,e=Math.abs(t.x-i.x)-n.x,r=Math.abs(t.y-i.y)-n.y,s=Math.abs(t.z-i.z)-n.z,o=Math.max(e,Math.max(r,s)),a=Math.max(e,0),u=Math.max(r,0),l=Math.max(s,0),h=Math.sqrt(a*a+u*u+l*l);return Math.min(o,0)+h}},{key:\"serialise\",value:function(){var t=C(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),\"serialise\",this).call(this);return t.parameters={origin:this.origin.toArray(),halfDimensions:this.halfDimensions.toArray()},t}}]),i}(qt),Ht=function(t){function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];P(this,i);var e=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,Lt.PLANE,n));return e.normal=new(Function.prototype.bind.apply(tt,[null].concat(F(t.normal)))),e.constant=t.constant,e}return T(i,t),E(i,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new Pt,this.bbox}},{key:\"sample\",value:function(t){return this.normal.dot(t)+this.constant}},{key:\"serialise\",value:function(){var t=C(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),\"serialise\",this).call(this);return t.parameters={normal:this.normal.toArray(),constant:this.constant},t}}]),i}(qt),Yt=function(t){function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];P(this,i);var e=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,Lt.TORUS,n));return e.origin=new(Function.prototype.bind.apply(tt,[null].concat(F(t.origin)))),e.R=t.R,e.r=t.r,e}return T(i,t),E(i,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new Pt,this.bbox.min.copy(this.origin).subScalar(this.R).subScalar(this.r),this.bbox.max.copy(this.origin).addScalar(this.R).addScalar(this.r),this.bbox}},{key:\"sample\",value:function(t){var i=this.origin,n=t.x-i.x,e=t.y-i.y,r=t.z-i.z,s=Math.sqrt(n*n+r*r)-this.R;return Math.sqrt(s*s+e*e)-this.r}},{key:\"serialise\",value:function(){var t=C(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),\"serialise\",this).call(this);return t.parameters={origin:this.origin.toArray(),R:this.R,r:this.r},t}}]),i}(qt),Gt=function(t){function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];P(this,i);var e=N(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,Lt.HEIGHTFIELD,n));return e.min=new(Function.prototype.bind.apply(tt,[null].concat(F(t.min)))),e.dimensions=new(Function.prototype.bind.apply(tt,[null].concat(F(t.size)))),e.data=t.data,e}return T(i,t),E(i,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new Pt,this.bbox.min.copy(this.min),this.bbox.max.addVectors(this.min,this.dimensions),this.bbox}},{key:\"sample\",value:function(t){var i=this.min,n=this.dimensions,e=Math.max(i.x,Math.min(i.x+n.x,t.x-i.x)),r=Math.max(i.z,Math.min(i.z+n.z,t.z-i.z));return t.y-i.y-this.data[r*n.x+e]/255*n.y}},{key:\"serialise\",value:function(){var t=C(i.prototype.__proto__||Object.getPrototypeOf(i.prototype),\"serialise\",this).call(this);return t.parameters={min:this.min.toArray(),dimensions:this.dimensions.toArray(),data:this.data},t}}]),i}(qt),Xt=function(){function t(){P(this,t)}return E(t,null,[{key:\"reviveSDF\",value:function(t){var i=void 0,n=void 0,e=void 0;switch(t.type){case Lt.SPHERE:i=new Vt(t.parameters,t.material);break;case Lt.BOX:i=new jt(t.parameters,t.material);break;case Lt.TORUS:i=new Yt(t.parameters,t.material);break;case Lt.PLANE:i=new Ht(t.parameters,t.material);break;case Lt.HEIGHTFIELD:i=new Gt(t.parameters,t.material)}for(i.operation=t.operation,n=0,e=t.children.length;n<e;++n)i.children.push(this.reviveSDF(t.children[n]));return i}}]),t}(),Zt=function(){function t(){P(this,t),this.chunk=new Ot,this.message={action:_t.MODIFY,chunk:null},this.transferList=null}return E(t,[{key:\"modify\",value:function(t,i){this.chunk.deserialise(t),Rt.run(this.chunk,Xt.reviveSDF(i)),this.message.chunk=this.chunk.serialise(),this.transferList=this.chunk.createTransferList()}}]),t}(),Jt=new Dt,Kt=new Zt;self.addEventListener(\"message\",function(t){var i=t.data;switch(i.action){case _t.EXTRACT:Jt.extract(i.chunk),postMessage(Jt.message,Jt.transferList);break;case _t.MODIFY:Kt.modify(i.chunk,i.sdf),postMessage(Kt.message,Kt.transferList);break;case _t.CLOSE:default:close()}}),self.addEventListener(\"error\",function(t){var i={action:_t.CLOSE,error:t.message,data:null},n=[],e=[Jt.chunk,Kt.chunk];null===e[0].data||e[0].data.neutered?null===e[1].data||e[1].data.neutered||(i.chunk=e[1].serialise(),e[1].createTransferList(n)):(i.chunk=e[0].serialise(),e[0].createTransferList(n)),postMessage(i,n),close()})}();";

  var ThreadPool = function (_EventTarget) {
  		inherits(ThreadPool, _EventTarget);

  		function ThreadPool() {
  				var maxWorkers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.hardwareConcurrency;
  				classCallCheck(this, ThreadPool);

  				var _this = possibleConstructorReturn(this, (ThreadPool.__proto__ || Object.getPrototypeOf(ThreadPool)).call(this));

  				_this.workerURL = URL.createObjectURL(new Blob([worker], { type: "text/javascript" }));

  				_this.maxWorkers = Math.min(navigator.hardwareConcurrency, Math.max(maxWorkers, 1));

  				_this.workers = [];

  				_this.busyWorkers = new WeakSet();

  				return _this;
  		}

  		createClass(ThreadPool, [{
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "message":
  										this.busyWorkers.delete(event.target);
  										message.worker = event.target;
  										message.data = event.data;
  										this.dispatchEvent(message);
  										break;

  								case "error":
  										console.error("Encountered an unexpected error.", event.message);
  										break;

  						}
  				}
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
  		}, {
  				key: "createWorker",
  				value: function createWorker() {

  						var worker$$1 = new Worker(this.workerURL);

  						this.workers.push(worker$$1);

  						worker$$1.addEventListener("message", this);
  						worker$$1.addEventListener("error", this);

  						return worker$$1;
  				}
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

  						if (worker$$1 === null && this.workers.length < this.maxWorkers) {

  								if (this.workerURL !== null) {

  										worker$$1 = this.createWorker();
  										this.busyWorkers.add(worker$$1);
  								}
  						}

  						return worker$$1;
  				}
  		}, {
  				key: "clear",
  				value: function clear() {

  						while (this.workers.length > 0) {

  								this.closeWorker(this.workers.pop());
  						}
  				}
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

  var WorkerTask = function (_Task) {
  		inherits(WorkerTask, _Task);

  		function WorkerTask(action, chunk, priority) {
  				classCallCheck(this, WorkerTask);

  				var _this = possibleConstructorReturn(this, (WorkerTask.__proto__ || Object.getPrototypeOf(WorkerTask)).call(this, priority));

  				_this.action = action;

  				_this.chunk = chunk;

  				return _this;
  		}

  		return WorkerTask;
  }(Task);

  var TerrainEvent = function (_Event) {
  	inherits(TerrainEvent, _Event);

  	function TerrainEvent(type) {
  		classCallCheck(this, TerrainEvent);

  		var _this = possibleConstructorReturn(this, (TerrainEvent.__proto__ || Object.getPrototypeOf(TerrainEvent)).call(this, type));

  		_this.chunk = null;

  		return _this;
  	}

  	return TerrainEvent;
  }(Event);

  var modificationstart = new TerrainEvent("modificationstart");

  var modificationend = new TerrainEvent("modificationend");

  var extractionstart = new TerrainEvent("extractionstart");

  var extractionend = new TerrainEvent("extractionend");

  var box3 = new three.Box3();

  var matrix4 = new three.Matrix4();

  var Terrain = function (_EventTarget) {
  		inherits(Terrain, _EventTarget);

  		function Terrain() {
  				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				classCallCheck(this, Terrain);

  				var _this = possibleConstructorReturn(this, (Terrain.__proto__ || Object.getPrototypeOf(Terrain)).call(this));

  				_this.object = new three.Object3D();
  				_this.object.name = "Terrain";

  				_this.volume = new Volume(options.chunkSize, options.resolution);

  				_this.iterator = _this.volume.leaves(new three.Frustum());

  				_this.levels = options.levels !== undefined ? Math.max(1, options.levels) : Math.log2(_this.volume.resolution);

  				_this.iterations = options.iterations !== undefined ? Math.max(1, options.iterations) : 1000;

  				_this.threadPool = new ThreadPool(options.workers);
  				_this.threadPool.addEventListener("message", _this);

  				_this.scheduler = new Scheduler(_this.levels + 1);

  				_this.history = new History();

  				_this.neutered = new WeakSet();

  				_this.chunks = new WeakMap();

  				_this.meshes = new WeakMap();

  				_this.material = new MeshTriplanarPhysicalMaterial();

  				return _this;
  		}

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
  		}, {
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						var worker = event.worker;
  						var data = event.data;

  						var chunk = this.chunks.get(worker);

  						this.neutered.delete(chunk);
  						this.chunks.delete(worker);

  						chunk.deserialise(data.chunk);

  						if (chunk.data === null && chunk.csg === null) {
  								this.scheduler.cancel(chunk);
  								this.volume.prune(chunk);
  								this.unlinkMesh(chunk);
  						} else if (chunk.csg !== null) {
  								this.scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, this.scheduler.maxPriority));
  						}

  						if (data.action !== Action.CLOSE) {

  								if (data.action === Action.EXTRACT) {

  										event = extractionend;

  										this.consolidate(chunk, data);
  								} else {

  										event = modificationend;
  								}

  								event.chunk = chunk;

  								this.dispatchEvent(event);
  						} else {

  								console.error(data.error);
  						}

  						this.runNextTask();
  				}
  		}, {
  				key: "consolidate",
  				value: function consolidate(chunk, data) {

  						var positions = data.positions;
  						var normals = data.normals;
  						var indices = data.indices;

  						var geometry = void 0,
  						    mesh = void 0;

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

  												event = modificationstart;

  												worker.postMessage({

  														action: task.action,
  														chunk: chunk.serialise(),
  														sdf: chunk.csg.poll().serialise()

  												}, chunk.createTransferList());

  												if (chunk.csg.size === 0) {

  														chunk.csg = null;
  												}
  										} else {

  												event = extractionstart;

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
  		}, {
  				key: "union",
  				value: function union(sdf) {

  						sdf.operation = OperationType.UNION;

  						this.edit(sdf);
  				}
  		}, {
  				key: "subtract",
  				value: function subtract(sdf) {

  						sdf.operation = OperationType.DIFFERENCE;

  						this.edit(sdf);
  				}
  		}, {
  				key: "intersect",
  				value: function intersect(sdf) {

  						sdf.operation = OperationType.INTERSECTION;

  						this.edit(sdf);
  				}
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

  						iterator.region.setFromMatrix(matrix4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

  						result = iterator.next();

  						while (!result.done) {

  								chunk = result.value;
  								data = chunk.data;
  								csg = chunk.csg;

  								if (!this.neutered.has(chunk)) {

  										task = scheduler.getTask(chunk);

  										if (task === undefined || task.priority < maxPriority) {
  												if (csg !== null) {

  														scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, maxPriority));

  														this.runNextTask();
  												} else if (data !== null) {

  														distance = box3.copy(chunk).distanceToPoint(camera.position);
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
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						this.clearMeshes();
  						this.threadPool.dispose();
  				}
  		}, {
  				key: "save",
  				value: function save() {

  						var sdf = this.history.combine();

  						return sdf === null ? null : URL.createObjectURL(new Blob([JSON.stringify(sdf.serialise())], {
  								type: "text/json"
  						}));
  				}
  		}, {
  				key: "load",
  				value: function load(data) {

  						this.clear();

  						this.edit(Reviver.reviveSDF(JSON.parse(data)));
  				}
  		}]);
  		return Terrain;
  }(EventTarget);

  var BIAS = 1e-2;

  var THRESHOLD = 1e-6;

  var ab = new Vector3$2();

  var p = new Vector3$2();

  var v = new Vector3$2();

  var Edge = function () {
  		function Edge() {
  				var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$2();
  				var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$2();
  				classCallCheck(this, Edge);


  				this.a = a;

  				this.b = b;

  				this.t = 0.0;

  				this.n = new Vector3$2();
  		}

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

  						ab.subVectors(this.b, this.a);

  						while (i <= s) {

  								c = (a + b) / 2;

  								p.addVectors(this.a, v.copy(ab).multiplyScalar(c));
  								densityC = sdf.sample(p);

  								if (Math.abs(densityC) <= BIAS || (b - a) / 2 <= THRESHOLD) {
  										break;
  								} else {

  										p.addVectors(this.a, v.copy(ab).multiplyScalar(a));
  										densityA = sdf.sample(p);

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
  		}, {
  				key: "computeZeroCrossingPosition",
  				value: function computeZeroCrossingPosition() {

  						return ab.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);
  				}
  		}, {
  				key: "computeSurfaceNormal",
  				value: function computeSurfaceNormal(sdf) {

  						var position = this.computeZeroCrossingPosition();
  						var E = 1e-3;

  						var dx = sdf.sample(p.addVectors(position, v.set(E, 0, 0))) - sdf.sample(p.subVectors(position, v.set(E, 0, 0)));
  						var dy = sdf.sample(p.addVectors(position, v.set(0, E, 0))) - sdf.sample(p.subVectors(position, v.set(0, E, 0)));
  						var dz = sdf.sample(p.addVectors(position, v.set(0, 0, E))) - sdf.sample(p.subVectors(position, v.set(0, 0, E)));

  						this.n.set(dx, dy, dz).normalize();
  				}
  		}]);
  		return Edge;
  }();

  var ChunkHelper = function (_Object3D) {
  		inherits(ChunkHelper, _Object3D);

  		function ChunkHelper() {
  				var chunk = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				var useMaterialIndices = arguments[1];
  				var useEdgeData = arguments[2];
  				classCallCheck(this, ChunkHelper);

  				var _this = possibleConstructorReturn(this, (ChunkHelper.__proto__ || Object.getPrototypeOf(ChunkHelper)).call(this));

  				_this.name = "ChunkHelper";

  				_this.chunk = chunk;

  				_this.add(new three.Object3D());
  				_this.add(new three.Object3D());
  				_this.add(new three.Object3D());

  				_this.gridPoints.name = "GridPoints";
  				_this.edges.name = "Edges";
  				_this.normals.name = "Normals";

  				_this.update(useMaterialIndices, useEdgeData);

  				return _this;
  		}

  		createClass(ChunkHelper, [{
  				key: "update",
  				value: function update() {
  						var useMaterialIndices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  						var useEdgeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


  						var chunk = this.chunk;

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

  										edge.a.addVectors(base, offsetA);
  										edge.b.addVectors(base, offsetB);

  										edgePositions[j] = edge.a.x;edgeColors[j++] = edgeColor[0];
  										edgePositions[j] = edge.a.y;edgeColors[j++] = edgeColor[1];
  										edgePositions[j] = edge.a.z;edgeColors[j++] = edgeColor[2];

  										edgePositions[j] = edge.b.x;edgeColors[j++] = edgeColor[0];
  										edgePositions[j] = edge.b.y;edgeColors[j++] = edgeColor[1];
  										edgePositions[j] = edge.b.z;edgeColors[j++] = edgeColor[2];

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
  		}, {
  				key: "edges",
  				get: function get$$1() {
  						return this.children[1];
  				}
  		}, {
  				key: "normals",
  				get: function get$$1() {
  						return this.children[2];
  				}
  		}]);
  		return ChunkHelper;
  }(three.Object3D);

  var SymmetricMatrix3 = function () {
  	function SymmetricMatrix3() {
  		classCallCheck(this, SymmetricMatrix3);


  		this.elements = new Float32Array([1, 0, 0, 1, 0, 1]);
  	}

  	createClass(SymmetricMatrix3, [{
  		key: "set",
  		value: function set$$1(m00, m01, m02, m11, m12, m22) {

  			var e = this.elements;

  			e[0] = m00;e[1] = m01;e[2] = m02;
  			e[3] = m11;e[4] = m12;
  			e[5] = m22;

  			return this;
  		}
  	}, {
  		key: "identity",
  		value: function identity() {

  			this.set(1, 0, 0, 1, 0, 1);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(m) {

  			var me = m.elements;

  			this.set(me[0], me[1], me[2], me[3], me[4], me[5]);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
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
  	}, {
  		key: "norm",
  		value: function norm() {

  			var e = this.elements;

  			var m01m01 = e[1] * e[1];
  			var m02m02 = e[2] * e[2];
  			var m12m12 = e[4] * e[4];

  			return Math.sqrt(e[0] * e[0] + m01m01 + m02m02 + m01m01 + e[3] * e[3] + m12m12 + m02m02 + m12m12 + e[5] * e[5]);
  		}
  	}, {
  		key: "off",
  		value: function off() {

  			var e = this.elements;

  			return Math.sqrt(2 * (e[1] * e[1] + e[2] * e[2] + e[4] * e[4]));
  		}
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

  var Matrix3 = function () {
  	function Matrix3() {
  		classCallCheck(this, Matrix3);


  		this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  	}

  	createClass(Matrix3, [{
  		key: "set",
  		value: function set$$1(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

  			var te = this.elements;

  			te[0] = m00;te[3] = m01;te[6] = m02;
  			te[1] = m10;te[4] = m11;te[7] = m12;
  			te[2] = m20;te[5] = m21;te[8] = m22;

  			return this;
  		}
  	}, {
  		key: "identity",
  		value: function identity() {

  			this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(m) {

  			var me = m.elements;

  			return this.set(me[0], me[3], me[6], me[1], me[4], me[7], me[2], me[5], me[8]);
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}]);
  	return Matrix3;
  }();

  var Givens = function () {
  		function Givens() {
  				classCallCheck(this, Givens);
  		}

  		createClass(Givens, null, [{
  				key: "rot01Post",
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


  						e[1] = c * m10 - s * m11;
  						e[4] = s * m10 + c * m11;


  						e[2] = c * m20 - s * m21;
  						e[5] = s * m20 + c * m21;
  				}
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

  						e[6] = s * m00 + c * m02;

  						e[1] = c * m10 - s * m12;

  						e[7] = s * m10 + c * m12;

  						e[2] = c * m20 - s * m22;

  						e[8] = s * m20 + c * m22;
  				}
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

  						e[3] = c * m01 - s * m02;
  						e[6] = s * m01 + c * m02;

  						e[4] = c * m11 - s * m12;
  						e[7] = s * m11 + c * m12;

  						e[5] = c * m21 - s * m22;
  						e[8] = s * m21 + c * m22;
  				}
  		}]);
  		return Givens;
  }();

  var coefficients = {
  		c: 0.0,
  		s: 0.0
  };

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

  var Schur = function () {
  		function Schur() {
  				classCallCheck(this, Schur);
  		}

  		createClass(Schur, null, [{
  				key: "rot01",
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

  						return coefficients;
  				}
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

  						e[4] = s * m01 + c * m12;

  						e[5] = ss * m00 + mix + cc * m22;

  						return coefficients;
  				}
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

  function rotate01(vtav, v) {

  	var m01 = vtav.elements[1];

  	if (m01 !== 0) {

  		Givens.rot01Post(v, Schur.rot01(vtav));
  	}
  }

  function rotate02(vtav, v) {

  	var m02 = vtav.elements[2];

  	if (m02 !== 0) {

  		Givens.rot02Post(v, Schur.rot02(vtav));
  	}
  }

  function rotate12(vtav, v) {

  	var m12 = vtav.elements[4];

  	if (m12 !== 0) {

  		Givens.rot12Post(v, Schur.rot12(vtav));
  	}
  }

  function getSymmetricSVD(a, vtav, v, threshold, maxSweeps) {

  	var delta = threshold * vtav.copy(a).norm();

  	var i = void 0;

  	for (i = 0; i < maxSweeps && vtav.off() > delta; ++i) {

  		rotate01(vtav, v);
  		rotate02(vtav, v);
  		rotate12(vtav, v);
  	}
  }

  function pinv(x, threshold) {

  	var invX = 1.0 / x;

  	return Math.abs(x) < threshold || Math.abs(invX) < threshold ? 0.0 : invX;
  }

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

  	var truncatedValues = (a0 === 0.0) + (a1 === 0.0) + (a2 === 0.0);

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

  var SingularValueDecomposition = function () {
  	function SingularValueDecomposition() {
  		classCallCheck(this, SingularValueDecomposition);
  	}

  	createClass(SingularValueDecomposition, null, [{
  		key: "solveSymmetric",
  		value: function solveSymmetric(a, b, x, svdThreshold, svdSweeps, pseudoInverseThreshold) {

  			var v = new Matrix3();

  			var pinv = new Matrix3();
  			var vtav = new SymmetricMatrix3();

  			var dimension = void 0;

  			pinv.set(0, 0, 0, 0, 0, 0, 0, 0, 0);

  			vtav.set(0, 0, 0, 0, 0, 0);

  			getSymmetricSVD(a, vtav, v, svdThreshold, svdSweeps);

  			dimension = pseudoInverse(pinv, vtav, v, pseudoInverseThreshold);

  			x.copy(b).applyMatrix3(pinv);

  			return dimension;
  		}
  	}, {
  		key: "calculateError",
  		value: function calculateError(t, b, x) {

  			var e = t.elements;
  			var v = x.clone();
  			var a = new Matrix3();

  			a.set(e[0], e[1], e[2], e[1], e[3], e[4], e[2], e[4], e[5]);

  			v.applyMatrix3(a);
  			v.subVectors(b, v);

  			return v.lengthSq();
  		}
  	}]);
  	return SingularValueDecomposition;
  }();

  var Vector2 = function () {
  	function Vector2() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, Vector2);


  		this.x = x;

  		this.y = y;
  	}

  	createClass(Vector2, [{
  		key: "set",
  		value: function set$$1(x, y) {

  			this.x = x;
  			this.y = y;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;

  			return this;
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];

  			return this;
  		}
  	}, {
  		key: "toArray",
  		value: function toArray$$1() {
  			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			array[offset] = this.x;
  			array[offset + 1] = this.y;

  			return array;
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y);
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;

  			return this;
  		}
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
  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

  			this.x = a.x * b.x;
  			this.y = a.y * b.y;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			return this.multiplyScalar(1 / s);
  		}
  	}, {
  		key: "divideVectors",
  		value: function divideVectors(a, b) {

  			this.x = a.x / b.x;
  			this.y = a.y / b.y;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y;
  		}
  	}, {
  		key: "lengthSq",
  		value: function lengthSq() {

  			return this.x * this.x + this.y * this.y;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y);
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;

  			return dx * dx + dy * dy;
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);

  			return this;
  		}
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

  var QEFSolver = function () {
  		function QEFSolver() {
  				var svdThreshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-6;
  				var svdSweeps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  				var pseudoInverseThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;
  				classCallCheck(this, QEFSolver);


  				this.svdThreshold = svdThreshold;

  				this.svdSweeps = svdSweeps;

  				this.pseudoInverseThreshold = pseudoInverseThreshold;

  				this.data = null;

  				this.massPoint = new Vector3$2();

  				this.ata = new SymmetricMatrix3();

  				this.atb = new Vector3$2();

  				this.x = new Vector3$2();

  				this.hasSolution = false;
  		}

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
  		}, {
  				key: "setData",
  				value: function setData(d) {

  						this.data = d;
  						this.hasSolution = false;

  						return this;
  				}
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
  								massPoint.copy(data.massPoint);
  								massPoint.divideScalar(data.numPoints);

  								ata.copy(data.ata);
  								atb.copy(data.atb);

  								mp = ata.applyToVector3(massPoint.clone());
  								atb.sub(mp);

  								x.set(0, 0, 0);

  								data.massPointDimension = SingularValueDecomposition.solveSymmetric(ata, atb, x, this.svdThreshold, this.svdSweeps, this.pseudoInverseThreshold);

  								x.add(massPoint);

  								atb.copy(data.atb);

  								this.hasSolution = true;
  						}

  						return x;
  				}
  		}, {
  				key: "clear",
  				value: function clear() {

  						this.data = null;
  						this.hasSolution = false;
  				}
  		}]);
  		return QEFSolver;
  }();

  var QEFData = function () {
  		function QEFData() {
  				classCallCheck(this, QEFData);


  				this.ata = new SymmetricMatrix3();

  				this.ata.set(0, 0, 0, 0, 0, 0);

  				this.atb = new Vector3$2();

  				this.btb = 0;

  				this.massPoint = new Vector3$2();

  				this.numPoints = 0;

  				this.massPointDimension = 0;
  		}

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
  		}, {
  				key: "copy",
  				value: function copy(d) {

  						return this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);
  				}
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
  		}, {
  				key: "addData",
  				value: function addData(d) {

  						this.ata.add(d.ata);
  						this.atb.add(d.atb);
  						this.btb += d.btb;

  						this.massPoint.add(d.massPoint);
  						this.numPoints += d.numPoints;
  				}
  		}, {
  				key: "clear",
  				value: function clear() {

  						this.ata.set(0, 0, 0, 0, 0, 0);

  						this.atb.set(0, 0, 0);
  						this.btb = 0;

  						this.massPoint.set(0, 0, 0);
  						this.numPoints = 0;
  				}
  		}, {
  				key: "clone",
  				value: function clone() {

  						return new this.constructor().copy(this);
  				}
  		}]);
  		return QEFData;
  }();

  var Voxel = function Voxel() {
  		classCallCheck(this, Voxel);


  		this.materials = 0;

  		this.edgeCount = 0;

  		this.index = -1;

  		this.position = new Vector3$2();

  		this.normal = new Vector3$2();

  		this.qefData = null;
  };

  var BIAS$1 = 1e-6;

  var THRESHOLD$1 = 1e-2;

  var threshold = 0.0;

  var VoxelCell = function (_CubicOctant) {
  	inherits(VoxelCell, _CubicOctant);

  	function VoxelCell(min, size) {
  		classCallCheck(this, VoxelCell);

  		var _this = possibleConstructorReturn(this, (VoxelCell.__proto__ || Object.getPrototypeOf(VoxelCell)).call(this, min, size));

  		_this.voxel = null;

  		return _this;
  	}

  	createClass(VoxelCell, [{
  		key: "contains",
  		value: function contains(p) {

  			var min = this.min;
  			var size = this.size;

  			return p.x >= min.x - BIAS$1 && p.y >= min.y - BIAS$1 && p.z >= min.z - BIAS$1 && p.x <= min.x + size + BIAS$1 && p.y <= min.y + size + BIAS$1 && p.z <= min.z + size + BIAS$1;
  		}
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
  								voxel.materials |= midSign << i;
  							} else {

  								voxel.materials |= sign << i;

  								voxel.normal.add(child.voxel.normal);
  							}
  						}

  						voxel.normal.normalize();
  						voxel.qefData = qefData;

  						this.voxel = voxel;
  						this.children = null;

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

  		for (materials = 0, i = 0; i < 8; ++i) {
  				offset = PATTERN[i];
  				index = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);

  				material = Math.min(materialIndices[index], Material.SOLID);

  				materials |= material << i;
  		}

  		for (edgeCount = 0, i = 0; i < 12; ++i) {

  				c1 = EDGES[i][0];
  				c2 = EDGES[i][1];

  				m1 = materials >> c1 & 1;
  				m2 = materials >> c2 & 1;

  				if (m1 !== m2) {

  						++edgeCount;
  				}
  		}

  		voxel.materials = materials;
  		voxel.edgeCount = edgeCount;
  		voxel.qefData = new QEFData();

  		return voxel;
  }

  var VoxelBlock = function (_Octree) {
  		inherits(VoxelBlock, _Octree);

  		function VoxelBlock(chunk) {
  				classCallCheck(this, VoxelBlock);

  				var _this = possibleConstructorReturn(this, (VoxelBlock.__proto__ || Object.getPrototypeOf(VoxelBlock)).call(this));

  				_this.root = new VoxelCell(chunk.min, chunk.size);
  				_this.root.lod = chunk.data.lod;

  				_this.voxelCount = 0;

  				_this.construct(chunk);
  				_this.simplify();

  				return _this;
  		}

  		createClass(VoxelBlock, [{
  				key: "simplify",
  				value: function simplify() {

  						this.voxelCount -= this.root.collapse();
  				}
  		}, {
  				key: "getCell",
  				value: function getCell(n, x, y, z) {

  						var cell = this.root;
  						var i = 0;

  						for (n = n >> 1; n > 0; n >>= 1, i = 0) {
  								if (x >= n) {
  										i += 4;x -= n;
  								}
  								if (y >= n) {
  										i += 2;y -= n;
  								}
  								if (z >= n) {
  										i += 1;z -= n;
  								}

  								if (cell.children === null) {

  										cell.split();
  								}

  								cell = cell.children[i];
  						}

  						return cell;
  				}
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
  										index = edges[i];

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

  										for (j = 0; j < 4; ++j) {
  												offset = PATTERN[sequence[j]];

  												x2 = x - offset[0];
  												y2 = y - offset[1];
  												z2 = z - offset[2];

  												if (x2 >= 0 && y2 >= 0 && z2 >= 0 && x2 < n && y2 < n && z2 < n) {

  														cell = this.getCell(n, x2, y2, z2);

  														if (cell.voxel === null) {
  																cell.voxel = createVoxel(n, x2, y2, z2, materialIndices);

  																++voxelCount;
  														}

  														voxel = cell.voxel;
  														voxel.normal.add(edge.n);
  														voxel.qefData.add(intersection, edge.n);

  														if (voxel.qefData.numPoints === voxel.edgeCount) {
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
  			min.set(n, n, n);
  			max.set(0, 0, 0);
  		}
  	}

  	return new Box3$2(min, max);
  }

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

  function combineEdges(chunk, operation, data0, data1) {

  	var m = chunk.resolution + 1;
  	var indexOffsets = new Uint32Array([1, m, m * m]);

  	var materialIndices = data0.materialIndices;

  	var edge1 = new Edge();
  	var edge0 = new Edge();

  	var edgeData1 = data1.edgeData;
  	var edgeData0 = data0.edgeData;

  	var edgeCount = EdgeData.calculate1DEdgeCount(chunk.resolution);
  	var edgeData = new EdgeData(Math.min(edgeCount, edgeData0.edges[0].length + edgeData1.edges[0].length), Math.min(edgeCount, edgeData0.edges[1].length + edgeData1.edges[1].length), Math.min(edgeCount, edgeData0.edges[2].length + edgeData1.edges[2].length));
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
  							edges[c] = indexA0;
  							zeroCrossings[c] = edge0.t;
  							normals[c * 3] = edge0.n.x;
  							normals[c * 3 + 1] = edge0.n.y;
  							normals[c * 3 + 2] = edge0.n.z;

  							++c;
  						}
  					} else {
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

  	var edgeData = new EdgeData(EdgeData.calculate1DEdgeCount(n));
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

  	for (a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {
  		axis = PATTERN[a];

  		edges = edgeData.edges[d];
  		zeroCrossings = edgeData.zeroCrossings[d];
  		normals = edgeData.normals[d];

  		minX = bounds.min.x;maxX = bounds.max.x;
  		minY = bounds.min.y;maxY = bounds.max.y;
  		minZ = bounds.min.z;maxZ = bounds.max.z;

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

  					if (materialIndices[indexA] !== materialIndices[indexB]) {

  						offsetA.set(x * s / n, y * s / n, z * s / n);

  						offsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);

  						edge.a.addVectors(base, offsetA);
  						edge.b.addVectors(base, offsetB);

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

  		if (!(data0.full && operation.type === OperationType.UNION)) {

  			combineMaterialIndices(chunk, operation, data0, data1, bounds);
  		}
  	}

  	if (!done && !data0.empty && !data0.full) {

  		result = operation.type === OperationType.DENSITY_FUNCTION ? generateEdges(chunk, operation, data0, bounds) : combineEdges(chunk, operation, data0, data1);

  		edgeData = result.edgeData;
  		lengths = result.lengths;

  		for (d = 0; d < 3; ++d) {

  			edgeData.edges[d] = edgeData.edges[d].slice(0, lengths[d]);
  			edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);
  			edgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);
  		}

  		data0.edgeData = edgeData;
  	}
  }

  function execute(chunk, operation) {

  	var children = operation.children;

  	var result = void 0,
  	    data = void 0;
  	var i = void 0,
  	    l = void 0;

  	if (operation.type === OperationType.DENSITY_FUNCTION) {
  		result = new HermiteData();

  		update(chunk, operation, result);
  	}

  	for (i = 0, l = children.length; i < l; ++i) {
  		data = execute(chunk, children[i]);

  		if (result === undefined) {

  			result = data;
  		} else if (data !== null) {

  			if (result === null) {

  				if (operation.type === OperationType.UNION) {
  					result = data;
  				}
  			} else {
  				update(chunk, operation, result, data);
  			}
  		} else if (operation.type === OperationType.INTERSECTION) {
  			result = null;
  		}

  		if (result === null && operation.type !== OperationType.UNION) {
  			break;
  		}
  	}

  	return result !== null && result.empty ? null : result;
  }

  var ConstructiveSolidGeometry = function () {
  	function ConstructiveSolidGeometry() {
  		classCallCheck(this, ConstructiveSolidGeometry);
  	}

  	createClass(ConstructiveSolidGeometry, null, [{
  		key: "run",
  		value: function run(chunk, sdf) {

  			if (chunk.data === null) {

  				if (sdf.operation === OperationType.UNION) {

  					chunk.data = new HermiteData();
  					chunk.data.edgeData = new EdgeData(0);
  				}
  			} else {

  				chunk.data.decompress();
  			}

  			var operation = sdf.toCSG();

  			var data = chunk.data !== null ? execute(chunk, operation) : null;

  			if (data !== null) {
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

  				update(chunk, operation, chunk.data, data);

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
