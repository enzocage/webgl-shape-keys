Camera = function() {   
	this.cameraMatrix = mat4.create(); 
	this.lookAtPoint = [0.0, 0.0, 0.0];
	this.distance = 5.0;
	this.turnX = 0;
	this.turnY = 0;
	this.move = 0;
	this.xAngle = 0.0;
	this.yAngle = 0.0;
	this.dirty = true;
	
	var realThis = this;
	
	window.addEventListener('keydown', function(event) {
		var keyCode = event.keyCode;
		
		if(keyCode == 38) {           //Up
			realThis.turnX = 1;
		} else if(keyCode == 40) {    //Down
			realThis.turnX = -1;
		} else if(keyCode == 37) {    //Left
			realThis.turnY = -1;
		} else if(keyCode == 39) {    //Right
			realThis.turnY = 1;
		} else if(keyCode == 90) {    //Z
			realThis.move = -1;
		} else if(keyCode == 88) {    //X
			realThis.move = 1;
		}
		
	});
	
	window.addEventListener('keyup', function(event) {
		var keyCode = event.keyCode;
		
		if(keyCode == 38) {           //Up
			realThis.turnX = 0;
		} else if(keyCode == 40) {    //Down
			realThis.turnX = 0;
		} else if(keyCode == 37) {    //Left
			realThis.turnY = 0;
		} else if(keyCode == 39) {    //Right
			realThis.turnY = 0;
		} else if(keyCode == 90) {    //Z
			realThis.move = 0;
		} else if(keyCode == 88) {    //X
			realThis.move = 0;
		} 
	});
};

Camera.prototype.update = function(timing) {
	var change = timing.frameTime * (0.18);

	if(this.turnX != 0) {
		this.xAngle += this.turnX*change;
		
		while (this.xAngle < 0) {
			this.xAngle += 360;
		}
		while (this.xAngle >= 360) {
			this.xAngle -= 360;
		}
		
		this.dirty = true;
	}
	
	if(this.turnY != 0) {
		this.yAngle += this.turnY*change;
		
		while (this.yAngle < 0) {
			this.yAngle += 360;
		}
		while (this.yAngle >= 360) {
			this.yAngle -= 360;
		}
		
		this.dirty = true;
	}
	
	if(this.move != 0) {
		this.distance += this.move*timing.frameTime/500.0;
		this.dirty = true;
	}
};

Camera.prototype.getViewMatrix = function() {	
	if(this.dirty) {
		mat4.identity(this.cameraMatrix);
		
		var curPos = this.getCurrentPosition();
		mat4.translate(this.cameraMatrix, curPos);
		
		var curOri = this.getCurrentOrientation();
		mat4.multiply(this.cameraMatrix, curOri, this.cameraMatrix);
		
		this.dirty = false;
	}
	
	var ret = mat4.create();
	return mat4.inverse(this.cameraMatrix, ret);
};

Camera.prototype.getCurrentPosition = function() {
	var radius = [0.0, 0.0, this.distance, 1.0];
	var rotateRadius = mat4.create();
	
	mat4.identity(rotateRadius);
	mat4.rotateY(rotateRadius, degToRadian(this.yAngle));
	mat4.rotateX(rotateRadius, degToRadian(this.xAngle)); 
	
	mat4.multiplyVec4(rotateRadius, radius);
	
	var ret = [];
	return vec3.add(this.lookAtPoint, radius, ret);
}

Camera.prototype.getCurrentOrientation = function() {
	var z = [];
	var curPos = this.getCurrentPosition();
	vec3.subtract(curPos, this.lookAtPoint, z);
	vec3.normalize(z);
	
	var proj = [];
	vec3.scale(z, z[1], proj);
	
	var y = [];
	vec3.subtract([0.0, 1.0, 0.0], proj, y);
	vec3.normalize(y);
	
	if(this.xAngle > 90 && this.xAngle < 270) {
		vec3.scale(y, -1);
	}
	var x = [];
	vec3.cross(z, y, x);
	vec3.normalize(x);
	
	var ret = [];
	
	ret[0] = x[0];
	ret[1] = x[1];
	ret[2] = x[2];
	ret[3] = 0.0;
	
	ret[4] = y[0];
	ret[5] = y[1];
	ret[6] = y[2];
	ret[7] = 0.0;
	
	ret[8] = z[0];
	ret[9] = z[1];
	ret[10] = z[2];
	ret[11] = 0.0;
	
	ret[12] = 0.0;
	ret[13] = 0.0;
	ret[14] = 0.0;
	ret[15] = 1.0;
	
	return ret;
};
