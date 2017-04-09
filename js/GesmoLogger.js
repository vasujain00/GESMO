GESMO.Logger = function(){
	this.urlPath = "http://localhost/Gesmo/";
	this.logs = [];
	setTimeout(function(){
	 	this.saveLogs();
	}.bind(this), 20000);
	this.fileName = "";
};

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

GESMO.Logger.prototype = {
	constructor: GESMO.Logger,

	log: function (msg) {
		var newDate = new Date();
		var datetime = newDate.today() + ":" + newDate.timeNow();
		var log = datetime + "," + msg + "\n";
		this.logs.push(log);
	},

	saveLogs: function(){
		var dataToSend = {
			"filename" : this.filename,
			"data": this.logs
		};
		var completePath = this.urlPath + "saveLogs.php";
		$.ajax({type: "POST",
			url: completePath, 
			async: true,
			data: dataToSend, 
			success: function(result, status, xhr){
				console.log('logs saved');
				this.logs = [];
		}.bind(this), error: function(xhr, status, error){
			console.log(xhr);
			console.log(status);
			console.log(error);
		}.bind(this), dataType: "json"});
	},

	createServerFile: function () {
		var curDate = new Date();
		var logFileName = "log_" + curDate.getTime() + ".txt";
		var completePath = this.urlPath + "createlog.php?filename=" + logFileName;
		$.ajax({url: completePath, async: true, success: function(result, status, xhr){
			this.log("logger, created, logfile:  " + logFileName);
			this.filename = logFileName;
		}.bind(this), error: function(xhr, status, error){
			this.log("logger, request failure, " + error);
			console.log(xhr);
			console.log(status);
			console.log(error);
			this.filename = logFileName;
		}.bind(this), dataType: "json"});
	}
};