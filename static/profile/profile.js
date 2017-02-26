window.onload = function() {
	getAllEventsFromServer();
}

function getAllEventsFromServer() {
	$.ajax({
		type: "POST",
		url : "/findEventAll",
		success: function(res) {
			console.log(res);
		}
	});
}
