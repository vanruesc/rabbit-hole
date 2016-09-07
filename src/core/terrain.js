import THREE from "three";
import { PriorityQueue } from "./priority-queue.js";
import { Volume } from "../volume";
import { Action, ThreadPool } from "../worker";
// import { TerrainMaterial } from "../materials";

/**
 * A computation helper.
 *
 * @property MATRIX4
 * @type Matrix4
 * @private
 * @static
 * @final
 */

const MATRIX4 = new THREE.Matrix4();

/**
 * A frustum used for octree culling.
 *
 * @property FRUSTUM
 * @type Frustum
 * @private
 * @static
 * @final
 */

const FRUSTUM = new THREE.Frustum();

/**
 * The terrain system.
 *
 * @class Terrain
 * @submodule core
 * @extends Object3D
 * @constructor
 * @param {Object} [options] - The options.
 * @param {Number} [options.levels=6] - The number of detail levels.
 * @param {Number} [options.chunkSize=32] - The size of a voxel chunk. Will be rounded up to the next power of two.
 * @param {Number} [options.resolution=32] - The resolution of a voxel chunk. Will be rounded up to the next power of two.
 * @param {Number} [options.maxWorkers] - Limits the amount of active workers. The default limit is the amount of logical processors.
 */

export class Terrain extends THREE.Object3D {

	constructor(options) {

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
		this.threadPool.onmessage = (event) => this.commit(event);

		/**
		 * Keeps track of pending extraction tasks.
		 *
		 * @property extractions
		 * @type PriorityQueue
		 * @private
		 */

		this.extractions = new PriorityQueue(this.levels);

		/**
		 * Keeps track of pending modification tasks.
		 *
		 * @property modifications
		 * @type Array
		 * @private
		 */

		this.modifications = [];

		/**
		 * A list of CSG operations that have been executed during this session.
		 *
		 * @property history
		 * @type Array
		 */

		this.history = [];

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
		this.material = new THREE.MeshPhongMaterial({
			color: new THREE.Color(0xbb4400)
		});

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
		this.chunks.delete(worker);

		// Reclaim ownership.
		chunk.data.deserialise(data.data);

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

			if(this.meshes.has(chunk)) {

				// Remove existing geometry.
				mesh = this.meshes.get(chunk);
				mesh.geometry.dispose();
				this.remove(mesh);

			}

			geometry = new THREE.BufferGeometry();
			geometry.setIndex(new THREE.BufferAttribute(indices, 1));
			geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
			geometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));

			mesh = new THREE.Mesh(geometry, this.material);

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

		let chunk = null;
		let element, operation;

		if(worker !== null) {

			// Modifications take pecedence.
			if(this.modifications.length > 0) {

				element = this.modifications.pop();

				chunk = element.chunk;
				operation = element.operation;

				worker.postMessage({

					action: Action.MODIFY,
					chunk: chunk.serialise(),
					operation: operation.serialise()

				}, chunk.createTransferList());

			} else if(this.extractions.size > 0) {

				chunk = this.extractions.poll();

				worker.postMessage({

					action: Action.EXTRACT,
					chunk: chunk.serialise()

				}, chunk.createTransferList());

			}

			if(chunk !== null) {

				this.chunks.set(worker, chunk);

			}

		}

	}

	/**
	 * Edits the terrain volume data.
	 *
	 * @method edit
	 * @param {Operation} operation - A CSG operation.
	 */

	edit(operation) {

		const chunks = this.volume.edit(operation);

		let i;

		for(i = chunks.length - 1; i >= 0; --i) {

			chunks[i].csg.add(operation);

		}

		this.history.push(operation);

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
				MATRIX4.identity().multiplyMatrices(
					camera.projectionMatrix,
					camera.matrixWorldInverse
				)
			)
		);

		const viewDistanceSq = camera.far * camera.far;
		const maxLevel = this.levels - 1;

		let i, l;
		let chunk, data;
		let distanceSq, lod;

		for(i = 0, l = chunks.length; i < l; ++i) {

			chunk = chunks[i];
			data = chunk.data;

			if(chunk.csg.size > 0) {

				this.modifications.push({
					chunk: chunk,
					operation: chunk.csg.poll()
				});

				this.runNextTask();

			} else if(data !== null && !data.neutered) {

				distanceSq = chunk.center().distanceToSquared(camera.position);
				lod = Math.min(maxLevel, Math.trunc(Math.sqrt(distanceSq / viewDistanceSq) * this.levels));

				if(data.lod !== lod) {

					// Prevent the same task from being queued multiple times.
					this.extractions.remove(chunk, maxLevel - data.lod);
					this.extractions.add(chunk, maxLevel - lod);

					data.lod = lod;
					this.runNextTask();

				}

			}

		}

	}






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

		this.extractions.clear();
		this.modifications = [];
		this.history = [];

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
