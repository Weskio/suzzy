
// Content script for Suzzy - extracts page content and handles navigation
(function() {
  'use strict';

  // Extract visible content from the page
  function extractPageContent() {
    const content = {
      title: document.title,
      url: window.location.href,
      headings: [],
      paragraphs: [],
      links: [],
      timestamp: new Date().toISOString()
    };

    // Extract headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      if (heading.textContent.trim()) {
        content.headings.push({
          level: heading.tagName.toLowerCase(),
          text: heading.textContent.trim(),
          id: heading.id || null
        });
      }
    });

    // Extract paragraphs
    const paragraphs = document.querySelectorAll('p, div[class*="content"], article p');
    paragraphs.forEach(p => {
      if (p.textContent.trim().length > 20) {
        content.paragraphs.push(p.textContent.trim());
      }
    });

    // Extract links
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      if (link.textContent.trim() && link.href) {
        content.links.push({
          text: link.textContent.trim(),
          href: link.href,
          title: link.title || null
        });
      }
    });

    return content;
  }

  // Highlight elements on the page
  function highlightElement(selector, text) {
    // Remove existing highlights
    document.querySelectorAll('.suzzy-highlight').forEach(el => {
      el.classList.remove('suzzy-highlight');
    });

    // Add highlight styles if not already present
    if (!document.getElementById('suzzy-styles')) {
      const style = document.createElement('style');
      style.id = 'suzzy-styles';
      style.textContent = `
        .suzzy-highlight {
          background-color: #fef08a !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          box-shadow: 0 0 0 2px #eab308 !important;
          transition: all 0.3s ease !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Find and highlight matching elements
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (el.textContent && el.textContent.toLowerCase().includes(text.toLowerCase())) {
        el.classList.add('suzzy-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
      if (message.type === 'EXTRACT_CONTENT') {
        const content = extractPageContent();
        sendResponse({ success: true, content });
      }
      
      if (message.type === 'HIGHLIGHT_TEXT') {
        highlightElement('*', message.text);
        sendResponse({ success: true });
      }
      
      if (message.type === 'NAVIGATE_TO_ELEMENT') {
        const element = document.querySelector(message.selector);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.outline = '3px solid #3b82f6';
          setTimeout(() => {
            element.style.outline = '';
          }, 2000);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'Element not found' });
        }
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    
    return true;
  });

  console.log('Suzzy content script loaded successfully!');
})();
