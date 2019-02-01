// TODO:
//   add buttons to top/bottom of page to toggle hide/show of previously seen entries
//   add a button to bottom of page to "mark all as seen" without having to click next
//   localStorage max is 10MB per origin, so may want to timestamp/ttl entries or clear them out every so often. Current proposal: lifo, store last seen timestamp with key, merge keys/timestamps to keep latest timestamp, evict oldest keys when saving if number of keys exceeds hardcoded amount, like maybe 3000 keys.
//   add preferences to allow user to hide/show the already-seen UI elements
//   Move these TODOs into github issues

import jQueryGlobal from "jquery";
import HackerNews from "./HackerNews";
import Reddit from "./Reddit";
import { SocialMediaEntry, SocialMediaSite } from "./SocialMediaSite";

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

function setEntryHiddenOrShown(mode: "hide" | "show", e: SocialMediaEntry): void {
  // NB setting hide/show is idempotent instead of toggling, this could prevent weird behavior given a buggy SocialMediaSite
  e.elements.map((el) => el.hidden = mode === "hide");
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
  } else if (origin === "https://news.ycombinator.com") {
    return HackerNews;
  }
}

function run() {
  const socialMediaSite = getSocialMediaSiteFromOrigin(window.location.origin);
  if (socialMediaSite) {
    onPageLoad(socialMediaSite);
  }
}

jQueryGlobal.ready.then(run);
