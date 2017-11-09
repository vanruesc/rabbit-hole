import {
	FileLoader,
	LoadingManager,
	RepeatWrapping,
	TextureLoader
} from "three";

import { Detector, FeatureId } from "feature-detector";
import { App } from "./App.js";

/**
 * Loads assets.
 *
 * @private
 * @param {Function} callback - A function to call on completion. Assets will be provided as a parameter.
 */

function loadAssets(callback) {

	const assets = new Map();

	const loadingManager = new LoadingManager();
	const fileLoader = new FileLoader(loadingManager);
	const textureLoader = new TextureLoader(loadingManager);

	loadingManager.onProgress = function onProgress(item, loaded, total) {

		if(loaded === total) {

			callback(assets);

		}

	};

	fileLoader.load("terrain/sphere.json", function(text) {

		assets.set("terrain", text);

	});

	textureLoader.load("textures/diffuse/05.jpg", function(texture) {

		texture.wrapS = texture.wrapT = RepeatWrapping;
		assets.set("diffuseXZ", texture);

	});

	textureLoader.load("textures/diffuse/03.jpg", function(texture) {

		texture.wrapS = texture.wrapT = RepeatWrapping;
		assets.set("diffuseY", texture);

	});

	textureLoader.load("textures/normal/05.png", function(texture) {

		texture.wrapS = texture.wrapT = RepeatWrapping;
		assets.set("normalmapXZ", texture);

	});

	textureLoader.load("textures/normal/03.png", function(texture) {

		texture.wrapS = texture.wrapT = RepeatWrapping;
		assets.set("normalmapY", texture);

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
 * Starts the volume editor.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

	window.removeEventListener("load", main);

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

		loadAssets(function(assets) {

			viewport.removeChild(viewport.children[0]);
			aside.style.visibility = "visible";
			App.initialise(viewport, aside, assets);

		});

	} else {

		viewport.removeChild(viewport.children[0]);
		viewport.appendChild(createErrorMessage(missingFeatures));

	}

});
