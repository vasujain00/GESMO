chrome.app.runtime.onLaunched.addListener(function(){
	// chrome.app.window.create('window_mini.html', {
	// 	id: 'miniWindowID',
	// 	'bounds': {
	// 		'width': 100,
	// 		'height': 400
	// 	}
	// });
	chrome.app.window.create('index.html', {
		id: 'mainWindowID',
		'bounds': {
			'width': 500,
			'height': 400
		}
	});
});