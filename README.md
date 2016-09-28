# Rabbit Hole
[![Build status](https://travis-ci.org/vanruesc/rabbit-hole.svg?branch=master)](https://travis-ci.org/vanruesc/rabbit-hole)
[![NPM version](https://badge.fury.io/js/rabbit-hole.svg)](http://badge.fury.io/js/rabbit-hole)
[![Dependencies](https://david-dm.org/vanruesc/rabbit-hole.svg?branch=master)](https://david-dm.org/vanruesc/rabbit-hole)

A volumetric terrain engine for three.js. This engine has been created in the context of a Master's degree project at
the [University of Applied Sciences Brandenburg](https://www.th-brandenburg.de) in cooperation with the
[Norwegian University of Technology and Science](https://www.ntnu.no).

*[Volume Editor]() ::
[API Reference](http://vanruesc.github.io/rabbit-hole/docs) ::
[Master's Thesis](http://vanruesc.github.io/rabbit-hole/volumetric-terrain-rendering-with-webgl.pdf)*


## Installation

```sh
$ npm install rabbit-hole
``` 


## Usage

##### [Basics]()

```javascript
import { Terrain } from "rabbit-hole";

const terrain = new Terrain();

(function render() {

	requestAnimationFrame(render);
	terrain.update(camera);
	renderer.render(scene, camera);

}());
```

##### [Constructive Solid Geometry]()

```javascript
import { Sphere, Box, Torus } from "rabbit-hole";

const a = new Torus(...);
const b = new Sphere(...);
const c = new Box(...);

terrain.union(a);
terrain.subtract(b.intersect(c));
terrain.intersect(c.subtract(a.union(b)));
```


## Features

- [Multithreading](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- Level of Detail
- [Tri-Planar Texture Mapping]()
- Real-time volume construction and destruction


## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
