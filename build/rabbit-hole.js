/**
 * rabbit-hole v0.0.0 build Fri Dec 27 2019
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('synthetic-event'), require('math-ds'), require('iterator-result'), require('sparse-octree')) :
  typeof define === 'function' && define.amd ? define(['exports', 'synthetic-event', 'math-ds', 'iterator-result', 'sparse-octree'], factory) :
  (global = global || self, factory(global.RABBITHOLE = {}, global.SYNTHETICEVENT, global.MATHDS, global.ITERATORRESULT, global.SPARSEOCTREE));
}(this, (function (exports, syntheticEvent, mathDs, IteratorResult, sparseOctree) { 'use strict';

  IteratorResult = IteratorResult && IteratorResult.hasOwnProperty('default') ? IteratorResult['default'] : IteratorResult;

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
        var boundingBox = new mathDs.Box3();
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

  var ISOVALUE_BIAS = 1e-4;
  var INTERVAL_THRESHOLD = 1e-6;
  var ab = new mathDs.Vector3();
  var p = new mathDs.Vector3();
  var v = new mathDs.Vector3();
  var Edge = function () {
    function Edge() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new mathDs.Vector3();

      _classCallCheck(this, Edge);

      this.a = a;
      this.b = b;
      this.index = -1;
      this.coordinates = new mathDs.Vector3();
      this.t = 0.0;
      this.n = new mathDs.Vector3();
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
          p.addVectors(this.a, v.copy(ab).multiplyScalar(c));
          densityC = sdf.sample(p);

          if (Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {
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
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
        return target.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);
      }
    }, {
      key: "computeSurfaceNormal",
      value: function computeSurfaceNormal(sdf) {
        var position = this.computeZeroCrossingPosition(ab);
        var E = 1e-3;
        var dx = sdf.sample(p.addVectors(position, v.set(E, 0, 0))) - sdf.sample(p.subVectors(position, v.set(E, 0, 0)));
        var dy = sdf.sample(p.addVectors(position, v.set(0, E, 0))) - sdf.sample(p.subVectors(position, v.set(0, E, 0)));
        var dz = sdf.sample(p.addVectors(position, v.set(0, 0, E))) - sdf.sample(p.subVectors(position, v.set(0, 0, E)));
        this.n.set(dx, dy, dz).normalize();
      }
    }]);

    return Edge;
  }();

  var edge = new Edge();
  var offsetA = new mathDs.Vector3();
  var offsetB = new mathDs.Vector3();
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
            axes.push(sparseOctree.layout[a]);
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

  var m = new mathDs.Matrix4();
  var SignedDistanceFunction = function () {
    function SignedDistanceFunction(type) {
      var material = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Material.SOLID;

      _classCallCheck(this, SignedDistanceFunction);

      this.type = type;
      this.operation = null;
      this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));
      this.boundingBox = null;
      this.position = new mathDs.Vector3();
      this.quaternion = new mathDs.Quaternion();
      this.scale = new mathDs.Vector3(1, 1, 1);
      this.inverseTransformation = new mathDs.Matrix4();
      this.updateInverseTransformation();
      this.children = [];
    }

    _createClass(SignedDistanceFunction, [{
      key: "getTransformation",
      value: function getTransformation() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Matrix4();
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
        this.inverseTransformation.getInverse(this.getTransformation(m));
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
      _this.min = _construct(mathDs.Vector3, _toConsumableArray(parameters.min));
      _this.max = _construct(mathDs.Vector3, _toConsumableArray(parameters.max));
      return _this;
    }

    _createClass(FractalNoise, [{
      key: "computeBoundingBox",
      value: function computeBoundingBox() {
        this.bbox = new mathDs.Box3(this.min, this.max);
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
        var boundingBox = new mathDs.Box3();
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
      _this.s0 = _construct(mathDs.Vector4, _toConsumableArray(parameters.s));
      _this.r0 = _construct(mathDs.Vector3, _toConsumableArray(parameters.r));
      _this.s = new mathDs.Vector4();
      _this.r = new mathDs.Vector3();
      _this.ba = new mathDs.Vector2();
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
        var boundingBox = new mathDs.Box3();
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
  }(syntheticEvent.Event);

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
  }(syntheticEvent.EventTarget);

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
      this.keyBase = new mathDs.Vector3();
      this.key = new mathDs.Vector3();
      this.limit = new mathDs.Vector3();
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
        this.halfRange = new mathDs.Vector3(this.rangeX / 2, this.rangeY / 2, this.rangeZ / 2);
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
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new mathDs.Vector3();
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
      this.min = new mathDs.Vector3();
      this.max = new mathDs.Vector3();
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
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
        return target.addVectors(this.min, this.max).multiplyScalar(0.5);
      }
    }, {
      key: "getDimensions",
      value: function getDimensions() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
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

  var p$1 = new mathDs.Vector3();
  var v$1 = new mathDs.Vector3();
  var b0 = new mathDs.Box3();
  var b1 = new mathDs.Box3();
  var b2 = new mathDs.Box3();
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
          offset = sparseOctree.layout[i];
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
                keyDesign.unpackKey(key, v$1);
                v$1.x <<= 1;
                v$1.y <<= 1;
                v$1.z <<= 1;

                for (i = 0; i < 8; ++i) {
                  offset = sparseOctree.layout[i];
                  p$1.set(v$1.x + offset[0], v$1.y + offset[1], v$1.z + offset[2]);

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
            ranges.push(new mathDs.Box3(world.calculateKeyCoordinates(region.min, i), world.calculateKeyCoordinates(region.max, i)));
          }
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = keyDesign.keyRange(a, b)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            key = _step3.value;

            if (grid.has(key)) {
              keyDesign.unpackKey(key, v$1);

              _applyDifference(world, sdf, grid.get(key), v$1.x, v$1.y, v$1.z, lod);
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

  var v$2 = new mathDs.Vector3();
  var l = new mathDs.Line3();
  var b = new mathDs.Box3();
  var d = new mathDs.Box3();
  var r = new mathDs.Ray();
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

  function raycastOctant(world, octant, keyX, keyY, keyZ, lod, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {
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
        octantWrapper.id.set(lod, keyDesign.packKey(v$2.set(keyX, keyY, keyZ)));
        octantWrapper.min.copy(v$2).multiplyScalar(cellSize).add(world.min);
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
        currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

        do {
          i = flags ^ currentOctant;

          switch (currentOctant) {
            case 0:
              {
                if ((children & 1 << i) !== 0) {
                  offset = sparseOctree.layout[i];
                  v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, tx0, ty0, tz0, txm, tym, tzm, intersects);
                }

                currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
                break;
              }

            case 1:
              {
                if ((children & 1 << i) !== 0) {
                  offset = sparseOctree.layout[i];
                  v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, tx0, ty0, tzm, txm, tym, tz1, intersects);
                }

                currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
                break;
              }

            case 2:
              {
                if ((children & 1 << i) !== 0) {
                  offset = sparseOctree.layout[i];
                  v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, tx0, tym, tz0, txm, ty1, tzm, intersects);
                }

                currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
                break;
              }

            case 3:
              {
                if ((children & 1 << i) !== 0) {
                  offset = sparseOctree.layout[i];
                  v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, tx0, tym, tzm, txm, ty1, tz1, intersects);
                }

                currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
                break;
              }

            case 4:
              {
                if ((children & 1 << i) !== 0) {
                  offset = sparseOctree.layout[i];
                  v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, txm, ty0, tz0, tx1, tym, tzm, intersects);
                }

                currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
                break;
              }

            case 5:
              {
                if ((children & 1 << i) !== 0) {
                  offset = sparseOctree.layout[i];
                  v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, txm, ty0, tzm, tx1, tym, tz1, intersects);
                }

                currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
                break;
              }

            case 6:
              {
                if ((children & 1 << i) !== 0) {
                  offset = sparseOctree.layout[i];
                  v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, txm, tym, tz0, tx1, ty1, tzm, intersects);
                }

                currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
                break;
              }

            case 7:
              {
                if ((children & 1 << i) !== 0) {
                  offset = sparseOctree.layout[i];
                  v$2.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
                  raycastOctant(world, grid.get(keyDesign.packKey(v$2)), v$2.x, v$2.y, v$2.z, lod, txm, tym, tzm, tx1, ty1, tz1, intersects);
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
    var min = b.min.set(0, 0, 0);
    var max = b.max.subVectors(subtree.max, subtree.min);
    var dimensions = subtree.getDimensions(d.min);
    var halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);
    var origin = r.origin.copy(ray.origin);
    var direction = r.direction.copy(ray.direction);
    var invDirX, invDirY, invDirZ;
    var tx0, tx1, ty0, ty1, tz0, tz1;
    origin.sub(subtree.getCenter(v$2)).add(halfDimensions);
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
    raycastOctant(world, subtree.octant, keyCoordinates.x, keyCoordinates.y, keyCoordinates.z, world.getDepth(), tx0, ty0, tz0, tx1, ty1, tz1, intersects);
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
        var a = !world.containsPoint(r.copy(ray).origin) ? r.intersectBox(world, r.origin) : r.origin;
        var key, octant;
        var t, b, n;
        var dx, dy, dz;
        var ax, ay, az, bx, by, bz;
        var sx, sy, sz, exy, exz, ezy;
        octantWrapper.id.lod = lod;

        if (a !== null) {
          t = cellSize << 1;
          b = r.at(t, v$2);
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

  var v$3 = new mathDs.Vector3();

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
          offset = sparseOctree.layout[i];
          v$3.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
          key = keyDesign.packKey(v$3);
          child = grid.get(key);
          grid["delete"](key);
          removeChildren(world, child, v$3.x, v$3.y, v$3.z, lod);
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
      v$3.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);
      key = world.getKeyDesign().packKey(v$3);
      parent = grid.get(key);
      parent.children &= ~(1 << i);

      if (parent.children === 0) {
        grid["delete"](key);
        prune(world, v$3.x, v$3.y, v$3.z, lod);
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
        var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new mathDs.Vector3();
        var cellSize = this.cellSize << lod;
        v$3.subVectors(position, this.min);
        target.set(Math.trunc(v$3.x / cellSize), Math.trunc(v$3.y / cellSize), Math.trunc(v$3.z / cellSize));
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
            this.calculateKeyCoordinates(point, lod, v$3);
            result = grid.get(keyDesign.packKey(v$3));
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
            keyDesign.unpackKey(key, v$3);
            keyX = v$3.x;
            keyY = v$3.y;
            keyZ = v$3.z;
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

  var b$1 = new mathDs.Box3();
  var f = new mathDs.Frustum();
  var m$1 = new mathDs.Matrix4();
  var Clipmap = function (_EventTarget) {
    _inherits(Clipmap, _EventTarget);

    function Clipmap(world) {
      var _this;

      _classCallCheck(this, Clipmap);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Clipmap).call(this));
      _this.world = world;
      _this.position = new mathDs.Vector3(Infinity, Infinity, Infinity);
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
        f.setFromMatrix(m$1.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
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
  }(syntheticEvent.EventTarget);

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
  }(syntheticEvent.Event);

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
  }(syntheticEvent.EventTarget);

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
  }(syntheticEvent.Event);

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
  }(syntheticEvent.EventTarget);

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
      c1 = sparseOctree.edges[edge][0];
      c2 = sparseOctree.edges[edge][1];
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

  var coefficients = new mathDs.Vector2();
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
  var sm = new mathDs.SymmetricMatrix3();
  var m$2 = new mathDs.Matrix3();
  var a = new mathDs.Vector2();
  var b$2 = new mathDs.Vector3();

  function rotate01(vtav, v) {
    var se = vtav.elements;
    var ve = v.elements;
    var coefficients;

    if (se[1] !== 0.0) {
      coefficients = Givens.calculateCoefficients(se[0], se[1], se[3]);
      Schur.rotateQXY(a.set(se[0], se[3]), se[1], coefficients);
      se[0] = a.x;
      se[3] = a.y;
      Schur.rotateXY(a.set(se[2], se[4]), coefficients);
      se[2] = a.x;
      se[4] = a.y;
      se[1] = 0.0;
      Schur.rotateXY(a.set(ve[0], ve[3]), coefficients);
      ve[0] = a.x;
      ve[3] = a.y;
      Schur.rotateXY(a.set(ve[1], ve[4]), coefficients);
      ve[1] = a.x;
      ve[4] = a.y;
      Schur.rotateXY(a.set(ve[2], ve[5]), coefficients);
      ve[2] = a.x;
      ve[5] = a.y;
    }
  }

  function rotate02(vtav, v) {
    var se = vtav.elements;
    var ve = v.elements;
    var coefficients;

    if (se[2] !== 0.0) {
      coefficients = Givens.calculateCoefficients(se[0], se[2], se[5]);
      Schur.rotateQXY(a.set(se[0], se[5]), se[2], coefficients);
      se[0] = a.x;
      se[5] = a.y;
      Schur.rotateXY(a.set(se[1], se[4]), coefficients);
      se[1] = a.x;
      se[4] = a.y;
      se[2] = 0.0;
      Schur.rotateXY(a.set(ve[0], ve[6]), coefficients);
      ve[0] = a.x;
      ve[6] = a.y;
      Schur.rotateXY(a.set(ve[1], ve[7]), coefficients);
      ve[1] = a.x;
      ve[7] = a.y;
      Schur.rotateXY(a.set(ve[2], ve[8]), coefficients);
      ve[2] = a.x;
      ve[8] = a.y;
    }
  }

  function rotate12(vtav, v) {
    var se = vtav.elements;
    var ve = v.elements;
    var coefficients;

    if (se[4] !== 0.0) {
      coefficients = Givens.calculateCoefficients(se[3], se[4], se[5]);
      Schur.rotateQXY(a.set(se[3], se[5]), se[4], coefficients);
      se[3] = a.x;
      se[5] = a.y;
      Schur.rotateXY(a.set(se[1], se[2]), coefficients);
      se[1] = a.x;
      se[2] = a.y;
      se[4] = 0.0;
      Schur.rotateXY(a.set(ve[3], ve[6]), coefficients);
      ve[3] = a.x;
      ve[6] = a.y;
      Schur.rotateXY(a.set(ve[4], ve[7]), coefficients);
      ve[4] = a.x;
      ve[7] = a.y;
      Schur.rotateXY(a.set(ve[5], ve[8]), coefficients);
      ve[5] = a.x;
      ve[8] = a.y;
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

    return b$2.set(e[0], e[3], e[5]);
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
        var sigma = solveSymmetric(sm.copy(ata), m$2.identity());
        var invV = pseudoInverse(m$2, sigma);
        x.copy(atb).applyMatrix3(invV);
      }
    }]);

    return SingularValueDecomposition;
  }();

  var p$2 = new mathDs.Vector3();

  function calculateError(ata, atb, x) {
    ata.applyToVector3(p$2.copy(x));
    p$2.subVectors(atb, p$2);
    return p$2.dot(p$2);
  }

  var QEFSolver = function () {
    function QEFSolver() {
      _classCallCheck(this, QEFSolver);

      this.data = null;
      this.ata = new mathDs.SymmetricMatrix3();
      this.atb = new mathDs.Vector3();
      this.massPoint = new mathDs.Vector3();
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

      this.ata = new mathDs.SymmetricMatrix3();
      this.ata.set(0, 0, 0, 0, 0, 0);
      this.atb = new mathDs.Vector3();
      this.massPointSum = new mathDs.Vector3();
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
    this.position = new mathDs.Vector3();
    this.normal = new mathDs.Vector3();
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
        var position = new mathDs.Vector3();
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
  }(sparseOctree.CubicOctant);

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
      offset = sparseOctree.layout[i];
      index = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);
      material = Math.min(materialIndices[index], Material.SOLID);
      materials |= material << i;
    }

    for (edgeCount = 0, i = 0; i < 12; ++i) {
      c1 = sparseOctree.edges[i][0];
      c2 = sparseOctree.edges[i][1];
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

      var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new mathDs.Vector3();
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
        var intersection = new mathDs.Vector3();
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
                offset = sparseOctree.layout[sequence[i]];
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
  }(sparseOctree.Octree);

  var cellSize = 0;
  var cellPosition = new mathDs.Vector3();

  function computeIndexBounds(operation) {
    var s = cellSize;
    var n = HermiteData.resolution;
    var min = new mathDs.Vector3(0, 0, 0);
    var max = new mathDs.Vector3(n, n, n);
    var cellBounds = new mathDs.Box3(cellPosition, cellPosition.clone().addScalar(cellSize));
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

    return new mathDs.Box3(min, max);
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
    var offset = new mathDs.Vector3();
    var position = new mathDs.Vector3();
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
    var offsetA = new mathDs.Vector3();
    var offsetB = new mathDs.Vector3();
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
      axis = sparseOctree.layout[a];
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

})));
