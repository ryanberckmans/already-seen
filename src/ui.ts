import jQueryGlobal from "jquery";
import { setEntryHiddenOrShown, SocialMediaEntry } from "./SocialMediaSite";

export function makeBasicButton(label: string, onClick: () => string|undefined): HTMLElement {
  const button = document.createElement('a');
  button.setAttribute('href', '#');
  button.innerHTML = label;
  jQueryGlobal(button).click(() => {
    const newLabel = onClick();
    if (newLabel !== undefined) {
      button.innerHTML = newLabel;
    }
    return false; // stop propagation to avoid reloading page
  });
  return button;
}

export function makeToggleHideShowButton(entriesOnPageAlreadySeen: SocialMediaEntry[]): HTMLElement {
  let nextAction: "hide" | "show" = "show";
  function toggleNextAction(): void {
    if (nextAction === "show") {
      nextAction = "hide";
    } else {
      nextAction = "show";
    }
  }
  const button = document.createElement('a');
  function setButtonText(): void {
    if (nextAction === "hide") {
      button.innerHTML = "<br/><br/>Hide links you've already seen on this page";
    } else {
      button.innerHTML = "<br/><br/>Show links you've already seen on this page";
    }
  }
  setButtonText();
  button.setAttribute('href', '#');
  jQueryGlobal(button).click(() => {
    entriesOnPageAlreadySeen.map(setEntryHiddenOrShown.bind(null, nextAction));
    toggleNextAction();
    setButtonText();
    return false; // stop propagation to avoid reloading page
  });
  return button;
}
