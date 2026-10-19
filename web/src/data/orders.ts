import type { CartLine } from "@/components/marketplace/ShopperProvider";
import type { DayWindow } from "@/lib/delivery";

// Screens 11 and 13: what has happened to each parcel of an order. Times are
// held relative to the day the order was placed, so the mock history stays
// believable whatever today's date is.

/** A moment, counted in days from the day the order was placed. */
export type Stamp = { day: number; time?: string };

export type MakerUpdate = { at: Stamp; text: string; tones: string[] };
export type TrackingEvent = { at: Stamp; text: string };
export type Review = { stars: number; text: string };

export type Milestones = {
  accepted?: Stamp;
  /** Made, for a made-to-order piece; packed, for a ready one. */
  done?: Stamp;
  shipped?: Stamp;
  delivered?: Stamp;
};

/** Where one creator's parcel has got to. */
export type Stage = { milestones: Milestones } & (
  | { kind: "confirming" }
  | { kind: "packing"; pickup: { at: Stamp; window: string } }
  | {
      kind: "making";
      updates: MakerUpdate[];
      /** Set once the buyer has agreed to a later date. */
      newWindow?: DayWindow;
    }
  | {
      kind: "late";
      updates: MakerUpdate[];
      noticeAt: Stamp;
      reason: string;
      newWindow: DayWindow;
    }
  | { kind: "shipped"; tracking: string; events: TrackingEvent[]; eta: Stamp }
  | { kind: "delivered" }
  | { kind: "problem"; reason: string; at: Stamp }
  | { kind: "confirmed"; confirmedAt: Stamp; review?: Review }
  /** No message means the creator did not reply within 48 hours. */
  | { kind: "declined"; at: Stamp; message?: string }
  | { kind: "cancelled"; at: Stamp }
);

export type DemoOrder = {
  id: string;
  placedDaysAgo: number;
  placedTime: string;
  lines: Omit<CartLine, "key">[];
  /** Keyed by creator slug — one parcel per creator. */
  stages: Record<string, Stage>;
};

/** The mock account whose purchase history is filled in. */
export const DEMO_ORDER_EMAIL = "amara.obi@gmail.com";

export const demoAddress = {
  name: "Amara Okafor",
  address: "14 Elm Grove, Peckham, London SE15 5DE",
  paidWith: "Visa ending 4417",
};

const MEASURED = { unit: "in", bust: "38", waist: "32", hips: "42", length: "54" } as const;

