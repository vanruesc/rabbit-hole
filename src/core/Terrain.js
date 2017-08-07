import { Box3, BufferAttribute, BufferGeometry, Frustum, Mesh, Matrix4, Object3D } from "three";
import { EventTarget } from "synthetic-event";
import { MeshTriplanarPhysicalMaterial } from "../materials";
import { Volume } from "../volume/octree/Volume.js";
import { OperationType } from "../volume/csg/OperationType.js";
import { SDFReviver } from "../volume/sdf/SDFReviver.js";
import { Action } from "../worker/Action.js";
import { ThreadPool } from "../worker/ThreadPool.js";
import { WorkerTask } from "../worker/WorkerTask.js";
import { History } from "./History.js";
import { Scheduler } from "./Scheduler.js";
import { Queue } from "./Queue.js";
import * as events from "./terrain-events.js";

/**
 * A 3D box.
 *
 * @type {Box3}
 * @private
 */

const box3 = new Box3();

/**
 * A 4x4 matrix.
 *
 * @type {Matrix4}
 * @private
 */

const matrix4 = new Matrix4();

/**
 * The terrain system.
 *
 * @implements {EventListener}
 */

export class Terrain extends EventTarget {

	/**
	 * Constructs a new terrain.
	 *
	 * @param {Object} [options] - The options.
	 * @param {Number} [options.chunkSize=32] - The world size of a volume chunk. Will be rounded up to the next power of two.
	 * @param {Number} [options.resolution=32] - The resolution of a volume chunk. Will be rounded up to the next power of two.
	 * @param {Number} [options.workers] - Limits the amount of active workers. The default limit is the amount of logical processors which is also the maximum.
	 * @param {Number} [options.levels] - The amount of detail levels. The default number of levels is derived from the resolution.
	 * @param {Number} [options.iterations] - Limits the amount of volume chunks that are being processed during each update.
	 */

	constructor(options = {}) {

		super();

		/**
		 * The terrain object. Add this to your scene.
		 *
		 * @type {Object3D}
		 */

		this.object = new Object3D();
		this.object.name = "Terrain";

		/**
		 * The volume of this terrain.
		 *
		 * @type {Volume}
		 */

		this.volume = new Volume(options.chunkSize, options.resolution);

		/**
		 * A volume chunk iterator.
		 *
		 * @type {Iterator}
		 * @private
		 */

		this.iterator = this.volume.leaves(new Frustum());

		/**
		 * The number of detail levels.
		 *
		 * Terrain chunks that are further away from the camera will be rendered
		 * with less vertices.
		 *
		 * @type {Number}
		 * @private
		 * @default log2(resolution)
		 */

		this.levels = (options.levels !== undefined) ? Math.max(1, options.levels) : Math.log2(this.volume.resolution);

		/**
		 * The maximum amount of chunk iterations per update.
		 *
		 * Volume chunks that lie in the field of view will be processed over the
		 * course of several update calls.
		 *
		 * @type {Number}
		 * @private
		 * @default 1000
		 */

		this.iterations = (options.iterations !== undefined) ? Math.max(1, options.iterations) : 1000;

		/**
		 * A thread pool.
		 *
		 * @type {ThreadPool}
		 * @private
		 */

		this.threadPool = new ThreadPool(options.workers);
		this.threadPool.addEventListener("message", this);

		/**
		 * Manages pending tasks.
		 *
		 * @type {Scheduler}
		 * @private
		 */

		this.scheduler = new Scheduler(this.levels + 1);

		/**
		 * A chronological sequence of CSG operations that have been executed during
		 * this session.
		 *
		 * @type {History}
		 */

		this.history = new History();

		/**
		 * Keeps track of chunks that are currently being used by a worker. The
		 * amount of neutered chunks cannot exceed the amount of worker threads.
		 *
		 * @type {WeakSet}
		 * @private
		 */

		this.neutered = new WeakSet();

		/**
		 * Keeps track of associations between workers and chunks.
		 *
		 * @type {WeakMap}
		 * @private
		 */

		this.chunks = new WeakMap();

		/**
		 * Keeps track of associations between chunks and meshes.
		 *
		 * @type {WeakMap}
		 * @private
		 */

		this.meshes = new WeakMap();

		/**
		 * The terrain material.
		 *
		 * @type {MeshTriplanarPhysicalMaterial}
		 */

		this.material = new MeshTriplanarPhysicalMaterial();

	}

