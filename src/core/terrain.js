import {
	BufferAttribute,
	BufferGeometry,
	Mesh,
	MeshStandardMaterial,
	Frustum,
	Matrix4,
	Object3D
} from "three";

import { Volume } from "../volume/octree/volume.js";
import { OperationType } from "../volume/csg/operation-type.js";
import { Action } from "../worker/action.js";
import { WorkerTask } from "../worker/worker-task.js";
import { ThreadPool } from "../worker/thread-pool.js";
// import { TerrainMaterial } from "../materials/triplanar";
import { Scheduler } from "./scheduler.js";
import { Queue } from "./queue.js";

/**
 * A computation helper.
 *
 * @property MATRIX4
 * @type Matrix4
 * @private
 * @static
 * @final
 */

const MATRIX4 = new Matrix4();

/**
 * A frustum used for octree culling.
 *
 * @property FRUSTUM
 * @type Frustum
 * @private
 * @static
 * @final
 */

const FRUSTUM = new Frustum();

/**
 * The terrain system.
 *
 * @class Terrain
 * @submodule core
 * @extends Object3D
 * @constructor
 * @param {Object} [options] - The options.
 * @param {Number} [options.levels=6] - The number of detail levels.
 * @param {Number} [options.chunkSize=32] - The world size of a volume chunk. Will be rounded up to the next power of two.
 * @param {Number} [options.resolution=32] - The resolution of a volume chunk. Will be rounded up to the next power of two.
 * @param {Number} [options.maxWorkers] - Limits the amount of active workers. The default limit is the amount of logical processors which is also the maximum.
 */

export class Terrain extends Object3D {

	constructor(options = {}) {

		super();

		this.name = "Terrain";

		/**
		 * The number of detail levels.
		 *
		 * Terrain chunks that are further away from the camera will be rendered
		 * with less vertices.
		 *
		 * @property levels
		 * @type Number
		 * @private
		 * @default 6
		 */

		this.levels = (options.levels !== undefined) ? Math.max(1, options.levels) : 6;

		/**
		 * The volume of this terrain.
		 *
		 * @property volume
		 * @type Volume
		 * @private
		 */

		this.volume = new Volume(options.chunkSize, options.resolution);

		/**
		 * A thread pool.
		 *
		 * @property threadPool
		 * @type ThreadPool
		 * @private
		 */

		this.threadPool = new ThreadPool(options.maxWorkers);
		this.threadPool.addEventListener("message", (event) => this.commit(event));

		/**
		 * Manages pending tasks.
		 *
		 * @property scheduler
		 * @type Scheduler
		 * @private
		 */

		this.scheduler = new Scheduler(this.levels + 1);

		/**
		 * A list of CSG operations that have been executed during this session.
		 *
		 * @property history
		 * @type Array
		 */

		this.history = [];

		/**
		 * Keeps track of chunks that are currently being used by a worker.
		 *
		 * @property neutered
		 * @type WeakSet
		 */

		this.neutered = new WeakSet();

		/**
		 * Keeps track of associations between workers and chunks.
		 *
		 * @property chunks
		 * @type WeakMap
		 * @private
		 */

		this.chunks = new WeakMap();

		/**
		 * Keeps track of associations between chunks and meshes.
		 *
		 * @property meshes
		 * @type WeakMap
		 * @private
		 */

		this.meshes = new WeakMap();

		/**
		 * The terrain material.
		 *
		 * @property material
		 * @type TerrainMaterial
		 * @private
		 */

		// this.material = new TerrainMaterial();
		this.material = new MeshStandardMaterial({
			color: 0xbb4400
		});

	}

	/**
	 * Lifts the connection of a given chunk to its mesh and removes the geometry.
	 *
	 * @method unlinkMesh
	 * @private
	 * @param {Chunk} chunk - A volume chunk.
	 */

	unlinkMesh(chunk) {

		let mesh;

		if(this.meshes.has(chunk)) {

			mesh = this.meshes.get(chunk);
			mesh.geometry.dispose();

			this.meshes.delete(chunk);
			this.remove(mesh);

		}

	}

	/**
	 * Completes a worker action.
	 *
	 * @method commit
	 * @private
	 * @param {Event} event - A worker message event.
	 */

