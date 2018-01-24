/**
 * rabbit-hole v0.0.0 build Jan 24 2018
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

  var Disposable = function () {
  	function Disposable() {
  		classCallCheck(this, Disposable);
  	}

  	createClass(Disposable, [{
  		key: "dispose",
  		value: function dispose() {

  			throw new Error("Disposable#dispose method not implemented!");
  		}
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
  			throw new Error("TransferableContainer#createTransferList method not implemented!");
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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


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

  var points = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];

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
  		key: "getBoundingSphere",
  		value: function getBoundingSphere() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Sphere();


  			this.getCenter(target.center);

  			target.radius = this.getSize(v).length() * 0.5;

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
  		value: function applyMatrix4(m) {

  			var min = this.min;
  			var max = this.max;

  			if (!this.isEmpty()) {

  				points[0].set(min.x, min.y, min.z).applyMatrix4(m);
  				points[1].set(min.x, min.y, max.z).applyMatrix4(m);
  				points[2].set(min.x, max.y, min.z).applyMatrix4(m);
  				points[3].set(min.x, max.y, max.z).applyMatrix4(m);
  				points[4].set(max.x, min.y, min.z).applyMatrix4(m);
  				points[5].set(max.x, min.y, max.z).applyMatrix4(m);
  				points[6].set(max.x, max.y, min.z).applyMatrix4(m);
  				points[7].set(max.x, max.y, max.z).applyMatrix4(m);

  				this.setFromPoints(points);
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
  		key: "getBoundingBox",
  		value: function getBoundingBox() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Box3();


  			target.set(this.center, this.center);
  			target.expandByScalar(this.radius);

  			return target;
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

  var v$1 = new Vector2();

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

  			target.radius = this.getSize(v$1).length() * 0.5;

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

  			var halfSize = v$1.copy(size).multiplyScalar(0.5);

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

  			var clampedPoint = v$1.copy(p).clamp(this.min, this.max);

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
  				value: function equals(matrix) {

  						var te = this.elements;
  						var me = matrix.elements;

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

    XYZ: 0,
    YZX: 1,
    ZXY: 2,
    XZY: 3,
    YXZ: 4,
    ZYX: 5

  };

  var v$2 = new Vector3();

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

  					v$2.set(-vFrom.y, vFrom.x, 0);
  				} else {

  					v$2.set(0, -vFrom.z, vFrom.y);
  				}
  			} else {

  				v$2.crossVectors(vFrom, vTo);
  			}

  			this.x = v$2.x;
  			this.y = v$2.y;
  			this.z = v$2.z;
  			this.w = r;

  			return this.normalize();
  		}
  	}, {
  		key: "invert",
  		value: function invert() {

  			return this.conjugate().normalize();
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
  			    sinHalfTheta = void 0;
  			var halfTheta = void 0,
  			    ratioA = void 0,
  			    ratioB = void 0;

  			if (t === 1) {

  				this.copy(q);
  			} else if (t > 0) {

  				cosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;

  				if (cosHalfTheta < 0) {

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

  					return this;
  				}

  				sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

  				if (Math.abs(sinHalfTheta) < 1e-3) {

  					this.w = 0.5 * (w + this.w);
  					this.x = 0.5 * (x + this.x);
  					this.y = 0.5 * (y + this.y);
  					this.z = 0.5 * (z + this.z);

  					return this;
  				}

  				halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
  				ratioA = Math.sin((1.0 - t) * halfTheta) / sinHalfTheta;
  				ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

  				this.w = w * ratioA + this.w * ratioB;
  				this.x = x * ratioA + this.x * ratioB;
  				this.y = y * ratioA + this.y * ratioB;
  				this.z = z * ratioA + this.z * ratioB;
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

  var v0 = new Vector3();

  var v1 = new Vector3();

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
  			var min = box.min;
  			var max = box.max;

  			var result = true;
  			var i = void 0,
  			    d0 = void 0,
  			    d1 = void 0;
  			var plane = void 0;

  			for (i = 0; i < 6; ++i) {

  				plane = planes[i];

  				v0.x = plane.normal.x > 0 ? min.x : max.x;
  				v1.x = plane.normal.x > 0 ? max.x : min.x;
  				v0.y = plane.normal.y > 0 ? min.y : max.y;
  				v1.y = plane.normal.y > 0 ? max.y : min.y;
  				v0.z = plane.normal.z > 0 ? min.z : max.z;
  				v1.z = plane.normal.z > 0 ? max.z : min.z;

  				d0 = plane.distanceToPoint(v0);
  				d1 = plane.distanceToPoint(v1);

  				if (d0 < 0 && d1 < 0) {

  					result = false;
  					break;
  				}
  			}

  			return result;
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

  						te[4] = me[4] * scaleY;
  						te[5] = me[5] * scaleY;
  						te[6] = me[6] * scaleY;

  						te[8] = me[8] * scaleZ;
  						te[9] = me[9] * scaleZ;
  						te[10] = me[10] * scaleZ;

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

  						var te = this.elements;

  						var x = q.x,
  						    y = q.y,
  						    z = q.z,
  						    w = q.w;
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

  						te[0] = 1 - (yy + zz);
  						te[4] = xy - wz;
  						te[8] = xz + wy;

  						te[1] = xy + wz;
  						te[5] = 1 - (xx + zz);
  						te[9] = yz - wx;

  						te[2] = xz - wy;
  						te[6] = yz + wx;
  						te[10] = 1 - (xx + yy);

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

  						this.makeRotationFromQuaternion(quaternion);
  						this.scale(scale.x, scale.y, scale.z);
  						this.setPosition(position);

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
  				value: function equals(matrix) {

  						var te = this.elements;
  						var me = matrix.elements;

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

  var v$3 = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];

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

  			this.origin.copy(this.at(t, v$3[0]));

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

  			var directionDistance = v$3[0].subVectors(p, this.origin).dot(this.direction);

  			return directionDistance < 0.0 ? this.origin.distanceToSquared(p) : v$3[0].copy(this.direction).multiplyScalar(directionDistance).add(this.origin).distanceToSquared(p);
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

  			var segCenter = v$3[0].copy(v0).add(v1).multiplyScalar(0.5);
  			var segDir = v$3[1].copy(v1).sub(v0).normalize();
  			var diff = v$3[2].copy(this.origin).sub(segCenter);

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


  			var ab = v$3[0].subVectors(s.center, this.origin);
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

  			return this.intersectBox(b, v$3[0]) !== null;
  		}
  	}, {
  		key: "intersectTriangle",
  		value: function intersectTriangle(a, b, c, backfaceCulling, target) {

  			var direction = this.direction;

  			var diff = v$3[0];
  			var edge1 = v$3[1];
  			var edge2 = v$3[2];
  			var normal = v$3[3];

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
  		value: function equals(matrix) {

  			var te = this.elements;
  			var me = matrix.elements;

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

  								index = indices[depth];
  								children = trace[depth].children;

  								++indices[depth];

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

  var v$4 = [new Vector3(), new Vector3(), new Vector3()];

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

  			var dimensions = octree.getDimensions(v$4[0]);
  			var halfDimensions = v$4[1].copy(dimensions).multiplyScalar(0.5);

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

  			origin.sub(octree.getCenter(v$4[2])).add(halfDimensions);

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

  var b$6 = new Box3();

  var c$3 = new Vector3();

  var u = new Vector3();

  var v$5 = new Vector3();

  var OctreeUtils = function () {
  	function OctreeUtils() {
  		classCallCheck(this, OctreeUtils);
  	}

  	createClass(OctreeUtils, null, [{
  		key: "recycleOctants",
  		value: function recycleOctants(octant, octants) {

  			var min = octant.min;
  			var mid = octant.getCenter(u);
  			var halfDimensions = octant.getDimensions(v$5).multiplyScalar(0.5);

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

  var v$6 = new Vector3();

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

  								p$1.addVectors(this.a, v$6.copy(ab).multiplyScalar(c));
  								densityC = sdf.sample(p$1);

  								if (Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {
  										break;
  								} else {

  										p$1.addVectors(this.a, v$6.copy(ab).multiplyScalar(a));
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

  						var dx = sdf.sample(p$1.addVectors(position, v$6.set(E, 0, 0))) - sdf.sample(p$1.subVectors(position, v$6.set(E, 0, 0)));
  						var dy = sdf.sample(p$1.addVectors(position, v$6.set(0, E, 0))) - sdf.sample(p$1.subVectors(position, v$6.set(0, E, 0)));
  						var dz = sdf.sample(p$1.addVectors(position, v$6.set(0, 0, E))) - sdf.sample(p$1.subVectors(position, v$6.set(0, 0, E)));

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

  var isovalue = 0.0;

  var resolution = 0;

  var indexCount = 0;

  function ceil2(n) {

  	return Math.pow(2, Math.max(0, Math.ceil(Math.log2(n))));
  }

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
  						this.edgeData = new EdgeData();
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

  			resolution = Math.max(1, Math.min(256, ceil2(value)));
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

  var v$7 = new Vector3();

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

  							keyDesign.unpackKey(key, v$7);
  							v$7.x <<= 1;v$7.y <<= 1;v$7.z <<= 1;

  							for (i = 0; i < 8; ++i) {

  								offset = pattern[i];

  								p$2.set(v$7.x + offset[0], v$7.y + offset[1], v$7.z + offset[2]);

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

  						keyDesign.unpackKey(key, v$7);

  						_applyDifference(world, sdf, grid.get(key), v$7.x, v$7.y, v$7.z, lod);
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

  var v$8 = new Vector3();

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
  			octantWrapper.id.set(lod, keyDesign.packKey(v$8.set(keyX, keyY, keyZ)));
  			octantWrapper.min.copy(v$8).multiplyScalar(cellSize).add(world.min);
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
  								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, tx0, ty0, tz0, txm, tym, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, tym, tzm);
  							break;
  						}

  					case 1:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, tx0, ty0, tzm, txm, tym, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, tym, tz1);
  							break;
  						}

  					case 2:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, tx0, tym, tz0, txm, ty1, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, ty1, tzm);
  							break;
  						}

  					case 3:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, tx0, tym, tzm, txm, ty1, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, ty1, tz1);
  							break;
  						}

  					case 4:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, txm, ty0, tz0, tx1, tym, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, tym, tzm);
  							break;
  						}

  					case 5:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, txm, ty0, tzm, tx1, tym, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, tym, tz1);
  							break;
  						}

  					case 6:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, txm, tym, tz0, tx1, ty1, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, ty1, tzm);
  							break;
  						}

  					case 7:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$8.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$8)), v$8.x, v$8.y, v$8.z, lod, txm, tym, tzm, tx1, ty1, tz1, intersects);
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

  	origin.sub(subtree.getCenter(v$8)).add(halfDimensions);

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
  				b = r$1.at(t, v$8);

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

  var v$9 = new Vector3();

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

  				v$9.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);

  				key = keyDesign.packKey(v$9);

  				child = grid.get(key);
  				grid.delete(key);

  				removeChildren(world, child, v$9.x, v$9.y, v$9.z, lod);
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

  		v$9.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);

  		key = world.getKeyDesign().packKey(v$9);
  		parent = grid.get(key);

  		parent.children &= ~(1 << i);

  		if (parent.children === 0) {
  			grid.delete(key);
  			prune(world, v$9.x, v$9.y, v$9.z, lod);
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

  			v$9.subVectors(position, this.min);

  			target.set(Math.trunc(v$9.x / cellSize), Math.trunc(v$9.y / cellSize), Math.trunc(v$9.z / cellSize));

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

  					this.calculateKeyCoordinates(point, lod, v$9);
  					result = grid.get(keyDesign.packKey(v$9));
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
  					keyDesign.unpackKey(key, v$9);
  					keyX = v$9.x;keyY = v$9.y;keyZ = v$9.z;

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

  var worker = "!function(){\"use strict\";var t=function(t,i){if(!(t instanceof i))throw new TypeError(\"Cannot call a class as a function\")},i=function(){function t(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(i,e,n){return e&&t(i.prototype,e),n&&t(i,n),i}}(),e=function t(i,e,n){null===i&&(i=Function.prototype);var s=Object.getOwnPropertyDescriptor(i,e);if(void 0===s){var r=Object.getPrototypeOf(i);return null===r?void 0:t(r,e,n)}if(\"value\"in s)return s.value;var a=s.get;if(void 0!==a)return a.call(n)},n=function(t,i){if(\"function\"!=typeof i&&null!==i)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof i);t.prototype=Object.create(i&&i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),i&&(Object.setPrototypeOf?Object.setPrototypeOf(t,i):t.__proto__=i)},s=function(t,i){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!i||\"object\"!=typeof i&&\"function\"!=typeof i?t:i},r=function(t){if(Array.isArray(t)){for(var i=0,e=Array(t.length);i<t.length;i++)e[i]=t[i];return e}return Array.from(t)},a=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;t(this,e),this.runLengths=i,this.data=n}return i(e,null,[{key:\"encode\",value:function(t){var i=[],n=[],s=t[0],r=1,a=void 0,o=void 0;for(a=1,o=t.length;a<o;++a)s!==t[a]?(i.push(r),n.push(s),s=t[a],r=1):++r;return i.push(r),n.push(s),new e(i,n)}},{key:\"decode\",value:function(t,i){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=void 0,s=void 0,r=void 0,a=void 0,o=void 0,h=0;for(s=0,a=i.length;s<a;++s)for(n=i[s],r=0,o=t[s];r<o;++r)e[h++]=n;return e}}]),e}(),o=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;t(this,e),this.x=i,this.y=n,this.z=s}return i(e,[{key:\"set\",value:function(t,i,e){return this.x=t,this.y=i,this.z=e,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}},{key:\"setFromSpherical\",value:function(t){var i=Math.sin(t.phi)*t.radius;return this.x=i*Math.sin(t.theta),this.y=Math.cos(t.phi)*t.radius,this.z=i*Math.cos(t.theta),this}},{key:\"setFromCylindrical\",value:function(t){return this.x=t.radius*Math.sin(t.theta),this.y=t.y,this.z=t.radius*Math.cos(t.theta),this}},{key:\"setFromMatrixColumn\",value:function(t,i){return this.fromArray(t.elements,4*i)}},{key:\"setFromMatrixPosition\",value:function(t){var i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}},{key:\"setFromMatrixScale\",value:function(t){var i=this.setFromMatrixColumn(t,0).length(),e=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=e,this.z=n,this}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this.z+=t,this}},{key:\"addVectors\",value:function(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}},{key:\"addScaledVector\",value:function(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this.z-=t,this}},{key:\"subVectors\",value:function(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}},{key:\"multiplyScalar\",value:function(t){return this.x*=t,this.y*=t,this.z*=t,this}},{key:\"multiplyVectors\",value:function(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}},{key:\"divideScalar\",value:function(t){return this.x/=t,this.y/=t,this.z/=t,this}},{key:\"crossVectors\",value:function(t,i){var e=t.x,n=t.y,s=t.z,r=i.x,a=i.y,o=i.z;return this.x=n*o-s*a,this.y=s*r-e*o,this.z=e*a-n*r,this}},{key:\"cross\",value:function(t){return this.crossVectors(this,t)}},{key:\"transformDirection\",value:function(t){var i=this.x,e=this.y,n=this.z,s=t.elements;return this.x=s[0]*i+s[4]*e+s[8]*n,this.y=s[1]*i+s[5]*e+s[9]*n,this.z=s[2]*i+s[6]*e+s[10]*n,this.normalize()}},{key:\"applyMatrix3\",value:function(t){var i=this.x,e=this.y,n=this.z,s=t.elements;return this.x=s[0]*i+s[3]*e+s[6]*n,this.y=s[1]*i+s[4]*e+s[7]*n,this.z=s[2]*i+s[5]*e+s[8]*n,this}},{key:\"applyMatrix4\",value:function(t){var i=this.x,e=this.y,n=this.z,s=t.elements;return this.x=s[0]*i+s[4]*e+s[8]*n+s[12],this.y=s[1]*i+s[5]*e+s[9]*n+s[13],this.z=s[2]*i+s[6]*e+s[10]*n+s[14],this}},{key:\"applyQuaternion\",value:function(t){var i=this.x,e=this.y,n=this.z,s=t.x,r=t.y,a=t.z,o=t.w,h=o*i+r*n-a*e,u=o*e+a*i-s*n,l=o*n+s*e-r*i,c=-s*i-r*e-a*n;return this.x=h*o+c*-s+u*-a-l*-r,this.y=u*o+c*-r+l*-s-h*-a,this.z=l*o+c*-a+h*-r-u*-s,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z}},{key:\"reflect\",value:function(t){arguments.length>1&&void 0!==arguments[1]?arguments[1]:new e;var i=t.x,n=t.y,s=t.z;return this.sub(t.multiplyScalar(2*this.dot(t))),t.set(i,n,s),this}},{key:\"angleTo\",value:function(t){var i=this.dot(t)/Math.sqrt(this.lengthSquared()*t.lengthSquared());return Math.acos(Math.min(Math.max(i,-1),1))}},{key:\"manhattanLength\",value:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"manhattanDistanceTo\",value:function(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}},{key:\"distanceToSquared\",value:function(t){var i=this.x-t.x,e=this.y-t.y,n=this.z-t.z;return i*i+e*e+n*n}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(t){return this.normalize().multiplyScalar(t)}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}},{key:\"clamp\",value:function(t,i){return this.x=Math.max(t.x,Math.min(i.x,this.x)),this.y=Math.max(t.y,Math.min(i.y,this.y)),this.z=Math.max(t.z,Math.min(i.z,this.z)),this}},{key:\"floor\",value:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}},{key:\"ceil\",value:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}},{key:\"round\",value:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}},{key:\"lerp\",value:function(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}},{key:\"lerpVectors\",value:function(t,i,e){return this.subVectors(i,t).multiplyScalar(e).add(t)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}}]),e}(),h=new o,u=[new o,new o,new o,new o,new o,new o,new o,new o],l=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o(1/0,1/0,1/0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o(-1/0,-1/0,-1/0);t(this,e),this.min=i,this.max=n}return i(e,[{key:\"set\",value:function(t,i){return this.min.copy(t),this.max.copy(i),this}},{key:\"copy\",value:function(t){return this.min.copy(t.min),this.max.copy(t.max),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}},{key:\"getCenter\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o;return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o;return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}},{key:\"getBoundingSphere\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new y;return this.getCenter(t.center),t.radius=.5*this.getSize(h).length(),t}},{key:\"expandByPoint\",value:function(t){return this.min.min(t),this.max.max(t),this}},{key:\"expandByVector\",value:function(t){return this.min.sub(t),this.max.add(t),this}},{key:\"expandByScalar\",value:function(t){return this.min.addScalar(-t),this.max.addScalar(t),this}},{key:\"setFromPoints\",value:function(t){var i=void 0,e=void 0;for(this.min.set(0,0,0),this.max.set(0,0,0),i=0,e=t.length;i<e;++i)this.expandByPoint(t[i]);return this}},{key:\"setFromCenterAndSize\",value:function(t,i){var e=h.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(e),this.max.copy(t).add(e),this}},{key:\"clampPoint\",value:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o).copy(t).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(t){return h.copy(t).clamp(this.min,this.max).sub(t).length()}},{key:\"applyMatrix4\",value:function(t){var i=this.min,e=this.max;return this.isEmpty()||(u[0].set(i.x,i.y,i.z).applyMatrix4(t),u[1].set(i.x,i.y,e.z).applyMatrix4(t),u[2].set(i.x,e.y,i.z).applyMatrix4(t),u[3].set(i.x,e.y,e.z).applyMatrix4(t),u[4].set(e.x,i.y,i.z).applyMatrix4(t),u[5].set(e.x,i.y,e.z).applyMatrix4(t),u[6].set(e.x,e.y,i.z).applyMatrix4(t),u[7].set(e.x,e.y,e.z).applyMatrix4(t),this.setFromPoints(u)),this}},{key:\"translate\",value:function(t){return this.min.add(t),this.max.add(t),this}},{key:\"intersect\",value:function(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(t){return this.min.min(t.min),this.max.max(t.max),this}},{key:\"containsPoint\",value:function(t){var i=this.min,e=this.max;return t.x>=i.x&&t.y>=i.y&&t.z>=i.z&&t.x<=e.x&&t.y<=e.y&&t.z<=e.z}},{key:\"containsBox\",value:function(t){var i=this.min,e=this.max,n=t.min,s=t.max;return i.x<=n.x&&s.x<=e.x&&i.y<=n.y&&s.y<=e.y&&i.z<=n.z&&s.z<=e.z}},{key:\"intersectsBox\",value:function(t){var i=this.min,e=this.max,n=t.min,s=t.max;return s.x>=i.x&&s.y>=i.y&&s.z>=i.z&&n.x<=e.x&&n.y<=e.y&&n.z<=e.z}},{key:\"intersectsSphere\",value:function(t){return this.clampPoint(t.center,h).distanceToSquared(t.center)<=t.radius*t.radius}},{key:\"intersectsPlane\",value:function(t){var i=void 0,e=void 0;return t.normal.x>0?(i=t.normal.x*this.min.x,e=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,e=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,e+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,e+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,e+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,e+=t.normal.z*this.min.z),i<=t.constant&&e>=t.constant}},{key:\"equals\",value:function(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}]),e}(),c=new l,y=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t(this,e),this.center=i,this.radius=n}return i(e,[{key:\"set\",value:function(t,i){return this.center.copy(t),this.radius=i,this}},{key:\"copy\",value:function(t){return this.center.copy(t.center),this.radius=t.radius,this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"setFromPoints\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c.setFromPoints(t).getCenter(this.center),e=0,n=void 0,s=void 0;for(n=0,s=t.length;n<s;++n)e=Math.max(e,i.distanceToSquared(t[n]));return this.radius=Math.sqrt(e),this}},{key:\"getBoundingBox\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new l;return t.set(this.center,this.center),t.expandByScalar(this.radius),t}},{key:\"isEmpty\",value:function(){return this.radius<=0}},{key:\"translate\",value:function(t){return this.center.add(t),this}},{key:\"clampPoint\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=this.center.distanceToSquared(t);return i.copy(t),e>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}},{key:\"distanceToPoint\",value:function(t){return t.distanceTo(this.center)-this.radius}},{key:\"containsPoint\",value:function(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}},{key:\"intersectsSphere\",value:function(t){var i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}},{key:\"intersectsBox\",value:function(t){return t.intersectsSphere(this)}},{key:\"intersectsPlane\",value:function(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}},{key:\"equals\",value:function(t){return t.center.equals(this.center)&&t.radius===this.radius}}]),e}(),v=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t(this,e),this.x=i,this.y=n}return i(e,[{key:\"set\",value:function(t,i){return this.x=t,this.y=i,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this}},{key:\"addVectors\",value:function(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}},{key:\"addScaledVector\",value:function(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this}},{key:\"subVectors\",value:function(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this}},{key:\"multiplyScalar\",value:function(t){return this.x*=t,this.y*=t,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this}},{key:\"divideScalar\",value:function(t){return this.x/=t,this.y/=t,this}},{key:\"applyMatrix3\",value:function(t){var i=this.x,e=this.y,n=t.elements;return this.x=n[0]*i+n[3]*e+n[6],this.y=n[1]*i+n[4]*e+n[7],this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y}},{key:\"manhattanLength\",value:function(){return Math.abs(this.x)+Math.abs(this.y)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y)}},{key:\"manhattanDistanceTo\",value:function(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}},{key:\"distanceToSquared\",value:function(t){var i=this.x-t.x,e=this.y-t.y;return i*i+e*e}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(t){return this.normalize().multiplyScalar(t)}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}},{key:\"clamp\",value:function(t,i){return this.x=Math.max(t.x,Math.min(i.x,this.x)),this.y=Math.max(t.y,Math.min(i.y,this.y)),this}},{key:\"floor\",value:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}},{key:\"ceil\",value:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}},{key:\"round\",value:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this}},{key:\"angle\",value:function(){var t=Math.atan2(this.y,this.x);return t<0&&(t+=2*Math.PI),t}},{key:\"lerp\",value:function(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}},{key:\"lerpVectors\",value:function(t,i,e){return this.subVectors(i,t).multiplyScalar(e).add(t)}},{key:\"rotateAround\",value:function(t,i){var e=Math.cos(i),n=Math.sin(i),s=this.x-t.x,r=this.y-t.y;return this.x=s*e-r*n+t.x,this.y=s*n+r*e+t.y,this}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y}},{key:\"width\",get:function(){return this.x},set:function(t){return this.x=t}},{key:\"height\",get:function(){return this.y},set:function(t){return this.y=t}}]),e}(),d=new v,f=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new v(1/0,1/0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new v(-1/0,-1/0);t(this,e),this.min=i,this.max=n}i(e,[{key:\"set\",value:function(t,i){return this.min.copy(t),this.max.copy(i),this}},{key:\"copy\",value:function(t){return this.min.copy(t.min),this.max.copy(t.max),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y}},{key:\"getCenter\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new v;return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new v;return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}},{key:\"getBoundingSphere\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new y;return this.getCenter(t.center),t.radius=.5*this.getSize(d).length(),t}},{key:\"expandByPoint\",value:function(t){return this.min.min(t),this.max.max(t),this}},{key:\"expandByVector\",value:function(t){return this.min.sub(t),this.max.add(t),this}},{key:\"expandByScalar\",value:function(t){return this.min.addScalar(-t),this.max.addScalar(t),this}},{key:\"setFromPoints\",value:function(t){var i=void 0,e=void 0;for(this.min.set(0,0),this.max.set(0,0),i=0,e=t.length;i<e;++i)this.expandByPoint(t[i]);return this}},{key:\"setFromCenterAndSize\",value:function(t,i){var e=d.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(e),this.max.copy(t).add(e),this}},{key:\"clampPoint\",value:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:new v).copy(t).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(t){return d.copy(t).clamp(this.min,this.max).sub(t).length()}},{key:\"translate\",value:function(t){return this.min.add(t),this.max.add(t),this}},{key:\"intersect\",value:function(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(t){return this.min.min(t.min),this.max.max(t.max),this}},{key:\"containsPoint\",value:function(t){var i=this.min,e=this.max;return t.x>=i.x&&t.y>=i.y&&t.x<=e.x&&t.y<=e.y}},{key:\"containsBox\",value:function(t){var i=this.min,e=this.max,n=t.min,s=t.max;return i.x<=n.x&&s.x<=e.x&&i.y<=n.y&&s.y<=e.y}},{key:\"intersectsBox\",value:function(t){var i=this.min,e=this.max,n=t.min,s=t.max;return s.x>=i.x&&s.y>=i.y&&n.x<=e.x&&n.y<=e.y}},{key:\"equals\",value:function(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}])}(),function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;t(this,e),this.radius=i,this.theta=n,this.y=s}i(e,[{key:\"set\",value:function(t,i,e){return this.radius=t,this.theta=i,this.y=e,this}},{key:\"copy\",value:function(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"setFromVector3\",value:function(t){return this.radius=Math.sqrt(t.x*t.x+t.z*t.z),this.theta=Math.atan2(t.x,t.z),this.y=t.y,this}}])}(),function(){function e(){t(this,e),this.elements=new Float32Array([1,0,0,0,1,0,0,0,1])}return i(e,[{key:\"set\",value:function(t,i,e,n,s,r,a,o,h){var u=this.elements;return u[0]=t,u[3]=i,u[6]=e,u[1]=n,u[4]=s,u[7]=r,u[2]=a,u[5]=o,u[8]=h,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,1,0,0,0,1),this}},{key:\"copy\",value:function(t){var i=t.elements,e=this.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}},{key:\"clone\",value:function(){return(new this.constructor).fromArray(this.elements)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=this.elements,n=void 0;for(n=0;n<9;++n)e[n]=t[n+i];return this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=this.elements,n=void 0;for(n=0;n<9;++n)t[n+i]=e[n];return t}},{key:\"multiplyMatrices\",value:function(t,i){var e=t.elements,n=i.elements,s=this.elements,r=e[0],a=e[3],o=e[6],h=e[1],u=e[4],l=e[7],c=e[2],y=e[5],v=e[8],d=n[0],f=n[3],m=n[6],x=n[1],p=n[4],k=n[7],g=n[2],w=n[5],z=n[8];return s[0]=r*d+a*x+o*g,s[3]=r*f+a*p+o*w,s[6]=r*m+a*k+o*z,s[1]=h*d+u*x+l*g,s[4]=h*f+u*p+l*w,s[7]=h*m+u*k+l*z,s[2]=c*d+y*x+v*g,s[5]=c*f+y*p+v*w,s[8]=c*m+y*k+v*z,this}},{key:\"multiply\",value:function(t){return this.multiplyMatrices(this,t)}},{key:\"premultiply\",value:function(t){return this.multiplyMatrices(t,this)}},{key:\"multiplyScalar\",value:function(t){var i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}},{key:\"determinant\",value:function(){var t=this.elements,i=t[0],e=t[1],n=t[2],s=t[3],r=t[4],a=t[5],o=t[6],h=t[7],u=t[8];return i*r*u-i*a*h-e*s*u+e*a*o+n*s*h-n*r*o}},{key:\"getInverse\",value:function(t){var i=t.elements,e=this.elements,n=i[0],s=i[1],r=i[2],a=i[3],o=i[4],h=i[5],u=i[6],l=i[7],c=i[8],y=c*o-h*l,v=h*u-c*a,d=l*a-o*u,f=n*y+s*v+r*d,m=void 0;return 0!==f?(m=1/f,e[0]=y*m,e[1]=(r*l-c*s)*m,e[2]=(h*s-r*o)*m,e[3]=v*m,e[4]=(c*n-r*u)*m,e[5]=(r*a-h*n)*m,e[6]=d*m,e[7]=(s*u-l*n)*m,e[8]=(o*n-s*a)*m):(console.error(\"Can't invert matrix, determinant is zero\",t),this.identity()),this}},{key:\"transpose\",value:function(){var t=this.elements,i=void 0;return i=t[1],t[1]=t[3],t[3]=i,i=t[2],t[2]=t[6],t[6]=i,i=t[5],t[5]=t[7],t[7]=i,this}},{key:\"scale\",value:function(t,i){var e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=i,e[4]*=i,e[7]*=i,this}},{key:\"rotate\",value:function(t){var i=Math.cos(t),e=Math.sin(t),n=this.elements,s=n[0],r=n[3],a=n[6],o=n[1],h=n[4],u=n[7];return n[0]=i*s+e*o,n[3]=i*r+e*h,n[6]=i*a+e*u,n[1]=-e*s+i*o,n[4]=-e*r+i*h,n[7]=-e*a+i*u,this}},{key:\"translate\",value:function(t,i){var e=this.elements;return e[0]+=t*e[2],e[3]+=t*e[5],e[6]+=t*e[8],e[1]+=i*e[2],e[4]+=i*e[5],e[7]+=i*e[8],this}},{key:\"equals\",value:function(t){var i=this.elements,e=t.elements,n=!0,s=void 0;for(s=0;n&&s<9;++s)i[s]!==e[s]&&(n=!1);return n}}]),e}()),m=0,x=1,p=2,k=3,g=4,w=5,z=new o,M=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;t(this,e),this.x=i,this.y=n,this.z=s,this.w=r}return i(e,[{key:\"set\",value:function(t,i,e,n){return this.x=t,this.y=i,this.z=e,this.w=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}},{key:\"setFromEuler\",value:function(t){var i=t.x,e=t.y,n=t.z,s=Math.cos,r=Math.sin,a=s(i/2),o=s(e/2),h=s(n/2),u=r(i/2),l=r(e/2),c=r(n/2);switch(t.order){case m:this.x=u*o*h+a*l*c,this.y=a*l*h-u*o*c,this.z=a*o*c+u*l*h,this.w=a*o*h-u*l*c;break;case g:this.x=u*o*h+a*l*c,this.y=a*l*h-u*o*c,this.z=a*o*c-u*l*h,this.w=a*o*h+u*l*c;break;case p:this.x=u*o*h-a*l*c,this.y=a*l*h+u*o*c,this.z=a*o*c+u*l*h,this.w=a*o*h-u*l*c;break;case w:this.x=u*o*h-a*l*c,this.y=a*l*h+u*o*c,this.z=a*o*c-u*l*h,this.w=a*o*h+u*l*c;break;case x:this.x=u*o*h+a*l*c,this.y=a*l*h+u*o*c,this.z=a*o*c-u*l*h,this.w=a*o*h-u*l*c;break;case k:this.x=u*o*h-a*l*c,this.y=a*l*h-u*o*c,this.z=a*o*c+u*l*h,this.w=a*o*h+u*l*c}return this}},{key:\"setFromAxisAngle\",value:function(t,i){var e=i/2,n=Math.sin(e);return this.x=t.x*n,this.y=t.y*n,this.z=t.z*n,this.w=Math.cos(e),this}},{key:\"setFromRotationMatrix\",value:function(t){var i=t.elements,e=i[0],n=i[4],s=i[8],r=i[1],a=i[5],o=i[9],h=i[2],u=i[6],l=i[10],c=e+a+l,y=void 0;return c>0?(y=.5/Math.sqrt(c+1),this.w=.25/y,this.x=(u-o)*y,this.y=(s-h)*y,this.z=(r-n)*y):e>a&&e>l?(y=2*Math.sqrt(1+e-a-l),this.w=(u-o)/y,this.x=.25*y,this.y=(n+r)/y,this.z=(s+h)/y):a>l?(y=2*Math.sqrt(1+a-e-l),this.w=(s-h)/y,this.x=(n+r)/y,this.y=.25*y,this.z=(o+u)/y):(y=2*Math.sqrt(1+l-e-a),this.w=(r-n)/y,this.x=(s+h)/y,this.y=(o+u)/y,this.z=.25*y),this}},{key:\"setFromUnitVectors\",value:function(t,i){var e=t.dot(i)+1;return e<1e-6?(e=0,Math.abs(t.x)>Math.abs(t.z)?z.set(-t.y,t.x,0):z.set(0,-t.z,t.y)):z.crossVectors(t,i),this.x=z.x,this.y=z.y,this.z=z.z,this.w=e,this.normalize()}},{key:\"invert\",value:function(){return this.conjugate().normalize()}},{key:\"conjugate\",value:function(){return this.x*=-1,this.y*=-1,this.z*=-1,this}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"normalize\",value:function(){var t=this.length(),i=void 0;return 0===t?(this.x=0,this.y=0,this.z=0,this.w=1):(i=1/t,this.x=this.x*i,this.y=this.y*i,this.z=this.z*i,this.w=this.w*i),this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}},{key:\"multiplyQuaternions\",value:function(t,i){var e=t.x,n=t.y,s=t.z,r=t.w,a=i.x,o=i.y,h=i.z,u=i.w;return this.x=e*u+r*a+n*h-s*o,this.y=n*u+r*o+s*a-e*h,this.z=s*u+r*h+e*o-n*a,this.w=r*u-e*a-n*o-s*h,this}},{key:\"multiply\",value:function(t){return this.multiplyQuaternions(this,t)}},{key:\"premultiply\",value:function(t){return this.multiplyQuaternions(t,this)}},{key:\"slerp\",value:function(t,i){var e=this.x,n=this.y,s=this.z,r=this.w,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0;if(1===i)this.copy(t);else if(i>0){if((a=r*t.w+e*t.x+n*t.y+s*t.z)<0?(this.w=-t.w,this.x=-t.x,this.y=-t.y,this.z=-t.z,a=-a):this.copy(t),a>=1)return this.w=r,this.x=e,this.y=n,this.z=s,this;if(o=Math.sqrt(1-a*a),Math.abs(o)<.001)return this.w=.5*(r+this.w),this.x=.5*(e+this.x),this.y=.5*(n+this.y),this.z=.5*(s+this.z),this;h=Math.atan2(o,a),u=Math.sin((1-i)*h)/o,l=Math.sin(i*h)/o,this.w=r*u+this.w*l,this.x=e*u+this.x*l,this.y=n*u+this.y*l,this.z=s*u+this.z*l}return this}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}}],[{key:\"slerp\",value:function(t,i,e,n){return e.copy(t).slerp(i,n)}},{key:\"slerpFlat\",value:function(t,i,e,n,s,r,a){var o=s[r],h=s[r+1],u=s[r+2],l=s[r+3],c=e[n],y=e[n+1],v=e[n+2],d=e[n+3],f=void 0,m=void 0,x=void 0,p=void 0,k=void 0,g=void 0,w=void 0,z=void 0;d===l&&c===o&&y===h&&v===u||(f=1-a,g=(p=c*o+y*h+v*u+d*l)>=0?1:-1,(k=1-p*p)>Number.EPSILON&&(x=Math.sqrt(k),w=Math.atan2(x,p*g),f=Math.sin(f*w)/x,a=Math.sin(a*w)/x),c=c*f+o*(z=a*g),y=y*f+h*z,v=v*f+u*z,d=d*f+l*z,f===1-a&&(c*=m=1/Math.sqrt(c*c+y*y+v*v+d*d),y*=m,v*=m,d*=m)),t[i]=c,t[i+1]=y,t[i+2]=v,t[i+3]=d}}]),e}();function b(t,i,e){return Math.max(Math.min(t,e),i)}var A=new f,S=new M,P=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;t(this,e),this.x=i,this.y=n,this.z=s,this.order=e.defaultOrder}i(e,[{key:\"set\",value:function(t,i,e,n){return this.x=t,this.y=i,this.z=e,this.order=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.order=t.order,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.order)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.order=t[i+3],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.order,t}},{key:\"toVector3\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).set(this.x,this.y,this.z)}},{key:\"setFromRotationMatrix\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.order,e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],h=e[9],u=e[2],l=e[6],c=e[10];switch(i){case m:this.y=Math.asin(b(r,-1,1)),Math.abs(r)<.99999?(this.x=Math.atan2(-h,c),this.z=Math.atan2(-s,n)):(this.x=Math.atan2(l,o),this.z=0);break;case g:this.x=Math.asin(-b(h,-1,1)),Math.abs(h)<.99999?(this.y=Math.atan2(r,c),this.z=Math.atan2(a,o)):(this.y=Math.atan2(-u,n),this.z=0);break;case p:this.x=Math.asin(b(l,-1,1)),Math.abs(l)<.99999?(this.y=Math.atan2(-u,c),this.z=Math.atan2(-s,o)):(this.y=0,this.z=Math.atan2(a,n));break;case w:this.y=Math.asin(-b(u,-1,1)),Math.abs(u)<.99999?(this.x=Math.atan2(l,c),this.z=Math.atan2(a,n)):(this.x=0,this.z=Math.atan2(-s,o));break;case x:this.z=Math.asin(b(a,-1,1)),Math.abs(a)<.99999?(this.x=Math.atan2(-h,o),this.y=Math.atan2(-u,n)):(this.x=0,this.y=Math.atan2(r,c));break;case k:this.z=Math.asin(-b(s,-1,1)),Math.abs(s)<.99999?(this.x=Math.atan2(l,o),this.y=Math.atan2(r,n)):(this.x=Math.atan2(-h,c),this.y=0)}return this.order=i,this}},{key:\"setFromQuaternion\",value:function(t,i){return A.makeRotationFromQuaternion(t),this.setFromRotationMatrix(A,i)}},{key:\"setFromVector3\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.order;return this.set(t.x,t.y,t.z,i)}},{key:\"reorder\",value:function(t){return S.setFromEuler(this),this.setFromQuaternion(S,t)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.order===this.order}}],[{key:\"defaultOrder\",get:function(){return m}}])}(),new o),T=new o,I=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o(1,0,0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t(this,e),this.normal=i,this.constant=n}return i(e,[{key:\"set\",value:function(t,i){return this.normal.copy(t),this.constant=i,this}},{key:\"setComponents\",value:function(t,i,e,n){return this.normal.set(t,i,e),this.constant=n,this}},{key:\"copy\",value:function(t){return this.normal.copy(t.normal),this.constant=t.constant,this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"setFromNormalAndCoplanarPoint\",value:function(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}},{key:\"setFromCoplanarPoints\",value:function(t,i,e){var n=P.subVectors(e,i).cross(T.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(n,P),this}},{key:\"normalize\",value:function(){var t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}},{key:\"negate\",value:function(){return this.normal.negate(),this.constant=-this.constant,this}},{key:\"distanceToPoint\",value:function(t){return this.normal.dot(t)+this.constant}},{key:\"distanceToSphere\",value:function(t){return this.distanceToPoint(t.center)-t.radius}},{key:\"projectPoint\",value:function(t,i){return i.copy(this.normal).multiplyScalar(-this.distanceToPoint(t)).add(t)}},{key:\"coplanarPoint\",value:function(t){return t.copy(this.normal).multiplyScalar(-this.constant)}},{key:\"translate\",value:function(t){return this.constant-=t.dot(this.normal),this}},{key:\"intersectLine\",value:function(t,i){var e=t.delta(P),n=this.normal.dot(e);if(0===n)0===this.distanceToPoint(t.start)&&i.copy(t.start);else{var s=-(t.start.dot(this.normal)+this.constant)/n;s>=0&&s<=1&&i.copy(e).multiplyScalar(s).add(t.start)}return i}},{key:\"intersectsLine\",value:function(t){var i=this.distanceToPoint(t.start),e=this.distanceToPoint(t.end);return i<0&&e>0||e<0&&i>0}},{key:\"intersectsBox\",value:function(t){return t.intersectsPlane(this)}},{key:\"intersectsSphere\",value:function(t){return t.intersectsPlane(this)}},{key:\"equals\",value:function(t){return t.normal.equals(this.normal)&&t.constant===this.constant}}]),e}(),O=new o,_=new o,C=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new I,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new I,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new I,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:new I,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:new I,o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:new I;t(this,e),this.planes=[i,n,s,r,a,o]}i(e,[{key:\"set\",value:function(t,i,e,n,s,r){var a=this.planes;return a[0].copy(t),a[1].copy(i),a[2].copy(e),a[3].copy(n),a[4].copy(s),a[5].copy(r),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"copy\",value:function(t){var i=this.planes,e=void 0;for(e=0;e<6;++e)i[e].copy(t.planes[e]);return this}},{key:\"setFromMatrix\",value:function(t){var i=this.planes,e=t.elements,n=e[0],s=e[1],r=e[2],a=e[3],o=e[4],h=e[5],u=e[6],l=e[7],c=e[8],y=e[9],v=e[10],d=e[11],f=e[12],m=e[13],x=e[14],p=e[15];return i[0].setComponents(a-n,l-o,d-c,p-f).normalize(),i[1].setComponents(a+n,l+o,d+c,p+f).normalize(),i[2].setComponents(a+s,l+h,d+y,p+m).normalize(),i[3].setComponents(a-s,l-h,d-y,p-m).normalize(),i[4].setComponents(a-r,l-u,d-v,p-x).normalize(),i[5].setComponents(a+r,l+u,d+v,p+x).normalize(),this}},{key:\"intersectsSphere\",value:function(t){var i=this.planes,e=t.center,n=-t.radius,s=!0,r=void 0;for(r=0;r<6;++r)if(i[r].distanceToPoint(e)<n){s=!1;break}return s}},{key:\"intersectsBox\",value:function(t){var i=this.planes,e=t.min,n=t.max,s=!0,r=void 0,a=void 0,o=void 0,h=void 0;for(r=0;r<6;++r)if(h=i[r],O.x=h.normal.x>0?e.x:n.x,_.x=h.normal.x>0?n.x:e.x,O.y=h.normal.y>0?e.y:n.y,_.y=h.normal.y>0?n.y:e.y,O.z=h.normal.z>0?e.z:n.z,_.z=h.normal.z>0?n.z:e.z,a=h.distanceToPoint(O),o=h.distanceToPoint(_),a<0&&o<0){s=!1;break}return s}},{key:\"containsPoint\",value:function(t){var i=this.planes,e=!0,n=void 0;for(n=0;n<6;++n)if(i[n].distanceToPoint(t)<0){e=!1;break}return e}}])}(),new o),U=new o,q=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o;t(this,e),this.start=i,this.end=n}i(e,[{key:\"set\",value:function(t,i){return this.start.copy(t),this.end.copy(i),this}},{key:\"copy\",value:function(t){return this.start.copy(t.start),this.end.copy(t.end),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"getCenter\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).addVectors(this.start,this.end).multiplyScalar(.5)}},{key:\"delta\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).subVectors(this.end,this.start)}},{key:\"lengthSquared\",value:function(){return this.start.distanceToSquared(this.end)}},{key:\"length\",value:function(){return this.start.distanceTo(this.end)}},{key:\"at\",value:function(t,i){return this.delta(i).multiplyScalar(t).add(this.start)}},{key:\"closestPointToPointParameter\",value:function(t,i){C.subVectors(t,this.start),U.subVectors(this.end,this.start);var e=U.dot(U),n=U.dot(C);return i?Math.min(Math.max(n/e,0),1):n/e}},{key:\"closestPointToPoint\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new o,n=this.closestPointToPointParameter(t,i);return this.delta(e).multiplyScalar(n).add(this.start)}},{key:\"equals\",value:function(t){return t.start.equals(this.start)&&t.end.equals(this.end)}}])}(),new o),F=new o,E=new o,D=function(){function e(){t(this,e),this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return i(e,[{key:\"set\",value:function(t,i,e,n,s,r,a,o,h,u,l,c,y,v,d,f){var m=this.elements;return m[0]=t,m[4]=i,m[8]=e,m[12]=n,m[1]=s,m[5]=r,m[9]=a,m[13]=o,m[2]=h,m[6]=u,m[10]=l,m[14]=c,m[3]=y,m[7]=v,m[11]=d,m[15]=f,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}},{key:\"copy\",value:function(t){var i=t.elements,e=this.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}},{key:\"clone\",value:function(){return(new this.constructor).fromArray(this.elements)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=this.elements,n=void 0;for(n=0;n<16;++n)e[n]=t[n+i];return this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=this.elements,n=void 0;for(n=0;n<16;++n)t[n+i]=e[n];return t}},{key:\"getMaxScaleOnAxis\",value:function(){var t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],e=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,e,n))}},{key:\"copyPosition\",value:function(t){var i=this.elements,e=t.elements;return i[12]=e[12],i[13]=e[13],i[14]=e[14],this}},{key:\"setPosition\",value:function(t){var i=this.elements;return i[12]=t.x,i[13]=t.y,i[14]=t.z,this}},{key:\"extractBasis\",value:function(t,i,e){return t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),e.setFromMatrixColumn(this,2),this}},{key:\"makeBasis\",value:function(t,i,e){return this.set(t.x,i.x,e.x,0,t.y,i.y,e.y,0,t.z,i.z,e.z,0,0,0,0,1),this}},{key:\"extractRotation\",value:function(t){var i=this.elements,e=t.elements,n=1/q.setFromMatrixColumn(t,0).length(),s=1/q.setFromMatrixColumn(t,1).length(),r=1/q.setFromMatrixColumn(t,2).length();return i[0]=e[0]*n,i[1]=e[1]*n,i[2]=e[2]*n,i[4]=e[4]*s,i[5]=e[5]*s,i[6]=e[6]*s,i[8]=e[8]*r,i[9]=e[9]*r,i[10]=e[10]*r,this}},{key:\"makeRotationFromEuler\",value:function(t){var i=this.elements,e=t.x,n=t.y,s=t.z,r=Math.cos(e),a=Math.sin(e),o=Math.cos(n),h=Math.sin(n),u=Math.cos(s),l=Math.sin(s),c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,z=void 0,M=void 0,b=void 0,A=void 0,S=void 0,P=void 0,T=void 0;switch(t.order){case m:c=r*u,y=r*l,v=a*u,d=a*l,i[0]=o*u,i[4]=-o*l,i[8]=h,i[1]=y+v*h,i[5]=c-d*h,i[9]=-a*o,i[2]=d-c*h,i[6]=v+y*h,i[10]=r*o;break;case g:f=o*u,z=o*l,M=h*u,b=h*l,i[0]=f+b*a,i[4]=M*a-z,i[8]=r*h,i[1]=r*l,i[5]=r*u,i[9]=-a,i[2]=z*a-M,i[6]=b+f*a,i[10]=r*o;break;case p:f=o*u,z=o*l,M=h*u,b=h*l,i[0]=f-b*a,i[4]=-r*l,i[8]=M+z*a,i[1]=z+M*a,i[5]=r*u,i[9]=b-f*a,i[2]=-r*h,i[6]=a,i[10]=r*o;break;case w:c=r*u,y=r*l,v=a*u,d=a*l,i[0]=o*u,i[4]=v*h-y,i[8]=c*h+d,i[1]=o*l,i[5]=d*h+c,i[9]=y*h-v,i[2]=-h,i[6]=a*o,i[10]=r*o;break;case x:A=r*o,S=r*h,P=a*o,T=a*h,i[0]=o*u,i[4]=T-A*l,i[8]=P*l+S,i[1]=l,i[5]=r*u,i[9]=-a*u,i[2]=-h*u,i[6]=S*l+P,i[10]=A-T*l;break;case k:A=r*o,S=r*h,P=a*o,T=a*h,i[0]=o*u,i[4]=-l,i[8]=h*u,i[1]=A*l+T,i[5]=r*u,i[9]=S*l-P,i[2]=P*l-S,i[6]=a*u,i[10]=T*l+A}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}},{key:\"makeRotationFromQuaternion\",value:function(t){var i=this.elements,e=t.x,n=t.y,s=t.z,r=t.w,a=e+e,o=n+n,h=s+s,u=e*a,l=e*o,c=e*h,y=n*o,v=n*h,d=s*h,f=r*a,m=r*o,x=r*h;return i[0]=1-(y+d),i[4]=l-x,i[8]=c+m,i[1]=l+x,i[5]=1-(u+d),i[9]=v-f,i[2]=c-m,i[6]=v+f,i[10]=1-(u+y),i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}},{key:\"lookAt\",value:function(t,i,e){var n=this.elements,s=q,r=F,a=E;return a.subVectors(t,i),0===a.lengthSquared()&&(a.z=1),a.normalize(),s.crossVectors(e,a),0===s.lengthSquared()&&(1===Math.abs(e.z)?a.x+=1e-4:a.z+=1e-4,a.normalize(),s.crossVectors(e,a)),s.normalize(),r.crossVectors(a,s),n[0]=s.x,n[4]=r.x,n[8]=a.x,n[1]=s.y,n[5]=r.y,n[9]=a.y,n[2]=s.z,n[6]=r.z,n[10]=a.z,this}},{key:\"multiplyMatrices\",value:function(t,i){var e=this.elements,n=t.elements,s=i.elements,r=n[0],a=n[4],o=n[8],h=n[12],u=n[1],l=n[5],c=n[9],y=n[13],v=n[2],d=n[6],f=n[10],m=n[14],x=n[3],p=n[7],k=n[11],g=n[15],w=s[0],z=s[4],M=s[8],b=s[12],A=s[1],S=s[5],P=s[9],T=s[13],I=s[2],O=s[6],_=s[10],C=s[14],U=s[3],q=s[7],F=s[11],E=s[15];return e[0]=r*w+a*A+o*I+h*U,e[4]=r*z+a*S+o*O+h*q,e[8]=r*M+a*P+o*_+h*F,e[12]=r*b+a*T+o*C+h*E,e[1]=u*w+l*A+c*I+y*U,e[5]=u*z+l*S+c*O+y*q,e[9]=u*M+l*P+c*_+y*F,e[13]=u*b+l*T+c*C+y*E,e[2]=v*w+d*A+f*I+m*U,e[6]=v*z+d*S+f*O+m*q,e[10]=v*M+d*P+f*_+m*F,e[14]=v*b+d*T+f*C+m*E,e[3]=x*w+p*A+k*I+g*U,e[7]=x*z+p*S+k*O+g*q,e[11]=x*M+p*P+k*_+g*F,e[15]=x*b+p*T+k*C+g*E,this}},{key:\"multiply\",value:function(t){return this.multiplyMatrices(this,t)}},{key:\"premultiply\",value:function(t){return this.multiplyMatrices(t,this)}},{key:\"multiplyScalar\",value:function(t){var i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}},{key:\"determinant\",value:function(){var t=this.elements,i=t[0],e=t[4],n=t[8],s=t[12],r=t[1],a=t[5],o=t[9],h=t[13],u=t[2],l=t[6],c=t[10],y=t[14],v=i*a,d=i*o,f=i*h,m=e*r,x=e*o,p=e*h,k=n*r,g=n*a,w=n*h,z=s*r,M=s*a,b=s*o;return t[3]*(b*l-w*l-M*c+p*c+g*y-x*y)+t[7]*(d*y-f*c+z*c-k*y+w*u-b*u)+t[11]*(f*l-v*y-z*l+m*y+M*u-p*u)+t[15]*(-g*u-d*l+v*c+k*l-m*c+x*u)}},{key:\"getInverse\",value:function(t){var i=this.elements,e=t.elements,n=e[0],s=e[1],r=e[2],a=e[3],o=e[4],h=e[5],u=e[6],l=e[7],c=e[8],y=e[9],v=e[10],d=e[11],f=e[12],m=e[13],x=e[14],p=e[15],k=y*x*l-m*v*l+m*u*d-h*x*d-y*u*p+h*v*p,g=f*v*l-c*x*l-f*u*d+o*x*d+c*u*p-o*v*p,w=c*m*l-f*y*l+f*h*d-o*m*d-c*h*p+o*y*p,z=f*y*u-c*m*u-f*h*v+o*m*v+c*h*x-o*y*x,M=n*k+s*g+r*w+a*z,b=void 0;return 0!==M?(b=1/M,i[0]=k*b,i[1]=(m*v*a-y*x*a-m*r*d+s*x*d+y*r*p-s*v*p)*b,i[2]=(h*x*a-m*u*a+m*r*l-s*x*l-h*r*p+s*u*p)*b,i[3]=(y*u*a-h*v*a-y*r*l+s*v*l+h*r*d-s*u*d)*b,i[4]=g*b,i[5]=(c*x*a-f*v*a+f*r*d-n*x*d-c*r*p+n*v*p)*b,i[6]=(f*u*a-o*x*a-f*r*l+n*x*l+o*r*p-n*u*p)*b,i[7]=(o*v*a-c*u*a+c*r*l-n*v*l-o*r*d+n*u*d)*b,i[8]=w*b,i[9]=(f*y*a-c*m*a-f*s*d+n*m*d+c*s*p-n*y*p)*b,i[10]=(o*m*a-f*h*a+f*s*l-n*m*l-o*s*p+n*h*p)*b,i[11]=(c*h*a-o*y*a-c*s*l+n*y*l+o*s*d-n*h*d)*b,i[12]=z*b,i[13]=(c*m*r-f*y*r+f*s*v-n*m*v-c*s*x+n*y*x)*b,i[14]=(f*h*r-o*m*r-f*s*u+n*m*u+o*s*x-n*h*x)*b,i[15]=(o*y*r-c*h*r+c*s*u-n*y*u-o*s*v+n*h*v)*b):(console.error(\"Can't invert matrix, determinant is zero\",t),this.identity()),this}},{key:\"transpose\",value:function(){var t=this.elements,i=void 0;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}},{key:\"scale\",value:function(t,i,e){var n=this.elements;return n[0]*=t,n[4]*=i,n[8]*=e,n[1]*=t,n[5]*=i,n[9]*=e,n[2]*=t,n[6]*=i,n[10]*=e,n[3]*=t,n[7]*=i,n[11]*=e,this}},{key:\"makeScale\",value:function(t,i,e){return this.set(t,0,0,0,0,i,0,0,0,0,e,0,0,0,0,1),this}},{key:\"makeTranslation\",value:function(t,i,e){return this.set(1,0,0,t,0,1,0,i,0,0,1,e,0,0,0,1),this}},{key:\"makeRotationX\",value:function(t){var i=Math.cos(t),e=Math.sin(t);return this.set(1,0,0,0,0,i,-e,0,0,e,i,0,0,0,0,1),this}},{key:\"makeRotationY\",value:function(t){var i=Math.cos(t),e=Math.sin(t);return this.set(i,0,e,0,0,1,0,0,-e,0,i,0,0,0,0,1),this}},{key:\"makeRotationZ\",value:function(t){var i=Math.cos(t),e=Math.sin(t);return this.set(i,-e,0,0,e,i,0,0,0,0,1,0,0,0,0,1),this}},{key:\"makeRotationAxis\",value:function(t,i){var e=Math.cos(i),n=Math.sin(i),s=1-e,r=t.x,a=t.y,o=t.z,h=s*r,u=s*a;return this.set(h*r+e,h*a-n*o,h*o+n*a,0,h*a+n*o,u*a+e,u*o-n*r,0,h*o-n*a,u*o+n*r,s*o*o+e,0,0,0,0,1),this}},{key:\"makeShear\",value:function(t,i,e){return this.set(1,i,e,0,t,1,e,0,t,i,1,0,0,0,0,1),this}},{key:\"compose\",value:function(t,i,e){return this.makeRotationFromQuaternion(i),this.scale(e.x,e.y,e.z),this.setPosition(t),this}},{key:\"decompose\",value:function(t,i,e){var n=this.elements,s=n[0],r=n[1],a=n[2],o=n[4],h=n[5],u=n[6],l=n[8],c=n[9],y=n[10],v=this.determinant(),d=q.set(s,r,a).length()*(v<0?-1:1),f=q.set(o,h,u).length(),m=q.set(l,c,y).length(),x=1/d,p=1/f,k=1/m;return t.x=n[12],t.y=n[13],t.z=n[14],n[0]*=x,n[1]*=x,n[2]*=x,n[4]*=p,n[5]*=p,n[6]*=p,n[8]*=k,n[9]*=k,n[10]*=k,i.setFromRotationMatrix(this),n[0]=s,n[1]=r,n[2]=a,n[4]=o,n[5]=h,n[6]=u,n[8]=l,n[9]=c,n[10]=y,e.x=d,e.y=f,e.z=m,this}},{key:\"makePerspective\",value:function(t,i,e,n,s,r){var a=this.elements,o=2*s/(i-t),h=2*s/(e-n),u=(i+t)/(i-t),l=(e+n)/(e-n),c=-(r+s)/(r-s),y=-2*r*s/(r-s);return a[0]=o,a[4]=0,a[8]=u,a[12]=0,a[1]=0,a[5]=h,a[9]=l,a[13]=0,a[2]=0,a[6]=0,a[10]=c,a[14]=y,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}},{key:\"makeOrthographic\",value:function(t,i,e,n,s,r){var a=this.elements,o=1/(i-t),h=1/(e-n),u=1/(r-s),l=(i+t)*o,c=(e+n)*h,y=(r+s)*u;return a[0]=2*o,a[4]=0,a[8]=0,a[12]=-l,a[1]=0,a[5]=2*h,a[9]=0,a[13]=-c,a[2]=0,a[6]=0,a[10]=-2*u,a[14]=-y,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}},{key:\"equals\",value:function(t){var i=this.elements,e=t.elements,n=!0,s=void 0;for(s=0;n&&s<16;++s)i[s]!==e[s]&&(n=!1);return n}}]),e}(),V=[new o,new o,new o,new o],N=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o;t(this,e),this.origin=i,this.direction=n}return i(e,[{key:\"set\",value:function(t,i){return this.origin.copy(t),this.direction.copy(i),this}},{key:\"copy\",value:function(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"at\",value:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o).copy(this.direction).multiplyScalar(t).add(this.origin)}},{key:\"lookAt\",value:function(t){return this.direction.copy(t).sub(this.origin).normalize(),this}},{key:\"recast\",value:function(t){return this.origin.copy(this.at(t,V[0])),this}},{key:\"closestPointToPoint\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=i.subVectors(t,this.origin).dot(this.direction);return e>=0?i.copy(this.direction).multiplyScalar(e).add(this.origin):i.copy(this.origin)}},{key:\"distanceSquaredToPoint\",value:function(t){var i=V[0].subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):V[0].copy(this.direction).multiplyScalar(i).add(this.origin).distanceToSquared(t)}},{key:\"distanceToPoint\",value:function(t){return Math.sqrt(this.distanceSquaredToPoint(t))}},{key:\"distanceToPlane\",value:function(t){var i=t.normal.dot(this.direction),e=0!==i?-(this.origin.dot(t.normal)+t.constant)/i:0===t.distanceToPoint(this.origin)?0:-1;return e>=0?e:null}},{key:\"distanceSquaredToSegment\",value:function(t,i,e,n){var s=V[0].copy(t).add(i).multiplyScalar(.5),r=V[1].copy(i).sub(t).normalize(),a=V[2].copy(this.origin).sub(s),o=.5*t.distanceTo(i),h=-this.direction.dot(r),u=a.dot(this.direction),l=-a.dot(r),c=a.lengthSq(),y=Math.abs(1-h*h),v=void 0,d=void 0,f=void 0,m=void 0,x=void 0;return y>0?(d=h*u-l,f=o*y,(v=h*l-u)>=0?d>=-f?d<=f?x=(v*=m=1/y)*(v+h*(d*=m)+2*u)+d*(h*v+d+2*l)+c:(d=o,x=-(v=Math.max(0,-(h*d+u)))*v+d*(d+2*l)+c):(d=-o,x=-(v=Math.max(0,-(h*d+u)))*v+d*(d+2*l)+c):d<=-f?x=-(v=Math.max(0,-(-h*o+u)))*v+(d=v>0?-o:Math.min(Math.max(-o,-l),o))*(d+2*l)+c:d<=f?(v=0,x=(d=Math.min(Math.max(-o,-l),o))*(d+2*l)+c):x=-(v=Math.max(0,-(h*o+u)))*v+(d=v>0?o:Math.min(Math.max(-o,-l),o))*(d+2*l)+c):(d=h>0?-o:o,x=-(v=Math.max(0,-(h*d+u)))*v+d*(d+2*l)+c),void 0!==e&&e.copy(this.direction).multiplyScalar(v).add(this.origin),void 0!==n&&n.copy(r).multiplyScalar(d).add(s),x}},{key:\"intersectSphere\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=V[0].subVectors(t.center,this.origin),n=e.dot(this.direction),s=e.dot(e)-n*n,r=t.radius*t.radius,a=null,h=void 0,u=void 0,l=void 0;return s<=r&&(l=n+(h=Math.sqrt(r-s)),((u=n-h)>=0||l>=0)&&(a=u<0?this.at(l,i):this.at(u,i))),a}},{key:\"intersectsSphere\",value:function(t){return this.distanceToPoint(t.center)<=t.radius}},{key:\"intersectPlane\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=this.distanceToPlane(t);return null===e?null:this.at(e,i)}},{key:\"intersectsPlane\",value:function(t){var i=t.distanceToPoint(this.origin);return 0===i||t.normal.dot(this.direction)*i<0}},{key:\"intersectBox\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=this.origin,n=this.direction,s=t.min,r=t.max,a=1/n.x,h=1/n.y,u=1/n.z,l=null,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,m=void 0;return a>=0?(c=(s.x-e.x)*a,y=(r.x-e.x)*a):(c=(r.x-e.x)*a,y=(s.x-e.x)*a),h>=0?(v=(s.y-e.y)*h,d=(r.y-e.y)*h):(v=(r.y-e.y)*h,d=(s.y-e.y)*h),c<=d&&v<=y&&((v>c||c!=c)&&(c=v),(d<y||y!=y)&&(y=d),u>=0?(f=(s.z-e.z)*u,m=(r.z-e.z)*u):(f=(r.z-e.z)*u,m=(s.z-e.z)*u),c<=m&&f<=y&&((f>c||c!=c)&&(c=f),(m<y||y!=y)&&(y=m),y>=0&&(l=this.at(c>=0?c:y,i)))),l}},{key:\"intersectsBox\",value:function(t){return null!==this.intersectBox(t,V[0])}},{key:\"intersectTriangle\",value:function(t,i,e,n,s){var r=this.direction,a=V[0],o=V[1],h=V[2],u=V[3],l=null,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0;return o.subVectors(i,t),h.subVectors(e,t),u.crossVectors(o,h),0===(c=r.dot(u))||n&&c>0||(c>0?y=1:(y=-1,c=-c),a.subVectors(this.origin,t),(v=y*r.dot(h.crossVectors(a,h)))>=0&&(d=y*r.dot(o.cross(a)))>=0&&v+d<=c&&(f=-y*a.dot(u))>=0&&(l=this.at(f/c,s))),l}},{key:\"applyMatrix4\",value:function(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}},{key:\"equals\",value:function(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}}]),e}(),B=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;t(this,e),this.radius=i,this.phi=n,this.theta=s}i(e,[{key:\"set\",value:function(t,i,e){return this.radius=t,this.phi=i,this.theta=e,this}},{key:\"copy\",value:function(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"setFromVector3\",value:function(t){return this.radius=t.length(),0===this.radius?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t.x,t.z),this.phi=Math.acos(Math.min(Math.max(t.y/this.radius,-1),1))),this.makeSafe()}},{key:\"makeSafe\",value:function(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}}])}(),function(){function e(){t(this,e),this.elements=new Float32Array([1,0,0,1,0,1])}return i(e,[{key:\"set\",value:function(t,i,e,n,s,r){var a=this.elements;return a[0]=t,a[1]=i,a[3]=n,a[2]=e,a[4]=s,a[5]=r,this}},{key:\"identity\",value:function(){return this.set(1,0,0,1,0,1),this}},{key:\"copy\",value:function(t){var i=t.elements;return this.set(i[0],i[1],i[2],i[3],i[4],i[5]),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"toMatrix3\",value:function(t){var i=t.elements;t.set(i[0],i[1],i[2],i[1],i[3],i[4],i[2],i[4],i[5])}},{key:\"add\",value:function(t){var i=this.elements,e=t.elements;return i[0]+=e[0],i[1]+=e[1],i[3]+=e[3],i[2]+=e[2],i[4]+=e[4],i[5]+=e[5],this}},{key:\"norm\",value:function(){var t=this.elements,i=t[1]*t[1],e=t[2]*t[2],n=t[4]*t[4];return Math.sqrt(t[0]*t[0]+i+e+i+t[3]*t[3]+n+e+n+t[5]*t[5])}},{key:\"off\",value:function(){var t=this.elements;return Math.sqrt(2*(t[1]*t[1]+t[2]*t[2]+t[4]*t[4]))}},{key:\"applyToVector3\",value:function(t){var i=t.x,e=t.y,n=t.z,s=this.elements;return t.x=s[0]*i+s[1]*e+s[2]*n,t.y=s[1]*i+s[3]*e+s[4]*n,t.z=s[2]*i+s[4]*e+s[5]*n,t}},{key:\"equals\",value:function(t){var i=this.elements,e=t.elements,n=!0,s=void 0;for(s=0;n&&s<6;++s)i[s]!==e[s]&&(n=!1);return n}}],[{key:\"calculateIndex\",value:function(t,i){return 3-(3-t)*(2-t)/2+i}}]),e}()),L=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;t(this,e),this.x=i,this.y=n,this.z=s,this.w=r}return i(e,[{key:\"set\",value:function(t,i,e,n){return this.x=t,this.y=i,this.z=e,this.w=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}},{key:\"setAxisAngleFromQuaternion\",value:function(t){this.w=2*Math.acos(t.w);var i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}},{key:\"setAxisAngleFromRotationMatrix\",value:function(t){var i=t.elements,e=i[0],n=i[4],s=i[8],r=i[1],a=i[5],o=i[9],h=i[2],u=i[6],l=i[10],c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,m=void 0,x=void 0,p=void 0,k=void 0,g=void 0,w=void 0;return Math.abs(n-r)<.01&&Math.abs(s-h)<.01&&Math.abs(o-u)<.01?Math.abs(n+r)<.1&&Math.abs(s+h)<.1&&Math.abs(o+u)<.1&&Math.abs(e+a+l-3)<.1?this.set(1,0,0,0):(c=Math.PI,x=(l+1)/2,p=(n+r)/4,k=(s+h)/4,g=(o+u)/4,(f=(e+1)/2)>(m=(a+1)/2)&&f>x?f<.01?(y=0,v=.707106781,d=.707106781):(v=p/(y=Math.sqrt(f)),d=k/y):m>x?m<.01?(y=.707106781,v=0,d=.707106781):(y=p/(v=Math.sqrt(m)),d=g/v):x<.01?(y=.707106781,v=.707106781,d=0):(y=k/(d=Math.sqrt(x)),v=g/d),this.set(y,v,d,c)):(w=Math.sqrt((u-o)*(u-o)+(s-h)*(s-h)+(r-n)*(r-n)),Math.abs(w)<.001&&(w=1),this.x=(u-o)/w,this.y=(s-h)/w,this.z=(r-n)/w,this.w=Math.acos((e+a+l-1)/2)),this}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}},{key:\"addVectors\",value:function(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}},{key:\"addScaledVector\",value:function(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}},{key:\"subVectors\",value:function(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}},{key:\"multiplyScalar\",value:function(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}},{key:\"multiplyVectors\",value:function(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this.w=t.w*i.w,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}},{key:\"divideScalar\",value:function(t){return this.x/=t,this.y/=t,this.z/=t,this.w/=t,this}},{key:\"applyMatrix4\",value:function(t){var i=this.x,e=this.y,n=this.z,s=this.w,r=t.elements;return this.x=r[0]*i+r[4]*e+r[8]*n+r[12]*s,this.y=r[1]*i+r[5]*e+r[9]*n+r[13]*s,this.z=r[2]*i+r[6]*e+r[10]*n+r[14]*s,this.w=r[3]*i+r[7]*e+r[11]*n+r[15]*s,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}},{key:\"manhattanLength\",value:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"manhattanDistanceTo\",value:function(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)+Math.abs(this.w-t.w)}},{key:\"distanceToSquared\",value:function(t){var i=this.x-t.x,e=this.y-t.y,n=this.z-t.z,s=this.w-t.w;return i*i+e*e+n*n+s*s}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(t){return this.normalize().multiplyScalar(t)}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}},{key:\"clamp\",value:function(t,i){return this.x=Math.max(t.x,Math.min(i.x,this.x)),this.y=Math.max(t.y,Math.min(i.y,this.y)),this.z=Math.max(t.z,Math.min(i.z,this.z)),this.w=Math.max(t.w,Math.min(i.w,this.w)),this}},{key:\"floor\",value:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}},{key:\"ceil\",value:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}},{key:\"round\",value:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}},{key:\"lerp\",value:function(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}},{key:\"lerpVectors\",value:function(t,i,e){return this.subVectors(i,t).multiplyScalar(e).add(t)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}}]),e}(),R=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];t(this,e),this.value=i,this.done=n}return i(e,[{key:\"reset\",value:function(){this.value=null,this.done=!1}}]),e}(),j=new o,Y=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o;t(this,e),this.min=i,this.max=n,this.children=null}return i(e,[{key:\"getCenter\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getDimensions\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).subVectors(this.max,this.min)}},{key:\"split\",value:function(){var t=this.min,i=this.max,e=this.getCenter(j),n=this.children=[null,null,null,null,null,null,null,null],s=void 0,r=void 0;for(s=0;s<8;++s)r=X[s],n[s]=new this.constructor(new o(0===r[0]?t.x:e.x,0===r[1]?t.y:e.y,0===r[2]?t.z:e.z),new o(0===r[0]?e.x:i.x,0===r[1]?e.y:i.y,0===r[2]?e.z:i.z))}}]),e}(),X=[new Uint8Array([0,0,0]),new Uint8Array([0,0,1]),new Uint8Array([0,1,0]),new Uint8Array([0,1,1]),new Uint8Array([1,0,0]),new Uint8Array([1,0,1]),new Uint8Array([1,1,0]),new Uint8Array([1,1,1])],Q=[new Uint8Array([0,4]),new Uint8Array([1,5]),new Uint8Array([2,6]),new Uint8Array([3,7]),new Uint8Array([0,2]),new Uint8Array([1,3]),new Uint8Array([4,6]),new Uint8Array([5,7]),new Uint8Array([0,1]),new Uint8Array([2,3]),new Uint8Array([4,5]),new Uint8Array([6,7])],G=new o,H=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t(this,e),this.min=i,this.size=n,this.children=null}return i(e,[{key:\"getCenter\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).copy(this.min).addScalar(.5*this.size)}},{key:\"getDimensions\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).set(this.size,this.size,this.size)}},{key:\"split\",value:function(){var t=this.min,i=this.getCenter(G),e=.5*this.size,n=this.children=[null,null,null,null,null,null,null,null],s=void 0,r=void 0;for(s=0;s<8;++s)r=X[s],n[s]=new this.constructor(new o(0===r[0]?t.x:i.x,0===r[1]?t.y:i.y,0===r[2]?t.z:i.z),e)}},{key:\"max\",get:function(){return this.min.clone().addScalar(this.size)}}]),e}(),Z=new l,J=function(){function e(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;t(this,e),this.octree=i,this.region=n,this.cull=null!==n,this.result=new R,this.trace=null,this.indices=null,this.reset()}return i(e,[{key:\"reset\",value:function(){var t=this.octree.root;return this.trace=[],this.indices=[],null!==t&&(Z.min=t.min,Z.max=t.max,this.cull&&!this.region.intersectsBox(Z)||(this.trace.push(t),this.indices.push(0))),this.result.reset(),this}},{key:\"next\",value:function(){for(var t=this.cull,i=this.region,e=this.indices,n=this.trace,s=null,r=n.length-1,a=void 0,o=void 0,h=void 0;null===s&&r>=0;)if(a=e[r],o=n[r].children,++e[r],a<8)if(null!==o){if(h=o[a],t&&(Z.min=h.min,Z.max=h.max,!i.intersectsBox(Z)))continue;n.push(h),e.push(0),++r}else s=n.pop(),e.pop();else n.pop(),e.pop(),--r;return this.result.value=s,this.result.done=null===s,this.result}},{key:\"return\",value:function(t){return this.result.value=t,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),e}(),K=[new o,new o,new o],W=new l,$=new N,tt=[new Uint8Array([4,2,1]),new Uint8Array([5,3,8]),new Uint8Array([6,8,3]),new Uint8Array([7,8,8]),new Uint8Array([8,6,5]),new Uint8Array([8,7,8]),new Uint8Array([8,8,7]),new Uint8Array([8,8,8])],it=0;function et(t,i,e,n){var s=void 0,r=0;return i<e?(s=i,r=0):(s=e,r=1),n<s&&(r=2),tt[t][r]}var nt=function(){function e(){t(this,e)}return i(e,null,[{key:\"intersectOctree\",value:function(t,i,e){var n=W.min.set(0,0,0),s=W.max.subVectors(t.max,t.min),r=t.getDimensions(K[0]),a=K[1].copy(r).multiplyScalar(.5),o=$.origin.copy(i.ray.origin),h=$.direction.copy(i.ray.direction),u=void 0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,m=void 0,x=void 0;o.sub(t.getCenter(K[2])).add(a),it=0,h.x<0&&(o.x=r.x-o.x,h.x=-h.x,it|=4),h.y<0&&(o.y=r.y-o.y,h.y=-h.y,it|=2),h.z<0&&(o.z=r.z-o.z,h.z=-h.z,it|=1),u=1/h.x,l=1/h.y,c=1/h.z,y=(n.x-o.x)*u,v=(s.x-o.x)*u,d=(n.y-o.y)*l,f=(s.y-o.y)*l,m=(n.z-o.z)*c,x=(s.z-o.z)*c,Math.max(Math.max(y,d),m)<Math.min(Math.min(v,f),x)&&function t(i,e,n,s,r,a,o,h,u){var l=i.children,c=void 0,y=void 0,v=void 0,d=void 0;if(r>=0&&a>=0&&o>=0)if(null===l)u.push(i);else{c=function(t,i,e,n,s,r){var a=0;return t>i&&t>e?(s<t&&(a|=2),r<t&&(a|=1)):i>e?(n<i&&(a|=4),r<i&&(a|=1)):(n<e&&(a|=4),s<e&&(a|=2)),a}(e,n,s,y=.5*(e+r),v=.5*(n+a),d=.5*(s+o));do{switch(c){case 0:t(l[it],e,n,s,y,v,d,h,u),c=et(c,y,v,d);break;case 1:t(l[1^it],e,n,d,y,v,o,h,u),c=et(c,y,v,o);break;case 2:t(l[2^it],e,v,s,y,a,d,h,u),c=et(c,y,a,d);break;case 3:t(l[3^it],e,v,d,y,a,o,h,u),c=et(c,y,a,o);break;case 4:t(l[4^it],y,n,s,r,v,d,h,u),c=et(c,r,v,d);break;case 5:t(l[5^it],y,n,d,r,v,o,h,u),c=et(c,r,v,o);break;case 6:t(l[6^it],y,v,s,r,a,d,h,u),c=et(c,r,a,d);break;case 7:t(l[7^it],y,v,d,r,a,o,h,u),c=8}}while(c<8)}}(t.root,y,d,m,v,f,x,i,e)}}]),e}(),st=new l;var rt=function(){function e(i,n){t(this,e),this.root=void 0!==i&&void 0!==n?new Y(i,n):null}return i(e,[{key:\"getCenter\",value:function(t){return this.root.getCenter(t)}},{key:\"getDimensions\",value:function(t){return this.root.getDimensions(t)}},{key:\"getDepth\",value:function(){return function t(i){var e=i.children,n=0,s=void 0,r=void 0,a=void 0;if(null!==e)for(s=0,r=e.length;s<r;++s)(a=1+t(e[s]))>n&&(n=a);return n}(this.root)}},{key:\"cull\",value:function(t){var i=[];return function t(i,e,n){var s=i.children,r=void 0,a=void 0;if(st.min=i.min,st.max=i.max,e.intersectsBox(st))if(null!==s)for(r=0,a=s.length;r<a;++r)t(s[r],e,n);else n.push(i)}(this.root,t,i),i}},{key:\"findOctantsByLevel\",value:function(t){var i=[];return function t(i,e,n,s){var r=i.children,a=void 0,o=void 0;if(n===e)s.push(i);else if(null!==r)for(++n,a=0,o=r.length;a<o;++a)t(r[a],e,n,s)}(this.root,t,0,i),i}},{key:\"raycast\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return nt.intersectOctree(this,t,i),i}},{key:\"leaves\",value:function(t){return new J(this,t)}},{key:Symbol.iterator,value:function(){return new J(this)}},{key:\"min\",get:function(){return this.root.min}},{key:\"max\",get:function(){return this.root.max}},{key:\"children\",get:function(){return this.root.children}}]),e}(),at=new o,ot=function(e){n(a,Y);function a(i,e){t(this,a);var n=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,i,e));return n.points=null,n.data=null,n}return i(a,[{key:\"distanceToSquared\",value:function(t){return at.copy(t).clamp(this.min,this.max).sub(t).lengthSquared()}},{key:\"distanceToCenterSquared\",value:function(t){var i=this.getCenter(at),e=t.x-i.x,n=t.y-i.x,s=t.z-i.z;return e*e+n*n+s*s}},{key:\"contains\",value:function(t,i){var e=this.min,n=this.max;return t.x>=e.x-i&&t.y>=e.y-i&&t.z>=e.z-i&&t.x<=n.x+i&&t.y<=n.y+i&&t.z<=n.z+i}},{key:\"redistribute\",value:function(t){var i=this.children,e=this.points,n=this.data,s=void 0,r=void 0,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0;if(null!==i)for(s=0,a=e.length;s<a;++s)for(u=e[s],l=n[s],r=0,o=i.length;r<o;++r)if((h=i[r]).contains(u,t)){null===h.points&&(h.points=[],h.data=[]),h.points.push(u),h.data.push(l);break}this.points=null,this.data=null}},{key:\"merge\",value:function(){var t=this.children,i=void 0,e=void 0,n=void 0;if(null!==t){for(this.points=[],this.data=[],i=0,e=t.length;i<e;++i)if(null!==(n=t[i]).points){var s,a;(s=this.points).push.apply(s,r(n.points)),(a=this.data).push.apply(a,r(n.data))}this.children=null}}}]),a}(),ht=function i(e,n,s){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;t(this,i),this.distance=e,this.distanceToRay=n,this.point=s,this.object=r},ut=1e-6;function lt(t){var i=t.children,e=0,n=void 0,s=void 0;if(null!==i)for(n=0,s=i.length;n<s;++n)e+=lt(i[n]);else null!==t.points&&(e=t.points.length);return e}function ct(t,i,e,n,s){var r=n.children,a=!1,o=!1,h=void 0,u=void 0;if(n.contains(t,e.bias)){if(null===r){if(null===n.points)n.points=[],n.data=[];else for(h=0,u=n.points.length;!a&&h<u;++h)a=n.points[h].equals(t);a?(n.data[h-1]=i,o=!0):n.points.length<e.maxPoints||s===e.maxDepth?(n.points.push(t.clone()),n.data.push(i),++e.pointCount,o=!0):(n.split(),n.redistribute(e.bias),r=n.children)}if(null!==r)for(++s,h=0,u=r.length;!o&&h<u;++h)o=ct(t,i,e,r[h],s)}return o}function yt(t,i,e,n){var s=e.children,r=null,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0;if(e.contains(t,i.bias))if(null!==s)for(a=0,o=s.length;null===r&&a<o;++a)r=yt(t,i,s[a],e);else if(null!==e.points)for(h=e.points,u=e.data,a=0,o=h.length;a<o;++a)if(h[a].equals(t)){l=o-1,r=u[a],a<l&&(h[a]=h[l],u[a]=u[l]),h.pop(),u.pop(),--i.pointCount,null!==n&&lt(n)<=i.maxPoints&&n.merge();break}return r}!function(r){n(a,rt);function a(i,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:8,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:8;t(this,a);var h=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this));return h.root=new ot(i,e),h.bias=Math.max(0,n),h.maxPoints=Math.max(1,Math.round(r)),h.maxDepth=Math.max(0,Math.round(o)),h.pointCount=0,h}i(a,[{key:\"countPoints\",value:function(t){return lt(t)}},{key:\"put\",value:function(t,i){return ct(t,i,this,this.root,0)}},{key:\"remove\",value:function(t){return yt(t,this,this.root,null)}},{key:\"fetch\",value:function(t){return function t(i,e,n){var s=n.children,r=null,a=void 0,o=void 0,h=void 0;if(n.contains(i,e.bias))if(null!==s)for(a=0,o=s.length;null===r&&a<o;++a)r=t(i,e,s[a]);else for(a=0,o=(h=n.points).length;null===r&&a<o;++a)i.distanceToSquared(h[a])<=ut&&(r=n.data[a]);return r}(t,this,this.root)}},{key:\"move\",value:function(t,i){return function t(i,e,n,s,r,a){var o=s.children,h=null,u=void 0,l=void 0,c=void 0;if(s.contains(i,n.bias))if(s.contains(e,n.bias)){if(null!==o)for(++a,u=0,l=o.length;null===h&&u<l;++u)h=t(i,e,n,o[u],s,a);else for(u=0,l=(c=s.points).length;u<l;++u)if(i.distanceToSquared(c[u])<=ut){c[u].copy(e),h=s.data[u];break}}else ct(e,h=yt(i,n,s,r),n,r,a-1);return h}(t,i,this,this.root,null,0)}},{key:\"findNearestPoint\",value:function(t){return function t(i,e,n,s){var r=s.points,a=s.children,o=null,h=e,u=void 0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0;if(null!==a)for(u=0,l=(v=a.map(function(t){return{octant:t,distance:t.distanceToCenterSquared(i)}}).sort(function(t,i){return t.distance-i.distance})).length;u<l;++u)(d=v[u].octant).contains(i,h)&&null!==(f=t(i,h,n,d))&&(y=f.point.distanceToSquared(i),(!n||y>0)&&y<h&&(h=y,o=f));else if(null!==r)for(u=0,l=r.length;u<l;++u)c=r[u],y=i.distanceToSquared(c),(!n||y>0)&&y<h&&(h=y,o={point:c.clone(),data:s.data[u]});return o}(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:1/0,arguments.length>2&&void 0!==arguments[2]&&arguments[2],this.root)}},{key:\"findPoints\",value:function(t,i){var e=[];return function t(i,e,n,s,r){var a=s.points,o=s.children,h=e*e,u=void 0,l=void 0,c=void 0,y=void 0,v=void 0;if(null!==o)for(u=0,l=o.length;u<l;++u)(v=o[u]).contains(i,e)&&t(i,e,n,v,r);else if(null!==a)for(u=0,l=a.length;u<l;++u)c=a[u],y=i.distanceToSquared(c),(!n||y>0)&&y<=h&&r.push({point:c.clone(),data:s.data[u]})}(t,i,arguments.length>2&&void 0!==arguments[2]&&arguments[2],this.root,e),e}},{key:\"raycast\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"raycast\",this).call(this,t);return n.length>0&&this.testPoints(n,t,i),i}},{key:\"testPoints\",value:function(t,i,e){var n=i.params.Points.threshold,s=n*n,r=void 0,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0;for(u=0,c=t.length;u<c;++u)if(null!==(d=(v=t[u]).points))for(l=0,y=d.length;l<y;++l)f=d[l],(h=i.ray.distanceSqToPoint(f))<s&&(r=i.ray.closestPointToPoint(f),(a=i.ray.origin.distanceTo(r))>=i.near&&a<=i.far&&(o=Math.sqrt(h),e.push(new ht(a,o,r,v.data[l]))))}}])}();var vt=new l,dt=new o,ft=new o,mt=new o,xt=(function(){function e(){t(this,e)}i(e,null,[{key:\"recycleOctants\",value:function(t,i){var e=t.min,n=t.getCenter(ft),s=t.getDimensions(mt).multiplyScalar(.5),r=t.children,a=i.length,o=void 0,h=void 0,u=void 0,l=void 0;for(o=0;o<8;++o)for(u=X[o],vt.min.addVectors(e,dt.fromArray(u).multiply(s)),vt.max.addVectors(n,dt.fromArray(u).multiply(s)),h=0;h<a;++h)if(null!==(l=i[h])&&vt.min.equals(l.min)&&vt.max.equals(l.max)){r[o]=l,i[h]=null;break}}}])}(),new o),pt=new o,kt=new o,gt=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o;t(this,e),this.a=i,this.b=n,this.index=-1,this.coordinates=new o,this.t=0,this.n=new o}return i(e,[{key:\"approximateZeroCrossing\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,e=Math.max(1,i-1),n=0,s=1,r=0,a=0,o=void 0,h=void 0;for(xt.subVectors(this.b,this.a);a<=e&&(r=(n+s)/2,pt.addVectors(this.a,kt.copy(xt).multiplyScalar(r)),h=t.sample(pt),!(Math.abs(h)<=1e-4||(s-n)/2<=1e-6));)pt.addVectors(this.a,kt.copy(xt).multiplyScalar(n)),o=t.sample(pt),Math.sign(h)===Math.sign(o)?n=r:s=r,++a;this.t=r}},{key:\"computeZeroCrossingPosition\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).subVectors(this.b,this.a).multiplyScalar(this.t).add(this.a)}},{key:\"computeSurfaceNormal\",value:function(t){var i=this.computeZeroCrossingPosition(xt),e=t.sample(pt.addVectors(i,kt.set(.001,0,0)))-t.sample(pt.subVectors(i,kt.set(.001,0,0))),n=t.sample(pt.addVectors(i,kt.set(0,.001,0)))-t.sample(pt.subVectors(i,kt.set(0,.001,0))),s=t.sample(pt.addVectors(i,kt.set(0,0,.001)))-t.sample(pt.subVectors(i,kt.set(0,0,.001)));this.n.set(e,n,s).normalize()}}]),e}(),wt=new gt,zt=new o,Mt=new o,bt=function(){function e(i,n,s){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:3;t(this,e),this.edgeData=i,this.cellPosition=n,this.cellSize=s,this.indices=null,this.zeroCrossings=null,this.normals=null,this.axes=null,this.lengths=null,this.result=new R,this.initialC=r,this.c=r,this.initialD=a,this.d=a,this.i=0,this.l=0,this.reset()}return i(e,[{key:\"reset\",value:function(){var t=this.edgeData,i=[],e=[],n=[],s=[],r=[],a=void 0,o=void 0,h=void 0,u=void 0;for(this.i=0,this.c=0,this.d=0,a=4>>(o=this.initialC),h=this.initialD;o<h;++o,a>>=1)(u=t.indices[o].length)>0&&(i.push(t.indices[o]),e.push(t.zeroCrossings[o]),n.push(t.normals[o]),s.push(X[a]),r.push(u),++this.d);return this.l=r.length>0?r[0]:0,this.indices=i,this.zeroCrossings=e,this.normals=n,this.axes=s,this.lengths=r,this.result.reset(),this}},{key:\"next\",value:function(){var t=this.cellSize,i=Ot.resolution,e=i+1,n=e*e,s=this.result,r=this.cellPosition,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0;return this.i===this.l&&(this.l=++this.c<this.d?this.lengths[this.c]:0,this.i=0),this.i<this.l?(c=this.c,y=this.i,a=this.axes[c],o=this.indices[c][y],wt.index=o,h=o%e,u=Math.trunc(o%n/e),l=Math.trunc(o/n),wt.coordinates.set(h,u,l),zt.set(h*t/i,u*t/i,l*t/i),Mt.set((h+a[0])*t/i,(u+a[1])*t/i,(l+a[2])*t/i),wt.a.addVectors(r,zt),wt.b.addVectors(r,Mt),wt.t=this.zeroCrossings[c][y],wt.n.fromArray(this.normals[c],3*y),s.value=wt,++this.i):(s.value=null,s.done=!0),s}},{key:\"return\",value:function(t){return this.result.value=t,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),e}(),At=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i;t(this,e),this.indices=i<=0?null:[new Uint32Array(i),new Uint32Array(n),new Uint32Array(s)],this.zeroCrossings=i<=0?null:[new Float32Array(i),new Float32Array(n),new Float32Array(s)],this.normals=i<=0?null:[new Float32Array(3*i),new Float32Array(3*n),new Float32Array(3*s)]}return i(e,[{key:\"serialize\",value:function(){return{edges:this.edges,zeroCrossings:this.zeroCrossings,normals:this.normals}}},{key:\"deserialize\",value:function(t){var i=this;return null!==t?(this.edges=t.edges,this.zeroCrossings=t.zeroCrossings,this.normals=t.normals):i=null,i}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=[this.edges[0],this.edges[1],this.edges[2],this.zeroCrossings[0],this.zeroCrossings[1],this.zeroCrossings[2],this.normals[0],this.normals[1],this.normals[2]],e=void 0,n=void 0,s=void 0;for(n=0,s=i.length;n<s;++n)null!==(e=i[n])&&t.push(e.buffer);return t}},{key:\"edges\",value:function(t,i){return new bt(this,t,i)}},{key:\"edgesX\",value:function(t,i){return new bt(this,t,i,0,1)}},{key:\"edgesY\",value:function(t,i){return new bt(this,t,i,1,2)}},{key:\"edgesZ\",value:function(t,i){return new bt(this,t,i,2,3)}}],[{key:\"calculate1DEdgeCount\",value:function(t){return Math.pow(t+1,2)*t}}]),e}(),St={AIR:0,SOLID:1},Pt=0,Tt=0,It=0;var Ot=function(){function e(){var i=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];t(this,e),this.materials=0,this.materialIndices=i?new Uint8Array(It):null,this.runLengths=null,this.edgeData=null}return i(e,[{key:\"set\",value:function(t){return this.materials=t.materials,this.materialIndices=t.materialIndices,this.runLengths=t.runLengths,this.edgeData=t.edgeData,this}},{key:\"clear\",value:function(){return this.materials=0,this.materialIndices=null,this.runLengths=null,this.edgeData=null,this}},{key:\"setMaterialIndex\",value:function(t,i){this.materialIndices[t]===St.AIR?i!==St.AIR&&++this.materials:i===St.AIR&&--this.materials,this.materialIndices[t]=i}},{key:\"compress\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this,i=void 0;return this.compressed?(t.materialIndices=this.materialIndices,t.runLengths=this.runLengths):(i=this.full?new a([this.materialIndices.length],[St.SOLID]):a.encode(this.materialIndices),t.materialIndices=new Uint8Array(i.data),t.runLengths=new Uint32Array(i.runLengths)),t.materials=this.materials,t}},{key:\"decompress\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return t.materialIndices=this.compressed?a.decode(this.runLengths,this.materialIndices,new Uint8Array(It)):this.materialIndices,t.runLengths=null,t.materials=this.materials,t}},{key:\"serialize\",value:function(){return{materials:this.materials,materialIndices:this.materialIndices,runLengths:this.runLengths,edgeData:null!==this.edgeData?this.edgeData.serialize():null}}},{key:\"deserialize\",value:function(t){var i=this;return null!==t?(this.materials=t.materials,this.materialIndices=t.materialIndices,this.runLengths=t.runLengths,null!==t.edgeData?(null===this.edgeData&&(this.edgeData=new At),this.edgeData.deserialize(t.edgeData)):this.edgeData=null):i=null,i}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return null!==this.edgeData&&this.edgeData.createTransferList(t),null!==this.materialIndices&&t.push(this.materialIndices.buffer),null!==this.runLengths&&t.push(this.runLengths.buffer),t}},{key:\"empty\",get:function(){return 0===this.materials}},{key:\"full\",get:function(){return this.materials===It}},{key:\"compressed\",get:function(){return null!==this.runLengths}},{key:\"neutered\",get:function(){return!this.empty&&null===this.materialIndices}}],[{key:\"isovalue\",get:function(){return Pt},set:function(t){Pt=t}},{key:\"resolution\",get:function(){return Tt},set:function(t){Tt=Math.max(1,Math.min(256,(i=t,Math.pow(2,Math.max(0,Math.ceil(Math.log2(i)))))));var i;It=Math.pow(Tt+1,3)}}]),e}(),_t=function(){function e(){t(this,e),this.ata=new B,this.ata.set(0,0,0,0,0,0),this.atb=new o,this.massPointSum=new o,this.numPoints=0}return i(e,[{key:\"set\",value:function(t,i,e,n){return this.ata.copy(t),this.atb.copy(i),this.massPointSum.copy(e),this.numPoints=n,this}},{key:\"copy\",value:function(t){return this.set(t.ata,t.atb,t.massPointSum,t.numPoints)}},{key:\"add\",value:function(t,i){var e=i.x,n=i.y,s=i.z,r=t.dot(i),a=this.ata.elements,o=this.atb;a[0]+=e*e,a[1]+=e*n,a[3]+=n*n,a[2]+=e*s,a[4]+=n*s,a[5]+=s*s,o.x+=r*e,o.y+=r*n,o.z+=r*s,this.massPointSum.add(t),++this.numPoints}},{key:\"addData\",value:function(t){this.ata.add(t.ata),this.atb.add(t.atb),this.massPointSum.add(t.massPointSum),this.numPoints+=t.numPoints}},{key:\"clear\",value:function(){this.ata.set(0,0,0,0,0,0),this.atb.set(0,0,0),this.massPointSum.set(0,0,0),this.numPoints=0}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}}]),e}(),Ct=new v,Ut=function(){function e(){t(this,e)}return i(e,null,[{key:\"calculateCoefficients\",value:function(t,i,e){var n=void 0,s=void 0,r=void 0;return 0===i?(Ct.x=1,Ct.y=0):(n=(e-t)/(2*i),s=Math.sqrt(1+n*n),r=1/(n>=0?n+s:n-s),Ct.x=1/Math.sqrt(1+r*r),Ct.y=r*Ct.x),Ct}}]),e}(),qt=function(){function e(){t(this,e)}return i(e,null,[{key:\"rotateXY\",value:function(t,i){var e=i.x,n=i.y,s=t.x,r=t.y;t.set(e*s-n*r,n*s+e*r)}},{key:\"rotateQXY\",value:function(t,i,e){var n=e.x,s=e.y,r=n*n,a=s*s,o=2*n*s*i,h=t.x,u=t.y;t.set(r*h-o+a*u,a*h+o+r*u)}}]),e}(),Ft=.1,Et=5,Dt=new B,Vt=new f,Nt=new v,Bt=new o;function Lt(t,i){var e=t.elements,n=i.elements,s=void 0;0!==e[1]&&(s=Ut.calculateCoefficients(e[0],e[1],e[3]),qt.rotateQXY(Nt.set(e[0],e[3]),e[1],s),e[0]=Nt.x,e[3]=Nt.y,qt.rotateXY(Nt.set(e[2],e[4]),s),e[2]=Nt.x,e[4]=Nt.y,e[1]=0,qt.rotateXY(Nt.set(n[0],n[3]),s),n[0]=Nt.x,n[3]=Nt.y,qt.rotateXY(Nt.set(n[1],n[4]),s),n[1]=Nt.x,n[4]=Nt.y,qt.rotateXY(Nt.set(n[2],n[5]),s),n[2]=Nt.x,n[5]=Nt.y)}function Rt(t,i){var e=t.elements,n=i.elements,s=void 0;0!==e[2]&&(s=Ut.calculateCoefficients(e[0],e[2],e[5]),qt.rotateQXY(Nt.set(e[0],e[5]),e[2],s),e[0]=Nt.x,e[5]=Nt.y,qt.rotateXY(Nt.set(e[1],e[4]),s),e[1]=Nt.x,e[4]=Nt.y,e[2]=0,qt.rotateXY(Nt.set(n[0],n[6]),s),n[0]=Nt.x,n[6]=Nt.y,qt.rotateXY(Nt.set(n[1],n[7]),s),n[1]=Nt.x,n[7]=Nt.y,qt.rotateXY(Nt.set(n[2],n[8]),s),n[2]=Nt.x,n[8]=Nt.y)}function jt(t,i){var e=t.elements,n=i.elements,s=void 0;0!==e[4]&&(s=Ut.calculateCoefficients(e[3],e[4],e[5]),qt.rotateQXY(Nt.set(e[3],e[5]),e[4],s),e[3]=Nt.x,e[5]=Nt.y,qt.rotateXY(Nt.set(e[1],e[2]),s),e[1]=Nt.x,e[2]=Nt.y,e[4]=0,qt.rotateXY(Nt.set(n[3],n[6]),s),n[3]=Nt.x,n[6]=Nt.y,qt.rotateXY(Nt.set(n[4],n[7]),s),n[4]=Nt.x,n[7]=Nt.y,qt.rotateXY(Nt.set(n[5],n[8]),s),n[5]=Nt.x,n[8]=Nt.y)}function Yt(t){var i=Math.abs(t)<Ft?0:1/t;return Math.abs(i)<Ft?0:i}var Xt=function(){function e(){t(this,e)}return i(e,null,[{key:\"solve\",value:function(t,i,e){var n=function(t,i){var e=t.elements,n=void 0;for(n=0;n<Et;++n)Lt(t,i),Rt(t,i),jt(t,i);return Bt.set(e[0],e[3],e[5])}(Dt.copy(t),Vt.identity()),s=function(t,i){var e=t.elements,n=e[0],s=e[3],r=e[6],a=e[1],o=e[4],h=e[7],u=e[2],l=e[5],c=e[8],y=Yt(i.x),v=Yt(i.y),d=Yt(i.z);return t.set(n*y*n+s*v*s+r*d*r,n*y*a+s*v*o+r*d*h,n*y*u+s*v*l+r*d*c,a*y*n+o*v*s+h*d*r,a*y*a+o*v*o+h*d*h,a*y*u+o*v*l+h*d*c,u*y*n+l*v*s+c*d*r,u*y*a+l*v*o+c*d*h,u*y*u+l*v*l+c*d*c)}(Vt,n);e.copy(i).applyMatrix3(s)}}]),e}(),Qt=new o;var Gt=function(){function e(){t(this,e),this.data=null,this.ata=new B,this.atb=new o,this.massPoint=new o,this.hasSolution=!1}return i(e,[{key:\"setData\",value:function(t){return this.data=t,this.hasSolution=!1,this}},{key:\"solve\",value:function(t){var i=this.data,e=this.massPoint,n=this.ata.copy(i.ata),s=this.atb.copy(i.atb),r=1/0;!this.hasSolution&&null!==i&&i.numPoints>0&&(Qt.copy(i.massPointSum).divideScalar(i.numPoints),e.copy(Qt),n.applyToVector3(Qt),s.sub(Qt),Xt.solve(n,s,t),a=s,o=t,n.applyToVector3(Qt.copy(o)),Qt.subVectors(a,Qt),r=Qt.dot(Qt),t.add(e),this.hasSolution=!0);var a,o;return r}}]),e}(),Ht=function i(){t(this,i),this.materials=0,this.edgeCount=0,this.index=-1,this.position=new o,this.normal=new o,this.qefData=null},Zt=new Gt,Jt=-1,Kt=function(e){n(r,H);function r(i,e){t(this,r);var n=s(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,i,e));return n.voxel=null,n}return i(r,[{key:\"contains\",value:function(t){var i=this.min,e=this.size;return t.x>=i.x-.1&&t.y>=i.y-.1&&t.z>=i.z-.1&&t.x<=i.x+e+.1&&t.y<=i.y+e+.1&&t.z<=i.z+e+.1}},{key:\"collapse\",value:function(){var t=this.children,i=[-1,-1,-1,-1,-1,-1,-1,-1],e=new o,n=-1,s=null!==t,r=0,a=void 0,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0;if(s){for(l=new _t,c=0,y=0;y<8;++y)r+=(a=t[y]).collapse(),u=a.voxel,null!==a.children?s=!1:null!==u&&(l.addData(u.qefData),n=u.materials>>7-y&1,i[y]=u.materials>>y&1,++c);if(s&&Zt.setData(l).solve(e)<=Jt){for((u=new Ht).position.copy(this.contains(e)?e:Zt.massPoint),y=0;y<8;++y)h=i[y],a=t[y],-1===h?u.materials|=n<<y:(u.materials|=h<<y,u.normal.add(a.voxel.normal));u.normal.normalize(),u.qefData=l,this.voxel=u,this.children=null,r+=c-1}}return r}}],[{key:\"errorThreshold\",get:function(){return Jt},set:function(t){Jt=t}}]),r}(),Wt=function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;t(this,i),this.action=e,this.error=null},$t=function(){function e(i,n,s,r,a){t(this,e),this.indices=i,this.positions=n,this.normals=s,this.uvs=r,this.materials=a}return i(e,[{key:\"serialize\",value:function(){return{indices:this.indices,positions:this.positions,normals:this.normals,uvs:this.uvs,materials:this.materials}}},{key:\"deserialize\",value:function(t){var i=this;return null!==t?(this.indices=t.indices,this.positions=t.positions,this.normals=t.normals,this.uvs=t.uvs,this.materials=t.materials):i=null,i}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return t.push(this.indices.buffer),t.push(this.positions.buffer),t.push(this.normals.buffer),t.push(this.uvs.buffer),t.push(this.materials.buffer),t}}]),e}(),ti=[new Uint8Array([0,4,0]),new Uint8Array([1,5,0]),new Uint8Array([2,6,0]),new Uint8Array([3,7,0]),new Uint8Array([0,2,1]),new Uint8Array([4,6,1]),new Uint8Array([1,3,1]),new Uint8Array([5,7,1]),new Uint8Array([0,1,2]),new Uint8Array([2,3,2]),new Uint8Array([4,5,2]),new Uint8Array([6,7,2])],ii=[new Uint8Array([0,1,2,3,0]),new Uint8Array([4,5,6,7,0]),new Uint8Array([0,4,1,5,1]),new Uint8Array([2,6,3,7,1]),new Uint8Array([0,2,4,6,2]),new Uint8Array([1,3,5,7,2])],ei=[[new Uint8Array([4,0,0]),new Uint8Array([5,1,0]),new Uint8Array([6,2,0]),new Uint8Array([7,3,0])],[new Uint8Array([2,0,1]),new Uint8Array([6,4,1]),new Uint8Array([3,1,1]),new Uint8Array([7,5,1])],[new Uint8Array([1,0,2]),new Uint8Array([3,2,2]),new Uint8Array([5,4,2]),new Uint8Array([7,6,2])]],ni=[[new Uint8Array([1,4,0,5,1,1]),new Uint8Array([1,6,2,7,3,1]),new Uint8Array([0,4,6,0,2,2]),new Uint8Array([0,5,7,1,3,2])],[new Uint8Array([0,2,3,0,1,0]),new Uint8Array([0,6,7,4,5,0]),new Uint8Array([1,2,0,6,4,2]),new Uint8Array([1,3,1,7,5,2])],[new Uint8Array([1,1,0,3,2,0]),new Uint8Array([1,5,4,7,6,0]),new Uint8Array([0,1,5,0,4,1]),new Uint8Array([0,3,7,2,6,1])]],si=[[new Uint8Array([3,2,1,0,0]),new Uint8Array([7,6,5,4,0])],[new Uint8Array([5,1,4,0,1]),new Uint8Array([7,3,6,2,1])],[new Uint8Array([6,4,2,0,2]),new Uint8Array([7,5,3,1,2])]],ri=[new Uint8Array([3,2,1,0]),new Uint8Array([7,5,6,4]),new Uint8Array([11,10,9,8])],ai=Math.pow(2,16)-1;function oi(t,i,e){var n=[0,0,0,0],s=void 0,r=void 0,a=void 0,o=void 0;if(null!==t[0].voxel&&null!==t[1].voxel&&null!==t[2].voxel&&null!==t[3].voxel)!function(t,i,e){var n=[-1,-1,-1,-1],s=[!1,!1,!1,!1],r=1/0,a=0,o=!1,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0;for(d=0;d<4;++d)y=t[d],v=ri[i][d],h=Q[v][0],u=Q[v][1],l=y.voxel.materials>>h&1,c=y.voxel.materials>>u&1,y.size<r&&(r=y.size,a=d,o=l!==St.AIR),n[d]=y.voxel.index,s[d]=l!==c;s[a]&&(o?(e.push(n[0]),e.push(n[3]),e.push(n[1]),e.push(n[0]),e.push(n[2]),e.push(n[3])):(e.push(n[0]),e.push(n[1]),e.push(n[3]),e.push(n[0]),e.push(n[3]),e.push(n[2])))}(t,i,e);else for(a=0;a<2;++a){for(n[0]=si[i][a][0],n[1]=si[i][a][1],n[2]=si[i][a][2],n[3]=si[i][a][3],s=[],o=0;o<4;++o)if(null!==(r=t[o]).voxel)s[o]=r;else{if(null===r.children)break;s[o]=r.children[n[o]]}4===o&&oi(s,si[i][a][4],e)}}function hi(t,i,e){var n=[0,0,0,0],s=[[0,0,1,1],[0,1,0,1]],r=void 0,a=void 0,o=void 0,h=void 0,u=void 0;if(null!==t[0].children||null!==t[1].children){for(h=0;h<4;++h)n[0]=ei[i][h][0],n[1]=ei[i][h][1],hi([null===t[0].children?t[0]:t[0].children[n[0]],null===t[1].children?t[1]:t[1].children[n[1]]],ei[i][h][2],e);for(h=0;h<4;++h){for(n[0]=ni[i][h][1],n[1]=ni[i][h][2],n[2]=ni[i][h][3],n[3]=ni[i][h][4],a=s[ni[i][h][0]],r=[],u=0;u<4;++u)if(null!==(o=t[a[u]]).voxel)r[u]=o;else{if(null===o.children)break;r[u]=o.children[n[u]]}4===u&&oi(r,ni[i][h][5],e)}}}var ui=function(){function e(){t(this,e)}return i(e,null,[{key:\"run\",value:function(t){var i=[],e=t.voxelCount,n=null,s=null,r=null,a=null,o=null;return e>ai?console.warn(\"Could not create geometry for cell at position\",t.min,\"(vertex count of\",e,\"exceeds limit of \",ai,\")\"):e>0&&(s=new Float32Array(3*e),r=new Float32Array(3*e),a=new Float32Array(2*e),o=new Uint8Array(e),function t(i,e,n,s){var r=void 0,a=void 0;if(null!==i.children)for(r=0;r<8;++r)s=t(i.children[r],e,n,s);else null!==i.voxel&&((a=i.voxel).index=s,e[3*s]=a.position.x,e[3*s+1]=a.position.y,e[3*s+2]=a.position.z,n[3*s]=a.normal.x,n[3*s+1]=a.normal.y,n[3*s+2]=a.normal.z,++s);return s}(t.root,s,r,0),function t(i,e){var n=i.children,s=[0,0,0,0],r=void 0;if(null!==n){for(r=0;r<8;++r)t(n[r],e);for(r=0;r<12;++r)s[0]=ti[r][0],s[1]=ti[r][1],hi([n[s[0]],n[s[1]]],ti[r][2],e);for(r=0;r<6;++r)s[0]=ii[r][0],s[1]=ii[r][1],s[2]=ii[r][2],s[3]=ii[r][3],oi([n[s[0]],n[s[1]],n[s[2]],n[s[3]]],ii[r][4],e)}}(t.root,i),n=new $t(new Uint16Array(i),s,r,a,o)),n}}]),e}();function li(t,i,e,n,s){var r=0;for(i>>=1;i>0;i>>=1,r=0)e>=i&&(r+=4,e-=i),n>=i&&(r+=2,n-=i),s>=i&&(r+=1,s-=i),null===t.children&&t.split(),t=t.children[r];return t}function ci(t,i,e,n,s){var r=t+1,a=r*r,o=new Ht,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0;for(h=0,y=0;y<8;++y)c=(n+(l=X[y])[2])*a+(e+l[1])*r+(i+l[0]),h|=Math.min(s[c],St.SOLID)<<y;for(u=0,y=0;y<12;++y)(h>>Q[y][0]&1)!==(h>>Q[y][1]&1)&&++u;return o.materials=h,o.edgeCount=u,o.qefData=new _t,o}var yi=function(e){n(r,rt);function r(i){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;t(this,r);var a=s(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return a.root=new Kt(e,n),a.voxelCount=0,null!==i&&null!==i.edgeData&&a.construct(i),Kt.errorThreshold>=0&&a.simplify(),a}return i(r,[{key:\"simplify\",value:function(){this.voxelCount-=this.root.collapse()}},{key:\"construct\",value:function(t){var i=Ot.resolution,e=t.edgeData,n=t.materialIndices,s=new Gt,r=new o,a=[e.edgesX(this.min,this.root.size),e.edgesY(this.min,this.root.size),e.edgesZ(this.min,this.root.size)],h=[new Uint8Array([0,1,2,3]),new Uint8Array([0,1,4,5]),new Uint8Array([0,2,4,6])],u=0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,m=void 0,x=void 0,p=void 0,k=void 0,g=void 0;for(k=0;k<3;++k){y=h[k],l=a[k];var w=!0,z=!1,M=void 0;try{for(var b,A=l[Symbol.iterator]();!(w=(b=A.next()).done);w=!0)for((c=b.value).computeZeroCrossingPosition(r),g=0;g<4;++g)v=X[y[g]],m=c.coordinates.x-v[0],x=c.coordinates.y-v[1],p=c.coordinates.z-v[2],m>=0&&x>=0&&p>=0&&m<i&&x<i&&p<i&&(null===(d=li(this.root,i,m,x,p)).voxel&&(d.voxel=ci(i,m,x,p,n),++u),(f=d.voxel).normal.add(c.n),f.qefData.add(r,c.n),f.qefData.numPoints===f.edgeCount&&(s.setData(f.qefData).solve(f.position),d.contains(f.position)||f.position.copy(s.massPoint),f.normal.normalize()))}catch(t){z=!0,M=t}finally{try{!w&&A.return&&A.return()}finally{if(z)throw M}}}this.voxelCount=u}}]),r}(),vi={EXTRACT:\"worker.extract\",MODIFY:\"worker.modify\",CONFIGURE:\"worker.config\",CLOSE:\"worker.close\"},di=function(i){n(e,Wt);function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;t(this,e);var n=s(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i));return n.data=null,n}return e}(),fi=function(i){n(e,di);function e(){t(this,e);var i=s(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,vi.EXTRACT));return i.isosurface=null,i}return e}(),mi=new Ot(!1),xi=function(){function e(){t(this,e),this.data=null,this.response=null}return i(e,[{key:\"getData\",value:function(){return this.data}},{key:\"respond\",value:function(){return this.response.data=this.data.serialize(),this.response}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return null!==this.data&&this.data.createTransferList(t),t}},{key:\"process\",value:function(t){return this.data=mi.deserialize(t.data),this}}]),e}(),pi=function(r){n(a,xi);function a(){t(this,a);var i=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this));return i.response=new fi,i.decompressionTarget=new Ot(!1),i.isosurface=null,i}return i(a,[{key:\"respond\",value:function(){var t=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"respond\",this).call(this);return t.isosurface=null!==this.isosurface?this.isosurface.serialise():null,t}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"createTransferList\",this).call(this,t),null!==this.isosurface?this.isosurface.createTransferList(t):t}},{key:\"process\",value:function(t){var i=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"process\",this).call(this,t).getData(),n=new yi(i.decompress(this.decompressionTarget));return this.isosurface=ui.run(n),this.decompressionTarget.clear(),this}}]),a}(),ki={UNION:\"csg.union\",DIFFERENCE:\"csg.difference\",INTERSECTION:\"csg.intersection\",DENSITY_FUNCTION:\"csg.densityfunction\"},gi=function(){function e(i){t(this,e),this.type=i;for(var n=arguments.length,s=Array(n>1?n-1:0),r=1;r<n;r++)s[r-1]=arguments[r];this.children=s,this.boundingBox=null}return i(e,[{key:\"getBoundingBox\",value:function(){return null===this.boundingBox&&(this.boundingBox=this.computeBoundingBox()),this.boundingBox}},{key:\"computeBoundingBox\",value:function(){var t=this.children,i=new l,e=void 0,n=void 0;for(e=0,n=t.length;e<n;++e)i.union(t[e].getBoundingBox());return i}}]),e}(),wi=function(e){n(r,gi);function r(){var i;t(this,r);for(var e=arguments.length,n=Array(e),a=0;a<e;a++)n[a]=arguments[a];return s(this,(i=r.__proto__||Object.getPrototypeOf(r)).call.apply(i,[this,ki.UNION].concat(n)))}return i(r,[{key:\"updateMaterialIndex\",value:function(t,i,e){var n=e.materialIndices[t];n!==St.AIR&&i.setMaterialIndex(t,n)}},{key:\"selectEdge\",value:function(t,i,e){return e?t.t>i.t?t:i:t.t<i.t?t:i}}]),r}(),zi=function(e){n(r,gi);function r(){var i;t(this,r);for(var e=arguments.length,n=Array(e),a=0;a<e;a++)n[a]=arguments[a];return s(this,(i=r.__proto__||Object.getPrototypeOf(r)).call.apply(i,[this,ki.DIFFERENCE].concat(n)))}return i(r,[{key:\"updateMaterialIndex\",value:function(t,i,e){e.materialIndices[t]!==St.AIR&&i.setMaterialIndex(t,St.AIR)}},{key:\"selectEdge\",value:function(t,i,e){return e?t.t<i.t?t:i:t.t>i.t?t:i}}]),r}(),Mi=function(e){n(r,gi);function r(){var i;t(this,r);for(var e=arguments.length,n=Array(e),a=0;a<e;a++)n[a]=arguments[a];return s(this,(i=r.__proto__||Object.getPrototypeOf(r)).call.apply(i,[this,ki.INTERSECTION].concat(n)))}return i(r,[{key:\"updateMaterialIndex\",value:function(t,i,e){var n=e.materialIndices[t];i.setMaterialIndex(t,i.materialIndices[t]!==St.AIR&&n!==St.AIR?n:St.AIR)}},{key:\"selectEdge\",value:function(t,i,e){return e?t.t<i.t?t:i:t.t>i.t?t:i}}]),r}(),bi=0,Ai=new o;function Si(t,i,e){var n=function(t){var i=bi,e=Ot.resolution,n=new o(0,0,0),s=new o(e,e,e),r=new l(Ai,Ai.clone().addScalar(bi)),a=t.getBoundingBox();return t.type!==ki.INTERSECTION&&(a.intersectsBox(r)?(n.copy(a.min).max(r.min).sub(r.min),n.x=Math.ceil(n.x*e/i),n.y=Math.ceil(n.y*e/i),n.z=Math.ceil(n.z*e/i),s.copy(a.max).min(r.max).sub(r.min),s.x=Math.floor(s.x*e/i),s.y=Math.floor(s.y*e/i),s.z=Math.floor(s.z*e/i)):(n.set(e,e,e),s.set(0,0,0))),new l(n,s)}(t),s=void 0,r=void 0,a=void 0,h=void 0,u=!1;if(t.type===ki.DENSITY_FUNCTION?function(t,i,e){var n=bi,s=Ot.resolution,r=s+1,a=r*r,h=i.materialIndices,u=Ai,l=new o,c=new o,y=e.max.x,v=e.max.y,d=e.max.z,f=void 0,m=0,x=void 0,p=void 0,k=void 0;for(k=e.min.z;k<=d;++k)for(l.z=k*n/s,p=e.min.y;p<=v;++p)for(l.y=p*n/s,x=e.min.x;x<=y;++x)l.x=x*n/s,(f=t.generateMaterialIndex(c.addVectors(u,l)))!==St.AIR&&(h[k*a+p*r+x]=f,++m);i.materials=m}(t,i,n):i.empty?t.type===ki.UNION&&(i.set(e),u=!0):i.full&&t.type===ki.UNION||function(t,i,e,n){var s=Ot.resolution+1,r=s*s,a=n.max.x,o=n.max.y,h=n.max.z,u=void 0,l=void 0,c=void 0;for(c=n.min.z;c<=h;++c)for(l=n.min.y;l<=o;++l)for(u=n.min.x;u<=a;++u)t.updateMaterialIndex(c*r+l*s+u,i,e)}(t,i,e,n),!u&&!i.empty&&!i.full){for(r=(s=t.type===ki.DENSITY_FUNCTION?function(t,i,e){var n=bi,s=Ot.resolution,r=s+1,a=r*r,h=new Uint32Array([1,r,a]),u=i.materialIndices,l=Ai,c=new o,y=new o,v=new gt,d=new Uint32Array(3),f=new At(At.calculate1DEdgeCount(s)),m=void 0,x=void 0,p=void 0,k=void 0,g=void 0,w=void 0,z=void 0,M=void 0,b=void 0,A=void 0,S=void 0,P=void 0,T=void 0,I=void 0,O=void 0,_=void 0,C=void 0,U=void 0,q=void 0;for(O=4,T=0,I=0;I<3;O>>=1,T=0,++I){switch(_=X[O],m=f.indices[I],x=f.zeroCrossings[I],p=f.normals[I],k=h[I],z=e.min.x,A=e.max.x,M=e.min.y,S=e.max.y,b=e.min.z,P=e.max.z,I){case 0:z=Math.max(z-1,0),A=Math.min(A,s-1);break;case 1:M=Math.max(M-1,0),S=Math.min(S,s-1);break;case 2:b=Math.max(b-1,0),P=Math.min(P,s-1)}for(q=b;q<=P;++q)for(U=M;U<=S;++U)for(C=z;C<=A;++C)w=(g=q*a+U*r+C)+k,u[g]!==u[w]&&(c.set(C*n/s,U*n/s,q*n/s),y.set((C+_[0])*n/s,(U+_[1])*n/s,(q+_[2])*n/s),v.a.addVectors(l,c),v.b.addVectors(l,y),t.generateEdge(v),m[T]=g,x[T]=v.t,p[3*T]=v.n.x,p[3*T+1]=v.n.y,p[3*T+2]=v.n.z,++T);d[I]=T}return{edgeData:f,lengths:d}}(t,i,n):function(t,i,e){var n=Ot.resolution,s=n+1,r=new Uint32Array([1,s,s*s]),a=i.materialIndices,o=new gt,h=new gt,u=e.edgeData,l=i.edgeData,c=new Uint32Array(3),y=At.calculate1DEdgeCount(n),v=new At(Math.min(y,l.indices[0].length+u.indices[0].length),Math.min(y,l.indices[1].length+u.indices[1].length),Math.min(y,l.indices[2].length+u.indices[2].length)),d=void 0,f=void 0,m=void 0,x=void 0,p=void 0,k=void 0,g=void 0,w=void 0,z=void 0,M=void 0,b=void 0,A=void 0,S=void 0,P=void 0,T=void 0,I=void 0,O=void 0,_=void 0,C=void 0,U=void 0,q=void 0,F=void 0,E=void 0;for(_=0,C=0;C<3;_=0,++C){for(d=u.indices[C],x=l.indices[C],g=v.indices[C],f=u.zeroCrossings[C],p=l.zeroCrossings[C],w=v.zeroCrossings[C],m=u.normals[C],k=l.normals[C],z=v.normals[C],M=r[C],F=d.length,E=x.length,U=0,q=0;U<F;++U)if(A=(b=d[U])+M,(T=a[b])!==(I=a[A])&&(T===St.AIR||I===St.AIR)){for(o.t=f[U],o.n.x=m[3*U],o.n.y=m[3*U+1],o.n.z=m[3*U+2],t.type===ki.DIFFERENCE&&o.n.negate(),O=o;q<E&&x[q]<=b;)P=(S=x[q])+M,h.t=p[q],h.n.x=k[3*q],h.n.y=k[3*q+1],h.n.z=k[3*q+2],T=a[S],S<b?T===(I=a[P])||T!==St.AIR&&I!==St.AIR||(g[_]=S,w[_]=h.t,z[3*_]=h.n.x,z[3*_+1]=h.n.y,z[3*_+2]=h.n.z,++_):O=t.selectEdge(h,o,T===St.SOLID),++q;g[_]=b,w[_]=O.t,z[3*_]=O.n.x,z[3*_+1]=O.n.y,z[3*_+2]=O.n.z,++_}for(;q<E;)P=(S=x[q])+M,(T=a[S])===(I=a[P])||T!==St.AIR&&I!==St.AIR||(g[_]=S,w[_]=p[q],z[3*_]=k[3*q],z[3*_+1]=k[3*q+1],z[3*_+2]=k[3*q+2],++_),++q;c[C]=_}return{edgeData:v,lengths:c}}(t,i,e)).edgeData,a=s.lengths,h=0;h<3;++h)r.indices[h]=r.indices[h].slice(0,a[h]),r.zeroCrossings[h]=r.zeroCrossings[h].slice(0,a[h]),r.normals[h]=r.normals[h].slice(0,3*a[h]);i.edgeData=r}}var Pi=function(){function e(){t(this,e)}return i(e,null,[{key:\"run\",value:function(t,i,e,n){Ai.fromArray(t),bi=i,null===e?n.operation===ki.UNION&&(e=new Ot(!1)):e.decompress();var s=n.toCSG(),r=null!==e?function t(i){var e=i.children,n=void 0,s=void 0,r=void 0,a=void 0;for(i.type===ki.DENSITY_FUNCTION&&Si(i,n=new Ot),r=0,a=e.length;r<a&&(s=t(e[r]),void 0===n?n=s:null!==s?null===n?i.type===ki.UNION&&(n=s):Si(i,n,s):i.type===ki.INTERSECTION&&(n=null),null!==n||i.type===ki.UNION);++r);return null!==n&&n.empty?null:n}(s):null;if(null!==r){switch(n.operation){case ki.UNION:s=new wi(s);break;case ki.DIFFERENCE:s=new zi(s);break;case ki.INTERSECTION:s=new Mi(s)}Si(s,e,r),e.contoured=!1}return null!==e&&e.empty?null:e}}]),e}(),Ti=function(e){n(r,gi);function r(i){t(this,r);var e=s(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,ki.DENSITY_FUNCTION));return e.sdf=i,e}return i(r,[{key:\"computeBoundingBox\",value:function(){return this.sdf.getBoundingBox(!0)}},{key:\"generateMaterialIndex\",value:function(t){return this.sdf.sample(t)<=Ot.isovalue?this.sdf.material:St.AIR}},{key:\"generateEdge\",value:function(t){t.approximateZeroCrossing(this.sdf),t.computeSurfaceNormal(this.sdf)}}]),r}(),Ii=new D,Oi=function(){function e(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:St.SOLID;t(this,e),this.type=i,this.operation=null,this.material=Math.min(255,Math.max(St.SOLID,Math.trunc(n))),this.boundingBox=null,this.position=new o,this.quaternion=new M,this.scale=new o(1,1,1),this.inverseTransformation=new D,this.updateInverseTransformation(),this.children=[]}return i(e,[{key:\"getTransformation\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new D).compose(this.position,this.quaternion,this.scale)}},{key:\"getBoundingBox\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i=this.children,e=this.boundingBox,n=void 0,s=void 0;if(null===e&&(e=this.computeBoundingBox(),this.boundingBox=e),t)for(e=e.clone(),n=0,s=i.length;n<s;++n)e.union(i[n].getBoundingBox(t));return e}},{key:\"setMaterial\",value:function(t){return this.material=Math.min(255,Math.max(St.SOLID,Math.trunc(t))),this}},{key:\"setOperationType\",value:function(t){return this.operation=t,this}},{key:\"updateInverseTransformation\",value:function(){return this.inverseTransformation.getInverse(this.getTransformation(Ii)),this.boundingBox=null,this}},{key:\"union\",value:function(t){return this.children.push(t.setOperationType(ki.UNION)),this}},{key:\"subtract\",value:function(t){return this.children.push(t.setOperationType(ki.DIFFERENCE)),this}},{key:\"intersect\",value:function(t){return this.children.push(t.setOperationType(ki.INTERSECTION)),this}},{key:\"toCSG\",value:function(){var t=this.children,i=new Ti(this),e=void 0,n=void 0,s=void 0,r=void 0;for(s=0,r=t.length;s<r;++s){if(e!==(n=t[s]).operation)switch(e=n.operation){case ki.UNION:i=new wi(i);break;case ki.DIFFERENCE:i=new zi(i);break;case ki.INTERSECTION:i=new Mi(i)}i.children.push(n.toCSG())}return i}},{key:\"serialize\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i={type:this.type,operation:this.operation,material:this.material,position:this.position.toArray(),quaternion:this.quaternion.toArray(),scale:this.scale.toArray(),parameters:null,children:[]},e=void 0,n=void 0;for(e=0,n=this.children.length;e<n;++e)i.children.push(this.children[e].serialize(t));return i}},{key:\"createTransferList\",value:function(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]}},{key:\"toJSON\",value:function(){return this.serialize(!0)}},{key:\"computeBoundingBox\",value:function(){throw new Error(\"SignedDistanceFunction#computeBoundingBox method not implemented!\")}},{key:\"sample\",value:function(t){throw new Error(\"SignedDistanceFunction#sample method not implemented!\")}}]),e}(),_i={HEIGHTFIELD:\"sdf.heightfield\",FRACTAL_NOISE:\"sdf.fractalnoise\",SUPER_PRIMITIVE:\"sdf.superprimitive\"},Ci=function(a){n(h,Oi);function h(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments[1];t(this,h);var n=s(this,(h.__proto__||Object.getPrototypeOf(h)).call(this,_i.PERLIN_NOISE,e));return n.min=new(Function.prototype.bind.apply(o,[null].concat(r(i.min)))),n.max=new(Function.prototype.bind.apply(o,[null].concat(r(i.max)))),n}return i(h,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new l(this.min,this.max),this.bbox}},{key:\"sample\",value:function(t){}},{key:\"serialize\",value:function(){var t=e(h.prototype.__proto__||Object.getPrototypeOf(h.prototype),\"serialize\",this).call(this);return t.parameters={min:this.min.toArray(),max:this.max.toArray()},t}}]),h}();var Ui=function(r){n(a,Oi);function a(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments[1];t(this,a);var n=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,_i.HEIGHTFIELD,e));return n.width=void 0!==i.width?i.width:1,n.height=void 0!==i.height?i.height:1,n.smooth=void 0===i.smooth||i.smooth,n.data=void 0!==i.data?i.data:null,n.heightmap=null,void 0!==i.image&&n.fromImage(i.image),n}return i(a,[{key:\"fromImage\",value:function(t){var i=\"undefined\"==typeof document?null:function(t){var i=document.createElementNS(\"http://www.w3.org/1999/xhtml\",\"canvas\"),e=i.getContext(\"2d\");return i.width=t.width,i.height=t.height,e.drawImage(t,0,0),e.getImageData(0,0,t.width,t.height)}(t),e=null,n=void 0,s=void 0,r=void 0,a=void 0;if(null!==i){for(n=i.data,s=0,r=0,a=(e=new Uint8ClampedArray(n.length/4)).length;s<a;++s,r+=4)e[s]=n[r];this.heightmap=t,this.width=i.width,this.height=i.height,this.data=e}return this}},{key:\"getHeight\",value:function(t,i){var e=this.width,n=this.height,s=this.data,r=void 0;if(t=Math.round(t*e),i=Math.round(i*n),this.smooth){var a=(t=Math.max(Math.min(t,e-1),1))+1,o=t-1,h=(i=Math.max(Math.min(i,n-1),1))*e,u=h+e,l=h-e;r=(s[l+o]+s[l+t]+s[l+a]+s[h+o]+s[h+t]+s[h+a]+s[u+o]+s[u+t]+s[u+a])/9}else r=s[i*e+t];return r}},{key:\"computeBoundingBox\",value:function(){var t=new l,i=Math.min(this.width/this.height,1),e=Math.min(this.height/this.width,1);return t.min.set(0,0,0),t.max.set(i,1,e),t.applyMatrix4(this.getTransformation()),t}},{key:\"sample\",value:function(t){var i=this.boundingBox,e=void 0;return i.containsPoint(t)?(t.applyMatrix4(this.inverseTransformation),e=t.y-this.getHeight(t.x,t.z)/255):e=i.distanceToPoint(t),e}},{key:\"serialize\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"serialize\",this).call(this);return i.parameters={width:this.width,height:this.height,smooth:this.smooth,data:t?null:this.data,dataURL:t&&null!==this.heightmap?this.heightmap.toDataURL():null,image:null},i}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return t.push(this.data.buffer),t}}]),a}(),qi=function(a){n(h,Oi);function h(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments[1];t(this,h);var n=s(this,(h.__proto__||Object.getPrototypeOf(h)).call(this,_i.SUPER_PRIMITIVE,e));return n.s0=new(Function.prototype.bind.apply(L,[null].concat(r(i.s)))),n.r0=new(Function.prototype.bind.apply(o,[null].concat(r(i.r)))),n.s=new L,n.r=new o,n.ba=new v,n.offset=0,n.precompute(),n}return i(h,[{key:\"setSize\",value:function(t,i,e,n){return this.s0.set(t,i,e,n),this.precompute()}},{key:\"setRadii\",value:function(t,i,e){return this.r0.set(t,i,e),this.precompute()}},{key:\"precompute\",value:function(){var t=this.s.copy(this.s0),i=this.r.copy(this.r0),e=this.ba;t.x-=i.x,t.y-=i.x,i.x-=t.w,t.w-=i.y,t.z-=i.y,this.offset=-2*t.z,e.set(i.z,this.offset);var n=e.dot(e);return 0===n?e.set(0,-1):e.divideScalar(n),this}},{key:\"computeBoundingBox\",value:function(){var t=this.s0,i=new l;return i.min.x=Math.min(-t.x,-1),i.min.y=Math.min(-t.y,-1),i.min.z=Math.min(-t.z,-1),i.max.x=Math.max(t.x,1),i.max.y=Math.max(t.y,1),i.max.z=Math.max(t.z,1),i.applyMatrix4(this.getTransformation()),i}},{key:\"sample\",value:function(t){t.applyMatrix4(this.inverseTransformation);var i=this.s,e=this.r,n=this.ba,s=Math.abs(t.x)-i.x,r=Math.abs(t.y)-i.y,a=Math.abs(t.z)-i.z,o=Math.max(s,0),h=Math.max(r,0),u=Math.sqrt(o*o+h*h),l=t.z-i.z,c=Math.abs(u+Math.min(0,Math.max(s,r))-e.x)-i.w,y=Math.min(Math.max(c*n.x+l*n.y,0),1),v=c-e.z*y,d=l-this.offset*y,f=Math.max(c-e.z,0),m=t.z+i.z,x=Math.max(c,0),p=v*v+d*d,k=f*f+m*m,g=x*x+l*l,w=c*-n.y+l*n.x;return Math.sqrt(Math.min(p,Math.min(k,g)))*Math.sign(Math.max(w,a))-e.y}},{key:\"serialize\",value:function(){var t=e(h.prototype.__proto__||Object.getPrototypeOf(h.prototype),\"serialize\",this).call(this);return t.parameters={s:this.s0.toArray(),r:this.r0.toArray()},t}}],[{key:\"create\",value:function(t){var i=Fi[t];return new h({s:i[0],r:i[1]})}}]),h}(),Fi=[[new Float32Array([1,1,1,1]),new Float32Array([0,0,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,0,0])],[new Float32Array([0,0,1,1]),new Float32Array([0,0,1])],[new Float32Array([1,1,2,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,.25,1]),new Float32Array([1,.25,0])],[new Float32Array([1,1,.25,.25]),new Float32Array([1,.25,0])],[new Float32Array([1,1,1,.25]),new Float32Array([1,.1,0])],[new Float32Array([1,1,1,.25]),new Float32Array([.1,.1,0])]],Ei=function(){function e(){t(this,e)}return i(e,[{key:\"revive\",value:function(t){var i=void 0,e=void 0,n=void 0;switch(t.type){case _i.FRACTAL_NOISE:i=new Ci(t.parameters,t.material);break;case _i.HEIGHTFIELD:i=new Ui(t.parameters,t.material);break;case _i.SUPER_PRIMITIVE:i=new qi(t.parameters,t.material)}for(i.operation=t.operation,i.position.fromArray(t.position),i.quaternion.fromArray(t.quaternion),i.scale.fromArray(t.scale),i.updateInverseTransformation(),e=0,n=t.children.length;e<n;++e)i.children.push(this.revive(t.children[e]));return i}}]),e}(),Di=function(i){n(e,di);function e(){t(this,e);var i=s(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,vi.MODIFY));return i.sdf=null,i}return e}(),Vi=new(function(r){n(a,xi);function a(){t(this,a);var i=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this));return i.response=new Di,i.sdf=null,i}return i(a,[{key:\"respond\",value:function(){var t=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"respond\",this).call(this);return t.sdf=null!==this.sdf?this.sdf.serialize():null,t}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"createTransferList\",this).call(this,t),null!==this.sdf?this.sdf.createTransferList(t):t}},{key:\"process\",value:function(t){var i=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"process\",this).call(this,t).getData(),n=this.sdf=Ei.revive(t.sdf),s=Pi.run(t.cellPosition,t.cellSize,i,n);return function t(i,e,n,s){var r=Object.getOwnPropertyDescriptor(i,e);if(void 0===r){var a=Object.getPrototypeOf(i);null!==a&&t(a,e,n,s)}else if(\"value\"in r&&r.writable)r.value=n;else{var o=r.set;void 0!==o&&o.call(s,n)}return n}(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"data\",null!==s?s.compress():null,this),this}}]),a}()),Ni=new pi,Bi=null;self.addEventListener(\"message\",function(t){var i=t.data;switch(Bi=i.action){case vi.MODIFY:postMessage(Vi.process(i).respond(),Vi.createTransferList());break;case vi.EXTRACT:postMessage(Ni.process(i).respond(),Ni.createTransferList());break;case vi.CONFIGURE:Ot.resolution=i.resolution,Kt.errorThreshold=i.errorThreshold;break;case vi.CLOSE:default:close()}}),self.addEventListener(\"error\",function(t){var i=Bi===vi.MODIFY?Vi:Bi===vi.EXTRACT?Ni:null,e=void 0;null!==i?((e=i.respond()).action=vi.CLOSE,e.error=t,postMessage(e,i.createTransferList())):((e=new Wt(vi.CLOSE)).error=t,postMessage(e)),close()})}();";

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
  		edges = edgeData.indices[d];

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
  			indexB0 = indexA0 + indexOffset;

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
  	var offsetA = new Vector3();
  	var offsetB = new Vector3();
  	var edge = new Edge();

  	var lengths = new Uint32Array(3);
  	var edgeData = new EdgeData(EdgeData.calculate1DEdgeCount(n));

  	var edges = void 0,
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

  		edges = edgeData.indices[d];
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
