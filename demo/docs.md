# Lite Material UI Documentation

Lite Material UI is a lightweight UI library designed to provide simple yet elegant components and styles for web applications. This documentation provides an overview of the library's components, their usage, and customization options.

## Getting Started

To use Lite Material UI, you need to include the provided CSS file (`materialUI.css`) and JavaScript file (`webUtils.js`) in your HTML document. You can then start using the library's components in your project.

```html
<link rel="stylesheet" href="path/to/materialUI.css">
<script src="path/to/webUtils.js"></script>
```

Your own script comes after it, it needs `action` and the rest of the helpers to be defined before you use them.

## Components

### 1. Title Bar

The title bar component provides a styled container for displaying titles or headings. It can be used at the top of a page or section.

```html
<div class="titleBar">
    <p>Your Title Here</p>
</div>
```

### 2. Buttons

Lite Material UI provides customizable buttons for various actions. Buttons can be styled using the `.btn` class.

```html
<button class="btn">Button</button>
```

### 3. Cards

Cards are versatile components for displaying content in a structured manner. They support hover effects and can be customized using CSS classes like `.card` and `.card2`.

```html
<div class="card2">
    <!-- Card Content Here -->
</div>
```

#### Card3 and ripples

`.card3` is the outlined variant, it is the one that reacts to clicks with a ripple. The ripple is a span that is created on the click position, it is clipped by the card and removed once its animation ends. Any content can live inside a `.card3`, so it works as a list item, a row or a clickable tile.

Ripples are attached automatically on load, cards that are rendered later on (with `innerHTML` for example) need one extra call to `appendRipples()` after they are added to the page. Calling it more than once is safe, cards that are already bound are skipped.

```html
<div class="card3">
    <!-- Card Content Here -->
</div>
```

```javascript
//binds the ripples of the cards that are currently in the dom
appendRipples();
```

### 4. Text Input

Styled text input fields are available for capturing user input. They provide a consistent look and feel across different browsers.

```html
<input type="text" class="editText" placeholder="Enter Text">
```

### 5. Dialogue Boxes

Dialogue boxes are modal windows that can be used to display messages, forms, or other content requiring user interaction.

a div with class of dialogueBox with a unique id is required. another div with a class of box is also required. Buttons are styled automatically inside of dialogues so no need to add ```btn``` class
```html
<div class="dialogueBox" id="dialogueId">
    <div class="box">
        <!-- Dialogue Content Here -->
        <h3>Title</h3>
        <button>Close</button>
    </div>
    
</div>
```

### 6. Tabs

Tabbed navigation allows organizing content into multiple sections. Lite Material UI supports tabbed layouts with smooth switching animations.

```html
<div class="tabbedTitleCont">
    <div class="titleBarTabbed">
        <p>Your Title Here</p>
    </div>
    <!-- Tab Buttons -->
    <div class="grid2ng">
        <button class="tabOption tabOption--Active">Tab 1</button>
        <button class="tabOption">Tab 2</button>
    </div>
</div>
```

### 7. Toasts

Toast notifications provide non-intrusive feedback to users. Lite Material UI offers customizable toast messages that fade in and out.

```javascript
// Trigger a toast notification
pushToast('Your Message Here', 3000); // 3000 milliseconds duration
```

## JavaScript Functions

Lite Material UI includes several JavaScript functions for handling UI interactions, such as opening and closing screens, dialogues, tabs, toasts and shareable states.

- `openScreen(screenId)`: Opens the specified screen.
- `closeScreen(screenId)`: Closes the specified screen.
- `openDialogue(dialogueId)`: Opens the specified dialogue box.
- `closeDialogue(dialogueId)`: Closes the specified dialogue box.
- `switchTab(tabId, buttonId)`: Switches to the specified tab and updates the tab buttons.
- `pushToast(message, duration)`: Displays a toast notification with the specified message and duration.
- `appendRipples()`: Binds the click ripples to every `.card3` that is not bound yet.
- `updateProperties(propertyObjects)`: Overrides css variables at runtime, each entry is an object with a `name` and a `value`.
- `getURLParams()`: Returns a `Map` of the query parameters of the current url.
- `performAction(actionName, params)`: Runs a registered action, writes it into the url and pushes a history entry.
- `performActionFromURL()`: Runs the action described by the current url, this is what makes a shared link work.
- `goBack()`: Goes one step back in the history, the url action is replayed from there.

