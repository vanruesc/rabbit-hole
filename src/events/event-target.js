/**
 * An interface implemented by objects that can receive events and may have
 * listeners for them.
 *
 * @class EventTarget
 * @submodule events
 * @constructor
 */

export class EventTarget {

	constructor() {

		/**
		 * A map of event listener functions.
		 *
		 * @property m0
		 * @type Map
		 * @private
		 */

		this.m0 = new Map();

		/**
		 * A map of event listener objects.
		 *
		 * @property m1
		 * @type Map
		 * @private
		 */

		this.m1 = new Map();

	}

	/**
	 * Registers an event handler of a specific event type on the event target.
	 *
	 * @method addEventListener
	 * @param {String} type - The event type to listen for.
	 * @param {Object} listener - The object that receives a notification when an event of the specified type occurs.
	 */

	addEventListener(type, listener) {

		const map = (typeof listener === "function") ? this.m0 : this.m1;

		if(map.has(type)) {

			map.get(type).add(listener);

		} else {

			map.set(type, new Set([listener]));

		}

	}

	/**
	 * Removes an event handler of a specific event type from the event target.
	 *
	 * @method addEventListener
	 * @param {String} type - The event type to remove.
	 * @param {Object} listener - The event listener to remove from the event target.
	 */

	removeEventListener(type, listener) {

		const map = (typeof listener === "function") ? this.m0 : this.m1;

		let listeners;

		if(map.has(type)) {

			listeners = map.get(type);
			listeners.delete(listener);

			if(listeners.size === 0) {

				map.delete(type);

			}

		}

	}

	/**
	 * Dispatches an event at the specified event target, invoking the affected
	 * event listeners in the appropriate order.
	 *
	 * @method dispatchEvent
	 * @param {Event} event - The event to dispatch.
	 * @param {EventTarget} [target] - An event target.
	 */

	dispatchEvent(event, target = this) {

		const m0 = target.m0;
		const m1 = target.m1;

		let listeners;
		let listener;

		event.target = target;

		if(m0.has(event.type)) {

			listeners = m0.get(event.type);

			for(listener of listeners) {

				listener.call(target, event);

			}

		}

		if(m1.has(event.type)) {

			listeners = m1.get(event.type);

			for(listener of listeners) {

				listener.handleEvent(event);

			}

		}

	}

}
