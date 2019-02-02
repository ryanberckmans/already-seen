// SocialMediaEntry represents one unit of social media content, for example one reddit submission.
export interface SocialMediaEntry {
  key: string; // primary key of this Entry, eg. Reddit link URL
  elements: HTMLElement[]; // HTMLElements that minimally contains this entire Entry; these elements will be hidden to hide social media entries that have already been seen
}

export function setEntryHiddenOrShown(mode: "hide" | "show", e: SocialMediaEntry): void {
  // NB setting hide/show is idempotent instead of toggling, this could prevent weird behavior given a buggy SocialMediaSite
  e.elements.map((el) => el.hidden = mode === "hide");
}
