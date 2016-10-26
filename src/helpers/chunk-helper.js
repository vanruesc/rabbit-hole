import THREE from "three";
import { PATTERN } from "sparse-octree";
import { Vector3 } from "../math";
import { Edge, Density } from "../volume";

/**
 * A chunk helper.
 *
 * The update method must be called manually.
 *
 * @class ChunkHelper
 * @submodule helpers
 * @constructor
 * @extends Object3D
 * @param {Chunk} [chunk] - A volume data chunk.
 */

export class ChunkHelper extends THREE.Object3D {

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

	}

	/**
	 * The line segments for the X-, Y- and Z-edges.
	 *
	 * @property edges
	 * @type Array
	 */

	get edges() { return this.children.slice(0, 3); }

	/**
	 * Creates the geometry.
	 *
	 * @method update
	 * @throws {Error} An error is thrown if too many vertices are created.
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
		const edge = new Edge();

		const edgeColors = [
			new Float32Array([0.6, 0.0, 0.0]),
			new Float32Array([0.0, 0.6, 0.0]),
			new Float32Array([0.0, 0.0, 0.6])
		];

		const normalColor = new Float32Array([0.0, 1.0, 1.0]);
		const colorHollow = new Float32Array([1.0, 1.0, 1.0]);
		const colorSolid = new Float32Array([0.0, 0.0, 0.0]);

		const pointsMaterial = new THREE.PointsMaterial({
			vertexColors: THREE.VertexColors, size: 3, sizeAttenuation: false
		});

		const lineSegmentsMaterial = new THREE.LineBasicMaterial({
			vertexColors: THREE.VertexColors
		});

		let edges, zeroCrossings, normals;

		let positions, colors, geometry;
		let vertexCount, gridPointColor, edgeColor;

		let normalA, normalB;
		let plane, index;

		let d, p, i, j, l;
		let x, y, z;

		// Remove existing geometry.
		for(i = 0, l = this.children.length; i < l; ++i) {

			this.children[i].geometry.dispose();
			this.children[i].material.dispose();

		}

		while(this.children.length > 0) {

			this.remove(this.children[0]);

		}

		// Grid points.
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
					gridPointColor = (materialIndices[i++] === Density.HOLLOW) ? colorHollow : colorSolid;

					positions[j] = position.x; colors[j++] = gridPointColor[0];
					positions[j] = position.y; colors[j++] = gridPointColor[1];
					positions[j] = position.z; colors[j++] = gridPointColor[2];

				}

			}

		}

		geometry = new THREE.BufferGeometry();
		geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

		this.add(new THREE.Points(geometry, pointsMaterial));

		// Edges.
		for(d = 0, p = 4; d < 3; ++d, p >>= 1) {

			edges = edgeData.edges[d];
			zeroCrossings = edgeData.zeroCrossings[d];
			normals = edgeData.normals[d];
			edgeColor = edgeColors[d];

			plane = PATTERN[p];

			vertexCount = edges.length * 4;
			positions = new Float32Array(vertexCount * 3);
			colors = new Float32Array(vertexCount * 3);

			for(i = 0, j = 0, l = edges.length; i < l; ++i) {

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
					(x + plane[0]) * s / n,
					(y + plane[1]) * s / n,
					(z + plane[2]) * s / n
				);

				edge.a.addVectors(base, offsetA);
				edge.b.addVectors(base, offsetB);

				edge.t = zeroCrossings[i];
				edge.n.fromArray(normals, i);

				normalA = edge.computeZeroCrossingPosition();
				normalB = normalA.add(edge.n);

				// Edge.

				positions[j] = edge.a.x; colors[j++] = edgeColor[0];
				positions[j] = edge.a.y; colors[j++] = edgeColor[1];
				positions[j] = edge.a.z; colors[j++] = edgeColor[2];

				positions[j] = edge.b.x; colors[j++] = edgeColor[0];
				positions[j] = edge.b.y; colors[j++] = edgeColor[1];
				positions[j] = edge.b.z; colors[j++] = edgeColor[2];

				// Normal at Zero Crossing.

				positions[j] = normalA.x; colors[j++] = normalColor[0];
				positions[j] = normalA.y; colors[j++] = normalColor[1];
				positions[j] = normalA.z; colors[j++] = normalColor[2];

				positions[j] = normalB.x; colors[j++] = normalColor[0];
				positions[j] = normalB.y; colors[j++] = normalColor[1];
				positions[j] = normalB.z; colors[j++] = normalColor[2];

			}

			geometry = new THREE.BufferGeometry();
			geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
			geometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));

			this.add(new THREE.LineSegments(geometry, lineSegmentsMaterial));

		}

	}

}
