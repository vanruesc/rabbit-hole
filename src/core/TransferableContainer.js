/**
 * The TransferableContainer contract.
 *
 * Implemented by objects that can list their internal transferable objects.
 *
 * @interface
 */

export class TransferableContainer {

	/**
	 * Creates a list of transferable items.
	 *
	 * The `Transferable` interface represents an object that can be transferred
	 * between different execution contexts, like the main thread and Web Workers.
	 *
	 * For example, `Worker.postMessage()` takes an optional array of
	 * `Transferable` objects to transfer ownership of. If the ownership of an
	 * object is transferred, it becomes unusable (neutered) in the context it was
	 * sent from and becomes available only to the worker it was sent to.
	 * `Transferable` objects are instances of classes like `ArrayBuffer`,
	 * `MessagePort` or `ImageBitmap`.
	 *
	 * @param {Array} [transferList] - An optional target list. The transferable items will be added to this list.
	 * @return {Transferable[]} The transfer list. Null is not an acceptable value for the transferList.
	 */

	createTransferList(transferList = []) {}

}
