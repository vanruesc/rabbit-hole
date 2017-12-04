import {
	BufferAttribute,
	BufferGeometry,
	Group,
	LineBasicMaterial,
	LineSegments,
	Points,
	PointsMaterial,
	Vector3,
	VertexColors
} from "three";

import { HermiteData } from "../volume/HermiteData.js";
import { Material } from "../volume/Material.js";

/**
 * A chunk helper.
 */

export class HermiteDataHelper extends Group {

	/**
	 * Constructs a new chunk helper.
	 *
	 * @param {Vector3} cellPosition - The position of the volume data cell.
	 * @param {Number} cellSize - The size of the volume data cell.
	 * @param {HermiteData} data - The volume data.
	 * @param {Boolean} [useMaterialIndices=false] - Whether points should be created for solid material indices.
	 * @param {Boolean} [useEdgeData=true] - Whether edges with intersection points and normals should be created.
	 */

	constructor(cellPosition, cellSize, data, useMaterialIndices = false, useEdgeData = true) {

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
		 * An empty set of volume data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.decompressedData = new HermiteData(false);

		/**
		 * The material of the grid points.
		 *
		 * @type {PointsMaterial}
		 */

		this.pointsMaterial = new PointsMaterial({
			vertexColors: VertexColors,
			sizeAttenuation: true,
			size: 0.05
		});

		// Create groups for grid points, edges and normals.
		this.add(new Group());
		this.add(new Group());
		this.add(new Group());

		this.gridPoints.name = "GridPoints";
		this.edges.name = "Edges";
		this.normals.name = "Normals";

		this.update(useMaterialIndices, useEdgeData);

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
	 * Creates the helper geometry.
	 *
	 * @param {Boolean} [useMaterialIndices=false] - Whether points should be created for solid material indices.
	 * @param {Boolean} [useEdgeData=true] - Whether edges with intersection points and normals should be created.
	 * @return {HermiteDataHelper} This helper.
	 */

	update(useMaterialIndices = false, useEdgeData = true) {

		const data = this.data;
		const decompressedData = this.decompressedData;

		// Remove existing geometry.
		this.dispose();

		if(this.cellPosition !== null && this.cellSize > 0 && data !== null && !data.empty) {

			data.decompress(decompressedData);
			decompressedData.edgeData = data.edgeData;

			if(useMaterialIndices) {

				this.createPoints(decompressedData);

			}

			if(useEdgeData && decompressedData.edgeData !== null) {

				this.createEdges(decompressedData);

			}

			decompressedData.clear();

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

		const s = this.cellSize;
		const n = HermiteData.resolution;

		const materialIndices = data.materialIndices;

		const base = this.cellPosition;
		const offset = new Vector3();
		const position = new Vector3();

		const color = new Float32Array([0.0, 0.0, 0.0]);

		const geometry = new BufferGeometry();
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

		this.gridPoints.add(new Points(geometry, this.pointsMaterial));

	}

	/**
	 * Creates edges with intersection points and normals.
	 *
	 * @private
	 * @param {HermiteData} data - Volume data.
	 */

	createEdges(data) {

		const s = this.cellSize;
		const n = HermiteData.resolution;
		const edgeData = data.edgeData;

		const normalA = new Vector3();
		const normalB = new Vector3();

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

		const lineSegmentsMaterial = new LineBasicMaterial({
			vertexColors: VertexColors
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

}
