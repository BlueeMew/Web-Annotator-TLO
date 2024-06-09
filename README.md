# Web-Annotator
# Overview
This Chrome extension allows users to highlight selected text on web pages and add notes using context menus, keyboard shortcuts or a toolbar popup. The highlighted text and notes can be saved and restored or exported and saved into a pdf.

# Installation
1. Clone the repository.
2. Open Chrome and navigate to chrome://extensions/.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

# Usage
# Context Menu
1. Select text on any web page.
2. Right-click to open the context menu.
3. Click "Highlight text" to highlight the selected text.
# Keyboard Shortcuts
Ctrl+Shift+Y: Highlight selected text.
Ctrl+Shift+N: Add a note to the selected text.
Ctrl+Shift+S: Save the current state of the page.
Ctrl+Shift+R: Restore the previously saved state of the page.
# Toolbar Popup
1. Click on the extension icon in the toolbar to open the popup.
2. Use the color picker to select a highlight color and save it.
3. Click "Save Page" to save the current state of the page.
4. Click "Restore Page" to restore the previously saved state of the page.
5. Click "Save as PDF" to convert the page to PDF format.

# Files
background.js
Handles the creation of context menu items and the execution of scripts for highlighting text, adding notes, saving, and restoring pages.


popup.js
Manages the toolbar popup interface, allowing users to pick a highlight color, save, and restore pages, and convert pages to PDF.
content.js
Contains the logic for highlighting text, adding notes, and interacting with the page content. It also handles the appearance and behavior of the highlight and note icons.
Using bootstrap for the buttons on the popup interface of the extension
