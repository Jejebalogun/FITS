// Content for Screen 4, the creator storefront: what each creator writes about
// their work, and what buyers wrote back. Kept apart from the catalogue because
// a real build would load it per shop, not with every product list.

export type Story = {
  quote: string;
  body: string;
  /** Three figures the creator chooses to lead with. */
  facts: { value: string; label: string }[];
};

export type Review = {
  id: string;
  creatorSlug: string;
  productId: string;
  /** First name and initial, as buyers choose to show it. */
  author: string;
  city: string;
  stars: number;
  text: string;
  daysAgo: number;
};

export const stories: Record<string, Story> = {
  "yinka-adeyemi": {
    quote:
      "My grandmother dyed with indigo in the same compound where I work now. I still grind the leaves by hand.",
    body: "Yinka works from Ilorin with three apprentices. Each adire piece is tied or starch-resisted by hand, dyed over four days, and cut to order. Aso-oke is woven on a narrow loom by a cousin in Iseyin.",
    facts: [
      { value: "2011", label: "making since" },
      { value: "4 days", label: "to dye one piece" },
      { value: "1,480", label: "orders delivered" },
    ],
  },
  "fatima-bello-beads": {
    quote:
      "A bridal collar is planned on paper before a single bead is cut. My mother taught me that.",
    body: "Fatima strings wedding and waist beads in Kano with four women who trained in the workshop. Every length is measured to the wearer, so waist beads are made after you order, never before.",
    facts: [
      { value: "26 years", label: "stringing beads" },
      { value: "4", label: "makers in the workshop" },
      { value: "2,310", label: "orders delivered" },
    ],
  },
  "kofi-ampah-studio": {
    quote:
      "Each adinkra symbol is a proverb. We print the ones people still say out loud.",
    body: "The studio in Kumasi stamps adinkra by hand with calabash blocks and trims ready-to-wear pieces with strip-woven kente from Bonwire.",
    facts: [
      { value: "2016", label: "studio opened" },
      { value: "40+", label: "hand-cut stamps" },
      { value: "960", label: "orders delivered" },
    ],
  },
};

export const reviews: Review[] = [
  {
    id: "r-yinka-1",
    creatorSlug: "yinka-adeyemi",
    productId: "indigo-adire-kaftan",
    author: "Chiamaka O.",
    city: "London",
    stars: 5,
    text: "The dye is deeper than the photos. Arrived in 15 days, a day earlier than promised, and it fit exactly to my measurements.",
    daysAgo: 14,
  },
  {
    id: "r-yinka-2",
    creatorSlug: "yinka-adeyemi",
    productId: "aso-oke-wrap-dress",
    author: "Tolu A.",
    city: "Manchester",
    stars: 5,
    text: "Wore it to my cousin’s wedding. Yinka sent a progress photo halfway, which made the wait easy.",
    daysAgo: 33,
  },
  {
    id: "r-yinka-3",
    creatorSlug: "yinka-adeyemi",
    productId: "adire-cushion-pair",
    author: "Grace M.",
    city: "Leeds",
    stars: 4,
    text: "Beautiful, but postage took 20 days. Worth it.",
    daysAgo: 38,
  },
  {
    id: "r-fatima-1",
    creatorSlug: "fatima-bello-beads",
    productId: "waist-beads",
    author: "Adaora N.",
    city: "Houston",
    stars: 5,
    text: "Measured to the centimetre. The clasp is the strongest I have owned.",
    daysAgo: 9,
  },
  {
    id: "r-fatima-2",
    creatorSlug: "fatima-bello-beads",
    productId: "brass-bead-cuff",
    author: "Efua K.",
    city: "Accra",
    stars: 5,
    text: "Heavier than I expected, in a good way. Came wrapped in fabric I have kept.",
    daysAgo: 27,
  },
  {
    id: "r-kofi-1",
    creatorSlug: "kofi-ampah-studio",
    productId: "kente-trim-two-piece",
    author: "Marcus B.",
    city: "Birmingham",
    stars: 5,
    text: "Shipped the day after I ordered. The kente trim is properly woven, not printed.",
    daysAgo: 6,
  },
  {
    id: "r-kofi-2",
    creatorSlug: "kofi-ampah-studio",
    productId: "adinkra-print-shirt",
    author: "Ama S.",
    city: "Toronto",
    stars: 4,
    text: "Lovely print. Runs a little large, so size down.",
    daysAgo: 45,
  },
  {
    id: "r-wanjiru-1",
    creatorSlug: "wanjiru-leather",
    productId: "leather-tote",
    author: "Hannah W.",
    city: "Bristol",
    stars: 5,
    text: "The stitching is even all the way round. Smells like real leather because it is.",
    daysAgo: 12,
  },
  {
    id: "r-adaeze-1",
    creatorSlug: "adaeze-crochet",
    productId: "wool-throw",
    author: "Ngozi E.",
    city: "Lagos",
    stars: 5,
    text: "Adaeze asked which colours were in my living room before starting. It matches perfectly.",
    daysAgo: 20,
  },
  {
    id: "r-akosua-1",
    creatorSlug: "akosua-mensah",
    productId: "bolga-basket",
    author: "Leah P.",
    city: "New York",
    stars: 5,
    text: "Sturdy enough for the market every week. Handles wrapped in leather, as shown.",
    daysAgo: 18,
  },
  {
    id: "r-adirelab-1",
    creatorSlug: "adire-lab-abeokuta",
    productId: "adire-fabric-yard",
    author: "Bisi F.",
    city: "London",
    stars: 5,
    text: "Bought four yards for a dress. Colourfast after three washes.",
    daysAgo: 25,
  },
  {
    id: "r-kwame-1",
    creatorSlug: "kwame-osei",
    productId: "black-soap",
    author: "Kojo D.",
    city: "Kumasi",
    stars: 4,
    text: "Good soap, plain packaging. Arrived in a week.",
    daysAgo: 31,
  },
];

/**
 * Per-dimension averages for the reviews tab. Like the rating counts, these
 * are the full shop's figures, not computed from the handful of reviews above.
 */
export const ratingBreakdowns: Record<string, { label: string; score: number }[]> = {
  "yinka-adeyemi": [
    { label: "As described", score: 4.9 },
    { label: "Fit", score: 4.6 },
    { label: "On time", score: 4.7 },
    { label: "Communication", score: 4.9 },
  ],
};

export function reviewsFor(slug: string) {
  return reviews
    .filter((review) => review.creatorSlug === slug)
    .sort((a, b) => a.daysAgo - b.daysAgo);
}

/** "2 weeks ago", "1 month ago" */
export function formatAgo(days: number) {
  if (days < 1) return "today";
  if (days < 7) return days === 1 ? "yesterday" : `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}
