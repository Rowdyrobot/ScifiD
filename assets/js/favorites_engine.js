/* ScifiD Engine by Jon Prevo */
/* simpleWebStorage by Zevero */

var faveCount = 0;
var faveList;

CheckLocalStorage();
SetFavorites();

function CheckLocalStorage() {
	if(localStorage.has('faveList'))
		faveList = localStorage.get('faveList');
	else {
		localStorage.set('faveList', [{"name":"","isfave":0,"order":0}]);
		faveList = localStorage.get('faveList');
	}
}

function SetFavorites() {
    var totalFavorites = document.getElementById("supFaveCount");
	var divResults = document.getElementById("resultsList");
	var faveListText = "<ol>";
	var count = 0;
	for (var f = 0; f < faveList.length; f++) {
		if (faveList[f].isfave === 1) {
			faveListText += "<li>" + faveList[f].name + "</li>";
			count++
		}
	}
	faveListText += "</ol>";
	divResults.innerHTML = faveListText;
	totalFavorites.innerHTML = count;
	faveCount = count;
}