	/**
	 * Lifts the connection of a given chunk to its mesh and removes the geometry.
	 *
	 * @private
	 * @param {Chunk} chunk - A volume chunk.
	 */

	unlinkMesh(chunk) {

		let mesh;

		if(this.meshes.has(chunk)) {

			mesh = this.meshes.get(chunk);
			mesh.geometry.dispose();

			this.meshes.delete(chunk);
			this.object.remove(mesh);

		}

	}

	/**
	 * Handles worker events.
	 *
	 * @param {WorkerEvent} event - A worker message event.
	 */

	handleEvent(event) {

		const worker = event.worker;
		const data = event.data;

		// Find the chunk that has been processed by this worker.
		const chunk = this.chunks.get(worker);

		this.neutered.delete(chunk);
		this.chunks.delete(worker);

		// Reclaim ownership of the chunk data.
		chunk.deserialise(data.chunk);

		if(chunk.data === null && chunk.csg === null) {

			// The chunk has become empty. Remove it.
			this.scheduler.cancel(chunk);
			this.volume.prune(chunk);
			this.unlinkMesh(chunk);

		} else if(chunk.csg !== null) {

			// Drain the CSG queue as fast as possible.
			this.scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, this.scheduler.maxPriority));

		}

		if(data.action !== Action.CLOSE) {

			if(data.action === Action.EXTRACT) {

				event = events.extractionend;

				this.consolidate(chunk, data);

			} else {

				event = events.modificationend;

			}

			event.chunk = chunk;

			this.dispatchEvent(event);

		} else {

			console.error(data.error);

		}

		// Kick off a pending task.
		this.runNextTask();

	}

	/**
	 * Updates geometry chunks with extracted data.
	 *
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
			geometry.computeBoundingSphere();

			mesh = new Mesh(geometry, this.material);

			this.meshes.set(chunk, mesh);
			this.object.add(mesh);

		}

	}

	/**
	 * Runs a pending task if a worker is available.
	 *
	 * @private
	 */

	runNextTask() {

		let task, worker, chunk, event;

		if(this.scheduler.peek() !== null) {

			worker = this.threadPool.getWorker();

			if(worker !== null) {

				task = this.scheduler.poll();
				chunk = task.chunk;

				if(task.action === Action.MODIFY) {

					event = events.modificationstart;

					worker.postMessage({

						action: task.action,
						chunk: chunk.serialise(),
						sdf: chunk.csg.poll().serialise()

					}, chunk.createTransferList());

					if(chunk.csg.size === 0) {

						chunk.csg = null;

					}

				} else {

					event = events.extractionstart;

					worker.postMessage({

						action: task.action,
						chunk: chunk.serialise()

					}, chunk.createTransferList());

				}

				event.chunk = chunk;

				this.neutered.add(chunk);
				this.chunks.set(worker, chunk);
				this.dispatchEvent(event);

			}

		}

	}

	/**
	 * Edits the terrain volume data.
	 *
	 * @private
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	edit(sdf) {

		const chunks = this.volume.edit(sdf);

		let chunk;

		for(chunk of chunks) {

			if(chunk.csg === null) {

				chunk.csg = new Queue();

			}

			chunk.csg.add(sdf);

		}

		this.iterator.reset();
		this.history.push(sdf);

	}

	/**
	 * Executes the given SDF and adds the generated data to the volume.
	 *
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	union(sdf) {

		sdf.operation = OperationType.UNION;

		this.edit(sdf);

	}

	/**
	 * Executes the given SDF and subtracts the generated data from the volume.
	 *
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
	 * @param {SignedDistanceFunction} sdf - An SDF.
	 */

	intersect(sdf) {

		sdf.operation = OperationType.INTERSECTION;

		this.edit(sdf);

	}

	/**
	 * Updates the terrain geometry. This method should be called each frame.
	 *
	 * @param {PerspectiveCamera} camera - A camera.
	 */

	update(camera) {

		const iterator = this.iterator;
		const scheduler = this.scheduler;
		const maxPriority = scheduler.maxPriority;
		const levels = this.levels;
		const maxLevel = levels - 1;

		let i = this.iterations;

		let chunk, data, csg, task;
		let distance, lod;
		let result;

		iterator.region.setFromMatrix(
			matrix4.multiplyMatrices(
				camera.projectionMatrix,
				camera.matrixWorldInverse
			)
		);

		result = iterator.next();

		while(!result.done) {

			chunk = result.value;
			data = chunk.data;
			csg = chunk.csg;

			if(!this.neutered.has(chunk)) {

				task = scheduler.getTask(chunk);

				if(task === undefined || task.priority < maxPriority) {

					// Modifications take precedence.
					if(csg !== null) {

						scheduler.schedule(chunk, new WorkerTask(Action.MODIFY, chunk, maxPriority));

						this.runNextTask();

					} else if(data !== null) {

						distance = box3.copy(chunk).distanceToPoint(camera.position);
						lod = Math.min(maxLevel, Math.trunc(distance / camera.far * levels));

						if(data.lod !== lod) {

							data.lod = lod;

							scheduler.schedule(chunk, new WorkerTask(Action.EXTRACT, chunk, maxLevel - data.lod));

							this.runNextTask();

						}

					}

				}

			}

			if(--i > 0) {

				result = iterator.next();

			} else {

				break;

			}

		}

		if(result.done) {

			this.iterator.reset();

		}

	}

	/**
	 * Finds the terrain chunks that intersect with the given ray and raycasts the
	 * associated meshes.
	 *
	 * Intersections are sorted by distance, closest first.
	 *
	 * @param {Raycaster} raycaster - A raycaster.
	 * @return {Array} A list of terrain intersections.
	 */

	raycast(raycaster) {

		const meshes = this.meshes;
		const chunks = [];

		let intersects = [];
		let chunk;

		let i, l;

		this.volume.raycast(raycaster, chunks);

		for(i = 0, l = chunks.length; i < l; ++i) {

			chunk = chunks[i];

			if(meshes.has(chunk)) {

				intersects = intersects.concat(
					raycaster.intersectObject(meshes.get(chunk))
				);

			}

		}

		return intersects;

	}

	/**
	 * Removes all child meshes.
	 *
	 * @private
	 */

	clearMeshes() {

		const object = this.object;

		let child;

		while(object.children.length > 0) {

			child = object.children[0];
			child.geometry.dispose();
			child.material.dispose();
			object.remove(child);

		}

		this.meshes = new WeakMap();

	}

	/**
	 * Resets this terrain by removing data and closing active worker threads.
	 */

	clear() {

		this.clearMeshes();

		this.volume = new Volume(this.volume.chunkSize, this.volume.resolution);
		this.iterator = this.volume.leaves(new Frustum());

		this.neutered = new WeakSet();
		this.chunks = new WeakMap();

		this.threadPool.clear();
		this.scheduler.clear();
		this.history.clear();

	}

	/**
	 * Destroys this terrain and frees internal resources.
	 */

	dispose() {

		this.clearMeshes();
		this.threadPool.dispose();

	}

	/**
	 * Saves a description of the current volume data.
	 *
	 * @return {String} A URL to the exported save data, or null if there is no data.
	 */

	save() {

		const sdf = this.history.combine();

		return (sdf === null) ? null : URL.createObjectURL(

			new Blob([JSON.stringify(sdf.serialise())], {
				type: "text/json"
			})

		);

	}

	/**
	 * Loads a volume.
	 *
	 * @param {String} data - The volume description to load.
	 */

	load(data) {

		this.clear();

		this.edit(
			SDFReviver.reviveSDF(
				JSON.parse(data)
			)
		);

	}

}
