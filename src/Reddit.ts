import jQueryGlobal from "jquery";
import { SocialMediaEntry, SocialMediaSite } from "./SocialMediaSite";

// getEntryKeyFromEntryElement gets an Entry.key from passed
// HTMLElement, which is assumed to be a well-formed Entry candidate.
function getEntryKeyFromEntryElement(e: HTMLElement): string {
  // ie. primary key of a reddit entry is the link URL
  return (jQueryGlobal(e).find("a.title")[0] as HTMLAnchorElement).href;
}

function makeEntry(element: HTMLElement): SocialMediaEntry {
  return {
    key: getEntryKeyFromEntryElement(element),
    elements: [element],
  };
}

const entrySelector = ".linklisting div.thing.link[data-context=listing]";

const Reddit: SocialMediaSite = {
  getEntriesForEntryKeys(entryKeys: Set<string>): SocialMediaEntry[] {
    return jQueryGlobal(entrySelector).toArray()
      .filter((e: HTMLElement) => entryKeys.has(getEntryKeyFromEntryElement(e)))
      .map(makeEntry);
  },
  getAllEntries(): SocialMediaEntry[] {
    return jQueryGlobal(entrySelector).toArray().map(makeEntry);
  },
  onNextPageOfEntries(runOnNextPage: () => void): void {
    jQueryGlobal(".next-button").click(runOnNextPage);
  },
  getUIMountPointElement(): HTMLElement | undefined {
    return jQueryGlobal(".linklisting .nav-buttons")[0];
  },
};

export default Reddit;
