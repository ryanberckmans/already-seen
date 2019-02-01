import jQueryGlobal from "jquery";
import { SocialMediaEntry, SocialMediaSite } from "./SocialMediaSite";

// SocialMediaEntries on Hacker News are a triplet of (title row, points, row, spacer row), with no single DOM element containing the entry. But we may fail to find sibling nodes and provide single/pair types to degrade gracefully.
type EntryElements = [HTMLElement] | [HTMLElement, HTMLElement] | [HTMLElement, HTMLElement, HTMLElement];

// getEntryKeyFromEntryElements gets an Entry.key from passed
// HTMLElement, which is assumed to be a well-formed Entry candidate.
function getEntryKeyFromEntryElements(e: EntryElements): string {
  // ie. primary key of a hn entry is the link URL
  return (jQueryGlobal(e[0]).find(".title a")[0] as HTMLAnchorElement).href;
}

function makeEntry(elements: EntryElements): SocialMediaEntry {
  return {
    key: getEntryKeyFromEntryElements(elements),
    elements,
  };
}

function getAllEntriesElements(): EntryElements[] {
  return jQueryGlobal(".itemlist .athing").toArray().map((firstOfTriplet: HTMLElement): EntryElements => {
    if (!(firstOfTriplet.nextElementSibling instanceof HTMLElement)) {
      // failed to match sibling; degrade gracefully by assuming firstOfTriplet comprises the entire entry
      return [firstOfTriplet];
    } else if (!(firstOfTriplet.nextElementSibling.nextElementSibling instanceof HTMLElement)) {
      // failed to match sibling's sibling; degrade gracefully by assuming [firstOfTriplet, sibling] comprises the entire entry
      return [firstOfTriplet, firstOfTriplet.nextElementSibling];
    }
    return [firstOfTriplet, firstOfTriplet.nextElementSibling, firstOfTriplet.nextElementSibling.nextElementSibling];
  });
}

const HackerNews: SocialMediaSite = {
  getEntriesForEntryKeys(entryKeys: Set<string>): SocialMediaEntry[] {
    return getAllEntriesElements()
      .filter((es: EntryElements) => entryKeys.has(getEntryKeyFromEntryElements(es)))
      .map(makeEntry);
  },
  getAllEntries(): SocialMediaEntry[] {
    return getAllEntriesElements().map(makeEntry);
  },
  onNextPageOfEntries(runOnNextPage: () => void): void {
    jQueryGlobal(".morelink").click(runOnNextPage);
  },
};

export default HackerNews;
