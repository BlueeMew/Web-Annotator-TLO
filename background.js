chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "highlightText",
    title: "Highlight text",
    contexts: ["selection"],
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "highlightText") {
    chrome.storage.local.get(["selectedColor"], function (result) {
      let color = "yellow";
      if (result.selectedColor) {
        color = result.selectedColor;
      }
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: highlightSelectedText,
        args: [color]
      });
    });
  }
});
function highlightSelectedText(color) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i);
    const fragment = range.extractContents();
    const span = document.createElement("span");
    span.style.backgroundColor = color;
    span.appendChild(fragment);
    range.insertNode(span);
  }
  selection.removeAllRanges();
}


//keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  console.log('Command:', command);
  if (command === 'highlightText') {
    highlightTextinContent();
  }else if (command === 'addNotes'){
    addNotesinContent();
  }else if (command === 'savePage'){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'savePage'}, (response) => {
          });
      }
  });
  }else if(command === 'restorePage'){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'restorePage'}, (response) => {
          });
      }
  });
  }
});
function highlightTextinContent() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'highlight text by keyboard shortcut'}, (response) => {
          });
      }
  });
}
function addNotesinContent(){
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'add notes by keyboard shortcut'}, (response) => {
        });
    }
});
}