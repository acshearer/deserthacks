window.onload = function() {
	console.log("LOL");
	getAllEventsFromServer();
	populateFriendBar();
	
	var add_button = document.getElementById("add_event");
	add_button.addEventListener('click', function(req, res){
		var name_input = document.getElementById("name");
		var description_input = document.getElementById("description");
		var time_input = document.getElementById("time");
		
		var date1 = new Date().toJSON();
		var date2 = new Date();
		date2.setMinutes(date2.getMinutes() + parseInt(time_input));
				
		var jsonObject = {
			tags : [],
			friendsVisible : [],
			time_started : date1,
			time_ended : date2.toJSON(),
			name : name_input.value,
			description : description_input.value,
		};

		console.log(JSON.stringify(jsonObject));
		
		var xhr = createCORSRequest("GET", "http://localhost:8080/");
		xhr.open("POST", "/createevent");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(jsonObject));
		
		location.reload();
	});
}

function populateFriendBar() {
	$.ajax({
		type: "POST",
		url : "/findAllUsers",
		success: function(res) {
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
				
		var enclosingList = document.createElement('li');
		var innerLink = document.createElement('a');
		
		innerLink.innerHTML = currFriend.user.google.name;
		innerLink.setAttribute('class', 'folder');
		innerLink.setAttribute('href', '#' + currFriend);
		innerLink.setAttribute('currFriend', currFriend.user.google.id);
				
		enclosingList.addEventListener('click', function(friend) {
			return function() {
				
				var xhr = createCORSRequest("GET");
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
		var evObj = JSON.parse(currEvent);
				
		var currDiv = document.createElement('div');
		
		var p1 = document.createElement('p');
		var p2 = document.createElement('p');
		var p3 = document.createElement('p');
		var p4 = document.createElement('p');
		
		p1.innerHTML = evObj.events.name;
		p2.innerHTML = evObj.events.description;
		p3.innerHTML = evObj.events.time_started;
		p4.innerHTML = evObj.events.time_ended;
		
		currDiv.className = 'card eventElement well';
		//currDiv.innerHTML = currEvent;
		
		currDiv.appendChild(p1);
		currDiv.appendChild(p2);
		currDiv.appendChild(p3);
		currDiv.appendChild(p4);
		
		container.appendChild(currDiv);
		}
}
