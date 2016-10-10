import { Octree } from "sparse-octree";
import { Vector3, QEFSolver } from "../math";
import { Cell } from "./cell.js";
import { DrawInfo } from "./draw-info.js";

/**
 * A cubic voxel octree.
 *
 * @class VoxelBlock
 * @submodule octree
 * @extends Octree
 * @constructor
 * @param {Chunk} chunk - A volume chunk.
 */

export class VoxelBlock extends Octree {

	constructor(min, size) {

		super();

		this.root = new Cell(min, size);

	}

	/**
	 * Simplifies the given octant node.
	 *
	 * @method simplify
	 * @private
	 * @static
	 * @param {Octant} node - The node to simplify. 
	 * @param {Number} threshold - A QEF error threshold.
	 */

	static simplify(node, threshold) {

		const signs = [-1, -1, -1, -1, -1, -1, -1, -1];

		let qef;

		let midSign, edgeCount;
		let isCollapsible;

		let position, drawInfo;
		let child, error;
		let min, size;

		let i;

		if(node !== null && node.type === OctantType.Internal) {

			qef = new QEFSolver();

			midSign = -1;
			edgeCount = 0;

			isCollapsible = true;

			for(i = 0; i < 8; ++i) {

				node.children[i] = this.simplify(node.children[i], threshold);

				if(node.children[i] !== null) {

					child = node.children[i];

					if(child.type === OctantType.Internal) {

						isCollapsible = false;

					} else {

						qef.addData(child.drawInfo.qef);

						midSign = (child.drawInfo.materials >> (7 - i)) & 1; 
						signs[i] = (child.drawInfo.materials >> i) & 1; 

						++edgeCount;

					}

				}

			}

			if(isCollapsible) {

				// There are no internal children.
				position = new Vector3();
				position.copy(qef.solve());
				error = qef.error;

				if(error <= threshold) {

					// Collapse doesn't breach the threshold.
					min = node.min;
					size = node.size;

					if(position.x < min.x || position.x > (min.x + size) ||
						position.y < min.y || position.y > (min.y + size) ||
						position.z < min.z || position.z > (min.z + size)) {

						position.copy(qef.massPoint);

					}

					// Create a psuedo leaf.
					drawInfo = new DrawInfo();
					drawInfo.averageNormal = new Vector3();

					for(i = 0; i < 8; ++i) {

						if(signs[i] === -1) {

							// Undetermined, use mid sign instead.
							drawInfo.materials |= (midSign << i);

						} else {

							drawInfo.materials |= (signs[i] << i);

						}

						child = node.children[i];

						if(child !== null) {

							if(child.type !== OctantType.Internal) {

								drawInfo.averageNormal.add(child.drawInfo.averageNormal);

							}

						}

						// Drop the child node.
						node.children[i] = null;

					}

					drawInfo.averageNormal.normalize();
					drawInfo.position = position;
					drawInfo.qef = qef.data;

					node.type = OctantType.Psuedo;
					node.drawInfo = drawInfo;

				}

			}

		}

		return node;

	}

	/**
	 * 
	 *
	 * @method constructLeaf
	 * @private
	 * @static
	 */

	constructLeaf(leaf) {

		// The surface cannot pass through more than six edges.
		const MAX_CROSSINGS = 6;

		const cornerPos = new Vector3();
		const averageNormal = new Vector3();

		const v = new Vector3();
		const p1 = new Vector3();
		const p2 = new Vector3();

		let qef;

		let materials, density;
		let material, edgeCount;

		let i;

		let c1, c2, m1, m2;
		let min, size;
		let p, n;

		let drawInfo;

		if(leaf !== null && leaf.size === 1) {

			materials = 0;

			for(i = 0; i < 8; ++i) {

				cornerPos.addVectors(leaf.min, v.fromArray(vertexMap[i]));

				density = this.chunk.sample(cornerPos);
				material = (density < 0) ? Density.SOLID : Density.HOLLOW;

				materials = materials | (material << i);

			}

			if(materials === 0 || materials === 255) {

				// Voxel is fully inside or outside the volume.
				leaf = null;

			} else {

				// The voxel contains the surface, so find the edge intersections.
				qef = new QEFSolver();
				edgeCount = 0;

				for(i = 0; i < 12 && edgeCount < MAX_CROSSINGS; ++i) {

					c1 = EDGE_MAP[i][0];
					c2 = EDGE_MAP[i][1];

					m1 = (materials >> c1) & 1;
					m2 = (materials >> c2) & 1;

					// Check if there is a zero crossing on the edge.
					if(m1 !== m2) {

						p1.addVectors(leaf.min, v.fromArray(vertexMap[c1]));
						p2.addVectors(leaf.min, v.fromArray(vertexMap[c2]));

						p = this.approximateZeroCrossingPosition(p1, p2, this.densityFunction, 8);
						n = this.calculateSurfaceNormal(this.densityFunction, p);

						qef.add(p, n);

						averageNormal.add(n);

						++edgeCount;

					}

				}

				p.copy(qef.solve());

				drawInfo = new DrawInfo();
				drawInfo.position = p;
				drawInfo.qef = qef.data;

				min = leaf.min;
				size = leaf.size;

				// Check if the computed position lies outside the voxel's bounds.
				if(drawInfo.position.x < min.x || drawInfo.position.x > min.x + size ||
					drawInfo.position.y < min.y || drawInfo.position.y > min.y + size ||
					drawInfo.position.z < min.z || drawInfo.position.z > min.z + size) {

					drawInfo.position.copy(qef.massPoint);

				}

				drawInfo.averageNormal = averageNormal.divideScalar(edgeCount).normalize();
				drawInfo.materials = materials;

				leaf.type = OctantType.Leaf;
				leaf.drawInfo = drawInfo;

			}

		}

		return leaf;

	}

	/**
	 * 
	 *
	 * @method constructOctants
	 * @private
	 * @static
	 */

	static constructOctants(node) {

		const v = new Vector3();

		let childSize;
		let hasChildren = false;
		let min, child;

		let i;

		if(node !== null) {

			if(node.size === 1) {

				node = this.constructLeaf(node);

			} else {

				childSize = node.size >> 1;

				for(i = 0; i < 8; ++i) {

					min = new Vector3();
					min.addVectors(node.min, v.fromArray(vertexMap[i]).multiplyScalar(childSize));

					child = new Octant(min, childSize, OctantType.Internal);

					node.children[i] = this.constructOctants(child);
					hasChildren = hasChildren | (node.children[i] !== null);

				}

				if(!hasChildren) {

					node = null;

				}

			}

		}

		return node;

	}

}
