// Posts for Screen 32, the feed of creators a buyer follows. Every post is
// tied to a piece, so it can always be bought or saved from the post itself.

export type PostKind = "new-piece" | "making-of";

export type FeedPost = {
  id: string;
  creatorSlug: string;
  kind: PostKind;
  caption: string;
  productId: string;
  hoursAgo: number;
  /** Second photo; the piece's own tone fills the first. */
  secondTone?: string;
};

/** A post this recent counts as new in the "you follow" list. */
export const NEW_WITHIN_HOURS = 72;

export const posts: FeedPost[] = [
  {
    id: "p-yinka-indigo",
    creatorSlug: "yinka-adeyemi",
    kind: "new-piece",
    caption:
      "Third dip of the week. This batch is the deepest indigo I’ve had all year, and there are four kaftans left from it.",
    productId: "indigo-adire-kaftan",
    hoursAgo: 2,
  },
  {
    id: "p-fatima-wedding",
    creatorSlug: "fatima-bello-beads",
    kind: "new-piece",
    caption:
      "Wedding sets are open again. Each one is strung to your colours, so tell me the aso-ebi when you order.",
    productId: "coral-wedding-bead-set",
    hoursAgo: 5,
    secondTone: "bg-[#2E7C8A]",
  },
  {
    id: "p-kofi-loom",
    creatorSlug: "kofi-ampah-studio",
    kind: "making-of",
    caption:
      "Weaving the gold strip for the two-piece sets. Each strip takes about a day on the loom.",
    productId: "kente-trim-two-piece",
    hoursAgo: 26,
    secondTone: "bg-[#1F4E79]",
  },
  {
    id: "p-akosua-knit",
    creatorSlug: "akosua-mensah",
    kind: "new-piece",
    caption: "Ochre is back. Knitted over the weekend, ready to post on Monday.",
    productId: "two-piece-knit-set",
    hoursAgo: 30,
  },
  {
    id: "p-adirelab-drying",
    creatorSlug: "adire-lab-abeokuta",
    kind: "making-of",
    caption:
      "Drying day. The cushion covers come off the line tonight and are cut tomorrow.",
    productId: "adire-cushion-covers",
    hoursAgo: 50,
    secondTone: "bg-[#C9AE8E]",
  },
  {
    id: "p-yinka-cushions",
    creatorSlug: "yinka-adeyemi",
    kind: "new-piece",
    caption: "Offcuts from the kaftan run became three pairs of cushions.",
    productId: "adire-cushion-pair",
    hoursAgo: 54,
  },
  {
    id: "p-yinka-starch",
    creatorSlug: "yinka-adeyemi",
    kind: "making-of",
    caption:
      "Painting cassava starch on the wrap-dress panels before they go in the vat.",
    productId: "aso-oke-wrap-dress",
    hoursAgo: 70,
  },
  {
    id: "p-awa-batik",
    creatorSlug: "awa-diop",
    kind: "new-piece",
    caption: "First piece on FITS. Wax, dye, boil, repeat — four times for this one.",
    productId: "batik-wall-hanging",
    hoursAgo: 60,
  },
  {
    id: "p-adaeze-throw",
    creatorSlug: "adaeze-crochet",
    kind: "making-of",
    caption: "Joining the last row of squares. Ninety-six of them in this throw.",
    productId: "wool-throw",
    hoursAgo: 96,
  },
  {
    id: "p-fatima-strings",
    creatorSlug: "fatima-bello-beads",
    kind: "making-of",
    caption: "Measuring waist bead lengths for this week’s orders.",
    productId: "waist-beads",
    hoursAgo: 110,
  },
  {
    id: "p-wanjiru-tote",
    creatorSlug: "wanjiru-leather",
    kind: "new-piece",
    caption: "The tote in a darker tan, saddle-stitched like the first.",
    productId: "leather-tote",
    hoursAgo: 130,
  },
  {
    id: "p-kwame-soap",
    creatorSlug: "kwame-osei",
    kind: "making-of",
    caption: "Plantain skins drying in the sun for the next batch of black soap.",
    productId: "black-soap",
    hoursAgo: 150,
  },
];

/** "2 hours ago", "yesterday", "2 days ago" */
export function formatPostAge(hours: number) {
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
