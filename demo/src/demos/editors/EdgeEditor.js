import {
	BufferAttribute,
	BufferGeometry,
	DoubleSide,
	EventDispatcher,
	Group,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	PlaneBufferGeometry,
	Raycaster,
	Spherical,
	Vector2,
	Vector3
} from "three";

/**
 * A mouse position.
 *
 * @type {Vector2}
 * @private
 */

const mouse = new Vector2();

/**
 * An update event.
 *
 * @type {Event}
 * @private
 */

const updateEvent = { type: "update" };

/**
 * A visual edge editor.
 *
 * @implements {EventListener}
 */

export class EdgeEditor extends EventDispatcher {

	/**
	 * Constructs a new edge editor.
	 *
	 * @param {Vector3} cellPosition - The position of the data cell.
	 * @param {Number} cellSize - The size of the data cell.
	 * @param {HermiteData} hermiteData - A set of Hermite data.
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
		 * A camera.
		 *
		 * @type {PerspectiveCamera}
		 * @private
		 */

		this.camera = camera;

		/**
		 * A dom element.
		 *
		 * @type {Element}
		 * @private
		 */

		this.dom = dom;

		/**
		 * A raycaster.
		 *
		 * @type {Raycaster}
		 * @private
		 */

		this.raycaster = new Raycaster();
		this.raycaster.params.Line.threshold = 0.05;

		/**
		 * A Zero Crossing value.
		 *
		 * @type {Number}
		 */

		this.t = 0;

		/**
		 * Edge materials.
		 *
		 * @type {LineBasicMaterial[]}
		 * @private
		 */

		this.edgeMaterials = [

			new LineBasicMaterial({
				color: 0xcccccc
			}),

			new LineBasicMaterial({
				color: 0xff4040
			})

		];

		/**
		 * Plane materials.
		 *
		 * @type {MeshBasicMaterial[]}
		 * @private
		 */

		this.planeMaterials = [

			new MeshBasicMaterial({
				color: 0xffff00,
				side: DoubleSide,
				depthWrite: false,
				transparent: true,
				opacity: 0.3
			}),

			new MeshBasicMaterial({
				color: 0xff0000,
				side: DoubleSide,
				depthWrite: false,
				transparent: true,
				opacity: 0.3
			})

		];

		/**
		 * A selected edge.
		 *
		 * @type {Line}
		 * @private
		 */

		this.selectedEdge = null;

		/**
		 * An edge that has been clicked.
		 *
		 * @type {Line}
		 * @private
		 */

		this.activeEdge = null;

		/**
		 * A plane that belongs to an edge that has been clicked.
		 *
		 * @type {Mesh}
		 * @private
		 */

		this.activePlane = null;

		/**
		 * A 2-tuple containing the dimension and the index of the currently
		 * selected edge.
		 *
		 * @type {Vector2[]}
		 * @private
		 */

		this.edgeId = new Vector2();

		/**
		 * A group of lines that represent the edges.
		 *
		 * @type {Group}
		 */

		this.edges = new Group();

		/**
		 * A group of planes that represent the isosurface edge intersections.
		 *
		 * @type {Group}
		 */

		this.planes = new Group();

		/**
		 * The zero crossing value of the currently selected edge.
		 *
		 * @type {Number}
		 */

		this.t = 0;

		/**
		 * The intersection orientation of the currently selected edge.
		 *
		 * @type {Spherical}
		 */

