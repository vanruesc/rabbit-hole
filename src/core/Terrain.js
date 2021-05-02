import { EventDispatcher } from "three";
import { OperationType } from "../volume/csg/OperationType";
import { SDFReviver } from "../volume/sdf/SDFReviver";
import { SDFLoader } from "../loaders/SDFLoader";
import { HermiteData } from "../volume/HermiteData";
import { WorldOctree } from "../octree/world/WorldOctree";
import { Clipmap } from "../clipmap/Clipmap";
import { Action } from "../worker/Action";
import { ExtractionRequest } from "../worker/messages/ExtractionRequest";
import { ModificationRequest } from "../worker/messages/ModificationRequest";
// import { Task } from "./Task";
import { ThreadPool } from "../worker/ThreadPool";
import * as events from "./terrain-events";

/**
 * The terrain system.
 *
 * Manages volume modifications and mesh generation.
 *
 * @implements {Disposable}
 * @implements {EventListener}
 */

export class Terrain extends EventDispatcher {

	/**
	 * Constructs a new terrain.
	 *
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.workers=navigator.hardwareConcurrency] - Limits the amount of active workers. Cannot exceed the amount of logical processors.
	 * @param {Number} [options.resolution=32] - The resolution of the volume data.
	 * @param {Number} [options.world] - Additional world octree settings. See {@link WorldOctree} for details.
	 */

	constructor(options = {}) {

		const worldSettings = (options.world !== undefined) ? options.world : {};

		HermiteData.resolution = (options.resolution !== undefined) ? options.resolution : 32;

		super();

		/**
		 * The terrain mesh. Add this object to your scene.
		 *
		 * @type {Group}
		 */

		this.object = null;

		/**
		 * The world octree.
		 *
		 * @type {WorldOctree}
		 */

		this.world = new WorldOctree(worldSettings.cellSize, worldSettings.levels, worldSettings.keyDesign);

		/**
		 * A clipmap.
		 *
		 * @type {Clipmap}
		 */

		this.clipmap = new Clipmap(this.world);
		this.clipmap.addEventListener("shellupdate", this);

		/**
		 * A thread pool. Each worker from this pool is capable of performing
		 * isosurface extractions as well as CSG operations on discrete volume data.
		 *
		 * @type {ThreadPool}
		 */

		this.threadPool = new ThreadPool(options.workers);
		this.threadPool.addEventListener("message", this);

		/**
		 * Keeps track of tasks that are currently being processed by a worker.
		 *
		 * Note: The amount of tracked tasks cannot exceed the amount of workers.
		 *
		 * @type {WeakMap}
		 * @private
		 */

		this.tasks = new WeakMap();

		/**
		 * An SDF loader.
		 *
		 * @type {SDFLoader}
		 * @private
		 */

		this.sdfLoader = new SDFLoader();
		this.sdfLoader.addEventListener("load", this);

		/**
		 * A chronological sequence of CSG operations that have been executed during
		 * this session.
		 *
		 * @type {SignedDistanceFunction[]}
		 * @private
		 */

		this.history = [];

		/**
		 * A squared distance threshold.
		 *
		 * If the squared distance from the current view position to a given new
		 * position is greater than this threshold, the clipmap will be updated.
		 *
		 * @type {Number}
		 * @private
		 */

		this.dtSq = this.world.getCellSize();

	}

	/**
	 * Handles events.
	 *
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "shellupdate":
				break;

			case "message":
				break;

			case "load":
				this.revive(event.descriptions);
				this.dispatchEvent(events.load);
				break;

		}

	}

	/**
	 * Executes the given SDF.
	 *
	 * SDFs without a valid CSG operation type will be ignored.
	 * See {@link OperationType} for a list of available CSG operation types.
	 *
	 * Instead of using this method directly, it's recommended to use the
	 * convenience methods {@link union}, {@link subtract} and {@link intersect}.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	applyCSG(sdf) {

		this.world.applyCSG(sdf);
		this.history.push(sdf);

	}

	/**
	 * Executes the given SDF and adds the generated data to the volume.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	union(sdf) {

		this.applyCSG(sdf.setOperationType(OperationType.UNION));

	}

	/**
	 * Executes the given SDF and subtracts the generated data from the volume.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	subtract(sdf) {

		this.applyCSG(sdf.setOperationType(OperationType.DIFFERENCE));

	}

	/**
	 * Executes the given SDF and discards the volume data that doesn't overlap
	 * with the generated data.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	intersect(sdf) {

		this.applyCSG(sdf.setOperationType(OperationType.INTERSECTION));

	}

	/**
	 * Updates the terrain geometry.
	 *
	 * This method should be called every time the position has changed.
	 *
	 * @param {Vector3} position - A position.
	 */

	update(position) {

		// Check if the position has changed enough.
		if(this.clipmap.position.distanceToSquared(position) >= this.dtSq) {

			this.clipmap.update(position);

		}

	}

	/**
	 * Finds the world cells that intersect with the given ray.
	 *
	 * @param {Ray} ray - A ray.
	 * @return {WorldOctant[]} A list of intersecting world octants. Sorted by distance, closest first.
	 */

	raycast(ray) {

		return this.world.raycast(ray);

	}

	/**
	 * Resets this terrain by removing all data and closing active worker threads.
	 */

	clear() {

		this.world.clear();
		this.clipmap.clear();
		this.threadPool.clear();
		this.sdfLoader.clear();

		this.tasks = new WeakMap();
		this.history = [];

	}

	/**
	 * Frees internal resources.
	 *
	 * By calling this method the terrain system will become unoperative.
	 */

	dispose() {

		this.threadPool.dispose();

	}

	/**
	 * Revives the given serialised SDFs and applies them to the current volume.
	 *
	 * @private
	 * @param {Array} descriptions - A list of serialised SDFs.
	 */

	revive(descriptions) {

		let i, l;

		for(i = 0, l = descriptions.length; i < l; ++i) {

			this.applyCSG(SDFReviver.revive(descriptions[i]));

		}

	}

	/**
	 * Saves a description of the current volume data.
	 *
	 * @return {DOMString} A URL to the exported save data, or null if there is no data.
	 */

	save() {

		return (this.history.length === 0) ? null : URL.createObjectURL(

			new Blob([JSON.stringify(this.history)], { type: "text/json" })

		);

	}

	/**
	 * Loads a volume data description.
	 *
	 * A load event will be dispatched when the loading process has finished.
	 *
	 * @param {String} data - A stringified list of SDF descriptions.
	 */

	load(data) {

		const descriptions = JSON.parse(data);

		this.clear();
		this.sdfLoader.load(descriptions);

	}

}
