attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec3 vNormal;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
	vNormal = uNMatrix * aNormal;
}
