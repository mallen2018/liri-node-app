require("dotenv").config();
var keys = require("./keys.js");

// node liri.js [ command ] [ query - optional ]
var command = process.argv[2];
var query = process.argv[3]; //need to probably add 4 in here also or & for movies/songs with more than one word

var myTweets = function () {
	// Load twitter module from npm
	var Twitter = require('twitter');
	//Passes Twitter keys into call to Twitter API.
	var client = new Twitter(keys.twitter);
	// Twitter parameters
	var params = {
		screen_name: 'meliallen1', //personal account screen name
		count: 20
	};

	// GET request for last 20 tweets on my personal account's timeline
	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (error) { 
			console.log('Error occurred: ' + error);
		} else {
			console.log("My 20 Most Recent Tweets");
			console.log("");

			for (var i = 0; i < tweets.length; i++) {
				console.log("( #" + (i + 1) + " )  " + tweets[i].text);
				console.log("Created:  " + tweets[i].created_at);
				console.log("");
			}
		}
	});
}

var spotifyThisSong = function (trackQuery) {
	// Load Spotify npm package
	var Spotify = require('node-spotify-api');
	//connect keys for spotify from key and .env
	var spotify = new Spotify(keys.spotify);

	// if no query is entered this will be used
	if (trackQuery === undefined) {
		trackQuery = "the sign ace of base";
	}

	// Spotify API request 
	spotify.search({
		type: 'track',
		query: trackQuery
	}, function (err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		} else { 
			// For loop is for when a track has multiple artists
			for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
				if (i === 0) {
					console.log("Artist(s):    " + data.tracks.items[0].artists[i].name);
				} else {
					console.log("              " + data.tracks.items[0].artists[i].name);
				}
			}
			console.log("Song:         " + data.tracks.items[0].name);
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album:        " + data.tracks.items[0].album.name);
		}


	});
}

var movieThis = function (movieQuery) {
	// Load request npm module
	var request = require("request");
	// connect apikey for omdb
	var apikey = keys.omdb.id;
	
	// if nothing entered for query or undefined, Mr. Nobody becomes the default
	movieQuery = query;
	if (movieQuery === undefined) {
		movieQuery = "Mr Nobody";
	}

	// HTTP GET request
	request("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&r=json&apikey=" + apikey, function (error, response, body) {
		var rottentomatorating = JSON.parse(body).Ratings[1].Value; //variable for rotten tomator rating since it is buried under ratings and sources to retrieve data
		if (!error && response.statusCode === 200) {
			console.log("* Title of the movie:         " + JSON.parse(body).Title);
			console.log("* Year the movie came out:    " + JSON.parse(body).Year);
			console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
			console.log("* Rotten Tomato Rating of the movie:   " + rottentomatorating);
			console.log("* Country produced:           " + JSON.parse(body).Country);
			console.log("* Language of the movie:      " + JSON.parse(body).Language);
			console.log("* Plot of the movie:          " + JSON.parse(body).Plot);
			console.log("* Actors in the movie:        " + JSON.parse(body).Actors);
		}
	});
}

// commands typed into terminal
if (command === "my-tweets") {
	myTweets();
} else if (command === "spotify-this-song") {
	spotifyThisSong(query);
} else if (command === "movie-this") {
	movieThis(query);
} else if (command === "do-what-it-says") {

	// incorporating from file read / loads fs npm package for do what it says command
	var fs = require("fs");

	fs.readFile("random.txt", "utf-8", function (error, data) {
		var command;
		var query;

		// split the string from file in order to differentiate between the command and query for do what it says
		// 	--> if there is no comma, then defaults to (my-tweets)
		if (data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		//commands from file for do what it says functionality
		if (command === "my-tweets") {
			myTweets();
		} else if (command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if (command === "movie-this") {
			movieThis(query);
		} else { // Use case where the command is not recognized
			console.log("Command from file is not a valid command! Please try again.")
		}
	});
} else if (command === undefined) { // use case where no command is entered
	console.log("Please enter a command to run LIRI.")
} else { // use case where command is entered but does not match
	console.log("Command not recognized! Please try again.")
}
