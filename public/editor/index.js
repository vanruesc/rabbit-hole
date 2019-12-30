(function (three) {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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

  var Feature = function () {
    function Feature() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, Feature);

      this.name = name;
      this.root = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.self === self ? self : (typeof global === "undefined" ? "undefined" : _typeof(global)) === "object" && global.global === global ? global : this;
      this.supported = false;
    }

    _createClass(Feature, [{
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
    _inherits(CanvasFeature, _Feature);

    function CanvasFeature() {
      var _this;

      _classCallCheck(this, CanvasFeature);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasFeature).call(this, "Canvas"));
      _this.supported = _this.root.CanvasRenderingContext2D !== undefined;
      return _this;
    }

    return CanvasFeature;
  }(Feature);

  var FileFeature = function (_Feature) {
    _inherits(FileFeature, _Feature);

    function FileFeature() {
      var _this;

      _classCallCheck(this, FileFeature);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FileFeature).call(this, "File"));
      _this.supported = _this.root.File !== undefined && _this.root.FileReader !== undefined && _this.root.FileList !== undefined && _this.root.Blob !== undefined;
      return _this;
    }

    return FileFeature;
  }(Feature);

  var TypedArrayFeature = function (_Feature) {
    _inherits(TypedArrayFeature, _Feature);

    function TypedArrayFeature() {
      var _this;

      _classCallCheck(this, TypedArrayFeature);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TypedArrayFeature).call(this, "Typed Array"));
      _this.supported = _this.root.ArrayBuffer !== undefined;
      return _this;
    }

    return TypedArrayFeature;
  }(Feature);

  var WebGLFeature = function (_Feature) {
    _inherits(WebGLFeature, _Feature);

    function WebGLFeature() {
      var _this;

      _classCallCheck(this, WebGLFeature);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WebGLFeature).call(this, "WebGL"));

      _this.supported = function (root) {
        var supported = root.WebGLRenderingContext !== undefined;
        var canvas, context;

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
    _inherits(WorkerFeature, _Feature);

    function WorkerFeature() {
      var _this;

      _classCallCheck(this, WorkerFeature);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WorkerFeature).call(this, "Web Worker"));
      _this.supported = _this.root.Worker !== undefined;
      return _this;
    }

    return WorkerFeature;
  }(Feature);

  var Detector = function () {
    function Detector() {
      _classCallCheck(this, Detector);

      this.features = new Map();
      this.features.set(FeatureId.CANVAS, new CanvasFeature());
      this.features.set(FeatureId.FILE, new FileFeature());
      this.features.set(FeatureId.TYPED_ARRAY, new TypedArrayFeature());
      this.features.set(FeatureId.WEBGL, new WebGLFeature());
      this.features.set(FeatureId.WORKER, new WorkerFeature());
    }

    _createClass(Detector, [{
      key: "getFeatures",
      value: function getFeatures(missing, featureIds) {
        var features = [];
        var featureId, feature;

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
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
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

        return features.length > 0 ? features : null;
      }
    }, {
      key: "getMissingFeatures",
      value: function getMissingFeatures() {
        for (var _len = arguments.length, featureIds = new Array(_len), _key = 0; _key < _len; _key++) {
          featureIds[_key] = arguments[_key];
        }

        return this.getFeatures(true, featureIds);
      }
    }, {
      key: "getSupportedFeatures",
      value: function getSupportedFeatures() {
        for (var _len2 = arguments.length, featureIds = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          featureIds[_key2] = arguments[_key2];
        }

        return this.getFeatures(false, featureIds);
      }
    }, {
      key: "get",
      value: function get(featureId) {
        return this.features.get(featureId);
      }
    }, {
      key: "set",
      value: function set(featureId, feature) {
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

  var edges = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];
  var layout = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var OctreeHelper = function (_Group) {
    _inherits(OctreeHelper, _Group);

    function OctreeHelper() {
      var _this;

      var octree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, OctreeHelper);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(OctreeHelper).call(this));
      _this.name = "OctreeHelper";
      _this.octree = octree;

      _this.update();

      return _this;
    }

    _createClass(OctreeHelper, [{
      key: "createLineSegments",
      value: function createLineSegments(octants, octantCount) {
        var maxOctants = Math.pow(2, 16) / 8 - 1;
        var group = new three.Group();
        var material = new three.LineBasicMaterial({
          color: 0xffffff * Math.random()
        });
        var result;
        var vertexCount;
        var length;
        var indices, positions;
        var octant, min, max;
        var geometry;
        var i, j, c, d, n;
        var corner, edge;

        for (i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {
          length += octantCount < maxOctants ? octantCount : maxOctants;
          octantCount -= maxOctants;
          vertexCount = length * 8;
          indices = new Uint16Array(vertexCount * 3);
          positions = new Float32Array(vertexCount * 3);

          for (c = 0, d = 0, result = octants.next(); !result.done && i < length;) {
            octant = result.value;
            min = octant.min;
            max = octant.max;

            for (j = 0; j < 12; ++j) {
              edge = edges[j];
              indices[d++] = c + edge[0];
              indices[d++] = c + edge[1];
            }

            for (j = 0; j < 8; ++j, ++c) {
              corner = layout[j];
              positions[c * 3] = corner[0] === 0 ? min.x : max.x;
              positions[c * 3 + 1] = corner[1] === 0 ? min.y : max.y;
              positions[c * 3 + 2] = corner[2] === 0 ? min.z : max.z;
            }

            if (++i < length) {
              result = octants.next();
            }
          }

          geometry = new three.BufferGeometry();
          geometry.setIndex(new three.BufferAttribute(indices, 1));
          geometry.setAttribute("position", new three.BufferAttribute(positions, 3));
          group.add(new three.LineSegments(geometry, material));
        }

        this.add(group);
      }
    }, {
      key: "update",
      value: function update() {
        var depth = this.octree !== null ? this.octree.getDepth() : -1;
        var level = 0;
        var result;
        this.dispose();

        while (level <= depth) {
          result = this.octree.findNodesByLevel(level);
          this.createLineSegments(result[Symbol.iterator](), typeof result.size === "number" ? result.size : result.length);
          ++level;
        }
      }
    }, {
      key: "dispose",
      value: function dispose() {
        var groups = this.children;
        var group, children;
        var i, j, il, jl;

        for (i = 0, il = groups.length; i < il; ++i) {
          group = groups[i];
          children = group.children;

          for (j = 0, jl = children.length; j < jl; ++j) {
            children[j].geometry.dispose();
            children[j].material.dispose();
          }

          while (children.length > 0) {
            group.remove(children[0]);
          }
        }

        while (groups.length > 0) {
          this.remove(groups[0]);
        }
      }
    }]);

    return OctreeHelper;
  }(three.Group);

  var Action = {
    MOVE_FORWARD: 0,
    MOVE_LEFT: 1,
    MOVE_BACKWARD: 2,
    MOVE_RIGHT: 3,
    MOVE_DOWN: 4,
    MOVE_UP: 5,
    ZOOM_OUT: 6,
    ZOOM_IN: 7
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

  var PointerButton = {
    MAIN: 0,
    AUXILIARY: 1,
    SECONDARY: 2
  };

  var TWO_PI = Math.PI * 2;
  var v$5 = new Vector3();
  var m$1 = new Matrix4();
  var RotationManager = function () {
    function RotationManager(position, quaternion, target, settings) {
      _classCallCheck(this, RotationManager);

      this.position = position;
      this.quaternion = quaternion;
      this.target = target;
      this.settings = settings;
      this.spherical = new Spherical();
    }

    _createClass(RotationManager, [{
      key: "setPosition",
      value: function setPosition(position) {
        this.position = position;
        return this;
      }
    }, {
      key: "setQuaternion",
      value: function setQuaternion(quaternion) {
        this.quaternion = quaternion;
        return this;
      }
    }, {
      key: "setTarget",
      value: function setTarget(target) {
        this.target = target;
        return this;
      }
    }, {
      key: "updateQuaternion",
      value: function updateQuaternion() {
        var settings = this.settings;
        var rotation = settings.rotation;

        if (settings.general.orbit) {
          m$1.lookAt(v$5.subVectors(this.position, this.target), rotation.pivotOffset, rotation.up);
        } else {
          m$1.lookAt(v$5.set(0, 0, 0), this.target.setFromSpherical(this.spherical), rotation.up);
        }

        this.quaternion.setFromRotationMatrix(m$1);
        return this;
      }
    }, {
      key: "adjustSpherical",
      value: function adjustSpherical(theta, phi) {
        var settings = this.settings;
        var orbit = settings.general.orbit;
        var rotation = settings.rotation;
        var s = this.spherical;
        s.theta = !rotation.invertX ? s.theta - theta : s.theta + theta;
        s.phi = (orbit || rotation.invertY) && !(orbit && rotation.invertY) ? s.phi - phi : s.phi + phi;
        s.theta = Math.min(Math.max(s.theta, rotation.minAzimuthalAngle), rotation.maxAzimuthalAngle);
        s.phi = Math.min(Math.max(s.phi, rotation.minPolarAngle), rotation.maxPolarAngle);
        s.theta %= TWO_PI;
        s.makeSafe();

        if (orbit) {
          this.position.setFromSpherical(s).add(this.target);
        }

        return this;
      }
    }, {
      key: "zoom",
      value: function zoom(sign) {
        var settings = this.settings;
        var general = settings.general;
        var sensitivity = settings.sensitivity;
        var zoom = settings.zoom;
        var s = this.spherical;
        var amount, min, max;

        if (general.orbit && zoom.enabled) {
          amount = sign * sensitivity.zoom;

          if (zoom.invert) {
            amount = -amount;
          }

          min = Math.max(zoom.minDistance, 1e-6);
          max = Math.min(zoom.maxDistance, Infinity);
          s.radius = Math.min(Math.max(s.radius + amount, min), max);
          this.position.setFromSpherical(s).add(this.target);
        }

        return this;
      }
    }, {
      key: "update",
      value: function update(delta) {}
    }, {
      key: "lookAt",
      value: function lookAt(point) {
        var spherical = this.spherical;
        var position = this.position;
        var target = this.target;
        target.copy(point);

        if (this.settings.general.orbit) {
          v$5.subVectors(position, target);
        } else {
          v$5.subVectors(target, position).normalize();
        }

        spherical.setFromVector3(v$5);
        spherical.radius = Math.max(spherical.radius, 1e-6);
        this.updateQuaternion();
        return this;
      }
    }, {
      key: "getViewDirection",
      value: function getViewDirection() {
        var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
        view.setFromSpherical(this.spherical).normalize();

        if (this.settings.general.orbit) {
          view.negate();
        }

        return view;
      }
    }]);

    return RotationManager;
  }();

  var MovementState = function () {
    function MovementState() {
      _classCallCheck(this, MovementState);

      this.left = false;
      this.right = false;
      this.forward = false;
      this.backward = false;
      this.up = false;
      this.down = false;
    }

    _createClass(MovementState, [{
      key: "reset",
      value: function reset() {
        this.left = false;
        this.right = false;
        this.forward = false;
        this.backward = false;
        this.up = false;
        this.down = false;
        return this;
      }
    }]);

    return MovementState;
  }();

  var x = new Vector3(1, 0, 0);
  var y = new Vector3(0, 1, 0);
  var z = new Vector3(0, 0, 1);

  var v$6 = new Vector3();
  var TranslationManager = function () {
    function TranslationManager(position, quaternion, target, settings) {
      _classCallCheck(this, TranslationManager);

      this.position = position;
      this.quaternion = quaternion;
      this.target = target;
      this.settings = settings;
      this.movementState = new MovementState();
    }

    _createClass(TranslationManager, [{
      key: "setPosition",
      value: function setPosition(position) {
        this.position = position;
        return this;
      }
    }, {
      key: "setQuaternion",
      value: function setQuaternion(quaternion) {
        this.quaternion = quaternion;
        return this;
      }
    }, {
      key: "setTarget",
      value: function setTarget(target) {
        this.target = target;
        return this;
      }
    }, {
      key: "translateOnAxis",
      value: function translateOnAxis(axis, distance) {
        v$6.copy(axis).applyQuaternion(this.quaternion).multiplyScalar(distance);
        this.position.add(v$6);

        if (this.settings.general.orbit) {
          this.target.add(v$6);
        }
      }
    }, {
      key: "translate",
      value: function translate(delta) {
        var sensitivity = this.settings.sensitivity;
        var state = this.movementState;
        var step = delta * sensitivity.translation;

        if (state.backward) {
          this.translateOnAxis(z, step);
        } else if (state.forward) {
          this.translateOnAxis(z, -step);
        }

        if (state.right) {
          this.translateOnAxis(x, step);
        } else if (state.left) {
          this.translateOnAxis(x, -step);
        }

        if (state.up) {
          this.translateOnAxis(y, step);
        } else if (state.down) {
          this.translateOnAxis(y, -step);
        }
      }
    }, {
      key: "update",
      value: function update(delta) {
        if (this.settings.translation.enabled) {
          this.translate(delta);
        }
      }
    }, {
      key: "moveTo",
      value: function moveTo(position) {
        if (this.settings.general.orbit) {
          this.target.copy(position);
        } else {
          this.position.copy(position);
        }

        return this;
      }
    }]);

    return TranslationManager;
  }();

  var KeyCodeHandler = {
    get: function get(target, name) {
      return name in target ? target[name] : name.length === 1 ? name.toUpperCase().charCodeAt(0) : undefined;
    }
  };
  var KeyCode = new Proxy({
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DELETE: 46,
    META_LEFT: 91,
    META_RIGHT: 92,
    SELECT: 93,
    NUMPAD_0: 96,
    NUMPAD_1: 97,
    NUMPAD_2: 98,
    NUMPAD_3: 99,
    NUMPAD_4: 100,
    NUMPAD_5: 101,
    NUMPAD_6: 102,
    NUMPAD_7: 103,
    NUMPAD_8: 104,
    NUMPAD_9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMAL_POINT: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    SEMICOLON: 186,
    EQUAL_SIGN: 187,
    COMMA: 188,
    DASH: 189,
    PERIOD: 190,
    FORWARD_SLASH: 191,
    GRAVE_ACCENT: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    SINGLE_QUOTE: 222
  }, KeyCodeHandler);

  var GeneralSettings = function () {
    function GeneralSettings() {
      _classCallCheck(this, GeneralSettings);

      this.orbit = true;
    }

    _createClass(GeneralSettings, [{
      key: "copy",
      value: function copy(settings) {
        this.orbit = settings.orbit;
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }]);

    return GeneralSettings;
  }();

  var KeyBindings = function () {
    function KeyBindings() {
      _classCallCheck(this, KeyBindings);

      this.defaultActions = new Map();
      this.actions = new Map();
    }

    _createClass(KeyBindings, [{
      key: "reset",
      value: function reset() {
        this.actions = new Map(this.defaultActions);
        return this;
      }
    }, {
      key: "setDefault",
      value: function setDefault(actions) {
        this.defaultActions = actions;
        return this.reset();
      }
    }, {
      key: "copy",
      value: function copy(keyBindings) {
        this.defaultActions = new Map(keyBindings.defaultActions);
        this.actions = new Map(keyBindings.actions);
        return this;
      }
    }, {
      key: "clearDefault",
      value: function clearDefault() {
        this.defaultActions.clear();
        return this;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.actions.clear();
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }, {
      key: "has",
      value: function has(keyCode) {
        return this.actions.has(keyCode);
      }
    }, {
      key: "get",
      value: function get(keyCode) {
        return this.actions.get(keyCode);
      }
    }, {
      key: "set",
      value: function set(keyCode, action) {
        this.actions.set(keyCode, action);
        return this;
      }
    }, {
      key: "delete",
      value: function _delete(keyCode) {
        return this.actions["delete"](keyCode);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          defaultActions: _toConsumableArray(this.defaultActions),
          actions: _toConsumableArray(this.actions)
        };
      }
    }]);

    return KeyBindings;
  }();

  var PointerSettings = function () {
    function PointerSettings() {
      _classCallCheck(this, PointerSettings);

      this.hold = false;
      this.lock = true;
    }

    _createClass(PointerSettings, [{
      key: "copy",
      value: function copy(settings) {
        this.hold = settings.hold;
        this.lock = settings.lock;
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }]);

    return PointerSettings;
  }();

  var RotationSettings = function () {
    function RotationSettings() {
      _classCallCheck(this, RotationSettings);

      this.up = new Vector3();
      this.up.copy(y);
      this.pivotOffset = new Vector3();
      this.minAzimuthalAngle = -Infinity;
      this.maxAzimuthalAngle = Infinity;
      this.minPolarAngle = 0.0;
      this.maxPolarAngle = Math.PI;
      this.invertX = false;
      this.invertY = false;
    }

    _createClass(RotationSettings, [{
      key: "copy",
      value: function copy(settings) {
        this.up.copy(settings.up);
        this.pivotOffset.copy(settings.pivotOffset);
        this.minAzimuthalAngle = settings.minAzimuthalAngle !== null ? settings.minAzimuthalAngle : -Infinity;
        this.maxAzimuthalAngle = settings.maxAzimuthalAngle !== null ? settings.maxAzimuthalAngle : Infinity;
        this.minPolarAngle = settings.minPolarAngle;
        this.maxPolarAngle = settings.maxPolarAngle;
        this.invertX = settings.invertX;
        this.invertY = settings.invertY;
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }]);

    return RotationSettings;
  }();

  var SensitivitySettings = function () {
    function SensitivitySettings() {
      _classCallCheck(this, SensitivitySettings);

      this.rotation = 0.0025;
      this.translation = 1.0;
      this.zoom = 0.1;
    }

    _createClass(SensitivitySettings, [{
      key: "copy",
      value: function copy(settings) {
        this.rotation = settings.rotation;
        this.translation = settings.translation;
        this.zoom = settings.zoom;
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }]);

    return SensitivitySettings;
  }();

  var TranslationSettings = function () {
    function TranslationSettings() {
      _classCallCheck(this, TranslationSettings);

      this.enabled = true;
    }

    _createClass(TranslationSettings, [{
      key: "copy",
      value: function copy(settings) {
        this.enabled = settings.enabled;
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }]);

    return TranslationSettings;
  }();

  var ZoomSettings = function () {
    function ZoomSettings() {
      _classCallCheck(this, ZoomSettings);

      this.enabled = true;
      this.invert = false;
      this.minDistance = 1e-6;
      this.maxDistance = Infinity;
    }

    _createClass(ZoomSettings, [{
      key: "copy",
      value: function copy(settings) {
        this.enabled = settings.enabled;
        this.invert = settings.invert;
        this.minDistance = settings.minDistance;
        this.maxDistance = settings.maxDistance;
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }]);

    return ZoomSettings;
  }();

  var Settings = function () {
    function Settings() {
      _classCallCheck(this, Settings);

      this.general = new GeneralSettings();
      this.keyBindings = new KeyBindings();
      this.keyBindings.setDefault(new Map([[KeyCode.W, Action.MOVE_FORWARD], [KeyCode.UP, Action.MOVE_FORWARD], [KeyCode.A, Action.MOVE_LEFT], [KeyCode.LEFT, Action.MOVE_LEFT], [KeyCode.S, Action.MOVE_BACKWARD], [KeyCode.DOWN, Action.MOVE_BACKWARD], [KeyCode.D, Action.MOVE_RIGHT], [KeyCode.RIGHT, Action.MOVE_RIGHT], [KeyCode.X, Action.MOVE_DOWN], [KeyCode.SPACE, Action.MOVE_UP], [KeyCode.PAGE_DOWN, Action.ZOOM_OUT], [KeyCode.PAGE_UP, Action.ZOOM_IN]]));
      this.pointer = new PointerSettings();
      this.rotation = new RotationSettings();
      this.sensitivity = new SensitivitySettings();
      this.translation = new TranslationSettings();
      this.zoom = new ZoomSettings();
    }

    _createClass(Settings, [{
      key: "copy",
      value: function copy(settings) {
        this.general.copy(settings.general);
        this.keyBindings.copy(settings.keyBindings);
        this.pointer.copy(settings.pointer);
        this.rotation.copy(settings.rotation);
        this.sensitivity.copy(settings.sensitivity);
        this.translation.copy(settings.translation);
        this.zoom.copy(settings.zoom);
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }, {
      key: "toDataURL",
      value: function toDataURL() {
        return URL.createObjectURL(new Blob([JSON.stringify(this)], {
          type: "text/json"
        }));
      }
    }]);

    return Settings;
  }();

  var Strategy = function () {
    function Strategy() {
      _classCallCheck(this, Strategy);
    }

    _createClass(Strategy, [{
      key: "execute",
      value: function execute(flag) {
        throw new Error("Strategy#execute method not implemented!");
      }
    }]);

    return Strategy;
  }();

  var MovementStrategy = function (_Strategy) {
    _inherits(MovementStrategy, _Strategy);

    function MovementStrategy(movementState, direction) {
      var _this;

      _classCallCheck(this, MovementStrategy);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MovementStrategy).call(this));
      _this.movementState = movementState;
      _this.direction = direction;
      return _this;
    }

    _createClass(MovementStrategy, [{
      key: "execute",
      value: function execute(flag) {
        var state = this.movementState;

        switch (this.direction) {
          case Direction.FORWARD:
            state.forward = flag;
            break;

          case Direction.LEFT:
            state.left = flag;
            break;

          case Direction.BACKWARD:
            state.backward = flag;
            break;

          case Direction.RIGHT:
            state.right = flag;
            break;

          case Direction.DOWN:
            state.down = flag;
            break;

          case Direction.UP:
            state.up = flag;
            break;
        }
      }
    }]);

    return MovementStrategy;
  }(Strategy);
  var Direction = {
    FORWARD: 0,
    LEFT: 1,
    BACKWARD: 2,
    RIGHT: 3,
    DOWN: 4,
    UP: 5
  };

  var ZoomStrategy = function (_Strategy) {
    _inherits(ZoomStrategy, _Strategy);

    function ZoomStrategy(rotationManager, zoomIn) {
      var _this;

      _classCallCheck(this, ZoomStrategy);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ZoomStrategy).call(this));
      _this.rotationManager = rotationManager;
      _this.zoomIn = zoomIn;
      return _this;
    }

    _createClass(ZoomStrategy, [{
      key: "execute",
      value: function execute(flag) {
        if (flag) {
          this.rotationManager.zoom(this.zoomIn ? -1 : 1);
        }
      }
    }]);

    return ZoomStrategy;
  }(Strategy);

  var DeltaControls = function () {
    function DeltaControls() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var quaternion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var dom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;

      _classCallCheck(this, DeltaControls);

      this.dom = dom;
      this.position = position;
      this.quaternion = quaternion;
      this.target = new Vector3();
      this.settings = new Settings();
      this.rotationManager = new RotationManager(position, quaternion, this.target, this.settings);
      this.translationManager = new TranslationManager(position, quaternion, this.target, this.settings);

      this.strategies = function (rotationManager, translationManager) {
        var state = translationManager.movementState;
        return new Map([[Action.MOVE_FORWARD, new MovementStrategy(state, Direction.FORWARD)], [Action.MOVE_LEFT, new MovementStrategy(state, Direction.LEFT)], [Action.MOVE_BACKWARD, new MovementStrategy(state, Direction.BACKWARD)], [Action.MOVE_RIGHT, new MovementStrategy(state, Direction.RIGHT)], [Action.MOVE_DOWN, new MovementStrategy(state, Direction.DOWN)], [Action.MOVE_UP, new MovementStrategy(state, Direction.UP)], [Action.ZOOM_OUT, new ZoomStrategy(rotationManager, false)], [Action.ZOOM_IN, new ZoomStrategy(rotationManager, true)]]);
      }(this.rotationManager, this.translationManager);

      this.lastScreenPosition = new Vector2();
      this.dragging = false;
      this.enabled = false;

      if (position !== null && quaternion !== null) {
        this.lookAt(this.target);

        if (dom !== null) {
          this.setEnabled();
        }
      }
    }

    _createClass(DeltaControls, [{
      key: "getDom",
      value: function getDom() {
        return this.dom;
      }
    }, {
      key: "getPosition",
      value: function getPosition() {
        return this.position;
      }
    }, {
      key: "getQuaternion",
      value: function getQuaternion() {
        return this.quaternion;
      }
    }, {
      key: "getTarget",
      value: function getTarget() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
        target.copy(this.target);

        if (!this.settings.general.orbit) {
          target.add(this.position);
        }

        return target;
      }
    }, {
      key: "getViewDirection",
      value: function getViewDirection() {
        var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
        return this.rotationManager.getViewDirection(view);
      }
    }, {
      key: "setDom",
      value: function setDom(dom) {
        var enabled = this.enabled;

        if (dom !== null) {
          if (enabled) {
            this.setEnabled(false);
          }

          this.dom = dom;
          this.setEnabled(enabled);
        }

        return this;
      }
    }, {
      key: "setPosition",
      value: function setPosition(position) {
        this.position = position;
        this.rotationManager.setPosition(position);
        this.translationManager.setPosition(position);
        return this.lookAt(this.target);
      }
    }, {
      key: "setQuaternion",
      value: function setQuaternion(quaternion) {
        this.quaternion = quaternion;
        this.rotationManager.setQuaternion(quaternion);
        this.translationManager.setQuaternion(quaternion);
        return this.lookAt(this.target);
      }
    }, {
      key: "setTarget",
      value: function setTarget(target) {
        this.target = target;
        this.rotationManager.setTarget(target);
        this.translationManager.setTarget(target);
        return this.lookAt(this.target);
      }
    }, {
      key: "setOrbitEnabled",
      value: function setOrbitEnabled(orbit) {
        var general = this.settings.general;

        if (general.orbit !== orbit) {
          this.getTarget(this.target);
          general.orbit = orbit;
          this.lookAt(this.target);
        }

        return this;
      }
    }, {
      key: "copy",
      value: function copy(controls) {
        this.dom = controls.getDom();
        this.position = controls.getPosition();
        this.quaternion = controls.getQuaternion();
        this.target = controls.getTarget();
        this.settings.copy(controls.settings);
        this.rotationManager.setPosition(this.position).setQuaternion(this.quaternion).setTarget(this.target);
        this.translationManager.setPosition(this.position).setQuaternion(this.quaternion).setTarget(this.target);
        return this.lookAt(this.target);
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }, {
      key: "handlePointerMoveEvent",
      value: function handlePointerMoveEvent(event) {
        var settings = this.settings;
        var pointer = settings.pointer;
        var sensitivity = settings.sensitivity;
        var rotationManager = this.rotationManager;
        var lastScreenPosition = this.lastScreenPosition;
        var movementX, movementY;

        if (document.pointerLockElement === this.dom) {
          if (!pointer.hold || this.dragging) {
            rotationManager.adjustSpherical(event.movementX * sensitivity.rotation, event.movementY * sensitivity.rotation).updateQuaternion();
          }
        } else {
          movementX = event.screenX - lastScreenPosition.x;
          movementY = event.screenY - lastScreenPosition.y;
          lastScreenPosition.set(event.screenX, event.screenY);
          rotationManager.adjustSpherical(movementX * sensitivity.rotation, movementY * sensitivity.rotation).updateQuaternion();
        }
      }
    }, {
      key: "handleTouchMoveEvent",
      value: function handleTouchMoveEvent(event) {
        var sensitivity = this.settings.sensitivity;
        var rotationManager = this.rotationManager;
        var lastScreenPosition = this.lastScreenPosition;
        var touch = event.touches[0];
        var movementX = touch.screenX - lastScreenPosition.x;
        var movementY = touch.screenY - lastScreenPosition.y;
        lastScreenPosition.set(touch.screenX, touch.screenY);
        event.preventDefault();
        rotationManager.adjustSpherical(movementX * sensitivity.rotation, movementY * sensitivity.rotation).updateQuaternion();
      }
    }, {
      key: "handleMainPointerButton",
      value: function handleMainPointerButton(event, pressed) {
        this.dragging = pressed;

        if (this.settings.pointer.lock) {
          this.setPointerLocked();
        } else {
          if (pressed) {
            this.lastScreenPosition.set(event.screenX, event.screenY);
            this.dom.addEventListener("mousemove", this);
          } else {
            this.dom.removeEventListener("mousemove", this);
          }
        }
      }
    }, {
      key: "handleAuxiliaryPointerButton",
      value: function handleAuxiliaryPointerButton(event, pressed) {}
    }, {
      key: "handleSecondaryPointerButton",
      value: function handleSecondaryPointerButton(event, pressed) {}
    }, {
      key: "handlePointerButtonEvent",
      value: function handlePointerButtonEvent(event, pressed) {
        event.preventDefault();

        switch (event.button) {
          case PointerButton.MAIN:
            this.handleMainPointerButton(event, pressed);
            break;

          case PointerButton.AUXILIARY:
            this.handleAuxiliaryPointerButton(event, pressed);
            break;

          case PointerButton.SECONDARY:
            this.handleSecondaryPointerButton(event, pressed);
            break;
        }
      }
    }, {
      key: "handleTouchEvent",
      value: function handleTouchEvent(event, start) {
        var touch = event.touches[0];
        event.preventDefault();

        if (start) {
          this.lastScreenPosition.set(touch.screenX, touch.screenY);
          this.dom.addEventListener("touchmove", this);
        } else {
          this.dom.removeEventListener("touchmove", this);
        }
      }
    }, {
      key: "handleKeyboardEvent",
      value: function handleKeyboardEvent(event, pressed) {
        var keyBindings = this.settings.keyBindings;

        if (keyBindings.has(event.keyCode)) {
          event.preventDefault();
          this.strategies.get(keyBindings.get(event.keyCode)).execute(pressed);
        }
      }
    }, {
      key: "handleWheelEvent",
      value: function handleWheelEvent(event) {
        this.rotationManager.zoom(Math.sign(event.deltaY));
      }
    }, {
      key: "handlePointerLockEvent",
      value: function handlePointerLockEvent() {
        if (document.pointerLockElement === this.dom) {
          this.dom.addEventListener("mousemove", this);
        } else {
          this.dom.removeEventListener("mousemove", this);
        }
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(event) {
        switch (event.type) {
          case "mousemove":
            this.handlePointerMoveEvent(event);
            break;

          case "touchmove":
            this.handleTouchMoveEvent(event);
            break;

          case "mousedown":
            this.handlePointerButtonEvent(event, true);
            break;

          case "mouseup":
            this.handlePointerButtonEvent(event, false);
            break;

          case "touchstart":
            this.handleTouchEvent(event, true);
            break;

          case "touchend":
            this.handleTouchEvent(event, false);
            break;

          case "keydown":
            this.handleKeyboardEvent(event, true);
            break;

          case "keyup":
            this.handleKeyboardEvent(event, false);
            break;

          case "wheel":
            this.handleWheelEvent(event);
            break;

          case "pointerlockchange":
            this.handlePointerLockEvent();
            break;
        }
      }
    }, {
      key: "update",
      value: function update(delta) {
        this.rotationManager.update(delta);
        this.translationManager.update(delta);
      }
    }, {
      key: "moveTo",
      value: function moveTo(position) {
        this.rotationManager.moveTo(position);
        return this;
      }
    }, {
      key: "lookAt",
      value: function lookAt(point) {
        this.rotationManager.lookAt(point);
        return this;
      }
    }, {
      key: "setPointerLocked",
      value: function setPointerLocked() {
        var locked = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (locked) {
          if (document.pointerLockElement !== this.dom && this.dom.requestPointerLock !== undefined) {
            this.dom.requestPointerLock();
          }
        } else if (document.exitPointerLock !== undefined) {
          document.exitPointerLock();
        }
      }
    }, {
      key: "setEnabled",
      value: function setEnabled() {
        var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var dom = this.dom;
        this.translationManager.movementState.reset();

        if (enabled && !this.enabled) {
          document.addEventListener("pointerlockchange", this);
          document.body.addEventListener("keyup", this);
          document.body.addEventListener("keydown", this);
          dom.addEventListener("mousedown", this);
          dom.addEventListener("mouseup", this);
          dom.addEventListener("touchstart", this);
          dom.addEventListener("touchend", this);
          dom.addEventListener("wheel", this);
        } else if (!enabled && this.enabled) {
          document.removeEventListener("pointerlockchange", this);
          document.body.removeEventListener("keyup", this);
          document.body.removeEventListener("keydown", this);
          dom.removeEventListener("mousedown", this);
          dom.removeEventListener("mouseup", this);
          dom.removeEventListener("touchstart", this);
          dom.removeEventListener("touchend", this);
          dom.removeEventListener("wheel", this);
          dom.removeEventListener("mousemove", this);
          dom.removeEventListener("touchmove", this);
        }

        this.setPointerLocked(false);
        this.enabled = enabled;
        return this;
      }
    }, {
      key: "dispose",
      value: function dispose() {
        this.setEnabled(false);
      }
    }]);

    return DeltaControls;
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

  var layout$1 = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];
  var c$1 = new Vector3();

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
      value: function getCenter(target) {
        return target.copy(this.min).addScalar(this.size * 0.5);
      }
    }, {
      key: "getDimensions",
      value: function getDimensions(target) {
        return target.set(this.size, this.size, this.size);
      }
    }, {
      key: "split",
      value: function split() {
        var min = this.min;
        var mid = this.getCenter(c$1);
        var halfSize = this.size * 0.5;
        var children = this.children = [null, null, null, null, null, null, null, null];
        var i, combination;

        for (i = 0; i < 8; ++i) {
          combination = layout$1[i];
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

  var c$1$1 = new Vector3();

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
      value: function getCenter(target) {
        return target.addVectors(this.min, this.max).multiplyScalar(0.5);
      }
    }, {
      key: "getDimensions",
      value: function getDimensions(target) {
        return target.subVectors(this.max, this.min);
      }
    }, {
      key: "split",
      value: function split() {
        var min = this.min;
        var max = this.max;
        var mid = this.getCenter(c$1$1);
        var children = this.children = [null, null, null, null, null, null, null, null];
        var i, combination;

        for (i = 0; i < 8; ++i) {
          combination = layout$1[i];
          children[i] = new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z));
        }
      }
    }]);

    return Octant;
  }();

  var RayPointIntersection = function RayPointIntersection(distance, distanceToRay, point) {
    var object = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, RayPointIntersection);

    this.distance = distance;
    this.distanceToRay = distanceToRay;
    this.point = point;
    this.object = object;
  };

  function testPoints(octants, raycaster, intersects) {
    var threshold = raycaster.params.Points.threshold;
    var thresholdSq = threshold * threshold;
    var intersectPoint;
    var distance, distanceToRay;
    var rayPointDistanceSq;
    var i, j, il, jl;
    var octant, points, point;

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

  var Flags = function Flags() {
    _classCallCheck(this, Flags);

    this.value = 0;
  };

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

  var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

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

  var v$7 = new Vector3();
  var b$3 = new Box3();
  var d = new Box3();
  var r = new Ray();

  function _intersectOctree(octree, ray, flags) {
    var min = b$3.min.set(0, 0, 0);
    var max = b$3.max.subVectors(octree.max, octree.min);
    var dimensions = octree.getDimensions(d.min);
    var halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);
    var origin = r.origin.copy(ray.origin);
    var direction = r.direction.copy(ray.direction);
    var invDirX, invDirY, invDirZ;
    var tx0, tx1, ty0, ty1, tz0, tz1;
    origin.sub(octree.getCenter(v$7)).add(halfDimensions);
    flags.value = 0;

    if (direction.x < 0.0) {
      origin.x = dimensions.x - origin.x;
      direction.x = -direction.x;
      flags.value |= 4;
    }

    if (direction.y < 0.0) {
      origin.y = dimensions.y - origin.y;
      direction.y = -direction.y;
      flags.value |= 2;
    }

    if (direction.z < 0.0) {
      origin.z = dimensions.z - origin.z;
      direction.z = -direction.z;
      flags.value |= 1;
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
    return Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1) ? [tx0, ty0, tz0, tx1, ty1, tz1] : null;
  }

  var flags = new Flags();

  function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {
    if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {
      var children = octant.children;

      if (children === null) {
        intersects.push(octant);
      } else {
        var txm = 0.5 * (tx0 + tx1);
        var tym = 0.5 * (ty0 + ty1);
        var tzm = 0.5 * (tz0 + tz1);
        var f = flags.value;
        var currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

        do {
          switch (currentOctant) {
            case 0:
              raycastOctant(children[f], tx0, ty0, tz0, txm, tym, tzm, intersects);
              currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
              break;

            case 1:
              raycastOctant(children[f ^ 1], tx0, ty0, tzm, txm, tym, tz1, intersects);
              currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
              break;

            case 2:
              raycastOctant(children[f ^ 2], tx0, tym, tz0, txm, ty1, tzm, intersects);
              currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
              break;

            case 3:
              raycastOctant(children[f ^ 3], tx0, tym, tzm, txm, ty1, tz1, intersects);
              currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
              break;

            case 4:
              raycastOctant(children[f ^ 4], txm, ty0, tz0, tx1, tym, tzm, intersects);
              currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
              break;

            case 5:
              raycastOctant(children[f ^ 5], txm, ty0, tzm, tx1, tym, tz1, intersects);
              currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
              break;

            case 6:
              raycastOctant(children[f ^ 6], txm, tym, tz0, tx1, ty1, tzm, intersects);
              currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
              break;

            case 7:
              raycastOctant(children[f ^ 7], txm, tym, tzm, tx1, ty1, tz1, intersects);
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
      value: function intersectOctree(octree, ray) {
        var intersects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var parameters = _intersectOctree(octree, ray, flags);

        if (parameters !== null) {
          raycastOctant.apply(void 0, [octree.root].concat(_toConsumableArray(parameters), [intersects]));
        }
      }
    }]);

    return OctreeRaycaster;
  }();

  var b$1$1 = new Box3();

  var OctreeIterator = function () {
    function OctreeIterator(octree) {
      var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, OctreeIterator);

      this.octree = octree;
      this.region = region;
      this.cull = region !== null;
      this.result = new IteratorResult();
      this.trace = null;
      this.indices = null;
      this.reset();
    }

    _createClass(OctreeIterator, [{
      key: "reset",
      value: function reset() {
        var root = this.octree.root;
        this.trace = [];
        this.indices = [];

        if (root !== null) {
          b$1$1.min = root.min;
          b$1$1.max = root.max;

          if (!this.cull || this.region.intersectsBox(b$1$1)) {
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
                b$1$1.min = child.min;
                b$1$1.max = child.max;

                if (!region.intersectsBox(b$1$1)) {
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

  var b$2$1 = new Box3();

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
    b$2$1.min = octant.min;
    b$2$1.max = octant.max;

    if (region.intersectsBox(b$2$1)) {
      if (children !== null) {
        for (i = 0, l = children.length; i < l; ++i) {
          _cull(children[i], region, result);
        }
      } else {
        result.push(octant);
      }
    }
  }

  function _findNodesByLevel(octant, level, depth, result) {
    var children = octant.children;
    var i, l;

    if (depth === level) {
      result.push(octant);
    } else if (children !== null) {
      ++depth;

      for (i = 0, l = children.length; i < l; ++i) {
        _findNodesByLevel(children[i], level, depth, result);
      }
    }
  }

  var Octree = function () {
    function Octree(root) {
      _classCallCheck(this, Octree);

      this.root = root;
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
      key: "cull",
      value: function cull(region) {
        var result = [];

        _cull(this.root, region, result);

        return result;
      }
    }, {
      key: "getDepth",
      value: function getDepth() {
        return _getDepth(this.root);
      }
    }, {
      key: "findNodesByLevel",
      value: function findNodesByLevel(level) {
        var result = [];

        _findNodesByLevel(this.root, level, 0, result);

        return result;
      }
    }, {
      key: "raycast",
      value: function raycast(raycaster) {
        var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        OctreeRaycaster.intersectOctree(this, raycaster.ray, intersects);
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

  var p = new Vector3();

  var PointOctant = function (_Octant) {
    _inherits(PointOctant, _Octant);

    function PointOctant(min, max) {
      var _this;

      _classCallCheck(this, PointOctant);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PointOctant).call(this, min, max));
      _this.points = null;
      _this.data = null;
      return _this;
    }

    _createClass(PointOctant, [{
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
        var i, j, il, jl;
        var child, point, entry;

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

          this.points = null;
          this.data = null;
        }
      }
    }, {
      key: "merge",
      value: function merge() {
        var children = this.children;

        if (children !== null) {
          var points = [];
          var data = [];
          var i, l, child;

          for (i = 0, l = children.length; i < l; ++i) {
            child = children[i];

            if (child.points !== null) {
              points = points.concat(child.points);
              data = data.concat(child.data);
            }
          }

          this.children = null;
          this.points = points;
          this.data = data;
        }
      }
    }]);

    return PointOctant;
  }(Octant);

  function _countPoints(octant) {
    var children = octant.children;
    var result = 0;
    var i, l;

    if (children !== null) {
      for (i = 0, l = children.length; i < l; ++i) {
        result += _countPoints(children[i]);
      }
    } else if (octant.points !== null) {
      result = octant.points.length;
    }

    return result;
  }

  function _insert(point, data, octree, octant, depth) {
    var children = octant.children;
    var exists = false;
    var done = false;
    var i, l;

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
          done = _insert(point, data, octree, children[i], depth);
        }
      }
    }

    return done;
  }

  function _remove(point, octree, octant, parent) {
    var children = octant.children;
    var result = null;
    var i, l;
    var points, data, last;

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

  function _get$1(point, octree, octant) {
    var children = octant.children;
    var result = null;
    var i, l;
    var points;

    if (octant.contains(point, octree.bias)) {
      if (children !== null) {
        for (i = 0, l = children.length; result === null && i < l; ++i) {
          result = _get$1(point, octree, children[i]);
        }
      } else if (octant.points !== null) {
        points = octant.points;

        for (i = 0, l = points.length; result === null && i < l; ++i) {
          if (point.equals(points[i])) {
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
    var i, l;
    var points;

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
            if (point.equals(points[i])) {
              points[i].copy(position);
              result = octant.data[i];
              break;
            }
          }
        }
      } else {
        result = _remove(point, octree, octant, parent);

        _insert(position, result, octree, parent, depth - 1);
      }
    }

    return result;
  }

  function _findNearestPoint(point, maxDistance, skipSelf, octant) {
    var result = null;
    var bestDistance = maxDistance;
    var i, l;

    if (octant.children !== null) {
      var sortedChildren = octant.children.map(function (child) {
        return {
          octant: child,
          distance: child.distanceToCenterSquared(point)
        };
      }).sort(function (a, b) {
        return a.distance - b.distance;
      });
      var child, intermediateResult;

      for (i = 0, l = sortedChildren.length; i < l; ++i) {
        child = sortedChildren[i].octant;

        if (child.contains(point, bestDistance)) {
          intermediateResult = _findNearestPoint(point, bestDistance, skipSelf, child);

          if (intermediateResult !== null) {
            bestDistance = intermediateResult.distance;
            result = intermediateResult;

            if (bestDistance === 0.0) {
              break;
            }
          }
        }
      }
    } else if (octant.points !== null) {
      var points = octant.points;
      var index = -1;
      var distance;

      for (i = 0, l = points.length; i < l; ++i) {
        if (points[i].equals(point)) {
          if (!skipSelf) {
            bestDistance = 0.0;
            index = i;
            break;
          }
        } else {
          distance = point.distanceTo(points[i]);

          if (distance < bestDistance) {
            bestDistance = distance;
            index = i;
          }
        }
      }

      if (index >= 0) {
        result = {
          point: points[index],
          data: octant.data[index],
          distance: bestDistance
        };
      }
    }

    return result;
  }

  function _findPoints(point, radius, skipSelf, octant, result) {
    var children = octant.children;
    var i, l;

    if (children !== null) {
      var child;

      for (i = 0, l = children.length; i < l; ++i) {
        child = children[i];

        if (child.contains(point, radius)) {
          _findPoints(point, radius, skipSelf, child, result);
        }
      }
    } else if (octant.points !== null) {
      var points = octant.points;
      var rSq = radius * radius;

      var _p;

      for (i = 0, l = points.length; i < l; ++i) {
        _p = points[i];

        if (_p.equals(point)) {
          if (!skipSelf) {
            result.push({
              point: _p.clone(),
              data: octant.data[i]
            });
          }
        } else if (_p.distanceToSquared(point) <= rSq) {
          result.push({
            point: _p.clone(),
            data: octant.data[i]
          });
        }
      }
    }
  }

  var PointOctree = function (_Octree) {
    _inherits(PointOctree, _Octree);

    function PointOctree(min, max) {
      var _this2;

      var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
      var maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;
      var maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;

      _classCallCheck(this, PointOctree);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(PointOctree).call(this, new PointOctant(min, max)));
      _this2.bias = Math.max(0.0, bias);
      _this2.maxPoints = Math.max(1, Math.round(maxPoints));
      _this2.maxDepth = Math.max(0, Math.round(maxDepth));
      _this2.pointCount = 0;
      return _this2;
    }

    _createClass(PointOctree, [{
      key: "countPoints",
      value: function countPoints(octant) {
        return _countPoints(octant);
      }
    }, {
      key: "insert",
      value: function insert(point, data) {
        return _insert(point, data, this, this.root, 0);
      }
    }, {
      key: "remove",
      value: function remove(point) {
        return _remove(point, this, this.root, null);
      }
    }, {
      key: "get",
      value: function get(point) {
        return _get$1(point, this, this.root);
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

        var result = _findNearestPoint(point, maxDistance, skipSelf, this.root);

        if (result !== null) {
          result.point = result.point.clone();
        }

        return result;
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

        var octants = _get(_getPrototypeOf(PointOctree.prototype), "raycast", this).call(this, raycaster);

        if (octants.length > 0) {
          testPoints(octants, raycaster, intersects);
        }

        return intersects;
      }
    }]);

    return PointOctree;
  }(Octree);

  var ISOVALUE_BIAS = 1e-4;
  var INTERVAL_THRESHOLD = 1e-6;
  var ab = new Vector3();
  var p$1 = new Vector3();
  var v$8 = new Vector3();
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
            axes.push(layout$1[a]);
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

  var m$2 = new Matrix4();
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
        this.inverseTransformation.getInverse(this.getTransformation(m$2));
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

  var p$2 = new Vector3();
  var v$9 = new Vector3();
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
          offset = layout$1[i];
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
                keyDesign.unpackKey(key, v$9);
                v$9.x <<= 1;
                v$9.y <<= 1;
                v$9.z <<= 1;

                for (i = 0; i < 8; ++i) {
                  offset = layout$1[i];
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
              keyDesign.unpackKey(key, v$9);

              _applyDifference(world, sdf, grid.get(key), v$9.x, v$9.y, v$9.z, lod);
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

  var v$a = new Vector3();
  var l = new Line3();
  var b$4 = new Box3();
  var d$1 = new Box3();
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
        octantWrapper.id.set(lod, keyDesign.packKey(v$a.set(keyX, keyY, keyZ)));
        octantWrapper.min.copy(v$a).multiplyScalar(cellSize).add(world.min);
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
                  offset = layout$1[i];
                  v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, tx0, ty0, tz0, txm, tym, tzm, intersects);
                }

                currentOctant = findNextOctant$1(currentOctant, txm, tym, tzm);
                break;
              }

            case 1:
              {
                if ((children & 1 << i) !== 0) {
                  offset = layout$1[i];
                  v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, tx0, ty0, tzm, txm, tym, tz1, intersects);
                }

                currentOctant = findNextOctant$1(currentOctant, txm, tym, tz1);
                break;
              }

            case 2:
              {
                if ((children & 1 << i) !== 0) {
                  offset = layout$1[i];
                  v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, tx0, tym, tz0, txm, ty1, tzm, intersects);
                }

                currentOctant = findNextOctant$1(currentOctant, txm, ty1, tzm);
                break;
              }

            case 3:
              {
                if ((children & 1 << i) !== 0) {
                  offset = layout$1[i];
                  v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, tx0, tym, tzm, txm, ty1, tz1, intersects);
                }

                currentOctant = findNextOctant$1(currentOctant, txm, ty1, tz1);
                break;
              }

            case 4:
              {
                if ((children & 1 << i) !== 0) {
                  offset = layout$1[i];
                  v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, txm, ty0, tz0, tx1, tym, tzm, intersects);
                }

                currentOctant = findNextOctant$1(currentOctant, tx1, tym, tzm);
                break;
              }

            case 5:
              {
                if ((children & 1 << i) !== 0) {
                  offset = layout$1[i];
                  v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, txm, ty0, tzm, tx1, tym, tz1, intersects);
                }

                currentOctant = findNextOctant$1(currentOctant, tx1, tym, tz1);
                break;
              }

            case 6:
              {
                if ((children & 1 << i) !== 0) {
                  offset = layout$1[i];
                  v$a.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant$1(world, grid.get(keyDesign.packKey(v$a)), v$a.x, v$a.y, v$a.z, lod, txm, tym, tz0, tx1, ty1, tzm, intersects);
                }

                currentOctant = findNextOctant$1(currentOctant, tx1, ty1, tzm);
                break;
              }

            case 7:
              {
                if ((children & 1 << i) !== 0) {
                  offset = layout$1[i];
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
    var min = b$4.min.set(0, 0, 0);
    var max = b$4.max.subVectors(subtree.max, subtree.min);
    var dimensions = subtree.getDimensions(d$1.min);
    var halfDimensions = d$1.max.copy(dimensions).multiplyScalar(0.5);
    var origin = r$1.origin.copy(ray.origin);
    var direction = r$1.direction.copy(ray.direction);
    var invDirX, invDirY, invDirZ;
    var tx0, tx1, ty0, ty1, tz0, tz1;
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
          b = r$1.at(t, v$a);
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

  var v$b = new Vector3();

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
          offset = layout$1[i];
          v$b.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
          key = keyDesign.packKey(v$b);
          child = grid.get(key);
          grid["delete"](key);
          removeChildren(world, child, v$b.x, v$b.y, v$b.z, lod);
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
      v$b.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);
      key = world.getKeyDesign().packKey(v$b);
      parent = grid.get(key);
      parent.children &= ~(1 << i);

      if (parent.children === 0) {
        grid["delete"](key);
        prune(world, v$b.x, v$b.y, v$b.z, lod);
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
        var result;

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
        var keyX, keyY, keyZ;

        if (grid !== undefined) {
          if (grid.has(key)) {
            keyDesign.unpackKey(key, v$b);
            keyX = v$b.x;
            keyY = v$b.y;
            keyZ = v$b.z;
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

  var b$5 = new Box3();
  var f = new Frustum();
  var m$3 = new Matrix4();
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
        f.setFromMatrix(m$3.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
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

  var Action$1 = {
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

  var ConfigurationMessage = function (_Message) {
    _inherits(ConfigurationMessage, _Message);

    function ConfigurationMessage() {
      var _this;

      _classCallCheck(this, ConfigurationMessage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ConfigurationMessage).call(this, Action$1.CONFIGURE));
      _this.resolution = HermiteData.resolution;
      _this.errorThreshold = 1e-2;
      return _this;
    }

    return ConfigurationMessage;
  }(Message);

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

  var worker = "function _typeof(e){return _typeof=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&\"function\"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?\"symbol\":typeof e},_typeof(e)}(function(){'use strict';var me=Math.pow,xe=Math.trunc,pe=Math.sign,ve=Math.PI,ge=Math.atan2,ke=Math.round,he=Math.acos,ze=Math.cos,fe=Math.sin,Se=Math.floor,we=Math.ceil,Te=Math.abs,Ie=Math.sqrt,Ce=Math.max,Pe=Math.min;function e(e,t){if(!(e instanceof t))throw new TypeError(\"Cannot call a class as a function\")}function t(e,t){for(var a,n=0;n<t.length;n++)a=t[n],a.enumerable=a.enumerable||!1,a.configurable=!0,\"value\"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}function n(e,a,n){return a&&t(e.prototype,a),n&&t(e,n),e}function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){if(\"function\"!=typeof t&&null!==t)throw new TypeError(\"Super expression must either be null or a function\");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}function s(e){return s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},s(e)}function y(e,t){return y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},y(e,t)}function u(){if(\"undefined\"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if(\"function\"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function x(){return x=u()?Reflect.construct:function(e,t,n){var i=[null];i.push.apply(i,t);var a=Function.bind.apply(e,i),l=new a;return n&&y(l,n.prototype),l},x.apply(null,arguments)}function g(e){if(void 0===e)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return e}function k(e,t){return t&&(\"object\"===_typeof(t)||\"function\"==typeof t)?t:g(e)}function h(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&(e=s(e),null!==e););return e}function z(e,t,a){return z=\"undefined\"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,a){var n=h(e,t);if(n){var i=Object.getOwnPropertyDescriptor(n,t);return i.get?i.get.call(a):i.value}},z(e,t,a||e)}function f(e,t,a,n){return f=\"undefined\"!=typeof Reflect&&Reflect.set?Reflect.set:function(e,t,a,n){var l,o=h(e,t);if(o){if(l=Object.getOwnPropertyDescriptor(o,t),l.set)return l.set.call(n,a),!0;if(!l.writable)return!1}if(l=Object.getOwnPropertyDescriptor(n,t),l){if(!l.writable)return!1;l.value=a,Object.defineProperty(n,t,l)}else i(n,t,a);return!0},f(e,t,a,n)}function S(e,t,a,n,i){var l=f(e,t,a,n||e);if(!l&&i)throw new Error(\"failed to set property\");return a}function w(e){return T(e)||I(e)||C()}function T(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}}function I(e){if(Symbol.iterator in Object(e)||\"[object Arguments]\"===Object.prototype.toString.call(e))return Array.from(e)}function C(){throw new TypeError(\"Invalid attempt to spread non-iterable instance\")}function P(e,t,a){return Ce(Pe(e,a),t)}function E(e,t,a){var n,l,o,s,r,y,d,u,c,m,x,p=t.params.Points.threshold;for(r=0,d=e.length;r<d;++r)if(c=e[r],m=c.points,null!==m)for(y=0,u=m.length;y<u;++y)x=m[y],s=t.ray.distanceSqToPoint(x),s<p*p&&(n=t.ray.closestPointToPoint(x,new Ee),l=t.ray.origin.distanceTo(n),l>=t.near&&l<=t.far&&(o=Ie(s),a.push(new yt(l,o,n,c.data[y]))))}function D(e,t,a,n,i,l){var o=0;return e>t&&e>a?(i<e&&(o|=2),l<e&&(o|=1)):t>a?(n<t&&(o|=4),l<t&&(o|=1)):(n<a&&(o|=4),i<a&&(o|=2)),o}function F(e,t,a,n){var i,l=0;return t<a?(i=t,l=0):(i=a,l=1),n<i&&(l=2),dt[e][l]}function A(e,t,a){var n,i,l,o,s,r,y,u,c,m=ct.min.set(0,0,0),x=ct.max.subVectors(e.max,e.min),p=e.getDimensions(mt.min),v=mt.max.copy(p).multiplyScalar(.5),g=d.origin.copy(t.origin),k=d.direction.copy(t.direction);return g.sub(e.getCenter(ut)).add(v),a.value=0,0>k.x&&(g.x=p.x-g.x,k.x=-k.x,a.value|=4),0>k.y&&(g.y=p.y-g.y,k.y=-k.y,a.value|=2),0>k.z&&(g.z=p.z-g.z,k.z=-k.z,a.value|=1),n=1/k.x,i=1/k.y,l=1/k.z,o=(m.x-g.x)*n,s=(x.x-g.x)*n,r=(m.y-g.y)*i,y=(x.y-g.y)*i,u=(m.z-g.z)*l,c=(x.z-g.z)*l,Ce(Ce(o,r),u)<Pe(Pe(s,y),c)?[o,r,u,s,y,c]:null}function V(e,t,a,n,i,l,o,s){if(0<=i&&0<=l&&0<=o){var y=e.children;if(null===y)s.push(e);else{var d=.5*(t+i),u=.5*(a+l),c=.5*(n+o),m=r.value,x=D(t,a,n,d,u,c);do 0===x?(V(y[m],t,a,n,d,u,c,s),x=F(x,d,u,c)):1===x?(V(y[1^m],t,a,c,d,u,o,s),x=F(x,d,u,o)):2===x?(V(y[2^m],t,u,n,d,l,c,s),x=F(x,d,l,c)):3===x?(V(y[3^m],t,u,c,d,l,o,s),x=F(x,d,l,o)):4===x?(V(y[4^m],d,a,n,i,u,c,s),x=F(x,i,u,c)):5===x?(V(y[5^m],d,a,c,i,u,o,s),x=F(x,i,u,o)):6===x?(V(y[6^m],d,u,n,i,l,c,s),x=F(x,i,l,c)):7===x?(V(y[7^m],d,u,c,i,l,o,s),x=8):void 0;while(8>x)}}}function B(e){var t,a,n,o=e.children,s=0;if(null!==o)for(t=0,a=o.length;t<a;++t)n=1+B(o[t]),n>s&&(s=n);return s}function N(e,t,a){var n,o,s=e.children;if(gt.min=e.min,gt.max=e.max,t.intersectsBox(gt))if(null!==s)for(n=0,o=s.length;n<o;++n)N(s[n],t,a);else a.push(e)}function L(e,t,a,n){var o,s,r=e.children;if(a===t)n.push(e);else if(null!==r)for(++a,o=0,s=r.length;o<s;++o)L(r[o],t,a,n)}function O(e){var t,a,n=e.children,o=0;if(null!==n)for(t=0,a=n.length;t<a;++t)o+=O(n[t]);else null!==e.points&&(o=e.points.length);return o}function M(e,t,a,n,o){var s,r,y=n.children,d=!1,u=!1;if(n.contains(e,a.bias)){if(null===y){if(null===n.points)n.points=[],n.data=[];else for(s=0,r=n.points.length;!d&&s<r;++s)d=n.points[s].equals(e);d?(n.data[s-1]=t,u=!0):n.points.length<a.maxPoints||o===a.maxDepth?(n.points.push(e.clone()),n.data.push(t),++a.pointCount,u=!0):(n.split(),n.redistribute(a.bias),y=n.children)}if(null!==y)for(++o,s=0,r=y.length;!u&&s<r;++s)u=M(e,t,a,y[s],o)}return u}function R(e,t,a,n){var o,s,r,y,d,u=a.children,c=null;if(a.contains(e,t.bias))if(null!==u)for(o=0,s=u.length;null===c&&o<s;++o)c=R(e,t,u[o],a);else if(null!==a.points)for(r=a.points,y=a.data,(o=0,s=r.length);o<s;++o)if(r[o].equals(e)){d=s-1,c=y[o],o<d&&(r[o]=r[d],y[o]=y[d]),r.pop(),y.pop(),--t.pointCount,null!==n&&O(n)<=t.maxPoints&&n.merge();break}return c}function Y(e,t,a){var n,o,s,r=a.children,y=null;if(a.contains(e,t.bias))if(null!==r)for(n=0,o=r.length;null===y&&n<o;++n)y=Y(e,t,r[n]);else if(null!==a.points)for(s=a.points,n=0,o=s.length;null===y&&n<o;++n)e.equals(s[n])&&(y=a.data[n]);return y}function X(e,t,a,n,o,s){var r,y,d,u=n.children,c=null;if(n.contains(e,a.bias))if(!n.contains(t,a.bias))c=R(e,a,n,o),M(t,c,a,o,s-1);else if(null!==u)for(++s,r=0,y=u.length;null===c&&r<y;++r)c=X(e,t,a,u[r],n,s);else if(null!==n.points)for(d=n.points,r=0,y=d.length;r<y;++r)if(e.equals(d[r])){d[r].copy(t),c=n.data[r];break}return c}function Z(e,t,a,n){var o,s,r=null,y=t;if(null!==n.children){var d,u,c=n.children.map(function(t){return{octant:t,distance:t.distanceToCenterSquared(e)}}).sort(function(e,t){return e.distance-t.distance});for(o=0,s=c.length;o<s&&(d=c[o].octant,!(d.contains(e,y)&&(u=Z(e,y,a,d),null!==u&&(y=u.distance,r=u,0===y))));++o);}else if(null!==n.points){var m,x=n.points,p=-1;for(o=0,s=x.length;o<s;++o)if(!x[o].equals(e))m=e.distanceTo(x[o]),m<y&&(y=m,p=o);else if(!a){y=0,p=o;break}0<=p&&(r={point:x[p],data:n.data[p],distance:y})}return r}function _(e,t,a,n,o){var s,r,y=n.children;if(null!==y){var d;for(s=0,r=y.length;s<r;++s)d=y[s],d.contains(e,t)&&_(e,t,a,d,o)}else if(null!==n.points){var u,c=n.points;for(s=0,r=c.length;s<r;++s)u=c[s],u.equals(e)?!a&&o.push({point:u.clone(),data:n.data[s]}):u.distanceToSquared(e)<=t*t&&o.push({point:u.clone(),data:n.data[s]})}}function j(e,t){var a,n=e.elements,i=t.elements;0!==n[1]&&(a=Lt.calculateCoefficients(n[0],n[1],n[3]),Ot.rotateQXY(Xt.set(n[0],n[3]),n[1],a),n[0]=Xt.x,n[3]=Xt.y,Ot.rotateXY(Xt.set(n[2],n[4]),a),n[2]=Xt.x,n[4]=Xt.y,n[1]=0,Ot.rotateXY(Xt.set(i[0],i[3]),a),i[0]=Xt.x,i[3]=Xt.y,Ot.rotateXY(Xt.set(i[1],i[4]),a),i[1]=Xt.x,i[4]=Xt.y,Ot.rotateXY(Xt.set(i[2],i[5]),a),i[2]=Xt.x,i[5]=Xt.y)}function U(e,t){var a,n=e.elements,i=t.elements;0!==n[2]&&(a=Lt.calculateCoefficients(n[0],n[2],n[5]),Ot.rotateQXY(Xt.set(n[0],n[5]),n[2],a),n[0]=Xt.x,n[5]=Xt.y,Ot.rotateXY(Xt.set(n[1],n[4]),a),n[1]=Xt.x,n[4]=Xt.y,n[2]=0,Ot.rotateXY(Xt.set(i[0],i[6]),a),i[0]=Xt.x,i[6]=Xt.y,Ot.rotateXY(Xt.set(i[1],i[7]),a),i[1]=Xt.x,i[7]=Xt.y,Ot.rotateXY(Xt.set(i[2],i[8]),a),i[2]=Xt.x,i[8]=Xt.y)}function Q(e,t){var a,n=e.elements,i=t.elements;0!==n[4]&&(a=Lt.calculateCoefficients(n[3],n[4],n[5]),Ot.rotateQXY(Xt.set(n[3],n[5]),n[4],a),n[3]=Xt.x,n[5]=Xt.y,Ot.rotateXY(Xt.set(n[1],n[2]),a),n[1]=Xt.x,n[2]=Xt.y,n[4]=0,Ot.rotateXY(Xt.set(i[3],i[6]),a),i[3]=Xt.x,i[6]=Xt.y,Ot.rotateXY(Xt.set(i[4],i[7]),a),i[4]=Xt.x,i[7]=Xt.y,Ot.rotateXY(Xt.set(i[5],i[8]),a),i[5]=Xt.x,i[8]=Xt.y)}function G(t,a){var n,l=t.elements;for(n=0;n<5;++n)j(t,a),U(t,a),Q(t,a);return Zt.set(l[0],l[3],l[5])}function H(e){var t=Te(e)<Mt?0:1/e;return Te(t)<Mt?0:t}function J(e,t){var a=e.elements,n=a[0],i=a[3],l=a[6],o=a[1],s=a[4],r=a[7],y=a[2],d=a[5],u=a[8],c=H(t.x),m=H(t.y),x=H(t.z);return e.set(n*c*n+i*m*i+l*x*l,n*c*o+i*m*s+l*x*r,n*c*y+i*m*d+l*x*u,o*c*n+s*m*i+r*x*l,o*c*o+s*m*s+r*x*r,o*c*y+s*m*d+r*x*u,y*c*n+d*m*i+u*x*l,y*c*o+d*m*s+u*x*r,y*c*y+d*m*d+u*x*u)}function K(e,t,a){return e.applyToVector3(jt.copy(a)),jt.subVectors(t,jt),jt.dot(jt)}function W(e,t,a){var n,l,o,s,r,y,d,u=[-1,-1,-1,-1],c=[!1,!1,!1,!1],m=1/0,x=0,p=!1;for(d=0;4>d;++d)r=e[d],y=la[t][d],n=nt[y][0],l=nt[y][1],o=1&r.voxel.materials>>n,s=1&r.voxel.materials>>l,r.size<m&&(m=r.size,x=d,p=o!==Dt.AIR),u[d]=r.voxel.index,c[d]=o!==s;c[x]&&(p?(a.push(u[0]),a.push(u[3]),a.push(u[1]),a.push(u[0]),a.push(u[2]),a.push(u[3])):(a.push(u[0]),a.push(u[1]),a.push(u[3]),a.push(u[0]),a.push(u[3]),a.push(u[2])))}function $(e,t,a){var n,l,o,s,r=[0,0,0,0];if(null!==e[0].voxel&&null!==e[1].voxel&&null!==e[2].voxel&&null!==e[3].voxel)W(e,t,a);else for(o=0;2>o;++o){for(r[0]=ia[t][o][0],r[1]=ia[t][o][1],r[2]=ia[t][o][2],r[3]=ia[t][o][3],n=[],s=0;4>s;++s)if(l=e[s],null!==l.voxel)n[s]=l;else if(null!==l.children)n[s]=l.children[r[s]];else break;4===s&&$(n,ia[t][o][4],a)}}function ee(e,t,a){var n,l,o,s,r,y,d=[0,0,0,0],u=[[0,0,1,1],[0,1,0,1]];if(null!==e[0].children||null!==e[1].children){for(r=0;4>r;++r)d[0]=aa[t][r][0],d[1]=aa[t][r][1],n=[null===e[0].children?e[0]:e[0].children[d[0]],null===e[1].children?e[1]:e[1].children[d[1]]],ee(n,aa[t][r][2],a);for(r=0;4>r;++r){for(d[0]=na[t][r][1],d[1]=na[t][r][2],d[2]=na[t][r][3],d[3]=na[t][r][4],o=u[na[t][r][0]],l=[],y=0;4>y;++y)if(s=e[o[y]],null!==s.voxel)l[y]=s;else if(null!==s.children)l[y]=s.children[d[y]];else break;4===y&&$(l,na[t][r][5],a)}}}function te(e,t){var a,n,l,o=e.children,s=[0,0,0,0];if(null!==o){for(l=0;8>l;++l)te(o[l],t);for(l=0;12>l;++l)s[0]=ea[l][0],s[1]=ea[l][1],a=[o[s[0]],o[s[1]]],ee(a,ea[l][2],t);for(l=0;6>l;++l)s[0]=ta[l][0],s[1]=ta[l][1],s[2]=ta[l][2],s[3]=ta[l][3],n=[o[s[0]],o[s[1]],o[s[2]],o[s[3]]],$(n,ta[l][4],t)}}function ae(e,t,a,n){var l,o;if(null!==e.children)for(l=0;8>l;++l)n=ae(e.children[l],t,a,n);else null!==e.voxel&&(o=e.voxel,o.index=n,t[3*n]=o.position.x,t[3*n+1]=o.position.y,t[3*n+2]=o.position.z,a[3*n]=o.normal.x,a[3*n+1]=o.normal.y,a[3*n+2]=o.normal.z,++n);return n}function ne(e,t,a,l,o){var s=0;for(t>>=1;0<t;t>>=1,s=0)a>=t&&(s+=4,a-=t),l>=t&&(s+=2,l-=t),o>=t&&(s+=1,o-=t),null===e.children&&e.split(),e=e.children[s];return e}function ie(e,t,a,n,l){var o,s,r,y,d,u,c,x,p,v,g=e+1,m=new Qt;for(o=0,v=0;8>v;++v)y=it[v],d=(n+y[2])*(g*g)+(a+y[1])*g+(t+y[0]),r=Pe(l[d],Dt.SOLID),o|=r<<v;for(s=0,v=0;12>v;++v)u=nt[v][0],c=nt[v][1],x=1&o>>u,p=1&o>>c,x!==p&&++s;return m.materials=o,m.edgeCount=s,m.qefData=new Bt,m}function le(e){var t=za,a=Vt.resolution,n=new Ee(0,0,0),i=new Ee(a,a,a),l=new v(fa,fa.clone().addScalar(za)),o=e.getBoundingBox();return e.type!==pa.INTERSECTION&&(o.intersectsBox(l)?(n.copy(o.min).max(l.min).sub(l.min),n.x=we(n.x*a/t),n.y=we(n.y*a/t),n.z=we(n.z*a/t),i.copy(o.max).min(l.max).sub(l.min),i.x=Se(i.x*a/t),i.y=Se(i.y*a/t),i.z=Se(i.z*a/t)):(n.set(a,a,a),i.set(0,0,0))),new v(n,i)}function oe(e,t,a,i){var l,o,s,r=Vt.resolution,n=r+1,d=i.max.x,u=i.max.y,c=i.max.z;for(s=i.min.z;s<=c;++s)for(o=i.min.y;o<=u;++o)for(l=i.min.x;l<=d;++l)e.updateMaterialIndex(s*(n*n)+o*n+l,t,a)}function se(e,t,a){var i,l,o,r,d=za,s=Vt.resolution,n=s+1,u=t.materialIndices,c=new Ee,m=new Ee,p=a.max.x,v=a.max.y,g=a.max.z,k=0;for(r=a.min.z;r<=g;++r)for(c.z=r*d/s,o=a.min.y;o<=v;++o)for(c.y=o*d/s,l=a.min.x;l<=p;++l)c.x=l*d/s,i=e.generateMaterialIndex(m.addVectors(fa,c)),i!==Dt.AIR&&(u[r*(n*n)+o*n+l]=i,++k);t.materials=k}function re(e,t,a){var l,o,s,r,y,u,x,p,v,g,k,h,z,f,S,w,T,I,C,P,b,E,D,F=Vt.resolution,n=F+1,m=new Uint32Array([1,n,n*n]),q=t.materialIndices,A=new Tt,V=new Tt,B=a.edgeData,N=t.edgeData,L=new Uint32Array(3),O=Et.calculate1DEdgeCount(F),M=new Et(F,Pe(O,N.indices[0].length+B.indices[0].length),Pe(O,N.indices[1].length+B.indices[1].length),Pe(O,N.indices[2].length+B.indices[2].length));for(I=0,C=0;3>C;I=0,++C){for(l=B.indices[C],r=N.indices[C],x=M.indices[C],o=B.zeroCrossings[C],y=N.zeroCrossings[C],p=M.zeroCrossings[C],s=B.normals[C],u=N.normals[C],v=M.normals[C],g=m[C],E=l.length,D=r.length,(P=0,b=0);P<E;++P)if(k=l[P],h=k+g,S=q[k],w=q[h],S!==w&&(S===Dt.AIR||w===Dt.AIR)){for(A.t=o[P],A.n.x=s[3*P],A.n.y=s[3*P+1],A.n.z=s[3*P+2],e.type===pa.DIFFERENCE&&A.n.negate(),T=A;b<D&&r[b]<=k;)z=r[b],f=z+g,V.t=y[b],V.n.x=u[3*b],V.n.y=u[3*b+1],V.n.z=u[3*b+2],S=q[z],z<k?(w=q[f],S!==w&&(S===Dt.AIR||w===Dt.AIR)&&(x[I]=z,p[I]=V.t,v[3*I]=V.n.x,v[3*I+1]=V.n.y,v[3*I+2]=V.n.z,++I)):T=e.selectEdge(V,A,S===Dt.SOLID),++b;x[I]=k,p[I]=T.t,v[3*I]=T.n.x,v[3*I+1]=T.n.y,v[3*I+2]=T.n.z,++I}for(;b<D;)z=r[b],f=z+g,S=q[z],w=q[f],S!==w&&(S===Dt.AIR||w===Dt.AIR)&&(x[I]=z,p[I]=y[b],v[3*I]=u[3*b],v[3*I+1]=u[3*b+1],v[3*I+2]=u[3*b+2],++I),++b;L[C]=I}return{edgeData:M,lengths:L}}function ye(e,t,i){var l,o,r,u,p,v,g,k,h,f,S,w,T,I,C,P,b,E,D,F=za,s=Vt.resolution,n=s+1,m=n*n,q=new Uint32Array([1,n,m]),A=t.materialIndices,V=fa,B=new Ee,N=new Ee,L=new Tt,O=new Uint32Array(3),M=new Et(s,Et.calculate1DEdgeCount(s));for(C=4,T=0,I=0;3>I;C>>=1,T=0,++I){P=it[C],l=M.indices[I],o=M.zeroCrossings[I],r=M.normals[I],u=q[I],g=i.min.x,f=i.max.x,k=i.min.y,S=i.max.y,h=i.min.z,w=i.max.z;for(0===I?(g=Ce(g-1,0),f=Pe(f,s-1)):1===I?(k=Ce(k-1,0),S=Pe(S,s-1)):2===I?(h=Ce(h-1,0),w=Pe(w,s-1)):void 0,D=h;D<=w;++D)for(E=k;E<=S;++E)for(b=g;b<=f;++b)p=D*m+E*n+b,v=p+u,A[p]!==A[v]&&(B.set(b*F/s,E*F/s,D*F/s),N.set((b+P[0])*F/s,(E+P[1])*F/s,(D+P[2])*F/s),L.a.addVectors(V,B),L.b.addVectors(V,N),e.generateEdge(L),l[T]=p,o[T]=L.t,r[3*T]=L.n.x,r[3*T+1]=L.n.y,r[3*T+2]=L.n.z,++T);O[I]=T}return{edgeData:M,lengths:O}}function de(e,t,a){var n,i,l,o,s=le(e),r=!1;if(e.type===pa.DENSITY_FUNCTION?se(e,t,s):t.empty?e.type===pa.UNION&&(t.set(a),r=!0):!(t.full&&e.type===pa.UNION)&&oe(e,t,a,s),!r&&!t.empty&&!t.full){for(n=e.type===pa.DENSITY_FUNCTION?ye(e,t,s):re(e,t,a),i=n.edgeData,l=n.lengths,o=0;3>o;++o)i.indices[o]=i.indices[o].slice(0,l[o]),i.zeroCrossings[o]=i.zeroCrossings[o].slice(0,l[o]),i.normals[o]=i.normals[o].slice(0,3*l[o]);t.edgeData=i}}function ue(e){var t,a,n,o,s=e.children;for(e.type===pa.DENSITY_FUNCTION&&(t=new Vt,de(e,t)),n=0,o=s.length;n<o&&(a=ue(s[n]),void 0===t?t=a:null===a?e.type===pa.INTERSECTION&&(t=null):null===t?e.type===pa.UNION&&(t=a):de(e,t,a),null!==t||e.type===pa.UNION);++n);return null!==t&&t.empty?null:t}function ce(e){var t=document.createElementNS(\"http://www.w3.org/1999/xhtml\",\"canvas\"),a=t.getContext(\"2d\");return t.width=e.width,t.height=e.height,a.drawImage(e,0,0),a.getImageData(0,0,e.width,e.height)}var be=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;e(this,t),this.runLengths=a,this.data=n}return n(t,null,[{key:\"encode\",value:function(e){var a,n,o=[],s=[],r=e[0],y=1;for(a=1,n=e.length;a<n;++a)r===e[a]?++y:(o.push(y),s.push(r),r=e[a],y=1);return o.push(y),s.push(r),new t(o,s)}},{key:\"decode\",value:function(e,t){var a,n,l,o,s,r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:[],y=0;for(n=0,o=t.length;n<o;++n)for(a=t[n],l=0,s=e[n];l<s;++l)r[y++]=a;return r}}]),t}(),Ee=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.x=a,this.y=n,this.z=i}return n(t,[{key:\"set\",value:function(e,t,a){return this.x=e,this.y=t,this.z=a,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}},{key:\"setFromSpherical\",value:function(e){this.setFromSphericalCoords(e.radius,e.phi,e.theta)}},{key:\"setFromSphericalCoords\",value:function(e,t,a){var n=fe(t)*e;return this.x=n*fe(a),this.y=ze(t)*e,this.z=n*ze(a),this}},{key:\"setFromCylindrical\",value:function(e){this.setFromCylindricalCoords(e.radius,e.theta,e.y)}},{key:\"setFromCylindricalCoords\",value:function(e,t,a){return this.x=e*fe(t),this.y=a,this.z=e*ze(t),this}},{key:\"setFromMatrixColumn\",value:function(e,t){return this.fromArray(e.elements,4*t)}},{key:\"setFromMatrixPosition\",value:function(e){var t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}},{key:\"setFromMatrixScale\",value:function(e){var t=this.setFromMatrixColumn(e,0).length(),a=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=a,this.z=n,this}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this.z+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this.z-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this.z*=e,this}},{key:\"multiplyVectors\",value:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this.z/=e,this}},{key:\"crossVectors\",value:function(e,t){var a=e.x,n=e.y,i=e.z,l=t.x,o=t.y,s=t.z;return this.x=n*s-i*o,this.y=i*l-a*s,this.z=a*o-n*l,this}},{key:\"cross\",value:function(e){return this.crossVectors(this,e)}},{key:\"transformDirection\",value:function(t){var a=this.x,n=this.y,i=this.z,l=t.elements;return this.x=l[0]*a+l[4]*n+l[8]*i,this.y=l[1]*a+l[5]*n+l[9]*i,this.z=l[2]*a+l[6]*n+l[10]*i,this.normalize()}},{key:\"applyMatrix3\",value:function(t){var a=this.x,n=this.y,i=this.z,l=t.elements;return this.x=l[0]*a+l[3]*n+l[6]*i,this.y=l[1]*a+l[4]*n+l[7]*i,this.z=l[2]*a+l[5]*n+l[8]*i,this}},{key:\"applyMatrix4\",value:function(t){var a=this.x,n=this.y,i=this.z,l=t.elements;return this.x=l[0]*a+l[4]*n+l[8]*i+l[12],this.y=l[1]*a+l[5]*n+l[9]*i+l[13],this.z=l[2]*a+l[6]*n+l[10]*i+l[14],this}},{key:\"applyQuaternion\",value:function(e){var t=this.x,a=this.y,n=this.z,i=e.x,l=e.y,o=e.z,s=e.w,r=s*t+l*n-o*a,y=s*a+o*t-i*n,d=s*n+i*a-l*t,u=-i*t-l*a-o*n;return this.x=r*s+u*-i+y*-o-d*-l,this.y=y*s+u*-l+d*-i-r*-o,this.z=d*s+u*-o+r*-l-y*-i,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z}},{key:\"reflect\",value:function(e){var t=e.x,a=e.y,n=e.z;return this.sub(e.multiplyScalar(2*this.dot(e))),e.set(t,a,n),this}},{key:\"angleTo\",value:function(e){var t=this.dot(e)/Ie(this.lengthSquared()*e.lengthSquared());return he(Pe(Ce(t,-1),1))}},{key:\"manhattanLength\",value:function(){return Te(this.x)+Te(this.y)+Te(this.z)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return Ie(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"manhattanDistanceTo\",value:function(e){return Te(this.x-e.x)+Te(this.y-e.y)+Te(this.z-e.z)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y,n=this.z-e.z;return t*t+a*a+n*n}},{key:\"distanceTo\",value:function(e){return Ie(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=Pe(this.x,e.x),this.y=Pe(this.y,e.y),this.z=Pe(this.z,e.z),this}},{key:\"max\",value:function(e){return this.x=Ce(this.x,e.x),this.y=Ce(this.y,e.y),this.z=Ce(this.z,e.z),this}},{key:\"clamp\",value:function(e,t){return this.x=Ce(e.x,Pe(t.x,this.x)),this.y=Ce(e.y,Pe(t.y,this.y)),this.z=Ce(e.z,Pe(t.z,this.z)),this}},{key:\"floor\",value:function(){return this.x=Se(this.x),this.y=Se(this.y),this.z=Se(this.z),this}},{key:\"ceil\",value:function(){return this.x=we(this.x),this.y=we(this.y),this.z=we(this.z),this}},{key:\"round\",value:function(){return this.x=ke(this.x),this.y=ke(this.y),this.z=ke(this.z),this}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}}]),t}(),De=new Ee,o=[new Ee,new Ee,new Ee,new Ee,new Ee,new Ee,new Ee,new Ee],v=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee(1/0,1/0,1/0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee(-Infinity,-Infinity,-Infinity);e(this,t),this.min=a,this.max=n}return n(t,[{key:\"set\",value:function(e,t){return this.min.copy(e),this.max.copy(t),this}},{key:\"copy\",value:function(e){return this.min.copy(e.min),this.max.copy(e.max),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-Infinity,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}},{key:\"setFromSphere\",value:function(e){return this.set(e.center,e.center),this.expandByScalar(e.radius),this}},{key:\"expandByPoint\",value:function(e){return this.min.min(e),this.max.max(e),this}},{key:\"expandByVector\",value:function(e){return this.min.sub(e),this.max.add(e),this}},{key:\"expandByScalar\",value:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this}},{key:\"setFromPoints\",value:function(e){var t,a;for(this.min.set(0,0,0),this.max.set(0,0,0),(t=0,a=e.length);t<a;++t)this.expandByPoint(e[t]);return this}},{key:\"setFromCenterAndSize\",value:function(e,t){var a=De.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(a),this.max.copy(e).add(a),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;return t.copy(e).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(e){var t=De.copy(e).clamp(this.min,this.max);return t.sub(e).length()}},{key:\"applyMatrix4\",value:function(e){var t=this.min,a=this.max;return this.isEmpty()||(o[0].set(t.x,t.y,t.z).applyMatrix4(e),o[1].set(t.x,t.y,a.z).applyMatrix4(e),o[2].set(t.x,a.y,t.z).applyMatrix4(e),o[3].set(t.x,a.y,a.z).applyMatrix4(e),o[4].set(a.x,t.y,t.z).applyMatrix4(e),o[5].set(a.x,t.y,a.z).applyMatrix4(e),o[6].set(a.x,a.y,t.z).applyMatrix4(e),o[7].set(a.x,a.y,a.z).applyMatrix4(e),this.setFromPoints(o)),this}},{key:\"translate\",value:function(e){return this.min.add(e),this.max.add(e),this}},{key:\"intersect\",value:function(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(e){return this.min.min(e.min),this.max.max(e.max),this}},{key:\"containsPoint\",value:function(e){var t=this.min,a=this.max;return e.x>=t.x&&e.y>=t.y&&e.z>=t.z&&e.x<=a.x&&e.y<=a.y&&e.z<=a.z}},{key:\"containsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,i=e.max;return t.x<=n.x&&i.x<=a.x&&t.y<=n.y&&i.y<=a.y&&t.z<=n.z&&i.z<=a.z}},{key:\"intersectsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,i=e.max;return i.x>=t.x&&i.y>=t.y&&i.z>=t.z&&n.x<=a.x&&n.y<=a.y&&n.z<=a.z}},{key:\"intersectsSphere\",value:function(e){var t=this.clampPoint(e.center,De);return t.distanceToSquared(e.center)<=e.radius*e.radius}},{key:\"intersectsPlane\",value:function(e){var t,a;return 0<e.normal.x?(t=e.normal.x*this.min.x,a=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,a=e.normal.x*this.min.x),0<e.normal.y?(t+=e.normal.y*this.min.y,a+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,a+=e.normal.y*this.min.y),0<e.normal.z?(t+=e.normal.z*this.min.z,a+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,a+=e.normal.z*this.min.z),t<=-e.constant&&a>=-e.constant}},{key:\"equals\",value:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}]),t}(),Fe=new v,qe=new Ee,Ae=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.center=a,this.radius=n}return n(t,[{key:\"set\",value:function(e,t){return this.center.copy(e),this.radius=t,this}},{key:\"copy\",value:function(e){return this.center.copy(e.center),this.radius=e.radius,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromPoints\",value:function(e){var t,a,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:Fe.setFromPoints(e).getCenter(this.center),o=0;for(t=0,a=e.length;t<a;++t)o=Ce(o,n.distanceToSquared(e[t]));return this.radius=Ie(o),this}},{key:\"setFromBox\",value:function(e){return e.getCenter(this.center),this.radius=.5*e.getSize(qe).length(),this}},{key:\"isEmpty\",value:function(){return 0>=this.radius}},{key:\"translate\",value:function(e){return this.center.add(e),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,a=this.center.distanceToSquared(e);return t.copy(e),a>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}},{key:\"distanceToPoint\",value:function(e){return e.distanceTo(this.center)-this.radius}},{key:\"containsPoint\",value:function(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}},{key:\"intersectsSphere\",value:function(e){var t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}},{key:\"intersectsBox\",value:function(e){return e.intersectsSphere(this)}},{key:\"intersectsPlane\",value:function(e){return Te(e.distanceToPoint(this.center))<=this.radius}},{key:\"equals\",value:function(e){return e.center.equals(this.center)&&e.radius===this.radius}}]),t}(),Ve=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.x=a,this.y=n}return n(t,[{key:\"set\",value:function(e,t){return this.x=e,this.y=t,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this}},{key:\"applyMatrix3\",value:function(t){var a=this.x,n=this.y,i=t.elements;return this.x=i[0]*a+i[3]*n+i[6],this.y=i[1]*a+i[4]*n+i[7],this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y}},{key:\"cross\",value:function(e){return this.x*e.y-this.y*e.x}},{key:\"manhattanLength\",value:function(){return Te(this.x)+Te(this.y)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y}},{key:\"length\",value:function(){return Ie(this.x*this.x+this.y*this.y)}},{key:\"manhattanDistanceTo\",value:function(e){return Te(this.x-e.x)+Te(this.y-e.y)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y;return t*t+a*a}},{key:\"distanceTo\",value:function(e){return Ie(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=Pe(this.x,e.x),this.y=Pe(this.y,e.y),this}},{key:\"max\",value:function(e){return this.x=Ce(this.x,e.x),this.y=Ce(this.y,e.y),this}},{key:\"clamp\",value:function(e,t){return this.x=Ce(e.x,Pe(t.x,this.x)),this.y=Ce(e.y,Pe(t.y,this.y)),this}},{key:\"floor\",value:function(){return this.x=Se(this.x),this.y=Se(this.y),this}},{key:\"ceil\",value:function(){return this.x=we(this.x),this.y=we(this.y),this}},{key:\"round\",value:function(){return this.x=ke(this.x),this.y=ke(this.y),this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this}},{key:\"angle\",value:function e(){var e=ge(this.y,this.x);return 0>e&&(e+=2*ve),e}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"rotateAround\",value:function(e,t){var a=ze(t),n=fe(t),i=this.x-e.x,l=this.y-e.y;return this.x=i*a-l*n+e.x,this.y=i*n+l*a+e.y,this}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y}},{key:\"width\",get:function(){return this.x},set:function(e){return this.x=e}},{key:\"height\",get:function(){return this.y},set:function(e){return this.y=e}}]),t}(),Be=new Ve,Ne=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ve(1/0,1/0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ve(-Infinity,-Infinity);e(this,t),this.min=a,this.max=n}return n(t,[{key:\"set\",value:function(e,t){return this.min.copy(e),this.max.copy(t),this}},{key:\"copy\",value:function(e){return this.min.copy(e.min),this.max.copy(e.max),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-Infinity,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ve;return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ve;return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}},{key:\"getBoundingSphere\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ae;return this.getCenter(e.center),e.radius=.5*this.getSize(Be).length(),e}},{key:\"expandByPoint\",value:function(e){return this.min.min(e),this.max.max(e),this}},{key:\"expandByVector\",value:function(e){return this.min.sub(e),this.max.add(e),this}},{key:\"expandByScalar\",value:function(e){return this.min.addScalar(-e),this.max.addScalar(e),this}},{key:\"setFromPoints\",value:function(e){var t,a;for(this.min.set(0,0),this.max.set(0,0),(t=0,a=e.length);t<a;++t)this.expandByPoint(e[t]);return this}},{key:\"setFromCenterAndSize\",value:function(e,t){var a=Be.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(a),this.max.copy(e).add(a),this}},{key:\"clampPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ve;return t.copy(e).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(e){var t=Be.copy(e).clamp(this.min,this.max);return t.sub(e).length()}},{key:\"translate\",value:function(e){return this.min.add(e),this.max.add(e),this}},{key:\"intersect\",value:function(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(e){return this.min.min(e.min),this.max.max(e.max),this}},{key:\"containsPoint\",value:function(e){var t=this.min,a=this.max;return e.x>=t.x&&e.y>=t.y&&e.x<=a.x&&e.y<=a.y}},{key:\"containsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,i=e.max;return t.x<=n.x&&i.x<=a.x&&t.y<=n.y&&i.y<=a.y}},{key:\"intersectsBox\",value:function(e){var t=this.min,a=this.max,n=e.min,i=e.max;return i.x>=t.x&&i.y>=t.y&&n.x<=a.x&&n.y<=a.y}},{key:\"equals\",value:function(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}]),t}(),Le=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.radius=a,this.theta=n,this.y=i}return n(t,[{key:\"set\",value:function(e,t,a){return this.radius=e,this.theta=t,this.y=a,this}},{key:\"copy\",value:function(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromVector3\",value:function(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}},{key:\"setFromCartesianCoords\",value:function(e,t,a){return this.radius=Ie(e*e+a*a),this.theta=ge(e,a),this.y=t,this}}]),t}(),Oe=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,0,1,0,0,0,1])}return n(t,[{key:\"set\",value:function(e,t,a,n,i,l,o,s,r){var y=this.elements;return y[0]=e,y[3]=t,y[6]=a,y[1]=n,y[4]=i,y[7]=l,y[2]=o,y[5]=s,y[8]=r,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,1,0,0,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements,a=this.elements;return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],this}},{key:\"clone\",value:function(){return new this.constructor().fromArray(this.elements)}},{key:\"fromArray\",value:function(e){var t,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(t=0;9>t;++t)n[t]=e[t+a];return this}},{key:\"toArray\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(e=0;9>e;++e)t[e+a]=n[e];return t}},{key:\"multiplyMatrices\",value:function(e,t){var a=e.elements,n=t.elements,i=this.elements,l=a[0],o=a[3],s=a[6],r=a[1],y=a[4],d=a[7],u=a[2],c=a[5],m=a[8],x=n[0],p=n[3],v=n[6],g=n[1],k=n[4],h=n[7],z=n[2],f=n[5],S=n[8];return i[0]=l*x+o*g+s*z,i[3]=l*p+o*k+s*f,i[6]=l*v+o*h+s*S,i[1]=r*x+y*g+d*z,i[4]=r*p+y*k+d*f,i[7]=r*v+y*h+d*S,i[2]=u*x+c*g+m*z,i[5]=u*p+c*k+m*f,i[8]=u*v+c*h+m*S,this}},{key:\"multiply\",value:function(e){return this.multiplyMatrices(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyMatrices(e,this)}},{key:\"multiplyScalar\",value:function(e){var t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}},{key:\"determinant\",value:function(){var t=this.elements,n=t[0],a=t[1],l=t[2],o=t[3],s=t[4],e=t[5],r=t[6],y=t[7],d=t[8];return n*s*d-n*e*y-a*o*d+a*e*r+l*o*y-l*s*r}},{key:\"getInverse\",value:function(e){var t,a=e.elements,n=this.elements,i=a[0],l=a[1],o=a[2],s=a[3],r=a[4],y=a[5],d=a[6],u=a[7],c=a[8],m=c*r-y*u,x=y*d-c*s,p=u*s-r*d,v=i*m+l*x+o*p;return 0===v?(console.error(\"Can't invert matrix, determinant is zero\",e),this.identity()):(t=1/v,n[0]=m*t,n[1]=(o*u-c*l)*t,n[2]=(y*l-o*r)*t,n[3]=x*t,n[4]=(c*i-o*d)*t,n[5]=(o*s-y*i)*t,n[6]=p*t,n[7]=(l*d-u*i)*t,n[8]=(r*i-l*s)*t),this}},{key:\"transpose\",value:function(){var e,a=this.elements;return e=a[1],a[1]=a[3],a[3]=e,e=a[2],a[2]=a[6],a[6]=e,e=a[5],a[5]=a[7],a[7]=e,this}},{key:\"scale\",value:function(e,t){var a=this.elements;return a[0]*=e,a[3]*=e,a[6]*=e,a[1]*=t,a[4]*=t,a[7]*=t,this}},{key:\"rotate\",value:function(e){var t=ze(e),a=fe(e),n=this.elements,i=n[0],l=n[3],o=n[6],s=n[1],r=n[4],y=n[7];return n[0]=t*i+a*s,n[3]=t*l+a*r,n[6]=t*o+a*y,n[1]=-a*i+t*s,n[4]=-a*l+t*r,n[7]=-a*o+t*y,this}},{key:\"translate\",value:function(e,t){var a=this.elements;return a[0]+=e*a[2],a[3]+=e*a[5],a[6]+=e*a[8],a[1]+=t*a[2],a[4]+=t*a[5],a[7]+=t*a[8],this}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&9>t;++t)a[t]!==n[t]&&(l=!1);return l}}]),t}(),Me={XYZ:\"XYZ\",YZX:\"YZX\",ZXY:\"ZXY\",XZY:\"XZY\",YXZ:\"YXZ\",ZYX:\"ZYX\"},Re=function(){var a=Number.EPSILON;function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;e(this,t),this.x=a,this.y=n,this.z=i,this.w=l}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.w=n,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}},{key:\"setFromEuler\",value:function(e){var t=e.x,a=e.y,n=e.z,i=ze,l=fe,o=i(t/2),s=i(a/2),r=i(n/2),y=l(t/2),d=l(a/2),u=l(n/2);switch(e.order){case Me.XYZ:this.x=y*s*r+o*d*u,this.y=o*d*r-y*s*u,this.z=o*s*u+y*d*r,this.w=o*s*r-y*d*u;break;case Me.YXZ:this.x=y*s*r+o*d*u,this.y=o*d*r-y*s*u,this.z=o*s*u-y*d*r,this.w=o*s*r+y*d*u;break;case Me.ZXY:this.x=y*s*r-o*d*u,this.y=o*d*r+y*s*u,this.z=o*s*u+y*d*r,this.w=o*s*r-y*d*u;break;case Me.ZYX:this.x=y*s*r-o*d*u,this.y=o*d*r+y*s*u,this.z=o*s*u-y*d*r,this.w=o*s*r+y*d*u;break;case Me.YZX:this.x=y*s*r+o*d*u,this.y=o*d*r+y*s*u,this.z=o*s*u-y*d*r,this.w=o*s*r-y*d*u;break;case Me.XZY:this.x=y*s*r-o*d*u,this.y=o*d*r-y*s*u,this.z=o*s*u+y*d*r,this.w=o*s*r+y*d*u;}return this}},{key:\"setFromAxisAngle\",value:function(e,t){var a=t/2,n=fe(a);return this.x=e.x*n,this.y=e.y*n,this.z=e.z*n,this.w=ze(a),this}},{key:\"setFromRotationMatrix\",value:function(e){var t,a=e.elements,n=a[0],i=a[4],l=a[8],o=a[1],r=a[5],y=a[9],d=a[2],u=a[6],c=a[10],m=n+r+c;return 0<m?(t=.5/Ie(m+1),this.w=.25/t,this.x=(u-y)*t,this.y=(l-d)*t,this.z=(o-i)*t):n>r&&n>c?(t=2*Ie(1+n-r-c),this.w=(u-y)/t,this.x=.25*t,this.y=(i+o)/t,this.z=(l+d)/t):r>c?(t=2*Ie(1+r-n-c),this.w=(l-d)/t,this.x=(i+o)/t,this.y=.25*t,this.z=(y+u)/t):(t=2*Ie(1+c-n-r),this.w=(o-i)/t,this.x=(l+d)/t,this.y=(y+u)/t,this.z=.25*t),this}},{key:\"setFromUnitVectors\",value:function(e,t){var a=e.dot(t)+1;return 1e-6>a?(a=0,Te(e.x)>Te(e.z)?(this.x=-e.y,this.y=e.x,this.z=0,this.w=a):(this.x=0,this.y=-e.z,this.z=e.y,this.w=a)):(this.x=e.y*t.z-e.z*t.y,this.y=e.z*t.x-e.x*t.z,this.z=e.x*t.y-e.y*t.x,this.w=a),this.normalize()}},{key:\"angleTo\",value:function(e){return 2*he(Te(Pe(Ce(this.dot(e),-1),1)))}},{key:\"rotateTowards\",value:function(e,t){var a=this.angleTo(e);return 0!==a&&this.slerp(e,Pe(1,t/a)),this}},{key:\"invert\",value:function(){return this.conjugate()}},{key:\"conjugate\",value:function(){return this.x*=-1,this.y*=-1,this.z*=-1,this}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return Ie(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"normalize\",value:function(){var e,t=this.length();return 0===t?(this.x=0,this.y=0,this.z=0,this.w=1):(e=1/t,this.x*=e,this.y*=e,this.z*=e,this.w*=e),this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}},{key:\"multiplyQuaternions\",value:function(e,t){var a=e.x,n=e.y,i=e.z,l=e.w,o=t.x,s=t.y,r=t.z,y=t.w;return this.x=a*y+l*o+n*r-i*s,this.y=n*y+l*s+i*o-a*r,this.z=i*y+l*r+a*s-n*o,this.w=l*y-a*o-n*s-i*r,this}},{key:\"multiply\",value:function(e){return this.multiplyQuaternions(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyQuaternions(e,this)}},{key:\"slerp\",value:function(e,n){var t,i,l,o,r,d,u,c=this.x,m=this.y,y=this.z,x=this.w;return 1===n?this.copy(e):0<n&&(t=x*e.w+c*e.x+m*e.y+y*e.z,0>t?(this.w=-e.w,this.x=-e.x,this.y=-e.y,this.z=-e.z,t=-t):this.copy(e),1<=t?(this.w=x,this.x=c,this.y=m,this.z=y):(i=1-t*t,r=1-n,i<=a?(this.w=r*x+n*this.w,this.x=r*c+n*this.x,this.y=r*m+n*this.y,this.z=r*y+n*this.z,this.normalize()):(l=Ie(i),o=ge(l,t),d=fe(r*o)/l,u=fe(n*o)/l,this.w=x*d+this.w*u,this.x=c*d+this.x*u,this.y=m*d+this.y*u,this.z=y*d+this.z*u))),this}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}}],[{key:\"slerp\",value:function(e,a,n,i){return n.copy(e).slerp(a,i)}},{key:\"slerpFlat\",value:function(e,n,i,l,o,r,y){var d,u,c,m,x,p,v,g,k=o[r],h=o[r+1],z=o[r+2],S=o[r+3],w=i[l],T=i[l+1],I=i[l+2],C=i[l+3];(C!==S||w!==k||T!==h||I!==z)&&(d=1-y,m=w*k+T*h+I*z+C*S,p=0<=m?1:-1,x=1-m*m,x>a&&(c=Ie(x),v=ge(c,m*p),d=fe(d*v)/c,y=fe(y*v)/c),g=y*p,w=w*d+k*g,T=T*d+h*g,I=I*d+z*g,C=C*d+S*g,d===1-y&&(u=1/Ie(w*w+T*T+I*I+C*C),w*=u,T*=u,I*=u,C*=u)),e[n]=w,e[n+1]=T,e[n+2]=I,e[n+3]=C}}]),t}(),Ye=new Oe,m=new Re,q=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.x=a,this.y=n,this.z=i,this.order=t.defaultOrder}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.order=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.order=t.order,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.order)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.order=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.order,e}},{key:\"toVector3\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return e.set(this.x,this.y,this.z)}},{key:\"setFromRotationMatrix\",value:function(e){var t=Math.asin,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.order,n=e.elements,i=n[0],l=n[4],o=n[8],s=n[1],r=n[5],y=n[9],d=n[2],u=n[6],c=n[10],m=1-1e-5;switch(a){case Me.XYZ:{this.y=t(P(o,-1,1)),Te(o)<m?(this.x=ge(-y,c),this.z=ge(-l,i)):(this.x=ge(u,r),this.z=0);break}case Me.YXZ:{this.x=t(-P(y,-1,1)),Te(y)<m?(this.y=ge(o,c),this.z=ge(s,r)):(this.y=ge(-d,i),this.z=0);break}case Me.ZXY:{this.x=t(P(u,-1,1)),Te(u)<m?(this.y=ge(-d,c),this.z=ge(-l,r)):(this.y=0,this.z=ge(s,i));break}case Me.ZYX:{this.y=t(-P(d,-1,1)),Te(d)<m?(this.x=ge(u,c),this.z=ge(s,i)):(this.x=0,this.z=ge(-l,r));break}case Me.YZX:{this.z=t(P(s,-1,1)),Te(s)<m?(this.x=ge(-y,r),this.y=ge(-d,i)):(this.x=0,this.y=ge(o,c));break}case Me.XZY:{this.z=t(-P(l,-1,1)),Te(l)<m?(this.x=ge(u,r),this.y=ge(o,i)):(this.x=ge(-y,c),this.y=0);break}}return this.order=a,this}},{key:\"setFromQuaternion\",value:function(e,t){return Ye.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ye,t)}},{key:\"setFromVector3\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:this.order;return this.set(e.x,e.y,e.z,t)}},{key:\"reorder\",value:function(e){return m.setFromEuler(this),this.setFromQuaternion(m,e)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.order===this.order}}],[{key:\"defaultOrder\",get:function(){return Me.XYZ}}]),t}(),Xe=new Ee,a=new Ee,b=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee(1,0,0),n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.normal=a,this.constant=n}return n(t,[{key:\"set\",value:function(e,t){return this.normal.copy(e),this.constant=t,this}},{key:\"setComponents\",value:function(e,t,a,n){return this.normal.set(e,t,a),this.constant=n,this}},{key:\"copy\",value:function(e){return this.normal.copy(e.normal),this.constant=e.constant,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"setFromNormalAndCoplanarPoint\",value:function(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}},{key:\"setFromCoplanarPoints\",value:function(e,t,n){var i=Xe.subVectors(n,t).cross(a.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,Xe),this}},{key:\"normalize\",value:function(){var e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}},{key:\"negate\",value:function(){return this.normal.negate(),this.constant=-this.constant,this}},{key:\"distanceToPoint\",value:function(e){return this.normal.dot(e)+this.constant}},{key:\"distanceToSphere\",value:function(e){return this.distanceToPoint(e.center)-e.radius}},{key:\"projectPoint\",value:function(e,t){return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(e)).add(e)}},{key:\"coplanarPoint\",value:function(e){return e.copy(this.normal).multiplyScalar(-this.constant)}},{key:\"translate\",value:function(e){return this.constant-=e.dot(this.normal),this}},{key:\"intersectLine\",value:function(e,a){var n=e.delta(Xe),i=this.normal.dot(n);if(0===i)0===this.distanceToPoint(e.start)&&a.copy(e.start);else{var l=-(e.start.dot(this.normal)+this.constant)/i;0<=l&&1>=l&&a.copy(n).multiplyScalar(l).add(e.start)}return a}},{key:\"intersectsLine\",value:function(e){var t=this.distanceToPoint(e.start),a=this.distanceToPoint(e.end);return 0>t&&0<a||0>a&&0<t}},{key:\"intersectsBox\",value:function(e){return e.intersectsPlane(this)}},{key:\"intersectsSphere\",value:function(e){return e.intersectsPlane(this)}},{key:\"equals\",value:function(e){return e.normal.equals(this.normal)&&e.constant===this.constant}}]),t}(),Ze=new Ee,_e=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new b,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new b,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:new b,l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:new b,o=4<arguments.length&&void 0!==arguments[4]?arguments[4]:new b,s=5<arguments.length&&void 0!==arguments[5]?arguments[5]:new b;e(this,t),this.planes=[a,n,i,l,o,s]}return n(t,[{key:\"set\",value:function(e,t,a,n,i,l){var o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(a),o[3].copy(n),o[4].copy(i),o[5].copy(l),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"copy\",value:function(e){var t,a=this.planes;for(t=0;6>t;++t)a[t].copy(e.planes[t]);return this}},{key:\"setFromMatrix\",value:function(e){var t=this.planes,a=e.elements,n=a[0],i=a[1],l=a[2],o=a[3],s=a[4],r=a[5],y=a[6],d=a[7],u=a[8],c=a[9],m=a[10],x=a[11],p=a[12],v=a[13],g=a[14],k=a[15];return t[0].setComponents(o-n,d-s,x-u,k-p).normalize(),t[1].setComponents(o+n,d+s,x+u,k+p).normalize(),t[2].setComponents(o+i,d+r,x+c,k+v).normalize(),t[3].setComponents(o-i,d-r,x-c,k-v).normalize(),t[4].setComponents(o-l,d-y,x-m,k-g).normalize(),t[5].setComponents(o+l,d+y,x+m,k+g).normalize(),this}},{key:\"intersectsSphere\",value:function(e){var t,a,n=this.planes,l=e.center,o=-e.radius,s=!0;for(t=0;6>t;++t)if(a=n[t].distanceToPoint(l),a<o){s=!1;break}return s}},{key:\"intersectsBox\",value:function(e){var t,a,n=this.planes,l=e.min,o=e.max;for(t=0;6>t;++t)if(a=n[t],Ze.x=0<a.normal.x?o.x:l.x,Ze.y=0<a.normal.y?o.y:l.y,Ze.z=0<a.normal.z?o.z:l.z,0>a.distanceToPoint(Ze))return!1;return!0}},{key:\"containsPoint\",value:function(e){var t,a=this.planes,n=!0;for(t=0;6>t;++t)if(0>a[t].distanceToPoint(e)){n=!1;break}return n}}]),t}(),je=new Ee,Ue=new Ee,Qe=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;e(this,t),this.start=a,this.end=n}return n(t,[{key:\"set\",value:function(e,t){return this.start.copy(e),this.end.copy(t),this}},{key:\"copy\",value:function(e){return this.start.copy(e.start),this.end.copy(e.end),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"getCenter\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return e.addVectors(this.start,this.end).multiplyScalar(.5)}},{key:\"delta\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return e.subVectors(this.end,this.start)}},{key:\"lengthSquared\",value:function(){return this.start.distanceToSquared(this.end)}},{key:\"length\",value:function(){return this.start.distanceTo(this.end)}},{key:\"at\",value:function(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}},{key:\"closestPointToPointParameter\",value:function(e,a){je.subVectors(e,this.start),Ue.subVectors(this.end,this.start);var n=Ue.dot(Ue),i=Ue.dot(je),l=a?Pe(Ce(i/n,0),1):i/n;return l}},{key:\"closestPointToPoint\",value:function(e){var a=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:new Ee,i=this.closestPointToPointParameter(e,a);return this.delta(n).multiplyScalar(i).add(this.start)}},{key:\"equals\",value:function(e){return e.start.equals(this.start)&&e.end.equals(this.end)}}]),t}(),Ge=new Ee,He=new Ee,Je=new Ee,c=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return n(t,[{key:\"set\",value:function(e,t,a,n,i,l,o,s,r,y,d,u,c,m,x,p){var v=this.elements;return v[0]=e,v[4]=t,v[8]=a,v[12]=n,v[1]=i,v[5]=l,v[9]=o,v[13]=s,v[2]=r,v[6]=y,v[10]=d,v[14]=u,v[3]=c,v[7]=m,v[11]=x,v[15]=p,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements,a=this.elements;return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a[4]=t[4],a[5]=t[5],a[6]=t[6],a[7]=t[7],a[8]=t[8],a[9]=t[9],a[10]=t[10],a[11]=t[11],a[12]=t[12],a[13]=t[13],a[14]=t[14],a[15]=t[15],this}},{key:\"clone\",value:function(){return new this.constructor().fromArray(this.elements)}},{key:\"fromArray\",value:function(e){var t,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(t=0;16>t;++t)n[t]=e[t+a];return this}},{key:\"toArray\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,n=this.elements;for(e=0;16>e;++e)t[e+a]=n[e];return t}},{key:\"getMaxScaleOnAxis\",value:function(){var e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],a=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Ie(Ce(t,a,n))}},{key:\"copyPosition\",value:function(e){var t=this.elements,a=e.elements;return t[12]=a[12],t[13]=a[13],t[14]=a[14],this}},{key:\"setPosition\",value:function(e){var t=this.elements;return t[12]=e.x,t[13]=e.y,t[14]=e.z,this}},{key:\"extractBasis\",value:function(e,t,a){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),a.setFromMatrixColumn(this,2),this}},{key:\"makeBasis\",value:function(e,t,a){return this.set(e.x,t.x,a.x,0,e.y,t.y,a.y,0,e.z,t.z,a.z,0,0,0,0,1),this}},{key:\"extractRotation\",value:function(e){var t=this.elements,a=e.elements,n=1/Ge.setFromMatrixColumn(e,0).length(),i=1/Ge.setFromMatrixColumn(e,1).length(),l=1/Ge.setFromMatrixColumn(e,2).length();return t[0]=a[0]*n,t[1]=a[1]*n,t[2]=a[2]*n,t[3]=0,t[4]=a[4]*i,t[5]=a[5]*i,t[6]=a[6]*i,t[7]=0,t[8]=a[8]*l,t[9]=a[9]*l,t[10]=a[10]*l,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}},{key:\"makeRotationFromEuler\",value:function(t){var n,i,l,o,s,r,u,m,p,v,g,k,h=this.elements,S=t.x,x=t.y,y=t.z,z=ze(S),a=fe(S),w=ze(x),c=fe(x),d=ze(y),e=fe(y);switch(t.order){case Me.XYZ:{n=z*d,i=z*e,l=a*d,o=a*e,h[0]=w*d,h[4]=-w*e,h[8]=c,h[1]=i+l*c,h[5]=n-o*c,h[9]=-a*w,h[2]=o-n*c,h[6]=l+i*c,h[10]=z*w;break}case Me.YXZ:{s=w*d,r=w*e,u=c*d,m=c*e,h[0]=s+m*a,h[4]=u*a-r,h[8]=z*c,h[1]=z*e,h[5]=z*d,h[9]=-a,h[2]=r*a-u,h[6]=m+s*a,h[10]=z*w;break}case Me.ZXY:{s=w*d,r=w*e,u=c*d,m=c*e,h[0]=s-m*a,h[4]=-z*e,h[8]=u+r*a,h[1]=r+u*a,h[5]=z*d,h[9]=m-s*a,h[2]=-z*c,h[6]=a,h[10]=z*w;break}case Me.ZYX:{n=z*d,i=z*e,l=a*d,o=a*e,h[0]=w*d,h[4]=l*c-i,h[8]=n*c+o,h[1]=w*e,h[5]=o*c+n,h[9]=i*c-l,h[2]=-c,h[6]=a*w,h[10]=z*w;break}case Me.YZX:{p=z*w,v=z*c,g=a*w,k=a*c,h[0]=w*d,h[4]=k-p*e,h[8]=g*e+v,h[1]=e,h[5]=z*d,h[9]=-a*d,h[2]=-c*d,h[6]=v*e+g,h[10]=p-k*e;break}case Me.XZY:{p=z*w,v=z*c,g=a*w,k=a*c,h[0]=w*d,h[4]=-e,h[8]=c*d,h[1]=p*e+k,h[5]=z*d,h[9]=v*e-g,h[2]=g*e-v,h[6]=a*d,h[10]=k*e+p;break}}return h[3]=0,h[7]=0,h[11]=0,h[12]=0,h[13]=0,h[14]=0,h[15]=1,this}},{key:\"makeRotationFromQuaternion\",value:function(e){return this.compose(Ge.set(0,0,0),e,He.set(1,1,1))}},{key:\"lookAt\",value:function(e,t,a){var n=this.elements,i=Ge,l=He,o=Je;return o.subVectors(e,t),0===o.lengthSquared()&&(o.z=1),o.normalize(),i.crossVectors(a,o),0===i.lengthSquared()&&(1===Te(a.z)?o.x+=1e-4:o.z+=1e-4,o.normalize(),i.crossVectors(a,o)),i.normalize(),l.crossVectors(o,i),n[0]=i.x,n[4]=l.x,n[8]=o.x,n[1]=i.y,n[5]=l.y,n[9]=o.y,n[2]=i.z,n[6]=l.z,n[10]=o.z,this}},{key:\"multiplyMatrices\",value:function(e,t){var a=this.elements,n=e.elements,i=t.elements,l=n[0],o=n[4],s=n[8],r=n[12],y=n[1],d=n[5],u=n[9],c=n[13],m=n[2],x=n[6],p=n[10],v=n[14],g=n[3],k=n[7],h=n[11],z=n[15],f=i[0],S=i[4],w=i[8],T=i[12],I=i[1],C=i[5],P=i[9],b=i[13],E=i[2],D=i[6],F=i[10],q=i[14],A=i[3],V=i[7],B=i[11],N=i[15];return a[0]=l*f+o*I+s*E+r*A,a[4]=l*S+o*C+s*D+r*V,a[8]=l*w+o*P+s*F+r*B,a[12]=l*T+o*b+s*q+r*N,a[1]=y*f+d*I+u*E+c*A,a[5]=y*S+d*C+u*D+c*V,a[9]=y*w+d*P+u*F+c*B,a[13]=y*T+d*b+u*q+c*N,a[2]=m*f+x*I+p*E+v*A,a[6]=m*S+x*C+p*D+v*V,a[10]=m*w+x*P+p*F+v*B,a[14]=m*T+x*b+p*q+v*N,a[3]=g*f+k*I+h*E+z*A,a[7]=g*S+k*C+h*D+z*V,a[11]=g*w+k*P+h*F+z*B,a[15]=g*T+k*b+h*q+z*N,this}},{key:\"multiply\",value:function(e){return this.multiplyMatrices(this,e)}},{key:\"premultiply\",value:function(e){return this.multiplyMatrices(e,this)}},{key:\"multiplyScalar\",value:function(e){var t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}},{key:\"determinant\",value:function(){var e=this.elements,t=e[0],a=e[4],n=e[8],i=e[12],l=e[1],o=e[5],s=e[9],r=e[13],y=e[2],d=e[6],u=e[10],c=e[14],m=e[3],x=e[7],p=e[11],v=e[15],g=t*o,k=t*s,h=t*r,z=a*l,f=a*s,S=a*r,w=n*l,T=n*o,I=n*r,C=i*l,P=i*o,b=i*s;return m*(b*d-I*d-P*u+S*u+T*c-f*c)+x*(k*c-h*u+C*u-w*c+I*y-b*y)+p*(h*d-g*c-C*d+z*c+P*y-S*y)+v*(-T*y-k*d+g*u+w*d-z*u+f*y)}},{key:\"getInverse\",value:function(e){var t,a=this.elements,n=e.elements,i=n[0],l=n[1],o=n[2],s=n[3],r=n[4],y=n[5],d=n[6],u=n[7],c=n[8],m=n[9],x=n[10],p=n[11],v=n[12],g=n[13],k=n[14],h=n[15],z=m*k*u-g*x*u+g*d*p-y*k*p-m*d*h+y*x*h,f=v*x*u-c*k*u-v*d*p+r*k*p+c*d*h-r*x*h,S=c*g*u-v*m*u+v*y*p-r*g*p-c*y*h+r*m*h,w=v*m*d-c*g*d-v*y*x+r*g*x+c*y*k-r*m*k,T=i*z+l*f+o*S+s*w;return 0===T?(console.error(\"Can't invert matrix, determinant is zero\",e),this.identity()):(t=1/T,a[0]=z*t,a[1]=(g*x*s-m*k*s-g*o*p+l*k*p+m*o*h-l*x*h)*t,a[2]=(y*k*s-g*d*s+g*o*u-l*k*u-y*o*h+l*d*h)*t,a[3]=(m*d*s-y*x*s-m*o*u+l*x*u+y*o*p-l*d*p)*t,a[4]=f*t,a[5]=(c*k*s-v*x*s+v*o*p-i*k*p-c*o*h+i*x*h)*t,a[6]=(v*d*s-r*k*s-v*o*u+i*k*u+r*o*h-i*d*h)*t,a[7]=(r*x*s-c*d*s+c*o*u-i*x*u-r*o*p+i*d*p)*t,a[8]=S*t,a[9]=(v*m*s-c*g*s-v*l*p+i*g*p+c*l*h-i*m*h)*t,a[10]=(r*g*s-v*y*s+v*l*u-i*g*u-r*l*h+i*y*h)*t,a[11]=(c*y*s-r*m*s-c*l*u+i*m*u+r*l*p-i*y*p)*t,a[12]=w*t,a[13]=(c*g*o-v*m*o+v*l*x-i*g*x-c*l*k+i*m*k)*t,a[14]=(v*y*o-r*g*o-v*l*d+i*g*d+r*l*k-i*y*k)*t,a[15]=(r*m*o-c*y*o+c*l*d-i*m*d-r*l*x+i*y*x)*t),this}},{key:\"transpose\",value:function(){var e,a=this.elements;return e=a[1],a[1]=a[4],a[4]=e,e=a[2],a[2]=a[8],a[8]=e,e=a[6],a[6]=a[9],a[9]=e,e=a[3],a[3]=a[12],a[12]=e,e=a[7],a[7]=a[13],a[13]=e,e=a[11],a[11]=a[14],a[14]=e,this}},{key:\"scale\",value:function(e,t,a){var n=this.elements;return n[0]*=e,n[4]*=t,n[8]*=a,n[1]*=e,n[5]*=t,n[9]*=a,n[2]*=e,n[6]*=t,n[10]*=a,n[3]*=e,n[7]*=t,n[11]*=a,this}},{key:\"makeScale\",value:function(e,t,a){return this.set(e,0,0,0,0,t,0,0,0,0,a,0,0,0,0,1),this}},{key:\"makeTranslation\",value:function(e,t,a){return this.set(1,0,0,e,0,1,0,t,0,0,1,a,0,0,0,1),this}},{key:\"makeRotationX\",value:function(e){var t=ze(e),a=fe(e);return this.set(1,0,0,0,0,t,-a,0,0,a,t,0,0,0,0,1),this}},{key:\"makeRotationY\",value:function(e){var t=ze(e),a=fe(e);return this.set(t,0,a,0,0,1,0,0,-a,0,t,0,0,0,0,1),this}},{key:\"makeRotationZ\",value:function(e){var t=ze(e),a=fe(e);return this.set(t,-a,0,0,a,t,0,0,0,0,1,0,0,0,0,1),this}},{key:\"makeRotationAxis\",value:function(e,a){var n=ze(a),i=fe(a),l=1-n,t=e.x,o=e.y,s=e.z,r=l*t,y=l*o;return this.set(r*t+n,r*o-i*s,r*s+i*o,0,r*o+i*s,y*o+n,y*s-i*t,0,r*s-i*o,y*s+i*t,l*s*s+n,0,0,0,0,1),this}},{key:\"makeShear\",value:function(e,t,a){return this.set(1,t,a,0,e,1,a,0,e,t,1,0,0,0,0,1),this}},{key:\"compose\",value:function(e,t,a){var n=this.elements,i=t.x,l=t.y,o=t.z,s=t.w,r=i+i,y=l+l,d=o+o,u=i*r,c=i*y,m=i*d,x=l*y,p=l*d,v=o*d,g=s*r,k=s*y,h=s*d,z=a.x,f=a.y,S=a.z;return n[0]=(1-(x+v))*z,n[1]=(c+h)*z,n[2]=(m-k)*z,n[3]=0,n[4]=(c-h)*f,n[5]=(1-(u+v))*f,n[6]=(p+g)*f,n[7]=0,n[8]=(m+k)*S,n[9]=(p-g)*S,n[10]=(1-(u+x))*S,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}},{key:\"decompose\",value:function(e,t,a){var n=this.elements,i=n[0],l=n[1],o=n[2],s=n[4],r=n[5],y=n[6],d=n[8],u=n[9],c=n[10],m=this.determinant(),x=Ge.set(i,l,o).length()*(0>m?-1:1),p=Ge.set(s,r,y).length(),v=Ge.set(d,u,c).length(),g=1/x,k=1/p,h=1/v;return e.x=n[12],e.y=n[13],e.z=n[14],n[0]*=g,n[1]*=g,n[2]*=g,n[4]*=k,n[5]*=k,n[6]*=k,n[8]*=h,n[9]*=h,n[10]*=h,t.setFromRotationMatrix(this),n[0]=i,n[1]=l,n[2]=o,n[4]=s,n[5]=r,n[6]=y,n[8]=d,n[9]=u,n[10]=c,a.x=x,a.y=p,a.z=v,this}},{key:\"makePerspective\",value:function(e,t,a,n,i,l){var o=this.elements;return o[0]=2*i/(t-e),o[4]=0,o[8]=(t+e)/(t-e),o[12]=0,o[1]=0,o[5]=2*i/(a-n),o[9]=(a+n)/(a-n),o[13]=0,o[2]=0,o[6]=0,o[10]=-(l+i)/(l-i),o[14]=-2*l*i/(l-i),o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}},{key:\"makeOrthographic\",value:function(e,t,a,n,i,l){var o=this.elements,s=1/(t-e),r=1/(a-n),y=1/(l-i);return o[0]=2*s,o[4]=0,o[8]=0,o[12]=-((t+e)*s),o[1]=0,o[5]=2*r,o[9]=0,o[13]=-((a+n)*r),o[2]=0,o[6]=0,o[10]=-2*y,o[14]=-((l+i)*y),o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&16>t;++t)a[t]!==n[t]&&(l=!1);return l}}]),t}(),Ke=[new Ee,new Ee,new Ee,new Ee],We=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;e(this,t),this.origin=a,this.direction=n}return n(t,[{key:\"set\",value:function(e,t){return this.origin.copy(e),this.direction.copy(t),this}},{key:\"copy\",value:function(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"at\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;return t.copy(this.direction).multiplyScalar(e).add(this.origin)}},{key:\"lookAt\",value:function(e){return this.direction.copy(e).sub(this.origin).normalize(),this}},{key:\"recast\",value:function(e){return this.origin.copy(this.at(e,Ke[0])),this}},{key:\"closestPointToPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,a=t.subVectors(e,this.origin).dot(this.direction);return 0<=a?t.copy(this.direction).multiplyScalar(a).add(this.origin):t.copy(this.origin)}},{key:\"distanceSquaredToPoint\",value:function(e){var t=Ke[0].subVectors(e,this.origin).dot(this.direction);return 0>t?this.origin.distanceToSquared(e):Ke[0].copy(this.direction).multiplyScalar(t).add(this.origin).distanceToSquared(e)}},{key:\"distanceToPoint\",value:function(e){return Ie(this.distanceSquaredToPoint(e))}},{key:\"distanceToPlane\",value:function(e){var a=e.normal.dot(this.direction),n=0===a?0===e.distanceToPoint(this.origin)?0:-1:-(this.origin.dot(e.normal)+e.constant)/a;return 0<=n?n:null}},{key:\"distanceSquaredToSegment\",value:function(e,t,a,n){var i,l,o,s,r,y=Ke[0].copy(e).add(t).multiplyScalar(.5),d=Ke[1].copy(t).sub(e).normalize(),u=Ke[2].copy(this.origin).sub(y),m=.5*e.distanceTo(t),x=-this.direction.dot(d),p=u.dot(this.direction),v=-u.dot(d),g=u.lengthSq(),c=Te(1-x*x);return 0<c?(i=x*v-p,l=x*p-v,o=m*c,0<=i?l>=-o?l<=o?(s=1/c,i*=s,l*=s,r=i*(i+x*l+2*p)+l*(x*i+l+2*v)+g):(l=m,i=Ce(0,-(x*l+p)),r=-i*i+l*(l+2*v)+g):(l=-m,i=Ce(0,-(x*l+p)),r=-i*i+l*(l+2*v)+g):l<=-o?(i=Ce(0,-(-x*m+p)),l=0<i?-m:Pe(Ce(-m,-v),m),r=-i*i+l*(l+2*v)+g):l<=o?(i=0,l=Pe(Ce(-m,-v),m),r=l*(l+2*v)+g):(i=Ce(0,-(x*m+p)),l=0<i?m:Pe(Ce(-m,-v),m),r=-i*i+l*(l+2*v)+g)):(l=0<x?-m:m,i=Ce(0,-(x*l+p)),r=-i*i+l*(l+2*v)+g),void 0!==a&&a.copy(this.direction).multiplyScalar(i).add(this.origin),void 0!==n&&n.copy(d).multiplyScalar(l).add(y),r}},{key:\"intersectSphere\",value:function(e){var t,a,n,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,l=Ke[0].subVectors(e.center,this.origin),o=l.dot(this.direction),s=l.dot(l)-o*o,r=e.radius*e.radius,y=null;return s<=r&&(t=Ie(r-s),a=o-t,n=o+t,(0<=a||0<=n)&&(y=0>a?this.at(n,i):this.at(a,i))),y}},{key:\"intersectsSphere\",value:function(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}},{key:\"intersectPlane\",value:function(e){var a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,n=this.distanceToPlane(e);return null===n?null:this.at(n,a)}},{key:\"intersectsPlane\",value:function(e){var t=e.distanceToPoint(this.origin);return 0===t||0>e.normal.dot(this.direction)*t}},{key:\"intersectBox\",value:function(e){var t,a,n,i,l,o,s=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,r=this.origin,y=this.direction,d=e.min,u=e.max,c=1/y.x,m=1/y.y,x=1/y.z,p=null;return 0<=c?(t=(d.x-r.x)*c,a=(u.x-r.x)*c):(t=(u.x-r.x)*c,a=(d.x-r.x)*c),0<=m?(n=(d.y-r.y)*m,i=(u.y-r.y)*m):(n=(u.y-r.y)*m,i=(d.y-r.y)*m),t<=i&&n<=a&&((n>t||t!==t)&&(t=n),(i<a||a!==a)&&(a=i),0<=x?(l=(d.z-r.z)*x,o=(u.z-r.z)*x):(l=(u.z-r.z)*x,o=(d.z-r.z)*x),t<=o&&l<=a&&((l>t||t!==t)&&(t=l),(o<a||a!==a)&&(a=o),0<=a&&(p=this.at(0<=t?t:a,s)))),p}},{key:\"intersectsBox\",value:function(e){return null!==this.intersectBox(e,Ke[0])}},{key:\"intersectTriangle\",value:function(e,t,a,n,i){var l,o,s,r,y,d=this.direction,u=Ke[0],c=Ke[1],m=Ke[2],x=Ke[3],p=null;return c.subVectors(t,e),m.subVectors(a,e),x.crossVectors(c,m),l=d.dot(x),0===l||n&&0<l||(0<l?o=1:(o=-1,l=-l),u.subVectors(this.origin,e),s=o*d.dot(m.crossVectors(u,m)),0<=s&&(r=o*d.dot(c.cross(u)),0<=r&&s+r<=l&&(y=-o*u.dot(x),0<=y&&(p=this.at(y/l,i))))),p}},{key:\"applyMatrix4\",value:function(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}},{key:\"equals\",value:function(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}}]),t}(),$e=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:1,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;e(this,t),this.radius=a,this.phi=n,this.theta=i}return n(t,[{key:\"set\",value:function(e,t,a){return this.radius=e,this.phi=t,this.theta=a,this}},{key:\"copy\",value:function(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"makeSafe\",value:function(){return this.phi=Ce(1e-6,Pe(ve-1e-6,this.phi)),this}},{key:\"setFromVector3\",value:function(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}},{key:\"setFromCartesianCoords\",value:function(e,t,a){return this.radius=Ie(e*e+t*t+a*a),0===this.radius?(this.theta=0,this.phi=0):(this.theta=ge(e,a),this.phi=he(Pe(Ce(t/this.radius,-1),1))),this}}]),t}(),et=function(){function t(){e(this,t),this.elements=new Float32Array([1,0,0,1,0,1])}return n(t,[{key:\"set\",value:function(t,a,n,i,l,o){var s=this.elements;return s[0]=t,s[1]=a,s[3]=i,s[2]=n,s[4]=l,s[5]=o,this}},{key:\"identity\",value:function(){return this.set(1,0,0,1,0,1),this}},{key:\"copy\",value:function(e){var t=e.elements;return this.set(t[0],t[1],t[2],t[3],t[4],t[5]),this}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}},{key:\"toMatrix3\",value:function(e){var t=e.elements;e.set(t[0],t[1],t[2],t[1],t[3],t[4],t[2],t[4],t[5])}},{key:\"add\",value:function(e){var t=this.elements,a=e.elements;return t[0]+=a[0],t[1]+=a[1],t[3]+=a[3],t[2]+=a[2],t[4]+=a[4],t[5]+=a[5],this}},{key:\"norm\",value:function(){var t=this.elements,e=t[1]*t[1],a=t[2]*t[2],n=t[4]*t[4];return Ie(t[0]*t[0]+e+a+e+t[3]*t[3]+n+a+n+t[5]*t[5])}},{key:\"off\",value:function(){var t=this.elements;return Ie(2*(t[1]*t[1]+t[2]*t[2]+t[4]*t[4]))}},{key:\"applyToVector3\",value:function(t){var a=t.x,n=t.y,i=t.z,l=this.elements;return t.x=l[0]*a+l[1]*n+l[2]*i,t.y=l[1]*a+l[3]*n+l[4]*i,t.z=l[2]*a+l[4]*n+l[5]*i,t}},{key:\"equals\",value:function(e){var t,a=this.elements,n=e.elements,l=!0;for(t=0;l&&6>t;++t)a[t]!==n[t]&&(l=!1);return l}}],[{key:\"calculateIndex\",value:function(e,t){return 3-(3-e)*(2-e)/2+t}}]),t}(),tt=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0;e(this,t),this.x=a,this.y=n,this.z=i,this.w=l}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.x=e,this.y=t,this.z=a,this.w=n,this}},{key:\"copy\",value:function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}},{key:\"toArray\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}},{key:\"setAxisAngleFromQuaternion\",value:function(e){this.w=2*he(e.w);var t=Ie(1-e.w*e.w);return 1e-4>t?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}},{key:\"setAxisAngleFromRotationMatrix\",value:function(e){var t,a,n,i,l,o,r,d,u,c,m,p=.01,v=.1,g=e.elements,k=g[0],h=g[4],f=g[8],S=g[1],w=g[5],T=g[9],I=g[2],C=g[6],P=g[10];return Te(h-S)<p&&Te(f-I)<p&&Te(T-C)<p?Te(h+S)<v&&Te(f+I)<v&&Te(T+C)<v&&Te(k+w+P-3)<v?this.set(1,0,0,0):(t=ve,l=(k+1)/2,o=(w+1)/2,r=(P+1)/2,d=(h+S)/4,u=(f+I)/4,c=(T+C)/4,l>o&&l>r?l<p?(a=0,n=.707106781,i=.707106781):(a=Ie(l),n=d/a,i=u/a):o>r?o<p?(a=.707106781,n=0,i=.707106781):(n=Ie(o),a=d/n,i=c/n):r<p?(a=.707106781,n=.707106781,i=0):(i=Ie(r),a=u/i,n=c/i),this.set(a,n,i,t)):(m=Ie((C-T)*(C-T)+(f-I)*(f-I)+(S-h)*(S-h)),.001>Te(m)&&(m=1),this.x=(C-T)/m,this.y=(f-I)/m,this.z=(S-h)/m,this.w=he((k+w+P-1)/2)),this}},{key:\"add\",value:function(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}},{key:\"addScalar\",value:function(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}},{key:\"addVectors\",value:function(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}},{key:\"addScaledVector\",value:function(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}},{key:\"sub\",value:function(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}},{key:\"subScalar\",value:function(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}},{key:\"subVectors\",value:function(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}},{key:\"multiply\",value:function(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}},{key:\"multiplyScalar\",value:function(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}},{key:\"multiplyVectors\",value:function(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this.w=e.w*t.w,this}},{key:\"divide\",value:function(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}},{key:\"divideScalar\",value:function(e){return this.x/=e,this.y/=e,this.z/=e,this.w/=e,this}},{key:\"applyMatrix4\",value:function(t){var a=this.x,n=this.y,i=this.z,l=this.w,o=t.elements;return this.x=o[0]*a+o[4]*n+o[8]*i+o[12]*l,this.y=o[1]*a+o[5]*n+o[9]*i+o[13]*l,this.z=o[2]*a+o[6]*n+o[10]*i+o[14]*l,this.w=o[3]*a+o[7]*n+o[11]*i+o[15]*l,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}},{key:\"dot\",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}},{key:\"manhattanLength\",value:function(){return Te(this.x)+Te(this.y)+Te(this.z)+Te(this.w)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return Ie(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"manhattanDistanceTo\",value:function(e){return Te(this.x-e.x)+Te(this.y-e.y)+Te(this.z-e.z)+Te(this.w-e.w)}},{key:\"distanceToSquared\",value:function(e){var t=this.x-e.x,a=this.y-e.y,n=this.z-e.z,i=this.w-e.w;return t*t+a*a+n*n+i*i}},{key:\"distanceTo\",value:function(e){return Ie(this.distanceToSquared(e))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(e){return this.normalize().multiplyScalar(e)}},{key:\"min\",value:function(e){return this.x=Pe(this.x,e.x),this.y=Pe(this.y,e.y),this.z=Pe(this.z,e.z),this.w=Pe(this.w,e.w),this}},{key:\"max\",value:function(e){return this.x=Ce(this.x,e.x),this.y=Ce(this.y,e.y),this.z=Ce(this.z,e.z),this.w=Ce(this.w,e.w),this}},{key:\"clamp\",value:function(e,t){return this.x=Ce(e.x,Pe(t.x,this.x)),this.y=Ce(e.y,Pe(t.y,this.y)),this.z=Ce(e.z,Pe(t.z,this.z)),this.w=Ce(e.w,Pe(t.w,this.w)),this}},{key:\"floor\",value:function(){return this.x=Se(this.x),this.y=Se(this.y),this.z=Se(this.z),this.w=Se(this.w),this}},{key:\"ceil\",value:function(){return this.x=we(this.x),this.y=we(this.y),this.z=we(this.z),this.w=we(this.w),this}},{key:\"round\",value:function(){return this.x=ke(this.x),this.y=ke(this.y),this.z=ke(this.z),this.w=ke(this.w),this}},{key:\"lerp\",value:function(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}},{key:\"lerpVectors\",value:function(e,t,a){return this.subVectors(t,e).multiplyScalar(a).add(e)}},{key:\"equals\",value:function(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}}]),t}(),at=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,n=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1];e(this,t),this.value=a,this.done=n}return n(t,[{key:\"reset\",value:function(){this.value=null,this.done=!1}}]),t}(),nt=[new Uint8Array([0,4]),new Uint8Array([1,5]),new Uint8Array([2,6]),new Uint8Array([3,7]),new Uint8Array([0,2]),new Uint8Array([1,3]),new Uint8Array([4,6]),new Uint8Array([5,7]),new Uint8Array([0,1]),new Uint8Array([2,3]),new Uint8Array([4,5]),new Uint8Array([6,7])],it=[new Uint8Array([0,0,0]),new Uint8Array([0,0,1]),new Uint8Array([0,1,0]),new Uint8Array([0,1,1]),new Uint8Array([1,0,0]),new Uint8Array([1,0,1]),new Uint8Array([1,1,0]),new Uint8Array([1,1,1])],lt=new Ee,ot=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;e(this,t),this.min=a,this.size=n,this.children=null}return n(t,[{key:\"getCenter\",value:function(e){return e.copy(this.min).addScalar(.5*this.size)}},{key:\"getDimensions\",value:function(e){return e.set(this.size,this.size,this.size)}},{key:\"split\",value:function(){var e,t,a=this.min,n=this.getCenter(lt),l=.5*this.size,o=this.children=[null,null,null,null,null,null,null,null];for(e=0;8>e;++e)t=it[e],o[e]=new this.constructor(new Ee(0===t[0]?a.x:n.x,0===t[1]?a.y:n.y,0===t[2]?a.z:n.z),l)}},{key:\"max\",get:function(){return this.min.clone().addScalar(this.size)}}]),t}(),st=new Ee,rt=function(){function t(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;e(this,t),this.min=a,this.max=n,this.children=null}return n(t,[{key:\"getCenter\",value:function(e){return e.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getDimensions\",value:function(e){return e.subVectors(this.max,this.min)}},{key:\"split\",value:function(){var e,t,a=this.min,n=this.max,l=this.getCenter(st),o=this.children=[null,null,null,null,null,null,null,null];for(e=0;8>e;++e)t=it[e],o[e]=new this.constructor(new Ee(0===t[0]?a.x:l.x,0===t[1]?a.y:l.y,0===t[2]?a.z:l.z),new Ee(0===t[0]?l.x:n.x,0===t[1]?l.y:n.y,0===t[2]?l.z:n.z))}}]),t}(),yt=function t(a,n,i){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;e(this,t),this.distance=a,this.distanceToRay=n,this.point=i,this.object=l},dt=[new Uint8Array([4,2,1]),new Uint8Array([5,3,8]),new Uint8Array([6,8,3]),new Uint8Array([7,8,8]),new Uint8Array([8,6,5]),new Uint8Array([8,7,8]),new Uint8Array([8,8,7]),new Uint8Array([8,8,8])],ut=new Ee,ct=new v,mt=new v,d=new We,r=new function t(){e(this,t),this.value=0},xt=function(){function t(){e(this,t)}return n(t,null,[{key:\"intersectOctree\",value:function(e,t){var a=2<arguments.length&&void 0!==arguments[2]?arguments[2]:[],n=A(e,t,r);null!==n&&V.apply(void 0,[e.root].concat(w(n),[a]))}}]),t}(),pt=new v,vt=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;e(this,t),this.octree=a,this.region=n,this.cull=null!==n,this.result=new at,this.trace=null,this.indices=null,this.reset()}return n(t,[{key:\"reset\",value:function(){var e=this.octree.root;return this.trace=[],this.indices=[],null!==e&&(pt.min=e.min,pt.max=e.max,(!this.cull||this.region.intersectsBox(pt))&&(this.trace.push(e),this.indices.push(0))),this.result.reset(),this}},{key:\"next\",value:function(){for(var e,t,a,n=this.cull,i=this.region,l=this.indices,o=this.trace,s=null,r=o.length-1;null===s&&0<=r;)if(e=l[r]++,t=o[r].children,!(8>e))o.pop(),l.pop(),--r;else if(null!==t){if(a=t[e],n&&(pt.min=a.min,pt.max=a.max,!i.intersectsBox(pt)))continue;o.push(a),l.push(0),++r}else s=o.pop(),l.pop();return this.result.value=s,this.result.done=null===s,this.result}},{key:\"return\",value:function(e){return this.result.value=e,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),gt=new v,kt=function(){function t(a){e(this,t),this.root=a}return n(t,[{key:\"getCenter\",value:function(e){return this.root.getCenter(e)}},{key:\"getDimensions\",value:function(e){return this.root.getDimensions(e)}},{key:\"cull\",value:function(e){var t=[];return N(this.root,e,t),t}},{key:\"getDepth\",value:function(){return B(this.root)}},{key:\"findNodesByLevel\",value:function(e){var t=[];return L(this.root,e,0,t),t}},{key:\"raycast\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];return xt.intersectOctree(this,e.ray,t),t}},{key:\"leaves\",value:function(e){return new vt(this,e)}},{key:Symbol.iterator,value:function(){return new vt(this)}},{key:\"min\",get:function(){return this.root.min}},{key:\"max\",get:function(){return this.root.max}},{key:\"children\",get:function(){return this.root.children}}]),t}(),ht=new Ee,p=function(t){function a(t,n){var i;return e(this,a),i=k(this,s(a).call(this,t,n)),i.points=null,i.data=null,i}return l(a,t),n(a,[{key:\"distanceToSquared\",value:function(e){var t=ht.copy(e).clamp(this.min,this.max);return t.sub(e).lengthSquared()}},{key:\"distanceToCenterSquared\",value:function(e){var t=this.getCenter(ht),a=e.x-t.x,n=e.y-t.x,i=e.z-t.z;return a*a+n*n+i*i}},{key:\"contains\",value:function(e,t){var a=this.min,n=this.max;return e.x>=a.x-t&&e.y>=a.y-t&&e.z>=a.z-t&&e.x<=n.x+t&&e.y<=n.y+t&&e.z<=n.z+t}},{key:\"redistribute\",value:function(e){var t,a,n,l,o,s,r,y=this.children,d=this.points,u=this.data;if(null!==y&&null!==d){for(t=0,n=d.length;t<n;++t)for(s=d[t],r=u[t],(a=0,l=y.length);a<l;++a)if(o=y[a],o.contains(s,e)){null===o.points&&(o.points=[],o.data=[]),o.points.push(s),o.data.push(r);break}this.points=null,this.data=null}}},{key:\"merge\",value:function(){var e=this.children;if(null!==e){var t,a,n,o=[],s=[];for(t=0,a=e.length;t<a;++t)n=e[t],null!==n.points&&(o=o.concat(n.points),s=s.concat(n.data));this.children=null,this.points=o,this.data=s}}}]),a}(rt),zt=function(t){function a(t,n){var i,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0,o=3<arguments.length&&void 0!==arguments[3]?arguments[3]:8,r=4<arguments.length&&void 0!==arguments[4]?arguments[4]:8;return e(this,a),i=k(this,s(a).call(this,new p(t,n))),i.bias=Ce(0,l),i.maxPoints=Ce(1,ke(o)),i.maxDepth=Ce(0,ke(r)),i.pointCount=0,i}return l(a,t),n(a,[{key:\"countPoints\",value:function(e){return O(e)}},{key:\"insert\",value:function(e,t){return M(e,t,this,this.root,0)}},{key:\"remove\",value:function(e){return R(e,this,this.root,null)}},{key:\"get\",value:function(e){return Y(e,this,this.root)}},{key:\"move\",value:function(e,t){return X(e,t,this,this.root,null,0)}},{key:\"findNearestPoint\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:1/0,a=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2],n=Z(e,t,a,this.root);return null!==n&&(n.point=n.point.clone()),n}},{key:\"findPoints\",value:function(e,t){var a=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2],n=[];return _(e,t,a,this.root,n),n}},{key:\"raycast\",value:function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],n=z(s(a.prototype),\"raycast\",this).call(this,e);return 0<n.length&&E(n,e,t),t}}]),a}(kt),ft=new Ee,St=new Ee,wt=new Ee,Tt=function(){function t(){var n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee,a=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee;e(this,t),this.a=n,this.b=a,this.index=-1,this.coordinates=new Ee,this.t=0,this.n=new Ee}return n(t,[{key:\"approximateZeroCrossing\",value:function(e){var t,n,l=1<arguments.length&&void 0!==arguments[1]?arguments[1]:8,o=Ce(1,l-1),s=0,r=1,y=0,d=0;for(ft.subVectors(this.b,this.a);d<=o&&(y=(s+r)/2,St.addVectors(this.a,wt.copy(ft).multiplyScalar(y)),n=e.sample(St),!(Te(n)<=1e-4||(r-s)/2<=1e-6));)St.addVectors(this.a,wt.copy(ft).multiplyScalar(s)),t=e.sample(St),pe(n)===pe(t)?s=y:r=y,++d;this.t=y}},{key:\"computeZeroCrossingPosition\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new Ee;return e.subVectors(this.b,this.a).multiplyScalar(this.t).add(this.a)}},{key:\"computeSurfaceNormal\",value:function(e){var t=this.computeZeroCrossingPosition(ft),a=1e-3,n=e.sample(St.addVectors(t,wt.set(a,0,0)))-e.sample(St.subVectors(t,wt.set(a,0,0))),i=e.sample(St.addVectors(t,wt.set(0,a,0)))-e.sample(St.subVectors(t,wt.set(0,a,0))),l=e.sample(St.addVectors(t,wt.set(0,0,a)))-e.sample(St.subVectors(t,wt.set(0,0,a)));this.n.set(n,i,l).normalize()}}]),t}(),It=new Tt,Ct=new Ee,Pt=new Ee,bt=function(){function t(a,n,i){var l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:0,o=4<arguments.length&&void 0!==arguments[4]?arguments[4]:3;e(this,t),this.edgeData=a,this.cellPosition=n,this.cellSize=i,this.indices=null,this.zeroCrossings=null,this.normals=null,this.axes=null,this.lengths=null,this.result=new at,this.initialC=l,this.c=l,this.initialD=o,this.d=o,this.i=0,this.l=0,this.reset()}return n(t,[{key:\"reset\",value:function(){var e,t,n,i,o=this.edgeData,s=[],r=[],y=[],u=[],m=[];for(this.i=0,this.c=0,this.d=0,(t=this.initialC,e=4>>t,n=this.initialD);t<n;++t,e>>=1)i=o.indices[t].length,0<i&&(s.push(o.indices[t]),r.push(o.zeroCrossings[t]),y.push(o.normals[t]),u.push(it[e]),m.push(i),++this.d);return this.l=0<m.length?m[0]:0,this.indices=s,this.zeroCrossings=r,this.normals=y,this.axes=u,this.lengths=m,this.result.reset(),this}},{key:\"next\",value:function(){var e,t,a,l,o,r,d,u=this.cellSize,s=this.edgeData.resolution,n=s+1,m=n*n,p=this.result,v=this.cellPosition;return this.i===this.l&&(this.l=++this.c<this.d?this.lengths[this.c]:0,this.i=0),this.i<this.l?(r=this.c,d=this.i,e=this.axes[r],t=this.indices[r][d],It.index=t,a=t%n,l=xe(t%m/n),o=xe(t/m),It.coordinates.set(a,l,o),Ct.set(a*u/s,l*u/s,o*u/s),Pt.set((a+e[0])*u/s,(l+e[1])*u/s,(o+e[2])*u/s),It.a.addVectors(v,Ct),It.b.addVectors(v,Pt),It.t=this.zeroCrossings[r][d],It.n.fromArray(this.normals[r],3*d),p.value=It,++this.i):(p.value=null,p.done=!0),p}},{key:\"return\",value:function(e){return this.result.value=e,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),t}(),Et=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:n,l=3<arguments.length&&void 0!==arguments[3]?arguments[3]:n;e(this,t),this.resolution=a,this.indices=0>=n?null:[new Uint32Array(n),new Uint32Array(i),new Uint32Array(l)],this.zeroCrossings=0>=n?null:[new Float32Array(n),new Float32Array(i),new Float32Array(l)],this.normals=0>=n?null:[new Float32Array(3*n),new Float32Array(3*i),new Float32Array(3*l)]}return n(t,[{key:\"serialize\",value:function(){return{resolution:this.resolution,edges:this.edges,zeroCrossings:this.zeroCrossings,normals:this.normals}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.resolution=e.resolution,this.edges=e.edges,this.zeroCrossings=e.zeroCrossings,this.normals=e.normals),t}},{key:\"createTransferList\",value:function(){var e,t,a,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],o=[this.edges[0],this.edges[1],this.edges[2],this.zeroCrossings[0],this.zeroCrossings[1],this.zeroCrossings[2],this.normals[0],this.normals[1],this.normals[2]];for(t=0,a=o.length;t<a;++t)e=o[t],null!==e&&n.push(e.buffer);return n}},{key:\"edges\",value:function(e,t){return new bt(this,e,t)}},{key:\"edgesX\",value:function(e,t){return new bt(this,e,t,0,1)}},{key:\"edgesY\",value:function(e,t){return new bt(this,e,t,1,2)}},{key:\"edgesZ\",value:function(e,t){return new bt(this,e,t,2,3)}}],[{key:\"calculate1DEdgeCount\",value:function(e){return me(e+1,2)*e}}]),t}(),Dt={AIR:0,SOLID:1},Ft=0,qt=0,At=0,Vt=function(){function t(){var a=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];e(this,t),this.materials=0,this.materialIndices=a?new Uint8Array(At):null,this.runLengths=null,this.edgeData=null}return n(t,[{key:\"set\",value:function(e){return this.materials=e.materials,this.materialIndices=e.materialIndices,this.runLengths=e.runLengths,this.edgeData=e.edgeData,this}},{key:\"clear\",value:function(){return this.materials=0,this.materialIndices=null,this.runLengths=null,this.edgeData=null,this}},{key:\"setMaterialIndex\",value:function(e,t){this.materialIndices[e]===Dt.AIR?t!==Dt.AIR&&++this.materials:t===Dt.AIR&&--this.materials,this.materialIndices[e]=t}},{key:\"compress\",value:function(){var e,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this;return this.compressed?(t.materialIndices=this.materialIndices,t.runLengths=this.runLengths):(e=this.full?new be([this.materialIndices.length],[Dt.SOLID]):be.encode(this.materialIndices),t.materialIndices=new Uint8Array(e.data),t.runLengths=new Uint32Array(e.runLengths)),t.materials=this.materials,t}},{key:\"decompress\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:this;return e.materialIndices=this.compressed?be.decode(this.runLengths,this.materialIndices,new Uint8Array(At)):this.materialIndices,e.runLengths=null,e.materials=this.materials,e}},{key:\"serialize\",value:function(){return{materials:this.materials,materialIndices:this.materialIndices,runLengths:this.runLengths,edgeData:null===this.edgeData?null:this.edgeData.serialize()}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.materials=e.materials,this.materialIndices=e.materialIndices,this.runLengths=e.runLengths,null===e.edgeData?this.edgeData=null:(null===this.edgeData&&(this.edgeData=new Et(qt)),this.edgeData.deserialize(e.edgeData))),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return null!==this.edgeData&&this.edgeData.createTransferList(e),null!==this.materialIndices&&e.push(this.materialIndices.buffer),null!==this.runLengths&&e.push(this.runLengths.buffer),e}},{key:\"empty\",get:function(){return 0===this.materials}},{key:\"full\",get:function(){return this.materials===At}},{key:\"compressed\",get:function(){return null!==this.runLengths}},{key:\"neutered\",get:function(){return!this.empty&&null===this.materialIndices}}],[{key:\"isovalue\",get:function(){return Ft},set:function(e){Ft=e}},{key:\"resolution\",get:function(){return qt},set:function(e){var t=Math.log2;e=me(2,Ce(0,we(t(e)))),qt=Ce(1,Pe(256,e)),At=me(qt+1,3)}}]),t}(),Bt=function(){function t(){e(this,t),this.ata=new et,this.ata.set(0,0,0,0,0,0),this.atb=new Ee,this.massPointSum=new Ee,this.numPoints=0}return n(t,[{key:\"set\",value:function(e,t,a,n){return this.ata.copy(e),this.atb.copy(t),this.massPointSum.copy(a),this.numPoints=n,this}},{key:\"copy\",value:function(e){return this.set(e.ata,e.atb,e.massPointSum,e.numPoints)}},{key:\"add\",value:function(e,t){var a=t.x,n=t.y,i=t.z,l=e.dot(t),o=this.ata.elements,s=this.atb;o[0]+=a*a,o[1]+=a*n,o[3]+=n*n,o[2]+=a*i,o[4]+=n*i,o[5]+=i*i,s.x+=l*a,s.y+=l*n,s.z+=l*i,this.massPointSum.add(e),++this.numPoints}},{key:\"addData\",value:function(e){this.ata.add(e.ata),this.atb.add(e.atb),this.massPointSum.add(e.massPointSum),this.numPoints+=e.numPoints}},{key:\"clear\",value:function(){this.ata.set(0,0,0,0,0,0),this.atb.set(0,0,0),this.massPointSum.set(0,0,0),this.numPoints=0}},{key:\"clone\",value:function(){return new this.constructor().copy(this)}}]),t}(),Nt=new Ve,Lt=function(){function t(){e(this,t)}return n(t,null,[{key:\"calculateCoefficients\",value:function(e,t,a){var n,i,l;return 0===t?(Nt.x=1,Nt.y=0):(n=(a-e)/(2*t),i=Ie(1+n*n),l=1/(0<=n?n+i:n-i),Nt.x=1/Ie(1+l*l),Nt.y=l*Nt.x),Nt}}]),t}(),Ot=function(){function t(){e(this,t)}return n(t,null,[{key:\"rotateXY\",value:function(e,t){var a=t.x,n=t.y,i=e.x,l=e.y;e.set(a*i-n*l,n*i+a*l)}},{key:\"rotateQXY\",value:function(e,t,a){var n=a.x,i=a.y,l=n*n,o=i*i,s=2*n*i*t,r=e.x,y=e.y;e.set(l*r-s+o*y,o*r+s+l*y)}}]),t}(),Mt=.1,Rt=new et,Yt=new Oe,Xt=new Ve,Zt=new Ee,_t=function(){function t(){e(this,t)}return n(t,null,[{key:\"solve\",value:function(e,t,a){var n=G(Rt.copy(e),Yt.identity()),i=J(Yt,n);a.copy(t).applyMatrix3(i)}}]),t}(),jt=new Ee,Ut=function(){function t(){e(this,t),this.data=null,this.ata=new et,this.atb=new Ee,this.massPoint=new Ee,this.hasSolution=!1}return n(t,[{key:\"setData\",value:function(e){return this.data=e,this.hasSolution=!1,this}},{key:\"solve\",value:function(e){var t=this.data,a=this.massPoint,n=this.ata.copy(t.ata),i=this.atb.copy(t.atb),l=1/0;return!this.hasSolution&&null!==t&&0<t.numPoints&&(jt.copy(t.massPointSum).divideScalar(t.numPoints),a.copy(jt),n.applyToVector3(jt),i.sub(jt),_t.solve(n,i,e),l=K(n,i,e),e.add(a),this.hasSolution=!0),l}}]),t}(),Qt=function t(){e(this,t),this.materials=0,this.edgeCount=0,this.index=-1,this.position=new Ee,this.normal=new Ee,this.qefData=null},Gt=new Ut,Ht=.1,Jt=-1,Kt=function(t){function a(t,n){var i;return e(this,a),i=k(this,s(a).call(this,t,n)),i.voxel=null,i}return l(a,t),n(a,[{key:\"contains\",value:function(e){var t=this.min,a=this.size;return e.x>=t.x-Ht&&e.y>=t.y-Ht&&e.z>=t.z-Ht&&e.x<=t.x+a+Ht&&e.y<=t.y+a+Ht&&e.z<=t.z+a+Ht}},{key:\"collapse\",value:function(){var e,t,a,n,l,o,s,r=this.children,y=[-1,-1,-1,-1,-1,-1,-1,-1],d=new Ee,u=-1,c=null!==r,m=0;if(c){for(n=new Bt,o=0,s=0;8>s;++s)e=r[s],m+=e.collapse(),a=e.voxel,null===e.children?null!==a&&(n.addData(a.qefData),u=1&a.materials>>7-s,y[s]=1&a.materials>>s,++o):c=!1;if(c&&(l=Gt.setData(n).solve(d),l<=Jt)){for(a=new Qt,a.position.copy(this.contains(d)?d:Gt.massPoint),s=0;8>s;++s)t=y[s],e=r[s],-1===t?a.materials|=u<<s:(a.materials|=t<<s,a.normal.add(e.voxel.normal));a.normal.normalize(),a.qefData=n,this.voxel=a,this.children=null,m+=o-1}}return m}}],[{key:\"errorThreshold\",get:function(){return Jt},set:function(e){Jt=e}}]),a}(ot),Wt=function t(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null;e(this,t),this.action=a,this.error=null},$t=function(){function t(a,n,i,l,o){e(this,t),this.indices=a,this.positions=n,this.normals=i,this.uvs=l,this.materials=o}return n(t,[{key:\"serialize\",value:function(){return{indices:this.indices,positions:this.positions,normals:this.normals,uvs:this.uvs,materials:this.materials}}},{key:\"deserialize\",value:function(e){var t=this;return null===e?t=null:(this.indices=e.indices,this.positions=e.positions,this.normals=e.normals,this.uvs=e.uvs,this.materials=e.materials),t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e.push(this.indices.buffer),e.push(this.positions.buffer),e.push(this.normals.buffer),e.push(this.uvs.buffer),e.push(this.materials.buffer),e}}]),t}(),ea=[new Uint8Array([0,4,0]),new Uint8Array([1,5,0]),new Uint8Array([2,6,0]),new Uint8Array([3,7,0]),new Uint8Array([0,2,1]),new Uint8Array([4,6,1]),new Uint8Array([1,3,1]),new Uint8Array([5,7,1]),new Uint8Array([0,1,2]),new Uint8Array([2,3,2]),new Uint8Array([4,5,2]),new Uint8Array([6,7,2])],ta=[new Uint8Array([0,1,2,3,0]),new Uint8Array([4,5,6,7,0]),new Uint8Array([0,4,1,5,1]),new Uint8Array([2,6,3,7,1]),new Uint8Array([0,2,4,6,2]),new Uint8Array([1,3,5,7,2])],aa=[[new Uint8Array([4,0,0]),new Uint8Array([5,1,0]),new Uint8Array([6,2,0]),new Uint8Array([7,3,0])],[new Uint8Array([2,0,1]),new Uint8Array([6,4,1]),new Uint8Array([3,1,1]),new Uint8Array([7,5,1])],[new Uint8Array([1,0,2]),new Uint8Array([3,2,2]),new Uint8Array([5,4,2]),new Uint8Array([7,6,2])]],na=[[new Uint8Array([1,4,0,5,1,1]),new Uint8Array([1,6,2,7,3,1]),new Uint8Array([0,4,6,0,2,2]),new Uint8Array([0,5,7,1,3,2])],[new Uint8Array([0,2,3,0,1,0]),new Uint8Array([0,6,7,4,5,0]),new Uint8Array([1,2,0,6,4,2]),new Uint8Array([1,3,1,7,5,2])],[new Uint8Array([1,1,0,3,2,0]),new Uint8Array([1,5,4,7,6,0]),new Uint8Array([0,1,5,0,4,1]),new Uint8Array([0,3,7,2,6,1])]],ia=[[new Uint8Array([3,2,1,0,0]),new Uint8Array([7,6,5,4,0])],[new Uint8Array([5,1,4,0,1]),new Uint8Array([7,3,6,2,1])],[new Uint8Array([6,4,2,0,2]),new Uint8Array([7,5,3,1,2])]],la=[new Uint8Array([3,2,1,0]),new Uint8Array([7,5,6,4]),new Uint8Array([11,10,9,8])],oa=me(2,16)-1,sa=function(){function t(){e(this,t)}return n(t,null,[{key:\"run\",value:function(e){var t=[],a=e.voxelCount,n=null,i=null,l=null,o=null,s=null;return a>oa?console.warn(\"Could not create geometry for cell at position\",e.min,\"(vertex count of\",a,\"exceeds limit of \",oa,\")\"):0<a&&(i=new Float32Array(3*a),l=new Float32Array(3*a),o=new Float32Array(2*a),s=new Uint8Array(a),ae(e.root,i,l,0),te(e.root,t),n=new $t(new Uint16Array(t),i,l,o,s)),n}}]),t}(),ra=function(t){function a(t){var n,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:new Ee,l=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1;return e(this,a),n=k(this,s(a).call(this)),n.root=new Kt(i,l),n.voxelCount=0,null!==t&&null!==t.edgeData&&n.construct(t),0<=Kt.errorThreshold&&n.simplify(),n}return l(a,t),n(a,[{key:\"simplify\",value:function(){this.voxelCount-=this.root.collapse()}},{key:\"construct\",value:function(e){var t,a,l,o,s,r,u,c,m,p,v,g=Vt.resolution,n=e.edgeData,k=e.materialIndices,h=new Ut,f=new Ee,S=[n.edgesX(this.min,this.root.size),n.edgesY(this.min,this.root.size),n.edgesZ(this.min,this.root.size)],w=[new Uint8Array([0,1,2,3]),new Uint8Array([0,1,4,5]),new Uint8Array([0,2,4,6])],T=0;for(p=0;3>p;++p){l=w[p],t=S[p];var I=!0,C=!1,P=void 0;try{for(var b,E=t[Symbol.iterator]();!(I=(b=E.next()).done);I=!0)for(a=b.value,a.computeZeroCrossingPosition(f),v=0;4>v;++v)o=it[l[v]],u=a.coordinates.x-o[0],c=a.coordinates.y-o[1],m=a.coordinates.z-o[2],0<=u&&0<=c&&0<=m&&u<g&&c<g&&m<g&&(s=ne(this.root,g,u,c,m),null===s.voxel&&(s.voxel=ie(g,u,c,m,k),++T),r=s.voxel,r.normal.add(a.n),r.qefData.add(f,a.n),r.qefData.numPoints===r.edgeCount&&(h.setData(r.qefData).solve(r.position),!s.contains(r.position)&&r.position.copy(h.massPoint),r.normal.normalize()))}catch(e){C=!0,P=e}finally{try{I||null==E[\"return\"]||E[\"return\"]()}finally{if(C)throw P}}}this.voxelCount=T}}]),a}(kt),ya={EXTRACT:\"worker.extract\",MODIFY:\"worker.modify\",CONFIGURE:\"worker.config\",CLOSE:\"worker.close\"},da=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;return e(this,a),t=k(this,s(a).call(this,n)),t.data=null,t}return l(a,t),a}(Wt),ua=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this,ya.EXTRACT)),t.isosurface=null,t}return l(a,t),a}(da),ca=new Vt(!1),ma=function(){function t(){e(this,t),this.data=null,this.response=null}return n(t,[{key:\"getData\",value:function(){return this.data}},{key:\"respond\",value:function(){return this.response.data=this.data.serialize(),this.response}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return null!==this.data&&this.data.createTransferList(e),e}},{key:\"process\",value:function(e){return this.data=ca.deserialize(e.data),this}}]),t}(),xa=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this)),t.response=new ua,t.decompressionTarget=new Vt(!1),t.isosurface=null,t}return l(a,t),n(a,[{key:\"respond\",value:function(){var e=z(s(a.prototype),\"respond\",this).call(this);return e.isosurface=null===this.isosurface?null:this.isosurface.serialise(),e}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return z(s(a.prototype),\"createTransferList\",this).call(this,e),null===this.isosurface?e:this.isosurface.createTransferList(e)}},{key:\"process\",value:function(e){var t=z(s(a.prototype),\"process\",this).call(this,e).getData(),n=new ra(t.decompress(this.decompressionTarget));return this.isosurface=sa.run(n),this.decompressionTarget.clear(),this}}]),a}(ma),pa={UNION:\"csg.union\",DIFFERENCE:\"csg.difference\",INTERSECTION:\"csg.intersection\",DENSITY_FUNCTION:\"csg.densityfunction\"},va=function(){function t(a){e(this,t),this.type=a;for(var n=arguments.length,i=Array(1<n?n-1:0),l=1;l<n;l++)i[l-1]=arguments[l];this.children=i,this.boundingBox=null}return n(t,[{key:\"getBoundingBox\",value:function(){return null===this.boundingBox&&(this.boundingBox=this.computeBoundingBox()),this.boundingBox}},{key:\"computeBoundingBox\",value:function(){var e,t,a=this.children,n=new v;for(e=0,t=a.length;e<t;++e)n.union(a[e].getBoundingBox());return n}}]),t}(),ga=function(t){function a(){var t;e(this,a);for(var n=arguments.length,i=Array(n),l=0;l<n;l++)i[l]=arguments[l];return k(this,(t=s(a)).call.apply(t,[this,pa.UNION].concat(i)))}return l(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){var n=a.materialIndices[e];n!==Dt.AIR&&t.setMaterialIndex(e,n)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t>t.t?e:t:e.t<t.t?e:t}}]),a}(va),ka=function(t){function a(){var t;e(this,a);for(var n=arguments.length,i=Array(n),l=0;l<n;l++)i[l]=arguments[l];return k(this,(t=s(a)).call.apply(t,[this,pa.DIFFERENCE].concat(i)))}return l(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){a.materialIndices[e]!==Dt.AIR&&t.setMaterialIndex(e,Dt.AIR)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t<t.t?e:t:e.t>t.t?e:t}}]),a}(va),ha=function(t){function a(){var t;e(this,a);for(var n=arguments.length,i=Array(n),l=0;l<n;l++)i[l]=arguments[l];return k(this,(t=s(a)).call.apply(t,[this,pa.INTERSECTION].concat(i)))}return l(a,t),n(a,[{key:\"updateMaterialIndex\",value:function(e,t,a){var n=a.materialIndices[e];t.setMaterialIndex(e,t.materialIndices[e]!==Dt.AIR&&n!==Dt.AIR?n:Dt.AIR)}},{key:\"selectEdge\",value:function(e,t,a){return a?e.t<t.t?e:t:e.t>t.t?e:t}}]),a}(va),za=0,fa=new Ee,Sa=function(){function t(){e(this,t)}return n(t,null,[{key:\"run\",value:function(e,t,a,n){fa.fromArray(e),za=t,null===a?n.operation===pa.UNION&&(a=new Vt(!1)):a.decompress();var i=n.toCSG(),l=null===a?null:ue(i);if(null!==l){switch(n.operation){case pa.UNION:i=new ga(i);break;case pa.DIFFERENCE:i=new ka(i);break;case pa.INTERSECTION:i=new ha(i);}de(i,a,l),a.contoured=!1}return null!==a&&a.empty?null:a}}]),t}(),wa=function(t){function a(t){var n;return e(this,a),n=k(this,s(a).call(this,pa.DENSITY_FUNCTION)),n.sdf=t,n}return l(a,t),n(a,[{key:\"computeBoundingBox\",value:function(){return this.sdf.getBoundingBox(!0)}},{key:\"generateMaterialIndex\",value:function(e){return this.sdf.sample(e)<=Vt.isovalue?this.sdf.material:Dt.AIR}},{key:\"generateEdge\",value:function(e){e.approximateZeroCrossing(this.sdf),e.computeSurfaceNormal(this.sdf)}}]),a}(va),Ta=new c,Ia=function(){function t(a){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:Dt.SOLID;e(this,t),this.type=a,this.operation=null,this.material=Pe(255,Ce(Dt.SOLID,xe(n))),this.boundingBox=null,this.position=new Ee,this.quaternion=new Re,this.scale=new Ee(1,1,1),this.inverseTransformation=new c,this.updateInverseTransformation(),this.children=[]}return n(t,[{key:\"getTransformation\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:new c;return e.compose(this.position,this.quaternion,this.scale)}},{key:\"getBoundingBox\",value:function(){var e,t,a=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],n=this.children,o=this.boundingBox;if(null===o&&(o=this.computeBoundingBox(),this.boundingBox=o),a)for(o=o.clone(),e=0,t=n.length;e<t;++e)o.union(n[e].getBoundingBox(a));return o}},{key:\"setMaterial\",value:function(e){return this.material=Pe(255,Ce(Dt.SOLID,xe(e))),this}},{key:\"setOperationType\",value:function(e){return this.operation=e,this}},{key:\"updateInverseTransformation\",value:function(){return this.inverseTransformation.getInverse(this.getTransformation(Ta)),this.boundingBox=null,this}},{key:\"union\",value:function(e){return this.children.push(e.setOperationType(pa.UNION)),this}},{key:\"subtract\",value:function(e){return this.children.push(e.setOperationType(pa.DIFFERENCE)),this}},{key:\"intersect\",value:function(e){return this.children.push(e.setOperationType(pa.INTERSECTION)),this}},{key:\"toCSG\",value:function(){var e,t,a,n,o=this.children,s=new wa(this);for(a=0,n=o.length;a<n;++a)t=o[a],e!==t.operation&&(e=t.operation,e===pa.UNION?s=new ga(s):e===pa.DIFFERENCE?s=new ka(s):e===pa.INTERSECTION?s=new ha(s):void 0),s.children.push(t.toCSG());return s}},{key:\"serialize\",value:function(){var e,t,a=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],n={type:this.type,operation:this.operation,material:this.material,position:this.position.toArray(),quaternion:this.quaternion.toArray(),scale:this.scale.toArray(),parameters:null,children:[]};for(e=0,t=this.children.length;e<t;++e)n.children.push(this.children[e].serialize(a));return n}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e}},{key:\"toJSON\",value:function(){return this.serialize(!0)}},{key:\"computeBoundingBox\",value:function(){throw new Error(\"SignedDistanceFunction#computeBoundingBox method not implemented!\")}},{key:\"sample\",value:function(){throw new Error(\"SignedDistanceFunction#sample method not implemented!\")}}]),t}(),Ca={HEIGHTFIELD:\"sdf.heightfield\",FRACTAL_NOISE:\"sdf.fractalnoise\",SUPER_PRIMITIVE:\"sdf.superprimitive\"},Pa=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,Ca.PERLIN_NOISE,i)),t.min=x(Ee,w(n.min)),t.max=x(Ee,w(n.max)),t}return l(a,t),n(a,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new v(this.min,this.max),this.bbox}},{key:\"sample\",value:function(){}},{key:\"serialize\",value:function(){var e=z(s(a.prototype),\"serialize\",this).call(this);return e.parameters={min:this.min.toArray(),max:this.max.toArray()},e}}]),a}(Ia),ba=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,Ca.HEIGHTFIELD,i)),t.width=void 0===n.width?1:n.width,t.height=void 0===n.height?1:n.height,t.smooth=void 0===n.smooth||n.smooth,t.data=void 0===n.data?null:n.data,t.heightmap=null,void 0!==n.image&&t.fromImage(n.image),t}return l(a,t),n(a,[{key:\"fromImage\",value:function(e){var t,a,n,o,s=\"undefined\"==typeof document?null:ce(e),r=null;if(null!==s){for(t=s.data,r=new Uint8ClampedArray(t.length/4),(a=0,n=0,o=r.length);a<o;++a,n+=4)r[a]=t[n];this.heightmap=e,this.width=s.width,this.height=s.height,this.data=r}return this}},{key:\"getHeight\",value:function(e,t){var n,i=this.width,l=this.height,o=this.data;if(e=ke(e*i),t=ke(t*l),this.smooth){e=Ce(Pe(e,i-1),1),t=Ce(Pe(t,l-1),1);var s=e+1,r=e-1,y=t*i,a=y+i,d=y-i;n=(o[d+r]+o[d+e]+o[d+s]+o[y+r]+o[y+e]+o[y+s]+o[a+r]+o[a+e]+o[a+s])/9}else n=o[t*i+e];return n}},{key:\"computeBoundingBox\",value:function(){var e=new v,t=Pe(this.width/this.height,1),a=Pe(this.height/this.width,1);return e.min.set(0,0,0),e.max.set(t,1,a),e.applyMatrix4(this.getTransformation()),e}},{key:\"sample\",value:function(e){var t,a=this.boundingBox;return a.containsPoint(e)?(e.applyMatrix4(this.inverseTransformation),t=e.y-this.getHeight(e.x,e.z)/255):t=a.distanceToPoint(e),t}},{key:\"serialize\",value:function(){var e=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],t=z(s(a.prototype),\"serialize\",this).call(this);return t.parameters={width:this.width,height:this.height,smooth:this.smooth,data:e?null:this.data,dataURL:e&&null!==this.heightmap?this.heightmap.toDataURL():null,image:null},t}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return e.push(this.data.buffer),e}}]),a}(Ia),Ea=function(t){function a(){var t,n=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i=1<arguments.length?arguments[1]:void 0;return e(this,a),t=k(this,s(a).call(this,Ca.SUPER_PRIMITIVE,i)),t.s0=x(tt,w(n.s)),t.r0=x(Ee,w(n.r)),t.s=new tt,t.r=new Ee,t.ba=new Ve,t.offset=0,t.precompute(),t}return l(a,t),n(a,[{key:\"setSize\",value:function(e,t,a,n){return this.s0.set(e,t,a,n),this.precompute()}},{key:\"setRadii\",value:function(e,t,a){return this.r0.set(e,t,a),this.precompute()}},{key:\"precompute\",value:function(){var e=this.s.copy(this.s0),t=this.r.copy(this.r0),a=this.ba;e.x-=t.x,e.y-=t.x,t.x-=e.w,e.w-=t.y,e.z-=t.y,this.offset=-2*e.z,a.set(t.z,this.offset);var n=a.dot(a);return 0===n?a.set(0,-1):a.divideScalar(n),this}},{key:\"computeBoundingBox\",value:function(){var e=this.s0,t=new v;return t.min.x=Pe(-e.x,-1),t.min.y=Pe(-e.y,-1),t.min.z=Pe(-e.z,-1),t.max.x=Ce(e.x,1),t.max.y=Ce(e.y,1),t.max.z=Ce(e.z,1),t.applyMatrix4(this.getTransformation()),t}},{key:\"sample\",value:function(e){e.applyMatrix4(this.inverseTransformation);var t=this.s,a=this.r,n=this.ba,i=Te(e.x)-t.x,l=Te(e.y)-t.y,o=Te(e.z)-t.z,s=Ce(i,0),r=Ce(l,0),y=Ie(s*s+r*r),d=e.z-t.z,u=Te(y+Pe(0,Ce(i,l))-a.x)-t.w,m=Pe(Ce(u*n.x+d*n.y,0),1),c=u-a.z*m,x=d-this.offset*m,p=Ce(u-a.z,0),v=e.z+t.z,g=Ce(u,0),k=u*-n.y+d*n.x,h=Ie(Pe(c*c+x*x,Pe(p*p+v*v,g*g+d*d)));return h*pe(Ce(k,o))-a.y}},{key:\"serialize\",value:function(){var e=z(s(a.prototype),\"serialize\",this).call(this);return e.parameters={s:this.s0.toArray(),r:this.r0.toArray()},e}}],[{key:\"create\",value:function(e){var t=Da[e];return new a({s:t[0],r:t[1]})}}]),a}(Ia),Da=[[new Float32Array([1,1,1,1]),new Float32Array([0,0,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,0,0])],[new Float32Array([0,0,1,1]),new Float32Array([0,0,1])],[new Float32Array([1,1,2,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,.25,1]),new Float32Array([1,.25,0])],[new Float32Array([1,1,.25,.25]),new Float32Array([1,.25,0])],[new Float32Array([1,1,1,.25]),new Float32Array([1,.1,0])],[new Float32Array([1,1,1,.25]),new Float32Array([.1,.1,0])]],Fa=function(){function t(){e(this,t)}return n(t,[{key:\"revive\",value:function(e){var t,a,n;switch(e.type){case Ca.FRACTAL_NOISE:t=new Pa(e.parameters,e.material);break;case Ca.HEIGHTFIELD:t=new ba(e.parameters,e.material);break;case Ca.SUPER_PRIMITIVE:t=new Ea(e.parameters,e.material);}for(t.operation=e.operation,t.position.fromArray(e.position),t.quaternion.fromArray(e.quaternion),t.scale.fromArray(e.scale),t.updateInverseTransformation(),(a=0,n=e.children.length);a<n;++a)t.children.push(this.revive(e.children[a]));return t}}]),t}(),qa=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this,ya.MODIFY)),t.sdf=null,t}return l(a,t),a}(da),Aa=function(t){function a(){var t;return e(this,a),t=k(this,s(a).call(this)),t.response=new qa,t.sdf=null,t}return l(a,t),n(a,[{key:\"respond\",value:function(){var e=z(s(a.prototype),\"respond\",this).call(this);return e.sdf=null===this.sdf?null:this.sdf.serialize(),e}},{key:\"createTransferList\",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return z(s(a.prototype),\"createTransferList\",this).call(this,e),null===this.sdf?e:this.sdf.createTransferList(e)}},{key:\"process\",value:function(e){var t=z(s(a.prototype),\"process\",this).call(this,e).getData(),n=this.sdf=Fa.revive(e.sdf),i=Sa.run(e.cellPosition,e.cellSize,t,n);return S(s(a.prototype),\"data\",null===i?null:i.compress(),this,!0),this}}]),a}(ma),Va=new Aa,Ba=new xa,Na=null;self.addEventListener(\"message\",function(e){var t=e.data;switch(Na=t.action,Na){case ya.MODIFY:postMessage(Va.process(t).respond(),Va.createTransferList());break;case ya.EXTRACT:postMessage(Ba.process(t).respond(),Ba.createTransferList());break;case ya.CONFIGURE:Vt.resolution=t.resolution,Kt.errorThreshold=t.errorThreshold;break;case ya.CLOSE:default:close();}}),self.addEventListener(\"error\",function(e){var t,a=Na===ya.MODIFY?Va:Na===ya.EXTRACT?Ba:null;null===a?(t=new Wt(ya.CLOSE),t.error=e,postMessage(t)):(t=a.respond(),t.action=ya.CLOSE,t.error=e,postMessage(t,a.createTransferList())),close()})})();\n";

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
          worker.postMessage(new Message(Action$1.CLOSE));
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

  var Action$2 = {
    NONE: 0
  };

  var CursorSettings = function () {
    function CursorSettings() {
      _classCallCheck(this, CursorSettings);

      this.preset = SuperPrimitivePreset.SPHERE;
      this.distance = 10.0;
      this.size = 1.0;
    }

    _createClass(CursorSettings, [{
      key: "copy",
      value: function copy(settings) {
        this.orbit = settings.orbit;
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }]);

    return CursorSettings;
  }();

  var Settings$1 = function () {
    function Settings() {
      _classCallCheck(this, Settings);

      this.cursor = new CursorSettings();
      this.keyBindings = new KeyBindings();
      this.keyBindings.setDefault(new Map([[KeyCode.A, Action$2.NONE]]));
    }

    _createClass(Settings, [{
      key: "copy",
      value: function copy(settings) {
        this.cursor.copy(settings.cursor);
        this.keyBindings.copy(settings.keyBindings);
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }, {
      key: "toDataURL",
      value: function toDataURL() {
        return URL.createObjectURL(new Blob([JSON.stringify(this)], {
          type: "text/json"
        }));
      }
    }]);

    return Settings;
  }();

  var screenCoordinates = new three.Vector2();
  var Editor = function () {
    function Editor(viewport, aside, assets) {
      _classCallCheck(this, Editor);

      this.clock = new three.Clock();

      this.renderer = function () {
        var renderer = new three.WebGLRenderer({
          logarithmicDepthBuffer: true,
          antialias: true
        });
        renderer.setClearColor(0xf4f4f4);
        renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        return renderer;
      }();

      viewport.appendChild(this.renderer.domElement);
      this.scene = new three.Scene();
      this.scene.fog = new three.FogExp2(this.renderer.getClearColor(), 0.0025);

      (function (scene) {
        var hemisphereLight = new three.HemisphereLight(0x3284ff, 0xffc87f, 0.6);
        var directionalLight = new three.DirectionalLight(0xfff4e5);
        hemisphereLight.position.set(0, 1, 0).multiplyScalar(50);
        directionalLight.position.set(1.75, 1.75, -1).multiplyScalar(50);
        scene.add(directionalLight);
        scene.add(hemisphereLight);
        scene.add(new three.GridHelper(16, 64));
      })(this.scene);

      this.camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
      this.camera.position.set(4, 1, 4);
      this.controls = new DeltaControls(this.camera.position, this.camera.quaternion, this.renderer.domElement);
      this.controls.lookAt(this.scene.position);
      this.controls.setOrbit(false);
      this.terrain = new Terrain({
        resolution: 32,
        cellSize: 20,
        levels: 16
      });
      this.terrain.load(assets.get("terrain"));
      this.raycaster = new three.Raycaster();
      this.settings = new Settings$1();
      this.cursor = new three.Mesh(new three.SphereBufferGeometry(1, 16, 16), new three.MeshBasicMaterial({
        transparent: true,
        opacity: 0.35,
        color: 0x0096ff,
        fog: false
      }));
      this.cursor.scale.multiplyScalar(this.settings.cursor.size);
      this.scene.add(this.cursor);
      this.octreeHelper = new OctreeHelper();
      this.octreeHelper.visible = false;
      this.scene.add(this.octreeHelper);
    }

    _createClass(Editor, [{
      key: "raycast",
      value: function raycast(event) {
        var raycaster = this.raycaster;
        screenCoordinates.x = event.clientX / window.innerWidth * 2 - 1;
        screenCoordinates.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(screenCoordinates, this.camera);
        var octants = this.terrain.raycast(raycaster.ray);
        var intersects = [];
        var octant;
        var i, l;

        for (i = 0, l = octants.length; i < l; ++i) {
          octant = octants[i];

          if (octant.mesh !== null) {
            intersects = intersects.concat(raycaster.intersectObject(octant.mesh));

            if (intersects.length > 0) {
              break;
            }
          }
        }

        if (intersects.length > 0) {
          this.cursor.position.copy(intersects[0].point);
        } else {
          this.cursor.position.copy(raycaster.ray.direction).multiplyScalar(this.settings.cursor.distance + this.cursor.scale.x).add(raycaster.ray.origin);
        }
      }
    }, {
      key: "handleMainPointerButton",
      value: function handleMainPointerButton(event, pressed) {
        var sdf = SuperPrimitive.create(this.superPrimitivePreset);
        sdf.origin.copy(this.cursor.position);
        sdf.setScale(this.settings.cursor.size);

        if (pressed) {
          this.terrain.union(sdf);
        }
      }
    }, {
      key: "handleAuxiliaryPointerButton",
      value: function handleAuxiliaryPointerButton(event, pressed) {}
    }, {
      key: "handleSecondaryPointerButton",
      value: function handleSecondaryPointerButton(event, pressed) {
        var sdf = SuperPrimitive.create(this.superPrimitivePreset);
        sdf.origin.copy(this.cursor.position);
        sdf.setScale(this.settings.cursor.size);

        if (pressed) {
          this.terrain.subtract(sdf);
        }
      }
    }, {
      key: "handlePointerEvent",
      value: function handlePointerEvent(event, pressed) {
        event.preventDefault();

        switch (event.button) {
          case PointerButton.MAIN:
            this.handleMainPointerButton(event, pressed);
            break;

          case PointerButton.AUXILIARY:
            this.handleAuxiliaryPointerButton(event, pressed);
            break;

          case PointerButton.SECONDARY:
            this.handleSecondaryPointerButton(event, pressed);
            break;
        }
      }
    }, {
      key: "handleKeyboardEvent",
      value: function handleKeyboardEvent(event, pressed) {
        var keyBindings = this.settings.keyBindings;

        if (keyBindings.has(event.keyCode)) {
          event.preventDefault();
          this.strategies.get(keyBindings.get(event.keyCode)).execute(pressed);
        }
      }
    }, {
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

          case "keydown":
            this.handleKeyboardEvent(event, true);
            break;

          case "keyup":
            this.handleKeyboardEvent(event, false);
            break;
        }
      }
    }, {
      key: "render",
      value: function render() {
        this.stats.begin();
        this.controls.update(this.clock.getDelta());
        this.terrain.update(this.camera.position);
        this.renderer.render(this.scene, this.camera);
        this.stats.end();
      }
    }, {
      key: "setEnabled",
      value: function setEnabled(enabled) {
        var dom = this.renderer.domElement;

        if (enabled) {
          this.cursor.position.copy(this.camera.position);
          this.cursor.visible = true;
          document.body.addEventListener("keyup", this);
          document.body.addEventListener("keydown", this);
          dom.addEventListener("contextmenu", this);
          dom.addEventListener("mousemove", this);
          dom.addEventListener("mousedown", this);
          dom.addEventListener("mouseup", this);
        } else {
          this.cursor.visible = false;
          document.body.removeEventListener("keyup", this);
          document.body.removeEventListener("keydown", this);
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
      key: "save",
      value: function save() {
        var dataURL = this.terrain.save();
        var a = document.createElement("a");
        a.href = dataURL;
        a.download = "terrain.json";
        a.click();
        URL.revokeObjectURL(dataURL);
      }
    }]);

    return Editor;
  }();

  var editor;

  function loadAssets(callback) {
    var assets = new Map();
    var loadingManager = new three.LoadingManager();
    var fileLoader = new three.FileLoader(loadingManager);
    var textureLoader = new three.TextureLoader(loadingManager);
    return new Promise(function (resolve, reject) {
      loadingManager.onError = reject;

      loadingManager.onProgress = function (item, loaded, total) {
        if (loaded === total) {
          resolve(assets);
        }
      };

      fileLoader.load("terrain/sphere.json", function (text) {
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
    });
  }

  function createErrorMessage(missingFeatures) {
    var message = document.createElement("p");
    var missingFeatureList = document.createElement("ul");
    var feature;
    var i, l;

    for (i = 0, l = missingFeatures.length; i < l; ++i) {
      feature = document.createElement("li");
      feature.appendChild(document.createTextNode(missingFeatures[i]));
      missingFeatureList.appendChild(feature);
    }

    message.appendChild(document.createTextNode("The following features are missing:"));
    message.appendChild(missingFeatureList);
    return message;
  }

  function render(now) {
    requestAnimationFrame(render);
    editor.render(now);
  }

  window.addEventListener("load", function main(event) {
    this.removeEventListener("load", main);
    var viewport = document.getElementById("viewport");
    var aside = document.getElementById("aside");
    var detector = new Detector();
    var missingFeatures = detector.getMissingFeatures(FeatureId.CANVAS, FeatureId.WEBGL, FeatureId.WORKER, FeatureId.FILE);

    if (missingFeatures === null) {
      loadAssets().then(function (assets) {
        viewport.removeChild(viewport.children[0]);
        aside.style.visibility = "visible";
        editor = new Editor(viewport, aside, assets);
        render();
      })["catch"](function (e) {
        return console.log(e);
      });
    } else {
      viewport.removeChild(viewport.children[0]);
      viewport.appendChild(createErrorMessage(missingFeatures));
    }
  });
  window.addEventListener("resize", function () {
    var timeoutId = 0;

    function handleResize(event) {
      var width = event.target.innerWidth;
      var height = event.target.innerHeight;
      editor.setSize(width, height);
      timeoutId = 0;
    }

    return function onResize(event) {
      if (timeoutId === 0) {
        timeoutId = setTimeout(handleResize, 66, event);
      }
    };
  }());

}(THREE));
