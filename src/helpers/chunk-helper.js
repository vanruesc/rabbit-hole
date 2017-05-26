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
import { Material } from "../volume/material.js";
import { Edge } from "../volume/edge.js";

/**
 * A chunk helper.
 *
 * @param {Chunk} [chunk=null] - A volume data chunk.
 * @param {Boolean} [useMaterialIndices] - Whether points should be created for solid material indices.
 * @param {Boolean} [useEdgeData] - Whether edges with intersection points and normals should be created.
 */

export class ChunkHelper extends Object3D {

	/**
	 * Constructs a new chunk helper.
	 *
	 * @param {Chunk} [chunk=null] - A volume data chunk.
	 * @param {Boolean} [useMaterialIndices] - Whether points should be created for solid material indices.
	 * @param {Boolean} [useEdgeData] - Whether edges with intersection points and normals should be created.
	 */

	constructor(chunk = null, useMaterialIndices, useEdgeData) {

		super();

		/**
		 * The name of this object.
		 */

		this.name = "ChunkHelper";

		/**
		 * The volume data chunk.
		 *
		 * @type {Chunk}
		 */

		this.chunk = chunk;

		// Create groups for grid points, edges and normals.
		this.add(new Object3D());
		this.add(new Object3D());
		this.add(new Object3D());

		this.gridPoints.name = "GridPoints";
		this.edges.name = "Edges";
		this.normals.name = "Normals";

		this.update(useMaterialIndices, useEdgeData);

	}

	/**
	 * The grid points.
	 *
	 * @type {Object3D}
	 */

	get gridPoints() { return this.children[0]; }

	/**
	 * The edges.
	 *
	 * @type {Object3D}
	 */

	get edges() { return this.children[1]; }

	/**
	 * The normals.
	 *
	 * @type {Object3D}
	 */

	get normals() { return this.children[2]; }

	/**
	 * Creates the helper geometry.
	 *
	 * @param {Boolean} [useMaterialIndices=false] - Whether points should be created for solid material indices.
	 * @param {Boolean} [useEdgeData=true] - Whether edges with intersection points and normals should be created.
	 */

	update(useMaterialIndices = false, useEdgeData = true) {

		const chunk = this.chunk;

		// Remove existing geometry.
		this.dispose();

		if(chunk !== null && chunk.data !== null) {

			chunk.data.decompress();

			if(useMaterialIndices) { this.createPoints(chunk); }
			if(useEdgeData) { this.createEdges(chunk); }

			chunk.data.compress();

		}

	}

	/**
	 * Creates points for solid material indices.
	 *
	 * @private
	 * @param {Chunk} chunk - A volume data chunk.
	 */

