export const SCRIPT_FUNCTIONS = /* js */`
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function _consoleLog(message, type = 'debug') {
  window.ReactNativeWebView.postMessage(JSON.stringify({message, type}));
}

function waitForChange(target) {
  return new Promise(resolve => {
    const observer = new MutationObserver(mutations => {
      observer.disconnect();
      resolve();
    })
    
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true
    })
  })
}
function waitForElm(selector, frame) {
  return new Promise(resolve => {
    if (frame.querySelector(selector)) {
      return resolve(frame.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (frame.querySelector(selector)) {
        resolve(frame.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(frame.body, {
      childList: true,
      subtree: true,
    });
  });
}

function waitForFrameToLoad(target) {
  return new Promise(resolve=>{
      target.addEventListener('load', () => {
        resolve();
        _consoleLog('frame loaded');
      }, {
        once: true
      })
  }
  )
}

async function waitForImageLoad(elem) {
  return new Promise((resolve, reject) => {
    elem.onload = () => resolve();
    elem.onerror = reject;
  });
  }

async function setElementValue(element, value) {
  return new Promise(async resolve => {
    element.value = value;
    element.dispatchEvent(new Event('change'));
    resolve();
  })
} 

function waitForLoading(target) {
  return new Promise(resolve => {
    const observer = new MutationObserver(mutations => {
      const firstRemovedNodeText = mutations[0]?.removedNodes[0]?.innerText;
      if (firstRemovedNodeText && firstRemovedNodeText.includes('Loading')) {
        observer.disconnect();
        resolve();
      }
    })
    
    observer.observe(target, {
      childList: true,
      subtree: true,
    })
  })
}

function waitForDropdownOptions(target) {
  return new Promise(resolve => {
    const observer = new MutationObserver(mutations => {
      if (target.options.length > 1) {
        observer.disconnect();
        resolve();
      }
    })
    
    observer.observe(target, {
      childList: true,
      subtree: true,
    })
  })
}
const path = window.location.pathname
`