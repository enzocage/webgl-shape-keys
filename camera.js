Camera = function() {   
	this.cameraMatrix = mat4.create(); 
	this.lookAtPoint = [0.0, 0.0, 0.0];
	this.distance = 16.0;
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
			realThis.turnY = 1;
		} else if(keyCode == 39) {    //Right
			realThis.turnY = -1;
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
		var curPos = this.getCurrentPosition();
		
		var up = [0.0, 1.0, 0.0];
		
		if(this.xAngle > 90 && this.xAngle < 270) {
			up = [0.0, -1.0, 0.0];
		}

		mat4.lookAt(curPos, this.lookAtPoint, up, this.cameraMatrix);
		
		this.dirty = false;
	}
	
	return this.cameraMatrix;
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