export const demoOrders: DemoOrder[] = [
  {
    id: "FT-20418",
    placedDaysAgo: 6,
    placedTime: "09:20",
    lines: [
      {
        productId: "indigo-adire-kaftan",
        size: null,
        measurements: { ...MEASURED },
        colour: "Deep indigo",
        note: "Slightly longer sleeves, please",
        qty: 1,
      },
      { productId: "kente-trim-two-piece", size: "M", measurements: null, colour: "Gold and green", note: "", qty: 1 },
    ],
    stages: {
      "yinka-adeyemi": {
        kind: "making",
        milestones: { accepted: { day: 1, time: "08:10" } },
        updates: [
          {
            at: { day: 1, time: "16:30" },
            text: "Measurements look good. Cloth is cut and tied for the first dip.",
            tones: ["bg-[#E7DCC8]", "bg-[#6E2434]"],
          },
          {
            at: { day: 2, time: "18:05" },
            text: "First dye bath done — it comes out green and turns blue in the air.",
            tones: ["bg-[#2C3E6B]", "bg-[#1F2A5C]"],
          },
          {
            at: { day: 4, time: "17:40" },
            text: "The second dye bath is done and drying. I've lengthened the sleeves by 3cm as you asked — cutting starts on Friday.",
            tones: ["bg-[#C9AE8E]", "bg-[#6E2434]"],
          },
        ],
      },
      "kofi-ampah-studio": {
        kind: "shipped",
        milestones: {
          accepted: { day: 0, time: "15:00" },
          done: { day: 1, time: "11:00" },
          shipped: { day: 2, time: "14:05" },
        },
        tracking: "8841 2093 557",
        events: [
          { at: { day: 2, time: "14:05" }, text: "Picked up from Kofi in Kumasi" },
          { at: { day: 5, time: "21:40" }, text: "Departed Accra hub" },
          { at: { day: 6, time: "06:12" }, text: "Cleared customs — Heathrow" },
        ],
        eta: { day: 7 },
      },
    },
  },
  {
    id: "FT-20377",
    placedDaysAgo: 14,
    placedTime: "19:45",
    lines: [{ productId: "leather-tote", size: null, measurements: null, colour: null, note: "", qty: 1 }],
    stages: {
      "wanjiru-leather": {
        kind: "delivered",
        milestones: {
          accepted: { day: 1, time: "09:00" },
          done: { day: 7, time: "15:00" },
          shipped: { day: 8, time: "10:30" },
          delivered: { day: 14, time: "10:42" },
        },
      },
    },
  },
  {
    id: "FT-20402",
    placedDaysAgo: 9,
    placedTime: "12:10",
    lines: [
      { productId: "aso-oke-wrap-dress", size: "M", measurements: null, colour: "Blue and wine", note: "", qty: 1 },
      { productId: "bolga-basket", size: null, measurements: null, colour: null, note: "", qty: 1 },
    ],
    stages: {
      "yinka-adeyemi": {
        kind: "late",
        milestones: { accepted: { day: 1, time: "07:55" } },
        updates: [
          {
            at: { day: 3, time: "17:20" },
            text: "Strips are woven and the indigo panels are in their first dip.",
            tones: ["bg-[#1F4E79]", "bg-[#2C3E6B]"],
          },
        ],
        noticeAt: { day: 9, time: "08:30" },
        reason:
          "The rains slowed the indigo drying — I won't rush it and risk the colour running.",
        newWindow: { minDays: 20, maxDays: 22 },
      },
      "akosua-mensah": {
        kind: "declined",
        milestones: {},
        at: { day: 0, time: "15:40" },
        message:
          "So sorry — the last large basket sold at the market this morning before I could update the listing.",
      },
    },
  },
  {
    id: "FT-20441",
    placedDaysAgo: 1,
    placedTime: "23:30",
    lines: [
      { productId: "adire-kimono-jacket", size: null, measurements: { ...MEASURED }, colour: null, note: "", qty: 1 },
      { productId: "gele-headwrap", size: null, measurements: null, colour: null, note: "", qty: 1 },
    ],
    stages: {
      "adaeze-crochet": { kind: "confirming", milestones: {} },
      "fatima-bello-beads": {
        kind: "packing",
        milestones: { accepted: { day: 1, time: "07:15" } },
        pickup: { at: { day: 2 }, window: "10:00–14:00" },
      },
    },
  },
  {
    id: "FT-20310",
    placedDaysAgo: 40,
    placedTime: "21:05",
    lines: [
      { productId: "wool-throw", size: null, measurements: null, colour: null, note: "", qty: 1 },
      { productId: "shea-body-butter", size: null, measurements: null, colour: null, note: "", qty: 2 },
    ],
    stages: {
      "adaeze-crochet": {
        kind: "confirmed",
        milestones: {
          accepted: { day: 1, time: "10:00" },
          done: { day: 7, time: "12:00" },
          shipped: { day: 7, time: "16:00" },
          delivered: { day: 11, time: "13:20" },
        },
        confirmedAt: { day: 11, time: "19:00" },
        review: { stars: 5, text: "Even softer than it looks. Adaeze matched the colours to my sofa." },
      },
      "akosua-mensah": {
        kind: "confirmed",
        milestones: {
          accepted: { day: 0, time: "22:00" },
          done: { day: 1, time: "10:00" },
          shipped: { day: 1, time: "15:00" },
          delivered: { day: 6, time: "11:05" },
        },
        confirmedAt: { day: 6, time: "18:30" },
      },
    },
  },
  {
    id: "FT-20288",
    placedDaysAgo: 55,
    placedTime: "13:00",
    lines: [{ productId: "leather-mule-sandals", size: "UK 6", measurements: null, colour: null, note: "", qty: 1 }],
    stages: {
      "wanjiru-leather": {
        kind: "confirmed",
        milestones: {
          accepted: { day: 0, time: "16:00" },
          done: { day: 1, time: "12:00" },
          shipped: { day: 1, time: "17:00" },
          delivered: { day: 7, time: "09:50" },
        },
        confirmedAt: { day: 7, time: "20:15" },
        review: { stars: 5, text: "Fits perfectly, and the leather has already softened." },
      },
    },
  },
  {
    id: "FT-20366",
    placedDaysAgo: 25,
    placedTime: "08:40",
    lines: [{ productId: "carved-figure", size: null, measurements: null, colour: null, note: "", qty: 1 }],
    stages: {
      "kwame-osei": {
        kind: "declined",
        milestones: {},
        at: { day: 1, time: "09:10" },
        message: "I'm sorry — the ebony block split while I was carving, and I won't send a piece that might crack.",
      },
    },
  },
];