```javascript
updateProperties([
    { name: "--accent-color", value: "rgb(0, 200, 120)" },
    { name: "--main-bg-color", value: "rgb(240, 240, 240)" }
]);
```

## Action system

Screens, dialogues and tabs are state that lives in the page, a link cannot describe them. Whenever a state has to be shareable by a url, it should be an **action**. An action is a named state plus the parameters it needs, and it is stored in the url as `?action=<actionName>&<param>=<value>`.

An action is created with the `action` class, which takes the action name, the parameters it requires, and the callback that runs when the action is performed or when its url is visited.

```javascript
const jobDetailsOpen = new action("jobDetailsOpen", ["jobId"], (params) => {
    let job = getJob(params.get("jobId"));
    openScreen("jobDetails");
    renderJobDetails(job);
});
```

- **actionName**: the string that identifies the action in the url, it also registers the action so it can be looked up by that string later.
- **requiredParams**: an array of the parameter names the action can not run without. An action without parameters takes an empty array.
- **actionMethod**: the callback. It always receives a `Map` of the parameters, the same way whether the action was performed by the app or read from the url.

### Performing an action

`performAction` writes the action name and its parameters into the url, pushes a history entry and then runs the callback. Passing a parameter as `null` or `undefined` removes it from the url, which is how a parameter is cleared when going back to a wider state.

```javascript
//opens the details, url becomes ?action=jobDetailsOpen&jobId=JOB-1042
performAction("jobDetailsOpen", { jobId: "JOB-1042" });

//back to the list, jobId is dropped from the url
performAction("jobsList", { jobId: null });
```

Because the state is in the url, the browser back and forward buttons work as well, every history entry replays the action it describes.

```javascript
goBack();
```

### Running an action from a url

On load, and on every back or forward navigation, the library reads the `action` parameter and runs the matching callback. A page therefore has no state to restore by hand, it only has to be able to render itself from the parameters.

- In the demo, `index.html?action=jobDetailsOpen&jobId=JOB-1088` opens the details of that job directly.
- A url with no `action` parameter opens the `main` screen.
- A url with an unknown action name, or one that misses a required parameter, is reported in the console and falls back to the `main` screen.
- A required parameter that is missing on `performAction` is reported in the console and the action does not run, so the url never stores a broken state.

### A complete example

```javascript
//the list, no parameters needed
const jobsList = new action("jobsList", [], (params) => {
    openScreen("main");
});

//the details, the job id is required
const jobDetailsOpen = new action("jobDetailsOpen", ["jobId"], (params) => {
    let job = getJob(params.get("jobId"));
    if (job == null) {
        pushToast("Unknown job: " + params.get("jobId"), 3000);
        performAction("jobsList", { jobId: null });
        return;
    }
    openScreen("jobDetails");
    renderJobDetails(job);
});

//one listener for the whole list, cards carry their id in data-job-id
document.addEventListener("click", (event) => {
    let card = event.target.closest(".jobCard");
    if (card != null) {
        performAction("jobDetailsOpen", { jobId: card.dataset.jobId });
    }
});
```

## Example

Here's a basic example demonstrating the usage of Lite Material UI components:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Include Lite Material UI CSS and JavaScript -->
    <link rel="stylesheet" href="path/to/materialUI.css">
    <script src="path/to/webUtils.js"></script>
    <!-- Additional CSS or External Fonts -->
</head>
<body>
    <!-- Your HTML Content Here -->
</body>
</html>
```

## Customization

Lite Material UI allows customization of colors, fonts, and other styles by directly modifying the provided CSS file using CSS variables or by adding custom CSS rules to override defaults.


## Conclusion

Lite Material UI offers a lightweight solution for building stylish web interfaces with minimal effort. With its collection of components and easy-to-use JavaScript functions, you can create elegant user experiences for your web applications. The action system goes one step further, it turns any state you care about into a link that can be sent, bookmarked and replayed.
