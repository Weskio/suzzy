
// Background service worker for Suzzy
chrome.runtime.onInstalled.addListener(() => {
  console.log('Suzzy extension installed successfully!');
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTRACT_CONTENT') {
    // Forward message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
    });
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'NAVIGATE_TO_ELEMENT') {
    // Handle navigation requests
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
    });
    return true;
  }
});
