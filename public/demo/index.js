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

  var fragment = "uniform sampler2D tPreviousLum;\r\nuniform sampler2D tCurrentLum;\r\nuniform float minLuminance;\r\nuniform float delta;\r\nuniform float tau;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tfloat previousLum = texture2D(tPreviousLum, vUv, MIP_LEVEL_1X1).r;\r\n\tfloat currentLum = texture2D(tCurrentLum, vUv, MIP_LEVEL_1X1).r;\r\n\r\n\tpreviousLum = max(minLuminance, previousLum);\r\n\tcurrentLum = max(minLuminance, currentLum);\r\n\r\n\t// Adapt the luminance using Pattanaik's technique.\r\n\tfloat adaptedLum = previousLum + (currentLum - previousLum) * (1.0 - exp(-delta * tau));\r\n\r\n\tgl_FragColor.r = adaptedLum;\r\n\r\n}\r\n";
  var vertex = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var AdaptiveLuminosityMaterial = function (_ShaderMaterial) {
  			inherits(AdaptiveLuminosityMaterial, _ShaderMaterial);

  			function AdaptiveLuminosityMaterial() {
  						classCallCheck(this, AdaptiveLuminosityMaterial);
  						return possibleConstructorReturn(this, (AdaptiveLuminosityMaterial.__proto__ || Object.getPrototypeOf(AdaptiveLuminosityMaterial)).call(this, {

  									type: "AdaptiveLuminosityMaterial",

  									defines: {

  												MIP_LEVEL_1X1: "0.0"

  									},

  									uniforms: {

  												tPreviousLum: new three.Uniform(null),
  												tCurrentLum: new three.Uniform(null),
  												minLuminance: new three.Uniform(0.01),
  												delta: new three.Uniform(0.0),
  												tau: new three.Uniform(1.0)

  									},

  									fragmentShader: fragment,
  									vertexShader: vertex,

  									depthWrite: false,
  									depthTest: false

  						}));
  			}

  			return AdaptiveLuminosityMaterial;
  }(three.ShaderMaterial);

  var fragment$1 = "uniform sampler2D tDiffuse;\r\nuniform sampler2D tDepth;\r\n\r\nuniform float focus;\r\nuniform float dof;\r\nuniform float aspect;\r\nuniform float aperture;\r\nuniform float maxBlur;\r\n\r\nvarying vec2 vUv;\r\n\r\n#ifndef USE_LOGDEPTHBUF\r\n\r\n\t#include <packing>\r\n\r\n\tuniform float cameraNear;\r\n\tuniform float cameraFar;\r\n\r\n\tfloat readDepth(sampler2D depthSampler, vec2 coord) {\r\n\r\n\t\tfloat fragCoordZ = texture2D(depthSampler, coord).x;\r\n\t\tfloat viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\r\n\r\n\t\treturn viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\nvoid main() {\r\n\r\n\tvec2 aspectCorrection = vec2(1.0, aspect);\r\n\r\n\t#ifdef USE_LOGDEPTHBUF\r\n\r\n\t\tfloat depth = texture2D(tDepth, vUv).x;\r\n\r\n\t#else\r\n\r\n\t\tfloat depth = readDepth(tDepth, vUv);\r\n\r\n\t#endif\r\n\r\n\tfloat focusNear = clamp(focus - dof, 0.0, 1.0);\r\n\tfloat focusFar = clamp(focus + dof, 0.0, 1.0);\r\n\r\n\t// Calculate a DoF mask.\r\n\tfloat low = step(depth, focusNear);\r\n\tfloat high = step(focusFar, depth);\r\n\r\n\tfloat factor = (depth - focusNear) * low + (depth - focusFar) * high;\r\n\r\n\tvec2 dofBlur = vec2(clamp(factor * aperture, -maxBlur, maxBlur));\r\n\r\n\tvec2 dofblur9 = dofBlur * 0.9;\r\n\tvec2 dofblur7 = dofBlur * 0.7;\r\n\tvec2 dofblur4 = dofBlur * 0.4;\r\n\r\n\tvec4 color = vec4(0.0);\r\n\r\n\tcolor += texture2D(tDiffuse, vUv);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.15,  0.37) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29,  0.29) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.37,  0.15) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.40,  0.0 ) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.37, -0.15) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29, -0.29) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.15, -0.37) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.15,  0.37) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29,  0.29) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.37,  0.15) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.37, -0.15) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrection) * dofBlur);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.15, -0.37) * aspectCorrection) * dofBlur);\r\n\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.15,  0.37) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.37,  0.15) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.37, -0.15) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.15, -0.37) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.15,  0.37) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.37,  0.15) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.37, -0.15) * aspectCorrection) * dofblur9);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.15, -0.37) * aspectCorrection) * dofblur9);\r\n\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29,  0.29) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.40,  0.0 ) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29, -0.29) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29,  0.29) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrection) * dofblur7);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofblur7);\r\n\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29,  0.29) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.4,   0.0 ) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.29, -0.29) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29,  0.29) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * aspectCorrection) * dofblur4);\r\n\tcolor += texture2D(tDiffuse, vUv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofblur4);\r\n\r\n\tgl_FragColor = color / 41.0;\r\n\r\n}\r\n";
  var vertex$1 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var BokehMaterial = function (_ShaderMaterial) {
  	inherits(BokehMaterial, _ShaderMaterial);

  	function BokehMaterial() {
  		var camera = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  		classCallCheck(this, BokehMaterial);


  		var settings = Object.assign({
  			focus: 1.0,
  			dof: 0.02,
  			aperture: 0.025,
  			maxBlur: 1.0
  		}, options);

  		var _this = possibleConstructorReturn(this, (BokehMaterial.__proto__ || Object.getPrototypeOf(BokehMaterial)).call(this, {

  			type: "BokehMaterial",

  			uniforms: {

  				cameraNear: new three.Uniform(0.1),
  				cameraFar: new three.Uniform(2000),
  				aspect: new three.Uniform(1.0),

  				tDiffuse: new three.Uniform(null),
  				tDepth: new three.Uniform(null),

  				focus: new three.Uniform(settings.focus),
  				dof: new three.Uniform(settings.dof),
  				aperture: new three.Uniform(settings.aperture),
  				maxBlur: new three.Uniform(settings.maxBlur)

  			},

  			fragmentShader: fragment$1,
  			vertexShader: vertex$1,

  			depthWrite: false,
  			depthTest: false

  		}));

  		_this.adoptCameraSettings(camera);

  		return _this;
  	}

  	createClass(BokehMaterial, [{
  		key: "adoptCameraSettings",
  		value: function adoptCameraSettings(camera) {

  			if (camera !== null) {

  				this.uniforms.cameraNear.value = camera.near;
  				this.uniforms.cameraFar.value = camera.far;
  				this.uniforms.aspect.value = camera.aspect;
  			}
  		}
  	}]);
  	return BokehMaterial;
  }(three.ShaderMaterial);

  var fragment$2 = "uniform sampler2D tDiffuse;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset[3];\r\n\r\nvoid main() {\r\n\r\n\tconst vec2 threshold = vec2(EDGE_THRESHOLD);\r\n\r\n\t// Calculate color deltas.\r\n\tvec4 delta;\r\n\tvec3 c = texture2D(tDiffuse, vUv).rgb;\r\n\r\n\tvec3 cLeft = texture2D(tDiffuse, vOffset[0].xy).rgb;\r\n\tvec3 t = abs(c - cLeft);\r\n\tdelta.x = max(max(t.r, t.g), t.b);\r\n\r\n\tvec3 cTop = texture2D(tDiffuse, vOffset[0].zw).rgb;\r\n\tt = abs(c - cTop);\r\n\tdelta.y = max(max(t.r, t.g), t.b);\r\n\r\n\t// We do the usual threshold.\r\n\tvec2 edges = step(threshold, delta.xy);\r\n\r\n\t// Then discard if there is no edge.\r\n\tif(dot(edges, vec2(1.0)) == 0.0) {\r\n\r\n\t\tdiscard;\r\n\r\n\t}\r\n\r\n\t// Calculate right and bottom deltas.\r\n\tvec3 cRight = texture2D(tDiffuse, vOffset[1].xy).rgb;\r\n\tt = abs(c - cRight);\r\n\tdelta.z = max(max(t.r, t.g), t.b);\r\n\r\n\tvec3 cBottom = texture2D(tDiffuse, vOffset[1].zw).rgb;\r\n\tt = abs(c - cBottom);\r\n\tdelta.w = max(max(t.r, t.g), t.b);\r\n\r\n\t// Calculate the maximum delta in the direct neighborhood.\r\n\tfloat maxDelta = max(max(max(delta.x, delta.y), delta.z), delta.w);\r\n\r\n\t// Calculate left-left and top-top deltas.\r\n\tvec3 cLeftLeft = texture2D(tDiffuse, vOffset[2].xy).rgb;\r\n\tt = abs(c - cLeftLeft);\r\n\tdelta.z = max(max(t.r, t.g), t.b);\r\n\r\n\tvec3 cTopTop = texture2D(tDiffuse, vOffset[2].zw).rgb;\r\n\tt = abs(c - cTopTop);\r\n\tdelta.w = max(max(t.r, t.g), t.b);\r\n\r\n\t// Calculate the final maximum delta.\r\n\tmaxDelta = max(max(maxDelta, delta.z), delta.w);\r\n\r\n\t// Local contrast adaptation in action.\r\n\tedges.xy *= step(0.5 * maxDelta, delta.xy);\r\n\r\n\tgl_FragColor = vec4(edges, 0.0, 0.0);\r\n\r\n}\r\n";
  var vertex$2 = "uniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset[3];\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\r\n\tvOffset[0] = uv.xyxy + texelSize.xyxy * vec4(-1.0, 0.0, 0.0, 1.0); // Changed sign in W component.\r\n\tvOffset[1] = uv.xyxy + texelSize.xyxy * vec4(1.0, 0.0, 0.0, -1.0); // Changed sign in W component.\r\n\tvOffset[2] = uv.xyxy + texelSize.xyxy * vec4(-2.0, 0.0, 0.0, 2.0); // Changed sign in W component.\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var ColorEdgesMaterial = function (_ShaderMaterial) {
  	inherits(ColorEdgesMaterial, _ShaderMaterial);

  	function ColorEdgesMaterial() {
  		var texelSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Vector2();
  		classCallCheck(this, ColorEdgesMaterial);
  		return possibleConstructorReturn(this, (ColorEdgesMaterial.__proto__ || Object.getPrototypeOf(ColorEdgesMaterial)).call(this, {

  			type: "ColorEdgesMaterial",

  			defines: {

  				EDGE_THRESHOLD: "0.1"

  			},

  			uniforms: {

  				tDiffuse: new three.Uniform(null),
  				texelSize: new three.Uniform(texelSize)

  			},

  			fragmentShader: fragment$2,
  			vertexShader: vertex$2,

  			depthWrite: false,
  			depthTest: false

  		}));
  	}

  	createClass(ColorEdgesMaterial, [{
  		key: "setEdgeDetectionThreshold",
  		value: function setEdgeDetectionThreshold(threshold) {

  			this.defines.EDGE_THRESHOLD = threshold.toFixed("2");

  			this.needsUpdate = true;
  		}
  	}]);
  	return ColorEdgesMaterial;
  }(three.ShaderMaterial);

  var fragment$3 = "uniform sampler2D texture1;\r\nuniform sampler2D texture2;\r\n\r\nuniform float opacity1;\r\nuniform float opacity2;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel1 = opacity1 * texture2D(texture1, vUv);\r\n\tvec4 texel2 = opacity2 * texture2D(texture2, vUv);\r\n\r\n\t#ifdef SCREEN_MODE\r\n\r\n\t\tvec3 invTexel1 = vec3(1.0) - texel1.rgb;\r\n\t\tvec3 invTexel2 = vec3(1.0) - texel2.rgb;\r\n\r\n\t\tvec4 color = vec4(\r\n\t\t\tvec3(1.0) - invTexel1 * invTexel2,\r\n\t\t\ttexel1.a + texel2.a\r\n\t\t);\r\n\r\n\t#else\r\n\r\n\t\tvec4 color = texel1 + texel2;\r\n\r\n\t#endif\r\n\r\n\tgl_FragColor = color;\r\n\r\n}\r\n";
  var vertex$3 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var CombineMaterial = function (_ShaderMaterial) {
  	inherits(CombineMaterial, _ShaderMaterial);

  	function CombineMaterial() {
  		var screenMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  		classCallCheck(this, CombineMaterial);

  		var _this = possibleConstructorReturn(this, (CombineMaterial.__proto__ || Object.getPrototypeOf(CombineMaterial)).call(this, {

  			type: "CombineMaterial",

  			uniforms: {

  				texture1: new three.Uniform(null),
  				texture2: new three.Uniform(null),

  				opacity1: new three.Uniform(1.0),
  				opacity2: new three.Uniform(1.0)

  			},

  			fragmentShader: fragment$3,
  			vertexShader: vertex$3,

  			depthWrite: false,
  			depthTest: false

  		}));

  		_this.setScreenModeEnabled(screenMode);

  		return _this;
  	}

  	createClass(CombineMaterial, [{
  		key: "setScreenModeEnabled",
  		value: function setScreenModeEnabled(enabled) {

  			if (enabled) {

  				this.defines.SCREEN_MODE = "1";
  			} else {

  				delete this.defines.SCREEN_MODE;
  			}

  			this.needsUpdate = true;
  		}
  	}]);
  	return CombineMaterial;
  }(three.ShaderMaterial);

  var fragment$4 = "#include <common>\r\n#include <dithering_pars_fragment>\r\n\r\nuniform sampler2D tDiffuse;\r\n\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\n\r\nvoid main() {\r\n\r\n\t// Sample top left texel.\r\n\tvec4 sum = texture2D(tDiffuse, vUv0);\r\n\r\n\t// Sample top right texel.\r\n\tsum += texture2D(tDiffuse, vUv1);\r\n\r\n\t// Sample bottom right texel.\r\n\tsum += texture2D(tDiffuse, vUv2);\r\n\r\n\t// Sample bottom left texel.\r\n\tsum += texture2D(tDiffuse, vUv3);\r\n\r\n\t// Compute the average.\r\n\tgl_FragColor = sum * 0.25;\r\n\r\n\t#include <dithering_fragment>\r\n\r\n}\r\n";
  var vertex$4 = "uniform vec2 texelSize;\r\nuniform vec2 halfTexelSize;\r\nuniform float kernel;\r\n\r\nvarying vec2 vUv0;\r\nvarying vec2 vUv1;\r\nvarying vec2 vUv2;\r\nvarying vec2 vUv3;\r\n\r\nvoid main() {\r\n\r\n\tvec2 dUv = (texelSize * vec2(kernel)) + halfTexelSize;\r\n\r\n\tvUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);\r\n\tvUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);\r\n\tvUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);\r\n\tvUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var ConvolutionMaterial = function (_ShaderMaterial) {
  	inherits(ConvolutionMaterial, _ShaderMaterial);

  	function ConvolutionMaterial() {
  		var texelSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Vector2();
  		classCallCheck(this, ConvolutionMaterial);

  		var _this = possibleConstructorReturn(this, (ConvolutionMaterial.__proto__ || Object.getPrototypeOf(ConvolutionMaterial)).call(this, {

  			type: "ConvolutionMaterial",

  			uniforms: {

  				tDiffuse: new three.Uniform(null),
  				texelSize: new three.Uniform(new three.Vector2()),
  				halfTexelSize: new three.Uniform(new three.Vector2()),
  				kernel: new three.Uniform(0.0)

  			},

  			fragmentShader: fragment$4,
  			vertexShader: vertex$4,

  			depthWrite: false,
  			depthTest: false

  		}));

  		_this.setTexelSize(texelSize.x, texelSize.y);

  		_this.kernelSize = KernelSize.LARGE;

  		return _this;
  	}

  	createClass(ConvolutionMaterial, [{
  		key: "getKernel",
  		value: function getKernel() {

  			return kernelPresets[this.kernelSize];
  		}
  	}, {
  		key: "setTexelSize",
  		value: function setTexelSize(x, y) {

  			this.uniforms.texelSize.value.set(x, y);
  			this.uniforms.halfTexelSize.value.set(x, y).multiplyScalar(0.5);
  		}
  	}]);
  	return ConvolutionMaterial;
  }(three.ShaderMaterial);

  var kernelPresets = [new Float32Array([0.0, 0.0]), new Float32Array([0.0, 1.0, 1.0]), new Float32Array([0.0, 1.0, 1.0, 2.0]), new Float32Array([0.0, 1.0, 2.0, 2.0, 3.0]), new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 4.0, 5.0]), new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0])];

  var KernelSize = {

  	VERY_SMALL: 0,
  	SMALL: 1,
  	MEDIUM: 2,
  	LARGE: 3,
  	VERY_LARGE: 4,
  	HUGE: 5

  };

  var fragment$5 = "uniform sampler2D tDiffuse;\r\nuniform float opacity;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tgl_FragColor = opacity * texel;\r\n\r\n}\r\n";
  var vertex$5 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var CopyMaterial = function (_ShaderMaterial) {
  			inherits(CopyMaterial, _ShaderMaterial);

  			function CopyMaterial() {
  						classCallCheck(this, CopyMaterial);
  						return possibleConstructorReturn(this, (CopyMaterial.__proto__ || Object.getPrototypeOf(CopyMaterial)).call(this, {

  									type: "CopyMaterial",

  									uniforms: {

  												tDiffuse: new three.Uniform(null),
  												opacity: new three.Uniform(1.0)

  									},

  									fragmentShader: fragment$5,
  									vertexShader: vertex$5,

  									depthWrite: false,
  									depthTest: false

  						}));
  			}

  			return CopyMaterial;
  }(three.ShaderMaterial);

  var fragment$6 = "uniform sampler2D tDiffuse;\r\n\r\nuniform float angle;\r\nuniform float scale;\r\nuniform float intensity;\r\n\r\nvarying vec2 vUv;\r\nvarying vec2 vUvPattern;\r\n\r\nfloat pattern() {\r\n\r\n\tfloat s = sin(angle);\r\n\tfloat c = cos(angle);\r\n\r\n\tvec2 point = vec2(c * vUvPattern.x - s * vUvPattern.y, s * vUvPattern.x + c * vUvPattern.y) * scale;\r\n\r\n\treturn (sin(point.x) * sin(point.y)) * 4.0;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tvec3 color = texel.rgb;\r\n\r\n\t#ifdef AVERAGE\r\n\r\n\t\tcolor = vec3((color.r + color.g + color.b) / 3.0);\r\n\r\n\t#endif\r\n\r\n\tcolor = vec3(color * 10.0 - 5.0 + pattern());\r\n\tcolor = texel.rgb + (color - texel.rgb) * intensity;\r\n\r\n\tgl_FragColor = vec4(color, texel.a);\r\n\r\n}\r\n";
  var vertex$6 = "uniform vec4 offsetRepeat;\r\n\r\nvarying vec2 vUv;\r\nvarying vec2 vUvPattern;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tvUvPattern = uv * offsetRepeat.zw + offsetRepeat.xy;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var DotScreenMaterial = function (_ShaderMaterial) {
  	inherits(DotScreenMaterial, _ShaderMaterial);

  	function DotScreenMaterial() {
  		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  		classCallCheck(this, DotScreenMaterial);


  		var settings = Object.assign({
  			average: false,
  			angle: 1.57,
  			scale: 1.0,
  			intensity: 1.0
  		}, options);

  		var _this = possibleConstructorReturn(this, (DotScreenMaterial.__proto__ || Object.getPrototypeOf(DotScreenMaterial)).call(this, {

  			type: "DotScreenMaterial",

  			uniforms: {

  				tDiffuse: new three.Uniform(null),

  				angle: new three.Uniform(settings.angle),
  				scale: new three.Uniform(settings.scale),
  				intensity: new three.Uniform(settings.intensity),

  				offsetRepeat: new three.Uniform(new three.Vector4(0.5, 0.5, 1.0, 1.0))

  			},

  			fragmentShader: fragment$6,
  			vertexShader: vertex$6,

  			depthWrite: false,
  			depthTest: false

  		}));

  		_this.setAverageEnabled(settings.average);

  		return _this;
  	}

  	createClass(DotScreenMaterial, [{
  		key: "setAverageEnabled",
  		value: function setAverageEnabled(enabled) {

  			if (enabled) {

  				this.defines.AVERAGE = "1";
  			} else {

  				delete this.defines.AVERAGE;
  			}

  			this.needsUpdate = true;
  		}
  	}]);
  	return DotScreenMaterial;
  }(three.ShaderMaterial);

  var fragment$7 = "uniform sampler2D tDiffuse;\r\nuniform float time;\r\n\r\nvarying vec2 vUv;\r\n\r\n#ifdef NOISE\r\n\r\n\tuniform float noiseIntensity;\r\n\r\n#endif\r\n\r\n#ifdef SCANLINES\r\n\r\n\tuniform float scanlineIntensity;\r\n\tuniform float scanlineCount;\r\n\r\n#endif\r\n\r\n#ifdef GREYSCALE\r\n\r\n\t#include <common>\r\n\r\n\tuniform float greyscaleIntensity;\r\n\r\n#elif defined(SEPIA)\r\n\r\n\tuniform float sepiaIntensity;\r\n\r\n#endif\r\n\r\n#ifdef VIGNETTE\r\n\r\n\tuniform float vignetteOffset;\r\n\tuniform float vignetteDarkness;\r\n\r\n#endif\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tvec3 color = texel.rgb;\r\n\r\n\t#ifdef SCREEN_MODE\r\n\r\n\t\tvec3 invColor;\r\n\r\n\t#endif\r\n\r\n\t#ifdef NOISE\r\n\r\n\t\tfloat x = vUv.x * vUv.y * time * 1000.0;\r\n\t\tx = mod(x, 13.0) * mod(x, 123.0);\r\n\t\tx = mod(x, 0.01);\r\n\r\n\t\tvec3 noise = texel.rgb * clamp(0.1 + x * 100.0, 0.0, 1.0) * noiseIntensity;\r\n\r\n\t\t#ifdef SCREEN_MODE\r\n\r\n\t\t\tinvColor = vec3(1.0) - color;\r\n\t\t\tvec3 invNoise = vec3(1.0) - noise;\r\n\r\n\t\t\tcolor = vec3(1.0) - invColor * invNoise;\r\n\r\n\t\t#else\r\n\r\n\t\t\tcolor += noise;\r\n\r\n\t\t#endif\r\n\r\n\t#endif\r\n\r\n\t#ifdef SCANLINES\r\n\r\n\t\tvec2 sl = vec2(sin(vUv.y * scanlineCount), cos(vUv.y * scanlineCount));\r\n\t\tvec3 scanlines = texel.rgb * vec3(sl.x, sl.y, sl.x) * scanlineIntensity;\r\n\r\n\t\t#ifdef SCREEN_MODE\r\n\r\n\t\t\tinvColor = vec3(1.0) - color;\r\n\t\t\tvec3 invScanlines = vec3(1.0) - scanlines;\r\n\r\n\t\t\tcolor = vec3(1.0) - invColor * invScanlines;\r\n\r\n\t\t#else\r\n\r\n\t\t\tcolor += scanlines;\r\n\r\n\t\t#endif\r\n\r\n\t#endif\r\n\r\n\t#ifdef GREYSCALE\r\n\r\n\t\tcolor = mix(color, vec3(linearToRelativeLuminance(color)), greyscaleIntensity);\r\n\r\n\t#elif defined(SEPIA)\r\n\r\n\t\tvec3 c = color.rgb;\r\n\r\n\t\tcolor.r = dot(c, vec3(1.0 - 0.607 * sepiaIntensity, 0.769 * sepiaIntensity, 0.189 * sepiaIntensity));\r\n\t\tcolor.g = dot(c, vec3(0.349 * sepiaIntensity, 1.0 - 0.314 * sepiaIntensity, 0.168 * sepiaIntensity));\r\n\t\tcolor.b = dot(c, vec3(0.272 * sepiaIntensity, 0.534 * sepiaIntensity, 1.0 - 0.869 * sepiaIntensity));\r\n\r\n\t#endif\r\n\r\n\t#ifdef VIGNETTE\r\n\r\n\t\tconst vec2 center = vec2(0.5);\r\n\r\n\t\t#ifdef ESKIL\r\n\r\n\t\t\tvec2 uv = (vUv - center) * vec2(vignetteOffset);\r\n\t\t\tcolor = mix(color.rgb, vec3(1.0 - vignetteDarkness), dot(uv, uv));\r\n\r\n\t\t#else\r\n\r\n\t\t\tfloat dist = distance(vUv, center);\r\n\t\t\tcolor *= smoothstep(0.8, vignetteOffset * 0.799, dist * (vignetteDarkness + vignetteOffset));\r\n\r\n\t\t#endif\t\t\r\n\r\n\t#endif\r\n\r\n\tgl_FragColor = vec4(clamp(color, 0.0, 1.0), texel.a);\r\n\r\n}\r\n";
  var vertex$7 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var FilmMaterial = function (_ShaderMaterial) {
  		inherits(FilmMaterial, _ShaderMaterial);

  		function FilmMaterial() {
  				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				classCallCheck(this, FilmMaterial);


  				var settings = Object.assign({

  						screenMode: true,
  						noise: true,
  						scanlines: true,

  						greyscale: false,
  						sepia: false,
  						vignette: false,
  						eskil: false,

  						noiseIntensity: 0.5,
  						scanlineIntensity: 0.05,
  						greyscaleIntensity: 1.0,
  						sepiaIntensity: 1.0,

  						vignetteOffset: 1.0,
  						vignetteDarkness: 1.0

  				}, options);

  				var _this = possibleConstructorReturn(this, (FilmMaterial.__proto__ || Object.getPrototypeOf(FilmMaterial)).call(this, {

  						type: "FilmMaterial",

  						uniforms: {

  								tDiffuse: new three.Uniform(null),
  								time: new three.Uniform(0.0),

  								noiseIntensity: new three.Uniform(settings.noiseIntensity),
  								scanlineIntensity: new three.Uniform(settings.scanlineIntensity),
  								scanlineCount: new three.Uniform(0.0),

  								greyscaleIntensity: new three.Uniform(settings.greyscaleIntensity),
  								sepiaIntensity: new three.Uniform(settings.sepiaIntensity),

  								vignetteOffset: new three.Uniform(settings.vignetteOffset),
  								vignetteDarkness: new three.Uniform(settings.vignetteDarkness)

  						},

  						fragmentShader: fragment$7,
  						vertexShader: vertex$7,

  						depthWrite: false,
  						depthTest: false

  				}));

  				_this.setScreenModeEnabled(settings.screenMode);
  				_this.setNoiseEnabled(settings.noise);
  				_this.setScanlinesEnabled(settings.scanlines);
  				_this.setGreyscaleEnabled(settings.greyscale);
  				_this.setSepiaEnabled(settings.sepia);
  				_this.setVignetteEnabled(settings.vignette);
  				_this.setEskilEnabled(settings.eskil);

  				return _this;
  		}

  		createClass(FilmMaterial, [{
  				key: "setScreenModeEnabled",
  				value: function setScreenModeEnabled(enabled) {

  						if (enabled) {

  								this.defines.SCREEN_MODE = "1";
  						} else {

  								delete this.defines.SCREEN_MODE;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setNoiseEnabled",
  				value: function setNoiseEnabled(enabled) {

  						if (enabled) {

  								this.defines.NOISE = "1";
  						} else {

  								delete this.defines.NOISE;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setScanlinesEnabled",
  				value: function setScanlinesEnabled(enabled) {

  						if (enabled) {

  								this.defines.SCANLINES = "1";
  						} else {

  								delete this.defines.SCANLINES;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setGreyscaleEnabled",
  				value: function setGreyscaleEnabled(enabled) {

  						if (enabled) {

  								this.defines.GREYSCALE = "1";
  						} else {

  								delete this.defines.GREYSCALE;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setSepiaEnabled",
  				value: function setSepiaEnabled(enabled) {

  						if (enabled) {

  								this.defines.SEPIA = "1";
  						} else {

  								delete this.defines.SEPIA;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setVignetteEnabled",
  				value: function setVignetteEnabled(enabled) {

  						if (enabled) {

  								this.defines.VIGNETTE = "1";
  						} else {

  								delete this.defines.VIGNETTE;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setEskilEnabled",
  				value: function setEskilEnabled(enabled) {

  						if (enabled) {

  								this.defines.ESKIL = "1";
  						} else {

  								delete this.defines.ESKIL;
  						}

  						this.needsUpdate = true;
  				}
  		}]);
  		return FilmMaterial;
  }(three.ShaderMaterial);

  var fragment$8 = "uniform sampler2D tDiffuse;\r\nuniform sampler2D tPerturb;\r\n\r\nuniform bool active;\r\n\r\nuniform float amount;\r\nuniform float angle;\r\nuniform float seed;\r\nuniform float seedX;\r\nuniform float seedY;\r\nuniform float distortionX;\r\nuniform float distortionY;\r\nuniform float colS;\r\n\r\nvarying vec2 vUv;\r\n\r\nfloat rand(vec2 tc) {\r\n\r\n\tconst float a = 12.9898;\r\n\tconst float b = 78.233;\r\n\tconst float c = 43758.5453;\r\n\r\n\tfloat dt = dot(tc, vec2(a, b));\r\n\tfloat sn = mod(dt, 3.14);\r\n\r\n\treturn fract(sin(sn) * c);\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\tvec2 coord = vUv;\r\n\r\n\tfloat xs, ys;\r\n\tvec4 normal;\r\n\r\n\tvec2 offset;\r\n\tvec4 cr, cga, cb;\r\n\tvec4 snow, color;\r\n\r\n\tfloat sx, sy;\r\n\r\n\tif(active) {\r\n\r\n\t\txs = floor(gl_FragCoord.x / 0.5);\r\n\t\tys = floor(gl_FragCoord.y / 0.5);\r\n\r\n\t\tnormal = texture2D(tPerturb, coord * seed * seed);\r\n\r\n\t\tif(coord.y < distortionX + colS && coord.y > distortionX - colS * seed) {\r\n\r\n\t\t\tsx = clamp(ceil(seedX), 0.0, 1.0);\r\n\t\t\tcoord.y = sx * (1.0 - (coord.y + distortionY)) + (1.0 - sx) * distortionY;\r\n\r\n\t\t}\r\n\r\n\t\tif(coord.x < distortionY + colS && coord.x > distortionY - colS * seed) {\r\n\r\n\t\t\tsy = clamp(ceil(seedY), 0.0, 1.0);\r\n\t\t\tcoord.x = sy * distortionX + (1.0 - sy) * (1.0 - (coord.x + distortionX));\r\n\r\n\t\t}\r\n\r\n\t\tcoord.x += normal.x * seedX * (seed / 5.0);\r\n\t\tcoord.y += normal.y * seedY * (seed / 5.0);\r\n\r\n\t\toffset = amount * vec2(cos(angle), sin(angle));\r\n\r\n\t\tcr = texture2D(tDiffuse, coord + offset);\r\n\t\tcga = texture2D(tDiffuse, coord);\r\n\t\tcb = texture2D(tDiffuse, coord - offset);\r\n\r\n\t\tcolor = vec4(cr.r, cga.g, cb.b, cga.a);\r\n\t\tsnow = 200.0 * amount * vec4(rand(vec2(xs * seed, ys * seed * 50.0)) * 0.2);\r\n\t\tcolor += snow;\r\n\r\n\t} else {\r\n\r\n\t\tcolor = texture2D(tDiffuse, vUv);\r\n\r\n\t}\r\n\r\n\tgl_FragColor = color;\r\n\r\n}\r\n";
  var vertex$8 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var GlitchMaterial = function (_ShaderMaterial) {
  			inherits(GlitchMaterial, _ShaderMaterial);

  			function GlitchMaterial() {
  						classCallCheck(this, GlitchMaterial);
  						return possibleConstructorReturn(this, (GlitchMaterial.__proto__ || Object.getPrototypeOf(GlitchMaterial)).call(this, {

  									type: "GlitchMaterial",

  									uniforms: {

  												tDiffuse: new three.Uniform(null),
  												tPerturb: new three.Uniform(null),

  												active: new three.Uniform(1),

  												amount: new three.Uniform(0.8),
  												angle: new three.Uniform(0.02),
  												seed: new three.Uniform(0.02),
  												seedX: new three.Uniform(0.02),
  												seedY: new three.Uniform(0.02),
  												distortionX: new three.Uniform(0.5),
  												distortionY: new three.Uniform(0.6),
  												colS: new three.Uniform(0.05)

  									},

  									fragmentShader: fragment$8,
  									vertexShader: vertex$8,

  									depthWrite: false,
  									depthTest: false

  						}));
  			}

  			return GlitchMaterial;
  }(three.ShaderMaterial);

  var fragment$9 = "#include <common>\r\n#include <dithering_pars_fragment>\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform vec3 lightPosition;\r\n\r\nuniform float exposure;\r\nuniform float decay;\r\nuniform float density;\r\nuniform float weight;\r\nuniform float clampMax;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec2 texCoord = vUv;\r\n\r\n\t// Calculate vector from pixel to light source in screen space.\r\n\tvec2 deltaTexCoord = texCoord - lightPosition.st;\r\n\tdeltaTexCoord *= 1.0 / NUM_SAMPLES_FLOAT * density;\r\n\r\n\t// A decreasing illumination factor.\r\n\tfloat illuminationDecay = 1.0;\r\n\r\n\tvec4 sample;\r\n\tvec4 color = vec4(0.0);\r\n\r\n\t// Estimate the probability of occlusion at each pixel by summing samples along a ray to the light source.\r\n\tfor(int i = 0; i < NUM_SAMPLES_INT; ++i) {\r\n\r\n\t\ttexCoord -= deltaTexCoord;\r\n\t\tsample = texture2D(tDiffuse, texCoord);\r\n\r\n\t\t// Apply sample attenuation scale/decay factors.\r\n\t\tsample *= illuminationDecay * weight;\r\n\r\n\t\tcolor += sample;\r\n\r\n\t\t// Update exponential decay factor.\r\n\t\tilluminationDecay *= decay;\r\n\r\n\t}\r\n\r\n\tgl_FragColor = clamp(color * exposure, 0.0, clampMax);\r\n\r\n\t#include <dithering_fragment>\r\n\r\n}\r\n";
  var vertex$9 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var GodRaysMaterial = function (_ShaderMaterial) {
  			inherits(GodRaysMaterial, _ShaderMaterial);

  			function GodRaysMaterial() {
  						var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  						classCallCheck(this, GodRaysMaterial);


  						var settings = Object.assign({
  									exposure: 0.6,
  									density: 0.93,
  									decay: 0.96,
  									weight: 0.4,
  									clampMax: 1.0
  						}, options);

  						return possibleConstructorReturn(this, (GodRaysMaterial.__proto__ || Object.getPrototypeOf(GodRaysMaterial)).call(this, {

  									type: "GodRaysMaterial",

  									defines: {

  												NUM_SAMPLES_FLOAT: "60.0",
  												NUM_SAMPLES_INT: "60"

  									},

  									uniforms: {

  												tDiffuse: new three.Uniform(null),
  												lightPosition: new three.Uniform(null),

  												exposure: new three.Uniform(settings.exposure),
  												decay: new three.Uniform(settings.decay),
  												density: new three.Uniform(settings.density),
  												weight: new three.Uniform(settings.weight),
  												clampMax: new three.Uniform(settings.clampMax)

  									},

  									fragmentShader: fragment$9,
  									vertexShader: vertex$9,

  									depthWrite: false,
  									depthTest: false

  						}));
  			}

  			return GodRaysMaterial;
  }(three.ShaderMaterial);

  var fragment$10 = "#include <common>\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform float distinction;\r\nuniform vec2 range;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tfloat l = linearToRelativeLuminance(texel.rgb);\r\n\r\n\t#ifdef RANGE\r\n\r\n\t\tfloat low = step(range.x, l);\r\n\t\tfloat high = step(l, range.y);\r\n\r\n\t\t// Apply the mask.\r\n\t\tl *= low * high;\r\n\r\n\t#endif\r\n\r\n\tl = pow(abs(l), distinction);\r\n\r\n\t#ifdef COLOR\r\n\r\n\t\tgl_FragColor = vec4(texel.rgb * l, texel.a);\r\n\r\n\t#else\r\n\r\n\t\tgl_FragColor = vec4(l, l, l, texel.a);\r\n\r\n\t#endif\r\n\r\n}\r\n";
  var vertex$10 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var LuminosityMaterial = function (_ShaderMaterial) {
  		inherits(LuminosityMaterial, _ShaderMaterial);

  		function LuminosityMaterial() {
  				var colorOutput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  				var luminanceRange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  				classCallCheck(this, LuminosityMaterial);


  				var maskLuminance = luminanceRange !== null;

  				var _this = possibleConstructorReturn(this, (LuminosityMaterial.__proto__ || Object.getPrototypeOf(LuminosityMaterial)).call(this, {

  						type: "LuminosityMaterial",

  						uniforms: {

  								tDiffuse: new three.Uniform(null),
  								distinction: new three.Uniform(1.0),
  								range: new three.Uniform(maskLuminance ? luminanceRange : new three.Vector2())

  						},

  						fragmentShader: fragment$10,
  						vertexShader: vertex$10

  				}));

  				_this.setColorOutputEnabled(colorOutput);
  				_this.setLuminanceRangeEnabled(maskLuminance);

  				return _this;
  		}

  		createClass(LuminosityMaterial, [{
  				key: "setColorOutputEnabled",
  				value: function setColorOutputEnabled(enabled) {

  						if (enabled) {

  								this.defines.COLOR = "1";
  						} else {

  								delete this.defines.COLOR;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setLuminanceRangeEnabled",
  				value: function setLuminanceRangeEnabled(enabled) {

  						if (enabled) {

  								this.defines.RANGE = "1";
  						} else {

  								delete this.defines.RANGE;
  						}

  						this.needsUpdate = true;
  				}
  		}]);
  		return LuminosityMaterial;
  }(three.ShaderMaterial);

  var fragment$11 = "uniform sampler2D tDiffuse;\r\nuniform float granularity;\r\nuniform float dx;\r\nuniform float dy;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel;\r\n\r\n\tif(granularity > 0.0) {\r\n\r\n\t\tvec2 coord = vec2(\r\n\t\t\tdx * (floor(vUv.x / dx) + 0.5),\r\n\t\t\tdy * (floor(vUv.y / dy) + 0.5)\r\n\t\t);\r\n\r\n\t\ttexel = texture2D(tDiffuse, coord);\r\n\r\n\t} else {\r\n\r\n\t\ttexel = texture2D(tDiffuse, vUv);\r\n\r\n\t}\r\n\r\n\tgl_FragColor = texel;\r\n\r\n}\r\n";
  var vertex$11 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var PixelationMaterial = function (_ShaderMaterial) {
  	inherits(PixelationMaterial, _ShaderMaterial);

  	function PixelationMaterial() {
  		classCallCheck(this, PixelationMaterial);
  		return possibleConstructorReturn(this, (PixelationMaterial.__proto__ || Object.getPrototypeOf(PixelationMaterial)).call(this, {

  			type: "PixelationMaterial",

  			uniforms: {

  				tDiffuse: new three.Uniform(null),
  				granularity: new three.Uniform(1.0),
  				resolution: new three.Uniform(new three.Vector2(1.0, 1.0)),
  				dx: new three.Uniform(1.0),
  				dy: new three.Uniform(1.0)

  			},

  			fragmentShader: fragment$11,
  			vertexShader: vertex$11,

  			depthWrite: false,
  			depthTest: false

  		}));
  	}

  	createClass(PixelationMaterial, [{
  		key: "setResolution",
  		value: function setResolution(width, height) {

  			this.uniforms.resolution.value.set(width, height);
  			this.granularity = this.granularity;
  		}
  	}, {
  		key: "granularity",
  		get: function get$$1() {

  			return this.uniforms.granularity.value;
  		},
  		set: function set$$1(x) {

  			var uniforms = this.uniforms;
  			var resolution = uniforms.resolution.value;

  			uniforms.granularity.value = x;
  			uniforms.dx.value = x / resolution.x;
  			uniforms.dy.value = x / resolution.y;
  		}
  	}]);
  	return PixelationMaterial;
  }(three.ShaderMaterial);

  var fragment$12 = "#include <common>\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform sampler2D tDepth;\r\n\r\nuniform vec2 texelSize;\r\nuniform vec2 halfTexelSize;\r\n\r\nuniform float cameraNear;\r\nuniform float cameraFar;\r\n\r\nuniform float focalLength;\r\nuniform float focalStop;\r\n\r\nuniform float maxBlur;\r\nuniform float luminanceThreshold;\r\nuniform float luminanceGain;\r\nuniform float bias;\r\nuniform float fringe;\r\nuniform float ditherStrength;\r\n\r\n#ifdef SHADER_FOCUS\r\n\r\n\tuniform vec2 focusCoords;\r\n\r\n#else\r\n\r\n\tuniform float focalDepth;\r\n\r\n#endif\r\n\r\nvarying vec2 vUv;\r\n\r\n#ifndef USE_LOGDEPTHBUF\r\n\r\n\t#include <packing>\r\n\r\n\tfloat readDepth(sampler2D depthSampler, vec2 coord) {\r\n\r\n\t\tfloat fragCoordZ = texture2D(depthSampler, coord).x;\r\n\t\tfloat viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);\r\n\r\n\t\treturn viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\n#ifdef PENTAGON\r\n\r\n\tfloat penta(vec2 coords) {\r\n\r\n\t\tconst vec4 HS0 = vec4( 1.0,          0.0,         0.0, 1.0);\r\n\t\tconst vec4 HS1 = vec4( 0.309016994,  0.951056516, 0.0, 1.0);\r\n\t\tconst vec4 HS2 = vec4(-0.809016994,  0.587785252, 0.0, 1.0);\r\n\t\tconst vec4 HS3 = vec4(-0.809016994, -0.587785252, 0.0, 1.0);\r\n\t\tconst vec4 HS4 = vec4( 0.309016994, -0.951056516, 0.0, 1.0);\r\n\t\tconst vec4 HS5 = vec4( 0.0,          0.0,         1.0, 1.0);\r\n\r\n\t\tconst vec4 ONE = vec4(1.0);\r\n\r\n\t\tconst float P_FEATHER = 0.4;\r\n\t\tconst float N_FEATHER = -P_FEATHER;\r\n\r\n\t\tfloat inOrOut = -4.0;\r\n\r\n\t\tvec4 P = vec4(coords, vec2(RINGS_FLOAT - 1.3));\r\n\r\n\t\tvec4 dist = vec4(\r\n\t\t\tdot(P, HS0),\r\n\t\t\tdot(P, HS1),\r\n\t\t\tdot(P, HS2),\r\n\t\t\tdot(P, HS3)\r\n\t\t);\r\n\r\n\t\tdist = smoothstep(N_FEATHER, P_FEATHER, dist);\r\n\r\n\t\tinOrOut += dot(dist, ONE);\r\n\r\n\t\tdist.x = dot(P, HS4);\r\n\t\tdist.y = HS5.w - abs(P.z);\r\n\r\n\t\tdist = smoothstep(N_FEATHER, P_FEATHER, dist);\r\n\t\tinOrOut += dist.x;\r\n\r\n\t\treturn clamp(inOrOut, 0.0, 1.0);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\n#ifdef SHOW_FOCUS\r\n\r\n\tvec3 debugFocus(vec3 c, float blur, float depth) {\r\n\r\n\t\tfloat edge = 0.002 * depth;\r\n\t\tfloat m = clamp(smoothstep(0.0, edge, blur), 0.0, 1.0);\r\n\t\tfloat e = clamp(smoothstep(1.0 - edge, 1.0, blur), 0.0, 1.0);\r\n\r\n\t\tc = mix(c, vec3(1.0, 0.5, 0.0), (1.0 - m) * 0.6);\r\n\t\tc = mix(c, vec3(0.0, 0.5, 1.0), ((1.0 - e) - (1.0 - m)) * 0.2);\r\n\r\n\t\treturn c;\r\n\r\n\t}\r\n\r\n#endif\r\n\r\n#ifdef VIGNETTE\r\n\r\n\tfloat vignette() {\r\n\r\n\t\tconst vec2 CENTER = vec2(0.5);\r\n\r\n\t\tconst float VIGNETTE_OUT = 1.3;\r\n\t\tconst float VIGNETTE_IN = 0.0;\r\n\t\tconst float VIGNETTE_FADE = 22.0; \r\n\r\n\t\tfloat d = distance(vUv, CENTER);\r\n\t\td = smoothstep(VIGNETTE_OUT + (focalStop / VIGNETTE_FADE), VIGNETTE_IN + (focalStop / VIGNETTE_FADE), d);\r\n\r\n\t\treturn clamp(d, 0.0, 1.0);\r\n\r\n\t}\r\n\r\n#endif\r\n\r\nvec2 rand2(vec2 coord) {\r\n\r\n\tvec2 noise;\r\n\r\n\t#ifdef NOISE\r\n\r\n\t\tconst float a = 12.9898;\r\n\t\tconst float b = 78.233;\r\n\t\tconst float c = 43758.5453;\r\n\r\n\t\tnoise.x = clamp(fract(sin(mod(dot(coord, vec2(a, b)), 3.14)) * c), 0.0, 1.0) * 2.0 - 1.0;\r\n\t\tnoise.y = clamp(fract(sin(mod(dot(coord, vec2(a, b) * 2.0), 3.14)) * c), 0.0, 1.0) * 2.0 - 1.0;\r\n\r\n\t#else\r\n\r\n\t\tnoise.x = ((fract(1.0 - coord.s * halfTexelSize.x) * 0.25) + (fract(coord.t * halfTexelSize.y) * 0.75)) * 2.0 - 1.0;\r\n\t\tnoise.y = ((fract(1.0 - coord.s * halfTexelSize.x) * 0.75) + (fract(coord.t * halfTexelSize.y) * 0.25)) * 2.0 - 1.0;\r\n\r\n\t#endif\r\n\r\n\treturn noise;\r\n\r\n}\r\n\r\nvec3 processTexel(vec2 coords, float blur) {\r\n\r\n\tvec3 c;\r\n\tc.r = texture2D(tDiffuse, coords + vec2(0.0, 1.0) * texelSize * fringe * blur).r;\r\n\tc.g = texture2D(tDiffuse, coords + vec2(-0.866, -0.5) * texelSize * fringe * blur).g;\r\n\tc.b = texture2D(tDiffuse, coords + vec2(0.866, -0.5) * texelSize * fringe * blur).b;\r\n\r\n\t// Calculate the luminance of the constructed colour.\r\n\tfloat luminance = linearToRelativeLuminance(c);\r\n\tfloat threshold = max((luminance - luminanceThreshold) * luminanceGain, 0.0);\r\n\r\n\treturn c + mix(vec3(0.0), c, threshold * blur);\r\n\r\n}\r\n\r\nfloat linearize(float depth) {\r\n\r\n\treturn -cameraFar * cameraNear / (depth * (cameraFar - cameraNear) - cameraFar);\r\n\r\n}\r\n\r\nfloat gather(float i, float j, float ringSamples, inout vec3 color, float w, float h, float blur) {\r\n\r\n\tconst float TWO_PI = 6.28318531;\r\n\r\n\tfloat step = TWO_PI / ringSamples;\r\n\tfloat pw = cos(j * step) * i;\r\n\tfloat ph = sin(j * step) * i;\r\n\r\n\t#ifdef PENTAGON\r\n\r\n\t\tfloat p = penta(vec2(pw, ph));\r\n\r\n\t#else\r\n\r\n\t\tfloat p = 1.0;\r\n\r\n\t#endif\r\n\r\n\tcolor += processTexel(vUv + vec2(pw * w, ph * h), blur) * mix(1.0, i / RINGS_FLOAT, bias) * p;\r\n\r\n\treturn mix(1.0, i / RINGS_FLOAT, bias) * p;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\t#ifdef USE_LOGDEPTHBUF\r\n\r\n\t\tfloat depth = linearize(texture2D(tDepth, vUv).x);\r\n\r\n\t#else\r\n\r\n\t\tfloat depth = linearize(readDepth(tDepth, vUv));\r\n\r\n\t#endif\r\n\r\n\t#ifdef SHADER_FOCUS\r\n\r\n\t\t#ifdef USE_LOGDEPTHBUF\r\n\r\n\t\t\tfloat fDepth = linearize(texture2D(tDepth, focusCoords).x);\r\n\r\n\t\t#else\r\n\r\n\t\t\tfloat fDepth = linearize(readDepth(tDepth, focusCoords));\r\n\r\n\t\t#endif\r\n\r\n\t#else\r\n\r\n\t\tfloat fDepth = focalDepth;\r\n\r\n\t#endif\r\n\r\n\t#ifdef MANUAL_DOF\r\n\r\n\t\tconst float nDoFStart = 1.0; \r\n\t\tconst float nDoFDist = 2.0;\r\n\t\tconst float fDoFStart = 1.0;\r\n\t\tconst float fDoFDist = 3.0;\r\n\r\n\t\tfloat focalPlane = depth - fDepth;\r\n\t\tfloat farDoF = (focalPlane - fDoFStart) / fDoFDist;\r\n\t\tfloat nearDoF = (-focalPlane - nDoFStart) / nDoFDist;\r\n\r\n\t\tfloat blur = (focalPlane > 0.0) ? farDoF : nearDoF;\r\n\r\n\t#else\r\n\r\n\t\tconst float CIRCLE_OF_CONFUSION = 0.03; // 35mm film = 0.03mm CoC.\r\n\r\n\t\tfloat focalPlaneMM = fDepth * 1000.0;\r\n\t\tfloat depthMM = depth * 1000.0;\r\n\r\n\t\tfloat focalPlane = (depthMM * focalLength) / (depthMM - focalLength);\r\n\t\tfloat farDoF = (focalPlaneMM * focalLength) / (focalPlaneMM - focalLength);\r\n\t\tfloat nearDoF = (focalPlaneMM - focalLength) / (focalPlaneMM * focalStop * CIRCLE_OF_CONFUSION);\r\n\r\n\t\tfloat blur = abs(focalPlane - farDoF) * nearDoF;\r\n\r\n\t#endif\r\n\r\n\tblur = clamp(blur, 0.0, 1.0);\r\n\r\n\t// Dithering.\r\n\tvec2 noise = rand2(vUv) * ditherStrength * blur;\r\n\r\n\tfloat blurFactorX = texelSize.x * blur * maxBlur + noise.x;\r\n\tfloat blurFactorY = texelSize.y * blur * maxBlur + noise.y;\r\n\r\n\tconst int MAX_RING_SAMPLES = RINGS_INT * SAMPLES_INT;\r\n\r\n\t// Calculation of final color.\r\n\tvec4 color;\r\n\r\n\tif(blur < 0.05) {\r\n\r\n\t\tcolor = texture2D(tDiffuse, vUv);\r\n\r\n\t} else {\r\n\r\n\t\tcolor = texture2D(tDiffuse, vUv);\r\n\r\n\t\tfloat s = 1.0;\r\n\t\tint ringSamples;\r\n\r\n\t\tfor(int i = 1; i <= RINGS_INT; ++i) {\r\n\r\n\t\t\tringSamples = i * SAMPLES_INT;\r\n\r\n\t\t\t// Constant loop.\r\n\t\t\tfor(int j = 0; j < MAX_RING_SAMPLES; ++j) {\r\n\r\n\t\t\t\t// Break earlier.\r\n\t\t\t\tif(j >= ringSamples) { break; }\r\n\r\n\t\t\t\ts += gather(float(i), float(j), float(ringSamples), color.rgb, blurFactorX, blurFactorY, blur);\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t\tcolor.rgb /= s; // Divide by sample count.\r\n\r\n\t}\r\n\r\n\t#ifdef SHOW_FOCUS\r\n\r\n\t\tcolor.rgb = debugFocus(color.rgb, blur, depth);\r\n\r\n\t#endif\r\n\r\n\t#ifdef VIGNETTE\r\n\r\n\t\tcolor.rgb *= vignette();\r\n\r\n\t#endif\r\n\r\n\tgl_FragColor = color;\r\n\r\n}\r\n";
  var vertex$12 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var RealisticBokehMaterial = function (_ShaderMaterial) {
  		inherits(RealisticBokehMaterial, _ShaderMaterial);

  		function RealisticBokehMaterial() {
  				var camera = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  				classCallCheck(this, RealisticBokehMaterial);


  				var settings = Object.assign({
  						texelSize: null,
  						rings: 3,
  						samples: 2,
  						showFocus: false,
  						manualDoF: false,
  						vignette: false,
  						pentagon: false,
  						shaderFocus: true,
  						noise: true,
  						maxBlur: 1.0,
  						luminanceThreshold: 0.5,
  						luminanceGain: 2.0,
  						bias: 0.5,
  						fringe: 0.7,
  						ditherStrength: 0.0001
  				}, options);

  				var _this = possibleConstructorReturn(this, (RealisticBokehMaterial.__proto__ || Object.getPrototypeOf(RealisticBokehMaterial)).call(this, {

  						type: "RealisticBokehMaterial",

  						defines: {

  								RINGS_INT: settings.rings.toFixed(0),
  								RINGS_FLOAT: settings.rings.toFixed(1),
  								SAMPLES_INT: settings.samples.toFixed(0),
  								SAMPLES_FLOAT: settings.samples.toFixed(1)

  						},

  						uniforms: {

  								tDiffuse: new three.Uniform(null),
  								tDepth: new three.Uniform(null),

  								texelSize: new three.Uniform(new three.Vector2()),
  								halfTexelSize: new three.Uniform(new three.Vector2()),

  								cameraNear: new three.Uniform(0.1),
  								cameraFar: new three.Uniform(2000),

  								focalLength: new three.Uniform(24.0),
  								focalStop: new three.Uniform(0.9),

  								maxBlur: new three.Uniform(settings.maxBlur),
  								luminanceThreshold: new three.Uniform(settings.luminanceThreshold),
  								luminanceGain: new three.Uniform(settings.luminanceGain),
  								bias: new three.Uniform(settings.bias),
  								fringe: new three.Uniform(settings.fringe),
  								ditherStrength: new three.Uniform(settings.ditherStrength),

  								focusCoords: new three.Uniform(new three.Vector2(0.5, 0.5)),
  								focalDepth: new three.Uniform(1.0)

  						},

  						fragmentShader: fragment$12,
  						vertexShader: vertex$12,

  						depthWrite: false,
  						depthTest: false

  				}));

  				_this.setShowFocusEnabled(settings.showFocus);
  				_this.setManualDepthOfFieldEnabled(settings.manualDoF);
  				_this.setVignetteEnabled(settings.vignette);
  				_this.setPentagonEnabled(settings.pentagon);
  				_this.setShaderFocusEnabled(settings.shaderFocus);
  				_this.setNoiseEnabled(settings.noise);

  				if (settings.texelSize !== null) {

  						_this.setTexelSize(settings.texelSize.x, settings.texelSize.y);
  				}

  				_this.adoptCameraSettings(camera);

  				return _this;
  		}

  		createClass(RealisticBokehMaterial, [{
  				key: "setShowFocusEnabled",
  				value: function setShowFocusEnabled(enabled) {

  						if (enabled) {

  								this.defines.SHOW_FOCUS = "1";
  						} else {

  								delete this.defines.SHOW_FOCUS;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setManualDepthOfFieldEnabled",
  				value: function setManualDepthOfFieldEnabled(enabled) {

  						if (enabled) {

  								this.defines.MANUAL_DOF = "1";
  						} else {

  								delete this.defines.MANUAL_DOF;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setVignetteEnabled",
  				value: function setVignetteEnabled(enabled) {

  						if (enabled) {

  								this.defines.VIGNETTE = "1";
  						} else {

  								delete this.defines.VIGNETTE;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setPentagonEnabled",
  				value: function setPentagonEnabled(enabled) {

  						if (enabled) {

  								this.defines.PENTAGON = "1";
  						} else {

  								delete this.defines.PENTAGON;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setShaderFocusEnabled",
  				value: function setShaderFocusEnabled(enabled) {

  						if (enabled) {

  								this.defines.SHADER_FOCUS = "1";
  						} else {

  								delete this.defines.SHADER_FOCUS;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setNoiseEnabled",
  				value: function setNoiseEnabled(enabled) {

  						if (enabled) {

  								this.defines.NOISE = "1";
  						} else {

  								delete this.defines.NOISE;
  						}

  						this.needsUpdate = true;
  				}
  		}, {
  				key: "setTexelSize",
  				value: function setTexelSize(x, y) {

  						this.uniforms.texelSize.value.set(x, y);
  						this.uniforms.halfTexelSize.value.set(x, y).multiplyScalar(0.5);
  				}
  		}, {
  				key: "adoptCameraSettings",
  				value: function adoptCameraSettings(camera) {

  						if (camera !== null) {

  								this.uniforms.cameraNear.value = camera.near;
  								this.uniforms.cameraFar.value = camera.far;
  								this.uniforms.focalLength.value = camera.getFocalLength();
  						}
  				}
  		}]);
  		return RealisticBokehMaterial;
  }(three.ShaderMaterial);

  var fragment$13 = "#include <common>\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform vec2 center;\r\nuniform float aspect;\r\nuniform float waveSize;\r\nuniform float radius;\r\nuniform float maxRadius;\r\nuniform float amplitude;\r\n\r\nvarying vec2 vUv;\r\nvarying float vSize;\r\n\r\nvoid main() {\r\n\r\n\tvec2 aspectCorrection = vec2(aspect, 1.0);\r\n\r\n\tvec2 difference = vUv * aspectCorrection - center * aspectCorrection;\r\n\tfloat distance = sqrt(dot(difference, difference)) * vSize;\r\n\r\n\tvec2 displacement = vec2(0.0);\r\n\r\n\tif(distance > radius) {\r\n\r\n\t\tif(distance < radius + waveSize) {\r\n\r\n\t\t\tfloat angle = (distance - radius) * PI2 / waveSize;\r\n\t\t\tfloat cosSin = (1.0 - cos(angle)) * 0.5;\r\n\r\n\t\t\tfloat extent = maxRadius + waveSize;\r\n\t\t\tfloat decay = max(extent - distance * distance, 0.0) / extent;\r\n\r\n\t\t\tdisplacement = ((cosSin * amplitude * difference) / distance) * decay;\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\tgl_FragColor = texture2D(tDiffuse, vUv - displacement);\r\n\r\n}\r\n";
  var vertex$13 = "uniform float size;\r\nuniform float scale;\r\nuniform float cameraDistance;\r\n\r\nvarying vec2 vUv;\r\nvarying float vSize;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tvSize = (0.1 * cameraDistance) / size;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var ShockWaveMaterial = function (_ShaderMaterial) {
  	inherits(ShockWaveMaterial, _ShaderMaterial);

  	function ShockWaveMaterial() {
  		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  		classCallCheck(this, ShockWaveMaterial);


  		var settings = Object.assign({
  			maxRadius: 1.0,
  			waveSize: 0.2,
  			amplitude: 0.05
  		}, options);

  		return possibleConstructorReturn(this, (ShockWaveMaterial.__proto__ || Object.getPrototypeOf(ShockWaveMaterial)).call(this, {

  			type: "ShockWaveMaterial",

  			uniforms: {

  				tDiffuse: new three.Uniform(null),

  				center: new three.Uniform(new three.Vector2(0.5, 0.5)),
  				aspect: new three.Uniform(1.0),
  				cameraDistance: new three.Uniform(1.0),

  				size: new three.Uniform(1.0),
  				radius: new three.Uniform(-settings.waveSize),
  				maxRadius: new three.Uniform(settings.maxRadius),
  				waveSize: new three.Uniform(settings.waveSize),
  				amplitude: new three.Uniform(settings.amplitude)

  			},

  			fragmentShader: fragment$13,
  			vertexShader: vertex$13,

  			depthWrite: false,
  			depthTest: false

  		}));
  	}

  	return ShockWaveMaterial;
  }(three.ShaderMaterial);

  var fragment$14 = "uniform sampler2D tDiffuse;\r\nuniform sampler2D tWeights;\r\n\r\nuniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset;\r\n\r\nvoid main() {\r\n\r\n\t// Fetch the blending weights for current pixel.\r\n\tvec4 a;\r\n\ta.xz = texture2D(tWeights, vUv).xz;\r\n\ta.y = texture2D(tWeights, vOffset.zw).g;\r\n\ta.w = texture2D(tWeights, vOffset.xy).a;\r\n\r\n\tvec4 color;\r\n\r\n\t// Check if there is any blending weight with a value greater than 0.0.\r\n\tif(dot(a, vec4(1.0)) < 1e-5) {\r\n\r\n\t\tcolor = texture2D(tDiffuse, vUv, 0.0);\r\n\r\n\t} else {\r\n\r\n\t\t/* Up to four lines can be crossing a pixel (one through each edge).\r\n\t\t * The line with the maximum weight for each direction is favoured.\r\n\t\t */\r\n\r\n\t\tvec2 offset;\r\n\t\toffset.x = a.a > a.b ? a.a : -a.b; // Left vs. right.\r\n\t\toffset.y = a.g > a.r ? -a.g : a.r; // Top vs. bottom (changed signs).\r\n\r\n\t\t// Go in the direction with the maximum weight (horizontal vs. vertical).\r\n\t\tif(abs(offset.x) > abs(offset.y)) {\r\n\r\n\t\t\toffset.y = 0.0;\r\n\r\n\t\t} else {\r\n\r\n\t\t\toffset.x = 0.0;\r\n\r\n\t\t}\r\n\r\n\t\t// Fetch the opposite color and lerp by hand.\r\n\t\tcolor = texture2D(tDiffuse, vUv, 0.0);\r\n\t\tvec2 coord = vUv + sign(offset) * texelSize;\r\n\t\tvec4 oppositeColor = texture2D(tDiffuse, coord, 0.0);\r\n\t\tfloat s = abs(offset.x) > abs(offset.y) ? abs(offset.x) : abs(offset.y);\r\n\r\n\t\t// Gamma correction.\r\n\t\tcolor.rgb = pow(abs(color.rgb), vec3(2.2));\r\n\t\toppositeColor.rgb = pow(abs(oppositeColor.rgb), vec3(2.2));\r\n\t\tcolor = mix(color, oppositeColor, s);\r\n\t\tcolor.rgb = pow(abs(color.rgb), vec3(1.0 / 2.2));\r\n\r\n\t}\r\n\r\n\tgl_FragColor = color;\r\n\r\n}\r\n";
  var vertex$14 = "uniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\r\n\tvOffset = uv.xyxy + texelSize.xyxy * vec4(1.0, 0.0, 0.0, -1.0); // Changed sign in W component.\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var SMAABlendMaterial = function (_ShaderMaterial) {
  			inherits(SMAABlendMaterial, _ShaderMaterial);

  			function SMAABlendMaterial() {
  						var texelSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Vector2();
  						classCallCheck(this, SMAABlendMaterial);
  						return possibleConstructorReturn(this, (SMAABlendMaterial.__proto__ || Object.getPrototypeOf(SMAABlendMaterial)).call(this, {

  									type: "SMAABlendMaterial",

  									uniforms: {

  												tDiffuse: new three.Uniform(null),
  												tWeights: new three.Uniform(null),
  												texelSize: new three.Uniform(texelSize)

  									},

  									fragmentShader: fragment$14,
  									vertexShader: vertex$14,

  									depthWrite: false,
  									depthTest: false

  						}));
  			}

  			return SMAABlendMaterial;
  }(three.ShaderMaterial);

  var fragment$15 = "#define sampleLevelZeroOffset(t, coord, offset) texture2D(t, coord + float(offset) * texelSize, 0.0)\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform sampler2D tArea;\r\nuniform sampler2D tSearch;\r\n\r\nuniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset[3];\r\nvarying vec2 vPixCoord;\r\n\r\nvec2 round(vec2 x) {\r\n\r\n\treturn sign(x) * floor(abs(x) + 0.5);\r\n\r\n}\r\n\r\nfloat searchLength(vec2 e, float bias, float scale) {\r\n\r\n\t// Not required if tSearch accesses are set to point.\r\n\t// const vec2 SEARCH_TEX_PIXEL_SIZE = 1.0 / vec2(66.0, 33.0);\r\n\t// e = vec2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE + e * vec2(scale, 1.0) * vec2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;\r\n\r\n\te.r = bias + e.r * scale;\r\n\r\n\treturn 255.0 * texture2D(tSearch, e, 0.0).r;\r\n\r\n}\r\n\r\nfloat searchXLeft(vec2 texCoord, float end) {\r\n\r\n\t/* @PSEUDO_GATHER4\r\n\t * This texCoord has been offset by (-0.25, -0.125) in the vertex shader to\r\n\t * sample between edge, thus fetching four edges in a row.\r\n\t * Sampling with different offsets in each direction allows to disambiguate\r\n\t * which edges are active from the four fetched ones.\r\n\t */\r\n\r\n\tvec2 e = vec2(0.0, 1.0);\r\n\r\n\tfor(int i = 0; i < MAX_SEARCH_STEPS_INT; ++i) {\r\n\r\n\t\te = texture2D(tDiffuse, texCoord, 0.0).rg;\r\n\t\ttexCoord -= vec2(2.0, 0.0) * texelSize;\r\n\r\n\t\tif(!(texCoord.x > end && e.g > 0.8281 && e.r == 0.0)) { break; }\r\n\r\n\t}\r\n\r\n\t// Correct the previously applied offset (-0.25, -0.125).\r\n\ttexCoord.x += 0.25 * texelSize.x;\r\n\r\n\t// The searches are biased by 1, so adjust the coords accordingly.\r\n\ttexCoord.x += texelSize.x;\r\n\r\n\t// Disambiguate the length added by the last step.\r\n\ttexCoord.x += 2.0 * texelSize.x; // Undo last step.\r\n\ttexCoord.x -= texelSize.x * searchLength(e, 0.0, 0.5);\r\n\r\n\treturn texCoord.x;\r\n\r\n}\r\n\r\nfloat searchXRight(vec2 texCoord, float end) {\r\n\r\n\tvec2 e = vec2(0.0, 1.0);\r\n\r\n\tfor(int i = 0; i < MAX_SEARCH_STEPS_INT; ++i) {\r\n\r\n\t\te = texture2D(tDiffuse, texCoord, 0.0).rg;\r\n\t\ttexCoord += vec2(2.0, 0.0) * texelSize;\r\n\r\n\t\tif(!(texCoord.x < end && e.g > 0.8281 && e.r == 0.0)) { break; }\r\n\r\n\t}\r\n\r\n\ttexCoord.x -= 0.25 * texelSize.x;\r\n\ttexCoord.x -= texelSize.x;\r\n\ttexCoord.x -= 2.0 * texelSize.x;\r\n\ttexCoord.x += texelSize.x * searchLength(e, 0.5, 0.5);\r\n\r\n\treturn texCoord.x;\r\n\r\n}\r\n\r\nfloat searchYUp(vec2 texCoord, float end) {\r\n\r\n\tvec2 e = vec2(1.0, 0.0);\r\n\r\n\tfor(int i = 0; i < MAX_SEARCH_STEPS_INT; ++i) {\r\n\r\n\t\te = texture2D(tDiffuse, texCoord, 0.0).rg;\r\n\t\ttexCoord += vec2(0.0, 2.0) * texelSize; // Changed sign.\r\n\r\n\t\tif(!(texCoord.y > end && e.r > 0.8281 && e.g == 0.0)) { break; }\r\n\r\n\t}\r\n\r\n\ttexCoord.y -= 0.25 * texelSize.y; // Changed sign.\r\n\ttexCoord.y -= texelSize.y; // Changed sign.\r\n\ttexCoord.y -= 2.0 * texelSize.y; // Changed sign.\r\n\ttexCoord.y += texelSize.y * searchLength(e.gr, 0.0, 0.5); // Changed sign.\r\n\r\n\treturn texCoord.y;\r\n\r\n}\r\n\r\nfloat searchYDown(vec2 texCoord, float end) {\r\n\r\n\tvec2 e = vec2(1.0, 0.0);\r\n\r\n\tfor(int i = 0; i < MAX_SEARCH_STEPS_INT; ++i ) {\r\n\r\n\t\te = texture2D(tDiffuse, texCoord, 0.0).rg;\r\n\t\ttexCoord -= vec2(0.0, 2.0) * texelSize; // Changed sign.\r\n\r\n\t\tif(!(texCoord.y < end && e.r > 0.8281 && e.g == 0.0)) { break; }\r\n\r\n\t}\r\n\r\n\ttexCoord.y += 0.25 * texelSize.y; // Changed sign.\r\n\ttexCoord.y += texelSize.y; // Changed sign.\r\n\ttexCoord.y += 2.0 * texelSize.y; // Changed sign.\r\n\ttexCoord.y -= texelSize.y * searchLength(e.gr, 0.5, 0.5); // Changed sign.\r\n\r\n\treturn texCoord.y;\r\n\r\n}\r\n\r\nvec2 area(vec2 dist, float e1, float e2, float offset) {\r\n\r\n\t// Rounding prevents precision errors of bilinear filtering.\r\n\tvec2 texCoord = AREATEX_MAX_DISTANCE * round(4.0 * vec2(e1, e2)) + dist;\r\n\r\n\t// Scale and bias for texel space translation.\r\n\ttexCoord = AREATEX_PIXEL_SIZE * texCoord + (0.5 * AREATEX_PIXEL_SIZE);\r\n\r\n\t// Move to proper place, according to the subpixel offset.\r\n\ttexCoord.y += AREATEX_SUBTEX_SIZE * offset;\r\n\r\n\treturn texture2D(tArea, texCoord, 0.0).rg;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\tvec4 weights = vec4(0.0);\r\n\tvec4 subsampleIndices = vec4(0.0);\r\n\tvec2 e = texture2D(tDiffuse, vUv).rg;\r\n\r\n\tif(e.g > 0.0) {\r\n\r\n\t\t// Edge at north.\r\n\t\tvec2 d;\r\n\r\n\t\t// Find the distance to the left.\r\n\t\tvec2 coords;\r\n\t\tcoords.x = searchXLeft(vOffset[0].xy, vOffset[2].x);\r\n\t\tcoords.y = vOffset[1].y; // vOffset[1].y = vUv.y - 0.25 * texelSize.y (@CROSSING_OFFSET)\r\n\t\td.x = coords.x;\r\n\r\n\t\t/* Now fetch the left crossing edges, two at a time using bilinear\r\n\t\tfiltering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to discern what\r\n\t\tvalue each edge has. */\r\n\t\tfloat e1 = texture2D(tDiffuse, coords, 0.0).r;\r\n\r\n\t\t// Find the distance to the right.\r\n\t\tcoords.x = searchXRight(vOffset[0].zw, vOffset[2].y);\r\n\t\td.y = coords.x;\r\n\r\n\t\t/* Translate distances to pixel units for better interleave arithmetic and\r\n\t\tmemory accesses. */\r\n\t\td = d / texelSize.x - vPixCoord.x;\r\n\r\n\t\t// The area texture is compressed quadratically.\r\n\t\tvec2 sqrtD = sqrt(abs(d));\r\n\r\n\t\t// Fetch the right crossing edges.\r\n\t\tcoords.y -= texelSize.y; // WebGL port note: Added.\r\n\t\tfloat e2 = sampleLevelZeroOffset(tDiffuse, coords, ivec2(1, 0)).r;\r\n\r\n\t\t// Pattern recognised, now get the actual area.\r\n\t\tweights.rg = area(sqrtD, e1, e2, subsampleIndices.y);\r\n\r\n\t}\r\n\r\n\tif(e.r > 0.0) {\r\n\r\n\t\t// Edge at west.\r\n\t\tvec2 d;\r\n\r\n\t\t// Find the distance to the top.\r\n\t\tvec2 coords;\r\n\t\tcoords.y = searchYUp(vOffset[1].xy, vOffset[2].z);\r\n\t\tcoords.x = vOffset[0].x; // vOffset[1].x = vUv.x - 0.25 * texelSize.x;\r\n\t\td.x = coords.y;\r\n\r\n\t\t// Fetch the top crossing edges.\r\n\t\tfloat e1 = texture2D(tDiffuse, coords, 0.0).g;\r\n\r\n\t\t// Find the distance to the bottom.\r\n\t\tcoords.y = searchYDown(vOffset[1].zw, vOffset[2].w);\r\n\t\td.y = coords.y;\r\n\r\n\t\t// Distances in pixel units.\r\n\t\td = d / texelSize.y - vPixCoord.y;\r\n\r\n\t\t// The area texture is compressed quadratically.\r\n\t\tvec2 sqrtD = sqrt(abs(d));\r\n\r\n\t\t// Fetch the bottom crossing edges.\r\n\t\tcoords.y -= texelSize.y; // WebGL port note: Added.\r\n\t\tfloat e2 = sampleLevelZeroOffset(tDiffuse, coords, ivec2(0, 1)).g;\r\n\r\n\t\t// Get the area for this direction.\r\n\t\tweights.ba = area(sqrtD, e1, e2, subsampleIndices.x);\r\n\r\n\t}\r\n\r\n\tgl_FragColor = weights;\r\n\r\n}\r\n";
  var vertex$15 = "uniform vec2 texelSize;\r\n\r\nvarying vec2 vUv;\r\nvarying vec4 vOffset[3];\r\nvarying vec2 vPixCoord;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\r\n\tvPixCoord = uv / texelSize;\r\n\r\n\t// Offsets for the searches (see @PSEUDO_GATHER4).\r\n\tvOffset[0] = uv.xyxy + texelSize.xyxy * vec4(-0.25, 0.125, 1.25, 0.125); // Changed sign in Y and W components.\r\n\tvOffset[1] = uv.xyxy + texelSize.xyxy * vec4(-0.125, 0.25, -0.125, -1.25); //Changed sign in Y and W components.\r\n\r\n\t// This indicates the ends of the loops.\r\n\tvOffset[2] = vec4(vOffset[0].xz, vOffset[1].yw) + vec4(-2.0, 2.0, -2.0, 2.0) * texelSize.xxyy * MAX_SEARCH_STEPS_FLOAT;\r\n\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var SMAAWeightsMaterial = function (_ShaderMaterial) {
  	inherits(SMAAWeightsMaterial, _ShaderMaterial);

  	function SMAAWeightsMaterial() {
  		var texelSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Vector2();
  		classCallCheck(this, SMAAWeightsMaterial);
  		return possibleConstructorReturn(this, (SMAAWeightsMaterial.__proto__ || Object.getPrototypeOf(SMAAWeightsMaterial)).call(this, {

  			type: "SMAAWeightsMaterial",

  			defines: {
  				MAX_SEARCH_STEPS_INT: "8",
  				MAX_SEARCH_STEPS_FLOAT: "8.0",

  				AREATEX_MAX_DISTANCE: "16.0",
  				AREATEX_PIXEL_SIZE: "(1.0 / vec2(160.0, 560.0))",
  				AREATEX_SUBTEX_SIZE: "(1.0 / 7.0)",
  				SEARCHTEX_SIZE: "vec2(66.0, 33.0)",
  				SEARCHTEX_PACKED_SIZE: "vec2(64.0, 16.0)"

  			},

  			uniforms: {

  				tDiffuse: new three.Uniform(null),
  				tArea: new three.Uniform(null),
  				tSearch: new three.Uniform(null),
  				texelSize: new three.Uniform(texelSize)

  			},

  			fragmentShader: fragment$15,
  			vertexShader: vertex$15,

  			depthWrite: false,
  			depthTest: false

  		}));
  	}

  	createClass(SMAAWeightsMaterial, [{
  		key: "setOrthogonalSearchSteps",
  		value: function setOrthogonalSearchSteps(steps) {

  			this.defines.MAX_SEARCH_STEPS_INT = steps.toFixed("0");
  			this.defines.MAX_SEARCH_STEPS_FLOAT = steps.toFixed("1");

  			this.needsUpdate = true;
  		}
  	}]);
  	return SMAAWeightsMaterial;
  }(three.ShaderMaterial);

  var fragment$16 = "#include <common>\r\n#include <dithering_pars_fragment>\r\n\r\nuniform sampler2D tDiffuse;\r\nuniform float middleGrey;\r\nuniform float maxLuminance;\r\n\r\n#ifdef ADAPTED_LUMINANCE\r\n\r\n\tuniform sampler2D luminanceMap;\r\n\r\n#else\r\n\r\n\tuniform float averageLuminance;\r\n\r\n#endif\r\n\r\nvarying vec2 vUv;\r\n\r\nvec3 toneMap(vec3 c) {\r\n\r\n\t#ifdef ADAPTED_LUMINANCE\r\n\r\n\t\t// Get the calculated average luminance by sampling the center.\r\n\t\tfloat lumAvg = texture2D(luminanceMap, vec2(0.5)).r;\r\n\r\n\t#else\r\n\r\n\t\tfloat lumAvg = averageLuminance;\r\n\r\n\t#endif\r\n\r\n\t// Calculate the luminance of the current pixel.\r\n\tfloat lumPixel = linearToRelativeLuminance(c);\r\n\r\n\t// Apply the modified operator (Reinhard Eq. 4).\r\n\tfloat lumScaled = (lumPixel * middleGrey) / lumAvg;\r\n\r\n\tfloat lumCompressed = (lumScaled * (1.0 + (lumScaled / (maxLuminance * maxLuminance)))) / (1.0 + lumScaled);\r\n\r\n\treturn lumCompressed * c;\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n\tvec4 texel = texture2D(tDiffuse, vUv);\r\n\tgl_FragColor = vec4(toneMap(texel.rgb), texel.a);\r\n\r\n\t#include <dithering_fragment>\r\n\r\n}\r\n";
  var vertex$16 = "varying vec2 vUv;\r\n\r\nvoid main() {\r\n\r\n\tvUv = uv;\r\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n\r\n}\r\n";

  var ToneMappingMaterial = function (_ShaderMaterial) {
  			inherits(ToneMappingMaterial, _ShaderMaterial);

  			function ToneMappingMaterial() {
  						classCallCheck(this, ToneMappingMaterial);
  						return possibleConstructorReturn(this, (ToneMappingMaterial.__proto__ || Object.getPrototypeOf(ToneMappingMaterial)).call(this, {

  									type: "ToneMappingMaterial",

  									uniforms: {

  												tDiffuse: new three.Uniform(null),
  												luminanceMap: new three.Uniform(null),
  												averageLuminance: new three.Uniform(1.0),
  												maxLuminance: new three.Uniform(16.0),
  												middleGrey: new three.Uniform(0.6)

  									},

  									fragmentShader: fragment$16,
  									vertexShader: vertex$16,

  									depthWrite: false,
  									depthTest: false

  						}));
  			}

  			return ToneMappingMaterial;
  }(three.ShaderMaterial);

  var Pass = function () {
  		function Pass() {
  				var scene = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new three.Scene();
  				var camera = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  				var quad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new three.Mesh(new three.PlaneBufferGeometry(2, 2), null);
  				classCallCheck(this, Pass);


  				this.name = "Pass";

  				this.scene = scene;

  				this.camera = camera;

  				this.quad = quad;

  				if (this.quad !== null) {

  						this.quad.frustumCulled = false;

  						if (this.scene !== null) {

  								this.scene.add(this.quad);
  						}
  				}

  				this.needsSwap = false;

  				this.enabled = true;

  				this.renderToScreen = false;
  		}

  		createClass(Pass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer, delta, maskActive) {

  						throw new Error("Render method not implemented!");
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {}
  		}, {
  				key: "initialize",
  				value: function initialize(renderer, alpha) {}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						var key = void 0;

  						var _iteratorNormalCompletion = true;
  						var _didIteratorError = false;
  						var _iteratorError = undefined;

  						try {
  								for (var _iterator = Object.keys(this)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  										key = _step.value;


  										if (this[key] !== null && typeof this[key].dispose === "function") {

  												this[key].dispose();
  												this[key] = null;
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
  		}]);
  		return Pass;
  }();

  var BlurPass = function (_Pass) {
  		inherits(BlurPass, _Pass);

  		function BlurPass() {
  				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				classCallCheck(this, BlurPass);

  				var _this = possibleConstructorReturn(this, (BlurPass.__proto__ || Object.getPrototypeOf(BlurPass)).call(this));

  				_this.name = "BlurPass";

  				_this.needsSwap = true;

  				_this.renderTargetX = new three.WebGLRenderTarget(1, 1, {
  						minFilter: three.LinearFilter,
  						magFilter: three.LinearFilter,
  						stencilBuffer: false,
  						depthBuffer: false
  				});

  				_this.renderTargetX.texture.name = "Blur.TargetX";
  				_this.renderTargetX.texture.generateMipmaps = false;

  				_this.renderTargetY = _this.renderTargetX.clone();

  				_this.renderTargetY.texture.name = "Blur.TargetY";

  				_this.resolutionScale = options.resolutionScale !== undefined ? options.resolutionScale : 0.5;

  				_this.convolutionMaterial = new ConvolutionMaterial();

  				_this.ditheredConvolutionMaterial = new ConvolutionMaterial();
  				_this.ditheredConvolutionMaterial.dithering = true;

  				_this.dithering = false;

  				_this.kernelSize = options.kernelSize;

  				return _this;
  		}

  		createClass(BlurPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						var scene = this.scene;
  						var camera = this.camera;

  						var renderTargetX = this.renderTargetX;
  						var renderTargetY = this.renderTargetY;

  						var material = this.convolutionMaterial;
  						var uniforms = material.uniforms;
  						var kernel = material.getKernel();

  						var lastRT = readBuffer;
  						var destRT = void 0;
  						var i = void 0,
  						    l = void 0;

  						this.quad.material = material;

  						for (i = 0, l = kernel.length - 1; i < l; ++i) {
  								destRT = i % 2 === 0 ? renderTargetX : renderTargetY;

  								uniforms.kernel.value = kernel[i];
  								uniforms.tDiffuse.value = lastRT.texture;
  								renderer.render(scene, camera, destRT);

  								lastRT = destRT;
  						}

  						if (this.dithering) {

  								material = this.ditheredConvolutionMaterial;
  								uniforms = material.uniforms;
  								this.quad.material = material;
  						}

  						uniforms.kernel.value = kernel[i];
  						uniforms.tDiffuse.value = lastRT.texture;
  						renderer.render(scene, camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "initialize",
  				value: function initialize(renderer, alpha) {

  						if (!alpha) {

  								this.renderTargetX.texture.format = three.RGBFormat;
  								this.renderTargetY.texture.format = three.RGBFormat;
  						}
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						width = Math.max(1, Math.floor(width * this.resolutionScale));
  						height = Math.max(1, Math.floor(height * this.resolutionScale));

  						this.renderTargetX.setSize(width, height);
  						this.renderTargetY.setSize(width, height);

  						this.convolutionMaterial.setTexelSize(1.0 / width, 1.0 / height);
  						this.ditheredConvolutionMaterial.setTexelSize(1.0 / width, 1.0 / height);
  				}
  		}, {
  				key: "width",
  				get: function get$$1() {

  						return this.renderTargetX.width;
  				}
  		}, {
  				key: "height",
  				get: function get$$1() {

  						return this.renderTargetX.height;
  				}
  		}, {
  				key: "kernelSize",
  				get: function get$$1() {

  						return this.convolutionMaterial.kernelSize;
  				},
  				set: function set$$1() {
  						var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : KernelSize.LARGE;


  						this.convolutionMaterial.kernelSize = value;
  						this.ditheredConvolutionMaterial.kernelSize = value;
  				}
  		}]);
  		return BlurPass;
  }(Pass);

  var BloomPass = function (_Pass) {
  	inherits(BloomPass, _Pass);

  	function BloomPass() {
  		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  		classCallCheck(this, BloomPass);

  		var _this = possibleConstructorReturn(this, (BloomPass.__proto__ || Object.getPrototypeOf(BloomPass)).call(this));

  		_this.name = "BloomPass";

  		_this.needsSwap = true;

  		_this.blurPass = new BlurPass(options);

  		_this.renderTarget = new three.WebGLRenderTarget(1, 1, {
  			minFilter: three.LinearFilter,
  			magFilter: three.LinearFilter,
  			stencilBuffer: false,
  			depthBuffer: false
  		});

  		_this.renderTarget.texture.name = "Bloom.Target";
  		_this.renderTarget.texture.generateMipmaps = false;

  		_this.combineMaterial = new CombineMaterial(options.screenMode !== undefined ? options.screenMode : true);

  		_this.intensity = options.intensity;

  		_this.luminosityMaterial = new LuminosityMaterial(true);

  		_this.distinction = options.distinction;

  		return _this;
  	}

  	createClass(BloomPass, [{
  		key: "render",
  		value: function render(renderer, readBuffer, writeBuffer) {

  			var quad = this.quad;
  			var scene = this.scene;
  			var camera = this.camera;
  			var blurPass = this.blurPass;

  			var luminosityMaterial = this.luminosityMaterial;
  			var combineMaterial = this.combineMaterial;
  			var renderTarget = this.renderTarget;

  			quad.material = luminosityMaterial;
  			luminosityMaterial.uniforms.tDiffuse.value = readBuffer.texture;
  			renderer.render(scene, camera, renderTarget);

  			blurPass.render(renderer, renderTarget, renderTarget);

  			quad.material = combineMaterial;
  			combineMaterial.uniforms.texture1.value = readBuffer.texture;
  			combineMaterial.uniforms.texture2.value = renderTarget.texture;

  			renderer.render(scene, camera, this.renderToScreen ? null : writeBuffer);
  		}
  	}, {
  		key: "initialize",
  		value: function initialize(renderer, alpha) {

  			this.blurPass.initialize(renderer, alpha);

  			if (!alpha) {

  				this.renderTarget.texture.format = three.RGBFormat;
  			}
  		}
  	}, {
  		key: "setSize",
  		value: function setSize(width, height) {

  			this.blurPass.setSize(width, height);

  			width = this.blurPass.width;
  			height = this.blurPass.height;

  			this.renderTarget.setSize(width, height);
  		}
  	}, {
  		key: "resolutionScale",
  		get: function get$$1() {

  			return this.blurPass.resolutionScale;
  		},
  		set: function set$$1() {
  			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;


  			this.blurPass.resolutionScale = value;
  		}
  	}, {
  		key: "kernelSize",
  		get: function get$$1() {

  			return this.blurPass.kernelSize;
  		},
  		set: function set$$1() {
  			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : KernelSize.LARGE;


  			this.blurPass.kernelSize = value;
  		}
  	}, {
  		key: "intensity",
  		get: function get$$1() {

  			return this.combineMaterial.uniforms.opacity2.value;
  		},
  		set: function set$$1() {
  			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;


  			this.combineMaterial.uniforms.opacity2.value = value;
  		}
  	}, {
  		key: "distinction",
  		get: function get$$1() {

  			return this.luminosityMaterial.uniforms.distinction.value;
  		},
  		set: function set$$1() {
  			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;


  			this.luminosityMaterial.uniforms.distinction.value = value;
  		}
  	}, {
  		key: "dithering",
  		get: function get$$1() {

  			return this.blurPass.dithering;
  		},
  		set: function set$$1(value) {

  			this.blurPass.dithering = value;
  		}
  	}]);
  	return BloomPass;
  }(Pass);

  var BokehPass = function (_Pass) {
  		inherits(BokehPass, _Pass);

  		function BokehPass(camera) {
  				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  				classCallCheck(this, BokehPass);

  				var _this = possibleConstructorReturn(this, (BokehPass.__proto__ || Object.getPrototypeOf(BokehPass)).call(this));

  				_this.name = "BokehPass";

  				_this.needsSwap = true;

  				_this.bokehMaterial = new BokehMaterial(camera, options);

  				_this.quad.material = _this.bokehMaterial;

  				return _this;
  		}

  		createClass(BokehPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						this.bokehMaterial.uniforms.tDiffuse.value = readBuffer.texture;
  						this.bokehMaterial.uniforms.tDepth.value = readBuffer.depthTexture;

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						this.bokehMaterial.uniforms.aspect.value = width / height;
  				}
  		}]);
  		return BokehPass;
  }(Pass);

  var ClearMaskPass = function (_Pass) {
  	inherits(ClearMaskPass, _Pass);

  	function ClearMaskPass() {
  		classCallCheck(this, ClearMaskPass);

  		var _this = possibleConstructorReturn(this, (ClearMaskPass.__proto__ || Object.getPrototypeOf(ClearMaskPass)).call(this, null, null, null));

  		_this.name = "ClearMaskPass";

  		return _this;
  	}

  	createClass(ClearMaskPass, [{
  		key: "render",
  		value: function render(renderer) {

  			renderer.state.buffers.stencil.setTest(false);
  		}
  	}]);
  	return ClearMaskPass;
  }(Pass);

  var color = new three.Color();

  var ClearPass = function (_Pass) {
  		inherits(ClearPass, _Pass);

  		function ClearPass() {
  				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				classCallCheck(this, ClearPass);

  				var _this = possibleConstructorReturn(this, (ClearPass.__proto__ || Object.getPrototypeOf(ClearPass)).call(this, null, null, null));

  				_this.name = "ClearPass";

  				_this.clearColor = options.clearColor !== undefined ? options.clearColor : null;

  				_this.clearAlpha = options.clearAlpha !== undefined ? options.clearAlpha : 0.0;

  				return _this;
  		}

  		createClass(ClearPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer) {

  						var clearColor = this.clearColor;

  						var clearAlpha = void 0;

  						if (clearColor !== null) {

  								color.copy(renderer.getClearColor());
  								clearAlpha = renderer.getClearAlpha();
  								renderer.setClearColor(clearColor, this.clearAlpha);
  						}

  						renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
  						renderer.clear();

  						if (clearColor !== null) {

  								renderer.setClearColor(color, clearAlpha);
  						}
  				}
  		}]);
  		return ClearPass;
  }(Pass);

  var DotScreenPass = function (_Pass) {
  		inherits(DotScreenPass, _Pass);

  		function DotScreenPass() {
  				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				classCallCheck(this, DotScreenPass);

  				var _this = possibleConstructorReturn(this, (DotScreenPass.__proto__ || Object.getPrototypeOf(DotScreenPass)).call(this));

  				_this.name = "DotScreenPass";

  				_this.needsSwap = true;

  				_this.material = new DotScreenMaterial(options);

  				_this.quad.material = _this.material;

  				return _this;
  		}

  		createClass(DotScreenPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						this.material.uniforms.tDiffuse.value = readBuffer.texture;

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						width = Math.max(1, width);
  						height = Math.max(1, height);

  						this.material.uniforms.offsetRepeat.value.z = width;
  						this.material.uniforms.offsetRepeat.value.w = height;
  				}
  		}]);
  		return DotScreenPass;
  }(Pass);

  var FilmPass = function (_Pass) {
  		inherits(FilmPass, _Pass);

  		function FilmPass() {
  				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				classCallCheck(this, FilmPass);

  				var _this = possibleConstructorReturn(this, (FilmPass.__proto__ || Object.getPrototypeOf(FilmPass)).call(this));

  				_this.name = "FilmPass";

  				_this.needsSwap = true;

  				_this.material = new FilmMaterial(options);

  				_this.quad.material = _this.material;

  				_this.scanlineDensity = options.scanlineDensity === undefined ? 1.25 : options.scanlineDensity;

  				return _this;
  		}

  		createClass(FilmPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer, delta) {

  						this.material.uniforms.tDiffuse.value = readBuffer.texture;
  						this.material.uniforms.time.value += delta;

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						this.material.uniforms.scanlineCount.value = Math.round(height * this.scanlineDensity);
  				}
  		}]);
  		return FilmPass;
  }(Pass);

  function randomInt(low, high) {

  		return low + Math.floor(Math.random() * (high - low + 1));
  }

  function randomFloat(low, high) {

  		return low + Math.random() * (high - low);
  }

  var GlitchPass = function (_Pass) {
  		inherits(GlitchPass, _Pass);

  		function GlitchPass() {
  				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				classCallCheck(this, GlitchPass);

  				var _this = possibleConstructorReturn(this, (GlitchPass.__proto__ || Object.getPrototypeOf(GlitchPass)).call(this));

  				_this.name = "GlitchPass";

  				_this.needsSwap = true;

  				_this.material = new GlitchMaterial();

  				_this.quad.material = _this.material;

  				_this.texture = null;

  				_this.perturbMap = options.perturbMap !== undefined ? options.perturbMap : _this.generatePerturbMap(options.dtSize);
  				_this.perturbMap.name = "Glitch.Perturbation";
  				_this.perturbMap.generateMipmaps = false;

  				_this.mode = GlitchMode.SPORADIC;

  				_this.counter = 0;

  				_this.breakPoint = randomInt(120, 240);

  				return _this;
  		}

  		createClass(GlitchPass, [{
  				key: "generatePerturbMap",
  				value: function generatePerturbMap() {
  						var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 64;


  						var pixels = size * size;
  						var data = new Float32Array(pixels * 3);

  						var dt = this.perturbMap;
  						var i = void 0,
  						    x = void 0;

  						for (i = 0; i < pixels; ++i) {

  								x = Math.random();

  								data[i * 3] = x;
  								data[i * 3 + 1] = x;
  								data[i * 3 + 2] = x;
  						}

  						if (dt !== null) {

  								dt.dispose();
  						}

  						dt = new three.DataTexture(data, size, size, three.RGBFormat, three.FloatType);
  						dt.needsUpdate = true;

  						this.perturbMap = dt;

  						return dt;
  				}
  		}, {
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						var mode = this.mode;
  						var counter = this.counter;
  						var breakPoint = this.breakPoint;
  						var uniforms = this.material.uniforms;

  						uniforms.tDiffuse.value = readBuffer.texture;
  						uniforms.seed.value = Math.random();
  						uniforms.active.value = true;

  						if (counter % breakPoint === 0 || mode === GlitchMode.CONSTANT_WILD) {

  								uniforms.amount.value = Math.random() / 30.0;
  								uniforms.angle.value = randomFloat(-Math.PI, Math.PI);
  								uniforms.seedX.value = randomFloat(-1.0, 1.0);
  								uniforms.seedY.value = randomFloat(-1.0, 1.0);
  								uniforms.distortionX.value = randomFloat(0.0, 1.0);
  								uniforms.distortionY.value = randomFloat(0.0, 1.0);

  								this.breakPoint = randomInt(120, 240);
  								this.counter = 0;
  						} else {

  								if (counter % breakPoint < breakPoint / 5 || mode === GlitchMode.CONSTANT_MILD) {

  										uniforms.amount.value = Math.random() / 90.0;
  										uniforms.angle.value = randomFloat(-Math.PI, Math.PI);
  										uniforms.distortionX.value = randomFloat(0.0, 1.0);
  										uniforms.distortionY.value = randomFloat(0.0, 1.0);
  										uniforms.seedX.value = randomFloat(-0.3, 0.3);
  										uniforms.seedY.value = randomFloat(-0.3, 0.3);
  								} else {
  										uniforms.active.value = false;
  								}
  						}

  						++this.counter;

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "perturbMap",
  				get: function get$$1() {

  						return this.texture;
  				},
  				set: function set$$1(value) {

  						this.texture = value;
  						this.material.uniforms.tPerturb.value = value;
  				}
  		}]);
  		return GlitchPass;
  }(Pass);

  var GlitchMode = {

  		SPORADIC: 0,
  		CONSTANT_MILD: 1,
  		CONSTANT_WILD: 2

  };

  var RenderPass = function (_Pass) {
  		inherits(RenderPass, _Pass);

  		function RenderPass(scene, camera) {
  				var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  				classCallCheck(this, RenderPass);

  				var _this = possibleConstructorReturn(this, (RenderPass.__proto__ || Object.getPrototypeOf(RenderPass)).call(this, scene, camera, null));

  				_this.name = "RenderPass";

  				_this.clearPass = new ClearPass(options);

  				_this.overrideMaterial = options.overrideMaterial !== undefined ? options.overrideMaterial : null;

  				_this.clearDepth = options.clearDepth !== undefined ? options.clearDepth : false;

  				_this.clear = options.clear !== undefined ? options.clear : true;

  				return _this;
  		}

  		createClass(RenderPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer) {

  						var scene = this.scene;
  						var target = this.renderToScreen ? null : readBuffer;

  						if (this.clear) {

  								this.clearPass.render(renderer, target);
  						} else if (this.clearDepth) {

  								renderer.setRenderTarget(target);
  								renderer.clearDepth();
  						}

  						scene.overrideMaterial = this.overrideMaterial;
  						renderer.render(scene, this.camera, target);
  						scene.overrideMaterial = null;
  				}
  		}]);
  		return RenderPass;
  }(Pass);

  function clamp(value, min, max) {

  		return Math.max(min, Math.min(max, value));
  }

  var GodRaysPass = function (_Pass) {
  		inherits(GodRaysPass, _Pass);

  		function GodRaysPass(scene, camera, lightSource) {
  				var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  				classCallCheck(this, GodRaysPass);

  				var _this = possibleConstructorReturn(this, (GodRaysPass.__proto__ || Object.getPrototypeOf(GodRaysPass)).call(this));

  				_this.name = "GodRaysPass";

  				_this.needsSwap = true;

  				_this.lightScene = new three.Scene();

  				_this.mainScene = scene;

  				_this.mainCamera = camera;

  				_this.renderPassLight = new RenderPass(_this.lightScene, _this.mainCamera);

  				_this.renderPassMask = new RenderPass(_this.mainScene, _this.mainCamera, {
  						overrideMaterial: new three.MeshBasicMaterial({ color: 0x000000 }),
  						clearColor: new three.Color(0x000000)
  				});

  				_this.renderPassMask.clear = false;

  				_this.blurPass = new BlurPass(options);

  				_this.renderTargetX = new three.WebGLRenderTarget(1, 1, {
  						minFilter: three.LinearFilter,
  						magFilter: three.LinearFilter,
  						stencilBuffer: false,
  						depthBuffer: false
  				});

  				_this.renderTargetX.texture.name = "GodRays.TargetX";
  				_this.renderTargetX.texture.generateMipmaps = false;

  				_this.renderTargetY = _this.renderTargetX.clone();

  				_this.renderTargetY.texture.name = "GodRays.TargetY";

  				_this.renderTargetMask = new three.WebGLRenderTarget(1, 1, {
  						minFilter: three.LinearFilter,
  						magFilter: three.LinearFilter
  				});

  				_this.renderTargetMask.texture.name = "GodRays.Mask";
  				_this.renderTargetMask.texture.generateMipmaps = false;

  				_this.lightSource = lightSource;

  				_this.screenPosition = new three.Vector3();

  				_this.godRaysMaterial = new GodRaysMaterial(options);
  				_this.godRaysMaterial.uniforms.lightPosition.value = _this.screenPosition;

  				_this.samples = options.samples;

  				_this.combineMaterial = new CombineMaterial(options.screenMode !== undefined ? options.screenMode : true);

  				_this.intensity = options.intensity;

  				return _this;
  		}

  		createClass(GodRaysPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						var quad = this.quad;
  						var scene = this.scene;
  						var camera = this.camera;
  						var mainScene = this.mainScene;

  						var lightSource = this.lightSource;
  						var screenPosition = this.screenPosition;

  						var godRaysMaterial = this.godRaysMaterial;
  						var combineMaterial = this.combineMaterial;

  						var renderTargetMask = this.renderTargetMask;
  						var renderTargetX = this.renderTargetX;
  						var renderTargetY = this.renderTargetY;

  						var background = void 0,
  						    parent = void 0;

  						screenPosition.copy(lightSource.position).project(this.mainCamera);
  						screenPosition.x = clamp((screenPosition.x + 1.0) * 0.5, 0.0, 1.0);
  						screenPosition.y = clamp((screenPosition.y + 1.0) * 0.5, 0.0, 1.0);

  						parent = lightSource.parent;
  						background = mainScene.background;
  						mainScene.background = null;
  						this.lightScene.add(lightSource);

  						this.renderPassLight.render(renderer, renderTargetMask);
  						this.renderPassMask.render(renderer, renderTargetMask);

  						if (parent !== null) {

  								parent.add(lightSource);
  						}

  						mainScene.background = background;

  						this.blurPass.render(renderer, renderTargetMask, renderTargetX);

  						quad.material = godRaysMaterial;
  						godRaysMaterial.uniforms.tDiffuse.value = renderTargetX.texture;
  						renderer.render(scene, camera, renderTargetY);

  						quad.material = combineMaterial;
  						combineMaterial.uniforms.texture1.value = readBuffer.texture;
  						combineMaterial.uniforms.texture2.value = renderTargetY.texture;

  						renderer.render(scene, camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "initialize",
  				value: function initialize(renderer, alpha) {

  						this.renderPassLight.initialize(renderer, alpha);
  						this.renderPassMask.initialize(renderer, alpha);
  						this.blurPass.initialize(renderer, alpha);

  						if (!alpha) {

  								this.renderTargetMask.texture.format = three.RGBFormat;
  								this.renderTargetX.texture.format = three.RGBFormat;
  								this.renderTargetY.texture.format = three.RGBFormat;
  						}
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						this.renderPassLight.setSize(width, height);
  						this.renderPassMask.setSize(width, height);
  						this.blurPass.setSize(width, height);

  						width = this.blurPass.width;
  						height = this.blurPass.height;

  						this.renderTargetMask.setSize(width, height);
  						this.renderTargetX.setSize(width, height);
  						this.renderTargetY.setSize(width, height);
  				}
  		}, {
  				key: "resolutionScale",
  				get: function get$$1() {

  						return this.blurPass.resolutionScale;
  				},
  				set: function set$$1() {
  						var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;


  						this.blurPass.resolutionScale = value;
  				}
  		}, {
  				key: "kernelSize",
  				get: function get$$1() {

  						return this.blurPass.kernelSize;
  				},
  				set: function set$$1() {
  						var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : KernelSize.LARGE;


  						this.blurPass.kernelSize = value;
  				}
  		}, {
  				key: "intensity",
  				get: function get$$1() {

  						return this.combineMaterial.uniforms.opacity2.value;
  				},
  				set: function set$$1() {
  						var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;


  						this.combineMaterial.uniforms.opacity2.value = value;
  				}
  		}, {
  				key: "samples",
  				get: function get$$1() {

  						return Number.parseInt(this.godRaysMaterial.defines.NUM_SAMPLES_INT);
  				},
  				set: function set$$1() {
  						var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;


  						value = Math.floor(value);

  						this.godRaysMaterial.defines.NUM_SAMPLES_FLOAT = value.toFixed(1);
  						this.godRaysMaterial.defines.NUM_SAMPLES_INT = value.toFixed(0);
  						this.godRaysMaterial.needsUpdate = true;
  				}
  		}, {
  				key: "dithering",
  				get: function get$$1() {

  						return this.godRaysMaterial.dithering;
  				},
  				set: function set$$1(value) {

  						if (this.dithering !== value) {

  								this.godRaysMaterial.dithering = value;
  								this.godRaysMaterial.needsUpdate = true;
  						}
  				}
  		}]);
  		return GodRaysPass;
  }(Pass);

  var MaskPass = function (_Pass) {
  		inherits(MaskPass, _Pass);

  		function MaskPass(scene, camera) {
  				classCallCheck(this, MaskPass);

  				var _this = possibleConstructorReturn(this, (MaskPass.__proto__ || Object.getPrototypeOf(MaskPass)).call(this, scene, camera, null));

  				_this.name = "MaskPass";

  				_this.inverse = false;

  				_this.clearStencil = true;

  				return _this;
  		}

  		createClass(MaskPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						var context = renderer.context;
  						var state = renderer.state;

  						var scene = this.scene;
  						var camera = this.camera;

  						var writeValue = this.inverse ? 0 : 1;
  						var clearValue = 1 - writeValue;

  						state.buffers.color.setMask(false);
  						state.buffers.depth.setMask(false);

  						state.buffers.color.setLocked(true);
  						state.buffers.depth.setLocked(true);

  						state.buffers.stencil.setTest(true);
  						state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
  						state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 0xffffffff);
  						state.buffers.stencil.setClear(clearValue);

  						if (this.clearStencil) {

  								renderer.setRenderTarget(readBuffer);
  								renderer.clearStencil();

  								renderer.setRenderTarget(writeBuffer);
  								renderer.clearStencil();
  						}

  						renderer.render(scene, camera, readBuffer);
  						renderer.render(scene, camera, writeBuffer);

  						state.buffers.color.setLocked(false);
  						state.buffers.depth.setLocked(false);

  						state.buffers.stencil.setFunc(context.EQUAL, 1, 0xffffffff);
  						state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
  				}
  		}]);
  		return MaskPass;
  }(Pass);

  var PixelationPass = function (_Pass) {
  		inherits(PixelationPass, _Pass);

  		function PixelationPass() {
  				var granularity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30.0;
  				classCallCheck(this, PixelationPass);

  				var _this = possibleConstructorReturn(this, (PixelationPass.__proto__ || Object.getPrototypeOf(PixelationPass)).call(this));

  				_this.name = "PixelationPass";

  				_this.needsSwap = true;

  				_this.pixelationMaterial = new PixelationMaterial();

  				_this.granularity = granularity;

  				_this.quad.material = _this.pixelationMaterial;

  				return _this;
  		}

  		createClass(PixelationPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						this.pixelationMaterial.uniforms.tDiffuse.value = readBuffer.texture;

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						this.pixelationMaterial.setResolution(width, height);
  				}
  		}, {
  				key: "granularity",
  				get: function get$$1() {

  						return this.pixelationMaterial.granularity;
  				},
  				set: function set$$1() {
  						var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;


  						value = Math.floor(value);

  						if (value % 2 > 0) {

  								value += 1;
  						}

  						this.pixelationMaterial.granularity = value;
  				}
  		}]);
  		return PixelationPass;
  }(Pass);

  var RealisticBokehPass = function (_Pass) {
  		inherits(RealisticBokehPass, _Pass);

  		function RealisticBokehPass(camera) {
  				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  				classCallCheck(this, RealisticBokehPass);

  				var _this = possibleConstructorReturn(this, (RealisticBokehPass.__proto__ || Object.getPrototypeOf(RealisticBokehPass)).call(this));

  				_this.name = "RealisticBokehPass";

  				_this.needsSwap = true;

  				_this.bokehMaterial = new RealisticBokehMaterial(camera, options);

  				_this.quad.material = _this.bokehMaterial;

  				return _this;
  		}

  		createClass(RealisticBokehPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						this.bokehMaterial.uniforms.tDiffuse.value = readBuffer.texture;
  						this.bokehMaterial.uniforms.tDepth.value = readBuffer.depthTexture;

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						this.bokehMaterial.setTexelSize(1.0 / width, 1.0 / height);
  				}
  		}]);
  		return RealisticBokehPass;
  }(Pass);

  var SavePass = function (_Pass) {
  		inherits(SavePass, _Pass);

  		function SavePass(renderTarget) {
  				var resize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  				classCallCheck(this, SavePass);

  				var _this = possibleConstructorReturn(this, (SavePass.__proto__ || Object.getPrototypeOf(SavePass)).call(this));

  				_this.name = "SavePass";

  				_this.material = new CopyMaterial();

  				_this.quad.material = _this.material;

  				_this.renderTarget = renderTarget !== undefined ? renderTarget : new three.WebGLRenderTarget(1, 1, {
  						minFilter: three.LinearFilter,
  						magFilter: three.LinearFilter,
  						stencilBuffer: false,
  						depthBuffer: false
  				});

  				_this.renderTarget.texture.name = "Save.Target";
  				_this.renderTarget.texture.generateMipmaps = false;

  				_this.resize = resize;

  				return _this;
  		}

  		createClass(SavePass, [{
  				key: "render",
  				value: function render(renderer, readBuffer) {

  						this.material.uniforms.tDiffuse.value = readBuffer.texture;

  						renderer.render(this.scene, this.camera, this.renderTarget);
  				}
  		}, {
  				key: "initialize",
  				value: function initialize(renderer, alpha) {

  						if (!alpha) {

  								this.renderTarget.texture.format = three.RGBFormat;
  						}
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						if (this.resize) {

  								width = Math.max(1, width);
  								height = Math.max(1, height);

  								this.renderTarget.setSize(width, height);
  						}
  				}
  		}]);
  		return SavePass;
  }(Pass);

  var ShaderPass = function (_Pass) {
  		inherits(ShaderPass, _Pass);

  		function ShaderPass(material) {
  				var textureID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "tDiffuse";
  				classCallCheck(this, ShaderPass);

  				var _this = possibleConstructorReturn(this, (ShaderPass.__proto__ || Object.getPrototypeOf(ShaderPass)).call(this));

  				_this.name = "ShaderPass";

  				_this.needsSwap = true;

  				_this.material = material;

  				_this.quad.material = _this.material;

  				_this.textureID = textureID;

  				return _this;
  		}

  		createClass(ShaderPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {

  						if (this.material.uniforms[this.textureID] !== undefined) {

  								this.material.uniforms[this.textureID].value = readBuffer.texture;
  						}

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}]);
  		return ShaderPass;
  }(Pass);

  var HALF_PI = Math.PI * 0.5;

  var v = new three.Vector3();

  var ab = new three.Vector3();

  var ShockWavePass = function (_Pass) {
  		inherits(ShockWavePass, _Pass);

  		function ShockWavePass(camera) {
  				var epicenter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new three.Vector3();
  				var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  				classCallCheck(this, ShockWavePass);

  				var _this = possibleConstructorReturn(this, (ShockWavePass.__proto__ || Object.getPrototypeOf(ShockWavePass)).call(this));

  				_this.name = "ShockWavePass";

  				_this.needsSwap = true;

  				_this.mainCamera = camera;

  				_this.epicenter = epicenter;

  				_this.screenPosition = new three.Vector3();

  				_this.speed = options.speed !== undefined ? options.speed : 2.0;

  				_this.time = 0.0;

  				_this.active = false;

  				_this.shockWaveMaterial = new ShockWaveMaterial(options);

  				_this.shockWaveMaterial.uniforms.center.value = _this.screenPosition;

  				_this.copyMaterial = new CopyMaterial();

  				return _this;
  		}

  		createClass(ShockWavePass, [{
  				key: "explode",
  				value: function explode() {

  						this.time = 0.0;
  						this.active = true;
  				}
  		}, {
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer, delta) {

  						var epicenter = this.epicenter;
  						var mainCamera = this.mainCamera;
  						var screenPosition = this.screenPosition;

  						var shockWaveMaterial = this.shockWaveMaterial;
  						var uniforms = shockWaveMaterial.uniforms;
  						var center = uniforms.center;
  						var radius = uniforms.radius;
  						var maxRadius = uniforms.maxRadius;
  						var waveSize = uniforms.waveSize;

  						this.copyMaterial.uniforms.tDiffuse.value = readBuffer.texture;
  						this.quad.material = this.copyMaterial;

  						if (this.active) {
  								mainCamera.getWorldDirection(v);
  								ab.copy(mainCamera.position).sub(epicenter);

  								if (v.angleTo(ab) > HALF_PI) {
  										uniforms.cameraDistance.value = mainCamera.position.distanceTo(epicenter);

  										screenPosition.copy(epicenter).project(mainCamera);
  										center.value.x = (screenPosition.x + 1.0) * 0.5;
  										center.value.y = (screenPosition.y + 1.0) * 0.5;

  										uniforms.tDiffuse.value = readBuffer.texture;
  										this.quad.material = shockWaveMaterial;
  								}

  								this.time += delta * this.speed;
  								radius.value = this.time - waveSize.value;

  								if (radius.value >= (maxRadius.value + waveSize.value) * 2) {

  										this.active = false;
  								}
  						}

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						this.shockWaveMaterial.uniforms.aspect.value = width / height;
  				}
  		}]);
  		return ShockWavePass;
  }(Pass);

  var searchImageDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII";

  var areaImageDataURL = "data:image/png;base64,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";

  var SMAAPass = function (_Pass) {
  		inherits(SMAAPass, _Pass);

  		function SMAAPass(searchImage, areaImage) {
  				classCallCheck(this, SMAAPass);

  				var _this = possibleConstructorReturn(this, (SMAAPass.__proto__ || Object.getPrototypeOf(SMAAPass)).call(this));

  				_this.name = "SMAAPass";

  				_this.needsSwap = true;

  				_this.renderTargetColorEdges = new three.WebGLRenderTarget(1, 1, {
  						minFilter: three.LinearFilter,
  						format: three.RGBFormat,
  						stencilBuffer: false,
  						depthBuffer: false
  				});

  				_this.renderTargetColorEdges.texture.name = "SMAA.ColorEdges";
  				_this.renderTargetColorEdges.texture.generateMipmaps = false;

  				_this.renderTargetWeights = _this.renderTargetColorEdges.clone();

  				_this.renderTargetWeights.texture.name = "SMAA.Weights";
  				_this.renderTargetWeights.texture.format = three.RGBAFormat;

  				_this.colorEdgesMaterial = new ColorEdgesMaterial();

  				_this.weightsMaterial = new SMAAWeightsMaterial();

  				_this.weightsMaterial.uniforms.tDiffuse.value = _this.renderTargetColorEdges.texture;

  				_this.searchTexture = new three.Texture(searchImage);

  				_this.searchTexture.name = "SMAA.Search";
  				_this.searchTexture.magFilter = three.NearestFilter;
  				_this.searchTexture.minFilter = three.NearestFilter;
  				_this.searchTexture.format = three.RGBAFormat;
  				_this.searchTexture.generateMipmaps = false;
  				_this.searchTexture.needsUpdate = true;
  				_this.searchTexture.flipY = false;

  				_this.weightsMaterial.uniforms.tSearch.value = _this.searchTexture;

  				_this.areaTexture = new three.Texture(areaImage);

  				_this.areaTexture.name = "SMAA.Area";
  				_this.areaTexture.minFilter = three.LinearFilter;
  				_this.areaTexture.format = three.RGBAFormat;
  				_this.areaTexture.generateMipmaps = false;
  				_this.areaTexture.needsUpdate = true;
  				_this.areaTexture.flipY = false;

  				_this.weightsMaterial.uniforms.tArea.value = _this.areaTexture;

  				_this.blendMaterial = new SMAABlendMaterial();

  				_this.blendMaterial.uniforms.tWeights.value = _this.renderTargetWeights.texture;

  				_this.quad.material = _this.blendMaterial;

  				return _this;
  		}

  		createClass(SMAAPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer) {
  						this.quad.material = this.colorEdgesMaterial;
  						this.colorEdgesMaterial.uniforms.tDiffuse.value = readBuffer.texture;
  						renderer.render(this.scene, this.camera, this.renderTargetColorEdges, true);

  						this.quad.material = this.weightsMaterial;
  						renderer.render(this.scene, this.camera, this.renderTargetWeights, false);

  						this.quad.material = this.blendMaterial;
  						this.blendMaterial.uniforms.tDiffuse.value = readBuffer.texture;

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						this.renderTargetColorEdges.setSize(width, height);
  						this.renderTargetWeights.setSize(width, height);

  						this.colorEdgesMaterial.uniforms.texelSize.value.copy(this.weightsMaterial.uniforms.texelSize.value.copy(this.blendMaterial.uniforms.texelSize.value.set(1.0 / width, 1.0 / height)));
  				}
  		}], [{
  				key: "searchImageDataURL",
  				get: function get$$1() {

  						return searchImageDataURL;
  				}
  		}, {
  				key: "areaImageDataURL",
  				get: function get$$1() {

  						return areaImageDataURL;
  				}
  		}]);
  		return SMAAPass;
  }(Pass);

  var TexturePass = function (_Pass) {
  	inherits(TexturePass, _Pass);

  	function TexturePass(texture) {
  		var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
  		classCallCheck(this, TexturePass);

  		var _this = possibleConstructorReturn(this, (TexturePass.__proto__ || Object.getPrototypeOf(TexturePass)).call(this));

  		_this.name = "TexturePass";

  		_this.copyMaterial = new CopyMaterial();
  		_this.copyMaterial.blending = three.AdditiveBlending;
  		_this.copyMaterial.transparent = true;

  		_this.texture = texture;
  		_this.opacity = opacity;

  		_this.quad.material = _this.copyMaterial;

  		return _this;
  	}

  	createClass(TexturePass, [{
  		key: "render",
  		value: function render(renderer, readBuffer) {

  			renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer);
  		}
  	}, {
  		key: "texture",
  		get: function get$$1() {

  			return this.copyMaterial.uniforms.tDiffuse.value;
  		},
  		set: function set$$1(value) {

  			this.copyMaterial.uniforms.tDiffuse.value = value;
  		}
  	}, {
  		key: "opacity",
  		get: function get$$1() {

  			return this.copyMaterial.uniforms.opacity.value;
  		},
  		set: function set$$1() {
  			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;


  			this.copyMaterial.uniforms.opacity.value = value;
  		}
  	}]);
  	return TexturePass;
  }(Pass);

  var ToneMappingPass = function (_Pass) {
  		inherits(ToneMappingPass, _Pass);

  		function ToneMappingPass() {
  				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  				classCallCheck(this, ToneMappingPass);

  				var _this = possibleConstructorReturn(this, (ToneMappingPass.__proto__ || Object.getPrototypeOf(ToneMappingPass)).call(this));

  				_this.name = "ToneMappingPass";

  				_this.needsSwap = true;

  				_this.renderTargetLuminosity = new three.WebGLRenderTarget(1, 1, {
  						minFilter: three.LinearMipMapLinearFilter,
  						magFilter: three.LinearFilter,
  						format: three.RGBFormat,
  						stencilBuffer: false,
  						depthBuffer: false
  				});

  				_this.renderTargetLuminosity.texture.name = "ToneMapping.Luminosity";

  				_this.renderTargetAdapted = _this.renderTargetLuminosity.clone();

  				_this.renderTargetAdapted.texture.name = "ToneMapping.AdaptedLuminosity";
  				_this.renderTargetAdapted.texture.generateMipmaps = false;
  				_this.renderTargetAdapted.texture.minFilter = three.LinearFilter;

  				_this.renderTargetPrevious = _this.renderTargetAdapted.clone();

  				_this.renderTargetPrevious.texture.name = "ToneMapping.PreviousLuminosity";

  				_this.copyMaterial = new CopyMaterial();

  				_this.luminosityMaterial = new LuminosityMaterial();

  				_this.luminosityMaterial.uniforms.distinction.value = options.distinction !== undefined ? options.distinction : 1.0;

  				_this.adaptiveLuminosityMaterial = new AdaptiveLuminosityMaterial();

  				_this.resolution = options.resolution;

  				_this.toneMappingMaterial = new ToneMappingMaterial();

  				_this.adaptive = options.adaptive;

  				return _this;
  		}

  		createClass(ToneMappingPass, [{
  				key: "render",
  				value: function render(renderer, readBuffer, writeBuffer, delta) {

  						var quad = this.quad;
  						var scene = this.scene;
  						var camera = this.camera;

  						var adaptiveLuminosityMaterial = this.adaptiveLuminosityMaterial;
  						var luminosityMaterial = this.luminosityMaterial;
  						var toneMappingMaterial = this.toneMappingMaterial;
  						var copyMaterial = this.copyMaterial;

  						var renderTargetPrevious = this.renderTargetPrevious;
  						var renderTargetLuminosity = this.renderTargetLuminosity;
  						var renderTargetAdapted = this.renderTargetAdapted;

  						if (this.adaptive) {
  								quad.material = luminosityMaterial;
  								luminosityMaterial.uniforms.tDiffuse.value = readBuffer.texture;
  								renderer.render(scene, camera, renderTargetLuminosity);

  								quad.material = adaptiveLuminosityMaterial;
  								adaptiveLuminosityMaterial.uniforms.delta.value = delta;
  								adaptiveLuminosityMaterial.uniforms.tPreviousLum.value = renderTargetPrevious.texture;
  								adaptiveLuminosityMaterial.uniforms.tCurrentLum.value = renderTargetLuminosity.texture;
  								renderer.render(scene, camera, renderTargetAdapted);

  								quad.material = copyMaterial;
  								copyMaterial.uniforms.tDiffuse.value = renderTargetAdapted.texture;
  								renderer.render(scene, camera, renderTargetPrevious);
  						}

  						quad.material = toneMappingMaterial;
  						toneMappingMaterial.uniforms.tDiffuse.value = readBuffer.texture;

  						renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer);
  				}
  		}, {
  				key: "initialize",
  				value: function initialize(renderer) {

  						this.quad.material = new three.MeshBasicMaterial({ color: 0x7fffff });
  						renderer.render(this.scene, this.camera, this.renderTargetPrevious);
  						this.quad.material.dispose();
  				}
  		}, {
  				key: "resolution",
  				get: function get$$1() {

  						return this.renderTargetLuminosity.width;
  				},
  				set: function set$$1() {
  						var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;

  						var exponent = Math.max(0, Math.ceil(Math.log2(value)));
  						value = Math.pow(2, exponent);

  						this.renderTargetLuminosity.setSize(value, value);
  						this.renderTargetPrevious.setSize(value, value);
  						this.renderTargetAdapted.setSize(value, value);

  						this.adaptiveLuminosityMaterial.defines.MIP_LEVEL_1X1 = exponent.toFixed(1);
  						this.adaptiveLuminosityMaterial.needsUpdate = true;
  				}
  		}, {
  				key: "adaptive",
  				get: function get$$1() {

  						return this.toneMappingMaterial.defines.ADAPTED_LUMINANCE !== undefined;
  				},
  				set: function set$$1() {
  						var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


  						if (value) {

  								this.toneMappingMaterial.defines.ADAPTED_LUMINANCE = "1";
  								this.toneMappingMaterial.uniforms.luminanceMap.value = this.renderTargetAdapted.texture;
  						} else {

  								delete this.toneMappingMaterial.defines.ADAPTED_LUMINANCE;
  								this.toneMappingMaterial.uniforms.luminanceMap.value = null;
  						}

  						this.toneMappingMaterial.needsUpdate = true;
  				}
  		}, {
  				key: "dithering",
  				get: function get$$1() {

  						return this.toneMappingMaterial.dithering;
  				},
  				set: function set$$1(value) {

  						if (this.dithering !== value) {

  								this.toneMappingMaterial.dithering = value;
  								this.toneMappingMaterial.needsUpdate = true;
  						}
  				}
  		}]);
  		return ToneMappingPass;
  }(Pass);

  var EffectComposer = function () {
  		function EffectComposer() {
  				var renderer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  				classCallCheck(this, EffectComposer);


  				this.renderer = renderer;

  				this.readBuffer = null;

  				this.writeBuffer = null;

  				if (this.renderer !== null) {

  						this.renderer.autoClear = false;

  						this.readBuffer = this.createBuffer(options.depthBuffer !== undefined ? options.depthBuffer : true, options.stencilBuffer !== undefined ? options.stencilBuffer : false, options.depthTexture !== undefined ? options.depthTexture : false);

  						this.writeBuffer = this.readBuffer.clone();
  				}

  				this.copyPass = new ShaderPass(new CopyMaterial());

  				this.passes = [];
  		}

  		createClass(EffectComposer, [{
  				key: "replaceRenderer",
  				value: function replaceRenderer(renderer) {

  						var oldRenderer = this.renderer;

  						var parent = void 0,
  						    oldSize = void 0,
  						    newSize = void 0;

  						if (oldRenderer !== null && oldRenderer !== renderer) {

  								this.renderer = renderer;
  								this.renderer.autoClear = false;

  								parent = oldRenderer.domElement.parentNode;
  								oldSize = oldRenderer.getSize();
  								newSize = renderer.getSize();

  								if (parent !== null) {

  										parent.removeChild(oldRenderer.domElement);
  										parent.appendChild(renderer.domElement);
  								}

  								if (oldSize.width !== newSize.width || oldSize.height !== newSize.height) {

  										this.setSize();
  								}
  						}

  						return oldRenderer;
  				}
  		}, {
  				key: "createBuffer",
  				value: function createBuffer(depthBuffer, stencilBuffer, depthTexture) {

  						var drawingBufferSize = this.renderer.getDrawingBufferSize();
  						var alpha = this.renderer.context.getContextAttributes().alpha;

  						var renderTarget = new three.WebGLRenderTarget(drawingBufferSize.width, drawingBufferSize.height, {
  								minFilter: three.LinearFilter,
  								magFilter: three.LinearFilter,
  								format: alpha ? three.RGBAFormat : three.RGBFormat,
  								depthBuffer: depthBuffer,
  								stencilBuffer: stencilBuffer,
  								depthTexture: depthTexture ? new three.DepthTexture() : null
  						});

  						if (depthTexture && stencilBuffer) {

  								renderTarget.depthTexture.format = three.DepthStencilFormat;
  								renderTarget.depthTexture.type = three.UnsignedInt248Type;
  						}

  						renderTarget.texture.name = "EffectComposer.Buffer";
  						renderTarget.texture.generateMipmaps = false;

  						return renderTarget;
  				}
  		}, {
  				key: "addPass",
  				value: function addPass(pass, index) {

  						var renderer = this.renderer;
  						var drawingBufferSize = renderer.getDrawingBufferSize();

  						pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
  						pass.initialize(renderer, renderer.context.getContextAttributes().alpha);

  						if (index !== undefined) {

  								this.passes.splice(index, 0, pass);
  						} else {

  								this.passes.push(pass);
  						}
  				}
  		}, {
  				key: "removePass",
  				value: function removePass(pass) {

  						this.passes.splice(this.passes.indexOf(pass), 1);
  				}
  		}, {
  				key: "render",
  				value: function render(delta) {

  						var passes = this.passes;
  						var renderer = this.renderer;
  						var copyPass = this.copyPass;

  						var readBuffer = this.readBuffer;
  						var writeBuffer = this.writeBuffer;

  						var maskActive = false;
  						var pass = void 0,
  						    context = void 0,
  						    buffer = void 0;
  						var i = void 0,
  						    l = void 0;

  						for (i = 0, l = passes.length; i < l; ++i) {

  								pass = passes[i];

  								if (pass.enabled) {

  										pass.render(renderer, readBuffer, writeBuffer, delta, maskActive);

  										if (pass.needsSwap) {

  												if (maskActive) {

  														context = renderer.context;
  														context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);
  														copyPass.render(renderer, readBuffer, writeBuffer);
  														context.stencilFunc(context.EQUAL, 1, 0xffffffff);
  												}

  												buffer = readBuffer;
  												readBuffer = writeBuffer;
  												writeBuffer = buffer;
  										}

  										if (pass instanceof MaskPass) {

  												maskActive = true;
  										} else if (pass instanceof ClearMaskPass) {

  												maskActive = false;
  										}
  								}
  						}
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						var passes = this.passes;
  						var renderer = this.renderer;

  						var size = void 0,
  						    drawingBufferSize = void 0;
  						var i = void 0,
  						    l = void 0;

  						if (width === undefined || height === undefined) {

  								size = renderer.getSize();
  								width = size.width;
  								height = size.height;
  						}

  						renderer.setSize(width, height);

  						drawingBufferSize = renderer.getDrawingBufferSize();

  						this.readBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
  						this.writeBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);

  						for (i = 0, l = passes.length; i < l; ++i) {

  								passes[i].setSize(drawingBufferSize.width, drawingBufferSize.height);
  						}
  				}
  		}, {
  				key: "reset",
  				value: function reset(renderTarget) {

  						var depthBuffer = this.readBuffer.depthBuffer;
  						var stencilBuffer = this.readBuffer.stencilBuffer;
  						var depthTexture = this.readBuffer.depthTexture !== null;

  						this.dispose(renderTarget === undefined ? this.createBuffer(depthBuffer, stencilBuffer, depthTexture) : renderTarget);
  				}
  		}, {
  				key: "dispose",
  				value: function dispose(renderTarget) {

  						var passes = this.passes;

  						if (this.readBuffer !== null && this.writeBuffer !== null) {

  								this.readBuffer.dispose();
  								this.writeBuffer.dispose();

  								this.readBuffer = null;
  								this.writeBuffer = null;
  						}

  						while (passes.length > 0) {

  								passes.pop().dispose();
  						}

  						if (renderTarget !== undefined) {
  								this.readBuffer = renderTarget;
  								this.writeBuffer = this.readBuffer.clone();
  						} else {

  								this.copyPass.dispose();
  						}
  				}
  		}, {
  				key: "depthTexture",
  				get: function get$$1() {

  						return this.readBuffer.depthTexture;
  				},
  				set: function set$$1(x) {

  						this.readBuffer.depthTexture = x;
  						this.writeBuffer.depthTexture = x;
  				}
  		}]);
  		return EffectComposer;
  }();

  function createCanvas(width, height, data, channels) {

  	var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
  	var context = canvas.getContext("2d");

  	var imageData = context.createImageData(width, height);
  	var target = imageData.data;

  	var x = void 0,
  	    y = void 0;
  	var i = void 0,
  	    j = void 0;

  	for (y = 0; y < height; ++y) {

  		for (x = 0; x < width; ++x) {

  			i = (y * width + x) * 4;
  			j = (y * width + x) * channels;

  			target[i] = channels > 0 ? data[j] : 0;
  			target[i + 1] = channels > 1 ? data[j + 1] : 0;
  			target[i + 2] = channels > 2 ? data[j + 2] : 0;
  			target[i + 3] = channels > 3 ? data[j + 3] : 255;
  		}
  	}

  	canvas.width = width;
  	canvas.height = height;

  	context.putImageData(imageData, 0, 0);

  	return canvas;
  }

  var RawImageData = function () {
  	function RawImageData() {
  		var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  		var channels = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;
  		classCallCheck(this, RawImageData);


  		this.width = width;

  		this.height = height;

  		this.data = data;

  		this.channels = channels;
  	}

  	createClass(RawImageData, [{
  		key: "toCanvas",
  		value: function toCanvas() {

  			return typeof document === "undefined" ? null : createCanvas(this.width, this.height, this.data, this.channels);
  		}
  	}]);
  	return RawImageData;
  }();

  var b0 = new three.Box2();

  var b1 = new three.Box2();

  var ORTHOGONAL_SIZE = 16;

  var DIAGONAL_SIZE = 20;

  var DIAGONAL_SAMPLES = 30;

  var SMOOTH_MAX_DISTANCE = 32;

  var orthogonalSubsamplingOffsets = new Float32Array([0.0, -0.25, 0.25, -0.125, 0.125, -0.375, 0.375]);

  var diagonalSubsamplingOffsets = [new Float32Array([0.0, 0.0]), new Float32Array([0.25, -0.25]), new Float32Array([-0.25, 0.25]), new Float32Array([0.125, -0.125]), new Float32Array([-0.125, 0.125])];

  var orthogonalEdges = [new Uint8Array([0, 0]), new Uint8Array([3, 0]), new Uint8Array([0, 3]), new Uint8Array([3, 3]), new Uint8Array([1, 0]), new Uint8Array([4, 0]), new Uint8Array([1, 3]), new Uint8Array([4, 3]), new Uint8Array([0, 1]), new Uint8Array([3, 1]), new Uint8Array([0, 4]), new Uint8Array([3, 4]), new Uint8Array([1, 1]), new Uint8Array([4, 1]), new Uint8Array([1, 4]), new Uint8Array([4, 4])];

  var diagonalEdges = [new Uint8Array([0, 0]), new Uint8Array([1, 0]), new Uint8Array([0, 2]), new Uint8Array([1, 2]), new Uint8Array([2, 0]), new Uint8Array([3, 0]), new Uint8Array([2, 2]), new Uint8Array([3, 2]), new Uint8Array([0, 1]), new Uint8Array([1, 1]), new Uint8Array([0, 3]), new Uint8Array([1, 3]), new Uint8Array([2, 1]), new Uint8Array([3, 1]), new Uint8Array([2, 3]), new Uint8Array([3, 3])];

  function lerp(a, b, p) {

  			return a + (b - a) * p;
  }

  function saturate(a) {

  			return Math.min(Math.max(a, 0.0), 1.0);
  }

  function smoothArea(d, b) {

  			var a1 = b.min;
  			var a2 = b.max;

  			var b1X = Math.sqrt(a1.x * 2.0) * 0.5;
  			var b1Y = Math.sqrt(a1.y * 2.0) * 0.5;
  			var b2X = Math.sqrt(a2.x * 2.0) * 0.5;
  			var b2Y = Math.sqrt(a2.y * 2.0) * 0.5;

  			var p = saturate(d / SMOOTH_MAX_DISTANCE);

  			a1.set(lerp(b1X, a1.x, p), lerp(b1Y, a1.y, p));
  			a2.set(lerp(b2X, a2.x, p), lerp(b2Y, a2.y, p));

  			return b;
  }

  function calculateOrthogonalArea(p1, p2, x, result) {

  			var dX = p2.x - p1.x;
  			var dY = p2.y - p1.y;

  			var x1 = x;
  			var x2 = x + 1.0;

  			var y1 = p1.y + dY * (x1 - p1.x) / dX;
  			var y2 = p1.y + dY * (x2 - p1.x) / dX;

  			var a = void 0,
  			    a1 = void 0,
  			    a2 = void 0,
  			    t = void 0;

  			if (x1 >= p1.x && x1 < p2.x || x2 > p1.x && x2 <= p2.x) {
  						if (Math.sign(y1) === Math.sign(y2) || Math.abs(y1) < 1e-4 || Math.abs(y2) < 1e-4) {

  									a = (y1 + y2) / 2.0;

  									if (a < 0.0) {

  												result.set(Math.abs(a), 0.0);
  									} else {

  												result.set(0.0, Math.abs(a));
  									}
  						} else {
  									t = -p1.y * dX / dY + p1.x;

  									a1 = t > p1.x ? y1 * (t - Math.trunc(t)) / 2.0 : 0.0;
  									a2 = t < p2.x ? y2 * (1.0 - (t - Math.trunc(t))) / 2.0 : 0.0;

  									a = Math.abs(a1) > Math.abs(a2) ? a1 : -a2;

  									if (a < 0.0) {

  												result.set(Math.abs(a1), Math.abs(a2));
  									} else {

  												result.set(Math.abs(a2), Math.abs(a1));
  									}
  						}
  			} else {

  						result.set(0, 0);
  			}

  			return result;
  }

  function calculateOrthogonalAreaForPattern(pattern, left, right, offset, result) {

  			var p1 = b0.min;
  			var p2 = b0.max;
  			var a1 = b1.min;
  			var a2 = b1.max;
  			var a = b1;

  			var o1 = 0.5 + offset;
  			var o2 = 0.5 + offset - 1.0;
  			var d = left + right + 1;

  			switch (pattern) {

  						case 0:
  									{

  												result.set(0, 0);

  												break;
  									}

  						case 1:
  									{

  												if (left <= right) {

  															calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, result);
  												} else {

  															result.set(0, 0);
  												}

  												break;
  									}

  						case 2:
  									{

  												if (left >= right) {

  															calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, result);
  												} else {

  															result.set(0, 0);
  												}

  												break;
  									}

  						case 3:
  									{

  												calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, a1);
  												calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, a2);

  												smoothArea(d, a);

  												result.addVectors(a1, a2);

  												break;
  									}

  						case 4:
  									{

  												if (left <= right) {

  															calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, result);
  												} else {

  															result.set(0, 0);
  												}

  												break;
  									}

  						case 5:
  									{

  												result.set(0, 0);

  												break;
  									}

  						case 6:
  									{

  												if (Math.abs(offset) > 0.0) {

  															calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, a1);
  															calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, a2);
  															a2.add(calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o2), left, result));

  															result.addVectors(a1, a2).divideScalar(2.0);
  												} else {

  															calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);
  												}

  												break;
  									}

  						case 7:
  									{

  												calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);

  												break;
  									}

  						case 8:
  									{

  												if (left >= right) {

  															calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, result);
  												} else {

  															result.set(0, 0);
  												}

  												break;
  									}

  						case 9:
  									{

  												if (Math.abs(offset) > 0.0) {

  															calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, a1);
  															calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d / 2.0, 0.0), left, a2);
  															a2.add(calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, result));

  															result.addVectors(a1, a2).divideScalar(2.0);
  												} else {

  															calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);
  												}

  												break;
  									}

  						case 10:
  									{

  												result.set(0, 0);

  												break;
  									}

  						case 11:
  									{

  												calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);

  												break;
  									}

  						case 12:
  									{

  												calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d / 2.0, 0.0), left, a1);
  												calculateOrthogonalArea(p1.set(d / 2.0, 0.0), p2.set(d, o1), left, a2);

  												smoothArea(d, a);

  												result.addVectors(a1, a2);

  												break;
  									}

  						case 13:
  									{

  												calculateOrthogonalArea(p1.set(0.0, o2), p2.set(d, o1), left, result);

  												break;
  									}

  						case 14:
  									{

  												calculateOrthogonalArea(p1.set(0.0, o1), p2.set(d, o2), left, result);

  												break;
  									}

  						case 15:
  									{

  												result.set(0, 0);

  												break;
  									}

  			}

  			return result;
  }

  function isInsideArea(p1, p2, x, y) {

  			var result = p1.equals(p2);

  			var xm = void 0,
  			    ym = void 0;
  			var a = void 0,
  			    b = void 0,
  			    c = void 0;

  			if (!result) {

  						xm = (p1.x + p2.x) / 2.0;
  						ym = (p1.y + p2.y) / 2.0;

  						a = p2.y - p1.y;
  						b = p1.x - p2.x;

  						c = a * (x - xm) + b * (y - ym);

  						result = c > 0.0;
  			}

  			return result;
  }

  function calculateDiagonalAreaForPixel(p1, p2, pX, pY) {

  			var a = void 0;
  			var x = void 0,
  			    y = void 0;
  			var offsetX = void 0,
  			    offsetY = void 0;

  			for (a = 0, y = 0; y < DIAGONAL_SAMPLES; ++y) {

  						for (x = 0; x < DIAGONAL_SAMPLES; ++x) {

  									offsetX = x / (DIAGONAL_SAMPLES - 1.0);
  									offsetY = y / (DIAGONAL_SAMPLES - 1.0);

  									if (isInsideArea(p1, p2, pX + offsetX, pY + offsetY)) {

  												++a;
  									}
  						}
  			}

  			return a / (DIAGONAL_SAMPLES * DIAGONAL_SAMPLES);
  }

  function calculateDiagonalArea(pattern, p1, p2, left, offset, result) {

  			var e = diagonalEdges[pattern];
  			var e1 = e[0];
  			var e2 = e[1];

  			if (e1 > 0) {

  						p1.x += offset[0];
  						p1.y += offset[1];
  			}

  			if (e2 > 0) {

  						p2.x += offset[0];
  						p2.y += offset[1];
  			}

  			return result.set(1.0 - calculateDiagonalAreaForPixel(p1, p2, 1.0 + left, 0.0 + left), calculateDiagonalAreaForPixel(p1, p2, 1.0 + left, 1.0 + left));
  }

  function calculateDiagonalAreaForPattern(pattern, left, right, offset, result) {

  			var p1 = b0.min;
  			var p2 = b0.max;
  			var a1 = b1.min;
  			var a2 = b1.max;

  			var d = left + right + 1;

  			switch (pattern) {

  						case 0:
  									{
  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);

  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 1:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 2:
  									{

  												calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 3:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, result);

  												break;
  									}

  						case 4:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 5:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(0.0 + d, 0.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 6:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, result);

  												break;
  									}

  						case 7:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 8:
  									{

  												calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 9:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, result);

  												break;
  									}

  						case 10:
  									{

  												calculateDiagonalArea(pattern, p1.set(0.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 11:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 12:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, result);

  												break;
  									}

  						case 13:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 1.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 14:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  						case 15:
  									{

  												calculateDiagonalArea(pattern, p1.set(1.0, 1.0), p2.set(1.0 + d, 1.0 + d), left, offset, a1);
  												calculateDiagonalArea(pattern, p1.set(1.0, 0.0), p2.set(1.0 + d, 0.0 + d), left, offset, a2);

  												result.addVectors(a1, a2).divideScalar(2.0);

  												break;
  									}

  			}

  			return result;
  }

  function generatePatterns(patterns, offset, orthogonal) {

  			var result = new three.Vector2();

  			var i = void 0,
  			    l = void 0;
  			var x = void 0,
  			    y = void 0;
  			var c = void 0;

  			var pattern = void 0;
  			var data = void 0,
  			    size = void 0;

  			for (i = 0, l = patterns.length; i < l; ++i) {

  						pattern = patterns[i];

  						data = pattern.data;
  						size = pattern.width;

  						for (y = 0; y < size; ++y) {

  									for (x = 0; x < size; ++x) {

  												if (orthogonal) {

  															calculateOrthogonalAreaForPattern(i, x, y, offset, result);
  												} else {

  															calculateDiagonalAreaForPattern(i, x, y, offset, result);
  												}

  												c = (y * size + x) * 2;

  												data[c] = result.x * 255;
  												data[c + 1] = result.y * 255;
  									}
  						}
  			}
  }

  function assemble(base, patterns, edges, size, orthogonal, target) {

  			var p = new three.Vector2();

  			var dstData = target.data;
  			var dstWidth = target.width;

  			var i = void 0,
  			    l = void 0;
  			var x = void 0,
  			    y = void 0;
  			var c = void 0,
  			    d = void 0;

  			var edge = void 0;
  			var pattern = void 0;
  			var srcData = void 0,
  			    srcWidth = void 0;

  			for (i = 0, l = patterns.length; i < l; ++i) {

  						edge = edges[i];
  						pattern = patterns[i];

  						srcData = pattern.data;
  						srcWidth = pattern.width;

  						for (y = 0; y < size; ++y) {

  									for (x = 0; x < size; ++x) {

  												p.fromArray(edge).multiplyScalar(size);
  												p.add(base);
  												p.x += x;
  												p.y += y;

  												c = (p.y * dstWidth + p.x) * 2;

  												d = orthogonal ? (y * y * srcWidth + x * x) * 2 : (y * srcWidth + x) * 2;

  												dstData[c] = srcData[d];
  												dstData[c + 1] = srcData[d + 1];
  									}
  						}
  			}
  }

  var SMAAAreaImageData = function () {
  			function SMAAAreaImageData() {
  						classCallCheck(this, SMAAAreaImageData);
  			}

  			createClass(SMAAAreaImageData, null, [{
  						key: "generate",
  						value: function generate() {

  									var width = 2 * 5 * ORTHOGONAL_SIZE;
  									var height = orthogonalSubsamplingOffsets.length * 5 * ORTHOGONAL_SIZE;

  									var data = new Uint8ClampedArray(width * height * 2);
  									var result = new RawImageData(width, height, data, 2);

  									var orthogonalPatternSize = Math.pow(ORTHOGONAL_SIZE - 1, 2) + 1;
  									var diagonalPatternSize = DIAGONAL_SIZE;

  									var orthogonalPatterns = [];
  									var diagonalPatterns = [];

  									var base = new three.Vector2();

  									var i = void 0,
  									    l = void 0;

  									for (i = 0; i < 16; ++i) {

  												orthogonalPatterns.push(new RawImageData(orthogonalPatternSize, orthogonalPatternSize, new Uint8ClampedArray(orthogonalPatternSize * orthogonalPatternSize * 2), 2));

  												diagonalPatterns.push(new RawImageData(diagonalPatternSize, diagonalPatternSize, new Uint8ClampedArray(diagonalPatternSize * diagonalPatternSize * 2), 2));
  									}

  									for (i = 0, l = orthogonalSubsamplingOffsets.length; i < l; ++i) {
  												generatePatterns(orthogonalPatterns, orthogonalSubsamplingOffsets[i], true);

  												base.set(0, 5 * ORTHOGONAL_SIZE * i);
  												assemble(base, orthogonalPatterns, orthogonalEdges, ORTHOGONAL_SIZE, true, result);
  									}

  									for (i = 0, l = diagonalSubsamplingOffsets.length; i < l; ++i) {
  												generatePatterns(diagonalPatterns, diagonalSubsamplingOffsets[i], false);

  												base.set(5 * ORTHOGONAL_SIZE, 4 * DIAGONAL_SIZE * i);
  												assemble(base, diagonalPatterns, diagonalEdges, DIAGONAL_SIZE, false, result);
  									}

  									return result;
  						}
  			}]);
  			return SMAAAreaImageData;
  }();

  var edges = new Map([[bilinear([0, 0, 0, 0]), [0, 0, 0, 0]], [bilinear([0, 0, 0, 1]), [0, 0, 0, 1]], [bilinear([0, 0, 1, 0]), [0, 0, 1, 0]], [bilinear([0, 0, 1, 1]), [0, 0, 1, 1]], [bilinear([0, 1, 0, 0]), [0, 1, 0, 0]], [bilinear([0, 1, 0, 1]), [0, 1, 0, 1]], [bilinear([0, 1, 1, 0]), [0, 1, 1, 0]], [bilinear([0, 1, 1, 1]), [0, 1, 1, 1]], [bilinear([1, 0, 0, 0]), [1, 0, 0, 0]], [bilinear([1, 0, 0, 1]), [1, 0, 0, 1]], [bilinear([1, 0, 1, 0]), [1, 0, 1, 0]], [bilinear([1, 0, 1, 1]), [1, 0, 1, 1]], [bilinear([1, 1, 0, 0]), [1, 1, 0, 0]], [bilinear([1, 1, 0, 1]), [1, 1, 0, 1]], [bilinear([1, 1, 1, 0]), [1, 1, 1, 0]], [bilinear([1, 1, 1, 1]), [1, 1, 1, 1]]]);

  function lerp$1(a, b, p) {

  	return a + (b - a) * p;
  }

  function bilinear(e) {

  	var a = lerp$1(e[0], e[1], 1.0 - 0.25);
  	var b = lerp$1(e[2], e[3], 1.0 - 0.25);

  	return lerp$1(a, b, 1.0 - 0.125);
  }

  function deltaLeft(left, top) {

  	var d = 0;

  	if (top[3] === 1) {

  		d += 1;
  	}

  	if (d === 1 && top[2] === 1 && left[1] !== 1 && left[3] !== 1) {

  		d += 1;
  	}

  	return d;
  }

  function deltaRight(left, top) {

  	var d = 0;

  	if (top[3] === 1 && left[1] !== 1 && left[3] !== 1) {

  		d += 1;
  	}

  	if (d === 1 && top[2] === 1 && left[0] !== 1 && left[2] !== 1) {

  		d += 1;
  	}

  	return d;
  }

  var SMAASearchImageData = function () {
  	function SMAASearchImageData() {
  		classCallCheck(this, SMAASearchImageData);
  	}

  	createClass(SMAASearchImageData, null, [{
  		key: "generate",
  		value: function generate() {

  			var width = 66;
  			var height = 33;

  			var croppedWidth = 64;
  			var croppedHeight = 16;

  			var data = new Uint8ClampedArray(width * height);
  			var croppedData = new Uint8ClampedArray(croppedWidth * croppedHeight);

  			var x = void 0,
  			    y = void 0;
  			var s = void 0,
  			    t = void 0,
  			    i = void 0;
  			var e1 = void 0,
  			    e2 = void 0;

  			for (y = 0; y < height; ++y) {

  				for (x = 0; x < width; ++x) {

  					s = 0.03125 * x;
  					t = 0.03125 * y;

  					if (edges.has(s) && edges.has(t)) {

  						e1 = edges.get(s);
  						e2 = edges.get(t);

  						data[y * width + x] = 127 * deltaLeft(e1, e2);
  						data[y * width + x + width / 2] = 127 * deltaRight(e1, e2);
  					}
  				}
  			}

  			for (i = 0, y = height - croppedHeight; y < height; ++y) {

  				for (x = 0; x < croppedWidth; ++x, ++i) {

  					croppedData[i] = data[y * width + x];
  				}
  			}

  			return new RawImageData(croppedWidth, croppedHeight, croppedData, 1);
  		}
  	}]);
  	return SMAASearchImageData;
  }();

  var Demo = function () {
  	function Demo() {
  		var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "demo";
  		classCallCheck(this, Demo);


  		this.id = id;

  		this.composer = null;

  		this.loadingManager = new three.LoadingManager();

  		this.assets = new Map();

  		this.renderPass = new RenderPass(new three.Scene(), null);
  		this.renderPass.renderToScreen = true;

  		this.controls = null;

  		this.ready = false;
  	}

  	createClass(Demo, [{
  		key: "setComposer",
  		value: function setComposer(composer) {

  			this.composer = composer;

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
  		key: "update",
  		value: function update(delta) {}
  	}, {
  		key: "registerOptions",
  		value: function registerOptions(menu) {}
  	}, {
  		key: "reset",
  		value: function reset() {

  			var fog = this.scene.fog;
  			var renderPass = new RenderPass(new three.Scene(), null);
  			renderPass.enabled = this.renderPass.enabled;
  			renderPass.renderToScreen = true;
  			this.renderPass = renderPass;
  			this.scene.fog = fog;

  			if (this.controls !== null) {

  				this.controls.dispose();
  				this.controls = null;
  			}

  			this.ready = false;

  			return this;
  		}
  	}, {
  		key: "scene",
  		get: function get$$1() {

  			return this.renderPass.scene;
  		},
  		set: function set$$1(scene) {

  			this.renderPass.scene = scene;
  		}
  	}, {
  		key: "camera",
  		get: function get$$1() {

  			return this.renderPass.camera;
  		},
  		set: function set$$1(camera) {

  			this.renderPass.camera = camera;
  		}
  	}]);
  	return Demo;
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

  var change = new Event("change");

  var load = new Event("load");

  var initialHash = window.location.hash.slice(1);

  var DemoManager = function (_EventTarget) {
  		inherits(DemoManager, _EventTarget);

  		function DemoManager(viewport) {
  				var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  				classCallCheck(this, DemoManager);


  				var aside = options.aside !== undefined ? options.aside : viewport;

  				var _this = possibleConstructorReturn(this, (DemoManager.__proto__ || Object.getPrototypeOf(DemoManager)).call(this));

  				_this.composer = options.composer !== undefined ? options.composer : function () {

  						var renderer = new three.WebGLRenderer();
  						renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  						renderer.setPixelRatio(window.devicePixelRatio);

  						return new EffectComposer(renderer);
  				}();

  				_this.renderer = _this.composer.renderer;

  				viewport.appendChild(_this.renderer.domElement);

  				_this.clock = new three.Clock();

  				_this.menu = new dat.GUI({ autoPlace: false });

  				aside.appendChild(_this.menu.domElement);

  				_this.statistics = new Stats();
  				_this.statistics.dom.id = "statistics";

  				aside.appendChild(_this.statistics.domElement);

  				_this.demos = new Map();

  				_this.demo = null;

  				_this.currentDemo = null;

  				return _this;
  		}

  		createClass(DemoManager, [{
  				key: "resetMenu",
  				value: function resetMenu() {
  						var _this2 = this;

  						var node = this.menu.domElement.parentNode;
  						var menu = new dat.GUI({ autoPlace: false });

  						if (this.demos.size > 1) {

  								var selection = menu.add(this, "demo", Array.from(this.demos.keys()));
  								selection.onChange(function () {
  										return _this2.loadDemo();
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

  								this.dispatchEvent(load);
  						}
  				}
  		}, {
  				key: "loadDemo",
  				value: function loadDemo() {
  						var _this3 = this;

  						var id = this.demo;
  						var demos = this.demos;
  						var demo = demos.get(id);
  						var previousDemo = this.currentDemo;

  						var composer = this.composer;
  						var renderer = this.renderer;

  						var size = void 0;

  						window.location.hash = id;

  						if (previousDemo !== null) {

  								previousDemo.reset();

  								size = composer.renderer.getSize();
  								renderer.setSize(size.width, size.height);
  								composer.replaceRenderer(renderer);
  						}

  						this.menu.domElement.style.display = "none";

  						renderer.clear();
  						composer.reset();
  						composer.addPass(demo.renderPass);

  						this.currentDemo = demo;
  						this.dispatchEvent(change);

  						demo.load().then(function () {
  								return _this3.startDemo(demo);
  						}).catch(function (e) {
  								return console.error(e);
  						});
  				}
  		}, {
  				key: "addDemo",
  				value: function addDemo(demo) {

  						var currentDemo = this.currentDemo;

  						this.demos.set(demo.id, demo.setComposer(this.composer));

  						if (this.demo === null || demo.id === initialHash) {

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

  						var firstEntry = void 0;

  						if (demos.has(id)) {

  								demos.delete(id);

  								if (this.demo === id && demos.size > 0) {
  										firstEntry = demos.entries().next().value;
  										this.demo = firstEntry[0];
  										this.currentDemo = firstEntry[1];
  										this.loadDemo();
  								} else {

  										this.demo = null;
  										this.currentDemo = null;
  										this.renderer.clear();
  										this.composer.reset();
  								}
  						}

  						return this;
  				}
  		}, {
  				key: "setSize",
  				value: function setSize(width, height) {

  						var demo = this.currentDemo;

  						this.composer.setSize(width, height);

  						if (demo !== null && demo.camera !== null) {

  								demo.camera.aspect = width / height;
  								demo.camera.updateProjectionMatrix();
  						}
  				}
  		}, {
  				key: "render",
  				value: function render(now) {

  						var demo = this.currentDemo;
  						var delta = this.clock.getDelta();

  						if (demo !== null && demo.ready) {

  								this.statistics.begin();

  								demo.update(delta);
  								this.composer.render(delta);

  								this.statistics.end();
  						}
  				}
  		}]);
  		return DemoManager;
  }(EventTarget);

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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$$1();


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
  	return Vector3$$1;
  }();

  var v$2 = new Vector3$1();

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
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return !this.isEmpty() ? target.addVectors(this.min, this.max).multiplyScalar(0.5) : target.set(0, 0, 0);
  		}
  	}, {
  		key: "getSize",
  		value: function getSize() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return !this.isEmpty() ? target.subVectors(this.max, this.min) : target.set(0, 0, 0);
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

  			var halfSize = v$2.copy(size).multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}
  	}, {
  		key: "clampPoint",
  		value: function clampPoint(point) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


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
  			var closestPoint = this.clampPoint(s.center, v$2);

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
  	return Box3$$1;
  }();

  var box = new Box3$1();

  var Sphere = function () {
  	function Sphere() {
  		var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
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
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Box3$1();


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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


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
  	return Vector2$$1;
  }();

  var v$1 = new Vector2$1();

  var Box2$1 = function () {
  	function Box2$$1() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2$1(Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector2$1(-Infinity, -Infinity);
  		classCallCheck(this, Box2$$1);


  		this.min = min;

  		this.max = max;
  	}

  	createClass(Box2$$1, [{
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
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2$1();


  			return !this.isEmpty() ? target.addVectors(this.min, this.max).multiplyScalar(0.5) : target.set(0, 0);
  		}
  	}, {
  		key: "getSize",
  		value: function getSize() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2$1();


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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector2$1();


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
  	return Box2$$1;
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

    XYZ: "XYZ",
    YZX: "YZX",
    ZXY: "ZXY",
    XZY: "XZY",
    YXZ: "YXZ",
    ZYX: "ZYX"

  };

  var v$3 = new Vector3$1();

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
  		value: function slerp(qa, qb) {
  			var qr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Quaternion();
  			var t = arguments[3];


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

  function clamp$1(value, min, max) {

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
  			this.order = z;

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
  			var vector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


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

  						this.y = Math.asin(clamp$1(m02, -1, 1));

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

  						this.x = Math.asin(-clamp$1(m12, -1, 1));

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

  						this.x = Math.asin(clamp$1(m21, -1, 1));

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

  						this.y = Math.asin(-clamp$1(m20, -1, 1));

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

  						this.z = Math.asin(clamp$1(m10, -1, 1));

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

  						this.z = Math.asin(-clamp$1(m01, -1, 1));

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

  var a = new Vector3$1();

  var b = new Vector3$1();

  var Plane = function () {
  	function Plane() {
  		var normal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1(1, 0, 0);
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

  var v0 = new Vector3$1();

  var v1 = new Vector3$1();

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

  var a$1 = new Vector3$1();

  var b$1 = new Vector3$1();

  var Line3 = function () {
  	function Line3() {
  		var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
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
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  		}
  	}, {
  		key: "delta",
  		value: function delta() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


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
  			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector3$1();


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

  var a$2 = new Vector3$1();

  var b$2 = new Vector3$1();

  var c = new Vector3$1();

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

  var v$4 = [new Vector3$1(), new Vector3$1(), new Vector3$1(), new Vector3$1()];

  var Ray = function () {
  	function Ray() {
  		var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


  			var ab = v$4[0].subVectors(s.center, this.origin);
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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


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
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


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

  var Spherical$1 = function () {
  	function Spherical$$1() {
  		var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  		var phi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var theta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Spherical$$1);


  		this.radius = radius;

  		this.phi = phi;

  		this.theta = theta;
  	}

  	createClass(Spherical$$1, [{
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
  	return Spherical$$1;
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

  var Vector4$1 = function () {
  	function Vector4$$1() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  		classCallCheck(this, Vector4$$1);


  		this.x = x;

  		this.y = y;

  		this.z = z;

  		this.w = w;
  	}

  	createClass(Vector4$$1, [{
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
  	return Vector4$$1;
  }();

  var PointerButton = {

    MAIN: 0,
    AUXILIARY: 1,
    SECONDARY: 2

  };

  var x = new Vector3$1(1, 0, 0);

  var y = new Vector3$1(0, 1, 0);

  var z = new Vector3$1(0, 0, 1);

  var TWO_PI = Math.PI * 2;

  var v$5 = new Vector3$1();

  var m$1 = new Matrix4();

  var RotationManager = function () {
  		function RotationManager(position, quaternion, target, settings) {
  				classCallCheck(this, RotationManager);


  				this.position = position;

  				this.quaternion = quaternion;

  				this.target = target;

  				this.settings = settings;

  				this.up = new Vector3$1();
  				this.up.copy(y);

  				this.spherical = new Spherical$1();

  				this.pivotOffset = new Vector3$1();
  		}

  		createClass(RotationManager, [{
  				key: "updateQuaternion",
  				value: function updateQuaternion() {

  						if (this.settings.general.orbit) {

  								m$1.lookAt(v$5.subVectors(this.position, this.target), this.pivotOffset, this.up);
  						} else {

  								m$1.lookAt(v$5.set(0, 0, 0), this.target.setFromSpherical(this.spherical), this.up);
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

  						s.theta = Math.min(Math.max(s.theta, rotation.minTheta), rotation.maxTheta);
  						s.phi = Math.min(Math.max(s.phi, rotation.minPhi), rotation.maxPhi);
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

  						var amount = void 0,
  						    min = void 0,
  						    max = void 0;

  						if (general.orbit && zoom.enabled) {

  								amount = sign * zoom.step * sensitivity.zoom;

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
  						var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


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
  				classCallCheck(this, MovementState);


  				this.left = false;

  				this.right = false;

  				this.forward = false;

  				this.backward = false;

  				this.up = false;

  				this.down = false;
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

  						return this;
  				}
  		}]);
  		return MovementState;
  }();

  var v$6 = new Vector3$1();

  var TranslationManager = function () {
  		function TranslationManager(position, quaternion, target, settings) {
  				classCallCheck(this, TranslationManager);


  				this.position = position;

  				this.quaternion = quaternion;

  				this.target = target;

  				this.settings = settings;

  				this.movementState = new MovementState();
  		}

  		createClass(TranslationManager, [{
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
  		classCallCheck(this, GeneralSettings);


  		this.orbit = true;
  	}

  	createClass(GeneralSettings, [{
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
  		classCallCheck(this, KeyBindings);


  		this.defaultActions = new Map();

  		this.actions = new Map();
  	}

  	createClass(KeyBindings, [{
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
  		value: function get$$1(keyCode) {

  			return this.actions.get(keyCode);
  		}
  	}, {
  		key: "set",
  		value: function set$$1(keyCode, action) {

  			this.actions.set(keyCode, action);

  			return this;
  		}
  	}, {
  		key: "delete",
  		value: function _delete(keyCode) {

  			return this.actions.delete(keyCode);
  		}
  	}, {
  		key: "toJSON",
  		value: function toJSON() {

  			return {
  				defaultActions: [].concat(toConsumableArray(this.defaultActions)),
  				actions: [].concat(toConsumableArray(this.actions))
  			};
  		}
  	}]);
  	return KeyBindings;
  }();

  var PointerSettings = function () {
  	function PointerSettings() {
  		classCallCheck(this, PointerSettings);


  		this.hold = false;

  		this.lock = true;
  	}

  	createClass(PointerSettings, [{
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
  				classCallCheck(this, RotationSettings);


  				this.minTheta = -Infinity;

  				this.maxTheta = Infinity;

  				this.minPhi = 0.0;

  				this.maxPhi = Math.PI;

  				this.invertX = false;

  				this.invertY = false;
  		}

  		createClass(RotationSettings, [{
  				key: "copy",
  				value: function copy(settings) {

  						this.minTheta = settings.minTheta !== null ? settings.minTheta : -Infinity;
  						this.maxTheta = settings.maxTheta !== null ? settings.maxTheta : Infinity;

  						this.minPhi = settings.minPhi;
  						this.maxPhi = settings.maxPhi;

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
  		classCallCheck(this, SensitivitySettings);


  		this.rotation = 0.0025;

  		this.translation = 1.0;

  		this.zoom = 0.01;
  	}

  	createClass(SensitivitySettings, [{
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
  		classCallCheck(this, TranslationSettings);


  		this.enabled = true;
  	}

  	createClass(TranslationSettings, [{
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
  				classCallCheck(this, ZoomSettings);


  				this.enabled = true;

  				this.invert = false;

  				this.minDistance = 1e-6;

  				this.maxDistance = Infinity;

  				this.step = 10.0;
  		}

  		createClass(ZoomSettings, [{
  				key: "copy",
  				value: function copy(settings) {

  						this.enabled = settings.enabled;
  						this.invert = settings.invert;
  						this.minDistance = settings.minDistance;
  						this.maxDistance = settings.maxDistance;
  						this.step = settings.step;

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
  				classCallCheck(this, Settings);


  				this.general = new GeneralSettings();

  				this.keyBindings = new KeyBindings();
  				this.keyBindings.setDefault(new Map([[KeyCode.W, Action.MOVE_FORWARD], [KeyCode.UP, Action.MOVE_FORWARD], [KeyCode.A, Action.MOVE_LEFT], [KeyCode.LEFT, Action.MOVE_LEFT], [KeyCode.S, Action.MOVE_BACKWARD], [KeyCode.DOWN, Action.MOVE_BACKWARD], [KeyCode.D, Action.MOVE_RIGHT], [KeyCode.RIGHT, Action.MOVE_RIGHT], [KeyCode.X, Action.MOVE_DOWN], [KeyCode.SPACE, Action.MOVE_UP], [KeyCode.PAGE_DOWN, Action.ZOOM_OUT], [KeyCode.PAGE_UP, Action.ZOOM_IN]]));

  				this.pointer = new PointerSettings();

  				this.rotation = new RotationSettings();

  				this.sensitivity = new SensitivitySettings();

  				this.translation = new TranslationSettings();

  				this.zoom = new ZoomSettings();
  		}

  		createClass(Settings, [{
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

  						return URL.createObjectURL(new Blob([JSON.stringify(this)], { type: "text/json" }));
  				}
  		}]);
  		return Settings;
  }();

  var Strategy = function () {
  	function Strategy() {
  		classCallCheck(this, Strategy);
  	}

  	createClass(Strategy, [{
  		key: "execute",
  		value: function execute(flag) {

  			throw new Error("Strategy#execute method not implemented!");
  		}
  	}]);
  	return Strategy;
  }();

  var MovementStrategy = function (_Strategy) {
  	inherits(MovementStrategy, _Strategy);

  	function MovementStrategy(movementState, direction) {
  		classCallCheck(this, MovementStrategy);

  		var _this = possibleConstructorReturn(this, (MovementStrategy.__proto__ || Object.getPrototypeOf(MovementStrategy)).call(this));

  		_this.movementState = movementState;

  		_this.direction = direction;

  		return _this;
  	}

  	createClass(MovementStrategy, [{
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
  		inherits(ZoomStrategy, _Strategy);

  		function ZoomStrategy(rotationManager, zoomIn) {
  				classCallCheck(this, ZoomStrategy);

  				var _this = possibleConstructorReturn(this, (ZoomStrategy.__proto__ || Object.getPrototypeOf(ZoomStrategy)).call(this));

  				_this.rotationManager = rotationManager;

  				_this.zoomIn = zoomIn;

  				return _this;
  		}

  		createClass(ZoomStrategy, [{
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
  		function DeltaControls(position, quaternion) {
  				var dom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
  				classCallCheck(this, DeltaControls);


  				this.dom = dom;

  				this.position = position;

  				this.quaternion = quaternion;

  				this.target = new Vector3$1();

  				this.settings = new Settings();

  				this.rotationManager = new RotationManager(position, quaternion, this.target, this.settings);

  				this.lookAt(this.target);

  				this.translationManager = new TranslationManager(position, quaternion, this.target, this.settings);

  				this.strategies = function (rotationManager, translationManager) {

  						var state = translationManager.movementState;

  						return new Map([[Action.MOVE_FORWARD, new MovementStrategy(state, Direction.FORWARD)], [Action.MOVE_LEFT, new MovementStrategy(state, Direction.LEFT)], [Action.MOVE_BACKWARD, new MovementStrategy(state, Direction.BACKWARD)], [Action.MOVE_RIGHT, new MovementStrategy(state, Direction.RIGHT)], [Action.MOVE_DOWN, new MovementStrategy(state, Direction.DOWN)], [Action.MOVE_UP, new MovementStrategy(state, Direction.UP)], [Action.ZOOM_OUT, new ZoomStrategy(rotationManager, false)], [Action.ZOOM_IN, new ZoomStrategy(rotationManager, true)]]);
  				}(this.rotationManager, this.translationManager);

  				this.lastScreenPosition = new Vector2$1();

  				this.dragging = false;

  				this.enabled = false;

  				if (dom !== null) {

  						this.setEnabled();
  				}
  		}

  		createClass(DeltaControls, [{
  				key: "handlePointerMoveEvent",
  				value: function handlePointerMoveEvent(event) {

  						var settings = this.settings;
  						var pointer = settings.pointer;
  						var sensitivity = settings.sensitivity;
  						var rotationManager = this.rotationManager;
  						var lastScreenPosition = this.lastScreenPosition;

  						var movementX = void 0,
  						    movementY = void 0;

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
  				key: "getViewDirection",
  				value: function getViewDirection() {
  						var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  						return this.rotationManager.getViewDirection(view);
  				}
  		}, {
  				key: "getTarget",
  				value: function getTarget() {
  						var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  						target.copy(this.target);

  						if (!this.settings.general.orbit) {
  								target.add(this.position);
  						}

  						return target;
  				}
  		}, {
  				key: "setTarget",
  				value: function setTarget(target) {

  						this.target = target;
  						this.rotationManager.target = target;
  						this.translationManager.target = target;

  						return this.lookAt(this.target);
  				}
  		}, {
  				key: "setPosition",
  				value: function setPosition(position) {

  						this.position = position;
  						this.rotationManager.position = position;
  						this.translationManager.position = position;

  						return this.lookAt(this.target);
  				}
  		}, {
  				key: "setQuaternion",
  				value: function setQuaternion(quaternion) {

  						this.quaternion = quaternion;
  						this.rotationManager.quaternion = quaternion;
  						this.translationManager.quaternion = quaternion;

  						return this.lookAt(this.target);
  				}
  		}, {
  				key: "setOrbit",
  				value: function setOrbit(orbit) {

  						var general = this.settings.general;

  						if (general.orbit !== orbit) {

  								this.getTarget(this.target);
  								general.orbit = orbit;
  								this.lookAt(this.target);
  						}

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
  				}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						this.setEnabled(false);
  				}
  		}, {
  				key: "pivotOffset",
  				get: function get$$1() {

  						return this.rotationManager.pivotOffset;
  				}
  		}]);
  		return DeltaControls;
  }();

  var air = 0;

  var HermiteDataHelper = function (_Group) {
  		inherits(HermiteDataHelper, _Group);

  		function HermiteDataHelper() {
  				var cellPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				var cellSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  				var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  				var useMaterialIndices = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  				var useEdgeData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  				classCallCheck(this, HermiteDataHelper);

  				var _this = possibleConstructorReturn(this, (HermiteDataHelper.__proto__ || Object.getPrototypeOf(HermiteDataHelper)).call(this));

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

  		createClass(HermiteDataHelper, [{
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
  				value: function set$$1(cellPosition, cellSize, data) {

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

  												if (materialIndices[i++] !== air) {

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
  		}], [{
  				key: "air",
  				set: function set$$1(value) {

  						air = value;
  				}
  		}]);
  		return HermiteDataHelper;
  }(three.Group);

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
  		key: "setOperationType",
  		value: function setOperationType(operation) {

  			this.operation = operation;

  			return this;
  		}
  	}, {
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

  		_this.min = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.min))))();

  		_this.max = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.max))))();

  		return _this;
  	}

  	createClass(FractalNoise, [{
  		key: "computeBoundingBox",
  		value: function computeBoundingBox() {

  			this.bbox = new Box3$1(this.min, this.max);

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

  				_this.min = new Vector3$1(0, 0, 0);

  				if (parameters.min !== undefined) {

  						_this.min.fromArray(parameters.min);
  				}

  				_this.size = new Vector3$1(1, 1, 1);

  				if (parameters.size !== undefined) {

  						_this.size.fromArray(parameters.size);
  				}

  				_this.scale = new Vector3$1(1, 1, 1);

  				if (parameters.scale !== undefined) {

  						_this.scale.fromArray(parameters.scale);
  				}

  				_this.dimensions = new Vector3$1();
  				_this.dimensions.multiplyVectors(_this.size, _this.scale);

  				_this.data = parameters.data;

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

  								for (i = 0, j = 0, l = data.length; i < l; ++i, j += 4) {

  										result[i] = data[j];
  								}

  								this.heightmap = image;
  								this.size.set(imageData.width, 1.0, imageData.height);
  								this.dimensions.multiplyVectors(this.size, this.scale);
  								this.data = result;
  						}

  						return this;
  				}
  		}, {
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

  						var scale = this.scale;
  						var x = position.x / scale.x;
  						var z = position.z / scale.z;
  						var h = this.min.y + this.data[z * this.size.x + x] / 255 * this.dimensions.y;

  						return position.y - h;
  				}
  		}, {
  				key: "serialize",
  				value: function serialize() {
  						var deflate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


  						var result = get(Heightfield.prototype.__proto__ || Object.getPrototypeOf(Heightfield.prototype), "serialize", this).call(this);

  						result.parameters = {
  								min: this.min.toArray(),
  								scale: this.scale.toArray(),
  								size: this.size.toArray(),
  								data: deflate ? null : this.data,
  								dataUrl: deflate && this.heightmap !== null ? this.heightmap.toDataUrl() : null,
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

  				_this.origin = new Vector3$1();

  				if (parameters.origin !== undefined) {

  						_this.origin.fromArray(parameters.origin);
  				}

  				_this.scale = parameters.scale !== undefined ? parameters.scale : 1.0;

  				_this.s0 = new (Function.prototype.bind.apply(Vector4$1, [null].concat(toConsumableArray(parameters.s))))();

  				_this.r0 = new (Function.prototype.bind.apply(Vector3$1, [null].concat(toConsumableArray(parameters.r))))();

  				_this.s = _this.s0.clone().multiplyScalar(_this.scale);

  				_this.r = _this.r0.clone().multiplyScalar(_this.scale);

  				_this.ba = new Vector2$1();

  				_this.offset = 0;

  				_this.precompute();

  				return _this;
  		}

  		createClass(SuperPrimitive, [{
  				key: "setScale",
  				value: function setScale(s) {

  						this.scale = s;
  						this.s.copy(this.s0).multiplyScalar(s);
  						this.r.copy(this.r0).multiplyScalar(s);
  						this.computeBoundingBox();
  						this.precompute();
  				}
  		}, {
  				key: "setGenus",
  				value: function setGenus(w) {

  						this.s0.w = w;
  						this.s.copy(this.s0).multiplyScalar(this.scale);
  						this.r.copy(this.r0).multiplyScalar(this.scale);
  						this.precompute();
  				}
  		}, {
  				key: "computeBoundingBox",
  				value: function computeBoundingBox() {

  						var s = this.scale * 2.0;
  						var o = this.origin;

  						this.bbox = new Box3$1();
  						this.bbox.min.set(o.x - s, o.y - s, o.z - s);
  						this.bbox.max.set(o.x + s, o.y + s, o.z + s);

  						return this.bbox;
  				}
  		}, {
  				key: "precompute",
  				value: function precompute() {

  						var s = this.s;
  						var r = this.r;
  						var ba = this.ba;

  						var divisor = void 0;

  						s.x -= r.x;
  						s.y -= r.x;

  						r.x -= s.w;
  						s.w -= r.y;

  						s.z -= r.y;

  						this.offset = -2.0 * s.z;

  						ba.set(r.z, this.offset);
  						divisor = ba.dot(ba);

  						if (divisor === 0.0) {
  								ba.set(0.0, -1.0);
  						} else {

  								ba.divideScalar(divisor);
  						}
  				}
  		}, {
  				key: "sample",
  				value: function sample(position) {

  						var o = this.origin;
  						var s = this.s;
  						var r = this.r;
  						var ba = this.ba;

  						var px = position.x - o.x;
  						var py = position.y - o.y;
  						var pz = position.z - o.z;

  						var dx = Math.abs(px) - s.x;
  						var dy = Math.abs(py) - s.y;
  						var dz = Math.abs(pz) - s.z;

  						var mx0 = Math.max(dx, 0.0);
  						var my0 = Math.max(dy, 0.0);
  						var l0 = Math.sqrt(mx0 * mx0 + my0 * my0);

  						var p = pz - s.z;
  						var q = Math.abs(l0 + Math.min(0.0, Math.max(dx, dy)) - r.x) - s.w;

  						var c = Math.min(Math.max(q * ba.x + p * ba.y, 0.0), 1.0);
  						var diagX = q - r.z * c;
  						var diagY = p - this.offset * c;

  						var hx0 = Math.max(q - r.z, 0.0);
  						var hy0 = pz + s.z;
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
  								origin: this.origin.toArray(),
  								scale: this.scale,
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

  var load$1 = new SDFLoaderEvent("load");

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
  								load$1.descriptions = this.descriptions;
  								this.dispatchEvent(load$1);
  						}
  				}
  		}, {
  				key: "loadImage",
  				value: function loadImage(description) {

  						var image = new Image();

  						this.imageMap.set(image, description);
  						++this.items;

  						image.addEventListener("load", this);
  						image.src = description.dataUrl;
  				}
  		}, {
  				key: "inflate",
  				value: function inflate(description) {

  						var child = void 0;

  						if (description.dataUrl !== null) {
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
  				value: function load(descriptions) {

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

  var c$2 = new Vector3$1();

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


  			return target.addVectors(this.min, this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.subVectors(this.max, this.min);
  		}
  	}, {
  		key: "split",
  		value: function split() {

  			var min = this.min;
  			var max = this.max;
  			var mid = this.getCenter(c$2);

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

  var edges$1 = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  var c$1 = new Vector3$1();

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
  			var mid = this.getCenter(c$1);
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

  var b$4 = new Box3$1();

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

  								b$4.min = root.min;
  								b$4.max = root.max;

  								if (!this.cull || this.region.intersectsBox(b$4)) {

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

  														b$4.min = child.min;
  														b$4.max = child.max;

  														if (!region.intersectsBox(b$4)) {
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

  var v$7 = [new Vector3$1(), new Vector3$1(), new Vector3$1()];

  var b$5 = new Box3$1();

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
  			var min = b$5.min.set(0, 0, 0);
  			var max = b$5.max.subVectors(octree.max, octree.min);

  			var dimensions = octree.getDimensions(v$7[0]);
  			var halfDimensions = v$7[1].copy(dimensions).multiplyScalar(0.5);

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

  			origin.sub(octree.getCenter(v$7[2])).add(halfDimensions);

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

  var b$3 = new Box3$1();

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

  	b$3.min = octant.min;
  	b$3.max = octant.max;

  	if (region.intersectsBox(b$3)) {

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

  var b$6 = new Box3$1();

  var c$3 = new Vector3$1();

  var u = new Vector3$1();

  var v$8 = new Vector3$1();

  var OctreeUtils = function () {
  	function OctreeUtils() {
  		classCallCheck(this, OctreeUtils);
  	}

  	createClass(OctreeUtils, null, [{
  		key: "recycleOctants",
  		value: function recycleOctants(octant, octants) {

  			var min = octant.min;
  			var mid = octant.getCenter(u);
  			var halfDimensions = octant.getDimensions(v$8).multiplyScalar(0.5);

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

  var ab$1 = new Vector3$1();

  var p$1 = new Vector3$1();

  var v$9 = new Vector3$1();

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

  						ab$1.subVectors(this.b, this.a);

  						while (i <= s) {

  								c = (a + b) / 2;

  								p$1.addVectors(this.a, v$9.copy(ab$1).multiplyScalar(c));
  								densityC = sdf.sample(p$1);

  								if (Math.abs(densityC) <= ISOVALUE_BIAS || (b - a) / 2 <= INTERVAL_THRESHOLD) {
  										break;
  								} else {

  										p$1.addVectors(this.a, v$9.copy(ab$1).multiplyScalar(a));
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

  						var position = this.computeZeroCrossingPosition(ab$1);
  						var E = 1e-3;

  						var dx = sdf.sample(p$1.addVectors(position, v$9.set(E, 0, 0))) - sdf.sample(p$1.subVectors(position, v$9.set(E, 0, 0)));
  						var dy = sdf.sample(p$1.addVectors(position, v$9.set(0, E, 0))) - sdf.sample(p$1.subVectors(position, v$9.set(0, E, 0)));
  						var dz = sdf.sample(p$1.addVectors(position, v$9.set(0, 0, E))) - sdf.sample(p$1.subVectors(position, v$9.set(0, 0, E)));

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

  function ceil2(n) {

  	return Math.pow(2, Math.max(0, Math.ceil(Math.log2(n))));
  }

  var HermiteData = function () {
  	function HermiteData() {
  		var initialise = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  		classCallCheck(this, HermiteData);


  		this.materials = 0;

  		this.materialIndices = initialise ? new Uint8Array(indexCount) : null;

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

  				this.keyBase = new Vector3$1();

  				this.key = new Vector3$1();

  				this.limit = new Vector3$1();

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

  						this.halfRange = new Vector3$1(this.rangeX / 2, this.rangeY / 2, this.rangeZ / 2);

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

  var WorldOctantWrapper = function () {
  	function WorldOctantWrapper() {
  		var octant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		classCallCheck(this, WorldOctantWrapper);


  		this.octant = octant;

  		this.min = new Vector3$1();

  		this.max = new Vector3$1();
  	}

  	createClass(WorldOctantWrapper, [{
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.addVectors(this.min, this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


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

  				this.lod = lod;

  				this.cellSize = 0;

  				this.iterator = null;

  				this.octantWrapper = new WorldOctantWrapper();

  				this.result = new IteratorResult();

  				this.reset();
  		}

  		createClass(WorldOctantIterator, [{
  				key: "reset",
  				value: function reset() {

  						var lod = this.lod;
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
  								octantWrapper.min.multiplyScalar(this.cellSize);
  								octantWrapper.min.add(this.world.min);
  								octantWrapper.max.copy(octantWrapper.min).addScalar(this.cellSize);
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

  		this.mesh = null;
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

  var p$2 = new Vector3$1();

  var v$11 = new Vector3$1();

  var b0$1 = new Box3$1();

  var b1$1 = new Box3$1();

  var b2 = new Box3$1();

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

  			var a = b1$1.min;
  			var b = b1$1.max;
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

  							keyDesign.unpackKey(key, v$11);
  							v$11.x <<= 1;v$11.y <<= 1;v$11.z <<= 1;

  							for (i = 0; i < 8; ++i) {

  								offset = pattern[i];

  								p$2.set(v$11.x + offset[0], v$11.y + offset[1], v$11.z + offset[2]);

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

  			var a = world.calculateKeyCoordinates(region.min, lod, b1$1.min);
  			var b = world.calculateKeyCoordinates(region.max, lod, b1$1.max);

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
  					ranges.push(new Box3$1(world.calculateKeyCoordinates(region.min, i), world.calculateKeyCoordinates(region.max, i)));
  				}
  			}

  			var _iteratorNormalCompletion3 = true;
  			var _didIteratorError3 = false;
  			var _iteratorError3 = undefined;

  			try {
  				for (var _iterator3 = keyDesign.keyRange(a, b)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
  					key = _step3.value;


  					if (grid.has(key)) {

  						keyDesign.unpackKey(key, v$11);

  						_applyDifference(world, sdf, grid.get(key), v$11.x, v$11.y, v$11.z, lod);
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
  			var region = b0$1.copy(sdf.completeBoundingBox);

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

  var v$12 = new Vector3$1();

  var l = new Line3();

  var b$7 = new Box3$1();

  var d = new Box3$1();

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

  	var grid = void 0,
  	    keyDesign = void 0;
  	var children = void 0,
  	    offset = void 0;

  	var currentOctant = void 0;
  	var txm = void 0,
  	    tym = void 0,
  	    tzm = void 0;

  	var i = void 0;

  	if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

  		if (lod === 0 || octant.mesh !== null) {

  			intersects.push(octant);
  		} else if (octant.children > 0) {
  			grid = world.getGrid(--lod);
  			keyDesign = world.getKeyDesign();
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
  								v$12.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$12)), v$12.x, v$12.y, v$12.z, lod, tx0, ty0, tz0, txm, tym, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, tym, tzm);
  							break;
  						}

  					case 1:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$12.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$12)), v$12.x, v$12.y, v$12.z, lod, tx0, ty0, tzm, txm, tym, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, tym, tz1);
  							break;
  						}

  					case 2:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$12.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$12)), v$12.x, v$12.y, v$12.z, lod, tx0, tym, tz0, txm, ty1, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, ty1, tzm);
  							break;
  						}

  					case 3:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$12.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$12)), v$12.x, v$12.y, v$12.z, lod, tx0, tym, tzm, txm, ty1, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, txm, ty1, tz1);
  							break;
  						}

  					case 4:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$12.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$12)), v$12.x, v$12.y, v$12.z, lod, txm, ty0, tz0, tx1, tym, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, tym, tzm);
  							break;
  						}

  					case 5:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$12.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$12)), v$12.x, v$12.y, v$12.z, lod, txm, ty0, tzm, tx1, tym, tz1, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, tym, tz1);
  							break;
  						}

  					case 6:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$12.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$12)), v$12.x, v$12.y, v$12.z, lod, txm, tym, tz0, tx1, ty1, tzm, intersects);
  							}

  							currentOctant = findNextOctant$1(currentOctant, tx1, ty1, tzm);
  							break;
  						}

  					case 7:
  						{

  							if ((children & 1 << i) !== 0) {

  								offset = pattern[i];
  								v$12.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
  								raycastOctant$1(world, grid.get(keyDesign.packKey(v$12)), v$12.x, v$12.y, v$12.z, lod, txm, tym, tzm, tx1, ty1, tz1, intersects);
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

  	origin.sub(subtree.getCenter(v$12)).add(halfDimensions);

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

  			if (a !== null) {
  				t = cellSize << 1;
  				b = r$1.at(t, v$12);

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

  						if (octant.mesh === null) {
  							octantWrapper.octant = octant;
  							octantWrapper.min.copy(keyCoordinates0);
  							octantWrapper.min.multiplyScalar(cellSize);
  							octantWrapper.min.add(world.min);
  							octantWrapper.max.copy(octantWrapper.min).addScalar(cellSize);

  							intersectSubtree(world, octantWrapper, keyCoordinates0, ray, intersects);
  						} else {
  							intersects.push(octant);
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

  var v$10 = new Vector3$1();

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

  				v$10.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);

  				key = keyDesign.packKey(v$10);

  				child = grid.get(key);
  				grid.delete(key);

  				removeChildren(world, child, v$10.x, v$10.y, v$10.z, lod);
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

  		v$10.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);

  		key = world.getKeyDesign().packKey(v$10);
  		parent = grid.get(key);

  		parent.children &= ~(1 << i);

  		if (parent.children === 0) {
  			grid.delete(key);
  			prune(world, v$10.x, v$10.y, v$10.z, lod);
  		}
  	}
  }

  var WorldOctree = function () {
  	function WorldOctree() {
  		var cellSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
  		var levels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  		var keyDesign = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new KeyDesign();
  		classCallCheck(this, WorldOctree);


  		this.cellSize = cellSize;

  		this.keyDesign = keyDesign;

  		this.grids = [];

  		levels = Math.max(levels, 1);

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


  			return this.cellSize << lod;
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
  			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector3$1();


  			var cellSize = this.cellSize << lod;

  			v$10.subVectors(position, this.min);

  			target.set(Math.trunc(v$10.x / cellSize), Math.trunc(v$10.y / cellSize), Math.trunc(v$10.z / cellSize));

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

  					this.calculateKeyCoordinates(point, lod, v$10);
  					result = grid.get(keyDesign.packKey(v$10));
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
  					keyDesign.unpackKey(key, v$10);
  					keyX = v$10.x;keyY = v$10.y;keyZ = v$10.z;

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

  var Scene$1 = function () {
  	function Scene$$1(levels) {
  		classCallCheck(this, Scene$$1);
  	}

  	createClass(Scene$$1, [{
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
  	return Scene$$1;
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

  var b$8 = new Box3$1();

  var f = new Frustum();

  var m$2 = new Matrix4();

  var Clipmap = function (_EventTarget) {
  	inherits(Clipmap, _EventTarget);

  	function Clipmap(world) {
  		classCallCheck(this, Clipmap);

  		var _this = possibleConstructorReturn(this, (Clipmap.__proto__ || Object.getPrototypeOf(Clipmap)).call(this));

  		_this.world = world;

  		_this.position = new Vector3$1(Infinity, Infinity, Infinity);

  		_this.currentScene = new Scene$1(_this.world.levels);

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

  var Action$1 = {

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
  		return possibleConstructorReturn(this, (ExtractionRequest.__proto__ || Object.getPrototypeOf(ExtractionRequest)).call(this, Action$1.EXTRACT));
  	}

  	return ExtractionRequest;
  }(DataMessage);

  var ModificationRequest = function (_DataMessage) {
  		inherits(ModificationRequest, _DataMessage);

  		function ModificationRequest() {
  				classCallCheck(this, ModificationRequest);

  				var _this = possibleConstructorReturn(this, (ModificationRequest.__proto__ || Object.getPrototypeOf(ModificationRequest)).call(this, Action$1.MODIFY));

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

  				var _this = possibleConstructorReturn(this, (ConfigurationMessage.__proto__ || Object.getPrototypeOf(ConfigurationMessage)).call(this, Action$1.CONFIGURE));

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

  		var _this = possibleConstructorReturn(this, (ExtractionResponse.__proto__ || Object.getPrototypeOf(ExtractionResponse)).call(this, Action$1.EXTRACT));

  		_this.isosurface = null;

  		return _this;
  	}

  	return ExtractionResponse;
  }(DataMessage);

  var ModificationResponse = function (_DataMessage) {
  	inherits(ModificationResponse, _DataMessage);

  	function ModificationResponse() {
  		classCallCheck(this, ModificationResponse);

  		var _this = possibleConstructorReturn(this, (ModificationResponse.__proto__ || Object.getPrototypeOf(ModificationResponse)).call(this, Action$1.MODIFY));

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

  var worker = "!function(){\"use strict\";var t=function(t,i){if(!(t instanceof i))throw new TypeError(\"Cannot call a class as a function\")},i=function(){function t(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(i,e,n){return e&&t(i.prototype,e),n&&t(i,n),i}}(),e=function t(i,e,n){null===i&&(i=Function.prototype);var s=Object.getOwnPropertyDescriptor(i,e);if(void 0===s){var r=Object.getPrototypeOf(i);return null===r?void 0:t(r,e,n)}if(\"value\"in s)return s.value;var a=s.get;if(void 0!==a)return a.call(n)},n=function(t,i){if(\"function\"!=typeof i&&null!==i)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof i);t.prototype=Object.create(i&&i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),i&&(Object.setPrototypeOf?Object.setPrototypeOf(t,i):t.__proto__=i)},s=function(t,i){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!i||\"object\"!=typeof i&&\"function\"!=typeof i?t:i},r=function(t){if(Array.isArray(t)){for(var i=0,e=Array(t.length);i<t.length;i++)e[i]=t[i];return e}return Array.from(t)},a=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;t(this,e),this.runLengths=i,this.data=n}return i(e,null,[{key:\"encode\",value:function(t){var i=[],n=[],s=t[0],r=1,a=void 0,o=void 0;for(a=1,o=t.length;a<o;++a)s!==t[a]?(i.push(r),n.push(s),s=t[a],r=1):++r;return i.push(r),n.push(s),new e(i,n)}},{key:\"decode\",value:function(t,i){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=void 0,s=void 0,r=void 0,a=void 0,o=void 0,h=0;for(s=0,a=i.length;s<a;++s)for(n=i[s],r=0,o=t[s];r<o;++r)e[h++]=n;return e}}]),e}(),o=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;t(this,e),this.x=i,this.y=n,this.z=s}return i(e,[{key:\"set\",value:function(t,i,e){return this.x=t,this.y=i,this.z=e,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}},{key:\"setFromSpherical\",value:function(t){var i=Math.sin(t.phi)*t.radius;return this.x=i*Math.sin(t.theta),this.y=Math.cos(t.phi)*t.radius,this.z=i*Math.cos(t.theta),this}},{key:\"setFromCylindrical\",value:function(t){return this.x=t.radius*Math.sin(t.theta),this.y=t.y,this.z=t.radius*Math.cos(t.theta),this}},{key:\"setFromMatrixColumn\",value:function(t,i){return this.fromArray(t.elements,4*i)}},{key:\"setFromMatrixPosition\",value:function(t){var i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}},{key:\"setFromMatrixScale\",value:function(t){var i=this.setFromMatrixColumn(t,0).length(),e=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=e,this.z=n,this}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this.z+=t,this}},{key:\"addVectors\",value:function(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}},{key:\"addScaledVector\",value:function(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this.z-=t,this}},{key:\"subVectors\",value:function(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}},{key:\"multiplyScalar\",value:function(t){return this.x*=t,this.y*=t,this.z*=t,this}},{key:\"multiplyVectors\",value:function(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}},{key:\"divideScalar\",value:function(t){return this.x/=t,this.y/=t,this.z/=t,this}},{key:\"crossVectors\",value:function(t,i){var e=t.x,n=t.y,s=t.z,r=i.x,a=i.y,o=i.z;return this.x=n*o-s*a,this.y=s*r-e*o,this.z=e*a-n*r,this}},{key:\"cross\",value:function(t){return this.crossVectors(this,t)}},{key:\"transformDirection\",value:function(t){var i=this.x,e=this.y,n=this.z,s=t.elements;return this.x=s[0]*i+s[4]*e+s[8]*n,this.y=s[1]*i+s[5]*e+s[9]*n,this.z=s[2]*i+s[6]*e+s[10]*n,this.normalize()}},{key:\"applyMatrix3\",value:function(t){var i=this.x,e=this.y,n=this.z,s=t.elements;return this.x=s[0]*i+s[3]*e+s[6]*n,this.y=s[1]*i+s[4]*e+s[7]*n,this.z=s[2]*i+s[5]*e+s[8]*n,this}},{key:\"applyMatrix4\",value:function(t){var i=this.x,e=this.y,n=this.z,s=t.elements;return this.x=s[0]*i+s[4]*e+s[8]*n+s[12],this.y=s[1]*i+s[5]*e+s[9]*n+s[13],this.z=s[2]*i+s[6]*e+s[10]*n+s[14],this}},{key:\"applyQuaternion\",value:function(t){var i=this.x,e=this.y,n=this.z,s=t.x,r=t.y,a=t.z,o=t.w,h=o*i+r*n-a*e,u=o*e+a*i-s*n,l=o*n+s*e-r*i,c=-s*i-r*e-a*n;return this.x=h*o+c*-s+u*-a-l*-r,this.y=u*o+c*-r+l*-s-h*-a,this.z=l*o+c*-a+h*-r-u*-s,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z}},{key:\"reflect\",value:function(t){arguments.length>1&&void 0!==arguments[1]?arguments[1]:new e;var i=t.x,n=t.y,s=t.z;return this.sub(t.multiplyScalar(2*this.dot(t))),t.set(i,n,s),this}},{key:\"angleTo\",value:function(t){var i=this.dot(t)/Math.sqrt(this.lengthSquared()*t.lengthSquared());return Math.acos(Math.min(Math.max(i,-1),1))}},{key:\"manhattanLength\",value:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}},{key:\"manhattanDistanceTo\",value:function(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}},{key:\"distanceToSquared\",value:function(t){var i=this.x-t.x,e=this.y-t.y,n=this.z-t.z;return i*i+e*e+n*n}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(t){return this.normalize().multiplyScalar(t)}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}},{key:\"clamp\",value:function(t,i){return this.x=Math.max(t.x,Math.min(i.x,this.x)),this.y=Math.max(t.y,Math.min(i.y,this.y)),this.z=Math.max(t.z,Math.min(i.z,this.z)),this}},{key:\"floor\",value:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}},{key:\"ceil\",value:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}},{key:\"round\",value:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}},{key:\"lerp\",value:function(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}},{key:\"lerpVectors\",value:function(t,i,e){return this.subVectors(i,t).multiplyScalar(e).add(t)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}}]),e}(),h=new o,u=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o(1/0,1/0,1/0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o(-1/0,-1/0,-1/0);t(this,e),this.min=i,this.max=n}return i(e,[{key:\"set\",value:function(t,i){return this.min.copy(t),this.max.copy(i),this}},{key:\"copy\",value:function(t){return this.min.copy(t.min),this.max.copy(t.max),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}},{key:\"getCenter\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o;return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o;return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}},{key:\"getBoundingSphere\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new c;return this.getCenter(t.center),t.radius=.5*this.getSize(h).length(),t}},{key:\"expandByPoint\",value:function(t){return this.min.min(t),this.max.max(t),this}},{key:\"expandByVector\",value:function(t){return this.min.sub(t),this.max.add(t),this}},{key:\"expandByScalar\",value:function(t){return this.min.addScalar(-t),this.max.addScalar(t),this}},{key:\"setFromPoints\",value:function(t){var i=void 0,e=void 0;for(this.min.set(0,0,0),this.max.set(0,0,0),i=0,e=t.length;i<e;++i)this.expandByPoint(t[i]);return this}},{key:\"setFromCenterAndSize\",value:function(t,i){var e=h.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(e),this.max.copy(t).add(e),this}},{key:\"clampPoint\",value:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o).copy(t).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(t){return h.copy(t).clamp(this.min,this.max).sub(t).length()}},{key:\"translate\",value:function(t){return this.min.add(t),this.max.add(t),this}},{key:\"intersect\",value:function(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(t){return this.min.min(t.min),this.max.max(t.max),this}},{key:\"containsPoint\",value:function(t){var i=this.min,e=this.max;return t.x>=i.x&&t.y>=i.y&&t.z>=i.z&&t.x<=e.x&&t.y<=e.y&&t.z<=e.z}},{key:\"containsBox\",value:function(t){var i=this.min,e=this.max,n=t.min,s=t.max;return i.x<=n.x&&s.x<=e.x&&i.y<=n.y&&s.y<=e.y&&i.z<=n.z&&s.z<=e.z}},{key:\"intersectsBox\",value:function(t){var i=this.min,e=this.max,n=t.min,s=t.max;return s.x>=i.x&&s.y>=i.y&&s.z>=i.z&&n.x<=e.x&&n.y<=e.y&&n.z<=e.z}},{key:\"intersectsSphere\",value:function(t){return this.clampPoint(t.center,h).distanceToSquared(t.center)<=t.radius*t.radius}},{key:\"intersectsPlane\",value:function(t){var i=void 0,e=void 0;return t.normal.x>0?(i=t.normal.x*this.min.x,e=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,e=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,e+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,e+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,e+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,e+=t.normal.z*this.min.z),i<=t.constant&&e>=t.constant}},{key:\"equals\",value:function(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}]),e}(),l=new u,c=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t(this,e),this.center=i,this.radius=n}return i(e,[{key:\"set\",value:function(t,i){return this.center.copy(t),this.radius=i,this}},{key:\"copy\",value:function(t){return this.center.copy(t.center),this.radius=t.radius,this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"setFromPoints\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:l.setFromPoints(t).getCenter(this.center),e=0,n=void 0,s=void 0;for(n=0,s=t.length;n<s;++n)e=Math.max(e,i.distanceToSquared(t[n]));return this.radius=Math.sqrt(e),this}},{key:\"getBoundingBox\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new u;return t.set(this.center,this.center),t.expandByScalar(this.radius),t}},{key:\"isEmpty\",value:function(){return this.radius<=0}},{key:\"translate\",value:function(t){return this.center.add(t),this}},{key:\"clampPoint\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=this.center.distanceToSquared(t);return i.copy(t),e>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}},{key:\"distanceToPoint\",value:function(t){return t.distanceTo(this.center)-this.radius}},{key:\"containsPoint\",value:function(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}},{key:\"intersectsSphere\",value:function(t){var i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}},{key:\"intersectsBox\",value:function(t){return t.intersectsSphere(this)}},{key:\"intersectsPlane\",value:function(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}},{key:\"equals\",value:function(t){return t.center.equals(this.center)&&t.radius===this.radius}}]),e}(),y=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t(this,e),this.x=i,this.y=n}return i(e,[{key:\"set\",value:function(t,i){return this.x=t,this.y=i,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this}},{key:\"addVectors\",value:function(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}},{key:\"addScaledVector\",value:function(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this}},{key:\"subVectors\",value:function(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this}},{key:\"multiplyScalar\",value:function(t){return this.x*=t,this.y*=t,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this}},{key:\"divideScalar\",value:function(t){return this.x/=t,this.y/=t,this}},{key:\"applyMatrix3\",value:function(t){var i=this.x,e=this.y,n=t.elements;return this.x=n[0]*i+n[3]*e+n[6],this.y=n[1]*i+n[4]*e+n[7],this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y}},{key:\"manhattanLength\",value:function(){return Math.abs(this.x)+Math.abs(this.y)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y)}},{key:\"manhattanDistanceTo\",value:function(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}},{key:\"distanceToSquared\",value:function(t){var i=this.x-t.x,e=this.y-t.y;return i*i+e*e}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(t){return this.normalize().multiplyScalar(t)}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}},{key:\"clamp\",value:function(t,i){return this.x=Math.max(t.x,Math.min(i.x,this.x)),this.y=Math.max(t.y,Math.min(i.y,this.y)),this}},{key:\"floor\",value:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}},{key:\"ceil\",value:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}},{key:\"round\",value:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this}},{key:\"angle\",value:function(){var t=Math.atan2(this.y,this.x);return t<0&&(t+=2*Math.PI),t}},{key:\"lerp\",value:function(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}},{key:\"lerpVectors\",value:function(t,i,e){return this.subVectors(i,t).multiplyScalar(e).add(t)}},{key:\"rotateAround\",value:function(t,i){var e=Math.cos(i),n=Math.sin(i),s=this.x-t.x,r=this.y-t.y;return this.x=s*e-r*n+t.x,this.y=s*n+r*e+t.y,this}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y}},{key:\"width\",get:function(){return this.x},set:function(t){return this.x=t}},{key:\"height\",get:function(){return this.y},set:function(t){return this.y=t}}]),e}(),v=new y,d=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new y(1/0,1/0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new y(-1/0,-1/0);t(this,e),this.min=i,this.max=n}i(e,[{key:\"set\",value:function(t,i){return this.min.copy(t),this.max.copy(i),this}},{key:\"copy\",value:function(t){return this.min.copy(t.min),this.max.copy(t.max),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"makeEmpty\",value:function(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}},{key:\"isEmpty\",value:function(){return this.max.x<this.min.x||this.max.y<this.min.y}},{key:\"getCenter\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new y;return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getSize\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new y;return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}},{key:\"getBoundingSphere\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new c;return this.getCenter(t.center),t.radius=.5*this.getSize(v).length(),t}},{key:\"expandByPoint\",value:function(t){return this.min.min(t),this.max.max(t),this}},{key:\"expandByVector\",value:function(t){return this.min.sub(t),this.max.add(t),this}},{key:\"expandByScalar\",value:function(t){return this.min.addScalar(-t),this.max.addScalar(t),this}},{key:\"setFromPoints\",value:function(t){var i=void 0,e=void 0;for(this.min.set(0,0),this.max.set(0,0),i=0,e=t.length;i<e;++i)this.expandByPoint(t[i]);return this}},{key:\"setFromCenterAndSize\",value:function(t,i){var e=v.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(e),this.max.copy(t).add(e),this}},{key:\"clampPoint\",value:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:new y).copy(t).clamp(this.min,this.max)}},{key:\"distanceToPoint\",value:function(t){return v.copy(t).clamp(this.min,this.max).sub(t).length()}},{key:\"translate\",value:function(t){return this.min.add(t),this.max.add(t),this}},{key:\"intersect\",value:function(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}},{key:\"union\",value:function(t){return this.min.min(t.min),this.max.max(t.max),this}},{key:\"containsPoint\",value:function(t){var i=this.min,e=this.max;return t.x>=i.x&&t.y>=i.y&&t.x<=e.x&&t.y<=e.y}},{key:\"containsBox\",value:function(t){var i=this.min,e=this.max,n=t.min,s=t.max;return i.x<=n.x&&s.x<=e.x&&i.y<=n.y&&s.y<=e.y}},{key:\"intersectsBox\",value:function(t){var i=this.min,e=this.max,n=t.min,s=t.max;return s.x>=i.x&&s.y>=i.y&&n.x<=e.x&&n.y<=e.y}},{key:\"equals\",value:function(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}])}(),function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;t(this,e),this.radius=i,this.theta=n,this.y=s}i(e,[{key:\"set\",value:function(t,i,e){return this.radius=t,this.theta=i,this.y=e,this}},{key:\"copy\",value:function(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"setFromVector3\",value:function(t){return this.radius=Math.sqrt(t.x*t.x+t.z*t.z),this.theta=Math.atan2(t.x,t.z),this.y=t.y,this}}])}(),function(){function e(){t(this,e),this.elements=new Float32Array([1,0,0,0,1,0,0,0,1])}return i(e,[{key:\"set\",value:function(t,i,e,n,s,r,a,o,h){var u=this.elements;return u[0]=t,u[3]=i,u[6]=e,u[1]=n,u[4]=s,u[7]=r,u[2]=a,u[5]=o,u[8]=h,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,1,0,0,0,1),this}},{key:\"copy\",value:function(t){var i=t.elements,e=this.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}},{key:\"clone\",value:function(){return(new this.constructor).fromArray(this.elements)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=this.elements,n=void 0;for(n=0;n<9;++n)e[n]=t[n+i];return this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=this.elements,n=void 0;for(n=0;n<9;++n)t[n+i]=e[n];return t}},{key:\"multiplyMatrices\",value:function(t,i){var e=t.elements,n=i.elements,s=this.elements,r=e[0],a=e[3],o=e[6],h=e[1],u=e[4],l=e[7],c=e[2],y=e[5],v=e[8],d=n[0],f=n[3],m=n[6],x=n[1],p=n[4],k=n[7],g=n[2],w=n[5],z=n[8];return s[0]=r*d+a*x+o*g,s[3]=r*f+a*p+o*w,s[6]=r*m+a*k+o*z,s[1]=h*d+u*x+l*g,s[4]=h*f+u*p+l*w,s[7]=h*m+u*k+l*z,s[2]=c*d+y*x+v*g,s[5]=c*f+y*p+v*w,s[8]=c*m+y*k+v*z,this}},{key:\"multiply\",value:function(t){return this.multiplyMatrices(this,t)}},{key:\"premultiply\",value:function(t){return this.multiplyMatrices(t,this)}},{key:\"multiplyScalar\",value:function(t){var i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}},{key:\"determinant\",value:function(){var t=this.elements,i=t[0],e=t[1],n=t[2],s=t[3],r=t[4],a=t[5],o=t[6],h=t[7],u=t[8];return i*r*u-i*a*h-e*s*u+e*a*o+n*s*h-n*r*o}},{key:\"getInverse\",value:function(t){var i=t.elements,e=this.elements,n=i[0],s=i[1],r=i[2],a=i[3],o=i[4],h=i[5],u=i[6],l=i[7],c=i[8],y=c*o-h*l,v=h*u-c*a,d=l*a-o*u,f=n*y+s*v+r*d,m=void 0;return 0!==f?(m=1/f,e[0]=y*m,e[1]=(r*l-c*s)*m,e[2]=(h*s-r*o)*m,e[3]=v*m,e[4]=(c*n-r*u)*m,e[5]=(r*a-h*n)*m,e[6]=d*m,e[7]=(s*u-l*n)*m,e[8]=(o*n-s*a)*m):(console.error(\"Can't invert matrix, determinant is zero\",t),this.identity()),this}},{key:\"transpose\",value:function(){var t=this.elements,i=void 0;return i=t[1],t[1]=t[3],t[3]=i,i=t[2],t[2]=t[6],t[6]=i,i=t[5],t[5]=t[7],t[7]=i,this}},{key:\"scale\",value:function(t,i){var e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=i,e[4]*=i,e[7]*=i,this}},{key:\"rotate\",value:function(t){var i=Math.cos(t),e=Math.sin(t),n=this.elements,s=n[0],r=n[3],a=n[6],o=n[1],h=n[4],u=n[7];return n[0]=i*s+e*o,n[3]=i*r+e*h,n[6]=i*a+e*u,n[1]=-e*s+i*o,n[4]=-e*r+i*h,n[7]=-e*a+i*u,this}},{key:\"translate\",value:function(t,i){var e=this.elements;return e[0]+=t*e[2],e[3]+=t*e[5],e[6]+=t*e[8],e[1]+=i*e[2],e[4]+=i*e[5],e[7]+=i*e[8],this}},{key:\"equals\",value:function(t){var i=this.elements,e=t.elements,n=!0,s=void 0;for(s=0;n&&s<9;++s)i[s]!==e[s]&&(n=!1);return n}}]),e}()),f=\"XYZ\",m=\"YZX\",x=\"ZXY\",p=\"XZY\",k=\"YXZ\",g=\"ZYX\",w=new o,z=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;t(this,e),this.x=i,this.y=n,this.z=s,this.w=r}return i(e,[{key:\"set\",value:function(t,i,e,n){return this.x=t,this.y=i,this.z=e,this.w=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}},{key:\"setFromEuler\",value:function(t){var i=t.x,e=t.y,n=t.z,s=Math.cos,r=Math.sin,a=s(i/2),o=s(e/2),h=s(n/2),u=r(i/2),l=r(e/2),c=r(n/2);switch(t.order){case f:this.x=u*o*h+a*l*c,this.y=a*l*h-u*o*c,this.z=a*o*c+u*l*h,this.w=a*o*h-u*l*c;break;case k:this.x=u*o*h+a*l*c,this.y=a*l*h-u*o*c,this.z=a*o*c-u*l*h,this.w=a*o*h+u*l*c;break;case x:this.x=u*o*h-a*l*c,this.y=a*l*h+u*o*c,this.z=a*o*c+u*l*h,this.w=a*o*h-u*l*c;break;case g:this.x=u*o*h-a*l*c,this.y=a*l*h+u*o*c,this.z=a*o*c-u*l*h,this.w=a*o*h+u*l*c;break;case m:this.x=u*o*h+a*l*c,this.y=a*l*h+u*o*c,this.z=a*o*c-u*l*h,this.w=a*o*h-u*l*c;break;case p:this.x=u*o*h-a*l*c,this.y=a*l*h-u*o*c,this.z=a*o*c+u*l*h,this.w=a*o*h+u*l*c}return this}},{key:\"setFromAxisAngle\",value:function(t,i){var e=i/2,n=Math.sin(e);return this.x=t.x*n,this.y=t.y*n,this.z=t.z*n,this.w=Math.cos(e),this}},{key:\"setFromRotationMatrix\",value:function(t){var i=t.elements,e=i[0],n=i[4],s=i[8],r=i[1],a=i[5],o=i[9],h=i[2],u=i[6],l=i[10],c=e+a+l,y=void 0;return c>0?(y=.5/Math.sqrt(c+1),this.w=.25/y,this.x=(u-o)*y,this.y=(s-h)*y,this.z=(r-n)*y):e>a&&e>l?(y=2*Math.sqrt(1+e-a-l),this.w=(u-o)/y,this.x=.25*y,this.y=(n+r)/y,this.z=(s+h)/y):a>l?(y=2*Math.sqrt(1+a-e-l),this.w=(s-h)/y,this.x=(n+r)/y,this.y=.25*y,this.z=(o+u)/y):(y=2*Math.sqrt(1+l-e-a),this.w=(r-n)/y,this.x=(s+h)/y,this.y=(o+u)/y,this.z=.25*y),this}},{key:\"setFromUnitVectors\",value:function(t,i){var e=t.dot(i)+1;return e<1e-6?(e=0,Math.abs(t.x)>Math.abs(t.z)?w.set(-t.y,t.x,0):w.set(0,-t.z,t.y)):w.crossVectors(t,i),this.x=w.x,this.y=w.y,this.z=w.z,this.w=e,this.normalize()}},{key:\"invert\",value:function(){return this.conjugate().normalize()}},{key:\"conjugate\",value:function(){return this.x*=-1,this.y*=-1,this.z*=-1,this}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"normalize\",value:function(){var t=this.length(),i=void 0;return 0===t?(this.x=0,this.y=0,this.z=0,this.w=1):(i=1/t,this.x=this.x*i,this.y=this.y*i,this.z=this.z*i,this.w=this.w*i),this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}},{key:\"multiplyQuaternions\",value:function(t,i){var e=t.x,n=t.y,s=t.z,r=t.w,a=i.x,o=i.y,h=i.z,u=i.w;return this.x=e*u+r*a+n*h-s*o,this.y=n*u+r*o+s*a-e*h,this.z=s*u+r*h+e*o-n*a,this.w=r*u-e*a-n*o-s*h,this}},{key:\"multiply\",value:function(t){return this.multiplyQuaternions(this,t)}},{key:\"premultiply\",value:function(t){return this.multiplyQuaternions(t,this)}},{key:\"slerp\",value:function(t,i){var e=this.x,n=this.y,s=this.z,r=this.w,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0;if(1===i)this.copy(t);else if(i>0){if((a=r*t.w+e*t.x+n*t.y+s*t.z)<0?(this.w=-t.w,this.x=-t.x,this.y=-t.y,this.z=-t.z,a=-a):this.copy(t),a>=1)return this.w=r,this.x=e,this.y=n,this.z=s,this;if(o=Math.sqrt(1-a*a),Math.abs(o)<.001)return this.w=.5*(r+this.w),this.x=.5*(e+this.x),this.y=.5*(n+this.y),this.z=.5*(s+this.z),this;h=Math.atan2(o,a),u=Math.sin((1-i)*h)/o,l=Math.sin(i*h)/o,this.w=r*u+this.w*l,this.x=e*u+this.x*l,this.y=n*u+this.y*l,this.z=s*u+this.z*l}return this}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}}],[{key:\"slerp\",value:function(t,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new e,s=arguments[3];return n.copy(t).slerp(i,s)}},{key:\"slerpFlat\",value:function(t,i,e,n,s,r,a){var o=s[r],h=s[r+1],u=s[r+2],l=s[r+3],c=e[n],y=e[n+1],v=e[n+2],d=e[n+3],f=void 0,m=void 0,x=void 0,p=void 0,k=void 0,g=void 0,w=void 0,z=void 0;d===l&&c===o&&y===h&&v===u||(f=1-a,g=(p=c*o+y*h+v*u+d*l)>=0?1:-1,(k=1-p*p)>Number.EPSILON&&(x=Math.sqrt(k),w=Math.atan2(x,p*g),f=Math.sin(f*w)/x,a=Math.sin(a*w)/x),c=c*f+o*(z=a*g),y=y*f+h*z,v=v*f+u*z,d=d*f+l*z,f===1-a&&(c*=m=1/Math.sqrt(c*c+y*y+v*v+d*d),y*=m,v*=m,d*=m)),t[i]=c,t[i+1]=y,t[i+2]=v,t[i+3]=d}}]),e}();function M(t,i,e){return Math.max(Math.min(t,e),i)}var b=new d,A=new z,S=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;t(this,e),this.x=i,this.y=n,this.z=s,this.order=e.defaultOrder}i(e,[{key:\"set\",value:function(t,i,e,n){return this.x=t,this.y=i,this.z=e,this.order=e,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.order=t.order,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.order)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.order=t[i+3],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.order,t}},{key:\"toVector3\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).set(this.x,this.y,this.z)}},{key:\"setFromRotationMatrix\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.order,e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],h=e[9],u=e[2],l=e[6],c=e[10];switch(i){case f:this.y=Math.asin(M(r,-1,1)),Math.abs(r)<.99999?(this.x=Math.atan2(-h,c),this.z=Math.atan2(-s,n)):(this.x=Math.atan2(l,o),this.z=0);break;case k:this.x=Math.asin(-M(h,-1,1)),Math.abs(h)<.99999?(this.y=Math.atan2(r,c),this.z=Math.atan2(a,o)):(this.y=Math.atan2(-u,n),this.z=0);break;case x:this.x=Math.asin(M(l,-1,1)),Math.abs(l)<.99999?(this.y=Math.atan2(-u,c),this.z=Math.atan2(-s,o)):(this.y=0,this.z=Math.atan2(a,n));break;case g:this.y=Math.asin(-M(u,-1,1)),Math.abs(u)<.99999?(this.x=Math.atan2(l,c),this.z=Math.atan2(a,n)):(this.x=0,this.z=Math.atan2(-s,o));break;case m:this.z=Math.asin(M(a,-1,1)),Math.abs(a)<.99999?(this.x=Math.atan2(-h,o),this.y=Math.atan2(-u,n)):(this.x=0,this.y=Math.atan2(r,c));break;case p:this.z=Math.asin(-M(s,-1,1)),Math.abs(s)<.99999?(this.x=Math.atan2(l,o),this.y=Math.atan2(r,n)):(this.x=Math.atan2(-h,c),this.y=0)}return this.order=i,this}},{key:\"setFromQuaternion\",value:function(t,i){return b.makeRotationFromQuaternion(t),this.setFromRotationMatrix(b,i)}},{key:\"setFromVector3\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.order;return this.set(t.x,t.y,t.z,i)}},{key:\"reorder\",value:function(t){return A.setFromEuler(this),this.setFromQuaternion(A,t)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.order===this.order}}],[{key:\"defaultOrder\",get:function(){return f}}])}(),new o),P=new o,I=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o(1,0,0),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t(this,e),this.normal=i,this.constant=n}return i(e,[{key:\"set\",value:function(t,i){return this.normal.copy(t),this.constant=i,this}},{key:\"setComponents\",value:function(t,i,e,n){return this.normal.set(t,i,e),this.constant=n,this}},{key:\"copy\",value:function(t){return this.normal.copy(t.normal),this.constant=t.constant,this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"setFromNormalAndCoplanarPoint\",value:function(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}},{key:\"setFromCoplanarPoints\",value:function(t,i,e){var n=S.subVectors(e,i).cross(P.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(n,S),this}},{key:\"normalize\",value:function(){var t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}},{key:\"negate\",value:function(){return this.normal.negate(),this.constant=-this.constant,this}},{key:\"distanceToPoint\",value:function(t){return this.normal.dot(t)+this.constant}},{key:\"distanceToSphere\",value:function(t){return this.distanceToPoint(t.center)-t.radius}},{key:\"projectPoint\",value:function(t,i){return i.copy(this.normal).multiplyScalar(-this.distanceToPoint(t)).add(t)}},{key:\"coplanarPoint\",value:function(t){return t.copy(this.normal).multiplyScalar(-this.constant)}},{key:\"translate\",value:function(t){return this.constant-=t.dot(this.normal),this}},{key:\"intersectLine\",value:function(t,i){var e=t.delta(S),n=this.normal.dot(e);if(0===n)0===this.distanceToPoint(t.start)&&i.copy(t.start);else{var s=-(t.start.dot(this.normal)+this.constant)/n;s>=0&&s<=1&&i.copy(e).multiplyScalar(s).add(t.start)}return i}},{key:\"intersectsLine\",value:function(t){var i=this.distanceToPoint(t.start),e=this.distanceToPoint(t.end);return i<0&&e>0||e<0&&i>0}},{key:\"intersectsBox\",value:function(t){return t.intersectsPlane(this)}},{key:\"intersectsSphere\",value:function(t){return t.intersectsPlane(this)}},{key:\"equals\",value:function(t){return t.normal.equals(this.normal)&&t.constant===this.constant}}]),e}(),T=new o,_=new o,C=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new I,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new I,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new I,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:new I,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:new I,o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:new I;t(this,e),this.planes=[i,n,s,r,a,o]}i(e,[{key:\"set\",value:function(t,i,e,n,s,r){var a=this.planes;return a[0].copy(t),a[1].copy(i),a[2].copy(e),a[3].copy(n),a[4].copy(s),a[5].copy(r),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"copy\",value:function(t){var i=this.planes,e=void 0;for(e=0;e<6;++e)i[e].copy(t.planes[e]);return this}},{key:\"setFromMatrix\",value:function(t){var i=this.planes,e=t.elements,n=e[0],s=e[1],r=e[2],a=e[3],o=e[4],h=e[5],u=e[6],l=e[7],c=e[8],y=e[9],v=e[10],d=e[11],f=e[12],m=e[13],x=e[14],p=e[15];return i[0].setComponents(a-n,l-o,d-c,p-f).normalize(),i[1].setComponents(a+n,l+o,d+c,p+f).normalize(),i[2].setComponents(a+s,l+h,d+y,p+m).normalize(),i[3].setComponents(a-s,l-h,d-y,p-m).normalize(),i[4].setComponents(a-r,l-u,d-v,p-x).normalize(),i[5].setComponents(a+r,l+u,d+v,p+x).normalize(),this}},{key:\"intersectsSphere\",value:function(t){var i=this.planes,e=t.center,n=-t.radius,s=!0,r=void 0;for(r=0;r<6;++r)if(i[r].distanceToPoint(e)<n){s=!1;break}return s}},{key:\"intersectsBox\",value:function(t){var i=this.planes,e=t.min,n=t.max,s=!0,r=void 0,a=void 0,o=void 0,h=void 0;for(r=0;r<6;++r)if(h=i[r],T.x=h.normal.x>0?e.x:n.x,_.x=h.normal.x>0?n.x:e.x,T.y=h.normal.y>0?e.y:n.y,_.y=h.normal.y>0?n.y:e.y,T.z=h.normal.z>0?e.z:n.z,_.z=h.normal.z>0?n.z:e.z,a=h.distanceToPoint(T),o=h.distanceToPoint(_),a<0&&o<0){s=!1;break}return s}},{key:\"containsPoint\",value:function(t){var i=this.planes,e=!0,n=void 0;for(n=0;n<6;++n)if(i[n].distanceToPoint(t)<0){e=!1;break}return e}}])}(),new o),O=new o,U=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o;t(this,e),this.start=i,this.end=n}i(e,[{key:\"set\",value:function(t,i){return this.start.copy(t),this.end.copy(i),this}},{key:\"copy\",value:function(t){return this.start.copy(t.start),this.end.copy(t.end),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"getCenter\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).addVectors(this.start,this.end).multiplyScalar(.5)}},{key:\"delta\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).subVectors(this.end,this.start)}},{key:\"lengthSquared\",value:function(){return this.start.distanceToSquared(this.end)}},{key:\"length\",value:function(){return this.start.distanceTo(this.end)}},{key:\"at\",value:function(t,i){return this.delta(i).multiplyScalar(t).add(this.start)}},{key:\"closestPointToPointParameter\",value:function(t,i){C.subVectors(t,this.start),O.subVectors(this.end,this.start);var e=O.dot(O),n=O.dot(C);return i?Math.min(Math.max(n/e,0),1):n/e}},{key:\"closestPointToPoint\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new o,n=this.closestPointToPointParameter(t,i);return this.delta(e).multiplyScalar(n).add(this.start)}},{key:\"equals\",value:function(t){return t.start.equals(this.start)&&t.end.equals(this.end)}}])}(),new o),F=new o,q=new o,E=(function(){function e(){t(this,e),this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}i(e,[{key:\"set\",value:function(t,i,e,n,s,r,a,o,h,u,l,c,y,v,d,f){var m=this.elements;return m[0]=t,m[4]=i,m[8]=e,m[12]=n,m[1]=s,m[5]=r,m[9]=a,m[13]=o,m[2]=h,m[6]=u,m[10]=l,m[14]=c,m[3]=y,m[7]=v,m[11]=d,m[15]=f,this}},{key:\"identity\",value:function(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}},{key:\"copy\",value:function(t){var i=t.elements,e=this.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}},{key:\"clone\",value:function(){return(new this.constructor).fromArray(this.elements)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=this.elements,n=void 0;for(n=0;n<16;++n)e[n]=t[n+i];return this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=this.elements,n=void 0;for(n=0;n<16;++n)t[n+i]=e[n];return t}},{key:\"getMaxScaleOnAxis\",value:function(){var t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],e=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,e,n))}},{key:\"copyPosition\",value:function(t){var i=this.elements,e=t.elements;return i[12]=e[12],i[13]=e[13],i[14]=e[14],this}},{key:\"setPosition\",value:function(t){var i=this.elements;return i[12]=t.x,i[13]=t.y,i[14]=t.z,this}},{key:\"extractBasis\",value:function(t,i,e){return t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),e.setFromMatrixColumn(this,2),this}},{key:\"makeBasis\",value:function(t,i,e){return this.set(t.x,i.x,e.x,0,t.y,i.y,e.y,0,t.z,i.z,e.z,0,0,0,0,1),this}},{key:\"extractRotation\",value:function(t){var i=this.elements,e=t.elements,n=1/U.setFromMatrixColumn(t,0).length(),s=1/U.setFromMatrixColumn(t,1).length(),r=1/U.setFromMatrixColumn(t,2).length();return i[0]=e[0]*n,i[1]=e[1]*n,i[2]=e[2]*n,i[4]=e[4]*s,i[5]=e[5]*s,i[6]=e[6]*s,i[8]=e[8]*r,i[9]=e[9]*r,i[10]=e[10]*r,this}},{key:\"makeRotationFromEuler\",value:function(t){var i=this.elements,e=t.x,n=t.y,s=t.z,r=Math.cos(e),a=Math.sin(e),o=Math.cos(n),h=Math.sin(n),u=Math.cos(s),l=Math.sin(s),c=void 0,y=void 0,v=void 0,d=void 0,w=void 0,z=void 0,M=void 0,b=void 0,A=void 0,S=void 0,P=void 0,I=void 0;switch(t.order){case f:c=r*u,y=r*l,v=a*u,d=a*l,i[0]=o*u,i[4]=-o*l,i[8]=h,i[1]=y+v*h,i[5]=c-d*h,i[9]=-a*o,i[2]=d-c*h,i[6]=v+y*h,i[10]=r*o;break;case k:w=o*u,z=o*l,M=h*u,b=h*l,i[0]=w+b*a,i[4]=M*a-z,i[8]=r*h,i[1]=r*l,i[5]=r*u,i[9]=-a,i[2]=z*a-M,i[6]=b+w*a,i[10]=r*o;break;case x:w=o*u,z=o*l,M=h*u,b=h*l,i[0]=w-b*a,i[4]=-r*l,i[8]=M+z*a,i[1]=z+M*a,i[5]=r*u,i[9]=b-w*a,i[2]=-r*h,i[6]=a,i[10]=r*o;break;case g:c=r*u,y=r*l,v=a*u,d=a*l,i[0]=o*u,i[4]=v*h-y,i[8]=c*h+d,i[1]=o*l,i[5]=d*h+c,i[9]=y*h-v,i[2]=-h,i[6]=a*o,i[10]=r*o;break;case m:A=r*o,S=r*h,P=a*o,I=a*h,i[0]=o*u,i[4]=I-A*l,i[8]=P*l+S,i[1]=l,i[5]=r*u,i[9]=-a*u,i[2]=-h*u,i[6]=S*l+P,i[10]=A-I*l;break;case p:A=r*o,S=r*h,P=a*o,I=a*h,i[0]=o*u,i[4]=-l,i[8]=h*u,i[1]=A*l+I,i[5]=r*u,i[9]=S*l-P,i[2]=P*l-S,i[6]=a*u,i[10]=I*l+A}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}},{key:\"makeRotationFromQuaternion\",value:function(t){var i=this.elements,e=t.x,n=t.y,s=t.z,r=t.w,a=e+e,o=n+n,h=s+s,u=e*a,l=e*o,c=e*h,y=n*o,v=n*h,d=s*h,f=r*a,m=r*o,x=r*h;return i[0]=1-(y+d),i[4]=l-x,i[8]=c+m,i[1]=l+x,i[5]=1-(u+d),i[9]=v-f,i[2]=c-m,i[6]=v+f,i[10]=1-(u+y),i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}},{key:\"lookAt\",value:function(t,i,e){var n=this.elements,s=U,r=F,a=q;return a.subVectors(t,i),0===a.lengthSquared()&&(a.z=1),a.normalize(),s.crossVectors(e,a),0===s.lengthSquared()&&(1===Math.abs(e.z)?a.x+=1e-4:a.z+=1e-4,a.normalize(),s.crossVectors(e,a)),s.normalize(),r.crossVectors(a,s),n[0]=s.x,n[4]=r.x,n[8]=a.x,n[1]=s.y,n[5]=r.y,n[9]=a.y,n[2]=s.z,n[6]=r.z,n[10]=a.z,this}},{key:\"multiplyMatrices\",value:function(t,i){var e=this.elements,n=t.elements,s=i.elements,r=n[0],a=n[4],o=n[8],h=n[12],u=n[1],l=n[5],c=n[9],y=n[13],v=n[2],d=n[6],f=n[10],m=n[14],x=n[3],p=n[7],k=n[11],g=n[15],w=s[0],z=s[4],M=s[8],b=s[12],A=s[1],S=s[5],P=s[9],I=s[13],T=s[2],_=s[6],C=s[10],O=s[14],U=s[3],F=s[7],q=s[11],E=s[15];return e[0]=r*w+a*A+o*T+h*U,e[4]=r*z+a*S+o*_+h*F,e[8]=r*M+a*P+o*C+h*q,e[12]=r*b+a*I+o*O+h*E,e[1]=u*w+l*A+c*T+y*U,e[5]=u*z+l*S+c*_+y*F,e[9]=u*M+l*P+c*C+y*q,e[13]=u*b+l*I+c*O+y*E,e[2]=v*w+d*A+f*T+m*U,e[6]=v*z+d*S+f*_+m*F,e[10]=v*M+d*P+f*C+m*q,e[14]=v*b+d*I+f*O+m*E,e[3]=x*w+p*A+k*T+g*U,e[7]=x*z+p*S+k*_+g*F,e[11]=x*M+p*P+k*C+g*q,e[15]=x*b+p*I+k*O+g*E,this}},{key:\"multiply\",value:function(t){return this.multiplyMatrices(this,t)}},{key:\"premultiply\",value:function(t){return this.multiplyMatrices(t,this)}},{key:\"multiplyScalar\",value:function(t){var i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}},{key:\"determinant\",value:function(){var t=this.elements,i=t[0],e=t[4],n=t[8],s=t[12],r=t[1],a=t[5],o=t[9],h=t[13],u=t[2],l=t[6],c=t[10],y=t[14],v=i*a,d=i*o,f=i*h,m=e*r,x=e*o,p=e*h,k=n*r,g=n*a,w=n*h,z=s*r,M=s*a,b=s*o;return t[3]*(b*l-w*l-M*c+p*c+g*y-x*y)+t[7]*(d*y-f*c+z*c-k*y+w*u-b*u)+t[11]*(f*l-v*y-z*l+m*y+M*u-p*u)+t[15]*(-g*u-d*l+v*c+k*l-m*c+x*u)}},{key:\"getInverse\",value:function(t){var i=this.elements,e=t.elements,n=e[0],s=e[1],r=e[2],a=e[3],o=e[4],h=e[5],u=e[6],l=e[7],c=e[8],y=e[9],v=e[10],d=e[11],f=e[12],m=e[13],x=e[14],p=e[15],k=y*x*l-m*v*l+m*u*d-h*x*d-y*u*p+h*v*p,g=f*v*l-c*x*l-f*u*d+o*x*d+c*u*p-o*v*p,w=c*m*l-f*y*l+f*h*d-o*m*d-c*h*p+o*y*p,z=f*y*u-c*m*u-f*h*v+o*m*v+c*h*x-o*y*x,M=n*k+s*g+r*w+a*z,b=void 0;return 0!==M?(b=1/M,i[0]=k*b,i[1]=(m*v*a-y*x*a-m*r*d+s*x*d+y*r*p-s*v*p)*b,i[2]=(h*x*a-m*u*a+m*r*l-s*x*l-h*r*p+s*u*p)*b,i[3]=(y*u*a-h*v*a-y*r*l+s*v*l+h*r*d-s*u*d)*b,i[4]=g*b,i[5]=(c*x*a-f*v*a+f*r*d-n*x*d-c*r*p+n*v*p)*b,i[6]=(f*u*a-o*x*a-f*r*l+n*x*l+o*r*p-n*u*p)*b,i[7]=(o*v*a-c*u*a+c*r*l-n*v*l-o*r*d+n*u*d)*b,i[8]=w*b,i[9]=(f*y*a-c*m*a-f*s*d+n*m*d+c*s*p-n*y*p)*b,i[10]=(o*m*a-f*h*a+f*s*l-n*m*l-o*s*p+n*h*p)*b,i[11]=(c*h*a-o*y*a-c*s*l+n*y*l+o*s*d-n*h*d)*b,i[12]=z*b,i[13]=(c*m*r-f*y*r+f*s*v-n*m*v-c*s*x+n*y*x)*b,i[14]=(f*h*r-o*m*r-f*s*u+n*m*u+o*s*x-n*h*x)*b,i[15]=(o*y*r-c*h*r+c*s*u-n*y*u-o*s*v+n*h*v)*b):(console.error(\"Can't invert matrix, determinant is zero\",t),this.identity()),this}},{key:\"transpose\",value:function(){var t=this.elements,i=void 0;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}},{key:\"scale\",value:function(t,i,e){var n=this.elements;return n[0]*=t,n[4]*=i,n[8]*=e,n[1]*=t,n[5]*=i,n[9]*=e,n[2]*=t,n[6]*=i,n[10]*=e,n[3]*=t,n[7]*=i,n[11]*=e,this}},{key:\"makeScale\",value:function(t,i,e){return this.set(t,0,0,0,0,i,0,0,0,0,e,0,0,0,0,1),this}},{key:\"makeTranslation\",value:function(t,i,e){return this.set(1,0,0,t,0,1,0,i,0,0,1,e,0,0,0,1),this}},{key:\"makeRotationX\",value:function(t){var i=Math.cos(t),e=Math.sin(t);return this.set(1,0,0,0,0,i,-e,0,0,e,i,0,0,0,0,1),this}},{key:\"makeRotationY\",value:function(t){var i=Math.cos(t),e=Math.sin(t);return this.set(i,0,e,0,0,1,0,0,-e,0,i,0,0,0,0,1),this}},{key:\"makeRotationZ\",value:function(t){var i=Math.cos(t),e=Math.sin(t);return this.set(i,-e,0,0,e,i,0,0,0,0,1,0,0,0,0,1),this}},{key:\"makeRotationAxis\",value:function(t,i){var e=Math.cos(i),n=Math.sin(i),s=1-e,r=t.x,a=t.y,o=t.z,h=s*r,u=s*a;return this.set(h*r+e,h*a-n*o,h*o+n*a,0,h*a+n*o,u*a+e,u*o-n*r,0,h*o-n*a,u*o+n*r,s*o*o+e,0,0,0,0,1),this}},{key:\"makeShear\",value:function(t,i,e){return this.set(1,i,e,0,t,1,e,0,t,i,1,0,0,0,0,1),this}},{key:\"compose\",value:function(t,i,e){return this.makeRotationFromQuaternion(i),this.scale(e.x,e.y,e.z),this.setPosition(t),this}},{key:\"decompose\",value:function(t,i,e){var n=this.elements,s=n[0],r=n[1],a=n[2],o=n[4],h=n[5],u=n[6],l=n[8],c=n[9],y=n[10],v=this.determinant(),d=U.set(s,r,a).length()*(v<0?-1:1),f=U.set(o,h,u).length(),m=U.set(l,c,y).length(),x=1/d,p=1/f,k=1/m;return t.x=n[12],t.y=n[13],t.z=n[14],n[0]*=x,n[1]*=x,n[2]*=x,n[4]*=p,n[5]*=p,n[6]*=p,n[8]*=k,n[9]*=k,n[10]*=k,i.setFromRotationMatrix(this),n[0]=s,n[1]=r,n[2]=a,n[4]=o,n[5]=h,n[6]=u,n[8]=l,n[9]=c,n[10]=y,e.x=d,e.y=f,e.z=m,this}},{key:\"makePerspective\",value:function(t,i,e,n,s,r){var a=this.elements,o=2*s/(i-t),h=2*s/(e-n),u=(i+t)/(i-t),l=(e+n)/(e-n),c=-(r+s)/(r-s),y=-2*r*s/(r-s);return a[0]=o,a[4]=0,a[8]=u,a[12]=0,a[1]=0,a[5]=h,a[9]=l,a[13]=0,a[2]=0,a[6]=0,a[10]=c,a[14]=y,a[3]=0,a[7]=0,a[11]=-1,a[15]=0,this}},{key:\"makeOrthographic\",value:function(t,i,e,n,s,r){var a=this.elements,o=1/(i-t),h=1/(e-n),u=1/(r-s),l=(i+t)*o,c=(e+n)*h,y=(r+s)*u;return a[0]=2*o,a[4]=0,a[8]=0,a[12]=-l,a[1]=0,a[5]=2*h,a[9]=0,a[13]=-c,a[2]=0,a[6]=0,a[10]=-2*u,a[14]=-y,a[3]=0,a[7]=0,a[11]=0,a[15]=1,this}},{key:\"equals\",value:function(t){var i=this.elements,e=t.elements,n=!0,s=void 0;for(s=0;n&&s<16;++s)i[s]!==e[s]&&(n=!1);return n}}])}(),[new o,new o,new o,new o]),D=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o;t(this,e),this.origin=i,this.direction=n}return i(e,[{key:\"set\",value:function(t,i){return this.origin.copy(t),this.direction.copy(i),this}},{key:\"copy\",value:function(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"at\",value:function(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o).copy(this.direction).multiplyScalar(t).add(this.origin)}},{key:\"lookAt\",value:function(t){return this.direction.copy(t).sub(this.origin).normalize(),this}},{key:\"recast\",value:function(t){return this.origin.copy(this.at(t,E[0])),this}},{key:\"closestPointToPoint\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=i.subVectors(t,this.origin).dot(this.direction);return e>=0?i.copy(this.direction).multiplyScalar(e).add(this.origin):i.copy(this.origin)}},{key:\"distanceSquaredToPoint\",value:function(t){var i=E[0].subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):E[0].copy(this.direction).multiplyScalar(i).add(this.origin).distanceToSquared(t)}},{key:\"distanceToPoint\",value:function(t){return Math.sqrt(this.distanceSquaredToPoint(t))}},{key:\"distanceToPlane\",value:function(t){var i=t.normal.dot(this.direction),e=0!==i?-(this.origin.dot(t.normal)+t.constant)/i:0===t.distanceToPoint(this.origin)?0:-1;return e>=0?e:null}},{key:\"distanceSquaredToSegment\",value:function(t,i,e,n){var s=E[0].copy(t).add(i).multiplyScalar(.5),r=E[1].copy(i).sub(t).normalize(),a=E[2].copy(this.origin).sub(s),o=.5*t.distanceTo(i),h=-this.direction.dot(r),u=a.dot(this.direction),l=-a.dot(r),c=a.lengthSq(),y=Math.abs(1-h*h),v=void 0,d=void 0,f=void 0,m=void 0,x=void 0;return y>0?(d=h*u-l,f=o*y,(v=h*l-u)>=0?d>=-f?d<=f?x=(v*=m=1/y)*(v+h*(d*=m)+2*u)+d*(h*v+d+2*l)+c:(d=o,x=-(v=Math.max(0,-(h*d+u)))*v+d*(d+2*l)+c):(d=-o,x=-(v=Math.max(0,-(h*d+u)))*v+d*(d+2*l)+c):d<=-f?x=-(v=Math.max(0,-(-h*o+u)))*v+(d=v>0?-o:Math.min(Math.max(-o,-l),o))*(d+2*l)+c:d<=f?(v=0,x=(d=Math.min(Math.max(-o,-l),o))*(d+2*l)+c):x=-(v=Math.max(0,-(h*o+u)))*v+(d=v>0?o:Math.min(Math.max(-o,-l),o))*(d+2*l)+c):(d=h>0?-o:o,x=-(v=Math.max(0,-(h*d+u)))*v+d*(d+2*l)+c),void 0!==e&&e.copy(this.direction).multiplyScalar(v).add(this.origin),void 0!==n&&n.copy(r).multiplyScalar(d).add(s),x}},{key:\"intersectSphere\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=E[0].subVectors(t.center,this.origin),n=e.dot(this.direction),s=e.dot(e)-n*n,r=t.radius*t.radius,a=null,h=void 0,u=void 0,l=void 0;return s<=r&&(l=n+(h=Math.sqrt(r-s)),((u=n-h)>=0||l>=0)&&(a=u<0?this.at(l,i):this.at(u,i))),a}},{key:\"intersectsSphere\",value:function(t){return this.distanceToPoint(t.center)<=t.radius}},{key:\"intersectPlane\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=this.distanceToPlane(t);return null===e?null:this.at(e,i)}},{key:\"intersectsPlane\",value:function(t){var i=t.distanceToPoint(this.origin);return 0===i||t.normal.dot(this.direction)*i<0}},{key:\"intersectBox\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,e=this.origin,n=this.direction,s=t.min,r=t.max,a=1/n.x,h=1/n.y,u=1/n.z,l=null,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,m=void 0;return a>=0?(c=(s.x-e.x)*a,y=(r.x-e.x)*a):(c=(r.x-e.x)*a,y=(s.x-e.x)*a),h>=0?(v=(s.y-e.y)*h,d=(r.y-e.y)*h):(v=(r.y-e.y)*h,d=(s.y-e.y)*h),c<=d&&v<=y&&((v>c||c!=c)&&(c=v),(d<y||y!=y)&&(y=d),u>=0?(f=(s.z-e.z)*u,m=(r.z-e.z)*u):(f=(r.z-e.z)*u,m=(s.z-e.z)*u),c<=m&&f<=y&&((f>c||c!=c)&&(c=f),(m<y||y!=y)&&(y=m),y>=0&&(l=this.at(c>=0?c:y,i)))),l}},{key:\"intersectsBox\",value:function(t){return null!==this.intersectBox(t,E[0])}},{key:\"intersectTriangle\",value:function(t,i,e,n,s){var r=this.direction,a=E[0],o=E[1],h=E[2],u=E[3],l=null,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0;return o.subVectors(i,t),h.subVectors(e,t),u.crossVectors(o,h),0===(c=r.dot(u))||n&&c>0||(c>0?y=1:(y=-1,c=-c),a.subVectors(this.origin,t),(v=y*r.dot(h.crossVectors(a,h)))>=0&&(d=y*r.dot(o.cross(a)))>=0&&v+d<=c&&(f=-y*a.dot(u))>=0&&(l=this.at(f/c,s))),l}},{key:\"applyMatrix4\",value:function(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}},{key:\"equals\",value:function(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}}]),e}(),V=(function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;t(this,e),this.radius=i,this.phi=n,this.theta=s}i(e,[{key:\"set\",value:function(t,i,e){return this.radius=t,this.phi=i,this.theta=e,this}},{key:\"copy\",value:function(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"setFromVector3\",value:function(t){return this.radius=t.length(),0===this.radius?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t.x,t.z),this.phi=Math.acos(Math.min(Math.max(t.y/this.radius,-1),1))),this.makeSafe()}},{key:\"makeSafe\",value:function(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}}])}(),function(){function e(){t(this,e),this.elements=new Float32Array([1,0,0,1,0,1])}return i(e,[{key:\"set\",value:function(t,i,e,n,s,r){var a=this.elements;return a[0]=t,a[1]=i,a[3]=n,a[2]=e,a[4]=s,a[5]=r,this}},{key:\"identity\",value:function(){return this.set(1,0,0,1,0,1),this}},{key:\"copy\",value:function(t){var i=t.elements;return this.set(i[0],i[1],i[2],i[3],i[4],i[5]),this}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}},{key:\"toMatrix3\",value:function(t){var i=t.elements;t.set(i[0],i[1],i[2],i[1],i[3],i[4],i[2],i[4],i[5])}},{key:\"add\",value:function(t){var i=this.elements,e=t.elements;return i[0]+=e[0],i[1]+=e[1],i[3]+=e[3],i[2]+=e[2],i[4]+=e[4],i[5]+=e[5],this}},{key:\"norm\",value:function(){var t=this.elements,i=t[1]*t[1],e=t[2]*t[2],n=t[4]*t[4];return Math.sqrt(t[0]*t[0]+i+e+i+t[3]*t[3]+n+e+n+t[5]*t[5])}},{key:\"off\",value:function(){var t=this.elements;return Math.sqrt(2*(t[1]*t[1]+t[2]*t[2]+t[4]*t[4]))}},{key:\"applyToVector3\",value:function(t){var i=t.x,e=t.y,n=t.z,s=this.elements;return t.x=s[0]*i+s[1]*e+s[2]*n,t.y=s[1]*i+s[3]*e+s[4]*n,t.z=s[2]*i+s[4]*e+s[5]*n,t}},{key:\"equals\",value:function(t){var i=this.elements,e=t.elements,n=!0,s=void 0;for(s=0;n&&s<6;++s)i[s]!==e[s]&&(n=!1);return n}}],[{key:\"calculateIndex\",value:function(t,i){return 3-(3-t)*(2-t)/2+i}}]),e}()),N=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;t(this,e),this.x=i,this.y=n,this.z=s,this.w=r}return i(e,[{key:\"set\",value:function(t,i,e,n){return this.x=t,this.y=i,this.z=e,this.w=n,this}},{key:\"copy\",value:function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}},{key:\"clone\",value:function(){return new this.constructor(this.x,this.y,this.z,this.w)}},{key:\"fromArray\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}},{key:\"toArray\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}},{key:\"setAxisAngleFromQuaternion\",value:function(t){this.w=2*Math.acos(t.w);var i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}},{key:\"setAxisAngleFromRotationMatrix\",value:function(t){var i=t.elements,e=i[0],n=i[4],s=i[8],r=i[1],a=i[5],o=i[9],h=i[2],u=i[6],l=i[10],c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,m=void 0,x=void 0,p=void 0,k=void 0,g=void 0,w=void 0;return Math.abs(n-r)<.01&&Math.abs(s-h)<.01&&Math.abs(o-u)<.01?Math.abs(n+r)<.1&&Math.abs(s+h)<.1&&Math.abs(o+u)<.1&&Math.abs(e+a+l-3)<.1?this.set(1,0,0,0):(c=Math.PI,x=(l+1)/2,p=(n+r)/4,k=(s+h)/4,g=(o+u)/4,(f=(e+1)/2)>(m=(a+1)/2)&&f>x?f<.01?(y=0,v=.707106781,d=.707106781):(v=p/(y=Math.sqrt(f)),d=k/y):m>x?m<.01?(y=.707106781,v=0,d=.707106781):(y=p/(v=Math.sqrt(m)),d=g/v):x<.01?(y=.707106781,v=.707106781,d=0):(y=k/(d=Math.sqrt(x)),v=g/d),this.set(y,v,d,c)):(w=Math.sqrt((u-o)*(u-o)+(s-h)*(s-h)+(r-n)*(r-n)),Math.abs(w)<.001&&(w=1),this.x=(u-o)/w,this.y=(s-h)/w,this.z=(r-n)/w,this.w=Math.acos((e+a+l-1)/2)),this}},{key:\"add\",value:function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}},{key:\"addScalar\",value:function(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}},{key:\"addVectors\",value:function(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}},{key:\"addScaledVector\",value:function(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}},{key:\"sub\",value:function(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}},{key:\"subScalar\",value:function(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}},{key:\"subVectors\",value:function(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}},{key:\"multiply\",value:function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}},{key:\"multiplyScalar\",value:function(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}},{key:\"multiplyVectors\",value:function(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this.w=t.w*i.w,this}},{key:\"divide\",value:function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}},{key:\"divideScalar\",value:function(t){return this.x/=t,this.y/=t,this.z/=t,this.w/=t,this}},{key:\"applyMatrix4\",value:function(t){var i=this.x,e=this.y,n=this.z,s=this.w,r=t.elements;return this.x=r[0]*i+r[4]*e+r[8]*n+r[12]*s,this.y=r[1]*i+r[5]*e+r[9]*n+r[13]*s,this.z=r[2]*i+r[6]*e+r[10]*n+r[14]*s,this.w=r[3]*i+r[7]*e+r[11]*n+r[15]*s,this}},{key:\"negate\",value:function(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}},{key:\"dot\",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}},{key:\"manhattanLength\",value:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}},{key:\"lengthSquared\",value:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}},{key:\"length\",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}},{key:\"manhattanDistanceTo\",value:function(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)+Math.abs(this.w-t.w)}},{key:\"distanceToSquared\",value:function(t){var i=this.x-t.x,e=this.y-t.y,n=this.z-t.z,s=this.w-t.w;return i*i+e*e+n*n+s*s}},{key:\"distanceTo\",value:function(t){return Math.sqrt(this.distanceToSquared(t))}},{key:\"normalize\",value:function(){return this.divideScalar(this.length())}},{key:\"setLength\",value:function(t){return this.normalize().multiplyScalar(t)}},{key:\"min\",value:function(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}},{key:\"max\",value:function(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}},{key:\"clamp\",value:function(t,i){return this.x=Math.max(t.x,Math.min(i.x,this.x)),this.y=Math.max(t.y,Math.min(i.y,this.y)),this.z=Math.max(t.z,Math.min(i.z,this.z)),this.w=Math.max(t.w,Math.min(i.w,this.w)),this}},{key:\"floor\",value:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}},{key:\"ceil\",value:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}},{key:\"round\",value:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}},{key:\"lerp\",value:function(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}},{key:\"lerpVectors\",value:function(t,i,e){return this.subVectors(i,t).multiplyScalar(e).add(t)}},{key:\"equals\",value:function(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}}]),e}(),B=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];t(this,e),this.value=i,this.done=n}return i(e,[{key:\"reset\",value:function(){this.value=null,this.done=!1}}]),e}(),L=new o,R=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o;t(this,e),this.min=i,this.max=n,this.children=null}return i(e,[{key:\"getCenter\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).addVectors(this.min,this.max).multiplyScalar(.5)}},{key:\"getDimensions\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).subVectors(this.max,this.min)}},{key:\"split\",value:function(){var t=this.min,i=this.max,e=this.getCenter(L),n=this.children=[null,null,null,null,null,null,null,null],s=void 0,r=void 0;for(s=0;s<8;++s)r=j[s],n[s]=new this.constructor(new o(0===r[0]?t.x:e.x,0===r[1]?t.y:e.y,0===r[2]?t.z:e.z),new o(0===r[0]?e.x:i.x,0===r[1]?e.y:i.y,0===r[2]?e.z:i.z))}}]),e}(),j=[new Uint8Array([0,0,0]),new Uint8Array([0,0,1]),new Uint8Array([0,1,0]),new Uint8Array([0,1,1]),new Uint8Array([1,0,0]),new Uint8Array([1,0,1]),new Uint8Array([1,1,0]),new Uint8Array([1,1,1])],Y=[new Uint8Array([0,4]),new Uint8Array([1,5]),new Uint8Array([2,6]),new Uint8Array([3,7]),new Uint8Array([0,2]),new Uint8Array([1,3]),new Uint8Array([4,6]),new Uint8Array([5,7]),new Uint8Array([0,1]),new Uint8Array([2,3]),new Uint8Array([4,5]),new Uint8Array([6,7])],X=new o,Q=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t(this,e),this.min=i,this.size=n,this.children=null}return i(e,[{key:\"getCenter\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).copy(this.min).addScalar(.5*this.size)}},{key:\"getDimensions\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).set(this.size,this.size,this.size)}},{key:\"split\",value:function(){var t=this.min,i=this.getCenter(X),e=.5*this.size,n=this.children=[null,null,null,null,null,null,null,null],s=void 0,r=void 0;for(s=0;s<8;++s)r=j[s],n[s]=new this.constructor(new o(0===r[0]?t.x:i.x,0===r[1]?t.y:i.y,0===r[2]?t.z:i.z),e)}},{key:\"max\",get:function(){return this.min.clone().addScalar(this.size)}}]),e}(),Z=new u,G=function(){function e(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;t(this,e),this.octree=i,this.region=n,this.cull=null!==n,this.result=new B,this.trace=null,this.indices=null,this.reset()}return i(e,[{key:\"reset\",value:function(){var t=this.octree.root;return this.trace=[],this.indices=[],null!==t&&(Z.min=t.min,Z.max=t.max,this.cull&&!this.region.intersectsBox(Z)||(this.trace.push(t),this.indices.push(0))),this.result.reset(),this}},{key:\"next\",value:function(){for(var t=this.cull,i=this.region,e=this.indices,n=this.trace,s=null,r=n.length-1,a=void 0,o=void 0,h=void 0;null===s&&r>=0;)if(a=e[r],o=n[r].children,++e[r],a<8)if(null!==o){if(h=o[a],t&&(Z.min=h.min,Z.max=h.max,!i.intersectsBox(Z)))continue;n.push(h),e.push(0),++r}else s=n.pop(),e.pop();else n.pop(),e.pop(),--r;return this.result.value=s,this.result.done=null===s,this.result}},{key:\"return\",value:function(t){return this.result.value=t,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),e}(),H=[new o,new o,new o],J=new u,K=new D,W=[new Uint8Array([4,2,1]),new Uint8Array([5,3,8]),new Uint8Array([6,8,3]),new Uint8Array([7,8,8]),new Uint8Array([8,6,5]),new Uint8Array([8,7,8]),new Uint8Array([8,8,7]),new Uint8Array([8,8,8])],$=0;function tt(t,i,e,n){var s=void 0,r=0;return i<e?(s=i,r=0):(s=e,r=1),n<s&&(r=2),W[t][r]}var it=function(){function e(){t(this,e)}return i(e,null,[{key:\"intersectOctree\",value:function(t,i,e){var n=J.min.set(0,0,0),s=J.max.subVectors(t.max,t.min),r=t.getDimensions(H[0]),a=H[1].copy(r).multiplyScalar(.5),o=K.origin.copy(i.ray.origin),h=K.direction.copy(i.ray.direction),u=void 0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,m=void 0,x=void 0;o.sub(t.getCenter(H[2])).add(a),$=0,h.x<0&&(o.x=r.x-o.x,h.x=-h.x,$|=4),h.y<0&&(o.y=r.y-o.y,h.y=-h.y,$|=2),h.z<0&&(o.z=r.z-o.z,h.z=-h.z,$|=1),u=1/h.x,l=1/h.y,c=1/h.z,y=(n.x-o.x)*u,v=(s.x-o.x)*u,d=(n.y-o.y)*l,f=(s.y-o.y)*l,m=(n.z-o.z)*c,x=(s.z-o.z)*c,Math.max(Math.max(y,d),m)<Math.min(Math.min(v,f),x)&&function t(i,e,n,s,r,a,o,h,u){var l=i.children,c=void 0,y=void 0,v=void 0,d=void 0;if(r>=0&&a>=0&&o>=0)if(null===l)u.push(i);else{c=function(t,i,e,n,s,r){var a=0;return t>i&&t>e?(s<t&&(a|=2),r<t&&(a|=1)):i>e?(n<i&&(a|=4),r<i&&(a|=1)):(n<e&&(a|=4),s<e&&(a|=2)),a}(e,n,s,y=.5*(e+r),v=.5*(n+a),d=.5*(s+o));do{switch(c){case 0:t(l[$],e,n,s,y,v,d,h,u),c=tt(c,y,v,d);break;case 1:t(l[1^$],e,n,d,y,v,o,h,u),c=tt(c,y,v,o);break;case 2:t(l[2^$],e,v,s,y,a,d,h,u),c=tt(c,y,a,d);break;case 3:t(l[3^$],e,v,d,y,a,o,h,u),c=tt(c,y,a,o);break;case 4:t(l[4^$],y,n,s,r,v,d,h,u),c=tt(c,r,v,d);break;case 5:t(l[5^$],y,n,d,r,v,o,h,u),c=tt(c,r,v,o);break;case 6:t(l[6^$],y,v,s,r,a,d,h,u),c=tt(c,r,a,d);break;case 7:t(l[7^$],y,v,d,r,a,o,h,u),c=8}}while(c<8)}}(t.root,y,d,m,v,f,x,i,e)}}]),e}(),et=new u;var nt=function(){function e(i,n){t(this,e),this.root=void 0!==i&&void 0!==n?new R(i,n):null}return i(e,[{key:\"getCenter\",value:function(t){return this.root.getCenter(t)}},{key:\"getDimensions\",value:function(t){return this.root.getDimensions(t)}},{key:\"getDepth\",value:function(){return function t(i){var e=i.children,n=0,s=void 0,r=void 0,a=void 0;if(null!==e)for(s=0,r=e.length;s<r;++s)(a=1+t(e[s]))>n&&(n=a);return n}(this.root)}},{key:\"cull\",value:function(t){var i=[];return function t(i,e,n){var s=i.children,r=void 0,a=void 0;if(et.min=i.min,et.max=i.max,e.intersectsBox(et))if(null!==s)for(r=0,a=s.length;r<a;++r)t(s[r],e,n);else n.push(i)}(this.root,t,i),i}},{key:\"findOctantsByLevel\",value:function(t){var i=[];return function t(i,e,n,s){var r=i.children,a=void 0,o=void 0;if(n===e)s.push(i);else if(null!==r)for(++n,a=0,o=r.length;a<o;++a)t(r[a],e,n,s)}(this.root,t,0,i),i}},{key:\"raycast\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return it.intersectOctree(this,t,i),i}},{key:\"leaves\",value:function(t){return new G(this,t)}},{key:Symbol.iterator,value:function(){return new G(this)}},{key:\"min\",get:function(){return this.root.min}},{key:\"max\",get:function(){return this.root.max}},{key:\"children\",get:function(){return this.root.children}}]),e}(),st=new o,rt=function(e){n(a,R);function a(i,e){t(this,a);var n=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,i,e));return n.points=null,n.data=null,n}return i(a,[{key:\"distanceToSquared\",value:function(t){return st.copy(t).clamp(this.min,this.max).sub(t).lengthSquared()}},{key:\"distanceToCenterSquared\",value:function(t){var i=this.getCenter(st),e=t.x-i.x,n=t.y-i.x,s=t.z-i.z;return e*e+n*n+s*s}},{key:\"contains\",value:function(t,i){var e=this.min,n=this.max;return t.x>=e.x-i&&t.y>=e.y-i&&t.z>=e.z-i&&t.x<=n.x+i&&t.y<=n.y+i&&t.z<=n.z+i}},{key:\"redistribute\",value:function(t){var i=this.children,e=this.points,n=this.data,s=void 0,r=void 0,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0;if(null!==i)for(s=0,a=e.length;s<a;++s)for(u=e[s],l=n[s],r=0,o=i.length;r<o;++r)if((h=i[r]).contains(u,t)){null===h.points&&(h.points=[],h.data=[]),h.points.push(u),h.data.push(l);break}this.points=null,this.data=null}},{key:\"merge\",value:function(){var t=this.children,i=void 0,e=void 0,n=void 0;if(null!==t){for(this.points=[],this.data=[],i=0,e=t.length;i<e;++i)if(null!==(n=t[i]).points){var s,a;(s=this.points).push.apply(s,r(n.points)),(a=this.data).push.apply(a,r(n.data))}this.children=null}}}]),a}(),at=function i(e,n,s){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;t(this,i),this.distance=e,this.distanceToRay=n,this.point=s,this.object=r},ot=1e-6;function ht(t){var i=t.children,e=0,n=void 0,s=void 0;if(null!==i)for(n=0,s=i.length;n<s;++n)e+=ht(i[n]);else null!==t.points&&(e=t.points.length);return e}function ut(t,i,e,n,s){var r=n.children,a=!1,o=!1,h=void 0,u=void 0;if(n.contains(t,e.bias)){if(null===r){if(null===n.points)n.points=[],n.data=[];else for(h=0,u=n.points.length;!a&&h<u;++h)a=n.points[h].equals(t);a?(n.data[h-1]=i,o=!0):n.points.length<e.maxPoints||s===e.maxDepth?(n.points.push(t.clone()),n.data.push(i),++e.pointCount,o=!0):(n.split(),n.redistribute(e.bias),r=n.children)}if(null!==r)for(++s,h=0,u=r.length;!o&&h<u;++h)o=ut(t,i,e,r[h],s)}return o}function lt(t,i,e,n){var s=e.children,r=null,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0;if(e.contains(t,i.bias))if(null!==s)for(a=0,o=s.length;null===r&&a<o;++a)r=lt(t,i,s[a],e);else if(null!==e.points)for(h=e.points,u=e.data,a=0,o=h.length;a<o;++a)if(h[a].equals(t)){l=o-1,r=u[a],a<l&&(h[a]=h[l],u[a]=u[l]),h.pop(),u.pop(),--i.pointCount,null!==n&&ht(n)<=i.maxPoints&&n.merge();break}return r}!function(r){n(a,nt);function a(i,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:8,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:8;t(this,a);var h=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this));return h.root=new rt(i,e),h.bias=Math.max(0,n),h.maxPoints=Math.max(1,Math.round(r)),h.maxDepth=Math.max(0,Math.round(o)),h.pointCount=0,h}i(a,[{key:\"countPoints\",value:function(t){return ht(t)}},{key:\"put\",value:function(t,i){return ut(t,i,this,this.root,0)}},{key:\"remove\",value:function(t){return lt(t,this,this.root,null)}},{key:\"fetch\",value:function(t){return function t(i,e,n){var s=n.children,r=null,a=void 0,o=void 0,h=void 0;if(n.contains(i,e.bias))if(null!==s)for(a=0,o=s.length;null===r&&a<o;++a)r=t(i,e,s[a]);else for(a=0,o=(h=n.points).length;null===r&&a<o;++a)i.distanceToSquared(h[a])<=ot&&(r=n.data[a]);return r}(t,this,this.root)}},{key:\"move\",value:function(t,i){return function t(i,e,n,s,r,a){var o=s.children,h=null,u=void 0,l=void 0,c=void 0;if(s.contains(i,n.bias))if(s.contains(e,n.bias)){if(null!==o)for(++a,u=0,l=o.length;null===h&&u<l;++u)h=t(i,e,n,o[u],s,a);else for(u=0,l=(c=s.points).length;u<l;++u)if(i.distanceToSquared(c[u])<=ot){c[u].copy(e),h=s.data[u];break}}else ut(e,h=lt(i,n,s,r),n,r,a-1);return h}(t,i,this,this.root,null,0)}},{key:\"findNearestPoint\",value:function(t){return function t(i,e,n,s){var r=s.points,a=s.children,o=null,h=e,u=void 0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0;if(null!==a)for(u=0,l=(v=a.map(function(t){return{octant:t,distance:t.distanceToCenterSquared(i)}}).sort(function(t,i){return t.distance-i.distance})).length;u<l;++u)(d=v[u].octant).contains(i,h)&&null!==(f=t(i,h,n,d))&&(y=f.point.distanceToSquared(i),(!n||y>0)&&y<h&&(h=y,o=f));else if(null!==r)for(u=0,l=r.length;u<l;++u)c=r[u],y=i.distanceToSquared(c),(!n||y>0)&&y<h&&(h=y,o={point:c.clone(),data:s.data[u]});return o}(t,arguments.length>1&&void 0!==arguments[1]?arguments[1]:1/0,arguments.length>2&&void 0!==arguments[2]&&arguments[2],this.root)}},{key:\"findPoints\",value:function(t,i){var e=[];return function t(i,e,n,s,r){var a=s.points,o=s.children,h=e*e,u=void 0,l=void 0,c=void 0,y=void 0,v=void 0;if(null!==o)for(u=0,l=o.length;u<l;++u)(v=o[u]).contains(i,e)&&t(i,e,n,v,r);else if(null!==a)for(u=0,l=a.length;u<l;++u)c=a[u],y=i.distanceToSquared(c),(!n||y>0)&&y<=h&&r.push({point:c.clone(),data:s.data[u]})}(t,i,arguments.length>2&&void 0!==arguments[2]&&arguments[2],this.root,e),e}},{key:\"raycast\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"raycast\",this).call(this,t);return n.length>0&&this.testPoints(n,t,i),i}},{key:\"testPoints\",value:function(t,i,e){var n=i.params.Points.threshold,s=n*n,r=void 0,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0;for(u=0,c=t.length;u<c;++u)if(null!==(d=(v=t[u]).points))for(l=0,y=d.length;l<y;++l)f=d[l],(h=i.ray.distanceSqToPoint(f))<s&&(r=i.ray.closestPointToPoint(f),(a=i.ray.origin.distanceTo(r))>=i.near&&a<=i.far&&(o=Math.sqrt(h),e.push(new at(a,o,r,v.data[l]))))}}])}();var ct=new u,yt=new o,vt=new o,dt=new o,ft=(function(){function e(){t(this,e)}i(e,null,[{key:\"recycleOctants\",value:function(t,i){var e=t.min,n=t.getCenter(vt),s=t.getDimensions(dt).multiplyScalar(.5),r=t.children,a=i.length,o=void 0,h=void 0,u=void 0,l=void 0;for(o=0;o<8;++o)for(u=j[o],ct.min.addVectors(e,yt.fromArray(u).multiply(s)),ct.max.addVectors(n,yt.fromArray(u).multiply(s)),h=0;h<a;++h)if(null!==(l=i[h])&&ct.min.equals(l.min)&&ct.max.equals(l.max)){r[o]=l,i[h]=null;break}}}])}(),new o),mt=new o,xt=new o,pt=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o;t(this,e),this.a=i,this.b=n,this.index=-1,this.coordinates=new o,this.t=0,this.n=new o}return i(e,[{key:\"approximateZeroCrossing\",value:function(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,e=Math.max(1,i-1),n=0,s=1,r=0,a=0,o=void 0,h=void 0;for(ft.subVectors(this.b,this.a);a<=e&&(r=(n+s)/2,mt.addVectors(this.a,xt.copy(ft).multiplyScalar(r)),h=t.sample(mt),!(Math.abs(h)<=1e-4||(s-n)/2<=1e-6));)mt.addVectors(this.a,xt.copy(ft).multiplyScalar(n)),o=t.sample(mt),Math.sign(h)===Math.sign(o)?n=r:s=r,++a;this.t=r}},{key:\"computeZeroCrossingPosition\",value:function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:new o).subVectors(this.b,this.a).multiplyScalar(this.t).add(this.a)}},{key:\"computeSurfaceNormal\",value:function(t){var i=this.computeZeroCrossingPosition(ft),e=t.sample(mt.addVectors(i,xt.set(.001,0,0)))-t.sample(mt.subVectors(i,xt.set(.001,0,0))),n=t.sample(mt.addVectors(i,xt.set(0,.001,0)))-t.sample(mt.subVectors(i,xt.set(0,.001,0))),s=t.sample(mt.addVectors(i,xt.set(0,0,.001)))-t.sample(mt.subVectors(i,xt.set(0,0,.001)));this.n.set(e,n,s).normalize()}}]),e}(),kt=new pt,gt=new o,wt=new o,zt=function(){function e(i,n,s){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:3;t(this,e),this.edgeData=i,this.cellPosition=n,this.cellSize=s,this.indices=null,this.zeroCrossings=null,this.normals=null,this.axes=null,this.lengths=null,this.result=new B,this.initialC=r,this.c=r,this.initialD=a,this.d=a,this.i=0,this.l=0,this.reset()}return i(e,[{key:\"reset\",value:function(){var t=this.edgeData,i=[],e=[],n=[],s=[],r=[],a=void 0,o=void 0,h=void 0,u=void 0;for(this.i=0,this.c=0,this.d=0,a=4>>(o=this.initialC),h=this.initialD;o<h;++o,a>>=1)(u=t.indices[o].length)>0&&(i.push(t.indices[o]),e.push(t.zeroCrossings[o]),n.push(t.normals[o]),s.push(j[a]),r.push(u),++this.d);return this.l=r.length>0?r[0]:0,this.indices=i,this.zeroCrossings=e,this.normals=n,this.axes=s,this.lengths=r,this.result.reset(),this}},{key:\"next\",value:function(){var t=this.cellSize,i=Pt.resolution,e=i+1,n=e*e,s=this.result,r=this.cellPosition,a=void 0,o=void 0,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0;return this.i===this.l&&(this.l=++this.c<this.d?this.lengths[this.c]:0,this.i=0),this.i<this.l?(c=this.c,y=this.i,a=this.axes[c],o=this.indices[c][y],kt.index=o,h=o%e,u=Math.trunc(o%n/e),l=Math.trunc(o/n),kt.coordinates.set(h,u,l),gt.set(h*t/i,u*t/i,l*t/i),wt.set((h+a[0])*t/i,(u+a[1])*t/i,(l+a[2])*t/i),kt.a.addVectors(r,gt),kt.b.addVectors(r,wt),kt.t=this.zeroCrossings[c][y],kt.n.fromArray(this.normals[c],3*y),s.value=kt,++this.i):(s.value=null,s.done=!0),s}},{key:\"return\",value:function(t){return this.result.value=t,this.result.done=!0,this.result}},{key:Symbol.iterator,value:function(){return this}}]),e}(),Mt=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i;t(this,e),this.indices=i<=0?null:[new Uint32Array(i),new Uint32Array(n),new Uint32Array(s)],this.zeroCrossings=i<=0?null:[new Float32Array(i),new Float32Array(n),new Float32Array(s)],this.normals=i<=0?null:[new Float32Array(3*i),new Float32Array(3*n),new Float32Array(3*s)]}return i(e,[{key:\"serialize\",value:function(){return{edges:this.edges,zeroCrossings:this.zeroCrossings,normals:this.normals}}},{key:\"deserialize\",value:function(t){var i=this;return null!==t?(this.edges=t.edges,this.zeroCrossings=t.zeroCrossings,this.normals=t.normals):i=null,i}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=[this.edges[0],this.edges[1],this.edges[2],this.zeroCrossings[0],this.zeroCrossings[1],this.zeroCrossings[2],this.normals[0],this.normals[1],this.normals[2]],e=void 0,n=void 0,s=void 0;for(n=0,s=i.length;n<s;++n)null!==(e=i[n])&&t.push(e.buffer);return t}},{key:\"edges\",value:function(t,i){return new zt(this,t,i)}},{key:\"edgesX\",value:function(t,i){return new zt(this,t,i,0,1)}},{key:\"edgesY\",value:function(t,i){return new zt(this,t,i,1,2)}},{key:\"edgesZ\",value:function(t,i){return new zt(this,t,i,2,3)}}],[{key:\"calculate1DEdgeCount\",value:function(t){return Math.pow(t+1,2)*t}}]),e}(),bt={AIR:0,SOLID:1},At=0,St=0;var Pt=function(){function e(){var i=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];t(this,e),this.materials=0,this.materialIndices=i?new Uint8Array(St):null,this.runLengths=null,this.edgeData=null}return i(e,[{key:\"set\",value:function(t){return this.materials=t.materials,this.materialIndices=t.materialIndices,this.runLengths=t.runLengths,this.edgeData=t.edgeData,this}},{key:\"clear\",value:function(){return this.materials=0,this.materialIndices=null,this.runLengths=null,this.edgeData=null,this}},{key:\"setMaterialIndex\",value:function(t,i){this.materialIndices[t]===bt.AIR?i!==bt.AIR&&++this.materials:i===bt.AIR&&--this.materials,this.materialIndices[t]=i}},{key:\"compress\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this,i=void 0;return this.compressed?(t.materialIndices=this.materialIndices,t.runLengths=this.runLengths):(i=this.full?new a([this.materialIndices.length],[bt.SOLID]):a.encode(this.materialIndices),t.materialIndices=new Uint8Array(i.data),t.runLengths=new Uint32Array(i.runLengths)),t.materials=this.materials,t}},{key:\"decompress\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this;return t.materialIndices=this.compressed?a.decode(this.runLengths,this.materialIndices,new Uint8Array(St)):this.materialIndices,t.runLengths=null,t.materials=this.materials,t}},{key:\"serialize\",value:function(){return{materials:this.materials,materialIndices:this.materialIndices,runLengths:this.runLengths,edgeData:null!==this.edgeData?this.edgeData.serialize():null}}},{key:\"deserialize\",value:function(t){var i=this;return null!==t?(this.materials=t.materials,this.materialIndices=t.materialIndices,this.runLengths=t.runLengths,null!==t.edgeData?(null===this.edgeData&&(this.edgeData=new Mt),this.edgeData.deserialize(t.edgeData)):this.edgeData=null):i=null,i}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return null!==this.edgeData&&this.edgeData.createTransferList(t),null!==this.materialIndices&&t.push(this.materialIndices.buffer),null!==this.runLengths&&t.push(this.runLengths.buffer),t}},{key:\"empty\",get:function(){return 0===this.materials}},{key:\"full\",get:function(){return this.materials===St}},{key:\"compressed\",get:function(){return null!==this.runLengths}},{key:\"neutered\",get:function(){return!this.empty&&null===this.materialIndices}}],[{key:\"resolution\",get:function(){return At},set:function(t){At=Math.max(1,Math.min(256,(i=t,Math.pow(2,Math.max(0,Math.ceil(Math.log2(i)))))));var i;St=Math.pow(At+1,3)}}]),e}(),It=function(){function e(){t(this,e),this.ata=new V,this.ata.set(0,0,0,0,0,0),this.atb=new o,this.massPointSum=new o,this.numPoints=0}return i(e,[{key:\"set\",value:function(t,i,e,n){return this.ata.copy(t),this.atb.copy(i),this.massPointSum.copy(e),this.numPoints=n,this}},{key:\"copy\",value:function(t){return this.set(t.ata,t.atb,t.massPointSum,t.numPoints)}},{key:\"add\",value:function(t,i){var e=i.x,n=i.y,s=i.z,r=t.dot(i),a=this.ata.elements,o=this.atb;a[0]+=e*e,a[1]+=e*n,a[3]+=n*n,a[2]+=e*s,a[4]+=n*s,a[5]+=s*s,o.x+=r*e,o.y+=r*n,o.z+=r*s,this.massPointSum.add(t),++this.numPoints}},{key:\"addData\",value:function(t){this.ata.add(t.ata),this.atb.add(t.atb),this.massPointSum.add(t.massPointSum),this.numPoints+=t.numPoints}},{key:\"clear\",value:function(){this.ata.set(0,0,0,0,0,0),this.atb.set(0,0,0),this.massPointSum.set(0,0,0),this.numPoints=0}},{key:\"clone\",value:function(){return(new this.constructor).copy(this)}}]),e}(),Tt=new y,_t=function(){function e(){t(this,e)}return i(e,null,[{key:\"calculateCoefficients\",value:function(t,i,e){var n=void 0,s=void 0,r=void 0;return 0===i?(Tt.x=1,Tt.y=0):(n=(e-t)/(2*i),s=Math.sqrt(1+n*n),r=1/(n>=0?n+s:n-s),Tt.x=1/Math.sqrt(1+r*r),Tt.y=r*Tt.x),Tt}}]),e}(),Ct=function(){function e(){t(this,e)}return i(e,null,[{key:\"rotateXY\",value:function(t,i){var e=i.x,n=i.y,s=t.x,r=t.y;t.set(e*s-n*r,n*s+e*r)}},{key:\"rotateQXY\",value:function(t,i,e){var n=e.x,s=e.y,r=n*n,a=s*s,o=2*n*s*i,h=t.x,u=t.y;t.set(r*h-o+a*u,a*h+o+r*u)}}]),e}(),Ot=.1,Ut=5,Ft=new V,qt=new d,Et=new y,Dt=new o;function Vt(t,i){var e=t.elements,n=i.elements,s=void 0;0!==e[1]&&(s=_t.calculateCoefficients(e[0],e[1],e[3]),Ct.rotateQXY(Et.set(e[0],e[3]),e[1],s),e[0]=Et.x,e[3]=Et.y,Ct.rotateXY(Et.set(e[2],e[4]),s),e[2]=Et.x,e[4]=Et.y,e[1]=0,Ct.rotateXY(Et.set(n[0],n[3]),s),n[0]=Et.x,n[3]=Et.y,Ct.rotateXY(Et.set(n[1],n[4]),s),n[1]=Et.x,n[4]=Et.y,Ct.rotateXY(Et.set(n[2],n[5]),s),n[2]=Et.x,n[5]=Et.y)}function Nt(t,i){var e=t.elements,n=i.elements,s=void 0;0!==e[2]&&(s=_t.calculateCoefficients(e[0],e[2],e[5]),Ct.rotateQXY(Et.set(e[0],e[5]),e[2],s),e[0]=Et.x,e[5]=Et.y,Ct.rotateXY(Et.set(e[1],e[4]),s),e[1]=Et.x,e[4]=Et.y,e[2]=0,Ct.rotateXY(Et.set(n[0],n[6]),s),n[0]=Et.x,n[6]=Et.y,Ct.rotateXY(Et.set(n[1],n[7]),s),n[1]=Et.x,n[7]=Et.y,Ct.rotateXY(Et.set(n[2],n[8]),s),n[2]=Et.x,n[8]=Et.y)}function Bt(t,i){var e=t.elements,n=i.elements,s=void 0;0!==e[4]&&(s=_t.calculateCoefficients(e[3],e[4],e[5]),Ct.rotateQXY(Et.set(e[3],e[5]),e[4],s),e[3]=Et.x,e[5]=Et.y,Ct.rotateXY(Et.set(e[1],e[2]),s),e[1]=Et.x,e[2]=Et.y,e[4]=0,Ct.rotateXY(Et.set(n[3],n[6]),s),n[3]=Et.x,n[6]=Et.y,Ct.rotateXY(Et.set(n[4],n[7]),s),n[4]=Et.x,n[7]=Et.y,Ct.rotateXY(Et.set(n[5],n[8]),s),n[5]=Et.x,n[8]=Et.y)}function Lt(t){var i=Math.abs(t)<Ot?0:1/t;return Math.abs(i)<Ot?0:i}var Rt=function(){function e(){t(this,e)}return i(e,null,[{key:\"solve\",value:function(t,i,e){var n=function(t,i){var e=t.elements,n=void 0;for(n=0;n<Ut;++n)Vt(t,i),Nt(t,i),Bt(t,i);return Dt.set(e[0],e[3],e[5])}(Ft.copy(t),qt.identity()),s=function(t,i){var e=t.elements,n=e[0],s=e[3],r=e[6],a=e[1],o=e[4],h=e[7],u=e[2],l=e[5],c=e[8],y=Lt(i.x),v=Lt(i.y),d=Lt(i.z);return t.set(n*y*n+s*v*s+r*d*r,n*y*a+s*v*o+r*d*h,n*y*u+s*v*l+r*d*c,a*y*n+o*v*s+h*d*r,a*y*a+o*v*o+h*d*h,a*y*u+o*v*l+h*d*c,u*y*n+l*v*s+c*d*r,u*y*a+l*v*o+c*d*h,u*y*u+l*v*l+c*d*c)}(qt,n);e.copy(i).applyMatrix3(s)}}]),e}(),jt=new o;var Yt=function(){function e(){t(this,e),this.data=null,this.ata=new V,this.atb=new o,this.massPoint=new o,this.hasSolution=!1}return i(e,[{key:\"setData\",value:function(t){return this.data=t,this.hasSolution=!1,this}},{key:\"solve\",value:function(t){var i=this.data,e=this.massPoint,n=this.ata.copy(i.ata),s=this.atb.copy(i.atb),r=1/0;!this.hasSolution&&null!==i&&i.numPoints>0&&(jt.copy(i.massPointSum).divideScalar(i.numPoints),e.copy(jt),n.applyToVector3(jt),s.sub(jt),Rt.solve(n,s,t),a=s,o=t,n.applyToVector3(jt.copy(o)),jt.subVectors(a,jt),r=jt.dot(jt),t.add(e),this.hasSolution=!0);var a,o;return r}}]),e}(),Xt=function i(){t(this,i),this.materials=0,this.edgeCount=0,this.index=-1,this.position=new o,this.normal=new o,this.qefData=null},Qt=new Yt,Zt=-1,Gt=function(e){n(r,Q);function r(i,e){t(this,r);var n=s(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,i,e));return n.voxel=null,n}return i(r,[{key:\"contains\",value:function(t){var i=this.min,e=this.size;return t.x>=i.x-.1&&t.y>=i.y-.1&&t.z>=i.z-.1&&t.x<=i.x+e+.1&&t.y<=i.y+e+.1&&t.z<=i.z+e+.1}},{key:\"collapse\",value:function(){var t=this.children,i=[-1,-1,-1,-1,-1,-1,-1,-1],e=new o,n=-1,s=null!==t,r=0,a=void 0,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0;if(s){for(l=new It,c=0,y=0;y<8;++y)r+=(a=t[y]).collapse(),u=a.voxel,null!==a.children?s=!1:null!==u&&(l.addData(u.qefData),n=u.materials>>7-y&1,i[y]=u.materials>>y&1,++c);if(s&&Qt.setData(l).solve(e)<=Zt){for((u=new Xt).position.copy(this.contains(e)?e:Qt.massPoint),y=0;y<8;++y)h=i[y],a=t[y],-1===h?u.materials|=n<<y:(u.materials|=h<<y,u.normal.add(a.voxel.normal));u.normal.normalize(),u.qefData=l,this.voxel=u,this.children=null,r+=c-1}}return r}}],[{key:\"errorThreshold\",get:function(){return Zt},set:function(t){Zt=t}}]),r}(),Ht=function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;t(this,i),this.action=e,this.error=null},Jt=function(){function e(i,n,s,r,a){t(this,e),this.indices=i,this.positions=n,this.normals=s,this.uvs=r,this.materials=a}return i(e,[{key:\"serialize\",value:function(){return{indices:this.indices,positions:this.positions,normals:this.normals,uvs:this.uvs,materials:this.materials}}},{key:\"deserialize\",value:function(t){var i=this;return null!==t?(this.indices=t.indices,this.positions=t.positions,this.normals=t.normals,this.uvs=t.uvs,this.materials=t.materials):i=null,i}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return t.push(this.indices.buffer),t.push(this.positions.buffer),t.push(this.normals.buffer),t.push(this.uvs.buffer),t.push(this.materials.buffer),t}}]),e}(),Kt=[new Uint8Array([0,4,0]),new Uint8Array([1,5,0]),new Uint8Array([2,6,0]),new Uint8Array([3,7,0]),new Uint8Array([0,2,1]),new Uint8Array([4,6,1]),new Uint8Array([1,3,1]),new Uint8Array([5,7,1]),new Uint8Array([0,1,2]),new Uint8Array([2,3,2]),new Uint8Array([4,5,2]),new Uint8Array([6,7,2])],Wt=[new Uint8Array([0,1,2,3,0]),new Uint8Array([4,5,6,7,0]),new Uint8Array([0,4,1,5,1]),new Uint8Array([2,6,3,7,1]),new Uint8Array([0,2,4,6,2]),new Uint8Array([1,3,5,7,2])],$t=[[new Uint8Array([4,0,0]),new Uint8Array([5,1,0]),new Uint8Array([6,2,0]),new Uint8Array([7,3,0])],[new Uint8Array([2,0,1]),new Uint8Array([6,4,1]),new Uint8Array([3,1,1]),new Uint8Array([7,5,1])],[new Uint8Array([1,0,2]),new Uint8Array([3,2,2]),new Uint8Array([5,4,2]),new Uint8Array([7,6,2])]],ti=[[new Uint8Array([1,4,0,5,1,1]),new Uint8Array([1,6,2,7,3,1]),new Uint8Array([0,4,6,0,2,2]),new Uint8Array([0,5,7,1,3,2])],[new Uint8Array([0,2,3,0,1,0]),new Uint8Array([0,6,7,4,5,0]),new Uint8Array([1,2,0,6,4,2]),new Uint8Array([1,3,1,7,5,2])],[new Uint8Array([1,1,0,3,2,0]),new Uint8Array([1,5,4,7,6,0]),new Uint8Array([0,1,5,0,4,1]),new Uint8Array([0,3,7,2,6,1])]],ii=[[new Uint8Array([3,2,1,0,0]),new Uint8Array([7,6,5,4,0])],[new Uint8Array([5,1,4,0,1]),new Uint8Array([7,3,6,2,1])],[new Uint8Array([6,4,2,0,2]),new Uint8Array([7,5,3,1,2])]],ei=[new Uint8Array([3,2,1,0]),new Uint8Array([7,5,6,4]),new Uint8Array([11,10,9,8])],ni=Math.pow(2,16)-1;function si(t,i,e){var n=[0,0,0,0],s=void 0,r=void 0,a=void 0,o=void 0;if(null!==t[0].voxel&&null!==t[1].voxel&&null!==t[2].voxel&&null!==t[3].voxel)!function(t,i,e){var n=[-1,-1,-1,-1],s=[!1,!1,!1,!1],r=1/0,a=0,o=!1,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0;for(d=0;d<4;++d)y=t[d],v=ei[i][d],h=Y[v][0],u=Y[v][1],l=y.voxel.materials>>h&1,c=y.voxel.materials>>u&1,y.size<r&&(r=y.size,a=d,o=l!==bt.AIR),n[d]=y.voxel.index,s[d]=l!==c;s[a]&&(o?(e.push(n[0]),e.push(n[3]),e.push(n[1]),e.push(n[0]),e.push(n[2]),e.push(n[3])):(e.push(n[0]),e.push(n[1]),e.push(n[3]),e.push(n[0]),e.push(n[3]),e.push(n[2])))}(t,i,e);else for(a=0;a<2;++a){for(n[0]=ii[i][a][0],n[1]=ii[i][a][1],n[2]=ii[i][a][2],n[3]=ii[i][a][3],s=[],o=0;o<4;++o)if(null!==(r=t[o]).voxel)s[o]=r;else{if(null===r.children)break;s[o]=r.children[n[o]]}4===o&&si(s,ii[i][a][4],e)}}function ri(t,i,e){var n=[0,0,0,0],s=[[0,0,1,1],[0,1,0,1]],r=void 0,a=void 0,o=void 0,h=void 0,u=void 0;if(null!==t[0].children||null!==t[1].children){for(h=0;h<4;++h)n[0]=$t[i][h][0],n[1]=$t[i][h][1],ri([null===t[0].children?t[0]:t[0].children[n[0]],null===t[1].children?t[1]:t[1].children[n[1]]],$t[i][h][2],e);for(h=0;h<4;++h){for(n[0]=ti[i][h][1],n[1]=ti[i][h][2],n[2]=ti[i][h][3],n[3]=ti[i][h][4],a=s[ti[i][h][0]],r=[],u=0;u<4;++u)if(null!==(o=t[a[u]]).voxel)r[u]=o;else{if(null===o.children)break;r[u]=o.children[n[u]]}4===u&&si(r,ti[i][h][5],e)}}}var ai=function(){function e(){t(this,e)}return i(e,null,[{key:\"run\",value:function(t){var i=[],e=t.voxelCount,n=null,s=null,r=null,a=null,o=null;return e>ni?console.warn(\"Could not create geometry for cell at position\",t.min,\"(vertex count of\",e,\"exceeds limit of \",ni,\")\"):e>0&&(s=new Float32Array(3*e),r=new Float32Array(3*e),a=new Float32Array(2*e),o=new Uint8Array(e),function t(i,e,n,s){var r=void 0,a=void 0;if(null!==i.children)for(r=0;r<8;++r)s=t(i.children[r],e,n,s);else null!==i.voxel&&((a=i.voxel).index=s,e[3*s]=a.position.x,e[3*s+1]=a.position.y,e[3*s+2]=a.position.z,n[3*s]=a.normal.x,n[3*s+1]=a.normal.y,n[3*s+2]=a.normal.z,++s);return s}(t.root,s,r,0),function t(i,e){var n=i.children,s=[0,0,0,0],r=void 0;if(null!==n){for(r=0;r<8;++r)t(n[r],e);for(r=0;r<12;++r)s[0]=Kt[r][0],s[1]=Kt[r][1],ri([n[s[0]],n[s[1]]],Kt[r][2],e);for(r=0;r<6;++r)s[0]=Wt[r][0],s[1]=Wt[r][1],s[2]=Wt[r][2],s[3]=Wt[r][3],si([n[s[0]],n[s[1]],n[s[2]],n[s[3]]],Wt[r][4],e)}}(t.root,i),n=new Jt(new Uint16Array(i),s,r,a,o)),n}}]),e}();function oi(t,i,e,n,s){var r=0;for(i>>=1;i>0;i>>=1,r=0)e>=i&&(r+=4,e-=i),n>=i&&(r+=2,n-=i),s>=i&&(r+=1,s-=i),null===t.children&&t.split(),t=t.children[r];return t}function hi(t,i,e,n,s){var r=t+1,a=r*r,o=new Xt,h=void 0,u=void 0,l=void 0,c=void 0,y=void 0;for(h=0,y=0;y<8;++y)c=(n+(l=j[y])[2])*a+(e+l[1])*r+(i+l[0]),h|=Math.min(s[c],bt.SOLID)<<y;for(u=0,y=0;y<12;++y)(h>>Y[y][0]&1)!==(h>>Y[y][1]&1)&&++u;return o.materials=h,o.edgeCount=u,o.qefData=new It,o}var ui=function(e){n(r,nt);function r(i){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new o,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;t(this,r);var a=s(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return a.root=new Gt(e,n),a.voxelCount=0,null!==i&&null!==i.edgeData&&a.construct(i),Gt.errorThreshold>=0&&a.simplify(),a}return i(r,[{key:\"simplify\",value:function(){this.voxelCount-=this.root.collapse()}},{key:\"construct\",value:function(t){var i=Pt.resolution,e=t.edgeData,n=t.materialIndices,s=new Yt,r=new o,a=[e.edgesX(this.min,this.root.size),e.edgesY(this.min,this.root.size),e.edgesZ(this.min,this.root.size)],h=[new Uint8Array([0,1,2,3]),new Uint8Array([0,1,4,5]),new Uint8Array([0,2,4,6])],u=0,l=void 0,c=void 0,y=void 0,v=void 0,d=void 0,f=void 0,m=void 0,x=void 0,p=void 0,k=void 0,g=void 0;for(k=0;k<3;++k){y=h[k],l=a[k];var w=!0,z=!1,M=void 0;try{for(var b,A=l[Symbol.iterator]();!(w=(b=A.next()).done);w=!0)for((c=b.value).computeZeroCrossingPosition(r),g=0;g<4;++g)v=j[y[g]],m=c.coordinates.x-v[0],x=c.coordinates.y-v[1],p=c.coordinates.z-v[2],m>=0&&x>=0&&p>=0&&m<i&&x<i&&p<i&&(null===(d=oi(this.root,i,m,x,p)).voxel&&(d.voxel=hi(i,m,x,p,n),++u),(f=d.voxel).normal.add(c.n),f.qefData.add(r,c.n),f.qefData.numPoints===f.edgeCount&&(s.setData(f.qefData).solve(f.position),d.contains(f.position)||f.position.copy(s.massPoint),f.normal.normalize()))}catch(t){z=!0,M=t}finally{try{!w&&A.return&&A.return()}finally{if(z)throw M}}}this.voxelCount=u}}]),r}(),li={EXTRACT:\"worker.extract\",MODIFY:\"worker.modify\",CONFIGURE:\"worker.config\",CLOSE:\"worker.close\"},ci=function(i){n(e,Ht);function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;t(this,e);var n=s(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i));return n.data=null,n}return e}(),yi=function(i){n(e,ci);function e(){t(this,e);var i=s(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,li.EXTRACT));return i.isosurface=null,i}return e}(),vi=new Pt(!1),di=function(){function e(){t(this,e),this.data=null,this.response=null}return i(e,[{key:\"getData\",value:function(){return this.data}},{key:\"respond\",value:function(){return this.response.data=this.data.serialize(),this.response}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return null!==this.data&&this.data.createTransferList(t),t}},{key:\"process\",value:function(t){return this.data=vi.deserialize(t.data),this}}]),e}(),fi=function(r){n(a,di);function a(){t(this,a);var i=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this));return i.response=new yi,i.decompressionTarget=new Pt(!1),i.isosurface=null,i}return i(a,[{key:\"respond\",value:function(){var t=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"respond\",this).call(this);return t.isosurface=null!==this.isosurface?this.isosurface.serialise():null,t}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"createTransferList\",this).call(this,t),null!==this.isosurface?this.isosurface.createTransferList(t):t}},{key:\"process\",value:function(t){var i=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"process\",this).call(this,t).getData(),n=new ui(i.decompress(this.decompressionTarget));return this.isosurface=ai.run(n),this.decompressionTarget.clear(),this}}]),a}(),mi={UNION:\"csg.union\",DIFFERENCE:\"csg.difference\",INTERSECTION:\"csg.intersection\",DENSITY_FUNCTION:\"csg.densityfunction\"},xi=function(){function e(i){t(this,e),this.type=i;for(var n=arguments.length,s=Array(n>1?n-1:0),r=1;r<n;r++)s[r-1]=arguments[r];this.children=s,this.bbox=null}return i(e,[{key:\"computeBoundingBox\",value:function(){var t=this.children,i=void 0,e=void 0;for(this.bbox=new u,i=0,e=t.length;i<e;++i)this.bbox.union(t[i].boundingBox);return this.bbox}},{key:\"boundingBox\",get:function(){return null!==this.bbox?this.bbox:this.computeBoundingBox()}}]),e}(),pi=function(e){n(r,xi);function r(){var i;t(this,r);for(var e=arguments.length,n=Array(e),a=0;a<e;a++)n[a]=arguments[a];return s(this,(i=r.__proto__||Object.getPrototypeOf(r)).call.apply(i,[this,mi.UNION].concat(n)))}return i(r,[{key:\"updateMaterialIndex\",value:function(t,i,e){var n=e.materialIndices[t];n!==bt.AIR&&i.setMaterialIndex(t,n)}},{key:\"selectEdge\",value:function(t,i,e){return e?t.t>i.t?t:i:t.t<i.t?t:i}}]),r}(),ki=function(e){n(r,xi);function r(){var i;t(this,r);for(var e=arguments.length,n=Array(e),a=0;a<e;a++)n[a]=arguments[a];return s(this,(i=r.__proto__||Object.getPrototypeOf(r)).call.apply(i,[this,mi.DIFFERENCE].concat(n)))}return i(r,[{key:\"updateMaterialIndex\",value:function(t,i,e){e.materialIndices[t]!==bt.AIR&&i.setMaterialIndex(t,bt.AIR)}},{key:\"selectEdge\",value:function(t,i,e){return e?t.t<i.t?t:i:t.t>i.t?t:i}}]),r}(),gi=function(e){n(r,xi);function r(){var i;t(this,r);for(var e=arguments.length,n=Array(e),a=0;a<e;a++)n[a]=arguments[a];return s(this,(i=r.__proto__||Object.getPrototypeOf(r)).call.apply(i,[this,mi.INTERSECTION].concat(n)))}return i(r,[{key:\"updateMaterialIndex\",value:function(t,i,e){var n=e.materialIndices[t];i.setMaterialIndex(t,i.materialIndices[t]!==bt.AIR&&n!==bt.AIR?n:bt.AIR)}},{key:\"selectEdge\",value:function(t,i,e){return e?t.t<i.t?t:i:t.t>i.t?t:i}}]),r}(),wi=0,zi=new o;function Mi(t,i,e){var n=function(t){var i=wi,e=Pt.resolution,n=new o(0,0,0),s=new o(e,e,e),r=new u(zi,zi.clone().addScalar(wi));return t.type!==mi.INTERSECTION&&(t.boundingBox.intersectsBox(r)?(n.copy(t.boundingBox.min).max(r.min).sub(r.min),n.x=Math.ceil(n.x*e/i),n.y=Math.ceil(n.y*e/i),n.z=Math.ceil(n.z*e/i),s.copy(t.boundingBox.max).min(r.max).sub(r.min),s.x=Math.floor(s.x*e/i),s.y=Math.floor(s.y*e/i),s.z=Math.floor(s.z*e/i)):(n.set(e,e,e),s.set(0,0,0))),new u(n,s)}(t),s=void 0,r=void 0,a=void 0,h=void 0,l=!1;if(t.type===mi.DENSITY_FUNCTION?function(t,i,e){var n=wi,s=Pt.resolution,r=s+1,a=r*r,h=i.materialIndices,u=zi,l=new o,c=new o,y=e.max.x,v=e.max.y,d=e.max.z,f=void 0,m=0,x=void 0,p=void 0,k=void 0;for(k=e.min.z;k<=d;++k)for(l.z=k*n/s,p=e.min.y;p<=v;++p)for(l.y=p*n/s,x=e.min.x;x<=y;++x)l.x=x*n/s,(f=t.generateMaterialIndex(c.addVectors(u,l)))!==bt.AIR&&(h[k*a+p*r+x]=f,++m);i.materials=m}(t,i,n):i.empty?t.type===mi.UNION&&(i.set(e),l=!0):i.full&&t.type===mi.UNION||function(t,i,e,n){var s=Pt.resolution+1,r=s*s,a=n.max.x,o=n.max.y,h=n.max.z,u=void 0,l=void 0,c=void 0;for(c=n.min.z;c<=h;++c)for(l=n.min.y;l<=o;++l)for(u=n.min.x;u<=a;++u)t.updateMaterialIndex(c*r+l*s+u,i,e)}(t,i,e,n),!l&&!i.empty&&!i.full){for(r=(s=t.type===mi.DENSITY_FUNCTION?function(t,i,e){var n=wi,s=Pt.resolution,r=s+1,a=r*r,h=new Uint32Array([1,r,a]),u=i.materialIndices,l=zi,c=new o,y=new o,v=new pt,d=new Uint32Array(3),f=new Mt(Mt.calculate1DEdgeCount(s)),m=void 0,x=void 0,p=void 0,k=void 0,g=void 0,w=void 0,z=void 0,M=void 0,b=void 0,A=void 0,S=void 0,P=void 0,I=void 0,T=void 0,_=void 0,C=void 0,O=void 0,U=void 0,F=void 0;for(_=4,I=0,T=0;T<3;_>>=1,I=0,++T){switch(C=j[_],m=f.indices[T],x=f.zeroCrossings[T],p=f.normals[T],k=h[T],z=e.min.x,A=e.max.x,M=e.min.y,S=e.max.y,b=e.min.z,P=e.max.z,T){case 0:z=Math.max(z-1,0),A=Math.min(A,s-1);break;case 1:M=Math.max(M-1,0),S=Math.min(S,s-1);break;case 2:b=Math.max(b-1,0),P=Math.min(P,s-1)}for(F=b;F<=P;++F)for(U=M;U<=S;++U)for(O=z;O<=A;++O)w=(g=F*a+U*r+O)+k,u[g]!==u[w]&&(c.set(O*n/s,U*n/s,F*n/s),y.set((O+C[0])*n/s,(U+C[1])*n/s,(F+C[2])*n/s),v.a.addVectors(l,c),v.b.addVectors(l,y),t.generateEdge(v),m[I]=g,x[I]=v.t,p[3*I]=v.n.x,p[3*I+1]=v.n.y,p[3*I+2]=v.n.z,++I);d[T]=I}return{edgeData:f,lengths:d}}(t,i,n):function(t,i,e){var n=Pt.resolution,s=n+1,r=new Uint32Array([1,s,s*s]),a=i.materialIndices,o=new pt,h=new pt,u=e.edgeData,l=i.edgeData,c=new Uint32Array(3),y=Mt.calculate1DEdgeCount(n),v=new Mt(Math.min(y,l.indices[0].length+u.indices[0].length),Math.min(y,l.indices[1].length+u.indices[1].length),Math.min(y,l.indices[2].length+u.indices[2].length)),d=void 0,f=void 0,m=void 0,x=void 0,p=void 0,k=void 0,g=void 0,w=void 0,z=void 0,M=void 0,b=void 0,A=void 0,S=void 0,P=void 0,I=void 0,T=void 0,_=void 0,C=void 0,O=void 0,U=void 0,F=void 0,q=void 0,E=void 0;for(C=0,O=0;O<3;C=0,++O){for(d=u.indices[O],x=l.indices[O],g=v.indices[O],f=u.zeroCrossings[O],p=l.zeroCrossings[O],w=v.zeroCrossings[O],m=u.normals[O],k=l.normals[O],z=v.normals[O],M=r[O],q=d.length,E=x.length,U=0,F=0;U<q;++U)if(A=(b=d[U])+M,(I=a[b])!==(T=a[A])&&(I===bt.AIR||T===bt.AIR)){for(o.t=f[U],o.n.x=m[3*U],o.n.y=m[3*U+1],o.n.z=m[3*U+2],t.type===mi.DIFFERENCE&&o.n.negate(),_=o;F<E&&x[F]<=b;)P=(S=x[F])+M,h.t=p[F],h.n.x=k[3*F],h.n.y=k[3*F+1],h.n.z=k[3*F+2],I=a[S],S<b?I===(T=a[P])||I!==bt.AIR&&T!==bt.AIR||(g[C]=S,w[C]=h.t,z[3*C]=h.n.x,z[3*C+1]=h.n.y,z[3*C+2]=h.n.z,++C):_=t.selectEdge(h,o,I===bt.SOLID),++F;g[C]=b,w[C]=_.t,z[3*C]=_.n.x,z[3*C+1]=_.n.y,z[3*C+2]=_.n.z,++C}for(;F<E;)P=(S=x[F])+M,(I=a[S])===(T=a[P])||I!==bt.AIR&&T!==bt.AIR||(g[C]=S,w[C]=p[F],z[3*C]=k[3*F],z[3*C+1]=k[3*F+1],z[3*C+2]=k[3*F+2],++C),++F;c[O]=C}return{edgeData:v,lengths:c}}(t,i,e)).edgeData,a=s.lengths,h=0;h<3;++h)r.indices[h]=r.indices[h].slice(0,a[h]),r.zeroCrossings[h]=r.zeroCrossings[h].slice(0,a[h]),r.normals[h]=r.normals[h].slice(0,3*a[h]);i.edgeData=r}}var bi=function(){function e(){t(this,e)}return i(e,null,[{key:\"run\",value:function(t,i,e,n){zi.fromArray(t),wi=i,null===e?n.operation===mi.UNION&&(e=new Pt(!1)):e.decompress();var s=n.toCSG(),r=null!==e?function t(i){var e=i.children,n=void 0,s=void 0,r=void 0,a=void 0;for(i.type===mi.DENSITY_FUNCTION&&Mi(i,n=new Pt),r=0,a=e.length;r<a&&(s=t(e[r]),void 0===n?n=s:null!==s?null===n?i.type===mi.UNION&&(n=s):Mi(i,n,s):i.type===mi.INTERSECTION&&(n=null),null!==n||i.type===mi.UNION);++r);return null!==n&&n.empty?null:n}(s):null;if(null!==r){switch(n.operation){case mi.UNION:s=new pi(s);break;case mi.DIFFERENCE:s=new ki(s);break;case mi.INTERSECTION:s=new gi(s)}Mi(s,e,r),e.contoured=!1}return null!==e&&e.empty?null:e}}]),e}(),Ai=function(e){n(r,xi);function r(i){t(this,r);var e=s(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,mi.DENSITY_FUNCTION));return e.sdf=i,e}return i(r,[{key:\"computeBoundingBox\",value:function(){return this.bbox=this.sdf.computeBoundingBox(),this.bbox}},{key:\"generateMaterialIndex\",value:function(t){return this.sdf.sample(t)<=0?this.sdf.material:bt.AIR}},{key:\"generateEdge\",value:function(t){t.approximateZeroCrossing(this.sdf),t.computeSurfaceNormal(this.sdf)}}]),r}(),Si=function(){function e(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:bt.SOLID;t(this,e),this.type=i,this.operation=null,this.material=Math.min(255,Math.max(bt.SOLID,Math.trunc(n))),this.children=[],this.bbox=null}return i(e,[{key:\"setOperationType\",value:function(t){return this.operation=t,this}},{key:\"union\",value:function(t){return t.operation=mi.UNION,this.children.push(t),this}},{key:\"subtract\",value:function(t){return t.operation=mi.DIFFERENCE,this.children.push(t),this}},{key:\"intersect\",value:function(t){return t.operation=mi.INTERSECTION,this.children.push(t),this}},{key:\"toCSG\",value:function(){var t=this.children,i=new Ai(this),e=void 0,n=void 0,s=void 0,r=void 0;for(s=0,r=t.length;s<r;++s){if(e!==(n=t[s]).operation)switch(e=n.operation){case mi.UNION:i=new pi(i);break;case mi.DIFFERENCE:i=new ki(i);break;case mi.INTERSECTION:i=new gi(i)}i.children.push(n.toCSG())}return i}},{key:\"serialize\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i={type:this.type,operation:this.operation,material:this.material,parameters:null,children:[]},e=void 0,n=void 0;for(e=0,n=this.children.length;e<n;++e)i.children.push(this.children[e].serialize(t));return i}},{key:\"createTransferList\",value:function(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]}},{key:\"toJSON\",value:function(){return this.serialize(!0)}},{key:\"computeBoundingBox\",value:function(){throw new Error(\"SignedDistanceFunction#computeBoundingBox method not implemented!\")}},{key:\"sample\",value:function(t){throw new Error(\"SignedDistanceFunction#sample method not implemented!\")}},{key:\"boundingBox\",get:function(){return null!==this.bbox?this.bbox:this.computeBoundingBox()}},{key:\"completeBoundingBox\",get:function(){var t=this.children,i=this.boundingBox.clone(),e=void 0,n=void 0;for(e=0,n=t.length;e<n;++e)i.union(t[e].completeBoundingBox);return i}}]),e}(),Pi={HEIGHTFIELD:\"sdf.heightfield\",FRACTAL_NOISE:\"sdf.fractalnoise\",SUPER_PRIMITIVE:\"sdf.superprimitive\"},Ii=function(a){n(h,Si);function h(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments[1];t(this,h);var n=s(this,(h.__proto__||Object.getPrototypeOf(h)).call(this,Pi.PERLIN_NOISE,e));return n.min=new(Function.prototype.bind.apply(o,[null].concat(r(i.min)))),n.max=new(Function.prototype.bind.apply(o,[null].concat(r(i.max)))),n}return i(h,[{key:\"computeBoundingBox\",value:function(){return this.bbox=new u(this.min,this.max),this.bbox}},{key:\"sample\",value:function(t){}},{key:\"serialize\",value:function(){var t=e(h.prototype.__proto__||Object.getPrototypeOf(h.prototype),\"serialize\",this).call(this);return t.parameters={min:this.min.toArray(),max:this.max.toArray()},t}}]),h}();var Ti=function(r){n(a,Si);function a(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments[1];t(this,a);var n=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,Pi.HEIGHTFIELD,e));return n.min=new o(0,0,0),void 0!==i.min&&n.min.fromArray(i.min),n.size=new o(1,1,1),void 0!==i.size&&n.size.fromArray(i.size),n.scale=new o(1,1,1),void 0!==i.scale&&n.scale.fromArray(i.scale),n.dimensions=new o,n.dimensions.multiplyVectors(n.size,n.scale),n.data=i.data,n.heightmap=null,void 0!==i.image&&n.fromImage(i.image),n}return i(a,[{key:\"fromImage\",value:function(t){var i=\"undefined\"==typeof document?null:function(t){var i=document.createElementNS(\"http://www.w3.org/1999/xhtml\",\"canvas\").getContext(\"2d\");return i.drawImage(t,0,0),i.getImageData(0,0,t.width,t.height)}(t),e=null,n=void 0,s=void 0,r=void 0,a=void 0;if(null!==i){for(n=i.data,e=new Uint8ClampedArray(n.length/4),s=0,r=0,a=n.length;s<a;++s,r+=4)e[s]=n[r];this.heightmap=t,this.size.set(i.width,1,i.height),this.dimensions.multiplyVectors(this.size,this.scale),this.data=e}return this}},{key:\"computeBoundingBox\",value:function(){return this.bbox=new u,this.bbox.min.copy(this.min),this.bbox.max.addVectors(this.min,this.dimensions),this.bbox}},{key:\"sample\",value:function(t){var i=this.scale,e=t.x/i.x,n=t.z/i.z,s=this.min.y+this.data[n*this.size.x+e]/255*this.dimensions.y;return t.y-s}},{key:\"serialize\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"serialize\",this).call(this);return i.parameters={min:this.min.toArray(),scale:this.scale.toArray(),size:this.size.toArray(),data:t?null:this.data,dataUrl:t&&null!==this.heightmap?this.heightmap.toDataUrl():null,image:null},i}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return t.push(this.data.buffer),t}}]),a}(),_i=function(a){n(h,Si);function h(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments[1];t(this,h);var n=s(this,(h.__proto__||Object.getPrototypeOf(h)).call(this,Pi.SUPER_PRIMITIVE,e));return n.origin=new o,void 0!==i.origin&&n.origin.fromArray(i.origin),n.scale=void 0!==i.scale?i.scale:1,n.s0=new(Function.prototype.bind.apply(N,[null].concat(r(i.s)))),n.r0=new(Function.prototype.bind.apply(o,[null].concat(r(i.r)))),n.s=n.s0.clone().multiplyScalar(n.scale),n.r=n.r0.clone().multiplyScalar(n.scale),n.ba=new y,n.offset=0,n.precompute(),n}return i(h,[{key:\"setScale\",value:function(t){this.scale=t,this.s.copy(this.s0).multiplyScalar(t),this.r.copy(this.r0).multiplyScalar(t),this.computeBoundingBox(),this.precompute()}},{key:\"setGenus\",value:function(t){this.s0.w=t,this.s.copy(this.s0).multiplyScalar(this.scale),this.r.copy(this.r0).multiplyScalar(this.scale),this.precompute()}},{key:\"computeBoundingBox\",value:function(){var t=2*this.scale,i=this.origin;return this.bbox=new u,this.bbox.min.set(i.x-t,i.y-t,i.z-t),this.bbox.max.set(i.x+t,i.y+t,i.z+t),this.bbox}},{key:\"precompute\",value:function(){var t=this.s,i=this.r,e=this.ba,n=void 0;t.x-=i.x,t.y-=i.x,i.x-=t.w,t.w-=i.y,t.z-=i.y,this.offset=-2*t.z,e.set(i.z,this.offset),0===(n=e.dot(e))?e.set(0,-1):e.divideScalar(n)}},{key:\"sample\",value:function(t){var i=this.origin,e=this.s,n=this.r,s=this.ba,r=t.x-i.x,a=t.y-i.y,o=t.z-i.z,h=Math.abs(r)-e.x,u=Math.abs(a)-e.y,l=Math.abs(o)-e.z,c=Math.max(h,0),y=Math.max(u,0),v=Math.sqrt(c*c+y*y),d=o-e.z,f=Math.abs(v+Math.min(0,Math.max(h,u))-n.x)-e.w,m=Math.min(Math.max(f*s.x+d*s.y,0),1),x=f-n.z*m,p=d-this.offset*m,k=Math.max(f-n.z,0),g=o+e.z,w=Math.max(f,0),z=x*x+p*p,M=k*k+g*g,b=w*w+d*d,A=f*-s.y+d*s.x;return Math.sqrt(Math.min(z,Math.min(M,b)))*Math.sign(Math.max(A,l))-n.y}},{key:\"serialize\",value:function(){var t=e(h.prototype.__proto__||Object.getPrototypeOf(h.prototype),\"serialize\",this).call(this);return t.parameters={origin:this.origin.toArray(),scale:this.scale,s:this.s0.toArray(),r:this.r0.toArray()},t}}],[{key:\"create\",value:function(t){var i=Ci[t];return new h({s:i[0],r:i[1]})}}]),h}(),Ci=[[new Float32Array([1,1,1,1]),new Float32Array([0,0,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,0,0])],[new Float32Array([0,0,1,1]),new Float32Array([0,0,1])],[new Float32Array([1,1,2,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,1,1]),new Float32Array([1,1,0])],[new Float32Array([1,1,.25,1]),new Float32Array([1,.25,0])],[new Float32Array([1,1,.25,.25]),new Float32Array([1,.25,0])],[new Float32Array([1,1,1,.25]),new Float32Array([1,.1,0])],[new Float32Array([1,1,1,.25]),new Float32Array([.1,.1,0])]],Oi=function(){function e(){t(this,e)}return i(e,[{key:\"revive\",value:function(t){var i=void 0,e=void 0,n=void 0;switch(t.type){case Pi.FRACTAL_NOISE:i=new Ii(t.parameters,t.material);break;case Pi.HEIGHTFIELD:i=new Ti(t.parameters,t.material);break;case Pi.SUPER_PRIMITIVE:i=new _i(t.parameters,t.material)}for(i.operation=t.operation,e=0,n=t.children.length;e<n;++e)i.children.push(this.revive(t.children[e]));return i}}]),e}(),Ui=function(i){n(e,ci);function e(){t(this,e);var i=s(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,li.MODIFY));return i.sdf=null,i}return e}(),Fi=new(function(r){n(a,di);function a(){t(this,a);var i=s(this,(a.__proto__||Object.getPrototypeOf(a)).call(this));return i.response=new Ui,i.sdf=null,i}return i(a,[{key:\"respond\",value:function(){var t=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"respond\",this).call(this);return t.sdf=null!==this.sdf?this.sdf.serialize():null,t}},{key:\"createTransferList\",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"createTransferList\",this).call(this,t),null!==this.sdf?this.sdf.createTransferList(t):t}},{key:\"process\",value:function(t){var i=e(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"process\",this).call(this,t).getData(),n=this.sdf=Oi.revive(t.sdf),s=bi.run(t.cellPosition,t.cellSize,i,n);return function t(i,e,n,s){var r=Object.getOwnPropertyDescriptor(i,e);if(void 0===r){var a=Object.getPrototypeOf(i);null!==a&&t(a,e,n,s)}else if(\"value\"in r&&r.writable)r.value=n;else{var o=r.set;void 0!==o&&o.call(s,n)}return n}(a.prototype.__proto__||Object.getPrototypeOf(a.prototype),\"data\",null!==s?s.compress():null,this),this}}]),a}()),qi=new fi,Ei=null;self.addEventListener(\"message\",function(t){var i=t.data;switch(Ei=i.action){case li.MODIFY:postMessage(Fi.process(i).respond(),Fi.createTransferList());break;case li.EXTRACT:postMessage(qi.process(i).respond(),qi.createTransferList());break;case li.CONFIGURE:Pt.resolution=i.resolution,Gt.errorThreshold=i.errorThreshold;break;case li.CLOSE:default:close()}}),self.addEventListener(\"error\",function(t){var i=Ei===li.MODIFY?Fi:Ei===li.EXTRACT?qi:null,e=void 0;null!==i?((e=i.respond()).action=li.CLOSE,e.error=t,postMessage(e,i.createTransferList())):((e=new Ht(li.CLOSE)).error=t,postMessage(e)),close()})}();";

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

  								worker$$1.postMessage(new Message(Action$1.CLOSE));
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

  var load$2 = new TerrainEvent("load");

  var error$1 = new TerrainEvent("error");

  var Terrain = function (_EventTarget) {
  	inherits(Terrain, _EventTarget);

  	function Terrain() {
  		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  		classCallCheck(this, Terrain);

  		var _this = possibleConstructorReturn(this, (Terrain.__proto__ || Object.getPrototypeOf(Terrain)).call(this));

  		HermiteData.resolution = options.resolution !== undefined ? options.resolution : 32;

  		_this.object = null;

  		_this.world = new WorldOctree(options.cellSize, options.levels, options.keyDesign);

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
  					this.dispatchEvent(load$2);
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

  		c1 = edges$1[edge][0];
  		c2 = edges$1[edge][1];

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

  var PSEUDOINVERSE_THRESHOLD = 1e-1;

  var SVD_SWEEPS = 5;

  var sm = new SymmetricMatrix3();

  var m$3 = new Matrix3();

  var a$3 = new Vector2$1();

  var b$9 = new Vector3$1();

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

  var p$3 = new Vector3$1();

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

  var Voxel = function Voxel() {
  		classCallCheck(this, Voxel);


  		this.materials = 0;

  		this.edgeCount = 0;

  		this.index = -1;

  		this.position = new Vector3$1();

  		this.normal = new Vector3$1();

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

  				c1 = edges$1[i][0];
  				c2 = edges$1[i][1];

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
  				var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
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
  						var intersection = new Vector3$1();

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
  	var offsetA = new Vector3$1();
  	var offsetB = new Vector3$1();
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
  				key: "registerOptions",
  				value: function registerOptions(menu) {}
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

  								_this2.updateEdgeData();
  						});

  						folder.add(this.s, "phi").min(1e-6).max(Math.PI - 1e-6).step(1e-6).listen().onChange(function () {

  								_this2.updateEdgeData();
  						});

  						folder.add(this.s, "theta").min(1e-6).max(Math.PI - 1e-6).step(1e-6).listen().onChange(function () {

  								_this2.updateEdgeData();
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
  				key: "registerOptions",
  				value: function registerOptions(menu) {
  						var _this2 = this;

  						var params = {
  								"edit mode": 0
  						};

  						menu.add(params, "edit mode", { materials: 0, edges: 1 }).onChange(function () {

  								var editGridPoints = Number.parseInt(params["edit mode"]) === 0;

  								_this2.gridPointEditor.setEnabled(editGridPoints);
  								_this2.edgeEditor.setEnabled(!editGridPoints);
  						});

  						this.edgeEditor.registerOptions(menu);
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

  var VoxelDemo = function (_Demo) {
  		inherits(VoxelDemo, _Demo);

  		function VoxelDemo() {
  				classCallCheck(this, VoxelDemo);

  				var _this = possibleConstructorReturn(this, (VoxelDemo.__proto__ || Object.getPrototypeOf(VoxelDemo)).call(this, "voxel"));

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

  		createClass(VoxelDemo, [{
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
  						var composer = this.composer;
  						var renderer = composer.renderer;

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

  						scene.add(this.vertex);
  				}
  		}, {
  				key: "update",
  				value: function update(delta) {

  						this.controls.update(delta);
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

  var OctreeHelper = function (_Group) {
  		inherits(OctreeHelper, _Group);

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
  				value: function createLineSegments(octants, octantCount) {

  						var maxOctants = Math.pow(2, 16) / 8 - 1;
  						var group = new three.Group();

  						var material = new three.LineBasicMaterial({
  								color: 0xffffff * Math.random()
  						});

  						var result = void 0;
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

  								for (c = 0, d = 0, result = octants.next(); !result.done && i < length;) {

  										octant = result.value;
  										min = octant.min;
  										max = octant.max;

  										for (j = 0; j < 12; ++j) {

  												edge = edges$2[j];

  												indices[d++] = c + edge[0];
  												indices[d++] = c + edge[1];
  										}

  										for (j = 0; j < 8; ++j, ++c) {

  												corner = corners[j];

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
  						var result = void 0;

  						this.dispose();

  						while (level <= depth) {

  								result = this.octree.findOctantsByLevel(level);

  								this.createLineSegments(result[Symbol.iterator](), typeof result.size === "number" ? result.size : result.length);

  								++level;
  						}
  				}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						var groups = this.children;

  						var group = void 0,
  						    children = void 0;
  						var i = void 0,
  						    j = void 0,
  						    il = void 0,
  						    jl = void 0;

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

  var corners = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var edges$2 = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  var ContouringDemo = function (_Demo) {
  		inherits(ContouringDemo, _Demo);

  		function ContouringDemo() {
  				classCallCheck(this, ContouringDemo);

  				var _this = possibleConstructorReturn(this, (ContouringDemo.__proto__ || Object.getPrototypeOf(ContouringDemo)).call(this, "contouring"));

  				_this.cellSize = 1;

  				_this.cellPosition = new three.Vector3();
  				_this.cellPosition.subScalar(_this.cellSize / 2);

  				_this.sdfType = SDFType.SUPER_PRIMITIVE;

  				_this.superPrimitivePreset = SuperPrimitivePreset.TORUS;

  				_this.heightfield = new Heightfield({
  						min: _this.cellPosition.toArray()
  				});

  				_this.hermiteData = null;

  				_this.octreeHelper = new OctreeHelper();

  				_this.hermiteDataHelper = new HermiteDataHelper();

  				_this.material = new three.MeshPhysicalMaterial({ color: 0x009188 });

  				_this.mesh = null;

  				return _this;
  		}

  		createClass(ContouringDemo, [{
  				key: "createSVO",
  				value: function createSVO() {

  						var octreeHelper = this.octreeHelper;

  						octreeHelper.octree = new SparseVoxelOctree(this.hermiteData, this.cellPosition, this.cellSize);
  						octreeHelper.update();

  						(function (octreeHelper) {

  								var groups = octreeHelper.children;

  								var group = void 0,
  								    children = void 0,
  								    child = void 0,
  								    color = void 0;
  								var i = void 0,
  								    j = void 0,
  								    il = void 0,
  								    jl = void 0;

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

  						var preset = this.superPrimitivePreset;
  						var cellPosition = this.cellPosition.toArray();
  						var cellSize = this.cellSize;
  						var scale = cellSize / 2 - (preset === SuperPrimitivePreset.PILL ? 0.275 : 0.075);

  						var sdf = void 0;

  						switch (this.sdfType) {

  								case SDFType.SUPER_PRIMITIVE:
  										sdf = SuperPrimitive.create(preset);
  										sdf.origin.set(0, 0, 0);
  										sdf.setScale(scale);
  										break;

  								case SDFType.HEIGHTFIELD:
  										sdf = this.heightfield;
  										break;

  						}

  						this.hermiteData = ConstructiveSolidGeometry.run(cellPosition, cellSize, null, sdf.setOperationType(OperationType.UNION));

  						return this.hermiteData;
  				}
  		}, {
  				key: "contour",
  				value: function contour() {

  						var isosurface = DualContouring.run(this.octreeHelper.octree);

  						var mesh = void 0,
  						    geometry = void 0;

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

  										textureLoader.load("textures/height/02.png", function (texture) {

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
  						var composer = this.composer;
  						var renderer = composer.renderer;

  						var camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 25);
  						camera.position.set(0, 0, 2);
  						this.camera = camera;

  						var controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
  						controls.settings.pointer.lock = false;
  						controls.settings.sensitivity.rotation = 0.0025;
  						controls.settings.sensitivity.zoom = 0.01;
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

  						scene.add(this.octreeHelper);

  						scene.add(this.hermiteDataHelper);

  						this.createSVO();

  						var box = new three.Box3();
  						var halfSize = this.cellSize / 2;
  						box.min.set(-halfSize, -halfSize, -halfSize);
  						box.max.set(halfSize, halfSize, halfSize);
  						scene.add(new three.Box3Helper(box, 0x303030));
  				}
  		}, {
  				key: "update",
  				value: function update(delta) {

  						this.controls.update(delta);
  				}
  		}, {
  				key: "registerOptions",
  				value: function registerOptions(menu) {
  						var _this2 = this;

  						var renderer = this.composer.renderer;
  						var octreeHelper = this.octreeHelper;
  						var hermiteDataHelper = this.hermiteDataHelper;
  						var presets = Object.keys(SuperPrimitivePreset);

  						var params = {

  								"SDF preset": presets[this.superPrimitivePreset],
  								"color": this.material.color.getHex(),
  								"level mask": octreeHelper.children.length,

  								"use heightfield": function useHeightfield() {

  										_this2.sdfType = SDFType.HEIGHTFIELD;
  										params["show SVO"]();
  								},

  								"show SVO": function showSVO() {

  										_this2.superPrimitivePreset = SuperPrimitivePreset[params["SDF preset"]];
  										_this2.createHermiteData();
  										_this2.createSVO();

  										if (_this2.mesh !== null) {

  												_this2.scene.remove(_this2.mesh);
  										}

  										hermiteDataHelper.dispose();
  										octreeHelper.visible = true;
  										params["level mask"] = octreeHelper.children.length;
  								},

  								"show Hermite data": function showHermiteData() {

  										hermiteDataHelper.set(_this2.cellPosition, _this2.cellSize, _this2.hermiteData);

  										try {

  												hermiteDataHelper.update();

  												hermiteDataHelper.visible = true;
  												octreeHelper.visible = false;
  										} catch (e) {

  												console.error(e);
  										}
  								},

  								"contour": function contour() {

  										_this2.createSVO();
  										_this2.contour();
  										octreeHelper.visible = false;
  										hermiteDataHelper.visible = false;
  								}

  						};

  						menu.add(params, "SDF preset", presets).onChange(function () {

  								_this2.sdfType = SDFType.SUPER_PRIMITIVE;
  								params["show SVO"]();
  						});

  						menu.add(params, "use heightfield");

  						var folder = menu.addFolder("Octree Helper");
  						folder.add(params, "level mask").min(0).max(1 + Math.log2(HermiteData.resolution)).step(1).onChange(function () {

  								var i = void 0,
  								    l = void 0;

  								for (i = 0, l = octreeHelper.children.length; i < l; ++i) {

  										octreeHelper.children[i].visible = params["level mask"] >= octreeHelper.children.length || i === params["level mask"];
  								}
  						}).listen();
  						folder.open();

  						folder = menu.addFolder("Material");
  						folder.add(this.material, "metalness").min(0.0).max(1.0).step(0.0001);
  						folder.add(this.material, "roughness").min(0.0).max(1.0).step(0.0001);
  						folder.add(this.material, "clearCoat").min(0.0).max(1.0).step(0.0001);
  						folder.add(this.material, "clearCoatRoughness").min(0.0).max(1.0).step(0.0001);
  						folder.add(this.material, "refractionRatio").min(0.0).max(1.0).step(0.0001);
  						folder.add(this.material, "reflectivity").min(0.0).max(1.0).step(0.0001);
  						folder.addColor(params, "color").onChange(function () {
  								return _this2.material.color.setHex(params.color);
  						});
  						folder.add(this.material, "wireframe");
  						folder.add(this.material, "flatShading").onChange(function () {

  								_this2.material.needsUpdate = true;
  						});

  						menu.add(VoxelCell, "errorThreshold").min(0.0).max(0.1).step(0.001);
  						menu.add(params, "show SVO");
  						menu.add(params, "show Hermite data");
  						menu.add(params, "contour");

  						folder = menu.addFolder("Render Info");
  						folder.add(renderer.info.render, "vertices").listen();
  						folder.add(renderer.info.render, "faces").listen();
  				}
  		}]);
  		return ContouringDemo;
  }(Demo);

  var manager = void 0;

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
  		logarithmicDepthBuffer: true,
  		antialias: true
  	});

  	renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  	renderer.setPixelRatio(window.devicePixelRatio);
  	renderer.setClearColor(0x000000);

  	manager = new DemoManager(viewport, {
  		aside: document.getElementById("aside"),
  		composer: new EffectComposer(renderer, {
  			stencilBuffer: true,
  			depthTexture: true
  		})
  	});

  	manager.addEventListener("change", onChange);
  	manager.addEventListener("load", onLoad);

  	manager.addDemo(new VoxelDemo());
  	manager.addDemo(new ContouringDemo());

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

}(THREE,dat,Stats));
