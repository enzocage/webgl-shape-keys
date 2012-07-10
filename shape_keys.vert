attribute vec2 aTextureCoord;

attribute vec3 aPosition0;
attribute vec3 aPosition1;
attribute vec3 aPosition2;
attribute vec3 aNormal0;
attribute vec3 aNormal1;
attribute vec3 aNormal2;

uniform float uWeight1;
uniform float uWeight2;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

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
	
	gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
	vNormal = uNMatrix * normalVec;
	vTextureCoord = aTextureCoord;
}
