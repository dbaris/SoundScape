var token = null;
var token_ttl = 0;

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
	var currentTime = new Date().getTime();
	if (currentTime >= token_ttl) {
		refreshAccessToken();
	}

	// TODO sanitize input
	params = {
		q: $("input").first().val(),
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
});

function clearSearchHTML()
{
	$("#searchResultsTitle").html("");
	$("#searchResults").html("");
}

function processSearchData(data)
{
	$("#searchResultsTitle").html("Search Results for: " + $("input").first().val());
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
	$("#searchResultsTitle").html("Top " + allTracks.length + " Search Results for: " + $("input").first().val());
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
		console.log(data);
	}).fail(function(data) {
		console.log(data);
		$("#grid").html("Error obtaining song analysis data from Spotify API");
	});
}



