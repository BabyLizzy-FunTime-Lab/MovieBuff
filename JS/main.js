// Global functions
function elementValue(ID) {
	let value = document.getElementById(ID).value;
	return value;
}
function elementID(naam) {
	return document.getElementById(naam);
}
function elementMaker(tagname, ID_optional, class_optional) {
	let newElement = document.createElement(tagname);
	if (ID_optional) {
		newElement.setAttribute("id", ID_optional);
		return newElement;
	} else if (class_optional) {
		newElement.setAttribute("class", class_optional);
		return newElement;
	} else {
		return newElement;
	}
}

// Get request functions and URL constructors
function createURL(search_input, string_or_ID) {
	let url;
	switch(string_or_ID) {
		case "string": 
			url = "http://www.omdbapi.com/?s=" + search_input + "&apiKey=6c3a2d45";
			break;
		case "ID": 
			url = "http://www.omdbapi.com/?i=" + search_input + "&apiKey=6c3a2d45";
			break;
		default:
			console.log("Failed to create URL");
	}
	return url;
}
function top5_URL_array(res) {
	let response_obj = JSON.parse(res);
	switch(response_obj.Response) {
		case "True":
			// GET top 5 movie ID's and make new URL's with movie ID's.
			let array_ID_URL = [];
			for (var i = 0; i < 5; i++) {
				let imdbID_ID = response_obj.Search[i].imdbID;
				let IDsearch_URL = createURL(imdbID_ID, "ID");
				array_ID_URL.push(IDsearch_URL);
			}
			return array_ID_URL;
			break;
		case "False":
			return response_obj.Error;
			break;
		default:
			console.log("Get request failed.");
	}
}
function getRequest_Promise(url) {
	return new Promise(function(succes, fail) {
		let xhttp;
		if (window.XMLHttpRequest) {
			xhttp = new XMLHttpRequest();
		} else {
			xhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		// Get request
		xhttp.open("GET", url, true);
		xhttp.onload = function() {
			if (xhttp.status == 200) {
				let response_obj = JSON.parse(xhttp.responseText);
					switch(response_obj.Response) {
						case "True":
							console.log("getRequest obj worked.");
							succes(xhttp.responseText);
							break;
						case "False":
							console.log(response_obj.Error);
							elementID("banner").style.display = "none";
							elementID("featuredmovies").style.display = "none";
							elementID("searchresults").style.display = "block";
							let error = elementMaker("div", "notfound", false);
							error.innerHTML = "<h2>Sorry</h2>" + "<h3>" + response_obj.Error + " Please try again.</h3>";
							elementID("searchresults").innerHTML = "";
							elementID("searchresults").appendChild(error);
							break;
						default:
							console.log("Get request failed.");
					} 
			} else {
				fail("Server denied query. Error: " + xhttp.status);
			}
		}
		xhttp.send();
	}
)};

// Get Search Results & Render
function search_elements() {
	let poster = elementMaker("img", false, "poster");
	let info_container = elementMaker("div", false, "info_container");
	let title = elementMaker("h3", false, "title");
	let year = elementMaker("h4", false, "year");
	let genre = elementMaker("div", false, "genre");
	let type = elementMaker("div", false, "type");
	let director = elementMaker("div", false, "director");
	let plot = elementMaker("div", false, "plot");
	let actors = elementMaker("div", false, "actors");
	let awards = elementMaker("div", false, "awards");

	let search_element_array = new Array(
		poster, title, year, genre, 
		type, director, plot, actors, 
		awards, info_container);
	return search_element_array;
}
function render_search(result_1, result_2, result_3, result_4, result_5) {
	let target_container = elementID("searchresults");	
	let movie1_container = elementMaker("section", false, "movie_container");
	let movie2_container = elementMaker("section", false, "movie_container");
	let movie3_container = elementMaker("section", false, "movie_container");
	let movie4_container = elementMaker("section", false, "movie_container");
	let movie5_container = elementMaker("section", false, "movie_container");

	let movie1_elements = search_elements();
	let movie1_info_container = movie1_elements[9];
	let movie2_elements = search_elements();
	let movie2_info_container = movie2_elements[9];
	let movie3_elements = search_elements();
	let movie3_info_container = movie3_elements[9];
	let movie4_elements = search_elements();
	let movie4_info_container = movie4_elements[9];
	let movie5_elements = search_elements();
	let movie5_info_container = movie5_elements[9];

	function availability_check(movie_data, poster) {
		if (poster) {
			if (movie_data === "N/A") {
				let sorryposter = "../MovieBuff/Images/sorry.gif";
				return sorryposter
			} else {
				return movie_data;
			}
		} else if (!poster) {
			if (movie_data === "N/A") {
				return "Information Not Avialable";
			} else {
				return movie_data;
			}
		}
	}
	// load elements with data & give alternative if not available.
	for (var i = 0; i < movie1_elements.length; i++) {
		switch(i) {
			case 0:
			// Poster
				movie1_elements[i].src = availability_check(result_1.Poster, true);
				movie1_container.appendChild(movie1_elements[i]);
				movie2_elements[i].src = availability_check(result_2.Poster, true);
				movie2_container.appendChild(movie2_elements[i]);
				movie3_elements[i].src = availability_check(result_3.Poster, true);
				movie3_container.appendChild(movie3_elements[i]);
				movie4_elements[i].src = availability_check(result_4.Poster, true);
				movie4_container.appendChild(movie4_elements[i]);
				movie5_elements[i].src = availability_check(result_5.Poster, true);
				movie5_container.appendChild(movie5_elements[i]);
				break;
			case 1:
			// Title
				movie1_elements[i].innerHTML = "Title: " + availability_check(result_1.Title, false);
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "Title: " + availability_check(result_2.Title, false);
				movie2_info_container.appendChild(movie2_elements[i]);
				movie3_elements[i].innerHTML = "Title: " + availability_check(result_3.Title, false);
				movie3_info_container.appendChild(movie3_elements[i]);
				movie4_elements[i].innerHTML = "Title: " + availability_check(result_4.Title, false);
				movie4_info_container.appendChild(movie4_elements[i]);
				movie5_elements[i].innerHTML = "Title: " + availability_check(result_5.Title, false);
				movie5_info_container.appendChild(movie5_elements[i]);
				break;
			case 2:
			// Year
				movie1_elements[i].innerHTML = "Release year: " + availability_check(result_1.Year, false);
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "Release year: " + availability_check(result_2.Year, false);
				movie2_info_container.appendChild(movie2_elements[i]);
				movie3_elements[i].innerHTML = "Release year: " + availability_check(result_3.Year, false);
				movie3_info_container.appendChild(movie3_elements[i]);
				movie4_elements[i].innerHTML = "Release year: " + availability_check(result_4.Year, false);
				movie4_info_container.appendChild(movie4_elements[i]);
				movie5_elements[i].innerHTML = "Release year: " + availability_check(result_5.Year, false);
				movie5_info_container.appendChild(movie5_elements[i]);
				break;
			case 3:
			// Genre
				movie1_elements[i].innerHTML = "<h4>Genre:</h4>" + "<p>" + availability_check(result_1.Genre, false) + "</p>";
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "<h4>Genre:</h4>" + "<p>" + availability_check(result_2.Genre, false) + "</p>";
				movie2_info_container.appendChild(movie2_elements[i]);
				movie3_elements[i].innerHTML = "<h4>Genre:</h4>" + "<p>" + availability_check(result_3.Genre, false) + "</p>";
				movie3_info_container.appendChild(movie3_elements[i]);
				movie4_elements[i].innerHTML = "<h4>Genre:</h4>" + "<p>" + availability_check(result_4.Genre, false) + "</p>";
				movie4_info_container.appendChild(movie4_elements[i]);
				movie5_elements[i].innerHTML = "<h4>Genre:</h4>" + "<p>" + availability_check(result_5.Genre, false) + "</p>";
				movie5_info_container.appendChild(movie5_elements[i]);
				break;
			case 4:
			// Type
				movie1_elements[i].innerHTML = "<h4>Type:</h4>" + "<p>" + availability_check(result_1.Type, false) + "</p>";
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "<h4>Type:</h4>" + "<p>" + availability_check(result_2.Type, false) + "</p>";
				movie2_info_container.appendChild(movie2_elements[i]);
				movie3_elements[i].innerHTML = "<h4>Type:</h4>" + "<p>" + availability_check(result_3.Type, false) + "</p>";
				movie3_info_container.appendChild(movie3_elements[i]);
				movie4_elements[i].innerHTML = "<h4>Type:</h4>" + "<p>" + availability_check(result_4.Type, false) + "</p>";
				movie4_info_container.appendChild(movie4_elements[i]);
				movie5_elements[i].innerHTML = "<h4>Type:</h4>" + "<p>" + availability_check(result_5.Type, false) + "</p>";
				movie5_info_container.appendChild(movie5_elements[i]);
				break;
			case 5:
			// Director
				movie1_elements[i].innerHTML = "<h4>Director(s):</h4>" + "<p>" + availability_check(result_1.Director, false) + "</p>";
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "<h4>Director(s):</h4>" + "<p>" + availability_check(result_2.Director, false) + "</p>";
				movie2_info_container.appendChild(movie2_elements[i]);
				movie3_elements[i].innerHTML = "<h4>Director(s):</h4>" + "<p>" + availability_check(result_3.Director, false) + "</p>";
				movie3_info_container.appendChild(movie3_elements[i]);
				movie4_elements[i].innerHTML = "<h4>Director(s):</h4>" + "<p>" + availability_check(result_4.Director, false) + "</p>";
				movie4_info_container.appendChild(movie4_elements[i]);
				movie5_elements[i].innerHTML = "<h4>Director(s):</h4>" + "<p>" + availability_check(result_5.Director, false) + "</p>";
				movie5_info_container.appendChild(movie5_elements[i]);
				break;
			case 6:
			// Plot
				movie1_elements[i].innerHTML = "<h4>Plot:</h4>" + "<p>" + availability_check(result_1.Plot, false) + "</p>";
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "<h4>Plot:</h4>" + "<p>" + availability_check(result_2.Plot, false) + "</p>";
				movie2_info_container.appendChild(movie2_elements[i]);
				movie3_elements[i].innerHTML = "<h4>Plot:</h4>" + "<p>" + availability_check(result_3.Plot, false) + "</p>";
				movie3_info_container.appendChild(movie3_elements[i]);
				movie4_elements[i].innerHTML = "<h4>Plot:</h4>" + "<p>" + availability_check(result_4.Plot, false) + "</p>";
				movie4_info_container.appendChild(movie4_elements[i]);
				movie5_elements[i].innerHTML = "<h4>Plot:</h4>" + "<p>" + availability_check(result_5.Plot, false) + "</p>";
				movie5_info_container.appendChild(movie5_elements[i]);
				break;
			case 7:
			// Actors
				movie1_elements[i].innerHTML = "<h4>Actors:</h4>" + "<p>" + availability_check(result_1.Actors, false) + "</p>";
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "<h4>Actors:</h4>" + "<p>" + availability_check(result_2.Actors, false) + "</p>";
				movie2_info_container.appendChild(movie2_elements[i]);
				movie3_elements[i].innerHTML = "<h4>Actors:</h4>" + "<p>" + availability_check(result_3.Actors, false) + "</p>";
				movie3_info_container.appendChild(movie3_elements[i]);
				movie4_elements[i].innerHTML = "<h4>Actors:</h4>" + "<p>" + availability_check(result_4.Actors, false) + "</p>";
				movie4_info_container.appendChild(movie4_elements[i]);
				movie5_elements[i].innerHTML = "<h4>Actors:</h4>" + "<p>" + availability_check(result_5.Actors, false) + "</p>";
				movie5_info_container.appendChild(movie5_elements[i]);
				break;
			case 8:
			// Awards
				movie1_elements[i].innerHTML = "<h4>Awards:</h4>" + "<p>" + availability_check(result_1.Awards, false) + "</p>";
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "<h4>Awards:</h4>" + "<p>" + availability_check(result_2.Awards, false) + "</p>";
				movie2_info_container.appendChild(movie2_elements[i]);
				movie3_elements[i].innerHTML = "<h4>Awards:</h4>" + "<p>" + availability_check(result_3.Awards, false) + "</p>";
				movie3_info_container.appendChild(movie3_elements[i]);
				movie4_elements[i].innerHTML = "<h4>Awards:</h4>" + "<p>" + availability_check(result_4.Awards, false) + "</p>";
				movie4_info_container.appendChild(movie4_elements[i]);
				movie5_elements[i].innerHTML = "<h4>Awards:</h4>" + "<p>" + availability_check(result_5.Awards, false) + "</p>";
				movie5_info_container.appendChild(movie5_elements[i]);
				break;
			default:
				console.log("Rendering of Search Results, done");
		}
	}
	// Final assembely of Movie elements.
	movie1_container.appendChild(movie1_info_container);
	movie2_container.appendChild(movie2_info_container);
	movie3_container.appendChild(movie3_info_container);
	movie4_container.appendChild(movie4_info_container);
	movie5_container.appendChild(movie5_info_container);

	elementID("searchresults").innerHTML = "<h2>Top 5 Results:</h2>";
	target_container.appendChild(movie1_container);
	target_container.appendChild(movie2_container);
	target_container.appendChild(movie3_container);
	target_container.appendChild(movie4_container);
	target_container.appendChild(movie5_container);
}
function run_getRequest(requestURL) {
	getRequest_Promise(requestURL).then(
		function(values) {
			// console.log(values);
			let ID_URLarray = top5_URL_array(values);
			Promise.all([
				getRequest_Promise(ID_URLarray[0]),
				getRequest_Promise(ID_URLarray[1]),
				getRequest_Promise(ID_URLarray[2]),
				getRequest_Promise(ID_URLarray[3]),
				getRequest_Promise(ID_URLarray[4]),
			]).then(
				function(values) {
					let movie1 = JSON.parse(values[0]);
					let movie2 = JSON.parse(values[1]);
					let movie3 = JSON.parse(values[2]);
					let movie4 = JSON.parse(values[3]);
					let movie5 = JSON.parse(values[4]);
					let movie_data = new Array(
						movie1, movie2, movie3, 
						movie4, movie5);
					// console.log(movie_data);
					return movie_data;
				}
			).then(
				function(values) {
					console.log(values[0]);
					// if poster "n/a" render special img.
					elementID("banner").style.display = "none";
					elementID("featuredmovies").style.display = "none";
					elementID("searchresults").style.display = "block";
					render_search(values[0], values[1], values[2], values[3], values[4]);
				}
			)
		},
		function(err) {
			console.log(err);
			elementID("banner").style.display = "none";
			elementID("featuredmovies").style.display = "none";
			elementID("searchresults").style.display = "block";
			let error = elementMaker("div", "notfound", false);
			error.innerHTML = "<h2>Sorry</h2>" + "<h3>" + err + " Please try again.</h3>";
			elementID("searchresults").innerHTML = "";
			elementID("searchresults").appendChild(error);
		}
	)
}



// Get Featured Movies & Render
function generate_featuredMovies_elements() {	
	let poster = elementMaker("img", false, "poster");
	let info_container = elementMaker("div", false, "info_container");
	let title = elementMaker("h3", false, "title");
	let year = elementMaker("h4", false, "year");
	let plot = elementMaker("div", false, "plot");
	let awards = elementMaker("div", false, "awards");
	
	let element_array = new Array(poster, title, year, plot, awards, info_container);
	return element_array;	 
}
function render_featuredMovies_Data(movie_1, movie_2) {
	let target_container = elementID("featuredmovies");
	let movie1_container = elementMaker("section", false, "movie_container");
	let movie2_container = elementMaker("section", false, "movie_container");

	let movie1_elements = generate_featuredMovies_elements();
	let movie1_info_container = movie1_elements[5];
	let movie2_elements = generate_featuredMovies_elements();
	let movie2_info_container = movie2_elements[5];

	for (var i = 0; i < movie1_elements.length; i++) {
		switch(i) {
			case 0:
			// Posters
				movie1_elements[i].src = movie_1.Poster;
				movie1_container.appendChild(movie1_elements[0]);
				movie2_elements[i].src = movie_2.Poster;
				movie2_container.appendChild(movie2_elements[0]);
				break;
			case 1:
			// Title <h3> into info_container
				movie1_elements[i].innerHTML = "Title: " + movie_1.Title;
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "Title:" + movie_2.Title;
				movie2_info_container.appendChild(movie2_elements[i]);
				break;
			case 2:
			// Year <h4> into info_container
				movie1_elements[i].innerHTML = "Release year: " + movie_1.Year;
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "Release year: " + movie_2.Year;
				movie2_info_container.appendChild(movie2_elements[i]);
				break;
			case 3:
			// Plot into info_container
				movie1_elements[i].innerHTML = "<h4>Plot:</h4>" + "<p>" + movie_1.Plot + "</p>";
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "<h4>Plot:</h4>" + "<p>" + movie_2.Plot + "</p>";
				movie2_info_container.appendChild(movie2_elements[i]);
				break;
			case 4:
			// Awards into info_container
				movie1_elements[i].innerHTML = "<h4>Awards:</h4>" + "<p>" + movie_1.Awards + "</p>";
				movie1_info_container.appendChild(movie1_elements[i]);
				movie2_elements[i].innerHTML = "<h4>Awards:</h4>" + "<p>" + movie_2.Awards + "</p>";
				movie2_info_container.appendChild(movie2_elements[i]);
				break;
			default:
				console.log("Rendering Featured Movies, done");
		}
	}
	movie1_container.appendChild(movie1_info_container);
	movie2_container.appendChild(movie2_info_container);
	target_container.appendChild(movie1_container);
	target_container.appendChild(movie2_container);
}
function featuredMovies(movie1_ID, movie2_ID) {
	let search_URL_1 = createURL(movie1_ID, "ID");
	let search_URL_2 = createURL(movie2_ID, "ID");
	Promise.all([
		getRequest_Promise(search_URL_1),
		getRequest_Promise(search_URL_2)
	]).then(
		function(values) {
			let movie_1 = JSON.parse(values[0]);
			let movie_2 = JSON.parse(values[1]);
			let movie_array = new Array(movie_1, movie_2);
			return movie_array;
		}
	).then(
		function(values) {
			// Call render function
			render_featuredMovies_Data(values[0], values[1]);
		}
	)
}

//onload get 2 movies and render info
window.onload = featuredMovies("tt1343727", "tt0103064");
	
// eventhandeling
elementID("search_btn").addEventListener("click", function() {
	let requestURL = createURL(elementValue("search_input"), "string");
	run_getRequest(requestURL);
})

