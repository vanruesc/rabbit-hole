/**
 * rabbit-hole v0.0.0 build Mon Oct 07 2019
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.RABBITHOLE = {}));
}(this, function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);

        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var Serializable = function () {
    function Serializable() {
      _classCallCheck(this, Serializable);
    }

    _createClass(Serializable, [{
      key: "serialize",
      value: function serialize() {
      }
    }]);

    return Serializable;
  }();

  var Deserializable = function () {
    function Deserializable() {
      _classCallCheck(this, Deserializable);
    }

    _createClass(Deserializable, [{
      key: "deserialize",
      value: function deserialize(object) {}
    }]);

    return Deserializable;
  }();

  var Disposable = function () {
    function Disposable() {
      _classCallCheck(this, Disposable);
    }

    _createClass(Disposable, [{
      key: "dispose",
      value: function dispose() {}
    }]);

    return Disposable;
  }();

  var TransferableContainer = function () {
    function TransferableContainer() {
      _classCallCheck(this, TransferableContainer);
    }

    _createClass(TransferableContainer, [{
      key: "createTransferList",
      value: function createTransferList() {
      }
    }]);

    return TransferableContainer;
  }();

  var Queue = function () {
    function Queue() {
      _classCallCheck(this, Queue);

      this.elements = [];
      this.head = 0;
    }

    _createClass(Queue, [{
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
        var element;

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
      get: function get() {
        return this.elements.length - this.head;
      }
    }, {
      key: "empty",
      get: function get() {
        return this.elements.length === 0;
      }
    }]);

    return Queue;
  }();

  var Event = function Event(type) {
    _classCallCheck(this, Event);

    this.type = type;
    this.target = null;
  };

  var EventTarget = function () {
    function EventTarget() {
      _classCallCheck(this, EventTarget);

      this.listenerFunctions = new Map();
      this.listenerObjects = new Map();
    }

    _createClass(EventTarget, [{
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

        if (m.has(type)) {
          var listeners = m.get(type);
          listeners["delete"](listener);

          if (listeners.size === 0) {
            m["delete"](type);
          }
        }
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
        var listenerFunctions = target.listenerFunctions;
        var listenerObjects = target.listenerObjects;
        var listeners, listener;
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
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
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
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
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

      _classCallCheck(this, Vector3);

      this.x = x;
      this.y = y;
      this.z = z;
    }

    _createClass(Vector3, [{
      key: "set",
      value: function set(x, y, z) {
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
      value: function toArray() {
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
        this.setFromSphericalCoords(s.radius, s.phi, s.theta);
      }
    }, {
      key: "setFromSphericalCoords",
      value: function setFromSphericalCoords(radius, phi, theta) {
        var sinPhiRadius = Math.sin(phi) * radius;
        this.x = sinPhiRadius * Math.sin(theta);
        this.y = Math.cos(phi) * radius;
        this.z = sinPhiRadius * Math.cos(theta);
        return this;
      }
    }, {
      key: "setFromCylindrical",
      value: function setFromCylindrical(c) {
        this.setFromCylindricalCoords(c.radius, c.theta, c.y);
      }
    }, {
      key: "setFromCylindricalCoords",
      value: function setFromCylindricalCoords(radius, theta, y) {
        this.x = radius * Math.sin(theta);
        this.y = y;
        this.z = radius * Math.cos(theta);
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
  var points = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];

  var Box3 = function () {
    function Box3() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3(Infinity, Infinity, Infinity);
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3(-Infinity, -Infinity, -Infinity);

      _classCallCheck(this, Box3);

      this.min = min;
      this.max = max;
    }

    _createClass(Box3, [{
      key: "set",
      value: function set(min, max) {
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
        var i, l;
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
        var min, max;

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

        return min <= -p.constant && max >= -p.constant;
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

      _classCallCheck(this, Sphere);

      this.center = center;
      this.radius = radius;
    }

    _createClass(Sphere, [{
      key: "set",
      value: function set(center, radius) {
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
        var i, l;

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

      _classCallCheck(this, Vector2);

      this.x = x;
      this.y = y;
    }

    _createClass(Vector2, [{
      key: "set",
      value: function set(x, y) {
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
      value: function toArray() {
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
      key: "cross",
      value: function cross(v) {
        return this.x * v.y - this.y * v.x;
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
      get: function get() {
        return this.x;
      },
      set: function set(value) {
        return this.x = value;
      }
    }, {
      key: "height",
      get: function get() {
        return this.y;
      },
      set: function set(value) {
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

      _classCallCheck(this, Box2);

      this.min = min;
      this.max = max;
    }

    _createClass(Box2, [{
      key: "set",
      value: function set(min, max) {
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
        var i, l;
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

      _classCallCheck(this, Cylindrical);

      this.radius = radius;
      this.theta = theta;
      this.y = y;
    }

    _createClass(Cylindrical, [{
      key: "set",
      value: function set(radius, theta, y) {
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
        return this.setFromCartesianCoords(v.x, v.y, v.z);
      }
    }, {
      key: "setFromCartesianCoords",
      value: function setFromCartesianCoords(x, y, z) {
        this.radius = Math.sqrt(x * x + z * z);
        this.theta = Math.atan2(x, z);
        this.y = y;
        return this;
      }
    }]);

    return Cylindrical;
  }();

  var Matrix3 = function () {
    function Matrix3() {
      _classCallCheck(this, Matrix3);

      this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }

    _createClass(Matrix3, [{
      key: "set",
      value: function set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        var te = this.elements;
        te[0] = m00;
        te[3] = m01;
        te[6] = m02;
        te[1] = m10;
        te[4] = m11;
        te[7] = m12;
        te[2] = m20;
        te[5] = m21;
        te[8] = m22;
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
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
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
        var i;

        for (i = 0; i < 9; ++i) {
          te[i] = array[i + offset];
        }

        return this;
      }
    }, {
      key: "toArray",
      value: function toArray() {
        var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var te = this.elements;
        var i;

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
        te[0] *= s;
        te[3] *= s;
        te[6] *= s;
        te[1] *= s;
        te[4] *= s;
        te[7] *= s;
        te[2] *= s;
        te[5] *= s;
        te[8] *= s;
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
        var invDet;

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
        var t;
        t = me[1];
        me[1] = me[3];
        me[3] = t;
        t = me[2];
        me[2] = me[6];
        me[6] = t;
        t = me[5];
        me[5] = me[7];
        me[7] = t;
        return this;
      }
    }, {
      key: "scale",
      value: function scale(sx, sy) {
        var te = this.elements;
        te[0] *= sx;
        te[3] *= sx;
        te[6] *= sx;
        te[1] *= sy;
        te[4] *= sy;
        te[7] *= sy;
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
        te[0] += tx * te[2];
        te[3] += tx * te[5];
        te[6] += tx * te[8];
        te[1] += ty * te[2];
        te[4] += ty * te[5];
        te[7] += ty * te[8];
        return this;
      }
    }, {
      key: "equals",
      value: function equals(m) {
        var te = this.elements;
        var me = m.elements;
        var result = true;
        var i;

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

  var Quaternion = function () {
    function Quaternion() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      _classCallCheck(this, Quaternion);

      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }

    _createClass(Quaternion, [{
      key: "set",
      value: function set(x, y, z, w) {
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
      value: function toArray() {
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
        var s;

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
            this.x = -vFrom.y;
            this.y = vFrom.x;
            this.z = 0;
            this.w = r;
          } else {
            this.x = 0;
            this.y = -vFrom.z;
            this.z = vFrom.y;
            this.w = r;
          }
        } else {
          this.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
          this.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
          this.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
          this.w = r;
        }

        return this.normalize();
      }
    }, {
      key: "angleTo",
      value: function angleTo(q) {
        return 2.0 * Math.acos(Math.abs(Math.min(Math.max(this.dot(q), -1.0), 1.0)));
      }
    }, {
      key: "rotateTowards",
      value: function rotateTowards(q, step) {
        var angle = this.angleTo(q);

        if (angle !== 0.0) {
          this.slerp(q, Math.min(1.0, step / angle));
        }

        return this;
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
        var invLength;

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
        var cosHalfTheta, sinHalfThetaSquared, sinHalfTheta, halfTheta;
        var s, ratioA, ratioB;

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
        var s, f;
        var sin, cos, sqrSin;
        var dir, len, tDir;

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

      _classCallCheck(this, Euler);

      this.x = x;
      this.y = y;
      this.z = z;
      this.order = Euler.defaultOrder;
    }

    _createClass(Euler, [{
      key: "set",
      value: function set(x, y, z, order) {
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
      value: function toArray() {
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
      get: function get() {
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

      _classCallCheck(this, Plane);

      this.normal = normal;
      this.constant = constant;
    }

    _createClass(Plane, [{
      key: "set",
      value: function set(normal, constant) {
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

  var v$3 = new Vector3();

  var Frustum = function () {
    function Frustum() {
      var p0 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Plane();
      var p1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Plane();
      var p2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Plane();
      var p3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Plane();
      var p4 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Plane();
      var p5 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new Plane();

      _classCallCheck(this, Frustum);

      this.planes = [p0, p1, p2, p3, p4, p5];
    }

    _createClass(Frustum, [{
      key: "set",
      value: function set(p0, p1, p2, p3, p4, p5) {
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
        var i;

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
        var i, d;

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
        var i, plane;

        for (i = 0; i < 6; ++i) {
          plane = planes[i];
          v$3.x = plane.normal.x > 0.0 ? max.x : min.x;
          v$3.y = plane.normal.y > 0.0 ? max.y : min.y;
          v$3.z = plane.normal.z > 0.0 ? max.z : min.z;

          if (plane.distanceToPoint(v$3) < 0.0) {
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
        var i;

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

      _classCallCheck(this, Line3);

      this.start = start;
      this.end = end;
    }

    _createClass(Line3, [{
      key: "set",
      value: function set(start, end) {
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
      _classCallCheck(this, Matrix4);

      this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    _createClass(Matrix4, [{
      key: "set",
      value: function set(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {
        var te = this.elements;
        te[0] = n00;
        te[4] = n01;
        te[8] = n02;
        te[12] = n03;
        te[1] = n10;
        te[5] = n11;
        te[9] = n12;
        te[13] = n13;
        te[2] = n20;
        te[6] = n21;
        te[10] = n22;
        te[14] = n23;
        te[3] = n30;
        te[7] = n31;
        te[11] = n32;
        te[15] = n33;
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
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        te[9] = me[9];
        te[10] = me[10];
        te[11] = me[11];
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        te[15] = me[15];
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
        var i;

        for (i = 0; i < 16; ++i) {
          te[i] = array[i + offset];
        }

        return this;
      }
    }, {
      key: "toArray",
      value: function toArray() {
        var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var te = this.elements;
        var i;

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
        var ae, af, be, bf;
        var ce, cf, de, df;
        var ac, ad, bc, bd;

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
        te[0] = x.x;
        te[4] = y.x;
        te[8] = z.x;
        te[1] = x.y;
        te[5] = y.y;
        te[9] = z.y;
        te[2] = x.z;
        te[6] = y.z;
        te[10] = z.z;
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
        te[0] *= s;
        te[4] *= s;
        te[8] *= s;
        te[12] *= s;
        te[1] *= s;
        te[5] *= s;
        te[9] *= s;
        te[13] *= s;
        te[2] *= s;
        te[6] *= s;
        te[10] *= s;
        te[14] *= s;
        te[3] *= s;
        te[7] *= s;
        te[11] *= s;
        te[15] *= s;
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
        var invDet;

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
        var t;
        t = te[1];
        te[1] = te[4];
        te[4] = t;
        t = te[2];
        te[2] = te[8];
        te[8] = t;
        t = te[6];
        te[6] = te[9];
        te[9] = t;
        t = te[3];
        te[3] = te[12];
        te[12] = t;
        t = te[7];
        te[7] = te[13];
        te[13] = t;
        t = te[11];
        te[11] = te[14];
        te[14] = t;
        return this;
      }
    }, {
      key: "scale",
      value: function scale(sx, sy, sz) {
        var te = this.elements;
        te[0] *= sx;
        te[4] *= sy;
        te[8] *= sz;
        te[1] *= sx;
        te[5] *= sy;
        te[9] *= sz;
        te[2] *= sx;
        te[6] *= sy;
        te[10] *= sz;
        te[3] *= sx;
        te[7] *= sy;
        te[11] *= sz;
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
        te[0] *= invSX;
        te[1] *= invSX;
        te[2] *= invSX;
        te[4] *= invSY;
        te[5] *= invSY;
        te[6] *= invSY;
        te[8] *= invSZ;
        te[9] *= invSZ;
        te[10] *= invSZ;
        quaternion.setFromRotationMatrix(this);
        te[0] = n00;
        te[1] = n10;
        te[2] = n20;
        te[4] = n01;
        te[5] = n11;
        te[6] = n21;
        te[8] = n02;
        te[9] = n12;
        te[10] = n22;
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
        te[0] = x;
        te[4] = 0;
        te[8] = a;
        te[12] = 0;
        te[1] = 0;
        te[5] = y;
        te[9] = b;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = c;
        te[14] = d;
        te[3] = 0;
        te[7] = 0;
        te[11] = -1;
        te[15] = 0;
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
        te[0] = 2 * w;
        te[4] = 0;
        te[8] = 0;
        te[12] = -x;
        te[1] = 0;
        te[5] = 2 * h;
        te[9] = 0;
        te[13] = -y;
        te[2] = 0;
        te[6] = 0;
        te[10] = -2 * p;
        te[14] = -z;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
      }
    }, {
      key: "equals",
      value: function equals(m) {
        var te = this.elements;
        var me = m.elements;
        var result = true;
        var i;

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

  var v$4 = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];

  var Ray = function () {
    function Ray() {
      var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();

      _classCallCheck(this, Ray);

      this.origin = origin;
      this.direction = direction;
    }

    _createClass(Ray, [{
      key: "set",
      value: function set(origin, direction) {
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
        this.origin.copy(this.at(t, v$4[0]));
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
        var directionDistance = v$4[0].subVectors(p, this.origin).dot(this.direction);
        return directionDistance < 0.0 ? this.origin.distanceToSquared(p) : v$4[0].copy(this.direction).multiplyScalar(directionDistance).add(this.origin).distanceToSquared(p);
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
        var segCenter = v$4[0].copy(v0).add(v1).multiplyScalar(0.5);
        var segDir = v$4[1].copy(v1).sub(v0).normalize();
        var diff = v$4[2].copy(this.origin).sub(segCenter);
        var segExtent = v0.distanceTo(v1) * 0.5;
        var a01 = -this.direction.dot(segDir);
        var b0 = diff.dot(this.direction);
        var b1 = -diff.dot(segDir);
        var c = diff.lengthSq();
        var det = Math.abs(1.0 - a01 * a01);
        var s0, s1, extDet, invDet, sqrDist;

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
        var ab = v$4[0].subVectors(s.center, this.origin);
        var tca = ab.dot(this.direction);
        var d2 = ab.dot(ab) - tca * tca;
        var radius2 = s.radius * s.radius;
        var result = null;
        var thc, t0, t1;

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
        return this.distanceSqToPoint(s.center) <= s.radius * s.radius;
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
        var tmin, tmax, tymin, tymax, tzmin, tzmax;

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
        return this.intersectBox(b, v$4[0]) !== null;
      }
    }, {
      key: "intersectTriangle",
      value: function intersectTriangle(a, b, c, backfaceCulling, target) {
        var direction = this.direction;
        var diff = v$4[0];
        var edge1 = v$4[1];
        var edge2 = v$4[2];
        var normal = v$4[3];
        var result = null;
        var DdN, sign, DdQxE2, DdE1xQ, QdN;
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

      _classCallCheck(this, Spherical);

      this.radius = radius;
      this.phi = phi;
      this.theta = theta;
    }

    _createClass(Spherical, [{
      key: "set",
      value: function set(radius, phi, theta) {
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
      key: "makeSafe",
      value: function makeSafe() {
        this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi));
        return this;
      }
    }, {
      key: "setFromVector3",
      value: function setFromVector3(v) {
        return this.setFromCartesianCoords(v.x, v.y, v.z);
      }
    }, {
      key: "setFromCartesianCoords",
      value: function setFromCartesianCoords(x, y, z) {
        this.radius = Math.sqrt(x * x + y * y + z * z);

        if (this.radius === 0) {
          this.theta = 0;
          this.phi = 0;
        } else {
          this.theta = Math.atan2(x, z);
          this.phi = Math.acos(Math.min(Math.max(y / this.radius, -1), 1));
        }

        return this;
      }
    }]);

    return Spherical;
  }();

  var SymmetricMatrix3 = function () {
    function SymmetricMatrix3() {
      _classCallCheck(this, SymmetricMatrix3);

      this.elements = new Float32Array([1, 0, 0, 1, 0, 1]);
    }

    _createClass(SymmetricMatrix3, [{
      key: "set",
      value: function set(m00, m01, m02, m11, m12, m22) {
        var e = this.elements;
        e[0] = m00;
        e[1] = m01;
        e[3] = m11;
        e[2] = m02;
        e[4] = m12;
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
        te[1] += me[1];
        te[3] += me[3];
        te[2] += me[2];
        te[4] += me[4];
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
    }, {
      key: "equals",
      value: function equals(m) {
        var te = this.elements;
        var me = m.elements;
        var result = true;
        var i;

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

      _classCallCheck(this, Vector4);

      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }

    _createClass(Vector4, [{
      key: "set",
      value: function set(x, y, z, w) {
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
      value: function toArray() {
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
        var angle;
        var x, y, z;
        var xx, yy, zz;
        var xy, xz, yz;
        var s;

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
      _classCallCheck(this, Operation);

      this.type = type;

      for (var _len = arguments.length, children = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        children[_key - 1] = arguments[_key];
      }

      this.children = children;
      this.boundingBox = null;
    }

    _createClass(Operation, [{
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
        var i, l;

        for (i = 0, l = children.length; i < l; ++i) {
          boundingBox.union(children[i].getBoundingBox());
        }

        return boundingBox;
      }
    }]);

    return Operation;
  }();

  var Union = function (_Operation) {
    _inherits(Union, _Operation);

    function Union() {
      var _getPrototypeOf2;

      _classCallCheck(this, Union);

      for (var _len = arguments.length, children = new Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Union)).call.apply(_getPrototypeOf2, [this, OperationType.UNION].concat(children)));
    }

    _createClass(Union, [{
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
    _inherits(Difference, _Operation);

    function Difference() {
      var _getPrototypeOf2;

      _classCallCheck(this, Difference);

      for (var _len = arguments.length, children = new Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Difference)).call.apply(_getPrototypeOf2, [this, OperationType.DIFFERENCE].concat(children)));
    }

    _createClass(Difference, [{
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
    _inherits(Intersection, _Operation);

    function Intersection() {
      var _getPrototypeOf2;

      _classCallCheck(this, Intersection);

      for (var _len = arguments.length, children = new Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Intersection)).call.apply(_getPrototypeOf2, [this, OperationType.INTERSECTION].concat(children)));
    }

    _createClass(Intersection, [{
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

      _classCallCheck(this, RunLengthEncoding);

      this.runLengths = runLengths;
      this.data = data;
    }

    _createClass(RunLengthEncoding, null, [{
      key: "encode",
      value: function encode(array) {
        var runLengths = [];
        var data = [];
        var previous = array[0];
        var count = 1;
        var i, l;

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
        var element;
        var i, j, il, jl;
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

      _classCallCheck(this, IteratorResult);

      this.value = value;
      this.done = done;
    }

    _createClass(IteratorResult, [{
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

      _classCallCheck(this, Octant);

      this.min = min;
      this.max = max;
      this.children = null;
    }

    _createClass(Octant, [{
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
        var i, combination;

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

      _classCallCheck(this, CubicOctant);

      this.min = min;
      this.size = size;
      this.children = null;
    }

    _createClass(CubicOctant, [{
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
        var i, combination;

        for (i = 0; i < 8; ++i) {
          combination = pattern[i];
          children[i] = new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize);
        }
      }
    }, {
      key: "max",
      get: function get() {
        return this.min.clone().addScalar(this.size);
      }
    }]);

    return CubicOctant;
  }();

  var b$3 = new Box3();
  var OctantIterator = function () {
    function OctantIterator(octree) {
      var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, OctantIterator);

      this.octree = octree;
      this.region = region;
      this.cull = region !== null;
      this.result = new IteratorResult();
      this.trace = null;
      this.indices = null;
      this.reset();
    }

    _createClass(OctantIterator, [{
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
        var index, children, child;

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

  var v$5 = [new Vector3(), new Vector3(), new Vector3()];
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
    var min;
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
    var currentOctant;
    var txm, tym, tzm;

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
      _classCallCheck(this, OctreeRaycaster);
    }

    _createClass(OctreeRaycaster, null, [{
      key: "intersectOctree",
      value: function intersectOctree(octree, raycaster, intersects) {
        var min = b$4.min.set(0, 0, 0);
        var max = b$4.max.subVectors(octree.max, octree.min);
        var dimensions = octree.getDimensions(v$5[0]);
        var halfDimensions = v$5[1].copy(dimensions).multiplyScalar(0.5);
        var origin = r.origin.copy(raycaster.ray.origin);
        var direction = r.direction.copy(raycaster.ray.direction);
        var invDirX, invDirY, invDirZ;
        var tx0, tx1, ty0, ty1, tz0, tz1;
        origin.sub(octree.getCenter(v$5[2])).add(halfDimensions);
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
    var i, l, d;

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
    var i, l;
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
    var i, l;

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
      _classCallCheck(this, Octree);

      this.root = min !== undefined && max !== undefined ? new Octant(min, max) : null;
    }

    _createClass(Octree, [{
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
      get: function get() {
        return this.root.min;
      }
    }, {
      key: "max",
      get: function get() {
        return this.root.max;
      }
    }, {
      key: "children",
      get: function get() {
        return this.root.children;
      }
    }]);

    return Octree;
  }();

  var ISOVALUE_BIAS = 1e-4;
  var INTERVAL_THRESHOLD = 1e-6;
  var ab = new Vector3();
  var p = new Vector3();
  var v$6 = new Vector3();
  var Edge = function () {
    function Edge() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();

      _classCallCheck(this, Edge);

      this.a = a;
      this.b = b;
      this.index = -1;
      this.coordinates = new Vector3();
      this.t = 0.0;
      this.n = new Vector3();
    }

    _createClass(Edge, [{
      key: "approximateZeroCrossing",
      value: function approximateZeroCrossing(sdf) {
        var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
        var s = Math.max(1, steps - 1);
        var a = 0.0;
        var b = 1.0;
        var c = 0.0;
        var i = 0;
        var densityA, densityC;
        ab.subVectors(this.b, this.a);

        while (i <= s) {
          c = (a + b) / 2;
          p.addVectors(this.a, v$6.copy(ab).multiplyScalar(c));
          densityC = sdf.sample(p);

          if (Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {
            break;
          } else {
            p.addVectors(this.a, v$6.copy(ab).multiplyScalar(a));
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
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
        return target.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);
      }
    }, {
      key: "computeSurfaceNormal",
      value: function computeSurfaceNormal(sdf) {
        var position = this.computeZeroCrossingPosition(ab);
        var E = 1e-3;
        var dx = sdf.sample(p.addVectors(position, v$6.set(E, 0, 0))) - sdf.sample(p.subVectors(position, v$6.set(E, 0, 0)));
        var dy = sdf.sample(p.addVectors(position, v$6.set(0, E, 0))) - sdf.sample(p.subVectors(position, v$6.set(0, E, 0)));
        var dz = sdf.sample(p.addVectors(position, v$6.set(0, 0, E))) - sdf.sample(p.subVectors(position, v$6.set(0, 0, E)));
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

      _classCallCheck(this, EdgeIterator);

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

    _createClass(EdgeIterator, [{
      key: "reset",
      value: function reset() {
        var edgeData = this.edgeData;
        var indices = [];
        var zeroCrossings = [];
        var normals = [];
        var axes = [];
        var lengths = [];
        var a, c, d, l;
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
        var axis, index;
        var x, y, z;
        var c, i;

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

      _classCallCheck(this, EdgeData);

      this.resolution = n;
      this.indices = x <= 0 ? null : [new Uint32Array(x), new Uint32Array(y), new Uint32Array(z)];
      this.zeroCrossings = x <= 0 ? null : [new Float32Array(x), new Float32Array(y), new Float32Array(z)];
      this.normals = x <= 0 ? null : [new Float32Array(x * 3), new Float32Array(y * 3), new Float32Array(z * 3)];
    }

    _createClass(EdgeData, [{
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
        var array;
        var i, l;

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

      _classCallCheck(this, HermiteData);

      this.materials = 0;
      this.materialIndices = initialize ? new Uint8Array(indexCount) : null;
      this.runLengths = null;
      this.edgeData = null;
    }

    _createClass(HermiteData, [{
      key: "set",
      value: function set(data) {
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
        var encoding;

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
      get: function get() {
        return this.materials === 0;
      }
    }, {
      key: "full",
      get: function get() {
        return this.materials === indexCount;
      }
    }, {
      key: "compressed",
      get: function get() {
        return this.runLengths !== null;
      }
    }, {
      key: "neutered",
      get: function get() {
        return !this.empty && this.materialIndices === null;
      }
    }], [{
      key: "isovalue",
      get: function get() {
        return isovalue;
      },
      set: function set(value) {
        isovalue = value;
      }
    }, {
      key: "resolution",
      get: function get() {
        return resolution;
      },
      set: function set(value) {
        value = Math.pow(2, Math.max(0, Math.ceil(Math.log2(value))));
        resolution = Math.max(1, Math.min(256, value));
        indexCount = Math.pow(resolution + 1, 3);
      }
    }]);

    return HermiteData;
  }();

  var DensityFunction = function (_Operation) {
    _inherits(DensityFunction, _Operation);

    function DensityFunction(sdf) {
      var _this;

      _classCallCheck(this, DensityFunction);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DensityFunction).call(this, OperationType.DENSITY_FUNCTION));
      _this.sdf = sdf;
      return _this;
    }

    _createClass(DensityFunction, [{
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

      _classCallCheck(this, SignedDistanceFunction);

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

    _createClass(SignedDistanceFunction, [{
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
        var i, l;

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
        var operationType;
        var child;
        var i, l;

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
        var i, l;

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
    _inherits(FractalNoise, _SignedDistanceFuncti);

    function FractalNoise() {
      var _this;

      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var material = arguments.length > 1 ? arguments[1] : undefined;

      _classCallCheck(this, FractalNoise);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FractalNoise).call(this, SDFType.PERLIN_NOISE, material));
      _this.min = _construct(Vector3, _toConsumableArray(parameters.min));
      _this.max = _construct(Vector3, _toConsumableArray(parameters.max));
      return _this;
    }

    _createClass(FractalNoise, [{
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

        var result = _get(_getPrototypeOf(FractalNoise.prototype), "serialize", this).call(this);

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
    _inherits(Heightfield, _SignedDistanceFuncti);

    function Heightfield() {
      var _this;

      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var material = arguments.length > 1 ? arguments[1] : undefined;

      _classCallCheck(this, Heightfield);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Heightfield).call(this, SDFType.HEIGHTFIELD, material));
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

    _createClass(Heightfield, [{
      key: "fromImage",
      value: function fromImage(image) {
        var imageData = typeof document === "undefined" ? null : readImageData(image);
        var result = null;
        var data;
        var i, j, l;

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
        var height;
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
        var d;

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

        var result = _get(_getPrototypeOf(Heightfield.prototype), "serialize", this).call(this);

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
    _inherits(SuperPrimitive, _SignedDistanceFuncti);

    function SuperPrimitive() {
      var _this;

      var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var material = arguments.length > 1 ? arguments[1] : undefined;

      _classCallCheck(this, SuperPrimitive);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SuperPrimitive).call(this, SDFType.SUPER_PRIMITIVE, material));
      _this.s0 = _construct(Vector4, _toConsumableArray(parameters.s));
      _this.r0 = _construct(Vector3, _toConsumableArray(parameters.r));
      _this.s = new Vector4();
      _this.r = new Vector3();
      _this.ba = new Vector2();
      _this.offset = 0;

      _this.precompute();

      return _this;
    }

    _createClass(SuperPrimitive, [{
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

        var result = _get(_getPrototypeOf(SuperPrimitive.prototype), "serialize", this).call(this);

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
      _classCallCheck(this, SDFReviver);
    }

    _createClass(SDFReviver, [{
      key: "revive",
      value: function revive(description) {
        var sdf, i, l;

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
    _inherits(SDFLoaderEvent, _Event);

    function SDFLoaderEvent(type) {
      var _this;

      _classCallCheck(this, SDFLoaderEvent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SDFLoaderEvent).call(this, type));
      _this.descriptions = null;
      return _this;
    }

    return SDFLoaderEvent;
  }(Event);

  var load = new SDFLoaderEvent("load");

  var SDFLoader = function (_EventTarget) {
    _inherits(SDFLoader, _EventTarget);

    function SDFLoader() {
      var _this;

      _classCallCheck(this, SDFLoader);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SDFLoader).call(this));
      _this.items = 0;
      _this.descriptions = null;
      _this.imageMap = new WeakMap();
      return _this;
    }

    _createClass(SDFLoader, [{
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
        var description;

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
        var child;

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
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
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
      value: function load(descriptions) {
        var description;
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
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
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
      _classCallCheck(this, BinaryUtils);
    }

    _createClass(BinaryUtils, null, [{
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
      _classCallCheck(this, KeyIterator);

      this.keyDesign = keyDesign;
      this.min = min;
      this.max = max;
      this.keyBase = new Vector3();
      this.key = new Vector3();
      this.limit = new Vector3();
      this.result = new IteratorResult();
      this.reset();
    }

    _createClass(KeyIterator, [{
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

      _classCallCheck(this, KeyDesign);

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

    _createClass(KeyDesign, [{
      key: "set",
      value: function set(x, y, z) {
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
      get: function get() {
        return BITS;
      }
    }, {
      key: "HI_BITS",
      get: function get() {
        return HI_BITS;
      }
    }, {
      key: "LO_BITS",
      get: function get() {
        return LO_BITS;
      }
    }]);

    return KeyDesign;
  }();

  var WorldOctantId = function () {
    function WorldOctantId() {
      var lod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, WorldOctantId);

      this.lod = lod;
      this.key = key;
    }

    _createClass(WorldOctantId, [{
      key: "set",
      value: function set(lod, key) {
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

      _classCallCheck(this, WorldOctantWrapper);

      this.octant = octant;
      this.id = id;
      this.min = new Vector3();
      this.max = new Vector3();
    }

    _createClass(WorldOctantWrapper, [{
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

      _classCallCheck(this, WorldOctantIterator);

      this.world = world;
      this.cellSize = 0;
      this.iterator = null;
      this.octantWrapper = new WorldOctantWrapper();
      this.octantWrapper.id.lod = lod;
      this.result = new IteratorResult();
      this.reset();
    }

    _createClass(WorldOctantIterator, [{
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
    _classCallCheck(this, WorldOctant);

    this.data = null;
    this.csg = new Queue();
    this.isosurface = null;
  };

  var IntermediateWorldOctant = function (_WorldOctant) {
    _inherits(IntermediateWorldOctant, _WorldOctant);

    function IntermediateWorldOctant() {
      var _this;

      _classCallCheck(this, IntermediateWorldOctant);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(IntermediateWorldOctant).call(this));
      _this.children = 0;
      return _this;
    }

    return IntermediateWorldOctant;
  }(WorldOctant);

  var p$1 = new Vector3();
  var v$7 = new Vector3();
  var b0 = new Box3();
  var b1 = new Box3();
  var b2 = new Box3();
  var ranges = [];

  function _applyDifference(world, sdf, octant, keyX, keyY, keyZ, lod) {
    var grid, keyDesign, children;
    var range, offset, i;
    octant.csg.add(sdf);

    if (lod > 0) {
      --lod;
      grid = world.getGrid(lod);
      keyDesign = world.getKeyDesign();
      children = octant.children;
      range = ranges[lod];
      keyX <<= 1;
      keyY <<= 1;
      keyZ <<= 1;

      for (i = 0; i < 8; ++i) {
        if ((children & 1 << i) !== 0) {
          offset = pattern[i];
          p$1.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);

          if (range.containsPoint(p$1)) {
            _applyDifference(world, sdf, grid.get(keyDesign.packKey(p$1)), p$1.x, p$1.y, p$1.z, lod);
          }
        }
      }
    }
  }

  var WorldOctreeCSG = function () {
    function WorldOctreeCSG() {
      _classCallCheck(this, WorldOctreeCSG);
    }

    _createClass(WorldOctreeCSG, null, [{
      key: "applyUnion",
      value: function applyUnion(world, region, sdf) {
        var keyDesign = world.getKeyDesign();
        var lodZero = world.lodZero;
        var a = b1.min;
        var b = b1.max;
        var c = b2.min;
        var d = b2.max;
        var range = b2;
        var key, offset;
        var grid, octant;
        var lod, i;

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
                v$7.x <<= 1;
                v$7.y <<= 1;
                v$7.z <<= 1;

                for (i = 0; i < 8; ++i) {
                  offset = pattern[i];
                  p$1.set(v$7.x + offset[0], v$7.y + offset[1], v$7.z + offset[2]);

                  if (range.containsPoint(p$1)) {
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
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
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
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
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
        var i, l;
        var range;
        var key;

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
            if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
              _iterator3["return"]();
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
        var lod, octant;

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
              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
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
  var b$6 = new Box3();
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
    var min;
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
    var keyDesign, cellSize;
    var octantWrapper, grid;
    var children, offset;
    var currentOctant;
    var txm, tym, tzm;
    var i;

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
        keyX <<= 1;
        keyY <<= 1;
        keyZ <<= 1;
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
    var min = b$6.min.set(0, 0, 0);
    var max = b$6.max.subVectors(subtree.max, subtree.min);
    var dimensions = subtree.getDimensions(d.min);
    var halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);
    var origin = r$1.origin.copy(ray.origin);
    var direction = r$1.direction.copy(ray.direction);
    var invDirX, invDirY, invDirZ;
    var tx0, tx1, ty0, ty1, tz0, tz1;
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
      _classCallCheck(this, WorldOctreeRaycaster);
    }

    _createClass(WorldOctreeRaycaster, null, [{
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
        var key, octant;
        var t, b, n;
        var dx, dy, dz;
        var ax, ay, az, bx, by, bz;
        var sx, sy, sz, exy, exz, ezy;
        octantWrapper.id.lod = lod;

        if (a !== null) {
          t = cellSize << 1;
          b = r$1.at(t, v$8);
          world.calculateKeyCoordinates(a, lod, keyCoordinates0);
          world.calculateKeyCoordinates(b, lod, keyCoordinates1);
          dx = keyCoordinates1.x - keyCoordinates0.x;
          dy = keyCoordinates1.y - keyCoordinates0.y;
          dz = keyCoordinates1.z - keyCoordinates0.z;
          sx = Math.sign(dx);
          sy = Math.sign(dy);
          sz = Math.sign(dz);
          ax = Math.abs(dx);
          ay = Math.abs(dy);
          az = Math.abs(dz);
          bx = 2 * ax;
          by = 2 * ay;
          bz = 2 * az;
          exy = ay - ax;
          exz = az - ax;
          ezy = ay - az;

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
                exy += by;
                exz += bz;
              } else {
                keyCoordinates0.z += sz;
                exz -= bx;
                ezy += by;
              }
            } else if (ezy < 0) {
              keyCoordinates0.z += sz;
              exz -= bx;
              ezy += by;
            } else {
              keyCoordinates0.y += sy;
              exy -= bx;
              ezy -= bz;
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
    var grid, keyDesign;
    var children, child;
    var offset, key, i;

    if (lod > 0) {
      --lod;
      grid = world.getGrid(lod);
      keyDesign = world.getKeyDesign();
      children = octant.children;
      keyX <<= 1;
      keyY <<= 1;
      keyZ <<= 1;

      for (i = 0; i < 8; ++i) {
        if ((children & 1 << i) !== 0) {
          offset = pattern[i];
          v$9.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
          key = keyDesign.packKey(v$9);
          child = grid.get(key);
          grid["delete"](key);
          removeChildren(world, child, v$9.x, v$9.y, v$9.z, lod);
        }
      }

      octant.children = 0;
    }
  }

  function prune(world, keyX, keyY, keyZ, lod) {
    var grid, i, key, parent;

    if (++lod < world.levels) {
      grid = world.getGrid(lod);
      i = WorldOctree.calculateOffsetIndex(keyX, keyY, keyZ);
      v$9.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);
      key = world.getKeyDesign().packKey(v$9);
      parent = grid.get(key);
      parent.children &= ~(1 << i);

      if (parent.children === 0) {
        grid["delete"](key);
        prune(world, v$9.x, v$9.y, v$9.z, lod);
      }
    }
  }

  var WorldOctree = function () {
    function WorldOctree() {
      var cellSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
      var levels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var keyDesign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new KeyDesign();

      _classCallCheck(this, WorldOctree);

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

    _createClass(WorldOctree, [{
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
        var i, l;

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
        var result;

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
        var keyX, keyY, keyZ;

        if (grid !== undefined) {
          if (grid.has(key)) {
            keyDesign.unpackKey(key, v$9);
            keyX = v$9.x;
            keyY = v$9.y;
            keyZ = v$9.z;
            removeChildren(this, grid.get(key), keyX, keyY, keyZ, lod);
            grid["delete"](key);
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
      get: function get() {
        return this.bounds.min;
      }
    }, {
      key: "max",
      get: function get() {
        return this.bounds.max;
      }
    }, {
      key: "levels",
      get: function get() {
        return this.grids.length;
      }
    }, {
      key: "lodZero",
      get: function get() {
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
      _classCallCheck(this, Scene);
    }

    _createClass(Scene, [{
      key: "clone",
      value: function clone() {
        return new this.constructor(this.levels);
      }
    }, {
      key: "levels",
      get: function get() {
        return this.something.length;
      }
    }]);

    return Scene;
  }();

  var b$7 = new Box3();
  var f = new Frustum();
  var m$2 = new Matrix4();
  var Clipmap = function (_EventTarget) {
    _inherits(Clipmap, _EventTarget);

    function Clipmap(world) {
      var _this;

      _classCallCheck(this, Clipmap);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Clipmap).call(this));
      _this.world = world;
      _this.position = new Vector3(Infinity, Infinity, Infinity);
      _this.currentScene = new Scene(_this.world.levels);
      _this.previousScene = _this.currentScene.clone();
      _this.nextScene = _this.currentScene.clone();
      return _this;
    }

    _createClass(Clipmap, [{
      key: "update",
      value: function update(camera) {
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

    _classCallCheck(this, Message);

    this.action = action;
    this.error = null;
  };

  var DataMessage = function (_Message) {
    _inherits(DataMessage, _Message);

    function DataMessage() {
      var _this;

      var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, DataMessage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DataMessage).call(this, action));
      _this.data = null;
      return _this;
    }

    return DataMessage;
  }(Message);

  var ExtractionRequest = function (_DataMessage) {
    _inherits(ExtractionRequest, _DataMessage);

    function ExtractionRequest() {
      _classCallCheck(this, ExtractionRequest);

      return _possibleConstructorReturn(this, _getPrototypeOf(ExtractionRequest).call(this, Action.EXTRACT));
    }

    return ExtractionRequest;
  }(DataMessage);

  var ModificationRequest = function (_DataMessage) {
    _inherits(ModificationRequest, _DataMessage);

    function ModificationRequest() {
      var _this;

      _classCallCheck(this, ModificationRequest);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ModificationRequest).call(this, Action.MODIFY));
      _this.sdf = null;
      _this.cellSize = 0;
      _this.cellPosition = null;
      return _this;
    }

    return ModificationRequest;
  }(DataMessage);

  var ConfigurationMessage = function (_Message) {
    _inherits(ConfigurationMessage, _Message);

    function ConfigurationMessage() {
      var _this;

      _classCallCheck(this, ConfigurationMessage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ConfigurationMessage).call(this, Action.CONFIGURE));
      _this.resolution = HermiteData.resolution;
      _this.errorThreshold = 1e-2;
      return _this;
    }

    return ConfigurationMessage;
  }(Message);

  var ExtractionResponse = function (_DataMessage) {
    _inherits(ExtractionResponse, _DataMessage);

    function ExtractionResponse() {
      var _this;

      _classCallCheck(this, ExtractionResponse);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ExtractionResponse).call(this, Action.EXTRACT));
      _this.isosurface = null;
      return _this;
    }

    return ExtractionResponse;
  }(DataMessage);

  var ModificationResponse = function (_DataMessage) {
    _inherits(ModificationResponse, _DataMessage);

    function ModificationResponse() {
      var _this;

      _classCallCheck(this, ModificationResponse);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ModificationResponse).call(this, Action.MODIFY));
      _this.sdf = null;
      return _this;
    }

    return ModificationResponse;
  }(DataMessage);

  var WorkerEvent = function (_Event) {
    _inherits(WorkerEvent, _Event);

    function WorkerEvent(type) {
      var _this;

      _classCallCheck(this, WorkerEvent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WorkerEvent).call(this, type));
      _this.worker = null;
      _this.response = null;
      return _this;
    }

    return WorkerEvent;
  }(Event);

  var message = new WorkerEvent("message");

  var worker = "function _typeof(e){return _typeof=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&\"function\"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?\"symbol\":typeof e},_typeof(e)}(function(){'use strict';var ne=Math.pow,le=Math.trunc,ie=Math.sign,re=Math.PI,oe=Math.atan2,se=Math.round,ye=Math.acos,ue=Math.sqrt,me=Math.cos,xe=Math.sin,pe=Math.floor,ve=Math.ceil,ke=Math.abs,ge=Math.max,he=Math.min;function e(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function t(e,t){for(var a,n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,\"value\"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}function n(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){if(\"function\"!=typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function\");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}function s(e){return s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},s(e)}function y(e,t){return y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},y(e,t)}function u(){if(\"undefined\"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if(\"function\"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function d(){return d=u()?Reflect.construct:function(e,t,n){var l=[null];l.push.apply(l,t);var a=Function.bind.apply(e,l),i=new a;return n&&y(i,n.prototype),i},d.apply(null,arguments)}function x(e){if(void 0===e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return e}function k(e,t){return t&&(\"object\"===_typeof(t)||\"function\"==typeof t)?t:x(e)}function g(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&(e=s(e),null!==e););return e}function h(e,t,a){return h=\"undefined\"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,a){var n=g(e,t);if(n){var l=Object.getOwnPropertyDescriptor(n,t);return l.get?l.get.call(a):l.value}},h(e,t,a||e)}function z(e,t,a,n){return z=\"undefined\"!=typeof Reflect&&Reflect.set?Reflect.set:function(e,t,a,n){var i,r=g(e,t);if(r){if(i=Object.getOwnPropertyDescriptor(r,t),i.set)return i.set.call(n,a),!0;if(!i.writable)return!1}if(i=Object.getOwnPropertyDescriptor(n,t),i){if(!i.writable)return!1;i.value=a,Object.defineProperty(n,t,i)}else l(n,t,a);return!0},z(e,t,a,n)}function f(e,t,a,n,l){var i=z(e,t,a,n||e);if(!i&&l)throw new Error(\"failed to set property\");return a}function S(e){return w(e)||I(e)||T()}function w(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}}function I(e){if(Symbol.iterator in Object(e)||\"[object Arguments]\"===Object.prototype.toString.call(e))return Array.from(e)}function T(){throw new TypeError(\"Invalid attempt to spread non-iterable instance\")}function C(e,t,a){return ge(he(e,a),t)}function P(e,t,a,n,l,i){var r=0;return e>t&&e>a?(l<e&&(r|=2),i<e&&(r|=1)):t>a?(n<t&&(r|=4),i<t&&(r|=1)):(n<a&&(r|=4),l<a&&(r|=2)),r}function E(e,t,a,n){var l,i=0;return t<a?(l=t,i=0):(l=a,i=1),n<l&&(i=2),r[e][i]}function D(e,t,a,n,l,i,r,o,s){var y,u,d,c,m=e.children;if(0<=l&&0<=i&&0<=r)if(null===m)s.push(e);else{u=.5*(t+l),d=.5*(a+i),c=.5*(n+r),y=P(t,a,n,u,d,c);do 0===y?(D(m[lt],t,a,n,u,d,c,o,s),y=E(y,u,d,c)):1===y?(D(m[1^lt],t,a,c,u,d,r,o,s),y=E(y,u,d,r)):2===y?(D(m[2^lt],t,d,n,u,i,c,o,s),y=E(y,u,i,c)):3===y?(D(m[3^lt],t,d,c,u,i,r,o,s),y=E(y,u,i,r)):4===y?(D(m[4^lt],u,a,n,l,d,c,o,s),y=E(y,l,d,c)):5===y?(D(m[5^lt],u,a,c,l,d,r,o,s),y=E(y,l,d,r)):6===y?(D(m[6^lt],u,d,n,l,i,c,o,s),y=E(y,l,i,c)):7===y?(D(m[7^lt],u,d,c,l,i,r,o,s),y=8):void 0;while(8>y)}}function F(e){var t,a,n,r=e.children,o=0;if(null!==r)for(t=0,a=r.length;t<a;++t)n=1+F(r[t]),n>o&&(o=n);return o}function A(e,t,a){var n,r,o=e.children;if(rt.min=e.min,rt.max=e.max,t.intersectsBox(rt))if(null!==o)for(n=0,r=o.length;n<r;++n)A(o[n],t,a);else a.push(e)}function V(e,t,a,n){var r,o,s=e.children;if(a===t)n.push(e);else if(null!==s)for(++a,r=0,o=s.length;r<o;++r)V(s[r],t,a,n)}function B(e,t){var a,n=e.elements,l=t.elements;0!==n[1]&&(a=wt.calculateCoefficients(n[0],n[1],n[3]),It.rotateQXY(bt.set(n[0],n[3]),n[1],a),n[0]=bt.x,n[3]=bt.y,It.rotateXY(bt.set(n[2],n[4]),a),n[2]=bt.x,n[4]=bt.y,n[1]=0,It.rotateXY(bt.set(l[0],l[3]),a),l[0]=bt.x,l[3]=bt.y,It.rotateXY(bt.set(l[1],l[4]),a),l[1]=bt.x,l[4]=bt.y,It.rotateXY(bt.set(l[2],l[5]),a),l[2]=bt.x,l[5]=bt.y)}function N(e,t){var a,n=e.elements,l=t.elements;0!==n[2]&&(a=wt.calculateCoefficients(n[0],n[2],n[5]),It.rotateQXY(bt.set(n[0],n[5]),n[2],a),n[0]=bt.x,n[5]=bt.y,It.rotateXY(bt.set(n[1],n[4]),a),n[1]=bt.x,n[4]=bt.y,n[2]=0,It.rotateXY(bt.set(l[0],l[6]),a),l[0]=bt.x,l[6]=bt.y,It.rotateXY(bt.set(l[1],l[7]),a),l[1]=bt.x,l[7]=bt.y,It.rotateXY(bt.set(l[2],l[8]),a),l[2]=bt.x,l[8]=bt.y)}function O(e,t){var a,n=e.elements,l=t.elements;0!==n[4]&&(a=wt.calculateCoefficients(n[3],n[4],n[5]),It.rotateQXY(bt.set(n[3],n[5]),n[4],a),n[3]=bt.x,n[5]=bt.y,It.rotateXY(bt.set(n[1],n[2]),a),n[1]=bt.x,n[2]=bt.y,n[4]=0,It.rotateXY(bt.set(l[3],l[6]),a),l[3]=bt.x,l[6]=bt.y,It.rotateXY(bt.set(l[4],l[7]),a),l[4]=bt.x,l[7]=bt.y,It.rotateXY(bt.set(l[5],l[8]),a),l[5]=bt.x,l[8]=bt.y)}function L(t,a){var n,l=t.elements;for(n=0;n<5;++n)B(t,a),N(t,a),O(t,a);return Et.set(l[0],l[3],l[5])}function M(e){var t=ke(e)<Tt?0:1/e;return ke(t)<Tt?0:t}function R(e,t){var a=e.elements,n=a[0],l=a[3],i=a[6],r=a[1],o=a[4],s=a[7],y=a[2],u=a[5],d=a[8],c=M(t.x),m=M(t.y),x=M(t.z);return e.set(n*c*n+l*m*l+i*x*i,n*c*r+l*m*o+i*x*s,n*c*y+l*m*u+i*x*d,r*c*n+o*m*l+s*x*i,r*c*r+o*m*o+s*x*s,r*c*y+o*m*u+s*x*d,y*c*n+u*m*l+d*x*i,y*c*r+u*m*o+d*x*s,y*c*y+u*m*u+d*x*d)}function Y(e,t,a){return e.applyToVector3(Ft.copy(a)),Ft.subVectors(t,Ft),Ft.dot(Ft)}function X(e,t,a){var n,l,r,o,s,y,u,d=[-1,-1,-1,-1],c=[!1,!1,!1,!1],m=1/0,x=0,p=!1;for(u=0;4>u;++u)s=e[u],y=Ut[t][u],n=Je[y][0],l=Je[y][1],r=1&s.voxel.materials>>n,o=1&s.voxel.materials>>l,s.size<m&&(m=s.size,x=u,p=r!==vt.AIR),d[u]=s.voxel.index,c[u]=r!==o;c[x]&&(p?(a.push(d[0]),a.push(d[3]),a.push(d[1]),a.push(d[0]),a.push(d[2]),a.push(d[3])):(a.push(d[0]),a.push(d[1]),a.push(d[3]),a.push(d[0]),a.push(d[3]),a.push(d[2])))}function Z(e,t,a){var n,l,r,o,s=[0,0,0,0];if(null!==e[0].voxel&&null!==e[1].voxel&&null!==e[2].voxel&&null!==e[3].voxel)X(e,t,a);else for(r=0;2>r;++r){for(s[0]=_t[t][r][0],s[1]=_t[t][r][1],s[2]=_t[t][r][2],s[3]=_t[t][r][3],n=[],o=0;4>o;++o)if(l=e[o],null!==l.voxel)n[o]=l;else if(null!==l.children)n[o]=l.children[s[o]];else break;4===o&&Z(n,_t[t][r][4],a)}}function _(e,t,a){var n,l,r,o,s,y,u=[0,0,0,0],d=[[0,0,1,1],[0,1,0,1]];if(null!==e[0].children||null!==e[1].children){for(s=0;4>s;++s)u[0]=Xt[t][s][0],u[1]=Xt[t][s][1],n=[null===e[0].children?e[0]:e[0].children[u[0]],null===e[1].children?e[1]:e[1].children[u[1]]],_(n,Xt[t][s][2],a);for(s=0;4>s;++s){for(u[0]=Zt[t][s][1],u[1]=Zt[t][s][2],u[2]=Zt[t][s][3],u[3]=Zt[t][s][4],r=d[Zt[t][s][0]],l=[],y=0;4>y;++y)if(o=e[r[y]],null!==o.voxel)l[y]=o;else if(null!==o.children)l[y]=o.children[u[y]];else break;4===y&&Z(l,Zt[t][s][5],a)}}}function U(e,t){var a,n,l,r=e.children,o=[0,0,0,0];if(null!==r){for(l=0;8>l;++l)U(r[l],t);for(l=0;12>l;++l)o[0]=Rt[l][0],o[1]=Rt[l][1],a=[r[o[0]],r[o[1]]],_(a,Rt[l][2],t);for(l=0;6>l;++l)o[0]=Yt[l][0],o[1]=Yt[l][1],o[2]=Yt[l][2],o[3]=Yt[l][3],n=[r[o[0]],r[o[1]],r[o[2]],r[o[3]]],Z(n,Yt[l][4],t)}}function j(e,t,a,n){var l,r;if(null!==e.children)for(l=0;8>l;++l)n=j(e.children[l],t,a,n);else null!==e.voxel&&(r=e.voxel,r.index=n,t[3*n]=r.position.x,t[3*n+1]=r.position.y,t[3*n+2]=r.position.z,a[3*n]=r.normal.x,a[3*n+1]=r.normal.y,a[3*n+2]=r.normal.z,++n);return n}function Q(e,t,a,l,r){var o=0;for(t>>=1;0<t;t>>=1,o=0)a>=t&&(o+=4,a-=t),l>=t&&(o+=2,l-=t),r>=t&&(o+=1,r-=t),null===e.children&&e.split(),e=e.children[o];return e}function G(e,t,a,n,l){var r,o,s,y,u,d,c,x,p,v,k=e+1,m=new Vt;for(r=0,v=0;8>v;++v)y=He[v],u=(n+y[2])*(k*k)+(a+y[1])*k+(t+y[0]),s=he(l[u],vt.SOLID),r|=s<<v;for(o=0,v=0;12>v;++v)d=Je[v][0],c=Je[v][1],x=1&r>>d,p=1&r>>c,x!==p&&++o;return m.materials=r,m.edgeCount=o,m.qefData=new ft,m}function H(e){var t=ra,a=zt.resolution,n=new fe(0,0,0),l=new fe(a,a,a),i=new v(oa,oa.clone().addScalar(ra)),r=e.getBoundingBox();return e.type!==ta.INTERSECTION&&(r.intersectsBox(i)?(n.copy(r.min).max(i.min).sub(i.min),n.x=ve(n.x*a/t),n.y=ve(n.y*a/t),n.z=ve(n.z*a/t),l.copy(r.max).min(i.max).sub(i.min),l.x=pe(l.x*a/t),l.y=pe(l.y*a/t),l.z=pe(l.z*a/t)):(n.set(a,a,a),l.set(0,0,0))),new v(n,l)}function J(e,t,a,l){var i,r,o,s=zt.resolution,n=s+1,u=l.max.x,d=l.max.y,c=l.max.z;for(o=l.min.z;o<=c;++o)for(r=l.min.y;r<=d;++r)for(i=l.min.x;i<=u;++i)e.updateMaterialIndex(o*(n*n)+r*n+i,t,a)}function K(e,t,a){var l,i,r,o,u=ra,s=zt.resolution,n=s+1,d=t.materialIndices,c=new fe,m=new fe,p=a.max.x,v=a.max.y,k=a.max.z,g=0;for(o=a.min.z;o<=k;++o)for(c.z=o*u/s,r=a.min.y;r<=v;++r)for(c.y=r*u/s,i=a.min.x;i<=p;++i)c.x=i*u/s,l=e.generateMaterialIndex(m.addVectors(oa,c)),l!==vt.AIR&&(d[o*(n*n)+r*n+i]=l,++g);t.materials=g}function W(e,t,a){var l,r,o,s,y,u,x,p,v,k,g,h,z,f,S,w,I,T,C,P,b,E,D,F=zt.resolution,n=F+1,m=new Uint32Array([1,n,n*n]),A=t.materialIndices,V=new ut,B=new ut,N=a.edgeData,O=t.edgeData,q=new Uint32Array(3),L=pt.calculate1DEdgeCount(F),M=new pt(F,he(L,O.indices[0].length+N.indices[0].length),he(L,O.indices[1].length+N.indices[1].length),he(L,O.indices[2].length+N.indices[2].length));for(T=0,C=0;3>C;T=0,++C){for(l=N.indices[C],s=O.indices[C],x=M.indices[C],r=N.zeroCrossings[C],y=O.zeroCrossings[C],p=M.zeroCrossings[C],o=N.normals[C],u=O.normals[C],v=M.normals[C],k=m[C],E=l.length,D=s.length,(P=0,b=0);P<E;++P)if(g=l[P],h=g+k,S=A[g],w=A[h],S!==w&&(S===vt.AIR||w===vt.AIR)){for(V.t=r[P],V.n.x=o[3*P],V.n.y=o[3*P+1],V.n.z=o[3*P+2],e.type===ta.DIFFERENCE&&V.n.negate(),I=V;b<D&&s[b]<=g;)z=s[b],f=z+k,B.t=y[b],B.n.x=u[3*b],B.n.y=u[3*b+1],B.n.z=u[3*b+2],S=A[z],z<g?(w=A[f],S!==w&&(S===vt.AIR||w===vt.AIR)&&(x[T]=z,p[T]=B.t,v[3*T]=B.n.x,v[3*T+1]=B.n.y,v[3*T+2]=B.n.z,++T)):I=e.selectEdge(B,V,S===vt.SOLID),++b;x[T]=g,p[T]=I.t,v[3*T]=I.n.x,v[3*T+1]=I.n.y,v[3*T+2]=I.n.z,++T}for(;b<D;)z=s[b],f=z+k,S=A[z],w=A[f],S!==w&&(S===vt.AIR||w===vt.AIR)&&(x[T]=z,p[T]=y[b],v[3*T]=u[3*b],v[3*T+1]=u[3*b+1],v[3*T+2]=u[3*b+2],++T),++b;q[C]=T}return{edgeData:M,lengths:q}}function $(e,t,l){var i,r,o,u,p,v,k,g,h,f,S,w,I,T,C,P,b,E,D,F=ra,s=zt.resolution,n=s+1,m=n*n,A=new Uint32Array([1,n,m]),V=t.materialIndices,B=oa,N=new fe,O=new fe,q=new ut,L=new Uint32Array(3),M=new pt(s,pt.calculate1DEdgeCount(s));for(C=4,I=0,T=0;3>T;C>>=1,I=0,++T){P=He[C],i=M.indices[T],r=M.zeroCrossings[T],o=M.normals[T],u=A[T],k=l.min.x,f=l.max.x,g=l.min.y,S=l.max.y,h=l.min.z,w=l.max.z;for(0===T?(k=ge(k-1,0),f=he(f,s-1)):1===T?(g=ge(g-1,0),S=he(S,s-1)):2===T?(h=ge(h-1,0),w=he(w,s-1)):void 0,D=h;D<=w;++D)for(E=g;E<=S;++E)for(b=k;b<=f;++b)p=D*m+E*n+b,v=p+u,V[p]!==V[v]&&(N.set(b*F/s,E*F/s,D*F/s),O.set((b+P[0])*F/s,(E+P[1])*F/s,(D+P[2])*F/s),q.a.addVectors(B,N),q.b.addVectors(B,O),e.generateEdge(q),i[I]=p,r[I]=q.t,o[3*I]=q.n.x,o[3*I+1]=q.n.y,o[3*I+2]=q.n.z,++I);L[T]=I}return{edgeData:M,lengths:L}}function ee(e,t,a){var n,l,i,r,o=H(e),s=!1;if(e.type===ta.DENSITY_FUNCTION?K(e,t,o):t.empty?e.type===ta.UNION&&(t.set(a),s=!0):!(t.full&&e.type===ta.UNION)&&J(e,t,a,o),!s&&!t.empty&&!t.full){for(n=e.type===ta.DENSITY_FUNCTION?$(e,t,o):W(e,t,a),l=n.edgeData,i=n.lengths,r=0;3>r;++r)l.indices[r]=l.indices[r].slice(0,i[r]),l.zeroCrossings[r]=l.zeroCrossings[r].slice(0,i[r]),l.normals[r]=l.normals[r].slice(0,3*i[r]);t.edgeData=l}}function te(e){var t,a,n,r,o=e.children;for(e.type===ta.DENSITY_FUNCTION&&(t=new zt,ee(e,t)),n=0,r=o.length;n<r&&(a=te(o[n]),void 0===t?t=a:null===a?e.type===ta.INTERSECTION&&(t=null):null===t?e.type===ta.UNION&&(t=a):ee(e,t,a),null!==t||e.type===ta.UNION);++n);return null!==t&&t.empty?null:t}function ae(e){var t=document.createElementNS(\"http://www.w3.org/1999/xhtml\",\"canvas\"),a=t.getContext(\"2d\");return t.width=e.width,t.height=e.height,a.drawImage(e,0,0),a.getImageData(0,0,e.width,e.height)}var ze=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;e(this,t),this.runLengths=a,this.data=n}return n(t,null,[{key:\"encode\",value:function(e){var a,n,r=[],o=[],s=e[0],y=1;for(a=1,n=e.length;a<n;++a)s===e[a]?++y:(r.push(y),o.push(s),s=e[a],y=1);return r.push(y),o.push(s),new t(r,o)}},{key:\"decode\",value:function(e,t){var a,n,l,r,o,s=2<arguments.length&&void 0!==arguments[2]?arguments[2]:[],y=0;for(n=0,r=t.length;n<r;++n)for(a=t[n],l=0,o=e[n];l<o;++l)s[y++]=a;return s}}]),t}(),fe=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.x=a,this.y=n,this.z=l}return n(t,[{key:\"set\",value:function(e,t,a){return this.x=e,this.y=t,this.z=a,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}},{key:\"setFromSpherical\",value:function(e){this.setFromSphericalCoords(e.radius,e.phi,e.theta)}},{key:\"setFromSphericalCoords\",value:function(e,t,a){var n=xe(t)*e;return this.x=n*xe(a),this.y=me(t)*e,this.z=n*me(a),this}},{key:\"setFromCylindrical\",value:function(e){this.setFromCylindricalCoords(e.radius,e.theta,e.y)}},{key:\"setFromCylindricalCoords\",value:function(e,t,a){return this.x=e*xe(t),this.y=a,this.z=e*me(t),this}},{key:\"setFromMatrixColumn\",value:function(e,t){return this.fromArray(e.elements,4*t)}},{key:\"setFromMatrixPosition\",value:function(e){var t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}},{key:\"setFromMatrixScale\",value:function(e){var t=this.setFromMatrixColumn(e,0).length(),a=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=a,this.z=n,this}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this.z+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this.z-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this.z*=e,this}},{key:\"multiplyVectors\",value:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this.z/=e,this}},{key:\"crossVectors\",value:function(e,t){var a=e.x,n=e.y,l=e.z,i=t.x,r=t.y,o=t.z;return this.x=n*o-l*r,this.y=l*i-a*o,this.z=a*r-n*i,this}},{key:\"cross\",value:function(e){return this.crossVectors(this,e)}},{key:\"transformDirection\",value:function(t){var a=this.x,n=this.y,l=this.z,i=t.elements;return this.x=i[0]*a+i[4]*n+i[8]*l,this.y=i[1]*a+i[5]*n+i[9]*l,this.z=i[2]*a+i[6]*n+i[10]*l,this.normalize()}},{key:\"applyMatrix3\",value:function(t){var a=this.x,n=this.y,l=this.z,i=t.elements;return this.x=i[0]*a+i[3]*n+i[6]*l,this.y=i[1]*a+i[4]*n+i[7]*l,this.z=i[2]*a+i[5]*n+i[8]*l,this}},{key:\"applyMatrix4\",value:function(t){var a=this.x,n=this.y,l=this.z,i=t.elements;return this.x=i[0]*a+i[4]*n+i[8]*l+i[12],this.y=i[1]*a+i[5]*n+i[9]*l+i[13],this.z=i[2]*a+i[6]*n+i[10]*l+i[14],this}},{key:\"applyQuaternion\",value:function(e){var t=this.x,a=this.y,n=this.z,l=e.x,i=e.y,r=e.z,o=e.w,s=o*t+i*n-r*a,y=o*a+r*t-l*n,u=o*n+l*a-i*t,d=-l*t-i*a-r*n;return this.x=s*o+d*-l+y*-r-u*-i,this.y=y*o+d*-i+u*-l-s*-r,this.z=u*o+d*-r+s*-i-y*-l,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z}},{key:\"reflect\",value:function(e){var t=e.x,a=e.y,n=e.z;return this.sub(e.multiplyScalar(2*this.dot(e))),e.set(t,a,n),this}},{key:\"angleTo\",value:function(e){var t=this.dot(e)/ue(this.lengthSquared()*e.lengthSquared());return ye(he(ge(t,-1),1))}},{key:\"manhattanLength\",value:function(){return ke(this.x)+ke(this.y)+ke(this.z)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return ue(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"manhattanDistanceTo\",value:function(e){return ke(this.x-e.x)+ke(this.y-e.y)+ke(this.z-e.z)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y,n=this.z-e.z;return t*t+a*a+n*n}},{key:\"distanceTo\",value:function(e){return ue(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=he(this.x,e.x),this.y=he(this.y,e.y),this.z=he(this.z,e.z),this}},{key:\"max\",value:function(e){return this.x=ge(this.x,e.x),this.y=ge(this.y,e.y),this.z=ge(this.z,e.z),this}},{key:\"clamp\",value:function(e,t){return this.x=ge(e.x,he(t.x,this.x)),this.y=ge(e.y,he(t.y,this.y)),this.z=ge(e.z,he(t.z,this.z)),this}},{key:\"floor\",value:function(){return this.x=pe(this.x),this.y=pe(this.y),this.z=pe(this.z),this}},{key:\"ceil\",value:function(){return this.x=ve(this.x),this.y=ve(this.y),this.z=ve(this.z),this}},{key:\"round\",value:function(){return this.x=se(this.x),this.y=se(this.y),this.z=se(this.z),this}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}}]),t}(),Se=new fe,o=[new fe,new fe,new fe,new fe,new fe,new fe,new fe,new fe],v=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe(1/0,1/0,1/0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe(-Infinity,-Infinity,-Infinity);e(this,t),this.min=a,this.max=n}return n(t,[{key:\"set\",value:function(e,t){return this.min.copy(e),this.max.copy(t),this}},{key:\"copy\",value:function(e){return this.min.copy(e.min),this.max.copy(e.max),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-Infinity,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}},{key:\"setFromSphere\",value:function(e){return this.set(e.center,e.center),this.expandByScalar(e.radius),this}},{key:\"expandByPoint\",value:function(e){return this.min.min(e),this.max.max(e),this}},{key:\"expandByVector\",value:function(e){return this.min.sub(e),this.max.add(e),this}},{key:\"expandByScalar\",value:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this}},{key:\"setFromPoints\",value:function(e){var t,a;for(this.min.set(0,0,0),this.max.set(0,0,0),(t=0,a=e.length);t<a;++t)this.expandByPoint(e[t]);return this}},{key:\"setFromCenterAndSize\",value:function(e,t){var a=Se.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(a),this.max.copy(e).add(a),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe;return t.copy(e).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(e){var t=Se.copy(e).clamp(this.min,this.max);return t.sub(e).length()}},{key:\"applyMatrix4\",value:function(e){var t=this.min,a=this.max;return this.isEmpty()||(o[0].set(t.x,t.y,t.z).applyMatrix4(e),o[1].set(t.x,t.y,a.z).applyMatrix4(e),o[2].set(t.x,a.y,t.z).applyMatrix4(e),o[3].set(t.x,a.y,a.z).applyMatrix4(e),o[4].set(a.x,t.y,t.z).applyMatrix4(e),o[5].set(a.x,t.y,a.z).applyMatrix4(e),o[6].set(a.x,a.y,t.z).applyMatrix4(e),o[7].set(a.x,a.y,a.z).applyMatrix4(e),this.setFromPoints(o)),this}},{key:\"translate\",value:function(e){return this.min.add(e),this.max.add(e),this}},{key:\"intersect\",value:function(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(e){return this.min.min(e.min),this.max.max(e.max),this}},{key:\"containsPoint\",value:function(e){var t=this.min,a=this.max;return e.x>=t.x&&e.y>=t.y&&e.z>=t.z&&e.x<=a.x&&e.y<=a.y&&e.z<=a.z}},{key:\"containsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,l=e.max;return t.x<=n.x&&l.x<=a.x&&t.y<=n.y&&l.y<=a.y&&t.z<=n.z&&l.z<=a.z}},{key:\"intersectsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,l=e.max;return l.x>=t.x&&l.y>=t.y&&l.z>=t.z&&n.x<=a.x&&n.y<=a.y&&n.z<=a.z}},{key:\"intersectsSphere\",value:function(e){var t=this.clampPoint(e.center,Se);return t.distanceToSquared(e.center)<=e.radius*e.radius}},{key:\"intersectsPlane\",value:function(e){var t,a;return 0<e.normal.x?(t=e.normal.x*this.min.x,a=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,a=e.normal.x*this.min.x),0<e.normal.y?(t+=e.normal.y*this.min.y,a+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,a+=e.normal.y*this.min.y),0<e.normal.z?(t+=e.normal.z*this.min.z,a+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,a+=e.normal.z*this.min.z),t<=-e.constant&&a>=-e.constant}},{key:\"equals\",value:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}]),t}(),de=new v,ce=new fe,we=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.center=a,this.radius=n}return n(t,[{key:\"set\",value:function(e,t){return this.center.copy(e),this.radius=t,this}},{key:\"copy\",value:function(e){return this.center.copy(e.center),this.radius=e.radius,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromPoints\",value:function(e){var t,a,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:de.setFromPoints(e).getCenter(this.center),r=0;for(t=0,a=e.length;t<a;++t)r=ge(r,n.distanceToSquared(e[t]));return this.radius=ue(r),this}},{key:\"setFromBox\",value:function(e){return e.getCenter(this.center),this.radius=.5*e.getSize(ce).length(),this}},{key:\"isEmpty\",value:function(){return 0>=this.radius}},{key:\"translate\",value:function(e){return this.center.add(e),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe,a=this.center.distanceToSquared(e);return t.copy(e),a>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}},{key:\"distanceToPoint\",value:function(e){return e.distanceTo(this.center)-this.radius}},{key:\"containsPoint\",value:function(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}},{key:\"intersectsSphere\",value:function(e){var t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}},{key:\"intersectsBox\",value:function(e){return e.intersectsSphere(this)}},{key:\"intersectsPlane\",value:function(e){return ke(e.distanceToPoint(this.center))<=this.radius}},{key:\"equals\",value:function(e){return e.center.equals(this.center)&&e.radius===this.radius}}]),t}(),Ie=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.x=a,this.y=n}return n(t,[{key:\"set\",value:function(e,t){return this.x=e,this.y=t,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this}},{key:\"applyMatrix3\",value:function(t){var a=this.x,n=this.y,l=t.elements;return this.x=l[0]*a+l[3]*n+l[6],this.y=l[1]*a+l[4]*n+l[7],this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y}},{key:\"cross\",value:function(e){return this.x*e.y-this.y*e.x}},{key:\"manhattanLength\",value:function(){return ke(this.x)+ke(this.y)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y}},{key:\"length\",value:function(){return ue(this.x*this.x+this.y*this.y)}},{key:\"manhattanDistanceTo\",value:function(e){return ke(this.x-e.x)+ke(this.y-e.y)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y;return t*t+a*a}},{key:\"distanceTo\",value:function(e){return ue(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=he(this.x,e.x),this.y=he(this.y,e.y),this}},{key:\"max\",value:function(e){return this.x=ge(this.x,e.x),this.y=ge(this.y,e.y),this}},{key:\"clamp\",value:function(e,t){return this.x=ge(e.x,he(t.x,this.x)),this.y=ge(e.y,he(t.y,this.y)),this}},{key:\"floor\",value:function(){return this.x=pe(this.x),this.y=pe(this.y),this}},{key:\"ceil\",value:function(){return this.x=ve(this.x),this.y=ve(this.y),this}},{key:\"round\",value:function(){return this.x=se(this.x),this.y=se(this.y),this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this}},{key:\"angle\",value:function e(){var e=oe(this.y,this.x);return 0>e&&(e+=2*re),e}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"rotateAround\",value:function(e,t){var a=me(t),n=xe(t),l=this.x-e.x,i=this.y-e.y;return this.x=l*a-i*n+e.x,this.y=l*n+i*a+e.y,this}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y}},{key:\"width\",get:function(){return this.x},set:function(e){return this.x=e}},{key:\"height\",get:function(){return this.y},set:function(e){return this.y=e}}]),t}(),Te=new Ie,Ce=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ie(1/0,1/0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ie(-Infinity,-Infinity);e(this,t),this.min=a,this.max=n}return n(t,[{key:\"set\",value:function(e,t){return this.min.copy(e),this.max.copy(t),this}},{key:\"copy\",value:function(e){return this.min.copy(e.min),this.max.copy(e.max),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-Infinity,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ie;return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ie;return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}},{key:\"getBoundingSphere\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new we;return this.getCenter(e.center),e.radius=.5*this.getSize(Te).length(),e}},{key:\"expandByPoint\",value:function(e){return this.min.min(e),this.max.max(e),this}},{key:\"expandByVector\",value:function(e){return this.min.sub(e),this.max.add(e),this}},{key:\"expandByScalar\",value:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this}},{key:\"setFromPoints\",value:function(e){var t,a;for(this.min.set(0,0),this.max.set(0,0),(t=0,a=e.length);t<a;++t)this.expandByPoint(e[t]);return this}},{key:\"setFromCenterAndSize\",value:function(e,t){var a=Te.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(a),this.max.copy(e).add(a),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ie;return t.copy(e).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(e){var t=Te.copy(e).clamp(this.min,this.max);return t.sub(e).length()}},{key:\"translate\",value:function(e){return this.min.add(e),this.max.add(e),this}},{key:\"intersect\",value:function(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(e){return this.min.min(e.min),this.max.max(e.max),this}},{key:\"containsPoint\",value:function(e){var t=this.min,a=this.max;return e.x>=t.x&&e.y>=t.y&&e.x<=a.x&&e.y<=a.y}},{key:\"containsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,l=e.max;return t.x<=n.x&&l.x<=a.x&&t.y<=n.y&&l.y<=a.y}},{key:\"intersectsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,l=e.max;return l.x>=t.x&&l.y>=t.y&&n.x<=a.x&&n.y<=a.y}},{key:\"equals\",value:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}]),t}(),Pe=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.radius=a,this.theta=n,this.y=l}return n(t,[{key:\"set\",value:function(e,t,a){return this.radius=e,this.theta=t,this.y=a,this}},{key:\"copy\",value:function(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromVector3\",value:function(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}},{key:\"setFromCartesianCoords\",value:function(e,t,a){return this.radius=ue(e*e+a*a),this.theta=oe(e,a),this.y=t,this}}]),t}(),be=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,0,1,0,0,0,1])}return n(t,[{key:\"set\",value:function(e,t,a,n,l,i,r,o,s){var y=this.elements;return y[0]=e,y[3]=t,y[6]=a,y[1]=n,y[4]=l,y[7]=i,y[2]=r,y[5]=o,y[8]=s,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,1,0,0,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements,a=this.elements;return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],this}},{key:\"clone\",value:function(){return new this.constructor().fromArray(this.elements)}},{key:\"fromArray\",value:function(e){var t,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(t=0;9>t;++t)n[t]=e[t+a];return this}},{key:\"toArray\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(e=0;9>e;++e)t[e+a]=n[e];return t}},{key:\"multiplyMatrices\",value:function(e,t){var a=e.elements,n=t.elements,l=this.elements,i=a[0],r=a[3],o=a[6],s=a[1],y=a[4],u=a[7],d=a[2],c=a[5],m=a[8],x=n[0],p=n[3],v=n[6],k=n[1],g=n[4],h=n[7],z=n[2],f=n[5],S=n[8];return l[0]=i*x+r*k+o*z,l[3]=i*p+r*g+o*f,l[6]=i*v+r*h+o*S,l[1]=s*x+y*k+u*z,l[4]=s*p+y*g+u*f,l[7]=s*v+y*h+u*S,l[2]=d*x+c*k+m*z,l[5]=d*p+c*g+m*f,l[8]=d*v+c*h+m*S,this}},{key:\"multiply\",value:function(e){return this.multiplyMatrices(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyMatrices(e,this)}},{key:\"multiplyScalar\",value:function(e){var t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}},{key:\"determinant\",value:function(){var t=this.elements,n=t[0],a=t[1],l=t[2],r=t[3],o=t[4],e=t[5],s=t[6],y=t[7],u=t[8];return n*o*u-n*e*y-a*r*u+a*e*s+l*r*y-l*o*s}},{key:\"getInverse\",value:function(e){var t,a=e.elements,n=this.elements,l=a[0],i=a[1],r=a[2],o=a[3],s=a[4],y=a[5],u=a[6],d=a[7],c=a[8],m=c*s-y*d,x=y*u-c*o,p=d*o-s*u,v=l*m+i*x+r*p;return 0===v?(console.error(\"Can't invert matrix, determinant is zero\",e),this.identity()):(t=1/v,n[0]=m*t,n[1]=(r*d-c*i)*t,n[2]=(y*i-r*s)*t,n[3]=x*t,n[4]=(c*l-r*u)*t,n[5]=(r*o-y*l)*t,n[6]=p*t,n[7]=(i*u-d*l)*t,n[8]=(s*l-i*o)*t),this}},{key:\"transpose\",value:function(){var e,a=this.elements;return e=a[1],a[1]=a[3],a[3]=e,e=a[2],a[2]=a[6],a[6]=e,e=a[5],a[5]=a[7],a[7]=e,this}},{key:\"scale\",value:function(e,t){var a=this.elements;return a[0]*=e,a[3]*=e,a[6]*=e,a[1]*=t,a[4]*=t,a[7]*=t,this}},{key:\"rotate\",value:function(e){var t=me(e),a=xe(e),n=this.elements,l=n[0],i=n[3],r=n[6],o=n[1],s=n[4],y=n[7];return n[0]=t*l+a*o,n[3]=t*i+a*s,n[6]=t*r+a*y,n[1]=-a*l+t*o,n[4]=-a*i+t*s,n[7]=-a*r+t*y,this}},{key:\"translate\",value:function(e,t){var a=this.elements;return a[0]+=e*a[2],a[3]+=e*a[5],a[6]+=e*a[8],a[1]+=t*a[2],a[4]+=t*a[5],a[7]+=t*a[8],this}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&9>t;++t)a[t]!==n[t]&&(l=!1);return l}}]),t}(),Ee={XYZ:\"XYZ\",YZX:\"YZX\",ZXY:\"ZXY\",XZY:\"XZY\",YXZ:\"YXZ\",ZYX:\"ZYX\"},De=function(){var a=Number.EPSILON;function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;e(this,t),this.x=a,this.y=n,this.z=l,this.w=i}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.w=n,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}},{key:\"setFromEuler\",value:function(e){var t=e.x,a=e.y,n=e.z,l=me,i=xe,r=l(t/2),o=l(a/2),s=l(n/2),y=i(t/2),u=i(a/2),d=i(n/2);switch(e.order){case Ee.XYZ:this.x=y*o*s+r*u*d,this.y=r*u*s-y*o*d,this.z=r*o*d+y*u*s,this.w=r*o*s-y*u*d;break;case Ee.YXZ:this.x=y*o*s+r*u*d,this.y=r*u*s-y*o*d,this.z=r*o*d-y*u*s,this.w=r*o*s+y*u*d;break;case Ee.ZXY:this.x=y*o*s-r*u*d,this.y=r*u*s+y*o*d,this.z=r*o*d+y*u*s,this.w=r*o*s-y*u*d;break;case Ee.ZYX:this.x=y*o*s-r*u*d,this.y=r*u*s+y*o*d,this.z=r*o*d-y*u*s,this.w=r*o*s+y*u*d;break;case Ee.YZX:this.x=y*o*s+r*u*d,this.y=r*u*s+y*o*d,this.z=r*o*d-y*u*s,this.w=r*o*s-y*u*d;break;case Ee.XZY:this.x=y*o*s-r*u*d,this.y=r*u*s-y*o*d,this.z=r*o*d+y*u*s,this.w=r*o*s+y*u*d;}return this}},{key:\"setFromAxisAngle\",value:function(e,t){var a=t/2,n=xe(a);return this.x=e.x*n,this.y=e.y*n,this.z=e.z*n,this.w=me(a),this}},{key:\"setFromRotationMatrix\",value:function(e){var t,a=e.elements,n=a[0],l=a[4],i=a[8],r=a[1],o=a[5],y=a[9],u=a[2],d=a[6],c=a[10],m=n+o+c;return 0<m?(t=.5/ue(m+1),this.w=.25/t,this.x=(d-y)*t,this.y=(i-u)*t,this.z=(r-l)*t):n>o&&n>c?(t=2*ue(1+n-o-c),this.w=(d-y)/t,this.x=.25*t,this.y=(l+r)/t,this.z=(i+u)/t):o>c?(t=2*ue(1+o-n-c),this.w=(i-u)/t,this.x=(l+r)/t,this.y=.25*t,this.z=(y+d)/t):(t=2*ue(1+c-n-o),this.w=(r-l)/t,this.x=(i+u)/t,this.y=(y+d)/t,this.z=.25*t),this}},{key:\"setFromUnitVectors\",value:function(e,t){var a=e.dot(t)+1;return 1e-6>a?(a=0,ke(e.x)>ke(e.z)?(this.x=-e.y,this.y=e.x,this.z=0,this.w=a):(this.x=0,this.y=-e.z,this.z=e.y,this.w=a)):(this.x=e.y*t.z-e.z*t.y,this.y=e.z*t.x-e.x*t.z,this.z=e.x*t.y-e.y*t.x,this.w=a),this.normalize()}},{key:\"angleTo\",value:function(e){return 2*ye(ke(he(ge(this.dot(e),-1),1)))}},{key:\"rotateTowards\",value:function(e,t){var a=this.angleTo(e);return 0!==a&&this.slerp(e,he(1,t/a)),this}},{key:\"invert\",value:function(){return this.conjugate()}},{key:\"conjugate\",value:function(){return this.x*=-1,this.y*=-1,this.z*=-1,this}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return ue(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"normalize\",value:function(){var e,t=this.length();return 0===t?(this.x=0,this.y=0,this.z=0,this.w=1):(e=1/t,this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}},{key:\"multiplyQuaternions\",value:function(e,t){var a=e.x,n=e.y,l=e.z,i=e.w,r=t.x,o=t.y,s=t.z,y=t.w;return this.x=a*y+i*r+n*s-l*o,this.y=n*y+i*o+l*r-a*s,this.z=l*y+i*s+a*o-n*r,this.w=i*y-a*r-n*o-l*s,this}},{key:\"multiply\",value:function(e){return this.multiplyQuaternions(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyQuaternions(e,this)}},{key:\"slerp\",value:function(e,n){var t,l,i,r,o,u,d,c=this.x,m=this.y,y=this.z,x=this.w;return 1===n?this.copy(e):0<n&&(t=x*e.w+c*e.x+m*e.y+y*e.z,0>t?(this.w=-e.w,this.x=-e.x,this.y=-e.y,this.z=-e.z,t=-t):this.copy(e),1<=t?(this.w=x,this.x=c,this.y=m,this.z=y):(l=1-t*t,o=1-n,l<=a?(this.w=o*x+n*this.w,this.x=o*c+n*this.x,this.y=o*m+n*this.y,this.z=o*y+n*this.z,this.normalize()):(i=ue(l),r=oe(i,t),u=xe(o*r)/i,d=xe(n*r)/i,this.w=x*u+this.w*d,this.x=c*u+this.x*d,this.y=m*u+this.y*d,this.z=y*u+this.z*d))),this}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}}],[{key:\"slerp\",value:function(e,a,n,l){return n.copy(e).slerp(a,l)}},{key:\"slerpFlat\",value:function(e,n,l,i,r,o,y){var u,d,c,m,x,p,v,k,g=r[o],h=r[o+1],z=r[o+2],S=r[o+3],w=l[i],I=l[i+1],T=l[i+2],C=l[i+3];(C!==S||w!==g||I!==h||T!==z)&&(u=1-y,m=w*g+I*h+T*z+C*S,p=0<=m?1:-1,x=1-m*m,x>a&&(c=ue(x),v=oe(c,m*p),u=xe(u*v)/c,y=xe(y*v)/c),k=y*p,w=w*u+g*k,I=I*u+h*k,T=T*u+z*k,C=C*u+S*k,u===1-y&&(d=1/ue(w*w+I*I+T*T+C*C),w*=d,I*=d,T*=d,C*=d)),e[n]=w,e[n+1]=I,e[n+2]=T,e[n+3]=C}}]),t}(),Fe=new be,m=new De,q=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.x=a,this.y=n,this.z=l,this.order=t.defaultOrder}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.order=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.order=t.order,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.order)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.order=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.order,e}},{key:\"toVector3\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return e.set(this.x,this.y,this.z)}},{key:\"setFromRotationMatrix\",value:function(e){var t=Math.asin,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.order,n=e.elements,l=n[0],i=n[4],r=n[8],o=n[1],s=n[5],y=n[9],u=n[2],d=n[6],c=n[10],m=1-1e-5;switch(a){case Ee.XYZ:{this.y=t(C(r,-1,1)),ke(r)<m?(this.x=oe(-y,c),this.z=oe(-i,l)):(this.x=oe(d,s),this.z=0);break}case Ee.YXZ:{this.x=t(-C(y,-1,1)),ke(y)<m?(this.y=oe(r,c),this.z=oe(o,s)):(this.y=oe(-u,l),this.z=0);break}case Ee.ZXY:{this.x=t(C(d,-1,1)),ke(d)<m?(this.y=oe(-u,c),this.z=oe(-i,s)):(this.y=0,this.z=oe(o,l));break}case Ee.ZYX:{this.y=t(-C(u,-1,1)),ke(u)<m?(this.x=oe(d,c),this.z=oe(o,l)):(this.x=0,this.z=oe(-i,s));break}case Ee.YZX:{this.z=t(C(o,-1,1)),ke(o)<m?(this.x=oe(-y,s),this.y=oe(-u,l)):(this.x=0,this.y=oe(r,c));break}case Ee.XZY:{this.z=t(-C(i,-1,1)),ke(i)<m?(this.x=oe(d,s),this.y=oe(r,l)):(this.x=oe(-y,c),this.y=0);break}}return this.order=a,this}},{key:\"setFromQuaternion\",value:function(e,t){return Fe.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fe,t)}},{key:\"setFromVector3\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.order;return this.set(e.x,e.y,e.z,t)}},{key:\"reorder\",value:function(e){return m.setFromEuler(this),this.setFromQuaternion(m,e)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.order===this.order}}],[{key:\"defaultOrder\",get:function(){return Ee.XYZ}}]),t}(),Ae=new fe,a=new fe,b=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe(1,0,0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.normal=a,this.constant=n}return n(t,[{key:\"set\",value:function(e,t){return this.normal.copy(e),this.constant=t,this}},{key:\"setComponents\",value:function(e,t,a,n){return this.normal.set(e,t,a),this.constant=n,this}},{key:\"copy\",value:function(e){return this.normal.copy(e.normal),this.constant=e.constant,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromNormalAndCoplanarPoint\",value:function(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}},{key:\"setFromCoplanarPoints\",value:function(e,t,n){var l=Ae.subVectors(n,t).cross(a.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(l,Ae),this}},{key:\"normalize\",value:function(){var e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}},{key:\"negate\",value:function(){return this.normal.negate(),this.constant=-this.constant,this}},{key:\"distanceToPoint\",value:function(e){return this.normal.dot(e)+this.constant}},{key:\"distanceToSphere\",value:function(e){return this.distanceToPoint(e.center)-e.radius}},{key:\"projectPoint\",value:function(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}},{key:\"coplanarPoint\",value:function(e){return e.copy(this.normal).multiplyScalar(-this.constant)}},{key:\"translate\",value:function(e){return this.constant-=e.dot(this.normal),this}},{key:\"intersectLine\",value:function(e,a){var n=e.delta(Ae),l=this.normal.dot(n);if(0===l)0===this.distanceToPoint(e.start)&&a.copy(e.start);else{var i=-(e.start.dot(this.normal)+this.constant)/l;0<=i&&1>=i&&a.copy(n).multiplyScalar(i).add(e.start)}return a}},{key:\"intersectsLine\",value:function(e){var t=this.distanceToPoint(e.start),a=this.distanceToPoint(e.end);return 0>t&&0<a||0>a&&0<t}},{key:\"intersectsBox\",value:function(e){return e.intersectsPlane(this)}},{key:\"intersectsSphere\",value:function(e){return e.intersectsPlane(this)}},{key:\"equals\",value:function(e){return e.normal.equals(this.normal)&&e.constant===this.constant}}]),t}(),Ve=new fe,Be=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new b,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new b,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:new b,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:new b,r=4<arguments.length&&void 0!==arguments[4]?arguments[4]:new b,o=5<arguments.length&&void 0!==arguments[5]?arguments[5]:new b;e(this,t),this.planes=[a,n,l,i,r,o]}return n(t,[{key:\"set\",value:function(e,t,a,n,l,i){var r=this.planes;return r[0].copy(e),r[1].copy(t),r[2].copy(a),r[3].copy(n),r[4].copy(l),r[5].copy(i),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"copy\",value:function(e){var t,a=this.planes;for(t=0;6>t;++t)a[t].copy(e.planes[t]);return this}},{key:\"setFromMatrix\",value:function(e){var t=this.planes,a=e.elements,n=a[0],l=a[1],i=a[2],r=a[3],o=a[4],s=a[5],y=a[6],u=a[7],d=a[8],c=a[9],m=a[10],x=a[11],p=a[12],v=a[13],k=a[14],g=a[15];return t[0].setComponents(r-n,u-o,x-d,g-p).normalize(),t[1].setComponents(r+n,u+o,x+d,g+p).normalize(),t[2].setComponents(r+l,u+s,x+c,g+v).normalize(),t[3].setComponents(r-l,u-s,x-c,g-v).normalize(),t[4].setComponents(r-i,u-y,x-m,g-k).normalize(),t[5].setComponents(r+i,u+y,x+m,g+k).normalize(),this}},{key:\"intersectsSphere\",value:function(e){var t,a,n=this.planes,l=e.center,r=-e.radius,o=!0;for(t=0;6>t;++t)if(a=n[t].distanceToPoint(l),a<r){o=!1;break}return o}},{key:\"intersectsBox\",value:function(e){var t,a,n=this.planes,l=e.min,r=e.max;for(t=0;6>t;++t)if(a=n[t],Ve.x=0<a.normal.x?r.x:l.x,Ve.y=0<a.normal.y?r.y:l.y,Ve.z=0<a.normal.z?r.z:l.z,0>a.distanceToPoint(Ve))return!1;return!0}},{key:\"containsPoint\",value:function(e){var t,a=this.planes,n=!0;for(t=0;6>t;++t)if(0>a[t].distanceToPoint(e)){n=!1;break}return n}}]),t}(),Ne=new fe,Oe=new fe,qe=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe;e(this,t),this.start=a,this.end=n}return n(t,[{key:\"set\",value:function(e,t){return this.start.copy(e),this.end.copy(t),this}},{key:\"copy\",value:function(e){return this.start.copy(e.start),this.end.copy(e.end),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return e.addVectors(this.start,this.end).multiplyScalar(.5)}},{key:\"delta\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return e.subVectors(this.end,this.start)}},{key:\"lengthSquared\",value:function(){return this.start.distanceToSquared(this.end)}},{key:\"length\",value:function(){return this.start.distanceTo(this.end)}},{key:\"at\",value:function(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}},{key:\"closestPointToPointParameter\",value:function(e,a){Ne.subVectors(e,this.start),Oe.subVectors(this.end,this.start);var n=Oe.dot(Oe),l=Oe.dot(Ne),i=a?he(ge(l/n,0),1):l/n;return i}},{key:\"closestPointToPoint\",value:function(e){var a=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:new fe,l=this.closestPointToPointParameter(e,a);return this.delta(n).multiplyScalar(l).add(this.start)}},{key:\"equals\",value:function(e){return e.start.equals(this.start)&&e.end.equals(this.end)}}]),t}(),Le=new fe,Me=new fe,Re=new fe,c=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return n(t,[{key:\"set\",value:function(e,t,a,n,l,i,r,o,s,y,u,d,c,m,x,p){var v=this.elements;return v[0]=e,v[4]=t,v[8]=a,v[12]=n,v[1]=l,v[5]=i,v[9]=r,v[13]=o,v[2]=s,v[6]=y,v[10]=u,v[14]=d,v[3]=c,v[7]=m,v[11]=x,v[15]=p,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements,a=this.elements;return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],a[9]=t[9],a[10]=t[10],a[11]=t[11],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15],this}},{key:\"clone\",value:function(){return new this.constructor().fromArray(this.elements)}},{key:\"fromArray\",value:function(e){var t,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(t=0;16>t;++t)n[t]=e[t+a];return this}},{key:\"toArray\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(e=0;16>e;++e)t[e+a]=n[e];return t}},{key:\"getMaxScaleOnAxis\",value:function(){var e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],a=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return ue(ge(t,a,n))}},{key:\"copyPosition\",value:function(e){var t=this.elements,a=e.elements;return t[12]=a[12],t[13]=a[13],t[14]=a[14],this}},{key:\"setPosition\",value:function(e){var t=this.elements;return t[12]=e.x,t[13]=e.y,t[14]=e.z,this}},{key:\"extractBasis\",value:function(e,t,a){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),a.setFromMatrixColumn(this,2),this}},{key:\"makeBasis\",value:function(e,t,a){return this.set(e.x,t.x,a.x,0,e.y,t.y,a.y,0,e.z,t.z,a.z,0,0,0,0,1),this}},{key:\"extractRotation\",value:function(e){var t=this.elements,a=e.elements,n=1/Le.setFromMatrixColumn(e,0).length(),l=1/Le.setFromMatrixColumn(e,1).length(),i=1/Le.setFromMatrixColumn(e,2).length();return t[0]=a[0]*n,t[1]=a[1]*n,t[2]=a[2]*n,t[3]=0,t[4]=a[4]*l,t[5]=a[5]*l,t[6]=a[6]*l,t[7]=0,t[8]=a[8]*i,t[9]=a[9]*i,t[10]=a[10]*i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}},{key:\"makeRotationFromEuler\",value:function(t){var n,l,i,r,o,s,u,m,p,v,k,g,h=this.elements,S=t.x,x=t.y,y=t.z,z=me(S),a=xe(S),w=me(x),c=xe(x),d=me(y),e=xe(y);switch(t.order){case Ee.XYZ:{n=z*d,l=z*e,i=a*d,r=a*e,h[0]=w*d,h[4]=-w*e,h[8]=c,h[1]=l+i*c,h[5]=n-r*c,h[9]=-a*w,h[2]=r-n*c,h[6]=i+l*c,h[10]=z*w;break}case Ee.YXZ:{o=w*d,s=w*e,u=c*d,m=c*e,h[0]=o+m*a,h[4]=u*a-s,h[8]=z*c,h[1]=z*e,h[5]=z*d,h[9]=-a,h[2]=s*a-u,h[6]=m+o*a,h[10]=z*w;break}case Ee.ZXY:{o=w*d,s=w*e,u=c*d,m=c*e,h[0]=o-m*a,h[4]=-z*e,h[8]=u+s*a,h[1]=s+u*a,h[5]=z*d,h[9]=m-o*a,h[2]=-z*c,h[6]=a,h[10]=z*w;break}case Ee.ZYX:{n=z*d,l=z*e,i=a*d,r=a*e,h[0]=w*d,h[4]=i*c-l,h[8]=n*c+r,h[1]=w*e,h[5]=r*c+n,h[9]=l*c-i,h[2]=-c,h[6]=a*w,h[10]=z*w;break}case Ee.YZX:{p=z*w,v=z*c,k=a*w,g=a*c,h[0]=w*d,h[4]=g-p*e,h[8]=k*e+v,h[1]=e,h[5]=z*d,h[9]=-a*d,h[2]=-c*d,h[6]=v*e+k,h[10]=p-g*e;break}case Ee.XZY:{p=z*w,v=z*c,k=a*w,g=a*c,h[0]=w*d,h[4]=-e,h[8]=c*d,h[1]=p*e+g,h[5]=z*d,h[9]=v*e-k,h[2]=k*e-v,h[6]=a*d,h[10]=g*e+p;break}}return h[3]=0,h[7]=0,h[11]=0,h[12]=0,h[13]=0,h[14]=0,h[15]=1,this}},{key:\"makeRotationFromQuaternion\",value:function(e){return this.compose(Le.set(0,0,0),e,Me.set(1,1,1))}},{key:\"lookAt\",value:function(e,t,a){var n=this.elements,l=Le,i=Me,r=Re;return r.subVectors(e,t),0===r.lengthSquared()&&(r.z=1),r.normalize(),l.crossVectors(a,r),0===l.lengthSquared()&&(1===ke(a.z)?r.x+=1e-4:r.z+=1e-4,r.normalize(),l.crossVectors(a,r)),l.normalize(),i.crossVectors(r,l),n[0]=l.x,n[4]=i.x,n[8]=r.x,n[1]=l.y,n[5]=i.y,n[9]=r.y,n[2]=l.z,n[6]=i.z,n[10]=r.z,this}},{key:\"multiplyMatrices\",value:function(e,t){var a=this.elements,n=e.elements,l=t.elements,i=n[0],r=n[4],o=n[8],s=n[12],y=n[1],u=n[5],d=n[9],c=n[13],m=n[2],x=n[6],p=n[10],v=n[14],k=n[3],g=n[7],h=n[11],z=n[15],f=l[0],S=l[4],w=l[8],I=l[12],T=l[1],C=l[5],P=l[9],b=l[13],E=l[2],D=l[6],F=l[10],A=l[14],V=l[3],B=l[7],N=l[11],O=l[15];return a[0]=i*f+r*T+o*E+s*V,a[4]=i*S+r*C+o*D+s*B,a[8]=i*w+r*P+o*F+s*N,a[12]=i*I+r*b+o*A+s*O,a[1]=y*f+u*T+d*E+c*V,a[5]=y*S+u*C+d*D+c*B,a[9]=y*w+u*P+d*F+c*N,a[13]=y*I+u*b+d*A+c*O,a[2]=m*f+x*T+p*E+v*V,a[6]=m*S+x*C+p*D+v*B,a[10]=m*w+x*P+p*F+v*N,a[14]=m*I+x*b+p*A+v*O,a[3]=k*f+g*T+h*E+z*V,a[7]=k*S+g*C+h*D+z*B,a[11]=k*w+g*P+h*F+z*N,a[15]=k*I+g*b+h*A+z*O,this}},{key:\"multiply\",value:function(e){return this.multiplyMatrices(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyMatrices(e,this)}},{key:\"multiplyScalar\",value:function(e){var t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}},{key:\"determinant\",value:function(){var e=this.elements,t=e[0],a=e[4],n=e[8],l=e[12],i=e[1],r=e[5],o=e[9],s=e[13],y=e[2],u=e[6],d=e[10],c=e[14],m=e[3],x=e[7],p=e[11],v=e[15],k=t*r,g=t*o,h=t*s,z=a*i,f=a*o,S=a*s,w=n*i,I=n*r,T=n*s,C=l*i,P=l*r,b=l*o;return m*(b*u-T*u-P*d+S*d+I*c-f*c)+x*(g*c-h*d+C*d-w*c+T*y-b*y)+p*(h*u-k*c-C*u+z*c+P*y-S*y)+v*(-I*y-g*u+k*d+w*u-z*d+f*y)}},{key:\"getInverse\",value:function(e){var t,a=this.elements,n=e.elements,l=n[0],i=n[1],r=n[2],o=n[3],s=n[4],y=n[5],u=n[6],d=n[7],c=n[8],m=n[9],x=n[10],p=n[11],v=n[12],k=n[13],g=n[14],h=n[15],z=m*g*d-k*x*d+k*u*p-y*g*p-m*u*h+y*x*h,f=v*x*d-c*g*d-v*u*p+s*g*p+c*u*h-s*x*h,S=c*k*d-v*m*d+v*y*p-s*k*p-c*y*h+s*m*h,w=v*m*u-c*k*u-v*y*x+s*k*x+c*y*g-s*m*g,I=l*z+i*f+r*S+o*w;return 0===I?(console.error(\"Can't invert matrix, determinant is zero\",e),this.identity()):(t=1/I,a[0]=z*t,a[1]=(k*x*o-m*g*o-k*r*p+i*g*p+m*r*h-i*x*h)*t,a[2]=(y*g*o-k*u*o+k*r*d-i*g*d-y*r*h+i*u*h)*t,a[3]=(m*u*o-y*x*o-m*r*d+i*x*d+y*r*p-i*u*p)*t,a[4]=f*t,a[5]=(c*g*o-v*x*o+v*r*p-l*g*p-c*r*h+l*x*h)*t,a[6]=(v*u*o-s*g*o-v*r*d+l*g*d+s*r*h-l*u*h)*t,a[7]=(s*x*o-c*u*o+c*r*d-l*x*d-s*r*p+l*u*p)*t,a[8]=S*t,a[9]=(v*m*o-c*k*o-v*i*p+l*k*p+c*i*h-l*m*h)*t,a[10]=(s*k*o-v*y*o+v*i*d-l*k*d-s*i*h+l*y*h)*t,a[11]=(c*y*o-s*m*o-c*i*d+l*m*d+s*i*p-l*y*p)*t,a[12]=w*t,a[13]=(c*k*r-v*m*r+v*i*x-l*k*x-c*i*g+l*m*g)*t,a[14]=(v*y*r-s*k*r-v*i*u+l*k*u+s*i*g-l*y*g)*t,a[15]=(s*m*r-c*y*r+c*i*u-l*m*u-s*i*x+l*y*x)*t),this}},{key:\"transpose\",value:function(){var e,a=this.elements;return e=a[1],a[1]=a[4],a[4]=e,e=a[2],a[2]=a[8],a[8]=e,e=a[6],a[6]=a[9],a[9]=e,e=a[3],a[3]=a[12],a[12]=e,e=a[7],a[7]=a[13],a[13]=e,e=a[11],a[11]=a[14],a[14]=e,this}},{key:\"scale\",value:function(e,t,a){var n=this.elements;return n[0]*=e,n[4]*=t,n[8]*=a,n[1]*=e,n[5]*=t,n[9]*=a,n[2]*=e,n[6]*=t,n[10]*=a,n[3]*=e,n[7]*=t,n[11]*=a,this}},{key:\"makeScale\",value:function(e,t,a){return this.set(e,0,0,0,0,t,0,0,0,0,a,0,0,0,0,1),this}},{key:\"makeTranslation\",value:function(e,t,a){return this.set(1,0,0,e,0,1,0,t,0,0,1,a,0,0,0,1),this}},{key:\"makeRotationX\",value:function(e){var t=me(e),a=xe(e);return this.set(1,0,0,0,0,t,-a,0,0,a,t,0,0,0,0,1),this}},{key:\"makeRotationY\",value:function(e){var t=me(e),a=xe(e);return this.set(t,0,a,0,0,1,0,0,-a,0,t,0,0,0,0,1),this}},{key:\"makeRotationZ\",value:function(e){var t=me(e),a=xe(e);return this.set(t,-a,0,0,a,t,0,0,0,0,1,0,0,0,0,1),this}},{key:\"makeRotationAxis\",value:function(e,a){var n=me(a),l=xe(a),i=1-n,t=e.x,r=e.y,o=e.z,s=i*t,y=i*r;return this.set(s*t+n,s*r-l*o,s*o+l*r,0,s*r+l*o,y*r+n,y*o-l*t,0,s*o-l*r,y*o+l*t,i*o*o+n,0,0,0,0,1),this}},{key:\"makeShear\",value:function(e,t,a){return this.set(1,t,a,0,e,1,a,0,e,t,1,0,0,0,0,1),this}},{key:\"compose\",value:function(e,t,a){var n=this.elements,l=t.x,i=t.y,r=t.z,o=t.w,s=l+l,y=i+i,u=r+r,d=l*s,c=l*y,m=l*u,x=i*y,p=i*u,v=r*u,k=o*s,g=o*y,h=o*u,z=a.x,f=a.y,S=a.z;return n[0]=(1-(x+v))*z,n[1]=(c+h)*z,n[2]=(m-g)*z,n[3]=0,n[4]=(c-h)*f,n[5]=(1-(d+v))*f,n[6]=(p+k)*f,n[7]=0,n[8]=(m+g)*S,n[9]=(p-k)*S,n[10]=(1-(d+x))*S,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}},{key:\"decompose\",value:function(e,t,a){var n=this.elements,l=n[0],i=n[1],r=n[2],o=n[4],s=n[5],y=n[6],u=n[8],d=n[9],c=n[10],m=this.determinant(),x=Le.set(l,i,r).length()*(0>m?-1:1),p=Le.set(o,s,y).length(),v=Le.set(u,d,c).length(),k=1/x,g=1/p,h=1/v;return e.x=n[12],e.y=n[13],e.z=n[14],n[0]*=k,n[1]*=k,n[2]*=k,n[4]*=g,n[5]*=g,n[6]*=g,n[8]*=h,n[9]*=h,n[10]*=h,t.setFromRotationMatrix(this),n[0]=l,n[1]=i,n[2]=r,n[4]=o,n[5]=s,n[6]=y,n[8]=u,n[9]=d,n[10]=c,a.x=x,a.y=p,a.z=v,this}},{key:\"makePerspective\",value:function(e,t,a,n,l,i){var r=this.elements;return r[0]=2*l/(t-e),r[4]=0,r[8]=(t+e)/(t-e),r[12]=0,r[1]=0,r[5]=2*l/(a-n),r[9]=(a+n)/(a-n),r[13]=0,r[2]=0,r[6]=0,r[10]=-(i+l)/(i-l),r[14]=-2*i*l/(i-l),r[3]=0,r[7]=0,r[11]=-1,r[15]=0,this}},{key:\"makeOrthographic\",value:function(e,t,a,n,l,i){var r=this.elements,o=1/(t-e),s=1/(a-n),y=1/(i-l);return r[0]=2*o,r[4]=0,r[8]=0,r[12]=-((t+e)*o),r[1]=0,r[5]=2*s,r[9]=0,r[13]=-((a+n)*s),r[2]=0,r[6]=0,r[10]=-2*y,r[14]=-((i+l)*y),r[3]=0,r[7]=0,r[11]=0,r[15]=1,this}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&16>t;++t)a[t]!==n[t]&&(l=!1);return l}}]),t}(),Ye=[new fe,new fe,new fe,new fe],Xe=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe;e(this,t),this.origin=a,this.direction=n}return n(t,[{key:\"set\",value:function(e,t){return this.origin.copy(e),this.direction.copy(t),this}},{key:\"copy\",value:function(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"at\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe;return t.copy(this.direction).multiplyScalar(e).add(this.origin)}},{key:\"lookAt\",value:function(e){return this.direction.copy(e).sub(this.origin).normalize(),this}},{key:\"recast\",value:function(e){return this.origin.copy(this.at(e,Ye[0])),this}},{key:\"closestPointToPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe,a=t.subVectors(e,this.origin).dot(this.direction);return 0<=a?t.copy(this.direction).multiplyScalar(a).add(this.origin):t.copy(this.origin)}},{key:\"distanceSquaredToPoint\",value:function(e){var t=Ye[0].subVectors(e,this.origin).dot(this.direction);return 0>t?this.origin.distanceToSquared(e):Ye[0].copy(this.direction).multiplyScalar(t).add(this.origin).distanceToSquared(e)}},{key:\"distanceToPoint\",value:function(e){return ue(this.distanceSquaredToPoint(e))}},{key:\"distanceToPlane\",value:function(e){var a=e.normal.dot(this.direction),n=0===a?0===e.distanceToPoint(this.origin)?0:-1:-(this.origin.dot(e.normal)+e.constant)/a;return 0<=n?n:null}},{key:\"distanceSquaredToSegment\",value:function(e,t,a,n){var l,i,r,o,s,y=Ye[0].copy(e).add(t).multiplyScalar(.5),u=Ye[1].copy(t).sub(e).normalize(),d=Ye[2].copy(this.origin).sub(y),m=.5*e.distanceTo(t),x=-this.direction.dot(u),p=d.dot(this.direction),v=-d.dot(u),k=d.lengthSq(),c=ke(1-x*x);return 0<c?(l=x*v-p,i=x*p-v,r=m*c,0<=l?i>=-r?i<=r?(o=1/c,l*=o,i*=o,s=l*(l+x*i+2*p)+i*(x*l+i+2*v)+k):(i=m,l=ge(0,-(x*i+p)),s=-l*l+i*(i+2*v)+k):(i=-m,l=ge(0,-(x*i+p)),s=-l*l+i*(i+2*v)+k):i<=-r?(l=ge(0,-(-x*m+p)),i=0<l?-m:he(ge(-m,-v),m),s=-l*l+i*(i+2*v)+k):i<=r?(l=0,i=he(ge(-m,-v),m),s=i*(i+2*v)+k):(l=ge(0,-(x*m+p)),i=0<l?m:he(ge(-m,-v),m),s=-l*l+i*(i+2*v)+k)):(i=0<x?-m:m,l=ge(0,-(x*i+p)),s=-l*l+i*(i+2*v)+k),void 0!==a&&a.copy(this.direction).multiplyScalar(l).add(this.origin),void 0!==n&&n.copy(u).multiplyScalar(i).add(y),s}},{key:\"intersectSphere\",value:function(e){var t,a,n,l=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe,i=Ye[0].subVectors(e.center,this.origin),r=i.dot(this.direction),o=i.dot(i)-r*r,s=e.radius*e.radius,y=null;return o<=s&&(t=ue(s-o),a=r-t,n=r+t,(0<=a||0<=n)&&(y=0>a?this.at(n,l):this.at(a,l))),y}},{key:\"intersectsSphere\",value:function(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}},{key:\"intersectPlane\",value:function(e){var a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe,n=this.distanceToPlane(e);return null===n?null:this.at(n,a)}},{key:\"intersectsPlane\",value:function(e){var t=e.distanceToPoint(this.origin);return 0===t||0>e.normal.dot(this.direction)*t}},{key:\"intersectBox\",value:function(e){var t,a,n,l,i,r,o=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe,s=this.origin,y=this.direction,u=e.min,d=e.max,c=1/y.x,m=1/y.y,x=1/y.z,p=null;return 0<=c?(t=(u.x-s.x)*c,a=(d.x-s.x)*c):(t=(d.x-s.x)*c,a=(u.x-s.x)*c),0<=m?(n=(u.y-s.y)*m,l=(d.y-s.y)*m):(n=(d.y-s.y)*m,l=(u.y-s.y)*m),t<=l&&n<=a&&((n>t||t!==t)&&(t=n),(l<a||a!==a)&&(a=l),0<=x?(i=(u.z-s.z)*x,r=(d.z-s.z)*x):(i=(d.z-s.z)*x,r=(u.z-s.z)*x),t<=r&&i<=a&&((i>t||t!==t)&&(t=i),(r<a||a!==a)&&(a=r),0<=a&&(p=this.at(0<=t?t:a,o)))),p}},{key:\"intersectsBox\",value:function(e){return null!==this.intersectBox(e,Ye[0])}},{key:\"intersectTriangle\",value:function(e,t,a,n,l){var i,r,o,s,y,u=this.direction,d=Ye[0],c=Ye[1],m=Ye[2],x=Ye[3],p=null;return c.subVectors(t,e),m.subVectors(a,e),x.crossVectors(c,m),i=u.dot(x),0===i||n&&0<i||(0<i?r=1:(r=-1,i=-i),d.subVectors(this.origin,e),o=r*u.dot(m.crossVectors(d,m)),0<=o&&(s=r*u.dot(c.cross(d)),0<=s&&o+s<=i&&(y=-r*d.dot(x),0<=y&&(p=this.at(y/i,l))))),p}},{key:\"applyMatrix4\",value:function(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}},{key:\"equals\",value:function(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}}]),t}(),Ze=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.radius=a,this.phi=n,this.theta=l}return n(t,[{key:\"set\",value:function(e,t,a){return this.radius=e,this.phi=t,this.theta=a,this}},{key:\"copy\",value:function(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeSafe\",value:function(){return this.phi=ge(1e-6,he(re-1e-6,this.phi)),this}},{key:\"setFromVector3\",value:function(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}},{key:\"setFromCartesianCoords\",value:function(e,t,a){return this.radius=ue(e*e+t*t+a*a),0===this.radius?(this.theta=0,this.phi=0):(this.theta=oe(e,a),this.phi=ye(he(ge(t/this.radius,-1),1))),this}}]),t}(),_e=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,1,0,1])}return n(t,[{key:\"set\",value:function(t,a,n,l,i,r){var o=this.elements;return o[0]=t,o[1]=a,o[3]=l,o[2]=n,o[4]=i,o[5]=r,this}},{key:\"identity\",value:function(){return this.set(1,0,0,1,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements;return this.set(t[0],t[1],t[2],t[3],t[4],t[5]),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"toMatrix3\",value:function(e){var t=e.elements;e.set(t[0],t[1],t[2],t[1],t[3],t[4],t[2],t[4],t[5])}},{key:\"add\",value:function(e){var t=this.elements,a=e.elements;return t[0]+=a[0],t[1]+=a[1],t[3]+=a[3],t[2]+=a[2],t[4]+=a[4],t[5]+=a[5],this}},{key:\"norm\",value:function(){var t=this.elements,e=t[1]*t[1],a=t[2]*t[2],n=t[4]*t[4];return ue(t[0]*t[0]+e+a+e+t[3]*t[3]+n+a+n+t[5]*t[5])}},{key:\"off\",value:function(){var t=this.elements;return ue(2*(t[1]*t[1]+t[2]*t[2]+t[4]*t[4]))}},{key:\"applyToVector3\",value:function(t){var a=t.x,n=t.y,l=t.z,i=this.elements;return t.x=i[0]*a+i[1]*n+i[2]*l,t.y=i[1]*a+i[3]*n+i[4]*l,t.z=i[2]*a+i[4]*n+i[5]*l,t}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&6>t;++t)a[t]!==n[t]&&(l=!1);return l}}],[{key:\"calculateIndex\",value:function(e,t){return 3-(3-e)*(2-e)/2+t}}]),t}(),Ue=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;e(this,t),this.x=a,this.y=n,this.z=l,this.w=i}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.w=n,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}},{key:\"setAxisAngleFromQuaternion\",value:function(e){this.w=2*ye(e.w);var t=ue(1-e.w*e.w);return 1e-4>t?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}},{key:\"setAxisAngleFromRotationMatrix\",value:function(e){var t,a,n,l,i,r,o,u,d,c,m,p=.01,v=.1,k=e.elements,g=k[0],h=k[4],f=k[8],S=k[1],w=k[5],I=k[9],T=k[2],C=k[6],P=k[10];return ke(h-S)<p&&ke(f-T)<p&&ke(I-C)<p?ke(h+S)<v&&ke(f+T)<v&&ke(I+C)<v&&ke(g+w+P-3)<v?this.set(1,0,0,0):(t=re,i=(g+1)/2,r=(w+1)/2,o=(P+1)/2,u=(h+S)/4,d=(f+T)/4,c=(I+C)/4,i>r&&i>o?i<p?(a=0,n=.707106781,l=.707106781):(a=ue(i),n=u/a,l=d/a):r>o?r<p?(a=.707106781,n=0,l=.707106781):(n=ue(r),a=u/n,l=c/n):o<p?(a=.707106781,n=.707106781,l=0):(l=ue(o),a=d/l,n=c/l),this.set(a,n,l,t)):(m=ue((C-I)*(C-I)+(f-T)*(f-T)+(S-h)*(S-h)),.001>ke(m)&&(m=1),this.x=(C-I)/m,this.y=(f-T)/m,this.z=(S-h)/m,this.w=ye((g+w+P-1)/2)),this}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}},{key:\"multiplyVectors\",value:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this.w=e.w*t.w,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this.z/=e,this.w/=e,this}},{key:\"applyMatrix4\",value:function(t){var a=this.x,n=this.y,l=this.z,i=this.w,r=t.elements;return this.x=r[0]*a+r[4]*n+r[8]*l+r[12]*i,this.y=r[1]*a+r[5]*n+r[9]*l+r[13]*i,this.z=r[2]*a+r[6]*n+r[10]*l+r[14]*i,this.w=r[3]*a+r[7]*n+r[11]*l+r[15]*i,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}},{key:\"manhattanLength\",value:function(){return ke(this.x)+ke(this.y)+ke(this.z)+ke(this.w)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return ue(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"manhattanDistanceTo\",value:function(e){return ke(this.x-e.x)+ke(this.y-e.y)+ke(this.z-e.z)+ke(this.w-e.w)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y,n=this.z-e.z,l=this.w-e.w;return t*t+a*a+n*n+l*l}},{key:\"distanceTo\",value:function(e){return ue(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=he(this.x,e.x),this.y=he(this.y,e.y),this.z=he(this.z,e.z),this.w=he(this.w,e.w),this}},{key:\"max\",value:function(e){return this.x=ge(this.x,e.x),this.y=ge(this.y,e.y),this.z=ge(this.z,e.z),this.w=ge(this.w,e.w),this}},{key:\"clamp\",value:function(e,t){return this.x=ge(e.x,he(t.x,this.x)),this.y=ge(e.y,he(t.y,this.y)),this.z=ge(e.z,he(t.z,this.z)),this.w=ge(e.w,he(t.w,this.w)),this}},{key:\"floor\",value:function(){return this.x=pe(this.x),this.y=pe(this.y),this.z=pe(this.z),this.w=pe(this.w),this}},{key:\"ceil\",value:function(){return this.x=ve(this.x),this.y=ve(this.y),this.z=ve(this.z),this.w=ve(this.w),this}},{key:\"round\",value:function(){return this.x=se(this.x),this.y=se(this.y),this.z=se(this.z),this.w=se(this.w),this}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}}]),t}(),je=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1];e(this,t),this.value=a,this.done=n}return n(t,[{key:\"reset\",value:function(){this.value=null,this.done=!1}}]),t}(),Qe=new fe,Ge=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe;e(this,t),this.min=a,this.max=n,this.children=null}return n(t,[{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getDimensions\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return e.subVectors(this.max,this.min)}},{key:\"split\",value:function(){var e,t,a=this.min,n=this.max,l=this.getCenter(Qe),r=this.children=[null,null,null,null,null,null,null,null];for(e=0;8>e;++e)t=He[e],r[e]=new this.constructor(new fe(0===t[0]?a.x:l.x,0===t[1]?a.y:l.y,0===t[2]?a.z:l.z),new fe(0===t[0]?l.x:n.x,0===t[1]?l.y:n.y,0===t[2]?l.z:n.z))}}]),t}(),He=[new Uint8Array([0,0,0]),new Uint8Array([0,0,1]),new Uint8Array([0,1,0]),new Uint8Array([0,1,1]),new Uint8Array([1,0,0]),new Uint8Array([1,0,1]),new Uint8Array([1,1,0]),new Uint8Array([1,1,1])],Je=[new Uint8Array([0,4]),new Uint8Array([1,5]),new Uint8Array([2,6]),new Uint8Array([3,7]),new Uint8Array([0,2]),new Uint8Array([1,3]),new Uint8Array([4,6]),new Uint8Array([5,7]),new Uint8Array([0,1]),new Uint8Array([2,3]),new Uint8Array([4,5]),new Uint8Array([6,7])],Ke=new fe,We=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.min=a,this.size=n,this.children=null}return n(t,[{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return e.copy(this.min).addScalar(.5*this.size)}},{key:\"getDimensions\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return e.set(this.size,this.size,this.size)}},{key:\"split\",value:function(){var e,t,a=this.min,n=this.getCenter(Ke),l=.5*this.size,r=this.children=[null,null,null,null,null,null,null,null];for(e=0;8>e;++e)t=He[e],r[e]=new this.constructor(new fe(0===t[0]?a.x:n.x,0===t[1]?a.y:n.y,0===t[2]?a.z:n.z),l)}},{key:\"max\",get:function(){return this.min.clone().addScalar(this.size)}}]),t}(),$e=new v,et=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;e(this,t),this.octree=a,this.region=n,this.cull=null!==n,this.result=new je,this.trace=null,this.indices=null,this.reset()}return n(t,[{key:\"reset\",value:function(){var e=this.octree.root;return this.trace=[],this.indices=[],null!==e&&($e.min=e.min,$e.max=e.max,(!this.cull||this.region.intersectsBox($e))&&(this.trace.push(e),this.indices.push(0))),this.result.reset(),this}},{key:\"next\",value:function(){for(var e,t,a,n=this.cull,l=this.region,i=this.indices,r=this.trace,o=null,s=r.length-1;null===o&&0<=s;)if(e=i[s]++,t=r[s].children,!(8>e))r.pop(),i.pop(),--s;else if(null!==t){if(a=t[e],n&&($e.min=a.min,$e.max=a.max,!l.intersectsBox($e)))continue;r.push(a),i.push(0),++s}else o=r.pop(),i.pop();return this.result.value=o,this.result.done=null===o,this.result}},{key:\"return\",value:function(e){return this.result.value=e,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),tt=[new fe,new fe,new fe],at=new v,nt=new Xe,r=[new Uint8Array([4,2,1]),new Uint8Array([5,3,8]),new Uint8Array([6,8,3]),new Uint8Array([7,8,8]),new Uint8Array([8,6,5]),new Uint8Array([8,7,8]),new Uint8Array([8,8,7]),new Uint8Array([8,8,8])],lt=0,it=function(){function t(){e(this,t)}return n(t,null,[{key:\"intersectOctree\",value:function(e,t,a){var n,l,i,r,o,s,y,u,d,c=at.min.set(0,0,0),m=at.max.subVectors(e.max,e.min),x=e.getDimensions(tt[0]),p=tt[1].copy(x).multiplyScalar(.5),v=nt.origin.copy(t.ray.origin),k=nt.direction.copy(t.ray.direction);v.sub(e.getCenter(tt[2])).add(p),lt=0,0>k.x&&(v.x=x.x-v.x,k.x=-k.x,lt|=4),0>k.y&&(v.y=x.y-v.y,k.y=-k.y,lt|=2),0>k.z&&(v.z=x.z-v.z,k.z=-k.z,lt|=1),n=1/k.x,l=1/k.y,i=1/k.z,r=(c.x-v.x)*n,o=(m.x-v.x)*n,s=(c.y-v.y)*l,y=(m.y-v.y)*l,u=(c.z-v.z)*i,d=(m.z-v.z)*i,ge(ge(r,s),u)<he(he(o,y),d)&&D(e.root,r,s,u,o,y,d,t,a)}}]),t}(),rt=new v,ot=function(){function t(a,n){e(this,t),this.root=void 0!==a&&void 0!==n?new Ge(a,n):null}return n(t,[{key:\"getCenter\",value:function(e){return this.root.getCenter(e)}},{key:\"getDimensions\",value:function(e){return this.root.getDimensions(e)}},{key:\"getDepth\",value:function(){return F(this.root)}},{key:\"cull\",value:function(e){var t=[];return A(this.root,e,t),t}},{key:\"findOctantsByLevel\",value:function(e){var t=[];return V(this.root,e,0,t),t}},{key:\"raycast\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];return it.intersectOctree(this,e,t),t}},{key:\"leaves\",value:function(e){return new et(this,e)}},{key:Symbol.iterator,value:function(){return new et(this)}},{key:\"min\",get:function(){return this.root.min}},{key:\"max\",get:function(){return this.root.max}},{key:\"children\",get:function(){return this.root.children}}]),t}(),st=new fe,yt=new fe,p=new fe,ut=function(){function t(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe;e(this,t),this.a=n,this.b=a,this.index=-1,this.coordinates=new fe,this.t=0,this.n=new fe}return n(t,[{key:\"approximateZeroCrossing\",value:function(e){var t,n,l=1<arguments.length&&void 0!==arguments[1]?arguments[1]:8,r=ge(1,l-1),o=0,s=1,y=0,u=0;for(st.subVectors(this.b,this.a);u<=r&&(y=(o+s)/2,yt.addVectors(this.a,p.copy(st).multiplyScalar(y)),n=e.sample(yt),!(ke(n)<=1e-4||(s-o)/2<=1e-6));)yt.addVectors(this.a,p.copy(st).multiplyScalar(o)),t=e.sample(yt),ie(n)===ie(t)?o=y:s=y,++u;this.t=y}},{key:\"computeZeroCrossingPosition\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new fe;return e.subVectors(this.b,this.a).multiplyScalar(this.t).add(this.a)}},{key:\"computeSurfaceNormal\",value:function(e){var t=this.computeZeroCrossingPosition(st),a=1e-3,n=e.sample(yt.addVectors(t,p.set(a,0,0)))-e.sample(yt.subVectors(t,p.set(a,0,0))),l=e.sample(yt.addVectors(t,p.set(0,a,0)))-e.sample(yt.subVectors(t,p.set(0,a,0))),i=e.sample(yt.addVectors(t,p.set(0,0,a)))-e.sample(yt.subVectors(t,p.set(0,0,a)));this.n.set(n,l,i).normalize()}}]),t}(),dt=new ut,ct=new fe,mt=new fe,xt=function(){function t(a,n,l){var i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0,r=4<arguments.length&&void 0!==arguments[4]?arguments[4]:3;e(this,t),this.edgeData=a,this.cellPosition=n,this.cellSize=l,this.indices=null,this.zeroCrossings=null,this.normals=null,this.axes=null,this.lengths=null,this.result=new je,this.initialC=i,this.c=i,this.initialD=r,this.d=r,this.i=0,this.l=0,this.reset()}return n(t,[{key:\"reset\",value:function(){var e,t,n,i,r=this.edgeData,o=[],s=[],y=[],u=[],m=[];for(this.i=0,this.c=0,this.d=0,(t=this.initialC,e=4>>t,n=this.initialD);t<n;++t,e>>=1)i=r.indices[t].length,0<i&&(o.push(r.indices[t]),s.push(r.zeroCrossings[t]),y.push(r.normals[t]),u.push(He[e]),m.push(i),++this.d);return this.l=0<m.length?m[0]:0,this.indices=o,this.zeroCrossings=s,this.normals=y,this.axes=u,this.lengths=m,this.result.reset(),this}},{key:\"next\",value:function(){var e,t,a,l,r,o,u,d=this.cellSize,s=this.edgeData.resolution,n=s+1,m=n*n,p=this.result,v=this.cellPosition;return this.i===this.l&&(this.l=++this.c<this.d?this.lengths[this.c]:0,this.i=0),this.i<this.l?(o=this.c,u=this.i,e=this.axes[o],t=this.indices[o][u],dt.index=t,a=t%n,l=le(t%m/n),r=le(t/m),dt.coordinates.set(a,l,r),ct.set(a*d/s,l*d/s,r*d/s),mt.set((a+e[0])*d/s,(l+e[1])*d/s,(r+e[2])*d/s),dt.a.addVectors(v,ct),dt.b.addVectors(v,mt),dt.t=this.zeroCrossings[o][u],dt.n.fromArray(this.normals[o],3*u),p.value=dt,++this.i):(p.value=null,p.done=!0),p}},{key:\"return\",value:function(e){return this.result.value=e,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),pt=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:n,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:n;e(this,t),this.resolution=a,this.indices=0>=n?null:[new Uint32Array(n),new Uint32Array(l),new Uint32Array(i)],this.zeroCrossings=0>=n?null:[new Float32Array(n),new Float32Array(l),new Float32Array(i)],this.normals=0>=n?null:[new Float32Array(3*n),new Float32Array(3*l),new Float32Array(3*i)]}return n(t,[{key:\"serialize\",value:function(){return{resolution:this.resolution,edges:this.edges,zeroCrossings:this.zeroCrossings,normals:this.normals}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.resolution=e.resolution,this.edges=e.edges,this.zeroCrossings=e.zeroCrossings,this.normals=e.normals),t}},{key:\"createTransferList\",value:function(){var e,t,a,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],r=[this.edges[0],this.edges[1],this.edges[2],this.zeroCrossings[0],this.zeroCrossings[1],this.zeroCrossings[2],this.normals[0],this.normals[1],this.normals[2]];for(t=0,a=r.length;t<a;++t)e=r[t],null!==e&&n.push(e.buffer);return n}},{key:\"edges\",value:function(e,t){return new xt(this,e,t)}},{key:\"edgesX\",value:function(e,t){return new xt(this,e,t,0,1)}},{key:\"edgesY\",value:function(e,t){return new xt(this,e,t,1,2)}},{key:\"edgesZ\",value:function(e,t){return new xt(this,e,t,2,3)}}],[{key:\"calculate1DEdgeCount\",value:function(e){return ne(e+1,2)*e}}]),t}(),vt={AIR:0,SOLID:1},kt=0,gt=0,ht=0,zt=function(){function t(){var a=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];e(this,t),this.materials=0,this.materialIndices=a?new Uint8Array(ht):null,this.runLengths=null,this.edgeData=null}return n(t,[{key:\"set\",value:function(e){return this.materials=e.materials,this.materialIndices=e.materialIndices,this.runLengths=e.runLengths,this.edgeData=e.edgeData,this}},{key:\"clear\",value:function(){return this.materials=0,this.materialIndices=null,this.runLengths=null,this.edgeData=null,this}},{key:\"setMaterialIndex\",value:function(e,t){this.materialIndices[e]===vt.AIR?t!==vt.AIR&&++this.materials:t===vt.AIR&&--this.materials,this.materialIndices[e]=t}},{key:\"compress\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this;return this.compressed?(t.materialIndices=this.materialIndices,t.runLengths=this.runLengths):(e=this.full?new ze([this.materialIndices.length],[vt.SOLID]):ze.encode(this.materialIndices),t.materialIndices=new Uint8Array(e.data),t.runLengths=new Uint32Array(e.runLengths)),t.materials=this.materials,t}},{key:\"decompress\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this;return e.materialIndices=this.compressed?ze.decode(this.runLengths,this.materialIndices,new Uint8Array(ht)):this.materialIndices,e.runLengths=null,e.materials=this.materials,e}},{key:\"serialize\",value:function(){return{materials:this.materials,materialIndices:this.materialIndices,runLengths:this.runLengths,edgeData:null===this.edgeData?null:this.edgeData.serialize()}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.materials=e.materials,this.materialIndices=e.materialIndices,this.runLengths=e.runLengths,null===e.edgeData?this.edgeData=null:(null===this.edgeData&&(this.edgeData=new pt(gt)),this.edgeData.deserialize(e.edgeData))),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return null!==this.edgeData&&this.edgeData.createTransferList(e),null!==this.materialIndices&&e.push(this.materialIndices.buffer),null!==this.runLengths&&e.push(this.runLengths.buffer),e}},{key:\"empty\",get:function(){return 0===this.materials}},{key:\"full\",get:function(){return this.materials===ht}},{key:\"compressed\",get:function(){return null!==this.runLengths}},{key:\"neutered\",get:function(){return!this.empty&&null===this.materialIndices}}],[{key:\"isovalue\",get:function(){return kt},set:function(e){kt=e}},{key:\"resolution\",get:function(){return gt},set:function(e){var t=Math.log2;e=ne(2,ge(0,ve(t(e)))),gt=ge(1,he(256,e)),ht=ne(gt+1,3)}}]),t}(),ft=function(){function t(){e(this,t),this.ata=new _e,this.ata.set(0,0,0,0,0,0),this.atb=new fe,this.massPointSum=new fe,this.numPoints=0}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.ata.copy(e),this.atb.copy(t),this.massPointSum.copy(a),this.numPoints=n,this}},{key:\"copy\",value:function(e){return this.set(e.ata,e.atb,e.massPointSum,e.numPoints)}},{key:\"add\",value:function(e,t){var a=t.x,n=t.y,l=t.z,i=e.dot(t),r=this.ata.elements,o=this.atb;r[0]+=a*a,r[1]+=a*n,r[3]+=n*n,r[2]+=a*l,r[4]+=n*l,r[5]+=l*l,o.x+=i*a,o.y+=i*n,o.z+=i*l,this.massPointSum.add(e),++this.numPoints}},{key:\"addData\",value:function(e){this.ata.add(e.ata),this.atb.add(e.atb),this.massPointSum.add(e.massPointSum),this.numPoints+=e.numPoints}},{key:\"clear\",value:function(){this.ata.set(0,0,0,0,0,0),this.atb.set(0,0,0),this.massPointSum.set(0,0,0),this.numPoints=0}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}}]),t}(),St=new Ie,wt=function(){function t(){e(this,t)}return n(t,null,[{key:\"calculateCoefficients\",value:function(e,t,a){var n,l,i;return 0===t?(St.x=1,St.y=0):(n=(a-e)/(2*t),l=ue(1+n*n),i=1/(0<=n?n+l:n-l),St.x=1/ue(1+i*i),St.y=i*St.x),St}}]),t}(),It=function(){function t(){e(this,t)}return n(t,null,[{key:\"rotateXY\",value:function(e,t){var a=t.x,n=t.y,l=e.x,i=e.y;e.set(a*l-n*i,n*l+a*i)}},{key:\"rotateQXY\",value:function(e,t,a){var n=a.x,l=a.y,i=n*n,r=l*l,o=2*n*l*t,s=e.x,y=e.y;e.set(i*s-o+r*y,r*s+o+i*y)}}]),t}(),Tt=.1,Ct=new _e,Pt=new be,bt=new Ie,Et=new fe,Dt=function(){function t(){e(this,t)}return n(t,null,[{key:\"solve\",value:function(e,t,a){var n=L(Ct.copy(e),Pt.identity()),l=R(Pt,n);a.copy(t).applyMatrix3(l)}}]),t}(),Ft=new fe,At=function(){function t(){e(this,t),this.data=null,this.ata=new _e,this.atb=new fe,this.massPoint=new fe,this.hasSolution=!1}return n(t,[{key:\"setData\",value:function(e){return this.data=e,this.hasSolution=!1,this}},{key:\"solve\",value:function(e){var t=this.data,a=this.massPoint,n=this.ata.copy(t.ata),l=this.atb.copy(t.atb),i=1/0;return!this.hasSolution&&null!==t&&0<t.numPoints&&(Ft.copy(t.massPointSum).divideScalar(t.numPoints),a.copy(Ft),n.applyToVector3(Ft),l.sub(Ft),Dt.solve(n,l,e),i=Y(n,l,e),e.add(a),this.hasSolution=!0),i}}]),t}(),Vt=function t(){e(this,t),this.materials=0,this.edgeCount=0,this.index=-1,this.position=new fe,this.normal=new fe,this.qefData=null},Bt=new At,Nt=.1,Ot=-1,qt=function(t){function a(t,n){var l;return e(this,a),l=k(this,s(a).call(this,t,n)),l.voxel=null,l}return i(a,t),n(a,[{key:\"contains\",value:function(e){var t=this.min,a=this.size;return e.x>=t.x-Nt&&e.y>=t.y-Nt&&e.z>=t.z-Nt&&e.x<=t.x+a+Nt&&e.y<=t.y+a+Nt&&e.z<=t.z+a+Nt}},{key:\"collapse\",value:function(){var e,t,a,n,l,r,o,s=this.children,y=[-1,-1,-1,-1,-1,-1,-1,-1],u=new fe,d=-1,c=null!==s,m=0;if(c){for(n=new ft,r=0,o=0;8>o;++o)e=s[o],m+=e.collapse(),a=e.voxel,null===e.children?null!==a&&(n.addData(a.qefData),d=1&a.materials>>7-o,y[o]=1&a.materials>>o,++r):c=!1;if(c&&(l=Bt.setData(n).solve(u),l<=Ot)){for(a=new Vt,a.position.copy(this.contains(u)?u:Bt.massPoint),o=0;8>o;++o)t=y[o],e=s[o],-1===t?a.materials|=d<<o:(a.materials|=t<<o,a.normal.add(e.voxel.normal));a.normal.normalize(),a.qefData=n,this.voxel=a,this.children=null,m+=r-1}}return m}}],[{key:\"errorThreshold\",get:function(){return Ot},set:function(e){Ot=e}}]),a}(We),Lt=function t(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null;e(this,t),this.action=a,this.error=null},Mt=function(){function t(a,n,l,i,r){e(this,t),this.indices=a,this.positions=n,this.normals=l,this.uvs=i,this.materials=r}return n(t,[{key:\"serialize\",value:function(){return{indices:this.indices,positions:this.positions,normals:this.normals,uvs:this.uvs,materials:this.materials}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.indices=e.indices,this.positions=e.positions,this.normals=e.normals,this.uvs=e.uvs,this.materials=e.materials),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e.push(this.indices.buffer),e.push(this.positions.buffer),e.push(this.normals.buffer),e.push(this.uvs.buffer),e.push(this.materials.buffer),e}}]),t}(),Rt=[new Uint8Array([0,4,0]),new Uint8Array([1,5,0]),new Uint8Array([2,6,0]),new Uint8Array([3,7,0]),new Uint8Array([0,2,1]),new Uint8Array([4,6,1]),new Uint8Array([1,3,1]),new Uint8Array([5,7,1]),new Uint8Array([0,1,2]),new Uint8Array([2,3,2]),new Uint8Array([4,5,2]),new Uint8Array([6,7,2])],Yt=[new Uint8Array([0,1,2,3,0]),new Uint8Array([4,5,6,7,0]),new Uint8Array([0,4,1,5,1]),new Uint8Array([2,6,3,7,1]),new Uint8Array([0,2,4,6,2]),new Uint8Array([1,3,5,7,2])],Xt=[[new Uint8Array([4,0,0]),new Uint8Array([5,1,0]),new Uint8Array([6,2,0]),new Uint8Array([7,3,0])],[new Uint8Array([2,0,1]),new Uint8Array([6,4,1]),new Uint8Array([3,1,1]),new Uint8Array([7,5,1])],[new Uint8Array([1,0,2]),new Uint8Array([3,2,2]),new Uint8Array([5,4,2]),new Uint8Array([7,6,2])]],Zt=[[new Uint8Array([1,4,0,5,1,1]),new Uint8Array([1,6,2,7,3,1]),new Uint8Array([0,4,6,0,2,2]),new Uint8Array([0,5,7,1,3,2])],[new Uint8Array([0,2,3,0,1,0]),new Uint8Array([0,6,7,4,5,0]),new Uint8Array([1,2,0,6,4,2]),new Uint8Array([1,3,1,7,5,2])],[new Uint8Array([1,1,0,3,2,0]),new Uint8Array([1,5,4,7,6,0]),new Uint8Array([0,1,5,0,4,1]),new Uint8Array([0,3,7,2,6,1])]],_t=[[new Uint8Array([3,2,1,0,0]),new Uint8Array([7,6,5,4,0])],[new Uint8Array([5,1,4,0,1]),new Uint8Array([7,3,6,2,1])],[new Uint8Array([6,4,2,0,2]),new Uint8Array([7,5,3,1,2])]],Ut=[new Uint8Array([3,2,1,0]),new Uint8Array([7,5,6,4]),new Uint8Array([11,10,9,8])],jt=ne(2,16)-1,Qt=function(){function t(){e(this,t)}return n(t,null,[{key:\"run\",value:function(e){var t=[],a=e.voxelCount,n=null,l=null,i=null,r=null,o=null;return a>jt?console.warn(\"Could not create geometry for cell at position\",e.min,\"(vertex count of\",a,\"exceeds limit of \",jt,\")\"):0<a&&(l=new Float32Array(3*a),i=new Float32Array(3*a),r=new Float32Array(2*a),o=new Uint8Array(a),j(e.root,l,i,0),U(e.root,t),n=new Mt(new Uint16Array(t),l,i,r,o)),n}}]),t}(),Gt=function(t){function a(t){var n,l=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new fe,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1;return e(this,a),n=k(this,s(a).call(this)),n.root=new qt(l,i),n.voxelCount=0,null!==t&&null!==t.edgeData&&n.construct(t),0<=qt.errorThreshold&&n.simplify(),n}return i(a,t),n(a,[{key:\"simplify\",value:function(){this.voxelCount-=this.root.collapse()}},{key:\"construct\",value:function(e){var t,a,l,r,o,s,u,c,m,p,v,k=zt.resolution,n=e.edgeData,g=e.materialIndices,h=new At,f=new fe,S=[n.edgesX(this.min,this.root.size),n.edgesY(this.min,this.root.size),n.edgesZ(this.min,this.root.size)],w=[new Uint8Array([0,1,2,3]),new Uint8Array([0,1,4,5]),new Uint8Array([0,2,4,6])],I=0;for(p=0;3>p;++p){l=w[p],t=S[p];var T=!0,C=!1,P=void 0;try{for(var b,E=t[Symbol.iterator]();!(T=(b=E.next()).done);T=!0)for(a=b.value,a.computeZeroCrossingPosition(f),v=0;4>v;++v)r=He[l[v]],u=a.coordinates.x-r[0],c=a.coordinates.y-r[1],m=a.coordinates.z-r[2],0<=u&&0<=c&&0<=m&&u<k&&c<k&&m<k&&(o=Q(this.root,k,u,c,m),null===o.voxel&&(o.voxel=G(k,u,c,m,g),++I),s=o.voxel,s.normal.add(a.n),s.qefData.add(f,a.n),s.qefData.numPoints===s.edgeCount&&(h.setData(s.qefData).solve(s.position),!o.contains(s.position)&&s.position.copy(h.massPoint),s.normal.normalize()))}catch(e){C=!0,P=e}finally{try{T||null==E[\"return\"]||E[\"return\"]()}finally{if(C)throw P}}}this.voxelCount=I}}]),a}(ot),Ht={EXTRACT:\"worker.extract\",MODIFY:\"worker.modify\",CONFIGURE:\"worker.config\",CLOSE:\"worker.close\"},Jt=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;return e(this,a),t=k(this,s(a).call(this,n)),t.data=null,t}return i(a,t),a}(Lt),Kt=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this,Ht.EXTRACT)),t.isosurface=null,t}return i(a,t),a}(Jt),Wt=new zt(!1),$t=function(){function t(){e(this,t),this.data=null,this.response=null}return n(t,[{key:\"getData\",value:function(){return this.data}},{key:\"respond\",value:function(){return this.response.data=this.data.serialize(),this.response}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return null!==this.data&&this.data.createTransferList(e),e}},{key:\"process\",value:function(e){return this.data=Wt.deserialize(e.data),this}}]),t}(),ea=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this)),t.response=new Kt,t.decompressionTarget=new zt(!1),t.isosurface=null,t}return i(a,t),n(a,[{key:\"respond\",value:function(){var e=h(s(a.prototype),\"respond\",this).call(this);return e.isosurface=null===this.isosurface?null:this.isosurface.serialise(),e}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return h(s(a.prototype),\"createTransferList\",this).call(this,e),null===this.isosurface?e:this.isosurface.createTransferList(e)}},{key:\"process\",value:function(e){var t=h(s(a.prototype),\"process\",this).call(this,e).getData(),n=new Gt(t.decompress(this.decompressionTarget));return this.isosurface=Qt.run(n),this.decompressionTarget.clear(),this}}]),a}($t),ta={UNION:\"csg.union\",DIFFERENCE:\"csg.difference\",INTERSECTION:\"csg.intersection\",DENSITY_FUNCTION:\"csg.densityfunction\"},aa=function(){function t(a){e(this,t),this.type=a;for(var n=arguments.length,l=Array(1<n?n-1:0),i=1;i<n;i++)l[i-1]=arguments[i];this.children=l,this.boundingBox=null}return n(t,[{key:\"getBoundingBox\",value:function(){return null===this.boundingBox&&(this.boundingBox=this.computeBoundingBox()),this.boundingBox}},{key:\"computeBoundingBox\",value:function(){var e,t,a=this.children,n=new v;for(e=0,t=a.length;e<t;++e)n.union(a[e].getBoundingBox());return n}}]),t}(),na=function(t){function a(){var t;e(this,a);for(var n=arguments.length,l=Array(n),i=0;i<n;i++)l[i]=arguments[i];return k(this,(t=s(a)).call.apply(t,[this,ta.UNION].concat(l)))}return i(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){var n=a.materialIndices[e];n!==vt.AIR&&t.setMaterialIndex(e,n)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t>t.t?e:t:e.t<t.t?e:t}}]),a}(aa),la=function(t){function a(){var t;e(this,a);for(var n=arguments.length,l=Array(n),i=0;i<n;i++)l[i]=arguments[i];return k(this,(t=s(a)).call.apply(t,[this,ta.DIFFERENCE].concat(l)))}return i(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){a.materialIndices[e]!==vt.AIR&&t.setMaterialIndex(e,vt.AIR)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t<t.t?e:t:e.t>t.t?e:t}}]),a}(aa),ia=function(t){function a(){var t;e(this,a);for(var n=arguments.length,l=Array(n),i=0;i<n;i++)l[i]=arguments[i];return k(this,(t=s(a)).call.apply(t,[this,ta.INTERSECTION].concat(l)))}return i(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){var n=a.materialIndices[e];t.setMaterialIndex(e,t.materialIndices[e]!==vt.AIR&&n!==vt.AIR?n:vt.AIR)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t<t.t?e:t:e.t>t.t?e:t}}]),a}(aa),ra=0,oa=new fe,sa=function(){function t(){e(this,t)}return n(t,null,[{key:\"run\",value:function(e,t,a,n){oa.fromArray(e),ra=t,null===a?n.operation===ta.UNION&&(a=new zt(!1)):a.decompress();var l=n.toCSG(),i=null===a?null:te(l);if(null!==i){switch(n.operation){case ta.UNION:l=new na(l);break;case ta.DIFFERENCE:l=new la(l);break;case ta.INTERSECTION:l=new ia(l);}ee(l,a,i),a.contoured=!1}return null!==a&&a.empty?null:a}}]),t}(),ya=function(t){function a(t){var n;return e(this,a),n=k(this,s(a).call(this,ta.DENSITY_FUNCTION)),n.sdf=t,n}return i(a,t),n(a,[{key:\"computeBoundingBox\",value:function(){return this.sdf.getBoundingBox(!0)}},{key:\"generateMaterialIndex\",value:function(e){return this.sdf.sample(e)<=zt.isovalue?this.sdf.material:vt.AIR}},{key:\"generateEdge\",value:function(e){e.approximateZeroCrossing(this.sdf),e.computeSurfaceNormal(this.sdf)}}]),a}(aa),ua=new c,da=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:vt.SOLID;e(this,t),this.type=a,this.operation=null,this.material=he(255,ge(vt.SOLID,le(n))),this.boundingBox=null,this.position=new fe,this.quaternion=new De,this.scale=new fe(1,1,1),this.inverseTransformation=new c,this.updateInverseTransformation(),this.children=[]}return n(t,[{key:\"getTransformation\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new c;return e.compose(this.position,this.quaternion,this.scale)}},{key:\"getBoundingBox\",value:function(){var e,t,a=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],n=this.children,r=this.boundingBox;if(null===r&&(r=this.computeBoundingBox(),this.boundingBox=r),a)for(r=r.clone(),e=0,t=n.length;e<t;++e)r.union(n[e].getBoundingBox(a));return r}},{key:\"setMaterial\",value:function(e){return this.material=he(255,ge(vt.SOLID,le(e))),this}},{key:\"setOperationType\",value:function(e){return this.operation=e,this}},{key:\"updateInverseTransformation\",value:function(){return this.inverseTransformation.getInverse(this.getTransformation(ua)),this.boundingBox=null,this}},{key:\"union\",value:function(e){return this.children.push(e.setOperationType(ta.UNION)),this}},{key:\"subtract\",value:function(e){return this.children.push(e.setOperationType(ta.DIFFERENCE)),this}},{key:\"intersect\",value:function(e){return this.children.push(e.setOperationType(ta.INTERSECTION)),this}},{key:\"toCSG\",value:function(){var e,t,a,n,r=this.children,o=new ya(this);for(a=0,n=r.length;a<n;++a)t=r[a],e!==t.operation&&(e=t.operation,e===ta.UNION?o=new na(o):e===ta.DIFFERENCE?o=new la(o):e===ta.INTERSECTION?o=new ia(o):void 0),o.children.push(t.toCSG());return o}},{key:\"serialize\",value:function(){var e,t,a=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],n={type:this.type,operation:this.operation,material:this.material,position:this.position.toArray(),quaternion:this.quaternion.toArray(),scale:this.scale.toArray(),parameters:null,children:[]};for(e=0,t=this.children.length;e<t;++e)n.children.push(this.children[e].serialize(a));return n}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e}},{key:\"toJSON\",value:function(){return this.serialize(!0)}},{key:\"computeBoundingBox\",value:function(){throw new Error(\"SignedDistanceFunction#computeBoundingBox method not implemented!\")}},{key:\"sample\",value:function(){throw new Error(\"SignedDistanceFunction#sample method not implemented!\")}}]),t}(),ca={HEIGHTFIELD:\"sdf.heightfield\",FRACTAL_NOISE:\"sdf.fractalnoise\",SUPER_PRIMITIVE:\"sdf.superprimitive\"},ma=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},l=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,ca.PERLIN_NOISE,l)),t.min=d(fe,S(n.min)),t.max=d(fe,S(n.max)),t}return i(a,t),n(a,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new v(this.min,this.max),this.bbox}},{key:\"sample\",value:function(){}},{key:\"serialize\",value:function(){var e=h(s(a.prototype),\"serialize\",this).call(this);return e.parameters={min:this.min.toArray(),max:this.max.toArray()},e}}]),a}(da),xa=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},l=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,ca.HEIGHTFIELD,l)),t.width=void 0===n.width?1:n.width,t.height=void 0===n.height?1:n.height,t.smooth=void 0===n.smooth||n.smooth,t.data=void 0===n.data?null:n.data,t.heightmap=null,void 0!==n.image&&t.fromImage(n.image),t}return i(a,t),n(a,[{key:\"fromImage\",value:function(e){var t,a,n,r,o=\"undefined\"==typeof document?null:ae(e),s=null;if(null!==o){for(t=o.data,s=new Uint8ClampedArray(t.length/4),(a=0,n=0,r=s.length);a<r;++a,n+=4)s[a]=t[n];this.heightmap=e,this.width=o.width,this.height=o.height,this.data=s}return this}},{key:\"getHeight\",value:function(e,t){var n,l=this.width,i=this.height,r=this.data;if(e=se(e*l),t=se(t*i),this.smooth){e=ge(he(e,l-1),1),t=ge(he(t,i-1),1);var o=e+1,s=e-1,y=t*l,a=y+l,u=y-l;n=(r[u+s]+r[u+e]+r[u+o]+r[y+s]+r[y+e]+r[y+o]+r[a+s]+r[a+e]+r[a+o])/9}else n=r[t*l+e];return n}},{key:\"computeBoundingBox\",value:function(){var e=new v,t=he(this.width/this.height,1),a=he(this.height/this.width,1);return e.min.set(0,0,0),e.max.set(t,1,a),e.applyMatrix4(this.getTransformation()),e}},{key:\"sample\",value:function(e){var t,a=this.boundingBox;return a.containsPoint(e)?(e.applyMatrix4(this.inverseTransformation),t=e.y-this.getHeight(e.x,e.z)/255):t=a.distanceToPoint(e),t}},{key:\"serialize\",value:function(){var e=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],t=h(s(a.prototype),\"serialize\",this).call(this);return t.parameters={width:this.width,height:this.height,smooth:this.smooth,data:e?null:this.data,dataURL:e&&null!==this.heightmap?this.heightmap.toDataURL():null,image:null},t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e.push(this.data.buffer),e}}]),a}(da),pa=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},l=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,ca.SUPER_PRIMITIVE,l)),t.s0=d(Ue,S(n.s)),t.r0=d(fe,S(n.r)),t.s=new Ue,t.r=new fe,t.ba=new Ie,t.offset=0,t.precompute(),t}return i(a,t),n(a,[{key:\"setSize\",value:function(e,t,a,n){return this.s0.set(e,t,a,n),this.precompute()}},{key:\"setRadii\",value:function(e,t,a){return this.r0.set(e,t,a),this.precompute()}},{key:\"precompute\",value:function(){var e=this.s.copy(this.s0),t=this.r.copy(this.r0),a=this.ba;e.x-=t.x,e.y-=t.x,t.x-=e.w,e.w-=t.y,e.z-=t.y,this.offset=-2*e.z,a.set(t.z,this.offset);var n=a.dot(a);return 0===n?a.set(0,-1):a.divideScalar(n),this}},{key:\"computeBoundingBox\",value:function(){var e=this.s0,t=new v;return t.min.x=he(-e.x,-1),t.min.y=he(-e.y,-1),t.min.z=he(-e.z,-1),t.max.x=ge(e.x,1),t.max.y=ge(e.y,1),t.max.z=ge(e.z,1),t.applyMatrix4(this.getTransformation()),t}},{key:\"sample\",value:function(e){e.applyMatrix4(this.inverseTransformation);var t=this.s,a=this.r,n=this.ba,l=ke(e.x)-t.x,i=ke(e.y)-t.y,r=ke(e.z)-t.z,o=ge(l,0),s=ge(i,0),y=ue(o*o+s*s),u=e.z-t.z,d=ke(y+he(0,ge(l,i))-a.x)-t.w,m=he(ge(d*n.x+u*n.y,0),1),c=d-a.z*m,x=u-this.offset*m,p=ge(d-a.z,0),v=e.z+t.z,k=ge(d,0),g=d*-n.y+u*n.x,h=ue(he(c*c+x*x,he(p*p+v*v,k*k+u*u)));return h*ie(ge(g,r))-a.y}},{key:\"serialize\",value:function(){var e=h(s(a.prototype),\"serialize\",this).call(this);return e.parameters={s:this.s0.toArray(),r:this.r0.toArray()},e}}],[{key:\"create\",value:function(e){var t=va[e];return new a({s:t[0],r:t[1]})}}]),a}(da),va=[[new Float32Array([1,1,1,1]),new Float32Array([0,0,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,0,0])],[new Float32Array([0,0,1,1]),new Float32Array([0,0,1])],[new Float32Array([1,1,2,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,.25,1]),new Float32Array([1,.25,0])],[new Float32Array([1,1,.25,.25]),new Float32Array([1,.25,0])],[new Float32Array([1,1,1,.25]),new Float32Array([1,.1,0])],[new Float32Array([1,1,1,.25]),new Float32Array([.1,.1,0])]],ka=function(){function t(){e(this,t)}return n(t,[{key:\"revive\",value:function(e){var t,a,n;switch(e.type){case ca.FRACTAL_NOISE:t=new ma(e.parameters,e.material);break;case ca.HEIGHTFIELD:t=new xa(e.parameters,e.material);break;case ca.SUPER_PRIMITIVE:t=new pa(e.parameters,e.material);}for(t.operation=e.operation,t.position.fromArray(e.position),t.quaternion.fromArray(e.quaternion),t.scale.fromArray(e.scale),t.updateInverseTransformation(),(a=0,n=e.children.length);a<n;++a)t.children.push(this.revive(e.children[a]));return t}}]),t}(),ga=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this,Ht.MODIFY)),t.sdf=null,t}return i(a,t),a}(Jt),ha=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this)),t.response=new ga,t.sdf=null,t}return i(a,t),n(a,[{key:\"respond\",value:function(){var e=h(s(a.prototype),\"respond\",this).call(this);return e.sdf=null===this.sdf?null:this.sdf.serialize(),e}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return h(s(a.prototype),\"createTransferList\",this).call(this,e),null===this.sdf?e:this.sdf.createTransferList(e)}},{key:\"process\",value:function(e){var t=h(s(a.prototype),\"process\",this).call(this,e).getData(),n=this.sdf=ka.revive(e.sdf),l=sa.run(e.cellPosition,e.cellSize,t,n);return f(s(a.prototype),\"data\",null===l?null:l.compress(),this,!0),this}}]),a}($t),za=new ha,fa=new ea,Sa=null;self.addEventListener(\"message\",function(e){var t=e.data;switch(Sa=t.action,Sa){case Ht.MODIFY:postMessage(za.process(t).respond(),za.createTransferList());break;case Ht.EXTRACT:postMessage(fa.process(t).respond(),fa.createTransferList());break;case Ht.CONFIGURE:zt.resolution=t.resolution,qt.errorThreshold=t.errorThreshold;break;case Ht.CLOSE:default:close();}}),self.addEventListener(\"error\",function(e){var t,a=Sa===Ht.MODIFY?za:Sa===Ht.EXTRACT?fa:null;null===a?(t=new Lt(Ht.CLOSE),t.error=e,postMessage(t)):(t=a.respond(),t.action=Ht.CLOSE,t.error=e,postMessage(t,a.createTransferList())),close()})})();\n";

  var ThreadPool = function (_EventTarget) {
    _inherits(ThreadPool, _EventTarget);

    function ThreadPool() {
      var _this;

      var maxWorkers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navigator.hardwareConcurrency;

      _classCallCheck(this, ThreadPool);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ThreadPool).call(this));
      _this.workerURL = URL.createObjectURL(new Blob([worker], {
        type: "text/javascript"
      }));
      _this.maxWorkers = Math.min(navigator.hardwareConcurrency, Math.max(maxWorkers, 1));
      _this.workers = [];
      _this.busyWorkers = new WeakSet();
      _this.configurationMessage = new ConfigurationMessage();
      return _this;
    }

    _createClass(ThreadPool, [{
      key: "handleEvent",
      value: function handleEvent(event) {
        switch (event.type) {
          case "message":
            {
              this.busyWorkers["delete"](event.target);
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
      value: function closeWorker(worker) {
        var index = this.workers.indexOf(worker);

        if (this.busyWorkers.has(worker)) {
          this.busyWorkers["delete"](worker);
          worker.terminate();
        } else {
          worker.postMessage(new Message(Action.CLOSE));
        }

        worker.removeEventListener("message", this);
        worker.removeEventListener("error", this);

        if (index >= 0) {
          this.workers.splice(index, 1);
        }
      }
    }, {
      key: "createWorker",
      value: function createWorker() {
        var worker = new Worker(this.workerURL);
        this.workers.push(worker);
        worker.addEventListener("message", this);
        worker.addEventListener("error", this);
        worker.postMessage(this.configurationMessage);
        return worker;
      }
    }, {
      key: "getWorker",
      value: function getWorker() {
        var worker = null;
        var i, l;

        for (i = 0, l = this.workers.length; i < l; ++i) {
          if (!this.busyWorkers.has(this.workers[i])) {
            worker = this.workers[i];
            this.busyWorkers.add(worker);
            break;
          }
        }

        if (worker === null && this.workers.length < this.maxWorkers) {
          if (this.workerURL !== null) {
            worker = this.createWorker();
            this.busyWorkers.add(worker);
          }
        }

        return worker;
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
    _inherits(TerrainEvent, _Event);

    function TerrainEvent(type) {
      var _this;

      _classCallCheck(this, TerrainEvent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TerrainEvent).call(this, type));
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
  var error = new TerrainEvent("error");

  var Terrain = function (_EventTarget) {
    _inherits(Terrain, _EventTarget);

    function Terrain() {
      var _this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Terrain);

      var worldSettings = options.world !== undefined ? options.world : {};
      HermiteData.resolution = options.resolution !== undefined ? options.resolution : 32;
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Terrain).call(this));
      _this.object = null;
      _this.world = new WorldOctree(worldSettings.cellSize, worldSettings.levels, worldSettings.keyDesign);
      _this.clipmap = new Clipmap(_this.world);

      _this.clipmap.addEventListener("shellupdate", _assertThisInitialized(_this));

      _this.threadPool = new ThreadPool(options.workers);

      _this.threadPool.addEventListener("message", _assertThisInitialized(_this));

      _this.tasks = new WeakMap();
      _this.sdfLoader = new SDFLoader();

      _this.sdfLoader.addEventListener("load", _assertThisInitialized(_this));

      _this.history = [];
      _this.dtSq = _this.world.getCellSize();
      return _this;
    }

    _createClass(Terrain, [{
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
        var i, l;

        for (i = 0, l = descriptions.length; i < l; ++i) {
          this.applyCSG(SDFReviver.revive(descriptions[i]));
        }
      }
    }, {
      key: "save",
      value: function save() {
        return this.history.length === 0 ? null : URL.createObjectURL(new Blob([JSON.stringify(this.history)], {
          type: "text/json"
        }));
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
      _classCallCheck(this, Isosurface);

      this.indices = indices;
      this.positions = positions;
      this.normals = normals;
      this.uvs = uvs;
      this.materials = materials;
    }

    _createClass(Isosurface, [{
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
    var c1, c2, m1, m2;
    var octant, edge;
    var i;

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
    var edgeOctants;
    var octant;
    var i, j;

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
    var faceOctants, edgeOctants;
    var order, octant;
    var i, j;

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
    var faceOctants, edgeOctants;
    var i;

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
    var i, voxel;

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
      _classCallCheck(this, DualContouring);
    }

    _createClass(DualContouring, null, [{
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
      _classCallCheck(this, Givens);
    }

    _createClass(Givens, null, [{
      key: "calculateCoefficients",
      value: function calculateCoefficients(aPP, aPQ, aQQ) {
        var tau, stt, tan;

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
      _classCallCheck(this, Schur);
    }

    _createClass(Schur, null, [{
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
  var b$8 = new Vector3();

  function rotate01(vtav, v) {
    var se = vtav.elements;
    var ve = v.elements;
    var coefficients;

    if (se[1] !== 0.0) {
      coefficients = Givens.calculateCoefficients(se[0], se[1], se[3]);
      Schur.rotateQXY(a$3.set(se[0], se[3]), se[1], coefficients);
      se[0] = a$3.x;
      se[3] = a$3.y;
      Schur.rotateXY(a$3.set(se[2], se[4]), coefficients);
      se[2] = a$3.x;
      se[4] = a$3.y;
      se[1] = 0.0;
      Schur.rotateXY(a$3.set(ve[0], ve[3]), coefficients);
      ve[0] = a$3.x;
      ve[3] = a$3.y;
      Schur.rotateXY(a$3.set(ve[1], ve[4]), coefficients);
      ve[1] = a$3.x;
      ve[4] = a$3.y;
      Schur.rotateXY(a$3.set(ve[2], ve[5]), coefficients);
      ve[2] = a$3.x;
      ve[5] = a$3.y;
    }
  }

  function rotate02(vtav, v) {
    var se = vtav.elements;
    var ve = v.elements;
    var coefficients;

    if (se[2] !== 0.0) {
      coefficients = Givens.calculateCoefficients(se[0], se[2], se[5]);
      Schur.rotateQXY(a$3.set(se[0], se[5]), se[2], coefficients);
      se[0] = a$3.x;
      se[5] = a$3.y;
      Schur.rotateXY(a$3.set(se[1], se[4]), coefficients);
      se[1] = a$3.x;
      se[4] = a$3.y;
      se[2] = 0.0;
      Schur.rotateXY(a$3.set(ve[0], ve[6]), coefficients);
      ve[0] = a$3.x;
      ve[6] = a$3.y;
      Schur.rotateXY(a$3.set(ve[1], ve[7]), coefficients);
      ve[1] = a$3.x;
      ve[7] = a$3.y;
      Schur.rotateXY(a$3.set(ve[2], ve[8]), coefficients);
      ve[2] = a$3.x;
      ve[8] = a$3.y;
    }
  }

  function rotate12(vtav, v) {
    var se = vtav.elements;
    var ve = v.elements;
    var coefficients;

    if (se[4] !== 0.0) {
      coefficients = Givens.calculateCoefficients(se[3], se[4], se[5]);
      Schur.rotateQXY(a$3.set(se[3], se[5]), se[4], coefficients);
      se[3] = a$3.x;
      se[5] = a$3.y;
      Schur.rotateXY(a$3.set(se[1], se[2]), coefficients);
      se[1] = a$3.x;
      se[2] = a$3.y;
      se[4] = 0.0;
      Schur.rotateXY(a$3.set(ve[3], ve[6]), coefficients);
      ve[3] = a$3.x;
      ve[6] = a$3.y;
      Schur.rotateXY(a$3.set(ve[4], ve[7]), coefficients);
      ve[4] = a$3.x;
      ve[7] = a$3.y;
      Schur.rotateXY(a$3.set(ve[5], ve[8]), coefficients);
      ve[5] = a$3.x;
      ve[8] = a$3.y;
    }
  }

  function solveSymmetric(vtav, v) {
    var e = vtav.elements;
    var i;

    for (i = 0; i < SVD_SWEEPS; ++i) {
      rotate01(vtav, v);
      rotate02(vtav, v);
      rotate12(vtav, v);
    }

    return b$8.set(e[0], e[3], e[5]);
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
      _classCallCheck(this, SingularValueDecomposition);
    }

    _createClass(SingularValueDecomposition, null, [{
      key: "solve",
      value: function solve(ata, atb, x) {
        var sigma = solveSymmetric(sm.copy(ata), m$3.identity());
        var invV = pseudoInverse(m$3, sigma);
        x.copy(atb).applyMatrix3(invV);
      }
    }]);

    return SingularValueDecomposition;
  }();

  var p$2 = new Vector3();

  function calculateError(ata, atb, x) {
    ata.applyToVector3(p$2.copy(x));
    p$2.subVectors(atb, p$2);
    return p$2.dot(p$2);
  }

  var QEFSolver = function () {
    function QEFSolver() {
      _classCallCheck(this, QEFSolver);

      this.data = null;
      this.ata = new SymmetricMatrix3();
      this.atb = new Vector3();
      this.massPoint = new Vector3();
      this.hasSolution = false;
    }

    _createClass(QEFSolver, [{
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
          p$2.copy(data.massPointSum).divideScalar(data.numPoints);
          massPoint.copy(p$2);
          ata.applyToVector3(p$2);
          atb.sub(p$2);
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
      _classCallCheck(this, QEFData);

      this.ata = new SymmetricMatrix3();
      this.ata.set(0, 0, 0, 0, 0, 0);
      this.atb = new Vector3();
      this.massPointSum = new Vector3();
      this.numPoints = 0;
    }

    _createClass(QEFData, [{
      key: "set",
      value: function set(ata, atb, massPointSum, numPoints) {
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
        ata[1] += nx * ny;
        ata[3] += ny * ny;
        ata[2] += nx * nz;
        ata[4] += ny * nz;
        ata[5] += nz * nz;
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
    _classCallCheck(this, Voxel);

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
    _inherits(VoxelCell, _CubicOctant);

    function VoxelCell(min, size) {
      var _this;

      _classCallCheck(this, VoxelCell);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(VoxelCell).call(this, min, size));
      _this.voxel = null;
      return _this;
    }

    _createClass(VoxelCell, [{
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
        var child, sign, voxel;
        var qefData, error;
        var v, i;

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
      get: function get() {
        return errorThreshold;
      },
      set: function set(value) {
        errorThreshold = value;
      }
    }]);

    return VoxelCell;
  }(CubicOctant);

  function getCell(cell, n, x, y, z) {
    var i = 0;

    for (n = n >> 1; n > 0; n >>= 1, i = 0) {
      if (x >= n) {
        i += 4;
        x -= n;
      }

      if (y >= n) {
        i += 2;
        y -= n;
      }

      if (z >= n) {
        i += 1;
        z -= n;
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
    var materials, edgeCount;
    var material, offset, index;
    var c1, c2, m1, m2;
    var i;

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
    _inherits(SparseVoxelOctree, _Octree);

    function SparseVoxelOctree(data) {
      var _this;

      var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
      var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      _classCallCheck(this, SparseVoxelOctree);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SparseVoxelOctree).call(this));
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

    _createClass(SparseVoxelOctree, [{
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
        var edges, edge;
        var sequence, offset;
        var cell, voxel;
        var x, y, z;
        var d, i;

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
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
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
    var x, y, z;

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
    var materialIndex;
    var materials = 0;
    var x, y, z;

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
    var edges1, zeroCrossings1, normals1;
    var edges0, zeroCrossings0, normals0;
    var edges, zeroCrossings, normals;
    var indexOffset;
    var indexA1, indexB1;
    var indexA0, indexB0;
    var m1, m2;
    var edge;
    var c, d, i, j, il, jl;

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

    return {
      edgeData: edgeData,
      lengths: lengths
    };
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
    var edges, zeroCrossings, normals, indexOffset;
    var indexA, indexB;
    var minX, minY, minZ;
    var maxX, maxY, maxZ;
    var c, d, a, axis;
    var x, y, z;

    for (a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {
      axis = pattern[a];
      edges = edgeData.indices[d];
      zeroCrossings = edgeData.zeroCrossings[d];
      normals = edgeData.normals[d];
      indexOffset = indexOffsets[d];
      minX = bounds.min.x;
      maxX = bounds.max.x;
      minY = bounds.min.y;
      maxY = bounds.max.y;
      minZ = bounds.min.z;
      maxZ = bounds.max.z;

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

    return {
      edgeData: edgeData,
      lengths: lengths
    };
  }

  function update(operation, data0, data1) {
    var bounds = computeIndexBounds(operation);
    var result, edgeData, lengths, d;
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
    var result, data;
    var i, l;

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
      _classCallCheck(this, ConstructiveSolidGeometry);
    }

    _createClass(ConstructiveSolidGeometry, null, [{
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

        return data !== null && data.empty ? null : data;
      }
    }]);

    return ConstructiveSolidGeometry;
  }();

  var data = new HermiteData(false);
  var DataProcessor = function () {
    function DataProcessor() {
      _classCallCheck(this, DataProcessor);

      this.data = null;
      this.response = null;
    }

    _createClass(DataProcessor, [{
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
    _inherits(SurfaceExtractor, _DataProcessor);

    function SurfaceExtractor() {
      var _this;

      _classCallCheck(this, SurfaceExtractor);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SurfaceExtractor).call(this));
      _this.response = new ExtractionResponse();
      _this.decompressionTarget = new HermiteData(false);
      _this.isosurface = null;
      return _this;
    }

    _createClass(SurfaceExtractor, [{
      key: "respond",
      value: function respond() {
        var response = _get(_getPrototypeOf(SurfaceExtractor.prototype), "respond", this).call(this);

        response.isosurface = this.isosurface !== null ? this.isosurface.serialise() : null;
        return response;
      }
    }, {
      key: "createTransferList",
      value: function createTransferList() {
        var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _get(_getPrototypeOf(SurfaceExtractor.prototype), "createTransferList", this).call(this, transferList);

        return this.isosurface !== null ? this.isosurface.createTransferList(transferList) : transferList;
      }
    }, {
      key: "process",
      value: function process(request) {
        var data = _get(_getPrototypeOf(SurfaceExtractor.prototype), "process", this).call(this, request).getData();

        var svo = new SparseVoxelOctree(data.decompress(this.decompressionTarget));
        this.isosurface = DualContouring.run(svo);
        this.decompressionTarget.clear();
        return this;
      }
    }]);

    return SurfaceExtractor;
  }(DataProcessor);

  var VolumeModifier = function (_DataProcessor) {
    _inherits(VolumeModifier, _DataProcessor);

    function VolumeModifier() {
      var _this;

      _classCallCheck(this, VolumeModifier);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(VolumeModifier).call(this));
      _this.response = new ModificationResponse();
      _this.sdf = null;
      return _this;
    }

    _createClass(VolumeModifier, [{
      key: "respond",
      value: function respond() {
        var response = _get(_getPrototypeOf(VolumeModifier.prototype), "respond", this).call(this);

        response.sdf = this.sdf !== null ? this.sdf.serialize() : null;
        return response;
      }
    }, {
      key: "createTransferList",
      value: function createTransferList() {
        var transferList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _get(_getPrototypeOf(VolumeModifier.prototype), "createTransferList", this).call(this, transferList);

        return this.sdf !== null ? this.sdf.createTransferList(transferList) : transferList;
      }
    }, {
      key: "process",
      value: function process(request) {
        var data = _get(_getPrototypeOf(VolumeModifier.prototype), "process", this).call(this, request).getData();

        var sdf = this.sdf = SDFReviver.revive(request.sdf);
        var result = ConstructiveSolidGeometry.run(request.cellPosition, request.cellSize, data, sdf);

        _set(_getPrototypeOf(VolumeModifier.prototype), "data", result !== null ? result.compress() : null, this, true);

        return this;
      }
    }]);

    return VolumeModifier;
  }(DataProcessor);

  exports.Action = Action;
  exports.BinaryUtils = BinaryUtils;
  exports.Clipmap = Clipmap;
  exports.ConfigurationMessage = ConfigurationMessage;
  exports.ConstructiveSolidGeometry = ConstructiveSolidGeometry;
  exports.DataMessage = DataMessage;
  exports.DataProcessor = DataProcessor;
  exports.Deserializable = Deserializable;
  exports.Difference = Difference;
  exports.Disposable = Disposable;
  exports.DualContouring = DualContouring;
  exports.Edge = Edge;
  exports.EdgeData = EdgeData;
  exports.EdgeIterator = EdgeIterator;
  exports.ExtractionRequest = ExtractionRequest;
  exports.ExtractionResponse = ExtractionResponse;
  exports.FractalNoise = FractalNoise;
  exports.Givens = Givens;
  exports.Heightfield = Heightfield;
  exports.HermiteData = HermiteData;
  exports.IntermediateWorldOctant = IntermediateWorldOctant;
  exports.Intersection = Intersection;
  exports.Isosurface = Isosurface;
  exports.KeyDesign = KeyDesign;
  exports.KeyIterator = KeyIterator;
  exports.Material = Material;
  exports.Message = Message;
  exports.ModificationRequest = ModificationRequest;
  exports.ModificationResponse = ModificationResponse;
  exports.OperationType = OperationType;
  exports.QEFData = QEFData;
  exports.QEFSolver = QEFSolver;
  exports.Queue = Queue;
  exports.RunLengthEncoding = RunLengthEncoding;
  exports.SDFLoader = SDFLoader;
  exports.SDFLoaderEvent = SDFLoaderEvent;
  exports.SDFType = SDFType;
  exports.Scene = Scene;
  exports.Schur = Schur;
  exports.Serializable = Serializable;
  exports.SignedDistanceFunction = SignedDistanceFunction;
  exports.SingularValueDecomposition = SingularValueDecomposition;
  exports.SparseVoxelOctree = SparseVoxelOctree;
  exports.SuperPrimitive = SuperPrimitive;
  exports.SuperPrimitivePreset = SuperPrimitivePreset;
  exports.SurfaceExtractor = SurfaceExtractor;
  exports.Terrain = Terrain;
  exports.TerrainEvent = TerrainEvent;
  exports.ThreadPool = ThreadPool;
  exports.TransferableContainer = TransferableContainer;
  exports.Union = Union;
  exports.VolumeModifier = VolumeModifier;
  exports.Voxel = Voxel;
  exports.VoxelCell = VoxelCell;
  exports.WorkerEvent = WorkerEvent;
  exports.WorldOctant = WorldOctant;
  exports.WorldOctantId = WorldOctantId;
  exports.WorldOctantIterator = WorldOctantIterator;
  exports.WorldOctantWrapper = WorldOctantWrapper;
  exports.WorldOctree = WorldOctree;
  exports.WorldOctreeCSG = WorldOctreeCSG;
  exports.WorldOctreeRaycaster = WorldOctreeRaycaster;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
