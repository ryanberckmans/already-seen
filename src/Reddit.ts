import jQueryGlobal from "jquery";
import { SocialMediaEntry, SocialMediaSite } from "./SocialMediaSite";

// redditGetEntryKeyFromEntryElement gets an Entry.key from passed
// HTMLElement, which is assumed to be a well-formed Entry candidate.
function redditGetEntryKeyFromEntryElement(e: HTMLElement): string {
  // ie. primary key of a reddit entry is the link URL
  return (jQueryGlobal(e).find("a.title")[0] as HTMLAnchorElement).href;
}

function redditMakeEntry(element: HTMLElement): SocialMediaEntry {
  return {
    key: redditGetEntryKeyFromEntryElement(element),
    elements: [element],
  };
}

const redditEntrySelector = ".linklisting div.thing.link";

const Reddit: SocialMediaSite = {
  getEntriesForEntryKeys(entryKeys: Set<string>): SocialMediaEntry[] {
    return jQueryGlobal(redditEntrySelector).toArray()
      .filter((e: HTMLElement) => entryKeys.has(redditGetEntryKeyFromEntryElement(e)))
      .map(redditMakeEntry);
  },
  getAllEntries(): SocialMediaEntry[] {
    return jQueryGlobal(redditEntrySelector).toArray().map(redditMakeEntry);
  },
  onNextPageOfEntries(runOnNextPage: () => void): void {
    jQueryGlobal(".next-button").click(runOnNextPage);
  },
};

export default Reddit;
