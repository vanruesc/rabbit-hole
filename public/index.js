(function (three,dat,Stats) {
  'use strict';

  dat = 'default' in dat ? dat['default'] : dat;
  Stats = 'default' in Stats ? Stats['default'] : Stats;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

  var Feature = function () {
  	function Feature() {
  		var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		classCallCheck(this, Feature);


  		this.name = name;

  		this.root = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.self === self ? self : (typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" && global.global === global ? global : this;

  		this.supported = false;
  	}

  	createClass(Feature, [{
  		key: "toString",
  		value: function toString() {

  			return this.name;
  		}
  	}]);
  	return Feature;
  }();

  var FeatureId = {

    CANVAS: "feature.canvas",
    FILE: "feature.file",
    TYPED_ARRAY: "feature.typed-array",
    WEBGL: "feature.webgl",
    WORKER: "feature.worker"

  };

  var CanvasFeature = function (_Feature) {
  	inherits(CanvasFeature, _Feature);

  	function CanvasFeature() {
  		classCallCheck(this, CanvasFeature);

  		var _this = possibleConstructorReturn(this, (CanvasFeature.__proto__ || Object.getPrototypeOf(CanvasFeature)).call(this, "Canvas"));

  		_this.supported = _this.root.CanvasRenderingContext2D !== undefined;

  		return _this;
  	}

  	return CanvasFeature;
  }(Feature);

  var FileFeature = function (_Feature) {
  	inherits(FileFeature, _Feature);

  	function FileFeature() {
  		classCallCheck(this, FileFeature);

  		var _this = possibleConstructorReturn(this, (FileFeature.__proto__ || Object.getPrototypeOf(FileFeature)).call(this, "File"));

  		_this.supported = _this.root.File !== undefined && _this.root.FileReader !== undefined && _this.root.FileList !== undefined && _this.root.Blob !== undefined;

  		return _this;
  	}

  	return FileFeature;
  }(Feature);

  var TypedArrayFeature = function (_Feature) {
  	inherits(TypedArrayFeature, _Feature);

  	function TypedArrayFeature() {
  		classCallCheck(this, TypedArrayFeature);

  		var _this = possibleConstructorReturn(this, (TypedArrayFeature.__proto__ || Object.getPrototypeOf(TypedArrayFeature)).call(this, "Typed Array"));

  		_this.supported = _this.root.ArrayBuffer !== undefined;

  		return _this;
  	}

  	return TypedArrayFeature;
  }(Feature);

  var WebGLFeature = function (_Feature) {
  		inherits(WebGLFeature, _Feature);

  		function WebGLFeature() {
  				classCallCheck(this, WebGLFeature);

  				var _this = possibleConstructorReturn(this, (WebGLFeature.__proto__ || Object.getPrototypeOf(WebGLFeature)).call(this, "WebGL"));

  				_this.supported = function (root) {

  						var supported = root.WebGLRenderingContext !== undefined;
  						var canvas = void 0,
  						    context = void 0;

  						if (supported) {

  								canvas = document.createElement("canvas");
  								context = canvas.getContext("webgl");

  								if (context === null) {

  										if (canvas.getContext("experimental-webgl") === null) {

  												supported = false;
  										}
  								}
  						}

  						return supported;
  				}(_this.root);

  				return _this;
  		}

  		return WebGLFeature;
  }(Feature);

  var WorkerFeature = function (_Feature) {
  	inherits(WorkerFeature, _Feature);

  	function WorkerFeature() {
  		classCallCheck(this, WorkerFeature);

  		var _this = possibleConstructorReturn(this, (WorkerFeature.__proto__ || Object.getPrototypeOf(WorkerFeature)).call(this, "Web Worker"));

  		_this.supported = _this.root.Worker !== undefined;

  		return _this;
  	}

  	return WorkerFeature;
  }(Feature);

  var Detector = function () {
  	function Detector() {
  		classCallCheck(this, Detector);


  		this.features = new Map();

  		this.features.set(FeatureId.CANVAS, new CanvasFeature());
  		this.features.set(FeatureId.FILE, new FileFeature());
  		this.features.set(FeatureId.TYPED_ARRAY, new TypedArrayFeature());
  		this.features.set(FeatureId.WEBGL, new WebGLFeature());
  		this.features.set(FeatureId.WORKER, new WorkerFeature());
  	}

  	createClass(Detector, [{
  		key: "getFeatures",
  		value: function getFeatures(missing, featureIds) {

  			var features = [];

  			var featureId = void 0,
  			    feature = void 0;

  			if (featureIds.length > 0) {
  				var _iteratorNormalCompletion = true;
  				var _didIteratorError = false;
  				var _iteratorError = undefined;

  				try {

  					for (var _iterator = featureIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  						featureId = _step.value;


  						feature = this.features.get(featureId);

  						if (feature !== undefined && feature.supported === !missing) {

  							features.push(feature);
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
  			} else {
  				var _iteratorNormalCompletion2 = true;
  				var _didIteratorError2 = false;
  				var _iteratorError2 = undefined;

  				try {

  					for (var _iterator2 = this.features.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
  						feature = _step2.value;


  						if (feature.supported === !missing) {

  							features.push(feature);
  						}
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

  			return features.length > 0 ? features : null;
  		}
  	}, {
  		key: "getMissingFeatures",
  		value: function getMissingFeatures() {
  			for (var _len = arguments.length, featureIds = Array(_len), _key = 0; _key < _len; _key++) {
  				featureIds[_key] = arguments[_key];
  			}

  			return this.getFeatures(true, featureIds);
  		}
  	}, {
  		key: "getSupportedFeatures",
  		value: function getSupportedFeatures() {
  			for (var _len2 = arguments.length, featureIds = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
  				featureIds[_key2] = arguments[_key2];
  			}

  			return this.getFeatures(false, featureIds);
  		}
  	}, {
  		key: "get",
  		value: function get$$1(featureId) {

  			return this.features.get(featureId);
  		}
  	}, {
  		key: "set",
  		value: function set$$1(featureId, feature) {

  			return this.features.set(featureId, feature);
  		}
  	}, {
  		key: "getMessage",
  		value: function getMessage(feature) {

  			return "The " + feature + " feature is " + (feature.supported ? "supported" : "missing") + " in the current environment.";
  		}
  	}]);
  	return Detector;
  }();

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
  	function EdgeData(n) {
  		classCallCheck(this, EdgeData);


  		var c = Math.pow(n + 1, 2) * n;

  		this.edges = [new Uint32Array(c), new Uint32Array(c), new Uint32Array(c)];

  		this.zeroCrossings = [new Float32Array(c), new Float32Array(c), new Float32Array(c)];

  		this.normals = [new Float32Array(c * 3), new Float32Array(c * 3), new Float32Array(c * 3)];
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

  var worker = "(function () {\n  'use strict';\n\n  var classCallCheck = function (instance, Constructor) {\n    if (!(instance instanceof Constructor)) {\n      throw new TypeError(\"Cannot call a class as a function\");\n    }\n  };\n\n  var createClass = function () {\n    function defineProperties(target, props) {\n      for (var i = 0; i < props.length; i++) {\n        var descriptor = props[i];\n        descriptor.enumerable = descriptor.enumerable || false;\n        descriptor.configurable = true;\n        if (\"value\" in descriptor) descriptor.writable = true;\n        Object.defineProperty(target, descriptor.key, descriptor);\n      }\n    }\n\n    return function (Constructor, protoProps, staticProps) {\n      if (protoProps) defineProperties(Constructor.prototype, protoProps);\n      if (staticProps) defineProperties(Constructor, staticProps);\n      return Constructor;\n    };\n  }();\n\n\n\n\n\n\n\n  var get = function get(object, property, receiver) {\n    if (object === null) object = Function.prototype;\n    var desc = Object.getOwnPropertyDescriptor(object, property);\n\n    if (desc === undefined) {\n      var parent = Object.getPrototypeOf(object);\n\n      if (parent === null) {\n        return undefined;\n      } else {\n        return get(parent, property, receiver);\n      }\n    } else if (\"value\" in desc) {\n      return desc.value;\n    } else {\n      var getter = desc.get;\n\n      if (getter === undefined) {\n        return undefined;\n      }\n\n      return getter.call(receiver);\n    }\n  };\n\n  var inherits = function (subClass, superClass) {\n    if (typeof superClass !== \"function\" && superClass !== null) {\n      throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass);\n    }\n\n    subClass.prototype = Object.create(superClass && superClass.prototype, {\n      constructor: {\n        value: subClass,\n        enumerable: false,\n        writable: true,\n        configurable: true\n      }\n    });\n    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;\n  };\n\n\n\n\n\n\n\n\n\n\n\n  var possibleConstructorReturn = function (self, call) {\n    if (!self) {\n      throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");\n    }\n\n    return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self;\n  };\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n  var toConsumableArray = function (arr) {\n    if (Array.isArray(arr)) {\n      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];\n\n      return arr2;\n    } else {\n      return Array.from(arr);\n    }\n  };\n\n  var Vector3 = function () {\n  \tfunction Vector3() {\n  \t\tvar x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n  \t\tvar y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n  \t\tvar z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n  \t\tclassCallCheck(this, Vector3);\n\n\n  \t\tthis.x = x;\n\n  \t\tthis.y = y;\n\n  \t\tthis.z = z;\n  \t}\n\n  \tcreateClass(Vector3, [{\n  \t\tkey: \"set\",\n  \t\tvalue: function set$$1(x, y, z) {\n\n  \t\t\tthis.x = x;\n  \t\t\tthis.y = y;\n  \t\t\tthis.z = z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"copy\",\n  \t\tvalue: function copy(v) {\n\n  \t\t\tthis.x = v.x;\n  \t\t\tthis.y = v.y;\n  \t\t\tthis.z = v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"fromArray\",\n  \t\tvalue: function fromArray(array) {\n  \t\t\tvar offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n\n  \t\t\tthis.x = array[offset];\n  \t\t\tthis.y = array[offset + 1];\n  \t\t\tthis.z = array[offset + 2];\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"toArray\",\n  \t\tvalue: function toArray$$1() {\n  \t\t\tvar array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n  \t\t\tvar offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n\n  \t\t\tarray[offset] = this.x;\n  \t\t\tarray[offset + 1] = this.y;\n  \t\t\tarray[offset + 2] = this.z;\n\n  \t\t\treturn array;\n  \t\t}\n  \t}, {\n  \t\tkey: \"equals\",\n  \t\tvalue: function equals(v) {\n\n  \t\t\treturn v.x === this.x && v.y === this.y && v.z === this.z;\n  \t\t}\n  \t}, {\n  \t\tkey: \"clone\",\n  \t\tvalue: function clone() {\n\n  \t\t\treturn new this.constructor(this.x, this.y, this.z);\n  \t\t}\n  \t}, {\n  \t\tkey: \"add\",\n  \t\tvalue: function add(v) {\n\n  \t\t\tthis.x += v.x;\n  \t\t\tthis.y += v.y;\n  \t\t\tthis.z += v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"addScaledVector\",\n  \t\tvalue: function addScaledVector(v, s) {\n\n  \t\t\tthis.x += v.x * s;\n  \t\t\tthis.y += v.y * s;\n  \t\t\tthis.z += v.z * s;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"addScalar\",\n  \t\tvalue: function addScalar(s) {\n\n  \t\t\tthis.x += s;\n  \t\t\tthis.y += s;\n  \t\t\tthis.z += s;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"addVectors\",\n  \t\tvalue: function addVectors(a, b) {\n\n  \t\t\tthis.x = a.x + b.x;\n  \t\t\tthis.y = a.y + b.y;\n  \t\t\tthis.z = a.z + b.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"sub\",\n  \t\tvalue: function sub(v) {\n\n  \t\t\tthis.x -= v.x;\n  \t\t\tthis.y -= v.y;\n  \t\t\tthis.z -= v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"subScalar\",\n  \t\tvalue: function subScalar(s) {\n\n  \t\t\tthis.x -= s;\n  \t\t\tthis.y -= s;\n  \t\t\tthis.z -= s;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"subVectors\",\n  \t\tvalue: function subVectors(a, b) {\n\n  \t\t\tthis.x = a.x - b.x;\n  \t\t\tthis.y = a.y - b.y;\n  \t\t\tthis.z = a.z - b.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"multiply\",\n  \t\tvalue: function multiply(v) {\n\n  \t\t\tthis.x *= v.x;\n  \t\t\tthis.y *= v.y;\n  \t\t\tthis.z *= v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"multiplyScalar\",\n  \t\tvalue: function multiplyScalar(s) {\n\n  \t\t\tif (isFinite(s)) {\n\n  \t\t\t\tthis.x *= s;\n  \t\t\t\tthis.y *= s;\n  \t\t\t\tthis.z *= s;\n  \t\t\t} else {\n\n  \t\t\t\tthis.x = 0;\n  \t\t\t\tthis.y = 0;\n  \t\t\t\tthis.z = 0;\n  \t\t\t}\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"multiplyVectors\",\n  \t\tvalue: function multiplyVectors(a, b) {\n\n  \t\t\tthis.x = a.x * b.x;\n  \t\t\tthis.y = a.y * b.y;\n  \t\t\tthis.z = a.z * b.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"divide\",\n  \t\tvalue: function divide(v) {\n\n  \t\t\tthis.x /= v.x;\n  \t\t\tthis.y /= v.y;\n  \t\t\tthis.z /= v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"divideScalar\",\n  \t\tvalue: function divideScalar(s) {\n\n  \t\t\treturn this.multiplyScalar(1 / s);\n  \t\t}\n  \t}, {\n  \t\tkey: \"divideVectors\",\n  \t\tvalue: function divideVectors(a, b) {\n\n  \t\t\tthis.x = a.x / b.x;\n  \t\t\tthis.y = a.y / b.y;\n  \t\t\tthis.z = a.z / b.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"negate\",\n  \t\tvalue: function negate() {\n\n  \t\t\tthis.x = -this.x;\n  \t\t\tthis.y = -this.y;\n  \t\t\tthis.z = -this.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"dot\",\n  \t\tvalue: function dot(v) {\n\n  \t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z;\n  \t\t}\n  \t}, {\n  \t\tkey: \"lengthSq\",\n  \t\tvalue: function lengthSq() {\n\n  \t\t\treturn this.x * this.x + this.y * this.y + this.z * this.z;\n  \t\t}\n  \t}, {\n  \t\tkey: \"length\",\n  \t\tvalue: function length() {\n\n  \t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);\n  \t\t}\n  \t}, {\n  \t\tkey: \"distanceTo\",\n  \t\tvalue: function distanceTo(v) {\n\n  \t\t\treturn Math.sqrt(this.distanceToSquared(v));\n  \t\t}\n  \t}, {\n  \t\tkey: \"distanceToSquared\",\n  \t\tvalue: function distanceToSquared(v) {\n\n  \t\t\tvar dx = this.x - v.x;\n  \t\t\tvar dy = this.y - v.y;\n  \t\t\tvar dz = this.z - v.z;\n\n  \t\t\treturn dx * dx + dy * dy + dz * dz;\n  \t\t}\n  \t}, {\n  \t\tkey: \"normalize\",\n  \t\tvalue: function normalize() {\n\n  \t\t\treturn this.divideScalar(this.length());\n  \t\t}\n  \t}, {\n  \t\tkey: \"min\",\n  \t\tvalue: function min(v) {\n\n  \t\t\tthis.x = Math.min(this.x, v.x);\n  \t\t\tthis.y = Math.min(this.y, v.y);\n  \t\t\tthis.z = Math.min(this.z, v.z);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"max\",\n  \t\tvalue: function max(v) {\n\n  \t\t\tthis.x = Math.max(this.x, v.x);\n  \t\t\tthis.y = Math.max(this.y, v.y);\n  \t\t\tthis.z = Math.max(this.z, v.z);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"clamp\",\n  \t\tvalue: function clamp(min, max) {\n\n  \t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\n  \t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\n  \t\t\tthis.z = Math.max(min.z, Math.min(max.z, this.z));\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"applyMatrix3\",\n  \t\tvalue: function applyMatrix3(m) {\n\n  \t\t\tvar x = this.x,\n  \t\t\t    y = this.y,\n  \t\t\t    z = this.z;\n  \t\t\tvar e = m.elements;\n\n  \t\t\tthis.x = e[0] * x + e[3] * y + e[6] * z;\n  \t\t\tthis.y = e[1] * x + e[4] * y + e[7] * z;\n  \t\t\tthis.z = e[2] * x + e[5] * y + e[8] * z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"applyMatrix4\",\n  \t\tvalue: function applyMatrix4(m) {\n\n  \t\t\tvar x = this.x,\n  \t\t\t    y = this.y,\n  \t\t\t    z = this.z;\n  \t\t\tvar e = m.elements;\n\n  \t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z + e[12];\n  \t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z + e[13];\n  \t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z + e[14];\n\n  \t\t\treturn this;\n  \t\t}\n  \t}]);\n  \treturn Vector3;\n  }();\n\n  var Octant = function () {\n  \tfunction Octant() {\n  \t\tvar min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();\n  \t\tvar max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();\n  \t\tclassCallCheck(this, Octant);\n\n\n  \t\tthis.min = min;\n\n  \t\tthis.max = max;\n\n  \t\tthis.children = null;\n  \t}\n\n  \tcreateClass(Octant, [{\n  \t\tkey: \"getCenter\",\n  \t\tvalue: function getCenter() {\n  \t\t\treturn this.min.clone().add(this.max).multiplyScalar(0.5);\n  \t\t}\n  \t}, {\n  \t\tkey: \"getDimensions\",\n  \t\tvalue: function getDimensions() {\n  \t\t\treturn this.max.clone().sub(this.min);\n  \t\t}\n  \t}, {\n  \t\tkey: \"split\",\n  \t\tvalue: function split(octants) {\n\n  \t\t\tvar min = this.min;\n  \t\t\tvar max = this.max;\n  \t\t\tvar mid = this.getCenter();\n\n  \t\t\tvar i = void 0,\n  \t\t\t    j = void 0;\n  \t\t\tvar l = 0;\n  \t\t\tvar combination = void 0;\n\n  \t\t\tvar halfDimensions = void 0;\n  \t\t\tvar v = void 0,\n  \t\t\t    child = void 0,\n  \t\t\t    octant = void 0;\n\n  \t\t\tif (Array.isArray(octants)) {\n\n  \t\t\t\thalfDimensions = this.getDimensions().multiplyScalar(0.5);\n  \t\t\t\tv = [new Vector3(), new Vector3(), new Vector3()];\n  \t\t\t\tl = octants.length;\n  \t\t\t}\n\n  \t\t\tthis.children = [];\n\n  \t\t\tfor (i = 0; i < 8; ++i) {\n\n  \t\t\t\tcombination = PATTERN[i];\n  \t\t\t\toctant = null;\n\n  \t\t\t\tif (l > 0) {\n\n  \t\t\t\t\tv[1].addVectors(min, v[0].fromArray(combination).multiply(halfDimensions));\n  \t\t\t\t\tv[2].addVectors(mid, v[0].fromArray(combination).multiply(halfDimensions));\n\n  \t\t\t\t\tfor (j = 0; j < l; ++j) {\n\n  \t\t\t\t\t\tchild = octants[j];\n\n  \t\t\t\t\t\tif (child !== null && v[1].equals(child.min) && v[2].equals(child.max)) {\n\n  \t\t\t\t\t\t\toctant = child;\n  \t\t\t\t\t\t\toctants[j] = null;\n\n  \t\t\t\t\t\t\tbreak;\n  \t\t\t\t\t\t}\n  \t\t\t\t\t}\n  \t\t\t\t}\n\n  \t\t\t\tthis.children.push(octant !== null ? octant : new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z)));\n  \t\t\t}\n  \t\t}\n  \t}]);\n  \treturn Octant;\n  }();\n\n  var PATTERN = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];\n\n  var EDGES = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];\n\n  var CubicOctant = function () {\n  \t\tfunction CubicOctant() {\n  \t\t\t\tvar min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();\n  \t\t\t\tvar size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n  \t\t\t\tclassCallCheck(this, CubicOctant);\n\n\n  \t\t\t\tthis.min = min;\n\n  \t\t\t\tthis.size = size;\n\n  \t\t\t\tthis.children = null;\n  \t\t}\n\n  \t\tcreateClass(CubicOctant, [{\n  \t\t\t\tkey: \"getCenter\",\n  \t\t\t\tvalue: function getCenter() {\n  \t\t\t\t\t\treturn this.min.clone().addScalar(this.size * 0.5);\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"getDimensions\",\n  \t\t\t\tvalue: function getDimensions() {\n  \t\t\t\t\t\treturn new Vector3(this.size, this.size, this.size);\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"split\",\n  \t\t\t\tvalue: function split(octants) {\n\n  \t\t\t\t\t\tvar min = this.min;\n  \t\t\t\t\t\tvar mid = this.getCenter();\n  \t\t\t\t\t\tvar halfSize = this.size * 0.5;\n\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    j = void 0;\n  \t\t\t\t\t\tvar l = 0;\n  \t\t\t\t\t\tvar combination = void 0;\n\n  \t\t\t\t\t\tvar v = void 0,\n  \t\t\t\t\t\t    child = void 0,\n  \t\t\t\t\t\t    octant = void 0;\n\n  \t\t\t\t\t\tif (Array.isArray(octants)) {\n\n  \t\t\t\t\t\t\t\tv = new Vector3();\n  \t\t\t\t\t\t\t\tl = octants.length;\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tthis.children = [];\n\n  \t\t\t\t\t\tfor (i = 0; i < 8; ++i) {\n\n  \t\t\t\t\t\t\t\tcombination = PATTERN[i];\n  \t\t\t\t\t\t\t\toctant = null;\n\n  \t\t\t\t\t\t\t\tif (l > 0) {\n\n  \t\t\t\t\t\t\t\t\t\tv.fromArray(combination).multiplyScalar(halfSize).add(min);\n\n  \t\t\t\t\t\t\t\t\t\tfor (j = 0; j < l; ++j) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\tchild = octants[j];\n\n  \t\t\t\t\t\t\t\t\t\t\t\tif (child !== null && child.size === halfSize && v.equals(child.min)) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\toctant = child;\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\toctants[j] = null;\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n  \t\t\t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\tthis.children.push(octant !== null ? octant : new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize));\n  \t\t\t\t\t\t}\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"max\",\n  \t\t\t\tget: function get$$1() {\n  \t\t\t\t\t\treturn this.min.clone().addScalar(this.size);\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn CubicOctant;\n  }();\n\n  var Box3 = function () {\n  \tfunction Box3() {\n  \t\tvar min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3(Infinity, Infinity, Infinity);\n  \t\tvar max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3(-Infinity, -Infinity, -Infinity);\n  \t\tclassCallCheck(this, Box3);\n\n\n  \t\tthis.min = min;\n\n  \t\tthis.max = max;\n  \t}\n\n  \tcreateClass(Box3, [{\n  \t\tkey: \"set\",\n  \t\tvalue: function set$$1(min, max) {\n\n  \t\t\tthis.min.copy(min);\n  \t\t\tthis.max.copy(max);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"copy\",\n  \t\tvalue: function copy(b) {\n\n  \t\t\tthis.min.copy(b.min);\n  \t\t\tthis.max.copy(b.max);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"clone\",\n  \t\tvalue: function clone() {\n\n  \t\t\treturn new this.constructor().copy(this);\n  \t\t}\n  \t}, {\n  \t\tkey: \"expandByPoint\",\n  \t\tvalue: function expandByPoint(p) {\n\n  \t\t\tthis.min.min(p);\n  \t\t\tthis.max.max(p);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"union\",\n  \t\tvalue: function union(b) {\n\n  \t\t\tthis.min.min(b.min);\n  \t\t\tthis.max.max(b.max);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"setFromPoints\",\n  \t\tvalue: function setFromPoints(points) {\n\n  \t\t\tvar i = void 0,\n  \t\t\t    l = void 0;\n\n  \t\t\tfor (i = 0, l = points.length; i < l; ++i) {\n\n  \t\t\t\tthis.expandByPoint(points[i]);\n  \t\t\t}\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"setFromCenterAndSize\",\n  \t\tvalue: function setFromCenterAndSize(center, size) {\n\n  \t\t\tvar halfSize = size.clone().multiplyScalar(0.5);\n\n  \t\t\tthis.min.copy(center).sub(halfSize);\n  \t\t\tthis.max.copy(center).add(halfSize);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"intersectsBox\",\n  \t\tvalue: function intersectsBox(box) {\n\n  \t\t\treturn !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);\n  \t\t}\n  \t}]);\n  \treturn Box3;\n  }();\n\n  var IteratorResult = function () {\n  \tfunction IteratorResult() {\n  \t\tvar value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n  \t\tvar done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n  \t\tclassCallCheck(this, IteratorResult);\n\n\n  \t\tthis.value = value;\n\n  \t\tthis.done = done;\n  \t}\n\n  \tcreateClass(IteratorResult, [{\n  \t\tkey: \"reset\",\n  \t\tvalue: function reset() {\n\n  \t\t\tthis.value = null;\n  \t\t\tthis.done = false;\n  \t\t}\n  \t}]);\n  \treturn IteratorResult;\n  }();\n\n  var BOX3$1 = new Box3();\n\n  var OctreeIterator = function () {\n  \t\tfunction OctreeIterator(octree) {\n  \t\t\t\tvar region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;\n  \t\t\t\tclassCallCheck(this, OctreeIterator);\n\n\n  \t\t\t\tthis.octree = octree;\n\n  \t\t\t\tthis.region = region;\n\n  \t\t\t\tthis.cull = region !== null;\n\n  \t\t\t\tthis.result = new IteratorResult();\n\n  \t\t\t\tthis.trace = null;\n\n  \t\t\t\tthis.indices = null;\n\n  \t\t\t\tthis.reset();\n  \t\t}\n\n  \t\tcreateClass(OctreeIterator, [{\n  \t\t\t\tkey: \"reset\",\n  \t\t\t\tvalue: function reset() {\n\n  \t\t\t\t\t\tvar root = this.octree.root;\n\n  \t\t\t\t\t\tthis.trace = [];\n  \t\t\t\t\t\tthis.indices = [];\n\n  \t\t\t\t\t\tif (root !== null) {\n\n  \t\t\t\t\t\t\t\tBOX3$1.min = root.min;\n  \t\t\t\t\t\t\t\tBOX3$1.max = root.max;\n\n  \t\t\t\t\t\t\t\tif (!this.cull || this.region.intersectsBox(BOX3$1)) {\n\n  \t\t\t\t\t\t\t\t\t\tthis.trace.push(root);\n  \t\t\t\t\t\t\t\t\t\tthis.indices.push(0);\n  \t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tthis.result.reset();\n\n  \t\t\t\t\t\treturn this;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"next\",\n  \t\t\t\tvalue: function next() {\n\n  \t\t\t\t\t\tvar cull = this.cull;\n  \t\t\t\t\t\tvar region = this.region;\n  \t\t\t\t\t\tvar indices = this.indices;\n  \t\t\t\t\t\tvar trace = this.trace;\n\n  \t\t\t\t\t\tvar octant = null;\n  \t\t\t\t\t\tvar depth = trace.length - 1;\n\n  \t\t\t\t\t\tvar index = void 0,\n  \t\t\t\t\t\t    children = void 0,\n  \t\t\t\t\t\t    child = void 0;\n\n  \t\t\t\t\t\twhile (octant === null && depth >= 0) {\n\n  \t\t\t\t\t\t\t\tindex = indices[depth];\n  \t\t\t\t\t\t\t\tchildren = trace[depth].children;\n\n  \t\t\t\t\t\t\t\t++indices[depth];\n\n  \t\t\t\t\t\t\t\tif (index < 8) {\n\n  \t\t\t\t\t\t\t\t\t\tif (children !== null) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\tchild = children[index];\n\n  \t\t\t\t\t\t\t\t\t\t\t\tif (cull) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tBOX3$1.min = child.min;\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tBOX3$1.max = child.max;\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tif (!region.intersectsBox(BOX3$1)) {\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcontinue;\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\t\t\t\t\ttrace.push(child);\n  \t\t\t\t\t\t\t\t\t\t\t\tindices.push(0);\n\n  \t\t\t\t\t\t\t\t\t\t\t\t++depth;\n  \t\t\t\t\t\t\t\t\t\t} else {\n\n  \t\t\t\t\t\t\t\t\t\t\t\toctant = trace.pop();\n  \t\t\t\t\t\t\t\t\t\t\t\tindices.pop();\n  \t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t} else {\n\n  \t\t\t\t\t\t\t\t\t\ttrace.pop();\n  \t\t\t\t\t\t\t\t\t\tindices.pop();\n\n  \t\t\t\t\t\t\t\t\t\t--depth;\n  \t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tthis.result.value = octant;\n  \t\t\t\t\t\tthis.result.done = octant === null;\n\n  \t\t\t\t\t\treturn this.result;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"return\",\n  \t\t\t\tvalue: function _return(value) {\n\n  \t\t\t\t\t\tthis.result.value = value;\n  \t\t\t\t\t\tthis.result.done = true;\n\n  \t\t\t\t\t\treturn this.result;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: Symbol.iterator,\n  \t\t\t\tvalue: function value() {\n\n  \t\t\t\t\t\treturn this;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn OctreeIterator;\n  }();\n\n  var flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);\n\n  var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];\n\n  function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {\n\n  \tvar entry = 0;\n\n  \tif (tx0 > ty0 && tx0 > tz0) {\n  \t\tif (tym < tx0) {\n  \t\t\tentry = entry | 2;\n  \t\t}\n  \t\tif (tzm < tx0) {\n  \t\t\tentry = entry | 1;\n  \t\t}\n  \t} else if (ty0 > tz0) {\n  \t\tif (txm < ty0) {\n  \t\t\tentry = entry | 4;\n  \t\t}\n  \t\tif (tzm < ty0) {\n  \t\t\tentry = entry | 1;\n  \t\t}\n  \t} else {\n  \t\tif (txm < tz0) {\n  \t\t\tentry = entry | 4;\n  \t\t}\n  \t\tif (tym < tz0) {\n  \t\t\tentry = entry | 2;\n  \t\t}\n  \t}\n\n  \treturn entry;\n  }\n\n  function findNextOctant(currentOctant, tx1, ty1, tz1) {\n\n  \tvar min = void 0;\n  \tvar exit = 0;\n\n  \tif (tx1 < ty1) {\n\n  \t\tmin = tx1;\n  \t\texit = 0;\n  \t} else {\n\n  \t\tmin = ty1;\n  \t\texit = 1;\n  \t}\n\n  \tif (tz1 < min) {\n\n  \t\texit = 2;\n  \t}\n\n  \treturn octantTable[currentOctant][exit];\n  }\n\n  function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {\n\n  \tvar children = octant.children;\n\n  \tvar currentOctant = void 0;\n  \tvar txm = void 0,\n  \t    tym = void 0,\n  \t    tzm = void 0;\n\n  \tif (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {\n\n  \t\tif (children === null) {\n  \t\t\tintersects.push(octant);\n  \t\t} else {\n  \t\t\ttxm = 0.5 * (tx0 + tx1);\n  \t\t\ttym = 0.5 * (ty0 + ty1);\n  \t\t\ttzm = 0.5 * (tz0 + tz1);\n\n  \t\t\tcurrentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);\n\n  \t\t\tdo {\n\n  \t\t\t\tswitch (currentOctant) {\n\n  \t\t\t\t\tcase 0:\n  \t\t\t\t\t\traycastOctant(children[flags[8]], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);\n  \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, tym, tzm);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase 1:\n  \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[1]], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);\n  \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, tym, tz1);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase 2:\n  \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[2]], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);\n  \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, ty1, tzm);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase 3:\n  \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[3]], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);\n  \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, txm, ty1, tz1);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase 4:\n  \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[4]], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);\n  \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, tym, tzm);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase 5:\n  \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[5]], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);\n  \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, tym, tz1);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase 6:\n  \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[6]], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);\n  \t\t\t\t\t\tcurrentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase 7:\n  \t\t\t\t\t\traycastOctant(children[flags[8] ^ flags[7]], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);\n\n  \t\t\t\t\t\tcurrentOctant = 8;\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t}\n  \t\t\t} while (currentOctant < 8);\n  \t\t}\n  \t}\n  }\n\n  var OctreeRaycaster = function () {\n  \tfunction OctreeRaycaster() {\n  \t\tclassCallCheck(this, OctreeRaycaster);\n  \t}\n\n  \tcreateClass(OctreeRaycaster, null, [{\n  \t\tkey: \"intersectOctree\",\n  \t\tvalue: function intersectOctree(octree, raycaster, intersects) {\n\n  \t\t\tvar dimensions = octree.getDimensions();\n  \t\t\tvar halfDimensions = dimensions.clone().multiplyScalar(0.5);\n\n  \t\t\tvar min = octree.min.clone().sub(octree.min);\n  \t\t\tvar max = octree.max.clone().sub(octree.min);\n\n  \t\t\tvar direction = raycaster.ray.direction.clone();\n  \t\t\tvar origin = raycaster.ray.origin.clone();\n\n  \t\t\torigin.sub(octree.getCenter()).add(halfDimensions);\n\n  \t\t\tvar invDirX = void 0,\n  \t\t\t    invDirY = void 0,\n  \t\t\t    invDirZ = void 0;\n  \t\t\tvar tx0 = void 0,\n  \t\t\t    tx1 = void 0,\n  \t\t\t    ty0 = void 0,\n  \t\t\t    ty1 = void 0,\n  \t\t\t    tz0 = void 0,\n  \t\t\t    tz1 = void 0;\n\n  \t\t\tflags[8] = flags[0];\n\n  \t\t\tif (direction.x < 0.0) {\n\n  \t\t\t\torigin.x = dimensions.x - origin.x;\n  \t\t\t\tdirection.x = -direction.x;\n  \t\t\t\tflags[8] |= flags[4];\n  \t\t\t}\n\n  \t\t\tif (direction.y < 0.0) {\n\n  \t\t\t\torigin.y = dimensions.y - origin.y;\n  \t\t\t\tdirection.y = -direction.y;\n  \t\t\t\tflags[8] |= flags[2];\n  \t\t\t}\n\n  \t\t\tif (direction.z < 0.0) {\n\n  \t\t\t\torigin.z = dimensions.z - origin.z;\n  \t\t\t\tdirection.z = -direction.z;\n  \t\t\t\tflags[8] |= flags[1];\n  \t\t\t}\n\n  \t\t\tinvDirX = 1.0 / direction.x;\n  \t\t\tinvDirY = 1.0 / direction.y;\n  \t\t\tinvDirZ = 1.0 / direction.z;\n\n  \t\t\ttx0 = (min.x - origin.x) * invDirX;\n  \t\t\ttx1 = (max.x - origin.x) * invDirX;\n  \t\t\tty0 = (min.y - origin.y) * invDirY;\n  \t\t\tty1 = (max.y - origin.y) * invDirY;\n  \t\t\ttz0 = (min.z - origin.z) * invDirZ;\n  \t\t\ttz1 = (max.z - origin.z) * invDirZ;\n\n  \t\t\tif (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {\n\n  \t\t\t\traycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);\n  \t\t\t}\n  \t\t}\n  \t}]);\n  \treturn OctreeRaycaster;\n  }();\n\n  var BOX3 = new Box3();\n\n  function _getDepth(octant) {\n\n  \tvar children = octant.children;\n\n  \tvar result = 0;\n  \tvar i = void 0,\n  \t    l = void 0,\n  \t    d = void 0;\n\n  \tif (children !== null) {\n\n  \t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\td = 1 + _getDepth(children[i]);\n\n  \t\t\tif (d > result) {\n\n  \t\t\t\tresult = d;\n  \t\t\t}\n  \t\t}\n  \t}\n\n  \treturn result;\n  }\n\n  function _cull(octant, region, result) {\n\n  \tvar children = octant.children;\n\n  \tvar i = void 0,\n  \t    l = void 0;\n\n  \tBOX3.min = octant.min;\n  \tBOX3.max = octant.max;\n\n  \tif (region.intersectsBox(BOX3)) {\n\n  \t\tif (children !== null) {\n\n  \t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\t\t_cull(children[i], region, result);\n  \t\t\t}\n  \t\t} else {\n\n  \t\t\tresult.push(octant);\n  \t\t}\n  \t}\n  }\n\n  function _findOctantsByLevel(octant, level, depth, result) {\n\n  \tvar children = octant.children;\n\n  \tvar i = void 0,\n  \t    l = void 0;\n\n  \tif (depth === level) {\n\n  \t\tresult.push(octant);\n  \t} else if (children !== null) {\n\n  \t\t++depth;\n\n  \t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\t_findOctantsByLevel(children[i], level, depth, result);\n  \t\t}\n  \t}\n  }\n\n  var Octree = function () {\n  \tfunction Octree(min, max) {\n  \t\tclassCallCheck(this, Octree);\n\n\n  \t\tthis.root = min !== undefined && max !== undefined ? new Octant(min, max) : null;\n  \t}\n\n  \tcreateClass(Octree, [{\n  \t\tkey: \"getCenter\",\n  \t\tvalue: function getCenter() {\n  \t\t\treturn this.root.getCenter();\n  \t\t}\n  \t}, {\n  \t\tkey: \"getDimensions\",\n  \t\tvalue: function getDimensions() {\n  \t\t\treturn this.root.getDimensions();\n  \t\t}\n  \t}, {\n  \t\tkey: \"getDepth\",\n  \t\tvalue: function getDepth() {\n\n  \t\t\treturn _getDepth(this.root);\n  \t\t}\n  \t}, {\n  \t\tkey: \"cull\",\n  \t\tvalue: function cull(region) {\n\n  \t\t\tvar result = [];\n\n  \t\t\t_cull(this.root, region, result);\n\n  \t\t\treturn result;\n  \t\t}\n  \t}, {\n  \t\tkey: \"findOctantsByLevel\",\n  \t\tvalue: function findOctantsByLevel(level) {\n\n  \t\t\tvar result = [];\n\n  \t\t\t_findOctantsByLevel(this.root, level, 0, result);\n\n  \t\t\treturn result;\n  \t\t}\n  \t}, {\n  \t\tkey: \"raycast\",\n  \t\tvalue: function raycast(raycaster) {\n  \t\t\tvar intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n\n\n  \t\t\tOctreeRaycaster.intersectOctree(this, raycaster, intersects);\n\n  \t\t\treturn intersects;\n  \t\t}\n  \t}, {\n  \t\tkey: \"leaves\",\n  \t\tvalue: function leaves(region) {\n\n  \t\t\treturn new OctreeIterator(this, region);\n  \t\t}\n  \t}, {\n  \t\tkey: Symbol.iterator,\n  \t\tvalue: function value() {\n\n  \t\t\treturn new OctreeIterator(this);\n  \t\t}\n  \t}, {\n  \t\tkey: \"min\",\n  \t\tget: function get$$1() {\n  \t\t\treturn this.root.min;\n  \t\t}\n  \t}, {\n  \t\tkey: \"max\",\n  \t\tget: function get$$1() {\n  \t\t\treturn this.root.max;\n  \t\t}\n  \t}, {\n  \t\tkey: \"children\",\n  \t\tget: function get$$1() {\n  \t\t\treturn this.root.children;\n  \t\t}\n  \t}]);\n  \treturn Octree;\n  }();\n\n  var PointOctant = function (_Octant) {\n  \t\tinherits(PointOctant, _Octant);\n\n  \t\tfunction PointOctant(min, max) {\n  \t\t\t\tclassCallCheck(this, PointOctant);\n\n  \t\t\t\tvar _this = possibleConstructorReturn(this, (PointOctant.__proto__ || Object.getPrototypeOf(PointOctant)).call(this, min, max));\n\n  \t\t\t\t_this.points = null;\n\n  \t\t\t\t_this.data = null;\n\n  \t\t\t\treturn _this;\n  \t\t}\n\n  \t\tcreateClass(PointOctant, [{\n  \t\t\t\tkey: \"distanceToSquared\",\n  \t\t\t\tvalue: function distanceToSquared(p) {\n\n  \t\t\t\t\t\tvar clampedPoint = p.clone().clamp(this.min, this.max);\n\n  \t\t\t\t\t\treturn clampedPoint.sub(p).lengthSq();\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"distanceToCenterSquared\",\n  \t\t\t\tvalue: function distanceToCenterSquared(p) {\n\n  \t\t\t\t\t\tvar center = this.getCenter();\n\n  \t\t\t\t\t\tvar dx = p.x - center.x;\n  \t\t\t\t\t\tvar dy = p.y - center.x;\n  \t\t\t\t\t\tvar dz = p.z - center.z;\n\n  \t\t\t\t\t\treturn dx * dx + dy * dy + dz * dz;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"contains\",\n  \t\t\t\tvalue: function contains(p, bias) {\n\n  \t\t\t\t\t\tvar min = this.min;\n  \t\t\t\t\t\tvar max = this.max;\n\n  \t\t\t\t\t\treturn p.x >= min.x - bias && p.y >= min.y - bias && p.z >= min.z - bias && p.x <= max.x + bias && p.y <= max.y + bias && p.z <= max.z + bias;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"redistribute\",\n  \t\t\t\tvalue: function redistribute(bias) {\n\n  \t\t\t\t\t\tvar children = this.children;\n  \t\t\t\t\t\tvar points = this.points;\n  \t\t\t\t\t\tvar data = this.data;\n\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    l = void 0;\n  \t\t\t\t\t\tvar child = void 0,\n  \t\t\t\t\t\t    point = void 0,\n  \t\t\t\t\t\t    entry = void 0;\n\n  \t\t\t\t\t\tif (children !== null) {\n\n  \t\t\t\t\t\t\t\twhile (points.length > 0) {\n\n  \t\t\t\t\t\t\t\t\t\tpoint = points.pop();\n  \t\t\t\t\t\t\t\t\t\tentry = data.pop();\n\n  \t\t\t\t\t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\tchild = children[i];\n\n  \t\t\t\t\t\t\t\t\t\t\t\tif (child.contains(point, bias)) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tif (child.points === null) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchild.points = [];\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tchild.data = [];\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tchild.points.push(point);\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tchild.data.push(entry);\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n  \t\t\t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tthis.points = null;\n  \t\t\t\t\t\tthis.data = null;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"merge\",\n  \t\t\t\tvalue: function merge() {\n\n  \t\t\t\t\t\tvar children = this.children;\n\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    l = void 0;\n  \t\t\t\t\t\tvar child = void 0;\n\n  \t\t\t\t\t\tif (children !== null) {\n\n  \t\t\t\t\t\t\t\tthis.points = [];\n  \t\t\t\t\t\t\t\tthis.data = [];\n\n  \t\t\t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\t\t\t\t\t\t\t\tchild = children[i];\n\n  \t\t\t\t\t\t\t\t\t\tif (child.points !== null) {\n  \t\t\t\t\t\t\t\t\t\t\t\tvar _points, _data;\n\n  \t\t\t\t\t\t\t\t\t\t\t\t(_points = this.points).push.apply(_points, toConsumableArray(child.points));\n  \t\t\t\t\t\t\t\t\t\t\t\t(_data = this.data).push.apply(_data, toConsumableArray(child.data));\n  \t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\tthis.children = null;\n  \t\t\t\t\t\t}\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn PointOctant;\n  }(Octant);\n\n  function _countPoints(octant) {\n\n  \tvar children = octant.children;\n\n  \tvar result = 0;\n  \tvar i = void 0,\n  \t    l = void 0;\n\n  \tif (children !== null) {\n\n  \t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\tresult += _countPoints(children[i]);\n  \t\t}\n  \t} else if (octant.points !== null) {\n\n  \t\tresult = octant.points.length;\n  \t}\n\n  \treturn result;\n  }\n\n  function _add(octant, p, data, depth, bias, maxPoints, maxDepth) {\n\n  \tvar children = octant.children;\n  \tvar exists = false;\n  \tvar done = false;\n  \tvar i = void 0,\n  \t    l = void 0;\n\n  \tif (octant.contains(p, bias)) {\n\n  \t\tif (children === null) {\n\n  \t\t\tif (octant.points === null) {\n\n  \t\t\t\toctant.points = [];\n  \t\t\t\toctant.data = [];\n  \t\t\t} else {\n\n  \t\t\t\tfor (i = 0, l = octant.points.length; !exists && i < l; ++i) {\n\n  \t\t\t\t\texists = octant.points[i].equals(p);\n  \t\t\t\t}\n  \t\t\t}\n\n  \t\t\tif (exists) {\n\n  \t\t\t\toctant.data[i - 1] = data;\n\n  \t\t\t\tdone = true;\n  \t\t\t} else if (octant.points.length < maxPoints || depth === maxDepth) {\n\n  \t\t\t\toctant.points.push(p.clone());\n  \t\t\t\toctant.data.push(data);\n\n  \t\t\t\tdone = true;\n  \t\t\t} else {\n\n  \t\t\t\toctant.split();\n  \t\t\t\toctant.redistribute(bias);\n  \t\t\t\tchildren = octant.children;\n  \t\t\t}\n  \t\t}\n\n  \t\tif (children !== null) {\n\n  \t\t\t++depth;\n\n  \t\t\tfor (i = 0, l = children.length; !done && i < l; ++i) {\n\n  \t\t\t\tdone = _add(children[i], p, data, depth, bias, maxPoints, maxDepth);\n  \t\t\t}\n  \t\t}\n  \t}\n\n  \treturn done;\n  }\n\n  function _remove(octant, parent, p, bias, maxPoints) {\n\n  \tvar children = octant.children;\n\n  \tvar done = false;\n\n  \tvar i = void 0,\n  \t    l = void 0;\n  \tvar points = void 0,\n  \t    data = void 0,\n  \t    last = void 0;\n\n  \tif (octant.contains(p, bias)) {\n\n  \t\tif (children !== null) {\n\n  \t\t\tfor (i = 0, l = children.length; !done && i < l; ++i) {\n\n  \t\t\t\tdone = _remove(children[i], octant, p, bias, maxPoints);\n  \t\t\t}\n  \t\t} else if (octant.points !== null) {\n\n  \t\t\tpoints = octant.points;\n  \t\t\tdata = octant.data;\n\n  \t\t\tfor (i = 0, l = points.length; !done && i < l; ++i) {\n\n  \t\t\t\tif (points[i].equals(p)) {\n\n  \t\t\t\t\tlast = l - 1;\n\n  \t\t\t\t\tif (i < last) {\n  \t\t\t\t\t\tpoints[i] = points[last];\n  \t\t\t\t\t\tdata[i] = data[last];\n  \t\t\t\t\t}\n\n  \t\t\t\t\tpoints.pop();\n  \t\t\t\t\tdata.pop();\n\n  \t\t\t\t\tif (parent !== null && _countPoints(parent) <= maxPoints) {\n\n  \t\t\t\t\t\tparent.merge();\n  \t\t\t\t\t}\n\n  \t\t\t\t\tdone = true;\n  \t\t\t\t}\n  \t\t\t}\n  \t\t}\n  \t}\n\n  \treturn done;\n  }\n\n  function _fetch(octant, p, bias, biasSquared) {\n\n  \tvar children = octant.children;\n\n  \tvar result = null;\n\n  \tvar i = void 0,\n  \t    l = void 0;\n  \tvar points = void 0;\n\n  \tif (octant.contains(p, bias)) {\n\n  \t\tif (children !== null) {\n\n  \t\t\tfor (i = 0, l = children.length; result === null && i < l; ++i) {\n\n  \t\t\t\tresult = _fetch(children[i], p, bias, biasSquared);\n  \t\t\t}\n  \t\t} else {\n\n  \t\t\tpoints = octant.points;\n\n  \t\t\tfor (i = 0, l = points.length; result === null && i < l; ++i) {\n\n  \t\t\t\tif (p.distanceToSquared(points[i]) <= biasSquared) {\n\n  \t\t\t\t\tresult = octant.data[i];\n  \t\t\t\t}\n  \t\t\t}\n  \t\t}\n  \t}\n\n  \treturn result;\n  }\n\n  function _findNearestPoint(octant, p, maxDistance, skipSelf) {\n\n  \tvar points = octant.points;\n  \tvar children = octant.children;\n\n  \tvar result = null;\n  \tvar bestDist = maxDistance;\n\n  \tvar i = void 0,\n  \t    l = void 0;\n  \tvar point = void 0,\n  \t    distSq = void 0;\n\n  \tvar sortedChildren = void 0;\n  \tvar child = void 0,\n  \t    childResult = void 0;\n\n  \tif (children !== null) {\n  \t\tsortedChildren = children.map(function (child) {\n  \t\t\treturn {\n  \t\t\t\toctant: child,\n  \t\t\t\tdistance: child.distanceToCenterSquared(p)\n  \t\t\t};\n  \t\t}).sort(function (a, b) {\n  \t\t\treturn a.distance - b.distance;\n  \t\t});\n\n  \t\tfor (i = 0, l = sortedChildren.length; i < l; ++i) {\n  \t\t\tchild = sortedChildren[i].octant;\n\n  \t\t\tif (child.contains(p, bestDist)) {\n\n  \t\t\t\tchildResult = _findNearestPoint(child, p, bestDist, skipSelf);\n\n  \t\t\t\tif (childResult !== null) {\n\n  \t\t\t\t\tdistSq = childResult.point.distanceToSquared(p);\n\n  \t\t\t\t\tif ((!skipSelf || distSq > 0.0) && distSq < bestDist) {\n\n  \t\t\t\t\t\tbestDist = distSq;\n  \t\t\t\t\t\tresult = childResult;\n  \t\t\t\t\t}\n  \t\t\t\t}\n  \t\t\t}\n  \t\t}\n  \t} else if (points !== null) {\n\n  \t\tfor (i = 0, l = points.length; i < l; ++i) {\n\n  \t\t\tpoint = points[i];\n  \t\t\tdistSq = p.distanceToSquared(point);\n\n  \t\t\tif ((!skipSelf || distSq > 0.0) && distSq < bestDist) {\n\n  \t\t\t\tbestDist = distSq;\n\n  \t\t\t\tresult = {\n  \t\t\t\t\tpoint: point.clone(),\n  \t\t\t\t\tdata: octant.data[i]\n  \t\t\t\t};\n  \t\t\t}\n  \t\t}\n  \t}\n\n  \treturn result;\n  }\n\n  function _findPoints(octant, p, r, skipSelf, result) {\n\n  \tvar points = octant.points;\n  \tvar children = octant.children;\n  \tvar rSq = r * r;\n\n  \tvar i = void 0,\n  \t    l = void 0;\n\n  \tvar point = void 0,\n  \t    distSq = void 0;\n  \tvar child = void 0;\n\n  \tif (children !== null) {\n\n  \t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\tchild = children[i];\n\n  \t\t\tif (child.contains(p, r)) {\n\n  \t\t\t\t_findPoints(child, p, r, skipSelf, result);\n  \t\t\t}\n  \t\t}\n  \t} else if (points !== null) {\n\n  \t\tfor (i = 0, l = points.length; i < l; ++i) {\n\n  \t\t\tpoint = points[i];\n  \t\t\tdistSq = p.distanceToSquared(point);\n\n  \t\t\tif ((!skipSelf || distSq > 0.0) && distSq <= rSq) {\n\n  \t\t\t\tresult.push({\n  \t\t\t\t\tpoint: point.clone(),\n  \t\t\t\t\tdata: octant.data[i]\n  \t\t\t\t});\n  \t\t\t}\n  \t\t}\n  \t}\n  }\n\n  var PointOctree = function (_Octree) {\n  \tinherits(PointOctree, _Octree);\n\n  \tfunction PointOctree(min, max) {\n  \t\tvar bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;\n  \t\tvar maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;\n  \t\tvar maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;\n  \t\tclassCallCheck(this, PointOctree);\n\n  \t\tvar _this = possibleConstructorReturn(this, (PointOctree.__proto__ || Object.getPrototypeOf(PointOctree)).call(this));\n\n  \t\t_this.root = new PointOctant(min, max);\n\n  \t\t_this.bias = Math.max(0.0, bias);\n\n  \t\t_this.biasSquared = _this.bias * _this.bias;\n\n  \t\t_this.maxPoints = Math.max(1, Math.round(maxPoints));\n\n  \t\t_this.maxDepth = Math.max(0, Math.round(maxDepth));\n\n  \t\treturn _this;\n  \t}\n\n  \tcreateClass(PointOctree, [{\n  \t\tkey: \"countPoints\",\n  \t\tvalue: function countPoints() {\n\n  \t\t\treturn _countPoints(this.root);\n  \t\t}\n  \t}, {\n  \t\tkey: \"add\",\n  \t\tvalue: function add(p, data) {\n\n  \t\t\t_add(this.root, p, data, 0, this.bias, this.maxPoints, this.maxDepth);\n  \t\t}\n  \t}, {\n  \t\tkey: \"remove\",\n  \t\tvalue: function remove(p) {\n\n  \t\t\t_remove(this.root, null, p, this.bias, this.maxPoints);\n  \t\t}\n  \t}, {\n  \t\tkey: \"fetch\",\n  \t\tvalue: function fetch(p) {\n\n  \t\t\treturn _fetch(this.root, p, this.bias, this.biasSquared);\n  \t\t}\n  \t}, {\n  \t\tkey: \"findNearestPoint\",\n  \t\tvalue: function findNearestPoint(p) {\n  \t\t\tvar maxDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;\n  \t\t\tvar skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n\n\n  \t\t\treturn _findNearestPoint(this.root, p, maxDistance, skipSelf);\n  \t\t}\n  \t}, {\n  \t\tkey: \"findPoints\",\n  \t\tvalue: function findPoints(p, r) {\n  \t\t\tvar skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;\n\n\n  \t\t\tvar result = [];\n\n  \t\t\t_findPoints(this.root, p, r, skipSelf, result);\n\n  \t\t\treturn result;\n  \t\t}\n  \t}, {\n  \t\tkey: \"raycast\",\n  \t\tvalue: function raycast(raycaster) {\n  \t\t\tvar intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n\n\n  \t\t\tvar octants = get(PointOctree.prototype.__proto__ || Object.getPrototypeOf(PointOctree.prototype), \"raycast\", this).call(this, raycaster);\n\n  \t\t\tif (octants.length > 0) {\n  \t\t\t\tthis.testPoints(octants, raycaster, intersects);\n  \t\t\t}\n\n  \t\t\treturn intersects;\n  \t\t}\n  \t}, {\n  \t\tkey: \"testPoints\",\n  \t\tvalue: function testPoints(octants, raycaster, intersects) {\n\n  \t\t\tvar threshold = raycaster.params.Points.threshold;\n  \t\t\tvar thresholdSq = threshold * threshold;\n\n  \t\t\tvar intersectPoint = void 0;\n  \t\t\tvar distance = void 0,\n  \t\t\t    distanceToRay = void 0;\n  \t\t\tvar rayPointDistanceSq = void 0;\n\n  \t\t\tvar i = void 0,\n  \t\t\t    j = void 0,\n  \t\t\t    il = void 0,\n  \t\t\t    jl = void 0;\n  \t\t\tvar octant = void 0,\n  \t\t\t    points = void 0,\n  \t\t\t    point = void 0;\n\n  \t\t\tfor (i = 0, il = octants.length; i < il; ++i) {\n\n  \t\t\t\toctant = octants[i];\n  \t\t\t\tpoints = octant.points;\n\n  \t\t\t\tif (points !== null) {\n\n  \t\t\t\t\tfor (j = 0, jl = points.length; j < jl; ++j) {\n\n  \t\t\t\t\t\tpoint = points[j];\n  \t\t\t\t\t\trayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);\n\n  \t\t\t\t\t\tif (rayPointDistanceSq < thresholdSq) {\n\n  \t\t\t\t\t\t\tintersectPoint = raycaster.ray.closestPointToPoint(point);\n  \t\t\t\t\t\t\tdistance = raycaster.ray.origin.distanceTo(intersectPoint);\n\n  \t\t\t\t\t\t\tif (distance >= raycaster.near && distance <= raycaster.far) {\n\n  \t\t\t\t\t\t\t\tdistanceToRay = Math.sqrt(rayPointDistanceSq);\n\n  \t\t\t\t\t\t\t\tintersects.push({\n  \t\t\t\t\t\t\t\t\tdistance: distance,\n  \t\t\t\t\t\t\t\t\tdistanceToRay: distanceToRay,\n  \t\t\t\t\t\t\t\t\tpoint: intersectPoint.clone(),\n  \t\t\t\t\t\t\t\t\tobject: octant.data[j]\n  \t\t\t\t\t\t\t\t});\n  \t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n  \t\t\t\t\t}\n  \t\t\t\t}\n  \t\t\t}\n  \t\t}\n  \t}]);\n  \treturn PointOctree;\n  }(Octree);\n\n  var Material = {\n\n    AIR: 0,\n    SOLID: 1\n\n  };\n\n  var Vector3$1 = function () {\n  \tfunction Vector3() {\n  \t\tvar x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;\n  \t\tvar y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n  \t\tvar z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n  \t\tclassCallCheck(this, Vector3);\n\n\n  \t\tthis.x = x;\n\n  \t\tthis.y = y;\n\n  \t\tthis.z = z;\n  \t}\n\n  \tcreateClass(Vector3, [{\n  \t\tkey: \"set\",\n  \t\tvalue: function set$$1(x, y, z) {\n\n  \t\t\tthis.x = x;\n  \t\t\tthis.y = y;\n  \t\t\tthis.z = z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"copy\",\n  \t\tvalue: function copy(v) {\n\n  \t\t\tthis.x = v.x;\n  \t\t\tthis.y = v.y;\n  \t\t\tthis.z = v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"fromArray\",\n  \t\tvalue: function fromArray(array) {\n  \t\t\tvar offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n\n  \t\t\tthis.x = array[offset];\n  \t\t\tthis.y = array[offset + 1];\n  \t\t\tthis.z = array[offset + 2];\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"toArray\",\n  \t\tvalue: function toArray$$1() {\n  \t\t\tvar array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n  \t\t\tvar offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n\n  \t\t\tarray[offset] = this.x;\n  \t\t\tarray[offset + 1] = this.y;\n  \t\t\tarray[offset + 2] = this.z;\n\n  \t\t\treturn array;\n  \t\t}\n  \t}, {\n  \t\tkey: \"equals\",\n  \t\tvalue: function equals(v) {\n\n  \t\t\treturn v.x === this.x && v.y === this.y && v.z === this.z;\n  \t\t}\n  \t}, {\n  \t\tkey: \"clone\",\n  \t\tvalue: function clone() {\n\n  \t\t\treturn new this.constructor(this.x, this.y, this.z);\n  \t\t}\n  \t}, {\n  \t\tkey: \"add\",\n  \t\tvalue: function add(v) {\n\n  \t\t\tthis.x += v.x;\n  \t\t\tthis.y += v.y;\n  \t\t\tthis.z += v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"addScaledVector\",\n  \t\tvalue: function addScaledVector(v, s) {\n\n  \t\t\tthis.x += v.x * s;\n  \t\t\tthis.y += v.y * s;\n  \t\t\tthis.z += v.z * s;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"addScalar\",\n  \t\tvalue: function addScalar(s) {\n\n  \t\t\tthis.x += s;\n  \t\t\tthis.y += s;\n  \t\t\tthis.z += s;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"addVectors\",\n  \t\tvalue: function addVectors(a, b) {\n\n  \t\t\tthis.x = a.x + b.x;\n  \t\t\tthis.y = a.y + b.y;\n  \t\t\tthis.z = a.z + b.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"sub\",\n  \t\tvalue: function sub(v) {\n\n  \t\t\tthis.x -= v.x;\n  \t\t\tthis.y -= v.y;\n  \t\t\tthis.z -= v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"subScalar\",\n  \t\tvalue: function subScalar(s) {\n\n  \t\t\tthis.x -= s;\n  \t\t\tthis.y -= s;\n  \t\t\tthis.z -= s;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"subVectors\",\n  \t\tvalue: function subVectors(a, b) {\n\n  \t\t\tthis.x = a.x - b.x;\n  \t\t\tthis.y = a.y - b.y;\n  \t\t\tthis.z = a.z - b.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"multiply\",\n  \t\tvalue: function multiply(v) {\n\n  \t\t\tthis.x *= v.x;\n  \t\t\tthis.y *= v.y;\n  \t\t\tthis.z *= v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"multiplyScalar\",\n  \t\tvalue: function multiplyScalar(s) {\n\n  \t\t\tif (isFinite(s)) {\n\n  \t\t\t\tthis.x *= s;\n  \t\t\t\tthis.y *= s;\n  \t\t\t\tthis.z *= s;\n  \t\t\t} else {\n\n  \t\t\t\tthis.x = 0;\n  \t\t\t\tthis.y = 0;\n  \t\t\t\tthis.z = 0;\n  \t\t\t}\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"multiplyVectors\",\n  \t\tvalue: function multiplyVectors(a, b) {\n\n  \t\t\tthis.x = a.x * b.x;\n  \t\t\tthis.y = a.y * b.y;\n  \t\t\tthis.z = a.z * b.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"divide\",\n  \t\tvalue: function divide(v) {\n\n  \t\t\tthis.x /= v.x;\n  \t\t\tthis.y /= v.y;\n  \t\t\tthis.z /= v.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"divideScalar\",\n  \t\tvalue: function divideScalar(s) {\n\n  \t\t\treturn this.multiplyScalar(1 / s);\n  \t\t}\n  \t}, {\n  \t\tkey: \"divideVectors\",\n  \t\tvalue: function divideVectors(a, b) {\n\n  \t\t\tthis.x = a.x / b.x;\n  \t\t\tthis.y = a.y / b.y;\n  \t\t\tthis.z = a.z / b.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"negate\",\n  \t\tvalue: function negate() {\n\n  \t\t\tthis.x = -this.x;\n  \t\t\tthis.y = -this.y;\n  \t\t\tthis.z = -this.z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"dot\",\n  \t\tvalue: function dot(v) {\n\n  \t\t\treturn this.x * v.x + this.y * v.y + this.z * v.z;\n  \t\t}\n  \t}, {\n  \t\tkey: \"lengthSq\",\n  \t\tvalue: function lengthSq() {\n\n  \t\t\treturn this.x * this.x + this.y * this.y + this.z * this.z;\n  \t\t}\n  \t}, {\n  \t\tkey: \"length\",\n  \t\tvalue: function length() {\n\n  \t\t\treturn Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);\n  \t\t}\n  \t}, {\n  \t\tkey: \"distanceTo\",\n  \t\tvalue: function distanceTo(v) {\n\n  \t\t\treturn Math.sqrt(this.distanceToSquared(v));\n  \t\t}\n  \t}, {\n  \t\tkey: \"distanceToSquared\",\n  \t\tvalue: function distanceToSquared(v) {\n\n  \t\t\tvar dx = this.x - v.x;\n  \t\t\tvar dy = this.y - v.y;\n  \t\t\tvar dz = this.z - v.z;\n\n  \t\t\treturn dx * dx + dy * dy + dz * dz;\n  \t\t}\n  \t}, {\n  \t\tkey: \"normalize\",\n  \t\tvalue: function normalize() {\n\n  \t\t\treturn this.divideScalar(this.length());\n  \t\t}\n  \t}, {\n  \t\tkey: \"min\",\n  \t\tvalue: function min(v) {\n\n  \t\t\tthis.x = Math.min(this.x, v.x);\n  \t\t\tthis.y = Math.min(this.y, v.y);\n  \t\t\tthis.z = Math.min(this.z, v.z);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"max\",\n  \t\tvalue: function max(v) {\n\n  \t\t\tthis.x = Math.max(this.x, v.x);\n  \t\t\tthis.y = Math.max(this.y, v.y);\n  \t\t\tthis.z = Math.max(this.z, v.z);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"clamp\",\n  \t\tvalue: function clamp(min, max) {\n\n  \t\t\tthis.x = Math.max(min.x, Math.min(max.x, this.x));\n  \t\t\tthis.y = Math.max(min.y, Math.min(max.y, this.y));\n  \t\t\tthis.z = Math.max(min.z, Math.min(max.z, this.z));\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"applyMatrix3\",\n  \t\tvalue: function applyMatrix3(m) {\n\n  \t\t\tvar x = this.x,\n  \t\t\t    y = this.y,\n  \t\t\t    z = this.z;\n  \t\t\tvar e = m.elements;\n\n  \t\t\tthis.x = e[0] * x + e[3] * y + e[6] * z;\n  \t\t\tthis.y = e[1] * x + e[4] * y + e[7] * z;\n  \t\t\tthis.z = e[2] * x + e[5] * y + e[8] * z;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"applyMatrix4\",\n  \t\tvalue: function applyMatrix4(m) {\n\n  \t\t\tvar x = this.x,\n  \t\t\t    y = this.y,\n  \t\t\t    z = this.z;\n  \t\t\tvar e = m.elements;\n\n  \t\t\tthis.x = e[0] * x + e[4] * y + e[8] * z + e[12];\n  \t\t\tthis.y = e[1] * x + e[5] * y + e[9] * z + e[13];\n  \t\t\tthis.z = e[2] * x + e[6] * y + e[10] * z + e[14];\n\n  \t\t\treturn this;\n  \t\t}\n  \t}]);\n  \treturn Vector3;\n  }();\n\n  var SymmetricMatrix3 = function () {\n  \tfunction SymmetricMatrix3() {\n  \t\tclassCallCheck(this, SymmetricMatrix3);\n\n\n  \t\tthis.elements = new Float32Array([1, 0, 0, 1, 0, 1]);\n  \t}\n\n  \tcreateClass(SymmetricMatrix3, [{\n  \t\tkey: \"set\",\n  \t\tvalue: function set$$1(m00, m01, m02, m11, m12, m22) {\n\n  \t\t\tvar e = this.elements;\n\n  \t\t\te[0] = m00;e[1] = m01;e[2] = m02;\n  \t\t\te[3] = m11;e[4] = m12;\n  \t\t\te[5] = m22;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"identity\",\n  \t\tvalue: function identity() {\n\n  \t\t\tthis.set(1, 0, 0, 1, 0, 1);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"copy\",\n  \t\tvalue: function copy(m) {\n\n  \t\t\tvar me = m.elements;\n\n  \t\t\tthis.set(me[0], me[1], me[2], me[3], me[4], me[5]);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"clone\",\n  \t\tvalue: function clone() {\n\n  \t\t\treturn new this.constructor().copy(this);\n  \t\t}\n  \t}, {\n  \t\tkey: \"add\",\n  \t\tvalue: function add(m) {\n\n  \t\t\tvar te = this.elements;\n  \t\t\tvar me = m.elements;\n\n  \t\t\tte[0] += me[0];te[1] += me[1];te[2] += me[2];\n  \t\t\tte[3] += me[3];te[4] += me[4];\n  \t\t\tte[5] += me[5];\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"norm\",\n  \t\tvalue: function norm() {\n\n  \t\t\tvar e = this.elements;\n\n  \t\t\tvar m01m01 = e[1] * e[1];\n  \t\t\tvar m02m02 = e[2] * e[2];\n  \t\t\tvar m12m12 = e[4] * e[4];\n\n  \t\t\treturn Math.sqrt(e[0] * e[0] + m01m01 + m02m02 + m01m01 + e[3] * e[3] + m12m12 + m02m02 + m12m12 + e[5] * e[5]);\n  \t\t}\n  \t}, {\n  \t\tkey: \"off\",\n  \t\tvalue: function off() {\n\n  \t\t\tvar e = this.elements;\n\n  \t\t\treturn Math.sqrt(2 * (e[1] * e[1] + e[2] * e[2] + e[4] * e[4]));\n  \t\t}\n  \t}, {\n  \t\tkey: \"applyToVector3\",\n  \t\tvalue: function applyToVector3(v) {\n\n  \t\t\tvar x = v.x,\n  \t\t\t    y = v.y,\n  \t\t\t    z = v.z;\n  \t\t\tvar e = this.elements;\n\n  \t\t\tv.x = e[0] * x + e[1] * y + e[2] * z;\n  \t\t\tv.y = e[1] * x + e[3] * y + e[4] * z;\n  \t\t\tv.z = e[2] * x + e[4] * y + e[5] * z;\n\n  \t\t\treturn v;\n  \t\t}\n  \t}]);\n  \treturn SymmetricMatrix3;\n  }();\n\n  var QEFData = function () {\n  \t\tfunction QEFData() {\n  \t\t\t\tclassCallCheck(this, QEFData);\n\n\n  \t\t\t\tthis.ata = new SymmetricMatrix3();\n\n  \t\t\t\tthis.ata.set(0, 0, 0, 0, 0, 0);\n\n  \t\t\t\tthis.atb = new Vector3$1();\n\n  \t\t\t\tthis.btb = 0;\n\n  \t\t\t\tthis.massPoint = new Vector3$1();\n\n  \t\t\t\tthis.numPoints = 0;\n\n  \t\t\t\tthis.massPointDimension = 0;\n  \t\t}\n\n  \t\tcreateClass(QEFData, [{\n  \t\t\t\tkey: \"set\",\n  \t\t\t\tvalue: function set$$1(ata, atb, btb, massPoint, numPoints) {\n\n  \t\t\t\t\t\tthis.ata.copy(ata);\n  \t\t\t\t\t\tthis.atb.copy(atb);\n  \t\t\t\t\t\tthis.btb = btb;\n\n  \t\t\t\t\t\tthis.massPoint.copy(massPoint);\n  \t\t\t\t\t\tthis.numPoints = numPoints;\n\n  \t\t\t\t\t\treturn this;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"copy\",\n  \t\t\t\tvalue: function copy(d) {\n\n  \t\t\t\t\t\treturn this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"add\",\n  \t\t\t\tvalue: function add(p, n) {\n\n  \t\t\t\t\t\tvar nx = n.x;\n  \t\t\t\t\t\tvar ny = n.y;\n  \t\t\t\t\t\tvar nz = n.z;\n\n  \t\t\t\t\t\tvar dot = n.dot(p);\n\n  \t\t\t\t\t\tvar ata = this.ata.elements;\n  \t\t\t\t\t\tvar atb = this.atb;\n\n  \t\t\t\t\t\tata[0] += nx * nx;ata[1] += nx * ny;ata[2] += nx * nz;\n  \t\t\t\t\t\tata[3] += ny * ny;ata[4] += ny * nz;\n  \t\t\t\t\t\tata[5] += nz * nz;\n\n  \t\t\t\t\t\tatb.x += dot * nx;\n  \t\t\t\t\t\tatb.y += dot * ny;\n  \t\t\t\t\t\tatb.z += dot * nz;\n\n  \t\t\t\t\t\tthis.btb += dot * dot;\n\n  \t\t\t\t\t\tthis.massPoint.add(p);\n\n  \t\t\t\t\t\t++this.numPoints;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"addData\",\n  \t\t\t\tvalue: function addData(d) {\n\n  \t\t\t\t\t\tthis.ata.add(d.ata);\n  \t\t\t\t\t\tthis.atb.add(d.atb);\n  \t\t\t\t\t\tthis.btb += d.btb;\n\n  \t\t\t\t\t\tthis.massPoint.add(d.massPoint);\n  \t\t\t\t\t\tthis.numPoints += d.numPoints;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"clear\",\n  \t\t\t\tvalue: function clear() {\n\n  \t\t\t\t\t\tthis.ata.set(0, 0, 0, 0, 0, 0);\n\n  \t\t\t\t\t\tthis.atb.set(0, 0, 0);\n  \t\t\t\t\t\tthis.btb = 0;\n\n  \t\t\t\t\t\tthis.massPoint.set(0, 0, 0);\n  \t\t\t\t\t\tthis.numPoints = 0;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"clone\",\n  \t\t\t\tvalue: function clone() {\n\n  \t\t\t\t\t\treturn new this.constructor().copy(this);\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn QEFData;\n  }();\n\n  var Matrix3 = function () {\n  \tfunction Matrix3() {\n  \t\tclassCallCheck(this, Matrix3);\n\n\n  \t\tthis.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);\n  \t}\n\n  \tcreateClass(Matrix3, [{\n  \t\tkey: \"set\",\n  \t\tvalue: function set$$1(m00, m01, m02, m10, m11, m12, m20, m21, m22) {\n\n  \t\t\tvar te = this.elements;\n\n  \t\t\tte[0] = m00;te[3] = m01;te[6] = m02;\n  \t\t\tte[1] = m10;te[4] = m11;te[7] = m12;\n  \t\t\tte[2] = m20;te[5] = m21;te[8] = m22;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"identity\",\n  \t\tvalue: function identity() {\n\n  \t\t\tthis.set(1, 0, 0, 0, 1, 0, 0, 0, 1);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"copy\",\n  \t\tvalue: function copy(m) {\n\n  \t\t\tvar me = m.elements;\n\n  \t\t\treturn this.set(me[0], me[3], me[6], me[1], me[4], me[7], me[2], me[5], me[8]);\n  \t\t}\n  \t}, {\n  \t\tkey: \"clone\",\n  \t\tvalue: function clone() {\n\n  \t\t\treturn new this.constructor().copy(this);\n  \t\t}\n  \t}]);\n  \treturn Matrix3;\n  }();\n\n  var Givens = function () {\n  \t\tfunction Givens() {\n  \t\t\t\tclassCallCheck(this, Givens);\n  \t\t}\n\n  \t\tcreateClass(Givens, null, [{\n  \t\t\t\tkey: \"rot01Post\",\n  \t\t\t\tvalue: function rot01Post(m, coefficients) {\n\n  \t\t\t\t\t\tvar e = m.elements;\n\n  \t\t\t\t\t\tvar m00 = e[0],\n  \t\t\t\t\t\t    m01 = e[3];\n  \t\t\t\t\t\tvar m10 = e[1],\n  \t\t\t\t\t\t    m11 = e[4];\n  \t\t\t\t\t\tvar m20 = e[2],\n  \t\t\t\t\t\t    m21 = e[5];\n\n  \t\t\t\t\t\tvar c = coefficients.c;\n  \t\t\t\t\t\tvar s = coefficients.s;\n\n  \t\t\t\t\t\te[0] = c * m00 - s * m01;\n  \t\t\t\t\t\te[3] = s * m00 + c * m01;\n\n\n  \t\t\t\t\t\te[1] = c * m10 - s * m11;\n  \t\t\t\t\t\te[4] = s * m10 + c * m11;\n\n\n  \t\t\t\t\t\te[2] = c * m20 - s * m21;\n  \t\t\t\t\t\te[5] = s * m20 + c * m21;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"rot02Post\",\n  \t\t\t\tvalue: function rot02Post(m, coefficients) {\n\n  \t\t\t\t\t\tvar e = m.elements;\n\n  \t\t\t\t\t\tvar m00 = e[0],\n  \t\t\t\t\t\t    m02 = e[6];\n  \t\t\t\t\t\tvar m10 = e[1],\n  \t\t\t\t\t\t    m12 = e[7];\n  \t\t\t\t\t\tvar m20 = e[2],\n  \t\t\t\t\t\t    m22 = e[8];\n\n  \t\t\t\t\t\tvar c = coefficients.c;\n  \t\t\t\t\t\tvar s = coefficients.s;\n\n  \t\t\t\t\t\te[0] = c * m00 - s * m02;\n\n  \t\t\t\t\t\te[6] = s * m00 + c * m02;\n\n  \t\t\t\t\t\te[1] = c * m10 - s * m12;\n\n  \t\t\t\t\t\te[7] = s * m10 + c * m12;\n\n  \t\t\t\t\t\te[2] = c * m20 - s * m22;\n\n  \t\t\t\t\t\te[8] = s * m20 + c * m22;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"rot12Post\",\n  \t\t\t\tvalue: function rot12Post(m, coefficients) {\n\n  \t\t\t\t\t\tvar e = m.elements;\n\n  \t\t\t\t\t\tvar m01 = e[3],\n  \t\t\t\t\t\t    m02 = e[6];\n  \t\t\t\t\t\tvar m11 = e[4],\n  \t\t\t\t\t\t    m12 = e[7];\n  \t\t\t\t\t\tvar m21 = e[5],\n  \t\t\t\t\t\t    m22 = e[8];\n\n  \t\t\t\t\t\tvar c = coefficients.c;\n  \t\t\t\t\t\tvar s = coefficients.s;\n\n  \t\t\t\t\t\te[3] = c * m01 - s * m02;\n  \t\t\t\t\t\te[6] = s * m01 + c * m02;\n\n  \t\t\t\t\t\te[4] = c * m11 - s * m12;\n  \t\t\t\t\t\te[7] = s * m11 + c * m12;\n\n  \t\t\t\t\t\te[5] = c * m21 - s * m22;\n  \t\t\t\t\t\te[8] = s * m21 + c * m22;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Givens;\n  }();\n\n  var coefficients = {\n  \t\tc: 0.0,\n  \t\ts: 0.0\n  };\n\n  function calculateSymmetricCoefficients(aPP, aPQ, aQQ) {\n\n  \t\tvar tau = void 0,\n  \t\t    stt = void 0,\n  \t\t    tan = void 0;\n\n  \t\tif (aPQ === 0) {\n\n  \t\t\t\tcoefficients.c = 1;\n  \t\t\t\tcoefficients.s = 0;\n  \t\t} else {\n\n  \t\t\t\ttau = (aQQ - aPP) / (2.0 * aPQ);\n  \t\t\t\tstt = Math.sqrt(1.0 + tau * tau);\n  \t\t\t\ttan = 1.0 / (tau >= 0.0 ? tau + stt : tau - stt);\n\n  \t\t\t\tcoefficients.c = 1.0 / Math.sqrt(1.0 + tan * tan);\n  \t\t\t\tcoefficients.s = tan * coefficients.c;\n  \t\t}\n  }\n\n  var Schur = function () {\n  \t\tfunction Schur() {\n  \t\t\t\tclassCallCheck(this, Schur);\n  \t\t}\n\n  \t\tcreateClass(Schur, null, [{\n  \t\t\t\tkey: \"rot01\",\n  \t\t\t\tvalue: function rot01(m) {\n\n  \t\t\t\t\t\tvar e = m.elements;\n\n  \t\t\t\t\t\tvar m00 = e[0],\n  \t\t\t\t\t\t    m01 = e[1],\n  \t\t\t\t\t\t    m02 = e[2];\n  \t\t\t\t\t\tvar m11 = e[3],\n  \t\t\t\t\t\t    m12 = e[4];\n\n  \t\t\t\t\t\tcalculateSymmetricCoefficients(m00, m01, m11);\n\n  \t\t\t\t\t\tvar c = coefficients.c,\n  \t\t\t\t\t\t    s = coefficients.s;\n  \t\t\t\t\t\tvar cc = c * c,\n  \t\t\t\t\t\t    ss = s * s;\n\n  \t\t\t\t\t\tvar mix = 2.0 * c * s * m01;\n\n  \t\t\t\t\t\te[0] = cc * m00 - mix + ss * m11;\n  \t\t\t\t\t\te[1] = 0;\n  \t\t\t\t\t\te[2] = c * m02 - s * m12;\n\n  \t\t\t\t\t\te[3] = ss * m00 + mix + cc * m11;\n  \t\t\t\t\t\te[4] = s * m02 + c * m12;\n\n  \t\t\t\t\t\treturn coefficients;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"rot02\",\n  \t\t\t\tvalue: function rot02(m) {\n\n  \t\t\t\t\t\tvar e = m.elements;\n\n  \t\t\t\t\t\tvar m00 = e[0],\n  \t\t\t\t\t\t    m01 = e[1],\n  \t\t\t\t\t\t    m02 = e[2];\n  \t\t\t\t\t\tvar m12 = e[4];\n  \t\t\t\t\t\tvar m22 = e[5];\n\n  \t\t\t\t\t\tcalculateSymmetricCoefficients(m00, m02, m22);\n\n  \t\t\t\t\t\tvar c = coefficients.c,\n  \t\t\t\t\t\t    s = coefficients.s;\n  \t\t\t\t\t\tvar cc = c * c,\n  \t\t\t\t\t\t    ss = s * s;\n\n  \t\t\t\t\t\tvar mix = 2.0 * c * s * m02;\n\n  \t\t\t\t\t\te[0] = cc * m00 - mix + ss * m22;\n  \t\t\t\t\t\te[1] = c * m01 - s * m12;\n  \t\t\t\t\t\te[2] = 0;\n\n  \t\t\t\t\t\te[4] = s * m01 + c * m12;\n\n  \t\t\t\t\t\te[5] = ss * m00 + mix + cc * m22;\n\n  \t\t\t\t\t\treturn coefficients;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"rot12\",\n  \t\t\t\tvalue: function rot12(m) {\n\n  \t\t\t\t\t\tvar e = m.elements;\n\n  \t\t\t\t\t\tvar m01 = e[1],\n  \t\t\t\t\t\t    m02 = e[2];\n  \t\t\t\t\t\tvar m11 = e[3],\n  \t\t\t\t\t\t    m12 = e[4];\n  \t\t\t\t\t\tvar m22 = e[5];\n\n  \t\t\t\t\t\tcalculateSymmetricCoefficients(m11, m12, m22);\n\n  \t\t\t\t\t\tvar c = coefficients.c,\n  \t\t\t\t\t\t    s = coefficients.s;\n  \t\t\t\t\t\tvar cc = c * c,\n  \t\t\t\t\t\t    ss = s * s;\n\n  \t\t\t\t\t\tvar mix = 2.0 * c * s * m12;\n\n  \t\t\t\t\t\te[1] = c * m01 - s * m02;\n  \t\t\t\t\t\te[2] = s * m01 + c * m02;\n\n  \t\t\t\t\t\te[3] = cc * m11 - mix + ss * m22;\n  \t\t\t\t\t\te[4] = 0;\n\n  \t\t\t\t\t\te[5] = ss * m11 + mix + cc * m22;\n\n  \t\t\t\t\t\treturn coefficients;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Schur;\n  }();\n\n  function rotate01(vtav, v) {\n\n  \tvar m01 = vtav.elements[1];\n\n  \tif (m01 !== 0) {\n\n  \t\tGivens.rot01Post(v, Schur.rot01(vtav));\n  \t}\n  }\n\n  function rotate02(vtav, v) {\n\n  \tvar m02 = vtav.elements[2];\n\n  \tif (m02 !== 0) {\n\n  \t\tGivens.rot02Post(v, Schur.rot02(vtav));\n  \t}\n  }\n\n  function rotate12(vtav, v) {\n\n  \tvar m12 = vtav.elements[4];\n\n  \tif (m12 !== 0) {\n\n  \t\tGivens.rot12Post(v, Schur.rot12(vtav));\n  \t}\n  }\n\n  function getSymmetricSVD(a, vtav, v, threshold, maxSweeps) {\n\n  \tvar delta = threshold * vtav.copy(a).norm();\n\n  \tvar i = void 0;\n\n  \tfor (i = 0; i < maxSweeps && vtav.off() > delta; ++i) {\n\n  \t\trotate01(vtav, v);\n  \t\trotate02(vtav, v);\n  \t\trotate12(vtav, v);\n  \t}\n  }\n\n  function pinv(x, threshold) {\n\n  \tvar invX = 1.0 / x;\n\n  \treturn Math.abs(x) < threshold || Math.abs(invX) < threshold ? 0.0 : invX;\n  }\n\n  function pseudoInverse(t, a, b, threshold) {\n\n  \tvar te = t.elements;\n  \tvar ae = a.elements;\n  \tvar be = b.elements;\n\n  \tvar a00 = ae[0];\n  \tvar a11 = ae[3];\n  \tvar a22 = ae[5];\n\n  \tvar a0 = pinv(a00, threshold);\n  \tvar a1 = pinv(a11, threshold);\n  \tvar a2 = pinv(a22, threshold);\n\n  \tvar truncatedValues = (a0 === 0.0) + (a1 === 0.0) + (a2 === 0.0);\n\n  \tvar dimension = 3 - truncatedValues;\n\n  \tvar b00 = be[0],\n  \t    b01 = be[3],\n  \t    b02 = be[6];\n  \tvar b10 = be[1],\n  \t    b11 = be[4],\n  \t    b12 = be[7];\n  \tvar b20 = be[2],\n  \t    b21 = be[5],\n  \t    b22 = be[8];\n\n  \tte[0] = b00 * a0 * b00 + b01 * a1 * b01 + b02 * a2 * b02;\n  \tte[3] = b00 * a0 * b10 + b01 * a1 * b11 + b02 * a2 * b12;\n  \tte[6] = b00 * a0 * b20 + b01 * a1 * b21 + b02 * a2 * b22;\n\n  \tte[1] = te[3];\n  \tte[4] = b10 * a0 * b10 + b11 * a1 * b11 + b12 * a2 * b12;\n  \tte[7] = b10 * a0 * b20 + b11 * a1 * b21 + b12 * a2 * b22;\n\n  \tte[2] = te[6];\n  \tte[5] = te[7];\n  \tte[8] = b20 * a0 * b20 + b21 * a1 * b21 + b22 * a2 * b22;\n\n  \treturn dimension;\n  }\n\n  var SingularValueDecomposition = function () {\n  \tfunction SingularValueDecomposition() {\n  \t\tclassCallCheck(this, SingularValueDecomposition);\n  \t}\n\n  \tcreateClass(SingularValueDecomposition, null, [{\n  \t\tkey: \"solveSymmetric\",\n  \t\tvalue: function solveSymmetric(a, b, x, svdThreshold, svdSweeps, pseudoInverseThreshold) {\n\n  \t\t\tvar v = new Matrix3();\n\n  \t\t\tvar pinv = new Matrix3();\n  \t\t\tvar vtav = new SymmetricMatrix3();\n\n  \t\t\tvar dimension = void 0;\n\n  \t\t\tpinv.set(0, 0, 0, 0, 0, 0, 0, 0, 0);\n\n  \t\t\tvtav.set(0, 0, 0, 0, 0, 0);\n\n  \t\t\tgetSymmetricSVD(a, vtav, v, svdThreshold, svdSweeps);\n\n  \t\t\tdimension = pseudoInverse(pinv, vtav, v, pseudoInverseThreshold);\n\n  \t\t\tx.copy(b).applyMatrix3(pinv);\n\n  \t\t\treturn dimension;\n  \t\t}\n  \t}, {\n  \t\tkey: \"calculateError\",\n  \t\tvalue: function calculateError(t, b, x) {\n\n  \t\t\tvar e = t.elements;\n  \t\t\tvar v = x.clone();\n  \t\t\tvar a = new Matrix3();\n\n  \t\t\ta.set(e[0], e[1], e[2], e[1], e[3], e[4], e[2], e[4], e[5]);\n\n  \t\t\tv.applyMatrix3(a);\n  \t\t\tv.subVectors(b, v);\n\n  \t\t\treturn v.lengthSq();\n  \t\t}\n  \t}]);\n  \treturn SingularValueDecomposition;\n  }();\n\n  var QEFSolver = function () {\n  \t\tfunction QEFSolver() {\n  \t\t\t\tvar svdThreshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-6;\n  \t\t\t\tvar svdSweeps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;\n  \t\t\t\tvar pseudoInverseThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;\n  \t\t\t\tclassCallCheck(this, QEFSolver);\n\n\n  \t\t\t\tthis.svdThreshold = svdThreshold;\n\n  \t\t\t\tthis.svdSweeps = svdSweeps;\n\n  \t\t\t\tthis.pseudoInverseThreshold = pseudoInverseThreshold;\n\n  \t\t\t\tthis.data = null;\n\n  \t\t\t\tthis.massPoint = new Vector3$1();\n\n  \t\t\t\tthis.ata = new SymmetricMatrix3();\n\n  \t\t\t\tthis.atb = new Vector3$1();\n\n  \t\t\t\tthis.x = new Vector3$1();\n\n  \t\t\t\tthis.hasSolution = false;\n  \t\t}\n\n  \t\tcreateClass(QEFSolver, [{\n  \t\t\t\tkey: \"computeError\",\n  \t\t\t\tvalue: function computeError() {\n\n  \t\t\t\t\t\tvar x = this.x;\n\n  \t\t\t\t\t\tvar error = Infinity;\n  \t\t\t\t\t\tvar atax = void 0;\n\n  \t\t\t\t\t\tif (this.hasSolution) {\n\n  \t\t\t\t\t\t\t\tatax = this.ata.applyToVector3(x.clone());\n  \t\t\t\t\t\t\t\terror = x.dot(atax) - 2.0 * x.dot(this.atb) + this.data.btb;\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn error;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"setData\",\n  \t\t\t\tvalue: function setData(d) {\n\n  \t\t\t\t\t\tthis.data = d;\n  \t\t\t\t\t\tthis.hasSolution = false;\n\n  \t\t\t\t\t\treturn this;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"solve\",\n  \t\t\t\tvalue: function solve() {\n\n  \t\t\t\t\t\tvar data = this.data;\n  \t\t\t\t\t\tvar massPoint = this.massPoint;\n  \t\t\t\t\t\tvar ata = this.ata;\n  \t\t\t\t\t\tvar atb = this.atb;\n  \t\t\t\t\t\tvar x = this.x;\n\n  \t\t\t\t\t\tvar mp = void 0;\n\n  \t\t\t\t\t\tif (!this.hasSolution && data !== null && data.numPoints > 0) {\n  \t\t\t\t\t\t\t\tmassPoint.copy(data.massPoint);\n  \t\t\t\t\t\t\t\tmassPoint.divideScalar(data.numPoints);\n\n  \t\t\t\t\t\t\t\tata.copy(data.ata);\n  \t\t\t\t\t\t\t\tatb.copy(data.atb);\n\n  \t\t\t\t\t\t\t\tmp = ata.applyToVector3(massPoint.clone());\n  \t\t\t\t\t\t\t\tatb.sub(mp);\n\n  \t\t\t\t\t\t\t\tx.set(0, 0, 0);\n\n  \t\t\t\t\t\t\t\tdata.massPointDimension = SingularValueDecomposition.solveSymmetric(ata, atb, x, this.svdThreshold, this.svdSweeps, this.pseudoInverseThreshold);\n\n  \t\t\t\t\t\t\t\tx.add(massPoint);\n\n  \t\t\t\t\t\t\t\tatb.copy(data.atb);\n\n  \t\t\t\t\t\t\t\tthis.hasSolution = true;\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn x;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"clear\",\n  \t\t\t\tvalue: function clear() {\n\n  \t\t\t\t\t\tthis.data = null;\n  \t\t\t\t\t\tthis.hasSolution = false;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn QEFSolver;\n  }();\n\n  var BIAS = 1e-2;\n\n  var THRESHOLD = 1e-6;\n\n  var ab = new Vector3$1();\n\n  var p = new Vector3$1();\n\n  var v = new Vector3$1();\n\n  var Edge = function () {\n  \t\tfunction Edge() {\n  \t\t\t\tvar a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();\n  \t\t\t\tvar b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();\n  \t\t\t\tclassCallCheck(this, Edge);\n\n\n  \t\t\t\tthis.a = a;\n\n  \t\t\t\tthis.b = b;\n\n  \t\t\t\tthis.t = 0.0;\n\n  \t\t\t\tthis.n = new Vector3$1();\n  \t\t}\n\n  \t\tcreateClass(Edge, [{\n  \t\t\t\tkey: \"approximateZeroCrossing\",\n  \t\t\t\tvalue: function approximateZeroCrossing(sdf) {\n  \t\t\t\t\t\tvar steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;\n\n\n  \t\t\t\t\t\tvar s = Math.max(1, steps - 1);\n\n  \t\t\t\t\t\tvar a = 0.0;\n  \t\t\t\t\t\tvar b = 1.0;\n  \t\t\t\t\t\tvar c = 0.0;\n  \t\t\t\t\t\tvar i = 0;\n\n  \t\t\t\t\t\tvar densityA = void 0,\n  \t\t\t\t\t\t    densityC = void 0;\n\n  \t\t\t\t\t\tab.subVectors(this.b, this.a);\n\n  \t\t\t\t\t\twhile (i <= s) {\n\n  \t\t\t\t\t\t\t\tc = (a + b) / 2;\n\n  \t\t\t\t\t\t\t\tp.addVectors(this.a, v.copy(ab).multiplyScalar(c));\n  \t\t\t\t\t\t\t\tdensityC = sdf.sample(p);\n\n  \t\t\t\t\t\t\t\tif (Math.abs(densityC) <= BIAS || (b - a) / 2 <= THRESHOLD) {\n  \t\t\t\t\t\t\t\t\t\tbreak;\n  \t\t\t\t\t\t\t\t} else {\n\n  \t\t\t\t\t\t\t\t\t\tp.addVectors(this.a, v.copy(ab).multiplyScalar(a));\n  \t\t\t\t\t\t\t\t\t\tdensityA = sdf.sample(p);\n\n  \t\t\t\t\t\t\t\t\t\tif (Math.sign(densityC) === Math.sign(densityA)) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\ta = c;\n  \t\t\t\t\t\t\t\t\t\t} else {\n\n  \t\t\t\t\t\t\t\t\t\t\t\tb = c;\n  \t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\t++i;\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tthis.t = c;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"computeZeroCrossingPosition\",\n  \t\t\t\tvalue: function computeZeroCrossingPosition() {\n\n  \t\t\t\t\t\treturn ab.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"computeSurfaceNormal\",\n  \t\t\t\tvalue: function computeSurfaceNormal(sdf) {\n\n  \t\t\t\t\t\tvar position = this.computeZeroCrossingPosition();\n  \t\t\t\t\t\tvar E = 1e-3;\n\n  \t\t\t\t\t\tvar dx = sdf.sample(p.addVectors(position, v.set(E, 0, 0))) - sdf.sample(p.subVectors(position, v.set(E, 0, 0)));\n  \t\t\t\t\t\tvar dy = sdf.sample(p.addVectors(position, v.set(0, E, 0))) - sdf.sample(p.subVectors(position, v.set(0, E, 0)));\n  \t\t\t\t\t\tvar dz = sdf.sample(p.addVectors(position, v.set(0, 0, E))) - sdf.sample(p.subVectors(position, v.set(0, 0, E)));\n\n  \t\t\t\t\t\tthis.n.set(dx, dy, dz).normalize();\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Edge;\n  }();\n\n  var Voxel = function Voxel() {\n  \t\tclassCallCheck(this, Voxel);\n\n\n  \t\tthis.materials = 0;\n\n  \t\tthis.edgeCount = 0;\n\n  \t\tthis.index = -1;\n\n  \t\tthis.position = new Vector3$1();\n\n  \t\tthis.normal = new Vector3$1();\n\n  \t\tthis.qefData = null;\n  };\n\n  var BIAS$1 = 1e-6;\n\n  var THRESHOLD$1 = 1e-2;\n\n  var threshold = 0.0;\n\n  var VoxelCell = function (_CubicOctant) {\n  \tinherits(VoxelCell, _CubicOctant);\n\n  \tfunction VoxelCell(min, size) {\n  \t\tclassCallCheck(this, VoxelCell);\n\n  \t\tvar _this = possibleConstructorReturn(this, (VoxelCell.__proto__ || Object.getPrototypeOf(VoxelCell)).call(this, min, size));\n\n  \t\t_this.voxel = null;\n\n  \t\treturn _this;\n  \t}\n\n  \tcreateClass(VoxelCell, [{\n  \t\tkey: \"contains\",\n  \t\tvalue: function contains(p) {\n\n  \t\t\tvar min = this.min;\n  \t\t\tvar size = this.size;\n\n  \t\t\treturn p.x >= min.x - BIAS$1 && p.y >= min.y - BIAS$1 && p.z >= min.z - BIAS$1 && p.x <= min.x + size + BIAS$1 && p.y <= min.y + size + BIAS$1 && p.z <= min.z + size + BIAS$1;\n  \t\t}\n  \t}, {\n  \t\tkey: \"collapse\",\n  \t\tvalue: function collapse() {\n\n  \t\t\tvar children = this.children;\n\n  \t\t\tvar signs = new Int16Array([-1, -1, -1, -1, -1, -1, -1, -1]);\n\n  \t\t\tvar midSign = -1;\n  \t\t\tvar collapsible = children !== null;\n\n  \t\t\tvar removedVoxels = 0;\n\n  \t\t\tvar qefData = void 0,\n  \t\t\t    qefSolver = void 0;\n  \t\t\tvar child = void 0,\n  \t\t\t    sign = void 0,\n  \t\t\t    voxel = void 0;\n  \t\t\tvar position = void 0;\n\n  \t\t\tvar v = void 0,\n  \t\t\t    i = void 0;\n\n  \t\t\tif (collapsible) {\n\n  \t\t\t\tqefData = new QEFData();\n\n  \t\t\t\tfor (v = 0, i = 0; i < 8; ++i) {\n\n  \t\t\t\t\tchild = children[i];\n\n  \t\t\t\t\tremovedVoxels += child.collapse();\n\n  \t\t\t\t\tvoxel = child.voxel;\n\n  \t\t\t\t\tif (child.children !== null) {\n  \t\t\t\t\t\tcollapsible = false;\n  \t\t\t\t\t} else if (voxel !== null) {\n\n  \t\t\t\t\t\tqefData.addData(voxel.qefData);\n\n  \t\t\t\t\t\tmidSign = voxel.materials >> 7 - i & 1;\n  \t\t\t\t\t\tsigns[i] = voxel.materials >> i & 1;\n\n  \t\t\t\t\t\t++v;\n  \t\t\t\t\t}\n  \t\t\t\t}\n\n  \t\t\t\tif (collapsible) {\n\n  \t\t\t\t\tqefSolver = new QEFSolver();\n  \t\t\t\t\tposition = qefSolver.setData(qefData).solve();\n\n  \t\t\t\t\tif (qefSolver.computeError() <= threshold) {\n\n  \t\t\t\t\t\tvoxel = new Voxel();\n  \t\t\t\t\t\tvoxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);\n\n  \t\t\t\t\t\tfor (i = 0; i < 8; ++i) {\n\n  \t\t\t\t\t\t\tsign = signs[i];\n  \t\t\t\t\t\t\tchild = children[i];\n\n  \t\t\t\t\t\t\tif (sign === -1) {\n  \t\t\t\t\t\t\t\tvoxel.materials |= midSign << i;\n  \t\t\t\t\t\t\t} else {\n\n  \t\t\t\t\t\t\t\tvoxel.materials |= sign << i;\n\n  \t\t\t\t\t\t\t\tvoxel.normal.add(child.voxel.normal);\n  \t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tvoxel.normal.normalize();\n  \t\t\t\t\t\tvoxel.qefData = qefData;\n\n  \t\t\t\t\t\tthis.voxel = voxel;\n  \t\t\t\t\t\tthis.children = null;\n\n  \t\t\t\t\t\tremovedVoxels += v - 1;\n  \t\t\t\t\t}\n  \t\t\t\t}\n  \t\t\t}\n\n  \t\t\treturn removedVoxels;\n  \t\t}\n  \t}, {\n  \t\tkey: \"lod\",\n  \t\tget: function get$$1() {\n  \t\t\treturn threshold;\n  \t\t},\n  \t\tset: function set$$1(lod) {\n\n  \t\t\tthreshold = THRESHOLD$1 + lod * lod * lod;\n  \t\t}\n  \t}]);\n  \treturn VoxelCell;\n  }(CubicOctant);\n\n  function createVoxel(n, x, y, z, materialIndices) {\n\n  \t\tvar m = n + 1;\n  \t\tvar mm = m * m;\n\n  \t\tvar voxel = new Voxel();\n\n  \t\tvar materials = void 0,\n  \t\t    edgeCount = void 0;\n  \t\tvar material = void 0,\n  \t\t    offset = void 0,\n  \t\t    index = void 0;\n  \t\tvar c1 = void 0,\n  \t\t    c2 = void 0,\n  \t\t    m1 = void 0,\n  \t\t    m2 = void 0;\n\n  \t\tvar i = void 0;\n\n  \t\tfor (materials = 0, i = 0; i < 8; ++i) {\n  \t\t\t\toffset = PATTERN[i];\n  \t\t\t\tindex = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);\n\n  \t\t\t\tmaterial = Math.min(materialIndices[index], Material.SOLID);\n\n  \t\t\t\tmaterials |= material << i;\n  \t\t}\n\n  \t\tfor (edgeCount = 0, i = 0; i < 12; ++i) {\n\n  \t\t\t\tc1 = EDGES[i][0];\n  \t\t\t\tc2 = EDGES[i][1];\n\n  \t\t\t\tm1 = materials >> c1 & 1;\n  \t\t\t\tm2 = materials >> c2 & 1;\n\n  \t\t\t\tif (m1 !== m2) {\n\n  \t\t\t\t\t\t++edgeCount;\n  \t\t\t\t}\n  \t\t}\n\n  \t\tvoxel.materials = materials;\n  \t\tvoxel.edgeCount = edgeCount;\n  \t\tvoxel.qefData = new QEFData();\n\n  \t\treturn voxel;\n  }\n\n  var VoxelBlock = function (_Octree) {\n  \t\tinherits(VoxelBlock, _Octree);\n\n  \t\tfunction VoxelBlock(chunk) {\n  \t\t\t\tclassCallCheck(this, VoxelBlock);\n\n  \t\t\t\tvar _this = possibleConstructorReturn(this, (VoxelBlock.__proto__ || Object.getPrototypeOf(VoxelBlock)).call(this));\n\n  \t\t\t\t_this.root = new VoxelCell(chunk.min, chunk.size);\n  \t\t\t\t_this.root.lod = chunk.data.lod;\n\n  \t\t\t\t_this.voxelCount = 0;\n\n  \t\t\t\t_this.construct(chunk);\n  \t\t\t\t_this.simplify();\n\n  \t\t\t\treturn _this;\n  \t\t}\n\n  \t\tcreateClass(VoxelBlock, [{\n  \t\t\t\tkey: \"simplify\",\n  \t\t\t\tvalue: function simplify() {\n\n  \t\t\t\t\t\tthis.voxelCount -= this.root.collapse();\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"getCell\",\n  \t\t\t\tvalue: function getCell(n, x, y, z) {\n\n  \t\t\t\t\t\tvar cell = this.root;\n  \t\t\t\t\t\tvar i = 0;\n\n  \t\t\t\t\t\tfor (n = n >> 1; n > 0; n >>= 1, i = 0) {\n  \t\t\t\t\t\t\t\tif (x >= n) {\n  \t\t\t\t\t\t\t\t\t\ti += 4;x -= n;\n  \t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\tif (y >= n) {\n  \t\t\t\t\t\t\t\t\t\ti += 2;y -= n;\n  \t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\tif (z >= n) {\n  \t\t\t\t\t\t\t\t\t\ti += 1;z -= n;\n  \t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\tif (cell.children === null) {\n\n  \t\t\t\t\t\t\t\t\t\tcell.split();\n  \t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\tcell = cell.children[i];\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn cell;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"construct\",\n  \t\t\t\tvalue: function construct(chunk) {\n\n  \t\t\t\t\t\tvar s = chunk.size;\n  \t\t\t\t\t\tvar n = chunk.resolution;\n  \t\t\t\t\t\tvar m = n + 1;\n  \t\t\t\t\t\tvar mm = m * m;\n\n  \t\t\t\t\t\tvar data = chunk.data;\n  \t\t\t\t\t\tvar edgeData = data.edgeData;\n  \t\t\t\t\t\tvar materialIndices = data.materialIndices;\n\n  \t\t\t\t\t\tvar qefSolver = new QEFSolver();\n\n  \t\t\t\t\t\tvar base = chunk.min;\n  \t\t\t\t\t\tvar offsetA = new Vector3$1();\n  \t\t\t\t\t\tvar offsetB = new Vector3$1();\n  \t\t\t\t\t\tvar intersection = new Vector3$1();\n  \t\t\t\t\t\tvar edge = new Edge();\n\n  \t\t\t\t\t\tvar sequences = [new Uint8Array([0, 1, 2, 3]), new Uint8Array([0, 1, 4, 5]), new Uint8Array([0, 2, 4, 6])];\n\n  \t\t\t\t\t\tvar voxelCount = 0;\n\n  \t\t\t\t\t\tvar edges = void 0,\n  \t\t\t\t\t\t    zeroCrossings = void 0,\n  \t\t\t\t\t\t    normals = void 0;\n  \t\t\t\t\t\tvar sequence = void 0,\n  \t\t\t\t\t\t    offset = void 0;\n  \t\t\t\t\t\tvar voxel = void 0,\n  \t\t\t\t\t\t    position = void 0;\n  \t\t\t\t\t\tvar axis = void 0,\n  \t\t\t\t\t\t    cell = void 0;\n\n  \t\t\t\t\t\tvar a = void 0,\n  \t\t\t\t\t\t    d = void 0,\n  \t\t\t\t\t\t    i = void 0,\n  \t\t\t\t\t\t    j = void 0,\n  \t\t\t\t\t\t    l = void 0;\n  \t\t\t\t\t\tvar x2 = void 0,\n  \t\t\t\t\t\t    y2 = void 0,\n  \t\t\t\t\t\t    z2 = void 0;\n  \t\t\t\t\t\tvar x = void 0,\n  \t\t\t\t\t\t    y = void 0,\n  \t\t\t\t\t\t    z = void 0;\n\n  \t\t\t\t\t\tvar index = void 0;\n\n  \t\t\t\t\t\tfor (a = 4, d = 0; d < 3; ++d, a >>= 1) {\n\n  \t\t\t\t\t\t\t\taxis = PATTERN[a];\n\n  \t\t\t\t\t\t\t\tedges = edgeData.edges[d];\n  \t\t\t\t\t\t\t\tzeroCrossings = edgeData.zeroCrossings[d];\n  \t\t\t\t\t\t\t\tnormals = edgeData.normals[d];\n\n  \t\t\t\t\t\t\t\tsequence = sequences[d];\n\n  \t\t\t\t\t\t\t\tfor (i = 0, l = edges.length; i < l; ++i) {\n  \t\t\t\t\t\t\t\t\t\tindex = edges[i];\n\n  \t\t\t\t\t\t\t\t\t\tx = index % m;\n  \t\t\t\t\t\t\t\t\t\ty = Math.trunc(index % mm / m);\n  \t\t\t\t\t\t\t\t\t\tz = Math.trunc(index / mm);\n\n  \t\t\t\t\t\t\t\t\t\toffsetA.set(x * s / n, y * s / n, z * s / n);\n\n  \t\t\t\t\t\t\t\t\t\toffsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);\n\n  \t\t\t\t\t\t\t\t\t\tedge.a.addVectors(base, offsetA);\n  \t\t\t\t\t\t\t\t\t\tedge.b.addVectors(base, offsetB);\n\n  \t\t\t\t\t\t\t\t\t\tedge.t = zeroCrossings[i];\n  \t\t\t\t\t\t\t\t\t\tedge.n.fromArray(normals, i * 3);\n\n  \t\t\t\t\t\t\t\t\t\tintersection.copy(edge.computeZeroCrossingPosition());\n\n  \t\t\t\t\t\t\t\t\t\tfor (j = 0; j < 4; ++j) {\n  \t\t\t\t\t\t\t\t\t\t\t\toffset = PATTERN[sequence[j]];\n\n  \t\t\t\t\t\t\t\t\t\t\t\tx2 = x - offset[0];\n  \t\t\t\t\t\t\t\t\t\t\t\ty2 = y - offset[1];\n  \t\t\t\t\t\t\t\t\t\t\t\tz2 = z - offset[2];\n\n  \t\t\t\t\t\t\t\t\t\t\t\tif (x2 >= 0 && y2 >= 0 && z2 >= 0 && x2 < n && y2 < n && z2 < n) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tcell = this.getCell(n, x2, y2, z2);\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tif (cell.voxel === null) {\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcell.voxel = createVoxel(n, x2, y2, z2, materialIndices);\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t++voxelCount;\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel = cell.voxel;\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel.normal.add(edge.n);\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel.qefData.add(intersection, edge.n);\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tif (voxel.qefData.numPoints === voxel.edgeCount) {\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tposition = qefSolver.setData(voxel.qefData).solve();\n\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel.position.copy(cell.contains(position) ? position : qefSolver.massPoint);\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvoxel.normal.normalize();\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tthis.voxelCount = voxelCount;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn VoxelBlock;\n  }(Octree);\n\n  var CELL_PROC_FACE_MASK = [new Uint8Array([0, 4, 0]), new Uint8Array([1, 5, 0]), new Uint8Array([2, 6, 0]), new Uint8Array([3, 7, 0]), new Uint8Array([0, 2, 1]), new Uint8Array([4, 6, 1]), new Uint8Array([1, 3, 1]), new Uint8Array([5, 7, 1]), new Uint8Array([0, 1, 2]), new Uint8Array([2, 3, 2]), new Uint8Array([4, 5, 2]), new Uint8Array([6, 7, 2])];\n\n  var CELL_PROC_EDGE_MASK = [new Uint8Array([0, 1, 2, 3, 0]), new Uint8Array([4, 5, 6, 7, 0]), new Uint8Array([0, 4, 1, 5, 1]), new Uint8Array([2, 6, 3, 7, 1]), new Uint8Array([0, 2, 4, 6, 2]), new Uint8Array([1, 3, 5, 7, 2])];\n\n  var FACE_PROC_FACE_MASK = [[new Uint8Array([4, 0, 0]), new Uint8Array([5, 1, 0]), new Uint8Array([6, 2, 0]), new Uint8Array([7, 3, 0])], [new Uint8Array([2, 0, 1]), new Uint8Array([6, 4, 1]), new Uint8Array([3, 1, 1]), new Uint8Array([7, 5, 1])], [new Uint8Array([1, 0, 2]), new Uint8Array([3, 2, 2]), new Uint8Array([5, 4, 2]), new Uint8Array([7, 6, 2])]];\n\n  var FACE_PROC_EDGE_MASK = [[new Uint8Array([1, 4, 0, 5, 1, 1]), new Uint8Array([1, 6, 2, 7, 3, 1]), new Uint8Array([0, 4, 6, 0, 2, 2]), new Uint8Array([0, 5, 7, 1, 3, 2])], [new Uint8Array([0, 2, 3, 0, 1, 0]), new Uint8Array([0, 6, 7, 4, 5, 0]), new Uint8Array([1, 2, 0, 6, 4, 2]), new Uint8Array([1, 3, 1, 7, 5, 2])], [new Uint8Array([1, 1, 0, 3, 2, 0]), new Uint8Array([1, 5, 4, 7, 6, 0]), new Uint8Array([0, 1, 5, 0, 4, 1]), new Uint8Array([0, 3, 7, 2, 6, 1])]];\n\n  var EDGE_PROC_EDGE_MASK = [[new Uint8Array([3, 2, 1, 0, 0]), new Uint8Array([7, 6, 5, 4, 0])], [new Uint8Array([5, 1, 4, 0, 1]), new Uint8Array([7, 3, 6, 2, 1])], [new Uint8Array([6, 4, 2, 0, 2]), new Uint8Array([7, 5, 3, 1, 2])]];\n\n  var PROC_EDGE_MASK = [new Uint8Array([3, 2, 1, 0]), new Uint8Array([7, 5, 6, 4]), new Uint8Array([11, 10, 9, 8])];\n\n  function contourProcessEdge(octants, dir, indexBuffer) {\n\n  \tvar indices = [-1, -1, -1, -1];\n  \tvar signChange = [false, false, false, false];\n\n  \tvar minSize = Infinity;\n  \tvar minIndex = 0;\n  \tvar flip = false;\n\n  \tvar c1 = void 0,\n  \t    c2 = void 0,\n  \t    m1 = void 0,\n  \t    m2 = void 0;\n  \tvar octant = void 0,\n  \t    edge = void 0;\n  \tvar i = void 0;\n\n  \tfor (i = 0; i < 4; ++i) {\n\n  \t\toctant = octants[i];\n  \t\tedge = PROC_EDGE_MASK[dir][i];\n\n  \t\tc1 = EDGES[edge][0];\n  \t\tc2 = EDGES[edge][1];\n\n  \t\tm1 = octant.voxel.materials >> c1 & 1;\n  \t\tm2 = octant.voxel.materials >> c2 & 1;\n\n  \t\tif (octant.size < minSize) {\n\n  \t\t\tminSize = octant.size;\n  \t\t\tminIndex = i;\n  \t\t\tflip = m1 !== Material.AIR;\n  \t\t}\n\n  \t\tindices[i] = octant.voxel.index;\n  \t\tsignChange[i] = m1 !== m2;\n  \t}\n\n  \tif (signChange[minIndex]) {\n\n  \t\tif (!flip) {\n\n  \t\t\tindexBuffer.push(indices[0]);\n  \t\t\tindexBuffer.push(indices[1]);\n  \t\t\tindexBuffer.push(indices[3]);\n\n  \t\t\tindexBuffer.push(indices[0]);\n  \t\t\tindexBuffer.push(indices[3]);\n  \t\t\tindexBuffer.push(indices[2]);\n  \t\t} else {\n\n  \t\t\tindexBuffer.push(indices[0]);\n  \t\t\tindexBuffer.push(indices[3]);\n  \t\t\tindexBuffer.push(indices[1]);\n\n  \t\t\tindexBuffer.push(indices[0]);\n  \t\t\tindexBuffer.push(indices[2]);\n  \t\t\tindexBuffer.push(indices[3]);\n  \t\t}\n  \t}\n  }\n\n  function contourEdgeProc(octants, dir, indexBuffer) {\n\n  \tvar c = [0, 0, 0, 0];\n\n  \tvar edgeOctants = void 0;\n  \tvar octant = void 0;\n  \tvar i = void 0,\n  \t    j = void 0;\n\n  \tif (octants[0].voxel !== null && octants[1].voxel !== null && octants[2].voxel !== null && octants[3].voxel !== null) {\n\n  \t\tcontourProcessEdge(octants, dir, indexBuffer);\n  \t} else {\n\n  \t\tfor (i = 0; i < 2; ++i) {\n\n  \t\t\tc[0] = EDGE_PROC_EDGE_MASK[dir][i][0];\n  \t\t\tc[1] = EDGE_PROC_EDGE_MASK[dir][i][1];\n  \t\t\tc[2] = EDGE_PROC_EDGE_MASK[dir][i][2];\n  \t\t\tc[3] = EDGE_PROC_EDGE_MASK[dir][i][3];\n\n  \t\t\tedgeOctants = [];\n\n  \t\t\tfor (j = 0; j < 4; ++j) {\n\n  \t\t\t\toctant = octants[j];\n\n  \t\t\t\tif (octant.voxel !== null) {\n\n  \t\t\t\t\tedgeOctants[j] = octant;\n  \t\t\t\t} else if (octant.children !== null) {\n\n  \t\t\t\t\tedgeOctants[j] = octant.children[c[j]];\n  \t\t\t\t} else {\n\n  \t\t\t\t\tbreak;\n  \t\t\t\t}\n  \t\t\t}\n\n  \t\t\tif (j === 4) {\n\n  \t\t\t\tcontourEdgeProc(edgeOctants, EDGE_PROC_EDGE_MASK[dir][i][4], indexBuffer);\n  \t\t\t}\n  \t\t}\n  \t}\n  }\n\n  function contourFaceProc(octants, dir, indexBuffer) {\n\n  \tvar c = [0, 0, 0, 0];\n\n  \tvar orders = [[0, 0, 1, 1], [0, 1, 0, 1]];\n\n  \tvar faceOctants = void 0,\n  \t    edgeOctants = void 0;\n  \tvar order = void 0,\n  \t    octant = void 0;\n  \tvar i = void 0,\n  \t    j = void 0;\n\n  \tif (octants[0].children !== null || octants[1].children !== null) {\n\n  \t\tfor (i = 0; i < 4; ++i) {\n\n  \t\t\tc[0] = FACE_PROC_FACE_MASK[dir][i][0];\n  \t\t\tc[1] = FACE_PROC_FACE_MASK[dir][i][1];\n\n  \t\t\tfaceOctants = [octants[0].children === null ? octants[0] : octants[0].children[c[0]], octants[1].children === null ? octants[1] : octants[1].children[c[1]]];\n\n  \t\t\tcontourFaceProc(faceOctants, FACE_PROC_FACE_MASK[dir][i][2], indexBuffer);\n  \t\t}\n\n  \t\tfor (i = 0; i < 4; ++i) {\n\n  \t\t\tc[0] = FACE_PROC_EDGE_MASK[dir][i][1];\n  \t\t\tc[1] = FACE_PROC_EDGE_MASK[dir][i][2];\n  \t\t\tc[2] = FACE_PROC_EDGE_MASK[dir][i][3];\n  \t\t\tc[3] = FACE_PROC_EDGE_MASK[dir][i][4];\n\n  \t\t\torder = orders[FACE_PROC_EDGE_MASK[dir][i][0]];\n\n  \t\t\tedgeOctants = [];\n\n  \t\t\tfor (j = 0; j < 4; ++j) {\n\n  \t\t\t\toctant = octants[order[j]];\n\n  \t\t\t\tif (octant.voxel !== null) {\n\n  \t\t\t\t\tedgeOctants[j] = octant;\n  \t\t\t\t} else if (octant.children !== null) {\n\n  \t\t\t\t\tedgeOctants[j] = octant.children[c[j]];\n  \t\t\t\t} else {\n\n  \t\t\t\t\tbreak;\n  \t\t\t\t}\n  \t\t\t}\n\n  \t\t\tif (j === 4) {\n\n  \t\t\t\tcontourEdgeProc(edgeOctants, FACE_PROC_EDGE_MASK[dir][i][5], indexBuffer);\n  \t\t\t}\n  \t\t}\n  \t}\n  }\n\n  function contourCellProc(octant, indexBuffer) {\n\n  \tvar children = octant.children;\n  \tvar c = [0, 0, 0, 0];\n\n  \tvar faceOctants = void 0,\n  \t    edgeOctants = void 0;\n  \tvar i = void 0;\n\n  \tif (children !== null) {\n\n  \t\tfor (i = 0; i < 8; ++i) {\n\n  \t\t\tcontourCellProc(children[i], indexBuffer);\n  \t\t}\n\n  \t\tfor (i = 0; i < 12; ++i) {\n\n  \t\t\tc[0] = CELL_PROC_FACE_MASK[i][0];\n  \t\t\tc[1] = CELL_PROC_FACE_MASK[i][1];\n\n  \t\t\tfaceOctants = [children[c[0]], children[c[1]]];\n\n  \t\t\tcontourFaceProc(faceOctants, CELL_PROC_FACE_MASK[i][2], indexBuffer);\n  \t\t}\n\n  \t\tfor (i = 0; i < 6; ++i) {\n\n  \t\t\tc[0] = CELL_PROC_EDGE_MASK[i][0];\n  \t\t\tc[1] = CELL_PROC_EDGE_MASK[i][1];\n  \t\t\tc[2] = CELL_PROC_EDGE_MASK[i][2];\n  \t\t\tc[3] = CELL_PROC_EDGE_MASK[i][3];\n\n  \t\t\tedgeOctants = [children[c[0]], children[c[1]], children[c[2]], children[c[3]]];\n\n  \t\t\tcontourEdgeProc(edgeOctants, CELL_PROC_EDGE_MASK[i][4], indexBuffer);\n  \t\t}\n  \t}\n  }\n\n  function generateVertexIndices(octant, positions, normals, index) {\n\n  \tvar i = void 0,\n  \t    voxel = void 0;\n\n  \tif (octant.children !== null) {\n\n  \t\tfor (i = 0; i < 8; ++i) {\n\n  \t\t\tindex = generateVertexIndices(octant.children[i], positions, normals, index);\n  \t\t}\n  \t} else if (octant.voxel !== null) {\n\n  \t\tvoxel = octant.voxel;\n  \t\tvoxel.index = index;\n\n  \t\tpositions[index * 3] = voxel.position.x;\n  \t\tpositions[index * 3 + 1] = voxel.position.y;\n  \t\tpositions[index * 3 + 2] = voxel.position.z;\n\n  \t\tnormals[index * 3] = voxel.normal.x;\n  \t\tnormals[index * 3 + 1] = voxel.normal.y;\n  \t\tnormals[index * 3 + 2] = voxel.normal.z;\n\n  \t\t++index;\n  \t}\n\n  \treturn index;\n  }\n\n  var DualContouring = function () {\n  \tfunction DualContouring() {\n  \t\tclassCallCheck(this, DualContouring);\n  \t}\n\n  \tcreateClass(DualContouring, null, [{\n  \t\tkey: \"run\",\n  \t\tvalue: function run(chunk) {\n\n  \t\t\tvar indexBuffer = [];\n\n  \t\t\tvar voxelBlock = new VoxelBlock(chunk);\n\n  \t\t\tvar vertexCount = voxelBlock.voxelCount;\n\n  \t\t\tvar result = null;\n  \t\t\tvar indices = null;\n  \t\t\tvar positions = null;\n  \t\t\tvar normals = null;\n\n  \t\t\tif (vertexCount > 65536) {\n\n  \t\t\t\tconsole.warn(\"Could not create geometry for chunk at position\", this.chunk.min, \"with lod\", this.chunk.data.lod, \"(vertex count of\", vertexCount, \"exceeds limit of 65536)\");\n  \t\t\t} else if (vertexCount > 0) {\n\n  \t\t\t\tpositions = new Float32Array(vertexCount * 3);\n  \t\t\t\tnormals = new Float32Array(vertexCount * 3);\n\n  \t\t\t\tgenerateVertexIndices(voxelBlock.root, positions, normals, 0);\n  \t\t\t\tcontourCellProc(voxelBlock.root, indexBuffer);\n\n  \t\t\t\tindices = new Uint16Array(indexBuffer);\n\n  \t\t\t\tresult = { indices: indices, positions: positions, normals: normals };\n  \t\t\t}\n\n  \t\t\treturn result;\n  \t\t}\n  \t}]);\n  \treturn DualContouring;\n  }();\n\n  var RunLengthEncoder = function () {\n  \t\tfunction RunLengthEncoder() {\n  \t\t\t\tclassCallCheck(this, RunLengthEncoder);\n  \t\t}\n\n  \t\tcreateClass(RunLengthEncoder, null, [{\n  \t\t\t\tkey: \"encode\",\n  \t\t\t\tvalue: function encode(array) {\n\n  \t\t\t\t\t\tvar runLengths = [];\n  \t\t\t\t\t\tvar data = [];\n\n  \t\t\t\t\t\tvar previous = array[0];\n  \t\t\t\t\t\tvar count = 1;\n\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    l = void 0;\n\n  \t\t\t\t\t\tfor (i = 1, l = array.length; i < l; ++i) {\n\n  \t\t\t\t\t\t\t\tif (previous !== array[i]) {\n\n  \t\t\t\t\t\t\t\t\t\trunLengths.push(count);\n  \t\t\t\t\t\t\t\t\t\tdata.push(previous);\n\n  \t\t\t\t\t\t\t\t\t\tprevious = array[i];\n  \t\t\t\t\t\t\t\t\t\tcount = 1;\n  \t\t\t\t\t\t\t\t} else {\n\n  \t\t\t\t\t\t\t\t\t\t++count;\n  \t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\trunLengths.push(count);\n  \t\t\t\t\t\tdata.push(previous);\n\n  \t\t\t\t\t\treturn {\n  \t\t\t\t\t\t\t\trunLengths: runLengths,\n  \t\t\t\t\t\t\t\tdata: data\n  \t\t\t\t\t\t};\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"decode\",\n  \t\t\t\tvalue: function decode(runLengths, data) {\n  \t\t\t\t\t\tvar array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];\n\n\n  \t\t\t\t\t\tvar element = void 0;\n\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    j = void 0,\n  \t\t\t\t\t\t    il = void 0,\n  \t\t\t\t\t\t    jl = void 0;\n  \t\t\t\t\t\tvar k = 0;\n\n  \t\t\t\t\t\tfor (i = 0, il = data.length; i < il; ++i) {\n\n  \t\t\t\t\t\t\t\telement = data[i];\n\n  \t\t\t\t\t\t\t\tfor (j = 0, jl = runLengths[i]; j < jl; ++j) {\n\n  \t\t\t\t\t\t\t\t\t\tarray[k++] = element;\n  \t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn array;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn RunLengthEncoder;\n  }();\n\n  var EdgeData = function () {\n  \tfunction EdgeData(n) {\n  \t\tclassCallCheck(this, EdgeData);\n\n\n  \t\tvar c = Math.pow(n + 1, 2) * n;\n\n  \t\tthis.edges = [new Uint32Array(c), new Uint32Array(c), new Uint32Array(c)];\n\n  \t\tthis.zeroCrossings = [new Float32Array(c), new Float32Array(c), new Float32Array(c)];\n\n  \t\tthis.normals = [new Float32Array(c * 3), new Float32Array(c * 3), new Float32Array(c * 3)];\n  \t}\n\n  \tcreateClass(EdgeData, [{\n  \t\tkey: \"createTransferList\",\n  \t\tvalue: function createTransferList() {\n  \t\t\tvar transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n\n  \t\t\tvar arrays = [this.edges[0], this.edges[1], this.edges[2], this.zeroCrossings[0], this.zeroCrossings[1], this.zeroCrossings[2], this.normals[0], this.normals[1], this.normals[2]];\n\n  \t\t\tvar array = void 0;\n\n  \t\t\twhile (arrays.length > 0) {\n\n  \t\t\t\tarray = arrays.pop();\n\n  \t\t\t\tif (array !== null) {\n\n  \t\t\t\t\ttransferList.push(array.buffer);\n  \t\t\t\t}\n  \t\t\t}\n\n  \t\t\treturn transferList;\n  \t\t}\n  \t}, {\n  \t\tkey: \"serialise\",\n  \t\tvalue: function serialise() {\n\n  \t\t\treturn {\n  \t\t\t\tedges: this.edges,\n  \t\t\t\tzeroCrossings: this.zeroCrossings,\n  \t\t\t\tnormals: this.normals\n  \t\t\t};\n  \t\t}\n  \t}, {\n  \t\tkey: \"deserialise\",\n  \t\tvalue: function deserialise(object) {\n\n  \t\t\tthis.edges = object.edges;\n  \t\t\tthis.zeroCrossings = object.zeroCrossings;\n  \t\t\tthis.normals = object.normals;\n  \t\t}\n  \t}]);\n  \treturn EdgeData;\n  }();\n\n  var resolution = 0;\n\n  var indexCount = 0;\n\n  var HermiteData = function () {\n  \tfunction HermiteData() {\n  \t\tvar initialise = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n  \t\tclassCallCheck(this, HermiteData);\n\n\n  \t\tthis.lod = -1;\n\n  \t\tthis.neutered = false;\n\n  \t\tthis.materials = 0;\n\n  \t\tthis.materialIndices = initialise ? new Uint8Array(indexCount) : null;\n\n  \t\tthis.runLengths = null;\n\n  \t\tthis.edgeData = null;\n  \t}\n\n  \tcreateClass(HermiteData, [{\n  \t\tkey: \"set\",\n  \t\tvalue: function set$$1(data) {\n\n  \t\t\tthis.lod = data.lod;\n  \t\t\tthis.neutered = data.neutered;\n  \t\t\tthis.materials = data.materials;\n  \t\t\tthis.materialIndices = data.materialIndices;\n  \t\t\tthis.runLengths = data.runLengths;\n  \t\t\tthis.edgeData = data.edgeData;\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"setMaterialIndex\",\n  \t\tvalue: function setMaterialIndex(index, value) {\n  \t\t\tif (this.materialIndices[index] === Material.AIR) {\n\n  \t\t\t\tif (value !== Material.AIR) {\n\n  \t\t\t\t\t++this.materials;\n  \t\t\t\t}\n  \t\t\t} else if (value === Material.AIR) {\n\n  \t\t\t\t--this.materials;\n  \t\t\t}\n\n  \t\t\tthis.materialIndices[index] = value;\n  \t\t}\n  \t}, {\n  \t\tkey: \"compress\",\n  \t\tvalue: function compress() {\n\n  \t\t\tvar encoding = void 0;\n\n  \t\t\tif (this.runLengths === null) {\n\n  \t\t\t\tif (this.full) {\n\n  \t\t\t\t\tencoding = {\n  \t\t\t\t\t\trunLengths: [this.materialIndices.length],\n  \t\t\t\t\t\tdata: [Material.SOLID]\n  \t\t\t\t\t};\n  \t\t\t\t} else {\n\n  \t\t\t\t\tencoding = RunLengthEncoder.encode(this.materialIndices);\n  \t\t\t\t}\n\n  \t\t\t\tthis.runLengths = new Uint32Array(encoding.runLengths);\n  \t\t\t\tthis.materialIndices = new Uint8Array(encoding.data);\n  \t\t\t}\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"decompress\",\n  \t\tvalue: function decompress() {\n\n  \t\t\tif (this.runLengths !== null) {\n\n  \t\t\t\tthis.materialIndices = RunLengthEncoder.decode(this.runLengths, this.materialIndices, new Uint8Array(indexCount));\n\n  \t\t\t\tthis.runLengths = null;\n  \t\t\t}\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"createTransferList\",\n  \t\tvalue: function createTransferList() {\n  \t\t\tvar transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n\n  \t\t\tif (this.edgeData !== null) {\n  \t\t\t\tthis.edgeData.createTransferList(transferList);\n  \t\t\t}\n\n  \t\t\ttransferList.push(this.materialIndices.buffer);\n  \t\t\ttransferList.push(this.runLengths.buffer);\n\n  \t\t\treturn transferList;\n  \t\t}\n  \t}, {\n  \t\tkey: \"serialise\",\n  \t\tvalue: function serialise() {\n\n  \t\t\tthis.neutered = true;\n\n  \t\t\treturn {\n  \t\t\t\tlod: this.lod,\n  \t\t\t\tmaterials: this.materials,\n  \t\t\t\tmaterialIndices: this.materialIndices,\n  \t\t\t\trunLengths: this.runLengths,\n  \t\t\t\tedgeData: this.edgeData !== null ? this.edgeData.serialise() : null\n  \t\t\t};\n  \t\t}\n  \t}, {\n  \t\tkey: \"deserialise\",\n  \t\tvalue: function deserialise(object) {\n\n  \t\t\tthis.lod = object.lod;\n  \t\t\tthis.materials = object.materials;\n\n  \t\t\tthis.materialIndices = object.materialIndices;\n  \t\t\tthis.runLengths = object.runLengths;\n\n  \t\t\tif (object.edgeData !== null) {\n\n  \t\t\t\tif (this.edgeData === null) {\n\n  \t\t\t\t\tthis.edgeData = new EdgeData(0);\n  \t\t\t\t}\n\n  \t\t\t\tthis.edgeData.deserialise(object.edgeData);\n  \t\t\t} else {\n\n  \t\t\t\tthis.edgeData = null;\n  \t\t\t}\n\n  \t\t\tthis.neutered = false;\n  \t\t}\n  \t}, {\n  \t\tkey: \"empty\",\n  \t\tget: function get$$1() {\n  \t\t\treturn this.materials === 0;\n  \t\t}\n  \t}, {\n  \t\tkey: \"full\",\n  \t\tget: function get$$1() {\n  \t\t\treturn this.materials === indexCount;\n  \t\t}\n  \t}], [{\n  \t\tkey: \"resolution\",\n  \t\tget: function get$$1() {\n  \t\t\treturn resolution;\n  \t\t},\n  \t\tset: function set$$1(x) {\n\n  \t\t\tif (resolution === 0) {\n\n  \t\t\t\tresolution = Math.max(1, Math.min(256, x));\n  \t\t\t\tindexCount = Math.pow(resolution + 1, 3);\n  \t\t\t}\n  \t\t}\n  \t}]);\n  \treturn HermiteData;\n  }();\n\n  var Chunk = function (_CubicOctant) {\n  \tinherits(Chunk, _CubicOctant);\n\n  \tfunction Chunk(min, size) {\n  \t\tclassCallCheck(this, Chunk);\n\n  \t\tvar _this = possibleConstructorReturn(this, (Chunk.__proto__ || Object.getPrototypeOf(Chunk)).call(this, min, size));\n\n  \t\t_this.data = null;\n\n  \t\t_this.csg = null;\n\n  \t\treturn _this;\n  \t}\n\n  \tcreateClass(Chunk, [{\n  \t\tkey: \"createTransferList\",\n  \t\tvalue: function createTransferList() {\n  \t\t\tvar transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n\n  \t\t\treturn this.data !== null ? this.data.createTransferList(transferList) : transferList;\n  \t\t}\n  \t}, {\n  \t\tkey: \"serialise\",\n  \t\tvalue: function serialise() {\n\n  \t\t\treturn {\n  \t\t\t\tresolution: this.resolution,\n  \t\t\t\tmin: this.min.toArray(),\n  \t\t\t\tsize: this.size,\n  \t\t\t\tdata: this.data !== null ? this.data.serialise() : null\n  \t\t\t};\n  \t\t}\n  \t}, {\n  \t\tkey: \"deserialise\",\n  \t\tvalue: function deserialise(object) {\n\n  \t\t\tthis.resolution = object.resolution;\n  \t\t\tthis.min.fromArray(object.min);\n  \t\t\tthis.size = object.size;\n\n  \t\t\tif (object.data !== null) {\n\n  \t\t\t\tif (this.data === null) {\n\n  \t\t\t\t\tthis.data = new HermiteData(false);\n  \t\t\t\t}\n\n  \t\t\t\tthis.data.deserialise(object.data);\n  \t\t\t} else {\n\n  \t\t\t\tthis.data = null;\n  \t\t\t}\n  \t\t}\n  \t}, {\n  \t\tkey: \"resolution\",\n  \t\tget: function get$$1() {\n  \t\t\treturn HermiteData.resolution;\n  \t\t},\n  \t\tset: function set$$1(x) {\n  \t\t\tHermiteData.resolution = x;\n  \t\t}\n  \t}]);\n  \treturn Chunk;\n  }(CubicOctant);\n\n  var Action = {\n\n    EXTRACT: \"worker.extract\",\n    MODIFY: \"worker.modify\",\n    CLOSE: \"worker.close\"\n\n  };\n\n  var SurfaceExtractor = function () {\n  \t\tfunction SurfaceExtractor() {\n  \t\t\t\tclassCallCheck(this, SurfaceExtractor);\n\n\n  \t\t\t\tthis.chunk = new Chunk();\n\n  \t\t\t\tthis.message = {\n  \t\t\t\t\t\taction: Action.EXTRACT,\n  \t\t\t\t\t\tchunk: null,\n  \t\t\t\t\t\tpositions: null,\n  \t\t\t\t\t\tnormals: null,\n  \t\t\t\t\t\tindices: null\n  \t\t\t\t};\n\n  \t\t\t\tthis.transferList = null;\n  \t\t}\n\n  \t\tcreateClass(SurfaceExtractor, [{\n  \t\t\t\tkey: \"extract\",\n  \t\t\t\tvalue: function extract(chunk) {\n\n  \t\t\t\t\t\tvar message = this.message;\n  \t\t\t\t\t\tvar transferList = [];\n\n  \t\t\t\t\t\tthis.chunk.deserialise(chunk);\n  \t\t\t\t\t\tthis.chunk.data.decompress();\n\n  \t\t\t\t\t\tvar result = DualContouring.run(this.chunk);\n\n  \t\t\t\t\t\tif (result !== null) {\n\n  \t\t\t\t\t\t\t\tmessage.indices = result.indices;\n  \t\t\t\t\t\t\t\tmessage.positions = result.positions;\n  \t\t\t\t\t\t\t\tmessage.normals = result.normals;\n\n  \t\t\t\t\t\t\t\ttransferList.push(message.indices.buffer);\n  \t\t\t\t\t\t\t\ttransferList.push(message.positions.buffer);\n  \t\t\t\t\t\t\t\ttransferList.push(message.normals.buffer);\n  \t\t\t\t\t\t} else {\n\n  \t\t\t\t\t\t\t\tmessage.indices = null;\n  \t\t\t\t\t\t\t\tmessage.positions = null;\n  \t\t\t\t\t\t\t\tmessage.normals = null;\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tthis.chunk.deserialise(chunk);\n  \t\t\t\t\t\tmessage.chunk = this.chunk.serialise();\n  \t\t\t\t\t\tthis.transferList = this.chunk.createTransferList(transferList);\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn SurfaceExtractor;\n  }();\n\n  var Box3$1 = function () {\n  \tfunction Box3() {\n  \t\tvar min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1(Infinity, Infinity, Infinity);\n  \t\tvar max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1(-Infinity, -Infinity, -Infinity);\n  \t\tclassCallCheck(this, Box3);\n\n\n  \t\tthis.min = min;\n\n  \t\tthis.max = max;\n  \t}\n\n  \tcreateClass(Box3, [{\n  \t\tkey: \"set\",\n  \t\tvalue: function set$$1(min, max) {\n\n  \t\t\tthis.min.copy(min);\n  \t\t\tthis.max.copy(max);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"copy\",\n  \t\tvalue: function copy(b) {\n\n  \t\t\tthis.min.copy(b.min);\n  \t\t\tthis.max.copy(b.max);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"clone\",\n  \t\tvalue: function clone() {\n\n  \t\t\treturn new this.constructor().copy(this);\n  \t\t}\n  \t}, {\n  \t\tkey: \"expandByPoint\",\n  \t\tvalue: function expandByPoint(p) {\n\n  \t\t\tthis.min.min(p);\n  \t\t\tthis.max.max(p);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"union\",\n  \t\tvalue: function union(b) {\n\n  \t\t\tthis.min.min(b.min);\n  \t\t\tthis.max.max(b.max);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"setFromPoints\",\n  \t\tvalue: function setFromPoints(points) {\n\n  \t\t\tvar i = void 0,\n  \t\t\t    l = void 0;\n\n  \t\t\tfor (i = 0, l = points.length; i < l; ++i) {\n\n  \t\t\t\tthis.expandByPoint(points[i]);\n  \t\t\t}\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"setFromCenterAndSize\",\n  \t\tvalue: function setFromCenterAndSize(center, size) {\n\n  \t\t\tvar halfSize = size.clone().multiplyScalar(0.5);\n\n  \t\t\tthis.min.copy(center).sub(halfSize);\n  \t\t\tthis.max.copy(center).add(halfSize);\n\n  \t\t\treturn this;\n  \t\t}\n  \t}, {\n  \t\tkey: \"intersectsBox\",\n  \t\tvalue: function intersectsBox(box) {\n\n  \t\t\treturn !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);\n  \t\t}\n  \t}]);\n  \treturn Box3;\n  }();\n\n  var OperationType = {\n\n    UNION: \"csg.union\",\n    DIFFERENCE: \"csg.difference\",\n    INTERSECTION: \"csg.intersection\",\n    DENSITY_FUNCTION: \"csg.densityfunction\"\n\n  };\n\n  var Operation = function () {\n  \t\tfunction Operation(type) {\n  \t\t\t\tclassCallCheck(this, Operation);\n\n\n  \t\t\t\tthis.type = type;\n\n  \t\t\t\tfor (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n  \t\t\t\t\t\tchildren[_key - 1] = arguments[_key];\n  \t\t\t\t}\n\n  \t\t\t\tthis.children = children;\n\n  \t\t\t\tthis.bbox = null;\n  \t\t}\n\n  \t\tcreateClass(Operation, [{\n  \t\t\t\tkey: \"computeBoundingBox\",\n  \t\t\t\tvalue: function computeBoundingBox() {\n\n  \t\t\t\t\t\tvar children = this.children;\n\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    l = void 0;\n\n  \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n  \t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\t\t\t\t\t\tthis.bbox.union(children[i].boundingBox);\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn this.bbox;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"boundingBox\",\n  \t\t\t\tget: function get$$1() {\n\n  \t\t\t\t\t\treturn this.bbox !== null ? this.bbox : this.computeBoundingBox();\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Operation;\n  }();\n\n  var Union = function (_Operation) {\n  \tinherits(Union, _Operation);\n\n  \tfunction Union() {\n  \t\tvar _ref;\n\n  \t\tclassCallCheck(this, Union);\n\n  \t\tfor (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {\n  \t\t\tchildren[_key] = arguments[_key];\n  \t\t}\n\n  \t\treturn possibleConstructorReturn(this, (_ref = Union.__proto__ || Object.getPrototypeOf(Union)).call.apply(_ref, [this, OperationType.UNION].concat(children)));\n  \t}\n\n  \tcreateClass(Union, [{\n  \t\tkey: \"updateMaterialIndex\",\n  \t\tvalue: function updateMaterialIndex(index, data0, data1) {\n\n  \t\t\tvar materialIndex = data1.materialIndices[index];\n\n  \t\t\tif (materialIndex !== Material.AIR) {\n\n  \t\t\t\tdata0.setMaterialIndex(index, materialIndex);\n  \t\t\t}\n  \t\t}\n  \t}, {\n  \t\tkey: \"selectEdge\",\n  \t\tvalue: function selectEdge(edge0, edge1, s) {\n\n  \t\t\treturn s ? edge0.t > edge1.t ? edge0 : edge1 : edge0.t < edge1.t ? edge0 : edge1;\n  \t\t}\n  \t}]);\n  \treturn Union;\n  }(Operation);\n\n  var Difference = function (_Operation) {\n  \tinherits(Difference, _Operation);\n\n  \tfunction Difference() {\n  \t\tvar _ref;\n\n  \t\tclassCallCheck(this, Difference);\n\n  \t\tfor (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {\n  \t\t\tchildren[_key] = arguments[_key];\n  \t\t}\n\n  \t\treturn possibleConstructorReturn(this, (_ref = Difference.__proto__ || Object.getPrototypeOf(Difference)).call.apply(_ref, [this, OperationType.DIFFERENCE].concat(children)));\n  \t}\n\n  \tcreateClass(Difference, [{\n  \t\tkey: \"updateMaterialIndex\",\n  \t\tvalue: function updateMaterialIndex(index, data0, data1) {\n\n  \t\t\tif (data1.materialIndices[index] !== Material.AIR) {\n\n  \t\t\t\tdata0.setMaterialIndex(index, Material.AIR);\n  \t\t\t}\n  \t\t}\n  \t}, {\n  \t\tkey: \"selectEdge\",\n  \t\tvalue: function selectEdge(edge0, edge1, s) {\n\n  \t\t\treturn s ? edge0.t < edge1.t ? edge0 : edge1 : edge0.t > edge1.t ? edge0 : edge1;\n  \t\t}\n  \t}]);\n  \treturn Difference;\n  }(Operation);\n\n  var Intersection = function (_Operation) {\n  \tinherits(Intersection, _Operation);\n\n  \tfunction Intersection() {\n  \t\tvar _ref;\n\n  \t\tclassCallCheck(this, Intersection);\n\n  \t\tfor (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {\n  \t\t\tchildren[_key] = arguments[_key];\n  \t\t}\n\n  \t\treturn possibleConstructorReturn(this, (_ref = Intersection.__proto__ || Object.getPrototypeOf(Intersection)).call.apply(_ref, [this, OperationType.INTERSECTION].concat(children)));\n  \t}\n\n  \tcreateClass(Intersection, [{\n  \t\tkey: \"updateMaterialIndex\",\n  \t\tvalue: function updateMaterialIndex(index, data0, data1) {\n\n  \t\t\tvar materialIndex = data1.materialIndices[index];\n\n  \t\t\tdata0.setMaterialIndex(index, data0.materialIndices[index] !== Material.AIR && materialIndex !== Material.AIR ? materialIndex : Material.AIR);\n  \t\t}\n  \t}, {\n  \t\tkey: \"selectEdge\",\n  \t\tvalue: function selectEdge(edge0, edge1, s) {\n\n  \t\t\treturn s ? edge0.t < edge1.t ? edge0 : edge1 : edge0.t > edge1.t ? edge0 : edge1;\n  \t\t}\n  \t}]);\n  \treturn Intersection;\n  }(Operation);\n\n  function computeIndexBounds(chunk, operation) {\n\n  \tvar s = chunk.size;\n  \tvar n = chunk.resolution;\n\n  \tvar min = new Vector3$1(0, 0, 0);\n  \tvar max = new Vector3$1(n, n, n);\n\n  \tvar region = new Box3$1(chunk.min, chunk.max);\n\n  \tif (operation.type !== OperationType.INTERSECTION) {\n\n  \t\tif (operation.boundingBox.intersectsBox(region)) {\n\n  \t\t\tmin.copy(operation.boundingBox.min).max(region.min).sub(region.min);\n\n  \t\t\tmin.x = Math.ceil(min.x * n / s);\n  \t\t\tmin.y = Math.ceil(min.y * n / s);\n  \t\t\tmin.z = Math.ceil(min.z * n / s);\n\n  \t\t\tmax.copy(operation.boundingBox.max).min(region.max).sub(region.min);\n\n  \t\t\tmax.x = Math.floor(max.x * n / s);\n  \t\t\tmax.y = Math.floor(max.y * n / s);\n  \t\t\tmax.z = Math.floor(max.z * n / s);\n  \t\t} else {\n  \t\t\tmin.set(n, n, n);\n  \t\t\tmax.set(0, 0, 0);\n  \t\t}\n  \t}\n\n  \treturn new Box3$1(min, max);\n  }\n\n  function combineMaterialIndices(chunk, operation, data0, data1, bounds) {\n\n  \tvar m = chunk.resolution + 1;\n  \tvar mm = m * m;\n\n  \tvar X = bounds.max.x;\n  \tvar Y = bounds.max.y;\n  \tvar Z = bounds.max.z;\n\n  \tvar x = void 0,\n  \t    y = void 0,\n  \t    z = void 0;\n\n  \tfor (z = bounds.min.z; z <= Z; ++z) {\n\n  \t\tfor (y = bounds.min.y; y <= Y; ++y) {\n\n  \t\t\tfor (x = bounds.min.x; x <= X; ++x) {\n\n  \t\t\t\toperation.updateMaterialIndex(z * mm + y * m + x, data0, data1);\n  \t\t\t}\n  \t\t}\n  \t}\n  }\n\n  function generateMaterialIndices(chunk, operation, data, bounds) {\n\n  \tvar s = chunk.size;\n  \tvar n = chunk.resolution;\n  \tvar m = n + 1;\n  \tvar mm = m * m;\n\n  \tvar materialIndices = data.materialIndices;\n\n  \tvar base = chunk.min;\n  \tvar offset = new Vector3$1();\n  \tvar position = new Vector3$1();\n\n  \tvar X = bounds.max.x;\n  \tvar Y = bounds.max.y;\n  \tvar Z = bounds.max.z;\n\n  \tvar materialIndex = void 0;\n  \tvar materials = 0;\n\n  \tvar x = void 0,\n  \t    y = void 0,\n  \t    z = void 0;\n\n  \tfor (z = bounds.min.z; z <= Z; ++z) {\n\n  \t\toffset.z = z * s / n;\n\n  \t\tfor (y = bounds.min.y; y <= Y; ++y) {\n\n  \t\t\toffset.y = y * s / n;\n\n  \t\t\tfor (x = bounds.min.x; x <= X; ++x) {\n\n  \t\t\t\toffset.x = x * s / n;\n\n  \t\t\t\tmaterialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));\n\n  \t\t\t\tif (materialIndex !== Material.AIR) {\n\n  \t\t\t\t\tmaterialIndices[z * mm + y * m + x] = materialIndex;\n\n  \t\t\t\t\t++materials;\n  \t\t\t\t}\n  \t\t\t}\n  \t\t}\n  \t}\n\n  \tdata.materials = materials;\n  }\n\n  function combineEdges(chunk, operation, data0, data1) {\n\n  \tvar m = chunk.resolution + 1;\n  \tvar indexOffsets = new Uint32Array([1, m, m * m]);\n\n  \tvar materialIndices = data0.materialIndices;\n\n  \tvar edge1 = new Edge();\n  \tvar edge0 = new Edge();\n\n  \tvar edgeData1 = data1.edgeData;\n  \tvar edgeData0 = data0.edgeData;\n  \tvar edgeData = new EdgeData(chunk.resolution);\n  \tvar lengths = new Uint32Array(3);\n\n  \tvar edges1 = void 0,\n  \t    zeroCrossings1 = void 0,\n  \t    normals1 = void 0;\n  \tvar edges0 = void 0,\n  \t    zeroCrossings0 = void 0,\n  \t    normals0 = void 0;\n  \tvar edges = void 0,\n  \t    zeroCrossings = void 0,\n  \t    normals = void 0;\n\n  \tvar indexA1 = void 0,\n  \t    indexB1 = void 0;\n  \tvar indexA0 = void 0,\n  \t    indexB0 = void 0;\n\n  \tvar m1 = void 0,\n  \t    m2 = void 0;\n  \tvar edge = void 0;\n\n  \tvar c = void 0,\n  \t    d = void 0,\n  \t    i = void 0,\n  \t    j = void 0,\n  \t    il = void 0,\n  \t    jl = void 0;\n\n  \tfor (c = 0, d = 0; d < 3; c = 0, ++d) {\n\n  \t\tedges1 = edgeData1.edges[d];\n  \t\tedges0 = edgeData0.edges[d];\n  \t\tedges = edgeData.edges[d];\n\n  \t\tzeroCrossings1 = edgeData1.zeroCrossings[d];\n  \t\tzeroCrossings0 = edgeData0.zeroCrossings[d];\n  \t\tzeroCrossings = edgeData.zeroCrossings[d];\n\n  \t\tnormals1 = edgeData1.normals[d];\n  \t\tnormals0 = edgeData0.normals[d];\n  \t\tnormals = edgeData.normals[d];\n\n  \t\til = edges1.length;\n  \t\tjl = edges0.length;\n\n  \t\tfor (i = 0, j = 0; i < il; ++i) {\n\n  \t\t\tindexA1 = edges1[i];\n  \t\t\tindexB1 = indexA1 + indexOffsets[d];\n\n  \t\t\tm1 = materialIndices[indexA1];\n  \t\t\tm2 = materialIndices[indexB1];\n\n  \t\t\tif (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\n\n  \t\t\t\tedge1.t = zeroCrossings1[i];\n  \t\t\t\tedge1.n.x = normals1[i * 3];\n  \t\t\t\tedge1.n.y = normals1[i * 3 + 1];\n  \t\t\t\tedge1.n.z = normals1[i * 3 + 2];\n\n  \t\t\t\tif (operation.type === OperationType.DIFFERENCE) {\n\n  \t\t\t\t\tedge1.n.negate();\n  \t\t\t\t}\n\n  \t\t\t\tedge = edge1;\n\n  \t\t\t\twhile (j < jl && edges0[j] <= indexA1) {\n\n  \t\t\t\t\tindexA0 = edges0[j];\n  \t\t\t\t\tindexB0 = indexA0 + indexOffsets[d];\n\n  \t\t\t\t\tedge0.t = zeroCrossings0[j];\n  \t\t\t\t\tedge0.n.x = normals0[j * 3];\n  \t\t\t\t\tedge0.n.y = normals0[j * 3 + 1];\n  \t\t\t\t\tedge0.n.z = normals0[j * 3 + 2];\n\n  \t\t\t\t\tm1 = materialIndices[indexA0];\n\n  \t\t\t\t\tif (indexA0 < indexA1) {\n\n  \t\t\t\t\t\tm2 = materialIndices[indexB0];\n\n  \t\t\t\t\t\tif (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\n  \t\t\t\t\t\t\tedges[c] = indexA0;\n  \t\t\t\t\t\t\tzeroCrossings[c] = edge0.t;\n  \t\t\t\t\t\t\tnormals[c * 3] = edge0.n.x;\n  \t\t\t\t\t\t\tnormals[c * 3 + 1] = edge0.n.y;\n  \t\t\t\t\t\t\tnormals[c * 3 + 2] = edge0.n.z;\n\n  \t\t\t\t\t\t\t++c;\n  \t\t\t\t\t\t}\n  \t\t\t\t\t} else {\n  \t\t\t\t\t\tedge = operation.selectEdge(edge0, edge1, m1 === Material.SOLID);\n  \t\t\t\t\t}\n\n  \t\t\t\t\t++j;\n  \t\t\t\t}\n\n  \t\t\t\tedges[c] = indexA1;\n  \t\t\t\tzeroCrossings[c] = edge.t;\n  \t\t\t\tnormals[c * 3] = edge.n.x;\n  \t\t\t\tnormals[c * 3 + 1] = edge.n.y;\n  \t\t\t\tnormals[c * 3 + 2] = edge.n.z;\n\n  \t\t\t\t++c;\n  \t\t\t}\n  \t\t}\n\n  \t\twhile (j < jl) {\n\n  \t\t\tindexA0 = edges0[j];\n  \t\t\tindexB0 = indexA0 + indexOffsets[d];\n\n  \t\t\tm1 = materialIndices[indexA0];\n  \t\t\tm2 = materialIndices[indexB0];\n\n  \t\t\tif (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {\n\n  \t\t\t\tedges[c] = indexA0;\n  \t\t\t\tzeroCrossings[c] = zeroCrossings0[j];\n  \t\t\t\tnormals[c * 3] = normals0[j * 3];\n  \t\t\t\tnormals[c * 3 + 1] = normals0[j * 3 + 1];\n  \t\t\t\tnormals[c * 3 + 2] = normals0[j * 3 + 2];\n\n  \t\t\t\t++c;\n  \t\t\t}\n\n  \t\t\t++j;\n  \t\t}\n\n  \t\tlengths[d] = c;\n  \t}\n\n  \treturn { edgeData: edgeData, lengths: lengths };\n  }\n\n  function generateEdges(chunk, operation, data, bounds) {\n\n  \tvar s = chunk.size;\n  \tvar n = chunk.resolution;\n  \tvar m = n + 1;\n  \tvar mm = m * m;\n\n  \tvar indexOffsets = new Uint32Array([1, m, mm]);\n  \tvar materialIndices = data.materialIndices;\n\n  \tvar base = chunk.min;\n  \tvar offsetA = new Vector3$1();\n  \tvar offsetB = new Vector3$1();\n  \tvar edge = new Edge();\n\n  \tvar edgeData = new EdgeData(n);\n  \tvar lengths = new Uint32Array(3);\n\n  \tvar edges = void 0,\n  \t    zeroCrossings = void 0,\n  \t    normals = void 0;\n  \tvar indexA = void 0,\n  \t    indexB = void 0;\n\n  \tvar minX = void 0,\n  \t    minY = void 0,\n  \t    minZ = void 0;\n  \tvar maxX = void 0,\n  \t    maxY = void 0,\n  \t    maxZ = void 0;\n\n  \tvar c = void 0,\n  \t    d = void 0,\n  \t    a = void 0,\n  \t    axis = void 0;\n  \tvar x = void 0,\n  \t    y = void 0,\n  \t    z = void 0;\n\n  \tfor (a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {\n  \t\taxis = PATTERN[a];\n\n  \t\tedges = edgeData.edges[d];\n  \t\tzeroCrossings = edgeData.zeroCrossings[d];\n  \t\tnormals = edgeData.normals[d];\n\n  \t\tminX = bounds.min.x;maxX = bounds.max.x;\n  \t\tminY = bounds.min.y;maxY = bounds.max.y;\n  \t\tminZ = bounds.min.z;maxZ = bounds.max.z;\n\n  \t\tswitch (d) {\n\n  \t\t\tcase 0:\n  \t\t\t\tminX = Math.max(minX - 1, 0);\n  \t\t\t\tmaxX = Math.min(maxX, n - 1);\n  \t\t\t\tbreak;\n\n  \t\t\tcase 1:\n  \t\t\t\tminY = Math.max(minY - 1, 0);\n  \t\t\t\tmaxY = Math.min(maxY, n - 1);\n  \t\t\t\tbreak;\n\n  \t\t\tcase 2:\n  \t\t\t\tminZ = Math.max(minZ - 1, 0);\n  \t\t\t\tmaxZ = Math.min(maxZ, n - 1);\n  \t\t\t\tbreak;\n\n  \t\t}\n\n  \t\tfor (z = minZ; z <= maxZ; ++z) {\n\n  \t\t\tfor (y = minY; y <= maxY; ++y) {\n\n  \t\t\t\tfor (x = minX; x <= maxX; ++x) {\n\n  \t\t\t\t\tindexA = z * mm + y * m + x;\n  \t\t\t\t\tindexB = indexA + indexOffsets[d];\n\n  \t\t\t\t\tif (materialIndices[indexA] !== materialIndices[indexB]) {\n\n  \t\t\t\t\t\toffsetA.set(x * s / n, y * s / n, z * s / n);\n\n  \t\t\t\t\t\toffsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);\n\n  \t\t\t\t\t\tedge.a.addVectors(base, offsetA);\n  \t\t\t\t\t\tedge.b.addVectors(base, offsetB);\n\n  \t\t\t\t\t\toperation.generateEdge(edge);\n\n  \t\t\t\t\t\tedges[c] = indexA;\n  \t\t\t\t\t\tzeroCrossings[c] = edge.t;\n  \t\t\t\t\t\tnormals[c * 3] = edge.n.x;\n  \t\t\t\t\t\tnormals[c * 3 + 1] = edge.n.y;\n  \t\t\t\t\t\tnormals[c * 3 + 2] = edge.n.z;\n\n  \t\t\t\t\t\t++c;\n  \t\t\t\t\t}\n  \t\t\t\t}\n  \t\t\t}\n  \t\t}\n\n  \t\tlengths[d] = c;\n  \t}\n\n  \treturn { edgeData: edgeData, lengths: lengths };\n  }\n\n  function update(chunk, operation, data0, data1) {\n\n  \tvar bounds = computeIndexBounds(chunk, operation);\n\n  \tvar result = void 0,\n  \t    edgeData = void 0,\n  \t    lengths = void 0,\n  \t    d = void 0;\n  \tvar done = false;\n\n  \tif (operation.type === OperationType.DENSITY_FUNCTION) {\n\n  \t\tgenerateMaterialIndices(chunk, operation, data0, bounds);\n  \t} else if (data0.empty) {\n\n  \t\tif (operation.type === OperationType.UNION) {\n\n  \t\t\tdata0.set(data1);\n  \t\t\tdone = true;\n  \t\t}\n  \t} else {\n\n  \t\tcombineMaterialIndices(chunk, operation, data0, data1, bounds);\n  \t}\n\n  \tif (!done && !data0.empty && !data0.full) {\n\n  \t\tresult = operation.type === OperationType.DENSITY_FUNCTION ? generateEdges(chunk, operation, data0, bounds) : combineEdges(chunk, operation, data0, data1);\n\n  \t\tedgeData = result.edgeData;\n  \t\tlengths = result.lengths;\n\n  \t\tfor (d = 0; d < 3; ++d) {\n\n  \t\t\tedgeData.edges[d] = edgeData.edges[d].slice(0, lengths[d]);\n  \t\t\tedgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);\n  \t\t\tedgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);\n  \t\t}\n\n  \t\tdata0.edgeData = edgeData;\n  \t}\n  }\n\n  function execute(chunk, operation) {\n\n  \tvar children = operation.children;\n\n  \tvar result = void 0,\n  \t    data = void 0;\n  \tvar i = void 0,\n  \t    l = void 0;\n\n  \tif (operation.type === OperationType.DENSITY_FUNCTION) {\n  \t\tresult = new HermiteData();\n\n  \t\tupdate(chunk, operation, result);\n  \t}\n\n  \tfor (i = 0, l = children.length; i < l; ++i) {\n  \t\tdata = execute(chunk, children[i]);\n\n  \t\tif (result === undefined) {\n\n  \t\t\tresult = data;\n  \t\t} else if (data !== null) {\n\n  \t\t\tif (result === null) {\n\n  \t\t\t\tif (operation.type === OperationType.UNION) {\n  \t\t\t\t\tresult = data;\n  \t\t\t\t}\n  \t\t\t} else {\n  \t\t\t\tupdate(chunk, operation, result, data);\n  \t\t\t}\n  \t\t} else if (operation.type === OperationType.INTERSECTION) {\n  \t\t\tresult = null;\n  \t\t}\n\n  \t\tif (result === null && operation.type !== OperationType.UNION) {\n  \t\t\tbreak;\n  \t\t}\n  \t}\n\n  \treturn result !== null && result.empty ? null : result;\n  }\n\n  var ConstructiveSolidGeometry = function () {\n  \tfunction ConstructiveSolidGeometry() {\n  \t\tclassCallCheck(this, ConstructiveSolidGeometry);\n  \t}\n\n  \tcreateClass(ConstructiveSolidGeometry, null, [{\n  \t\tkey: \"run\",\n  \t\tvalue: function run(chunk, sdf) {\n\n  \t\t\tif (chunk.data === null) {\n\n  \t\t\t\tif (sdf.operation === OperationType.UNION) {\n\n  \t\t\t\t\tchunk.data = new HermiteData();\n  \t\t\t\t\tchunk.data.edgeData = new EdgeData(0);\n  \t\t\t\t}\n  \t\t\t} else {\n\n  \t\t\t\tchunk.data.decompress();\n  \t\t\t}\n\n  \t\t\tvar operation = sdf.toCSG();\n\n  \t\t\tvar data = chunk.data !== null ? execute(chunk, operation) : null;\n\n  \t\t\tif (data !== null) {\n  \t\t\t\tswitch (sdf.operation) {\n\n  \t\t\t\t\tcase OperationType.UNION:\n  \t\t\t\t\t\toperation = new Union(operation);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase OperationType.DIFFERENCE:\n  \t\t\t\t\t\toperation = new Difference(operation);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t\tcase OperationType.INTERSECTION:\n  \t\t\t\t\t\toperation = new Intersection(operation);\n  \t\t\t\t\t\tbreak;\n\n  \t\t\t\t}\n\n  \t\t\t\tupdate(chunk, operation, chunk.data, data);\n\n  \t\t\t\tchunk.data.lod = -1;\n  \t\t\t}\n\n  \t\t\tif (chunk.data !== null) {\n\n  \t\t\t\tif (chunk.data.empty) {\n\n  \t\t\t\t\tchunk.data = null;\n  \t\t\t\t} else {\n\n  \t\t\t\t\tchunk.data.compress();\n  \t\t\t\t}\n  \t\t\t}\n  \t\t}\n  \t}]);\n  \treturn ConstructiveSolidGeometry;\n  }();\n\n  var SDFType = {\n\n    SPHERE: \"sdf.sphere\",\n    BOX: \"sdf.box\",\n    TORUS: \"sdf.torus\",\n    PLANE: \"sdf.plane\",\n    HEIGHTFIELD: \"sdf.heightfield\"\n\n  };\n\n  var ISOVALUE = 0.0;\n\n  var DensityFunction = function (_Operation) {\n  \tinherits(DensityFunction, _Operation);\n\n  \tfunction DensityFunction(sdf) {\n  \t\tclassCallCheck(this, DensityFunction);\n\n  \t\tvar _this = possibleConstructorReturn(this, (DensityFunction.__proto__ || Object.getPrototypeOf(DensityFunction)).call(this, OperationType.DENSITY_FUNCTION));\n\n  \t\t_this.sdf = sdf;\n\n  \t\treturn _this;\n  \t}\n\n  \tcreateClass(DensityFunction, [{\n  \t\tkey: \"computeBoundingBox\",\n  \t\tvalue: function computeBoundingBox() {\n\n  \t\t\tthis.bbox = this.sdf.computeBoundingBox();\n\n  \t\t\treturn this.bbox;\n  \t\t}\n  \t}, {\n  \t\tkey: \"generateMaterialIndex\",\n  \t\tvalue: function generateMaterialIndex(position) {\n\n  \t\t\treturn this.sdf.sample(position) <= ISOVALUE ? this.sdf.material : Material.AIR;\n  \t\t}\n  \t}, {\n  \t\tkey: \"generateEdge\",\n  \t\tvalue: function generateEdge(edge) {\n\n  \t\t\tedge.approximateZeroCrossing(this.sdf);\n  \t\t\tedge.computeSurfaceNormal(this.sdf);\n  \t\t}\n  \t}]);\n  \treturn DensityFunction;\n  }(Operation);\n\n  var SignedDistanceFunction = function () {\n  \t\tfunction SignedDistanceFunction(type) {\n  \t\t\t\tvar material = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Material.SOLID;\n  \t\t\t\tclassCallCheck(this, SignedDistanceFunction);\n\n\n  \t\t\t\tthis.type = type;\n\n  \t\t\t\tthis.operation = null;\n\n  \t\t\t\tthis.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));\n\n  \t\t\t\tthis.children = [];\n\n  \t\t\t\tthis.bbox = null;\n  \t\t}\n\n  \t\tcreateClass(SignedDistanceFunction, [{\n  \t\t\t\tkey: \"union\",\n  \t\t\t\tvalue: function union(sdf) {\n\n  \t\t\t\t\t\tsdf.operation = OperationType.UNION;\n  \t\t\t\t\t\tthis.children.push(sdf);\n\n  \t\t\t\t\t\treturn this;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"subtract\",\n  \t\t\t\tvalue: function subtract(sdf) {\n\n  \t\t\t\t\t\tsdf.operation = OperationType.DIFFERENCE;\n  \t\t\t\t\t\tthis.children.push(sdf);\n\n  \t\t\t\t\t\treturn this;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"intersect\",\n  \t\t\t\tvalue: function intersect(sdf) {\n\n  \t\t\t\t\t\tsdf.operation = OperationType.INTERSECTION;\n  \t\t\t\t\t\tthis.children.push(sdf);\n\n  \t\t\t\t\t\treturn this;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"serialise\",\n  \t\t\t\tvalue: function serialise() {\n\n  \t\t\t\t\t\tvar result = {\n  \t\t\t\t\t\t\t\ttype: this.type,\n  \t\t\t\t\t\t\t\toperation: this.operation,\n  \t\t\t\t\t\t\t\tmaterial: this.material,\n  \t\t\t\t\t\t\t\tparameters: null,\n  \t\t\t\t\t\t\t\tchildren: []\n  \t\t\t\t\t\t};\n\n  \t\t\t\t\t\tvar children = this.children;\n\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    l = void 0;\n\n  \t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\t\t\t\t\t\tresult.children.push(children[i].serialise());\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn result;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"toCSG\",\n  \t\t\t\tvalue: function toCSG() {\n\n  \t\t\t\t\t\tvar children = this.children;\n\n  \t\t\t\t\t\tvar operation = new DensityFunction(this);\n  \t\t\t\t\t\tvar operationType = void 0;\n  \t\t\t\t\t\tvar child = void 0;\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    l = void 0;\n\n  \t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\t\t\t\t\t\tchild = children[i];\n\n  \t\t\t\t\t\t\t\tif (operationType !== child.operation) {\n\n  \t\t\t\t\t\t\t\t\t\toperationType = child.operation;\n\n  \t\t\t\t\t\t\t\t\t\tswitch (operationType) {\n\n  \t\t\t\t\t\t\t\t\t\t\t\tcase OperationType.UNION:\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\toperation = new Union(operation);\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n\n  \t\t\t\t\t\t\t\t\t\t\t\tcase OperationType.DIFFERENCE:\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\toperation = new Difference(operation);\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n\n  \t\t\t\t\t\t\t\t\t\t\t\tcase OperationType.INTERSECTION:\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\toperation = new Intersection(operation);\n  \t\t\t\t\t\t\t\t\t\t\t\t\t\tbreak;\n\n  \t\t\t\t\t\t\t\t\t\t}\n  \t\t\t\t\t\t\t\t}\n\n  \t\t\t\t\t\t\t\toperation.children.push(child.toCSG());\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn operation;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"computeBoundingBox\",\n  \t\t\t\tvalue: function computeBoundingBox() {\n\n  \t\t\t\t\t\tthrow new Error(\"SDF: bounding box method not implemented!\");\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"sample\",\n  \t\t\t\tvalue: function sample(position) {\n\n  \t\t\t\t\t\tthrow new Error(\"SDF: sample method not implemented!\");\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"boundingBox\",\n  \t\t\t\tget: function get$$1() {\n\n  \t\t\t\t\t\treturn this.bbox !== null ? this.bbox : this.computeBoundingBox();\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"completeBoundingBox\",\n  \t\t\t\tget: function get$$1() {\n\n  \t\t\t\t\t\tvar children = this.children;\n  \t\t\t\t\t\tvar bbox = this.boundingBox.clone();\n\n  \t\t\t\t\t\tvar i = void 0,\n  \t\t\t\t\t\t    l = void 0;\n\n  \t\t\t\t\t\tfor (i = 0, l = children.length; i < l; ++i) {\n\n  \t\t\t\t\t\t\t\tbbox.union(children[i].completeBoundingBox);\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn bbox;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn SignedDistanceFunction;\n  }();\n\n  var Sphere = function (_SignedDistanceFuncti) {\n  \t\tinherits(Sphere, _SignedDistanceFuncti);\n\n  \t\tfunction Sphere() {\n  \t\t\t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  \t\t\t\tvar material = arguments[1];\n  \t\t\t\tclassCallCheck(this, Sphere);\n\n  \t\t\t\tvar _this = possibleConstructorReturn(this, (Sphere.__proto__ || Object.getPrototypeOf(Sphere)).call(this, SDFType.SPHERE, material));\n\n  \t\t\t\t_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();\n\n  \t\t\t\t_this.radius = parameters.radius;\n\n  \t\t\t\treturn _this;\n  \t\t}\n\n  \t\tcreateClass(Sphere, [{\n  \t\t\t\tkey: \"computeBoundingBox\",\n  \t\t\t\tvalue: function computeBoundingBox() {\n\n  \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n  \t\t\t\t\t\tthis.bbox.min.copy(this.origin).subScalar(this.radius);\n  \t\t\t\t\t\tthis.bbox.max.copy(this.origin).addScalar(this.radius);\n\n  \t\t\t\t\t\treturn this.bbox;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"sample\",\n  \t\t\t\tvalue: function sample(position) {\n\n  \t\t\t\t\t\tvar origin = this.origin;\n\n  \t\t\t\t\t\tvar dx = position.x - origin.x;\n  \t\t\t\t\t\tvar dy = position.y - origin.y;\n  \t\t\t\t\t\tvar dz = position.z - origin.z;\n\n  \t\t\t\t\t\tvar length = Math.sqrt(dx * dx + dy * dy + dz * dz);\n\n  \t\t\t\t\t\treturn length - this.radius;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"serialise\",\n  \t\t\t\tvalue: function serialise() {\n\n  \t\t\t\t\t\tvar result = get(Sphere.prototype.__proto__ || Object.getPrototypeOf(Sphere.prototype), \"serialise\", this).call(this);\n\n  \t\t\t\t\t\tresult.parameters = {\n  \t\t\t\t\t\t\t\torigin: this.origin.toArray(),\n  \t\t\t\t\t\t\t\tradius: this.radius\n  \t\t\t\t\t\t};\n\n  \t\t\t\t\t\treturn result;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Sphere;\n  }(SignedDistanceFunction);\n\n  var Box = function (_SignedDistanceFuncti) {\n  \t\tinherits(Box, _SignedDistanceFuncti);\n\n  \t\tfunction Box() {\n  \t\t\t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  \t\t\t\tvar material = arguments[1];\n  \t\t\t\tclassCallCheck(this, Box);\n\n  \t\t\t\tvar _this = possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this, SDFType.BOX, material));\n\n  \t\t\t\t_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();\n\n  \t\t\t\t_this.halfDimensions = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.halfDimensions))))();\n\n  \t\t\t\treturn _this;\n  \t\t}\n\n  \t\tcreateClass(Box, [{\n  \t\t\t\tkey: \"computeBoundingBox\",\n  \t\t\t\tvalue: function computeBoundingBox() {\n\n  \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n  \t\t\t\t\t\tthis.bbox.min.subVectors(this.origin, this.halfDimensions);\n  \t\t\t\t\t\tthis.bbox.max.addVectors(this.origin, this.halfDimensions);\n\n  \t\t\t\t\t\treturn this.bbox;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"sample\",\n  \t\t\t\tvalue: function sample(position) {\n\n  \t\t\t\t\t\tvar origin = this.origin;\n  \t\t\t\t\t\tvar halfDimensions = this.halfDimensions;\n\n  \t\t\t\t\t\tvar dx = Math.abs(position.x - origin.x) - halfDimensions.x;\n  \t\t\t\t\t\tvar dy = Math.abs(position.y - origin.y) - halfDimensions.y;\n  \t\t\t\t\t\tvar dz = Math.abs(position.z - origin.z) - halfDimensions.z;\n\n  \t\t\t\t\t\tvar m = Math.max(dx, Math.max(dy, dz));\n\n  \t\t\t\t\t\tvar mx0 = Math.max(dx, 0);\n  \t\t\t\t\t\tvar my0 = Math.max(dy, 0);\n  \t\t\t\t\t\tvar mz0 = Math.max(dz, 0);\n\n  \t\t\t\t\t\tvar length = Math.sqrt(mx0 * mx0 + my0 * my0 + mz0 * mz0);\n\n  \t\t\t\t\t\treturn Math.min(m, 0) + length;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"serialise\",\n  \t\t\t\tvalue: function serialise() {\n\n  \t\t\t\t\t\tvar result = get(Box.prototype.__proto__ || Object.getPrototypeOf(Box.prototype), \"serialise\", this).call(this);\n\n  \t\t\t\t\t\tresult.parameters = {\n  \t\t\t\t\t\t\t\torigin: this.origin.toArray(),\n  \t\t\t\t\t\t\t\thalfDimensions: this.halfDimensions.toArray()\n  \t\t\t\t\t\t};\n\n  \t\t\t\t\t\treturn result;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Box;\n  }(SignedDistanceFunction);\n\n  var Plane = function (_SignedDistanceFuncti) {\n  \tinherits(Plane, _SignedDistanceFuncti);\n\n  \tfunction Plane() {\n  \t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  \t\tvar material = arguments[1];\n  \t\tclassCallCheck(this, Plane);\n\n  \t\tvar _this = possibleConstructorReturn(this, (Plane.__proto__ || Object.getPrototypeOf(Plane)).call(this, SDFType.PLANE, material));\n\n  \t\t_this.normal = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.normal))))();\n\n  \t\t_this.constant = parameters.constant;\n\n  \t\treturn _this;\n  \t}\n\n  \tcreateClass(Plane, [{\n  \t\tkey: \"computeBoundingBox\",\n  \t\tvalue: function computeBoundingBox() {\n\n  \t\t\tthis.bbox = new Box3$1();\n\n  \t\t\treturn this.bbox;\n  \t\t}\n  \t}, {\n  \t\tkey: \"sample\",\n  \t\tvalue: function sample(position) {\n\n  \t\t\treturn this.normal.dot(position) + this.constant;\n  \t\t}\n  \t}, {\n  \t\tkey: \"serialise\",\n  \t\tvalue: function serialise() {\n\n  \t\t\tvar result = get(Plane.prototype.__proto__ || Object.getPrototypeOf(Plane.prototype), \"serialise\", this).call(this);\n\n  \t\t\tresult.parameters = {\n  \t\t\t\tnormal: this.normal.toArray(),\n  \t\t\t\tconstant: this.constant\n  \t\t\t};\n\n  \t\t\treturn result;\n  \t\t}\n  \t}]);\n  \treturn Plane;\n  }(SignedDistanceFunction);\n\n  var Torus = function (_SignedDistanceFuncti) {\n  \t\tinherits(Torus, _SignedDistanceFuncti);\n\n  \t\tfunction Torus() {\n  \t\t\t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  \t\t\t\tvar material = arguments[1];\n  \t\t\t\tclassCallCheck(this, Torus);\n\n  \t\t\t\tvar _this = possibleConstructorReturn(this, (Torus.__proto__ || Object.getPrototypeOf(Torus)).call(this, SDFType.TORUS, material));\n\n  \t\t\t\t_this.origin = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.origin))))();\n\n  \t\t\t\t_this.R = parameters.R;\n\n  \t\t\t\t_this.r = parameters.r;\n\n  \t\t\t\treturn _this;\n  \t\t}\n\n  \t\tcreateClass(Torus, [{\n  \t\t\t\tkey: \"computeBoundingBox\",\n  \t\t\t\tvalue: function computeBoundingBox() {\n\n  \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n  \t\t\t\t\t\tthis.bbox.min.copy(this.origin).subScalar(this.R).subScalar(this.r);\n  \t\t\t\t\t\tthis.bbox.max.copy(this.origin).addScalar(this.R).addScalar(this.r);\n\n  \t\t\t\t\t\treturn this.bbox;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"sample\",\n  \t\t\t\tvalue: function sample(position) {\n\n  \t\t\t\t\t\tvar origin = this.origin;\n\n  \t\t\t\t\t\tvar dx = position.x - origin.x;\n  \t\t\t\t\t\tvar dy = position.y - origin.y;\n  \t\t\t\t\t\tvar dz = position.z - origin.z;\n\n  \t\t\t\t\t\tvar q = Math.sqrt(dx * dx + dz * dz) - this.R;\n  \t\t\t\t\t\tvar length = Math.sqrt(q * q + dy * dy);\n\n  \t\t\t\t\t\treturn length - this.r;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"serialise\",\n  \t\t\t\tvalue: function serialise() {\n\n  \t\t\t\t\t\tvar result = get(Torus.prototype.__proto__ || Object.getPrototypeOf(Torus.prototype), \"serialise\", this).call(this);\n\n  \t\t\t\t\t\tresult.parameters = {\n  \t\t\t\t\t\t\t\torigin: this.origin.toArray(),\n  \t\t\t\t\t\t\t\tR: this.R,\n  \t\t\t\t\t\t\t\tr: this.r\n  \t\t\t\t\t\t};\n\n  \t\t\t\t\t\treturn result;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Torus;\n  }(SignedDistanceFunction);\n\n  var Heightfield = function (_SignedDistanceFuncti) {\n  \t\tinherits(Heightfield, _SignedDistanceFuncti);\n\n  \t\tfunction Heightfield() {\n  \t\t\t\tvar parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  \t\t\t\tvar material = arguments[1];\n  \t\t\t\tclassCallCheck(this, Heightfield);\n\n  \t\t\t\tvar _this = possibleConstructorReturn(this, (Heightfield.__proto__ || Object.getPrototypeOf(Heightfield)).call(this, SDFType.HEIGHTFIELD, material));\n\n  \t\t\t\t_this.min = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.min))))();\n\n  \t\t\t\t_this.dimensions = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.size))))();\n\n  \t\t\t\t_this.data = parameters.data;\n\n  \t\t\t\treturn _this;\n  \t\t}\n\n  \t\tcreateClass(Heightfield, [{\n  \t\t\t\tkey: \"computeBoundingBox\",\n  \t\t\t\tvalue: function computeBoundingBox() {\n\n  \t\t\t\t\t\tthis.bbox = new Box3$1();\n\n  \t\t\t\t\t\tthis.bbox.min.copy(this.min);\n  \t\t\t\t\t\tthis.bbox.max.addVectors(this.min, this.dimensions);\n\n  \t\t\t\t\t\treturn this.bbox;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"sample\",\n  \t\t\t\tvalue: function sample(position) {\n\n  \t\t\t\t\t\tvar min = this.min;\n  \t\t\t\t\t\tvar dimensions = this.dimensions;\n\n  \t\t\t\t\t\tvar x = Math.max(min.x, Math.min(min.x + dimensions.x, position.x - min.x));\n  \t\t\t\t\t\tvar z = Math.max(min.z, Math.min(min.z + dimensions.z, position.z - min.z));\n\n  \t\t\t\t\t\tvar y = position.y - min.y;\n\n  \t\t\t\t\t\treturn y - this.data[z * dimensions.x + x] / 255 * dimensions.y;\n  \t\t\t\t}\n  \t\t}, {\n  \t\t\t\tkey: \"serialise\",\n  \t\t\t\tvalue: function serialise() {\n\n  \t\t\t\t\t\tvar result = get(Heightfield.prototype.__proto__ || Object.getPrototypeOf(Heightfield.prototype), \"serialise\", this).call(this);\n\n  \t\t\t\t\t\tresult.parameters = {\n  \t\t\t\t\t\t\t\tmin: this.min.toArray(),\n  \t\t\t\t\t\t\t\tdimensions: this.dimensions.toArray(),\n  \t\t\t\t\t\t\t\tdata: this.data\n  \t\t\t\t\t\t};\n\n  \t\t\t\t\t\treturn result;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Heightfield;\n  }(SignedDistanceFunction);\n\n  var Reviver = function () {\n  \t\tfunction Reviver() {\n  \t\t\t\tclassCallCheck(this, Reviver);\n  \t\t}\n\n  \t\tcreateClass(Reviver, null, [{\n  \t\t\t\tkey: \"reviveSDF\",\n  \t\t\t\tvalue: function reviveSDF(description) {\n\n  \t\t\t\t\t\tvar sdf = void 0,\n  \t\t\t\t\t\t    i = void 0,\n  \t\t\t\t\t\t    l = void 0;\n\n  \t\t\t\t\t\tswitch (description.type) {\n\n  \t\t\t\t\t\t\t\tcase SDFType.SPHERE:\n  \t\t\t\t\t\t\t\t\t\tsdf = new Sphere(description.parameters, description.material);\n  \t\t\t\t\t\t\t\t\t\tbreak;\n\n  \t\t\t\t\t\t\t\tcase SDFType.BOX:\n  \t\t\t\t\t\t\t\t\t\tsdf = new Box(description.parameters, description.material);\n  \t\t\t\t\t\t\t\t\t\tbreak;\n\n  \t\t\t\t\t\t\t\tcase SDFType.TORUS:\n  \t\t\t\t\t\t\t\t\t\tsdf = new Torus(description.parameters, description.material);\n  \t\t\t\t\t\t\t\t\t\tbreak;\n\n  \t\t\t\t\t\t\t\tcase SDFType.PLANE:\n  \t\t\t\t\t\t\t\t\t\tsdf = new Plane(description.parameters, description.material);\n  \t\t\t\t\t\t\t\t\t\tbreak;\n\n  \t\t\t\t\t\t\t\tcase SDFType.HEIGHTFIELD:\n  \t\t\t\t\t\t\t\t\t\tsdf = new Heightfield(description.parameters, description.material);\n  \t\t\t\t\t\t\t\t\t\tbreak;\n\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\tsdf.operation = description.operation;\n\n  \t\t\t\t\t\tfor (i = 0, l = description.children.length; i < l; ++i) {\n\n  \t\t\t\t\t\t\t\tsdf.children.push(this.reviveSDF(description.children[i]));\n  \t\t\t\t\t\t}\n\n  \t\t\t\t\t\treturn sdf;\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn Reviver;\n  }();\n\n  var VolumeModifier = function () {\n  \t\tfunction VolumeModifier() {\n  \t\t\t\tclassCallCheck(this, VolumeModifier);\n\n\n  \t\t\t\tthis.chunk = new Chunk();\n\n  \t\t\t\tthis.message = {\n  \t\t\t\t\t\taction: Action.MODIFY,\n  \t\t\t\t\t\tchunk: null\n  \t\t\t\t};\n\n  \t\t\t\tthis.transferList = null;\n  \t\t}\n\n  \t\tcreateClass(VolumeModifier, [{\n  \t\t\t\tkey: \"modify\",\n  \t\t\t\tvalue: function modify(chunk, sdf) {\n  \t\t\t\t\t\tthis.chunk.deserialise(chunk);\n\n  \t\t\t\t\t\tConstructiveSolidGeometry.run(this.chunk, Reviver.reviveSDF(sdf));\n\n  \t\t\t\t\t\tthis.message.chunk = this.chunk.serialise();\n  \t\t\t\t\t\tthis.transferList = this.chunk.createTransferList();\n  \t\t\t\t}\n  \t\t}]);\n  \t\treturn VolumeModifier;\n  }();\n\n  var surfaceExtractor = new SurfaceExtractor();\n\n  var volumeModifier = new VolumeModifier();\n\n  self.addEventListener(\"message\", function onMessage(event) {\n\n  \tvar data = event.data;\n\n  \tswitch (data.action) {\n\n  \t\tcase Action.EXTRACT:\n  \t\t\tsurfaceExtractor.extract(data.chunk);\n  \t\t\tpostMessage(surfaceExtractor.message, surfaceExtractor.transferList);\n  \t\t\tbreak;\n\n  \t\tcase Action.MODIFY:\n  \t\t\tvolumeModifier.modify(data.chunk, data.sdf);\n  \t\t\tpostMessage(volumeModifier.message, volumeModifier.transferList);\n  \t\t\tbreak;\n\n  \t\tcase Action.CLOSE:\n  \t\tdefault:\n  \t\t\tclose();\n\n  \t}\n  });\n\n  self.addEventListener(\"error\", function onError(event) {\n\n  \tvar message = {\n  \t\taction: Action.CLOSE,\n  \t\terror: event.message,\n  \t\tdata: null\n  \t};\n\n  \tvar transferList = [];\n\n  \tvar chunks = [surfaceExtractor.chunk, volumeModifier.chunk];\n\n  \tif (chunks[0].data !== null && !chunks[0].data.neutered) {\n\n  \t\tmessage.chunk = chunks[0].serialise();\n  \t\tchunks[0].createTransferList(transferList);\n  \t} else if (chunks[1].data !== null && !chunks[1].data.neutered) {\n\n  \t\tmessage.chunk = chunks[1].serialise();\n  \t\tchunks[1].createTransferList(transferList);\n  \t}\n\n  \tpostMessage(message, transferList);\n  \tclose();\n  });\n\n}());\n";

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
  												} else if (data !== null && !data.full) {

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
  	var edgeData = new EdgeData(chunk.resolution);
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

  		combineMaterialIndices(chunk, operation, data0, data1, bounds);
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

  var Button = {

    MAIN: 0,
    AUXILIARY: 1,
    SECONDARY: 2

  };

  var OctreeHelper = function (_Object3D) {
  		inherits(OctreeHelper, _Object3D);

  		function OctreeHelper() {
  				var octree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				classCallCheck(this, OctreeHelper);

  				var _this = possibleConstructorReturn(this, (OctreeHelper.__proto__ || Object.getPrototypeOf(OctreeHelper)).call(this));

  				_this.name = "OctreeHelper";

  				_this.octree = octree;

  				_this.update();

  				return _this;
  		}

  		createClass(OctreeHelper, [{
  				key: "createLineSegments",
  				value: function createLineSegments(octants) {

  						var maxOctants = Math.pow(2, 16) / 8 - 1;
  						var group = new three.Object3D();

  						var material = new three.LineBasicMaterial({
  								color: 0xffffff * Math.random()
  						});

  						var octantCount = octants.length;
  						var vertexCount = void 0;
  						var length = void 0;

  						var indices = void 0,
  						    positions = void 0;
  						var octant = void 0,
  						    min = void 0,
  						    max = void 0;
  						var geometry = void 0;

  						var i = void 0,
  						    j = void 0,
  						    c = void 0,
  						    d = void 0,
  						    n = void 0;
  						var corner = void 0,
  						    edge = void 0;

  						for (i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

  								length += octantCount < maxOctants ? octantCount : maxOctants;
  								octantCount -= maxOctants;

  								vertexCount = length * 8;
  								indices = new Uint16Array(vertexCount * 3);
  								positions = new Float32Array(vertexCount * 3);

  								for (c = 0, d = 0; i < length; ++i) {

  										octant = octants[i];
  										min = octant.min;
  										max = octant.max;

  										for (j = 0; j < 12; ++j) {

  												edge = EDGES[j];

  												indices[d++] = c + edge[0];
  												indices[d++] = c + edge[1];
  										}

  										for (j = 0; j < 8; ++j, ++c) {

  												corner = PATTERN[j];

  												positions[c * 3] = corner[0] === 0 ? min.x : max.x;
  												positions[c * 3 + 1] = corner[1] === 0 ? min.y : max.y;
  												positions[c * 3 + 2] = corner[2] === 0 ? min.z : max.z;
  										}
  								}

  								geometry = new three.BufferGeometry();
  								geometry.setIndex(new three.BufferAttribute(indices, 1));
  								geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

  								group.add(new three.LineSegments(geometry, material));
  						}

  						this.add(group);
  				}
  		}, {
  				key: "update",
  				value: function update() {

  						var depth = this.octree !== null ? this.octree.getDepth() : -1;

  						var level = 0;

  						this.dispose();

  						while (level <= depth) {

  								this.createLineSegments(this.octree.findOctantsByLevel(level));

  								++level;
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

  						while (this.children.length > 0) {

  								this.remove(this.children[0]);
  						}
  				}
  		}]);
  		return OctreeHelper;
  }(three.Object3D);

  var mouse = new three.Vector2();

  var Editor = function () {
  		function Editor(terrain, camera) {
  				var dom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
  				classCallCheck(this, Editor);


  				this.terrain = terrain;

  				this.camera = camera;

  				this.dom = dom;

  				this.raycaster = new three.Raycaster();

  				this.cursorSize = 1;

  				this.cursor = new three.Mesh(new three.SphereBufferGeometry(this.cursorSize, 16, 16), new three.MeshBasicMaterial({
  						transparent: true,
  						opacity: 0.5,
  						color: 0x0096ff,
  						fog: false
  				}));

  				this.octreeHelper = new OctreeHelper(this.terrain.volume);
  				this.octreeHelper.visible = false;

  				this.chunkHelper = new ChunkHelper();
  				this.chunkHelper.visible = false;

  				this.delta = "";

  				this.setEnabled(true);
  		}

  		createClass(Editor, [{
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

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
  		}, {
  				key: "handlePointerEvent",
  				value: function handlePointerEvent(event, pressed) {

  						event.preventDefault();

  						switch (event.button) {

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
  		}, {
  				key: "handleMain",
  				value: function handleMain(pressed) {

  						if (pressed) {

  								this.terrain.union(new Sphere({
  										origin: this.cursor.position.toArray(),
  										radius: this.cursorSize
  								}));
  						}
  				}
  		}, {
  				key: "handleAuxiliary",
  				value: function handleAuxiliary(pressed) {}
  		}, {
  				key: "handleSecondary",
  				value: function handleSecondary(pressed) {

  						if (pressed) {

  								this.terrain.subtract(new Sphere({
  										origin: this.cursor.position.toArray(),
  										radius: this.cursorSize
  								}));
  						}
  				}
  		}, {
  				key: "handleModification",
  				value: function handleModification(event) {

  						if (this.chunkHelper.visible) {

  								this.chunkHelper.chunk = event.chunk;
  								this.chunkHelper.update(false, true);
  						}

  						if (this.octreeHelper.visible) {

  								this.octreeHelper.update();
  						}
  				}
  		}, {
  				key: "raycast",
  				value: function raycast(event) {

  						var raycaster = this.raycaster;
  						var t0 = performance.now();

  						mouse.x = event.clientX / window.innerWidth * 2 - 1;
  						mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  						raycaster.setFromCamera(mouse, this.camera);
  						var intersects = this.terrain.raycast(raycaster);

  						this.delta = (performance.now() - t0).toFixed(2) + " ms";

  						if (intersects.length > 0) {

  								this.cursor.position.copy(intersects[0].point);
  						} else {

  								this.cursor.position.copy(raycaster.ray.direction).multiplyScalar(15).add(raycaster.ray.origin);
  						}
  				}
  		}, {
  				key: "setEnabled",
  				value: function setEnabled(enabled) {

  						var terrain = this.terrain;
  						var dom = this.dom;

  						if (enabled) {

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
  		}, {
  				key: "dispose",
  				value: function dispose() {
  						this.setEnabled(false);
  				}
  		}, {
  				key: "logMemory",
  				value: function logMemory() {

  						var a = document.createElement("a");
  						var chunks = this.terrain.volume.getChunks();

  						var n = this.terrain.volume.resolution;
  						var m = Math.pow(n + 1, 3);
  						var c = 3 * Math.pow(n + 1, 2) * n;

  						var materialReport = "";
  						var edgeReport = "";

  						var maxMaterials = 0;
  						var maxEdges = 0;

  						var chunkCount = 0;

  						var materialCount = 0;
  						var runLengthCount = 0;
  						var edgeCount = 0;

  						var data = void 0,
  						    edgeData = void 0,
  						    edges = void 0;
  						var i = void 0,
  						    j = void 0,
  						    l = void 0;

  						for (i = 0, j = 0, l = chunks.length; i < l; ++i) {

  								data = chunks[i].data;

  								if (data !== null) {

  										edgeData = data.edgeData;

  										edges = edgeData.edges[0].length + edgeData.edges[1].length + edgeData.edges[2].length;

  										materialReport += j + ", " + (data.materials + data.runLengths.length * 4) + "\n";
  										edgeReport += j + ", " + edges + "\n";

  										materialCount += data.materials;
  										runLengthCount += data.runLengths.length;
  										edgeCount += edges;

  										++chunkCount;
  										++j;
  								}
  						}

  						maxMaterials = chunkCount * m;
  						maxEdges = chunkCount * c;

  						var report = "Volume Chunks: " + chunkCount + "\n\n";

  						report += "Total Materials: " + materialCount + " (" + maxMaterials + " max)\n";
  						report += "Total Run-Lengths: " + runLengthCount + "\n";
  						report += "Compression Ratio: " + (maxMaterials / (materialCount + runLengthCount * 4)).toFixed(2) + "\n";
  						report += "Space Savings: " + ((1 - (materialCount + runLengthCount * 4) / maxMaterials) * 100).toFixed(2) + "%\n";
  						report += "Estimated Memory Usage: " + ((materialCount * 8 + runLengthCount * 32) / 8 / 1024 / 1024).toFixed(2) + " MB\n";

  						report += "\n";

  						report += "Total Edges: " + edgeCount + " (" + maxEdges + " max)\n";
  						report += "Compression Ratio: " + (maxEdges / edgeCount).toFixed(2) + "\n";
  						report += "Space Savings: " + ((1 - edgeCount / maxEdges) * 100).toFixed(2) + "%\n";
  						report += "Estimated Memory Usage: " + ((edgeCount * 32 + edgeCount * 32 + 3 * edgeCount * 32) / 8 / 1024 / 1024).toFixed(2) + " MB\n";

  						report += "\n";

  						report += "Material Counts\n\n";
  						report += materialReport;

  						report += "\n";

  						report += "Edge Counts\n\n";
  						report += edgeReport + "\n";

  						a.href = URL.createObjectURL(new Blob([report], {
  								type: "text/plain"
  						}));

  						a.download = "memory.txt";
  						a.click();
  				}
  		}, {
  				key: "save",
  				value: function save() {

  						var a = document.createElement("a");
  						a.href = this.terrain.save();
  						a.download = "terrain.json";
  						a.click();
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {
  						var _this = this;

  						var folder = gui.addFolder("Editor");

  						var params = {
  								hermiteData: this.chunkHelper.visible,
  								octree: this.octreeHelper.visible
  						};

  						folder.add(this, "delta").listen();

  						folder.add(this, "cursorSize").min(1).max(10).step(0.01).onChange(function () {

  								_this.cursor.scale.set(_this.cursorSize, _this.cursorSize, _this.cursorSize);
  						});

  						folder.add(params, "hermiteData").onChange(function () {

  								_this.chunkHelper.dispose();
  								_this.chunkHelper.visible = params.hermiteData;
  						});

  						folder.add(params, "octree").onChange(function () {

  								_this.octreeHelper.update();
  								_this.octreeHelper.visible = params.octree;
  						});

  						folder.add(this, "logMemory");
  						folder.add(this, "save");
  				}
  		}]);
  		return Editor;
  }();

  var TerrainStats = function () {
  		function TerrainStats(terrain) {
  				classCallCheck(this, TerrainStats);


  				this.stats = new Stats();

  				this.terrain = terrain;

  				this.modificationPanel = this.stats.addPanel(new Stats.Panel("CSG", "#ff8", "#221"));

  				this.extractionPanel = this.stats.addPanel(new Stats.Panel("DC", "#f8f", "#212"));

  				this.deltas = {
  						modificationend: [],
  						extractionend: []
  				};

  				this.timestamps = new Map();

  				this.maxDeltas = new Map();

  				this.setEnabled(true);
  		}

  		createClass(TerrainStats, [{
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "extractionstart":
  								case "modificationstart":
  										this.timestamps.set(event.chunk, performance.now());
  										break;

  								case "modificationend":
  										this.measureTime(event, this.modificationPanel);
  										break;

  								case "extractionend":
  										this.measureTime(event, this.extractionPanel);
  										break;

  						}
  				}
  		}, {
  				key: "measureTime",
  				value: function measureTime(event, panel) {

  						var maxDeltas = this.maxDeltas;
  						var timestamps = this.timestamps;

  						var delta = performance.now() - timestamps.get(event.chunk);
  						var maxDelta = maxDeltas.has(event.type) ? maxDeltas.get(event.type) : 0.0;

  						if (delta > maxDelta) {

  								maxDeltas.set(event.type, delta);
  						}

  						this.deltas[event.type].push(delta);

  						panel.update(delta, maxDelta);
  						timestamps.delete(event.chunk);
  				}
  		}, {
  				key: "setEnabled",
  				value: function setEnabled(enabled) {

  						var terrain = this.terrain;

  						if (enabled) {

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
  		}, {
  				key: "dispose",
  				value: function dispose() {
  						this.setEnabled(false);
  				}
  		}, {
  				key: "log",
  				value: function log() {

  						var deltas = this.deltas;
  						var a = document.createElement("a");

  						var text = "";
  						var i = void 0,
  						    l = void 0;

  						text += "Modifications\n\n";

  						for (i = 0, l = deltas.modificationend.length; i < l; ++i) {

  								text += i + ", " + deltas.modificationend[i] + "\n";
  						}

  						text += "\n\n";
  						text += "Extractions\n\n";

  						for (i = 0, l = deltas.extractionend.length; i < l; ++i) {

  								text += i + ", " + deltas.extractionend[i] + "\n";
  						}

  						a.href = URL.createObjectURL(new Blob([text], {
  								type: "text/plain"
  						}));

  						a.download = "stats.txt";
  						a.click();
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {

  						var folder = gui.addFolder("Stats");

  						folder.add(this, "log");
  				}
  		}]);
  		return TerrainStats;
  }();

  var MovementState = function () {
  		function MovementState() {
  				classCallCheck(this, MovementState);


  				this.left = false;

  				this.right = false;

  				this.forward = false;

  				this.backward = false;

  				this.up = false;

  				this.down = false;

  				this.boost = false;
  		}

  		createClass(MovementState, [{
  				key: "reset",
  				value: function reset() {

  						this.left = false;
  						this.right = false;
  						this.forward = false;
  						this.backward = false;

  						this.up = false;
  						this.down = false;
  						this.boost = false;
  				}
  		}]);
  		return MovementState;
  }();

  var Key = {

    WASD: [87, 65, 83, 68],
    X: 88,
    ARROWS: [37, 38, 39, 40],
    SPACE: 32,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18

  };

  var TWO_PI = 2 * Math.PI;

  var Controls = function () {
  	function Controls(object) {
  		var dom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
  		classCallCheck(this, Controls);


  		this.object = object;

  		this.dom = dom;

  		this.target = new three.Vector3();

  		this.spherical = new three.Spherical();

  		this.movementSpeed = 1.0;

  		this.boostSpeed = 2.0;

  		this.lookSpeed = 0.002;

  		this.state = new MovementState();

  		this.setEnabled(true);
  	}

  	createClass(Controls, [{
  		key: "handleEvent",
  		value: function handleEvent(event) {

  			switch (event.type) {

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
  	}, {
  		key: "handlePointerLock",
  		value: function handlePointerLock() {

  			if (document.pointerLockElement === this.dom) {

  				this.dom.addEventListener("mousemove", this);
  			} else {

  				this.dom.removeEventListener("mousemove", this);
  			}
  		}
  	}, {
  		key: "handlePointerEvent",
  		value: function handlePointerEvent(event, pressed) {

  			event.preventDefault();

  			switch (event.button) {

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
  	}, {
  		key: "handleMain",
  		value: function handleMain(pressed) {

  			if (document.pointerLockElement !== this.dom && pressed) {

  				if (this.dom.requestPointerLock !== undefined) {

  					this.dom.requestPointerLock();
  				}
  			} else {

  				if (document.exitPointerLock !== undefined) {

  					document.exitPointerLock();
  				}
  			}
  		}
  	}, {
  		key: "handleAuxiliary",
  		value: function handleAuxiliary(pressed) {}
  	}, {
  		key: "handleSecondary",
  		value: function handleSecondary(pressed) {

  			this.handleMain(pressed);
  		}
  	}, {
  		key: "changeMovementState",
  		value: function changeMovementState(event, s) {

  			var state = this.state;

  			switch (event.keyCode) {

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
  	}, {
  		key: "look",
  		value: function look(event) {

  			var s = this.spherical;

  			s.theta -= event.movementX * this.lookSpeed;
  			s.phi += event.movementY * this.lookSpeed;

  			s.theta %= TWO_PI;
  			s.makeSafe();

  			this.object.lookAt(this.target.setFromSpherical(s).add(this.object.position));
  		}
  	}, {
  		key: "move",
  		value: function move(delta) {

  			var object = this.object;
  			var state = this.state;

  			var step = delta * (state.boost ? this.boostSpeed : this.movementSpeed);

  			if (state.backward) {

  				object.translateZ(step);
  			} else if (state.forward) {

  				object.translateZ(-step);
  			}

  			if (state.right) {

  				object.translateX(step);
  			} else if (state.left) {

  				object.translateX(-step);
  			}

  			if (state.up) {

  				object.translateY(step);
  			} else if (state.down) {

  				object.translateY(-step);
  			}
  		}
  	}, {
  		key: "update",
  		value: function update(delta) {

  			this.move(delta);
  		}
  	}, {
  		key: "focus",
  		value: function focus(target) {

  			this.object.lookAt(target);
  			this.target.subVectors(target, this.object.position);
  			this.spherical.setFromVector3(this.target);
  		}
  	}, {
  		key: "setEnabled",
  		value: function setEnabled(enabled) {

  			var dom = this.dom;

  			this.state.reset();

  			if (enabled) {

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

  			if (document.exitPointerLock !== undefined) {

  				document.exitPointerLock();
  			}
  		}
  	}, {
  		key: "dispose",
  		value: function dispose() {
  			this.setEnabled(false);
  		}
  	}]);
  	return Controls;
  }();

  var App = function () {
  		function App() {
  				classCallCheck(this, App);
  		}

  		createClass(App, null, [{
  				key: "initialise",
  				value: function initialise(viewport, aside, assets) {

  						var width = window.innerWidth;
  						var height = window.innerHeight;
  						var aspect = width / height;

  						var clock = new three.Clock();

  						var scene = new three.Scene();
  						scene.fog = new three.FogExp2(0xb5c1af, 0.0025);
  						scene.background = assets.has("sky") ? assets.get("sky") : null;

  						var renderer = new three.WebGLRenderer({
  								logarithmicDepthBuffer: true,
  								antialias: true
  						});

  						renderer.setSize(width, height);
  						renderer.setClearColor(scene.fog.color);
  						renderer.setPixelRatio(window.devicePixelRatio);
  						viewport.appendChild(renderer.domElement);

  						var camera = new three.PerspectiveCamera(50, aspect, 0.1, 1000);
  						var controls = new Controls(camera, renderer.domElement);
  						camera.position.set(20, 1, 20);
  						controls.focus(scene.position);
  						controls.movementSpeed = 4;
  						controls.boostSpeed = 20;

  						scene.add(camera);

  						var gui = new dat.GUI({ autoPlace: false });
  						aside.appendChild(gui.domElement);

  						var hemisphereLight = new three.HemisphereLight(0x3284ff, 0xffc87f, 0.6);
  						var directionalLight = new three.DirectionalLight(0xfff4e5);

  						hemisphereLight.position.set(0, 1, 0).multiplyScalar(50);
  						directionalLight.position.set(1.75, 1.75, -1).multiplyScalar(50);

  						scene.add(directionalLight);
  						scene.add(hemisphereLight);

  						var terrain = new Terrain({
  								resolution: 64,
  								chunkSize: 32
  						});

  						terrain.material.uniforms.diffuse.value.setHex(0xffffff);
  						terrain.material.uniforms.offsetRepeat.value.set(0, 0, 0.5, 0.5);

  						terrain.material.uniforms.roughness.value = 0.6;
  						terrain.material.uniforms.metalness.value = 0.2;

  						terrain.material.setMaps(assets.get("diffuseXZ"), assets.get("diffuseY"), assets.get("diffuseXZ"));

  						terrain.material.setNormalMaps(assets.get("normalmapXZ"), assets.get("normalmapY"), assets.get("normalmapXZ"));

  						terrain.load(assets.get("terrain"));

  						scene.add(terrain.object);

  						var terrainStats = new TerrainStats(terrain);
  						terrainStats.configure(gui);

  						var stats = terrainStats.stats;
  						stats.dom.id = "stats";
  						stats.showPanel(3);

  						aside.appendChild(stats.dom);

  						var editor = new Editor(terrain, camera, renderer.domElement);
  						editor.setEnabled(false);
  						editor.configure(gui);

  						scene.add(editor.cursor);
  						scene.add(editor.octreeHelper);
  						scene.add(editor.chunkHelper);

  						(function () {

  								var params = {

  										terrain: {
  												diffuse: terrain.material.uniforms.diffuse.value.getHex(),
  												roughness: terrain.material.uniforms.roughness.value,
  												metalness: terrain.material.uniforms.metalness.value,
  												flatshading: terrain.material.shading === three.FlatShading,
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

  								var folder = gui.addFolder("Terrain");

  								var subfolder = folder.addFolder("Material");

  								subfolder.addColor(params.terrain, "diffuse").onChange(function () {

  										terrain.material.uniforms.diffuse.value.setHex(params.terrain.diffuse);
  								});

  								subfolder.add(params.terrain, "roughness").min(0.0).max(1.0).step(0.01).onChange(function () {

  										terrain.material.uniforms.roughness.value = params.terrain.roughness;
  								});

  								subfolder.add(params.terrain, "metalness").min(0.0).max(1.0).step(0.01).onChange(function () {

  										terrain.material.uniforms.metalness.value = params.terrain.metalness;
  								});

  								subfolder.add(params.terrain, "flatshading").onChange(function () {

  										var shading = params.terrain.flatshading ? three.FlatShading : three.SmoothShading;

  										terrain.material.shading = shading;
  										terrain.material.needsUpdate = true;
  								});

  								subfolder.add(params.terrain, "wireframe").onChange(function () {

  										terrain.material.wireframe = params.terrain.wireframe;
  										terrain.material.needsUpdate = true;
  								});

  								folder.add(terrain.object, "visible");

  								folder = gui.addFolder("Light");

  								subfolder = folder.addFolder("Directional");

  								subfolder.addColor(params.directionalLight, "color").onChange(function () {

  										directionalLight.color.setHex(params.directionalLight.color);
  								});

  								subfolder.add(params.directionalLight, "intensity").min(0.0).max(1.0).step(0.01).onChange(function () {

  										directionalLight.intensity = params.directionalLight.intensity;
  								});

  								subfolder = folder.addFolder("Hemisphere");

  								subfolder.addColor(params.hemisphereLight, "color").onChange(function () {

  										hemisphereLight.color.setHex(params.hemisphereLight.color);
  								});

  								subfolder.addColor(params.hemisphereLight, "groundColor").onChange(function () {

  										hemisphereLight.color.setHex(params.hemisphereLight.groundColor);
  								});

  								subfolder.add(params.hemisphereLight, "intensity").min(0.0).max(1.0).step(0.01).onChange(function () {

  										hemisphereLight.intensity = params.hemisphereLight.intensity;
  								});

  								folder = gui.addFolder("Info");

  								folder.add(renderer.info.memory, "geometries").listen();
  								folder.add(renderer.info.memory, "textures").listen();
  								folder.add(renderer.info.render, "calls").listen();
  								folder.add(renderer.info.render, "vertices").listen();
  								folder.add(renderer.info.render, "faces").listen();
  						})();

  						document.addEventListener("keydown", function () {

  								var flag = false;

  								return function onKeyDown(event) {

  										if (event.altKey) {

  												event.preventDefault();
  												controls.setEnabled(flag);
  												editor.setEnabled(!flag);

  												flag = !flag;
  										}
  								};
  						}());

  						window.addEventListener("resize", function () {

  								var id = 0;

  								function handleResize(event) {

  										var width = event.target.innerWidth;
  										var height = event.target.innerHeight;

  										renderer.setSize(width, height);
  										camera.aspect = width / height;
  										camera.updateProjectionMatrix();

  										id = 0;
  								}

  								return function onResize(event) {

  										if (id === 0) {

  												id = setTimeout(handleResize, 66, event);
  										}
  								};
  						}());

  						(function render(now) {

  								requestAnimationFrame(render);

  								stats.begin();

  								controls.update(clock.getDelta());
  								terrain.update(camera);
  								renderer.render(scene, camera);

  								stats.end();
  						})();
  				}
  		}]);
  		return App;
  }();

  function loadAssets(callback) {

  	var assets = new Map();

  	var loadingManager = new three.LoadingManager();
  	var fileLoader = new three.FileLoader(loadingManager);
  	var textureLoader = new three.TextureLoader(loadingManager);
  	var cubeTextureLoader = new three.CubeTextureLoader(loadingManager);

  	var path = "textures/cube/01/";
  	var format = ".png";
  	var urls = [path + "px" + format, path + "nx" + format, path + "py" + format, path + "ny" + format, path + "pz" + format, path + "nz" + format];

  	loadingManager.onProgress = function onProgress(item, loaded, total) {

  		if (loaded === total) {
  			callback(assets);
  		}
  	};

  	cubeTextureLoader.load(urls, function (textureCube) {

  		assets.set("sky", textureCube);
  	});

  	fileLoader.load("terrain/torus.json", function (text) {

  		assets.set("terrain", text);
  	});

  	textureLoader.load("textures/diffuse/05.jpg", function (texture) {

  		texture.wrapS = texture.wrapT = three.RepeatWrapping;
  		assets.set("diffuseXZ", texture);
  	});

  	textureLoader.load("textures/diffuse/03.jpg", function (texture) {

  		texture.wrapS = texture.wrapT = three.RepeatWrapping;
  		assets.set("diffuseY", texture);
  	});

  	textureLoader.load("textures/normal/05.png", function (texture) {

  		texture.wrapS = texture.wrapT = three.RepeatWrapping;
  		assets.set("normalmapXZ", texture);
  	});

  	textureLoader.load("textures/normal/03.png", function (texture) {

  		texture.wrapS = texture.wrapT = three.RepeatWrapping;
  		assets.set("normalmapY", texture);
  	});
  }

  function createErrorMessage(missingFeatures) {

  	var message = document.createElement("p");
  	var missingFeatureList = document.createElement("ul");

  	var feature = void 0;
  	var i = void 0,
  	    l = void 0;

  	for (i = 0, l = missingFeatures.length; i < l; ++i) {

  		feature = document.createElement("li");
  		feature.appendChild(document.createTextNode(missingFeatures[i]));
  		missingFeatureList.appendChild(feature);
  	}

  	message.appendChild(document.createTextNode("The following features are missing:"));
  	message.appendChild(missingFeatureList);

  	return message;
  }

  window.addEventListener("load", function main(event) {

  	window.removeEventListener("load", main);

  	var viewport = document.getElementById("viewport");
  	var aside = document.getElementById("aside");

  	var detector = new Detector();
  	var missingFeatures = detector.getMissingFeatures(FeatureId.CANVAS, FeatureId.WEBGL, FeatureId.WORKER, FeatureId.FILE);

  	if (missingFeatures === null) {

  		loadAssets(function (assets) {

  			viewport.removeChild(viewport.children[0]);
  			aside.style.visibility = "visible";
  			App.initialise(viewport, aside, assets);
  		});
  	} else {

  		viewport.removeChild(viewport.children[0]);
  		viewport.appendChild(createErrorMessage(missingFeatures));
  	}
  });

}(THREE,dat,Stats));
