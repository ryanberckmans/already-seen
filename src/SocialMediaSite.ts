import { SocialMediaEntry } from "./SocialMediaEntry";

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
