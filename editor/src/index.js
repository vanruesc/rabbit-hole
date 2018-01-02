import {
	FileLoader,
	LoadingManager,
	RepeatWrapping,
	TextureLoader
} from "three";

import { Detector, FeatureId } from "feature-detector";
import { Editor } from "./Editor.js";

/**
 * An editor.
 *
 * @type {Editor}
 * @private
 */

let editor;

/**
 * Loads assets.
 *
 * @private
 * @return {Promise} A promise that will be fulfilled as soon as all assets have been loaded.
 */

function loadAssets(callback) {

	const assets = new Map();

	const loadingManager = new LoadingManager();
	const fileLoader = new FileLoader(loadingManager);
	const textureLoader = new TextureLoader(loadingManager);

	return new Promise((resolve, reject) => {

		loadingManager.onError = reject;
		loadingManager.onProgress = (item, loaded, total) => {

			if(loaded === total) {

				resolve(assets);

			}

		};

		fileLoader.load("terrain/sphere.json", (text) => {

			assets.set("terrain", text);

		});

		textureLoader.load("textures/diffuse/05.jpg", (texture) => {

			texture.wrapS = texture.wrapT = RepeatWrapping;
			assets.set("diffuseXZ", texture);

		});

		textureLoader.load("textures/diffuse/03.jpg", (texture) => {

			texture.wrapS = texture.wrapT = RepeatWrapping;
			assets.set("diffuseY", texture);

		});

		textureLoader.load("textures/normal/05.png", (texture) => {

			texture.wrapS = texture.wrapT = RepeatWrapping;
			assets.set("normalmapXZ", texture);

		});

		textureLoader.load("textures/normal/03.png", (texture) => {

			texture.wrapS = texture.wrapT = RepeatWrapping;
			assets.set("normalmapY", texture);

		});

	});

}

/**
 * Generates an error message and lists missing key features.
 *
 * @private
 * @param {Feature[]} missingFeatures - A list of missing features.
 * @return {HTMLElement} An element that contains the error message.
 */

function createErrorMessage(missingFeatures) {

	const message = document.createElement("p");
	const missingFeatureList = document.createElement("ul");

	let feature;
	let i, l;

	for(i = 0, l = missingFeatures.length; i < l; ++i) {

		feature = document.createElement("li");
		feature.appendChild(document.createTextNode(missingFeatures[i]));
		missingFeatureList.appendChild(feature);

	}

	message.appendChild(document.createTextNode("The following features are missing:"));
	message.appendChild(missingFeatureList);

	return message;

}

/**
 * The main render loop.
 *
 * @private
 * @param {DOMHighResTimeStamp} now - The current time.
 */

function render(now) {

	requestAnimationFrame(render);
	editor.render(now);

}

/**
 * Starts the program.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

	this.removeEventListener("load", main);

	const viewport = document.getElementById("viewport");
	const aside = document.getElementById("aside");

	const detector = new Detector();
	const missingFeatures = detector.getMissingFeatures(
		FeatureId.CANVAS,
		FeatureId.WEBGL,
		FeatureId.WORKER,
		FeatureId.FILE
	);

	if(missingFeatures === null) {

		loadAssets().then((assets) => {

			viewport.removeChild(viewport.children[0]);
			aside.style.visibility = "visible";
			editor = new Editor(viewport, aside, assets);

			render();

		}).catch((e) => console.log(e));

	} else {

		viewport.removeChild(viewport.children[0]);
		viewport.appendChild(createErrorMessage(missingFeatures));

	}

});

/**
 * Handles browser resizing.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("resize", (function() {

	let timeoutId = 0;

	function handleResize(event) {

		const width = event.target.innerWidth;
		const height = event.target.innerHeight;

		editor.setSize(width, height);

		timeoutId = 0;

	}

	return function onResize(event) {

		if(timeoutId === 0) {

			timeoutId = setTimeout(handleResize, 66, event);

		}

	};

}()));
