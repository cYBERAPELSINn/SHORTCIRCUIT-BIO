import '@material/web/all.js';
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
import {argbFromHex, themeFromSourceColor, applyTheme} from '@material/material-color-utilities';

document.adoptedStyleSheets = [...document.adoptedStyleSheets, typescaleStyles.styleSheet];

const theme = themeFromSourceColor(argbFromHex('#6f5cff'));
applyTheme(theme, {target: document.body, dark: false});

const tabsElement = document.getElementById('section-tabs');
const tabs = Array.from(document.querySelectorAll('md-primary-tab'));
const panels = Array.from(document.querySelectorAll('.tab-panel'));
const fab = document.getElementById('contact-fab');

const panelIdByHash = {
  overview: 'overview-panel',
  aliases: 'aliases-panel',
  project: 'project-panel',
  contacts: 'contacts-panel'
};

const hashByPanelId = Object.fromEntries(
  Object.entries(panelIdByHash).map(([hash, panelId]) => [panelId, hash])
);

function activatePanel(panelId, {updateHash = true} = {}) {
  tabs.forEach((tab) => {
    const isActive = tab.getAttribute('aria-controls') === panelId;
    if (isActive) {
      tab.setAttribute('active', '');
    } else {
      tab.removeAttribute('active');
    }
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== panelId;
  });

  if (updateHash) {
    const nextHash = hashByPanelId[panelId];
    if (nextHash) {
      history.replaceState(null, '', `#${nextHash}`);
    }
  }
}

function panelIdFromHash(hash) {
  return panelIdByHash[hash.replace(/^#/, '')] || 'overview-panel';
}

await customElements.whenDefined('md-tabs');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activatePanel(tab.getAttribute('aria-controls'));
  });
});

tabsElement.addEventListener('change', () => {
  const activeTab =
    tabs.find((tab) => tab.hasAttribute('active')) ??
    tabs[tabsElement.activeTabIndex] ??
    tabs[0];

  if (activeTab) {
    activatePanel(activeTab.getAttribute('aria-controls'));
  }
});

window.addEventListener('hashchange', () => {
  activatePanel(panelIdFromHash(window.location.hash), {updateHash: false});
});

activatePanel(panelIdFromHash(window.location.hash), {updateHash: false});

fab.addEventListener('click', () => {
  window.open('https://t.me/short_circu1T', '_blank', 'noopener,noreferrer');
});

const copyControls = Array.from(document.querySelectorAll('[data-copy]'));

copyControls.forEach((control) => {
  const labelNode = control.querySelector('[data-copy-label]');
  const defaultLabel = labelNode ? labelNode.textContent : '';

  control.addEventListener('click', async () => {
    const value = control.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
      control.classList.add('is-copied');
      if (labelNode) {
        labelNode.textContent = 'Copied';
      }
    } catch {
      if (labelNode) {
        labelNode.textContent = 'Copy failed';
      }
    }

    window.setTimeout(() => {
      control.classList.remove('is-copied');
      if (labelNode) {
        labelNode.textContent = defaultLabel;
      }
    }, 1400);
  });
});
