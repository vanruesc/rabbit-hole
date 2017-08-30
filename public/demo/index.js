(function (three,dat,Stats) {
  'use strict';

  dat = dat && dat.hasOwnProperty('default') ? dat['default'] : dat;
  Stats = Stats && Stats.hasOwnProperty('default') ? Stats['default'] : Stats;

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

  var Serializable = function () {
  	function Serializable() {
  		classCallCheck(this, Serializable);
  	}

  	createClass(Serializable, [{
  		key: "serialize",
  		value: function serialize() {

  			throw new Error("Serializable#serialise method not implemented!");
  		}
  	}]);
  	return Serializable;
  }();

  var Deserializable = function () {
  	function Deserializable() {
  		classCallCheck(this, Deserializable);
  	}

  	createClass(Deserializable, [{
  		key: "deserialize",
  		value: function deserialize(object) {

  			throw new Error("Deserializable#deserialise method not implemented!");
  		}
  	}]);
  	return Deserializable;
  }();

  var TransferableContainer = function () {
  	function TransferableContainer() {
  		classCallCheck(this, TransferableContainer);
  	}

  	createClass(TransferableContainer, [{
  		key: "createTransferList",
  		value: function createTransferList() {
  			var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  			throw new Error("TransferableContainer#createTransferList method not implemented!");
  		}
  	}]);
  	return TransferableContainer;
  }();

  var Clipmap = function Clipmap() {
  	classCallCheck(this, Clipmap);
  };

  var OperationType = {

    UNION: "csg.union",
    DIFFERENCE: "csg.difference",
    INTERSECTION: "csg.intersection",
    DENSITY_FUNCTION: "csg.densityfunction"

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

  var Event = function Event(type) {
  		classCallCheck(this, Event);


  		this.type = type;

  		this.target = null;
  };

  var EventTarget = function () {
  		function EventTarget() {
  				classCallCheck(this, EventTarget);


  				this.listenerFunctions = new Map();

  				this.listenerObjects = new Map();
  		}

  		createClass(EventTarget, [{
  				key: "addEventListener",
  				value: function addEventListener(type, listener) {

  						var m = typeof listener === "function" ? this.listenerFunctions : this.listenerObjects;

  						if (m.has(type)) {

  								m.get(type).add(listener);
  						} else {

  								m.set(type, new Set([listener]));
  						}
  				}
  		}, {
  				key: "removeEventListener",
  				value: function removeEventListener(type, listener) {

  						var m = typeof listener === "function" ? this.listenerFunctions : this.listenerObjects;

  						var listeners = void 0;

  						if (m.has(type)) {

  								listeners = m.get(type);
  								listeners.delete(listener);

  								if (listeners.size === 0) {

  										m.delete(type);
  								}
  						}
  				}
  		}, {
  				key: "dispatchEvent",
  				value: function dispatchEvent(event) {
  						var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;


  						var listenerFunctions = target.listenerFunctions;
  						var listenerObjects = target.listenerObjects;

  						var listeners = void 0;
  						var listener = void 0;

  						event.target = target;

  						if (listenerFunctions.has(event.type)) {

  								listeners = listenerFunctions.get(event.type);

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

  						if (listenerObjects.has(event.type)) {

  								listeners = listenerObjects.get(event.type);

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

  var fragment = "#define PHYSICAL\r\n\r\nuniform vec3 diffuse;\r\nuniform vec3 emissive;\r\nuniform float roughness;\r\nuniform float metalness;\r\nuniform float opacity;\r\n\r\n#ifndef STANDARD\r\n\tuniform float clearCoat;\r\n\tuniform float clearCoatRoughness;\r\n#endif\r\n\r\nvarying vec3 vViewPosition;\r\n\r\n#ifndef FLAT_SHADED\r\n\r\n\tvarying vec3 vNormal;\r\n\r\n#endif\r\n\r\n#include <common>\r\n#include <packing>\r\n#include <color_pars_fragment>\r\n#include <map_triplanar_pars_fragment>\r\n#include <alphamap_pars_fragment>\r\n#include <specularmap_pars_fragment>\r\n#include <lightmap_pars_fragment>\r\n#include <emissivemap_pars_fragment>\r\n#include <envmap_pars_fragment>\r\n#include <fog_pars_fragment>\r\n#include <bsdfs>\r\n#include <cube_uv_reflection_fragment>\r\n#include <lights_pars>\r\n#include <lights_physical_pars_fragment>\r\n#include <shadowmap_pars_fragment>\r\n#include <triplanar_pars_fragment>\r\n#include <normalmap_triplanar_pars_fragment>\r\n#include <roughnessmap_pars_fragment>\r\n#include <metalnessmap_pars_fragment>\r\n#include <logdepthbuf_pars_fragment>\r\n#include <clipping_planes_pars_fragment>\r\n\r\nvoid main() {\r\n\r\n\t#include <clipping_planes_fragment>\r\n\r\n\tvec4 diffuseColor = vec4( diffuse, opacity );\r\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\r\n\tvec3 totalEmissiveRadiance = emissive;\r\n\r\n\t#include <logdepthbuf_fragment>\r\n\t#include <normal_triplanar_fragment>\r\n\t#include <map_triplanar_fragment>\r\n\t#include <color_fragment>\r\n\t#include <alphamap_triplanar_fragment>\r\n\t#include <alphatest_fragment>\r\n\t#include <specularmap_triplanar_fragment>\r\n\t#include <roughnessmap_triplanar_fragment>\r\n\t#include <metalnessmap_triplanar_fragment>\r\n\t#include <emissivemap_triplanar_fragment>\r\n\r\n\t// accumulation\r\n\t#include <lights_physical_fragment>\r\n\t#include <lights_template>\r\n\r\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\r\n\r\n\tgl_FragColor = vec4( outgoingLight, diffuseColor.a );\r\n\r\n\t#include <premultiplied_alpha_fragment>\r\n\t#include <tonemapping_fragment>\r\n\t#include <encodings_fragment>\r\n\t#include <fog_fragment>\r\n\r\n}\r\n";

  var vertex = "#define PHYSICAL\r\n\r\nvarying vec3 vViewPosition;\r\n\r\n#ifndef FLAT_SHADED\r\n\r\n\tvarying vec3 vNormal;\r\n\r\n#endif\r\n\r\n#include <common>\r\n#include <uv_pars_vertex> // offsetRepeat\r\n#include <color_pars_vertex>\r\n#include <fog_pars_vertex>\r\n#include <morphtarget_pars_vertex>\r\n#include <skinning_pars_vertex>\r\n#include <shadowmap_pars_vertex>\r\n#include <logdepthbuf_pars_vertex>\r\n#include <clipping_planes_pars_vertex>\r\n#include <triplanar_pars_vertex>\r\n\r\nvoid main() {\r\n\r\n\t#include <color_vertex>\r\n\r\n\t#include <beginnormal_vertex>\r\n\t#include <morphnormal_vertex>\r\n\t#include <skinbase_vertex>\r\n\t#include <skinnormal_vertex>\r\n\t#include <defaultnormal_vertex>\r\n\r\n#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\r\n\r\n\tvNormal = normalize( transformedNormal );\r\n\r\n#endif\r\n\r\n\t#include <begin_vertex>\r\n\t#include <morphtarget_vertex>\r\n\t#include <skinning_vertex>\r\n\t#include <project_vertex>\r\n\t#include <logdepthbuf_vertex>\r\n\t#include <clipping_planes_vertex>\r\n\r\n\tvViewPosition = - mvPosition.xyz;\r\n\r\n\t#include <worldpos_vertex>\r\n\t#include <shadowmap_vertex>\r\n\t#include <fog_vertex>\r\n\t#include <triplanar_vertex>\r\n\r\n}\r\n";

  var alphamapTriplanarFragment = "#ifdef USE_ALPHAMAP\r\n\r\n\tdiffuseColor.a *= t3( alphaMap ).g;\r\n\r\n#endif\r\n";

  var emissivemapTriplanarFragment = "#ifdef USE_EMISSIVEMAP\r\n\r\n\tvec4 emissiveColor = t3( emissiveMap );\r\n\r\n\temissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;\r\n\r\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\r\n\r\n#endif\r\n";

  var mapTriplanarParsFragment = "#ifdef USE_MAP\r\n\r\n\tuniform sampler2D map;\r\n\r\n\t#ifdef USE_MAP_Y\r\n\r\n\t\tuniform sampler2D mapY;\r\n\r\n\t#endif\r\n\r\n\t#ifdef USE_MAP_Z\r\n\r\n\t\tuniform sampler2D mapZ;\r\n\r\n\t#endif\r\n\r\n#endif\r\n";

  var mapTriplanarFragment = "#ifdef USE_MAP\r\n\r\n\t#ifdef USE_MAP_Z\r\n\r\n\t\tvec4 texelColor = t3( map, mapY, mapZ );\r\n\r\n\t#elif USE_MAP_Y\r\n\r\n\t\tvec4 texelColor = t3( map, mapY );\r\n\r\n\t#else\r\n\r\n\t\tvec4 texelColor = t3( map );\r\n\r\n\t#endif\r\n\r\n\ttexelColor = mapTexelToLinear( texelColor );\r\n\tdiffuseColor *= texelColor;\r\n\r\n#endif\r\n";

  var metalnessmapTriplanarFragment = "float metalnessFactor = metalness;\r\n\r\n#ifdef USE_METALNESSMAP\r\n\r\n\tvec4 texelMetalness = t3( metalnessMap );\r\n\tmetalnessFactor *= texelMetalness.r;\r\n\r\n#endif\r\n";

  var normalTriplanarFragment = "#ifdef FLAT_SHADED\r\n\r\n\t// Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...\r\n\r\n\tvec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );\r\n\tvec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );\r\n\tvec3 normal = normalize( cross( fdx, fdy ) );\r\n\r\n#else\r\n\r\n\tvec3 normal = normalize( vNormal );\r\n\r\n\t#ifdef DOUBLE_SIDED\r\n\r\n\t\tnormal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );\r\n\r\n\t#endif\r\n\r\n#endif\r\n\r\n#ifdef USE_NORMALMAP\r\n\r\n\tnormal = perturbNormal2Arb( normal );\r\n\r\n#endif\r\n";

  var normalmapTriplanarParsFragment = "#ifdef USE_NORMALMAP\r\n\r\n\tuniform sampler2D normalMap;\r\n\tuniform vec2 normalScale;\r\n\r\n\t#ifdef USE_NORMALMAP_Y\r\n\r\n\t\tuniform sampler2D normalMapY;\r\n\r\n\t#endif\r\n\r\n\t#ifdef USE_NORMALMAP_Z\r\n\r\n\t\tuniform sampler2D normalMapZ;\r\n\r\n\t#endif\r\n\r\n\t// Triplanar Tangent Space Normal Mapping\r\n\t// Jaume Sánchez (https://www.clicktorelease.com/code/bumpy-metaballs/)\r\n\t// Mel (http://irrlicht.sourceforge.net/forum/viewtopic.php?t=48043)\r\n\r\n\tvec3 perturbNormal2Arb( vec3 normal ) {\r\n\r\n\t\t// Not sure why this doesn't work. Needs more testing!\r\n\t\t/*vec3 tangentX = vec3( normal.x, - normal.z, normal.y );\r\n\t\tvec3 tangentY = vec3( normal.z, normal.y, - normal.x );\r\n\t\tvec3 tangentZ = vec3( - normal.y, normal.x, normal.z );\r\n\r\n\t\tvec3 tangent = (\r\n\t\t\ttangentX * vBlend.x +\r\n\t\t\ttangentY * vBlend.y +\r\n\t\t\ttangentZ * vBlend.z\r\n\t\t); \r\n\r\n\t\tmat3 tsb = mat3(\r\n\t\t\tnormalize( tangent ),\r\n\t\t\tnormalize( cross( normal, tangent ) ),\r\n\t\t\tnormalize( normal )\r\n\t\t);*/\r\n\r\n\t\tmat3 tbn = mat3(\r\n\t\t\tnormalize( vec3( normal.y + normal.z, 0.0, normal.x ) ),\r\n\t\t\tnormalize( vec3( 0.0, normal.x + normal.z, normal.y ) ),\r\n\t\t\tnormal\r\n\t\t);\r\n\r\n\t\t#ifdef USE_NORMALMAP_Z\r\n\r\n\t\t\tvec3 mapN = t3( normalMap, normalMapY, normalMapZ ).xyz;\r\n\r\n\t\t#elif USE_NORMALMAP_Y\r\n\r\n\t\t\tvec3 mapN = t3( normalMap, normalMapY ).xyz;\r\n\r\n\t\t#else\r\n\r\n\t\t\tvec3 mapN = t3( normalMap ).xyz;\r\n\r\n\t\t#endif\r\n\r\n\t\t// Expand and scale the vector.\r\n\t\tmapN = mapN * 2.0 - 1.0;\r\n\t\tmapN.xy *= normalScale;\r\n\r\n\t\treturn normalize( tbn * mapN );\r\n\r\n\t}\r\n\r\n#endif\r\n";

  var roughnessmapTriplanarFragment = "float roughnessFactor = roughness;\r\n\r\n#ifdef USE_ROUGHNESSMAP\r\n\r\n\tvec4 texelRoughness = t3( roughnessMap );\r\n\troughnessFactor *= texelRoughness.r;\r\n\r\n#endif\r\n";

  var specularmapTriplanarFragment = "float specularStrength;\r\n\r\n#ifdef USE_SPECULARMAP\r\n\r\n\tvec4 texelSpecular = t3( specularMap );\r\n\tspecularStrength = texelSpecular.r;\r\n\r\n#else\r\n\r\n\tspecularStrength = 1.0;\r\n\r\n#endif";

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

  var SDFType = {

    SPHERE: "sdf.sphere",
    BOX: "sdf.box",
    TORUS: "sdf.torus",
    PLANE: "sdf.plane",
    HEIGHTFIELD: "sdf.heightfield"

  };

  var Vector2$1 = function () {
  	function Vector2$$1() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, Vector2$$1);


  		this.x = x;

  		this.y = y;
  	}

  	createClass(Vector2$$1, [{
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
  	return Vector2$$1;
  }();

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

  var SymmetricMatrix3 = function () {
  	function SymmetricMatrix3() {
  		classCallCheck(this, SymmetricMatrix3);


  		this.elements = new Float32Array([1, 0, 0, 1, 0, 1]);
  	}

  	createClass(SymmetricMatrix3, [{
  		key: "set",
  		value: function set$$1(m00, m01, m02, m11, m12, m22) {

  			var e = this.elements;

  			e[0] = m00;
  			e[1] = m01;e[3] = m11;
  			e[2] = m02;e[4] = m12;e[5] = m22;

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
  		key: "toMatrix3",
  		value: function toMatrix3(m) {

  			var me = m.elements;

  			m.set(me[0], me[1], me[2], me[1], me[3], me[4], me[2], me[4], me[5]);
  		}
  	}, {
  		key: "add",
  		value: function add(m) {

  			var te = this.elements;
  			var me = m.elements;

  			te[0] += me[0];
  			te[1] += me[1];te[3] += me[3];
  			te[2] += me[2];te[4] += me[4];te[5] += me[5];

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
  	}], [{
  		key: "calculateIndex",
  		value: function calculateIndex(i, j) {

  			return 3 - (3 - i) * (2 - i) / 2 + j;
  		}
  	}]);
  	return SymmetricMatrix3;
  }();

  var Material = {

    AIR: 0,
    SOLID: 1

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

  						this.bbox = new Box3$1();

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
  				key: "serialize",
  				value: function serialize() {

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

  								result.children.push(children[i].serialize());
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

  						throw new Error("SignedDistanceFunction#computeBoundingBox method not implemented!");
  				}
  		}, {
  				key: "sample",
  				value: function sample(position) {

  						throw new Error("SignedDistanceFunction#sample method not implemented!");
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

  				_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();

  				_this.radius = parameters.radius;

  				return _this;
  		}

  		createClass(Sphere, [{
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						this.bbox = new Box3$1();

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
  				key: "serialize",
  				value: function serialize() {

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

  				_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();

  				_this.halfDimensions = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.halfDimensions))))();

  				return _this;
  		}

  		createClass(Box, [{
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						this.bbox = new Box3$1();

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
  				key: "serialize",
  				value: function serialize() {

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

  		_this.normal = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.normal))))();

  		_this.constant = parameters.constant;

  		return _this;
  	}

  	createClass(Plane, [{
  		key: "computeBoundingBox",
  		value: function computeBoundingBox() {

  			this.bbox = new Box3$1();

  			return this.bbox;
  		}
  	}, {
  		key: "sample",
  		value: function sample(position) {

  			return this.normal.dot(position) + this.constant;
  		}
  	}, {
  		key: "serialize",
  		value: function serialize() {

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

  				_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();

  				_this.R = parameters.R;

  				_this.r = parameters.r;

  				return _this;
  		}

  		createClass(Torus, [{
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						this.bbox = new Box3$1();

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
  				key: "serialize",
  				value: function serialize() {

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

  				_this.min = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.min))))();

  				_this.dimensions = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.size))))();

  				_this.data = parameters.data;

  				return _this;
  		}

  		createClass(Heightfield, [{
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						this.bbox = new Box3$1();

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
  				key: "serialize",
  				value: function serialize() {

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

  var SDFReviver = function () {
  		function SDFReviver() {
  				classCallCheck(this, SDFReviver);
  		}

  		createClass(SDFReviver, null, [{
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
  		return SDFReviver;
  }();

  var Action = {

    EXTRACT: "worker.extract",
    MODIFY: "worker.modify",
    RESAMPLE: "worker.resample",
    CONFIGURE: "worker.config",
    CLOSE: "worker.close"

  };

  var Request = function Request() {
  		var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		classCallCheck(this, Request);


  		this.action = action;

  		this.data = null;

  		this.cellSize = 0;

  		this.cellPosition = null;
  };

  var ExtractionRequest = function (_Request) {
  	inherits(ExtractionRequest, _Request);

  	function ExtractionRequest() {
  		classCallCheck(this, ExtractionRequest);
  		return possibleConstructorReturn(this, (ExtractionRequest.__proto__ || Object.getPrototypeOf(ExtractionRequest)).call(this, Action.EXTRACT));
  	}

  	return ExtractionRequest;
  }(Request);

  var ModificationRequest = function (_Request) {
  	inherits(ModificationRequest, _Request);

  	function ModificationRequest() {
  		classCallCheck(this, ModificationRequest);

  		var _this = possibleConstructorReturn(this, (ModificationRequest.__proto__ || Object.getPrototypeOf(ModificationRequest)).call(this, Action.MODIFY));

  		_this.sdf = null;

  		return _this;
  	}

  	return ModificationRequest;
  }(Request);

  var WorkerEvent = function (_Event) {
  		inherits(WorkerEvent, _Event);

  		function WorkerEvent(type) {
  				classCallCheck(this, WorkerEvent);

  				var _this = possibleConstructorReturn(this, (WorkerEvent.__proto__ || Object.getPrototypeOf(WorkerEvent)).call(this, type));

  				_this.worker = null;

  				_this.response = null;

  				return _this;
  		}

  		return WorkerEvent;
  }(Event);

  var message = new WorkerEvent("message");

  var worker = "!function(){\"use strict\";function t(t,e,n,i,r,s){var o=0;return t>e&&t>n?(r<t&&(o|=2),s<t&&(o|=1)):e>n?(i<e&&(o|=4),s<e&&(o|=1)):(i<n&&(o|=4),r<n&&(o|=2)),o}function e(t,e,n,i){var r=void 0,s=0;return e<n?(r=e,s=0):(r=n,s=1),i<r&&(s=2),et[t][s]}function n(i,r,s,o,a,u,l,h,c){var d=i.children,y=void 0,v=void 0,f=void 0,m=void 0;if(a>=0&&u>=0&&l>=0)if(null===d)c.push(i);else{y=t(r,s,o,v=.5*(r+a),f=.5*(s+u),m=.5*(o+l));do{switch(y){case 0:n(d[tt[8]],r,s,o,v,f,m,h,c),y=e(y,v,f,m);break;case 1:n(d[tt[8]^tt[1]],r,s,m,v,f,l,h,c),y=e(y,v,f,l);break;case 2:n(d[tt[8]^tt[2]],r,f,o,v,u,m,h,c),y=e(y,v,u,m);break;case 3:n(d[tt[8]^tt[3]],r,f,m,v,u,l,h,c),y=e(y,v,u,l);break;case 4:n(d[tt[8]^tt[4]],v,s,o,a,f,m,h,c),y=e(y,a,f,m);break;case 5:n(d[tt[8]^tt[5]],v,s,m,a,f,l,h,c),y=e(y,a,f,l);break;case 6:n(d[tt[8]^tt[6]],v,f,o,a,u,m,h,c),y=e(y,a,u,m);break;case 7:n(d[tt[8]^tt[7]],v,f,m,a,u,l,h,c),y=8}}while(y<8)}}function i(t){var e=t.children,n=0,r=void 0,s=void 0,o=void 0;if(null!==e)for(r=0,s=e.length;r<s;++r)(o=1+i(e[r]))>n&&(n=o);return n}function r(t,e,n){var i=t.children,s=void 0,o=void 0;if(ht.min=t.min,ht.max=t.max,e.intersectsBox(ht))if(null!==i)for(s=0,o=i.length;s<o;++s)r(i[s],e,n);else n.push(t)}function s(t,e,n,i){var r=t.children,o=void 0,a=void 0;if(n===e)i.push(t);else if(null!==r)for(++n,o=0,a=r.length;o<a;++o)s(r[o],e,n,i)}function o(t){var e=t.children,n=0,i=void 0,r=void 0;if(null!==e)for(i=0,r=e.length;i<r;++i)n+=o(e[i]);else null!==t.points&&(n=t.points.length);return n}function a(t,e,n,i,r){var s=i.children,o=!1,u=!1,l=void 0,h=void 0;if(i.contains(t,n.bias)){if(null===s){if(null===i.points)i.points=[],i.data=[];else for(l=0,h=i.points.length;!o&&l<h;++l)o=i.points[l].equals(t);o?(i.data[l-1]=e,u=!0):i.points.length<n.maxPoints||r===n.maxDepth?(i.points.push(t.clone()),i.data.push(e),++n.pointCount,u=!0):(i.split(),i.redistribute(n.bias),s=i.children)}if(null!==s)for(++r,l=0,h=s.length;!u&&l<h;++l)u=a(t,e,n,s[l],r)}return u}function u(t,e,n,i){var r=n.children,s=null,a=void 0,l=void 0,h=void 0,c=void 0,d=void 0;if(n.contains(t,e.bias))if(null!==r)for(a=0,l=r.length;null===s&&a<l;++a)s=u(t,e,r[a],n);else if(null!==n.points)for(h=n.points,c=n.data,a=0,l=h.length;a<l;++a)if(h[a].equals(t)){d=l-1,s=c[a],a<d&&(h[a]=h[d],c[a]=c[d]),h.pop(),c.pop(),--e.pointCount,null!==i&&o(i)<=e.maxPoints&&i.merge();break}return s}function l(t,e,n){var i=n.children,r=null,s=void 0,o=void 0,a=void 0;if(n.contains(t,e.bias))if(null!==i)for(s=0,o=i.length;null===r&&s<o;++s)r=l(t,e,i[s]);else for(s=0,o=(a=n.points).length;null===r&&s<o;++s)t.distanceToSquared(a[s])<=ft&&(r=n.data[s]);return r}function h(t,e,n,i,r,s){var o=i.children,l=null,c=void 0,d=void 0,y=void 0;if(i.contains(t,n.bias))if(i.contains(e,n.bias)){if(null!==o)for(++s,c=0,d=o.length;null===l&&c<d;++c)l=h(t,e,n,o[c],i,s);else for(c=0,d=(y=i.points).length;c<d;++c)if(t.distanceToSquared(y[c])<=ft){y[c].copy(e),l=i.data[c];break}}else a(e,l=u(t,n,i,r),n,r,s-1);return l}function c(t,e,n,i){var r=i.points,s=i.children,o=null,a=e,u=void 0,l=void 0,h=void 0,d=void 0,y=void 0,v=void 0,f=void 0;if(null!==s)for(u=0,l=(y=s.map(function(e){return{octant:e,distance:e.distanceToCenterSquared(t)}}).sort(function(t,e){return t.distance-e.distance})).length;u<l;++u)(v=y[u].octant).contains(t,a)&&null!==(f=c(t,a,n,v))&&(d=f.point.distanceToSquared(t),(!n||d>0)&&d<a&&(a=d,o=f));else if(null!==r)for(u=0,l=r.length;u<l;++u)h=r[u],d=t.distanceToSquared(h),(!n||d>0)&&d<a&&(a=d,o={point:h.clone(),data:i.data[u]});return o}function d(t,e,n,i,r){var s=i.points,o=i.children,a=e*e,u=void 0,l=void 0,h=void 0,c=void 0,y=void 0;if(null!==o)for(u=0,l=o.length;u<l;++u)(y=o[u]).contains(t,e)&&d(t,e,n,y,r);else if(null!==s)for(u=0,l=s.length;u<l;++u)h=s[u],c=t.distanceToSquared(h),(!n||c>0)&&c<=a&&r.push({point:h.clone(),data:i.data[u]})}function y(t,e){var n=t.elements,i=e.elements,r=void 0;0!==n[1]&&(r=Ct.calculateCoefficients(n[0],n[1],n[3]),Dt.rotateQXY(Rt.set(n[0],n[3]),n[1],r),n[0]=Rt.x,n[3]=Rt.y,Dt.rotateXY(Rt.set(n[2],n[4]),r),n[2]=Rt.x,n[4]=Rt.y,n[1]=0,Dt.rotateXY(Rt.set(i[0],i[3]),r),i[0]=Rt.x,i[3]=Rt.y,Dt.rotateXY(Rt.set(i[1],i[4]),r),i[1]=Rt.x,i[4]=Rt.y,Dt.rotateXY(Rt.set(i[2],i[5]),r),i[2]=Rt.x,i[5]=Rt.y)}function v(t,e){var n=t.elements,i=e.elements,r=void 0;0!==n[2]&&(r=Ct.calculateCoefficients(n[0],n[2],n[5]),Dt.rotateQXY(Rt.set(n[0],n[5]),n[2],r),n[0]=Rt.x,n[5]=Rt.y,Dt.rotateXY(Rt.set(n[1],n[4]),r),n[1]=Rt.x,n[4]=Rt.y,n[2]=0,Dt.rotateXY(Rt.set(i[0],i[6]),r),i[0]=Rt.x,i[6]=Rt.y,Dt.rotateXY(Rt.set(i[1],i[7]),r),i[1]=Rt.x,i[7]=Rt.y,Dt.rotateXY(Rt.set(i[2],i[8]),r),i[2]=Rt.x,i[8]=Rt.y)}function f(t,e){var n=t.elements,i=e.elements,r=void 0;0!==n[4]&&(r=Ct.calculateCoefficients(n[3],n[4],n[5]),Dt.rotateQXY(Rt.set(n[3],n[5]),n[4],r),n[3]=Rt.x,n[5]=Rt.y,Dt.rotateXY(Rt.set(n[1],n[2]),r),n[1]=Rt.x,n[2]=Rt.y,n[4]=0,Dt.rotateXY(Rt.set(i[3],i[6]),r),i[3]=Rt.x,i[6]=Rt.y,Dt.rotateXY(Rt.set(i[4],i[7]),r),i[4]=Rt.x,i[7]=Rt.y,Dt.rotateXY(Rt.set(i[5],i[8]),r),i[5]=Rt.x,i[8]=Rt.y)}function m(t,e){var n=t.elements,i=void 0;for(i=0;i<Pt;++i)y(t,e),v(t,e),f(t,e);return Ft.set(n[0],n[3],n[5])}function p(t){var e=1/t;return Math.abs(t)<Et||Math.abs(e)<Et?0:e}function x(t,e){var n=t.elements,i=n[0],r=n[3],s=n[6],o=n[1],a=n[4],u=n[7],l=n[2],h=n[5],c=n[8],d=p(e.x),y=p(e.y),v=p(e.z);return t.set(i*d*i+r*y*r+s*v*s,i*d*o+r*y*a+s*v*u,i*d*l+r*y*h+s*v*c,o*d*i+a*y*r+u*v*s,o*d*o+a*y*a+u*v*u,o*d*l+a*y*h+u*v*c,l*d*i+h*y*r+c*v*s,l*d*o+h*y*a+c*v*u,l*d*l+h*y*h+c*v*c)}function g(t,e,n,i,r){var s=t+1,o=s*s,a=new Vt,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0;for(u=0,d=0;d<8;++d)c=(i+(h=Z[d])[2])*o+(n+h[1])*s+(e+h[0]),u|=Math.min(r[c],L.SOLID)<<d;for(l=0,d=0;d<12;++d)(u>>Q[d][0]&1)!==(u>>Q[d][1]&1)&&++l;return a.materials=u,a.edgeCount=l,a.qefData=new Ot,a}function w(t,e,n){var i=[-1,-1,-1,-1],r=[!1,!1,!1,!1],s=1/0,o=0,a=!1,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0,y=void 0,v=void 0;for(v=0;v<4;++v)d=t[v],y=$t[e][v],u=Q[y][0],l=Q[y][1],h=d.voxel.materials>>u&1,c=d.voxel.materials>>l&1,d.size<s&&(s=d.size,o=v,a=h!==L.AIR),i[v]=d.voxel.index,r[v]=h!==c;r[o]&&(a?(n.push(i[0]),n.push(i[3]),n.push(i[1]),n.push(i[0]),n.push(i[2]),n.push(i[3])):(n.push(i[0]),n.push(i[1]),n.push(i[3]),n.push(i[0]),n.push(i[3]),n.push(i[2])))}function k(t,e,n){var i=[0,0,0,0],r=void 0,s=void 0,o=void 0,a=void 0;if(null!==t[0].voxel&&null!==t[1].voxel&&null!==t[2].voxel&&null!==t[3].voxel)w(t,e,n);else for(o=0;o<2;++o){for(i[0]=Wt[e][o][0],i[1]=Wt[e][o][1],i[2]=Wt[e][o][2],i[3]=Wt[e][o][3],r=[],a=0;a<4;++a)if(null!==(s=t[a]).voxel)r[a]=s;else{if(null===s.children)break;r[a]=s.children[i[a]]}4===a&&k(r,Wt[e][o][4],n)}}function b(t,e,n){var i=[0,0,0,0],r=[[0,0,1,1],[0,1,0,1]],s=void 0,o=void 0,a=void 0,u=void 0,l=void 0;if(null!==t[0].children||null!==t[1].children){for(u=0;u<4;++u)i[0]=Jt[e][u][0],i[1]=Jt[e][u][1],b([null===t[0].children?t[0]:t[0].children[i[0]],null===t[1].children?t[1]:t[1].children[i[1]]],Jt[e][u][2],n);for(u=0;u<4;++u){for(i[0]=Kt[e][u][1],i[1]=Kt[e][u][2],i[2]=Kt[e][u][3],i[3]=Kt[e][u][4],o=r[Kt[e][u][0]],s=[],l=0;l<4;++l)if(null!==(a=t[o[l]]).voxel)s[l]=a;else{if(null===a.children)break;s[l]=a.children[i[l]]}4===l&&k(s,Kt[e][u][5],n)}}}function z(t,e){var n=t.children,i=[0,0,0,0],r=void 0;if(null!==n){for(r=0;r<8;++r)z(n[r],e);for(r=0;r<12;++r)i[0]=Zt[r][0],i[1]=Zt[r][1],b([n[i[0]],n[i[1]]],Zt[r][2],e);for(r=0;r<6;++r)i[0]=Qt[r][0],i[1]=Qt[r][1],i[2]=Qt[r][2],i[3]=Qt[r][3],k([n[i[0]],n[i[1]],n[i[2]],n[i[3]]],Qt[r][4],e)}}function A(t,e,n,i){var r=void 0,s=void 0;if(null!==t.children)for(r=0;r<8;++r)i=A(t.children[r],e,n,i);else null!==t.voxel&&((s=t.voxel).index=i,e[3*i]=s.position.x,e[3*i+1]=s.position.y,e[3*i+2]=s.position.z,n[3*i]=s.normal.x,n[3*i+1]=s.normal.y,n[3*i+2]=s.normal.z,++i);return i}function U(t){var e=ce,n=Mt.resolution,i=new q(0,0,0),r=new q(n,n,n),s=new V(de,de.clone().addScalar(ce));return t.type!==oe.INTERSECTION&&(t.boundingBox.intersectsBox(s)?(i.copy(t.boundingBox.min).max(s.min).sub(s.min),i.x=Math.ceil(i.x*n/e),i.y=Math.ceil(i.y*n/e),i.z=Math.ceil(i.z*n/e),r.copy(t.boundingBox.max).min(s.max).sub(s.min),r.x=Math.floor(r.x*n/e),r.y=Math.floor(r.y*n/e),r.z=Math.floor(r.z*n/e)):(i.set(n,n,n),r.set(0,0,0))),new V(i,r)}function I(t,e,n,i){var r=Mt.resolution+1,s=r*r,o=i.max.x,a=i.max.y,u=i.max.z,l=void 0,h=void 0,c=void 0;for(c=i.min.z;c<=u;++c)for(h=i.min.y;h<=a;++h)for(l=i.min.x;l<=o;++l)t.updateMaterialIndex(c*s+h*r+l,e,n)}function M(t,e,n){var i=ce,r=Mt.resolution,s=r+1,o=s*s,a=e.materialIndices,u=de,l=new q,h=new q,c=n.max.x,d=n.max.y,y=n.max.z,v=void 0,f=0,m=void 0,p=void 0,x=void 0;for(x=n.min.z;x<=y;++x)for(l.z=x*i/r,p=n.min.y;p<=d;++p)for(l.y=p*i/r,m=n.min.x;m<=c;++m)l.x=m*i/r,(v=t.generateMaterialIndex(h.addVectors(u,l)))!==L.AIR&&(a[x*o+p*s+m]=v,++f);e.materials=f}function S(t,e,n){var i=Mt.resolution,r=i+1,s=r*r,o=new Uint32Array([1,r,s]),a=e.materialIndices,u=new gt,l=new gt,h=n.edgeData,c=e.edgeData,d=new Uint32Array(3),y=At.calculate1DEdgeCount(i),v=new At(Math.min(y,c.indices[0].length+h.indices[0].length),Math.min(y,c.indices[1].length+h.indices[1].length),Math.min(y,c.indices[2].length+h.indices[2].length)),f=void 0,m=void 0,p=void 0,x=void 0,g=void 0,w=void 0,k=void 0,b=void 0,z=void 0,A=void 0,U=void 0,I=void 0,M=void 0,S=void 0,O=void 0,_=void 0,C=void 0,D=void 0,E=void 0,P=void 0,T=void 0,N=void 0;for(C=0,D=0;D<3;C=0,++D){for(f=h.indices[D],x=c.indices[D],k=v.indices[D],m=h.zeroCrossings[D],g=c.zeroCrossings[D],b=v.zeroCrossings[D],p=h.normals[D],w=c.normals[D],z=v.normals[D],T=f.length,N=x.length,E=0,P=0;E<T;++E)if(A=f[E],U=A+o[D],S=a[A],O=a[U],S!==O&&(S===L.AIR||O===L.AIR)){for(u.t=m[E],u.n.x=p[3*E],u.n.y=p[3*E+1],u.n.z=p[3*E+2],t.type===oe.DIFFERENCE&&u.n.negate(),_=u;P<N&&x[P]<=A;)M=(I=x[P])+o[D],l.t=g[P],l.n.x=w[3*P],l.n.y=w[3*P+1],l.n.z=w[3*P+2],S=a[I],I<A?S===(O=a[M])||S!==L.AIR&&O!==L.AIR||(k[C]=I,b[C]=l.t,z[3*C]=l.n.x,z[3*C+1]=l.n.y,z[3*C+2]=l.n.z,++C):_=t.selectEdge(l,u,S===L.SOLID),++P;k[C]=A,b[C]=_.t,z[3*C]=_.n.x,z[3*C+1]=_.n.y,z[3*C+2]=_.n.z,++C}for(;P<N;)M=(I=x[P])+o[D],(S=a[I])===(O=a[M])||S!==L.AIR&&O!==L.AIR||(k[C]=I,b[C]=g[P],z[3*C]=w[3*P],z[3*C+1]=w[3*P+1],z[3*C+2]=w[3*P+2],++C),++P;d[D]=C}return{edgeData:v,lengths:d}}function O(t,e,n){var i=ce,r=Mt.resolution,s=r+1,o=s*s,a=new Uint32Array([1,s,o]),u=e.materialIndices,l=de,h=new q,c=new q,d=new gt,y=new Uint32Array(3),v=new At(At.calculate1DEdgeCount(r)),f=void 0,m=void 0,p=void 0,x=void 0,g=void 0,w=void 0,k=void 0,b=void 0,z=void 0,A=void 0,U=void 0,I=void 0,M=void 0,S=void 0,O=void 0,_=void 0,C=void 0,D=void 0;for(S=4,I=0,M=0;M<3;S>>=1,I=0,++M){switch(O=Z[S],f=v.indices[M],m=v.zeroCrossings[M],p=v.normals[M],w=n.min.x,z=n.max.x,k=n.min.y,A=n.max.y,b=n.min.z,U=n.max.z,M){case 0:w=Math.max(w-1,0),z=Math.min(z,r-1);break;case 1:k=Math.max(k-1,0),A=Math.min(A,r-1);break;case 2:b=Math.max(b-1,0),U=Math.min(U,r-1)}for(D=b;D<=U;++D)for(C=k;C<=A;++C)for(_=w;_<=z;++_)g=(x=D*o+C*s+_)+a[M],u[x]!==u[g]&&(h.set(_*i/r,C*i/r,D*i/r),c.set((_+O[0])*i/r,(C+O[1])*i/r,(D+O[2])*i/r),d.a.addVectors(l,h),d.b.addVectors(l,c),t.generateEdge(d),f[I]=x,m[I]=d.t,p[3*I]=d.n.x,p[3*I+1]=d.n.y,p[3*I+2]=d.n.z,++I);y[M]=I}return{edgeData:v,lengths:y}}function _(t,e,n){var i=U(t),r=void 0,s=void 0,o=void 0,a=void 0,u=!1;if(t.type===oe.DENSITY_FUNCTION?M(t,e,i):e.empty?t.type===oe.UNION&&(e.set(n),u=!0):e.full&&t.type===oe.UNION||I(t,e,n,i),!u&&!e.empty&&!e.full){for(s=(r=t.type===oe.DENSITY_FUNCTION?O(t,e,i):S(t,e,n)).edgeData,o=r.lengths,a=0;a<3;++a)s.indices[a]=s.indices[a].slice(0,o[a]),s.zeroCrossings[a]=s.zeroCrossings[a].slice(0,o[a]),s.normals[a]=s.normals[a].slice(0,3*o[a]);e.edgeData=s}}function C(t){var e=t.children,n=void 0,i=void 0,r=void 0,s=void 0;for(t.type===oe.DENSITY_FUNCTION&&_(t,n=new Mt),r=0,s=e.length;r<s&&(i=C(e[r]),void 0===n?n=i:null!==i?null===n?t.type===oe.UNION&&(n=i):_(t,n,i):t.type===oe.INTERSECTION&&(n=null),null!==n||t.type===oe.UNION);++r);return null!==n&&n.empty?null:n}var D=function(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")},E=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,\"value\"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),P=function t(e,n,i){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,n);if(void 0===r){var s=Object.getPrototypeOf(e);return null===s?void 0:t(s,n,i)}if(\"value\"in r)return r.value;var o=r.get;if(void 0!==o)return o.call(i)},T=function(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},N=function(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e},R=function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)},F=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;D(this,t),this.runLengths=e,this.data=n}return E(t,null,[{key:\"encode\",value:function(e){var n=[],i=[],r=e[0],s=1,o=void 0,a=void 0;for(o=1,a=e.length;o<a;++o)r!==e[o]?(n.push(s),i.push(r),r=e[o],s=1):++s;return n.push(s),i.push(r),new t(n,i)}},{key:\"decode\",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],i=void 0,r=void 0,s=void 0,o=void 0,a=void 0,u=0;for(r=0,o=e.length;r<o;++r)for(i=e[r],s=0,a=t[r];s<a;++s)n[u++]=i;return n}}]),t}(),L={AIR:0,SOLID:1},B=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;D(this,t),this.x=e,this.y=n}return E(t,[{key:\"set\",value:function(t,e){return this.x=t,this.y=e,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this}},{key:\"fromArray\",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[e],this.y=t[e+1],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[e]=this.x,t[e+1]=this.y,t}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y)}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this}},{key:\"addScaledVector\",value:function(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this}},{key:\"addVectors\",value:function(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this}},{key:\"subVectors\",value:function(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this}},{key:\"multiplyScalar\",value:function(t){return isFinite(t)?(this.x*=t,this.y*=t):(this.x=0,this.y=0),this}},{key:\"multiplyVectors\",value:function(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this}},{key:\"divideScalar\",value:function(t){return this.multiplyScalar(1/t)}},{key:\"divideVectors\",value:function(t,e){return this.x=t.x/e.x,this.y=t.y/e.y,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y}},{key:\"lengthSq\",value:function(){return this.x*this.x+this.y*this.y}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y)}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"distanceToSquared\",value:function(t){var e=this.x-t.x,n=this.y-t.y;return e*e+n*n}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}},{key:\"clamp\",value:function(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}}]),t}(),q=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;D(this,t),this.x=e,this.y=n,this.z=i}return E(t,[{key:\"set\",value:function(t,e,n){return this.x=t,this.y=e,this.z=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}},{key:\"fromArray\",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}},{key:\"addScaledVector\",value:function(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this.z+=t,this}},{key:\"addVectors\",value:function(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this.z-=t,this}},{key:\"subVectors\",value:function(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}},{key:\"multiplyScalar\",value:function(t){return isFinite(t)?(this.x*=t,this.y*=t,this.z*=t):(this.x=0,this.y=0,this.z=0),this}},{key:\"multiplyVectors\",value:function(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}},{key:\"divideScalar\",value:function(t){return this.multiplyScalar(1/t)}},{key:\"divideVectors\",value:function(t,e){return this.x=t.x/e.x,this.y=t.y/e.y,this.z=t.z/e.z,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z}},{key:\"lengthSq\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"distanceToSquared\",value:function(t){var e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}},{key:\"clamp\",value:function(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}},{key:\"applyMatrix3\",value:function(t){var e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}},{key:\"applyMatrix4\",value:function(t){var e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i+r[12],this.y=r[1]*e+r[5]*n+r[9]*i+r[13],this.z=r[2]*e+r[6]*n+r[10]*i+r[14],this}}]),t}(),V=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q(1/0,1/0,1/0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new q(-1/0,-1/0,-1/0);D(this,t),this.min=e,this.max=n}return E(t,[{key:\"set\",value:function(t,e){return this.min.copy(t),this.max.copy(e),this}},{key:\"copy\",value:function(t){return this.min.copy(t.min),this.max.copy(t.max),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"expandByPoint\",value:function(t){return this.min.min(t),this.max.max(t),this}},{key:\"union\",value:function(t){return this.min.min(t.min),this.max.max(t.max),this}},{key:\"setFromPoints\",value:function(t){var e=void 0,n=void 0;for(e=0,n=t.length;e<n;++e)this.expandByPoint(t[e]);return this}},{key:\"setFromCenterAndSize\",value:function(t,e){var n=e.clone().multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}},{key:\"intersectsBox\",value:function(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}}]),t}(),j=function(){function t(){D(this,t),this.elements=new Float32Array([1,0,0,0,1,0,0,0,1])}return E(t,[{key:\"set\",value:function(t,e,n,i,r,s,o,a,u){var l=this.elements;return l[0]=t,l[3]=e,l[6]=n,l[1]=i,l[4]=r,l[7]=s,l[2]=o,l[5]=a,l[8]=u,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,1,0,0,0,1),this}},{key:\"copy\",value:function(t){var e=t.elements;return this.set(e[0],e[3],e[6],e[1],e[4],e[7],e[2],e[5],e[8])}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}}]),t}(),Y=function(){function t(){D(this,t),this.elements=new Float32Array([1,0,0,1,0,1])}return E(t,[{key:\"set\",value:function(t,e,n,i,r,s){var o=this.elements;return o[0]=t,o[1]=e,o[3]=i,o[2]=n,o[4]=r,o[5]=s,this}},{key:\"identity\",value:function(){return this.set(1,0,0,1,0,1),this}},{key:\"copy\",value:function(t){var e=t.elements;return this.set(e[0],e[1],e[2],e[3],e[4],e[5]),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"toMatrix3\",value:function(t){var e=t.elements;t.set(e[0],e[1],e[2],e[1],e[3],e[4],e[2],e[4],e[5])}},{key:\"add\",value:function(t){var e=this.elements,n=t.elements;return e[0]+=n[0],e[1]+=n[1],e[3]+=n[3],e[2]+=n[2],e[4]+=n[4],e[5]+=n[5],this}},{key:\"norm\",value:function(){var t=this.elements,e=t[1]*t[1],n=t[2]*t[2],i=t[4]*t[4];return Math.sqrt(t[0]*t[0]+e+n+e+t[3]*t[3]+i+n+i+t[5]*t[5])}},{key:\"off\",value:function(){var t=this.elements;return Math.sqrt(2*(t[1]*t[1]+t[2]*t[2]+t[4]*t[4]))}},{key:\"applyToVector3\",value:function(t){var e=t.x,n=t.y,i=t.z,r=this.elements;return t.x=r[0]*e+r[1]*n+r[2]*i,t.y=r[1]*e+r[3]*n+r[4]*i,t.z=r[2]*e+r[4]*n+r[5]*i,t}}],[{key:\"calculateIndex\",value:function(t,e){return 3-(3-t)*(2-t)/2+e}}]),t}(),X=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];D(this,t),this.value=e,this.done=n}return E(t,[{key:\"reset\",value:function(){this.value=null,this.done=!1}}]),t}(),H=new q,G=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new q;D(this,t),this.min=e,this.max=n,this.children=null}return E(t,[{key:\"getCenter\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q).copy(this.min).add(this.max).multiplyScalar(.5)}},{key:\"getDimensions\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q).copy(this.max).sub(this.min)}},{key:\"split\",value:function(){var t=this.min,e=this.max,n=this.getCenter(H),i=this.children=[null,null,null,null,null,null,null,null],r=void 0,s=void 0;for(r=0;r<8;++r)s=Z[r],i[r]=new this.constructor(new q(0===s[0]?t.x:n.x,0===s[1]?t.y:n.y,0===s[2]?t.z:n.z),new q(0===s[0]?n.x:e.x,0===s[1]?n.y:e.y,0===s[2]?n.z:e.z))}}]),t}(),Z=[new Uint8Array([0,0,0]),new Uint8Array([0,0,1]),new Uint8Array([0,1,0]),new Uint8Array([0,1,1]),new Uint8Array([1,0,0]),new Uint8Array([1,0,1]),new Uint8Array([1,1,0]),new Uint8Array([1,1,1])],Q=[new Uint8Array([0,4]),new Uint8Array([1,5]),new Uint8Array([2,6]),new Uint8Array([3,7]),new Uint8Array([0,2]),new Uint8Array([1,3]),new Uint8Array([4,6]),new Uint8Array([5,7]),new Uint8Array([0,1]),new Uint8Array([2,3]),new Uint8Array([4,5]),new Uint8Array([6,7])],J=new q,K=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;D(this,t),this.min=e,this.size=n,this.children=null}return E(t,[{key:\"getCenter\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q).copy(this.min).addScalar(.5*this.size)}},{key:\"getDimensions\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q).set(this.size,this.size,this.size)}},{key:\"split\",value:function(){var t=this.min,e=this.getCenter(J),n=.5*this.size,i=this.children=[null,null,null,null,null,null,null,null],r=void 0,s=void 0;for(r=0;r<8;++r)s=Z[r],i[r]=new this.constructor(new q(0===s[0]?t.x:e.x,0===s[1]?t.y:e.y,0===s[2]?t.z:e.z),n)}},{key:\"max\",get:function(){return this.min.clone().addScalar(this.size)}}]),t}(),W=new V,$=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;D(this,t),this.octree=e,this.region=n,this.cull=null!==n,this.result=new X,this.trace=null,this.indices=null,this.reset()}return E(t,[{key:\"reset\",value:function(){var t=this.octree.root;return this.trace=[],this.indices=[],null!==t&&(W.min=t.min,W.max=t.max,this.cull&&!this.region.intersectsBox(W)||(this.trace.push(t),this.indices.push(0))),this.result.reset(),this}},{key:\"next\",value:function(){for(var t=this.cull,e=this.region,n=this.indices,i=this.trace,r=null,s=i.length-1,o=void 0,a=void 0,u=void 0;null===r&&s>=0;)if(o=n[s],a=i[s].children,++n[s],o<8)if(null!==a){if(u=a[o],t&&(W.min=u.min,W.max=u.max,!e.intersectsBox(W)))continue;i.push(u),n.push(0),++s}else r=i.pop(),n.pop();else i.pop(),n.pop(),--s;return this.result.value=r,this.result.done=null===r,this.result}},{key:\"return\",value:function(t){return this.result.value=t,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),tt=new Uint8Array([0,1,2,3,4,5,6,7,0]),et=[new Uint8Array([4,2,1]),new Uint8Array([5,3,8]),new Uint8Array([6,8,3]),new Uint8Array([7,8,8]),new Uint8Array([8,6,5]),new Uint8Array([8,7,8]),new Uint8Array([8,8,7]),new Uint8Array([8,8,8])],nt=new q,it=new q,rt=new q,st=new q,ot=new q,at=new q,ut=new q,lt=function(){function t(){D(this,t)}return E(t,null,[{key:\"intersectOctree\",value:function(t,e,i){var r=void 0,s=void 0,o=void 0,a=void 0,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0;t.getDimensions(nt),it.copy(nt).multiplyScalar(.5),st.copy(t.min).sub(t.min),ot.copy(t.max).sub(t.min),at.copy(e.ray.direction),ut.copy(e.ray.origin),ut.sub(t.getCenter(rt)).add(it),tt[8]=tt[0],at.x<0&&(ut.x=nt.x-ut.x,at.x=-at.x,tt[8]|=tt[4]),at.y<0&&(ut.y=nt.y-ut.y,at.y=-at.y,tt[8]|=tt[2]),at.z<0&&(ut.z=nt.z-ut.z,at.z=-at.z,tt[8]|=tt[1]),r=1/at.x,s=1/at.y,o=1/at.z,a=(st.x-ut.x)*r,u=(ot.x-ut.x)*r,l=(st.y-ut.y)*s,h=(ot.y-ut.y)*s,c=(st.z-ut.z)*o,d=(ot.z-ut.z)*o,Math.max(Math.max(a,l),c)<Math.min(Math.min(u,h),d)&&n(t.root,a,l,c,u,h,d,e,i)}}]),t}(),ht=new V,ct=function(){function t(e,n){D(this,t),this.root=void 0!==e&&void 0!==n?new G(e,n):null}return E(t,[{key:\"getCenter\",value:function(t){return this.root.getCenter(t)}},{key:\"getDimensions\",value:function(t){return this.root.getDimensions(t)}},{key:\"getDepth\",value:function(){return i(this.root)}},{key:\"cull\",value:function(t){var e=[];return r(this.root,t,e),e}},{key:\"findOctantsByLevel\",value:function(t){var e=[];return s(this.root,t,0,e),e}},{key:\"raycast\",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return lt.intersectOctree(this,t,e),e}},{key:\"leaves\",value:function(t){return new $(this,t)}},{key:Symbol.iterator,value:function(){return new $(this)}},{key:\"min\",get:function(){return this.root.min}},{key:\"max\",get:function(){return this.root.max}},{key:\"children\",get:function(){return this.root.children}}]),t}(),dt=new q,yt=function(t){function e(t,n){D(this,e);var i=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));return i.points=null,i.data=null,i}return T(e,G),E(e,[{key:\"distanceToSquared\",value:function(t){return dt.copy(t).clamp(this.min,this.max).sub(t).lengthSq()}},{key:\"distanceToCenterSquared\",value:function(t){var e=this.getCenter(dt),n=t.x-e.x,i=t.y-e.x,r=t.z-e.z;return n*n+i*i+r*r}},{key:\"contains\",value:function(t,e){var n=this.min,i=this.max;return t.x>=n.x-e&&t.y>=n.y-e&&t.z>=n.z-e&&t.x<=i.x+e&&t.y<=i.y+e&&t.z<=i.z+e}},{key:\"redistribute\",value:function(t){var e=this.children,n=this.points,i=this.data,r=void 0,s=void 0,o=void 0,a=void 0,u=void 0,l=void 0,h=void 0;if(null!==e)for(r=0,o=n.length;r<o;++r)for(l=n[r],h=i[r],s=0,a=e.length;s<a;++s)if((u=e[s]).contains(l,t)){null===u.points&&(u.points=[],u.data=[]),u.points.push(l),u.data.push(h);break}this.points=null,this.data=null}},{key:\"merge\",value:function(){var t=this.children,e=void 0,n=void 0,i=void 0;if(null!==t){for(this.points=[],this.data=[],e=0,n=t.length;e<n;++e)if(null!==(i=t[e]).points){var r,s;(r=this.points).push.apply(r,R(i.points)),(s=this.data).push.apply(s,R(i.data))}this.children=null}}}]),e}(),vt=function t(e,n,i){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;D(this,t),this.distance=e,this.distanceToRay=n,this.point=i,this.object=r},ft=1e-6,mt=(function(t){function e(t,n){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:8,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:8;D(this,e);var o=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return o.root=new yt(t,n),o.bias=Math.max(0,i),o.maxPoints=Math.max(1,Math.round(r)),o.maxDepth=Math.max(0,Math.round(s)),o.pointCount=0,o}T(e,ct),E(e,[{key:\"countPoints\",value:function(t){return o(t)}},{key:\"put\",value:function(t,e){return a(t,e,this,this.root,0)}},{key:\"remove\",value:function(t){return u(t,this,this.root,null)}},{key:\"fetch\",value:function(t){return l(t,this,this.root)}},{key:\"move\",value:function(t,e){return h(t,e,this,this.root,null,0)}},{key:\"findNearestPoint\",value:function(t){return c(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:1/0,arguments.length>2&&void 0!==arguments[2]&&arguments[2],this.root)}},{key:\"findPoints\",value:function(t,e){var n=[];return d(t,e,arguments.length>2&&void 0!==arguments[2]&&arguments[2],this.root,n),n}},{key:\"raycast\",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],i=P(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),\"raycast\",this).call(this,t);return i.length>0&&this.testPoints(i,t,n),n}},{key:\"testPoints\",value:function(t,e,n){var i=e.params.Points.threshold,r=i*i,s=void 0,o=void 0,a=void 0,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0,y=void 0,v=void 0,f=void 0;for(l=0,c=t.length;l<c;++l)if(y=t[l],null!==(v=y.points))for(h=0,d=v.length;h<d;++h)f=v[h],(u=e.ray.distanceSqToPoint(f))<r&&(s=e.ray.closestPointToPoint(f),(o=e.ray.origin.distanceTo(s))>=e.near&&o<=e.far&&(a=Math.sqrt(u),n.push(new vt(o,a,s,y.data[h]))))}}])}(),function(){function t(){D(this,t)}E(t,null,[{key:\"recycleOctants\",value:function(t,e){var n=new q,i=new q,r=new q,s=t.min,o=t.getCenter(),a=t.getDimensions().multiplyScalar(.5),u=t.children,l=e.length,h=void 0,c=void 0,d=void 0,y=void 0;for(h=0;h<8;++h)for(d=Z[h],i.addVectors(s,n.fromArray(d).multiply(a)),r.addVectors(o,n.fromArray(d).multiply(a)),c=0;c<l;++c)if(null!==(y=e[c])&&i.equals(y.min)&&r.equals(y.max)){u[h]=y,e[c]=null;break}}}])}(),new q),pt=new q,xt=new q,gt=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new q;D(this,t),this.a=e,this.b=n,this.index=-1,this.coordinates=new q,this.t=0,this.n=new q}return E(t,[{key:\"approximateZeroCrossing\",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,n=Math.max(1,e-1),i=0,r=1,s=0,o=0,a=void 0,u=void 0;for(mt.subVectors(this.b,this.a);o<=n&&(s=(i+r)/2,pt.addVectors(this.a,xt.copy(mt).multiplyScalar(s)),u=t.sample(pt),!(Math.abs(u)<=1e-4||(r-i)/2<=1e-6));)pt.addVectors(this.a,xt.copy(mt).multiplyScalar(i)),a=t.sample(pt),Math.sign(u)===Math.sign(a)?i=s:r=s,++o;this.t=s}},{key:\"computeZeroCrossingPosition\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new q).subVectors(this.b,this.a).multiplyScalar(this.t).add(this.a)}},{key:\"computeSurfaceNormal\",value:function(t){var e=this.computeZeroCrossingPosition(mt),n=.001,i=t.sample(pt.addVectors(e,xt.set(n,0,0)))-t.sample(pt.subVectors(e,xt.set(n,0,0))),r=t.sample(pt.addVectors(e,xt.set(0,n,0)))-t.sample(pt.subVectors(e,xt.set(0,n,0))),s=t.sample(pt.addVectors(e,xt.set(0,0,n)))-t.sample(pt.subVectors(e,xt.set(0,0,n)));this.n.set(i,r,s).normalize()}}]),t}(),wt=new gt,kt=new q,bt=new q,zt=function(){function t(e,n,i){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:3;D(this,t),this.edgeData=e,this.cellPosition=n,this.cellSize=i,this.indices=null,this.zeroCrossings=null,this.normals=null,this.axes=null,this.lengths=null,this.result=new X,this.initialC=r,this.c=r,this.initialD=s,this.d=s,this.i=0,this.l=0,this.reset()}return E(t,[{key:\"reset\",value:function(){var t=this.edgeData,e=[],n=[],i=[],r=[],s=[],o=void 0,a=void 0,u=void 0,l=void 0;for(this.i=0,this.c=0,this.d=0,o=4>>(a=this.initialC),u=this.initialD;a<u;++a,o>>=1)(l=t.indices[a].length)>0&&(e.push(t.indices[a]),n.push(t.zeroCrossings[a]),i.push(t.normals[a]),r.push(Z[o]),s.push(l),++this.d);return this.l=s.length>0?s[0]:0,this.indices=e,this.zeroCrossings=n,this.normals=i,this.axes=r,this.lengths=s,this.result.reset(),this}},{key:\"next\",value:function(){var t=this.cellSize,e=Mt.resolution,n=e+1,i=n*n,r=this.result,s=this.cellPosition,o=void 0,a=void 0,u=void 0,l=void 0,h=void 0,c=void 0,d=void 0;return this.i===this.l&&(this.l=++this.c<this.d?this.lengths[this.c]:0,this.i=0),this.i<this.l?(c=this.c,d=this.i,o=this.axes[c],a=this.indices[c][d],wt.index=a,u=a%n,l=Math.trunc(a%i/n),h=Math.trunc(a/i),wt.coordinates.set(u,l,h),kt.set(u*t/e,l*t/e,h*t/e),bt.set((u+o[0])*t/e,(l+o[1])*t/e,(h+o[2])*t/e),wt.a.addVectors(s,kt),wt.b.addVectors(s,bt),wt.t=this.zeroCrossings[c][d],wt.n.fromArray(this.normals[c],3*d),r.value=wt,++this.i):(r.value=null,r.done=!0),r}},{key:\"return\",value:function(t){return this.result.value=t,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),At=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e;D(this,t),this.indices=e<=0?null:[new Uint32Array(e),new Uint32Array(n),new Uint32Array(i)],this.zeroCrossings=e<=0?null:[new Float32Array(e),new Float32Array(n),new Float32Array(i)],this.normals=e<=0?null:[new Float32Array(3*e),new Float32Array(3*n),new Float32Array(3*i)]}return E(t,[{key:\"serialize\",value:function(){return{edges:this.edges,zeroCrossings:this.zeroCrossings,normals:this.normals}}},{key:\"deserialize\",value:function(t){var e=this;return null!==t?(this.edges=t.edges,this.zeroCrossings=t.zeroCrossings,this.normals=t.normals):e=null,e}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=[this.edges[0],this.edges[1],this.edges[2],this.zeroCrossings[0],this.zeroCrossings[1],this.zeroCrossings[2],this.normals[0],this.normals[1],this.normals[2]],n=void 0,i=void 0,r=void 0;for(i=0,r=e.length;i<r;++i)null!==(n=e[i])&&t.push(n.buffer);return t}},{key:\"edges\",value:function(t,e){return new zt(this,t,e)}},{key:\"edgesX\",value:function(t,e){return new zt(this,t,e,0,1)}},{key:\"edgesY\",value:function(t,e){return new zt(this,t,e,1,2)}},{key:\"edgesZ\",value:function(t,e){return new zt(this,t,e,2,3)}}],[{key:\"calculate1DEdgeCount\",value:function(t){return Math.pow(t+1,2)*t}}]),t}(),Ut=0,It=0,Mt=function(){function t(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];D(this,t),this.lod=-1,this.neutered=!1,this.materials=0,this.materialIndices=e?new Uint8Array(It):null,this.runLengths=null,this.edgeData=null}return E(t,[{key:\"set\",value:function(t){return this.lod=t.lod,this.neutered=t.neutered,this.materials=t.materials,this.materialIndices=t.materialIndices,this.runLengths=t.runLengths,this.edgeData=t.edgeData,this}},{key:\"clear\",value:function(){return this.lod=-1,this.neutered=!1,this.materials=0,this.materialIndices=null,this.runLengths=null,this.edgeData=null,this}},{key:\"setMaterialIndex\",value:function(t,e){this.materialIndices[t]===L.AIR?e!==L.AIR&&++this.materials:e===L.AIR&&--this.materials,this.materialIndices[t]=e}},{key:\"compress\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this,e=void 0;return this.compressed||(e=this.full?new F([this.materialIndices.length],[L.SOLID]):F.encode(this.materialIndices),t.runLengths=new Uint32Array(e.runLengths),t.materialIndices=new Uint8Array(e.data)),t}},{key:\"decompress\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return this.compressed&&(t.materialIndices=F.decode(this.runLengths,this.materialIndices,new Uint8Array(It)),t.runLengths=null),t}},{key:\"serialize\",value:function(){return this.neutered=!0,{lod:this.lod,materials:this.materials,materialIndices:this.materialIndices,runLengths:this.runLengths,edgeData:null!==this.edgeData?this.edgeData.serialize():null}}},{key:\"deserialize\",value:function(t){var e=this;return null!==t?(this.lod=t.lod,this.materials=t.materials,this.materialIndices=t.materialIndices,this.runLengths=t.runLengths,null!==t.edgeData?(null===this.edgeData&&(this.edgeData=new At(0)),this.edgeData.deserialize(t.edgeData)):this.edgeData=null,this.neutered=!1):e=null,e}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return null!==this.edgeData&&this.edgeData.createTransferList(t),t.push(this.materialIndices.buffer),t.push(this.runLengths.buffer),t}},{key:\"empty\",get:function(){return 0===this.materials}},{key:\"full\",get:function(){return this.materials===It}},{key:\"compressed\",get:function(){return null!==this.runLengths}}],[{key:\"resolution\",get:function(){return Ut},set:function(t){0===Ut&&(Ut=Math.max(1,Math.min(256,t)),It=Math.pow(Ut+1,3))}}]),t}(),St=function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;D(this,t),this.action=e,this.data=null,this.error=null},Ot=function(){function t(){D(this,t),this.ata=new Y,this.ata.set(0,0,0,0,0,0),this.atb=new q,this.massPointSum=new q,this.numPoints=0}return E(t,[{key:\"set\",value:function(t,e,n,i){return this.ata.copy(t),this.atb.copy(e),this.massPointSum.copy(n),this.numPoints=i,this}},{key:\"copy\",value:function(t){return this.set(t.ata,t.atb,t.massPointSum,t.numPoints)}},{key:\"add\",value:function(t,e){var n=e.x,i=e.y,r=e.z,s=t.dot(e),o=this.ata.elements,a=this.atb;o[0]+=n*n,o[1]+=n*i,o[3]+=i*i,o[2]+=n*r,o[4]+=i*r,o[5]+=r*r,a.x+=s*n,a.y+=s*i,a.z+=s*r,this.massPointSum.add(t),++this.numPoints}},{key:\"addData\",value:function(t){this.ata.add(t.ata),this.atb.add(t.atb),this.massPointSum.add(t.massPointSum),this.numPoints+=t.numPoints}},{key:\"clear\",value:function(){this.ata.set(0,0,0,0,0,0),this.atb.set(0,0,0),this.massPointSum.set(0,0,0),this.numPoints=0}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}}]),t}(),_t=new B,Ct=function(){function t(){D(this,t)}return E(t,null,[{key:\"calculateCoefficients\",value:function(t,e,n){var i=void 0,r=void 0,s=void 0;return 0===e?(_t.x=1,_t.y=0):(i=(n-t)/(2*e),r=Math.sqrt(1+i*i),s=1/(i>=0?i+r:i-r),_t.x=1/Math.sqrt(1+s*s),_t.y=s*_t.x),_t}}]),t}(),Dt=function(){function t(){D(this,t)}return E(t,null,[{key:\"rotateXY\",value:function(t,e){var n=e.x,i=e.y,r=t.x,s=t.y;t.set(n*r-i*s,i*r+n*s)}},{key:\"rotateQXY\",value:function(t,e,n){var i=n.x,r=n.y,s=i*i,o=r*r,a=2*i*r*e,u=t.x,l=t.y;t.set(s*u-a+o*l,o*u+a+s*l)}}]),t}(),Et=1e-6,Pt=5,Tt=new Y,Nt=new j,Rt=new B,Ft=new q,Lt=function(){function t(){D(this,t)}return E(t,null,[{key:\"solve\",value:function(t,e,n){var i=m(Tt.copy(t),Nt.identity()),r=x(Nt,i);n.copy(e).applyMatrix3(r)}}]),t}(),Bt=new q,qt=function(){function t(){D(this,t),this.data=null,this.ata=new Y,this.atb=new q,this.massPoint=new q,this.hasSolution=!1}return E(t,[{key:\"setData\",value:function(t){return this.data=t,this.hasSolution=!1,this}},{key:\"calculateError\",value:function(t,e,n){return Bt.copy(n),t.applyToVector3(Bt),Bt.subVectors(e,Bt),Bt.dot(Bt)}},{key:\"solve\",value:function(t){var e=this.data,n=this.massPoint,i=this.ata.copy(e.ata),r=this.atb.copy(e.atb),s=1/0;return!this.hasSolution&&null!==e&&e.numPoints>0&&(Bt.copy(e.massPointSum).divideScalar(e.numPoints),n.copy(Bt),i.applyToVector3(Bt),r.sub(Bt),Lt.solve(i,r,t),s=this.calculateError(i,r,t),t.add(n),this.hasSolution=!0),s}}]),t}(),Vt=function t(){D(this,t),this.materials=0,this.edgeCount=0,this.index=-1,this.position=new q,this.normal=new q,this.qefData=null},jt=new qt,Yt=.01,Xt=function(t){function e(t,n){D(this,e);var i=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n));return i.voxel=null,i}return T(e,K),E(e,[{key:\"contains\",value:function(t){var e=this.min,n=this.size;return t.x>=e.x-1e-6&&t.y>=e.y-1e-6&&t.z>=e.z-1e-6&&t.x<=e.x+n+1e-6&&t.y<=e.y+n+1e-6&&t.z<=e.z+n+1e-6}},{key:\"collapse\",value:function(){var t=this.children,e=new Int16Array([-1,-1,-1,-1,-1,-1,-1,-1]),n=new q,i=-1,r=null!==t,s=0,o=void 0,a=void 0,u=void 0,l=void 0,h=void 0,c=void 0;if(r){for(l=new Ot,h=0,c=0;c<8;++c)s+=(o=t[c]).collapse(),u=o.voxel,null!==o.children?r=!1:null!==u&&(l.addData(u.qefData),i=u.materials>>7-c&1,e[c]=u.materials>>c&1,++h);if(r&&jt.setData(l).solve(n)<=Yt){for((u=new Vt).position.copy(this.contains(n)?n:jt.massPoint),c=0;c<8;++c)a=e[c],o=t[c],-1===a?u.materials|=i<<c:(u.materials|=a<<c,u.normal.add(o.voxel.normal));u.normal.normalize(),u.qefData=l,this.voxel=u,this.children=null,s+=h-1}}return s}},{key:\"errorThreshold\",get:function(){return Yt},set:function(t){Yt=t}}]),e}(),Ht=function(t){function e(t,n,i){D(this,e);var r=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return r.root=new Xt(new(Function.prototype.bind.apply(q,[null].concat(R(t)))),n),r.voxelCount=0,r.construct(i),r.simplify(),r}return T(e,ct),E(e,[{key:\"simplify\",value:function(){this.voxelCount-=this.root.collapse()}},{key:\"getCell\",value:function(t,e,n,i){var r=this.root,s=0;for(t>>=1;t>0;t>>=1,s=0)e>=t&&(s+=4,e-=t),n>=t&&(s+=2,n-=t),i>=t&&(s+=1,i-=t),null===r.children&&r.split(),r=r.children[s];return r}},{key:\"construct\",value:function(t){var e=Mt.resolution,n=t.edgeData,i=t.materialIndices,r=new qt,s=new q,o=[n.edgesX(this.min,this.size),n.edgesY(this.min,this.size),n.edgesZ(this.min,this.size)],a=[new Uint8Array([0,1,2,3]),new Uint8Array([0,1,4,5]),new Uint8Array([0,2,4,6])],u=0,l=void 0,h=void 0,c=void 0,d=void 0,y=void 0,v=void 0,f=void 0,m=void 0,p=void 0,x=void 0,w=void 0;for(x=0;x<3;++x){c=a[x],l=o[x];var k=!0,b=!1,z=void 0;try{for(var A,U=l[Symbol.iterator]();!(k=(A=U.next()).done);k=!0)for((h=A.value).computeZeroCrossingPosition(s),w=0;w<4;++w)d=Z[c[w]],f=h.coordinates.x-d[0],m=h.coordinates.y-d[1],p=h.coordinates.z-d[2],f>=0&&m>=0&&p>=0&&f<e&&m<e&&p<e&&(null===(y=this.getCell(e,f,m,p)).voxel&&(y.voxel=g(e,f,m,p,i),++u),(v=y.voxel).normal.add(h.n),v.qefData.add(s,h.n),v.qefData.numPoints===v.edgeCount&&(r.setData(v.qefData).solve(v.position),y.contains(v.position)||v.position.copy(r.massPoint),v.normal.normalize()))}catch(t){b=!0,z=t}finally{try{!k&&U.return&&U.return()}finally{if(b)throw z}}}this.voxelCount=u}}]),e}(),Gt=function t(e,n,i){D(this,t),this.indices=null,this.positions=null,this.normals=null},Zt=[new Uint8Array([0,4,0]),new Uint8Array([1,5,0]),new Uint8Array([2,6,0]),new Uint8Array([3,7,0]),new Uint8Array([0,2,1]),new Uint8Array([4,6,1]),new Uint8Array([1,3,1]),new Uint8Array([5,7,1]),new Uint8Array([0,1,2]),new Uint8Array([2,3,2]),new Uint8Array([4,5,2]),new Uint8Array([6,7,2])],Qt=[new Uint8Array([0,1,2,3,0]),new Uint8Array([4,5,6,7,0]),new Uint8Array([0,4,1,5,1]),new Uint8Array([2,6,3,7,1]),new Uint8Array([0,2,4,6,2]),new Uint8Array([1,3,5,7,2])],Jt=[[new Uint8Array([4,0,0]),new Uint8Array([5,1,0]),new Uint8Array([6,2,0]),new Uint8Array([7,3,0])],[new Uint8Array([2,0,1]),new Uint8Array([6,4,1]),new Uint8Array([3,1,1]),new Uint8Array([7,5,1])],[new Uint8Array([1,0,2]),new Uint8Array([3,2,2]),new Uint8Array([5,4,2]),new Uint8Array([7,6,2])]],Kt=[[new Uint8Array([1,4,0,5,1,1]),new Uint8Array([1,6,2,7,3,1]),new Uint8Array([0,4,6,0,2,2]),new Uint8Array([0,5,7,1,3,2])],[new Uint8Array([0,2,3,0,1,0]),new Uint8Array([0,6,7,4,5,0]),new Uint8Array([1,2,0,6,4,2]),new Uint8Array([1,3,1,7,5,2])],[new Uint8Array([1,1,0,3,2,0]),new Uint8Array([1,5,4,7,6,0]),new Uint8Array([0,1,5,0,4,1]),new Uint8Array([0,3,7,2,6,1])]],Wt=[[new Uint8Array([3,2,1,0,0]),new Uint8Array([7,6,5,4,0])],[new Uint8Array([5,1,4,0,1]),new Uint8Array([7,3,6,2,1])],[new Uint8Array([6,4,2,0,2]),new Uint8Array([7,5,3,1,2])]],$t=[new Uint8Array([3,2,1,0]),new Uint8Array([7,5,6,4]),new Uint8Array([11,10,9,8])],te=Math.pow(2,16)-1,ee=function(){function t(){D(this,t)}return E(t,null,[{key:\"run\",value:function(t,e,n){var i=[],r=new Ht(t,e,n),s=r.voxelCount,o=null,a=null,u=null,l=null;return s>te?console.warn(\"Could not create geometry for cell at position\",r.min,\"(vertex count of\",s,\"exceeds limit of \",te,\")\"):s>0&&(u=new Float32Array(3*s),l=new Float32Array(3*s),A(r.root,u,l,0),z(r.root,i),a=new Uint16Array(i),o=new Gt(a,u,l)),o}}]),t}(),ne={EXTRACT:\"worker.extract\",MODIFY:\"worker.modify\",RESAMPLE:\"worker.resample\",CONFIGURE:\"worker.config\",CLOSE:\"worker.close\"},ie=function(t){function e(){D(this,e);var t=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,ne.EXTRACT));return t.isosurface=null,t}return T(e,St),e}(),re=function(){function t(){D(this,t),this.data=new Mt(!1),this.response=null,this.transferList=null}return E(t,[{key:\"process\",value:function(t){}}]),t}(),se=function(t){function e(){D(this,e);var t=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return t.response=new ie,t}return T(e,re),E(e,[{key:\"process\",value:function(t){var e=this.data.deserialize(t.data).decompress(),n=ee.run(t.cellPosition,t.cellSize,e),i=this.response,r=[];null!==n?(i.isosurface=n,r.push(n.indices.buffer),r.push(n.positions.buffer),r.push(n.normals.buffer)):i.isosurface=null,i.data=e.deserialize(t.data).serialize(),this.transferList=e.createTransferList(r)}}]),e}(),oe={UNION:\"csg.union\",DIFFERENCE:\"csg.difference\",INTERSECTION:\"csg.intersection\",DENSITY_FUNCTION:\"csg.densityfunction\"},ae=function(){function t(e){D(this,t),this.type=e;for(var n=arguments.length,i=Array(n>1?n-1:0),r=1;r<n;r++)i[r-1]=arguments[r];this.children=i,this.bbox=null}return E(t,[{key:\"computeBoundingBox\",value:function(){var t=this.children,e=void 0,n=void 0;for(this.bbox=new V,e=0,n=t.length;e<n;++e)this.bbox.union(t[e].boundingBox);return this.bbox}},{key:\"boundingBox\",get:function(){return null!==this.bbox?this.bbox:this.computeBoundingBox()}}]),t}(),ue=function(t){function e(){var t;D(this,e);for(var n=arguments.length,i=Array(n),r=0;r<n;r++)i[r]=arguments[r];return N(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this,oe.UNION].concat(i)))}return T(e,ae),E(e,[{key:\"updateMaterialIndex\",value:function(t,e,n){var i=n.materialIndices[t];i!==L.AIR&&e.setMaterialIndex(t,i)}},{key:\"selectEdge\",value:function(t,e,n){return n?t.t>e.t?t:e:t.t<e.t?t:e}}]),e}(),le=function(t){function e(){var t;D(this,e);for(var n=arguments.length,i=Array(n),r=0;r<n;r++)i[r]=arguments[r];return N(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this,oe.DIFFERENCE].concat(i)))}return T(e,ae),E(e,[{key:\"updateMaterialIndex\",value:function(t,e,n){n.materialIndices[t]!==L.AIR&&e.setMaterialIndex(t,L.AIR)}},{key:\"selectEdge\",value:function(t,e,n){return n?t.t<e.t?t:e:t.t>e.t?t:e}}]),e}(),he=function(t){function e(){var t;D(this,e);for(var n=arguments.length,i=Array(n),r=0;r<n;r++)i[r]=arguments[r];return N(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this,oe.INTERSECTION].concat(i)))}return T(e,ae),E(e,[{key:\"updateMaterialIndex\",value:function(t,e,n){var i=n.materialIndices[t];e.setMaterialIndex(t,e.materialIndices[t]!==L.AIR&&i!==L.AIR?i:L.AIR)}},{key:\"selectEdge\",value:function(t,e,n){return n?t.t<e.t?t:e:t.t>e.t?t:e}}]),e}(),ce=0,de=new q,ye=function(){function t(){D(this,t)}return E(t,null,[{key:\"run\",value:function(t,e,n,i){de.fromArray(t),ce=e,null===n?i.operation===oe.UNION&&(n=new Mt(!1)):n.decompress();var r=i.toCSG(),s=null!==n?C(r):null;if(null!==s){switch(i.operation){case oe.UNION:r=new ue(r);break;case oe.DIFFERENCE:r=new le(r);break;case oe.INTERSECTION:r=new he(r)}_(r,n,s),n.contoured=!1}return null!==n&&(n.empty?n=null:n.compress()),n}}]),t}(),ve={SPHERE:\"sdf.sphere\",BOX:\"sdf.box\",TORUS:\"sdf.torus\",PLANE:\"sdf.plane\",HEIGHTFIELD:\"sdf.heightfield\"},fe=function(t){function e(t){D(this,e);var n=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,oe.DENSITY_FUNCTION));return n.sdf=t,n}return T(e,ae),E(e,[{key:\"computeBoundingBox\",value:function(){return this.bbox=this.sdf.computeBoundingBox(),this.bbox}},{key:\"generateMaterialIndex\",value:function(t){return this.sdf.sample(t)<=0?this.sdf.material:L.AIR}},{key:\"generateEdge\",value:function(t){t.approximateZeroCrossing(this.sdf),t.computeSurfaceNormal(this.sdf)}}]),e}(),me=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:L.SOLID;D(this,t),this.type=e,this.operation=null,this.material=Math.min(255,Math.max(L.SOLID,Math.trunc(n))),this.children=[],this.bbox=null}return E(t,[{key:\"union\",value:function(t){return t.operation=oe.UNION,this.children.push(t),this}},{key:\"subtract\",value:function(t){return t.operation=oe.DIFFERENCE,this.children.push(t),this}},{key:\"intersect\",value:function(t){return t.operation=oe.INTERSECTION,this.children.push(t),this}},{key:\"serialize\",value:function(){var t={type:this.type,operation:this.operation,material:this.material,parameters:null,children:[]},e=this.children,n=void 0,i=void 0;for(n=0,i=e.length;n<i;++n)t.children.push(e[n].serialize());return t}},{key:\"toCSG\",value:function(){var t=this.children,e=new fe(this),n=void 0,i=void 0,r=void 0,s=void 0;for(r=0,s=t.length;r<s;++r){if(i=t[r],n!==i.operation)switch(n=i.operation){case oe.UNION:e=new ue(e);break;case oe.DIFFERENCE:e=new le(e);break;case oe.INTERSECTION:e=new he(e)}e.children.push(i.toCSG())}return e}},{key:\"computeBoundingBox\",value:function(){throw new Error(\"SignedDistanceFunction#computeBoundingBox method not implemented!\")}},{key:\"sample\",value:function(t){throw new Error(\"SignedDistanceFunction#sample method not implemented!\")}},{key:\"boundingBox\",get:function(){return null!==this.bbox?this.bbox:this.computeBoundingBox()}},{key:\"completeBoundingBox\",get:function(){var t=this.children,e=this.boundingBox.clone(),n=void 0,i=void 0;for(n=0,i=t.length;n<i;++n)e.union(t[n].completeBoundingBox);return e}}]),t}(),pe=function(t){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];D(this,e);var i=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,ve.SPHERE,n));return i.origin=new(Function.prototype.bind.apply(q,[null].concat(R(t.origin)))),i.radius=t.radius,i}return T(e,me),E(e,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new V,this.bbox.min.copy(this.origin).subScalar(this.radius),this.bbox.max.copy(this.origin).addScalar(this.radius),this.bbox}},{key:\"sample\",value:function(t){var e=this.origin,n=t.x-e.x,i=t.y-e.y,r=t.z-e.z;return Math.sqrt(n*n+i*i+r*r)-this.radius}},{key:\"serialize\",value:function(){var t=P(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),\"serialise\",this).call(this);return t.parameters={origin:this.origin.toArray(),radius:this.radius},t}}]),e}(),xe=function(t){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];D(this,e);var i=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,ve.BOX,n));return i.origin=new(Function.prototype.bind.apply(q,[null].concat(R(t.origin)))),i.halfDimensions=new(Function.prototype.bind.apply(q,[null].concat(R(t.halfDimensions)))),i}return T(e,me),E(e,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new V,this.bbox.min.subVectors(this.origin,this.halfDimensions),this.bbox.max.addVectors(this.origin,this.halfDimensions),this.bbox}},{key:\"sample\",value:function(t){var e=this.origin,n=this.halfDimensions,i=Math.abs(t.x-e.x)-n.x,r=Math.abs(t.y-e.y)-n.y,s=Math.abs(t.z-e.z)-n.z,o=Math.max(i,Math.max(r,s)),a=Math.max(i,0),u=Math.max(r,0),l=Math.max(s,0),h=Math.sqrt(a*a+u*u+l*l);return Math.min(o,0)+h}},{key:\"serialize\",value:function(){var t=P(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),\"serialise\",this).call(this);return t.parameters={origin:this.origin.toArray(),halfDimensions:this.halfDimensions.toArray()},t}}]),e}(),ge=function(t){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];D(this,e);var i=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,ve.PLANE,n));return i.normal=new(Function.prototype.bind.apply(q,[null].concat(R(t.normal)))),i.constant=t.constant,i}return T(e,me),E(e,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new V,this.bbox}},{key:\"sample\",value:function(t){return this.normal.dot(t)+this.constant}},{key:\"serialize\",value:function(){var t=P(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),\"serialise\",this).call(this);return t.parameters={normal:this.normal.toArray(),constant:this.constant},t}}]),e}(),we=function(t){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];D(this,e);var i=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,ve.TORUS,n));return i.origin=new(Function.prototype.bind.apply(q,[null].concat(R(t.origin)))),i.R=t.R,i.r=t.r,i}return T(e,me),E(e,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new V,this.bbox.min.copy(this.origin).subScalar(this.R).subScalar(this.r),this.bbox.max.copy(this.origin).addScalar(this.R).addScalar(this.r),this.bbox}},{key:\"sample\",value:function(t){var e=this.origin,n=t.x-e.x,i=t.y-e.y,r=t.z-e.z,s=Math.sqrt(n*n+r*r)-this.R;return Math.sqrt(s*s+i*i)-this.r}},{key:\"serialize\",value:function(){var t=P(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),\"serialise\",this).call(this);return t.parameters={origin:this.origin.toArray(),R:this.R,r:this.r},t}}]),e}(),ke=function(t){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];D(this,e);var i=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,ve.HEIGHTFIELD,n));return i.min=new(Function.prototype.bind.apply(q,[null].concat(R(t.min)))),i.dimensions=new(Function.prototype.bind.apply(q,[null].concat(R(t.size)))),i.data=t.data,i}return T(e,me),E(e,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new V,this.bbox.min.copy(this.min),this.bbox.max.addVectors(this.min,this.dimensions),this.bbox}},{key:\"sample\",value:function(t){var e=this.min,n=this.dimensions,i=Math.max(e.x,Math.min(e.x+n.x,t.x-e.x)),r=Math.max(e.z,Math.min(e.z+n.z,t.z-e.z));return t.y-e.y-this.data[r*n.x+i]/255*n.y}},{key:\"serialize\",value:function(){var t=P(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),\"serialise\",this).call(this);return t.parameters={min:this.min.toArray(),dimensions:this.dimensions.toArray(),data:this.data},t}}]),e}(),be=function(){function t(){D(this,t)}return E(t,null,[{key:\"reviveSDF\",value:function(t){var e=void 0,n=void 0,i=void 0;switch(t.type){case ve.SPHERE:e=new pe(t.parameters,t.material);break;case ve.BOX:e=new xe(t.parameters,t.material);break;case ve.TORUS:e=new we(t.parameters,t.material);break;case ve.PLANE:e=new ge(t.parameters,t.material);break;case ve.HEIGHTFIELD:e=new ke(t.parameters,t.material)}for(e.operation=t.operation,n=0,i=t.children.length;n<i;++n)e.children.push(this.reviveSDF(t.children[n]));return e}}]),t}(),ze=function(t){function e(){return D(this,e),N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,ne.MODIFY))}return T(e,St),e}(),Ae=function(t){function e(){D(this,e);var t=N(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return t.response=new ze,t}return T(e,re),E(e,[{key:\"process\",value:function(t){var e=null!==t.data?this.data.deserialize(t.data):null,n=ye.run(t.cellSize,t.cellPosition,e,be.reviveSDF(t.sdf));this.response.data=null,this.transferList=[],null!==n&&(this.response.data=n.serialize(),n.createTransferList(this.transferList))}}]),e}(),Ue=new se,Ie=new Ae;self.addEventListener(\"message\",function(t){var e=t.data;switch(e.action){case ne.EXTRACT:Ue.process(e),postMessage(Ue.response,Ue.transferList);break;case ne.MODIFY:Ie.process(e),postMessage(Ie.response,Ie.transferList);break;case ne.RESAMPLE:break;case ne.CONFIGURE:Mt.resolution=e.resolution;break;case ne.CLOSE:default:close()}}),self.addEventListener(\"error\",function(t){var e=[],n=new St(ne.CLOSE);n.error=t;var i=null===Ue.data||Ue.data.neutered?null===Ie.data||Ie.data.neutered?null:Ie.data:Ue.data;null!==i&&(n.data=i.serialize(),i.createTransferList(e)),postMessage(n,e),close()})}();";

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
  										message.response = event.data;
  										this.dispatchEvent(message);
  										break;

  								case "error":
  										console.error("Encountered an unexpected error.", event);
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

  								worker$$1.postMessage(new Request(Action.CLOSE));
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

  						var i = void 0,
  						    l = void 0;

  						for (i = 0, l = this.workers.length; i < l; ++i) {

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

  var TerrainEvent = function (_Event) {
  	inherits(TerrainEvent, _Event);

  	function TerrainEvent(type) {
  		classCallCheck(this, TerrainEvent);

  		var _this = possibleConstructorReturn(this, (TerrainEvent.__proto__ || Object.getPrototypeOf(TerrainEvent)).call(this, type));

  		_this.octant = null;

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

  				_this.clipmap = new Clipmap();

  				_this.levels = options.levels !== undefined ? Math.max(1, options.levels) : 16;

  				_this.iterations = options.iterations !== undefined ? Math.max(1, options.iterations) : 1000;

  				_this.threadPool = new ThreadPool(options.workers);
  				_this.threadPool.addEventListener("message", _this);

  				_this.history = new History();

  				_this.octantIDs = new WeakSet();

  				_this.material = new MeshTriplanarPhysicalMaterial();

  				return _this;
  		}

  		createClass(Terrain, [{
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						var worker = event.worker;
  						var response = event.response;

  						var octantId = this.octantIDs.get(worker);
  						var octant = this.world.getOctant(octantId.key, octantId.lod);
  						this.octantIDs.delete(worker);

  						octant.data = octant.data.deserialise(response.data);

  						if (octant.data === null && octant.csg === null) {
  								this.world.removeOctant(octantId.key, octantId.lod);
  						} else if (octant.csg !== null) {}

  						if (response.action !== Action.CLOSE) {

  								if (response.action === Action.EXTRACT) {

  										event = extractionend;

  										this.consolidate(octant, response);
  								} else {

  										event = modificationend;
  								}

  								event.octant = octant;

  								this.dispatchEvent(event);
  						} else {
  								console.error(response.error);
  						}
  				}
  		}, {
  				key: "consolidate",
  				value: function consolidate(octant, response) {

  						var isosurface = response.isosurface;
  						var positions = isosurface.positions;
  						var normals = isosurface.normals;
  						var indices = isosurface.indices;

  						var geometry = void 0,
  						    mesh = void 0;

  						if (positions !== null && normals !== null && indices !== null) {

  								geometry = new three.BufferGeometry();
  								geometry.setIndex(new three.BufferAttribute(indices, 1));
  								geometry.addAttribute("position", new three.BufferAttribute(positions, 3));
  								geometry.addAttribute("normal", new three.BufferAttribute(normals, 3));
  								geometry.computeBoundingSphere();

  								this.object.add(new three.Mesh(geometry, this.material));
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
  				value: function edit(sdf) {}
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

  						var clipmap = this.clipmap;
  						var scene = clipmap.scene;

  						clipmap.update();
  				}
  		}, {
  				key: "raycast",
  				value: function raycast(raycaster) {

  						var octants = [];

  						var intersects = [];
  						var octant = void 0;

  						var i = void 0,
  						    l = void 0;

  						this.world.raycast(raycaster, octants);

  						for (i = 0, l = octant.length; i < l; ++i) {

  								octant = octant[i];

  								if (octant.mesh !== null) {

  										intersects = intersects.concat(raycaster.intersectObject(octant.mesh));
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
  				}
  		}, {
  				key: "clear",
  				value: function clear() {

  						this.clearMeshes();
  						this.clipmap = new Clipmap(this.clipmap.cellSize);
  						this.octantIds = new WeakMap();
  						this.threadPool.clear();
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

  						this.edit(SDFReviver.reviveSDF(JSON.parse(data)));
  				}
  		}, {
  				key: "world",
  				get: function get$$1() {
  						return this.clipmap.world;
  				}
  		}]);
  		return Terrain;
  }(EventTarget);

  var RunLengthEncoding = function () {
  		function RunLengthEncoding() {
  				var runLengths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  				classCallCheck(this, RunLengthEncoding);


  				this.runLengths = runLengths;

  				this.data = data;
  		}

  		createClass(RunLengthEncoding, null, [{
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

  						return new RunLengthEncoding(runLengths, data);
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
  		return RunLengthEncoding;
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

  var c$1 = new Vector3$1();

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
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.min).add(this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.max).sub(this.min);
  		}
  	}, {
  		key: "split",
  		value: function split() {

  			var min = this.min;
  			var max = this.max;
  			var mid = this.getCenter(c$1);

  			var children = this.children = [null, null, null, null, null, null, null, null];

  			var i = void 0,
  			    combination = void 0;

  			for (i = 0; i < 8; ++i) {

  				combination = pattern[i];

  				children[i] = new this.constructor(new Vector3$1(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3$1(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z));
  			}
  		}
  	}]);
  	return Octant;
  }();

  var pattern = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var edges = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  var c = new Vector3$1();

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
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.min).addScalar(this.size * 0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.set(this.size, this.size, this.size);
  		}
  	}, {
  		key: "split",
  		value: function split() {

  			var min = this.min;
  			var mid = this.getCenter(c);
  			var halfSize = this.size * 0.5;

  			var children = this.children = [null, null, null, null, null, null, null, null];

  			var i = void 0,
  			    combination = void 0;

  			for (i = 0; i < 8; ++i) {

  				combination = pattern[i];

  				children[i] = new this.constructor(new Vector3$1(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize);
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

  var b$1 = new Box3$1();

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

  								b$1.min = root.min;
  								b$1.max = root.max;

  								if (!this.cull || this.region.intersectsBox(b$1)) {

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

  														b$1.min = child.min;
  														b$1.max = child.max;

  														if (!region.intersectsBox(b$1)) {
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

  var dimensions = new Vector3$1();

  var halfDimensions = new Vector3$1();

  var center = new Vector3$1();

  var min = new Vector3$1();

  var max = new Vector3$1();

  var direction = new Vector3$1();

  var origin = new Vector3$1();

  var OctreeRaycaster = function () {
  	function OctreeRaycaster() {
  		classCallCheck(this, OctreeRaycaster);
  	}

  	createClass(OctreeRaycaster, null, [{
  		key: "intersectOctree",
  		value: function intersectOctree(octree, raycaster, intersects) {

  			var invDirX = void 0,
  			    invDirY = void 0,
  			    invDirZ = void 0;
  			var tx0 = void 0,
  			    tx1 = void 0,
  			    ty0 = void 0,
  			    ty1 = void 0,
  			    tz0 = void 0,
  			    tz1 = void 0;

  			octree.getDimensions(dimensions);
  			halfDimensions.copy(dimensions).multiplyScalar(0.5);

  			min.copy(octree.min).sub(octree.min);
  			max.copy(octree.max).sub(octree.min);

  			direction.copy(raycaster.ray.direction);
  			origin.copy(raycaster.ray.origin);

  			origin.sub(octree.getCenter(center)).add(halfDimensions);

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

  var b = new Box3$1();

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

  	b.min = octant.min;
  	b.max = octant.max;

  	if (region.intersectsBox(b)) {

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
  		value: function getCenter(target) {
  			return this.root.getCenter(target);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions(target) {
  			return this.root.getDimensions(target);
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

  var p = new Vector3$1();

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
  		value: function distanceToSquared(point) {

  			var clampedPoint = p.copy(point).clamp(this.min, this.max);

  			return clampedPoint.sub(point).lengthSq();
  		}
  	}, {
  		key: "distanceToCenterSquared",
  		value: function distanceToCenterSquared(point) {

  			var center = this.getCenter(p);

  			var dx = point.x - center.x;
  			var dy = point.y - center.x;
  			var dz = point.z - center.z;

  			return dx * dx + dy * dy + dz * dz;
  		}
  	}, {
  		key: "contains",
  		value: function contains(point, bias) {

  			var min = this.min;
  			var max = this.max;

  			return point.x >= min.x - bias && point.y >= min.y - bias && point.z >= min.z - bias && point.x <= max.x + bias && point.y <= max.y + bias && point.z <= max.z + bias;
  		}
  	}, {
  		key: "redistribute",
  		value: function redistribute(bias) {

  			var children = this.children;
  			var points = this.points;
  			var data = this.data;

  			var i = void 0,
  			    j = void 0,
  			    il = void 0,
  			    jl = void 0;
  			var child = void 0,
  			    point = void 0,
  			    entry = void 0;

  			if (children !== null) {

  				for (i = 0, il = points.length; i < il; ++i) {

  					point = points[i];
  					entry = data[i];

  					for (j = 0, jl = children.length; j < jl; ++j) {

  						child = children[j];

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

  var RayPointIntersection = function RayPointIntersection(distance, distanceToRay, point) {
  		var object = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  		classCallCheck(this, RayPointIntersection);


  		this.distance = distance;

  		this.distanceToRay = distanceToRay;

  		this.point = point;

  		this.object = object;
  };

  var THRESHOLD = 1e-6;

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

  function _put(point, data, octree, octant, depth) {

  	var children = octant.children;
  	var exists = false;
  	var done = false;
  	var i = void 0,
  	    l = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children === null) {

  			if (octant.points === null) {

  				octant.points = [];
  				octant.data = [];
  			} else {

  				for (i = 0, l = octant.points.length; !exists && i < l; ++i) {

  					exists = octant.points[i].equals(point);
  				}
  			}

  			if (exists) {

  				octant.data[i - 1] = data;
  				done = true;
  			} else if (octant.points.length < octree.maxPoints || depth === octree.maxDepth) {

  				octant.points.push(point.clone());
  				octant.data.push(data);
  				++octree.pointCount;
  				done = true;
  			} else {

  				octant.split();
  				octant.redistribute(octree.bias);
  				children = octant.children;
  			}
  		}

  		if (children !== null) {

  			++depth;

  			for (i = 0, l = children.length; !done && i < l; ++i) {

  				done = _put(point, data, octree, children[i], depth);
  			}
  		}
  	}

  	return done;
  }

  function _remove(point, octree, octant, parent) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0,
  	    data = void 0,
  	    last = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; result === null && i < l; ++i) {

  				result = _remove(point, octree, children[i], octant);
  			}
  		} else if (octant.points !== null) {

  			points = octant.points;
  			data = octant.data;

  			for (i = 0, l = points.length; i < l; ++i) {

  				if (points[i].equals(point)) {

  					last = l - 1;
  					result = data[i];

  					if (i < last) {
  						points[i] = points[last];
  						data[i] = data[last];
  					}

  					points.pop();
  					data.pop();

  					--octree.pointCount;

  					if (parent !== null && _countPoints(parent) <= octree.maxPoints) {

  						parent.merge();
  					}

  					break;
  				}
  			}
  		}
  	}

  	return result;
  }

  function _fetch(point, octree, octant) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; result === null && i < l; ++i) {

  				result = _fetch(point, octree, children[i]);
  			}
  		} else {

  			points = octant.points;

  			for (i = 0, l = points.length; result === null && i < l; ++i) {

  				if (point.distanceToSquared(points[i]) <= THRESHOLD) {

  					result = octant.data[i];
  				}
  			}
  		}
  	}

  	return result;
  }

  function _move(point, position, octree, octant, parent, depth) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (octant.contains(position, octree.bias)) {
  			if (children !== null) {

  				++depth;

  				for (i = 0, l = children.length; result === null && i < l; ++i) {

  					result = _move(point, position, octree, children[i], octant, depth);
  				}
  			} else {
  				points = octant.points;

  				for (i = 0, l = points.length; i < l; ++i) {

  					if (point.distanceToSquared(points[i]) <= THRESHOLD) {
  						points[i].copy(position);
  						result = octant.data[i];

  						break;
  					}
  				}
  			}
  		} else {
  			result = _remove(point, octree, octant, parent);

  			_put(position, result, octree, parent, depth - 1);
  		}
  	}

  	return result;
  }

  function _findNearestPoint(point, maxDistance, skipSelf, octant) {

  	var points = octant.points;
  	var children = octant.children;

  	var result = null;
  	var bestDist = maxDistance;

  	var i = void 0,
  	    l = void 0;
  	var p = void 0,
  	    distSq = void 0;

  	var sortedChildren = void 0;
  	var child = void 0,
  	    childResult = void 0;

  	if (children !== null) {
  		sortedChildren = children.map(function (child) {
  			return {
  				octant: child,
  				distance: child.distanceToCenterSquared(point)
  			};
  		}).sort(function (a, b) {
  			return a.distance - b.distance;
  		});

  		for (i = 0, l = sortedChildren.length; i < l; ++i) {
  			child = sortedChildren[i].octant;

  			if (child.contains(point, bestDist)) {

  				childResult = _findNearestPoint(point, bestDist, skipSelf, child);

  				if (childResult !== null) {

  					distSq = childResult.point.distanceToSquared(point);

  					if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

  						bestDist = distSq;
  						result = childResult;
  					}
  				}
  			}
  		}
  	} else if (points !== null) {

  		for (i = 0, l = points.length; i < l; ++i) {

  			p = points[i];
  			distSq = point.distanceToSquared(p);

  			if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

  				bestDist = distSq;

  				result = {
  					point: p.clone(),
  					data: octant.data[i]
  				};
  			}
  		}
  	}

  	return result;
  }

  function _findPoints(point, radius, skipSelf, octant, result) {

  	var points = octant.points;
  	var children = octant.children;
  	var rSq = radius * radius;

  	var i = void 0,
  	    l = void 0;

  	var p = void 0,
  	    distSq = void 0;
  	var child = void 0;

  	if (children !== null) {

  		for (i = 0, l = children.length; i < l; ++i) {

  			child = children[i];

  			if (child.contains(point, radius)) {

  				_findPoints(point, radius, skipSelf, child, result);
  			}
  		}
  	} else if (points !== null) {

  		for (i = 0, l = points.length; i < l; ++i) {

  			p = points[i];
  			distSq = point.distanceToSquared(p);

  			if ((!skipSelf || distSq > 0.0) && distSq <= rSq) {

  				result.push({
  					point: p.clone(),
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

  		_this.maxPoints = Math.max(1, Math.round(maxPoints));

  		_this.maxDepth = Math.max(0, Math.round(maxDepth));

  		_this.pointCount = 0;

  		return _this;
  	}

  	createClass(PointOctree, [{
  		key: "countPoints",
  		value: function countPoints(octant) {

  			return _countPoints(octant);
  		}
  	}, {
  		key: "put",
  		value: function put(point, data) {

  			return _put(point, data, this, this.root, 0);
  		}
  	}, {
  		key: "remove",
  		value: function remove(point) {

  			return _remove(point, this, this.root, null);
  		}
  	}, {
  		key: "fetch",
  		value: function fetch(point) {

  			return _fetch(point, this, this.root);
  		}
  	}, {
  		key: "move",
  		value: function move(point, position) {

  			return _move(point, position, this, this.root, null, 0);
  		}
  	}, {
  		key: "findNearestPoint",
  		value: function findNearestPoint(point) {
  			var maxDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			return _findNearestPoint(point, maxDistance, skipSelf, this.root);
  		}
  	}, {
  		key: "findPoints",
  		value: function findPoints(point, radius) {
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			var result = [];

  			_findPoints(point, radius, skipSelf, this.root, result);

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

  								intersects.push(new RayPointIntersection(distance, distanceToRay, intersectPoint, octant.data[j]));
  							}
  						}
  					}
  				}
  			}
  		}
  	}]);
  	return PointOctree;
  }(Octree);

  var OctreeUtils = function () {
  		function OctreeUtils() {
  				classCallCheck(this, OctreeUtils);
  		}

  		createClass(OctreeUtils, null, [{
  				key: "recycleOctants",
  				value: function recycleOctants(octant, octants) {

  						var a = new Vector3$1();
  						var b = new Vector3$1();
  						var c = new Vector3$1();

  						var min = octant.min;
  						var mid = octant.getCenter();
  						var halfDimensions = octant.getDimensions().multiplyScalar(0.5);

  						var children = octant.children;
  						var l = octants.length;

  						var i = void 0,
  						    j = void 0;
  						var combination = void 0,
  						    candidate = void 0;

  						for (i = 0; i < 8; ++i) {

  								combination = pattern[i];

  								b.addVectors(min, a.fromArray(combination).multiply(halfDimensions));
  								c.addVectors(mid, a.fromArray(combination).multiply(halfDimensions));

  								for (j = 0; j < l; ++j) {

  										candidate = octants[j];

  										if (candidate !== null && b.equals(candidate.min) && c.equals(candidate.max)) {

  												children[i] = candidate;
  												octants[j] = null;

  												break;
  										}
  								}
  						}
  				}
  		}]);
  		return OctreeUtils;
  }();

  var ISOVALUE_BIAS = 1e-4;

  var INTERVAL_THRESHOLD = 1e-6;

  var ab = new Vector3$1();

  var p$1 = new Vector3$1();

  var v = new Vector3$1();

  var Edge = function () {
  		function Edge() {
  				var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  				var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
  				classCallCheck(this, Edge);


  				this.a = a;

  				this.b = b;

  				this.index = -1;

  				this.coordinates = new Vector3$1();

  				this.t = 0.0;

  				this.n = new Vector3$1();
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

  								p$1.addVectors(this.a, v.copy(ab).multiplyScalar(c));
  								densityC = sdf.sample(p$1);

  								if (Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {
  										break;
  								} else {

  										p$1.addVectors(this.a, v.copy(ab).multiplyScalar(a));
  										densityA = sdf.sample(p$1);

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
  						var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  						return target.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);
  				}
  		}, {
  				key: "computeSurfaceNormal",
  				value: function computeSurfaceNormal(sdf) {

  						var position = this.computeZeroCrossingPosition(ab);
  						var E = 1e-3;

  						var dx = sdf.sample(p$1.addVectors(position, v.set(E, 0, 0))) - sdf.sample(p$1.subVectors(position, v.set(E, 0, 0)));
  						var dy = sdf.sample(p$1.addVectors(position, v.set(0, E, 0))) - sdf.sample(p$1.subVectors(position, v.set(0, E, 0)));
  						var dz = sdf.sample(p$1.addVectors(position, v.set(0, 0, E))) - sdf.sample(p$1.subVectors(position, v.set(0, 0, E)));

  						this.n.set(dx, dy, dz).normalize();
  				}
  		}]);
  		return Edge;
  }();

  var edge = new Edge();

  var offsetA = new Vector3$1();

  var offsetB = new Vector3$1();

  var EdgeIterator = function () {
  		function EdgeIterator(edgeData, cellPosition, cellSize) {
  				var c = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  				var d = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 3;
  				classCallCheck(this, EdgeIterator);


  				this.edgeData = edgeData;

  				this.cellPosition = cellPosition;

  				this.cellSize = cellSize;

  				this.indices = null;

  				this.zeroCrossings = null;

  				this.normals = null;

  				this.axes = null;

  				this.lengths = null;

  				this.result = new IteratorResult();

  				this.initialC = c;

  				this.c = c;

  				this.initialD = d;

  				this.d = d;

  				this.i = 0;

  				this.l = 0;

  				this.reset();
  		}

  		createClass(EdgeIterator, [{
  				key: "reset",
  				value: function reset() {

  						var edgeData = this.edgeData;
  						var indices = [];
  						var zeroCrossings = [];
  						var normals = [];
  						var axes = [];
  						var lengths = [];

  						var a = void 0,
  						    c = void 0,
  						    d = void 0,
  						    l = void 0;

  						this.i = 0;
  						this.c = 0;
  						this.d = 0;

  						for (c = this.initialC, a = 4 >> c, d = this.initialD; c < d; ++c, a >>= 1) {

  								l = edgeData.indices[c].length;

  								if (l > 0) {

  										indices.push(edgeData.indices[c]);
  										zeroCrossings.push(edgeData.zeroCrossings[c]);
  										normals.push(edgeData.normals[c]);
  										axes.push(pattern[a]);
  										lengths.push(l);

  										++this.d;
  								}
  						}

  						this.l = lengths.length > 0 ? lengths[0] : 0;

  						this.indices = indices;
  						this.zeroCrossings = zeroCrossings;
  						this.normals = normals;
  						this.axes = axes;
  						this.lengths = lengths;

  						this.result.reset();

  						return this;
  				}
  		}, {
  				key: "next",
  				value: function next() {

  						var s = this.cellSize;
  						var n = HermiteData.resolution;
  						var m = n + 1;
  						var mm = m * m;

  						var result = this.result;
  						var base = this.cellPosition;

  						var axis = void 0,
  						    index = void 0;
  						var x = void 0,
  						    y = void 0,
  						    z = void 0;
  						var c = void 0,
  						    i = void 0;

  						if (this.i === this.l) {
  								this.l = ++this.c < this.d ? this.lengths[this.c] : 0;
  								this.i = 0;
  						}

  						if (this.i < this.l) {

  								c = this.c;
  								i = this.i;

  								axis = this.axes[c];

  								index = this.indices[c][i];
  								edge.index = index;

  								x = index % m;
  								y = Math.trunc(index % mm / m);
  								z = Math.trunc(index / mm);

  								edge.coordinates.set(x, y, z);

  								offsetA.set(x * s / n, y * s / n, z * s / n);

  								offsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);

  								edge.a.addVectors(base, offsetA);
  								edge.b.addVectors(base, offsetB);

  								edge.t = this.zeroCrossings[c][i];
  								edge.n.fromArray(this.normals[c], i * 3);

  								result.value = edge;

  								++this.i;
  						} else {
  								result.value = null;
  								result.done = true;
  						}

  						return result;
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
  		return EdgeIterator;
  }();

  var EdgeData = function () {
  	function EdgeData() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
  		classCallCheck(this, EdgeData);


  		this.indices = x <= 0 ? null : [new Uint32Array(x), new Uint32Array(y), new Uint32Array(z)];

  		this.zeroCrossings = x <= 0 ? null : [new Float32Array(x), new Float32Array(y), new Float32Array(z)];

  		this.normals = x <= 0 ? null : [new Float32Array(x * 3), new Float32Array(y * 3), new Float32Array(z * 3)];
  	}

  	createClass(EdgeData, [{
  		key: "serialize",
  		value: function serialize() {

  			return {
  				edges: this.edges,
  				zeroCrossings: this.zeroCrossings,
  				normals: this.normals
  			};
  		}
  	}, {
  		key: "deserialize",
  		value: function deserialize(object) {

  			var result = this;

  			if (object !== null) {

  				this.edges = object.edges;
  				this.zeroCrossings = object.zeroCrossings;
  				this.normals = object.normals;
  			} else {

  				result = null;
  			}

  			return result;
  		}
  	}, {
  		key: "createTransferList",
  		value: function createTransferList() {
  			var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  			var arrays = [this.edges[0], this.edges[1], this.edges[2], this.zeroCrossings[0], this.zeroCrossings[1], this.zeroCrossings[2], this.normals[0], this.normals[1], this.normals[2]];

  			var array = void 0;
  			var i = void 0,
  			    l = void 0;

  			for (i = 0, l = arrays.length; i < l; ++i) {

  				array = arrays[i];

  				if (array !== null) {

  					transferList.push(array.buffer);
  				}
  			}

  			return transferList;
  		}
  	}, {
  		key: "edges",
  		value: function edges(cellPosition, cellSize) {

  			return new EdgeIterator(this, cellPosition, cellSize);
  		}
  	}, {
  		key: "edgesX",
  		value: function edgesX(cellPosition, cellSize) {

  			return new EdgeIterator(this, cellPosition, cellSize, 0, 1);
  		}
  	}, {
  		key: "edgesY",
  		value: function edgesY(cellPosition, cellSize) {

  			return new EdgeIterator(this, cellPosition, cellSize, 1, 2);
  		}
  	}, {
  		key: "edgesZ",
  		value: function edgesZ(cellPosition, cellSize) {

  			return new EdgeIterator(this, cellPosition, cellSize, 2, 3);
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
  		key: "clear",
  		value: function clear() {

  			this.lod = -1;
  			this.neutered = false;
  			this.materials = 0;
  			this.materialIndices = null;
  			this.runLengths = null;
  			this.edgeData = null;

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
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;


  			var encoding = void 0;

  			if (!this.compressed) {
  				if (this.full) {
  					encoding = new RunLengthEncoding([this.materialIndices.length], [Material.SOLID]);
  				} else {

  					encoding = RunLengthEncoding.encode(this.materialIndices);
  				}

  				target.runLengths = new Uint32Array(encoding.runLengths);
  				target.materialIndices = new Uint8Array(encoding.data);
  			}

  			return target;
  		}
  	}, {
  		key: "decompress",
  		value: function decompress() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;


  			if (this.compressed) {

  				target.materialIndices = RunLengthEncoding.decode(this.runLengths, this.materialIndices, new Uint8Array(indexCount));

  				target.runLengths = null;
  			}

  			return target;
  		}
  	}, {
  		key: "serialize",
  		value: function serialize() {

  			this.neutered = true;

  			return {
  				lod: this.lod,
  				materials: this.materials,
  				materialIndices: this.materialIndices,
  				runLengths: this.runLengths,
  				edgeData: this.edgeData !== null ? this.edgeData.serialize() : null
  			};
  		}
  	}, {
  		key: "deserialize",
  		value: function deserialize(object) {

  			var result = this;

  			if (object !== null) {

  				this.lod = object.lod;
  				this.materials = object.materials;

  				this.materialIndices = object.materialIndices;
  				this.runLengths = object.runLengths;

  				if (object.edgeData !== null) {

  					if (this.edgeData === null) {

  						this.edgeData = new EdgeData(0);
  					}

  					this.edgeData.deserialize(object.edgeData);
  				} else {

  					this.edgeData = null;
  				}

  				this.neutered = false;
  			} else {

  				result = null;
  			}

  			return result;
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
  		key: "empty",
  		get: function get$$1() {
  			return this.materials === 0;
  		}
  	}, {
  		key: "full",
  		get: function get$$1() {
  			return this.materials === indexCount;
  		}
  	}, {
  		key: "compressed",
  		get: function get$$1() {
  			return this.runLengths !== null;
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

  var HermiteDataHelper = function (_Object3D) {
  		inherits(HermiteDataHelper, _Object3D);

  		function HermiteDataHelper(cellPosition, cellSize) {
  				var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  				var useMaterialIndices = arguments[3];
  				var useEdgeData = arguments[4];
  				classCallCheck(this, HermiteDataHelper);

  				var _this = possibleConstructorReturn(this, (HermiteDataHelper.__proto__ || Object.getPrototypeOf(HermiteDataHelper)).call(this));

  				_this.name = "HermiteDataHelper";

  				_this.cellPosition = cellPosition;

  				_this.cellSize = cellSize;

  				_this.data = data;

  				_this.decompressedData = new HermiteData(false);

  				_this.pointsMaterial = new three.PointsMaterial({
  						vertexColors: three.VertexColors,
  						sizeAttenuation: true,
  						size: 0.05
  				});

  				_this.add(new three.Group());
  				_this.add(new three.Group());
  				_this.add(new three.Group());

  				_this.gridPoints.name = "GridPoints";
  				_this.edges.name = "Edges";
  				_this.normals.name = "Normals";

  				_this.update(useMaterialIndices, useEdgeData);

  				return _this;
  		}

  		createClass(HermiteDataHelper, [{
  				key: "update",
  				value: function update() {
  						var useMaterialIndices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  						var useEdgeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


  						var data = this.data;
  						var decompressedData = this.decompressedData;

  						this.dispose();

  						if (this.cellPosition !== null && this.cellSize > 0 && data !== null && !data.empty) {

  								if (data.compressed) {

  										data.decompress(decompressedData);
  										decompressedData.edgeData = data.edgeData;
  								} else {

  										decompressedData.set(data);
  								}

  								if (useMaterialIndices) {

  										this.createPoints(decompressedData);
  								}

  								if (useEdgeData && decompressedData.edgeData !== null) {

  										this.createEdges(decompressedData);
  								}

  								decompressedData.clear();
  						}
  				}
  		}, {
  				key: "createPoints",
  				value: function createPoints(data) {

  						var s = this.cellSize;
  						var n = HermiteData.resolution;

  						var materialIndices = data.materialIndices;

  						var base = this.cellPosition;
  						var offset = new three.Vector3();
  						var position = new three.Vector3();

  						var color = new Float32Array([0.0, 0.0, 0.0]);

  						var geometry = new three.BufferGeometry();
  						var vertexCount = data.materials;
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

  						this.gridPoints.add(new three.Points(geometry, this.pointsMaterial));
  				}
  		}, {
  				key: "createEdges",
  				value: function createEdges(data) {

  						var s = this.cellSize;
  						var n = HermiteData.resolution;
  						var edgeData = data.edgeData;

  						var normalA = new three.Vector3();
  						var normalB = new three.Vector3();

  						var edgeIterators = [edgeData.edgesX(this.cellPosition, this.cellSize), edgeData.edgesY(this.cellPosition, this.cellSize), edgeData.edgesZ(this.cellPosition, this.cellSize)];

  						var axisColors = [new Float32Array([0.6, 0.0, 0.0]), new Float32Array([0.0, 0.6, 0.0]), new Float32Array([0.0, 0.0, 0.6])];

  						var normalColor = new Float32Array([0.0, 1.0, 1.0]);

  						var lineSegmentsMaterial = new three.LineBasicMaterial({
  								vertexColors: three.VertexColors
  						});

  						var edgePositions = void 0,
  						    edgeColors = void 0;
  						var normalPositions = void 0,
  						    normalColors = void 0;
  						var vertexCount = void 0,
  						    edgeColor = void 0,
  						    geometry = void 0,
  						    edges = void 0,
  						    edge = void 0;

  						var d = void 0,
  						    i = void 0,
  						    j = void 0;

  						for (i = 0, j = 0, d = 0; d < 3; ++d, i = 0, j = 0) {

  								edgeColor = axisColors[d];
  								edges = edgeIterators[d];

  								if (edges.lengths.length > 0) {

  										vertexCount = edges.lengths[0] * 2;
  										edgePositions = new Float32Array(vertexCount * 3);
  										edgeColors = new Float32Array(vertexCount * 3);
  										normalPositions = new Float32Array(vertexCount * 3);
  										normalColors = new Float32Array(vertexCount * 3);

  										var _iteratorNormalCompletion = true;
  										var _didIteratorError = false;
  										var _iteratorError = undefined;

  										try {
  												for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  														edge = _step.value;

  														edgePositions[i] = edge.a.x;edgeColors[i++] = edgeColor[0];
  														edgePositions[i] = edge.a.y;edgeColors[i++] = edgeColor[1];
  														edgePositions[i] = edge.a.z;edgeColors[i++] = edgeColor[2];

  														edgePositions[i] = edge.b.x;edgeColors[i++] = edgeColor[0];
  														edgePositions[i] = edge.b.y;edgeColors[i++] = edgeColor[1];
  														edgePositions[i] = edge.b.z;edgeColors[i++] = edgeColor[2];

  														edge.computeZeroCrossingPosition(normalA);
  														normalB.copy(normalA).addScaledVector(edge.n, 0.25 * s / n);

  														normalPositions[j] = normalA.x;normalColors[j++] = normalColor[0];
  														normalPositions[j] = normalA.y;normalColors[j++] = normalColor[1];
  														normalPositions[j] = normalA.z;normalColors[j++] = normalColor[2];

  														normalPositions[j] = normalB.x;normalColors[j++] = normalColor[0];
  														normalPositions[j] = normalB.y;normalColors[j++] = normalColor[1];
  														normalPositions[j] = normalB.z;normalColors[j++] = normalColor[2];
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
  				}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						var child = void 0,
  						    children = void 0;
  						var i = void 0,
  						    l = void 0;

  						for (i = 0, l = this.children.length; i < l; ++i) {

  								child = this.children[i];
  								children = child.children;

  								while (children.length > 0) {

  										children[0].geometry.dispose();
  										children[0].material.dispose();
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
  		return HermiteDataHelper;
  }(three.Object3D);

  var coefficients = new Vector2$1();

  var Givens = function () {
  	function Givens() {
  		classCallCheck(this, Givens);
  	}

  	createClass(Givens, null, [{
  		key: "calculateCoefficients",
  		value: function calculateCoefficients(aPP, aPQ, aQQ) {

  			var tau = void 0,
  			    stt = void 0,
  			    tan = void 0;

  			if (aPQ === 0.0) {

  				coefficients.x = 1.0;
  				coefficients.y = 0.0;
  			} else {

  				tau = (aQQ - aPP) / (2.0 * aPQ);
  				stt = Math.sqrt(1.0 + tau * tau);
  				tan = 1.0 / (tau >= 0.0 ? tau + stt : tau - stt);

  				coefficients.x = 1.0 / Math.sqrt(1.0 + tan * tan);
  				coefficients.y = tan * coefficients.x;
  			}

  			return coefficients;
  		}
  	}]);
  	return Givens;
  }();

  var Schur = function () {
  	function Schur() {
  		classCallCheck(this, Schur);
  	}

  	createClass(Schur, null, [{
  		key: "rotateXY",
  		value: function rotateXY(a, coefficients) {

  			var c = coefficients.x;
  			var s = coefficients.y;

  			var u = a.x;
  			var v = a.y;

  			a.set(c * u - s * v, s * u + c * v);
  		}
  	}, {
  		key: "rotateQXY",
  		value: function rotateQXY(a, q, coefficients) {

  			var c = coefficients.x;
  			var s = coefficients.y;
  			var cc = c * c;
  			var ss = s * s;

  			var mx = 2.0 * c * s * q;

  			var u = a.x;
  			var v = a.y;

  			a.set(cc * u - mx + ss * v, ss * u + mx + cc * v);
  		}
  	}]);
  	return Schur;
  }();

  var PSEUDOINVERSE_THRESHOLD = 1e-6;

  var SVD_SWEEPS = 5;

  var sm = new SymmetricMatrix3();

  var m = new Matrix3();

  var a = new Vector2$1();

  var b$2 = new Vector3$1();

  function rotate01(vtav, v) {

  	var se = vtav.elements;
  	var ve = v.elements;

  	var coefficients = void 0;

  	if (se[1] !== 0.0) {

  		coefficients = Givens.calculateCoefficients(se[0], se[1], se[3]);

  		Schur.rotateQXY(a.set(se[0], se[3]), se[1], coefficients);
  		se[0] = a.x;se[3] = a.y;

  		Schur.rotateXY(a.set(se[2], se[4]), coefficients);
  		se[2] = a.x;se[4] = a.y;

  		se[1] = 0.0;

  		Schur.rotateXY(a.set(ve[0], ve[3]), coefficients);
  		ve[0] = a.x;ve[3] = a.y;

  		Schur.rotateXY(a.set(ve[1], ve[4]), coefficients);
  		ve[1] = a.x;ve[4] = a.y;

  		Schur.rotateXY(a.set(ve[2], ve[5]), coefficients);
  		ve[2] = a.x;ve[5] = a.y;
  	}
  }

  function rotate02(vtav, v) {

  	var se = vtav.elements;
  	var ve = v.elements;

  	var coefficients = void 0;

  	if (se[2] !== 0.0) {

  		coefficients = Givens.calculateCoefficients(se[0], se[2], se[5]);

  		Schur.rotateQXY(a.set(se[0], se[5]), se[2], coefficients);
  		se[0] = a.x;se[5] = a.y;

  		Schur.rotateXY(a.set(se[1], se[4]), coefficients);
  		se[1] = a.x;se[4] = a.y;

  		se[2] = 0.0;

  		Schur.rotateXY(a.set(ve[0], ve[6]), coefficients);
  		ve[0] = a.x;ve[6] = a.y;

  		Schur.rotateXY(a.set(ve[1], ve[7]), coefficients);
  		ve[1] = a.x;ve[7] = a.y;

  		Schur.rotateXY(a.set(ve[2], ve[8]), coefficients);
  		ve[2] = a.x;ve[8] = a.y;
  	}
  }

  function rotate12(vtav, v) {

  	var se = vtav.elements;
  	var ve = v.elements;

  	var coefficients = void 0;

  	if (se[4] !== 0.0) {

  		coefficients = Givens.calculateCoefficients(se[3], se[4], se[5]);

  		Schur.rotateQXY(a.set(se[3], se[5]), se[4], coefficients);
  		se[3] = a.x;se[5] = a.y;

  		Schur.rotateXY(a.set(se[1], se[2]), coefficients);
  		se[1] = a.x;se[2] = a.y;

  		se[4] = 0.0;

  		Schur.rotateXY(a.set(ve[3], ve[6]), coefficients);
  		ve[3] = a.x;ve[6] = a.y;

  		Schur.rotateXY(a.set(ve[4], ve[7]), coefficients);
  		ve[4] = a.x;ve[7] = a.y;

  		Schur.rotateXY(a.set(ve[5], ve[8]), coefficients);
  		ve[5] = a.x;ve[8] = a.y;
  	}
  }

  function solveSymmetric(vtav, v) {

  	var e = vtav.elements;

  	var i = void 0;

  	for (i = 0; i < SVD_SWEEPS; ++i) {
  		rotate01(vtav, v);
  		rotate02(vtav, v);
  		rotate12(vtav, v);
  	}

  	return b$2.set(e[0], e[3], e[5]);
  }

  function invert(x) {

  	var invX = 1.0 / x;

  	return Math.abs(x) < PSEUDOINVERSE_THRESHOLD || Math.abs(invX) < PSEUDOINVERSE_THRESHOLD ? 0.0 : invX;
  }

  function pseudoInverse(v, sigma) {

  	var ve = v.elements;

  	var v00 = ve[0],
  	    v01 = ve[3],
  	    v02 = ve[6];
  	var v10 = ve[1],
  	    v11 = ve[4],
  	    v12 = ve[7];
  	var v20 = ve[2],
  	    v21 = ve[5],
  	    v22 = ve[8];

  	var d0 = invert(sigma.x);
  	var d1 = invert(sigma.y);
  	var d2 = invert(sigma.z);

  	return v.set(v00 * d0 * v00 + v01 * d1 * v01 + v02 * d2 * v02, v00 * d0 * v10 + v01 * d1 * v11 + v02 * d2 * v12, v00 * d0 * v20 + v01 * d1 * v21 + v02 * d2 * v22, v10 * d0 * v00 + v11 * d1 * v01 + v12 * d2 * v02, v10 * d0 * v10 + v11 * d1 * v11 + v12 * d2 * v12, v10 * d0 * v20 + v11 * d1 * v21 + v12 * d2 * v22, v20 * d0 * v00 + v21 * d1 * v01 + v22 * d2 * v02, v20 * d0 * v10 + v21 * d1 * v11 + v22 * d2 * v12, v20 * d0 * v20 + v21 * d1 * v21 + v22 * d2 * v22);
  }

  var SingularValueDecomposition = function () {
  	function SingularValueDecomposition() {
  		classCallCheck(this, SingularValueDecomposition);
  	}

  	createClass(SingularValueDecomposition, null, [{
  		key: "solve",
  		value: function solve(ata, atb, x) {

  			var sigma = solveSymmetric(sm.copy(ata), m.identity());
  			var invV = pseudoInverse(m, sigma);

  			x.copy(atb).applyMatrix3(invV);
  		}
  	}]);
  	return SingularValueDecomposition;
  }();

  var p$2 = new Vector3$1();

  var QEFSolver = function () {
  		function QEFSolver() {
  				classCallCheck(this, QEFSolver);


  				this.data = null;

  				this.ata = new SymmetricMatrix3();

  				this.atb = new Vector3$1();

  				this.massPoint = new Vector3$1();

  				this.hasSolution = false;
  		}

  		createClass(QEFSolver, [{
  				key: "setData",
  				value: function setData(d) {

  						this.data = d;
  						this.hasSolution = false;

  						return this;
  				}
  		}, {
  				key: "calculateError",
  				value: function calculateError(ata, atb, x) {

  						p$2.copy(x);
  						ata.applyToVector3(p$2);
  						p$2.subVectors(atb, p$2);

  						return p$2.dot(p$2);
  				}
  		}, {
  				key: "solve",
  				value: function solve(x) {

  						var data = this.data;
  						var massPoint = this.massPoint;
  						var ata = this.ata.copy(data.ata);
  						var atb = this.atb.copy(data.atb);

  						var error = Infinity;

  						if (!this.hasSolution && data !== null && data.numPoints > 0) {
  								p$2.copy(data.massPointSum).divideScalar(data.numPoints);
  								massPoint.copy(p$2);

  								ata.applyToVector3(p$2);
  								atb.sub(p$2);

  								SingularValueDecomposition.solve(ata, atb, x);
  								error = this.calculateError(ata, atb, x);
  								x.add(massPoint);

  								this.hasSolution = true;
  						}

  						return error;
  				}
  		}]);
  		return QEFSolver;
  }();

  var QEFData = function () {
  		function QEFData() {
  				classCallCheck(this, QEFData);


  				this.ata = new SymmetricMatrix3();

  				this.ata.set(0, 0, 0, 0, 0, 0);

  				this.atb = new Vector3$1();

  				this.massPointSum = new Vector3$1();

  				this.numPoints = 0;
  		}

  		createClass(QEFData, [{
  				key: "set",
  				value: function set$$1(ata, atb, massPointSum, numPoints) {

  						this.ata.copy(ata);
  						this.atb.copy(atb);

  						this.massPointSum.copy(massPointSum);
  						this.numPoints = numPoints;

  						return this;
  				}
  		}, {
  				key: "copy",
  				value: function copy(d) {

  						return this.set(d.ata, d.atb, d.massPointSum, d.numPoints);
  				}
  		}, {
  				key: "add",
  				value: function add(p, n) {

  						var nx = n.x;
  						var ny = n.y;
  						var nz = n.z;

  						var b = p.dot(n);

  						var ata = this.ata.elements;
  						var atb = this.atb;

  						ata[0] += nx * nx;
  						ata[1] += nx * ny;ata[3] += ny * ny;
  						ata[2] += nx * nz;ata[4] += ny * nz;ata[5] += nz * nz;

  						atb.x += b * nx;
  						atb.y += b * ny;
  						atb.z += b * nz;

  						this.massPointSum.add(p);

  						++this.numPoints;
  				}
  		}, {
  				key: "addData",
  				value: function addData(d) {

  						this.ata.add(d.ata);
  						this.atb.add(d.atb);

  						this.massPointSum.add(d.massPointSum);
  						this.numPoints += d.numPoints;
  				}
  		}, {
  				key: "clear",
  				value: function clear() {

  						this.ata.set(0, 0, 0, 0, 0, 0);

  						this.atb.set(0, 0, 0);
  						this.massPointSum.set(0, 0, 0);
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

  var BinaryUtils = function () {
  	function BinaryUtils() {
  		classCallCheck(this, BinaryUtils);
  	}

  	createClass(BinaryUtils, null, [{
  		key: "parseBin",
  		value: function parseBin(s) {

  			return parseInt(s, 2);
  		}
  	}, {
  		key: "createBinaryString",
  		value: function createBinaryString(n) {
  			var minBits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;


  			var sign = n < 0 ? "-" : "";

  			var result = Math.abs(n).toString(2);

  			while (result.length < minBits) {

  				result = "0" + result;
  			}

  			return sign + result;
  		}
  	}]);
  	return BinaryUtils;
  }();

  var Voxel = function Voxel() {
  		classCallCheck(this, Voxel);


  		this.materials = 0;

  		this.edgeCount = 0;

  		this.index = -1;

  		this.position = new Vector3$1();

  		this.normal = new Vector3$1();

  		this.qefData = null;
  };

  var cellSize = 0;

  var cellPosition = new Vector3$1();

  function computeIndexBounds(operation) {

  	var s = cellSize;
  	var n = HermiteData.resolution;

  	var min = new Vector3$1(0, 0, 0);
  	var max = new Vector3$1(n, n, n);

  	var region = new Box3$1(cellPosition, cellPosition.clone().addScalar(cellSize));

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

  	return new Box3$1(min, max);
  }

  function combineMaterialIndices(operation, data0, data1, bounds) {

  	var n = HermiteData.resolution;
  	var m = n + 1;
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

  function generateMaterialIndices(operation, data, bounds) {

  	var s = cellSize;
  	var n = HermiteData.resolution;
  	var m = n + 1;
  	var mm = m * m;

  	var materialIndices = data.materialIndices;

  	var base = cellPosition;
  	var offset = new Vector3$1();
  	var position = new Vector3$1();

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

  function combineEdges(operation, data0, data1) {

  	var n = HermiteData.resolution;
  	var m = n + 1;
  	var mm = m * m;

  	var indexOffsets = new Uint32Array([1, m, mm]);
  	var materialIndices = data0.materialIndices;

  	var edge1 = new Edge();
  	var edge0 = new Edge();

  	var edgeData1 = data1.edgeData;
  	var edgeData0 = data0.edgeData;

  	var lengths = new Uint32Array(3);
  	var edgeCount = EdgeData.calculate1DEdgeCount(n);

  	var edgeData = new EdgeData(Math.min(edgeCount, edgeData0.indices[0].length + edgeData1.indices[0].length), Math.min(edgeCount, edgeData0.indices[1].length + edgeData1.indices[1].length), Math.min(edgeCount, edgeData0.indices[2].length + edgeData1.indices[2].length));

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

  		edges1 = edgeData1.indices[d];
  		edges0 = edgeData0.indices[d];
  		edges = edgeData.indices[d];

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

  function generateEdges(operation, data, bounds) {

  	var s = cellSize;
  	var n = HermiteData.resolution;
  	var m = n + 1;
  	var mm = m * m;

  	var indexOffsets = new Uint32Array([1, m, mm]);
  	var materialIndices = data.materialIndices;

  	var base = cellPosition;
  	var offsetA = new Vector3$1();
  	var offsetB = new Vector3$1();
  	var edge = new Edge();

  	var lengths = new Uint32Array(3);
  	var edgeData = new EdgeData(EdgeData.calculate1DEdgeCount(n));

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
  		axis = pattern[a];

  		edges = edgeData.indices[d];
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

  function update(operation, data0, data1) {

  	var bounds = computeIndexBounds(operation);

  	var result = void 0,
  	    edgeData = void 0,
  	    lengths = void 0,
  	    d = void 0;
  	var done = false;

  	if (operation.type === OperationType.DENSITY_FUNCTION) {

  		generateMaterialIndices(operation, data0, bounds);
  	} else if (data0.empty) {

  		if (operation.type === OperationType.UNION) {

  			data0.set(data1);
  			done = true;
  		}
  	} else {

  		if (!(data0.full && operation.type === OperationType.UNION)) {

  			combineMaterialIndices(operation, data0, data1, bounds);
  		}
  	}

  	if (!done && !data0.empty && !data0.full) {

  		result = operation.type === OperationType.DENSITY_FUNCTION ? generateEdges(operation, data0, bounds) : combineEdges(operation, data0, data1);

  		edgeData = result.edgeData;
  		lengths = result.lengths;

  		for (d = 0; d < 3; ++d) {

  			edgeData.indices[d] = edgeData.indices[d].slice(0, lengths[d]);
  			edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);
  			edgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);
  		}

  		data0.edgeData = edgeData;
  	}
  }

  function execute(operation) {

  	var children = operation.children;

  	var result = void 0,
  	    data = void 0;
  	var i = void 0,
  	    l = void 0;

  	if (operation.type === OperationType.DENSITY_FUNCTION) {
  		result = new HermiteData();

  		update(operation, result);
  	}

  	for (i = 0, l = children.length; i < l; ++i) {
  		data = execute(children[i]);

  		if (result === undefined) {

  			result = data;
  		} else if (data !== null) {

  			if (result === null) {

  				if (operation.type === OperationType.UNION) {
  					result = data;
  				}
  			} else {
  				update(operation, result, data);
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
  		value: function run(min, size, data, sdf) {

  			cellPosition.fromArray(min);
  			cellSize = size;

  			if (data === null) {

  				if (sdf.operation === OperationType.UNION) {
  					data = new HermiteData(false);
  				}
  			} else {

  				data.decompress();
  			}

  			var operation = sdf.toCSG();

  			var generatedData = data !== null ? execute(operation) : null;

  			if (generatedData !== null) {
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

  				update(operation, data, generatedData);

  				data.contoured = false;
  			}

  			if (data !== null) {

  				if (data.empty) {

  					data = null;
  				} else {

  					data.compress();
  				}
  			}

  			return data;
  		}
  	}]);
  	return ConstructiveSolidGeometry;
  }();

  var qefSolver = new QEFSolver();

  var BIAS = 1e-6;

  var errorThreshold = 1e-2;

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

  			return p.x >= min.x - BIAS && p.y >= min.y - BIAS && p.z >= min.z - BIAS && p.x <= min.x + size + BIAS && p.y <= min.y + size + BIAS && p.z <= min.z + size + BIAS;
  		}
  	}, {
  		key: "collapse",
  		value: function collapse() {

  			var children = this.children;

  			var signs = new Int16Array([-1, -1, -1, -1, -1, -1, -1, -1]);

  			var position = new Vector3$1();

  			var midSign = -1;
  			var collapsible = children !== null;

  			var removedVoxels = 0;

  			var child = void 0,
  			    sign = void 0,
  			    voxel = void 0;
  			var qefData = void 0,
  			    error = void 0;

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

  					error = qefSolver.setData(qefData).solve(position);

  					if (error <= errorThreshold) {

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
  		key: "errorThreshold",
  		get: function get$$1() {
  			return errorThreshold;
  		},
  		set: function set$$1(x) {

  			errorThreshold = x;
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
  				offset = pattern[i];
  				index = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);

  				material = Math.min(materialIndices[index], Material.SOLID);

  				materials |= material << i;
  		}

  		for (edgeCount = 0, i = 0; i < 12; ++i) {

  				c1 = edges[i][0];
  				c2 = edges[i][1];

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

  var SparseVoxelOctree = function (_Octree) {
  		inherits(SparseVoxelOctree, _Octree);

  		function SparseVoxelOctree(min, size, data) {
  				classCallCheck(this, SparseVoxelOctree);

  				var _this = possibleConstructorReturn(this, (SparseVoxelOctree.__proto__ || Object.getPrototypeOf(SparseVoxelOctree)).call(this));

  				_this.root = new VoxelCell(new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(min))))(), size);


  				_this.voxelCount = 0;

  				_this.construct(data);
  				_this.simplify();

  				return _this;
  		}

  		createClass(SparseVoxelOctree, [{
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
  				value: function construct(data) {

  						var n = HermiteData.resolution;
  						var edgeData = data.edgeData;
  						var materialIndices = data.materialIndices;

  						var qefSolver = new QEFSolver();
  						var intersection = new Vector3$1();

  						var edgeIterators = [edgeData.edgesX(this.min, this.size), edgeData.edgesY(this.min, this.size), edgeData.edgesZ(this.min, this.size)];

  						var sequences = [new Uint8Array([0, 1, 2, 3]), new Uint8Array([0, 1, 4, 5]), new Uint8Array([0, 2, 4, 6])];

  						var voxelCount = 0;

  						var edges = void 0,
  						    edge = void 0;
  						var sequence = void 0,
  						    offset = void 0;
  						var cell = void 0,
  						    voxel = void 0;

  						var x = void 0,
  						    y = void 0,
  						    z = void 0;
  						var d = void 0,
  						    i = void 0;

  						for (d = 0; d < 3; ++d) {

  								sequence = sequences[d];
  								edges = edgeIterators[d];

  								var _iteratorNormalCompletion = true;
  								var _didIteratorError = false;
  								var _iteratorError = undefined;

  								try {
  										for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  												edge = _step.value;


  												edge.computeZeroCrossingPosition(intersection);

  												for (i = 0; i < 4; ++i) {
  														offset = pattern[sequence[i]];

  														x = edge.coordinates.x - offset[0];
  														y = edge.coordinates.y - offset[1];
  														z = edge.coordinates.z - offset[2];

  														if (x >= 0 && y >= 0 && z >= 0 && x < n && y < n && z < n) {

  																cell = this.getCell(n, x, y, z);

  																if (cell.voxel === null) {
  																		cell.voxel = createVoxel(n, x, y, z, materialIndices);

  																		++voxelCount;
  																}

  																voxel = cell.voxel;
  																voxel.normal.add(edge.n);
  																voxel.qefData.add(intersection, edge.n);

  																if (voxel.qefData.numPoints === voxel.edgeCount) {
  																		qefSolver.setData(voxel.qefData).solve(voxel.position);

  																		if (!cell.contains(voxel.position)) {

  																				voxel.position.copy(qefSolver.massPoint);
  																		}

  																		voxel.normal.normalize();
  																}
  														}
  												}
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

  						this.voxelCount = voxelCount;
  				}
  		}]);
  		return SparseVoxelOctree;
  }(Octree);

  var DWORD_BITS = 32;

  var RANGE_DWORD = Math.pow(2, DWORD_BITS);

  var BITS = 53;

  var HI_BITS = 21;

  var LO_BITS = 32;

  var KeyDesign = function () {
  		function KeyDesign() {
  				var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.round(BITS * 0.4);
  				var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.round(BITS * 0.2);
  				var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
  				classCallCheck(this, KeyDesign);


  				if (x + y + z > BITS) {

  						console.error("Invalid bit allotment");

  						x = Math.round(BITS * 0.4);
  						y = Math.round(BITS * 0.2);
  						z = x;
  				}

  				this.x = x;

  				this.y = y;

  				this.z = z;

  				this.rangeX = Math.pow(2, this.x);

  				this.rangeY = Math.pow(2, this.y);

  				this.rangeZ = Math.pow(2, this.z);

  				this.rangeXY = Math.pow(2, this.x + this.y);

  				this.halfRange = new Vector3$1(this.rangeX / 2, this.rangeY / 2, this.rangeZ / 2);

  				this.maskX = [0, 0];

  				this.maskY = [0, 0];

  				this.maskZ = [0, 0];

  				this.updateBitMasks();
  		}

  		createClass(KeyDesign, [{
  				key: "updateBitMasks",
  				value: function updateBitMasks() {

  						var X_BITS = this.x;
  						var Y_BITS = this.y;
  						var Z_BITS = this.z;

  						var maskX = this.maskX;
  						var maskY = this.maskY;
  						var maskZ = this.maskZ;

  						var hiShiftX = DWORD_BITS - Math.max(0, X_BITS - LO_BITS);
  						var hiShiftY = DWORD_BITS - Math.max(0, Y_BITS + X_BITS - LO_BITS);
  						var hiShiftZ = DWORD_BITS - Math.max(0, Z_BITS + Y_BITS + X_BITS - LO_BITS);

  						maskX[1] = hiShiftX < DWORD_BITS ? ~0 >>> hiShiftX : 0;
  						maskX[0] = ~0 >>> Math.max(0, LO_BITS - X_BITS);

  						maskY[1] = ((hiShiftY < DWORD_BITS ? ~0 >>> hiShiftY : 0) & ~maskX[1]) >>> 0;
  						maskY[0] = (~0 >>> Math.max(0, LO_BITS - (X_BITS + Y_BITS)) & ~maskX[0]) >>> 0;

  						maskZ[1] = ((hiShiftZ < DWORD_BITS ? ~0 >>> hiShiftZ : 0) & ~maskY[1] & ~maskX[1]) >>> 0;
  						maskZ[0] = (~0 >>> Math.max(0, LO_BITS - (X_BITS + Y_BITS + Z_BITS)) & ~maskY[0] & ~maskX[0]) >>> 0;
  				}
  		}, {
  				key: "unpackKey",
  				value: function unpackKey(key) {
  						var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


  						var maskX = this.maskX;
  						var maskY = this.maskY;
  						var maskZ = this.maskZ;

  						var hi = Math.trunc(key / RANGE_DWORD);
  						var lo = key % RANGE_DWORD;

  						return target.set((hi & maskX[1]) * RANGE_DWORD + ((lo & maskX[0]) >>> 0), ((hi & maskY[1]) * RANGE_DWORD + ((lo & maskY[0]) >>> 0)) / this.rangeX, ((hi & maskZ[1]) * RANGE_DWORD + ((lo & maskZ[0]) >>> 0)) / this.rangeXY);
  				}
  		}, {
  				key: "packKey",
  				value: function packKey(position) {

  						return position.z * this.rangeXY + position.y * this.rangeX + position.x;
  				}
  		}, {
  				key: "toString",
  				value: function toString() {

  						var maskX = this.maskX;
  						var maskY = this.maskY;
  						var maskZ = this.maskZ;

  						return "Key Design\n\n" + "X-Bits: " + this.x + "\n" + "Y-Bits: " + this.y + "\n" + "Z-Bits: " + this.z + "\n\n" + BinaryUtils.createBinaryString(maskX[1], DWORD_BITS) + " " + maskX[1] + " (HI-Mask X)\n" + BinaryUtils.createBinaryString(maskX[0], DWORD_BITS) + " " + maskX[0] + " (LO-Mask X)\n\n" + BinaryUtils.createBinaryString(maskY[1], DWORD_BITS) + " " + maskY[1] + " (HI-Mask Y)\n" + BinaryUtils.createBinaryString(maskY[0], DWORD_BITS) + " " + maskY[0] + " (LO-Mask Y)\n\n" + BinaryUtils.createBinaryString(maskZ[1], DWORD_BITS) + " " + maskZ[1] + " (HI-Mask Z)\n" + BinaryUtils.createBinaryString(maskZ[0], DWORD_BITS) + " " + maskZ[0] + " (LO-Mask Z)\n";
  				}
  		}], [{
  				key: "BITS",
  				get: function get$$1() {
  						return BITS;
  				}
  		}, {
  				key: "HI_BITS",
  				get: function get$$1() {
  						return HI_BITS;
  				}
  		}, {
  				key: "LO_BITS",
  				get: function get$$1() {
  						return LO_BITS;
  				}
  		}]);
  		return KeyDesign;
  }();

  var p$3 = new Vector3$1();

  var WorldOctree = function () {
  	function WorldOctree() {
  		var cellSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
  		var levels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  		var keyDesign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new KeyDesign();
  		classCallCheck(this, WorldOctree);


  		this.cellSize = cellSize;

  		this.keyDesign = keyDesign;

  		this.grids = [];

  		while (this.grids.length < levels) {

  			this.grids.push(new Map());
  		}

  		this.min = this.keyDesign.halfRange.clone().multiplyScalar(-this.cellSize);

  		this.max = this.keyDesign.halfRange.clone().multiplyScalar(this.cellSize);
  	}

  	createClass(WorldOctree, [{
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.min).add(this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "setCenter",
  		value: function setCenter(center) {

  			this.min.copy(this.keyDesign.halfRange).multiplyScalar(-this.cellSize).add(center);
  			this.max.copy(this.keyDesign.halfRange).multiplyScalar(this.cellSize).add(center);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.max).sub(this.min);
  		}
  	}, {
  		key: "getDepth",
  		value: function getDepth() {

  			return this.grids.length - 1;
  		}
  	}, {
  		key: "getGrid",
  		value: function getGrid(lod) {

  			return lod > 0 && lod < this.grids.length ? this.grids[lod] : undefined;
  		}
  	}, {
  		key: "contains",
  		value: function contains(point) {

  			var min = this.min;
  			var max = this.max;

  			return point.x >= min.x && point.y >= min.y && point.z >= min.z && point.x <= max.x && point.y <= max.y && point.z <= max.z;
  		}
  	}, {
  		key: "findOctantsByLevel",
  		value: function findOctantsByLevel(level) {

  			return this.grids[level];
  		}
  	}, {
  		key: "getOctant",
  		value: function getOctant(key) {
  			var lod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			var grid = this.getGrid(lod);

  			var result = void 0;

  			if (grid !== undefined) {

  				result = grid.get(key);
  			} else {

  				console.error("Invalid LOD", lod);
  			}

  			return result;
  		}
  	}, {
  		key: "getOctantXXX",
  		value: function getOctantXXX(point) {
  			var lod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			var keyDesign = this.keyDesign;
  			var cellSize = this.cellSize;
  			var grid = this.getGrid(lod);

  			var result = void 0;

  			if (grid !== undefined) {

  				if (this.contains(point)) {
  					p$3.set(Math.trunc(point.x / cellSize), Math.trunc(point.y / cellSize), Math.trunc(point.z / cellSize)).sub(this.min);

  					result = grid.get(keyDesign.packKey(p$3));
  				} else {

  					console.error("Position out of range", point);
  				}
  			} else {

  				console.error("Invalid LOD", lod);
  			}

  			return result;
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			return intersects;
  		}
  	}, {
  		key: "cull",
  		value: function cull(region) {

  			return null;
  		}
  	}, {
  		key: Symbol.iterator,
  		value: function value() {

  			return null;
  		}
  	}, {
  		key: "levels",
  		get: function get$$1() {
  			return this.grids.length;
  		}
  	}]);
  	return WorldOctree;
  }();

  var DataEvent = function (_Event) {
  	inherits(DataEvent, _Event);

  	function DataEvent(type) {
  		classCallCheck(this, DataEvent);

  		var _this = possibleConstructorReturn(this, (DataEvent.__proto__ || Object.getPrototypeOf(DataEvent)).call(this, type));

  		_this.qefData = null;

  		return _this;
  	}

  	return DataEvent;
  }(Event);

  var mouse = new three.Vector2();

  var updateEvent$1 = new Event("update");

  var GridPointEditor = function (_EventTarget) {
  		inherits(GridPointEditor, _EventTarget);

  		function GridPointEditor(cellPosition, cellSize, hermiteData, camera) {
  				var dom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.body;
  				classCallCheck(this, GridPointEditor);

  				var _this = possibleConstructorReturn(this, (GridPointEditor.__proto__ || Object.getPrototypeOf(GridPointEditor)).call(this));

  				_this.hermiteData = hermiteData;

  				_this.cellPosition = cellPosition;

  				_this.cellSize = cellSize;

  				_this.camera = camera;

  				_this.dom = dom;

  				_this.raycaster = new three.Raycaster();

  				_this.gridPointMaterials = [new three.MeshBasicMaterial({
  						color: 0x999999,
  						depthWrite: false,
  						transparent: true,
  						opacity: 0.75
  				}), new three.MeshBasicMaterial({
  						color: 0xcc6666,
  						depthWrite: false,
  						transparent: true,
  						opacity: 0.9
  				})];

  				_this.selectedGridPoint = null;

  				_this.gridPoints = new three.Group();

  				_this.createGridPoints();

  				return _this;
  		}

  		createClass(GridPointEditor, [{
  				key: "createGridPoints",
  				value: function createGridPoints() {

  						var gridPoints = this.gridPoints;

  						var s = this.cellSize;
  						var n = HermiteData.resolution;

  						var base = this.cellPosition;
  						var offset = new three.Vector3();
  						var gridPointGeometry = new three.SphereBufferGeometry(0.05, 8, 8);
  						var gridPointMaterial = this.gridPointMaterials[0];

  						var gridPoint = void 0;
  						var x = void 0,
  						    y = void 0,
  						    z = void 0;

  						for (z = 0; z <= n; ++z) {

  								offset.z = z * s / n;

  								for (y = 0; y <= n; ++y) {

  										offset.y = y * s / n;

  										for (x = 0; x <= n; ++x) {

  												offset.x = x * s / n;

  												gridPoint = new three.Mesh(gridPointGeometry, gridPointMaterial);
  												gridPoint.position.copy(base).add(offset);
  												gridPoints.add(gridPoint);
  										}
  								}
  						}
  				}
  		}, {
  				key: "toggleMaterialIndex",
  				value: function toggleMaterialIndex(index) {

  						var hermiteData = this.hermiteData;
  						var materialIndices = hermiteData.materialIndices;
  						var material = materialIndices[index] === Material.AIR ? Material.SOLID : Material.AIR;

  						hermiteData.setMaterialIndex(index, material);
  				}
  		}, {
  				key: "handleClick",
  				value: function handleClick(event) {

  						var gridPoint = this.selectedGridPoint;

  						event.preventDefault();

  						if (gridPoint !== null) {

  								this.toggleMaterialIndex(this.gridPoints.children.indexOf(gridPoint));
  								this.dispatchEvent(updateEvent$1);
  						}
  				}
  		}, {
  				key: "raycast",
  				value: function raycast(event) {

  						var raycaster = this.raycaster;

  						mouse.x = event.clientX / window.innerWidth * 2 - 1;
  						mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  						raycaster.setFromCamera(mouse, this.camera);

  						var intersectingGridPoints = raycaster.intersectObjects(this.gridPoints.children);

  						if (this.selectedGridPoint !== null) {

  								this.selectedGridPoint.material = this.gridPointMaterials[0];
  								this.selectedGridPoint = null;
  						}

  						if (intersectingGridPoints.length > 0) {

  								this.selectedGridPoint = intersectingGridPoints[0].object;
  								this.selectedGridPoint.material = this.gridPointMaterials[1];
  						}
  				}
  		}, {
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "mousemove":
  										this.raycast(event);
  										break;

  								case "click":
  										this.handleClick(event);
  										break;

  						}
  				}
  		}, {
  				key: "setEnabled",
  				value: function setEnabled(enabled) {

  						var dom = this.dom;

  						if (enabled) {

  								dom.addEventListener("mousemove", this);
  								dom.addEventListener("click", this);
  						} else {

  								dom.removeEventListener("mousemove", this);
  								dom.removeEventListener("click", this);
  						}
  				}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						this.setEnabled(false);
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {}
  		}]);
  		return GridPointEditor;
  }(EventTarget);

  var mouse$1 = new three.Vector2();

  var updateEvent$2 = new Event("update");

  var EdgeEditor = function (_EventTarget) {
  		inherits(EdgeEditor, _EventTarget);

  		function EdgeEditor(cellPosition, cellSize, hermiteData, camera) {
  				var dom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.body;
  				classCallCheck(this, EdgeEditor);

  				var _this = possibleConstructorReturn(this, (EdgeEditor.__proto__ || Object.getPrototypeOf(EdgeEditor)).call(this));

  				_this.hermiteData = hermiteData;

  				_this.cellPosition = cellPosition;

  				_this.cellSize = cellSize;

  				_this.camera = camera;

  				_this.dom = dom;

  				_this.raycaster = new three.Raycaster();
  				_this.raycaster.linePrecision = 0.05;

  				_this.t = 0;

  				_this.edgeMaterials = [new three.LineBasicMaterial({
  						color: 0x999999
  				}), new three.LineBasicMaterial({
  						color: 0xcc6666
  				})];

  				_this.planeMaterials = [new three.MeshBasicMaterial({
  						color: 0xffff00,
  						side: three.DoubleSide,
  						depthWrite: false,
  						transparent: true,
  						opacity: 0.1
  				}), new three.MeshBasicMaterial({
  						color: 0xff6600,
  						side: three.DoubleSide,
  						depthWrite: false,
  						transparent: true,
  						opacity: 0.2
  				})];

  				_this.selectedEdge = null;

  				_this.activeEdge = null;

  				_this.activePlane = null;

  				_this.edgeId = new three.Vector2();

  				_this.edges = new three.Group();

  				_this.planes = new three.Group();

  				_this.t = 0;

  				_this.s = new three.Spherical();

  				return _this;
  		}

  		createClass(EdgeEditor, [{
  				key: "calculateEdgeId",
  				value: function calculateEdgeId(i) {

  						var edgeData = this.hermiteData.edgeData;
  						var edges = edgeData.indices;

  						var d = void 0,
  						    edgeCount = void 0;

  						for (d = 0; d < 3; ++d) {

  								edgeCount = edges[d].length;

  								if (i < edgeCount) {

  										break;
  								} else {

  										i -= edgeCount;
  								}
  						}

  						this.edgeId.set(d, i);
  				}
  		}, {
  				key: "clearEdges",
  				value: function clearEdges() {

  						var edges = this.edges;
  						var planes = this.planes;

  						var edge = void 0,
  						    plane = void 0;

  						while (edges.children.length > 0) {

  								edge = edges.children[0];
  								edge.geometry.dispose();
  								edges.remove(edge);
  						}

  						while (planes.children.length > 0) {

  								plane = planes.children[0];
  								plane.geometry.dispose();
  								planes.remove(plane);
  						}

  						this.activeEdge = null;
  						this.activePlane = null;
  				}
  		}, {
  				key: "createEdges",
  				value: function createEdges() {

  						var lines = this.edges;
  						var planes = this.planes;
  						var edgeMaterial = this.edgeMaterials[0];
  						var planeMaterial = this.planeMaterials[0];
  						var edges = this.hermiteData.edgeData.edges(this.cellPosition, this.cellSize);

  						var intersection = new three.Vector3();

  						var edge = void 0,
  						    line = void 0,
  						    plane = void 0;
  						var lineGeometry = void 0,
  						    lineVertices = void 0;

  						this.clearEdges();

  						var _iteratorNormalCompletion = true;
  						var _didIteratorError = false;
  						var _iteratorError = undefined;

  						try {
  								for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  										edge = _step.value;


  										lineGeometry = new three.BufferGeometry();
  										lineVertices = new Float32Array(6);

  										edge.a.toArray(lineVertices);
  										edge.b.toArray(lineVertices, 3);

  										lineGeometry.addAttribute("position", new three.BufferAttribute(lineVertices, 3));
  										line = new three.Line(lineGeometry, edgeMaterial);
  										lines.add(line);

  										plane = new three.Mesh(new three.PlaneBufferGeometry(2, 2), planeMaterial);
  										plane.position.copy(edge.computeZeroCrossingPosition(intersection));
  										plane.lookAt(intersection.add(edge.n));
  										plane.visible = false;
  										planes.add(plane);
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
  		}, {
  				key: "adoptEdgeData",
  				value: function adoptEdgeData() {

  						var edgeData = this.hermiteData.edgeData;
  						var zeroCrossings = edgeData.zeroCrossings;
  						var normals = edgeData.normals;

  						var d = this.edgeId.x;
  						var i = this.edgeId.y;
  						var n = new three.Vector3();

  						this.t = zeroCrossings[d][i];
  						this.s.setFromVector3(n.fromArray(normals[d], i * 3));
  				}
  		}, {
  				key: "updateEdgeData",
  				value: function updateEdgeData() {

  						var activeEdge = this.activeEdge;
  						var activePlane = this.activePlane;

  						var a = new three.Vector3();
  						var b = new three.Vector3();
  						var c = new three.Vector3();
  						var n = new three.Vector3();

  						var edgeData = this.hermiteData.edgeData;
  						var zeroCrossings = edgeData.zeroCrossings;
  						var normals = edgeData.normals;

  						var d = this.edgeId.x;
  						var i = this.edgeId.y;

  						if (activeEdge !== null) {
  								a.fromArray(activeEdge.geometry.getAttribute("position").array);
  								b.fromArray(activeEdge.geometry.getAttribute("position").array, 3);
  								c.copy(a).add(b.sub(a).multiplyScalar(this.t));
  								n.setFromSpherical(this.s).normalize();

  								activePlane.position.copy(c);
  								activePlane.lookAt(c.add(n));

  								zeroCrossings[d][i] = this.t;
  								n.toArray(normals[d], i * 3);

  								this.dispatchEvent(updateEvent$2);
  						}
  				}
  		}, {
  				key: "handleClick",
  				value: function handleClick(event) {

  						var edge = this.selectedEdge;

  						event.preventDefault();

  						var index = void 0,
  						    plane = void 0;

  						if (edge !== null) {

  								if (this.activeEdge !== null) {
  										if (this.activeEdge !== edge) {
  												this.activeEdge.material = this.edgeMaterials[0];
  										}

  										this.activePlane.material = this.planeMaterials[0];
  										this.activePlane.visible = false;
  								}

  								if (this.activeEdge !== edge) {

  										index = this.edges.children.indexOf(edge);
  										plane = this.planes.children[index];

  										edge.material = this.edgeMaterials[1];
  										plane.material = this.planeMaterials[1];
  										plane.visible = true;

  										this.activeEdge = edge;
  										this.activePlane = plane;

  										this.calculateEdgeId(index);
  										this.adoptEdgeData();
  								} else {

  										this.t = 0;
  										this.s.phi = 0;
  										this.s.theta = 0;

  										this.activeEdge = null;
  										this.activePlane = null;
  								}
  						}
  				}
  		}, {
  				key: "raycast",
  				value: function raycast(event) {

  						var raycaster = this.raycaster;

  						mouse$1.x = event.clientX / window.innerWidth * 2 - 1;
  						mouse$1.y = -(event.clientY / window.innerHeight) * 2 + 1;

  						raycaster.setFromCamera(mouse$1, this.camera);

  						var intersectingEdges = raycaster.intersectObjects(this.edges.children);

  						if (this.selectedEdge !== null) {

  								if (this.selectedEdge !== this.activeEdge) {

  										this.selectedEdge.material = this.edgeMaterials[0];
  								}

  								this.selectedEdge = null;
  						}

  						if (intersectingEdges.length > 0) {

  								this.selectedEdge = intersectingEdges[0].object;
  								this.selectedEdge.material = this.edgeMaterials[1];
  						}
  				}
  		}, {
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "mousemove":
  										this.raycast(event);
  										break;

  								case "click":
  										this.handleClick(event);
  										break;

  						}
  				}
  		}, {
  				key: "setEnabled",
  				value: function setEnabled(enabled) {

  						var dom = this.dom;

  						if (enabled) {

  								dom.addEventListener("mousemove", this);
  								dom.addEventListener("click", this);
  						} else {

  								dom.removeEventListener("mousemove", this);
  								dom.removeEventListener("click", this);
  						}
  				}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						this.setEnabled(false);
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {

  						var editor = this;
  						var planes = this.planes;

  						var params = {
  								"show planes": false
  						};

  						gui.add(params, "show planes").onChange(function () {

  								var activePlane = editor.activePlane;

  								planes.traverse(function (child) {

  										if (child !== planes && child !== activePlane) {

  												child.visible = params["show planes"];
  										}
  								});
  						});

  						var folder = gui.addFolder("Edge Adjustment");
  						folder.add(this, "t").min(0).max(1).listen().step(1e-6).onChange(function () {
  								editor.updateEdgeData();
  						});
  						folder.add(this.s, "phi").min(1e-6).max(Math.PI - 1e-6).step(1e-6).listen().onChange(function () {
  								editor.updateEdgeData();
  						});
  						folder.add(this.s, "theta").min(1e-6).max(Math.PI - 1e-6).step(1e-6).listen().onChange(function () {
  								editor.updateEdgeData();
  						});
  						folder.open();
  				}
  		}]);
  		return EdgeEditor;
  }(EventTarget);

  var updateEvent = new DataEvent("update");

  var HermiteDataEditor = function (_EventTarget) {
  		inherits(HermiteDataEditor, _EventTarget);

  		function HermiteDataEditor(cellPosition, cellSize, hermiteData, camera) {
  				var dom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.body;
  				classCallCheck(this, HermiteDataEditor);

  				var _this = possibleConstructorReturn(this, (HermiteDataEditor.__proto__ || Object.getPrototypeOf(HermiteDataEditor)).call(this));

  				_this.hermiteData = hermiteData;

  				_this.cellPosition = cellPosition;

  				_this.cellSize = cellSize;

  				_this.gridPointEditor = new GridPointEditor(cellPosition, cellSize, hermiteData, camera, dom);
  				_this.gridPointEditor.addEventListener("update", _this);
  				_this.gridPointEditor.setEnabled(true);

  				_this.edgeEditor = new EdgeEditor(cellPosition, cellSize, hermiteData, camera, dom);
  				_this.edgeEditor.addEventListener("update", _this);

  				_this.qefData = new QEFData();

  				return _this;
  		}

  		createClass(HermiteDataEditor, [{
  				key: "createEdgeData",
  				value: function createEdgeData() {

  						var n = HermiteData.resolution;
  						var m = n + 1;
  						var mm = m * m;

  						var indexOffsets = new Uint32Array([1, m, mm]);
  						var materialIndices = this.hermiteData.materialIndices;
  						var edgeData = new EdgeData(EdgeData.calculate1DEdgeCount(n));

  						var edges = void 0,
  						    zeroCrossings = void 0,
  						    normals = void 0;
  						var indexA = void 0,
  						    indexB = void 0;

  						var c = void 0,
  						    d = void 0,
  						    a = void 0,
  						    axis = void 0;
  						var x = void 0,
  						    y = void 0,
  						    z = void 0;
  						var X = void 0,
  						    Y = void 0,
  						    Z = void 0;

  						for (a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {
  								axis = pattern[a];

  								edges = edgeData.indices[d];
  								zeroCrossings = edgeData.zeroCrossings[d];
  								normals = edgeData.normals[d];

  								X = Y = Z = n;

  								switch (d) {

  										case 0:
  												X = Math.min(X, n - 1);
  												break;

  										case 1:
  												Y = Math.min(Y, n - 1);
  												break;

  										case 2:
  												Z = Math.min(Z, n - 1);
  												break;

  								}

  								for (z = 0; z <= Z; ++z) {

  										for (y = 0; y <= Y; ++y) {

  												for (x = 0; x <= X; ++x) {

  														indexA = z * mm + y * m + x;
  														indexB = indexA + indexOffsets[d];

  														if (materialIndices[indexA] !== materialIndices[indexB]) {

  																edges[c] = indexA;
  																zeroCrossings[c] = 0.5;
  																normals[c * 3] = axis[0];
  																normals[c * 3 + 1] = axis[1];
  																normals[c * 3 + 2] = axis[2];

  																++c;
  														}
  												}
  										}
  								}

  								edgeData.indices[d] = edgeData.indices[d].slice(0, c);
  								edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, c);
  								edgeData.normals[d] = edgeData.normals[d].slice(0, c * 3);
  						}

  						this.hermiteData.edgeData = edgeData;
  				}
  		}, {
  				key: "updateQEFData",
  				value: function updateQEFData() {

  						var qefData = this.qefData;
  						var intersection = new three.Vector3();
  						var edges = this.hermiteData.edgeData.edges(this.cellPosition, this.cellSize);

  						var edge = void 0;

  						qefData.clear();

  						var _iteratorNormalCompletion = true;
  						var _didIteratorError = false;
  						var _iteratorError = undefined;

  						try {
  								for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  										edge = _step.value;


  										edge.computeZeroCrossingPosition(intersection);
  										qefData.add(intersection, edge.n);
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
  		}, {
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "update":
  										{

  												if (event.target === this.gridPointEditor) {

  														this.createEdgeData();
  														this.edgeEditor.createEdges();
  												}

  												if (HermiteData.resolution === 1) {

  														this.updateQEFData();
  												}

  												updateEvent.qefData = this.qefData;
  												this.dispatchEvent(updateEvent);

  												break;
  										}

  						}
  				}
  		}, {
  				key: "setEnabled",
  				value: function setEnabled(enabled) {

  						this.gridPointEditor.setEnabled(enabled);
  						this.edgeEditor.setEnabled(enabled);
  				}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						this.setEnabled(false);
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {
  						var _this2 = this;

  						var params = {
  								"edit mode": 0
  						};

  						gui.add(params, "edit mode", { materials: 0, edges: 1 }).onChange(function () {

  								var editGridPoints = Number.parseInt(params["edit mode"]) === 0;

  								_this2.gridPointEditor.setEnabled(editGridPoints);
  								_this2.edgeEditor.setEnabled(!editGridPoints);
  						});

  						this.edgeEditor.configure(gui);
  				}
  		}, {
  				key: "gridPoints",
  				get: function get$$1() {
  						return this.gridPointEditor.gridPoints;
  				}
  		}, {
  				key: "edges",
  				get: function get$$1() {
  						return this.edgeEditor.edges;
  				}
  		}, {
  				key: "planes",
  				get: function get$$1() {
  						return this.edgeEditor.planes;
  				}
  		}]);
  		return HermiteDataEditor;
  }(EventTarget);

  var Demo = function () {
  		function Demo(renderer) {
  				classCallCheck(this, Demo);


  				this.renderer = renderer;

  				this.loadingManager = new three.LoadingManager();

  				this.assets = null;

  				this.scene = new three.Scene();
  				this.scene.fog = new three.FogExp2(0x0d0d0d, 0.0025);

  				this.camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);

  				this.controls = null;
  		}

  		createClass(Demo, [{
  				key: "load",
  				value: function load(callback) {
  						callback();
  				}
  		}, {
  				key: "initialise",
  				value: function initialise() {}
  		}, {
  				key: "render",
  				value: function render(delta) {}
  		}, {
  				key: "configure",
  				value: function configure(gui) {}
  		}, {
  				key: "reset",
  				value: function reset() {

  						var fog = this.scene.fog;

  						this.scene = new three.Scene();
  						this.scene.fog = fog;

  						if (this.controls !== null) {

  								this.controls.dispose();
  								this.controls = null;
  						}

  						return this;
  				}
  		}]);
  		return Demo;
  }();

  var QEFDemo = function (_Demo) {
  		inherits(QEFDemo, _Demo);

  		function QEFDemo(renderer) {
  				classCallCheck(this, QEFDemo);

  				var _this = possibleConstructorReturn(this, (QEFDemo.__proto__ || Object.getPrototypeOf(QEFDemo)).call(this, renderer));

  				_this.hermiteData = null;

  				_this.hermiteDataHelper = null;

  				_this.hermiteDataEditor = null;

  				_this.qefSolver = new QEFSolver();

  				_this.error = "0.0000";

  				_this.result = {
  						x: "",
  						y: "",
  						z: ""
  				};

  				_this.vertex = new three.Mesh(new three.SphereBufferGeometry(0.05, 8, 8), new three.MeshBasicMaterial({
  						color: 0xff8822
  				}));

  				_this.vertex.visible = false;

  				return _this;
  		}

  		createClass(QEFDemo, [{
  				key: "initialise",
  				value: function initialise() {

  						var scene = this.scene;
  						var camera = this.camera;
  						var renderer = this.renderer;

  						scene.fog.color.setHex(0xf4f4f4);
  						scene.fog.density = 0.025;
  						renderer.setClearColor(scene.fog.color);

  						var controls = new three.OrbitControls(camera, renderer.domElement);
  						controls.enablePan = false;
  						controls.maxDistance = 40;

  						this.controls = controls;

  						camera.near = 0.01;
  						camera.far = 50;
  						camera.position.set(-2, 1, 2);
  						camera.lookAt(controls.target);

  						HermiteData.resolution = 1;

  						var cellSize = 1;
  						var cellPosition = new three.Vector3(-0.5, -0.5, -0.5);
  						cellPosition.multiplyScalar(cellSize);

  						var hermiteData = new HermiteData();
  						var hermiteDataHelper = new HermiteDataHelper(cellPosition, cellSize, hermiteData, true, false);

  						this.hermiteData = hermiteData;
  						this.hermiteDataHelper = hermiteDataHelper;

  						scene.add(hermiteDataHelper);

  						var hermiteDataEditor = new HermiteDataEditor(cellPosition, cellSize, hermiteData, camera, renderer.domElement);
  						hermiteDataEditor.addEventListener("update", this);

  						this.hermiteDataEditor = hermiteDataEditor;

  						scene.add(hermiteDataEditor.gridPoints);
  						scene.add(hermiteDataEditor.edges);
  						scene.add(hermiteDataEditor.planes);

  						var size = cellSize - 0.05;
  						scene.add(new three.Mesh(new three.BoxBufferGeometry(size, size, size), new three.MeshBasicMaterial({
  								color: 0xcccccc,
  								depthWrite: false,
  								transparent: true,
  								opacity: 0.35
  						})));

  						scene.add(this.vertex);
  				}
  		}, {
  				key: "solveQEF",
  				value: function solveQEF(qefData) {

  						var hermiteData = this.hermiteData;
  						var qefSolver = this.qefSolver;
  						var vertex = this.vertex;
  						var result = this.result;

  						if (!hermiteData.empty && !hermiteData.full) {

  								this.error = qefSolver.setData(qefData).solve(vertex.position).toFixed(4);
  								vertex.visible = true;

  								result.x = vertex.position.x.toFixed(2);
  								result.y = vertex.position.y.toFixed(2);
  								result.z = vertex.position.z.toFixed(2);
  						} else if (vertex.visible) {

  								result.x = "";
  								result.y = "";
  								result.z = "";

  								vertex.visible = false;
  						}
  				}
  		}, {
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "update":
  										this.hermiteDataHelper.update(true, false);
  										this.solveQEF(event.qefData);
  										break;

  						}
  				}
  		}, {
  				key: "render",
  				value: function render(delta) {

  						this.renderer.render(this.scene, this.camera);
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {

  						var folder = gui.addFolder("Result");
  						folder.add(this.result, "x").listen();
  						folder.add(this.result, "y").listen();
  						folder.add(this.result, "z").listen();
  						folder.add(this, "error").listen();
  						folder.open();

  						this.hermiteDataEditor.configure(gui);
  				}
  		}]);
  		return QEFDemo;
  }(Demo);

  var App = function () {
  		function App() {
  				classCallCheck(this, App);


  				this.clock = new three.Clock();

  				this.renderer = new three.WebGLRenderer({
  						logarithmicDepthBuffer: true,
  						antialias: true
  				});

  				this.renderer.setSize(window.innerWidth, window.innerHeight);
  				this.renderer.setClearColor(0x000000);
  				this.renderer.setPixelRatio(window.devicePixelRatio);

  				this.stats = function () {

  						var stats = new Stats();
  						stats.showPanel(0);
  						stats.dom.id = "stats";

  						return stats;
  				}();

  				this.demos = function (renderer) {

  						var demos = new Map();

  						demos.set("qef", new QEFDemo(renderer));

  						return demos;
  				}(this.renderer);

  				this.demo = function (demos) {

  						var key = window.location.hash.slice(1);

  						if (key.length === 0 || !demos.has(key)) {

  								key = demos.keys().next().value;
  						}

  						return key;
  				}(this.demos);
  		}

  		createClass(App, [{
  				key: "initialise",
  				value: function initialise(viewport, aside, loadingMessage) {

  						var app = this;

  						var renderer = this.renderer;
  						var clock = this.clock;
  						var stats = this.stats;
  						var demos = this.demos;

  						var demo = null;
  						var gui = null;

  						viewport.appendChild(renderer.domElement);
  						aside.appendChild(stats.dom);

  						function activateDemo() {

  								demo.initialise();

  								demo.camera.aspect = window.innerWidth / window.innerHeight;
  								demo.camera.updateProjectionMatrix();

  								gui = new dat.GUI({ autoPlace: false });
  								gui.add(app, "demo", Array.from(demos.keys())).onChange(loadDemo);
  								demo.configure(gui);
  								aside.appendChild(gui.domElement);

  								loadingMessage.style.display = "none";
  								renderer.domElement.style.visibility = "visible";
  						}

  						function loadDemo() {

  								loadingMessage.style.display = "block";
  								renderer.domElement.style.visibility = "hidden";

  								if (gui !== null) {

  										gui.destroy();
  										aside.removeChild(gui.domElement);
  								}

  								if (demo !== null) {

  										demo.reset();
  								}

  								demo = demos.get(app.demo);
  								demo.load(activateDemo);
  						}

  						loadDemo();

  						document.addEventListener("keydown", function onKeyDown(event) {

  								if (event.altKey) {

  										event.preventDefault();
  										aside.style.visibility = aside.style.visibility === "hidden" ? "visible" : "hidden";
  								}
  						});

  						window.addEventListener("resize", function () {

  								var id = 0;

  								function handleResize(event) {

  										var width = event.target.innerWidth;
  										var height = event.target.innerHeight;

  										renderer.setSize(width, height);
  										demo.camera.aspect = width / height;
  										demo.camera.updateProjectionMatrix();

  										id = 0;
  								}

  								return function onResize(event) {

  										if (id === 0) {

  												id = setTimeout(handleResize, 66, event);
  										}
  								};
  						}());

  						(function render(now) {

  								var delta = clock.getDelta();

  								requestAnimationFrame(render);

  								stats.begin();

  								demo.render(delta);

  								stats.end();
  						})();
  				}
  		}]);
  		return App;
  }();

  window.addEventListener("load", function main(event) {

  	var viewport = document.getElementById("viewport");
  	var loadingMessage = viewport.children[0];
  	var aside = document.getElementById("aside");

  	var app = new App();

  	window.removeEventListener("load", main);
  	aside.style.visibility = "visible";

  	app.initialise(viewport, aside, loadingMessage);
  });

}(THREE,dat,Stats));
