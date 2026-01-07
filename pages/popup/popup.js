'use strict';

let toggleNitter = document.querySelector('#toggle-nitter');
let instance = document.querySelector('#instance');
let addInstanceBtn = document.querySelector('#add-instance');
let instanceList = document.querySelector('#instance-list');
let version = document.querySelector('#version');
let statusMessage = document.querySelector('#status-message');
let customInstancesBlock = document.querySelector('#custom-instances-block');
let customInstanceList = document.querySelector('#custom-instance-list');

window.browser = window.browser || window.chrome;

// Default instances list
const defaultInstances = [
  "https://nitter.net", "https://nitter.privacydev.net", "https://nitter.it",
  "https://nitter.at", "https://nitter.perennialte.ch", "https://nitter.moomoo.me",
  "https://nitter.mint.lgbt", "https://nitter.projectsegfau.lt", "https://nitter.snopyta.org",
  "https://nitter.42l.fr", "https://nitter.nixnet.services", "https://nitter.13ad.de",
  "https://tw.openalgeria.org", "https://nitter.pussthecat.org", "https://nitter.mastodont.cat",
  "https://nitter.dark.fail", "https://nitter.tedomum.net", "https://t.maisputain.ovh",
  "https://nitter.cattube.org", "https://nitter.fdn.fr", "https://nitter.1d4.us",
  "https://nitter.kavin.rocks", "https://nitter.libre.cx"
];

function showStatus(message, type = 'success') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  setTimeout(() => {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
  }, 3000);
}

function renderCustomInstances(customInstances) {
  customInstanceList.innerHTML = '';
  if (customInstances && customInstances.length > 0) {
    customInstancesBlock.style.display = 'block';
    customInstances.forEach(url => {
      let li = document.createElement('li');
      let span = document.createElement('span');
      span.textContent = url;
      span.title = url;
      
      let removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '&times;';
      removeBtn.title = 'Remove';
      removeBtn.onclick = () => removeCustomInstance(url);
      
      li.appendChild(span);
      li.appendChild(removeBtn);
      customInstanceList.appendChild(li);
    });
  } else {
    customInstancesBlock.style.display = 'none';
  }
}

function updateDatalist(customInstances) {
  const allInstances = [...new Set([...defaultInstances, ...(customInstances || [])])];
  instanceList.innerHTML = '';
  allInstances.forEach(inst => {
    let option = document.createElement('option');
    option.value = inst;
    instanceList.appendChild(option);
  });
}

function removeCustomInstance(urlToRemove) {
  browser.storage.sync.get(['customInstances'], (result) => {
    let customInstances = result.customInstances || [];
    const newCustomInstances = customInstances.filter(url => url !== urlToRemove);
    browser.storage.sync.set({ customInstances: newCustomInstances }, () => {
      updateDatalist(newCustomInstances);
      renderCustomInstances(newCustomInstances);
      
      // If the current instance is the one being removed, revert to default
      if (instance.value === urlToRemove) {
        instance.value = defaultInstances[0];
        browser.storage.sync.set({ instance: defaultInstances[0] });
      }
    });
  });
}

browser.storage.sync.get(['nitterDisabled', 'instance', 'customInstances'], (result) => {
  toggleNitter.checked = !result.nitterDisabled;
  instance.value = result.instance || defaultInstances[0];
  updateDatalist(result.customInstances);
  renderCustomInstances(result.customInstances);
});

version.textContent = browser.runtime.getManifest().version;

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

let instanceChange = debounce(() => {
  if (instance.checkValidity()) {
    try {
      const url = instance.value ? new URL(instance.value).origin : '';
      browser.storage.sync.set({ instance: url });
    } catch (e) {
      // Invalid URL
    }
  }
}, 500);

instance.addEventListener('input', instanceChange);

toggleNitter.addEventListener('change', (event) => {
  browser.storage.sync.set({ nitterDisabled: !event.target.checked });
});

addInstanceBtn.addEventListener('click', () => {
  const newInstance = instance.value.trim();
  if (!newInstance) return;

  try {
    const urlObject = new URL(newInstance);
    const url = urlObject.origin;

    browser.storage.sync.get(['customInstances'], (result) => {
      let customInstances = result.customInstances || [];
      if (!customInstances.includes(url) && !defaultInstances.includes(url)) {
        customInstances.push(url);
        browser.storage.sync.set({ customInstances }, () => {
          updateDatalist(customInstances);
          renderCustomInstances(customInstances);
          instance.value = url;
          browser.storage.sync.set({ instance: url });
          showStatus('Instance added!', 'success');
        });
      } else if (customInstances.includes(url) || defaultInstances.includes(url)) {
        showStatus('Instance already exists.', 'error');
        // Still set it as active if it exists
        instance.value = url;
        browser.storage.sync.set({ instance: url });
      }
    });
  } catch (e) {
    showStatus('Invalid URL.', 'error');
  }
});