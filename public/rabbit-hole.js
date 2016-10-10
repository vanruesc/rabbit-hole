/**
 * rabbit-hole v0.0.0 build Jul 15 2016
 * https://github.com/vanruesc/rabbit-hole
 * Copyright 2016 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
   typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
   (factory((global.RABBITHOLE = global.RABBITHOLE || {}),global.THREE));
}(this, function (exports,THREE) { 'use strict';

   THREE = 'default' in THREE ? THREE['default'] : THREE;

   /**
    * Look-up tables for the Dual Contouring algorithm.
    *
    * @class Tables
    * @submodule isosurface
    * @static
    */

   var vertexMap = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

   /**
    * A voxel edge map.
    *
    * @property edgeMap
    * @type Array
    * @static
    * @final
    */

   var edgeMap = [

   // X-Axis.
   new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]),

   // Y-Axis.
   new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]),

   // Z-Axis.
   new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

   /**
    * A face mask for cell processing.
    *
    * @property cellProcFaceMask
    * @type Array
    * @static
    * @final
    */

   var cellProcFaceMask = [new Uint8Array([0, 4, 0]), new Uint8Array([1, 5, 0]), new Uint8Array([2, 6, 0]), new Uint8Array([3, 7, 0]), new Uint8Array([0, 2, 1]), new Uint8Array([4, 6, 1]), new Uint8Array([1, 3, 1]), new Uint8Array([5, 7, 1]), new Uint8Array([0, 1, 2]), new Uint8Array([2, 3, 2]), new Uint8Array([4, 5, 2]), new Uint8Array([6, 7, 2])];

   /**
    * An edge mask for cell processing.
    *
    * @property cellProcEdgeMask
    * @type Array
    * @static
    * @final
    */

   var cellProcEdgeMask = [new Uint8Array([0, 1, 2, 3, 0]), new Uint8Array([4, 5, 6, 7, 0]), new Uint8Array([0, 4, 1, 5, 1]), new Uint8Array([2, 6, 3, 7, 1]), new Uint8Array([0, 2, 4, 6, 2]), new Uint8Array([1, 3, 5, 7, 2])];

   /**
    * A face mask for face processing.
    *
    * @property faceProcFaceMask
    * @type Array
    * @static
    * @final
    */

   var faceProcFaceMask = [[new Uint8Array([4, 0, 0]), new Uint8Array([5, 1, 0]), new Uint8Array([6, 2, 0]), new Uint8Array([7, 3, 0])], [new Uint8Array([2, 0, 1]), new Uint8Array([6, 4, 1]), new Uint8Array([3, 1, 1]), new Uint8Array([7, 5, 1])], [new Uint8Array([1, 0, 2]), new Uint8Array([3, 2, 2]), new Uint8Array([5, 4, 2]), new Uint8Array([7, 6, 2])]];

   /**
    * A face mask for edge processing.
    *
    * @property faceProcEdgeMask
    * @type Array
    * @static
    * @final
    */

   var faceProcEdgeMask = [[new Uint8Array([1, 4, 0, 5, 1, 1]), new Uint8Array([1, 6, 2, 7, 3, 1]), new Uint8Array([0, 4, 6, 0, 2, 2]), new Uint8Array([0, 5, 7, 1, 3, 2])], [new Uint8Array([0, 2, 3, 0, 1, 0]), new Uint8Array([0, 6, 7, 4, 5, 0]), new Uint8Array([1, 2, 0, 6, 4, 2]), new Uint8Array([1, 3, 1, 7, 5, 2])], [new Uint8Array([1, 1, 0, 3, 2, 0]), new Uint8Array([1, 5, 4, 7, 6, 0]), new Uint8Array([0, 1, 5, 0, 4, 1]), new Uint8Array([0, 3, 7, 2, 6, 1])]];

   /**
    * An edge mask for edge processing.
    *
    * @property edgeProcEdgeMask
    * @type Array
    * @static
    * @final
    */

   var edgeProcEdgeMask = [[new Uint8Array([3, 2, 1, 0, 0]), new Uint8Array([7, 6, 5, 4, 0])], [new Uint8Array([5, 1, 4, 0, 1]), new Uint8Array([7, 3, 6, 2, 1])], [new Uint8Array([6, 4, 2, 0, 2]), new Uint8Array([7, 5, 3, 1, 2])]];

   /**
    * An edge mask.
    *
    * @property processEdgeMask
    * @type Array
    * @static
    * @final
    */

   var processEdgeMask = [new Uint8Array([3, 2, 1, 0]), new Uint8Array([7, 5, 6, 4]), new Uint8Array([11, 10, 9, 8])];

   /**
    * An enumeration of density constants.
    *
    * @class Density
    * @submodule volume
    * @static
    */

   var Density = {

   	/**
     * An indicator for empty space.
     *
     * @property HOLLOW
     * @type Number
     * @static
     * @final
     */

   	HOLLOW: 0,

   	/**
     * An indicator for solid material.
     *
     * @property SOLID
     * @type Number
     * @static
     * @final
     */

   	SOLID: 1

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

   /**
    * An abstract Signed Distance Function.
    *
    * An SDF describes the signed euclidean distance to the surface of an object, 
    * effectively describing its density at every point in 3D space. It yields 
    * negative values for points that lie inside the volume and positive values 
    * for points outside. The value is zero at the exact boundary of the object.
    *
    * @class SignedDistanceFunction
    * @submodule sdf
    * @constructor
    */

   var SignedDistanceFunction = function () {
   	function SignedDistanceFunction() {
   		classCallCheck(this, SignedDistanceFunction);
   	}

   	/**
     * Samples the volume's density at the given point in space.
     *
     * @method sample
     * @throws {Error} An error is thrown if the method is not overridden.
     * @param {Vector3} p - A point.
     * @return {Number} The euclidean distance to the surface.
     */

   	createClass(SignedDistanceFunction, [{
   		key: "sample",
   		value: function sample(p) {

   			throw new Error("Sample method not implemented!");
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
    * @param {Vector3} min - The min position.
    * @param {Vector3} size - The size.
    * @param {Uint8ClampedArray} data - The heightmap data.
    */

   var Heightfield = function (_SignedDistanceFuncti) {
   		inherits(Heightfield, _SignedDistanceFuncti);

   		function Heightfield(min, size, data) {
   				classCallCheck(this, Heightfield);


   				/**
        * The min.
        *
        * @property min
        * @type Vector3
        * @private
        */

   				var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Heightfield).call(this));

   				_this.min = min !== undefined ? min : null;

   				/**
        * The size.
        *
        * @property size
        * @type Vector3
        * @private
        */

   				_this.size = size !== undefined ? size : null;

   				/**
        * The data.
        *
        * @property data
        * @type Uint8ClampedArray
        * @private
        */

   				_this.data = data !== undefined ? data : null;

   				return _this;
   		}

   		/**
      * Samples the volume's density at the given point in space.
      *
      * @method sample
      * @param {Vector3} p - A point.
      * @return {Number} The euclidean distance to the surface.
      */

   		createClass(Heightfield, [{
   				key: "sample",
   				value: function sample(p) {

   						var min = this.min;
   						var size = this.size;

   						var x = Math.max(min.x, Math.min(min.x + size.x, p.x - min.x));
   						var z = Math.max(min.z, Math.min(min.z + size.z, p.z - min.z));

   						var y = p.y - min.y;

   						return y - this.data[z * size.x + x] / 255 * size.y;
   				}
   		}]);
   		return Heightfield;
   }(SignedDistanceFunction);

   /**
    * A Signed Distance Function that describes a sphere.
    *
    * @class Sphere
    * @submodule sdf
    * @extends SignedDistanceFunction
    * @constructor
    * @param {Vector3} origin - The origin.
    * @param {Number} radius - The radius.
    */

   var Sphere = function (_SignedDistanceFuncti) {
   		inherits(Sphere, _SignedDistanceFuncti);

   		function Sphere(origin, radius) {
   				classCallCheck(this, Sphere);


   				/**
        * The origin.
        *
        * @property origin
        * @type Vector3
        * @private
        */

   				var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Sphere).call(this));

   				_this.origin = origin !== undefined ? origin : null;

   				/**
        * The radius.
        *
        * @property radius
        * @type Number
        * @private
        */

   				_this.radius = radius !== undefined ? radius : 0.0;

   				return _this;
   		}

   		/**
      * Samples the volume's density at the given point in space.
      *
      * @method sample
      * @param {Vector3} p - A point.
      * @return {Number} The euclidean distance to the surface.
      */

   		createClass(Sphere, [{
   				key: "sample",
   				value: function sample(p) {

   						var origin = this.origin;

   						var dx = p.x - origin.x;
   						var dy = p.y - origin.y;
   						var dz = p.z - origin.z;

   						var length = Math.sqrt(dx * dx + dy * dy + dz * dz);

   						return length - this.radius;
   				}
   		}]);
   		return Sphere;
   }(SignedDistanceFunction);

   /**
    * A Signed Distance Function that describes a torus.
    *
    * @class Torus
    * @submodule sdf
    * @extends SignedDistanceFunction
    * @constructor
    * @param {Vector3} origin - The origin.
    * @param {Number} R - The distance from the center to the tube.
    * @param {Number} r - The radius of the tube.
    */

   var Torus = function (_SignedDistanceFuncti) {
   		inherits(Torus, _SignedDistanceFuncti);

   		function Torus(origin, R, r) {
   				classCallCheck(this, Torus);


   				/**
        * The origin.
        *
        * @property origin
        * @type Vector3
        * @private
        */

   				var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Torus).call(this));

   				_this.origin = origin !== undefined ? origin : null;

   				/**
        * The distance from the center to the tube.
        *
        * @property R
        * @type Number
        * @private
        */

   				_this.R = R !== undefined ? R : 0.0;

   				/**
        * The radius of the tube.
        *
        * @property r
        * @type Number
        * @private
        */

   				_this.r = r !== undefined ? r : 0.0;

   				return _this;
   		}

   		/**
      * Samples the volume's density at the given point in space.
      *
      * @method sample
      * @param {Vector3} p - A point.
      * @return {Number} The euclidean distance to the surface.
      */

   		createClass(Torus, [{
   				key: "sample",
   				value: function sample(p) {

   						var origin = this.origin;

   						var dx = p.x - origin.x;
   						var dy = p.y - origin.y;
   						var dz = p.z - origin.z;

   						var q = Math.sqrt(dx * dx + dz * dz) - this.R;
   						var length = Math.sqrt(q * q + dy * dy);

   						return length - this.r;
   				}
   		}]);
   		return Torus;
   }(SignedDistanceFunction);

   /**
    * A Signed Distance Function that describes a plane.
    *
    * @class Plane
    * @submodule sdf
    * @extends SignedDistanceFunction
    * @constructor
    * @param {Vector3} normal - The normal.
    * @param {Number} constant - The constant.
    */

   var Plane = function (_SignedDistanceFuncti) {
   	inherits(Plane, _SignedDistanceFuncti);

   	function Plane(normal, constant) {
   		classCallCheck(this, Plane);


   		/**
      * The normal.
      *
      * @property normal
      * @type Vector3
      * @private
      */

   		var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Plane).call(this));

   		_this.normal = normal !== undefined ? normal : null;

   		/**
      * The constant.
      *
      * @property constant
      * @type Number
      * @private
      */

   		_this.constant = constant !== undefined ? constant : 0.0;

   		return _this;
   	}

   	/**
     * Samples the volume's density at the given point in space.
     *
     * @method sample
     * @param {Vector3} p - A point.
     * @return {Number} The euclidean distance to the surface.
     */

   	createClass(Plane, [{
   		key: "sample",
   		value: function sample(p) {

   			return this.normal.dot(p) + this.constant;
   		}
   	}]);
   	return Plane;
   }(SignedDistanceFunction);

   /**
    * A Signed Distance Function that describes a box.
    *
    * @class Box
    * @submodule sdf
    * @extends SignedDistanceFunction
    * @constructor
    * @param {Vector3} origin - The origin.
    * @param {Number} halfSize - The half size.
    */

   var Box = function (_SignedDistanceFuncti) {
   		inherits(Box, _SignedDistanceFuncti);

   		function Box(origin, halfSize) {
   				classCallCheck(this, Box);


   				/**
        * The origin.
        *
        * @property origin
        * @type Vector3
        * @private
        */

   				var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Box).call(this));

   				_this.origin = origin !== undefined ? origin : null;

   				/**
        * The halfSize.
        *
        * @property halfSize
        * @type Vector3
        * @private
        */

   				_this.halfSize = halfSize !== undefined ? halfSize : null;

   				return _this;
   		}

   		/**
      * Samples the volume's density at the given point in space.
      *
      * @method sample
      * @param {Vector3} p - A point.
      * @return {Number} The euclidean distance to the surface.
      */

   		createClass(Box, [{
   				key: "sample",
   				value: function sample(p) {

   						var origin = this.origin;
   						var halfSize = this.halfSize;

   						// Compute the distance to the hull.
   						var dx = Math.abs(p.x - origin.x) - halfSize.x;
   						var dy = Math.abs(p.y - origin.y) - halfSize.y;
   						var dz = Math.abs(p.z - origin.z) - halfSize.z;

   						var m = Math.max(dx, Math.max(dy, dz));

   						var mx0 = Math.max(dx, 0);
   						var my0 = Math.max(dy, 0);
   						var mz0 = Math.max(dz, 0);

   						var length = Math.sqrt(mx0 * mx0 + my0 * my0 + mz0 * mz0);

   						return Math.min(m, 0) + length;
   				}
   		}]);
   		return Box;
   }(SignedDistanceFunction);

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
     * @param {Number} m00 - The value of the first row, first column.
     * @param {Number} m01 - The value of the first row, second column.
     * @param {Number} m02 - The value of the first row, third column.
     * @param {Number} m11 - The value of the second row, second column.
     * @param {Number} m12 - The value of the second row, third column.
     * @param {Number} m22 - The value of the third row, third column.
     * @return {SymmetricMatrix3} This matrix.
     * @chainable
     */

   	createClass(SymmetricMatrix3, [{
   		key: "set",
   		value: function set(m00, m01, m02, m11, m12, m22) {

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
      * @return {SymmetricMatrix3} This matrix.
      * @chainable
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
      * @param {Matrix3} m - A matrix.
      * @return {SymmetricMatrix3} This matrix.
      * @chainable
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
      * @param {Matrix3} m - A matrix.
      * @return {SymmetricMatrix3} This matrix.
      * @chainable
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
      * Calculates the sum of all matrix components squared.
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
      * Calculates the sum of all matrix components squared except for the main 
      * diagonal.
      *
      * @method off
      * @return {Number} The offset of this matrix.
      */

   	}, {
   		key: "off",
   		value: function off() {

   			var e = this.elements;

   			return Math.sqrt(2 * (e[1] * e[1] + e[2] * e[2] + e[4] * e[4]));
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
   		value: function set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

   			var te = this.elements;

   			te[0] = m00;te[1] = m10;te[2] = m20;
   			te[3] = m01;te[4] = m11;te[5] = m21;
   			te[6] = m02;te[7] = m12;te[8] = m22;

   			return this;
   		}

   		/**
      * Sets this matrix to the identity matrix.
      *
      * @method identity
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
   						//e[6] = m02;

   						e[1] = c * m10 - s * m11;
   						e[4] = s * m10 + c * m11;
   						//e[7] = m12;

   						e[2] = c * m20 - s * m21;
   						e[5] = s * m20 + c * m21;
   						//e[8] = m22;
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
   						//e[3] = m01;
   						e[6] = s * m00 + c * m02;

   						e[1] = c * m10 - s * m12;
   						//e[4] = m11;
   						e[7] = s * m10 + c * m12;

   						e[2] = c * m20 - s * m22;
   						//e[5] = m21;
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

   						//e[0] = m00;
   						e[3] = c * m01 - s * m02;
   						e[6] = s * m01 + c * m02;

   						//e[1] = m10;
   						e[4] = c * m11 - s * m12;
   						e[7] = s * m11 + c * m12;

   						//e[2] = m20;
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

   						//e[5] = m22;

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

   						//e[3] = m11;
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

   						//e[0] = m00;
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

   	// Count how many singular values have not been truncated.
   	var dimension = 3 - ((a0 === 0.0) + (a1 === 0.0) + (a2 === 0.0));

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
      * @param {Vector3} x - A vector.
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
    * A vector with three components.
    *
    * This class is a copy of THREE.Vector3. It can be removed  as soon as three.js 
    * starts supporting ES6 modules.
    *
    * @class Vector3
    * @submodule math
    * @constructor
    * @param {Number} [x=0] - The x value.
    * @param {Number} [y=0] - The y value.
    * @param {Number} [z=0] - The z value.
    */

   var Vector3 = function () {
   	function Vector3(x, y, z) {
   		classCallCheck(this, Vector3);


   		/**
      * The x component.
      *
      * @property x
      * @type Number
      */

   		this.x = x || 0;

   		/**
      * The y component.
      *
      * @property y
      * @type Number
      */

   		this.y = y || 0;

   		/**
      * The z component.
      *
      * @property z
      * @type Number
      */

   		this.z = z || 0;
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

   	createClass(Vector3, [{
   		key: "set",
   		value: function set(x, y, z) {

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
      * @param {Array} array - An array.
      * @param {Number} offset - An offset.
      * @return {Vector3} This vector.
      */

   	}, {
   		key: "fromArray",
   		value: function fromArray(array, offset) {

   			if (offset === undefined) {
   				offset = 0;
   			}

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
   		value: function toArray(array, offset) {

   			if (array === undefined) {
   				array = [];
   			}
   			if (offset === undefined) {
   				offset = 0;
   			}

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
      * Adds a scalar to this vector.
      *
      * @method addScalar
      * @param {Vector3} s - The scalar to add.
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
      * @param {Vector3} s - The scalar to subtract.
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
      * @param {Vector3} s - A scalar.
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
      * @param {Vector3} s - A scalar.
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
      * Calculates the length squared of this vector.
      *
      * @method lengthSq
      * @return {Vector3} This vector.
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
      * @return {Vector3} This vector.
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
      * @return {Vector3} This vector.
      */

   	}, {
   		key: "distanceTo",
   		value: function distanceTo(v) {

   			return Math.sqrt(this.distanceToSquared(v));
   		}

   		/**
      * Calculates the distance squared to a given vector.
      *
      * @method distanceToSquared
      * @param {Vector3} v - A vector.
      * @return {Vector3} This vector.
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
   	return Vector3;
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

   				this.atb = new Vector3();

   				/**
        * Used to calculate the error of the computed position.
        *
        * @property btb
        * @type Number
        */

   				this.btb = 0;

   				/**
        * An accumulation of the exact intersection points on the edges of a voxel.
        *
        * @property massPoint
        * @type Vector3
        * @private
        */

   				this.massPoint = new Vector3();

   				/**
        * The amount of accumulated points.
        *
        * @property numPoints
        * @type Number
        */

   				this.numPoints = 0;

   				/**
        * The dimension of the mass point. This value is used when mass points are 
        * accumulated during a simplification process.
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
      */

   		createClass(QEFData, [{
   				key: "set",
   				value: function set(ata, atb, btb, massPoint, numPoints) {

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
        */

   		}, {
   				key: "copy",
   				value: function copy(d) {

   						return this.set(d.ata, d.atb, d.btb, d.massPoint, d.numPoints);
   				}

   				/**
        * Adds data.
        *
        * @method add
        */

   		}, {
   				key: "add",
   				value: function add(d) {

   						var highestDimension = void 0;

   						this.ata.add(d.ata);
   						this.atb.add(d.atb);
   						this.btb += d.btb;

   						if (this.massPointDimension === d.massPointDimension) {

   								this.massPoint.add(d.massPoint);
   						} else if (d.massPointDimension > this.massPointDimension) {

   								// Adopt the mass point of the higher dimension.
   								this.massPoint.copy(d.massPoint);
   								this.massPointDimension = d.massPointDimension;
   						}

   						this.numPoints += d.numPoints;
   				}

   				/**
        * Clears this data instance.
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
        * Clones this data instance.
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
    * A Quaratic Error Function solver.
    *
    * Finds a point inside a voxel that minimises the sum of the squares of the 
    * distances from the voxel's internal point to each of the planes associated 
    * with the voxel.
    *
    * @class QEFSolver
    * @submodule math
    * @constructor
    * @param {Number} [svdThreshold=1e-6] - A threshold for the Singular Value Decomposition error.
    * @param {Number} [svdSweeps=4] - Number of Singular Value Decomposition sweeps.
    * @param {Number} [pseudoInverseThreshold=1e-6] - A threshold for the pseudo inverse error.
    */

   var QEFSolver = function () {
   		function QEFSolver(svdThreshold, svdSweeps, pseudoInverseThreshold) {
   				classCallCheck(this, QEFSolver);


   				/**
        * A Singular Value Decomposition error threshold.
        *
        * @property svdThreshold
        * @type Number
        * @private
        * @default 1e-6
        */

   				this.svdThreshold = svdThreshold !== undefined ? svdThreshold : 1e-6;

   				/**
        * The number of Singular Value Decomposition sweeps.
        *
        * @property svdSweeps
        * @type Number
        * @private
        * @default 4
        */

   				this.svdSweeps = svdSweeps !== undefined ? svdSweeps : 4;

   				/**
        * A pseudo inverse error threshold.
        *
        * @property pseudoInverseThreshold
        * @type Number
        * @private
        * @default 1e-6
        */

   				this.pseudoInverseThreshold = pseudoInverseThreshold !== undefined ? pseudoInverseThreshold : 1e-6;

   				/**
        * QEF data storage.
        *
        * @property data
        * @type QEFData
        * @private
        */

   				this.data = new QEFData();

   				/**
        * The average of the exact intersection points on the edges of a voxel.
        *
        * @property massPoint
        * @type Vector3
        * @private
        */

   				this.massPoint = new Vector3();

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

   				this.atb = new Vector3();

   				/**
        * A calculated vertex position.
        *
        * @property x
        * @type Vector3
        * @private
        */

   				this.x = new Vector3();

   				/**
        * Indicates whether this solver has a valid solution.
        *
        * @property hasSolution
        * @type Boolean
        */

   				this.hasSolution = false;
   		}

   		/**
      * The error of the previously computed position.
      *
      * @property error
      * @type Number
      * @final
      */

   		createClass(QEFSolver, [{
   				key: "add",


   				/**
        * Adds the given position and normal data.
        *
        * @method add
        * @param {Vector3} p - A position.
        * @param {Vector3} n - A normal.
        */

   				value: function add(p, n) {

   						var nx = n.x;
   						var ny = n.y;
   						var nz = n.z;

   						var dot = n.dot(p);

   						var data = this.data;
   						var ata = data.ata.elements;
   						var atb = data.atb;

   						ata[0] += nx * nx;ata[1] += nx * ny;ata[2] += nx * nz;
   						ata[3] += ny * ny;ata[4] += ny * nz;
   						ata[5] += nz * nz;

   						atb.x += dot * nx;
   						atb.y += dot * ny;
   						atb.z += dot * nz;

   						data.btb += dot * dot;

   						data.massPoint.add(p);

   						++data.numPoints;

   						this.hasSolution = false;
   				}

   				/**
        * Accumulates the given data.
        *
        * @method addData
        * @param {QEFData} d - The data to add.
        */

   		}, {
   				key: "addData",
   				value: function addData(d) {

   						this.data.add(d);
   						this.hasSolution = false;
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

   						var svdError = void 0,
   						    mp = void 0;

   						if (data.numPoints === 0) {

   								console.warn("Invalid QEF solve operation. No data points.");
   						} else if (this.hasSolution) {

   								console.warn("The QEF already has a solution.");
   						} else {

   								// At this point the mass point will actually be a sum, so divide it to make it the average.
   								massPoint.copy(data.massPoint);
   								massPoint.divideScalar(data.numPoints);

   								ata.copy(data.ata);
   								atb.copy(data.atb);

   								mp = ata.applyToVector3(massPoint.clone());
   								atb.sub(mp);

   								x.set(0, 0, 0);

   								data.massPointDimension = SingularValueDecomposition.solveSymmetric(ata, atb, x, this.svdThreshold, this.svdSweeps, this.pseudoInverseThreshold);

   								//svdError = SingularValueDecomposition.calculateError(ata, atb, x);

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

   						this.data.clear();
   						this.hasSolution = false;
   				}
   		}, {
   				key: "error",
   				get: function get() {

   						var x = this.x;

   						var error = Infinity;
   						var atax = void 0;

   						if (this.hasSolution) {

   								atax = this.ata.applyToVector3(x.clone());
   								error = x.dot(atax) - 2.0 * x.dot(this.atb) + this.data.btb;
   						} else {

   								console.warn("QEF has no solution. Can't calculate error.");
   						}

   						return error;
   				}
   		}]);
   		return QEFSolver;
   }();

   /**
    * An octant.
    *
    * @class Octant
    * @submodule isosurface
    * @constructor
    */

   var Octant = function Octant(min, size, type) {
   		classCallCheck(this, Octant);


   		/**
      * The position.
      *
      * @property min
      * @type Vector3
      */

   		this.min = min;

   		/**
      * The size.
      *
      * @property size
      * @type Number
      */

   		this.size = size;

   		/**
      * The type.
      *
      * @property type
      * @type OctantType
      */

   		this.type = type;

   		/**
      * The children.
      *
      * @property children
      * @type Array
      */

   		this.children = [];

   		/**
      * An object containing draw information.
      *
      * @property drawInfo
      * @type DrawInfo
      */

   		this.drawInfo = null;
   };

   /**
    * An enumeration of octant types.
    *
    * @class OctantType
    * @submodule isosurface
    * @static
    */

   var OctantType = {

   	/**
     * Internal node.
     *
     * @property Internal
     * @type Number
     * @static
     * @final
     */

   	Internal: 0,

   	/**
     * Pseudo leaf node.
     *
     * @property Pseudo
     * @type Number
     * @static
     * @final
     */

   	Pseudo: 1,

   	/**
     * Leaf node.
     *
     * @property Leaf
     * @type Number
     * @static
     * @final
     */

   	Leaf: 2

   };

   /**
    * Octant draw information.
    *
    * @class DrawInfo
    * @submodule isosurface
    * @constructor
    */

   var DrawInfo = function DrawInfo() {
   		classCallCheck(this, DrawInfo);


   		/**
      * The index of the vertex. Used to construct polygons.
      *
      * @property index
      * @type Number
      */

   		this.index = -1;

   		/**
      * The position of the vertex.
      *
      * @property position
      * @type Vector3
      */

   		this.position = null;

   		/**
      * The normal of the vertex.
      *
      * @property averageNormal
      * @type Vector3
      */

   		this.averageNormal = null;

   		/**
      * Contains information about all eight grid point material indices.
      *
      * @property materials
      * @type Number
      */

   		this.materials = 0;

   		/**
      * Stores QEF data. Used to calculate the vertex position.
      *
      * @property qef
      * @type QEFData
      */

   		this.qef = null;
   };

   /**
    * A Dual Contouring octree.
    *
    * @class Octree
    * @submodule isosurface
    * @constructor
    * @param {Chunk} chunk - A chunk of hermite data.
    */

   var Octree = function () {
   		function Octree(size, sdf) {
   				classCallCheck(this, Octree);


   				/**
        * The root octant.
        *
        * @property root
        * @type Octant
        * @private
        */

   				this.root = new Octant(new Vector3(), size, OctantType.Internal);

   				this.sdf = sdf;
   		}

   		/**
      * Approximates the zero crossing by finding the smallest density along the 
      * edge.
      *
      * @method approximateZeroCrossing
      * @private
      * @static
      * @param {DensityFunction} densityFunction - A function that defines a density field.
      * @param {Number} [steps=5] - The amount of interpolation steps.
      * @return {Number} The zero crossing interpolation value.
      */

   		createClass(Octree, [{
   				key: "approximateZeroCrossing",
   				value: function approximateZeroCrossing(p0, p1, steps) {

   						if (steps === undefined) {
   								steps = 5;
   						}

   						var increment = 1.0 / steps;

   						var p = new Vector3();
   						var v = new Vector3();

   						var minValue = Infinity;
   						var T = 0.0;
   						var t = 0.0;
   						var density = void 0;

   						while (t <= 1.0) {

   								p.addVectors(p0, v.subVectors(p1, p0).multiplyScalar(t));
   								density = Math.abs(this.sdf.sample(p));

   								if (density < minValue) {

   										minValue = density;
   										T = t;
   								}

   								t = t + increment;
   						}

   						return p.addVectors(p0, v.subVectors(p1, p0).multiplyScalar(T));
   				}

   				/**
        * 
        *
        * @method calculateSurfaceNormal
        * @private
        * @static
        * @param {DensityFunction} densityFunction - A function that defines a density field.
        * @return {Vector3} The normal.
        */

   		}, {
   				key: "calculateSurfaceNormal",
   				value: function calculateSurfaceNormal(p) {

   						var H = 0.001;

   						var v0 = new Vector3();
   						var v1 = new Vector3();

   						var dx = this.sdf.sample(v0.addVectors(p, v1.set(H, 0.0, 0.0))) - this.sdf.sample(v0.subVectors(p, v1.set(H, 0.0, 0.0)));
   						var dy = this.sdf.sample(v0.addVectors(p, v1.set(0.0, H, 0.0))) - this.sdf.sample(v0.subVectors(p, v1.set(0.0, H, 0.0)));
   						var dz = this.sdf.sample(v0.addVectors(p, v1.set(0.0, 0.0, H))) - this.sdf.sample(v0.subVectors(p, v1.set(0.0, 0.0, H)));

   						return v0.set(dx, dy, dz).normalize();
   				}

   				/**
        * Simplifies the given octant node.
        *
        * @method simplify
        * @private
        * @static
        * @param {Octant} node - The node to simplify. 
        * @param {Number} threshold - A QEF error threshold.
        */

   		}, {
   				key: "constructLeaf",


   				/**
        * 
        *
        * @method constructLeaf
        * @private
        * @static
        */

   				value: function constructLeaf(leaf) {

   						var MAX_CROSSINGS = 6;

   						var cornerPos = new Vector3();
   						var averageNormal = new Vector3();

   						var v = new Vector3();
   						var p1 = new Vector3();
   						var p2 = new Vector3();

   						var qef = void 0;

   						var materials = void 0,
   						    density = void 0;
   						var material = void 0,
   						    edgeCount = void 0;

   						var i = void 0;

   						var c1 = void 0,
   						    c2 = void 0,
   						    m1 = void 0,
   						    m2 = void 0;
   						var min = void 0,
   						    size = void 0;
   						var p = void 0,
   						    n = void 0;

   						var drawInfo = void 0;

   						if (leaf !== null && leaf.size === 1) {

   								materials = 0;

   								for (i = 0; i < 8; ++i) {

   										cornerPos.addVectors(leaf.min, v.fromArray(vertexMap[i]));

   										density = this.sdf.sample(cornerPos);
   										material = density < 0 ? Density.SOLID : Density.HOLLOW;

   										materials = materials | material << i;
   								}

   								if (materials === 0 || materials === 255) {

   										// Voxel is fully inside or outside the volume.
   										leaf = null;
   								} else {

   										// The voxel contains the surface, so find the edge intersections.
   										qef = new QEFSolver();
   										edgeCount = 0;

   										for (i = 0; i < 12 && edgeCount < MAX_CROSSINGS; ++i) {

   												c1 = edgeMap[i][0];
   												c2 = edgeMap[i][1];

   												m1 = materials >> c1 & 1;
   												m2 = materials >> c2 & 1;

   												// Check if there is a zero crossing on the edge.
   												if (m1 !== m2) {

   														p1.addVectors(leaf.min, v.fromArray(vertexMap[c1]));
   														p2.addVectors(leaf.min, v.fromArray(vertexMap[c2]));

   														p = this.approximateZeroCrossing(p1, p2, 8);
   														n = this.calculateSurfaceNormal(p);

   														qef.add(p, n);

   														averageNormal.add(n);

   														++edgeCount;
   												}
   										}

   										p.copy(qef.solve());

   										drawInfo = new DrawInfo();
   										drawInfo.position = p;
   										drawInfo.qef = qef.data;

   										min = leaf.min;
   										size = leaf.size;

   										// Check if the computed position lies outside the voxel's bounds.
   										if (drawInfo.position.x < min.x || drawInfo.position.x > min.x + size || drawInfo.position.y < min.y || drawInfo.position.y > min.y + size || drawInfo.position.z < min.z || drawInfo.position.z > min.z + size) {

   												drawInfo.position.copy(qef.massPoint);
   										}

   										drawInfo.averageNormal = averageNormal.divideScalar(edgeCount).normalize();
   										drawInfo.materials = materials;

   										leaf.type = OctantType.Leaf;
   										leaf.drawInfo = drawInfo;
   								}
   						}

   						return leaf;
   				}

   				/**
        * 
        *
        * @method constructOctants
        * @private
        * @static
        */

   		}, {
   				key: "constructOctants",
   				value: function constructOctants(node) {

   						var v = new Vector3();

   						var childSize = void 0;
   						var hasChildren = false;
   						var min = void 0,
   						    child = void 0;

   						var i = void 0;

   						if (node !== null) {

   								if (node.size === 1) {

   										node = this.constructLeaf(node);
   								} else {

   										childSize = node.size / 2;

   										for (i = 0; i < 8; ++i) {

   												min = new Vector3();
   												min.addVectors(node.min, v.fromArray(vertexMap[i]).multiplyScalar(childSize));

   												child = new Octant(min, childSize, OctantType.Internal);

   												node.children[i] = this.constructOctants(child);
   												hasChildren = hasChildren | node.children[i] !== null;
   										}

   										if (!hasChildren) {

   												node = null;
   										}
   								}
   						}

   						return node;
   				}
   		}], [{
   				key: "simplify",
   				value: function simplify(node, threshold) {

   						var signs = [-1, -1, -1, -1, -1, -1, -1, -1];

   						var qef = void 0;

   						var midSign = void 0,
   						    edgeCount = void 0;
   						var isCollapsible = void 0;

   						var position = void 0,
   						    drawInfo = void 0;
   						var child = void 0,
   						    error = void 0;
   						var min = void 0,
   						    size = void 0;

   						var i = void 0;

   						if (node !== null && node.type === OctantType.Internal) {

   								qef = new QEFSolver();

   								midSign = -1;
   								edgeCount = 0;

   								isCollapsible = true;

   								for (i = 0; i < 8; ++i) {

   										node.children[i] = this.simplify(node.children[i], threshold);

   										if (node.children[i] !== null) {

   												child = node.children[i];

   												if (child.type === OctantType.Internal) {

   														isCollapsible = false;
   												} else {

   														qef.addData(child.drawInfo.qef);

   														midSign = child.drawInfo.materials >> 7 - i & 1;
   														signs[i] = child.drawInfo.materials >> i & 1;

   														++edgeCount;
   												}
   										}
   								}

   								if (isCollapsible) {

   										// There are no internal children.
   										position = new Vector3();
   										position.copy(qef.solve());
   										error = qef.error;

   										if (error <= threshold) {

   												// Collapse doesn't breach the threshold.
   												min = node.min;
   												size = node.size;

   												if (position.x < min.x || position.x > min.x + size || position.y < min.y || position.y > min.y + size || position.z < min.z || position.z > min.z + size) {

   														position.copy(qef.massPoint);
   												}

   												// Create a psuedo leaf.
   												drawInfo = new DrawInfo();
   												drawInfo.averageNormal = new Vector3();

   												for (i = 0; i < 8; ++i) {

   														if (signs[i] === -1) {

   																// Undetermined, use mid sign instead.
   																drawInfo.materials |= midSign << i;
   														} else {

   																drawInfo.materials |= signs[i] << i;
   														}

   														child = node.children[i];

   														if (child !== null) {

   																if (child.type !== OctantType.Internal) {

   																		drawInfo.averageNormal.add(child.drawInfo.averageNormal);
   																}
   														}

   														// Drop the child node.
   														node.children[i] = null;
   												}

   												drawInfo.averageNormal.normalize();
   												drawInfo.position = position;
   												drawInfo.qef = qef.data;

   												node.type = OctantType.Psuedo;
   												node.drawInfo = drawInfo;
   										}
   								}
   						}

   						return node;
   				}
   		}]);
   		return Octree;
   }();

   /**
    * An edge contouring sub-procedure.
    *
    * @method contourProcessEdge
    * @private
    * @static
    */

   function contourProcessEdge(nodes, dir, indexBuffer) {

   	var indices = [-1, -1, -1, -1];
   	var signChange = [false, false, false, false];

   	var minSize = Infinity;
   	var minIndex = 0;
   	var flip = false;

   	var edge = void 0,
   	    c1 = void 0,
   	    c2 = void 0,
   	    m1 = void 0,
   	    m2 = void 0;

   	var i = void 0;

   	for (i = 0; i < 4; ++i) {

   		edge = processEdgeMask[dir][i];

   		c1 = edgeMap[edge][0];
   		c2 = edgeMap[edge][1];

   		m1 = nodes[i].drawInfo.materials >> c1 & 1;
   		m2 = nodes[i].drawInfo.materials >> c2 & 1;

   		if (nodes[i].size < minSize) {

   			minSize = nodes[i].size;
   			minIndex = i;
   			flip = m1 !== Density.HOLLOW;
   		}

   		indices[i] = nodes[i].drawInfo.index;

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

   /**
    * An edge contouring procedure.
    *
    * @method contourEdgeProc
    * @private
    * @static
    */

   function contourEdgeProc(nodes, dir, indexBuffer) {

   	var c = [0, 0, 0, 0];

   	var i = void 0,
   	    j = void 0;
   	var edgeNodes = void 0;

   	if (nodes[0] !== null && nodes[1] !== null && nodes[2] !== null && nodes[3] !== null) {

   		if (nodes[0].type !== OctantType.Internal && nodes[1].type !== OctantType.Internal && nodes[2].type !== OctantType.Internal && nodes[3].type !== OctantType.Internal) {

   			contourProcessEdge(nodes, dir, indexBuffer);
   		} else {

   			for (i = 0; i < 2; ++i) {

   				c[0] = edgeProcEdgeMask[dir][i][0];
   				c[1] = edgeProcEdgeMask[dir][i][1];
   				c[2] = edgeProcEdgeMask[dir][i][2];
   				c[3] = edgeProcEdgeMask[dir][i][3];

   				edgeNodes = [];

   				for (j = 0; j < 4; ++j) {

   					if (nodes[j].type !== OctantType.Internal) {

   						edgeNodes[j] = nodes[j];
   					} else {

   						edgeNodes[j] = nodes[j].children[c[j]];
   					}
   				}

   				contourEdgeProc(edgeNodes, edgeProcEdgeMask[dir][i][4], indexBuffer);
   			}
   		}
   	}
   }

   /**
    * A face contouring procedure.
    *
    * @method contourFaceProc
    * @private
    * @static
    */

   function contourFaceProc(nodes, dir, indexBuffer) {

   	var c = [0, 0, 0, 0];

   	var orders = [[0, 0, 1, 1], [0, 1, 0, 1]];

   	var i = void 0,
   	    j = void 0;

   	var order = void 0,
   	    faceNodes = void 0,
   	    edgeNodes = void 0;

   	if (nodes[0] !== null && nodes[1] !== null) {

   		if (nodes[0].type === OctantType.Internal || nodes[1].type === OctantType.Internal) {

   			for (i = 0; i < 4; ++i) {

   				c[0] = faceProcFaceMask[dir][i][0];
   				c[1] = faceProcFaceMask[dir][i][1];

   				faceNodes = [];

   				for (j = 0; j < 2; ++j) {

   					if (nodes[j].type !== OctantType.Internal) {

   						faceNodes[j] = nodes[j];
   					} else {

   						faceNodes[j] = nodes[j].children[c[j]];
   					}
   				}

   				contourFaceProc(faceNodes, faceProcFaceMask[dir][i][2], indexBuffer);
   			}

   			for (i = 0; i < 4; ++i) {

   				c[0] = faceProcEdgeMask[dir][i][1];
   				c[1] = faceProcEdgeMask[dir][i][2];
   				c[2] = faceProcEdgeMask[dir][i][3];
   				c[3] = faceProcEdgeMask[dir][i][4];

   				edgeNodes = [];

   				order = orders[faceProcEdgeMask[dir][i][0]];

   				for (j = 0; j < 4; ++j) {

   					if (nodes[order[j]].type !== OctantType.Internal) {

   						edgeNodes[j] = nodes[order[j]];
   					} else {

   						edgeNodes[j] = nodes[order[j]].children[c[j]];
   					}
   				}

   				contourEdgeProc(edgeNodes, faceProcEdgeMask[dir][i][5], indexBuffer);
   			}
   		}
   	}
   }

   /**
    * The main contouring procedure.
    *
    * @method contourCellProc
    * @private
    * @static
    * @param {Octant} node - An octant.
    * @param {Array} indexBuffer - An array to fill with indices.
    */

   function contourCellProc(node, indexBuffer) {

   	var c = [0, 0, 0, 0];

   	var i = void 0,
   	    j = void 0;

   	var faceNodes = void 0,
   	    edgeNodes = void 0;

   	if (node !== null && node.type === OctantType.Internal) {

   		for (i = 0; i < 8; ++i) {

   			contourCellProc(node.children[i], indexBuffer);
   		}

   		for (i = 0; i < 12; ++i) {

   			c[0] = cellProcFaceMask[i][0];
   			c[1] = cellProcFaceMask[i][1];

   			faceNodes = [node.children[c[0]], node.children[c[1]]];

   			contourFaceProc(faceNodes, cellProcFaceMask[i][2], indexBuffer);
   		}

   		for (i = 0; i < 6; ++i) {

   			c[0] = cellProcEdgeMask[i][0];
   			c[1] = cellProcEdgeMask[i][1];
   			c[2] = cellProcEdgeMask[i][2];
   			c[3] = cellProcEdgeMask[i][3];

   			edgeNodes = [];

   			for (j = 0; j < 4; ++j) {

   				edgeNodes[j] = node.children[c[j]];
   			}

   			contourEdgeProc(edgeNodes, cellProcEdgeMask[i][4], indexBuffer);
   		}
   	}
   }

   /**
    * Collects positions and normals from the draw information of the given octant 
    * and its children. The generated vertex indices are stored in the respective 
    * draw information objects. 
    *
    * @method generateVertexIndices
    * @private
    * @static
    * @param {Octant} node - An octant.
    * @param {Array} vertexBuffer - An array to fill with vertices.
    * @param {Array} normalBuffer - An array to fill with normals.
    */

   function generateVertexIndices(node, vertexBuffer, normalBuffer) {

   	var i = void 0,
   	    d = void 0;

   	if (node !== null) {

   		if (node.type === OctantType.Internal) {

   			for (i = 0; i < 8; ++i) {

   				generateVertexIndices(node.children[i], vertexBuffer, normalBuffer);
   			}
   		} else {

   			d = node.drawInfo;

   			if (d !== null) {

   				d.index = vertexBuffer.length;
   				vertexBuffer.push(d.position);
   				normalBuffer.push(d.averageNormal);
   			} else {

   				console.error("Could not add vertex because of missing draw information!");
   			}
   		}
   	}
   }

   /**
    * Dual Contouring is an isosurface extraction technique that was originally 
    * presented by Tao Ju in 2011:
    *
    *  http://www.cs.wustl.edu/~taoju/research/dualContour.pdf
    *
    * @class DualContouring
    * @submodule isosurface
    * @static
    */

   var DualContouring = function () {
   	function DualContouring() {
   		classCallCheck(this, DualContouring);
   	}

   	createClass(DualContouring, null, [{
   		key: "contour",


   		/**
      * Contours the given chunk of hermite data and stores vertices, normals and 
      * vertex indices in the provided buffers.
      *
      * @method contour
      * @static
      * @param {Chunk} chunk - A chunk of hermite data.
      * @param {Number} qefThreshold - An error tolerance for the octree simplification.
      * @param {Array} indexBuffer - An array to fill with indices.
      * @param {Array} vertexBuffer - An array to fill with vertices.
      * @param {Array} normalBuffer - An array to fill with normals.
      * @return {Number} The amount of generated vertices.
      */

   		value: function contour(size, sdf, qefThreshold, indexBuffer, vertexBuffer, normalBuffer) {

   			var octree = new Octree(size, sdf);

   			octree.constructOctants(octree.root);

   			if (qefThreshold >= 0.0) {

   				octree.root = Octree.simplify(octree.root, qefThreshold);
   			}

   			generateVertexIndices(octree.root, vertexBuffer, normalBuffer);
   			contourCellProc(octree.root, indexBuffer);

   			return vertexBuffer.length;
   		}
   	}]);
   	return DualContouring;
   }();

   /**
    * A surface extractor that generates triangles from hermite data.
    *
    * @class SurfaceExtractor
    * @submodule worker
    * @static
    */

   var SurfaceExtractor = {

   		/**
      * Extracts a surface from the given hermite data.
      *
      * @method extract
      * @static
      */

   		extract: function extract(size, sdf) {

   				var data = {
   						positions: null,
   						normals: null,
   						indices: null
   				};

   				var indexBuffer = [];
   				var vertexBuffer = [];
   				var normalBuffer = [];

   				var indices = null;
   				var positions = null;
   				var normals = null;

   				var i = void 0,
   				    j = void 0,
   				    k = void 0;
   				var vertex = void 0,
   				    normal = void 0;
   				var vertexCount = void 0;

   				vertexCount = DualContouring.contour(size, sdf, 0.1, indexBuffer, vertexBuffer, normalBuffer);

   				if (vertexCount > 65536) {

   						console.warn("Could not create geometry for chunk of size", size, "(vertex count of", vertexCount, "exceeds limit of 65536)");
   				} else if (vertexCount > 0) {

   						// Indices can be copied directly.
   						indices = new Uint16Array(indexBuffer);

   						// Vertex positions and normals must be flattened.
   						positions = new Float32Array(vertexCount * 3);
   						normals = new Float32Array(vertexCount * 3);

   						for (i = 0, j = 0, k = 0; i < vertexCount; ++i) {

   								vertex = vertexBuffer[i];
   								normal = normalBuffer[i];

   								positions[j++] = vertex.x;
   								positions[j++] = vertex.y;
   								positions[j++] = vertex.z;

   								normals[k++] = normal.x;
   								normals[k++] = normal.y;
   								normals[k++] = normal.z;
   						}
   				}

   				data.indices = indices;
   				data.positions = positions;
   				data.normals = normals;

   				return data;
   		}

   };

   /**
    * The terrain system.
    *
    * @class Terrain
    * @extends Object3D
    * @constructor
    */

   var Terrain = function (_THREE$Object3D) {
   	inherits(Terrain, _THREE$Object3D);

   	function Terrain(options) {
   		classCallCheck(this, Terrain);

   		var _this = possibleConstructorReturn(this, Object.getPrototypeOf(Terrain).call(this));

   		_this.name = "Terrain";

   		/**
      * The terrain material.
      *
      * @property material
      * @type TerrainMaterial
      * @private
      */

   		//this.material = new TerrainMaterial();
   		_this.material = new THREE.MeshPhongMaterial({
   			color: new THREE.Color(0xbb4400)
   		});

   		return _this;
   	}

   	/**
     * Updates geometry chunks with extracted data.
     *
     * @method consolidate
     * @private
     * @param {Object} data - An object containing the extracted geometry data.
     */

   	createClass(Terrain, [{
   		key: "consolidate",
   		value: function consolidate(data) {

   			var positions = data.positions;
   			var normals = data.normals;
   			var indices = data.indices;

   			var geometry = void 0;

   			// Only create a new mesh if the worker generated data.
   			if (positions !== null && normals !== null && indices !== null) {

   				geometry = new THREE.BufferGeometry();
   				geometry.setIndex(new THREE.BufferAttribute(indices, 1));
   				geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
   				geometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));

   				this.add(new THREE.Mesh(geometry, this.material));
   			}
   		}

   		/**
      * Extracts the surface.
      *
      * @method extract
      * @private
      */

   	}, {
   		key: "extract",
   		value: function extract(size, sdf) {

   			this.consolidate(SurfaceExtractor.extract(size, sdf));
   		}
   	}]);
   	return Terrain;
   }(THREE.Object3D);

   exports.Terrain = Terrain;
   exports.SignedDistanceFunction = SignedDistanceFunction;
   exports.Heightfield = Heightfield;
   exports.Sphere = Sphere;
   exports.Torus = Torus;
   exports.Plane = Plane;
   exports.Box = Box;

   Object.defineProperty(exports, '__esModule', { value: true });

}));