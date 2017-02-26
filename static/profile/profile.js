window.onload = function() {
	console.log("LOL");
	getAllEventsFromServer();
	populateFriendBar();
}

function populateFriendBar() {
	$.ajax({
		type: "POST",
		url : "/findAllUsers",
		success: function(res) {
			console.log(res);
			pushFriendsToBar(res);
		}
	});
}

function getAllEventsFromServer() {
	$.ajax({
		type: "POST",
		url : "/findeventall",
		success: function(res) {
			pushEventsToHTML(res);
		}
	});
}

function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	
	if ("withCredentials" in xhr) {
		xhr.open(method, url, true);
		
	} else if (typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);
		
	} else {
		xhr = null;
	}
	
	return xhr;
}

function pushFriendsToBar(res) {
	res = JSON.parse(res);
	
	var listWrapper = document.getElementById('sidebar-list');
	for (var i = 0 ; i < res.length; i++){
		var currFriend = res[i];
		
		console.log(currFriend);
		
		var enclosingList = document.createElement('li');
		var innerLink = document.createElement('a');
		
		innerLink.innerHTML = currFriend.user.google.name;
		innerLink.setAttribute('class', 'folder');
		innerLink.setAttribute('href', '#' + currFriend);
		innerLink.setAttribute('currFriend', currFriend.user.google.id);
				
		enclosingList.addEventListener('click', function(friend) {
			return function() {
				console.log(JSON.stringify({'friend' : friend}));
				
				var xhr = createCORSRequest("GET", "http://localhost:8080/");
				xhr.open("POST", "/addFriend");
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send(JSON.stringify({'friend' : friend}));
			};
		}(innerLink.getAttribute('currFriend')));
		
		enclosingList.appendChild(innerLink);
		listWrapper.appendChild(enclosingList);
	}
}


function pushEventsToHTML(res) {
	
	res = JSON.parse(res);
	
	for (var i = 0 ; i < res.length; i++) {
		var index = i%3;
		var container = document.getElementById("column" + index);
		
		var currEvent = JSON.stringify(res[i]);
		
		var currDiv = document.createElement('div');
		currDiv.className = 'card eventElement well';
		currDiv.innerHTML = currEvent;
		
		
		currDiv.addEventListener('click', function(name) {
			return function(){
				$.ajax({
					type: "POST",
					url : "/addUserToEvent",
					data : JSON.stringify({"eventAdd" : name}),
					success: function(res) {
						console.log("successful event add of "  + friend);
					}
				});
		}(currEvent.name);
		});
		
		container.appendChild(currDiv);
		}
}
