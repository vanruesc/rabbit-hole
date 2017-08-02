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

  var Demo = function () {
  		function Demo(renderer) {
  				classCallCheck(this, Demo);


  				this.renderer = renderer;

  				this.loadingManager = new three.LoadingManager();

  				this.assets = null;

  				this.scene = new three.Scene();
  				this.scene.fog = new three.FogExp2(0x0d0d0d, 0.0025);

  				this.camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);

  				this.controls = null;
  		}

  		createClass(Demo, [{
  				key: "load",
  				value: function load(callback) {
  						callback();
  				}
  		}, {
  				key: "initialise",
  				value: function initialise() {}
  		}, {
  				key: "render",
  				value: function render(delta) {}
  		}, {
  				key: "configure",
  				value: function configure(gui) {}
  		}, {
  				key: "reset",
  				value: function reset() {

  						var fog = this.scene.fog;

  						this.scene = new three.Scene();
  						this.scene.fog = fog;

  						if (this.controls !== null) {

  								this.controls.dispose();
  								this.controls = null;
  						}

  						return this;
  				}
  		}]);
  		return Demo;
  }();

  var QEFDemo = function (_Demo) {
  	inherits(QEFDemo, _Demo);

  	function QEFDemo(renderer) {
  		classCallCheck(this, QEFDemo);
  		return possibleConstructorReturn(this, (QEFDemo.__proto__ || Object.getPrototypeOf(QEFDemo)).call(this, renderer));
  	}

  	createClass(QEFDemo, [{
  		key: "initialise",
  		value: function initialise() {}
  	}, {
  		key: "render",
  		value: function render(delta) {

  			this.renderer.render(this.scene, this.camera);
  		}
  	}, {
  		key: "configure",
  		value: function configure(gui) {}
  	}]);
  	return QEFDemo;
  }(Demo);

  var App = function () {
  		function App() {
  				classCallCheck(this, App);


  				this.clock = new three.Clock();

  				this.renderer = new three.WebGLRenderer({
  						logarithmicDepthBuffer: true,
  						antialias: true
  				});

  				this.renderer.setSize(window.innerWidth, window.innerHeight);
  				this.renderer.setClearColor(0x000000);
  				this.renderer.setPixelRatio(window.devicePixelRatio);

  				this.stats = function () {

  						var stats = new Stats();
  						stats.showPanel(0);
  						stats.dom.id = "stats";

  						return stats;
  				}();

  				this.demos = function (renderer) {

  						var demos = new Map();

  						demos.set("qef", new QEFDemo(renderer));

  						return demos;
  				}(this.renderer);

  				this.demo = function (demos) {

  						var key = window.location.hash.slice(1);

  						if (key.length === 0 || !demos.has(key)) {

  								key = demos.keys().next().value;
  						}

  						return key;
  				}(this.demos);
  		}

  		createClass(App, [{
  				key: "initialise",
  				value: function initialise(viewport, aside, loadingMessage) {

  						var app = this;

  						var renderer = this.renderer;
  						var clock = this.clock;
  						var stats = this.stats;
  						var demos = this.demos;

  						var demo = null;
  						var gui = null;

  						viewport.appendChild(renderer.domElement);
  						aside.appendChild(stats.dom);

  						function activateDemo() {

  								demo.initialise();

  								demo.camera.aspect = window.innerWidth / window.innerHeight;
  								demo.camera.updateProjectionMatrix();

  								gui = new dat.GUI({ autoPlace: false });
  								gui.add(app, "demo", Array.from(demos.keys())).onChange(loadDemo);
  								demo.configure(gui);
  								aside.appendChild(gui.domElement);

  								loadingMessage.style.display = "none";
  								renderer.domElement.style.visibility = "visible";
  						}

  						function loadDemo() {

  								loadingMessage.style.display = "block";
  								renderer.domElement.style.visibility = "hidden";

  								if (gui !== null) {

  										gui.destroy();
  										aside.removeChild(gui.domElement);
  								}

  								if (demo !== null) {

  										demo.reset();
  								}

  								demo = demos.get(app.demo);
  								demo.load(activateDemo);
  						}

  						loadDemo();

  						document.addEventListener("keydown", function onKeyDown(event) {

  								if (event.altKey) {

  										event.preventDefault();
  										aside.style.visibility = aside.style.visibility === "hidden" ? "visible" : "hidden";
  								}
  						});

  						window.addEventListener("resize", function () {

  								var id = 0;

  								function handleResize(event) {

  										var width = event.target.innerWidth;
  										var height = event.target.innerHeight;

  										renderer.setSize(width, height);
  										demo.camera.aspect = width / height;
  										demo.camera.updateProjectionMatrix();

  										id = 0;
  								}

  								return function onResize(event) {

  										if (id === 0) {

  												id = setTimeout(handleResize, 66, event);
  										}
  								};
  						}());

  						(function render(now) {

  								var delta = clock.getDelta();

  								requestAnimationFrame(render);

  								stats.begin();

  								demo.render(delta);

  								stats.end();
  						})();
  				}
  		}]);
  		return App;
  }();

  window.addEventListener("load", function main(event) {

  	var viewport = document.getElementById("viewport");
  	var loadingMessage = viewport.children[0];
  	var aside = document.getElementById("aside");

  	var app = new App();

  	window.removeEventListener("load", main);
  	aside.style.visibility = "visible";

  	app.initialise(viewport, aside, loadingMessage);
  });

}(THREE,dat,Stats));
