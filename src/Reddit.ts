import jQueryGlobal from "jquery";
import { SocialEntry, SocialMediaSite } from "./SocialMediaSite";

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

const Reddit: SocialMediaSite = {
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

export default Reddit;
