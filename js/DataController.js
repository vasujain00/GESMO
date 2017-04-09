GESMO.DataController = function(logger){
	this.urlPath = "http://localhost/Gesmo/";
	this.logger =logger;
};

GESMO.DataController.prototype = {
	fetchData: function(searchQuery, onSuccess, onFailure) {
		var completePath = this.urlPath;
		switch(searchQuery.type){
			case "home" : {
				completePath += "fetchtotals.php";
				break;
			}
			case "artists" : {
				completePath += "artist_fetch.php";
				completePath += "?limit=" + searchQuery.limit + "&offset=" + searchQuery.offset;
				break;
			}
			case "genres" : {
				completePath += "Genre.php";
				break;
			}
			case "albums" : {
				if(searchQuery.filterName == "mostRecent"){
					completePath += "newReleases.php";
					completePath += "?" + searchQuery.filterName + "=" + searchQuery.filterValue;
				}
				break;
			}
			case "songs" : {
				if(searchQuery.filterName == "artist_id"){
					completePath += "fetchartistsong.php";
					completePath += "?" + searchQuery.filterName + "=" + searchQuery.filterValue;
				} else if(searchQuery.filterName == "genre_id"){
					completePath += "top.php";
					completePath += "?" + searchQuery.filterName + "=" + searchQuery.filterValue;
				} else if(searchQuery.filterName == "album_id"){
					completePath += "Songalbum.php";
					completePath += "?" + searchQuery.filterName + "=" + searchQuery.filterValue;
				}
				break;
			}
		}

		this.logger.log("datacontroller, sending request to, (" + completePath + ") ");
		$.ajax({url: completePath, async: true, success: function(result, status, xhr){
			this.logger.log("datacontroller, request success, status");
				var list = result;
			    onSuccess(searchQuery.type, list);
		}.bind(this), error: function(xhr, status, error){
			this.logger.log("datacontroller, request failure, " + error);
			console.log(xhr);
			console.log(status);
			console.log(error);
		}.bind(this), dataType: "json"});
	}
};

