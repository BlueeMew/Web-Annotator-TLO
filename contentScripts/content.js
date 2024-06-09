const getSelectedText = () => window.getSelection().toString();

const icon = document.createElement("img");
icon.src = chrome.runtime.getURL("images/pinguin.png");
icon.style.width = "30px";
icon.style.height = "30px";
icon.style.position = "absolute";
icon.style.cursor = "pointer";
icon.style.zIndex = "1000";
icon.style.display = "none";
icon.id = "highlighter";
icon.style.borderRadius = "7px";
icon.style.border = "solid 2px";
document.body.appendChild(icon);

const note = document.createElement("img");
note.src = chrome.runtime.getURL("images/notes.jpg");
note.style.width = "30px";
note.style.height = "30px";
note.style.position = "absolute";
note.style.cursor = "pointer";
note.style.zIndex = "1000";
note.style.display = "none";
note.id = "notes";
note.style.borderRadius = "7px";
note.style.border = "solid 2px";
document.body.appendChild(note);


let highlightColor = "yellow";
function highlighterAppear() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).getBoundingClientRect();
    icon.style.left = window.scrollX + range.left + 5 + "px";
    icon.style.top = window.scrollY + range.top + 5 + "px";
    icon.style.display = "inline-block";

    note.style.left = window.scrollX + range.left + 45 +"px";
    note.style.top = window.scrollY + range.top + 5 + "px";
    note.style.display = "inline-block";
    let color = "yellow";
    chrome.storage.local.get(["selectedColor"], function (result) {
      if (result.selectedColor) {
        color = result.selectedColor;
      }
      icon.style.borderColor = color;
      note.style.borderColor = color;
      highlightColor = color;
    });
  }
}
function removeHighlighter() {
  if (icon.style.display != "none") {
    icon.style.display = "none";
    note.style.display ="none";
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    selection.removeAllRanges();
  }

}
document.getElementById("highlighter").addEventListener("click", () => {
  highlightSelectedText();
  removeHighlighter();
});
document.addEventListener("mouseup", () => {
  if (getSelectedText().length > 0) {
    highlighterAppear();
  } else {
    removeHighlighter();
  }
});
document.addEventListener("selectionchange", () => {
  if (getSelectedText().length === 0) {
    removeHighlighter();
  }
});
function highlightSelectedText() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const commonAncestor = range.commonAncestorContainer;

  const wrapInSpan = (range) => {
    const span = document.createElement("span");
    span.style.backgroundColor = highlightColor;
    const uniqueId ="highlight-" +new Date().getTime() +"-" +Math.random().toString(36).substr(2, 9);
    span.id = uniqueId;
    try {
      range.surroundContents(span);
    } catch (e) {
      console.error(e);
    }
  };

  if (commonAncestor.nodeType === Node.TEXT_NODE) {
    //if common ancestor is a text node then wrap it directly
    wrapInSpan(range);
  } else {
    //else wrap all text nodes individually
    const textNodes = [];
    const walker = document.createTreeWalker(
      commonAncestor,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const nodeRange = document.createRange();
          nodeRange.selectNodeContents(node);
          return nodeRange.compareBoundaryPoints(Range.END_TO_START, range) <
            0 && nodeRange.compareBoundaryPoints(Range.START_TO_END, range) > 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      },
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    textNodes.forEach((textNode) => {
      const nodeRange = document.createRange();
      nodeRange.selectNodeContents(textNode);
      wrapInSpan(nodeRange);
    });
  }
}
//https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
//https://developer.mozilla.org/en-US/docs/Web/API/Range

document.getElementById("notes").addEventListener("click", () => {
  highlightSelectedText();
  addNotes();
  removeHighlighter();
});
function addNotes() {
  const selectedText = getSelectedText();
  if (selectedText.length === 0) return;

  const noteContent = prompt("What do you want to note?", "notes");
  if (noteContent !== null) {
    const noteElement = document.createElement("div");
    noteElement.innerHTML = noteContent;
    noteElement.style.zIndex = "1000";
    noteElement.style.backgroundColor = highlightColor;
    noteElement.style.maxWidth = "300px";
    noteElement.style.maxHeight = "300px";
    noteElement.style.position = "absolute";
    noteElement.style.padding = "10px";
    noteElement.style.border = "1px solid black";
    noteElement.style.borderRadius = "5px";
    noteElement.style.overflow = "auto";
    document.body.appendChild(noteElement);

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).getBoundingClientRect();
      noteElement.style.left = window.scrollX + range.right + 10 + "px";
      noteElement.style.top = window.scrollY + range.top + "px";
    }
  }
}
function saveNotes(){

}
//keyboard shortcut
function shortcutHiglight() {
  let color = "yellow";
  chrome.storage.local.get(["selectedColor"], function (result) {
    if (result.selectedColor) {
      color = result.selectedColor;
    }
    highlightColor = color;
  });
  highlightSelectedText();
  removeHighlighter();
}
function shortcutNotes(){
  let color = "yellow";
  chrome.storage.local.get(["selectedColor"], function (result) {
    if (result.selectedColor) {
      color = result.selectedColor;
    }
    highlightColor = color;
  });
  highlightSelectedText();
  addNotes();
  removeHighlighter();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "highlight text by keyboard shortcut") {
    shortcutHiglight();
    sendResponse({ status: "Text highlighted" });
  }else if(message.type ==="add notes by keyboard shortcut"){
    shortcutNotes();
    sendResponse({status:"notes added"});
  }
  return true;
});