// TODO:
//   add a button to bottom of page to toggle hide/show of previously seen entries;
//   localStorage max is 10MB per origin, so may want to timestamp/ttl entries or clear them out every so often.

import jQueryGlobal from "jquery";

// Entry represents one social media link, for example one reddit submission.
interface SocialEntry {
  key: string; // primary key of this Entry, eg. Reddit link URL
  entry: HTMLElement; // HTMLElement that minimally contains this entire Entry, will be used to hide entries that have already been seen
}

interface SocialMediaSite {
  getEntriesForEntryKeys(entryKeys: Set<string>): SocialEntry[]; // get all Entries on the current page whose Entry.key is in the passed list of entryKeys
  getAllEntries(): SocialEntry[]; // get all Entries on the current page
  onNextPageOfEntries(runOnNextPage: () => void): void; // run the passed function when the user loads the next page of entries, prior to loading the next page of entries
}

// redditGetEntryKeyFromEntryElement gets an Entry.key from passed
// HTMLElement, which is assumed to be a well-formed Entry candidate.
function redditGetEntryKeyFromEntryElement(e: HTMLElement): string {
  // ie. primary key of a reddit entry is the link URL
  return (jQueryGlobal(e).find("a.title")[0] as HTMLAnchorElement).href;
}

function redditMakeEntry(entry: HTMLElement): SocialEntry {
  return {
    key: redditGetEntryKeyFromEntryElement(entry),
    entry,
  };
}

const redditEntrySelector = ".linklisting div.thing.link";

const reddit: SocialMediaSite = {
  getEntriesForEntryKeys(entryKeys: Set<string>): SocialEntry[] {
    return jQueryGlobal(redditEntrySelector).toArray()
      .filter((e: HTMLElement) => entryKeys.has(redditGetEntryKeyFromEntryElement(e)))
      .map(redditMakeEntry);
  },
  getAllEntries(): SocialEntry[] {
    return jQueryGlobal(redditEntrySelector).toArray().map(redditMakeEntry);
  },
  onNextPageOfEntries(runOnNextPage: () => void): void {
    jQueryGlobal(".next-button").click(runOnNextPage);
  },
};

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

jQueryGlobal.ready.then(() => onPageLoad(reddit));
