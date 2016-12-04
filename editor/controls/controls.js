import { Spherical, Vector3 } from "three";
import { MovementState } from "./movement-state.js";
import { Button } from "./button.js";
import { Key } from "./key.js";

/**
 * Two PI.
 *
 * @property TWO_PI
 * @type Number
 * @private
 * @static
 * @final
 */

const TWO_PI = 2 * Math.PI;

/**
 * Movement controls driven by user input.
 *
 * @class Controls
 * @implements EventListener
 * @constructor
 * @param {Object3D} object - An object, usually a camera.
 * @param {Element} [dom=document.body] - A dom element.
 */

export class Controls {

	constructor(object, dom = document.body) {

		/**
		 * An object.
		 *
		 * @property object
		 * @type Object3D
		 * @private
		 */

		this.object = object;

		/**
		 * A dom element.
		 *
		 * @property dom
		 * @type Element
		 */

		this.dom = dom;

		/**
		 * A target.
		 *
		 * @property target
		 * @type Vector3
		 * @private
		 */

		this.target = new Vector3();

		/**
		 * A spherical coordinate system.
		 *
		 * @property spherical
		 * @type Spherical
		 * @private
		 */

		this.spherical = new Spherical();

		/**
		 * The camera movement speed.
		 *
		 * @property movementSpeed
		 * @type Number
		 * @default 1.0
		 */

		this.movementSpeed = 1.0;

		/**
		 * A camera movement boost speed.
		 *
		 * @property boostSpeed
		 * @type Number
		 * @default 2.0
		 */

		this.boostSpeed = 2.0;

		/**
		 * The camera look speed.
		 *
		 * @property lookSpeed
		 * @type Number
		 * @default 0.002
		 */

		this.lookSpeed = 0.002;

		/**
		 * A movement state.
		 *
		 * @property state
		 * @type MovementState
		 * @private
		 */

		this.state = new MovementState();

		this.setEnabled(true);

	}

	/**
	 * Handles events.
	 *
	 * @method handleEvent
	 * @param {Event} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "mousemove":
				this.look(event);
				break;

			case "mousedown":
				this.handlePointerEvent(event, true);
				break;

			case "mouseup":
				this.handlePointerEvent(event, false);
				break;

			case "keydown":
				this.changeMovementState(event, true);
				break;

			case "keyup":
				this.changeMovementState(event, false);
				break;

			case "pointerlockchange":
				this.handlePointerLock();
				break;

		}

	}

	/**
	 * Enables or disables the look controls based on the pointer lock state.
	 *
	 * @method handlePointerLock
	 * @private
	 */

	handlePointerLock() {

		if(document.pointerLockElement === this.dom) {

			this.dom.addEventListener("mousemove", this);

		} else {

			this.dom.removeEventListener("mousemove", this);

		}

	}

	/**
	 * Handles pointer events.
	 *
	 * @method handlePointerEvent
	 * @private
	 * @param {MouseEvent} event - A mouse event.
	 * @param {Boolean} pressed - Whether the mouse button has been pressed down.
	 */

	handlePointerEvent(event, pressed) {

		event.preventDefault();

		switch(event.button) {

			case Button.MAIN:
				this.handleMain(pressed);
				break;

			case Button.AUXILIARY:
				this.handleAuxiliary(pressed);
				break;

			case Button.SECONDARY:
				this.handleSecondary(pressed);
				break;

		}

	}

	/**
	 * Handles main pointer button events.
	 *
	 * @method handleMain
	 * @private
	 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
	 */

	handleMain(pressed) {

		if(document.pointerLockElement !== this.dom && pressed) {

			this.dom.requestPointerLock();

		} else {

			document.exitPointerLock();

		}

	}

	/**
	 * Handles auxiliary pointer button events.
	 *
	 * @method handleAuxiliary
	 * @private
	 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
	 */

	handleAuxiliary(pressed) {

	}

	/**
	 * Handles secondary pointer button events.
	 *
	 * @method handleSecondary
	 * @private
	 * @param {Boolean} pressed - Whether the pointer button has been pressed down.
	 */

	handleSecondary(pressed) {

		this.handleMain(pressed);

	}

	/**
	 * Changes the movement state.
	 *
	 * @method changeMovementState
	 * @private
	 * @param {KeyboardEvent} event - A keyboard event.
	 * @param {Boolean} s - The target state.
	 */

	changeMovementState(event, s) {

		const state = this.state;

		switch(event.keyCode) {

			case Key.WASD[0]:
			case Key.ARROWS[1]:
				state.forward = s;
				break;

			case Key.WASD[1]:
			case Key.ARROWS[0]:
				state.left = s;
				break;

			case Key.WASD[2]:
			case Key.ARROWS[3]:
				state.backward = s;
				break;

			case Key.WASD[3]:
			case Key.ARROWS[2]:
				state.right = s;
				break;

			case Key.SPACE:
				event.preventDefault();
				state.up = s;
				break;

			case Key.X:
				state.down = s;
				break;

			case Key.SHIFT:
				state.boost = s;
				break;

		}

	}

	/**
	 * Rotates the object.
	 *
	 * @method look
	 * @private
	 * @param {MouseEvent} event - A mouse event.
	 */

	look(event) {

		const s = this.spherical;

		s.theta -= event.movementX * this.lookSpeed;
		s.phi += event.movementY * this.lookSpeed;

		s.theta %= TWO_PI;
		s.makeSafe();

		this.object.lookAt(
			this.target.setFromSpherical(s).add(this.object.position)
		);

	}

	/**
	 * Moves the object.
	 *
	 * @method move
	 * @private
	 * @param {Number} delta - A delta time, in seconds.
	 */

	move(delta) {

		const object = this.object;
		const state = this.state;

		const step = delta * (state.boost ? this.boostSpeed : this.movementSpeed);

		if(state.backward) {

			object.translateZ(step);

		} else if(state.forward) {

			object.translateZ(-step);

		}

		if(state.right) {

			object.translateX(step);

		} else if(state.left) {

			object.translateX(-step);

		}

		if(state.up) {

			object.translateY(step);

		} else if(state.down) {

			object.translateY(-step);

		}

	}

	/**
	 * Updates the controls to advance movement calculations.
	 *
	 * @method update
	 * @private
	 * @param {Number} delta - A delta time, in seconds.
	 */

	update(delta) {

		this.move(delta);

	}

	/**
	 * Focuses the object on the given target.
	 *
	 * @method focus
	 * @param {Vector3} target - A target.
	 */

	focus(target) {

		this.object.lookAt(target);
		this.target.subVectors(target, this.object.position);
		this.spherical.setFromVector3(this.target);

	}

	/**
	 * Enables or disables the controls.
	 *
	 * @method setEnabled
	 * @param {Boolean} enabled - Whether the controls should be enabled or disabled.
	 */

	setEnabled(enabled) {

		const dom = this.dom;

		this.state.reset();

		if(enabled) {

			document.addEventListener("pointerlockchange", this);
			document.body.addEventListener("keyup", this);
			document.body.addEventListener("keydown", this);
			dom.addEventListener("mouseup", this);
			dom.addEventListener("mousedown", this);

		} else {

			document.removeEventListener("pointerlockchange", this);
			document.body.removeEventListener("keyup", this);
			document.body.removeEventListener("keydown", this);
			dom.removeEventListener("mouseup", this);
			dom.removeEventListener("mousedown", this);
			dom.removeEventListener("mousemove", this);

		}

	}

	/**
	 * Removes all event listeners.
	 *
	 * @method dispose
	 */

	dispose() { this.setEnabled(false); }

}
