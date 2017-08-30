import { Vector3 } from "three";
import { pattern } from "sparse-octree";
import { EventTarget } from "synthetic-event";

import {
	EdgeData,
	HermiteData,
	QEFData
} from "../../../../src";

import { DataEvent } from "../events/DataEvent.js";
import { GridPointEditor } from "./GridPointEditor.js";
import { EdgeEditor } from "./EdgeEditor.js";

/**
 * An update event.
 *
 * @type {DataEvent}
 * @private
 */

const updateEvent = new DataEvent("update");

/**
 * A visual Hermite data editor.
 *
 * @implements {EventListener}
 */

export class HermiteDataEditor extends EventTarget {

	/**
	 * Constructs a new grid point editor.
	 *
	 * @param {Vector3} cellPosition - The position of the data cell.
	 * @param {Number} cellSize - The size of the data cell.
	 * @param {HermiteData} hermiteData - A set of Hermite data. The material indices of this data will become editable.
	 * @param {PerspectiveCamera} camera - A camera.
	 * @param {Element} [dom=document.body] - A dom element.
	 */

	constructor(cellPosition, cellSize, hermiteData, camera, dom = document.body) {

		super();

		/**
		 * The Hermite data.
		 *
		 * @type {HermiteData}
		 * @private
		 */

		this.hermiteData = hermiteData;

		/**
		 * The position of the data cell.
		 *
		 * @type {Vector3}
		 * @private
		 */

		this.cellPosition = cellPosition;

		/**
		 * The size of the data cell.
		 *
		 * @type {Number}
		 * @private
		 */

		this.cellSize = cellSize;

		/**
		 * A grid point editor.
		 *
		 * @type {GridPointEditor}
		 * @private
		 */

		this.gridPointEditor = new GridPointEditor(cellPosition, cellSize, hermiteData, camera, dom);
		this.gridPointEditor.addEventListener("update", this);
		this.gridPointEditor.setEnabled(true);

		/**
		 * An edge editor.
		 *
		 * @type {EdgeEditor}
		 * @private
		 */

		this.edgeEditor = new EdgeEditor(cellPosition, cellSize, hermiteData, camera, dom);
		this.edgeEditor.addEventListener("update", this);

		/**
		 * A set of QEF data.
		 *
		 * @type {QEFData}
		 * @private
		 */

		this.qefData = new QEFData();

	}

	/**
	 * A group of spheres that represent the grid points.
	 *
	 * @type {Group}
	 */

	get gridPoints() { return this.gridPointEditor.gridPoints; }

	/**
	 * A group of lines that represent the edges.
	 *
	 * @type {Group}
	 */

	get edges() { return this.edgeEditor.edges; }

	/**
	 * A group of planes that represent the isosurface edge intersections.
	 *
	 * @type {Group}
	 */

	get planes() { return this.edgeEditor.planes; }

	/**
	 * Creates new edge data from the material indices.
	 *
	 * This method resets all Zero Crossings and intersection normals.
	 *
	 * @private
	 */

	createEdgeData() {

		const n = HermiteData.resolution;
		const m = n + 1;
		const mm = m * m;

		const indexOffsets = new Uint32Array([1, m, mm]);
		const materialIndices = this.hermiteData.materialIndices;
		const edgeData = new EdgeData(EdgeData.calculate1DEdgeCount(n));

		let edges, zeroCrossings, normals;
		let indexA, indexB;

		let c, d, a, axis;
		let x, y, z;
		let X, Y, Z;

		for(a = 4, c = 0, d = 0; d < 3; a >>= 1, c = 0, ++d) {

			// X: [1, 0, 0] Y: [0, 1, 0] Z: [0, 0, 1].
			axis = pattern[a];

			edges = edgeData.indices[d];
			zeroCrossings = edgeData.zeroCrossings[d];
			normals = edgeData.normals[d];

			X = Y = Z = n;

			// Avoid processing grid points at chunk borders.
			switch(d) {

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

			for(z = 0; z <= Z; ++z) {

				for(y = 0; y <= Y; ++y) {

					for(x = 0; x <= X; ++x) {

						indexA = z * mm + y * m + x;
						indexB = indexA + indexOffsets[d];

						// Check if the edge exhibits a material change.
						if(materialIndices[indexA] !== materialIndices[indexB]) {

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

			// Cut off empty data.
			edgeData.indices[d] = edgeData.indices[d].slice(0, c);
			edgeData.zeroCrossings[d] = edgeData.zeroCrossings[d].slice(0, c);
			edgeData.normals[d] = edgeData.normals[d].slice(0, c * 3);

		}

		this.hermiteData.edgeData = edgeData;

	}

	/**
	 * Updates the QEF data.
	 *
	 * @private
	 */

	updateQEFData() {

		const qefData = this.qefData;
		const intersection = new Vector3();
		const edges = this.hermiteData.edgeData.edges(this.cellPosition, this.cellSize);

		let edge;

		qefData.clear();

		for(edge of edges) {

			edge.computeZeroCrossingPosition(intersection);
			qefData.add(intersection, edge.n);

		}

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "update": {

				if(event.target === this.gridPointEditor) {

					this.createEdgeData();
					this.edgeEditor.createEdges();

				}

				// Only accumulate QEF data for a single cell setup.
				if(HermiteData.resolution === 1) {

					this.updateQEFData();

				}

				updateEvent.qefData = this.qefData;
				this.dispatchEvent(updateEvent);

				break;

			}

		}

	}

	/**
	 * Enables or disables this editor.
	 *
	 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
	 */

	setEnabled(enabled) {

		this.gridPointEditor.setEnabled(enabled);
		this.edgeEditor.setEnabled(enabled);

	}

	/**
	 * Removes all event listeners.
	 */

	dispose() {

		this.setEnabled(false);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {

		const params = {
			"edit mode": 0
		};

		gui.add(params, "edit mode", { materials: 0, edges: 1 }).onChange(() => {

			const editGridPoints = (Number.parseInt(params["edit mode"]) === 0);

			this.gridPointEditor.setEnabled(editGridPoints);
			this.edgeEditor.setEnabled(!editGridPoints);

		});

		this.edgeEditor.configure(gui);

	}

}
