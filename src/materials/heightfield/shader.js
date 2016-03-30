const fs = require("fs");

const shader = {
	fragment: fs.readFileSync(__dirname + "/glsl/shader.frag", "utf-8"),
	vertex: {
		main: fs.readFileSync(__dirname + "/glsl/shader.vert", "utf-8"),
		lod_pars: fs.readFileSync(__dirname + "/glsl/lod.pars.vert", "utf-8"),
		lod: fs.readFileSync(__dirname + "/glsl/lod.vert", "utf-8")
	}
};
