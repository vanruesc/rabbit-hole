(function (three) {
	'use strict';

	/**
	 * A demo base class.
	 */

	class Demo {

		/**
		 * Constructs a new demo.
		 *
		 * @param {String} [id="demo"] - A unique identifier.
		 */

		constructor(id = "demo") {

			/**
			 * The id of this demo.
			 *
			 * @type {String}
			 */

			this.id = id;

			/**
			 * A renderer.
			 *
			 * @type {WebGLRenderer}
			 * @protected
			 */

			this.renderer = null;

			/**
			 * A loading manager.
			 *
			 * @type {LoadingManager}
			 * @protected
			 */

			this.loadingManager = new three.LoadingManager();

			/**
			 * A collection of loaded assets.
			 *
			 * @type {Map}
			 * @protected
			 */

			this.assets = new Map();

			/**
			 * The scene.
			 *
			 * @type {Scene}
			 * @protected
			 */

			this.scene = new three.Scene();

			/**
			 * The camera.
			 *
			 * @type {Camera}
			 * @protected
			 */

			this.camera = null;

			/**
			 * Camera controls.
			 *
			 * @type {Disposable}
			 * @protected
			 */

			this.controls = null;

			/**
			 * Indicates whether this demo is ready for rendering.
			 *
			 * The {@link DemoManager} updates this flag automatically.
			 *
			 * @type {Boolean}
			 */

			this.ready = false;

		}

		/**
		 * Sets the renderer.
		 *
		 * @param {WebGLRenderer} renderer - A renderer.
		 * @return {Demo} This demo.
		 */

		setRenderer(renderer) {

			this.renderer = renderer;

			return this;

		}

		/**
		 * Loads this demo.
		 *
		 * Override this method to load assets.
		 *
		 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
		 */

		load() {

			return Promise.resolve();

		}

		/**
		 * Initialises this demo.
		 *
		 * This method will be called after reset.
		 */

		initialize() {}

		/**
		 * Renders this demo.
		 *
		 * Override this method to update and render the demo manually.
		 *
		 * @param {Number} delta - The time since the last frame in seconds.
		 */

		render(delta) {

			this.renderer.render(this.scene, this.camera);

		}

		/**
		 * Registers configuration options.
		 *
		 * This method will be called once after initialize and then every time a new
		 * demo is added.
		 *
		 * @param {GUI} menu - A menu.
		 */

		registerOptions(menu) {}

		/**
		 * Resets this demo.
		 *
		 * @return {Demo} This demo.
		 */

		reset() {

			const fog = this.scene.fog;

			this.scene = new three.Scene();
			this.scene.fog = fog;
			this.camera = null;

			if(this.controls !== null) {

				this.controls.dispose();
				this.controls = null;

			}

			this.ready = false;

			return this;

		}

	}

	/**
	 * A basic event.
	 */

	class Event {

		/**
		 * Creates a new event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			/**
			 * The name of the event.
			 *
			 * @type {String}
			 */

			this.type = type;

			/**
			 * A reference to the target to which the event was originally dispatched.
			 *
			 * @type {Object}
			 */

			this.target = null;

		}

	}

	/**
	 * A base class for objects that can receive events and may have listeners for
	 * them.
	 */

	class EventTarget {

		/**
		 * Constructs a new EventTarget.
		 */

		constructor() {

			/**
			 * A map of event listener functions.
			 *
			 * @type {Map}
			 */

			this.listenerFunctions = new Map();

			/**
			 * A map of event listener objects.
			 *
			 * @type {Map}
			 */

			this.listenerObjects = new Map();

		}

		/**
		 * Registers an event handler of a specific event type on the event target.
		 *
		 * @param {String} type - The event type to listen for.
		 * @param {Object} listener - The object that receives a notification when an event of the specified type occurs.
		 */

		addEventListener(type, listener) {

			const m = (typeof listener === "function") ? this.listenerFunctions : this.listenerObjects;

			if(m.has(type)) {

				m.get(type).add(listener);

			} else {

				m.set(type, new Set([listener]));

			}

		}

		/**
		 * Removes an event handler of a specific event type from the event target.
		 *
		 * @param {String} type - The event type to remove.
		 * @param {Object} listener - The event listener to remove from the event target.
		 */

		removeEventListener(type, listener) {

			const m = (typeof listener === "function") ? this.listenerFunctions : this.listenerObjects;

			let listeners;

			if(m.has(type)) {

				listeners = m.get(type);
				listeners.delete(listener);

				if(listeners.size === 0) {

					m.delete(type);

				}

			}

		}

		/**
		 * Dispatches an event at the specified event target, invoking the affected
		 * event listeners in the appropriate order.
		 *
		 * @param {Event} event - The event to dispatch.
		 * @param {EventTarget} [target] - An event target.
		 */

		dispatchEvent(event, target = this) {

			const listenerFunctions = target.listenerFunctions;
			const listenerObjects = target.listenerObjects;

			let listeners;
			let listener;

			event.target = target;

			if(listenerFunctions.has(event.type)) {

				listeners = listenerFunctions.get(event.type);

				for(listener of listeners) {

					listener.call(target, event);

				}

			}

			if(listenerObjects.has(event.type)) {

				listeners = listenerObjects.get(event.type);

				for(listener of listeners) {

					listener.handleEvent(event);

				}

			}

		}

	}

	/**
	 * A collection of event classes.
	 *
	 * @module synthetic-event
	 */

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

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

	function colorToString (color, forceCSSHex) {
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

	var INTERPRETATIONS = [
	{
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
	},
	{
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
	},
	{
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
	},
	{
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
	          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
	          0,
	          clientX,
	          clientY,
	          false, false, false, false, 0, null);
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
	    var offset = { left: 0, top: 0 };
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
	    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
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
	    dom.bind(_this2.__selector, 'mousedown', function ()        {
	      dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
	        dom.removeClass(_this.__selector, 'drag');
	      });
	    });
	    dom.bind(_this2.__selector, 'touchstart', function ()        {
	      dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
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
	    } catch (e) {
	    }
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
	      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
	    }
	    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
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
	    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
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
	  Object.defineProperties(this,
	  {
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
	        if (titleRowName) {
	          titleRowName.innerHTML = params.name;
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
	    params.closed = false;
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
	    var _titleRowName = document.createTextNode(params.name);
	    dom.addClass(_titleRowName, 'controller-name');
	    var titleRow = addRow(_this, _titleRowName);
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
	Common.extend(GUI.prototype,
	{
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
	    var newGuiParams = { name: name, parent: this };
	    newGuiParams.autoPlace = this.autoPlace;
	    if (this.load &&
	    this.load.folders &&
	    this.load.folders[name]) {
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
	    if (this.load &&
	    this.load.folders &&
	    this.load.folders[folder.name]) {
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
	  Common.extend(controller,                                   {
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
	    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
	    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step'], function (method) {
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
	    dom.addClass(li, _typeof(controller.getValue()));
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

	/**
	 * A demo manager event.
	 */

	class DemoManagerEvent extends Event {

		/**
		 * Constructs a new demo manager event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			super(type);

			/**
			 * The previous demo, if available.
			 *
			 * @type {Demo}
			 */

			this.previousDemo = null;

			/**
			 * The current demo.
			 *
			 * @type {Demo}
			 */

			this.demo = null;

		}

	}

	/**
	 * A demo manager change event.
	 *
	 * This event is dispatched by {@link DemoManager}.
	 *
	 * @type {DemoManagerEvent}
	 * @example demoManager.addEventListener("change", myListener);
	 */

	const change = new DemoManagerEvent("change");

	/**
	 * A demo manager load event.
	 *
	 * This event is dispatched by {@link DemoManager}.
	 *
	 * @type {DemoManagerEvent}
	 * @example demoManager.addEventListener("load", myListener);
	 */

	const load = new DemoManagerEvent("load");

	/**
	 * The initial URL hash value.
	 *
	 * @type {String}
	 * @private
	 */

	const initialHash = window.location.hash.slice(1);

	/**
	 * A demo manager.
	 */

	class DemoManager extends EventTarget {

		/**
		 * Constructs a new demo manager.
		 *
		 * @param {HTMLElement} viewport - The primary DOM container.
		 * @param {Object} [options] - Additional options.
		 * @param {HTMLElement} [options.aside] - A secondary DOM container.
		 * @param {WebGLRenderer} [options.renderer] - A custom renderer.
		 */

		constructor(viewport, options = {}) {

			const aside = (options.aside !== undefined) ? options.aside : viewport;

			super();

			/**
			 * The main renderer.
			 *
			 * @type {WebGLRenderer}
			 * @private
			 */

			this.renderer = (options.renderer !== undefined) ? options.renderer : (() => {

				const renderer = new three.WebGLRenderer();
				renderer.setSize(viewport.clientWidth, viewport.clientHeight);
				renderer.setPixelRatio(window.devicePixelRatio);

				return renderer;

			})();

			viewport.appendChild(this.renderer.domElement);

			/**
			 * A clock.
			 *
			 * @type {Clock}
			 * @private
			 */

			this.clock = new three.Clock();

			/**
			 * A menu for custom demo options.
			 *
			 * @type {GUI}
			 * @private
			 */

			this.menu = new GUI$1({ autoPlace: false });

			aside.appendChild(this.menu.domElement);

			/**
			 * A collection of demos.
			 *
			 * @type {Map}
			 * @private
			 */

			this.demos = new Map();

			/**
			 * The id of the current demo.
			 *
			 * @type {String}
			 * @private
			 */

			this.demo = null;

			/**
			 * The current demo.
			 *
			 * @type {Demo}
			 * @private
			 */

			this.currentDemo = null;

		}

		/**
		 * Updates the demo options menu.
		 *
		 * @private
		 * @todo Use a menu library that is not as clunky as dat.GUI.
		 * @return {GUI} The cleaned menu.
		 */

		resetMenu() {

			const node = this.menu.domElement.parentNode;
			const menu = new GUI$1({ autoPlace: false });

			// Don't create a demo selection if there's only one demo.
			if(this.demos.size > 1) {

				const selection = menu.add(this, "demo", Array.from(this.demos.keys()));
				selection.onChange(() => this.loadDemo());

			}

			node.removeChild(this.menu.domElement);
			node.appendChild(menu.domElement);

			this.menu.destroy();
			this.menu = menu;

			return menu;

		}

		/**
		 * Activates the given demo if it's still selected.
		 *
		 * While the demo was loading, another demo may have been selected already.
		 *
		 * @private
		 * @param {Demo} demo - A demo that just finished loading.
		 */

		startDemo(demo) {

			if(demo.id === this.demo) {

				demo.initialize();
				demo.registerOptions(this.resetMenu());
				demo.ready = true;

				load.demo = demo;
				this.dispatchEvent(load);

			}

		}

		/**
		 * Loads the currently selected demo.
		 *
		 * @private
		 */

		loadDemo() {

			const id = this.demo;
			const demos = this.demos;
			const demo = demos.get(id);
			const previousDemo = this.currentDemo;
			const renderer = this.renderer;

			// Update the URL.
			window.location.hash = id;

			if(previousDemo !== null) {

				previousDemo.reset();

			}

			// Hide the menu.
			this.menu.domElement.style.display = "none";

			// Clear the screen and remove all passes.
			renderer.clear();

			// Update and dispatch the event.
			change.previousDemo = previousDemo;
			change.demo = demo;
			this.currentDemo = demo;
			this.dispatchEvent(change);

			demo.load().then(() => this.startDemo(demo))
				.catch((e) => console.error(e));

		}

		/**
		 * Adds a demo.
		 *
		 * @param {Demo} demo - The demo.
		 * @return {DemoManager} This manager.
		 */

		addDemo(demo) {

			const currentDemo = this.currentDemo;

			this.demos.set(demo.id, demo.setRenderer(this.renderer));

			if(this.demo === null || demo.id === initialHash) {

				this.demo = demo.id;
				this.loadDemo();

			}

			// Update the demo selection.
			this.resetMenu();

			if(currentDemo !== null && currentDemo.ready) {

				// Add the demo options again.
				currentDemo.registerOptions(this.menu);

			}

			return this;

		}

		/**
		 * Removes a demo.
		 *
		 * @param {String} id - The id of the demo.
		 * @return {DemoManager} This manager.
		 */

		removeDemo(id) {

			const demos = this.demos;

			let firstEntry;

			if(demos.has(id)) {

				demos.delete(id);

				if(this.demo === id && demos.size > 0) {

					// Load the first of the remaining demos.
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

		/**
		 * Sets the render size.
		 *
		 * @param {Number} width - The width.
		 * @param {Number} height - The height.
		 * @todo Support OrthographicCamera.
		 */

		setSize(width, height) {

			const demo = this.currentDemo;

			this.renderer.setSize(width, height);

			if(demo !== null && demo.camera !== null) {

				demo.camera.aspect = width / height;
				demo.camera.updateProjectionMatrix();

			}

		}

		/**
		 * The main render loop.
		 *
		 * @param {DOMHighResTimeStamp} now - The current time.
		 */

		render(now) {

			const demo = this.currentDemo;
			const delta = this.clock.getDelta();

			if(demo !== null && demo.ready) {

				demo.render(delta);

			}

		}

	}

	/**
	 * Core components.
	 *
	 * @module three-demo
	 */

	/**
	 * An enumeration of control actions.
	 *
	 * This enum can be used to bind keys to specific control actions.
	 *
	 * @type {Object}
	 * @property {Number} MOVE_FORWARD - Move forward.
	 * @property {Number} MOVE_LEFT - Move left.
	 * @property {Number} MOVE_BACKWARD - Move backward.
	 * @property {Number} MOVE_RIGHT - Move right.
	 * @property {Number} MOVE_DOWN - Move down.
	 * @property {Number} MOVE_UP - Move up.
	 * @property {Number} ZOOM_OUT - Zoom out.
	 * @property {Number} ZOOM_IN - Zoom in.
	 */

	const Action = {

		MOVE_FORWARD: 0,
		MOVE_LEFT: 1,
		MOVE_BACKWARD: 2,
		MOVE_RIGHT: 3,
		MOVE_DOWN: 4,
		MOVE_UP: 5,
		ZOOM_OUT: 6,
		ZOOM_IN: 7

	};

	/**
	 * A vector with three components.
	 */

	class Vector3 {

		/**
		 * Constructs a new vector.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 * @param {Number} [z=0] - The Z component.
		 */

		constructor(x = 0, y = 0, z = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

			/**
			 * The Z component.
			 *
			 * @type {Number}
			 */

			this.z = z;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @param {Number} z - The Z component.
		 * @return {Vector3} This vector.
		 */

		set(x, y, z) {

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		}

		/**
		 * Clones this vector.
		 *
		 * @return {Vector3} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector3} This vector.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;

			return array;

		}

		/**
		 * Sets the values of this vector based on a spherical description.
		 *
		 * @param {Spherical} s - A spherical description.
		 * @return {Vector3} This vector.
		 */

		setFromSpherical(s) {

			const sinPhiRadius = Math.sin(s.phi) * s.radius;

			this.x = sinPhiRadius * Math.sin(s.theta);
			this.y = Math.cos(s.phi) * s.radius;
			this.z = sinPhiRadius * Math.cos(s.theta);

			return this;

		}

		/**
		 * Sets the values of this vector based on a cylindrical description.
		 *
		 * @param {Cylindrical} c - A cylindrical description.
		 * @return {Vector3} This vector.
		 */

		setFromCylindrical(c) {

			this.x = c.radius * Math.sin(c.theta);
			this.y = c.y;
			this.z = c.radius * Math.cos(c.theta);

			return this;

		}

		/**
		 * Copies the values of a matrix column.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @param {Number} index - A column index of the range [0, 2].
		 * @return {Vector3} This vector.
		 */

		setFromMatrixColumn(m, index) {

			return this.fromArray(m.elements, index * 4);

		}

		/**
		 * Extracts the position from a matrix.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @return {Vector3} This vector.
		 */

		setFromMatrixPosition(m) {

			const me = m.elements;

			this.x = me[12];
			this.y = me[13];
			this.z = me[14];

			return this;

		}

		/**
		 * Extracts the scale from a matrix.
		 *
		 * @param {Matrix4} m - A 4x4 matrix.
		 * @return {Vector3} This vector.
		 */

		setFromMatrixScale(m) {

			const sx = this.setFromMatrixColumn(m, 0).length();
			const sy = this.setFromMatrixColumn(m, 1).length();
			const sz = this.setFromMatrixColumn(m, 2).length();

			this.x = sx;
			this.y = sy;
			this.z = sz;

			return this;

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @param {Vector3} v - The vector to add.
		 * @return {Vector3} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @param {Number} s - The scalar to add.
		 * @return {Vector3} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @param {Vector3} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @param {Vector3} v - The vector to subtract.
		 * @return {Vector3} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		}

		/**
		 * Subtracts a scalar from this vector.
		 *
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector3} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - A second vector.
		 * @return {Vector3} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		multiplyScalar(s) {

			this.x *= s;
			this.y *= s;
			this.z *= s;

			return this;

		}

		/**
		 * Sets this vector to the product of two given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		multiplyVectors(a, b) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector3} This vector.
		 */

		divideScalar(s) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

			return this;

		}

		/**
		 * Sets this vector to the cross product of the given vectors.
		 *
		 * @param {Vector3} a - A vector.
		 * @param {Vector3} b - Another vector.
		 * @return {Vector3} This vector.
		 */

		crossVectors(a, b) {

			const ax = a.x, ay = a.y, az = a.z;
			const bx = b.x, by = b.y, bz = b.z;

			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;

			return this;

		}

		/**
		 * Calculates the cross product of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		cross(v) {

			return this.crossVectors(this, v);

		}

		/**
		 * Applies a matrix to this direction vector.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		transformDirection(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z;
			this.y = e[1] * x + e[5] * y + e[9] * z;
			this.z = e[2] * x + e[6] * y + e[10] * z;

			return this.normalize();

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix3(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[3] * y + e[6] * z;
			this.y = e[1] * x + e[4] * y + e[7] * z;
			this.z = e[2] * x + e[5] * y + e[8] * z;

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector3} This vector.
		 */

		applyMatrix4(m) {

			const x = this.x, y = this.y, z = this.z;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

			return this;

		}

		/**
		 * Applies a quaternion to this vector.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Vector3} This vector.
		 */

		applyQuaternion(q) {

			const x = this.x, y = this.y, z = this.z;
			const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

			// Calculate: quaternion * vector.
			const ix = qw * x + qy * z - qz * y;
			const iy = qw * y + qz * x - qx * z;
			const iz = qw * z + qx * y - qy * x;
			const iw = -qx * x - qy * y - qz * z;

			// Calculate: result * inverse quaternion.
			this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
			this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
			this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		}

		/**
		 * Reflects this vector. The given plane normal is assumed to be normalized.
		 *
		 * @param {Vector3} n - A normal.
		 * @return {Vector3} This vector.
		 */

		reflect(n) {

			const nx = n.x;
			const ny = n.y;
			const nz = n.z;

			this.sub(n.multiplyScalar(2 * this.dot(n)));

			// Restore the normal.
			n.set(nx, ny, nz);

			return this;

		}

		/**
		 * Computes the angle to the given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The angle in radians.
		 */

		angleTo(v) {

			const theta = this.dot(v) / (Math.sqrt(this.lengthSquared() * v.lengthSquared()));

			// Clamp to avoid numerical problems.
			return Math.acos(Math.min(Math.max(theta, -1), 1));

		}

		/**
		 * Calculates the Manhattan length of this vector.
		 *
		 * @return {Number} The length.
		 */

		manhattanLength() {

			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

		}

		/**
		 * Calculates the Manhattan distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The distance.
		 */

		manhattanDistanceTo(v) {

			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;
			const dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Normalizes this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Sets the length of this vector.
		 *
		 * @param {Number} length - The new length.
		 * @return {Vector3} This vector.
		 */

		setLength(length) {

			return this.normalize().multiplyScalar(length);

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);

			return this;

		}

		/**
		 * Adopts the max value for each component of this vector and the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Vector3} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @param {Vector3} min - The lower bounds. Assumed to be smaller than max.
		 * @param {Vector3} max - The upper bounds. Assumed to be greater than min.
		 * @return {Vector3} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));
			this.z = Math.max(min.z, Math.min(max.z, this.z));

			return this;

		}

		/**
		 * Floors this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.z = Math.floor(this.z);

			return this;

		}

		/**
		 * Ceils this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			this.z = Math.ceil(this.z);

			return this;

		}

		/**
		 * Rounds this vector.
		 *
		 * @return {Vector3} This vector.
		 */

		round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			this.z = Math.round(this.z);

			return this;

		}

		/**
		 * Lerps towards the given vector.
		 *
		 * @param {Vector3} v - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector3} This vector.
		 */

		lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;
			this.z += (v.z - this.z) * alpha;

			return this;

		}

		/**
		 * Sets this vector to the lerp result of the given vectors.
		 *
		 * @param {Vector3} v1 - A base vector.
		 * @param {Vector3} v2 - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector3} This vector.
		 */

		lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y && v.z === this.z);

		}

	}

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v = new Vector3();

	/**
	 * A 3D box.
	 */

	class Box3 {

		/**
		 * Constructs a new box.
		 *
		 * @param {Vector3} [min] - The lower bounds.
		 * @param {Vector3} [max] - The upper bounds.
		 */

		constructor(
			min = new Vector3(Infinity, Infinity, Infinity),
			max = new Vector3(-Infinity, -Infinity, -Infinity)
		) {

			/**
			 * The lower bounds.
			 *
			 * @type {Vector3}
			 */

			this.min = min;

			/**
			 * The upper bounds.
			 *
			 * @type {Vector3}
			 */

			this.max = max;

		}

		/**
		 * Sets the values of this box.
		 *
		 * @param {Vector3} min - The lower bounds.
		 * @param {Vector3} max - The upper bounds.
		 * @return {Box3} This box.
		 */

		set(min, max) {

			this.min.copy(min);
			this.max.copy(max);

			return this;

		}

		/**
		 * Copies the values of a given box.
		 *
		 * @param {Box3} b - A box.
		 * @return {Box3} This box.
		 */

		copy(b) {

			this.min.copy(b.min);
			this.max.copy(b.max);

			return this;

		}

		/**
		 * Clones this box.
		 *
		 * @return {Box3} A clone of this box.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Makes this box empty.
		 *
		 * The lower bounds are set to infinity and the upper bounds to negative
		 * infinity to create an infinitely small box.
		 *
		 * @return {Box3} This box.
		 */

		makeEmpty() {

			this.min.x = this.min.y = this.min.z = Infinity;
			this.max.x = this.max.y = this.max.z = -Infinity;

			return this;

		}

		/**
		 * Indicates whether this box is truly empty.
		 *
		 * This is a more robust check for emptiness since the volume can get positive
		 * with two negative axes.
		 *
		 * @return {Box3} This box.
		 */

		isEmpty() {

			return (
				this.max.x < this.min.x ||
				this.max.y < this.min.y ||
				this.max.z < this.min.z
			);

		}

		/**
		 * Computes the center of this box.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the center of this box.
		 */

		getCenter(target = new Vector3()) {

			return !this.isEmpty() ?
				target.addVectors(this.min, this.max).multiplyScalar(0.5) :
				target.set(0, 0, 0);

		}

		/**
		 * Computes the size of this box.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the size of this box.
		 */

		getSize(target = new Vector3()) {

			return !this.isEmpty() ?
				target.subVectors(this.max, this.min) :
				target.set(0, 0, 0);

		}

		/**
		 * Computes the bounding box of the given sphere.
		 *
		 * @param {Sphere} sphere - A sphere.
		 * @return {Box3} This box.
		 */

		setFromSphere(sphere) {

			this.set(sphere.center, sphere.center);
			this.expandByScalar(sphere.radius);

			return this;

		}

		/**
		 * Expands this box by the given point.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Box3} This box.
		 */

		expandByPoint(p) {

			this.min.min(p);
			this.max.max(p);

			return this;

		}

		/**
		 * Expands this box by the given vector.
		 *
		 * @param {Vector3} v - A vector.
		 * @return {Box3} This box.
		 */

		expandByVector(v) {

			this.min.sub(v);
			this.max.add(v);

			return this;

		}

		/**
		 * Expands this box by the given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Box3} This box.
		 */

		expandByScalar(s) {

			this.min.addScalar(-s);
			this.max.addScalar(s);

			return this;

		}

		/**
		 * Defines this box by the given points.
		 *
		 * @param {Vector3[]} points - The points.
		 * @return {Box3} This box.
		 */

		setFromPoints(points) {

			let i, l;

			this.min.set(0, 0, 0);
			this.max.set(0, 0, 0);

			for(i = 0, l = points.length; i < l; ++i) {

				this.expandByPoint(points[i]);

			}

			return this;

		}

		/**
		 * Defines this box by the given center and size.
		 *
		 * @param {Vector3} center - The center.
		 * @param {Number} size - The size.
		 * @return {Box3} This box.
		 */

		setFromCenterAndSize(center, size) {

			const halfSize = v.copy(size).multiplyScalar(0.5);

			this.min.copy(center).sub(halfSize);
			this.max.copy(center).add(halfSize);

			return this;

		}

		/**
		 * Clamps the given point to the boundaries of this box.
		 *
		 * @param {Vector3} point - A point.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The clamped point.
		 */

		clampPoint(point, target = new Vector3()) {

			return target.copy(point).clamp(this.min, this.max);

		}

		/**
		 * Calculates the distance from this box to the given point.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Number} The distance.
		 */

		distanceToPoint(p) {

			const clampedPoint = v.copy(p).clamp(this.min, this.max);

			return clampedPoint.sub(p).length();

		}

		/**
		 * Applies the given matrix to this box.
		 *
		 * @param {Matrix4} matrix - The matrix.
		 * @return {Box3} This box.
		 */

		applyMatrix4(matrix) {

			const min = this.min;
			const max = this.max;

			if(!this.isEmpty()) {

				const me = matrix.elements;

				const xax = me[0] * min.x;
				const xay = me[1] * min.x;
				const xaz = me[2] * min.x;

				const xbx = me[0] * max.x;
				const xby = me[1] * max.x;
				const xbz = me[2] * max.x;

				const yax = me[4] * min.y;
				const yay = me[5] * min.y;
				const yaz = me[6] * min.y;

				const ybx = me[4] * max.y;
				const yby = me[5] * max.y;
				const ybz = me[6] * max.y;

				const zax = me[8] * min.z;
				const zay = me[9] * min.z;
				const zaz = me[10] * min.z;

				const zbx = me[8] * max.z;
				const zby = me[9] * max.z;
				const zbz = me[10] * max.z;

				min.x = Math.min(xax, xbx) + Math.min(yax, ybx) + Math.min(zax, zbx) + me[12];
				min.y = Math.min(xay, xby) + Math.min(yay, yby) + Math.min(zay, zby) + me[13];
				min.z = Math.min(xaz, xbz) + Math.min(yaz, ybz) + Math.min(zaz, zbz) + me[14];
				max.x = Math.max(xax, xbx) + Math.max(yax, ybx) + Math.max(zax, zbx) + me[12];
				max.y = Math.max(xay, xby) + Math.max(yay, yby) + Math.max(zay, zby) + me[13];
				max.z = Math.max(xaz, xbz) + Math.max(yaz, ybz) + Math.max(zaz, zbz) + me[14];

			}

			return this;

		}

		/**
		 * Translates this box.
		 *
		 * @param {Vector3} offset - The offset.
		 * @return {Box3} This box.
		 */

		translate(offset) {

			this.min.add(offset);
			this.max.add(offset);

			return this;

		}

		/**
		 * Intersects this box with the given one.
		 *
		 * @param {Box3} b - A box.
		 * @return {Box3} This box.
		 */

		intersect(b) {

			this.min.max(b.min);
			this.max.min(b.max);

			/* Ensure that if there is no overlap, the result is fully empty to prevent
			subsequent intersections to erroneously return valid values. */
			if(this.isEmpty()) {

				this.makeEmpty();

			}

			return this;

		}

		/**
		 * Expands this box by combining it with the given one.
		 *
		 * @param {Box3} b - A box.
		 * @return {Box3} This box.
		 */

		union(b) {

			this.min.min(b.min);
			this.max.max(b.max);

			return this;

		}

		/**
		 * Checks if the given point lies inside this box.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Boolean} Whether this box contains the point.
		 */

		containsPoint(p) {

			const min = this.min;
			const max = this.max;

			return (
				p.x >= min.x &&
				p.y >= min.y &&
				p.z >= min.z &&
				p.x <= max.x &&
				p.y <= max.y &&
				p.z <= max.z
			);

		}

		/**
		 * Checks if the given box lies inside this box.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether this box contains the given one.
		 */

		containsBox(b) {

			const tMin = this.min;
			const tMax = this.max;
			const bMin = b.min;
			const bMax = b.max;

			return (
				tMin.x <= bMin.x && bMax.x <= tMax.x &&
				tMin.y <= bMin.y && bMax.y <= tMax.y &&
				tMin.z <= bMin.z && bMax.z <= tMax.z
			);

		}

		/**
		 * Checks if this box intersects the given one.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether the boxes intersect.
		 */

		intersectsBox(b) {

			const tMin = this.min;
			const tMax = this.max;
			const bMin = b.min;
			const bMax = b.max;

			return (
				bMax.x >= tMin.x &&
				bMax.y >= tMin.y &&
				bMax.z >= tMin.z &&
				bMin.x <= tMax.x &&
				bMin.y <= tMax.y &&
				bMin.z <= tMax.z
			);

		}

		/**
		 * Checks if this box intersects the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Boolean} Whether the box intersects the sphere.
		 */

		intersectsSphere(s) {

			// Find the point in this box that is closest to the sphere's center.
			const closestPoint = this.clampPoint(s.center, v);

			// If that point is inside the sphere, it intersects this box.
			return (closestPoint.distanceToSquared(s.center) <= (s.radius * s.radius));

		}

		/**
		 * Checks if this box intersects the given plane.
		 *
		 * Computes the minimum and maximum dot product values. If those values are on
		 * the same side (back or front) of the plane, then there is no intersection.
		 *
		 * @param {Plane} p - A plane.
		 * @return {Boolean} Whether the box intersects the plane.
		 */

		intersectsPlane(p) {

			let min, max;

			if(p.normal.x > 0) {

				min = p.normal.x * this.min.x;
				max = p.normal.x * this.max.x;

			} else {

				min = p.normal.x * this.max.x;
				max = p.normal.x * this.min.x;

			}

			if(p.normal.y > 0) {

				min += p.normal.y * this.min.y;
				max += p.normal.y * this.max.y;

			} else {

				min += p.normal.y * this.max.y;
				max += p.normal.y * this.min.y;

			}

			if(p.normal.z > 0) {

				min += p.normal.z * this.min.z;
				max += p.normal.z * this.max.z;

			} else {

				min += p.normal.z * this.max.z;
				max += p.normal.z * this.min.z;

			}

			return (min <= p.constant && max >= p.constant);

		}

		/**
		 * Checks if this box equals the given one.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether this box equals the given one.
		 */

		equals(b) {

			return (b.min.equals(this.min) && b.max.equals(this.max));

		}

	}

	/**
	 * A vector with two components.
	 */

	class Vector2 {

		/**
		 * Constructs a new vector.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 */

		constructor(x = 0, y = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

		}

		/**
		 * The width. This is an alias for X.
		 *
		 * @type {Number}
		 */

		get width() {

			return this.x;

		}

		/**
		 * Sets the width.
		 *
		 * @type {Number}
		 */

		set width(value) {

			return this.x = value;

		}

		/**
		 * The height. This is an alias for Y.
		 *
		 * @type {Number}
		 */

		get height() {

			return this.y;

		}

		/**
		 * Sets the height.
		 *
		 * @type {Number}
		 */

		set height(value) {

			return this.y = value;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @return {Vector2} This vector.
		 */

		set(x, y) {

			this.x = x;
			this.y = y;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;

			return this;

		}

		/**
		 * Clones this vector.
		 *
		 * @return {Vector2} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector2} This vector.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;

			return array;

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @param {Vector2} v - The vector to add.
		 * @return {Vector2} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @param {Number} s - The scalar to add.
		 * @return {Vector2} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @param {Vector2} a - A vector.
		 * @param {Vector2} b - Another vector.
		 * @return {Vector2} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @param {Vector2} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @param {Vector2} v - The vector to subtract.
		 * @return {Vector2} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;

			return this;

		}

		/**
		 * Subtracts a scalar from this vector.
		 *
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector2} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @param {Vector2} a - A vector.
		 * @param {Vector2} b - A second vector.
		 * @return {Vector2} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		multiplyScalar(s) {

			this.x *= s;
			this.y *= s;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector2} This vector.
		 */

		divideScalar(s) {

			this.x /= s;
			this.y /= s;

			return this;

		}

		/**
		 * Applies the given matrix to this vector.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Vector2} This vector.
		 */

		applyMatrix3(m) {

			const x = this.x, y = this.y;
			const e = m.elements;

			this.x = e[0] * x + e[3] * y + e[6];
			this.y = e[1] * x + e[4] * y + e[7];

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y;

		}

		/**
		 * Calculates the cross product with another vector.
		 *
		 * This method calculates a scalar that would result from a regular 3D cross
		 * product of the input vectors, while taking their Z values implicitly as 0.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The cross product.
		 */

		cross(v) {

			return this.x * v.y - this.y * v.x;

		}

		/**
		 * Calculates the Manhattan length of this vector.
		 *
		 * @return {Number} The length.
		 */

		manhattanLength() {

			return Math.abs(this.x) + Math.abs(this.y);

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return this.x * this.x + this.y * this.y;

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y);

		}

		/**
		 * Calculates the Manhattan distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The squared distance.
		 */

		manhattanDistanceTo(v) {

			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;

			return dx * dx + dy * dy;

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Normalizes this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Sets the length of this vector.
		 *
		 * @param {Number} length - The new length.
		 * @return {Vector2} This vector.
		 */

		setLength(length) {

			return this.normalize().multiplyScalar(length);

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);

			return this;

		}

		/**
		 * adopts the max value for each component of this vector and the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Vector2} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @param {Vector2} min - A vector, assumed to be smaller than max.
		 * @param {Vector2} max - A vector, assumed to be greater than min.
		 * @return {Vector2} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));

			return this;

		}

		/**
		 * Floors this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

			return this;

		}

		/**
		 * Ceils this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);

			return this;

		}

		/**
		 * Rounds this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @return {Vector2} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;

			return this;

		}

		/**
		 * Computes the angle in radians with respect to the positive X-axis.
		 *
		 * @return {Number} The angle.
		 */

		angle() {

			let angle = Math.atan2(this.y, this.x);

			if(angle < 0) {

				angle += 2 * Math.PI;

			}

			return angle;

		}

		/**
		 * Lerps towards the given vector.
		 *
		 * @param {Vector2} v - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector2} This vector.
		 */

		lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;

			return this;

		}

		/**
		 * Sets this vector to the lerp result of the given vectors.
		 *
		 * @param {Vector2} v1 - A base vector.
		 * @param {Vector2} v2 - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector2} This vector.
		 */

		lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		}

		/**
		 * Rotates this vector around a given center.
		 *
		 * @param {Vector2} center - The center.
		 * @param {Number} angle - The rotation in radians.
		 * @return {Vector2} This vector.
		 */

		rotateAround(center, angle) {

			const c = Math.cos(angle), s = Math.sin(angle);

			const x = this.x - center.x;
			const y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @param {Vector2} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y);

		}

	}

	/**
	 * A cylindrical coordinate system.
	 *
	 * For details see: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
	 */

	/**
	 * A 3x3 matrix.
	 */

	class Matrix3 {

		/**
		 * Constructs a new matrix.
		 */

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @type {Float32Array}
			 */

			this.elements = new Float32Array([

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
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

		set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

			const te = this.elements;

			te[0] = m00; te[3] = m01; te[6] = m02;
			te[1] = m10; te[4] = m11; te[7] = m12;
			te[2] = m20; te[5] = m21; te[8] = m22;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @return {Matrix3} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		}

		/**
		 * Copies the values of a given matrix.
		 *
		 * @param {Matrix3} matrix - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		copy(matrix) {

			const me = matrix.elements;
			const te = this.elements;

			te[0] = me[0]; te[1] = me[1]; te[2] = me[2];
			te[3] = me[3]; te[4] = me[4]; te[5] = me[5];
			te[6] = me[6]; te[7] = me[7]; te[8] = me[8];

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @return {Matrix3} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().fromArray(this.elements);

		}

		/**
		 * Copies the values of a given array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Matrix3} This matrix.
		 */

		fromArray(array, offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 9; ++i) {

				te[i] = array[i + offset];

			}

			return this;

		}

		/**
		 * Stores this matrix in an array.
		 *
		 * @param {Number[]} [array] - A target array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 9; ++i) {

				array[i + offset] = te[i];

			}

			return array;

		}

		/**
		 * Sets this matrix to the product of the given matrices.
		 *
		 * @param {Matrix3} a - A matrix.
		 * @param {Matrix3} b - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		multiplyMatrices(a, b) {

			const ae = a.elements;
			const be = b.elements;
			const te = this.elements;

			const a11 = ae[0], a12 = ae[3], a13 = ae[6];
			const a21 = ae[1], a22 = ae[4], a23 = ae[7];
			const a31 = ae[2], a32 = ae[5], a33 = ae[8];

			const b11 = be[0], b12 = be[3], b13 = be[6];
			const b21 = be[1], b22 = be[4], b23 = be[7];
			const b31 = be[2], b32 = be[5], b33 = be[8];

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

		/**
		 * Multiplies this matrix with a given one.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		multiply(m) {

			return this.multiplyMatrices(this, m);

		}

		/**
		 * Multiplies a given matrix with this one.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Matrix3} This matrix.
		 */

		premultiply(m) {

			return this.multiplyMatrices(m, this);

		}

		/**
		 * Multiplies this matrix with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Matrix3} This matrix.
		 */

		multiplyScalar(s) {

			const te = this.elements;

			te[0] *= s; te[3] *= s; te[6] *= s;
			te[1] *= s; te[4] *= s; te[7] *= s;
			te[2] *= s; te[5] *= s; te[8] *= s;

			return this;

		}

		/**
		 * Calculates the determinant of this matrix.
		 *
		 * @return {Number} The determinant.
		 */

		determinant() {

			const te = this.elements;

			const a = te[0], b = te[1], c = te[2];
			const d = te[3], e = te[4], f = te[5];
			const g = te[6], h = te[7], i = te[8];

			return (

				a * e * i -
				a * f * h -
				b * d * i +
				b * f * g +
				c * d * h -
				c * e * g

			);

		}

		/**
		 * Inverts the given matrix and stores the result in this matrix.
		 *
		 * @param {Matrix3} matrix - The matrix that should be inverted.
		 * @return {Matrix3} This matrix.
		 */

		getInverse(matrix) {

			const me = matrix.elements;
			const te = this.elements;

			const n11 = me[0], n21 = me[1], n31 = me[2];
			const n12 = me[3], n22 = me[4], n32 = me[5];
			const n13 = me[6], n23 = me[7], n33 = me[8];

			const t11 = n33 * n22 - n32 * n23;
			const t12 = n32 * n13 - n33 * n12;
			const t13 = n23 * n12 - n22 * n13;

			const det = n11 * t11 + n21 * t12 + n31 * t13;

			let invDet;

			if(det !== 0) {

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

		/**
		 * Transposes this matrix.
		 *
		 * @return {Matrix3} This matrix.
		 */

		transpose() {

			const me = this.elements;

			let t;

			t = me[1]; me[1] = me[3]; me[3] = t;
			t = me[2]; me[2] = me[6]; me[6] = t;
			t = me[5]; me[5] = me[7]; me[7] = t;

			return this;

		}

		/**
		 * Scales this matrix.
		 *
		 * @param {Number} sx - The X scale.
		 * @param {Number} sy - The Y scale.
		 * @return {Matrix3} This matrix.
		 */

		scale(sx, sy) {

			const te = this.elements;

			te[0] *= sx; te[3] *= sx; te[6] *= sx;
			te[1] *= sy; te[4] *= sy; te[7] *= sy;

			return this;

		}

		/**
		 * Rotates this matrix.
		 *
		 * @param {Number} theta - The rotation.
		 * @return {Matrix3} This matrix.
		 */

		rotate(theta) {

			const c = Math.cos(theta);
			const s = Math.sin(theta);

			const te = this.elements;

			const a11 = te[0], a12 = te[3], a13 = te[6];
			const a21 = te[1], a22 = te[4], a23 = te[7];

			te[0] = c * a11 + s * a21;
			te[3] = c * a12 + s * a22;
			te[6] = c * a13 + s * a23;

			te[1] = -s * a11 + c * a21;
			te[4] = -s * a12 + c * a22;
			te[7] = -s * a13 + c * a23;

			return this;

		}

		/**
		 * Translates this matrix.
		 *
		 * @param {Number} tx - The X offset.
		 * @param {Number} ty - The Y offset.
		 * @return {Matrix3} This matrix.
		 */

		translate(tx, ty) {

			const te = this.elements;

			te[0] += tx * te[2]; te[3] += tx * te[5]; te[6] += tx * te[8];
			te[1] += ty * te[2]; te[4] += ty * te[5]; te[7] += ty * te[8];

			return this;

		}

		/**
		 * Checks if this matrix equals the given one.
		 *
		 * @param {Matrix3} m - A matrix.
		 * @return {Boolean} Whether the matrix are equal.
		 */

		equals(m) {

			const te = this.elements;
			const me = m.elements;

			let result = true;
			let i;

			for(i = 0; result && i < 9; ++i) {

				if(te[i] !== me[i]) {

					result = false;

				}

			}

			return result;

		}

	}

	/**
	 * An enumeration of Euler rotation orders.
	 *
	 * @type {Object}
	 * @property {String} XYZ - X -> Y -> Z.
	 * @property {String} YZX - Y -> Z -> X.
	 * @property {String} ZXY - Z -> X -> Y.
	 * @property {String} XZY - X -> Z -> Y.
	 * @property {String} YXZ - Y -> X -> Z.
	 * @property {String} ZYX - Z -> Y -> X.
	 */

	const RotationOrder = {

		XYZ: "XYZ",
		YZX: "YZX",
		ZXY: "ZXY",
		XZY: "XZY",
		YXZ: "YXZ",
		ZYX: "ZYX"

	};

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$3 = new Vector3();

	/**
	 * A quaternion.
	 */

	class Quaternion {

		/**
		 * Constructs a new quaternion.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 * @param {Number} [z=0] - The Z component.
		 * @param {Number} [w=0] - The W component.
		 */

		constructor(x = 0, y = 0, z = 0, w = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

			/**
			 * The Z component.
			 *
			 * @type {Number}
			 */

			this.z = z;

			/**
			 * The W component.
			 *
			 * @type {Number}
			 */

			this.w = w;

		}

		/**
		 * Sets the components of this quaternion.
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @param {Number} z - The Z component.
		 * @param {Number} w - The W component.
		 * @return {Quaternion} This quaternion.
		 */

		set(x, y, z, w) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

			return this;

		}

		/**
		 * Copies the components of the given quaternion.
		 *
		 * @param {Quaternion} q - The quaternion.
		 * @return {Quaternion} This quaternion.
		 */

		copy(q) {

			this.x = q.x;
			this.y = q.y;
			this.z = q.z;
			this.w = q.w;

			return this;

		}

		/**
		 * Clones this quaternion.
		 *
		 * @return {Quaternion} The cloned quaternion.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z, this.w);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Quaternion} This quaternion.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];
			this.w = array[offset + 3];

			return this;

		}

		/**
		 * Stores this quaternion in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;
			array[offset + 3] = this.w;

			return array;

		}

		/**
		 * Sets the components of this quaternion based on the given Euler angles.
		 *
		 * For more details see: https://goo.gl/XRD1kr
		 *
		 * @param {Euler} euler - The euler angles.
		 * @return {Quaternion} This quaternion.
		 */

		setFromEuler(euler) {

			const x = euler.x;
			const y = euler.y;
			const z = euler.z;

			const cos = Math.cos;
			const sin = Math.sin;

			const c1 = cos(x / 2);
			const c2 = cos(y / 2);
			const c3 = cos(z / 2);

			const s1 = sin(x / 2);
			const s2 = sin(y / 2);
			const s3 = sin(z / 2);

			switch(euler.order) {

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

		/**
		 * Sets the components of this quaternion based on a given axis angle.
		 *
		 * For more information see:
		 *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
		 *
		 * @param {Vector3} axis - The axis. Assumed to be normalized.
		 * @param {Number} angle - The angle in radians.
		 * @return {Quaternion} This quaternion.
		 */

		setFromAxisAngle(axis, angle) {

			const halfAngle = angle / 2.0;
			const s = Math.sin(halfAngle);

			this.x = axis.x * s;
			this.y = axis.y * s;
			this.z = axis.z * s;
			this.w = Math.cos(halfAngle);

			return this;

		}

		/**
		 * Sets the components of this quaternion based on a given rotation matrix.
		 *
		 * For more information see:
		 *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
		 *
		 * @param {Matrix4} m - The rotation matrix. The upper 3x3 is assumed to be a pure rotation matrix (i.e. unscaled).
		 * @return {Quaternion} This quaternion.
		 */

		setFromRotationMatrix(m) {

			const te = m.elements;

			const m00 = te[0], m01 = te[4], m02 = te[8];
			const m10 = te[1], m11 = te[5], m12 = te[9];
			const m20 = te[2], m21 = te[6], m22 = te[10];

			const trace = m00 + m11 + m22;

			let s;

			if(trace > 0) {

				s = 0.5 / Math.sqrt(trace + 1.0);

				this.w = 0.25 / s;
				this.x = (m21 - m12) * s;
				this.y = (m02 - m20) * s;
				this.z = (m10 - m01) * s;

			} else if(m00 > m11 && m00 > m22) {

				s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

				this.w = (m21 - m12) / s;
				this.x = 0.25 * s;
				this.y = (m01 + m10) / s;
				this.z = (m02 + m20) / s;

			} else if(m11 > m22) {

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

		/**
		 * Sets the components of this quaternion based on unit vectors.
		 *
		 * @param {Vector3} vFrom - A unit vector. Assumed to be normalized.
		 * @param {Vector3} vTo - A unit vector. Assumed to be normalized.
		 * @return {Quaternion} This quaternion.
		 */

		setFromUnitVectors(vFrom, vTo) {

			let r = vFrom.dot(vTo) + 1;

			if(r < 1e-6) {

				r = 0;

				if(Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

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

		/**
		 * Calculates the angle to another quaternion.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Number} The angle in radians.
		 */

		angleTo(q) {

			return 2.0 * Math.acos(Math.abs(Math.min(Math.max(this.dot(q), -1.0), 1.0)));

		}

		/**
		 * Rotates this quaternion towards the given one by a given step size.
		 *
		 * @param {Quaternion} q - The target quaternion.
		 * @param {Number} step - The step size.
		 * @return {Quaternion} This quaternion.
		 */

		rotateTowards(q, step) {

			const angle = this.angleTo(q);

			if(angle !== 0.0) {

				this.slerp(q, Math.min(1.0, step / angle));

			}

			return this;

		}

		/**
		 * Inverts this quaternion. The quaternion is assumed to have unit length.
		 *
		 * @return {Quaternion} This quaternion.
		 */

		invert() {

			return this.conjugate();

		}

		/**
		 * Conjugates this quaternion.
		 *
		 * @return {Quaternion} This quaternion.
		 */

		conjugate() {

			this.x *= -1;
			this.y *= -1;
			this.z *= -1;

			return this;

		}

		/**
		 * Calculates the squared length of this quaternion.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

		}

		/**
		 * Calculates the length of this quaternion.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

		}

		/**
		 * Normalizes this quaternion.
		 *
		 * @return {Quaternion} This quaternion.
		 */

		normalize() {

			const l = this.length();

			let invLength;

			if(l === 0) {

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

		/**
		 * Calculates the dot product with a given vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

		}

		/**
		 * Multiplies the given quaternions and stores the result in this quaternion.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
		 *
		 * @param {Quaternion} a - A quaternion.
		 * @param {Quaternion} b - Another quaternion.
		 * @return {Quaternion} This quaternion.
		 */

		multiplyQuaternions(a, b) {

			const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
			const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

			this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

			return this;

		}

		/**
		 * Multiplies this quaternion with the given one and stores the result in
		 * this quaternion.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Quaternion} This quaternion.
		 */

		multiply(q) {

			return this.multiplyQuaternions(this, q);

		}

		/**
		 * Multiplies the given quaternion with this one and stores the result in
		 * this quaternion.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Quaternion} This quaternion.
		 */

		premultiply(q) {

			return this.multiplyQuaternions(q, this);

		}

		/**
		 * Performs a spherical linear interpolation towards the given quaternion.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @param {Number} t - The slerp factor.
		 * @return {Quaternion} This quaternion.
		 */

		slerp(q, t) {

			const x = this.x, y = this.y, z = this.z, w = this.w;

			let cosHalfTheta, sinHalfThetaSquared, sinHalfTheta, halfTheta;
			let s, ratioA, ratioB;

			if(t === 1) {

				this.copy(q);

			} else if(t > 0) {

				cosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;

				if(cosHalfTheta < 0.0) {

					this.w = -q.w;
					this.x = -q.x;
					this.y = -q.y;
					this.z = -q.z;

					cosHalfTheta = -cosHalfTheta;

				} else {

					this.copy(q);

				}

				if(cosHalfTheta >= 1.0) {

					this.w = w;
					this.x = x;
					this.y = y;
					this.z = z;

				} else {

					sinHalfThetaSquared = 1.0 - cosHalfTheta * cosHalfTheta;
					s = 1.0 - t;

					if(sinHalfThetaSquared <= Number.EPSILON) {

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

						this.w = (w * ratioA + this.w * ratioB);
						this.x = (x * ratioA + this.x * ratioB);
						this.y = (y * ratioA + this.y * ratioB);
						this.z = (z * ratioA + this.z * ratioB);

					}

				}

			}

			return this;

		}

		/**
		 * Checks if this quaternions equals the given one.
		 *
		 * @param {Quaternion} q - A quaternion.
		 * @return {Boolean} Whether the quaternions are equal.
		 */

		equals(q) {

			return (q.x === this.x) && (q.y === this.y) && (q.z === this.z) && (q.w === this.w);

		}

		/**
		 * Performs a spherical linear interpolation.
		 *
		 * @param {Quaternion} qa - The base quaternion.
		 * @param {Quaternion} qb - The target quaternion.
		 * @param {Quaternion} qr - A quaternion to store the result in.
		 * @param {Number} t - The slerp factor.
		 * @return {Quaternion} The resulting quaternion.
		 */

		static slerp(qa, qb, qr, t) {

			return qr.copy(qa).slerp(qb, t);

		}

		/**
		 * Performs an array-based spherical linear interpolation.
		 *
		 * @param {Number[]} dst - An array to store the result in.
		 * @param {Number} dstOffset - An offset into the destination array.
		 * @param {Number[]} src0 - An array that contains the base quaternion values.
		 * @param {Number} srcOffset0 - An offset into the base array.
		 * @param {Number[]} src1 - An array that contains the target quaternion values.
		 * @param {Number} srcOffset1 - An offset into the target array.
		 * @param {Number} t - The slerp factor.
		 */

		static slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {

			const x1 = src1[srcOffset1];
			const y1 = src1[srcOffset1 + 1];
			const z1 = src1[srcOffset1 + 2];
			const w1 = src1[srcOffset1 + 3];

			let x0 = src0[srcOffset0];
			let y0 = src0[srcOffset0 + 1];
			let z0 = src0[srcOffset0 + 2];
			let w0 = src0[srcOffset0 + 3];

			let s, f;
			let sin, cos, sqrSin;
			let dir, len, tDir;

			if(w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {

				s = 1.0 - t;
				cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1;

				dir = (cos >= 0) ? 1 : -1;
				sqrSin = 1.0 - cos * cos;

				// Skip the Slerp for tiny steps to avoid numeric problems.
				if(sqrSin > Number.EPSILON) {

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

				// Normalize in case a lerp has just been performed.
				if(s === 1.0 - t) {

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

	}

	/**
	 * Clamps the given value.
	 *
	 * @private
	 * @param {Number} value - The value.
	 * @param {Number} min - The lower limit.
	 * @param {Number} max - The upper limit.
	 * @return {Number} The clamped value.
	 */

	function clamp(value, min, max) {

		return Math.max(Math.min(value, max), min);

	}

	/**
	 * A matrix.
	 *
	 * @type {Matrix3}
	 * @private
	 */

	const m = new Matrix3();

	/**
	 * A quaternion.
	 *
	 * @type {Quaternion}
	 * @private
	 */

	const q = new Quaternion();

	/**
	 * Euler angles.
	 */

	class Euler {

		/**
		 * Constructs a new set of Euler angles.
		 *
		 * @param {Number} [x=0] - The rotation around the X-axis.
		 * @param {Number} [y=0] - The rotation around the Y-axis.
		 * @param {Number} [z=0] - The rotation around the Z-axis.
		 */

		constructor(x = 0, y = 0, z = 0) {

			/**
			 * The rotation around the X-axis.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The rotation around the Y-axis.
			 *
			 * @type {Number}
			 */

			this.y = y;

			/**
			 * The rotation around the Z-axis.
			 *
			 * @type {Number}
			 */

			this.z = z;

			/**
			 * The rotation order.
			 *
			 * @type {RotationOrder}
			 * @default Euler.defaultOrder
			 */

			this.order = Euler.defaultOrder;

		}

		/**
		 * Sets the Euler angles and rotation order.
		 *
		 * @param {Number} x - The rotation around the X-axis.
		 * @param {Number} y - The rotation around the Y-axis.
		 * @param {Number} z - The rotation around the Z-axis.
		 * @param {Number} order - The rotation order.
		 * @return {Euler} This set of Euler angles.
		 */

		set(x, y, z, order) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.order = order;

			return this;

		}

		/**
		 * Copies the values of another set of Euler angles.
		 *
		 * @param {Euler} e - A set of Euler angles.
		 * @return {Euler} This set of Euler angles.
		 */

		copy(e) {

			this.x = e.x;
			this.y = e.y;
			this.z = e.z;
			this.order = e.order;

			return this;

		}

		/**
		 * Clones this set of Euler angles.
		 *
		 * @return {Euler} A clone of this set of Euler angles.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z, this.order);

		}

		/**
		 * Copies angles and the rotation order from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Euler} This set of Euler angles.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];
			this.order = array[offset + 3];

			return this;

		}

		/**
		 * Stores this set of Euler angles and the rotation order in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;
			array[offset + 3] = this.order;

			return array;

		}

		/**
		 * Stores this set of Euler angles in a vector.
		 *
		 * @param {Vector3} [vector] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The vector.
		 */

		toVector3(vector = new Vector3()) {

			return vector.set(this.x, this.y, this.z);

		}

		/**
		 * Copies the rotation from a given matrix.
		 *
		 * @param {Matrix4} m - A rotation matrix. The upper 3x3 is assumed to be a pure rotation matrix (i.e. unscaled).
		 * @param {RotationOrder} [order] - An override rotation order.
		 * @return {Euler} This set of Euler angles.
		 */

		setFromRotationMatrix(m, order = this.order) {

			const te = m.elements;
			const m00 = te[0], m01 = te[4], m02 = te[8];
			const m10 = te[1], m11 = te[5], m12 = te[9];
			const m20 = te[2], m21 = te[6], m22 = te[10];

			const THRESHOLD = 1.0 - 1e-5;

			switch(order) {

				case RotationOrder.XYZ: {

					this.y = Math.asin(clamp(m02, -1, 1));

					if(Math.abs(m02) < THRESHOLD) {

						this.x = Math.atan2(-m12, m22);
						this.z = Math.atan2(-m01, m00);

					} else {

						this.x = Math.atan2(m21, m11);
						this.z = 0;

					}

					break;

				}

				case RotationOrder.YXZ: {

					this.x = Math.asin(-clamp(m12, -1, 1));

					if(Math.abs(m12) < THRESHOLD) {

						this.y = Math.atan2(m02, m22);
						this.z = Math.atan2(m10, m11);

					} else {

						this.y = Math.atan2(-m20, m00);
						this.z = 0;

					}

					break;

				}

				case RotationOrder.ZXY: {

					this.x = Math.asin(clamp(m21, -1, 1));

					if(Math.abs(m21) < THRESHOLD) {

						this.y = Math.atan2(-m20, m22);
						this.z = Math.atan2(-m01, m11);

					} else {

						this.y = 0;
						this.z = Math.atan2(m10, m00);

					}

					break;

				}

				case RotationOrder.ZYX: {

					this.y = Math.asin(-clamp(m20, -1, 1));

					if(Math.abs(m20) < THRESHOLD) {

						this.x = Math.atan2(m21, m22);
						this.z = Math.atan2(m10, m00);

					} else {

						this.x = 0;
						this.z = Math.atan2(-m01, m11);

					}

					break;

				}

				case RotationOrder.YZX: {

					this.z = Math.asin(clamp(m10, -1, 1));

					if(Math.abs(m10) < THRESHOLD) {

						this.x = Math.atan2(-m12, m11);
						this.y = Math.atan2(-m20, m00);

					} else {

						this.x = 0;
						this.y = Math.atan2(m02, m22);

					}

					break;

				}

				case RotationOrder.XZY: {

					this.z = Math.asin(-clamp(m01, -1, 1));

					if(Math.abs(m01) < THRESHOLD) {

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

		/**
		 * Copies the rotation from a given quaternion.
		 *
		 * @param {Matrix4} q - A quaternion.
		 * @param {RotationOrder} [order] - An override rotation order.
		 * @return {Euler} This set of Euler angles.
		 */

		setFromQuaternion(q, order) {

			m.makeRotationFromQuaternion(q);

			return this.setFromRotationMatrix(m, order);

		}

		/**
		 * Copies the rotation from a given vector.
		 *
		 * @param {Matrix4} v - A vector.
		 * @param {RotationOrder} [order] - A rotation order.
		 * @return {Euler} This set of Euler angles.
		 */

		setFromVector3(v, order = this.order) {

			return this.set(v.x, v.y, v.z, order);

		}

		/**
		 * Reorder the rotation angles.
		 *
		 * WARNING: this operation discards revolution information!
		 *
		 * @param {RotationOrder} newOrder - The new rotation order.
		 * @return {Euler} This set of Euler angles.
		 */

		reorder(newOrder) {

			q.setFromEuler(this);

			return this.setFromQuaternion(q, newOrder);

		}

		/**
		 * Checks if this set of Euler angles equals the given one.
		 *
		 * @param {Euler} e - Euler angles.
		 * @return {Boolean} Whether this set of Euler angles equals the given one.
		 */

		equals(e) {

			return (e.x === this.x && e.y === this.y && e.z === this.z && e.order === this.order);

		}

		/**
		 * The default rotation order.
		 *
		 * @type {RotationOrder}
		 * @final
		 */

		static get defaultOrder() {

			return RotationOrder.XYZ;

		}

	}

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const a$2 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const b$2 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const c = new Vector3();

	/**
	 * A 4x4 matrix.
	 */

	class Matrix4 {

		/**
		 * Constructs a new matrix.
		 */

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @type {Float32Array}
			 */

			this.elements = new Float32Array([

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
		 * @param {Number} n00 - The value of the first row, first column.
		 * @param {Number} n01 - The value of the first row, second column.
		 * @param {Number} n02 - The value of the first row, third column.
		 * @param {Number} n03 - The value of the first row, fourth column.
		 * @param {Number} n10 - The value of the second row, first column.
		 * @param {Number} n11 - The value of the second row, second column.
		 * @param {Number} n12 - The value of the second row, third column.
		 * @param {Number} n13 - The value of the second row, fourth column.
		 * @param {Number} n20 - The value of the third row, first column.
		 * @param {Number} n21 - The value of the third row, second column.
		 * @param {Number} n22 - The value of the third row, third column.
		 * @param {Number} n23 - The value of the third row, fourth column.
		 * @param {Number} n30 - The value of the fourth row, first column.
		 * @param {Number} n31 - The value of the fourth row, second column.
		 * @param {Number} n32 - The value of the fourth row, third column.
		 * @param {Number} n33 - The value of the fourth row, fourth column.
		 * @return {Matrix4} This matrix.
		 */

		set(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {

			const te = this.elements;

			te[0] = n00; te[4] = n01; te[8] = n02; te[12] = n03;
			te[1] = n10; te[5] = n11; te[9] = n12; te[13] = n13;
			te[2] = n20; te[6] = n21; te[10] = n22; te[14] = n23;
			te[3] = n30; te[7] = n31; te[11] = n32; te[15] = n33;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @return {Matrix4} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Copies the values of a given matrix.
		 *
		 * @param {Matrix4} matrix - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		copy(matrix) {

			const me = matrix.elements;
			const te = this.elements;

			te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
			te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
			te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
			te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @return {Matrix4} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().fromArray(this.elements);

		}

		/**
		 * Copies the values of a given array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Matrix4} This matrix.
		 */

		fromArray(array, offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 16; ++i) {

				te[i] = array[i + offset];

			}

			return this;

		}

		/**
		 * Stores this matrix in an array.
		 *
		 * @param {Number[]} [array] - A target array.
		 * @param {Number} [offset=0] - An offset into the array.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			const te = this.elements;

			let i;

			for(i = 0; i < 16; ++i) {

				array[i + offset] = te[i];

			}

			return array;

		}

		/**
		 * Returns the largest scale.
		 *
		 * @return {Number} The largest scale of the three axes.
		 */

		getMaxScaleOnAxis() {

			const te = this.elements;

			const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
			const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
			const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

			return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));

		}

		/**
		 * Copies the position values of a given matrix.
		 *
		 * @param {Matrix4} matrix - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		copyPosition(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			te[12] = me[12];
			te[13] = me[13];
			te[14] = me[14];

			return this;

		}

		/**
		 * Sets the position values of this matrix.
		 *
		 * @param {Vector3} p - A position.
		 * @return {Matrix4} This matrix.
		 */

		setPosition(p) {

			const te = this.elements;

			te[12] = p.x;
			te[13] = p.y;
			te[14] = p.z;

			return this;

		}

		/**
		 * Extracts the basis from this matrix.
		 *
		 * @param {Vector3} xAxis - A vector to store the X-axis column in.
		 * @param {Vector3} yAxis - A vector to store the Y-axis column in.
		 * @param {Vector3} zAxis - A vector to store the Z-axis column in.
		 * @return {Matrix4} This matrix.
		 */

		extractBasis(xAxis, yAxis, zAxis) {

			xAxis.setFromMatrixColumn(this, 0);
			yAxis.setFromMatrixColumn(this, 1);
			zAxis.setFromMatrixColumn(this, 2);

			return this;

		}

		/**
		 * Sets the basis of this matrix.
		 *
		 * @param {Vector3} xAxis - The X-axis.
		 * @param {Vector3} yAxis - The Y-axis.
		 * @param {Vector3} zAxis - The Z-axis.
		 * @return {Matrix4} This matrix.
		 */

		makeBasis(xAxis, yAxis, zAxis) {

			this.set(

				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Extracts the rotation from a given matrix.
		 *
		 * This method does not support reflection matrices.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		extractRotation(m) {

			const te = this.elements;
			const me = m.elements;

			const scaleX = 1.0 / a$2.setFromMatrixColumn(m, 0).length();
			const scaleY = 1.0 / a$2.setFromMatrixColumn(m, 1).length();
			const scaleZ = 1.0 / a$2.setFromMatrixColumn(m, 2).length();

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

		/**
		 * Sets the matrix rotation based on the given Euler angles.
		 *
		 * @param {Euler} euler - The euler angles.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationFromEuler(euler) {

			const te = this.elements;

			const x = euler.x;
			const y = euler.y;
			const z = euler.z;

			const a = Math.cos(x), b = Math.sin(x);
			const c = Math.cos(y), d = Math.sin(y);
			const e = Math.cos(z), f = Math.sin(z);

			let ae, af, be, bf;
			let ce, cf, de, df;
			let ac, ad, bc, bd;

			switch(euler.order) {

				case RotationOrder.XYZ: {

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

				case RotationOrder.YXZ: {

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

				case RotationOrder.ZXY: {

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

				case RotationOrder.ZYX: {

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

				case RotationOrder.YZX: {

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

				case RotationOrder.XZY: {

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

			// Bottom row.
			te[3] = 0;
			te[7] = 0;
			te[11] = 0;

			// Last column.
			te[12] = 0;
			te[13] = 0;
			te[14] = 0;
			te[15] = 1;

			return this;

		}

		/**
		 * Sets the matrix rotation based on the given quaternion.
		 *
		 * @param {Quaternion} q - The quaternion.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationFromQuaternion(q) {

			return this.compose(a$2.set(0, 0, 0), q, b$2.set(1, 1, 1));

		}

		/**
		 * Creates a rotation that looks at the given target.
		 *
		 * @param {Vector3} eye - The position of the eye.
		 * @param {Vector3} target - The target to look at.
		 * @param {Vector3} up - The up vector.
		 * @return {Matrix4} This matrix.
		 */

		lookAt(eye, target, up) {

			const te = this.elements;
			const x = a$2, y = b$2, z = c;

			z.subVectors(eye, target);

			if(z.lengthSquared() === 0) {

				// Eye and target are at the same position.
				z.z = 1;

			}

			z.normalize();
			x.crossVectors(up, z);

			if(x.lengthSquared() === 0) {

				// Up and z are parallel.
				if(Math.abs(up.z) === 1) {

					z.x += 1e-4;

				} else {

					z.z += 1e-4;

				}

				z.normalize();
				x.crossVectors(up, z);

			}

			x.normalize();
			y.crossVectors(z, x);

			te[0] = x.x; te[4] = y.x; te[8] = z.x;
			te[1] = x.y; te[5] = y.y; te[9] = z.y;
			te[2] = x.z; te[6] = y.z; te[10] = z.z;

			return this;

		}

		/**
		 * Sets this matrix to the product of the given matrices.
		 *
		 * @param {Matrix4} a - A matrix.
		 * @param {Matrix4} b - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		multiplyMatrices(a, b) {

			const te = this.elements;
			const ae = a.elements;
			const be = b.elements;

			const a00 = ae[0], a01 = ae[4], a02 = ae[8], a03 = ae[12];
			const a10 = ae[1], a11 = ae[5], a12 = ae[9], a13 = ae[13];
			const a20 = ae[2], a21 = ae[6], a22 = ae[10], a23 = ae[14];
			const a30 = ae[3], a31 = ae[7], a32 = ae[11], a33 = ae[15];

			const b00 = be[0], b01 = be[4], b02 = be[8], b03 = be[12];
			const b10 = be[1], b11 = be[5], b12 = be[9], b13 = be[13];
			const b20 = be[2], b21 = be[6], b22 = be[10], b23 = be[14];
			const b30 = be[3], b31 = be[7], b32 = be[11], b33 = be[15];

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

		/**
		 * Multiplies this matrix with the given one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		multiply(m) {

			return this.multiplyMatrices(this, m);

		}

		/**
		 * Multiplies a given matrix with this one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Matrix4} This matrix.
		 */

		premultiply(m) {

			return this.multiplyMatrices(m, this);

		}

		/**
		 * Multiplies this matrix with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Matrix4} This matrix.
		 */

		multiplyScalar(s) {

			const te = this.elements;

			te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
			te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
			te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
			te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;

			return this;

		}

		/**
		 * Calculates the determinant of this matrix.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		 *
		 * @return {Number} The determinant.
		 */

		determinant() {

			const te = this.elements;

			const n00 = te[0], n01 = te[4], n02 = te[8], n03 = te[12];
			const n10 = te[1], n11 = te[5], n12 = te[9], n13 = te[13];
			const n20 = te[2], n21 = te[6], n22 = te[10], n23 = te[14];
			const n30 = te[3], n31 = te[7], n32 = te[11], n33 = te[15];

			const n00n11 = n00 * n11, n00n12 = n00 * n12, n00n13 = n00 * n13;
			const n01n10 = n01 * n10, n01n12 = n01 * n12, n01n13 = n01 * n13;
			const n02n10 = n02 * n10, n02n11 = n02 * n11, n02n13 = n02 * n13;
			const n03n10 = n03 * n10, n03n11 = n03 * n11, n03n12 = n03 * n12;

			return (

				n30 * (
					n03n12 * n21 -
					n02n13 * n21 -
					n03n11 * n22 +
					n01n13 * n22 +
					n02n11 * n23 -
					n01n12 * n23
				) +

				n31 * (
					n00n12 * n23 -
					n00n13 * n22 +
					n03n10 * n22 -
					n02n10 * n23 +
					n02n13 * n20 -
					n03n12 * n20
				) +

				n32 * (
					n00n13 * n21 -
					n00n11 * n23 -
					n03n10 * n21 +
					n01n10 * n23 +
					n03n11 * n20 -
					n01n13 * n20
				) +

				n33 * (
					-n02n11 * n20 -
					n00n12 * n21 +
					n00n11 * n22 +
					n02n10 * n21 -
					n01n10 * n22 +
					n01n12 * n20
				)

			);

		}

		/**
		 * Inverts the given matrix and stores the result in this matrix.
		 *
		 * For details see:
		 *  http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		 *
		 * @param {Matrix4} matrix - The matrix that should be inverted.
		 * @return {Matrix4} This matrix.
		 */

		getInverse(matrix) {

			const te = this.elements;
			const me = matrix.elements;

			const n00 = me[0], n10 = me[1], n20 = me[2], n30 = me[3];
			const n01 = me[4], n11 = me[5], n21 = me[6], n31 = me[7];
			const n02 = me[8], n12 = me[9], n22 = me[10], n32 = me[11];
			const n03 = me[12], n13 = me[13], n23 = me[14], n33 = me[15];

			const t00 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
			const t01 = n03 * n22 * n31 - n02 * n23 * n31 - n03 * n21 * n32 + n01 * n23 * n32 + n02 * n21 * n33 - n01 * n22 * n33;
			const t02 = n02 * n13 * n31 - n03 * n12 * n31 + n03 * n11 * n32 - n01 * n13 * n32 - n02 * n11 * n33 + n01 * n12 * n33;
			const t03 = n03 * n12 * n21 - n02 * n13 * n21 - n03 * n11 * n22 + n01 * n13 * n22 + n02 * n11 * n23 - n01 * n12 * n23;

			const det = n00 * t00 + n10 * t01 + n20 * t02 + n30 * t03;

			let invDet;

			if(det !== 0) {

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

		/**
		 * Transposes this matrix.
		 *
		 * @return {Matrix4} This matrix.
		 */

		transpose() {

			const te = this.elements;

			let t;

			t = te[1]; te[1] = te[4]; te[4] = t;
			t = te[2]; te[2] = te[8]; te[8] = t;
			t = te[6]; te[6] = te[9]; te[9] = t;

			t = te[3]; te[3] = te[12]; te[12] = t;
			t = te[7]; te[7] = te[13]; te[13] = t;
			t = te[11]; te[11] = te[14]; te[14] = t;

			return this;

		}

		/**
		 * Scales this matrix.
		 *
		 * @param {Number} sx - The X scale.
		 * @param {Number} sy - The Y scale.
		 * @param {Number} sz - The Z scale.
		 * @return {Matrix4} This matrix.
		 */

		scale(sx, sy, sz) {

			const te = this.elements;

			te[0] *= sx; te[4] *= sy; te[8] *= sz;
			te[1] *= sx; te[5] *= sy; te[9] *= sz;
			te[2] *= sx; te[6] *= sy; te[10] *= sz;
			te[3] *= sx; te[7] *= sy; te[11] *= sz;

			return this;

		}

		/**
		 * Makes this matrix a scale matrix.
		 *
		 * @param {Number} x - The X scale.
		 * @param {Number} y - The Y scale.
		 * @param {Number} z - The Z scale.
		 * @return {Matrix4} This matrix.
		 */

		makeScale(x, y, z) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a translation matrix.
		 *
		 * @param {Number} x - The X offset.
		 * @param {Number} y - The Y offset.
		 * @param {Number} z - The Z offset.
		 * @return {Matrix4} This matrix.
		 */

		makeTranslation(x, y, z) {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationX(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				1, 0, 0, 0,
				0, c, -s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix with respect to the Y-axis.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationY(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				c, 0, s, 0,
				0, 1, 0, 0,
				-s, 0, c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a rotation matrix with respect to the Z-axis.
		 *
		 * @param {Number} theta - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationZ(theta) {

			const c = Math.cos(theta), s = Math.sin(theta);

			this.set(

				c, -s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a translation matrix with respect to a specific axis.
		 *
		 * For mor einformation see:
		 *  http://www.gamedev.net/reference/articles/article1199.asp
		 *
		 * @param {Vector3} axis - The axis. Assumed to be normalized.
		 * @param {Number} angle - The angle in radians.
		 * @return {Matrix4} This matrix.
		 */

		makeRotationAxis(axis, angle) {

			const c = Math.cos(angle);
			const s = Math.sin(angle);

			const t = 1.0 - c;

			const x = axis.x, y = axis.y, z = axis.z;
			const tx = t * x, ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Makes this matrix a shear matrix.
		 *
		 * @param {Number} x - The X shear value.
		 * @param {Number} y - The Y shear value.
		 * @param {Number} z - The Z shear value.
		 * @return {Matrix4} This matrix.
		 */

		makeShear(x, y, z) {

			this.set(

				1, y, z, 0,
				x, 1, z, 0,
				x, y, 1, 0,
				0, 0, 0, 1

			);

			return this;

		}

		/**
		 * Sets this matrix based on the given position, rotation and scale.
		 *
		 * @param {Vector3} position - The position.
		 * @param {Quaternion} quaternion - The rotation.
		 * @param {Vector3} scale - The scale.
		 * @return {Matrix4} This matrix.
		 */

		compose(position, quaternion, scale) {

			const te = this.elements;

			const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
			const x2 = x + x,	y2 = y + y, z2 = z + z;
			const xx = x * x2, xy = x * y2, xz = x * z2;
			const yy = y * y2, yz = y * z2, zz = z * z2;
			const wx = w * x2, wy = w * y2, wz = w * z2;

			const sx = scale.x, sy = scale.y, sz = scale.z;

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

		/**
		 * Decomposes this matrix into a position, rotation and scale vector.
		 *
		 * @param {Vector3} position - The target position.
		 * @param {Quaternion} quaternion - The target rotation.
		 * @param {Vector3} scale - The target scale.
		 * @return {Matrix4} This matrix.
		 */

		decompose(position, quaternion, scale) {

			const te = this.elements;

			const n00 = te[0], n10 = te[1], n20 = te[2];
			const n01 = te[4], n11 = te[5], n21 = te[6];
			const n02 = te[8], n12 = te[9], n22 = te[10];

			const det = this.determinant();

			// If the determinant is negative, one scale must be inverted.
			const sx = a$2.set(n00, n10, n20).length() * ((det < 0) ? -1 : 1);
			const sy = a$2.set(n01, n11, n21).length();
			const sz = a$2.set(n02, n12, n22).length();

			const invSX = 1.0 / sx;
			const invSY = 1.0 / sy;
			const invSZ = 1.0 / sz;

			// Export the position.
			position.x = te[12];
			position.y = te[13];
			position.z = te[14];

			// Scale the rotation part.
			te[0] *= invSX; te[1] *= invSX; te[2] *= invSX;
			te[4] *= invSY; te[5] *= invSY; te[6] *= invSY;
			te[8] *= invSZ; te[9] *= invSZ; te[10] *= invSZ;

			// Export the rotation.
			quaternion.setFromRotationMatrix(this);

			// Restore the original values.
			te[0] = n00; te[1] = n10; te[2] = n20;
			te[4] = n01; te[5] = n11; te[6] = n21;
			te[8] = n02; te[9] = n12; te[10] = n22;

			// Export the scale.
			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		}

		/**
		 * Creates a perspective matrix.
		 *
		 * @param {Number} left - The distance to the left plane.
		 * @param {Number} right - The distance to the right plane.
		 * @param {Number} top - The distance to the top plane.
		 * @param {Number} bottom - The distance to the bottom plane.
		 * @param {Number} near - The distance to the near plane.
		 * @param {Number} far - The distance to the far plane.
		 * @return {Matrix4} This matrix.
		 */

		makePerspective(left, right, top, bottom, near, far) {

			const te = this.elements;
			const x = 2 * near / (right - left);
			const y = 2 * near / (top - bottom);

			const a = (right + left) / (right - left);
			const b = (top + bottom) / (top - bottom);
			const c = -(far + near) / (far - near);
			const d = -2 * far * near / (far - near);

			te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
			te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
			te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
			te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;

			return this;

		}

		/**
		 * Creates an orthographic matrix.
		 *
		 * @param {Number} left - The distance to the left plane.
		 * @param {Number} right - The distance to the right plane.
		 * @param {Number} top - The distance to the top plane.
		 * @param {Number} bottom - The distance to the bottom plane.
		 * @param {Number} near - The distance to the near plane.
		 * @param {Number} far - The distance to the far plane.
		 * @return {Matrix4} This matrix.
		 */

		makeOrthographic(left, right, top, bottom, near, far) {

			const te = this.elements;
			const w = 1.0 / (right - left);
			const h = 1.0 / (top - bottom);
			const p = 1.0 / (far - near);

			const x = (right + left) * w;
			const y = (top + bottom) * h;
			const z = (far + near) * p;

			te[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = -x;
			te[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = -y;
			te[2] = 0; te[6] = 0; te[10] = -2 * p; te[14] = -z;
			te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;

			return this;

		}

		/**
		 * Checks if this matrix equals the given one.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Boolean} Whether the matrix are equal.
		 */

		equals(m) {

			const te = this.elements;
			const me = m.elements;

			let result = true;
			let i;

			for(i = 0; result && i < 16; ++i) {

				if(te[i] !== me[i]) {

					result = false;

				}

			}

			return result;

		}

	}

	/**
	 * A list of vectors.
	 *
	 * @type {Vector3[]}
	 * @private
	 */

	const v$5 = [
		new Vector3(),
		new Vector3(),
		new Vector3(),
		new Vector3()
	];

	/**
	 * A ray.
	 */

	class Ray {

		/**
		 * Constructs a new ray.
		 *
		 * @param {Vector3} [origin] - The origin.
		 * @param {Vector3} [direction] - The direction.
		 */

		constructor(origin = new Vector3(), direction = new Vector3()) {

			/**
			 * The origin.
			 *
			 * @type {Vector3}
			 */

			this.origin = origin;

			/**
			 * The direction.
			 *
			 * @type {Vector3}
			 */

			this.direction = direction;

		}

		/**
		 * Sets the origin and the direction.
		 *
		 * @param {Vector3} origin - The origin.
		 * @param {Vector3} direction - The direction. Should be normalized.
		 * @return {Ray} This ray.
		 */

		set(origin, direction) {

			this.origin.copy(origin);
			this.direction.copy(direction);

			return this;

		}

		/**
		 * Copies the given ray.
		 *
		 * @param {Ray} r - A ray.
		 * @return {Ray} This ray.
		 */

		copy(r) {

			this.origin.copy(r.origin);
			this.direction.copy(r.direction);

			return this;

		}

		/**
		 * Clones this ray.
		 *
		 * @return {Ray} The cloned ray.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Computes a point along the ray based on a given scalar t.
		 *
		 * @param {Number} t - The scalar.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point.
		 */

		at(t, target = new Vector3()) {

			return target.copy(this.direction).multiplyScalar(t).add(this.origin);

		}

		/**
		 * Rotates this ray to look at the given target.
		 *
		 * @param {Vector3} target - A point to look at.
		 * @return {Ray} This ray.
		 */

		lookAt(target) {

			this.direction.copy(target).sub(this.origin).normalize();

			return this;

		}

		/**
		 * Moves the origin along the ray by a given scalar t.
		 *
		 * @param {Number} t - The scalar.
		 * @return {Ray} This ray.
		 */

		recast(t) {

			this.origin.copy(this.at(t, v$5[0]));

			return this;

		}

		/**
		 * Finds the closest point along this ray to a given point.
		 *
		 * @param {Vector3} p - A point.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point.
		 */

		closestPointToPoint(p, target = new Vector3()) {

			const directionDistance = target.subVectors(p, this.origin).dot(this.direction);

			return (directionDistance >= 0.0) ?
				target.copy(this.direction).multiplyScalar(directionDistance).add(this.origin) :
				target.copy(this.origin);

		}

		/**
		 * Calculates the squared distance from this ray to the given point.
		 *
		 * @param {Vector3} p - The point.
		 * @return {Number} The squared distance.
		 */

		distanceSquaredToPoint(p) {

			const directionDistance = v$5[0].subVectors(p, this.origin).dot(this.direction);

			// Check if the point is behind the ray.
			return (directionDistance < 0.0) ?
				this.origin.distanceToSquared(p) :
				v$5[0].copy(this.direction).multiplyScalar(directionDistance).add(this.origin).distanceToSquared(p);

		}

		/**
		 * Calculates the distance from this ray to the given point.
		 *
		 * @param {Vector3} p - The point.
		 * @return {Number} The distance.
		 */

		distanceToPoint(p) {

			return Math.sqrt(this.distanceSquaredToPoint(p));

		}

		/**
		 * Calculates the distance from this ray to the given plane.
		 *
		 * @param {Plane} p - The plane.
		 * @return {Number} The distance, or null if the denominator is zero.
		 */

		distanceToPlane(p) {

			const denominator = p.normal.dot(this.direction);

			const t = (denominator !== 0.0) ?
				-(this.origin.dot(p.normal) + p.constant) / denominator :
				((p.distanceToPoint(this.origin) === 0.0) ? 0.0 : -1.0);

			return (t >= 0.0) ? t : null;

		}

		/**
		 * Calculates the distance from this ray to a given line segment.
		 *
		 * Based on:
		 *  http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
		 *
		 * @param {Vector3} v0 - The start of the segment.
		 * @param {Vector3} v1 - The end of the segment.
		 * @param {Vector3} [pointOnRay] - If provided, the point on this Ray that is closest to the segment will be stored in this vector.
		 * @param {Vector3} [pointOnSegment] - If provided, the point on the line segment that is closest to this ray will be stored in this vector.
		 * @return {Number} The smallest distance between the ray and the segment defined by v0 and v1.
		 */

		distanceSquaredToSegment(v0, v1, pointOnRay, pointOnSegment) {

			const segCenter = v$5[0].copy(v0).add(v1).multiplyScalar(0.5);
			const segDir = v$5[1].copy(v1).sub(v0).normalize();
			const diff = v$5[2].copy(this.origin).sub(segCenter);

			const segExtent = v0.distanceTo(v1) * 0.5;
			const a01 = -this.direction.dot(segDir);
			const b0 = diff.dot(this.direction);
			const b1 = -diff.dot(segDir);
			const c = diff.lengthSq();
			const det = Math.abs(1.0 - a01 * a01);

			let s0, s1, extDet, invDet, sqrDist;

			if(det > 0.0) {

				// The ray and segment are not parallel.
				s0 = a01 * b1 - b0;
				s1 = a01 * b0 - b1;
				extDet = segExtent * det;

				if(s0 >= 0.0) {

					if(s1 >= -extDet) {

						if(s1 <= extDet) {

							// Region 0.
							// Minimum at interior points of ray and segment.
							invDet = 1.0 / det;
							s0 *= invDet;
							s1 *= invDet;
							sqrDist = s0 * (s0 + a01 * s1 + 2.0 * b0) + s1 * (a01 * s0 + s1 + 2.0 * b1) + c;

						} else {

							// Region 1.
							s1 = segExtent;
							s0 = Math.max(0.0, -(a01 * s1 + b0));
							sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

						}

					} else {

						// Region 5.
						s1 = -segExtent;
						s0 = Math.max(0.0, -(a01 * s1 + b0));
						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

					}

				} else {

					if(s1 <= -extDet) {

						// Region 4.
						s0 = Math.max(0.0, -(-a01 * segExtent + b0));
						s1 = (s0 > 0.0) ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

					} else if(s1 <= extDet) {

						// Region 3.
						s0 = 0.0;
						s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
						sqrDist = s1 * (s1 + 2.0 * b1) + c;

					} else {

						// Region 2.
						s0 = Math.max(0.0, -(a01 * segExtent + b0));
						s1 = (s0 > 0.0) ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

					}

				}

			} else {

				// Ray and segment are parallel.
				s1 = (a01 > 0.0) ? -segExtent : segExtent;
				s0 = Math.max(0.0, -(a01 * s1 + b0));
				sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

			}

			if(pointOnRay !== undefined) {

				pointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);

			}

			if(pointOnSegment !== undefined) {

				pointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);

			}

			return sqrDist;

		}

		/**
		 * Finds the point where this ray intersects the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point of intersection, or null if there is none.
		 */

		intersectSphere(s, target = new Vector3()) {

			const ab = v$5[0].subVectors(s.center, this.origin);
			const tca = ab.dot(this.direction);
			const d2 = ab.dot(ab) - tca * tca;
			const radius2 = s.radius * s.radius;

			let result = null;
			let thc, t0, t1;

			if(d2 <= radius2) {

				thc = Math.sqrt(radius2 - d2);

				// t0 = first intersection point - entrance on front of sphere.
				t0 = tca - thc;

				// t1 = second intersection point - exit point on back of sphere.
				t1 = tca + thc;

				// Check if both t0 and t1 are behind the ray - if so, return null.
				if(t0 >= 0.0 || t1 >= 0.0) {

					/* Check if t0 is behind the ray. If it is, the ray is inside the
					sphere, so return the second exit point scaled by t1 in order to always
					return an intersection point that is in front of the ray. If t0 is in
					front of the ray, return the first collision point scaled by t0. */
					result = (t0 < 0.0) ? this.at(t1, target) : this.at(t0, target);

				}

			}

			return result;

		}

		/**
		 * Determines whether this ray intersects the given sphere.
		 *
		 * @param {Sphere} s - A sphere.
		 * @return {Boolean} Whether this ray intersects the given sphere.
		 */

		intersectsSphere(s) {

			return (this.distanceToPoint(s.center) <= s.radius);

		}

		/**
		 * Finds the point where this ray intersects the given plane.
		 *
		 * @param {Plane} p - A plane.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point of intersection, or null if there is none.
		 */

		intersectPlane(p, target = new Vector3()) {

			const t = this.distanceToPlane(p);

			return (t === null) ? null : this.at(t, target);

		}

		/**
		 * Determines whether this ray intersects the given plane.
		 *
		 * @param {Plane} p - A plane.
		 * @return {Boolean} Whether this ray intersects the given plane.
		 */

		intersectsPlane(p) {

			const distanceToPoint = p.distanceToPoint(this.origin);

			return (distanceToPoint === 0.0 || p.normal.dot(this.direction) * distanceToPoint < 0.0);

		}

		/**
		 * Finds the point where this ray intersects the given box.
		 *
		 * @param {Plane} b - A box.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point of intersection, or null if there is none.
		 */

		intersectBox(b, target = new Vector3()) {

			const origin = this.origin;
			const direction = this.direction;
			const min = b.min;
			const max = b.max;

			const invDirX = 1.0 / direction.x;
			const invDirY = 1.0 / direction.y;
			const invDirZ = 1.0 / direction.z;

			let result = null;
			let tmin, tmax, tymin, tymax, tzmin, tzmax;

			if(invDirX >= 0.0) {

				tmin = (min.x - origin.x) * invDirX;
				tmax = (max.x - origin.x) * invDirX;

			} else {

				tmin = (max.x - origin.x) * invDirX;
				tmax = (min.x - origin.x) * invDirX;

			}

			if(invDirY >= 0.0) {

				tymin = (min.y - origin.y) * invDirY;
				tymax = (max.y - origin.y) * invDirY;

			} else {

				tymin = (max.y - origin.y) * invDirY;
				tymax = (min.y - origin.y) * invDirY;

			}

			if(tmin <= tymax && tymin <= tmax) {

				/* Handle the case where tmin or tmax is NaN (result of 0 * Infinity).
				Note: x !== x returns true if x is NaN. */
				if(tymin > tmin || tmin !== tmin) {

					tmin = tymin;

				}

				if(tymax < tmax || tmax !== tmax) {

					tmax = tymax;

				}

				if(invDirZ >= 0.0) {

					tzmin = (min.z - origin.z) * invDirZ;
					tzmax = (max.z - origin.z) * invDirZ;

				} else {

					tzmin = (max.z - origin.z) * invDirZ;
					tzmax = (min.z - origin.z) * invDirZ;

				}

				if(tmin <= tzmax && tzmin <= tmax) {

					if(tzmin > tmin || tmin !== tmin) {

						tmin = tzmin;

					}

					if(tzmax < tmax || tmax !== tmax) {

						tmax = tzmax;

					}

					// Return the closest point (positive side).
					if(tmax >= 0.0) {

						result = this.at((tmin >= 0.0) ? tmin : tmax, target);

					}

				}

			}

			return result;

		}

		/**
		 * Determines whether this ray intersects the given box.
		 *
		 * @param {Box3} b - A box.
		 * @return {Boolean} Whether this ray intersects the given box.
		 */

		intersectsBox(b) {

			return (this.intersectBox(b, v$5[0]) !== null);

		}

		/**
		 * Finds the point where this ray intersects the given triangle.
		 *
		 * Based on:
		 *  http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
		 *
		 * @param {Vector3} a - A triangle vertex.
		 * @param {Vector3} b - A triangle vertex.
		 * @param {Vector3} c - A triangle vertex.
		 * @param {Boolean} [backfaceCulling=false] - Whether backface culling should be considered.
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} The point of intersection, or null if there is none.
		 */

		intersectTriangle(a, b, c, backfaceCulling, target) {

			const direction = this.direction;

			// Compute the offset origin, edges, and normal.
			const diff = v$5[0];
			const edge1 = v$5[1];
			const edge2 = v$5[2];
			const normal = v$5[3];

			let result = null;
			let DdN, sign, DdQxE2, DdE1xQ, QdN;

			edge1.subVectors(b, a);
			edge2.subVectors(c, a);
			normal.crossVectors(edge1, edge2);

			/* Solve Q + t * D = b1 * E1 + b2 * E2
			 * (Q = kDiff, D = ray direction, E1 = kEdge1, E2 = kEdge2,
			 * N = Cross(E1, E2)):
			 *
			 *   | Dot(D, N) | * b1 = sign(Dot(D, N)) * Dot(D, Cross(Q, E2))
			 *   | Dot(D, N) | * b2 = sign(Dot(D, N)) * Dot(D, Cross(E1, Q))
			 *   | Dot(D, N) | * t = -sign(Dot(D, N)) * Dot(Q, N)
			 */

			DdN = direction.dot(normal);

			// Discard coplanar constellations and cull backfaces.
			if(DdN !== 0.0 && !(backfaceCulling && DdN > 0.0)) {

				if(DdN > 0.0) {

					sign = 1.0;

				} else {

					sign = -1.0;
					DdN = -DdN;

				}

				diff.subVectors(this.origin, a);
				DdQxE2 = sign * direction.dot(edge2.crossVectors(diff, edge2));

				// b1 < 0, no intersection.
				if(DdQxE2 >= 0.0) {

					DdE1xQ = sign * direction.dot(edge1.cross(diff));

					// b2 < 0, or b1 + b2 > 1, no intersection.
					if(DdE1xQ >= 0.0 && DdQxE2 + DdE1xQ <= DdN) {

						// The line intersects the triangle, check if the ray does.
						QdN = -sign * diff.dot(normal);

						// t < 0, no intersection.
						if(QdN >= 0.0) {

							// Ray intersects triangle.
							result = this.at(QdN / DdN, target);

						}

					}

				}

			}

			return result;

		}

		/**
		 * Applies the given matrix to this ray.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Ray} This ray.
		 */

		applyMatrix4(m) {

			this.origin.applyMatrix4(m);
			this.direction.transformDirection(m);

			return this;

		}

		/**
		 * Checks if this ray equals the given one.
		 *
		 * @param {Ray} r - A ray.
		 * @return {Boolean} Whether the rays are equal.
		 */

		equals(r) {

			return (r.origin.equals(this.origin) && r.direction.equals(this.direction));

		}

	}

	/**
	 * A spherical coordinate system.
	 *
	 * For details see: https://en.wikipedia.org/wiki/Spherical_coordinate_system
	 *
	 * The poles (phi) are at the positive and negative Y-axis. The equator starts
	 * at positive Z.
	 */

	class Spherical {

		/**
		 * Constructs a new spherical system.
		 *
		 * @param {Number} [radius=1] - The radius of the sphere.
		 * @param {Number} [phi=0] - The polar angle phi.
		 * @param {Number} [theta=0] - The equator angle theta.
		 */

		constructor(radius = 1, phi = 0, theta = 0) {

			/**
			 * The radius of the sphere.
			 *
			 * @type {Number}
			 */

			this.radius = radius;

			/**
			 * The polar angle, up and down towards the top and bottom pole.
			 *
			 * @type {Number}
			 */

			this.phi = phi;

			/**
			 * The angle around the equator of the sphere.
			 *
			 * @type {Number}
			 */

			this.theta = theta;

		}

		/**
		 * Sets the values of this spherical system.
		 *
		 * @param {Number} radius - The radius.
		 * @param {Number} phi - Phi.
		 * @param {Number} theta - Theta.
		 * @return {Spherical} This spherical system.
		 */

		set(radius, phi, theta) {

			this.radius = radius;
			this.phi = phi;
			this.theta = theta;

			return this;

		}

		/**
		 * Copies the values of the given spherical system.
		 *
		 * @param {Spherical} s - A spherical system.
		 * @return {Spherical} This spherical system.
		 */

		copy(s) {

			this.radius = s.radius;
			this.phi = s.phi;
			this.theta = s.theta;

			return this;

		}

		/**
		 * Clones this spherical system.
		 *
		 * @return {Spherical} The cloned spherical system.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Sets the values of this spherical system based on a vector.
		 *
		 * The radius is set to the vector's length while phi and theta are set from
		 * its direction.
		 *
		 * @param {Vector3} v - The vector.
		 * @return {Spherical} This spherical system.
		 */

		setFromVector3(v) {

			this.radius = v.length();

			if(this.radius === 0) {

				this.theta = 0;
				this.phi = 0;

			} else {

				// Calculate the equator angle around the positive Y-axis.
				this.theta = Math.atan2(v.x, v.z);

				// Calculate the polar angle.
				this.phi = Math.acos(Math.min(Math.max(v.y / this.radius, -1), 1));

			}

			return this.makeSafe();

		}

		/**
		 * Restricts phi to `[1e-6, PI - 1e-6]`.
		 *
		 * @return {Spherical} This spherical system.
		 */

		makeSafe() {

			this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi));

			return this;

		}

	}

	/**
	 * A symmetric 3x3 matrix.
	 */

	class SymmetricMatrix3 {

		/**
		 * Constructs a new symmetric matrix.
		 */

		constructor() {

			/**
			 * The matrix elements.
			 *
			 * @type {Float32Array}
			 */

			this.elements = new Float32Array([

				1, 0, 0,
				1, 0,
				1

			]);

		}

		/**
		 * Sets the values of this matrix.
		 *
		 * @param {Number} m00 - The value of the first row, first column.
		 * @param {Number} m01 - The value of the first row, second column and the second row, first column.
		 * @param {Number} m02 - The value of the first row, third column and the third row, first column.
		 * @param {Number} m11 - The value of the second row, second column.
		 * @param {Number} m12 - The value of the second row, third column and third row, second column.
		 * @param {Number} m22 - The value of the third row, third column.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		set(m00, m01, m02, m11, m12, m22) {

			const e = this.elements;

			e[0] = m00;
			e[1] = m01; e[3] = m11;
			e[2] = m02; e[4] = m12; e[5] = m22;

			return this;

		}

		/**
		 * Sets this matrix to the identity matrix.
		 *
		 * @return {SymmetricMatrix3} This matrix.
		 */

		identity() {

			this.set(

				1, 0, 0,
				1, 0,
				1

			);

			return this;

		}

		/**
		 * Copies the values of a given symmetric matrix.
		 *
		 * @param {SymmetricMatrix3} m - A matrix.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		copy(m) {

			const me = m.elements;

			this.set(

				me[0], me[1], me[2],
				me[3], me[4],
				me[5]

			);

			return this;

		}

		/**
		 * Clones this matrix.
		 *
		 * @return {SymmetricMatrix3} A clone of this matrix.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Copies this symmetric matrix into a given 3x3 matrix.
		 *
		 * @param {Matrix3} m - The target matrix.
		 */

		toMatrix3(m) {

			const me = m.elements;

			m.set(

				me[0], me[1], me[2],
				me[1], me[3], me[4],
				me[2], me[4], me[5]

			);

		}

		/**
		 * Adds the values of a given symmetric matrix to this one.
		 *
		 * @param {SymmetricMatrix3} m - A matrix.
		 * @return {SymmetricMatrix3} This matrix.
		 */

		add(m) {

			const te = this.elements;
			const me = m.elements;

			te[0] += me[0];
			te[1] += me[1]; te[3] += me[3];
			te[2] += me[2]; te[4] += me[4]; te[5] += me[5];

			return this;

		}

		/**
		 * Calculates the Frobenius norm of this matrix.
		 *
		 * @return {Number} The norm of this matrix.
		 */

		norm() {

			const e = this.elements;

			const m01m01 = e[1] * e[1];
			const m02m02 = e[2] * e[2];
			const m12m12 = e[4] * e[4];

			return Math.sqrt(

				e[0] * e[0] + m01m01 + m02m02 +
				m01m01 + e[3] * e[3] + m12m12 +
				m02m02 + m12m12 + e[5] * e[5]

			);

		}

		/**
		 * Calculates the absolute sum of all matrix components except for the main
		 * diagonal.
		 *
		 * @return {Number} The offset of this matrix.
		 */

		off() {

			const e = this.elements;

			return Math.sqrt(2 * (

				// Diagonal = [0, 3, 5].
				e[1] * e[1] + e[2] * e[2] + e[4] * e[4]

			));

		}

		/**
		 * Applies this symmetric matrix to a vector.
		 *
		 * @param {Vector3} v - The vector to modify.
		 * @return {Vector3} The modified vector.
		 */

		applyToVector3(v) {

			const x = v.x, y = v.y, z = v.z;
			const e = this.elements;

			v.x = e[0] * x + e[1] * y + e[2] * z;
			v.y = e[1] * x + e[3] * y + e[4] * z;
			v.z = e[2] * x + e[4] * y + e[5] * z;

			return v;

		}

		/**
		 * Checks if this matrix equals the given one.
		 *
		 * @param {SymmetricMatrix3} m - A matrix.
		 * @return {Boolean} Whether the matrices are equal.
		 */

		equals(m) {

			const te = this.elements;
			const me = m.elements;

			let result = true;
			let i;

			for(i = 0; result && i < 6; ++i) {

				if(te[i] !== me[i]) {

					result = false;

				}

			}

			return result;

		}

		/**
		 * Calculates the linear index of an element from this matrix.
		 *
		 * Let N be the dimension of the symmetric matrix:
		 *
		 *     index = N * (N - 1) / 2 - (N - i) * (N - i - 1) / 2 + j
		 *
		 * @param {Number} i - The row.
		 * @param {Number} j - The column.
		 * @return {Number} The index into the elements of this matrix.
		 */

		static calculateIndex(i, j) {

			return (3 - (3 - i) * (2 - i) / 2 + j);

		}

	}

	/**
	 * A vector with four components.
	 */

	class Vector4 {

		/**
		 * Constructs a new vector.
		 *
		 * @param {Number} [x=0] - The X component.
		 * @param {Number} [y=0] - The Y component.
		 * @param {Number} [z=0] - The Z component.
		 * @param {Number} [w=0] - The W component.
		 */

		constructor(x = 0, y = 0, z = 0, w = 0) {

			/**
			 * The X component.
			 *
			 * @type {Number}
			 */

			this.x = x;

			/**
			 * The Y component.
			 *
			 * @type {Number}
			 */

			this.y = y;

			/**
			 * The Z component.
			 *
			 * @type {Number}
			 */

			this.z = z;

			/**
			 * The W component.
			 *
			 * @type {Number}
			 */

			this.w = w;

		}

		/**
		 * Sets the values of this vector
		 *
		 * @param {Number} x - The X component.
		 * @param {Number} y - The Y component.
		 * @param {Number} z - The Z component.
		 * @param {Number} w - The W component.
		 * @return {Vector4} This vector.
		 */

		set(x, y, z, w) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

			return this;

		}

		/**
		 * Copies the values of another vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		copy(v) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			this.w = v.w;

			return this;

		}

		/**
		 * Clones this vector.
		 *
		 * @return {Vector4} A clone of this vector.
		 */

		clone() {

			return new this.constructor(this.x, this.y, this.z, this.w);

		}

		/**
		 * Copies values from an array.
		 *
		 * @param {Number[]} array - An array.
		 * @param {Number} offset - An offset.
		 * @return {Vector4} This vector.
		 */

		fromArray(array, offset = 0) {

			this.x = array[offset];
			this.y = array[offset + 1];
			this.z = array[offset + 2];
			this.w = array[offset + 3];

			return this;

		}

		/**
		 * Stores this vector in an array.
		 *
		 * @param {Array} [array] - A target array.
		 * @param {Number} offset - An offset.
		 * @return {Number[]} The array.
		 */

		toArray(array = [], offset = 0) {

			array[offset] = this.x;
			array[offset + 1] = this.y;
			array[offset + 2] = this.z;
			array[offset + 3] = this.w;

			return array;

		}

		/**
		 * Stores the axis angle from the given quaternion in this vector.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
		 *
		 * @param {Quaternion} q - A quaternion. Assumed to be normalized
		 * @return {Vector4} This vector.
		 */

		setAxisAngleFromQuaternion(q) {

			this.w = 2 * Math.acos(q.w);

			const s = Math.sqrt(1 - q.w * q.w);

			if(s < 1e-4) {

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

		/**
		 * Stores the axis angle from the given rotation matrix in this vector.
		 *
		 * For more details see:
		 *  http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
		 *
		 * @param {Matrix4} m - A matrix. The upper 3x3 must be a pure rotation matrix (i.e. unscaled).
		 * @return {Vector4} This vector.
		 */

		setAxisAngleFromRotationMatrix(m) {

			// Margin to allow for rounding errors.
			const E = 0.01;
			// Margin to distinguish between 0 and 180 degrees.
			const H = 0.1;

			const me = m.elements;
			const m00 = me[0], m01 = me[4], m02 = me[8];
			const m10 = me[1], m11 = me[5], m12 = me[9];
			const m20 = me[2], m21 = me[6], m22 = me[10];

			let angle;
			let x, y, z;
			let xx, yy, zz;
			let xy, xz, yz;
			let s;

			if((Math.abs(m01 - m10) < E) && (Math.abs(m02 - m20) < E) && (Math.abs(m12 - m21) < E)) {

				/* Singularity found. First, check for identity matrix which must have +1
				for all terms in the leading diagonal and zero in other terms. */
				if((Math.abs(m01 + m10) < H) && (Math.abs(m02 + m20) < H) && (Math.abs(m12 + m21) < H) && (Math.abs(m00 + m11 + m22 - 3) < H)) {

					// This singularity is the identity matrix. The angle is zero.
					this.set(1, 0, 0, 0);

				} else {

					// The angle is 180.
					angle = Math.PI;

					xx = (m00 + 1) / 2;
					yy = (m11 + 1) / 2;
					zz = (m22 + 1) / 2;
					xy = (m01 + m10) / 4;
					xz = (m02 + m20) / 4;
					yz = (m12 + m21) / 4;

					if((xx > yy) && (xx > zz)) {

						// m00 is the largest diagonal term.
						if(xx < E) {

							x = 0;
							y = 0.707106781;
							z = 0.707106781;

						} else {

							x = Math.sqrt(xx);
							y = xy / x;
							z = xz / x;

						}

					} else if(yy > zz) {

						// m11 is the largest diagonal term.
						if(yy < E) {

							x = 0.707106781;
							y = 0;
							z = 0.707106781;

						} else {

							y = Math.sqrt(yy);
							x = xy / y;
							z = yz / y;

						}

					} else {

						// m22 is the largest diagonal term.
						if(zz < E) {

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

				// There are no singularities.
				s = Math.sqrt(
					(m21 - m12) * (m21 - m12) +
					(m02 - m20) * (m02 - m20) +
					(m10 - m01) * (m10 - m01)
				);

				// Prevent division by zero.
				if(Math.abs(s) < 0.001) {

					s = 1;

				}

				this.x = (m21 - m12) / s;
				this.y = (m02 - m20) / s;
				this.z = (m10 - m01) / s;
				this.w = Math.acos((m00 + m11 + m22 - 1) / 2);

			}

			return this;

		}

		/**
		 * Adds a vector to this one.
		 *
		 * @param {Vector4} v - The vector to add.
		 * @return {Vector4} This vector.
		 */

		add(v) {

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			this.w += v.w;

			return this;

		}

		/**
		 * Adds a scalar to this vector.
		 *
		 * @param {Number} s - The scalar to add.
		 * @return {Vector4} This vector.
		 */

		addScalar(s) {

			this.x += s;
			this.y += s;
			this.z += s;
			this.w += s;

			return this;

		}

		/**
		 * Sets this vector to the sum of two given vectors.
		 *
		 * @param {Vector4} a - A vector.
		 * @param {Vector4} b - Another vector.
		 * @return {Vector4} This vector.
		 */

		addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;
			this.w = a.w + b.w;

			return this;

		}

		/**
		 * Adds a scaled vector to this one.
		 *
		 * @param {Vector4} v - The vector to scale and add.
		 * @param {Number} s - A scalar.
		 * @return {Vector4} This vector.
		 */

		addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;
			this.w += v.w * s;

			return this;

		}

		/**
		 * Subtracts a vector from this vector.
		 *
		 * @param {Vector4} v - The vector to subtract.
		 * @return {Vector4} This vector.
		 */

		sub(v) {

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
			this.w -= v.w;

			return this;

		}

		/**
		 * Subtracts a scalar from this vector.
		 *
		 * @param {Number} s - The scalar to subtract.
		 * @return {Vector4} This vector.
		 */

		subScalar(s) {

			this.x -= s;
			this.y -= s;
			this.z -= s;
			this.w -= s;

			return this;

		}

		/**
		 * Sets this vector to the difference between two given vectors.
		 *
		 * @param {Vector4} a - A vector.
		 * @param {Vector4} b - A second vector.
		 * @return {Vector4} This vector.
		 */

		subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			this.w = a.w - b.w;

			return this;

		}

		/**
		 * Multiplies this vector with another vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		multiply(v) {

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;
			this.w *= v.w;

			return this;

		}

		/**
		 * Multiplies this vector with a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector4} This vector.
		 */

		multiplyScalar(s) {

			this.x *= s;
			this.y *= s;
			this.z *= s;
			this.w *= s;

			return this;

		}

		/**
		 * Sets this vector to the product of two given vectors.
		 *
		 * @param {Vector4} a - A vector.
		 * @param {Vector4} b - Another vector.
		 * @return {Vector4} This vector.
		 */

		multiplyVectors(a, b) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;
			this.w = a.w * b.w;

			return this;

		}

		/**
		 * Divides this vector by another vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		divide(v) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;
			this.w /= v.w;

			return this;

		}

		/**
		 * Divides this vector by a given scalar.
		 *
		 * @param {Number} s - A scalar.
		 * @return {Vector4} This vector.
		 */

		divideScalar(s) {

			this.x /= s;
			this.y /= s;
			this.z /= s;
			this.w /= s;

			return this;

		}

		/**
		 * Applies a matrix to this vector.
		 *
		 * @param {Matrix4} m - A matrix.
		 * @return {Vector4} This vector.
		 */

		applyMatrix4(m) {

			const x = this.x, y = this.y, z = this.z, w = this.w;
			const e = m.elements;

			this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
			this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
			this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
			this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

			return this;

		}

		/**
		 * Negates this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		negate() {

			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;
			this.w = -this.w;

			return this;

		}

		/**
		 * Calculates the dot product with another vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The dot product.
		 */

		dot(v) {

			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

		}

		/**
		 * Calculates the Manhattan length of this vector.
		 *
		 * @return {Number} The length.
		 */

		manhattanLength() {

			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);

		}

		/**
		 * Calculates the squared length of this vector.
		 *
		 * @return {Number} The squared length.
		 */

		lengthSquared() {

			return (
				this.x * this.x +
				this.y * this.y +
				this.z * this.z +
				this.w * this.w
			);

		}

		/**
		 * Calculates the length of this vector.
		 *
		 * @return {Number} The length.
		 */

		length() {

			return Math.sqrt(
				this.x * this.x +
				this.y * this.y +
				this.z * this.z +
				this.w * this.w
			);

		}

		/**
		 * Calculates the Manhattan distance to a given vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The distance.
		 */

		manhattanDistanceTo(v) {

			return (
				Math.abs(this.x - v.x) +
				Math.abs(this.y - v.y) +
				Math.abs(this.z - v.z) +
				Math.abs(this.w - v.w)
			);

		}

		/**
		 * Calculates the squared distance to a given vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The squared distance.
		 */

		distanceToSquared(v) {

			const dx = this.x - v.x;
			const dy = this.y - v.y;
			const dz = this.z - v.z;
			const dw = this.w - v.w;

			return dx * dx + dy * dy + dz * dz + dw * dw;

		}

		/**
		 * Calculates the distance to a given vector.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Number} The distance.
		 */

		distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));

		}

		/**
		 * Normalizes this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		normalize() {

			return this.divideScalar(this.length());

		}

		/**
		 * Sets the length of this vector.
		 *
		 * @param {Number} length - The new length.
		 * @return {Vector4} This vector.
		 */

		setLength(length) {

			return this.normalize().multiplyScalar(length);

		}

		/**
		 * Adopts the min value for each component of this vector and the given one.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);
			this.z = Math.min(this.z, v.z);
			this.w = Math.min(this.w, v.w);

			return this;

		}

		/**
		 * Adopts the max value for each component of this vector and the given one.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Vector4} This vector.
		 */

		max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);
			this.z = Math.max(this.z, v.z);
			this.w = Math.max(this.w, v.w);

			return this;

		}

		/**
		 * Clamps this vector.
		 *
		 * @param {Vector4} min - The lower bounds. Assumed to be smaller than max.
		 * @param {Vector4} max - The upper bounds. Assumed to be greater than min.
		 * @return {Vector4} This vector.
		 */

		clamp(min, max) {

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));
			this.z = Math.max(min.z, Math.min(max.z, this.z));
			this.w = Math.max(min.w, Math.min(max.w, this.w));

			return this;

		}

		/**
		 * Floors this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.z = Math.floor(this.z);
			this.w = Math.floor(this.w);

			return this;

		}

		/**
		 * Ceils this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			this.z = Math.ceil(this.z);
			this.w = Math.ceil(this.w);

			return this;

		}

		/**
		 * Rounds this vector.
		 *
		 * @return {Vector4} This vector.
		 */

		round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			this.z = Math.round(this.z);
			this.w = Math.round(this.w);

			return this;

		}

		/**
		 * Lerps towards the given vector.
		 *
		 * @param {Vector4} v - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector4} This vector.
		 */

		lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;
			this.z += (v.z - this.z) * alpha;
			this.w += (v.w - this.w) * alpha;

			return this;

		}

		/**
		 * Sets this vector to the lerp result of the given vectors.
		 *
		 * @param {Vector4} v1 - A base vector.
		 * @param {Vector4} v2 - The target vector.
		 * @param {Number} alpha - The lerp factor.
		 * @return {Vector4} This vector.
		 */

		lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		}

		/**
		 * Checks if this vector equals the given one.
		 *
		 * @param {Vector4} v - A vector.
		 * @return {Boolean} Whether this vector equals the given one.
		 */

		equals(v) {

			return (v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w);

		}

	}

	/**
	 * Mathematical data structures.
	 *
	 * @module math-ds
	 */

	/**
	 * An enumeration of pointer buttons.
	 *
	 * @type {Object}
	 * @property {Number} MAIN - The main mouse button, usually the left one.
	 * @property {Number} AUXILIARY - The auxiliary mouse button, usually the middle one.
	 * @property {Number} SECONDARY - The secondary mouse button, usually the right one.
	 */

	const PointerButton = {

		MAIN: 0,
		AUXILIARY: 1,
		SECONDARY: 2

	};

	/**
	 * Two PI.
	 *
	 * @type {Number}
	 * @private
	 */

	const TWO_PI = Math.PI * 2;

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$6 = new Vector3();

	/**
	 * A matrix.
	 *
	 * @type {Matrix4}
	 * @private
	 */

	const m$1 = new Matrix4();

	/**
	 * A rotation manager.
	 */

	class RotationManager {

		/**
		 * Constructs a new rotation manager.
		 *
		 * @param {Vector3} position - A position.
		 * @param {Quaternion} quaternion - A quaternion.
		 * @param {Vector3} target - A target.
		 * @param {Settings} settings - The settings.
		 */

		constructor(position, quaternion, target, settings) {

			/**
			 * The position that will be modified.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.position = position;

			/**
			 * The quaternion that will be modified.
			 *
			 * @type {Quaternion}
			 * @private
			 */

			this.quaternion = quaternion;

			/**
			 * A target.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.target = target;

			/**
			 * The settings.
			 *
			 * @type {Settings}
			 * @private
			 */

			this.settings = settings;

			/**
			 * A spherical coordinate system.
			 *
			 * @type {Spherical}
			 */

			this.spherical = new Spherical();

		}

		/**
		 * Sets the position.
		 *
		 * @param {Vector3} position - A position.
		 * @return {RotationManager} This manager.
		 */

		setPosition(position) {

			this.position = position;

			return this;

		}

		/**
		 * Sets the quaternion.
		 *
		 * @param {Quaternion} quaternion - A quaternion.
		 * @return {RotationManager} This manager.
		 */

		setQuaternion(quaternion) {

			this.quaternion = quaternion;

			return this;

		}

		/**
		 * Sets the target.
		 *
		 * @param {Vector3} target - A target.
		 * @return {RotationManager} This manager.
		 */

		setTarget(target) {

			this.target = target;

			return this;

		}

		/**
		 * Updates the quaternion.
		 *
		 * @return {RotationManager} This manager.
		 */

		updateQuaternion() {

			const settings = this.settings;
			const rotation = settings.rotation;

			if(settings.general.orbit) {

				m$1.lookAt(v$6.subVectors(this.position, this.target), rotation.pivotOffset, rotation.up);

			} else {

				m$1.lookAt(v$6.set(0, 0, 0), this.target.setFromSpherical(this.spherical), rotation.up);

			}

			this.quaternion.setFromRotationMatrix(m$1);

			return this;

		}

		/**
		 * Adjusts the spherical system.
		 *
		 * @param {Number} theta - The angle to add to theta in radians.
		 * @param {Number} phi - The angle to add to phi in radians.
		 * @return {RotationManager} This manager.
		 */

		adjustSpherical(theta, phi) {

			const settings = this.settings;
			const orbit = settings.general.orbit;
			const rotation = settings.rotation;
			const s = this.spherical;

			s.theta = !rotation.invertX ? s.theta - theta : s.theta + theta;
			s.phi = ((orbit || rotation.invertY) && !(orbit && rotation.invertY)) ? s.phi - phi : s.phi + phi;

			// Restrict theta and phi.
			s.theta = Math.min(Math.max(s.theta, rotation.minAzimuthalAngle), rotation.maxAzimuthalAngle);
			s.phi = Math.min(Math.max(s.phi, rotation.minPolarAngle), rotation.maxPolarAngle);
			s.theta %= TWO_PI;
			s.makeSafe();

			if(orbit) {

				// Keep the position up-to-date.
				this.position.setFromSpherical(s).add(this.target);

			}

			return this;

		}

		/**
		 * Zooms in or out.
		 *
		 * @param {Number} sign - The zoom sign. Possible values are [-1, 0, 1].
		 * @return {RotationManager} This manager.
		 */

		zoom(sign) {

			const settings = this.settings;
			const general = settings.general;
			const sensitivity = settings.sensitivity;
			const zoom = settings.zoom;
			const s = this.spherical;

			let amount, min, max;

			if(general.orbit && zoom.enabled) {

				amount = sign * sensitivity.zoom;

				if(zoom.invert) {

					amount = -amount;

				}

				min = Math.max(zoom.minDistance, 1e-6);
				max = Math.min(zoom.maxDistance, Infinity);

				s.radius = Math.min(Math.max(s.radius + amount, min), max);
				this.position.setFromSpherical(s).add(this.target);

			}

			return this;

		}

		/**
		 * Updates rotation calculations based on time.
		 *
		 * @param {Number} delta - The time since the last update in seconds.
		 */

		update(delta) {

		}

		/**
		 * Looks at the given point.
		 *
		 * @param {Vector3} point - The target point.
		 * @return {RotationManager} This manager.
		 */

		lookAt(point) {

			const spherical = this.spherical;
			const position = this.position;
			const target = this.target;

			target.copy(point);

			if(this.settings.general.orbit) {

				v$6.subVectors(position, target);

			} else {

				v$6.subVectors(target, position).normalize();

			}

			spherical.setFromVector3(v$6);
			spherical.radius = Math.max(spherical.radius, 1e-6);
			this.updateQuaternion();

			return this;

		}

		/**
		 * Returns the current view direction.
		 *
		 * @param {Vector3} [view] - A vector to store the direction in. If none is provided, a new vector will be created.
		 * @return {Vector3} The normalized view direction.
		 */

		getViewDirection(view = new Vector3()) {

			view.setFromSpherical(this.spherical).normalize();

			if(this.settings.general.orbit) {

				view.negate();

			}

			return view;

		}

	}

	/**
	 * An collection of movement flags.
	 */

	class MovementState {

		/**
		 * Constructs a new movement state.
		 */

		constructor() {

			/**
			 * Movement to the left.
			 *
			 * @type {Boolean}
			 */

			this.left = false;

			/**
			 * Movement to the right.
			 *
			 * @type {Boolean}
			 */

			this.right = false;

			/**
			 * Forward motion.
			 *
			 * @type {Boolean}
			 */

			this.forward = false;

			/**
			 * Backward motion.
			 *
			 * @type {Boolean}
			 */

			this.backward = false;

			/**
			 * Ascension.
			 *
			 * @type {Boolean}
			 */

			this.up = false;

			/**
			 * Descent.
			 *
			 * @type {Boolean}
			 */

			this.down = false;

		}

		/**
		 * Resets this state.
		 *
		 * @return {MovementState} This state.
		 */

		reset() {

			this.left = false;
			this.right = false;
			this.forward = false;
			this.backward = false;
			this.up = false;
			this.down = false;

			return this;

		}

	}

	/**
	 * The X-axis.
	 *
	 * @type {Vector3}
	 * @ignore
	 */

	const x = new Vector3(1, 0, 0);

	/**
	 * The Y-axis.
	 *
	 * @type {Vector3}
	 * @ignore
	 */

	const y = new Vector3(0, 1, 0);

	/**
	 * The Z-axis.
	 *
	 * @type {Vector3}
	 * @ignore
	 */

	const z = new Vector3(0, 0, 1);

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$7 = new Vector3();

	/**
	 * A translation manager.
	 */

	class TranslationManager {

		/**
		 * Constructs a new translation manager.
		 *
		 * @param {Vector3} position - A position.
		 * @param {Quaternion} quaternion - A quaternion.
		 * @param {Vector3} target - A target.
		 * @param {Settings} settings - The settings.
		 */

		constructor(position, quaternion, target, settings) {

			/**
			 * The position that will be modified.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.position = position;

			/**
			 * The quaternion that will be modified.
			 *
			 * @type {Quaternion}
			 * @private
			 */

			this.quaternion = quaternion;

			/**
			 * A target.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.target = target;

			/**
			 * The settings.
			 *
			 * @type {Settings}
			 * @private
			 */

			this.settings = settings;

			/**
			 * The current movement state.
			 *
			 * @type {MovementState}
			 */

			this.movementState = new MovementState();

		}

		/**
		 * Sets the position.
		 *
		 * @param {Vector3} position - A position.
		 * @return {RotationManager} This manager.
		 */

		setPosition(position) {

			this.position = position;

			return this;

		}

		/**
		 * Sets the quaternion.
		 *
		 * @param {Quaternion} quaternion - A quaternion.
		 * @return {RotationManager} This manager.
		 */

		setQuaternion(quaternion) {

			this.quaternion = quaternion;

			return this;

		}

		/**
		 * Sets the target.
		 *
		 * @param {Vector3} target - A target.
		 * @return {RotationManager} This manager.
		 */

		setTarget(target) {

			this.target = target;

			return this;

		}

		/**
		 * Translates a position by a specific distance along a given axis.
		 *
		 * @private
		 * @param {Vector3} axis - The axis.
		 * @param {Vector3} distance - The distance.
		 */

		translateOnAxis(axis, distance) {

			v$7.copy(axis).applyQuaternion(this.quaternion).multiplyScalar(distance);

			this.position.add(v$7);

			if(this.settings.general.orbit) {

				this.target.add(v$7);

			}

		}

		/**
		 * Modifies the position based on the current movement state and elapsed time.
		 *
		 * @private
		 * @param {Number} delta - The time since the last update in seconds.
		 */

		translate(delta) {

			const sensitivity = this.settings.sensitivity;
			const state = this.movementState;

			const step = delta * sensitivity.translation;

			if(state.backward) {

				this.translateOnAxis(z, step);

			} else if(state.forward) {

				this.translateOnAxis(z, -step);

			}

			if(state.right) {

				this.translateOnAxis(x, step);

			} else if(state.left) {

				this.translateOnAxis(x, -step);

			}

			if(state.up) {

				this.translateOnAxis(y, step);

			} else if(state.down) {

				this.translateOnAxis(y, -step);

			}

		}

		/**
		 * Updates movement calculations based on time.
		 *
		 * @param {Number} delta - The time since the last update in seconds.
		 */

		update(delta) {

			if(this.settings.translation.enabled) {

				this.translate(delta);

			}

		}

		/**
		 * Moves to the given position.
		 *
		 * @param {Vector3} position - The position.
		 * @return {DeltaControls} This instance.
		 */

		moveTo(position) {

			if(this.settings.general.orbit) {

				this.target.copy(position);

			} else {

				this.position.copy(position);

			}

			return this;

		}

	}

	/**
	 * A handler for the KeyCode Proxy.
	 *
	 * @type {Object}
	 * @private
	 */

	const KeyCodeHandler = {

		/**
		 * Handles key code lookups.
		 *
		 * @param {Object} target - The KeyCode enumeration.
		 * @param {String} name - A potential key code identifier.
		 * @return {Number} A key code.
		 */

		get(target, name) {

			return (name in target) ?
				target[name] : (name.length === 1) ?
					name.toUpperCase().charCodeAt(0) : undefined;

		}

	};

	/**
	 * An enumeration of key codes.
	 *
	 * Special keys are listed explicitly. Simple character keys [A-Z] are computed
	 * on demand. For instance, `KeyCode.A` will return the key code for the A key.
	 *
	 * @type {Object}
	 * @property {Number} BACKSPACE - Backspace key.
	 * @property {Number} TAB - Tab key.
	 * @property {Number} ENTER - Enter key.
	 * @property {Number} SHIFT - Shift key.
	 * @property {Number} CTRL - Control key.
	 * @property {Number} ALT - Alt key.
	 * @property {Number} PAUSE - Pause key.
	 * @property {Number} CAPS_LOCK - Caps lock key.
	 * @property {Number} ESCAPE - Escape key.
	 * @property {Number} SPACE - Space bar.
	 * @property {Number} PAGE_UP - Page up key.
	 * @property {Number} PAGE_DOWN - Page down key.
	 * @property {Number} END - End key.
	 * @property {Number} HOME - Home key.
	 * @property {Number} LEFT - Left arrow key.
	 * @property {Number} UP - Up arrow key.
	 * @property {Number} RIGHT - Right arrow key.
	 * @property {Number} DOWN - Down arrow key.
	 * @property {Number} INSERT - Insert key.
	 * @property {Number} DELETE - Delete key.
	 * @property {Number} META_LEFT - Left OS key.
	 * @property {Number} META_RIGHT - Right OS key.
	 * @property {Number} SELECT - Select key.
	 * @property {Number} NUMPAD_0 - Numpad 0 key.
	 * @property {Number} NUMPAD_1 - Numpad 1 key.
	 * @property {Number} NUMPAD_2 - Numpad 2 key.
	 * @property {Number} NUMPAD_3 - Numpad 3 key.
	 * @property {Number} NUMPAD_4 - Numpad 4 key.
	 * @property {Number} NUMPAD_5 - Numpad 5 key.
	 * @property {Number} NUMPAD_6 - Numpad 6 key.
	 * @property {Number} NUMPAD_7 - Numpad 7 key.
	 * @property {Number} NUMPAD_8 - Numpad 8 key.
	 * @property {Number} NUMPAD_9 - Numpad 9 key.
	 * @property {Number} MULTIPLY - Multiply key.
	 * @property {Number} ADD - Add key.
	 * @property {Number} SUBTRACT - Subtract key.
	 * @property {Number} DECIMAL_POINT - Decimal point key.
	 * @property {Number} DIVIDE - Divide key.
	 * @property {Number} F1 - F1 key.
	 * @property {Number} F2 - F2 key.
	 * @property {Number} F3 - F3 key.
	 * @property {Number} F4 - F4 key.
	 * @property {Number} F5 - F5 key.
	 * @property {Number} F6 - F6 key.
	 * @property {Number} F7 - F7 key.
	 * @property {Number} F8 - F8 key.
	 * @property {Number} F9 - F9 key.
	 * @property {Number} F10 - F10 key.
	 * @property {Number} F11 - F11 key.
	 * @property {Number} F12 - F12 key.
	 * @property {Number} NUM_LOCK - Num lock key.
	 * @property {Number} SCROLL_LOCK - Scroll lock key.
	 * @property {Number} SEMICOLON - Semicolon key.
	 * @property {Number} EQUAL_SIGN - Equal sign key.
	 * @property {Number} COMMA - Comma key.
	 * @property {Number} DASH - Dash key.
	 * @property {Number} PERIOD - Period key.
	 * @property {Number} FORWARD_SLASH - Forward slash key.
	 * @property {Number} GRAVE_ACCENT - Grave accent key.
	 * @property {Number} OPEN_BRACKET - Open bracket key.
	 * @property {Number} BACK_SLASH - Back slash key.
	 * @property {Number} CLOSE_BRACKET - Close bracket key.
	 * @property {Number} SINGLE_QUOTE - Single quote key.
	 */

	const KeyCode = new Proxy({

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

	/**
	 * General settings.
	 */

	class GeneralSettings {

		/**
		 * Constructs new general settings.
		 */

		constructor() {

			/**
			 * Indicates whether third person perspective is active.
			 *
			 * Should not be modified directly. See {@link DeltaControls#setOrbit}.
			 *
			 * @type {Boolean}
			 */

			this.orbit = true;

		}

		/**
		 * Copies the given general settings.
		 *
		 * @param {GeneralSettings} settings - General settings.
		 * @return {GeneralSettings} This instance.
		 */

		copy(settings) {

			this.orbit = settings.orbit;

			return this;

		}

		/**
		 * Clones this general settings instance.
		 *
		 * @return {GeneralSettings} The cloned general settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Key bindings.
	 */

	class KeyBindings {

		/**
		 * Constructs new key bindings.
		 */

		constructor() {

			/**
			 * The default key bindings.
			 *
			 * @type {Map}
			 */

			this.defaultActions = new Map();

			/**
			 * The current key bindings.
			 *
			 * @type {Map}
			 */

			this.actions = new Map();

		}

		/**
		 * Resets the current bindings to match the default bindings.
		 *
		 * @return {KeyBindings} This key bindings instance.
		 */

		reset() {

			this.actions = new Map(this.defaultActions);

			return this;

		}

		/**
		 * Establishes default key bindings and resets the current bindings.
		 *
		 * @param {Map} actions - A map of actions. Each key must be a key code and each value must be a number.
		 * @return {KeyBindings} This key bindings instance.
		 */

		setDefault(actions) {

			this.defaultActions = actions;

			return this.reset();

		}

		/**
		 * Copies the given key bindings, including the default bindings.
		 *
		 * @param {KeyBindings} keyBindings - Key bindings.
		 * @return {KeyBindings} This key bindings instance.
		 */

		copy(keyBindings) {

			this.defaultActions = new Map(keyBindings.defaultActions);
			this.actions = new Map(keyBindings.actions);

			return this;

		}

		/**
		 * Clears the default key bindings.
		 *
		 * @return {KeyBindings} This key bindings instance.
		 */

		clearDefault() {

			this.defaultActions.clear();

			return this;

		}

		/**
		 * Clears the current key bindings.
		 *
		 * @return {KeyBindings} This key bindings instance.
		 */

		clear() {

			this.actions.clear();

			return this;

		}

		/**
		 * Clones these key bindings.
		 *
		 * @return {KeyBindings} The cloned key bindings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Checks if the given key is bound to an action.
		 *
		 * @param {KeyCode} keyCode - A key code.
		 * @return {Boolean} Whether the given key is bound to an action.
		 */

		has(keyCode) {

			return this.actions.has(keyCode);

		}

		/**
		 * Returns the action that is bound to the given key.
		 *
		 * @param {KeyCode} keyCode - A key code.
		 * @return {Number} The action, or undefined if the key is not bound to any action.
		 */

		get(keyCode) {

			return this.actions.get(keyCode);

		}

		/**
		 * Binds a key to an action.
		 *
		 * @param {KeyCode} keyCode - A key code.
		 * @param {Number} action - An action.
		 * @return {KeyBindings} This instance.
		 */

		set(keyCode, action) {

			this.actions.set(keyCode, action);

			return this;

		}

		/**
		 * Unbinds a key.
		 *
		 * @param {KeyCode} keyCode - A key code.
		 * @return {Boolean} Whether the key bindings existed or not.
		 */

		delete(keyCode) {

			return this.actions.delete(keyCode);

		}

		/**
		 * Creates a plain representation of this instance.
		 *
		 * @return {String} The plain representation.
		 */

		toJSON() {

			return {
				defaultActions: [...this.defaultActions],
				actions: [...this.actions]
			};

		}

	}

	/**
	 * Pointer settings.
	 */

	class PointerSettings {

		/**
		 * Constructs new pointer settings.
		 */

		constructor() {

			/**
			 * Whether the pointer buttons must be held down to have an effect.
			 *
			 * This setting only applies when the pointer is locked.
			 *
			 * @type {Boolean}
			 */

			this.hold = false;

			/**
			 * Whether the pointer should be locked on click events.
			 *
			 * @type {Boolean}
			 */

			this.lock = true;

		}

		/**
		 * Copies the given pointer settings.
		 *
		 * @param {PointerSettings} settings - Pointer settings.
		 * @return {PointerSettings} This instance.
		 */

		copy(settings) {

			this.hold = settings.hold;
			this.lock = settings.lock;

			return this;

		}

		/**
		 * Clones this pointer settings instance.
		 *
		 * @return {PointerSettings} The cloned pointer settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Rotation settings.
	 */

	class RotationSettings {

		/**
		 * Constructs new rotation settings.
		 */

		constructor() {

			/**
			 * The up vector. Must be normalized.
			 *
			 * @type {Vector3}
			 */

			this.up = new Vector3();
			this.up.copy(y);

			/**
			 * A pivot offset. Only affects third person orbiting.
			 *
			 * @type {Vector3}
			 */

			this.pivotOffset = new Vector3();

			/**
			 * The minimum azimuthal angle in radians. Range: [-Math.PI, Math.PI].
			 *
			 * @type {Number}
			 */

			this.minAzimuthalAngle = -Infinity;

			/**
			 * The maximum azimuthal angle in radians. Range: [-Math.PI, Math.PI].
			 *
			 * @type {Number}
			 */

			this.maxAzimuthalAngle = Infinity;

			/**
			 * The minimum polar angle in radians. Range: [0, Math.PI].
			 *
			 * @type {Number}
			 */

			this.minPolarAngle = 0.0;

			/**
			 * The maximum polar angle in radians. Range: [0, Math.PI].
			 *
			 * @type {Number}
			 */

			this.maxPolarAngle = Math.PI;

			/**
			 * Indicates whether the horizontal rotation should be inverted.
			 *
			 * @type {Boolean}
			 */

			this.invertX = false;

			/**
			 * Indicates whether the vertical rotation should be inverted.
			 *
			 * @type {Boolean}
			 */

			this.invertY = false;

		}

		/**
		 * Copies the given rotation settings.
		 *
		 * @param {RotationSettings} settings - Rotation settings.
		 * @return {RotationSettings} This instance.
		 */

		copy(settings) {

			this.up.copy(settings.up);
			this.pivotOffset.copy(settings.pivotOffset);

			this.minAzimuthalAngle = (settings.minAzimuthalAngle !== null) ? settings.minAzimuthalAngle : -Infinity;
			this.maxAzimuthalAngle = (settings.maxAzimuthalAngle !== null) ? settings.maxAzimuthalAngle : Infinity;

			this.minPolarAngle = settings.minPolarAngle;
			this.maxPolarAngle = settings.maxPolarAngle;

			this.invertX = settings.invertX;
			this.invertY = settings.invertY;

			return this;

		}

		/**
		 * Clones this rotation settings instance.
		 *
		 * @return {RotationSettings} The cloned rotation settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Sensitivity settings.
	 */

	class SensitivitySettings {

		/**
		 * Constructs new sensitivity settings.
		 */

		constructor() {

			/**
			 * The rotation sensitivity.
			 *
			 * @type {Number}
			 */

			this.rotation = 0.0025;

			/**
			 * The translation sensitivity.
			 *
			 * @type {Number}
			 */

			this.translation = 1.0;

			/**
			 * The zoom sensitivity.
			 *
			 * @type {Number}
			 */

			this.zoom = 0.1;

		}

		/**
		 * Copies the given sensitivity settings.
		 *
		 * @param {SensitivitySettings} settings - Sensitivity settings.
		 * @return {SensitivitySettings} This instance.
		 */

		copy(settings) {

			this.rotation = settings.rotation;
			this.translation = settings.translation;
			this.zoom = settings.zoom;

			return this;

		}

		/**
		 * Clones these sensitivity settings.
		 *
		 * @return {SensitivitySettings} The cloned sensitivity settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Translation settings.
	 */

	class TranslationSettings {

		/**
		 * Constructs new translation settings.
		 */

		constructor() {

			/**
			 * Whether positional translation is enabled.
			 *
			 * @type {Boolean}
			 */

			this.enabled = true;

		}

		/**
		 * Copies the given translation settings.
		 *
		 * @param {TranslationSettings} settings - Translation settings.
		 * @return {TranslationSettings} This instance.
		 */

		copy(settings) {

			this.enabled = settings.enabled;

			return this;

		}

		/**
		 * Clones this translation settings instance.
		 *
		 * @return {RotationSettings} The cloned translation settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Zoom settings.
	 */

	class ZoomSettings {

		/**
		 * Constructs new zoom settings.
		 */

		constructor() {

			/**
			 * Whether zooming is enabled.
			 *
			 * @type {Boolean}
			 */

			this.enabled = true;

			/**
			 * Indicates whether the zoom controls should be inverted.
			 *
			 * @type {Boolean}
			 */

			this.invert = false;

			/**
			 * The minimum zoom distance.
			 *
			 * @type {Number}
			 */

			this.minDistance = 1e-6;

			/**
			 * The maximum zoom distance.
			 *
			 * @type {Number}
			 */

			this.maxDistance = Infinity;

		}

		/**
		 * Copies the given zoom settings.
		 *
		 * @param {ZoomSettings} settings - Zoom settings.
		 * @return {ZoomSettings} This instance.
		 */

		copy(settings) {

			this.enabled = settings.enabled;
			this.invert = settings.invert;
			this.minDistance = settings.minDistance;
			this.maxDistance = settings.maxDistance;

			return this;

		}

		/**
		 * Clones this zoom settings instance.
		 *
		 * @return {ZoomSettings} The cloned zoom settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Control settings.
	 */

	class Settings {

		/**
		 * Constructs new settings.
		 */

		constructor() {

			/**
			 * General settings.
			 *
			 * @type {GeneralSettings}
			 */

			this.general = new GeneralSettings();

			/**
			 * Key bindings.
			 *
			 * @type {KeyBindings}
			 */

			this.keyBindings = new KeyBindings();
			this.keyBindings.setDefault(new Map([

				[KeyCode.W, Action.MOVE_FORWARD],
				[KeyCode.UP, Action.MOVE_FORWARD],

				[KeyCode.A, Action.MOVE_LEFT],
				[KeyCode.LEFT, Action.MOVE_LEFT],

				[KeyCode.S, Action.MOVE_BACKWARD],
				[KeyCode.DOWN, Action.MOVE_BACKWARD],

				[KeyCode.D, Action.MOVE_RIGHT],
				[KeyCode.RIGHT, Action.MOVE_RIGHT],

				[KeyCode.X, Action.MOVE_DOWN],
				[KeyCode.SPACE, Action.MOVE_UP],

				[KeyCode.PAGE_DOWN, Action.ZOOM_OUT],
				[KeyCode.PAGE_UP, Action.ZOOM_IN]

			]));

			/**
			 * Pointer settings.
			 *
			 * @type {PointerSettings}
			 */

			this.pointer = new PointerSettings();

			/**
			 * Rotation settings.
			 *
			 * @type {RotationSettings}
			 */

			this.rotation = new RotationSettings();

			/**
			 * Sensitivity settings.
			 *
			 * @type {SensitivitySettings}
			 */

			this.sensitivity = new SensitivitySettings();

			/**
			 * Translation settings.
			 *
			 * @type {TranslationSettings}
			 */

			this.translation = new TranslationSettings();

			/**
			 * Zoom settings.
			 *
			 * @type {ZoomSettings}
			 */

			this.zoom = new ZoomSettings();

		}

		/**
		 * Copies the given settings.
		 *
		 * @param {Settings} settings - Settings.
		 * @return {Settings} This instance.
		 */

		copy(settings) {

			this.general.copy(settings.general);
			this.keyBindings.copy(settings.keyBindings);
			this.pointer.copy(settings.pointer);
			this.rotation.copy(settings.rotation);
			this.sensitivity.copy(settings.sensitivity);
			this.translation.copy(settings.translation);
			this.zoom.copy(settings.zoom);

			return this;

		}

		/**
		 * Clones these settings.
		 *
		 * @return {Settings} The cloned settings.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Saves the current settings in the form of a JSON blob.
		 *
		 * @return {DOMString} A URL to the exported settings.
		 */

		toDataURL() {

			return URL.createObjectURL(new Blob([JSON.stringify(this)], { type: "text/json" }));

		}

	}

	/**
	 * The Strategy interface.
	 */

	class Strategy {

		/**
		 * Executes this strategy.
		 *
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @param {Boolean} flag - A flag.
		 */

		execute(flag) {

			throw new Error("Strategy#execute method not implemented!");

		}

	}

	/**
	 * A movement strategy.
	 */

	class MovementStrategy extends Strategy {

		/**
		 * Constructs a new movement strategy.
		 *
		 * @param {MovementState} movementState - A movement state.
		 * @param {Direction} direction - A direction.
		 */

		constructor(movementState, direction) {

			super();

			/**
			 * A movement state.
			 *
			 * @type {MovementState}
			 * @private
			 */

			this.movementState = movementState;

			/**
			 * A direction.
			 *
			 * @type {Direction}
			 * @private
			 */

			this.direction = direction;

		}

		/**
		 * Executes this strategy.
		 *
		 * @param {Boolean} flag - A flag.
		 */

		execute(flag) {

			const state = this.movementState;

			switch(this.direction) {

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

	}
	/**
	 * An enumeration of movement directions.
	 *
	 * @type {Object}
	 * @property {Number} FORWARD - Move forward.
	 * @property {Number} LEFT - Move left.
	 * @property {Number} BACKWARD - Move backward.
	 * @property {Number} RIGHT - Move right.
	 * @property {Number} DOWN - Move down.
	 * @property {Number} UP - Move up.
	 */

	const Direction = {

		FORWARD: 0,
		LEFT: 1,
		BACKWARD: 2,
		RIGHT: 3,
		DOWN: 4,
		UP: 5

	};

	/**
	 * A zoom strategy.
	 */

	class ZoomStrategy extends Strategy {

		/**
		 * Constructs a new zoom strategy.
		 *
		 * @param {RotationManager} rotationManager - A rotation manager.
		 * @param {Boolean} zoomIn - Whether this strategy should zoom in.
		 */

		constructor(rotationManager, zoomIn) {

			super();

			/**
			 * A rotation manager.
			 *
			 * @type {RotationManager}
			 * @private
			 */

			this.rotationManager = rotationManager;

			/**
			 * Whether this strategy should zoom in.
			 *
			 * @type {Boolean}
			 * @private
			 */

			this.zoomIn = zoomIn;

		}

		/**
		 * Executes this strategy.
		 *
		 * @param {Boolean} flag - A flag.
		 */

		execute(flag) {

			// Only act on key down events.
			if(flag) {

				this.rotationManager.zoom(this.zoomIn ? -1 : 1);

			}

		}

	}

	/**
	 * Movement controls driven by user input.
	 *
	 * @implements {Disposable}
	 * @implements {EventListener}
	 */

	class DeltaControls {

		/**
		 * Constructs new controls.
		 *
		 * @param {Vector3} position - A position.
		 * @param {Quaternion} quaternion - A quaternion.
		 * @param {HTMLElement} [dom=document.body] - A DOM element. Acts as the primary event target.
		 */

		constructor(position = null, quaternion = null, dom = document.body) {

			/**
			 * A DOM element. Acts as the primary event target.
			 *
			 * @type {HTMLElement}
			 * @private
			 */

			this.dom = dom;

			/**
			 * The position that will be modified.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.position = position;

			/**
			 * The quaternion that will be modified.
			 *
			 * @type {Quaternion}
			 * @private
			 */

			this.quaternion = quaternion;

			/**
			 * The target.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.target = new Vector3();

			/**
			 * The control settings.
			 *
			 * @type {Settings}
			 */

			this.settings = new Settings();

			/**
			 * A rotation manager.
			 *
			 * @type {RotationManager}
			 * @private
			 */

			this.rotationManager = new RotationManager(position, quaternion, this.target, this.settings);

			/**
			 * A translation manager.
			 *
			 * @type {TranslationManager}
			 * @private
			 */

			this.translationManager = new TranslationManager(position, quaternion, this.target, this.settings);

			/**
			 * A map that links actions to specific strategies.
			 *
			 * @type {Map}
			 * @private
			 */

			this.strategies = ((rotationManager, translationManager) => {

				const state = translationManager.movementState;

				return new Map([

					[Action.MOVE_FORWARD, new MovementStrategy(state, Direction.FORWARD)],
					[Action.MOVE_LEFT, new MovementStrategy(state, Direction.LEFT)],
					[Action.MOVE_BACKWARD, new MovementStrategy(state, Direction.BACKWARD)],
					[Action.MOVE_RIGHT, new MovementStrategy(state, Direction.RIGHT)],
					[Action.MOVE_DOWN, new MovementStrategy(state, Direction.DOWN)],
					[Action.MOVE_UP, new MovementStrategy(state, Direction.UP)],
					[Action.ZOOM_OUT, new ZoomStrategy(rotationManager, false)],
					[Action.ZOOM_IN, new ZoomStrategy(rotationManager, true)]

				]);

			})(this.rotationManager, this.translationManager);

			/**
			 * A screen position.
			 *
			 * @type {Vector2}
			 * @private
			 */

			this.lastScreenPosition = new Vector2();

			/**
			 * Indicates whether the user is currently holding the pointer button down.
			 *
			 * @type {Boolean}
			 * @private
			 */

			this.dragging = false;

			/**
			 * The internal enabled state.
			 *
			 * @type {Boolean}
			 * @private
			 */

			this.enabled = false;

			if(position !== null && quaternion !== null) {

				this.lookAt(this.target);

				if(dom !== null) {

					this.setEnabled();

				}

			}

		}

		/**
		 * Returns the DOM element.
		 *
		 * @return {HTMLElement} The DOM element.
		 */

		getDom() {

			return this.dom;

		}

		/**
		 * Returns the position.
		 *
		 * @return {Vector3} The position.
		 */

		getPosition() {

			return this.position;

		}

		/**
		 * Returns the quaternion.
		 *
		 * @return {Quaternion} The quaternion.
		 */

		getQuaternion() {

			return this.quaternion;

		}

		/**
		 * Returns the current target.
		 *
		 * @param {Vector3} [target] - A vector to store the target in. If none is provided, a new one will be created.
		 * @return {Vector3} The current target.
		 */

		getTarget(target = new Vector3()) {

			target.copy(this.target);

			if(!this.settings.general.orbit) {

				// The target is relative to the position.
				target.add(this.position);

			}

			return target;

		}

		/**
		 * Returns the current view direction.
		 *
		 * @param {Vector3} [view] - A vector to store the direction in. If none is provided, a new one will be created.
		 * @return {Vector3} The normalized view direction.
		 */

		getViewDirection(view = new Vector3()) {

			return this.rotationManager.getViewDirection(view);

		}

		/**
		 * Sets the DOM element.
		 *
		 * @param {HTMLElement} dom - The new DOM element.
		 * @return {DeltaControls} This instance.
		 */

		setDom(dom) {

			const enabled = this.enabled;

			if(dom !== null) {

				if(enabled) {

					this.setEnabled(false);

				}

				this.dom = dom;
				this.setEnabled(enabled);

			}

			return this;

		}

		/**
		 * Sets the position vector.
		 *
		 * @param {Vector3} position - The new position vector.
		 * @return {DeltaControls} This instance.
		 */

		setPosition(position) {

			this.position = position;
			this.rotationManager.setPosition(position);
			this.translationManager.setPosition(position);

			return this.lookAt(this.target);

		}

		/**
		 * Sets the quaternion.
		 *
		 * @param {Quaternion} quaternion - The new quaternion.
		 * @return {DeltaControls} This instance.
		 */

		setQuaternion(quaternion) {

			this.quaternion = quaternion;
			this.rotationManager.setQuaternion(quaternion);
			this.translationManager.setQuaternion(quaternion);

			return this.lookAt(this.target);

		}

		/**
		 * Sets the target.
		 *
		 * @param {Vector3} target - The new target.
		 * @return {DeltaControls} This instance.
		 */

		setTarget(target) {

			this.target = target;
			this.rotationManager.setTarget(target);
			this.translationManager.setTarget(target);

			return this.lookAt(this.target);

		}

		/**
		 * Changes the control mode to first or third person perspective.
		 *
		 * @param {Boolean} orbit - Whether the third person perspective should be enabled.
		 * @return {DeltaControls} This instance.
		 */

		setOrbitEnabled(orbit) {

			const general = this.settings.general;

			if(general.orbit !== orbit) {

				this.getTarget(this.target);
				general.orbit = orbit;
				this.lookAt(this.target);

			}

			return this;

		}

		/**
		 * Copies the given controls.
		 *
		 * @param {DeltaControls} controls - A controls instance.
		 * @return {DeltaControls} This instance.
		 */

		copy(controls) {

			this.dom = controls.getDom();
			this.position = controls.getPosition();
			this.quaternion = controls.getQuaternion();
			this.target = controls.getTarget();

			this.settings.copy(controls.settings);

			this.rotationManager.setPosition(this.position).setQuaternion(this.quaternion).setTarget(this.target);
			this.translationManager.setPosition(this.position).setQuaternion(this.quaternion).setTarget(this.target);

			return this.lookAt(this.target);

		}

		/**
		 * Clones this instance.
		 *
		 * @return {DeltaControls} the cloned controls.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

		/**
		 * Handles pointer move events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 */

		handlePointerMoveEvent(event) {

			const settings = this.settings;
			const pointer = settings.pointer;
			const sensitivity = settings.sensitivity;
			const rotationManager = this.rotationManager;
			const lastScreenPosition = this.lastScreenPosition;

			let movementX, movementY;

			if(document.pointerLockElement === this.dom) {

				if(!pointer.hold || this.dragging) {

					rotationManager.adjustSpherical(
						event.movementX * sensitivity.rotation,
						event.movementY * sensitivity.rotation
					).updateQuaternion();

				}

			} else {

				// Compensate for inconsistent web APIs.
				movementX = event.screenX - lastScreenPosition.x;
				movementY = event.screenY - lastScreenPosition.y;

				lastScreenPosition.set(event.screenX, event.screenY);

				rotationManager.adjustSpherical(
					movementX * sensitivity.rotation,
					movementY * sensitivity.rotation
				).updateQuaternion();

			}

		}

		/**
		 * Handles touch move events.
		 *
		 * @private
		 * @param {TouchEvent} event - A touch event.
		 */

		handleTouchMoveEvent(event) {

			const sensitivity = this.settings.sensitivity;
			const rotationManager = this.rotationManager;
			const lastScreenPosition = this.lastScreenPosition;
			const touch = event.touches[0];

			// Compensate for inconsistent web APIs.
			const movementX = touch.screenX - lastScreenPosition.x;
			const movementY = touch.screenY - lastScreenPosition.y;

			lastScreenPosition.set(touch.screenX, touch.screenY);

			// Don't produce a mouse move event.
			event.preventDefault();

			rotationManager.adjustSpherical(
				movementX * sensitivity.rotation,
				movementY * sensitivity.rotation
			).updateQuaternion();

		}

		/**
		 * Handles main pointer button events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleMainPointerButton(event, pressed) {

			this.dragging = pressed;

			if(this.settings.pointer.lock) {

				this.setPointerLocked();

			} else {

				if(pressed) {

					this.lastScreenPosition.set(event.screenX, event.screenY);
					this.dom.addEventListener("mousemove", this);

				} else {

					this.dom.removeEventListener("mousemove", this);

				}

			}

		}

		/**
		 * Handles auxiliary pointer button events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleAuxiliaryPointerButton(event, pressed) {

		}

		/**
		 * Handles secondary pointer button events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handleSecondaryPointerButton(event, pressed) {

		}

		/**
		 * Handles pointer events.
		 *
		 * @private
		 * @param {MouseEvent} event - A pointer event.
		 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
		 */

		handlePointerButtonEvent(event, pressed) {

			event.preventDefault();

			switch(event.button) {

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

		/**
		 * Handles touch start and end events.
		 *
		 * @private
		 * @param {TouchEvent} event - A touch event.
		 * @param {Boolean} start - Whether the event is a touch start event.
		 */

		handleTouchEvent(event, start) {

			const touch = event.touches[0];

			// Don't produce mouse events.
			event.preventDefault();

			if(start) {

				this.lastScreenPosition.set(touch.screenX, touch.screenY);
				this.dom.addEventListener("touchmove", this);

			} else {

				this.dom.removeEventListener("touchmove", this);

			}

		}

		/**
		 * Handles keyboard events.
		 *
		 * @private
		 * @param {KeyboardEvent} event - A keyboard event.
		 * @param {Boolean} pressed - Whether the key has been pressed down.
		 */

		handleKeyboardEvent(event, pressed) {

			const keyBindings = this.settings.keyBindings;

			if(keyBindings.has(event.keyCode)) {

				event.preventDefault();

				this.strategies.get(keyBindings.get(event.keyCode)).execute(pressed);

			}

		}

		/**
		 * Handles wheel events.
		 *
		 * @private
		 * @param {WheelEvent} event - A wheel event.
		 */

		handleWheelEvent(event) {

			this.rotationManager.zoom(Math.sign(event.deltaY));

		}

		/**
		 * Enables or disables controls based on the pointer lock state.
		 *
		 * @private
		 */

		handlePointerLockEvent() {

			if(document.pointerLockElement === this.dom) {

				this.dom.addEventListener("mousemove", this);

			} else {

				this.dom.removeEventListener("mousemove", this);

			}

		}

		/**
		 * Handles events.
		 *
		 * @param {Event} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

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

		/**
		 * Updates movement and rotation calculations based on time.
		 *
		 * This method should be called before a new frame is rendered.
		 *
		 * @param {Number} delta - The time since the last update in seconds.
		 */

		update(delta) {

			this.rotationManager.update(delta);
			this.translationManager.update(delta);

		}

		/**
		 * Moves to the given position.
		 *
		 * @param {Vector3} position - The position.
		 * @return {DeltaControls} This instance.
		 */

		moveTo(position) {

			this.rotationManager.moveTo(position);

			return this;

		}

		/**
		 * Looks at the given point.
		 *
		 * @param {Vector3} point - The target point.
		 * @return {DeltaControls} This instance.
		 */

		lookAt(point) {

			this.rotationManager.lookAt(point);

			return this;

		}

		/**
		 * Locks or unlocks the pointer.
		 *
		 * @private
		 * @param {Boolean} [locked=true] - Whether the pointer should be locked.
		 */

		setPointerLocked(locked = true) {

			if(locked) {

				if(document.pointerLockElement !== this.dom && this.dom.requestPointerLock !== undefined) {

					this.dom.requestPointerLock();

				}

			} else if(document.exitPointerLock !== undefined) {

				document.exitPointerLock();

			}

		}

		/**
		 * Enables or disables the controls.
		 *
		 * @param {Boolean} [enabled=true] - Whether the controls should be enabled or disabled.
		 * @return {DeltaControls} This instance.
		 */

		setEnabled(enabled = true) {

			const dom = this.dom;

			this.translationManager.movementState.reset();

			if(enabled && !this.enabled) {

				document.addEventListener("pointerlockchange", this);
				document.body.addEventListener("keyup", this);
				document.body.addEventListener("keydown", this);
				dom.addEventListener("mousedown", this);
				dom.addEventListener("mouseup", this);
				dom.addEventListener("touchstart", this);
				dom.addEventListener("touchend", this);
				dom.addEventListener("wheel", this);

			} else if(!enabled && this.enabled) {

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

		/**
		 * Removes all event listeners and unlocks the pointer.
		 */

		dispose() {

			this.setEnabled(false);

		}

	}

	/**
	 * A collection of core components.
	 *
	 * @module delta-controls/core
	 */

	/**
	 * A collection of classes related to input values.
	 *
	 * @module delta-controls/input
	 */

	/**
	 * A collection of managers.
	 *
	 * @module delta-controls/managers
	 */

	/**
	 * A collection of specialised settings.
	 *
	 * @module delta-controls/settings
	 */

	/**
	 * A collection of control strategies.
	 *
	 * @module delta-controls/strategies
	 */

	/**
	 * Exposure of the library components.
	 *
	 * @module delta-controls
	 */

	/**
	 * The material value for air.
	 *
	 * @type {Material}
	 * @private
	 */

	let air = 0;

	/**
	 * A Hermite data helper.
	 */

	class HermiteDataHelper extends three.Group {

		/**
		 * Constructs a new Hermite data helper.
		 *
		 * @param {Vector3} cellPosition - The position of the volume data cell.
		 * @param {Number} cellSize - The size of the volume data cell.
		 * @param {HermiteData} data - The volume data. Must be uncompressed.
		 * @param {Boolean} [useMaterialIndices=false] - Whether points should be created for solid material indices.
		 * @param {Boolean} [useEdgeData=true] - Whether edges with intersection points and normals should be created.
		 */

		constructor(cellPosition = null, cellSize = 1, data = null, useMaterialIndices = false, useEdgeData = true) {

			super();

			/**
			 * The name of this object.
			 */

			this.name = "HermiteDataHelper";

			/**
			 * The position of the volume data cell.
			 *
			 * @type {Vector3}
			 */

			this.cellPosition = cellPosition;

			/**
			 * The size of the volume data cell.
			 *
			 * @type {Number}
			 */

			this.cellSize = cellSize;

			/**
			 * The volume data.
			 *
			 * @type {HermiteData}
			 */

			this.data = data;

			/**
			 * The material of the grid points.
			 *
			 * @type {PointsMaterial}
			 */

			this.pointsMaterial = new three.PointsMaterial({
				vertexColors: three.VertexColors,
				sizeAttenuation: true,
				size: 0.05
			});

			// Create groups for grid points, edges and normals.
			this.add(new three.Group());
			this.add(new three.Group());
			this.add(new three.Group());

			this.gridPoints.name = "GridPoints";
			this.edges.name = "Edges";
			this.normals.name = "Normals";

			try {

				// Attempt to update right away.
				this.update(useMaterialIndices, useEdgeData);

			} catch(e) {

				// Don't complain on error.

			}

		}

		/**
		 * The grid points.
		 *
		 * @type {Group}
		 */

		get gridPoints() {

			return this.children[0];

		}

		/**
		 * The edges.
		 *
		 * @type {Group}
		 */

		get edges() {

			return this.children[1];

		}

		/**
		 * The normals.
		 *
		 * @type {Group}
		 */

		get normals() {

			return this.children[2];

		}

		/**
		 * Checks if the current position, size and data is valid.
		 *
		 * @private
		 * @return {Error} An error, or null if the data is valid.
		 */

		validate() {

			let error = null;

			if(this.cellPosition === null) {

				error = new Error("The cell position is not defined");

			} else if(this.cellSize <= 0) {

				error = new Error("Invalid cell size: " + this.cellSize);

			} else if(this.data === null) {

				error = new Error("No data");

			} else {

				if(this.data.empty) {

					error = new Error("The provided data is empty");

				}

				if(this.data.compressed) {

					error = new Error("The provided data must be uncompressed");

				}

			}

			return error;

		}

		/**
		 * Sets the cell position, size and data.
		 *
		 * @param {Vector3} cellPosition - The position of the volume data cell.
		 * @param {Number} cellSize - The size of the volume data cell.
		 * @param {HermiteData} data - The volume data. Must be uncompressed.
		 * @return {HermiteDataHelper} This helper.
		 */

		set(cellPosition, cellSize, data) {

			this.cellPosition = cellPosition;
			this.cellSize = cellSize;
			this.data = data;

			return this;

		}

		/**
		 * Creates the helper geometry.
		 *
		 * @throws {Error} Throws an error if the current cell position, cell size or data is invalid.
		 * @param {Boolean} [useMaterialIndices=false] - Whether points should be created for solid material indices.
		 * @param {Boolean} [useEdgeData=true] - Whether edges with intersection points and normals should be created.
		 * @return {HermiteDataHelper} This helper.
		 */

		update(useMaterialIndices = false, useEdgeData = true) {

			const data = this.data;
			const error = this.validate();

			// Remove existing geometry.
			this.dispose();

			if(error !== null) {

				throw error;

			} else {

				if(useMaterialIndices) {

					this.createPoints(data);

				}

				if(useEdgeData && data.edgeData !== null) {

					this.createEdges(data);

				}

			}

			return this;

		}

		/**
		 * Creates points for solid material indices.
		 *
		 * @private
		 * @param {HermiteData} data - Volume data.
		 */

		createPoints(data) {

			const materialIndices = data.materialIndices;
			const n = Math.cbrt(materialIndices.length) - 1;
			const s = this.cellSize;

			const base = this.cellPosition;
			const offset = new three.Vector3();
			const position = new three.Vector3();

			const color = new Float32Array([0.0, 0.0, 0.0]);

			const geometry = new three.BufferGeometry();
			const vertexCount = data.materials;
			const positions = new Float32Array(vertexCount * 3);
			const colors = new Float32Array(vertexCount * 3);

			let x, y, z;
			let i, j;

			for(i = 0, j = 0, z = 0; z <= n; ++z) {

				offset.z = z * s / n;

				for(y = 0; y <= n; ++y) {

					offset.y = y * s / n;

					for(x = 0; x <= n; ++x) {

						offset.x = x * s / n;

						if(materialIndices[i++] !== air) {

							position.addVectors(base, offset);

							positions[j] = position.x; colors[j++] = color[0];
							positions[j] = position.y; colors[j++] = color[1];
							positions[j] = position.z; colors[j++] = color[2];

						}

					}

				}

			}

			geometry.addAttribute("position", new three.BufferAttribute(positions, 3));
			geometry.addAttribute("color", new three.BufferAttribute(colors, 3));

			this.gridPoints.add(new three.Points(geometry, this.pointsMaterial));

		}

		/**
		 * Creates edges with intersection points and normals.
		 *
		 * @private
		 * @param {HermiteData} data - Volume data.
		 */

		createEdges(data) {

			const edgeData = data.edgeData;
			const n = Math.cbrt(data.materialIndices.length) - 1;
			const s = this.cellSize;

			const normalA = new three.Vector3();
			const normalB = new three.Vector3();

			const edgeIterators = [
				edgeData.edgesX(this.cellPosition, this.cellSize),
				edgeData.edgesY(this.cellPosition, this.cellSize),
				edgeData.edgesZ(this.cellPosition, this.cellSize)
			];

			const axisColors = [
				new Float32Array([0.6, 0.0, 0.0]),
				new Float32Array([0.0, 0.6, 0.0]),
				new Float32Array([0.0, 0.0, 0.6])
			];

			const normalColor = new Float32Array([0.0, 1.0, 1.0]);

			const lineSegmentsMaterial = new three.LineBasicMaterial({
				vertexColors: three.VertexColors
			});

			let edgePositions, edgeColors;
			let normalPositions, normalColors;
			let vertexCount, edgeColor, geometry, edges, edge;

			let d, i, j;

			for(i = 0, j = 0, d = 0; d < 3; ++d, i = 0, j = 0) {

				edgeColor = axisColors[d];
				edges = edgeIterators[d];

				// Are there any edges for this dimension?
				if(edges.lengths.length > 0) {

					// There can only be one lengths entry per iterator.
					vertexCount = edges.lengths[0] * 2;

					edgePositions = new Float32Array(vertexCount * 3);
					edgeColors = new Float32Array(vertexCount * 3);
					normalPositions = new Float32Array(vertexCount * 3);
					normalColors = new Float32Array(vertexCount * 3);

					for(edge of edges) {

						// Edge.
						edgePositions[i] = edge.a.x; edgeColors[i++] = edgeColor[0];
						edgePositions[i] = edge.a.y; edgeColors[i++] = edgeColor[1];
						edgePositions[i] = edge.a.z; edgeColors[i++] = edgeColor[2];

						edgePositions[i] = edge.b.x; edgeColors[i++] = edgeColor[0];
						edgePositions[i] = edge.b.y; edgeColors[i++] = edgeColor[1];
						edgePositions[i] = edge.b.z; edgeColors[i++] = edgeColor[2];

						// Normal at Zero Crossing.
						edge.computeZeroCrossingPosition(normalA);
						normalB.copy(normalA).addScaledVector(edge.n, 0.25 * s / n);

						normalPositions[j] = normalA.x; normalColors[j++] = normalColor[0];
						normalPositions[j] = normalA.y; normalColors[j++] = normalColor[1];
						normalPositions[j] = normalA.z; normalColors[j++] = normalColor[2];

						normalPositions[j] = normalB.x; normalColors[j++] = normalColor[0];
						normalPositions[j] = normalB.y; normalColors[j++] = normalColor[1];
						normalPositions[j] = normalB.z; normalColors[j++] = normalColor[2];

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

		/**
		 * Destroys the current helper geometry.
		 */

		dispose() {

			let child, children;
			let i, l;

			for(i = 0, l = this.children.length; i < l; ++i) {

				child = this.children[i];
				children = child.children;

				while(children.length > 0) {

					children[0].geometry.dispose();
					children[0].material.dispose();
					child.remove(children[0]);

				}

			}

		}

		/**
		 * Sets the material value for grid points that represent air.
		 *
		 * @type {Material}
		 */

		static set air(value) {

			air = value;

		}

	}

	/**
	 * Exposure of the library components.
	 *
	 * @module hermite-data-helper
	 */

	/**
	 * An octree helper.
	 */

	class OctreeHelper extends three.Group {

		/**
		 * Constructs a new octree helper.
		 *
		 * @param {Octree} [octree=null] - An octree.
		 */

		constructor(octree = null) {

			super();

			/**
			 * The name of this object.
			 */

			this.name = "OctreeHelper";

			/**
			 * The octree.
			 *
			 * @type {Octree}
			 */

			this.octree = octree;

			this.update();

		}

		/**
		 * Creates octant geometry.
		 *
		 * @private
		 * @param {Iterator} octants - An octant iterator.
		 * @param {Number} octantCount - The size of the given sequence.
		 */

		createLineSegments(octants, octantCount) {

			const maxOctants = (Math.pow(2, 16) / 8) - 1;
			const group = new three.Group();

			const material = new three.LineBasicMaterial({
				color: 0xffffff * Math.random()
			});

			let result;
			let vertexCount;
			let length;

			let indices, positions;
			let octant, min, max;
			let geometry;

			let i, j, c, d, n;
			let corner, edge;

			// Create geometry in multiple runs to limit the amount of vertices.
			for(i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

				length += (octantCount < maxOctants) ? octantCount : maxOctants;
				octantCount -= maxOctants;

				vertexCount = length * 8;
				indices = new Uint16Array(vertexCount * 3);
				positions = new Float32Array(vertexCount * 3);

				// Continue where the previous run left off.
				for(c = 0, d = 0, result = octants.next(); !result.done && i < length;) {

					octant = result.value;
					min = octant.min;
					max = octant.max;

					// Create line connections based on the current vertex count.
					for(j = 0; j < 12; ++j) {

						edge = edges[j];

						indices[d++] = c + edge[0];
						indices[d++] = c + edge[1];

					}

					// Create the vertices.
					for(j = 0; j < 8; ++j, ++c) {

						corner = corners[j];

						positions[c * 3] = (corner[0] === 0) ? min.x : max.x;
						positions[c * 3 + 1] = (corner[1] === 0) ? min.y : max.y;
						positions[c * 3 + 2] = (corner[2] === 0) ? min.z : max.z;

					}

					if(++i < length) {

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

		/**
		 * Updates the helper geometry.
		 */

		update() {

			const depth = (this.octree !== null) ? this.octree.getDepth() : -1;

			let level = 0;
			let result;

			// Remove existing geometry.
			this.dispose();

			while(level <= depth) {

				result = this.octree.findOctantsByLevel(level);

				this.createLineSegments(
					result[Symbol.iterator](),
					(typeof result.size === "number") ? result.size : result.length
				);

				++level;

			}

		}

		/**
		 * Destroys this helper.
		 */

		dispose() {

			const groups = this.children;

			let group, children;
			let i, j, il, jl;

			for(i = 0, il = groups.length; i < il; ++i) {

				group = groups[i];
				children = group.children;

				for(j = 0, jl = children.length; j < jl; ++j) {

					children[j].geometry.dispose();
					children[j].material.dispose();

				}

				while(children.length > 0) {

					group.remove(children[0]);

				}

			}

			while(groups.length > 0) {

				this.remove(groups[0]);

			}

		}

	}

	/**
	 * A binary pattern that describes the corners of an octant:
	 *
	 * ```text
	 *    3____7
	 *  2/___6/|
	 *  | 1__|_5
	 *  0/___4/
	 * ```
	 *
	 * @type {Uint8Array[]}
	 */

	const corners = [

		new Uint8Array([0, 0, 0]),
		new Uint8Array([0, 0, 1]),
		new Uint8Array([0, 1, 0]),
		new Uint8Array([0, 1, 1]),

		new Uint8Array([1, 0, 0]),
		new Uint8Array([1, 0, 1]),
		new Uint8Array([1, 1, 0]),
		new Uint8Array([1, 1, 1])

	];

	/**
	 * Describes all possible octant corner connections.
	 *
	 * @type {Uint8Array[]}
	 */

	const edges = [

		// X-Axis.
		new Uint8Array([0, 4]),
		new Uint8Array([1, 5]),
		new Uint8Array([2, 6]),
		new Uint8Array([3, 7]),

		// Y-Axis.
		new Uint8Array([0, 2]),
		new Uint8Array([1, 3]),
		new Uint8Array([4, 6]),
		new Uint8Array([5, 7]),

		// Z-Axis.
		new Uint8Array([0, 1]),
		new Uint8Array([2, 3]),
		new Uint8Array([4, 5]),
		new Uint8Array([6, 7])

	];

	/**
	 * Exposure of the library components.
	 *
	 * @module octree-helper
	 */

	/**
	 * The Serializable contract.
	 *
	 * Implemented by objects that can provide a flat representation of the data
	 * they contain.
	 *
	 * @interface
	 */

	/**
	 * The Deserializable contract.
	 *
	 * Implemented by objects that can adopt serialised data.
	 *
	 * @interface
	 */

	/**
	 * The Disposable contract.
	 *
	 * Implemented by objects that can free internal resources.
	 *
	 * @interface
	 */

	/**
	 * The TransferableContainer contract.
	 *
	 * Implemented by objects that can list their internal transferable objects.
	 *
	 * @interface
	 */

	/**
	 * A FIFO queue.
	 *
	 * Elements are added to the end of the queue and removed from the front.
	 *
	 * Based on:
	 *  http://code.stephenmorley.org/javascript/queues/
	 */

	/**
	 * An enumeration of CSG operation types.
	 *
	 * @type {Object}
	 * @property {String} UNION - Indicates a union of volume data.
	 * @property {String} DIFFERENCE - Indicates a subtraction of volume data.
	 * @property {String} INTERSECTION - Indicates an intersection of volume data.
	 * @property {String} DENSITY_FUNCTION - Indicates volume data generation.
	 */

	const OperationType = {

		UNION: "csg.union",
		DIFFERENCE: "csg.difference",
		INTERSECTION: "csg.intersection",
		DENSITY_FUNCTION: "csg.densityfunction"

	};

	/**
	 * An enumeration of material constants.
	 *
	 * @type {Object}
	 * @property {Number} AIR - Indicates empty space.
	 * @property {Number} SOLID - Indicates solid material.
	 */

	const Material = {

		AIR: 0,
		SOLID: 1

	};

	/**
	 * A CSG operation.
	 */

	class Operation {

		/**
		 * Constructs a new operation.
		 *
		 * @param {OperationType} type - The type of this operation.
		 * @param {Operation} ...children - Child operations.
		 */

		constructor(type, ...children) {

			/**
			 * The type of this operation.
			 *
			 * @type {OperationType}
			 */

			this.type = type;

			/**
			 * A list of operations.
			 *
			 * Right-hand side operands have precedence, meaning that the result of the
			 * first item in the list will be dominated by the result of the second one,
			 * etc.
			 *
			 * @type {Operation[]}
			 * @private
			 */

			this.children = children;

			/**
			 * The bounding box of this operation.
			 *
			 * @type {Box3}
			 * @private
			 */

			this.boundingBox = null;

		}

		/**
		 * Calculates the complete bounding box of this CSG operation if it doesn't
		 * exist yet and returns it.
		 *
		 * @return {Box3} The bounding box.
		 */

		getBoundingBox() {

			if(this.boundingBox === null) {

				this.boundingBox = this.computeBoundingBox();

			}

			return this.boundingBox;

		}

		/**
		 * Calculates the bounding box of this CSG operation while taking all child
		 * operations into account.
		 *
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			const children = this.children;
			const boundingBox = new Box3();

			let i, l;

			for(i = 0, l = children.length; i < l; ++i) {

				boundingBox.union(children[i].getBoundingBox());

			}

			return boundingBox;

		}

	}

	/**
	 * A union operation.
	 */

	class Union extends Operation {

		/**
		 * Constructs a new union operation.
		 *
		 * @param {...Operation} children - Child operations.
		 */

		constructor(...children) {

			super(OperationType.UNION, ...children);

		}

		/**
		 * Updates the specified material index.
		 *
		 * @param {Number} index - The index of the material index that needs to be updated.
		 * @param {HermiteData} data0 - The target volume data.
		 * @param {HermiteData} data1 - Predominant volume data.
		 */

		updateMaterialIndex(index, data0, data1) {

			const materialIndex = data1.materialIndices[index];

			if(materialIndex !== Material.AIR) {

				data0.setMaterialIndex(index, materialIndex);

			}

		}

		/**
		 * Selects the edge that is closer to the non-solid grid point.
		 *
		 * @param {Edge} edge0 - An existing edge.
		 * @param {Edge} edge1 - A predominant edge.
		 * @param {Boolean} s - Whether the starting point of the edge is solid.
		 * @return {Edge} The selected edge.
		 */

		selectEdge(edge0, edge1, s) {

			return s ?
				((edge0.t > edge1.t) ? edge0 : edge1) :
				((edge0.t < edge1.t) ? edge0 : edge1);

		}

	}

	/**
	 * A difference operation.
	 */

	class Difference extends Operation {

		/**
		 * Constructs a new difference operation.
		 *
		 * @param {Operation} ...children - Child operations.
		 */

		constructor(...children) {

			super(OperationType.DIFFERENCE, ...children);

		}

		/**
		 * Updates the specified material index.
		 *
		 * @param {Number} index - The index of the material index that needs to be updated.
		 * @param {HermiteData} data0 - The target volume data.
		 * @param {HermiteData} data1 - Predominant volume data.
		 */

		updateMaterialIndex(index, data0, data1) {

			if(data1.materialIndices[index] !== Material.AIR) {

				data0.setMaterialIndex(index, Material.AIR);

			}

		}

		/**
		 * Selects the edge that is closer to the solid grid point.
		 *
		 * @param {Edge} edge0 - An existing edge.
		 * @param {Edge} edge1 - A predominant edge.
		 * @param {Boolean} s - Whether the starting point of the edge is solid.
		 * @return {Edge} The selected edge.
		 */

		selectEdge(edge0, edge1, s) {

			return s ?
				((edge0.t < edge1.t) ? edge0 : edge1) :
				((edge0.t > edge1.t) ? edge0 : edge1);

		}

	}

	/**
	 * An intersection operation.
	 */

	class Intersection extends Operation {

		/**
		 * Constructs a new intersection operation.
		 *
		 * @param {...Operation} children - Child operations.
		 */

		constructor(...children) {

			super(OperationType.INTERSECTION, ...children);

		}

		/**
		 * Updates the specified material index.
		 *
		 * @param {Number} index - The index of the material index that needs to be updated.
		 * @param {HermiteData} data0 - The target volume data.
		 * @param {HermiteData} data1 - Predominant volume data.
		 */

		updateMaterialIndex(index, data0, data1) {

			const materialIndex = data1.materialIndices[index];

			data0.setMaterialIndex(index, (data0.materialIndices[index] !== Material.AIR && materialIndex !== Material.AIR) ? materialIndex : Material.AIR);

		}

		/**
		 * Selects the edge that is closer to the solid grid point.
		 *
		 * @param {Edge} edge0 - An existing edge.
		 * @param {Edge} edge1 - A predominant edge.
		 * @param {Boolean} s - Whether the starting point of the edge is solid.
		 * @return {Edge} The selected edge.
		 */

		selectEdge(edge0, edge1, s) {

			return s ?
				((edge0.t < edge1.t) ? edge0 : edge1) :
				((edge0.t > edge1.t) ? edge0 : edge1);

		}

	}

	/**
	 * Run-Length Encoding for numerical data.
	 */

	class RunLengthEncoding {

		/**
		 * Constructs a new container for Run-Length encoded data.
		 *
		 * @param {Number[]} [runLengths=null] - The run lengths.
		 * @param {Number[]} [data=null] - The encoded data.
		 */

		constructor(runLengths = null, data = null) {

			/**
			 * The run lengths.
			 *
			 * @type {Number[]}
			 */

			this.runLengths = runLengths;

			/**
			 * The encoded data.
			 *
			 * @type {Number[]}
			 */

			this.data = data;

		}

		/**
		 * Encodes the given data.
		 *
		 * @param {Number[]} array - The data to encode.
		 * @return {RunLengthEncoding} The run-lengths and the encoded data.
		 */

		static encode(array) {

			const runLengths = [];
			const data = [];

			let previous = array[0];
			let count = 1;

			let i, l;

			for(i = 1, l = array.length; i < l; ++i) {

				if(previous !== array[i]) {

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

		/**
		 * Decodes the given data.
		 *
		 * @param {Number[]} runLengths - The run-lengths.
		 * @param {Number[]} data - The data to decode.
		 * @param {Array} [array] - An optional target.
		 * @return {Array} The decoded data.
		 */

		static decode(runLengths, data, array = []) {

			let element;

			let i, j, il, jl;
			let k = 0;

			for(i = 0, il = data.length; i < il; ++i) {

				element = data[i];

				for(j = 0, jl = runLengths[i]; j < jl; ++j) {

					array[k++] = element;

				}

			}

			return array;

		}

	}

	/**
	 * A basic iterator result.
	 *
	 * The next method of an iterator always has to return an object with
	 * appropriate properties including done and value.
	 */

	class IteratorResult {

		/**
		 * Constructs a new iterator result.
		 *
		 * @param {Vector3} [value=null] - A value.
		 * @param {Vector3} [done=false] - Whether this result is past the end of the iterated sequence.
		 */

		constructor(value = null, done = false) {

			/**
			 * An arbitrary value returned by the iterator.
			 *
			 * @type {Object}
			 */

			this.value = value;

			/**
			 * Whether this result is past the end of the iterated sequence.
			 *
			 * @type {Boolean}
			 */

			this.done = done;

		}

		/**
		 * Resets this iterator result.
		 */

		reset() {

			this.value = null;
			this.done = false;

		}

	}

	/**
	 * A compilation of the library components.
	 *
	 * @module iterator-result
	 */

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const c$1 = new Vector3();

	/**
	 * An octant.
	 */

	class Octant {

		/**
		 * Constructs a new octant.
		 *
		 * @param {Vector3} [min] - The lower bounds.
		 * @param {Vector3} [max] - The upper bounds.
		 */

		constructor(min = new Vector3(), max = new Vector3()) {

			/**
			 * The lower bounds of this octant.
			 *
			 * @type {Vector3}
			 */

			this.min = min;

			/**
			 * The upper bounds of the octant.
			 *
			 * @type {Vector3}
			 */

			this.max = max;

			/**
			 * The children of this octant.
			 *
			 * @type {Octant[]}
			 * @default null
			 */

			this.children = null;

		}

		/**
		 * Computes the center of this octant.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the center of this octant.
		 */

		getCenter(target = new Vector3()) {

			return target.addVectors(this.min, this.max).multiplyScalar(0.5);

		}

		/**
		 * Computes the size of this octant.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the size of this octant.
		 */

		getDimensions(target = new Vector3()) {

			return target.subVectors(this.max, this.min);

		}

		/**
		 * Splits this octant into eight smaller ones.
		 */

		split() {

			const min = this.min;
			const max = this.max;
			const mid = this.getCenter(c$1);

			const children = this.children = [

				null, null,
				null, null,
				null, null,
				null, null

			];

			let i, combination;

			for(i = 0; i < 8; ++i) {

				combination = pattern[i];

				children[i] = new this.constructor(

					new Vector3(
						(combination[0] === 0) ? min.x : mid.x,
						(combination[1] === 0) ? min.y : mid.y,
						(combination[2] === 0) ? min.z : mid.z
					),

					new Vector3(
						(combination[0] === 0) ? mid.x : max.x,
						(combination[1] === 0) ? mid.y : max.y,
						(combination[2] === 0) ? mid.z : max.z
					)

				);

			}

		}

	}

	/**
	 * A binary pattern that describes the standard octant layout:
	 *
	 * ```text
	 *    3____7
	 *  2/___6/|
	 *  | 1__|_5
	 *  0/___4/
	 * ```
	 *
	 * This common layout is crucial for positional assumptions.
	 *
	 * @type {Uint8Array[]}
	 */

	const pattern = [

		new Uint8Array([0, 0, 0]),
		new Uint8Array([0, 0, 1]),
		new Uint8Array([0, 1, 0]),
		new Uint8Array([0, 1, 1]),

		new Uint8Array([1, 0, 0]),
		new Uint8Array([1, 0, 1]),
		new Uint8Array([1, 1, 0]),
		new Uint8Array([1, 1, 1])

	];

	/**
	 * Describes all possible octant corner connections.
	 *
	 * @type {Uint8Array[]}
	 */

	const edges$1 = [

		// X-Axis.
		new Uint8Array([0, 4]),
		new Uint8Array([1, 5]),
		new Uint8Array([2, 6]),
		new Uint8Array([3, 7]),

		// Y-Axis.
		new Uint8Array([0, 2]),
		new Uint8Array([1, 3]),
		new Uint8Array([4, 6]),
		new Uint8Array([5, 7]),

		// Z-Axis.
		new Uint8Array([0, 1]),
		new Uint8Array([2, 3]),
		new Uint8Array([4, 5]),
		new Uint8Array([6, 7])

	];

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const c$2 = new Vector3();

	/**
	 * A cubic octant.
	 */

	class CubicOctant {

		/**
		 * Constructs a new cubic octant.
		 *
		 * @param {Vector3} [min] - The lower bounds.
		 * @param {Number} [size=0] - The size of the octant.
		 */

		constructor(min = new Vector3(), size = 0) {

			/**
			 * The lower bounds of this octant.
			 *
			 * @type {Vector3}
			 */

			this.min = min;

			/**
			 * The size of this octant.
			 *
			 * @type {Number}
			 */

			this.size = size;

			/**
			 * The children of this octant.
			 *
			 * @type {CubicOctant[]}
			 * @default null
			 */

			this.children = null;

		}

		/**
		 * The upper bounds of this octant.
		 *
		 * Accessing this property always creates a new vector.
		 *
		 * @type {Vector3}
		 */

		get max() {

			return this.min.clone().addScalar(this.size);

		}

		/**
		 * Computes the center of this octant.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the center of this octant.
		 */

		getCenter(target = new Vector3()) {

			return target.copy(this.min).addScalar(this.size * 0.5);

		}

		/**
		 * Returns the size of this octant as a vector.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the size of this octant.
		 */

		getDimensions(target = new Vector3()) {

			return target.set(this.size, this.size, this.size);

		}

		/**
		 * Splits this octant into eight smaller ones.
		 */

		split() {

			const min = this.min;
			const mid = this.getCenter(c$2);
			const halfSize = this.size * 0.5;

			const children = this.children = [

				null, null,
				null, null,
				null, null,
				null, null

			];

			let i, combination;

			for(i = 0; i < 8; ++i) {

				combination = pattern[i];

				children[i] = new this.constructor(

					new Vector3(
						(combination[0] === 0) ? min.x : mid.x,
						(combination[1] === 0) ? min.y : mid.y,
						(combination[2] === 0) ? min.z : mid.z
					),

					halfSize

				);

			}

		}

	}

	/**
	 * A 3D box.
	 *
	 * @type {Box3}
	 * @private
	 */

	const b$3 = new Box3();

	/**
	 * An octant iterator.
	 *
	 * @implements {Iterator}
	 * @implements {Iterable}
	 */

	class OctantIterator {

		/**
		 * Constructs a new octant iterator.
		 *
		 * @param {Octree} octree - An octree.
		 * @param {Frustum|Box3} [region=null] - A cull region.
		 */

		constructor(octree, region = null) {

			/**
			 * The octree.
			 *
			 * @type {Octree}
			 * @private
			 */

			this.octree = octree;

			/**
			 * A region used for octree culling.
			 *
			 * @type {Frustum|Box3}
			 */

			this.region = region;

			/**
			 * Whether this iterator should respect the cull region.
			 *
			 * @type {Boolean}
			 */

			this.cull = (region !== null);

			/**
			 * An iterator result.
			 *
			 * @type {IteratorResult}
			 * @private
			 */

			this.result = new IteratorResult();

			/**
			 * An octant trace.
			 *
			 * @type {Octant[]}
			 * @private
			 */

			this.trace = null;

			/**
			 * Iteration indices.
			 *
			 * @type {Number[]}
			 * @private
			 */

			this.indices = null;

			this.reset();

		}

		/**
		 * Resets this iterator.
		 *
		 * @return {OctantIterator} This iterator.
		 */

		reset() {

			const root = this.octree.root;

			this.trace = [];
			this.indices = [];

			if(root !== null) {

				b$3.min = root.min;
				b$3.max = root.max;

				if(!this.cull || this.region.intersectsBox(b$3)) {

					this.trace.push(root);
					this.indices.push(0);

				}

			}

			this.result.reset();

			return this;

		}

		/**
		 * Iterates over the leaf octants.
		 *
		 * @return {IteratorResult} The next leaf octant.
		 */

		next() {

			const cull = this.cull;
			const region = this.region;
			const indices = this.indices;
			const trace = this.trace;

			let octant = null;
			let depth = trace.length - 1;

			let index, children, child;

			while(octant === null && depth >= 0) {

				index = indices[depth]++;
				children = trace[depth].children;

				if(index < 8) {

					if(children !== null) {

						child = children[index];

						if(cull) {

							b$3.min = child.min;
							b$3.max = child.max;

							if(!region.intersectsBox(b$3)) {

								// Cull this octant.
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
			this.result.done = (octant === null);

			return this.result;

		}

		/**
		 * Called when this iterator will no longer be run to completion.
		 *
		 * @param {Object} value - An interator result value.
		 * @return {IteratorResult} - A premature completion result.
		 */

		return(value) {

			this.result.value = value;
			this.result.done = true;

			return this.result;

		}

		/**
		 * Returns this iterator.
		 *
		 * @return {OctantIterator} An iterator.
		 */

		[Symbol.iterator]() {

			return this;

		}

	}

	/**
	 * A list of vectors.
	 *
	 * @type {Vector3[]}
	 * @private
	 * @final
	 */

	const v$8 = [
		new Vector3(),
		new Vector3(),
		new Vector3()
	];

	/**
	 * A box.
	 *
	 * @type {Box3}
	 * @private
	 * @final
	 */

	const b$4 = new Box3();

	/**
	 * A ray.
	 *
	 * @type {Ray}
	 * @private
	 * @final
	 */

	const r = new Ray();

	/**
	 * A lookup-table containing octant ids. Used to determine the exit plane from
	 * an octant.
	 *
	 * @type {Uint8Array[]}
	 * @private
	 * @final
	 */

	const octantTable = [

		new Uint8Array([4, 2, 1]),
		new Uint8Array([5, 3, 8]),
		new Uint8Array([6, 8, 3]),
		new Uint8Array([7, 8, 8]),
		new Uint8Array([8, 6, 5]),
		new Uint8Array([8, 7, 8]),
		new Uint8Array([8, 8, 7]),
		new Uint8Array([8, 8, 8])

	];

	/**
	 * A byte that stores raycasting flags.
	 *
	 * @type {Number}
	 * @private
	 */

	let flags = 0;

	/**
	 * Finds the entry plane of the first octant that a ray travels through.
	 *
	 * Determining the first octant requires knowing which of the t0s is the
	 * largest. The tms of the other axes must also be compared against that
	 * largest t0.
	 *
	 * @private
	 * @param {Number} tx0 - Ray projection parameter.
	 * @param {Number} ty0 - Ray projection parameter.
	 * @param {Number} tz0 - Ray projection parameter.
	 * @param {Number} txm - Ray projection parameter mean.
	 * @param {Number} tym - Ray projection parameter mean.
	 * @param {Number} tzm - Ray projection parameter mean.
	 * @return {Number} The index of the first octant that the ray travels through.
	 */

	function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

		let entry = 0;

		// Find the entry plane.
		if(tx0 > ty0 && tx0 > tz0) {

			// YZ-plane.
			if(tym < tx0) {

				entry |= 2;

			}

			if(tzm < tx0) {

				entry |= 1;

			}

		} else if(ty0 > tz0) {

			// XZ-plane.
			if(txm < ty0) {

				entry |= 4;

			}

			if(tzm < ty0) {

				entry |= 1;

			}

		} else {

			// XY-plane.
			if(txm < tz0) {

				entry |= 4;

			}

			if(tym < tz0) {

				entry |= 2;

			}

		}

		return entry;

	}

	/**
	 * Finds the next octant that intersects with the ray based on the exit plane of
	 * the current one.
	 *
	 * @private
	 * @param {Number} currentOctant - The index of the current octant.
	 * @param {Number} tx1 - Ray projection parameter.
	 * @param {Number} ty1 - Ray projection parameter.
	 * @param {Number} tz1 - Ray projection parameter.
	 * @return {Number} The index of the next octant that the ray travels through.
	 */

	function findNextOctant(currentOctant, tx1, ty1, tz1) {

		let min;
		let exit = 0;

		// Find the exit plane.
		if(tx1 < ty1) {

			min = tx1;
			exit = 0; // YZ-plane.

		} else {

			min = ty1;
			exit = 1; // XZ-plane.

		}

		if(tz1 < min) {

			exit = 2; // XY-plane.

		}

		return octantTable[currentOctant][exit];

	}

	/**
	 * Finds all octants that intersect with the given ray.
	 *
	 * @private
	 * @param {Octant} octant - The current octant.
	 * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.
	 * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.
	 * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.
	 * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.
	 * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.
	 * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with the intersecting octants.
	 */

	function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

		const children = octant.children;

		let currentOctant;
		let txm, tym, tzm;

		if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

			if(children === null) {

				// Leaf.
				intersects.push(octant);

			} else {

				// Compute means.
				txm = 0.5 * (tx0 + tx1);
				tym = 0.5 * (ty0 + ty1);
				tzm = 0.5 * (tz0 + tz1);

				currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

				do {

					/* The possibilities for the next node are passed in the same respective
					 * order as the t-values. Hence, if the first value is found to be the
					 * greatest, the fourth one will be returned. If the second value is the
					 * greatest, the fifth one will be returned, etc.
					 */

					switch(currentOctant) {

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
							// Far top right octant. No other octants can be reached from here.
							currentOctant = 8;
							break;

					}

				} while(currentOctant < 8);

			}

		}

	}

	/**
	 * An octree raycaster.
	 *
	 * Based on:
	 *  "An Efficient Parametric Algorithm for Octree Traversal"
	 *  by J. Revelles et al. (2000).
	 */

	class OctreeRaycaster {

		/**
		 * Finds the octants that intersect with the given ray. The intersecting
		 * octants are sorted by distance, closest first.
		 *
		 * @param {Octree} octree - An octree.
		 * @param {Raycaster} raycaster - A raycaster.
		 * @param {Array} intersects - A list to be filled with intersecting octants.
		 */

		static intersectOctree(octree, raycaster, intersects) {

			// Translate the octree extents to the scene origin.
			const min = b$4.min.set(0, 0, 0);
			const max = b$4.max.subVectors(octree.max, octree.min);

			const dimensions = octree.getDimensions(v$8[0]);
			const halfDimensions = v$8[1].copy(dimensions).multiplyScalar(0.5);

			const origin = r.origin.copy(raycaster.ray.origin);
			const direction = r.direction.copy(raycaster.ray.direction);

			let invDirX, invDirY, invDirZ;
			let tx0, tx1, ty0, ty1, tz0, tz1;

			// Translate the ray to the center of the octree.
			origin.sub(octree.getCenter(v$8[2])).add(halfDimensions);

			// Reset all flags.
			flags = 0;

			// Handle rays with negative directions.
			if(direction.x < 0.0) {

				origin.x = dimensions.x - origin.x;
				direction.x = -direction.x;
				flags |= 4;

			}

			if(direction.y < 0.0) {

				origin.y = dimensions.y - origin.y;
				direction.y = -direction.y;
				flags |= 2;

			}

			if(direction.z < 0.0) {

				origin.z = dimensions.z - origin.z;
				direction.z = -direction.z;
				flags |= 1;

			}

			// Improve IEEE double stability.
			invDirX = 1.0 / direction.x;
			invDirY = 1.0 / direction.y;
			invDirZ = 1.0 / direction.z;

			// Project the ray to the root's boundaries.
			tx0 = (min.x - origin.x) * invDirX;
			tx1 = (max.x - origin.x) * invDirX;
			ty0 = (min.y - origin.y) * invDirY;
			ty1 = (max.y - origin.y) * invDirY;
			tz0 = (min.z - origin.z) * invDirZ;
			tz1 = (max.z - origin.z) * invDirZ;

			// Check if the ray hits the octree.
			if(Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {

				// Find the intersecting octants.
				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);

			}

		}

	}

	/**
	 * A 3D box.
	 *
	 * @type {Box3}
	 * @private
	 */

	const b$5 = new Box3();

	/**
	 * Recursively calculates the depth of the given octree.
	 *
	 * @private
	 * @param {Octant} octant - An octant.
	 * @return {Number} The depth.
	 */

	function getDepth(octant) {

		const children = octant.children;

		let result = 0;
		let i, l, d;

		if(children !== null) {

			for(i = 0, l = children.length; i < l; ++i) {

				d = 1 + getDepth(children[i]);

				if(d > result) {

					result = d;

				}

			}

		}

		return result;

	}

	/**
	 * Recursively collects octants that lie inside the specified region.
	 *
	 * @private
	 * @param {Octant} octant - An octant.
	 * @param {Frustum|Box3} region - A region.
	 * @param {Octant[]} result - A list to be filled with octants that intersect with the region.
	 */

	function cull(octant, region, result) {

		const children = octant.children;

		let i, l;

		b$5.min = octant.min;
		b$5.max = octant.max;

		if(region.intersectsBox(b$5)) {

			if(children !== null) {

				for(i = 0, l = children.length; i < l; ++i) {

					cull(children[i], region, result);

				}

			} else {

				result.push(octant);

			}

		}

	}

	/**
	 * Recursively fetches all octants with the specified depth level.
	 *
	 * @private
	 * @param {Octant} octant - An octant.
	 * @param {Number} level - The target depth level.
	 * @param {Number} depth - The current depth level.
	 * @param {Octant[]} result - A list to be filled with the identified octants.
	 */

	function findOctantsByLevel(octant, level, depth, result) {

		const children = octant.children;

		let i, l;

		if(depth === level) {

			result.push(octant);

		} else if(children !== null) {

			++depth;

			for(i = 0, l = children.length; i < l; ++i) {

				findOctantsByLevel(children[i], level, depth, result);

			}

		}

	}

	/**
	 * An octree that subdivides space for fast spatial searches.
	 *
	 * @implements {Iterable}
	 */

	class Octree {

		/**
		 * Constructs a new octree.
		 *
		 * @param {Vector3} [min] - The lower bounds of the tree. If not provided, the octree will not create a root node.
		 * @param {Vector3} [max] - The upper bounds of the tree. If not provided, the octree will not create a root node.
		 */

		constructor(min, max) {

			/**
			 * The root octant.
			 *
			 * @type {Octant}
			 * @default null
			 */

			this.root = (min !== undefined && max !== undefined) ? new Octant(min, max) : null;

		}

		/**
		 * The lower bounds of the root octant.
		 *
		 * @type {Vector3}
		 */

		get min() {

			return this.root.min;

		}

		/**
		 * The upper bounds of the root octant.
		 *
		 * @type {Vector3}
		 */

		get max() {

			return this.root.max;

		}

		/**
		 * The children of the root octant.
		 *
		 * @type {Octant[]}
		 */

		get children() {

			return this.root.children;

		}

		/**
		 * Calculates the center of this octree.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the center of this octree.
		 */

		getCenter(target) {

			return this.root.getCenter(target);

		}

		/**
		 * Calculates the size of this octree.
		 *
		 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
		 * @return {Vector3} A vector that describes the size of this octree.
		 */

		getDimensions(target) {

			return this.root.getDimensions(target);

		}

		/**
		 * Calculates the current depth of this octree.
		 *
		 * @return {Number} The depth.
		 */

		getDepth() {

			return getDepth(this.root);

		}

		/**
		 * Recursively collects octants that intersect with the specified region.
		 *
		 * @param {Frustum|Box3} region - A region.
		 * @return {Octant[]} The octants.
		 */

		cull(region) {

			const result = [];

			cull(this.root, region, result);

			return result;

		}

		/**
		 * Fetches all octants with the specified depth level.
		 *
		 * @param {Number} level - The depth level.
		 * @return {Octant[]} The octants.
		 */

		findOctantsByLevel(level) {

			const result = [];

			findOctantsByLevel(this.root, level, 0, result);

			return result;

		}

		/**
		 * Finds the octants that intersect with the given ray. The intersecting
		 * octants are sorted by distance, closest first.
		 *
		 * @param {Raycaster} raycaster - A raycaster.
		 * @param {Octant[]} [intersects] - An optional target list to be filled with the intersecting octants.
		 * @return {Octant[]} The intersecting octants.
		 */

		raycast(raycaster, intersects = []) {

			OctreeRaycaster.intersectOctree(this, raycaster, intersects);

			return intersects;

		}

		/**
		 * Returns an iterator that traverses the octree and returns leaf nodes.
		 *
		 * When a cull region is provided, the iterator will only return leaves that
		 * intersect with that region.
		 *
		 * @param {Frustum|Box3} [region] - A cull region.
		 * @return {OctantIterator} An iterator.
		 */

		leaves(region) {

			return new OctantIterator(this, region);

		}

		/**
		 * Returns an iterator that traverses the octree and returns all leaf nodes.
		 *
		 * @return {OctantIterator} An iterator.
		 */

		[Symbol.iterator]() {

			return new OctantIterator(this);

		}

	}

	/**
	 * Core components.
	 *
	 * @module sparse-octree/core
	 */

	/**
	 * A collection of ray-point intersection data.
	 */

	/**
	 * Point-oriented octree components.
	 *
	 * @module sparse-octree/points
	 */

	/**
	 * Octree utilities.
	 *
	 * @module sparse-octree/utils
	 */

	/**
	 * Exposure of the library components.
	 *
	 * @module sparse-octree
	 */

	/**
	 * An isovalue bias for the Zero Crossing approximation.
	 *
	 * @type {Number}
	 * @private
	 */

	const ISOVALUE_BIAS = 1e-4;

	/**
	 * An error threshold for the Zero Crossing approximation.
	 *
	 * @type {Number}
	 * @private
	 */

	const INTERVAL_THRESHOLD = 1e-6;

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const ab = new Vector3();

	/**
	 * A point.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const p$1 = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const v$a = new Vector3();

	/**
	 * An edge between two material grid points.
	 */

	class Edge {

		/**
		 * Constructs a new edge.
		 *
		 * @param {Vector3} [a] - A starting point. If none is provided, a new vector will be created.
		 * @param {Vector3} [b] - An ending point. If none is provided, a new vector will be created.
		 */

		constructor(a = new Vector3(), b = new Vector3()) {

			/**
			 * The starting point of the edge.
			 *
			 * @type {Vector3}
			 */

			this.a = a;

			/**
			 * The ending point of the edge.
			 *
			 * @type {Vector3}
			 */

			this.b = b;

			/**
			 * The index of the starting material grid point.
			 *
			 * @type {Number}
			 */

			this.index = -1;

			/**
			 * The local grid coordinates of the starting point.
			 *
			 * @type {Vector3}
			 */

			this.coordinates = new Vector3();

			/**
			 * The Zero Crossing interpolation value.
			 *
			 * @type {Number}
			 */

			this.t = 0.0;

			/**
			 * The surface normal at the Zero Crossing position.
			 *
			 * @type {Vector3}
			 */

			this.n = new Vector3();

		}

		/**
		 * Approximates the smallest density along the edge.
		 *
		 * @param {SignedDistanceFunction} sdf - A density field.
		 * @param {Number} [steps=8] - The maximum number of interpolation steps. Cannot be smaller than 2.
		 */

		approximateZeroCrossing(sdf, steps = 8) {

			const s = Math.max(1, steps - 1);

			let a = 0.0;
			let b = 1.0;
			let c = 0.0;
			let i = 0;

			let densityA, densityC;

			// Compute the vector from a to b.
			ab.subVectors(this.b, this.a);

			// Use bisection to find the root of the SDF.
			while(i <= s) {

				c = (a + b) / 2;

				p$1.addVectors(this.a, v$a.copy(ab).multiplyScalar(c));
				densityC = sdf.sample(p$1);

				if(Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {

					// Solution found.
					break;

				} else {

					p$1.addVectors(this.a, v$a.copy(ab).multiplyScalar(a));
					densityA = sdf.sample(p$1);

					if(Math.sign(densityC) === Math.sign(densityA)) {

						a = c;

					} else {

						b = c;

					}

				}

				++i;

			}

			this.t = c;

		}

		/**
		 * Calculates the Zero Crossing position.
		 *
		 * @param {Vector3} target - A target for the Zero Crossing position. If none is provided, a new vector will be created.
		 * @return {Vector3} The Zero Crossing position.
		 */

		computeZeroCrossingPosition(target = new Vector3()) {

			return target.subVectors(this.b, this.a).multiplyScalar(this.t).add(this.a);

		}

		/**
		 * Computes the normal of the surface at the edge intersection.
		 *
		 * @param {SignedDistanceFunction} sdf - A density field.
		 * @return {Vector3} The normal.
		 * @todo Use analytical derivation instead of finite differences.
		 */

		computeSurfaceNormal(sdf) {

			const position = this.computeZeroCrossingPosition(ab);
			const E = 1e-3;

			const dx = sdf.sample(p$1.addVectors(position, v$a.set(E, 0, 0))) - sdf.sample(p$1.subVectors(position, v$a.set(E, 0, 0)));
			const dy = sdf.sample(p$1.addVectors(position, v$a.set(0, E, 0))) - sdf.sample(p$1.subVectors(position, v$a.set(0, E, 0)));
			const dz = sdf.sample(p$1.addVectors(position, v$a.set(0, 0, E))) - sdf.sample(p$1.subVectors(position, v$a.set(0, 0, E)));

			this.n.set(dx, dy, dz).normalize();

		}

	}

	/**
	 * An edge.
	 *
	 * @type {Edge}
	 * @private
	 */

	const edge = new Edge();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const offsetA = new Vector3();

	/**
	 * A vector.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const offsetB = new Vector3();

	/**
	 * An edge iterator.
	 *
	 * @implements {Iterator}
	 * @implements {Iterable}
	 */

	class EdgeIterator {

		/**
		 * Constructs a new edge iterator.
		 *
		 * @param {EdgeData} edgeData - A set of edge data.
		 * @param {Vector3} cellPosition - The position of the data cell.
		 * @param {Number} cellSize - The size of the data cell.
		 * @param {Number} [c=0] - The dimension index to start at.
		 * @param {Number} [d=3] - The dimension limit.
		 */

		constructor(edgeData, cellPosition, cellSize, c = 0, d = 3) {

			/**
			 * The edge data.
			 *
			 * @type {EdgeData}
			 * @private
			 */

			this.edgeData = edgeData;

			/**
			 * The data cell position.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.cellPosition = cellPosition;

			/**
			 * The data cell size.
			 *
			 * @type {Number}
			 * @private
			 */

			this.cellSize = cellSize;

			/**
			 * The edges.
			 *
			 * @type {Uint32Array[]}
			 * @private
			 */

			this.indices = null;

			/**
			 * The Zero Crossings.
			 *
			 * @type {Float32Array[]}
			 * @private
			 */

			this.zeroCrossings = null;

			/**
			 * The intersection normals.
			 *
			 * @type {Float32Array[]}
			 * @private
			 */

			this.normals = null;

			/**
			 * The axes of the existing edges.
			 *
			 * @type {Uint8Array[]}
			 * @private
			 */

			this.axes = null;

			/**
			 * The amount of edges for each internal set of edges (X -> Y -> Z).
			 *
			 * @type {Number[]}
			 */

			this.lengths = null;

			/**
			 * An iterator result.
			 *
			 * @type {IteratorResult}
			 * @private
			 */

			this.result = new IteratorResult();

			/**
			 * The initial dimension index.
			 *
			 * @type {Number}
			 * @private
			 */

			this.initialC = c;

			/**
			 * The current dimension index.
			 *
			 * @type {Number}
			 * @private
			 */

			this.c = c;

			/**
			 * The initial dimension limit.
			 *
			 * @type {Number}
			 * @private
			 */

			this.initialD = d;

			/**
			 * The dimension limit.
			 *
			 * @type {Number}
			 * @private
			 */

			this.d = d;

			/**
			 * The current iteration index.
			 *
			 * @type {Number}
			 * @private
			 */

			this.i = 0;

			/**
			 * The current iteration limit.
			 *
			 * @type {Number}
			 * @private
			 */

			this.l = 0;

			this.reset();

		}

		/**
		 * Resets this iterator.
		 *
		 * @return {EdgeIterator} This iterator.
		 */

		reset() {

			const edgeData = this.edgeData;
			const indices = [];
			const zeroCrossings = [];
			const normals = [];
			const axes = [];
			const lengths = [];

			let a, c, d, l;

			this.i = 0;
			this.c = 0;
			this.d = 0;

			// Create a collection of edges without empty arrays.
			for(c = this.initialC, a = 4 >> c, d = this.initialD; c < d; ++c, a >>= 1) {

				l = edgeData.indices[c].length;

				if(l > 0) {

					indices.push(edgeData.indices[c]);
					zeroCrossings.push(edgeData.zeroCrossings[c]);
					normals.push(edgeData.normals[c]);
					axes.push(pattern[a]);
					lengths.push(l);

					++this.d;

				}

			}

			this.l = (lengths.length > 0) ? lengths[0] : 0;

			this.indices = indices;
			this.zeroCrossings = zeroCrossings;
			this.normals = normals;
			this.axes = axes;
			this.lengths = lengths;

			this.result.reset();

			return this;

		}

		/**
		 * Iterates over the edges.
		 *
		 * @return {IteratorResult} The next edge.
		 */

		next() {

			const s = this.cellSize;
			const n = this.edgeData.resolution;
			const m = n + 1;
			const mm = m * m;

			const result = this.result;
			const base = this.cellPosition;

			let axis, index;
			let x, y, z;
			let c, i;

			// Has the end been reached?
			if(this.i === this.l) {

				// Move on to the next set of edges (X -> Y -> Z).
				this.l = (++this.c < this.d) ? this.lengths[this.c] : 0;
				this.i = 0;

			}

			// Are there any edges left?
			if(this.i < this.l) {

				c = this.c;
				i = this.i;

				axis = this.axes[c];

				// Each edge is uniquely described by its starting grid point index.
				index = this.indices[c][i];
				edge.index = index;

				// Calculate the local grid coordinates from the one-dimensional index.
				x = index % m;
				y = Math.trunc((index % mm) / m);
				z = Math.trunc(index / mm);

				edge.coordinates.set(x, y, z);

				offsetA.set(
					x * s / n,
					y * s / n,
					z * s / n
				);

				offsetB.set(
					(x + axis[0]) * s / n,
					(y + axis[1]) * s / n,
					(z + axis[2]) * s / n
				);

				edge.a.addVectors(base, offsetA);
				edge.b.addVectors(base, offsetB);

				edge.t = this.zeroCrossings[c][i];
				edge.n.fromArray(this.normals[c], i * 3);

				result.value = edge;

				++this.i;

			} else {

				// There are no more edges left.
				result.value = null;
				result.done = true;

			}

			return result;

		}

		/**
		 * Called when this iterator will no longer be run to completion.
		 *
		 * @param {Object} value - An interator result value.
		 * @return {IteratorResult} - A premature completion result.
		 */

		return(value) {

			this.result.value = value;
			this.result.done = true;

			return this.result;

		}

		/**
		 * Returns this iterator.
		 *
		 * @return {EdteIterator} An iterator.
		 */

		[Symbol.iterator]() {

			return this;

		}

	}

	/**
	 * Stores edge data separately for each dimension.
	 *
	 * With a grid resolution N, there are `3 * (N + 1)² * N` edges in total, but
	 * the number of edges that actually contain the volume's surface is usually
	 * much lower.
	 *
	 * @implements {Serializable}
	 * @implements {Deserializable}
	 * @implements {TransferableContainer}
	 */

	class EdgeData {

		/**
		 * Constructs new edge data.
		 *
		 * @param {Number} n - The material grid resolution.
		 * @param {Number} [x=0] - The amount of edges along the X-axis. If <= 0, no memory will be allocated.
		 * @param {Number} [y=x] - The amount of edges along the Y-axis. If omitted, this will be the same as x.
		 * @param {Number} [z=x] - The amount of edges along the Z-axis. If omitted, this will be the same as x.
		 */

		constructor(n, x = 0, y = x, z = x) {

			/**
			 * The material grid resolution.
			 *
			 * @type {Number}
			 */

			this.resolution = n;

			/**
			 * The edges.
			 *
			 * Edges are stored as starting grid point indices in ascending order. The
			 * ending point indices are implicitly defined through the dimension split:
			 *
			 * Given a starting point index A, the ending point index B for the X-, Y-
			 * and Z-axis is defined as `A + 1`, `A + N` and `A + N²` respectively where
			 * N is the grid resolution + 1.
			 *
			 * @type {Uint32Array[]}
			 */

			this.indices = (x <= 0) ? null : [
				new Uint32Array(x),
				new Uint32Array(y),
				new Uint32Array(z)
			];

			/**
			 * The Zero Crossing interpolation values.
			 *
			 * Each value describes the relative surface intersection position on the
			 * respective edge. The values correspond to the order of the edges.
			 *
			 * @type {Float32Array[]}
			 */

			this.zeroCrossings = (x <= 0) ? null : [
				new Float32Array(x),
				new Float32Array(y),
				new Float32Array(z)
			];

			/**
			 * The surface intersection normals.
			 *
			 * The vectors are stored as [x, y, z] float triples and correspond to the
			 * order of the edges.
			 *
			 * @type {Float32Array[]}
			 */

			this.normals = (x <= 0) ? null : [
				new Float32Array(x * 3),
				new Float32Array(y * 3),
				new Float32Array(z * 3)
			];

		}

		/**
		 * Serialises this data.
		 *
		 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
		 * @return {Object} The serialised data.
		 */

		serialize(deflate = false) {

			return {
				resolution: this.resolution,
				edges: this.edges,
				zeroCrossings: this.zeroCrossings,
				normals: this.normals
			};

		}

		/**
		 * Adopts the given serialised data.
		 *
		 * @param {Object} object - Serialised edge data. Can be null.
		 * @return {Deserializable} This object or null if the given serialised data was null.
		 */

		deserialize(object) {

			let result = this;

			if(object !== null) {

				this.resolution = object.resolution;
				this.edges = object.edges;
				this.zeroCrossings = object.zeroCrossings;
				this.normals = object.normals;

			} else {

				result = null;

			}

			return result;

		}

		/**
		 * Creates a list of transferable items.
		 *
		 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
		 * @return {Transferable[]} The transfer list.
		 */

		createTransferList(transferList = []) {

			const arrays = [

				this.edges[0],
				this.edges[1],
				this.edges[2],

				this.zeroCrossings[0],
				this.zeroCrossings[1],
				this.zeroCrossings[2],

				this.normals[0],
				this.normals[1],
				this.normals[2]

			];

			let array;
			let i, l;

			for(i = 0, l = arrays.length; i < l; ++i) {

				array = arrays[i];

				if(array !== null) {

					transferList.push(array.buffer);

				}

			}

			return transferList;

		}

		/**
		 * Returns a new edge iterator.
		 *
		 * @param {Vector3} cellPosition - The position of the volume data cell.
		 * @param {Number} cellSize - The size of the volume data cell.
		 * @return {EdgeIterator} An iterator.
		 */

		edges(cellPosition, cellSize) {

			return new EdgeIterator(this, cellPosition, cellSize);

		}

		/**
		 * Creates a new edge iterator that only returns edges along the X-axis.
		 *
		 * @param {Vector3} cellPosition - The position of the volume data cell.
		 * @param {Number} cellSize - The size of the volume data cell.
		 * @return {EdgeIterator} An iterator.
		 */

		edgesX(cellPosition, cellSize) {

			return new EdgeIterator(this, cellPosition, cellSize, 0, 1);

		}

		/**
		 * Creates a new edge iterator that only returns edges along the Y-axis.
		 *
		 * @param {Vector3} cellPosition - The position of the volume data cell.
		 * @param {Number} cellSize - The size of the volume data cell.
		 * @return {EdgeIterator} An iterator.
		 */

		edgesY(cellPosition, cellSize) {

			return new EdgeIterator(this, cellPosition, cellSize, 1, 2);

		}

		/**
		 * Creates a new edge iterator that only returns edges along the Z-axis.
		 *
		 * @param {Vector3} cellPosition - The position of the volume data cell.
		 * @param {Number} cellSize - The size of the volume data cell.
		 * @return {EdgeIterator} An iterator.
		 */

		edgesZ(cellPosition, cellSize) {

			return new EdgeIterator(this, cellPosition, cellSize, 2, 3);

		}

		/**
		 * Calculates the amount of edges for one axis based on a given resolution.
		 *
		 * @param {Number} n - The grid resolution.
		 * @return {Number} The amount of edges for a single dimension.
		 */

		static calculate1DEdgeCount(n) {

			return Math.pow((n + 1), 2) * n;

		}

	}

	/**
	 * The isovalue.
	 *
	 * @type {Number}
	 * @private
	 */

	let isovalue = 0.0;

	/**
	 * The material grid resolution.
	 *
	 * @type {Number}
	 * @private
	 */

	let resolution = 0;

	/**
	 * The total amount of grid point indices.
	 *
	 * @type {Number}
	 * @private
	 */

	let indexCount = 0;

	/**
	 * Hermite data.
	 *
	 * @implements {Serializable}
	 * @implements {Deserializable}
	 * @implements {TransferableContainer}
	 */

	class HermiteData {

		/**
		 * Constructs a new set of Hermite data.
		 *
		 * @param {Boolean} [initialize=true] - Whether the data should be initialised immediately.
		 */

		constructor(initialize = true) {

			/**
			 * Describes how many material indices are currently solid:
			 *
			 * - The chunk lies outside the volume if there are no solid grid points.
			 * - The chunk lies completely inside the volume if all points are solid.
			 *
			 * @type {Number}
			 */

			this.materials = 0;

			/**
			 * The grid points.
			 *
			 * @type {Uint8Array}
			 */

			this.materialIndices = initialize ? new Uint8Array(indexCount) : null;

			/**
			 * Run-length compression data.
			 *
			 * @type {Uint32Array}
			 */

			this.runLengths = null;

			/**
			 * The edge data.
			 *
			 * @type {EdgeData}
			 */

			this.edgeData = null;

		}

		/**
		 * Indicates whether this data container is empty.
		 *
		 * @type {Boolean}
		 */

		get empty() {

			return (this.materials === 0);

		}

		/**
		 * Indicates whether this data container is full.
		 *
		 * @type {Boolean}
		 */

		get full() {

			return (this.materials === indexCount);

		}

		/**
		 * Indicates whether this data is currently compressed.
		 *
		 * @type {Boolean}
		 */

		get compressed() {

			return (this.runLengths !== null);

		}

		/**
		 * Indicates whether this data is currently gone.
		 *
		 * @type {Boolean}
		 */

		get neutered() {

			return (!this.empty && this.materialIndices === null);

		}

		/**
		 * Adopts the given data.
		 *
		 * @param {HermiteData} data - The data to adopt.
		 * @return {HermiteData} This data.
		 */

		set(data) {

			this.materials = data.materials;
			this.materialIndices = data.materialIndices;
			this.runLengths = data.runLengths;
			this.edgeData = data.edgeData;

			return this;

		}

		/**
		 * Removes all data.
		 *
		 * @return {HermiteData} This data.
		 */

		clear() {

			this.materials = 0;
			this.materialIndices = null;
			this.runLengths = null;
			this.edgeData = null;

			return this;

		}

		/**
		 * Sets the specified material index.
		 *
		 * @param {Number} index - The index of the material index that should be updated.
		 * @param {Number} value - The new material index.
		 */

		setMaterialIndex(index, value) {

			// Keep track of how many material indices are solid.
			if(this.materialIndices[index] === Material.AIR) {

				if(value !== Material.AIR) {

					++this.materials;

				}

			} else if(value === Material.AIR) {

				--this.materials;

			}

			this.materialIndices[index] = value;

		}

		/**
		 * Compresses this data.
		 *
		 * @param {HermiteData} [target=this] - A target data set. The compressed data will be assigned to this set.
		 * @return {HermiteData} The target data set.
		 */

		compress(target = this) {

			let encoding;

			if(!this.compressed) {

				// Note: empty sets won't be compressed. They can be discarded.
				if(this.full) {

					// This deliberately destroys material variations to save space!
					encoding = new RunLengthEncoding(
						[this.materialIndices.length],
						[Material.SOLID]
					);

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

		/**
		 * Decompresses this data.
		 *
		 * @param {HermiteData} [target=this] - A target data set. If none is provided, the compressed data will be replaced with the decompressed data.
		 * @return {HermiteData} The target data set.
		 */

		decompress(target = this) {

			target.materialIndices = !this.compressed ?
				this.materialIndices : RunLengthEncoding.decode(
					this.runLengths, this.materialIndices, new Uint8Array(indexCount)
				);

			target.runLengths = null;
			target.materials = this.materials;

			return target;

		}

		/**
		 * Serialises this data.
		 *
		 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
		 * @return {Object} The serialised data.
		 */

		serialize(deflate = false) {

			return {
				materials: this.materials,
				materialIndices: this.materialIndices,
				runLengths: this.runLengths,
				edgeData: (this.edgeData !== null) ? this.edgeData.serialize() : null
			};

		}

		/**
		 * Adopts the given serialised data.
		 *
		 * @param {Object} object - Serialised Hermite data. Can be null.
		 * @return {Deserializable} This object or null if the given serialised data was null.
		 */

		deserialize(object) {

			let result = this;

			if(object !== null) {

				this.materials = object.materials;
				this.materialIndices = object.materialIndices;
				this.runLengths = object.runLengths;

				if(object.edgeData !== null) {

					if(this.edgeData === null) {

						// Create an empty edge data container.
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

		/**
		 * Creates a list of transferable items.
		 *
		 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
		 * @return {Transferable[]} The transfer list.
		 */

		createTransferList(transferList = []) {

			if(this.edgeData !== null) {

				this.edgeData.createTransferList(transferList);

			}

			if(this.materialIndices !== null) {

				transferList.push(this.materialIndices.buffer);

			}

			if(this.runLengths !== null) {

				transferList.push(this.runLengths.buffer);

			}

			return transferList;

		}

		/**
		 * The global isovalue.
		 *
		 * A constant distance value that denotes the boundaries of SDFs.
		 *
		 * @type {Number}
		 */

		static get isovalue() {

			return isovalue;

		}

		/**
		 * Warning: changing the isovalue is not recommended.
		 *
		 * @type {Number}
		 */

		static set isovalue(value) {

			isovalue = value;

		}

		/**
		 * The material grid resolution.
		 *
		 * The effective resolution of a chunk of Hermite data is the distance between
		 * two adjacent grid points with respect to the size of the containing world
		 * octant.
		 *
		 * @type {Number}
		 */

		static get resolution() {

			return resolution;

		}

		/**
		 * Warning: this value should only be set once.
		 *
		 * The upper limit is 256.
		 *
		 * @type {Number}
		 */

		static set resolution(value) {

			// Round up to the next power of two.
			value = Math.pow(2, Math.max(0, Math.ceil(Math.log2(value))));

			resolution = Math.max(1, Math.min(256, value));
			indexCount = Math.pow((resolution + 1), 3);

		}

	}

	/**
	 * An operation that describes a density field.
	 */

	class DensityFunction extends Operation {

		/**
		 * Constructs a new density function operation.
		 *
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 */

		constructor(sdf) {

			super(OperationType.DENSITY_FUNCTION);

			/**
			 * An SDF.
			 *
			 * @type {SignedDistanceFunction}
			 * @private
			 */

			this.sdf = sdf;

		}

		/**
		 * Calculates the bounding box of this density function.
		 *
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			return this.sdf.getBoundingBox(true);

		}

		/**
		 * Calculates the material index for the given world position.
		 *
		 * @param {Vector3} position - The world position of the material index.
		 * @return {Number} The material index.
		 */

		generateMaterialIndex(position) {

			return (this.sdf.sample(position) <= HermiteData.isovalue) ? this.sdf.material : Material.AIR;

		}

		/**
		 * Generates surface intersection data for the specified edge.
		 *
		 * @param {Edge} edge - The edge that should be processed.
		 */

		generateEdge(edge) {

			edge.approximateZeroCrossing(this.sdf);
			edge.computeSurfaceNormal(this.sdf);

		}

	}

	/**
	 * A matrix.
	 *
	 * @type {Matrix4}
	 * @private
	 */

	const m$2 = new Matrix4();

	/**
	 * An abstract Signed Distance Function.
	 *
	 * An SDF describes the signed Euclidean distance to the surface of an object,
	 * effectively describing its density at every point in 3D space. It yields
	 * negative values for points that lie inside the volume and positive values
	 * for points outside. The value is zero at the exact boundary of the object.
	 *
	 * @implements {Serializable}
	 * @implements {TransferableContainer}
	 */

	class SignedDistanceFunction {

		/**
		 * Constructs a new base SDF.
		 *
		 * @param {SDFType} type - The type of the SDF.
		 * @param {Number} [material=Material.SOLID] - A material index. Must be an integer in the range of 1 to 255.
		 */

		constructor(type, material = Material.SOLID) {

			/**
			 * The type of this SDF.
			 *
			 * @type {SDFType}
			 */

			this.type = type;

			/**
			 * The operation type.
			 *
			 * @type {OperationType}
			 */

			this.operation = null;

			/**
			 * A material index.
			 *
			 * @type {Number}
			 */

			this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

			/**
			 * The axis-aligned bounding box of this SDF.
			 *
			 * @type {Box3}
			 * @protected
			 */

			this.boundingBox = null;

			/**
			 * The positional translation.
			 *
			 * Call {@link updateInverseTransformation} after changing this field.
			 *
			 * @type {Vector3}
			 */

			this.position = new Vector3();

			/**
			 * The rotation.
			 *
			 * Call {@link updateInverseTransformation} after changing this field.
			 *
			 * @type {Quaternion}
			 */

			this.quaternion = new Quaternion();

			/**
			 * The scale.
			 *
			 * Call {@link updateInverseTransformation} after changing this field.
			 *
			 * @type {Vector3}
			 */

			this.scale = new Vector3(1, 1, 1);

			/**
			 * The inverted transformation matrix.
			 *
			 * @type {Matrix4}
			 */

			this.inverseTransformation = new Matrix4();

			this.updateInverseTransformation();

			/**
			 * A list of SDFs.
			 *
			 * SDFs can be chained to build CSG expressions.
			 *
			 * @type {SignedDistanceFunction[]}
			 * @private
			 */

			this.children = [];

		}

		/**
		 * Composes a transformation matrix using the translation, rotation and scale
		 * of this SDF.
		 *
		 * The transformation matrix is not needed for most SDF calculations and is
		 * therefore not stored explicitly to save space.
		 *
		 * @param {Matrix4} [target] - A target matrix. If none is provided, a new one will be created.
		 * @return {Matrix4} The transformation matrix.
		 */

		getTransformation(target = new Matrix4()) {

			return target.compose(this.position, this.quaternion, this.scale);

		}

		/**
		 * Calculates the AABB of this SDF if it doesn't exist yet and returns it.
		 *
		 * @param {Boolean} [recursive=false] - Whether the child SDFs should be taken into account.
		 * @return {Box3} The bounding box.
		 */

		getBoundingBox(recursive = false) {

			const children = this.children;

			let boundingBox = this.boundingBox;
			let i, l;

			if(boundingBox === null) {

				boundingBox = this.computeBoundingBox();
				this.boundingBox = boundingBox;

			}

			if(recursive) {

				boundingBox = boundingBox.clone();

				for(i = 0, l = children.length; i < l; ++i) {

					boundingBox.union(children[i].getBoundingBox(recursive));

				}

			}

			return boundingBox;

		}

		/**
		 * Sets the material.
		 *
		 * @param {Material} material - The material. Must be an integer in the range of 1 to 255.
		 * @return {SignedDistanceFunction} This SDF.
		 */

		setMaterial(material) {

			this.material = Math.min(255, Math.max(Material.SOLID, Math.trunc(material)));

			return this;

		}

		/**
		 * Sets the CSG operation type of this SDF.
		 *
		 * @param {OperationType} operation - The CSG operation type.
		 * @return {SignedDistanceFunction} This SDF.
		 */

		setOperationType(operation) {

			this.operation = operation;

			return this;

		}

		/**
		 * Updates the inverse transformation matrix.
		 *
		 * This method should be called after the position, quaternion or scale has
		 * changed. The bounding box will be updated automatically.
		 *
		 * @return {SignedDistanceFunction} This SDF.
		 */

		updateInverseTransformation() {

			this.inverseTransformation.getInverse(this.getTransformation(m$2));
			this.boundingBox = null;

			return this;

		}

		/**
		 * Adds the given SDF to this one.
		 *
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {SignedDistanceFunction} This SDF.
		 */

		union(sdf) {

			this.children.push(sdf.setOperationType(OperationType.UNION));

			return this;

		}

		/**
		 * Subtracts the given SDF from this one.
		 *
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {SignedDistanceFunction} This SDF.
		 */

		subtract(sdf) {

			this.children.push(sdf.setOperationType(OperationType.DIFFERENCE));

			return this;

		}

		/**
		 * Intersects the given SDF with this one.
		 *
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {SignedDistanceFunction} This SDF.
		 */

		intersect(sdf) {

			this.children.push(sdf.setOperationType(OperationType.INTERSECTION));

			return this;

		}

		/**
		 * Translates this SDF into a CSG expression.
		 *
		 * @return {Operation} A CSG operation.
		 * @example a.union(b.intersect(c)).union(d).subtract(e) => Difference(Union(a, Intersection(b, c), d), e)
		 */

		toCSG() {

			const children = this.children;

			let operation = new DensityFunction(this);
			let operationType;
			let child;
			let i, l;

			for(i = 0, l = children.length; i < l; ++i) {

				child = children[i];

				if(operationType !== child.operation) {

					operationType = child.operation;

					switch(operationType) {

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

		/**
		 * Serialises this SDF.
		 *
		 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
		 * @return {Object} The serialised data.
		 */

		serialize(deflate = false) {

			const result = {
				type: this.type,
				operation: this.operation,
				material: this.material,
				position: this.position.toArray(),
				quaternion: this.quaternion.toArray(),
				scale: this.scale.toArray(),
				parameters: null,
				children: []
			};

			let i, l;

			for(i = 0, l = this.children.length; i < l; ++i) {

				result.children.push(this.children[i].serialize(deflate));

			}

			return result;

		}

		/**
		 * Creates a list of transferable items.
		 *
		 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
		 * @return {Transferable[]} The transfer list.
		 */

		createTransferList(transferList = []) {

			return transferList;

		}

		/**
		 * Returns a plain object that describes this SDF.
		 *
		 * @return {Object} A simple description of this SDF.
		 */

		toJSON() {

			return this.serialize(true);

		}

		/**
		 * Calculates the bounding box of this SDF.
		 *
		 * @protected
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			throw new Error("SignedDistanceFunction#computeBoundingBox method not implemented!");

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @throws {Error} An error is thrown if the method is not overridden.
		 * @param {Vector3} position - A position.
		 * @return {Number} The Euclidean distance to the surface.
		 */

		sample(position) {

			throw new Error("SignedDistanceFunction#sample method not implemented!");

		}

	}

	/**
	 * An enumeration of SDF types.
	 *
	 * @type {Object}
	 * @property {String} HEIGHTFIELD - A heightfield description.
	 * @property {String} FRACTAL_NOISE - A fractal noise description.
	 * @property {String} SUPER_PRIMITIVE - A super primitive description.
	 */

	const SDFType = {

		HEIGHTFIELD: "sdf.heightfield",
		FRACTAL_NOISE: "sdf.fractalnoise",
		SUPER_PRIMITIVE: "sdf.superprimitive"

	};

	/**
	 * Reads the image data of the given image.
	 *
	 * @private
	 * @param {Image} image - The image.
	 * @return {ImageData} The image data.
	 */

	function readImageData(image) {

		const canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		const context = canvas.getContext("2d");

		canvas.width = image.width;
		canvas.height = image.height;
		context.drawImage(image, 0, 0);

		return context.getImageData(0, 0, image.width, image.height);

	}

	/**
	 * A Signed Distance Function that describes a heightfield.
	 */

	class Heightfield extends SignedDistanceFunction {

		/**
		 * Constructs a new heightfield SDF.
		 *
		 * @param {Object} parameters - The parameters.
		 * @param {Array} [parameters.width=1] - The width of the heightfield.
		 * @param {Array} [parameters.height=1] - The height of the heightfield.
		 * @param {Boolean} [parameters.smooth=true] - Whether the height data should be smoothed.
		 * @param {Uint8ClampedArray} [parameters.data=null] - The heightmap image data.
		 * @param {Image} [parameters.image] - The heightmap image.
		 * @param {Number} [material] - A material index.
		 */

		constructor(parameters = {}, material) {

			super(SDFType.HEIGHTFIELD, material);

			/**
			 * The width.
			 *
			 * @type {Number}
			 * @private
			 */

			this.width = (parameters.width !== undefined) ? parameters.width : 1;

			/**
			 * The height.
			 *
			 * @type {Number}
			 * @private
			 */

			this.height = (parameters.height !== undefined) ? parameters.height : 1;

			/**
			 * Indicates whether the height data should be smoothed.
			 *
			 * @type {Boolean}
			 * @private
			 */

			this.smooth = (parameters.smooth !== undefined) ? parameters.smooth : true;

			/**
			 * The height data.
			 *
			 * @type {Uint8ClampedArray}
			 * @private
			 */

			this.data = (parameters.data !== undefined) ? parameters.data : null;

			/**
			 * The heightmap.
			 *
			 * @type {Image}
			 * @private
			 */

			this.heightmap = null;

			if(parameters.image !== undefined) {

				this.fromImage(parameters.image);

			}

		}

		/**
		 * Reads the image data of a given heightmap and converts it into a greyscale
		 * data array.
		 *
		 * @param {Image} image - The heightmap image.
		 * @return {Heightfield} This heightfield.
		 */

		fromImage(image) {

			const imageData = (typeof document === "undefined") ? null : readImageData(image);

			let result = null;
			let data;

			let i, j, l;

			if(imageData !== null) {

				data = imageData.data;

				// Reduce image data to greyscale format.
				result = new Uint8ClampedArray(data.length / 4);

				for(i = 0, j = 0, l = result.length; i < l; ++i, j += 4) {

					result[i] = data[j];

				}

				this.heightmap = image;
				this.width = imageData.width;
				this.height = imageData.height;
				this.data = result;

			}

			return this;

		}

		/**
		 * Retrives the height value for the given coordinates.
		 *
		 * @param {Number} x - The x coordinate.
		 * @param {Number} z - The z coordinate.
		 * @return {Number} The height.
		 */

		getHeight(x, z) {

			const w = this.width, h = this.height;
			const data = this.data;

			let height;

			x = Math.round(x * w);
			z = Math.round(z * h);

			if(this.smooth) {

				x = Math.max(Math.min(x, w - 1), 1);
				z = Math.max(Math.min(z, h - 1), 1);

				const p = x + 1, q = x - 1;
				const a = z * w, b = a + w, c = a - w;

				height = (

					data[c + q] + data[c + x] + data[c + p] +
					data[a + q] + data[a + x] + data[a + p] +
					data[b + q] + data[b + x] + data[b + p]

				) / 9;

			} else {

				height = data[z * w + x];

			}

			return height;

		}

		/**
		 * Calculates the bounding box of this SDF.
		 *
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			const boundingBox = new Box3();

			const w = Math.min(this.width / this.height, 1.0);
			const h = Math.min(this.height / this.width, 1.0);

			boundingBox.min.set(0, 0, 0);
			boundingBox.max.set(w, 1, h);
			boundingBox.applyMatrix4(this.getTransformation());

			return boundingBox;

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @param {Vector3} position - A position.
		 * @return {Number} The euclidean distance to the surface.
		 */

		sample(position) {

			const boundingBox = this.boundingBox;

			let d;

			if(boundingBox.containsPoint(position)) {

				position.applyMatrix4(this.inverseTransformation);

				d = position.y - this.getHeight(position.x, position.z) / 255;

			} else {

				d = boundingBox.distanceToPoint(position);

			}

			return d;

		}

		/**
		 * Serialises this SDF.
		 *
		 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
		 * @return {Object} The serialised data.
		 */

		serialize(deflate = false) {

			const result = super.serialize();

			result.parameters = {
				width: this.width,
				height: this.height,
				smooth: this.smooth,
				data: deflate ? null : this.data,
				dataURL: (deflate && this.heightmap !== null) ? this.heightmap.toDataURL() : null,
				image: null
			};

			return result;

		}

		/**
		 * Creates a list of transferable items.
		 *
		 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
		 * @return {Transferable[]} The transfer list.
		 */

		createTransferList(transferList = []) {

			transferList.push(this.data.buffer);

			return transferList;

		}

	}

	/**
	 * The super primitive.
	 *
	 * A function that is able to represent a wide range of conic/rectangular-radial
	 * primitives of genus 0 and 1: (round) box, sphere, cylinder, capped cone,
	 * torus, capsule, pellet, pipe, etc.
	 *
	 * Reference:
	 *  https://www.shadertoy.com/view/MsVGWG
	 */

	class SuperPrimitive extends SignedDistanceFunction {

		/**
		 * Constructs a new super primitive.
		 *
		 * See {@link SuperPrimitivePreset} for a list of default configurations.
		 *
		 * @param {Object} parameters - The parameters.
		 * @param {Array} parameters.s - The size and genus weight [x, y, z, w].
		 * @param {Array} parameters.r - The corner radii [x, y, z].
		 * @param {Number} [material] - A material index.
		 * @example const cube = SuperPrimitive.create(SuperPrimitivePreset.CUBE);
		 */

		constructor(parameters = {}, material) {

			super(SDFType.SUPER_PRIMITIVE, material);

			/**
			 * The base size. The W-component affects the genus of the primitive.
			 *
			 * @type {Vector4}
			 * @private
			 */

			this.s0 = new Vector4(...parameters.s);

			/**
			 * The base corner radii.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.r0 = new Vector3(...parameters.r);

			/**
			 * The size, adjusted for further calculations.
			 *
			 * @type {Vector4}
			 * @private
			 */

			this.s = new Vector4();

			/**
			 * The corner radii, adjusted for further calculations.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.r = new Vector3();

			/**
			 * Precomputed corner rounding constants.
			 *
			 * @type {Vector2}
			 * @private
			 */

			this.ba = new Vector2();

			/**
			 * The bottom radius offset.
			 *
			 * @type {Number}
			 * @private
			 */

			this.offset = 0;

			// Calculate constants ahead of time.
			this.precompute();

		}

		/**
		 * Sets the size and genus weight.
		 *
		 * @param {Number} x - X.
		 * @param {Number} y - Y.
		 * @param {Number} z - Z.
		 * @param {Number} w - W.
		 * @return {SuperPrimitive} This instance.
		 */

		setSize(x, y, z, w) {

			this.s0.set(x, y, z, w);

			return this.precompute();

		}

		/**
		 * Sets the corner radii.
		 *
		 * @param {Number} x - X.
		 * @param {Number} y - Y.
		 * @param {Number} z - Z.
		 * @return {SuperPrimitive} This instance.
		 */

		setRadii(x, y, z) {

			this.r0.set(x, y, z);

			return this.precompute();

		}

		/**
		 * Precomputes corner rounding factors.
		 *
		 * @private
		 * @return {SuperPrimitive} This instance.
		 */

		precompute() {

			const s = this.s.copy(this.s0);
			const r = this.r.copy(this.r0);
			const ba = this.ba;

			s.x -= r.x;
			s.y -= r.x;

			r.x -= s.w;
			s.w -= r.y;

			s.z -= r.y;

			this.offset = -2.0 * s.z;

			ba.set(r.z, this.offset);
			const divisor = ba.dot(ba);

			if(divisor === 0.0) {

				// Y must not be 0 to prevent bad values for Z = 0 in the last term (*).
				ba.set(0.0, -1.0);

			} else {

				ba.divideScalar(divisor);

			}

			return this;

		}

		/**
		 * Calculates the bounding box of this SDF.
		 *
		 * @return {Box3} The bounding box.
		 */

		computeBoundingBox() {

			const s = this.s0;
			const boundingBox = new Box3();

			boundingBox.min.x = Math.min(-s.x, -1.0);
			boundingBox.min.y = Math.min(-s.y, -1.0);
			boundingBox.min.z = Math.min(-s.z, -1.0);

			boundingBox.max.x = Math.max(s.x, 1.0);
			boundingBox.max.y = Math.max(s.y, 1.0);
			boundingBox.max.z = Math.max(s.z, 1.0);

			boundingBox.applyMatrix4(this.getTransformation());

			return boundingBox;

		}

		/**
		 * Samples the volume's density at the given point in space.
		 *
		 * @param {Vector3} position - A position.
		 * @return {Number} The euclidean distance to the surface.
		 */

		sample(position) {

			position.applyMatrix4(this.inverseTransformation);

			const s = this.s;
			const r = this.r;
			const ba = this.ba;

			const dx = Math.abs(position.x) - s.x;
			const dy = Math.abs(position.y) - s.y;
			const dz = Math.abs(position.z) - s.z;

			const mx0 = Math.max(dx, 0.0);
			const my0 = Math.max(dy, 0.0);
			const l0 = Math.sqrt(mx0 * mx0 + my0 * my0);

			const p = position.z - s.z;
			const q = Math.abs(l0 + Math.min(0.0, Math.max(dx, dy)) - r.x) - s.w;

			const c = Math.min(Math.max(q * ba.x + p * ba.y, 0.0), 1.0);
			const diagX = q - r.z * c;
			const diagY = p - this.offset * c;

			const hx0 = Math.max(q - r.z, 0.0);
			const hy0 = position.z + s.z;
			const hx1 = Math.max(q, 0.0);
			// hy1 = p;

			const diagSq = diagX * diagX + diagY * diagY;
			const h0Sq = hx0 * hx0 + hy0 * hy0;
			const h1Sq = hx1 * hx1 + p * p;
			const paBa = q * -ba.y + p * ba.x;

			const l1 = Math.sqrt(Math.min(diagSq, Math.min(h0Sq, h1Sq)));

			// (*) paBa must not be 0: if dz is also 0, the result will be wrong.
			return l1 * Math.sign(Math.max(paBa, dz)) - r.y;

		}

		/**
		 * Serialises this SDF.
		 *
		 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
		 * @return {Object} The serialised data.
		 */

		serialize(deflate = false) {

			const result = super.serialize();

			result.parameters = {
				s: this.s0.toArray(),
				r: this.r0.toArray()
			};

			return result;

		}

		/**
		 * Creates a new primitive using the specified preset.
		 *
		 * @param {SuperPrimitivePreset} preset - The super primitive preset.
		 */

		static create(preset) {

			const parameters = superPrimitivePresets[preset];

			return new SuperPrimitive({
				s: parameters[0],
				r: parameters[1]
			});

		}

	}

	/**
	 * A list of parameter presets.
	 *
	 * @type {Array<Float32Array[]>}
	 * @private
	 */

	const superPrimitivePresets = [

		// Cube.
		[
			new Float32Array([1.0, 1.0, 1.0, 1.0]),
			new Float32Array([0.0, 0.0, 0.0])
		],

		// Cylinder.
		[
			new Float32Array([1.0, 1.0, 1.0, 1.0]),
			new Float32Array([1.0, 0.0, 0.0])
		],

		// Cone.
		[
			new Float32Array([0.0, 0.0, 1.0, 1.0]),
			new Float32Array([0.0, 0.0, 1.0])
		],

		// Pill.
		[
			new Float32Array([1.0, 1.0, 2.0, 1.0]),
			new Float32Array([1.0, 1.0, 0.0])
		],

		// Sphere.
		[
			new Float32Array([1.0, 1.0, 1.0, 1.0]),
			new Float32Array([1.0, 1.0, 0.0])
		],

		// Pellet.
		[
			new Float32Array([1.0, 1.0, 0.25, 1.0]),
			new Float32Array([1.0, 0.25, 0.0])
		],

		// Torus.
		[
			new Float32Array([1.0, 1.0, 0.25, 0.25]),
			new Float32Array([1.0, 0.25, 0.0])
		],

		// Pipe.
		[
			new Float32Array([1.0, 1.0, 1.0, 0.25]),
			new Float32Array([1.0, 0.1, 0.0])
		],

		// Corridor.
		[
			new Float32Array([1.0, 1.0, 1.0, 0.25]),
			new Float32Array([0.1, 0.1, 0.0])
		]

	];

	/**
	 * An enumeration of super primitive presets.
	 *
	 * @type {Object}
	 * @property {Number} CUBE - A cube.
	 * @property {Number} CYLINDER - A cylinder.
	 * @property {Number} CONE - A cone.
	 * @property {Number} PILL - A pill.
	 * @property {Number} SPHERE - A sphere.
	 * @property {Number} PELLET - A pellet.
	 * @property {Number} TORUS - A torus.
	 * @property {Number} PIPE - A pipe.
	 * @property {Number} CORRIDOR - A corridor.
	 */

	const SuperPrimitivePreset = {

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

	/**
	 * An SDF loader event.
	 */

	class SDFLoaderEvent extends Event {

		/**
		 * Constructs a new SDF loader event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			super(type);

			/**
			 * A list of serialised SDFs.
			 *
			 * @type {Array}
			 */

			this.descriptions = null;

		}

	}

	/**
	 * A load event.
	 *
	 * This event is dispatched by {@link SDFLoader}.
	 *
	 * @type {SDFLoaderEvent}
	 * @example sdfLoader.addEventListener("load", myListener);
	 */

	const load$1 = new SDFLoaderEvent("load");

	/**
	 * A collection of binary number utilities.
	 */

	/**
	 * A world octant identifier.
	 *
	 * Each octant can be identified by a LOD index and a positional key.
	 */

	/**
	 * A scene that consists of several concentric geometry rings.
	 */

	/**
	 * A clipmap event.
	 */

	class ClipmapEvent extends Event {

		/**
		 * Constructs a new clipmap event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			super(type);

			/**
			 * The LOD shell.
			 *
			 * @type {Number}
			 */

			this.lod = -1;

			/**
			 * A list of world octant Identifiers that have left the LOD shell.
			 *
			 * @type {WorldOctantId[]}
			 */

			this.left = null;

			/**
			 * A list of world octant Identifiers that have entered the LOD shell.
			 *
			 * @type {WorldOctantId[]}
			 */

			this.entered = null;

			/**
			 * An error event.
			 *
			 * @type {ErrorEvent}
			 */

			this.error = null;

		}

	}

	/**
	 * Signals the end of a clipmap update for a single LOD shell.
	 *
	 * This event is dispatched by {@link Clipmap}.
	 *
	 * @type {ClipmapEvent}
	 * @example terrain.addEventListener("update", myListener);
	 */

	const update = new ClipmapEvent("update");

	/**
	 * Signals the occurrence of an unexpected error.
	 *
	 * This event is dispatched by {@link Clipmap}.
	 *
	 * @type {ClipmapEvent}
	 * @example terrain.addEventListener("error", myListener);
	 */

	const error = new ClipmapEvent("error");

	/**
	 * An enumeration of worker actions.
	 *
	 * @type {Object}
	 * @property {String} EXTRACT - Isosurface extraction signal.
	 * @property {String} MODIFY - Data modification signal.
	 * @property {String} CONFIGURE - General configuration signal.
	 * @property {String} CLOSE - Thread termination signal.
	 */

	/**
	 * A message.
	 *
	 * Messages are exchanged between different execution contexts such as a worker
	 * and the main thread.
	 */

	/**
	 * A collection of worker messages.
	 *
	 * @module rabbit-hole/worker/messages
	 */

	/**
	 * A worker event.
	 */

	class WorkerEvent extends Event {

		/**
		 * Constructs a new worker event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			super(type);

			/**
			 * A worker.
			 *
			 * @type {Worker}
			 */

			this.worker = null;

			/**
			 * A worker response.
			 *
			 * @type {Response}
			 */

			this.response = null;

		}

	}

	/**
	 * A worker message event.
	 *
	 * This event is dispatched by {@link ThreadPool}.
	 *
	 * @type {WorkerEvent}
	 * @example threadPool.addEventListener("message", myListener);
	 */

	const message = new WorkerEvent("message");

	/**
	 * A terrain event.
	 */

	class TerrainEvent extends Event {

		/**
		 * Constructs a new terrain event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			super(type);

			/**
			 * A world octant.
			 *
			 * @type {WorldOctant}
			 */

			this.octant = null;

			/**
			 * The Identifier of the world octant.
			 *
			 * @type {WorldOctantId}
			 */

			this.octantId = null;

			/**
			 * An error event.
			 *
			 * @type {ErrorEvent}
			 */

			this.error = null;

		}

	}

	/**
	 * Signals the start of a modification task.
	 *
	 * This event is dispatched by {@link Terrain}.
	 *
	 * @type {TerrainEvent}
	 * @example terrain.addEventListener("modificationstart", myListener);
	 */

	const modificationstart = new TerrainEvent("modificationstart");

	/**
	 * Signals the end of a modification task.
	 *
	 * This event is dispatched by {@link Terrain}.
	 *
	 * @type {TerrainEvent}
	 * @example terrain.addEventListener("modificationend", myListener);
	 */

	const modificationend = new TerrainEvent("modificationend");

	/**
	 * Signals the start of an extraction task.
	 *
	 * This event is dispatched by {@link Terrain}.
	 *
	 * @type {TerrainEvent}
	 * @example terrain.addEventListener("extractionstart", myListener);
	 */

	const extractionstart = new TerrainEvent("extractionstart");

	/**
	 * Signals the end of an extraction task.
	 *
	 * This event is dispatched by {@link Terrain}.
	 *
	 * @type {TerrainEvent}
	 * @example terrain.addEventListener("extractionend", myListener);
	 */

	const extractionend = new TerrainEvent("extractionend");

	/**
	 * Signals the end of a volume data loading process.
	 *
	 * This event is dispatched by {@link Terrain}.
	 *
	 * @type {TerrainEvent}
	 * @example terrain.addEventListener("load", myListener);
	 */

	const load$2 = new TerrainEvent("load");

	/**
	 * Signals the occurrence of an unexpected error.
	 *
	 * This event is dispatched by {@link Terrain}.
	 *
	 * @type {TerrainEvent}
	 * @example terrain.addEventListener("error", myListener);
	 */

	const error$1 = new TerrainEvent("error");

	/**
	 * Core components.
	 *
	 * @module rabbit-hole/core
	 */

	/**
	 * Geometry clipmap components.
	 *
	 * @module rabbit-hole/clipmap
	 */

	/**
	 * Data encoding and decoding components.
	 *
	 * @module rabbit-hole/codecs
	 */

	/**
	 * A collection of events.
	 *
	 * @module rabbit-hole/events
	 */

	/**
	 * An isosurface, the result of a contouring process.
	 *
	 * @implements {Serializable}
	 * @implements {Deserializable}
	 * @implements {TransferableContainer}
	 */

	class Isosurface {

		/**
		 * Constructs a new isosurface.
		 *
		 * @param {Uint16Array} indices - Triangle indices.
		 * @param {Float32Array} positions - Generated vertices.
		 * @param {Float32Array} normals - Generated normals.
		 * @param {Float32Array} uvs - Generated uvs.
		 * @param {Uint8Array} materials - Generated materials.
		 */

		constructor(indices, positions, normals, uvs, materials) {

			/**
			 * A set of vertex indices that describe triangles.
			 *
			 * @type {Uint16Array}
			 */

			this.indices = indices;

			/**
			 * A set of vertices.
			 *
			 * @type {Float32Array}
			 */

			this.positions = positions;

			/**
			 * A set of normals.
			 *
			 * @type {Float32Array}
			 */

			this.normals = normals;

			/**
			 * A set of UV coordinates.
			 *
			 * @type {Float32Array}
			 */

			this.uvs = uvs;

			/**
			 * A set of material indices.
			 *
			 * @type {Uint8Array}
			 */

			this.materials = materials;

		}

		/**
		 * Serialises this isosurface.
		 *
		 * @param {Boolean} [deflate=false] - Whether the data should be compressed if possible.
		 * @return {Object} The serialised data.
		 */

		serialize(deflate = false) {

			return {
				indices: this.indices,
				positions: this.positions,
				normals: this.normals,
				uvs: this.uvs,
				materials: this.materials
			};

		}

		/**
		 * Adopts the given serialised isosurface.
		 *
		 * @param {Object} object - A serialised isosurface. Can be null.
		 * @return {Deserializable} This object or null if the given serialised isosurface was null.
		 */

		deserialize(object) {

			let result = this;

			if(object !== null) {

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

		/**
		 * Creates a list of transferable items.
		 *
		 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
		 * @return {Transferable[]} The transfer list.
		 */

		createTransferList(transferList = []) {

			transferList.push(this.indices.buffer);
			transferList.push(this.positions.buffer);
			transferList.push(this.normals.buffer);
			transferList.push(this.uvs.buffer);
			transferList.push(this.materials.buffer);

			return transferList;

		}

	}

	/**
	 * An edge mask.
	 *
	 * @type {Uint8Array}
	 */

	/**
	 * A face mask for cell processing.
	 *
	 * @type {Uint8Array[]}
	 */

	const cellProcFaceMask = [

		new Uint8Array([0, 4, 0]),
		new Uint8Array([1, 5, 0]),
		new Uint8Array([2, 6, 0]),
		new Uint8Array([3, 7, 0]),
		new Uint8Array([0, 2, 1]),
		new Uint8Array([4, 6, 1]),
		new Uint8Array([1, 3, 1]),
		new Uint8Array([5, 7, 1]),
		new Uint8Array([0, 1, 2]),
		new Uint8Array([2, 3, 2]),
		new Uint8Array([4, 5, 2]),
		new Uint8Array([6, 7, 2])

	];

	/**
	 * An edge mask for cell processing.
	 *
	 * @type {Uint8Array[]}
	 */

	const cellProcEdgeMask = [

		new Uint8Array([0, 1, 2, 3, 0]),
		new Uint8Array([4, 5, 6, 7, 0]),
		new Uint8Array([0, 4, 1, 5, 1]),
		new Uint8Array([2, 6, 3, 7, 1]),
		new Uint8Array([0, 2, 4, 6, 2]),
		new Uint8Array([1, 3, 5, 7, 2])

	];

	/**
	 * A face mask for face processing.
	 *
	 * @type {Array<Uint8Array[]>}
	 */

	const faceProcFaceMask = [

		[
			new Uint8Array([4, 0, 0]),
			new Uint8Array([5, 1, 0]),
			new Uint8Array([6, 2, 0]),
			new Uint8Array([7, 3, 0])
		],

		[
			new Uint8Array([2, 0, 1]),
			new Uint8Array([6, 4, 1]),
			new Uint8Array([3, 1, 1]),
			new Uint8Array([7, 5, 1])
		],

		[
			new Uint8Array([1, 0, 2]),
			new Uint8Array([3, 2, 2]),
			new Uint8Array([5, 4, 2]),
			new Uint8Array([7, 6, 2])
		]

	];

	/**
	 * An edge mask for face processing.
	 *
	 * @type {Array<Uint8Array[]>}
	 */

	const faceProcEdgeMask = [

		[
			new Uint8Array([1, 4, 0, 5, 1, 1]),
			new Uint8Array([1, 6, 2, 7, 3, 1]),
			new Uint8Array([0, 4, 6, 0, 2, 2]),
			new Uint8Array([0, 5, 7, 1, 3, 2])
		],

		[
			new Uint8Array([0, 2, 3, 0, 1, 0]),
			new Uint8Array([0, 6, 7, 4, 5, 0]),
			new Uint8Array([1, 2, 0, 6, 4, 2]),
			new Uint8Array([1, 3, 1, 7, 5, 2])
		],

		[
			new Uint8Array([1, 1, 0, 3, 2, 0]),
			new Uint8Array([1, 5, 4, 7, 6, 0]),
			new Uint8Array([0, 1, 5, 0, 4, 1]),
			new Uint8Array([0, 3, 7, 2, 6, 1])
		]

	];

	/**
	 * An edge mask for edge processing.
	 *
	 * @type {Array<Uint8Array[]>}
	 */

	const edgeProcEdgeMask = [

		[
			new Uint8Array([3, 2, 1, 0, 0]),
			new Uint8Array([7, 6, 5, 4, 0])
		],

		[
			new Uint8Array([5, 1, 4, 0, 1]),
			new Uint8Array([7, 3, 6, 2, 1])
		],

		[
			new Uint8Array([6, 4, 2, 0, 2]),
			new Uint8Array([7, 5, 3, 1, 2])
		]

	];

	/**
	 * An edge mask.
	 *
	 * @type {Uint8Array[]}
	 */

	const procEdgeMask = [

		new Uint8Array([3, 2, 1, 0]),
		new Uint8Array([7, 5, 6, 4]),
		new Uint8Array([11, 10, 9, 8])

	];

	/**
	 * The maximum number of vertices. Vertex indices use 16 bits.
	 *
	 * @type {Number}
	 * @private
	 */

	const MAX_VERTEX_COUNT = Math.pow(2, 16) - 1;

	/**
	 * An edge contouring sub-procedure.
	 *
	 * @private
	 * @param {Array} octants - Four leaf octants.
	 * @param {Number} dir - A direction index.
	 * @param {Array} indexBuffer - An output list for vertex indices.
	 */

	function contourProcessEdge(octants, dir, indexBuffer) {

		const indices = [-1, -1, -1, -1];
		const signChange = [false, false, false, false];

		let minSize = Infinity;
		let minIndex = 0;
		let flip = false;

		let c1, c2, m1, m2;
		let octant, edge;
		let i;

		for(i = 0; i < 4; ++i) {

			octant = octants[i];
			edge = procEdgeMask[dir][i];

			c1 = edges$1[edge][0];
			c2 = edges$1[edge][1];

			m1 = (octant.voxel.materials >> c1) & 1;
			m2 = (octant.voxel.materials >> c2) & 1;

			if(octant.size < minSize) {

				minSize = octant.size;
				minIndex = i;
				flip = (m1 !== Material.AIR);

			}

			indices[i] = octant.voxel.index;
			signChange[i] = (m1 !== m2);

		}

		if(signChange[minIndex]) {

			if(!flip) {

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
	 * @private
	 * @param {Array} octants - Four edge octants.
	 * @param {Number} dir - A direction index.
	 * @param {Array} indexBuffer - An output list for vertex indices.
	 */

	function contourEdgeProc(octants, dir, indexBuffer) {

		const c = [0, 0, 0, 0];

		let edgeOctants;
		let octant;
		let i, j;

		if(octants[0].voxel !== null && octants[1].voxel !== null &&
			octants[2].voxel !== null && octants[3].voxel !== null) {

			contourProcessEdge(octants, dir, indexBuffer);

		} else {

			for(i = 0; i < 2; ++i) {

				c[0] = edgeProcEdgeMask[dir][i][0];
				c[1] = edgeProcEdgeMask[dir][i][1];
				c[2] = edgeProcEdgeMask[dir][i][2];
				c[3] = edgeProcEdgeMask[dir][i][3];

				edgeOctants = [];

				for(j = 0; j < 4; ++j) {

					octant = octants[j];

					if(octant.voxel !== null) {

						edgeOctants[j] = octant;

					} else if(octant.children !== null) {

						edgeOctants[j] = octant.children[c[j]];

					} else {

						break;

					}

				}

				if(j === 4) {

					contourEdgeProc(edgeOctants, edgeProcEdgeMask[dir][i][4], indexBuffer);

				}

			}

		}

	}

	/**
	 * A face contouring procedure.
	 *
	 * @private
	 * @param {Array} octants - Two face octants.
	 * @param {Number} dir - A direction index.
	 * @param {Array} indexBuffer - An output list for vertex indices.
	 */

	function contourFaceProc(octants, dir, indexBuffer) {

		const c = [0, 0, 0, 0];

		const orders = [
			[0, 0, 1, 1],
			[0, 1, 0, 1]
		];

		let faceOctants, edgeOctants;
		let order, octant;
		let i, j;

		if(octants[0].children !== null || octants[1].children !== null) {

			for(i = 0; i < 4; ++i) {

				c[0] = faceProcFaceMask[dir][i][0];
				c[1] = faceProcFaceMask[dir][i][1];

				faceOctants = [
					(octants[0].children === null) ? octants[0] : octants[0].children[c[0]],
					(octants[1].children === null) ? octants[1] : octants[1].children[c[1]]
				];

				contourFaceProc(faceOctants, faceProcFaceMask[dir][i][2], indexBuffer);

			}

			for(i = 0; i < 4; ++i) {

				c[0] = faceProcEdgeMask[dir][i][1];
				c[1] = faceProcEdgeMask[dir][i][2];
				c[2] = faceProcEdgeMask[dir][i][3];
				c[3] = faceProcEdgeMask[dir][i][4];

				order = orders[faceProcEdgeMask[dir][i][0]];

				edgeOctants = [];

				for(j = 0; j < 4; ++j) {

					octant = octants[order[j]];

					if(octant.voxel !== null) {

						edgeOctants[j] = octant;

					} else if(octant.children !== null) {

						edgeOctants[j] = octant.children[c[j]];

					} else {

						break;

					}

				}

				if(j === 4) {

					contourEdgeProc(edgeOctants, faceProcEdgeMask[dir][i][5], indexBuffer);

				}

			}

		}

	}

	/**
	 * The main contouring procedure.
	 *
	 * @private
	 * @param {Octant} octant - An octant.
	 * @param {Array} indexBuffer - An output list for vertex indices.
	 */

	function contourCellProc(octant, indexBuffer) {

		const children = octant.children;
		const c = [0, 0, 0, 0];

		let faceOctants, edgeOctants;
		let i;

		if(children !== null) {

			for(i = 0; i < 8; ++i) {

				contourCellProc(children[i], indexBuffer);

			}

			for(i = 0; i < 12; ++i) {

				c[0] = cellProcFaceMask[i][0];
				c[1] = cellProcFaceMask[i][1];

				faceOctants = [
					children[c[0]],
					children[c[1]]
				];

				contourFaceProc(faceOctants, cellProcFaceMask[i][2], indexBuffer);

			}

			for(i = 0; i < 6; ++i) {

				c[0] = cellProcEdgeMask[i][0];
				c[1] = cellProcEdgeMask[i][1];
				c[2] = cellProcEdgeMask[i][2];
				c[3] = cellProcEdgeMask[i][3];

				edgeOctants = [
					children[c[0]],
					children[c[1]],
					children[c[2]],
					children[c[3]]
				];

				contourEdgeProc(edgeOctants, cellProcEdgeMask[i][4], indexBuffer);

			}

		}

	}

	/**
	 * Collects positions and normals from the voxel information of the given octant
	 * and its children. The generated vertex indices are stored in the respective
	 * voxels during the octree traversal.
	 *
	 * @private
	 * @param {Octant} octant - An octant.
	 * @param {Array} positions - An array to be filled with vertices.
	 * @param {Array} normals - An array to be filled with normals.
	 * @param {Number} index - The next vertex index.
	 */

	function generateVertexIndices(octant, positions, normals, index) {

		let i, voxel;

		if(octant.children !== null) {

			for(i = 0; i < 8; ++i) {

				index = generateVertexIndices(octant.children[i], positions, normals, index);

			}

		} else if(octant.voxel !== null) {

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

	/**
	 * Dual Contouring is an isosurface extraction technique that was originally
	 * presented by Tao Ju in 2002:
	 *  http://www.cs.wustl.edu/~taoju/research/dualContour.pdf
	 */

	class DualContouring {

		/**
		 * Contours the given volume data.
		 *
		 * @param {SparseVoxelOctree} svo - A voxel octree.
		 * @return {Isosurface} The generated isosurface or null if no data was generated.
		 */

		static run(svo) {

			const indexBuffer = [];

			// Each voxel contains one vertex.
			const vertexCount = svo.voxelCount;

			let result = null;
			let positions = null;
			let normals = null;
			let uvs = null;
			let materials = null;

			if(vertexCount > MAX_VERTEX_COUNT) {

				console.warn(
					"Could not create geometry for cell at position", svo.min,
					"(vertex count of", vertexCount, "exceeds limit of ", MAX_VERTEX_COUNT, ")"
				);

			} else if(vertexCount > 0) {

				positions = new Float32Array(vertexCount * 3);
				normals = new Float32Array(vertexCount * 3);
				uvs = new Float32Array(vertexCount * 2);
				materials = new Uint8Array(vertexCount);

				generateVertexIndices(svo.root, positions, normals, 0);
				contourCellProc(svo.root, indexBuffer);

				result = new Isosurface(
					new Uint16Array(indexBuffer),
					positions,
					normals,
					uvs,
					materials
				);

			}

			return result;

		}

	}

	/**
	 * Isosurface extraction algorithms.
	 *
	 * @module rabbit-hole/isosurface
	 */

	/**
	 * A collection of loaders.
	 *
	 * @module rabbit-hole/loaders
	 */

	/**
	 * Symmetric Givens coefficients.
	 *
	 * @type {Vector2}
	 * @private
	 */

	const coefficients = new Vector2();

	/**
	 * A collection of matrix rotation utilities.
	 */

	class Givens {

		/**
		 * Calculates symmetric Givens coefficients.
		 *
		 * @param {Number} aPP - PP.
		 * @param {Number} aPQ - PQ.
		 * @param {Number} aQQ - QQ.
		 * @return {Vector2} The coefficients C and S.
		 */

		static calculateCoefficients(aPP, aPQ, aQQ) {

			let tau, stt, tan;

			if(aPQ === 0.0) {

				coefficients.x = 1.0;
				coefficients.y = 0.0;

			} else {

				tau = (aQQ - aPP) / (2.0 * aPQ);
				stt = Math.sqrt(1.0 + tau * tau);
				tan = 1.0 / ((tau >= 0.0) ? (tau + stt) : (tau - stt));

				coefficients.x = 1.0 / Math.sqrt(1.0 + tan * tan);
				coefficients.y = tan * coefficients.x;

			}

			return coefficients;

		}

	}

	/**
	 * A collection of matrix rotation utilities.
	 */

	class Schur {

		/**
		 * Rotates the given matrix.
		 *
		 * @param {Vector2} a - The vector that should be rotated.
		 * @param {Vector2} coefficients - Givens coefficients.
		 */

		static rotateXY(a, coefficients) {

			const c = coefficients.x;
			const s = coefficients.y;

			const u = a.x;
			const v = a.y;

			a.set(
				c * u - s * v,
				s * u + c * v
			);

		}

		/**
		 * Rotates the given matrix.
		 *
		 * @param {Vector2} a - The vector that should be rotated.
		 * @param {Vector2} q - A coefficient factor.
		 * @param {Vector2} coefficients - Givens coefficients.
		 */

		static rotateQXY(a, q, coefficients) {

			const c = coefficients.x;
			const s = coefficients.y;
			const cc = c * c;
			const ss = s * s;

			const mx = 2.0 * c * s * q;

			const u = a.x;
			const v = a.y;

			a.set(
				cc * u - mx + ss * v,
				ss * u + mx + cc * v
			);

		}

	}

	/**
	 * A threshold for pseudo inversions.
	 *
	 * @type {Number}
	 * @private
	 */

	const PSEUDOINVERSE_THRESHOLD = 1e-1;

	/**
	 * The number of SVD sweeps.
	 *
	 * @type {Number}
	 * @private
	 */

	const SVD_SWEEPS = 5;

	/**
	 * A symmetric matrix.
	 *
	 * @type {SymmetricMatrix3}
	 * @private
	 */

	const sm = new SymmetricMatrix3();

	/**
	 * A matrix.
	 *
	 * @type {Matrix3}
	 * @private
	 */

	const m$4 = new Matrix3();

	/**
	 * A vector.
	 *
	 * @type {Vector2}
	 * @private
	 */

	const a$3 = new Vector2();

	/**
	 * A vector that holds the singular values.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const b$9 = new Vector3();

	/**
	 * Rotates the matrix element from the first row, second column.
	 *
	 * @private
	 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
	 * @param {Matrix3} v - A matrix.
	 */

	function rotate01(vtav, v) {

		const se = vtav.elements;
		const ve = v.elements;

		let coefficients;

		if(se[1] !== 0.0) {

			coefficients = Givens.calculateCoefficients(se[0], se[1], se[3]);

			Schur.rotateQXY(a$3.set(se[0], se[3]), se[1], coefficients);
			se[0] = a$3.x; se[3] = a$3.y;

			Schur.rotateXY(a$3.set(se[2], se[4]), coefficients);
			se[2] = a$3.x; se[4] = a$3.y;

			se[1] = 0.0;

			Schur.rotateXY(a$3.set(ve[0], ve[3]), coefficients);
			ve[0] = a$3.x; ve[3] = a$3.y;

			Schur.rotateXY(a$3.set(ve[1], ve[4]), coefficients);
			ve[1] = a$3.x; ve[4] = a$3.y;

			Schur.rotateXY(a$3.set(ve[2], ve[5]), coefficients);
			ve[2] = a$3.x; ve[5] = a$3.y;

		}

	}

	/**
	 * Rotates the matrix element from the first row, third column.
	 *
	 * @private
	 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
	 * @param {Matrix3} v - A matrix.
	 */

	function rotate02(vtav, v) {

		const se = vtav.elements;
		const ve = v.elements;

		let coefficients;

		if(se[2] !== 0.0) {

			coefficients = Givens.calculateCoefficients(se[0], se[2], se[5]);

			Schur.rotateQXY(a$3.set(se[0], se[5]), se[2], coefficients);
			se[0] = a$3.x; se[5] = a$3.y;

			Schur.rotateXY(a$3.set(se[1], se[4]), coefficients);
			se[1] = a$3.x; se[4] = a$3.y;

			se[2] = 0.0;

			Schur.rotateXY(a$3.set(ve[0], ve[6]), coefficients);
			ve[0] = a$3.x; ve[6] = a$3.y;

			Schur.rotateXY(a$3.set(ve[1], ve[7]), coefficients);
			ve[1] = a$3.x; ve[7] = a$3.y;

			Schur.rotateXY(a$3.set(ve[2], ve[8]), coefficients);
			ve[2] = a$3.x; ve[8] = a$3.y;

		}

	}

	/**
	 * Rotates the matrix element from the second row, third column.
	 *
	 * @private
	 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
	 * @param {Matrix3} v - A matrix.
	 */

	function rotate12(vtav, v) {

		const se = vtav.elements;
		const ve = v.elements;

		let coefficients;

		if(se[4] !== 0.0) {

			coefficients = Givens.calculateCoefficients(se[3], se[4], se[5]);

			Schur.rotateQXY(a$3.set(se[3], se[5]), se[4], coefficients);
			se[3] = a$3.x; se[5] = a$3.y;

			Schur.rotateXY(a$3.set(se[1], se[2]), coefficients);
			se[1] = a$3.x; se[2] = a$3.y;

			se[4] = 0.0;

			Schur.rotateXY(a$3.set(ve[3], ve[6]), coefficients);
			ve[3] = a$3.x; ve[6] = a$3.y;

			Schur.rotateXY(a$3.set(ve[4], ve[7]), coefficients);
			ve[4] = a$3.x; ve[7] = a$3.y;

			Schur.rotateXY(a$3.set(ve[5], ve[8]), coefficients);
			ve[5] = a$3.x; ve[8] = a$3.y;

		}

	}

	/**
	 * Calculates the singular values.
	 *
	 * @private
	 * @param {SymmetricMatrix3} vtav - A symmetric matrix.
	 * @param {Matrix3} v - An identity matrix.
	 * @return {Vector3} The singular values.
	 */

	function solveSymmetric(vtav, v) {

		const e = vtav.elements;

		let i;

		for(i = 0; i < SVD_SWEEPS; ++i) {

			// Rotate the upper right (lower left) triagonal.
			rotate01(vtav, v);
			rotate02(vtav, v);
			rotate12(vtav, v);

		}

		return b$9.set(e[0], e[3], e[5]);

	}

	/**
	 * Computes the pseudo inverse of a given value.
	 *
	 * @private
	 * @param {Number} x - The value to invert.
	 * @return {Number} The inverted value.
	 */

	function invert(x) {

		const invX = (Math.abs(x) < PSEUDOINVERSE_THRESHOLD) ? 0.0 : 1.0 / x;

		return (Math.abs(invX) < PSEUDOINVERSE_THRESHOLD) ? 0.0 : invX;

	}

	/**
	 * Calculates the pseudo inverse of v using the singular values.
	 *
	 * @private
	 * @param {Matrix3} v - A matrix.
	 * @param {Vector3} sigma - The singular values.
	 * @return {Matrix3} The inverted matrix.
	 */

	function pseudoInverse(v, sigma) {

		const ve = v.elements;

		const v00 = ve[0], v01 = ve[3], v02 = ve[6];
		const v10 = ve[1], v11 = ve[4], v12 = ve[7];
		const v20 = ve[2], v21 = ve[5], v22 = ve[8];

		const d0 = invert(sigma.x);
		const d1 = invert(sigma.y);
		const d2 = invert(sigma.z);

		return v.set(

			// First row.
			v00 * d0 * v00 + v01 * d1 * v01 + v02 * d2 * v02,
			v00 * d0 * v10 + v01 * d1 * v11 + v02 * d2 * v12,
			v00 * d0 * v20 + v01 * d1 * v21 + v02 * d2 * v22,

			// Second row.
			v10 * d0 * v00 + v11 * d1 * v01 + v12 * d2 * v02,
			v10 * d0 * v10 + v11 * d1 * v11 + v12 * d2 * v12,
			v10 * d0 * v20 + v11 * d1 * v21 + v12 * d2 * v22,

			// Third row.
			v20 * d0 * v00 + v21 * d1 * v01 + v22 * d2 * v02,
			v20 * d0 * v10 + v21 * d1 * v11 + v22 * d2 * v12,
			v20 * d0 * v20 + v21 * d1 * v21 + v22 * d2 * v22

		);

	}

	/**
	 * A Singular Value Decomposition solver.
	 *
	 * Decomposes the given linear system into the matrices U, D and V and solves
	 * the equation: U D V^T x = b.
	 *
	 * See http://mathworld.wolfram.com/SingularValueDecomposition.html for more
	 * information.
	 */

	class SingularValueDecomposition {

		/**
		 * Performs the Singular Value Decomposition to solve the given linear system.
		 *
		 * @param {SymmetricMatrix3} ata - ATA. Will not be modified.
		 * @param {Vector3} atb - ATb. Will not be modified.
		 * @param {Vector3} x - A target vector to store the result in.
		 */

		static solve(ata, atb, x) {

			const sigma = solveSymmetric(sm.copy(ata), m$4.identity());
			const invV = pseudoInverse(m$4, sigma);

			x.copy(atb).applyMatrix3(invV);

		}

	}

	/**
	 * A point.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const p$3 = new Vector3();

	/**
	 * Computes the error of the approximated position.
	 *
	 * @private
	 * @param {SymmetricMatrix3} ata - ATA.
	 * @param {Vector3} atb - ATb.
	 * @param {Vector3} x - The calculated vertex position.
	 * @return {Number} The QEF error.
	 */

	function calculateError(ata, atb, x) {

		ata.applyToVector3(p$3.copy(x));
		p$3.subVectors(atb, p$3);

		return p$3.dot(p$3);

	}

	/**
	 * A Quaratic Error Function solver.
	 *
	 * Finds a point inside a voxel that minimises the sum of the squares of the
	 * distances to the surface intersection planes associated with the voxel.
	 *
	 * Based on an implementation by Leonard Ritter and Nick Gildea:
	 *  https://github.com/nickgildea/qef
	 */

	class QEFSolver {

		/**
		 * Constructs a new QEF solver.
		 */

		constructor() {

			/**
			 * QEF data. Will be used destructively.
			 *
			 * @type {QEFData}
			 * @private
			 */

			this.data = null;

			/**
			 * ATA.
			 *
			 * @type {SymmetricMatrix3}
			 * @private
			 */

			this.ata = new SymmetricMatrix3();

			/**
			 * ATb.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.atb = new Vector3();

			/**
			 * The mass point of the current QEF data set.
			 *
			 * @type {Vector3}
			 */

			this.massPoint = new Vector3();

			/**
			 * Indicates whether this solver has a solution.
			 *
			 * @type {Boolean}
			 */

			this.hasSolution = false;

		}

		/**
		 * Sets the QEF data.
		 *
		 * @param {QEFData} d - QEF Data.
		 * @return {QEFSolver} This solver.
		 */

		setData(d) {

			this.data = d;
			this.hasSolution = false;

			return this;

		}

		/**
		 * Solves the Quadratic Error Function.
		 *
		 * @param {Vector3} x - A target vector to store the vertex position in.
		 * @return {Number} The quadratic error of the solution.
		 */

		solve(x) {

			const data = this.data;
			const massPoint = this.massPoint;
			const ata = this.ata.copy(data.ata);
			const atb = this.atb.copy(data.atb);

			let error = Infinity;

			if(!this.hasSolution && data !== null && data.numPoints > 0) {

				// Divide the mass point sum to get the average.
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

	}

	/**
	 * A data container for the QEF solver.
	 */

	class QEFData {

		/**
		 * Constructs a new QEF data container.
		 */

		constructor() {

			/**
			 * A symmetric matrix.
			 *
			 * @type {SymmetricMatrix3}
			 * @private
			 */

			this.ata = new SymmetricMatrix3();

			this.ata.set(

				0, 0, 0,
				0, 0,
				0

			);

			/**
			 * A vector.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.atb = new Vector3();

			/**
			 * An accumulation of the surface intersection points.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.massPointSum = new Vector3();

			/**
			 * The amount of accumulated surface intersection points.
			 *
			 * @type {Number}
			 */

			this.numPoints = 0;

		}

		/**
		 * Sets the values of this data instance.
		 *
		 * @param {SymmetricMatrix3} ata - ATA.
		 * @param {Vector3} atb - ATb.
		 * @param {Vector3} massPointSum - The accumulated mass points.
		 * @param {Vector3} numPoints - The number of mass points.
		 * @return {QEFData} This data.
		 */

		set(ata, atb, massPointSum, numPoints) {

			this.ata.copy(ata);
			this.atb.copy(atb);

			this.massPointSum.copy(massPointSum);
			this.numPoints = numPoints;

			return this;

		}

		/**
		 * Copies values from a given data instance.
		 *
		 * @param {QEFData} d - The data to copy.
		 * @return {QEFData} This data.
		 */

		copy(d) {

			return this.set(d.ata, d.atb, d.massPointSum, d.numPoints);

		}

		/**
		 * Adds the given surface intersection point and normal.
		 *
		 * @param {Vector3} p - An intersection point.
		 * @param {Vector3} n - A surface intersection normal.
		 */

		add(p, n) {

			const nx = n.x;
			const ny = n.y;
			const nz = n.z;

			const b = p.dot(n);

			const ata = this.ata.elements;
			const atb = this.atb;

			ata[0] += nx * nx;
			ata[1] += nx * ny; ata[3] += ny * ny;
			ata[2] += nx * nz; ata[4] += ny * nz; ata[5] += nz * nz;

			atb.x += b * nx;
			atb.y += b * ny;
			atb.z += b * nz;

			this.massPointSum.add(p);

			++this.numPoints;

		}

		/**
		 * Adds an entire data set.
		 *
		 * @param {QEFData} d - QEF data.
		 */

		addData(d) {

			this.ata.add(d.ata);
			this.atb.add(d.atb);

			this.massPointSum.add(d.massPointSum);
			this.numPoints += d.numPoints;

		}

		/**
		 * Clears this data.
		 */

		clear() {

			this.ata.set(

				0, 0, 0,
				0, 0,
				0

			);

			this.atb.set(0, 0, 0);
			this.massPointSum.set(0, 0, 0);
			this.numPoints = 0;

		}

		/**
		 * Clones this data.
		 *
		 * @return {QEFData} The cloned data.
		 */

		clone() {

			return new this.constructor().copy(this);

		}

	}

	/**
	 * Mathematical system components.
	 *
	 * @module rabbit-hole/math
	 */

	/**
	 * A cubic voxel that holds information about the surface of a volume.
	 */

	class Voxel {

		/**
		 * Constructs a new voxel.
		 */

		constructor() {

			/**
			 * Holds binary material information about all eight corners of this voxel.
			 *
			 * A value of 0 means that this voxel is completely outside of the volume,
			 * whereas a value of 255 means that it's fully inside of it. Any other
			 * value indicates a material change which implies that the voxel contains
			 * the surface.
			 *
			 * @type {Number}
			 */

			this.materials = 0;

			/**
			 * The amount of edges that exhibit a material change in this voxel.
			 *
			 * @type {Number}
			 */

			this.edgeCount = 0;

			/**
			 * A generated index for this voxel's vertex. Used during the construction
			 * of the final polygons.
			 *
			 * @type {Number}
			 */

			this.index = -1;

			/**
			 * The vertex that lies inside this voxel.
			 *
			 * @type {Vector3}
			 */

			this.position = new Vector3();

			/**
			 * The normal of the vertex that lies inside this voxel.
			 *
			 * @type {Vector3}
			 */

			this.normal = new Vector3();

			/**
			 * A QEF data construct. Used to calculate the vertex position.
			 *
			 * @type {QEFData}
			 */

			this.qefData = null;

		}

	}

	/**
	 * A QEF solver.
	 *
	 * @type {QEFSolver}
	 * @private
	 */

	const qefSolver = new QEFSolver();

	/**
	 * A bias for boundary checks.
	 *
	 * @type {Number}
	 * @private
	 */

	const BIAS = 1e-1;

	/**
	 * An error threshold for QEF-based voxel clustering.
	 *
	 * @type {Number}
	 * @private
	 */

	let errorThreshold = -1;

	/**
	 * A voxel octant.
	 */

	class VoxelCell extends CubicOctant {

		/**
		 * Constructs a new voxel octant.
		 *
		 * @param {Vector3} [min] - The lower bounds of the octant.
		 * @param {Number} [size] - The size of the octant.
		 */

		constructor(min, size) {

			super(min, size);

			/**
			 * A voxel that contains draw information.
			 *
			 * @type {Voxel}
			 */

			this.voxel = null;

		}

		/**
		 * Checks if the given point lies inside this cell.
		 *
		 * @param {Vector3} p - A point.
		 * @return {Boolean} Whether the given point lies inside this cell.
		 */

		contains(p) {

			const min = this.min;
			const size = this.size;

			return (
				p.x >= min.x - BIAS &&
				p.y >= min.y - BIAS &&
				p.z >= min.z - BIAS &&
				p.x <= min.x + size + BIAS &&
				p.y <= min.y + size + BIAS &&
				p.z <= min.z + size + BIAS
			);

		}

		/**
		 * Attempts to simplify this cell.
		 *
		 * @return {Number} The amount of removed voxels.
		 */

		collapse() {

			const children = this.children;

			const signs = [
				-1, -1, -1, -1,
				-1, -1, -1, -1
			];

			const position = new Vector3();

			let midSign = -1;
			let collapsible = (children !== null);

			let removedVoxels = 0;

			let child, sign, voxel;
			let qefData, error;

			let v, i;

			if(collapsible) {

				qefData = new QEFData();

				for(v = 0, i = 0; i < 8; ++i) {

					child = children[i];
					removedVoxels += child.collapse();
					voxel = child.voxel;

					if(child.children !== null) {

						// Couldn't simplify the child.
						collapsible = false;

					} else if(voxel !== null) {

						qefData.addData(voxel.qefData);

						midSign = (voxel.materials >> (7 - i)) & 1;
						signs[i] = (voxel.materials >> i) & 1;

						++v;

					}

				}

				if(collapsible) {

					error = qefSolver.setData(qefData).solve(position);

					if(error <= errorThreshold) {

						voxel = new Voxel();
						voxel.position.copy(this.contains(position) ? position : qefSolver.massPoint);

						for(i = 0; i < 8; ++i) {

							sign = signs[i];
							child = children[i];

							if(sign === -1) {

								// Undetermined, use mid sign instead.
								voxel.materials |= (midSign << i);

							} else {

								voxel.materials |= (sign << i);

								// Accumulate normals.
								voxel.normal.add(child.voxel.normal);

							}

						}

						voxel.normal.normalize();
						voxel.qefData = qefData;

						this.voxel = voxel;
						this.children = null;

						// Removed existing voxels and created a new one.
						removedVoxels += v - 1;

					}

				}

			}

			return removedVoxels;

		}

		/**
		 * An error threshold for QEF-based voxel clustering (mesh simplification).
		 *
		 * @type {Number}
		 */

		static get errorThreshold() {

			return errorThreshold;

		}

		/**
		 * The mesh simplification error threshold.
		 *
		 * A bigger threshold allows more voxel cells to collapse which results in
		 * less vertices being created.
		 *
		 * An error threshold of -1 disables the mesh simplification.
		 *
		 * @type {Number}
		 */

		static set errorThreshold(value) {

			errorThreshold = value;

		}

	}

	/**
	 * Creates intermediate voxel cells down to the leaf octant that is described
	 * by the given local grid coordinates and returns it.
	 *
	 * @private
	 * @param {VoxelCell} cell - The root octant.
	 * @param {Number} n - The grid resolution.
	 * @param {Number} x - A local grid point X-coordinate.
	 * @param {Number} y - A local grid point Y-coordinate.
	 * @param {Number} z - A local grid point Z-coordinate.
	 * @return {VoxelCell} A leaf voxel cell.
	 */

	function getCell(cell, n, x, y, z) {

		let i = 0;

		for(n = n >> 1; n > 0; n >>= 1, i = 0) {

			// YZ.
			if(x >= n) {

				i += 4; x -= n;

			}

			// XZ.
			if(y >= n) {

				i += 2; y -= n;

			}

			// XY.
			if(z >= n) {

				i += 1; z -= n;

			}

			if(cell.children === null) {

				cell.split();

			}

			cell = cell.children[i];

		}

		return cell;

	}

	/**
	 * Creates a voxel and builds a material configuration code from the materials
	 * in the voxel corners.
	 *
	 * @private
	 * @param {Number} n - The grid resolution.
	 * @param {Number} x - A local grid point X-coordinate.
	 * @param {Number} y - A local grid point Y-coordinate.
	 * @param {Number} z - A local grid point Z-coordinate.
	 * @param {Uint8Array} materialIndices - The material indices.
	 * @return {Voxel} A voxel.
	 */

	function createVoxel(n, x, y, z, materialIndices) {

		const m = n + 1;
		const mm = m * m;

		const voxel = new Voxel();

		let materials, edgeCount;
		let material, offset, index;
		let c1, c2, m1, m2;

		let i;

		// Pack the material information of the eight corners into a single byte.
		for(materials = 0, i = 0; i < 8; ++i) {

			// Translate the coordinates into a one-dimensional grid point index.
			offset = pattern[i];
			index = (z + offset[2]) * mm + (y + offset[1]) * m + (x + offset[0]);

			// Convert the identified material index into a binary value.
			material = Math.min(materialIndices[index], Material.SOLID);

			// Store the value in bit i.
			materials |= (material << i);

		}

		// Find out how many edges intersect with the implicit surface.
		for(edgeCount = 0, i = 0; i < 12; ++i) {

			c1 = edges$1[i][0];
			c2 = edges$1[i][1];

			m1 = (materials >> c1) & 1;
			m2 = (materials >> c2) & 1;

			// Check if there is a material change on the edge.
			if(m1 !== m2) {

				++edgeCount;

			}

		}

		voxel.materials = materials;
		voxel.edgeCount = edgeCount;
		voxel.qefData = new QEFData();

		return voxel;

	}

	/**
	 * A sparse, cubic voxel octree.
	 */

	class SparseVoxelOctree extends Octree {

		/**
		 * Constructs a new voxel octree.
		 *
		 * @param {HermiteData} data - A set of volume data.
		 * @param {Vector3} [min] - The lower bounds of this octree.
		 * @param {Number} [size=1] - The size of this octree.
		 */

		constructor(data, min = new Vector3(), size = 1) {

			super();

			/**
			 * The root octant.
			 *
			 * @type {VoxelCell}
			 */

			this.root = new VoxelCell(min, size);

			/**
			 * The amount of voxels in this octree.
			 *
			 * @type {Number}
			 */

			this.voxelCount = 0;

			if(data !== null && data.edgeData !== null) {

				this.construct(data);

			}

			if(VoxelCell.errorThreshold >= 0) {

				this.simplify();

			}

		}

		/**
		 * Attempts to simplify the octree by clustering voxels.
		 *
		 * @private
		 */

		simplify() {

			this.voxelCount -= this.root.collapse();

		}

		/**
		 * Constructs voxel cells from volume data.
		 *
		 * @private
		 * @param {HermiteData} data - The volume data.
		 */

		construct(data) {

			const n = HermiteData.resolution;
			const edgeData = data.edgeData;
			const materialIndices = data.materialIndices;

			const qefSolver = new QEFSolver();
			const intersection = new Vector3();

			const edgeIterators = [
				edgeData.edgesX(this.min, this.root.size),
				edgeData.edgesY(this.min, this.root.size),
				edgeData.edgesZ(this.min, this.root.size)
			];

			const sequences = [
				new Uint8Array([0, 1, 2, 3]),
				new Uint8Array([0, 1, 4, 5]),
				new Uint8Array([0, 2, 4, 6])
			];

			let voxelCount = 0;

			let edges, edge;
			let sequence, offset;
			let cell, voxel;

			let x, y, z;
			let d, i;

			// Process edges X -> Y -> Z.
			for(d = 0; d < 3; ++d) {

				sequence = sequences[d];
				edges = edgeIterators[d];

				for(edge of edges) {

					edge.computeZeroCrossingPosition(intersection);

					// Each edge can belong to up to four voxel cells.
					for(i = 0; i < 4; ++i) {

						// Rotate around the edge.
						offset = pattern[sequence[i]];

						x = edge.coordinates.x - offset[0];
						y = edge.coordinates.y - offset[1];
						z = edge.coordinates.z - offset[2];

						// Check if the adjusted coordinates still lie inside the grid bounds.
						if(x >= 0 && y >= 0 && z >= 0 && x < n && y < n && z < n) {

							cell = getCell(this.root, n, x, y, z);

							if(cell.voxel === null) {

								// The existence of the edge guarantees that the voxel contains the surface.
								cell.voxel = createVoxel(n, x, y, z, materialIndices);

								++voxelCount;

							}

							// Add the edge data to the voxel.
							voxel = cell.voxel;
							voxel.normal.add(edge.n);
							voxel.qefData.add(intersection, edge.n);

							if(voxel.qefData.numPoints === voxel.edgeCount) {

								// Finalise the voxel by solving the accumulated data.
								qefSolver.setData(voxel.qefData).solve(voxel.position);

								if(!cell.contains(voxel.position)) {

									voxel.position.copy(qefSolver.massPoint);

								}

								voxel.normal.normalize();

							}

						}

					}

				}

			}

			this.voxelCount = voxelCount;

		}

	}

	/**
	 * Space partitioning components used for contouring.
	 *
	 * @module rabbit-hole/octree/voxel
	 */

	/**
	 * World octree space partitioning components.
	 *
	 * @module rabbit-hole/octree/world
	 */

	/**
	 * Space partitioning components.
	 *
	 * @module rabbit-hole/octree
	 */

	/**
	 * Utility components.
	 *
	 * @module rabbit-hole/utils
	 */

	/**
	 * The world size of the current data cell.
	 *
	 * @type {Number}
	 * @private
	 */

	let cellSize = 0;

	/**
	 * The lower bounds of the current data cell.
	 *
	 * @type {Vector3}
	 * @private
	 */

	const cellPosition = new Vector3();

	/**
	 * Finds out which grid points lie inside the area of the given operation.
	 *
	 * @private
	 * @param {Operation} operation - A CSG operation.
	 * @return {Box3} The index bounds.
	 */

	function computeIndexBounds(operation) {

		const s = cellSize;
		const n = HermiteData.resolution;

		const min = new Vector3(0, 0, 0);
		const max = new Vector3(n, n, n);

		const cellBounds = new Box3(cellPosition, cellPosition.clone().addScalar(cellSize));
		const operationBounds = operation.getBoundingBox();

		if(operation.type !== OperationType.INTERSECTION) {

			if(operationBounds.intersectsBox(cellBounds)) {

				min.copy(operationBounds.min).max(cellBounds.min).sub(cellBounds.min);

				min.x = Math.ceil(min.x * n / s);
				min.y = Math.ceil(min.y * n / s);
				min.z = Math.ceil(min.z * n / s);

				max.copy(operationBounds.max).min(cellBounds.max).sub(cellBounds.min);

				max.x = Math.floor(max.x * n / s);
				max.y = Math.floor(max.y * n / s);
				max.z = Math.floor(max.z * n / s);

			} else {

				// The chunk is unaffected by this operation.
				min.set(n, n, n);
				max.set(0, 0, 0);

			}

		}

		return new Box3(min, max);

	}

	/**
	 * Combines material indices.
	 *
	 * @private
	 * @param {Operation} operation - A CSG operation.
	 * @param {HermiteData} data0 - A target data set.
	 * @param {HermiteData} data1 - A predominant data set.
	 * @param {Box3} bounds - Grid iteration limits.
	 */

	function combineMaterialIndices(operation, data0, data1, bounds) {

		const n = HermiteData.resolution;
		const m = n + 1;
		const mm = m * m;

		const X = bounds.max.x;
		const Y = bounds.max.y;
		const Z = bounds.max.z;

		let x, y, z;

		for(z = bounds.min.z; z <= Z; ++z) {

			for(y = bounds.min.y; y <= Y; ++y) {

				for(x = bounds.min.x; x <= X; ++x) {

					operation.updateMaterialIndex((z * mm + y * m + x), data0, data1);

				}

			}

		}

	}

	/**
	 * Generates material indices.
	 *
	 * @private
	 * @param {DensityFunction} operation - A CSG operation.
	 * @param {HermiteData} data - A target data set.
	 * @param {Box3} bounds - Grid iteration limits.
	 */

	function generateMaterialIndices(operation, data, bounds) {

		const s = cellSize;
		const n = HermiteData.resolution;
		const m = n + 1;
		const mm = m * m;

		const materialIndices = data.materialIndices;

		const base = cellPosition;
		const offset = new Vector3();
		const position = new Vector3();

		const X = bounds.max.x;
		const Y = bounds.max.y;
		const Z = bounds.max.z;

		let materialIndex;
		let materials = 0;

		let x, y, z;

		for(z = bounds.min.z; z <= Z; ++z) {

			offset.z = z * s / n;

			for(y = bounds.min.y; y <= Y; ++y) {

				offset.y = y * s / n;

				for(x = bounds.min.x; x <= X; ++x) {

					offset.x = x * s / n;

					materialIndex = operation.generateMaterialIndex(position.addVectors(base, offset));

					if(materialIndex !== Material.AIR) {

						materialIndices[z * mm + y * m + x] = materialIndex;

						++materials;

					}

				}

			}

		}

		data.materials = materials;

	}

	/**
	 * Combines edges.
	 *
	 * @private
	 * @param {Operation} operation - A CSG operation.
	 * @param {HermiteData} data0 - A target data set.
	 * @param {HermiteData} data1 - A predominant data set.
	 * @return {Object} The generated edge data.
	 */

	function combineEdges(operation, data0, data1) {

		const n = HermiteData.resolution;
		const m = n + 1;
		const mm = m * m;

		const indexOffsets = new Uint32Array([1, m, mm]);
		const materialIndices = data0.materialIndices;

		const edge1 = new Edge();
		const edge0 = new Edge();

		const edgeData1 = data1.edgeData;
		const edgeData0 = data0.edgeData;

		const lengths = new Uint32Array(3);
		const edgeCount = EdgeData.calculate1DEdgeCount(n);

		const edgeData = new EdgeData(
			n,
			Math.min(edgeCount, edgeData0.indices[0].length + edgeData1.indices[0].length),
			Math.min(edgeCount, edgeData0.indices[1].length + edgeData1.indices[1].length),
			Math.min(edgeCount, edgeData0.indices[2].length + edgeData1.indices[2].length)
		);

		let edges1, zeroCrossings1, normals1;
		let edges0, zeroCrossings0, normals0;
		let edges, zeroCrossings, normals;
		let indexOffset;

		let indexA1, indexB1;
		let indexA0, indexB0;

		let m1, m2;
		let edge;

		let c, d, i, j, il, jl;

		// Process the edges along the X-axis, then Y and finally Z.
		for(c = 0, d = 0; d < 3; c = 0, ++d) {

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

			// Process all generated edges.
			for(i = 0, j = 0; i < il; ++i) {

				indexA1 = edges1[i];
				indexB1 = indexA1 + indexOffset;

				m1 = materialIndices[indexA1];
				m2 = materialIndices[indexB1];

				if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

					edge1.t = zeroCrossings1[i];
					edge1.n.x = normals1[i * 3];
					edge1.n.y = normals1[i * 3 + 1];
					edge1.n.z = normals1[i * 3 + 2];

					if(operation.type === OperationType.DIFFERENCE) {

						edge1.n.negate();

					}

					edge = edge1;

					// Process existing edges up to the generated edge.
					while(j < jl && edges0[j] <= indexA1) {

						indexA0 = edges0[j];
						indexB0 = indexA0 + indexOffset;

						edge0.t = zeroCrossings0[j];
						edge0.n.x = normals0[j * 3];
						edge0.n.y = normals0[j * 3 + 1];
						edge0.n.z = normals0[j * 3 + 2];

						m1 = materialIndices[indexA0];

						if(indexA0 < indexA1) {

							m2 = materialIndices[indexB0];

							if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

								// The edge exhibits a material change and there is no conflict.
								edges[c] = indexA0;
								zeroCrossings[c] = edge0.t;
								normals[c * 3] = edge0.n.x;
								normals[c * 3 + 1] = edge0.n.y;
								normals[c * 3 + 2] = edge0.n.z;

								++c;

							}

						} else {

							// Resolve the conflict.
							edge = operation.selectEdge(edge0, edge1, (m1 === Material.SOLID));

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

			// Collect remaining edges.
			while(j < jl) {

				indexA0 = edges0[j];
				indexB0 = indexA0 + indexOffset;

				m1 = materialIndices[indexA0];
				m2 = materialIndices[indexB0];

				if(m1 !== m2 && (m1 === Material.AIR || m2 === Material.AIR)) {

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

		return { edgeData, lengths };

	}

	/**
	 * Generates edge data.
	 *
	 * @private
	 * @param {DensityFunction} operation - A CSG operation.
	 * @param {HermiteData} data - A target data set.
	 * @param {Box3} bounds - Grid iteration limits.
	 * @return {Object} The generated edge data.
	 */

	function generateEdges(operation, data, bounds) {

		const s = cellSize;
		const n = HermiteData.resolution;
		const m = n + 1;
		const mm = m * m;

		const indexOffsets = new Uint32Array([1, m, mm]);
		const materialIndices = data.materialIndices;

		const base = cellPosition;
		const offsetA = new Vector3();
		const offsetB = new Vector3();
		const edge = new Edge();

		const lengths = new Uint32Array(3);
		const edgeData = new EdgeData(n, EdgeData.calculate1DEdgeCount(n));

		let edges, zeroCrossings, normals, indexOffset;
		let indexA, indexB;

		let minX, minY, minZ;
		let maxX, maxY, maxZ;

		let c, d, a, axis;
		let x, y, z;

		// Process the edges along the X-axis, then Y and finally Z.
		for(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {

			// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
			axis = pattern[a];

			edges = edgeData.indices[d];
			zeroCrossings = edgeData.zeroCrossings[d];
			normals = edgeData.normals[d];
			indexOffset = indexOffsets[d];

			minX = bounds.min.x; maxX = bounds.max.x;
			minY = bounds.min.y; maxY = bounds.max.y;
			minZ = bounds.min.z; maxZ = bounds.max.z;

			/* Include edges that straddle the bounding box and avoid processing grid
			points at chunk borders. */
			switch(d) {

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

			for(z = minZ; z <= maxZ; ++z) {

				for(y = minY; y <= maxY; ++y) {

					for(x = minX; x <= maxX; ++x) {

						indexA = z * mm + y * m + x;
						indexB = indexA + indexOffset;

						// Check if the edge exhibits a material change.
						if(materialIndices[indexA] !== materialIndices[indexB]) {

							offsetA.set(
								x * s / n,
								y * s / n,
								z * s / n
							);

							offsetB.set(
								(x + axis[0]) * s / n,
								(y + axis[1]) * s / n,
								(z + axis[2]) * s / n
							);

							edge.a.addVectors(base, offsetA);
							edge.b.addVectors(base, offsetB);

							// Create and store the edge data.
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

		return { edgeData, lengths };

	}

	/**
	 * Either generates or combines volume data based on the operation type.
	 *
	 * @private
	 * @param {Operation} operation - A CSG operation.
	 * @param {HermiteData} data0 - A target data set. May be empty or full.
	 * @param {HermiteData} [data1] - A predominant data set. Cannot be null.
	 */

	function update$1(operation, data0, data1) {

		const bounds = computeIndexBounds(operation);

		let result, edgeData, lengths, d;
		let done = false;

		// Grid points.
		if(operation.type === OperationType.DENSITY_FUNCTION) {

			generateMaterialIndices(operation, data0, bounds);

		} else if(data0.empty) {

			if(operation.type === OperationType.UNION) {

				data0.set(data1);
				done = true;

			}

		} else {

			if(!(data0.full && operation.type === OperationType.UNION)) {

				combineMaterialIndices(operation, data0, data1, bounds);

			}

		}

		// Edges.
		if(!done && !data0.empty && !data0.full) {

			result = (operation.type === OperationType.DENSITY_FUNCTION) ?
				generateEdges(operation, data0, bounds) :
				combineEdges(operation, data0, data1);

			edgeData = result.edgeData;
			lengths = result.lengths;

			// Cut off empty data.
			for(d = 0; d < 3; ++d) {

				edgeData.indices[d] = edgeData.indices[d].slice(0, lengths[d]);
				edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, lengths[d]);
				edgeData.normals[d] = edgeData.normals[d].slice(0, lengths[d] * 3);

			}

			data0.edgeData = edgeData;

		}

	}

	/**
	 * Executes the given operation to generate data.
	 *
	 * @private
	 * @param {Operation} operation - An operation.
	 * @return {HermiteData} The generated data or null if the data is empty.
	 */

	function execute(operation) {

		const children = operation.children;

		let result, data;
		let i, l;

		if(operation.type === OperationType.DENSITY_FUNCTION) {

			// Create a data target.
			result = new HermiteData();

			// Use the density function to generate data.
			update$1(operation, result);

		}

		// Union, Difference or Intersection.
		for(i = 0, l = children.length; i < l; ++i) {

			// Generate the full result of the child operation recursively.
			data = execute(children[i]);

			if(result === undefined) {

				result = data;

			} else if(data !== null) {

				if(result === null) {

					if(operation.type === OperationType.UNION) {

						// Build upon the first non-empty data.
						result = data;

					}

				} else {

					// Combine the two data sets.
					update$1(operation, result, data);

				}

			} else if(operation.type === OperationType.INTERSECTION) {

				// An intersection with nothing results in nothing.
				result = null;

			}

			if(result === null && operation.type !== OperationType.UNION) {

				// Further subtractions and intersections would have no effect.
				break;

			}

		}

		return (result !== null && result.empty) ? null : result;

	}

	/**
	 * Constructive Solid Geometry combines Signed Distance Functions by using
	 * Boolean operators to generate and transform volume data.
	 */

	class ConstructiveSolidGeometry {

		/**
		 * Transforms the given Hermite data in two steps:
		 *
		 *  1. Generate data by executing the given SDF
		 *  2. Combine the generated data with the given data
		 *
		 * @param {Number[]} min - The lower bounds of the volume data cell.
		 * @param {Number} size - The size of the volume data cell.
		 * @param {HermiteData} data - The volume data that should be modified.
		 * @param {SignedDistanceFunction} sdf - An SDF.
		 * @return {HermiteData} The modified, uncompressed data or null if the result is empty.
		 */

		static run(min, size, data, sdf) {

			cellPosition.fromArray(min);
			cellSize = size;

			if(data === null) {

				if(sdf.operation === OperationType.UNION) {

					// Prepare an empty target.
					data = new HermiteData(false);

				}

			} else {

				data.decompress();

			}

			// Step 1.
			let operation = sdf.toCSG();

			const generatedData = (data !== null) ? execute(operation) : null;

			if(generatedData !== null) {

				// Wrap the operation in a super operation.
				switch(sdf.operation) {

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

				// Step 2.
				update$1(operation, data, generatedData);

				// Provoke an isosurface extraction.
				data.contoured = false;

			}

			return (data !== null && data.empty) ? null : data;

		}

	}

	/**
	 * A collection of Constructive Solid Geometry components.
	 *
	 * @module rabbit-hole/volume/csg
	 */

	/**
	 * A collection of Signed Distance Function components.
	 *
	 * @module rabbit-hole/volume/sdf
	 */

	/**
	 * Volume management components.
	 *
	 * @module rabbit-hole/volume
	 */

	/**
	 * Multithreading components.
	 *
	 * @module rabbit-hole/worker
	 */

	/**
	 * Exposure of the library components.
	 *
	 * @module rabbit-hole
	 */

	/**
	 * A contouring demo setup.
	 */

	class ContouringDemo extends Demo {

		/**
		 * Constructs a new contouring demo.
		 */

		constructor() {

			super("contouring");

			/**
			 * The data cell size.
			 *
			 * @type {Number}
			 * @private
			 */

			this.cellSize = 1;

			/**
			 * The data cell position.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.cellPosition = new three.Vector3();
			this.cellPosition.subScalar(this.cellSize / 2);

			/**
			 * Determines which SDF type to use for the generation of Hermite data.
			 *
			 * @type {SDFType}
			 * @private
			 */

			this.sdfType = SDFType.SUPER_PRIMITIVE;

			/**
			 * Euler angles.
			 *
			 * @type {Euler}
			 * @private
			 */

			this.euler = new Euler();

			/**
			 * The SDF scale.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.scale = new three.Vector3();

			/**
			 * The current Super Primitive preset.
			 *
			 * @type {SuperPrimitivePreset}
			 * @private
			 */

			this.superPrimitivePreset = SuperPrimitivePreset.TORUS;

			/**
			 * A heightfield.
			 *
			 * @type {Heightfield}
			 * @private
			 */

			this.heightfield = new Heightfield();

			/**
			 * A set of Hermite data.
			 *
			 * @type {HermiteData}
			 * @private
			 */

			this.hermiteData = null;

			/**
			 * An octree helper.
			 *
			 * @type {OctreeHelper}
			 * @private
			 */

			this.octreeHelper = new OctreeHelper();

			/**
			 * A Hermite data helper.
			 *
			 * @type {HermiteDataHelper}
			 * @private
			 */

			this.hermiteDataHelper = new HermiteDataHelper();

			/**
			 * An AABB helper.
			 *
			 * @type {Box3Helper}
			 * @private
			 */

			this.box3Helper = new three.Box3Helper();

			/**
			 * A material.
			 *
			 * @type {MeshPhysicalMaterial}
			 * @private
			 */

			this.material = new three.MeshPhysicalMaterial({
				color: 0x009188,
				metalness: 0.23,
				roughness: 0.31,
				clearCoat: 0.94,
				clearCoatRoughness: 0.15,
				dithering: true
			});

			/**
			 * A generated mesh.
			 *
			 * @type {Mesh}
			 * @private
			 */

			this.mesh = null;

			/**
			 * The current amount of generated vertices.
			 *
			 * @type {Number}
			 * @private
			 */

			this.vertices = 0;

			/**
			 * The current amount of generated faces.
			 *
			 * @type {Number}
			 * @private
			 */

			this.faces = 0;

		}

		/**
		 * Creates a new SVO and updates the octree helper.
		 *
		 * @private
		 */

		createSVO() {

			const octreeHelper = this.octreeHelper;

			octreeHelper.octree = new SparseVoxelOctree(this.hermiteData, this.cellPosition, this.cellSize);
			octreeHelper.update();

			// Customise colour and visibility.
			((octreeHelper) => {

				const groups = octreeHelper.children;

				let group, children, child, color;
				let i, j, il, jl;

				for(i = 0, il = groups.length; i < il; ++i) {

					group = groups[i];
					children = group.children;
					color = (i + 1 < il) ? 0x303030 : 0xbb3030;

					for(j = 0, jl = children.length; j < jl; ++j) {

						child = children[j];
						child.material.color.setHex(color);

					}

				}

			})(octreeHelper);

		}

		/**
		 * Creates new Hermite data using the current SDF preset.
		 *
		 * @private
		 * @return {HermiteData} The generated data.
		 */

		createHermiteData() {

			let sdf;

			switch(this.sdfType) {

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
			this.hermiteData = ConstructiveSolidGeometry.run(
				this.cellPosition.toArray(),
				this.cellSize,
				null,
				sdf.setOperationType(OperationType.UNION)
			);

			return this.hermiteData;

		}

		/**
		 * Extracts an isosurface form the current SVO.
		 *
		 * @private
		 */

		contour() {

			const isosurface = DualContouring.run(this.octreeHelper.octree);

			let mesh, geometry;

			if(isosurface !== null) {

				if(this.mesh !== null) {

					this.mesh.geometry.dispose();
					this.scene.remove(this.mesh);

				}

				geometry = new three.BufferGeometry();
				geometry.setIndex(new three.BufferAttribute(isosurface.indices, 1));
				geometry.addAttribute("position", new three.BufferAttribute(isosurface.positions, 3));
				geometry.addAttribute("normal", new three.BufferAttribute(isosurface.normals, 3));
				mesh = new three.Mesh(geometry, this.material);

				// Statistics.
				this.vertices = isosurface.positions.length / 3;
				this.faces = isosurface.indices.length / 3;

				this.mesh = mesh;
				this.scene.add(mesh);

			}

		}

		/**
		 * Loads scene assets.
		 *
		 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
		 */

		load() {

			const assets = this.assets;
			const loadingManager = this.loadingManager;
			const cubeTextureLoader = new three.CubeTextureLoader(loadingManager);
			const textureLoader = new three.TextureLoader(loadingManager);

			const path = "textures/skies/interstellar/";
			const format = ".jpg";
			const urls = [
				path + "px" + format, path + "nx" + format,
				path + "py" + format, path + "ny" + format,
				path + "pz" + format, path + "nz" + format
			];

			return new Promise((resolve, reject) => {

				if(assets.size === 0) {

					loadingManager.onError = reject;
					loadingManager.onProgress = (item, loaded, total) => {

						if(loaded === total) {

							resolve();

						}

					};

					cubeTextureLoader.load(urls, (textureCube) => {

						assets.set("sky", textureCube);

					});

					textureLoader.load("textures/height/03.png", (texture) => {

						assets.set("heightmap", texture);

					});

				} else {

					resolve();

				}

			});

		}

		/**
		 * Creates the scene.
		 */

		initialize() {

			const scene = this.scene;
			const assets = this.assets;
			const renderer = this.renderer;

			// Default settings.

			this.sdfType = SDFType.SUPER_PRIMITIVE;
			this.euler.set(4.11, 3.56, 4.74, RotationOrder.XYZ);
			this.scale.set(0.34, 0.47, 0.25);
			this.superPrimitivePreset = SuperPrimitivePreset.TORUS;

			// Camera.

			const camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 25);
			camera.position.set(0, 0, -2);
			this.camera = camera;

			// Controls.

			const controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
			controls.settings.pointer.lock = false;
			controls.settings.sensitivity.rotation = 0.00175;
			controls.settings.sensitivity.translation = 0.425;
			controls.settings.sensitivity.zoom = 0.2;
			controls.settings.zoom.maxDistance = 20;
			controls.lookAt(scene.position);
			this.controls = controls;

			// Fog.

			scene.fog = new three.FogExp2(0xf4f4f4, 0.075);
			renderer.setClearColor(scene.fog.color);

			// Sky.

			scene.background = assets.get("sky");
			this.material.envMap = assets.get("sky");

			// Lights.

			const ambientLight = new three.AmbientLight(0x404040);
			const directionalLight = new three.DirectionalLight(0xffbbaa);

			directionalLight.position.set(-0.5, 1.5, 1);
			directionalLight.target.position.copy(scene.position);

			scene.add(directionalLight);
			scene.add(ambientLight);

			// Load the heightfield.

			this.heightfield.fromImage(assets.get("heightmap").image);

			// Hermite Data, SDF and CSG.

			HermiteData.resolution = 64;
			HermiteDataHelper.air = Material.AIR;
			VoxelCell.errorThreshold = 0.005;
			this.createHermiteData();

			// Octree Helper.

			this.octreeHelper.visible = true;
			scene.add(this.octreeHelper);

			// Hermite Data Helper.

			scene.add(this.hermiteDataHelper);

			// SDF AABB Helper.

			scene.add(this.box3Helper);

			// Sparse Voxel Octree.

			this.createSVO();

			// Visualise the data cell.

			const box = new three.Box3();
			const halfSize = this.cellSize / 2;
			box.min.set(-halfSize, -halfSize, -halfSize);
			box.max.set(halfSize, halfSize, halfSize);

			const boxHelper = new three.Box3Helper(box, 0x303030);
			boxHelper.material.transparent = true;
			boxHelper.material.opacity = 0.25;
			scene.add(boxHelper);

		}

		/**
		 * Renders this demo.
		 *
		 * @param {Number} delta - The time since the last frame in seconds.
		 */

		render(delta) {

			this.controls.update(delta);

			super.render(delta);

		}

		/**
		 * Registers configuration options.
		 *
		 * @param {GUI} menu - A menu.
		 */

		registerOptions(menu) {

			const octreeHelper = this.octreeHelper;
			const hermiteDataHelper = this.hermiteDataHelper;
			const box3Helper = this.box3Helper;
			const presets = Object.keys(SuperPrimitivePreset).concat(["HEIGHTFIELD"]);

			const params = {

				"SDF": presets[this.superPrimitivePreset],
				"color": this.material.color.getHex(),
				"level mask": octreeHelper.children.length,

				"show SVO": () => {

					if(params.SDF !== "HEIGHTFIELD") {

						this.superPrimitivePreset = SuperPrimitivePreset[params.SDF];
						this.sdfType = SDFType.SUPER_PRIMITIVE;

					} else {

						this.sdfType = SDFType.HEIGHTFIELD;

					}

					this.createHermiteData();
					this.createSVO();

					if(this.mesh !== null) {

						this.scene.remove(this.mesh);

					}

					hermiteDataHelper.dispose();
					octreeHelper.visible = true;
					box3Helper.visible = true;
					params["level mask"] = octreeHelper.children.length;

				},

				"show Hermite data": () => {

					hermiteDataHelper.set(this.cellPosition, this.cellSize, this.hermiteData);

					try {

						hermiteDataHelper.update();

						hermiteDataHelper.visible = true;
						octreeHelper.visible = false;
						box3Helper.visible = false;

					} catch(e) {

						console.error(e);

					}

				},

				"contour": () => {

					this.createHermiteData();
					this.createSVO();
					this.contour();

					octreeHelper.visible = false;
					hermiteDataHelper.visible = false;
					box3Helper.visible = false;

				}

			};

			menu.add(params, "SDF", presets).onChange(params["show SVO"]);

			let folder = menu.addFolder("Octree Helper");
			folder.add(params, "level mask").min(0).max(1 + Math.log2(128)).step(1).onChange(() => {

				let i, l;

				for(i = 0, l = octreeHelper.children.length; i < l; ++i) {

					octreeHelper.children[i].visible = (params["level mask"] >= octreeHelper.children.length || i === params["level mask"]);

				}

			}).listen();

			folder = menu.addFolder("Transformation");

			let subFolder = folder.addFolder("Rotation");
			subFolder.add(this.euler, "x").min(0.0).max(Math.PI * 2).step(0.0001);
			subFolder.add(this.euler, "y").min(0.0).max(Math.PI * 2).step(0.0001);
			subFolder.add(this.euler, "z").min(0.0).max(Math.PI * 2).step(0.0001);

			subFolder = folder.addFolder("Scale");
			subFolder.add(this.scale, "x").min(0.0).max(0.5).step(0.0001);
			subFolder.add(this.scale, "y").min(0.0).max(0.5).step(0.0001);
			subFolder.add(this.scale, "z").min(0.0).max(0.5).step(0.0001);

			folder = menu.addFolder("Material");
			folder.add(this.material, "metalness").min(0.0).max(1.0).step(0.0001);
			folder.add(this.material, "roughness").min(0.0).max(1.0).step(0.0001);
			folder.add(this.material, "clearCoat").min(0.0).max(1.0).step(0.0001);
			folder.add(this.material, "clearCoatRoughness").min(0.0).max(1.0).step(0.0001);
			folder.add(this.material, "reflectivity").min(0.0).max(1.0).step(0.0001);
			folder.addColor(params, "color").onChange(() => this.material.color.setHex(params.color));
			folder.add(this.material, "wireframe");
			folder.add(this.material, "flatShading").onChange(() => {

				this.material.needsUpdate = true;

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

	}

	/**
	 * A data event.
	 */

	class DataEvent extends Event {

		/**
		 * Constructs a new data event.
		 *
		 * @param {String} type - The name of the event.
		 */

		constructor(type) {

			super(type);

			/**
			 * A set of QEF data.
			 *
			 * @type {QEFData}
			 * @default null
			 */

			this.qefData = null;

		}

	}

	/**
	 * A mouse position.
	 *
	 * @type {Vector2}
	 * @private
	 */

	const mouse = new three.Vector2();

	/**
	 * An update event.
	 *
	 * @type {Event}
	 * @private
	 */

	const updateEvent = new Event("update");

	/**
	 * A visual grid point editor.
	 *
	 * @implements {EventListener}
	 */

	class GridPointEditor extends EventTarget {

		/**
		 * Constructs a new grid point editor.
		 *
		 * @param {Vector3} cellPosition - The position of the data cell.
		 * @param {Number} cellSize - The size of the data cell.
		 * @param {HermiteData} hermiteData - A set of Hermite data.
		 * @param {PerspectiveCamera} camera - A camera.
		 * @param {Element} [dom=document.body] - A dom element.
		 */

		constructor(cellPosition, cellSize, hermiteData, camera, dom = document.body) {

			super();

			/**
			 * The Hermite data.
			 *
			 * @type {HermiteData}
			 * @private
			 */

			this.hermiteData = hermiteData;

			/**
			 * The position of the data cell.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.cellPosition = cellPosition;

			/**
			 * The size of the data cell.
			 *
			 * @type {Number}
			 * @private
			 */

			this.cellSize = cellSize;

			/**
			 * A camera.
			 *
			 * @type {PerspectiveCamera}
			 * @private
			 */

			this.camera = camera;

			/**
			 * A dom element.
			 *
			 * @type {Element}
			 * @private
			 */

			this.dom = dom;

			/**
			 * A raycaster.
			 *
			 * @type {Raycaster}
			 * @private
			 */

			this.raycaster = new three.Raycaster();

			/**
			 * Grid point materials.
			 *
			 * @type {MeshBasicMaterial[]}
			 * @private
			 */

			this.gridPointMaterials = [

				new three.MeshBasicMaterial({
					color: 0x999999,
					depthWrite: false,
					transparent: true,
					opacity: 0.75
				}),

				new three.MeshBasicMaterial({
					color: 0xcc6666,
					depthWrite: false,
					transparent: true,
					opacity: 0.9
				})

			];

			/**
			 * A selected grid point.
			 *
			 * @type {Mesh}
			 * @private
			 */

			this.selectedGridPoint = null;

			/**
			 * A group of spheres that represent the grid points.
			 *
			 * @type {Group}
			 */

			this.gridPoints = new three.Group();

			// Initialise the visual editor interface components.
			this.createGridPoints();

		}

		/**
		 * Creates interactive visual grid points.
		 *
		 * @private
		 */

		createGridPoints() {

			const gridPoints = this.gridPoints;

			const s = this.cellSize;
			const n = HermiteData.resolution;

			const base = this.cellPosition;
			const offset = new three.Vector3();
			const gridPointGeometry = new three.SphereBufferGeometry(0.05, 8, 8);
			const gridPointMaterial = this.gridPointMaterials[0];

			let gridPoint;
			let x, y, z;

			for(z = 0; z <= n; ++z) {

				offset.z = z * s / n;

				for(y = 0; y <= n; ++y) {

					offset.y = y * s / n;

					for(x = 0; x <= n; ++x) {

						offset.x = x * s / n;

						gridPoint = new three.Mesh(gridPointGeometry, gridPointMaterial);
						gridPoint.position.copy(base).add(offset);
						gridPoints.add(gridPoint);

					}

				}

			}

		}

		/**
		 * Toggles the material of the given grid point.
		 *
		 * @private
		 * @param {Number} index - A grid point index.
		 */

		toggleMaterialIndex(index) {

			const hermiteData = this.hermiteData;
			const materialIndices = hermiteData.materialIndices;
			const material = (materialIndices[index] === Material.AIR) ? Material.SOLID : Material.AIR;

			hermiteData.setMaterialIndex(index, material);

		}

		/**
		 * Handles click events.
		 *
		 * @private
		 * @param {MouseEvent} event - A mouse event.
		 */

		handleClick(event) {

			const gridPoint = this.selectedGridPoint;

			event.preventDefault();

			if(gridPoint !== null) {

				this.toggleMaterialIndex(this.gridPoints.children.indexOf(gridPoint));
				this.dispatchEvent(updateEvent);

			}

		}

		/**
		 * Raycasts the grid points.
		 *
		 * @param {MouseEvent} event - A mouse event.
		 */

		raycast(event) {

			const raycaster = this.raycaster;

			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, this.camera);

			const intersectingGridPoints = raycaster.intersectObjects(this.gridPoints.children);

			if(this.selectedGridPoint !== null) {

				this.selectedGridPoint.material = this.gridPointMaterials[0];
				this.selectedGridPoint = null;

			}

			if(intersectingGridPoints.length > 0) {

				this.selectedGridPoint = intersectingGridPoints[0].object;
				this.selectedGridPoint.material = this.gridPointMaterials[1];

			}

		}

		/**
		 * Handles events.
		 *
		 * @param {Event} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "mousemove":
					this.raycast(event);
					break;

				case "click":
					this.handleClick(event);
					break;

			}

		}

		/**
		 * Enables or disables this editor.
		 *
		 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
		 */

		setEnabled(enabled) {

			const dom = this.dom;

			if(enabled) {

				dom.addEventListener("mousemove", this);
				dom.addEventListener("click", this);

			} else {

				dom.removeEventListener("mousemove", this);
				dom.removeEventListener("click", this);

			}

		}

		/**
		 * Removes all event listeners.
		 */

		dispose() {

			this.setEnabled(false);

		}

		/**
		 * Registers configuration options.
		 *
		 * @param {GUI} menu - A menu.
		 */

		registerOptions(menu) {}

	}

	/**
	 * A mouse position.
	 *
	 * @type {Vector2}
	 * @private
	 */

	const mouse$1 = new three.Vector2();

	/**
	 * An update event.
	 *
	 * @type {Event}
	 * @private
	 */

	const updateEvent$1 = new Event("update");

	/**
	 * A visual edge editor.
	 *
	 * @implements {EventListener}
	 */

	class EdgeEditor extends EventTarget {

		/**
		 * Constructs a new edge editor.
		 *
		 * @param {Vector3} cellPosition - The position of the data cell.
		 * @param {Number} cellSize - The size of the data cell.
		 * @param {HermiteData} hermiteData - A set of Hermite data.
		 * @param {PerspectiveCamera} camera - A camera.
		 * @param {Element} [dom=document.body] - A dom element.
		 */

		constructor(cellPosition, cellSize, hermiteData, camera, dom = document.body) {

			super();

			/**
			 * The Hermite data.
			 *
			 * @type {HermiteData}
			 * @private
			 */

			this.hermiteData = hermiteData;

			/**
			 * The position of the data cell.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.cellPosition = cellPosition;

			/**
			 * The size of the data cell.
			 *
			 * @type {Number}
			 * @private
			 */

			this.cellSize = cellSize;

			/**
			 * A camera.
			 *
			 * @type {PerspectiveCamera}
			 * @private
			 */

			this.camera = camera;

			/**
			 * A dom element.
			 *
			 * @type {Element}
			 * @private
			 */

			this.dom = dom;

			/**
			 * A raycaster.
			 *
			 * @type {Raycaster}
			 * @private
			 */

			this.raycaster = new three.Raycaster();
			this.raycaster.linePrecision = 0.05;

			/**
			 * A Zero Crossing value.
			 *
			 * @type {Number}
			 */

			this.t = 0;

			/**
			 * Edge materials.
			 *
			 * @type {LineBasicMaterial[]}
			 * @private
			 */

			this.edgeMaterials = [

				new three.LineBasicMaterial({
					color: 0x999999
				}),

				new three.LineBasicMaterial({
					color: 0xcc6666
				})

			];

			/**
			 * Plane materials.
			 *
			 * @type {MeshBasicMaterial[]}
			 * @private
			 */

			this.planeMaterials = [

				new three.MeshBasicMaterial({
					color: 0xaa2200,
					side: three.DoubleSide,
					depthWrite: false,
					transparent: true,
					opacity: 0.2
				}),

				new three.MeshBasicMaterial({
					color: 0xffff00,
					side: three.DoubleSide,
					depthWrite: false,
					transparent: true,
					opacity: 0.4
				})

			];

			/**
			 * A selected edge.
			 *
			 * @type {Line}
			 * @private
			 */

			this.selectedEdge = null;

			/**
			 * An edge that has been clicked.
			 *
			 * @type {Line}
			 * @private
			 */

			this.activeEdge = null;

			/**
			 * A plane that belongs to an edge that has been clicked.
			 *
			 * @type {Mesh}
			 * @private
			 */

			this.activePlane = null;

			/**
			 * A 2-tuple containing the dimension and the index of the currently
			 * selected edge.
			 *
			 * @type {Vector2[]}
			 * @private
			 */

			this.edgeId = new three.Vector2();

			/**
			 * A group of lines that represent the edges.
			 *
			 * @type {Group}
			 */

			this.edges = new three.Group();

			/**
			 * A group of planes that represent the isosurface edge intersections.
			 *
			 * @type {Group}
			 */

			this.planes = new three.Group();

			/**
			 * The zero crossing value of the currently selected edge.
			 *
			 * @type {Number}
			 */

			this.t = 0;

			/**
			 * The intersection orientation of the currently selected edge.
			 *
			 * @type {Spherical}
			 */

			this.s = new three.Spherical();

		}

		/**
		 * Retrieves the edge data index and dimension based on a given linear index.
		 *
		 * @private
		 * @param {Number} i - A linear edge index.
		 */

		calculateEdgeId(i) {

			const edgeData = this.hermiteData.edgeData;
			const edges = edgeData.indices;

			let d, edgeCount;

			for(d = 0; d < 3; ++d) {

				edgeCount = edges[d].length;

				if(i < edgeCount) {

					break;

				} else {

					i -= edgeCount;

				}

			}

			this.edgeId.set(d, i);

		}

		/**
		 * Removes all visual edges and planes.
		 *
		 * @private
		 */

		clearEdges() {

			const edges = this.edges;
			const planes = this.planes;

			let edge, plane;

			while(edges.children.length > 0) {

				edge = edges.children[0];
				edge.geometry.dispose();
				edges.remove(edge);

			}

			while(planes.children.length > 0) {

				plane = planes.children[0];
				plane.geometry.dispose();
				planes.remove(plane);

			}

			this.activeEdge = null;
			this.activePlane = null;

		}

		/**
		 * Creates interactive visual edges and planes that represent the surface
		 * intersection data.
		 */

		createEdges() {

			const lines = this.edges;
			const planes = this.planes;
			const edgeMaterial = this.edgeMaterials[0];
			const planeMaterial = this.planeMaterials[0];
			const edges = this.hermiteData.edgeData.edges(this.cellPosition, this.cellSize);

			const intersection = new three.Vector3();

			let edge, line, plane;
			let lineGeometry, lineVertices;

			this.clearEdges();

			for(edge of edges) {

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

		}

		/**
		 * Adopts the edte data of the currently selected edge.
		 *
		 * @private
		 */

		adoptEdgeData() {

			const edgeData = this.hermiteData.edgeData;
			const zeroCrossings = edgeData.zeroCrossings;
			const normals = edgeData.normals;

			const d = this.edgeId.x;
			const i = this.edgeId.y;
			const n = new three.Vector3();

			this.t = zeroCrossings[d][i];
			this.s.setFromVector3(n.fromArray(normals[d], i * 3));

		}

		/**
		 * Updates an edge data entry.
		 *
		 * @private
		 */

		updateEdgeData() {

			const activeEdge = this.activeEdge;
			const activePlane = this.activePlane;

			const a = new three.Vector3();
			const b = new three.Vector3();
			const c = new three.Vector3();
			const n = new three.Vector3();

			const edgeData = this.hermiteData.edgeData;
			const zeroCrossings = edgeData.zeroCrossings;
			const normals = edgeData.normals;

			const d = this.edgeId.x;
			const i = this.edgeId.y;

			if(activeEdge !== null) {

				// Adjust the selected plane.
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

		/**
		 * Handles click events.
		 *
		 * @private
		 * @param {MouseEvent} event - A mouse event.
		 */

		handleClick(event) {

			const edge = this.selectedEdge;

			event.preventDefault();

			let index, plane;

			if(edge !== null) {

				if(this.activeEdge !== null) {

					// Switching directly to another edge?
					if(this.activeEdge !== edge) {

						// Reset the material of the previous edge.
						this.activeEdge.material = this.edgeMaterials[0];

					}

					this.activePlane.material = this.planeMaterials[0];
					this.activePlane.visible = false;

				}

				if(this.activeEdge !== edge) {

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

		/**
		 * Raycasts the grid points and edges.
		 *
		 * @param {MouseEvent} event - A mouse event.
		 */

		raycast(event) {

			const raycaster = this.raycaster;

			mouse$1.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse$1.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse$1, this.camera);

			const intersectingEdges = raycaster.intersectObjects(this.edges.children);

			if(this.selectedEdge !== null) {

				if(this.selectedEdge !== this.activeEdge) {

					this.selectedEdge.material = this.edgeMaterials[0];

				}

				this.selectedEdge = null;

			}

			if(intersectingEdges.length > 0) {

				this.selectedEdge = intersectingEdges[0].object;
				this.selectedEdge.material = this.edgeMaterials[1];

			}

		}

		/**
		 * Handles events.
		 *
		 * @param {Event} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "mousemove":
					this.raycast(event);
					break;

				case "click":
					this.handleClick(event);
					break;

			}

		}

		/**
		 * Enables or disables this editor.
		 *
		 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
		 */

		setEnabled(enabled) {

			const dom = this.dom;

			if(enabled) {

				dom.addEventListener("mousemove", this);
				dom.addEventListener("click", this);

			} else {

				dom.removeEventListener("mousemove", this);
				dom.removeEventListener("click", this);

			}

		}

		/**
		 * Removes all event listeners.
		 */

		dispose() {

			this.setEnabled(false);

		}

		/**
		 * Registers configuration options.
		 *
		 * @param {GUI} menu - A menu.
		 */

		registerOptions(menu) {

			const planes = this.planes;

			const params = {
				"show planes": false
			};

			menu.add(params, "show planes").onChange(() => {

				const activePlane = this.activePlane;

				planes.traverse(function(child) {

					if(child !== planes && child !== activePlane) {

						child.visible = params["show planes"];

					}

				});

			});

			let folder = menu.addFolder("Edge Adjustment");

			folder.add(this, "t").min(0).max(1).listen().step(1e-6).onChange(() => {

				if(this.hermiteData.edgeData !== null) {

					this.updateEdgeData();

				}

			});

			folder.add(this.s, "phi").min(1e-6).max(Math.PI - 1e-6).step(1e-6).listen().onChange(() => {

				if(this.hermiteData.edgeData !== null) {

					this.updateEdgeData();

				}

			});

			folder.add(this.s, "theta").min(1e-6).max(Math.PI - 1e-6).step(1e-6).listen().onChange(() => {

				if(this.hermiteData.edgeData !== null) {

					this.updateEdgeData();

				}

			});

			folder.open();

		}

	}

	/**
	 * An update event.
	 *
	 * @type {DataEvent}
	 * @private
	 */

	const updateEvent$2 = new DataEvent("update");

	/**
	 * A visual Hermite data editor.
	 *
	 * @implements {EventListener}
	 */

	class HermiteDataEditor extends EventTarget {

		/**
		 * Constructs a new grid point editor.
		 *
		 * @param {Vector3} cellPosition - The position of the data cell.
		 * @param {Number} cellSize - The size of the data cell.
		 * @param {HermiteData} hermiteData - A set of Hermite data. The material indices of this data will become editable.
		 * @param {PerspectiveCamera} camera - A camera.
		 * @param {Element} [dom=document.body] - A dom element.
		 */

		constructor(cellPosition, cellSize, hermiteData, camera, dom = document.body) {

			super();

			/**
			 * The Hermite data.
			 *
			 * @type {HermiteData}
			 * @private
			 */

			this.hermiteData = hermiteData;

			/**
			 * The position of the data cell.
			 *
			 * @type {Vector3}
			 * @private
			 */

			this.cellPosition = cellPosition;

			/**
			 * The size of the data cell.
			 *
			 * @type {Number}
			 * @private
			 */

			this.cellSize = cellSize;

			/**
			 * A grid point editor.
			 *
			 * @type {GridPointEditor}
			 * @private
			 */

			this.gridPointEditor = new GridPointEditor(cellPosition, cellSize, hermiteData, camera, dom);
			this.gridPointEditor.addEventListener("update", this);
			this.gridPointEditor.setEnabled(true);

			/**
			 * An edge editor.
			 *
			 * @type {EdgeEditor}
			 * @private
			 */

			this.edgeEditor = new EdgeEditor(cellPosition, cellSize, hermiteData, camera, dom);
			this.edgeEditor.addEventListener("update", this);

			/**
			 * A set of QEF data.
			 *
			 * @type {QEFData}
			 * @private
			 */

			this.qefData = new QEFData();

		}

		/**
		 * A group of spheres that represent the grid points.
		 *
		 * @type {Group}
		 */

		get gridPoints() {

			return this.gridPointEditor.gridPoints;

		}

		/**
		 * A group of lines that represent the edges.
		 *
		 * @type {Group}
		 */

		get edges() {

			return this.edgeEditor.edges;

		}

		/**
		 * A group of planes that represent the isosurface edge intersections.
		 *
		 * @type {Group}
		 */

		get planes() {

			return this.edgeEditor.planes;

		}

		/**
		 * Creates new edge data from the material indices.
		 *
		 * This method resets all Zero Crossings and intersection normals.
		 *
		 * @private
		 */

		createEdgeData() {

			const n = HermiteData.resolution;
			const m = n + 1;
			const mm = m * m;

			const indexOffsets = new Uint32Array([1, m, mm]);
			const materialIndices = this.hermiteData.materialIndices;
			const edgeData = new EdgeData(n, EdgeData.calculate1DEdgeCount(n));

			let edges, zeroCrossings, normals;
			let indexA, indexB;

			let c, d, a, axis;
			let x, y, z;
			let X, Y, Z;

			for(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {

				// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
				axis = pattern[a];

				edges = edgeData.indices[d];
				zeroCrossings = edgeData.zeroCrossings[d];
				normals = edgeData.normals[d];

				X = Y = Z = n;

				// Avoid processing grid points at chunk borders.
				switch(d) {

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

				for(z = 0; z <= Z; ++z) {

					for(y = 0; y <= Y; ++y) {

						for(x = 0; x <= X; ++x) {

							indexA = z * mm + y * m + x;
							indexB = indexA + indexOffsets[d];

							// Check if the edge exhibits a material change.
							if(materialIndices[indexA] !== materialIndices[indexB]) {

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

				// Cut off empty data.
				edgeData.indices[d] = edgeData.indices[d].slice(0, c);
				edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, c);
				edgeData.normals[d] = edgeData.normals[d].slice(0, c * 3);

			}

			this.hermiteData.edgeData = edgeData;

		}

		/**
		 * Updates the QEF data.
		 *
		 * @private
		 */

		updateQEFData() {

			const qefData = this.qefData;
			const intersection = new three.Vector3();
			const edges = this.hermiteData.edgeData.edges(this.cellPosition, this.cellSize);

			let edge;

			qefData.clear();

			for(edge of edges) {

				edge.computeZeroCrossingPosition(intersection);
				qefData.add(intersection, edge.n);

			}

		}

		/**
		 * Handles events.
		 *
		 * @param {Event} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "update": {

					if(event.target === this.gridPointEditor) {

						this.createEdgeData();
						this.edgeEditor.createEdges();

					}

					// Only accumulate QEF data for a single cell setup.
					if(HermiteData.resolution === 1) {

						this.updateQEFData();

					}

					updateEvent$2.qefData = this.qefData;
					this.dispatchEvent(updateEvent$2);

					break;

				}

			}

		}

		/**
		 * Enables or disables this editor.
		 *
		 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
		 */

		setEnabled(enabled) {

			this.gridPointEditor.setEnabled(enabled);
			this.edgeEditor.setEnabled(enabled);

		}

		/**
		 * Removes all event listeners.
		 */

		dispose() {

			this.setEnabled(false);

		}

		/**
		 * Registers configuration options.
		 *
		 * @param {GUI} menu - A menu.
		 */

		registerOptions(menu) {

			const params = {
				"edit mode": 0
			};

			menu.add(params, "edit mode", { materials: 0, edges: 1 }).onChange(() => {

				const editGridPoints = (Number.parseInt(params["edit mode"]) === 0);

				this.gridPointEditor.setEnabled(editGridPoints);
				this.edgeEditor.setEnabled(!editGridPoints);

			});

			this.edgeEditor.registerOptions(menu);

		}

	}

	/**
	 * A voxel demo setup that showcases the QEF calculation.
	 *
	 * @implements {EventListener}
	 */

	class VoxelDemo extends Demo {

		/**
		 * Constructs a new voxel demo.
		 */

		constructor() {

			super("voxel");

			/**
			 * A set of Hermite data.
			 *
			 * @type {HermiteData}
			 * @private
			 */

			this.hermiteData = null;

			/**
			 * A Hermite data helper.
			 *
			 * @type {HermiteDataHelper}
			 * @private
			 */

			this.hermiteDataHelper = null;

			/**
			 * A Hermite data editor.
			 *
			 * @type {HermiteDataEditor}
			 * @private
			 */

			this.hermiteDataEditor = null;

			/**
			 * A QEF solver.
			 *
			 * @type {QEFSolver}
			 * @private
			 */

			this.qefSolver = new QEFSolver();

			/**
			 * The current QEF error.
			 *
			 * @type {String}
			 */

			this.error = "0.0000";

			/**
			 * The QEF result.
			 *
			 * @type {Object}
			 * @param {String} x - The calculated vertex X-coordinate.
			 * @param {String} y - The calculated vertex Y-coordinate.
			 * @param {String} z - The calculated vertex Z-coordinate.
			 */

			this.result = {
				x: "",
				y: "",
				z: ""
			};

			/**
			 * A set of QEF data.
			 *
			 * @type {Mesh}
			 * @private
			 */

			this.vertex = new three.Mesh(
				new three.SphereBufferGeometry(0.05, 8, 8),
				new three.MeshBasicMaterial({
					color: 0xff8822
				})
			);

			this.vertex.visible = false;

		}

		/**
		 * Calculates the vertex position from the given QEF data.
		 *
		 * @private
		 * @param {QEFData} qefData - The QEF data.
		 */

		solveQEF(qefData) {

			const hermiteData = this.hermiteData;
			const qefSolver = this.qefSolver;
			const vertex = this.vertex;
			const result = this.result;

			if(!hermiteData.empty && !hermiteData.full) {

				this.error = qefSolver.setData(qefData).solve(vertex.position).toFixed(4);
				vertex.visible = true;

				result.x = vertex.position.x.toFixed(2);
				result.y = vertex.position.y.toFixed(2);
				result.z = vertex.position.z.toFixed(2);

			} else if(vertex.visible) {

				result.x = "";
				result.y = "";
				result.z = "";

				vertex.visible = false;

			}

		}

		/**
		 * Handles events.
		 *
		 * @param {DataEvent} event - An event.
		 */

		handleEvent(event) {

			switch(event.type) {

				case "update": {

					try {

						this.hermiteDataHelper.update(true, false);

					} catch(e) {

						// Data is just empty right now. Ignore.

					}

					this.solveQEF(event.qefData);

					break;

				}

			}

		}

		/**
		 * Creates the scene.
		 */

		initialize() {

			const scene = this.scene;
			const renderer = this.renderer;

			// Camera.

			const camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 50);
			camera.position.set(-2, 1, 2);
			this.camera = camera;

			// Controls.

			const controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
			controls.settings.pointer.lock = false;
			controls.settings.sensitivity.zoom = 0.1;
			controls.settings.translation.enabled = false;
			controls.settings.zoom.maxDistance = 40;
			controls.lookAt(scene.position);
			this.controls = controls;

			// Fog.

			scene.fog = new three.FogExp2(0xf4f4f4, 0.025);
			renderer.setClearColor(scene.fog.color);

			// Hermite Data preparation.

			HermiteData.resolution = 1;
			HermiteDataHelper.air = Material.AIR;

			const cellSize = 1;
			const cellPosition = new three.Vector3(-0.5, -0.5, -0.5);
			cellPosition.multiplyScalar(cellSize);

			const hermiteData = new HermiteData();
			const hermiteDataHelper = new HermiteDataHelper(cellPosition, cellSize, hermiteData, true, false);

			this.hermiteData = hermiteData;
			this.hermiteDataHelper = hermiteDataHelper;

			scene.add(hermiteDataHelper);

			const hermiteDataEditor = new HermiteDataEditor(cellPosition, cellSize, hermiteData, camera, renderer.domElement);
			hermiteDataEditor.addEventListener("update", this);

			this.hermiteDataEditor = hermiteDataEditor;

			scene.add(hermiteDataEditor.gridPoints);
			scene.add(hermiteDataEditor.edges);
			scene.add(hermiteDataEditor.planes);

			// Highlight the voxel cell.
			const size = cellSize - 0.05;
			scene.add(new three.Mesh(
				new three.BoxBufferGeometry(size, size, size),
				new three.MeshBasicMaterial({
					color: 0xcccccc,
					depthWrite: false,
					transparent: true,
					opacity: 0.35
				})
			));

			// Prepare the computed vertex for rendering.
			this.vertex.visible = false;
			scene.add(this.vertex);

		}

		/**
		 * Renders this demo.
		 *
		 * @param {Number} delta - The time since the last frame in seconds.
		 */

		render(delta) {

			this.controls.update(delta);

			super.render(delta);

		}

		/**
		 * Registers configuration options.
		 *
		 * @param {GUI} menu - A menu.
		 */

		registerOptions(menu) {

			const folder = menu.addFolder("Vertex Position");
			folder.add(this.result, "x").listen();
			folder.add(this.result, "y").listen();
			folder.add(this.result, "z").listen();
			folder.add(this, "error").listen();
			folder.open();

			this.hermiteDataEditor.registerOptions(menu);

		}

	}

	/**
	 * A demo manager.
	 *
	 * @type {DemoManager}
	 * @private
	 */

	let manager;

	/**
	 * The main render loop.
	 *
	 * @private
	 * @param {DOMHighResTimeStamp} now - The current time.
	 */

	function render(now) {

		requestAnimationFrame(render);
		manager.render(now);

	}

	/**
	 * Handles demo change events.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	function onChange(event) {

		document.getElementById("viewport").children[0].style.display = "initial";

	}

	/**
	 * Handles demo load events.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	function onLoad(event) {

		document.getElementById("viewport").children[0].style.display = "none";

	}

	/**
	 * Starts the program.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	window.addEventListener("load", function main(event) {

		// Clean up.
		this.removeEventListener("load", main);

		const viewport = document.getElementById("viewport");

		// Create a custom renderer.
		const renderer = new three.WebGLRenderer({
			logarithmicDepthBuffer: true,
			antialias: true
		});

		renderer.setSize(viewport.clientWidth, viewport.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000);

		// Initialise the demo manager.
		manager = new DemoManager(viewport, {
			aside: document.getElementById("aside"),
			renderer: renderer
		});

		// Setup demo switch and load event handlers.
		manager.addEventListener("change", onChange);
		manager.addEventListener("load", onLoad);

		// Register demos.
		manager.addDemo(new ContouringDemo());
		manager.addDemo(new VoxelDemo());

		// Start rendering.
		render();

	});

	/**
	 * Handles browser resizing.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	window.addEventListener("resize", (function() {

		let timeoutId = 0;

		function handleResize(event) {

			const width = event.target.innerWidth;
			const height = event.target.innerHeight;

			manager.setSize(width, height);

			timeoutId = 0;

		}

		return function onResize(event) {

			if(timeoutId === 0) {

				timeoutId = setTimeout(handleResize, 66, event);

			}

		};

	}()));

	/**
	 * Toggles the visibility of the interface on Alt key press.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	document.addEventListener("keydown", function onKeyDown(event) {

		const aside = this.getElementById("aside");

		if(event.altKey && aside !== null) {

			event.preventDefault();
			aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

		}

	});

}(THREE));
