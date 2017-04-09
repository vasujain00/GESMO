/*
 * GESMO 3D UI
 * Author: @Shashank
 */

 GESMO.GesmoUI = function(logger){
 	this.logger = logger;
 	// Create the scene and add fog effect
 	this.scene = new THREE.Scene();
 	//this.scene.fog = new THREE.Fog(0xf7d9aa, 10000, 95000);

 	// Create the camera
 	var aspectratio = GESMO.WIDTH/GESMO.HEIGHT;
 	fieldOfView = 75;
 	nearPlane = 0.1;
 	farPlane = 100000;
 	this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectratio,
 												nearPlane, farPlane);
 	this.camera.position.x = 0;
 	this.camera.position.z = 0;//7500; 
 	this.camera.position.y = 0;//600; 
 	//this.camera.lookAt(new THREE.Vector3(1,0,0));

 	// Create the renderer
 	this.renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0x000000 });
	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.sortObjects = false;
	this.renderer.shadowMap.enabled = true;
	this.renderer.domElement.style.position = 'absolute';
	this.renderer.domElement.style.top = 0;
	this.renderer.domElement.style.zIndex = 5;
	document.body.appendChild(this.renderer.domElement);

	this.movableObjects = new THREE.Object3D();
	this.movableObjects.savedPos = new THREE.Vector3(0, 0, 0);
	this.scene.add(this.movableObjects);

	// Create lights
 	this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
 	this.ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
 	this.shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
 	this.shadowLight.position.set(150, 350, 350);
 	this.shadowLight.castShadow = true;
 	this.shadowLight.shadow.camera.left = -400;
 	this.shadowLight.shadow.camera.right = 400;
 	this.shadowLight.shadow.camera.top = 400;
 	this.shadowLight.shadow.camera.bottom = -400;
 	this.shadowLight.shadow.camera.near = 1;
 	this.shadowLight.shadow.camera.far = 1000;
 	this.shadowLight.shadow.mapSize.width = 4096;
 	this.shadowLight.shadow.mapSize.height = 4096
 	this.movableObjects.add(this.hemisphereLight);
 	this.movableObjects.add(this.shadowLight);
 	this.movableObjects.add(this.ambientLight);

 	this.spaceDebris = new GESMO.SpaceDebris(this.movableObjects);

	//create the music library and it's elements
	this.musicLibrary = new THREE.Object3D();
	this.movableObjects.add(this.musicLibrary);
	this.btnLibrary = new THREE.Object3D();
	this.scene.add(this.btnLibrary);
	this.sections = [];


	this.libElements = [];
	this.targets = [];
	this.viewMode = GESMO.ARTISTSVIEW;
	this.songviewMode = GESMO.SONGSSEARCHVIEW;
	this.curSongIndex = 0;
	this.curQueueIndex = 0;

 	this.queuePool = [];
 	this.buttons = [];
 	this.isFetchingData = false;
 	this.isRotating = false;
 	this.isTranslating = false;

	this.mousePos = new THREE.Vector2();
	this.clock = new THREE.Clock(); 
	this.raycaster = new THREE.Raycaster();
	this.tsOffset = new THREE.Vector3();
	this.isLeftDragging = false;
	this.previousMousePosition = {
		x: 0,
		y: 0,
	};
	this.isRightDragging = false;

	this.highlighted = null;
	this.rays = [
	      new THREE.Vector3(0, 0, 1),
	      new THREE.Vector3(1, 0, 1),
	      new THREE.Vector3(1, 0, 0),
	      new THREE.Vector3(1, 0, -1),
	      new THREE.Vector3(0, 0, -1),
	      new THREE.Vector3(-1, 0, -1),
	      new THREE.Vector3(-1, 0, 0),
	      new THREE.Vector3(-1, 0, 1)
	    ];

	this.mainList = [
		{type: 'topCharts', name: "Top Charts", image: "topCharts.png"},
		{type: 'queue', name: "Queue", image: "stations.png"},
		{type: 'artistsList', name: "Artists", image: "artists.png"},
		{type: 'newReleases', name: "New Releases", image: "newReleases.png"}
	];

	this.appStarted = false;

	// var objLoader = new THREE.OBJLoader();
	// objLoader.load("http://localhost/GESMO/models/music_note.obj", function(loadedMesh){
	// 	var mat = new THREE.MeshPhongMaterial({
	// 		color: 0x2194ce,
	// 		specular: 0x111111,
	// 		shininess: 30,
	// 		shading: THREE.SmoothShading,
	// 		vertexColors: THREE.NoColors
	// 	});
	// 	loadedMesh.children.forEach(function(child){
	// 	   	child.material = mat;
	// 	   	child.geometry.computeFaceNormals();
	// 	   	child.geometry.computeVertexNormals();
	// 	 });
	// 	 loadedMesh.scale.set(0.5, 0.5, 0.5);
	// 	this.note_model = loadedMesh;
	// 	this.logger.log("ui, loaded, http://localhost/GESMO/models/music_note.obj");
	// }.bind(this));

	// objLoader.load("http://localhost/GESMO/models/guitar.obj", function(loadedMesh){
	// 	var mat = new THREE.MeshPhongMaterial({
	// 		color: 0xce6821,
	// 		specular: 0x111111,
	// 		shininess: 30,
	// 		shading: THREE.SmoothShading,
	// 		vertexColors: THREE.NoColors
	// 	});
	// 	loadedMesh.children.forEach(function(child){
	// 	   	child.material = mat;
	// 	   	child.geometry.computeFaceNormals();
	// 	   	child.geometry.computeVertexNormals();
	// 	 });
	// 	 loadedMesh.scale.set(0.5, 0.5, 0.5);
	// 	this.guitar_model = loadedMesh;
	// 	this.guitar_model.rotateZ(Math.PI/4);
	// 	this.logger.log("ui, loaded, http://localhost/GESMO/models/guitar.obj");
	// }.bind(this));

	// objLoader.load("http://localhost/GESMO/models/record.obj", function(loadedMesh){
	// 	var mat = new THREE.MeshPhongMaterial({
	// 		color: 0xff0000,
	// 		specular: 0x111111,
	// 		shininess: 30,
	// 		shading: THREE.SmoothShading,
	// 		vertexColors: THREE.NoColors
	// 	});
	// 	loadedMesh.children.forEach(function(child){
	// 	   	child.material = mat;
	// 	   	child.geometry.computeFaceNormals();
	// 	   	child.geometry.computeVertexNormals();
	// 	 });
	// 	 loadedMesh.scale.set(2, 2, 3);
	// 	this.record_model = loadedMesh;
	// 	this.record_model.rotateX(-Math.PI/4);
	// 	this.logger.log("ui, loaded, http://localhost/GESMO/models/record.obj");
	// }.bind(this));

	// objLoader.load("http://localhost/GESMO/models/10.obj", function(loadedMesh){
	// 	var mat = new THREE.MeshPhongMaterial({
	// 		color: 0xff0000,
	// 		specular: 0x111111,
	// 		shininess: 30,
	// 		shading: THREE.SmoothShading,
	// 		vertexColors: THREE.NoColors
	// 	});
	// 	loadedMesh.children.forEach(function(child){
	// 	   	child.material = mat;
	// 	   	child.geometry.computeFaceNormals();
	// 	   	child.geometry.computeVertexNormals();
	// 	 });
	// 	 loadedMesh.scale.set(1, 1, 1);
	// 	this.ten_model = loadedMesh;
	// 	this.logger.log("ui, loaded, http://localhost/GESMO/models/10.obj");
	// }.bind(this));

	this.textureLoader = new THREE.TextureLoader();

	var fontLoader = new THREE.FontLoader();
	fontLoader.load("http://localhost/GESMO/fonts/droid/droid_serif_regular.typeface.json", function(font){
		this.titleFont = font;
		this.logger.log("ui, loaded, http://localhost/GESMO/fonts/droid/droid_serif_regular.typeface.json");
		this.logger.log("ui, complete, setup");
		var newEvent = new CustomEvent('gesmo.ui.setupcomplete', {
 			'detail': {
 				nosections: this.mainList.length
 			}
 		});
		window.dispatchEvent(newEvent);
	}.bind(this));
	
 };

