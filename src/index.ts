import jQueryGlobal from "jquery";
import HackerNews from "./HackerNews";
import Reddit from "./Reddit";
import { setEntryHiddenOrShown } from "./SocialMediaEntry";
import { SocialMediaSite } from "./SocialMediaSite";
import { makeBasicButton, makeToggleHideShowButton } from "./ui";

const localStorageGlobalKey = "__seen_entries";

function loadEntryKeysAlreadySeen(): string[] {
  const entriesJson = window.localStorage.getItem(localStorageGlobalKey);
  if (entriesJson) {
    return JSON.parse(entriesJson) as string[];
  }
  return [];
}

function saveEntryKeysAlreadySeen(entryKeys: string[]): void {
  try {
    window.localStorage.setItem(localStorageGlobalKey, JSON.stringify(entryKeys));
  } catch (e) {
    // To test this algorithm, I opened devtools and did `localStorage.setItem('d', new Array(5229000));`, and then used always-seen normally to trigger a quota error. Example of recovery: https://imgur.com/a/G1cx8Gl
    if (e instanceof Object && typeof e.name === "string") {
      const errName: string = e.name;
      if (errName.toLowerCase().indexOf("quota") > -1) {
        console.error(e);
        const smallerEntryKeys = entryKeys.slice(Math.ceil(entryKeys.length) / 4); // Math.ceil() ensures this recursive algorithm terminates; removing entries earlier in list is, incidentally, approximately last-seen-first-removed, because currently new entries are appended to end of the list.
        if (smallerEntryKeys.length < 1) {
          console.error('already-seen: localStorage quota exceeded, unable to save');
          return;
        }
        console.log(`already-seen: localStorage quota exceeded, removing entries and attempting to re-save. Size of entries: ${entryKeys.length}. Size after removals: ${smallerEntryKeys.length}`);
        return saveEntryKeysAlreadySeen(smallerEntryKeys);
      }
    }
    throw e;
  }
}

function onPageLoad(site: SocialMediaSite): void {
  const allEntriesOnPage = site.getAllEntries();
  const entryKeysAlreadySeen = loadEntryKeysAlreadySeen();
  const entriesOnPageAlreadySeen = site.getEntriesForEntryKeys(new Set(entryKeysAlreadySeen));

  entriesOnPageAlreadySeen.map(setEntryHiddenOrShown.bind(null, "hide"));
  console.log("already-seen: hid ", entriesOnPageAlreadySeen.length, "of", allEntriesOnPage.length);

  const entryKeysAlreadySeenIncludingNewOnesOnThisPage = Array.from(new Set(entryKeysAlreadySeen.concat(allEntriesOnPage.map((e) => e.key))));

  const uiMountPoint = site.getUIMountPointElement();
  if (uiMountPoint !== undefined && allEntriesOnPage.length > entriesOnPageAlreadySeen.length) { // no need to show "I've seen all the links on this page" button if all links were previously seen and are already hidden
    uiMountPoint.appendChild(makeBasicButton("<br/><br/>I've seen all the links on this page", () => {
      saveEntryKeysAlreadySeen(entryKeysAlreadySeenIncludingNewOnesOnThisPage);
      return "<br/><br/>I've seen all the links on this page (done, hidden next refresh; instead of clicking this you can also just click next page)";
    }));
  }
  if (uiMountPoint !== undefined && entriesOnPageAlreadySeen.length > 0) { // no need to show "toggle hide/show" button if there's no previously seen entries
    uiMountPoint.appendChild(makeToggleHideShowButton(entriesOnPageAlreadySeen));
  }

  // The idea here is to save entries (and thus mark them as having been seen)
  // if the user clicks the "next page" button. This prevents entries from being
  // marked as seen without actually being seen, eg. if you load reddit homepage
  // and close it immediately, we don't want to mark things as having been seen.
  site.onNextPageOfEntries(() => saveEntryKeysAlreadySeen(entryKeysAlreadySeenIncludingNewOnesOnThisPage));
}

function getSocialMediaSiteFromOrigin(origin: string): SocialMediaSite | undefined {
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
