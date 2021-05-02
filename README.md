# Rabbit Hole

[![CI](https://badgen.net/github/checks/vanruesc/rabbit-hole/main)](https://github.com/vanruesc/rabbit-hole/actions)
[![Version](https://badgen.net/npm/v/rabbit-hole?color=green)](https://www.npmjs.com/package/rabbit-hole)
[![Peer dependencies](https://badgen.net/david/peer/vanruesc/rabbit-hole)](https://david-dm.org/vanruesc/rabbit-hole?type=peer)

An experimental voxel engine for WebGL. This software has been created in the context of a Master's degree project at
the [University of Applied Sciences Brandenburg](https://www.th-brandenburg.de) in cooperation with the
[Norwegian University of Technology and Science](https://www.ntnu.no).

:warning: _While many core features are already implemented, this project is still incomplete._ :warning:

*[Demo](https://vanruesc.github.io/rabbit-hole/demo)&ensp;&middot;&ensp;[Documentation](https://vanruesc.github.io/rabbit-hole/docs)&ensp;&middot;&ensp;[Master's Thesis (2016)](https://raw.githubusercontent.com/vanruesc/rabbit-hole/main/thesis-volumetric-terrain-rendering-with-webgl.pdf)&ensp;&middot;&ensp;[Electronic Imaging Paper (2018)](https://www.ingentaconnect.com/contentone/ist/ei/2018/00002018/00000006/art00007)*


## Installation

This library requires the peer dependency [three](https://github.com/vanruesc/iterator-result).

```sh
npm install three rabbit-hole
``` 


## Usage

The following example uses the rendering framework [three](https://github.com/mrdoob/three.js/).
Please refer to the [usage example](https://github.com/mrdoob/three.js/blob/master/README.md) of `three` for information
on how to setup the renderer, scene and camera.

##### Basics

```js
import { Terrain } from "rabbit-hole";

const terrain = new Terrain();
scene.add(terrain);

requestAnimationFrame(function render() {

	requestAnimationFrame(render);
	terrain.update(camera);
	renderer.render(scene, camera);

});
```

##### Constructive Solid Geometry

```js
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

Please refer to the [contribution guidelines](https://github.com/vanruesc/rabbit-hole/blob/main/.github/CONTRIBUTING.md) for details.
