var currentPage = 1;
var recordsPerPage = 10;
var peopleCount = 0;
var totalPages = 0;
var faveCount = 0;
var searchValue = "";
var homeworldSpan = "";
var homeworldURLArr = [];
var baseURL = "https://swapi.co/api/people/";
document.getElementById("txtSearch").value = "";

GetData(baseURL);

function GetData(url) {
	//grab the swapi people data
	fetch(url)
	.then(response => response.json())
	.then(data => {
	  //build swapi people table
	  CreatePeople(data);
	})
	.catch(error => console.error(error))
}

function CreatePeople(data) {	
	var btnNext = document.getElementById("btnNext");
    var btnPrev = document.getElementById("btnPrev");
    var pageNums = document.getElementById("pageNums");
	var divResults = document.getElementById("resultsTable");
	var totalCount = data.count;
	peopleCount = data.results.length;
	totalPages= Math.ceil(totalCount / recordsPerPage);  
  
	//get the header values from the results
	var headVal = [];
	for (var i = 0; i < peopleCount; i++) {
		for (var key in data.results[i]) {
			if (headVal.indexOf(key) === -1) {
				if (key === "name" || key === "birth_year" || key === "homeworld") {
					headVal.push(key);
				}
			}
		}
	}
	
	//calibrate pageNums
	if (pageNums < 1) pageNums = 1;
    if (pageNums > totalPages) currentPage = totalPages;
    pageNums.innerHTML = currentPage + "/" + totalPages;
	if (currentPage == 1) {
        btnPrev.style.visibility = "hidden";
    } else {
        btnPrev.style.visibility = "visible";
    }

    if (currentPage == totalPages) {
        btnNext.style.visibility = "hidden";
    } else {
        btnNext.style.visibility = "visible";
    }
	
	//create the header row; handle pagination
	divResults.innerHTML = "";
	var resultsTable = document.createElement("table");
	var tr = resultsTable.insertRow(-1);
	for (var i = 0; i < headVal.length; i++) {
		var th = document.createElement("th");
		th.innerHTML = headVal[i];
		tr.appendChild(th);
	}
	
	//set all of the homeworld values to the correct name
	homeworldURLArr = [];
	for (var i = 0; i < peopleCount; i++) {	
		homeworldURLArr.push(data.results[i][headVal[2]]);
	}
	
	//put all the values into the proper columns
	//TBD: add local storage for id and fave lookup
	var switchOnOff = 0;
	var nameCode = "";
	for (var i = 0; i < peopleCount; i++) {
		tr = resultsTable.insertRow(-1);
		for (var j = 0; j < headVal.length; j++) {
			var dataField = tr.insertCell(-1);
			//need to add more based on the column id
			if (switchOnOff === 0) {
				nameCode = " <a href=\"javascript:AdjustCounter(" + switchOnOff + ")\"><i class=\"far fa-heart\"></i></a>";
				switchOnOff = 1;
			}
			else {
				nameCode = " <a href=\"javascript:AdjustCounter(" + switchOnOff + ")\"><i class=\"fas fa-heart\"></i></a>";
				switchOnOff = 0;
			}
			if (j === 0)
				dataField.innerHTML = data.results[i][headVal[j]] + nameCode;
			else if (j === 2)
				dataField.innerHTML = "<span id=\"hw" + i + "\"></span>";
			else
				dataField.innerHTML = data.results[i][headVal[j]];
		}
	}
	
	//stuff all of that into the div
	divResults.innerHTML = "";
	divResults.appendChild(resultsTable);
	FixHomeworld(peopleCount);
}

function FixHomeworld(peopleCount) {
	for (var i = 0; i < peopleCount; i++) {	
		var spanID = "hw" + i;
		GetHomeWorldNames(spanID, homeworldURLArr[i], UpdateHomeWorldNames)
	}
}

function GetHomeWorldNames(spanID, url, hwFunction) {
	fetch(url)
	.then(response => response.json())
	.then(data => {
		hwFunction(data, spanID);
	})
	.catch(error => console.error(error))
}

function UpdateHomeWorldNames(data, spanID) {
	homeworldSpan = document.getElementById(spanID);
	homeworldSpan.innerHTML = data.name;
}


function PrevPage()
{
    if (currentPage > 1) {
        currentPage--;
		var url = baseURL + "?page=" + currentPage + "&search=" + searchValue;
        GetData(url);
    }
}

function NextPage()
{
    if (currentPage < totalPages) {
        currentPage++;
		var url = baseURL + "?page=" + currentPage + "&search=" + searchValue;
        GetData(url);
    }
}

function SearchPeople() {	
	searchValue = document.getElementById("txtSearch").value;
	var url = baseURL + "?search=" + searchValue;
	currentPage = 1;
    GetData(url);
}

function AdjustCounter(switchOnOff) {
    var totalFavorites = document.getElementById("supFaveCount");
	if (switchOnOff === 0)
		faveCount ++;
	else
		faveCount--;
    totalFavorites.innerHTML = faveCount;	
}