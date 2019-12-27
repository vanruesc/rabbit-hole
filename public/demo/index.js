(function (three, syntheticEvent, mathDs, IteratorResult, sparseOctree) {
  'use strict';

  IteratorResult = IteratorResult && IteratorResult.hasOwnProperty('default') ? IteratorResult['default'] : IteratorResult;

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

  function ___$insertStyle(css) {
    if (!css) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
  }

  function colorToString(color, forceCSSHex) {
    var colorFormat = color.__state.conversionName.toString();

    var r = Math.round(color.r);
    var g = Math.round(color.g);
    var b = Math.round(color.b);
    var a = color.a;
    var h = Math.round(color.h);
    var s = color.s.toFixed(1);
    var v = color.v.toFixed(1);

    if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
      var str = color.hex.toString(16);

      while (str.length < 6) {
        str = '0' + str;
      }

      return '#' + str;
    } else if (colorFormat === 'CSS_RGB') {
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    } else if (colorFormat === 'CSS_RGBA') {
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    } else if (colorFormat === 'HEX') {
      return '0x' + color.hex.toString(16);
    } else if (colorFormat === 'RGB_ARRAY') {
      return '[' + r + ',' + g + ',' + b + ']';
    } else if (colorFormat === 'RGBA_ARRAY') {
      return '[' + r + ',' + g + ',' + b + ',' + a + ']';
    } else if (colorFormat === 'RGB_OBJ') {
      return '{r:' + r + ',g:' + g + ',b:' + b + '}';
    } else if (colorFormat === 'RGBA_OBJ') {
      return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
    } else if (colorFormat === 'HSV_OBJ') {
      return '{h:' + h + ',s:' + s + ',v:' + v + '}';
    } else if (colorFormat === 'HSVA_OBJ') {
      return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
    }

    return 'unknown format';
  }

  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;
  var Common = {
    BREAK: {},
    extend: function extend(target) {
      this.each(ARR_SLICE.call(arguments, 1), function (obj) {
        var keys = this.isObject(obj) ? Object.keys(obj) : [];
        keys.forEach(function (key) {
          if (!this.isUndefined(obj[key])) {
            target[key] = obj[key];
          }
        }.bind(this));
      }, this);
      return target;
    },
    defaults: function defaults(target) {
      this.each(ARR_SLICE.call(arguments, 1), function (obj) {
        var keys = this.isObject(obj) ? Object.keys(obj) : [];
        keys.forEach(function (key) {
          if (this.isUndefined(target[key])) {
            target[key] = obj[key];
          }
        }.bind(this));
      }, this);
      return target;
    },
    compose: function compose() {
      var toCall = ARR_SLICE.call(arguments);
      return function () {
        var args = ARR_SLICE.call(arguments);

        for (var i = toCall.length - 1; i >= 0; i--) {
          args = [toCall[i].apply(this, args)];
        }

        return args[0];
      };
    },
    each: function each(obj, itr, scope) {
      if (!obj) {
        return;
      }

      if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
        obj.forEach(itr, scope);
      } else if (obj.length === obj.length + 0) {
        var key = void 0;
        var l = void 0;

        for (key = 0, l = obj.length; key < l; key++) {
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
            return;
          }
        }
      } else {
        for (var _key in obj) {
          if (itr.call(scope, obj[_key], _key) === this.BREAK) {
            return;
          }
        }
      }
    },
    defer: function defer(fnc) {
      setTimeout(fnc, 0);
    },
    debounce: function debounce(func, threshold, callImmediately) {
      var timeout = void 0;
      return function () {
        var obj = this;
        var args = arguments;

        function delayed() {
          timeout = null;
          if (!callImmediately) func.apply(obj, args);
        }

        var callNow = callImmediately || !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(delayed, threshold);

        if (callNow) {
          func.apply(obj, args);
        }
      };
    },
    toArray: function toArray(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },
    isUndefined: function isUndefined(obj) {
      return obj === undefined;
    },
    isNull: function isNull(obj) {
      return obj === null;
    },
    isNaN: function (_isNaN) {
      function isNaN(_x) {
        return _isNaN.apply(this, arguments);
      }

      isNaN.toString = function () {
        return _isNaN.toString();
      };

      return isNaN;
    }(function (obj) {
      return isNaN(obj);
    }),
    isArray: Array.isArray || function (obj) {
      return obj.constructor === Array;
    },
    isObject: function isObject(obj) {
      return obj === Object(obj);
    },
    isNumber: function isNumber(obj) {
      return obj === obj + 0;
    },
    isString: function isString(obj) {
      return obj === obj + '';
    },
    isBoolean: function isBoolean(obj) {
      return obj === false || obj === true;
    },
    isFunction: function isFunction(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  };
  var INTERPRETATIONS = [{
    litmus: Common.isString,
    conversions: {
      THREE_CHAR_HEX: {
        read: function read(original) {
          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);

          if (test === null) {
            return false;
          }

          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
          };
        },
        write: colorToString
      },
      SIX_CHAR_HEX: {
        read: function read(original) {
          var test = original.match(/^#([A-F0-9]{6})$/i);

          if (test === null) {
            return false;
          }

          return {
            space: 'HEX',
            hex: parseInt('0x' + test[1].toString(), 0)
          };
        },
        write: colorToString
      },
      CSS_RGB: {
        read: function read(original) {
          var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);

          if (test === null) {
            return false;
          }

          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };
        },
        write: colorToString
      },
      CSS_RGBA: {
        read: function read(original) {
          var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);

          if (test === null) {
            return false;
          }

          return {
            space: 'RGB',
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };
        },
        write: colorToString
      }
    }
  }, {
    litmus: Common.isNumber,
    conversions: {
      HEX: {
        read: function read(original) {
          return {
            space: 'HEX',
            hex: original,
            conversionName: 'HEX'
          };
        },
        write: function write(color) {
          return color.hex;
        }
      }
    }
  }, {
    litmus: Common.isArray,
    conversions: {
      RGB_ARRAY: {
        read: function read(original) {
          if (original.length !== 3) {
            return false;
          }

          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },
        write: function write(color) {
          return [color.r, color.g, color.b];
        }
      },
      RGBA_ARRAY: {
        read: function read(original) {
          if (original.length !== 4) return false;
          return {
            space: 'RGB',
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },
        write: function write(color) {
          return [color.r, color.g, color.b, color.a];
        }
      }
    }
  }, {
    litmus: Common.isObject,
    conversions: {
      RGBA_OBJ: {
        read: function read(original) {
          if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }

          return false;
        },
        write: function write(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },
      RGB_OBJ: {
        read: function read(original) {
          if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
            return {
              space: 'RGB',
              r: original.r,
              g: original.g,
              b: original.b
            };
          }

          return false;
        },
        write: function write(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },
      HSVA_OBJ: {
        read: function read(original) {
          if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }

          return false;
        },
        write: function write(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },
      HSV_OBJ: {
        read: function read(original) {
          if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
            return {
              space: 'HSV',
              h: original.h,
              s: original.s,
              v: original.v
            };
          }

          return false;
        },
        write: function write(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }
      }
    }
  }];
  var result = void 0;
  var toReturn = void 0;

  var interpret = function interpret() {
    toReturn = false;
    var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
    Common.each(INTERPRETATIONS, function (family) {
      if (family.litmus(original)) {
        Common.each(family.conversions, function (conversion, conversionName) {
          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return Common.BREAK;
          }
        });
        return Common.BREAK;
      }
    });
    return toReturn;
  };

  var tmpComponent = void 0;
  var ColorMath = {
    hsv_to_rgb: function hsv_to_rgb(h, s, v) {
      var hi = Math.floor(h / 60) % 6;
      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - f * s);
      var t = v * (1.0 - (1.0 - f) * s);
      var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };
    },
    rgb_to_hsv: function rgb_to_hsv(r, g, b) {
      var min = Math.min(r, g, b);
      var max = Math.max(r, g, b);
      var delta = max - min;
      var h = void 0;
      var s = void 0;

      if (max !== 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }

      h /= 6;

      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },
    rgb_to_hex: function rgb_to_hex(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },
    component_from_hex: function component_from_hex(hex, componentIndex) {
      return hex >> componentIndex * 8 & 0xFF;
    },
    hex_with_component: function hex_with_component(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
    }
  };

  var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
    return _typeof(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
  };

  var classCallCheck = function classCallCheck(instance, Constructor) {
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

  var inherits = function inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + _typeof(superClass));
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

  var possibleConstructorReturn = function possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (_typeof(call) === "object" || typeof call === "function") ? call : self;
  };

  var Color = function () {
    function Color() {
      classCallCheck(this, Color);
      this.__state = interpret.apply(this, arguments);

      if (this.__state === false) {
        throw new Error('Failed to interpret color arguments');
      }

      this.__state.a = this.__state.a || 1;
    }

    createClass(Color, [{
      key: 'toString',
      value: function toString() {
        return colorToString(this);
      }
    }, {
      key: 'toHexString',
      value: function toHexString() {
        return colorToString(this, true);
      }
    }, {
      key: 'toOriginal',
      value: function toOriginal() {
        return this.__state.conversion.write(this);
      }
    }]);
    return Color;
  }();

  function defineRGBComponent(target, component, componentHexIndex) {
    Object.defineProperty(target, component, {
      get: function get$$1() {
        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        Color.recalculateRGB(this, component, componentHexIndex);
        return this.__state[component];
      },
      set: function set$$1(v) {
        if (this.__state.space !== 'RGB') {
          Color.recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;
      }
    });
  }

  function defineHSVComponent(target, component) {
    Object.defineProperty(target, component, {
      get: function get$$1() {
        if (this.__state.space === 'HSV') {
          return this.__state[component];
        }

        Color.recalculateHSV(this);
        return this.__state[component];
      },
      set: function set$$1(v) {
        if (this.__state.space !== 'HSV') {
          Color.recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;
      }
    });
  }

  Color.recalculateRGB = function (color, component, componentHexIndex) {
    if (color.__state.space === 'HEX') {
      color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
    } else if (color.__state.space === 'HSV') {
      Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
    } else {
      throw new Error('Corrupted color state');
    }
  };

  Color.recalculateHSV = function (color) {
    var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
    Common.extend(color.__state, {
      s: result.s,
      v: result.v
    });

    if (!Common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (Common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }
  };

  Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);
  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');
  Object.defineProperty(Color.prototype, 'a', {
    get: function get$$1() {
      return this.__state.a;
    },
    set: function set$$1(v) {
      this.__state.a = v;
    }
  });
  Object.defineProperty(Color.prototype, 'hex', {
    get: function get$$1() {
      if (!this.__state.space !== 'HEX') {
        this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;
    },
    set: function set$$1(v) {
      this.__state.space = 'HEX';
      this.__state.hex = v;
    }
  });

  var Controller = function () {
    function Controller(object, property) {
      classCallCheck(this, Controller);
      this.initialValue = object[property];
      this.domElement = document.createElement('div');
      this.object = object;
      this.property = property;
      this.__onChange = undefined;
      this.__onFinishChange = undefined;
    }

    createClass(Controller, [{
      key: 'onChange',
      value: function onChange(fnc) {
        this.__onChange = fnc;
        return this;
      }
    }, {
      key: 'onFinishChange',
      value: function onFinishChange(fnc) {
        this.__onFinishChange = fnc;
        return this;
      }
    }, {
      key: 'setValue',
      value: function setValue(newValue) {
        this.object[this.property] = newValue;

        if (this.__onChange) {
          this.__onChange.call(this, newValue);
        }

        this.updateDisplay();
        return this;
      }
    }, {
      key: 'getValue',
      value: function getValue() {
        return this.object[this.property];
      }
    }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
        return this;
      }
    }, {
      key: 'isModified',
      value: function isModified() {
        return this.initialValue !== this.getValue();
      }
    }]);
    return Controller;
  }();

  var EVENT_MAP = {
    HTMLEvents: ['change'],
    MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
    KeyboardEvents: ['keydown']
  };
  var EVENT_MAP_INV = {};
  Common.each(EVENT_MAP, function (v, k) {
    Common.each(v, function (e) {
      EVENT_MAP_INV[e] = k;
    });
  });
  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

  function cssValueToPixels(val) {
    if (val === '0' || Common.isUndefined(val)) {
      return 0;
    }

    var match = val.match(CSS_VALUE_PIXELS);

    if (!Common.isNull(match)) {
      return parseFloat(match[1]);
    }

    return 0;
  }

  var dom = {
    makeSelectable: function makeSelectable(elem, selectable) {
      if (elem === undefined || elem.style === undefined) return;
      elem.onselectstart = selectable ? function () {
        return false;
      } : function () {};
      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';
    },
    makeFullscreen: function makeFullscreen(elem, hor, vert) {
      var vertical = vert;
      var horizontal = hor;

      if (Common.isUndefined(horizontal)) {
        horizontal = true;
      }

      if (Common.isUndefined(vertical)) {
        vertical = true;
      }

      elem.style.position = 'absolute';

      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }

      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }
    },
    fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
      var params = pars || {};
      var className = EVENT_MAP_INV[eventType];

      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }

      var evt = document.createEvent(className);

      switch (className) {
        case 'MouseEvents':
          {
            var clientX = params.x || params.clientX || 0;
            var clientY = params.y || params.clientY || 0;
            evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, 0, clientX, clientY, false, false, false, false, 0, null);
            break;
          }

        case 'KeyboardEvents':
          {
            var init = evt.initKeyboardEvent || evt.initKeyEvent;
            Common.defaults(params, {
              cancelable: true,
              ctrlKey: false,
              altKey: false,
              shiftKey: false,
              metaKey: false,
              keyCode: undefined,
              charCode: undefined
            });
            init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
            break;
          }

        default:
          {
            evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
            break;
          }
      }

      Common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },
    bind: function bind(elem, event, func, newBool) {
      var bool = newBool || false;

      if (elem.addEventListener) {
        elem.addEventListener(event, func, bool);
      } else if (elem.attachEvent) {
        elem.attachEvent('on' + event, func);
      }

      return dom;
    },
    unbind: function unbind(elem, event, func, newBool) {
      var bool = newBool || false;

      if (elem.removeEventListener) {
        elem.removeEventListener(event, func, bool);
      } else if (elem.detachEvent) {
        elem.detachEvent('on' + event, func);
      }

      return dom;
    },
    addClass: function addClass(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);

        if (classes.indexOf(className) === -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }

      return dom;
    },
    removeClass: function removeClass(elem, className) {
      if (className) {
        if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);

          if (index !== -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }

      return dom;
    },
    hasClass: function hasClass(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },
    getWidth: function getWidth(elem) {
      var style = getComputedStyle(elem);
      return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
    },
    getHeight: function getHeight(elem) {
      var style = getComputedStyle(elem);
      return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
    },
    getOffset: function getOffset(el) {
      var elem = el;
      var offset = {
        left: 0,
        top: 0
      };

      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
          elem = elem.offsetParent;
        } while (elem);
      }

      return offset;
    },
    isActive: function isActive(elem) {
      return elem === document.activeElement && (elem.type || elem.href);
    }
  };

  var BooleanController = function (_Controller) {
    inherits(BooleanController, _Controller);

    function BooleanController(object, property) {
      classCallCheck(this, BooleanController);

      var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));

      var _this = _this2;
      _this2.__prev = _this2.getValue();
      _this2.__checkbox = document.createElement('input');

      _this2.__checkbox.setAttribute('type', 'checkbox');

      function onChange() {
        _this.setValue(!_this.__prev);
      }

      dom.bind(_this2.__checkbox, 'change', onChange, false);

      _this2.domElement.appendChild(_this2.__checkbox);

      _this2.updateDisplay();

      return _this2;
    }

    createClass(BooleanController, [{
      key: 'setValue',
      value: function setValue(v) {
        var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);

        if (this.__onFinishChange) {
          this.__onFinishChange.call(this, this.getValue());
        }

        this.__prev = this.getValue();
        return toReturn;
      }
    }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
        if (this.getValue() === true) {
          this.__checkbox.setAttribute('checked', 'checked');

          this.__checkbox.checked = true;
          this.__prev = true;
        } else {
          this.__checkbox.checked = false;
          this.__prev = false;
        }

        return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return BooleanController;
  }(Controller);

  var OptionController = function (_Controller) {
    inherits(OptionController, _Controller);

    function OptionController(object, property, opts) {
      classCallCheck(this, OptionController);

      var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));

      var options = opts;
      var _this = _this2;
      _this2.__select = document.createElement('select');

      if (Common.isArray(options)) {
        var map = {};
        Common.each(options, function (element) {
          map[element] = element;
        });
        options = map;
      }

      Common.each(options, function (value, key) {
        var opt = document.createElement('option');
        opt.innerHTML = key;
        opt.setAttribute('value', value);

        _this.__select.appendChild(opt);
      });

      _this2.updateDisplay();

      dom.bind(_this2.__select, 'change', function () {
        var desiredValue = this.options[this.selectedIndex].value;

        _this.setValue(desiredValue);
      });

      _this2.domElement.appendChild(_this2.__select);

      return _this2;
    }

    createClass(OptionController, [{
      key: 'setValue',
      value: function setValue(v) {
        var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);

        if (this.__onFinishChange) {
          this.__onFinishChange.call(this, this.getValue());
        }

        return toReturn;
      }
    }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
        if (dom.isActive(this.__select)) return this;
        this.__select.value = this.getValue();
        return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return OptionController;
  }(Controller);

  var StringController = function (_Controller) {
    inherits(StringController, _Controller);

    function StringController(object, property) {
      classCallCheck(this, StringController);

      var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));

      var _this = _this2;

      function onChange() {
        _this.setValue(_this.__input.value);
      }

      function onBlur() {
        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.getValue());
        }
      }

      _this2.__input = document.createElement('input');

      _this2.__input.setAttribute('type', 'text');

      dom.bind(_this2.__input, 'keyup', onChange);
      dom.bind(_this2.__input, 'change', onChange);
      dom.bind(_this2.__input, 'blur', onBlur);
      dom.bind(_this2.__input, 'keydown', function (e) {
        if (e.keyCode === 13) {
          this.blur();
        }
      });

      _this2.updateDisplay();

      _this2.domElement.appendChild(_this2.__input);

      return _this2;
    }

    createClass(StringController, [{
      key: 'updateDisplay',
      value: function updateDisplay() {
        if (!dom.isActive(this.__input)) {
          this.__input.value = this.getValue();
        }

        return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return StringController;
  }(Controller);

  function numDecimals(x) {
    var _x = x.toString();

    if (_x.indexOf('.') > -1) {
      return _x.length - _x.indexOf('.') - 1;
    }

    return 0;
  }

  var NumberController = function (_Controller) {
    inherits(NumberController, _Controller);

    function NumberController(object, property, params) {
      classCallCheck(this, NumberController);

      var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));

      var _params = params || {};

      _this.__min = _params.min;
      _this.__max = _params.max;
      _this.__step = _params.step;

      if (Common.isUndefined(_this.__step)) {
        if (_this.initialValue === 0) {
          _this.__impliedStep = 1;
        } else {
          _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
        }
      } else {
        _this.__impliedStep = _this.__step;
      }

      _this.__precision = numDecimals(_this.__impliedStep);
      return _this;
    }

    createClass(NumberController, [{
      key: 'setValue',
      value: function setValue(v) {
        var _v = v;

        if (this.__min !== undefined && _v < this.__min) {
          _v = this.__min;
        } else if (this.__max !== undefined && _v > this.__max) {
          _v = this.__max;
        }

        if (this.__step !== undefined && _v % this.__step !== 0) {
          _v = Math.round(_v / this.__step) * this.__step;
        }

        return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
      }
    }, {
      key: 'min',
      value: function min(minValue) {
        this.__min = minValue;
        return this;
      }
    }, {
      key: 'max',
      value: function max(maxValue) {
        this.__max = maxValue;
        return this;
      }
    }, {
      key: 'step',
      value: function step(stepValue) {
        this.__step = stepValue;
        this.__impliedStep = stepValue;
        this.__precision = numDecimals(stepValue);
        return this;
      }
    }]);
    return NumberController;
  }(Controller);

  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }

  var NumberControllerBox = function (_NumberController) {
    inherits(NumberControllerBox, _NumberController);

    function NumberControllerBox(object, property, params) {
      classCallCheck(this, NumberControllerBox);

      var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));

      _this2.__truncationSuspended = false;
      var _this = _this2;
      var prevY = void 0;

      function onChange() {
        var attempted = parseFloat(_this.__input.value);

        if (!Common.isNaN(attempted)) {
          _this.setValue(attempted);
        }
      }

      function onFinish() {
        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.getValue());
        }
      }

      function onBlur() {
        onFinish();
      }

      function onMouseDrag(e) {
        var diff = prevY - e.clientY;

        _this.setValue(_this.getValue() + diff * _this.__impliedStep);

        prevY = e.clientY;
      }

      function onMouseUp() {
        dom.unbind(window, 'mousemove', onMouseDrag);
        dom.unbind(window, 'mouseup', onMouseUp);
        onFinish();
      }

      function onMouseDown(e) {
        dom.bind(window, 'mousemove', onMouseDrag);
        dom.bind(window, 'mouseup', onMouseUp);
        prevY = e.clientY;
      }

      _this2.__input = document.createElement('input');

      _this2.__input.setAttribute('type', 'text');

      dom.bind(_this2.__input, 'change', onChange);
      dom.bind(_this2.__input, 'blur', onBlur);
      dom.bind(_this2.__input, 'mousedown', onMouseDown);
      dom.bind(_this2.__input, 'keydown', function (e) {
        if (e.keyCode === 13) {
          _this.__truncationSuspended = true;
          this.blur();
          _this.__truncationSuspended = false;
          onFinish();
        }
      });

      _this2.updateDisplay();

      _this2.domElement.appendChild(_this2.__input);

      return _this2;
    }

    createClass(NumberControllerBox, [{
      key: 'updateDisplay',
      value: function updateDisplay() {
        this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
        return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return NumberControllerBox;
  }(NumberController);

  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }

  var NumberControllerSlider = function (_NumberController) {
    inherits(NumberControllerSlider, _NumberController);

    function NumberControllerSlider(object, property, min, max, step) {
      classCallCheck(this, NumberControllerSlider);

      var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, {
        min: min,
        max: max,
        step: step
      }));

      var _this = _this2;
      _this2.__background = document.createElement('div');
      _this2.__foreground = document.createElement('div');
      dom.bind(_this2.__background, 'mousedown', onMouseDown);
      dom.bind(_this2.__background, 'touchstart', onTouchStart);
      dom.addClass(_this2.__background, 'slider');
      dom.addClass(_this2.__foreground, 'slider-fg');

      function onMouseDown(e) {
        document.activeElement.blur();
        dom.bind(window, 'mousemove', onMouseDrag);
        dom.bind(window, 'mouseup', onMouseUp);
        onMouseDrag(e);
      }

      function onMouseDrag(e) {
        e.preventDefault();

        var bgRect = _this.__background.getBoundingClientRect();

        _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));

        return false;
      }

      function onMouseUp() {
        dom.unbind(window, 'mousemove', onMouseDrag);
        dom.unbind(window, 'mouseup', onMouseUp);

        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.getValue());
        }
      }

      function onTouchStart(e) {
        if (e.touches.length !== 1) {
          return;
        }

        dom.bind(window, 'touchmove', onTouchMove);
        dom.bind(window, 'touchend', onTouchEnd);
        onTouchMove(e);
      }

      function onTouchMove(e) {
        var clientX = e.touches[0].clientX;

        var bgRect = _this.__background.getBoundingClientRect();

        _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      }

      function onTouchEnd() {
        dom.unbind(window, 'touchmove', onTouchMove);
        dom.unbind(window, 'touchend', onTouchEnd);

        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.getValue());
        }
      }

      _this2.updateDisplay();

      _this2.__background.appendChild(_this2.__foreground);

      _this2.domElement.appendChild(_this2.__background);

      return _this2;
    }

    createClass(NumberControllerSlider, [{
      key: 'updateDisplay',
      value: function updateDisplay() {
        var pct = (this.getValue() - this.__min) / (this.__max - this.__min);

        this.__foreground.style.width = pct * 100 + '%';
        return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
      }
    }]);
    return NumberControllerSlider;
  }(NumberController);

  var FunctionController = function (_Controller) {
    inherits(FunctionController, _Controller);

    function FunctionController(object, property, text) {
      classCallCheck(this, FunctionController);

      var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));

      var _this = _this2;
      _this2.__button = document.createElement('div');
      _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
      dom.bind(_this2.__button, 'click', function (e) {
        e.preventDefault();

        _this.fire();

        return false;
      });
      dom.addClass(_this2.__button, 'button');

      _this2.domElement.appendChild(_this2.__button);

      return _this2;
    }

    createClass(FunctionController, [{
      key: 'fire',
      value: function fire() {
        if (this.__onChange) {
          this.__onChange.call(this);
        }

        this.getValue().call(this.object);

        if (this.__onFinishChange) {
          this.__onFinishChange.call(this, this.getValue());
        }
      }
    }]);
    return FunctionController;
  }(Controller);

  var ColorController = function (_Controller) {
    inherits(ColorController, _Controller);

    function ColorController(object, property) {
      classCallCheck(this, ColorController);

      var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));

      _this2.__color = new Color(_this2.getValue());
      _this2.__temp = new Color(0);
      var _this = _this2;
      _this2.domElement = document.createElement('div');
      dom.makeSelectable(_this2.domElement, false);
      _this2.__selector = document.createElement('div');
      _this2.__selector.className = 'selector';
      _this2.__saturation_field = document.createElement('div');
      _this2.__saturation_field.className = 'saturation-field';
      _this2.__field_knob = document.createElement('div');
      _this2.__field_knob.className = 'field-knob';
      _this2.__field_knob_border = '2px solid ';
      _this2.__hue_knob = document.createElement('div');
      _this2.__hue_knob.className = 'hue-knob';
      _this2.__hue_field = document.createElement('div');
      _this2.__hue_field.className = 'hue-field';
      _this2.__input = document.createElement('input');
      _this2.__input.type = 'text';
      _this2.__input_textShadow = '0 1px 1px ';
      dom.bind(_this2.__input, 'keydown', function (e) {
        if (e.keyCode === 13) {
          onBlur.call(this);
        }
      });
      dom.bind(_this2.__input, 'blur', onBlur);
      dom.bind(_this2.__selector, 'mousedown', function () {
        dom.addClass(this, 'drag').bind(window, 'mouseup', function () {
          dom.removeClass(_this.__selector, 'drag');
        });
      });
      dom.bind(_this2.__selector, 'touchstart', function () {
        dom.addClass(this, 'drag').bind(window, 'touchend', function () {
          dom.removeClass(_this.__selector, 'drag');
        });
      });
      var valueField = document.createElement('div');
      Common.extend(_this2.__selector.style, {
        width: '122px',
        height: '102px',
        padding: '3px',
        backgroundColor: '#222',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
      });
      Common.extend(_this2.__field_knob.style, {
        position: 'absolute',
        width: '12px',
        height: '12px',
        border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
        boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
        borderRadius: '12px',
        zIndex: 1
      });
      Common.extend(_this2.__hue_knob.style, {
        position: 'absolute',
        width: '15px',
        height: '2px',
        borderRight: '4px solid #fff',
        zIndex: 1
      });
      Common.extend(_this2.__saturation_field.style, {
        width: '100px',
        height: '100px',
        border: '1px solid #555',
        marginRight: '3px',
        display: 'inline-block',
        cursor: 'pointer'
      });
      Common.extend(valueField.style, {
        width: '100%',
        height: '100%',
        background: 'none'
      });
      linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
      Common.extend(_this2.__hue_field.style, {
        width: '15px',
        height: '100px',
        border: '1px solid #555',
        cursor: 'ns-resize',
        position: 'absolute',
        top: '3px',
        right: '3px'
      });
      hueGradient(_this2.__hue_field);
      Common.extend(_this2.__input.style, {
        outline: 'none',
        textAlign: 'center',
        color: '#fff',
        border: 0,
        fontWeight: 'bold',
        textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
      });
      dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
      dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
      dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
      dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
      dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
      dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);

      function fieldDown(e) {
        setSV(e);
        dom.bind(window, 'mousemove', setSV);
        dom.bind(window, 'touchmove', setSV);
        dom.bind(window, 'mouseup', fieldUpSV);
        dom.bind(window, 'touchend', fieldUpSV);
      }

      function fieldDownH(e) {
        setH(e);
        dom.bind(window, 'mousemove', setH);
        dom.bind(window, 'touchmove', setH);
        dom.bind(window, 'mouseup', fieldUpH);
        dom.bind(window, 'touchend', fieldUpH);
      }

      function fieldUpSV() {
        dom.unbind(window, 'mousemove', setSV);
        dom.unbind(window, 'touchmove', setSV);
        dom.unbind(window, 'mouseup', fieldUpSV);
        dom.unbind(window, 'touchend', fieldUpSV);
        onFinish();
      }

      function fieldUpH() {
        dom.unbind(window, 'mousemove', setH);
        dom.unbind(window, 'touchmove', setH);
        dom.unbind(window, 'mouseup', fieldUpH);
        dom.unbind(window, 'touchend', fieldUpH);
        onFinish();
      }

      function onBlur() {
        var i = interpret(this.value);

        if (i !== false) {
          _this.__color.__state = i;

          _this.setValue(_this.__color.toOriginal());
        } else {
          this.value = _this.__color.toString();
        }
      }

      function onFinish() {
        if (_this.__onFinishChange) {
          _this.__onFinishChange.call(_this, _this.__color.toOriginal());
        }
      }

      _this2.__saturation_field.appendChild(valueField);

      _this2.__selector.appendChild(_this2.__field_knob);

      _this2.__selector.appendChild(_this2.__saturation_field);

      _this2.__selector.appendChild(_this2.__hue_field);

      _this2.__hue_field.appendChild(_this2.__hue_knob);

      _this2.domElement.appendChild(_this2.__input);

      _this2.domElement.appendChild(_this2.__selector);

      _this2.updateDisplay();

      function setSV(e) {
        if (e.type.indexOf('touch') === -1) {
          e.preventDefault();
        }

        var fieldRect = _this.__saturation_field.getBoundingClientRect();

        var _ref = e.touches && e.touches[0] || e,
            clientX = _ref.clientX,
            clientY = _ref.clientY;

        var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
        var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

        if (v > 1) {
          v = 1;
        } else if (v < 0) {
          v = 0;
        }

        if (s > 1) {
          s = 1;
        } else if (s < 0) {
          s = 0;
        }

        _this.__color.v = v;
        _this.__color.s = s;

        _this.setValue(_this.__color.toOriginal());

        return false;
      }

      function setH(e) {
        if (e.type.indexOf('touch') === -1) {
          e.preventDefault();
        }

        var fieldRect = _this.__hue_field.getBoundingClientRect();

        var _ref2 = e.touches && e.touches[0] || e,
            clientY = _ref2.clientY;

        var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);

        if (h > 1) {
          h = 1;
        } else if (h < 0) {
          h = 0;
        }

        _this.__color.h = h * 360;

        _this.setValue(_this.__color.toOriginal());

        return false;
      }

      return _this2;
    }

    createClass(ColorController, [{
      key: 'updateDisplay',
      value: function updateDisplay() {
        var i = interpret(this.getValue());

        if (i !== false) {
          var mismatch = false;
          Common.each(Color.COMPONENTS, function (component) {
            if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
              mismatch = true;
              return {};
            }
          }, this);

          if (mismatch) {
            Common.extend(this.__color.__state, i);
          }
        }

        Common.extend(this.__temp.__state, this.__color.__state);
        this.__temp.a = 1;
        var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;

        var _flip = 255 - flip;

        Common.extend(this.__field_knob.style, {
          marginLeft: 100 * this.__color.s - 7 + 'px',
          marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
          backgroundColor: this.__temp.toHexString(),
          border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
        });
        this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
        this.__temp.s = 1;
        this.__temp.v = 1;
        linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
        this.__input.value = this.__color.toString();
        Common.extend(this.__input.style, {
          backgroundColor: this.__color.toHexString(),
          color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
          textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
        });
      }
    }]);
    return ColorController;
  }(Controller);

  var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];

  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    Common.each(vendors, function (vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
    });
  }

  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  }

  var css = {
    load: function load(url, indoc) {
      var doc = indoc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function inject(cssContent, indoc) {
      var doc = indoc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = cssContent;
      var head = doc.getElementsByTagName('head')[0];

      try {
        head.appendChild(injected);
      } catch (e) {}
    }
  };
  var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

  var ControllerFactory = function ControllerFactory(object, property) {
    var initialValue = object[property];

    if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
      return new OptionController(object, property, arguments[2]);
    }

    if (Common.isNumber(initialValue)) {
      if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
        if (Common.isNumber(arguments[4])) {
          return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
        }

        return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
      }

      if (Common.isNumber(arguments[4])) {
        return new NumberControllerBox(object, property, {
          min: arguments[2],
          max: arguments[3],
          step: arguments[4]
        });
      }

      return new NumberControllerBox(object, property, {
        min: arguments[2],
        max: arguments[3]
      });
    }

    if (Common.isString(initialValue)) {
      return new StringController(object, property);
    }

    if (Common.isFunction(initialValue)) {
      return new FunctionController(object, property, '');
    }

    if (Common.isBoolean(initialValue)) {
      return new BooleanController(object, property);
    }

    return null;
  };

  function requestAnimationFrame$1(callback) {
    setTimeout(callback, 1000 / 60);
  }

  var requestAnimationFrame$1$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$1;

  var CenteredDiv = function () {
    function CenteredDiv() {
      classCallCheck(this, CenteredDiv);
      this.backgroundElement = document.createElement('div');
      Common.extend(this.backgroundElement.style, {
        backgroundColor: 'rgba(0,0,0,0.8)',
        top: 0,
        left: 0,
        display: 'none',
        zIndex: '1000',
        opacity: 0,
        WebkitTransition: 'opacity 0.2s linear',
        transition: 'opacity 0.2s linear'
      });
      dom.makeFullscreen(this.backgroundElement);
      this.backgroundElement.style.position = 'fixed';
      this.domElement = document.createElement('div');
      Common.extend(this.domElement.style, {
        position: 'fixed',
        display: 'none',
        zIndex: '1001',
        opacity: 0,
        WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
        transition: 'transform 0.2s ease-out, opacity 0.2s linear'
      });
      document.body.appendChild(this.backgroundElement);
      document.body.appendChild(this.domElement);

      var _this = this;

      dom.bind(this.backgroundElement, 'click', function () {
        _this.hide();
      });
    }

    createClass(CenteredDiv, [{
      key: 'show',
      value: function show() {
        var _this = this;

        this.backgroundElement.style.display = 'block';
        this.domElement.style.display = 'block';
        this.domElement.style.opacity = 0;
        this.domElement.style.webkitTransform = 'scale(1.1)';
        this.layout();
        Common.defer(function () {
          _this.backgroundElement.style.opacity = 1;
          _this.domElement.style.opacity = 1;
          _this.domElement.style.webkitTransform = 'scale(1)';
        });
      }
    }, {
      key: 'hide',
      value: function hide() {
        var _this = this;

        var hide = function hide() {
          _this.domElement.style.display = 'none';
          _this.backgroundElement.style.display = 'none';
          dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
          dom.unbind(_this.domElement, 'transitionend', hide);
          dom.unbind(_this.domElement, 'oTransitionEnd', hide);
        };

        dom.bind(this.domElement, 'webkitTransitionEnd', hide);
        dom.bind(this.domElement, 'transitionend', hide);
        dom.bind(this.domElement, 'oTransitionEnd', hide);
        this.backgroundElement.style.opacity = 0;
        this.domElement.style.opacity = 0;
        this.domElement.style.webkitTransform = 'scale(1.1)';
      }
    }, {
      key: 'layout',
      value: function layout() {
        this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
        this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
      }
    }]);
    return CenteredDiv;
  }();

  var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

  css.inject(styleSheet);
  var CSS_NAMESPACE = 'dg';
  var HIDE_KEY_CODE = 72;
  var CLOSE_BUTTON_HEIGHT = 20;
  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

  var SUPPORTS_LOCAL_STORAGE = function () {
    try {
      return !!window.localStorage;
    } catch (e) {
      return false;
    }
  }();

  var SAVE_DIALOGUE = void 0;
  var autoPlaceVirgin = true;
  var autoPlaceContainer = void 0;
  var hide = false;
  var hideableGuis = [];

  var GUI = function GUI(pars) {
    var _this = this;

    var params = pars || {};
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);
    dom.addClass(this.domElement, CSS_NAMESPACE);
    this.__folders = {};
    this.__controllers = [];
    this.__rememberedObjects = [];
    this.__rememberedObjectIndecesToControllers = [];
    this.__listening = [];
    params = Common.defaults(params, {
      closeOnTop: false,
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });
    params = Common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });

    if (!Common.isUndefined(params.load)) {
      if (params.preset) {
        params.load.preset = params.preset;
      }
    } else {
      params.load = {
        preset: DEFAULT_DEFAULT_PRESET_NAME
      };
    }

    if (Common.isUndefined(params.parent) && params.hideable) {
      hideableGuis.push(this);
    }

    params.resizable = Common.isUndefined(params.parent) && params.resizable;

    if (params.autoPlace && Common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }

    var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
    var saveToLocalStorage = void 0;
    var titleRow = void 0;
    Object.defineProperties(this, {
      parent: {
        get: function get$$1() {
          return params.parent;
        }
      },
      scrollable: {
        get: function get$$1() {
          return params.scrollable;
        }
      },
      autoPlace: {
        get: function get$$1() {
          return params.autoPlace;
        }
      },
      closeOnTop: {
        get: function get$$1() {
          return params.closeOnTop;
        }
      },
      preset: {
        get: function get$$1() {
          if (_this.parent) {
            return _this.getRoot().preset;
          }

          return params.load.preset;
        },
        set: function set$$1(v) {
          if (_this.parent) {
            _this.getRoot().preset = v;
          } else {
            params.load.preset = v;
          }

          setPresetSelectIndex(this);

          _this.revert();
        }
      },
      width: {
        get: function get$$1() {
          return params.width;
        },
        set: function set$$1(v) {
          params.width = v;
          setWidth(_this, v);
        }
      },
      name: {
        get: function get$$1() {
          return params.name;
        },
        set: function set$$1(v) {
          params.name = v;

          if (titleRow) {
            titleRow.innerHTML = params.name;
          }
        }
      },
      closed: {
        get: function get$$1() {
          return params.closed;
        },
        set: function set$$1(v) {
          params.closed = v;

          if (params.closed) {
            dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
          } else {
            dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
          }

          this.onResize();

          if (_this.__closeButton) {
            _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
          }
        }
      },
      load: {
        get: function get$$1() {
          return params.load;
        }
      },
      useLocalStorage: {
        get: function get$$1() {
          return useLocalStorage;
        },
        set: function set$$1(bool) {
          if (SUPPORTS_LOCAL_STORAGE) {
            useLocalStorage = bool;

            if (bool) {
              dom.bind(window, 'unload', saveToLocalStorage);
            } else {
              dom.unbind(window, 'unload', saveToLocalStorage);
            }

            localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
          }
        }
      }
    });

    if (Common.isUndefined(params.parent)) {
      this.closed = params.closed || false;
      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);

      if (SUPPORTS_LOCAL_STORAGE) {
        if (useLocalStorage) {
          _this.useLocalStorage = true;
          var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

          if (savedGui) {
            params.load = JSON.parse(savedGui);
          }
        }
      }

      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);

      if (params.closeOnTop) {
        dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
        this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
      } else {
        dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
        this.domElement.appendChild(this.__closeButton);
      }

      dom.bind(this.__closeButton, 'click', function () {
        _this.closed = !_this.closed;
      });
    } else {
      if (params.closed === undefined) {
        params.closed = true;
      }

      var titleRowName = document.createTextNode(params.name);
      dom.addClass(titleRowName, 'controller-name');
      titleRow = addRow(_this, titleRowName);

      var onClickTitle = function onClickTitle(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };

      dom.addClass(this.__ul, GUI.CLASS_CLOSED);
      dom.addClass(titleRow, 'title');
      dom.bind(titleRow, 'click', onClickTitle);

      if (!params.closed) {
        this.closed = false;
      }
    }

    if (params.autoPlace) {
      if (Common.isUndefined(params.parent)) {
        if (autoPlaceVirgin) {
          autoPlaceContainer = document.createElement('div');
          dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
          dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(autoPlaceContainer);
          autoPlaceVirgin = false;
        }

        autoPlaceContainer.appendChild(this.domElement);
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
      }

      if (!this.parent) {
        setWidth(_this, params.width);
      }
    }

    this.__resizeHandler = function () {
      _this.onResizeDebounced();
    };

    dom.bind(window, 'resize', this.__resizeHandler);
    dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
    dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
    dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
    this.onResize();

    if (params.resizable) {
      addResizeHandle(this);
    }

    saveToLocalStorage = function saveToLocalStorage() {
      if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
        localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
      }
    };

    this.saveToLocalStorageIfPossible = saveToLocalStorage;

    function resetWidth() {
      var root = _this.getRoot();

      root.width += 1;
      Common.defer(function () {
        root.width -= 1;
      });
    }

    if (!params.parent) {
      resetWidth();
    }
  };

  GUI.toggleHide = function () {
    hide = !hide;
    Common.each(hideableGuis, function (gui) {
      gui.domElement.style.display = hide ? 'none' : '';
    });
  };

  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_CLOSE_TOP = 'close-top';
  GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
  GUI.CLASS_DRAG = 'drag';
  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';

  GUI._keydownHandler = function (e) {
    if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }
  };

  dom.bind(window, 'keydown', GUI._keydownHandler, false);
  Common.extend(GUI.prototype, {
    add: function add(object, property) {
      return _add(this, object, property, {
        factoryArgs: Array.prototype.slice.call(arguments, 2)
      });
    },
    addColor: function addColor(object, property) {
      return _add(this, object, property, {
        color: true
      });
    },
    remove: function remove(controller) {
      this.__ul.removeChild(controller.__li);

      this.__controllers.splice(this.__controllers.indexOf(controller), 1);

      var _this = this;

      Common.defer(function () {
        _this.onResize();
      });
    },
    destroy: function destroy() {
      if (this.parent) {
        throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
      }

      if (this.autoPlace) {
        autoPlaceContainer.removeChild(this.domElement);
      }

      var _this = this;

      Common.each(this.__folders, function (subfolder) {
        _this.removeFolder(subfolder);
      });
      dom.unbind(window, 'keydown', GUI._keydownHandler, false);
      removeListeners(this);
    },
    addFolder: function addFolder(name) {
      if (this.__folders[name] !== undefined) {
        throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
      }

      var newGuiParams = {
        name: name,
        parent: this
      };
      newGuiParams.autoPlace = this.autoPlace;

      if (this.load && this.load.folders && this.load.folders[name]) {
        newGuiParams.closed = this.load.folders[name].closed;
        newGuiParams.load = this.load.folders[name];
      }

      var gui = new GUI(newGuiParams);
      this.__folders[name] = gui;
      var li = addRow(this, gui.domElement);
      dom.addClass(li, 'folder');
      return gui;
    },
    removeFolder: function removeFolder(folder) {
      this.__ul.removeChild(folder.domElement.parentElement);

      delete this.__folders[folder.name];

      if (this.load && this.load.folders && this.load.folders[folder.name]) {
        delete this.load.folders[folder.name];
      }

      removeListeners(folder);

      var _this = this;

      Common.each(folder.__folders, function (subfolder) {
        folder.removeFolder(subfolder);
      });
      Common.defer(function () {
        _this.onResize();
      });
    },
    open: function open() {
      this.closed = false;
    },
    close: function close() {
      this.closed = true;
    },
    hide: function hide() {
      this.domElement.style.display = 'none';
    },
    show: function show() {
      this.domElement.style.display = '';
    },
    onResize: function onResize() {
      var root = this.getRoot();

      if (root.scrollable) {
        var top = dom.getOffset(root.__ul).top;
        var h = 0;
        Common.each(root.__ul.childNodes, function (node) {
          if (!(root.autoPlace && node === root.__save_row)) {
            h += dom.getHeight(node);
          }
        });

        if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
          dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
        } else {
          dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = 'auto';
        }
      }

      if (root.__resize_handle) {
        Common.defer(function () {
          root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
        });
      }

      if (root.__closeButton) {
        root.__closeButton.style.width = root.width + 'px';
      }
    },
    onResizeDebounced: Common.debounce(function () {
      this.onResize();
    }, 50),
    remember: function remember() {
      if (Common.isUndefined(SAVE_DIALOGUE)) {
        SAVE_DIALOGUE = new CenteredDiv();
        SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
      }

      if (this.parent) {
        throw new Error('You can only call remember on a top level GUI.');
      }

      var _this = this;

      Common.each(Array.prototype.slice.call(arguments), function (object) {
        if (_this.__rememberedObjects.length === 0) {
          addSaveMenu(_this);
        }

        if (_this.__rememberedObjects.indexOf(object) === -1) {
          _this.__rememberedObjects.push(object);
        }
      });

      if (this.autoPlace) {
        setWidth(this, this.width);
      }
    },
    getRoot: function getRoot() {
      var gui = this;

      while (gui.parent) {
        gui = gui.parent;
      }

      return gui;
    },
    getSaveObject: function getSaveObject() {
      var toReturn = this.load;
      toReturn.closed = this.closed;

      if (this.__rememberedObjects.length > 0) {
        toReturn.preset = this.preset;

        if (!toReturn.remembered) {
          toReturn.remembered = {};
        }

        toReturn.remembered[this.preset] = getCurrentPreset(this);
      }

      toReturn.folders = {};
      Common.each(this.__folders, function (element, key) {
        toReturn.folders[key] = element.getSaveObject();
      });
      return toReturn;
    },
    save: function save() {
      if (!this.load.remembered) {
        this.load.remembered = {};
      }

      this.load.remembered[this.preset] = getCurrentPreset(this);
      markPresetModified(this, false);
      this.saveToLocalStorageIfPossible();
    },
    saveAs: function saveAs(presetName) {
      if (!this.load.remembered) {
        this.load.remembered = {};
        this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
      }

      this.load.remembered[presetName] = getCurrentPreset(this);
      this.preset = presetName;
      addPresetOption(this, presetName, true);
      this.saveToLocalStorageIfPossible();
    },
    revert: function revert(gui) {
      Common.each(this.__controllers, function (controller) {
        if (!this.getRoot().load.remembered) {
          controller.setValue(controller.initialValue);
        } else {
          recallSavedValue(gui || this.getRoot(), controller);
        }

        if (controller.__onFinishChange) {
          controller.__onFinishChange.call(controller, controller.getValue());
        }
      }, this);
      Common.each(this.__folders, function (folder) {
        folder.revert(folder);
      });

      if (!gui) {
        markPresetModified(this.getRoot(), false);
      }
    },
    listen: function listen(controller) {
      var init = this.__listening.length === 0;

      this.__listening.push(controller);

      if (init) {
        updateDisplays(this.__listening);
      }
    },
    updateDisplay: function updateDisplay() {
      Common.each(this.__controllers, function (controller) {
        controller.updateDisplay();
      });
      Common.each(this.__folders, function (folder) {
        folder.updateDisplay();
      });
    }
  });

  function addRow(gui, newDom, liBefore) {
    var li = document.createElement('li');

    if (newDom) {
      li.appendChild(newDom);
    }

    if (liBefore) {
      gui.__ul.insertBefore(li, liBefore);
    } else {
      gui.__ul.appendChild(li);
    }

    gui.onResize();
    return li;
  }

  function removeListeners(gui) {
    dom.unbind(window, 'resize', gui.__resizeHandler);

    if (gui.saveToLocalStorageIfPossible) {
      dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
    }
  }

  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];

    if (modified) {
      opt.innerHTML = opt.value + '*';
    } else {
      opt.innerHTML = opt.value;
    }
  }

  function augmentController(gui, li, controller) {
    controller.__li = li;
    controller.__gui = gui;
    Common.extend(controller, {
      options: function options(_options) {
        if (arguments.length > 1) {
          var nextSibling = controller.__li.nextElementSibling;
          controller.remove();
          return _add(gui, controller.object, controller.property, {
            before: nextSibling,
            factoryArgs: [Common.toArray(arguments)]
          });
        }

        if (Common.isArray(_options) || Common.isObject(_options)) {
          var _nextSibling = controller.__li.nextElementSibling;
          controller.remove();
          return _add(gui, controller.object, controller.property, {
            before: _nextSibling,
            factoryArgs: [_options]
          });
        }
      },
      name: function name(_name) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
        return controller;
      },
      listen: function listen() {
        controller.__gui.listen(controller);

        return controller;
      },
      remove: function remove() {
        controller.__gui.remove(controller);

        return controller;
      }
    });

    if (controller instanceof NumberControllerSlider) {
      var box = new NumberControllerBox(controller.object, controller.property, {
        min: controller.__min,
        max: controller.__max,
        step: controller.__step
      });
      Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
        var pc = controller[method];
        var pb = box[method];

        controller[method] = box[method] = function () {
          var args = Array.prototype.slice.call(arguments);
          pb.apply(box, args);
          return pc.apply(controller, args);
        };
      });
      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
    } else if (controller instanceof NumberControllerBox) {
      var r = function r(returned) {
        if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
          var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
          var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
          controller.remove();

          var newController = _add(gui, controller.object, controller.property, {
            before: controller.__li.nextElementSibling,
            factoryArgs: [controller.__min, controller.__max, controller.__step]
          });

          newController.name(oldName);
          if (wasListening) newController.listen();
          return newController;
        }

        return returned;
      };

      controller.min = Common.compose(r, controller.min);
      controller.max = Common.compose(r, controller.max);
    } else if (controller instanceof BooleanController) {
      dom.bind(li, 'click', function () {
        dom.fakeEvent(controller.__checkbox, 'click');
      });
      dom.bind(controller.__checkbox, 'click', function (e) {
        e.stopPropagation();
      });
    } else if (controller instanceof FunctionController) {
      dom.bind(li, 'click', function () {
        dom.fakeEvent(controller.__button, 'click');
      });
      dom.bind(li, 'mouseover', function () {
        dom.addClass(controller.__button, 'hover');
      });
      dom.bind(li, 'mouseout', function () {
        dom.removeClass(controller.__button, 'hover');
      });
    } else if (controller instanceof ColorController) {
      dom.addClass(li, 'color');
      controller.updateDisplay = Common.compose(function (val) {
        li.style.borderLeftColor = controller.__color.toString();
        return val;
      }, controller.updateDisplay);
      controller.updateDisplay();
    }

    controller.setValue = Common.compose(function (val) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }

      return val;
    }, controller.setValue);
  }

  function recallSavedValue(gui, controller) {
    var root = gui.getRoot();

    var matchedIndex = root.__rememberedObjects.indexOf(controller.object);

    if (matchedIndex !== -1) {
      var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];

      if (controllerMap === undefined) {
        controllerMap = {};
        root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
      }

      controllerMap[controller.property] = controller;

      if (root.load && root.load.remembered) {
        var presetMap = root.load.remembered;
        var preset = void 0;

        if (presetMap[gui.preset]) {
          preset = presetMap[gui.preset];
        } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
          preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
        } else {
          return;
        }

        if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
          var value = preset[matchedIndex][controller.property];
          controller.initialValue = value;
          controller.setValue(value);
        }
      }
    }
  }

  function _add(gui, object, property, params) {
    if (object[property] === undefined) {
      throw new Error('Object "' + object + '" has no property "' + property + '"');
    }

    var controller = void 0;

    if (params.color) {
      controller = new ColorController(object, property);
    } else {
      var factoryArgs = [object, property].concat(params.factoryArgs);
      controller = ControllerFactory.apply(gui, factoryArgs);
    }

    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }

    recallSavedValue(gui, controller);
    dom.addClass(controller.domElement, 'c');
    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;
    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);
    var li = addRow(gui, container, params.before);
    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);

    if (controller instanceof ColorController) {
      dom.addClass(li, 'color');
    } else {
      dom.addClass(li, _typeof$1(controller.getValue()));
    }

    augmentController(gui, li, controller);

    gui.__controllers.push(controller);

    return controller;
  }

  function getLocalStorageHash(gui, key) {
    return document.location.href + '.' + key;
  }

  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;

    gui.__preset_select.appendChild(opt);

    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }

  function showHideExplain(gui, explain) {
    explain.style.display = gui.useLocalStorage ? 'block' : 'none';
  }

  function addSaveMenu(gui) {
    var div = gui.__save_row = document.createElement('li');
    dom.addClass(gui.domElement, 'has-save');

    gui.__ul.insertBefore(div, gui.__ul.firstChild);

    dom.addClass(div, 'save-row');
    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');
    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');
    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');
    var select = gui.__preset_select = document.createElement('select');

    if (gui.load && gui.load.remembered) {
      Common.each(gui.load.remembered, function (value, key) {
        addPresetOption(gui, key, key === gui.preset);
      });
    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }

    dom.bind(select, 'change', function () {
      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }

      gui.preset = this.value;
    });
    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);

    if (SUPPORTS_LOCAL_STORAGE) {
      var explain = document.getElementById('dg-local-explain');
      var localStorageCheckBox = document.getElementById('dg-local-storage');
      var saveLocally = document.getElementById('dg-save-locally');
      saveLocally.style.display = 'block';

      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }

      showHideExplain(gui, explain);
      dom.bind(localStorageCheckBox, 'change', function () {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain(gui, explain);
      });
    }

    var newConstructorTextArea = document.getElementById('dg-new-constructor');
    dom.bind(newConstructorTextArea, 'keydown', function (e) {
      if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
        SAVE_DIALOGUE.hide();
      }
    });
    dom.bind(gears, 'click', function () {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });
    dom.bind(button, 'click', function () {
      gui.save();
    });
    dom.bind(button2, 'click', function () {
      var presetName = prompt('Enter a new preset name.');

      if (presetName) {
        gui.saveAs(presetName);
      }
    });
    dom.bind(button3, 'click', function () {
      gui.revert();
    });
  }

  function addResizeHandle(gui) {
    var pmouseX = void 0;
    gui.__resize_handle = document.createElement('div');
    Common.extend(gui.__resize_handle.style, {
      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
    });

    function drag(e) {
      e.preventDefault();
      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;
      return false;
    }

    function dragStop() {
      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);
    }

    function dragStart(e) {
      e.preventDefault();
      pmouseX = e.clientX;
      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);
      return false;
    }

    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);
    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
  }

  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';

    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }

    if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }

  function getCurrentPreset(gui, useInitialValues) {
    var toReturn = {};
    Common.each(gui.__rememberedObjects, function (val, index) {
      var savedValues = {};
      var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
      Common.each(controllerMap, function (controller, property) {
        savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });
      toReturn[index] = savedValues;
    });
    return toReturn;
  }

  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value === gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }

  function updateDisplays(controllerArray) {
    if (controllerArray.length !== 0) {
      requestAnimationFrame$1$1.call(window, function () {
        updateDisplays(controllerArray);
      });
    }

    Common.each(controllerArray, function (c) {
      c.updateDisplay();
    });
  }
  var GUI$1 = GUI;

  var Demo = function () {
    function Demo() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "demo";

      _classCallCheck(this, Demo);

      this.id = id;
      this.renderer = null;
      this.loadingManager = new three.LoadingManager();
      this.assets = new Map();
      this.scene = new three.Scene();
      this.camera = null;
      this.controls = null;
      this.ready = false;
    }

    _createClass(Demo, [{
      key: "setRenderer",
      value: function setRenderer(renderer) {
        this.renderer = renderer;
        return this;
      }
    }, {
      key: "load",
      value: function load() {
        return Promise.resolve();
      }
    }, {
      key: "initialize",
      value: function initialize() {}
    }, {
      key: "render",
      value: function render(delta) {
        this.renderer.render(this.scene, this.camera);
      }
    }, {
      key: "registerOptions",
      value: function registerOptions(menu) {}
    }, {
      key: "reset",
      value: function reset() {
        this.scene = new three.Scene();
        this.camera = null;

        if (this.controls !== null) {
          this.controls.dispose();
          this.controls = null;
        }

        this.ready = false;
        return this;
      }
    }]);

    return Demo;
  }();

  var DemoManagerEvent = function (_Event) {
    _inherits(DemoManagerEvent, _Event);

    function DemoManagerEvent(type) {
      var _this;

      _classCallCheck(this, DemoManagerEvent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DemoManagerEvent).call(this, type));
      _this.previousDemo = null;
      _this.demo = null;
      return _this;
    }

    return DemoManagerEvent;
  }(syntheticEvent.Event);

  var change = new DemoManagerEvent("change");
  var load = new DemoManagerEvent("load");

  var DemoManager = function (_EventTarget) {
    _inherits(DemoManager, _EventTarget);

    function DemoManager(viewport) {
      var _this2;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$aside = _ref.aside,
          aside = _ref$aside === void 0 ? viewport : _ref$aside,
          renderer = _ref.renderer;

      _classCallCheck(this, DemoManager);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(DemoManager).call(this));
      _this2.renderer = renderer !== undefined ? renderer : function () {
        var renderer = new three.WebGLRenderer();
        renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        return renderer;
      }();
      viewport.appendChild(_this2.renderer.domElement);
      _this2.clock = new three.Clock();
      _this2.menu = new GUI$1({
        autoPlace: false
      });
      aside.appendChild(_this2.menu.domElement);
      _this2.demos = new Map();
      _this2.demo = null;
      _this2.currentDemo = null;
      return _this2;
    }

    _createClass(DemoManager, [{
      key: "resetMenu",
      value: function resetMenu() {
        var _this3 = this;

        var node = this.menu.domElement.parentNode;
        var menu = new GUI$1({
          autoPlace: false
        });

        if (this.demos.size > 1) {
          var selection = menu.add(this, "demo", Array.from(this.demos.keys()));
          selection.onChange(function () {
            return _this3.loadDemo();
          });
        }

        node.removeChild(this.menu.domElement);
        node.appendChild(menu.domElement);
        this.menu.destroy();
        this.menu = menu;
        return menu;
      }
    }, {
      key: "startDemo",
      value: function startDemo(demo) {
        if (demo.id === this.demo) {
          demo.initialize();
          demo.registerOptions(this.resetMenu());
          demo.ready = true;
          load.demo = demo;
          this.dispatchEvent(load);
        }
      }
    }, {
      key: "loadDemo",
      value: function loadDemo() {
        var _this4 = this;

        var nextDemo = this.demos.get(this.demo);
        var currentDemo = this.currentDemo;
        var renderer = this.renderer;
        window.location.hash = nextDemo.id;

        if (currentDemo !== null) {
          currentDemo.reset();
        }

        this.menu.domElement.style.display = "none";
        change.previousDemo = currentDemo;
        change.demo = nextDemo;
        this.currentDemo = nextDemo;
        this.dispatchEvent(change);
        renderer.clear();
        nextDemo.load().then(function () {
          return _this4.startDemo(nextDemo);
        })["catch"](console.error);
      }
    }, {
      key: "addDemo",
      value: function addDemo(demo) {
        var hash = window.location.hash.slice(1);
        var currentDemo = this.currentDemo;
        this.demos.set(demo.id, demo.setRenderer(this.renderer));

        if (this.demo === null && hash.length === 0 || demo.id === hash) {
          this.demo = demo.id;
          this.loadDemo();
        }

        this.resetMenu();

        if (currentDemo !== null && currentDemo.ready) {
          currentDemo.registerOptions(this.menu);
        }

        return this;
      }
    }, {
      key: "removeDemo",
      value: function removeDemo(id) {
        var demos = this.demos;
        var firstEntry;

        if (demos.has(id)) {
          demos["delete"](id);

          if (this.demo === id && demos.size > 0) {
            firstEntry = demos.entries().next().value;
            this.demo = firstEntry[0];
            this.currentDemo = firstEntry[1];
            this.loadDemo();
          } else {
            this.demo = null;
            this.currentDemo = null;
            this.renderer.clear();
          }
        }

        return this;
      }
    }, {
      key: "setSize",
      value: function setSize(width, height, updateStyle) {
        var demo = this.currentDemo;
        this.renderer.setSize(width, height, updateStyle);

        if (demo !== null && demo.camera !== null) {
          var camera = demo.camera;

          if (camera instanceof three.OrthographicCamera) {
            camera.left = width / -2.0;
            camera.right = width / 2.0;
            camera.top = height / 2.0;
            camera.bottom = height / -2.0;
            camera.updateProjectionMatrix();
          } else if (!(camera instanceof three.CubeCamera)) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        }
      }
    }, {
      key: "render",
      value: function render(now) {
        var demo = this.currentDemo;
        var delta = this.clock.getDelta();

        if (demo !== null && demo.ready) {
          demo.render(delta);
        }
      }
    }]);

    return DemoManager;
  }(syntheticEvent.EventTarget);

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

  var PointerButton = {
    MAIN: 0,
    AUXILIARY: 1,
    SECONDARY: 2
  };

  var TWO_PI = Math.PI * 2;
  var v = new mathDs.Vector3();
  var m = new mathDs.Matrix4();
  var RotationManager = function () {
    function RotationManager(position, quaternion, target, settings) {
      _classCallCheck(this, RotationManager);

      this.position = position;
      this.quaternion = quaternion;
      this.target = target;
      this.settings = settings;
      this.spherical = new mathDs.Spherical();
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
          m.lookAt(v.subVectors(this.position, this.target), rotation.pivotOffset, rotation.up);
        } else {
          m.lookAt(v.set(0, 0, 0), this.target.setFromSpherical(this.spherical), rotation.up);
        }

        this.quaternion.setFromRotationMatrix(m);
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
          v.subVectors(position, target);
        } else {
          v.subVectors(target, position).normalize();
        }

        spherical.setFromVector3(v);
        spherical.radius = Math.max(spherical.radius, 1e-6);
        this.updateQuaternion();
        return this;
      }
    }, {
      key: "getViewDirection",
      value: function getViewDirection() {
        var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
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

  var x = new mathDs.Vector3(1, 0, 0);
  var y = new mathDs.Vector3(0, 1, 0);
  var z = new mathDs.Vector3(0, 0, 1);

  var v$1 = new mathDs.Vector3();
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
        v$1.copy(axis).applyQuaternion(this.quaternion).multiplyScalar(distance);
        this.position.add(v$1);

        if (this.settings.general.orbit) {
          this.target.add(v$1);
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

      this.up = new mathDs.Vector3();
      this.up.copy(y);
      this.pivotOffset = new mathDs.Vector3();
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
      this.target = new mathDs.Vector3();
      this.settings = new Settings();
      this.rotationManager = new RotationManager(position, quaternion, this.target, this.settings);
      this.translationManager = new TranslationManager(position, quaternion, this.target, this.settings);

      this.strategies = function (rotationManager, translationManager) {
        var state = translationManager.movementState;
        return new Map([[Action.MOVE_FORWARD, new MovementStrategy(state, Direction.FORWARD)], [Action.MOVE_LEFT, new MovementStrategy(state, Direction.LEFT)], [Action.MOVE_BACKWARD, new MovementStrategy(state, Direction.BACKWARD)], [Action.MOVE_RIGHT, new MovementStrategy(state, Direction.RIGHT)], [Action.MOVE_DOWN, new MovementStrategy(state, Direction.DOWN)], [Action.MOVE_UP, new MovementStrategy(state, Direction.UP)], [Action.ZOOM_OUT, new ZoomStrategy(rotationManager, false)], [Action.ZOOM_IN, new ZoomStrategy(rotationManager, true)]]);
      }(this.rotationManager, this.translationManager);

      this.lastScreenPosition = new mathDs.Vector2();
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
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
        target.copy(this.target);

        if (!this.settings.general.orbit) {
          target.add(this.position);
        }

        return target;
      }
    }, {
      key: "getViewDirection",
      value: function getViewDirection() {
        var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
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

  var air = 0;
  var HermiteDataHelper = function (_Group) {
    _inherits(HermiteDataHelper, _Group);

    function HermiteDataHelper() {
      var _this;

      var cellPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var cellSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var useMaterialIndices = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var useEdgeData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

      _classCallCheck(this, HermiteDataHelper);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(HermiteDataHelper).call(this));
      _this.name = "HermiteDataHelper";
      _this.cellPosition = cellPosition;
      _this.cellSize = cellSize;
      _this.data = data;
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

      try {
        _this.update(useMaterialIndices, useEdgeData);
      } catch (e) {}

      return _this;
    }

    _createClass(HermiteDataHelper, [{
      key: "validate",
      value: function validate() {
        var error = null;

        if (this.cellPosition === null) {
          error = new Error("The cell position is not defined");
        } else if (this.cellSize <= 0) {
          error = new Error("Invalid cell size: " + this.cellSize);
        } else if (this.data === null) {
          error = new Error("No data");
        } else {
          if (this.data.empty) {
            error = new Error("The provided data is empty");
          }

          if (this.data.compressed) {
            error = new Error("The provided data must be uncompressed");
          }
        }

        return error;
      }
    }, {
      key: "set",
      value: function set(cellPosition, cellSize, data) {
        this.cellPosition = cellPosition;
        this.cellSize = cellSize;
        this.data = data;
        return this;
      }
    }, {
      key: "update",
      value: function update() {
        var useMaterialIndices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var useEdgeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var data = this.data;
        var error = this.validate();
        this.dispose();

        if (error !== null) {
          throw error;
        } else {
          if (useMaterialIndices) {
            this.createPoints(data);
          }

          if (useEdgeData && data.edgeData !== null) {
            this.createEdges(data);
          }
        }

        return this;
      }
    }, {
      key: "createPoints",
      value: function createPoints(data) {
        var materialIndices = data.materialIndices;
        var n = Math.cbrt(materialIndices.length) - 1;
        var s = this.cellSize;
        var base = this.cellPosition;
        var offset = new three.Vector3();
        var position = new three.Vector3();
        var color = new Float32Array([0.0, 0.0, 0.0]);
        var geometry = new three.BufferGeometry();
        var vertexCount = data.materials;
        var positions = new Float32Array(vertexCount * 3);
        var colors = new Float32Array(vertexCount * 3);
        var x, y, z;
        var i, j;

        for (i = 0, j = 0, z = 0; z <= n; ++z) {
          offset.z = z * s / n;

          for (y = 0; y <= n; ++y) {
            offset.y = y * s / n;

            for (x = 0; x <= n; ++x) {
              offset.x = x * s / n;

              if (materialIndices[i++] !== air) {
                position.addVectors(base, offset);
                positions[j] = position.x;
                colors[j++] = color[0];
                positions[j] = position.y;
                colors[j++] = color[1];
                positions[j] = position.z;
                colors[j++] = color[2];
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
        var edgeData = data.edgeData;
        var n = Math.cbrt(data.materialIndices.length) - 1;
        var s = this.cellSize;
        var normalA = new three.Vector3();
        var normalB = new three.Vector3();
        var edgeIterators = [edgeData.edgesX(this.cellPosition, this.cellSize), edgeData.edgesY(this.cellPosition, this.cellSize), edgeData.edgesZ(this.cellPosition, this.cellSize)];
        var axisColors = [new Float32Array([0.6, 0.0, 0.0]), new Float32Array([0.0, 0.6, 0.0]), new Float32Array([0.0, 0.0, 0.6])];
        var normalColor = new Float32Array([0.0, 1.0, 1.0]);
        var lineSegmentsMaterial = new three.LineBasicMaterial({
          vertexColors: three.VertexColors
        });
        var edgePositions, edgeColors;
        var normalPositions, normalColors;
        var vertexCount, edgeColor, geometry, edges, edge;
        var d, i, j;

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
                edgePositions[i] = edge.a.x;
                edgeColors[i++] = edgeColor[0];
                edgePositions[i] = edge.a.y;
                edgeColors[i++] = edgeColor[1];
                edgePositions[i] = edge.a.z;
                edgeColors[i++] = edgeColor[2];
                edgePositions[i] = edge.b.x;
                edgeColors[i++] = edgeColor[0];
                edgePositions[i] = edge.b.y;
                edgeColors[i++] = edgeColor[1];
                edgePositions[i] = edge.b.z;
                edgeColors[i++] = edgeColor[2];
                edge.computeZeroCrossingPosition(normalA);
                normalB.copy(normalA).addScaledVector(edge.n, 0.25 * s / n);
                normalPositions[j] = normalA.x;
                normalColors[j++] = normalColor[0];
                normalPositions[j] = normalA.y;
                normalColors[j++] = normalColor[1];
                normalPositions[j] = normalA.z;
                normalColors[j++] = normalColor[2];
                normalPositions[j] = normalB.x;
                normalColors[j++] = normalColor[0];
                normalPositions[j] = normalB.y;
                normalColors[j++] = normalColor[1];
                normalPositions[j] = normalB.z;
                normalColors[j++] = normalColor[2];
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
        var child, children;
        var i, l;

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
      get: function get() {
        return this.children[0];
      }
    }, {
      key: "edges",
      get: function get() {
        return this.children[1];
      }
    }, {
      key: "normals",
      get: function get() {
        return this.children[2];
      }
    }], [{
      key: "air",
      set: function set(value) {
        air = value;
      }
    }]);

    return HermiteDataHelper;
  }(three.Group);

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
  var v$2 = new mathDs.Vector3();
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
          p.addVectors(this.a, v$2.copy(ab).multiplyScalar(c));
          densityC = sdf.sample(p);

          if (Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {
            break;
          } else {
            p.addVectors(this.a, v$2.copy(ab).multiplyScalar(a));
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
        var dx = sdf.sample(p.addVectors(position, v$2.set(E, 0, 0))) - sdf.sample(p.subVectors(position, v$2.set(E, 0, 0)));
        var dy = sdf.sample(p.addVectors(position, v$2.set(0, E, 0))) - sdf.sample(p.subVectors(position, v$2.set(0, E, 0)));
        var dz = sdf.sample(p.addVectors(position, v$2.set(0, 0, E))) - sdf.sample(p.subVectors(position, v$2.set(0, 0, E)));
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

  var m$1 = new mathDs.Matrix4();
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
  var b = new mathDs.Vector3();

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

    return b.set(e[0], e[3], e[5]);
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

  var p$1 = new mathDs.Vector3();

  function calculateError(ata, atb, x) {
    ata.applyToVector3(p$1.copy(x));
    p$1.subVectors(atb, p$1);
    return p$1.dot(p$1);
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
          p$1.copy(data.massPointSum).divideScalar(data.numPoints);
          massPoint.copy(p$1);
          ata.applyToVector3(p$1);
          atb.sub(p$1);
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

  var ContouringDemo = function (_Demo) {
    _inherits(ContouringDemo, _Demo);

    function ContouringDemo() {
      var _this;

      _classCallCheck(this, ContouringDemo);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ContouringDemo).call(this, "contouring"));
      _this.cellSize = 1;
      _this.cellPosition = new three.Vector3();

      _this.cellPosition.subScalar(_this.cellSize / 2);

      _this.sdfType = SDFType.SUPER_PRIMITIVE;
      _this.euler = new mathDs.Euler();
      _this.scale = new three.Vector3();
      _this.superPrimitivePreset = SuperPrimitivePreset.TORUS;
      _this.heightfield = new Heightfield();
      _this.hermiteData = null;
      _this.octreeHelper = new OctreeHelper();
      _this.hermiteDataHelper = new HermiteDataHelper();
      _this.box3Helper = new three.Box3Helper();
      _this.material = new three.MeshPhysicalMaterial({
        color: 0x009188,
        metalness: 0.23,
        roughness: 0.31,
        clearcoat: 0.94,
        clearcoatRoughness: 0.15,
        dithering: true
      });
      _this.mesh = null;
      _this.vertices = 0;
      _this.faces = 0;
      return _this;
    }

    _createClass(ContouringDemo, [{
      key: "createSVO",
      value: function createSVO() {
        var octreeHelper = this.octreeHelper;
        octreeHelper.octree = new SparseVoxelOctree(this.hermiteData, this.cellPosition, this.cellSize);
        octreeHelper.update();

        (function (octreeHelper) {
          var groups = octreeHelper.children;
          var group, children, child, color;
          var i, j, il, jl;

          for (i = 0, il = groups.length; i < il; ++i) {
            group = groups[i];
            children = group.children;
            color = i + 1 < il ? 0x303030 : 0xbb3030;

            for (j = 0, jl = children.length; j < jl; ++j) {
              child = children[j];
              child.material.color.setHex(color);
            }
          }
        })(octreeHelper);
      }
    }, {
      key: "createHermiteData",
      value: function createHermiteData() {
        var sdf;

        switch (this.sdfType) {
          case SDFType.SUPER_PRIMITIVE:
            sdf = SuperPrimitive.create(this.superPrimitivePreset);
            sdf.quaternion.setFromEuler(this.euler);
            sdf.scale.copy(this.scale);
            break;

          case SDFType.HEIGHTFIELD:
            sdf = this.heightfield;
            sdf.position.set(-1, -0.25, -1);
            sdf.quaternion.set(0, 0, 0, 1);
            sdf.scale.set(2, 0.5, 2);
            break;
        }

        sdf.updateInverseTransformation();
        this.box3Helper.box = sdf.getBoundingBox();
        this.hermiteData = ConstructiveSolidGeometry.run(this.cellPosition.toArray(), this.cellSize, null, sdf.setOperationType(OperationType.UNION));
        return this.hermiteData;
      }
    }, {
      key: "contour",
      value: function contour() {
        var isosurface = DualContouring.run(this.octreeHelper.octree);
        var mesh, geometry;

        if (isosurface !== null) {
          if (this.mesh !== null) {
            this.mesh.geometry.dispose();
            this.scene.remove(this.mesh);
          }

          geometry = new three.BufferGeometry();
          geometry.setIndex(new three.BufferAttribute(isosurface.indices, 1));
          geometry.addAttribute("position", new three.BufferAttribute(isosurface.positions, 3));
          geometry.addAttribute("normal", new three.BufferAttribute(isosurface.normals, 3));
          mesh = new three.Mesh(geometry, this.material);
          this.vertices = isosurface.positions.length / 3;
          this.faces = isosurface.indices.length / 3;
          this.mesh = mesh;
          this.scene.add(mesh);
        }
      }
    }, {
      key: "load",
      value: function load() {
        var assets = this.assets;
        var loadingManager = this.loadingManager;
        var cubeTextureLoader = new three.CubeTextureLoader(loadingManager);
        var textureLoader = new three.TextureLoader(loadingManager);
        var path = "textures/skies/interstellar/";
        var format = ".jpg";
        var urls = [path + "px" + format, path + "nx" + format, path + "py" + format, path + "ny" + format, path + "pz" + format, path + "nz" + format];
        return new Promise(function (resolve, reject) {
          if (assets.size === 0) {
            loadingManager.onError = reject;

            loadingManager.onProgress = function (item, loaded, total) {
              if (loaded === total) {
                resolve();
              }
            };

            cubeTextureLoader.load(urls, function (textureCube) {
              assets.set("sky", textureCube);
            });
            textureLoader.load("textures/height/03.png", function (texture) {
              assets.set("heightmap", texture);
            });
          } else {
            resolve();
          }
        });
      }
    }, {
      key: "initialize",
      value: function initialize() {
        var scene = this.scene;
        var assets = this.assets;
        var renderer = this.renderer;
        this.sdfType = SDFType.SUPER_PRIMITIVE;
        this.euler.set(4.11, 3.56, 4.74, mathDs.RotationOrder.XYZ);
        this.scale.set(0.34, 0.47, 0.25);
        this.superPrimitivePreset = SuperPrimitivePreset.TORUS;
        var camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 25);
        camera.position.set(0, 0, -2);
        this.camera = camera;
        var controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
        controls.settings.pointer.lock = false;
        controls.settings.sensitivity.rotation = 0.00175;
        controls.settings.sensitivity.translation = 0.425;
        controls.settings.sensitivity.zoom = 0.2;
        controls.settings.zoom.maxDistance = 20;
        controls.lookAt(scene.position);
        this.controls = controls;
        scene.fog = new three.FogExp2(0xf4f4f4, 0.075);
        renderer.setClearColor(scene.fog.color);
        scene.background = assets.get("sky");
        this.material.envMap = assets.get("sky");
        var ambientLight = new three.AmbientLight(0x404040);
        var directionalLight = new three.DirectionalLight(0xffbbaa);
        directionalLight.position.set(-0.5, 1.5, 1);
        directionalLight.target.position.copy(scene.position);
        scene.add(directionalLight);
        scene.add(ambientLight);
        this.heightfield.fromImage(assets.get("heightmap").image);
        HermiteData.resolution = 64;
        HermiteDataHelper.air = Material.AIR;
        VoxelCell.errorThreshold = 0.005;
        this.createHermiteData();
        this.octreeHelper.visible = true;
        scene.add(this.octreeHelper);
        scene.add(this.hermiteDataHelper);
        scene.add(this.box3Helper);
        this.createSVO();
        var box = new three.Box3();
        var halfSize = this.cellSize / 2;
        box.min.set(-halfSize, -halfSize, -halfSize);
        box.max.set(halfSize, halfSize, halfSize);
        var boxHelper = new three.Box3Helper(box, 0x303030);
        boxHelper.material.transparent = true;
        boxHelper.material.opacity = 0.25;
        scene.add(boxHelper);
      }
    }, {
      key: "render",
      value: function render(delta) {
        this.controls.update(delta);

        _get(_getPrototypeOf(ContouringDemo.prototype), "render", this).call(this, delta);
      }
    }, {
      key: "registerOptions",
      value: function registerOptions(menu) {
        var _this2 = this;

        var octreeHelper = this.octreeHelper;
        var hermiteDataHelper = this.hermiteDataHelper;
        var box3Helper = this.box3Helper;
        var presets = Object.keys(SuperPrimitivePreset).concat(["HEIGHTFIELD"]);
        var material = this.material;
        var params = {
          "SDF": presets[this.superPrimitivePreset],
          "color": material.color.getHex(),
          "level mask": octreeHelper.children.length,
          "show SVO": function showSVO() {
            if (params.SDF !== "HEIGHTFIELD") {
              _this2.superPrimitivePreset = SuperPrimitivePreset[params.SDF];
              _this2.sdfType = SDFType.SUPER_PRIMITIVE;
            } else {
              _this2.sdfType = SDFType.HEIGHTFIELD;
            }

            _this2.createHermiteData();

            _this2.createSVO();

            if (_this2.mesh !== null) {
              _this2.scene.remove(_this2.mesh);
            }

            hermiteDataHelper.dispose();
            octreeHelper.visible = true;
            box3Helper.visible = true;
            params["level mask"] = octreeHelper.children.length;
          },
          "show Hermite data": function showHermiteData() {
            hermiteDataHelper.set(_this2.cellPosition, _this2.cellSize, _this2.hermiteData);

            try {
              hermiteDataHelper.update();
              hermiteDataHelper.visible = true;
              octreeHelper.visible = false;
              box3Helper.visible = false;
            } catch (e) {
              console.error(e);
            }
          },
          "contour": function contour() {
            _this2.createHermiteData();

            _this2.createSVO();

            _this2.contour();

            octreeHelper.visible = false;
            hermiteDataHelper.visible = false;
            box3Helper.visible = false;
          }
        };
        menu.add(params, "SDF", presets).onChange(params["show SVO"]);
        var folder = menu.addFolder("Octree Helper");
        folder.add(params, "level mask").min(0).max(1 + Math.log2(128)).step(1).onChange(function () {
          var i, l;

          for (i = 0, l = octreeHelper.children.length; i < l; ++i) {
            octreeHelper.children[i].visible = params["level mask"] >= octreeHelper.children.length || i === params["level mask"];
          }
        }).listen();
        folder = menu.addFolder("Transformation");
        var subFolder = folder.addFolder("Rotation");
        subFolder.add(this.euler, "x").min(0.0).max(Math.PI * 2).step(0.0001);
        subFolder.add(this.euler, "y").min(0.0).max(Math.PI * 2).step(0.0001);
        subFolder.add(this.euler, "z").min(0.0).max(Math.PI * 2).step(0.0001);
        subFolder = folder.addFolder("Scale");
        subFolder.add(this.scale, "x").min(0.0).max(0.5).step(0.0001);
        subFolder.add(this.scale, "y").min(0.0).max(0.5).step(0.0001);
        subFolder.add(this.scale, "z").min(0.0).max(0.5).step(0.0001);
        folder = menu.addFolder("Material");
        folder.add(material, "metalness").min(0.0).max(1.0).step(0.0001);
        folder.add(material, "roughness").min(0.0).max(1.0).step(0.0001);
        folder.add(material, "clearcoat").min(0.0).max(1.0).step(0.0001);
        folder.add(material, "clearcoatRoughness").min(0.0).max(1.0).step(0.0001);
        folder.add(material, "reflectivity").min(0.0).max(1.0).step(0.0001);
        folder.addColor(params, "color").onChange(function () {
          return material.color.setHex(params.color);
        });
        folder.add(material, "wireframe");
        folder.add(material, "flatShading").onChange(function () {
          material.needsUpdate = true;
        });
        menu.add(HermiteData, "resolution", [32, 64, 128]);
        menu.add(VoxelCell, "errorThreshold").min(0.0).max(0.01).step(0.0001);
        menu.add(params, "show SVO");
        menu.add(params, "show Hermite data");
        menu.add(params, "contour");
        folder = menu.addFolder("Render Info");
        folder.add(this, "vertices").listen();
        folder.add(this, "faces").listen();
      }
    }]);

    return ContouringDemo;
  }(Demo);

  var DataEvent = function (_Event) {
    _inherits(DataEvent, _Event);

    function DataEvent(type) {
      var _this;

      _classCallCheck(this, DataEvent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DataEvent).call(this, type));
      _this.qefData = null;
      return _this;
    }

    return DataEvent;
  }(syntheticEvent.Event);

  var mouse = new three.Vector2();
  var updateEvent = new syntheticEvent.Event("update");
  var GridPointEditor = function (_EventTarget) {
    _inherits(GridPointEditor, _EventTarget);

    function GridPointEditor(cellPosition, cellSize, hermiteData, camera) {
      var _this;

      var dom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.body;

      _classCallCheck(this, GridPointEditor);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GridPointEditor).call(this));
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

    _createClass(GridPointEditor, [{
      key: "createGridPoints",
      value: function createGridPoints() {
        var gridPoints = this.gridPoints;
        var s = this.cellSize;
        var n = HermiteData.resolution;
        var base = this.cellPosition;
        var offset = new three.Vector3();
        var gridPointGeometry = new three.SphereBufferGeometry(0.05, 8, 8);
        var gridPointMaterial = this.gridPointMaterials[0];
        var gridPoint;
        var x, y, z;

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
          this.dispatchEvent(updateEvent);
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
      key: "registerOptions",
      value: function registerOptions(menu) {}
    }]);

    return GridPointEditor;
  }(syntheticEvent.EventTarget);

  var mouse$1 = new three.Vector2();
  var updateEvent$1 = new syntheticEvent.Event("update");
  var EdgeEditor = function (_EventTarget) {
    _inherits(EdgeEditor, _EventTarget);

    function EdgeEditor(cellPosition, cellSize, hermiteData, camera) {
      var _this;

      var dom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.body;

      _classCallCheck(this, EdgeEditor);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(EdgeEditor).call(this));
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
        color: 0xaa2200,
        side: three.DoubleSide,
        depthWrite: false,
        transparent: true,
        opacity: 0.2
      }), new three.MeshBasicMaterial({
        color: 0xffff00,
        side: three.DoubleSide,
        depthWrite: false,
        transparent: true,
        opacity: 0.4
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

    _createClass(EdgeEditor, [{
      key: "calculateEdgeId",
      value: function calculateEdgeId(i) {
        var edgeData = this.hermiteData.edgeData;
        var edges = edgeData.indices;
        var d, edgeCount;

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
        var edge, plane;

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
        var edge, line, plane;
        var lineGeometry, lineVertices;
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
          this.dispatchEvent(updateEvent$1);
        }
      }
    }, {
      key: "handleClick",
      value: function handleClick(event) {
        var edge = this.selectedEdge;
        event.preventDefault();
        var index, plane;

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
      key: "registerOptions",
      value: function registerOptions(menu) {
        var _this2 = this;

        var planes = this.planes;
        var params = {
          "show planes": false
        };
        menu.add(params, "show planes").onChange(function () {
          var activePlane = _this2.activePlane;
          planes.traverse(function (child) {
            if (child !== planes && child !== activePlane) {
              child.visible = params["show planes"];
            }
          });
        });
        var folder = menu.addFolder("Edge Adjustment");
        folder.add(this, "t").min(0).max(1).listen().step(1e-6).onChange(function () {
          if (_this2.hermiteData.edgeData !== null) {
            _this2.updateEdgeData();
          }
        });
        folder.add(this.s, "phi").min(1e-6).max(Math.PI - 1e-6).step(1e-6).listen().onChange(function () {
          if (_this2.hermiteData.edgeData !== null) {
            _this2.updateEdgeData();
          }
        });
        folder.add(this.s, "theta").min(1e-6).max(Math.PI - 1e-6).step(1e-6).listen().onChange(function () {
          if (_this2.hermiteData.edgeData !== null) {
            _this2.updateEdgeData();
          }
        });
        folder.open();
      }
    }]);

    return EdgeEditor;
  }(syntheticEvent.EventTarget);

  var updateEvent$2 = new DataEvent("update");
  var HermiteDataEditor = function (_EventTarget) {
    _inherits(HermiteDataEditor, _EventTarget);

    function HermiteDataEditor(cellPosition, cellSize, hermiteData, camera) {
      var _this;

      var dom = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.body;

      _classCallCheck(this, HermiteDataEditor);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(HermiteDataEditor).call(this));
      _this.hermiteData = hermiteData;
      _this.cellPosition = cellPosition;
      _this.cellSize = cellSize;
      _this.gridPointEditor = new GridPointEditor(cellPosition, cellSize, hermiteData, camera, dom);

      _this.gridPointEditor.addEventListener("update", _assertThisInitialized(_this));

      _this.gridPointEditor.setEnabled(true);

      _this.edgeEditor = new EdgeEditor(cellPosition, cellSize, hermiteData, camera, dom);

      _this.edgeEditor.addEventListener("update", _assertThisInitialized(_this));

      _this.qefData = new QEFData();
      return _this;
    }

    _createClass(HermiteDataEditor, [{
      key: "createEdgeData",
      value: function createEdgeData() {
        var n = HermiteData.resolution;
        var m = n + 1;
        var mm = m * m;
        var indexOffsets = new Uint32Array([1, m, mm]);
        var materialIndices = this.hermiteData.materialIndices;
        var edgeData = new EdgeData(n, EdgeData.calculate1DEdgeCount(n));
        var edges, zeroCrossings, normals;
        var indexA, indexB;
        var c, d, a, axis;
        var x, y, z;
        var X, Y, Z;

        for (a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {
          axis = sparseOctree.pattern[a];
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
        var edge;
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

              updateEvent$2.qefData = this.qefData;
              this.dispatchEvent(updateEvent$2);
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
      key: "registerOptions",
      value: function registerOptions(menu) {
        var _this2 = this;

        var params = {
          "edit mode": 0
        };
        menu.add(params, "edit mode", {
          materials: 0,
          edges: 1
        }).onChange(function () {
          var editGridPoints = Number.parseInt(params["edit mode"]) === 0;

          _this2.gridPointEditor.setEnabled(editGridPoints);

          _this2.edgeEditor.setEnabled(!editGridPoints);
        });
        this.edgeEditor.registerOptions(menu);
      }
    }, {
      key: "gridPoints",
      get: function get() {
        return this.gridPointEditor.gridPoints;
      }
    }, {
      key: "edges",
      get: function get() {
        return this.edgeEditor.edges;
      }
    }, {
      key: "planes",
      get: function get() {
        return this.edgeEditor.planes;
      }
    }]);

    return HermiteDataEditor;
  }(syntheticEvent.EventTarget);

  var VoxelDemo = function (_Demo) {
    _inherits(VoxelDemo, _Demo);

    function VoxelDemo() {
      var _this;

      _classCallCheck(this, VoxelDemo);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(VoxelDemo).call(this, "voxel"));
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

    _createClass(VoxelDemo, [{
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
            {
              try {
                this.hermiteDataHelper.update(true, false);
              } catch (e) {}

              this.solveQEF(event.qefData);
              break;
            }
        }
      }
    }, {
      key: "initialize",
      value: function initialize() {
        var scene = this.scene;
        var renderer = this.renderer;
        var camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 50);
        camera.position.set(-2, 1, 2);
        this.camera = camera;
        var controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
        controls.settings.pointer.lock = false;
        controls.settings.sensitivity.zoom = 0.1;
        controls.settings.translation.enabled = false;
        controls.settings.zoom.maxDistance = 40;
        controls.lookAt(scene.position);
        this.controls = controls;
        scene.fog = new three.FogExp2(0xf4f4f4, 0.025);
        renderer.setClearColor(scene.fog.color);
        HermiteData.resolution = 1;
        HermiteDataHelper.air = Material.AIR;
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
        this.vertex.visible = false;
        scene.add(this.vertex);
      }
    }, {
      key: "render",
      value: function render(delta) {
        this.controls.update(delta);

        _get(_getPrototypeOf(VoxelDemo.prototype), "render", this).call(this, delta);
      }
    }, {
      key: "registerOptions",
      value: function registerOptions(menu) {
        var folder = menu.addFolder("Vertex Position");
        folder.add(this.result, "x").listen();
        folder.add(this.result, "y").listen();
        folder.add(this.result, "z").listen();
        folder.add(this, "error").listen();
        folder.open();
        this.hermiteDataEditor.registerOptions(menu);
      }
    }]);

    return VoxelDemo;
  }(Demo);

  var manager;

  function render(now) {
    requestAnimationFrame(render);
    manager.render(now);
  }

  function onChange(event) {
    document.getElementById("viewport").children[0].style.display = "initial";
  }

  function onLoad(event) {
    document.getElementById("viewport").children[0].style.display = "none";
  }

  window.addEventListener("load", function main(event) {
    this.removeEventListener("load", main);
    var viewport = document.getElementById("viewport");
    var renderer = new three.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000);
    manager = new DemoManager(viewport, {
      aside: document.getElementById("aside"),
      renderer: renderer
    });
    manager.addEventListener("change", onChange);
    manager.addEventListener("load", onLoad);
    var demos = [new ContouringDemo(), new VoxelDemo()];

    if (demos.map(function (demo) {
      return demo.id;
    }).indexOf(window.location.hash.slice(1)) === -1) {
      window.location.hash = "";
    }

    for (var _i = 0, _demos = demos; _i < _demos.length; _i++) {
      var demo = _demos[_i];
      manager.addDemo(demo);
    }

    render();
  });
  window.addEventListener("resize", function () {
    var timeoutId = 0;

    function handleResize(event) {
      var width = event.target.innerWidth;
      var height = event.target.innerHeight;
      manager.setSize(width, height);
      timeoutId = 0;
    }

    return function onResize(event) {
      if (timeoutId === 0) {
        timeoutId = setTimeout(handleResize, 66, event);
      }
    };
  }());
  document.addEventListener("keydown", function onKeyDown(event) {
    var aside = this.getElementById("aside");

    if (event.altKey && aside !== null) {
      event.preventDefault();
      aside.style.visibility = aside.style.visibility === "hidden" ? "visible" : "hidden";
    }
  });

}(THREE, SYNTHETICEVENT, MATHDS, ITERATORRESULT, SPARSEOCTREE));
