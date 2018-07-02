/**
 * rabbit-hole v0.0.0 build Mon Jul 02 2018
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2018 Raoul van Rüschen, Zlib
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.RABBITHOLE = {})));
}(this, (function (exports) { 'use strict';

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

  var set = function set(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
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
  		value: function deserialize(object) {}
  	}]);
  	return Deserializable;
  }();

  var Disposable = function () {
    function Disposable() {
      classCallCheck(this, Disposable);
    }

    createClass(Disposable, [{
      key: "dispose",
      value: function dispose() {}
    }]);
    return Disposable;
  }();

  var TransferableContainer = function () {
  	function TransferableContainer() {
  		classCallCheck(this, TransferableContainer);
  	}

  	createClass(TransferableContainer, [{
  		key: "createTransferList",
  		value: function createTransferList() {
  		}
  	}]);
  	return TransferableContainer;
  }();

  var Queue = function () {
  	function Queue() {
  		classCallCheck(this, Queue);


  		this.elements = [];

  		this.head = 0;
  	}

  	createClass(Queue, [{
  		key: "copy",
  		value: function copy(queue) {

  			this.elements = Array.from(queue.elements);
  			this.head = queue.head;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "add",
  		value: function add(element) {

  			this.elements.push(element);
  		}
  	}, {
  		key: "peek",
  		value: function peek() {

  			return this.elements.length > 0 ? this.elements[this.head] : undefined;
  		}
  	}, {
  		key: "poll",
  		value: function poll() {

  			var elements = this.elements;
  			var length = elements.length;

  			var element = void 0;

  			if (length > 0) {

  				element = elements[this.head++];

  				if (this.head * 2 >= length) {

  					this.elements = elements.slice(this.head);
  					this.head = 0;
  				}
  			}

  			return element;
  		}
  	}, {
  		key: "clear",
  		value: function clear() {

  			this.elements = [];
  			this.head = 0;
  		}
  	}, {
  		key: "size",
  		get: function get$$1() {

  			return this.elements.length - this.head;
  		}
  	}, {
  		key: "empty",
  		get: function get$$1() {

  			return this.elements.length === 0;
  		}
  	}]);
  	return Queue;
  }();

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

  var OperationType = {

    UNION: "csg.union",
    DIFFERENCE: "csg.difference",
    INTERSECTION: "csg.intersection",
    DENSITY_FUNCTION: "csg.densityfunction"

  };

  var Vector3 = function () {
  	function Vector3() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Vector3);


  		this.x = x;

  		this.y = y;

  		this.z = z;
  	}

  	createClass(Vector3, [{
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
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z);
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
  		key: "setFromSpherical",
  		value: function setFromSpherical(s) {

  			var sinPhiRadius = Math.sin(s.phi) * s.radius;

  			this.x = sinPhiRadius * Math.sin(s.theta);
  			this.y = Math.cos(s.phi) * s.radius;
  			this.z = sinPhiRadius * Math.cos(s.theta);

  			return this;
  		}
  	}, {
  		key: "setFromCylindrical",
  		value: function setFromCylindrical(c) {

  			this.x = c.radius * Math.sin(c.theta);
  			this.y = c.y;
  			this.z = c.radius * Math.cos(c.theta);

  			return this;
  		}
  	}, {
  		key: "setFromMatrixColumn",
  		value: function setFromMatrixColumn(m, index) {

  			return this.fromArray(m.elements, index * 4);
  		}
  	}, {
  		key: "setFromMatrixPosition",
  		value: function setFromMatrixPosition(m) {

  			var me = m.elements;

  			this.x = me[12];
  			this.y = me[13];
  			this.z = me[14];

  			return this;
  		}
  	}, {
  		key: "setFromMatrixScale",
  		value: function setFromMatrixScale(m) {

  			var sx = this.setFromMatrixColumn(m, 0).length();
  			var sy = this.setFromMatrixColumn(m, 1).length();
  			var sz = this.setFromMatrixColumn(m, 2).length();

  			this.x = sx;
  			this.y = sy;
  			this.z = sz;

  			return this;
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
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;
  			this.z += v.z * s;

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

  			this.x *= s;
  			this.y *= s;
  			this.z *= s;

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

  			this.x /= s;
  			this.y /= s;
  			this.z /= s;

  			return this;
  		}
  	}, {
  		key: "crossVectors",
  		value: function crossVectors(a, b) {

  			var ax = a.x,
  			    ay = a.y,
  			    az = a.z;
  			var bx = b.x,
  			    by = b.y,
  			    bz = b.z;

  			this.x = ay * bz - az * by;
  			this.y = az * bx - ax * bz;
  			this.z = ax * by - ay * bx;

  			return this;
  		}
  	}, {
  		key: "cross",
  		value: function cross(v) {

  			return this.crossVectors(this, v);
  		}
  	}, {
  		key: "transformDirection",
  		value: function transformDirection(m) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z;
  			var e = m.elements;

  			this.x = e[0] * x + e[4] * y + e[8] * z;
  			this.y = e[1] * x + e[5] * y + e[9] * z;
  			this.z = e[2] * x + e[6] * y + e[10] * z;

  			return this.normalize();
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
  	}, {
  		key: "applyQuaternion",
  		value: function applyQuaternion(q) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z;
  			var qx = q.x,
  			    qy = q.y,
  			    qz = q.z,
  			    qw = q.w;

  			var ix = qw * x + qy * z - qz * y;
  			var iy = qw * y + qz * x - qx * z;
  			var iz = qw * z + qx * y - qy * x;
  			var iw = -qx * x - qy * y - qz * z;

  			this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  			this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  			this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

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
  		key: "reflect",
  		value: function reflect(n) {

  			var nx = n.x;
  			var ny = n.y;
  			var nz = n.z;

  			this.sub(n.multiplyScalar(2 * this.dot(n)));

  			n.set(nx, ny, nz);

  			return this;
  		}
  	}, {
  		key: "angleTo",
  		value: function angleTo(v) {

  			var theta = this.dot(v) / Math.sqrt(this.lengthSquared() * v.lengthSquared());

  			return Math.acos(Math.min(Math.max(theta, -1), 1));
  		}
  	}, {
  		key: "manhattanLength",
  		value: function manhattanLength() {

  			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.x * this.x + this.y * this.y + this.z * this.z;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  		}
  	}, {
  		key: "manhattanDistanceTo",
  		value: function manhattanDistanceTo(v) {

  			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
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
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "setLength",
  		value: function setLength(length) {

  			return this.normalize().multiplyScalar(length);
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
  		key: "floor",
  		value: function floor() {

  			this.x = Math.floor(this.x);
  			this.y = Math.floor(this.y);
  			this.z = Math.floor(this.z);

  			return this;
  		}
  	}, {
  		key: "ceil",
  		value: function ceil() {

  			this.x = Math.ceil(this.x);
  			this.y = Math.ceil(this.y);
  			this.z = Math.ceil(this.z);

  			return this;
  		}
  	}, {
  		key: "round",
  		value: function round() {

  			this.x = Math.round(this.x);
  			this.y = Math.round(this.y);
  			this.z = Math.round(this.z);

  			return this;
  		}
  	}, {
  		key: "lerp",
  		value: function lerp(v, alpha) {

  			this.x += (v.x - this.x) * alpha;
  			this.y += (v.y - this.y) * alpha;
  			this.z += (v.z - this.z) * alpha;

  			return this;
  		}
  	}, {
  		key: "lerpVectors",
  		value: function lerpVectors(v1, v2, alpha) {

  			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y && v.z === this.z;
  		}
  	}]);
  	return Vector3;
  }();

  var v = new Vector3();

  var Box3 = function () {
  	function Box3() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3(Infinity, Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3(-Infinity, -Infinity, -Infinity);
  		classCallCheck(this, Box3);


  		this.min = min;

  		this.max = max;
  	}

  	createClass(Box3, [{
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
  		key: "makeEmpty",
  		value: function makeEmpty() {

  			this.min.x = this.min.y = this.min.z = Infinity;
  			this.max.x = this.max.y = this.max.z = -Infinity;

  			return this;
  		}
  	}, {
  		key: "isEmpty",
  		value: function isEmpty() {

  			return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  		}
  	}, {
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return !this.isEmpty() ? target.addVectors(this.min, this.max).multiplyScalar(0.5) : target.set(0, 0, 0);
  		}
  	}, {
  		key: "getSize",
  		value: function getSize() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return !this.isEmpty() ? target.subVectors(this.max, this.min) : target.set(0, 0, 0);
  		}
  	}, {
  		key: "setFromSphere",
  		value: function setFromSphere(sphere) {

  			this.set(sphere.center, sphere.center);
  			this.expandByScalar(sphere.radius);

  			return this;
  		}
  	}, {
  		key: "expandByPoint",
  		value: function expandByPoint(p) {

  			this.min.min(p);
  			this.max.max(p);

  			return this;
  		}
  	}, {
  		key: "expandByVector",
  		value: function expandByVector(v) {

  			this.min.sub(v);
  			this.max.add(v);

  			return this;
  		}
  	}, {
  		key: "expandByScalar",
  		value: function expandByScalar(s) {

  			this.min.addScalar(-s);
  			this.max.addScalar(s);

  			return this;
  		}
  	}, {
  		key: "setFromPoints",
  		value: function setFromPoints(points) {

  			var i = void 0,
  			    l = void 0;

  			this.min.set(0, 0, 0);
  			this.max.set(0, 0, 0);

  			for (i = 0, l = points.length; i < l; ++i) {

  				this.expandByPoint(points[i]);
  			}

  			return this;
  		}
  	}, {
  		key: "setFromCenterAndSize",
  		value: function setFromCenterAndSize(center, size) {

  			var halfSize = v.copy(size).multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}
  	}, {
  		key: "clampPoint",
  		value: function clampPoint(point) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


  			return target.copy(point).clamp(this.min, this.max);
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			var clampedPoint = v.copy(p).clamp(this.min, this.max);

  			return clampedPoint.sub(p).length();
  		}
  	}, {
  		key: "applyMatrix4",
  		value: function applyMatrix4(matrix) {

  			var min = this.min;
  			var max = this.max;

  			if (!this.isEmpty()) {

  				var me = matrix.elements;

  				var xax = me[0] * min.x;
  				var xay = me[1] * min.x;
  				var xaz = me[2] * min.x;

  				var xbx = me[0] * max.x;
  				var xby = me[1] * max.x;
  				var xbz = me[2] * max.x;

  				var yax = me[4] * min.y;
  				var yay = me[5] * min.y;
  				var yaz = me[6] * min.y;

  				var ybx = me[4] * max.y;
  				var yby = me[5] * max.y;
  				var ybz = me[6] * max.y;

  				var zax = me[8] * min.z;
  				var zay = me[9] * min.z;
  				var zaz = me[10] * min.z;

  				var zbx = me[8] * max.z;
  				var zby = me[9] * max.z;
  				var zbz = me[10] * max.z;

  				min.x = Math.min(xax, xbx) + Math.min(yax, ybx) + Math.min(zax, zbx) + me[12];
  				min.y = Math.min(xay, xby) + Math.min(yay, yby) + Math.min(zay, zby) + me[13];
  				min.z = Math.min(xaz, xbz) + Math.min(yaz, ybz) + Math.min(zaz, zbz) + me[14];
  				max.x = Math.max(xax, xbx) + Math.max(yax, ybx) + Math.max(zax, zbx) + me[12];
  				max.y = Math.max(xay, xby) + Math.max(yay, yby) + Math.max(zay, zby) + me[13];
  				max.z = Math.max(xaz, xbz) + Math.max(yaz, ybz) + Math.max(zaz, zbz) + me[14];
  			}

  			return this;
  		}
  	}, {
  		key: "translate",
  		value: function translate(offset) {

  			this.min.add(offset);
  			this.max.add(offset);

  			return this;
  		}
  	}, {
  		key: "intersect",
  		value: function intersect(b) {

  			this.min.max(b.min);
  			this.max.min(b.max);

  			if (this.isEmpty()) {

  				this.makeEmpty();
  			}

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
  		key: "containsPoint",
  		value: function containsPoint(p) {

  			var min = this.min;
  			var max = this.max;

  			return p.x >= min.x && p.y >= min.y && p.z >= min.z && p.x <= max.x && p.y <= max.y && p.z <= max.z;
  		}
  	}, {
  		key: "containsBox",
  		value: function containsBox(b) {

  			var tMin = this.min;
  			var tMax = this.max;
  			var bMin = b.min;
  			var bMax = b.max;

  			return tMin.x <= bMin.x && bMax.x <= tMax.x && tMin.y <= bMin.y && bMax.y <= tMax.y && tMin.z <= bMin.z && bMax.z <= tMax.z;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			var tMin = this.min;
  			var tMax = this.max;
  			var bMin = b.min;
  			var bMax = b.max;

  			return bMax.x >= tMin.x && bMax.y >= tMin.y && bMax.z >= tMin.z && bMin.x <= tMax.x && bMin.y <= tMax.y && bMin.z <= tMax.z;
  		}
  	}, {
  		key: "intersectsSphere",
  		value: function intersectsSphere(s) {
  			var closestPoint = this.clampPoint(s.center, v);

  			return closestPoint.distanceToSquared(s.center) <= s.radius * s.radius;
  		}
  	}, {
  		key: "intersectsPlane",
  		value: function intersectsPlane(p) {

  			var min = void 0,
  			    max = void 0;

  			if (p.normal.x > 0) {

  				min = p.normal.x * this.min.x;
  				max = p.normal.x * this.max.x;
  			} else {

  				min = p.normal.x * this.max.x;
  				max = p.normal.x * this.min.x;
  			}

  			if (p.normal.y > 0) {

  				min += p.normal.y * this.min.y;
  				max += p.normal.y * this.max.y;
  			} else {

  				min += p.normal.y * this.max.y;
  				max += p.normal.y * this.min.y;
  			}

  			if (p.normal.z > 0) {

  				min += p.normal.z * this.min.z;
  				max += p.normal.z * this.max.z;
  			} else {

  				min += p.normal.z * this.max.z;
  				max += p.normal.z * this.min.z;
  			}

  			return min <= p.constant && max >= p.constant;
  		}
  	}, {
  		key: "equals",
  		value: function equals(b) {

  			return b.min.equals(this.min) && b.max.equals(this.max);
  		}
  	}]);
  	return Box3;
  }();

  var box = new Box3();

  var v$1 = new Vector3();

  var Sphere = function () {
  	function Sphere() {
  		var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
  		var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, Sphere);


  		this.center = center;

  		this.radius = radius;
  	}

  	createClass(Sphere, [{
  		key: "set",
  		value: function set$$1(center, radius) {

  			this.center.copy(center);
  			this.radius = radius;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(s) {

  			this.center.copy(s.center);
  			this.radius = s.radius;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "setFromPoints",
  		value: function setFromPoints(points) {
  			var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : box.setFromPoints(points).getCenter(this.center);


  			var maxRadiusSq = 0;
  			var i = void 0,
  			    l = void 0;

  			for (i = 0, l = points.length; i < l; ++i) {

  				maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
  			}

  			this.radius = Math.sqrt(maxRadiusSq);

  			return this;
  		}
  	}, {
  		key: "setFromBox",
  		value: function setFromBox(box) {

  			box.getCenter(this.center);
  			this.radius = box.getSize(v$1).length() * 0.5;

  			return this;
  		}
  	}, {
  		key: "isEmpty",
  		value: function isEmpty() {

  			return this.radius <= 0;
  		}
  	}, {
  		key: "translate",
  		value: function translate(offset) {

  			this.center.add(offset);

  			return this;
  		}
  	}, {
  		key: "clampPoint",
  		value: function clampPoint(p) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


  			var deltaLengthSq = this.center.distanceToSquared(p);

  			target.copy(p);

  			if (deltaLengthSq > this.radius * this.radius) {

  				target.sub(this.center).normalize();
  				target.multiplyScalar(this.radius).add(this.center);
  			}

  			return target;
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			return p.distanceTo(this.center) - this.radius;
  		}
  	}, {
  		key: "containsPoint",
  		value: function containsPoint(p) {

  			return p.distanceToSquared(this.center) <= this.radius * this.radius;
  		}
  	}, {
  		key: "intersectsSphere",
  		value: function intersectsSphere(s) {

  			var radiusSum = this.radius + s.radius;

  			return s.center.distanceToSquared(this.center) <= radiusSum * radiusSum;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			return b.intersectsSphere(this);
  		}
  	}, {
  		key: "intersectsPlane",
  		value: function intersectsPlane(p) {

  			return Math.abs(p.distanceToPoint(this.center)) <= this.radius;
  		}
  	}, {
  		key: "equals",
  		value: function equals(s) {

  			return s.center.equals(this.center) && s.radius === this.radius;
  		}
  	}]);
  	return Sphere;
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
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y);
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
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;

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
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;

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

  			this.x *= s;
  			this.y *= s;

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

  			this.x /= s;
  			this.y /= s;

  			return this;
  		}
  	}, {
  		key: "applyMatrix3",
  		value: function applyMatrix3(m) {

  			var x = this.x,
  			    y = this.y;
  			var e = m.elements;

  			this.x = e[0] * x + e[3] * y + e[6];
  			this.y = e[1] * x + e[4] * y + e[7];

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y;
  		}
  	}, {
  		key: "manhattanLength",
  		value: function manhattanLength() {

  			return Math.abs(this.x) + Math.abs(this.y);
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.x * this.x + this.y * this.y;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y);
  		}
  	}, {
  		key: "manhattanDistanceTo",
  		value: function manhattanDistanceTo(v) {

  			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;

  			return dx * dx + dy * dy;
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "setLength",
  		value: function setLength(length) {

  			return this.normalize().multiplyScalar(length);
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
  	}, {
  		key: "floor",
  		value: function floor() {

  			this.x = Math.floor(this.x);
  			this.y = Math.floor(this.y);

  			return this;
  		}
  	}, {
  		key: "ceil",
  		value: function ceil() {

  			this.x = Math.ceil(this.x);
  			this.y = Math.ceil(this.y);

  			return this;
  		}
  	}, {
  		key: "round",
  		value: function round() {

  			this.x = Math.round(this.x);
  			this.y = Math.round(this.y);

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
  		key: "angle",
  		value: function angle() {

  			var angle = Math.atan2(this.y, this.x);

  			if (angle < 0) {

  				angle += 2 * Math.PI;
  			}

  			return angle;
  		}
  	}, {
  		key: "lerp",
  		value: function lerp(v, alpha) {

  			this.x += (v.x - this.x) * alpha;
  			this.y += (v.y - this.y) * alpha;

  			return this;
  		}
  	}, {
  		key: "lerpVectors",
  		value: function lerpVectors(v1, v2, alpha) {

  			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  		}
  	}, {
  		key: "rotateAround",
  		value: function rotateAround(center, angle) {

  			var c = Math.cos(angle),
  			    s = Math.sin(angle);

  			var x = this.x - center.x;
  			var y = this.y - center.y;

  			this.x = x * c - y * s + center.x;
  			this.y = x * s + y * c + center.y;

  			return this;
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y;
  		}
  	}, {
  		key: "width",
  		get: function get$$1() {

  			return this.x;
  		},
  		set: function set$$1(value) {

  			return this.x = value;
  		}
  	}, {
  		key: "height",
  		get: function get$$1() {

  			return this.y;
  		},
  		set: function set$$1(value) {

  			return this.y = value;
  		}
  	}]);
  	return Vector2;
  }();

  var v$2 = new Vector2();

  var Box2 = function () {
  	function Box2() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2(Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector2(-Infinity, -Infinity);
  		classCallCheck(this, Box2);


  		this.min = min;

  		this.max = max;
  	}

  	createClass(Box2, [{
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
  		key: "makeEmpty",
  		value: function makeEmpty() {

  			this.min.x = this.min.y = Infinity;
  			this.max.x = this.max.y = -Infinity;

  			return this;
  		}
  	}, {
  		key: "isEmpty",
  		value: function isEmpty() {

  			return this.max.x < this.min.x || this.max.y < this.min.y;
  		}
  	}, {
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2();


  			return !this.isEmpty() ? target.addVectors(this.min, this.max).multiplyScalar(0.5) : target.set(0, 0);
  		}
  	}, {
  		key: "getSize",
  		value: function getSize() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2();


  			return !this.isEmpty() ? target.subVectors(this.max, this.min) : target.set(0, 0);
  		}
  	}, {
  		key: "getBoundingSphere",
  		value: function getBoundingSphere() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Sphere();


  			this.getCenter(target.center);

  			target.radius = this.getSize(v$2).length() * 0.5;

  			return target;
  		}
  	}, {
  		key: "expandByPoint",
  		value: function expandByPoint(p) {

  			this.min.min(p);
  			this.max.max(p);

  			return this;
  		}
  	}, {
  		key: "expandByVector",
  		value: function expandByVector(v) {

  			this.min.sub(v);
  			this.max.add(v);

  			return this;
  		}
  	}, {
  		key: "expandByScalar",
  		value: function expandByScalar(s) {

  			this.min.addScalar(-s);
  			this.max.addScalar(s);

  			return this;
  		}
  	}, {
  		key: "setFromPoints",
  		value: function setFromPoints(points) {

  			var i = void 0,
  			    l = void 0;

  			this.min.set(0, 0);
  			this.max.set(0, 0);

  			for (i = 0, l = points.length; i < l; ++i) {

  				this.expandByPoint(points[i]);
  			}

  			return this;
  		}
  	}, {
  		key: "setFromCenterAndSize",
  		value: function setFromCenterAndSize(center, size) {

  			var halfSize = v$2.copy(size).multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}
  	}, {
  		key: "clampPoint",
  		value: function clampPoint(point) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector2();


  			return target.copy(point).clamp(this.min, this.max);
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			var clampedPoint = v$2.copy(p).clamp(this.min, this.max);

  			return clampedPoint.sub(p).length();
  		}
  	}, {
  		key: "translate",
  		value: function translate(offset) {

  			this.min.add(offset);
  			this.max.add(offset);

  			return this;
  		}
  	}, {
  		key: "intersect",
  		value: function intersect(b) {

  			this.min.max(b.min);
  			this.max.min(b.max);

  			if (this.isEmpty()) {

  				this.makeEmpty();
  			}

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
  		key: "containsPoint",
  		value: function containsPoint(p) {

  			var min = this.min;
  			var max = this.max;

  			return p.x >= min.x && p.y >= min.y && p.x <= max.x && p.y <= max.y;
  		}
  	}, {
  		key: "containsBox",
  		value: function containsBox(b) {

  			var tMin = this.min;
  			var tMax = this.max;
  			var bMin = b.min;
  			var bMax = b.max;

  			return tMin.x <= bMin.x && bMax.x <= tMax.x && tMin.y <= bMin.y && bMax.y <= tMax.y;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			var tMin = this.min;
  			var tMax = this.max;
  			var bMin = b.min;
  			var bMax = b.max;

  			return bMax.x >= tMin.x && bMax.y >= tMin.y && bMin.x <= tMax.x && bMin.y <= tMax.y;
  		}
  	}, {
  		key: "equals",
  		value: function equals(b) {

  			return b.min.equals(this.min) && b.max.equals(this.max);
  		}
  	}]);
  	return Box2;
  }();

  var Cylindrical = function () {
  	function Cylindrical() {
  		var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  		var theta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Cylindrical);


  		this.radius = radius;

  		this.theta = theta;

  		this.y = y;
  	}

  	createClass(Cylindrical, [{
  		key: "set",
  		value: function set$$1(radius, theta, y) {

  			this.radius = radius;
  			this.theta = theta;
  			this.y = y;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(c) {

  			this.radius = c.radius;
  			this.theta = c.theta;
  			this.y = c.y;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "setFromVector3",
  		value: function setFromVector3(v) {

  			this.radius = Math.sqrt(v.x * v.x + v.z * v.z);
  			this.theta = Math.atan2(v.x, v.z);
  			this.y = v.y;

  			return this;
  		}
  	}]);
  	return Cylindrical;
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
  				value: function copy(matrix) {

  						var me = matrix.elements;
  						var te = this.elements;

  						te[0] = me[0];te[1] = me[1];te[2] = me[2];
  						te[3] = me[3];te[4] = me[4];te[5] = me[5];
  						te[6] = me[6];te[7] = me[7];te[8] = me[8];

  						return this;
  				}
  		}, {
  				key: "clone",
  				value: function clone() {

  						return new this.constructor().fromArray(this.elements);
  				}
  		}, {
  				key: "fromArray",
  				value: function fromArray(array) {
  						var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  						var te = this.elements;

  						var i = void 0;

  						for (i = 0; i < 9; ++i) {

  								te[i] = array[i + offset];
  						}

  						return this;
  				}
  		}, {
  				key: "toArray",
  				value: function toArray$$1() {
  						var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  						var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  						var te = this.elements;

  						var i = void 0;

  						for (i = 0; i < 9; ++i) {

  								array[i + offset] = te[i];
  						}

  						return array;
  				}
  		}, {
  				key: "multiplyMatrices",
  				value: function multiplyMatrices(a, b) {

  						var ae = a.elements;
  						var be = b.elements;
  						var te = this.elements;

  						var a11 = ae[0],
  						    a12 = ae[3],
  						    a13 = ae[6];
  						var a21 = ae[1],
  						    a22 = ae[4],
  						    a23 = ae[7];
  						var a31 = ae[2],
  						    a32 = ae[5],
  						    a33 = ae[8];

  						var b11 = be[0],
  						    b12 = be[3],
  						    b13 = be[6];
  						var b21 = be[1],
  						    b22 = be[4],
  						    b23 = be[7];
  						var b31 = be[2],
  						    b32 = be[5],
  						    b33 = be[8];

  						te[0] = a11 * b11 + a12 * b21 + a13 * b31;
  						te[3] = a11 * b12 + a12 * b22 + a13 * b32;
  						te[6] = a11 * b13 + a12 * b23 + a13 * b33;

  						te[1] = a21 * b11 + a22 * b21 + a23 * b31;
  						te[4] = a21 * b12 + a22 * b22 + a23 * b32;
  						te[7] = a21 * b13 + a22 * b23 + a23 * b33;

  						te[2] = a31 * b11 + a32 * b21 + a33 * b31;
  						te[5] = a31 * b12 + a32 * b22 + a33 * b32;
  						te[8] = a31 * b13 + a32 * b23 + a33 * b33;

  						return this;
  				}
  		}, {
  				key: "multiply",
  				value: function multiply(m) {

  						return this.multiplyMatrices(this, m);
  				}
  		}, {
  				key: "premultiply",
  				value: function premultiply(m) {

  						return this.multiplyMatrices(m, this);
  				}
  		}, {
  				key: "multiplyScalar",
  				value: function multiplyScalar(s) {

  						var te = this.elements;

  						te[0] *= s;te[3] *= s;te[6] *= s;
  						te[1] *= s;te[4] *= s;te[7] *= s;
  						te[2] *= s;te[5] *= s;te[8] *= s;

  						return this;
  				}
  		}, {
  				key: "determinant",
  				value: function determinant() {

  						var te = this.elements;

  						var a = te[0],
  						    b = te[1],
  						    c = te[2];
  						var d = te[3],
  						    e = te[4],
  						    f = te[5];
  						var g = te[6],
  						    h = te[7],
  						    i = te[8];

  						return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
  				}
  		}, {
  				key: "getInverse",
  				value: function getInverse(matrix) {

  						var me = matrix.elements;
  						var te = this.elements;

  						var n11 = me[0],
  						    n21 = me[1],
  						    n31 = me[2];
  						var n12 = me[3],
  						    n22 = me[4],
  						    n32 = me[5];
  						var n13 = me[6],
  						    n23 = me[7],
  						    n33 = me[8];

  						var t11 = n33 * n22 - n32 * n23;
  						var t12 = n32 * n13 - n33 * n12;
  						var t13 = n23 * n12 - n22 * n13;

  						var det = n11 * t11 + n21 * t12 + n31 * t13;

  						var invDet = void 0;

  						if (det !== 0) {

  								invDet = 1.0 / det;

  								te[0] = t11 * invDet;
  								te[1] = (n31 * n23 - n33 * n21) * invDet;
  								te[2] = (n32 * n21 - n31 * n22) * invDet;

  								te[3] = t12 * invDet;
  								te[4] = (n33 * n11 - n31 * n13) * invDet;
  								te[5] = (n31 * n12 - n32 * n11) * invDet;

  								te[6] = t13 * invDet;
  								te[7] = (n21 * n13 - n23 * n11) * invDet;
  								te[8] = (n22 * n11 - n21 * n12) * invDet;
  						} else {

  								console.error("Can't invert matrix, determinant is zero", matrix);

  								this.identity();
  						}

  						return this;
  				}
  		}, {
  				key: "transpose",
  				value: function transpose() {

  						var me = this.elements;

  						var t = void 0;

  						t = me[1];me[1] = me[3];me[3] = t;
  						t = me[2];me[2] = me[6];me[6] = t;
  						t = me[5];me[5] = me[7];me[7] = t;

  						return this;
  				}
  		}, {
  				key: "scale",
  				value: function scale(sx, sy) {

  						var te = this.elements;

  						te[0] *= sx;te[3] *= sx;te[6] *= sx;
  						te[1] *= sy;te[4] *= sy;te[7] *= sy;

  						return this;
  				}
  		}, {
  				key: "rotate",
  				value: function rotate(theta) {

  						var c = Math.cos(theta);
  						var s = Math.sin(theta);

  						var te = this.elements;

  						var a11 = te[0],
  						    a12 = te[3],
  						    a13 = te[6];
  						var a21 = te[1],
  						    a22 = te[4],
  						    a23 = te[7];

  						te[0] = c * a11 + s * a21;
  						te[3] = c * a12 + s * a22;
  						te[6] = c * a13 + s * a23;

  						te[1] = -s * a11 + c * a21;
  						te[4] = -s * a12 + c * a22;
  						te[7] = -s * a13 + c * a23;

  						return this;
  				}
  		}, {
  				key: "translate",
  				value: function translate(tx, ty) {

  						var te = this.elements;

  						te[0] += tx * te[2];te[3] += tx * te[5];te[6] += tx * te[8];
  						te[1] += ty * te[2];te[4] += ty * te[5];te[7] += ty * te[8];

  						return this;
  				}
  		}, {
  				key: "equals",
  				value: function equals(m) {

  						var te = this.elements;
  						var me = m.elements;

  						var result = true;
  						var i = void 0;

  						for (i = 0; result && i < 9; ++i) {

  								if (te[i] !== me[i]) {

  										result = false;
  								}
  						}

  						return result;
  				}
  		}]);
  		return Matrix3;
  }();

  var RotationOrder = {

    XYZ: "XYZ",
    YZX: "YZX",
    ZXY: "ZXY",
    XZY: "XZY",
    YXZ: "YXZ",
    ZYX: "ZYX"

  };

  var v$3 = new Vector3();

  var Quaternion = function () {
  	function Quaternion() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  		classCallCheck(this, Quaternion);


  		this.x = x;

  		this.y = y;

  		this.z = z;

  		this.w = w;
  	}

  	createClass(Quaternion, [{
  		key: "set",
  		value: function set$$1(x, y, z, w) {

  			this.x = x;
  			this.y = y;
  			this.z = z;
  			this.w = w;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(q) {

  			this.x = q.x;
  			this.y = q.y;
  			this.z = q.z;
  			this.w = q.w;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z, this.w);
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];
  			this.w = array[offset + 3];

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
  			array[offset + 3] = this.w;

  			return array;
  		}
  	}, {
  		key: "setFromEuler",
  		value: function setFromEuler(euler) {

  			var x = euler.x;
  			var y = euler.y;
  			var z = euler.z;

  			var cos = Math.cos;
  			var sin = Math.sin;

  			var c1 = cos(x / 2);
  			var c2 = cos(y / 2);
  			var c3 = cos(z / 2);

  			var s1 = sin(x / 2);
  			var s2 = sin(y / 2);
  			var s3 = sin(z / 2);

  			switch (euler.order) {

  				case RotationOrder.XYZ:
  					this.x = s1 * c2 * c3 + c1 * s2 * s3;
  					this.y = c1 * s2 * c3 - s1 * c2 * s3;
  					this.z = c1 * c2 * s3 + s1 * s2 * c3;
  					this.w = c1 * c2 * c3 - s1 * s2 * s3;
  					break;

  				case RotationOrder.YXZ:
  					this.x = s1 * c2 * c3 + c1 * s2 * s3;
  					this.y = c1 * s2 * c3 - s1 * c2 * s3;
  					this.z = c1 * c2 * s3 - s1 * s2 * c3;
  					this.w = c1 * c2 * c3 + s1 * s2 * s3;
  					break;

  				case RotationOrder.ZXY:
  					this.x = s1 * c2 * c3 - c1 * s2 * s3;
  					this.y = c1 * s2 * c3 + s1 * c2 * s3;
  					this.z = c1 * c2 * s3 + s1 * s2 * c3;
  					this.w = c1 * c2 * c3 - s1 * s2 * s3;
  					break;

  				case RotationOrder.ZYX:
  					this.x = s1 * c2 * c3 - c1 * s2 * s3;
  					this.y = c1 * s2 * c3 + s1 * c2 * s3;
  					this.z = c1 * c2 * s3 - s1 * s2 * c3;
  					this.w = c1 * c2 * c3 + s1 * s2 * s3;
  					break;

  				case RotationOrder.YZX:
  					this.x = s1 * c2 * c3 + c1 * s2 * s3;
  					this.y = c1 * s2 * c3 + s1 * c2 * s3;
  					this.z = c1 * c2 * s3 - s1 * s2 * c3;
  					this.w = c1 * c2 * c3 - s1 * s2 * s3;
  					break;

  				case RotationOrder.XZY:
  					this.x = s1 * c2 * c3 - c1 * s2 * s3;
  					this.y = c1 * s2 * c3 - s1 * c2 * s3;
  					this.z = c1 * c2 * s3 + s1 * s2 * c3;
  					this.w = c1 * c2 * c3 + s1 * s2 * s3;
  					break;

  			}

  			return this;
  		}
  	}, {
  		key: "setFromAxisAngle",
  		value: function setFromAxisAngle(axis, angle) {

  			var halfAngle = angle / 2.0;
  			var s = Math.sin(halfAngle);

  			this.x = axis.x * s;
  			this.y = axis.y * s;
  			this.z = axis.z * s;
  			this.w = Math.cos(halfAngle);

  			return this;
  		}
  	}, {
  		key: "setFromRotationMatrix",
  		value: function setFromRotationMatrix(m) {

  			var te = m.elements;

  			var m00 = te[0],
  			    m01 = te[4],
  			    m02 = te[8];
  			var m10 = te[1],
  			    m11 = te[5],
  			    m12 = te[9];
  			var m20 = te[2],
  			    m21 = te[6],
  			    m22 = te[10];

  			var trace = m00 + m11 + m22;

  			var s = void 0;

  			if (trace > 0) {

  				s = 0.5 / Math.sqrt(trace + 1.0);

  				this.w = 0.25 / s;
  				this.x = (m21 - m12) * s;
  				this.y = (m02 - m20) * s;
  				this.z = (m10 - m01) * s;
  			} else if (m00 > m11 && m00 > m22) {

  				s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

  				this.w = (m21 - m12) / s;
  				this.x = 0.25 * s;
  				this.y = (m01 + m10) / s;
  				this.z = (m02 + m20) / s;
  			} else if (m11 > m22) {

  				s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

  				this.w = (m02 - m20) / s;
  				this.x = (m01 + m10) / s;
  				this.y = 0.25 * s;
  				this.z = (m12 + m21) / s;
  			} else {

  				s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

  				this.w = (m10 - m01) / s;
  				this.x = (m02 + m20) / s;
  				this.y = (m12 + m21) / s;
  				this.z = 0.25 * s;
  			}

  			return this;
  		}
  	}, {
  		key: "setFromUnitVectors",
  		value: function setFromUnitVectors(vFrom, vTo) {

  			var r = vFrom.dot(vTo) + 1;

  			if (r < 1e-6) {

  				r = 0;

  				if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

  					v$3.set(-vFrom.y, vFrom.x, 0);
  				} else {

  					v$3.set(0, -vFrom.z, vFrom.y);
  				}
  			} else {

  				v$3.crossVectors(vFrom, vTo);
  			}

  			this.x = v$3.x;
  			this.y = v$3.y;
  			this.z = v$3.z;
  			this.w = r;

  			return this.normalize();
  		}
  	}, {
  		key: "invert",
  		value: function invert() {

  			return this.conjugate();
  		}
  	}, {
  		key: "conjugate",
  		value: function conjugate() {

  			this.x *= -1;
  			this.y *= -1;
  			this.z *= -1;

  			return this;
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			var l = this.length();

  			var invLength = void 0;

  			if (l === 0) {

  				this.x = 0;
  				this.y = 0;
  				this.z = 0;
  				this.w = 1;
  			} else {

  				invLength = 1.0 / l;

  				this.x = this.x * invLength;
  				this.y = this.y * invLength;
  				this.z = this.z * invLength;
  				this.w = this.w * invLength;
  			}

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  		}
  	}, {
  		key: "multiplyQuaternions",
  		value: function multiplyQuaternions(a, b) {

  			var qax = a.x,
  			    qay = a.y,
  			    qaz = a.z,
  			    qaw = a.w;
  			var qbx = b.x,
  			    qby = b.y,
  			    qbz = b.z,
  			    qbw = b.w;

  			this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
  			this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
  			this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
  			this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(q) {

  			return this.multiplyQuaternions(this, q);
  		}
  	}, {
  		key: "premultiply",
  		value: function premultiply(q) {

  			return this.multiplyQuaternions(q, this);
  		}
  	}, {
  		key: "slerp",
  		value: function slerp(q, t) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z,
  			    w = this.w;

  			var cosHalfTheta = void 0,
  			    sinHalfThetaSquared = void 0,
  			    sinHalfTheta = void 0,
  			    halfTheta = void 0;
  			var s = void 0,
  			    ratioA = void 0,
  			    ratioB = void 0;

  			if (t === 1) {

  				this.copy(q);
  			} else if (t > 0) {

  				cosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;

  				if (cosHalfTheta < 0.0) {

  					this.w = -q.w;
  					this.x = -q.x;
  					this.y = -q.y;
  					this.z = -q.z;

  					cosHalfTheta = -cosHalfTheta;
  				} else {

  					this.copy(q);
  				}

  				if (cosHalfTheta >= 1.0) {

  					this.w = w;
  					this.x = x;
  					this.y = y;
  					this.z = z;
  				} else {

  					sinHalfThetaSquared = 1.0 - cosHalfTheta * cosHalfTheta;
  					s = 1.0 - t;

  					if (sinHalfThetaSquared <= Number.EPSILON) {

  						this.w = s * w + t * this.w;
  						this.x = s * x + t * this.x;
  						this.y = s * y + t * this.y;
  						this.z = s * z + t * this.z;

  						this.normalize();
  					} else {

  						sinHalfTheta = Math.sqrt(sinHalfThetaSquared);
  						halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
  						ratioA = Math.sin(s * halfTheta) / sinHalfTheta;
  						ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

  						this.w = w * ratioA + this.w * ratioB;
  						this.x = x * ratioA + this.x * ratioB;
  						this.y = y * ratioA + this.y * ratioB;
  						this.z = z * ratioA + this.z * ratioB;
  					}
  				}
  			}

  			return this;
  		}
  	}, {
  		key: "equals",
  		value: function equals(q) {

  			return q.x === this.x && q.y === this.y && q.z === this.z && q.w === this.w;
  		}
  	}], [{
  		key: "slerp",
  		value: function slerp(qa, qb, qr, t) {

  			return qr.copy(qa).slerp(qb, t);
  		}
  	}, {
  		key: "slerpFlat",
  		value: function slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {

  			var x1 = src1[srcOffset1];
  			var y1 = src1[srcOffset1 + 1];
  			var z1 = src1[srcOffset1 + 2];
  			var w1 = src1[srcOffset1 + 3];

  			var x0 = src0[srcOffset0];
  			var y0 = src0[srcOffset0 + 1];
  			var z0 = src0[srcOffset0 + 2];
  			var w0 = src0[srcOffset0 + 3];

  			var s = void 0,
  			    f = void 0;
  			var sin = void 0,
  			    cos = void 0,
  			    sqrSin = void 0;
  			var dir = void 0,
  			    len = void 0,
  			    tDir = void 0;

  			if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {

  				s = 1.0 - t;
  				cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1;

  				dir = cos >= 0 ? 1 : -1;
  				sqrSin = 1.0 - cos * cos;

  				if (sqrSin > Number.EPSILON) {

  					sin = Math.sqrt(sqrSin);
  					len = Math.atan2(sin, cos * dir);

  					s = Math.sin(s * len) / sin;
  					t = Math.sin(t * len) / sin;
  				}

  				tDir = t * dir;

  				x0 = x0 * s + x1 * tDir;
  				y0 = y0 * s + y1 * tDir;
  				z0 = z0 * s + z1 * tDir;
  				w0 = w0 * s + w1 * tDir;

  				if (s === 1.0 - t) {

  					f = 1.0 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

  					x0 *= f;
  					y0 *= f;
  					z0 *= f;
  					w0 *= f;
  				}
  			}

  			dst[dstOffset] = x0;
  			dst[dstOffset + 1] = y0;
  			dst[dstOffset + 2] = z0;
  			dst[dstOffset + 3] = w0;
  		}
  	}]);
  	return Quaternion;
  }();

  function clamp(value, min, max) {

  	return Math.max(Math.min(value, max), min);
  }

  var m = new Matrix3();

  var q = new Quaternion();

  var Euler = function () {
  	function Euler() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Euler);


  		this.x = x;

  		this.y = y;

  		this.z = z;

  		this.order = Euler.defaultOrder;
  	}

  	createClass(Euler, [{
  		key: "set",
  		value: function set$$1(x, y, z, order) {

  			this.x = x;
  			this.y = y;
  			this.z = z;
  			this.order = order;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(e) {

  			this.x = e.x;
  			this.y = e.y;
  			this.z = e.z;
  			this.order = e.order;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z, this.order);
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];
  			this.order = array[offset + 3];

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
  			array[offset + 3] = this.order;

  			return array;
  		}
  	}, {
  		key: "toVector3",
  		value: function toVector3() {
  			var vector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return vector.set(this.x, this.y, this.z);
  		}
  	}, {
  		key: "setFromRotationMatrix",
  		value: function setFromRotationMatrix(m) {
  			var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.order;


  			var te = m.elements;
  			var m00 = te[0],
  			    m01 = te[4],
  			    m02 = te[8];
  			var m10 = te[1],
  			    m11 = te[5],
  			    m12 = te[9];
  			var m20 = te[2],
  			    m21 = te[6],
  			    m22 = te[10];

  			var THRESHOLD = 1.0 - 1e-5;

  			switch (order) {

  				case RotationOrder.XYZ:
  					{

  						this.y = Math.asin(clamp(m02, -1, 1));

  						if (Math.abs(m02) < THRESHOLD) {

  							this.x = Math.atan2(-m12, m22);
  							this.z = Math.atan2(-m01, m00);
  						} else {

  							this.x = Math.atan2(m21, m11);
  							this.z = 0;
  						}

  						break;
  					}

  				case RotationOrder.YXZ:
  					{

  						this.x = Math.asin(-clamp(m12, -1, 1));

  						if (Math.abs(m12) < THRESHOLD) {

  							this.y = Math.atan2(m02, m22);
  							this.z = Math.atan2(m10, m11);
  						} else {

  							this.y = Math.atan2(-m20, m00);
  							this.z = 0;
  						}

  						break;
  					}

  				case RotationOrder.ZXY:
  					{

  						this.x = Math.asin(clamp(m21, -1, 1));

  						if (Math.abs(m21) < THRESHOLD) {

  							this.y = Math.atan2(-m20, m22);
  							this.z = Math.atan2(-m01, m11);
  						} else {

  							this.y = 0;
  							this.z = Math.atan2(m10, m00);
  						}

  						break;
  					}

  				case RotationOrder.ZYX:
  					{

  						this.y = Math.asin(-clamp(m20, -1, 1));

  						if (Math.abs(m20) < THRESHOLD) {

  							this.x = Math.atan2(m21, m22);
  							this.z = Math.atan2(m10, m00);
  						} else {

  							this.x = 0;
  							this.z = Math.atan2(-m01, m11);
  						}

  						break;
  					}

  				case RotationOrder.YZX:
  					{

  						this.z = Math.asin(clamp(m10, -1, 1));

  						if (Math.abs(m10) < THRESHOLD) {

  							this.x = Math.atan2(-m12, m11);
  							this.y = Math.atan2(-m20, m00);
  						} else {

  							this.x = 0;
  							this.y = Math.atan2(m02, m22);
  						}

  						break;
  					}

  				case RotationOrder.XZY:
  					{

  						this.z = Math.asin(-clamp(m01, -1, 1));

  						if (Math.abs(m01) < THRESHOLD) {

  							this.x = Math.atan2(m21, m11);
  							this.y = Math.atan2(m02, m00);
  						} else {

  							this.x = Math.atan2(-m12, m22);
  							this.y = 0;
  						}

  						break;
  					}

  			}

  			this.order = order;

  			return this;
  		}
  	}, {
  		key: "setFromQuaternion",
  		value: function setFromQuaternion(q, order) {

  			m.makeRotationFromQuaternion(q);

  			return this.setFromRotationMatrix(m, order);
  		}
  	}, {
  		key: "setFromVector3",
  		value: function setFromVector3(v) {
  			var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.order;


  			return this.set(v.x, v.y, v.z, order);
  		}
  	}, {
  		key: "reorder",
  		value: function reorder(newOrder) {

  			q.setFromEuler(this);

  			return this.setFromQuaternion(q, newOrder);
  		}
  	}, {
  		key: "equals",
  		value: function equals(e) {

  			return e.x === this.x && e.y === this.y && e.z === this.z && e.order === this.order;
  		}
  	}], [{
  		key: "defaultOrder",
  		get: function get$$1() {

  			return RotationOrder.XYZ;
  		}
  	}]);
  	return Euler;
  }();

  var a = new Vector3();

  var b = new Vector3();

  var Plane = function () {
  	function Plane() {
  		var normal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3(1, 0, 0);
  		var constant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, Plane);


  		this.normal = normal;

  		this.constant = constant;
  	}

  	createClass(Plane, [{
  		key: "set",
  		value: function set$$1(normal, constant) {

  			this.normal.copy(normal);
  			this.constant = constant;

  			return this;
  		}
  	}, {
  		key: "setComponents",
  		value: function setComponents(x, y, z, w) {

  			this.normal.set(x, y, z);
  			this.constant = w;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(p) {

  			this.normal.copy(p.normal);
  			this.constant = p.constant;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "setFromNormalAndCoplanarPoint",
  		value: function setFromNormalAndCoplanarPoint(n, p) {

  			this.normal.copy(n);
  			this.constant = -p.dot(this.normal);

  			return this;
  		}
  	}, {
  		key: "setFromCoplanarPoints",
  		value: function setFromCoplanarPoints(p0, p1, p2) {

  			var normal = a.subVectors(p2, p1).cross(b.subVectors(p0, p1)).normalize();

  			this.setFromNormalAndCoplanarPoint(normal, a);

  			return this;
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			var inverseNormalLength = 1.0 / this.normal.length();

  			this.normal.multiplyScalar(inverseNormalLength);
  			this.constant *= inverseNormalLength;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.normal.negate();
  			this.constant = -this.constant;

  			return this;
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			return this.normal.dot(p) + this.constant;
  		}
  	}, {
  		key: "distanceToSphere",
  		value: function distanceToSphere(s) {

  			return this.distanceToPoint(s.center) - s.radius;
  		}
  	}, {
  		key: "projectPoint",
  		value: function projectPoint(p, target) {

  			return target.copy(this.normal).multiplyScalar(-this.distanceToPoint(p)).add(p);
  		}
  	}, {
  		key: "coplanarPoint",
  		value: function coplanarPoint(target) {

  			return target.copy(this.normal).multiplyScalar(-this.constant);
  		}
  	}, {
  		key: "translate",
  		value: function translate(offset) {

  			this.constant -= offset.dot(this.normal);

  			return this;
  		}
  	}, {
  		key: "intersectLine",
  		value: function intersectLine(l, target) {

  			var direction = l.delta(a);
  			var denominator = this.normal.dot(direction);

  			if (denominator === 0) {
  				if (this.distanceToPoint(l.start) === 0) {

  					target.copy(l.start);
  				}
  			} else {

  				var t = -(l.start.dot(this.normal) + this.constant) / denominator;

  				if (t >= 0 && t <= 1) {

  					target.copy(direction).multiplyScalar(t).add(l.start);
  				}
  			}

  			return target;
  		}
  	}, {
  		key: "intersectsLine",
  		value: function intersectsLine(l) {

  			var startSign = this.distanceToPoint(l.start);
  			var endSign = this.distanceToPoint(l.end);

  			return startSign < 0 && endSign > 0 || endSign < 0 && startSign > 0;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			return b.intersectsPlane(this);
  		}
  	}, {
  		key: "intersectsSphere",
  		value: function intersectsSphere(s) {

  			return s.intersectsPlane(this);
  		}
  	}, {
  		key: "equals",
  		value: function equals(p) {

  			return p.normal.equals(this.normal) && p.constant === this.constant;
  		}
  	}]);
  	return Plane;
  }();

  var v$4 = new Vector3();

  var Frustum = function () {
  		function Frustum() {
  				var p0 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Plane();
  				var p1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Plane();
  				var p2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Plane();
  				var p3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Plane();
  				var p4 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Plane();
  				var p5 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new Plane();
  				classCallCheck(this, Frustum);


  				this.planes = [p0, p1, p2, p3, p4, p5];
  		}

  		createClass(Frustum, [{
  				key: "set",
  				value: function set$$1(p0, p1, p2, p3, p4, p5) {

  						var planes = this.planes;

  						planes[0].copy(p0);
  						planes[1].copy(p1);
  						planes[2].copy(p2);
  						planes[3].copy(p3);
  						planes[4].copy(p4);
  						planes[5].copy(p5);

  						return this;
  				}
  		}, {
  				key: "clone",
  				value: function clone() {

  						return new this.constructor().copy(this);
  				}
  		}, {
  				key: "copy",
  				value: function copy(frustum) {

  						var planes = this.planes;

  						var i = void 0;

  						for (i = 0; i < 6; ++i) {

  								planes[i].copy(frustum.planes[i]);
  						}

  						return this;
  				}
  		}, {
  				key: "setFromMatrix",
  				value: function setFromMatrix(m) {

  						var planes = this.planes;

  						var me = m.elements;
  						var me0 = me[0],
  						    me1 = me[1],
  						    me2 = me[2],
  						    me3 = me[3];
  						var me4 = me[4],
  						    me5 = me[5],
  						    me6 = me[6],
  						    me7 = me[7];
  						var me8 = me[8],
  						    me9 = me[9],
  						    me10 = me[10],
  						    me11 = me[11];
  						var me12 = me[12],
  						    me13 = me[13],
  						    me14 = me[14],
  						    me15 = me[15];

  						planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
  						planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
  						planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
  						planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
  						planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
  						planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();

  						return this;
  				}
  		}, {
  				key: "intersectsSphere",
  				value: function intersectsSphere(sphere) {

  						var planes = this.planes;
  						var center = sphere.center;
  						var negativeRadius = -sphere.radius;

  						var result = true;
  						var i = void 0,
  						    d = void 0;

  						for (i = 0; i < 6; ++i) {

  								d = planes[i].distanceToPoint(center);

  								if (d < negativeRadius) {

  										result = false;
  										break;
  								}
  						}

  						return result;
  				}
  		}, {
  				key: "intersectsBox",
  				value: function intersectsBox(box) {

  						var planes = this.planes;
  						var min = box.min,
  						    max = box.max;

  						var i = void 0,
  						    plane = void 0;

  						for (i = 0; i < 6; ++i) {

  								plane = planes[i];

  								v$4.x = plane.normal.x > 0.0 ? max.x : min.x;
  								v$4.y = plane.normal.y > 0.0 ? max.y : min.y;
  								v$4.z = plane.normal.z > 0.0 ? max.z : min.z;

  								if (plane.distanceToPoint(v$4) < 0.0) {

  										return false;
  								}
  						}

  						return true;
  				}
  		}, {
  				key: "containsPoint",
  				value: function containsPoint(point) {

  						var planes = this.planes;

  						var result = true;
  						var i = void 0;

  						for (i = 0; i < 6; ++i) {

  								if (planes[i].distanceToPoint(point) < 0) {

  										result = false;
  										break;
  								}
  						}

  						return result;
  				}
  		}]);
  		return Frustum;
  }();

  var a$1 = new Vector3();

  var b$1 = new Vector3();

  var Line3 = function () {
  	function Line3() {
  		var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
  		var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
  		classCallCheck(this, Line3);


  		this.start = start;

  		this.end = end;
  	}

  	createClass(Line3, [{
  		key: "set",
  		value: function set$$1(start, end) {

  			this.start.copy(start);
  			this.end.copy(end);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(l) {

  			this.start.copy(l.start);
  			this.end.copy(l.end);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  		}
  	}, {
  		key: "delta",
  		value: function delta() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return target.subVectors(this.end, this.start);
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.start.distanceToSquared(this.end);
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return this.start.distanceTo(this.end);
  		}
  	}, {
  		key: "at",
  		value: function at(d, target) {

  			return this.delta(target).multiplyScalar(d).add(this.start);
  		}
  	}, {
  		key: "closestPointToPointParameter",
  		value: function closestPointToPointParameter(p, clampToLine) {

  			a$1.subVectors(p, this.start);
  			b$1.subVectors(this.end, this.start);

  			var bb = b$1.dot(b$1);
  			var ba = b$1.dot(a$1);

  			var t = clampToLine ? Math.min(Math.max(ba / bb, 0), 1) : ba / bb;

  			return t;
  		}
  	}, {
  		key: "closestPointToPoint",
  		value: function closestPointToPoint(p) {
  			var clampToLine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector3();


  			var t = this.closestPointToPointParameter(p, clampToLine);

  			return this.delta(target).multiplyScalar(t).add(this.start);
  		}
  	}, {
  		key: "equals",
  		value: function equals(l) {

  			return l.start.equals(this.start) && l.end.equals(this.end);
  		}
  	}]);
  	return Line3;
  }();

  var a$2 = new Vector3();

  var b$2 = new Vector3();

  var c = new Vector3();

  var Matrix4 = function () {
  		function Matrix4() {
  				classCallCheck(this, Matrix4);


  				this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  		}

  		createClass(Matrix4, [{
  				key: "set",
  				value: function set$$1(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {

  						var te = this.elements;

  						te[0] = n00;te[4] = n01;te[8] = n02;te[12] = n03;
  						te[1] = n10;te[5] = n11;te[9] = n12;te[13] = n13;
  						te[2] = n20;te[6] = n21;te[10] = n22;te[14] = n23;
  						te[3] = n30;te[7] = n31;te[11] = n32;te[15] = n33;

  						return this;
  				}
  		}, {
  				key: "identity",
  				value: function identity() {

  						this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "copy",
  				value: function copy(matrix) {

  						var me = matrix.elements;
  						var te = this.elements;

  						te[0] = me[0];te[1] = me[1];te[2] = me[2];te[3] = me[3];
  						te[4] = me[4];te[5] = me[5];te[6] = me[6];te[7] = me[7];
  						te[8] = me[8];te[9] = me[9];te[10] = me[10];te[11] = me[11];
  						te[12] = me[12];te[13] = me[13];te[14] = me[14];te[15] = me[15];

  						return this;
  				}
  		}, {
  				key: "clone",
  				value: function clone() {

  						return new this.constructor().fromArray(this.elements);
  				}
  		}, {
  				key: "fromArray",
  				value: function fromArray(array) {
  						var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  						var te = this.elements;

  						var i = void 0;

  						for (i = 0; i < 16; ++i) {

  								te[i] = array[i + offset];
  						}

  						return this;
  				}
  		}, {
  				key: "toArray",
  				value: function toArray$$1() {
  						var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  						var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  						var te = this.elements;

  						var i = void 0;

  						for (i = 0; i < 16; ++i) {

  								array[i + offset] = te[i];
  						}

  						return array;
  				}
  		}, {
  				key: "getMaxScaleOnAxis",
  				value: function getMaxScaleOnAxis() {

  						var te = this.elements;

  						var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
  						var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
  						var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

  						return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  				}
  		}, {
  				key: "copyPosition",
  				value: function copyPosition(matrix) {

  						var te = this.elements;
  						var me = matrix.elements;

  						te[12] = me[12];
  						te[13] = me[13];
  						te[14] = me[14];

  						return this;
  				}
  		}, {
  				key: "setPosition",
  				value: function setPosition(p) {

  						var te = this.elements;

  						te[12] = p.x;
  						te[13] = p.y;
  						te[14] = p.z;

  						return this;
  				}
  		}, {
  				key: "extractBasis",
  				value: function extractBasis(xAxis, yAxis, zAxis) {

  						xAxis.setFromMatrixColumn(this, 0);
  						yAxis.setFromMatrixColumn(this, 1);
  						zAxis.setFromMatrixColumn(this, 2);

  						return this;
  				}
  		}, {
  				key: "makeBasis",
  				value: function makeBasis(xAxis, yAxis, zAxis) {

  						this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "extractRotation",
  				value: function extractRotation(m) {

  						var te = this.elements;
  						var me = m.elements;

  						var scaleX = 1.0 / a$2.setFromMatrixColumn(m, 0).length();
  						var scaleY = 1.0 / a$2.setFromMatrixColumn(m, 1).length();
  						var scaleZ = 1.0 / a$2.setFromMatrixColumn(m, 2).length();

  						te[0] = me[0] * scaleX;
  						te[1] = me[1] * scaleX;
  						te[2] = me[2] * scaleX;
  						te[3] = 0;

  						te[4] = me[4] * scaleY;
  						te[5] = me[5] * scaleY;
  						te[6] = me[6] * scaleY;
  						te[7] = 0;

  						te[8] = me[8] * scaleZ;
  						te[9] = me[9] * scaleZ;
  						te[10] = me[10] * scaleZ;
  						te[11] = 0;

  						te[12] = 0;
  						te[13] = 0;
  						te[14] = 0;
  						te[15] = 1;

  						return this;
  				}
  		}, {
  				key: "makeRotationFromEuler",
  				value: function makeRotationFromEuler(euler) {

  						var te = this.elements;

  						var x = euler.x;
  						var y = euler.y;
  						var z = euler.z;

  						var a = Math.cos(x),
  						    b = Math.sin(x);
  						var c = Math.cos(y),
  						    d = Math.sin(y);
  						var e = Math.cos(z),
  						    f = Math.sin(z);

  						var ae = void 0,
  						    af = void 0,
  						    be = void 0,
  						    bf = void 0;
  						var ce = void 0,
  						    cf = void 0,
  						    de = void 0,
  						    df = void 0;
  						var ac = void 0,
  						    ad = void 0,
  						    bc = void 0,
  						    bd = void 0;

  						switch (euler.order) {

  								case RotationOrder.XYZ:
  										{

  												ae = a * e, af = a * f, be = b * e, bf = b * f;

  												te[0] = c * e;
  												te[4] = -c * f;
  												te[8] = d;

  												te[1] = af + be * d;
  												te[5] = ae - bf * d;
  												te[9] = -b * c;

  												te[2] = bf - ae * d;
  												te[6] = be + af * d;
  												te[10] = a * c;

  												break;
  										}

  								case RotationOrder.YXZ:
  										{

  												ce = c * e, cf = c * f, de = d * e, df = d * f;

  												te[0] = ce + df * b;
  												te[4] = de * b - cf;
  												te[8] = a * d;

  												te[1] = a * f;
  												te[5] = a * e;
  												te[9] = -b;

  												te[2] = cf * b - de;
  												te[6] = df + ce * b;
  												te[10] = a * c;

  												break;
  										}

  								case RotationOrder.ZXY:
  										{

  												ce = c * e, cf = c * f, de = d * e, df = d * f;

  												te[0] = ce - df * b;
  												te[4] = -a * f;
  												te[8] = de + cf * b;

  												te[1] = cf + de * b;
  												te[5] = a * e;
  												te[9] = df - ce * b;

  												te[2] = -a * d;
  												te[6] = b;
  												te[10] = a * c;

  												break;
  										}

  								case RotationOrder.ZYX:
  										{

  												ae = a * e, af = a * f, be = b * e, bf = b * f;

  												te[0] = c * e;
  												te[4] = be * d - af;
  												te[8] = ae * d + bf;

  												te[1] = c * f;
  												te[5] = bf * d + ae;
  												te[9] = af * d - be;

  												te[2] = -d;
  												te[6] = b * c;
  												te[10] = a * c;

  												break;
  										}

  								case RotationOrder.YZX:
  										{

  												ac = a * c, ad = a * d, bc = b * c, bd = b * d;

  												te[0] = c * e;
  												te[4] = bd - ac * f;
  												te[8] = bc * f + ad;

  												te[1] = f;
  												te[5] = a * e;
  												te[9] = -b * e;

  												te[2] = -d * e;
  												te[6] = ad * f + bc;
  												te[10] = ac - bd * f;

  												break;
  										}

  								case RotationOrder.XZY:
  										{

  												ac = a * c, ad = a * d, bc = b * c, bd = b * d;

  												te[0] = c * e;
  												te[4] = -f;
  												te[8] = d * e;

  												te[1] = ac * f + bd;
  												te[5] = a * e;
  												te[9] = ad * f - bc;

  												te[2] = bc * f - ad;
  												te[6] = b * e;
  												te[10] = bd * f + ac;

  												break;
  										}

  						}

  						te[3] = 0;
  						te[7] = 0;
  						te[11] = 0;

  						te[12] = 0;
  						te[13] = 0;
  						te[14] = 0;
  						te[15] = 1;

  						return this;
  				}
  		}, {
  				key: "makeRotationFromQuaternion",
  				value: function makeRotationFromQuaternion(q) {

  						return this.compose(a$2.set(0, 0, 0), q, b$2.set(1, 1, 1));
  				}
  		}, {
  				key: "lookAt",
  				value: function lookAt(eye, target, up) {

  						var te = this.elements;
  						var x = a$2,
  						    y = b$2,
  						    z = c;

  						z.subVectors(eye, target);

  						if (z.lengthSquared() === 0) {
  								z.z = 1;
  						}

  						z.normalize();
  						x.crossVectors(up, z);

  						if (x.lengthSquared() === 0) {
  								if (Math.abs(up.z) === 1) {

  										z.x += 1e-4;
  								} else {

  										z.z += 1e-4;
  								}

  								z.normalize();
  								x.crossVectors(up, z);
  						}

  						x.normalize();
  						y.crossVectors(z, x);

  						te[0] = x.x;te[4] = y.x;te[8] = z.x;
  						te[1] = x.y;te[5] = y.y;te[9] = z.y;
  						te[2] = x.z;te[6] = y.z;te[10] = z.z;

  						return this;
  				}
  		}, {
  				key: "multiplyMatrices",
  				value: function multiplyMatrices(a, b) {

  						var te = this.elements;
  						var ae = a.elements;
  						var be = b.elements;

  						var a00 = ae[0],
  						    a01 = ae[4],
  						    a02 = ae[8],
  						    a03 = ae[12];
  						var a10 = ae[1],
  						    a11 = ae[5],
  						    a12 = ae[9],
  						    a13 = ae[13];
  						var a20 = ae[2],
  						    a21 = ae[6],
  						    a22 = ae[10],
  						    a23 = ae[14];
  						var a30 = ae[3],
  						    a31 = ae[7],
  						    a32 = ae[11],
  						    a33 = ae[15];

  						var b00 = be[0],
  						    b01 = be[4],
  						    b02 = be[8],
  						    b03 = be[12];
  						var b10 = be[1],
  						    b11 = be[5],
  						    b12 = be[9],
  						    b13 = be[13];
  						var b20 = be[2],
  						    b21 = be[6],
  						    b22 = be[10],
  						    b23 = be[14];
  						var b30 = be[3],
  						    b31 = be[7],
  						    b32 = be[11],
  						    b33 = be[15];

  						te[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
  						te[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
  						te[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
  						te[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

  						te[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
  						te[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
  						te[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
  						te[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

  						te[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
  						te[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
  						te[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
  						te[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

  						te[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
  						te[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
  						te[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
  						te[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

  						return this;
  				}
  		}, {
  				key: "multiply",
  				value: function multiply(m) {

  						return this.multiplyMatrices(this, m);
  				}
  		}, {
  				key: "premultiply",
  				value: function premultiply(m) {

  						return this.multiplyMatrices(m, this);
  				}
  		}, {
  				key: "multiplyScalar",
  				value: function multiplyScalar(s) {

  						var te = this.elements;

  						te[0] *= s;te[4] *= s;te[8] *= s;te[12] *= s;
  						te[1] *= s;te[5] *= s;te[9] *= s;te[13] *= s;
  						te[2] *= s;te[6] *= s;te[10] *= s;te[14] *= s;
  						te[3] *= s;te[7] *= s;te[11] *= s;te[15] *= s;

  						return this;
  				}
  		}, {
  				key: "determinant",
  				value: function determinant() {

  						var te = this.elements;

  						var n00 = te[0],
  						    n01 = te[4],
  						    n02 = te[8],
  						    n03 = te[12];
  						var n10 = te[1],
  						    n11 = te[5],
  						    n12 = te[9],
  						    n13 = te[13];
  						var n20 = te[2],
  						    n21 = te[6],
  						    n22 = te[10],
  						    n23 = te[14];
  						var n30 = te[3],
  						    n31 = te[7],
  						    n32 = te[11],
  						    n33 = te[15];

  						var n00n11 = n00 * n11,
  						    n00n12 = n00 * n12,
  						    n00n13 = n00 * n13;
  						var n01n10 = n01 * n10,
  						    n01n12 = n01 * n12,
  						    n01n13 = n01 * n13;
  						var n02n10 = n02 * n10,
  						    n02n11 = n02 * n11,
  						    n02n13 = n02 * n13;
  						var n03n10 = n03 * n10,
  						    n03n11 = n03 * n11,
  						    n03n12 = n03 * n12;

  						return n30 * (n03n12 * n21 - n02n13 * n21 - n03n11 * n22 + n01n13 * n22 + n02n11 * n23 - n01n12 * n23) + n31 * (n00n12 * n23 - n00n13 * n22 + n03n10 * n22 - n02n10 * n23 + n02n13 * n20 - n03n12 * n20) + n32 * (n00n13 * n21 - n00n11 * n23 - n03n10 * n21 + n01n10 * n23 + n03n11 * n20 - n01n13 * n20) + n33 * (-n02n11 * n20 - n00n12 * n21 + n00n11 * n22 + n02n10 * n21 - n01n10 * n22 + n01n12 * n20);
  				}
  		}, {
  				key: "getInverse",
  				value: function getInverse(matrix) {

  						var te = this.elements;
  						var me = matrix.elements;

  						var n00 = me[0],
  						    n10 = me[1],
  						    n20 = me[2],
  						    n30 = me[3];
  						var n01 = me[4],
  						    n11 = me[5],
  						    n21 = me[6],
  						    n31 = me[7];
  						var n02 = me[8],
  						    n12 = me[9],
  						    n22 = me[10],
  						    n32 = me[11];
  						var n03 = me[12],
  						    n13 = me[13],
  						    n23 = me[14],
  						    n33 = me[15];

  						var t00 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
  						var t01 = n03 * n22 * n31 - n02 * n23 * n31 - n03 * n21 * n32 + n01 * n23 * n32 + n02 * n21 * n33 - n01 * n22 * n33;
  						var t02 = n02 * n13 * n31 - n03 * n12 * n31 + n03 * n11 * n32 - n01 * n13 * n32 - n02 * n11 * n33 + n01 * n12 * n33;
  						var t03 = n03 * n12 * n21 - n02 * n13 * n21 - n03 * n11 * n22 + n01 * n13 * n22 + n02 * n11 * n23 - n01 * n12 * n23;

  						var det = n00 * t00 + n10 * t01 + n20 * t02 + n30 * t03;

  						var invDet = void 0;

  						if (det !== 0) {

  								invDet = 1.0 / det;

  								te[0] = t00 * invDet;
  								te[1] = (n13 * n22 * n30 - n12 * n23 * n30 - n13 * n20 * n32 + n10 * n23 * n32 + n12 * n20 * n33 - n10 * n22 * n33) * invDet;
  								te[2] = (n11 * n23 * n30 - n13 * n21 * n30 + n13 * n20 * n31 - n10 * n23 * n31 - n11 * n20 * n33 + n10 * n21 * n33) * invDet;
  								te[3] = (n12 * n21 * n30 - n11 * n22 * n30 - n12 * n20 * n31 + n10 * n22 * n31 + n11 * n20 * n32 - n10 * n21 * n32) * invDet;

  								te[4] = t01 * invDet;
  								te[5] = (n02 * n23 * n30 - n03 * n22 * n30 + n03 * n20 * n32 - n00 * n23 * n32 - n02 * n20 * n33 + n00 * n22 * n33) * invDet;
  								te[6] = (n03 * n21 * n30 - n01 * n23 * n30 - n03 * n20 * n31 + n00 * n23 * n31 + n01 * n20 * n33 - n00 * n21 * n33) * invDet;
  								te[7] = (n01 * n22 * n30 - n02 * n21 * n30 + n02 * n20 * n31 - n00 * n22 * n31 - n01 * n20 * n32 + n00 * n21 * n32) * invDet;

  								te[8] = t02 * invDet;
  								te[9] = (n03 * n12 * n30 - n02 * n13 * n30 - n03 * n10 * n32 + n00 * n13 * n32 + n02 * n10 * n33 - n00 * n12 * n33) * invDet;
  								te[10] = (n01 * n13 * n30 - n03 * n11 * n30 + n03 * n10 * n31 - n00 * n13 * n31 - n01 * n10 * n33 + n00 * n11 * n33) * invDet;
  								te[11] = (n02 * n11 * n30 - n01 * n12 * n30 - n02 * n10 * n31 + n00 * n12 * n31 + n01 * n10 * n32 - n00 * n11 * n32) * invDet;

  								te[12] = t03 * invDet;
  								te[13] = (n02 * n13 * n20 - n03 * n12 * n20 + n03 * n10 * n22 - n00 * n13 * n22 - n02 * n10 * n23 + n00 * n12 * n23) * invDet;
  								te[14] = (n03 * n11 * n20 - n01 * n13 * n20 - n03 * n10 * n21 + n00 * n13 * n21 + n01 * n10 * n23 - n00 * n11 * n23) * invDet;
  								te[15] = (n01 * n12 * n20 - n02 * n11 * n20 + n02 * n10 * n21 - n00 * n12 * n21 - n01 * n10 * n22 + n00 * n11 * n22) * invDet;
  						} else {

  								console.error("Can't invert matrix, determinant is zero", matrix);

  								this.identity();
  						}

  						return this;
  				}
  		}, {
  				key: "transpose",
  				value: function transpose() {

  						var te = this.elements;

  						var t = void 0;

  						t = te[1];te[1] = te[4];te[4] = t;
  						t = te[2];te[2] = te[8];te[8] = t;
  						t = te[6];te[6] = te[9];te[9] = t;

  						t = te[3];te[3] = te[12];te[12] = t;
  						t = te[7];te[7] = te[13];te[13] = t;
  						t = te[11];te[11] = te[14];te[14] = t;

  						return this;
  				}
  		}, {
  				key: "scale",
  				value: function scale(sx, sy, sz) {

  						var te = this.elements;

  						te[0] *= sx;te[4] *= sy;te[8] *= sz;
  						te[1] *= sx;te[5] *= sy;te[9] *= sz;
  						te[2] *= sx;te[6] *= sy;te[10] *= sz;
  						te[3] *= sx;te[7] *= sy;te[11] *= sz;

  						return this;
  				}
  		}, {
  				key: "makeScale",
  				value: function makeScale(x, y, z) {

  						this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeTranslation",
  				value: function makeTranslation(x, y, z) {

  						this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeRotationX",
  				value: function makeRotationX(theta) {

  						var c = Math.cos(theta),
  						    s = Math.sin(theta);

  						this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeRotationY",
  				value: function makeRotationY(theta) {

  						var c = Math.cos(theta),
  						    s = Math.sin(theta);

  						this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeRotationZ",
  				value: function makeRotationZ(theta) {

  						var c = Math.cos(theta),
  						    s = Math.sin(theta);

  						this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeRotationAxis",
  				value: function makeRotationAxis(axis, angle) {

  						var c = Math.cos(angle);
  						var s = Math.sin(angle);

  						var t = 1.0 - c;

  						var x = axis.x,
  						    y = axis.y,
  						    z = axis.z;
  						var tx = t * x,
  						    ty = t * y;

  						this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeShear",
  				value: function makeShear(x, y, z) {

  						this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "compose",
  				value: function compose(position, quaternion, scale) {

  						var te = this.elements;

  						var x = quaternion.x,
  						    y = quaternion.y,
  						    z = quaternion.z,
  						    w = quaternion.w;
  						var x2 = x + x,
  						    y2 = y + y,
  						    z2 = z + z;
  						var xx = x * x2,
  						    xy = x * y2,
  						    xz = x * z2;
  						var yy = y * y2,
  						    yz = y * z2,
  						    zz = z * z2;
  						var wx = w * x2,
  						    wy = w * y2,
  						    wz = w * z2;

  						var sx = scale.x,
  						    sy = scale.y,
  						    sz = scale.z;

  						te[0] = (1 - (yy + zz)) * sx;
  						te[1] = (xy + wz) * sx;
  						te[2] = (xz - wy) * sx;
  						te[3] = 0;

  						te[4] = (xy - wz) * sy;
  						te[5] = (1 - (xx + zz)) * sy;
  						te[6] = (yz + wx) * sy;
  						te[7] = 0;

  						te[8] = (xz + wy) * sz;
  						te[9] = (yz - wx) * sz;
  						te[10] = (1 - (xx + yy)) * sz;
  						te[11] = 0;

  						te[12] = position.x;
  						te[13] = position.y;
  						te[14] = position.z;
  						te[15] = 1;

  						return this;
  				}
  		}, {
  				key: "decompose",
  				value: function decompose(position, quaternion, scale) {

  						var te = this.elements;

  						var n00 = te[0],
  						    n10 = te[1],
  						    n20 = te[2];
  						var n01 = te[4],
  						    n11 = te[5],
  						    n21 = te[6];
  						var n02 = te[8],
  						    n12 = te[9],
  						    n22 = te[10];

  						var det = this.determinant();

  						var sx = a$2.set(n00, n10, n20).length() * (det < 0 ? -1 : 1);
  						var sy = a$2.set(n01, n11, n21).length();
  						var sz = a$2.set(n02, n12, n22).length();

  						var invSX = 1.0 / sx;
  						var invSY = 1.0 / sy;
  						var invSZ = 1.0 / sz;

  						position.x = te[12];
  						position.y = te[13];
  						position.z = te[14];

  						te[0] *= invSX;te[1] *= invSX;te[2] *= invSX;
  						te[4] *= invSY;te[5] *= invSY;te[6] *= invSY;
  						te[8] *= invSZ;te[9] *= invSZ;te[10] *= invSZ;

  						quaternion.setFromRotationMatrix(this);

  						te[0] = n00;te[1] = n10;te[2] = n20;
  						te[4] = n01;te[5] = n11;te[6] = n21;
  						te[8] = n02;te[9] = n12;te[10] = n22;

  						scale.x = sx;
  						scale.y = sy;
  						scale.z = sz;

  						return this;
  				}
  		}, {
  				key: "makePerspective",
  				value: function makePerspective(left, right, top, bottom, near, far) {

  						var te = this.elements;
  						var x = 2 * near / (right - left);
  						var y = 2 * near / (top - bottom);

  						var a = (right + left) / (right - left);
  						var b = (top + bottom) / (top - bottom);
  						var c = -(far + near) / (far - near);
  						var d = -2 * far * near / (far - near);

  						te[0] = x;te[4] = 0;te[8] = a;te[12] = 0;
  						te[1] = 0;te[5] = y;te[9] = b;te[13] = 0;
  						te[2] = 0;te[6] = 0;te[10] = c;te[14] = d;
  						te[3] = 0;te[7] = 0;te[11] = -1;te[15] = 0;

  						return this;
  				}
  		}, {
  				key: "makeOrthographic",
  				value: function makeOrthographic(left, right, top, bottom, near, far) {

  						var te = this.elements;
  						var w = 1.0 / (right - left);
  						var h = 1.0 / (top - bottom);
  						var p = 1.0 / (far - near);

  						var x = (right + left) * w;
  						var y = (top + bottom) * h;
  						var z = (far + near) * p;

  						te[0] = 2 * w;te[4] = 0;te[8] = 0;te[12] = -x;
  						te[1] = 0;te[5] = 2 * h;te[9] = 0;te[13] = -y;
  						te[2] = 0;te[6] = 0;te[10] = -2 * p;te[14] = -z;
  						te[3] = 0;te[7] = 0;te[11] = 0;te[15] = 1;

  						return this;
  				}
  		}, {
  				key: "equals",
  				value: function equals(m) {

  						var te = this.elements;
  						var me = m.elements;

  						var result = true;
  						var i = void 0;

  						for (i = 0; result && i < 16; ++i) {

  								if (te[i] !== me[i]) {

  										result = false;
  								}
  						}

  						return result;
  				}
  		}]);
  		return Matrix4;
  }();

  var v$5 = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];

  var Ray = function () {
  	function Ray() {
  		var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
  		var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
  		classCallCheck(this, Ray);


  		this.origin = origin;

  		this.direction = direction;
  	}

  	createClass(Ray, [{
  		key: "set",
  		value: function set$$1(origin, direction) {

  			this.origin.copy(origin);
  			this.direction.copy(direction);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(r) {

  			this.origin.copy(r.origin);
  			this.direction.copy(r.direction);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "at",
  		value: function at(t) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


  			return target.copy(this.direction).multiplyScalar(t).add(this.origin);
  		}
  	}, {
  		key: "lookAt",
  		value: function lookAt(target) {

  			this.direction.copy(target).sub(this.origin).normalize();

  			return this;
  		}
  	}, {
  		key: "recast",
  		value: function recast(t) {

  			this.origin.copy(this.at(t, v$5[0]));

  			return this;
  		}
  	}, {
  		key: "closestPointToPoint",
  		value: function closestPointToPoint(p) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


  			var directionDistance = target.subVectors(p, this.origin).dot(this.direction);

  			return directionDistance >= 0.0 ? target.copy(this.direction).multiplyScalar(directionDistance).add(this.origin) : target.copy(this.origin);
  		}
  	}, {
  		key: "distanceSquaredToPoint",
  		value: function distanceSquaredToPoint(p) {

  			var directionDistance = v$5[0].subVectors(p, this.origin).dot(this.direction);

  			return directionDistance < 0.0 ? this.origin.distanceToSquared(p) : v$5[0].copy(this.direction).multiplyScalar(directionDistance).add(this.origin).distanceToSquared(p);
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			return Math.sqrt(this.distanceSquaredToPoint(p));
  		}
  	}, {
  		key: "distanceToPlane",
  		value: function distanceToPlane(p) {

  			var denominator = p.normal.dot(this.direction);

  			var t = denominator !== 0.0 ? -(this.origin.dot(p.normal) + p.constant) / denominator : p.distanceToPoint(this.origin) === 0.0 ? 0.0 : -1.0;

  			return t >= 0.0 ? t : null;
  		}
  	}, {
  		key: "distanceSquaredToSegment",
  		value: function distanceSquaredToSegment(v0, v1, pointOnRay, pointOnSegment) {

  			var segCenter = v$5[0].copy(v0).add(v1).multiplyScalar(0.5);
  			var segDir = v$5[1].copy(v1).sub(v0).normalize();
  			var diff = v$5[2].copy(this.origin).sub(segCenter);

  			var segExtent = v0.distanceTo(v1) * 0.5;
  			var a01 = -this.direction.dot(segDir);
  			var b0 = diff.dot(this.direction);
  			var b1 = -diff.dot(segDir);
  			var c = diff.lengthSq();
  			var det = Math.abs(1.0 - a01 * a01);

  			var s0 = void 0,
  			    s1 = void 0,
  			    extDet = void 0,
  			    invDet = void 0,
  			    sqrDist = void 0;

  			if (det > 0.0) {
  				s0 = a01 * b1 - b0;
  				s1 = a01 * b0 - b1;
  				extDet = segExtent * det;

  				if (s0 >= 0.0) {

  					if (s1 >= -extDet) {

  						if (s1 <= extDet) {
  							invDet = 1.0 / det;
  							s0 *= invDet;
  							s1 *= invDet;
  							sqrDist = s0 * (s0 + a01 * s1 + 2.0 * b0) + s1 * (a01 * s0 + s1 + 2.0 * b1) + c;
  						} else {
  							s1 = segExtent;
  							s0 = Math.max(0.0, -(a01 * s1 + b0));
  							sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
  						}
  					} else {
  						s1 = -segExtent;
  						s0 = Math.max(0.0, -(a01 * s1 + b0));
  						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
  					}
  				} else {

  					if (s1 <= -extDet) {
  						s0 = Math.max(0.0, -(-a01 * segExtent + b0));
  						s1 = s0 > 0.0 ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
  						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
  					} else if (s1 <= extDet) {
  						s0 = 0.0;
  						s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
  						sqrDist = s1 * (s1 + 2.0 * b1) + c;
  					} else {
  						s0 = Math.max(0.0, -(a01 * segExtent + b0));
  						s1 = s0 > 0.0 ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
  						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
  					}
  				}
  			} else {
  				s1 = a01 > 0.0 ? -segExtent : segExtent;
  				s0 = Math.max(0.0, -(a01 * s1 + b0));
  				sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
  			}

  			if (pointOnRay !== undefined) {

  				pointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);
  			}

  			if (pointOnSegment !== undefined) {

  				pointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);
  			}

  			return sqrDist;
  		}
  	}, {
  		key: "intersectSphere",
  		value: function intersectSphere(s) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


  			var ab = v$5[0].subVectors(s.center, this.origin);
  			var tca = ab.dot(this.direction);
  			var d2 = ab.dot(ab) - tca * tca;
  			var radius2 = s.radius * s.radius;

  			var result = null;
  			var thc = void 0,
  			    t0 = void 0,
  			    t1 = void 0;

  			if (d2 <= radius2) {

  				thc = Math.sqrt(radius2 - d2);

  				t0 = tca - thc;

  				t1 = tca + thc;

  				if (t0 >= 0.0 || t1 >= 0.0) {
  					result = t0 < 0.0 ? this.at(t1, target) : this.at(t0, target);
  				}
  			}

  			return result;
  		}
  	}, {
  		key: "intersectsSphere",
  		value: function intersectsSphere(s) {

  			return this.distanceToPoint(s.center) <= s.radius;
  		}
  	}, {
  		key: "intersectPlane",
  		value: function intersectPlane(p) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


  			var t = this.distanceToPlane(p);

  			return t === null ? null : this.at(t, target);
  		}
  	}, {
  		key: "intersectsPlane",
  		value: function intersectsPlane(p) {

  			var distanceToPoint = p.distanceToPoint(this.origin);

  			return distanceToPoint === 0.0 || p.normal.dot(this.direction) * distanceToPoint < 0.0;
  		}
  	}, {
  		key: "intersectBox",
  		value: function intersectBox(b) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


  			var origin = this.origin;
  			var direction = this.direction;
  			var min = b.min;
  			var max = b.max;

  			var invDirX = 1.0 / direction.x;
  			var invDirY = 1.0 / direction.y;
  			var invDirZ = 1.0 / direction.z;

  			var result = null;
  			var tmin = void 0,
  			    tmax = void 0,
  			    tymin = void 0,
  			    tymax = void 0,
  			    tzmin = void 0,
  			    tzmax = void 0;

  			if (invDirX >= 0.0) {

  				tmin = (min.x - origin.x) * invDirX;
  				tmax = (max.x - origin.x) * invDirX;
  			} else {

  				tmin = (max.x - origin.x) * invDirX;
  				tmax = (min.x - origin.x) * invDirX;
  			}

  			if (invDirY >= 0.0) {

  				tymin = (min.y - origin.y) * invDirY;
  				tymax = (max.y - origin.y) * invDirY;
  			} else {

  				tymin = (max.y - origin.y) * invDirY;
  				tymax = (min.y - origin.y) * invDirY;
  			}

  			if (tmin <= tymax && tymin <= tmax) {
  				if (tymin > tmin || tmin !== tmin) {

  					tmin = tymin;
  				}

  				if (tymax < tmax || tmax !== tmax) {

  					tmax = tymax;
  				}

  				if (invDirZ >= 0.0) {

  					tzmin = (min.z - origin.z) * invDirZ;
  					tzmax = (max.z - origin.z) * invDirZ;
  				} else {

  					tzmin = (max.z - origin.z) * invDirZ;
  					tzmax = (min.z - origin.z) * invDirZ;
  				}

  				if (tmin <= tzmax && tzmin <= tmax) {

  					if (tzmin > tmin || tmin !== tmin) {

  						tmin = tzmin;
  					}

  					if (tzmax < tmax || tmax !== tmax) {

  						tmax = tzmax;
  					}

  					if (tmax >= 0.0) {

  						result = this.at(tmin >= 0.0 ? tmin : tmax, target);
  					}
  				}
  			}

  			return result;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			return this.intersectBox(b, v$5[0]) !== null;
  		}
  	}, {
  		key: "intersectTriangle",
  		value: function intersectTriangle(a, b, c, backfaceCulling, target) {

  			var direction = this.direction;

  			var diff = v$5[0];
  			var edge1 = v$5[1];
  			var edge2 = v$5[2];
  			var normal = v$5[3];

  			var result = null;
  			var DdN = void 0,
  			    sign = void 0,
  			    DdQxE2 = void 0,
  			    DdE1xQ = void 0,
  			    QdN = void 0;

  			edge1.subVectors(b, a);
  			edge2.subVectors(c, a);
  			normal.crossVectors(edge1, edge2);

  			DdN = direction.dot(normal);

  			if (DdN !== 0.0 && !(backfaceCulling && DdN > 0.0)) {

  				if (DdN > 0.0) {

  					sign = 1.0;
  				} else {

  					sign = -1.0;
  					DdN = -DdN;
  				}

  				diff.subVectors(this.origin, a);
  				DdQxE2 = sign * direction.dot(edge2.crossVectors(diff, edge2));

  				if (DdQxE2 >= 0.0) {

  					DdE1xQ = sign * direction.dot(edge1.cross(diff));

  					if (DdE1xQ >= 0.0 && DdQxE2 + DdE1xQ <= DdN) {
  						QdN = -sign * diff.dot(normal);

  						if (QdN >= 0.0) {
  							result = this.at(QdN / DdN, target);
  						}
  					}
  				}
  			}

  			return result;
  		}
  	}, {
  		key: "applyMatrix4",
  		value: function applyMatrix4(m) {

  			this.origin.applyMatrix4(m);
  			this.direction.transformDirection(m);

  			return this;
  		}
  	}, {
  		key: "equals",
  		value: function equals(r) {

  			return r.origin.equals(this.origin) && r.direction.equals(this.direction);
  		}
  	}]);
  	return Ray;
  }();

  var Spherical = function () {
  	function Spherical() {
  		var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  		var phi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var theta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Spherical);


  		this.radius = radius;

  		this.phi = phi;

  		this.theta = theta;
  	}

  	createClass(Spherical, [{
  		key: "set",
  		value: function set$$1(radius, phi, theta) {

  			this.radius = radius;
  			this.phi = phi;
  			this.theta = theta;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(s) {

  			this.radius = s.radius;
  			this.phi = s.phi;
  			this.theta = s.theta;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "setFromVector3",
  		value: function setFromVector3(v) {

  			this.radius = v.length();

  			if (this.radius === 0) {

  				this.theta = 0;
  				this.phi = 0;
  			} else {
  				this.theta = Math.atan2(v.x, v.z);

  				this.phi = Math.acos(Math.min(Math.max(v.y / this.radius, -1), 1));
  			}

  			return this.makeSafe();
  		}
  	}, {
  		key: "makeSafe",
  		value: function makeSafe() {

  			this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi));

  			return this;
  		}
  	}]);
  	return Spherical;
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
  	}, {
  		key: "equals",
  		value: function equals(m) {

  			var te = this.elements;
  			var me = m.elements;

  			var result = true;
  			var i = void 0;

  			for (i = 0; result && i < 6; ++i) {

  				if (te[i] !== me[i]) {

  					result = false;
  				}
  			}

  			return result;
  		}
  	}], [{
  		key: "calculateIndex",
  		value: function calculateIndex(i, j) {

  			return 3 - (3 - i) * (2 - i) / 2 + j;
  		}
  	}]);
  	return SymmetricMatrix3;
  }();

  var Vector4 = function () {
  	function Vector4() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  		classCallCheck(this, Vector4);


  		this.x = x;

  		this.y = y;

  		this.z = z;

  		this.w = w;
  	}

  	createClass(Vector4, [{
  		key: "set",
  		value: function set$$1(x, y, z, w) {

  			this.x = x;
  			this.y = y;
  			this.z = z;
  			this.w = w;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;
  			this.z = v.z;
  			this.w = v.w;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z, this.w);
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];
  			this.w = array[offset + 3];

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
  			array[offset + 3] = this.w;

  			return array;
  		}
  	}, {
  		key: "setAxisAngleFromQuaternion",
  		value: function setAxisAngleFromQuaternion(q) {

  			this.w = 2 * Math.acos(q.w);

  			var s = Math.sqrt(1 - q.w * q.w);

  			if (s < 1e-4) {

  				this.x = 1;
  				this.y = 0;
  				this.z = 0;
  			} else {

  				this.x = q.x / s;
  				this.y = q.y / s;
  				this.z = q.z / s;
  			}

  			return this;
  		}
  	}, {
  		key: "setAxisAngleFromRotationMatrix",
  		value: function setAxisAngleFromRotationMatrix(m) {
  			var E = 0.01;

  			var H = 0.1;

  			var me = m.elements;
  			var m00 = me[0],
  			    m01 = me[4],
  			    m02 = me[8];
  			var m10 = me[1],
  			    m11 = me[5],
  			    m12 = me[9];
  			var m20 = me[2],
  			    m21 = me[6],
  			    m22 = me[10];

  			var angle = void 0;
  			var x = void 0,
  			    y = void 0,
  			    z = void 0;
  			var xx = void 0,
  			    yy = void 0,
  			    zz = void 0;
  			var xy = void 0,
  			    xz = void 0,
  			    yz = void 0;
  			var s = void 0;

  			if (Math.abs(m01 - m10) < E && Math.abs(m02 - m20) < E && Math.abs(m12 - m21) < E) {
  				if (Math.abs(m01 + m10) < H && Math.abs(m02 + m20) < H && Math.abs(m12 + m21) < H && Math.abs(m00 + m11 + m22 - 3) < H) {
  					this.set(1, 0, 0, 0);
  				} else {
  					angle = Math.PI;

  					xx = (m00 + 1) / 2;
  					yy = (m11 + 1) / 2;
  					zz = (m22 + 1) / 2;
  					xy = (m01 + m10) / 4;
  					xz = (m02 + m20) / 4;
  					yz = (m12 + m21) / 4;

  					if (xx > yy && xx > zz) {
  						if (xx < E) {

  							x = 0;
  							y = 0.707106781;
  							z = 0.707106781;
  						} else {

  							x = Math.sqrt(xx);
  							y = xy / x;
  							z = xz / x;
  						}
  					} else if (yy > zz) {
  						if (yy < E) {

  							x = 0.707106781;
  							y = 0;
  							z = 0.707106781;
  						} else {

  							y = Math.sqrt(yy);
  							x = xy / y;
  							z = yz / y;
  						}
  					} else {
  						if (zz < E) {

  							x = 0.707106781;
  							y = 0.707106781;
  							z = 0;
  						} else {

  							z = Math.sqrt(zz);
  							x = xz / z;
  							y = yz / z;
  						}
  					}

  					this.set(x, y, z, angle);
  				}
  			} else {
  				s = Math.sqrt((m21 - m12) * (m21 - m12) + (m02 - m20) * (m02 - m20) + (m10 - m01) * (m10 - m01));

  				if (Math.abs(s) < 0.001) {

  					s = 1;
  				}

  				this.x = (m21 - m12) / s;
  				this.y = (m02 - m20) / s;
  				this.z = (m10 - m01) / s;
  				this.w = Math.acos((m00 + m11 + m22 - 1) / 2);
  			}

  			return this;
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;
  			this.z += v.z;
  			this.w += v.w;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;
  			this.z += s;
  			this.w += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;
  			this.z = a.z + b.z;
  			this.w = a.w + b.w;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;
  			this.z += v.z * s;
  			this.w += v.w * s;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;
  			this.z -= v.z;
  			this.w -= v.w;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;
  			this.z -= s;
  			this.w -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;
  			this.z = a.z - b.z;
  			this.w = a.w - b.w;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;
  			this.z *= v.z;
  			this.w *= v.w;

  			return this;
  		}
  	}, {
  		key: "multiplyScalar",
  		value: function multiplyScalar(s) {

  			this.x *= s;
  			this.y *= s;
  			this.z *= s;
  			this.w *= s;

  			return this;
  		}
  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

  			this.x = a.x * b.x;
  			this.y = a.y * b.y;
  			this.z = a.z * b.z;
  			this.w = a.w * b.w;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;
  			this.z /= v.z;
  			this.w /= v.w;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			this.x /= s;
  			this.y /= s;
  			this.z /= s;
  			this.w /= s;

  			return this;
  		}
  	}, {
  		key: "applyMatrix4",
  		value: function applyMatrix4(m) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z,
  			    w = this.w;
  			var e = m.elements;

  			this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
  			this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
  			this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
  			this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;
  			this.z = -this.z;
  			this.w = -this.w;

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  		}
  	}, {
  		key: "manhattanLength",
  		value: function manhattanLength() {

  			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  		}
  	}, {
  		key: "manhattanDistanceTo",
  		value: function manhattanDistanceTo(v) {

  			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z) + Math.abs(this.w - v.w);
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;
  			var dz = this.z - v.z;
  			var dw = this.w - v.w;

  			return dx * dx + dy * dy + dz * dz + dw * dw;
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "setLength",
  		value: function setLength(length) {

  			return this.normalize().multiplyScalar(length);
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);
  			this.z = Math.min(this.z, v.z);
  			this.w = Math.min(this.w, v.w);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);
  			this.z = Math.max(this.z, v.z);
  			this.w = Math.max(this.w, v.w);

  			return this;
  		}
  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

  			this.x = Math.max(min.x, Math.min(max.x, this.x));
  			this.y = Math.max(min.y, Math.min(max.y, this.y));
  			this.z = Math.max(min.z, Math.min(max.z, this.z));
  			this.w = Math.max(min.w, Math.min(max.w, this.w));

  			return this;
  		}
  	}, {
  		key: "floor",
  		value: function floor() {

  			this.x = Math.floor(this.x);
  			this.y = Math.floor(this.y);
  			this.z = Math.floor(this.z);
  			this.w = Math.floor(this.w);

  			return this;
  		}
  	}, {
  		key: "ceil",
  		value: function ceil() {

  			this.x = Math.ceil(this.x);
  			this.y = Math.ceil(this.y);
  			this.z = Math.ceil(this.z);
  			this.w = Math.ceil(this.w);

  			return this;
  		}
  	}, {
  		key: "round",
  		value: function round() {

  			this.x = Math.round(this.x);
  			this.y = Math.round(this.y);
  			this.z = Math.round(this.z);
  			this.w = Math.round(this.w);

  			return this;
  		}
  	}, {
  		key: "lerp",
  		value: function lerp(v, alpha) {

  			this.x += (v.x - this.x) * alpha;
  			this.y += (v.y - this.y) * alpha;
  			this.z += (v.z - this.z) * alpha;
  			this.w += (v.w - this.w) * alpha;

  			return this;
  		}
  	}, {
  		key: "lerpVectors",
  		value: function lerpVectors(v1, v2, alpha) {

  			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
  		}
  	}]);
  	return Vector4;
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

  				this.boundingBox = null;
  		}

  		createClass(Operation, [{
  				key: "getBoundingBox",
  				value: function getBoundingBox() {

  						if (this.boundingBox === null) {

  								this.boundingBox = this.computeBoundingBox();
  						}

  						return this.boundingBox;
  				}
  		}, {
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						var children = this.children;
  						var boundingBox = new Box3();

  						var i = void 0,
  						    l = void 0;

  						for (i = 0, l = children.length; i < l; ++i) {

  								boundingBox.union(children[i].getBoundingBox());
  						}

  						return boundingBox;
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

  var c$1 = new Vector3();

  var Octant = function () {
  	function Octant() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
  		classCallCheck(this, Octant);


  		this.min = min;

  		this.max = max;

  		this.children = null;
  	}

  	createClass(Octant, [{
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return target.addVectors(this.min, this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return target.subVectors(this.max, this.min);
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

  				children[i] = new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z));
  			}
  		}
  	}]);
  	return Octant;
  }();

  var pattern = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var edges = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  var c$2 = new Vector3();

  var CubicOctant = function () {
  	function CubicOctant() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
  		var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, CubicOctant);


  		this.min = min;

  		this.size = size;

  		this.children = null;
  	}

  	createClass(CubicOctant, [{
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return target.copy(this.min).addScalar(this.size * 0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return target.set(this.size, this.size, this.size);
  		}
  	}, {
  		key: "split",
  		value: function split() {

  			var min = this.min;
  			var mid = this.getCenter(c$2);
  			var halfSize = this.size * 0.5;

  			var children = this.children = [null, null, null, null, null, null, null, null];

  			var i = void 0,
  			    combination = void 0;

  			for (i = 0; i < 8; ++i) {

  				combination = pattern[i];

  				children[i] = new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize);
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

  var b$3 = new Box3();

  var OctantIterator = function () {
  		function OctantIterator(octree) {
  				var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  				classCallCheck(this, OctantIterator);


  				this.octree = octree;

  				this.region = region;

  				this.cull = region !== null;

  				this.result = new IteratorResult();

  				this.trace = null;

  				this.indices = null;

  				this.reset();
  		}

  		createClass(OctantIterator, [{
  				key: "reset",
  				value: function reset() {

  						var root = this.octree.root;

  						this.trace = [];
  						this.indices = [];

  						if (root !== null) {

  								b$3.min = root.min;
  								b$3.max = root.max;

  								if (!this.cull || this.region.intersectsBox(b$3)) {

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

  								index = indices[depth]++;
  								children = trace[depth].children;

  								if (index < 8) {

  										if (children !== null) {

  												child = children[index];

  												if (cull) {

  														b$3.min = child.min;
  														b$3.max = child.max;

  														if (!region.intersectsBox(b$3)) {
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
  		return OctantIterator;
  }();

  var v$6 = [new Vector3(), new Vector3(), new Vector3()];

  var b$4 = new Box3();

  var r = new Ray();

  var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

  var flags = 0;

  function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

  	var entry = 0;

  	if (tx0 > ty0 && tx0 > tz0) {
  		if (tym < tx0) {

  			entry |= 2;
  		}

  		if (tzm < tx0) {

  			entry |= 1;
  		}
  	} else if (ty0 > tz0) {
  		if (txm < ty0) {

  			entry |= 4;
  		}

  		if (tzm < ty0) {

  			entry |= 1;
  		}
  	} else {
  		if (txm < tz0) {

  			entry |= 4;
  		}

  		if (tym < tz0) {

  			entry |= 2;
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
  						raycastOctant(children[flags], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
  						break;

  					case 1:
  						raycastOctant(children[flags ^ 1], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
  						break;

  					case 2:
  						raycastOctant(children[flags ^ 2], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
  						break;

  					case 3:
  						raycastOctant(children[flags ^ 3], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
  						break;

  					case 4:
  						raycastOctant(children[flags ^ 4], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
  						break;

  					case 5:
  						raycastOctant(children[flags ^ 5], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
  						break;

  					case 6:
  						raycastOctant(children[flags ^ 6], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
  						break;

  					case 7:
  						raycastOctant(children[flags ^ 7], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);

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
  			var min = b$4.min.set(0, 0, 0);
  			var max = b$4.max.subVectors(octree.max, octree.min);

  			var dimensions = octree.getDimensions(v$6[0]);
  			var halfDimensions = v$6[1].copy(dimensions).multiplyScalar(0.5);

  			var origin = r.origin.copy(raycaster.ray.origin);
  			var direction = r.direction.copy(raycaster.ray.direction);

  			var invDirX = void 0,
  			    invDirY = void 0,
  			    invDirZ = void 0;
  			var tx0 = void 0,
  			    tx1 = void 0,
  			    ty0 = void 0,
  			    ty1 = void 0,
  			    tz0 = void 0,
  			    tz1 = void 0;

  			origin.sub(octree.getCenter(v$6[2])).add(halfDimensions);

  			flags = 0;

  			if (direction.x < 0.0) {

  				origin.x = dimensions.x - origin.x;
  				direction.x = -direction.x;
  				flags |= 4;
  			}

  			if (direction.y < 0.0) {

  				origin.y = dimensions.y - origin.y;
  				direction.y = -direction.y;
  				flags |= 2;
  			}

  			if (direction.z < 0.0) {

  				origin.z = dimensions.z - origin.z;
  				direction.z = -direction.z;
  				flags |= 1;
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

  var b$5 = new Box3();

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

  	b$5.min = octant.min;
  	b$5.max = octant.max;

  	if (region.intersectsBox(b$5)) {

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

  			return new OctantIterator(this, region);
  		}
  	}, {
  		key: Symbol.iterator,
  		value: function value() {

  			return new OctantIterator(this);
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

  var p = new Vector3();

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

  			return clampedPoint.sub(point).lengthSquared();
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

  			if (children !== null && points !== null) {

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
  		} else if (octant.points !== null) {

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
  			} else if (octant.points !== null) {
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

  							intersectPoint = raycaster.ray.closestPointToPoint(point, new Vector3());
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

  var b$6 = new Box3();

  var c$3 = new Vector3();

  var u = new Vector3();

  var v$7 = new Vector3();

  var OctreeUtils = function () {
  	function OctreeUtils() {
  		classCallCheck(this, OctreeUtils);
  	}

  	createClass(OctreeUtils, null, [{
  		key: "recycleOctants",
  		value: function recycleOctants(octant, octants) {

  			var min = octant.min;
  			var mid = octant.getCenter(u);
  			var halfDimensions = octant.getDimensions(v$7).multiplyScalar(0.5);

  			var children = octant.children;
  			var l = octants.length;

  			var i = void 0,
  			    j = void 0;
  			var combination = void 0,
  			    candidate = void 0;

  			for (i = 0; i < 8; ++i) {

  				combination = pattern[i];

  				b$6.min.addVectors(min, c$3.fromArray(combination).multiply(halfDimensions));
  				b$6.max.addVectors(mid, c$3.fromArray(combination).multiply(halfDimensions));

  				for (j = 0; j < l; ++j) {

  					candidate = octants[j];

  					if (candidate !== null && b$6.min.equals(candidate.min) && b$6.max.equals(candidate.max)) {

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

  var ab = new Vector3();

  var p$1 = new Vector3();

  var v$8 = new Vector3();

  var Edge = function () {
  		function Edge() {
  				var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
  				var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
  				classCallCheck(this, Edge);


  				this.a = a;

  				this.b = b;

  				this.index = -1;

  				this.coordinates = new Vector3();

  				this.t = 0.0;

  				this.n = new Vector3();
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

  								p$1.addVectors(this.a, v$8.copy(ab).multiplyScalar(c));
  								densityC = sdf.sample(p$1);

  								if (Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {
  										break;
  								} else {

  										p$1.addVectors(this.a, v$8.copy(ab).multiplyScalar(a));
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
  						var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  						return target.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);
  				}
  		}, {
  				key: "computeSurfaceNormal",
  				value: function computeSurfaceNormal(sdf) {

  						var position = this.computeZeroCrossingPosition(ab);
  						var E = 1e-3;

  						var dx = sdf.sample(p$1.addVectors(position, v$8.set(E, 0, 0))) - sdf.sample(p$1.subVectors(position, v$8.set(E, 0, 0)));
  						var dy = sdf.sample(p$1.addVectors(position, v$8.set(0, E, 0))) - sdf.sample(p$1.subVectors(position, v$8.set(0, E, 0)));
  						var dz = sdf.sample(p$1.addVectors(position, v$8.set(0, 0, E))) - sdf.sample(p$1.subVectors(position, v$8.set(0, 0, E)));

  						this.n.set(dx, dy, dz).normalize();
  				}
  		}]);
  		return Edge;
  }();

  var edge = new Edge();

  var offsetA = new Vector3();

  var offsetB = new Vector3();

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
  						var n = this.edgeData.resolution;
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
  	function EdgeData(n) {
  		var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : x;
  		var z = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : x;
  		classCallCheck(this, EdgeData);


  		this.resolution = n;

  		this.indices = x <= 0 ? null : [new Uint32Array(x), new Uint32Array(y), new Uint32Array(z)];

  		this.zeroCrossings = x <= 0 ? null : [new Float32Array(x), new Float32Array(y), new Float32Array(z)];

  		this.normals = x <= 0 ? null : [new Float32Array(x * 3), new Float32Array(y * 3), new Float32Array(z * 3)];
  	}

  	createClass(EdgeData, [{
  		key: "serialize",
  		value: function serialize() {


  			return {
  				resolution: this.resolution,
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

  				this.resolution = object.resolution;
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

  var isovalue = 0.0;

  var resolution = 0;

  var indexCount = 0;

  var HermiteData = function () {
  	function HermiteData() {
  		var initialize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  		classCallCheck(this, HermiteData);


  		this.materials = 0;

  		this.materialIndices = initialize ? new Uint8Array(indexCount) : null;

  		this.runLengths = null;

  		this.edgeData = null;
  	}

  	createClass(HermiteData, [{
  		key: "set",
  		value: function set$$1(data) {

  			this.materials = data.materials;
  			this.materialIndices = data.materialIndices;
  			this.runLengths = data.runLengths;
  			this.edgeData = data.edgeData;

  			return this;
  		}
  	}, {
  		key: "clear",
  		value: function clear() {

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

  				target.materialIndices = new Uint8Array(encoding.data);
  				target.runLengths = new Uint32Array(encoding.runLengths);
  			} else {

  				target.materialIndices = this.materialIndices;
  				target.runLengths = this.runLengths;
  			}

  			target.materials = this.materials;

  			return target;
  		}
  	}, {
  		key: "decompress",
  		value: function decompress() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;


  			target.materialIndices = !this.compressed ? this.materialIndices : RunLengthEncoding.decode(this.runLengths, this.materialIndices, new Uint8Array(indexCount));

  			target.runLengths = null;
  			target.materials = this.materials;

  			return target;
  		}
  	}, {
  		key: "serialize",
  		value: function serialize() {


  			return {
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

  				this.materials = object.materials;
  				this.materialIndices = object.materialIndices;
  				this.runLengths = object.runLengths;

  				if (object.edgeData !== null) {

  					if (this.edgeData === null) {
  						this.edgeData = new EdgeData(resolution);
  					}

  					this.edgeData.deserialize(object.edgeData);
  				} else {

  					this.edgeData = null;
  				}
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

  			if (this.materialIndices !== null) {

  				transferList.push(this.materialIndices.buffer);
  			}

  			if (this.runLengths !== null) {

  				transferList.push(this.runLengths.buffer);
  			}

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
  	}, {
  		key: "neutered",
  		get: function get$$1() {

  			return !this.empty && this.materialIndices === null;
  		}
  	}], [{
  		key: "isovalue",
  		get: function get$$1() {

  			return isovalue;
  		},
  		set: function set$$1(value) {

  			isovalue = value;
  		}
  	}, {
  		key: "resolution",
  		get: function get$$1() {

  			return resolution;
  		},
  		set: function set$$1(value) {
  			value = Math.pow(2, Math.max(0, Math.ceil(Math.log2(value))));

  			resolution = Math.max(1, Math.min(256, value));
  			indexCount = Math.pow(resolution + 1, 3);
  		}
  	}]);
  	return HermiteData;
  }();

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

  			return this.sdf.getBoundingBox(true);
  		}
  	}, {
  		key: "generateMaterialIndex",
  		value: function generateMaterialIndex(position) {

  			return this.sdf.sample(position) <= HermiteData.isovalue ? this.sdf.material : Material.AIR;
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

  var m$1 = new Matrix4();

  var SignedDistanceFunction = function () {
  		function SignedDistanceFunction(type) {
  				var material = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Material.SOLID;
  				classCallCheck(this, SignedDistanceFunction);


  				this.type = type;

  				this.operation = null;

  				this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

  				this.boundingBox = null;

  				this.position = new Vector3();

  				this.quaternion = new Quaternion();

  				this.scale = new Vector3(1, 1, 1);

  				this.inverseTransformation = new Matrix4();

  				this.updateInverseTransformation();

  				this.children = [];
  		}

  		createClass(SignedDistanceFunction, [{
  				key: "getTransformation",
  				value: function getTransformation() {
  						var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Matrix4();


  						return target.compose(this.position, this.quaternion, this.scale);
  				}
  		}, {
  				key: "getBoundingBox",
  				value: function getBoundingBox() {
  						var recursive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


  						var children = this.children;

  						var boundingBox = this.boundingBox;
  						var i = void 0,
  						    l = void 0;

  						if (boundingBox === null) {

  								boundingBox = this.computeBoundingBox();
  								this.boundingBox = boundingBox;
  						}

  						if (recursive) {

  								boundingBox = boundingBox.clone();

  								for (i = 0, l = children.length; i < l; ++i) {

  										boundingBox.union(children[i].getBoundingBox(recursive));
  								}
  						}

  						return boundingBox;
  				}
  		}, {
  				key: "setMaterial",
  				value: function setMaterial(material) {

  						this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

  						return this;
  				}
  		}, {
  				key: "setOperationType",
  				value: function setOperationType(operation) {

  						this.operation = operation;

  						return this;
  				}
  		}, {
  				key: "updateInverseTransformation",
  				value: function updateInverseTransformation() {

  						this.inverseTransformation.getInverse(this.getTransformation(m$1));
  						this.boundingBox = null;

  						return this;
  				}
  		}, {
  				key: "union",
  				value: function union(sdf) {

  						this.children.push(sdf.setOperationType(OperationType.UNION));

  						return this;
  				}
  		}, {
  				key: "subtract",
  				value: function subtract(sdf) {

  						this.children.push(sdf.setOperationType(OperationType.DIFFERENCE));

  						return this;
  				}
  		}, {
  				key: "intersect",
  				value: function intersect(sdf) {

  						this.children.push(sdf.setOperationType(OperationType.INTERSECTION));

  						return this;
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
  				key: "serialize",
  				value: function serialize() {
  						var deflate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


  						var result = {
  								type: this.type,
  								operation: this.operation,
  								material: this.material,
  								position: this.position.toArray(),
  								quaternion: this.quaternion.toArray(),
  								scale: this.scale.toArray(),
  								parameters: null,
  								children: []
  						};

  						var i = void 0,
  						    l = void 0;

  						for (i = 0, l = this.children.length; i < l; ++i) {

  								result.children.push(this.children[i].serialize(deflate));
  						}

  						return result;
  				}
  		}, {
  				key: "createTransferList",
  				value: function createTransferList() {
  						var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  						return transferList;
  				}
  		}, {
  				key: "toJSON",
  				value: function toJSON() {

  						return this.serialize(true);
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
  		}]);
  		return SignedDistanceFunction;
  }();

  var SDFType = {

    HEIGHTFIELD: "sdf.heightfield",
    FRACTAL_NOISE: "sdf.fractalnoise",
    SUPER_PRIMITIVE: "sdf.superprimitive"

  };

  var FractalNoise = function (_SignedDistanceFuncti) {
  	inherits(FractalNoise, _SignedDistanceFuncti);

  	function FractalNoise() {
  		var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  		var material = arguments[1];
  		classCallCheck(this, FractalNoise);

  		var _this = possibleConstructorReturn(this, (FractalNoise.__proto__ || Object.getPrototypeOf(FractalNoise)).call(this, SDFType.PERLIN_NOISE, material));

  		_this.min = new (Function.prototype.bind.apply(Vector3, [null].concat(toConsumableArray(parameters.min))))();

  		_this.max = new (Function.prototype.bind.apply(Vector3, [null].concat(toConsumableArray(parameters.max))))();

  		return _this;
  	}

  	createClass(FractalNoise, [{
  		key: "computeBoundingBox",
  		value: function computeBoundingBox() {

  			this.bbox = new Box3(this.min, this.max);

  			return this.bbox;
  		}
  	}, {
  		key: "sample",
  		value: function sample(position) {}
  	}, {
  		key: "serialize",
  		value: function serialize() {


  			var result = get(FractalNoise.prototype.__proto__ || Object.getPrototypeOf(FractalNoise.prototype), "serialize", this).call(this);

  			result.parameters = {
  				min: this.min.toArray(),
  				max: this.max.toArray()
  			};

  			return result;
  		}
  	}]);
  	return FractalNoise;
  }(SignedDistanceFunction);

  function readImageData(image) {

  		var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
  		var context = canvas.getContext("2d");

  		canvas.width = image.width;
  		canvas.height = image.height;
  		context.drawImage(image, 0, 0);

  		return context.getImageData(0, 0, image.width, image.height);
  }

  var Heightfield = function (_SignedDistanceFuncti) {
  		inherits(Heightfield, _SignedDistanceFuncti);

  		function Heightfield() {
  				var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				var material = arguments[1];
  				classCallCheck(this, Heightfield);

  				var _this = possibleConstructorReturn(this, (Heightfield.__proto__ || Object.getPrototypeOf(Heightfield)).call(this, SDFType.HEIGHTFIELD, material));

  				_this.width = parameters.width !== undefined ? parameters.width : 1;

  				_this.height = parameters.height !== undefined ? parameters.height : 1;

  				_this.smooth = parameters.smooth !== undefined ? parameters.smooth : true;

  				_this.data = parameters.data !== undefined ? parameters.data : null;

  				_this.heightmap = null;

  				if (parameters.image !== undefined) {

  						_this.fromImage(parameters.image);
  				}

  				return _this;
  		}

  		createClass(Heightfield, [{
  				key: "fromImage",
  				value: function fromImage(image) {

  						var imageData = typeof document === "undefined" ? null : readImageData(image);

  						var result = null;
  						var data = void 0;

  						var i = void 0,
  						    j = void 0,
  						    l = void 0;

  						if (imageData !== null) {

  								data = imageData.data;

  								result = new Uint8ClampedArray(data.length / 4);

  								for (i = 0, j = 0, l = result.length; i < l; ++i, j += 4) {

  										result[i] = data[j];
  								}

  								this.heightmap = image;
  								this.width = imageData.width;
  								this.height = imageData.height;
  								this.data = result;
  						}

  						return this;
  				}
  		}, {
  				key: "getHeight",
  				value: function getHeight(x, z) {

  						var w = this.width,
  						    h = this.height;
  						var data = this.data;

  						var height = void 0;

  						x = Math.round(x * w);
  						z = Math.round(z * h);

  						if (this.smooth) {

  								x = Math.max(Math.min(x, w - 1), 1);
  								z = Math.max(Math.min(z, h - 1), 1);

  								var p = x + 1,
  								    q = x - 1;
  								var a = z * w,
  								    b = a + w,
  								    c = a - w;

  								height = (data[c + q] + data[c + x] + data[c + p] + data[a + q] + data[a + x] + data[a + p] + data[b + q] + data[b + x] + data[b + p]) / 9;
  						} else {

  								height = data[z * w + x];
  						}

  						return height;
  				}
  		}, {
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						var boundingBox = new Box3();

  						var w = Math.min(this.width / this.height, 1.0);
  						var h = Math.min(this.height / this.width, 1.0);

  						boundingBox.min.set(0, 0, 0);
  						boundingBox.max.set(w, 1, h);
  						boundingBox.applyMatrix4(this.getTransformation());

  						return boundingBox;
  				}
  		}, {
  				key: "sample",
  				value: function sample(position) {

  						var boundingBox = this.boundingBox;

  						var d = void 0;

  						if (boundingBox.containsPoint(position)) {

  								position.applyMatrix4(this.inverseTransformation);

  								d = position.y - this.getHeight(position.x, position.z) / 255;
  						} else {

  								d = boundingBox.distanceToPoint(position);
  						}

  						return d;
  				}
  		}, {
  				key: "serialize",
  				value: function serialize() {
  						var deflate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


  						var result = get(Heightfield.prototype.__proto__ || Object.getPrototypeOf(Heightfield.prototype), "serialize", this).call(this);

  						result.parameters = {
  								width: this.width,
  								height: this.height,
  								smooth: this.smooth,
  								data: deflate ? null : this.data,
  								dataURL: deflate && this.heightmap !== null ? this.heightmap.toDataURL() : null,
  								image: null
  						};

  						return result;
  				}
  		}, {
  				key: "createTransferList",
  				value: function createTransferList() {
  						var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  						transferList.push(this.data.buffer);

  						return transferList;
  				}
  		}]);
  		return Heightfield;
  }(SignedDistanceFunction);

  var SuperPrimitive = function (_SignedDistanceFuncti) {
  	inherits(SuperPrimitive, _SignedDistanceFuncti);

  	function SuperPrimitive() {
  		var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  		var material = arguments[1];
  		classCallCheck(this, SuperPrimitive);

  		var _this = possibleConstructorReturn(this, (SuperPrimitive.__proto__ || Object.getPrototypeOf(SuperPrimitive)).call(this, SDFType.SUPER_PRIMITIVE, material));

  		_this.s0 = new (Function.prototype.bind.apply(Vector4, [null].concat(toConsumableArray(parameters.s))))();

  		_this.r0 = new (Function.prototype.bind.apply(Vector3, [null].concat(toConsumableArray(parameters.r))))();

  		_this.s = new Vector4();

  		_this.r = new Vector3();

  		_this.ba = new Vector2();

  		_this.offset = 0;

  		_this.precompute();

  		return _this;
  	}

  	createClass(SuperPrimitive, [{
  		key: "setSize",
  		value: function setSize(x, y, z, w) {

  			this.s0.set(x, y, z, w);

  			return this.precompute();
  		}
  	}, {
  		key: "setRadii",
  		value: function setRadii(x, y, z) {

  			this.r0.set(x, y, z);

  			return this.precompute();
  		}
  	}, {
  		key: "precompute",
  		value: function precompute() {

  			var s = this.s.copy(this.s0);
  			var r = this.r.copy(this.r0);
  			var ba = this.ba;

  			s.x -= r.x;
  			s.y -= r.x;

  			r.x -= s.w;
  			s.w -= r.y;

  			s.z -= r.y;

  			this.offset = -2.0 * s.z;

  			ba.set(r.z, this.offset);
  			var divisor = ba.dot(ba);

  			if (divisor === 0.0) {
  				ba.set(0.0, -1.0);
  			} else {

  				ba.divideScalar(divisor);
  			}

  			return this;
  		}
  	}, {
  		key: "computeBoundingBox",
  		value: function computeBoundingBox() {

  			var s = this.s0;
  			var boundingBox = new Box3();

  			boundingBox.min.x = Math.min(-s.x, -1.0);
  			boundingBox.min.y = Math.min(-s.y, -1.0);
  			boundingBox.min.z = Math.min(-s.z, -1.0);

  			boundingBox.max.x = Math.max(s.x, 1.0);
  			boundingBox.max.y = Math.max(s.y, 1.0);
  			boundingBox.max.z = Math.max(s.z, 1.0);

  			boundingBox.applyMatrix4(this.getTransformation());

  			return boundingBox;
  		}
  	}, {
  		key: "sample",
  		value: function sample(position) {

  			position.applyMatrix4(this.inverseTransformation);

  			var s = this.s;
  			var r = this.r;
  			var ba = this.ba;

  			var dx = Math.abs(position.x) - s.x;
  			var dy = Math.abs(position.y) - s.y;
  			var dz = Math.abs(position.z) - s.z;

  			var mx0 = Math.max(dx, 0.0);
  			var my0 = Math.max(dy, 0.0);
  			var l0 = Math.sqrt(mx0 * mx0 + my0 * my0);

  			var p = position.z - s.z;
  			var q = Math.abs(l0 + Math.min(0.0, Math.max(dx, dy)) - r.x) - s.w;

  			var c = Math.min(Math.max(q * ba.x + p * ba.y, 0.0), 1.0);
  			var diagX = q - r.z * c;
  			var diagY = p - this.offset * c;

  			var hx0 = Math.max(q - r.z, 0.0);
  			var hy0 = position.z + s.z;
  			var hx1 = Math.max(q, 0.0);


  			var diagSq = diagX * diagX + diagY * diagY;
  			var h0Sq = hx0 * hx0 + hy0 * hy0;
  			var h1Sq = hx1 * hx1 + p * p;
  			var paBa = q * -ba.y + p * ba.x;

  			var l1 = Math.sqrt(Math.min(diagSq, Math.min(h0Sq, h1Sq)));

  			return l1 * Math.sign(Math.max(paBa, dz)) - r.y;
  		}
  	}, {
  		key: "serialize",
  		value: function serialize() {


  			var result = get(SuperPrimitive.prototype.__proto__ || Object.getPrototypeOf(SuperPrimitive.prototype), "serialize", this).call(this);

  			result.parameters = {
  				s: this.s0.toArray(),
  				r: this.r0.toArray()
  			};

  			return result;
  		}
  	}], [{
  		key: "create",
  		value: function create(preset) {

  			var parameters = superPrimitivePresets[preset];

  			return new SuperPrimitive({
  				s: parameters[0],
  				r: parameters[1]
  			});
  		}
  	}]);
  	return SuperPrimitive;
  }(SignedDistanceFunction);

  var superPrimitivePresets = [[new Float32Array([1.0, 1.0, 1.0, 1.0]), new Float32Array([0.0, 0.0, 0.0])], [new Float32Array([1.0, 1.0, 1.0, 1.0]), new Float32Array([1.0, 0.0, 0.0])], [new Float32Array([0.0, 0.0, 1.0, 1.0]), new Float32Array([0.0, 0.0, 1.0])], [new Float32Array([1.0, 1.0, 2.0, 1.0]), new Float32Array([1.0, 1.0, 0.0])], [new Float32Array([1.0, 1.0, 1.0, 1.0]), new Float32Array([1.0, 1.0, 0.0])], [new Float32Array([1.0, 1.0, 0.25, 1.0]), new Float32Array([1.0, 0.25, 0.0])], [new Float32Array([1.0, 1.0, 0.25, 0.25]), new Float32Array([1.0, 0.25, 0.0])], [new Float32Array([1.0, 1.0, 1.0, 0.25]), new Float32Array([1.0, 0.1, 0.0])], [new Float32Array([1.0, 1.0, 1.0, 0.25]), new Float32Array([0.1, 0.1, 0.0])]];

  var SuperPrimitivePreset = {

  	CUBE: 0,
  	CYLINDER: 1,
  	CONE: 2,
  	PILL: 3,
  	SPHERE: 4,
  	PELLET: 5,
  	TORUS: 6,
  	PIPE: 7,
  	CORRIDOR: 8

  };

  var SDFReviver = function () {
  		function SDFReviver() {
  				classCallCheck(this, SDFReviver);
  		}

  		createClass(SDFReviver, [{
  				key: "revive",
  				value: function revive(description) {

  						var sdf = void 0,
  						    i = void 0,
  						    l = void 0;

  						switch (description.type) {

  								case SDFType.FRACTAL_NOISE:
  										sdf = new FractalNoise(description.parameters, description.material);
  										break;

  								case SDFType.HEIGHTFIELD:
  										sdf = new Heightfield(description.parameters, description.material);
  										break;

  								case SDFType.SUPER_PRIMITIVE:
  										sdf = new SuperPrimitive(description.parameters, description.material);
  										break;

  						}

  						sdf.operation = description.operation;
  						sdf.position.fromArray(description.position);
  						sdf.quaternion.fromArray(description.quaternion);
  						sdf.scale.fromArray(description.scale);
  						sdf.updateInverseTransformation();

  						for (i = 0, l = description.children.length; i < l; ++i) {

  								sdf.children.push(this.revive(description.children[i]));
  						}

  						return sdf;
  				}
  		}]);
  		return SDFReviver;
  }();

  var SDFLoaderEvent = function (_Event) {
  	inherits(SDFLoaderEvent, _Event);

  	function SDFLoaderEvent(type) {
  		classCallCheck(this, SDFLoaderEvent);

  		var _this = possibleConstructorReturn(this, (SDFLoaderEvent.__proto__ || Object.getPrototypeOf(SDFLoaderEvent)).call(this, type));

  		_this.descriptions = null;

  		return _this;
  	}

  	return SDFLoaderEvent;
  }(Event);

  var load = new SDFLoaderEvent("load");

  var SDFLoader = function (_EventTarget) {
  		inherits(SDFLoader, _EventTarget);

  		function SDFLoader() {
  				classCallCheck(this, SDFLoader);

  				var _this = possibleConstructorReturn(this, (SDFLoader.__proto__ || Object.getPrototypeOf(SDFLoader)).call(this));

  				_this.items = 0;

  				_this.descriptions = null;

  				_this.imageMap = new WeakMap();

  				return _this;
  		}

  		createClass(SDFLoader, [{
  				key: "clear",
  				value: function clear() {

  						this.imageMap = new WeakMap();
  				}
  		}, {
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "load":
  										this.progress(event);
  										break;

  						}
  				}
  		}, {
  				key: "progress",
  				value: function progress() {
  						var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


  						var item = event !== null ? event.target : null;
  						var imageMap = this.imageMap;

  						var description = void 0;

  						if (item !== null) {

  								if (imageMap.has(item)) {

  										description = imageMap.get(item);
  										description.image = item;
  								}

  								--this.items;
  						}

  						if (this.items === 0) {

  								this.clear();
  								load.descriptions = this.descriptions;
  								this.dispatchEvent(load);
  						}
  				}
  		}, {
  				key: "loadImage",
  				value: function loadImage(description) {

  						var image = new Image();

  						this.imageMap.set(image, description);
  						++this.items;

  						image.addEventListener("load", this);
  						image.src = description.dataURL;
  				}
  		}, {
  				key: "inflate",
  				value: function inflate(description) {

  						var child = void 0;

  						if (description.dataURL !== null) {
  								this.loadImage(description);
  						}

  						var _iteratorNormalCompletion = true;
  						var _didIteratorError = false;
  						var _iteratorError = undefined;

  						try {
  								for (var _iterator = description.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  										child = _step.value;


  										this.inflate(child);
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

  						this.progress();
  				}
  		}, {
  				key: "load",
  				value: function load$$1(descriptions) {

  						var description = void 0;

  						this.items = 0;
  						this.descriptions = descriptions;

  						var _iteratorNormalCompletion2 = true;
  						var _didIteratorError2 = false;
  						var _iteratorError2 = undefined;

  						try {
  								for (var _iterator2 = descriptions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
  										description = _step2.value;


  										this.inflate(description);
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
  		}]);
  		return SDFLoader;
  }(EventTarget);

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

  var KeyIterator = function () {
  		function KeyIterator(keyDesign, min, max) {
  				classCallCheck(this, KeyIterator);


  				this.keyDesign = keyDesign;

  				this.min = min;

  				this.max = max;

  				this.keyBase = new Vector3();

  				this.key = new Vector3();

  				this.limit = new Vector3();

  				this.result = new IteratorResult();

  				this.reset();
  		}

  		createClass(KeyIterator, [{
  				key: "reset",
  				value: function reset() {

  						var keyDesign = this.keyDesign;
  						var min = this.min;
  						var max = this.max;

  						if (min.x <= max.x && min.y <= max.y && min.z <= max.z) {

  								this.keyBase.set(min.x, min.y * keyDesign.rangeX, min.z * keyDesign.rangeXY);
  								this.limit.set(max.x, max.y * keyDesign.rangeX, max.z * keyDesign.rangeXY);
  								this.key.copy(this.keyBase);
  						} else {
  								this.keyBase.set(1, 1, 1);
  								this.limit.set(0, 0, 0);
  								this.key.copy(this.keyBase);

  								console.error("Invalid key range", min, max);
  						}

  						this.result.reset();

  						return this;
  				}
  		}, {
  				key: "next",
  				value: function next() {

  						var result = this.result;
  						var keyDesign = this.keyDesign;
  						var keyBase = this.keyBase;
  						var limit = this.limit;
  						var key = this.key;

  						if (key.z <= limit.z) {
  								result.value = key.z + key.y + key.x;

  								++key.x;

  								if (key.x > limit.x) {

  										key.x = keyBase.x;
  										key.y += keyDesign.rangeX;

  										if (key.y > limit.y) {

  												key.y = keyBase.y;
  												key.z += keyDesign.rangeXY;
  										}
  								}
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
  		return KeyIterator;
  }();

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


  				this.x = 0;

  				this.y = 0;

  				this.z = 0;

  				this.rangeX = 0;

  				this.rangeY = 0;

  				this.rangeZ = 0;

  				this.rangeXY = 0;

  				this.halfRange = null;

  				this.maskX = [0, 0];

  				this.maskY = [0, 0];

  				this.maskZ = [0, 0];

  				this.set(x, y, z);
  		}

  		createClass(KeyDesign, [{
  				key: "set",
  				value: function set$$1(x, y, z) {
  						if (x + y + z > BITS || x > DWORD_BITS || y > DWORD_BITS || z > DWORD_BITS) {

  								console.warn("Invalid bit allotment");

  								x = Math.round(BITS * 0.4);
  								y = Math.round(BITS * 0.2);
  								z = x;
  						}

  						this.x = x;
  						this.y = y;
  						this.z = z;

  						this.rangeX = Math.pow(2, x);
  						this.rangeY = Math.pow(2, y);
  						this.rangeZ = Math.pow(2, z);

  						this.rangeXY = Math.pow(2, x + y);

  						this.halfRange = new Vector3(this.rangeX / 2, this.rangeY / 2, this.rangeZ / 2);

  						this.updateBitMasks();
  				}
  		}, {
  				key: "updateBitMasks",
  				value: function updateBitMasks() {

  						var xBits = this.x;
  						var yBits = this.y;
  						var zBits = this.z;

  						var maskX = this.maskX;
  						var maskY = this.maskY;
  						var maskZ = this.maskZ;

  						var hiShiftX = DWORD_BITS - Math.max(0, xBits - LO_BITS);
  						var hiShiftY = DWORD_BITS - Math.max(0, yBits + xBits - LO_BITS);
  						var hiShiftZ = DWORD_BITS - Math.max(0, zBits + yBits + xBits - LO_BITS);

  						maskX[1] = hiShiftX < DWORD_BITS ? ~0 >>> hiShiftX : 0;
  						maskX[0] = ~0 >>> Math.max(0, LO_BITS - xBits);

  						maskY[1] = ((hiShiftY < DWORD_BITS ? ~0 >>> hiShiftY : 0) & ~maskX[1]) >>> 0;
  						maskY[0] = (~0 >>> Math.max(0, LO_BITS - (xBits + yBits)) & ~maskX[0]) >>> 0;

  						maskZ[1] = ((hiShiftZ < DWORD_BITS ? ~0 >>> hiShiftZ : 0) & ~maskY[1] & ~maskX[1]) >>> 0;
  						maskZ[0] = (~0 >>> Math.max(0, LO_BITS - (xBits + yBits + zBits)) & ~maskY[0] & ~maskX[0]) >>> 0;
  				}
  		}, {
  				key: "unpackKey",
  				value: function unpackKey(key) {
  						var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


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
  				key: "keyRange",
  				value: function keyRange(min, max) {

  						return new KeyIterator(this, min, max);
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

  var WorldOctantId = function () {
  	function WorldOctantId() {
  		var lod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, WorldOctantId);


  		this.lod = lod;

  		this.key = key;
  	}

  	createClass(WorldOctantId, [{
  		key: "set",
  		value: function set$$1(lod, key) {

  			this.lod = lod;
  			this.key = key;
  		}
  	}, {
  		key: "copy",
  		value: function copy(id) {

  			this.lod = id.lod;
  			this.key = id.key;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}]);
  	return WorldOctantId;
  }();

  var WorldOctantWrapper = function () {
  	function WorldOctantWrapper() {
  		var octant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new WorldOctantId();
  		classCallCheck(this, WorldOctantWrapper);


  		this.octant = octant;

  		this.id = id;

  		this.min = new Vector3();

  		this.max = new Vector3();
  	}

  	createClass(WorldOctantWrapper, [{
  		key: "copy",
  		value: function copy(octantWrapper) {

  			this.octant = octantWrapper.octant;
  			this.id.copy(octantWrapper.id);
  			this.min.copy(octantWrapper.min);
  			this.max.copy(octantWrapper.max);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return target.addVectors(this.min, this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();


  			return target.subVectors(this.max, this.min);
  		}
  	}, {
  		key: "containsPoint",
  		value: function containsPoint(point) {

  			var min = this.min;
  			var max = this.max;

  			return point.x >= min.x && point.y >= min.y && point.z >= min.z && point.x <= max.x && point.y <= max.y && point.z <= max.z;
  		}
  	}]);
  	return WorldOctantWrapper;
  }();

  var WorldOctantIterator = function () {
  		function WorldOctantIterator(world) {
  				var lod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  				classCallCheck(this, WorldOctantIterator);


  				this.world = world;

  				this.cellSize = 0;

  				this.iterator = null;

  				this.octantWrapper = new WorldOctantWrapper();
  				this.octantWrapper.id.lod = lod;

  				this.result = new IteratorResult();

  				this.reset();
  		}

  		createClass(WorldOctantIterator, [{
  				key: "reset",
  				value: function reset() {

  						var lod = this.octantWrapper.id.lod;
  						var world = this.world;
  						var grid = world.getGrid(lod);

  						if (grid !== undefined) {

  								this.cellSize = world.getCellSize(lod);
  								this.iterator = grid.entries();
  								this.result.reset();
  						} else {

  								console.error("Invalid LOD", lod);
  						}

  						return this;
  				}
  		}, {
  				key: "next",
  				value: function next() {

  						var result = this.result;
  						var octantWrapper = this.octantWrapper;
  						var internalResult = this.iterator.next();
  						var value = internalResult.value;

  						if (!internalResult.done) {

  								this.keyDesign.unpackKey(value[0], octantWrapper.min);
  								octantWrapper.min.multiplyScalar(this.cellSize).add(this.world.min);
  								octantWrapper.max.copy(octantWrapper.min).addScalar(this.cellSize);
  								octantWrapper.id.key = value[0];
  								octantWrapper.octant = value[1];

  								result.value = octantWrapper;
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
  		return WorldOctantIterator;
  }();

  var WorldOctant = function WorldOctant() {
  		classCallCheck(this, WorldOctant);


  		this.data = null;

  		this.csg = new Queue();

  		this.isosurface = null;
  };

  var IntermediateWorldOctant = function (_WorldOctant) {
  	inherits(IntermediateWorldOctant, _WorldOctant);

  	function IntermediateWorldOctant() {
  		classCallCheck(this, IntermediateWorldOctant);

  		var _this = possibleConstructorReturn(this, (IntermediateWorldOctant.__proto__ || Object.getPrototypeOf(IntermediateWorldOctant)).call(this));

  		_this.children = 0;

  		return _this;
  	}

  	return IntermediateWorldOctant;
  }(WorldOctant);

  var p$2 = new Vector3();

  var v$9 = new Vector3();

  var b0 = new Box3();

  var b1 = new Box3();

  var b2 = new Box3();

  var ranges = [];

  function _applyDifference(world, sdf, octant, keyX, keyY, keyZ, lod) {

  	var grid = void 0,
  	    keyDesign = void 0,
  	    children = void 0;
  	var range = void 0,
  	    offset = void 0,
  	    i = void 0;

  	octant.csg.add(sdf);

  	if (lod > 0) {
  		--lod;

  		grid = world.getGrid(lod);
  		keyDesign = world.getKeyDesign();
  		children = octant.children;
  		range = ranges[lod];

  		keyX <<= 1;keyY <<= 1;keyZ <<= 1;

  		for (i = 0; i < 8; ++i) {
  			if ((children & 1 << i) !== 0) {

  				offset = pattern[i];

  				p$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);

  				if (range.containsPoint(p$2)) {
  					_applyDifference(world, sdf, grid.get(keyDesign.packKey(p$2)), p$2.x, p$2.y, p$2.z, lod);
  				}
  			}
  		}
  	}
  }

  var WorldOctreeCSG = function () {
  	function WorldOctreeCSG() {
  		classCallCheck(this, WorldOctreeCSG);
  	}

  	createClass(WorldOctreeCSG, null, [{
  		key: "applyUnion",
  		value: function applyUnion(world, region, sdf) {

  			var keyDesign = world.getKeyDesign();
  			var lodZero = world.lodZero;

  			var a = b1.min;
  			var b = b1.max;
  			var c = b2.min;
  			var d = b2.max;
  			var range = b2;

  			var key = void 0,
  			    offset = void 0;
  			var grid = void 0,
  			    octant = void 0;
  			var lod = void 0,
  			    i = void 0;

  			for (lod = world.getDepth(); lod > 0; --lod) {

  				grid = world.getGrid(lod);

  				world.calculateKeyCoordinates(region.min, lod, a);
  				world.calculateKeyCoordinates(region.max, lod, b);
  				world.calculateKeyCoordinates(region.min, lod - 1, c);
  				world.calculateKeyCoordinates(region.max, lod - 1, d);

  				var _iteratorNormalCompletion = true;
  				var _didIteratorError = false;
  				var _iteratorError = undefined;

  				try {
  					for (var _iterator = keyDesign.keyRange(a, b)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  						key = _step.value;


  						if (!grid.has(key)) {

  							octant = new IntermediateWorldOctant();
  							octant.csg.add(sdf);
  							grid.set(key, octant);

  							keyDesign.unpackKey(key, v$9);
  							v$9.x <<= 1;v$9.y <<= 1;v$9.z <<= 1;

  							for (i = 0; i < 8; ++i) {

  								offset = pattern[i];

  								p$2.set(v$9.x + offset[0], v$9.y + offset[1], v$9.z + offset[2]);

  								if (range.containsPoint(p$2)) {
  									octant.children |= 1 << i;
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

  			world.calculateKeyCoordinates(region.min, 0, a);
  			world.calculateKeyCoordinates(region.max, 0, b);

  			var _iteratorNormalCompletion2 = true;
  			var _didIteratorError2 = false;
  			var _iteratorError2 = undefined;

  			try {
  				for (var _iterator2 = keyDesign.keyRange(a, b)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
  					key = _step2.value;


  					if (!lodZero.has(key)) {

  						octant = new WorldOctant();
  						lodZero.set(key, octant);
  					} else {

  						octant = lodZero.get(key);
  					}

  					octant.csg.add(sdf);
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
  	}, {
  		key: "applyDifference",
  		value: function applyDifference(world, region, sdf) {

  			var lod = world.getDepth();
  			var keyDesign = world.getKeyDesign();
  			var grid = world.getGrid(lod);

  			var a = world.calculateKeyCoordinates(region.min, lod, b1.min);
  			var b = world.calculateKeyCoordinates(region.max, lod, b1.max);

  			var i = void 0,
  			    l = void 0;
  			var range = void 0;
  			var key = void 0;

  			for (i = 0, l = lod - 1; i < l; ++i) {

  				if (i < ranges.length) {
  					range = ranges[i];

  					world.calculateKeyCoordinates(region.min, i, range.min);
  					world.calculateKeyCoordinates(region.max, i, range.max);
  				} else {
  					ranges.push(new Box3(world.calculateKeyCoordinates(region.min, i), world.calculateKeyCoordinates(region.max, i)));
  				}
  			}

  			var _iteratorNormalCompletion3 = true;
  			var _didIteratorError3 = false;
  			var _iteratorError3 = undefined;

  			try {
  				for (var _iterator3 = keyDesign.keyRange(a, b)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
  					key = _step3.value;


  					if (grid.has(key)) {

  						keyDesign.unpackKey(key, v$9);

  						_applyDifference(world, sdf, grid.get(key), v$9.x, v$9.y, v$9.z, lod);
  					}
  				}
  			} catch (err) {
  				_didIteratorError3 = true;
  				_iteratorError3 = err;
  			} finally {
  				try {
  					if (!_iteratorNormalCompletion3 && _iterator3.return) {
  						_iterator3.return();
  					}
  				} finally {
  					if (_didIteratorError3) {
  						throw _iteratorError3;
  					}
  				}
  			}
  		}
  	}, {
  		key: "applyIntersection",
  		value: function applyIntersection(world, sdf) {

  			var lod = void 0,
  			    octant = void 0;

  			for (lod = world.getDepth(); lod >= 0; --lod) {
  				var _iteratorNormalCompletion4 = true;
  				var _didIteratorError4 = false;
  				var _iteratorError4 = undefined;

  				try {

  					for (var _iterator4 = world.getGrid(lod).values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
  						octant = _step4.value;


  						octant.csg.add(sdf);
  					}
  				} catch (err) {
  					_didIteratorError4 = true;
  					_iteratorError4 = err;
  				} finally {
  					try {
  						if (!_iteratorNormalCompletion4 && _iterator4.return) {
  							_iterator4.return();
  						}
  					} finally {
  						if (_didIteratorError4) {
  							throw _iteratorError4;
  						}
  					}
  				}
  			}
  		}
  	}, {
  		key: "applyCSG",
  		value: function applyCSG(world, sdf) {
  			var region = b0.copy(sdf.getBoundingBox(true));

  			region.min.max(world.min);
  			region.max.min(world.max);

  			switch (sdf.operation) {

  				case OperationType.UNION:
  					this.applyUnion(world, region, sdf);
  					break;

  				case OperationType.DIFFERENCE:
  					this.applyDifference(world, region, sdf);
  					break;

  				case OperationType.INTERSECTION:
  					this.applyIntersection(world, sdf);
  					break;

  				default:
  					console.error("No CSG operation type specified", sdf);
  					break;

  			}
  		}
  	}]);
  	return WorldOctreeCSG;
  }();

  var v$a = new Vector3();

  var l = new Line3();

  var b$7 = new Box3();

  var d = new Box3();

  var r$1 = new Ray();

  var octantTable$1 = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

  var flags$1 = 0;

  function findEntryOctant$1(tx0, ty0, tz0, txm, tym, tzm) {

  	var entry = 0;

  	if (tx0 > ty0 && tx0 > tz0) {
  		if (tym < tx0) {

  			entry |= 2;
  		}

  		if (tzm < tx0) {

  			entry |= 1;
  		}
  	} else if (ty0 > tz0) {
  		if (txm < ty0) {

  			entry |= 4;
  		}

  		if (tzm < ty0) {

  			entry |= 1;
  		}
  	} else {
  		if (txm < tz0) {

  			entry |= 4;
  		}

  		if (tym < tz0) {

  			entry |= 2;
  		}
  	}

  	return entry;
  }

  function findNextOctant$1(currentOctant, tx1, ty1, tz1) {

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

  	return octantTable$1[currentOctant][exit];
  }

  function raycastOctant$1(world, octant, keyX, keyY, keyZ, lod, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {

  	var keyDesign = void 0,
  	    cellSize = void 0;
  	var octantWrapper = void 0,
  	    grid = void 0;
  	var children = void 0,
  	    offset = void 0;

  	var currentOctant = void 0;
  	var txm = void 0,
  	    tym = void 0,
  	    tzm = void 0;

  	var i = void 0;

  	if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

  		keyDesign = world.getKeyDesign();

  		if (lod === 0 || octant.isosurface !== null) {

  			cellSize = world.getCellSize(lod);
  			octantWrapper = new WorldOctantWrapper(octant);
  			octantWrapper.id.set(lod, keyDesign.packKey(v$a.set(keyX, keyY, keyZ)));
  			octantWrapper.min.copy(v$a).multiplyScalar(cellSize).add(world.min);
  			octantWrapper.max.copy(octantWrapper.min).addScalar(cellSize);

  			intersects.push(octantWrapper);
  		} else if (octant.children > 0) {
  			grid = world.getGrid(--lod);
  			children = octant.children;

  			keyX <<= 1;keyY <<= 1;keyZ <<= 1;

  			txm = 0.5 * (tx0 + tx1);
  			tym = 0.5 * (ty0 + ty1);
  			tzm = 0.5 * (tz0 + tz1);

  			currentOctant = findEntryOctant$1(tx0, ty0, tz0, txm, tym, tzm);

  			do {

  				i = flags$1 ^ currentOctant;

  				switch (currentOctant) {

  					case 0:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, tx0, ty0, tz0, txm, tym, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, tym, tzm);
  							break;
  						}

  					case 1:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, tx0, ty0, tzm, txm, tym, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, tym, tz1);
  							break;
  						}

  					case 2:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, tx0, tym, tz0, txm, ty1, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, ty1, tzm);
  							break;
  						}

  					case 3:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, tx0, tym, tzm, txm, ty1, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, ty1, tz1);
  							break;
  						}

  					case 4:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, txm, ty0, tz0, tx1, tym, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, tym, tzm);
  							break;
  						}

  					case 5:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, txm, ty0, tzm, tx1, tym, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, tym, tz1);
  							break;
  						}

  					case 6:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, txm, tym, tz0, tx1, ty1, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, ty1, tzm);
  							break;
  						}

  					case 7:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, txm, tym, tzm, tx1, ty1, tz1, intersects);
  							}

  							currentOctant = 8;
  							break;
  						}

  				}
  			} while (currentOctant < 8);
  		}
  	}
  }

  function intersectSubtree(world, subtree, keyCoordinates, ray, intersects) {
  	var min = b$7.min.set(0, 0, 0);
  	var max = b$7.max.subVectors(subtree.max, subtree.min);

  	var dimensions = subtree.getDimensions(d.min);
  	var halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);

  	var origin = r$1.origin.copy(ray.origin);
  	var direction = r$1.direction.copy(ray.direction);

  	var invDirX = void 0,
  	    invDirY = void 0,
  	    invDirZ = void 0;
  	var tx0 = void 0,
  	    tx1 = void 0,
  	    ty0 = void 0,
  	    ty1 = void 0,
  	    tz0 = void 0,
  	    tz1 = void 0;

  	origin.sub(subtree.getCenter(v$a)).add(halfDimensions);

  	flags$1 = 0;

  	if (direction.x < 0.0) {

  		origin.x = dimensions.x - origin.x;
  		direction.x = -direction.x;
  		flags$1 |= 4;
  	}

  	if (direction.y < 0.0) {

  		origin.y = dimensions.y - origin.y;
  		direction.y = -direction.y;
  		flags$1 |= 2;
  	}

  	if (direction.z < 0.0) {

  		origin.z = dimensions.z - origin.z;
  		direction.z = -direction.z;
  		flags$1 |= 1;
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

  	raycastOctant$1(world, subtree.octant, keyCoordinates.x, keyCoordinates.y, keyCoordinates.z, world.getDepth(), tx0, ty0, tz0, tx1, ty1, tz1, intersects);
  }

  var WorldOctreeRaycaster = function () {
  	function WorldOctreeRaycaster() {
  		classCallCheck(this, WorldOctreeRaycaster);
  	}

  	createClass(WorldOctreeRaycaster, null, [{
  		key: "intersectWorldOctree",
  		value: function intersectWorldOctree(world, ray) {
  			var intersects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];


  			var lod = world.getDepth();
  			var grid = world.getGrid(lod);
  			var cellSize = world.getCellSize(lod);
  			var keyDesign = world.getKeyDesign();
  			var octantWrapper = new WorldOctantWrapper();

  			var keyCoordinates0 = l.start;
  			var keyCoordinates1 = l.end;

  			var a = !world.containsPoint(r$1.copy(ray).origin) ? r$1.intersectBox(world, r$1.origin) : r$1.origin;

  			var key = void 0,
  			    octant = void 0;
  			var t = void 0,
  			    b = void 0,
  			    n = void 0;

  			var dx = void 0,
  			    dy = void 0,
  			    dz = void 0;
  			var ax = void 0,
  			    ay = void 0,
  			    az = void 0,
  			    bx = void 0,
  			    by = void 0,
  			    bz = void 0;
  			var sx = void 0,
  			    sy = void 0,
  			    sz = void 0,
  			    exy = void 0,
  			    exz = void 0,
  			    ezy = void 0;

  			octantWrapper.id.lod = lod;

  			if (a !== null) {
  				t = cellSize << 1;
  				b = r$1.at(t, v$a);

  				world.calculateKeyCoordinates(a, lod, keyCoordinates0);
  				world.calculateKeyCoordinates(b, lod, keyCoordinates1);

  				dx = keyCoordinates1.x - keyCoordinates0.x;
  				dy = keyCoordinates1.y - keyCoordinates0.y;
  				dz = keyCoordinates1.z - keyCoordinates0.z;

  				sx = Math.sign(dx);sy = Math.sign(dy);sz = Math.sign(dz);
  				ax = Math.abs(dx);ay = Math.abs(dy);az = Math.abs(dz);
  				bx = 2 * ax;by = 2 * ay;bz = 2 * az;
  				exy = ay - ax;exz = az - ax;ezy = ay - az;

  				for (n = ax + ay + az; n > 0; --n) {

  					key = keyDesign.packKey(keyCoordinates0);

  					if (grid.has(key)) {

  						octant = grid.get(key);

  						octantWrapper.id.key = key;
  						octantWrapper.octant = octant;
  						octantWrapper.min.copy(keyCoordinates0);
  						octantWrapper.min.multiplyScalar(cellSize);
  						octantWrapper.min.add(world.min);
  						octantWrapper.max.copy(octantWrapper.min).addScalar(cellSize);

  						if (octant.isosurface === null) {
  							intersectSubtree(world, octantWrapper, keyCoordinates0, ray, intersects);
  						} else {
  							intersects.push(octantWrapper.clone());
  						}
  					}

  					if (exy < 0) {

  						if (exz < 0) {

  							keyCoordinates0.x += sx;
  							exy += by;exz += bz;
  						} else {

  							keyCoordinates0.z += sz;
  							exz -= bx;ezy += by;
  						}
  					} else if (ezy < 0) {

  						keyCoordinates0.z += sz;
  						exz -= bx;ezy += by;
  					} else {

  						keyCoordinates0.y += sy;
  						exy -= bx;ezy -= bz;
  					}
  				}
  			}

  			return intersects;
  		}
  	}]);
  	return WorldOctreeRaycaster;
  }();

  var v$b = new Vector3();

  function removeChildren(world, octant, keyX, keyY, keyZ, lod) {

  	var grid = void 0,
  	    keyDesign = void 0;
  	var children = void 0,
  	    child = void 0;
  	var offset = void 0,
  	    key = void 0,
  	    i = void 0;

  	if (lod > 0) {
  		--lod;

  		grid = world.getGrid(lod);
  		keyDesign = world.getKeyDesign();
  		children = octant.children;

  		keyX <<= 1;keyY <<= 1;keyZ <<= 1;

  		for (i = 0; i < 8; ++i) {
  			if ((children & 1 << i) !== 0) {

  				offset = pattern[i];

  				v$b.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);

  				key = keyDesign.packKey(v$b);

  				child = grid.get(key);
  				grid.delete(key);

  				removeChildren(world, child, v$b.x, v$b.y, v$b.z, lod);
  			}
  		}

  		octant.children = 0;
  	}
  }

  function prune(world, keyX, keyY, keyZ, lod) {

  	var grid = void 0,
  	    i = void 0,
  	    key = void 0,
  	    parent = void 0;

  	if (++lod < world.levels) {
  		grid = world.getGrid(lod);

  		i = WorldOctree.calculateOffsetIndex(keyX, keyY, keyZ);

  		v$b.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);

  		key = world.getKeyDesign().packKey(v$b);
  		parent = grid.get(key);

  		parent.children &= ~(1 << i);

  		if (parent.children === 0) {
  			grid.delete(key);
  			prune(world, v$b.x, v$b.y, v$b.z, lod);
  		}
  	}
  }

  var WorldOctree = function () {
  	function WorldOctree() {
  		var cellSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
  		var levels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  		var keyDesign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new KeyDesign();
  		classCallCheck(this, WorldOctree);


  		levels = Math.max(Math.min(Math.trunc(levels), 32), 1);

  		this.cellSize = Math.max(Math.min(Math.trunc(cellSize), Math.pow(2, 33 - levels) - 1), 1);

  		this.keyDesign = keyDesign;

  		this.grids = [];

  		while (this.grids.length < levels) {

  			this.grids.push(new Map());
  		}

  		this.bounds = new WorldOctantWrapper();

  		this.bounds.min.copy(this.keyDesign.halfRange).multiplyScalar(-this.cellSize);
  		this.bounds.max.copy(this.keyDesign.halfRange).multiplyScalar(this.cellSize);
  	}

  	createClass(WorldOctree, [{
  		key: "getKeyDesign",
  		value: function getKeyDesign() {

  			return this.keyDesign;
  		}
  	}, {
  		key: "getCellSize",
  		value: function getCellSize() {
  			var lod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


  			return this.cellSize << lod >>> 0;
  		}
  	}, {
  		key: "getCenter",
  		value: function getCenter(target) {

  			return this.bounds.getCenter(target);
  		}
  	}, {
  		key: "setCenter",
  		value: function setCenter(center) {

  			this.min.copy(this.keyDesign.halfRange).multiplyScalar(-this.cellSize).add(center);
  			this.max.copy(this.keyDesign.halfRange).multiplyScalar(this.cellSize).add(center);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions(target) {

  			return this.bounds.getDimensions(target);
  		}
  	}, {
  		key: "getDepth",
  		value: function getDepth() {

  			return this.grids.length - 1;
  		}
  	}, {
  		key: "getGrid",
  		value: function getGrid(lod) {

  			return lod >= 0 && lod < this.grids.length ? this.grids[lod] : undefined;
  		}
  	}, {
  		key: "clear",
  		value: function clear() {

  			var i = void 0,
  			    l = void 0;

  			for (i = 0, l = this.grids.length; i < l; ++i) {

  				this.grids[i].clear();
  			}
  		}
  	}, {
  		key: "containsPoint",
  		value: function containsPoint(point) {

  			return this.bounds.containsPoint(point);
  		}
  	}, {
  		key: "findOctantsByLevel",
  		value: function findOctantsByLevel(level) {

  			return this.octants(level);
  		}
  	}, {
  		key: "calculateKeyCoordinates",
  		value: function calculateKeyCoordinates(position, lod) {
  			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector3();


  			var cellSize = this.cellSize << lod;

  			v$b.subVectors(position, this.min);

  			target.set(Math.trunc(v$b.x / cellSize), Math.trunc(v$b.y / cellSize), Math.trunc(v$b.z / cellSize));

  			return target;
  		}
  	}, {
  		key: "getOctantByPoint",
  		value: function getOctantByPoint(point) {
  			var lod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			var keyDesign = this.keyDesign;
  			var grid = this.getGrid(lod);

  			var result = void 0;

  			if (grid !== undefined) {

  				if (this.containsPoint(point)) {

  					this.calculateKeyCoordinates(point, lod, v$b);
  					result = grid.get(keyDesign.packKey(v$b));
  				} else {

  					console.error("Position out of range", point);
  				}
  			} else {

  				console.error("Invalid LOD", lod);
  			}

  			return result;
  		}
  	}, {
  		key: "removeOctant",
  		value: function removeOctant(key) {
  			var lod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			var keyDesign = this.keyDesign;
  			var grid = this.getGrid(lod);

  			var keyX = void 0,
  			    keyY = void 0,
  			    keyZ = void 0;

  			if (grid !== undefined) {

  				if (grid.has(key)) {
  					keyDesign.unpackKey(key, v$b);
  					keyX = v$b.x;keyY = v$b.y;keyZ = v$b.z;

  					removeChildren(this, grid.get(key), keyX, keyY, keyZ, lod);

  					grid.delete(key);

  					prune(this, keyX, keyY, keyZ, lod);
  				} else {

  					console.error("No octant found", key);
  				}
  			} else {

  				console.error("Invalid LOD", lod);
  			}
  		}
  	}, {
  		key: "applyCSG",
  		value: function applyCSG(sdf) {

  			WorldOctreeCSG.applyCSG(this, sdf);
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(ray) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			return WorldOctreeRaycaster.intersectWorldOctree(this, ray, intersects);
  		}
  	}, {
  		key: "octants",
  		value: function octants() {
  			var lod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


  			return new WorldOctantIterator(this, lod);
  		}
  	}, {
  		key: "min",
  		get: function get$$1() {

  			return this.bounds.min;
  		}
  	}, {
  		key: "max",
  		get: function get$$1() {

  			return this.bounds.max;
  		}
  	}, {
  		key: "levels",
  		get: function get$$1() {

  			return this.grids.length;
  		}
  	}, {
  		key: "lodZero",
  		get: function get$$1() {

  			return this.grids[0];
  		}
  	}], [{
  		key: "calculateOffsetIndex",
  		value: function calculateOffsetIndex(x, y, z) {
  			var offsetX = x & 1;
  			var offsetY = y & 1;
  			var offsetZ = z & 1;

  			return (offsetX << 2) + (offsetY << 1) + offsetZ;
  		}
  	}]);
  	return WorldOctree;
  }();

  var Scene = function () {
  	function Scene(levels) {
  		classCallCheck(this, Scene);
  	}

  	createClass(Scene, [{
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.levels);
  		}
  	}, {
  		key: "levels",
  		get: function get$$1() {

  			return this.something.length;
  		}
  	}]);
  	return Scene;
  }();

  var ClipmapEvent = function (_Event) {
  		inherits(ClipmapEvent, _Event);

  		function ClipmapEvent(type) {
  				classCallCheck(this, ClipmapEvent);

  				var _this = possibleConstructorReturn(this, (ClipmapEvent.__proto__ || Object.getPrototypeOf(ClipmapEvent)).call(this, type));

  				_this.lod = -1;

  				_this.left = null;

  				_this.entered = null;

  				_this.error = null;

  				return _this;
  		}

  		return ClipmapEvent;
  }(Event);

  var update = new ClipmapEvent("update");

  var error = new ClipmapEvent("error");

  var b$8 = new Box3();

  var f = new Frustum();

  var m$2 = new Matrix4();

  var Clipmap = function (_EventTarget) {
  	inherits(Clipmap, _EventTarget);

  	function Clipmap(world) {
  		classCallCheck(this, Clipmap);

  		var _this = possibleConstructorReturn(this, (Clipmap.__proto__ || Object.getPrototypeOf(Clipmap)).call(this));

  		_this.world = world;

  		_this.position = new Vector3(Infinity, Infinity, Infinity);

  		_this.currentScene = new Scene(_this.world.levels);

  		_this.previousScene = _this.currentScene.clone();

  		_this.nextScene = _this.currentScene.clone();

  		return _this;
  	}

  	createClass(Clipmap, [{
  		key: "update",
  		value: function update$$1(camera) {

  			var viewPosition = this.position;

  			viewPosition.copy(camera.position);

  			f.setFromMatrix(m$2.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
  		}
  	}, {
  		key: "process",
  		value: function process() {}
  	}, {
  		key: "clear",
  		value: function clear() {

  			this.previousScene.clear();
  			this.currentScene.clear();
  			this.nextScene.clear();
  		}
  	}]);
  	return Clipmap;
  }(EventTarget);

  var Action = {

    EXTRACT: "worker.extract",
    MODIFY: "worker.modify",
    CONFIGURE: "worker.config",
    CLOSE: "worker.close"

  };

  var Message = function Message() {
  		var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		classCallCheck(this, Message);


  		this.action = action;

  		this.error = null;
  };

  var DataMessage = function (_Message) {
  	inherits(DataMessage, _Message);

  	function DataMessage() {
  		var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		classCallCheck(this, DataMessage);

  		var _this = possibleConstructorReturn(this, (DataMessage.__proto__ || Object.getPrototypeOf(DataMessage)).call(this, action));

  		_this.data = null;

  		return _this;
  	}

  	return DataMessage;
  }(Message);

  var ExtractionRequest = function (_DataMessage) {
  	inherits(ExtractionRequest, _DataMessage);

  	function ExtractionRequest() {
  		classCallCheck(this, ExtractionRequest);
  		return possibleConstructorReturn(this, (ExtractionRequest.__proto__ || Object.getPrototypeOf(ExtractionRequest)).call(this, Action.EXTRACT));
  	}

  	return ExtractionRequest;
  }(DataMessage);

  var ModificationRequest = function (_DataMessage) {
  		inherits(ModificationRequest, _DataMessage);

  		function ModificationRequest() {
  				classCallCheck(this, ModificationRequest);

  				var _this = possibleConstructorReturn(this, (ModificationRequest.__proto__ || Object.getPrototypeOf(ModificationRequest)).call(this, Action.MODIFY));

  				_this.sdf = null;

  				_this.cellSize = 0;

  				_this.cellPosition = null;

  				return _this;
  		}

  		return ModificationRequest;
  }(DataMessage);

  var ConfigurationMessage = function (_Message) {
  		inherits(ConfigurationMessage, _Message);

  		function ConfigurationMessage() {
  				classCallCheck(this, ConfigurationMessage);

  				var _this = possibleConstructorReturn(this, (ConfigurationMessage.__proto__ || Object.getPrototypeOf(ConfigurationMessage)).call(this, Action.CONFIGURE));

  				_this.resolution = HermiteData.resolution;

  				_this.errorThreshold = 1e-2;

  				return _this;
  		}

  		return ConfigurationMessage;
  }(Message);

  var ExtractionResponse = function (_DataMessage) {
  	inherits(ExtractionResponse, _DataMessage);

  	function ExtractionResponse() {
  		classCallCheck(this, ExtractionResponse);

  		var _this = possibleConstructorReturn(this, (ExtractionResponse.__proto__ || Object.getPrototypeOf(ExtractionResponse)).call(this, Action.EXTRACT));

  		_this.isosurface = null;

  		return _this;
  	}

  	return ExtractionResponse;
  }(DataMessage);

  var ModificationResponse = function (_DataMessage) {
  	inherits(ModificationResponse, _DataMessage);

  	function ModificationResponse() {
  		classCallCheck(this, ModificationResponse);

  		var _this = possibleConstructorReturn(this, (ModificationResponse.__proto__ || Object.getPrototypeOf(ModificationResponse)).call(this, Action.MODIFY));

  		_this.sdf = null;

  		return _this;
  	}

  	return ModificationResponse;
  }(DataMessage);

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

  var worker = "(function(){\"use strict\";function e(e,t,n){return ne(te(e,n),t)}function t(e,t,n,a,i,l){var o=0;return e>t&&e>n?(i<e&&(o|=2),l<e&&(o|=1)):t>n?(a<t&&(o|=4),l<t&&(o|=1)):(a<n&&(o|=4),i<n&&(o|=2)),o}function n(e,t,n,a){var i=void 0,l=0;return t<n?(i=t,l=0):(i=n,l=1),a<i&&(l=2),r[e][l]}function i(e,a,l,o,r,s,y,d,u){var c=e.children,m=void 0,x=void 0,p=void 0,v=void 0;if(0<=r&&0<=s&&0<=y)if(null===c)u.push(e);else{x=.5*(a+r),p=.5*(l+s),v=.5*(o+y),m=t(a,l,o,x,p,v);do 0===m?(i(c[et],a,l,o,x,p,v,d,u),m=n(m,x,p,v)):1===m?(i(c[1^et],a,l,v,x,p,y,d,u),m=n(m,x,p,y)):2===m?(i(c[2^et],a,p,o,x,s,v,d,u),m=n(m,x,s,v)):3===m?(i(c[3^et],a,p,v,x,s,y,d,u),m=n(m,x,s,y)):4===m?(i(c[4^et],x,l,o,r,p,v,d,u),m=n(m,r,p,v)):5===m?(i(c[5^et],x,l,v,r,p,y,d,u),m=n(m,r,p,y)):6===m?(i(c[6^et],x,p,o,r,s,v,d,u),m=n(m,r,s,v)):7===m?(i(c[7^et],x,p,v,r,s,y,d,u),m=8):void 0;while(8>m)}}function o(e){var t=e.children,n=0,a=void 0,r=void 0,s=void 0;if(null!==t)for(a=0,r=t.length;a<r;++a)s=1+o(t[a]),s>n&&(n=s);return n}function s(e,t,n){var a=e.children,o=void 0,r=void 0;if(nt.min=e.min,nt.max=e.max,t.intersectsBox(nt))if(null!==a)for(o=0,r=a.length;o<r;++o)s(a[o],t,n);else n.push(e)}function y(e,t,n,a){var o=e.children,r=void 0,s=void 0;if(n===t)a.push(e);else if(null!==o)for(++n,r=0,s=o.length;r<s;++r)y(o[r],t,n,a)}function d(e){var t=e.children,n=0,a=void 0,o=void 0;if(null!==t)for(a=0,o=t.length;a<o;++a)n+=d(t[a]);else null!==e.points&&(n=e.points.length);return n}function x(e,t,n,a,o){var r=a.children,s=!1,y=!1,d=void 0,u=void 0;if(a.contains(e,n.bias)){if(null===r){if(null===a.points)a.points=[],a.data=[];else for(d=0,u=a.points.length;!s&&d<u;++d)s=a.points[d].equals(e);s?(a.data[d-1]=t,y=!0):a.points.length<n.maxPoints||o===n.maxDepth?(a.points.push(e.clone()),a.data.push(t),++n.pointCount,y=!0):(a.split(),a.redistribute(n.bias),r=a.children)}if(null!==r)for(++o,d=0,u=r.length;!y&&d<u;++d)y=x(e,t,n,r[d],o)}return y}function g(e,t,n,a){var o=n.children,r=null,s=void 0,y=void 0,u=void 0,c=void 0,m=void 0;if(n.contains(e,t.bias))if(null!==o)for(s=0,y=o.length;null===r&&s<y;++s)r=g(e,t,o[s],n);else if(null!==n.points)for(u=n.points,c=n.data,(s=0,y=u.length);s<y;++s)if(u[s].equals(e)){m=y-1,r=c[s],s<m&&(u[s]=u[m],c[s]=c[m]),u.pop(),c.pop(),--t.pointCount,null!==a&&d(a)<=t.maxPoints&&a.merge();break}return r}function k(e,t,n){var a=n.children,o=null,r=void 0,s=void 0,y=void 0;if(n.contains(e,t.bias))if(null!==a)for(r=0,s=a.length;null===o&&r<s;++r)o=k(e,t,a[r]);else if(null!==n.points)for(y=n.points,r=0,s=y.length;null===o&&r<s;++r)e.distanceToSquared(y[r])<=ot&&(o=n.data[r]);return o}function h(e,t,n,a,o,r){var s=a.children,y=null,d=void 0,u=void 0,c=void 0;if(a.contains(e,n.bias))if(!a.contains(t,n.bias))y=g(e,n,a,o),x(t,y,n,o,r-1);else if(null!==s)for(++r,d=0,u=s.length;null===y&&d<u;++d)y=h(e,t,n,s[d],a,r);else if(null!==a.points)for(c=a.points,d=0,u=c.length;d<u;++d)if(e.distanceToSquared(c[d])<=ot){c[d].copy(t),y=a.data[d];break}return y}function z(e,t,n,a){var o=a.points,r=a.children,s=null,y=t,d=void 0,u=void 0,c=void 0,m=void 0,x=void 0,v=void 0,g=void 0;if(null!==r)for(x=r.map(function(t){return{octant:t,distance:t.distanceToCenterSquared(e)}}).sort(function(e,t){return e.distance-t.distance}),d=0,u=x.length;d<u;++d)v=x[d].octant,v.contains(e,y)&&(g=z(e,y,n,v),null!==g&&(m=g.point.distanceToSquared(e),(!n||0<m)&&m<y&&(y=m,s=g)));else if(null!==o)for(d=0,u=o.length;d<u;++d)c=o[d],m=e.distanceToSquared(c),(!n||0<m)&&m<y&&(y=m,s={point:c.clone(),data:a.data[d]});return s}function f(e,t,n,a,o){var r=a.points,s=a.children,y=void 0,d=void 0,u=void 0,c=void 0,m=void 0;if(null!==s)for(y=0,d=s.length;y<d;++y)m=s[y],m.contains(e,t)&&f(e,t,n,m,o);else if(null!==r)for(y=0,d=r.length;y<d;++y)u=r[y],c=e.distanceToSquared(u),(!n||0<c)&&c<=t*t&&o.push({point:u.clone(),data:a.data[y]})}function l(e,t){var n=e.elements,a=t.elements,i=void 0;0!==n[1]&&(i=Ct.calculateCoefficients(n[0],n[1],n[3]),bt.rotateQXY(qt.set(n[0],n[3]),n[1],i),n[0]=qt.x,n[3]=qt.y,bt.rotateXY(qt.set(n[2],n[4]),i),n[2]=qt.x,n[4]=qt.y,n[1]=0,bt.rotateXY(qt.set(a[0],a[3]),i),a[0]=qt.x,a[3]=qt.y,bt.rotateXY(qt.set(a[1],a[4]),i),a[1]=qt.x,a[4]=qt.y,bt.rotateXY(qt.set(a[2],a[5]),i),a[2]=qt.x,a[5]=qt.y)}function S(e,t){var n=e.elements,a=t.elements,i=void 0;0!==n[2]&&(i=Ct.calculateCoefficients(n[0],n[2],n[5]),bt.rotateQXY(qt.set(n[0],n[5]),n[2],i),n[0]=qt.x,n[5]=qt.y,bt.rotateXY(qt.set(n[1],n[4]),i),n[1]=qt.x,n[4]=qt.y,n[2]=0,bt.rotateXY(qt.set(a[0],a[6]),i),a[0]=qt.x,a[6]=qt.y,bt.rotateXY(qt.set(a[1],a[7]),i),a[1]=qt.x,a[7]=qt.y,bt.rotateXY(qt.set(a[2],a[8]),i),a[2]=qt.x,a[8]=qt.y)}function T(e,t){var n=e.elements,a=t.elements,i=void 0;0!==n[4]&&(i=Ct.calculateCoefficients(n[3],n[4],n[5]),bt.rotateQXY(qt.set(n[3],n[5]),n[4],i),n[3]=qt.x,n[5]=qt.y,bt.rotateXY(qt.set(n[1],n[2]),i),n[1]=qt.x,n[2]=qt.y,n[4]=0,bt.rotateXY(qt.set(a[3],a[6]),i),a[3]=qt.x,a[6]=qt.y,bt.rotateXY(qt.set(a[4],a[7]),i),a[4]=qt.x,a[7]=qt.y,bt.rotateXY(qt.set(a[5],a[8]),i),a[5]=qt.x,a[8]=qt.y)}function w(t,n){var a=t.elements,e=void 0;for(e=0;e<5;++e)l(t,n),S(t,n),T(t,n);return At.set(a[0],a[3],a[5])}function P(e){var t=$(e)<Et?0:1/e;return $(t)<Et?0:t}function I(e,t){var n=e.elements,a=n[0],i=n[3],l=n[6],o=n[1],r=n[4],s=n[7],y=n[2],d=n[5],u=n[8],c=P(t.x),m=P(t.y),x=P(t.z);return e.set(a*c*a+i*m*i+l*x*l,a*c*o+i*m*r+l*x*s,a*c*y+i*m*d+l*x*u,o*c*a+r*m*i+s*x*l,o*c*o+r*m*r+s*x*s,o*c*y+r*m*d+s*x*u,y*c*a+d*m*i+u*x*l,y*c*o+d*m*r+u*x*s,y*c*y+d*m*d+u*x*u)}function _(e,t,n){return e.applyToVector3(Ft.copy(n)),Ft.subVectors(t,Ft),Ft.dot(Ft)}function C(e,t,n){var a=[-1,-1,-1,-1],l=[!1,!1,!1,!1],o=1/0,r=0,s=!1,y=void 0,d=void 0,u=void 0,c=void 0,m=void 0,x=void 0,p=void 0;for(p=0;4>p;++p)m=e[p],x=Jt[t][p],y=Ue[x][0],d=Ue[x][1],u=1&m.voxel.materials>>y,c=1&m.voxel.materials>>d,m.size<o&&(o=m.size,r=p,s=u!==ft.AIR),a[p]=m.voxel.index,l[p]=u!=c;l[r]&&(s?(n.push(a[0]),n.push(a[3]),n.push(a[1]),n.push(a[0]),n.push(a[2]),n.push(a[3])):(n.push(a[0]),n.push(a[1]),n.push(a[3]),n.push(a[0]),n.push(a[3]),n.push(a[2])))}function E(e,t,n){var a=[0,0,0,0],l=void 0,o=void 0,r=void 0,s=void 0;if(null!==e[0].voxel&&null!==e[1].voxel&&null!==e[2].voxel&&null!==e[3].voxel)C(e,t,n);else for(r=0;2>r;++r){for(a[0]=Ht[t][r][0],a[1]=Ht[t][r][1],a[2]=Ht[t][r][2],a[3]=Ht[t][r][3],l=[],s=0;4>s;++s)if(o=e[s],null!==o.voxel)l[s]=o;else if(null!==o.children)l[s]=o.children[a[s]];else break;4===s&&E(l,Ht[t][r][4],n)}}function O(e,t,n){var a=[0,0,0,0],l=[[0,0,1,1],[0,1,0,1]],o=void 0,r=void 0,s=void 0,y=void 0,d=void 0,u=void 0;if(null!==e[0].children||null!==e[1].children){for(d=0;4>d;++d)a[0]=Qt[t][d][0],a[1]=Qt[t][d][1],o=[null===e[0].children?e[0]:e[0].children[a[0]],null===e[1].children?e[1]:e[1].children[a[1]]],O(o,Qt[t][d][2],n);for(d=0;4>d;++d){for(a[0]=Gt[t][d][1],a[1]=Gt[t][d][2],a[2]=Gt[t][d][3],a[3]=Gt[t][d][4],s=l[Gt[t][d][0]],r=[],u=0;4>u;++u)if(y=e[s[u]],null!==y.voxel)r[u]=y;else if(null!==y.children)r[u]=y.children[a[u]];else break;4===u&&E(r,Gt[t][d][5],n)}}}function D(e,t){var n=e.children,a=[0,0,0,0],l=void 0,o=void 0,r=void 0;if(null!==n){for(r=0;8>r;++r)D(n[r],t);for(r=0;12>r;++r)a[0]=jt[r][0],a[1]=jt[r][1],l=[n[a[0]],n[a[1]]],O(l,jt[r][2],t);for(r=0;6>r;++r)a[0]=Ut[r][0],a[1]=Ut[r][1],a[2]=Ut[r][2],a[3]=Ut[r][3],o=[n[a[0]],n[a[1]],n[a[2]],n[a[3]]],E(o,Ut[r][4],t)}}function A(e,t,n,a){var l,o;if(null!==e.children)for(l=0;8>l;++l)a=A(e.children[l],t,n,a);else null!==e.voxel&&(o=e.voxel,o.index=a,t[3*a]=o.position.x,t[3*a+1]=o.position.y,t[3*a+2]=o.position.z,n[3*a]=o.normal.x,n[3*a+1]=o.normal.y,n[3*a+2]=o.normal.z,++a);return a}function V(e,t,a,l,o){var r=0;for(t>>=1;0<t;t>>=1,r=0)a>=t&&(r+=4,a-=t),l>=t&&(r+=2,l-=t),o>=t&&(r+=1,o-=t),null===e.children&&e.split(),e=e.children[r];return e}function F(e,t,n,a,l){var o=e+1,r=new Nt,s=void 0,y=void 0,d=void 0,u=void 0,c=void 0,m=void 0,x=void 0,p=void 0,v=void 0,g=void 0;for(s=0,g=0;8>g;++g)u=je[g],c=(a+u[2])*(o*o)+(n+u[1])*o+(t+u[0]),d=te(l[c],ft.SOLID),s|=d<<g;for(y=0,g=0;12>g;++g)m=Ue[g][0],x=Ue[g][1],p=1&s>>m,v=1&s>>x,p!=v&&++y;return r.materials=s,r.edgeCount=y,r.qefData=new It,r}function B(e){var t=un,a=Pt.resolution,n=new xe(0,0,0),i=new xe(a,a,a),l=new v(cn,cn.clone().addScalar(un)),o=e.getBoundingBox();return e.type!==on.INTERSECTION&&(o.intersectsBox(l)?(n.copy(o.min).max(l.min).sub(l.min),n.x=K(n.x*a/t),n.y=K(n.y*a/t),n.z=K(n.z*a/t),i.copy(o.max).min(l.max).sub(l.min),i.x=W(i.x*a/t),i.y=W(i.y*a/t),i.z=W(i.z*a/t)):(n.set(a,a,a),i.set(0,0,0))),new v(n,i)}function N(e,t,a,i){var l=Pt.resolution,n=l+1,o=i.max.x,r=i.max.y,s=i.max.z,d=void 0,u=void 0,c=void 0;for(c=i.min.z;c<=s;++c)for(u=i.min.y;u<=r;++u)for(d=i.min.x;d<=o;++d)e.updateMaterialIndex(c*(n*n)+u*n+d,t,a)}function L(e,t,a){var i=un,l=Pt.resolution,n=l+1,o=t.materialIndices,r=new xe,s=new xe,d=a.max.x,u=a.max.y,c=a.max.z,m=void 0,p=0,v=void 0,g=void 0,k=void 0;for(k=a.min.z;k<=c;++k)for(r.z=k*i/l,g=a.min.y;g<=u;++g)for(r.y=g*i/l,v=a.min.x;v<=d;++v)r.x=v*i/l,m=e.generateMaterialIndex(s.addVectors(cn,r)),m!==ft.AIR&&(o[k*(n*n)+g*n+v]=m,++p);t.materials=p}function R(e,t,a){var l=Pt.resolution,n=l+1,o=new Uint32Array([1,n,n*n]),r=t.materialIndices,s=new pt,y=new pt,u=a.edgeData,m=t.edgeData,x=new Uint32Array(3),p=zt.calculate1DEdgeCount(l),v=new zt(l,te(p,m.indices[0].length+u.indices[0].length),te(p,m.indices[1].length+u.indices[1].length),te(p,m.indices[2].length+u.indices[2].length)),g=void 0,k=void 0,h=void 0,z=void 0,f=void 0,S=void 0,T=void 0,w=void 0,P=void 0,I=void 0,_=void 0,C=void 0,b=void 0,E=void 0,O=void 0,D=void 0,q=void 0,A=void 0,V=void 0,F=void 0,B=void 0,N=void 0,L=void 0;for(A=0,V=0;3>V;A=0,++V){for(g=u.indices[V],z=m.indices[V],T=v.indices[V],k=u.zeroCrossings[V],f=m.zeroCrossings[V],w=v.zeroCrossings[V],h=u.normals[V],S=m.normals[V],P=v.normals[V],I=o[V],N=g.length,L=z.length,(F=0,B=0);F<N;++F)if(_=g[F],C=_+I,O=r[_],D=r[C],O!==D&&(O===ft.AIR||D===ft.AIR)){for(s.t=k[F],s.n.x=h[3*F],s.n.y=h[3*F+1],s.n.z=h[3*F+2],e.type===on.DIFFERENCE&&s.n.negate(),q=s;B<L&&z[B]<=_;)b=z[B],E=b+I,y.t=f[B],y.n.x=S[3*B],y.n.y=S[3*B+1],y.n.z=S[3*B+2],O=r[b],b<_?(D=r[E],O!==D&&(O===ft.AIR||D===ft.AIR)&&(T[A]=b,w[A]=y.t,P[3*A]=y.n.x,P[3*A+1]=y.n.y,P[3*A+2]=y.n.z,++A)):q=e.selectEdge(y,s,O===ft.SOLID),++B;T[A]=_,w[A]=q.t,P[3*A]=q.n.x,P[3*A+1]=q.n.y,P[3*A+2]=q.n.z,++A}for(;B<L;)b=z[B],E=b+I,O=r[b],D=r[E],O!==D&&(O===ft.AIR||D===ft.AIR)&&(T[A]=b,w[A]=f[B],P[3*A]=S[3*B],P[3*A+1]=S[3*B+1],P[3*A+2]=S[3*B+2],++A),++B;x[V]=A}return{edgeData:v,lengths:x}}function Y(e,t,i){var l=un,o=Pt.resolution,n=o+1,r=n*n,s=new Uint32Array([1,n,r]),u=t.materialIndices,m=cn,p=new xe,v=new xe,g=new pt,k=new Uint32Array(3),h=new zt(o,zt.calculate1DEdgeCount(o)),f=void 0,S=void 0,T=void 0,w=void 0,P=void 0,I=void 0,_=void 0,C=void 0,b=void 0,E=void 0,O=void 0,D=void 0,q=void 0,A=void 0,V=void 0,F=void 0,B=void 0,N=void 0,L=void 0;for(V=4,q=0,A=0;3>A;V>>=1,q=0,++A){F=je[V],f=h.indices[A],S=h.zeroCrossings[A],T=h.normals[A],w=s[A],_=i.min.x,E=i.max.x,C=i.min.y,O=i.max.y,b=i.min.z,D=i.max.z;for(0===A?(_=ne(_-1,0),E=te(E,o-1)):1===A?(C=ne(C-1,0),O=te(O,o-1)):2===A?(b=ne(b-1,0),D=te(D,o-1)):void 0,L=b;L<=D;++L)for(N=C;N<=O;++N)for(B=_;B<=E;++B)P=L*r+N*n+B,I=P+w,u[P]!==u[I]&&(p.set(B*l/o,N*l/o,L*l/o),v.set((B+F[0])*l/o,(N+F[1])*l/o,(L+F[2])*l/o),g.a.addVectors(m,p),g.b.addVectors(m,v),e.generateEdge(g),f[q]=P,S[q]=g.t,T[3*q]=g.n.x,T[3*q+1]=g.n.y,T[3*q+2]=g.n.z,++q);k[A]=q}return{edgeData:h,lengths:k}}function M(e,t,n){var a=B(e),i=void 0,l=void 0,o=void 0,r=void 0,s=!1;if(e.type===on.DENSITY_FUNCTION?L(e,t,a):t.empty?e.type===on.UNION&&(t.set(n),s=!0):!(t.full&&e.type===on.UNION)&&N(e,t,n,a),!s&&!t.empty&&!t.full){for(i=e.type===on.DENSITY_FUNCTION?Y(e,t,a):R(e,t,n),l=i.edgeData,o=i.lengths,r=0;3>r;++r)l.indices[r]=l.indices[r].slice(0,o[r]),l.zeroCrossings[r]=l.zeroCrossings[r].slice(0,o[r]),l.normals[r]=l.normals[r].slice(0,3*o[r]);t.edgeData=l}}function X(e){var t=e.children,n=void 0,a=void 0,o=void 0,r=void 0;for(e.type===on.DENSITY_FUNCTION&&(n=new Pt,M(e,n)),o=0,r=t.length;o<r&&(a=X(t[o]),void 0===n?n=a:null===a?e.type===on.INTERSECTION&&(n=null):null===n?e.type===on.UNION&&(n=a):M(e,n,a),null!==n||e.type===on.UNION);++o);return null!==n&&n.empty?null:n}function Z(e){var t=document.createElementNS(\"http://www.w3.org/1999/xhtml\",\"canvas\"),n=t.getContext(\"2d\");return t.width=e.width,t.height=e.height,n.drawImage(e,0,0),n.getImageData(0,0,e.width,e.height)}var j=Math.pow,U=Math.trunc,Q=Math.sign,G=Math.PI,H=Math.atan2,J=Math.round,K=Math.ceil,W=Math.floor,$=Math.abs,ee=Math.acos,te=Math.min,ne=Math.max,ae=Math.sqrt,ie=Math.cos,le=Math.sin,oe=function(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")},re=function(){function e(e,t){for(var n,a=0;a<t.length;a++)n=t[a],n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),se=function e(t,n,a){null===t&&(t=Function.prototype);var i=Object.getOwnPropertyDescriptor(t,n);if(void 0===i){var l=Object.getPrototypeOf(t);return null===l?void 0:e(l,n,a)}if(\"value\"in i)return i.value;var o=i.get;return void 0===o?void 0:o.call(a)},ye=function(e,t){if(\"function\"!=typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},de=function(e,t){if(!e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return t&&(\"object\"==typeof t||\"function\"==typeof t)?t:e},ue=function e(t,n,a,i){var l=Object.getOwnPropertyDescriptor(t,n);if(void 0===l){var o=Object.getPrototypeOf(t);null!==o&&e(o,n,a,i)}else if(\"value\"in l&&l.writable)l.value=a;else{var r=l.set;void 0!==r&&r.call(i,a)}return a},ce=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},me=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;oe(this,e),this.runLengths=t,this.data=n}return re(e,null,[{key:\"encode\",value:function(t){var n=[],a=[],o=t[0],r=1,s=void 0,y=void 0;for(s=1,y=t.length;s<y;++s)o===t[s]?++r:(n.push(r),a.push(o),o=t[s],r=1);return n.push(r),a.push(o),new e(n,a)}},{key:\"decode\",value:function(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:[],a=void 0,l=void 0,o=void 0,r=void 0,s=void 0,y=0;for(l=0,r=t.length;l<r;++l)for(a=t[l],o=0,s=e[l];o<s;++o)n[y++]=a;return n}}]),e}(),xe=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;oe(this,e),this.x=t,this.y=n,this.z=a}return re(e,[{key:\"set\",value:function(e,t,n){return this.x=e,this.y=t,this.z=n,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}},{key:\"setFromSpherical\",value:function(e){var t=le(e.phi)*e.radius;return this.x=t*le(e.theta),this.y=ie(e.phi)*e.radius,this.z=t*ie(e.theta),this}},{key:\"setFromCylindrical\",value:function(e){return this.x=e.radius*le(e.theta),this.y=e.y,this.z=e.radius*ie(e.theta),this}},{key:\"setFromMatrixColumn\",value:function(e,t){return this.fromArray(e.elements,4*t)}},{key:\"setFromMatrixPosition\",value:function(e){var t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}},{key:\"setFromMatrixScale\",value:function(e){var t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=a,this}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this.z+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this.z-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this.z*=e,this}},{key:\"multiplyVectors\",value:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this.z/=e,this}},{key:\"crossVectors\",value:function(e,t){var n=e.x,a=e.y,i=e.z,l=t.x,o=t.y,r=t.z;return this.x=a*r-i*o,this.y=i*l-n*r,this.z=n*o-a*l,this}},{key:\"cross\",value:function(e){return this.crossVectors(this,e)}},{key:\"transformDirection\",value:function(t){var n=this.x,a=this.y,i=this.z,l=t.elements;return this.x=l[0]*n+l[4]*a+l[8]*i,this.y=l[1]*n+l[5]*a+l[9]*i,this.z=l[2]*n+l[6]*a+l[10]*i,this.normalize()}},{key:\"applyMatrix3\",value:function(t){var n=this.x,a=this.y,i=this.z,l=t.elements;return this.x=l[0]*n+l[3]*a+l[6]*i,this.y=l[1]*n+l[4]*a+l[7]*i,this.z=l[2]*n+l[5]*a+l[8]*i,this}},{key:\"applyMatrix4\",value:function(t){var n=this.x,a=this.y,i=this.z,l=t.elements;return this.x=l[0]*n+l[4]*a+l[8]*i+l[12],this.y=l[1]*n+l[5]*a+l[9]*i+l[13],this.z=l[2]*n+l[6]*a+l[10]*i+l[14],this}},{key:\"applyQuaternion\",value:function(e){var t=this.x,n=this.y,a=this.z,i=e.x,l=e.y,o=e.z,r=e.w,s=r*t+l*a-o*n,y=r*n+o*t-i*a,d=r*a+i*n-l*t,u=-i*t-l*n-o*a;return this.x=s*r+u*-i+y*-o-d*-l,this.y=y*r+u*-l+d*-i-s*-o,this.z=d*r+u*-o+s*-l-y*-i,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z}},{key:\"reflect\",value:function(e){var t=e.x,n=e.y,a=e.z;return this.sub(e.multiplyScalar(2*this.dot(e))),e.set(t,n,a),this}},{key:\"angleTo\",value:function(e){var t=this.dot(e)/ae(this.lengthSquared()*e.lengthSquared());return ee(te(ne(t,-1),1))}},{key:\"manhattanLength\",value:function(){return $(this.x)+$(this.y)+$(this.z)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return ae(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"manhattanDistanceTo\",value:function(e){return $(this.x-e.x)+$(this.y-e.y)+$(this.z-e.z)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,n=this.y-e.y,a=this.z-e.z;return t*t+n*n+a*a}},{key:\"distanceTo\",value:function(e){return ae(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=te(this.x,e.x),this.y=te(this.y,e.y),this.z=te(this.z,e.z),this}},{key:\"max\",value:function(e){return this.x=ne(this.x,e.x),this.y=ne(this.y,e.y),this.z=ne(this.z,e.z),this}},{key:\"clamp\",value:function(e,t){return this.x=ne(e.x,te(t.x,this.x)),this.y=ne(e.y,te(t.y,this.y)),this.z=ne(e.z,te(t.z,this.z)),this}},{key:\"floor\",value:function(){return this.x=W(this.x),this.y=W(this.y),this.z=W(this.z),this}},{key:\"ceil\",value:function(){return this.x=K(this.x),this.y=K(this.y),this.z=K(this.z),this}},{key:\"round\",value:function(){return this.x=J(this.x),this.y=J(this.y),this.z=J(this.z),this}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}},{key:\"lerpVectors\",value:function(e,t,n){return this.subVectors(t,e).multiplyScalar(n).add(e)}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}}]),e}(),pe=new xe,v=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe(1/0,1/0,1/0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe(-Infinity,-Infinity,-Infinity);oe(this,e),this.min=t,this.max=n}return re(e,[{key:\"set\",value:function(e,t){return this.min.copy(e),this.max.copy(t),this}},{key:\"copy\",value:function(e){return this.min.copy(e.min),this.max.copy(e.max),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-Infinity,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}},{key:\"setFromSphere\",value:function(e){return this.set(e.center,e.center),this.expandByScalar(e.radius),this}},{key:\"expandByPoint\",value:function(e){return this.min.min(e),this.max.max(e),this}},{key:\"expandByVector\",value:function(e){return this.min.sub(e),this.max.add(e),this}},{key:\"expandByScalar\",value:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this}},{key:\"setFromPoints\",value:function(e){var t,n;for(this.min.set(0,0,0),this.max.set(0,0,0),(t=0,n=e.length);t<n;++t)this.expandByPoint(e[t]);return this}},{key:\"setFromCenterAndSize\",value:function(e,t){var n=pe.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe;return t.copy(e).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(e){var t=pe.copy(e).clamp(this.min,this.max);return t.sub(e).length()}},{key:\"applyMatrix4\",value:function(e){var t=this.min,n=this.max;if(!this.isEmpty()){var a=e.elements,i=a[0]*t.x,l=a[1]*t.x,o=a[2]*t.x,r=a[0]*n.x,s=a[1]*n.x,y=a[2]*n.x,d=a[4]*t.y,u=a[5]*t.y,c=a[6]*t.y,m=a[4]*n.y,x=a[5]*n.y,p=a[6]*n.y,v=a[8]*t.z,g=a[9]*t.z,k=a[10]*t.z,h=a[8]*n.z,z=a[9]*n.z,f=a[10]*n.z;t.x=te(i,r)+te(d,m)+te(v,h)+a[12],t.y=te(l,s)+te(u,x)+te(g,z)+a[13],t.z=te(o,y)+te(c,p)+te(k,f)+a[14],n.x=ne(i,r)+ne(d,m)+ne(v,h)+a[12],n.y=ne(l,s)+ne(u,x)+ne(g,z)+a[13],n.z=ne(o,y)+ne(c,p)+ne(k,f)+a[14]}return this}},{key:\"translate\",value:function(e){return this.min.add(e),this.max.add(e),this}},{key:\"intersect\",value:function(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(e){return this.min.min(e.min),this.max.max(e.max),this}},{key:\"containsPoint\",value:function(e){var t=this.min,n=this.max;return e.x>=t.x&&e.y>=t.y&&e.z>=t.z&&e.x<=n.x&&e.y<=n.y&&e.z<=n.z}},{key:\"containsBox\",value:function(e){var t=this.min,n=this.max,a=e.min,i=e.max;return t.x<=a.x&&i.x<=n.x&&t.y<=a.y&&i.y<=n.y&&t.z<=a.z&&i.z<=n.z}},{key:\"intersectsBox\",value:function(e){var t=this.min,n=this.max,a=e.min,i=e.max;return i.x>=t.x&&i.y>=t.y&&i.z>=t.z&&a.x<=n.x&&a.y<=n.y&&a.z<=n.z}},{key:\"intersectsSphere\",value:function(e){var t=this.clampPoint(e.center,pe);return t.distanceToSquared(e.center)<=e.radius*e.radius}},{key:\"intersectsPlane\",value:function(e){var t,n;return 0<e.normal.x?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),0<e.normal.y?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),0<e.normal.z?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=e.constant&&n>=e.constant}},{key:\"equals\",value:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}]),e}(),ve=new v,ge=new xe,ke=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;oe(this,e),this.center=t,this.radius=n}return re(e,[{key:\"set\",value:function(e,t){return this.center.copy(e),this.radius=t,this}},{key:\"copy\",value:function(e){return this.center.copy(e.center),this.radius=e.radius,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromPoints\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:ve.setFromPoints(e).getCenter(this.center),n=0,a=void 0,o=void 0;for(a=0,o=e.length;a<o;++a)n=ne(n,t.distanceToSquared(e[a]));return this.radius=ae(n),this}},{key:\"setFromBox\",value:function(e){return e.getCenter(this.center),this.radius=.5*e.getSize(ge).length(),this}},{key:\"isEmpty\",value:function(){return 0>=this.radius}},{key:\"translate\",value:function(e){return this.center.add(e),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe,n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}},{key:\"distanceToPoint\",value:function(e){return e.distanceTo(this.center)-this.radius}},{key:\"containsPoint\",value:function(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}},{key:\"intersectsSphere\",value:function(e){var t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}},{key:\"intersectsBox\",value:function(e){return e.intersectsSphere(this)}},{key:\"intersectsPlane\",value:function(e){return $(e.distanceToPoint(this.center))<=this.radius}},{key:\"equals\",value:function(e){return e.center.equals(this.center)&&e.radius===this.radius}}]),e}(),he=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;oe(this,e),this.x=t,this.y=n}return re(e,[{key:\"set\",value:function(e,t){return this.x=e,this.y=t,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this}},{key:\"applyMatrix3\",value:function(t){var n=this.x,a=this.y,i=t.elements;return this.x=i[0]*n+i[3]*a+i[6],this.y=i[1]*n+i[4]*a+i[7],this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y}},{key:\"manhattanLength\",value:function(){return $(this.x)+$(this.y)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y}},{key:\"length\",value:function(){return ae(this.x*this.x+this.y*this.y)}},{key:\"manhattanDistanceTo\",value:function(e){return $(this.x-e.x)+$(this.y-e.y)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,n=this.y-e.y;return t*t+n*n}},{key:\"distanceTo\",value:function(e){return ae(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=te(this.x,e.x),this.y=te(this.y,e.y),this}},{key:\"max\",value:function(e){return this.x=ne(this.x,e.x),this.y=ne(this.y,e.y),this}},{key:\"clamp\",value:function(e,t){return this.x=ne(e.x,te(t.x,this.x)),this.y=ne(e.y,te(t.y,this.y)),this}},{key:\"floor\",value:function(){return this.x=W(this.x),this.y=W(this.y),this}},{key:\"ceil\",value:function(){return this.x=K(this.x),this.y=K(this.y),this}},{key:\"round\",value:function(){return this.x=J(this.x),this.y=J(this.y),this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this}},{key:\"angle\",value:function(){var e=H(this.y,this.x);return 0>e&&(e+=2*G),e}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}},{key:\"lerpVectors\",value:function(e,t,n){return this.subVectors(t,e).multiplyScalar(n).add(e)}},{key:\"rotateAround\",value:function(e,t){var n=ie(t),a=le(t),i=this.x-e.x,l=this.y-e.y;return this.x=i*n-l*a+e.x,this.y=i*a+l*n+e.y,this}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y}},{key:\"width\",get:function(){return this.x},set:function(e){return this.x=e}},{key:\"height\",get:function(){return this.y},set:function(e){return this.y=e}}]),e}(),ze=new he,fe=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new he(1/0,1/0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new he(-Infinity,-Infinity);oe(this,e),this.min=t,this.max=n}return re(e,[{key:\"set\",value:function(e,t){return this.min.copy(e),this.max.copy(t),this}},{key:\"copy\",value:function(e){return this.min.copy(e.min),this.max.copy(e.max),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-Infinity,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new he;return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new he;return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}},{key:\"getBoundingSphere\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new ke;return this.getCenter(e.center),e.radius=.5*this.getSize(ze).length(),e}},{key:\"expandByPoint\",value:function(e){return this.min.min(e),this.max.max(e),this}},{key:\"expandByVector\",value:function(e){return this.min.sub(e),this.max.add(e),this}},{key:\"expandByScalar\",value:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this}},{key:\"setFromPoints\",value:function(e){var t,n;for(this.min.set(0,0),this.max.set(0,0),(t=0,n=e.length);t<n;++t)this.expandByPoint(e[t]);return this}},{key:\"setFromCenterAndSize\",value:function(e,t){var n=ze.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new he;return t.copy(e).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(e){var t=ze.copy(e).clamp(this.min,this.max);return t.sub(e).length()}},{key:\"translate\",value:function(e){return this.min.add(e),this.max.add(e),this}},{key:\"intersect\",value:function(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(e){return this.min.min(e.min),this.max.max(e.max),this}},{key:\"containsPoint\",value:function(e){var t=this.min,n=this.max;return e.x>=t.x&&e.y>=t.y&&e.x<=n.x&&e.y<=n.y}},{key:\"containsBox\",value:function(e){var t=this.min,n=this.max,a=e.min,i=e.max;return t.x<=a.x&&i.x<=n.x&&t.y<=a.y&&i.y<=n.y}},{key:\"intersectsBox\",value:function(e){var t=this.min,n=this.max,a=e.min,i=e.max;return i.x>=t.x&&i.y>=t.y&&a.x<=n.x&&a.y<=n.y}},{key:\"equals\",value:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}]),e}(),Se=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;oe(this,e),this.radius=t,this.theta=n,this.y=a}return re(e,[{key:\"set\",value:function(e,t,n){return this.radius=e,this.theta=t,this.y=n,this}},{key:\"copy\",value:function(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromVector3\",value:function(e){return this.radius=ae(e.x*e.x+e.z*e.z),this.theta=H(e.x,e.z),this.y=e.y,this}}]),e}(),Te=function(){function e(){oe(this,e),this.elements=new Float32Array([1,0,0,0,1,0,0,0,1])}return re(e,[{key:\"set\",value:function(e,t,n,a,i,l,o,r,s){var y=this.elements;return y[0]=e,y[3]=t,y[6]=n,y[1]=a,y[4]=i,y[7]=l,y[2]=o,y[5]=r,y[8]=s,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,1,0,0,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements,n=this.elements;return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],this}},{key:\"clone\",value:function(){return new this.constructor().fromArray(this.elements)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,a=void 0;for(a=0;9>a;++a)n[a]=e[a+t];return this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,a=void 0;for(a=0;9>a;++a)e[a+t]=n[a];return e}},{key:\"multiplyMatrices\",value:function(e,t){var n=e.elements,a=t.elements,i=this.elements,l=n[0],o=n[3],r=n[6],s=n[1],y=n[4],d=n[7],u=n[2],c=n[5],m=n[8],x=a[0],p=a[3],v=a[6],g=a[1],k=a[4],h=a[7],z=a[2],f=a[5],S=a[8];return i[0]=l*x+o*g+r*z,i[3]=l*p+o*k+r*f,i[6]=l*v+o*h+r*S,i[1]=s*x+y*g+d*z,i[4]=s*p+y*k+d*f,i[7]=s*v+y*h+d*S,i[2]=u*x+c*g+m*z,i[5]=u*p+c*k+m*f,i[8]=u*v+c*h+m*S,this}},{key:\"multiply\",value:function(e){return this.multiplyMatrices(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyMatrices(e,this)}},{key:\"multiplyScalar\",value:function(e){var t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}},{key:\"determinant\",value:function(){var t=this.elements,n=t[0],a=t[1],l=t[2],o=t[3],r=t[4],e=t[5],s=t[6],y=t[7],d=t[8];return n*r*d-n*e*y-a*o*d+a*e*s+l*o*y-l*r*s}},{key:\"getInverse\",value:function(e){var t=e.elements,n=this.elements,a=t[0],i=t[1],l=t[2],o=t[3],r=t[4],s=t[5],y=t[6],d=t[7],u=t[8],c=u*r-s*d,m=s*y-u*o,x=d*o-r*y,p=a*c+i*m+l*x,v=void 0;return 0==p?(console.error(\"Can't invert matrix, determinant is zero\",e),this.identity()):(v=1/p,n[0]=c*v,n[1]=(l*d-u*i)*v,n[2]=(s*i-l*r)*v,n[3]=m*v,n[4]=(u*a-l*y)*v,n[5]=(l*o-s*a)*v,n[6]=x*v,n[7]=(i*y-d*a)*v,n[8]=(r*a-i*o)*v),this}},{key:\"transpose\",value:function(){var e=this.elements,n=void 0;return n=e[1],e[1]=e[3],e[3]=n,n=e[2],e[2]=e[6],e[6]=n,n=e[5],e[5]=e[7],e[7]=n,this}},{key:\"scale\",value:function(e,t){var n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=t,n[4]*=t,n[7]*=t,this}},{key:\"rotate\",value:function(e){var t=ie(e),n=le(e),a=this.elements,i=a[0],l=a[3],o=a[6],r=a[1],s=a[4],y=a[7];return a[0]=t*i+n*r,a[3]=t*l+n*s,a[6]=t*o+n*y,a[1]=-n*i+t*r,a[4]=-n*l+t*s,a[7]=-n*o+t*y,this}},{key:\"translate\",value:function(e,t){var n=this.elements;return n[0]+=e*n[2],n[3]+=e*n[5],n[6]+=e*n[8],n[1]+=t*n[2],n[4]+=t*n[5],n[7]+=t*n[8],this}},{key:\"equals\",value:function(e){var t=this.elements,n=e.elements,a=!0,l=void 0;for(l=0;a&&9>l;++l)t[l]!==n[l]&&(a=!1);return a}}]),e}(),we={XYZ:\"XYZ\",YZX:\"YZX\",ZXY:\"ZXY\",XZY:\"XZY\",YXZ:\"YXZ\",ZYX:\"ZYX\"},Pe=new xe,Ie=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;oe(this,e),this.x=t,this.y=n,this.z=a,this.w=i}var n=Number.EPSILON;return re(e,[{key:\"set\",value:function(e,t,n,a){return this.x=e,this.y=t,this.z=n,this.w=a,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}},{key:\"setFromEuler\",value:function(e){var t=e.x,n=e.y,a=e.z,i=ie,l=le,o=i(t/2),r=i(n/2),s=i(a/2),y=l(t/2),d=l(n/2),u=l(a/2);switch(e.order){case we.XYZ:this.x=y*r*s+o*d*u,this.y=o*d*s-y*r*u,this.z=o*r*u+y*d*s,this.w=o*r*s-y*d*u;break;case we.YXZ:this.x=y*r*s+o*d*u,this.y=o*d*s-y*r*u,this.z=o*r*u-y*d*s,this.w=o*r*s+y*d*u;break;case we.ZXY:this.x=y*r*s-o*d*u,this.y=o*d*s+y*r*u,this.z=o*r*u+y*d*s,this.w=o*r*s-y*d*u;break;case we.ZYX:this.x=y*r*s-o*d*u,this.y=o*d*s+y*r*u,this.z=o*r*u-y*d*s,this.w=o*r*s+y*d*u;break;case we.YZX:this.x=y*r*s+o*d*u,this.y=o*d*s+y*r*u,this.z=o*r*u-y*d*s,this.w=o*r*s-y*d*u;break;case we.XZY:this.x=y*r*s-o*d*u,this.y=o*d*s-y*r*u,this.z=o*r*u+y*d*s,this.w=o*r*s+y*d*u;}return this}},{key:\"setFromAxisAngle\",value:function(e,t){var n=t/2,a=le(n);return this.x=e.x*a,this.y=e.y*a,this.z=e.z*a,this.w=ie(n),this}},{key:\"setFromRotationMatrix\",value:function(e){var t=e.elements,n=t[0],a=t[4],i=t[8],l=t[1],o=t[5],r=t[9],y=t[2],d=t[6],u=t[10],c=n+o+u,m=void 0;return 0<c?(m=.5/ae(c+1),this.w=.25/m,this.x=(d-r)*m,this.y=(i-y)*m,this.z=(l-a)*m):n>o&&n>u?(m=2*ae(1+n-o-u),this.w=(d-r)/m,this.x=.25*m,this.y=(a+l)/m,this.z=(i+y)/m):o>u?(m=2*ae(1+o-n-u),this.w=(i-y)/m,this.x=(a+l)/m,this.y=.25*m,this.z=(r+d)/m):(m=2*ae(1+u-n-o),this.w=(l-a)/m,this.x=(i+y)/m,this.y=(r+d)/m,this.z=.25*m),this}},{key:\"setFromUnitVectors\",value:function(e,t){var n=e.dot(t)+1;return 1e-6>n?(n=0,$(e.x)>$(e.z)?Pe.set(-e.y,e.x,0):Pe.set(0,-e.z,e.y)):Pe.crossVectors(e,t),this.x=Pe.x,this.y=Pe.y,this.z=Pe.z,this.w=n,this.normalize()}},{key:\"invert\",value:function(){return this.conjugate()}},{key:\"conjugate\",value:function(){return this.x*=-1,this.y*=-1,this.z*=-1,this}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return ae(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"normalize\",value:function(){var e=this.length(),t=void 0;return 0===e?(this.x=0,this.y=0,this.z=0,this.w=1):(t=1/e,this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}},{key:\"multiplyQuaternions\",value:function(e,t){var n=e.x,a=e.y,i=e.z,l=e.w,o=t.x,r=t.y,s=t.z,y=t.w;return this.x=n*y+l*o+a*s-i*r,this.y=a*y+l*r+i*o-n*s,this.z=i*y+l*s+n*r-a*o,this.w=l*y-n*o-a*r-i*s,this}},{key:\"multiply\",value:function(e){return this.multiplyQuaternions(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyQuaternions(e,this)}},{key:\"slerp\",value:function(e,a){var t=this.x,i=this.y,l=this.z,o=this.w,r=void 0,y=void 0,d=void 0,u=void 0,c=void 0,m=void 0,x=void 0;return 1===a?this.copy(e):0<a&&(r=o*e.w+t*e.x+i*e.y+l*e.z,0>r?(this.w=-e.w,this.x=-e.x,this.y=-e.y,this.z=-e.z,r=-r):this.copy(e),1<=r?(this.w=o,this.x=t,this.y=i,this.z=l):(y=1-r*r,c=1-a,y<=n?(this.w=c*o+a*this.w,this.x=c*t+a*this.x,this.y=c*i+a*this.y,this.z=c*l+a*this.z,this.normalize()):(d=ae(y),u=H(d,r),m=le(c*u)/d,x=le(a*u)/d,this.w=o*m+this.w*x,this.x=t*m+this.x*x,this.y=i*m+this.y*x,this.z=l*m+this.z*x))),this}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}}],[{key:\"slerp\",value:function(e,n,a,i){return a.copy(e).slerp(n,i)}},{key:\"slerpFlat\",value:function(e,a,i,l,o,r,y){var d=o[r],u=o[r+1],c=o[r+2],m=o[r+3],x=i[l],p=i[l+1],v=i[l+2],g=i[l+3],k=void 0,h=void 0,z=void 0,S=void 0,T=void 0,w=void 0,P=void 0,I=void 0;(g!==m||x!==d||p!==u||v!==c)&&(k=1-y,S=x*d+p*u+v*c+g*m,w=0<=S?1:-1,T=1-S*S,T>n&&(z=ae(T),P=H(z,S*w),k=le(k*P)/z,y=le(y*P)/z),I=y*w,x=x*k+d*I,p=p*k+u*I,v=v*k+c*I,g=g*k+m*I,k===1-y&&(h=1/ae(x*x+p*p+v*v+g*g),x*=h,p*=h,v*=h,g*=h)),e[a]=x,e[a+1]=p,e[a+2]=v,e[a+3]=g}}]),e}(),_e=new Te,m=new Ie,q=function(){function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;oe(this,t),this.x=e,this.y=n,this.z=a,this.order=t.defaultOrder}return re(t,[{key:\"set\",value:function(e,t,n,a){return this.x=e,this.y=t,this.z=n,this.order=a,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.order=t.order,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.order)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.order=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.order,e}},{key:\"toVector3\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return e.set(this.x,this.y,this.z)}},{key:\"setFromRotationMatrix\",value:function(t){var n=Math.asin,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.order,i=t.elements,l=i[0],o=i[4],r=i[8],s=i[1],y=i[5],d=i[9],u=i[2],c=i[6],m=i[10],x=1-1e-5;switch(a){case we.XYZ:{this.y=n(e(r,-1,1)),$(r)<x?(this.x=H(-d,m),this.z=H(-o,l)):(this.x=H(c,y),this.z=0);break}case we.YXZ:{this.x=n(-e(d,-1,1)),$(d)<x?(this.y=H(r,m),this.z=H(s,y)):(this.y=H(-u,l),this.z=0);break}case we.ZXY:{this.x=n(e(c,-1,1)),$(c)<x?(this.y=H(-u,m),this.z=H(-o,y)):(this.y=0,this.z=H(s,l));break}case we.ZYX:{this.y=n(-e(u,-1,1)),$(u)<x?(this.x=H(c,m),this.z=H(s,l)):(this.x=0,this.z=H(-o,y));break}case we.YZX:{this.z=n(e(s,-1,1)),$(s)<x?(this.x=H(-d,y),this.y=H(-u,l)):(this.x=0,this.y=H(r,m));break}case we.XZY:{this.z=n(-e(o,-1,1)),$(o)<x?(this.x=H(c,y),this.y=H(r,l)):(this.x=H(-d,m),this.y=0);break}}return this.order=a,this}},{key:\"setFromQuaternion\",value:function(e,t){return _e.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_e,t)}},{key:\"setFromVector3\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.order;return this.set(e.x,e.y,e.z,t)}},{key:\"reorder\",value:function(e){return m.setFromEuler(this),this.setFromQuaternion(m,e)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.order===this.order}}],[{key:\"defaultOrder\",get:function(){return we.XYZ}}]),t}(),Ce=new xe,a=new xe,b=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe(1,0,0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;oe(this,e),this.normal=t,this.constant=n}return re(e,[{key:\"set\",value:function(e,t){return this.normal.copy(e),this.constant=t,this}},{key:\"setComponents\",value:function(e,t,n,a){return this.normal.set(e,t,n),this.constant=a,this}},{key:\"copy\",value:function(e){return this.normal.copy(e.normal),this.constant=e.constant,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromNormalAndCoplanarPoint\",value:function(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}},{key:\"setFromCoplanarPoints\",value:function(e,t,n){var i=Ce.subVectors(n,t).cross(a.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,Ce),this}},{key:\"normalize\",value:function(){var e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}},{key:\"negate\",value:function(){return this.normal.negate(),this.constant=-this.constant,this}},{key:\"distanceToPoint\",value:function(e){return this.normal.dot(e)+this.constant}},{key:\"distanceToSphere\",value:function(e){return this.distanceToPoint(e.center)-e.radius}},{key:\"projectPoint\",value:function(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}},{key:\"coplanarPoint\",value:function(e){return e.copy(this.normal).multiplyScalar(-this.constant)}},{key:\"translate\",value:function(e){return this.constant-=e.dot(this.normal),this}},{key:\"intersectLine\",value:function(e,n){var a=e.delta(Ce),i=this.normal.dot(a);if(0===i)0===this.distanceToPoint(e.start)&&n.copy(e.start);else{var l=-(e.start.dot(this.normal)+this.constant)/i;0<=l&&1>=l&&n.copy(a).multiplyScalar(l).add(e.start)}return n}},{key:\"intersectsLine\",value:function(e){var t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return 0>t&&0<n||0>n&&0<t}},{key:\"intersectsBox\",value:function(e){return e.intersectsPlane(this)}},{key:\"intersectsSphere\",value:function(e){return e.intersectsPlane(this)}},{key:\"equals\",value:function(e){return e.normal.equals(this.normal)&&e.constant===this.constant}}]),e}(),be=new xe,Ee=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new b,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new b,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:new b,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:new b,l=4<arguments.length&&void 0!==arguments[4]?arguments[4]:new b,o=5<arguments.length&&void 0!==arguments[5]?arguments[5]:new b;oe(this,e),this.planes=[t,n,a,i,l,o]}return re(e,[{key:\"set\",value:function(e,t,n,a,i,l){var o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(a),o[4].copy(i),o[5].copy(l),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"copy\",value:function(e){var t=this.planes,n=void 0;for(n=0;6>n;++n)t[n].copy(e.planes[n]);return this}},{key:\"setFromMatrix\",value:function(e){var t=this.planes,n=e.elements,a=n[0],i=n[1],l=n[2],o=n[3],r=n[4],s=n[5],y=n[6],d=n[7],u=n[8],c=n[9],m=n[10],x=n[11],p=n[12],v=n[13],g=n[14],k=n[15];return t[0].setComponents(o-a,d-r,x-u,k-p).normalize(),t[1].setComponents(o+a,d+r,x+u,k+p).normalize(),t[2].setComponents(o+i,d+s,x+c,k+v).normalize(),t[3].setComponents(o-i,d-s,x-c,k-v).normalize(),t[4].setComponents(o-l,d-y,x-m,k-g).normalize(),t[5].setComponents(o+l,d+y,x+m,k+g).normalize(),this}},{key:\"intersectsSphere\",value:function(e){var t=this.planes,n=e.center,a=-e.radius,l=!0,o=void 0,r=void 0;for(o=0;6>o;++o)if(r=t[o].distanceToPoint(n),r<a){l=!1;break}return l}},{key:\"intersectsBox\",value:function(e){var t=this.planes,n=e.min,a=e.max,l=void 0,o=void 0;for(l=0;6>l;++l)if(o=t[l],be.x=0<o.normal.x?a.x:n.x,be.y=0<o.normal.y?a.y:n.y,be.z=0<o.normal.z?a.z:n.z,0>o.distanceToPoint(be))return!1;return!0}},{key:\"containsPoint\",value:function(e){var t=this.planes,n=!0,a=void 0;for(a=0;6>a;++a)if(0>t[a].distanceToPoint(e)){n=!1;break}return n}}]),e}(),Oe=new xe,De=new xe,qe=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe;oe(this,e),this.start=t,this.end=n}return re(e,[{key:\"set\",value:function(e,t){return this.start.copy(e),this.end.copy(t),this}},{key:\"copy\",value:function(e){return this.start.copy(e.start),this.end.copy(e.end),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return e.addVectors(this.start,this.end).multiplyScalar(.5)}},{key:\"delta\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return e.subVectors(this.end,this.start)}},{key:\"lengthSquared\",value:function(){return this.start.distanceToSquared(this.end)}},{key:\"length\",value:function(){return this.start.distanceTo(this.end)}},{key:\"at\",value:function(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}},{key:\"closestPointToPointParameter\",value:function(e,n){Oe.subVectors(e,this.start),De.subVectors(this.end,this.start);var a=De.dot(De),i=De.dot(Oe),l=n?te(ne(i/a,0),1):i/a;return l}},{key:\"closestPointToPoint\",value:function(e){var n=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:new xe,i=this.closestPointToPointParameter(e,n);return this.delta(a).multiplyScalar(i).add(this.start)}},{key:\"equals\",value:function(e){return e.start.equals(this.start)&&e.end.equals(this.end)}}]),e}(),Ae=new xe,Ve=new xe,Fe=new xe,c=function(){function e(){oe(this,e),this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return re(e,[{key:\"set\",value:function(e,t,n,a,i,l,o,r,s,y,d,u,c,m,x,p){var v=this.elements;return v[0]=e,v[4]=t,v[8]=n,v[12]=a,v[1]=i,v[5]=l,v[9]=o,v[13]=r,v[2]=s,v[6]=y,v[10]=d,v[14]=u,v[3]=c,v[7]=m,v[11]=x,v[15]=p,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements,n=this.elements;return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],this}},{key:\"clone\",value:function(){return new this.constructor().fromArray(this.elements)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,a=void 0;for(a=0;16>a;++a)n[a]=e[a+t];return this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements,a=void 0;for(a=0;16>a;++a)e[a+t]=n[a];return e}},{key:\"getMaxScaleOnAxis\",value:function(){var e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return ae(ne(t,n,a))}},{key:\"copyPosition\",value:function(e){var t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}},{key:\"setPosition\",value:function(e){var t=this.elements;return t[12]=e.x,t[13]=e.y,t[14]=e.z,this}},{key:\"extractBasis\",value:function(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}},{key:\"makeBasis\",value:function(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}},{key:\"extractRotation\",value:function(e){var t=this.elements,n=e.elements,a=1/Ae.setFromMatrixColumn(e,0).length(),i=1/Ae.setFromMatrixColumn(e,1).length(),l=1/Ae.setFromMatrixColumn(e,2).length();return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*l,t[9]=n[9]*l,t[10]=n[10]*l,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}},{key:\"makeRotationFromEuler\",value:function(t){var n=this.elements,i=t.x,l=t.y,o=t.z,r=ie(i),a=le(i),s=ie(l),y=le(l),d=ie(o),e=le(o),u=void 0,c=void 0,m=void 0,x=void 0,p=void 0,v=void 0,g=void 0,k=void 0,h=void 0,z=void 0,f=void 0,S=void 0;switch(t.order){case we.XYZ:{u=r*d,c=r*e,m=a*d,x=a*e,n[0]=s*d,n[4]=-s*e,n[8]=y,n[1]=c+m*y,n[5]=u-x*y,n[9]=-a*s,n[2]=x-u*y,n[6]=m+c*y,n[10]=r*s;break}case we.YXZ:{p=s*d,v=s*e,g=y*d,k=y*e,n[0]=p+k*a,n[4]=g*a-v,n[8]=r*y,n[1]=r*e,n[5]=r*d,n[9]=-a,n[2]=v*a-g,n[6]=k+p*a,n[10]=r*s;break}case we.ZXY:{p=s*d,v=s*e,g=y*d,k=y*e,n[0]=p-k*a,n[4]=-r*e,n[8]=g+v*a,n[1]=v+g*a,n[5]=r*d,n[9]=k-p*a,n[2]=-r*y,n[6]=a,n[10]=r*s;break}case we.ZYX:{u=r*d,c=r*e,m=a*d,x=a*e,n[0]=s*d,n[4]=m*y-c,n[8]=u*y+x,n[1]=s*e,n[5]=x*y+u,n[9]=c*y-m,n[2]=-y,n[6]=a*s,n[10]=r*s;break}case we.YZX:{h=r*s,z=r*y,f=a*s,S=a*y,n[0]=s*d,n[4]=S-h*e,n[8]=f*e+z,n[1]=e,n[5]=r*d,n[9]=-a*d,n[2]=-y*d,n[6]=z*e+f,n[10]=h-S*e;break}case we.XZY:{h=r*s,z=r*y,f=a*s,S=a*y,n[0]=s*d,n[4]=-e,n[8]=y*d,n[1]=h*e+S,n[5]=r*d,n[9]=z*e-f,n[2]=f*e-z,n[6]=a*d,n[10]=S*e+h;break}}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}},{key:\"makeRotationFromQuaternion\",value:function(e){return this.compose(Ae.set(0,0,0),e,Ve.set(1,1,1))}},{key:\"lookAt\",value:function(e,t,n){var a=this.elements,i=Ae,l=Ve,o=Fe;return o.subVectors(e,t),0===o.lengthSquared()&&(o.z=1),o.normalize(),i.crossVectors(n,o),0===i.lengthSquared()&&(1===$(n.z)?o.x+=1e-4:o.z+=1e-4,o.normalize(),i.crossVectors(n,o)),i.normalize(),l.crossVectors(o,i),a[0]=i.x,a[4]=l.x,a[8]=o.x,a[1]=i.y,a[5]=l.y,a[9]=o.y,a[2]=i.z,a[6]=l.z,a[10]=o.z,this}},{key:\"multiplyMatrices\",value:function(e,t){var n=this.elements,a=e.elements,i=t.elements,l=a[0],o=a[4],r=a[8],s=a[12],y=a[1],d=a[5],u=a[9],c=a[13],m=a[2],x=a[6],p=a[10],v=a[14],g=a[3],k=a[7],h=a[11],z=a[15],f=i[0],S=i[4],T=i[8],w=i[12],P=i[1],I=i[5],_=i[9],C=i[13],b=i[2],E=i[6],O=i[10],D=i[14],q=i[3],A=i[7],V=i[11],F=i[15];return n[0]=l*f+o*P+r*b+s*q,n[4]=l*S+o*I+r*E+s*A,n[8]=l*T+o*_+r*O+s*V,n[12]=l*w+o*C+r*D+s*F,n[1]=y*f+d*P+u*b+c*q,n[5]=y*S+d*I+u*E+c*A,n[9]=y*T+d*_+u*O+c*V,n[13]=y*w+d*C+u*D+c*F,n[2]=m*f+x*P+p*b+v*q,n[6]=m*S+x*I+p*E+v*A,n[10]=m*T+x*_+p*O+v*V,n[14]=m*w+x*C+p*D+v*F,n[3]=g*f+k*P+h*b+z*q,n[7]=g*S+k*I+h*E+z*A,n[11]=g*T+k*_+h*O+z*V,n[15]=g*w+k*C+h*D+z*F,this}},{key:\"multiply\",value:function(e){return this.multiplyMatrices(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyMatrices(e,this)}},{key:\"multiplyScalar\",value:function(e){var t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}},{key:\"determinant\",value:function(){var e=this.elements,t=e[0],n=e[4],a=e[8],i=e[12],l=e[1],o=e[5],r=e[9],s=e[13],y=e[2],d=e[6],u=e[10],c=e[14],m=e[3],x=e[7],p=e[11],v=e[15],g=t*o,k=t*r,h=t*s,z=n*l,f=n*r,S=n*s,T=a*l,w=a*o,P=a*s,I=i*l,_=i*o,C=i*r;return m*(C*d-P*d-_*u+S*u+w*c-f*c)+x*(k*c-h*u+I*u-T*c+P*y-C*y)+p*(h*d-g*c-I*d+z*c+_*y-S*y)+v*(-w*y-k*d+g*u+T*d-z*u+f*y)}},{key:\"getInverse\",value:function(e){var t=this.elements,n=e.elements,a=n[0],i=n[1],l=n[2],o=n[3],r=n[4],s=n[5],y=n[6],d=n[7],u=n[8],c=n[9],m=n[10],x=n[11],p=n[12],v=n[13],g=n[14],k=n[15],h=c*g*d-v*m*d+v*y*x-s*g*x-c*y*k+s*m*k,z=p*m*d-u*g*d-p*y*x+r*g*x+u*y*k-r*m*k,f=u*v*d-p*c*d+p*s*x-r*v*x-u*s*k+r*c*k,S=p*c*y-u*v*y-p*s*m+r*v*m+u*s*g-r*c*g,T=a*h+i*z+l*f+o*S,w=void 0;return 0==T?(console.error(\"Can't invert matrix, determinant is zero\",e),this.identity()):(w=1/T,t[0]=h*w,t[1]=(v*m*o-c*g*o-v*l*x+i*g*x+c*l*k-i*m*k)*w,t[2]=(s*g*o-v*y*o+v*l*d-i*g*d-s*l*k+i*y*k)*w,t[3]=(c*y*o-s*m*o-c*l*d+i*m*d+s*l*x-i*y*x)*w,t[4]=z*w,t[5]=(u*g*o-p*m*o+p*l*x-a*g*x-u*l*k+a*m*k)*w,t[6]=(p*y*o-r*g*o-p*l*d+a*g*d+r*l*k-a*y*k)*w,t[7]=(r*m*o-u*y*o+u*l*d-a*m*d-r*l*x+a*y*x)*w,t[8]=f*w,t[9]=(p*c*o-u*v*o-p*i*x+a*v*x+u*i*k-a*c*k)*w,t[10]=(r*v*o-p*s*o+p*i*d-a*v*d-r*i*k+a*s*k)*w,t[11]=(u*s*o-r*c*o-u*i*d+a*c*d+r*i*x-a*s*x)*w,t[12]=S*w,t[13]=(u*v*l-p*c*l+p*i*m-a*v*m-u*i*g+a*c*g)*w,t[14]=(p*s*l-r*v*l-p*i*y+a*v*y+r*i*g-a*s*g)*w,t[15]=(r*c*l-u*s*l+u*i*y-a*c*y-r*i*m+a*s*m)*w),this}},{key:\"transpose\",value:function(){var e=this.elements,n=void 0;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}},{key:\"scale\",value:function(e,t,n){var a=this.elements;return a[0]*=e,a[4]*=t,a[8]*=n,a[1]*=e,a[5]*=t,a[9]*=n,a[2]*=e,a[6]*=t,a[10]*=n,a[3]*=e,a[7]*=t,a[11]*=n,this}},{key:\"makeScale\",value:function(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}},{key:\"makeTranslation\",value:function(e,t,n){return this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}},{key:\"makeRotationX\",value:function(e){var t=ie(e),n=le(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}},{key:\"makeRotationY\",value:function(e){var t=ie(e),n=le(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}},{key:\"makeRotationZ\",value:function(e){var t=ie(e),n=le(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}},{key:\"makeRotationAxis\",value:function(e,n){var a=ie(n),i=le(n),l=1-a,t=e.x,o=e.y,r=e.z,s=l*t,y=l*o;return this.set(s*t+a,s*o-i*r,s*r+i*o,0,s*o+i*r,y*o+a,y*r-i*t,0,s*r-i*o,y*r+i*t,l*r*r+a,0,0,0,0,1),this}},{key:\"makeShear\",value:function(e,t,n){return this.set(1,t,n,0,e,1,n,0,e,t,1,0,0,0,0,1),this}},{key:\"compose\",value:function(e,t,n){var a=this.elements,i=t.x,l=t.y,o=t.z,r=t.w,s=i+i,y=l+l,d=o+o,u=i*s,c=i*y,m=i*d,x=l*y,p=l*d,v=o*d,g=r*s,k=r*y,h=r*d,z=n.x,f=n.y,S=n.z;return a[0]=(1-(x+v))*z,a[1]=(c+h)*z,a[2]=(m-k)*z,a[3]=0,a[4]=(c-h)*f,a[5]=(1-(u+v))*f,a[6]=(p+g)*f,a[7]=0,a[8]=(m+k)*S,a[9]=(p-g)*S,a[10]=(1-(u+x))*S,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}},{key:\"decompose\",value:function(e,t,n){var a=this.elements,i=a[0],l=a[1],o=a[2],r=a[4],s=a[5],y=a[6],d=a[8],u=a[9],c=a[10],m=this.determinant(),x=Ae.set(i,l,o).length()*(0>m?-1:1),p=Ae.set(r,s,y).length(),v=Ae.set(d,u,c).length(),g=1/x,k=1/p,h=1/v;return e.x=a[12],e.y=a[13],e.z=a[14],a[0]*=g,a[1]*=g,a[2]*=g,a[4]*=k,a[5]*=k,a[6]*=k,a[8]*=h,a[9]*=h,a[10]*=h,t.setFromRotationMatrix(this),a[0]=i,a[1]=l,a[2]=o,a[4]=r,a[5]=s,a[6]=y,a[8]=d,a[9]=u,a[10]=c,n.x=x,n.y=p,n.z=v,this}},{key:\"makePerspective\",value:function(e,t,n,a,i,l){var o=this.elements;return o[0]=2*i/(t-e),o[4]=0,o[8]=(t+e)/(t-e),o[12]=0,o[1]=0,o[5]=2*i/(n-a),o[9]=(n+a)/(n-a),o[13]=0,o[2]=0,o[6]=0,o[10]=-(l+i)/(l-i),o[14]=-2*l*i/(l-i),o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}},{key:\"makeOrthographic\",value:function(e,t,n,a,i,l){var o=this.elements,r=1/(t-e),s=1/(n-a),y=1/(l-i);return o[0]=2*r,o[4]=0,o[8]=0,o[12]=-((t+e)*r),o[1]=0,o[5]=2*s,o[9]=0,o[13]=-((n+a)*s),o[2]=0,o[6]=0,o[10]=-2*y,o[14]=-((l+i)*y),o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}},{key:\"equals\",value:function(e){var t=this.elements,n=e.elements,a=!0,l=void 0;for(l=0;a&&16>l;++l)t[l]!==n[l]&&(a=!1);return a}}]),e}(),Be=[new xe,new xe,new xe,new xe],Ne=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe;oe(this,e),this.origin=t,this.direction=n}return re(e,[{key:\"set\",value:function(e,t){return this.origin.copy(e),this.direction.copy(t),this}},{key:\"copy\",value:function(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"at\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe;return t.copy(this.direction).multiplyScalar(e).add(this.origin)}},{key:\"lookAt\",value:function(e){return this.direction.copy(e).sub(this.origin).normalize(),this}},{key:\"recast\",value:function(e){return this.origin.copy(this.at(e,Be[0])),this}},{key:\"closestPointToPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe,n=t.subVectors(e,this.origin).dot(this.direction);return 0<=n?t.copy(this.direction).multiplyScalar(n).add(this.origin):t.copy(this.origin)}},{key:\"distanceSquaredToPoint\",value:function(e){var t=Be[0].subVectors(e,this.origin).dot(this.direction);return 0>t?this.origin.distanceToSquared(e):Be[0].copy(this.direction).multiplyScalar(t).add(this.origin).distanceToSquared(e)}},{key:\"distanceToPoint\",value:function(e){return ae(this.distanceSquaredToPoint(e))}},{key:\"distanceToPlane\",value:function(e){var n=e.normal.dot(this.direction),a=0===n?0===e.distanceToPoint(this.origin)?0:-1:-(this.origin.dot(e.normal)+e.constant)/n;return 0<=a?a:null}},{key:\"distanceSquaredToSegment\",value:function(e,t,n,a){var i=Be[0].copy(e).add(t).multiplyScalar(.5),l=Be[1].copy(t).sub(e).normalize(),o=Be[2].copy(this.origin).sub(i),r=.5*e.distanceTo(t),s=-this.direction.dot(l),y=o.dot(this.direction),d=-o.dot(l),u=o.lengthSq(),c=$(1-s*s),m=void 0,x=void 0,p=void 0,v=void 0,g=void 0;return 0<c?(m=s*d-y,x=s*y-d,p=r*c,0<=m?x>=-p?x<=p?(v=1/c,m*=v,x*=v,g=m*(m+s*x+2*y)+x*(s*m+x+2*d)+u):(x=r,m=ne(0,-(s*x+y)),g=-m*m+x*(x+2*d)+u):(x=-r,m=ne(0,-(s*x+y)),g=-m*m+x*(x+2*d)+u):x<=-p?(m=ne(0,-(-s*r+y)),x=0<m?-r:te(ne(-r,-d),r),g=-m*m+x*(x+2*d)+u):x<=p?(m=0,x=te(ne(-r,-d),r),g=x*(x+2*d)+u):(m=ne(0,-(s*r+y)),x=0<m?r:te(ne(-r,-d),r),g=-m*m+x*(x+2*d)+u)):(x=0<s?-r:r,m=ne(0,-(s*x+y)),g=-m*m+x*(x+2*d)+u),void 0!==n&&n.copy(this.direction).multiplyScalar(m).add(this.origin),void 0!==a&&a.copy(l).multiplyScalar(x).add(i),g}},{key:\"intersectSphere\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe,n=Be[0].subVectors(e.center,this.origin),a=n.dot(this.direction),i=n.dot(n)-a*a,l=e.radius*e.radius,o=null,r=void 0,s=void 0,y=void 0;return i<=l&&(r=ae(l-i),s=a-r,y=a+r,(0<=s||0<=y)&&(o=0>s?this.at(y,t):this.at(s,t))),o}},{key:\"intersectsSphere\",value:function(e){return this.distanceToPoint(e.center)<=e.radius}},{key:\"intersectPlane\",value:function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe,a=this.distanceToPlane(e);return null===a?null:this.at(a,n)}},{key:\"intersectsPlane\",value:function(e){var t=e.distanceToPoint(this.origin);return 0===t||0>e.normal.dot(this.direction)*t}},{key:\"intersectBox\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe,n=this.origin,a=this.direction,i=e.min,l=e.max,o=1/a.x,r=1/a.y,s=1/a.z,y=null,d=void 0,u=void 0,c=void 0,m=void 0,x=void 0,p=void 0;return 0<=o?(d=(i.x-n.x)*o,u=(l.x-n.x)*o):(d=(l.x-n.x)*o,u=(i.x-n.x)*o),0<=r?(c=(i.y-n.y)*r,m=(l.y-n.y)*r):(c=(l.y-n.y)*r,m=(i.y-n.y)*r),d<=m&&c<=u&&((c>d||d!=d)&&(d=c),(m<u||u!=u)&&(u=m),0<=s?(x=(i.z-n.z)*s,p=(l.z-n.z)*s):(x=(l.z-n.z)*s,p=(i.z-n.z)*s),d<=p&&x<=u&&((x>d||d!=d)&&(d=x),(p<u||u!=u)&&(u=p),0<=u&&(y=this.at(0<=d?d:u,t)))),y}},{key:\"intersectsBox\",value:function(e){return null!==this.intersectBox(e,Be[0])}},{key:\"intersectTriangle\",value:function(e,t,n,a,i){var l=this.direction,o=Be[0],r=Be[1],s=Be[2],y=Be[3],d=null,u=void 0,c=void 0,m=void 0,x=void 0,p=void 0;return r.subVectors(t,e),s.subVectors(n,e),y.crossVectors(r,s),u=l.dot(y),0===u||a&&0<u||(0<u?c=1:(c=-1,u=-u),o.subVectors(this.origin,e),m=c*l.dot(s.crossVectors(o,s)),0<=m&&(x=c*l.dot(r.cross(o)),0<=x&&m+x<=u&&(p=-c*o.dot(y),0<=p&&(d=this.at(p/u,i))))),d}},{key:\"applyMatrix4\",value:function(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}},{key:\"equals\",value:function(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}}]),e}(),Le=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;oe(this,e),this.radius=t,this.phi=n,this.theta=a}return re(e,[{key:\"set\",value:function(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}},{key:\"copy\",value:function(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromVector3\",value:function(e){return this.radius=e.length(),0===this.radius?(this.theta=0,this.phi=0):(this.theta=H(e.x,e.z),this.phi=ee(te(ne(e.y/this.radius,-1),1))),this.makeSafe()}},{key:\"makeSafe\",value:function(){return this.phi=ne(1e-6,te(G-1e-6,this.phi)),this}}]),e}(),Re=function(){function e(){oe(this,e),this.elements=new Float32Array([1,0,0,1,0,1])}return re(e,[{key:\"set\",value:function(t,n,a,i,l,o){var r=this.elements;return r[0]=t,r[1]=n,r[3]=i,r[2]=a,r[4]=l,r[5]=o,this}},{key:\"identity\",value:function(){return this.set(1,0,0,1,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements;return this.set(t[0],t[1],t[2],t[3],t[4],t[5]),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"toMatrix3\",value:function(e){var t=e.elements;e.set(t[0],t[1],t[2],t[1],t[3],t[4],t[2],t[4],t[5])}},{key:\"add\",value:function(e){var t=this.elements,n=e.elements;return t[0]+=n[0],t[1]+=n[1],t[3]+=n[3],t[2]+=n[2],t[4]+=n[4],t[5]+=n[5],this}},{key:\"norm\",value:function(){var t=this.elements,e=t[1]*t[1],n=t[2]*t[2],a=t[4]*t[4];return ae(t[0]*t[0]+e+n+e+t[3]*t[3]+a+n+a+t[5]*t[5])}},{key:\"off\",value:function(){var t=this.elements;return ae(2*(t[1]*t[1]+t[2]*t[2]+t[4]*t[4]))}},{key:\"applyToVector3\",value:function(t){var n=t.x,a=t.y,i=t.z,l=this.elements;return t.x=l[0]*n+l[1]*a+l[2]*i,t.y=l[1]*n+l[3]*a+l[4]*i,t.z=l[2]*n+l[4]*a+l[5]*i,t}},{key:\"equals\",value:function(e){var t=this.elements,n=e.elements,a=!0,l=void 0;for(l=0;a&&6>l;++l)t[l]!==n[l]&&(a=!1);return a}}],[{key:\"calculateIndex\",value:function(e,t){return 3-(3-e)*(2-e)/2+t}}]),e}(),Ye=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;oe(this,e),this.x=t,this.y=n,this.z=a,this.w=i}return re(e,[{key:\"set\",value:function(e,t,n,a){return this.x=e,this.y=t,this.z=n,this.w=a,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}},{key:\"setAxisAngleFromQuaternion\",value:function(e){this.w=2*ee(e.w);var t=ae(1-e.w*e.w);return 1e-4>t?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}},{key:\"setAxisAngleFromRotationMatrix\",value:function(e){var t=.01,n=.1,a=e.elements,i=a[0],l=a[4],o=a[8],r=a[1],d=a[5],u=a[9],c=a[2],m=a[6],p=a[10],v=void 0,g=void 0,k=void 0,h=void 0,f=void 0,S=void 0,T=void 0,w=void 0,P=void 0,I=void 0,_=void 0;return $(l-r)<t&&$(o-c)<t&&$(u-m)<t?$(l+r)<n&&$(o+c)<n&&$(u+m)<n&&$(i+d+p-3)<n?this.set(1,0,0,0):(v=G,f=(i+1)/2,S=(d+1)/2,T=(p+1)/2,w=(l+r)/4,P=(o+c)/4,I=(u+m)/4,f>S&&f>T?f<t?(g=0,k=.707106781,h=.707106781):(g=ae(f),k=w/g,h=P/g):S>T?S<t?(g=.707106781,k=0,h=.707106781):(k=ae(S),g=w/k,h=I/k):T<t?(g=.707106781,k=.707106781,h=0):(h=ae(T),g=P/h,k=I/h),this.set(g,k,h,v)):(_=ae((m-u)*(m-u)+(o-c)*(o-c)+(r-l)*(r-l)),.001>$(_)&&(_=1),this.x=(m-u)/_,this.y=(o-c)/_,this.z=(r-l)/_,this.w=ee((i+d+p-1)/2)),this}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}},{key:\"multiplyVectors\",value:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this.w=e.w*t.w,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this.z/=e,this.w/=e,this}},{key:\"applyMatrix4\",value:function(t){var n=this.x,a=this.y,i=this.z,l=this.w,o=t.elements;return this.x=o[0]*n+o[4]*a+o[8]*i+o[12]*l,this.y=o[1]*n+o[5]*a+o[9]*i+o[13]*l,this.z=o[2]*n+o[6]*a+o[10]*i+o[14]*l,this.w=o[3]*n+o[7]*a+o[11]*i+o[15]*l,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}},{key:\"manhattanLength\",value:function(){return $(this.x)+$(this.y)+$(this.z)+$(this.w)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return ae(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"manhattanDistanceTo\",value:function(e){return $(this.x-e.x)+$(this.y-e.y)+$(this.z-e.z)+$(this.w-e.w)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,n=this.y-e.y,a=this.z-e.z,i=this.w-e.w;return t*t+n*n+a*a+i*i}},{key:\"distanceTo\",value:function(e){return ae(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=te(this.x,e.x),this.y=te(this.y,e.y),this.z=te(this.z,e.z),this.w=te(this.w,e.w),this}},{key:\"max\",value:function(e){return this.x=ne(this.x,e.x),this.y=ne(this.y,e.y),this.z=ne(this.z,e.z),this.w=ne(this.w,e.w),this}},{key:\"clamp\",value:function(e,t){return this.x=ne(e.x,te(t.x,this.x)),this.y=ne(e.y,te(t.y,this.y)),this.z=ne(e.z,te(t.z,this.z)),this.w=ne(e.w,te(t.w,this.w)),this}},{key:\"floor\",value:function(){return this.x=W(this.x),this.y=W(this.y),this.z=W(this.z),this.w=W(this.w),this}},{key:\"ceil\",value:function(){return this.x=K(this.x),this.y=K(this.y),this.z=K(this.z),this.w=K(this.w),this}},{key:\"round\",value:function(){return this.x=J(this.x),this.y=J(this.y),this.z=J(this.z),this.w=J(this.w),this}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}},{key:\"lerpVectors\",value:function(e,t,n){return this.subVectors(t,e).multiplyScalar(n).add(e)}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}}]),e}(),Me=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1];oe(this,e),this.value=t,this.done=n}return re(e,[{key:\"reset\",value:function(){this.value=null,this.done=!1}}]),e}(),Xe=new xe,Ze=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe;oe(this,e),this.min=t,this.max=n,this.children=null}return re(e,[{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getDimensions\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return e.subVectors(this.max,this.min)}},{key:\"split\",value:function(){var e=this.min,t=this.max,n=this.getCenter(Xe),a=this.children=[null,null,null,null,null,null,null,null],l=void 0,o=void 0;for(l=0;8>l;++l)o=je[l],a[l]=new this.constructor(new xe(0===o[0]?e.x:n.x,0===o[1]?e.y:n.y,0===o[2]?e.z:n.z),new xe(0===o[0]?n.x:t.x,0===o[1]?n.y:t.y,0===o[2]?n.z:t.z))}}]),e}(),je=[new Uint8Array([0,0,0]),new Uint8Array([0,0,1]),new Uint8Array([0,1,0]),new Uint8Array([0,1,1]),new Uint8Array([1,0,0]),new Uint8Array([1,0,1]),new Uint8Array([1,1,0]),new Uint8Array([1,1,1])],Ue=[new Uint8Array([0,4]),new Uint8Array([1,5]),new Uint8Array([2,6]),new Uint8Array([3,7]),new Uint8Array([0,2]),new Uint8Array([1,3]),new Uint8Array([4,6]),new Uint8Array([5,7]),new Uint8Array([0,1]),new Uint8Array([2,3]),new Uint8Array([4,5]),new Uint8Array([6,7])],Qe=new xe,Ge=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;oe(this,e),this.min=t,this.size=n,this.children=null}return re(e,[{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return e.copy(this.min).addScalar(.5*this.size)}},{key:\"getDimensions\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return e.set(this.size,this.size,this.size)}},{key:\"split\",value:function(){var e=this.min,t=this.getCenter(Qe),n=.5*this.size,a=this.children=[null,null,null,null,null,null,null,null],l=void 0,o=void 0;for(l=0;8>l;++l)o=je[l],a[l]=new this.constructor(new xe(0===o[0]?e.x:t.x,0===o[1]?e.y:t.y,0===o[2]?e.z:t.z),n)}},{key:\"max\",get:function(){return this.min.clone().addScalar(this.size)}}]),e}(),He=new v,Je=function(){function e(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;oe(this,e),this.octree=t,this.region=n,this.cull=null!==n,this.result=new Me,this.trace=null,this.indices=null,this.reset()}return re(e,[{key:\"reset\",value:function(){var e=this.octree.root;return this.trace=[],this.indices=[],null!==e&&(He.min=e.min,He.max=e.max,(!this.cull||this.region.intersectsBox(He))&&(this.trace.push(e),this.indices.push(0))),this.result.reset(),this}},{key:\"next\",value:function(){for(var e=this.cull,t=this.region,n=this.indices,a=this.trace,i=null,l=a.length-1,o=void 0,r=void 0,s=void 0;null===i&&0<=l;)if(o=n[l]++,r=a[l].children,!(8>o))a.pop(),n.pop(),--l;else if(null!==r){if(s=r[o],e&&(He.min=s.min,He.max=s.max,!t.intersectsBox(He)))continue;a.push(s),n.push(0),++l}else i=a.pop(),n.pop();return this.result.value=i,this.result.done=null===i,this.result}},{key:\"return\",value:function(e){return this.result.value=e,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),e}(),Ke=[new xe,new xe,new xe],We=new v,$e=new Ne,r=[new Uint8Array([4,2,1]),new Uint8Array([5,3,8]),new Uint8Array([6,8,3]),new Uint8Array([7,8,8]),new Uint8Array([8,6,5]),new Uint8Array([8,7,8]),new Uint8Array([8,8,7]),new Uint8Array([8,8,8])],et=0,tt=function(){function e(){oe(this,e)}return re(e,null,[{key:\"intersectOctree\",value:function(e,t,n){var a=We.min.set(0,0,0),l=We.max.subVectors(e.max,e.min),o=e.getDimensions(Ke[0]),r=Ke[1].copy(o).multiplyScalar(.5),s=$e.origin.copy(t.ray.origin),y=$e.direction.copy(t.ray.direction),d=void 0,u=void 0,c=void 0,m=void 0,x=void 0,p=void 0,v=void 0,g=void 0,k=void 0;s.sub(e.getCenter(Ke[2])).add(r),et=0,0>y.x&&(s.x=o.x-s.x,y.x=-y.x,et|=4),0>y.y&&(s.y=o.y-s.y,y.y=-y.y,et|=2),0>y.z&&(s.z=o.z-s.z,y.z=-y.z,et|=1),d=1/y.x,u=1/y.y,c=1/y.z,m=(a.x-s.x)*d,x=(l.x-s.x)*d,p=(a.y-s.y)*u,v=(l.y-s.y)*u,g=(a.z-s.z)*c,k=(l.z-s.z)*c,ne(ne(m,p),g)<te(te(x,v),k)&&i(e.root,m,p,g,x,v,k,t,n)}}]),e}(),nt=new v,at=function(){function e(t,n){oe(this,e),this.root=void 0!==t&&void 0!==n?new Ze(t,n):null}return re(e,[{key:\"getCenter\",value:function(e){return this.root.getCenter(e)}},{key:\"getDimensions\",value:function(e){return this.root.getDimensions(e)}},{key:\"getDepth\",value:function(){return o(this.root)}},{key:\"cull\",value:function(e){var t=[];return s(this.root,e,t),t}},{key:\"findOctantsByLevel\",value:function(e){var t=[];return y(this.root,e,0,t),t}},{key:\"raycast\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];return tt.intersectOctree(this,e,t),t}},{key:\"leaves\",value:function(e){return new Je(this,e)}},{key:Symbol.iterator,value:function(){return new Je(this)}},{key:\"min\",get:function(){return this.root.min}},{key:\"max\",get:function(){return this.root.max}},{key:\"children\",get:function(){return this.root.children}}]),e}(),it=new xe,p=function(e){function t(e,n){oe(this,t);var a=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return a.points=null,a.data=null,a}return ye(t,e),re(t,[{key:\"distanceToSquared\",value:function(e){var t=it.copy(e).clamp(this.min,this.max);return t.sub(e).lengthSquared()}},{key:\"distanceToCenterSquared\",value:function(e){var t=this.getCenter(it),n=e.x-t.x,a=e.y-t.x,i=e.z-t.z;return n*n+a*a+i*i}},{key:\"contains\",value:function(e,t){var n=this.min,a=this.max;return e.x>=n.x-t&&e.y>=n.y-t&&e.z>=n.z-t&&e.x<=a.x+t&&e.y<=a.y+t&&e.z<=a.z+t}},{key:\"redistribute\",value:function(e){var t=this.children,n=this.points,a=this.data,l=void 0,o=void 0,r=void 0,s=void 0,y=void 0,d=void 0,u=void 0;if(null!==t&&null!==n)for(l=0,r=n.length;l<r;++l)for(d=n[l],u=a[l],(o=0,s=t.length);o<s;++o)if(y=t[o],y.contains(d,e)){null===y.points&&(y.points=[],y.data=[]),y.points.push(d),y.data.push(u);break}this.points=null,this.data=null}},{key:\"merge\",value:function(){var e=this.children,t=void 0,n=void 0,a=void 0;if(null!==e){for(this.points=[],this.data=[],(t=0,n=e.length);t<n;++t)if(a=e[t],null!==a.points){var o,r;(o=this.points).push.apply(o,ce(a.points)),(r=this.data).push.apply(r,ce(a.data))}this.children=null}}}]),t}(Ze),lt=function e(t,n,a){var i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;oe(this,e),this.distance=t,this.distanceToRay=n,this.point=a,this.object=i},ot=1e-6,rt=function(e){function t(e,n){var a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:8,l=4<arguments.length&&void 0!==arguments[4]?arguments[4]:8;oe(this,t);var o=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return o.root=new p(e,n),o.bias=ne(0,a),o.maxPoints=ne(1,J(i)),o.maxDepth=ne(0,J(l)),o.pointCount=0,o}return ye(t,e),re(t,[{key:\"countPoints\",value:function(e){return d(e)}},{key:\"put\",value:function(e,t){return x(e,t,this,this.root,0)}},{key:\"remove\",value:function(e){return g(e,this,this.root,null)}},{key:\"fetch\",value:function(e){return k(e,this,this.root)}},{key:\"move\",value:function(e,t){return h(e,t,this,this.root,null,0)}},{key:\"findNearestPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:1/0,n=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2];return z(e,t,n,this.root)}},{key:\"findPoints\",value:function(e,t){var n=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2],a=[];return f(e,t,n,this.root,a),a}},{key:\"raycast\",value:function(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],a=se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"raycast\",this).call(this,e);return 0<a.length&&this.testPoints(a,e,n),n}},{key:\"testPoints\",value:function(e,t,n){var a=t.params.Points.threshold,l=void 0,o=void 0,r=void 0,s=void 0,y=void 0,d=void 0,u=void 0,c=void 0,m=void 0,x=void 0,p=void 0;for(y=0,u=e.length;y<u;++y)if(m=e[y],x=m.points,null!==x)for(d=0,c=x.length;d<c;++d)p=x[d],s=t.ray.distanceSqToPoint(p),s<a*a&&(l=t.ray.closestPointToPoint(p,new xe),o=t.ray.origin.distanceTo(l),o>=t.near&&o<=t.far&&(r=ae(s),n.push(new lt(o,r,l,m.data[d]))))}}]),t}(at),st=new v,yt=new xe,dt=new xe,u=new xe,ut=function(){function e(){oe(this,e)}return re(e,null,[{key:\"recycleOctants\",value:function(e,t){var n=e.min,a=e.getCenter(dt),o=e.getDimensions(u).multiplyScalar(.5),r=e.children,s=t.length,l=void 0,y=void 0,d=void 0,c=void 0;for(l=0;8>l;++l)for(d=je[l],st.min.addVectors(n,yt.fromArray(d).multiply(o)),st.max.addVectors(a,yt.fromArray(d).multiply(o)),y=0;y<s;++y)if(c=t[y],null!==c&&st.min.equals(c.min)&&st.max.equals(c.max)){r[l]=c,t[y]=null;break}}}]),e}(),ct=new xe,mt=new xe,xt=new xe,pt=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe;oe(this,e),this.a=t,this.b=n,this.index=-1,this.coordinates=new xe,this.t=0,this.n=new xe}return re(e,[{key:\"approximateZeroCrossing\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:8,n=ne(1,t-1),l=0,o=1,r=0,s=0,y=void 0,d=void 0;for(ct.subVectors(this.b,this.a);s<=n&&(r=(l+o)/2,mt.addVectors(this.a,xt.copy(ct).multiplyScalar(r)),d=e.sample(mt),!(1e-4>=$(d)||1e-6>=(o-l)/2));)mt.addVectors(this.a,xt.copy(ct).multiplyScalar(l)),y=e.sample(mt),Q(d)===Q(y)?l=r:o=r,++s;this.t=r}},{key:\"computeZeroCrossingPosition\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new xe;return e.subVectors(this.b,this.a).multiplyScalar(this.t).add(this.a)}},{key:\"computeSurfaceNormal\",value:function(e){var t=this.computeZeroCrossingPosition(ct),n=1e-3,a=e.sample(mt.addVectors(t,xt.set(n,0,0)))-e.sample(mt.subVectors(t,xt.set(n,0,0))),i=e.sample(mt.addVectors(t,xt.set(0,n,0)))-e.sample(mt.subVectors(t,xt.set(0,n,0))),l=e.sample(mt.addVectors(t,xt.set(0,0,n)))-e.sample(mt.subVectors(t,xt.set(0,0,n)));this.n.set(a,i,l).normalize()}}]),e}(),vt=new pt,gt=new xe,kt=new xe,ht=function(){function e(t,n,a){var i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0,l=4<arguments.length&&void 0!==arguments[4]?arguments[4]:3;oe(this,e),this.edgeData=t,this.cellPosition=n,this.cellSize=a,this.indices=null,this.zeroCrossings=null,this.normals=null,this.axes=null,this.lengths=null,this.result=new Me,this.initialC=i,this.c=i,this.initialD=l,this.d=l,this.i=0,this.l=0,this.reset()}return re(e,[{key:\"reset\",value:function(){var e=this.edgeData,t=[],n=[],i=[],o=[],r=[],s=void 0,y=void 0,u=void 0,m=void 0;for(this.i=0,this.c=0,this.d=0,(y=this.initialC,s=4>>y,u=this.initialD);y<u;++y,s>>=1)m=e.indices[y].length,0<m&&(t.push(e.indices[y]),n.push(e.zeroCrossings[y]),i.push(e.normals[y]),o.push(je[s]),r.push(m),++this.d);return this.l=0<r.length?r[0]:0,this.indices=t,this.zeroCrossings=n,this.normals=i,this.axes=o,this.lengths=r,this.result.reset(),this}},{key:\"next\",value:function(){var e=this.cellSize,t=this.edgeData.resolution,n=t+1,a=n*n,l=this.result,o=this.cellPosition,r=void 0,s=void 0,d=void 0,u=void 0,m=void 0,p=void 0,v=void 0;return this.i===this.l&&(this.l=++this.c<this.d?this.lengths[this.c]:0,this.i=0),this.i<this.l?(p=this.c,v=this.i,r=this.axes[p],s=this.indices[p][v],vt.index=s,d=s%n,u=U(s%a/n),m=U(s/a),vt.coordinates.set(d,u,m),gt.set(d*e/t,u*e/t,m*e/t),kt.set((d+r[0])*e/t,(u+r[1])*e/t,(m+r[2])*e/t),vt.a.addVectors(o,gt),vt.b.addVectors(o,kt),vt.t=this.zeroCrossings[p][v],vt.n.fromArray(this.normals[p],3*v),l.value=vt,++this.i):(l.value=null,l.done=!0),l}},{key:\"return\",value:function(e){return this.result.value=e,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),e}(),zt=function(){function e(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:n,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:n;oe(this,e),this.resolution=t,this.indices=0>=n?null:[new Uint32Array(n),new Uint32Array(a),new Uint32Array(i)],this.zeroCrossings=0>=n?null:[new Float32Array(n),new Float32Array(a),new Float32Array(i)],this.normals=0>=n?null:[new Float32Array(3*n),new Float32Array(3*a),new Float32Array(3*i)]}return re(e,[{key:\"serialize\",value:function(){return{resolution:this.resolution,edges:this.edges,zeroCrossings:this.zeroCrossings,normals:this.normals}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.resolution=e.resolution,this.edges=e.edges,this.zeroCrossings=e.zeroCrossings,this.normals=e.normals),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=[this.edges[0],this.edges[1],this.edges[2],this.zeroCrossings[0],this.zeroCrossings[1],this.zeroCrossings[2],this.normals[0],this.normals[1],this.normals[2]],n=void 0,a=void 0,o=void 0;for(a=0,o=t.length;a<o;++a)n=t[a],null!==n&&e.push(n.buffer);return e}},{key:\"edges\",value:function(e,t){return new ht(this,e,t)}},{key:\"edgesX\",value:function(e,t){return new ht(this,e,t,0,1)}},{key:\"edgesY\",value:function(e,t){return new ht(this,e,t,1,2)}},{key:\"edgesZ\",value:function(e,t){return new ht(this,e,t,2,3)}}],[{key:\"calculate1DEdgeCount\",value:function(e){return j(e+1,2)*e}}]),e}(),ft={AIR:0,SOLID:1},St=0,Tt=0,wt=0,Pt=function(){function e(){var t=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];oe(this,e),this.materials=0,this.materialIndices=t?new Uint8Array(wt):null,this.runLengths=null,this.edgeData=null}return re(e,[{key:\"set\",value:function(e){return this.materials=e.materials,this.materialIndices=e.materialIndices,this.runLengths=e.runLengths,this.edgeData=e.edgeData,this}},{key:\"clear\",value:function(){return this.materials=0,this.materialIndices=null,this.runLengths=null,this.edgeData=null,this}},{key:\"setMaterialIndex\",value:function(e,t){this.materialIndices[e]===ft.AIR?t!==ft.AIR&&++this.materials:t===ft.AIR&&--this.materials,this.materialIndices[e]=t}},{key:\"compress\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this,t=void 0;return this.compressed?(e.materialIndices=this.materialIndices,e.runLengths=this.runLengths):(t=this.full?new me([this.materialIndices.length],[ft.SOLID]):me.encode(this.materialIndices),e.materialIndices=new Uint8Array(t.data),e.runLengths=new Uint32Array(t.runLengths)),e.materials=this.materials,e}},{key:\"decompress\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this;return e.materialIndices=this.compressed?me.decode(this.runLengths,this.materialIndices,new Uint8Array(wt)):this.materialIndices,e.runLengths=null,e.materials=this.materials,e}},{key:\"serialize\",value:function(){return{materials:this.materials,materialIndices:this.materialIndices,runLengths:this.runLengths,edgeData:null===this.edgeData?null:this.edgeData.serialize()}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.materials=e.materials,this.materialIndices=e.materialIndices,this.runLengths=e.runLengths,null===e.edgeData?this.edgeData=null:(null===this.edgeData&&(this.edgeData=new zt(Tt)),this.edgeData.deserialize(e.edgeData))),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return null!==this.edgeData&&this.edgeData.createTransferList(e),null!==this.materialIndices&&e.push(this.materialIndices.buffer),null!==this.runLengths&&e.push(this.runLengths.buffer),e}},{key:\"empty\",get:function(){return 0===this.materials}},{key:\"full\",get:function(){return this.materials===wt}},{key:\"compressed\",get:function(){return null!==this.runLengths}},{key:\"neutered\",get:function(){return!this.empty&&null===this.materialIndices}}],[{key:\"isovalue\",get:function(){return St},set:function(e){St=e}},{key:\"resolution\",get:function(){return Tt},set:function(e){e=j(2,ne(0,K(Math.log2(e)))),Tt=ne(1,te(256,e)),wt=j(Tt+1,3)}}]),e}(),It=function(){function e(){oe(this,e),this.ata=new Re,this.ata.set(0,0,0,0,0,0),this.atb=new xe,this.massPointSum=new xe,this.numPoints=0}return re(e,[{key:\"set\",value:function(e,t,n,a){return this.ata.copy(e),this.atb.copy(t),this.massPointSum.copy(n),this.numPoints=a,this}},{key:\"copy\",value:function(e){return this.set(e.ata,e.atb,e.massPointSum,e.numPoints)}},{key:\"add\",value:function(e,t){var n=t.x,a=t.y,i=t.z,l=e.dot(t),o=this.ata.elements,r=this.atb;o[0]+=n*n,o[1]+=n*a,o[3]+=a*a,o[2]+=n*i,o[4]+=a*i,o[5]+=i*i,r.x+=l*n,r.y+=l*a,r.z+=l*i,this.massPointSum.add(e),++this.numPoints}},{key:\"addData\",value:function(e){this.ata.add(e.ata),this.atb.add(e.atb),this.massPointSum.add(e.massPointSum),this.numPoints+=e.numPoints}},{key:\"clear\",value:function(){this.ata.set(0,0,0,0,0,0),this.atb.set(0,0,0),this.massPointSum.set(0,0,0),this.numPoints=0}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}}]),e}(),_t=new he,Ct=function(){function e(){oe(this,e)}return re(e,null,[{key:\"calculateCoefficients\",value:function(e,t,n){var a,i,l;return 0===t?(_t.x=1,_t.y=0):(a=(n-e)/(2*t),i=ae(1+a*a),l=1/(0<=a?a+i:a-i),_t.x=1/ae(1+l*l),_t.y=l*_t.x),_t}}]),e}(),bt=function(){function e(){oe(this,e)}return re(e,null,[{key:\"rotateXY\",value:function(e,t){var n=t.x,a=t.y,i=e.x,l=e.y;e.set(n*i-a*l,a*i+n*l)}},{key:\"rotateQXY\",value:function(e,t,n){var a=n.x,i=n.y,l=a*a,o=i*i,r=2*a*i*t,s=e.x,y=e.y;e.set(l*s-r+o*y,o*s+r+l*y)}}]),e}(),Et=.1,Ot=new Re,Dt=new Te,qt=new he,At=new xe,Vt=function(){function e(){oe(this,e)}return re(e,null,[{key:\"solve\",value:function(e,t,n){var a=w(Ot.copy(e),Dt.identity()),i=I(Dt,a);n.copy(t).applyMatrix3(i)}}]),e}(),Ft=new xe,Bt=function(){function e(){oe(this,e),this.data=null,this.ata=new Re,this.atb=new xe,this.massPoint=new xe,this.hasSolution=!1}return re(e,[{key:\"setData\",value:function(e){return this.data=e,this.hasSolution=!1,this}},{key:\"solve\",value:function(e){var t=this.data,n=this.massPoint,a=this.ata.copy(t.ata),i=this.atb.copy(t.atb),l=1/0;return!this.hasSolution&&null!==t&&0<t.numPoints&&(Ft.copy(t.massPointSum).divideScalar(t.numPoints),n.copy(Ft),a.applyToVector3(Ft),i.sub(Ft),Vt.solve(a,i,e),l=_(a,i,e),e.add(n),this.hasSolution=!0),l}}]),e}(),Nt=function e(){oe(this,e),this.materials=0,this.edgeCount=0,this.index=-1,this.position=new xe,this.normal=new xe,this.qefData=null},Lt=new Bt,Rt=.1,Yt=-1,Mt=function(e){function t(e,n){oe(this,t);var a=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));return a.voxel=null,a}return ye(t,e),re(t,[{key:\"contains\",value:function(e){var t=this.min,n=this.size;return e.x>=t.x-Rt&&e.y>=t.y-Rt&&e.z>=t.z-Rt&&e.x<=t.x+n+Rt&&e.y<=t.y+n+Rt&&e.z<=t.z+n+Rt}},{key:\"collapse\",value:function(){var e=this.children,t=[-1,-1,-1,-1,-1,-1,-1,-1],n=new xe,a=-1,l=null!==e,o=0,r=void 0,s=void 0,y=void 0,d=void 0,u=void 0,c=void 0,m=void 0;if(l){for(d=new It,c=0,m=0;8>m;++m)r=e[m],o+=r.collapse(),y=r.voxel,null===r.children?null!==y&&(d.addData(y.qefData),a=1&y.materials>>7-m,t[m]=1&y.materials>>m,++c):l=!1;if(l&&(u=Lt.setData(d).solve(n),u<=Yt)){for(y=new Nt,y.position.copy(this.contains(n)?n:Lt.massPoint),m=0;8>m;++m)s=t[m],r=e[m],-1===s?y.materials|=a<<m:(y.materials|=s<<m,y.normal.add(r.voxel.normal));y.normal.normalize(),y.qefData=d,this.voxel=y,this.children=null,o+=c-1}}return o}}],[{key:\"errorThreshold\",get:function(){return Yt},set:function(e){Yt=e}}]),t}(Ge),Xt=function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;oe(this,e),this.action=t,this.error=null},Zt=function(){function e(t,n,a,i,l){oe(this,e),this.indices=t,this.positions=n,this.normals=a,this.uvs=i,this.materials=l}return re(e,[{key:\"serialize\",value:function(){return{indices:this.indices,positions:this.positions,normals:this.normals,uvs:this.uvs,materials:this.materials}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.indices=e.indices,this.positions=e.positions,this.normals=e.normals,this.uvs=e.uvs,this.materials=e.materials),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e.push(this.indices.buffer),e.push(this.positions.buffer),e.push(this.normals.buffer),e.push(this.uvs.buffer),e.push(this.materials.buffer),e}}]),e}(),jt=[new Uint8Array([0,4,0]),new Uint8Array([1,5,0]),new Uint8Array([2,6,0]),new Uint8Array([3,7,0]),new Uint8Array([0,2,1]),new Uint8Array([4,6,1]),new Uint8Array([1,3,1]),new Uint8Array([5,7,1]),new Uint8Array([0,1,2]),new Uint8Array([2,3,2]),new Uint8Array([4,5,2]),new Uint8Array([6,7,2])],Ut=[new Uint8Array([0,1,2,3,0]),new Uint8Array([4,5,6,7,0]),new Uint8Array([0,4,1,5,1]),new Uint8Array([2,6,3,7,1]),new Uint8Array([0,2,4,6,2]),new Uint8Array([1,3,5,7,2])],Qt=[[new Uint8Array([4,0,0]),new Uint8Array([5,1,0]),new Uint8Array([6,2,0]),new Uint8Array([7,3,0])],[new Uint8Array([2,0,1]),new Uint8Array([6,4,1]),new Uint8Array([3,1,1]),new Uint8Array([7,5,1])],[new Uint8Array([1,0,2]),new Uint8Array([3,2,2]),new Uint8Array([5,4,2]),new Uint8Array([7,6,2])]],Gt=[[new Uint8Array([1,4,0,5,1,1]),new Uint8Array([1,6,2,7,3,1]),new Uint8Array([0,4,6,0,2,2]),new Uint8Array([0,5,7,1,3,2])],[new Uint8Array([0,2,3,0,1,0]),new Uint8Array([0,6,7,4,5,0]),new Uint8Array([1,2,0,6,4,2]),new Uint8Array([1,3,1,7,5,2])],[new Uint8Array([1,1,0,3,2,0]),new Uint8Array([1,5,4,7,6,0]),new Uint8Array([0,1,5,0,4,1]),new Uint8Array([0,3,7,2,6,1])]],Ht=[[new Uint8Array([3,2,1,0,0]),new Uint8Array([7,6,5,4,0])],[new Uint8Array([5,1,4,0,1]),new Uint8Array([7,3,6,2,1])],[new Uint8Array([6,4,2,0,2]),new Uint8Array([7,5,3,1,2])]],Jt=[new Uint8Array([3,2,1,0]),new Uint8Array([7,5,6,4]),new Uint8Array([11,10,9,8])],Kt=function(){function e(){oe(this,e)}return re(e,null,[{key:\"run\",value:function(e){var t=[],n=e.voxelCount,a=null,i=null,l=null,o=null,r=null;return 65535<n?console.warn(\"Could not create geometry for cell at position\",e.min,\"(vertex count of\",n,\"exceeds limit of \",65535,\")\"):0<n&&(i=new Float32Array(3*n),l=new Float32Array(3*n),o=new Float32Array(2*n),r=new Uint8Array(n),A(e.root,i,l,0),D(e.root,t),a=new Zt(new Uint16Array(t),i,l,o,r)),a}}]),e}(),Wt=function(e){function t(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new xe,a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1;oe(this,t);var i=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return i.root=new Mt(n,a),i.voxelCount=0,null!==e&&null!==e.edgeData&&i.construct(e),0<=Mt.errorThreshold&&i.simplify(),i}return ye(t,e),re(t,[{key:\"simplify\",value:function(){this.voxelCount-=this.root.collapse()}},{key:\"construct\",value:function(e){var t=Pt.resolution,n=e.edgeData,a=e.materialIndices,l=new Bt,o=new xe,r=[n.edgesX(this.min,this.root.size),n.edgesY(this.min,this.root.size),n.edgesZ(this.min,this.root.size)],s=[new Uint8Array([0,1,2,3]),new Uint8Array([0,1,4,5]),new Uint8Array([0,2,4,6])],u=0,c=void 0,m=void 0,p=void 0,v=void 0,g=void 0,k=void 0,h=void 0,f=void 0,S=void 0,T=void 0,w=void 0;for(T=0;3>T;++T){p=s[T],c=r[T];var P=!0,I=!1,_=void 0;try{for(var C,b=c[Symbol.iterator]();!(P=(C=b.next()).done);P=!0)for(m=C.value,m.computeZeroCrossingPosition(o),w=0;4>w;++w)v=je[p[w]],h=m.coordinates.x-v[0],f=m.coordinates.y-v[1],S=m.coordinates.z-v[2],0<=h&&0<=f&&0<=S&&h<t&&f<t&&S<t&&(g=V(this.root,t,h,f,S),null===g.voxel&&(g.voxel=F(t,h,f,S,a),++u),k=g.voxel,k.normal.add(m.n),k.qefData.add(o,m.n),k.qefData.numPoints===k.edgeCount&&(l.setData(k.qefData).solve(k.position),!g.contains(k.position)&&k.position.copy(l.massPoint),k.normal.normalize()))}catch(e){I=!0,_=e}finally{try{!P&&b.return&&b.return()}finally{if(I)throw _}}}this.voxelCount=u}}]),t}(at),$t={EXTRACT:\"worker.extract\",MODIFY:\"worker.modify\",CONFIGURE:\"worker.config\",CLOSE:\"worker.close\"},en=function(e){function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;oe(this,t);var n=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.data=null,n}return ye(t,e),t}(Xt),tn=function(e){function t(){oe(this,t);var e=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,$t.EXTRACT));return e.isosurface=null,e}return ye(t,e),t}(en),nn=new Pt(!1),an=function(){function e(){oe(this,e),this.data=null,this.response=null}return re(e,[{key:\"getData\",value:function(){return this.data}},{key:\"respond\",value:function(){return this.response.data=this.data.serialize(),this.response}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return null!==this.data&&this.data.createTransferList(e),e}},{key:\"process\",value:function(e){return this.data=nn.deserialize(e.data),this}}]),e}(),ln=function(e){function t(){oe(this,t);var e=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.response=new tn,e.decompressionTarget=new Pt(!1),e.isosurface=null,e}return ye(t,e),re(t,[{key:\"respond\",value:function(){var e=se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"respond\",this).call(this);return e.isosurface=null===this.isosurface?null:this.isosurface.serialise(),e}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"createTransferList\",this).call(this,e),null===this.isosurface?e:this.isosurface.createTransferList(e)}},{key:\"process\",value:function(e){var n=se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"process\",this).call(this,e).getData(),a=new Wt(n.decompress(this.decompressionTarget));return this.isosurface=Kt.run(a),this.decompressionTarget.clear(),this}}]),t}(an),on={UNION:\"csg.union\",DIFFERENCE:\"csg.difference\",INTERSECTION:\"csg.intersection\",DENSITY_FUNCTION:\"csg.densityfunction\"},rn=function(){function e(t){oe(this,e),this.type=t;for(var n=arguments.length,a=Array(1<n?n-1:0),i=1;i<n;i++)a[i-1]=arguments[i];this.children=a,this.boundingBox=null}return re(e,[{key:\"getBoundingBox\",value:function(){return null===this.boundingBox&&(this.boundingBox=this.computeBoundingBox()),this.boundingBox}},{key:\"computeBoundingBox\",value:function(){var e=this.children,t=new v,n=void 0,a=void 0;for(n=0,a=e.length;n<a;++n)t.union(e[n].getBoundingBox());return t}}]),e}(),sn=function(e){function t(){var e;oe(this,t);for(var n=arguments.length,a=Array(n),i=0;i<n;i++)a[i]=arguments[i];return de(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this,on.UNION].concat(a)))}return ye(t,e),re(t,[{key:\"updateMaterialIndex\",value:function(e,t,n){var a=n.materialIndices[e];a!==ft.AIR&&t.setMaterialIndex(e,a)}},{key:\"selectEdge\",value:function(e,t,n){return n?e.t>t.t?e:t:e.t<t.t?e:t}}]),t}(rn),yn=function(e){function t(){var e;oe(this,t);for(var n=arguments.length,a=Array(n),i=0;i<n;i++)a[i]=arguments[i];return de(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this,on.DIFFERENCE].concat(a)))}return ye(t,e),re(t,[{key:\"updateMaterialIndex\",value:function(e,t,n){n.materialIndices[e]!==ft.AIR&&t.setMaterialIndex(e,ft.AIR)}},{key:\"selectEdge\",value:function(e,t,n){return n?e.t<t.t?e:t:e.t>t.t?e:t}}]),t}(rn),dn=function(e){function t(){var e;oe(this,t);for(var n=arguments.length,a=Array(n),i=0;i<n;i++)a[i]=arguments[i];return de(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this,on.INTERSECTION].concat(a)))}return ye(t,e),re(t,[{key:\"updateMaterialIndex\",value:function(e,t,n){var a=n.materialIndices[e];t.setMaterialIndex(e,t.materialIndices[e]!==ft.AIR&&a!==ft.AIR?a:ft.AIR)}},{key:\"selectEdge\",value:function(e,t,n){return n?e.t<t.t?e:t:e.t>t.t?e:t}}]),t}(rn),un=0,cn=new xe,mn=function(){function e(){oe(this,e)}return re(e,null,[{key:\"run\",value:function(e,t,n,a){cn.fromArray(e),un=t,null===n?a.operation===on.UNION&&(n=new Pt(!1)):n.decompress();var i=a.toCSG(),l=null===n?null:X(i);if(null!==l){switch(a.operation){case on.UNION:i=new sn(i);break;case on.DIFFERENCE:i=new yn(i);break;case on.INTERSECTION:i=new dn(i);}M(i,n,l),n.contoured=!1}return null!==n&&n.empty?null:n}}]),e}(),xn=function(e){function t(e){oe(this,t);var n=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,on.DENSITY_FUNCTION));return n.sdf=e,n}return ye(t,e),re(t,[{key:\"computeBoundingBox\",value:function(){return this.sdf.getBoundingBox(!0)}},{key:\"generateMaterialIndex\",value:function(e){return this.sdf.sample(e)<=Pt.isovalue?this.sdf.material:ft.AIR}},{key:\"generateEdge\",value:function(e){e.approximateZeroCrossing(this.sdf),e.computeSurfaceNormal(this.sdf)}}]),t}(rn),pn=new c,vn=function(){function e(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:ft.SOLID;oe(this,e),this.type=t,this.operation=null,this.material=te(255,ne(ft.SOLID,U(n))),this.boundingBox=null,this.position=new xe,this.quaternion=new Ie,this.scale=new xe(1,1,1),this.inverseTransformation=new c,this.updateInverseTransformation(),this.children=[]}return re(e,[{key:\"getTransformation\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new c;return e.compose(this.position,this.quaternion,this.scale)}},{key:\"getBoundingBox\",value:function(){var e=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],t=this.children,n=this.boundingBox,a=void 0,o=void 0;if(null===n&&(n=this.computeBoundingBox(),this.boundingBox=n),e)for(n=n.clone(),a=0,o=t.length;a<o;++a)n.union(t[a].getBoundingBox(e));return n}},{key:\"setMaterial\",value:function(e){return this.material=te(255,ne(ft.SOLID,U(e))),this}},{key:\"setOperationType\",value:function(e){return this.operation=e,this}},{key:\"updateInverseTransformation\",value:function(){return this.inverseTransformation.getInverse(this.getTransformation(pn)),this.boundingBox=null,this}},{key:\"union\",value:function(e){return this.children.push(e.setOperationType(on.UNION)),this}},{key:\"subtract\",value:function(e){return this.children.push(e.setOperationType(on.DIFFERENCE)),this}},{key:\"intersect\",value:function(e){return this.children.push(e.setOperationType(on.INTERSECTION)),this}},{key:\"toCSG\",value:function(){var e=this.children,t=new xn(this),n=void 0,a=void 0,o=void 0,r=void 0;for(o=0,r=e.length;o<r;++o)a=e[o],n!==a.operation&&(n=a.operation,n===on.UNION?t=new sn(t):n===on.DIFFERENCE?t=new yn(t):n===on.INTERSECTION?t=new dn(t):void 0),t.children.push(a.toCSG());return t}},{key:\"serialize\",value:function(){var e=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],t={type:this.type,operation:this.operation,material:this.material,position:this.position.toArray(),quaternion:this.quaternion.toArray(),scale:this.scale.toArray(),parameters:null,children:[]},n=void 0,a=void 0;for(n=0,a=this.children.length;n<a;++n)t.children.push(this.children[n].serialize(e));return t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e}},{key:\"toJSON\",value:function(){return this.serialize(!0)}},{key:\"computeBoundingBox\",value:function(){throw new Error(\"SignedDistanceFunction#computeBoundingBox method not implemented!\")}},{key:\"sample\",value:function(){throw new Error(\"SignedDistanceFunction#sample method not implemented!\")}}]),e}(),gn={HEIGHTFIELD:\"sdf.heightfield\",FRACTAL_NOISE:\"sdf.fractalnoise\",SUPER_PRIMITIVE:\"sdf.superprimitive\"},kn=function(e){function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];oe(this,t);var a=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,gn.PERLIN_NOISE,n));return a.min=new(Function.prototype.bind.apply(xe,[null].concat(ce(e.min)))),a.max=new(Function.prototype.bind.apply(xe,[null].concat(ce(e.max)))),a}return ye(t,e),re(t,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new v(this.min,this.max),this.bbox}},{key:\"sample\",value:function(){}},{key:\"serialize\",value:function(){var e=se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"serialize\",this).call(this);return e.parameters={min:this.min.toArray(),max:this.max.toArray()},e}}]),t}(vn),hn=function(e){function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];oe(this,t);var a=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,gn.HEIGHTFIELD,n));return a.width=void 0===e.width?1:e.width,a.height=void 0===e.height?1:e.height,a.smooth=void 0===e.smooth||e.smooth,a.data=void 0===e.data?null:e.data,a.heightmap=null,void 0!==e.image&&a.fromImage(e.image),a}return ye(t,e),re(t,[{key:\"fromImage\",value:function(e){var t=\"undefined\"==typeof document?null:Z(e),n=null,a=void 0,o=void 0,r=void 0,s=void 0;if(null!==t){for(a=t.data,n=new Uint8ClampedArray(a.length/4),(o=0,r=0,s=n.length);o<s;++o,r+=4)n[o]=a[r];this.heightmap=e,this.width=t.width,this.height=t.height,this.data=n}return this}},{key:\"getHeight\",value:function(e,t){var n=this.width,i=this.height,l=this.data,o=void 0;if(e=J(e*n),t=J(t*i),this.smooth){e=ne(te(e,n-1),1),t=ne(te(t,i-1),1);var r=e+1,s=e-1,y=t*n,a=y+n,d=y-n;o=(l[d+s]+l[d+e]+l[d+r]+l[y+s]+l[y+e]+l[y+r]+l[a+s]+l[a+e]+l[a+r])/9}else o=l[t*n+e];return o}},{key:\"computeBoundingBox\",value:function(){var e=new v,t=te(this.width/this.height,1),n=te(this.height/this.width,1);return e.min.set(0,0,0),e.max.set(t,1,n),e.applyMatrix4(this.getTransformation()),e}},{key:\"sample\",value:function(e){var t=this.boundingBox,n=void 0;return t.containsPoint(e)?(e.applyMatrix4(this.inverseTransformation),n=e.y-this.getHeight(e.x,e.z)/255):n=t.distanceToPoint(e),n}},{key:\"serialize\",value:function(){var e=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],n=se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"serialize\",this).call(this);return n.parameters={width:this.width,height:this.height,smooth:this.smooth,data:e?null:this.data,dataURL:e&&null!==this.heightmap?this.heightmap.toDataURL():null,image:null},n}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e.push(this.data.buffer),e}}]),t}(vn),zn=function(e){function t(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},n=arguments[1];oe(this,t);var a=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,gn.SUPER_PRIMITIVE,n));return a.s0=new(Function.prototype.bind.apply(Ye,[null].concat(ce(e.s)))),a.r0=new(Function.prototype.bind.apply(xe,[null].concat(ce(e.r)))),a.s=new Ye,a.r=new xe,a.ba=new he,a.offset=0,a.precompute(),a}return ye(t,e),re(t,[{key:\"setSize\",value:function(e,t,n,a){return this.s0.set(e,t,n,a),this.precompute()}},{key:\"setRadii\",value:function(e,t,n){return this.r0.set(e,t,n),this.precompute()}},{key:\"precompute\",value:function(){var e=this.s.copy(this.s0),t=this.r.copy(this.r0),n=this.ba;e.x-=t.x,e.y-=t.x,t.x-=e.w,e.w-=t.y,e.z-=t.y,this.offset=-2*e.z,n.set(t.z,this.offset);var a=n.dot(n);return 0===a?n.set(0,-1):n.divideScalar(a),this}},{key:\"computeBoundingBox\",value:function(){var e=this.s0,t=new v;return t.min.x=te(-e.x,-1),t.min.y=te(-e.y,-1),t.min.z=te(-e.z,-1),t.max.x=ne(e.x,1),t.max.y=ne(e.y,1),t.max.z=ne(e.z,1),t.applyMatrix4(this.getTransformation()),t}},{key:\"sample\",value:function(e){e.applyMatrix4(this.inverseTransformation);var t=this.s,n=this.r,a=this.ba,i=$(e.x)-t.x,l=$(e.y)-t.y,o=$(e.z)-t.z,r=ne(i,0),s=ne(l,0),y=ae(r*r+s*s),d=e.z-t.z,u=$(y+te(0,ne(i,l))-n.x)-t.w,m=te(ne(u*a.x+d*a.y,0),1),c=u-n.z*m,x=d-this.offset*m,p=ne(u-n.z,0),v=e.z+t.z,g=ne(u,0),k=u*-a.y+d*a.x,h=ae(te(c*c+x*x,te(p*p+v*v,g*g+d*d)));return h*Q(ne(k,o))-n.y}},{key:\"serialize\",value:function(){var e=se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"serialize\",this).call(this);return e.parameters={s:this.s0.toArray(),r:this.r0.toArray()},e}}],[{key:\"create\",value:function(e){var n=fn[e];return new t({s:n[0],r:n[1]})}}]),t}(vn),fn=[[new Float32Array([1,1,1,1]),new Float32Array([0,0,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,0,0])],[new Float32Array([0,0,1,1]),new Float32Array([0,0,1])],[new Float32Array([1,1,2,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,.25,1]),new Float32Array([1,.25,0])],[new Float32Array([1,1,.25,.25]),new Float32Array([1,.25,0])],[new Float32Array([1,1,1,.25]),new Float32Array([1,.1,0])],[new Float32Array([1,1,1,.25]),new Float32Array([.1,.1,0])]],Sn=function(){function e(){oe(this,e)}return re(e,[{key:\"revive\",value:function(e){var t,n,a;switch(e.type){case gn.FRACTAL_NOISE:t=new kn(e.parameters,e.material);break;case gn.HEIGHTFIELD:t=new hn(e.parameters,e.material);break;case gn.SUPER_PRIMITIVE:t=new zn(e.parameters,e.material);}for(t.operation=e.operation,t.position.fromArray(e.position),t.quaternion.fromArray(e.quaternion),t.scale.fromArray(e.scale),t.updateInverseTransformation(),(n=0,a=e.children.length);n<a;++n)t.children.push(this.revive(e.children[n]));return t}}]),e}(),Tn=function(e){function t(){oe(this,t);var e=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,$t.MODIFY));return e.sdf=null,e}return ye(t,e),t}(en),wn=function(e){function t(){oe(this,t);var e=de(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.response=new Tn,e.sdf=null,e}return ye(t,e),re(t,[{key:\"respond\",value:function(){var e=se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"respond\",this).call(this);return e.sdf=null===this.sdf?null:this.sdf.serialize(),e}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"createTransferList\",this).call(this,e),null===this.sdf?e:this.sdf.createTransferList(e)}},{key:\"process\",value:function(e){var n=se(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"process\",this).call(this,e).getData(),a=this.sdf=Sn.revive(e.sdf),i=mn.run(e.cellPosition,e.cellSize,n,a);return ue(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),\"data\",null===i?null:i.compress(),this),this}}]),t}(an),Pn=new wn,In=new ln,_n=null;self.addEventListener(\"message\",function(e){var t=e.data;switch(_n=t.action,_n){case $t.MODIFY:postMessage(Pn.process(t).respond(),Pn.createTransferList());break;case $t.EXTRACT:postMessage(In.process(t).respond(),In.createTransferList());break;case $t.CONFIGURE:Pt.resolution=t.resolution,Mt.errorThreshold=t.errorThreshold;break;case $t.CLOSE:default:close();}}),self.addEventListener(\"error\",function(e){var t=_n===$t.MODIFY?Pn:_n===$t.EXTRACT?In:null,n=void 0;null===t?(n=new Xt($t.CLOSE),n.error=e,postMessage(n)):(n=t.respond(),n.action=$t.CLOSE,n.error=e,postMessage(n,t.createTransferList())),close()})})();\n";

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

  				_this.configurationMessage = new ConfigurationMessage();

  				return _this;
  		}

  		createClass(ThreadPool, [{
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "message":
  										{

  												this.busyWorkers.delete(event.target);

  												message.worker = event.target;
  												message.response = event.data;

  												this.dispatchEvent(message);

  												if (this.workers.length > this.maxWorkers) {

  														this.closeWorker(event.target);
  												}

  												break;
  										}

  								case "error":
  										{
  												console.error("Encountered an unexpected error", event);
  												break;
  										}

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

  								worker$$1.postMessage(new Message(Action.CLOSE));
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

  						worker$$1.postMessage(this.configurationMessage);

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

  				_this.octantId = null;

  				_this.error = null;

  				return _this;
  		}

  		return TerrainEvent;
  }(Event);

  var modificationstart = new TerrainEvent("modificationstart");

  var modificationend = new TerrainEvent("modificationend");

  var extractionstart = new TerrainEvent("extractionstart");

  var extractionend = new TerrainEvent("extractionend");

  var load$1 = new TerrainEvent("load");

  var error$1 = new TerrainEvent("error");

  var Terrain = function (_EventTarget) {
  	inherits(Terrain, _EventTarget);

  	function Terrain() {
  		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  		classCallCheck(this, Terrain);


  		var worldSettings = options.world !== undefined ? options.world : {};

  		HermiteData.resolution = options.resolution !== undefined ? options.resolution : 32;

  		var _this = possibleConstructorReturn(this, (Terrain.__proto__ || Object.getPrototypeOf(Terrain)).call(this));

  		_this.object = null;

  		_this.world = new WorldOctree(worldSettings.cellSize, worldSettings.levels, worldSettings.keyDesign);

  		_this.clipmap = new Clipmap(_this.world);
  		_this.clipmap.addEventListener("shellupdate", _this);

  		_this.threadPool = new ThreadPool(options.workers);
  		_this.threadPool.addEventListener("message", _this);

  		_this.tasks = new WeakMap();

  		_this.sdfLoader = new SDFLoader();
  		_this.sdfLoader.addEventListener("load", _this);

  		_this.history = [];

  		_this.dtSq = _this.world.getCellSize();

  		return _this;
  	}

  	createClass(Terrain, [{
  		key: "handleEvent",
  		value: function handleEvent(event) {

  			switch (event.type) {

  				case "shellupdate":
  					break;

  				case "message":
  					break;

  				case "load":
  					this.revive(event.descriptions);
  					this.dispatchEvent(load$1);
  					break;

  			}
  		}
  	}, {
  		key: "applyCSG",
  		value: function applyCSG(sdf) {

  			this.world.applyCSG(sdf);
  			this.history.push(sdf);
  		}
  	}, {
  		key: "union",
  		value: function union(sdf) {

  			this.applyCSG(sdf.setOperationType(OperationType.UNION));
  		}
  	}, {
  		key: "subtract",
  		value: function subtract(sdf) {

  			this.applyCSG(sdf.setOperationType(OperationType.DIFFERENCE));
  		}
  	}, {
  		key: "intersect",
  		value: function intersect(sdf) {

  			this.applyCSG(sdf.setOperationType(OperationType.INTERSECTION));
  		}
  	}, {
  		key: "update",
  		value: function update(position) {
  			if (this.clipmap.position.distanceToSquared(position) >= this.dtSq) {

  				this.clipmap.update(position);
  			}
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(ray) {

  			return this.world.raycast(ray);
  		}
  	}, {
  		key: "clear",
  		value: function clear() {

  			this.world.clear();
  			this.clipmap.clear();
  			this.threadPool.clear();
  			this.sdfLoader.clear();

  			this.tasks = new WeakMap();
  			this.history = [];
  		}
  	}, {
  		key: "dispose",
  		value: function dispose() {

  			this.threadPool.dispose();
  		}
  	}, {
  		key: "revive",
  		value: function revive(descriptions) {

  			var i = void 0,
  			    l = void 0;

  			for (i = 0, l = descriptions.length; i < l; ++i) {

  				this.applyCSG(SDFReviver.revive(descriptions[i]));
  			}
  		}
  	}, {
  		key: "save",
  		value: function save() {

  			return this.history.length === 0 ? null : URL.createObjectURL(new Blob([JSON.stringify(this.history)], { type: "text/json" }));
  		}
  	}, {
  		key: "load",
  		value: function load(data) {

  			var descriptions = JSON.parse(data);

  			this.clear();
  			this.sdfLoader.load(descriptions);
  		}
  	}]);
  	return Terrain;
  }(EventTarget);

  var Isosurface = function () {
  		function Isosurface(indices, positions, normals, uvs, materials) {
  				classCallCheck(this, Isosurface);


  				this.indices = indices;

  				this.positions = positions;

  				this.normals = normals;

  				this.uvs = uvs;

  				this.materials = materials;
  		}

  		createClass(Isosurface, [{
  				key: "serialize",
  				value: function serialize() {


  						return {
  								indices: this.indices,
  								positions: this.positions,
  								normals: this.normals,
  								uvs: this.uvs,
  								materials: this.materials
  						};
  				}
  		}, {
  				key: "deserialize",
  				value: function deserialize(object) {

  						var result = this;

  						if (object !== null) {

  								this.indices = object.indices;
  								this.positions = object.positions;
  								this.normals = object.normals;
  								this.uvs = object.uvs;
  								this.materials = object.materials;
  						} else {

  								result = null;
  						}

  						return result;
  				}
  		}, {
  				key: "createTransferList",
  				value: function createTransferList() {
  						var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  						transferList.push(this.indices.buffer);
  						transferList.push(this.positions.buffer);
  						transferList.push(this.normals.buffer);
  						transferList.push(this.uvs.buffer);
  						transferList.push(this.materials.buffer);

  						return transferList;
  				}
  		}]);
  		return Isosurface;
  }();

  var cellProcFaceMask = [new Uint8Array([0, 4, 0]), new Uint8Array([1, 5, 0]), new Uint8Array([2, 6, 0]), new Uint8Array([3, 7, 0]), new Uint8Array([0, 2, 1]), new Uint8Array([4, 6, 1]), new Uint8Array([1, 3, 1]), new Uint8Array([5, 7, 1]), new Uint8Array([0, 1, 2]), new Uint8Array([2, 3, 2]), new Uint8Array([4, 5, 2]), new Uint8Array([6, 7, 2])];

  var cellProcEdgeMask = [new Uint8Array([0, 1, 2, 3, 0]), new Uint8Array([4, 5, 6, 7, 0]), new Uint8Array([0, 4, 1, 5, 1]), new Uint8Array([2, 6, 3, 7, 1]), new Uint8Array([0, 2, 4, 6, 2]), new Uint8Array([1, 3, 5, 7, 2])];

  var faceProcFaceMask = [[new Uint8Array([4, 0, 0]), new Uint8Array([5, 1, 0]), new Uint8Array([6, 2, 0]), new Uint8Array([7, 3, 0])], [new Uint8Array([2, 0, 1]), new Uint8Array([6, 4, 1]), new Uint8Array([3, 1, 1]), new Uint8Array([7, 5, 1])], [new Uint8Array([1, 0, 2]), new Uint8Array([3, 2, 2]), new Uint8Array([5, 4, 2]), new Uint8Array([7, 6, 2])]];

  var faceProcEdgeMask = [[new Uint8Array([1, 4, 0, 5, 1, 1]), new Uint8Array([1, 6, 2, 7, 3, 1]), new Uint8Array([0, 4, 6, 0, 2, 2]), new Uint8Array([0, 5, 7, 1, 3, 2])], [new Uint8Array([0, 2, 3, 0, 1, 0]), new Uint8Array([0, 6, 7, 4, 5, 0]), new Uint8Array([1, 2, 0, 6, 4, 2]), new Uint8Array([1, 3, 1, 7, 5, 2])], [new Uint8Array([1, 1, 0, 3, 2, 0]), new Uint8Array([1, 5, 4, 7, 6, 0]), new Uint8Array([0, 1, 5, 0, 4, 1]), new Uint8Array([0, 3, 7, 2, 6, 1])]];

  var edgeProcEdgeMask = [[new Uint8Array([3, 2, 1, 0, 0]), new Uint8Array([7, 6, 5, 4, 0])], [new Uint8Array([5, 1, 4, 0, 1]), new Uint8Array([7, 3, 6, 2, 1])], [new Uint8Array([6, 4, 2, 0, 2]), new Uint8Array([7, 5, 3, 1, 2])]];

  var procEdgeMask = [new Uint8Array([3, 2, 1, 0]), new Uint8Array([7, 5, 6, 4]), new Uint8Array([11, 10, 9, 8])];

  var MAX_VERTEX_COUNT = Math.pow(2, 16) - 1;

  function contourProcessEdge(octants, dir, indexBuffer) {

  	var indices = [-1, -1, -1, -1];
  	var signChange = [false, false, false, false];

  	var minSize = Infinity;
  	var minIndex = 0;
  	var flip = false;

  	var c1 = void 0,
  	    c2 = void 0,
  	    m1 = void 0,
  	    m2 = void 0;
  	var octant = void 0,
  	    edge = void 0;
  	var i = void 0;

  	for (i = 0; i < 4; ++i) {

  		octant = octants[i];
  		edge = procEdgeMask[dir][i];

  		c1 = edges[edge][0];
  		c2 = edges[edge][1];

  		m1 = octant.voxel.materials >> c1 & 1;
  		m2 = octant.voxel.materials >> c2 & 1;

  		if (octant.size < minSize) {

  			minSize = octant.size;
  			minIndex = i;
  			flip = m1 !== Material.AIR;
  		}

  		indices[i] = octant.voxel.index;
  		signChange[i] = m1 !== m2;
  	}

  	if (signChange[minIndex]) {

  		if (!flip) {

  			indexBuffer.push(indices[0]);
  			indexBuffer.push(indices[1]);
  			indexBuffer.push(indices[3]);

  			indexBuffer.push(indices[0]);
  			indexBuffer.push(indices[3]);
  			indexBuffer.push(indices[2]);
  		} else {

  			indexBuffer.push(indices[0]);
  			indexBuffer.push(indices[3]);
  			indexBuffer.push(indices[1]);

  			indexBuffer.push(indices[0]);
  			indexBuffer.push(indices[2]);
  			indexBuffer.push(indices[3]);
  		}
  	}
  }

  function contourEdgeProc(octants, dir, indexBuffer) {

  	var c = [0, 0, 0, 0];

  	var edgeOctants = void 0;
  	var octant = void 0;
  	var i = void 0,
  	    j = void 0;

  	if (octants[0].voxel !== null && octants[1].voxel !== null && octants[2].voxel !== null && octants[3].voxel !== null) {

  		contourProcessEdge(octants, dir, indexBuffer);
  	} else {

  		for (i = 0; i < 2; ++i) {

  			c[0] = edgeProcEdgeMask[dir][i][0];
  			c[1] = edgeProcEdgeMask[dir][i][1];
  			c[2] = edgeProcEdgeMask[dir][i][2];
  			c[3] = edgeProcEdgeMask[dir][i][3];

  			edgeOctants = [];

  			for (j = 0; j < 4; ++j) {

  				octant = octants[j];

  				if (octant.voxel !== null) {

  					edgeOctants[j] = octant;
  				} else if (octant.children !== null) {

  					edgeOctants[j] = octant.children[c[j]];
  				} else {

  					break;
  				}
  			}

  			if (j === 4) {

  				contourEdgeProc(edgeOctants, edgeProcEdgeMask[dir][i][4], indexBuffer);
  			}
  		}
  	}
  }

  function contourFaceProc(octants, dir, indexBuffer) {

  	var c = [0, 0, 0, 0];

  	var orders = [[0, 0, 1, 1], [0, 1, 0, 1]];

  	var faceOctants = void 0,
  	    edgeOctants = void 0;
  	var order = void 0,
  	    octant = void 0;
  	var i = void 0,
  	    j = void 0;

  	if (octants[0].children !== null || octants[1].children !== null) {

  		for (i = 0; i < 4; ++i) {

  			c[0] = faceProcFaceMask[dir][i][0];
  			c[1] = faceProcFaceMask[dir][i][1];

  			faceOctants = [octants[0].children === null ? octants[0] : octants[0].children[c[0]], octants[1].children === null ? octants[1] : octants[1].children[c[1]]];

  			contourFaceProc(faceOctants, faceProcFaceMask[dir][i][2], indexBuffer);
  		}

  		for (i = 0; i < 4; ++i) {

  			c[0] = faceProcEdgeMask[dir][i][1];
  			c[1] = faceProcEdgeMask[dir][i][2];
  			c[2] = faceProcEdgeMask[dir][i][3];
  			c[3] = faceProcEdgeMask[dir][i][4];

  			order = orders[faceProcEdgeMask[dir][i][0]];

  			edgeOctants = [];

  			for (j = 0; j < 4; ++j) {

  				octant = octants[order[j]];

  				if (octant.voxel !== null) {

  					edgeOctants[j] = octant;
  				} else if (octant.children !== null) {

  					edgeOctants[j] = octant.children[c[j]];
  				} else {

  					break;
  				}
  			}

  			if (j === 4) {

  				contourEdgeProc(edgeOctants, faceProcEdgeMask[dir][i][5], indexBuffer);
  			}
  		}
  	}
  }

  function contourCellProc(octant, indexBuffer) {

  	var children = octant.children;
  	var c = [0, 0, 0, 0];

  	var faceOctants = void 0,
  	    edgeOctants = void 0;
  	var i = void 0;

  	if (children !== null) {

  		for (i = 0; i < 8; ++i) {

  			contourCellProc(children[i], indexBuffer);
  		}

  		for (i = 0; i < 12; ++i) {

  			c[0] = cellProcFaceMask[i][0];
  			c[1] = cellProcFaceMask[i][1];

  			faceOctants = [children[c[0]], children[c[1]]];

  			contourFaceProc(faceOctants, cellProcFaceMask[i][2], indexBuffer);
  		}

  		for (i = 0; i < 6; ++i) {

  			c[0] = cellProcEdgeMask[i][0];
  			c[1] = cellProcEdgeMask[i][1];
  			c[2] = cellProcEdgeMask[i][2];
  			c[3] = cellProcEdgeMask[i][3];

  			edgeOctants = [children[c[0]], children[c[1]], children[c[2]], children[c[3]]];

  			contourEdgeProc(edgeOctants, cellProcEdgeMask[i][4], indexBuffer);
  		}
  	}
  }

  function generateVertexIndices(octant, positions, normals, index) {

  	var i = void 0,
  	    voxel = void 0;

  	if (octant.children !== null) {

  		for (i = 0; i < 8; ++i) {

  			index = generateVertexIndices(octant.children[i], positions, normals, index);
  		}
  	} else if (octant.voxel !== null) {

  		voxel = octant.voxel;
  		voxel.index = index;

  		positions[index * 3] = voxel.position.x;
  		positions[index * 3 + 1] = voxel.position.y;
  		positions[index * 3 + 2] = voxel.position.z;

  		normals[index * 3] = voxel.normal.x;
  		normals[index * 3 + 1] = voxel.normal.y;
  		normals[index * 3 + 2] = voxel.normal.z;

  		++index;
  	}

  	return index;
  }

  var DualContouring = function () {
  	function DualContouring() {
  		classCallCheck(this, DualContouring);
  	}

  	createClass(DualContouring, null, [{
  		key: "run",
  		value: function run(svo) {

  			var indexBuffer = [];

  			var vertexCount = svo.voxelCount;

  			var result = null;
  			var positions = null;
  			var normals = null;
  			var uvs = null;
  			var materials = null;

  			if (vertexCount > MAX_VERTEX_COUNT) {

  				console.warn("Could not create geometry for cell at position", svo.min, "(vertex count of", vertexCount, "exceeds limit of ", MAX_VERTEX_COUNT, ")");
  			} else if (vertexCount > 0) {

  				positions = new Float32Array(vertexCount * 3);
  				normals = new Float32Array(vertexCount * 3);
  				uvs = new Float32Array(vertexCount * 2);
  				materials = new Uint8Array(vertexCount);

  				generateVertexIndices(svo.root, positions, normals, 0);
  				contourCellProc(svo.root, indexBuffer);

  				result = new Isosurface(new Uint16Array(indexBuffer), positions, normals, uvs, materials);
  			}

  			return result;
  		}
  	}]);
  	return DualContouring;
  }();

  var coefficients = new Vector2();

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

  var PSEUDOINVERSE_THRESHOLD = 1e-1;

  var SVD_SWEEPS = 5;

  var sm = new SymmetricMatrix3();

  var m$3 = new Matrix3();

  var a$3 = new Vector2();

  var b$9 = new Vector3();

  function rotate01(vtav, v) {

  	var se = vtav.elements;
  	var ve = v.elements;

  	var coefficients = void 0;

  	if (se[1] !== 0.0) {

  		coefficients = Givens.calculateCoefficients(se[0], se[1], se[3]);

  		Schur.rotateQXY(a$3.set(se[0], se[3]), se[1], coefficients);
  		se[0] = a$3.x;se[3] = a$3.y;

  		Schur.rotateXY(a$3.set(se[2], se[4]), coefficients);
  		se[2] = a$3.x;se[4] = a$3.y;

  		se[1] = 0.0;

  		Schur.rotateXY(a$3.set(ve[0], ve[3]), coefficients);
  		ve[0] = a$3.x;ve[3] = a$3.y;

  		Schur.rotateXY(a$3.set(ve[1], ve[4]), coefficients);
  		ve[1] = a$3.x;ve[4] = a$3.y;

  		Schur.rotateXY(a$3.set(ve[2], ve[5]), coefficients);
  		ve[2] = a$3.x;ve[5] = a$3.y;
  	}
  }

  function rotate02(vtav, v) {

  	var se = vtav.elements;
  	var ve = v.elements;

  	var coefficients = void 0;

  	if (se[2] !== 0.0) {

  		coefficients = Givens.calculateCoefficients(se[0], se[2], se[5]);

  		Schur.rotateQXY(a$3.set(se[0], se[5]), se[2], coefficients);
  		se[0] = a$3.x;se[5] = a$3.y;

  		Schur.rotateXY(a$3.set(se[1], se[4]), coefficients);
  		se[1] = a$3.x;se[4] = a$3.y;

  		se[2] = 0.0;

  		Schur.rotateXY(a$3.set(ve[0], ve[6]), coefficients);
  		ve[0] = a$3.x;ve[6] = a$3.y;

  		Schur.rotateXY(a$3.set(ve[1], ve[7]), coefficients);
  		ve[1] = a$3.x;ve[7] = a$3.y;

  		Schur.rotateXY(a$3.set(ve[2], ve[8]), coefficients);
  		ve[2] = a$3.x;ve[8] = a$3.y;
  	}
  }

  function rotate12(vtav, v) {

  	var se = vtav.elements;
  	var ve = v.elements;

  	var coefficients = void 0;

  	if (se[4] !== 0.0) {

  		coefficients = Givens.calculateCoefficients(se[3], se[4], se[5]);

  		Schur.rotateQXY(a$3.set(se[3], se[5]), se[4], coefficients);
  		se[3] = a$3.x;se[5] = a$3.y;

  		Schur.rotateXY(a$3.set(se[1], se[2]), coefficients);
  		se[1] = a$3.x;se[2] = a$3.y;

  		se[4] = 0.0;

  		Schur.rotateXY(a$3.set(ve[3], ve[6]), coefficients);
  		ve[3] = a$3.x;ve[6] = a$3.y;

  		Schur.rotateXY(a$3.set(ve[4], ve[7]), coefficients);
  		ve[4] = a$3.x;ve[7] = a$3.y;

  		Schur.rotateXY(a$3.set(ve[5], ve[8]), coefficients);
  		ve[5] = a$3.x;ve[8] = a$3.y;
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

  	return b$9.set(e[0], e[3], e[5]);
  }

  function invert(x) {

  	var invX = Math.abs(x) < PSEUDOINVERSE_THRESHOLD ? 0.0 : 1.0 / x;

  	return Math.abs(invX) < PSEUDOINVERSE_THRESHOLD ? 0.0 : invX;
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

  			var sigma = solveSymmetric(sm.copy(ata), m$3.identity());
  			var invV = pseudoInverse(m$3, sigma);

  			x.copy(atb).applyMatrix3(invV);
  		}
  	}]);
  	return SingularValueDecomposition;
  }();

  var p$3 = new Vector3();

  function calculateError(ata, atb, x) {

  		ata.applyToVector3(p$3.copy(x));
  		p$3.subVectors(atb, p$3);

  		return p$3.dot(p$3);
  }

  var QEFSolver = function () {
  		function QEFSolver() {
  				classCallCheck(this, QEFSolver);


  				this.data = null;

  				this.ata = new SymmetricMatrix3();

  				this.atb = new Vector3();

  				this.massPoint = new Vector3();

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
  				key: "solve",
  				value: function solve(x) {

  						var data = this.data;
  						var massPoint = this.massPoint;
  						var ata = this.ata.copy(data.ata);
  						var atb = this.atb.copy(data.atb);

  						var error = Infinity;

  						if (!this.hasSolution && data !== null && data.numPoints > 0) {
  								p$3.copy(data.massPointSum).divideScalar(data.numPoints);
  								massPoint.copy(p$3);

  								ata.applyToVector3(p$3);
  								atb.sub(p$3);

  								SingularValueDecomposition.solve(ata, atb, x);
  								error = calculateError(ata, atb, x);
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

  				this.atb = new Vector3();

  				this.massPointSum = new Vector3();

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

  var Voxel = function Voxel() {
  		classCallCheck(this, Voxel);


  		this.materials = 0;

  		this.edgeCount = 0;

  		this.index = -1;

  		this.position = new Vector3();

  		this.normal = new Vector3();

  		this.qefData = null;
  };

  var qefSolver = new QEFSolver();

  var BIAS = 1e-1;

  var errorThreshold = -1;

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

  			var signs = [-1, -1, -1, -1, -1, -1, -1, -1];

  			var position = new Vector3();

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
  	}], [{
  		key: "errorThreshold",
  		get: function get$$1() {

  			return errorThreshold;
  		},
  		set: function set$$1(value) {

  			errorThreshold = value;
  		}
  	}]);
  	return VoxelCell;
  }(CubicOctant);

  function getCell(cell, n, x, y, z) {

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

  		function SparseVoxelOctree(data) {
  				var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
  				var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  				classCallCheck(this, SparseVoxelOctree);

  				var _this = possibleConstructorReturn(this, (SparseVoxelOctree.__proto__ || Object.getPrototypeOf(SparseVoxelOctree)).call(this));

  				_this.root = new VoxelCell(min, size);

  				_this.voxelCount = 0;

  				if (data !== null && data.edgeData !== null) {

  						_this.construct(data);
  				}

  				if (VoxelCell.errorThreshold >= 0) {

  						_this.simplify();
  				}

  				return _this;
  		}

  		createClass(SparseVoxelOctree, [{
  				key: "simplify",
  				value: function simplify() {

  						this.voxelCount -= this.root.collapse();
  				}
  		}, {
  				key: "construct",
  				value: function construct(data) {

  						var n = HermiteData.resolution;
  						var edgeData = data.edgeData;
  						var materialIndices = data.materialIndices;

  						var qefSolver = new QEFSolver();
  						var intersection = new Vector3();

  						var edgeIterators = [edgeData.edgesX(this.min, this.root.size), edgeData.edgesY(this.min, this.root.size), edgeData.edgesZ(this.min, this.root.size)];

  						var sequences = [new Uint8Array([0, 1, 2, 3]), new Uint8Array([0, 1, 4, 5]), new Uint8Array([0, 2, 4, 6])];

  						var voxelCount = 0;

  						var edges$$1 = void 0,
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
  								edges$$1 = edgeIterators[d];

  								var _iteratorNormalCompletion = true;
  								var _didIteratorError = false;
  								var _iteratorError = undefined;

  								try {
  										for (var _iterator = edges$$1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  												edge = _step.value;


  												edge.computeZeroCrossingPosition(intersection);

  												for (i = 0; i < 4; ++i) {
  														offset = pattern[sequence[i]];

  														x = edge.coordinates.x - offset[0];
  														y = edge.coordinates.y - offset[1];
  														z = edge.coordinates.z - offset[2];

  														if (x >= 0 && y >= 0 && z >= 0 && x < n && y < n && z < n) {

  																cell = getCell(this.root, n, x, y, z);

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

  var cellSize = 0;

  var cellPosition = new Vector3();

  function computeIndexBounds(operation) {

  	var s = cellSize;
  	var n = HermiteData.resolution;

  	var min = new Vector3(0, 0, 0);
  	var max = new Vector3(n, n, n);

  	var cellBounds = new Box3(cellPosition, cellPosition.clone().addScalar(cellSize));
  	var operationBounds = operation.getBoundingBox();

  	if (operation.type !== OperationType.INTERSECTION) {

  		if (operationBounds.intersectsBox(cellBounds)) {

  			min.copy(operationBounds.min).max(cellBounds.min).sub(cellBounds.min);

  			min.x = Math.ceil(min.x * n / s);
  			min.y = Math.ceil(min.y * n / s);
  			min.z = Math.ceil(min.z * n / s);

  			max.copy(operationBounds.max).min(cellBounds.max).sub(cellBounds.min);

  			max.x = Math.floor(max.x * n / s);
  			max.y = Math.floor(max.y * n / s);
  			max.z = Math.floor(max.z * n / s);
  		} else {
  			min.set(n, n, n);
  			max.set(0, 0, 0);
  		}
  	}

  	return new Box3(min, max);
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
  	var offset = new Vector3();
  	var position = new Vector3();

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

  	var edgeData = new EdgeData(n, Math.min(edgeCount, edgeData0.indices[0].length + edgeData1.indices[0].length), Math.min(edgeCount, edgeData0.indices[1].length + edgeData1.indices[1].length), Math.min(edgeCount, edgeData0.indices[2].length + edgeData1.indices[2].length));

  	var edges1 = void 0,
  	    zeroCrossings1 = void 0,
  	    normals1 = void 0;
  	var edges0 = void 0,
  	    zeroCrossings0 = void 0,
  	    normals0 = void 0;
  	var edges$$1 = void 0,
  	    zeroCrossings = void 0,
  	    normals = void 0;
  	var indexOffset = void 0;

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
  		edges$$1 = edgeData.indices[d];

  		zeroCrossings1 = edgeData1.zeroCrossings[d];
  		zeroCrossings0 = edgeData0.zeroCrossings[d];
  		zeroCrossings = edgeData.zeroCrossings[d];

  		normals1 = edgeData1.normals[d];
  		normals0 = edgeData0.normals[d];
  		normals = edgeData.normals[d];

  		indexOffset = indexOffsets[d];

  		il = edges1.length;
  		jl = edges0.length;

  		for (i = 0, j = 0; i < il; ++i) {

  			indexA1 = edges1[i];
  			indexB1 = indexA1 + indexOffset;

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
  					indexB0 = indexA0 + indexOffset;

  					edge0.t = zeroCrossings0[j];
  					edge0.n.x = normals0[j * 3];
  					edge0.n.y = normals0[j * 3 + 1];
  					edge0.n.z = normals0[j * 3 + 2];

  					m1 = materialIndices[indexA0];

  					if (indexA0 < indexA1) {

  						m2 = materialIndices[indexB0];

  						if (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {
  							edges$$1[c] = indexA0;
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

  				edges$$1[c] = indexA1;
  				zeroCrossings[c] = edge.t;
  				normals[c * 3] = edge.n.x;
  				normals[c * 3 + 1] = edge.n.y;
  				normals[c * 3 + 2] = edge.n.z;

  				++c;
  			}
  		}

  		while (j < jl) {

  			indexA0 = edges0[j];
  			indexB0 = indexA0 + indexOffset;

  			m1 = materialIndices[indexA0];
  			m2 = materialIndices[indexB0];

  			if (m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

  				edges$$1[c] = indexA0;
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
  	var offsetA = new Vector3();
  	var offsetB = new Vector3();
  	var edge = new Edge();

  	var lengths = new Uint32Array(3);
  	var edgeData = new EdgeData(n, EdgeData.calculate1DEdgeCount(n));

  	var edges$$1 = void 0,
  	    zeroCrossings = void 0,
  	    normals = void 0,
  	    indexOffset = void 0;
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

  		edges$$1 = edgeData.indices[d];
  		zeroCrossings = edgeData.zeroCrossings[d];
  		normals = edgeData.normals[d];
  		indexOffset = indexOffsets[d];

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
  					indexB = indexA + indexOffset;

  					if (materialIndices[indexA] !== materialIndices[indexB]) {

  						offsetA.set(x * s / n, y * s / n, z * s / n);

  						offsetB.set((x + axis[0]) * s / n, (y + axis[1]) * s / n, (z + axis[2]) * s / n);

  						edge.a.addVectors(base, offsetA);
  						edge.b.addVectors(base, offsetB);

  						operation.generateEdge(edge);

  						edges$$1[c] = indexA;
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

  function update$1(operation, data0, data1) {

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

  		update$1(operation, result);
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
  				update$1(operation, result, data);
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

  				update$1(operation, data, generatedData);

  				data.contoured = false;
  			}

  			return data !== null && data.empty ? null : data;
  		}
  	}]);
  	return ConstructiveSolidGeometry;
  }();

  var data = new HermiteData(false);

  var DataProcessor = function () {
  	function DataProcessor() {
  		classCallCheck(this, DataProcessor);


  		this.data = null;

  		this.response = null;
  	}

  	createClass(DataProcessor, [{
  		key: "getData",
  		value: function getData() {

  			return this.data;
  		}
  	}, {
  		key: "respond",
  		value: function respond() {

  			this.response.data = this.data.serialize();

  			return this.response;
  		}
  	}, {
  		key: "createTransferList",
  		value: function createTransferList() {
  			var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  			if (this.data !== null) {

  				this.data.createTransferList(transferList);
  			}

  			return transferList;
  		}
  	}, {
  		key: "process",
  		value: function process(request) {

  			this.data = data.deserialize(request.data);

  			return this;
  		}
  	}]);
  	return DataProcessor;
  }();

  var SurfaceExtractor = function (_DataProcessor) {
  		inherits(SurfaceExtractor, _DataProcessor);

  		function SurfaceExtractor() {
  				classCallCheck(this, SurfaceExtractor);

  				var _this = possibleConstructorReturn(this, (SurfaceExtractor.__proto__ || Object.getPrototypeOf(SurfaceExtractor)).call(this));

  				_this.response = new ExtractionResponse();

  				_this.decompressionTarget = new HermiteData(false);

  				_this.isosurface = null;

  				return _this;
  		}

  		createClass(SurfaceExtractor, [{
  				key: "respond",
  				value: function respond() {

  						var response = get(SurfaceExtractor.prototype.__proto__ || Object.getPrototypeOf(SurfaceExtractor.prototype), "respond", this).call(this);

  						response.isosurface = this.isosurface !== null ? this.isosurface.serialise() : null;

  						return response;
  				}
  		}, {
  				key: "createTransferList",
  				value: function createTransferList() {
  						var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  						get(SurfaceExtractor.prototype.__proto__ || Object.getPrototypeOf(SurfaceExtractor.prototype), "createTransferList", this).call(this, transferList);

  						return this.isosurface !== null ? this.isosurface.createTransferList(transferList) : transferList;
  				}
  		}, {
  				key: "process",
  				value: function process(request) {
  						var data = get(SurfaceExtractor.prototype.__proto__ || Object.getPrototypeOf(SurfaceExtractor.prototype), "process", this).call(this, request).getData();

  						var svo = new SparseVoxelOctree(data.decompress(this.decompressionTarget));

  						this.isosurface = DualContouring.run(svo);

  						this.decompressionTarget.clear();

  						return this;
  				}
  		}]);
  		return SurfaceExtractor;
  }(DataProcessor);

  var VolumeModifier = function (_DataProcessor) {
  		inherits(VolumeModifier, _DataProcessor);

  		function VolumeModifier() {
  				classCallCheck(this, VolumeModifier);

  				var _this = possibleConstructorReturn(this, (VolumeModifier.__proto__ || Object.getPrototypeOf(VolumeModifier)).call(this));

  				_this.response = new ModificationResponse();

  				_this.sdf = null;

  				return _this;
  		}

  		createClass(VolumeModifier, [{
  				key: "respond",
  				value: function respond() {
  						var response = get(VolumeModifier.prototype.__proto__ || Object.getPrototypeOf(VolumeModifier.prototype), "respond", this).call(this);

  						response.sdf = this.sdf !== null ? this.sdf.serialize() : null;

  						return response;
  				}
  		}, {
  				key: "createTransferList",
  				value: function createTransferList() {
  						var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];


  						get(VolumeModifier.prototype.__proto__ || Object.getPrototypeOf(VolumeModifier.prototype), "createTransferList", this).call(this, transferList);

  						return this.sdf !== null ? this.sdf.createTransferList(transferList) : transferList;
  				}
  		}, {
  				key: "process",
  				value: function process(request) {
  						var data = get(VolumeModifier.prototype.__proto__ || Object.getPrototypeOf(VolumeModifier.prototype), "process", this).call(this, request).getData();

  						var sdf = this.sdf = SDFReviver.revive(request.sdf);

  						var result = ConstructiveSolidGeometry.run(request.cellPosition, request.cellSize, data, sdf);

  						set(VolumeModifier.prototype.__proto__ || Object.getPrototypeOf(VolumeModifier.prototype), "data", result !== null ? result.compress() : null, this);

  						return this;
  				}
  		}]);
  		return VolumeModifier;
  }(DataProcessor);

  exports.Deserializable = Deserializable;
  exports.Disposable = Disposable;
  exports.Queue = Queue;
  exports.Serializable = Serializable;
  exports.Terrain = Terrain;
  exports.TransferableContainer = TransferableContainer;
  exports.Clipmap = Clipmap;
  exports.Scene = Scene;
  exports.RunLengthEncoding = RunLengthEncoding;
  exports.SDFLoaderEvent = SDFLoaderEvent;
  exports.TerrainEvent = TerrainEvent;
  exports.WorkerEvent = WorkerEvent;
  exports.DualContouring = DualContouring;
  exports.Isosurface = Isosurface;
  exports.SDFLoader = SDFLoader;
  exports.Givens = Givens;
  exports.QEFSolver = QEFSolver;
  exports.QEFData = QEFData;
  exports.Schur = Schur;
  exports.SingularValueDecomposition = SingularValueDecomposition;
  exports.IntermediateWorldOctant = IntermediateWorldOctant;
  exports.KeyDesign = KeyDesign;
  exports.KeyIterator = KeyIterator;
  exports.SparseVoxelOctree = SparseVoxelOctree;
  exports.VoxelCell = VoxelCell;
  exports.WorldOctant = WorldOctant;
  exports.WorldOctantId = WorldOctantId;
  exports.WorldOctantIterator = WorldOctantIterator;
  exports.WorldOctantWrapper = WorldOctantWrapper;
  exports.WorldOctree = WorldOctree;
  exports.WorldOctreeCSG = WorldOctreeCSG;
  exports.WorldOctreeRaycaster = WorldOctreeRaycaster;
  exports.BinaryUtils = BinaryUtils;
  exports.Edge = Edge;
  exports.EdgeData = EdgeData;
  exports.EdgeIterator = EdgeIterator;
  exports.HermiteData = HermiteData;
  exports.Material = Material;
  exports.Voxel = Voxel;
  exports.ConstructiveSolidGeometry = ConstructiveSolidGeometry;
  exports.Difference = Difference;
  exports.Intersection = Intersection;
  exports.OperationType = OperationType;
  exports.Union = Union;
  exports.FractalNoise = FractalNoise;
  exports.Heightfield = Heightfield;
  exports.SDFType = SDFType;
  exports.SignedDistanceFunction = SignedDistanceFunction;
  exports.SuperPrimitive = SuperPrimitive;
  exports.SuperPrimitivePreset = SuperPrimitivePreset;
  exports.Action = Action;
  exports.DataProcessor = DataProcessor;
  exports.SurfaceExtractor = SurfaceExtractor;
  exports.ThreadPool = ThreadPool;
  exports.VolumeModifier = VolumeModifier;
  exports.ConfigurationMessage = ConfigurationMessage;
  exports.DataMessage = DataMessage;
  exports.Message = Message;
  exports.ExtractionRequest = ExtractionRequest;
  exports.ExtractionResponse = ExtractionResponse;
  exports.ModificationRequest = ModificationRequest;
  exports.ModificationResponse = ModificationResponse;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
