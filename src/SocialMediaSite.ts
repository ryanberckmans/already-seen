// Entry represents one social media link, for example one reddit submission.
export interface SocialEntry {
  key: string; // primary key of this Entry, eg. Reddit link URL
  entry: HTMLElement; // HTMLElement that minimally contains this entire Entry, will be used to hide entries that have already been seen
}

export interface SocialMediaSite {
  getEntriesForEntryKeys(entryKeys: Set<string>): SocialEntry[]; // get all Entries on the current page whose Entry.key is in the passed list of entryKeys
  getAllEntries(): SocialEntry[]; // get all Entries on the current page
  onNextPageOfEntries(runOnNextPage: () => void): void; // run the passed function when the user loads the next page of entries, prior to loading the next page of entries
}
