// Screen 30 — the role question, asked once, straight after sign-up.
// Both answers lead to the same account; the choice only decides where the
// person lands first and which setup they are offered.

export type RoleId = "buyer" | "creator";

export type RoleOption = {
  id: RoleId;
  title: string;
  description: string;
  benefits: string[];
  /** Button label once this card is chosen. */
  cta: string;
  /** Line under the button, which changes with the choice. */
  note: string;
  href: string;
  /** Tonal stand-in until the card photography lands. */
  tone: string;
};

export const roleOptions: RoleOption[] = [
  {
    id: "buyer",
    title: "I’m here to shop",
    description:
      "Browse makers, watch the feed, order made-to-measure pieces.",
    benefits: [
      "Saved pieces and measurements",
      "Progress photos while it’s made",
      "Money held until it arrives",
    ],
    cta: "Start shopping",
    note: "Not sure? Pick shopping — “Become a Creator” is always in your menu.",
    href: "/shop",
    tone: "bg-[#6E2434]",
  },
  {
    id: "creator",
    title: "I make and sell",
    description:
      "Open a storefront, post how your work is made, get paid safely.",
    benefits: [
      "No listing fees — commission on sales",
      "Verified badge gets you seen more",
      "You can still shop with this login",
    ],
    cta: "Continue to creator setup",
    note: "About 6 minutes. You can browse and shop while you set up.",
    // Screen 17 (/studio/register) is the real destination once the creator
    // track is built; until then this lands on the existing creator page.
    href: "/creators",
    tone: "bg-[#C9AE8E]",
  },
];

/** Shown while nothing is chosen yet. */
export const unchosen = {
  cta: "Choose one to continue",
  note: roleOptions[0].note,
};
