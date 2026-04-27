const tabs = Array.from(document.querySelectorAll("[data-tab-target]"));
const panels = Array.from(document.querySelectorAll(".tab-panel"));

function setActiveTab(targetId) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tabTarget === targetId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.id === targetId;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab.dataset.tabTarget);
  });

  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    tabs[nextIndex].focus();
    setActiveTab(tabs[nextIndex].dataset.tabTarget);
  });
});

setActiveTab("overview-panel");

const copyControls = Array.from(document.querySelectorAll("[data-copy]"));

copyControls.forEach((control) => {
  const labelNode = control.querySelector("[data-copy-label]");
  const defaultLabel = labelNode ? labelNode.textContent : "";

  control.addEventListener("click", async () => {
    const value = control.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
      control.classList.add("is-copied");
      if (labelNode) {
        labelNode.textContent = "copied";
      }
    } catch {
      if (labelNode) {
        labelNode.textContent = "copy failed";
      }
    }

    window.setTimeout(() => {
      control.classList.remove("is-copied");
      if (labelNode) {
        labelNode.textContent = defaultLabel;
      }
    }, 1400);
  });
});
