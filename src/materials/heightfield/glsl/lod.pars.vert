uniform sampler2D heightmap;

uniform float scale;
uniform int level;
uniform int morphingLevels;

uniform vec3 planeUp;
uniform vec3 planeAt;
uniform vec3 planePoint;

varying vec3 vWorldPosition;

const int MAX_MORPHING_LEVELS = 2;

vec2 computeAncestorMorphing(int morphLevel, vec2 gridPosition, float heightMorphFactor, vec3 cameraScaledPosition, vec2 previousMorphing) {

	float morphLevelFloat = float(morphLevel);

	// Check if it's necessary to apply the morphing (on 1 square on 2).
	vec2 fractional = gridPosition * RESOLUTION * 0.5;

	if(morphLevel > 1) {

		fractional = (fractional + 0.5) / pow(2.0, morphLevelFloat - 1.0);

	}

	fractional -= floor(fractional);

	// Compute morphing factors based on the height and the parent LOD.
	vec2 squareOffset = abs(cameraScaledPosition.xz -(gridPosition + previousMorphing)) / morphLevelFloat;
	vec2 comparePos = max(vec2(0.0), squareOffset * 4.0 - 1.0);
	float parentMorphFactor = min(1.0, max(comparePos.x, comparePos.y));

	// Compute the composition of morphing factors.
	vec2 morphFactor = vec2(0.0);

	if(fractional.x + fractional.y > 0.49) {

		float morphing = parentMorphFactor;

		// If first LOD, apply the height morphing factor everywhere.

		if(morphLevel + morphLevel == 1) {

			morphing = max(heightMorphFactor, morphing);

		}

		morphFactor += morphing * floor(fractional * 2.0);

	}

	return morphLevelFloat * morphFactor / RESOLUTION;

}
		
vec4 computePosition(vec4 position) {

	#ifdef USE_PLANE_PARAMETERS

		// Compute the plane rotation if needed.
		mat3 planeRotation;
		vec3 planeY = normalize(planeUp);
		vec3 planeZ = normalize(planeAt);
		vec3 planeX = normalize(cross(planeY, planeZ));
		planeZ = normalize(cross(planeY, planeX));
		planeRotation = mat3(planeX, planeY, planeZ);

	#endif

	// Project the camera position and the scene origin on the grid using plane parameters.
	vec3 projectedCamera = vec3(cameraPosition.x, 0.0, cameraPosition.z);

	#ifdef USE_PLANE_PARAMETERS

		projectedCamera = cameraPosition - dot(cameraPosition - planePoint, planeY) * planeY;
		vec3 projectedOrigin = -dot(-planePoint, planeY) * planeY;

	#endif

	// Discretise the space and make the grid following the camera.
	float cameraHeightLog = log2(length(cameraPosition - projectedCamera));
	float s = scale * pow(2.0, floor(cameraHeightLog)) * 0.005;
	vec3 cameraScaledPosition = projectedCamera / s;

	#ifdef USE_PLANE_PARAMETERS

		cameraScaledPosition = cameraScaledPosition * planeRotation;

	#endif

	vec2 gridPosition = position.xz + floor(cameraScaledPosition.xz * RESOLUTION + 0.5) / RESOLUTION;

	// Compute the height morphing factor.
	float heightMorphFactor = cameraHeightLog - floor(cameraHeightLog);
		
	// Compute morphing factors from LOD ancestors.
	vec2 morphing = vec2(0.0);

	for(int i = 1; i <= MAX_MORPHING_LEVELS; ++i) {

		if(i <= morphingLevels) {

			morphing += computeAncestorMorphing(i, gridPosition, heightMorphFactor, cameraScaledPosition, morphing);

		}

	}

	// Apply final morphing.
	gridPosition = gridPosition + morphing;

	// Compute world coordinates.
	vec3 worldPosition = vec3(gridPosition.x * s, 0.0, gridPosition.y * s);

	#ifdef USE_PLANE_PARAMETERS

		worldPosition = planeRotation * worldPosition + projectedOrigin;

	#endif

	return vec4(worldPosition, 1.0);

}

float getHeight(vec2 inDir, vec3 position) {

	float height = sin(position.x * inDir.x + 1.0) * 0.8 + cos(position.z * inDir.y + 1.0) * 0.2;
	return height * height * height + 0.5;

}

/*float getHeight(vec2 coord) {

	// todo: supersample.
	float height = texture2D(heightmap, coord).r;

	return height;

}*/
