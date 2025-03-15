# Lite Material UI Documentation

Lite Material UI is a lightweight UI library designed to provide simple yet elegant components and styles for web applications. This documentation provides an overview of the library's components, their usage, and customization options.

## Getting Started

To use Lite Material UI, you need to include the provided CSS file (`materialUI.css`) and JavaScript file (`webUtils.js`) in your HTML document. You can then start using the library's components in your project.

```html
<link rel="stylesheet" href="path/to/materialUI.css">
<script src="path/to/webUtils.js"></script>
```

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

Lite Material UI includes several JavaScript functions for handling UI interactions, such as opening and closing screens, dialogues, and tabs.

- `openScreen(screenId)`: Opens the specified screen.
- `closeScreen(screenId)`: Closes the specified screen.
- `openDialogue(dialogueId)`: Opens the specified dialogue box.
- `closeDialogue(dialogueId)`: Closes the specified dialogue box.
- `switchTab(tabId, buttonId)`: Switches to the specified tab and updates the tab buttons.
- `pushToast(message, duration)`: Displays a toast notification with the specified message and duration.

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

Lite Material UI offers a lightweight solution for building stylish web interfaces with minimal effort. With its collection of components and easy-to-use JavaScript functions, you can create elegant user experiences for your web applications.
