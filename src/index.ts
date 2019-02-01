// TODO:
//   add a button to bottom of page to toggle hide/show of previously seen entries;
//   localStorage max is 10MB per origin, so may want to timestamp/ttl entries or clear them out every so often.

import jQueryGlobal from "jquery";
import Reddit from "./Reddit";
import { SocialEntry, SocialMediaSite } from "./SocialMediaSite";

const localStorageGlobalKey = "__seen_entries";

function loadEntryKeysAlreadySeen(): string[] {
  const entriesJson = window.localStorage.getItem(localStorageGlobalKey);
  if (entriesJson) {
    return JSON.parse(entriesJson) as string[];
  }
  return [];
}

function saveEntryKeysAlreadySeen(entryKeys: string[]): void {
  window.localStorage.setItem(localStorageGlobalKey, JSON.stringify(entryKeys));
}

function setEntryHiddenOrShown(mode: "hide" | "show", e: SocialEntry): void {
  e.entry.hidden = mode === "hide";
}

function onPageLoad(site: SocialMediaSite): void {
  const allEntriesOnPage = site.getAllEntries();
  const entryKeysAlreadySeen = loadEntryKeysAlreadySeen();
  const entriesOnPageAlreadySeen = site.getEntriesForEntryKeys(new Set(entryKeysAlreadySeen));

  entriesOnPageAlreadySeen.map(setEntryHiddenOrShown.bind(null, "hide"));

  console.log("already-seen: hid ", entriesOnPageAlreadySeen.length, "of", allEntriesOnPage.length);

  const entryKeysAlreadySeenIncludingNewOnesOnThisPage = Array.from(new Set(entryKeysAlreadySeen.concat(allEntriesOnPage.map((e) => e.key))));

  // The idea here is to save entries (and thus mark them as having been seen)
  // iff the user clicks the "next page" button. This prevents entries from being
  // marked as seen without actually being seen, eg. if you load reddit homepage
  // and close it immediately, we don't want to mark things as having been seen.
  site.onNextPageOfEntries(() => saveEntryKeysAlreadySeen(entryKeysAlreadySeenIncludingNewOnesOnThisPage));
}

function getSocialMediaSiteFromOrigin(origin: string): SocialMediaSite|undefined {
  if (origin === "https://www.reddit.com") {
    return Reddit;
  }
}

function run() {
  const socialMediaSite = getSocialMediaSiteFromOrigin(window.location.origin);
  if (socialMediaSite) {
    onPageLoad(socialMediaSite);
  }
}

jQueryGlobal.ready.then(run);
