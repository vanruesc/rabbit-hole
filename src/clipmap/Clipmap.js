import { Box3, Frustum, Matrix4, Vector3 } from "math-ds";
import { EventTarget } from "synthetic-event";
import { Scene } from "./Scene.js";
import * as events from "./clipmap-events.js";

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b = new Box3();

/**
 * A frustum.
 *
 * @type {Frustum}
 * @private
 */

const f = new Frustum();

/**
 * A 4x4 matrix.
 *
 * @type {Matrix4}
 * @private
 */

const m = new Matrix4();

/**
 * A 3D geometry clipmap.
 *
 * Finds world octants that are close to the viewer and arranges them in
 * concentric LOD shells. Octants that leave or enter a shell are reported for
 * further processing.
 */

export class Clipmap extends EventTarget {

	/**
	 * Constructs a new clipmap.
	 *
	 * @param {WorldOctree} world - A world octree.
	 */

	constructor(world) {

		super();

		/**
		 * The world octree.
		 *
		 * @type {WorldOctree}
		 */

		this.world = world;

		/**
		 * The current view position.
		 *
		 * @type {Vector3}
		 */

		this.position = new Vector3(Infinity, Infinity, Infinity);

		/**
		 * The current scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.currentScene = new Scene(this.world.levels);

		/**
		 * The previous scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.previousScene = this.currentScene.clone();

		/**
		 * The next scene.
		 *
		 * @type {Scene}
		 * @private
		 */

		this.nextScene = this.currentScene.clone();

	}

	/**
	 * Updates the clipmap.
	 *
	 * @param {PerspectiveCamera} camera - A camera.
	 */

	update(camera) {

		const viewPosition = this.position;

		viewPosition.copy(camera.position);

		// Build a frustum based on the given camera.
		f.setFromMatrix(m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

		// Find octant keys.

	}

	/**
	 * Generates voxel data for the cells in the current scene and contours them
	 * to extract a polygonal mesh.
	 */

	process() {

	}

	/**
	 * Clears this clipmap.
	 */

	clear() {

		this.previousScene.clear();
		this.currentScene.clear();
		this.nextScene.clear();

	}

}
