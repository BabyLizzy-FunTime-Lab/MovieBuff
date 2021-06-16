// Global functions
function elementValue(ID) {
	let value = document.getElementById(ID).value;
	return value;
}
function elementId(naam) {
	return document.getElementById(naam);
}
// GET request functione
function createURL(search_input, string_or_ID) {
	let url;
	switch(string_or_ID) {
		case "string": 
			url = "http://www.omdbapi.com/?s=" + search_input + "&apiKey=6c3a2d45";
			break;
		case "ID": 
			url = "http://www.omdbapi.com/?i=tt" + search_input + "&apiKey=6c3a2d45";
			break;
		default:
			console.log("Failed to create URL");
	}
	return url;
}
function getID_info(string_search_res) {
	// GET top 5 movie ID's.
	let array_ID = [];
	for (var i = 0; i < 5; i++) {
		array_ID.push(string_search_res.Search[i].imdbID);
	}
	console.log(array_ID);
	// New GET request with ID's as queries.
	for (var x = 0; x < array_ID.length; x++) {
		let id_URL = createURL(array_ID[x], "ID");
		console.log(getRequest(id_URL));
	}
}
function getRequest(url) {
	let xhttp;
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} else {
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	// Get request
	xhttp.open("GET", url, true);
	xhttp.send();
	// Handle response
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let response_obj = JSON.parse(xhttp.responseText);
			switch(response_obj.Response) {
				case "True":
					return response_obj;
					break;
				case "False":
					console.log(response_obj.Error);
					break;
				default:
					console.log("Get request failed.");	
			}
			// check response for true or false & err message.
		} else if (xhttp.status == 500) {
			console.log("Search query was rejected by server.");
		} else {
			console.log("Working....");
		}
	}
}
// eventhandeling
elementId("search_btn").addEventListener("click", function() {
	let requestURL = createURL(elementValue("search_input"), "string");
	console.log(getID_info(getRequest(requestURL)));
})