	commit(event) {

		const worker = event.target;
		const data = event.data;

		// Find the chunk that has been processed by this worker.
		const chunk = this.chunks.get(worker);

		this.neutered.delete(chunk);
		this.chunks.delete(worker);

		if(data.chunk.data !== null) {

			// Reclaim ownership of the chunk data.
			chunk.deserialise(data.chunk);

		} else {

			chunk.data = null;

			if(chunk.csg !== null) {

				// The chunk became empty. Remove it.
				this.scheduler.cancel(chunk);
				this.volume.prune(chunk);
				this.unlinkMesh(chunk);

			}

		}

		if(data.action === Action.MODIFY) {

			if(chunk.csg !== null) {

				// Drain the CSG queue as fast as possible.
				this.scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, this.scheduler.maxPriority));

			}

		}

		// Kick off a pending task.
		this.runNextTask();

		if(data.action === Action.EXTRACT) {

			this.consolidate(chunk, data);

		}

	}

	/**
	 * Updates geometry chunks with extracted data.
	 *
	 * @method consolidate
	 * @private
	 * @param {Chunk} chunk - The associated volume chunk.
	 * @param {Object} data - An object containing the extracted geometry data.
	 */

	consolidate(chunk, data) {

		const positions = data.positions;
		const normals = data.normals;
		const indices = data.indices;

		let geometry, mesh;

		// Only create a new mesh if the worker generated data.
		if(positions !== null && normals !== null && indices !== null) {

			this.unlinkMesh(chunk);

			geometry = new BufferGeometry();
			geometry.setIndex(new BufferAttribute(indices, 1));
			geometry.addAttribute("position", new BufferAttribute(positions, 3));
			geometry.addAttribute("normal", new BufferAttribute(normals, 3));

			mesh = new Mesh(geometry, this.material);

			this.meshes.set(chunk, mesh);
			this.add(mesh);

		}

	}

	/**
	 * Runs a pending task if a worker is available.
	 *
	 * @method runNextTask
	 * @private
	 */

	runNextTask() {

		const worker = this.threadPool.getWorker();

		let task, chunk;

		if(worker !== null) {

			task = this.scheduler.poll();

			if(task !== null) {

				chunk = task.chunk;

				if(task.action === Action.MODIFY) {

					worker.postMessage({

						action: task.action,
						chunk: chunk.serialise(),
						sdf: chunk.csg.poll().serialise()

					}, chunk.createTransferList());

					if(chunk.csg.size === 0) {

						chunk.csg = null;

					}

				} else {

					worker.postMessage({

						action: task.action,
						chunk: chunk.serialise()

					}, chunk.createTransferList());

				}

				this.neutered.add(chunk);
				this.chunks.set(worker, chunk);

			}

		}

	}

	/**
	 * Edits the terrain volume data.
	 *
	 * @method edit
	 * @private
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	edit(sdf) {

		const chunks = this.volume.edit(sdf);

		let i, chunk;

		for(i = chunks.length - 1; i >= 0; --i) {

			chunk = chunks[i];

			if(chunk.csg === null) {

				chunk.csg = new Queue();

			}

			chunk.csg.add(sdf);

		}

		this.history.push(sdf);

	}

	/**
	 * Executes the given SDF and adds the generated data to the volume.
	 *
	 * @method union
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	union(sdf) {

		sdf.operation = OperationType.UNION;

		this.edit(sdf);

	}

	/**
	 * Executes the given SDF and subtracts the generated data from the volume.
	 *
	 * @method subtract
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	subtract(sdf) {

		sdf.operation = OperationType.DIFFERENCE;

		this.edit(sdf);

	}

	/**
	 * Executes the given SDF and discards the volume data that doesn't overlap
	 * with the generated data.
	 *
	 * @method intersect
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	intersect(sdf) {

		sdf.operation = OperationType.INTERSECTION;

		this.edit(sdf);

	}

	/**
	 * Updates the terrain geometry. This method should be called each frame.
	 *
	 * @method update
	 * @param {PerspectiveCamera} camera - A camera.
	 */

	update(camera) {

		const chunks = this.volume.cull(
			FRUSTUM.setFromMatrix(
				MATRIX4.multiplyMatrices(
					camera.projectionMatrix,
					camera.matrixWorldInverse
				)
			)
		);

		const scheduler = this.scheduler;
		const maxPriority = scheduler.maxPriority;
		const maxLevel = this.levels - 1;

		let i, l;
		let chunk, data, csg, task;
		let distance, lod;

		for(i = 0, l = chunks.length; i < l; ++i) {

			chunk = chunks[i];
			data = chunk.data;
			csg = chunk.csg;

			if(!this.neutered.has(chunk)) {

				task = scheduler.getTask(chunk);

				if(task === undefined || task.priority < maxPriority) {

					// Modifications take precedence.
					if(csg !== null && csg.size > 0) {

						scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, maxPriority));

						this.runNextTask();

					} else if(data !== null) {

						distance = chunk.getCenter().distanceTo(camera.position);
						lod = Math.min(maxLevel, Math.trunc(distance / camera.far * this.levels));

						if(data.lod !== lod) {

							data.lod = lod;

							scheduler.schedule(chunk, new WorkerTask(Action.EXTRACT, chunk, maxLevel - data.lod));

							this.runNextTask();

						}

					}

				}

			}

		}

	}

	/**
	 * Finds the terrain chunks that intersect with the given ray and raycasts the
	 * associated meshes.
	 *
	 * @method raycast
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with terrain intersections.
	 */

	raycast(raycaster, intersects) {

		const chunks = [];

		let i, l;

		this.volume.raycast(raycaster, chunks);

		for(i = 0, l = chunks.length; i < l; ++i) {

			if(this.meshes.has(chunks[i])) {

				this.meshes.get(chunks[i]).raycast(raycaster, intersects);

			}

		}

	}

	/**
	 * Resets this terrain by disposing of all data and worker threads.
	 *
	 * @method dispose
	 */

	dispose() {

		let child;

		while(this.children.length > 0) {

			child = this.children[0];
			child.geometry.dispose();
			child.material.dispose();
			this.remove(child);

		}

		this.volume = new Volume(this.volume.chunkSize, this.volume.resolution);

		this.threadPool.clear();
		this.scheduler.clear();

		this.history = [];

		this.neutered.clear();
		this.chunks.clear();
		this.meshes.clear();

	}

	/**
	 * Loads a volume.
	 *
	 * @method load
	 * @param {String} data - The volume data to import.
	 */

	load(data) {

		this.dispose();
		this.volume.load(JSON.parse(data));

	}

	/**
	 * Saves the current volume data.
	 *
	 * @method save
	 * @return {String} A URL to the exported data.
	 */

	save() {

		return URL.createObjectURL(new Blob([JSON.stringify(this.volume)], { type: "text/json" }));

	}

}
