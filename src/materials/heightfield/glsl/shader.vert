#define EPSILON 1e-6

#ifdef USE_LOGDEPTHBUF

	uniform float logDepthBufFC;

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

#endif

uniform sampler2D tHeight;

uniform vec3 globalOffset;
uniform vec2 tileOffset;

uniform float worldSize;
uniform float scale;
uniform int edgeMorph;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vMorphFactor;
varying vec2 vUvs[3];

const int EGDE_MORPH_TOP = 1;
const int EGDE_MORPH_LEFT = 2;
const int EGDE_MORPH_BOTTOM = 4;
const int EGDE_MORPH_RIGHT = 8;

const float MORPH_REGION = 0.3;
const float MORPH_REGION_INV = 0.7;

float getHeight(vec3 p) {

	float lod = 0.0;//log2(scale) - 6.0;
	vec2 st = p.xy / worldSize;

	// Sample multiple times to get more detail.
	float h = worldSize * texture2DLod(tHeight, st, lod).r;
	// todo: Adjust to worldsize.
	h += 64.0 * texture2DLod(tHeight, 16.0 * st, lod).r;
	h += 4.0 * texture2DLod(tHeight, 256.0 * st, lod).r;

	// Square the height, leads to more rocky looking terrain.
	return h * h / 2000.0;
	//return h / 10.0;

}

vec3 getNormal(float h) {

	// Build 2 vectors that are perpendicular to the surface normal.
	//float delta = 1024.0 / 4.0;
	float delta = (vMorphFactor + 1.0) * scale / RESOLUTION;
	vec3 dA = delta * normalize(cross(normal.yzx, normal));
	vec3 dB = delta * normalize(cross(dA, normal));
	vec3 p = vPosition;
	vec3 pA = vPosition + dA;
	vec3 pB = vPosition + dB;

	// Get the height at those points.
	float hA = getHeight(pA);
	float hB = getHeight(pB);

	// Update the points with the new height and calculate the normal.
	p += normal * h;
	pA += normal * hA;
	pB += normal * hB;

	return normalize(cross(pB - p, pA - p));

}

/**
 * Poor man's bitwise &.
 */

bool edgePresent(int edge) {

	int e = edgeMorph / edge;

	return (2 * (e / 2) != e);

}

/**
 * At the edges of tiles morph the vertices if they are joining onto a higher layer.
 */

float calculateMorph(vec3 p) {

	float morphFactor = 0.0;

	if(edgePresent(EGDE_MORPH_TOP) && p.y >= MORPH_REGION_INV) {

		float m = 1.0 - clamp((1.0 - p.y) / MORPH_REGION, 0.0, 1.0);
		morphFactor = max(m, morphFactor);

	}

	if(edgePresent(EGDE_MORPH_LEFT) && p.x <= MORPH_REGION) {

		float m = 1.0 - clamp(p.x / MORPH_REGION, 0.0, 1.0);
		morphFactor = max(m, morphFactor);

	}

	if(edgePresent(EGDE_MORPH_BOTTOM) && p.y <= MORPH_REGION) {

		float m = 1.0 - clamp(p.y / MORPH_REGION, 0.0, 1.0);
		morphFactor = max(m, morphFactor);

	}

	if(edgePresent(EGDE_MORPH_RIGHT) && p.x >= MORPH_REGION_INV) {

		float m = 1.0 - clamp((1.0 - p.x) / MORPH_REGION, 0.0, 1.0);
		morphFactor = max(m, morphFactor);

	}

	return morphFactor;

}

void main() {

	/* Morph factor indicates the proximity to the next level.
	 *
	 *  0.0 = this level.
	 *  1.0 = next level.
	 */

	vMorphFactor = calculateMorph(position);

	// Move into correct place.
	vPosition = scale * position + vec3(tileOffset, 0.0) + globalOffset;

	// Snap to grid.
	float grid = scale / RESOLUTION;
	vPosition = floor(vPosition / grid) * grid;

	// Morph between zoom layers.
	if(vMorphFactor > 0.0) {

		// Get position that we would have if we were on higher level grid.
		grid *= 2.0;
		vec3 position2 = floor(vPosition / grid) * grid;

		// Linearly interpolate the two, depending on morph factor.
		vPosition = mix(vPosition, position2, vMorphFactor);

	}

	// Get height and calculate normal.
	float height = getHeight(vPosition);
	vPosition += normal * height;
	//vNormal = getNormal(height);

	// Allow pre-fetching of texels.
	vUvs[0] = vPosition.xy / worldSize;
	vUvs[1] = 16.0 * vUvs[0];
	vUvs[2] = 256.0 * vUvs[0];

	gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

	#ifdef USE_LOGDEPTHBUF

		gl_Position.z = log2(max(EPSILON, gl_Position.w + 1.0)) * logDepthBufFC;

		#ifdef USE_LOGDEPTHBUF_EXT

			vFragDepth = 1.0 + gl_Position.w;

		#else

			gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;

		#endif

	#endif

}
