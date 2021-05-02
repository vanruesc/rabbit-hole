import { Action } from "./Action";
import { Demo } from "three-demo";
import workerProgram from "../../../../tmp/worker.txt";

/**
 * A list of available tests.
 *
 * @type {String[]}
 * @private
 */

const tests = [
	"Compression",
	"Decompression",
	"Contouring",
	"CSG",
	"SVO"
];

/**
 * A voxel demo setup that showcases the QEF calculation.
 *
 * @implements {EventListener}
 */

export class VoxelDemo extends Demo {

	/**
	 * Constructs a new voxel demo.
	 */

	constructor() {

		super("voxel");

		/**
		 * The test runner.
		 */

		this.worker = null;

	}

	/**
	 * Sets the resolution.
	 *
	 * @private
	 * @param {Number} resolution - The resolution.
	 */

	setResolution(value) {

		this.worker.postMessage({
			action: Action.CONFIGURE,
			resolution: value
		});

	}

	/**
	 * Runs the specified test.
	 *
	 * @private
	 * @param {Event} event - An event.
	 */

	runTest(event) {

		const id = event.target.id;
		const h3 = document.createElement("h3");

		h3.append(document.createTextNode("Running " + id + " Test\u2026"));
		document.querySelector(".test-results").append(h3);
		// document.querySelector(".mask").removeAttribute("class");

		this.worker.postMessage({
			action: Action.TEST,
			id
		});

	}

	/**
	 * Shows the result of test that has been completed.
	 *
	 * @private
	 * @param {Event} event - A worker message.
	 */

	showResult(event) {

		const response = event.data;
		const div = document.createElement("div");
		const span = document.createElement("span");
		const a = document.createElement("a");

		a.href = response.reportURL;
		a.setAttribute("download", response.reportName + ".log");
		a.classList.add("report");
		a.append(document.createTextNode("Report \u2b73"));

		span.append(document.createTextNode("Test complete"));
		span.classList.add("status");
		span.append(a);

		div.classList.add("result");
		div.append(span);
		div.append(a);

		document.querySelector(".test-results").append(div);
		// document.querySelector(".mask").setAttribute("class", "hidden");

	}

	/**
	 * Handles events.
	 *
	 * @param {DataEvent} event - An event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "click":
				this.runTest(event);
				break;

			case "message":
				this.showResult(event);
				break;

			case "error":
				console.error("Encountered a worker error", event);
				break;

		}

	}

	initialize() {

		const viewport = document.getElementById("viewport");
		const container = document.createElement("div");
		const results = document.createElement("div");
		const ul = document.createElement("ul");

		// Create the interface.
		container.classList.add("performance-tests");
		results.classList.add("test-results");

		for(const test of tests) {

			const li = document.createElement("li");

			const a = document.createElement("a");
			a.append(document.createTextNode(test));
			a.setAttribute("href", "#" + test);
			a.setAttribute("id", test);
			a.addEventListener("click", this);

			li.append(a);
			ul.append(li);

		}

		container.append(ul);
		container.append(results);
		viewport.append(container);

		// Initialize the worker thread.
		const workerURL = URL.createObjectURL(new Blob([workerProgram], {
			type: "text/javascript"
		}));

		const worker = this.worker = new Worker(workerURL);
		URL.revokeObjectURL(workerURL);

		worker.addEventListener("message", this);
		worker.addEventListener("error", this);

	}

	registerOptions(menu) {

		const params = {
			"resolution": 64
		};

		menu.add(params, "resolution", [32, 64, 128])
			.onChange((value) => this.setResolution(value));

	}

	dispose() {

		document.querySelector(".performance-tests").remove();

	}

}
