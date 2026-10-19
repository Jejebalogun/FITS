import {
  categories,
  creatorOf,
  creators,
  getCategory,
  products,
  type Creator,
  type Product,
} from "@/data/marketplace";

// Local stand-in for the search backend. Matching is word-prefix and every
// query word must match, so "velvet agbada" finds nothing rather than every
// agbada. Typo tolerance only kicks in when the literal query finds nothing.

/** "Aso-oke" and "aso oke" are the same search. */
export function tokenize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Where a word was found, weighted so a hit in the name outranks a hit in the craft. */
const FIELD_WEIGHTS = {
  name: 4,
  type: 3,
  craft: 2,
  creator: 2,
  category: 1,
  country: 1,
} as const;

type Field = keyof typeof FIELD_WEIGHTS;

function productFields(product: Product): Record<Field, string[]> {
  const creator = creatorOf(product);
  return {
    name: tokenize(product.name),
    type: tokenize(product.type),
    craft: tokenize(creator.craft),
    creator: tokenize(product.creator),
    category: tokenize(getCategory(product.category)?.name ?? ""),
    country: tokenize(product.country),
  };
}

function scoreProduct(product: Product, words: string[]) {
  const fields = productFields(product);
  let score = 0;
  for (const word of words) {
    let best = 0;
    for (const field of Object.keys(fields) as Field[]) {
      if (fields[field].some((token) => token.startsWith(word))) {
        best = Math.max(best, FIELD_WEIGHTS[field]);
      }
    }
    // Every word has to land somewhere.
    if (best === 0) return 0;
    score += best;
  }
  return score;
}

/** Matching pieces, best first. */
export function searchProducts(query: string) {
  const words = tokenize(query);
  if (words.length === 0) return [];

  return products
    .map((product) => ({ product, score: scoreProduct(product, words) }))
    .filter((hit) => hit.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.product.rating * b.product.reviews - a.product.rating * a.product.reviews,
    )
    .map((hit) => hit.product);
}

function creatorMatches(creator: Creator, words: string[]) {
  const tokens = [
    ...tokenize(creator.name),
    ...tokenize(creator.craft),
    ...tokenize(creator.city),
    ...tokenize(creator.country),
  ];
  return words.every((word) => tokens.some((token) => token.startsWith(word)));
}

/**
 * Creators who work with the query: matched by name or craft, or because one
 * of their pieces matched. Pieces are passed in so filters carry over.
 */
export function searchCreators(query: string, matchedProducts: Product[]) {
  const words = tokenize(query);
  if (words.length === 0) return [];

  const viaPieces = new Set(matchedProducts.map((product) => product.creator));
  return creators
    .filter(
      (creator) => viaPieces.has(creator.name) || creatorMatches(creator, words),
    )
    .sort(
      (a, b) =>
        Number(creatorMatches(b, words)) - Number(creatorMatches(a, words)) ||
        b.followers - a.followers,
    );
}

// --- Typo tolerance ---------------------------------------------------------

/** Optimal string alignment distance, so "adrie" is one step from "adire". */
function editDistance(a: string, b: string) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) d[i][0] = i;
  for (let j = 0; j < cols; j += 1) d[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

let vocabulary: string[] | null = null;

function getVocabulary() {
  if (!vocabulary) {
    const words = new Set<string>();
    for (const product of products) {
      Object.values(productFields(product)).flat().forEach((w) => words.add(w));
    }
    for (const creator of creators) {
      tokenize(`${creator.name} ${creator.craft} ${creator.city}`).forEach((w) =>
        words.add(w),
      );
    }
    vocabulary = Array.from(words).filter((word) => word.length >= 3);
  }
  return vocabulary;
}

/**
 * The query with each unmatched word swapped for the nearest catalogue word,
 * or null when there is nothing close enough to be a confident guess.
 */
export function correctQuery(query: string): string | null {
  const words = tokenize(query);
  if (words.length === 0) return null;

  const vocab = getVocabulary();
  let changed = false;

  const corrected = words.map((word) => {
    if (vocab.some((token) => token.startsWith(word))) return word;
    const allowed = word.length <= 4 ? 1 : 2;
    let best: { word: string; distance: number } | null = null;
    for (const token of vocab) {
      const distance = editDistance(word, token);
      if (distance <= allowed && (!best || distance < best.distance)) {
        best = { word: token, distance };
      }
    }
    if (!best) return word;
    changed = true;
    return best.word;
  });

  if (!changed) return null;
  const next = corrected.join(" ");
  return searchProducts(next).length > 0 ? next : null;
}

// --- Suggestions ------------------------------------------------------------

export type PhraseSuggestion = { phrase: string; where: string };

/**
 * Search phrases taken from piece names, starting at the word being typed:
 * "adi" offers "adire kaftan" from "Indigo adire kaftan".
 */
export function suggestPhrases(query: string, limit = 3): PhraseSuggestion[] {
  const words = tokenize(query);
  if (words.length === 0) return [];
  const last = words[words.length - 1];
  const leading = words.slice(0, -1);

  const seen = new Set<string>();
  const out: PhraseSuggestion[] = [];

  for (const product of searchProducts(query)) {
    const nameTokens = tokenize(product.name);
    const start = nameTokens.findIndex((token) => token.startsWith(last));
    if (start === -1) continue;

    const phrase = [...leading, ...nameTokens.slice(start)].join(" ");
    if (seen.has(phrase)) continue;
    seen.add(phrase);

    const category = getCategory(product.category);
    out.push({
      phrase,
      where: category?.shortName ?? category?.name ?? "",
    });
    if (out.length === limit) break;
  }
  return out;
}

/**
 * For a search that found nothing: the words that do find something, then
 * what people search for in the craft those words belong to.
 */
export function alternativesFor(query: string) {
  const words = Array.from(new Set(tokenize(query)));
  const working = words.filter((word) => searchProducts(word).length > 0);

  const lead = working[0] ? searchProducts(working[0])[0] : undefined;
  const category = lead ? getCategory(lead.category) : undefined;

  const related = (category ? popularSearches[category.slug] ?? [] : []).filter(
    (term) => !words.includes(term) && searchProducts(term).length > 0,
  );

  return {
    /** The single word most worth searching instead, if any. */
    best: working[0] ?? null,
    terms: Array.from(new Set([...working, ...related])).slice(0, 4),
    category: category ?? categories.find((item) => item.slug === "new-in")!,
  };
}

/** What buyers search for in each craft. Editorial, like the homepage trays. */
const popularSearches: Partial<Record<string, string[]>> = {
  fashion: ["aso-oke", "embroidered agbada", "adire", "kente"],
  "beadwork-jewellery": ["waist beads", "cowrie", "brass cuff"],
  bags: ["leather tote", "raffia"],
  footwear: ["leather sandals", "mule"],
  "home-living": ["mudcloth", "crochet throw", "bolga basket"],
  beauty: ["shea butter", "black soap"],
  art: ["raffia wall", "carved figure"],
};
