attribute vec2 aTextureCoord;

attribute vec3 aPosition0;
attribute vec3 aPosition1;
attribute vec3 aPosition2;
attribute vec3 aPosition3;
attribute vec3 aPosition4;
attribute vec3 aPosition5;
attribute vec3 aNormal0;
attribute vec3 aNormal1;
attribute vec3 aNormal2;
attribute vec3 aNormal3;
attribute vec3 aNormal4;
attribute vec3 aNormal5;

uniform float uWeight1;
uniform float uWeight2;
uniform float uWeight3;
uniform float uWeight4;
uniform float uWeight5;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform bool uUseTexture;

varying vec3 vNormal;
varying vec2 vTextureCoord;

void main(void) {
	vec3 position = aPosition0;
	vec3 normalVec = aNormal0;
	
	if(uWeight1 != 0.0) {
		position += uWeight1 * (aPosition1 - aPosition0);
		normalVec += uWeight1 * (aNormal1 - aNormal0);
	}
	if(uWeight2 != 0.0) {
		position += uWeight2 * (aPosition2 - aPosition0);
		normalVec += uWeight2 * (aNormal2 - aNormal0);
	}
	if(uWeight3 != 0.0) {
		position += uWeight3 * (aPosition3 - aPosition0);
		normalVec += uWeight3 * (aNormal3 - aNormal0);
	}
	if(uWeight4 != 0.0) {
		position += uWeight4 * (aPosition4 - aPosition0);
		normalVec += uWeight4 * (aNormal4 - aNormal0);
	}
	if(uWeight5 != 0.0) {
		position += uWeight5 * (aPosition5 - aPosition0);
		normalVec += uWeight5 * (aNormal5 - aNormal0);
	}
	
	gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
	vNormal = uNMatrix * normalVec;
	
	if(uUseTexture) {
		vTextureCoord = aTextureCoord;
	}
}
