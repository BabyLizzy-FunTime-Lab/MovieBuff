// Global functions
function elementValue(ID) {
	let value = document.getElementById(ID).value;
	return value;
}
function elementId(naam) {
	return document.getElementById(naam);
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
			// console.log("getRequest obj: " + response_obj);
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
				succes(xhttp.responseText);
				let response_obj = JSON.parse(xhttp.responseText);
					switch(response_obj.Response) {
						case "True":
							console.log("getRequest obj worked.");
							break;
						case "False":
							console.log(response_obj.Error);
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
					// console.log(values);
					let test_res = JSON.parse(values[0]);
					console.log(test_res);
				}
			)
		},
		function(err) {
			console.log(err);
		}
	)
}
// Data processing functions, filter-out unwanted data

// Featured Movies

function get_featuredMovies(movie1_ID, movie2_ID) {
	let search_URL_1 = createURL(movie1_ID, "ID");
	let search_URL_2 = createURL(movie2_ID, "ID");
	Promise.all([
		getRequest_Promise(search_URL_1),
		getRequest_Promise(search_URL_2)
	]).then(
		function(values) {
			let movie_1 = JSON.parse(values[0]);
			let movie_2 = JSON.parse(values[1]);
			// Call render function
			console.log(movie_1);
			console.log(movie_2);
		}
	)
}
function render_searchResult(argument) {
	// body...
}
//onload get 2 movies and render info
window.onload = get_featuredMovies("tt1343727", "tt0103064");
	
// eventhandeling
elementId("search_btn").addEventListener("click", function() {
	let requestURL = createURL(elementValue("search_input"), "string");
	run_getRequest(requestURL);
	// getRequest_Promise(requestURL).then(
	// 		function(values) {
	// 			// console.log(values);
	// 			let ID_URLarray = top5_URL_array(values);
	// 			Promise.all([
	// 				getRequest_Promise(ID_URLarray[0]),
	// 				getRequest_Promise(ID_URLarray[1]),
	// 				getRequest_Promise(ID_URLarray[2]),
	// 				getRequest_Promise(ID_URLarray[3]),
	// 				getRequest_Promise(ID_URLarray[4]),
	// 			]).then(
	// 				function(values) {
	// 					// console.log(values);
	// 					let test_res = JSON.parse(values[0]);
	// 					console.log(test_res);
	// 				}
	// 			)
	// 		},
	// 		function(err) {
	// 			console.log(err);
	// 		}
	// 	)
})





// function getRequest(url) {
// 	let xhttp;
// 	if (window.XMLHttpRequest) {
// 		xhttp = new XMLHttpRequest();
// 	} else {
// 		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
// 	}
// 	// Get request
// 	xhttp.open("GET", url, true);
// 	xhttp.send();
// 	// Handle response
// 	xhttp.onreadystatechange = function() {
// 		if (xhttp.readyState == 4 && xhttp.status == 200) {
// 			let response_obj = JSON.parse(xhttp.responseText);
// 			switch(response_obj.Response) {
// 				case "True":
// 					console.log("getRequest obj: " +response_obj);
// 					return response_obj;
// 					break;
// 				case "False":
// 					console.log(response_obj.Error);
// 					break;
// 				default:
// 					console.log("Get request failed.");	
// 			}
// 			// check response for true or false & err message.
// 		} else if (xhttp.status == 500) {
// 			console.log("Search query was rejected by server.");
// 		} else {
// 			console.log("Working....");
// 		}
// 	}
// }