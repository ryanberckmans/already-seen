// SocialMediaEntry represents one unit of social media content, for example one reddit submission.
export interface SocialMediaEntry {
  key: string; // primary key of this Entry, eg. Reddit link URL
  elements: HTMLElement[]; // HTMLElements that minimally contains this entire Entry; these elements will be hidden to hide social media entries that have already been seen
}

// SocialMediaSite is implemented once per site supported by this
// script; this is the single interface that must be implemented to
// make this script work on a new site; to add a new site it's also
// necessary to update `getSocialMediaSiteFromOrigin()`, which picks
// a SocialMediaSite implementation based on site user is browsing.
export interface SocialMediaSite {
  getEntriesForEntryKeys(entryKeys: Set<string>): SocialMediaEntry[]; // get all Entries on the current page whose Entry.key is in the passed list of entryKeys
  getAllEntries(): SocialMediaEntry[]; // get all Entries on the current page
  onNextPageOfEntries(runOnNextPage: () => void): void; // run the passed function when the user loads the next page of entries, prior to loading the next page of entries
  getUIMountPointElement(): HTMLElement | undefined; // get an Element suitable to be a mount point for already-seen UI controls
}

export function setEntryHiddenOrShown(mode: "hide" | "show", e: SocialMediaEntry): void {
  // NB setting hide/show is idempotent instead of toggling, this could prevent weird behavior given a buggy SocialMediaSite
  e.elements.map((el) => el.hidden = mode === "hide");
}