GESMO.GesmoUI.prototype = {

 	constructor: GESMO.GesmoUI,

 	start: function(){
 		var nameMaterial = new THREE.MeshPhongMaterial({ 
 			color: 0x2194ce,
 			specular: 0x111111,
			shininess: 30,
			shading: THREE.SmoothShading,
			vertexColors: THREE.NoColors,
			transparent: true,
			opacity: 0
 		});
		
		var nameGeometry = new THREE.TextGeometry("Gesmo", {
			size: 40,
			height: 0,
			bevelEnabled: false,
			font: this.titleFont,
			weigth: "normal"
		});

		this.name = new THREE.Mesh(nameGeometry, nameMaterial);
		var box = new THREE.Box3().setFromObject(this.name);

		this.scene.add(this.name);
		this.name.position.z = -200;
		this.name.position.x = -box.getSize().x/2;

		var messageMaterial = new THREE.MeshPhongMaterial({ 
 			color: 0x2194ce,
 			specular: 0x111111,
			shininess: 30,
			shading: THREE.SmoothShading,
			vertexColors: THREE.NoColors,
			transparent: true,
			opacity: 0
 		});
		
		var messageGeometry = new THREE.TextGeometry("Perform a grab gesture with both hands to begin.", {
			size: 5,
			height: 0,
			bevelEnabled: false,
			font: this.titleFont,
			weigth: "normal"
		});

		this.message = new THREE.Mesh(messageGeometry, messageMaterial);
		var box = new THREE.Box3().setFromObject(this.message);

		this.scene.add(this.message);
		this.message.position.z = -200;
		this.message.position.x = -box.getSize().x/2;
		this.message.position.y = -box.getSize().y/2 - 10;

		var tween1 = new TWEEN.Tween(this.name.material)
			.to({opacity: 1}, 1500);

		var tween2 = new TWEEN.Tween(this.message.material)
			.onComplete(function () {
				this.logger.log("ui, complete, start");
				var newEvent = new CustomEvent('gesmo.ui.startcomplete');
				window.dispatchEvent(newEvent);
			}.bind(this))
			.to({opacity: 1}, 1500);

		tween1.chain(tween2);
		tween1.start();
 	},

 	hideTitle: function(){
 	// 	new TWEEN.Tween(this.name.material)
 	// 		.to({opacity: 0}, 200)
 	// 		.onComplete(function(){
 	// 			this.scene.remove(this.name);
 	// 		}.bind(this))
 	// 		.start();

		// new TWEEN.Tween(this.message.material)
		// 	.to({opacity: 0}, 200)
		// 	.onComplete(function () {
		// 		this.scene.remove(this.message);
		// 		this.createHome();
		// 	}.bind(this))
		// 	.start();

		this.scene.remove(this.name);
		this.scene.remove(this.message);
		this.createHome();
 	},

 	createHome: function(){
 		$(loading).fadeIn();
		this.appStarted = true;
 		var incr = (2*Math.PI)/this.mainList.length;

 		for(var i = 0, theta = 0;i < this.mainList.length; i++, theta += incr){
 			var geom = new THREE.BoxGeometry(200, 50, 20);
 			var mat = new THREE.MeshPhongMaterial({
 				color: 0xffffff,
 				shading: THREE.FlatShading,
 				transparent: true,
 				opacity: 0
 			});

 			var box = new THREE.Mesh(geom, mat);
 			box.position.z = Math.trunc((GESMO.LIBRARYRADIUS - 200)*Math.sin(theta));
			box.position.y = 150
			box.position.x = Math.trunc((GESMO.LIBRARYRADIUS - 200)*Math.cos(theta));
			box.lookAt(new THREE.Vector3(-box.position.x, box.position.y, -box.position.z));
 			box.castShadow = true;
 			box.receiveShadow = true;
 			box.userData.name = this.mainList[i].name;
 			box.userData.type = "back";
 			box.name = "header";
 			this.addLabels(box, 15, true, i);
 			this.buttons.push(box);
 			this.btnLibrary.add(box);

 			var section = new THREE.Object3D();
 			section.position.z = Math.trunc((GESMO.LIBRARYRADIUS - 200)*Math.sin(theta));
			section.position.y = 0;
			section.position.x = Math.trunc((GESMO.LIBRARYRADIUS - 200)*Math.cos(theta));
			section.lookAt(new THREE.Vector3(-box.position.x, 0, -box.position.z)); 
			section.name = this.mainList[i].type;
			this.sections.push(section);
			this.musicLibrary.add(section);

			this.libElements.push([]);
 		}

 		this.viewMode = GESMO.NEWRELEASESVIEW;
 		var event = new CustomEvent('gesmo.ui.setusermap');
 		window.dispatchEvent(event);
 		this.isFetchingData = false;
 		var searchQuery = {
 			type: "albums",
			filterName: "mostRecent",
			filterValue: 24
		};
		this.logger.log("ui, complete, home");
		this.fetchLibrary(searchQuery);
 	},

 	fetchLibrary: function(searchQuery){
 		this.isFetchingData = true;
 		this.destroyLibrary(this.sendQuery.bind(this), searchQuery);
 	},

 	sendQuery: function(query){
 		var newEvent = new CustomEvent('gesmo.ui.fetchlibrary', {
 			'detail': {
 				query: query,
 				viewno: this.viewMode
 			}
 		});

 		window.dispatchEvent(newEvent);
 		$(loading).fadeIn();
 	},

 	destroyLibrary: function(callback, callbackargs){
 		while(this.libElements[this.viewMode].length > 0){
 			var libMesh = this.libElements[this.viewMode].pop();
 				//this.musicLibrary.remove(libMesh);
 			var flabel = libMesh.getObjectByName("flabel");
 			libMesh.remove(flabel);

 			var image = libMesh.getObjectByName("image_plane");
 			image.material.map.needsUpdate = false;
 			libMesh.remove(image);
 				
 			var targetPos = libMesh.userData.position;
 			var targetRot = libMesh.userData.rotation;
 			var targetSca = libMesh.userData.scale;

 			this.sections[this.viewMode].remove(libMesh);
 			libMesh.position.x = targetPos.x;
 			libMesh.position.y = targetPos.y;
 			libMesh.position.z = targetPos.z;
 			libMesh.rotation.x = targetRot.x;
 			libMesh.rotation.y = targetRot.y;
 			libMesh.rotation.z = targetRot.z;
 			libMesh.scale.x = targetSca.x;
 			libMesh.scale.y = targetSca.y;
 			libMesh.scale.z = targetSca.z;
 			this.movableObjects.add(libMesh);
 		}

 		if(callback != null){
 			var args = [];
 			args.push(callbackargs);
 			callback.apply(this, args);
 		}
 	},

 	showLibrary: function(type, data){
	 	var k = 0;
	 	var sIndex = Math.floor(Math.random()*(this.spaceDebris.clouds.length - 1) + 1);
	 	while(this.spaceDebris.clouds.length - sIndex <= data.length){
	 		sIndex = Math.floor(Math.random()*(this.spaceDebris.clouds.length - 1) + 1);
	 	}

	 	//this.scene.updateMatrixWorld();
	 	for(var i = 0;i < data.length;i++){
	 		var itemMesh = this.spaceDebris.clouds[sIndex + i];
	 		itemMesh.userData = data[i];
	 		itemMesh.userData.type = type;
	 		itemMesh.userData.position = itemMesh.position.clone();
	 		itemMesh.userData.rotation = itemMesh.rotation.clone();
	 		itemMesh.userData.scale = itemMesh.scale.clone();
	 		itemMesh.userData.index = i;

			this.addLabels(itemMesh, 10, false, -1);
			this.addImage(itemMesh);

			if(type == "queueitem"){
	 			itemMesh.position.set(0, 0, 0);
	 		}

			this.libElements[this.viewMode].push(itemMesh);
			this.movableObjects.remove(itemMesh);
			this.sections[this.viewMode].add(itemMesh);
	 	}
 		this.assignTargets(type, null, null);
 		this.transform(this.targets, 1000, null, null);
 		this.logger.log("ui, loaded, " + type + " list");
 	},	

 	addLabels: function(mesh, size, isButton, index){
 		var names = mesh.userData.name;
 		var mbox = new THREE.Box3().setFromObject(mesh);
		var bSize = mbox.getSize();
		var bSizey = bSize.y;

		var nameMaterial = new THREE.MeshPhongMaterial({ 
			color: 0xffffff, 
			specular: 0x111111,
			shininess: 30,
			shading: THREE.SmoothShading,
			vertexColors: THREE.NoColors
		});
		
		var fnameGeometry = new THREE.TextGeometry(names, {
			size: size,
			height: 0,
			bevelEnabled: false,
			font: this.titleFont,
			weigth: "normal"
		});

		var fnameLabel = new THREE.Mesh(fnameGeometry, nameMaterial);
		fnameLabel.name = "flabel";
		mesh.add(fnameLabel);

		var fbox = new THREE.Box3().setFromObject(fnameLabel);
		var fSize = fbox.getSize();
		var fSizex = names.length*size;
		var fSizez = fSize.z;

		if(isButton && index%2 == 0){
			fnameLabel.position.x = -fSizez/2;
			fnameLabel.position.y = 0;
			fnameLabel.position.z = 0;
		} else {
			fnameLabel.position.x = (-fSizex/2)+2*size;
			fnameLabel.position.y = 0;
			fnameLabel.position.z = 8;
		}

		if(!isButton){
			fnameLabel.position.y = -70;
		}
	},

	addImage: function (mesh) {
		var imagePath = "http://localhost/GESMO/images/";
		if(mesh.userData.image){
			imagePath += mesh.userData.image;
		} else {
			var colorIndex = Math.floor(Math.random()*10) + 1;
			var type = mesh.userData.type;
			if(type == "albums"){
				imagePath += "album_flat_" + colorIndex + ".png";
			} else if(type == "artists"){
				imagePath += "artist_flat_" + colorIndex + ".png";
			} else if(type == "genres"){
				imagePath += "genre_flat_" + colorIndex + ".png";
			} else {
				imagePath += "song_flat_" + colorIndex + ".png";
			}
		}
		
		
		this.textureLoader.load(
			imagePath,
			function(texture){
				var img = new THREE.MeshPhongMaterial({
					side: THREE.DoubleSide,
					map: texture
				});
				img.map.needsUpdate = true;
				var planeHt, planeWd;
				if(mesh.geometry.parameters){
					planeHt = mesh.geometry.parameters.height;
					planeWd = mesh.geometry.parameters.width;
				} else {
					planeHt = 70;
					planeWd = 70;
				}

				var plane = new THREE.Mesh(new THREE.PlaneGeometry(planeWd, planeHt), img);
				plane.overdraw = true;
				plane.name = "image_plane";
				mesh.add(plane);
			}.bind(this),
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},	
			function ( xhr ) {
				console.log( 'An error happened' );
			});
	},

	assignTargets: function(type, start, end){
		this.targets.length = 0;
		if(type == "queueitem"){
			if(start == null){
				start = -this.curSongIndex;
				end = this.libElements[this.viewMode].length - this.curSongIndex;
			}
			for ( var i = start, l = end; i < l; i++ ) {
				var itemGeom = new THREE.PlaneGeometry(1, 1);
				var itemMat = new THREE.MeshNormalMaterial();
				var itemMesh = new THREE.Mesh(itemGeom, itemMat);

				if(i < 0){
					itemMesh.position.z = 0;
					itemMesh.position.x = -150;
				} else if(i == 0){
					itemMesh.position.z = 100;
					itemMesh.position.x = 0;
				} else {
					itemMesh.position.z = 0;
					itemMesh.position.x = 150;
				}
				
				itemMesh.position.y = i*140;

				itemMesh.lookAt( new THREE.Vector3(itemMesh.position.x, itemMesh.position.y, itemMesh.position.z));

				this.targets.push( itemMesh );

			}
		} else if(type == "songs") {
			for ( var i = 0; i < this.libElements[this.viewMode].length; i ++ ) {

				var itemGeom = new THREE.PlaneGeometry(1, 1);
				var itemMat = new THREE.MeshNormalMaterial();
				var itemMesh = new THREE.Mesh(itemGeom, itemMat);

				itemMesh.position.x = this.movableObjects.position.x + ( ( i % 4 ) * 160 ) - 250;
				itemMesh.position.y = this.movableObjects.position.y + ( - ( Math.floor( i / 4 ) % 2 ) * 180 ) + 70;
				itemMesh.position.z = -this.movableObjects.position.z - ( Math.floor( i / 8 ) ) * 1000;
				itemMesh.lookAt(new THREE.Vector3(itemMesh.position.x, itemMesh.position.y, 0));

				this.targets.push( itemMesh );
			}
		} else {
			for ( var i = 0; i < this.libElements[this.viewMode].length; i ++ ) {

				var itemGeom = new THREE.PlaneGeometry(1, 1);
				var itemMat = new THREE.MeshNormalMaterial();
				var itemMesh = new THREE.Mesh(itemGeom, itemMat);

				itemMesh.position.x = ( ( i % 4 ) * 160 ) - 250;
				itemMesh.position.y = ( - ( Math.floor( i / 4 ) % 2 ) * 180 ) + 70;
				itemMesh.position.z = -( Math.floor( i / 8 ) ) * 1000;
				itemMesh.lookAt(new THREE.Vector3(itemMesh.position.x, itemMesh.position.y, 0));

				this.targets.push( itemMesh );
			}
		}
	},

	transform: function( targets, duration, start, end) {
		var i = 0;
		var l = this.libElements[this.viewMode].length;
		if(start != null){
			i = start;
			l = end; 
		}
		for (; i < l; i++) {
			var object = this.libElements[this.viewMode][ i ];
			var target = (targets.length) ? targets[i] : targets;

			// object.position.x = target.position.x;
			// object.position.y = target.position.y;
			// object.position.z = target.position.z;

			object.rotation.x = target.rotation.x;
			object.rotation.y = target.rotation.y;
			object.rotation.z = target.rotation.z;

			object.material.opacity = 0;

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, 1500 )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, 1500 )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween(object.material)
				.to({opacity: 0}, 1500)
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.scale )
				.to({x: 1, y: 1, z: 1}, 1500)
				.start();

		}

		new TWEEN.Tween( this )
			.to( {}, 1500 )
			.onUpdate( this.render )
			.onComplete(function(){
	 			$(loading).fadeOut();
				this.isFetchingData = false;
			}.bind(this))
			.start();


		return this;
	},

 	onWindowResize: function(){
 		this.camera.aspect = window.innerWidth/window.innerHeight;
 		this.camera.updateProjectionMatrix();

 		this.renderer.setSize(window.innerWidth, window.innerHeight);
 	},

 	// for mouse interaction----------------------------------------------------------------------------------

 	onMouseDown: function(event){
 		if(!this.appStarted){
 			return;
 		}
 		this.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		this.raycaster.setFromCamera( this.mousePos, this.camera );
	
		if(event.button == 0){
			var objectsArray = [];
			if(this.viewMode == GESMO.HOMEVIEW){
				this.musicLibrary.children
			}
			for(var i = 0;i < this.libElements[this.viewMode].length;i++){
				objectsArray.push(this.libElements[this.viewMode][i]);
			}

			var intersects = this.raycaster.intersectObjects( objectsArray );

			if(intersects.length == 0){
				this.isLeftDragging = true;
			}	
		}

		this.previousMousePosition = {
			x: event.offsetX,
			y: event.offsetY
		};
 	},

 	onMouseMove: function(event){
 		event.preventDefault();
 		if(!this.appStarted){
 			return;
 		}

		if(this.isLeftDragging){
			var deltaMove = {
				x: event.offsetX - this.previousMousePosition.x,
				y: event.offsetY - this.previousMousePosition.y
			}; 

			if(Math.abs(deltaMove.x) > Math.abs(deltaMove.y)){
				this.translateLibX(deltaMove.x);
			}

			if(Math.abs(deltaMove.x) < Math.abs(deltaMove.y)){
				this.translateLibY(deltaMove.y);
			}
		} else if(this.isRightDragging) {
			this.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			this.raycaster.setFromCamera( this.mousePos, this.camera );

			var plane = new THREE.Plane();
			plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(plane.normal), this.musicBox.position);

			var intersection = new THREE.Vector3();

			this.raycaster.ray.intersectPlane(plane, intersection);

			var delta = intersection.sub(this.tsOffset);
			this.tsOffset.copy(intersection);

			// tranlate call
		} else {
			this.mousePos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.mousePos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			this.raycaster.setFromCamera( this.mousePos, this.camera );
			var objectsArray = this.fetchAllPickables();

			var intersects = this.raycaster.intersectObjects( objectsArray );

			if ( intersects.length > 0 ) {

				if ( this.highlighted != intersects[0].object ) {

					if(this.highlighted != null) { this.removeHighlight(this.highlighted); }
					this.highlighted = intersects[0].object;
					this.highlightElement(this.highlighted);

				}
			} else {
				if(this.highlighted != null) { this.removeHighlight(this.highlighted); }
				this.highlighted = null;
			}
		}

		this.previousMousePosition = {
			x: event.offsetX,
			y: event.offsetY
		};
 	},

 	onMouseUp: function(event){
 		if(!this.appStarted){
 			return;
 		}
 		this.isLeftDragging = false;
 		this.isRightDragging = false;
 	},

 	clickAnimation: function(mesh){
 		var geom = new THREE.PlaneGeometry(1, 1);
 		var mat = new THREE.MeshPhongMaterial({
 			color: 0x2194ce,
 			side: THREE.DoubleSide
 		});

 		var particles = [];
 		var targetPos = [];
		for(var i = 0;i < 1000;i++){
 			var particle = new THREE.Mesh(geom.clone(), mat.clone());
 			particle.position.x = mesh.position.x;
 			particle.position.y = mesh.position.y;
 			particle.position.z = mesh.position.z;
 			if(mesh.name == "header"){
 				this.musicLibrary.add(particle);
 			} else {
 				this.sections[this.viewMode].add(particle);
 			}
 			
 			particles.push(particle);
 			var x = -1 + Math.random() * 2;
			var y = -1 + Math.random() * 2;
			var z = -1 + Math.random() * 2;
			var d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			x *= d;
			y *= d;
			z *= d;
 			targetPos.push(new THREE.Vector3(mesh.position.x + 150*x, mesh.position.y + 150*y, mesh.position.z + 150*z));
 		}

  		for(var i = 0;i < 1000;i++){

  			var particle = particles[i];
  			var target = targetPos[i];

  			if(i == 0){
  				new TWEEN.Tween(particle.position)
  				.easing(TWEEN.Easing.Exponential.Out)
  				.to({x: target.x, y: target.y, z: target.z}, 7500)
  				.onComplete(function(){
  					var selectedType = mesh.userData.type;
  				}.bind(this))
  				.start();
  				
  			} else {
  				new TWEEN.Tween(particle.position)
  				.easing(TWEEN.Easing.Exponential.Out)
  				.to({x: target.x, y: target.y, z: target.z}, 7500)
  				.start();
  			}
  			

  			new TWEEN.Tween(particle.scale)
  				.easing(TWEEN.Easing.Exponential.Out)
  				.to({x: 0.1, y: 0.1, z: 0.1}, 7500)
  				.onComplete(function(){
  					this.sections[this.viewMode].remove(particle);
  				}.bind(this))
  				.start();
  		}
 	},

 	onClick: function(event){
 		if(!this.appStarted){
 			var event = new CustomEvent('gesmo.gesture.startdectected');
 			window.dispatchEvent(event);
 			return;
 		}

 		if(event.button == 0 && this.highlighted != null && this.isFetchingData == false){
 			this.clickAnimation(this.highlighted);
 			var selectedType = this.highlighted.userData.type;			
			
			var searchQuery = {
					filterName: null,
					filterValue: null
			};

			switch(selectedType){
				case "artists" : {
					searchQuery.type = "songs";
					searchQuery.filterName = "artist_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.fetchLibrary(searchQuery);	
					break;
				}
				case "albums" : {
					searchQuery.type = "songs";
					searchQuery.filterName = "album_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.fetchLibrary(searchQuery);
					break;
				}
				case "genres" : {
					searchQuery.type = "songs";
					searchQuery.filterName = "genre_id";
					searchQuery.filterValue = this.highlighted.userData.id;
					this.fetchLibrary(searchQuery);
					break;
				}
				case "queueitem" : {
					// var event = new CustomEvent("gesmo.ui.removefromq", {"detail": { "index" : this.highlighted.userData.index}});
					// window.dispatchEvent(event);
					break;
				}
				case "back" : {
					searchQuery.type = "back";
					this.fetchLibrary(searchQuery);
					break;
				}
				case "songs" : {
					this.queueSong(this.highlighted);
					break;
				}
				case "play" : {
					var event = new CustomEvent("gesmo.actions.play");
					window.dispatchEvent(event);
					break;
				}
				case "pause" : {
					var event = new CustomEvent("gesmo.actions.pause");
					window.dispatchEvent(event);
					break;
				}
				case "prev" : {
					var event = new CustomEvent("gesmo.actions.prev");
					window.dispatchEvent(event);
					break;
				}
				case "next" : {
					var event = new CustomEvent("gesmo.actions.next");
					window.dispatchEvent(event);
					break;
				}
			}

 			this.logger.log("ui, clicked, " + selectedType + ": " + this.highlighted.userData.name);
		}
 	},

 	onKeyPress: function(event){
 		if(!this.appStarted){
 			return;
 		}
 		var key = event.key;
 		switch(key){
 			case "s": {
 				this.moveToSection("left", null);
 				break;
 			}

 			case "f": {
 				this.moveToSection("right", null);
 				break;
 			}

 			case "e": {
 				this.moveInSection("forward", null);
 				break;
 			}

 			case "d": {
 				this.moveInSection("backward", null);
 			}
 		}

 		console.log(event);
 	},

 	moveToSection: function(direction, callback){
 		if(!this.isRotating && !this.isTranslating){
 			TWEEN.removeAll();
 			this.isRotating = true;
	 		var curYRot = this.musicLibrary.rotation.y;

	 		var goBack = false;
	 		if(this.movableObjects.position.z != 0){
	 			goBack = true;
	 		}

	 		var tween1;
	 		if(goBack){
	 			tween1 = new TWEEN.Tween(this.movableObjects.position)
	 				.easing( TWEEN.Easing.Exponential.InOut )
	 				.onComplete(function(){
	 					this.movableObjects.savedPos.copy(this.movableObjects.position);
	 				}.bind(this))
	 				.to({ x: 0, y : 0, z: 0}, 100);
	 		}
	 		

	 		var tween2;
	 		var tween3;

	 		if(direction == "right"){
				var target = curYRot + Math.PI/2;
				tween2 = new TWEEN.Tween(this.musicLibrary.rotation)
				 	.to({ y : target}, 700)
				 	.easing( TWEEN.Easing.Exponential.InOut )
				 	.onComplete(function(){
				 		this.destroyLibrary(null, null);
				 		var oldView = this.viewMode;
				 		this.viewMode++;
				 		if(this.viewMode > this.mainList.length - 1) this.viewMode = 0;
				 		this.loadSection();
				 		this.isRotating = false;
				 		var event = new CustomEvent('gesmo.ui.setusermap');
				 		this.logger.log("ui, movedToSection, from " + oldView + "to " + this.viewMode);
				 		window.dispatchEvent(event);
				 		if(callback != null)
				 			callback();
				 	}.bind(this));

				 tween3 = new TWEEN.Tween(this.btnLibrary.rotation)
				 	.to({ y : target}, 800)
				 	.easing( TWEEN.Easing.Exponential.InOut);
			} else {
				 var target = curYRot - Math.PI/2;
				 tween2 = new TWEEN.Tween(this.musicLibrary.rotation)
				 	.to({ y : target}, 700)
				 	.easing( TWEEN.Easing.Exponential.InOut )
				 	.onComplete(function(){
				 		this.destroyLibrary(null, null);
				 		var oldView = this.viewMode;
				 		this.viewMode--;
				 		if(this.viewMode < 0) this.viewMode = this.mainList.length - 1;
				 		this.loadSection();
				 		this.isRotating = false;
				 		var event = new CustomEvent('gesmo.ui.setusermap');
				 		this.logger.log("ui, movedToSection, from " + oldView + "to " + this.viewMode);
				 		window.dispatchEvent(event);
				 		if(callback != null)
				 			callback();
				 	}.bind(this));

				 tween3 = new TWEEN.Tween(this.btnLibrary.rotation)
				 	.to({ y : target}, 800)
				 	.easing( TWEEN.Easing.Exponential.InOut);
			}

			if(goBack){
				tween1.chain(tween2);
				tween1.start();
			} else {
				tween2.start();
			}
			tween3.start();
 		}
 	},

 	loadSection: function(){
 		var searchQuery = {
			filterName: null,
			filterValue: null
		};

 		switch(this.sections[this.viewMode].name){
 			case "artistsList" : {
				searchQuery.type = "artists";
				break;
			}
			case "topCharts" : {
				searchQuery.type = "genres";
				break;
			}
			case "newReleases" : {
				searchQuery.type = "albums";
				searchQuery.filterName = "mostRecent";
				searchQuery.filterValue = 24;
				break;
			}
			case "queue" : {
				searchQuery.type = "queue";
				break;
			}
		}
 		
		this.sendQuery(searchQuery);
 	},

 	moveInSection: function(direction, callback){
 		if(!this.isTranslating && !this.isRotating){
 			TWEEN.removeAll();
 			if(this.viewMode == GESMO.QUEUEVIEW){
 				var curYPos = this.movableObjects.position.y;
		 		if(direction == "up"){
		 			var topLevel = this.libElements[this.viewMode].length - (this.curSongIndex + 1);
		 			if(curYPos > -1*topLevel*140){
		 				this.isTranslating = true;
		 				var target = curYPos - 140;
			 			new TWEEN.Tween(this.movableObjects.position)
			 				.to({ y : target}, 500)
			 				.easing( TWEEN.Easing.Exponential.InOut )
			 				.onComplete(function(){
			 					this.movableObjects.savedPos.copy(this.movableObjects.position);
			 					this.isTranslating = false;
			 					if(callback != null)
			 						callback();
			 					this.logger.log("ui, movedInSection, " + this.viewMode + " by -140 y");
			 				}.bind(this))
			 				.start();
		 			}
		 		} else {
		 			var bottomlevel = this.curSongIndex;
		 			if(curYPos < bottomlevel*140){
		 				this.isTranslating = true;
		 				var target = curYPos + 140;
			 			new TWEEN.Tween(this.movableObjects.position)
			 				.to({ y : target}, 500)
			 				.easing( TWEEN.Easing.Exponential.InOut )
			 				.onComplete(function(){
			 					this.movableObjects.savedPos.copy(this.movableObjects.position);
			 					this.isTranslating = false;
			 					if(callback != null)
			 						callback();
			 					this.logger.log("ui, movedInSection, " + this.viewMode + " by 140 y");
			 				}.bind(this))
			 				.start();
		 			}
		 		}
 			} else {
 				var curZPos = this.movableObjects.position.z;
		 		if(direction == "forward"){
		 			var lastLevel = Math.ceil(this.libElements[this.viewMode].length/8);
		 			if(curZPos < (lastLevel - 1)*1000){
		 				this.isTranslating = true;
		 				var target = curZPos + 1000;
			 			new TWEEN.Tween(this.movableObjects.position)
			 				.to({ z : target}, 500)
			 				.easing( TWEEN.Easing.Exponential.InOut )
			 				.onComplete(function(){
			 					this.movableObjects.savedPos.copy(this.movableObjects.position);
			 					this.isTranslating = false;
			 					if(callback != null)
			 						callback();
			 					this.logger.log("ui, movedInSection, " + this.viewMode + " by 1000 z");
			 				}.bind(this))
			 				.start();
		 			}
		 		} else {
		 			if(curZPos > 0){
		 				this.isTranslating = true;
		 				var target = curZPos - 1000;
			 			new TWEEN.Tween(this.movableObjects.position)
			 				.to({ z : target}, 500)
			 				.easing( TWEEN.Easing.Exponential.InOut )
			 				.onComplete(function(){
			 					this.movableObjects.savedPos.copy(this.movableObjects.position);
			 					this.isTranslating = false;
			 					if(callback != null)
			 						callback();
			 					this.logger.log("ui, movedInSection, " + this.viewMode + " by -1000 z");
			 				}.bind(this))
			 				.start();
		 			}
		 		}
 			}

 		}
 	},

 	// -------------------------------------------------------------------------------------------------------

 	// for leap motion interaction ---------------------------------------------------------------------------

 	onHandMove: function(handMesh){
 		var toHighlight = this.checkIntersection(handMesh);
 		if(toHighlight != null){
 			if(this.highlighted != toHighlight){
 				if(this.highlighted != null) { this.removeHighlight(this.highlighted); }
				this.highlighted = toHighlight;
				this.highlightElement(this.highlighted);
 			}
 		} else {
 			if(this.highlighted != null) this.removeHighlight(this.highlighted);
 			this.highlighted = null;
 		}
 	},

 	//--------------------------------------------------------------------------------------------------------

 	animate: function(){
 		var delta = this.clock.getDelta();
 		if(this.airplane){
 			this.airplane.updatePlane();
 		}
 		TWEEN.update();
 		this.render();
 	},

 	render: function(){
 		this.renderer.render( this.scene, this.camera );
 	},

	highlightElement: function(element){
		var imagePlane = element.getObjectByName("image_plane");
		if(imagePlane){
			// imagePlane.currentHex = imagePlane.children[0].material.emissive.getHex();
			// imagePlane.children[0].material.emissive.setHex(0x2194ce); 

			imagePlane.currentHex = imagePlane.material.emissive.getHex();
			imagePlane.material.emissive.setHex(0x2194ce); 
		}
		var flabel = element.getObjectByName("flabel");
		if(flabel){
			flabel.currentHex = flabel.material.color.getHex();
			flabel.material.color.setHex(0x2194ce);
		}
		
	},

	removeHighlight: function(element){
		var imagePlane = element.getObjectByName("image_plane");
		if(imagePlane){
			//imagePlane.children[0].material.emissive.setHex(imagePlane.currentHex);
			imagePlane.material.emissive.setHex(imagePlane.currentHex);
		}
		var flabel = element.getObjectByName("flabel");
		if(flabel){
			flabel.material.color.setHex( flabel.currentHex );
		}
	},

	queueSong: function(item){
		this.isFetchingData = true;
		var copy = item.clone();
		copy.position.copy(item.position);
		copy.rotation.copy(item.rotation);
		copy.material.opacity = 0;

		this.sections[this.viewMode].add(copy);

		new TWEEN.Tween(copy.scale)
			.to({ x: 0.1, y: 0.1, z: 0.1}, 500)
			.start();


		new TWEEN.Tween( copy.position )
				.to( { x: 0, y: 200, z: -this.movableObjects.position.z }, 1000 )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.onComplete(function(){
						this.sections[this.viewMode].remove(copy);
						// send a call to queue with copy.info.id as argument
						var newEvent = new CustomEvent('gesmo.ui.addtoqueue', {
							detail: {
								type: copy.userData.type,
								id: copy.userData.id
							}
						});

						this.isFetchingData = false;
						window.dispatchEvent(newEvent);
					}.bind(this))
				.start();
	},

	removeSong: function(item, index){
		this.isFetchingData = true;

		new TWEEN.Tween(item.scale)
			.to({ x: 0.01, y: 0.01, z: 0.01}, Math.random() * 500 + 500)
			.start();

		new TWEEN.Tween(item.rotation)
			.to({x: 0, y: 0, z: 0}, Math.random() * 500 + 500)
			.start();


		new TWEEN.Tween( item.position )
				.to( { x: 0, y: 0, z: 0 }, Math.random() * 500 + 500 )
				.easing( TWEEN.Easing.Quadratic.InOut )
				.onComplete(function(){
						this.sections[this.viewMode].remove(item);
						// send a call to queue with copy.info.id as argument
						if(index < this.curSongIndex){
							this.assignTargets("queue", -this.curSongIndex+1,-index)
							this.transform(this.targets, 2000, 0, index);
						} else {
							this.assignTargets("queue", index-this.curSongIndex, this.libElements[this.viewMode].length - index);
							this.transform(this.targets, 2000, index, this.libElements[this.viewMode].length);
						}
					}.bind(this))
				.start();
	},

	rotateLib: function(deltaMove){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					0, //this.toRadians(deltaMove.y * 1),
					this.toRadians(deltaMove.x * 1),
					0,
					'XYZ'
				));

		this.movableObjects.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.movableObjects.quaternion);
	},

	translateLibX: function(delta){
		this.movableObjects.translateX(delta*10);
	},

	translateLibY: function(delta){
		this.movableObjects.translateY(delta*10);
	},

	translateLibZ: function(delta){
		this.movableObjects.translateZ(delta*10);
	},

	rotateLibX: function(delta){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					delta,
					0,
					0,
					'XYZ'
				));

		this.movableObjects.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.movableObjects.quaternion);
	},

	rotateLibY: function(delta){
		// var deltaRotationQuaternion = new THREE.Quaternion()
		// 		.setFromEuler(new THREE.Euler(
		// 			0,
		// 			delta,
		// 			0,
		// 			'XYZ'
		// 		));

		// this.movableObjects.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.movableObjects.quaternion);
		this.musicLibrary.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta);
	}, 

	rotateLibZ: function(delta){
		var deltaRotationQuaternion = new THREE.Quaternion()
				.setFromEuler(new THREE.Euler(
					0,
					0,
					delta,
					'XYZ'
				));

		this.movableObjects.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.movableObjects.quaternion);
	},

	// helper functions --------------------------------------
	toRadians: function(angle) {
		return angle * (Math.PI / 180);
	},

	toDegrees: function(angle) {
		return angle * (180 / Math.PI);
	},

	fetchAllPickables: function(){
		var objectsArray = [];
		//var objectsArray = objectsArray.concat(this.buttons);
		objectsArray.push(this.buttons[this.viewMode]);
		for(var i = 0;i < this.libElements[this.viewMode].length;i++){
			if(this.calDistance(this.libElements[this.viewMode][i].position, new THREE.Vector3(0)) <= 1000){
				objectsArray.push(this.libElements[this.viewMode][i]);
			}
		}

		return objectsArray;
	},

	calDistance: function(pos1, pos2){
		return Math.sqrt(Math.pow(pos2.x - pos1.x, 2), Math.pow(pos2.y - pos1.y, 2), Math.pow(pos2.z - pos1.z, 2));
	},

	checkIntersection: function(handMesh){
		var handBox = new THREE.Box3().setFromObject(handMesh);
		var objects = this.fetchAllPickables();
		for(var i = 0;i < objects.length;i++){
			var box3 = new THREE.Box3().setFromObject(objects[i]);
			var collision = box3.intersectsBox(handBox);
			if(collision){
				return objects[i];
			}
		}

		return null;
	},

	onSongChange: function(index){
		var oldSongIndex = this.curSongIndex;
		this.curSongIndex = index;
		this.logger.log("ui, songchange, from" + oldSongIndex + " to " + this.curSongIndex);
		if(this.viewMode == GESMO.QUEUEVIEW){
			this.assignTargets("queueitem");
			this.transform(this.targets, 2000, null, null);
		}
	},

	onSongRemove: function(index){
		if(this.viewMode == GESMO.QUEUEVIEW){
			var iToRemove;
			for(var i = 0;i < this.libElements[this.viewMode].length;i++){
				var item = this.libElements[this.viewMode][i];
				if(item.userData.index == index){
					iToRemove = item;
					break;
				}
			}
			this.removeSong(iToRemove, index);
		}
	}
};