let currentScreen = "main";
let currentTab;
let ghosts;

let actionMode = true;

function openScreen(screen) {
	setTimeout(()=> { 
	var screens = document.getElementsByClassName("screen")
	var screenId = screen;
	
	var screenIds;
	document.getElementById(currentScreen).classList.add("screen--closing");
	
	document.getElementById(currentScreen).classList.add("screen--ghost");
	document.getElementById(screen).classList.add("screen--ghost");
	document.getElementById(screen).style.zIndex = 5;
	
	currentScreen = screen;
	document.getElementById(screenId).style.display = "block";
	//appendRipples();
	

	setTimeout(()=> {
		for(i=0; i < screens.length; i++ ) {
			screenIds = screens[i].id;
			if(screenIds != screenId) {
				document.getElementById(screenIds).style.display = "none";
			}
		}
		document.getElementById(screen).style.zIndex = 1;
		ghosts = document.querySelectorAll(".screen--ghost");
		for (j=0; j<ghosts.length; j++) {
			//console.log("as: " + ghosts[j]);
			ghosts[j].classList.remove("screen--ghost");
			ghosts[j].classList.remove("screen--closing");
		}
	}, 300);
	}, 350);
}

function closeScreen(screen) {
	document.getElementById(screen).style.display = "none";
}

function openDialogue(dId) {
	document.getElementById(dId).style.display = "flex";
	//document.getElementById(currentScreen).style.filter = ("blur(12px)")
}

function closeDialogue(dId) {
	document.getElementById(dId).style.display = "none";
	//document.getElementById(currentScreen).style.filter = ("blur(0)")
}

function switchTab(idd, dId) {
	var tabs = document.getElementsByClassName("tabPage");
	currentTab = idd;
	for(i=0; i<tabs.length; i++) {
		if (tabs[i].id != currentTab) {
			tabs[i].style.display = "none";
		}
	}
	document.getElementById(currentTab).style.display = "block";
	var tabOptions = document.getElementsByClassName("tabOption");
	for (i = 0; i<tabOptions.length; i++) {
		if (tabOptions[i].id != dId) {
			//tabOptions[i].style.borderBottom = "";
			//tabOptions[i].style.color = "rgb(192, 191, 188)";
			tabOptions[i].classList.remove("tabOption--Active");
		}
	}
	//document.getElementById(dId).style.borderBottom = "2px solid white";
	//document.getElementById(dId).style.color = "rgba(255, 255, 255, 255)";
	document.getElementById(dId).classList.add("tabOption--Active");
}

function pushToast(text, duration) {
	document.getElementById(currentScreen).insertAdjacentHTML(
        'beforeend',
        `<div class="toast" id="tmpToast"><p>${text}</p></div>`
    );
	//document.getElementById("tmpToast").classList.add("toast--active");
	setTimeout(()=> {
		//document.getElementById("tmpToast").style.display = "none";
		document.getElementById("tmpToast").classList.toggle("toast--inactive");
		setTimeout(()=> {
			document.getElementById("tmpToast").remove();
		}, 400);
	}, duration);
}

function updateProperties(propertyObjects) {
	
	
	for(i = 0; i < propertyObjects.length; i++) {
		document.querySelector(':root').style.setProperty(propertyObjects[i].name, propertyObjects[i].value);
	}
}

function main() {
	try {
		//document.getElementById("main").style.display = "block";
	} catch (e) {
		console.log("Main screen not found");
	}
	
	try {
		switchTab(document.querySelector('.tabPage').id, document.querySelector('.tabOption').id);
	} catch (e) {
		console.log("No Tabs Were Found");
	}
	
}


	let actionRegistry = new Map();
	//main action class
	class action {
		constructor(actionName, actionMethod) {
			this.name = actionName;
			// sets the method to be used when a specific action is invoked
			this.actionMethod = actionMethod;
			//register the actionName into the registry so that, it can be accessed later by string
			actionRegistry.set(this.name, this);
		}
	}
		function getURLParams() {
		let params = new Map();
		let url = new URL(window.location.href);
		for (const [key, value] of url.searchParams.entries()) {
			params.set(key, value);
		}

		return params;

	}

	function performAction(actionName, params) {
		let url = new URL(window.location.href);
		Object.entries(params).forEach(([key, value]) => {
			if (value === null || value === undefined) {
			  url.searchParams.delete(key);
			} else {
			  url.searchParams.set(key, value);
			}
		  });

		  window.history.pushState({}, '', url);

		  actionRegistry.get(actionName).actionMethod(params);
	}

	function performActionFromURL() {
		let params = getURLParams();
		let acName = params.get("action");

		if (acName == null) {
			openScreen('main');
		} else {
			console.log(acName);
			console.log(actionRegistry.get(acName));

			actionRegistry.get(acName).actionMethod(params);
		}
		
		 
	}


	
	window.addEventListener('popstate', (event) => {
		console.log('Navigation occurred! New URL:', window.location.href);
		
		// Access any state data you stored with pushState/replaceState
		console.log('State data:', event.state);
		
		// You can now handle the URL change
		window.addEventListener('DOMContentLoaded', (event)=> {
			performActionFromURL();
		});
		
	  });
	
	  function goBack() {
		window.history.back();
	}

	//performActionFromURL();
	window.addEventListener('DOMContentLoaded', (event)=> {
		performActionFromURL();
	});




window.onload = main;
