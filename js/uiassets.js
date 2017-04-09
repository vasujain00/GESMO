GESMO.Island = function(topRadius, botRadius, height) {
	this.mesh = new THREE.Object3D();
	this.mesh.name = "island";

	var geom = new THREE.CylinderGeometry(topRadius, botRadius, height, 20, 1);
	geom.mergeVertices();

	geom.vertices[0].x -= 1057;
	geom.vertices[0].z -= 1057;
	geom.vertices[1].x -= 1057;
	geom.vertices[1].z -= 2057;
	geom.vertices[2].x -= 1057;
	geom.vertices[2].z -= 1057;
	geom.vertices[12].x -= 1057;
	geom.vertices[12].z -= 1057;
	geom.vertices[12].y += 500;
	
	var mat = new THREE.MeshLambertMaterial({
		color: 0x23190f,
		shading: THREE.FlatShading
	});
	var trunk = new THREE.Mesh(geom, mat);
	this.mesh.add(trunk);
	
	var nProtrusions = 3 + Math.random()*6;
	for(var i = 0; i < nProtrusions;i++){
		var pGeom = new THREE.CylinderGeometry(Math.random()*(topRadius - 3000) + 1500, Math.random()*(botRadius - 100) + 100, height, 10, 5);
		var portrusion = new THREE.Mesh(pGeom, mat);
		portrusion.position.x += 200 + Math.random()*400;
		portrusion.position.y -= 200 + Math.random()*400;
		this.mesh.add(portrusion);
	}

	this.mesh.receiveShadow = true;
};

GESMO.GrassyTerrain = function(radius){
	var geom = new THREE.CylinderGeometry(radius, radius, 300, 20, 1);
	geom.mergeVertices();
	 geom.vertices[0].x -= 1057;
	 geom.vertices[0].z -= 1057;
	 geom.vertices[20].x -= 1057;
	 geom.vertices[20].z -= 1057;
	 geom.vertices[1].x -= 1057;
	 geom.vertices[1].z -= 2057;	
	 geom.vertices[21].x -= 1057;
	 geom.vertices[21].z -= 2057;
	 geom.vertices[2].x -= 1057;
	 geom.vertices[2].z -= 1057;	
	 geom.vertices[22].x -= 1057;
	 geom.vertices[22].z -= 1057;
	 geom.vertices[12].x -= 1057;
	 geom.vertices[12].z -= 1057;
	 geom.vertices[12].y += 500;
	 geom.vertices[32].x -= 1057;
	 geom.vertices[32].z -= 1057;
	 geom.vertices[32].y += 500;

	  geom.computeFaceNormals();
	  geom.computeVertexNormals();

	  this.mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
	    color: GESMO.Colors.greenDark,
	    shading: THREE.FlatShading,
	    side: THREE.DoubleSide
	  }));

	  this.mesh.receiveShadow = true;
	  this.mesh.castShadow = true;
	  this.mesh.name = "grass"
};

GESMO.Clouds = function(nClouds){
	this.Cloud = function(){
		this.mesh = new THREE.Object3D();

		var mat = new THREE.MeshPhongMaterial({
			color: GESMO.Colors.white,
			shading: THREE.FlatShading
		});

		var cGeom = new THREE.DodecahedronGeometry(500, 1);
		var center = new THREE.Mesh(cGeom, mat);
		center.scale.x = 1.5;
		this.mesh.add(center);

		var lGeom = new THREE.DodecahedronGeometry(250, 1);
		var left = new THREE.Mesh(lGeom, mat);
		left.scale.x = 1.5;
		this.mesh.add(left);
		left.position.x -= 375;

		var rGeom = new THREE.DodecahedronGeometry(250, 1);
		var right = new THREE.Mesh(rGeom, mat);
		right.scale.x = 1.5;
		this.mesh.add(right);
		right.position.x += 375;
	}

	this.mesh = new THREE.Object3D();
	
	for(var i = 0;i < nClouds;i++){
		var theta = Math.PI*Math.random();
		var phi = Math.PI*Math.random();
		var radius = 2500 + Math.random()*4000;

		var c = new this.Cloud();
		c.mesh.position.x = radius*Math.cos(theta)*Math.cos(phi);
		c.mesh.position.z = radius*Math.cos(theta)*Math.sin(phi);
		c.mesh.position.y = radius*Math.sin(theta) + 1000;

		this.mesh.add(c.mesh);
	}
}

