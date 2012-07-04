Camera = function() {   
	this.cameraMatrix = mat4.create(); 
	this.center = [0.0, 0.0, 0.0];
	this.start =0.0;
	this.distance = 0.0;
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

Camera.prototype.setDistance = function(dist) {
	this.start = dist;
	this.distance = dist;
};

Camera.prototype.update = function(timing) {
	var change = timing.frameTime * (0.18);

	if(this.turnX != 0) {
		this.xAngle += this.turnX*change;
		this.dirty = true;
	}
	
	if(this.turnY != 0) {
		this.yAngle += this.turnY*change;
		this.dirty = true;
	}
	
	if(this.move != 0) {
		this.distance += this.move*timing.frameTime/500.0;
		this.dirty = true;
	}
	
	while (self.yAngle < 0) {
		self.yAngle += 360;
	}
	while (self.yAngle >= 360) {
		self.yAngle -= 360;
	}
	
	while (self.xAngle < 0) {
		self.xAngle += 360;
	}
	while (self.xAngle >= 360) {
		self.xAngle -= 360;
	}
};

Camera.prototype.getViewMatrix = function() {	
	if(this.dirty) {
		mat4.identity(this.cameraMatrix);
		
		mat4.translate(this.cameraMatrix, this.center);
		
		mat4.rotateY(this.cameraMatrix, degToRadian(this.yAngle));
		mat4.rotateX(this.cameraMatrix, degToRadian(this.xAngle));	
		
		mat4.translate(this.cameraMatrix, [0.0, 0.0, this.distance]);		
		
		this.dirty = false;
	}
	var ret = mat4.create();
	return mat4.inverse(this.cameraMatrix, ret);
};
