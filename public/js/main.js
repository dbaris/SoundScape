var distinctNotes = 12;
var default_colors = [ "#473230", "#aa2220", "#ce5327", "#ce8b27", "#D3906E", "#83a35e",
					   "#488403", "#B9D9B3", "#709C98", "#0C755C", "#2C5154", "#dbcc02"];
var noteNames = ["A", "A#/Bb", "B", "C", "C#/Db", "D", 
		         "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
var colors = default_colors;
var notes = []


$( document ).ready(function() {
	// refreshAccessToken();
});

$("button#searchButton").click(function( event ) {
	$("#directions").hide();
	search();
});

function clearSearchHTML()
{
	$("#searchResultsTitle").html("");
	$("#searchResults").html("");
}

function clearGridCanvas()
{
	notes = [];
	colors = default_colors;
	$("#myCanvas").hide();
	$("#colorMenu").hide();
	$("#colorUpdater").hide();
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
	clearGridCanvas();

	var params = {
		search: sanitizeString($("input").first().val())
	};

	$.get("/search", params, function(data) {
		processSearchData(JSON.parse(data));
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

		if (i % 2 == 0)
		{
			resultsHtml += "<tr>";
		}
		resultsHtml += "<td><button class='songResult' id='" + track["id"] + "'>\"";
		resultsHtml += track["name"] + "\" by " + artist + "</button></td>";

		if (i % 2 != 0) 
		{
			resultsHtml += "</tr>";
		}
	}
	resultsHtml += "</table>";
	$("#searchResultsTitle").html("Top " + allTracks.length + " Search Results for: " + sanitizeString($("input").first().val()));
	$("#searchResults").html(resultsHtml);
	$(".songResult").on("click", (function( event ) {
		clearSearchHTML();
		requestAudioAnalysis($(this).attr("id"));
	}));;
}

function updateDisplay()
{	
	var grid = new SongGrid(notes);
	grid.display(colors);

	var colorMenu = new ColorMenu();
	colorMenu.display(colors);

	$("#colorUpdater").show();
}

function requestAudioAnalysis(id)
{
	var params = {
		id: id
	};

	$.get("/get_audio", params, function(data) {
		data = JSON.parse(data);
		segments = data["segments"]
		for (var i = 0; i < segments.length; i++) 
		{
			pitches = segments[i]["pitches"];
			closest_pitch = 0;
			for (var j = 1; j < distinctNotes; j++)
			{
				if (pitches[j] > pitches[closest_pitch])
				{
					closest_pitch = j;
				}
			}
			notes.push(closest_pitch);
		}

		updateDisplay();

	}).fail(function(data) {
		console.log(data);
		$("#canvasContainer").html("Error obtaining song analysis data from Spotify API");
	});
}

$("button#updateColor").click(function( event ) {
	var newColor = sanitizeString($("input#colorInput").first().val());
	var noteUpdate = $("select#noteSelect").first().val();
	colors[noteUpdate] = newColor;
	updateDisplay();
});


