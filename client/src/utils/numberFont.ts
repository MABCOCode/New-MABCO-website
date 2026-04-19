/**
 * Utility to apply Nirmala font to numbers within Arabic text
 */

export const applyNumberFontToText = () => {
  // Only run on pages with RTL direction (Arabic)
  if (document.dir !== 'rtl') return;

  // Function to wrap numbers in text with number-in-text class
  const wrapNumbersInText = (element: Element) => {
    if (!element.textContent) return;

    // Skip elements that already have price/currency classes
    if (element.classList.contains('price') ||
        element.classList.contains('currency') ||
        element.classList.contains('amount') ||
        element.classList.contains('cost') ||
        element.classList.contains('total') ||
        element.classList.contains('subtotal') ||
        element.classList.contains('discount') ||
        element.classList.contains('numeric') ||
        element.classList.contains('number')) {
      return;
    }

    // Skip elements that are form inputs, buttons, etc.
    if (element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA' ||
        element.tagName === 'BUTTON' ||
        element.tagName === 'SELECT') {
      return;
    }

    const text = element.textContent;
    // Check if text contains numbers
    if (/\d/.test(text)) {
      // Replace numbers with wrapped versions
      const newHTML = text.replace(/(\d+(?:\.\d+)?)/g, '<span class="number-in-text">$1</span>');
      if (newHTML !== text) {
        element.innerHTML = newHTML;
      }
    }
  };

  // Process all text elements in the document
  const textElements = document.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6, li, td, th, label');
  textElements.forEach(wrapNumbersInText);

  // Also process dynamically added content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          // Process the added element and its children
          wrapNumbersInText(element);
          element.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6, li, td, th, label').forEach(wrapNumbersInText);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyNumberFontToText);
} else {
  applyNumberFontToText();
}

// Also run on navigation changes (for SPAs)
if (typeof window !== 'undefined') {
  window.addEventListener('load', applyNumberFontToText);

  // Listen for React Router navigation
  window.addEventListener('popstate', () => {
    setTimeout(applyNumberFontToText, 100);
  });

  // Listen for custom navigation events
  document.addEventListener('navigation', () => {
    setTimeout(applyNumberFontToText, 100);
  });
}