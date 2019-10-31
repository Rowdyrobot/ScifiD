/* ScifiD Engine by Jon Prevo */
/* simpleWebStorage by Zevero */

var currentPage = 1;
var recordsPerPage = 10;
var peopleCount = 0;
var totalPages = 0;
var faveCount = 0;
var searchValue = "";
var homeworldSpan = "";
var homeworldURLArr = [];
var faveList;
var baseURL = "https://swapi.co/api/people/";
document.getElementById("txtSearch").value = "";

CheckLocalStorage();
SetFavoritesCount();
GetData(baseURL);

function CheckLocalStorage() {
	if(localStorage.has('faveList'))
		faveList = localStorage.get('faveList');
	else {
		//localStorage.set('faveList', [{"name":"Han Solo","isfave":1,"order":1},{"name": "Luke Skywalker","isfave": 1,"order": 2},{"name": "Jar Jar Binks","isfave": 0,"order": 0}]);
		localStorage.set('faveList', [{"name":"","isfave":0,"order":0}]);
		faveList = localStorage.get('faveList');
	}
}

function SetFavoritesCount() {
    var totalFavorites = document.getElementById("supFaveCount");
	var count = 0;
	for (var f = 0; f < faveList.length; f++) {
		if (faveList[f].isfave === 1)
			count++
	}
	totalFavorites.innerHTML = count;
	faveCount = count;
}

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
	
	var faveCode = "";
	for (var i = 0; i < peopleCount; i++) {
		tr = resultsTable.insertRow(-1);
		for (var j = 0; j < headVal.length; j++) {
			var dataField = tr.insertCell(-1);			
			if (j === 0) {
				for (var k = 0; k < faveList.length; k++) {
					var personName = data.results[i][headVal[j]];
					//console.log(faveList[k].name + " | " + personName);
					faveCode = "<span id='" + personName + "'><a href=\"javascript:AdjustFavorite('" + personName + "',0)\"><i class=\"faveIcon far fa-heart\"></i></a></span> ";
					if (faveList[k].name === personName && faveList[k].isfave === 1) {
						faveCode = "<span id='" + personName + "'><a href=\"javascript:AdjustFavorite('" + personName + "'," + faveList[k].isfave + ")\"><i class=\"faveIcon fas fa-heart\"></i></a></span> ";
						break;
					}
				}
				dataField.innerHTML = faveCode + personName;
			}
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

function AdjustFavorite(stringName, boolFave) {
    var totalFavorites = document.getElementById("supFaveCount");
	var currentPerson = document.getElementById(stringName);
	var foundInList = 0;
	var newBool = 1;
	var newIcon = "fas";
	for (f in faveList) {
		personName = faveList[f].name;
		isFave = faveList[f].isfave;
		if (personName === stringName) {
			foundInList = 1;
			if (boolFave === 0) {
				faveList[f].isfave = 1;
				faveCount ++;
			}
			else if (boolFave === 1){
				faveList[f].isfave = 0;
				faveCount --;
				newBool = 0;
				newIcon = "far";
			}
		}
	}
	
	if(foundInList === 0) {
			faveList.push({"name": stringName, "isfave": 1, "order": faveList.length + 1});
			faveCount++;
	}
	
	currentPerson.innerHTML = "<a href=\"javascript:AdjustFavorite('" + stringName + "'," + newBool + ")\"><i class=\"faveIcon " + newIcon + " fa-heart\"></i></a>";
	
    totalFavorites.innerHTML = faveCount;	
	localStorage.set('faveList', faveList);
}