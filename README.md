# Rabbit Hole

[![Build status](https://travis-ci.org/vanruesc/rabbit-hole.svg?branch=master)](https://travis-ci.org/vanruesc/rabbit-hole)
[![NPM version](https://badge.fury.io/js/rabbit-hole.svg)](http://badge.fury.io/js/rabbit-hole)
[![Peer dependencies](https://david-dm.org/vanruesc/rabbit-hole/peer-status.svg)](https://david-dm.org/vanruesc/rabbit-hole?type=peer)

A volumetric terrain engine for WebGL. This engine has been created in the context of a Master's degree project at
the [University of Applied Sciences Brandenburg](https://www.th-brandenburg.de) in cooperation with the
[Norwegian University of Technology and Science](https://www.ntnu.no).

_While many core features are already implemented, this project is still under development._

*[Demo](https://vanruesc.github.io/rabbit-hole/public/demo) &there4;
[Performance](https://vanruesc.github.io/rabbit-hole/public/performance) &there4;
[Volume Editor](https://vanruesc.github.io/rabbit-hole/public/editor) &there4;
[API Reference](https://vanruesc.github.io/rabbit-hole/public/docs) &there4;
[Master's Thesis (2016)](https://vanruesc.github.io/rabbit-hole//public/thesis-volumetric-terrain-rendering-with-webgl.pdf) &there4;
[Electronic Imaging Paper (2018)](https://ist.publisher.ingentaconnect.com/contentone/ist/ei/2018/00002018/00000006/art00007)*


## Installation

This library requires the peer dependencies
[iterator-result](https://github.com/vanruesc/iterator-result),
[math-ds](https://github.com/vanruesc/math-ds),
[sparse-octree](https://github.com/vanruesc/sparse-octree) and
[synthetic-event](https://github.com/vanruesc/synthetic-event).

```sh
npm install iterator-result math-ds sparse-octree synthetic-event rabbit-hole
``` 


## Usage

The following example uses [rabbit-hole-three]() and the rendering framework [three](https://github.com/mrdoob/three.js/).
Please refer to the [usage example](https://github.com/mrdoob/three.js/blob/master/README.md) of `three` for information
on how to setup the renderer, scene and camera.

##### Basics

```javascript
import { Terrain } from "rabbit-hole";
import {  } from "rabbit-hole-three";

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
- Real-time volume construction and destruction


## Contributing

Please refer to the [contribution guidelines](https://github.com/vanruesc/rabbit-hole/blob/master/.github/CONTRIBUTING.md) for details.
