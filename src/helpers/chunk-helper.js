import {
	BufferAttribute,
	BufferGeometry,
	LineBasicMaterial,
	LineSegments,
	Object3D,
	Points,
	PointsMaterial,
	Vector3,
	VertexColors
} from "three";

import { PATTERN } from "sparse-octree";
import { Density } from "../volume/density.js";
import { Edge } from "../volume/edge.js";

/**
 * A chunk helper.
 *
 * @class ChunkHelper
 * @submodule helpers
 * @constructor
 * @extends Object3D
 * @param {Chunk} [chunk] - A volume data chunk.
 */

export class ChunkHelper extends Object3D {

	constructor(chunk) {

		super();

		this.name = "ChunkHelper";

		/**
		 * The volume data chunk.
		 *
		 * @property chunk
		 * @type Chunk
		 */

		this.chunk = chunk;

		// Create groups for grid points, edges and normals.
		this.add(new Object3D());
		this.add(new Object3D());
		this.add(new Object3D());

		this.children[0].name = "GridPoints";
		this.children[1].name = "Edges";
		this.children[2].name = "Normals";

		this.update();

	}

	/**
	 * The grid points.
	 *
	 * @property gridPoints
	 * @type Object3D
	 */

	get gridPoints() { return this.children[0]; }

	/**
	 * The edges.
	 *
	 * @property edges
	 * @type Object3D
	 */

	get edges() { return this.children[1]; }

	/**
	 * The normals.
	 *
	 * @property normals
	 * @type Object3D
	 */

	get normals() { return this.children[2]; }

	/**
	 * Creates geometry.
	 *
	 * @method update
	 */

	update() {

		const s = this.chunk.size;
		const n = this.chunk.resolution;
		const m = n + 1;
		const mm = m * m;

		const materialIndices = this.chunk.data.materialIndices;
		const edgeData = this.chunk.data.edgeData;

		const base = this.chunk.min;
		const offset = new Vector3();
		const offsetA = new Vector3();
		const offsetB = new Vector3();
		const position = new Vector3();
		const normalA = new Vector3();
		const normalB = new Vector3();
		const edge = new Edge();

		const colorEmpty = new Float32Array([1.0, 1.0, 1.0]);
		const colorSolid = new Float32Array([0.0, 0.0, 0.0]);

		const edgeColors = [
			new Float32Array([0.6, 0.0, 0.0]),
			new Float32Array([0.0, 0.6, 0.0]),
			new Float32Array([0.0, 0.0, 0.6])
		];

		const normalColor = new Float32Array([0.0, 1.0, 1.0]);

		const pointsMaterial = new PointsMaterial({
			vertexColors: VertexColors,
			sizeAttenuation: false,
			size: 3
		});

		const lineSegmentsMaterial = new LineBasicMaterial({
			vertexColors: VertexColors
		});

		let edges, zeroCrossings, normals;

		let positions, colors, positions2, colors2, geometry;
		let vertexCount, gridPointColor, edgeColor;

		let axis, index;

		let d, a, i, j, k, l;
		let x, y, z;

		// Remove existing geometry.
		this.dispose();

		// Create grid points.
		vertexCount = m ** 3;
		positions = new Float32Array(vertexCount * 3);
		colors = new Float32Array(vertexCount * 3);

		for(i = 0, z = 0; z <= n; ++z) {

			offset.z = z * s / n;

			for(y = 0; y <= n; ++y) {

				offset.y = y * s / n;

				for(x = 0; x <= n; ++x) {

					offset.x = x * s / n;

					position.addVectors(base, offset);
					gridPointColor = (materialIndices[i++] === Density.HOLLOW) ? colorEmpty : colorSolid;

					positions[j] = position.x; colors[j++] = gridPointColor[0];
					positions[j] = position.y; colors[j++] = gridPointColor[1];
					positions[j] = position.z; colors[j++] = gridPointColor[2];

				}

			}

		}

		geometry = new BufferGeometry();
		geometry.addAttribute("position", new BufferAttribute(positions, 3));
		geometry.addAttribute("color", new BufferAttribute(colors, 3));

		this.gridPoints.add(new Points(geometry, pointsMaterial));

		// Create edges and normals.
		for(a = 4, d = 0; d < 3; ++d, a >>= 1) {

			edges = edgeData.edges[d];
			zeroCrossings = edgeData.zeroCrossings[d];
			normals = edgeData.normals[d];
			edgeColor = edgeColors[d];

			axis = PATTERN[a];

			vertexCount = edges.length * 2;
			positions = new Float32Array(vertexCount * 3);
			colors = new Float32Array(vertexCount * 3);
			positions2 = new Float32Array(vertexCount * 3);
			colors2 = new Float32Array(vertexCount * 3);

			for(i = 0, j = 0, k = 0, l = edges.length; i < l; ++i) {

				index = edges[i];

				x = index % m;
				y = Math.trunc((index % mm) / m);
				z = Math.trunc(index / mm);

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

				edge.t = zeroCrossings[i];
				edge.n.fromArray(normals, i);

				normalA.copy(edge.computeZeroCrossingPosition());
				normalB.copy(normalA).addScaledVector(edge.n, s / n * 0.25);

				// Edge.
				positions[j] = edge.a.x; colors[j++] = edgeColor[0];
				positions[j] = edge.a.y; colors[j++] = edgeColor[1];
				positions[j] = edge.a.z; colors[j++] = edgeColor[2];

				positions[j] = edge.b.x; colors[j++] = edgeColor[0];
				positions[j] = edge.b.y; colors[j++] = edgeColor[1];
				positions[j] = edge.b.z; colors[j++] = edgeColor[2];

				// Normal at Zero Crossing.
				positions2[k] = normalA.x; colors2[k++] = normalColor[0];
				positions2[k] = normalA.y; colors2[k++] = normalColor[1];
				positions2[k] = normalA.z; colors2[k++] = normalColor[2];

				positions2[k] = normalB.x; colors2[k++] = normalColor[0];
				positions2[k] = normalB.y; colors2[k++] = normalColor[1];
				positions2[k] = normalB.z; colors2[k++] = normalColor[2];

			}

			geometry = new BufferGeometry();
			geometry.addAttribute("position", new BufferAttribute(positions, 3));
			geometry.addAttribute("color", new BufferAttribute(colors, 3));

			this.edges.add(new LineSegments(geometry, lineSegmentsMaterial));

			geometry = new BufferGeometry();
			geometry.addAttribute("position", new BufferAttribute(positions2, 3));
			geometry.addAttribute("color", new BufferAttribute(colors2, 3));

			this.normals.add(new LineSegments(geometry, lineSegmentsMaterial));

		}

	}

	/**
	 * Destroys this helper.
	 *
	 * @method dispose
	 */

	dispose() {

		let children;
		let i, j, il, jl;

		for(i = 0, il = this.children.length; i < il; ++i) {

			children = this.children[i];

			for(j = 0, jl = children.length; j < jl; ++j) {

				children[j].geometry.dispose();
				children[j].material.dispose();

			}

			while(children.length > 0) {

				children.remove(children[0]);

			}

		}

	}

}
