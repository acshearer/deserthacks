window.onload = function() {
	getAllEventsFromServer();
}

function getAllEventsFromServer() {
	$.ajax({
		type: "POST",
		url : "/findEventAll",
		success: function(res) {
			console.log(res);
			pushEventsToHTML(res);
		}
	});
}

function pushEventsToHTML(res) {
	for (var i = 0 ; i < res.length; i++) {
		var currEvent = res[i];
		
		var currDiv = document.createElement('div');
		currDiv.className = 'card';
		
		console.log(currEvent);
	}
}
