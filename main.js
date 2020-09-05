var token = null;
var token_ttl = 0;
var default_colors = [ "#473230", "#aa2220", "#ce5327", "#ce8b27", "#D3906E", "#83a35e",
					   "#488403", "#B9D9B3", "#709C98", "#0C755C", "#2C5154", "#dbcc02"];
var colors = default_colors;

function refreshAccessToken()
{
	$.ajax({
		url: "https://accounts.spotify.com/api/token",
	    headers: {
		    "Authorization": "Basic " + btoa(config.clientId + ":" + config.clientSecret),
		},
		method: "POST",
	    dataType: "json",
		data: {
			grant_type: "client_credentials"
		},
		success: function(data){
	        $("#warning").html("");
			token = data["access_token"];
		    token_ttl = new Date().getTime() + data["expires_in"];
		},
		error: function(data){
		   	console.log("Error obtaining token from Spotify API");
		   	$("#warning").html("Error connecting to Spotify API. Try again later.");
    	}
  	});
}

$( document ).ready(function() {
	refreshAccessToken();
});

$("button#searchButton").click(function( event ) {
	search();
});

$(document).on('keypress',function(e) {
    if(e.which == 13) {
        search();
    }
});

function clearSearchHTML()
{
	$("#searchResultsTitle").html("");
	$("#searchResults").html("");
}

function sanitizeString(input)
{
	// function obtained here: https://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript
	const suspiciousChars = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  	};
  	const reg = /[&<>"'/]/ig;
  	return input.replace(reg, (match)=>(suspiciousChars[match]));
}

function search()
{
	var currentTime = new Date().getTime();
	if (currentTime >= token_ttl) {
		refreshAccessToken();
	}

	params = {
		q: sanitizeString($("input").first().val()),
		type: "track"
	}

	$.ajaxSetup({
	   headers:{
	      'Authorization': "Bearer " + token
	   }
	});

	$.get("https://api.spotify.com/v1/search", params, function(data) {
		processSearchData(data);
	}).fail(function(data) {
		console.log(data);
		$("#searchResults").html("Error obtaining search data from Spotify API");
	});

	return;
}

function processSearchData(data)
{
	$("#searchResultsTitle").html("Search Results for: " + sanitizeString($("input").first().val()));
	var allTracks = data["tracks"]["items"];
	var resultsHtml = "<table>"
	for (var i = 0; i < allTracks.length; i++)
	{
		var track = allTracks[i];
		var artist = track["artists"][0]["name"];
		if (track["artists"].length > 0) {
			for (var j = 1; j < track["artists"].length; j++)
			{
				artist += " and " + track["artists"][j]["name"];
			}
		}
			
		resultsHtml += "<tr><td><button class='songResult' id='" + track["id"] + "'>\"";
		resultsHtml += track["name"] + "\" by " + artist + "</button></td></tr>";
	}
	resultsHtml += "</table>";
	$("#searchResultsTitle").html("Top " + allTracks.length + " Search Results for: " + sanitizeString($("input").first().val()));
	$("#searchResults").html(resultsHtml);
	$(".songResult").on("click", (function( event ) {
		console.log($(this).attr("id"));
		clearSearchHTML();
		requestAudioAnalysis($(this).attr("id"));
	}));;
}


function requestAudioAnalysis(id)
{
	var currentTime = new Date().getTime();
	if (currentTime >= token_ttl) {
		refreshAccessToken();
	}

	$.ajaxSetup({
	   headers:{
	      'Authorization': "Bearer " + token
	   }
	});

	$.get("https://api.spotify.com/v1/audio-analysis/" + id, function(data) {
		notes = []
		segments = data["segments"]
		for (var i = 0; i < segments.length; i++) 
		{
			pitches = segments[i]["pitches"];
			closest_pitch = 0;
			for (var j = 1; j < 12; j++)
			{
				if (pitches[j] > pitches[closest_pitch])
				{
					closest_pitch = j;
				}
			}
			notes.push(closest_pitch);
		}
		var grid = new SongGrid(notes);
		grid.display(colors);
	}).fail(function(data) {
		console.log(data);
		$("#canvasContainer").html("Error obtaining song analysis data from Spotify API");
	});
}