	createPoints(chunk) {

		const s = chunk.size;
		const n = chunk.resolution;

		const materialIndices = chunk.data.materialIndices;

		const base = chunk.min;
		const offset = new Vector3();
		const position = new Vector3();

		const color = new Float32Array([0.0, 0.0, 0.0]);

		const pointsMaterial = new PointsMaterial({
			vertexColors: VertexColors,
			sizeAttenuation: false,
			size: 3
		});

		const geometry = new BufferGeometry();

		const vertexCount = chunk.data.materials;
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

					if(materialIndices[i++] !== Material.AIR) {

						position.addVectors(base, offset);

						positions[j] = position.x; colors[j++] = color[0];
						positions[j] = position.y; colors[j++] = color[1];
						positions[j] = position.z; colors[j++] = color[2];

					}

				}

			}

		}

		geometry.addAttribute("position", new BufferAttribute(positions, 3));
		geometry.addAttribute("color", new BufferAttribute(colors, 3));

		this.gridPoints.add(new Points(geometry, pointsMaterial));

	}

	/**
	 * Creates edges with intersection points and normals.
	 *
	 * @private
	 * @param {Chunk} chunk - A volume data chunk.
	 */

	createEdges(chunk) {

		const s = chunk.size;
		const n = chunk.resolution;
		const m = n + 1;
		const mm = m * m;

		const edgeData = chunk.data.edgeData;

		const base = chunk.min;
		const offsetA = new Vector3();
		const offsetB = new Vector3();
		const normalA = new Vector3();
		const normalB = new Vector3();
		const edge = new Edge();

		const axisColors = [
			new Float32Array([0.6, 0.0, 0.0]),
			new Float32Array([0.0, 0.6, 0.0]),
			new Float32Array([0.0, 0.0, 0.6])
		];

		const normalColor = new Float32Array([0.0, 1.0, 1.0]);

		const lineSegmentsMaterial = new LineBasicMaterial({
			vertexColors: VertexColors
		});

		let edges, zeroCrossings, normals;

		let edgePositions, edgeColors;
		let normalPositions, normalColors;
		let vertexCount, edgeColor, geometry;
		let axis, index;

		let d, a, i, j, k, l;
		let x, y, z;

		for(a = 4, d = 0; d < 3; ++d, a >>= 1) {

			axis = PATTERN[a];

			edges = edgeData.edges[d];
			zeroCrossings = edgeData.zeroCrossings[d];
			normals = edgeData.normals[d];
			edgeColor = axisColors[d];

			vertexCount = edges.length * 2;
			edgePositions = new Float32Array(vertexCount * 3);
			edgeColors = new Float32Array(vertexCount * 3);
			normalPositions = new Float32Array(vertexCount * 3);
			normalColors = new Float32Array(vertexCount * 3);

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

				// Edge.
				edge.a.addVectors(base, offsetA);
				edge.b.addVectors(base, offsetB);

				edgePositions[j] = edge.a.x; edgeColors[j++] = edgeColor[0];
				edgePositions[j] = edge.a.y; edgeColors[j++] = edgeColor[1];
				edgePositions[j] = edge.a.z; edgeColors[j++] = edgeColor[2];

				edgePositions[j] = edge.b.x; edgeColors[j++] = edgeColor[0];
				edgePositions[j] = edge.b.y; edgeColors[j++] = edgeColor[1];
				edgePositions[j] = edge.b.z; edgeColors[j++] = edgeColor[2];

				// Normal at Zero Crossing.
				edge.t = zeroCrossings[i];
				edge.n.fromArray(normals, i * 3);

				normalA.copy(edge.computeZeroCrossingPosition());
				normalB.copy(normalA).addScaledVector(edge.n, 0.25 * s / n);

				normalPositions[k] = normalA.x; normalColors[k++] = normalColor[0];
				normalPositions[k] = normalA.y; normalColors[k++] = normalColor[1];
				normalPositions[k] = normalA.z; normalColors[k++] = normalColor[2];

				normalPositions[k] = normalB.x; normalColors[k++] = normalColor[0];
				normalPositions[k] = normalB.y; normalColors[k++] = normalColor[1];
				normalPositions[k] = normalB.z; normalColors[k++] = normalColor[2];

			}

			geometry = new BufferGeometry();
			geometry.addAttribute("position", new BufferAttribute(edgePositions, 3));
			geometry.addAttribute("color", new BufferAttribute(edgeColors, 3));

			this.edges.add(new LineSegments(geometry, lineSegmentsMaterial));

			geometry = new BufferGeometry();
			geometry.addAttribute("position", new BufferAttribute(normalPositions, 3));
			geometry.addAttribute("color", new BufferAttribute(normalColors, 3));

			this.normals.add(new LineSegments(geometry, lineSegmentsMaterial));

		}

	}

	/**
	 * Destroys the current helper geometry.
	 */

	dispose() {

		let child, children;
		let i, j, il, jl;

		for(i = 0, il = this.children.length; i < il; ++i) {

			child = this.children[i];
			children = child.children;

			for(j = 0, jl = children.length; j < jl; ++j) {

				children[j].geometry.dispose();
				children[j].material.dispose();

			}

			while(children.length > 0) {

				child.remove(children[0]);

			}

		}

	}

}
