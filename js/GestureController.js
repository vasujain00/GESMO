/*
 * GESMO Leap Motion Controls
 * Author: @Siddhesh, @Shashank
 */

 GESMO.GestureController = function(controller, ui, player, logger){
 	this.controller = controller;
 	this.anchorDelta = 1;

 	this.ui = ui;
 	this.player = player;
 	this.logger = logger;

 	this.translationSpeed = 5;
 	this.translationDecay = 0.3;
 	this.transSmoothing = 0.5;
 	this.rotationSmoothing = 0.5;

 	this.rotationSlerp = 0.8;
 	this.rotationSpeed = 1;

 	this.grabThreshold = 1;
 	this.pinchThreshold = 0.9;
 	
 	this.swipedHorizontal = false;
 	this.swipedVertical = false;

 	this.pausePlaying = false;

 	this.vector = new THREE.Vector3();
 	this.vector2 = new THREE.Vector3();
 	this.matrix = new THREE.Quaternion();
 	this.quaternion = new THREE.Quaternion();
 	this.translationMomentum = new THREE.Vector3();
 	this.rotationMomentum = ui.movableObjects.quaternion.clone();

 	this.scaleSetLeft = false;
 	this.scaleSetRight = false;

 	this.transLP = [
 		new LowPassFilter(this.transSmoothing),
 		new LowPassFilter(this.transSmoothing),
 		new LowPassFilter(this.transSmoothing)
 	];

 	this.rotLP = [
 		new LowPassFilter(this.rotationSmoothing),
 		new LowPassFilter(this.rotationSmoothing),
 		new LowPassFilter(this.rotationSmoothing)
 	];

 	this.startApplication = true;
 	this.startGesture = false;
 };

 GESMO.GestureController.prototype = {
 	update: function(){
 		var self = this;
 		var frame = this.controller.frame();
 		var anchorFrame = this.controller.frame(this.anchorDelta);
 		var anchorFrame1 = this.controller.frame(7);
 		var anchorFrame2 = this.controller.frame(2);

 		if(!frame || !frame.valid || !anchorFrame || !anchorFrame.valid || !anchorFrame1 || !anchorFrame1.valid
 			|| !anchorFrame2 || !anchorFrame2.valid){
 			return;
 		}

 		var rawHands = frame.hands;
 		var rawAnchorHands = anchorFrame.hands;
 		var rawAnchorHands1 = anchorFrame1.hands;
 		var rawAnchorHands2 = anchorFrame2.hands;

 		var hands = [];
 		var anchorHands = [];
 		var anchorHands1 = [];
 		var anchorHands2 = [];

 		rawHands.forEach(function(hand, hIdx){
 			var anchorHand = anchorFrame.hand(hand.id);
 			if(anchorHand.valid){
 				if(hand.data('riggedHand.mesh').scale.x != 0.1){
 					hand.data('riggedHand.mesh').scale.set(5, 5, 5);
 				}
 				hands.push(hand);
 				anchorHands.push(anchorHand);
 			}

 			var anchorHand1 = anchorFrame1.hand(hand.id);
 			if(anchorHand1.valid){
 				anchorHands1.push(anchorHand1);
 			}

 			var anchorHand2 = anchorFrame2.hand(hand.id);
 			if(anchorHand2.valid){
 				anchorHands2.push(anchorHand2);
 			}
 		});

 		if(hands.length == 1 && this.startGesture){
 			if(hands[0].type == "right" && anchorHands[0].type == "right"){

 				if(this.shouldTranslateOrRotate(anchorHands[0], hands[0])){
 					this.swipedHorizontal = true;
 					this.swipedVertical = true;
 					this.applyTranslationOrRotation(anchorHands[0], hands[0]);
 					return;
 				}

 				var tipPos = new THREE.Vector3();
 				handMesh = hands[0].data('riggedHand.mesh')
    			handMesh.scenePosition(hands[0].indexFinger.tipPosition, tipPos);
    			
    			ui.onHandMove(handMesh);

    			if(this.shouldPick(anchorHands2[0], hands[0])/* && this.pinchReal(hands[0])*/){
					this.logger.log("gesture, pinch, made");
	 				var eventObj = {
	 					button: 0
	 				};
	 				ui.onClick(eventObj);
	 				return;
	 			}

	 			frame.gestures.forEach(function(gesture){

		 			switch(gesture.type){
		 				// case "circle" : {
		 				// 	if(!this.isEngaged(hands[0]) && gesture.state == "update" && this.fingerCount(hands[0]) && this.fingerCount(anchorHands[0])){
		 				// 		var pointableID = gesture.pointableIds;
		 				// 		var direction = frame.pointable(pointableID).direction;
		 				// 		var dotProduct = Leap.vec3.dot(direction, gesture.normal);
		 				// 		var pos = parseFloat(document.getElementById('progress').style.width)*0.01;
		 				// 		if(dotProduct > 0){							 
		 				// 			pos = pos + 0.002;
		 				// 			player.seek(pos);
		 				// 		} else {
		 				// 			pos = pos - 0.002;
		 				// 			player.seek(pos);
		 				// 		}
		 				// 	}
		 				// 	break;
		 				// }

		 				case "swipe" : {
		 					if(gesture.state == "stop" /*&& this.fingerCount(hands[0]) && this.fingerCount(anchorHands[0])*/){
		 						var pointableID = gesture.pointableIds[0];
		 						var direction = frame.pointable(pointableID).direction;
		 						var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
		 						if(isHorizontal && !this.swipedHorizontal){
		 							var distance = Math.abs(gesture.position[0] - gesture.startPosition[0]);
		 							if(distance > 175){
		 								this.logger.log("gesture, swipe, made for previous or next");
		 							}
		 							if(distance > 200){
			 							if(gesture.direction[0] > 0){
			 								player.skip("next");
			 								$(nextBtn).fadeIn("slow");
			 							} else {
			 								if(distance > 200){
			 									player.skip("prev");
			 									$(prevBtn).fadeIn("slow");
			 								}
			 							}
			 							this.swipedHorizontal = true;
			 							setTimeout(function(){
			 								$(nextBtn).fadeOut("slow");
			 								$(prevBtn).fadeOut("slow");
			 								this.swipedHorizontal = false;
			 							}.bind(this), 400);
			 						}
		 						} else {
		 							if(!this.swipedVertical){
		 								var distance = Math.abs(gesture.position[1] - gesture.startPosition[1]);
		 								if(distance > 125){
		 									this.logger.log("gesture, swipe, made to change volume");
		 								}
		 								if(distance > 150){
				 							var a = Howler._volume;
				 							$(volume).fadeIn();
				 							if(gesture.direction[1] > 0){
				 								if(a < 1){
				 									a = a + 0.1;
				 								}
				 								player.volume(a);
				 							} else {
				 								if(distance > 150){
				 									if(a > 0.1){
				 										a = a-0.1;
				 									}
				 									player.volume(a);
				 								}
				 							}
				 							this.swipedVertical = true;
				 							setTimeout(function(){
				 								$(volume).fadeOut();
			 									this.swipedVertical = false;
			 								}.bind(this), 600);
				 						}
		 							}
		 						}
		 					}
		 					break;
		 				}
		 			}
		 		}.bind(this));
 			} 
 		} else if(hands.length == 2){
 			if(this.shouldTogglePlay(anchorHands1, hands)){
 				if(this.startApplication){
 					var event = new CustomEvent('gesmo.gesture.startdectected');
 					window.dispatchEvent(event);
 					this.pausePlaying = true;
 					this.startApplication = false;
 					this.logger.log("gesture, grab, made to start application");
 					setTimeout(function(){
 							this.pausePlaying = false;
 						}.bind(this), 400);
 					return;
 				} else {
 					this.logger.log("gesture, grab, made to play or pause");
 					if(this.player.state != GESMO.PLAYING 
 					&& this.player.checkPlaylistState != GESMO.PLAYLISTEMPTY && this.startGesture && !this.pausePlaying){
 						this.pausePlaying = true;
 						this.player.play(this.player.index);
 						$(playBtn).fadeIn("slow");
 						setTimeout(function(){
 							$(playBtn).fadeOut("slow", function () {
 								this.pausePlaying = false;
 							}.bind(this));
 						}.bind(this), 200);
 						return;
	 				}

	 				if(this.player.state == GESMO.PLAYING && this.startGesture && !this.pausePlaying){
	 					this.pausePlaying = true;
	 					this.player.pause();
	 					$(pauseBtn).fadeIn("slow");
 						setTimeout(function(){
 							$(pauseBtn).fadeOut("slow", function () {
 								this.pausePlaying = false;
 							}.bind(this));
 						}.bind(this), 200);
	 					return;
	 				}
 				}
 				
 			}
 		}
 	},

 	shouldTranslateOrRotate: function(anchorHand, hand){
 		return this.isEngaged(anchorHand) && this.isEngaged(hand);
 	},

 	applyTranslationOrRotation: function(anchorHand, hand){
 		var translation = this.getTranslation(anchorHand, hand);
 		if(translation[0] > 0) translation[0] = this.transLP[0].sample(translation[0]);
 		if(translation[1] > 0) translation[1] = this.transLP[1].sample(translation[1]);
 		if(translation[2] > 0) translation[2] = this.transLP[2].sample(translation[2]);

 		if(ui.viewMode == GESMO.QUEUEVIEW){
 			if(Math.abs(translation[1]) > Math.abs(translation[0])){
 				if(Math.abs(translation[1]) > 10){
 					this.logger.log("gesture, grab and pull, made to moveInSection: up or down");
 				}
	 			if(Math.abs(translation[1]) > 15){
	 				if(translation[1] < 0){
	 					ui.moveInSection("up");
	 					setTimeout(function(){
	 						this.swipedHorizontal = false;
	 						this.swipedVertical = false;
	 					}.bind(this), 1100);
	 				} else {
	 					ui.moveInSection("down"), 
	 					setTimeout(function(){
	 						this.swipedHorizontal = false;
	 						this.swipedVertical = false;
	 					}.bind(this), 1100);
	 				}
	 			}
	 		} else {
	 			if(Math.abs(translation[0]) > 10){
 					this.logger.log("gesture, grab and pull, made to moveToSection: left or right");
 				}
	 			if(Math.abs(translation[0]) > 15){
	 				if(translation[0] > 0){
	 					ui.moveToSection("left");
	 					setTimeout(function(){
	 						this.swipedHorizontal = false;
	 						this.swipedVertical = false;
	 					}.bind(this), 1200);
	 				} else {
	 					ui.moveToSection("right");
	 					setTimeout(function(){
	 						this.swipedHorizontal = false;
	 						this.swipedVertical = false;
	 					}.bind(this), 1200);
	 				}
	 			}
	 		}
 		} else {
	 		if(Math.abs(translation[2]) > Math.abs(translation[0])){
	 			if(Math.abs(translation[2]) > 10){
 					this.logger.log("gesture, grab and pull, made to moveInSection: forward or backward");
 				}
	 			if(Math.abs(translation[2]) > 8){
	 				if(translation[2] > 0){
	 					ui.moveInSection("forward");
	 					setTimeout(function(){
	 						this.swipedHorizontal = false;
	 						this.swipedVertical = false;
	 					}.bind(this), 1100);
	 				} else {
	 					ui.moveInSection("backward");
	 					setTimeout(function(){
	 						this.swipedHorizontal = false;
	 						this.swipedVertical = false;
	 					}.bind(this), 1100);
	 				}
	 			}
	 		} else {
	 			if(Math.abs(translation[0]) > 10){
 					this.logger.log("gesture, grab and pull, made to moveToSection: left or right");
 				}
	 			if(Math.abs(translation[0]) > 15){
	 				if(translation[0] > 0){
	 					ui.moveToSection("left");
	 					setTimeout(function(){
	 						this.swipedHorizontal = false;
	 						this.swipedVertical = false;
	 					}.bind(this), 1100);
	 				} else {
	 					ui.moveToSection("right"), 
	 					setTimeout(function(){
	 						this.swipedHorizontal = false;
	 						this.swipedVertical = false;
	 					}.bind(this), 1100);
	 				}
	 			}
	 		}
	 	}
 	},

 	getTranslation: function(anchorHand, hand){
 		var centerAnchor = anchorHand.palmPosition;
 		var centerCurrent = hand.palmPosition;

 		var xTrans = centerCurrent[0] - centerAnchor[0];
 		var yTrans = centerCurrent[1] - centerAnchor[1];
 		var zTrans = centerCurrent[2] - centerAnchor[2];

 		var absX = Math.abs(xTrans);
 		var absY = Math.abs(yTrans);
 		var absZ = Math.abs(zTrans);

 		return [
 				xTrans,
 				yTrans,
 				zTrans
 			];
 	},

 	shouldRotate: function(anchorHand, hand){
 		return this.isEngaged(anchorHand) && this.isEngaged(hand);
 	},

 	applyRotation: function(anchorHand, hand){
 		var translation = this.getTranslationForRotation(anchorHand, hand);

   		if(translation[0] > 0) translation[0] = this.transLP[0].sample(translation[0]);
 		if(translation[1] > 0) translation[1] = this.transLP[1].sample(translation[1]);
 		if(translation[2] > 0) translation[2] = this.transLP[2].sample(translation[2]);

 		if(translation[1] != 0){
 			var angle = this.rotationSpeed*translation[1]/450;
 			ui.movableObjects.rotateOnAxis(GESMO.Z_AXIS, angle);
 		}

 		if(translation[0] != 0){
 			var angle = this.rotationSpeed*translation[0]/450
 			ui.movableObjects.rotateOnAxis(GESMO.Y_AXIS, angle);
 		}

 		if(translation[2] != 0){
 			var angle = this.rotationSpeed*translation[2]/450;
 			ui.movableObjects.rotateOnAxis(GESMO.Y_AXIS, angle);
 		}
 	},

 	getTranslationForRotation: function(anchorHand, hand){
 		var centerAnchor = anchorHand.palmPosition;
 		var centerCurrent = hand.palmPosition;

 		var xTrans = centerCurrent[0] - centerAnchor[0];
 		var yTrans = centerCurrent[1] - centerAnchor[1];
 		var zTrans = centerCurrent[2] - centerAnchor[2];

 		var absX = Math.abs(xTrans);
 		var absY = Math.abs(yTrans);
 		var absZ = Math.abs(zTrans);

 		var max = Math.max(absY, absZ);

	 	if(max == absX){
	 		return [
	 			xTrans,
	 			0,
	 			0
	 		];
	 	} else if(max == absY){
	 		return [
	 			0,
	 			yTrans,
	 			0
	 		];
	 	} else {
	 		return [
	 			0,
	 			0,
	 			zTrans
	 		];
	 	}
 	},

 	getRotation: function(anchorHand, hand){
          var am = this.getAxisMag(hand);
          if (am[3] < 6000) {
            return [0, 0, 0];
          }
          var mi = 1 / am[3];
          am[0]*=mi;
          am[1]*=mi;
          am[2]*=mi;
        
          var anchorAngles = this.getAngles(anchorHand);
          var angles = this.getAngles(hand);
        
          var dx = angles[0] - anchorAngles[0];
          var dy = angles[1] - anchorAngles[1];
          var dz = angles[2] - anchorAngles[2];
        
          if (dx > Math.PI) dx = dx - Math.PI*2;
          else if (dx < -Math.PI) dx = dx + Math.PI*2;
          if (dy > Math.PI) dy = dy - Math.PI*2;
          else if (dy < -Math.PI) dy = dy + Math.PI*2;
          if (dz > Math.PI) dz = dz - Math.PI*2;
          else if (dz < -Math.PI) dz = dz + Math.PI*2;

          return [dx * am[0], dy * am[1], dz * am[2]];
 	},

 	getAngles: function(hand) {
          var pos1 = hand.frame.interactionBox.center;
        
          var pos2 = hand.palmPosition;
        
          var dx = pos2[0] - pos1[0];
          var dy = pos2[1] - pos1[1];
          var dz = pos2[2] - pos1[2];

          var ax = Math.atan2(dy, dz);
          var ay = Math.atan2(dx, dz);
          var az = Math.atan2(dy, dx);
          return [ax, ay, az];
    },

 	getAxisMag: function(hand) {
          var pos1 = hand.frame.interactionBox.center;
          var pos2 = hand.palmPosition;
        
          var dx = pos2[0] - pos1[0];
          var dy = pos2[1] - pos1[1];
          var dz = pos2[2] - pos1[2];
          var mag = dx * dx + dy * dy + dz * dz;
        
          var ax = dy * dy + dz * dz;
          var ay = dx * dx + dz * dz;
          var az = dy * dy + dx * dx;
        
          return [ax, ay, az, mag];
    },

 	shouldPick: function(anchorHand, hand){
 		return (this.isPinched(anchorHand)) && (!this.isPinched(hand));
 	},

	pinchReal: function(hand){
		if(hand.fingers[0].extended || hand.fingers[1].extended){
			return false;
		}
		return true;
	},
	
 	shouldTogglePlay: function(anchorHands, hands){
 		return (this.isEngaged(anchorHands[0]) && this.isEngaged(anchorHands[1]) && !this.isEngaged(hands[0]) && !this.isEngaged(hands[1]));
 	},

 	isEngaged: function(h){
 		return h && (h.grabStrength == this.grabThreshold) && (this.extendedCount);
 	},

 	isPinched: function(h){
 		//console.log(this.calDistance(h.fingers[0].tipPosition, h.fingers[1].tipPosition));
 		return h && (h.pinchStrength > this.pinchThreshold) && (h.grabStrength < this.grabThreshold);
 		//if(h) console.log(this.calDistance(h.fingers[0].tipPosition, h.fingers[1].tipPosition));
 		//return h && (this.calDistance(h.fingers[0].tipPosition, h.fingers[1].tipPosition) < 8);
 	},

 	isNotPinched: function(h){
 		//console.log(this.calDistance(h.fingers[0].tipPosition, h.fingers[1].tipPosition));
 		//return h && (h.pinchStrength > this.pinchThreshold) && (h.grabStrength < this.grabThreshold);
 		return h && (this.calDistance(h.fingers[0].tipPosition, h.fingers[1].tipPosition) > 15);
 	},

 	findHand: function(hands, type){
 		for(var i = 0;i < hands.length;i++){
 			if(hands[i].type == type){
 				return hands[i];
 			}
 		}
 		return null;
 	},

 	fingerCount: function(hand){
 		if(hand){
 			if(!(hand.thumb.extended || hand.middleFinger.extended || hand.ringFinger.extended || hand.pinky.extended) && hand.indexFinger.extended){
 				return true;
 			}
 			return false;
 		} else {
 			return false;
 		}
 	},

 	extendedCount: function(hand){
 		if(hand){
 			if(!hand.thumb.extended && !hand.indexFinger.extended && !hand.middleFinger.extended && !hand.ringFinger.extended && !hand.pinky.extended)
 				return true;
 		} else {
 			return false;
 		}
 	},

 	setStartGesture: function(){
 		this.startGesture = true;
 	}, 

 	calDistance: function(arr1, arr2) {
 		return Math.sqrt(Math.pow(arr2[0]-arr1[0], 2), Math.pow(arr2[1]-arr1[1], 2), Math.pow(arr2[2]-arr1[2], 2));
 	}
 };

 function LowPassFilter(cutoff){
 		var accumulator = 0;
 		this.setCutOff = function(value){
 			cutoff = value;
 		}

 		this.sample = function(sample){
 			accumulator += (sample - accumulator)*cutoff;
 			return accumulator;
 		}
 }