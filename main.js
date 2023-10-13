var version = 19;
console.log('running');
function bake_cookie(name, value) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 30);
	var cookie = [name, '=', JSON.stringify(value),'; expires=.', exdate.toUTCString(), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
	document.cookie = cookie;
}
function read_cookie(name) {
	var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	result && (result = JSON.parse(result[1]));
	return result;
}
var time = {
	name:'time',
	total:0,
	increment:1,
	specialchance:0.1
},
  function load(loadType){
	//define load variables
	var loadVar = {},
		loadVar2 = {};
		
	if (loadType == 'cookie'){
		//check for cookies
		if (read_cookie('civ') && read_cookie('civ2')){
			//set variables to load from
			loadVar = read_cookie('civ');
			loadVar2 = read_cookie('civ2');
			//notify user
			gameLog('Loaded saved game from cookie');
			gameLog('Save system switching to localStorage.');
		} else {
			console.log('Unable to find cookie');
			return false;
		};
	}
	
	if (loadType == 'localStorage'){
		//check for local storage
		try {
			string1 = localStorage.getItem('save');
		} catch(err) {
			console.log('Cannot access localStorage - browser may not support localStorage, or storage may be corrupt')
		}
		if (string1 && string2){
			loadVar = JSON.parse(string1);
			loadVar2 = JSON.parse(string2);
			//notify user
			gameLog('Loaded saved game from localStorage')
		} else {
			console.log('Unable to find variables in localStorage. Attempting to load cookie.')
			load('cookie');
			return false;
		}
	}
	
	if (loadType == 'import'){
		//take the import string, decompress and parse it
		var compressed = document.getElementById('impexpField').value;
		var decompressed = LZString.decompressFromBase64(compressed);
		var revived = JSON.parse(decompressed);
		//set variables to load from
		loadVar = revived[0];
		loadVar2 = revived[1];
		//notify user
		gameLog('Imported saved game');
		//close import/export dialog
		//impexp();
	}
	
	if (loadVar.time.name != null) time.name = loadVar.time.name;
	if (loadVar.time.total != null) time.total = loadVar.time.total;
	if (loadVar.time.increment != null)	time.increment = loadVar.time.increment;
	if (loadVar.time.specialchance != null)	time.specialchance = loadVar.time.specialchance;
  function updateResourceTotals(){
    document.getElementById('food').innerHTML = prettify(Math.floor(food.total));
  }
  function increment(material){
	resourceClicks += 1;
	document.getElementById("clicks").innerHTML = prettify(Math.round(resourceClicks));
	material.total = material.total + material.increment;
  }
  if (time.total > 200){
		time.total = 200;
	}
  function save(savetype){
	//Create objects and populate them with the variables, these will be stored in cookies
	//Each individual cookie stores only ~4000 characters, therefore split currently across two cookies
	//Save files now also stored in localStorage, cookies relegated to backup
	saveVar = {
time:time
	}
	//Create the cookies
	bake_cookie('save',saveVar);
	try {
		localStorage.setItem('save', JSON.stringify(saveVar));
	} catch(err) {
		console.log('Cannot access localStorage - browser may be old or storage may be corrupt')
	}
	//Update console for debugging, also the player depending on the type of save (manual/auto)
	console.log('Attempted save');
	if (savetype == 'export'){
		var string = '[' + JSON.stringify(saveVar) + ',' + JSON.stringify(saveVar2) + ']';
		var compressed = LZString.compressToBase64(string);
		console.log('Compressing Save');
		console.log('Compressed from ' + string.length + ' to ' + compressed.length + ' characters');
		document.getElementById('impexpField').value = compressed;
		gameLog('Saved game and exported to base64');
	}
	if ((read_cookie('civ') && read_cookie('civ2')) || (localStorage.getItem('civ') && localStorage.getItem('civ2'))){
		console.log('Savegame exists');
		if (savetype == 'auto'){
			console.log('Autosave');
			gameLog('Autosaved');
		} else if (savetype == 'manual'){
			alert('Game Saved');
			console.log('Manual Save');
			gameLog('Saved game');
		}
		//_gaq.push(['_trackEvent', 'CivClicker', 'Save', savetype]);
		ga('send', 'event', 'CivClicker', 'Save', savetype);
	};
	try {
		xmlhttp = new XMLHttpRequest();
		xmlhttp.overrideMimeType('text/plain');
		xmlhttp.open("GET", "version.txt?r=" + Math.random(),true);
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4) {
				var sVersion = parseInt(xmlhttp.responseText);
				if (version < sVersion){
					versionAlert();
				}
			}
		}
		xmlhttp.send(null)
	} catch (err) {
		console.log('XMLHttpRequest failed')
	}
}

function toggleAutosave(){
	//Turns autosave on or off. Default on.
	if (autosave == "on"){
		console.log("Autosave toggled to off")
		autosave = "off";
		document.getElementById("toggleAutosave").innerHTML = "Enable Autosave"
	} else {
		console.log("Autosave toggled to on")
		autosave = "on";
		document.getElementById("toggleAutosave").innerHTML = "Disable Autosave"
	}
}

function deleteSave(){
	//Deletes the current savegame by setting the game's cookies to expire in the past.
	var really = confirm('Really delete save?'); //Check the player really wanted to do that.
	if (really){
        document.cookie = ['civ', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
		document.cookie = ['civ2', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
		localStorage.removeItem('civ');
		localStorage.removeItem('civ2');
        gameLog('Save Deleted');
	}
}
