let currentScreen = "main";
//the screen the latest openScreen call asked for. The settling step always
//reconciles towards it, so back to back calls can not leave the wrong screen hidden
let targetScreen = currentScreen;
let currentTab;
let ghosts;

let actionMode = true;

function openScreen(screen) {
	targetScreen = screen;
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
			if(screenIds != targetScreen) {
				document.getElementById(screenIds).style.display = "none";
			}
		}
		document.getElementById(targetScreen).style.zIndex = 1;
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

function appendRipples() {
    document.querySelectorAll('.card3:not([data-ripple])').forEach(card => {
        //marks the card as bound so that calling appendRipples again (after
        //rendering new cards) does not stack duplicate listeners
        card.dataset.ripple = "true";
        card.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            this.appendChild(ripple);

            // Remove the ripple after animation
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}


function updateProperties(propertyObjects) {
	
	
	for(i = 0; i < propertyObjects.length; i++) {
		document.querySelector(':root').style.setProperty(propertyObjects[i].name, propertyObjects[i].value);
	}
}

function main() {
	try {
		//a shared url may open a specific state, so the main screen is only
		//revealed when the url carries no action
		if (!getURLParams().has("action")) {
			document.getElementById("main").style.display = "block";
		}
	} catch (e) {
		console.warn(`Main screen Could be Null ${e}`);
	}
	
	try {
		switchTab(document.querySelector('.tabPage').id, document.querySelector('.tabOption').id);
	} catch (e) {
		console.warn(`Tabs could be null: ${e}`);
	}

	try {
		appendRipples();
	} catch (e) {
		console.log(`Ripples could be null: ${e}`);
	}
	
}


let actionRegistry = new Map();
//main action class
class action {
	//actionName: the string that identifies the action inside the url (?action=actionName)
	//requiredParams: array of param names that must be present for the action to run
	//actionMethod: the callback run when the action is performed or the url is visited
	constructor(actionName, requiredParams, actionMethod) {
		this.name = actionName;
		this.requiredParams = requiredParams || [];
		// sets the method to be used when a specific action is invoked
		this.actionMethod = actionMethod;
		//register the actionName into the registry so that, it can be accessed later by string
		actionRegistry.set(this.name, this);
	}
}

function readParams(url) {
	let params = new Map();
	for (const [key, value] of url.searchParams.entries()) {
		params.set(key, value);
	}

	return params;
}

function getURLParams() {
	return readParams(new URL(window.location.href));
}

function getMissingParams(target, params) {
	return target.requiredParams.filter((param) => params.get(param) == null);
}

function performAction(actionName, params = {}) {
	let target = actionRegistry.get(actionName);
	if (target == null) {
		console.warn(`Action "${actionName}" is not registered`);
		return;
	}

	let url = new URL(window.location.href);
	//the action name itself lives in the url, that is what makes the state shareable
	url.searchParams.set("action", actionName);
	Object.entries(params).forEach(([key, value]) => {
		if (value === null || value === undefined) {
			url.searchParams.delete(key);
		} else {
			url.searchParams.set(key, value);
		}
	});

	//params are validated against the url that is about to be stored, not the current one
	let newParams = readParams(url);
	let missing = getMissingParams(target, newParams);
	if (missing.length > 0) {
		console.warn(`Action "${actionName}" is missing required params: ${missing.join(", ")}`);
		return;
	}

	window.history.pushState({}, '', url);

	target.actionMethod(newParams);
}

function performActionFromURL() {
	let params = getURLParams();
	let acName = params.get("action");

	if (acName == null) {
		openScreen('main');
		return;
	}

	let target = actionRegistry.get(acName);
	if (target == null) {
		console.warn(`Action "${acName}" is not registered`);
		//a url that can not be honoured falls back to the default screen
		openScreen('main');
		return;
	}

	let missing = getMissingParams(target, params);
	if (missing.length > 0) {
		console.warn(`Action "${acName}" is missing required params: ${missing.join(", ")}`);
		openScreen('main');
		return;
	}

	target.actionMethod(params);
}


window.addEventListener('popstate', (event) => {
	console.log('Navigation occurred! New URL:', window.location.href);

	// Access any state data you stored with pushState/replaceState
	console.log('State data:', event.state);

	// You can now handle the URL change
	performActionFromURL();
});

function goBack() {
	window.history.back();
}

window.addEventListener('DOMContentLoaded', (event)=> {
	performActionFromURL();
});


window.onload = main;