		this.s = new Spherical();

	}

	/**
	 * Retrieves the edge data index and dimension based on a given linear index.
	 *
	 * @private
	 * @param {Number} i - A linear edge index.
	 */

	calculateEdgeId(i) {

		const edgeData = this.hermiteData.edgeData;
		const edges = edgeData.indices;

		let d;

		for(d = 0; d < 3; ++d) {

			const edgeCount = edges[d].length;

			if(i < edgeCount) {

				break;

			} else {

				i -= edgeCount;

			}

		}

		this.edgeId.set(d, i);

	}

	/**
	 * Removes all visual edges and planes.
	 *
	 * @private
	 */

	clearEdges() {

		const edges = this.edges;
		const planes = this.planes;

		while(edges.children.length > 0) {

			const edge = edges.children[0];
			edge.geometry.dispose();
			edges.remove(edge);

		}

		while(planes.children.length > 0) {

			const plane = planes.children[0];
			plane.geometry.dispose();
			planes.remove(plane);

		}

		this.activeEdge = null;
		this.activePlane = null;

	}

	/**
	 * Creates interactive visual edges and planes that represent the surface
	 * intersection data.
	 */

	createEdges() {

		const lines = this.edges;
		const planes = this.planes;
		const edgeMaterial = this.edgeMaterials[0];
		const planeMaterial = this.planeMaterials[0];
		const edges = this.hermiteData.edgeData.edges(this.cellPosition, this.cellSize);

		const intersection = new Vector3();

		this.clearEdges();

		for(const edge of edges) {

			const lineGeometry = new BufferGeometry();
			const lineVertices = new Float32Array(6);

			edge.a.toArray(lineVertices);
			edge.b.toArray(lineVertices, 3);

			lineGeometry.setAttribute("position", new BufferAttribute(lineVertices, 3));
			const line = new Line(lineGeometry, edgeMaterial);
			lines.add(line);

			const plane = new Mesh(new PlaneBufferGeometry(2, 2), planeMaterial);
			plane.position.copy(edge.computeZeroCrossingPosition(intersection));
			plane.lookAt(intersection.add(edge.n));
			plane.visible = false;
			planes.add(plane);

		}

	}

	/**
	 * Adopts the edte data of the currently selected edge.
	 *
	 * @private
	 */

	adoptEdgeData() {

		const edgeData = this.hermiteData.edgeData;
		const zeroCrossings = edgeData.zeroCrossings;
		const normals = edgeData.normals;

		const d = this.edgeId.x;
		const i = this.edgeId.y;
		const n = new Vector3();

		this.t = zeroCrossings[d][i];
		this.s.setFromVector3(n.fromArray(normals[d], i * 3));

	}

	/**
	 * Updates an edge data entry.
	 *
	 * @private
	 */

	updateEdgeData() {

		const activeEdge = this.activeEdge;
		const activePlane = this.activePlane;

		const a = new Vector3();
		const b = new Vector3();
		const c = new Vector3();
		const n = new Vector3();

		const edgeData = this.hermiteData.edgeData;
		const zeroCrossings = edgeData.zeroCrossings;
		const normals = edgeData.normals;

		const d = this.edgeId.x;
		const i = this.edgeId.y;

		if(activeEdge !== null) {

			// Adjust the selected plane.
			a.fromArray(activeEdge.geometry.getAttribute("position").array);
			b.fromArray(activeEdge.geometry.getAttribute("position").array, 3);
			c.copy(a).add(b.sub(a).multiplyScalar(this.t));
			n.setFromSpherical(this.s).normalize();

			activePlane.position.copy(c);
			activePlane.lookAt(c.add(n));

			zeroCrossings[d][i] = this.t;
			n.toArray(normals[d], i * 3);

			this.dispatchEvent(updateEvent);

		}

	}

	/**
	 * Handles click events.
	 *
	 * @private
	 * @param {MouseEvent} event - A mouse event.
	 */

	handleClick(event) {

		const edge = this.selectedEdge;

		event.preventDefault();

		if(edge !== null) {

			if(this.activeEdge !== null) {

				// Switching directly to another edge?
				if(this.activeEdge !== edge) {

					// Reset the material of the previous edge.
					this.activeEdge.material = this.edgeMaterials[0];

				}

				this.activePlane.material = this.planeMaterials[0];
				this.activePlane.visible = false;

			}

			if(this.activeEdge !== edge) {

				const index = this.edges.children.indexOf(edge);
				const plane = this.planes.children[index];

				edge.material = this.edgeMaterials[1];
				plane.material = this.planeMaterials[1];
				plane.visible = true;

				this.activeEdge = edge;
				this.activePlane = plane;

				this.calculateEdgeId(index);
				this.adoptEdgeData();

			} else {

				this.t = 0;
				this.s.phi = 0;
				this.s.theta = 0;

				this.activeEdge = null;
				this.activePlane = null;

			}

		}

	}

	/**
	 * Raycasts the grid points and edges.
	 *
	 * @param {MouseEvent} event - A mouse event.
	 */

	raycast(event) {

		const raycaster = this.raycaster;

		mouse.x = (event.clientX / window.innerWidth) * 2.0 - 1.0;
		mouse.y = -(event.clientY / window.innerHeight) * 2.0 + 1.0;

		raycaster.setFromCamera(mouse, this.camera);

		const intersectingEdges = raycaster.intersectObjects(this.edges.children);

		if(this.selectedEdge !== null) {

			if(this.selectedEdge !== this.activeEdge) {

				this.selectedEdge.material = this.edgeMaterials[0];

			}

			this.selectedEdge = null;

		}

		if(intersectingEdges.length > 0) {

			this.selectedEdge = intersectingEdges[0].object;
			this.selectedEdge.material = this.edgeMaterials[1];

		}

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "mousemove":
				this.raycast(event);
				break;

			case "click":
				this.handleClick(event);
				break;

		}

	}

	/**
	 * Enables or disables this editor.
	 *
	 * @param {Boolean} enabled - Whether this editor should be enabled or disabled.
	 */

	setEnabled(enabled) {

		const dom = this.dom;

		if(enabled) {

			dom.addEventListener("mousemove", this);
			dom.addEventListener("click", this);

		} else {

			dom.removeEventListener("mousemove", this);
			dom.removeEventListener("click", this);

		}

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
	 * @param {GUI} menu - A menu.
	 */

	registerOptions(menu) {

		const planes = this.planes;

		const params = {
			"show planes": false
		};

		menu.add(params, "show planes").onChange(() => {

			const activePlane = this.activePlane;

			planes.traverse((child) => {

				if(child !== planes && child !== activePlane) {

					child.visible = params["show planes"];

				}

			});

		});

		let folder = menu.addFolder("Edge Adjustment");

		folder.add(this, "t", 0, 1, 1e-6).onChange(() => {

			if(this.hermiteData.edgeData !== null) {

				this.updateEdgeData();

			}

		}).listen();

		folder.add(this.s, "phi", 1e-6, Math.PI - 1e-6, 1e-6).onChange(() => {

			if(this.hermiteData.edgeData !== null) {

				this.updateEdgeData();

			}

		}).listen();

		folder.add(this.s, "theta", 1e-6, Math.PI - 1e-6, 1e-6).onChange(() => {

			if(this.hermiteData.edgeData !== null) {

				this.updateEdgeData();

			}

		}).listen();

		folder.open();

	}

}
