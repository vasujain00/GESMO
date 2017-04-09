var windowMode =  GESMO.MaxMode;
var ui, leapController, dataController, player, leapController, gestureController, logger;

var queue = [];
var loadedData = [];
var searchQueries = [];
var mapSections = [];

window.onload = function(){
	var secs = $("#userMap").find('.box');
	mapSections.push(secs[2]);
	mapSections.push(secs[3]);
	mapSections.push(secs[1]);
	mapSections.push(secs[0])

	var tutLinks = $("#tuts").find('.box');
	tutLinks.each(function(index){
		var id = $(this).attr("id");
		$(this).click(function(){
			var win = window.open("http://localhost/Gesmo/tutorial.html#" + id, '_blank');
  			win.focus();
		});
	});

	logger = new GESMO.Logger();
	logger.createServerFile();
	ui = new GESMO.GesmoUI(logger);
	dataController = new GESMO.DataController(logger);
	player = new GESMO.GesmoPlayer([], logger);
	leapController = new Leap.Controller({ enableGestures: true })
		.use('transform', {
			position: new THREE.Vector3(0, -200, -150),
			effectiveParent: ui.camera
		})
		.use('riggedHand', {
			parent: ui.scene,
			renderer: ui.renderer,
			camera: ui.camera,
			materialOptions: {
		      wireframe: false,
		      color: new THREE.Color(0xcccccc)
		    },
		    positionScale: 2,
			renderFn: function(){
				gestureController.update();
				ui.animate();
			}
		}).connect();


	gestureController = new GESMO.GestureController(leapController, ui, player, logger);

	window.addEventListener('gesmo.ui.fetchlibrary', function(event){
		var secno = event.detail.viewno;
		switch(event.detail.query.type){
			case "queue" : {
					sendQueueToUI();
				break;
			}

			case "back" : {
					if(searchQueries[secno].length > 1){
						searchQueries[secno].pop();
					}
					
					dataController.fetchData(searchQueries[secno][searchQueries[secno].length - 1], dataFetched, dataFetchFailed);
				break;
			}

			default: {
				dataController.fetchData(event.detail.query, dataFetched, dataFetchFailed);
				searchQueries[secno].push(event.detail.query);
			}
		}
		
	}.bind(this));

	window.addEventListener('gesmo.ui.addtoqueue', function(event){
		addToQueue(event.detail.type, event.detail.id);
	}.bind(this));

	window.addEventListener('gesmo.ui.removefromq', function(event){
		removeFromQueue(event.detail.index);
	}.bind(this));

	window.addEventListener('gesmo.ui.setupcomplete', function(event){
		var nos = event.detail.nosections;
		for(var i = 0;i < nos;i++){
			searchQueries.push([]);
		}
		ui.start();
	}.bind(this));

	window.addEventListener('gesmo.ui.startcomplete', function(){
		//gestureController.setStartGesture();
	}.bind(this));

	window.addEventListener('resize', function(event){
		ui.onWindowResize();
	}.bind(this), false);

	document.addEventListener('mousedown', function(event){
		ui.onMouseDown(event);
	}.bind(this), false);

	document.addEventListener('mouseup', function(event) {
		ui.onMouseUp(event);
	}.bind(this), false);

	document.addEventListener('mousemove', function(event) {
		ui.onMouseMove(event);
	}.bind(this), false);

	document.addEventListener('click', function(event) {
		ui.onClick(event);
	}.bind(this), false);

	document.addEventListener('keypress', function(event){
		ui.onKeyPress(event);
	}.bind(this), false);

	window.addEventListener('gesmo.actions.play', function(event){
		player.play();
	}.bind(this));

	window.addEventListener('gesmo.actions.pause', function(event){
		player.pause();
	}.bind(this));

	window.addEventListener('gesmo.actions.prev', function(event){
		player.skip("prev");
	}.bind(this));

	window.addEventListener('gesmo.actions.next', function(event){
		player.skip("next");
	}.bind(this));

	window.addEventListener('gesmo.player.newsong', function(event){
		ui.onSongChange(event.detail.index);
	}.bind(this));

	window.addEventListener('gesmo.player.songremoved', function(event){
		ui.onSongRemove(event.detail.index);
	});

	window.addEventListener('gesmo.gesture.startdectected', function(event){
		$("#playerContainer").fadeIn(function(){
			$("#userMap").fadeIn("fast", function(){
				ui.hideTitle();
			}.bind(this));
		}.bind(this));
	}.bind(this));

	window.addEventListener('gesmo.ui.setusermap', function(event){
		mapSections.forEach(function(sec){
			$(sec).css({ border: "2px solid rgba(33, 148, 206, 0.25)",
						  background: "transparent" });
		}.bind(this));
		$(mapSections[ui.viewMode]).css({ border: "2px solid rgba(33, 148, 206, 1)",
											background: "rgba(33, 148, 206, 0.25)"});
		gestureController.pausePlaying = false;
	}.bind(this));

	//loop();
}

function loop(){
	requestAnimationFrame(loop);
	ui.animate();
}

function dataFetched(type, data){
	if(!gestureController.startGesture){
		gestureController.startGesture = true;
	}
	var dataList = [];
	loadedData.length = 0;
	data.forEach(function(item){
		dataList.push({
			name: item.name,
			id: item.id,
			image: item.image
		});
		loadedData.push(item);
	}.bind(this));
	ui.showLibrary(type, dataList);
}

function dataFetchFailed(error){
	console.log(error);
}

function addToQueue(type, id){
	if(type == "songs"){
		var songObj = findObjectByKey(loadedData, "id", id);
		if(songObj != null) { this.player.playlist.push(songObj); 
			if(this.player.checkPlaylistState() == GESMO.PLAYLISTEMPTY){
				this.player.play(0);
			}
		}
		else { console.log("Error: Could not find song with id = " + id + " to add to the queue");}
	}
}

function removeFromQueue(index){
	this.player.removeFromPlaylist(index); 
}

function findObjectByKey(arr, key, value){
	for(var i = 0;i < arr.length;i++){
		if(arr[i][key] == value){
			return arr[i];
		}
	}
	return null;
}

function sendQueueToUI(){
	var dataList = [];
	this.player.playlist.forEach(function(qItem){
		dataList.push({
			name: qItem.name,
			id: qItem.id
		});
	}.bind(this));
	ui.showLibrary("queueitem", dataList);
}