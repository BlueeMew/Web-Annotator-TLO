document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('colorPicker');
    const saveColorButton = document.getElementById('saveColorButton');

    chrome.storage.local.get(['selectedColor'], function(result) {
        if (result.selectedColor) {
            colorPicker.value = result.selectedColor;
        }
    });
    saveColorButton.addEventListener('click', function() {
        const selectedColor = colorPicker.value;
        chrome.storage.local.set({ selectedColor : selectedColor }, function() {
            console.log('Color is saved: ' + selectedColor);
        });
    });
});


document.getElementById('savePage').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: () => document.documentElement.outerHTML,
    }, results => {
      chrome.storage.local.set({ [activeTab.url]: results[0].result }, () => {
        console.log(`Page saved for ${activeTab.url}`);
      });
    });
  });
});

document.getElementById('restorePage').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    chrome.storage.local.get(activeTab.url, data => {
      if (data[activeTab.url]) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: restorePage,
          args: [data[activeTab.url]]
        });
      }
    });
  });
});

function restorePage(content) {
  document.open();
  document.write(content);
  document.close();
}

document.getElementById('saveAsPdfButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: convertPageToPdf
    });
  });
});

function convertPageToPdf() {
  const printPage = () => {
    window.print();
  };

  printPage();
}


//keybaord shortcuts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "savePage") {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => document.documentElement.outerHTML,
      }, results => {
        chrome.storage.local.set({ [activeTab.url]: results[0].result }, () => {
          console.log(`Page saved for ${activeTab.url}`);
        });
      });
    });
    sendResponse({ status: "page saved" });
  }else if(message.type ==="restorePage"){
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];
      chrome.storage.local.get(activeTab.url, data => {
        if (data[activeTab.url]) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: restorePage,
            args: [data[activeTab.url]]
          });
        }
      });
    });
    sendResponse({status:"page restored"});
  }
  return true;
});