GESMO.Mountains = function(){
	this.Mountain = function(){
		this.greyMat = new THREE.MeshLambertMaterial({
		    color: 0xa99a9d,
		    shading: THREE.FlatShading,
		    wireframe: false,
		    side: THREE.DoubleSide
		  });

		  this.threegroup = new THREE.Group();

		  /* var boxGeom = new THREE.CylinderGeometry(20 + Math.random() * 50, 76 + Math.random() * 200, Math.random() * 400 + 50, 20, 20, false);
		   */
		  var zeroVector = new THREE.Vector3();
		  var size = Math.random() * 1000 + 1000;
		  var heightScale = Math.random() * .5 + 4;
		  var boxGeom = new THREE.PlaneGeometry(size, size, 8 + Math.floor(Math.random() * 3), 8 + Math.floor(Math.random() * 3));

		  for (var i = 0; i < boxGeom.vertices.length; i++) {

		    var vertex = boxGeom.vertices[i];
		    // vertex.x =0;
		    vertex.z = (-vertex.distanceTo(zeroVector) * .5) * heightScale + 15 + Math.random() * 3 - 6;

		    vertex.y += Math.random() * 10 - 5;
		    vertex.x += Math.random() * 10 - 5;
		    vertex.z += Math.random() * 20 - 10;

		  }
		  boxGeom.computeFaceNormals();
		  boxGeom.computeVertexNormals();

		  this.boxMesh = new THREE.Mesh(boxGeom, this.greyMat);
		  var box = new THREE.Box3().setFromObject(this.boxMesh);
		  this.boxMesh.position.y = Math.random() * 15 + 10;
		  this.boxMesh.rotation.x = -Math.PI / 2;
		  this.threegroup.add(this.boxMesh);

		  this.threegroup.traverse(function(object) {
		    if (object instanceof THREE.Mesh) {
		      object.castShadow = true;
		      object.receiveShadow = true;
		    }
		  });
	}

	this.mesh = new THREE.Object3D();
	var noM = 3;
	var radius = 2500;
	var angle = Math.PI/8;
	for(var i = 0;i < noM;i++){
		var m = new this.Mountain();
		m.threegroup.position.x = radius*Math.cos(angle*i);
		m.threegroup.position.z = radius*Math.sin(angle*i);
		this.mesh.add(m.threegroup);
	}
}

GESMO.Forest = function(radius, startAngle, endAngle, layers){
	this.Tree = function(){
		this.mesh = new THREE.Object3D();

		var tgeom = new THREE.CylinderGeometry(30, 30, 250, 5);
		var tmat = new THREE.MeshPhongMaterial({
			color: GESMO.Colors.brown,
			shading: THREE.FlatShading
		});
		var trunk = new THREE.Mesh(tgeom,tmat);
		this.mesh.add(trunk);

		var lgeom = new THREE.DodecahedronGeometry(250, 1);
		var lmat = new THREE.MeshPhongMaterial({
			color: GESMO.Colors.treeColor,
			shading: THREE.FlatShading
		});
		var leaves = new THREE.Mesh(lgeom, lmat);
		this.mesh.add(leaves);
		leaves.position.y += 250;
	}

	this.mesh = new THREE.Object3D();
	var pertx = 0, perty = 0;
	for(var i = 0;i < layers;i++){
		radius += 100;
		for(var theta = startAngle;theta <= endAngle;theta += Math.PI/32){
			var t = new this.Tree();
			pertx = Math.floor(Math.random() * 210) - 100;
			perty = Math.floor(Math.random() * 210) - 100;
			t.mesh.position.x = radius*Math.cos(theta) + pertx;
			t.mesh.position.z = radius*Math.sin(theta) + perty;

			this.mesh.add(t.mesh);
		}
	}
}



