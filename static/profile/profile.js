window.onload = function() {
	console.log("LOL");
	getAllEventsFromServer();
	populateFriendBar();
}

function populateFriendBar() {
	$.ajax({
		type: "POST",
		url : "/friends",
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
			console.log(res);
			pushEventsToHTML(res);
		}
	});
}

function pushFriendsToBar(res) {
	var listWrapper = document.getElementById('header-bar');
	for (var i = 0 ; i < res.length; i++){
		var currFriend = res[i];
		
		var enclosingList = document.createElement('li');
		var innerLink = document.createElement('a');
		
		innerLink.innerHTMl = currFriend;
		innerLink.setAttribute('class', 'folder');
		innerLink.setAttribute('href', '#' + currFriend);
		innerLink.setAttribute('currFriend', currFriend);
		
		enclosingList.addEventListener('click', function(currFriend) {
			return function() {
				console.log(currFriend);
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
		
		container.appendChild(currDiv);
		}
}
