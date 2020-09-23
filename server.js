var http = require("http");
var fs = require("fs");
var axios = require("axios");
var url = require("url");

var token = null;
var token_ttl = 0;

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;


function refreshAccessToken(response)
{
	var currentTime = new Date().getTime();
	if (currentTime < token_ttl && token != null) {
		return;
	}

  	var data = {
		grant_type: "client_credentials"
	};

  	var config = {
		headers:{
	      'Authorization': "Basic " + Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString('base64'),
	      'Content-Type':'application/x-www-form-urlencoded'
 	    }
	};

	axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        params: {
          grant_type: 'client_credentials'
        },
        headers: {
          'Accept':'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': "Basic " + Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString('base64')
        }
      }).then(spotify_response => {
		    data = spotify_response.data;
		    token = data["access_token"];
		    token_ttl = new Date().getTime() + data["expires_in"];
		}).catch(error => {
		    console.log('Failed to retrieve API token');
		    response.write(500);
		    response.end();
		});
}


http.createServer(function(request, response) {
	console.log("Requested Route: " + request.url);
	if (request.url.indexOf('.css') != -1)
	{
		fs.readFile("public/css/style.css", function (err, data) {
		    response.writeHead(200, {'Content-Type': 'text/css'});
		  	response.write(data);
	     	response.end();
		});
	}
	else if (request.url.indexOf('.js') != -1)
	{
		var filepath = __dirname + request.url;
		fs.exists(filepath, function(exists) 
		{
		    if (exists) 
		    {
		        fs.readFile(filepath, function(error, content) {
		            if (error) {
		                response.writeHead(500);
		                response.end();
		            }
		            else {                   
		                response.writeHead(200, { 'Content-Type': 'text/javascript' });
		                response.end(content, 'utf-8');                  
		            }
		        });
    		}
    	});
	}
	else if (request.url == '/' || request.url == '/index.html')
	{
		refreshAccessToken();
		fs.readFile("public/index.html", function (err, data) {
		    response.writeHead(200, {'Content-Type': 'text/html'});
		  	response.write(data);
	     	response.end();
		});
	}
	else if (request.url.startsWith('/search?'))
	{
		refreshAccessToken(response);
		const queryObject = url.parse(request.url,true).query;

		var data = {
			q: String(queryObject["search"]),
			type: "track"
		}

		var config = {
		   headers: {
		      'Authorization': "Bearer " + token
		   },
		   params: data
		};

		axios.get("https://api.spotify.com/v1/search", config)
		  .then(spotify_response => {
		    response.write(JSON.stringify(spotify_response.data));
		    response.end();

		  }).catch(error => {
		    console.log(error);
		    console.log("Search API failed");
		    response.writeHead(500);
		    response.end();
		  });
	}
	else if (request.url.startsWith('/get_audio?'))
	{
		refreshAccessToken(response);
		const queryObject = url.parse(request.url,true).query;

		var id = String(queryObject["id"]);

		var config = {
		   headers: {
		      'Authorization': "Bearer " + token
		   }
		};

		axios.get("https://api.spotify.com/v1/audio-analysis/" + id, config)
		  .then(spotify_response => {
		    response.write(JSON.stringify(spotify_response.data));
		    response.end();

		  }).catch(error => {
		    console.log(error);
		    console.log("Search API failed");
		    response.writeHead(500);
		    response.end();
		  });

	}
	
}).listen(process.env.PORT || 8080)


// Console will print the message
console.log('Server running at http://127.0.0.1:8080/');

