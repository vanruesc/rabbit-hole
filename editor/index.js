import {
	// CubeTextureLoader,
	LoadingManager,
	RepeatWrapping,
	TextureLoader
} from "three";

import { Editor } from "./editor.js";

/**
 * The entry point of the volume editor.
 *
 * @class Main
 * @static
 */

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

	const assets = new Map();

	const loadingManager = new LoadingManager();
	const textureLoader = new TextureLoader(loadingManager);
	/* const cubeTextureLoader = new CubeTextureLoader(loadingManager);

	const path = "textures/skies/sunny/";
	const format = ".png";
	const urls = [
		path + "px" + format, path + "nx" + format,
		path + "py" + format, path + "ny" + format,
		path + "pz" + format, path + "nz" + format
	]; */

	loadingManager.onProgress = function onProgress(item, loaded, total) {

		if(loaded === total) {

			Editor.initialise(
				document.getElementById("viewport"),
				document.getElementById("aside"),
				assets
			);

		}

	};

	// cubeTextureLoader.load(urls, function(textureCube) {

		// assets.set("sky", textureCube);

	// });

	textureLoader.load("textures/tiles-diffuse.png", function(texture) {

		texture.wrapS = texture.wrapT = RepeatWrapping;
		assets.set("tiles-diffuse", texture);

	});

	textureLoader.load("textures/tiles-normalmap.png", function(texture) {

		texture.wrapS = texture.wrapT = RepeatWrapping;
		assets.set("tiles-normalmap", texture);

	});

});