GESMO.Water = function(radius){
	var geom = new THREE.CylinderGeometry(radius, radius, 150, 10, 5);
	geom.mergeVertices();
	this.waves = [];
	for(var i = 0;i < geom.vertices.length;i++){
		var v = geom.vertices[i];
		this.waves.push({y: v.y,
 						 x: v.x,
 						 z: v.z,
 						 ang: Math.random()*Math.PI*2,
 						 amp: 5 + Math.random()*50,
 						 speed: 0.016 + Math.random()*0.032
 						});
	}

	this.mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
		color: 0x6092c1,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.9,
		side: THREE.DoubleSide
	}));

	//this.mesh.rotation.x = -Math.PI/2;
	//this.mesh.position.y = 0;
	this.mesh.receiveShadow = true;
	this.mesh.name = "water";

	this.moveWaves = function(){
 		var verts = this.mesh.geometry.vertices;
 		var l = verts.length;
 		for(var i = 0;i < l;i++){
 			var v = verts[i];

 			var vprops = this.waves[i];

 			v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
 			v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

 			vprops.ang += vprops.speed;
 		}

 		this.mesh.geometry.verticesNeedUpdate = true;
 	}
}

GESMO.Pilot =function(){
 	this.mesh = new THREE.Object3D();
 	this.mesh.name = "pilot";

 	this.angleHairs = 0;

 	// Create the body
 	var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
 	var bodyMat = new THREE.MeshPhongMaterial({ color: GESMO.Colors.brown, shading:THREE.FlatShading});
 	var body = new THREE.Mesh(bodyGeom, bodyMat);
 	body.position.set(2, -12, 0);
 	this.mesh.add(body);

 	// Create the face
 	var faceGeom = new THREE.BoxGeometry(10, 10, 10);
 	var faceMat = new THREE.MeshLambertMaterial({color: GESMO.Colors.pink});
 	var face = new THREE.Mesh(faceGeom, faceMat);
 	this.mesh.add(face);

 	// Create the hair
 	var hairGeom = new THREE.BoxGeometry(4, 4, 4);
 	var hairMat = new THREE.MeshLambertMaterial({color: GESMO.Colors.brown});
 	var hair = new THREE.Mesh(hairGeom, hairMat);

 	hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
 	
 	var hairs = new THREE.Object3D();
 	this.hairsTop = new THREE.Object3D();
 	for(var i = 0;i < 12;i++){
 		var h = hair.clone();
 		var col = i%3;
 		var row = Math.floor(i/3);
 		var startPosZ = -4;
 		var startPosX = -4;
 		h.position.set(startPosX + row*4, 0, startPosZ + col*4);
 		this.hairsTop.add(h);
 	}
 	hairs.add(this.hairsTop);

 	var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
 	hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
 	var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
 	var hairSideL = hairSideR.clone();
 	hairSideR.position.set(8, -2, 6);
 	hairSideL.position.set(8, -2, -6);
 	hairs.add(hairSideR);
 	hairs.add(hairSideL);

 	var hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
 	var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
 	hairBack.position.set(-1, -4, 0);
 	hairs.add(hairBack);
 	hairs.position.set(-5, 5, 0);

 	this.mesh.add(hairs);

 	var glassGeom = new THREE.BoxGeometry(5, 5, 5);
 	var glassMat = new THREE.MeshLambertMaterial({ color: GESMO.Colors.brown});
 	var glassR = new THREE.Mesh(glassGeom, glassMat);
 	glassR.position.set(6, 0, 3);
 	var glassL = glassR.clone();
 	glassL.position.z = -glassR.position.z;

 	var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
 	var glassA = new THREE.Mesh(glassAGeom, glassMat);
 	this.mesh.add(glassR);
 	this.mesh.add(glassL);
 	this.mesh.add(glassA);

 	var camPointGeom = new THREE.BoxGeometry(1, 1, 1);
 	this.camPoint = new THREE.Mesh(camPointGeom, glassMat);
 	this.camPoint.position.set(6, 0, 0);
 	this.mesh.add(this.camPoint);

 	var earGeom = new THREE.BoxGeometry(2, 3, 2);
 	var earL = new THREE.Mesh(earGeom, faceMat);
 	earL.position.set(0, 0, -6);
 	var earR = earL.clone();
 	earR.position.set(0, 0, 6);
 	this.mesh.add(earL);
 	this.mesh.add(earR);
 	
 	this.updateHairs = function(){
 		var hairs = this.hairsTop.children;
 		var l = hairs.length;
 		for(var i = 0;i < l;i++){
 			var h = hairs[i];
 			h.scale.y = 0.75 + Math.cos(this.angleHairs+i/3)*0.25;
 		}

 		this.angleHairs += 0.16;
 	}
 };

 GESMO.Airplane = function(font){
 	this.mesh = new THREE.Object3D();
 	this.mesh.name = "airplane";
 	this.font = font;

 	//Create the cabin
 	var geomCockpit = new THREE.BoxGeometry(60, 40, 30, 1, 1, 1);
 	var matCockpit = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading: THREE.FlatShading});
 	
 	geomCockpit.vertices[4].y -= 10;
 	geomCockpit.vertices[4].z += 20;
 	geomCockpit.vertices[5].y -= 10;
 	geomCockpit.vertices[5].z -= 20;
 	geomCockpit.vertices[6].y += 30;
 	geomCockpit.vertices[6].z += 20;
 	geomCockpit.vertices[7].y += 30;
 	geomCockpit.vertices[7].z -= 20;

 	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
 	cockpit.castShadow = true;
 	cockpit.receiveShadow = true;
 	this.mesh.add(cockpit);

 	// Create the engine
 	var geomEngine = new THREE.BoxGeometry(20, 40, 30, 1, 1, 1);
 	
 	geomEngine.vertices[0].y -= 10;
 	geomEngine.vertices[0].z -= 10;
 	geomEngine.vertices[1].y -= 10;
 	geomEngine.vertices[1].z += 10;
 	geomEngine.vertices[2].y += 10;
 	geomEngine.vertices[2].z -= 10;
 	geomEngine.vertices[3].y += 10;
 	geomEngine.vertices[3].z += 10;

 	var matEngine = new THREE.MeshPhongMaterial({ color: GESMO.Colors.white, shading: THREE.FlatShading});
 	var engine = new THREE.Mesh(geomEngine, matEngine);
 	engine.position.x = 40;
 	engine.castShadow = true;
 	engine.receiveShadow = true;
 	this.mesh.add(engine);

 	// Create the tail
 	var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
 	var matTailPlane = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading: THREE.FlatShading});
 	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
 	tailPlane.position.set(-40, 20, 0);
 	tailPlane.castShadow = true;
 	tailPlane.receiveShadow = true;
 	this.mesh.add(tailPlane);

 	// Create the wing
 	var geomSideWing = new THREE.BoxGeometry(30, 5, 120, 1, 1, 1);
 	var matSideWing = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading: THREE.FlatShading});
 	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
 	sideWing.position.set(0, 15, 0);
 	sideWing.castShadow = true;
 	sideWing.receiveShadow = true;
 	this.mesh.add(sideWing);

 	var geomWindshield = new THREE.BoxGeometry(1,30,200, 1, 1, 1);
 	var matWindshield = new THREE.MeshPhongMaterial({color: GESMO.Colors.white, transparent: true, opacity:0.5, shading:THREE.FlatShading});
 	this.hmd = new THREE.Mesh(geomWindshield, matWindshield);
 	this.hmd.position.set(100, 85, 0);
 	this.hmd.castShadow = true;
 	this.hmd.receiveShadow = true;
 	this.hmd.scale.x = 0.1;
 	this.mesh.add(this.hmd);

 	// Create the propeller
 	var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
 	geomPropeller.vertices[4].y -= 5;
 	geomPropeller.vertices[4].z += 5;
 	geomPropeller.vertices[5].y -= 5;
 	geomPropeller.vertices[5].z -= 5;
 	geomPropeller.vertices[6].y += 5;
 	geomPropeller.vertices[6].z += 5;
 	geomPropeller.vertices[7].y += 5;
 	geomPropeller.vertices[7].z -= 5; 
 	var matPropeller = new THREE.MeshPhongMaterial({color: GESMO.Colors.brown, shading: THREE.FlatShading});
 	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
 	this.propeller.castShadow = true;
 	this.propeller.receiveShadow = true;

 	// Create the blades
 	var geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1)
 	var matBlade = new THREE.MeshPhongMaterial({color: GESMO.Colors.brownDark, shading: THREE.FlatShading});
 	
 	this.blade1 = new THREE.Mesh(geomBlade, matBlade);
 	this.blade1.position.set(8, 0, 0);
 	this.blade1.castShadow = true;
 	this.blade1.receiveShadow = true;

 	this.blade2 = this.blade1.clone();
 	this.blade2.rotation.x = Math.PI/2;
 	this.blade2.castShadow = true;
 	this.blade2.receiveShadow = true;

 	// Add the blades to propeller
 	this.propeller.add(this.blade1);
 	this.propeller.add(this.blade2);
 	this.propeller.position.set(60, 0, 0);
 	this.mesh.add(this.propeller);

 	// Create the wheels
 	var wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
 	var wheelProtecMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading:THREE.FlatShading});
	var wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
	wheelProtecR.position.set(25, -20, 25);
	this.mesh.add(wheelProtecR);

	var wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
	var wheelTireMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.brownDark, shading:THREE.FlatShading});
	var wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
	wheelTireR.position.set(25, -28, 25);

	var wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
	var wheelAxisMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.brown, shading: THREE.FlatShading});
	var wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
	wheelTireR.add(wheelAxis); 	

	this.mesh.add(wheelTireR);

	var wheelProtecL = wheelProtecR.clone();
	wheelProtecL.position.z = -wheelProtecR.position.z;
	this.mesh.add(wheelProtecL);

	var wheelTireL = wheelTireR.clone();
	wheelTireL.position.z = -wheelTireR.position.z;
	this.mesh.add(wheelTireL);

	var wheelTireB = wheelTireR.clone();
	wheelTireB.scale.set(0.5, 0.5, 0.5);
	wheelTireB.position.set(-35, -5, 0);
	this.mesh.add(wheelTireB);

	var suspensionGeom = new THREE.BoxGeometry(4, 20, 4);
	suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0));
	var suspensionMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.red, shading: THREE.FlatShading});
	var suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
	suspension.position.set(-35, -5, 0);
	suspension.rotation.z = -0.3;
	this.mesh.add(suspension);

	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;

	this.addLabel = function(mesh, size, font){
 		var name = mesh.userData.name;
 		var mbox = new THREE.Box3().setFromObject(mesh);
		var bSize = mbox.getSize().x;

		var nameMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
		
		var fnameGeometry = new THREE.TextGeometry(name, {
			size: size,
			height: 0,
			bevelEnabled: false,
			font: font,
			weigth: "normal"
		});

		var fnameLabel = new THREE.Mesh(fnameGeometry, nameMaterial);
		fnameLabel.name = "flabel";
		fnameLabel.rotateX(-Math.PI/4);
		mesh.add(fnameLabel);

		var fbox = new THREE.Box3().setFromObject(fnameLabel);
		var fSize = fbox.getSize().x;

		var diff = (bSize/2 - fSize/2);
	
		fnameLabel.translateX(-fSize/2);
 	}

	this.buttons = [];
	var btnGeom = new THREE.BoxGeometry(2, 2, 2);
 	var btnMat = new THREE.MeshPhongMaterial({color: GESMO.Colors.white, transparent: true, opacity:0.3, shading:THREE.FlatShading});

 	var slotcoveringGeom = new THREE.BoxGeometry(3, 1, 2);
 	var slotcoveringMat = new THREE.MeshPhongMaterial({
 		color: GESMO.Colors.brownDark,
 		shading: THREE.FlatShading
 	});
 	var slotcovering = new THREE.Mesh(slotcoveringGeom, slotcoveringMat);
 	slotcovering.position.set(28, 20, 2);
 	slotcovering.scale.y = 0.3;
 	this.mesh.add(slotcovering);

 	var slotGeom = new THREE.BoxGeometry(3, 1, 1);
 	var slotMat = new THREE.MeshPhongMaterial({
 		color: GESMO.Colors.red,
 		shading: THREE.FlatShading
 	});
 	this.slot = new THREE.Mesh(slotGeom, slotMat);
 	this.slot.position.set(28, 20, 2);
 	this.slot.scale.x = 0.8;
 	this.slot.scale.y = 0.4;
 	this.mesh.add(this.slot);

 	var btn4 = new THREE.Mesh(btnGeom, btnMat.clone());
 	btn4.userData = {type: 'fly', name: "Fly"};
 	this.addLabel(btn4, 0.4, this.font);
 	btn4.position.set(28, 20, 6);
 	btn4.scale.y = 0.1;
 	this.buttons.push(btn4);
 	this.mesh.add(btn4);

 	var btn5 = new THREE.Mesh(btnGeom, btnMat.clone());
 	btn5.userData = {type: 'land', name: "Land"};
 	this.addLabel(btn5, 0.4, this.font);
 	btn5.position.set(28, 20, 10);
 	btn5.scale.y = 0.1;
 	this.buttons.push(btn5);
 	this.mesh.add(btn5);

	this.movePropeller = false;
	this.blade1.scale.set(0.1, 0.1, 0.1);
	this.blade2.scale.set(0.1, 0.1, 0.1);
	
	this.startAirplane = function(){
		new TWEEN.Tween(this.blade1.scale)
			.to({ x: 1, y:1, z:1}, 1000)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();

		new TWEEN.Tween(this.blade2.scale)
			.to({ x: 1, y:1, z:1}, 1000)
			.easing(TWEEN.Easing.Exponential.InOut)
			.onComplete(function(){
				this.movePropeller = true;
			}.bind(this))
			.start();
	}

	this.stopAirplane = function(){
		this.movePropeller = false;
		new TWEEN.Tween(this.blade1.scale)
			.to({ x: 0.1, y:0.1, z:0.1}, 1000)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();

		new TWEEN.Tween(this.blade2.scale)
			.to({ x: 0.1, y:0.1, z:0.1}, 1000)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();
	}

	this.updatePlane = function(){
	 	if(this.movePropeller){
	 		this.propeller.rotation.x += 0.3;
	 	}
	}
 };

 GESMO.SpaceDebris= function(env){
	var nClouds = 10;
 	var stepAngle = Math.PI/nClouds*2;
 	this.clouds = [];

	var geom = new THREE.BoxGeometry(70, 70, 20);

 	for (var j = 0;j < nClouds;j++){
 		var b = stepAngle*j;
 		var t = 1500 + Math.random()*1000;
	 	for(var i = 0;i < nClouds;i++){
	 		var a = stepAngle*i;
		 	var h = 1500 + Math.random()*1000;
	 		for(var k = 0;k < 3;k++){
	 			var mat = new THREE.MeshPhongMaterial({
						color: Math.random() * 0xffffff - 0x110000,
						shading: THREE.FlatShading,
						transparent: true,
						opacity: 1
				});
			 	var m = new THREE.Mesh(geom.clone(), mat);
			 	var s = 0.1 + Math.random()*0.4;
	 			m.scale.set(s, s, s);

	 			m.castShadow = true;
	 			m.receiveShadow = true;
		 		
		 		m.position.y = Math.sin(a)*h*Math.sin(b)*(i+1)*(1+Math.random());
		 		m.position.x = Math.cos(a)*h*Math.sin(b)*(i+1)*(1+Math.random());

		 		/*note: rotating cloud according to its position*/
		 		m.rotation.z = a + Math.PI/2*Math.random();
		 		/*note: placing clouds at random depth inside the cave*/
		 		m.position.z = t*Math.cos(b)*(i+1)*(1+Math.random());

		 		this.clouds.push(m);
		 		env.add(m);
	 		}
	 	}
	 }

	 this.movedust = function(){
 		var nop = this.clouds.length;
 		for(var i = 0;i < nop;i++){
 			var v = this.clouds[i];

 			var angle = Math.random()*Math.PI*2;
 			v.position.x = v.position.x + Math.cos(angle)*5250;
 			v.position.y = v.position.y + Math.sin(angle)*5250;
 		}
 	}
 };