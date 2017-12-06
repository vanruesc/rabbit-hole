import workerCode from "./worker.tmp";

/**
 * An object URL that points to the worker program.
 *
 * @type {String}
 * @private
 */

const workerURL = URL.createObjectURL(new Blob([workerCode], { type: "text/javascript" }));

/**
 * A worker.
 *
 * @type {Worker}
 * @private
 */

let worker = null;

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
 * Runs the specified test.
 *
 * @private
 * @param {Event} event - An event.
 */

function runTest(event) {

	const id = event.target.id;
	const h3 = document.createElement("h3");

	h3.appendChild(document.createTextNode("Running " + id + "\u2026"));
	document.getElementById("aside").appendChild(h3);
	document.getElementById("mask").removeAttribute("class");

	worker.postMessage(id);

}

/**
 * Shows the result of test that has been completed.
 *
 * @private
 * @param {Event} event - A worker message.
 */

function showResult(event) {

	const response = event.data;
	const div = document.createElement("div");
	const span = document.createElement("span");
	const a = document.createElement("a");

	a.href = response.reportURL;
	a.setAttribute("download", response.reportName + ".log");
	a.setAttribute("class", "report");
	a.appendChild(document.createTextNode("Report \u2b73"));

	span.appendChild(document.createTextNode("Test complete"));
	span.setAttribute("class", "status");
	span.appendChild(a);

	div.setAttribute("class", "result");
	div.appendChild(span);
	div.appendChild(a);

	document.getElementById("aside").appendChild(div);
	document.getElementById("mask").setAttribute("class", "hidden");

}

/**
 * Creates a list of available tests.
 *
 * @private
 */

function showAvailableTests() {

	const main = document.getElementById("main");
	const ul = document.createElement("ul");

	let test, li, a;

	for(test of tests) {

		li = document.createElement("li");

		a = document.createElement("a");
		a.appendChild(document.createTextNode(test));
		a.setAttribute("href", "#" + test);
		a.setAttribute("id", test);
		a.addEventListener("click", runTest);

		li.appendChild(a);
		ul.appendChild(li);

	}

	main.appendChild(ul);

}

/**
 * Handles worker events.
 *
 * @param {Event} event - An event.
 */

function handleEvent(event) {

	switch(event.type) {

		case "message":
			showResult(event);
			break;

		case "error":
			console.error("Encountered an unexpected error", event);
			break;

	}

}

/**
 * Starts the program.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

	const id = window.location.hash.slice(1);
	window.removeEventListener("load", main);

	// Initialise the worker thread.
	worker = new Worker(workerURL);
	worker.addEventListener("message", handleEvent);
	worker.addEventListener("error", handleEvent);

	showAvailableTests();

	if(tests.indexOf(id) !== -1) {

		runTest(id);

	}

});
