/* ScifiD Engine by Jon Prevo */
/* simpleWebStorage by Zevero */

var faveCount = 0;
var faveList;
var selected;

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
			faveListText += "<li draggable=\"true\" ondragend=\"DragEnd()\" ondragover=\"DragOver(event)\" ondragstart=\"DragStart(event)\">" + faveList[f].name + "</li>";
			count++
		}
	}
	faveListText += "</ol>";
	divResults.innerHTML = faveListText;
	totalFavorites.innerHTML = count;
	faveCount = count;
}

function DragOver(e) {
  if (IsBefore(selected, e.target)) 
	  e.target.parentNode.insertBefore(selected, e.target);
  else 
	  e.target.parentNode.insertBefore(selected, e.target.nextSibling);
}

function DragEnd() {
  selected = null;
}

function DragStart(e) {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", null);
  selected = e.target;
}

function IsBefore(el1, el2) {
  var cur;
  if (el2.parentNode === el1.parentNode) {
    for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
      if (cur === el2) 
		  return true;
    }
  } else return false;
}