import {
	CubeTextureLoader,
	FileLoader,
	LoadingManager,
	RepeatWrapping,
	TextureLoader
} from "three";

import { Detector } from "./detector.js";
import { App } from "./app.js";

/**
 * The entry point of the volume editor.
 *
 * @class Main
 * @static
 */

/**
 * Loads assets.
 *
 * @method loadAssets
 * @private
 * @static
 * @param {Function} callback - A function to call on completion. Assets will be provided as a parameter.
 */

function loadAssets(callback) {

	const assets = new Map();

	const loadingManager = new LoadingManager();
	const fileLoader = new FileLoader(loadingManager);
	const textureLoader = new TextureLoader(loadingManager);
	const cubeTextureLoader = new CubeTextureLoader(loadingManager);

	const path = "textures/cube/01/";
	const format = ".png";
	const urls = [
		path + "px" + format, path + "nx" + format,
		path + "py" + format, path + "ny" + format,
		path + "pz" + format, path + "nz" + format
	];

	loadingManager.onProgress = function onProgress(item, loaded, total) {

		if(loaded === total) { callback(assets); }

	};

	cubeTextureLoader.load(urls, function(textureCube) {

		assets.set("sky", textureCube);

	});

	fileLoader.load("terrain/torus.json", function(text) {

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
 * @method createErrorMessage
 * @private
 * @static
 * @param {Detector} detector - A detector.
 * @return {HTMLElement} An element that contains the error message.
 */

function createErrorMessage(detector) {

	const message = document.createElement("p");
	const features = document.createElement("ul");

	let feature;

	if(!detector.canvas) {

		feature = document.createElement("li");
		feature.appendChild(document.createTextNode("Canvas"));
		features.appendChild(feature);

	}

	if(!detector.webgl) {

		feature = document.createElement("li");
		feature.appendChild(document.createTextNode("WebGL"));
		features.appendChild(feature);

	}

	if(!detector.worker) {

		feature = document.createElement("li");
		feature.appendChild(document.createTextNode("Worker"));
		features.appendChild(feature);

	}

	if(!detector.file) {

		feature = document.createElement("li");
		feature.appendChild(document.createTextNode("Blob"));
		features.appendChild(feature);

	}

	message.appendChild(document.createTextNode("Missing the following core features:"));
	message.appendChild(features);

	return message;

}

/**
 * Starts the volume editor.
 *
 * @method main
 * @private
 * @static
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

	window.removeEventListener("load", main);

	const viewport = document.getElementById("viewport");
	const aside = document.getElementById("aside");

	const detector = new Detector();

	if(detector.canvas && detector.webgl && detector.worker && detector.file) {

		loadAssets(function(assets) {

			viewport.removeChild(viewport.children[0]);
			aside.style.visibility = "visible";
			App.initialise(viewport, aside, assets);

		});

	} else {

		viewport.removeChild(viewport.children[0]);
		viewport.appendChild(createErrorMessage(detector));

	}

});
