// Extracting the main content from the page
function getPageContent() {
    return document.body.innerText || document.body.textContent;
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getContent") {
      sendResponse({ content: getPageContent() });
    }
  });
  