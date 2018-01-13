# Rabbit Hole

[![Build status](https://travis-ci.org/vanruesc/rabbit-hole.svg?branch=master)](https://travis-ci.org/vanruesc/rabbit-hole)
[![NPM version](https://badge.fury.io/js/rabbit-hole.svg)](http://badge.fury.io/js/rabbit-hole)
[![Dependencies](https://david-dm.org/vanruesc/rabbit-hole.svg?branch=master)](https://david-dm.org/vanruesc/rabbit-hole)

A volumetric terrain engine for WebGL. This engine has been created in the context of a Master's degree project at
the [University of Applied Sciences Brandenburg](https://www.th-brandenburg.de) in cooperation with the
[Norwegian University of Technology and Science](https://www.ntnu.no).

*[Extensive Demo](https://vanruesc.github.io/rabbit-hole/public/demo/#contouring) &there4;
[Performance](https://vanruesc.github.io/rabbit-hole/public/performance) &there4;
[Volume Editor](https://vanruesc.github.io/rabbit-hole/public/editor) &there4;
[API Reference](https://vanruesc.github.io/rabbit-hole/public/docs) &there4;
[Master's Thesis](https://vanruesc.github.io/rabbit-hole/public/volumetric-terrain-rendering-with-webgl.pdf)*


## Installation

```sh
npm install rabbit-hole
``` 


## Usage

Please refer to the [usage example](https://github.com/mrdoob/three.js/blob/master/README.md) of three.js for information
about how to setup the renderer, scene and camera.

##### Basics

```javascript
import { Terrain } from "rabbit-hole";

const terrain = new Terrain();
scene.add(terrain.object);

(function render() {

	requestAnimationFrame(render);
	terrain.update(camera);
	renderer.render(scene, camera);

}());
```

##### Constructive Solid Geometry

```javascript
import { SuperPrimitive, SuperPrimitivePreset } from "rabbit-hole";

const a = SuperPrimitive.create(SuperPrimitivePreset.SPHERE);
const b = SuperPrimitive.create(SuperPrimitivePreset.TORUS);
const c = SuperPrimitive.create(SuperPrimitivePreset.CUBE);

terrain.union(a);
terrain.subtract(b.intersect(c).subtract(a));
terrain.intersect(c.subtract(a.union(b)));
```


## Features

- [Multithreading](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- Level of Detail
- [Tri-Planar Texture Mapping](http://http.developer.nvidia.com/GPUGems3/gpugems3_ch01.html)
- Real-time volume construction and destruction


## Contributing

Please refer to the [contribution guidelines](https://github.com/vanruesc/rabbit-hole/blob/master/CONTRIBUTING.md).
